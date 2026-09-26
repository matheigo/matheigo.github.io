# Phase 2 まとめ — 本文生成（台帳 1,540 行すべて）

作成: 2026-09-25 ／ 対象: Phase 2 の全コミット（最初の積分の単元から 8178125 のバッチ 8 まで）と本コミット
Phase 2 の最後のセッションのレポートは `audits/phase2-middle-school-3-report.md`。各単元のレポートは `audits/phase2-*-report.md`。

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified の語は 0。

## まとめ

- 台帳の **1,540 行すべてにエントリ**がある（data/terms 1,540）。confidence は **likely 1,528 ／ draft 12**（draft はすべて理由付き。D）
- mapping は **exact 1,204 ／ near 295 ／ none 41**
- 見出しの決め方: **コーパス ① 1,048 ／ 見出しの規則（1 ソース頼みの話し言葉）23 ／ 併記 62 ／ 参照 280 ／ 英語に決まった言い方がない 76 ／ 人間が決めた 42 ／ 判断不能（人間レビュー）1 ／ その他 8**（B）
- **1 ソース頼みの語は 663**（どちらかの register の判定が 1 つのソースに頼る）。うち **612 語は見出しの言い方そのもの**が 1 ソース頼み
- **人間レビューに残るのは terms 1 語（quadratic-regression）と phrases 5**。register の食い違い 0（E）
- PLAN §9 の完了条件「2,000 語が likely 以上、draft は理由付きで一覧化」は、**語数は 1,540（台帳を Phase 1 で統合した後の全行）で 2,000 に届かない**。draft の一覧は満たす（A）

## A. PLAN §9 Phase 2 と照らした結果

| 項目（PLAN §9 Phase 2） | 結果 |
|---|---|
| 1. 台帳から 50 語ずつ生成、1 バッチ 1 コミット、毎回 STYLE を読む | おおむね守った。最初の積分の単元は 123 語を 1 セッションで作ってから 85 語にやり直した（phase2-integral-fix-report）。最後のバッチ 8 は残りの 31 語。中学の単元 2 のバッチ 5 の前は STYLE を読み直すコマンドを明示的に打っていない（phase2-middle-school-2-report F）。バッチ 6 のコミットは test の失敗を見落として作った（同 I。その後 CLAUDE.md 絶対ルール 11 で、合否は終了コードで判定する） |
| 2. 各語に sources を付ける。付けられない語は draft で残す | 全 1,540 語に出典 1 件以上。draft 12 語はすべて draft-reason の flag で理由を書いた（D）。ただし出典が editorial（本プロジェクトの編集判断）だけの likely が 124 語ある（F-1） |
| 3. バッチごとに validate と crosscheck を回し flags を埋める | 回した。最後の状態: validate 警告 0、crosscheck 513 語すべて一致・flag 0 |
| 4. 動詞・句は例文 2 文以上、register を分ける | 動詞 70・句 102 の 172 語すべて例文 2 文以上（validate の完了の定義）。例文の register は 171 語が spoken と written の両方、move-term-to-other-side だけが 2 文とも spoken（F-6） |
| 5. 200 語ごとに audits/ に自己監査メモ（修正は Phase 5 へ） | セッションごとにレポートを書いた（Phase 2 で 13 本と、このまとめ）。「怪しい点」の節を F にまとめた |
| **完了条件**: 2,000 語が likely 以上、draft は理由付きで一覧化 | **語数は未達**。Phase 1 の台帳は 2,488 行だったが、1 概念 1 エントリの統合（850 行）、phrases の候補へ（83 行）、範囲外（15 行）で 1,540 行になった（ledger/id-changes.csv）。台帳の全行を生成し、likely 1,528。2,000 語にするには台帳に行を足す必要がある（どの単元に足すかは人間の判断）。draft の一覧は D |

CLAUDE.md の「完了の定義（1 エントリ）」（必須項目・ひらがなの読み・出典 1 件以上・validate 緑・crosscheck の flags なし・例文）は、validate と crosscheck が全語について確かめている（どちらも終了コード 0）。

## B. 数字

| 項目 | 語数 |
|---|---|
| エントリ（terms） | 1,540 |
| confidence | likely 1,528 ／ draft 12 ／ verified 0 |
| mapping | exact 1,204 ／ near 295 ／ none 41 |
| 品詞 | 名詞 1,327 ／ 句 102 ／ 動詞 70 ／ 形容詞 41 |
| 出典の種類（語数。1 語に複数） | textbook 1,119 ／ wikipedia-langlink 513 ／ reference 396 ／ editorial 298 ／ mext-translation 116 ／ wikidata 4 |

### 見出しの決め方（terms、1 語 1 つ）

