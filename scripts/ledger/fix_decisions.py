"""Decisions applied by fix_phase1.py to the Phase 1 ledger.

Each table is a human judgement, one line per row, so a reviewer can disagree
with a single line. Why the tables exist: docs/DECISIONS.md, "Phase 1 修正".
"""

# ---------------------------------------------------------------- 1. review 30
# Phase 1 report, "対応が怪しい語 30": all approved as proposed (2026-09-23).
# Additions from the review: 4 directly proportional, 17 relative maximum,
# 9 / 20 keep the written form as a variant.
# id -> fields to set. en_alt / en_variants / ja_alt are appended, not replaced.
REVIEW30 = {
    "vertex-form": {},
    "standard-form": {},
    "domain-and-range": {},
    "direct-proportion": {"en": "direct variation", "en_alt": ["direct proportion"],
                          "en_variants": [("directly proportional", "both")]},
    "proportion": {},
    "equation": {"ja_alt": ["等式"]},  # 6: 等式 / 方程式 folded (see MERGES)
    "polynomial": {"ja_alt": ["整式"]},  # 7
    "proposition": {"en": "statement", "en_alt": ["proposition"], "mapping": "near"},
    "necessary-and-sufficient-condition": {
        "en": "if and only if", "en_variants": [("necessary and sufficient condition", "written")]},
    "trigonometric-ratio": {"mapping": "near"},
    "terminal-side": {},
    "auxiliary-angle-form": {},
    "angle-addition-formulas": {"en": "sum and difference formulas", "en_alt": ["angle addition formulas"]},
    "trigonometric-inequality": {"mapping": "near"},
    "argument": {"en": "argument (of a logarithm)"},
    "derivative-at-a-point": {},
    "local-maximum": {"mapping": "near", "en_variants": [("relative maximum", "both")]},
    "opens-downward": {"en": "concave down", "en_alt": ["opens downward"]},
    "riemann-sum": {},
    "integration-by-substitution": {"en": "u-substitution",
                                    "en_variants": [("substitution", "written")]},
    "antiderivative": {"mapping": "near"},
    "point-of-internal-division": {"en": "point that divides the segment internally"},
    "the-five-centers-of-a-triangle": {"en": "points of concurrency"},
    "power-of-a-point": {},
    "tangent-chord-theorem": {"en": "tangent-chord angle"},
    "counting": {},
    "repeated-trials": {"en": "Bernoulli trials", "en_alt": ["binomial setting"]},
    "standard-score": {},
    "sequence-of-differences": {"en": "first differences"},
    "base-case": {},
}

# ------------------------------------------------------------- 3. merges/renames
# (from, into, main). main="from" makes the merged-away row's ja the headword
# and moves the surviving row's ja to ja_alt. Applied in order.
MERGES = [
    ("equation-houteishiki", "equation", "from"),
    ("variable-hanpirei", "variable", "from"),
    ("multiply-insuubunkai", "multiply", "into"),
    ("simplify-heihoukon", "simplify", "from"),
    ("simplify-equations", "simplify", "into"),
    ("pythagorean-theorem-alt", "pythagorean-theorem", "into"),
    ("polynomial-shiki", "polynomial", "into"),
    ("factor-out-the-common-factor-shiki", "factor-out-the-common-factor", "into"),
    ("element-alt", "element", "into"),
    ("x-intercept-kansuu", "x-intercept", "into"),
    ("x-intercept-functions", "x-intercept", "into"),
    ("sine-katakana", "sine", "into"),
    ("cosine-katakana", "cosine", "into"),
    ("tangent-katakana", "tangent", "into"),
    ("find-the-angle-keiryou", "find-the-angle", "into"),
    ("find-the-angle-seishitsu", "find-the-angle", "into"),
    ("measure-of-center-bunseki", "measure-of-center", "into"),
    ("angle-bisector-theorem-seishitsu", "angle-bisector-theorem", "from"),
    ("coordinates-katsudou", "coordinates", "into"),
    ("expansion-shoumei", "expansion", "into"),
    ("compare-shoumei", "compare", "into"),
    ("compare-coefficients-shoumei", "compare-coefficients", "into"),
    ("midpoint-houteishiki", "midpoint", "into"),
    ("centroid-houteishiki", "centroid", "into"),
    ("equation-of-a-line-houteishiki", "equation-of-a-line", "into"),
    ("parallel-lines-houteishiki", "parallel-lines", "into"),
    ("find-the-equation-houteishiki", "find-the-equation", "into"),
    ("intersect-houteishiki", "intersect", "into"),
    ("trigonometric-identities-kansuu", "trigonometric-identities", "into"),
    ("solve-for-theta-kansuu", "solve-for-theta", "into"),
    ("increasing-taisuu", "increasing", "into"),
    ("decreasing-taisuu", "decreasing", "into"),
    ("limit-kangae", "limit", "into"),
    ("local-maximum-alt", "local-maximum", "into"),
    ("local-minimum-alt", "local-minimum", "into"),
    ("rate-of-change-kangae", "rate-of-change", "into"),
    ("point-of-tangency-kangae", "point-of-tangency", "into"),
    ("geometric-mean-similarity", "geometric-mean", "into"),
    ("mean-suisoku", "mean", "into"),
    ("population-mean-suisoku", "population-mean", "from"),
    ("optimization-seikatsu", "optimization", "into"),
    ("parameter-bibun", "parameter", "from"),
    ("arc-length-circles", "arc-length", "into"),
    ("substitute-sekibun", "substitute", "into"),
    ("nth-root-heimen", "nth-root", "into"),
    ("rotation-heimen", "rotation", "into"),
    ("sketch-the-curve-heimen", "sketch-the-curve", "into"),
    ("distribute-equations", "distribute", "into"),
    ("evaluate-equations", "evaluate", "into"),
    ("solution-set-equations", "solution-set", "into"),
    ("function-notation-functions", "function-notation", "into"),
    ("domain-and-range-functions", "domain-and-range", "into"),
    ("arithmetic-sequence-functions", "arithmetic-sequence", "into"),
    ("geometric-sequence-functions", "geometric-sequence", "into"),
    ("perfect-square-trinomial-factoring", "perfect-square-trinomial", "into"),
    ("zero-product-property-factoring", "zero-product-property", "into"),
    ("leading-coefficient-factoring", "leading-coefficient", "into"),
    ("vertex-form-quadratics", "vertex-form", "into"),
    ("axis-of-symmetry-quadratics", "axis-of-symmetry", "into"),
    ("prove-proof", "prove", "into"),
    ("inverse-proof", "inverse", "into"),
    ("isosceles-triangle-triangles", "isosceles-triangle", "into"),
    ("ratio-of-areas-of-similar-figures-similarity", "ratio-of-areas-of-similar-figures", "into"),
    ("inscribed-angle-circles", "inscribed-angle", "into"),
    ("area-of-a-sector-circles", "area-of-a-sector", "into"),
    ("slant-height-volume", "slant-height", "into"),
    ("reflection-transformations", "reflection", "into"),
    ("complex-conjugate-numbers", "complex-conjugate", "into"),
    ("remainder-theorem-polynomials", "remainder-theorem", "into"),
    ("rational-function-functions", "rational-function", "into"),
    ("complex-fraction-functions", "complex-fraction", "into"),
    ("rational-exponent-functions", "rational-exponent", "into"),
    ("radical-function-functions", "radical-function", "into"),
    ("radical-equation-functions", "radical-equation", "from"),
    ("infinite-geometric-series-series", "infinite-geometric-series", "into"),
    ("z-score-statistics", "z-score", "into"),
    ("average-rate-of-change-functions", "average-rate-of-change", "into"),
    ("composition-of-transformations-functions", "composition-of-transformations", "into"),
    ("composition-linalg", "composition-of-transformations", "into"),
    ("absolute-value-equation-functions", "absolute-value-equation", "into"),
    ("double-angle-formulas-trigonometry", "double-angle-formulas", "into"),
    ("half-angle-formulas-trigonometry", "half-angle-formulas", "into"),
    ("component-form-vectors", "component-form", "into"),
    ("dot-product-vectors", "dot-product", "into"),
    ("parametric-equations-complex", "parametric-equations", "into"),
    ("base-case-induction", "base-case", "into"),
    ("squeeze-theorem-limits", "squeeze-theorem", "into"),
    ("removable-discontinuity-limits", "removable-discontinuity", "into"),
    ("power-rule-basics", "power-rule", "into"),
    ("chain-rule-advanced", "chain-rule", "into"),
    ("implicit-differentiation-advanced", "implicit-differentiation", "into"),
    ("linearization-applications", "linearization", "into"),
    ("extreme-value-theorem-applications", "extreme-value-theorem", "into"),
    ("critical-point-applications", "critical-point", "from"),
    ("first-derivative-test-applications", "first-derivative-test", "into"),
    ("absolute-extrema-applications", "absolute-extrema", "into"),
    ("concavity-applications", "concavity", "into"),
    ("riemann-sum-integration", "riemann-sum", "into"),
    ("fundamental-theorem-of-calculus-integration", "fundamental-theorem-of-calculus", "from"),
    ("function-defined-by-an-integral-integration", "function-defined-by-an-integral", "into"),
    ("integration-by-parts-techniques", "integration-by-parts", "into"),
    ("extrapolation-variable", "extrapolation", "into"),
    ("properties-of-logarithms-functions", "properties-of-logarithms", "into"),
    ("logarithmic-differentiation-derivatives", "logarithmic-differentiation", "into"),
    ("summation-notation-integration", "summation-notation", "into"),
    ("linear-transformation-transformations", "linear-transformation", "into"),
    ("one-to-one-transformations", "one-to-one", "into"),
    ("sample-space-probability", "sample-space", "into"),
    ("point-estimate-intervals", "point-estimate", "into"),
    ("proof-by-contradiction-proofs", "proof-by-contradiction", "into"),
    ("floor-function-functions", "floor-function", "into"),
    ("division-algorithm-theory", "division-algorithm", "into"),
    ("recursive-definition-recursion", "recursive-definition", "into"),
    # same concept, found while re-assigning mapping (no dedup suffix)
    ("direction-field", "slope-field", "from"),
    ("area-polar-calc2", "area-in-polar-coordinates", "into"),
    ("conics-in-polar-coordinates", "polar-equations-of-conics", "into"),
    ("stem-and-leaf-stats", "stem-and-leaf-plot", "into"),
    ("inclusion-exclusion", "inclusion-exclusion-principle", "into"),
    ("related-rates-calc1", "related-rates", "into"),
    ("trapezoidal-sum", "trapezoidal-rule", "from"),
    ("end-behavior-alg2", "end-behavior", "into"),
    ("reference-angle-alg2", "reference-angle", "into"),
    ("orthogonal-projection-linalg", "orthogonal-projection", "into"),
    # became duplicates when the review-30 English was applied
    ("sum-and-difference-formulas", "angle-addition-formulas", "into"),
    ("u-substitution", "integration-by-substitution", "into"),
]

