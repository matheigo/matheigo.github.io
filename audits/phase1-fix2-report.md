# Phase 1 修正 2 レポート — 英語照合・見出し・OpenStax 投入

作成: 2026-09-24 ／ 対象: 3b53eb1 → 本コミット ／ 手順: `python3 scripts/ledger/wikien.py` と `pnpm corpus:fetch:openstax`（一括取得）→ `python3 scripts/ledger/fix_phase1.py` → `pnpm corpus:count && pnpm corpus:decide -- --write`

## まとめ

- ja.check の title 258 件を英語で照合: **ok 142 ／ wikipedia を ja.basis から外した 116**。title の残りは 0 件
  - 外れると見込んでいた 5 件（相似変換・特性方程式・極・発散する・直交座標）は 5 件とも外れた
  - 外した 116 件のうち source が変わったのは 17 件（wikipedia-langlink 15・wikidata 2）。うち 8 件は対応そのものは正しく、規則のせいで出典を失った（下の B-3）
- 表記: 見出しに 線型・函数・冪 を含む行は 0 件で、変更なし。Wikipedia 表記を ja_alt に足したのは 8 件
- alt 18 件は見出しを入れ替えず、例外の 1 件（可逆行列 → 正則行列）だけ入れ替えた。alt は 17 件残る
- ja.basis は mext 363 ／ wikipedia 560 → **444** ／ editorial 1434 → **1550**。ja.check は ok 647 → **790** ／ alt 18 → **17** ／ title 258 → **0** ／ — 1434 → **1550**
- OpenStax *Calculus* Volume 1 を written コーパスに入れた。54 節、306,447 語（正規化後 283,436 語、全体の 15.2%）。**ライセンスは CC BY 4.0 ではなく CC BY-NC-SA 4.0**（コレクションのメタデータで確認）。DECISIONS・STYLE・fetch.ts の記載を直した
- 通分する: ③ 判断不能 → **① common denominator**（話し言葉 29 件・唯一）。flag なし
- 移項する: ③ 判断不能 → **② 併記**（話し言葉 from both sides 98 ／ to both sides 90 ／ to the other side 48、重み付け後）。ただしエントリは both sides の 2 つを written に置いているので **register 不一致として人間レビュー行き**
- substitute back: 再判定しても **不一致のまま**。書き言葉の substitute（OpenStax 66 件・唯一）が新たに不一致に加わった
- `pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて緑（test 39/39、build 21 ページ、export まで）

## A. 取得（Wikipedia と OpenStax を 1 回にまとめた）

2 本を 1 つのバックグラウンドジョブで並列に回し、15 秒ごとに done/total を確認した。

| 対象 | 件数 | リクエスト | 結果 |
|---|---:|---:|---|
| ja.wikipedia: title 行の着地記事の en langlink | 208 タイトル | 5 | 208/208 |
| en.wikipedia: en.term（書いたまま・各語頭大文字）と langlink 先のリダイレクト解決・曖昧さ回避判定 | 691 タイトル | 14 | 691/691 |
| OpenStax Calculus Vol 1: コレクション＋各節の CNXML（コミット 8dbc2ce に固定） | 1＋54 ファイル | 55 | 54/54 |

- 全リクエストに **タイムアウト 30 秒・リトライ上限 3 回**（Wikipedia は 429 の Retry-After も守る）。上限に達したら、そのバッチを飛ばして終了コード 1 で終わる。再実行すれば埋まる。今回のリトライは 0 回
- 途中経過: Wikipedia en 150/691・OpenStax 14/54 → 両方完了
- キャッシュ: Wikipedia はタイトル単位で `scripts/ledger/wiki_en_cache.json`（gitignore）、OpenStax は `corpus/openstax-calculus/raw/*.cnxml`。もう一度流して、取得が 0 件（ja 208 件・en 691 件ともキャッシュから、OpenStax は 54 件とも既存）になることを確かめた
- 照合に使った結果は `scripts/ledger/wiki_en.json` としてコミットした（`wiki_cat.json` と同じ扱い）。`fix_phase1.py` はネットに出ずに同じ台帳を出す
- 取得するタイトルは `fix_phase1.transform(en_check=False)` から取るので、次に `fix_phase1.py` が引くものと必ず一致する

## B. 決定 1: ja.check title 258 件の英語照合

規則: ja 側の着地記事（`wiki_ja`）の en langlink と、`en`（en.term）の en.wikipedia 記事を、どちらもリダイレクト解決後に比べる。同じ記事なら ok。違えば wikipedia を ja.basis から外す（`ja_basis` = editorial、`ja_check` = —）。en.term は書いたままで引き、記事が無ければ各語の頭を大文字にして引き直す。曖昧さ回避ページに着いたら不一致。

外した行は langlink を出典にも使わない: `wiki_ja` / `wiki_en` / `wikidata` を空にし、source が wikipedia-langlink / wikidata なら editorial（米国側の単元なら textbook）に戻し、flag を `wiki-rejected`、note に「wiki 除外（英語照合不一致: 理由）」。README の `wiki_ja` は「同じ概念のときだけ残す」列なので、それに合わせた（DECISIONS 2026-09-24）。

### B-1. 結果

| 結果 | 件数 | 例 |
|---|---:|---|
| ok | 142 | 逆行列 → 正則行列 → Invertible matrix ＝ inverse matrix → Invertible matrix。部分和 → 級数 → Series (mathematics) ＝ partial sum → Series (mathematics) |
| 外した: 別の記事 | 43 | 数直線 → 直線 → Line (geometry) ／ number line → Number line |
| 外した: en.term が曖昧さ回避 | 37 | 極 → Zeros and poles ／ pole → Pole（曖昧さ回避） |
| 外した: en.term の記事なし | 27 | 接する → 接線 → Tangent ／ be tangent to → 記事なし（動詞句・形容詞句が多い） |
| 外した: ja 記事に en 版なし | 9 | 仰角 → 仰俯角 → en 版なし |
| **計** | **258** | |

ok になった行のうち 46 件は、Phase 1 の台帳で `wiki_en` が空だった（langlink があるのに取れていなかった）。今回取った langlink で埋めた。

### B-2. 外れると見込んでいた 5 件

| id | 見出し | ja 記事 → en langlink | en.term → en 記事 | 理由 |
|---|---|---|---|---|
| similarity-transformation | 相似変換 | 行列の相似 → Matrix similarity | similarity transformation → Similarity transformation | en.term は曖昧さ回避 |
| characteristic-equation | 特性方程式 | 固有多項式 → Characteristic polynomial | characteristic equation → Characteristic equation | en.term は曖昧さ回避 |
| pole | 極 | 極 (複素解析) → Zeros and poles | pole → Pole | en.term は曖昧さ回避 |
| diverge | 発散する | 発散 (ベクトル解析) → Divergence | diverge → Divergence (disambiguation) | en.term は曖昧さ回避 |
| rectangular-coordinates | 直交座標 | 直交曲線座標 → Orthogonal coordinates | rectangular coordinates → Cartesian coordinate system | 別の記事 |

### B-3. source が変わった 17 件

「見立て」は私の読みで、処理には使っていない。**対応は正しい** の 8 件は、ja の langlink 自体は合っているのに、en.term が曖昧さ回避や数学外の記事に当たったので外れた。規則を機械的に当てた結果で、例外は作っていない。戻すなら `fix_decisions.py` に 1 行ずつ足す形になる。

| id | 見出し | en | 旧 source | ja 記事 → en langlink | en.term → en 記事 | 見立て |
|---|---|---|---|---|---|---|
| origin | 原点 | origin | wikipedia-langlink | 原点 (数学) → Origin (mathematics) | Origin | 対応は正しい（en.term が曖昧さ回避） |
| substitution | 代入 | substitution | wikipedia-langlink | 代入 (論理学) → Substitution (logic) | Substitution | 別概念（論理学の置換） |
| slant-height | 母線 | slant height | wikipedia-langlink | 母線 (数学) → Generatrix | Cone | 近いが別（母線は線、slant height は長さ） |
| face | 面 | face | wikipedia-langlink | 面 (幾何学) → Face (geometry) | Face | 対応は正しい（en.term が人の顔の記事） |
| elementary-symmetric-polynomial | 基本対称式 | elementary symmetric polynomial | wikidata | 対称式 → Symmetric polynomial | Elementary symmetric polynomial | 親記事（ja に専用記事なし） |
| inverse | 裏 | inverse | wikipedia-langlink | 裏 (論理学) → Inverse (logic) | Inverse | 対応は正しい（en.term が曖昧さ回避） |
| eulers-formula-for-polyhedra | オイラーの多面体定理 | Euler's formula for polyhedra | wikipedia-langlink | 多面体 → Polyhedron | Euler characteristic | 親記事 |
| continuous-random-variable | 連続型確率変数 | continuous random variable | wikidata | 確率変数 → Random variable | Probability distribution | 親記事 |
| standard-normal-table | 正規分布表 | standard normal table | wikipedia-langlink | 正規分布 → Normal distribution | Standard normal table | 親記事 |
| implicit-differentiation | 陰関数の微分 | implicit differentiation | wikipedia-langlink | 陰関数 → Implicit function | Implicit differentiation | 親記事（ja は陰関数の記事） |
| scalar | スカラー | scalar | wikipedia-langlink | スカラー (数学) → Scalar (mathematics) | Scalar | 対応は正しい（en.term が曖昧さ回避） |
| pole | 極 | pole | wikipedia-langlink | 極 (複素解析) → Zeros and poles | Pole | 別概念（複素解析の極。極座標の極ではない） |
| multiplicity-of-a-zero | 根の重複度 | multiplicity of a zero | wikipedia-langlink | 重複度 (数学) → Multiplicity (mathematics) | （記事なし） | 対応は正しい（en.term の記事なし） |
| work | 仕事 | work | wikipedia-langlink | 仕事 (物理学) → Work (physics) | Work | 対応は正しい（en.term が曖昧さ回避） |
| kernel | 核 | kernel | wikipedia-langlink | 核 (代数学) → Kernel (algebra) | Kernel | 対応は正しい（en.term が曖昧さ回避） |
| point-of-intersection | 交点 | point of intersection | wikipedia-langlink | 交点 (数学) → Intersection | Line–line intersection | 近いが別（交わり一般 / 2 直線の交点） |
| intersection | 共通部分 | intersection | wikipedia-langlink | 共通部分 (数学) → Intersection (set theory) | Intersection | 対応は正しい（en.term は交わり一般の記事） |

### B-4. 表記（線型・函数・冪）

見出しにこの 3 つを含む行は無かった（見出し変更 0 件）。記事名が見出し（か ja_alt）の Wikipedia 表記だったものは、その表記を ja_alt に足した。

| id | 見出し | ja_alt に足した表記 | 英語照合 |
|---|---|---|---|
| linearization | 一次近似 | 線型近似 | 外した（別の記事） |
| polynomial-function | 多項式関数 | 多項式函数 | ok |
| vector-valued-function | ベクトル値関数 | ベクトル値函数 | ok |
| power-series | べき級数 | 冪級数 | ok |
| system-of-linear-equations | 線形方程式系 | 線型方程式系 | ok |
| linear-independence | 線形独立 | 線型独立 | ok |
| linear-map | 線形写像 | 線型写像 | ok |
| power-set | べき集合 | 冪集合 | ok |

<details><summary>外した 116 件の一覧</summary>

| id | 見出し | en | ja 記事 → en langlink | en.term → en 記事 | 理由 |
|---|---|---|---|---|---|
| number-line | 数直線 | number line | 直線 → Line (geometry) | Number line | 別の記事 |
| origin | 原点 | origin | 原点 (数学) → Origin (mathematics) | Origin | en.term は曖昧さ回避 |
| compute | 計算する | compute | 計算 → Computation | Computing | 別の記事 |
| round | 四捨五入する | round | 端数処理 → Rounding | Round | en.term は曖昧さ回避 |
| substitution | 代入 | substitution | 代入 (論理学) → Substitution (logic) | Substitution | en.term は曖昧さ回避 |
| unknown | 未知数 | unknown | 変数 (数学) → Variable (mathematics) | Unknown | en.term は曖昧さ回避 |
| correspond | 対応する | correspond | 対応 (数学) → （en 版なし） | （記事なし） | ja 記事に en 版なし |
| increase | 増加する | increase | 単調写像 → Monotonic function | Increase | en.term は曖昧さ回避 |
| decrease | 減少する | decrease | 単調写像 → Monotonic function | Decrease | 別の記事 |
| ray | 半直線 | ray | 直線 → Line (geometry) | Ray | en.term は曖昧さ回避 |
| line-of-reflection | 対称の軸 | line of reflection | 線対称 → Axial symmetry | （記事なし） | en.term の記事なし |
| be-tangent-to | 接する | be tangent to | 接線 → Tangent | （記事なし） | en.term の記事なし |
| is-parallel-to | 平行である | is parallel to | 平行 → Parallel (geometry) | （記事なし） | en.term の記事なし |
| slant-height | 母線 | slant height | 母線 (数学) → Generatrix | Cone | 別の記事 |
| face | 面 | face | 面 (幾何学) → Face (geometry) | Face | 別の記事 |
| measure-of-center | 代表値 | measure of center | 要約統計量 → Descriptive statistics | （記事なし） | en.term の記事なし |
| experimental-probability | 統計的確率 | experimental probability | 頻度主義統計学 → Frequentist probability | Empirical probability | 別の記事 |
| be-divisible-by | 割り切れる | be divisible by | 約数 → Divisor | （記事なし） | en.term の記事なし |
| sss | 三辺相等 | SSS | 図形の合同 → Congruence (geometry) | SSS | en.term は曖昧さ回避 |
| sas | 二辺夾角相等 | SAS | 図形の合同 → Congruence (geometry) | SAS | en.term は曖昧さ回避 |
| asa | 一辺両端角相等 | ASA | 図形の合同 → Congruence (geometry) | ASA | en.term は曖昧さ回避 |
| opposite-side | 対辺 | opposite side | 三角形 → Triangle | （記事なし） | en.term の記事なし |
| five-number-summary | 五数要約 | five-number summary | 箱ひげ図 → Box plot | Five-number summary | 別の記事 |
| tree-diagram | 樹形図 | tree diagram | 木 (数学) → Tree (graph theory) | Tree diagram | en.term は曖昧さ回避 |
| die | さいころ | die | サイコロ → Dice | Die | en.term は曖昧さ回避 |
| rationalize | 有理化する | rationalize | 有理化 → Rationalisation (mathematics) | Rationalization | en.term は曖昧さ回避 |
| is-irrational | 無理数である | is irrational | 無理数 → Irrational number | （記事なし） | en.term の記事なし |
| is-symmetric-about | 線対称である | is symmetric about | 線対称 → Axial symmetry | （記事なし） | en.term の記事なし |
| aa | 二角相等 | AA | 図形の相似 → Similarity (geometry) | AA | en.term は曖昧さ回避 |
| elementary-symmetric-polynomial | 基本対称式 | elementary symmetric polynomial | 対称式 → Symmetric polynomial | Elementary symmetric polynomial | 別の記事 |
| any | 任意の | any | 任意 → Arbitrariness | Any | en.term は曖昧さ回避 |
| or | または | or | 論理和 → Logical disjunction | Or | en.term は曖昧さ回避 |
| universal-set | 全体集合 | universal set | 集合 → Set (mathematics) | Universal set | 別の記事 |
| complement | 補集合 | complement | 差集合 → Complement (set theory) | Complement | en.term は曖昧さ回避 |
| false | 偽 | false | 真理値 → Truth value | False | en.term は曖昧さ回避 |
| inverse | 裏 | inverse | 裏 (論理学) → Inverse (logic) | Inverse | en.term は曖昧さ回避 |
| necessary-and-sufficient-condition | 必要十分条件 | if and only if | 必要条件と十分条件 → Necessity and sufficiency | If and only if | 別の記事 |
| lead-to-a-contradiction | 矛盾する | lead to a contradiction | 矛盾 → Contradiction | （記事なし） | en.term の記事なし |
| angle-of-elevation | 仰角 | angle of elevation | 仰俯角 → （en 版なし） | Spherical coordinate system | ja 記事に en 版なし |
| angle-of-depression | 俯角 | angle of depression | 仰俯角 → （en 版なし） | Spherical coordinate system | ja 記事に en 版なし |
| quartile-deviation | 四分位偏差 | quartile deviation | 分位数 → Quantile | Interquartile range | 別の記事 |
| positive-correlation | 正の相関 | positive correlation | 相関係数 → Correlation coefficient | Correlation | 別の記事 |
| negative-correlation | 負の相関 | negative correlation | 相関係数 → Correlation coefficient | Negative relationship | 別の記事 |
| reject | 棄却する | reject | 棄却 → （en 版なし） | Rejection | ja 記事に en 版なし |
| circumcenter | 外心 | circumcenter | 外接円 → Circumscribed circle | Circumcircle | 別の記事 |
| incenter | 内心 | incenter | 内接円 → Inscribed circle → Incircle and excircles | Incenter | 別の記事 |
| tangent-chord-theorem | 接弦定理 | tangent-chord angle | 円 (数学) → Circle | （記事なし） | en.term の記事なし |
| eulers-formula-for-polyhedra | オイラーの多面体定理 | Euler's formula for polyhedra | 多面体 → Polyhedron | Euler characteristic | 別の記事 |
| are-coplanar | 同一平面上にある | are coplanar | 共面 → Coplanarity | （記事なし） | en.term の記事なし |
| divisibility-rules | 倍数の判定法 | divisibility rules | 倍数 → Multiple (mathematics) | Divisibility rule | 別の記事 |
| factor-into-primes | 素因数分解する | factor into primes | 素因数分解 → Integer factorization | （記事なし） | en.term の記事なし |
| digit | 桁 | digit | 位取り記数法 → Positional notation | Digit | en.term は曖昧さ回避 |
| reduce | 約分する | reduce | 分数 → Fraction | Reduction | en.term は曖昧さ回避 |
| is-an-identity | 恒等式である | is an identity | 恒等式 → Identity (mathematics) | （記事なし） | en.term の記事なし |
| pure-imaginary-number | 純虚数 | pure imaginary number | 虚数 → Imaginary number | （記事なし） | en.term の記事なし |
| degree-measure | 度数法 | degree measure | 度 (角度) → Degree (angle) | （記事なし） | en.term の記事なし |
| general-solution | 一般解 | general solution | 方程式 → Equation | Linear differential equation | 別の記事 |
| argument | 真数 | argument (of a logarithm) | 対数 → Logarithm | （記事なし） | en.term の記事なし |
| differentiate | 微分する | differentiate | 微分 → Derivative | Differentiation | en.term は曖昧さ回避 |
| constant-of-integration | 積分定数 | constant of integration | 不定積分 → Indefinite integral → Antiderivative | Constant of integration | 別の記事 |
| integrate | 積分する | integrate | 積分法 → Integral calculus → Integral | Integration | en.term は曖昧さ回避 |
| common-ratio | 公比 | common ratio | 等比数列 → Geometric progression | （記事なし） | en.term の記事なし |
| characteristic-equation | 特性方程式 | characteristic equation | 固有多項式 → Characteristic polynomial | Characteristic equation | en.term は曖昧さ回避 |
| diverge | 発散する | diverge | 発散 (ベクトル解析) → Divergence | Divergence (disambiguation) | en.term は曖昧さ回避 |
| continuous-random-variable | 連続型確率変数 | continuous random variable | 確率変数 → Random variable | Probability distribution | 別の記事 |
| standard-normal-table | 正規分布表 | standard normal table | 正規分布 → Normal distribution | Standard normal table | 別の記事 |
| is-statistically-significant | 有意である | is statistically significant | 有意 → Statistical significance | （記事なし） | en.term の記事なし |
| test | 検定する | test | 検定統計量 → Test statistic | Test | en.term は曖昧さ回避 |
| comparison-for-divergence | 追い出しの原理 | comparison for divergence | はさみうちの原理 → Squeeze theorem | （記事なし） | en.term の記事なし |
| discontinuous | 不連続 | discontinuous | 連続 (数学) → Continuity (mathematics) → List of continuity-related mathematical topics | Classification of discontinuities | 別の記事 |
| implicit-differentiation | 陰関数の微分 | implicit differentiation | 陰関数 → Implicit function | Implicit differentiation | 別の記事 |
| linear-approximation | 近似式 | linear approximation | 近似 → Approximation | Linear approximation | 別の記事 |
| linearization | 一次近似 | linearization | 線型近似 → Linear approximation | Linearization | 別の記事 |
| directed-segment | 有向線分 | directed segment | 空間ベクトル → Euclidean vector | （記事なし） | en.term の記事なし |
| scalar | スカラー | scalar | スカラー (数学) → Scalar (mathematics) | Scalar | en.term は曖昧さ回避 |
| linearly-dependent | 一次従属 | linearly dependent | 線型結合 → Linear combination | Linear independence | 別の記事 |
| are-linearly-independent | 一次独立である | are linearly independent | 線型独立 → Linear independence | （記事なし） | en.term の記事なし |
| major-axis | 長軸 | major axis | 楕円 → Ellipse | Semi-major and semi-minor axes | 別の記事 |
| minor-axis | 短軸 | minor axis | 楕円 → Ellipse | Semi-major and semi-minor axes | 別の記事 |
| pole | 極 | pole | 極 (複素解析) → Zeros and poles | Pole | en.term は曖昧さ回避 |
| rectangular-coordinates | 直交座標 | rectangular coordinates | 直交曲線座標 → Orthogonal coordinates | Cartesian coordinate system | 別の記事 |
| stacked-bar-chart | 帯グラフ | stacked bar chart | 統計図表 → Chart | Bar chart | 別の記事 |
| simple-interest | 利息 | simple interest | 利子 → Interest | Interest (economics) | 別の記事 |
| rigid-motion | 合同変換 | rigid motion | 等長写像 → Isometry | Rigid transformation | 別の記事 |
| similarity-transformation | 相似変換 | similarity transformation | 行列の相似 → Matrix similarity | Similarity transformation | en.term は曖昧さ回避 |
| multiplicity-of-a-zero | 根の重複度 | multiplicity of a zero | 重複度 (数学) → Multiplicity (mathematics) | （記事なし） | en.term の記事なし |
| geometric-series | 幾何級数 | geometric series | 等比数列 → Geometric progression | Geometric series | 別の記事 |
| restricted-domain | 定義域の制限 | restricted domain | 制限 (数学) → Restriction (mathematics) | （記事なし） | en.term の記事なし |
| newtons-law-of-cooling | ニュートンの冷却法則 | Newton's law of cooling | ニュートンの冷却の法則 → Heat conduction → Thermal conduction | Newton's law of cooling | 別の記事 |
| work | 仕事 | work | 仕事 (物理学) → Work (physics) | Work | en.term は曖昧さ回避 |
| constraint | 制約条件 | constraint | 制約 (数学) → Constraint (mathematics) | Constraint | en.term は曖昧さ回避 |
| particular-solution | 特殊解 | particular solution | 方程式 → Equation | Ordinary differential equation | 別の記事 |
| initial-condition | 初期条件 | initial condition | 初期値問題 → Initial value problem | Initial condition | 別の記事 |
| percentile | パーセンタイル | percentile | 分位数 → Quantile | Percentile | 別の記事 |
| unbiased-estimator | 不偏推定量 | unbiased estimator | 偏り → （en 版なし） | Bias of an estimator | ja 記事に en 版なし |
| convergence-of-a-sequence | 数列の収束 | convergence of a sequence | 極限 → Limit (mathematics) | （記事なし） | en.term の記事なし |
| take-the-partial-derivative | 偏微分する | take the partial derivative | 偏微分 → Partial derivative | （記事なし） | en.term の記事なし |
| jacobian | ヤコビアン | Jacobian | ヤコビ行列 → Jacobian matrix and determinant | Jacobian | 別の記事 |
| cofactor | 余因子 | cofactor | 小行列式 → Minor (linear algebra) | Cofactor | en.term は曖昧さ回避 |
| kernel | 核 | kernel | 核 (代数学) → Kernel (algebra) | Kernel | en.term は曖昧さ回避 |
| diagonalizable | 対角化可能 | diagonalizable | 対角化 → （en 版なし） | Diagonalizable matrix | ja 記事に en 版なし |
| quantifier | 量化子 | quantifier | 量化 → （en 版なし） | Quantifier | ja 記事に en 版なし |
| countable | 可算 | countable | 可算集合 → （en 版なし） | Countable set | ja 記事に en 版なし |
| directed-graph | 有向グラフ | directed graph | グラフ理論 → Graph theory | Directed graph | 別の記事 |
| base-of-a-solid | 底面 | base | 底 (初等幾何学) → Base (geometry) | Base | en.term は曖昧さ回避 |
| divisor-in-division | 除数 | divisor | 除法 → Division (mathematics) | Divisor | 別の記事 |
| factor-an-expression | 因数分解する | factor | 因数分解 → Factorization | Factor | en.term は曖昧さ回避 |
| estimate | 推定する | estimate | 推定 → Presumption | Estimation | 別の記事 |
| point-of-intersection | 交点 | point of intersection | 交点 (数学) → Intersection | Line–line intersection | 別の記事 |
| intersection | 共通部分 | intersection | 共通部分 (数学) → Intersection (set theory) | Intersection | 別の記事 |
| complementary-event | 余事象 | complement (of an event) | 事象 (確率論) → Event (probability theory) | （記事なし） | en.term の記事なし |
| congruence-modulo-n | 合同式 | congruence | 整数の合同 → Congruence (integers) → Modular arithmetic | Congruence | en.term は曖昧さ回避 |
| approximate-number | 概数 | approximation | 近似値 → （en 版なし） | Approximation | ja 記事に en 版なし |
| secant | セカント | secant | 三角関数 → Trigonometric functions | Secant | en.term は曖昧さ回避 |
| statistical-power | 検出力 | power | 仮説検定 → Statistical hypothesis test | Power | en.term は曖昧さ回避 |
| move-term-to-other-side | 移項する | move to the other side | 等式 → Equality (mathematics) | （記事なし） | en.term の記事なし |

</details>

<details><summary>ok になった 142 件の一覧（† は wiki_en を埋めた行）</summary>

| id | 見出し | en | ja 記事 → en langlink |
|---|---|---|---|
| subtract | 引く | subtract | 減法 → Subtraction † |
| multiply | 掛ける | multiply | 乗法 → Multiplication † |
| parentheses | かっこ | parentheses | 括弧 → Bracket † |
| percent | 百分率 | percent | パーセント → Percentage |
| constant-of-proportionality | 比例定数 | constant of proportionality | 比例 → Proportionality (mathematics) |
| circle | 円 | circle | 円 (数学) → Circle |
| diameter | 直径 | diameter | 径 → Diameter |
| perimeter | 周の長さ | perimeter | 周長 → Perimeter † |
| symmetric | 対称な | symmetric | 対称性 → Symmetry |
| cylinder | 円柱 | cylinder | 円柱 (数学) → Cylinder |
| frequency-table | 度数分布表 | frequency table | 度数分布 → Frequency distribution † |
| remainder | 余り | remainder | 剰余 → Remainder |
| quotient | 商 | quotient | 商 (数学) → Quotient |
| y-intercept | 切片 | y-intercept | 切片 (数学) → Y-intercept |
| necessary-and-sufficient | 必要十分 | necessary and sufficient | 必要条件と十分条件 → Necessity and sufficiency † |
| non-terminating-decimal | 無限小数 | non-terminating decimal | 小数 → Decimal representation |
| double-root | 重解 | double root | 重根 (多項式) → Multiple roots of a polynomial |
| complete-the-square | 平方完成する | complete the square | 平方完成 → Completing the square |
| random-number | 乱数 | random number | 乱数列 → Random number |
| sample-mean | 標本平均 | sample mean | 標本平均・標本共分散 → Sample mean and covariance † |
| integer-part | 整数部分 | integer part | 床関数と天井関数 → Floor and ceiling functions |
| floor-function | ガウス記号 | floor function | 床関数と天井関数 → Floor and ceiling functions |
| contrapositive | 対偶 | contrapositive | 対偶 (論理学) → Contraposition |
| necessary-condition | 必要条件 | necessary condition | 必要条件と十分条件 → Necessity and sufficiency † |
| sufficient-condition | 十分条件 | sufficient condition | 必要条件と十分条件 → Necessity and sufficiency † |
| corollary | 系 | corollary | 系 (数学) → Corollary |
| closed-interval | 閉区間 | closed interval | 区間 (数学) → Interval (mathematics) |
| open-interval | 開区間 | open interval | 区間 (数学) → Interval (mathematics) |
| tetrahedron | 四面体 | tetrahedron | 三角錐 → Tetrahedron |
| alternative-hypothesis | 対立仮説 | alternative hypothesis | 仮説検定 → Statistical hypothesis test |
| mutually-exclusive-events | 排反事象 | mutually exclusive events | 排反 → Mutual exclusivity † |
| excenter | 傍心 | excenter | 三角形の内接円と傍接円 → Incircle and excircles |
| supplementary-angle | 補角 | supplementary angle | 角度 → Angle |
| complementary-angle | 余角 | complementary angle | 角度 → Angle |
| diophantine-equation | 不定方程式 | Diophantine equation | ディオファントス方程式 → Diophantine equation † |
| reducing-a-fraction | 約分 | reducing a fraction | 分数 → Fraction |
| partial-fractions | 部分分数 | partial fractions | 部分分数分解 → Partial fraction decomposition |
| arithmetic-mean | 相加平均 | arithmetic mean | 算術平均 → Arithmetic mean |
| cauchy-schwarz-inequality | コーシー・シュワルツの不等式 | Cauchy-Schwarz inequality | コーシー＝シュワルツの不等式 → Cauchy–Schwarz inequality |
| denominator | 分母 | denominator | 分数 → Fraction |
| real-part | 実部 | real part | 複素数 → Complex number |
| imaginary-part | 虚部 | imaginary part | 複素数 → Complex number |
| equation-of-a-circle | 円の方程式 | equation of a circle | 円 (数学) → Circle |
| even-function | 偶関数 | even function | 偶関数と奇関数 → Even and odd functions |
| odd-function | 奇関数 | odd function | 偶関数と奇関数 → Even and odd functions |
| product-to-sum-formulas | 積和公式 | product-to-sum formulas | 三角関数の公式の一覧 → List of trigonometric identities † |
| sum-to-product-formulas | 和積公式 | sum-to-product formulas | 三角関数の公式の一覧 → List of trigonometric identities † |
| exponential-growth | 指数関数的増加 | exponential growth | 指数関数的成長 → Exponential growth † |
| normal-line | 法線 | normal line | 法線ベクトル → Normal vector |
| antiderivative | 原始関数 | antiderivative | 不定積分 → Indefinite integral |
| inverse-operation | 逆演算 | inverse operation | 逆写像 → Inverse function † |
| partial-sum | 部分和 | partial sum | 級数 → Series (mathematics) |
| subscript | 添字 | subscript | 添え字 → Subscript and superscript † |
| fibonacci-sequence | フィボナッチ数列 | Fibonacci sequence | フィボナッチ数 → Fibonacci number |
| discrete-random-variable | 離散型確率変数 | discrete random variable | 確率変数 → Random variable † |
| standard-normal-distribution | 標準正規分布 | standard normal distribution | 正規分布 → Normal distribution |
| population-variance | 母分散 | population variance | 分散 (確率論) → Variance |
| mathematical-model | 数学的モデル | mathematical model | 数理モデル → Mathematical model † |
| regression-line | 回帰直線 | regression line | 線形回帰 → Linear regression |
| interpolation | 補間 | interpolation | 内挿 → Interpolation |
| continuous-function | 連続関数 | continuous function | 連続写像 → Continuous function |
| extreme-value-theorem | 最大値・最小値の定理 | extreme value theorem | 最大値最小値定理 → Extreme value theorem † |
| base-of-the-natural-logarithm | 自然対数の底 | base of the natural logarithm | ネイピア数 → E (mathematical constant) |
| product-rule | 積の微分 | product rule | 積の微分法則 → Product rule † |
| quotient-rule | 商の微分 | quotient rule | 商の微分法則 → Quotient rule † |
| prime-notation | ラグランジュの記法 | prime notation | 微分の記法 → Notation for differentiation † |
| cross-sectional-area | 断面積 | cross-sectional area | 断面 → Cross section (geometry) |
| integrate-by-parts | 部分積分する | integrate by parts | 部分積分 → Integration by parts |
| linearly-independent | 一次独立 | linearly independent | 線型独立 → Linear independence |
| linear-combination | 一次結合 | linear combination | 線型結合 → Linear combination |
| real-axis | 実軸 | real axis | 実数直線 → Real line † |
| imaginary-axis | 虚軸 | imaginary axis | 虚数 → Imaginary number |
| inverse-matrix | 逆行列 | inverse matrix | 正則行列 → Invertible matrix |
| matrix-multiplication | 行列の積 | matrix multiplication | 行列の乗法 → Matrix multiplication † |
| linear-transformation | 一次変換 | linear transformation | 線型写像 → Linear map |
| order-of-operations | 演算の順序 | order of operations | 演算子の優先順位 → Order of operations † |
| scientific-notation | 科学的記数法 | scientific notation | 指数表記 → Scientific notation |
| postulate | 公準 | postulate | 公理 → Axiom |
| deductive-reasoning | 演繹的推論 | deductive reasoning | 演繹 → Deductive reasoning |
| transitive-property | 推移律 | transitive property | 推移関係 → Transitive relation |
| reflexive-property | 反射律 | reflexive property | 反射関係 → Reflexive relation |
| law-of-detachment | 肯定式 | law of detachment | モーダスポネンス → Modus ponens |
| scalene-triangle | 不等辺三角形 | scalene triangle | 三角形 → Triangle |
| inverse-sine | 逆正弦 | inverse sine | 逆三角関数 → Inverse trigonometric functions |
| preimage | 原像 | preimage | 像 (数学) → Image (mathematics) |
| polynomial-function | 多項式関数 | polynomial function | 多項式函数 → Polynomial function |
| arithmetic-series | 算術級数 | arithmetic series | 等差数列 → Arithmetic progression |
| trig-identities | 三角恒等式 | trig identities | 三角関数の公式の一覧 → List of trigonometric identities |
| cosecant | コセカント | cosecant | 三角関数 → Trigonometric functions |
| cotangent | コタンジェント | cotangent | 三角関数 → Trigonometric functions |
| randomization | 無作為化 | randomization | ランダム化 → Randomization † |
| arcsine | アークサイン | arcsine | 逆三角関数 → Inverse trigonometric functions |
| arccosine | アークコサイン | arccosine | 逆三角関数 → Inverse trigonometric functions |
| arctangent | アークタンジェント | arctangent | 逆三角関数 → Inverse trigonometric functions |
| vector-projection | ベクトル射影 | vector projection | ベクトルの成分分解 → Vector projection † |
| augmented-matrix | 拡大係数行列 | augmented matrix | 拡大行列 → Augmented matrix |
| row-operations | 行基本変形 | row operations | 行列の基本変形 → Elementary matrix |
| objective-function | 目的関数 | objective function | 損失関数 → Loss function |
| vector-valued-function | ベクトル値関数 | vector-valued function | ベクトル値函数 → Vector-valued function † |
| alternating-series | 交代級数 | alternating series | 交項級数 → Alternating series † |
| taylor-polynomial | テイラー多項式 | Taylor polynomial | テイラー展開 → Taylor series |
| power-series | べき級数 | power series | 冪級数 → Power series |
| taylor-series | テイラー級数 | Taylor series | テイラー展開 → Taylor series |
| maclaurin-series | マクローリン級数 | Maclaurin series | テイラー展開 → Taylor series |
| simple-random-sample | 単純無作為抽出 | simple random sample | 無作為抽出 → Simple random sample |
| stratified-sampling | 層化抽出 | stratified sampling | 層化抽出法 → Stratified sampling |
| confounding-variable | 交絡変数 | confounding variable | 交絡 → Confounding † |
| type-i-error | 第一種の過誤 | Type I error | 第一種過誤と第二種過誤 → Type I and type II errors † |
| type-ii-error | 第二種の過誤 | Type II error | 第一種過誤と第二種過誤 → Type I and type II errors † |
| scalar-triple-product | スカラー三重積 | scalar triple product | 三重積 (ベクトル解析) → Triple product † |
| cylindrical-coordinates | 円柱座標 | cylindrical coordinates | 円筒座標系 → Cylindrical coordinate system † |
| spherical-coordinates | 球座標 | spherical coordinates | 球面座標系 → Spherical coordinate system † |
| space-curve | 空間曲線 | space curve | 曲線 → Curve |
| function-of-several-variables | 多変数関数 | function of several variables | 関数 (数学) → Function (mathematics) |
| partial-derivative | 偏導関数 | partial derivative | 偏微分 → Partial derivative |
| double-integral | 二重積分 | double integral | 多重積分 → Multiple integral † |
| iterated-integral | 累次積分 | iterated integral | 逐次積分 → Iterated integral † |
| system-of-linear-equations | 線形方程式系 | system of linear equations | 線型方程式系 → System of linear equations |
| reduced-row-echelon-form | 既約行階段形 | reduced row echelon form | 行階段形 → Row echelon form † |
| free-variable | 自由変数 | free variable | 自由変数と束縛変数 → Free variables and bound variables † |
| elementary-matrix | 基本行列 | elementary matrix | 行列の基本変形 → Elementary matrix † |
| block-matrix | ブロック行列 | block matrix | 区分行列 → Block matrix † |
| linear-independence | 線形独立 | linear independence | 線型独立 → Linear independence † |
| linear-map | 線形写像 | linear map | 線型写像 → Linear map |
| isomorphism | 同型 | isomorphism | 同型写像 → Isomorphism † |
| eigenvalue | 固有値 | eigenvalue | 固有値と固有ベクトル → Eigenvalues and eigenvectors |
| eigenvector | 固有ベクトル | eigenvector | 固有値と固有ベクトル → Eigenvalues and eigenvectors |
| eigenspace | 固有空間 | eigenspace | 固有値と固有ベクトル → Eigenvalues and eigenvectors |
| characteristic-polynomial | 特性多項式 | characteristic polynomial | 固有多項式 → Characteristic polynomial † |
| algebraic-multiplicity | 代数的重複度 | algebraic multiplicity | 固有値と固有ベクトル → Eigenvalues and eigenvectors |
| dynamical-system | 動的システム | dynamical system | 力学系 → Dynamical system |
| regression-equation | 回帰式 | regression equation | 回帰分析 → Regression analysis |
| logical-connective | 論理結合子 | logical connective | 論理演算 → Logical connective |
| universal-quantifier | 全称量化子 | universal quantifier | 全称記号 → Universal quantification † |
| existential-quantifier | 存在量化子 | existential quantifier | 存在記号 → Existential quantification † |
| power-set | べき集合 | power set | 冪集合 → Power set |
| ceiling-function | 天井関数 | ceiling function | 床関数と天井関数 → Floor and ceiling functions |
| chinese-remainder-theorem | 中国剰余定理 | Chinese remainder theorem | 中国の剰余定理 → Chinese remainder theorem |
| partial-order | 半順序 | partial order | 順序集合 → Ordered set |
| bipartite-graph | 二部グラフ | bipartite graph | 2部グラフ → Bipartite graph |
| distance-traveled | 道のり | distance | 距離 → Distance |
| cube-solid | 立方体 | cube | 正六面体 → Cube |

</details>

## C. ja.check の残り

| ja_check | 前（3b53eb1） | 今回 | 扱い |
|---|---:|---:|---|
| ok | 647 | 790 | |
| title | 258 | **0** | 全件を英語照合で ok か editorial に振り分けた |
| alt | 18 | **17** | 決定 2 で見出しは入れ替えない。根拠の表記が ja_alt 側にある印として残す |
| — | 1434 | 1550 | 照合先なし（editorial）。不一致ではない |

人間が見直す ja.check は 0 件になった。残る alt 17 件:

| id | 見出し | 根拠 | 根拠側の表記（ja_alt にある） |
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

## D. 決定 2: alt 18 件

- 入れ替えたのは invertible-matrix の 1 件: 見出し 可逆行列 → **正則行列**、ja_alt = 可逆行列。見出しと記事名が同じになったので ja_check は ok
- 残り 17 件は見出しのまま（高校教科書の表記）。`fix_decisions.py` の JA_FIX を 1 行変えただけ

## E. 決定 3・5: コーパス

### E-1. ソースの重み（OpenStax 投入後）

| ソース | register | 語数 | 生の比率 | 係数 |
|---|---|---:|---:|---:|
| mit-18.01 | spoken | 487,139 | 26.2% | ×0.95 |
| openstax-calculus | written | 283,436 | 15.2% | ×1.02 |
| mit-18.02 | spoken | 246,694 | 13.3% | ×1.02 |
| mit-18.03 | spoken | 236,317 | 12.7% | ×1.02 |
| mit-6.042 | spoken | 234,763 | 12.6% | ×1.02 |
| mit-18.06 | spoken | 196,768 | 10.6% | ×1.02 |
| khan-algebra | spoken | 175,056 | 9.4% | ×1.02 |

written のソースは OpenStax Calc 1 だけなので、書き言葉の判定は微積分の語彙に偏る。重みは register を分けずに全ソースで均している（従来どおり）。

### E-2. 判定が変わった語

前回 3b53eb1 の `audits/corpus-2026-09-24.md` と比べた（同じ日付なので今回の実行で上書きされた。前の版は git にある）。

| 項目 | 前 | 今回 | 変化 |
|---|---|---|---|
| terms/find-a-common-denominator | ③ 話 重み付け後 4 件 ／ 書 0 件 | **① 話 common denominator（唯一）** ／ 書 2 件（判断不能） | corpus-undecided が外れた |
| terms/move-term-to-other-side | ③ 話 4 件 ／ 書 0 件 | **② 話 from both sides 98 ／ to both sides 90 ／ to the other side 48** ／ 書 3 件（判断不能） | corpus-undecided → **corpus-register-mismatch**（話: from both sides / to both sides） |
| terms/substitute | ② 話 plug in 416 ／ substitute 208 ／ substitute back 10 ／ 書 0 件 | ② 話 plug in 441 ／ substitute 213 ／ substitute back 11 ／ **① 書 substitute（唯一）** | 不一致が「話: substitute back」→「話: substitute back ／ 書: substitute」 |
| terms/squeeze-theorem | 対象外（0 件） | ③ 話 0 件 ／ 書 8 件 | **corpus-undecided が新たに付いた** |

判定の分類は変わらず、書き言葉の件数だけ増えたもの: derivative-at-a-point（③のまま、書 1）、discriminant（①のまま、書 1）、quadratic-formula（①のまま 11.2 → 11.4:1、書 8）、completing-the-square（①のまま 26.0 → 29.4:1。重みが変わっただけ）、symbols 3 件（変化なし）。

### E-3. 通分・移項の候補表現と件数（生の件数）

候補表現は en.term・en.alt・en.variants・collocations の全部から数える（照合規則は変えていない）。

- **通分する**: en.term を `find a common denominator` から `common denominator` に変え、en.alt（get a / put them over a）を外した。動詞句 3 つは mapping_note に移し、例文はそのまま。collocations（the least common denominator (LCD)、reduce the fraction）は 0 件
  - 話: common denominator 29（mit-18.01 21・khan-algebra 8）
  - 書: common denominator 2（openstax-calculus 2）
  - 文脈はほぼ「put … over a common denominator」「get a common denominator」
- **移項する**: en.variants を `to the other side`（spoken）／ `from both sides`（written）／ `to both sides`（written）に置き換え、元の文（move the 3x over to the other side、subtract 3 from both sides など）は各 variant の note に残した。register の割り振りは元のまま（DECISIONS 2026-09-24）
  - 話: from both sides 97（khan-algebra 88・mit-18.01 8・mit-18.03 1） ／ to both sides 89（khan-algebra 76・mit-18.02 6・mit-18.01 4・mit-18.06 3） ／ to the other side 49（mit-18.01 33・mit-18.02 8・mit-18.03 3・khan-algebra 3・mit-18.06 2） ／ isolate x 2（mit-18.03 2）
  - 書: to both sides 2（openstax-calculus 2） ／ from both sides 1（openstax-calculus 1）
  - both sides の 2 つは Khan（Algebra）が大半、to the other side は 18.01 が大半。STYLE の「Algebra 1 の先生は口頭でも両辺操作を好む」と同じ向き
  - 参考値（判定には使っていない）: 直前 7 語に操作の動詞（subtract / add / move / bring / put …）が無いヒットは from both sides 7/98、to both sides 7/92、to the other side 4/49。中身は limits from both sides、apply the natural logarithm to both sides、walk over to the other side（黒板の反対側）など。どれも判定を動かす量ではない
  - collocation の isolate x（2 件）も候補として数えられている。移項そのものではないが、コレクションは変えていない

## F. 決定 4: substitute back の再判定

- 話: plug in 450（mit-18.01 263・mit-6.042 73・mit-18.02 64・mit-18.03 44・mit-18.06 6） ／ substitute 215（mit-18.01 91・mit-18.03 54・khan-algebra 37・mit-18.02 30・mit-6.042 2・mit-18.06 1） ／ substitute back 11（mit-18.01 7・khan-algebra 4）
- 書: substitute 66（openstax-calculus 66）
- substitute back は OpenStax で 0 件。話し言葉では重み付け後 10.7 件で、床の 10 件をわずかに超えるので ② 併記の一員のまま。エントリは substitute back を collocations にしか持っていないので **不一致は解けない**
- 新たに、書き言葉は **① substitute（唯一）**。エントリは substitute を spoken の variant にしか持っていないので、**書き言葉の不一致が加わった**
- どちらも絶対ルール 9 により人間レビュー行き。エントリの register は書き換えていない。直すなら、substitute を written（または both）の variant に、substitute back を spoken の variant にする形になる。substitute の variant の note にある「書き言葉コーパスは未取得」も、そのとき一緒に直す必要がある

## G. 検証

| コマンド | 結果 |
|---|---|
| `pnpm validate` | passed（0 warning）。terms 10 / symbols 5 / phrases 5 / conventions 3 / curriculum 165 |
| `pnpm spell` | 195 ファイル、0 件（`CNXML`・`osbooks` を辞書に追加） |
| `pnpm test` | 39/39（`cnxmlToText` のテスト 2 件を追加） |
| `pnpm build` | 21 ページ、export まで完了 |
| `python3 scripts/ledger/fix_phase1.py` | 変更前のコードで回して台帳が 1 バイトも変わらないことを確認してから手を入れた。変わった行は 259（title 258 ＋ 可逆行列） |

## 残っていること

- 人間レビュー行き（コーパス）: ③ derivative-at-a-point・squeeze-theorem・symbols/integral-definite、register 不一致 move-term-to-other-side・substitute
- 英語照合で出典を失った正しい対応 8 件（origin, face, inverse, scalar, multiplicity-of-a-zero, work, kernel, intersection）を戻すかどうか
- squeeze theorem は話し言葉 0 件。OCW 18.01 の講義でも Khan Algebra でも言っていない。khan-ap-calc は未取得
- written は OpenStax Calc 1 だけ。PLAN 15 の Vol 2・3、Precalculus、Algebra and Trigonometry、Introductory Statistics は未取得（同じスクリプトの `BOOKS` に足せば取れる）
- OCW の文脈に同じ文が 2 度出るものがあった（18.01・18.02）。ファイルの完全重複は 18.01 の 1 組だけで、件数への影響は調べていない
