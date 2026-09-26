"""Phase 3 の記号の前の修正 2〜4: 記号・慣習差・フレーズの台帳を直す（DECISIONS「Phase 3 記号の前の修正」）。

入力は Phase 3 の準備のコミット（907098d）の台帳に固定するので、何度回しても同じ結果になる。

    python3 scripts/ledger/phase3_fixes.py

- symbols.csv: level の「小学校」を中1 に寄せる。慣習差と重なる行に related 列（conventions の id）を足す
- conventions.csv: 語彙だけの違いの行を外す、「一方の国だけが名前を付ける」14 行を 3 行にまとめる、付録 B の 10 行を足す、
  symbols と id が重なる 4 行を改名する、related 列（symbols の id）と merged_from 列を足す
- phrases.csv: 同じ意図の行をまとめる（merged_from 列）、terms に近い断片・同じ意図の terms がある行・
  米国の教材で確かめられない日本の問題文の型・製品名の行を外す、exam-clarify-instruction を 1 つの意図に絞る

外した行は ledger/phase3-removed.csv に理由と行き先（関係する terms の id）付きで残す。
"""
from __future__ import annotations

import csv
import io
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASE = "907098d"


def read(name: str) -> tuple[list[str], list[dict[str, str]]]:
    text = subprocess.run(["git", "show", f"{BASE}:ledger/{name}"], cwd=ROOT, check=True, capture_output=True, text=True).stdout
    r = csv.DictReader(io.StringIO(text))
    return list(r.fieldnames or []), list(r)


def write(name: str, fields: list[str], rows: list[dict[str, str]]) -> None:
    with open(ROOT / "ledger" / name, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields, lineterminator="\n")
        w.writeheader()
        for row in rows:
            w.writerow({k: row.get(k, "") for k in fields})


removed: list[dict[str, str]] = []


def drop(ledger: str, rid: str, reason: str, covered_by: str = "") -> None:
    removed.append({"ledger": ledger, "id": rid, "reason": reason, "covered_by": covered_by})


# ------------------------------------------------------------ conventions

# symbols と同じ id の行: 記号（読み方と書き方）は symbols に、違いの説明は conventions に置き、id を分ける
CONV_RENAME = {
    "base-n-subscript": "base-n-parenthesized-subscript",
    "complement-notation": "complement-bar-vs-c-prime",
    "dne-abbreviation": "dne-in-answers",
    "gcd-notation": "gcd-written-in-words",
}

# 語彙だけの違い（同じもの・同じ操作を日米で別の語で呼ぶだけ）。関係する terms の pitfalls ／ mapping_note にあることを確かめた
CONV_VOCABULARY = {
    "iff-for-necessary-and-sufficient": "necessary-and-sufficient-condition",
    "variation-language": "direct-proportion|inverse-proportion|joint-variation",
    "ratio-rate-percent": "rate|percent",
    "derivative-at-a-point-naming": "find-the-derivative-at|instantaneous-rate-of-change",
    "distance-rate-time": "speed|motion-problem",
    "proportion-cross-multiplication": "cross-multiply",
    "transposing-vs-both-sides": "move-term-to-other-side|both-sides",
    "convexity-direction": "concavity|opens-upward|opens-downward|parabola",
}

