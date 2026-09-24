# Phase 2 レポート — 積分の単元（123 語）

作成: 2026-09-24 ／ 対象: 387a7d4 → 6e80e63（バッチ 1）→ ac69661（バッチ 2）→ 68e08cf（バッチ 3）→ 本コミット（レポート）
手順（バッチごと）: `docs/STYLE.md` を読み直す → `pnpm corpus:probe` で候補表現を数える → 生成 → `pnpm validate` → `pnpm corpus:count` → `pnpm corpus:decide -- --write` → `pnpm crosscheck -- --write` → related の後方リンクと curriculum の term_refs → `pnpm spell` → コミット

**これは生成したセッション自身の自己監査です。** 下の「怪しい点」は直しておらず、Phase 5 の別セッション監査に回すための一覧です（CLAUDE.md 絶対ルール 8）。

## まとめ

- **生成 123 語**（台帳の unit に積分の 8 単元のいずれかを含む行。重複なし、既存と重なる語 0）。50 ／ 50 ／ 23 の 3 バッチ・3 コミット
- **likely 120 ／ draft 3**（accumulation-function・areas-and-distances・rationalizing-substitution）。verified は 0（自分で生成した語は上げない）
- **register 不一致 0**。見出し語と register は書く前にコーパスで数えて決めたので、decide の結論と食い違ったものはない
- **③ 判断不能 52 語**（うち 0 件ヒット 18 語）→ `corpus-undecided` が付いて人間レビュー行き。一覧は E
- **crosscheck 27/27 一致**（既存 4 ＋ 新規 23）
- パイプラインを 4 か所直した（F）。そのうち decide の修正で **既存の 9 エントリにも初めて `corpus-undecided` が付いた**（G）
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて緑（validate 警告 0、spell 0 件、test 46/46、build 141 ページ、export の terms は 130 件＝draft 3 件を除く）

## A. 数字（123 語）

| 項目 | 内訳 |
|---|---|
| confidence | likely 120 ／ draft 3 |
| mapping | exact 84 ／ near 33 ／ none 6 |
| pos | noun 93 ／ phrase 28 ／ verb 2 |
| en.register | both 37 ／ written 18 ／ spoken 16 ／ 書かない 52（両 register とも ③） |
| 出典（延べ） | textbook 90 ／ editorial 60 ／ wikipedia-langlink 23。editorial だけの語は 33 |
| コーパス（話） | ① 45 ／ ② 11 ／ ③ 67 |
| コーパス（書） | ① 56 ／ ② 4 ／ ③ 63 |
| flags | corpus-undecided 52 ／ draft-reason 3 ／ langlink 系 0 |

- 台帳の pos は動詞が 2 語（積分する・置き換える）だけで、動作は phrase（部分積分する、u とおく…）として入っている。例文は動詞・句の 30 語すべてで spoken と written を 1 文ずつ置いた
- textbook は OpenStax の巻まで書いた（Calculus Volume 1 ／ 2 ／ 3、Algebra and Trigonometry 2e、Introductory Statistics 2e）。どれも `corpus:probe` でその巻の本文（1 語だけ節の名前）に en.term か en.alt が出ることを確かめてから付けた

## B. draft の一覧と理由

| id | 見出し | 理由（flags の `draft-reason` に同じ文） |
|---|---|---|
| accumulation-function | 累積関数 ／ accumulation function | AP Calculus で使う名前だが、出典にできる資料（Wikipedia の記事・OpenStax の本文）で確かめられない。コーパスでも 0 件（Khan Academy の AP Calculus を含む） |
| areas-and-distances | 面積と距離 ／ areas and distances | 台帳の行は教科書の節の名前（Stewart の 5.1 と思われる）で、英語の決まった用語ではない。OpenStax・Wikipedia で確かめられず、コーパスでも 0 件。残すか riemann-sum などに統合するかは人間が決める |
| rationalizing-substitution | 有理化置換 ／ rationalizing substitution | 教科書の小見出しの名前（Stewart の 7.4 と思われる）だが、OpenStax・Wikipedia で確かめられず、コーパスでも 0 件 |

