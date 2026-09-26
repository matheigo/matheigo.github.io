# Phase 3 記号 — 記号の前の修正 1〜5 と、記号の生成（バッチ 1〜3、止めた）

作成: 2026-09-25 ／ 対象: 907098d（Phase 3 の準備）→ 本コミット
指示: audits/phase3-prep-report.md を受けた 1〜6。判断は `docs/DECISIONS.md` の「Phase 3 記号の前の修正」と「Phase 3 記号の生成」。

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified の語は 0。

## まとめ

- **1**: Geometry に Relationships within triangles（14 語）と Quadrilaterals（13 語）の 2 単元を足した（CK-12 Geometry 4.19〜4.26、5.7〜5.19・5.27〜5.28）。D-1 の Geometry の none 47 語のうち 19 語が入った
- **2**: symbols は 220 のまま。level の「小学校」14 行を中1 に寄せた。慣習差と重なる 71 行に related 列を足した。**スキーマ変更**: symbols と conventions に任意項目 `related` を足した（指示の「related で結ぶ」のため。下の D-1）
- **3**: conventions **130 → 121**（語彙だけの違い 8 行を外す、名前を付ける 14 行 → 3 行、付録 B の 10 行を足す）
- **4**: phrases **320 → 267**（同じ意図 8 組をまとめる、断片 9・同じ意図の terms がある 29・確かめられない日本の問題文の型 2・製品名 3 を外す、exam-clarify-instruction を 1 つの意図に）
- **5**: MICASE を phrases だけに数える仕組みを作った（terms・symbols の件数と重みには入らない）。**ただし書き起こしは取れていない**: TalkBank が MICASE の zip・フォルダ・.cha のすべてにサインインを求めるため（私はサインインしない）。phrases の ③ 2 件は MICASE なしのまま ③
- **6**: 記号を 3 バッチ生成した（**新しい記号 139**、likely 125 ／ draft 14）。③ はバッチ 1 が 4 ／ 50、バッチ 2 が 2 ／ 50、**バッチ 3 が 16 ／ 50 で 1 割を超えたので、バッチ 4 に進まず止めた**。残りの 70 行（151〜220 行）は未生成
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて終了コード 0（H）

## A. 1〜5 の結果

### A-1. Geometry の 2 単元

| 単元 | id | 語 | CK-12 Geometry | jp_equivalents |
|---|---|---|---|---|
| Relationships within triangles | us-geometry-relationships-within-triangles | midsegment-theorem・perpendicular-bisector・angle-bisector・concurrent・the-five-centers-of-a-triangle・circumcenter・incenter・centroid・orthocenter・excenter・median-of-a-triangle・exterior-angle-bisector・side-angle-inequality・triangle-inequality（14） | 4.19 Midsegment Theorem〜4.26 Triangle Inequality Theorem | 数学A 図形の性質（most）、中3 相似な図形（some、中点連結定理） |
| Quadrilaterals | us-geometry-quadrilaterals | polygon・sum-of-the-interior-angles・sum-of-the-exterior-angles・quadrilateral・parallelogram・conditions-for-a-parallelogram・opposite-side・opposite-angle・diagonal・rectangle・rhombus・square-shape・trapezoid（13） | 5.7 Quadrilateral Classification〜5.19、5.27〜5.28（多角形の内角・外角） | 中2 三角形と四角形（most）、中2 平行と合同（some、多角形の角の和） |