# Merges that need the target renamed first (arc length of a curve is not the
# arc of a circle; 置き換える must free the id "substitute" for 代入する).
MERGES_AFTER_RENAME = [
    ("arc-length-integration", "arc-length-of-a-curve", "into"),
]

# old id -> new id (and optional field overrides). Same English, different
# concept: these stay separate entries under ids that say what they are.
RENAMES = [
    ("distance", "distance-traveled", {}),
    ("distance-zukei", "distance", {}),
    ("base-zukei", "base-of-a-solid", {}),
    ("base-shikakkei", "base-of-a-triangle", {}),
    ("cube-zukei", "cube-solid", {}),
    ("less-than-suu", "strictly-less-than", {}),
    ("solve-for", "solve-instruction", {}),
    ("solve-for-keisan", "solve-for", {}),
    ("divisor-keisan", "divisor-in-division", {}),
    ("substitution-houteishiki", "substitution-method", {"en": "substitution method"}),
    ("substitution-shiki", "substitution-new-variable", {}),
    ("range", "range-of-data", {}),
    ("range-kansuu", "range", {}),
    ("corresponding-angles-goudou", "corresponding-angles-of-congruent-figures", {}),
    ("square-shikakkei", "square-shape", {}),
    ("square-heihoukon", "square-a-number", {}),
    ("opposite-shikakkei", "opposite-facing", {}),
    ("factor-insuubunkai", "factor-an-expression", {}),
    ("group", "group-into-classes", {}),
    ("group-insuubunkai", "group-terms", {}),
    ("estimate", "bound-estimate", {}),
    ("estimate-chousa", "estimate", {}),
    ("intersection", "point-of-intersection", {"en": "point of intersection"}),
    ("intersection-meidai", "intersection", {}),
    ("hypothesis-bunseki", "statistical-hypothesis", {}),
    ("variable-bunseki", "statistical-variable", {}),
    ("complement-kakuritsu", "complementary-event", {"en": "complement (of an event)"}),
    ("addition-rule", "addition-principle", {}),
    ("addition-rule-kakuritsu", "addition-rule", {}),
    ("multiplication-rule", "multiplication-principle", {}),
    ("multiplication-rule-kakuritsu", "multiplication-rule", {}),
    ("median-seishitsu", "median-of-a-triangle", {}),
    ("congruence-katsudou", "congruence-modulo-n", {}),
    ("decimal-katsudou", "decimal-system", {}),
    ("sketch", "sketch-of-a-solid", {}),
    ("sketch-houteishiki", "sketch", {}),
    ("arithmetic-mean-suuretsu", "arithmetic-middle-term", {}),
    ("geometric-mean-suuretsu", "geometric-middle-term", {}),
    ("approximation", "approximate-number", {}),
    ("approximation-seikatsu", "approximation", {}),
    ("arc-length-sekibun", "arc-length-of-a-curve", {}),
    ("modulus-heimen", "modulus-of-a-complex-number", {}),
    ("argument-heimen", "argument-of-a-complex-number", {}),
    ("edge-kufuu", "edge-of-a-graph", {}),
    ("path-kufuu", "path-in-a-graph", {}),
    ("find-the-inverse-kufuu", "find-the-inverse-matrix", {}),
    ("graph-hanpirei", "draw-a-graph", {}),
    ("graph-kufuu", "graph-network", {}),
    ("secant", "secant-line", {}),
    ("secant-trigonometry", "secant", {}),
    ("power-proportions", "statistical-power", {}),
    ("implicit-function-derivatives", "implicit-function-theorem", {"en": "implicit function theorem"}),
    ("survey-data", "questionnaire", {}),
    ("quadratic-form", "equation-in-quadratic-form", {"en": "equation in quadratic form"}),
    ("quadratic-form-linalg", "quadratic-form", {}),
    ("x", "parent-function", {"note": "y = x², y = |x|, y = √x など"}),
    # data/terms/ sample ids win (Phase 0): 代入する is "substitute", 移項する is
    # "move-term-to-other-side". 置き換える gives up "substitute".
    ("substitute", "substitute-new-variable", {}),
    ("plug-in", "substitute", {}),
    ("move-to-the-other-side", "move-term-to-other-side", {}),
]

# Headword fixes found while re-assigning mapping. ja becomes the established
# Japanese term; the old headword is kept in ja_alt unless it is wrong.
JA_FIX = {
    "undefined-terms": ("無定義用語", ["点・直線・平面"]),
    "del": ("ナブラ", ["デル"]),
    "levels-of-measurement": ("尺度水準", ["変数の種類"]),
    "glide-reflection": ("映進", ["グライド反射"]),
    "slope-field": ("方向場", []),  # 勾配場 is the gradient field; do not keep it
    "am-gm-inequality": (None, ["相加平均と相乗平均の関係"]),
    "shell-method": (None, ["バウムクーヘン積分"]),
    "invertible-matrix": ("正則行列", ["可逆行列"]),  # Phase 1 修正 2: the one alt row that swaps
    "monotone-convergence-theorem": ("単調収束定理", ["単調数列定理"]),
    "trapezoidal-rule": (None, ["台形則"]),
    "mutually-exclusive": (None, ["排反"]),  # 〔用語・記号〕数学A
}

# ------------------------------------------------------ 2. Wikipedia verdicts
# The 210 rows whose langlink title differs from the provisional en.term.
# Everything not listed here is "記事名違いで問題なし" (same concept, the article
# is named differently or is the parent article that defines the term).
# Listed = a different concept: the langlink is dropped as a source.
WIKI_WRONG = {
    "algebraic-expression": "Polynomial は多項式。文字式は分数式も含む",
    "variable": "Writing system（文字体系）",
    "relationship": "Finitary relation は形式的な関係。中1 の「数量の関係」ではない",
    "plug-in": "Substitution (logic) は論理式の置換",
    "explain": "Explanation（数学外）",
    "set-up-a-system": "Coalition（連立政権）",
    "whisker": "Beard（髭）",
    "lottery": "Demarchy（くじ引き民主制）",
    "toss": "Throwing（投擲）",
    "estimate": "Evaluation（評価一般）",
    "braking-distance": "Brake（ブレーキ）",
    "scale-drawing": "Epitome (film)（映画「縮図」）",
    "draw-a-circle": "Igai ni Mango（楽曲）",
    "substitution-shiki": "Permutation（置換）",
    "bearing": "Cardinal direction（方位）は bearing ではない",
    "independent": "Independence（政治的独立）",
    "drawing-lots": "Demarchy（くじ引き民主制）",
    "centroid": "Center of mass は物理の質量中心。図形の重心は Centroid",
    "modulus": "Division (mathematics)。法（mod）ではない",
    "numerator": "Molecule（分子）",
    "terminal-side": "Radius（半径）",
    "trigonometric-inequality": "Triangle inequality（三角不等式 |a+b|≦|a|+|b|）",
    "local-maximum-alt": "Ordered set の極大元（maximal element）",
    "local-minimum-alt": "Ordered set の極小元（minimal element）",
    "common-difference": "Engineering tolerance（公差・工学）",
    "oscillate": "Oscillation（物理の振動）",
    "substitute-sekibun": "Permutation（置換）",
    "vector-equation": "System of linear equations は連立一次方程式",
    "cross-product": "Exterior algebra（外積代数）",
    "column": "Sequence（数列）。行列の列ではない",
    "elimination-method": "Process of elimination（消去法・推論）",
    "empirical-rule": "Rule of thumb（経験則一般）",
    "resultant": "Force（物理の力）",
    "limacon": "Caracole（騎兵戦術）",
    "power-rule-basics": "Power law（べき乗則・統計物理）",
    "axis-of-revolution": "Shaft (mechanical engineering)（機械の軸）",
    "explanatory-variable": "Expression (mathematics)（式）",
    "basis": "Base (topology)（開基）。線形代数の基底ではない",
    # found in the ja_check mismatch list (outside the 210)
    "base": "底 (初等幾何学) は図形の底。累乗の底（base of a power）ではない",
    # found while generating the differentiation units (Phase 2, 2026-09-24)
    "critical-point-applications": "Critical point (thermodynamics)（熱力学の臨界点）。関数の臨界点ではない",
    "divergence": "Divergence はベクトル場の発散（div）。数列・関数の発散ではない",
    "normal-line": "Normal vector は法線ベクトル。曲線の法線（直線）ではない",
}

