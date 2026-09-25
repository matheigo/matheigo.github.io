# Phase 2 レポート — 規則の修正と積分の単元のやり直し、微分・極限の単元（137 語）

作成: 2026-09-24 ／ 対象: 89cc691（Phase 2 fix）→ 本コミット
指示: audits/phase2-integral-fix-report.md を受けて規則を 4 点直し、積分の単元の corpus:decide をやり直す。積分の単元の ③ が 1 割以下になったら、微分・極限の単元に進む。判断は `docs/DECISIONS.md` の「Phase 2 規則の修正」（12 行）と「Phase 2 微分・極限の単元」（24 行）。

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified に上げた語はない。

## まとめ

- **規則を 4 点直した**（A）。③ のうち mapping near ／ none で全候補が話・書とも 10 件未満のものは「英語に決まった言い方がない」（corpus-no-fixed-expression）、それ以外は CED → OpenStax の呼び方を見出しにする（corpus-reference-fallback）。首位だけが 10 件以上なら 3 倍未満でも ①。1 ソース頼みは、抜いて別の言い方が首位になるときだけ ② に下げる。リーマン和の仲間は CED の呼び方（trapezoidal sum）、回転の動詞は rotate に揃えた
- **積分の単元の ③ は 16 ／ 85 語 → 2 ／ 85 語**（2.4%、B）。① に決着 1、決まった言い方なし 5、参照で見出し 8、③ のまま 2（convergence-of-improper-integrals、rationalizing-substitution）
- **1 ソース頼みを判定し直した**（C）。前の修正の C-1（① → ② に下げた 25 判定）は 23 判定が ① に戻り、② のままは 2 判定（find-an-antiderivative の話し言葉、fundamental-theorem-of-calculus の書き言葉。どちらも抜くと別の言い方が首位）
- **微分・極限の単元に進んだ**（E〜G）。台帳の 201 行に今までの規則を先に当てて 137 エントリにし、50 ／ 50 ／ 37 の 3 バッチで生成・検証・コミットした。**likely 136 ／ draft 1**（implicit-function-theorem）。③ は **5 ／ 137 語**（3.6%）、決まった言い方なし 3、参照で見出し 18、register 不一致 0。台帳は 2,318 行 → 2,250 行（68 行を統合・移動、1 行を改名）
- 生成中にパイプラインの数え方の穴を 4 つ見つけて直した（I）: 不規則な複数形（extrema）、3 文字の語の語幹（DNE が dₙ に当たっていた）、L'Hôpital の綴り、字幕の dy/dx。規則 1 は CED が名前を持つ語（Candidates Test）には当てないことにした
- CED で確かめた主張は 68 語（H）。variants の note の件数とソースの内訳は、corpus:probe の出力と機械的に突き合わせて 137 語すべて一致
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて緑（validate 警告 0、spell 0 件、test 83/83、build 241 ページ、export の terms は 230 件＝draft 2 件を除く）。crosscheck 68/68 一致

## A. 規則の修正と実装

| 指示 | 実装 | 場所 |
|---|---|---|
| 1. ③ で mapping near ／ none、全候補の件数の合計が話・書とも 10 未満 → 「英語に決まった言い方がない」 | `settleUndecided` の no-fixed-expression。件数は evidence と同じ生の件数。flag corpus-no-fixed-expression、人間レビューに回さない。decide のレポートが mapping_note に「英語に決まった言い方がない」が無いもの・en.register があるものを「エントリ側で直すこと」に出す | `scripts/corpus/lib.ts`、`decide.ts` |
| 2. それ以外の ③ は CED の呼び方、無ければ OpenStax の呼び方（本文か節の名前）を見出しに | count.ts が候補表現を CED（TOPIC ごと）と OpenStax（4 冊の本文と節の名前）でも数え、counts.json の `reference` に置く。decide が件数の最も多い候補を見出しにし、flag corpus-reference-fallback（note に topic 番号か節の名前）。en.term と違えば「エントリ側で直すこと」に出す | `lib.ts`（`cedSections`・`referenceHits`・`settleUndecided`）、`count.ts`、`decide.ts`、`probe.ts` |
| 2. 首位が 10 件以上で 2 位が 10 件未満なら、3 倍未満でも首位を ①、2 位は少数の variant | `decide()` の byFloor | `lib.ts` |
| 3. 最多ソースを抜いて、別の言い方が首位になるときだけ ② に下げる。③ になるだけなら ① のまま記録 | `decideRobust` | `lib.ts` |
| 4. trapezoidal sum を見出しに、revolve ／ rotate を揃える | エントリ（D） | `data/terms/` |

