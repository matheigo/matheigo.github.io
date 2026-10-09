#!/usr/bin/env python3
"""Phase 5 audit (session 14, the user's decision 3): the subjects a sentence gives the 解説.

    python3 scripts/audit/kaisetsu_subjects.py            -> audits/checks/kaisetsu-subjects.md (and .json)
    python3 scripts/audit/kaisetsu_subjects.py --verified  only verified entries
    python3 scripts/audit/kaisetsu_subjects.py --find '二重根号' [-c 60]   each hit with its section (terminal only)

The Japanese side of decision 2 (reference_quotes.py). Batch 43 of audit 13 found two
conventions that put what the high-school 解説 says of 理数数学I (its chapter 2 of part 2,
「理数科の各科目」) on 数学I / 数学III (nested radicals, radical equations), and refgrep.py jp
does not show which chapter a hit is in (backlog 181). This lists every sentence of the text
fields (terms' definition_ja, mapping_note, pitfalls and variants' notes, symbols' and phrases'
notes, a convention's jp / us / advice_ja) and every source note that names the high-school
学習指導要領解説 together with a subject (数学I … 数学C, 数I …), and looks its keys up in the
解説 (corpus/ref/jp/kaisetsu-kou.txt), page by page:

  section    the part of the 解説 a page is in: 数学I … 数学C (part 1, chapter 2), 理数数学I /
             理数数学II / 理数数学特論 (part 2, chapter 2), the appendix's text of the course of
             study for each (付録 数学I …, 付録 理数数学I …), and the rest (総説, 第3章, 付録 総則 …)
  subjects   the subjects the sentence names, less those in the name of an exam paper
             (共通テスト 令和3年度 数学Ⅰ・数学Ａ …) and less 理数数学…
  keys       the 「…」 quotes of the sentence; a source note also gives its heading (数学I 集合と
             命題: → 集合と命題) and the words after the colon; with no quote, the entry's
             Japanese name (a term's ja.term and ja.alt, a symbol's name_ja, a convention's
             term_refs' ja.term)
  status     ok: a key is in a section of a subject named (一部が理数だけ when another key is found
             only in 理数 sections: a sentence may put a 理数 example on the subject). 理数だけ: the keys are found only in
             理数 sections (理数数学… and the 理数 part's 総説). 別の科目: found in another
             subject's section and not in one named. 総説だけ: found only outside the subject
             sections. 見つからない: no key in the 解説 (a key quoting another source, a formula
             pdftotext breaks, no key)

The status is a hint, not a verdict: the audit reads every row that is not ok. Rows read and
found right are kept in kaisetsu_subjects_checked.json (A: the 解説 says it in the subject named,
missed by the matching; B: the subject is not the 解説's, e.g. a level or an exam) and counted
apart; a sentence edited since is listed again. Whitespace is ignored and NFKC applied on both
sides (pdftotext breaks lines in the middle of words; Ⅰ is I). The 解説's text goes to no file.
"""
import glob
import json
import os
import re
import sys
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KAISETSU = os.path.join(ROOT, "corpus", "ref", "jp", "kaisetsu-kou.txt")
OUT = os.path.join(ROOT, "audits", "checks", "kaisetsu-subjects")
CHECKED = os.path.join(os.path.dirname(os.path.abspath(__file__)), "kaisetsu_subjects_checked.json")
SUBJECTS = ["数学I", "数学II", "数学III", "数学A", "数学B", "数学C"]
RISU = {"理数数学I", "理数数学II", "理数数学特論", "付録 理数数学I", "付録 理数数学II", "付録 理数数学特論", "理数編 総説"}


def norm(s):
    return unicodedata.normalize("NFKC", re.sub(r"\s+", "", s or ""))


# --- the 解説, page by page -------------------------------------------------------------
BODY = re.compile(r"第[1-7]節1(?:第2章(?:理数科の)?各科目)?性((?:理数)?数学(?:III|II|I|A|B|C|特論)|理数(?:物理|化学|生物|地学))格")
APPENDIX_SUBJECT = re.compile(r"(?:第[1-9]1?)?((?:理数)?数学(?:III|II|I|A|B|C|特論)|理数(?:物理|化学|生物|地学))目標")


