"""The last step of rule 2: the English Wikipedia article name (DECISIONS,
Phase 2 幾何・離散の単元 2).

    python3 scripts/ledger/wikihead.py        # writes scripts/ledger/wiki_head.json

When no reference (CED, OpenStax / IM, Nicholson / Levin) calls a ③ anything,
its headword is the name of the English Wikipedia article it lands on:

  ja  the en langlink of the entry's ja article: the entry's own
      wikipedia-langlink source (checked by crosscheck), else ja.term on
      ja.wikipedia when it is an article of its own (not a redirect to
      another article: 外心 -> 外接円 names the circle, not the point) that
      sits under a math category within 4 levels (the Phase 1 rule, wikicat.py)
  en  en.term on en.wikipedia after redirects. A redirect to a section of
      another article (Excenter -> Incircle and excircles#...) does not name
      the concept and is not used; nor is a disambiguation page

Either way the en article must sit under a math category within 4 levels
(the same rule as the ja side). count.ts reads the result offline.

For every terms entry this asks, 50 titles per request, following the API's
`continue`: ja.term -> ja article and en langlink (entries without a
wikipedia-langlink source), every en title -> en article after redirects
(with the section a redirect points to, and whether it is a disambiguation
page), and the category depth of every article found (wikicat.depth_to_root,
cached in wiki_cat_cache.json). Answers are cached per title in
scripts/ledger/wiki_head_cache.json (gitignored); a re-run asks only for
titles not cached yet. Every request has a timeout and a retry limit;
progress is printed as done/total. Only titles are kept.
"""
import glob
import json
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
import wikicat  # noqa: E402
from wikien import BAD, BATCH, PAUSE, api  # noqa: E402

CACHE = os.path.join(HERE, "wiki_head_cache.json")
OUT = os.path.join(HERE, "wiki_head.json")


def save(cache):
    tmp = CACHE + ".tmp"
    json.dump(cache, open(tmp, "w", encoding="utf-8"), ensure_ascii=False)
    os.replace(tmp, CACHE)


def lookup(lang, key, titles, cache, params, parse):
    """title -> parse(page, fragment). Batches of 50, following `continue`."""
    todo = [t for t in titles if f"{key}:{t}" not in cache]
    total, done, failed = len(titles), len(titles) - len(todo), 0
    print(f"[wikihead] {key}: {total} titles, {done} cached, {len(todo)} to fetch", flush=True)
    for i in range(0, len(todo), BATCH):
        batch = todo[i:i + BATCH]
        try:
            pages, norm, redir, cont = {}, {}, {}, {}
            while True:
                d = api(lang, {**params, "redirects": "1", "titles": "|".join(batch), **cont})
                q = d.get("query", {})
                norm.update({n["from"]: n["to"] for n in q.get("normalized", [])})
                redir.update({r["from"]: (r["to"], r.get("tofragment")) for r in q.get("redirects", [])})
                for p in q.get("pages", []):
                    pages.setdefault(p["title"], {}).update(p)
                if "continue" not in d:
                    break
                cont = d["continue"]
            for t in batch:
                title, fragment, seen = norm.get(t, t), None, set()
                while title in redir and title not in seen:
                    seen.add(title)
                    title, fragment = redir[title][0], redir[title][1] or fragment
                cache[f"{key}:{t}"] = parse(pages.get(title), fragment)
        except RuntimeError as e:
            failed += len(batch)
            print(f"  batch skipped ({e}); re-run to fetch it", flush=True)
        save(cache)
        done += len(batch)
        print(f"[wikihead] {key} {done}/{total}", flush=True)
        time.sleep(PAUSE)
    return failed


def parse_ja(p, _fragment):
    if not p or p.get("missing") or p.get("invalid"):
        return {"page": None, "en": None}
    ll = p.get("langlinks") or []
    return {"page": p["title"], "en": ll[0]["title"] if ll else None}


def parse_en(p, fragment):
    if not p or p.get("missing") or p.get("invalid"):
        return {"page": None}
    out = {"page": p["title"]}
    if fragment:
        out["fragment"] = fragment
    if "disambiguation" in (p.get("pageprops") or {}):
        out["disambig"] = True
    return out


