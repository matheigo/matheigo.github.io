# Phase 3 フレーズ — 修正 1〜5、フレーズのバッチ 1・2（③ が 1 割を超えたので止めた）

作成: 2026-09-26 ／ 対象: 3249a2e（Phase 3 記号と慣習差のレポート）→ 本コミット
指示: audits/phase3-symbols-conventions-report.md を受けた 1〜6。判断は `docs/DECISIONS.md` の「Phase 3 フレーズの前の修正」「Phase 3 フレーズの生成」。

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified の語は 0。

## まとめ

- **1**: 止める規則の ③ は、規則 2 の後で人間レビューに残る ③（corpus-undecided）で数える。DECISIONS に書き、フレーズのバッチも同じ数え方にした
- **2**: 記号の ③ 8 件を指示の読みにし、corpus-human-settled にした（register は主張しない。読みはすべて standard）。**likely 7 ／ draft 1**（ceiling-brackets は ⌈ ⌉ を使う参照がない）。出典に無かった 4 件は、本文で記号を確かめた参照を足した（A-1）
- **3**: 記号の読みは CED でも 3 件以上（lib.ts settleUndecided の cedMin）。**proportion-colon は OpenStax（18 件、読みは同じ）で決まり、max-min-notation は ③ になった**。同じ規則で、バッチ 4 で AP Statistics の CED の 1〜2 件で決めていた **probability-of-union・normal-distribution-n・binomial-distribution-b も ③** になった（4 件とも draft、人間レビュー行き）
- **4**: フレーズを話者のコーパスで数えるようにした（lib.ts `phraseGroup`・`phraseDocs`、probe `--group`、decide の phraseSources の重み、email・discord の 3 件の規則と flag corpus-student-rare）。**class-asking-repeat は ①（say … again）、office-hours-stuck-at-step は要の部分を見直して ①（i'm confused。i don't see how・i don't understand how は variants）**
- **5**: MICASE の学生の発話から **8 行を足した**（office-hours 1、group-study 7）。discussion section と lab section からは 0（C）
- **6**: フレーズを 2 バッチ生成した（**100 行、likely 84 ／ draft 16**）。バッチ 1 の ③ は 3 ／ 50（6%）、**バッチ 2 の ③ は 13 ／ 50（26%）で 1 割を超えたので、バッチ 3 に進まず止めた**。残りは 174 行（5 で足した 8 行を含む）
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて終了コード 0（H）

## A. 修正 2・3 — 記号

### A-1. 人間が決めた 8 件（flag corpus-human-settled）

| id | 記号 | 読み（すべて standard） | 記号を使う参照（出典） | confidence |
|---|---|---|---|---|
| minus-plus-sign | ∓ | minus or plus | **足した**: OpenStax Calculus Volume 1（1.3 の公式 cos(α ± β) = cos α cos β ∓ sin α sin β） | likely |
| sequence-braces | {aₙ} | the sequence a sub n ／ the sequence a n | OpenStax Calculus Volume 2（{aₙ} の記法。あった） | likely |
| ceiling-brackets | ⌈x⌉ | the ceiling of x | なし（OpenStax・CED・IM・CK-12・Nicholson・Levin で ⌈ は 0。OpenStax Calculus は ceiling function の名前だけ） | **draft** |
| repeated-combination-h-jp | ₙHᵣ | the number of combinations with repetition of n things taken r at a time | **足した**: 日本語版 Wikipedia「重複組合せ」（H の記号）。Levin 3.5 はあった（記号は使わない） | likely |
| half-open-interval | [a, b) | the half-open interval from a to b ／ from a to b, including a but not b | **足した**: OpenStax Precalculus（[0, π) ほか） | likely |
| argument-arg-z | arg z | the argument of z ／ arg z | **足した**: Nicholson 付録 A（θ = arg z）。OpenStax Precalculus はあったが arg の記号は使わない | likely |
| polar-form-cis | r cis θ | r cis theta ／ r times cosine theta plus i sine theta | OpenStax Precalculus（r cis θ の略記。あった） | likely |
| arc-ab | 弧 AB | arc AB ／ the measure of arc AB | CK-12 Geometry（弧の記号。あった） | likely |

