# Phase 1 修正レポート — 台帳の直しと Khan 字幕の判定

作成: 2026-09-23 ／ 対象: `ledger/terms.csv`（Phase 1 = 5593045 → 本コミット） ／ 手順: `scripts/ledger/fix_phase1.py`

## まとめ

- 台帳 **2,488 行 → 2,357 行**（統合 126・改名 59・範囲外へ 5）。複数単元に属する語 114
- 米国側 mapping none 365 → 語ごとに付け直して **exact 269 / near 42 / none 35**（残り 19 は統合・範囲外で消滅）
- Wikipedia 要確認 210 件 → **記事名違いで問題なし 168 ／ 別概念で除外 42**（うち数学カテゴリ外 22・カテゴリ内の別概念 20）。210 件の外でもカテゴリ規則等で 73 件を除外、合計 115 件
- level_jp「—」87 件 → 0 件。小学校 1 件は out-of-scope へ
- 指導要領〔用語・記号〕: **用語 48 件中 48 件**、記号 22 件中 3 件（記号は Phase 3 の symbols で扱う）
- ja.basis=mext **363 件**（wikipedia 560・editorial 1434）。ja.check 不一致 276 件
- out-of-scope.csv **5 件**
- 通分する・移項する: Khan 字幕を足しても **③ 判断不能のまま**（重み付け後 各 4 件）。原因は件数より照合方式（下記 B）

## A. push と片付け

- `5593045 Phase 1: curriculum … ledger/terms.csv (2,488 headwords)` を origin/main に push（`20e670d..5593045`）。GitHub のログインは求められなかった
- `_to_delete/`、`dist/phase1.tar`、`dist/phase1.bundle`、`dist/phase1-copy.bundle` を削除
- `pnpm test`（37/37）と `pnpm build`（21 ページ、export まで）が緑。Phase 1 時点で未実行だった 2 つ（DECISIONS 2026-09-11）はこれで確認済み

## B. Khan Academy 字幕（`scripts/corpus/fetch-captions.sh`）

| ソース | 対象 | 取得 | 語数 |
|---|---|---:|---:|
| khan-algebra | Algebra I（100 本）＋ Algebra II（100 本）＋ Algebra Basics: Linear equations and inequalities（35 本） | 182 / 235 本（人手の英語字幕がある動画のみ） | 175,056 |

進捗は 235 本に対する done/total で出した。確認した途中経過: 46（不具合に気づいて停止）→ 取り直し 32 → 215 → 223 → 235。

**スクリプトの不具合を直して取り直した。** `--sub-langs "en.*"` が他言語からの機械翻訳字幕（`en-bg`、`en-ko`、`en-zh-Hans` …）まで拾い、1 本あたり約 17 ファイルを落としていた。しかも変換時に全部同じ `.txt` 名になるため、最後に処理された機械翻訳が残る。429（Too Many Requests）もこれが原因。人手字幕 `en,en-US` のみに変更し（自動字幕は `AUTO=1` のときだけ `en`）、46 本目で止めて最初から取り直した。

OCW はこのマシンに `corpus/` が無かったので `pnpm corpus:fetch:ocw` で取り直した（484 本）。18.01 が前回より大幅に増えたため（142,270 → 487,139 語）、重み付けで 25% に均している（×0.81）。

### 判定（`pnpm corpus:count && pnpm corpus:decide`、`audits/corpus-2026-09-24.md`）

| 語 | 話し言葉 | 書き言葉 | 判定 |
|---|---|---|---|
| 通分する `find-a-common-denominator` | find a common denominator 2（khan）／ put them over a common denominator 2（18.01）→ 重み付け後 4 件 | 0 件 | **③ 判断不能**（10 件未満）。人間レビュー行きのまま |
| 移項する `move-term-to-other-side` | subtract 3 from both sides 1 ／ add 3 to both sides 1（khan）／ isolate x 2（18.03）→ 重み付け後 4 件 | 0 件 | **③ 判断不能**（10 件未満）。人間レビュー行きのまま |

**判断不能の原因は件数より照合方式。** terms の照合は literal（DECISIONS 2026-09-11 で確定）で、候補が `subtract 3 from both sides` のように数字込みの文字列になっているため、実際の授業の「subtract 5x from both sides」に当たらない。規則は変えていない。人間レビューの材料として、緩い正規表現で数えた**参考値**（判定には使っていない）を置く:

| 表現（正規表現で照合） | 件数 | 内訳 |
|---|---:|---|
| subtract X from both sides | 80 | khan 76 ／ 18.01 4 |
| add X to both sides | 67 | khan 61 ／ 18.02 4 ／ 18.01 2 |
| move / bring … over | 46 | 18.01 15 ／ 18.02 10 ／ 18.03 8 ／ 6.042 6 ／ khan 4 ／ 18.06 3 |
| isolate | 75 | khan 50 ／ 18.01 16 ／ 18.03 7 ／ 18.02 2 |
| common denominator | 29 | 18.01 21 ／ khan 8 |
| put / get / rewrite … over a common denominator | 6 | 18.01 6 |
| find a / the common denominator | 2 | khan 2 |

- 移項: Algebra の授業（Khan）では「両辺に同じ操作」が「move … over」の 30 倍以上。STYLE の「Algebra 1 の先生は口頭でも両辺操作を好む」と同じ向き。decide が数えられるよう、Phase 2 で候補表現を数字なしの形（`from both sides`、`to both sides`）にするか、terms にもワイルドカード照合を許すかを決める必要がある（後者は DECISIONS の変更になるので保留）
- 通分: 「common denominator」は 29 件あるが、動詞句の形はばらけている。Khan の Fractions（Arithmetic）を足すと増えるが、計画上のソース（PLAN 15）に無いので取っていない
- 副産物: `terms/substitute` に「substitute back」（話し言葉 11 件）の register 不一致が新たに出た（`corpus-register-mismatch`、人間レビュー行き）。plug in 450 ／ substitute 215 で ② 併記は変わらず

## 単元別件数（修正後）

「主単元」は `unit` の先頭（最初に習う単元）。「共有」はその単元を 2 番目以降に持つ語の数（統合で単元を複数持てるようにした分）。

### 日本側

| 科目 | 単元 | Phase 1 | 修正後（主単元） | 他単元から共有 | 動詞・形容詞・句 |
|---|---|---:|---:|---:|---:|
| 中1 | 正の数と負の数 | 49 | 49 | 0 | 35% |
| 中1 | 文字と式 | 36 | 36 | 0 | 31% |
| 中1 | 一次方程式 | 31 | 30 | 1 | 60% |
| 中1 | 比例と反比例 | 31 | 30 | 1 | 40% |
| 中1 | 平面図形 | 56 | 56 | 0 | 27% |
| 中1 | 空間図形 | 37 | 37 | 0 | 16% |
| 中1 | データの活用 | 30 | 30 | 0 | 27% |
| 中2 | 式の計算 | 33 | 33 | 0 | 24% |
| 中2 | 連立方程式 | 22 | 22 | 0 | 55% |
| 中2 | 一次関数 | 27 | 27 | 0 | 41% |
| 中2 | 平行と合同 | 45 | 45 | 0 | 24% |
| 中2 | 三角形と四角形 | 30 | 30 | 0 | 33% |
| 中2 | データの活用 | 15 | 15 | 0 | 20% |
| 中2 | 確率 | 25 | 25 | 0 | 40% |
| 中3 | 式の展開と因数分解 | 27 | 26 | 1 | 23% |
| 中3 | 平方根 | 26 | 25 | 1 | 28% |
| 中3 | 二次方程式 | 21 | 21 | 0 | 52% |
| 中3 | 関数 y=ax² | 20 | 20 | 0 | 50% |
| 中3 | 相似な図形 | 24 | 24 | 0 | 29% |
| 中3 | 円 | 19 | 19 | 0 | 37% |
| 中3 | 三平方の定理 | 19 | 18 | 0 | 28% |
| 中3 | 標本調査 | 15 | 15 | 0 | 27% |
| 数学I | 数と式 | 37 | 35 | 2 | 51% |
| 数学I | 集合と命題 | 48 | 47 | 0 | 40% |
| 数学I | 二次関数 | 36 | 35 | 1 | 40% |
| 数学I | 図形と計量 | 48 | 44 | 1 | 18% |
| 数学I | データの分析 | 35 | 34 | 1 | 32% |
| 数学A | 場合の数と確率 | 56 | 56 | 0 | 32% |
| 数学A | 図形の性質 | 52 | 50 | 2 | 24% |
| 数学A | 数学と人間の活動 | 40 | 39 | 1 | 33% |
| 数学II | 式と証明 | 42 | 39 | 3 | 33% |
| 数学II | 複素数と方程式 | 41 | 41 | 0 | 24% |
| 数学II | 図形と方程式 | 41 | 35 | 6 | 31% |
| 数学II | 三角関数 | 49 | 47 | 2 | 36% |
| 数学II | 指数関数と対数関数 | 42 | 40 | 2 | 32% |
| 数学II | 微分の考え | 45 | 40 | 2 | 45% |
| 数学II | 積分の考え | 32 | 32 | 0 | 28% |
| 数学B | 数列 | 51 | 51 | 0 | 35% |
| 数学B | 統計的な推測 | 45 | 43 | 2 | 23% |
| 数学B | 数学と社会生活 | 14 | 13 | 1 | 23% |
| 数学III | 極限 | 52 | 52 | 0 | 52% |
| 数学III | 微分法 | 57 | 56 | 1 | 34% |
| 数学III | 積分法 | 47 | 46 | 1 | 43% |
| 数学C | ベクトル | 50 | 50 | 0 | 24% |
| 数学C | 平面上の曲線と複素数平面 | 46 | 43 | 3 | 23% |
| 数学C | 数学的な表現の工夫 | 27 | 27 | 0 | 15% |
| **計** | | **1671** | **1628** | 35 | |