規則 1 には 2 つの条件を足した（DECISIONS）。どちらも「英語の名前は存在するが件数が少ないだけ」の語に「英語に決まった言い方がない」と書かないため。

- 英語の名前をそのまま日本語の見出しにした語（ja.term と en.term が同じ。LIATE）には当てない
- CED が候補表現のどれかを使っている語（Candidates Test）には当てない

probe の `--decide` は、ブロックに `@mapping near` ／ `@ja …` を書くと ③ の決着まで表示する。各候補の件数とソースの内訳（note に書く形）も出す。

## B. 積分の単元の ③ の前後（16 → 2）

| id | 見出し（en） | 決着 | 見出しの根拠 |
|---|---|---|---|
| axis-of-revolution | axis of revolution | ①（書 13 対 9、首位だけが 10 件以上） | axis of rotation は少数の variant（書） |
| comparison-test-for-integrals | comparison theorem | 参照で見出し | OpenStax の本文 5 件 |
| convergence-of-improper-integrals | convergence of improper integrals | **③ のまま** | 候補 0 件、CED・OpenStax にも無い |
| decompose-into-partial-fractions | decompose into partial fractions | 参照で見出し | OpenStax の本文 2 件 |
| integral-involving-absolute-value | integral of the absolute value | 参照で見出し（**見出しを変えた**） | CED topic 8.6 |
| integrals-giving-inverse-trig-functions | integrals resulting in inverse trigonometric functions | 決まった言い方なし | 話 0 ／ 書 1、mapping near |
| integrals-of-even-and-odd-functions | integrals of even and odd functions | 参照で見出し | OpenStax の本文 1 件 |
| integration-by-completing-the-square | integration by completing the square | 決まった言い方なし | 0 件。CED topic 6.10 は手順を説明するだけ（出典に足した） |
| integration-by-long-division | integration by long division | 決まった言い方なし | 同上 |
| liate | LIATE | 参照で見出し | OpenStax の本文 7 件（規則 1 の例外: 英語の名前そのもの） |
| limit-of-a-riemann-sum | limit of a Riemann sum | 参照で見出し | CED topic 6.3 |
| one-sixth-formula | one-sixth formula | 決まった言い方なし | 0 件、mapping none |
| rationalizing-substitution | rationalizing substitution | **③ のまま**（draft） | 候補 0 件、CED・OpenStax にも無い |
| reverse-of-differentiation | antidifferentiation | 参照で見出し | CED topic 6.14・7.6 |
| substitution-in-a-definite-integral | substitution with definite integrals | 決まった言い方なし | 話 0 ／ 書 2、mapping near |
| surface-area-of-revolution | area of a surface of revolution | 参照で見出し（**見出しを変えた**） | OpenStax の本文 8 件。元の surface area of revolution は en.alt |

決まった言い方なしの 5 語は mapping_note の先頭に「英語に決まった言い方がない（用例コーパスで …）」と書いた。register はもともと主張していない。
首位だけが 10 件以上の規則で、③ 以外にも ① が 3 つ増えた: shell-method（書 method of cylindrical shells 16 対 shell method 9）、logistic-differential-equation（話 logistic differential equation 20 対 7）、revolve-around-the-x-axis（話 rotate … around 24 対 revolve 9）。エントリを結論に合わせた（DECISIONS）。

## C. 1 ソース頼みを判定し直した結果（前の修正の C-1、25 判定）