# 「一方の国だけが名前を付ける」14 行 → 3 行
CONV_MERGE = {
    "us-named-theorems-and-reasons-in-geometry": {
        "from": ["geometry-postulates-named", "angle-pair-names", "properties-as-reasons", "power-of-a-point-split"],
        "category": "proof-style",
        "summary": "日本の中学・高校は平行線の同位角・錯角、三角形の内角の和、線分や角の和などを図形の性質として名前を立てずに使い、"
        "証明の理由も「共通」「〜より」と文で書き、方べきの定理を 1 つにまとめる。米国の Geometry は corresponding angles postulate・"
        "triangle sum theorem・segment addition postulate、transversal と角の組（alternate exterior angles・linear pair）、"
        "reflexive・transitive・substitution property のように 1 つずつ名前を付けて証明の理由（reasons）に書き、"
        "方べきの定理も intersecting chords theorem と tangent secant segment theorem に分ける。",
    },
    "us-named-rules-and-tests": {
        "from": [
            "us-named-algebra-rules",
            "us-named-calculus-rules",
            "us-named-trig-angles",
            "graph-line-tests",
            "empirical-rule-68-95-99-7",
            "riemann-sum-types",
            "volume-of-revolution-methods",
            "induction-step-names",
        ],
        "category": "terminology",
        "summary": "日本の高校の教科書は、等式の性質・解き方・判定法・和や体積の求め方・帰納法の段階の多くに名前を付けずに使う。"
        "米国の教科書は addition property of equality・square root property・vertical line test・horizontal line test・"
        "critical point・power rule・second derivative test・nth-term test・left／right／midpoint Riemann sum・"
        "disk／washer／shell method・coterminal angle・reference angle・empirical rule・base case／inductive step と名前で呼び、"
        "答案の理由や手順の指示にもその名前を使う。",
    },
    "jp-named-techniques-unnamed-in-us": {
        "from": ["jp-named-techniques-unnamed-in-us", "jp-named-geometry-unnamed-in-us"],
        "category": "terminology",
        "summary": "日本は「三角関数の合成」「真数条件」「追い出しの原理」「基本対称式」「解と係数の関係」「群数列」「過不足算」"
        "「階級値」「接弦定理」「五心」「点対称」「軌跡」「2 円の位置関係」と、手法・条件・問題の型・図形の性質に名前を付けて使う。"
        "英語には決まった名前がなく、write as a single sine function・the argument must be positive・"
        "the sum of the roots is −b/a・180° rotational symmetry・the set of all points … such that … のように中身を文で言う"
        "（五心のうち傍心を除く 4 つは points of concurrency）。",
    },
}

# 付録 B の 10 行（本文に裏付けがないので Phase 3 の準備では足さなかった）。出典は付録 B。生成時に参照で確かめ、確かめられなければ外す
APPENDIX_B = [
    ("approximately-equal-notation", "日本は近似を ≒ で書く。米国は ≈ で書く。", "approximate-value", "notation", "2"),
    ("division-sign-usage", "日本は中学以降も ÷ を式に書くことがある。米国は ÷ を小学校までの記号とし、/ か分数の形で書く。", "division|fraction", "notation", "8"),
    ("multiplication-sign-usage", "日本は × と ・ を掛け算に使う。米国は · か並置で書き、× はベクトルの外積や次元（m × n）に使う。", "multiplication|cross-product", "notation", "9"),
    ("decimal-point-and-digit-grouping", "小数点（3.14）と 3 桁区切りのコンマ（1,000）は日米で同じ。", "decimal|place", "notation", "10"),
    ("handwritten-digits", "日本の手書きは 7 に横棒、1 に旗を付ける。米国は 7 に棒を付けず、1 は縦棒だけで書き、横棒付きの 7 は F や 4 に見えることがある。", "", "handwriting", "18"),
    ("handwritten-x-and-z", "米国の手書きは z に横棒を付けることが少なく、x と掛け算の × を書き分けることに注意する。", "", "handwriting", "19"),
    ("rationalizing-denominators-expectation", "日本は答えの分母を必ず有理化する。米国は 1/√2 のまま答えとして認める講師もいる（講師次第）。", "rationalizing-the-denominator", "classroom-culture", "22"),
    ("angle-units-degrees-and-radians", "日本は度と弧度法を数II で並べて使う。米国は Precalculus から radians が中心で、Calculus は radians だけを使う。", "radian|degree-measure", "classroom-culture", "23"),
    ("reading-f-of-x", "関数の記号 f(x) は日米で同じ。英語では f of x と読む。", "function-notation", "notation", "26"),
    ("sequence-starting-index", "日本の数列は初項を a₁ とする。米国は a₁ から始めることも a₀ から始めることも多い。", "general-term|sequence", "notation", "29"),
]