### 米国側（逆に洗った語）

| 科目 | 単元 | Phase 1 | 修正後（主単元） | 他単元から共有 | 動詞・形容詞・句 |
|---|---|---:|---:|---:|---:|
| Pre-Algebra | Expressions and equations | 9 | 6 | 3 | 50% |
| Pre-Algebra | Ratios, proportions, and percents | 10 | 5 | 0 | 20% |
| Algebra 1 | Linear equations and inequalities | 8 | 7 | 1 | 29% |
| Algebra 1 | Linear functions and graphs | 19 | 15 | 4 | 20% |
| Algebra 1 | Systems of equations and inequalities | 6 | 6 | 0 | 0% |
| Algebra 1 | Exponents and exponential functions | 5 | 4 | 1 | 0% |
| Algebra 1 | Polynomials and factoring | 13 | 10 | 3 | 20% |
| Algebra 1 | Quadratic functions and equations | 15 | 13 | 2 | 38% |
| Algebra 1 | Radical expressions | 7 | 7 | 0 | 43% |
| Algebra 1 | Data and statistics | 7 | 7 | 0 | 0% |
| Geometry | Foundations of geometry | 14 | 14 | 0 | 0% |
| Geometry | Reasoning and proof | 20 | 18 | 2 | 6% |
| Geometry | Parallel and perpendicular lines | 8 | 8 | 0 | 0% |
| Geometry | Congruent triangles | 16 | 15 | 1 | 7% |
| Geometry | Similarity | 10 | 8 | 2 | 0% |
| Geometry | Right triangles and trigonometry | 5 | 5 | 0 | 40% |
| Geometry | Circles | 13 | 10 | 3 | 0% |
| Geometry | Area and volume | 9 | 8 | 1 | 0% |
| Geometry | Transformations | 10 | 9 | 1 | 0% |
| Geometry | Coordinate geometry | 3 | 3 | 0 | 67% |
| Algebra 2 | Functions and their graphs | 11 | 11 | 0 | 0% |
| Algebra 2 | Quadratic functions and complex numbers | 4 | 3 | 1 | 0% |
| Algebra 2 | Polynomial functions | 13 | 11 | 2 | 0% |
| Algebra 2 | Rational functions | 10 | 8 | 2 | 0% |
| Algebra 2 | Radical functions and rational exponents | 5 | 2 | 3 | 0% |
| Algebra 2 | Exponential and logarithmic functions | 5 | 5 | 0 | 0% |
| Algebra 2 | Sequences and series | 6 | 5 | 1 | 0% |
| Algebra 2 | Trigonometric functions | 11 | 10 | 1 | 0% |
| Algebra 2 | Probability and statistics | 9 | 8 | 1 | 0% |
| Precalculus | Functions | 8 | 5 | 3 | 0% |
| Precalculus | Polynomial and rational functions | 7 | 7 | 0 | 0% |
| Precalculus | Exponential and logarithmic functions | 5 | 5 | 0 | 0% |
| Precalculus | Analytic trigonometry | 14 | 11 | 3 | 0% |
| Precalculus | Vectors | 9 | 7 | 2 | 0% |
| Precalculus | Polar coordinates, complex numbers, and parametric equations | 9 | 8 | 1 | 0% |
| Precalculus | Conic sections | 7 | 7 | 0 | 0% |
| Precalculus | Systems and matrices | 9 | 9 | 0 | 0% |
| Precalculus | Sequences, series, and induction | 3 | 2 | 1 | 0% |
| Precalculus | Introduction to calculus | 5 | 5 | 0 | 40% |
| Integrated Math 1 | Linear equations, inequalities, and functions | 2 | 2 | 0 | 0% |
| Integrated Math 1 | Statistics | 4 | 4 | 0 | 0% |
| Integrated Math 2 | Similarity and right triangle trigonometry | 1 | 1 | 0 | 0% |
| Integrated Math 3 | Geometric modeling | 1 | 1 | 0 | 0% |
| AP Calculus AB | Unit 1: Limits and continuity | 10 | 8 | 2 | 12% |
| AP Calculus AB | Unit 2: Differentiation — definition and fundamental properties | 9 | 8 | 1 | 0% |
| AP Calculus AB | Unit 3: Differentiation — composite, implicit, and inverse functions | 8 | 6 | 2 | 33% |
| AP Calculus AB | Unit 4: Contextual applications of differentiation | 7 | 6 | 1 | 0% |
| AP Calculus AB | Unit 5: Analytical applications of differentiation | 12 | 7 | 5 | 0% |
| AP Calculus AB | Unit 6: Integration and accumulation of change | 15 | 11 | 4 | 0% |
| AP Calculus AB | Unit 7: Differential equations | 6 | 6 | 0 | 0% |
| AP Calculus AB | Unit 8: Applications of integration | 9 | 8 | 1 | 0% |
| AP Calculus BC | Units 6–8 (BC only): Integration by parts, partial fractions, improper integrals, Euler's method, logistic models, arc length | 6 | 5 | 1 | 0% |
| AP Calculus BC | Unit 9: Parametric equations, polar coordinates, and vector-valued functions | 5 | 5 | 0 | 0% |
| AP Calculus BC | Unit 10: Infinite sequences and series | 22 | 22 | 0 | 0% |
| AP Statistics | Unit 1: Exploring one-variable data | 12 | 12 | 0 | 8% |
| AP Statistics | Unit 2: Exploring two-variable data | 8 | 7 | 1 | 0% |
| AP Statistics | Unit 3: Collecting data | 15 | 15 | 0 | 0% |
| AP Statistics | Unit 4: Probability, random variables, and probability distributions | 6 | 6 | 0 | 0% |
| AP Statistics | Unit 5: Sampling distributions | 4 | 4 | 0 | 0% |
| AP Statistics | Unit 6: Inference for categorical data — proportions | 10 | 10 | 0 | 20% |
| AP Statistics | Unit 7: Inference for quantitative data — means | 5 | 5 | 0 | 0% |
| AP Statistics | Unit 8: Inference for categorical data — chi-square | 6 | 6 | 0 | 0% |
| AP Statistics | Unit 9: Inference for quantitative data — slopes | 3 | 3 | 0 | 0% |
| Calculus I | Functions and graphs | 6 | 5 | 1 | 0% |
| Calculus I | Limits | 4 | 4 | 0 | 0% |
| Calculus I | Derivatives | 4 | 3 | 1 | 0% |
| Calculus I | Applications of derivatives | 5 | 4 | 1 | 0% |
| Calculus I | Integration | 8 | 7 | 1 | 0% |
| Calculus II | Techniques of integration | 9 | 8 | 1 | 0% |
| Calculus II | Applications of integration | 4 | 4 | 0 | 0% |
| Calculus II | Introduction to differential equations | 6 | 5 | 1 | 0% |
| Calculus II | Sequences and series | 5 | 5 | 0 | 0% |
| Calculus II | Power series | 4 | 4 | 0 | 0% |
| Calculus II | Parametric equations and polar coordinates | 3 | 1 | 2 | 0% |
| Calculus III | Vectors in space | 6 | 6 | 0 | 0% |
| Calculus III | Vector-valued functions | 6 | 6 | 0 | 0% |
| Calculus III | Differentiation of functions of several variables | 13 | 13 | 0 | 8% |
| Calculus III | Multiple integration | 8 | 8 | 0 | 0% |
| Calculus III | Vector calculus | 10 | 10 | 0 | 0% |
| Linear Algebra | Systems of linear equations and matrices | 15 | 15 | 0 | 0% |
| Linear Algebra | Determinants | 6 | 6 | 0 | 0% |
| Linear Algebra | Vector spaces | 13 | 13 | 0 | 8% |
| Linear Algebra | Linear transformations | 9 | 6 | 3 | 17% |
| Linear Algebra | Eigenvalues and eigenvectors | 12 | 12 | 0 | 8% |
| Linear Algebra | Orthogonality and least squares | 11 | 10 | 1 | 10% |
| Intro Statistics | Sampling and data | 8 | 8 | 0 | 0% |
| Intro Statistics | Descriptive statistics | 6 | 5 | 1 | 0% |
| Intro Statistics | Probability topics | 5 | 4 | 1 | 0% |
| Intro Statistics | Discrete random variables | 3 | 3 | 0 | 0% |
| Intro Statistics | Continuous random variables and the normal distribution | 4 | 4 | 0 | 0% |
| Intro Statistics | Confidence intervals | 4 | 3 | 1 | 0% |
| Intro Statistics | Hypothesis testing | 5 | 5 | 0 | 0% |
| Intro Statistics | Linear regression and correlation | 4 | 4 | 0 | 0% |
| Discrete Math | Logic and proofs | 17 | 16 | 1 | 6% |
| Discrete Math | Sets, functions, and sequences | 9 | 8 | 1 | 12% |
| Discrete Math | Number theory | 10 | 9 | 1 | 0% |
| Discrete Math | Induction and recursion | 7 | 6 | 1 | 0% |
| Discrete Math | Counting | 6 | 5 | 1 | 0% |
| Discrete Math | Discrete probability | 5 | 5 | 0 | 0% |
| Discrete Math | Relations, graphs, and trees | 14 | 14 | 0 | 7% |
| **計** | | **817** | **729** | 83 | |