基準（DECISIONS）: 英語側が固有の用語を名乗る名詞で、Wikipedia・OpenStax のどちらでも確かめられないもの。英語が説明的な句のもの（area between a parabola and a line、integration by long division など）は用語を名乗っていないので editorial で likely にした。Stewart は手元で確かめられないので、書名を出典にしていない。

## C. 台帳から変えたもの（台帳そのものは直していない）

### C-1. ja.term（2 語）

| id | 台帳 | エントリ | 理由 |
|---|---|---|---|
| integration-formulas | 積分表 | 積分公式（alt 不定積分の公式） | 積分表は table of integrals（using-integral-tables の側） |
| hydrostatic-force | 静水圧 | 静水圧による力 | 静水圧は pressure で、force とは別の量 |

### C-2. en.term（27 語。コーパスの ① ② か、台帳の英語が不自然・別概念だったもの）

interval-of-integration → limits of integration（書 ①・話 ② bounds of integration と併記）／ definite-integrals-and-area → signed area ／ properties-of-integrals → properties of the definite integral（書 ①）／ find-the-intersections-to-get-the-limits → find the points of intersection ／ reverse-of-differentiation → antidifferentiation ／ integral-involving-absolute-value → integral involving an absolute value ／ enclosed-region → the region bounded by（話・書 ①）／ summation-notation → sigma notation（話 ①、書は ② summation notation と併記）／ integral-involving-radicals → integral involving a square root ／ substitution-in-a-definite-integral → substitution with definite integrals ／ volume-by-cross-sections → slicing method（書 ①）／ velocity-and-position → position and velocity ／ write-dx-in-terms-of-du → solve for dx（話 ①）／ integrate-by-parts → use integration by parts（話 ②・書 ①）／ which-one-to-differentiate → pick u（話 ①。書 ① は choose u）／ integrate-by-parts-repeatedly → integrate by parts twice ／ find-the-area-by-integration → use integration to find the area ／ can-be-integrated → integrable（書 ①）／ find-an-antiderivative → take the antiderivative（話 ①。書 ① は find the antiderivative）／ integrals-giving-inverse-trig-functions → integrals resulting in inverse trigonometric functions ／ midpoint-riemann-sum → midpoint rule（書 ①）／ fundamental-theorem-of-calculus-part-1・part-2 → 「…calculus, part 1 ／ 2」（教科書の表記）／ using-integral-tables → table of integrals ／ comparison-test-for-integrals → comparison theorem ／ probability-density-and-integrals → probability density ／ substitute-new-variable → make a substitution（話 ②）

### C-3. mapping（13 語）

exact → near: interval-of-integration、definite-integrals-and-area、integral-involving-radicals、inequalities-involving-integrals、integration-by-completing-the-square、antiderivatives、substitution-rule、trigonometric-substitution、probability-density-and-integrals ／ near → exact: upper-limit（lower-limit と揃えた）、summation-notation、revolve-around-the-x-axis、disk

### C-4. level（99 語）

台帳の level は単元ごとの既定値なので、内容で付け直した。パターンは 3 つ。

1. 数IIの基本語（不定積分・定積分・上端…の 27 語）に 数III を足した
2. 数III 積分法の行の既定値 `AP Calculus BC | Calculus II` を、AB の範囲の内容（u-substitution、三角関数・指数関数の積分、面積、回転体の disk ／ washer など）は `AP Calculus AB | Calculus I`（体積は `AP Calculus AB | Calculus II`）に直した。BC だけの内容（部分積分、部分分数、広義積分、Euler 法、ロジスティック、曲線の長さ）は BC ／ Calc II のまま。shell method・三角置換・三角関数の積の積分は AP の範囲外として Calculus II だけにした
3. 米国側から洗った行の level.jp「大学」を、日本の学習者がその内容に出会う段階に直した（左・右リーマン和、変位、移動距離、shell method などは 数III。関数の平均値・広義積分・Euler 法・ロジスティック・中点和は 大学のまま）

語ごとの前後は `git diff 387a7d4 68e08cf -- data/terms` と台帳の level_jp ／ level_us 列で追える。

## D. 自己監査 — 怪しいと思った点（直していない。Phase 5 へ）

