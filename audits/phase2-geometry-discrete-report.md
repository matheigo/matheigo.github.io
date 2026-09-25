# Phase 2 レポート — AP Statistics の 2026 年版・残った ③ と、数I・数A・Geometry・Discrete Math の単元（200 語、バッチ 4 で停止）

作成: 2026-09-25 ／ 対象: 50f5a22（Phase 2 statistics / linear algebra 2 report）→ 本コミット
指示: audits/phase2-stats-vectors-2-report.md を受けて 1〜3 を直し、4 で数I・数A・Geometry・Discrete Math に進む。判断は `docs/DECISIONS.md` の「Phase 2 幾何・離散の単元の前の修正」（7 行）と「Phase 2 幾何・離散の単元」（35 行）。

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified に上げた語はない。

## まとめ

- **1〜3 はすべて直した**（コミット 5806a18）。AP Statistics の単元を CED 2026 年版の 5 単元に作り直し、2026 年版に無い内容の 16 語から AP Statistics を外した。残った ③ 6 語はあなたの決定どおり corpus-human-settled
- **4 はバッチ 4 で止めた**。バッチ 1〜3 の人間レビュー行きの ③ は **4 ／ 1 ／ 2（8% ／ 2% ／ 4%）** だったが、バッチ 4 は **11 ／ 50（22%）** で 1 割を超えた。Geometry と数A 図形の性質の固有の名前（外心・内心・傍心・チェバ・メネラウス・二面角・共通接線ほか）が用例コーパスに 0〜1 件で、CED・OpenStax・Nicholson・Levin のどれにも呼び方がない（**用例コーパスに幾何の教科書がない**）
- 生成した 200 語: **likely 198 ／ draft 2**。参照で見出しを決めた語 34、英語に決まった言い方がない 36、人間レビュー行き 18
- 記号 3 つ（ₙPᵣ・f(x)・θ）を symbols に作った。ₙPᵣ の読みは話し言葉 0 件で人間レビュー行き
- **残りは 131 行**（Geometry 67・Discrete Math 49・数I／数A の台帳の末尾 15。下の K）
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて緑（L）。crosscheck 360/360 一致

## A. AP Statistics の CED 2026 年版（指示 1）

### 新しい単元

| id | 単元（CED の見出し） | topic | term_refs |
|---|---|---|---|
| us-ap-statistics-1-exploring-and-collecting-data | Unit 1: Exploring One-Variable Data and Collecting Data | 1.1〜1.13 | 27 |
| us-ap-statistics-2-probability-and-distributions | Unit 2: Probability, Random Variables, and Probability Distributions | 2.1〜2.12（2 つのカテゴリ変数、標本分布と中心極限定理を含む） | 6 |
| us-ap-statistics-3-inference-for-proportions | Unit 3: Inference for Categorical Data: Proportions | 3.1〜3.15（カイ二乗の同質性・独立性の検定を含む） | 19 |
| us-ap-statistics-4-inference-for-means | Unit 4: Inference for Quantitative Data: Means | 4.1〜4.10 | 7 |
| us-ap-statistics-5-regression-analysis | Unit 5: Regression Analysis | 5.1〜5.5 | 6 |

旧 9 単元のファイルは消し、旧 id は data・ledger のどこにも残っていない（curriculum_spec.py と seed_us.txt は Phase 1 の入力なので旧のまま。build.py curriculum は Phase 2 では回さない）。

### 付け替え表（fix_decisions.py `AP_STATS_2026_*`、fix_phase1.py 手順 13）

| 旧単元 | 新単元 |
|---|---|
| 1 one-variable ／ 3 collecting-data | 1 |
| 2 two-variable | 5 |
| 4 probability ／ 5 sampling-distributions | 2 |
| 6 proportions ／ 8 chi-square | 3 |
| 7 means | 4 |
| 9 slopes | なし（2026 年版に傾きの推測がない） |