- mapping: exact 1760 ／ near 548 ／ none 49（Phase 1: 1595 / 514 / 379）
- level_jp（複数可なので延べ）: 中1 280、中2 209、中3 176、数I 211、数A 149、数II 302、数B 114、数III 172、数C 124、大学 653
- source: editorial 1228、textbook 640、wikipedia-langlink 320、wikidata 169

## C-1. mapping の付け直し（米国側 none 365）

mapping は**語の対応の質**。「日本の高校範囲外」は `level_jp = 大学` で表す。判断表は `fix_decisions.py` の `MAPPING`（載っていない語は exact）。

| 付け直し後 | 件数 | 例 |
|---|---:|---|
| exact | 269 | 固有値 eigenvalue、偏導関数 partial derivative、テイラー級数、ロピタルの定理、ドットプロット、平均絶対偏差、映進 glide reflection |
| near | 42 | 関連変化率 related rates、シェル法（バウムクーヘン積分）、n 項判定法、ラグランジュの誤差限界（日本は剰余項）、hole（除去可能不連続点）、FTC part 1 / 2 |
| none | 35 | PEMDAS、FOIL、two-column proof、CPCTC、SOHCAHTOA、point-slope form、reference angle、disk / washer method、LIATE、net change theorem |
| 消滅（統合・範囲外） | 19 | slope field ← direction field、area in polar（重複）、foot / mile / sales tax / tip |

付け直しの途中で見つけた見出し語の誤りも直した: 点・直線・平面 → **無定義用語**、デル → **ナブラ**（∇）、変数の種類 → **尺度水準**、グライド反射 → **映進**、勾配場 → **方向場**（勾配場は gradient field で別物）、単調数列定理 → **単調収束定理**。レベルも 4 件（parent function → 数I、net change theorem → 数II、telescoping series → 数B、trigonometric substitution → 数III）。壊れていた id `x`（親関数）は `parent-function` に。

## C-2. Wikipedia の誤マッチ

規則: **ja 記事が `Category:数学` / `統計学` / `数理科学` から 4 段以内になければ langlink を採用しない**（`scripts/ledger/wikicat.py`）。深さ 4 は較正して決めた: 5 にするとデル・テクノロジーズ・フィート・マイルが数学扱いになり、4 なら縮図（映画）・髭・分子・F(x)（K-POP グループ）・連立（外交）がすべて外れる。en 側のカテゴリは Demarchy が 3 段で数学に届くほど雑なので使わない。カテゴリ内でも別概念のもの（三角不等式 → Triangle inequality 等）は `WIKI_WRONG` に 1 行ずつ理由を書いて外した。

### 210 件の内訳: 記事名違いで問題なし **168** ／ 別概念で除外 **42**

「記事名違いで問題なし」は、同じ概念で記事名が違う（等差数列 → Arithmetic progression）か、その語を定義している親記事（外心 → Circumscribed circle、対辺 → Triangle）のもの。

| id | 日本語 | 当たった記事 | 除外理由 |
|---|---|---|---|
| algebraic-expression | 文字式 | Polynomial | Polynomial は多項式。文字式は分数式も含む |
| variable | 文字 | Writing system | Writing system（文字体系） |
| relationship | 関係 | Finitary relation | Finitary relation は形式的な関係。中1 の「数量の関係」ではない |
| plug-in | 代入する | Substitution (logic) | Substitution (logic) は論理式の置換 |
| explain | 説明する | Explanation | Explanation（数学外） |
| set-up-a-system | 連立する | Coalition | Coalition（連立政権） |
| whisker | ひげ | Beard | Beard（髭） |
| lottery | くじ | Demarchy | Demarchy（くじ引き民主制） |
| toss | 投げる | Throwing | Throwing（投擲） |
| estimate | 評価する | Evaluation | Evaluation（評価一般） |
| braking-distance | 制動距離 | Brake | Brake（ブレーキ） |
| scale-drawing | 縮図 | Epitome (film) | Epitome (film)（映画「縮図」） |
| draw-a-circle | 円を描く | Igai ni Mango | Igai ni Mango（楽曲） |
| substitution-shiki | 置き換え | Permutation | Permutation（置換） |
| bearing | 方位 | Cardinal direction | Cardinal direction（方位）は bearing ではない |
| independent | 独立 | Independence | Independence（政治的独立） |
| drawing-lots | くじ引き | Demarchy | Demarchy（くじ引き民主制） |
| centroid | 重心 | Center of mass | Center of mass は物理の質量中心。図形の重心は Centroid |
| modulus | 法 | Division (mathematics) | Division (mathematics)。法（mod）ではない |
| numerator | 分子 | Molecule | Molecule（分子） |
| terminal-side | 動径 | Radius | Radius（半径） |
| trigonometric-inequality | 三角不等式 | Triangle inequality | Triangle inequality（三角不等式 |a+b|≦|a|+|b|） |
| local-maximum-alt | 極大 | Ordered set | Ordered set の極大元（maximal element） |
| local-minimum-alt | 極小 | Ordered set | Ordered set の極小元（minimal element） |
| common-difference | 公差 | Engineering tolerance | Engineering tolerance（公差・工学） |
| oscillate | 振動する | Oscillation | Oscillation（物理の振動） |
| substitute-sekibun | 置換する | Permutation | Permutation（置換） |
| vector-equation | ベクトル方程式 | System of linear equations | System of linear equations は連立一次方程式 |
| cross-product | 外積 | Exterior algebra | Exterior algebra（外積代数） |
| column | 列 | Sequence | Sequence（数列）。行列の列ではない |
| elimination-method | 消去法 | Process of elimination | Process of elimination（消去法・推論） |
| continuous-compounding | 連続複利 | Compound interest | 数学カテゴリ外（ja「複利」） |
| empirical-rule | 経験則 | Rule of thumb | Rule of thumb（経験則一般） |
| resultant | 合力 | Force | Force（物理の力） |
| limacon | リマソン | Caracole | Caracole（騎兵戦術） |
| power-rule-basics | べき乗則 | Power law | Power law（べき乗則・統計物理） |
| axis-of-revolution | 回転軸 | Shaft (mechanical engineering) | Shaft (mechanical engineering)（機械の軸） |
| explanatory-variable | 説明変数 | Expression (mathematics) | Expression (mathematics)（式） |
| control-group | 対照群 | Scientific control | 数学カテゴリ外（ja「対照実験」） |
| level-curve | 等高線 | Contour line | 数学カテゴリ外（ja「等高線」） |
| basis | 基底 | Base (topology) | Base (topology)（開基）。線形代数の基底ではない |
| cryptography | 暗号 | Encryption | 数学カテゴリ外（ja「暗号」） |

