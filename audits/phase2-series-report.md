# Phase 2 レポート — 汎用語・Phase 0・残った ③ の直しと、数列・級数・多変数の単元（143 語）

作成: 2026-09-24 ／ 対象: d6b79ae（Phase 2 calculus report）→ 本コミット
指示: audits/phase2-calculus-report.md を受けて 1〜3 を直し、4 で AP Calculus AB Unit 7・BC Unit 9・10、Calculus II ／ III の全単元、数B 数列、数C 平面上の曲線と複素数平面に進む。判断は `docs/DECISIONS.md` の「Phase 2 数列・級数の単元の前の修正」（20 行）と「Phase 2 数列・級数・多変数の単元」（25 行）。

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified に上げた語はない。

## まとめ

- **1. 汎用語を数学の文の形で数え直した**（A）。形は `scripts/corpus/lib.ts` の `TERM_FORMS` に置き、symbols の読みのパターンと同じく evidence のキーも形にした。判定が変わったのは 2 語: **approaches**（話し言葉 ① goes to 26,571 件 → ② as … approaches 1,286 ／ as … goes to 442 ／ as … tends to 15）と **squeeze**（squeeze … between ／ sandwich … between で話・書とも ③ → 人間レビュー）。bounded・differential・divergence・parameter は形で数えても同じ判定。sum rule・product rule は別の意味の規則も同じ構文で呼ぶので形では分けられない
- **2. Phase 0 のサンプルに新しい規則を当てた**（B）。判定が変わったのは 代入する（話 ② → ① plug in）、微分係数（話 ① は f prime of a、書 ③）、増減表（③ → CED Unit 9 の sign chart）、はさみうちの原理（sandwich theorem を数えて話 ① squeeze theorem）。√ と Σ の読みはパターンにして ③ → ①。**米国側の主張 19 か所**を CED ／ OpenStax ／ コーパスの件数で確かめ、確かめられないもの（減点されない、通じない、英国寄り、一番よく使う…）を消すか確かめた範囲に弱めた。sign-chart の「減点はまずされない」は CED の Unit 9 の概要の記述（sign chart は答えを見つける道具になるが、理由の点には定義・定理との結びつきが要る）に置き換えた
- **3. 残った ③ 7 語をあなたの決定どおりにした**（C）。3 語は out-of-scope.csv（beyond-v1）、4 語は見出しを直して reviewed.human に日付を入れた。③ のままの 3 語は decide が corpus-human-settled を付け、人間レビューに戻さない。convergence-of-improper-integrals は新しい見出し the integral converges が OpenStax の本文に当たり、参照で決着した
- **4. 数列・級数・多変数の単元に進んだ**（D〜F）。台帳の 185 行に今までの規則を先に当てて 143 エントリにし、50 ／ 50 ／ 43 の 3 バッチで生成・検証・コミットした。**likely 140 ／ draft 3**。③ は **各バッチ 1 語**（locus、nth-roots-of-unity、argument-of-a-complex-number。2.0% ／ 2.0% ／ 2.3%）で、1 割を超えたバッチはない。英語に決まった言い方がない 6、参照で見出し 13、register 不一致 0。台帳は 2,250 行 → 2,199 行
- 生成中に数え方の穴を 2 つ見つけて直した（G）: OpenStax の MathML で「nth」が「n th」に割れていた（書き言葉 138 件）、字幕のハイフンなし（p series ／ vector valued ／ term by term ／ first order）
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて緑（validate 警告 1 件＝divergence の en.term が 2 語で同じ、意図したもの。spell 0 件、test 87/87、build 380 ページ、export の terms は 369 件＝draft 3 件を除く）。crosscheck 123/123 一致

## A. 汎用語の数え直し（指示 1）

実装: `TERM_FORMS`（エントリ id → エントリの言い方 → 数える形）。`candidatesOf`・count.ts の見出し・decide.ts の `recordedAt` と「エントリ側で直すこと」の比較が形を通す。CED・OpenStax の参照も形で探す（語のままで探すと、はさむ動詞 squeeze が CED topic 1.8 の squeeze theorem で決着してしまう）。テスト 4 件（計 87）。