- repeated-combination-h-jp の notes: 「米国にこの記号はない」「米国では C(n + r − 1, r) と書く（repeated-combination-notation）」。慣習差 repeated-combination-notation とは related で両側に結ばれていた
- polar-form-cis の notes: cis は OpenStax Precalculus（と Algebra and Trigonometry）の略記で、We often use the abbreviation … の形で導入すると確かめて書いた。「日本の教科書は使わない」は教科書を資料に持たないので確かめられず、**確かめた範囲で「高等学校学習指導要領解説に cis が出てこない」と書いた**（日本語版 Wikipedia「複素数」は r cis(φ) と書くこともあると説明するので、それも書いた。E の 5 つ目）
- 読みを変えたもの: half-open-interval の 2 つ目を the interval from a to b, including … から from a to b, including a but not b に（数える形 including * but not * は同じ）、polar-form-cis の順を入れ替え（r cis theta が 1 つ目）、ceiling-brackets と repeated-combination-h-jp は指示の 1 つの読みだけにした（ほかの読みは notes に残した意味の説明だけ）

### A-2. 修正 3 — 記号の読みも CED は 3 件以上

| id | 前 | 後 |
|---|---|---|
| proportion-colon | CED（unit 3 の 1 件）で a is to b as c is to d | **OpenStax（本文 18 件）で同じ読み**。出典の note の「読みを決めた参照」を CED から OpenStax Prealgebra に移した |
| max-min-notation | AP Statistics の CED（2 件）で the larger of a and b | **③**（話し言葉 8 件、ほかの参照は 3 件に届かない）。draft |
| probability-of-union | AP Statistics の CED（topic 2.7、1 件） | **③**（話し言葉 5 件）。draft |
| normal-distribution-n | AP Statistics の CED（試験の例題、2 件） | **③**（話し言葉 2 件）。draft |
| binomial-distribution-b | AP Statistics の CED（試験の例題、1 件） | **③**（話し言葉 1 件）。draft |

- chi-square-symbol（topic 3.14・3.15）は 3 件以上なので決まったまま。③ の 4 件は CED の出典を残し、note から「読みを決めた参照」を外した。spoken_en の順は変えていない（人間レビューで決める）
- 記号の ③ は全体で 5（上の 4 件と、出典が editorial だけの conditional-probability-subscript-jp は ③ ではない）。**人間レビュー行きの記号は max-min-notation・probability-of-union・normal-distribution-n・binomial-distribution-b の 4 件**。記号の draft は 6（この 4 件・ceiling-brackets・conditional-probability-subscript-jp）

## B. 修正 4 — フレーズを話者のコーパスで数える

### B-1. 決めた数え方（DECISIONS「Phase 3 フレーズの前の修正」4）

| グループ | 場面 | 数える文書 | 語数（phraseSources） | ③ のとき |
|---|---|---|---|---|
| student | class-asking・office-hours・group-study・explaining-solution | MICASE の学生の発話だけ | 637,547（1 ソース） | 人間レビュー |
| instructor | class-listening | 講義（MIT OCW・Khan Academy・YouTube）と MICASE の教員の発話 | 4,908,397（16 ソース。MICASE の教員 1,086,214 = 22%） | 人間レビュー |
| written | written-solution・exam | 書き言葉（OpenStax 7 冊・MIT の講義ノート） | 2,756,917（8 ソース） | 参照: CED → OpenStax・IM・CK-12 → Nicholson・Levin の本文で、1 つの参照が 3 件以上使う要の部分（CED も 3 件。lib.ts `settlePhraseReference`） |
| email | email・discord | MICASE の学生の発話 | 637,547 | ①②③ で判定しない。最も多い要の部分が 3 件以上で likely、未満は draft と flag corpus-student-rare |

- 重みは各グループの文書のソースの語数で付ける（count.ts が counts.json に phraseSources を書き、decide が使う）。student は MICASE の 1 ソースなので、① はすべて「MICASE 頼み」（抜くと ③ になるだけなので ① のまま）
- **exam の行のうち試験中に口で言う文は話者で数える**（phrase-forms.ts `PHRASE_SPEAKER`）。今は exam-clarify-instruction（学生が監督に聞く文）だけ。指示の文面どおり書き言葉で数えると、この行は ③（書き言葉で 1 件）になる（F の 1 つ目）
- phrases の en はコーパスの首位の要の部分の文（② は件数順）にする。decide が en と首位が違うフレーズを「直すこと」に出すようにした（terms の en.term と同じ）
- 道具: `pnpm corpus:probe -- --decide --group <student|instructor|written|email> --file x.txt`（書く前に数える）、`pnpm corpus:scenes -- --file x.txt`（MICASE の学生の発話を場面ごとに数える）
- PHRASE_FORMS は lib.ts から scripts/corpus/phrase-forms.ts に移した（バッチごとに伸びるので）

