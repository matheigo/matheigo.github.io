# Phase 3 フレーズ 2 — 修正 1〜4、フレーズのバッチ 3（③ が 1 割を超えたので止めた）

作成: 2026-09-26 ／ 対象: 14e7415（Phase 3 フレーズのレポート）→ 本コミット
指示: audits/phase3-phrases-report.md を受けた 1〜5。判断は `docs/DECISIONS.md` の「Phase 3 フレーズ 2 の前の修正」「Phase 3 フレーズの生成 2」。

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified の語は 0。

## まとめ

- **1**: フレーズは、どの要の部分も 10 件に届かなければ ①②③ で競わせない（lib.ts `phraseBelowFloor`）。首位が話者のコーパスに 3 件以上なら likely と flag **corpus-attested-only**（記録の flag。verified を止めない）、3 件未満なら draft と corpus-undecided。**バッチ 1・2 の 100 行を判定し直すと、attested-only 14、人間が決めた 9、③ 0 で、100 行すべて likely になった**（前は likely 84 ／ draft 16）
- **2**: explaining-solution は講義のコーパスと MICASE 全体で数える（グループ classroom）。**バッチ 3 の explaining-solution 21 行は ③ 0**
- **3**: exam の口で言う行を全部 PHRASE_SPEAKER に入れた（学生 7、先生・監督 6）。この 13 行のうち生成したのは exam-clarify-instruction だけ（残りはバッチ 5 の範囲）
- **4**: 人間が決めた 16 行のうち **7 行は 1 で決まった**（1 を優先）。**9 行が corpus-human-settled**。記号 4 件も corpus-human-settled にし、記号を使う参照を確かめて likely にした（ceiling-brackets は draft のまま）
- **5**: バッチ 3（101〜150 行）を生成した。**50 行、likely 33 ／ draft 17。③ は 17 ／ 50（34%）で 1 割を超えたので、バッチ 4 に進まず止めた**。③ はすべて学生の発話で数える行（class-asking 9、office-hours 8）。残りは 125 行
- 台帳は 275 行（前のレポートの 274 行 ・残り 174 行は数え違い。場面別の表の合計は 275）。残りは 175 行だった
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて終了コード 0（J）

## A. 修正 1 — 要の部分が 10 件に届かないフレーズ

### A-1. 決めた読み方（DECISIONS「Phase 3 フレーズ 2 の前の修正」1）

- 「10 件に届く」は ①② と同じく**重み付けした件数**で見る。首位も重み付けした件数で選び、「3 件以上」は**生の件数**で数える（email・discord の 3 件と同じく観測した数）
- 書き言葉のフレーズで首位が 3 件未満のものは、これまでどおり参照（CED → OpenStax・IM・CK-12 → Nicholson・Levin で 1 つの参照が 3 件以上）を先に見て、決まらなければ corpus-undecided
- 1 で決まるもの（首位が 3 件以上）は、人間の決定（corpus-human-settled）より先にする（指示 4 の「1 で決まるものはそちらを優先」）。decide はそのとき human-settled を「今はコーパスで決まるもの」に出す
- 道具: decide が flag と「フレーズで、どの要の部分も 10 件に届かず、首位が 3 件以上のもの」の節を書く。probe `--decide --group` も同じ判定を出す。lib/flags.ts の RECORD_FLAGS に corpus-attested-only を足した
- テスト: tests/corpus.test.ts に 1 件（10 件に届く・9 対 2 だった ① ・2 件・0 件・重み付けで首位を選ぶ）と、グループ classroom ・exam の話者の確認を足した

### A-2. バッチ 1・2 の判定し直し（100 行）

| | ① | ② | 参照 | attested-only | 人間が決めた | ③ | likely ／ draft |
|---|---|---|---|---|---|---|---|
| 前（14e7415） | 66 | 14 | 4 | — | — | 16 | 84 ／ 16 |
| 後 | **63** | 14 | **0** | **14** | **9** | **0** | **100 ／ 0** |

変わった 23 行:

