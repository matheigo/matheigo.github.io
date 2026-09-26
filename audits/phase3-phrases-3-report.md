# Phase 3 フレーズ 3 — 修正 1〜4（Math Stack Exchange・止める規則・人間が決めた 17 行・notes）、フレーズのバッチ 4〜6（台帳の最後まで）

作成: 2026-09-26 ／ 対象: b9ef159（Phase 3 フレーズ 2 のレポート）→ 本コミット
指示: audits/phase3-phrases-2-report.md を受けた 1〜5。判断は `docs/DECISIONS.md` の「Phase 3 フレーズ 3 の前の修正」「Phase 3 フレーズの生成 3」。

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified の語は 0。

## まとめ

- **1**: Math Stack Exchange の件数を phrases の学生の場面と email・discord にだけ足した（scripts/corpus/mse.ts・fetch-mse.ts、`pnpm corpus:fetch:mse`）。検索は **252 件**（すべてキャッシュ scripts/corpus/mse-counts.json に保存）。Math Stack Exchange を引いたフレーズは **60 行**、そのうち **46 行が 3 件以上で likely**（学生の場面 28、email 10、discord 8）、14 行は 3 件未満のまま
- **2**: 止める規則は、学生の場面と email・discord の ③ を数えない。バッチ 4〜6 で止める規則に数える ③ は 2 ／ 4 ／ 0（4% ／ 8% ／ 0%）で、**一度も止まらなかった**
- **3**: 止まっていた 17 行のうち **15 行は 1（Math Stack Exchange）で決まり**、**2 行（class-asking-go-back・class-asking-slow-down）が指示の文で corpus-human-settled** になった。人間が決めていた class-asking-how-do-you-read-this も 1 で決まった
- **4**: phrases に任意項目 `notes` を足した（スキーマ・サイト・型）。left-side-minus-right-side の文を flag の note から notes に移した
- **5**: 残り 125 行を 3 バッチ（50 ・50 ・25）で生成し、**台帳の 275 行をすべて生成した**。125 行は likely 107 ／ draft 18。**全 275 行は likely 257 ／ draft 18**（export の phrases.json は 257）
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて終了コード 0（K）

## A. 修正 1 — Math Stack Exchange

### A-1. 作ったもの（DECISIONS「Phase 3 フレーズ 3 の前の修正」1）

- 取得: Stack Exchange API 2.3 の `/search/advanced`（`site=math`、`q` は要の部分を引用符で囲んだ完全一致）。filter は `/filters/create` で `.total`・`.quota_remaining`・`.quota_max`・`.backoff` だけを含めた `!9n30I5cCu9fW`。**質問の本文・題名は取っていない**。API キーは使っていない
- `pnpm corpus:fetch:mse`: corpus/counts.json から「要るフレーズ」（mse.ts `needsMse`）を選び、足りない検索だけを 1 回でまとめて送る。タイムアウト 20 秒・リトライ 3 回・進捗 done/total、1 件ごとにキャッシュへ保存、quota が 0 か throttle のエラーで止まる（翌日に同じコマンドで続く）。`-- --dry` は一覧だけ
- 数え方: 検索は完全一致で語形変化をまとめないので、要の部分を「A | B」の選択肢ごとに検索して足す。「!w」は外し、「…」の選択肢は数えない。**数学の質問のサイトで別の意味になる選択肢 24 個は検索しない**（mse.ts `MSE_SKIP`。scroll up、more slowly、have a second、right direction、without a calculator、another sheet、would it be possible to、at a different time ほか。1 つ（use the back）は件数を見た後に足した。H）
- decide: 学生の場面で MICASE の首位が 3 件未満なら Math Stack Exchange の首位の要の部分を見て、3 件以上なら attested（flag corpus-attested-only、note に「Math Stack Exchange の質問で首位の要の部分 … （n 件）」と MICASE の首位）。email・discord は MICASE と Math Stack Exchange のどちらかで 3 件以上なら likely（Math Stack Exchange で決まったものは corpus-attested-only に件数を残す）。①② には入れない。decide のレポートに「Math Stack Exchange で数えたフレーズ」の節を足した
- probe `--decide` は学生の場面・email で MICASE が足りないとき、キャッシュの件数も出す（取得はしない）
- docs/SOURCES.md に出典（Mathematics Stack Exchange、CC BY-SA 4.0、使うのは件数だけ）、STYLE・PLAN・CLAUDE.md に使い方を書いた。テストを 3 件足した（tests/corpus.test.ts。検索語の作り方・件数の足し方・どの行で引くか）

