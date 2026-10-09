#!/usr/bin/env python3
"""Phase 5 audit (session 13, the user's decision 2): English quotes put next to a reference's name.

    python3 scripts/audit/reference_quotes.py            -> audits/checks/reference-quotes.md (and .json)
    python3 scripts/audit/reference_quotes.py --verified  only verified entries

source_mentions.py checks that a reference the text names is in `sources`; it does not check
what the text says the reference says. Audit 12 found a note saying "IM Geometry (2.14 Bisect It)
closes with This completes the proof." where IM has no "completes the proof" at all (audit 12's
H-a 2). This lists every sentence of notes, pitfalls, mapping_note, the variants' notes, a
convention's jp / us / advice_ja and the sources' notes that names a US reference (the CEDs,
OpenStax, IM, CK-12, Nicholson, Levin, an English Wikipedia article) and holds an English
wording, and looks each wording up in the text of the reference named:

  sentence   the references the sentence names (source_mentions.mentions; the rule's list of
             three or more references names no one source and is skipped)
  source note the reference of that source (its title)
  wording    a run of three or more English words, or a quoted English run of any length
             (“…” or "…"); the names of the references themselves are not wordings
  found      every part of the wording (split at "…") is in one of the references named,
             ignoring case, whitespace, quote marks, hyphens and a plural -s / -es; "partial"
             when only some parts are; "no text" when no text of the reference is at hand
             (an English Wikipedia article not cached in corpus/ref/en-wiki)

A wording not found is not always wrong (a paraphrase, the reader's own words in a sentence
that names the reference, a heading set in another case): the audit reads each row. Rows the
audit has read and found right are kept in reference_quotes_checked.json (class A: in the
reference, missed by the matching; B: a description or the reference's own name, not a quote)
and counted apart ("checked"); a wording edited since then is listed again. Rows found wrong
are fixed in the data (audit 13: 16 of 110). The reference text goes to no file: the list
holds the entry's own words only.
"""
import glob
import json
import os
import re
import sys
import unicodedata
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from source_mentions import REFERENCE_SET, mentions  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
REF = os.path.join(ROOT, "corpus", "ref")
OUT = os.path.join(ROOT, "audits", "checks", "reference-quotes")
CHECKED = os.path.join(os.path.dirname(os.path.abspath(__file__)), "reference_quotes_checked.json")

FIELDS = {
    "terms": lambda d: [("mapping_note", d.get("mapping_note"))]
    + [(f"pitfalls[{i}]", p) for i, p in enumerate(d.get("pitfalls") or [])]
    + [(f"en.variants[{i}].note", v.get("note")) for i, v in enumerate((d.get("en") or {}).get("variants") or [])],
    "symbols": lambda d: [(f"notes[{i}]", n) for i, n in enumerate(d.get("notes") or [])]
    + [(f"spoken_en[{i}].note", s.get("note")) for i, s in enumerate(d.get("spoken_en") or []) if isinstance(s, dict)],
    "phrases": lambda d: [(f"notes[{i}]", n) for i, n in enumerate(d.get("notes") or [])]
    + [(f"variants[{i}].note", v.get("note")) for i, v in enumerate(d.get("variants") or [])],
    "conventions": lambda d: [("jp", d.get("jp")), ("us", d.get("us")), ("advice_ja", d.get("advice_ja"))],
}

OPENSTAX = {
    "Calculus": "calculus", "Calculus Volume 1": "calculus", "Calculus Volume 2": "calculus", "Calculus Volume 3": "calculus",
    "Precalculus": "precalculus", "Algebra and Trigonometry": "algtrig", "Prealgebra": "prealgebra",
    "Elementary Algebra": "elemalg", "Intermediate Algebra": "intalg", "Introductory Statistics": "introstats",
}
FILES = {
    "ced": ["ap-calculus-ab-bc-ced.txt", "ap-statistics-ced.txt"], "ced:calc": ["ap-calculus-ab-bc-ced.txt"],
    "ced:stats": ["ap-statistics-ced.txt"], "im": ["im-6-8.txt", "im-9-12.txt"],
    "ck12": ["ck12-geometry.txt", "ck12-algebra.txt"], "nicholson": ["nicholson-lawa-2021a.txt"], "levin": ["levin-dmoi4.txt"],
}

