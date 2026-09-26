# Phase 3 のまとめ — 記号・フレーズ・慣習差

作成: 2026-09-26 ／ 範囲: Phase 3 の準備（audits/phase3-prep-report.md）から本コミットまで
各回の詳細: phase3-symbols-report.md → phase3-symbols-conventions-report.md → phase3-phrases-report.md → phase3-phrases-2-report.md → phase3-phrases-3-report.md → phase3-conventions-2-report.md

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified の語は 0。

## A. PLAN の Phase 3 の完了条件と照らした結果

完了条件（PLAN §9、2026-09-26 改訂）: 3 つの台帳（ledger/symbols.csv・ledger/phrases.csv・ledger/conventions.csv）の全行を生成（慣習差は日米の両側を資料で確かめられた行。外した行は理由付きで ledger/conventions-excluded.csv）、draft は理由付きで一覧化。

| 台帳 | 行 | 生成 | likely | draft | 外した | 判定 |
|---|---|---|---|---|---|---|
| symbols | 220 | 220 | 218 | 2 | — | **満たす**（draft 2 は D に理由） |
| phrases | 275 | 275 | 275 | 0 | — | **満たす** |
| conventions | 121 | 80 | 80 | 0 | 41（理由付き） | **満たす**（外した 41 は E-3） |

- PLAN の「やること」との照らし合わせ: symbols は四則〜幾何の記号を網羅（台帳 220 行、spoken_en は standard と spoken）。phrases は explaining-solution 35・written-solution 50 を厚くし、場面は 9（40〜60 に届かない場面がある: class-asking 21、office-hours 19、group-study 23、email 17、discord 15。台帳を作ったときの行数のまま）。conventions は付録 B を起点に 121 行の台帳を作り、確かめられた 80 行を生成した（付録 B の項目に当たる台帳の行は 35 行で、生成は 19 行。付録 B の 30 項目のうち 15 項目に生成した行がある。本コミットで #2 approximately-equal-notation が加わった）
- 旧い完了条件（symbols 300+、phrases 300+、conventions 50+）では symbols と phrases が届かない。300 は台帳を作る前の見積もりで、Phase 2 と同じく台帳の全行に改めた（DECISIONS「Phase 3 慣習差 2 の前の修正」3）
- 「すべて likely で入れ、Phase 5 の監査で verified に」: verified は 0。draft は symbols の 2 だけ

## B. 件数（likely ／ draft）

| コレクション | 件数 | likely | draft | export（dist/data、draft を除く） |
|---|---|---|---|---|
| symbols | 220 | 218 | 2 | 218 |
| phrases | 275 | 275 | 0 | 275 |
| conventions | 80 | 80 | 0 | 80 |

## C. 決め方の内訳

### C-1. symbols（220）

| 決め方 | 件数 | 説明 |
|---|---|---|
| コーパス ①・② | 178 | 話し言葉のコーパスで読みを数えて決めた（② は併記）。うち 1 件（conditional-probability-subscript-jp）は出典が editorial だけで draft |
| 参照（corpus-reference-fallback） | 29 | ③ を CED → OpenStax・IM・CK-12 → Nicholson・Levin の本文で決めた（1 つの参照が読みを 3 件以上） |
| 人間が決めた（corpus-human-settled） | 13 | ③ のうち規則で決まらなかったもの。うち 1 件（ceiling-brackets）は参照がなく draft |

### C-2. phrases（275）

| 場面 | 行 | コーパス ①・② | attested（話者のコーパス 3 件以上） | Math Stack Exchange 3 件以上 | email・discord（MICASE 3 件以上） | 参照 | 人間 |
|---|---|---|---|---|---|---|---|
| class-listening | 62 | 49 | 7 | — | — | 0 | 6 |
| written-solution | 50 | 39 | 6 | — | — | 2 | 3 |
| class-asking | 21 | 8 | 3 | 8 | — | 0 | 2 |
| explaining-solution | 35 | 29 | 5 | — | — | 0 | 1 |
| office-hours | 19 | 3 | 8 | 8 | — | 0 | 0 |
| exam | 33 | 19 | 5 | 2 | — | 0 | 7 |
| group-study | 23 | 8 | 3 | 10 | — | 0 | 2 |
| email | 17 | — | — | 10 | 4 | — | 3 |
| discord | 15 | — | — | 8 | 3 | — | 4 |
| 計 | **275** | **155** | **37** | **46** | **7** | **2** | **28** |