行ごとの例外 9 行（`AP_STATS_2026_BY_ID`。CED で語が出てくる topic で決めた）: transformation-of-a-variable → 1（1.7.C 単位の変更）、explanatory ／ response-variable → 1 と 5、density-curve → 2（2.11）、sampling-distribution → 2・3・4、sampling-distribution-of-a-proportion と unbiased-estimator → 3（3.1・3.2）、confidence-interval → 3・4、degrees-of-freedom → 3・4（3.14 のカイ二乗が先）。台帳で付け替わった行は 67、phrases の候補 1（checking-conditions）。data/curriculum の term_refs と台帳の食い違いは 0。

### AP Statistics を外した 16 語（`AP_STATS_2026_DROP`）

CED の本文に名前も内容もないものだけ。level.us を Intro Statistics にし（台帳の level_us も）、US の単元が残らない 7 語には Intro Statistics の単元を付けた。

| id | 2026 年版の状況 | level.us（後） | 足した単元 |
|---|---|---|---|
| cumulative-relative-frequency | cumulative は累積確率分布（2.8）だけ | Pre-Algebra・Intro Statistics | sampling-and-data |
| quartile-deviation | なし | Algebra 1（Intro Statistics は足さない） | — |
| covariance | なし | Algebra 1（同上） | — |
| sum-of-random-variables ／ independent-random-variables ／ linear-transformation-of-a-random-variable | 2.9 は 1 つの確率変数の平均と標準偏差だけ | Intro Statistics | — |
| normal-approximation-to-the-binomial ／ continuity-correction ／ rejection-region | なし | Intro Statistics | — |
| bayes-theorem | なし | Intro Statistics | probability |
| geometric-distribution | なし | Intro Statistics | discrete-distributions |
| goodness-of-fit-test | カイ二乗は同質性・独立性だけ | Intro Statistics | hypothesis-testing |
| t-test-for-the-slope | 回帰は記述だけ | Intro Statistics | regression |
| influential-point | influential ／ leverage 0 件 | Intro Statistics | regression |
| normal-probability-plot | なし | Intro Statistics | continuous-distributions |
| line-graph | line graph ／ time plot 0 件 | Pre-Algebra・Intro Statistics | — |

covariance と quartile-deviation に Intro Statistics を足さなかったのは、エントリ自身が「OpenStax Introductory Statistics に出てこない」と書いているため（covariance はあなたの 2026-09-25 の決定）。one- ／ two-tailed test（CED は one- ／ two-sided）、stratified ／ cluster ／ systematic sampling、two-proportion z-test、power、chi-square test for independence、transformation-of-a-variable（1.7.C）は 2026 年版にあるので残した。

## B. 一筆書き（指示 2）

Euler trail のまま。変更なし。台帳のオイラー路（euler-path）は eulerian-path に寄せ、ja.alt にオイラー路を足した。

## C. 残った ③ 6 語（指示 3）

6 語とも corpus-human-settled（note に日付と DECISIONS の節）を付け、corpus-undecided を外した。register は主張しない。

| id | 結果 |
|---|---|
| bayes-theorem | en.term Bayes' theorem、en.alt Bayes' rule（元のまま）。crosscheck で ja「ベイズの定理」の langlink が **Bayes' theorem に一致**。wikipedia-langlink の出典はすでにあった |
| normal-probability-plot | そのまま、draft のまま |
| linear-transformation-of-a-random-variable | そのまま |
| t-test-for-the-slope | そのまま、draft のまま。mapping_note「AP Statistics の CED 2026 年版には出てこない（回帰は単元 5 で記述だけを扱い、傾きの推測はない）」。pitfalls の旧単元 id の文は消した |
| coefficient-of-variation | mapping_note「OpenStax Introductory Statistics と AP Statistics の CED には出てこない（どちらも 0 件）」。**件数を確かめた**: counts.json の書き言葉 0 件、CED の本文 0 件。話し言葉 6 件は YouTube（The Organic Chemistry Tutor 5・Professor Leonard 1） |
| geometric-multiplicity | そのまま、draft のまま |

decide の人間が決めた ③ は 18 → 24、判断不能（terms）は 6 → 0 になった（その後、4 の生成で新しい ③ が 18 語）。

## D. 生成の前の台帳（指示 4、手順 14）

