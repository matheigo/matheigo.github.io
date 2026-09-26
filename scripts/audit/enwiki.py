#!/usr/bin/env python3
"""Phase 5 audit: does an English Wikipedia article define a term in its body?

    python3 scripts/audit/enwiki.py "Mathematical induction" "base case" "induction hypothesis"
    python3 scripts/audit/enwiki.py --depth "Triangle center" "Pivot element"     # category depth (wikicat.py rule, 4 levels)

DECISIONS (Phase 5 監査 セッション 2, 3): an English Wikipedia article whose body
defines a term - the term in bold ('''…''') or as a section heading - may be
cited as a reference source, naming the article and the section. The article
must sit under a math category within 4 levels (wikicat.py), like an article
name used as a headword (SOURCES.md, 規則 2 の参照の順 4).

The wikitext is fetched with the MediaWiki API (timeout, retry limit, cache in
corpus/ref/en-wiki/, gitignored with the rest of corpus/) and searched here.
Only the article title, section headings and counts are printed; the body is
never written to the repository (STYLE 原則 5).
"""
import json
import os
import re
import sys
import urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, "scripts", "ledger"))
import wikicat  # noqa: E402
from wikien import api  # noqa: E402  (timeout 30 s, 3 retries, User-Agent)

CACHE_DIR = os.path.join(ROOT, "corpus", "ref", "en-wiki")


def fetch(title):
    """Wikitext of the article `title` lands on (redirects followed); cached per title."""
    os.makedirs(CACHE_DIR, exist_ok=True)
    path = os.path.join(CACHE_DIR, urllib.parse.quote(title, safe="") + ".json")
    if os.path.exists(path):
        return json.load(open(path, encoding="utf-8"))
    d = api("en", {"prop": "revisions|pageprops", "rvprop": "content", "rvslots": "main", "ppprop": "disambiguation",
                   "redirects": "1", "titles": title})
    q = d.get("query", {})
    pages = q.get("pages", [])
    page = pages[0] if pages else {}
    redirect = next((r for r in q.get("redirects", []) if r["from"] == title), None)
    out = {
        "asked": title,
        "title": page.get("title"),
        "missing": bool(page.get("missing")),
        "disambig": "disambiguation" in (page.get("pageprops") or {}),
        "fragment": redirect.get("tofragment") if redirect else None,
        "text": ((page.get("revisions") or [{}])[0].get("slots", {}).get("main", {}).get("content", "")) if not page.get("missing") else "",
    }
    with open(path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False)
    return out


def sections(text):
    """[(heading or "(lead)", body)] in article order."""
    out = []
    head = "(lead)"
    buf = []
    for line in text.split("\n"):
        m = re.match(r"^(={2,})\s*(.*?)\s*\1\s*$", line)
        if m:
            out.append((head, "\n".join(buf)))
            head, buf = m.group(2), []
        else:
            buf.append(line)
    out.append((head, "\n".join(buf)))
    return out


def pattern(term):
    """The term as a case-insensitive regex; a plural / -ing / -ed on any word, hyphen or space."""
    words = re.findall(r"[A-Za-z0-9'’]+", term)
    return re.compile(r"(?<![A-Za-z])" + r"[\s\-]+".join(re.escape(w) + r"(?:s|es|ing|ed)?" for w in words) + r"(?![A-Za-z])", re.I)


def find(article, term):
    """Where `term` is defined in the article: bold in a section, or a section heading. Also plain mentions per section."""
    pat = pattern(term)
    bold, headings, mentions = [], [], []
    for head, body in sections(article["text"]):
        if pat.search(head):
            headings.append(head)
        for m in re.finditer(r"'''(.+?)'''", body):
            if pat.search(m.group(1)):
                bold.append(head)
                break
        n = len(pat.findall(body))
        if n:
            mentions.append((head, n))
    return {"bold": bold, "headings": headings, "mentions": mentions}


def main():
    args = sys.argv[1:]
    if args and args[0] == "--depth":
        titles = args[1:]
        cache = wikicat.load_cache()
        depth = wikicat.depth_to_root("en", titles, cache)
        for t in titles:
            print(f"{t}: depth {depth[t]} (math within {wikicat.MAX_DEPTH}: {'yes' if depth[t] is not None else 'no'})")
        return
    title, terms = args[0], args[1:]
    a = fetch(title)
    if a["missing"]:
        print(f"{title}: no article")
        return
    print(f"{title} -> 「{a['title']}」" + (f" (redirect to section {a['fragment']})" if a["fragment"] else "") + (" DISAMBIGUATION" if a["disambig"] else ""))
    print("  sections: " + " / ".join(h for h, _ in sections(a["text"]) if h != "(lead)")[:1500])
    for t in terms:
        r = find(a, t)
        print(f"  {t}: bold in {r['bold'] or '—'}; heading {r['headings'] or '—'}; mentions " + (", ".join(f"{h} {n}" for h, n in r["mentions"][:8]) or "0"))


if __name__ == "__main__":
    main()
