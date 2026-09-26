#!/usr/bin/env python3
"""Phase 5 audit, point ⑦: fetch more Japanese Wikipedia articles, or search it.

    python3 scripts/audit/jawiki.py 写像の合成 片側極限 ...     # fetch the articles into corpus/ref/jp/wiki/ (then refgrep.py jp sees them)
    python3 scripts/audit/jawiki.py --search 追い出しの原理 ...  # exact-phrase search: hit count and the first titles

Uses the fetcher of the conventions (scripts/ledger/fetch_jp_refs.py): the same
timeout, retry limit, cache and index. Searches are cached in
corpus/ref/jp/wiki/_audit_search.json. Only titles and counts are printed.
"""
import json
import os
import sys
import time
import urllib.parse

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ledger"))
import fetch_jp_refs as jp  # noqa: E402


def search(phrases):
    path = os.path.join(jp.WIKI, "_audit_search.json")
    cache = json.load(open(path, encoding="utf-8")) if os.path.exists(path) else {}
    todo = [p for p in phrases if p not in cache]
    for i, p in enumerate(todo, 1):
        q = urllib.parse.urlencode({"action": "query", "list": "search", "srsearch": f'"{p}"', "srlimit": 10,
                                    "srinfo": "totalhits", "format": "json", "formatversion": 2})
        data = json.loads(jp.open_url(f"https://ja.wikipedia.org/w/api.php?{q}", p))
        cache[p] = {"total": data.get("query", {}).get("searchinfo", {}).get("totalhits", 0),
                    "titles": [r["title"] for r in data.get("query", {}).get("search", [])]}
        print(f"  {i}/{len(todo)}")
        time.sleep(jp.PAUSE)
    os.makedirs(jp.WIKI, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=1)
    for p in phrases:
        print(f"{p}: {cache[p]['total']} 件 — {', '.join(cache[p]['titles'])}")


def main():
    args = sys.argv[1:]
    if args and args[0] == "--search":
        search(args[1:])
        return
    jp.JA_WIKI_TITLES[:] = args
    jp.fetch_wiki()


if __name__ == "__main__":
    main()