対象 465 行（`jp-suugaku-1-*`・`jp-suugaku-a-*`・`us-geometry-*`・`us-discrete-math-*` を含む未生成の行）に今までの規則を当てた（fix_decisions.py `PHASE2F_*`）:

| 規則 | 行数 | 主なもの |
|---|---|---|
| 同じ概念 | 31 | オイラー路 → eulerian-path、接弦定理の 2 行、対偶による証明、含意 → 条件文（含意を見出し）、任意の → すべての、共有点 → point-of-intersection、測量 → 間接測定（測量を見出し）、内分・外分・partition a segment → 内分点・外分点、剰余 → remainder、底角定理 → 二等辺三角形の定理、逆正弦 → arcsine、基数 → 要素の個数、確率の公理 → 確率の基本性質、かつ・または → logical-connective |
| 節の名前 | 18 | 二次関数の決定、鈍角の三角比、三角形の性質・分類、証明の書き方、集合の演算、漸化式の解法 ほか |
| 引数を入れただけの行 | 87 | 角度を求める、頂点の座標を求める、判別式を計算する、正弦定理を適用する、互除法を用いる、外接円 ／ 内接円の半径、くじ引き ほか |
| 改名 | 2 | coplanar-points → coplanar、congruent-figures → congruent（ja 合同） |
| symbols へ | 4 | nCr → combination-ncr、nPr・f(x)・θ は新しい記号 |
| phrases の候補へ | 11 | ただし・明らかに・一般に・〜と仮定すると矛盾・符号を調べる ほか（conversely と同じ扱い） |
| 範囲外 | 3 | ゲーム・パズル（数学用語ではない）、分度器（小学校範囲） |

寄せ先がまだ生成していない中学の行（角・三角形・弦・面積・数直線・線分・平行移動・倍数・確率・頂点 ほか）は今までどおりこの単元に入れた。結果、対象は **390 行（新しいエントリ 331、既存のエントリに当たる行 59）**。

## E. 生成（指示 4）

| | 範囲 | 語数 | likely | draft | ③ 人間 | 決まった言い方なし | 参照で見出し | コミット |
|---|---|---|---|---|---|---|---|---|
| バッチ 1 | 中学から寄せた語、数I 数と式、集合の始め | 50 | 48 | 2 | **4（8%）** | 9 | 4 | 288ec09 |
| バッチ 2 | 数I 集合と命題、二次関数、三角比の始め | 50 | 50 | 0 | **1（2%）** | 1 | 13 | 51979a0 |
| バッチ 3 | 数I 図形と計量、数A 場合の数と確率 | 50 | 50 | 0 | **2（4%）** | 11 | 5 | fef27db |
| バッチ 4 | 数A 図形の性質・数学と人間の活動、Geometry foundations | 50 | 50 | 0 | **11（22%）** | 15 | 12 | a54a310 |
| 計 | | **200** | **198** | **2** | **18** | **36** | **34** | |

書き方: 見出し・register・mapping・出典は、書く前に `corpus:probe --decide` で数えてこちらで決め（仕様書）、本文（定義・例文・pitfalls）はバッチごとに 5 本の下書き役に 10 語ずつ書かせた。書いたあと count → decide で全語を照合し、食い違い（コロケーションが首位に入った 2 件、ガウス記号の候補不足 1 件）と、参照の件数が別の意味だった 3 件（F）を直した。バッチごとの decide で「直すこと」「register 不一致」は 0。

### ③（人間レビュー行き）18 語