# Rows the English check would accept only through a disambiguation page, but
# whose ja article is a different concept from the headword (修正 4). A
# disambiguation page lists every sense of a word, so linking to the ja
# article's langlink shows only that the word has that sense too - not that
# the headword means it. The disambiguation rule itself stays; these rows are
# excluded one by one, like WIKI_WRONG.
EN_CHECK_WRONG = {
    "substitution": "代入 (論理学) → Substitution (logic) は論理式の置換。式への値の代入ではない",
    "pole": "極 (複素解析) → Zeros and poles は複素関数の極。極座標の極（pole）ではない",
    "diverge": "発散 (ベクトル解析) → Divergence はベクトル場の発散（div）。数列・級数の発散ではない",
    "similarity-transformation": "行列の相似 → Matrix similarity は P⁻¹AP。図形の相似変換ではない",
    "characteristic-equation": "固有多項式 → Characteristic polynomial は行列の特性多項式。漸化式の特性方程式ではない",
}

# ----------------------------------------------------------- 4. level_jp "—"
# The level a Japanese student meets the underlying content at. Content that is
# not in the Japanese school curriculum at all is 大学 (same rule as the US-side
# terms). Rows that leave the ledger are in OUT_OF_SCOPE instead.
LEVEL_JP = {
    "pemdas": "中1", "tick-mark": "中1", "literal-equation": "中2",
    "point-slope-form": "中2", "rise-over-run": "中2", "negative-reciprocal": "数II",
    "foil": "中3", "ac-method": "数I", "box-method": "中3", "area-model": "中3",
    "prime-polynomial": "中3", "like-radicals": "中3", "dot-plot": "中1",
    "stem-and-leaf-plot": "大学", "mean-absolute-deviation": "大学",
    "segment-addition-postulate": "中1", "angle-addition-postulate": "中1",
    "linear-pair": "中2", "two-column-proof": "中2", "paragraph-proof": "中2",
    "flowchart-proof": "中2", "statements-and-reasons": "中2", "ruler-postulate": "中1",
    "alternate-exterior-angles": "中2", "same-side-exterior-angles": "中2",
    "perpendicular-postulate": "中1", "cpctc": "中2", "sohcahtoa": "数I",
    "use-inverse-trig-to-find-the-angle": "数I", "intercepted-arc": "中3",
    "apothem": "中1", "glide-reflection": "大学", "coordinate-rule": "中1",
    "coordinate-proof": "数II", "horizontal-line-test": "数III",
    "vertical-line-test": "中1", "family-of-functions": "数I", "end-behavior": "数III",
    "key-features-of-a-graph": "数I", "quadratic-regression": "大学", "hole": "数III",
    "joint-variation": "大学", "exponential-regression": "大学",
    "reference-angle-alg2": "数II", "coterminal-angle": "数II", "midline": "数II",
    "empirical-rule": "数B", "test-point": "数I", "expanding-and-condensing-logs": "数II",
    "one-to-one-property": "数II", "ambiguous-case": "数I", "orientation": "数C",
    "inductive-step": "数B", "finding-limits-numerically": "数III",
    "representations-of-a-function": "中1", "linear-functions-in-context": "中2",
    "conditional-relative-frequency": "大学", "geometric-modeling": "数A",
    "corner-nondifferentiable": "数III", "outer-function": "数III",
    "inner-function": "数III", "units-of-a-rate-of-change": "数II",
    "candidates-test": "数II", "optimization-problem": "数II",
    "connecting-f-f-prime-and-f-double-prime": "数III", "accumulation": "数III",
    "accumulation-function": "数II", "net-change": "数III",
    "overestimate-and-underestimate": "数III", "disk-method": "数III",
    "washer-method": "数III", "liate": "数III", "shape-center-and-spread": "数I",
    "skewed-right": "中1", "outlier-rule": "数I", "resistant-statistic": "数I",
    "checking-conditions": "数B", "tangent-problem": "数II", "area-problem": "数II",
    "areas-and-distances": "数III",
}

# Rows that leave the ledger for ledger/out-of-scope.csv, with the reason.
OUT_OF_SCOPE = {
    "unit-rate": "小学校範囲（単位量あたりの大きさ・小5）。v1 は中1 から（PLAN 4）",
    "foot": "数学用語ではない（ヤード・ポンド法）。conventions の日米慣習差で扱う",
    "mile": "数学用語ではない（ヤード・ポンド法）。conventions の日米慣習差で扱う",
    "sales-tax": "数学用語ではない（米国の文章題の生活文脈）。conventions で扱う",
    "tip": "数学用語ではない（米国の文章題の生活文脈）。conventions で扱う",
}

# --------------------------------------------------------------- 1. mapping
# mapping is the quality of the word correspondence, not the curriculum level.
# US-side rows that were "none" because they are outside Japanese high school:
# an established Japanese term (固有値 = eigenvalue) is exact. Only the rows
# below differ from exact. near = a Japanese term exists but does not line up
# one to one; none = Japan has no name for it (the headword is descriptive).
MAPPING = {
    # Japan has no name for these US classroom devices / terms
    "pemdas": "none", "literal-equation": "none", "point-slope-form": "none",
    "rise-over-run": "none", "foil": "none", "ac-method": "none", "box-method": "none",
    "parent-function": "none", "segment-addition-postulate": "none",
    "angle-addition-postulate": "none", "two-column-proof": "none",
    "paragraph-proof": "none", "flowchart-proof": "none", "statements-and-reasons": "none",
    "ruler-postulate": "none", "perpendicular-postulate": "none", "cpctc": "none",
    "sohcahtoa": "none", "coordinate-rule": "none", "horizontal-line-test": "none",
    "vertical-line-test": "none", "end-behavior": "none", "joint-variation": "none",
"coterminal-angle": "none", "midline": "none",
    "test-point": "none", "expanding-and-condensing-logs": "none", "ambiguous-case": "none",
    "candidates-test": "none", "net-change": "none", "disk-method": "none",
    "washer-method": "none", "liate": "none", "net-change-theorem": "none",
    "telescoping-series": "none",
    # a Japanese term or phrase exists but covers it only partly
    "negative-reciprocal": "near", "area-model": "near", "prime-polynomial": "near",
    "like-radicals": "near", "same-side-exterior-angles": "near", "linear-pair": "near",
    "use-inverse-trig-to-find-the-angle": "near", "intercepted-arc": "near",
    "coordinate-proof": "near", "family-of-functions": "near",
    "key-features-of-a-graph": "near", "hole": "near", "empirical-rule": "near",
    "one-to-one-property": "near", "orientation": "near", "inductive-step": "near",
    "representations-of-a-function": "near", "linear-functions-in-context": "near",
    "geometric-modeling": "near", "corner-nondifferentiable": "near",
    "outer-function": "near", "inner-function": "near",
    "connecting-f-f-prime-and-f-double-prime": "near", "accumulation": "near",
    "accumulation-function": "near", "shape-center-and-spread": "near",
    "outlier-rule": "near", "resistant-statistic": "near", "checking-conditions": "near",
    "infinite-discontinuity": "near", "vertical-tangent": "near", "related-rates": "near",
    "integration-by-long-division": "near", "shell-method": "near",
    "nth-term-test": "near", "lagrange-error-bound": "near", "influential-point": "near",
    "voluntary-response-bias": "near", "types-of-functions": "near",
    "fundamental-theorem-of-calculus-part-1": "near",
    "fundamental-theorem-of-calculus-part-2": "near", "stars-and-bars": "near",
    # established Japanese term, same concept
    "tick-mark": "exact", "dot-plot": "exact", "stem-and-leaf-plot": "exact",
    "mean-absolute-deviation": "exact", "alternate-exterior-angles": "exact",
    "apothem": "exact", "glide-reflection": "exact", "quadratic-regression": "exact",
    "exponential-regression": "exact", "optimization-problem": "exact",
    "overestimate-and-underestimate": "exact", "skewed-right": "exact",
    "tangent-problem": "exact", "area-problem": "exact", "areas-and-distances": "exact",
    "finding-limits-numerically": "exact", "conditional-relative-frequency": "exact",
    "units-of-a-rate-of-change": "exact", "undefined-terms": "exact",
    "levels-of-measurement": "exact", "del": "exact",
}

# Level corrections made while re-assigning mapping (content is in Japanese
# school maths, so 大学 was wrong).
LEVEL_JP_FIX = {
    "parent-function": "数I",
    "net-change-theorem": "数II",
    "telescoping-series": "数B",
    "trigonometric-substitution": "数III",
}

# ------------------------------------------------ Phase 1 修正 2 (2026-09-24)
# Wikipedia's own spellings -> the school textbook's. Headwords use the right
# side; the Wikipedia form is kept in ja_alt so it still finds the entry.
NOTATION = [("線型", "線形"), ("函数", "関数"), ("冪", "べき")]

# ------------------------------------------------ Phase 2 修正 (2026-09-24)
# One concept, one entry for the integral units (docs/DECISIONS.md "Phase 2
# 修正"). Applied by fix_phase1.py step 8, after the langlinks of step 7.
# The removed id stays in ledger/id-changes.csv as `merged-into` (new_id = the
# entry it went into) or `to-phrases`.