### D-1. 出典やコーパスで確かめていない米国側の主張（記憶による）

pitfalls ／ mapping_note に書いたが、手元の資料では確かめていないもの。監査で最優先に見てほしい。

- shell-method: 「AP Calculus の試験範囲は disk と washer までで、shell method は含まれない」
- trigonometric-substitution: 「AP Calculus の試験範囲には含まれない」
- function-defined-by-an-integral ／ accumulation-function ／ accumulation: 「AP Calculus では accumulation function と呼ぶ」「AP は積分の単元を accumulation of change として組み立てる」
- fundamental-theorem-of-calculus（-part-1 ／ -part-2）: 「どちらを Part 1 と呼ぶかは教科書によって逆のことがある」「second fundamental theorem を d/dx ∫ₐˣ の名前として使う教材もある」
- axis-of-revolution: 「米国の問題では座標軸以外の直線を回転軸にすることが多い」
- integrate-by-parts-repeatedly: 「教科書によっては tabular integration を紹介している」／ liate: 「LIPET などの変種」
- cross-sectional-area: 「日本は S(x)、米国は A(x)」／ summation-notation: 「米国の微積分の教科書は添字に i が多い」
- indefinite-integral ／ antiderivative: 「日本の数IIの教科書には不定積分と原始関数を同じ意味で定義するものがある」
- differential-equation: 「日本の数IIIでは微分方程式を発展的な内容として軽く扱うことが多い」
- one-sixth-formula: 「米国の授業は途中式を重く見るので、公式だけで答えると過程が足りないと見られることがある」（STYLE 原則 10 の一般化に近い）
- change-the-limits-of-integration ／ substitution-in-a-definite-integral: 「x と t の対応表は米国では書かない」／ write-dx-in-terms-of-du: 「米国の教科書は dx を解き出さない書き方が多い」
- hydrostatic-force: 「米国の問題は pound・foot を使うことが多い」

### D-2. 見出し語の選び方が危ういもの

- **find-an-antiderivative → take the antiderivative**: 話し言葉 ① だが 92 件中 81 件が Khan Academy。重み付けはソースの語数を均すもので、語ごとの偏りは均さない。大学の講義（MIT OCW）では find an antiderivative が多い（pitfall に書いた）
- **which-one-to-differentiate → pick u**: 話し言葉 13 件で、10 件が YouTube
- **can-be-integrated → integrable**: 書き言葉 ① に従ったが、日本語の「積分できる」（式で求まる）と integrable（定積分が存在する）は意味が違う。mapping near と mapping_note で書いたが、見出しを integrable にしてよいかは人間の判断が要る
- **substitute-new-variable → make a substitution**: 中3 の「x + 1 を A と置き換える」と、数III の置換積分の両方を 1 語で受けている。Algebra 1 の教室で make a substitution と言うかはコーパス（ほぼ大学の講義と YouTube）では確かめられていない
- **definite-integrals-and-area → signed area、probability-density-and-integrals → probability density**: 節の名前の行を、中身を表す英語に置き換えた。後者は台帳の別の行 probability-density-function（数B）と近い
- **midpoint-riemann-sum → midpoint rule**: 書き言葉 ① に従ったが、AP では midpoint Riemann sum と言うはず（コーパスでは 0 件で確かめられない）
- **one-sixth-formula**: en.term の one-sixth formula は直訳で、米国では通じないと mapping_note に書いた。サイトで見出しだけ見た人が英語の名前だと誤解するおそれがある
- **integral（インテグラル）**: 日本語の見出しがカタカナで、中身は「英語の integral は記号ではなく式を指す」という注意。見出しとして立てる意味があるか

### D-3. 同じ概念が別の行になっているもの（統合の候補）

台帳どおり別エントリにし、related で結んだ。統合するかは人間が決める（DECISIONS）。