| 行 | id | 前 | 後（首位の要の部分と件数） | エントリの変更 |
|---|---|---|---|---|
| 12 | integrate-by-parts-repeatedly | ① | attested: by parts twice 8 | なし |
| 28 | squares-are-nonnegative | ① | attested: never negative 8 | なし（文脈は H の 3 つ目） |
| 50 | check-the-sign | ① | attested: sign of f prime ほか 9 | なし |
| 31 | what-we-want-to-show | 参照（OpenStax） | attested: we need to show 10（重み付けで 10 未満） | **en を We need to show … に** |
| 36 | the-base-is-greater-than-1 | 参照（OpenStax） | attested: the inequality sign 8 | なし |
| 41 | let-p-be-the-position-vector-of-p | 参照（OpenStax） | attested: position vector of 11（重み付けで 10 未満） | なし |
| 53 | by-hypothesis | 参照（Nicholson） | attested: by assumption 5（by hypothesis は書き言葉 0） | **en を By assumption, AB = CD. に** |
| 57 | square-and-add | ③ | attested: square and add ほか 7 | 人間の文 Square both equations and add them. が形 square … and add them に当たる |
| 65 | class-listening-turn-to-page | ③ | attested: turn to page 5 | 人間の文（page 45） |
| 71 | class-listening-work-with-a-partner | ③ | attested: turn to your neighbor ほか 5 | en を Turn to your neighbor and compare.、Work with a partner. を variant |
| 82 | class-listening-extra-credit | ③ | attested: extra credit 6 | なし |
| 92 | class-listening-sanity-check | ③ | attested: answer make sense ほか 7（sanity check も 7） | en を Does this answer make sense? |
| 96 | class-asking-is-there-a-name-for-this | ③ | attested: what's it called ほか 8 | en を What's this called?（形に what's this called を足した）、variant を What do you call this? |
| 100 | class-asking-typo-on-the-board | ③ | attested: should that be ほか 4 | variant を Is that a typo? に（Is that supposed to be x squared? を外した） |
| 3 ほか 9 行 | （B-1） | ③ | 人間が決めた | 指示の文に |

- explaining-solution-first-step はグループが classroom になり、first i が ① のまま（件数は学生の発話だけのときより増えた）

## B. 修正 4 — 人間が決めた ③

### B-1. フレーズ（corpus-human-settled 9 行、likely、register は主張しない）

| id | en ／ variants（指示どおり） | 数えた件数 | 備考 |
|---|---|---|---|
| area-is-never-negative | Area is never negative. | 0 | 前の 2 文の形（area is always positive ほか）も同じ言い方として要の部分に入れた |
| left-side-minus-right-side | Subtract the right side from the left side. | 0（参照も 0） | **notes に書く指示の文は flag の note に書いた**（phrases のスキーマに notes が無い。I） |
| the-equation-holds | Thus, the identity is verified. ／ Therefore, the equation holds. | 2 ／ 1 | |
| class-listening-take-out-a-sheet-of-paper | Take out a sheet of paper. | 2 | pop quiz（4 件）を variants から外した（下） |
| class-listening-pass-your-papers-forward | Pass your papers forward. | 1 | |
| class-listening-lowest-quiz-dropped | Your lowest quiz score will be dropped. | 0 | |
| class-listening-final-is-cumulative | The final is cumulative. ／ The final covers everything. | 0 ／ 0 | covers everything（9 件）を final covers everything ほかに絞った（下） |
| class-listening-lets-go-over-the-homework | Let's go over the homework. | 1 | |
| class-asking-how-do-you-read-this | How do you say this symbol? | 2 | |

- **1 で決まりかけた 2 行を、文脈を見て ③ に戻した**: pop quiz の 4 件はすべて講義中に先生がクラスに問いかける前置きで、紙を出させる意図ではない。covers everything の 9 件は「この式ですべての場合を覆う」「導入で話すことは全部話した」などで、期末試験の範囲の意味はない。どちらも STYLE 追記欄の「別の意味を形で除く」どおりにした。結果は人間の決定と同じ文になった
- 1 で決まった 7 行（A-2）は flag を付けず、人間の文を en ／ variants にした。**work-with-a-partner と sanity-check は、指示の並び（Work with a partner. が先）と en が逆になった**（1 の首位の文を en にするため）

### B-2. 記号（corpus-human-settled 4 件、likely）

