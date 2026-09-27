#!/usr/bin/env python3
"""Phase 5 audit (session 4, decision 1): the theorem-like names the references use, against the entries.

    python3 scripts/audit/reference_names.py          -> audits/checks/reference-theorem-names.md (and .json)
    python3 scripts/audit/reference_names.py --id X   the names judged to be entry X (what show_batch.py prints)

Audit 3 found the headword of 接弦定理 in CK-12 (Chord/Tangent Angle Theorem, 5 uses) only by reading the
lesson: corpus:decide sees only the candidates an entry lists, so a reference's name outside them stays
invisible (audit 3 report H-1). This lists, by machine, every "… Theorem / Postulate / Property / Rule /
Law / Test" name in the references' bodies and section names (CK-12, OpenStax, IM, the CEDs, Levin,
Nicholson), with counts and where it occurs, and matches each name against the wordings of terms
(en.term, en.alt, en.variants). A name no wording matches gets candidate entries by shared words; the
audit judges whether a candidate is the same concept. Judged names live in
scripts/audit/reference_names_same.json (normalized name -> {"id": …, "note": …} for the same concept,
{"skip": true, "note": …} for a name that is not an entry's concept) and come out at the top of the list,
for the batch that audits the entry (show_batch.py prints them as !REF rows). Only names, counts and
section names leave the references; no sentence is copied.

A name is the words just before the keyword that are name words (capitalized, or lowercase and not a
function word / verb), up to 5, plus an "of / for …" tail (Fundamental Theorem of Calculus, Law of
Sines, Addition Property of Equality, Test for Divergence), and "converse of the" in front when the
text has it. "Theorem 2.3" (a numbered theorem of Nicholson / Levin) is not a name. An all-lowercase
name is listed when a reference uses it twice or more; a capitalized one from one use.
"""
import collections
import datetime
import glob
import json
import os
import re
import sys
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
REF = os.path.join(ROOT, "corpus", "ref")
OUT = os.path.join(ROOT, "audits", "checks", "reference-theorem-names")
JUDGED = os.path.join(ROOT, "scripts", "audit", "reference_names_same.json")
TODAY = datetime.date.today().isoformat()

