# Phase 2 レポート 3 — CK-12・規則 1 の例外の一般化・OpenStax 3 冊・IM の重複除去を足して ③ をやり直し、Geometry ／ Discrete Math ／ 数I・数A を最後まで（79 語）

作成: 2026-09-25 ／ 対象: 53998f8（Phase 2 geometry / discrete 2 report）→ 本コミット
指示: audits/phase2-geometry-discrete-2-report.md の I への答え 1〜7。判断は `docs/DECISIONS.md` の「Phase 2 幾何・離散の単元 3 の前の修正」（18 行）と「Phase 2 幾何・離散の単元 3」（16 行）。

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified に上げた語はない。

## まとめ

- **1〜6 はすべて直した**（コミット 5025672）。人間レビュー行きの ③ は **33 → 16**（1〜4 を足した後）**→ 12**（5 のあなたの決定 4 語の後）。terms は 28 → 11 → 7、phrases は 5 のまま
- 減った 17 語のうち 16 語は CK-12 Geometry で決まった（two-column proof・CPCTC・HL・major ／ minor arc・公準 3 つ ほか）。1 語（prime-factorization）は OpenStax Prealgebra ／ Elementary Algebra の書き言葉で決まった
- 規則 1 の例外の一般化で「英語に決まった言い方がない」だった 17 語が規則 2 に移った（**linear-pair・intercepted-arc・arc-measure** を含む）。**aas-congruence は移らなかった**（CK-12 の形の件数が 2 ／ 2 で 3 に届かない。H）
- IM の重複除去で件数は下がったが（rigid transformation 139 → 97 ほか）、**見出しが変わった語は無い**
- 書き言葉 3 冊でコーパスの判定（書き言葉）が変わった既存の語が 44。register の食い違い 17 語と、主見出しが変わった語（reduce → simplify the fraction ほか）を直し、件数を書いた本文 218 語の件数を新しい数に直した
- **7 は最後まで進めた**: 79 語（台帳の 81 行から統合 2）を 2 バッチで生成（コミット eb91b76・d61a40e）。**likely 79 ／ draft 0**。人間レビュー行きの ③ は **バッチ 6 で 3／50（6%）、バッチ 7 で 0／29**。1 割を超えなかったので止めずに進めた
- **対象の単元の残りは 0 行、台帳全体の残りは 654 行**（K）
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて緑（L）。crosscheck 393/393 一致
## A. 1〜4 で足したもの

### 1. CK-12（規則 2 の参照、OpenStax・IM と同じ段）

| id（corpus/ref/） | 資料 | 取れた範囲 | ライセンス |
|---|---|---|---|
| ck12-geometry | CK-12 Geometry（K12 LibreTexts、Bookshelves/Mathematics/Geometry） | 9 章 173 節、154,644 語（全部） | **CK-12 Curriculum Materials License**（CC ではない。教育目的に限った利用・改変・配布を認める CK-12 独自のもの。各ページ下の表示と tag `license:ck12`、https://www.ck12info.org/curriculum-materials-license/ で確かめた） |
| ck12-algebra | CK-12 Algebra（K12 LibreTexts、Bookshelves/Mathematics/Algebra） | 75 節、71,135 語（**一部だけ**） | 同上 |

- 取得: `python3 scripts/ledger/refetch.py ck12`（`refs` に含む）。本棚 → 章 → 章のページが並べる下のページの順にたどり、下にページのない節だけを取る。4 並列、タイムアウト 30 秒・リトライ 3 回、進捗 done/total、ページ単位の JSON キャッシュ（`corpus/ref/ck12/pages/`、gitignore）。2 回目は 0 件取得で済むことを確かめた
- **CK-12 Algebra は K12 LibreTexts 版が不完全**: 章のページに並ぶ 112 ページのうち 37 ページはホームへ転送され、本文があるのは 1 章・2 章の全部と 3 章・7 章の 1 節ずつ。転送されたページは「無し」として記録し、失敗には数えない
- **CK-12 の中学の本は K12 LibreTexts に無い**（Mathematics の棚は Algebra・Analysis・Calculus・Geometry・Precalculus・Statistics・Trigonometry）。ck12.org の FlexBook は取らなかった
- 節の名前（「CK-12 Geometry 4.16 HL」）に候補があれば OpenStax の節の名前と同じく 1 件と数える。本文は写さず、件数と節の名前だけを使う
- 規則 2 の段: CED → **OpenStax・IM・CK-12**（同じ段、3 つを合わせて件数の多い候補）→ Nicholson ／ Levin → 英語版 Wikipedia の記事名（段数の規則は 4 段のまま）