| バッチ | id | 件数（話 ／ 書） | 理由 |
|---|---|---|---|
| 1 | prime-factorization | 1 ／ 3 | どの参照にもこの呼び方がない（Levin も） |
| 1 | angle-bisector-theorem | 0 ／ 0 | |
| 1 | cyclic-quadrilateral | 0 ／ 0 | 台帳の near を exact にした（名前が 1 対 1） |
| 1 | fractional-part | 0 ／ 0 | |
| 2 | universal-set | 0 ／ 0 | Levin の universe はコーパスでは「宇宙」がほとんどで数えられない |
| 3 | circular-permutation | 0 ／ 0 | OpenStax の 2 件は変数の巡回（別の意味） |
| 3 | inscribed-circle | 0 ／ 0 | OpenStax の 3 件は曲率円（別の意味） |
| 4 | exterior-angle-bisector・circumcenter・incenter・excenter・cevas-theorem・menelauss-theorem・common-tangent・dihedral-angle | 0〜1 | 幾何の固有の名前。参照にない |
| 4 | number-of-divisors | 0 ／ 0 | 説明的な名前だが mapping exact（number-of-real-solutions と同じ扱い） |
| 4 | numeral-system | 0 ／ 0 | number system はほとんど実数・複素数の体系の意味 |
| 4 | undefined-terms | 0 ／ 0 | OpenStax の undefined term は 0 で割る式の意味 |

記号 permutation-npr（n P r の読みが 0 件）も人間レビュー行き。decide 全体の判断不能は 24（terms 18・phrases 5・symbols 1）。

### draft 2 語

nested-radical・elementary-symmetric-polynomial（英語は固有の名前だが、台帳の Wikipedia に langlink がなく OpenStax にもない。どちらも「英語に決まった言い方がない」で決着）。

### 参照で見出しを決めた 34 語

- OpenStax（17）: chord・linear inequality・properties of inequalities・floor function・empty set・sufficient condition・arrive at a contradiction・negate・find the coefficients・trigonometric ratio・circumcircle・combination（数え方の形）・arrange（同）・inscribed in・collinear・composite number・simplify radicals
- Levin（14）: De Morgan's laws・truth value・inverse（裏）・negation・proof by contrapositive・direct proof・intersection of events・divisibility test・Euclidean algorithm・linear Diophantine equation・Diophantine equation・integer solution・hexadecimal・Euler's formula for planar graphs（多面体定理）
- Nicholson（2）: foot of the perpendicular・concurrent
- AP Calculus の CED（1）: necessary condition（Unit 10）

### コーパスの判定で見出しが台帳と変わった主な語

平行移動 → shift（① 96 ／ 208、translation は en.alt）、線分 → 書き言葉 line segment ／ 話し言葉 segment、連立不等式 → compound inequality、場合分けする → consider … cases、すべての → for all ／ for any ／ for each ／ for every（② 併記）、仮定する → suppose ／ assume（②）、要素の個数 → cardinality（number of elements は書き言葉の variant）、証明終わり → completes the proof、一般形 → general form（英語に決まった言い方がない。standard form は逆の形も指す）、因数分解形 → factored form ／ intercept form、下に凸 ／ 上に凸 → opens upward ／ downward（concave up ／ down は variant）、根元事象 → outcome、反復試行 → independent trials ／ Bernoulli trial、排反 → mutually exclusive、最大公約数 → GCD ／ GCF ／ greatest common divisor ／ greatest common factor（②）、法 → modulo（書き言葉 mod n）、外接円 → circumcircle。

### ja の見出しを台帳から変えた語

合同な図形 → 合同、排反事象 → 互いに排反、共線 → 一直線上にある、共点 → 1 点で交わる、仮定の裏（ja.alt）を削除（どれも台帳の語は ja.alt）。

### 統合と移動（D の表のほかに生成中に足したもの）

外接円の半径 → circumscribed-circle、内接円の半径 → inscribed-circle、くじ引き → sampling-without-replacement、かつ・または → logical-connective、分度器 → 範囲外。台帳の mapping を変えた語: cyclic-quadrilateral・trigonometric-ratio・circumscribed-circle・inscribed-circle・eulers-formula-for-polyhedra（near → exact）、ratio-of-areas-of-similar-figures・relative-positions-of-two-circles・relative-positions-of-two-lines（exact → near）。関数記号の台帳の langlink（→ Function symbol、数理論理学の別概念）を出典から外した。

### 既存の語で単元に当たったもの