# symbols と conventions の重なり（記号は読み方と書き方、慣習差は違いの説明。互いを related で結ぶ）
RELATED = {
    "therefore-sign": ["therefore-because-symbols"],
    "because-sign": ["therefore-because-symbols"],
    "qed-end-of-proof": ["end-of-proof-marker"],
    "common-log-notation": ["log-and-ln"],
    "natural-log-ln": ["log-and-ln"],
    "log-e-jp": ["log-and-ln"],
    "leq-sign": ["inequality-symbols"],
    "geq-sign": ["inequality-symbols"],
    "similar-sign": ["similarity-symbol"],
    "congruent-sign": ["congruence-symbol"],
    "measure-of-angle": ["figure-and-measure-notation"],
    "segment-ab-overline": ["figure-and-measure-notation"],
    "length-ab": ["figure-and-measure-notation"],
    "line-ab-arrow": ["figure-and-measure-notation"],
    "arc-ab": ["arc-measure-notation"],
    "conditional-probability-bar": ["conditional-probability-notation"],
    "conditional-probability-subscript-jp": ["conditional-probability-notation"],
    "complement-notation": ["complement-bar-vs-c-prime"],
    "permutation-npr": ["combination-permutation-notation"],
    "combination-ncr": ["combination-permutation-notation"],
    "repeated-combination-h-jp": ["repeated-combination-notation"],
    "secant-of-theta": ["reciprocal-trig-functions"],
    "cosecant-of-theta": ["reciprocal-trig-functions"],
    "cotangent-of-theta": ["reciprocal-trig-functions"],
    "inverse-sine-notation": ["inverse-trig-functions"],
    "inverse-cosine-notation": ["inverse-trig-functions"],
    "inverse-tangent-notation": ["inverse-trig-functions"],
    "vector-arrow-notation": ["vector-notation"],
    "angle-bracket-vector": ["vector-notation"],
    "unit-vector-hat": ["standard-unit-vector-letters"],
    "closed-interval-brackets": ["interval-notation-vs-inequalities"],
    "open-interval-parentheses": ["interval-notation-vs-inequalities"],
    "half-open-interval": ["interval-notation-vs-inequalities"],
    "evaluation-bar": ["evaluation-bar-notation"],
    "plus-c-constant": ["constant-of-integration-remark"],
    "negation-sign": ["logic-notation"],
    "logical-and-wedge": ["logic-notation"],
    "logical-or-vee": ["logic-notation"],
    "for-all-quantifier": ["logic-notation"],
    "there-exists-quantifier": ["logic-notation"],
    "base-n-subscript": ["base-n-parenthesized-subscript"],
    "gauss-bracket-jp": ["floor-function-notation"],
    "floor-brackets": ["floor-function-notation"],
    "identity-matrix-i": ["identity-matrix-letter"],
    "normal-distribution-n": ["normal-distribution-parameter"],
    "distributed-as-tilde": ["normal-distribution-parameter"],
    "gcd-notation": ["gcd-written-in-words"],
    "cardinality-notation": ["number-of-elements-notation"],
    "variance-of-x": ["variance-notation"],
    "repeating-decimal-bar": ["repeating-decimal-notation"],
    "set-builder-braces": ["set-builder-colon"],
    "subset-sign": ["subset-symbol"],
    "proper-subset-sign": ["subset-symbol"],
    "limit-from-left": ["one-sided-limit-notation"],
    "limit-from-right": ["one-sided-limit-notation"],
    "dne-abbreviation": ["dne-in-answers"],
    "derivative-prime": ["y-prime-vs-dy-dx"],
    "derivative-leibniz": ["y-prime-vs-dy-dx"],
    "summation-sigma": ["summation-index-letter"],
    "negative-sign": ["negative-vs-minus"],
    "probability-of-intersection": ["probability-and-or-notation"],
    "probability-of-union": ["probability-and-or-notation"],
    "approximately-equal-sign": ["approximately-equal-notation"],
    "division-sign": ["division-sign-usage"],
    "long-division-bracket": ["division-sign-usage"],
    "times-sign": ["multiplication-sign-usage"],
    "decimal-point": ["decimal-point-and-digit-grouping"],
    "function-f-of-x": ["reading-f-of-x"],
    "a-sub-n": ["sequence-starting-index"],
    "sequence-braces": ["sequence-starting-index"],
    "radian-unit": ["angle-units-degrees-and-radians"],
}


def join(*parts: str) -> str:
    out: list[str] = []
    for p in parts:
        for x in p.split("|"):
            if x and x not in out:
                out.append(x)
    return "|".join(out)