| 決め方 | 語数 | 内容 |
|---|---|---|
| コーパス ①（主見出し） | 1,048 | en.term がどちらかの register の ①（3:1 以上、または首位だけが 10 件以上）の言い方 |
| 見出しの規則（1 ソース頼みの話し言葉） | 23 | 話し言葉の首位が 1 ソース頼みなので、書き言葉 ① 11 ／ CED 10 ／ level の参照（IM）2 の言い方にした |
| 併記（②） | 62 | en.term がどちらかの register の ② の言い方（頻度順で variants に並べる） |
| 参照 | 280 | 話・書とも ③。OpenStax 84 ／ CK-12 76 ／ IM 32 ／ CED（AP Calculus）20 ／ AP Statistics の CED 19 ／ Nicholson 19 ／ Levin 17 ／ 英語版 Wikipedia の記事名 13 |
| 英語に決まった言い方がない | 76 | 話・書とも ③、mapping near ／ none で全候補が 10 件未満、参照も 3 件未満 |
| 人間が決めた | 42 | corpus-human-settled（DECISIONS の日付と節を note に） |
| 判断不能（人間レビュー） | 1 | quadratic-regression |
| その他 | 8 | en.term がコーパスの首位でない、前のセッションの判断の語: eulerian-path（Euler trail）・imaginary-unit・midpoint-riemann-sum（CED の呼び方）・move-term-to-other-side・overestimate-and-underestimate・pure-imaginary-number・translation（IM の呼び方）・unbiased-estimator。理由は各レポートと DECISIONS |

### 1 ソース頼み

- どちらかの register の判定が 1 ソース頼み（件数の最も多いソースを抜くと ③ か別の候補が首位、または同じ首位のまま ② に下がる）: **663 語**
- そのうち、見出し（en.term）の言い方そのものが 1 ソース頼み: **612 語**。多くは「抜くと ③ になるだけ」（書き言葉が OpenStax の 1 冊だけ、話し言葉が Khan Academy だけ、など）で、規則どおり ① のまま記録している
- 見出しの規則（話し言葉の首位が 1 ソース頼みで、書き言葉 ① か CED が別の言い方）に当たる語は 36。うち見出しを書き言葉・CED・level の参照にした 23 語が上の表の「見出しの規則」、残りは話し言葉の首位のまま（書き言葉 ① も 1 ソース頼みで level の参照が決まらない語など）

## C. 単元別のエントリ数

単元（data/curriculum）の term_refs で数えた。1 語は台帳の行が属する単元すべてに入る（日本の単元と米国の単元の両方に入る語が 238）。どの単元にも入らない語は 0。

### 科目・コース別（単元の term_refs の和集合）

| | 科目 ／ コース | 単元数 | エントリ数 | うち draft |
|---|---|---|---|---|
| 日本 | 中1 | 7 | 223 |  |
| 日本 | 中2 | 7 | 145 |  |
| 日本 | 中3 | 8 | 122 |  |
| 日本 | 数学I | 5 | 145 | 2 |
| 日本 | 数学A | 3 | 109 |  |
| 日本 | 数学II | 7 | 199 | 1 |
| 日本 | 数学B | 3 | 92 | 2 |
| 日本 | 数学III | 3 | 117 |  |
| 日本 | 数学C | 3 | 91 |  |
| 米国 | Pre-Algebra | 6 | 13 |  |
| 米国 | Algebra 1 | 8 | 74 |  |
| 米国 | Geometry | 10 | 98 |  |
| 米国 | Algebra 2 | 9 | 71 | 1 |
| 米国 | Integrated Math 1 | 6 | 6 |  |
| 米国 | Integrated Math 2 | 5 | 1 |  |
| 米国 | Integrated Math 3 | 6 | 1 |  |
| 米国 | Precalculus | 11 | 70 | 2 |
| 米国 | AP Calculus AB | 8 | 72 |  |
| 米国 | AP Calculus BC | 3 | 32 |  |
| 米国 | AP Statistics | 5 | 59 |  |
| 米国 | Calculus I | 6 | 24 |  |
| 米国 | Calculus II | 6 | 30 |  |
| 米国 | Calculus III | 5 | 41 |  |
| 米国 | Linear Algebra | 6 | 59 | 3 |
| 米国 | Intro Statistics | 8 | 44 | 2 |
| 米国 | Discrete Math | 7 | 67 |  |


### 単元別（全 161 単元）