うち、同じ概念なのにカテゴリ規則で外れたもの: 連続複利（複利）、対照群（対照実験）、等高線（level curve）、暗号（cryptography）。例外は作らず、Phase 2 で textbook 等の別の出典を付ける。

### 210 件の外で除外したもの（73 件）

英語記事名が暫定 en と一致していた（または en 記事が無い）ため 210 件に入らなかったが、ja 記事がカテゴリ外だったもの。例: 一般形 → 一般形車両 (鉄道)、ナブラ（旧 デル）→ デル・テクノロジーズ、存在証明 → 楽曲、Σ・e・オメガ → 文字や企業の記事。加えて 底（累乗の底）→ 底 (初等幾何学) はカテゴリ内の別概念。

<details><summary>一覧</summary>

`acceleration`, `alternating-series-test`, `analyze`, `angle`, `assume`, `bag`, `base`, `causation`, `coin`, `common`, `compare`, `compound-interest`, `concavity-applications`, `conclusion`, `condition`, `data`, `definition`, `del`, `density`, `dependent`, `displacement`, `distinguish`, `distribute`, `e`, `exist`, `existence-proof`, `experiment`, `f-double-prime-is-positive`, `f-of-x`, `foot`, `free-fall`, `game`, `half-life`, `hydrostatic-force`, `hypothesis`, `hypothesis-bunseki`, `image`, `initial-point`, `logarithmic-scale`, `mile`, `multiply-insuubunkai`, `null-hypothesis`, `omega`, `omit`, `on-the-interval-from-0-to-2`, `orthographic-projection`, `overlap`, `period`, `phase-shift`, `placebo`, `predicate`, `predict`, `prediction`, `puzzle`, `range`, `rate-of-change-kangae`, `reflection-transformations`, `root`, `scale`, `sigma`, `standard-form`, `standardization`, `standardize`, `survey`, `surveying`, `system-of-equations`, `tautology`, `terminal-point`, `transformation`, `transverse-axis`, `trend`, `trial`, `truth-value`

</details>

## C-3. 重複の統合

- 統合 **126** 件（1 概念 1 行。統合した行の見出し語は `ja_alt`、英語は `en_alt`、単元は `unit` に追加）
- 改名 **59** 件（英語が同じでも別概念なので統合せず、意味の分かる id に）
- 対象: `id-dedup` の付いた 148 行（`-functions` `-transformations` `-keisan` 等の単元名接尾辞）と `-alt` / `-katakana` 7 行。加えて、作業中に見つけた同概念の重複 12 組（direction field / slope field、area in polar ×2 など）
- 複数単元に属する語: **114**。Phase 2 で各単元の `term_refs` に入れる（スキーマ変更なし）
- 旧 id → 新 id の全対応は `ledger/id-changes.csv`

主な統合: サイン・コサイン・タンジェント → 正弦・余弦・正接の ja_alt ／ ピタゴラスの定理 → 三平方の定理 ／ 元 → 要素 ／ 極大・極小 → 極大値・極小値 ／ 算術数列・幾何数列 → 等差数列・等比数列 ／ x 軸との共有点・x 切片 → x 軸との交点 ／ 等式 → 方程式（30 語 #6）／ 整式 → 多項式（#7）／ u 置換 → 置換積分法（#20）／ 和と差の公式 → 加法定理（#13）

別概念として残したもの（改名）: 約数 `divisor` / 除数 `divisor-in-division`、値域 `range` / 範囲 `range-of-data`、中央値 `median` / 中線 `median-of-a-triangle`、補集合 `complement` / 余事象 `complementary-event`、和の法則 `addition-principle` / 確率の加法定理 `addition-rule`、合同 / 合同式、10 進法 / 小数、弧の長さ / 曲線の長さ、割線 / セカント、累乗 / 検出力、二次形式 / 2 次形式への還元、平方（名詞）/ 2 乗する（動詞）。

サンプル 10 語との id 衝突も解消: 代入する が `substitute`（Phase 0 のファイルと同じ id）、置き換える は `substitute-new-variable`。移項する は `move-term-to-other-side`。

<details><summary>統合・改名の全件</summary>