- attested・Math Stack Exchange・email・discord の行は flag corpus-attested-only（記録の flag）で、register は主張しない
- **Math Stack Exchange は使われている証拠にだけ使い、en を選ばない**（本コミットの修正 1）。46 行のうち en の要の部分が 3 件以上は 38 行、3 件未満か検索しないものは 8 行（F-2）
- 人間が決めた 28 行: 教室の儀式の class-listening 6、Math Stack Exchange でも 3 件未満の class-asking 2、written-solution 2（phrases-2 まで）と、本コミットの 18 行（exam 7・group-study 2・explaining-solution 1・written-solution 1・email 3・discord 4）

### C-3. conventions（80）

- すべて「日米の両側を資料で確かめた行」（confidence likely、出典に両側の資料と箇所）。日本側の資料: 学習指導要領・学習指導要領解説（中学校・高等学校）、日本語版 Wikipedia、**共通テスト（令和3〜8年度）・センター試験（平成26〜令和2年度）の本試験 数学の問題と正解**（本コミット）。米国側: OpenStax・AP の CED・IM・CK-12・Levin・Nicholson
- バッチ 1〜3 で 71 行、本コミットで 9 行（logic-notation・proposition-vs-condition・quadrant-roman-numerals・sample-variance-n-minus-1・summation-index-letter・solution-as-ordered-pair・constant-of-integration-remark・accumulation-function-scope・approximately-equal-notation）
- 記号との related は両側に入れた（台帳の組のうち両方のファイルがあるもの）

## D. draft の一覧と理由

| コレクション | id | 理由 |
|---|---|---|
| symbols | ceiling-brackets | 読み the ceiling of x は人間が決めた（corpus-human-settled）が、⌈x⌉ の読みを使う参照がなく、出典が editorial だけ |
| symbols | conditional-probability-subscript-jp | 日本だけの書き方 P_A(B)。読みは P(B ｜ A) と同じ形で数えたが、出典が editorial だけ（日本側は慣習差 conditional-probability-notation で学習指導要領解説を確かめているので、出典を足せば likely にできる） |

phrases・conventions の draft は 0。

## E. 人間レビューに残るもの

### E-1. 規則で決まらない ③・register の食い違い（CLAUDE.md 絶対ルール 9 の対象）

- Phase 3 の記号・フレーズ: **0**（③ はすべて規則か人間の決定で決まった。register の食い違いも 0）
- terms に 1: quadratic-regression（Phase 2 から残る corpus-undecided）

### E-2. 人間の判断が要るもの

- symbols の draft 2（D）: ceiling-brackets の出典、conditional-probability-subscript-jp に解説を出典として足すか
- **NHK 高校講座**: 本文が NHK ONE の利用規約への同意の後にしか読めない。資料に加えるなら人間が同意し、ページの題名と箇所だけを出典にする（docs/SOURCES.md）
- written-solution-given-prove: 指示の「Given: … Prove: …」を型と読み、en は具体例の文のままにした。「…」のままの文を en にするなら書き換える

### E-3. 外した慣習差 41 行（ledger/conventions-excluded.csv）

