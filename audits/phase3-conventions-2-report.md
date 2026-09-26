# Phase 3 慣習差 2 — 修正 1〜3（Math Stack Exchange は en を選ばない・人間が決めた 18 行・PLAN）、外した慣習差の見直し（4）

作成: 2026-09-26 ／ 対象: a8d1387（Phase 3 フレーズ 3 のレポート）→ 本コミット
指示: audits/phase3-phrases-3-report.md を受けた 1〜5。判断は `docs/DECISIONS.md` の「Phase 3 慣習差 2 の前の修正」「Phase 3 慣習差の生成 2」。5 のまとめは audits/phase3-final-report.md。

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified の語は 0。

## まとめ

- **1**: Math Stack Exchange は「使われている証拠」（3 件以上で likely）にだけ使い、**en を選ばない**ようにした（decide.ts `mseEnNote`）。指示の 4 行を指示の文に戻し、Math Stack Exchange の首位の文を variant に残した。email・discord と、バッチ 5・6 で同じように en を変えていた 5 行（group-study 4・email-sign-off）も台帳の文に戻した
- **2**: 残りの 18 行を指示の文にし、corpus-human-settled・likely にした。**phrases 275 行は likely 275 ／ draft 0**
- **3**: PLAN §9 の Phase 3 の完了条件を「3 つの台帳の全行を生成、draft は理由付きで一覧化」に直した
- **4**: 日本側の資料に**大学入試センターの共通テスト（令和3〜8年度）・センター試験（平成26〜令和2年度）の本試験 数学の問題と正解**を足した（113 ファイル。センター試験の画像だけの 32 ファイルは OCR）。外した 50 行のうち **9 行を確かめて生成（likely）**、41 行は除外のまま理由を更新した。**conventions は 71 → 80（likely 80）**。**NHK 高校講座は NHK ONE の利用規約への同意が要るため使えなかった**（C-3）
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて終了コード 0（F）

## A. 1 — Math Stack Exchange は en を選ばない

### A-1. 変えたもの

- decide.ts: Math Stack Exchange で決まったフレーズ（学生の場面の corpus-attested-only、email・discord の likely）に「en を首位の文にする」を出さない。flag の note に en の要の部分の件数を足した（3 件以上なら「en のまま」、未満か検索しないなら「en は Math Stack Exchange では選ばない」）
- STYLE（学生の場面の項）・PLAN §15 に「en を選ばない」を足した

### A-2. 指示の 4 行

| id | en（指示の文） | variant（Math Stack Exchange の首位の文） | en の要の部分 |
|---|---|---|---|
| class-asking-i-got-a-different-answer | I got a different answer. | What am I doing wrong? | got a different answer ほか 330 |
| class-asking-when-is-it-due | When is this due? | Is that due Friday or Monday? | when is it due ほか **0**（likely は due friday ほか 9 による） |
| class-asking-another-example | Could you do another example? | Can you show us one more? | do another example ほか 9 |
| office-hours-can-i-show-you-what-i-tried | Can I show you what I tried? | Here's what I have so far. | show you what i ほか 644 |

- i-got-a-different-answer は指示どおり What am I doing wrong? を variant にし、それまでの variant I got 8 — did I do something wrong?（要の部分は同じ）を外した
- **email-thank-you-for-your-time** は en の thank you for your time が 3,724 件で en のまま。**email-regrade-request** は en の about the grading が 2 件で、likely は variant の another look（32 件）による。en は台帳の文のまま

### A-3. 同じ理由で戻した 5 行（指示の外）

バッチ 5・6 で Math Stack Exchange の首位（か数えられる言い方）を en にしていた行。台帳の 1 つ目の文に戻し、それまでの en を variant に残した。

| id | en（台帳の文） | variant |
|---|---|---|
| group-study-ask-the-ta | Should we ask the TA? | Let's ask at office hours. |
| group-study-split-them-up | Let's each do a few and then explain them to each other. | Should we split them up? |
| group-study-where-do-we-start | Where do we even start with this one? | Any ideas for number 7? |
| group-study-work-together | Do you want to work on the problem set together? | Want to study together for the midterm? |
| email-sign-off | Best, Taro Yamada | Best regards, Taro Yamada ／ Sincerely, Taro Yamada（notes「Thanks, とも結ぶ。」） |