| 旧 id | 新 id | 処理 |
|---|---|---|
| equation-houteishiki | equation | 統合 |
| variable-hanpirei | variable | 統合 |
| multiply-insuubunkai | multiply | 統合 |
| simplify-heihoukon | simplify | 統合 |
| simplify-equations | simplify | 統合 |
| pythagorean-theorem-alt | pythagorean-theorem | 統合 |
| polynomial-shiki | polynomial | 統合 |
| factor-out-the-common-factor-shiki | factor-out-the-common-factor | 統合 |
| element-alt | element | 統合 |
| x-intercept-kansuu | x-intercept | 統合 |
| x-intercept-functions | x-intercept | 統合 |
| sine-katakana | sine | 統合 |
| cosine-katakana | cosine | 統合 |
| tangent-katakana | tangent | 統合 |
| find-the-angle-keiryou | find-the-angle | 統合 |
| find-the-angle-seishitsu | find-the-angle | 統合 |
| measure-of-center-bunseki | measure-of-center | 統合 |
| angle-bisector-theorem-seishitsu | angle-bisector-theorem | 統合 |
| coordinates-katsudou | coordinates | 統合 |
| expansion-shoumei | expansion | 統合 |
| compare-shoumei | compare | 統合 |
| compare-coefficients-shoumei | compare-coefficients | 統合 |
| midpoint-houteishiki | midpoint | 統合 |
| centroid-houteishiki | centroid | 統合 |
| equation-of-a-line-houteishiki | equation-of-a-line | 統合 |
| parallel-lines-houteishiki | parallel-lines | 統合 |
| find-the-equation-houteishiki | find-the-equation | 統合 |
| intersect-houteishiki | intersect | 統合 |
| trigonometric-identities-kansuu | trigonometric-identities | 統合 |
| solve-for-theta-kansuu | solve-for-theta | 統合 |
| increasing-taisuu | increasing | 統合 |
| decreasing-taisuu | decreasing | 統合 |
| limit-kangae | limit | 統合 |
| local-maximum-alt | local-maximum | 統合 |
| local-minimum-alt | local-minimum | 統合 |
| rate-of-change-kangae | rate-of-change | 統合 |
| point-of-tangency-kangae | point-of-tangency | 統合 |
| geometric-mean-similarity | geometric-mean | 統合 |
| mean-suisoku | mean | 統合 |
| population-mean-suisoku | population-mean | 統合 |
| optimization-seikatsu | optimization | 統合 |
| parameter-bibun | parameter | 統合 |
| arc-length-circles | arc-length | 統合 |
| substitute-sekibun | substitute | 統合 |
| nth-root-heimen | nth-root | 統合 |
| rotation-heimen | rotation | 統合 |
| sketch-the-curve-heimen | sketch-the-curve | 統合 |
| distribute-equations | distribute | 統合 |
| evaluate-equations | evaluate | 統合 |
| solution-set-equations | solution-set | 統合 |
| function-notation-functions | function-notation | 統合 |
| domain-and-range-functions | domain-and-range | 統合 |
| arithmetic-sequence-functions | arithmetic-sequence | 統合 |
| geometric-sequence-functions | geometric-sequence | 統合 |
| perfect-square-trinomial-factoring | perfect-square-trinomial | 統合 |
| zero-product-property-factoring | zero-product-property | 統合 |
| leading-coefficient-factoring | leading-coefficient | 統合 |
| vertex-form-quadratics | vertex-form | 統合 |
| axis-of-symmetry-quadratics | axis-of-symmetry | 統合 |
| prove-proof | prove | 統合 |
| inverse-proof | inverse | 統合 |
| isosceles-triangle-triangles | isosceles-triangle | 統合 |
| ratio-of-areas-of-similar-figures-similarity | ratio-of-areas-of-similar-figures | 統合 |
| inscribed-angle-circles | inscribed-angle | 統合 |
| area-of-a-sector-circles | area-of-a-sector | 統合 |
| slant-height-volume | slant-height | 統合 |
| reflection-transformations | reflection | 統合 |
| complex-conjugate-numbers | complex-conjugate | 統合 |
| remainder-theorem-polynomials | remainder-theorem | 統合 |
| rational-function-functions | rational-function | 統合 |
| complex-fraction-functions | complex-fraction | 統合 |
| rational-exponent-functions | rational-exponent | 統合 |
| radical-function-functions | radical-function | 統合 |
| radical-equation-functions | radical-equation | 統合 |
| infinite-geometric-series-series | infinite-geometric-series | 統合 |
| z-score-statistics | z-score | 統合 |
| average-rate-of-change-functions | average-rate-of-change | 統合 |
| composition-of-transformations-functions | composition-of-transformations | 統合 |
| composition-linalg | composition-of-transformations | 統合 |
| absolute-value-equation-functions | absolute-value-equation | 統合 |
| double-angle-formulas-trigonometry | double-angle-formulas | 統合 |
| half-angle-formulas-trigonometry | half-angle-formulas | 統合 |
| component-form-vectors | component-form | 統合 |
| dot-product-vectors | dot-product | 統合 |
| parametric-equations-complex | parametric-equations | 統合 |
| base-case-induction | base-case | 統合 |
| squeeze-theorem-limits | squeeze-theorem | 統合 |
| removable-discontinuity-limits | removable-discontinuity | 統合 |
| power-rule-basics | power-rule | 統合 |
| chain-rule-advanced | chain-rule | 統合 |
| implicit-differentiation-advanced | implicit-differentiation | 統合 |
| linearization-applications | linearization | 統合 |
| extreme-value-theorem-applications | extreme-value-theorem | 統合 |
| critical-point-applications | critical-point | 統合 |
| first-derivative-test-applications | first-derivative-test | 統合 |
| absolute-extrema-applications | absolute-extrema | 統合 |
| concavity-applications | concavity | 統合 |
| riemann-sum-integration | riemann-sum | 統合 |
| fundamental-theorem-of-calculus-integration | fundamental-theorem-of-calculus | 統合 |
| function-defined-by-an-integral-integration | function-defined-by-an-integral | 統合 |
| integration-by-parts-techniques | integration-by-parts | 統合 |
| extrapolation-variable | extrapolation | 統合 |
| properties-of-logarithms-functions | properties-of-logarithms | 統合 |
| logarithmic-differentiation-derivatives | logarithmic-differentiation | 統合 |
| summation-notation-integration | summation-notation | 統合 |
| linear-transformation-transformations | linear-transformation | 統合 |
| one-to-one-transformations | one-to-one | 統合 |
| sample-space-probability | sample-space | 統合 |
| point-estimate-intervals | point-estimate | 統合 |
| proof-by-contradiction-proofs | proof-by-contradiction | 統合 |
| floor-function-functions | floor-function | 統合 |
| division-algorithm-theory | division-algorithm | 統合 |
| recursive-definition-recursion | recursive-definition | 統合 |
| direction-field | slope-field | 統合 |
| area-polar-calc2 | area-in-polar-coordinates | 統合 |
| conics-in-polar-coordinates | polar-equations-of-conics | 統合 |
| stem-and-leaf-stats | stem-and-leaf-plot | 統合 |
| inclusion-exclusion | inclusion-exclusion-principle | 統合 |
| related-rates-calc1 | related-rates | 統合 |
| trapezoidal-sum | trapezoidal-rule | 統合 |
| end-behavior-alg2 | end-behavior | 統合 |
| reference-angle-alg2 | reference-angle | 統合 |
| orthogonal-projection-linalg | orthogonal-projection | 統合 |
| sum-and-difference-formulas | angle-addition-formulas | 統合 |
| u-substitution | integration-by-substitution | 統合 |
| distance | distance-traveled | 改名 |
| distance-zukei | distance | 改名 |
| base-zukei | base-of-a-solid | 改名 |
| base-shikakkei | base-of-a-triangle | 改名 |
| cube-zukei | cube-solid | 改名 |
| less-than-suu | strictly-less-than | 改名 |
| solve-for | solve-instruction | 改名 |
| solve-for-keisan | solve-for | 改名 |
| divisor-keisan | divisor-in-division | 改名 |
| substitution-houteishiki | substitution-method | 改名 |
| substitution-shiki | substitution-new-variable | 改名 |
| range | range-of-data | 改名 |
| range-kansuu | range | 改名 |
| corresponding-angles-goudou | corresponding-angles-of-congruent-figures | 改名 |
| square-shikakkei | square-shape | 改名 |
| square-heihoukon | square-a-number | 改名 |
| opposite-shikakkei | opposite-facing | 改名 |
| factor-insuubunkai | factor-an-expression | 改名 |
| group | group-into-classes | 改名 |
| group-insuubunkai | group-terms | 改名 |
| estimate | bound-estimate | 改名 |
| estimate-chousa | estimate | 改名 |
| intersection | point-of-intersection | 改名 |
| intersection-meidai | intersection | 改名 |
| hypothesis-bunseki | statistical-hypothesis | 改名 |
| variable-bunseki | statistical-variable | 改名 |
| complement-kakuritsu | complementary-event | 改名 |
| addition-rule | addition-principle | 改名 |
| addition-rule-kakuritsu | addition-rule | 改名 |
| multiplication-rule | multiplication-principle | 改名 |
| multiplication-rule-kakuritsu | multiplication-rule | 改名 |
| median-seishitsu | median-of-a-triangle | 改名 |
| congruence-katsudou | congruence-modulo-n | 改名 |
| decimal-katsudou | decimal-system | 改名 |
| sketch | sketch-of-a-solid | 改名 |
| sketch-houteishiki | sketch | 改名 |
| arithmetic-mean-suuretsu | arithmetic-middle-term | 改名 |
| geometric-mean-suuretsu | geometric-middle-term | 改名 |
| approximation | approximate-number | 改名 |
| approximation-seikatsu | approximation | 改名 |
| arc-length-sekibun | arc-length-of-a-curve | 改名 |
| modulus-heimen | modulus-of-a-complex-number | 改名 |
| argument-heimen | argument-of-a-complex-number | 改名 |
| edge-kufuu | edge-of-a-graph | 改名 |
| path-kufuu | path-in-a-graph | 改名 |
| find-the-inverse-kufuu | find-the-inverse-matrix | 改名 |
| graph-hanpirei | draw-a-graph | 改名 |
| graph-kufuu | graph-network | 改名 |
| secant | secant-line | 改名 |
| secant-trigonometry | secant | 改名 |
| power-proportions | statistical-power | 改名 |
| implicit-function-derivatives | implicit-function-theorem | 改名 |
| survey-data | questionnaire | 改名 |
| quadratic-form | equation-in-quadratic-form | 改名 |
| quadratic-form-linalg | quadratic-form | 改名 |
| x | parent-function | 改名 |
| substitute | substitute-new-variable | 改名 |
| plug-in | substitute | 改名 |
| move-to-the-other-side | move-term-to-other-side | 改名 |
| arc-length-integration | arc-length-of-a-curve | 統合 |