- D-1 の Geometry の none 47 語のうち入った 19 語: centroid・concurrent・conditions-for-a-parallelogram・diagonal・excenter・exterior-angle-bisector・median-of-a-triangle・orthocenter・parallelogram・quadrilateral・rectangle・rhombus・side-angle-inequality・square-shape・sum-of-the-exterior-angles・sum-of-the-interior-angles・the-five-centers-of-a-triangle・trapezoid・triangle-inequality。残りの 28 語は集合・論理・日本だけの内容（チェバ・メネラウス・三垂線・アポロニウスの円ほか）で、2 単元の中身ではない
- 既に別の単元にある語（外心・内心・中点連結定理・垂直二等分線・角の二等分線・対辺・対角・多角形）も両方に入れた（1 語 1 単元にしていない。Phase 3 の準備 D-1 と同じ）
- どの語も level.us に Geometry があった。チェバ・メネラウスは CK-12 にも IM にもないので入れていない
- scripts/ledger/curriculum_spec.py にも 2 単元を足した。curriculum は 161 → 163

### A-2. symbols の台帳

- 220 行のまま（水増しなし）。level の「小学校」は 14 行 → 0（中1 に寄せ、中1 と重なる行は 1 つに。中1 の行は 36 → 42）
- 慣習差と重なる行に `related` 列（conventions の id）を付けた: **71 行**（∴ ∵ → therefore-because-symbols、∎ → end-of-proof-marker、log x・ln x・数III の log x → log-and-ln、≦ ≧ → inequality-symbols、∽ ≡、ₙPᵣ ₙCᵣ ₙHᵣ、sec csc cot、逆三角関数、区間、片側極限、補集合、⌊x⌋ とガウス記号、付録 B の新しい 10 行 ほか）
- 記号の notes は読み方と書き方だけにし、違いの説明は related の慣習差に任せた（生成した記号でもそうした）
- id が重なった 4 組は慣習差の側を改名: base-n-subscript → base-n-parenthesized-subscript、complement-notation → complement-bar-vs-c-prime、dne-abbreviation → dne-in-answers、gcd-notation → gcd-written-in-words

### A-3. conventions の台帳（130 → 121）

| 直し | 行 |
|---|---|
| 語彙だけの違いを外す（8） | iff-for-necessary-and-sufficient・variation-language・ratio-rate-percent・derivative-at-a-point-naming・distance-rate-time・proportion-cross-multiplication・transposing-vs-both-sides・convexity-direction |
| 名前を付ける 14 行 → 3 行 | us-named-theorems-and-reasons-in-geometry ← geometry-postulates-named・angle-pair-names・properties-as-reasons・power-of-a-point-split ／ us-named-rules-and-tests ← us-named-algebra-rules・us-named-calculus-rules・us-named-trig-angles・graph-line-tests・empirical-rule-68-95-99-7・riemann-sum-types・volume-of-revolution-methods・induction-step-names ／ jp-named-techniques-unnamed-in-us ← ＋ jp-named-geometry-unnamed-in-us |
| 付録 B の 10 行を足す | approximately-equal-notation（#2）・division-sign-usage（#8）・multiplication-sign-usage（#9）・decimal-point-and-digit-grouping（#10）・handwritten-digits（#18）・handwritten-x-and-z（#19）・rationalizing-denominators-expectation（#22）・angle-units-degrees-and-radians（#23）・reading-f-of-x（#26）・sequence-starting-index（#29） |
| trapezoid-definition | 出典に「日本側の定義は生成時に日本の教科書で確かめる」 |

- 外した 8 行は、関係する terms の pitfalls か mapping_note に同じことがあるのを 1 つずつ確かめた（necessary-and-sufficient-condition・direct-proportion・inverse-proportion・joint-variation・rate・percent・find-the-derivative-at・speed・motion-problem・cross-multiply・move-term-to-other-side・both-sides・concavity・opens-upward・opens-downward・parabola）。行き先は ledger/phase3-removed.csv
- 「語彙だけ」の線: 同じもの・同じ操作を日米で別の語で呼ぶだけの行を外し、同じ見た目の語で範囲・定義が違う行（natural number が 0 を含む、trapezoid、polynomial が単項式を含む、標準形 ／ standard form ほか）と、書き方・答え方・手順・授業の習慣が違う行は残した

**category 別（前 → 後）**

