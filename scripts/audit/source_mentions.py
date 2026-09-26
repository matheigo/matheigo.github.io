#!/usr/bin/env python3
"""Phase 5 audit (session 3): sources the text names that the entry's `sources` lack.

    python3 scripts/audit/source_mentions.py            -> audits/checks/source-mentions.md (and .json)
    python3 scripts/audit/source_mentions.py --verified  only verified entries

STYLE 追記欄: a claim names the source that says it ("学習指導要領解説（数学III）には…",
"OpenStax Algebra and Trigonometry は…", "日本語版 Wikipedia「級数」は…") and that source goes
into `sources`. The spot check of audit session 3 found entries whose text names a source
that `sources` does not hold (improper-integral names the 解説, limit-at-infinity names two
OpenStax books). This lists every such mention, per entry and field.

A mention is matched by name only (the claim itself is checked by the audit):
  学習指導要領解説 / 中学校… / 高等学校…   a 学習指導要領 … 解説 source (of that school if named)
  〔用語・記号〕                          a 〔用語・記号〕 source
  共通テスト / センター試験                a source whose title names the exam
  日本語版 Wikipedia「X」                  a 日本語版 Wikipedia「X」 source or a wikipedia-langlink with ja = X
  英語版 Wikipedia「X」                    an English Wikipedia source for X (URL) or a langlink with en = X
  OpenStax <book> / OpenStax              an OpenStax source of that book (any volume unless one is named) / any OpenStax
  CED / AP の CED / AP Statistics の CED  a Course and Exam Description source (of that course)
  IM / CK-12 / Nicholson / Levin          a source of that reference
A list of three or more references (CED・OpenStax・IM・CK-12, the rule's wording for the set
searched) and 「OpenStax の 6 冊」 are not mentions of one source. OpenStax is also the written
corpus: in a variants note or a sentence about 書き言葉・話し言葉・用例コーパス it reports the evidence,
and is not listed.
The corpus (MIT OCW, Khan Academy, YouTube, MICASE) is evidence, not a source: not listed.
"""
import glob
import json
import os
import re
import sys
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "audits", "checks", "source-mentions")

FIELDS = {
    "terms": lambda d: [("mapping_note", d.get("mapping_note")), ("definition_ja", d.get("definition_ja")), ("definition_en", d.get("definition_en"))]
    + [(f"pitfalls[{i}]", p) for i, p in enumerate(d.get("pitfalls") or [])]
    + [(f"en.variants[{i}].note", v.get("note")) for i, v in enumerate((d.get("en") or {}).get("variants") or [])],
    "symbols": lambda d: [(f"notes[{i}]", n) for i, n in enumerate(d.get("notes") or [])],
    "phrases": lambda d: [(f"notes[{i}]", n) for i, n in enumerate(d.get("notes") or [])]
    + [(f"variants[{i}].note", v.get("note")) for i, v in enumerate(d.get("variants") or [])],
    "conventions": lambda d: [("jp", d.get("jp")), ("us", d.get("us")), ("advice_ja", d.get("advice_ja"))],
}

BOOKS = ["Calculus Volume 1", "Calculus Volume 2", "Calculus Volume 3", "Calculus", "Precalculus", "Algebra and Trigonometry",
         "Prealgebra", "Elementary Algebra", "Intermediate Algebra", "Introductory Statistics"]


def titles(d):
    return [(s.get("type"), s.get("title") or "", s.get("url") or "", s.get("ja") or "", s.get("en") or "") for s in d.get("sources") or []]


def has(srcs, pred):
    return any(pred(t, ti, u, ja, en) for t, ti, u, ja, en in srcs)


# The rule's own wording names the set of references, not one source a claim rests on:
# 「用例コーパスと参照（CED・OpenStax・IM・CK-12）には…出てこない」「米国の高校課程（CED・OpenStax・IM・CK-12）では扱わない」
# 「CED・OpenStax・IM・CK-12 とも 0 件」「OpenStax の 6 冊にも出てこない」. These lists are skipped.
REFERENCE_SET = re.compile(r"(CED|OpenStax|IM|CK-12|Nicholson|Levin)(・(CED|OpenStax|IM|CK-12|Nicholson|Levin)){2,}|OpenStax の \d+ 冊")


CORPUS_TALK = re.compile(r"書き言葉|話し言葉|用例コーパス")