def main():
    entries = [json.load(open(f, encoding="utf-8")) for f in sorted(glob.glob(os.path.join(ROOT, "data", "terms", "*.json")))]
    cache = json.load(open(CACHE, encoding="utf-8")) if os.path.exists(CACHE) else {}
    failed = 0

    # ja side: entries without a wikipedia-langlink source ask ja.term.
    own = {}
    for e in entries:
        s = next((s for s in e.get("sources", []) if s.get("type") == "wikipedia-langlink" and s.get("en")), None)
        if s:
            own[e["id"]] = s["en"]
    ja_titles = sorted({e["ja"]["term"] for e in entries if e["id"] not in own and not (BAD & set(e["ja"]["term"]))})
    failed += lookup("ja", "ja", ja_titles, cache, {"prop": "langlinks", "lllang": "en", "lllimit": "max"}, parse_ja)
    ja_pages = sorted({cache[f"ja:{t}"]["page"] for t in ja_titles if cache.get(f"ja:{t}", {}).get("page")})

    # en side: every en.term and every ja langlink target.
    en_titles = set(own.values()) | {e["en"]["term"] for e in entries}
    en_titles |= {cache[f"ja:{t}"]["en"] for t in ja_titles if cache.get(f"ja:{t}", {}).get("en")}
    en_titles = sorted(t for t in en_titles if t.strip() and not (BAD & set(t)))
    failed += lookup("en", "en", en_titles, cache, {"prop": "pageprops", "ppprop": "disambiguation"}, parse_en)
    en_pages = sorted({cache[f"en:{t}"]["page"] for t in en_titles if cache.get(f"en:{t}", {}).get("page")})

    # Category depth of every article found (wikicat's cache and rule: 4 levels).
    cat_cache = wikicat.load_cache()
    print(f"[wikihead] category depth: ja {len(ja_pages)} / en {len(en_pages)} articles (max {wikicat.MAX_DEPTH})", flush=True)
    depth = {"ja": wikicat.depth_to_root("ja", ja_pages, cat_cache), "en": wikicat.depth_to_root("en", en_pages, cat_cache)}

    out = {
        "fetched": time.strftime("%Y-%m-%d"),
        "max_depth": wikicat.MAX_DEPTH,
        "entries": {},
    }
    for e in entries:
        row = {}
        if e["id"] in own:
            row["ja"] = {"source": True, "en": own[e["id"]]}
        else:
            j = cache.get(f"ja:{e['ja']['term']}") or {}
            if j.get("page"):
                row["ja"] = {"term": e["ja"]["term"], "page": j["page"], "depth": depth["ja"].get(j["page"]), "en": j.get("en")}
        if row.get("ja", {}).get("en"):
            a = cache.get(f"en:{row['ja']['en']}") or {}
            row["ja"]["article"] = a.get("page")
            row["ja"]["article_depth"] = depth["en"].get(a.get("page")) if a.get("page") else None
            if a.get("fragment"):
                row["ja"]["fragment"] = a["fragment"]
            if a.get("disambig"):
                row["ja"]["disambig"] = True
        a = cache.get(f"en:{e['en']['term']}") or {}
        if a.get("page"):
            row["en"] = {"page": a["page"], "depth": depth["en"].get(a["page"])}
            if a.get("fragment"):
                row["en"]["fragment"] = a["fragment"]
            if a.get("disambig"):
                row["en"]["disambig"] = True
        if row:
            out["entries"][e["id"]] = row
    json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1, sort_keys=True)
    usable = sum(1 for r in out["entries"].values() if headword(r))
    print(f"[wikihead] {len(out['entries'])}/{len(entries)} entries have an article; {usable} usable"
          f"{f', {failed} titles not fetched (re-run)' if failed else ''} -> {os.path.relpath(OUT, ROOT)}", flush=True)
    return 1 if failed else 0


def headword(row):
    """The article that names the entry, as count.ts reads it (for the summary)."""
    j = row.get("ja") or {}
    if j.get("article") and not j.get("disambig") and not j.get("fragment") and j.get("article_depth") is not None \
            and (j.get("source") or (j.get("depth") is not None and j.get("page") == j.get("term"))):
        return j["article"]
    e = row.get("en") or {}
    if e.get("page") and not e.get("fragment") and not e.get("disambig") and e.get("depth") is not None:
        return e["page"]
    return None


if __name__ == "__main__":
    sys.exit(main())