| 語 | 数えた形 | 話 ／ 書 | 前の判定 | 形での判定 | 直したか |
|---|---|---|---|---|---|
| approaches | as … approaches ／ as … goes to ／ as … tends to | 1,286・442・15 ／ 201・13・4 | 話 ① goes to、書 ① approaches | 話 ② 3 つ（首位の 1,006 件が Khan Academy）、書 ① approaches | **直した**（register both、variants を頻度順） |
| squeeze（はさむ） | squeeze … between ／ sandwich … between | 1・4 ／ 0・0 | 話 ① squeeze、書 ① | 話・書とも ③。CED・OpenStax にも形が無い | **直した**（register を外し、corpus-undecided） |
| bounded（有界） | 名詞と組む形（bounded sequence ／ sequence … bounded ／ bounded interval ／ bounded set ／ bounded function）、話し言葉は is bounded も | 話 is bounded 16 ／ 書 56 | ①① | ①① | 変わらない |
| differential（微分 dy） | differential of ／ differential dy ／ differential dx | 36 ／ 14 | ①① | ①① | 変わらない |
| divergence（発散） | convergence or divergence | 20 ／ 17 | ①① | ①① | 変わらない |
| parameter（媒介変数） | parameter t ／ eliminate the parameter | 15 ／ 73 | ①① | ①① | 変わらない |
| sum rule（和の微分） | 形で分けられない | 24 ／ 29 | ①① | — | 変わらない（話し言葉の 19 件は 6.042 の和の法則、書き言葉の 16 件は 6.042 のテキスト。1 ソース頼みの記録は残る） |
| product rule（積の微分） | 形で分けられない | 346 ／ 165 | ①① | —（対数・指数の構文 29 件を除いても ①） | 変わらない |

- 指示の「… tends to」は as … tends to にした。先頭の「…」は数え方の上で制約にならず、tends to と同じ件数（書き言葉 68 件のうち 31 件が統計の「傾向がある」）になるため。ほかの 2 つと同じ構文にそろえた（DECISIONS）
- bounded の書き言葉の is bounded は the region is bounded above by … が多いので使わなかった。話し言葉の is bounded は手元で文脈を見るとほぼすべて有界の意味だった
- TERM_FORMS に入れたのは判定が変わった 2 語だけ。変わらない語の evidence は語のままの件数で、pitfalls の「別の意味も含まれる」の注意はそのまま

## B. Phase 0 のサンプル（指示 2）

### B-1. 新しい規則での判定（terms 10・symbols 5・phrases 5）

| 語 | 前 | 今 | エントリで直したこと |
|---|---|---|---|
| substitute（代入する） | 話 ② plug in ／ substitute ／ substitute back | 話 ① plug in（3.6:1。Professor Leonard を抜くと ② だが首位は同じ）、書 ① substitute | 件数を今の数え方に（1,403 → 1,405 など） |
| derivative-at-a-point（微分係数） | ①（register both） | 話 ① f prime of a（Khan 17/19）、書 ③ | f prime of a を話し言葉の variant に、en.register を外した |
| sign-chart（増減表） | ③（corpus-undecided） | ③ → CED の呼び方 sign chart（Unit 9） | en.register を外した |
| squeeze-theorem | ①① | ①①（sandwich theorem を数えて話 15 対 7） | en.uk → 話し言葉の variant |
| am-gm-inequality | ③ | ③（候補 0 件、CED・OpenStax にも無い） | en.register を外した。人間レビューのまま |
| completing-the-square ほか 5 語 | ① ／ ② | 同じ | 件数の記述だけ |
| symbols/square-root | ③ | ① the square root of *（1,408 件） | 読みをパターンに（SYMBOL_PATTERNS） |
| symbols/summation-sigma | ③ | ① the sum from * to * of（52 対 9） | 同上 |
| phrases 5 語 | ③ | ③（文をそのまま数えるので 0 件） | 人間レビューのまま |

### B-2. 確かめて直した米国側の主張