| category | 前 | 後 |
|---|---|---|
| notation | 37 | 43 |
| terminology | 48 | 34 |
| classroom-culture | 15 | 17 |
| proof-style | 19 | 15 |
| letters | 10 | 9 |
| handwriting | 0 | 2 |
| calculator | 1 | 1 |
| 計 | 130 | 121 |

### A-4. phrases の台帳（320 → 267）

| 直し | 行 |
|---|---|
| 同じ意図をまとめる（8 組、10 行を吸収） | written-solution-therefore ← therefore・hence ／ left-side-minus-right-side ← take-the-difference-of-the-two-sides・form-the-difference ／ the-derivative-is-zero ← the-tangent-line-is-horizontal ／ written-solution-as-desired ← written-solution-qed ／ written-solution-which-implies ← written-solution-it-follows-that ／ written-solution-conclusion-because-reason ← changes-from-increasing-to-decreasing ／ exam-express-in-terms-of ← express-as-a-vector ／ exam-show-your-work ← exam-no-work-no-credit |
| terms に近い断片（9） | enclosed-region・point-outside-the-circle・checking-conditions・relation-between-x-and-y・the-value-of-sine-theta・for-the-angle-theta・one-of-the-solutions-is・the-other-solutions・the-domain-is-the-positive-reals |
| 同じ意図の terms がある（29） | 試験の指示 exam-find・evaluate・simplify・solve-for-x・prove・factor-completely・sketch-the-graph・round-to-the-nearest-tenth、答案の written-solution-without-loss-of-generality・base-case・equality-holds・if-and-only-if・solving-for・substituting・differentiating-both-sides、説明の explaining-solution-split-into-cases・substituted-into-the-other・u-substitution・simplified-to・added-to-eliminate、ほか assuming-leads-to-a-contradiction・take-the-log-and-differentiate・class-listening-plug-it-back-in・the-limit-exists・there-are-infinitely-many・has-no-local-extrema・increasing-on-all-reals・converges-to-zero・the-function-is-continuous |
| 日本の問題文の型で米国の教材に形がない（2） | using-real-numbers-s-and-t（real numbers s and t ／ scalars s and t が OpenStax・CED・IM・CK-12 で 0 件）、as-p-moves（as P moves ／ as P varies ／ moves along the circle が 0 件） |
| 形を確かめて残した | let-p-be-the-position-vector-of-p（OpenStax Calculus Volume 3 に Let r(t) … be the position vector of a particle の形。出典に書いた） |
| 製品名（3） | group-study-check-on-desmos・explaining-solution-graph-agrees・discord-online-homework-not-accepting |
| 1 つの意図に絞る | exam-clarify-instruction（試験の指示の語 simplify の意味を聞く。答えの形は exam-exact-form、途中式は exam-show-your-work） |

**場面別（前 → 後）**

| 場面 | 前 | 後 | PLAN の目安 |
|---|---|---|---|
| class-listening | 67 | 62 | 40〜60 |
| class-asking | 21 | 21 | 40〜60 |
| office-hours | 18 | 18 | 40〜60 |
| explaining-solution | 42 | 35 | 40〜60 |
| written-solution | 72 | 50 | 40〜60 |
| exam | 50 | 33 | 40〜60 |
| email | 17 | 17 | 40〜60 |
| group-study | 17 | 16 | 40〜60 |
| discord | 16 | 15 | 40〜60 |
| 計 | 320 | 267 | 300+ |

直しの後は総数が PLAN の目安（300+）に届かない。水増しはしていない。

### A-5. MICASE

