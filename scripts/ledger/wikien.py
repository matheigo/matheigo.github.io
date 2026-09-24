"""Fetch what fix_phase1.py needs for the English check of `title:` rows.

    python3 scripts/ledger/wikien.py            # writes scripts/ledger/wiki_en.json

For every row whose headword is a redirect to a differently named ja article
(ja_check = title:), two lookups (docs/DECISIONS.md, Phase 1 修正 2):
  ja  the landing ja article -> its en langlink
  en  that langlink, and en.term (as written, then Title Case) -> the
      en.wikipedia article after redirects, and whether it is a disambiguation

The rows come from fix_phase1.transform(en_check=False), so this always asks
for exactly what the next fix_phase1.py run will look up. Responses are cached
per title in scripts/ledger/wiki_en_cache.json (gitignored); a re-run only
requests titles that are not cached yet. Every request has a timeout and a
retry limit; progress is printed as done/total.
"""
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import fix_phase1 as F  # noqa: E402

CACHE = os.path.join(HERE, "wiki_en_cache.json")
OUT = F.WIKI_EN
UA = "MathEigo-ledger/0.1 (https://github.com/matheigo/matheigo.github.io)"
TIMEOUT = 30  # seconds per request
MAX_RETRY = 3  # then give up on the batch and leave it uncached
PAUSE = 0.5  # between requests
BATCH = 50  # MediaWiki titles per query
BAD = set("#<>[]|{}")  # cannot be part of a page title


def api(lang, params):
    params = {"action": "query", "format": "json", "formatversion": "2", **params}
    url = f"https://{lang}.wikipedia.org/w/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    last = None
    for attempt in range(MAX_RETRY + 1):
        try:
            with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
                return json.load(r)
        except Exception as e:  # noqa: BLE001 - any network failure counts toward the limit
            last = e
            if attempt == MAX_RETRY:
                break
            wait = 5 * (attempt + 1)
            if isinstance(e, urllib.error.HTTPError) and e.code == 429:
                wait = max(wait, int(e.headers.get("Retry-After", "0") or 0))
            print(f"  retry {attempt + 1}/{MAX_RETRY} in {wait}s: {e}", flush=True)
            time.sleep(wait)
    raise RuntimeError(f"{lang} api gave up after {MAX_RETRY} retries: {last}")


def follow(title, q):
    """Input title -> page title, through normalisation and redirects."""
    for n in q.get("normalized", []):
        if n["from"] == title:
            title = n["to"]
    seen = set()
    redirects = {r["from"]: r["to"] for r in q.get("redirects", [])}
    while title in redirects and title not in seen:
        seen.add(title)
        title = redirects[title]
    return title


def run(lang, key, titles, cache, params, parse):
    todo = [t for t in titles if f"{key}:{t}" not in cache]
    total, done, failed = len(titles), len(titles) - len(todo), 0
    print(f"[wikipedia] {key}: {total} titles, {done} cached, {len(todo)} to fetch", flush=True)
    for i in range(0, len(todo), BATCH):
        batch = todo[i : i + BATCH]
        try:
            pages, q, cont = {}, {}, {}
            while True:
                d = api(lang, {**params, "titles": "|".join(batch), **cont})
                qq = d.get("query", {})
                for k in ("normalized", "redirects"):
                    q.setdefault(k, []).extend(qq.get(k, []))
                for p in qq.get("pages", []):
                    pages.setdefault(p["title"], {}).update(p)
                if "continue" not in d:
                    break
                cont = d["continue"]
            for t in batch:
                cache[f"{key}:{t}"] = parse(pages.get(follow(t, q)))
        except RuntimeError as e:
            failed += len(batch)
            print(f"  batch skipped ({e}); re-run to fetch it", flush=True)
        json.dump(cache, open(CACHE, "w", encoding="utf-8"), ensure_ascii=False)
        done += len(batch)
        print(f"[wikipedia] {key} {done}/{total}", flush=True)
        time.sleep(PAUSE)
    return failed


def parse_ja(p):
    if not p or p.get("missing") or p.get("invalid"):
        return None
    ll = p.get("langlinks") or []
    return ll[0]["title"].split("#")[0] if ll else None


def parse_en(p):
    if not p or p.get("missing") or p.get("invalid"):
        return {"page": None, "disambig": False}
    return {"page": p["title"], "disambig": "disambiguation" in (p.get("pageprops") or {})}


def main():
    rows, _, _, _ = F.transform(en_check=False)
    rows = F.title_rows(rows)
    cache = json.load(open(CACHE, encoding="utf-8")) if os.path.exists(CACHE) else {}
    print(f"[wikipedia] {len(rows)} title rows", flush=True)

    ja = sorted({r["wiki_ja"] for r in rows})
    failed = run("ja", "ja", ja, cache, {"prop": "langlinks", "lllang": "en", "lllimit": "max", "redirects": "1"},
                 parse_ja)

    en = set()
    for r in rows:
        en.update(F.en_lookups(r["en"]))
        ll = cache.get(f"ja:{r['wiki_ja']}")
        if ll:
            en.add(ll)
    bad = sorted(t for t in en if not t.strip() or BAD & set(t))
    for t in bad:
        cache[f"en:{t}"] = {"page": None, "disambig": False}
    failed += run("en", "en", sorted(en - set(bad)), cache,
                  {"prop": "pageprops", "ppprop": "disambiguation", "redirects": "1"}, parse_en)

    out = {
        "ja": {t: cache[f"ja:{t}"] for t in ja if f"ja:{t}" in cache},
        "en": {t: cache[f"en:{t}"] for t in sorted(en) if f"en:{t}" in cache},
    }
    json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1, sort_keys=True)
    print(f"[wikipedia] done: ja {len(out['ja'])}/{len(ja)}, en {len(out['en'])}/{len(en)}"
          f"{f', {failed} not fetched (re-run)' if failed else ''} -> scripts/ledger/wiki_en.json", flush=True)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