| 区分 | 行 | 戻す手がかり |
|---|---|---|
| 日本側（試験に出てこない・範囲外・マーク式で見られない・一部だけ） | 28 | 日本の検定教科書か NHK 高校講座（答案・授業の言い方の行）。数学Ⅲ の行（substitution-limits-table・integration-by-parts-u-dv ほか）は数学Ⅲ の資料 |
| 両側 | 3 | 手書き（handwritten-digits・handwritten-x-and-z）と分母の有理化の期待は、資料にしにくい |
| 米国側 | 5 | 米国側の主張を参照に合わせて書き直すか、外したまま |
| 日米で同じ | 5 | 慣習差にならない（外したまま） |

## F. Phase 5 の監査に回す論点

各レポートの「怪しい点」をまとめた。括弧は元のレポート。

### F-1. コーパスと件数の読み方

1. **学生の場面の ① はすべて MICASE の 1 ソースに頼る**。MICASE の学生の発話は全分野（生物・歴史・言語学ほか）で、数学の授業の発話ではない。件数の少ない ①（say … again 15、what do you mean by 10 ほか）がある（phrases）
2. **要の部分に一般的な語を使ったもの**は件数に別の用法が混じる（how do you get・what if・next step・notice that・since・because ほか）。判定は変わらないと見たが、evidence は意図だけの件数ではない（phrases、phrases-2）
3. **字形の読みとして数えた記号の件数に別の意味が混ざる**（r squared、P of A、A prime、Q one、sigma、the critical value ほか）。1 ソース頼みの首位の記号（element-of-sign・cube-root・floor-brackets・MIT 18.02 の積分記号ほか）（symbols、symbols-conventions）
4. CED は 1 件でも terms の呼び方を決めるので、proportion-colon・max-min-notation の判定が CED の 1〜2 件に頼った時期があった（後に記号は 3 件以上に改めた）。product-pi-notation は OpenStax の 3 件（ちょうど下限、n! の定義）、matrix-brackets は Nicholson の数式を読みとして数えた（symbols-conventions）
5. 首位が同数で重み付けの順で決まったもの（class-listening-sanity-check・office-hours-thanks-that-helps・explaining-solution-flipped-the-inequality・exam-ask-typo）。重み付けで 10 件に届かず attested-only になった what-we-want-to-show・let-p-be-the-position-vector-of-p（生で 10・11 件）（phrases-2、phrases-3）
6. attested-only の首位で意図の一部だけに当たるもの: squares-are-nonnegative の never negative、office-hours-english-terms-are-new の getting used to、office-hours-intuition の intuition ほか（phrases-2）
7. explaining-solution の件数のほとんどは講義の先生の説明で、学生が自分の解答を説明する発話ではない（phrases-2）
8. 1 ソース頼みの書き言葉: written-solution-case（MIT の講義ノート）、written-solution-by-induction（同）、written-solution-conclusion-because-reason の en（OpenStax Algebra and Trigonometry が中心。AP の CED の言い方は variant）（phrases-3）
9. MICASE の話者の振り方（役割の語が Teacher・Student 以外の 546 行を記号で振った）（symbols-conventions）

### F-2. Math Stack Exchange

10. **件数は文脈を見られない**（本文を取らない）。意図と違う使い方が混じっていそうなもの: do one more（14）、due friday ほか（9）、come back later（17 件中 12）、exam back ・ test back（22）、split them up（39。式を分ける意味）、at the library（15。ソフトウェアのライブラリ）、your own solutions（14）、use a calculator（248。ほとんどは電卓で計算する話）、a conflict with（25）、another look（32）、have a minute（3。ちょうど 3 件）（phrases-3）
11. **en は Math Stack Exchange では選ばない**ことにしたので、en の要の部分が 3 件未満のまま likely の行が 8 行ある: class-asking-when-is-it-due（0）、discord-anyone-get（2）、email-missed-class（0）、email-regrade-request（2）、email-sign-off（数えない）、group-study-ask-the-ta（2）、group-study-split-them-up（0）、group-study-work-together（検索しない）。likely は別の要の部分（10 の疑わしいものを含む）による（conventions-2）
12. Math Stack Exchange は書き言葉（質問の文）で、話し言葉の場面（class-asking・office-hours・group-study）の根拠にしている。口で言う形と質問に書く形は違うことがある（phrases-3）
13. 検索しない選択肢（MSE_SKIP）のうち use the back は件数（7）を見た後に足した。ほかの疑わしいものは件数を見た後には足していない。選択肢の件数を足すので、1 つの質問に 2 つあると 2 回数える（phrases-3）