| 科目 ／ コース | 単元 | id | エントリ数 | うち draft |
|---|---|---|---|---|
| 中1 | データの活用 | jp-chuugaku-1-data-no-katsuyou | 28 |  |
| 中1 | 平面図形 | jp-chuugaku-1-heimen-zukei | 52 |  |
| 中1 | 比例と反比例 | jp-chuugaku-1-hirei-hanpirei | 27 |  |
| 中1 | 一次方程式 | jp-chuugaku-1-ichiji-houteishiki | 20 |  |
| 中1 | 空間図形 | jp-chuugaku-1-kuukan-zukei | 33 |  |
| 中1 | 文字と式 | jp-chuugaku-1-moji-to-shiki | 30 |  |
| 中1 | 正の数と負の数 | jp-chuugaku-1-seifu-no-suu | 42 |  |
| 中2 | データの活用 | jp-chuugaku-2-data-no-katsuyou | 8 |  |
| 中2 | 平行と合同 | jp-chuugaku-2-heikou-to-goudou | 36 |  |
| 中2 | 一次関数 | jp-chuugaku-2-ichiji-kansuu | 22 |  |
| 中2 | 確率 | jp-chuugaku-2-kakuritsu | 17 |  |
| 中2 | 連立方程式 | jp-chuugaku-2-renritsu-houteishiki | 14 |  |
| 中2 | 三角形と四角形 | jp-chuugaku-2-sankakkei-to-shikakkei | 26 |  |
| 中2 | 式の計算 | jp-chuugaku-2-shiki-no-keisan | 29 |  |
| 中3 | 円 | jp-chuugaku-3-en | 15 |  |
| 中3 | 平方根 | jp-chuugaku-3-heihoukon | 18 |  |
| 中3 | 標本調査 | jp-chuugaku-3-hyouhon-chousa | 15 |  |
| 中3 | 関数 y=ax² | jp-chuugaku-3-kansuu-y-ax2 | 15 |  |
| 中3 | 二次方程式 | jp-chuugaku-3-niji-houteishiki | 11 |  |
| 中3 | 三平方の定理 | jp-chuugaku-3-sanpeihou | 13 |  |
| 中3 | 相似な図形 | jp-chuugaku-3-souji | 15 |  |
| 中3 | 式の展開と因数分解 | jp-chuugaku-3-tenkai-insuubunkai | 20 |  |
| 数学I | データの分析 | jp-suugaku-1-data-no-bunseki | 25 |  |
| 数学I | 数と式 | jp-suugaku-1-kazu-to-shiki | 30 | 2 |
| 数学I | 二次関数 | jp-suugaku-1-niji-kansuu | 25 |  |
| 数学I | 集合と命題 | jp-suugaku-1-shuugou-to-meidai | 39 |  |
| 数学I | 図形と計量 | jp-suugaku-1-zukei-to-keiryou | 30 |  |
| 数学A | 場合の数と確率 | jp-suugaku-a-baai-no-kazu-to-kakuritsu | 43 |  |
| 数学A | 数学と人間の活動 | jp-suugaku-a-suugaku-to-ningen-no-katsudou | 29 |  |
| 数学A | 図形の性質 | jp-suugaku-a-zukei-no-seishitsu | 37 |  |
| 数学II | 微分の考え | jp-suugaku-2-bibun-no-kangae | 36 |  |
| 数学II | 複素数と方程式 | jp-suugaku-2-fukusosuu-to-houteishiki | 24 |  |
| 数学II | 三角関数 | jp-suugaku-2-sankaku-kansuu | 36 | 1 |
| 数学II | 積分の考え | jp-suugaku-2-sekibun-no-kangae | 21 |  |
| 数学II | 式と証明 | jp-suugaku-2-shiki-to-shoumei | 27 |  |
| 数学II | 指数関数と対数関数 | jp-suugaku-2-shisuu-taisuu | 32 |  |
| 数学II | 図形と方程式 | jp-suugaku-2-zukei-to-houteishiki | 26 |  |
| 数学B | 数学と社会生活 | jp-suugaku-b-suugaku-to-shakai-seikatsu | 12 |  |
| 数学B | 数列 | jp-suugaku-b-suuretsu | 40 | 2 |
| 数学B | 統計的な推測 | jp-suugaku-b-toukei-teki-na-suisoku | 40 |  |
| 数学III | 微分法 | jp-suugaku-3-bibun | 39 |  |
| 数学III | 極限 | jp-suugaku-3-kyokugen | 40 |  |
| 数学III | 積分法 | jp-suugaku-3-sekibun | 38 |  |
| 数学C | 数学的な表現の工夫 | jp-suugaku-c-hyougen-no-kufuu | 23 |  |
| 数学C | 平面上の曲線と複素数平面 | jp-suugaku-c-kyokusen-to-fukuso-heimen | 32 |  |
| 数学C | ベクトル | jp-suugaku-c-vector | 36 |  |
| Pre-Algebra | Data and probability | us-pre-algebra-data-and-probability | 0 |  |
| Pre-Algebra | Expressions and equations | us-pre-algebra-expressions-and-equations | 9 |  |
| Pre-Algebra | Geometry basics and measurement | us-pre-algebra-geometry-basics | 0 |  |
| Pre-Algebra | Integers and signed numbers | us-pre-algebra-integers | 0 |  |
| Pre-Algebra | Fractions, decimals, and rational numbers | us-pre-algebra-rational-numbers | 0 |  |
| Pre-Algebra | Ratios, proportions, and percents | us-pre-algebra-ratios-and-percents | 4 |  |
| Algebra 1 | Exponents and exponential functions | us-algebra-1-exponents-and-exponential-functions | 5 |  |
| Algebra 1 | Linear equations and inequalities | us-algebra-1-linear-equations | 8 |  |
| Algebra 1 | Linear functions and graphs | us-algebra-1-linear-functions | 18 |  |
| Algebra 1 | Polynomials and factoring | us-algebra-1-polynomials-and-factoring | 12 |  |
| Algebra 1 | Quadratic functions and equations | us-algebra-1-quadratics | 13 |  |
| Algebra 1 | Radical expressions | us-algebra-1-radicals | 5 |  |
| Algebra 1 | Data and statistics | us-algebra-1-statistics | 7 |  |
| Algebra 1 | Systems of equations and inequalities | us-algebra-1-systems | 6 |  |
| Geometry | Area and volume | us-geometry-area-and-volume | 9 |  |
| Geometry | Circles | us-geometry-circles | 13 |  |
| Geometry | Congruent triangles | us-geometry-congruent-triangles | 14 |  |
| Geometry | Coordinate geometry | us-geometry-coordinate-geometry | 3 |  |
| Geometry | Foundations of geometry | us-geometry-foundations | 13 |  |
| Geometry | Parallel and perpendicular lines | us-geometry-parallel-and-perpendicular | 7 |  |
| Geometry | Reasoning and proof | us-geometry-reasoning-and-proof | 18 |  |
| Geometry | Right triangles and trigonometry | us-geometry-right-triangles-and-trig | 4 |  |
| Geometry | Similarity | us-geometry-similarity | 10 |  |
| Geometry | Transformations | us-geometry-transformations | 10 |  |
| Algebra 2 | Exponential and logarithmic functions | us-algebra-2-exponential-and-logarithmic | 5 |  |
| Algebra 2 | Functions and their graphs | us-algebra-2-functions | 11 |  |
| Algebra 2 | Polynomial functions | us-algebra-2-polynomials | 11 |  |
| Algebra 2 | Probability and statistics | us-algebra-2-probability-and-statistics | 9 |  |
| Algebra 2 | Quadratic functions and complex numbers | us-algebra-2-quadratics-and-complex-numbers | 4 | 1 |
| Algebra 2 | Radical functions and rational exponents | us-algebra-2-radical-functions | 5 |  |
| Algebra 2 | Rational functions | us-algebra-2-rational-functions | 10 |  |
| Algebra 2 | Sequences and series | us-algebra-2-sequences-and-series | 6 |  |
| Algebra 2 | Trigonometric functions | us-algebra-2-trigonometry | 11 |  |
| Integrated Math 1 | Congruence and transformations | us-integrated-1-congruence-and-transformations | 0 |  |
| Integrated Math 1 | Coordinate geometry | us-integrated-1-coordinate-geometry | 0 |  |
| Integrated Math 1 | Exponential functions | us-integrated-1-exponential | 0 |  |
| Integrated Math 1 | Linear equations, inequalities, and functions | us-integrated-1-linear | 2 |  |
| Integrated Math 1 | Statistics | us-integrated-1-statistics | 4 |  |
| Integrated Math 1 | Systems of equations and inequalities | us-integrated-1-systems | 0 |  |
| Integrated Math 2 | Circles and solids | us-integrated-2-circles | 0 |  |
| Integrated Math 2 | Polynomials, radicals, and complex numbers | us-integrated-2-polynomials-and-complex | 0 |  |
| Integrated Math 2 | Probability | us-integrated-2-probability | 0 |  |
| Integrated Math 2 | Quadratic functions and equations | us-integrated-2-quadratics | 0 |  |
| Integrated Math 2 | Similarity and right triangle trigonometry | us-integrated-2-similarity-and-trig | 1 |  |
| Integrated Math 3 | Exponential and logarithmic functions | us-integrated-3-exponential-and-logarithmic | 0 |  |
| Integrated Math 3 | Geometric modeling | us-integrated-3-geometric-modeling | 1 |  |
| Integrated Math 3 | Statistics and inference | us-integrated-3-inference | 0 |  |
| Integrated Math 3 | Polynomial functions | us-integrated-3-polynomials | 0 |  |
| Integrated Math 3 | Rational and radical functions | us-integrated-3-rational-and-radical | 0 |  |
| Integrated Math 3 | Trigonometric functions | us-integrated-3-trigonometric-functions | 0 |  |
| Precalculus | Analytic trigonometry | us-precalculus-analytic-trigonometry | 13 |  |
| Precalculus | Conic sections | us-precalculus-conics | 6 |  |
| Precalculus | Exponential and logarithmic functions | us-precalculus-exponential-and-logarithmic | 5 |  |
| Precalculus | Functions | us-precalculus-functions | 8 |  |
| Precalculus | Introduction to calculus | us-precalculus-limits | 4 |  |
| Precalculus | Systems and matrices | us-precalculus-matrices-and-systems | 9 |  |
| Precalculus | Polar coordinates, complex numbers, and parametric equations | us-precalculus-polar-and-complex | 9 |  |
| Precalculus | Polynomial and rational functions | us-precalculus-polynomial-and-rational | 6 |  |
| Precalculus | Sequences, series, and induction | us-precalculus-sequences-and-induction | 2 | 2 |
| Precalculus | Trigonometric functions | us-precalculus-trigonometry | 0 |  |
| Precalculus | Vectors | us-precalculus-vectors | 9 |  |
| AP Calculus AB | Unit 1: Limits and continuity | us-ap-calculus-ab-1-limits | 10 |  |
| AP Calculus AB | Unit 2: Differentiation — definition and fundamental properties | us-ap-calculus-ab-2-differentiation-basics | 9 |  |
| AP Calculus AB | Unit 3: Differentiation — composite, implicit, and inverse functions | us-ap-calculus-ab-3-differentiation-advanced | 8 |  |
| AP Calculus AB | Unit 4: Contextual applications of differentiation | us-ap-calculus-ab-4-contextual-applications | 6 |  |
| AP Calculus AB | Unit 5: Analytical applications of differentiation | us-ap-calculus-ab-5-analytical-applications | 11 |  |
| AP Calculus AB | Unit 6: Integration and accumulation of change | us-ap-calculus-ab-6-integration | 13 |  |
| AP Calculus AB | Unit 7: Differential equations | us-ap-calculus-ab-7-differential-equations | 6 |  |
| AP Calculus AB | Unit 8: Applications of integration | us-ap-calculus-ab-8-applications-of-integration | 9 |  |
| AP Calculus BC | Unit 10: Infinite sequences and series | us-ap-calculus-bc-10-series | 21 |  |
| AP Calculus BC | Units 6–8 (BC only): Integration by parts, partial fractions, improper integrals, Euler's method, logistic models, arc length | us-ap-calculus-bc-6-integration-techniques | 6 |  |
| AP Calculus BC | Unit 9: Parametric equations, polar coordinates, and vector-valued functions | us-ap-calculus-bc-9-parametric-polar-vector | 5 |  |
| AP Statistics | Unit 1: Exploring One-Variable Data and Collecting Data | us-ap-statistics-1-exploring-and-collecting-data | 27 |  |
| AP Statistics | Unit 2: Probability, Random Variables, and Probability Distributions | us-ap-statistics-2-probability-and-distributions | 6 |  |
| AP Statistics | Unit 3: Inference for Categorical Data: Proportions | us-ap-statistics-3-inference-for-proportions | 19 |  |
| AP Statistics | Unit 4: Inference for Quantitative Data: Means | us-ap-statistics-4-inference-for-means | 7 |  |
| AP Statistics | Unit 5: Regression Analysis | us-ap-statistics-5-regression-analysis | 6 |  |
| Calculus I | Applications of derivatives | us-calculus-1-applications-of-derivatives | 5 |  |
| Calculus I | Applications of integration | us-calculus-1-applications-of-integration | 0 |  |
| Calculus I | Derivatives | us-calculus-1-derivatives | 2 |  |
| Calculus I | Functions and graphs | us-calculus-1-functions | 5 |  |
| Calculus I | Integration | us-calculus-1-integration | 8 |  |
| Calculus I | Limits | us-calculus-1-limits | 4 |  |
| Calculus II | Applications of integration | us-calculus-2-applications-of-integration | 4 |  |
| Calculus II | Introduction to differential equations | us-calculus-2-differential-equations | 6 |  |
| Calculus II | Parametric equations and polar coordinates | us-calculus-2-parametric-and-polar | 3 |  |
| Calculus II | Power series | us-calculus-2-power-series | 4 |  |
| Calculus II | Sequences and series | us-calculus-2-sequences-and-series | 5 |  |
| Calculus II | Techniques of integration | us-calculus-2-techniques-of-integration | 8 |  |
| Calculus III | Multiple integration | us-calculus-3-multiple-integrals | 7 |  |
| Calculus III | Differentiation of functions of several variables | us-calculus-3-partial-derivatives | 12 |  |
| Calculus III | Vector calculus | us-calculus-3-vector-calculus | 10 |  |
| Calculus III | Vector-valued functions | us-calculus-3-vector-valued-functions | 6 |  |
| Calculus III | Vectors in space | us-calculus-3-vectors-in-space | 6 |  |
| Linear Algebra | Determinants | us-linear-algebra-determinants | 5 |  |
| Linear Algebra | Eigenvalues and eigenvectors | us-linear-algebra-eigenvalues | 11 | 1 |
| Linear Algebra | Linear transformations | us-linear-algebra-linear-transformations | 8 |  |
| Linear Algebra | Orthogonality and least squares | us-linear-algebra-orthogonality | 11 |  |
| Linear Algebra | Systems of linear equations and matrices | us-linear-algebra-systems-and-matrices | 14 | 2 |
| Linear Algebra | Vector spaces | us-linear-algebra-vector-spaces | 13 |  |
| Intro Statistics | Confidence intervals | us-intro-statistics-confidence-intervals | 4 |  |
| Intro Statistics | Continuous random variables and the normal distribution | us-intro-statistics-continuous-distributions | 5 | 1 |
| Intro Statistics | Descriptive statistics | us-intro-statistics-descriptive-statistics | 6 |  |
| Intro Statistics | Discrete random variables | us-intro-statistics-discrete-distributions | 4 |  |
| Intro Statistics | Hypothesis testing | us-intro-statistics-hypothesis-testing | 6 |  |
| Intro Statistics | Probability topics | us-intro-statistics-probability | 6 |  |
| Intro Statistics | Linear regression and correlation | us-intro-statistics-regression | 4 | 1 |
| Intro Statistics | Sampling and data | us-intro-statistics-sampling-and-data | 9 |  |
| Discrete Math | Counting | us-discrete-math-counting | 6 |  |
| Discrete Math | Discrete probability | us-discrete-math-discrete-probability | 5 |  |
| Discrete Math | Relations, graphs, and trees | us-discrete-math-graphs-and-relations | 14 |  |
| Discrete Math | Induction and recursion | us-discrete-math-induction-and-recursion | 7 |  |
| Discrete Math | Logic and proofs | us-discrete-math-logic-and-proofs | 17 |  |
| Discrete Math | Number theory | us-discrete-math-number-theory | 10 |  |
| Discrete Math | Sets, functions, and sequences | us-discrete-math-sets-and-functions | 8 |  |