### A-2. 件数と使った回数

| | 件数 |
|---|---|
| 検索（キャッシュの件数） | **252**（3 件以上 141、0 件 73） |
| API へのリクエスト（今日） | 検索 252 ＋ 手元の確かめ 10（filter の作成を含む）= 262 ／ 300。残り 38 |
| 取得の回 | 4 回（修正 1 の 17 行 131 件 ＋ 1 件、バッチ 5 で 81 件、バッチ 6 で 39 件）。失敗・リトライ 0 |
| Math Stack Exchange を引いたフレーズ | **60 行**（学生の場面 35、email 13、discord 12） |
| うち 3 件以上で likely | **46 行**（class-asking 8、office-hours 8、exam の学生の質問 2、group-study 10、email 10、discord 8） |
| うち 3 件未満 | 14 行（学生の場面 7: ③ 5 と指示 3 の文にした 2、email 3 ・discord 4 は draft） |

60 行の件数（首位の要の部分）は audits/corpus-2026-09-26.md の「Math Stack Exchange で数えたフレーズ」の表にある。

## B. 修正 3 — 止まっていた 17 行（phrases-2 の F）

| id | 1 の結果（Math Stack Exchange の首位） | en |
|---|---|---|
| class-asking-go-back | 1 件（can you go back） | **指示の文** Could you go back to the previous slide?（corpus-human-settled） |
| class-asking-slow-down | 0 件 | **指示の文** Could you slow down a little?（corpus-human-settled） |
| class-asking-i-got-a-different-answer | what am i doing wrong ほか 8,141 | I got 8 — did I do something wrong?（指示の文 I got a different answer. は variant） |
| class-asking-which-problems | which problems ほか 33 | 指示の文 Which problems are we supposed to do? |
| class-asking-when-is-it-due | due friday ほか 9 | Is that due Friday or Monday?（指示の文 When is this due? は variant） |
| class-asking-calculator-on-the-test | use a calculator ほか 248 | 指示の文（今の en と同じ） |
| class-asking-is-there-an-easier-way | easier way ほか 7,163 | 指示の文（今の en と同じ） |
| class-asking-another-example | do one more ほか 14 | Can you show us one more?（指示の文 Could you do another example? は variant） |
| class-asking-simplify-further | simplify further ほか 716 | 指示の文 Do we need to simplify this further?（要の部分に simplify this further を足した） |
| office-hours-do-you-have-a-minute | have a minute 3 ／ is it a good time 3（同数で en の要の部分） | 指示の文（今の en と同じ） |
| office-hours-can-i-show-you-what-i-tried | what i have so far ほか 12,929 | Here's what I have so far.（指示の文は variant） |
| office-hours-am-i-on-the-right-track | on the right track 4,350 | 指示の文（今の en と同じ） |
| office-hours-hint-not-the-answer | a hint ほか 42,142 | 指示の文 Could you give me a hint instead of the answer? |
| office-hours-regrade | another look ほか 48 | 指示の文 I think this might have been graded incorrectly. Could you take another look? |
| office-hours-understand-in-class-not-alone | get stuck ほか 33,579 | 指示の文 I understand it in class, but I get stuck when I try it on my own.（do it on my own の文を variant に足した） |
| office-hours-when-to-use-which | which method ほか 867 | 指示の文 How do I know which method to use? |
| office-hours-can-i-come-back | can i come back ほか 17 | 指示の文 Can I come back if I get stuck again? |

- 1 で決まった 15 行は likely・corpus-attested-only。en は首位の要の部分の文で、**指示の文がその要の部分を含むものは指示の文を en にした**（11 行。square-and-add と同じ扱い）。首位が指示の文の要の部分でない 4 行（i-got-a-different-answer・when-is-it-due・another-example・can-i-show-you-what-i-tried）は首位の文を en にし、指示の文を variant に残した
- class-asking-how-do-you-read-this（人間が決めていた行）も how do you say が 21 件で 1 に当たるので、corpus-human-settled を外して corpus-attested-only にした（en は同じ）