</details>

## C-4. level_jp「—」87 件

日本の学習者がその**内容**に出会う段階を入れた（PEMDAS → 中1、two-column proof → 中2、FOIL → 中3、SOHCAHTOA → 数I、washer method → 数III）。内容自体が日本の教育課程に無いものは 大学。名前が無いことは mapping: none が表すので、level で二重に表さない。

| 解消後 | 件数 |
|---|---:|
| 中1 | 12 |
| 中2 | 12 |
| 中3 | 6 |
| 数I | 10 |
| 数A | 1 |
| 数II | 12 |
| 数B | 3 |
| 数III | 15 |
| 数C | 1 |
| 大学 | 7 |
| 統合で消滅 | 4 |
| out-of-scope | 4 |
| **計** | **87** |

小学校 1 件（単位あたりの量 unit rate）は out-of-scope へ。

## C-5. 前回の報告に無かったもの

### out-of-scope.csv（5 件）

| 理由 | 件数 | 語 |
|---|---:|---|
| 小学校範囲（v1 は中1 から、PLAN 4） | 1 | 単位あたりの量 unit rate |
| 数学用語ではない: ヤード・ポンド法 → conventions で扱う | 2 | フィート foot、マイル mile |
| 数学用語ではない: 米国の文章題の生活文脈 → conventions で扱う | 2 | 税込み価格 sales tax、チップ tip |

### 学習指導要領〔用語・記号〕の網羅率

出典: 中学校学習指導要領（平成29年告示）第2章第3節、高等学校学習指導要領（平成30年告示）第2章第4節（MEXT の解説 PDF の付録から `scripts/ledger/fetch_mext.py` で切り出し、一覧は `ledger/mext-yougo.csv`）。

- **用語: 48 件中 48 件**（中学 31・高校 17）。修正前は 47 件で、排反（数A）だけ無かった → 互いに排反 `mutually-exclusive` の ja_alt に追加
- **記号: 22 件中 3 件**（台帳に行として入っているのは e、nPr、nCr）。残る ≦ ≧ π // ⊥ ∠ △ ≡ √ ∽ sin cos tan i log_a x lim ∞ n! Σ は Phase 3 の `data/symbols/` で扱う（現在サンプル 5 件）

<details><summary>用語 48 の対応表</summary>

| 学年・科目 | 領域 | 用語 | 台帳 id |
|---|---|---|---|
| 中1 | A 数と式 | 自然数 | natural-number |
| 中1 | A 数と式 | 素数 | prime-number |
| 中1 | A 数と式 | 符号 | sign |
| 中1 | A 数と式 | 絶対値 | absolute-value |
| 中1 | A 数と式 | 項 | term |
| 中1 | A 数と式 | 係数 | coefficient |
| 中1 | A 数と式 | 移項 | moving-a-term-to-the-other-side |
| 中1 | B 図形 | 弧 | arc |
| 中1 | B 図形 | 弦 | chord |
| 中1 | B 図形 | 回転体 | solid-of-revolution |
| 中1 | B 図形 | ねじれの位置 | skew-lines |
| 中1 | C 関数 | 関数 | function |
| 中1 | C 関数 | 変数 | variable |
| 中1 | C 関数 | 変域 | domain-and-range |
| 中1 | D データの活用 | 範囲 | range-of-data |
| 中1 | D データの活用 | 累積度数 | cumulative-frequency |
| 中2 | A 数と式 | 同類項 | like-terms |
| 中2 | B 図形 | 対頂角 | vertical-angles |
| 中2 | B 図形 | 内角 | interior-angle |
| 中2 | B 図形 | 外角 | exterior-angle |
| 中2 | B 図形 | 定義 | definition |
| 中2 | B 図形 | 証明 | proof |
| 中2 | B 図形 | 逆 | converse |
| 中2 | B 図形 | 反例 | counterexample |
| 中2 | C 関数 | 変化の割合 | rate-of-change |
| 中2 | C 関数 | 傾き | slope |
| 中3 | A 数と式 | 根号 | radical-sign |
| 中3 | A 数と式 | 有理数 | rational-number |
| 中3 | A 数と式 | 無理数 | irrational-number |
| 中3 | A 数と式 | 因数 | factor |
| 中3 | D データの活用 | 全数調査 | census |
| 数I | 図形と計量 | 正弦 | sine |
| 数I | 図形と計量 | 余弦 | cosine |
| 数I | 図形と計量 | 正接 | tangent |
| 数I | データの分析 | 外れ値 | outlier |
| 数II | いろいろな式 | 二項定理 | binomial-theorem |
| 数II | いろいろな式 | 虚数 | imaginary-number |
| 数II | 指数関数・対数関数 | 累乗根 | nth-root |
| 数II | 指数関数・対数関数 | 常用対数 | common-logarithm |
| 数II | 微分・積分の考え | 極限値 | limit |
| 数III | 微分法 | 自然対数 | natural-logarithm |
| 数III | 微分法 | 変曲点 | inflection-point |
| 数A | 場合の数と確率 | 階乗 | factorial |
| 数A | 場合の数と確率 | 排反 | mutually-exclusive |
| 数B | 統計的な推測 | 信頼区間 | confidence-interval |
| 数B | 統計的な推測 | 有意水準 | significance-level |
| 数C | 平面上の曲線と複素数平面 | 焦点 | focus |
| 数C | 平面上の曲線と複素数平面 | 準線 | directrix |

</details>

### ja.basis = mext: **363 件**

| ja_basis | 件数 | 意味 |
|---|---:|---|
| mext | 363 | 見出し語（または ja_alt）が学習指導要領の本文に同じ表記で出る。1 文字の語（項・元・根）は〔用語・記号〕にあるものだけ数えた |
| wikipedia | 560 | ja.wikipedia の記事（数学カテゴリ配下）かその転送元 |
| editorial | 1434 | 本プロジェクトの訳語。米国側から洗った語の大半と、教室の言い回し（〜について解く 等） |

### ja.check の不一致: 276 件（alt 18 ／ title 258）

- `alt`: 根拠（指導要領・Wikipedia）の表記が見出し語ではなく ja_alt 側にある。**Phase 2 で見出し語を入れ替えるか決める**
- `title`: 見出し語は Wikipedia の記事名と違う転送元。多くは親記事への転送（部分和 → 級数）で問題ないが、見出し語の表記ゆれ（べき級数 / 冪級数、線形近似 / 線型近似、二部グラフ / 2部グラフ）もここに出る

| id | 見出し語 | 根拠 | 根拠側の表記 |
|---|---|---|---|
| simplify | 簡単にする | mext | 整理する |
| mean | 平均値 | mext | 平均 |
| ratio-of-areas-of-similar-figures | 相似な図形の面積比 | mext | 相似比と面積比 |
| trigonometric-identities | 三角比の相互関係 | mext | 三角関数の相互関係 |
| sample-space | 全事象 | wikipedia | 標本空間 |
| mutually-exclusive | 互いに排反 | mext | 排反 |
| geometric-mean | 相乗平均 | wikipedia | 幾何平均 |
| complex-conjugate | 共役複素数 | wikipedia | 複素共役 |
| local-maximum | 極大値 | mext | 極大 |
| local-minimum | 極小値 | mext | 極小 |
| fundamental-theorem-of-calculus | 微積分学の基本定理 | mext | 微分と積分の関係 |
| recursive-definition | 帰納的定義 | wikipedia | 再帰的定義 |
| one-to-one | 1 対 1 | wikipedia | 単射 |
| chain-rule | 合成関数の微分 | wikipedia | 連鎖律 |
| concavity | 曲線の凹凸 | mext | 凹凸 |
| riemann-sum | 区分求積法 | wikipedia | リーマン和 |
| stem-and-leaf-plot | 幹葉図 | wikipedia | 幹葉表示 |
| invertible-matrix | 可逆行列 | wikipedia | 正則行列 |