| エントリ | 前の主張 | 今 | 根拠 |
|---|---|---|---|
| sign-chart（mapping_note） | 答案に増減表を書いても減点はまずされない | CED は sign chart を答えを見つける道具とするが、理由の点には定義・定理との結びつきを求める。答案は f′ の符号の変化と定理の名前で理由を書く | CED Unit 9 の概要 |
| sign-chart（mapping_note） | 米国では定型として教えない／sign chart で示すのが普通 | この表に当たる定型の表は CED にも OpenStax Calculus にも出てこない。判断は first derivative test | CED topic 5.4・コーパス（sign chart は 0 件） |
| sign-chart（pitfalls） | increase-decrease table は通じない／convex upward は通じにくい | どちらも用例コーパス・CED・OpenStax に 0 件。Khan は concave upward（112 件） | コーパス・CED topic 5.6 |
| sign-chart（pitfalls） | absolute または global をつける | absolute maximum ／ minimum（CED・OpenStax）。global は少ない | CED Unit 5（absolute extrema）、コーパス 25・99 対 6・10 |
| am-gm-inequality | 米国の標準的な高校課程では扱いが薄く、競技数学や大学の授業で出てくることが多い／等号成立条件を書く習慣は米国でも同じく必要 | 用例コーパス（OpenStax 6 冊を含む）にも CED にも 0 件。後半は削除 | コーパス・CED |
| completing-the-square | 米国では vertex form と呼び、その名前のほうが授業でよく出る | OpenStax Algebra and Trigonometry は standard form と呼び vertex form とも言う。授業では vertex form 35 件（completing the square は 145 件） | OpenStax の本文・コーパス |
| derivative-at-a-point | 米国では独立した名詞を立てない／f prime of a と読むことが多い／differential coefficient は英国の古い教科書の語 | the derivative at a point（CED topic 2.3）。f prime of a は 19 件（Khan 17）。differential coefficient は 0 件（英国については削除） | CED・コーパス |
| discriminant ／ quadratic-formula | 米国の教室では b²−4ac をそのまま書くことが多い | OpenStax（Algebra and Trigonometry・Calculus）は判別式に文字を置かず b² − 4ac と書く | OpenStax の本文（D = b²−4ac の形は 0 件） |
| find-a-common-denominator | 英語は動詞句で言う | 動詞句ごとの件数（21 ／ 22 ／ 7）を添えた | コーパス |
| move-term-to-other-side | transposition は使わない（通じない）／どちらも通じる | 移項の意味の transposition は 0 件（18.01 に別の意味で 1 件）。「通じる」は削除 | コーパス |
| squeeze-theorem | sandwich theorem は英国寄り、米国の教科書はほぼ squeeze theorem | CED topic 1.8 と OpenStax は squeeze theorem、sandwich theorem は Khan の講義に 7 件 | CED・OpenStax・コーパス |
| substitute | 件数（1,403 対 361 ほか） | 今の数え方の件数（1,405 対 391 ほか） | コーパス |
| symbols/derivative-prime | f dash は米国では通じにくい | f dash は 0 件 | コーパス |
| symbols/power-squared | x to the n plus one は曖昧なので to the power ／ to the quantity と言う | x to the n plus one が普通（125 件）。to the power n plus one は 1 件、to the quantity は 0 件 | コーパス |
| symbols/square-root | the quantity と言う | 言うことがある（3 件、MIT OCW） | コーパス |
| symbols/summation-sigma | a k でも通じる／the summation sign とも言う | a sub k は 14 件。the summation sign は 0 件 | コーパス |
| phrases/class-asking-repeat | 授業中に一番よく使う | 削除 | 確かめられない |
| phrases/written-solution-therefore | 米国の答案では so で十分な場面が多い | 削除（therefore ／ hence より口語的、だけ） | 確かめられない |
| conventions/inequality-symbols | ≦ は見慣れないが通じる／手書きでは ≤ に寄せる | OpenStax 6 冊と CED に ≦ ≧ は無い（≤ は OpenStax 2,830 回、CED 27 回） | OpenStax・CED |
| conventions/slope-intercept-form | 授業で区別して使う | OpenStax が slope-intercept ／ point-slope ／ standard form と呼び分ける。授業でも 20 ／ 25 件 | OpenStax・コーパス |
| conventions/therefore-because-symbols | 記号としてはほとんど書かない／読み手によっては ∴ を知らない | OpenStax 6 冊で ∴ 2 回・∵ 0 回、CED では 0 回。後半は削除 | OpenStax・CED |

同じ種類の主張（「通じない」）が Phase 2 の 4 語（one-sixth-formula・concavity・riemann-sum・shell-method）、make-a-sign-chart、symbols/derivative-leibniz にもあったので、件数の事実に書き換えた。STYLE.md の直訳禁止リスト（はさみうち）と追記欄（凹凸・増減表・エフ ダッシュ）も直し、「米国では〜」は確かめた範囲で書くこと、汎用語は形で数えることを追記した。