KEYWORDS = ("theorem", "postulate", "property", "rule", "law", "test")
KEY_RE = r"(?:[Tt]heorem|[Pp]ostulate|[Pp]ropert(?:y|ies)|[Rr]ule|[Ll]aw|[Tt]est)s?"
WORD = r"[A-Za-z\u00C0-\u00FF][A-Za-z\u00C0-\u00FF\u2019'/.\-]*"
NAME_RE = re.compile(
    r"(?<![A-Za-z\-])((?:" + WORD + r"\s+){0,5})(" + KEY_RE + r")\b"
    r"(?!\s*\d)(?!\s*\()"
    r"(?:[ \t]+((?:of|for)[ \t]+(?:the[ \t]+)?" + WORD + r"(?:[ \t]+(?:(?:of|the|and)[ \t]+)?" + WORD + r"){0,2}))?"
)
CONVERSE_RE = re.compile(r"[Cc]onverse\s+(?:of\s+)?(?:the\s+)?$")
# lowercase words that end a name when read leftwards from the keyword
STOP = set(
    """the a an this that these those each every any some such following above below previous next last another
    other one two three no our its their his her my your which whose what both all either neither several many few
    more most less new given known called same similar certain particular general basic important useful simple main
    whole entire corresponding original resulting formal informal usual desired required needed appropriate relevant
    necessary of in on at by to for from with into than then if so and or but as is are was were be been being am
    use uses using used apply applies applying applied prove proves proving proved see recall state stated states
    hence thus therefore when where while via named we you they it he she i not also only just now here there again
    first-mentioned aforementioned said above-mentioned like unlike per about after before under over without within
    yields gives give given get gets got take takes taking took make makes making made do does did done has have had
    having can could may might must shall should will would let lets show shows showed shown consider write read
    following famous well-known so-called standard usual second-to-last says tells gives connects allows until instead
    similarly later begin begins reveals holds applies extends""".split()
)
STOP_CAP = {"The", "A", "An", "By", "Use", "Using", "Hence", "Then", "See", "Prove", "Proving", "Thus", "In", "But",
            "From", "Apply", "Applying", "Verify", "Performing", "Describe", "Recall", "With", "So", "Combining", "Since",
            "Because", "Now", "Also", "Note", "Consider", "State", "Restate", "Given", "If", "Let", "This", "That", "These",
            "Each", "Which", "Our", "Its", "Their", "For", "Of", "To", "And", "Or", "Is", "Are", "Was", "Were", "As", "Yes",
            "No", "Why", "How", "What", "When", "Where", "Applies", "Used", "Uses", "Proof", "Proofs", "Example",
            "Examples", "Exercise", "Exercises", "Section", "Chapter", "Lesson", "Unit", "Topic", "Figure", "Table",
            "Review", "Practice", "Activity", "Quiz", "Homework", "Statement", "Corollary", "Lemma", "Definition",
            "Remark", "Proposition", "Solution", "Step", "Part", "Case", "Summary", "Key", "Vocabulary", "Notes",
            "Glossary", "Entries", "Entry", "Concepts", "Concept", "Objectives", "Objective", "Learning", "Big", "Idea",
            "Ideas", "Terms", "Term", "Let's", "Let\u2019s", "Try", "Check", "Answer", "Answers", "Hint", "Video",
            "Videos", "Interactive", "Explore", "Watch", "Ready", "Media", "Access", "Additional", "Online", "Resources",
            "Learn", "Explain", "Show", "Find", "Write", "Solve", "Identify", "Determine", "Complete", "Compare",
            "Justify", "Interpret", "Preview", "Introduction", "Overview", "Reading", "Notation", "Data", "Information",
            "Equations", "Systems", "Basics", "Applications", "Cosines", "Sines", "Functions", "Illustrating", "Examining",
            "Understanding", "Verifying", "Define", "Defining", "Recognize", "Extend", "Derive", "Familiar", "Included",
            "Multiplying", "Growth", "Oblique", "Positive", "Students", "Similarly", "Polynomials", "Diagram", "Glossary"}
# a single letter counts as a name word only just before the keyword: F test, t test, z test
SINGLE = {"F", "t", "z", "T", "Z", "G"}
# names that are not the name of a concept (exercises, test papers)
NOISE = {"practice test", "chapter practice test", "ap test", "memory test", "chapter test", "unit test", "term test",
         "pop quiz", "t test", "tests", "test", "theorem", "rule", "law", "property", "postulate"}