## D. draft の一覧と理由（12 語）

どれも flags の draft-reason に同じ理由を書いた。共通する理由は「英語の用語として実在するが、確かめられる出典（OpenStax・CED・Nicholson・台帳の Wikipedia）がない」。

| id | ja ／ en | 理由 |
|---|---|---|
| base-case | n = 1 のとき ／ base case | OpenStax にも台帳の Wikipedia にもない。用例コーパスでは MIT 6.042 だけ |
| inductive-hypothesis | 帰納法の仮定 ／ induction hypothesis | 同上 |
| inductive-step | 帰納段階 ／ inductive step | 同上 |
| elementary-symmetric-polynomial | 基本対称式 ／ elementary symmetric polynomial | 台帳の Wikipedia に langlink がなく、OpenStax にもない。用例コーパス 0 件 |
| nested-radical | 二重根号 ／ nested radical | 同上 |
| triple-angle-formulas | 3 倍角の公式 ／ triple-angle formulas | OpenStax にも台帳の Wikipedia にもない。用例コーパス 0 件 |
| free-variable | 自由変数 ／ free variable | OpenStax・Nicholson になく、台帳の Wikipedia は論理学の別概念。用例コーパスでは MIT 18.06 だけ |
| pivot | ピボット ／ pivot | OpenStax・Nicholson・台帳の Wikipedia（曖昧さ回避）で確かめられない。MIT 18.06 だけ |
| geometric-multiplicity | 幾何的重複度 ／ geometric multiplicity | Nicholson はこの名前を使わず dim E_λ と書く。OpenStax・Wikipedia にもない |
| normal-probability-plot | 正規確率プロット ／ normal probability plot | OpenStax・台帳の Wikipedia・AP Statistics の CED（2026 年版）のどれにもない |
| t-test-for-the-slope | 傾きの t 検定 ／ t-test for the slope | 同上（2026 年版の CED は傾きの推測を扱わない） |
| quadratic-regression | 二次関数の回帰 ／ quadratic regression | 用例コーパス・CED・OpenStax・IM・CK-12・Nicholson・Levin とも 0 件、台帳に Wikipedia の記事もない（バッチ 7） |