# Names of the references and of their parts: not wordings the reference is said to use.
NAMES = re.compile(
    r"OpenStax(?: (?:" + "|".join(re.escape(b) for b in sorted(OPENSTAX, key=len, reverse=True)) + r"))?(?: 2e)?"
    r"|Course and Exam Description|AP (?:Calculus(?: AB| BC| AB ／ BC| AB/BC)?|Statistics)|Illustrative Mathematics"
    r"|CK-12(?: Geometry| Algebra(?: I| 1)?)?|Discrete Mathematics: An Open Introduction|Linear Algebra with Applications"
    r"|Algebra and Trigonometry|Elementary Algebra|Intermediate Algebra|Prealgebra|Calculus Volume [123]|Introductory Statistics"
    r"|The Organic Chemistry Tutor|Professor Leonard|PatrickJMT|NancyPi|blackpenredpen|3Blue1Brown|Khan Academy|MIT OCW|MIT"
    r"|English Wikipedia|Wikipedia|IM|CED|Levin|Nicholson|glossary|Glossary|Topic \d+(?:\.\d+)?|Unit \d+|Lesson \d+|Grade \d+(?:–\d+)?|Math \d+(?:–\d+)?"
    r"|Geometry|Algebra [12]|Precalculus|Calculus(?: I{1,3})?|Intro(?:ductory)? Statistics|Discrete Math|Linear Algebra"
)
WORD = r"[A-Za-z][A-Za-z'’\-]*"
RUN = re.compile(WORD + r"(?:[ ,;!?.…/()\-–]+(?:" + WORD + r"|\d+(?:\.\d+)?))*")
# function names and the like: not words of a wording (lim sin(1/x) DNE is a formula)
MATHWORDS = {"lim", "sin", "cos", "tan", "sec", "csc", "cot", "log", "ln", "dx", "dy", "dt", "du", "exp", "max", "min", "mod", "gcd", "lcm", "det", "dne"}
QUOTED = re.compile(r"[“\"]([^”\"]{2,200})[”\"]")