- 作ったもの: `scripts/corpus/micase.ts`（CHAT の書き起こしを学生・教員・その他に分ける。場面はファイル名の発話イベントの記号 OFC・SGR・DIS・LES・LEL ほか、話者は @Participants と @ID の役割 JU・SU・MU・JG・SG・MG ＝学生、JF・SF・MF ＝教員）、`scripts/corpus/fetch-micase.ts`（`pnpm corpus:fetch:micase -- <zip>`。zip を 1 回だけ展開、変換済みは飛ばす、done/total、`corpus/micase/stats.json` に場面 × 話者の語数）、manifest の `collections: ["phrases"]`、count.ts・decide.ts・probe.ts の絞り込み（lib.ts `forCollection`・`wordsFor`）。単体テスト 4 つ（作った CHAT の例で。MICASE の本文ではない）
- docs/SOURCES.md に出典（TalkBank の指定の文献 Simpson, Briggs, Ovens and Swales 1999、DOI 10.21415/QT9V-2J96、収録 1997〜2001 年、研究・教育目的は無料・商用は許可が必要、使うのは件数だけ）、PLAN §15 と CLAUDE.md のコマンドに足した
- **取れなかった理由**: https://talkbank.org/data/ca/MICASE?f=zip、フォルダ、個々の .cha のどれもサインインの画面（authModals）を返す（2026-09-25 に確かめた）。アカウント作成・サインインは私がしない操作なので、zip は人間が落として上のコマンドを回す
- **MICASE の語数と場面・話者の内訳**: 自分では数えていない。以下は公開されている MICASE Manual（https://ca.talkbank.org/access/0docs/MICASE.pdf）の表 4-4 の数（参考）。全体 152 イベント・話者 1,571 人・1,695,540 語

| 場面（Manual 表 4-4） | 書き起こし | 語数 | 教員の割合 | 学生の割合 |
|---|---|---|---|---|
| Office hours | 8 | 120,629 | 26.9% | 72.8% |
| Study groups | 8 | 129,725 | 0% | 100% |
| Discussion sections | 9 | 74,904 | 33% | 66.7% |
| Labs | 8 | 73,815 | 15.1% | 67.9% |
| Tutorials | 3 | 27,014 | 15.9% | 80.9% |
| Advising | 5 | 58,817 | 14.2% | 37.2% |
| Small lectures | 31 | 320,893 | 74.0% | 22.6% |
| Large lectures | 31 | 257,311 | 93.5% | 5.9% |

（ほかに colloquia・seminars・student presentations・meetings・dissertation defenses・interviews・service encounters・tours。Manual の注のとおり教員と学生の割合の和は 100% にならない）

## B. 3 つの台帳の件数（前 → 後）

| 台帳 | 前（907098d） | 後 | 目安 |
|---|---|---|---|
| ledger/symbols.csv | 220 | 220 | 300+ |
| ledger/conventions.csv | 130 | 121 | 50+ |
| ledger/phrases.csv | 320 | 267 | 300+ |

外した・まとめた行は `ledger/phase3-removed.csv`（conventions 8 ＋ phrases 43）と各台帳の `merged_from` 列。台帳の直しは `scripts/ledger/phase3_fixes.py`（入力は 907098d に固定）。

## C. フレーズ 2 件

MICASE が取れていないので、**数え直しは MICASE なし（今までのコーパス）の結果**。どちらも ③ のまま（evidence は書き戻していない。Phase 3 の準備と同じく、phrases の生成で書く）。

| id | 要の部分（話し言葉） | 結果 |
|---|---|---|
| class-asking-repeat | could you repeat \| can you repeat 1、i missed that 1、could you say … again 0 | ③（2 件） |
| office-hours-stuck-at-step | walk … through 6、i don't see how 2、i'm lost 1 | ③（9 件。walk … through は大半が先生の let me walk you through） |

MICASE を取り込んだら `pnpm corpus:count && pnpm corpus:decide` で数え直す（MICASE の office hours と study group は学生の発話が 7〜10 割。Manual の表）。

## D. 記号の生成

### D-1. 決めた規則（DECISIONS「Phase 3 記号の生成」）