## C. 残った ③ 7 語（指示 3）

| id | あなたの決定 | 実施 | 今の判定 |
|---|---|---|---|
| rationalizing-substitution ／ differential-operator ／ implicit-function-theorem | out-of-scope（beyond-v1） | 台帳の手順 10（PHASE2C_OUT_OF_SCOPE）、エントリを削除、curriculum の term_refs と trigonometric-substitution の related から外した | — |
| convergence-of-improper-integrals | en.term the integral converges、en.alt convergence of an improper integral | 直した | ③ → OpenStax の呼び方（本文 3 件）で決着 |
| number-of-real-solutions | そのまま、en.alt how many real solutions | 足した | ③（0 件）→ corpus-human-settled |
| prime-notation | そのまま、en.alt Lagrange's notation | en.alt に既にあったので変えていない | ③（9 件）→ corpus-human-settled |
| find-the-inflection-points | en.term find the points of inflection（CED）、en.alt find the inflection points | 直した。CED topic 5.6 を出典に | ③（1 件）→ corpus-human-settled |

人間が決めた ③ の印には、スキーマにある `reviewed.human`（日付）を使った。decide は ③ のままでも reviewed.human があれば corpus-undecided ではなく corpus-human-settled を付け、レポートの「人間が決めたもの」節に出す（人間レビュー行きには戻さない）。confidence は変えていない。
規則 1 の 2 つの条件と differentiate への統合の了承は DECISIONS に記録した。

## D. 台帳の振り分け（185 行 → 143 エントリ）

`scripts/ledger/fix_decisions.py` の PHASE2C_* を `fix_phase1.py` の手順 10 が適用する（ledger/README に追記）。消した id と改名は `ledger/id-changes.csv` に残る（53 行: merged-into 43、to-phrases 5、out-of-scope 3、renamed 2）。

### D-1. 同じ概念（9 行）
conic → conic-section（二次曲線、円錐曲線は ja.alt）、sum-formula → summation-formulas、evaluate-the-sum → find-the-sum、sum-of-the-first-n-terms → partial-sum、**series → infinite-series（既存、級数を ja.alt）**、separable-equation → separable-differential-equation（既存）、exponential-growth-and-decay-models → exponential-model、logistic-equation → logistic-differential-equation（既存）、three-dimensional-coordinate-system → coordinates-in-space

### D-2. 節の名前（17 行）
verifying-solutions → differential-equation（CED 7.2 を pitfalls に）、convergence-and-divergence → convergence、strategy-for-testing-series → infinite-series、estimating-the-sum-of-a-series → sum-of-the-series、extrema-of-functions-of-two-variables → local-extremum（Calculus III と鞍点を足した）、double-integrals-in-polar-coordinates → double-integral、representing-a-function-as-a-series ／ operations-on-power-series → power-series、approximating-functions → taylor-polynomial、arc-length-of-a-parametric-curve ／ arc-length-in-polar-coordinates → arc-length-of-a-curve（CED 9.3 と OpenStax Vol 2 を出典に）、polar-equations-of-conics → polar-equation、translated-conics → standard-form-of-a-conic、conics-and-lines → conic-section、product-and-quotient-of-complex-numbers → polar-form、geometry-with-complex-numbers → complex-plane、lines-and-planes-in-space → equation-of-a-plane

### D-3. 引数を入れただけの行・問いの形（15 行）
write-in-sigma-notation → summation-notation（コロケーション）、form-an-arithmetic-sequence → arithmetic-sequence、write-in-polar-coordinates → polar-coordinates、write-in-polar-form ／ find-the-modulus-and-argument → polar-form、convert-to-rectangular-coordinates → rectangular-coordinates、find-the-foci → focus、find-the-eccentricity → eccentricity、represent-the-complex-number-as-a-point → complex-plane、take-the-argument → argument-of-a-complex-number、distance-between-two-complex-numbers → modulus-of-a-complex-number、the-figure-traced-by-z → locus、condition-to-be-purely-imaginary → pure-imaginary-number、condition-to-be-real → complex-conjugate、rotate-about-the-origin → rotate