def norm(s):
    s = unicodedata.normalize("NFKD", s)
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = s.lower().replace("’", "'").replace("`", "'")
    s = re.sub(r"[\-–—/]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    s = re.sub(r"^the ", "", s)
    return s


def singular(n):
    """properties -> property, laws -> law (the keyword only, at the end or before 'of / for')."""
    return re.sub(r"\b(theorem|postulate|rule|law|test)s\b", r"\1", re.sub(r"\bproperties\b", "property", n))


def name_at(text, m):
    before = m.group(1) or ""
    words = before.split()
    keep = []
    for w in reversed(words):
        if w.lower() in STOP or w in STOP_CAP or not re.match(r"^[A-Za-z\u00C0-\u00FF]", w) or w.endswith(".") or w.endswith(","):
            break
        if len(w) == 1 and not (not keep and w in SINGLE):
            break
        if w.isupper() and len(w) >= 5 and w != "ANOVA":
            break
        keep.append(w)
        if len(keep) == 5:
            break
    keep.reverse()
    # a name with a possessive (Newton's law of cooling, De Moivre's Theorem) starts at the possessive word
    # (one "De" / "de" / "von" / "van" before it), whatever the running head or sentence put in front
    poss = [i for i, w in enumerate(keep) if re.search(r"(?:[\u2019']s|s[\u2019'])$", w)]
    if poss:
        i = poss[0]
        if i > 0 and keep[i - 1] in ("De", "de", "von", "van", "Van"):
            i -= 1
        keep = keep[i:]
    if not keep:
        return None
    key = m.group(2)
    tail = (m.group(3) or "").strip()
    # the tail stops at a function word / verb / heading word ("of Calculus Part", "of Logarithms to Solve")
    tw = tail.split()
    cut = len(tw)
    for i, w in enumerate(tw[1:], 1):
        if (w.lower() in STOP and w.lower() not in ("the", "of", "and")) or w in STOP_CAP or len(w) == 1:
            cut = i
            break
    tail = " ".join(w.rstrip(".,;:") for w in tw[:cut]) if cut > 1 else ""
    keep = [w.rstrip(".,;:") for w in keep]
    name = " ".join(keep + [key] + ([tail] if tail else []))
    start = m.start(2) - len(" ".join(keep)) - 1
    if CONVERSE_RE.search(text[max(0, m.start()) : m.start(2)][: -len(" ".join(keep)) - 1] if keep else ""):
        name = "converse of the " + name
    elif CONVERSE_RE.search(text[max(0, start - 20) : start]):
        name = "converse of the " + name
    return name, keep[0][0].isupper() or key[0].isupper()


def extract(text):
    """[(surface name, capitalized?)] for one section."""
    out = []
    for m in NAME_RE.finditer(text):
        r = name_at(text, m)
        if r is None:
            continue
        name, cap = r
        n = norm(name)
        if n in NOISE or singular(n) in NOISE:
            continue
        out.append((name, cap))
    return out


def sections_at(file):
    """IM / CK-12: one section per '@@ Course U.L Title' block."""
    text = open(file, encoding="utf-8").read()
    for part in text.split("@@ "):
        if not part.strip():
            continue
        nl = part.find("\n")
        yield part[:nl].strip().lstrip("\f"), part[nl + 1 :]


def sections_ced(file):
    text = open(file, encoding="utf-8").read()
    end = re.search(r"^\f?Exam Overview$", text, re.M)
    body = text[: end.start()] if end else text
    marks = [(m.start(), f"topic {m.group(1)}") for m in re.finditer(r"^TOPIC (\d{1,2}\.\d{1,2})$", body, re.M)]
    marks += [(m.start(), f"unit {m.group(1)}") for m in re.finditer(r"^UNIT (\d{1,2})\b", body, re.M)]
    marks.sort()
    if not marks:
        yield "front", body
        return
    yield "front", body[: marks[0][0]]
    for i, (at, name) in enumerate(marks):
        yield name, body[at : marks[i + 1][0] if i + 1 < len(marks) else len(body)]
    if end:
        yield "exam", text[end.start() :]


def sections_book(file):
    """Nicholson / Levin: pages, named by the last running head 'n.m. Title' seen."""
    text = open(file, encoding="utf-8").read()
    name = "front"
    for page in text.split("\f"):
        first = next((l.strip() for l in page.split("\n") if l.strip()), "")
        m = re.match(r"^(\d{1,2}\.\d{1,2})\.\s+(.+?)(?:\s+\d+)?$", first)
        if m:
            name = f"{m.group(1)} {m.group(2)}"
        yield name, page


def references():
    """(reference label, section name, text) for every section of every reference."""
    for label, file in (("CK-12 Geometry", "ck12-geometry.txt"), ("CK-12 Algebra", "ck12-algebra.txt")):
        for s, t in sections_at(os.path.join(REF, file)):
            yield label, re.sub(r"^CK-12 (Geometry|Algebra) ", "", s), t
    for label, file in (("IM 6–8", "im-6-8.txt"), ("IM 9–12", "im-9-12.txt")):
        for s, t in sections_at(os.path.join(REF, file)):
            yield label, s, t
    for label, file in (("AP Calculus CED", "ap-calculus-ab-bc-ced.txt"), ("AP Statistics CED", "ap-statistics-ced.txt")):
        for s, t in sections_ced(os.path.join(REF, file)):
            yield label, s, t
    for label, file in (("Nicholson", "nicholson-lawa-2021a.txt"), ("Levin", "levin-dmoi4.txt")):
        for s, t in sections_book(os.path.join(REF, file)):
            yield label, s, t
    manifest = os.path.join(ROOT, "corpus", "manifest.json")
    if os.path.exists(manifest):
        for m in json.load(open(manifest, encoding="utf-8")):
            if not m["id"].startswith("openstax-"):
                continue
            f = os.path.join(ROOT, "corpus", m["file"])
            if not os.path.exists(f):
                continue
            book, _, section = m["title"].partition(" - ")
            yield book, section, open(f, encoding="utf-8").read()


def entries():
    out = {}
    for f in sorted(glob.glob(os.path.join(ROOT, "data", "terms", "*.json"))):
        d = json.load(open(f, encoding="utf-8"))
        en = d["en"]
        words = [en["term"]] + list(en.get("alt") or []) + [v["term"] for v in en.get("variants") or [] if isinstance(v, dict)]
        out[d["id"]] = {"wordings": words, "ja": d["ja"]["term"], "confidence": d.get("confidence")}
    return out


CONTENT_STOP = STOP | set(KEYWORDS) | {"theorems", "properties", "rules", "laws", "tests", "postulates", "converse"}


def stem(w):
    w = w.rstrip("'")
    if w.endswith("'s"):
        w = w[:-2]
    if w.endswith("ies") and len(w) > 4:
        return w[:-3] + "y"
    if w.endswith("s") and not w.endswith("ss") and len(w) > 3:
        return w[:-1]
    return w


def content(s):
    return {stem(w) for w in norm(s).split() if w not in CONTENT_STOP and len(w) > 1}


def main():
    judged = json.load(open(JUDGED, encoding="utf-8")) if os.path.exists(JUDGED) else {}
    if "--id" in sys.argv:
        want = sys.argv[sys.argv.index("--id") + 1]
        for n, j in judged.items():
            if j.get("id") == want:
                print(("（関連）" if j.get("related") else "") + n, "—", j.get("note", ""))
        return
    counts = collections.defaultdict(collections.Counter)  # norm -> label -> count
    surface = collections.defaultdict(collections.Counter)  # norm -> surface form -> count
    where = collections.defaultdict(lambda: collections.defaultdict(collections.Counter))  # norm -> label -> section -> count
    capital = collections.defaultdict(int)
    for label, section, text in references():
        for name, cap in extract(text):
            n = norm(name)
            counts[n][label] += 1
            surface[n][name] += 1
            where[n][label][section] += 1
            if cap:
                capital[n] += 1
    ents = entries()
    by_wording = collections.defaultdict(list)
    for id_, e in ents.items():
        for w in e["wordings"]:
            by_wording[singular(norm(w))].append(id_)
    ent_words = {id_: content(" ".join(e["wordings"])) | set(id_.split("-")) for id_, e in ents.items()}
    rows = []
    for n, by in counts.items():
        total = sum(by.values())
        if capital[n] == 0 and max(by.values()) < 2:
            continue
        matched = sorted(set(by_wording.get(singular(n), [])))
        cands = []
        if not matched:
            cw = content(n)
            if cw:
                scored = []
                for id_, ws in ent_words.items():
                    s = len(cw & ws)
                    if s:
                        scored.append((s, -abs(len(ws) - len(cw)), id_))
                scored.sort(reverse=True)
                cands = [[id_, s] for s, _, id_ in scored[:4]]
        j = judged.get(n)
        rows.append(
            {
                "name": surface[n].most_common(1)[0][0],
                "norm": n,
                "total": total,
                "refs": dict(by.most_common()),
                "sections": {l: [s for s, _ in secs.most_common(3)] for l, secs in where[n].items()},
                "matched": matched,
                "candidates": cands,
                "judged": j,
            }
        )
    rows.sort(key=lambda r: (-r["total"], r["norm"]))
    with open(OUT + ".json", "w", encoding="utf-8") as f:
        json.dump({"generated": TODAY, "names": rows}, f, ensure_ascii=False, indent=1)
    judged_id = lambda r: bool(r["judged"] and r["judged"].get("id")) and r["judged"]["id"] not in r["matched"]
    to_review = [r for r in rows if judged_id(r) and not r["judged"].get("related")]
    related = [r for r in rows if judged_id(r) and r["judged"].get("related")]
    matched = [r for r in rows if r["matched"]]
    unmatched = [r for r in rows if not r["matched"] and not judged_id(r)]
    unjudged = [r for r in unmatched if not r["judged"]]
    refs = lambda r: "、".join(f"{l} {c}" for l, c in r["refs"].items())
    secs = lambda r: "、".join(f"{l}: {' ／ '.join(s)}" for l, s in r["sections"].items())
    md = [
        "# 参照の定理・公理・性質・法則・判定法の名前と見出しの突き合わせ（Phase 5 監査 4 の決定 1）",
        "",
        f"作成: {TODAY} ／ `python3 scripts/audit/reference_names.py`。参照（CK-12・IM・CED・Nicholson・Levin・OpenStax 9 冊）の本文と節の名前から「… Theorem ／ Postulate ／ Property ／ Rule ／ Law ／ Test」の名前を機械で抜き出し、terms の en.term・en.alt・en.variants と突き合わせた（規則は scripts/audit/reference_names.py の説明）。本文は写さず、名前・件数・節の名前だけ。",
        "",
        f"- 名前: **{len(rows)}**（見出しと一致 {len(matched)}、一致しない {len(unmatched)}。うち監査が判断した名前 {len(unmatched) - len(unjudged)}、未判断 {len(unjudged)}）",
        f"- **監査で見る**（同じ概念のエントリがあるのに、参照の名前が en・alt・variants に無い）: **{len(to_review)}**（scripts/audit/reference_names_same.json。各語の監査で、参照の名前を en.alt か variant に入れるか、見出しにするか（参照が 3 件以上使う呼び方は見出し。STYLE 原則 1 ③）を決める）",
        f"- 関連する名前（別の概念だが、エントリの mapping_note ／ pitfalls で触れる候補。alt にはしない）: **{len(related)}**",
        "",
        "## 監査で見る: 同じ概念のエントリがあるのに、参照の名前が en・alt・variants に無いもの",
        "",
        "| 参照の名前 | 件数（参照ごと） | 節 | エントリ | confidence | 判断の note |",
        "|---|---|---|---|---|---|",
    ]
    for r in sorted(to_review, key=lambda r: (r["judged"]["id"], -r["total"])):
        i = r["judged"]["id"]
        md.append(f"| {r['name']} | {refs(r)} | {secs(r)} | {i}（{ents.get(i, {}).get('ja', '?')}） | {ents.get(i, {}).get('confidence', '?')} | {r['judged'].get('note', '')} |")
    md += ["", "## 関連する名前（別の概念。エントリの mapping_note ／ pitfalls で触れる候補で、alt にはしない）", "", "| 参照の名前 | 件数（参照ごと） | エントリ | confidence | 判断の note |", "|---|---|---|---|---|"]
    for r in sorted(related, key=lambda r: (r["judged"]["id"], -r["total"])):
        i = r["judged"]["id"]
        md.append(f"| {r['name']} | {refs(r)} | {i}（{ents.get(i, {}).get('ja', '?')}） | {ents.get(i, {}).get('confidence', '?')} | {r['judged'].get('note', '')} |")
    md += ["", "## 見出し（en.term・en.alt・en.variants）と一致した名前", "", "| 参照の名前 | 件数（参照ごと） | エントリ |", "|---|---|---|"]
    for r in matched:
        md.append(f"| {r['name']} | {refs(r)} | {'、'.join(r['matched'])} |")
    md += [
        "",
        "## 見出しと一致しない名前（候補のエントリは語の重なりで機械が挙げたもの。判断は右の列）",
        "",
        "| 参照の名前 | 件数（参照ごと） | 節 | 候補のエントリ（重なる語の数） | 判断 |",
        "|---|---|---|---|---|",
    ]
    for r in unmatched:
        j = r["judged"]
        verdict = "" if not j else ("エントリの概念ではない: " + j.get("note", "")) if j.get("skip") else j.get("note", "")
        cands = "、".join(f"{i}（{s}）" for i, s in r["candidates"])
        md.append(f"| {r['name']} | {refs(r)} | {secs(r)} | {cands} | {verdict} |")
    with open(OUT + ".md", "w", encoding="utf-8") as f:
        f.write("\n".join(md) + "\n")
    print(f"names {len(rows)}: matched {len(matched)}, unmatched {len(unmatched)} (judged {len(unmatched) - len(unjudged)}, unjudged {len(unjudged)}), to review {len(to_review)}, related {len(related)}")


if __name__ == "__main__":
    main()