draft は書き出し（dist/data の terms.json ほか）とサイトから除かれる（src/lib/data.ts。terms.json 1,528 語）。

## E. 人間レビューに残るもの

1. **③ で参照にも呼び方がないもの**（corpus-undecided）: terms/quadratic-regression、phrases 5 語（class-asking-repeat・exam-clarify-instruction・explaining-solution-first-step・office-hours-stuck-at-step・written-solution-therefore。phrases は Phase 3 で扱う）
2. **コーパスの結論がエントリの register と食い違うもの**: 0 語
3. 規則の判断を求めるもの（phase2-middle-school-3-report B）: 1 の規則で見出しが変わった微積分の 10 語、constant-of-proportionality
4. 語数（A）: 2,000 語に届かせるなら、台帳に足す単元と行

## F. Phase 5 の監査に回す論点

各レポートの「怪しい点」「気になっている点」「自己監査」の節をまとめた。**〔済〕** は後のセッションで直したもの（参考に残す）。出典のレポートは略称（integral = phase2-integral-report、integral-fix、calculus、series、algebra2、stats-vectors、stats-vectors-2、geometry-discrete、geometry-discrete-2、geometry-discrete-3、middle、middle-2、middle-3）。

### F-1. 出典と「米国では〜」の主張

- 出典が editorial だけの likely が 124 語ある（本まとめで数えた）。多くは ③ を参照で決めた語や句で、参照は flags の note にあるが sources には入っていない。出典の付け方（参照を sources にも入れるか、editorial だけの語を draft にするか）を決める
- 記憶で書いた米国側の主張（integral D-1）: shell method・trigonometric substitution が AP の範囲外、accumulation function の呼び方、FTC の Part 1 ／ 2 の呼び方の教科書差、座標軸以外の回転軸、tabular integration・LIPET、S(x) と A(x)、添字 i、x と t の対応表を書かない、pound・foot など。trigonometric-substitution の本文は今は CED の topic 番号で書いてある。ほかは監査で CED・OpenStax に当てる
- 事実欄に確かめずに書いた主張が本文に入っていた（middle-3 C-3。バッチ 7・8 は全部洗って直した）。前のバッチの本文にも同じ穴がありうる
- 件数の警告（validate）は発見的で、参照の名前と「件」を含む文に用例コーパスの件数が混ざると見逃す（middle-2 F）。「OpenStax の 6 冊」のように書き言葉コーパスが 9 冊になる前の書き方が残る文がある
- 本文の件数を外した書き直し（726 エントリ・946 欄）は書き直し役の仕事で、全文を一文ずつは読んでいない（middle-2 F）
- 〔済〕件数を書いた本文が古いままの 123 語（middle H）→ 本文から件数を外した（middle-2 A-1）