### D-4. 改名・symbols・phrases 候補・後の単元の行
- 改名 2: normal-and-binormal-vectors → unit-normal-vector（主法線ベクトル）、velocity-and-acceleration-vectors → velocity-vector（速度ベクトル）
- symbols へ 2: sigma → summation-sigma、del → **nabla（新設）**
- phrases 候補へ 5: assume-it-holds-for-n-k、it-also-holds-for-n-k-1、the-common-ratio-is-less-than-1、multiply-by-r-and-subtract、find-the-pattern
- 寄せ先としてこの単元で生成した後の単元の行 6: locus・pure-imaginary-number・complex-conjugate・rotate（中学・数II）、coordinates-in-space・equation-of-a-plane（数C ベクトル）

## E. 生成語数と判定

| | 語数 | likely | draft | ③ | 決まった言い方なし | 参照で見出し | register 不一致 |
|---|---|---|---|---|---|---|---|
| バッチ 1（1de1849） | 50 | 48 | 2 | 1 | 3 | 5 | 0 |
| バッチ 2（8063059） | 50 | 49 | 1 | 1 | 1 | 6 | 0 |
| バッチ 3（5c02e26） | 43 | 43 | 0 | 1 | 2 | 2 | 0 |
| 計 | **143** | **140** | **3** | **3** | **6** | **13** | **0** |

判定（143 語 × 2 register）: 話し言葉 ① 87・首位だけ ① 1・② 2・①→② 1・③ 52 ／ 書き言葉 ① 106・首位だけ ① 3・② 4・①→② 2・③ 28。①→② は recurrence-relation（書: OpenStax Algebra and Trigonometry を抜くと recurrence equation が首位）、partial-sum（書: OpenStax Calculus を抜くと sum of the first n terms が首位）、vector-valued-function（話: Professor Leonard を抜くと vector-valued function が首位）。1 ソース頼みの記録 123 判定。

draft 3: inductive-hypothesis・base-case（英語は固有の用語だが OpenStax にも Wikipedia にも無く、コーパスは MIT 6.042 だけ）、nth-roots-of-unity（OpenStax にも Wikipedia にも無い）。

symbols は nabla を新設（読み del f ／ the gradient of f、話し言葉 ② 16 ／ 12）。

## F. ③・決まった言い方なし・参照で見出し

### F-1. ③（人間レビュー行き、3 語）

| id | 見出し（ja ／ en） | mapping | 話 | 書 | 見立て |
|---|---|---|---|---|---|
| locus | 軌跡 ／ locus | exact | 0 | 0 | locus はコーパスに 0 件。OpenStax は the set of all points … と定義する |
| nth-roots-of-unity | 1 の n 乗根 ／ nth roots of unity | exact | 0 | 2 | draft。OpenStax は一般の複素数の n 乗根として扱う |
| argument-of-a-complex-number | 複素数の偏角 ／ argument | exact | 1 | 1 | 関数の引数の意味を除く形で数えると 1 件。語のままなら MIT 18.03 と OpenStax が偏角の意味でも使う |

これで decide の判断不能は 10 件（上の 3 語、squeeze、am-gm-inequality、phrases 5）。

### F-2. 英語に決まった言い方がない（6 語）
sequence-of-differences（階差数列）・grouped-sequence（群数列）・system-of-recurrences（連立漸化式）・polar-angle（偏角、極座標の θ）・arithmetic-middle-term（等差中項）・geometric-middle-term（等比中項）

### F-3. 参照で見出しを決めた（13 語）

| id | 見出し | 根拠 |
|---|---|---|
| summation-formulas | summation formulas | OpenStax の本文 1 件 |
| write-out-the-first-few-terms | write out the first few terms | OpenStax の本文 4 件 |
| shift-the-index | reindex | OpenStax の本文 2 件 |
| limit-of-a-sequence | limit of a sequence | OpenStax の本文 8 件 |
| coordinates-in-space | three-dimensional coordinate system | OpenStax の本文 6 件 |
| area-in-polar-coordinates | area of a polar region | CED topic 9.8 |
| derivatives-in-polar-form | differentiating in polar form | CED topic 9.7 |
| conditional-convergence | conditional convergence | CED topic 10.9 |
| alternating-series-error-bound | alternating series error bound | CED topic 10.10 |
| lagrange-error-bound | Lagrange error bound | CED topic 10.12 |
| term-by-term-differentiation | term-by-term differentiation | CED topic 10.13・10.15 |
| function-of-several-variables | function of several variables | OpenStax の節の名前 |
| multivariable-chain-rule | generalized chain rule | OpenStax の本文 7 件 |