| 語（register） | 前 | 今（新しい規則） |
|---|---|---|
| find-an-antiderivative（話） | ①→② take / find an | **②のまま**（Khan を抜くと find an antiderivative が首位） |
| fundamental-theorem-of-calculus（書） | ①→② FTC 全称 / FTC | **②のまま**（OpenStax を抜くと FTC が首位） |
| disk-method（話） | ①→② | ① disk method（4.0:1、抜くと ③） |
| eulers-method（話） | ①→② | ① Euler's method（4.3:1、抜くと ③） |
| separable-differential-equation（話） | ①→② | ① separable differential equation（9.7:1、抜くと ③） |
| summation-notation（話） | ①→② | ① sigma notation（4.3:1、抜くと ② で首位は同じ） |
| trigonometric-integrals（話） | ①→② | ① trig integrals（5.1:1、抜いても首位は同じ） |
| revolve-around-the-y-axis（話） | ①→② | ① rotate … around the y-axis（4.3:1、抜くと ③） |
| can-be-integrated（書） | ①→② | ① integrable（8.0:1） |
| evaluate-the-integral（書） | ①→② | ① evaluate the integral（8.2:1） |
| fundamental-theorem-of-calculus-part-1（書） | ①→② | ① …, part 1（3.3:1） |
| fundamental-theorem-of-calculus-part-2（書） | ①→② | ① …, part 2（3.8:1） |
| integrate-by-parts（書） | ①→② | ① use integration by parts（10.0:1） |
| integration-by-substitution（書） | ①→② | ① u-substitution（4.2:1） |
| integration-formulas（書） | ①→② | ① integration formulas（5.3:1） |
| interval-of-integration（書） | ①→② | ① limits of integration（5.5:1） |
| left-riemann-sum（書） | ①→② | ① left-endpoint approximation（3.5:1） |
| right-riemann-sum（書） | ①→② | ① right-endpoint approximation（3.7:1） |
| let-u-equal（書） | ①→② | ① let u =（39.0:1） |
| properties-of-integrals（書） | ①→② | ① properties of the definite integral（4.0:1） |
| substitute-new-variable（書） | ①→② | ① make the substitution（3.2:1） |
| trigonometric-integrals（書） | ①→② | ① trigonometric integrals（8.0:1） |
| trigonometric-substitution（書） | ①→② | ① trigonometric substitution（7.3:1） |
| variable-of-integration（書） | ①→② | ① variable of integration（4.7:1） |
| volume-by-cross-sections（書） | ①→② | ① slicing method（5.3:1） |

① に戻った 23 判定のうち、21 判定は抜くと ③（データが薄くなるだけ）、summation-notation（話）は抜いても同じ首位の ②、trigonometric-integrals（話）は抜いても同じ首位の ①。頼っているソースは decide のレポートの「1 ソース頼み」節に残る（積分の単元で 77 判定、うち ① のまま記録 57）。
エントリで直したのは、en.register が新しい結論と合わなくなった trigonometric-integrals・let-u-equal・left ／ right-riemann-sum の 4 語（B の最後の段落の axis-of-revolution・shell-method・logistic-differential-equation と合わせて 7 語）。variants の note は件数の事実だけで「②」とは書いていなかったので、書き換えは要らなかった。
積分の単元の外（書き戻していない）: substitute（話）と derivative-at-a-point（話）も ①→② から ① に戻る判定になる（plug in は Professor Leonard を抜いても首位、f prime of a は抜くと ③）。

## D. リーマン和の仲間と回転の動詞（指示 4）

- **trapezoidal-rule**: en.term を CED topic 6.2 の **trapezoidal sum**（話 ②）にし、trapezoidal rule を書き言葉の variant（書 ① 61 件、数値積分の方法の名前）、trapezoid rule を話し言葉の variant にした。midpoint-riemann-sum と同じ形。id は変えていない
- **revolve-around-the-x-axis**: en.term を **rotate … around the x-axis** にした。y と同じ動詞。両方の書き言葉の ② に rotate と revolve がともに入るので「両方の ② の集合に入っている方」では決まらず、話し言葉で両方の ① でもある rotate を選んだ（DECISIONS）。rotate は x・y とも話し言葉の ①、書き言葉の ② の一員（y では書き言葉でも首位、x の書き言葉の首位は revolve）