### B-2. 2 件の判定し直し

| id | 要の部分（学生の発話の件数） | 判定 | エントリ |
|---|---|---|---|
| class-asking-repeat | say … again 15 ／ what did you say 9 ／ could you repeat 6 | **①** say … again（首位だけが 10 件以上） | en: Sorry, could you say that again? variants: Could you repeat that last part? ／ Sorry, what did you say?（casual）。I missed that（2 件）は外した |
| office-hours-stuck-at-step | i'm confused 10 ／ i don't see how 6 ／ i don't understand how 5 | **①** i'm confused（首位だけが 10 件以上、1.7:1） | en: I'm confused about how you got from this line to the next one. variants: I don't see how … ／ I don't understand how …。walk … through（学生 2 件）と i'm lost（2 件）は外した |

- 指示の「i don't see how などに見直す」で数えると、i don't see how より i'm confused が多かったので、規則どおり i'm confused の文を en にした

## C. 修正 5 — MICASE の学生の発話から足した候補

### C-1. やり方

- office hours・study group・discussion section・lab section の学生の発話（各 57,340・139,197・15,690・40,664 語）で、質問・依頼・確認の書き出し（can you・does that・is that・so you're saying ほか約 130）から始まる 1〜4 語の n-gram を場面ごとに数え、5 件以上の形を候補にした
- 候補の形を terms と同じ数え方（語形変化をまとめ、「!w」も使う）で数え直した（`pnpm corpus:scenes`）。文脈を見て、質問・確認として使われていない形（so basically は説明の書き出しが多い）を除いた
- ledger/phrases.csv と意図が重なる形（その行の en ／ variants の文で見た）と、数学の授業で使えない形を除いた
- 足した行は ledger/phrases.csv の末尾（267〜274 行）。列 micase_scene・micase_counts（`python3 scripts/ledger/phrases_micase.py` が書く）

### C-2. 足した 8 行（件数は 4 つの場面の学生の発話）

| id | 場面（situation） | 主文 | 形と件数（office hours ／ study group ／ discussion ／ lab） |
|---|---|---|---|
| office-hours-i-was-wondering | office hours（office-hours） | I was wondering if you could look over my answer to number 2. | i was wondering 6 ／ 1 ／ 3 ／ 0 |
| group-study-does-that-mean | study group（group-study） | Does that mean it's not differentiable at x = 0? | does that mean 2 ／ 16 ／ 1 ／ 4 |
| group-study-which-one-do-you-mean | study group | Which one? The second equation? | which one（of・is・you・we・they が続くものを除く）7 ／ 22 ／ 1 ／ 6、are you talking about 1 ／ 5 ／ 0 ／ 4 |
| group-study-is-that-right | study group | The answer is 3, is that right? | is that right 0 ／ 8 ／ 0 ／ 1、is it just 3 ／ 7 ／ 2 ／ 3 |
| group-study-so-youre-saying | study group | So you're saying we should find a common denominator first? | so you're saying 1 ／ 10 ／ 0 ／ 2、oh so 13 ／ 34 ／ 1 ／ 3 |
| group-study-i-thought-it-was | study group | Wait, I thought it was negative. | i thought it was ／ that was 5 ／ 18 ／ 2 ／ 7、i thought you 1 ／ 11 ／ 0 ／ 2 |
| group-study-do-you-see-what-i-mean | study group | Do you see what I mean? | do you see ／ know what i mean ／ what i'm saying 2 ／ 38 ／ 1 ／ 1、does that make sense 2 ／ 19 ／ 0 ／ 0 |
| group-study-what-do-you-mean | study group | What do you mean by "they cancel here"? | what do you mean 2 ／ 9 ／ 2 ／ 6、what does that mean 0 ／ 10 ／ 0 ／ 1 |

- 指示の例のうち、does that mean（16）は入れた。i was wondering if は office hours で 3 件なので i was wondering（6）の形で入れた。how did you get（場面ごとに 3 以下）・can you go over（3 以下）は 5 件に届かず、what's the difference between は class-asking-difference-between と重なる
- どれも生成はしていない（末尾の行で、バッチ 2 で止めたため）

### C-3. 外した形（5 件以上だが意図が重なる）