## G. CED で確かめた主張

CED（2020 年版）で見出しの語が現れる topic を count.ts の参照の件数と `refetch.py ced-find` で確かめ、出典は `type: reference`、note に topic 番号。**確かめたのは「その topic にその語が出る」ことで、文を読んだのは sign chart（Unit 9 の概要）、nth term test for divergence（10.3）、absolutely convergent（10.9）、exponential growth and decay（7.8）だけ。**

新しい 143 語のうち 36 語に CED を出典として付けた: partial-sum（10.1）、converge ／ diverge（10.1–10.9）、consecutive-terms（successive terms 10.2）、polar-coordinates（9.7–9.9）、polar-equation（9.7）、rectangular-coordinates（9.8）、slope-field（7.3）、separation-of-variables（7.6・7.7）、particular-solution（7.7・7.8）、initial-condition（7.7–7.9）、exponential-model（7.8）、vector-valued-function（9.4–9.6）、area-in-polar-coordinates（9.8・9.9）、derivatives-in-polar-form（9.7）、nth-term-test（10.3）、integral-test（10.4）、harmonic-series ／ p-series（10.5）、comparison-test ／ limit-comparison-test（10.6）、alternating-series ／ alternating-series-test（10.7）、ratio-test（10.8）、absolute-convergence ／ conditional-convergence（10.9）、alternating-series-error-bound（10.10）、taylor-polynomial（10.11）、lagrange-error-bound（10.12）、power-series ／ radius-of-convergence ／ interval-of-convergence（10.13–10.15）、taylor-series ／ maclaurin-series（10.14）、term-by-term-differentiation（10.13・10.15）、velocity-vector（9.6）。既存では arc-length-of-a-curve（8.13・9.3）、derivative-at-a-point（2.3）、find-the-inflection-points（5.6）、sign-chart（Unit 9・5.4・5.6）、squeeze-theorem（1.8）。

topic 番号で主張を書いたもの: nth-term-test「CED は nth term test for divergence と呼ぶ（10.3）」、absolute-convergence「CED は absolutely convergent と converges absolutely を使う（10.9）」、slope-field「CED は slope field（7.3）」、area ／ derivatives in polar・誤差限界の 2 語・term-by-term「CED の呼び方を見出しにした」、differential-equation「解の確かめを CED は verifying solutions として扱う（7.2）」、arc-length-of-a-curve「媒介変数表示の曲線の長さは CED topic 9.3」。

## H. パイプラインの変更

| 変更 | ファイル | 理由 |
|---|---|---|
| TERM_FORMS（汎用語を形で数える。evidence のキーも形） | `lib.ts`、`count.ts`、`decide.ts` | 指示 1。新しい語でも focus・pole・curl・divergence（ベクトル場）・standard form・arithmetic ／ geometric mean・modulus・argument に使った |
| 記号の読みのパターン 2 つ（√、Σ） | `lib.ts` の SYMBOL_PATTERNS | 指示 2 |
| reviewed.human のある ③ に corpus-human-settled | `decide.ts` | 指示 3 |
| symbols ／ phrases の corpus-undecided の note に参照のことを書かない | `decide.ts` | 参照を見るのは terms だけ |
| normalize: 「n th」→「nth」、p series ／ vector valued ／ term by term ／ first order・second order のハイフン | `lib.ts` | OpenStax の MathML の割れ（138 件）、字幕の表記ゆれ |
| 台帳の手順 10（PHASE2C_*、out-of-scope） | `fix_phase1.py`、`fix_decisions.py`、`ledger/README.md` | D |
| テスト 4 件（計 87） | `tests/corpus.test.ts` | TERM_FORMS と記号のパターン |

normalize の変更で evidence が今の数え方と食い違った既存の語は nth-derivative（書き言葉 5 → 7、判定は ③ のまま）だけで、書き戻した（OpenStax Calculus Volume 1 に出るので出典にも足した）。

## I. 気になっている点（Phase 5 の監査へ）