### 2. 規則 1 の例外 ② の一般化

- 参照（CED・OpenStax・IM・CK-12・Nicholson・Levin）の **どれか 1 つが、候補の 1 つを 3 件以上** 使っていれば、規則 1（英語に決まった言い方がない）に当てず規則 2 で見出しを決める（lib.ts `REFERENCE_NAMED = 3`）。数え方は規則 2 と同じ
- IM の glossary の見出しだけの例外はこれに含めて消した。CED の呼び方（1 件でも）と例外 ①（mapping none の訳語）はそのまま
- 「3 件以上」は候補ごと・参照ごとと読んだ（別々の参照・別々の候補の件数は足さない）

### 3. 書き言葉コーパスに OpenStax 3 冊

| source id | 本 | モジュール | 重複除去の後の語数 |
|---|---|---|---|
| openstax-prealgebra | Prealgebra 2e | 74 | 253,498 |
| openstax-elemalg | Elementary Algebra 2e | 81 | 316,432 |
| openstax-intalg | Intermediate Algebra 2e | 82（うち 23 は Elementary Algebra の写しとして落ちる） | 209,982 |

- openstax/osbooks-prealgebra-bundle @ 38cae454、3 冊とも **CC BY-NC-SA 4.0**（collection の `md:license`）。`pnpm corpus:fetch:openstax` がほかの 6 冊と一緒に取る（677 モジュール、237 を新しく取得、440 はキャッシュ）
- マニフェストの最後に置いたので、前からの 6 冊の文は 1 つも減らない（重複除去は先に出た方を残す）
- CK-12 の中学の本は無いので、中学・Algebra の単元への備えはこの 3 冊と CK-12 Algebra の一部

### 4. IM の重複除去

- 前のレッスンに出た 8 語以上の文を数えない（lib.ts `dedupeSections`。OCW の重複除去の文の段と同じ考え方で、コースとレッスンの順に最初の 1 回だけ）。除いた文 **5,572**（練習問題の再掲のほか、各レッスンが glossary の定義を繰り返していた分）
- CK-12 にも同じ除去を当てた（977 文）。これは私の判断（同じ段で数え方を揃える）
- 件数の比で見出しを決めた語は、どれも見出しが変わらなかった:

| 語 | 見出し | 除去の前 → 後 | 相手の候補 |
|---|---|---|---|
| rigid-motion | rigid transformation | 139 → 97 | rigid motion 77 → 61 |
| sss-congruence | side-side-side | 17 → 16 | — |
| sas-congruence | side-angle-side | 28 → 27 | — |
| asa-congruence | angle-side-angle | 22 → 21 | — |
| dilation | dilation | 372 → 295 | — |
| scale-factor | scale factor | 579 → 522 | — |
| straight-angle | straight angle | 41 → 24 | — |
| circumcenter ／ incenter | 同じ | 23 → 20 ／ 29 → 27 | — |
| stacked-bar-chart | segmented bar graph | 30 → 25 | stacked bar graph |
| trigonometric-ratio | trigonometric ratio | 20 → 8 | — |
| perpendicular-bisector | perpendicular bisector | 148 → 123 | — |
| translation | translation（IM Grade 8 ／ Geometry） | 94 ／ 166 → 65 ／ 129 | translate 48 ／ 101 → 40 ／ 95、shift は 2 ／ 4 のまま |


## B. 足す前と後の ③（人間レビュー行き）

| | 足す前（53998f8） | 1〜4 の後 | 5（あなたの決定 4 語）の後 | バッチ 6 の後 | バッチ 7 の後（本コミット） |
|---|---|---|---|---|---|
| terms | 28 | 11 | 7 | 10 | **10** |
| phrases | 5 | 5 | 5 | 5 | 5 |
| 計 | **33** | **16** | **12** | 15 | **15** |

どの追加で減ったか（1〜4 の後の 33 → 16）: CK-12 で 16 語、OpenStax 3 冊（書き言葉コーパス）で 1 語。IM の重複除去で ③ が増減した語はない。規則 1 の例外の一般化は「英語に決まった言い方がない」の 17 語を規則 2 に移したもので、③（人間レビュー）の数は変えていない。