i have a question（office-hours-question-about-homework）、what if ／ what about ／ how about（class-asking-does-it-still-work-if）、how did you get ／ how do you get ／ what do you get（group-study-how-did-you-get-that・group-study-what-did-you-get）、how come ／ why do（class-asking-why-can-we）、i don't understand（office-hours-stuck-at-step）、i'm not sure（group-study-not-sure-but）、what did you say（class-asking-repeat）、should we（group-study-split-them-up）。discussion section と lab section で 5 件以上になった形は、一般の形（is that ・ do you ・ could you ほか。文脈は歴史の討論や野外実習の野鳥の同定など）か i have a question だけだった。

## D. 修正 6 — フレーズの生成

### D-1. バッチ

| バッチ | 行 | 生成 | likely | draft | ① | ② | 参照で決まった | ③（人間レビュー） |
|---|---|---|---|---|---|---|---|---|
| 1 | 1〜50 | 50 | 47 | 3 | 34 | 10 | 3 | **3（6%）** |
| 2 | 51〜100 | 50（既存 5 行の作り直しを含む） | 37 | 13 | 32 | 4 | 1 | **13（26%）→ 止めた** |
| 計 | 100 | **100** | **84** | **16** | 66 | 14 | 4 | 16 |

- 各バッチで、書く前に話者のコーパスで要の部分を数え（probe と同じ判定）、en を首位の文にし、draft ／ likely を決めた。そのあと corpus:count → corpus:decide -- --write --ids で evidence と flags を書いた。decide の「直すこと」は 0、register の食い違いは 0
- 例文（en ／ ja ／ variants）はすべて自作。MICASE・OCW・OpenStax の文は写していない（要の部分の件数だけを使った）

### D-2. 場面別（生成した 100 行）

| 場面 | 台帳の行 | 生成 | ① | ② | 参照 | ③ | 残り |
|---|---|---|---|---|---|---|---|
| class-listening | 62 | 62 | 44 | 7 | 0 | 11 | 0 |
| written-solution | 50 | 24 | 14 | 4 | 4 | 2 | 26 |
| class-asking | 21 | 9 | 5 | 1 | 0 | 3 | 12 |
| exam | 33 | 3 | 1 | 2 | 0 | 0 | 30 |
| explaining-solution | 35 | 1 | 1 | 0 | 0 | 0 | 34 |
| office-hours | 19 | 1 | 1 | 0 | 0 | 0 | 18 |
| group-study | 23 | 0 | — | — | — | — | 23 |
| email | 17 | 0 | — | — | — | — | 17 |
| discord | 15 | 0 | — | — | — | — | 15 |
| 計 | 274 | 100 | 66 | 14 | 4 | 16 | 174 |

### D-3. ③ の一覧（16 件。draft、corpus-undecided、人間レビュー行き）

| id | 場面 | 数えた要の部分と件数 | 理由 |
|---|---|---|---|
| area-is-never-negative | class-listening | area is always positive ほか 1 ／ area can't be negative ほか 0 | 講義の negative area は符号付き面積の意味（逆の主張）で、候補にしなかった |
| left-side-minus-right-side | written-solution | 0 ／ 0（参照も 0） | 「左辺 − 右辺」の書き方が米国の教材に見つからない |
| the-equation-holds | written-solution | the identity is verified ほか 3 ／ the identity holds ほか | 参照は 3 件に届かない |
| square-and-add | class-listening | square both equations 0 ／ square and add 7 | |
| class-listening-take-out-a-sheet-of-paper | class-listening | take out a sheet of paper ほか 2 ／ pop quiz 4 | 教室の儀式（PLAN 15 の人間レビュー対象） |
| class-listening-turn-to-page | class-listening | turn to page 5 ／ open your books to 0 | 同上 |
| class-listening-pass-your-papers-forward | class-listening | 2 ／ 0 | 同上 |
| class-listening-work-with-a-partner | class-listening | turn to your neighbor ほか 5 ／ with a partner 3 | 同上 |
| class-listening-extra-credit | class-listening | extra credit 6 ／ bonus question ほか 4 | 首位が 3 倍に届かず 10 件未満 |
| class-listening-lowest-quiz-dropped | class-listening | 0 | lowest score はデータの最小値の意味なので形で除いた |
| class-listening-final-is-cumulative | class-listening | is cumulative 0 ／ covers everything 9 | cumulative は累積度数の意味が多いので形で数えた |
| class-listening-lets-go-over-the-homework | class-listening | 1 ／ 1 | |
| class-listening-sanity-check | class-listening | answer make sense ほか 7 ／ sanity check 7 | |
| class-asking-how-do-you-read-this | class-asking | how do you say 2 ／ how do you pronounce 2 | 学生の発話 |
| class-asking-is-there-a-name-for-this | class-asking | what's it called ほか 8 ／ what do you call 5 | 学生の発話。首位が 10 件に届かない |
| class-asking-typo-on-the-board | class-asking | should that be ほか 4 ／ is that supposed to be ほか 3 ／ a typo 3 | 学生の発話 |