- 読みは `countPattern`（ワイルドカード）で、用例コーパスの話し言葉を数える。読みの語が別の意味にも使われるときは、読みの意味でしか現れない形で数え、形を lib.ts `SYMBOL_PATTERNS` に書いた（evidence にも形で記録）。形に TERM_FORMS と同じ「A | B」「!w」を使えるようにした（lib.ts `patternBody`、単体テスト 1 つ）
- register: ① の首位の読みを standard、② の首位をすべて standard（頻度順）、1 件以上あるほかの読みを spoken。0 件の読みは spoken_en に入れない。③ は候補をそのまま（1 つ目が standard）入れて corpus-undecided
- confidence: 出典が editorial だけで ③ の記号は draft、ほかは likely。出典には記号を使っている参照（OpenStax の本・CED・CK-12・Levin。本ごとの件数は symbol_refs.py と同じ探し方で数えた）と学習指導要領〔用語・記号〕を挙げた。Nekovář・USU・Gillett は手元になく確かめていないので挙げていない
- related: 今ファイルのある慣習差（3 つ）だけに結んだ（leq-sign・geq-sign ↔ inequality-symbols、therefore-sign・because-sign ↔ therefore-because-symbols）。ほかは台帳の related 列に残した（慣習差の生成で両側に入れる）
- **スキーマ変更**: symbols と conventions に任意項目 `related`（id の配列）。validate は相手のファイルがあること（エラー）と、相手も自分を指していること（警告）を確かめる

### D-2. 件数

| バッチ | 台帳の行 | 新しい記号 | 既存（evidence を書き直しただけ） | likely | draft | ③ |
|---|---|---|---|---|---|---|
| 1 | 1〜50（四則・分数・指数・根号・添字） | 48 | power-squared・square-root | 46 | 2 | 4 |
| 2 | 51〜100（関数・三角・対数・極限・微分・積分） | 44 | function-f-of-x・theta・derivative-prime・derivative-leibniz・nabla・integral-definite | 43 | 1 | 2 |
| 3 | 101〜150（重積分・数え上げ・集合・区間・論理・整数・ベクトル） | 47 | summation-sigma・permutation-npr・combination-ncr | 36 | 11 | **16** |
| 計 | 150 行 | **139** | 11 | **125** | **14** | **22** |

data/symbols は 11 → 150。残りの 70 行（151〜220: ベクトルの大きさ・内積・行列・確率統計・ギリシャ文字・複素数・幾何）は生成していない。corpus-auto-only（根拠が自動字幕だけ）の記号は 0。

### D-3. ③ の一覧（22、人間レビュー行き）

| バッチ | id | 記号 | 候補の読み（話し言葉の件数の計） | confidence |
|---|---|---|---|---|
| 1 | minus-plus-sign | ∓ | minus or plus（3）。minus plus の件数は符号の並び plus minus plus … で ∓ の読みではない | draft |
| 1 | curly-braces | { } | braces ／ curly braces（7） | likely |
| 1 | proportion-colon | a : b = c : d | a is to b as c is to d（3） | draft |
| 1 | sequence-braces | {aₙ} | the sequence a sub n ／ the sequence a n（3） | likely |
| 2 | max-min-notation | max{a, b} | the maximum of ／ the max of ／ the larger of（8） | likely |
| 2 | ceiling-brackets | ⌈x⌉ | the ceiling of x（4） | draft |
| 3 | product-pi-notation | ∏ | the product from i equals one to n of …（0） | draft |
| 3 | repeated-combination-h-jp | ₙHᵣ | n plus r minus one choose r ／ multichoose（1） | likely |
| 3 | not-element-of-sign | ∉ | is not an element of ／ is not a member of（2） | draft |
| 3 | proper-subset-sign | ⊊ | is a proper subset of（0） | draft |
| 3 | empty-set-symbol | ∅ | the empty set ／ the null set（9） | likely |
| 3 | rationals-symbol | ℚ | the rational numbers ／ the rationals（4） | draft |
| 3 | set-builder-braces | {x \| x > 0} | the set of all x such that …（4） | likely |
| 3 | roster-braces | {1, 2, 3} | the set one, two, three ／ the set containing …（7） | draft |
| 3 | cartesian-product-cross | A × B | A cross B ／ the Cartesian product（0） | draft |
| 3 | power-set-notation | 𝒫(A) | the power set of A（0） | draft |
| 3 | set-difference | A ∖ B | set difference ／ A without B（0。A minus B は数の引き算と分けられない） | draft |
| 3 | half-open-interval | [a, b) | the half-open interval ／ including a but not b（3） | draft |
| 3 | logical-or-vee | p ∨ q | p or q（0） | likely |
| 3 | qed-end-of-proof | ∎ | which completes the proof ／ Q E D ／ end of proof（7） | draft |
| 3 | vector-ab-arrow | AB⃗ | vector A B ／ the vector from A to B（4） | draft |
| 3 | angle-bracket-vector | ⟨a, b⟩ | the vector with components a and b ／ angle bracket（4） | likely |