## E. 微分・極限の単元: 生成語数と判定の内訳

| | 語数 | likely | draft | ③ | 決まった言い方なし | 参照で見出し | register 不一致 |
|---|---|---|---|---|---|---|---|
| バッチ 1（06ae365） | 50 | 50 | 0 | 1 | 2 | 5 | 0 |
| バッチ 2（447d626） | 50 | 50 | 0 | 1 | 1 | 5 | 0 |
| バッチ 3（46d62ed） | 37 | 36 | 1 | 3 | 0 | 8 | 0 |
| 計 | **137** | **136** | **1** | **5** | **3** | **18** | **0** |

バッチ 2 と 3 のコミットメッセージに書いた「CED ／ OpenStax の呼び方を見出しにした語」の数（6 ・ 7）は誤りで、正しくは 5 ・ 8（この表）。

判定（137 語 × 2 register）: 話し言葉 ① 77・首位だけ ① 5・② 12・①→② 1・③ 42 ／ 書き言葉 ① 87・首位だけ ① 3・② 8・①→② 3・③ 36。1 ソース頼みの記録 81 判定（① のまま 65、①→② 4: right ／ left-hand-limit の書、limit-laws の書、differentiate-both-sides の話）。
draft は implicit-function-theorem（英語は固有の定理名だが、OpenStax・コーパス・台帳の Wikipedia で確かめられない。内容は Calculus III）。
symbols は 1 つ新設（derivative-leibniz、dy/dx。話 ① d y d x 16.8:1）し、derivative-prime の term_ref を derivative に替えた。

## F. ③ の一覧と、規則で決着した語

### F-1. ③（人間レビュー行き、5 語）

| id | 見出し（ja ／ en） | mapping | 話 | 書 | 見立て |
|---|---|---|---|---|---|
| number-of-real-solutions | 方程式の実数解の個数 ／ number of real solutions | exact | 0 | 0 | how many real roots も 2 件。名詞句として言わないのかもしれない |
| prime-notation | ラグランジュの記法 ／ prime notation | exact | 9 | 0 | prime notation 5 ／ Lagrange notation 4 に割れて 10 件に届かない |
| find-the-inflection-points | 変曲点を求める ／ find the inflection points | exact | 1 | 0 | find the points of inflection ほか 4 通りを数えても 1 件 |
| differential-operator | 微分作用素 ／ differential operator | exact | 2 | 1 | |
| implicit-function-theorem | 陰関数の定理 ／ implicit function theorem | exact | 0 | 0 | draft |

積分の単元の 2 語（B）と合わせて、今回の範囲の ③ は 7 語。既存の am-gm-inequality と symbols 2・phrases 5 は触っていない。

### F-2. 英語に決まった言い方がない（3 語）

| id | 見出し（ja ／ en） | mapping | 話 | 書 |
|---|---|---|---|---|
| make-a-sign-chart | 増減表をかく ／ make a sign chart | none | 0 | 0 |
| comparison-for-divergence | 追い出しの原理 ／ comparison for divergence | none | 0 | 0 |
| limit-of-sine-x-over-x | sin x / x の極限 ／ sin x over x | near | 9 | 0 |

### F-3. 参照で見出しを決めた（18 語）