decide の全体（本コミット）: 主見出し決着 789 ／ 併記 100 ／ 英語に決まった言い方なし 65 ／ 参照で見出し 234 ／ 人間が決めた 29 ／ 判断不能 15 ／ register 不一致 0 ／ 直すこと 0（足す前: 740 ／ 98 ／ 81 ／ 176 ／ 25 ／ 33 ／ 0 ／ 0）。

### 残った ③（人間レビュー行き）の一覧

| id | ja | 理由 | 出どころ |
|---|---|---|---|
| flowchart-proof | フローチャート証明（訳語） | CK-12 にも無い。IM・Wikipedia にも無い | 前から |
| perpendicular-postulate | 垂線の公準（訳語） | 同上 | 前から |
| reflex-angle | 優角 | 同上（Wikipedia は節へのリダイレクト） | 前から |
| same-side-exterior-angles | 同側外角（訳語） | 同上 | 前から |
| symmetric-property | 対称律 | 同上（Wikipedia は別の概念 Symmetry） | 前から |
| triangle-proportionality-theorem | 三角形と比の定理 | 同上（CK-12 は名前を付けない） | 前から |
| undefined-terms | 無定義用語 | 同上 | 前から |
| circumscribed-polygon | 外接多角形 | どの参照にも無い。Wikipedia の Tangential polygon は数学カテゴリから 4 段の外 | バッチ 6 |
| existence-proof | 存在証明 | どの参照にも無い。Wikipedia は existence proof → Constructive proof（別の概念。WIKIPEDIA_NOT_SAME） | バッチ 6 |
| extended-euclidean-algorithm | 拡張ユークリッド互除法 | どの参照にも無い。Wikipedia の記事は 4 段の外 | バッチ 6 |
| phrases 5 語 | class-asking-repeat・exam-clarify-instruction・explaining-solution-first-step・office-hours-stuck-at-step・written-solution-therefore | 言い回しのコーパス件数が 0 | 前から |

## C. 判定が変わった既存の語（1〜4 の後、5 の人間の決定を含む）

決着が変わった既存の語は 68（件数だけ変わった語を除く）。

| 変化 | 語数 | 語 |
|---|---|---|
| ③ 人間レビュー → CK-12 | 16 | alternate-exterior-angles・angle-addition-postulate・common-tangent・corresponding-angles-postulate・cpctc・deductive-reasoning・exterior-angle-theorem・hl-congruence（en.term → HL）・law-of-syllogism・major-arc・minor-arc・paragraph-proof・reflexive-property・ruler-postulate・transitive-property・two-column-proof |
| ③ 人間レビュー → コーパス（書き言葉 ①） | 1 | prime-factorization（OpenStax Prealgebra 55・Elementary Algebra 21 ほか、書き言葉 79 件） |
| ③ 人間レビュー → 人間が決めた（5） | 4 | circular-permutation・excenter・exterior-angle-bisector・number-of-divisors |
| 英語に決まった言い方がない → CK-12 | 10 | arc-measure・equal-angles・equiangular-triangle・hypothesis・indirect-measurement・intercepted-arc・**linear-pair**・ratio-of-areas-of-similar-figures・side-angle-inequality・tangent-segments-are-equal |
| 英語に決まった言い方がない → OpenStax | 5 | base-n・experimental-probability（en.term → empirical probability）・lexicographic-order（→ alphabetical order）・solve-the-right-triangle・standard-form |
| 英語に決まった言い方がない → Levin | 2 | sequence-of-differences（→ sequence of differences）・shortest-path（lattice path） |
| Levin → CK-12 | 7 | biconditional・de-morgans-laws・inductive-reasoning・inverse・law-of-detachment（en.term → law of detachment）・negation・truth-value |
| Levin → OpenStax ／ コーパス | 2 | integer-solution（OpenStax Prealgebra）・divisibility-rules（コーパス ①） |
| Wikipedia → CK-12 | 2 | angle-bisector-theorem・segment-addition-postulate |
| IM → CK-12 | 7 | adjacent-angles・alternate-interior-angles-theorem・be-inscribed-in・chord・isosceles-triangle-theorem（en.term → base angles theorem）・scalene-triangle・similarity-transformation |
| IM → コーパス | 1 | linear-inequality（書き言葉 ① 130 件） |
| OpenStax → CK-12 | 2 | negate・triangle-inequality |
| OpenStax → コーパス（書き言葉 ①） | 9 | collinear・composite-number・determine-the-coefficients・expanding-and-condensing-logs（書き言葉 ②）・number-of-digits・properties-of-inequalities・rewrite-in-exponential-form・simplify-radicals（en.term → simplify the radical）・square-root-of-a-negative-number |