## C. 修正 2・4

- 止める規則: 数えるのは学生の場面（class-asking・office-hours・group-study・exam の学生の質問）と email・discord 以外の ③。分母はバッチの行数（DECISIONS に書いた）
- `notes`: schema/phrases.schema.json に任意項目（文字列の配列）、src/lib/data.ts の Phrase、フレーズのページ（symbols と同じ ul.plain）。validate の本文の件数の警告は notes にも当たる。build の dist/phrases/written-solution/ に left-side-minus-right-side の notes が出ることを確かめた

## D. バッチ 4〜6（151〜275 行）

| バッチ | 行 | 生成 | likely | draft | ① | ② | 参照 | attested（コーパス） | Math Stack Exchange | email・discord（MICASE 3 件以上） | ③（止める規則に数える） | ③・draft（数えない） |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 4 | 151〜200 | 50 | 48 | 2 | 29 | 12 | 2 | 5 | 0 | 0 | **2（4%）** | 0 |
| 5 | 201〜250 | 50 | 38 | 12 | 7 | 0 | 0 | 7 | 20 | 4 | **4（8%）** | 8 |
| 6 | 251〜275 | 25 | 21 | 4 | 5 | 3 | 0 | 0 | 10 | 3 | **0** | 4 |
| 計 | | **125** | **107** | **18** | 41 | 15 | 2 | 12 | 30 | 7 | 6 | 12 |

- 書く前に probe で要の部分を数え、首位の文を en にした。そのあと corpus:count → corpus:fetch:mse → corpus:decide -- --write --ids で evidence と flags を書いた。decide の「直すこと」は各バッチの最後で 0、register の食い違いは 0
- 例文（en ／ ja ／ variants ／ notes）はすべて自作。コーパスの文も Math Stack Exchange の文も写していない（件数だけ）
- 止める規則に数える ③（6 行）: explaining-solution-rounded-at-the-end（round until ほか 2）、written-solution-given-prove（書き言葉 0、参照は IM 1）、exam-box-your-answer（書き言葉 0、参照は IM の circle your answer 1）、exam-calculator-allowed（2）、exam-partial-credit（1）、exam-pencils-down（time is up ほか 2）。exam の先生・監督の 3 行は、講義のコーパスに試験の運営の話がほとんど出てこないため
- 参照で決めた 2 行: written-solution-suppose-for-contradiction（Levin、for the sake of contradiction 3 件）、written-solution-it-suffices-to-show（Nicholson、22 件）。出典に足した

## E. 場面別の件数（全 275 行）

| 場面 | 台帳 | ① | ② | 参照 | attested（コーパス） | Math Stack Exchange | email・discord（MICASE） | 人間 | ③ | email・discord の draft |
|---|---|---|---|---|---|---|---|---|---|---|
| class-listening | 62 | 42 | 7 | 0 | 7 | — | — | 6 | 0 | — |
| written-solution | 50 | 28 | 11 | 2 | 6 | — | — | 2 | 1 | — |
| class-asking | 21 | 7 | 1 | 0 | 3 | 8 | — | 2 | 0 | — |
| explaining-solution | 35 | 20 | 9 | 0 | 5 | — | — | 0 | 1 | — |
| office-hours | 19 | 3 | 0 | 0 | 8 | 8 | — | 0 | 0 | — |
| exam | 33 | 15 | 4 | 0 | 5 | 2 | — | 0 | 7 | — |
| group-study | 23 | 5 | 3 | 0 | 3 | 10 | — | 0 | 2 | — |
| email | 17 | — | — | — | — | 10 | 4 | — | — | 3 |
| discord | 15 | — | — | — | — | 8 | 3 | — | — | 4 |
| 計 | **275** | 120 | 35 | 2 | 37 | 46 | 7 | 10 | 11 | 7 |

likely 257 ／ draft 18（draft は ③ の 11 行と email・discord の 7 行）。exam の ③ 7 行は、止める規則に数える 4 行（先生・監督 3、問題文 1）と学生の質問 3 行。