| id | 読み（standard） | 記号を使う参照（確かめたもの） |
|---|---|---|
| max-min-notation | the maximum of a and b | **OpenStax Calculus Volume 3（Calculus of Parametric Curves）の max{ … }（分割の幅の最大。2 つの値の max{a, b} ではない）を足した**。2 つの値の形はどの参照にもない |
| probability-of-union | the probability of A or B ／ the probability of A union B | AP Statistics の CED の P(A ∪ B)（出典にあった。note を直した） |
| normal-distribution-n | normal with mean mu and standard deviation sigma | OpenStax Introductory Statistics の X ~ N(μ, σ)（出典の note に書いた） |
| binomial-distribution-b | the binomial distribution with n trials and success probability p | OpenStax Introductory Statistics の X ~ B(n, p)（同上） |

- 読みは指示のものだけにした（max-min-notation の the larger of ／ the max of、binomial-distribution-b の B of n comma p を spoken_en から外した。max-min-notation の notes には the larger of ／ the smaller of を言い換えとして残した）
- ceiling-brackets は参照がないので draft のまま。記号の draft は 2（ceiling-brackets・conditional-probability-subscript-jp）

## C. 修正 2・3 — 話者

| グループ | 場面 | 数える文書 |
|---|---|---|
| student | class-asking・office-hours・group-study、exam の学生の質問 7 行 | MICASE の学生の発話 |
| instructor | class-listening、exam の先生・監督の合図 6 行 | 講義のコーパスと MICASE の教員の発話 |
| **classroom（新）** | **explaining-solution** | **講義のコーパスと MICASE 全体（学生・教員・その他）** |
| written | written-solution、exam の問題文の指示 | 書き言葉のコーパス（③ なら参照） |
| email | email・discord | MICASE の学生の発話（3 件以上で likely。変更なし） |

- exam の学生の行: exam-clarify-instruction・exam-ask-typo・exam-ask-scratch-paper・exam-ask-can-i-write-on-the-back・exam-ask-how-much-time・exam-when-do-we-get-it-back・exam-is-it-curved。先生・監督の行: exam-calculator-allowed・exam-multiple-choice-and-free-response・exam-partial-credit・exam-notes-allowed・exam-time-remaining・exam-pencils-down
- 「MICASE 全体」には話者の区分 other（複数の話者・聞き取れない話者）も入れた

## D. バッチ 3（101〜150 行）

| バッチ | 行 | 生成 | likely | draft | ① | ② | attested-only | ③（人間レビュー） |
|---|---|---|---|---|---|---|---|---|
| 3 | 101〜150 | 50 | 33 | 17 | 16 | 6 | 11 | **17（34%）→ 止めた** |

| 場面 | 行 | ① | ② | attested | ③ |
|---|---|---|---|---|---|
| class-asking（学生） | 12 | 2 | 0 | 1 | **9** |
| office-hours（学生） | 17 | 1 | 0 | 8 | **8** |
| explaining-solution（講義と MICASE 全体） | 21 | 13 | 6 | 2 | 0 |

- 書く前に話者のコーパスで要の部分を数え（probe と同じ判定）、en を首位の文にした。そのあと corpus:count → corpus:decide -- --write --ids で evidence と flags を書いた。decide の「直すこと」は 0、register の食い違いは 0
- 例文（en ／ ja ／ variants）はすべて自作。コーパスの文は写していない（要の部分の件数だけを使った）
- 数え方の見直し（DECISIONS「Phase 3 フレーズの生成 2」）: 学生の発話の a good time・native speaker・another example・look over・big picture・that helps・makes more sense、講義の call … x・substitute … back・reject it・let me go back・flip it は別の意味が多かったので、意図の形に絞った。so i got ／ that gives us は途中の計算にも使うので数えない（""）

## E. 場面別の件数（生成した 150 行）

| 場面 | 台帳 | 生成 | ① | ② | attested | 人間 | ③ | 残り |
|---|---|---|---|---|---|---|---|---|
| class-listening | 62 | 62 | 42 | 7 | 7 | 6 | 0 | 0 |
| written-solution | 50 | 24 | 13 | 4 | 5 | 2 | 0 | 26 |
| class-asking | 21 | 21 | 7 | 1 | 3 | 1 | 9 | 0 |
| explaining-solution | 35 | 22 | 14 | 6 | 2 | 0 | 0 | 13 |
| office-hours | 19 | 18 | 2 | 0 | 8 | 0 | 8 | 1 |
| exam | 33 | 3 | 1 | 2 | 0 | 0 | 0 | 30 |
| group-study | 23 | 0 | — | — | — | — | — | 23 |
| email | 17 | 0 | — | — | — | — | — | 17 |
| discord | 15 | 0 | — | — | — | — | — | 15 |
| 計 | 275 | **150** | 79 | 20 | 25 | 9 | **17** | **125** |

