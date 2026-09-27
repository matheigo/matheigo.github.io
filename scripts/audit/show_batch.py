#!/usr/bin/env python3
"""Phase 5 audit: print the entries of one batch in a compact form for reading.

    python3 scripts/audit/show_batch.py <batch-number>      # the batch's rows of audits/phase5-order.csv
    python3 scripts/audit/show_batch.py --ids terms/limit,symbols/x

Each entry is shown with the results of the pre-audit checks that concern it
(audits/checks/: copy-overlap, jp-claims, us-claims, and the reference names judged
to be the entry's concept but missing from en / alt / variants, reference-theorem-names),
so that points ⑤ and ⑦ of the audit can be read next to the text. Prints to the terminal only.
"""
import csv
import json
import os
import re
import sys

from wikipedia_heads import heads as wikipedia_heads

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CHECKS = os.path.join(ROOT, "audits", "checks")


def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def checks():
    copy = {}
    for s in load(os.path.join(CHECKS, "copy-overlap.json"))["spans"]:
        copy.setdefault((s["collection"], s["id"]), []).append(s)
    jp = {}
    for c in load(os.path.join(CHECKS, "jp-claims.json"))["claims"]:
        jp.setdefault((c["collection"], c["id"]), []).append(c)
    us = {}
    u = load(os.path.join(CHECKS, "us-claims.json"))
    for k in ("noReference", "entryHasReference"):
        for c in u[k]:
            us.setdefault((c["collection"], c["id"]), []).append((k, c))
    # reference names judged to be the entry's concept but absent from en / alt / variants (audit 4, decision 1)
    ref = {}
    names = os.path.join(CHECKS, "reference-theorem-names.json")
    if os.path.exists(names):
        for r in load(names)["names"]:
            j = r.get("judged") or {}
            if j.get("id") and j["id"] not in r["matched"]:
                ref.setdefault(("terms", j["id"]), []).append(r)
    return copy, jp, us, ref


def top(counts, n=4):
    items = sorted(counts.items(), key=lambda kv: -kv[1])[:n]
    return ", ".join(f"{k} {v}" for k, v in items)