# The same concept on several rows (audits/phase2-integral-report.md D-3).
# (from, into). The other row's ja goes to ja_alt, its en to en_alt. Rows of a
# different pos stay apart (Phase 1: 平方 / 2 乗する are two rows), so
# find-an-antiderivative, decompose-into-partial-fractions, find-the-arc-length,
# let-u-equal and substitute-new-variable keep their own rows.
PHASE2_SAME = [
    # (from, into, headword): "into" keeps its ja; "from" makes the merged
    # row's ja the headword (the textbook term over a section name or a
    # translation of the US name)
    ("area-between-curves", "area-between-two-curves", "into"),
    ("area-bounded-by-curves", "area-between-two-curves", "into"),
    ("area-between-a-parabola-and-a-line", "area-between-two-curves", "into"),
    ("limit-of-riemann-sums", "limit-of-a-riemann-sum", "from"),  # 定積分と和の極限 is the section
    ("inverse-operation", "reverse-of-differentiation", "into"),
    ("integral-of-an-even-function", "integrals-of-even-and-odd-functions", "into"),
    ("integral-of-an-odd-function", "integrals-of-even-and-odd-functions", "into"),
    ("substitution-rule", "integration-by-substitution", "into"),
    ("integration-by-partial-fractions", "partial-fraction-decomposition", "into"),
    ("evaluate-the-definite-integral", "evaluate-the-integral", "into"),
    ("plus-c", "constant-of-integration", "into"),
    # 定積分で表された関数 is the 数II name; 累積関数 is this project's translation
    ("function-defined-by-an-integral", "accumulation-function", "from"),
    ("net-change-theorem", "net-change", "into"),
    # 累積 is the net change seen as accumulated change (its definition), not
    # the function F(x) = ∫ f(t)dt
    ("accumulation", "net-change", "into"),
]

# A textbook section name (D-4) goes into the entry for what the section
# teaches. The section name itself is not a word, so it does not become ja_alt
# or en_alt; its units and level do carry over.
PHASE2_SECTION = [
    ("antiderivatives", "antiderivative"),  # 不定積分と原始関数 (also D-3)
    ("definite-integrals-and-area", "area-under-the-curve"),
    ("velocity-and-position", "displacement"),
    ("areas-and-distances", "riemann-sum"),
    ("using-integral-tables", "integration-formulas"),
    ("integral-of-the-exponential-function", "integration-formulas"),
    ("probability-density-and-integrals", "probability-density-function"),
    ("inequalities-involving-integrals", "properties-of-integrals"),
    ("integrals-of-trigonometric-functions", "trigonometric-integrals"),
    ("integral-of-a-rational-function", "partial-fraction-decomposition"),
    ("integral-involving-radicals", "trigonometric-substitution"),
]

# A reading of a symbol: the row goes to data/symbols (the ledger note said so).
PHASE2_TO_SYMBOLS = {"the-integral-from-a-to-b": "integral-definite"}

# What a teacher says in class, not a term (Phase 3 phrases candidates).
# Written to ledger/phrases-candidates.csv; the text generated in Phase 2 is in
# git at 4d47e6f (data/terms/<id>.json).
PHASE2_TO_PHRASES = [
    "dont-forget-the-plus-c",
    "top-minus-bottom",
    "area-is-never-negative",
    "check-by-differentiating",
    "add-up-thin-disks",
    "find-the-intersections-to-get-the-limits",
    "split-the-integral",
    "write-as-a-limit-of-a-sum",
    "integrate-the-inequality",
    "the-area-of-the-region-bounded-by",
    # the same kind, beyond the list in the instruction
    "enclosed-region",  # "the region bounded by …": the frame of a problem statement
    "find-the-area-by-integration",  # a step of the procedure, like the two above
    "integrate-by-parts-repeatedly",  # "you'll have to integrate by parts twice"
]
PHASE2_FROM_COMMIT = "4d47e6f"

# ------------------------------------ Phase 2 微分の単元 (2026-09-24)
# The same rules as PHASE2_* (docs/DECISIONS.md "Phase 2 微分の単元"),
# applied before generating the differentiation and limit units. Applied by
# fix_phase1.py step 9, after step 8.

# The same concept on several rows: (from, into, headword), as PHASE2_SAME.
# Four "from" rows sit in units generated later (relative-maximum,
# derivatives-of-parametric-equations, composition-of-functions,
# convergence-of-a-sequence); merging them now keeps those units from making
# a second entry for the same concept.
PHASE2B_SAME = [
    ("relative-extrema", "local-extremum", "into"),
    ("relative-maximum", "local-maximum", "into"),
    ("higher-order-derivatives", "higher-order-derivative", "into"),
    ("linearization", "linear-approximation", "into"),
    ("tangent-line-approximation", "linear-approximation", "into"),
    ("diverges-to-infinity", "diverge-to-positive-infinity", "into"),
    # 導関数を求める and 微分する: the same act, and the same English
    # (differentiate / take the derivative / find the derivative)
    ("find-the-derivative", "differentiate", "into"),
    ("sketch-the-curve", "sketch-the-graph", "into"),
    ("differentiate-both-sides-with-respect-to-x", "differentiate-both-sides", "into"),
    ("e", "base-of-the-natural-logarithm", "into"),
    ("derivative-of-e-to-the-x", "derivative-of-the-exponential-function", "into"),
    ("derivative-of-natural-log", "derivative-of-the-logarithm", "into"),
    ("precise-definition-of-a-limit", "epsilon-delta-definition", "into"),
    ("limit-of-a-function", "limit", "into"),
    # the 定数倍 row in 微分の考え is the rule {kf(x)}' = kf'(x)
    ("constant-multiple", "constant-multiple-rule", "into"),
    ("derivatives-of-parametric-equations", "derivative-of-a-parametric-curve", "into"),
    ("composition-of-functions", "composite-function", "into"),
    ("convergence-of-a-sequence", "convergence", "into"),
]

# Textbook section names (and CED topic titles) -> the entry for what they
# teach, as PHASE2_SECTION: names do not become ja_alt / en_alt.
PHASE2B_SECTION = [
    # 不等式の証明への応用 etc.: f(x) = 左辺 − 右辺 の増減を調べる
    ("using-derivatives-to-prove-inequalities", "increasing-and-decreasing"),
    ("applying-derivatives-to-inequalities", "increasing-and-decreasing"),
    ("derivatives-and-inequalities", "increasing-and-decreasing"),
    ("applying-derivatives-to-equations", "number-of-real-solutions"),
    ("optimization", "optimization-problem"),  # 最大・最小の応用
    ("units-of-a-rate-of-change", "rate-of-change"),
    ("position-velocity-and-acceleration", "velocity"),
    ("connecting-f-f-prime-and-f-double-prime", "curve-sketching"),
    ("asymptotes-and-end-behavior", "limit-at-infinity"),
    ("concavity-and-the-second-derivative", "concavity"),
    ("sign-of-the-second-derivative", "concavity"),
    ("differentiability-and-continuity", "differentiability"),
    ("types-of-functions", "transcendental-function"),
    ("limit-theorems", "limit-laws"),
    ("computing-limits", "limit-laws"),
    ("limit-notation", "limit"),
    ("limit-involving-exponentials", "base-of-the-natural-logarithm"),
    ("limit-of-a-piecewise-function", "one-sided-limit"),
    ("evaluate-limits-algebraically", "find-the-limit"),
    ("notations-for-the-derivative", "leibniz-notation"),
    ("implicit-curves", "implicit-function"),
]

# A term with its argument filled in, or a collocation of it (use the chain
# rule, 0/0 form): merged without its names, like a section; the entry keeps
# it as a collocation or an example.
PHASE2B_INSTANCE = [
    ("approach-zero", "approaches"),
    ("use-the-chain-rule", "chain-rule"),
    ("use-the-product-rule", "product-rule"),
    ("apply-the-mean-value-theorem", "mean-value-theorem"),
    ("zero-over-zero", "indeterminate-form"),
    ("infinity-over-infinity", "indeterminate-form"),
    ("infinity-minus-infinity", "indeterminate-form"),
]

# Graph of a cubic function is a section name; what it teaches is the cubic
# function, which has no row of its own.
PHASE2B_RENAME = [
    ("graph-of-a-cubic-function", "cubic-function", {"ja": "3 次関数", "en": "cubic function"}),
]

# Readings of a symbol (the ledger note said "symbols へ"). derivative-prime
# exists; derivative-leibniz is new.
PHASE2B_TO_SYMBOLS = {
    "f-prime": "derivative-prime",
    "f-double-prime": "derivative-prime",
    "d-y-d-x": "derivative-leibniz",
    "d-d-x": "derivative-leibniz",
}

# What a teacher says, or a step of a procedure, not a term (Phase 3 phrases
# candidates). Not generated, so `from` is empty.
PHASE2B_TO_PHRASES = [
    "let-h-go-to-zero",
    "the-tangent-line-passes-through",
    "increasing-on-all-reals",
    "converges-to-zero",
    "divide-numerator-and-denominator-by-n",
    "rationalize-and-take-the-limit",
    "the-function-is-continuous",
    "the-one-sided-limits-agree",
    "take-the-log-and-differentiate",
    "differentiate-the-outside-first",
    "multiply-by-the-derivative-of-the-inside",
    "f-double-prime-is-positive",
    "changes-from-increasing-to-decreasing",
    "the-derivative-is-zero",
    "the-tangent-line-is-horizontal",
    "continuous-but-not-differentiable",
    "has-no-local-extrema",
    "the-limit-exists",
]