- 面積: area-between-two-curves（2 曲線間の面積）／ area-between-curves（曲線間の面積）／ area-bounded-by-curves（曲線で囲まれた面積）／ the-area-of-the-region-bounded-by ／ enclosed-region ／ area-between-a-parabola-and-a-line
- 和の極限: limit-of-a-riemann-sum（定積分と和の極限）／ limit-of-riemann-sums（リーマン和の極限）／ write-as-a-limit-of-a-sum
- 原始関数: antiderivative ／ antiderivatives（不定積分と原始関数）／ find-an-antiderivative ／ reverse-of-differentiation ／ inverse-operation
- 偶関数・奇関数: integrals-of-even-and-odd-functions ／ integral-of-an-even-function ／ integral-of-an-odd-function
- 置換: integration-by-substitution ／ substitution-rule（置換法則）／ substitute-new-variable ／ let-u-equal
- 部分分数: partial-fraction-decomposition ／ decompose-into-partial-fractions ／ integration-by-partial-fractions
- 計算する: evaluate-the-definite-integral ／ evaluate-the-integral
- 積分定数: constant-of-integration ／ plus-c ／ dont-forget-the-plus-c
- 累積: function-defined-by-an-integral ／ accumulation-function ／ accumulation、net-change ／ net-change-theorem
- 曲線の長さ: arc-length-of-a-curve ／ find-the-arc-length
- 記号の読み: terms/the-integral-from-a-to-b（∫ a から b）は symbols/integral-definite と内容が重なる（台帳の note も「symbols へ」）

### D-4. 教科書の節の名前にあたる行

定積分と面積、速度と位置、面積と距離（draft）、不定積分と原始関数、積分表の利用、確率密度と積分、定積分と不等式、三角関数の積分、指数関数の積分、分数関数の積分、無理関数の積分。辞典の見出し語として立てるか、中身の用語のエントリに寄せるかは台帳の判断。

### D-5. 日本語の見出しが本プロジェクトの訳語のもの

円板法、ワッシャー法、シェル法（日本ではバウムクーヘン積分。ja.alt に入れた）、純変化量、純変化定理、累積関数、置換法則、有理化置換、左 ／ 右 ／ 中点リーマン和、円柱の殻、長除法による積分、静水圧による力。mapping_note に「本プロジェクトの訳語」と書いたものと書いていないものがある。日本語側の妥当性は人間レビューの対象（PLAN 15）。

### D-6. パイプラインの限界で ③ になったもの

- **複数形を数えない**: countPhrase は literal なので、cylindrical shell は複数形 cylindrical shells（話 24・書 20）が数えられず ③。solid of revolution、Riemann sums なども同じ
- **句読点を落とさない**: fundamental theorem of calculus, part 1 は「,」の有無で別の表現になる（DECISIONS）
- **活用形・目的語が間に入る動詞句**: revolve ／ rotate ... around the x-axis は「rotate this region around」のように間に語が入るので、literal ではほぼ 0 件
- **汎用語を候補から外した**: substitution・average value・total distance・above the x-axis などは、別の意味でも数えられるので候補表現に入れなかった（DECISIONS）。外したこと自体が判定を動かしている。どれを外したかは各エントリの pitfalls ／ mapping_note に書いてある
- ③ 52 語のうち 18 語は 0 件で、ほとんどが説明的な句（dont-forget-the-plus-c、area-is-never-negative など）。コーパスが「言わない」と言っているのか、言い方が少しずつ違うだけなのかは件数からは分からない

### D-7. 弱い出典

- constant-of-integration（OpenStax Calculus Volume 3 に 2 件）、limit-of-a-riemann-sum（Volume 3 に 1 件）、inverse-operation（Algebra and Trigonometry に 1 件、しかも代数の意味）、integrals-giving-inverse-trig-functions（Volume 1 に 1 件）、area-between-curves（節の名前のみ）
- surface-area-of-revolution の wikipedia-langlink は「回転面 → Surface of revolution」で、見出しのうち「回転面」の部分の対応（source の note に書いた）
- editorial だけの語が 33 語ある（動詞・句と、mapping none ／ near の説明が中心）

### D-8. 台帳の langlink の取りこぼし（原因は未確認）

台帳で wikidata だけ、または wiki なしだった行のうち、2026-09-24 の MediaWiki API では en の langlink があり、カテゴリも 4 段以内のものがあった: リーマン和、広義積分、弧長、ロジスティック方程式、置換積分、変数分離、総和、回転体、回転面、バウムクーヘン積分。エントリ側で出典にした（DECISIONS）。`scripts/ledger/build.py` は lllimit=500 を付けているので件数の上限ではなさそうで、台帳のキャッシュ（`wiki_cache.json`）はこのマシンに無く、原因は確かめていない。台帳全体を取り直すと、ほかの単元でも wikidata → wikipedia-langlink に上がる行があるかもしれない。