### D-4. 参照で決めた 4 件（書き言葉の ③）

what-we-want-to-show（OpenStax、we want to show 4 件）、the-base-is-greater-than-1（OpenStax、the inequality sign 8 件）、let-p-be-the-position-vector-of-p（OpenStax、position vector of 11 件）、by-hypothesis（Nicholson、by hypothesis）。flag corpus-reference-fallback、likely。

### D-5. 生成しなかった 174 行

バッチ 3（101〜150 行: class-asking 12・office-hours 17・explaining-solution 21）から先。学生の場面は MICASE の学生の発話だけで数えるので、バッチ 2 の class-asking（9 行中 ③ 3）より ③ が多くなると見込む（explaining-solution の「I factored it and set each factor equal to zero」のような数学の手順の言い方は、MICASE の学生の発話にほとんど出てこない）。

## E. 確かめた主張

- 記号の出典: OpenStax Precalculus・Algebra and Trigonometry の極形式の節の We often use the abbreviation r cis θ（本文で cis 96 件ずつ）、OpenStax Calculus Volume 1 の 1.3 の cos(α ± β) = … ∓ …（OpenStax で ∓ はこの公式と Volume 3 の成分 1 件の 2 件）、OpenStax Calculus Volume 2 の {aₙ} の記法、OpenStax Precalculus の [0, π) ・[6, 8) ほかの区間、Nicholson 付録 A の θ = arg z、日本語版 Wikipedia「重複組合せ」の H の記号、CK-12 Geometry の弧の記号（150 件）
- 見つからなかったもの: ⌈ ⌉（OpenStax・CED・IM・CK-12・Nicholson・Levin で 0）、高等学校学習指導要領解説の cis ・「重複組合せ」・「複号」（0 件）
- 修正 3 の判定し直し: decide のレポートで、CED の件数（proportion-colon 1、max-min-notation 2、probability-of-union 1、normal-distribution-n 2、binomial-distribution-b 1、chi-square-symbol 3 以上）と、proportion-colon の OpenStax 18 件
- MICASE の話者と場面: manifest の speaker・scene（fetch-micase.ts）。学生の発話の語数は場面別に数えた（C-1）。discussion section と lab section の文脈（歴史の討論、野外実習の野鳥の同定、化学・土木の実験室）は @Situation と用例で見た
- 要の部分の別の意味（文脈を 6〜10 件見た）: negative area（符号付き面積）、lowest score（データの最小値）、cumulative（累積度数）、so basically（説明の書き出し）、which one（質問の which one ?）、do you mean（what do you mean を含む）
- 生成した 100 行の判定: 書く前の判定（probe と同じ lib.ts の関数）と、corpus:count → corpus:decide の書き戻しの結果が一致した（likely 84 ／ draft 16、flag の内訳）

## F. 怪しい点