def sections():
    """The normalized text of the 解説 and [(offset, section)] where each section begins."""
    pages = open(KAISETSU, encoding="utf-8").read().split("\f")
    text, marks, part, cur = "", [], 1, "前付"
    for i, page in enumerate(pages):
        p = norm(page)
        head = p[:90]
        new = None
        m = BODY.search(head)
        if m:
            new = m.group(1) if "数学" in m.group(1) else "理数（理科）"
        elif cur != "前付" and head.startswith("第2部主として専門学科"):
            part, new = 2, "理数編 総説"
        elif cur == "前付" and head.startswith("第1章総"):
            new = "数学編 総説"
        elif re.match(r"第3章1?各科目にわたる指導計画", head):
            new = "理数編 第3章" if part == 2 else "数学編 第3章"
        elif head.startswith("付録目次"):
            new = "付録 総則"
        elif head.startswith("高等学校学習指導要領第1款目第2章第4節数学"):
            new = "付録 数学I"
        elif head.startswith("高等学校学習指導要領第1款目第2章第5節理科"):
            new = "付録 理科"
        elif head.startswith("高等学校学習指導要領第1款目第3章第9節理数"):
            new = "付録 理数数学I"
        elif re.match(r"高等学校学習指導要領第1款目第2章第1[01]節", head):
            new = "付録 その他"
        elif head.startswith("中学校学習指導要領"):
            new = "付録 中学校"
        if new and new != cur:
            marks.append((len(text), new))
            cur = new
        if cur.startswith("付録 ") and ("数学" in cur or "理数" in cur):
            for m in APPENDIX_SUBJECT.finditer(p):
                name = m.group(1)
                marks.append((len(text) + m.start(), "付録 " + (name if "数学" in name else "理数（理科）")))
                cur = marks[-1][1]
        text += p
    found = {s for _, s in marks}
    missing = [s for s in SUBJECTS + ["理数数学I", "理数数学II", "理数数学特論"] if s not in found or "付録 " + s not in found]
    assert not missing, f"sections not found in the 解説: {missing}"
    return text, marks


def section_at(marks, pos):
    lo, hi = 0, len(marks) - 1
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if marks[mid][0] <= pos:
            lo = mid
        else:
            hi = mid - 1
    return marks[lo][1] if marks and marks[0][0] <= pos else "前付"


# --- the sentences ------------------------------------------------------------------------
FIELDS = {
    "terms": lambda d: [("definition_ja", d.get("definition_ja")), ("mapping_note", d.get("mapping_note"))]
    + [(f"pitfalls[{i}]", p) for i, p in enumerate(d.get("pitfalls") or [])]
    + [(f"en.variants[{i}].note", v.get("note")) for i, v in enumerate((d.get("en") or {}).get("variants") or [])],
    "symbols": lambda d: [(f"notes[{i}]", n) for i, n in enumerate(d.get("notes") or [])]
    + [(f"spoken_en[{i}].note", s.get("note")) for i, s in enumerate(d.get("spoken_en") or []) if isinstance(s, dict)],
    "phrases": lambda d: [(f"notes[{i}]", n) for i, n in enumerate(d.get("notes") or [])]
    + [(f"variants[{i}].note", v.get("note")) for i, v in enumerate(d.get("variants") or [])],
    "conventions": lambda d: [("jp", d.get("jp")), ("us", d.get("us")), ("advice_ja", d.get("advice_ja"))],
}
ROMAN = r"(?:III|II|I|A|B|C)(?![A-Za-z])"
SUBJECT_RE = re.compile(r"(?<!理数)数学(" + ROMAN + r")((?:[・,、と](?:数学)?" + ROMAN + r")*)|(?<![学数理])数(" + ROMAN + r")")
EXAM_SPANS = [
    re.compile(r"(?:大学入学)?(?:共通テスト|センター試験|大学入試センター)[(（][^)）]*[)）]"),
    re.compile(r"(?:令和|平成)[0-9]+年度[^、。()（）「」:：]*"),
    re.compile(r"(?:大学入学)?(?:共通テスト|センター試験)(?:本試験|追試験|第[0-9]日程)?数学[^、。()（）「」]*"),
]
CHU = re.compile(r"中学校(?:学習指導要領)?(?:\(平成29年告示\)|（平成29年告示）)?(?:の)?解説")