Math Stack Exchange で likely の 46 行のうち、**en の要の部分が 3 件以上は 38 行、3 件未満か検索しないものは 8 行**（class-asking-when-is-it-due 0、discord-anyone-get 2、email-missed-class 0、email-regrade-request 2、email-sign-off 数えない、group-study-ask-the-ta 2、group-study-split-them-up 0、group-study-work-together 検索しない）。8 行も likely のまま（要の部分のどれかが 3 件以上）。

## B. 2・3 — 人間が決めた 18 行、PLAN

- 18 行すべて指示の文にし、flag corpus-human-settled（note に文と日付）、register は主張しない、likely。en ／ variants は指示の文だけにした（指示に無い variant 6 つを外した。DECISIONS）
- 文に合わせて ja を 8 行直した（exam-box-your-answer「最終的な答えを丸（四角）で囲め。」ほか。DECISIONS）
- **written-solution-given-prove**: 指示の「Given: … Prove: …」を型と読み、en は具体例の文（Given: AB ≅ CD. Prove: △ABC ≅ △CDA.）のままにした。notes に「米国の二段組の証明（two-column proof）の型」、CK-12 Geometry の Given : … Prove : …（32 件。4.13 SSS・4.14 SAS・4.15 ASA and AAS ほか）を本文で数えて出典に足した
- **exam-calculator-allowed**: notes に AP Calculus の CED の試験の区分（Section I の Part A「Graphing calculator not permitted」・Part B「Graphing calculator required」、Section II の Part A「Graphing calculator required」・Part B「Graphing calculator not permitted」）を本文で確かめて書いた
- **email-greeting**: notes「Hi Professor Smith, はくだけた書き方。」
- email・discord の人間が決めた 7 行は、decide が corpus-student-rare を付けないようにした（`emailHuman`）
- 新しい文の要の部分を phrase-forms.ts に足し、corpus:count → corpus:fetch:mse（新しい検索 2 件: share their notes 0・share your notes 0。quota の残り 37）→ corpus:decide を回した
- PLAN §9: 完了条件を「3 つの台帳（symbols・phrases・conventions）の全行を生成（慣習差は両側を資料で確かめられた行、外した行は理由付きで ledger/conventions-excluded.csv）、draft は理由付きで一覧化」にした

## C. 4 — 外した慣習差の見直し

### C-1. 足した資料と取り方

| 資料 | 年度 | 取得元 | ファイル |
|---|---|---|---|
| 大学入学共通テスト 本試験 数学（問題・正解） | 令和6〜8年度 | 大学入試センター「過去３年分の試験問題」 | 29 |
| 同 | 令和3年度（第1日程）〜5年度 | Internet Archive に残るセンターのページと PDF | 25 |
| 大学入試センター試験 本試験 数学（問題・正解） | 平成26〜31年度 | 同 | 55 |
| 同（正解だけ） | 令和2年度 | 同（問題のページは写しがない） | 4 |

- `python3 scripts/ledger/fetch_jp_exams.py`: 索引のページ 23（1 つは写しなし）→ 「数学」の PDF 113 → pdftotext。タイムアウト 60 秒・リトライ 4 回（429 ／ 5xx ／ 接続拒否は待って再試行。途中で Internet Archive の接続拒否（Connection refused）による再試行が 12 回あり、すべて再試行で取れた）、進捗 done/total、取得済みは取り直さない。2 回目の実行は新しい取得 0
- センター試験の PDF の多く（平成26〜29年度・31年度、32 ファイル）は画像だけでテキストがない。pdftoppm で画像にして macOS の Vision で OCR した（scripts/ledger/ocr.swift、手元で動かす。`_index.json` に `ocr: true`）。OCR は記号（上線・矢印・Σ・∫）を落とすので、**記号の書き方は該当のページを画像で開いて目で確かめた**（C-2 の ◎）
- 数学②の冊子に一緒に入る 簿記・会計・情報関係基礎・別冊も索引のリンクに含まれて取ったが、読んでいない（OCR もしない）
- 本文は写していない。出典に書いたのは試験の名前・年度・科目・大問と、確かめた書き方（p̄、「条件 p」、正解の番号）だけ