likely 133 ／ draft 17（draft は ③ の 17 行だけ）。export の phrases.json は 133。

## F. ③ の一覧（17 行。draft、corpus-undecided、人間レビュー行き）

件数は MICASE の学生の発話（生の件数）。

| id | 数えた要の部分と件数 |
|---|---|
| class-asking-go-back | could you go back ほか 2 ／ scroll back up ほか 0 |
| class-asking-slow-down | slow down a bit ほか 0 ／ more slowly ほか 0 |
| class-asking-i-got-a-different-answer | got a different answer ほか 0 ／ did i do something wrong ほか 0 |
| class-asking-which-problems | which problems ほか 0 ／ odds only ほか 0 |
| class-asking-when-is-it-due | when is it due ほか 1 ／ due on friday ほか 1 |
| class-asking-calculator-on-the-test | use a calculator ほか 1 ／ non-calculator ほか 0 |
| class-asking-is-there-an-easier-way | easier way ほか 1 ／ a shortcut 0 |
| class-asking-another-example | do another example ほか 0 ／ do one more ほか 0 |
| class-asking-simplify-further | simplify further ほか 1 ／ as simple as it gets ほか 0 |
| office-hours-do-you-have-a-minute | have a minute ほか 0 ／ is this a good time ほか 0 |
| office-hours-can-i-show-you-what-i-tried | show you what i ほか 1 ／ what i have so far ほか 1 |
| office-hours-am-i-on-the-right-track | on the right track ほか 2 ／ will this work ほか 2 |
| office-hours-hint-not-the-answer | a hint ほか 2 ／ point me in the right direction 0 |
| office-hours-regrade | another look ほか 0 ／ graded incorrectly ほか 0 |
| office-hours-understand-in-class-not-alone | try it on my own ほか 1 ／ get stuck ほか 2 |
| office-hours-when-to-use-which | when to use ほか 2 ／ which method ほか 0 |
| office-hours-can-i-come-back | can i come back ほか 2 |

## G. 確かめた主張

- 記号の出典: AP Statistics の CED の P(A ∪ B)（本文 3 か所）、OpenStax Introductory Statistics の X ~ N(μ, σ) と X ~ B(n, p)、OpenStax Calculus Volume 3 の max{ … }。2 つの値の max{a, b} ／ min{a, b} は OpenStax・CED・IM・CK-12・Nicholson・Levin に見つからなかった（Nicholson の max は集合の最大）
- explaining-solution-factored-and-set-to-zero の variant の note「OpenStax Elementary Algebra・Intermediate Algebra と IM が使う用語」: zero product property は OpenStax Elementary Algebra 40 件、Intermediate Algebra 48 件、Algebra and Trigonometry 3 件、IM 42 件
- 要の部分の別の意味（文脈を 6〜10 件見た）: pop quiz・covers everything（B-1）、D の最後の項目のもの。意図どおりだったもの: square and add、by assumption、we need to show、sign of f prime、by parts twice、need to know that、couldn't we just、study for、practice exam、lost points、should i take、the idea is to、call it x、the key is、the units are、so this means、not sure about
- 判定し直しの結果: 書く前の probe の判定と corpus:count → corpus:decide の書き戻しの結果が一致した（バッチ 1・2 は A-2、バッチ 3 は D）。decide の「直すこと」は 0

## H. 怪しい点