- **「… tends to」を as … tends to に読み替えた**（A）。指示の文面と違う。理由は DECISIONS。as … tends to は 15 件で話し言葉の ② に入る
- **形の選び方には判断が入る**。bounded の話し言葉だけ is bounded を使った、focus は focus of the、pole は the pole（それでも MIT 18.03 の複素関数の極が 15 件混ざる）、argument は argument of … complex number（1 件しかなく ③）。どれも「別の意味が入れない形」を狙ったが、形を変えれば判定が変わる語がある（argument、squeeze）
- **sum rule の話し言葉の ①** は 6.042 の和の法則に支えられている（形では分けられない。1 ソース頼みの記録のみ）
- **reviewed.human を「人間が ③ の見出しを決めた」印に使った**（C）。スキーマの項目の意味を広げているので確認が要る
- **後の単元の行を 6 つ先に生成した**（D-4）。その単元（数II 図形と方程式・複素数と方程式、中1 平面図形、数C ベクトル）を生成するとき、find-the-locus・take-the-conjugate・center-of-rotation などが同じ単元に残っている。rotation の related の center-of-rotation は未生成なので張っていない
- **冠詞だけ違う言い方は 1 つだけを候補にした**。equation-of-a-plane は件数の少ない a のほうを見出しにした（the は話 3 ／ 書 21、a は 1 ／ 17）。どちらでも判定（書き言葉 ①）は同じ
- **参照で決めた見出しに動名詞句がある**: derivatives-in-polar-form（名詞の「極曲線の微分」）の見出しが differentiating in polar form（CED topic 9.7 の名前）
- **set-up-a-recurrence の見出し write a recursive formula は OpenStax Algebra and Trigonometry だけの言い方**（15 件すべて）。文章題から漸化式を立てる意味との違いを mapping near で書いた
- **characteristic-equation の件数の多くは微分方程式の特性方程式**（MIT 18.03・OpenStax Vol 3）。数B の α = pα + q を英語でこの名前で呼ぶ例は確かめられなかったので mapping near
- **divergence の en.term が 2 語で同じ**（発散〔数列〕と発散〔ベクトル場〕）。validate の警告 1 件として残した
- **Phase 0 の am-gm-inequality の level.us（Precalculus、Discrete Math）** は OpenStax にも CED にも無く確かめられない。本文の主張ではないので直していない
- **fibonacci-sequence の見出しは複数形 Fibonacci numbers**（コーパスの首位。多くは MIT の講義と講義ノート）
- **function-of-several-variables** は下位の言い方 function of two variables（10 ／ 132 件）を候補に入れず、OpenStax の節の名前を見出しにした
- 文脈を手元で表示して読んだ（DECISIONS）。本文はファイルに残していない

## J. DECISIONS に足した行

`docs/DECISIONS.md` の「Phase 2 数列・級数の単元の前の修正（汎用語・Phase 0・残った ③）」20 行と「Phase 2 数列・級数・多変数の単元」25 行。STYLE.md の直訳禁止リストと追記欄を直し、2 行足した。ledger/README.md に手順 10 を足した。

## K. 確認

```
python3 scripts/ledger/fix_phase1.py         # 手順 10: same 9 ／ section 17 ／ instance 15 ／ rename 2 ／ symbols 2 ／ phrases 5 ／ out of scope 3
pnpm corpus:count && pnpm corpus:decide -- --write --ids <各バッチの語と、書き戻した既存の語>
                                              # 最後の実行: 主見出し決着 296 ／ 併記 55 ／ 決まった言い方なし 14 ／ 参照で見出し 41 ／ 人間が決めた 3 ／ 判断不能 10 ／ 不一致 0 ／ エントリ側で直すこと 0
pnpm crosscheck -- --write                   # 123/123 一致（20 タイトルを新たに取得、103 cached）
pnpm exec tsc --noEmit                       # 緑
pnpm validate                                # terms 372 / symbols 7 / phrases 5 / conventions 3 / curriculum 165、警告 1（divergence）
pnpm spell                                   # 559 ファイル、0 件
pnpm test                                    # 87/87
pnpm build                                   # 380 ページ、export: terms.json 369（draft 3 を除く）
```

取得（Wikipedia の langlink）は crosscheck.ts の既存の作法どおり、まとめて（50 タイトル／リクエスト）、タイムアウト 30 秒・リトライ 3 回、進捗は done/total、キャッシュ（corpus/cache/crosscheck.json）して足りない分だけ取った。CED・OpenStax・用例コーパスは取得済みのものを使い、新しい取得はしていない。