- **exam の行を話者で分けたのは、指示の文面（exam は書き言葉のコーパスと参照）からはみ出している**。今は exam-clarify-instruction（学生が試験中に聞く文）だけが student で、① what do you mean by（学生の発話 10 件）。書き言葉で数えると ③（1 件）。残りの exam の行には、学生が聞く文（exam-ask-typo・exam-ask-scratch-paper・exam-ask-can-i-write-on-the-back・exam-ask-how-much-time・exam-when-do-we-get-it-back・exam-is-it-curved）と監督の合図（exam-time-remaining・exam-pencils-down・exam-notes-allowed・exam-partial-credit ほか）があり、同じ扱いにするかどうかで ③ の数が変わる
- **学生の場面の ① はすべて MICASE の 1 ソースに頼る**。MICASE の学生の発話は全分野（生物・化学・歴史ほか）で、数学の授業の発話ではない。首位だけが 10 件以上の ①（say … again 15、i'm confused 10、what do you mean by 10、is that okay 14 ほか）は件数が少ない
- 要の部分に一般的な語を使ったもの（件数に別の用法が混ざる）: how do you get・first i・what if・is that okay（学生）、next step・notice that・remember that・what happens if・graph it・office hours・a volunteer（講義）、since・because・therefore・passes through・in general（書き言葉）。どれも判定は変わらないと見たが、evidence の件数は文の意図だけの件数ではない
- class-listening の 11 件の ③ のうち 9 件は教室の儀式（紙を出す、ページを開く、提出、加点、成績）で、講義の書き起こしにも MICASE の教員の発話にもほとんど出てこない。PLAN 15 の「人間レビューの対象（教室の儀式）」どおりだが、フレーズの ③ が 1 割を超えた主な原因になった
- 数えない variants（要の部分 ""）を置いたもの: let-p-be-the-position-vector-of-p（Let p = OP.）、by-hypothesis（Since AB = CD is given,）、are-equal-respectively（AB = DE, … の式）、evaluate-critically（Does this conclusion hold up? の hold up は別の意味が多い）、written-solution-therefore（So …）
- evaluate-critically の critique は、件数のすべてが MICASE の教員の発話（数学以外の授業の「作品を批評する」を含む）
- 書き言葉の ③ を参照で決めるとき、OpenStax は書き言葉のコーパスと同じ本文なので、「コーパスで 10 件に届かないが OpenStax で 3 件以上」がそのまま参照の決定になる（the-base-is-greater-than-1 ほか 3 件）
- polar-form-cis の「日本の教科書は使わない」は確かめられなかった（教科書を資料に持たない）。書いたのは「学習指導要領解説に cis が出てこない」と日本語版 Wikipedia の説明だけ
- repeated-combination-h-jp の「米国では C(n + r − 1, r) と書く」は指示どおり書いた。Levin 3.5 は stars and bars を二項係数で数えるが、PDF のテキストでは二項係数の形（上下の段）を読み取れず、式の形そのものは確かめていない
- 修正 3 は指示の 2 件のほかに 3 件の記号を ③ にした（規則はすべての記号に当たるため）
- 5 で足した 8 行は台帳の末尾に置いたので、止めた時点で 1 行も生成していない
- DECISIONS に「監督の合図は instructor」と書いたが、その行（exam-pencils-down ほか）はまだ生成しておらず、PHRASE_SPEAKER にも入っていない

## G. 次に要ること

- 止めた理由の ③（D-3 の 16 件）の人間レビュー。とくに教室の儀式 9 件と、学生の質問 3 件
- 記号の ③ 4 件（max-min-notation・probability-of-union・normal-distribution-n・binomial-distribution-b）の人間レビュー
- exam の話し言葉の行を話者で数えるか（F の 1 つ目）の確認
- 学生の場面（バッチ 3 以降）の数え方: MICASE の学生の発話だけでは ③ が多くなる見込み（D-5）。止める規則のままで進めるかどうか

## H. 確認（合否はすべて終了コード）

```
pnpm exec tsc --noEmit        # exit 0
pnpm validate                 # exit 0。terms 1,540 ／ symbols 220 ／ phrases 100 ／ conventions 71 ／ curriculum 163、警告 0
pnpm spell                    # exit 0。2,102 ファイル、0 件
pnpm test                     # exit 0。152/152（4 ファイル。話者のグループ・書き言葉の参照・記号の CED 3 件で 3 を足した）
pnpm build                    # exit 0。1,540 ページ。export: phrases.json 84（draft 16 を除く）、symbols.json 214（draft 6 を除く）
pnpm corpus:count             # exit 0（修正の後、バッチ 1 の後、バッチ 2 の後の 3 回）
pnpm corpus:decide -- --write --ids <各回の対象>
                              # 各回 exit 0。最後: 主見出し 1,287 ／ 併記 184 ／ 決まった言い方なし 76 ／ 参照 313 ／ 人間が決めた 51 ／
                              # 判断不能 21（phrases 16・symbols 4・terms 1）／ 食い違い 0 ／ 直すこと 0
```

- 各バッチのコミット前にも tsc・validate・spell・test を回し、exit 0 を確かめた。バッチ 2 の test は最初 exit 1（大文字で始まり s で終わる語の検査に、フレーズの文頭の Oops と複数形の Tuesdays が当たった）。検査の除く語に足して exit 0（DECISIONS）
- ネットワークには出ていない（MICASE・参照・コーパスは手元のファイルだけを読んだ）。そのため取得のタイムアウト・リトライ・キャッシュを使う場面はなかった
- `pnpm crosscheck` は terms を変えていないので回していない