<details><summary>title（258 件）</summary>

| id | 見出し語 | 記事名 |
|---|---|---|
| number-line | 数直線 | 直線 |
| origin | 原点 | 原点 (数学) |
| subtract | 引く | 減法 |
| multiply | 掛ける | 乗法 |
| compute | 計算する | 計算 |
| round | 四捨五入する | 端数処理 |
| parentheses | かっこ | 括弧 |
| substitution | 代入 | 代入 (論理学) |
| percent | 百分率 | パーセント |
| unknown | 未知数 | 変数 (数学) |
| constant-of-proportionality | 比例定数 | 比例 |
| correspond | 対応する | 対応 (数学) |
| increase | 増加する | 単調写像 |
| decrease | 減少する | 単調写像 |
| ray | 半直線 | 直線 |
| circle | 円 | 円 (数学) |
| diameter | 直径 | 径 |
| perimeter | 周の長さ | 周長 |
| line-of-reflection | 対称の軸 | 線対称 |
| be-tangent-to | 接する | 接線 |
| is-parallel-to | 平行である | 平行 |
| symmetric | 対称な | 対称性 |
| cylinder | 円柱 | 円柱 (数学) |
| slant-height | 母線 | 母線 (数学) |
| face | 面 | 面 (幾何学) |
| frequency-table | 度数分布表 | 度数分布 |
| measure-of-center | 代表値 | 要約統計量 |
| experimental-probability | 統計的確率 | 頻度主義統計学 |
| be-divisible-by | 割り切れる | 約数 |
| remainder | 余り | 剰余 |
| quotient | 商 | 商 (数学) |
| y-intercept | 切片 | 切片 (数学) |
| sss | 三辺相等 | 図形の合同 |
| sas | 二辺夾角相等 | 図形の合同 |
| asa | 一辺両端角相等 | 図形の合同 |
| opposite-side | 対辺 | 三角形 |
| necessary-and-sufficient | 必要十分 | 必要条件と十分条件 |
| five-number-summary | 五数要約 | 箱ひげ図 |
| tree-diagram | 樹形図 | 木 (数学) |
| die | さいころ | サイコロ |
| non-terminating-decimal | 無限小数 | 小数 |
| rationalize | 有理化する | 有理化 |
| is-irrational | 無理数である | 無理数 |
| double-root | 重解 | 重根 (多項式) |
| complete-the-square | 平方完成する | 平方完成 |
| is-symmetric-about | 線対称である | 線対称 |
| aa | 二角相等 | 図形の相似 |
| random-number | 乱数 | 乱数列 |
| sample-mean | 標本平均 | 標本平均・標本共分散 |
| elementary-symmetric-polynomial | 基本対称式 | 対称式 |
| integer-part | 整数部分 | 床関数と天井関数 |
| floor-function | ガウス記号 | 床関数と天井関数 |
| any | 任意の | 任意 |
| or | または | 論理和 |
| universal-set | 全体集合 | 集合 |
| complement | 補集合 | 差集合 |
| false | 偽 | 真理値 |
| inverse | 裏 | 裏 (論理学) |
| contrapositive | 対偶 | 対偶 (論理学) |
| necessary-condition | 必要条件 | 必要条件と十分条件 |
| sufficient-condition | 十分条件 | 必要条件と十分条件 |
| necessary-and-sufficient-condition | 必要十分条件 | 必要条件と十分条件 |
| corollary | 系 | 系 (数学) |
| lead-to-a-contradiction | 矛盾する | 矛盾 |
| closed-interval | 閉区間 | 区間 (数学) |
| open-interval | 開区間 | 区間 (数学) |
| angle-of-elevation | 仰角 | 仰俯角 |
| angle-of-depression | 俯角 | 仰俯角 |
| tetrahedron | 四面体 | 三角錐 |
| quartile-deviation | 四分位偏差 | 分位数 |
| positive-correlation | 正の相関 | 相関係数 |
| negative-correlation | 負の相関 | 相関係数 |
| alternative-hypothesis | 対立仮説 | 仮説検定 |
| reject | 棄却する | 棄却 |
| mutually-exclusive-events | 排反事象 | 排反 |
| circumcenter | 外心 | 外接円 |
| incenter | 内心 | 内接円 |
| excenter | 傍心 | 三角形の内接円と傍接円 |
| tangent-chord-theorem | 接弦定理 | 円 (数学) |
| eulers-formula-for-polyhedra | オイラーの多面体定理 | 多面体 |
| are-coplanar | 同一平面上にある | 共面 |
| supplementary-angle | 補角 | 角度 |
| complementary-angle | 余角 | 角度 |
| divisibility-rules | 倍数の判定法 | 倍数 |
| diophantine-equation | 不定方程式 | ディオファントス方程式 |
| factor-into-primes | 素因数分解する | 素因数分解 |
| digit | 桁 | 位取り記数法 |
| reducing-a-fraction | 約分 | 分数 |
| partial-fractions | 部分分数 | 部分分数分解 |
| arithmetic-mean | 相加平均 | 算術平均 |
| cauchy-schwarz-inequality | コーシー・シュワルツの不等式 | コーシー＝シュワルツの不等式 |
| reduce | 約分する | 分数 |
| is-an-identity | 恒等式である | 恒等式 |
| denominator | 分母 | 分数 |
| real-part | 実部 | 複素数 |
| imaginary-part | 虚部 | 複素数 |
| pure-imaginary-number | 純虚数 | 虚数 |
| equation-of-a-circle | 円の方程式 | 円 (数学) |
| degree-measure | 度数法 | 度 (角度) |
| even-function | 偶関数 | 偶関数と奇関数 |
| odd-function | 奇関数 | 偶関数と奇関数 |
| product-to-sum-formulas | 積和公式 | 三角関数の公式の一覧 |
| sum-to-product-formulas | 和積公式 | 三角関数の公式の一覧 |
| general-solution | 一般解 | 方程式 |
| argument | 真数 | 対数 |
| exponential-growth | 指数関数的増加 | 指数関数的成長 |
| differentiate | 微分する | 微分 |
| normal-line | 法線 | 法線ベクトル |
| antiderivative | 原始関数 | 不定積分 |
| constant-of-integration | 積分定数 | 不定積分 |
| integrate | 積分する | 積分法 |
| inverse-operation | 逆演算 | 逆写像 |
| common-ratio | 公比 | 等比数列 |
| characteristic-equation | 特性方程式 | 固有多項式 |
| partial-sum | 部分和 | 級数 |
| subscript | 添字 | 添え字 |
| diverge | 発散する | 発散 (ベクトル解析) |
| fibonacci-sequence | フィボナッチ数列 | フィボナッチ数 |
| continuous-random-variable | 連続型確率変数 | 確率変数 |
| discrete-random-variable | 離散型確率変数 | 確率変数 |
| standard-normal-distribution | 標準正規分布 | 正規分布 |
| standard-normal-table | 正規分布表 | 正規分布 |
| population-variance | 母分散 | 分散 (確率論) |
| is-statistically-significant | 有意である | 有意 |
| test | 検定する | 検定統計量 |
| mathematical-model | 数学的モデル | 数理モデル |
| regression-line | 回帰直線 | 線形回帰 |
| interpolation | 補間 | 内挿 |
| comparison-for-divergence | 追い出しの原理 | はさみうちの原理 |
| discontinuous | 不連続 | 連続 (数学) |
| continuous-function | 連続関数 | 連続写像 |
| extreme-value-theorem | 最大値・最小値の定理 | 最大値最小値定理 |
| base-of-the-natural-logarithm | 自然対数の底 | ネイピア数 |
| product-rule | 積の微分 | 積の微分法則 |
| quotient-rule | 商の微分 | 商の微分法則 |
| implicit-differentiation | 陰関数の微分 | 陰関数 |
| linear-approximation | 近似式 | 近似 |
| linearization | 一次近似 | 線型近似 |
| prime-notation | ラグランジュの記法 | 微分の記法 |
| cross-sectional-area | 断面積 | 断面 |
| integrate-by-parts | 部分積分する | 部分積分 |
| directed-segment | 有向線分 | 空間ベクトル |
| scalar | スカラー | スカラー (数学) |
| linearly-independent | 一次独立 | 線型独立 |
| linearly-dependent | 一次従属 | 線型結合 |
| linear-combination | 一次結合 | 線型結合 |
| are-linearly-independent | 一次独立である | 線型独立 |
| major-axis | 長軸 | 楕円 |
| minor-axis | 短軸 | 楕円 |
| pole | 極 | 極 (複素解析) |
| rectangular-coordinates | 直交座標 | 直交曲線座標 |
| real-axis | 実軸 | 実数直線 |
| imaginary-axis | 虚軸 | 虚数 |
| inverse-matrix | 逆行列 | 正則行列 |
| matrix-multiplication | 行列の積 | 行列の乗法 |
| linear-transformation | 一次変換 | 線型写像 |
| stacked-bar-chart | 帯グラフ | 統計図表 |
| order-of-operations | 演算の順序 | 演算子の優先順位 |
| simple-interest | 利息 | 利子 |
| scientific-notation | 科学的記数法 | 指数表記 |
| postulate | 公準 | 公理 |
| deductive-reasoning | 演繹的推論 | 演繹 |
| transitive-property | 推移律 | 推移関係 |
| reflexive-property | 反射律 | 反射関係 |
| law-of-detachment | 肯定式 | モーダスポネンス |
| scalene-triangle | 不等辺三角形 | 三角形 |
| rigid-motion | 合同変換 | 等長写像 |
| similarity-transformation | 相似変換 | 行列の相似 |
| inverse-sine | 逆正弦 | 逆三角関数 |
| preimage | 原像 | 像 (数学) |
| polynomial-function | 多項式関数 | 多項式函数 |
| multiplicity-of-a-zero | 根の重複度 | 重複度 (数学) |
| arithmetic-series | 算術級数 | 等差数列 |
| geometric-series | 幾何級数 | 等比数列 |
| trig-identities | 三角恒等式 | 三角関数の公式の一覧 |
| cosecant | コセカント | 三角関数 |
| cotangent | コタンジェント | 三角関数 |
| randomization | 無作為化 | ランダム化 |
| restricted-domain | 定義域の制限 | 制限 (数学) |
| newtons-law-of-cooling | ニュートンの冷却法則 | ニュートンの冷却の法則 |
| arcsine | アークサイン | 逆三角関数 |
| arccosine | アークコサイン | 逆三角関数 |
| arctangent | アークタンジェント | 逆三角関数 |
| vector-projection | ベクトル射影 | ベクトルの成分分解 |
| work | 仕事 | 仕事 (物理学) |
| augmented-matrix | 拡大係数行列 | 拡大行列 |
| row-operations | 行基本変形 | 行列の基本変形 |
| objective-function | 目的関数 | 損失関数 |
| constraint | 制約条件 | 制約 (数学) |
| particular-solution | 特殊解 | 方程式 |
| initial-condition | 初期条件 | 初期値問題 |
| vector-valued-function | ベクトル値関数 | ベクトル値函数 |
| alternating-series | 交代級数 | 交項級数 |
| taylor-polynomial | テイラー多項式 | テイラー展開 |
| power-series | べき級数 | 冪級数 |
| taylor-series | テイラー級数 | テイラー展開 |
| maclaurin-series | マクローリン級数 | テイラー展開 |
| percentile | パーセンタイル | 分位数 |
| simple-random-sample | 単純無作為抽出 | 無作為抽出 |
| stratified-sampling | 層化抽出 | 層化抽出法 |
| confounding-variable | 交絡変数 | 交絡 |
| unbiased-estimator | 不偏推定量 | 偏り |
| type-i-error | 第一種の過誤 | 第一種過誤と第二種過誤 |
| type-ii-error | 第二種の過誤 | 第一種過誤と第二種過誤 |
| convergence-of-a-sequence | 数列の収束 | 極限 |
| scalar-triple-product | スカラー三重積 | 三重積 (ベクトル解析) |
| cylindrical-coordinates | 円柱座標 | 円筒座標系 |
| spherical-coordinates | 球座標 | 球面座標系 |
| space-curve | 空間曲線 | 曲線 |
| function-of-several-variables | 多変数関数 | 関数 (数学) |
| partial-derivative | 偏導関数 | 偏微分 |
| take-the-partial-derivative | 偏微分する | 偏微分 |
| double-integral | 二重積分 | 多重積分 |
| iterated-integral | 累次積分 | 逐次積分 |
| jacobian | ヤコビアン | ヤコビ行列 |
| system-of-linear-equations | 線形方程式系 | 線型方程式系 |
| reduced-row-echelon-form | 既約行階段形 | 行階段形 |
| free-variable | 自由変数 | 自由変数と束縛変数 |
| elementary-matrix | 基本行列 | 行列の基本変形 |
| block-matrix | ブロック行列 | 区分行列 |
| cofactor | 余因子 | 小行列式 |
| linear-independence | 線形独立 | 線型独立 |
| linear-map | 線形写像 | 線型写像 |
| kernel | 核 | 核 (代数学) |
| isomorphism | 同型 | 同型写像 |
| eigenvalue | 固有値 | 固有値と固有ベクトル |
| eigenvector | 固有ベクトル | 固有値と固有ベクトル |
| eigenspace | 固有空間 | 固有値と固有ベクトル |
| characteristic-polynomial | 特性多項式 | 固有多項式 |
| diagonalizable | 対角化可能 | 対角化 |
| algebraic-multiplicity | 代数的重複度 | 固有値と固有ベクトル |
| dynamical-system | 動的システム | 力学系 |
| regression-equation | 回帰式 | 回帰分析 |
| logical-connective | 論理結合子 | 論理演算 |
| quantifier | 量化子 | 量化 |
| universal-quantifier | 全称量化子 | 全称記号 |
| existential-quantifier | 存在量化子 | 存在記号 |
| power-set | べき集合 | 冪集合 |
| ceiling-function | 天井関数 | 床関数と天井関数 |
| countable | 可算 | 可算集合 |
| chinese-remainder-theorem | 中国剰余定理 | 中国の剰余定理 |
| partial-order | 半順序 | 順序集合 |
| directed-graph | 有向グラフ | グラフ理論 |
| bipartite-graph | 二部グラフ | 2部グラフ |
| distance-traveled | 道のり | 距離 |
| base-of-a-solid | 底面 | 底 (初等幾何学) |
| cube-solid | 立方体 | 正六面体 |
| divisor-in-division | 除数 | 除法 |
| factor-an-expression | 因数分解する | 因数分解 |
| estimate | 推定する | 推定 |
| point-of-intersection | 交点 | 交点 (数学) |
| intersection | 共通部分 | 共通部分 (数学) |
| complementary-event | 余事象 | 事象 (確率論) |
| congruence-modulo-n | 合同式 | 整数の合同 |
| approximate-number | 概数 | 近似値 |
| secant | セカント | 三角関数 |
| statistical-power | 検出力 | 仮説検定 |
| move-term-to-other-side | 移項する | 等式 |

</details>

## 残っていること

- 通分する・移項する・微分係数・定積分の記号は ③ 判断不能のまま人間レビュー行き。terms の候補表現を数字なしにするかは Phase 2 の前に決める
- `terms/substitute` の register 不一致（substitute back）
- ja.check の alt 18 件は見出し語の入れ替え候補
- カテゴリ規則で出典を失った同概念の語（帰無仮説、トートロジー、等高線 など）は Phase 2 で textbook 出典を付ける