## F. 止めずに一覧にしたもの（学生の場面の ③ と email・discord の draft。人間レビュー行き）

件数は MICASE の学生の発話 ／ Math Stack Exchange（首位の要の部分）。

| id | MICASE | Math Stack Exchange |
|---|---|---|
| exam-ask-how-much-time | how much time is left ほか 2 | 1 |
| exam-is-it-curved | 0 | grade on a curve 2 |
| exam-ask-can-i-write-on-the-back | write on the back 1 | 0（use the back は検索しない。H） |
| group-study-can-i-see-your-notes | 0 | 0 |
| group-study-quiz-each-other | 0 | test each other ・ quiz me 2 |
| email-greeting | hi professor 1 | dear professor 2 |
| email-cannot-make-office-hours | 0 | 0（would it be possible to は検索しない） |
| email-extension | 0 | 0（an extension on は検索しない） |
| discord-due-tonight | 0 | due at midnight 1 |
| discord-notes-from-today | 0 | 0 |
| discord-when-is-the-midterm | when is the midterm ほか 1 | 0 |
| discord-study-on-a-call | 0 | 0 |

学生の場面の ③ は draft ・corpus-undecided、email・discord は draft ・corpus-student-rare。

## G. 確かめた主張

- Stack Exchange の検索の仕様: 引用符の完全一致は語形変化をまとめない（"graded incorrect" 0 件、"graded incorrectly" 1 件）。filter `!9n30I5cCu9fW` の返す項目は `.backoff`・`.quota_max`・`.quota_remaining`・`.total` だけ（/filters/create の応答で確かめた）。匿名の quota は 300（応答の quota_max）
- 参照の件数（本文で数えた。variant の note と出典に書いたもの）: AP Calculus の CED の Show the work that leads to your answer 8、Use the data in the table 3、Indicate units 2、places after the decimal point 1、Calculator Not Permitted 6。AP Statistics の CED の shape, center, and variability 1（center, and variability 2）。Levin の for the sake of contradiction 3、Nicholson の it suffices to show 22
- 文脈を見たもの（STYLE 追記欄。10 件前後）: 意図どおり — makes sense because（8 件中 3 件は別。除いても ②）、seems reasonable、the same answer as、you could also、i'm assuming、this gives、combining these、in context、do not evaluate、oh so、is it just。別の意味で外した・絞った — units of measure（すべて名詞）、stop writing（先生が板書を省く）、some credit ・ credit for ・ get credit（授業の単位）、no calculator の 1 件（暗算）、any ideas（don't have any idea）、see what happens（意図の一部）、has to be true（意図の一部）
- `!w` と語形変化: 「no calculator !involved | no calculators」は複数形の選択肢が語形変化で単数にも当たり !involved を打ち消していた（tsx で countTerm を試して確かめた）。複数形の選択肢を外した
- 書く前の probe の判定と、corpus:count → corpus:decide の書き戻しの判定が各バッチで一致した（decide の「直すこと」はスワップの後 0）

## H. 怪しい点