あなたが名前を挙げた 4 語: **linear-pair**（CK-12 30 件で決着）、**intercepted-arc**（CK-12 20 件）、**arc-measure**（CK-12 の measure of the arc 5 件・IM 4 件）は規則 2 で決まった。**aas-congruence は英語に決まった言い方がないのまま**（F・H）。

コーパスの判定（register）が変わった既存の語は 44（すべて書き言葉。話し言葉のコーパスは変えていない）。register がエントリと食い違った 17 語は直した（DECISIONS「単元 3」）。食い違いにならなくても主見出しや並びが変わった語（reduce → simplify the fraction、simplify-radicals、system-of-linear-equations の register、② の variants の並べ替え 4 語）も揃えた。

## D. 5〜6 の結果

### 5. あなたの決めた 4 語（corpus-human-settled、register は主張しない）

| id | 決定 | 書いたこと |
|---|---|---|
| excenter | そのまま | mapping_note「米国の高校課程（CED・OpenStax・IM・CK-12）では扱わない（excenter は CED・OpenStax・IM・CK-12 とも 0 件。用例コーパスでも 0 件）」。件数は counts.json と CK-12 ／ IM ／ OpenStax の本文の grep で確かめた |
| exterior-angle-bisector | そのまま | — |
| circular-permutation | そのまま | mapping_note「英語版 Wikipedia の Cyclic permutation（circular permutation のリダイレクト先）は群論の巡回置換で、円順列とは別の概念」 |
| number-of-divisors | そのまま | mapping_note「約数の個数を返す関数は divisor function（d(n)。σ₀(n) とも書く）」と、Wikipedia の Divisor function は σₖ の族の記事であること |

3 語は mapping exact だが、validate は corpus-human-settled の語の mapping_note を許している（警告 0）。

### 6. 三角形の読み

「さんかっけい」だった 8 語を「さんかくけい」にした（triangle-inequality・similar-triangles・pascals-triangle・solving-triangles・conditions-that-determine-a-triangle・area-of-a-triangle-using-vectors・isosceles-triangle-theorem・area-formula-with-sine）。台帳・ほかのデータに「さんかっけい」は残っていない。

## D2. 生成（指示 7）

| | 範囲 | 語数 | likely | draft | ③ 人間 | 決まった言い方なし | 参照で見出し | コーパスで決着 | コミット |
|---|---|---|---|---|---|---|---|---|---|
| バッチ 6 | Geometry の circles・area-and-volume・transformations・coordinate-geometry の残り、Discrete Math の logic-and-proofs・sets-and-functions・number-theory・induction-and-recursion | 50 | 50 | 0 | **3（6%）** | 1 | 30（CK-12 12・Wikipedia 8・OpenStax 5・IM 2・Levin 2・Nicholson 1） | 16 | eb91b76 |
| バッチ 7 | Discrete Math の counting・discrete-probability・graphs-and-relations、数I・数A の残り、Geometry の secant-line・coplanar | 29 | 29 | 0 | **0** | 0 | 6（Levin 5・IM 1） | 23 | d61a40e |

書き方は前回と同じ: 候補・見出し・register・mapping・level・出典・件数は `corpus:probe --decide` と count → decide で私が決めて骨組みに書き、本文（定義・例文・pitfalls）は下書き役（バッチ 6 は 5 本、バッチ 7 は 3 本）に 10 語ずつ書かせた。件数表と照らして全語を読み、直した（Fermat の little の説明、正多角形の面積の例文ほか）。書いたあと count → decide で全語を照合（不一致 0、直すこと 0）。

### 参照で見出しを決めた語（36）