# ------------------------------------------ Phase 2 数列・級数・多変数の単元
# The same rules again (docs/DECISIONS.md "Phase 2 数列・級数・多変数の単元"),
# before generating AP Calculus AB Unit 7, BC Units 9-10, all of Calculus II
# and III, 数B 数列 and 数C 平面上の曲線と複素数平面. Applied by fix_phase1.py
# step 10, after step 9.
#
# Several "into" rows sit in units generated earlier (infinite-series,
# separable-differential-equation, ...) or later (locus, pure-imaginary-number,
# complex-conjugate, rotate, coordinates-in-space, equation-of-a-plane). A row
# merged into a later unit's row brings that row into these units, as
# probability-density-and-integrals did for probability-density-function.
PHASE2C_SAME = [
    # 円錐曲線 and 二次曲線: the same curves; 数C calls them 二次曲線
    ("conic", "conic-section", "into"),
    # 和の公式 in 数B is the Σ formulas (Σk, Σk², Σk³)
    ("sum-formula", "summation-formulas", "into"),
    ("evaluate-the-sum", "find-the-sum", "into"),
    # 初項から第 n 項までの和 is Sₙ, the nth partial sum
    ("sum-of-the-first-n-terms", "partial-sum", "into"),
    # 級数 in the Japanese curriculum is the infinite series of 数III
    ("series", "infinite-series", "into"),
    ("separable-equation", "separable-differential-equation", "into"),
    ("exponential-growth-and-decay-models", "exponential-model", "into"),
    ("logistic-equation", "logistic-differential-equation", "into"),
    ("three-dimensional-coordinate-system", "coordinates-in-space", "into"),
]

# Section names (textbook sections, CED topics) -> the entry for what they teach.
PHASE2C_SECTION = [
    ("verifying-solutions", "differential-equation"),  # CED 7.2
    ("convergence-and-divergence", "convergence"),
    ("strategy-for-testing-series", "infinite-series"),
    ("estimating-the-sum-of-a-series", "sum-of-the-series"),
    ("extrema-of-functions-of-two-variables", "local-extremum"),
    ("double-integrals-in-polar-coordinates", "double-integral"),
    ("representing-a-function-as-a-series", "power-series"),  # CED 10.15
    ("operations-on-power-series", "power-series"),
    ("approximating-functions", "taylor-polynomial"),
    ("arc-length-of-a-parametric-curve", "arc-length-of-a-curve"),  # CED 9.3
    ("arc-length-in-polar-coordinates", "arc-length-of-a-curve"),
    ("polar-equations-of-conics", "polar-equation"),
    ("translated-conics", "standard-form-of-a-conic"),
    ("conics-and-lines", "conic-section"),
    ("product-and-quotient-of-complex-numbers", "polar-form"),
    ("geometry-with-complex-numbers", "complex-plane"),
    ("lines-and-planes-in-space", "equation-of-a-plane"),
]

# A term with its argument filled in, or a collocation / a task on it.
PHASE2C_INSTANCE = [
    ("write-in-sigma-notation", "summation-notation"),
    ("form-an-arithmetic-sequence", "arithmetic-sequence"),
    ("write-in-polar-coordinates", "polar-coordinates"),
    ("write-in-polar-form", "polar-form"),
    ("convert-to-rectangular-coordinates", "rectangular-coordinates"),
    ("find-the-foci", "focus"),
    ("find-the-eccentricity", "eccentricity"),
    ("find-the-modulus-and-argument", "polar-form"),
    ("represent-the-complex-number-as-a-point", "complex-plane"),
    ("take-the-argument", "argument-of-a-complex-number"),
    ("distance-between-two-complex-numbers", "modulus-of-a-complex-number"),  # |z − w|
    ("the-figure-traced-by-z", "locus"),  # 点 z が描く図形 = the locus of z
    ("condition-to-be-purely-imaginary", "pure-imaginary-number"),
    ("condition-to-be-real", "complex-conjugate"),  # z が実数 ⇔ z̄ = z
    ("rotate-about-the-origin", "rotate"),
]

# Section names whose content has no row of its own.
PHASE2C_RENAME = [
    ("normal-and-binormal-vectors", "unit-normal-vector",
     {"ja": "主法線ベクトル", "en": "principal unit normal vector"}),
    ("velocity-and-acceleration-vectors", "velocity-vector", {"ja": "速度ベクトル", "en": "velocity vector"}),
]

# Readings of a symbol. summation-sigma exists; nabla is new.
PHASE2C_TO_SYMBOLS = {
    "sigma": "summation-sigma",
    "del": "nabla",
}

# Lines of a proof or of a procedure, not terms (Phase 3 phrases candidates).
PHASE2C_TO_PHRASES = [
    "assume-it-holds-for-n-k",
    "it-also-holds-for-n-k-1",
    "the-common-ratio-is-less-than-1",
    "multiply-by-r-and-subtract",
    "find-the-pattern",
]

# Out of scope for v1 (your call, 2026-09-24): the three ③ of the calculus
# units that are beyond the high-school-to-first-year range.
PHASE2C_OUT_OF_SCOPE = {
    "rationalizing-substitution": "beyond-v1",
    "differential-operator": "beyond-v1",
    "implicit-function-theorem": "beyond-v1",
}


# ------------------------------------- Phase 2 代数 2・Precalculus の単元
# The same rules again (docs/DECISIONS.md "Phase 2 代数 2・Precalculus の単元"),
# before generating 数II 三角関数・指数関数と対数関数・式と証明・複素数と方程式・
# 図形と方程式 and every Precalculus unit. Applied by fix_phase1.py step 11,
# after step 10.
#
# As in step 10, a row merged into a row of an earlier unit that has not been
# generated yet (solve, remainder, tangent-line, vector, ...) brings that row
# into these units. center-of-rotation (中1) goes into rotation, which the
# series units generated early (your note on the series report).
PHASE2D_SAME = [
    # 係数比較 and 係数を比較する: the same English (compare / equate coefficients)
    ("comparing-coefficients", "compare-coefficients", "into"),
    # 約分 and 約分する; 通分 and 通分する (differentiate / find the derivative)
    ("reducing-a-fraction", "reduce", "into"),
    ("finding-a-common-denominator", "find-a-common-denominator", "into"),
    ("partial-fractions", "partial-fraction-decomposition", "into"),
    # 整式の除法 is done by 筆算 (polynomial long division)
    ("long-division", "polynomial-division", "into"),
    # 等式の証明 and the US "verifying identities"
    ("verifying-identities", "proving-an-identity", "into"),
    ("polynomial-equation-of-degree-n", "polynomial-equation-of-higher-degree", "into"),
    # 円の方程式 is the standard form (x − a)² + (y − b)² = r²
    ("standard-form-of-a-circle", "equation-of-a-circle", "into"),
    # 右上がり ／ 単調増加 = is increasing (数II 微分の考え, generated)
    ("increasing", "is-monotonically-increasing", "into"),
    ("trigonometric-form-of-a-complex-number", "polar-form", "into"),
    ("finding-an-inverse", "find-the-inverse", "into"),
    ("area-under-a-curve", "area-under-the-curve", "into"),
]

# Section names -> the entry for what they teach.
PHASE2D_SECTION = [
    ("operations-with-rational-expressions", "rational-expression"),
    ("absolute-value-and-inequalities", "triangle-inequality"),  # |a + b| ≦ |a| + |b|
    ("arithmetic-of-complex-numbers", "complex-number"),
    ("solutions-of-a-quadratic-equation", "quadratic-formula"),
    ("real-and-nonreal-solutions", "imaginary-solution"),
    ("graphs-of-trigonometric-functions", "trigonometric-function"),
    ("maximum-and-minimum-of-trigonometric-functions", "trigonometric-function"),
    ("symmetry-of-functions", "even-function"),
    ("product-to-sum-and-sum-to-product", "product-to-sum-formulas"),
    ("graphs-of-inverse-trig-functions", "inverse-trigonometric-function"),
    ("composition-with-inverse-trig", "inverse-trigonometric-function"),
    ("extending-the-exponent", "laws-of-exponents"),
    ("graph-of-an-exponential-function", "exponential-function"),
    ("definition-of-a-logarithm", "logarithm"),
    ("graph-of-a-logarithmic-function", "logarithmic-function"),
    ("applications-of-exponentials-and-logs", "exponential-model"),
    ("graphing-rational-functions", "rational-function"),
    ("magnitude-and-direction", "vector"),
    ("graphs-of-polar-equations", "polar-equation"),
    ("focus-and-directrix", "focus"),
    ("major-and-minor-axes", "major-axis"),
    ("intuitive-definition-of-a-limit", "limit"),
    ("finding-limits-numerically", "find-the-limit"),
    ("finding-limits-graphically", "find-the-limit"),
    ("limit-definition-of-the-slope", "tangent-problem"),
    # 二次式の因数分解 is the subsection of 解と係数の関係 that factors ax² + bx + c
    # as a(x − α)(x − β) over the complex numbers
    ("factoring-over-the-complex-numbers", "relationship-between-roots-and-coefficients"),
]