| id | 見出し（ja ／ en） | 根拠 |
|---|---|---|
| point-of-tangency | 接点 ／ point of tangency | CED topic 4.6 |
| find-the-derivative-at | 微分係数を求める ／ evaluate the derivative at | OpenStax の本文 5 件 |
| determine-where-the-function-is-increasing-and-decreasing | 増減を調べる ／ determine intervals on which … is increasing or decreasing | CED topic 5.3（topic の名前） |
| find-the-local-extrema | 極値を求める ／ find the local extrema | OpenStax の本文 3 件 |
| infinite-geometric-sequence | 無限等比数列 ／ infinite geometric sequence | OpenStax の本文 1 件 |
| implicit-function | 陰関数 ／ implicitly defined function | CED topic 3.2・5.12 |
| derivative-of-a-parametric-curve | 媒介変数表示された関数の微分 ／ derivatives of parametric equations | CED topic 9.2 |
| derivatives-of-trigonometric-functions | 三角関数の導関数 ／ derivatives of trigonometric functions | OpenStax の節の名前 |
| leibniz-notation | ライプニッツの記法 ／ Leibniz notation | CED Unit 3・9 の概要 |
| check-the-concavity | 凹凸を調べる ／ determine the concavity | OpenStax の本文 6 件 |
| derivatives-of-inverse-trig-functions | 逆三角関数の導関数 ／ derivatives of inverse trigonometric functions | CED topic 3.4 |
| rectilinear-motion | 直線運動 ／ straight-line motion | CED topic 4.2 |
| candidates-test | 候補点テスト ／ candidates test | CED topic 5.5（規則 1 の例外: CED が名前を持つ） |
| curve-sketching | 曲線の概形 ／ curve sketching | OpenStax の本文 2 件 |
| inverse-hyperbolic-functions | 逆双曲線関数 ／ inverse hyperbolic functions | OpenStax の本文 9 件 |
| transcendental-function | 超越関数 ／ transcendental function | OpenStax の本文 6 件 |
| tangent-problem | 接線問題 ／ tangent problem | OpenStax の本文 5 件 |
| area-problem | 面積問題 ／ area problem | OpenStax の本文 6 件 |

## G. 統合と移動（201 行 → 137 エントリ）

`scripts/ledger/fix_decisions.py` の PHASE2B_* を `fix_phase1.py` の手順 9 が適用する。消した id は `ledger/id-changes.csv` に `merged-into`（symbols は `symbols/<id>`）・`to-phrases`・`renamed` で残る（69 行）。

### G-1. 同じ概念（18 行。うち 4 行は対象の単元の外）

| 統合した行 | 残したエントリ |
|---|---|
| relative-extrema | local-extremum |
| relative-maximum（Algebra 2） | local-maximum |
| higher-order-derivatives | higher-order-derivative |
| linearization、tangent-line-approximation | linear-approximation |
| diverges-to-infinity | diverge-to-positive-infinity |
| find-the-derivative | differentiate（動詞と動詞句を 1 つに。DECISIONS） |
| sketch-the-curve | sketch-the-graph |
| differentiate-both-sides-with-respect-to-x | differentiate-both-sides |
| e | base-of-the-natural-logarithm |
| derivative-of-e-to-the-x | derivative-of-the-exponential-function |
| derivative-of-natural-log | derivative-of-the-logarithm |
| precise-definition-of-a-limit | epsilon-delta-definition |
| limit-of-a-function | limit |
| constant-multiple（数II 微分の考えの「定数倍」） | constant-multiple-rule |
| derivatives-of-parametric-equations（AP Calculus BC Unit 9） | derivative-of-a-parametric-curve |
| composition-of-functions（Algebra 2） | composite-function |
| convergence-of-a-sequence（Calculus II） | convergence |

### G-2. 教科書の節の名前・CED の topic の名前（21 行）

| 節の名前の行 | 寄せた先 |
|---|---|
| using-derivatives-to-prove-inequalities、applying-derivatives-to-inequalities、derivatives-and-inequalities | increasing-and-decreasing（不等式の証明は h = 左辺 − 右辺 の増減を調べる。pitfalls に移した） |
| applying-derivatives-to-equations | number-of-real-solutions |
| optimization（最大・最小の応用） | optimization-problem |
| units-of-a-rate-of-change | rate-of-change |
| position-velocity-and-acceleration | velocity |
| connecting-f-f-prime-and-f-double-prime | curve-sketching（CED topic 5.9 を pitfalls に） |
| asymptotes-and-end-behavior | limit-at-infinity（end behavior を pitfalls に） |
| concavity-and-the-second-derivative、sign-of-the-second-derivative | concavity |
| differentiability-and-continuity | differentiability |
| types-of-functions | transcendental-function |
| limit-theorems、computing-limits | limit-laws |
| limit-notation | limit（lim の記法を latex と spoken_en に） |
| limit-involving-exponentials | base-of-the-natural-logarithm（e の定義の極限を latex に） |
| limit-of-a-piecewise-function | one-sided-limit |
| evaluate-limits-algebraically | find-the-limit（CED topic 1.6 の algebraic manipulation を pitfalls に） |
| notations-for-the-derivative | leibniz-notation |
| implicit-curves | implicit-function |