### F-2. 見出しの規則と 1 ソース頼み

- 見出しの規則（書き言葉も 1 ソース頼みなら level の参照）で、微積分の 10 語が講義 1 つの言い方になった（middle-3 B-2）。constant-of-proportionality は定義に当たらず constant of variation のまま（middle-3 B-1）
- 1 ソース頼みの単位は manifest の id（OpenStax の本・MIT の講義・YouTube のチャンネル）。まとめて 1 つと数えると下がる語が増える（integral-fix I）
- ① を ② に下げたときの相手が 1〜5 件の語がある（interval-of-integration の limits of integration 60 ／ interval of integration 1。integral-fix I）。相手の件数に下限を設けるか
- 中学の語の話し言葉の多くは Khan Academy の中学だけ（prime-factorization・dilation ほか。middle H）、線形代数は MIT 18.06 だけ（stats-vectors-2 I）、Discrete Math は MIT 6.042 だけ（geometry-discrete-3 H）、幾何の話し言葉は The Organic Chemistry Tutor だけ（geometry-discrete H・geometry-discrete-2 H）
- find-an-antiderivative の take the antiderivative（Khan Academy）、which-one-to-differentiate の pick u（YouTube）など、1 ソースの言い方が見出しの語（integral D-2）
- 規則 1 に足した条件（LIATE・candidates test を「決まった言い方がない」にしない。calculus J）と、「3 件以上」を候補ごと・参照ごとと読んだこと（geometry-discrete-3 H）
- 〔済〕aas-congruence（geometry-discrete-3 H・middle H）→ 人間が AAS に決めた（middle-2 A-4）
- 〔済〕reviewed.human を「人間が ③ を決めた」印に使った（series I）→ flag corpus-human-settled に替えた（algebra2 の前の修正）