# A term with its argument filled in, a collocation of it, or a task on it.
PHASE2D_INSTANCE = [
    ("solve-for-theta", "solve-for"),
    ("divide-using-synthetic-division", "synthetic-division"),
    ("is-an-identity", "identity"),
    ("write-as-a-square", "completing-the-square"),
    ("equality-holds-if-and-only-if", "equality-holds"),
    ("general-term-of-the-expansion", "general-term"),
    ("rational-expression-in-lowest-terms", "reduce"),
    ("proving-an-inequality", "prove"),  # 不等式の証明 = prove the inequality
    ("find-the-remainder", "remainder"),
    ("compare-the-exponents", "compare"),
    ("compare-the-arguments", "compare"),
    ("compare-real-and-imaginary-parts", "equality-of-complex-numbers"),
    ("two-distinct-imaginary-solutions", "imaginary-solution"),
    ("classify-the-solutions", "discriminant"),
    ("sum-of-the-roots", "relationship-between-roots-and-coefficients"),
    ("product-of-the-roots", "relationship-between-roots-and-coefficients"),
    ("use-the-factor-theorem", "factor-theorem"),
    ("cube-roots-of-unity", "nth-roots-of-unity"),  # n = 3
    ("omega", "nth-roots-of-unity"),  # ω, the imaginary cube root of 1
    ("rational-root", "rational-root-theorem"),
    ("real-coefficients", "conjugate-roots"),  # polynomial with real coefficients
    ("i-squared-equals-negative-one", "imaginary-unit"),
    ("take-the-conjugate", "complex-conjugate"),
    ("has-a-solution", "solution"),
    ("solve-the-equation", "solve"),
    ("coordinates-of-the-point-dividing-the-segment", "point-of-internal-division"),
    ("slopes-multiply-to-negative-one", "perpendicular-lines"),
    ("tangent-to-a-circle", "tangent-line"),
    ("equation-of-the-tangent-line", "tangent-line"),
    ("equation-of-the-locus", "locus"),
    ("set-of-points-satisfying-the-condition", "locus"),  # the set of all points … such that
    ("find-the-locus", "locus"),
    ("region-defined-by-an-inequality", "region"),
    ("region-defined-by-a-system-of-inequalities", "region"),
    ("including-the-boundary", "boundary"),
    ("not-including-the-boundary", "boundary"),
    ("coordinates-of-the-intersection", "point-of-intersection"),
    ("equation-of-the-perpendicular-bisector", "perpendicular-bisector"),
    ("reflection-of-a-point", "reflection"),
    ("symmetric-about-the-line", "symmetric"),
    ("find-the-distance", "distance"),
    ("shade-the-region", "sketch"),  # 領域を図示せよ
    ("eliminate-the-parameter", "parameter"),
    ("eliminating-the-parameter", "parameter"),
    ("express-in-radians", "radian-measure"),
    ("convert-to-degrees", "degree-measure"),
    ("find-the-period", "period"),
    ("use-the-addition-formula", "angle-addition-formulas"),
    ("use-the-double-angle-formula", "double-angle-formulas"),
    ("double-the-angle", "double-angle-formulas"),
    ("combine-into-a-single-sine", "auxiliary-angle-form"),
    ("find-tan-theta", "tangent"),
    ("shift-the-graph-horizontally", "phase-shift"),
    ("the-argument-must-be-positive", "argument"),  # 真数条件
    ("evaluate-the-logarithm", "logarithm"),
    ("find-the-number-of-digits", "number-of-digits"),
    ("complex-zeros", "zeros-of-a-polynomial"),
    ("nth-roots-of-a-complex-number", "nth-root"),
    ("foci-of-an-ellipse", "focus"),
    ("asymptotes-of-a-hyperbola", "asymptote"),
    ("center-of-rotation", "rotation"),  # 中1, into the entry generated with the series units
]

# Readings of a symbol. combination-ncr is new (C(n, r), "n choose r").
PHASE2D_TO_SYMBOLS = {
    "combination-notation": "combination-ncr",
}

# Lines of a proof, of a problem statement or of a procedure, not terms
# (Phase 3 phrases candidates).
PHASE2D_TO_PHRASES = [
    "squares-are-nonnegative",
    "take-the-difference-of-the-two-sides",
    "left-side-minus-right-side",
    "form-the-difference",
    "the-equation-holds",
    "what-we-want-to-show",
    "involves-imaginary-numbers",
    "one-of-the-solutions-is",
    "the-other-solutions",
    "as-p-moves",
    "conversely",
    "relation-between-x-and-y",
    "rewrite-the-expression",
    "on-the-interval-from-0-to-2",
    "the-value-of-sine-theta",
    "the-base-is-greater-than-1",
    "the-domain-is-the-positive-reals",
]

# ------------------------------------- Phase 2 統計・ベクトル・行列・線形代数の単元
# The same rules again (docs/DECISIONS.md "Phase 2 統計・ベクトルの単元"), before
# generating 中1〜中3 データの活用・標本調査, 数I データの分析, 数B 統計的な推測・
# 数学と社会生活, 数C ベクトル・表現の工夫, and every unit of AP Statistics, Intro
# Statistics and Linear Algebra. Applied by fix_phase1.py step 12, after step 11.
#
# As before, a row merged into a row of a unit not generated yet (tree-diagram,
# basic-properties-of-probability, expected-value) brings that row into these
# units, and rows of later units that are the same concept (two-way-table,
# independent-events, margin-of-error, the 数A multiplication-rule ...) are
# merged now so that no second entry appears later.
PHASE2E_SAME = [
    ("frequency-distribution", "frequency-table", "into"),  # 度数分布 is what the table shows
    ("measures-of-central-tendency", "measure-of-center", "into"),
    ("spread-of-the-data", "spread", "into"),
    ("measures-of-spread", "spread", "into"),
    ("simple-random-sample", "random-sampling", "into"),  # 無作為抽出 is the SRS of US courses
    ("sampling-variability", "sampling-error", "into"),  # AP and OpenStax name the same variation
    ("deviation-from-the-mean", "deviation", "into"),
    ("linear-independence", "linearly-independent", "into"),  # 線形独立 = 一次独立
    ("probability-distribution-function", "probability-distribution", "into"),  # OpenStax's PDF of a discrete variable
    ("combining-random-variables", "sum-of-random-variables", "into"),
    ("standardization", "standardize", "into"),  # 標準化: US courses use the verb
    ("is-statistically-significant", "statistically-significant", "into"),
    ("modeling", "mathematical-model", "into"),
    ("least-squares-regression-line", "regression-line", "into"),
    ("regression-equation", "regression-line", "into"),
    ("least-squares-solution", "least-squares", "into"),
    ("students-t-distribution", "t-distribution", "into"),
    ("matched-pairs", "paired-t-test", "into"),
    ("linear-map", "linear-transformation", "into"),
    ("kernel", "null-space", "into"),  # ker T = Nul A for T(x) = Ax
    ("range-linear-map", "column-space", "into"),  # range of T = Col A
    ("norm", "magnitude", "into"),  # ノルム = ベクトルの大きさ
    ("skewness-of-a-distribution", "skewness", "into"),
    # ばらつく and 散らばり: English says both with spread (the data are spread out)
    ("vary", "spread", "into"),
    # 推定する and 推定: English says both with estimate (noun and verb)
    ("estimate", "estimation", "into"),
    # AP "transforming data" and 数I 変量の変換: applying a function to every value
    ("transforming-data", "transformation-of-a-variable", "into"),
    # into entries already generated (Phase 2 統計・ベクトルの単元: fill in the new unit's sense)
    ("row-reduction", "gaussian-elimination", "into"),
    ("mean", "arithmetic-mean", "into"),  # 平均値 of data = 相加平均
    # rows of later units that are the same concept
    ("two-way-table", "contingency-table", "into"),
    ("independent-events", "independence-of-events", "into"),
    ("independent", "independence-of-events", "into"),  # 数A 独立 (of events and trials)
    ("margin-of-error", "error-bound", "into"),  # AP margin of error = OpenStax error bound
    ("multiplication-rule", "general-multiplication-rule", "from"),  # 数A 乗法定理 P(A∩B) = P(A)P_A(B); the textbook name heads
    ("addition-rule", "general-addition-rule", "from"),  # 数A 加法定理; US "addition rule" is the general form
    # Phase 2 統計・ベクトルの単元 2 (the rest of the same units, after the batch-4 stop)
    ("questionnaire", "survey", "into"),  # 質問票: English says survey for the form and the act (ばらつく -> spread)
]

# Section names -> the entry for what they teach.
PHASE2E_SECTION = [
    ("data-analysis", "data"),
    ("comparing-distributions", "compare"),
    ("measures-of-location", "percentile"),
    ("shape-center-and-spread", "distribution"),
    ("population-and-sample", "sample"),
    ("tree-and-venn-diagrams", "tree-diagram"),  # 中2 確率, generated now
    ("applications-of-the-normal-distribution", "normal-distribution"),
    ("continuous-probability-distribution", "continuous-random-variable"),
    ("probability-rules", "basic-properties-of-probability"),  # 数A, generated now
    ("inference-for-the-slope", "t-test-for-the-slope"),
    ("conclusion-of-a-test", "hypothesis-testing"),
    ("outliers-in-regression", "outlier"),
    ("linear-regression", "regression-line"),
    ("vectors-in-space", "vector"),
    ("properties-of-the-dot-product", "dot-product"),
    ("matrix-operations", "matrix"),
    ("solving-systems-with-matrices", "system-of-linear-equations"),
    ("existence-and-uniqueness", "system-of-linear-equations"),
    ("properties-of-determinants", "determinant"),
    ("determinants-as-volume", "determinant"),
    ("sampling-methods", "sampling"),  # Algebra 2
]