### G-3. 引数を入れただけの行・コロケーション（7 行）

approach-zero → approaches、use-the-chain-rule → chain-rule（collocation）、use-the-product-rule → product-rule（collocation）、apply-the-mean-value-theorem → mean-value-theorem（collocation）、zero-over-zero ／ infinity-over-infinity ／ infinity-minus-infinity → indeterminate-form（例文と pitfalls。候補表現には入れていない）。

### G-4. 改名・symbols・phrases 候補

- 改名 1: graph-of-a-cubic-function（三次関数のグラフ、節の名前）→ **cubic-function**（3 次関数）。中身の用語の行が台帳に無かった
- symbols へ 4: f-prime ／ f-double-prime → symbols/derivative-prime、d-y-d-x ／ d-d-x → symbols/derivative-leibniz（新設）
- phrases 候補へ 18（`ledger/phrases-candidates.csv`、`from` は空＝生成していない）: let-h-go-to-zero、the-tangent-line-passes-through、increasing-on-all-reals、converges-to-zero、divide-numerator-and-denominator-by-n、rationalize-and-take-the-limit、the-function-is-continuous、the-one-sided-limits-agree、take-the-log-and-differentiate、differentiate-the-outside-first、multiply-by-the-derivative-of-the-inside、f-double-prime-is-positive、changes-from-increasing-to-decreasing、the-derivative-is-zero、the-tangent-line-is-horizontal、continuous-but-not-differentiable、has-no-local-extrema、the-limit-exists

### G-5. 見出しの日本語・ja.alt を台帳から変えた語

- 見出し: 関数の増減と極値（節の名前）→ 第 1 次導関数判定法、第 2 次導関数テスト → 第 2 次導関数判定法、イプシロン・デルタ → ε-δ 論法、三角関数の極限（節の名前）→ sin x / x の極限、最大・最小 → 最大値・最小値、近似式 → 1 次の近似式、y' について解く → y′ について解く
- ja.alt から外した語（別の意味）: 対数関数の性質、接点の座標、関数の平均変化率、f′(x)=0 となる x
- 台帳の別概念の langlink 3 行を WIKI_WRONG に: 臨界点 → Critical point (thermodynamics)、発散 (ベクトル解析) → Divergence、法線ベクトル → Normal vector

## H. CED で確かめた主張

CED: College Board, *AP Calculus AB and BC Course and Exam Description*（Effective Fall 2020）。見出しの語が現れる TOPIC を `refetch.py ced-find` と count.ts の参照の件数（terms と同じ数え方）で確かめ、出典は `type: reference`、note に topic 番号。本文は写していない。**確かめたのは「その topic にその語が出る」ことで、文の意味まで読んだのは ε-δ（topic 1.2 の exclusion statement）だけ。**

68 語に CED を出典として付けた。topic の番号で主張を書いたのは次の語。

| エントリ | 主張 | CED |
|---|---|---|
| epsilon-delta-definition | AP の試験では問わない | topic 1.2 の exclusion statement（本文を読んで確かめた） |
| local-extremum | CED は local extrema と relative extrema の両方を使う | topic 5.2 に local extrema、Unit 5 の概要に relative extrema |
| local-maximum ／ local-minimum | CED も relative maximum ／ minimum と書く | Unit 5 の概要 |
| first-derivative-test | Unit 5 の各 topic で理由（justification）を求める | justify ／ justification が topic 5.1〜5.12 に出る |
| implicit-function | CED は implicitly defined function と書く | topic 3.2・5.12（implicit function は Unit 3 の概要に 1 件） |
| intermediate-value-theorem | topic 1.16 で扱う、IVT と略す | topic 1.16 |
| find-the-limit | 約分・有理化を algebraic manipulation と呼ぶ | topic 1.6 |
| rectilinear-motion | topic の名前は straight-line motion、rectilinear motion も使う | topic 4.2（8.2 にも rectilinear motion） |
| candidates-test | 閉区間の最大・最小を Candidates Test と呼ぶ | topic 5.5 |
| optimization-problem | optimization problems を topic 5.10・5.11 で扱う | topic 5.10・5.11 |
| curve-sketching | f・f′・f″ の関係を読み取る topic がある | topic 5.9 |
| related-rates | 独立した topic がある | topic 4.4・4.5 |
| lhopitals-rule | topic 4.7 で扱う | topic 4.7 |
| inflection-point | CED は point of inflection と書く | topic 5.6 |
| linear-approximation | linearization と local linearity を使う | topic 4.6 |
| differentiable | differentiability implies continuity | topic 2.4 |
| trapezoidal-rule（積分） | trapezoidal sum | topic 6.2 |
| integral-involving-absolute-value（積分） | integral of the absolute value | topic 8.6 |
| integration-by-long-division ／ completing-the-square（積分） | 手順として扱い、名前ではない | topic 6.10 |

