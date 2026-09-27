#!/usr/bin/env python3
"""Phase 5 audit 6, decision 5 (audit 5 H-5): the terms whose headword is the name of an English Wikipedia article.

    python3 scripts/audit/wikipedia_heads.py      writes audits/checks/wikipedia-heads.md

The ③ fallback (STYLE 原則 1 ③; lib.ts settleUndecided) makes the name of the entry's English Wikipedia
math article the headword when the corpus and the references have no name for it. The rule holds only for
an article on the same concept (audit 4, decision 3; lib.ts WIKIPEDIA_NOT_SAME), and nothing checks that by
machine: universal-set's article "Universal set" was another concept (audit 5, batch 15). So the audit reads
each article (`python3 scripts/audit/enwiki.py "<article>" "<headword>"`) and checks that it defines the
entry's concept - verified entries too. An article on another concept goes into WIKIPEDIA_NOT_SAME.

Found from the flag corpus-reference-fallback whose note says the headword is the article's name.
show_batch.py prints the same rows as !WIKI.
"""
import csv
import datetime
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "audits", "checks", "wikipedia-heads.md")
NOTE = re.compile(r"見出しは Wikipedia の記事名 (.+?)（英語版「([^」]+)」、([^）]+)）")


def heads():
    """(collection, id) -> (headword as noted, article title, via) for every term whose headword is an article name."""
    out = {}
    for fn in sorted(os.listdir(os.path.join(ROOT, "data", "terms"))):
        d = json.load(open(os.path.join(ROOT, "data", "terms", fn), encoding="utf-8"))
        for f in d.get("flags", []):
            m = NOTE.search(f["note"]) if f["code"] == "corpus-reference-fallback" else None
            if m:
                out[("terms", d["id"])] = (m.group(1), m.group(2), m.group(3))
    return out


def main():
    batch = {}
    with open(os.path.join(ROOT, "audits", "phase5-order.csv"), encoding="utf-8") as f:
        for r in csv.DictReader(f):
            batch[(r["collection"], r["id"])] = r["batch"]
    rows = []
    for (c, i), (head, title, via) in heads().items():
        d = json.load(open(os.path.join(ROOT, "data", c, f"{i}.json"), encoding="utf-8"))
        rows.append((int(batch.get((c, i), "0") or 0), i, d["confidence"], d["en"]["term"], d["ja"]["term"], title, via))
    rows.sort()
    verified = sum(1 for r in rows if r[2] == "verified")
    lines = [
        "# 英語版 Wikipedia の記事名で見出しを決めた語（監査 6 の決定 5）", "",
        f"作成: {datetime.date.today().isoformat()} ／ `python3 scripts/audit/wikipedia_heads.py`。flag corpus-reference-fallback の note が「見出しは Wikipedia の記事名」の語。"
        "記事が見出しと同じ概念かを機械で確かめる方法は無いので、監査で記事を読む（`python3 scripts/audit/enwiki.py \"<記事>\" \"<見出し>\"`）。別の概念なら lib.ts `WIKIPEDIA_NOT_SAME` に理由付きで足して数え直す。", "",
        f"- 語: **{len(rows)}**（verified {verified}）", "",
        "| バッチ | id | confidence | en.term | ja.term | 記事 | 記事の見つけ方 |", "|---|---|---|---|---|---|---|",
    ]
    for b, i, conf, en, ja, title, via in rows:
        lines.append(f"| {b or ''} | {i} | {conf} | {en} | {ja} | {title} | {via} |")
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"{len(rows)} terms ({verified} verified) -> audits/checks/wikipedia-heads.md")


if __name__ == "__main__":
    main()