def mentions(text):
    """(key, label) for each source the text names."""
    text = REFERENCE_SET.sub("", text)
    out = []
    for m in re.finditer(r"(中学校|高等学校)?学習指導要領解説", text):
        out.append(("kaisetsu:" + (m.group(1) or ""), m.group(0)))
    if "〔用語・記号〕" in text:
        out.append(("yougo", "〔用語・記号〕"))
    for w in ("共通テスト", "センター試験"):
        if w in text:
            out.append(("exam", w))
    for m in re.finditer(r"日本語版 Wikipedia「([^」]+)」", text):
        out.append(("jawiki:" + m.group(1), m.group(0)))
    for m in re.finditer(r"英語版 Wikipedia「([^」]+)」", text):
        out.append(("enwiki:" + m.group(1), m.group(0)))
    for m in re.finditer(r"OpenStax(?: (" + "|".join(re.escape(b) for b in BOOKS) + r"))?(?:（([^）]*)）)?", text):
        book = m.group(1)
        inner = m.group(2) or ""
        named = [b for b in BOOKS if b != "Calculus" and b in inner.replace("・", " ")] if not book else []
        if book:
            out.append(("openstax:" + book, m.group(0)))
        elif named:
            for b in named:
                out.append(("openstax:" + b, "OpenStax " + b))
        else:
            out.append(("openstax:", "OpenStax"))
    for m in re.finditer(r"(AP Statistics の |AP Calculus の )?(?<![A-Za-z])CED(?![A-Za-z])", text):
        out.append(("ced:" + ("stats" if m.group(1) and "Statistics" in m.group(1) else ""), m.group(0)))
    for w, key in (("IM", "im"), ("CK-12", "ck12"), ("Nicholson", "nicholson"), ("Levin", "levin")):
        if re.search(r"(?<![A-Za-z])" + re.escape(w) + r"(?![A-Za-z0-9])", text):
            out.append((key, w))
    return out


def satisfied(key, srcs):
    kind, _, arg = key.partition(":")
    if kind == "kaisetsu":
        return has(srcs, lambda t, ti, *_: "学習指導要領" in ti and "解説" in ti and (not arg or arg in ti))
    if kind == "yougo":
        return has(srcs, lambda t, ti, *_: "〔用語・記号〕" in ti)
    if kind == "exam":
        return has(srcs, lambda t, ti, *_: "共通テスト" in ti or "センター試験" in ti)
    if kind == "jawiki":
        return has(srcs, lambda t, ti, u, ja, en: ti == f"日本語版 Wikipedia「{arg}」" or (t == "wikipedia-langlink" and ja == arg)
                   or urllib.parse.unquote(u).endswith("/" + arg.replace(" ", "_")))
    if kind == "enwiki":
        want = arg.replace(" ", "_")
        return has(srcs, lambda t, ti, u, ja, en: (t == "wikipedia-langlink" and en.split("#")[0] == arg)
                   or ("en.wikipedia.org/wiki/" in u and urllib.parse.unquote(u.split("/wiki/", 1)[1]).split("#")[0].replace(" ", "_") == want))
    if kind == "openstax":
        if not arg:
            return has(srcs, lambda t, ti, *_: "OpenStax" in ti)
        return has(srcs, lambda t, ti, *_: f"OpenStax {arg}" in ti)
    if kind == "ced":
        return has(srcs, lambda t, ti, *_: "Course and Exam Description" in ti and ("Statistics" in ti if arg == "stats" else True))
    names = {"im": "Illustrative Mathematics", "ck12": "CK-12", "nicholson": "Nicholson", "levin": "Levin"}
    return has(srcs, lambda t, ti, *_: names[kind] in ti)


def main():
    only_verified = "--verified" in sys.argv
    rows = []
    for c, fields in FIELDS.items():
        for f in sorted(glob.glob(os.path.join(ROOT, "data", c, "*.json"))):
            d = json.load(open(f, encoding="utf-8"))
            if only_verified and d.get("confidence") != "verified":
                continue
            srcs = titles(d)
            missing = {}
            for field, text in fields(d):
                if not text:
                    continue
                for sentence in re.split(r"(?<=。)", text):
                    corpus = ".variants[" in field or CORPUS_TALK.search(sentence)
                    for key, label in mentions(sentence):
                        # OpenStax is also the written corpus: a sentence about the corpus (書き言葉は OpenStax …)
                        # reports evidence, not what a textbook says
                        if corpus and key.startswith("openstax"):
                            continue
                        if not satisfied(key, srcs):
                            missing.setdefault(key, (label, []))[1].append(field)
            if missing:
                rows.append({"collection": c, "id": d["id"], "confidence": d.get("confidence"),
                             "missing": [{"source": k, "named": v[0], "fields": sorted(set(v[1]))} for k, v in sorted(missing.items())]})
    by_conf = {}
    for r in rows:
        by_conf[r["confidence"]] = by_conf.get(r["confidence"], 0) + 1
    json.dump({"entries": len(rows), "byConfidence": by_conf, "rows": rows}, open(OUT + ".json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    lines = ["# 本文が名指しする資料で、出典（sources）に無いもの（Phase 5 監査 3）", "",
             "作成: `python3 scripts/audit/source_mentions.py`（規則は scripts/audit/source_mentions.py の説明）。主張が正しいかは見ない（それは監査）。", "",
             f"- 項目: **{len(rows)}**（" + "・".join(f"{k} {v}" for k, v in sorted(by_conf.items())) + "）", "",
             "| コレクション | id | confidence | 名指しされた資料 | 欄 |", "|---|---|---|---|---|"]
    for r in rows:
        for m in r["missing"]:
            lines.append(f"| {r['collection']} | {r['id']} | {r['confidence']} | {m['named']} | {'、'.join(m['fields'])} |")
    open(OUT + ".md", "w", encoding="utf-8").write("\n".join(lines) + "\n")
    print(f"{len(rows)} entries with a named source missing from sources {by_conf} -> audits/checks/source-mentions.md")


if __name__ == "__main__":
    main()