- CK-12（12）: intersecting chords theorem・tangent secant segment theorem（割線と接線の定理）・inscribed polygon・area of a regular polygon・apothem・composite figure・glide reflection・preimage・mapping rule（座標の規則）・rotational symmetry・connective（論理結合子）・tautology
- 英語版 Wikipedia の記事名（8）: rules of inference・proof by exhaustion（場合分けによる証明）・Bézout's identity・modular multiplicative inverse・Chinese remainder theorem・Fermat's little theorem・Euclid's theorem（素数の無限性）・well-ordering principle
- OpenStax（5）: universal quantifier・existential quantifier・without loss of generality・Cartesian product・ceiling function
- Levin（7）: propositional logic・power set・binomial identity・degree of a vertex・handshaking lemma・vertex coloring（グラフ彩色）・congruence modulo n（合同式）
- IM（3）: Cavalieri's principle・tessellation（平面充填）・median（中線）
- Nicholson（1）: proof of uniqueness

Nicholson ／ Levin ／ Wikipedia で決まった 16 語には mapping_note に「米国の高校課程（CED・OpenStax・IM・CK-12）では扱わない」と件数を書いた（0 件は counts.json で全候補について確かめた）。

### 英語に決まった言い方がない 1 語

coordinate-proof（座標を用いた証明、mapping near）: 用例コーパス 0 件、参照は IM Geometry のレッスン名 6.14 Coordinate Proof の 1 件だけで 3 件に届かない。

### コーパスで決着 39 語

cross section・density・cubic units（書）・square units ／ units squared（②）・image（書）・truth table（書）・predicate・quantifier（書）・bijection・countable（書）・divisibility（書）・cryptography（書）・strong induction・structural induction（書）・recursion（話）・linear recurrence・pigeonhole principle（書）・generating function（書）・linearity of expectation・Chebyshev's theorem（書）・relation（書）・equivalence relation・equivalence class（話）・partial order・directed graph（書は ② directed graph ／ digraph）・connected・Hamiltonian path・spanning tree・bipartite graph（書）・planar graph（書）・intersection（話）・hypothesis（仮説）・variable（変量）・complement of an event（書）・addition principle（書）・multiplication principle（書）・base ten（書）・secant line・coplanar（書）。
多くは 1 つのソース（MIT 6.042 の講義とノート）に頼る（H）。

### 統合と移動

- 台帳（fix_decisions.py PHASE2F_SAME の末尾）: modular-arithmetic（モジュラー算術）→ congruence-modulo-n、stars-and-bars（星と棒）→ combination-with-repetition（既存。en.alt に stars and bars）
- ja の見出しを台帳から変えた語: 対称テッセレーション → 平面充填、逆元 → モジュラ逆数、強帰納法 → 累積帰納法、座標証明 → 座標を用いた証明、合成図形 → 複合図形、関係（二項関係）→ 二項関係、次数（頂点）→ 頂点の次数（台帳の語は ja.alt）
- 台帳の mapping を変えた語（near → exact）: cavalieris-principle・tessellation・modular-inverse・congruence-modulo-n・complementary-event・addition-principle・multiplication-principle・decimal-system
- level.jp を台帳から直した語: 31（DECISIONS。大学 → 内容の学年）
- 同音異義: validate の SAME_EN_TERM に hypothesis ／ statistical-hypothesis・median ／ median-of-a-triangle、SAME_JA に 像（column-space ／ image）。相手の related と pitfalls に足した
- 前のバッチの related から外していたバッチ 7 の id（secant-line・relation・congruence-modulo-n・generating-function）を戻した
- data/curriculum の term_refs を台帳から同期した（18 単元、79 語と combination-with-repetition）

## E. パイプラインの変更

| 変更 | ファイル |
|---|---|
| CK-12 の取得（`refetch.py ck12`、`refs` に含む。章のページのリンクから葉のページをたどる、転送されたページは「無し」） | scripts/ledger/refetch.py |
| OpenStax 3 冊（Prealgebra 2e・Elementary Algebra 2e・Intermediate Algebra 2e） | scripts/corpus/fetch-openstax.ts・fetch.ts・probe.ts |
| CK-12 の読み込み、IM と CK-12 の重複除去（`--no-dedupe` で外せる） | scripts/corpus/references.ts |
| ReferenceHits に ck12 ／ ck12Titles、settleUndecided に CK-12 の段と規則 1 の例外 `REFERENCE_NAMED = 3`、`dedupeSections`、normalize が文字にはさまれた en dash をハイフンにする、TERM_FORMS（単元 3 の前の修正 9 語とバッチ 6・7 の 13 語）、WIKIPEDIA_NOT_SAME に existence-proof | scripts/corpus/lib.ts |
| decide の「高校課程では扱わない」の文言に CK-12、報告の見出しに CK-12、CK-12 で決まった語の書き方 | scripts/corpus/decide.ts |
| 「高校課程では扱わない」の文言、SAME_EN_TERM に hypothesis ／ statistical-hypothesis・median ／ median-of-a-triangle、SAME_JA に 像（column-space ／ image） | scripts/validate.ts |
| 統合 2 つ（modular-arithmetic・stars-and-bars） | scripts/ledger/fix_decisions.py → ledger/terms.csv・id-changes.csv |