日本側の主張は学習指導要領（平成30年告示）の本文で確かめた: 「ロピタル」は本文に 0 件（lhopitals-rule の pitfall）。

## I. パイプラインの変更

| 変更 | ファイル | 理由 |
|---|---|---|
| 規則 1・2（③ の決着）、首位だけ ①、1 ソース頼みの直し | `lib.ts`、`decide.ts` | 指示 1〜3 |
| CED ／ OpenStax の参照の件数（counts.json の `reference`） | `lib.ts`、`count.ts` | 指示 2 |
| probe --decide: ③ の決着、各候補の件数とソースの内訳 | `probe.ts` | 見出しを書く前に決めるため |
| 不規則な複数形（extrema、maxima、axes ほか 14 語）を語形変化としてまとめる | `lib.ts` | local extremum と local extrema が ② に割れた |
| 3 文字の語の語幹が 2 文字になる形を作らない | `lib.ts` | DNE が 18.06 の pivot dₙ（dn）に当たっていた（話 24 件 → 6 件） |
| normalize: L'Hôpital ／ L'Hopital ／ L'Hospital、字幕の dy/dx → dy dx | `lib.ts` | 同じ名前・同じ読みの綴りの違い |
| 規則 1 は CED が候補を使う語・英語の名前をそのまま見出しにした語に当てない | `lib.ts` | 「英語に決まった言い方がない」と誤って書かないため |
| 日付をマシンの日付に（`localDate`） | `scripts/lib/load.ts`、count ／ decide ／ crosscheck ／ export | UTC では夕方に翌日の日付になった |
| 台帳の手順 9（PHASE2B_*）、WIKI_WRONG 3 行 | `scripts/ledger/fix_phase1.py`、`fix_decisions.py` | G |
| テスト 17 件追加（計 83） | `tests/corpus.test.ts` | |

規則の変更で既存の語の判定が変わったのは、積分の単元の B・C の語と、axis-of-revolution の axis of rotation（書 7 → 9）、as-n-approaches-infinity の as n goes to infinity（話 79 → 78）の件数だけ（note を直した）。

## J. 気になっている点（Phase 5 の監査へ。直していない）