def fix_conventions() -> None:
    fields, rows = read("conventions.csv")
    by_id = {r["id"]: r for r in rows}
    out: list[dict[str, str]] = []
    merged_into = {old: new for new, spec in CONV_MERGE.items() for old in spec["from"]}
    placed: set[str] = set()
    for r in rows:
        rid = r["id"]
        if rid in CONV_VOCABULARY:
            drop("conventions", rid, "語彙だけの違い（同じもの・同じ操作を別の語で呼ぶだけ）。関係する terms の pitfalls ／ mapping_note にある", CONV_VOCABULARY[rid])
            continue
        if rid in merged_into:
            new = merged_into[rid]
            if new in placed:
                continue
            placed.add(new)
            spec = CONV_MERGE[new]
            src = [by_id[o] for o in spec["from"]]
            out.append(
                {
                    "id": new,
                    "summary": spec["summary"],
                    "term_refs": join(*(s["term_refs"] for s in src)),
                    "source": join(*(s["source"] for s in src)),
                    "category": spec["category"],
                    "appendix_b": join(*(s["appendix_b"] for s in src)),
                    "merged_from": "|".join(o for o in spec["from"] if o != new),
                }
            )
            continue
        row = dict(r)
        row["id"] = CONV_RENAME.get(rid, rid)
        if rid == "trapezoid-definition":
            row["source"] = join(row["source"], "日本側の定義は生成時に日本の教科書で確かめる")
        out.append(row)
    for cid, summary, refs, category, b in APPENDIX_B:
        out.append({"id": cid, "summary": summary, "term_refs": refs, "source": f"PLAN 付録 B #{b}（生成時に参照で確かめ、確かめられなければ外す）", "category": category, "appendix_b": b})
    back: dict[str, list[str]] = {}
    for sym, convs in RELATED.items():
        for c in convs:
            back.setdefault(c, []).append(sym)
    ids = {r["id"] for r in out}
    for c in back:
        assert c in ids, f"related convention {c} missing"
    for r in out:
        r["related"] = "|".join(back.get(r["id"], []))
    write("conventions.csv", fields + ["merged_from", "related"], out)


# ---------------------------------------------------------------- symbols


def fix_symbols() -> None:
    fields, rows = read("symbols.csv")
    ids = {r["id"] for r in rows}
    for s in RELATED:
        assert s in ids, f"related symbol {s} missing"
    for r in rows:
        levels: list[str] = []
        for lv in r["level"].split("|"):
            lv = "中1" if lv == "小学校" else lv
            if lv not in levels:
                levels.append(lv)
        r["level"] = "|".join(levels)
        r["related"] = "|".join(RELATED.get(r["id"], []))
    write("symbols.csv", fields + ["related"], rows)


# ---------------------------------------------------------------- phrases

# 同じ意図の行: 残す行 → まとめる行
PHRASE_MERGE = {
    "written-solution-therefore": ["therefore", "hence"],
    "left-side-minus-right-side": ["take-the-difference-of-the-two-sides", "form-the-difference"],
    "the-derivative-is-zero": ["the-tangent-line-is-horizontal"],
    "written-solution-as-desired": ["written-solution-qed"],
    "written-solution-which-implies": ["written-solution-it-follows-that"],
    "written-solution-conclusion-because-reason": ["changes-from-increasing-to-decreasing"],
    "exam-express-in-terms-of": ["express-as-a-vector"],
    "exam-show-your-work": ["exam-no-work-no-credit"],
}

# terms に近い名詞句・断片
PHRASE_FRAGMENT = {
    "enclosed-region": "phrases/the-area-of-the-region-bounded-by",
    "point-outside-the-circle": "",
    "checking-conditions": "",
    "relation-between-x-and-y": "",
    "the-value-of-sine-theta": "find",
    "for-the-angle-theta": "opposite-side",
    "one-of-the-solutions-is": "",
    "the-other-solutions": "",
    "the-domain-is-the-positive-reals": "domain",
}

# 同じ意図の terms がある
PHRASE_TERM = {
    "assuming-leads-to-a-contradiction": "lead-to-a-contradiction",
    "written-solution-without-loss-of-generality": "without-loss-of-generality",
    "written-solution-base-case": "base-case",
    "take-the-log-and-differentiate": "take-the-log-of-both-sides|logarithmic-differentiation",
    "exam-find": "find",
    "exam-evaluate": "evaluate",
    "exam-simplify": "simplify",
    "exam-solve-for-x": "solve-for",
    "exam-prove": "prove",
    "exam-factor-completely": "factoring",
    "exam-sketch-the-graph": "sketch-the-graph",
    "exam-round-to-the-nearest-tenth": "round",
    "written-solution-equality-holds": "equality-holds",
    "written-solution-if-and-only-if": "necessary-and-sufficient-condition",
    "written-solution-solving-for": "solve-for",
    "written-solution-substituting": "substitute",
    "written-solution-differentiating-both-sides": "differentiate-both-sides",
    "explaining-solution-split-into-cases": "split-into-cases",
    "explaining-solution-substituted-into-the-other": "substitute",
    "explaining-solution-u-substitution": "let-u-equal|substitute-new-variable",
    "explaining-solution-simplified-to": "simplify",
    "explaining-solution-added-to-eliminate": "eliminate",
    "class-listening-plug-it-back-in": "check",
    "the-limit-exists": "the-limit-does-not-exist",
    "there-are-infinitely-many": "infinitely-many-solutions",
    "has-no-local-extrema": "has-a-local-extremum",
    "increasing-on-all-reals": "is-monotonically-increasing",
    "converges-to-zero": "converge",
    "the-function-is-continuous": "continuous",
}