## E. 人間レビュー行き（③ 52 語。話・書は生の件数）

integrals-of-even-and-odd-functions（偶関数・奇関数の積分｜話 0・書 2）、one-sixth-formula（1/6 公式｜0・0）、area-between-a-parabola-and-a-line（放物線と直線で囲まれた面積｜0・0）、function-defined-by-an-integral（定積分で表された関数｜0・0）、dont-forget-the-plus-c（積分定数を忘れない｜0・0）、top-minus-bottom（上の曲線から下の曲線を引く｜5・1）、find-the-intersections-to-get-the-limits（交点を求めて積分区間を決める｜0・9）、inverse-operation（逆演算｜2・0）、reverse-of-differentiation（微分の逆｜6・2）、split-the-integral（積分区間を分ける｜5・1）、integral-involving-absolute-value（絶対値を含む積分｜7・1）、area-is-never-negative（面積が負にならない｜0・0）、integrals-of-trigonometric-functions（三角関数の積分｜0・2）、integral-of-the-exponential-function（指数関数の積分｜0・4）、integral-of-a-rational-function（分数関数の積分｜0・3）、integral-involving-radicals（無理関数の積分｜0・0）、substitution-in-a-definite-integral（定積分の置換積分｜0・2）、integral-of-an-even-function（偶関数の定積分｜0・0）、integral-of-an-odd-function（奇関数の定積分｜0・0）、limit-of-a-riemann-sum（定積分と和の極限｜1・1）、inequalities-involving-integrals（定積分と不等式｜0・0）、area-bounded-by-curves（曲線で囲まれた面積｜0・1）、volume-of-a-solid-of-revolution（回転体の体積｜4・29。書は首位 20 が次点 9 の 3 倍に届かず、次点が 10 件未満）、velocity-and-position（速度と位置｜3・5）、integrate-by-parts-repeatedly（何回か部分積分する｜8・2）、decompose-into-partial-fractions（部分分数に分解する｜0・4）、find-the-area-by-integration（面積を積分で求める｜0・0）、revolve-around-the-x-axis（x 軸のまわりに回転させる｜1・0）、revolve-around-the-y-axis（y 軸のまわりに回転させる｜5・1）、add-up-thin-disks（薄い円板を足し合わせる｜0・0）、cylindrical-shell（円柱の殻｜5・7）、write-as-a-limit-of-a-sum（和の極限として表す｜0・0）、integrate-the-inequality（不等式を積分する｜1・0）、check-by-differentiating（微分して確かめる｜2・0）、integrals-giving-inverse-trig-functions（逆三角関数の積分｜0・1）、accumulation（累積｜5・3）、integration-by-long-division（長除法による積分｜0・0）、integration-by-completing-the-square（平方完成による積分｜0・0）、accumulation-function（累積関数｜0・0）、area-between-curves（曲線間の面積｜7・5）、axis-of-revolution（回転軸｜4・20。書は 13 対 7 で 3 倍に届かず）、integration-by-partial-fractions（部分分数による積分｜0・8）、liate（LIATE｜2・7）、areas-and-distances（面積と距離｜0・0）、limit-of-riemann-sums（リーマン和の極限｜0・2）、fundamental-theorem-of-calculus-part-1（微積分学の基本定理 第 1 部｜5・13。書は 8 対 3 対 2 で決まらず）、substitution-rule（置換法則｜5・2）、rationalizing-substitution（有理化置換｜0・0）、using-integral-tables（積分表の利用｜7・7）、convergence-of-improper-integrals（広義積分の収束｜0・0）、comparison-test-for-integrals（比較判定法（積分）｜0・5）、surface-area-of-revolution（回転面の面積｜2・9）

## F. パイプラインの変更