# A term with its argument filled in, a collocation of it, or a task on it.
PHASE2E_INSTANCE = [
    ("cumulative-relative-frequency-graph", "cumulative-relative-frequency"),
    ("more-spread-out", "spread"),
    ("less-spread-out", "spread"),
    ("large-standard-deviation", "standard-deviation"),
    ("identify-the-trend", "trend"),
    ("analyze-the-trend", "trend"),
    ("group-into-classes", "class"),  # データを階級に分ける
    ("first-quartile", "quartile"),
    ("third-quartile", "quartile"),
    ("length-of-the-box", "box-plot"),
    ("length-of-the-whisker", "whisker"),
    ("outlier-rule", "outlier"),  # the 1.5 × IQR rule
    ("remove-the-outliers", "outlier"),
    ("squared-deviation", "deviation"),
    ("make-a-scatter-plot", "scatter-plot"),
    ("strong-correlation", "correlation"),
    ("weak-correlation", "correlation"),
    ("no-correlation", "correlation"),
    ("find-the-correlation-coefficient", "correlation-coefficient"),
    ("state-the-null-hypothesis", "null-hypothesis"),
    ("reject-the-null-hypothesis", "reject"),
    ("compute-the-variance", "variance"),
    ("follows-a-normal-distribution", "normal-distribution"),
    ("is-approximately-normal", "normal-distribution"),
    ("construct-a-confidence-interval", "confidence-interval"),
    ("confidence-interval-for-the-slope", "confidence-interval"),
    ("compute-the-expected-value", "expected-value"),  # 数A, generated now
    ("fit-the-data", "mathematical-model"),
    ("required-sample-size", "sample-size"),
    ("skewed-right", "be-skewed"),
    ("skewed-distribution", "be-skewed"),  # Algebra 1
    ("find-the-magnitude", "magnitude"),
    ("condition-for-parallelism", "parallel-vectors"),
    ("condition-for-perpendicularity", "orthogonal"),  # a · b = 0
    ("resolve-the-vector", "decomposition-of-a-vector"),
    ("are-linearly-independent", "linearly-independent"),
    ("write-in-components", "component-form"),
    ("position-vector-of-the-dividing-point", "position-vector"),
    ("compute-the-dot-product", "dot-product"),
    ("find-the-angle-between", "angle-between-vectors"),
    ("represent-by-an-arrow", "vector"),
    ("find-the-inverse-matrix", "inverse-matrix"),
    ("multiply-the-matrices", "matrix-multiplication"),
    ("complex-eigenvalues", "eigenvalue"),
    ("diagonalization-of-symmetric-matrices", "diagonalization"),
    # Phase 2 統計・ベクトルの単元 2
    ("prediction", "regression-line"),  # 予測: what the regression line is used for (ŷ)
]

# Lines of a procedure, of a problem statement or of a class, not terms
# (Phase 3 phrases candidates).
PHASE2E_TO_PHRASES = [
    "split-at-the-median",
    "evaluate-critically",
    "organize-the-data",
    "probabilities-sum-to-1",
    "using-real-numbers-s-and-t",
    "let-p-be-the-position-vector-of-p",
    "express-as-a-vector",
    "organize-in-a-table",
    "represent-with-a-graph",
    "checking-conditions",
]

# ------------------------------- AP Statistics の CED 2026 年版（5 単元）への付け替え
# docs/DECISIONS.md "Phase 2 幾何・離散の単元の前の修正". The ledger's AP
# Statistics units were the nine units of the old CED; the CED in use (Effective
# Fall 2026, docs/SOURCES.md) has five. Applied by fix_phase1.py step 13, after
# every merge, to the rows, the phrases candidates and out-of-scope. The old ids
# are not used anywhere after this step.
AP_STATS_2026_UNITS = {
    "us-ap-statistics-1-exploring-and-collecting-data":
        ("Unit 1: Exploring One-Variable Data and Collecting Data",
         ["variables", "tables and graphs for one variable", "summary statistics", "comparing distributions",
          "random sampling and problems with sampling", "experimental design"],
         [("中1 データの活用", "some"), ("中3 標本調査", "some"), ("数学I データの分析", "most")]),
    "us-ap-statistics-2-probability-and-distributions":
        ("Unit 2: Probability, Random Variables, and Probability Distributions",
         ["two categorical variables", "simulation", "probability, mutually exclusive and independent events",
          "conditional probability", "random variables and their parameters", "binomial and normal distributions",
          "sampling distributions and the central limit theorem"],
         [("数学A 場合の数と確率", "most"), ("数学B 統計的な推測", "most")]),
    "us-ap-statistics-3-inference-for-proportions":
        ("Unit 3: Inference for Categorical Data: Proportions",
         ["estimators", "confidence intervals for a proportion and a difference of proportions",
          "tests for a proportion and a difference of proportions", "p-values", "Type I and Type II errors, power",
          "chi-square tests for homogeneity or independence"],
         [("数学B 統計的な推測", "some", "母比率の推定・検定のみ。2 つの比率の差とカイ二乗検定は日本の高校範囲外")]),
    "us-ap-statistics-4-inference-for-means":
        ("Unit 4: Inference for Quantitative Data: Means",
         ["sampling distributions for sample means", "t-intervals and t-tests for a mean or a mean difference",
          "intervals and tests for the difference of two means"],
         [("数学B 統計的な推測", "some", "母平均の推定のみ。t 分布は日本の高校範囲外")]),
    "us-ap-statistics-5-regression-analysis":
        ("Unit 5: Regression Analysis",
         ["scatter plots", "correlation", "linear regression models", "residuals", "least-squares regression"],
         [("数学I データの分析", "some", "散布図と相関係数まで。回帰直線は日本の高校範囲外")]),
}

# old unit -> new units (the first is where it is met first)
AP_STATS_2026_MAP = {
    "us-ap-statistics-1-one-variable": ["us-ap-statistics-1-exploring-and-collecting-data"],
    "us-ap-statistics-2-two-variable": ["us-ap-statistics-5-regression-analysis"],
    "us-ap-statistics-3-collecting-data": ["us-ap-statistics-1-exploring-and-collecting-data"],
    "us-ap-statistics-4-probability": ["us-ap-statistics-2-probability-and-distributions"],
    "us-ap-statistics-5-sampling-distributions": ["us-ap-statistics-2-probability-and-distributions"],
    "us-ap-statistics-6-proportions": ["us-ap-statistics-3-inference-for-proportions"],
    "us-ap-statistics-7-means": ["us-ap-statistics-4-inference-for-means"],
    "us-ap-statistics-8-chi-square": ["us-ap-statistics-3-inference-for-proportions"],  # 3.14-3.15 homogeneity or independence
    "us-ap-statistics-9-slopes": [],  # the 2026 CED has no inference for the slope
}

# Rows whose content moved elsewhere than their old unit's default (the CED
# topic in the comment). Replaces all of the row's AP Statistics units.
AP_STATS_2026_BY_ID = {
    "transformation-of-a-variable": ["us-ap-statistics-1-exploring-and-collecting-data"],  # 1.7.C changing units
    "explanatory-variable": ["us-ap-statistics-1-exploring-and-collecting-data", "us-ap-statistics-5-regression-analysis"],  # 1.10, 1.13, 5.1
    "response-variable": ["us-ap-statistics-1-exploring-and-collecting-data", "us-ap-statistics-5-regression-analysis"],
    "density-curve": ["us-ap-statistics-2-probability-and-distributions"],  # 2.11 the normal curve
    "sampling-distribution": ["us-ap-statistics-2-probability-and-distributions", "us-ap-statistics-3-inference-for-proportions",
                              "us-ap-statistics-4-inference-for-means"],  # 2.12, 3.2, 4.1
    "sampling-distribution-of-a-proportion": ["us-ap-statistics-3-inference-for-proportions"],  # 3.2
    "unbiased-estimator": ["us-ap-statistics-3-inference-for-proportions"],  # 3.1
    "confidence-interval": ["us-ap-statistics-3-inference-for-proportions", "us-ap-statistics-4-inference-for-means"],  # 3.3, 4.2 (not the slope)
    "degrees-of-freedom": ["us-ap-statistics-3-inference-for-proportions", "us-ap-statistics-4-inference-for-means"],  # 3.14 chi-square, 4.2 t
}

# Content the 2026 CED does not have (0 hits of the name and of the content in
# the CED text; docs/DECISIONS.md). "AP Statistics" leaves level_us and the row
# leaves the AP units; the course level is Intro Statistics. The value is the
# Intro Statistics unit to add when no US unit is left, or None.
AP_STATS_2026_DROP = {
    "cumulative-relative-frequency": "us-intro-statistics-sampling-and-data",  # only cumulative probability (2.8)
    "quartile-deviation": None,
    "covariance": None,
    "sum-of-random-variables": None,  # 2.9 has the mean and SD of one variable only
    "independent-random-variables": None,
    "linear-transformation-of-a-random-variable": None,
    "normal-approximation-to-the-binomial": None,
    "continuity-correction": None,
    "rejection-region": None,
    "bayes-theorem": "us-intro-statistics-probability",
    "geometric-distribution": "us-intro-statistics-discrete-distributions",
    "goodness-of-fit-test": "us-intro-statistics-hypothesis-testing",
    "t-test-for-the-slope": "us-intro-statistics-regression",
    "influential-point": "us-intro-statistics-regression",
    "normal-probability-plot": "us-intro-statistics-continuous-distributions",
    "line-graph": None,
}
# Not given Intro Statistics either: the entry itself says OpenStax
# Introductory Statistics does not have it (the human decision on covariance,
# 2026-09-25; quartile-deviation's mapping_note).
AP_STATS_2026_NO_INTRO = {"covariance", "quartile-deviation"}

