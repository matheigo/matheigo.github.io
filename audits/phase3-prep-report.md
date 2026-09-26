# Phase 3 の準備 — Phase 2 の修正 1〜7 と、記号・慣習差・フレーズの台帳

作成: 2026-09-25 ／ 対象: e5fbf5d（Phase 2 のまとめ）→ 本コミット
指示: audits/phase2-final-report.md と phase2-middle-school-3-report.md を受けた 1〜8。判断は `docs/DECISIONS.md` の「Phase 3 の準備の前の修正」と「Phase 3 の準備」。

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified の語は 0。Phase 3 の生成（data/symbols・phrases・conventions の本文）はまだしていない。

## まとめ

- **1**: level の参照に OpenStax Calculus を足した（CED の次）。middle-3 B-2 の微積分の **10 語は 10 語とも前の見出し（書き言葉 ① の言い方）に戻った**（evaluate the integral・differentiate both sides・sharp corner ほか）。substitute-new-variable を含めるため、前の level の参照が候補を使わなければ次の level を読むようにした
- **2**: constant-of-proportionality を constant of proportionality（人間の決定、variant に constant of variation（written））。**3**: quadratic-regression は draft のまま。**4**: PLAN の完了条件を統合後の台帳の全行に直した（この条件で Phase 2 は満たす）
- **5**: 米国の全 115 単元に中身でエントリを結びつけた。**0 語の単元はなくなった**（Precalculus の Trigonometric functions 0 → 33、Calculus I の Applications of integration 0 → 23、Integrated Math 1〜3 は 6 ／ 1 ／ 1 → 279 ／ 228 ／ 157、Pre-Algebra 13 → 245）。最も少ない単元は 6 語（Linear Algebra の Determinants）。どの単元にも入れられなかった語（213 組 ＋ Integrated 38）は一覧にした。Geometry に四角形の単元がない
- **6**: 出典が editorial だけの 124 語のうち 5 語に見出しを決めた参照を入れた。**残る 119 語**は一覧にして Phase 5 の論点に足した。**7**: move-term-to-other-side の例文 1 つを written に、F-6 に〔済〕
- **8**: 台帳 **symbols 220（目安 300）／ phrases 320（300）／ conventions 130（50）**。フレーズは**文でなく要の部分を terms と同じ規則で数える**ことにした。③ 5 件のうち **2 件が決まり**、1 件は数えられても比べる意味がなく（variants が別の質問）、2 件（学生の質問）は決まらない
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build`、`pnpm crosscheck` はすべて終了コード 0（E）

## A. 1〜7 の結果

### A-1. level の参照に OpenStax Calculus を足した

`lib.ts` に `levelTiersOf`・`levelReferences` を足し、`count.ts` が OpenStax Calculus（Volume 1〜3）だけの件数（本文と節の名前）を `ReferenceHits.openstaxCalculus` に数えるようにした（単体テストを足し、level の順の既存テストを直した）。

- level.us に AP Calculus AB／BC か Calculus I〜III がある語は、**CED、その次に OpenStax Calculus** を見る。AP Statistics だけの語は CED だけ
- level の順は 中学（IM）→ Geometry（CK-12・IM）→ 微積分（CED → OpenStax Calculus）→ AP Statistics（CED）。**前の level の参照が候補を使わなければ次の level を読む**（最初に候補を使う参照で決める）。substitute-new-variable は level.jp に中3、level.us に AP Calculus AB・Calculus I がある。前の規則では IM だけを見て止まり（IM は候補を使わない）話し言葉の首位のままだった。指示の条件（level.us が微積分）に当たるので、CED・OpenStax Calculus まで進むようにした（DECISIONS）
- 前の level の参照が言い方を決めた語は変わらない（lateral-area・rectangular-prism・significant-figures は話し言葉の首位のまま）

**middle-3 B-2 の 10 語を判定し直した結果: 10 語とも変わり、前の見出し（書き言葉 ① の言い方）に戻った。** どれも CED は候補を使わず、OpenStax Calculus が書き言葉の首位と同じ言い方を最も多く使う。

| id | 見出し（middle-3 → 今） | 話し言葉の首位（spoken の variant に） |
|---|---|---|
| arctangent | arctangent → **inverse tangent** | arctangent（Khan Academy 頼み） |
| change-the-limits-of-integration | change the bounds → **change the limits of integration** | change the bounds（MIT 18.01 頼み） |
| corner-nondifferentiable | sharp turn → **sharp corner** | sharp turn（Khan Academy 頼み） |
| derivative-of-a-vector-function | derivative of a vector function → **derivative of a vector-valued function** | derivative of a vector function（Professor Leonard 頼み） |
| differentiate-both-sides | take the derivative of both sides → **differentiate both sides** | take the derivative of both sides（Khan Academy 頼み） |
| evaluate-the-integral | compute the integral → **evaluate the integral** | compute the integral（MIT 18.02 頼み） |
| find-the-equation-of-the-tangent-line | find the equation of the tangent line → **find an equation of the tangent line** | find the equation of the tangent line（Khan Academy 頼み） |
| hyperbolic-functions | hyperbolic trig functions → **hyperbolic functions** | hyperbolic trig functions（MIT 18.01 頼み） |
| substitute-new-variable | make a substitution → **make the substitution** | make a substitution（Professor Leonard 頼み） |
| trigonometric-substitution | trig substitution → **trigonometric substitution** | trig substitution（MIT 18.01 頼み） |

10 語のファイルは 8b4e93c（middle-3 の修正）の前の版に戻した。8b4e93c 以後この 10 語を変えたコミットはなく、8b4e93c が変えたのは en.term・register・variants・本文の「見出しは…」の文と例文 1 文だけだった。ほかの語で見出しが変わったものはない（`corpus:decide` の「エントリ側で直すこと」0）。見出しの規則に当たる語は 35 のまま。

### A-2. constant-of-proportionality

en.term を **constant of proportionality**（IM Grade 7・8 の glossary、Khan Academy の中学）、**constant of variation を register written の variant**（Algebra の教科書。OpenStax Elementary Algebra・Algebra and Trigonometry）にした。flag は corpus-human-settled（見出しの register は主張しない。aas-congruence と同じ形）。pitfalls の 1 つ目を見出しの理由に合わせて書き直し、sources に OpenStax Elementary Algebra を足した。decide はこの語を「人間が見出しを決めたが、今はコーパスで決まるもの」に出す（話し言葉 ① constant of proportionality ／ 書き言葉 ① constant of variation。エントリと食い違いはない）。

「OpenStax の本をまとめて 1 ソースと数えるか」は `phase2-final-report.md` F-2 に Phase 5 の論点として足した。

### A-3. quadratic-regression

confidence draft のまま（draft-reason・corpus-undecided の flag もそのまま）。

### A-4. PLAN §9 Phase 2 の完了条件

「台帳の全行（1 概念 1 エントリの統合後）が likely 以上、draft は理由付きで一覧化」に直し、「2,000 語は Phase 1 の統合前の見積もり。統合の記録は ledger/id-changes.csv」と書き添えた。**この条件で Phase 2 は満たす**（台帳 1,540 行すべてにエントリ、likely 1,528、draft 12 は理由付きで phase2-final-report D に一覧）。

### A-5. 米国の単元の term_refs

**米国の全 115 単元**について、中身で既存のエントリを結びつけた（新しいエントリ・単元は作っていない）。0 語や数語の単元だけでなく、コースの語が単元に入っていないものを全部見た。

1. **伝統的なコース**（Pre-Algebra・Algebra 1・Geometry・Algebra 2・Precalculus・AP Calculus AB／BC・AP Statistics・Calculus I〜III・Linear Algebra・Intro Statistics・Discrete Math）: level.us にそのコースがあるのにどの単元にも入っていない語（1,912 組）を、単元の topics・jp_equivalents・語の日本の単元と定義から 1 つ（両方で教える語は 2 つ）の単元に振った。当てはまる単元がない語は振らずに一覧にした（none、213 組）。level.us は変えていない
2. **Integrated Math 1〜3**: 同じ内容の Algebra 1／Geometry／Algebra 2 の単元（1 の後）と、jp_equivalents の日本の単元の語を候補にし、単元の topics で選んだ。入れた語の level.us にそのコースを足した（470 語）。level.us に Integrated Math があるのに入らなかった語は none（1: 33、2: 5）
3. 振り分けの後も 10 語に満たなかった単元を topics で見直し、同じ内容の単元の語を手で足した（Calculus I の Applications of integration に 21 語、Algebra 1 の Exponents に 8 語、Geometry の Coordinate geometry に 3 語、Intro Statistics の Regression に 11 語・Probability に 7 語、Calculus III の Multiple integration に 2 語。足した語の level.us にそのコースを足した）

振り分けは 11 の下請け（コースごと）に判断させた。結果の 1 組ずつは読んでいない。どの語もちょうど 1 回（振るか none か）出ることと単元の id をスクリプトで確かめ、none と「迷った語」の報告を読んだ。日本の単元の term_refs は変えていない。どの単元にも入らない語は 0。level.us を足した後も `corpus:decide` の直すことは 0（level の参照の規則に効く Geometry・微積分を足した語でも見出しは変わらない）。

**コース別（単元の term_refs の和集合。前 = Phase 2 終了時）**

| コース | 単元数 | 前 | 後 | うち draft |
|---|---|---|---|---|
| Pre-Algebra | 6 | 13 | 245 |  |
| Algebra 1 | 8 | 74 | 271 |  |
| Geometry | 10 | 98 | 305 |  |
| Algebra 2 | 9 | 71 | 258 | 1 |
| Integrated Math 1 | 6 | 6 | 279 |  |
| Integrated Math 2 | 5 | 1 | 228 |  |
| Integrated Math 3 | 6 | 1 | 157 |  |
| Precalculus | 11 | 70 | 302 | 4 |
| AP Calculus AB | 8 | 72 | 189 |  |
| AP Calculus BC | 3 | 32 | 58 |  |
| AP Statistics | 5 | 59 | 115 |  |
| Calculus I | 6 | 24 | 206 |  |
| Calculus II | 6 | 30 | 109 |  |
| Calculus III | 5 | 41 | 84 |  |
| Linear Algebra | 6 | 59 | 75 | 3 |
| Intro Statistics | 8 | 44 | 106 | 2 |
| Discrete Math | 7 | 67 | 178 | 3 |

**単元別（米国の 115 単元）**

| コース | 単元 | id | 前 | 後 | うち draft |
|---|---|---|---|---|---|
| Pre-Algebra | Data and probability | us-pre-algebra-data-and-probability | 0 | 45 |  |
| Pre-Algebra | Expressions and equations | us-pre-algebra-expressions-and-equations | 9 | 51 |  |
| Pre-Algebra | Geometry basics and measurement | us-pre-algebra-geometry-basics | 0 | 80 |  |
| Pre-Algebra | Integers and signed numbers | us-pre-algebra-integers | 0 | 38 |  |
| Pre-Algebra | Fractions, decimals, and rational numbers | us-pre-algebra-rational-numbers | 0 | 14 |  |
| Pre-Algebra | Ratios, proportions, and percents | us-pre-algebra-ratios-and-percents | 4 | 23 |  |
| Algebra 1 | Exponents and exponential functions | us-algebra-1-exponents-and-exponential-functions | 5 | 15 |  |
| Algebra 1 | Linear equations and inequalities | us-algebra-1-linear-equations | 8 | 70 |  |
| Algebra 1 | Linear functions and graphs | us-algebra-1-linear-functions | 18 | 57 |  |
| Algebra 1 | Polynomials and factoring | us-algebra-1-polynomials-and-factoring | 12 | 42 |  |
| Algebra 1 | Quadratic functions and equations | us-algebra-1-quadratics | 13 | 28 |  |
| Algebra 1 | Radical expressions | us-algebra-1-radicals | 5 | 18 |  |
| Algebra 1 | Data and statistics | us-algebra-1-statistics | 7 | 31 |  |
| Algebra 1 | Systems of equations and inequalities | us-algebra-1-systems | 6 | 16 |  |
| Geometry | Area and volume | us-geometry-area-and-volume | 9 | 45 |  |
| Geometry | Circles | us-geometry-circles | 13 | 48 |  |
| Geometry | Congruent triangles | us-geometry-congruent-triangles | 14 | 35 |  |
| Geometry | Coordinate geometry | us-geometry-coordinate-geometry | 3 | 10 |  |
| Geometry | Foundations of geometry | us-geometry-foundations | 13 | 42 |  |
| Geometry | Parallel and perpendicular lines | us-geometry-parallel-and-perpendicular | 7 | 18 |  |
| Geometry | Reasoning and proof | us-geometry-reasoning-and-proof | 18 | 47 |  |
| Geometry | Right triangles and trigonometry | us-geometry-right-triangles-and-trig | 4 | 32 |  |
| Geometry | Similarity | us-geometry-similarity | 10 | 19 |  |
| Geometry | Transformations | us-geometry-transformations | 10 | 19 |  |
| Algebra 2 | Exponential and logarithmic functions | us-algebra-2-exponential-and-logarithmic | 5 | 26 |  |
| Algebra 2 | Functions and their graphs | us-algebra-2-functions | 11 | 33 |  |
| Algebra 2 | Polynomial functions | us-algebra-2-polynomials | 11 | 34 |  |
| Algebra 2 | Probability and statistics | us-algebra-2-probability-and-statistics | 9 | 48 |  |
| Algebra 2 | Quadratic functions and complex numbers | us-algebra-2-quadratics-and-complex-numbers | 4 | 32 | 1 |
| Algebra 2 | Radical functions and rational exponents | us-algebra-2-radical-functions | 5 | 11 |  |
| Algebra 2 | Rational functions | us-algebra-2-rational-functions | 10 | 17 |  |
| Algebra 2 | Sequences and series | us-algebra-2-sequences-and-series | 6 | 29 |  |
| Algebra 2 | Trigonometric functions | us-algebra-2-trigonometry | 11 | 36 |  |
| Integrated Math 1 | Congruence and transformations | us-integrated-1-congruence-and-transformations | 0 | 94 |  |
| Integrated Math 1 | Coordinate geometry | us-integrated-1-coordinate-geometry | 0 | 21 |  |
| Integrated Math 1 | Exponential functions | us-integrated-1-exponential | 0 | 22 |  |
| Integrated Math 1 | Linear equations, inequalities, and functions | us-integrated-1-linear | 2 | 106 |  |
| Integrated Math 1 | Statistics | us-integrated-1-statistics | 4 | 40 |  |
| Integrated Math 1 | Systems of equations and inequalities | us-integrated-1-systems | 0 | 19 |  |
| Integrated Math 2 | Circles and solids | us-integrated-2-circles | 0 | 54 |  |
| Integrated Math 2 | Polynomials, radicals, and complex numbers | us-integrated-2-polynomials-and-complex | 0 | 57 |  |
| Integrated Math 2 | Probability | us-integrated-2-probability | 0 | 37 |  |
| Integrated Math 2 | Quadratic functions and equations | us-integrated-2-quadratics | 0 | 39 |  |
| Integrated Math 2 | Similarity and right triangle trigonometry | us-integrated-2-similarity-and-trig | 1 | 44 |  |
| Integrated Math 3 | Exponential and logarithmic functions | us-integrated-3-exponential-and-logarithmic | 0 | 25 |  |
| Integrated Math 3 | Geometric modeling | us-integrated-3-geometric-modeling | 1 | 15 |  |
| Integrated Math 3 | Statistics and inference | us-integrated-3-inference | 0 | 23 |  |
| Integrated Math 3 | Polynomial functions | us-integrated-3-polynomials | 0 | 33 |  |
| Integrated Math 3 | Rational and radical functions | us-integrated-3-rational-and-radical | 0 | 34 |  |
| Integrated Math 3 | Trigonometric functions | us-integrated-3-trigonometric-functions | 0 | 34 |  |
| Precalculus | Analytic trigonometry | us-precalculus-analytic-trigonometry | 13 | 28 | 1 |
| Precalculus | Conic sections | us-precalculus-conics | 6 | 23 |  |
| Precalculus | Exponential and logarithmic functions | us-precalculus-exponential-and-logarithmic | 5 | 30 |  |
| Precalculus | Functions | us-precalculus-functions | 8 | 24 |  |
| Precalculus | Introduction to calculus | us-precalculus-limits | 4 | 16 |  |
| Precalculus | Systems and matrices | us-precalculus-matrices-and-systems | 9 | 27 |  |
| Precalculus | Polar coordinates, complex numbers, and parametric equations | us-precalculus-polar-and-complex | 9 | 21 |  |
| Precalculus | Polynomial and rational functions | us-precalculus-polynomial-and-rational | 6 | 35 |  |
| Precalculus | Sequences, series, and induction | us-precalculus-sequences-and-induction | 2 | 40 | 3 |
| Precalculus | Trigonometric functions | us-precalculus-trigonometry | 0 | 33 |  |
| Precalculus | Vectors | us-precalculus-vectors | 9 | 30 |  |
| AP Calculus AB | Unit 1: Limits and continuity | us-ap-calculus-ab-1-limits | 10 | 33 |  |
| AP Calculus AB | Unit 2: Differentiation — definition and fundamental properties | us-ap-calculus-ab-2-differentiation-basics | 9 | 33 |  |
| AP Calculus AB | Unit 3: Differentiation — composite, implicit, and inverse functions | us-ap-calculus-ab-3-differentiation-advanced | 8 | 18 |  |
| AP Calculus AB | Unit 4: Contextual applications of differentiation | us-ap-calculus-ab-4-contextual-applications | 6 | 11 |  |
| AP Calculus AB | Unit 5: Analytical applications of differentiation | us-ap-calculus-ab-5-analytical-applications | 11 | 29 |  |
| AP Calculus AB | Unit 6: Integration and accumulation of change | us-ap-calculus-ab-6-integration | 13 | 44 |  |
| AP Calculus AB | Unit 7: Differential equations | us-ap-calculus-ab-7-differential-equations | 6 | 7 |  |
| AP Calculus AB | Unit 8: Applications of integration | us-ap-calculus-ab-8-applications-of-integration | 9 | 17 |  |
| AP Calculus BC | Unit 10: Infinite sequences and series | us-ap-calculus-bc-10-series | 21 | 34 |  |
| AP Calculus BC | Units 6–8 (BC only): Integration by parts, partial fractions, improper integrals, Euler's method, logistic models, arc length | us-ap-calculus-bc-6-integration-techniques | 6 | 11 |  |
| AP Calculus BC | Unit 9: Parametric equations, polar coordinates, and vector-valued functions | us-ap-calculus-bc-9-parametric-polar-vector | 5 | 13 |  |
| AP Statistics | Unit 1: Exploring One-Variable Data and Collecting Data | us-ap-statistics-1-exploring-and-collecting-data | 27 | 42 |  |
| AP Statistics | Unit 2: Probability, Random Variables, and Probability Distributions | us-ap-statistics-2-probability-and-distributions | 6 | 24 |  |
| AP Statistics | Unit 3: Inference for Categorical Data: Proportions | us-ap-statistics-3-inference-for-proportions | 19 | 37 |  |
| AP Statistics | Unit 4: Inference for Quantitative Data: Means | us-ap-statistics-4-inference-for-means | 7 | 11 |  |
| AP Statistics | Unit 5: Regression Analysis | us-ap-statistics-5-regression-analysis | 6 | 13 |  |
| Calculus I | Applications of derivatives | us-calculus-1-applications-of-derivatives | 5 | 46 |  |
| Calculus I | Applications of integration | us-calculus-1-applications-of-integration | 0 | 23 |  |
| Calculus I | Derivatives | us-calculus-1-derivatives | 2 | 48 |  |
| Calculus I | Functions and graphs | us-calculus-1-functions | 5 | 17 |  |
| Calculus I | Integration | us-calculus-1-integration | 8 | 46 |  |
| Calculus I | Limits | us-calculus-1-limits | 4 | 32 |  |
| Calculus II | Applications of integration | us-calculus-2-applications-of-integration | 4 | 18 |  |
| Calculus II | Introduction to differential equations | us-calculus-2-differential-equations | 6 | 11 |  |
| Calculus II | Parametric equations and polar coordinates | us-calculus-2-parametric-and-polar | 3 | 23 |  |
| Calculus II | Power series | us-calculus-2-power-series | 4 | 11 |  |
| Calculus II | Sequences and series | us-calculus-2-sequences-and-series | 5 | 27 |  |
| Calculus II | Techniques of integration | us-calculus-2-techniques-of-integration | 8 | 19 |  |
| Calculus III | Multiple integration | us-calculus-3-multiple-integrals | 7 | 10 |  |
| Calculus III | Differentiation of functions of several variables | us-calculus-3-partial-derivatives | 12 | 14 |  |
| Calculus III | Vector calculus | us-calculus-3-vector-calculus | 10 | 12 |  |
| Calculus III | Vector-valued functions | us-calculus-3-vector-valued-functions | 6 | 8 |  |
| Calculus III | Vectors in space | us-calculus-3-vectors-in-space | 6 | 44 |  |
| Linear Algebra | Determinants | us-linear-algebra-determinants | 5 | 6 |  |
| Linear Algebra | Eigenvalues and eigenvectors | us-linear-algebra-eigenvalues | 11 | 11 | 1 |
| Linear Algebra | Linear transformations | us-linear-algebra-linear-transformations | 8 | 8 |  |
| Linear Algebra | Orthogonality and least squares | us-linear-algebra-orthogonality | 11 | 13 |  |
| Linear Algebra | Systems of linear equations and matrices | us-linear-algebra-systems-and-matrices | 14 | 27 | 2 |
| Linear Algebra | Vector spaces | us-linear-algebra-vector-spaces | 13 | 13 |  |
| Intro Statistics | Confidence intervals | us-intro-statistics-confidence-intervals | 4 | 12 |  |
| Intro Statistics | Continuous random variables and the normal distribution | us-intro-statistics-continuous-distributions | 5 | 17 | 1 |
| Intro Statistics | Descriptive statistics | us-intro-statistics-descriptive-statistics | 6 | 15 |  |
| Intro Statistics | Discrete random variables | us-intro-statistics-discrete-distributions | 4 | 8 |  |
| Intro Statistics | Hypothesis testing | us-intro-statistics-hypothesis-testing | 6 | 15 |  |
| Intro Statistics | Probability topics | us-intro-statistics-probability | 6 | 14 |  |
| Intro Statistics | Linear regression and correlation | us-intro-statistics-regression | 4 | 15 | 1 |
| Intro Statistics | Sampling and data | us-intro-statistics-sampling-and-data | 9 | 13 |  |
| Discrete Math | Counting | us-discrete-math-counting | 6 | 30 |  |
| Discrete Math | Discrete probability | us-discrete-math-discrete-probability | 5 | 20 |  |
| Discrete Math | Relations, graphs, and trees | us-discrete-math-graphs-and-relations | 14 | 21 |  |
| Discrete Math | Induction and recursion | us-discrete-math-induction-and-recursion | 7 | 15 | 3 |
| Discrete Math | Logic and proofs | us-discrete-math-logic-and-proofs | 17 | 45 |  |
| Discrete Math | Number theory | us-discrete-math-number-theory | 10 | 33 |  |
| Discrete Math | Sets, functions, and sequences | us-discrete-math-sets-and-functions | 8 | 17 |  |

最も少ない単元は Linear Algebra の Determinants（6）、AP Calculus AB の Unit 7（7）。どちらも topics に対して足りている。

**振らなかった語（none）**。当てはまる単元がない理由で多いのは: Geometry に四角形の単元と三角形の中の関係の単元がない（17 語）、日本にしかない内容（交代式・群数列・三角関数の合成・Ceva など）、別のコースで教える語（数学的帰納法は Precalculus、多項式・因数分解は Integrated Math 2、仮説検定・標本調査は AP Statistics）、どこにでも入る一般語（solve・all・exist）、level.us の付け過ぎ（Pre-Algebra の reverse-of-differentiation）。理由ごとの一覧は下請けの報告にあり、ここには id だけを挙げる。

- Pre-Algebra（4）: domain-and-range・function・hyperbola・reverse-of-differentiation
- Algebra 1（46）: all・alternating-expression・alternative-hypothesis・always-positive・arrange-by-the-variable-of-lowest-degree・at-least-one・census・covariance・digit・divisibility・elementary-symmetric-polynomial・estimation・exist・floor-function・fractional-part・hyperbola・hypothesis-testing・integer-part・inverse-proportion・is-biased・midpoint・multiple・nested-radical・null-hypothesis・place・population・population-mean・prove・quadratic-inequality・quartile-deviation・random-number・random-number-table・random-sampling・reject・remainder・sample・sample-mean・sample-size・sample-survey・sampling・select-at-random・significance-level・surplus-and-shortage・survey・symmetric-expression・unbiased
- Geometry（47）: all・apollonian-circle・at-least-one・boundary・centroid・cevas-theorem・circle-through-the-intersections-of-two-circles・complement・concurrent・conditions-for-a-parallelogram・de-morgans-laws・diagonal・dihedral-angle・disk・element・empty-set・excenter・exist・exterior-angle-bisector・lemma・linear-programming・median-of-a-triangle・menelauss-theorem・necessary-condition・number-of-elements・orthocenter・parallelogram・point-of-external-division・quadrilateral・rectangle・region・rhombus・set・side-angle-inequality・square-shape・subset・sufficient-condition・sum-of-the-exterior-angles・sum-of-the-interior-angles・tautology・the-five-centers-of-a-triangle・three-perpendiculars-theorem・trapezoid・triangle-inequality・union・unit-circle・universal-set
- Algebra 2（58）: absolute-value-equation・absolute-value-inequality・all・alternating-expression・approximate-value・arrange-by-the-variable-of-lowest-degree・auxiliary-angle-form・base-case・case-analysis・combination-with-repetition・compare・elementary-symmetric-polynomial・equality-holds・evaluate・exist・extrapolation・feasible-region・fractional-part・geometric-mean・grouped-sequence・inductive-hypothesis・inductive-step・integer-part・interpolation・leading-digit・least-squares・lexicographic-order・linear-inequality・mathematical-model・moving-average・nested-radical・nth-roots-of-unity・number-line・number-of-digits・predict・product-to-sum-formulas・proof-by-induction・properties-of-inequalities・prove・prove-by-induction・real-number・regression-line・relationship-between-roots-and-coefficients・shortest-path・solution・solution-set・solve・solve-for・split-into-cases・sum-to-product-formulas・symmetric-expression・system-of-inequalities・system-of-recurrences・system-of-three-equations・time-series・trend・triangle-inequality・triple-angle-formulas
- Precalculus（42）: apollonian-circle・area・arithmetic-mean・centroid・circle-through-the-intersections-of-two-circles・circumscribed-circle・compare・coplanarity-condition・cross-product・direction-vector・equality-holds・equation-of-a-line・equation-of-a-sphere・foot-of-the-perpendicular・geometric-mean・grouped-sequence・inscribed-circle・leading-digit・linearly-dependent・linearly-independent・midpoint・normal-vector・number-of-digits・parallel-lines・perpendicular-bisector・perpendicular-lines・point-of-internal-division・position-of-a-line-relative-to-a-circle・relationship-between-roots-and-coefficients・sequence-of-differences・side-angle-inequality・similar-triangles・solve・solve-for・system-of-recurrences・table-of-trigonometric-ratios・tetrahedron・triangle・triangle-inequality・vector-equation・vector-equation-of-a-circle・vector-equation-of-a-line
- AP Calculus AB（3）: comparison-for-divergence・number-of-real-solutions・one-sixth-formula
- AP Calculus BC（1）: comparison-test-for-integrals
- Calculus I（1）: one-sixth-formula
- Calculus II（1）: characteristic-equation
- Calculus III（3）: linearly-dependent・linearly-independent・vector-equation-of-a-circle
- AP Statistics（1）: standard-score
- Intro Statistics（3）: independent-random-variables・linear-transformation-of-a-random-variable・standard-score
- Discrete Math（2）: coordinates・repeating-decimal
- Linear Algebra（1）: uniqueness-proof
- Integrated Math 1（33）: ascending-order・binomial・common-factor・cross-method・degree・difference・difference-of-squares・digit・dividend・divisibility・divisor・divisor-in-division・expand・factor・factoring・factoring-by-grouping・leading-coefficient・leading-term・monomial・multiple・multiply・perfect-square-trinomial・place・polynomial・product・quadratic-expression・quotient・special-products・square-of-a-binomial・substitute-new-variable・sum・surplus-and-shortage・trinomial
- Integrated Math 2（5）: distance-formula・error・function・measurement・significant-figures

### A-6. 出典が editorial だけの likely 124 語

見出しを決めた参照が flags の note にある 5 語（corpus-reference-fallback）の参照を sources に入れた:

| id | 足した出典 |
|---|---|
| cartesian-product | OpenStax Calculus Volume 3（Double Integrals over Rectangular Regions） |
| without-loss-of-generality | OpenStax Calculus Volume 1（The Precise Definition of a Limit）・Volume 3（Surface Integrals） |
| infinitude-of-primes | 英語版 Wikipedia「Euclid's theorem」 |
| modular-inverse | 英語版 Wikipedia「Modular multiplicative inverse」 |
| well-ordering-principle | 英語版 Wikipedia「Well-ordering principle」 |

Wikipedia は既存の numeral-system・universal-set と同じ形（type reference、title English Wikipedia、url、note に記事名）。

**それでも editorial だけの語: 119**（draft にはしない。Phase 5 の論点として `phase2-final-report.md` F-1 に足した）。flags の note に参照がないので、この指示の範囲では足せない。人間が決めた 22 語、コーパス ①・② で決まった 41 語（そのうち 27 語は書き言葉の evidence に OpenStax の本がある。その本を textbook として入れるかは Phase 5 で決める）、英語に決まった言い方がない 56 語。

#### 人間が決めた（corpus-human-settled、22）

| id | ja | en | pos | mapping | evidence の OpenStax |
|---|---|---|---|---|---|
| aas-congruence | 2 組の角とその間にない 1 辺がそれぞれ等しい | AAS | noun | near |  |
| am-gm-inequality | 相加平均と相乗平均の関係 | AM-GM inequality | noun | exact |  |
| circular-permutation | 円順列 | circular permutation | noun | exact |  |
| circumscribed-polygon | 外接多角形 | circumscribed polygon | noun | exact |  |
| excenter | 傍心 | excenter | noun | exact |  |
| existence-proof | 存在証明 | existence proof | noun | exact |  |
| extended-euclidean-algorithm | 拡張ユークリッド互除法 | extended Euclidean algorithm | noun | exact |  |
| exterior-angle-bisector | 外角の二等分線 | exterior angle bisector | noun | exact |  |
| flowchart-proof | フローチャート証明 | flowchart proof | noun | none |  |
| linear-transformation-of-a-random-variable | 確率変数の変換 | linear transformation of a random variable | noun | exact |  |
| number-of-divisors | 約数の個数 | number of divisors | noun | exact |  |
| number-of-real-solutions | 方程式の実数解の個数 | number of real solutions | noun | exact | openstax-elemalg,openstax-intalg |
| perpendicular-postulate | 垂線の公準 | perpendicular postulate | noun | none |  |
| polynomial-inequality | 多項式不等式 | polynomial inequality | noun | exact |  |
| proof-by-cases | 場合分けによる証明 | proof by cases | noun | exact |  |
| reflex-angle | 優角 | reflex angle | noun | exact |  |
| rejection-region | 棄却域 | rejection region | noun | exact |  |
| same-side-exterior-angles | 同側外角 | same-side exterior angles | noun | exact |  |
| symmetric-property | 対称律 | symmetric property | noun | exact |  |
| triangle-proportionality-theorem | 三角形と比の定理 | triangle proportionality theorem | noun | exact |  |
| undefined-terms | 無定義用語 | undefined terms | noun | exact |  |
| write-dx-in-terms-of-du | dx を du で表す | solve for dx | phrase | exact |  |

#### コーパス ①・② で決まった（flag なし、41）

| id | ja | en | pos | mapping | evidence の OpenStax |
|---|---|---|---|---|---|
| analyze | 分析する | analyze | verb | exact | openstax-algtrig,openstax-calculus,openstax-intalg,openstax-introstats,openstax-precalculus |
| as-n-approaches-infinity | n → ∞ のとき | as n approaches infinity | phrase | exact | openstax-calculus,openstax-intalg |
| below-the-x-axis | x 軸より下 | below the x-axis | phrase | exact | openstax-algtrig,openstax-calculus,openstax-intalg |
| coplanar | 同一平面上にある | coplanar | adjective | exact | openstax-calculus |
| countable | 可算 | countable | adjective | exact | openstax-calculus,openstax-introstats |
| cross-multiply | 内項と外項の積は等しい | cross-multiply | phrase | near | openstax-algtrig,openstax-calculus,openstax-elemalg |
| cryptography | 暗号 | cryptography | noun | exact | openstax-algtrig |
| derivative-of-the-logarithm | 対数関数の導関数 | derivative of ln x | noun | exact |  |
| differentiate-twice | 2 回微分する | take the second derivative | phrase | exact | openstax-calculus |
| directed-graph | 有向グラフ | directed graph | noun | exact |  |
| divisibility | 整除性 | divisibility | noun | exact | openstax-elemalg,openstax-prealgebra |
| double-count | 重複して数える | double count | phrase | near |  |
| find-a-common-denominator | 通分する | common denominator | verb | near | openstax-algtrig,openstax-calculus,openstax-elemalg,openstax-intalg,openstax-prealgebra,openstax-precalculus |
| intersection | 共通部分 | intersection | noun | exact | openstax-algtrig,openstax-introstats |
| leading-digit | 最高位の数字 | first digit | noun | exact | openstax-algtrig,openstax-prealgebra |
| linear-recurrence-relation | 線形漸化式 | linear recurrence | noun | exact |  |
| linearity-of-expectation | 期待値の線形性 | linearity of expectation | noun | exact |  |
| modulus | 法 | modulo | noun | exact |  |
| move-term-to-other-side | 移項する | move a term to the other side | verb | near | openstax-algtrig,openstax-calculus,openstax-elemalg,openstax-intalg,openstax-introstats,openstax-prealgebra,openstax-precalculus |
| partial-order | 半順序 | partial order | noun | exact |  |
| postulate | 公準 | postulate | noun | near | openstax-algtrig,openstax-precalculus |
| predicate | 述語 | predicate | noun | exact |  |
| prove-by-induction | 数学的帰納法で証明する | prove … by induction | phrase | exact |  |
| quantifier | 量化子 | quantifier | noun | exact | openstax-calculus |
| read-off | 読み取る | read off | verb | near | openstax-algtrig,openstax-intalg |
| recursive-algorithm | 再帰アルゴリズム | recursion | noun | exact |  |
| relation | 二項関係 | relation | noun | exact |  |
| relatively-prime | 互いに素 | relatively prime | adjective | near |  |
| revolve-around-the-x-axis | x 軸のまわりに回転させる | rotate … around the x-axis | phrase | exact | openstax-calculus |
| revolve-around-the-y-axis | y 軸のまわりに回転させる | rotate … around the y-axis | phrase | exact | openstax-calculus |
| sampling-distribution-of-a-proportion | 標本比率の分布 | sampling distribution of the sample proportion | noun | exact |  |
| small-change | 微小変化 | small change | noun | exact | openstax-calculus |
| solve-the-recurrence | 漸化式を解く | solve the recurrence | phrase | exact |  |
| square-units | 平方単位 | square units | noun | near | openstax-algtrig,openstax-calculus,openstax-prealgebra |
| strong-induction | 累積帰納法 | strong induction | noun | exact |  |
| structural-induction | 構造帰納法 | structural induction | noun | exact |  |
| substitute-new-variable | 置き換える | make the substitution | verb | near | openstax-algtrig,openstax-calculus,openstax-intalg,openstax-introstats |
| substitute | 代入する | plug in | verb | exact | openstax-algtrig,openstax-calculus,openstax-elemalg,openstax-intalg,openstax-introstats,openstax-prealgebra,openstax-precalculus |
| subtended-by | 弧に対する | subtended by | phrase | near | openstax-algtrig,openstax-calculus |
| sum-of-a-geometric-sequence | 等比数列の和 | finite geometric series | noun | near | openstax-intalg |
| unbiased | かたよりのない | unbiased | adjective | exact | openstax-introstats |

#### 英語に決まった言い方がない（corpus-no-fixed-expression、56）

| id | ja | en | pos | mapping | evidence の OpenStax |
|---|---|---|---|---|---|
| angle-inscribed-in-a-semicircle | 直径に対する円周角 | angle inscribed in a semicircle | noun | near |  |
| area-of-a-triangle-using-vectors | 三角形の面積とベクトル | area of a triangle using vectors | noun | near |  |
| area-preserving-transformation | 等積変形 | area-preserving transformation | noun | none | openstax-prealgebra |
| arithmetic-middle-term | 等差中項 | arithmetic mean | noun | near |  |
| arrange-by-the-variable-of-lowest-degree | 最低次の文字について整理する | arrange by the variable of lowest degree | phrase | near |  |
| auxiliary-angle-form | 三角関数の合成 | auxiliary-angle form | noun | near |  |
| be-circumscribed-about | 外接する | circumscribed about | phrase | near |  |
| case-analysis | 場合分け | case analysis | noun | near |  |
| change-together | ともなって変わる | change together | phrase | near |  |
| circle-through-the-intersections-of-two-circles | 2 円の交点を通る円 | circle through the intersections of two circles | noun | none |  |
| class-midpoint | 階級値 | class midpoint | noun | near |  |
| class-width | 階級の幅 | class width | noun | near |  |
| classification-by-remainder | 余りによる分類 | classification by remainder | noun | near |  |
| collinearity-condition | 共線条件 | condition for collinearity | noun | near |  |
| comparison-for-divergence | 追い出しの原理 | comparison for divergence | noun | none |  |
| conditions-for-a-parallelogram | 平行四辺形になる条件 | conditions for a parallelogram | noun | near |  |
| conditions-that-determine-a-triangle | 三角形の決定条件 | conditions that determine a triangle | noun | near |  |
| congruence-criteria-for-right-triangles | 直角三角形の合同条件 | right triangle congruence | noun | near |  |
| coordinate-proof | 座標を用いた証明 | coordinate proof | noun | near |  |
| coplanarity-condition | 共面条件 | condition for coplanarity | noun | near |  |
| cross-method | たすき掛け | cross method | noun | none |  |
| decomposition-of-a-vector | ベクトルの分解 | decomposition of a vector | noun | near |  |
| equality-holds | 等号成立 | equality holds | phrase | near | openstax-calculus |
| equality-of-complex-numbers | 複素数の相等 | equality of complex numbers | noun | near |  |
| exponential-inequality | 指数不等式 | exponential inequality | noun | near |  |
| geometric-middle-term | 等比中項 | geometric mean | noun | near |  |
| grouped-sequence | 群数列 | grouped sequence | noun | none |  |
| integer-part | 整数部分 | integer part | noun | near |  |
| limit-of-sine-x-over-x | sin x / x の極限 | sin x over x | noun | near |  |
| logarithmic-inequality | 対数不等式 | logarithmic inequality | noun | near |  |
| make-a-sign-chart | 増減表をかく | make a sign chart | phrase | none |  |
| opposite-vector | 逆ベクトル | opposite vector | noun | near |  |
| partitioning-into-groups | 組分け | split … into groups | noun | near |  |
| permutation-of-a-multiset | 同じものを含む順列 | permutation of a multiset | noun | near |  |
| permutation-with-repetition | 重複順列 | permutation with repetition | noun | near |  |
| point-of-external-division | 外分点 | point that divides the segment externally | noun | near |  |
| point-of-internal-division | 内分点 | point that divides the segment internally | noun | near |  |
| position-of-a-line-relative-to-a-circle | 円と直線の位置関係 | position of a line relative to a circle | noun | near |  |
| quartile-deviation | 四分位偏差 | quartile deviation | noun | near |  |
| relative-positions-of-two-circles | 2 円の位置関係 | relative position of two circles | noun | near |  |
| relative-positions-of-two-lines | 2 直線の位置関係 | relative position of two lines | noun | near |  |
| right-triangle-similarity | 直角三角形の相似 | right triangle similarity theorem | noun | near |  |
| standard-score | 偏差値 | hensachi | noun | none |  |
| substituting-values | 数値代入法 | plug in convenient values | noun | near |  |
| substitution-property | 代入の性質 | substitution property | noun | near |  |
| supplementary-angle-identity | 180° − θ の三角比 | supplementary angle identity | noun | near |  |
| surplus-and-shortage | 過不足 | surplus and shortage | noun | none |  |
| system-of-recurrences | 連立漸化式 | system of recurrences | noun | none |  |
| table-of-trigonometric-ratios | 三角比の表 | table of trigonometric ratios | noun | near |  |
| tangent-chord-theorem | 接弦定理 | tangent-chord theorem | noun | near |  |
| the-five-centers-of-a-triangle | 五心 | points of concurrency | noun | none |  |
| three-perpendiculars-theorem | 三垂線の定理 | three perpendiculars theorem | noun | none |  |
| transformation-of-a-variable | 変量の変換 | transforming data | noun | near |  |
| trigonometric-inequality | 三角不等式 | trigonometric inequality | noun | near |  |
| undercount | 数え落とす | undercount | verb | near |  |
| vector-equation-of-a-circle | 円のベクトル方程式 | vector equation of a circle | noun | near |  |

### A-7. move-term-to-other-side と F-6

例文の 2 文目を答案の形（Subtract 5 from both sides: 2x = 8. ／ 5 を移項して 2x = 8、register written）にした。`phase2-final-report.md` F-6 の 2 項目（例文の register、verified と record の flag）に〔済〕を付けた。record の flag（corpus-human-settled・corpus-reference-fallback・corpus-no-fixed-expression）は validate がすでに verified の語に許している（scripts/lib/flags.ts）。同じまとめの F-1（editorial）・F-2（微積分の 10 語・OpenStax を 1 ソースと数えるか）・C（単元の件数）・E-3 にも、今回の結果を指す印を付けた。
## B. Phase 3 の準備: 3 つの台帳

生成はしていない（data/symbols・phrases・conventions は変えていない）。どの台帳も目安に合わせた水増しはしていない。

| 台帳 | 件数 | PLAN §9 Phase 3 の目安 | 比べて |
|---|---|---|---|
| ledger/symbols.csv | **220** | 300+ | 80 足りない。読み方が違うものだけを行にした（x⁵ と x⁶ は 1 行、x² と x³ は別の行）。PLAN の分野は全部 1 行以上ある |
| ledger/phrases.csv | **320** | 300+（場面ごとに 40〜60） | 総数は届く。場面では written-solution 72・class-listening 67 が 60 を超え（台帳の候補 83 の大半がこの 2 つ）、class-asking 21・office-hours 18・email 17・group-study 17・discord 16 は 40 に届かない（意図が重なり始めたところで止めた）。重なりを統合すると 2 つの多い場面は 60 前後になる（D-3） |
| ledger/conventions.csv | **130** | 50+（付録 B は 50〜100） | 目安を超える。ただし 14 行は「一方の国だけが名前を付ける」語をまとめた行で、分けるか外すかは生成時に決める（D-2） |

### B-1. symbols（220）

作り方: 学習指導要領〔用語・記号〕の記号 22（≦ ≧ π // ⊥ ∠ △ ≡ √ ∽ sin cos tan i logₐx lim ∞ e ₙPᵣ ₙCᵣ n! Σ。全部が行になった）、既存の symbols 11（同じ id）、米国の教材の記法（PLAN の分野ごと）。Phase 2 で統合した f″・d/dx は行にしない（id-changes.csv）。日本だけの記法（P_A(B)・ₙHᵣ・〜・∵・数III の log x・ガウス記号）も行にした。

出典の件数は `scripts/ledger/symbol_refs.py`（手元のファイルだけ）で数えた: OpenStax（CNXML の MathML と書き言葉コーパスの本文の多い方）・AP Calculus の CED・AP Statistics の CED・CK-12 に、行ごとの probe の文字列が出る回数。**件数は記号の文字の出現数で、同じ文字の別の使い方も数える**（× と ·、− と負号、| と条件付き確率、′）。IM は本文から数式が落ちているので数えない。

**分野別**

| | 件数 |
|---|---|
| probability-statistics | 30 |
| arithmetic | 24 |
| sets | 22 |
| geometry | 18 |
| notation-other | 14 |
| trigonometry | 12 |
| derivatives | 12 |
| exponents | 10 |
| functions | 10 |
| vectors | 10 |
| logic | 10 |
| limits | 7 |
| integrals | 7 |
| matrices | 7 |
| complex-numbers | 6 |
| number-theory | 5 |
| fractions | 4 |
| logarithms | 4 |
| roots | 3 |
| subscripts | 3 |
| sums | 2 |

**level 別（1 行が複数の level に入る）**

| 日本 | 件数 | | 米国 | 件数 |
|---|---|---|---|---|
| 小学校 | 14 | | Pre-Algebra | 35 |
| 中1 | 36 | | Algebra 1 | 42 |
| 中2 | 8 | | Geometry | 29 |
| 中3 | 5 | | Algebra 2 | 47 |
| 数I | 33 | | Integrated Math 1 |  |
| 数A | 17 | | Integrated Math 2 |  |
| 数II | 29 | | Integrated Math 3 |  |
| 数B | 17 | | Precalculus | 66 |
| 数III | 25 | | AP Calculus AB | 31 |
| 数C | 15 | | AP Calculus BC | 4 |
| 大学 | 50 | | AP Statistics | 32 |
|  |  | | Calculus I | 37 |
|  |  | | Calculus II | 4 |
|  |  | | Calculus III | 23 |
|  |  | | Linear Algebra | 19 |
|  |  | | Intro Statistics | 32 |
|  |  | | Discrete Math | 40 |

**出典**

| | 件数 |
|---|---|
| 学習指導要領〔用語・記号〕 | 22 |
| data/symbols（既存） | 11 |
| 参照の件数あり（OpenStax・CED・CK-12） | 161 |
| editorial だけ | 57 |


### B-2. conventions（130）

作り方: 1,540 語の pitfalls と mapping_note を 4 つに分けて日米の違いを抜き出し（295 件）、同じ違いを 1 行にまとめ、語彙だけ・読み方だけ・対比のないもの（9 件）を外した。既存の 3 つ（inequality-symbols・slope-intercept-form・therefore-because-symbols）は同じ id の行。付録 B の行のうち本文に裏付けがあるのは 20 行（1・3・4・5・6・7・11・12・13・14・15・16・17・20・21・24・25・27・28・30）。裏付けのない 10 行（2 近似 ≒・8 ÷・9 × ・10 桁区切り・18〜19 手書き・22 有理化・23 角度・26 f(x) の読み・29 数列の添字）は足していない（本文にない違いは候補にしない）。

指示の例は全部行になった: log と ln（log-and-ln）、ₙPᵣ と P(n, r)（combination-permutation-notation）、台形の定義（trapezoid-definition）、y = ax + b と y = mx + b（slope-intercept-form）、p 値で判断する（p-value-vs-rejection-region）。

**category 別**

| | 件数 |
|---|---|
| terminology | 48 |
| notation | 37 |
| proof-style | 19 |
| classroom-culture | 15 |
| letters | 10 |
| calculator | 1 |

**関係するエントリの単元の科目・コース別（1 行が複数に入る）**

| 科目 ／ コース | 件数 |
|---|---|
| 中1 | 28 |
| 中2 | 25 |
| 中3 | 23 |
| 数学I | 38 |
| 数学A | 18 |
| 数学II | 33 |
| 数学B | 14 |
| 数学III | 27 |
| 数学C | 8 |
| Pre-Algebra | 28 |
| Algebra 1 | 41 |
| Geometry | 41 |
| Algebra 2 | 35 |
| Integrated Math 1 | 34 |
| Integrated Math 2 | 39 |
| Integrated Math 3 | 24 |
| Precalculus | 36 |
| AP Calculus AB | 30 |
| AP Calculus BC | 6 |
| AP Statistics | 11 |
| Calculus I | 36 |
| Calculus II | 14 |
| Calculus III | 3 |
| Linear Algebra | 5 |
| Intro Statistics | 10 |
| Discrete Math | 28 |

**出典**

| | 件数 |
|---|---|
| 参照あり（CED・OpenStax・IM・CK-12・Nicholson・Levin） | 86 |
| editorial だけ | 44 |
| 付録 B の行 | 25 |


### B-3. phrases（320）

作り方: `ledger/phrases-candidates.csv` の 83 行（id のまま）、既存の phrases 5、PLAN §5.3 の 9 つの場面の新しい候補 232。言い方を CED・OpenStax で確かめた行だけ出典にその名前を書いた（試験の指示の Justify your answer・Give a reason for your answer・Show the work that leads to your answer・Indicate units of measure ほか）。box your answer は OpenStax・CED とも 0 件、leave your answer in exact form は OpenStax に 1 件で、どちらも editorial。


| 場面 | 件数 | 台帳の候補 83 から | 既存 | 新しい候補 | PLAN の目安 |
|---|---|---|---|---|---|
| class-listening | 67 | 36 | 0 | 31 | 40〜60 |
| class-asking | 21 | 0 | 1 | 20 | 40〜60 |
| office-hours | 18 | 0 | 1 | 17 | 40〜60 |
| explaining-solution | 42 | 1 | 1 | 40 | 40〜60 |
| written-solution | 72 | 36 | 1 | 35 | 40〜60 |
| exam | 50 | 10 | 1 | 39 | 40〜60 |
| email | 17 | 0 | 0 | 17 | 40〜60 |
| group-study | 17 | 0 | 0 | 17 | 40〜60 |
| discord | 16 | 0 | 0 | 16 | 40〜60 |
| 計 | 320 | 83 | 5 | 232 | 300+ |

## C. フレーズの数え方と ③ 5 件の結果

### C-1. 決めた数え方

- **文を丸ごと数えない。** 文はコーパスで一字一句くり返されないので（「Sorry, could you say that last part again?」はどのコーパスでも 0 件）、数えるのは**要の部分**（意図を運ぶ言い方）だけにする
- 要の部分は **terms の動詞句と同じ規則**で数える: 語形変化をまとめ、「…」は 1〜3 語の空き（could you say … again は could you say that again ／ could you say the last part again に当たる）、「A | B」はどちらか、「!w」は前後に来てはいけない語
- 形は `scripts/corpus/lib.ts` の `PHRASE_FORMS`（フレーズの id → en ／ variants の文 → 要の部分）に書く。evidence にも要の部分のまま記録する（TERM_FORMS と同じ）。`matcherFor("phrases")` を terms と同じ照合にし、`candidatesOf`・`recordedAt`（decide）・`headwordOf`（count）が要の部分で数え・比べるようにした（単体テスト 2 つ）
- 別の使い方と分けられない要の部分は数えない（`""`）。文頭の So（So x = 3 is the only solution.）は、正規化した本文で文頭を区別できず、so はどこにでも出るので数えない（terms で数えられない言い方を pitfalls に回すのと同じ扱い）
- STYLE 追記欄と PLAN §15 の count の項に書いた

### C-2. ③ 5 件の数え直し

| id | 要の部分（件数は 話 ／ 書） | 結果 |
|---|---|---|
| explaining-solution-first-step | first i（74 ／ 2）、what i did was（7 ／ 0）、i started by \| i start by（3 ／ 0） | **決まる**: 話し言葉 ① first i（10.6:1）。書き言葉は ③ |
| written-solution-therefore | therefore（581 ／ 1,293）、hence（21 ／ 201）、So は数えない | **決まる**: 話・書とも ① therefore（27.7:1 ／ 6.4:1）。話し言葉の therefore の 4 割強は MIT 18.03。エントリは Therefore を register written、So を別の register の variant にしているので、今の decide は「話し言葉の首位 therefore がエントリの話し言葉の側にない」と食い違いを出す |
| exam-clarify-instruction | does … mean i should（0 ／ 0）、in exact form（0 ／ 17）、show all … steps \| show all the work \| show your work（8 ／ 14） | **書き言葉は決まる（② 併記）が、意味がない**: variants が同じ意図の言い換えではなく別の 3 つの質問（simplify の意味・答えの形・途中式）なので、件数の比べ合いで見出しを選ぶことにならない。in exact form は 17 件中 15 件が OpenStax Calculus |
| office-hours-stuck-at-step | i don't see how（2 ／ 0）、i'm lost（1 ／ 0）、walk … through（6 ／ 0） | **決まらない**（③、話し言葉 9 件）。walk … through は大半が先生の let me walk you through |
| class-asking-repeat | could you say … again（0 ／ 0）、could you repeat（1 ／ 0）、i missed that（1 ／ 0） | **決まらない**（③、話し言葉 2 件） |

- **5 件中 2 件（first-step・therefore）は要の部分で決まり、1 件（exam-clarify）は数えられても比べる意味がなく、2 件（学生の質問・オフィスアワー）は決まらない。** 決まらない 2 件は PLAN §15 の注意どおり、講義の書き起こしに学生の側の発話がほとんどないため
- 数え直しの結果は報告だけにし、phrases の evidence と flags は書き戻していない（Phase 3 の生成で、要の部分を決めてから書く。DECISIONS）
- Phase 3 の生成で直すこと: exam-clarify-instruction は 1 つの意図（instruction の語の意味を聞く）に絞り、答えの形・途中式は別のフレーズにする（ledger/phrases.csv では exam の別の行）。written-solution-therefore の So は、話し言葉では so が普通という事実を note に書き、register を corpus に合わせる
## D. 怪しいもの

### D-1. 1〜7

- **level の参照を読み進める規則**（A-1）は指示を広げて読んだ。substitute-new-variable のように中3 と AP Calculus の両方にある語で、IM が決めなければ CED・OpenStax Calculus まで読む。今は他に効いた語はないが、中学・Geometry の語に微積分の level が付いていると、微積分の参照で見出しが決まりうる
- **OpenStax Calculus を level の参照にすると、書き言葉 ① が OpenStax Calculus 頼みの語は必ず書き言葉の言い方に戻る**（参照と書き言葉コーパスが同じ本）。見出しの規則の「書き言葉も 1 ソース頼みなら書き言葉では決めない」は、微積分の語では実質はたらかない
- **単元の振り分け（A-5）は下請けの判断を 1 組ずつは読んでいない**。確かめたのは形（どの語も 1 回、単元の id が正しい）と、none と「迷った語」の報告だけ。迷った語の例: Pre-Algebra の座標平面の語を Integers の単元に、累積度数・度数折れ線を Data and probability に（米国の Pre-Algebra ではまれ）、Algebra 1 の基礎語（expression・variable・percent ほか）を Linear equations に集めた、Calculus I の原始関数の語を Applications of derivatives と Integration の 2 つに、Precalculus の一般語（intersect・distance・denominator）に単元を与えた
- **level.us を正にしたので、level.us の付け過ぎ・付け足りなさが残る**: 付け過ぎは none の一覧（Pre-Algebra の reverse-of-differentiation、Geometry の集合の 9 語、Algebra 2 の数学的帰納法 5 語ほか）、付け足りなさは A-5 の 3 で手で埋めた単元のほかにもあるかもしれない。Integrated Math は 470 語の level.us を足した。Integrated Math 1 の level.us がある多項式の 20 語は、CCSS Appendix A どおり Integrated Math 2 に入れ、Integrated Math 1 の level.us は外していない
- **Geometry に四角形（Quadrilaterals）と三角形の中の関係（Relationships within triangles）の単元がない**ので、parallelogram・trapezoid・rhombus・centroid・orthocenter など 17 語が Geometry のどの単元にも入らない。単元を足すかは人間の判断（curriculum の構成の変更）
- 単元が 2 つのコースで同じ内容のとき（Calculus I と Calculus II の Applications of integration、AP Calculus AB Unit 8）、同じ語が両方に入る。1 語 1 単元にしていない
- editorial だけの 119 語（A-6）のうち、コーパスで決まった 41 語は evidence に出典があるのに sources にない

### D-2. 台帳の候補

**symbols**
- 1 行にまとめたか分けたかの判断: f‴ と f⁽ⁿ⁾、x⁴ と xⁿ、数の分数と文字の分数、−3 の読み（negative ／ minus ／ the opposite of）、× · 並置、sin⁻¹ ／ arcsin の 3 行、sec csc cot の 3 行、双曲線関数 3 つを 1 行、ガウス記号と floor、(f∘g)(x) と f(g(x))
- 記号より conventions か phrases に近い行: 数III の log x（読みは同じで意味が違う。付録 B #4 と conventions/log-and-ln に重なる）、括弧の入れ子の順、〜（範囲）、長さ AB と m∠、割り算の筆算（goes into）、the quantity、∴ ∵ ∎（conventions/therefore-because-symbols と重なる）
- 読み方が確かでないもの: ∓（複号同順の英語）、x⁻¹ の x inverse、F(x)|ₐᵇ の evaluated from a to b、行列の読み上げ、X ~ N の is distributed as ／ follows、φ・β・ρ の発音、î（OpenStax は太字の i で帽子なし）。日本側: 数B の標本比率の記号、P_A(B) を今の教科書が使うか、ₙHᵣ は数A の発展
- 件数: 同じ文字の別の使い方も数える（B-1）。probe のない 23 行と、日本だけの記法・PDF で落ちた記号（Aᵀ、太字のベクトル）は件数がない
- level に「小学校」を使う行 14（スキーマにない値。生成時に中1 に寄せる）

**conventions**
- 本文の裏付けが 1 文だけ・米国側がはっきりしない: constant-of-integration-remark、logic-notation（英語の本とあるだけで高校か大学か不明）、set-builder-colon、number-of-elements-notation、solution-as-ordered-pair、gcd-notation、relatively-prime-pairwise、series-includes-finite-sums、y-prime-vs-dy-dx・variance-notation（米国側の根拠が用例コーパスだけ）
- 語彙の違いに近い: iff-for-necessary-and-sufficient、proportion-cross-multiplication、distance-rate-time、variation-language、ratio-rate-percent、derivative-at-a-point-naming、negative-vs-minus（読み方。付録 B #7 なので残した）
- **trapezoid-definition は日本側の定義が本文にない**（米国の教材が IM は少なくとも 1 組、CK-12 はちょうど 1 組と割れていることだけ）。生成時に日本の教科書の定義を確かめる
- まとめの行（us-named-algebra-rules・us-named-calculus-rules ほか 14 行）は、1 つずつなら語彙の違いと見ることもできる

**phrases**
- terms に近い名詞句・断片: enclosed-region、point-outside-the-circle、checking-conditions、relation-between-x-and-y、the-value-of-sine-theta、for-the-angle-theta、one-of-the-solutions-is ／ the-other-solutions
- 同じ意図の terms がある: assuming-leads-to-a-contradiction（lead-to-a-contradiction）、written-solution-without-loss-of-generality、written-solution-base-case、take-the-log-and-differentiate（take-the-log-of-both-sides）ほか 10 余り、試験の指示の動詞（evaluate・simplify・solve for・prove・factor）
- 米国の先生・学生が言うか確かでない: evaluate-critically（批判的に考察）、let-p-be-the-position-vector-of-p・using-real-numbers-s-and-t（日本の問題文の型）、as-p-moves、exam-no-work-no-credit、class-listening-you-dont-need-to-memorize（AP Statistics は公式集があり AP Calculus はない）、製品名の行（WebAssign・Desmos）
- 同じ場面の重なり（D の件数に効く）: therefore ／ hence ／ written-solution-therefore、left-side-minus-right-side ／ take-the-difference-of-the-two-sides ／ form-the-difference、the-derivative-is-zero ／ the-tangent-line-is-horizontal ほか。統合すると written-solution・class-listening は 60 前後になる
- 学生の側の行（class-asking・office-hours・email・group-study・discord の約 90 行）は、C-2 の 2 件と同じく用例コーパスではほとんど決まらない見込み（PLAN §15）

### D-3. 数え方

- 要の部分を選ぶのは人の判断で、選び方で結果が変わる（first i を要にすれば first-step は決まるが、we で話す先生の言い方は数えない）
- 講義の書き起こしは先生の発話なので、学生の質問の要の部分（walk … through）が先生の言い方（let me walk you through）で数えられる
## E. 確認（合否はすべて終了コード）

```
pnpm exec tsc --noEmit        # exit 0
pnpm validate                 # exit 0。terms 1,540 ／ symbols 11 ／ phrases 5 ／ conventions 3 ／ curriculum 161、警告 0
pnpm spell                    # exit 0。1,728 ファイル、0 件
pnpm test                     # exit 0。138/138（4 ファイル。level の参照と PHRASE_FORMS の単体テストを足した）
pnpm build                    # exit 0。1,539 ページ。export: terms.json 1,528（draft 12 を除く）
pnpm crosscheck               # exit 0。513 語、一致 513、flag 0
pnpm corpus:count && pnpm corpus:decide
                              # 主見出し 1,099 ／ 併記 127 ／ 決まった言い方なし 76 ／ 参照 280 ／ 人間が決めた 43 ／
                              # 判断不能 3（terms 1・phrases 2）／ 食い違い 2（phrases。書き戻していない）／ 直すこと 0 ／ 見出しの規則に当たる語 35
python3 scripts/ledger/symbol_refs.py   # exit 0。220/220。2 回目も同じ結果
```

- `corpus:decide -- --write` は terms と symbols に当てた（evidence は変わらない。変わったのは 1 と 2 の語だけ）
- 取得（ネットワーク）はしていない。台帳と件数は手元の corpus/（gitignore）と data/ から作った
