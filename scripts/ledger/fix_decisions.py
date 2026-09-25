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