solve・expansion・substitute-new-variable（ja.alt 置き換え）・spread・maximum・restricted-domain・point-of-intersection（ja.alt 共有点）・sketch・discriminant・solve-for・independence-of-events（ja.alt 独立な試行・従属）・basic-properties-of-probability（ja.alt 確率の公理）・point-of-internal-division（ja.alt 内分・線分の分点）・remainder（ja.alt 剰余）・path-in-a-graph（ja.alt 経路）に、その単元の level・例文・ja.alt を足した。ほかの当たった語（数I データの分析の 20 語ほか）は前の単元で見直し済みで、足りている。

### 同形語

validate の SAME_EN_TERM に arc-length ／ arc-length-of-a-curve（弧の長さ ／ 曲線の長さ）と vertex ／ vertex-graph、SAME_JA に「要素」（element ／ entry）を足し、相手のエントリの related と pitfalls を直した。

### 1 ソース頼み

新しい 200 語のうち 65 語（首位のソース: OpenStax Algebra and Trigonometry 19、OpenStax Calculus 13、MIT の講義ノート 11、MIT 6.042 9、The Organic Chemistry Tutor 7 ほか）。①→② に下がったのは opens-upward の書き言葉（concave up）。**幾何の話し言葉はほぼ The Organic Chemistry Tutor 1 か所で決まっている**（congruent・orthocenter・supplementary・slant height）。

## F. 確かめた主張

書いたあとに文脈（`corpus:probe --contexts`、端末だけ）・counts.json・参照の本文で確かめたもの:

- OpenStax Algebra and Trigonometry は a(x − h)² + k を standard form（別名 vertex form）、ax² + bx + c を general form と呼ぶ。The Organic Chemistry Tutor は ax² + bx + c を standard form と呼ぶ（→ 一般形は数えない）
- 参照の件数が別の意味: OpenStax の circular permutation 2 件（Calculus 3 の x, y, z の巡回）、inscribed circle 3 件（曲率円）、undefined term 1 件（0 で割る式）。circumcircle 1 件は三角形の外接円で正しい
- shortest path 17 件はすべて MIT 6.042 のグラフの最短路、universe は文脈 16 件中 13 件が宇宙、number system はほとんど実数の体系、base b は 16 件すべて対数の底、p and q は 2 点や 2 つの整数
- multiple（書き言葉 10 件中 5 件が multiple times ほか）、combination（16 件中 13 件が混合・線形結合）、arrange（半分以上が arrange the work ／ terms）、translation（話し言葉の半分以上が語の翻訳）は形で数えた。bearing of は 16 件すべて航法の方位、suppose は 20 件中 1 件だけ be supposed to
- Levin の greatest common divisor 4 件・greatest common factor 2 件（最大公約数の mapping_note）、Levin 1.2 の inverse（Definition 1.2.6）
- CED 2026 年版: goodness-of-fit ／ slope の推測 ／ influential ／ leverage ／ line graph ／ Bayes 0 件、chi-square test for independence は 3.14〜3.15 にある、1.7.C に単位の変更
- coefficient of variation: OpenStax Introductory Statistics・CED とも 0 件

消した・弱めた主張: 「米国の高校では外分をほぼ扱わない」（既存の内分点。裏付けがない）、「英語の教科書では independent と dependent を対で扱う」「離散数学の授業では確率の公理を最初に置くことが多い」（どちらも自分で書いたものを事実だけに直した）。

## G. パイプラインの変更

| 変更 | ファイル |
|---|---|
| 手順 13（AP Statistics の 2026 年版）と手順 14（PHASE2F_*）、改名のときに旧 ja を ja_alt へ | fix_phase1.py・fix_decisions.py |
| TERM_FORMS 35 語（multiple・common factor・arc length・congruent・shift ／ translation・set・element・segment・complement・union・inverse・general form・bearing・combination・arrange・union ／ intersection of events・order matters・circular permutation・inscribed circle・Euler's formula・supplementary・base n・binary・place・undefined terms ほか） | scripts/corpus/lib.ts |
| SAME_EN_TERM 2 組・SAME_JA 1 組 | scripts/validate.ts |
| data/curriculum の AP Statistics 5 単元（旧 9 を削除）、各単元の term_refs | data/curriculum |

テストは 105 のまま（コードの判定ロジックは変えていない）。

## H. 怪しい点（Phase 5 の監査へ）