### F-3. 数え方（形・別の意味）

- 別の意味が混ざる件数: approaches・bounded・differential・divergence・squeeze・sum rule・product rule・parameter（calculus J）、region・orientation・phase・compare・the remainder is・expansion of・row-echelon form・conjugate roots（algebra2 I）、characteristic polynomial・linear system・degrees of freedom・error bound（stats-vectors-2 I）、statistical-variable の variable・statistical-hypothesis の hypothesis（geometry-discrete-3 H）、secant（割線が少し。middle-3）
- 形の選び方には判断が入る（bounded・focus・pole・argument。series I）。TERM_FORMS に複数形だけの形が残っていないかは全部は見ていない（middle H）
- 語形変化の規則の穴: Bayes が bay と同じ語になる、vary ／ varies や estimate ／ estimation をまとめない（stats-vectors J）、is-biased が名詞の bias も数える（stats-vectors-2 I）
- 含む関係の二重数え（slope of the tangent ／ … line。calculus J）
- 台帳の暫定の見出しが汎用の句だと、別の意味の件数で ① になる穴（substituting values。algebra2 I）
- IM の件数はレッスンと練習問題を合わせて数えた（再掲の分だけ多い。geometry-discrete-2 H）。CK-12 Algebra は一部しか取れていない、中学の本はない（geometry-discrete-3 H）
- AP Statistics の CED は 2026 年版。旧版の単元の語（傾きの推測・適合度検定）は確かめられない（stats-vectors-2 I）