テストは 111 → 115（CK-12 の段、3 件の例外とその反対、dedupeSections、en dash）。

## F. 確かめた主張

- CK-12 のライセンス: 各ページの表示「shared under a CK-12 license」と tag `license:ck12`、ライセンスのページ（ck12info.org、2021-02-16 更新）の要約。CC ではなく教育目的の利用に限る
- OpenStax 3 冊のライセンス: collection の `md:license` がどれも CC BY-NC-SA 4.0
- CK-12 Algebra の 37 ページがホームへ転送されること（curl でリダイレクト先を確かめた）
- 別の意味だった参照・コーパスの件数（形で数え直した）: CK-12 Algebra の a fractional part of（小数の位の説明）、OpenStax Prealgebra ／ Elementary Algebra の the floor of your room ／ bedroom、Elementary ／ Intermediate Algebra の conjugate pair（2 項式の組）、字幕の slope intercept form と Elementary Algebra の slope–intercept form（en dash）、Prealgebra の inverse operations（方程式を解く逆の演算）、Elementary Algebra の system of (linear) inequalities（2 変数の不等式の組）、字幕の log, base ten（10 進法の base ten から外した）、density の probability density、image の mirror image、tiling の floor tiles ／ fraction tiles
- MIT の講義ノートの Chebyshev's theorem は Chebyshev の不等式（Markov's theorem と並ぶ節）
- 用例コーパスの recursion は MIT 6.042 の再帰（アルゴリズム・漸化式）
- CK-12 の 1 件で決まった語の中身: ruler-postulate は 1.3 の Additional Resources の動画の題、common-tangent は 6.2 の練習問題
- 件数の注の直し（218 語、下書き役の件数表）の後、variants の note の件数を evidence と機械的に突き合わせ、前からずれていた 3 語（derivative-of-the-logarithm・trigonometric-identities・box-plot）も直した。候補でない言い方の件数（dashed line・the data is・substitute values・descending order・line of symmetry・predicted value・laws of exponents）は probe で数え直した

## G. 決めたこと（あなたの指示の外）

1. CK-12 にも IM と同じ重複除去を当てた（977 文）
2. 「3 件以上」は候補ごと・参照ごと（参照を足したり、候補を足したりしない）
3. 数え方の直し（en dash、別の意味の形 7 語）と、見出しを含むコロケーション・別の意味の候補を外した 6 語（DECISIONS）
4. register が食い違った 17 語はコーパスの結論に合わせて register ／ variants を直した。主見出しが変わった 8 語（empirical probability・alphabetical order・sequence of differences・base angles theorem・law of detachment・HL・simplify the radical・simplify the fraction）は規則の結論どおり en.term を変え、前の見出しは en.alt に残した
5. validate は corpus-human-settled の語の mapping_note を許しているので、あなたの決めた 3 語（exact）の mapping_note はそのまま書いた

## H. 怪しい点（Phase 5 の監査へ）