# 日本の問題文の型の英訳で、米国の教材（OpenStax・CED・IM・CK-12）に形が見つからないもの
PHRASE_JP_EXAM = {
    "using-real-numbers-s-and-t": "real numbers s and t ／ scalars s and t は OpenStax・CED・IM・CK-12 で 0 件",
    "as-p-moves": "as P moves ／ as P varies ／ moves along the circle は OpenStax・CED・IM・CK-12 で 0 件",
}

PHRASE_PRODUCT = ["group-study-check-on-desmos", "explaining-solution-graph-agrees", "discord-online-homework-not-accepting"]

PHRASE_EDIT = {
    # 1 つの意図（試験の指示の語の意味を聞く）に絞る。答えの形は exam-exact-form、途中式は exam-show-your-work
    "exam-clarify-instruction": {
        "en": 'Does "simplify" here mean I should rationalize the denominator? ／ When it says "simplify," do you want the denominator rationalized? ／ What do you mean by "simplify" here?',
    },
    # 米国の教材で形を確かめた（OpenStax Calculus Volume 3 の Let r(t) … be the position vector of a particle）
    "let-p-be-the-position-vector-of-p": {"source": "ledger/phrases-candidates.csv|OpenStax Calculus Volume 3（Let … be the position vector of …）"},
}


def fix_phrases() -> None:
    fields, rows = read("phrases.csv")
    by_id = {r["id"]: r for r in rows}
    merged_into = {old: new for new, olds in PHRASE_MERGE.items() for old in olds}
    out: list[dict[str, str]] = []
    for r in rows:
        rid = r["id"]
        if rid in merged_into:
            continue
        if rid in PHRASE_FRAGMENT:
            drop("phrases", rid, "terms に近い名詞句・断片（文として言う・書く意図がない）", PHRASE_FRAGMENT[rid])
            continue
        if rid in PHRASE_TERM:
            drop("phrases", rid, "同じ意図の terms がある", PHRASE_TERM[rid])
            continue
        if rid in PHRASE_JP_EXAM:
            drop("phrases", rid, f"日本の問題文の型の英訳で、米国の教材で確かめられない（{PHRASE_JP_EXAM[rid]}）")
            continue
        if rid in PHRASE_PRODUCT:
            drop("phrases", rid, "製品名の行（WebAssign ／ Desmos）")
            continue
        row = dict(r)
        row.update(PHRASE_EDIT.get(rid, {}))
        if rid in PHRASE_MERGE:
            olds = [by_id[o] for o in PHRASE_MERGE[rid]]
            ens = [row["en"]] + [o["en"] for o in olds]
            seen: list[str] = []
            for e in ens:
                for part in e.split(" ／ "):
                    if part.strip() and part.strip() not in seen:
                        seen.append(part.strip())
            row["en"] = " ／ ".join(seen)
            row["merged_from"] = "|".join(PHRASE_MERGE[rid])
        out.append(row)
    write("phrases.csv", fields + ["merged_from"], out)


def main() -> None:
    fix_symbols()
    fix_conventions()
    fix_phrases()
    with open(ROOT / "ledger" / "phase3-removed.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["ledger", "id", "reason", "covered_by"], lineterminator="\n")
        w.writeheader()
        w.writerows(removed)
    for name in ["symbols.csv", "conventions.csv", "phrases.csv"]:
        n = sum(1 for _ in csv.DictReader(open(ROOT / "ledger" / name, encoding="utf-8")))
        print(f"{name}: {n}")
    print(f"removed: {len(removed)} -> ledger/phase3-removed.csv")


if __name__ == "__main__":
    main()