### F-3. 規則の読み方

14. 止める規則（③ が 1 割を超えたら止める）の読み方: 記号の最後のバッチ（3 ／ 20）で慣習差に進んだ。③ を規則 2 の後で数えた。分母をバッチの行数にした（数えない場面の行を除くとバッチ 5 は 4 ／ 30 で 1 割を超える）（symbols-conventions、phrases-3）
15. exam の行を話者で分けた（学生の質問は student、監督の合図は instructor）のは、指示の文面（exam は書き言葉）からはみ出している。exam の先生・監督の合図は講義のコーパスにほとんど出てこないので ③ になりやすかった（phrases、phrases-3）
16. 本コミットの修正 1 を、指示の 4 行の外の 5 行（group-study 4・email-sign-off）にも当てて en を台帳の文に戻した（conventions-2）

### F-4. 慣習差の資料

17. **Internet Archive の写しを出典にした**（センター試験と共通テスト 令和3〜5年度。センターが公開した PDF の写し）（conventions-2）
18. **OCR は記号を落とす**ので、「試験に出てこない」とした除外の理由のうち記号の行（evaluation-bar-notation・vector-notation の成分）は見落としの可能性がある（conventions-2）
19. 共通テスト・センター試験はマーク式で、教科書・授業・答案の資料ではない。文は「試験の問題文は〜」に言い換えた。sample-variance-n-minus-1 は選択肢の正解で確かめた（conventions-2）
20. 慣習差の日本側の多くを日本語版 Wikipedia で確かめた（記事は教科書ではない）。「解説に出てこない」は解説が教科書の全内容を挙げるわけではない。解説の PDF のテキストは上付き・上線・分数が落ちる（symbols-conventions）
21. accumulation-function-scope は前のバッチで米国側を誤って外していた（CED topic 6.4 の名前を見落とした）。同じ確かめ方（単数・小文字だけの検索）で外した行がほかにないか（conventions-2）
22. 記号の notes と慣習差の本文の「日本の教科書は使わない」型の主張は、教科書を資料に持たないので「解説に出てこない」と書いた（polar-form-cis ほか）。repeated-combination-h-jp の C(n + r − 1, r) は式の形を確かめていない（phrases）

### F-5. 個別の判断

23. written-solution-given-prove の en（型か具体例か。E-2）、exam-box-your-answer の ja（「丸（四角）で囲め」）、by-hypothesis の en が By assumption（id と違う）、max-min-notation の likely の根拠が max{ … }（phrases-2、conventions-2）
24. office-hours-stuck-at-step の話し言葉 ① walk … through は教員の発話も学生と同じだけある（symbols-conventions）
25. 数えない variants（要の部分 ""）を置いたもの（by-hypothesis・are-equal-respectively・written-solution-therefore・discord-same-answer・email-sign-off ほか）（phrases、phrases-3）

### F-6. terms の日本側の主張（2026-09-26 追加。PLAN §9 Phase 5）

26. terms の pitfalls・mapping_note にある日本側の主張（「日本の教科書は〜」「日本では〜と書く」）にも、慣習差と同じ基準（日本側を資料で確かめる）を当てる。確かめられない文は弱めるか消す。「日本(の教科書|では|の高校|の授業|の答案|の中学|の入試|の数学|で)」に当たる文は 286 語・300 文（2026-09-26 に数えた。目安）

## G. 確認（合否はすべて終了コード）

本コミットの確認は audits/phase3-conventions-2-report.md の F。`tsc --noEmit`、`pnpm validate`（警告 0）、`pnpm spell`、`pnpm test`（156/156）、`pnpm build` はすべて exit 0。