- **幾何の語は用例コーパスでほとんど数えられない**。Geometry の話し言葉は The Organic Chemistry Tutor 1 チャンネル頼み、書き言葉は OpenStax の代数・微積の本の中の出現だけ
- 平行移動の en.term を shift にした: 用例コーパスはグラフの平行移動（Algebra 2・Precalculus）ばかりで、図形の平行移動（Geometry の rigid motion）の言い方は確かめられない
- 参照で見出しにした語のうち、参照の中で 1〜2 件しか出ないもの（negate・composite number・circumcircle・concurrent・empty set）。見出しの語は正しいが、根拠は薄い
- 「英語に決まった言い方がない」にした語のうち、英語に名前があるが用例コーパス・参照で確かめられないもの（二重根号 nested radical、基本対称式、方べきの定理 power of a point、接弦定理、3 垂線の定理）。mapping near の判断に揺れがありうる
- 反復試行の en.term independent trials は、独立な試行（independence-of-events に寄せた）と同じ英語
- 要素の個数の en.term cardinality は MIT 6.042 だけ（話し言葉 82 件すべて）
- 平行移動・連立不等式・排反・証明終わりなど、見出しが台帳の英語と変わった語（E）
- level.us を AP Statistics から Intro Statistics に替えた 16 語のうち、OpenStax Introductory Statistics に出てこない語（independent-random-variables・linear-transformation-of-a-random-variable・rejection-region・bayes-theorem・t-test-for-the-slope・normal-probability-plot）は、Intro Statistics の level も確かめられない
- ₙPᵣ の読み（n P r）は用例コーパスで 0 件

## I. 止めた理由と、決めてほしいこと

バッチ 4 の人間レビュー行きが 11 ／ 50（22%）で 1 割を超えたので、バッチ 5 に進まず止めた。残りの Geometry 67 行も同じ性質（外角定理・SSS ／ SAS ／ ASA・CPCTC・transversal・two-column proof・linear pair・apothem・glide reflection など、米国の幾何の授業の固有の名前）で、今のコーパスと参照ではほとんどが ③ になる見込み。**続ける前に、幾何の ③ をどう扱うか（参照に幾何の本を足すか、Geometry の名前は ③ のまま人間レビューにまとめて回すか）を決めてください。** Discrete Math の残り 49 行は Levin で多くが決まる見込み。

## K. 残りの行数

**131 行**（台帳の unit にこの 4 系統を含み、まだエントリのない行）。

| 単元 | 行 |
|---|---|
| Geometry（reasoning-and-proof 14・congruent-triangles 10・circles 9・area-and-volume 8・parallel-and-perpendicular 6・similarity 6・transformations 6・foundations 5・right-triangles-and-trig 2・coordinate-geometry 1） | 67 |
| Discrete Math（graphs-and-relations 13・logic-and-proofs 12・number-theory 8・induction-and-recursion 5・sets-and-functions 5・counting 4・discrete-probability 2） | 49 |
| 数I・数A（台帳の末尾の行: 共通部分・仮説・変量・余事象・和の法則・積の法則・中線・合同式・10 進法・割線 ほか） | 15 |

## L. 確認

```
python3 scripts/ledger/fix_phase1.py       # 手順 13: 付け替え 67 ／ AP Statistics を外した 16。手順 14: same 31 ／ section 18 ／ instance 87 ／ renamed 2 ／ symbols 4 ／ phrases 11 ／ out of scope 3
pnpm corpus:count && pnpm corpus:decide    # 対象 1045。主見出し決着 736 ／ 併記 97 ／ 決まった言い方なし 74 ／ 参照 148 ／ 人間が決めた 24 ／ 判断不能 24 ／ 不一致 0 ／ 直すこと 0
pnpm crosscheck -- --write                 # 360/360 一致（新しいタイトルだけ取得、残りは cached）
pnpm exec tsc --noEmit                     # 緑
pnpm validate                              # terms 1029、警告 0
pnpm spell                                 # 0 件
pnpm test                                  # 105/105
pnpm build                                 # 緑。export: terms.json 1018（draft 11 を除く）、symbols.json 11
```