likely の ③ は、記号そのものは参照（OpenStax・CK-12・Levin）で使われているもの。バッチ 3 の ③ は集合・論理・証明の記号に集中している。話し言葉のコーパスで離散数学の講義は MIT 6.042 だけ。

### D-4. 読みを数えて決めた「確かでない行」

| id | 結果 |
|---|---|
| minus-plus-sign（∓） | ③（上） |
| negative-exponent-power（x⁻¹） | ① x to the negative one（x inverse は spoken。Khan Academy 頼み） |
| evaluation-bar（F(x)\|ₐᵇ） | ① F of x evaluated from a to b（MIT 18.02 頼み。evaluated at b minus … evaluated at a は spoken） |
| expression-exponent（2^{x+1}） | ① two to the x plus one（power を付ける読みは spoken、the quantity はまれ） |
| second-derivative-leibniz（d²y/dx²） | ① the second derivative of y（記号どおりの d squared y d x squared はまれ。Khan Academy 頼み） |
| integral-indefinite（∫ f dx） | ② the integral of f of x d x ／ the indefinite integral of f of x（the antiderivative of は ∫ の読みと分けられないので数えない） |
| directional-derivative-notation・jacobian-notation | 名前の形で ①（D sub u の読みはコーパスに出てこない） |
| X ~ N、φ・β・ρ、行列の読み上げ | 151 行以降。未生成 |

## E. 確かめた主張

- TalkBank の MICASE: ページ（https://ca.talkbank.org/access/MICASE.html）の引用の指定と DOI、zip・フォルダ・.cha がサインインを求めること（curl で確かめた）。Manual の発話イベント・役割の記号と表 4-4 の語数
- CK-12 Geometry の節の番号と名前（corpus/ref/ck12-geometry.txt の区切り）: 4.19〜4.26、5.7〜5.19、5.27・5.28
- OpenStax Calculus Volume 3 の Let r(t) … be the position vector of a particle（4 モジュール）。using-real-numbers-s-and-t・as-p-moves の形は OpenStax 9 冊・CED 2 つ・IM・CK-12 で 0 件
- 外した慣習差 8 行の中身が terms の pitfalls ／ mapping_note にあること（A-3）
- 記号の出典: 本ごとの記号の件数（OpenStax の CNXML と本文、CED、CK-12）。≟ は OpenStax Elementary Algebra 2e と CK-12 Geometry
- 記号の読みは全部 evidence（decide が書いた件数）に基づく。decide の「エントリ側で直すこと」0、記号の register の食い違い 0

## F. 怪しい点