| 変更 | ファイル | 理由 |
|---|---|---|
| `pnpm corpus:probe` を新設。候補表現をコーパスで数えて件数だけ出す（ソース別・OpenStax は巻別）。重複除去は corpus:count と同じ。キャッシュは `corpus/probe-cache.json`（gitignore） | `scripts/corpus/probe.ts`、`package.json` | 見出し語と register を書く前に頻度で決めるため。本文は出さない |
| `normalize` に u substitution → u-substitution、anti-derivative ／ anti derivative → antiderivative を足した（u sub は足さない）。テスト 1 件 | `scripts/corpus/lib.ts`、`tests/corpus.test.ts` | ハイフンの有無は同じ言い方。u sub は添字の読みと区別できない |
| corpus:decide が 0 件の語も ③ として判定する | `scripts/corpus/decide.ts` | counts.json に載らない 0 件の語が人間レビューを素通りしていた |
| crosscheck が 429 で待って再試行する | `scripts/crosscheck.ts` | 10 件ほどで 429 になり、残りが skip のまま記録されなかった |

## G. 既存エントリへの影響

- decide の修正で、Phase 0 の 9 エントリに `corpus-undecided` が付き、evidence（sources: [] と counted）が入った: terms/sign-chart、terms/am-gm-inequality、symbols/square-root、symbols/summation-sigma、phrases の 5 件すべて。これまでは 0 件のため flag が付かず、人間レビューに回っていなかった
- related の後方リンク: completing-the-square → integration-by-completing-the-square、substitute → substitute-new-variable を足した
- curriculum の term_refs: 積分の 8 単元に加え、語が属するほかの単元（数B 数列、中3 展開・因数分解など）にも入れた。Phase 0 のサンプル 10 語も入った（curriculum は計 18 ファイル）
- `audits/corpus-2026-09-24.md` は decide を回すたびに同じ日付で上書きされる（前の版は git にある）

## H. DECISIONS に足した行（19 行。`docs/DECISIONS.md` の「Phase 2（積分の単元）」）

1. Phase 2 は積分の 8 単元から始める（123 行、50／50／23 の 3 バッチ）
2. 見出し語と register は、書く前に `corpus:probe` で数えて決める。③ の register は主張しない
3. 候補表現に、別の意味でも大量に数えられる汎用語を入れない。collocations は見出し語を含むか件数の小さいものにする
4. `normalize` に表記ゆれ 2 つ（u-substitution、antiderivative）
5. corpus:decide は 0 件の語も ③ と判定する
6. crosscheck は 429 で待って再試行する
7. 出典の付け方（langlink は台帳と同じ規則、textbook は巻まで・本文に出るときだけ、editorial の範囲）
8. draft の基準（固有の用語を名乗る名詞で、Wikipedia・OpenStax で確かめられないもの。理由は `draft-reason`）
9. 例文の register は例文の文体。動詞・句は spoken と written を 1 文ずつ
10. 同じ概念の別の行は台帳どおり別エントリにし、統合は人間が決める
11. 台帳の en・mapping は付け直すが、台帳そのものは直さない
12. curriculum の term_refs に、生成済みの語を台帳の順で入れる
13. integration-formulas の ja: 積分表 → 積分公式
14. 説明的な句の英語は mapping near ＋ editorial で likely、accumulation function は draft
15. 前のバッチの語から新しいバッチの語への related は新しいバッチのコミットで足す
16. hydrostatic-force の ja: 静水圧 → 静水圧による力
17. OpenStax の節の名前（manifest の title）も textbook 出典の確認に使う
18. 句読点を含む見出しは、句読点なしの形も en.alt に入れる
19. level も台帳の既定値から内容で付け直した（99 語）

## I. 確認

```
pnpm exec tsc --noEmit        # 緑
pnpm validate                 # terms 133 / symbols 5 / phrases 5 / conventions 3 / curriculum 165、警告 0
pnpm spell                    # 318 ファイル、0 件
pnpm test                     # 46/46
pnpm build                    # 141 ページ、export: terms.json 130（draft 3 を除く）
pnpm crosscheck               # 27/27 一致
pnpm corpus:decide            # 主見出し決着 76 ／ 併記 15 ／ 判断不能 61（うち積分 52・既存 9）／ register 不一致 0
```