- **規則 1 に条件を 2 つ足した**（A）。指示の文面どおりなら LIATE と candidates-test は「英語に決まった言い方がない」になるが、英語の名前が実在するので誤り。条件は機械的に判定できる形（ja と en が同じ、CED が候補を使う）にした。人間の確認が要る
- **別の意味が混ざる件数**: approaches（話し言葉の ① goes to 27,241 件は「近づく」以外も含む）、bounded（the region bounded by …）、differential（differential equation）、divergence（ベクトル場の div、書き言葉の 194 件が Calculus Volume 3）、squeeze（squeeze theorem）、derivative-of-a-sum の sum rule（話し言葉は大半が 6.042 の和の法則）、product-rule（対数の product rule）、parameter（統計の母数）。判定はそのまま使い、pitfalls か note にそう書いた
- **見出しが日本語より狭い語**: find-the-asymptotes（find the vertical asymptotes）、derivative-of-the-exponential-function（derivative of e to the x）、derivative-of-the-logarithm（derivative of ln x）、radical-function（square root function）、is-monotonically-increasing（is increasing）。コーパスの ① に従い、mapping near と mapping_note で補った
- **en.term がどの register の首位でもない語**: limit-laws は話 ① limit properties、書 ② limit laws ／ properties of limits で、en.term は CED の呼び方で書き言葉の ② に入る properties of limits にした（register written）。積分の単元の accumulation-function・midpoint-riemann-sum・overestimate-and-underestimate も前回から同じ
- **動詞と動詞句を 1 エントリにした**（differentiate ← find-the-derivative）。Phase 1 の「品詞が違えば別」を名詞と動詞の区別と読んだ判断
- **対象の単元の外の行を 4 つ統合した**（G-1）。その単元を生成するときに、この統合を前提にする
- **不等式の証明の節（3 行）を increasing-and-decreasing に寄せた**。absolute-extrema（最小値 ≧ 0 を示す）に寄せる考え方もある
- **含む関係の二重数え**: 候補の一方が他方を中に含むと、同じ出現を 2 回数える（slope of the tangent ／ … line、sine x over x ／ the limit of sin x over x）。今回は候補の選び方で避けた。コロケーションは見出し語を含むのが前提なので、count.ts では直していない
- **③ の 5 語**（F-1）は候補の立て方しだいで決着するかもしれない（number-of-real-solutions、find-the-inflection-points は言い方の候補を増やしても 0〜1 件）
- **Phase 0 の sign-chart**: 新しい規則では CED（Unit 9 の概要）に sign chart があるので「参照で見出し」になり、en.register（both）を外すよう decide が出す。既存の語は飛ばす指示なので書き戻していない
- **1 ソース頼みの記録が多い**: 微分・極限の単元で 81 判定。多くは OpenStax Calculus だけが書き言葉で使う語で、抜くと ③ になるだけ
- **variants の note の内訳**: バッチ 3 で記憶で書いた内訳が 5 件間違っていた（probe の出力に直した）。そのあと 137 語すべての note を probe の出力と機械的に突き合わせて一致を確かめた
- 前の修正で数B 統計的な推測の term_refs に probability-density-function が入っていなかったので、今回足した
- 台帳の en_alt に節の名前「graph of a cubic function」が残る（改名で旧 en が en_alt に入る仕組み）。エントリには入れていない

## K. DECISIONS に足した行

`docs/DECISIONS.md` の「Phase 2 規則の修正（③・1 ソース頼み・リーマン和）」12 行と「Phase 2 微分・極限の単元」24 行。STYLE.md の原則 1 と追記欄、CLAUDE.md の絶対ルール 9 を新しい規則に合わせた。ledger/README.md に手順 9 を足した。

## L. 確認

```
python3 scripts/ledger/fix_phase1.py         # 手順 8: 14 ／ 11 ／ 1 ／ 13、手順 9: same 18 ／ section 21 ／ instance 7 ／ rename 1 ／ symbols 4 ／ phrases 18
pnpm corpus:count && pnpm corpus:decide -- --write --units <積分の 8 単元> --ids symbols/integral-definite,symbols/derivative-prime,symbols/derivative-leibniz,<微分・極限の 137 語>
                                              # 主見出し決着 179 ／ 併記 44 ／ 決まった言い方なし 8 ／ 参照で見出し 27 ／ 判断不能 15 ／ 不一致 0、書き戻し 225 件
pnpm crosscheck -- --write                   # 68/68 一致（10 タイトルを新たに取得、58 cached）
pnpm exec tsc --noEmit                       # 緑
pnpm validate                                # terms 232 / symbols 6 / phrases 5 / conventions 3 / curriculum 165、警告 0
pnpm spell                                   # 418 ファイル、0 件
pnpm test                                    # 83/83
pnpm build                                   # 241 ページ、export: terms.json 230（draft 2 を除く）
```

decide の全体の数（主見出し決着 179 など）は、既存の語（Phase 0 のサンプル、symbols、phrases）も含む。判断不能 15 の内訳は、今回の範囲 7（積分 2・微分 5）と既存 8（am-gm-inequality、symbols 2、phrases 5）。