### C-2. 生成した 9 行（likely）

| id | 日本側（確かめた箇所） | 米国側（確かめた箇所） | related（記号） |
|---|---|---|---|
| logic-notation | センター試験 平成29・31年度 数学Ⅰ・A 第1問「条件 p の否定を p̄ で表す」◎、「p かつ q」「q または r」◎（平成29・30年度） | CK-12 Geometry の ~p・p → q（2.8 Truth Tables ほか）、Levin の ¬ ∧ ∨ ∀ ∃（1.1） | negation-sign ほか 5 |
| proposition-vs-condition | センター試験 平成29・30年度 数学Ⅰ・A 第1問「実数 x に関する条件」「3 つの命題」、共通テスト 令和3年度 数学Ⅰ 第1問 | Levin の statement と predicate（1.1.3） | — |
| quadrant-roman-numerals | センター試験 平成29年度 数学Ⅱ・B 第4問「第1象限」、共通テスト 令和4年度 数学Ⅱ 第3問「第 ナ 象限」（正解 4） | OpenStax Algebra and Trigonometry・Elementary Algebra の Quadrant I〜IV | — |
| sample-variance-n-minus-1 | 共通テスト 令和5年度 数学Ⅰ 第3問の解答群（正解 ②「2 乗を合計して市の数で割った値」）、令和6年度 数学Ⅰ 第4問（共分散は偏差の積の平均値） | OpenStax Introductory Statistics の s（n − 1）と σ（N） | — |
| summation-index-letter | センター試験 平成30年度 数学Ⅱ・B 第3問 Σ_{k=1}^{n} ◎ | OpenStax Calculus Volume 1 Approximating Areas の Σ の i | summation-sigma |
| solution-as-ordered-pair | 共通テスト 令和5年度 数学Ⅱ 第4問「値の組 (p, r)」、センター試験 平成31年度 数学Ⅰ・A 第4問「組 (A, B)」 | OpenStax Algebra and Trigonometry の ordered pair、The solution is (−2, −4). | — |
| constant-of-integration-remark | 共通テスト 令和7年度 数学Ⅱ・B・C 第3問「C は積分定数」、令和5年度 数学Ⅱ 第2問「ただし，C は積分定数とする」 | OpenStax Calculus の不定積分の答えは + C で終わり、C の説明を添えることは少ない | plus-c-constant |
| accumulation-function-scope | 共通テスト 令和7年度 数学Ⅱ・B・C 第3問 F(x) = ∫₀ˣ f(t) dt（解答群 ◎ と正解 ③ x・⓪ 0）。関数に名前を付けない | AP Calculus の CED topic 6.4 The Fundamental Theorem of Calculus and Accumulation Functions | — |
| approximately-equal-notation | 高等学校学習指導要領解説 数学Ⅲ・数学B の ≒（4 件） | OpenStax の ≈（≒ は 0） | approximately-equal-sign |

◎ はページを画像で開いて確かめたもの。

- 行の文は確かめた範囲に書き直した（DECISIONS）: constant-of-integration-remark は「答案は」→「共通テストの問題文は」、solution-as-ordered-pair は確かめられない「x = 2, y = 3 と書く」を外して「値の組」の呼び方に、logic-notation は確かめられない「すべての」「ある」を外した
- **accumulation-function-scope は前のバッチの米国側の判断が誤りだった**（「CED に accumulation function の語もない」。topic 6.4 の名前に Accumulation Functions がある）
- **approximately-equal-notation の日本側は新しい資料ではなく学習指導要領解説**（前のバッチは日本語版 Wikipedia だけを見て「決められない」とした）
- 記号との related は台帳の組を両側に入れた（記号 8 ファイル）。validate の「symbols ↔ conventions の両方向」は通る