- **スキーマ変更**（symbols と conventions の `related`）は指示の「related で結ぶ」を実現するためにした。CLAUDE.md の「確認を求めるのはスキーマ変更」に当たるので、この変更でよいか見てほしい（任意項目の追加で、既存のデータは変わらない）
- **MICASE は未取得**。変換スクリプトは作った CHAT の例でしか試していない。本物の MICASE の CHAT の @ID の役割の欄が Manual の記号（JU・SF ほか）か、Student・Teacher のような語かは確かめていない（どちらも学生・教員に振るようにした）
- **数えた形が別の使い方も拾う記号**（判定は変わらないと見たもの）: decimal-point の one point ／ two point …（one point on the graph も数える）、wave-dash-range-jp の from three to …（定積分の端）、plus-sign・minus-sign・times-sign の * plus * ほか（three times のような回数も）、because-sign の since（時の since）、derivative-evaluated-at の evaluated at（記号以外の代入）、element-of-sign の is a member of（集合以外）、iff-arrow の is equivalent to（this is equivalent to saying）
- **1 ソース頼みの首位**: element-of-sign（khan-algebra）、cube-root（khan-middle）、floor-brackets ／ gauss-bracket-jp（khan-middle、10 件ちょうど）、line-integral-sign・double-integral-sign・triple-integral-sign・evaluation-bar・partial-derivative-subscript（MIT 18.02）、cardinality-notation・congruence-mod・negation-sign（MIT 6.042）、integral-indefinite の indefinite integral（Khan Academy）。decide の規則（抜くと別の候補が首位なら ②）には当たらなかった
- 記号の notes に、まだファイルのない慣習差の id（repeating-decimal-notation・sequence-starting-index ほか）を名前として書いた。validate は notes を確かめない。慣習差を生成したら related にする
- 慣習差の「一方の国だけが名前を付ける」14 行は Phase 3 の準備で名前が挙がっていなかったので、要約から私が 14 行を選んだ。付録 B の 10 行のうち #10（桁区切り）と #26（f(x) の読み）は日米で同じことを言う行で、生成時に外れる見込み
- フレーズで「同じ意図の terms がある」として外した行のうち、explaining-solution-simplified-to・class-listening-plug-it-back-in は PLAN §9 の例（explaining-solution の流れ）に近い。explaining-solution-plugging-back-in（PLAN の例そのもの）は残した
- ③ の記号の confidence の線（editorial だけなら draft）は私が決めた。likely の ③ 8 件も corpus-undecided の flag があるので verified にはならない

## G. 次に要ること

- MICASE の zip を落として `pnpm corpus:fetch:micase -- <zip>`、そのあと `pnpm corpus:count && pnpm corpus:decide`（phrases の ③ 2 件の数え直し）
- 記号の ③ 22 件を人間レビュー（または話し言葉のコーパスに離散数学・線形代数の講義を足してから数え直す）
- 記号の残り 70 行（151〜220）の生成は、③ の扱いを決めてから

## H. 確認（合否はすべて終了コード）

```
pnpm exec tsc --noEmit        # exit 0
pnpm validate                 # exit 0。terms 1,540 ／ symbols 150 ／ phrases 5 ／ conventions 3 ／ curriculum 163、警告 0
pnpm spell                    # exit 0。1,869 ファイル、0 件
pnpm test                     # exit 0。143/143（4 ファイル。MICASE 4・記号の形 1 を足した）
pnpm build                    # exit 0。1,539 ページ。export: symbols.json 136（draft 14 を除く）
pnpm corpus:count && pnpm corpus:decide -- --write --ids <各バッチの記号>
                              # 各バッチで exit 0。最後の decide: 主見出し 1,180 ／ 併記 163 ／ 判断不能 25（terms 1・phrases 2・symbols 22）／
                              # 食い違い 2（phrases。書き戻していない）／ 直すこと 0
```

- 取得（ネットワーク）は MICASE の確認（ページ・zip・フォルダ・.cha・TalkBank Browser の認証の確かめ・Manual の PDF）だけ。どれもタイムアウト付き（30〜60 秒）の単発のリクエストで、zip はサインインを求められて取れなかった。fetch-micase.ts はネットワークに出ない（手元の zip を読む）
- `pnpm crosscheck` は terms を変えていないので回していない