# ------------------------- Phase 2 数I・数A・Geometry・Discrete Math の単元
# The same rules again (docs/DECISIONS.md "Phase 2 幾何・離散の単元"), before
# generating every unit of 数学I・数学A, Geometry and Discrete Math. Applied by
# fix_phase1.py step 14, after step 13. As before, a row merged into a row of a
# unit not generated yet (angle, triangle, chord, number-line ...) brings that
# row into these units.
PHASE2F_SAME = [
    ("euler-path", "eulerian-path", "into"),  # オイラー路: the entry is Euler trail (Levin)
    ("tangent-chord-angle", "tangent-chord-theorem", "into"),  # 接弦定理 is the angle between a tangent and a chord
    ("proof-by-contraposition", "proof-by-contrapositive", "into"),
    ("implication", "conditional-statement", "from"),  # p → q: Geometry's conditional statement = Levin's implication; 含意 heads
    ("at-least-one-of", "at-least-one", "into"),
    ("any", "all", "into"),  # 任意の = すべての (for any / for all)
    ("common-point", "point-of-intersection", "into"),  # 共有点: US courses say point(s) of intersection
    ("endpoint-of-the-interval", "endpoint", "into"),
    ("surveying", "indirect-measurement", "from"),  # 測量 in 数I = the US indirect measurement; 測量 heads
    ("mutually-exclusive", "mutually-exclusive-events", "into"),
    ("independent-trials", "independence-of-events", "into"),  # 独立な試行 (数A), generated with the statistics units
    ("bernoulli-trial", "repeated-trials", "into"),
    ("overlap", "double-count", "into"),  # ダブり
    ("order-doesnt-matter", "order-matters", "into"),
    ("internal-division", "point-of-internal-division", "into"),  # English has no noun for 内分 (STYLE 直訳禁止)
    ("external-division", "point-of-external-division", "into"),
    ("partition-a-segment", "point-of-internal-division", "into"),  # the Common Core wording of the same task
    ("collinear-points", "collinear", "into"),
    ("are-coplanar", "coplanar-points", "into"),
    ("residue", "remainder", "into"),  # 剰余 = 余り
    ("congruent-modulo", "congruence-modulo-n", "into"),
    ("path", "path-in-a-graph", "into"),  # 数A 経路
    ("base-angles-theorem", "isosceles-triangle-theorem", "into"),  # one theorem under two names
    ("rigid-transformation", "rigid-motion", "into"),
    ("inverse-sine", "arcsine", "into"),  # generated with the precalculus units
    ("cardinality", "number-of-elements", "into"),  # n(A); 要素の個数 heads
    ("probability-axioms", "basic-properties-of-probability", "into"),
    ("generalized-permutations", "permutation-with-repetition", "into"),
    ("substitution-new-variable", "substitute-new-variable", "into"),  # 置き換え (let t = x²)
    # かつ / または: the connectives themselves; bare "and" / "or" cannot be counted
    # (p and q in the corpus is mostly two points or two integers)
    ("and", "logical-connective", "into"),
    ("or", "logical-connective", "into"),
]

# Section names -> the entry for what they teach.
PHASE2F_SECTION = [
    ("finding-the-quadratic-function", "determine-the-coefficients"),
    ("trigonometric-ratios-of-obtuse-angles", "trigonometric-ratio"),
    ("applications-to-solid-geometry", "tetrahedron"),
    ("position-of-the-graph-relative-to-the-x-axis", "x-intercept"),
    ("properties-of-triangles", "triangle"),
    ("classifying-triangles", "triangle"),
    ("classifying-angles", "angle"),
    ("properties-of-cyclic-quadrilaterals", "cyclic-quadrilateral"),
    ("properties-of-integers", "divisibility"),
    ("fractions-and-decimals", "repeating-decimal"),
    ("proving-lines-parallel", "parallel-lines"),
    ("applications-of-vectors", "vector"),
    ("properties-of-chords", "chord"),
    ("writing-proofs", "proof"),
    ("set-operations", "set"),
    ("injective-and-surjective-functions", "bijection"),
    ("solving-recurrence-relations", "recurrence-relation"),
    ("discrete-probability", "probability"),
]

# A term with its argument filled in, a collocation of it, or a task on it.
PHASE2F_INSTANCE = [
    ("find-the-angle", "angle"),
    ("factor-out-the-common-factor", "common-factor"),
    ("the-inequality-sign-flips", "properties-of-inequalities"),
    ("divide-both-sides-by-a-negative-number", "properties-of-inequalities"),
    ("the-values-of-x-that-satisfy", "solution-set"),
    ("graph-on-a-number-line", "number-line"),
    ("intersection-of-the-solution-sets", "system-of-inequalities"),
    ("expand-and-simplify", "expansion"),
    ("evaluate-the-expression", "evaluate"),
    ("simplify-the-radical-expression", "simplify-radicals"),
    ("solve-the-inequality", "solve"),
    ("for-all-x", "all"),
    ("there-exists-x-such-that", "exist"),
    ("at-least-once", "at-least-one"),
    ("belong-to", "element"),  # x ∈ A: x is an element of A
    ("contain", "subset"),  # A ⊃ B
    ("if-and-only-if", "necessary-and-sufficient-condition"),  # 〜であるための必要十分条件は
    ("if-then", "conditional-statement"),
    ("prove-by-contradiction", "proof-by-contradiction"),
    ("give-a-counterexample", "counterexample"),
    ("is-true", "true"),
    ("does-not-hold", "false"),
    ("shape-of-the-graph", "sketch"),
    ("two-distinct-real-solutions", "real-solution"),
    ("has-no-real-solutions", "real-solution"),
    ("split-into-cases-by-the-position-of-the-axis", "split-into-cases"),
    ("count-by-cases", "split-into-cases"),
    ("the-x-that-gives-the-maximum", "maximum"),
    ("find-the-maximum", "maximum"),
    ("shift-the-parabola", "translation"),
    ("find-the-vertex", "vertex"),
    ("equation-of-the-axis-of-symmetry", "axis-of-symmetry"),
    ("compute-the-discriminant", "discriminant"),
    ("restrict-the-domain", "restricted-domain"),
    ("three-points-on-the-graph", "determine-the-coefficients"),
    ("value-of-the-trigonometric-ratio", "trigonometric-ratio"),
    ("side-ratios-of-a-right-triangle", "trigonometric-ratio"),  # 三角比 is defined as these ratios
    ("express-using-trigonometric-ratios", "trigonometric-ratio"),
    ("find-sin", "sine"),
    ("apply-the-law-of-sines", "law-of-sines"),
    ("using-the-law-of-cosines", "law-of-cosines"),
    ("area-formula", "area"),
    ("find-the-area", "area"),
    ("largest-angle", "side-angle-inequality"),  # the largest angle is opposite the longest side
    ("type-of-triangle", "triangle"),  # acute / right / obtuse from the law of cosines
    ("two-sides-and-the-included-angle", "sas-congruence"),
    ("volume-of-a-regular-tetrahedron", "tetrahedron"),
    ("tangent-is-sine-over-cosine", "trigonometric-identities"),
    ("use-the-complement", "complementary-event"),
    ("subtract-from-1", "complementary-event"),
    ("dependent", "independence-of-events"),  # 従属 = not independent
    ("are-identical", "distinguish"),  # 区別しない
    ("exactly-k-times", "binomial-probability"),
    ("multiply-the-probabilities", "independence-of-events"),
    ("divide-internally", "point-of-internal-division"),
    ("divide-externally", "point-of-external-division"),
    ("conditions-for-a-cyclic-quadrilateral", "cyclic-quadrilateral"),
    ("the-circles-are-externally-tangent", "relative-positions-of-two-circles"),
    ("the-circles-are-internally-tangent", "relative-positions-of-two-circles"),
    ("distance-between-the-centers", "relative-positions-of-two-circles"),
    ("number-of-vertices", "eulers-formula-for-polyhedra"),
    ("number-of-edges", "eulers-formula-for-polyhedra"),
    ("number-of-faces", "eulers-formula-for-polyhedra"),
    ("are-concurrent", "concurrent"),
    ("chord-length", "chord"),
    ("does-not-divide", "divisibility"),
    ("leaves-a-remainder-of-1", "remainder"),
    ("when-divided-by", "remainder"),
    ("is-a-multiple-of", "multiple"),
    ("factor-into-primes", "prime-factorization"),
    ("use-the-euclidean-algorithm", "euclidean-algorithm"),
    ("find-the-integer-solutions", "integer-solution"),
    ("write-in-base-n", "base-n"),
    ("find-the-gcd", "greatest-common-divisor"),
    ("segment-length", "segment"),
    ("statements-and-reasons", "two-column-proof"),
    ("definition-of-congruence", "congruent-figures"),
    ("prove-triangles-congruent", "congruent-figures"),
    ("corresponding-parts", "cpctc"),
    ("slopes-of-parallel-lines", "parallel-lines"),
    ("write-the-equation-of-a-parallel-line", "parallel-lines"),
    ("proportional-sides", "similar-triangles"),
    ("use-inverse-trig-to-find-the-angle", "arcsine"),
    ("translation-vector", "translation"),
    # batch 3: the radius of the circle (R, r) and the setting of a problem
    ("circumradius", "circumscribed-circle"),  # 外接円の半径
    ("inradius", "inscribed-circle"),  # 内接円の半径
    ("drawing-lots", "sampling-without-replacement"),  # くじ引き: drawing without putting back
]

# Rows renamed so that the id says what the entry is.
PHASE2F_RENAME = [
    ("congruent-figures", "congruent", {"pos": "adjective", "en": "congruent", "ja": "合同"}),  # 合同な図形 goes to ja_alt
    ("coplanar-points", "coplanar", {"pos": "adjective", "en": "coplanar", "ja": "同一平面上にある"}),
]

# Readings of a symbol. combination-ncr exists; permutation-npr, function-f-of-x
# and theta are new.
PHASE2F_TO_SYMBOLS = {
    "n-choose-r": "combination-ncr",
    "n-p-r": "permutation-npr",
    "f-of-x": "function-f-of-x",
    "theta": "theta",
}

# Lines of a proof, of a problem statement or of a procedure, not terms
# (Phase 3 phrases candidates). conversely went the same way (PHASE2D).
PHASE2F_TO_PHRASES = [
    "where",
    "clearly",
    "in-general",
    "assuming-leads-to-a-contradiction",
    "take-positive-values",
    "for-the-angle-theta",
    "point-outside-the-circle",
    "apply-the-theorem",
    "there-are-infinitely-many",
    "by-definition",
    "check-the-sign",
]

# Not mathematics terms (the 数A unit uses them as activities).
PHASE2F_OUT_OF_SCOPE = {
    "game": "数学用語ではない（数学と人間の活動の題材。ゲームの必勝法などは個別の語で扱う）",
    "puzzle": "数学用語ではない（数学と人間の活動の題材）",
}