### C-3. 除外のまま（41 行。理由に「2026-09-26: …」を足した）

| 区分 | 行数 | 主な理由 |
|---|---|---|
| 日本側（試験に出てこない） | 13 | standard-unit-vector-letters・increase-decrease-table-vs-sign-chart・integrable-meaning・regular-polygon-area-apothem・half-angle-formula-form・perpendicular-slope-condition・addition-rule-scope（「加法定理」は三角関数だけ）・classify-equations-and-systems（「不定」は不定方程式だけ）・repeating-decimal-notation・special-right-triangles-by-angles・characteristic-equation-scope・velocity-speed-displacement・evaluation-bar-notation（記号は抽出で落ちるので見落としの可能性あり） |
| 日本側（試験の範囲外: 数学Ⅲ・中学・行列） | 8 | substitution-limits-table・integration-by-parts-u-dv・rational-function-scope・area-between-curves-dy-and-parametric・us-customary-units・polynomial-includes-monomial・identity-matrix-letter・definite-integral-definition（定義を述べない） |
| 日本側（マーク式で答案・習慣を見られない） | 5 | end-of-proof-marker・justification-for-shortcut-formulas・problem-instruction-verbs・acronym-mnemonics・expression-vs-equation-scope |
| 日本側（一部だけ確かめた） | 2 | vector-notation（矢印は確かめたが成分の丸かっこが問題文にない）、principal-square-root-includes-zero（「平方根のうち正のもの」はあるが 0 の扱いは分からない） |
| 両側 | 3 | handwritten-digits・handwritten-x-and-z（手書きは資料にない）、rationalizing-denominators-expectation（解答上の注意に有理化の指示がない、米国側も確かめられない） |
| 米国側 | 5 | base-n-parenthesized-subscript・jp-only-analytic-geometry・division-sign-usage・multiplication-sign-usage・angle-units-degrees-and-radians（日本側の資料を足しても変わらない） |
| 日米で同じ | 5 | relatively-prime-pairwise・p-value-vs-rejection-region・y-prime-vs-dy-dx・decimal-point-and-digit-grouping・reading-f-of-x（同上） |

- **NHK 高校講座**: https://www.nhk.or.jp/kokokoza/ は https://edu.web.nhk/kokokoza/ に移り、各回の「文字と画像で見る」の本文は NHK ONE の「ご利用にあたって」（用途・地域の選択、受信契約の確認）に同意した後にだけ読み込まれる（ページの HTML にも本文がない）。規約への同意に当たるのでエージェントはしなかった。人間が同意して使うなら、除外のうち「答案・授業の言い方」の行（end-of-proof-marker・special-right-triangles-by-angles・increase-decrease-table-vs-sign-chart・problem-instruction-verbs ほか）が戻る見込みがある
- ledger/conventions-excluded.csv の 2 行（vector-notation・solution-as-ordered-pair）は理由のコンマを引用符で囲んでおらず、CSV として読むと理由が切れていた。csv モジュールで書き直した

## D. 確かめた主張

