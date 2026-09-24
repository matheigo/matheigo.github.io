"""Is a Wikipedia article filed under mathematics?

For every wiki_ja / wiki_en title in ledger/terms.csv, walk the (non-hidden)
category graph upward and record the shortest distance to a math root category.
A langlink is used as a source only when the article sits under a math root
within MAX_DEPTH (docs/DECISIONS.md, Phase 1 fix).

    python3 scripts/ledger/wikicat.py            # writes scripts/ledger/wiki_cat.json

The API responses are cached in scripts/ledger/wiki_cat_cache.json (gitignored).
"""
import csv
import json
import os
import sys
import time
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
CACHE = os.path.join(HERE, "wiki_cat_cache.json")
OUT = os.path.join(HERE, "wiki_cat.json")

# Statistics is filed beside mathematics, not under it, on both wikis.
ROOTS = {
    "ja": {"Category:数学", "Category:統計学", "Category:数理科学"},
    "en": {"Category:Mathematics", "Category:Statistics", "Category:Mathematical sciences"},
}
MAX_DEPTH = int(os.environ.get("WIKICAT_DEPTH", "4"))
UA = "MathEigo-ledger/0.1 (https://github.com/matheigo/matheigo.github.io)"


def load_cache():
    if os.path.exists(CACHE):
        return json.load(open(CACHE, encoding="utf-8"))
    return {}


def api(lang, params):
    params = {"format": "json", "formatversion": "2", **params}
    url = f"https://{lang}.wikipedia.org/w/api.php?" + urllib.parse.urlencode(params)
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except Exception as e:  # noqa: BLE001 - retry any network failure
            time.sleep(2 * (attempt + 1))
            err = e
    raise RuntimeError(f"{lang} api failed: {err}")


def parents(lang, titles, cache):
    """title -> list of non-hidden parent categories (follows redirects)."""
    todo = [t for t in titles if f"{lang}:{t}" not in cache]
    for i in range(0, len(todo), 50):
        batch = todo[i : i + 50]
        cont = {}
        found = {t: [] for t in batch}
        alias = {}
        while True:
            d = api(lang, {"action": "query", "prop": "categories", "clshow": "!hidden",
                           "cllimit": "max", "redirects": "1", "titles": "|".join(batch), **cont})
            q = d.get("query", {})
            for n in q.get("normalized", []) + q.get("redirects", []):
                alias[n["to"]] = alias.get(n["from"], n["from"])
            for p in q.get("pages", []):
                src = alias.get(p["title"], p["title"])
                src = alias.get(src, src)
                found.setdefault(src, []).extend(c["title"] for c in p.get("categories", []))
            if "continue" not in d:
                break
            cont = d["continue"]
        for t in batch:
            cache[f"{lang}:{t}"] = found.get(t, [])
        print(f"\r  {lang} {min(i + 50, len(todo))}/{len(todo)}", end="", flush=True)
    if todo:
        print()
    return {t: cache[f"{lang}:{t}"] for t in titles}


def depth_to_root(lang, titles, cache):
    """Shortest upward distance from each article to a root (None if > MAX_DEPTH)."""
    best = {t: None for t in titles}
    frontier = {t: {t} for t in titles}  # article -> current category layer
    seen = {t: set() for t in titles}
    for depth in range(1, MAX_DEPTH + 1):
        layer = sorted({c for t in titles if best[t] is None for c in frontier[t]})
        if not layer:
            break
        up = parents(lang, layer, cache)
        for t in titles:
            if best[t] is not None:
                continue
            nxt = set()
            for c in frontier[t]:
                nxt.update(up.get(c, []))
            nxt -= seen[t]
            seen[t] |= nxt
            if nxt & ROOTS[lang]:
                best[t] = depth
            frontier[t] = nxt
        json.dump(cache, open(CACHE, "w", encoding="utf-8"), ensure_ascii=False)
    return best


def main():
    rows = list(csv.DictReader(open(os.path.join(ROOT, "ledger", "terms.csv"), encoding="utf-8")))
    cache = load_cache()
    out = {}
    for lang, col in (("ja", "wiki_ja"), ("en", "wiki_en")):
        titles = sorted({r[col] for r in rows if r[col]})
        print(f"{lang}: {len(titles)} articles")
        out[lang] = depth_to_root(lang, titles, cache)
    json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1, sort_keys=True)
    for lang in out:
        n = sum(1 for v in out[lang].values() if v is not None)
        print(f"{lang}: {n}/{len(out[lang])} under a math root within {MAX_DEPTH}")


if __name__ == "__main__":
    sys.exit(main())