def norm(s):
    s = unicodedata.normalize("NFKC", s).lower().replace("’", "'").replace("‘", "'").replace("“", "").replace("”", "").replace('"', "")
    s = re.sub(r"(?<![a-z])'|'(?![a-z])", " ", s).replace("(s)", "")
    s = re.sub(r"\s*([()])\s*", r"\1", s).replace("n't", " not")
    s = re.sub(r"\s+([,.;:!?])", r"\1", s)  # MathML text puts a space before punctuation
    s = re.sub(r"\b([a-z])\s+th\b", r"\1th", s)  # n th (MathML) is nth
    s = re.sub(r"[‐‑‒–—\-]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


_texts = {}


def ref_text(key):
    """Normalized text of a reference key, or None when it is not at hand."""
    if key in _texts:
        return _texts[key]
    kind, _, arg = key.partition(":")
    paths = []
    if kind == "openstax":
        dirs = [OPENSTAX[arg]] if arg in OPENSTAX else sorted(set(OPENSTAX.values()))
        for d in dirs:
            paths += sorted(glob.glob(os.path.join(ROOT, "corpus", f"openstax-{d}", "*.txt")))
    elif kind == "enwiki":
        f = os.path.join(REF, "en-wiki", urllib.parse.quote(arg, safe="") + ".json")
        text = json.load(open(f, encoding="utf-8")).get("text", "") if os.path.exists(f) else ""
        _texts[key] = norm(text) if text else None
        return _texts[key]
    else:
        paths = [os.path.join(REF, f) for f in FILES.get(key, FILES.get(kind, []))]
    paths = [p for p in paths if os.path.exists(p)]
    _texts[key] = norm("\n".join(open(p, encoding="utf-8").read() for p in paths)) if paths else None
    return _texts[key]


def source_key(src):
    """The reference key of a source, from its title / url, or None (Japanese sources, the corpus, editorial)."""
    ti, u = src.get("title") or "", src.get("url") or ""
    if "en.wikipedia.org/wiki/" in u:
        return "enwiki:" + urllib.parse.unquote(u.split("/wiki/", 1)[1]).split("#")[0].replace("_", " ")
    if "Course and Exam Description" in ti:
        return "ced:stats" if "Statistics" in ti else "ced:calc"
    if "OpenStax" in ti:
        for b in sorted(OPENSTAX, key=len, reverse=True):
            if f"OpenStax {b}" in ti:
                return "openstax:" + b
        return "openstax:"
    for w, k in (("Illustrative Mathematics", "im"), ("CK-12", "ck12"), ("Nicholson", "nicholson"), ("Levin", "levin")):
        if w in ti:
            return k
    return None


def sentence_keys(sentence):
    keys = []
    for key, _ in mentions(sentence):
        kind = key.split(":")[0]
        if kind in ("openstax", "ced", "im", "ck12", "nicholson", "levin", "enwiki"):
            keys.append("ced" if key == "ced:" else key)
    return sorted(set(keys))


def wordings(sentence):
    """English runs of three or more words and quoted English runs; a reference's name at either end of a run is not a wording."""
    s = REFERENCE_SET.sub(" ", sentence)
    out = []
    for m in QUOTED.finditer(s):
        q = m.group(1).strip()
        if re.search(r"[A-Za-z]{2}", q) and not re.search(r"[ぁ-んァ-ン一-龥]", q):
            out.append(q)
    for m in RUN.finditer(QUOTED.sub(" ", s)):
        w = m.group(0)
        while True:
            w0 = w
            w = re.sub(r"^\s*(?:" + NAMES.pattern + r")(?:[ ,;:.\-–]+|$)", "", w).strip(" ,;:!?/(-–")
            w = re.sub(r"(?:^|[ ,;:\-–]+)(?:" + NAMES.pattern + r")\s*$", "", w).strip(" ,;:!?/(-–")
            w = re.sub(r"^\d+(?:\.\d+)*\s+", "", w)
            w = re.sub(r"\s+\d+(?:\.\d+)*$", "", w).strip(" ,;!?/(-–")
            if w == w0:
                break
        w = re.sub(r"\($", "", w).strip()
        if len([x for x in re.findall(WORD, w) if len(x) >= 2 and x.lower() not in MATHWORDS]) >= 3:
            out.append(w.rstrip(" .") if not w.endswith("…") else w)
    return out


# A note quoting a reading or a notation joins the symbol and its words ("a ≤ b is read a is less
# than or equal to b"); the parts are looked up one by one.
JOINS = re.compile(r"…|\.\.\.|\bis read\b|\bread as\b|\bread\b|\bwritten as\b|\bwritten\b|\bdenoted\b|\bis called\b|,\s*or\b|\bor in symbol form\b")


def stem(word):
    """A word with its plural -s / -es optional on either side (sums ~ sum)."""
    if re.fullmatch(r"[a-z]{3,}es", word):
        return re.escape(word[:-2]) + r"(?:es|s)?"
    if re.fullmatch(r"[a-z]{2,}[^s]s", word):
        return re.escape(word[:-1]) + r"(?:s|es)?"
    return re.escape(word) + (r"(?:s|es)?" if re.match(r"[a-z]", word[-1:]) else "")


def found(wording, keys):
    w = re.sub(r"\([^)]*$", "", norm(wording))
    parts = [p.strip(" .,;:") for p in JOINS.split(w)]
    parts = [p for p in parts if len([x for x in p.split() if len(x) >= 2]) >= 2] or [w.strip(" .,;:")]
    texts = [t for t in (ref_text(k) for k in keys) if t is not None]
    if not texts:
        return "no text"
    hit = 0
    for p in parts:
        pat = r"(?<![a-z])" + r"\s*".join(stem(x) for x in p.split()) + r"(?![a-z])"
        if any(re.search(pat, t) for t in texts):
            hit += 1
    return "yes" if hit == len(parts) else ("partial" if hit else "no")


def main():
    only_verified = "--verified" in sys.argv
    checked = {}
    if os.path.exists(CHECKED):
        for c in json.load(open(CHECKED, encoding="utf-8")):
            checked[(c["collection"], c["id"], c["field"], c["wording"])] = c["class"]
    rows = []
    for c, fields in FIELDS.items():
        for f in sorted(glob.glob(os.path.join(ROOT, "data", c, "*.json"))):
            d = json.load(open(f, encoding="utf-8"))
            if only_verified and d.get("confidence") != "verified":
                continue
            items = []
            for field, text in fields(d):
                for sentence in re.split(r"(?<=。)", text or ""):
                    keys = sentence_keys(sentence)
                    if keys:
                        items.append((field, sentence, keys))
            for i, s in enumerate(d.get("sources") or []):
                key = source_key(s)
                if key and s.get("note"):
                    items.append((f"sources[{i}].note", s["note"], [key]))
            for field, sentence, keys in items:
                titles = {k.split(":", 1)[1].lower() for k in keys if k.startswith("enwiki:")}
                for w in wordings(sentence):
                    if re.sub(r"\s*\([^)]*$", "", w.lower()) in {re.sub(r"\s*\(.*$", "", t) for t in titles} | titles:
                        continue
                    f = found(w, keys)
                    if f != "yes" and (c, d["id"], field, w) in checked:
                        f = "checked " + checked[(c, d["id"], field, w)]
                    rows.append({"collection": c, "id": d["id"], "confidence": d.get("confidence"), "field": field,
                                 "references": keys, "wording": w, "found": f})
    order = {"no": 0, "partial": 1, "no text": 2, "checked A": 3, "checked B": 4, "yes": 5}
    rows.sort(key=lambda r: (order[r["found"]], r["collection"], r["id"], r["field"]))
    count = {}
    for r in rows:
        count[r["found"]] = count.get(r["found"], 0) + 1
    ver = {}
    for r in rows:
        if r["found"] in ("no", "partial") and r["confidence"] == "verified":
            ver[r["found"]] = ver.get(r["found"], 0) + 1
    json.dump({"rows": len(rows), "found": count, "verifiedNotFound": ver, "list": rows},
              open(OUT + ".json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    esc = lambda x: x.replace("|", "\\|")
    lines = ["# 参照の名前と並べた英語の言い方が、その参照の本文にあるか（Phase 5 監査 13 の前の決定 2）", "",
             "作成: `python3 scripts/audit/reference_quotes.py`（規則は scripts/audit/reference_quotes.py の説明）。"
             "「no」「partial」は参照の本文に見つからない言い方で、誤りとは限らない（言い換え・地の文・大文字の見出し）。監査が 1 行ずつ読む。", "",
             f"- 行: **{len(rows)}**（" + "・".join(f"{k} {v}" for k, v in sorted(count.items(), key=lambda kv: order[kv[0]])) + "）",
             f"- verified で見つからないもの: " + ("・".join(f"{k} {v}" for k, v in sorted(ver.items())) or "0"), "",
             "| 見つかったか | コレクション | id | confidence | 欄 | 参照 | 言い方 |", "|---|---|---|---|---|---|---|"]
    for r in rows:
        if r["found"] == "yes" or r["found"].startswith("checked"):
            continue
        lines.append(f"| {r['found']} | {r['collection']} | {r['id']} | {r['confidence']} | {r['field']} | {'・'.join(r['references'])} | {esc(r['wording'])} |")
    lines += ["", f"見つかった {count.get('yes', 0)} 行と、監査が読んで正しいとした {count.get('checked A', 0) + count.get('checked B', 0)} 行（reference_quotes_checked.json）は .json に。"]
    open(OUT + ".md", "w", encoding="utf-8").write("\n".join(lines) + "\n")
    print(f"{len(rows)} wordings next to a reference: {count}; verified not found {ver} -> audits/checks/reference-quotes.md")


if __name__ == "__main__":
    main()