- 大学入試センターのサイト: 「過去３年分の試験問題」は令和6〜8年度だけ。令和3〜5年度・センター試験の問題のページは 404（2026-09-26）。「過去のセンター試験情報」（平成26〜令和2年度）には実施結果などだけで問題がない。Internet Archive の CDX で、センターのページと PDF（center_exam/…、albums/abm.php?…）の写しがあることを確かめた。令和2年度の問題のページ（/center/shiken_jouhou/jisshikekka/index.html）は 2018 年以降の写しが 404 か 301 だけ
- 画像で確かめたページ: 共通テスト 令和7年度 数学Ⅱ・B・C p.32–33（第6問、ベクトルの矢印・点 C(x, y, z)）・p.16–17（第3問、F(x) = ∫ f(t) dt と解答群）、センター試験 平成29年度 数学Ⅰ・A p.25（第1問、q̄ ⟹ p̄）、平成30年度 数学Ⅰ・A p.23（第1問、条件 p, q, r, s・q または r・Ā）、平成30年度 数学Ⅱ・B p.23・25（第3問 Σ_{k=1}^{n}、第4問 ベクトル）
- 正解の表: 共通テスト 令和5年度 数学Ⅰ 第3問 カ ②、令和4年度 数学Ⅱ 第3問 ナ 4、令和7年度 数学Ⅱ・B・C 第3問 ソ，タ ③，⓪
- 米国側の件数（参照の本文）: CK-12 Geometry の ~p 69（2.8 Truth Tables 50）、Levin の ¬ 185・∧ 70・∨ 93・∀ 127・∃ 84・predicate 42、OpenStax の Quadrant I〜IV（Algebra and Trigonometry 60 ほか）、OpenStax Calculus の ∑ i = 436 ／ ∑ k = 98、OpenStax Calculus の ≈ 540 と ≒ 0、CED の Accumulation Functions 2、OpenStax Calculus の ∫ … dx = … + C の形 130
- CK-12 Geometry の Given : … Prove : …（Given 33・Prove 32）、AP Calculus の CED の試験の区分の表（Part A・Part B の電卓の表示）

## E. 怪しい点

- **Internet Archive の写しを出典にした**（センター試験と共通テスト 令和3〜5年度）。センター自身が公開した PDF の写しだが、今のセンターのサイトには無い。出典の url は web.archive.org の写し
- **OCR は記号を落とす**ので、「出てこない」とした除外の理由のうち記号の行（evaluation-bar-notation の [F(x)]、vector-notation の成分）は見落としの可能性がある。ページを 1 枚ずつ見たわけではない
- 共通テスト・センター試験は**マーク式の試験**で、教科書・授業・答案の書き方の資料ではない。確かめられたのは問題文の記号と言い方だけで、「日本は〜と書く」は「試験の問題文は〜と書く」に言い換えた
- sample-variance-n-minus-1 は選択肢の中から正解 ② を確かめた（問題文に定義が直接書かれているわけではない）。令和5年度 数学Ⅰ・A 第2問も同じ問題
- approximately-equal-notation の日本側は学習指導要領解説で、試験には ≒ が出てこない（0 件）
- accumulation-function-scope の米国側は CED の topic の名前だけで、授業でどう呼ぶかは確かめていない
- A-3 の 5 行は指示の外で en を戻した（指示 1 の理由を当てた）。戻した en のうち 3 行は Math Stack Exchange で要の部分が 3 件未満（ask the ta 2、explain them to each other 0、work on … together は検索しない）
- when-is-it-due・email-regrade-request ほか 8 行は、en の要の部分の件数ではなく別の要の部分の件数で likely になっている（A-3）

## F. 確認（合否はすべて終了コード）

```
pnpm exec tsc --noEmit        # exit 0
pnpm validate                 # exit 0。警告 0。conventions 80、phrases 275、symbols 220
pnpm spell                    # exit 0。2,286 ファイル、0 件（kaisetsu・pdftoppm を cspell.json に足した）
pnpm test                     # exit 0。156/156（名前の検査の除外を Calculators → Pencils）
pnpm build                    # exit 0。export: phrases.json 275、symbols.json 218、conventions.json 80
pnpm corpus:count             # exit 0（修正 2 の新しい要の部分）
pnpm corpus:fetch:mse         # exit 0（新しい検索 2 件、quota の残り 37）
pnpm corpus:decide -- --write --ids <phrases の 275 行>
                              # 2 回とも exit 0。判断不能 1（terms の quadratic-regression、Phase 2 から）／ 食い違い 0 ／ 直すこと 0
python3 scripts/ledger/fetch_jp_exams.py
                              # 2 回とも exit 0。113/113、OCR 32
```

- 最初の test は exit 1（文頭の Pencils を名前と見た）、spell は 2 回 exit 1（kaisetsu、次に pdftoppm）。直して exit 0 を確かめた
- `pnpm crosscheck` は terms を変えていないので回していない