- **aas-congruence は「英語に決まった言い方がない」のまま**。CK-12 Geometry は 4.15 の節の名前が ASA and AAS で、本文にも AAS が 11 回出るが、正弦定理の場合分けと区別するために形（by AAS ／ AAS congruence ／ (AAS) congruence ほか）で数えるので 2 件 ／ 2 件（重複除去の後）で 3 件に届かない。形を件数に合わせて広げることはしなかった
- CK-12 の 1〜2 件で見出しが決まった語: ruler-postulate（1.3 の Additional Resources の**動画の題**）、common-tangent（6.2 の練習問題 1 件）、law-of-syllogism（2 件）。規則どおりだが根拠は薄い
- Wikipedia の記事名で決まった見出しが教室の言い方とずれているかもしれない語: proof by exhaustion（コーパスは proof by cases 3 件・proof by exhaustion 0 件。下書き役も指摘）、modular multiplicative inverse（コーパス 0 件、inverse modulo が 2 ／ 2 件）、Euclid's theorem（素数の無限性）。recursive-algorithm の見出し recursion（話し言葉 ①）は再帰アルゴリズムより広い
- lexicographic-order の見出し alphabetical order は OpenStax Prealgebra の 1 件（語の並びの覚え方の一文）で決まった。experimental-probability → empirical probability は OpenStax Introductory Statistics の 5 件だけ（experimental probability は参照にもコーパスにも 0 件）
- バッチ 6・7 のコーパスで決着した Discrete Math の語の多くは MIT（6.042 の講義とノート）1 ソース頼み（1 ソース頼みの節に並ぶ）
- statistical-variable（変量）の variable と statistical-hypothesis（仮説）の hypothesis は語のままで数えた。変数の意味・証明の仮定の意味も混ざる（pitfalls に書いた）
- quadratic-form（二次形式）の OpenStax の 3 件は「quadratic form の方程式」（x⁴ − 5x² + 4 = 0 を置き換えで解く）で別の意味。前からの問題で、見出しは同じ語なので変えていない。OpenStax を出典には足さなかった
- CK-12 Algebra は一部しか取れていない（A）。中学の本は無い。中学・Algebra の単元の参照は OpenStax 3 冊・IM と CK-12 Algebra の一部だけ
- 件数の注の更新（218 語）は下書き役が件数表どおりに直し、variants の note は evidence と機械的に突き合わせた。それ以外の文の件数は、新しい 3 冊に出る言い方だけを probe で数え直した（前からの 6 冊の文は減っていないので、3 冊に出ない言い方の件数は変わらない）。IM の件数を書いた文は「IM … 件」の形を探して直したので、形の違う書き方が残っているかもしれない
- 「3 件以上」を候補ごと・参照ごとと読んだ（A-2）。参照を合わせて 3 件と読むと、aas-congruence（CK-12 2 ＋ 2）なども規則 2 に移る
- level.jp を内容の学年に直した 31 語は私の判断（apothem・area-of-a-regular-polygon を数I、coordinate-rule を数I、rotational-symmetry を小学校・中1 ほか）
- system-of-inequalities の en.alt system of inequalities を候補から外した（OpenStax の 27 件は 2 変数の不等式の組）。1 変数の連立不等式を system of inequalities と呼ぶ教材があっても数えられない

## K. 残りの行数

**対象の単元（us-geometry-*・us-discrete-math-*・jp-suugaku-1-*・jp-suugaku-a-*）の残りは 0 行。**

**台帳全体の残り: 1,812 行中 654 行**（エントリ 1,158。台帳の行は統合 2 で 1,814 → 1,812）。先頭の単元で数えると、中学 511・Algebra 1／2 123・Pre-Algebra 11・Integrated Math 8・数B 1。

## L. 確認

```
python3 scripts/ledger/refetch.py ck12     # books 2、chapters 20、sections 285（Geometry 173・Algebra 75、転送 37）。再実行は 0 件取得
pnpm corpus:fetch:openstax                 # 9 冊 677 モジュール（新しく 237）。3 冊とも CC BY-NC-SA 4.0
python3 scripts/ledger/fix_phase1.py       # 手順 14: same 35（+2）
python3 scripts/ledger/wikihead.py         # 1,812 行中 1,302 に記事、714 が使える
pnpm corpus:count && pnpm corpus:decide -- --write
                                           # 対象 1,174。主見出し 789 ／ 併記 100 ／ 決まった言い方なし 65 ／ 参照 234 ／ 人間が決めた 29 ／ 判断不能 15 ／ 不一致 0 ／ 直すこと 0
                                           # 重複除去: IM 5,572 文、CK-12 977 文
pnpm crosscheck -- --write                 # 393/393 一致
pnpm exec tsc --noEmit                     # 緑
pnpm validate                              # terms 1,158、警告 0
pnpm spell                                 # 0 件
pnpm test                                  # 115/115
pnpm build                                 # 緑。export: terms.json 1,147（draft 11 を除く）
```