### F-4. 見出しと意味の範囲

- 見出しが日本語より狭い・広い語: find-the-asymptotes・derivative-of-the-exponential-function・derivative-of-the-logarithm・radical-function・is-monotonically-increasing（calculus J）、度数・上端・下端・階級・一筆書き（stats-vectors J）、recursion（geometry-discrete-3 H）、imaginary-solution の complex solution（algebra2 I）、can-be-integrated の integrable（integral D-2）
- en.term がどの register の首位でもない語（limit-laws・accumulation-function・midpoint-riemann-sum・overestimate-and-underestimate ほか。calculus J・B の「その他」8 語）
- id と en.term が離れた語（reduce・substituting-values・leading-digit・undo-the-log・general-angle・rotated-conics・orthogonal-projection。algebra2 I）。今回の slope-intercept-form-of-a-line・system-of-linear-inequalities は改名した
- 参照の 1〜2 件で決まった見出し（negate・composite number・circumcircle・concurrent・empty set・alternate interior angles theorem・scalene triangle・similarity transformation・ruler-postulate・common-tangent・law-of-syllogism・space-diagonal ほか。geometry-discrete H・geometry-discrete-2 H・geometry-discrete-3 H・middle-3 E）
- Wikipedia の記事名で決まった見出しが教室の言い方とずれるかもしれない語（proof by exhaustion・modular multiplicative inverse・Euclid's theorem。geometry-discrete-3 H）。Wikipedia の 4 段の規則は幾何の記事の多くを締め出す（geometry-discrete-2 H）
- Nicholson 1 冊の流儀で決めた見出し（dimension theorem・Gram-Schmidt algorithm・LU factorization。stats-vectors-2 I）
- 「英語に決まった言い方がない」にしたが英語に名前がある語（nested radical・基本対称式・power of a point・接弦定理・3 垂線の定理・linear pair・intercepted arc・arc measure。geometry-discrete H・geometry-discrete-2 H）
- one-sixth-formula などの説明の訳を英語の名前と誤解されるおそれ（integral D-2）→ PLAN Phase 4 に印を付ける仕様を足した（middle-3 A-4）。表示は Phase 4
- 名詞のエントリの候補を名詞句に限った（joint-variation・continuous-compounding・direct-proportion。middle-3 D）。前のバッチには動詞句を見出しにした名詞のエントリ（derivatives-in-polar-form の differentiating in polar form。series I）が残る

### F-5. 1 概念 1 エントリと台帳

- 同じ概念が別の行になっている候補（面積・和の極限・原始関数・偶奇・置換・部分分数・積分定数・累積・曲線の長さ。integral D-3）
- 節の名前にあたる行（定積分と面積ほか。integral D-4）。今回 graphing-systems-of-inequalities は改名した
- 日本語の見出しが本プロジェクトの訳語の語で、mapping_note に「本プロジェクトの訳語」と書いたものと書いていないものがある（integral D-5）
- level.jp を台帳から直した語（geometry-discrete-2 H の 19 語、geometry-discrete-3 H の 31 語）、level.us を Intro Statistics に替えた 16 語のうち OpenStax に出ない語（geometry-discrete H）
- 台帳の統合の判断（middle D）。〔済〕割合を百分率に寄せた → 独立したエントリ rate に戻した（middle-2 A-2）
- 後の単元の行を先に生成した語は、その単元の観点が本文に足りないかもしれない（series I・algebra2 I）
- 三角形の読み（さんかくけい ／ さんかっけい）が混在（geometry-discrete-2 H）

### F-6. データの形

- move-term-to-other-side（句）の例文 2 文がどちらも spoken（本まとめで見つけた）
- corpus-human-settled は flag なので、その語は verified に上げられない（validate は verified の語に flag を許さない。algebra2 I）。Phase 5 で verified にするときの扱いを決める
- divergence の en.term が 2 語で同じ（SAME_EN_TERM で許している。series I）。同じ英語の見出しの組は SAME_EN_TERM に 23 組

## G. 次のフェーズ

- Phase 3（記号・フレーズ・慣習差）: 今は symbols 11 ／ phrases 5 ／ conventions 3。phrases の候補は ledger/phrases-candidates.csv（83 行）
- Phase 4（サイト）: 用語ページに evidence の件数の表と、説明の訳の印（PLAN Phase 4 の 2）
- Phase 5（監査）: F の論点。別セッションで行う