- **学生の場面は MICASE の学生の発話（全分野、637,547 語）だけでは足りない**。バッチ 3 の class-asking ・office-hours 29 行のうち 17 行が ③（首位が 3 件未満）で、止める規則に当たった。学生の発話は生物・歴史・言語学などの授業と雑談で、「締め切りはいつか」「電卓を使えるか」「もっと楽な解き方」のような数学の授業の質問はほとんど出てこない。残りの group-study 23 行と office-hours 1 行、exam の学生の質問 6 行も同じ数え方なので、次のバッチも ③ が 1 割を超える見込みが高い
- attested-only の首位のうち、件数が少なく意図の一部だけに当たるもの: squares-are-nonnegative の never negative（8 件すべて「絶対値は負にならない」）、office-hours-english-terms-are-new の getting used to（5 件。慣れる対象は話し方や機器）、office-hours-is-this-rigorous-enough の look it over（6 件。見直す対象は書類一般）、office-hours-intuition の intuition（9 件。自分の直感という意味も多い）、class-asking-do-we-need-to-memorize の need to memorize（3 件。「覚えなくていい」と言う側の文）
- **首位が同数で、重み付けの順で決まったもの**: class-listening-sanity-check（answer make sense 7 ／ sanity check 7）、office-hours-thanks-that-helps（makes more sense now ほか 3 ／ that really helps ほか 3）、explaining-solution-flipped-the-inequality（flip the inequality ほか 3 ／ switch the inequality ほか 3）
- 「10 件に届く」を重み付けで見たので、生で 10 件以上ある what-we-want-to-show（10）と let-p-be-the-position-vector-of-p（11）が attested-only になった。生の件数なら ①（首位だけが 10 件以上）。en は同じで、flag だけが違う
- explaining-solution の件数はほとんどが講義の先生の説明（the key is、so this means、the idea is to ほか）で、学生が自分の解答を説明する発話ではない。指示 2 のとおり「数学の手順の言い方は話者で変わらない」と見た
- explaining-solution-with-units の要の部分 meters per second ほかは、単位を言った回数で、「答えを単位つきで言う」意図だけの件数ではない
- explaining-solution-so-the-answer-is の variants（So I got 12. ／ And that gives us 12.）は数えない（""）
- by-hypothesis は id のまま en が By assumption になった（書き言葉で by hypothesis は 0 件。前に決めていた Nicholson の by hypothesis は参照で、1 の方が先）
- max-min-notation の likely は、形の違う max{ … }（集合の最大）を根拠にした
- left-side-minus-right-side の「米国の教材に決まった言い方がない。日本の答案の型」は flag の note にしか書けなかった（I）
- 前のレポートの台帳の行数（274 ／ 残り 174）は数え違いで、275 ／ 175 だった

## I. 次に要ること

- ③ 17 行（F）の人間レビュー
- **学生の場面の数え方**（H の 1 つ目）: MICASE の学生の発話だけで数える限り、group-study と exam の学生の質問でも止める規則に当たる見込み。数えるコーパスか止める規則を変えるか
- **phrases のスキーマに notes を足すか**（left-side-minus-right-side の指示の文の置き場所。スキーマ変更なので確認が要る）
- 残り 125 行: explaining-solution 13（151〜163）、written-solution 26（164〜189）、exam 30（190〜219）、email 17、discord 15、group-study 23、office-hours 1（268）

## J. 確認（合否はすべて終了コード）

```
pnpm exec tsc --noEmit        # exit 0
pnpm validate                 # exit 0。terms 1,540 ／ symbols 220 ／ phrases 150 ／ conventions 71 ／ curriculum 163、警告 0
pnpm spell                    # exit 0。2,152 ファイル、0 件
pnpm test                     # exit 0。153/153（4 ファイル。要の部分が 10 件に届かないフレーズの 1 件を足した）
pnpm build                    # exit 0。1,540 ページ。export: phrases.json 133（draft 17 を除く）、symbols.json 218（draft 2 を除く）
pnpm corpus:count             # exit 0（修正の前、修正の後、バッチ 3 の後の 3 回）
pnpm corpus:decide -- --write --ids <各回の対象>
                              # 各回 exit 0。最後: 主見出し 1,300 ／ 併記 190 ／ 決まった言い方なし 76 ／ 参照 309 ／
                              # フレーズの attested-only 25 ／ 人間が決めた 64 ／ 判断不能 18（phrases 17・terms 1）／ 食い違い 0 ／ 直すこと 0
```

- 修正のコミット（fbccc79）とバッチ 3 のコミット（3857f53）の前にも tsc・validate・spell・test を回し、すべて exit 0 を確かめた
- ネットワークには出ていない（コーパス・参照は手元のファイルだけを読んだ）。取得のタイムアウト・リトライ・キャッシュを使う場面はなかった
- `pnpm crosscheck` は terms を変えていないので回していない