def show(collection, id_, copy, jp, us, ref=None):
    d = load(os.path.join(ROOT, "data", collection, f"{id_}.json"))
    p = print
    p("=" * 100)
    if collection == "terms":
        en = d["en"]
        p(f"[{id_}] {d['ja']['term']}（{d['ja']['reading']}） alt={d['ja'].get('alt')}  pos={d['pos']}  mapping={d['mapping']}")
        p(f"  en: {en['term']}  reg={en.get('register')}  alt={en.get('alt')}  uk={en.get('uk')}")
        for v in en.get("variants", []):
            p(f"   var[{v['register']}] {v['term']} — {v.get('note')}")
        p(f"  level: {d['level']}  domains={d['domains']}")
        if d.get("mapping_note"):
            p(f"  MAP: {d['mapping_note']}")
        p(f"  DJ: {d['definition_ja']}")
        p(f"  DE: {d['definition_en']}")
        if d.get("latex"):
            p(f"  TeX: {d['latex']}   /  {d.get('spoken_en')}")
        for x in d.get("examples", []):
            p(f"  EX[{x['register']}] {x['en']}  ／ {x['ja']}")
        for x in d.get("collocations", []):
            p(f"  CO {x['en']} ／ {x['ja']}")
        for i, x in enumerate(d.get("pitfalls", [])):
            p(f"  PF{i}: {x}")
        p(f"  rel: {d.get('related')}")
    elif collection == "symbols":
        p(f"[{id_}] {d['latex']}  {d['name_ja']} ／ {d['name_en']}  cat={d.get('category')} term_ref={d.get('term_ref')}")
        for s in d["spoken_en"]:
            p(f"  say[{s['register']}] {s['text']}")
        p(f"  ja: {d['spoken_ja']}   level: {d['level']}  related={d.get('related')}")
        for i, x in enumerate(d.get("notes", [])):
            p(f"  N{i}: {x}")
    elif collection == "phrases":
        p(f"[{id_}] ({d['situation']}) {d['intent']}  reg={d['register']}")
        p(f"  EN: {d['en']}")
        p(f"  JA: {d['ja']}")
        for v in d.get("variants", []):
            p(f"   var[{v['register']}] {v['en']}" + (f" — {v['note']}" if v.get("note") else ""))
        for i, x in enumerate(d.get("notes", [])):
            p(f"  N{i}: {x}")
    else:
        p(f"[{id_}] {d['title_ja']} ／ {d['title_en']}  cat={d['category']} level={d['level']}")
        p(f"  JP: {d['jp']}")
        p(f"  US: {d['us']}")
        p(f"  ADV: {d['advice_ja']}")
        p(f"  terms={d.get('term_refs')} related={d.get('related')}")
    for s in d.get("sources", []):
        p("  SRC " + json.dumps(s, ensure_ascii=False))
    for f in d.get("flags", []):
        p(f"  FLAG {f['code']}: {f['note'][:400]}")
    ev = d.get("evidence")
    if ev:
        p(f"  EV spoken: {top(ev.get('spoken', {}))}")
        p(f"  EV written: {top(ev.get('written', {}))}")
        for k in ev:
            if k not in ("spoken", "written", "sources", "counted"):
                p(f"  EV {k}: {top(ev[k]) if isinstance(ev[k], dict) else ev[k]}")
    p(f"  conf={d['confidence']} reviewed={d.get('reviewed')}")
    for s in copy.get((collection, id_), []):
        p(f"  !COPY {s['field']} {s['lang']} {s['length']}: {s['span']}  <- {', '.join(list(s['sources'])[:5])}")
    for c in jp.get((collection, id_), []):
        p(f"  !JP {c['field']}: {c['sentence']}")
    for k, c in us.get((collection, id_), []):
        p(f"  !US({'参照なし' if k == 'noReference' else 'エントリに参照'}) {c['field']}: {c['sentence']}")
    # the headword is an English Wikipedia article's name: read the article (audit 6, decision 5)
    w = WIKI.get((collection, id_))
    if w:
        p(f"  !WIKI 見出しは記事名「{w[1]}」（{w[2]}）。記事を読んで同じ概念かを確かめる: python3 scripts/audit/enwiki.py \"{w[1]}\" \"{d['en']['term']}\"")
    # a ③ headword a reference settled: read the passages it rests on (audit 6, decision 9)
    for f in d.get("flags", []):
        m = re.search(r"見出しは (AP Calculus の CED|AP Statistics の CED|CED|OpenStax|IM|CK-12|Nicholson|Levin) の呼び方 (.+?)（", f["note"]) if f["code"] == "corpus-reference-fallback" else None
        if m:
            p(f"  !③REF 見出しは {m.group(1)} の呼び方。根拠の文脈を読む: pnpm corpus:probe -- --contexts \"{m.group(2).split(' | ')[0].lstrip('!')}\"")
    for r in (ref or {}).get((collection, id_), []):
        refs = "、".join(f"{l} {n}" for l, n in r["refs"].items())
        kind = "REF（関連）" if r["judged"].get("related") else "REF"
        # the match is by name only: the audit reads the reference's passage and checks that the theorem's content is the same (audit 5, decision 1)
        p(f"  !{kind} {r['name']}（{refs}）: {r['judged'].get('note', '')}  ※名前の一致は手がかり。参照のその箇所を読んで中身が同じかを確かめる")


WIKI = {}


def main():
    WIKI.update(wikipedia_heads())
    copy, jp, us, ref = checks()
    if sys.argv[1] == "--ids":
        ids = [x.split("/", 1) for x in sys.argv[2].split(",")]
    else:
        b = sys.argv[1]
        with open(os.path.join(ROOT, "audits", "phase5-order.csv"), encoding="utf-8") as f:
            ids = [(r["collection"], r["id"]) for r in csv.DictReader(f) if r["batch"] == b]
    for c, i in ids:
        show(c, i, copy, jp, us, ref)


if __name__ == "__main__":
    main()