- **Math Stack Exchange の件数は、文脈を見られない**（本文を取らない）。意図と違う使い方が混じっていそうなもの: do one more（14。「もう 1 ステップ」の意味かもしれない。another-example の en がこれで変わった）、due friday ほか（9）、come back later（can-i-come-back の 17 件中 12）、exam back ・ test back（22）、split them up（34。式を分ける意味）、at the library（15。ソフトウェアのライブラリ）、your own solutions（14）、use a calculator（248。ほとんどは電卓で計算する話で、試験で使えるかではない）、a conflict with（25）、another look（32）、have a minute（3。ちょうど 3 件）
- **use the back は件数（7）を見た後に MSE_SKIP に足した**（use the back substitution）。これで exam-ask-can-i-write-on-the-back は likely から ③ に戻った。ほかの疑わしいもの（上）は見た後には足していない（件数を見て基準を変えないため）。MSE_SKIP の残り 23 個は件数を見る前に語だけで決めた
- Math Stack Exchange は書き言葉（質問の文）で、話し言葉の場面（class-asking・office-hours・group-study）の根拠にしている。規則どおり register は主張していないが、口で言う形（What am I doing wrong?、Here's what I have so far.）と質問に書く形は違うことがある
- 選択肢の件数を足すので、1 つの質問に 2 つの選択肢があると 2 回数える。数えるのは質問だけで回答は数えない
- 指示 3 の文が variant に下がった 4 行（B）は、Math Stack Exchange の首位が別の要の部分だったため。i-got-a-different-answer の en は「違う答えになった」より「どこを間違えたか」の文になった（intent と ja は変えていない）
- email・discord の en は首位の文にしていない（①②③ で判定しないため）。email-regrade-request は variant の another look（32）で likely、en の about the grading は 0 ／ 2。email-thank-you-for-your-time は variant の thanks in advance が首位
- 止める規則の分母はバッチの行数とした（数えない場面の行も分母に入る）。数えない場面の行を分母から除くと、バッチ 5 は 4 ／ 30（13%）で 1 割を超える
- exam の先生・監督の合図（partial-credit・pencils-down・calculator-allowed）は、講義のコーパスに試験の運営の話がほとんど出てこないので ③ になりやすい（class-asking と同じ事情）。止める規則には数えた
- written-solution-conclusion-because-reason: 書き言葉は changes from increasing to decreasing（11 件、うち 9 件が OpenStax Algebra and Trigonometry）が首位で en になったが、AP Calculus の CED は changes from negative to positive を使う（1 件）。AP の答案の理由の書き方（f′ の符号の変化）は variant に下がった
- written-solution-we-have（we have that 10）は生で 10 件、重み付けで 10 未満なので attested。written-solution-case（two cases、MIT の講義ノート 27 ／ 45）と written-solution-by-induction（MIT の講義ノートだけ）は 1 ソース頼み
- exam-ask-typo は should this be と a typo が 3 件ずつで、重み付けの順で should this be が en になった
- quota は今日 38 残っている。再実行で新しい検索が要るときは、quota が戻る（UTC の 0 時）まで待つことがある

## I. 次に要ること

- ③ 11 行と email・discord の draft 7 行（F と D の 6 行）の人間レビュー
- H の Math Stack Exchange の疑わしい件数を、本文を見ずにどう扱うか（MSE_SKIP を足すか、件数の閾値を上げるか）
- 台帳の phrases は 275 行で終わり。PLAN の完了条件（phrases 300+）には 25 行足りない

## K. 確認（合否はすべて終了コード）

```
pnpm exec tsc --noEmit        # exit 0
pnpm validate                 # exit 0。terms 1,540 ／ symbols 220 ／ phrases 275 ／ conventions 71 ／ curriculum 163、警告 0
pnpm spell                    # exit 0。2,277 ファイル、0 件（nevermind・pset を cspell.json に足した）
pnpm test                     # exit 0。156/156（4 ファイル。Math Stack Exchange の 3 件を足した）
pnpm build                    # exit 0。1,543 ページ。export: phrases.json 257（draft 18 を除く）、symbols.json 218
pnpm corpus:count             # 各回 exit 0（修正 1 の後、バッチ 4・5（2 回）・6 の後）
pnpm corpus:fetch:mse         # 各回 exit 0（131 ＋ 1 ＋ 81 ＋ 39 件、失敗 0）
pnpm corpus:decide -- --write --ids <各回の対象>
                              # 各回 exit 0。最後: 主見出し 1,341 ／ 併記 205 ／ 決まった言い方なし 76 ／ 参照 311 ／
                              # フレーズの attested-only 65（うち Math Stack Exchange 46）／ 人間が決めた 65 ／ 判断不能 12（phrases 11・terms 1）／ 食い違い 0 ／ 直すこと 0
```

- 修正のコミット（99b4641）と各バッチのコミット（ba66a8e・ad8db47・1077995）の前にも tsc・validate・spell・test を回し、すべて exit 0 を確かめた（バッチ 5 の前に test が 1 件落ちた — 文頭の Calculators を名前の検査から除いて直した。バッチ 6 の前に spell が 2 件落ちた — nevermind・pset を足して直した）
- `pnpm crosscheck` は terms を変えていないので回していない