def subjects_of(s):
    t = norm(s)
    for r in EXAM_SPANS:
        t = r.sub("", t)
    t = t.replace("理数数学", "")
    out = []
    for m in SUBJECT_RE.finditer(t):
        if m.group(3):
            out.append("数学" + m.group(3))
            continue
        out.append("数学" + m.group(1))
        out += ["数学" + x for x in re.findall(ROMAN, m.group(2) or "")]
    return sorted(set(out), key=SUBJECTS.index)


def sentences(s):
    return [x for x in re.split(r"(?<=。)", s or "") if x.strip()]


def names(c, d, terms):
    if c == "terms":
        ja = d.get("ja") or {}
        return [ja.get("term")] + list(ja.get("alt") or [])
    if c == "symbols":
        return [d.get("name_ja")]
    if c == "conventions":
        return [((terms.get(t) or {}).get("ja") or {}).get("term") for t in d.get("term_refs") or []]
    return []


def keys_of(s, fallback, note=False):
    qs = [q for q in re.findall(r"「([^「」]+)」", s) if len(norm(q)) >= 2]
    if note:
        n = norm(s)
        m = re.match(r"(?:数学(?:III|II|I|A|B|C)[・,、]?)+([^:：]*)[:：](.*)", n)
        if m:
            if len(m.group(1)) >= 2:
                qs.append(m.group(1))
            qs += [x for x in re.split(r"[、,，・()（）「」]", m.group(2)) if len(x) >= 2]
    if not qs:
        qs = [x for x in fallback if x]
    out = []
    for q in qs:
        q = norm(q)
        if q and q not in out:
            out.append(q)
    return out


def find(words, ctx):
    text, marks = sections()
    for w in words:
        k = norm(w)
        hits = [m.start() for m in re.finditer(re.escape(k), text)]
        print(f"### {w}: {len(hits)}")
        for h in hits:
            print(f"  [{section_at(marks, h)}] …{text[max(0, h - ctx):h + len(k) + ctx]}…")


def main():
    if "--find" in sys.argv:
        args = sys.argv[sys.argv.index("--find") + 1:]
        ctx = 60
        if "-c" in args:
            i = args.index("-c"); ctx = int(args[i + 1]); del args[i:i + 2]
        return find(args, ctx)
    only_verified = "--verified" in sys.argv
    text, marks = sections()
    checked = {}
    if os.path.exists(CHECKED):
        for c in json.load(open(CHECKED, encoding="utf-8")):
            checked[(c["collection"], c["id"], c["field"], c["sentence"])] = c["class"]
    terms = {}
    for f in glob.glob(os.path.join(ROOT, "data", "terms", "*.json")):
        d = json.load(open(f, encoding="utf-8"))
        terms[d["id"]] = d
    rows = []
    for c in ("terms", "symbols", "phrases", "conventions"):
        for f in sorted(glob.glob(os.path.join(ROOT, "data", c, "*.json"))):
            d = json.load(open(f, encoding="utf-8"))
            if only_verified and d.get("confidence") != "verified":
                continue
            cands = []
            for field, s in FIELDS[c](d):
                for sent in sentences(s):
                    if "解説" in CHU.sub("", norm(sent)):
                        cands.append((field, sent, False))
            for i, src in enumerate(d.get("sources") or []):
                title = src.get("title") or ""
                if title.startswith("高等学校学習指導要領") and "解説" in title and src.get("note"):
                    cands.append((f"sources[{i}].note", src["note"], True))
            for field, sent, note in cands:
                subj = subjects_of(sent)
                if not subj:
                    continue
                keys = keys_of(sent, names(c, d, terms), note)
                hits = {}
                for k in keys:
                    secs = {}
                    for m in re.finditer(re.escape(k), text):
                        sec = section_at(marks, m.start())
                        secs[sec] = secs.get(sec, 0) + 1
                    hits[k] = secs
                found = {sec for secs in hits.values() for sec in secs}
                subject_secs = {s for s in found if s.replace("付録 ", "") in SUBJECTS}
                outside = {"数学編 総説", "前付"}
                risu_only = [k for k, secs in hits.items() if set(secs) - outside and all(x in RISU for x in set(secs) - outside)]
                if any(s.replace("付録 ", "") in subj for s in found):
                    status = "一部が理数だけ" if risu_only else "ok"
                elif found and found - {"数学編 総説", "前付"} and all(s in RISU for s in found - {"数学編 総説", "前付"}):
                    status = "理数だけ"
                elif subject_secs:
                    status = "別の科目"
                elif found:
                    status = "総説だけ"
                else:
                    status = "見つからない"
                key = (c, d["id"], field, sent.strip())
                if status != "ok" and key in checked:
                    status = "checked " + checked[key]
                rows.append({"collection": c, "id": d["id"], "confidence": d.get("confidence"), "field": field,
                             "subjects": subj, "status": status, "sentence": sent.strip(),
                             "hits": {k: v for k, v in hits.items()}})
    order = {"理数だけ": 0, "一部が理数だけ": 1, "別の科目": 2, "総説だけ": 3, "見つからない": 4, "checked A": 5, "checked B": 6, "ok": 7}
    rows.sort(key=lambda r: (order[r["status"]], r["collection"], r["id"], r["field"]))
    count = {}
    for r in rows:
        count[r["status"]] = count.get(r["status"], 0) + 1
    ver = sum(1 for r in rows if r["confidence"] == "verified" and r["status"] in ("理数だけ", "一部が理数だけ", "別の科目", "総説だけ", "見つからない"))
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump({"rows": len(rows), "status": count, "verifiedToRead": ver, "list": rows},
              open(OUT + ".json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    def where(h):
        parts = []
        for k, secs in h.items():
            s = "・".join(f"{sec} {n}" for sec, n in sorted(secs.items(), key=lambda x: -x[1])[:4]) or "0"
            parts.append(f"「{k[:24]}」{s}")
        return " ／ ".join(parts) or "鍵なし"

    lines = ["# 学習指導要領解説を主語にして科目名を書いた文と、解説のその箇所（Phase 5 監査 14 の前の決定 3）", "",
             "作成: `python3 scripts/audit/kaisetsu_subjects.py`（規則は scripts/audit/kaisetsu_subjects.py の説明）。"
             "高等学校学習指導要領解説を主語にして科目名（数学I〜C）を書いた文と解説の出典の note の鍵（「」の引用・節の名前・見出しの語）を、解説のページの節（数学I〜C、理数数学I・II・特論、付録の本文、総説ほか）で探す。"
             "ok 以外は誤りとは限らない（数式は pdftotext で崩れる、別の資料の引用、総説の表）。監査が 1 行ずつ読む。", "",
             f"- 行: **{len(rows)}**（" + "・".join(f"{k} {v}" for k, v in sorted(count.items(), key=lambda x: order[x[0]])) + "）",
             f"- verified で読む行（理数だけ・一部が理数だけ・別の科目・総説だけ・見つからない）: {ver}", "",
             "| 状態 | コレクション | id | confidence | 欄 | 科目 | 鍵と解説の節（件数） | 文 |", "|---|---|---|---|---|---|---|---|"]
    for r in rows:
        if r["status"] == "ok" or r["status"].startswith("checked"):
            continue
        sent = r["sentence"].replace("|", "｜")
        lines.append(f"| {r['status']} | {r['collection']} | {r['id']} | {r['confidence']} | {r['field']} | {'・'.join(r['subjects'])} | "
                     f"{where(r['hits']).replace('|', '｜')} | {sent[:140]}{'…' if len(sent) > 140 else ''} |")
    nchecked = count.get("checked A", 0) + count.get("checked B", 0)
    lines += ["", f"ok の {count.get('ok', 0)} 行と、監査が読んで正しいとした {nchecked} 行（kaisetsu_subjects_checked.json）は .json に。"]
    open(OUT + ".md", "w", encoding="utf-8").write("\n".join(lines) + "\n")
    print(f"{len(rows)} rows: {count}; verified to read {ver} -> {os.path.relpath(OUT, ROOT)}.md")


if __name__ == "__main__":
    main()
