# Phase 5 公開前の抜き取り（Fable、第 2 回）

作成: 2026-10-09 ／ 範囲: 3606db1（第 1 回のレポート）→ 本コミット
指示: 第 1 回（`audits/2026-10-09-sample-fable.md`。親が Opus 5.5 で動いていた）の H-a 1 を受けて、同じ指示文（公開前の抜き取り: 0〜5。最初の指示文の 0〜6 と、監査 3 の抜き取りのやり方で）を Claude Fable 5.1 のセッションに渡したもの。**このセッション（親）は Claude Fable 5.1（claude-fable-5-1）**で、読み取り専用の見直し役 5 人（r1〜r5）と 0′ の 1 人（r0）も Fable 5.1（Agent の model を fable に指定して起動）。DECISIONS「監査のモデル」の「公開の直前に一度、Claude Fable 5.1 で verified の全体から 100 項目を抜き取って見直す」を、親・見直し役ともに Fable 5.1 で行った。

**これは生成したセッションとも、第 1 回で大きな直しをしたセッションとも別のセッションです**（CLAUDE.md 絶対ルール 8）。第 1 回の大きな直し 7 項目は、このセッションが見直して verified に戻した（0′）。このセッションが大きな直しにした 3 項目は verified にしていない。

## まとめ

- **0（監査 15 の J-2）**: conventions/us-only-precalculus-topics は第 1 回が見直して verified にしていた（済み。conventions 72 / 72）。**0′**: 第 1 回のレポートの J-2 のとおり、第 1 回が大きな直しにして likely に戻した 7 項目（terms/right-riemann-sum・left-riemann-sum・derivative-of-a-parametric-curve・expression・trigonometric-ratio・disk-method、symbols/tangent-of-theta）を見直し役 r0 と親が見直した。**7 項目とも直しは資料どおり**で、合格 2・小さな直し 5 で **verified に戻した**
- **1（抜き取り）**: 開始時（3606db1）の verified **1,608 項目**から `random.Random(20261010).sample` で 100 項目（terms 70・phrases 14・symbols 13・conventions 3）。母集団が第 1 回と 10 項目違うので同じ種でも同じ 100 項目にはならず、第 1 回と重なるのは **20 項目**（第 1 回の直しの後の状態を見た）。一覧は `audits/2026-10-09-sample-fable-2-list.md`
- **2〜3（見直しと判定）**: 見直し役 5 人（Fable 5.1）に 20 項目ずつ、親も 100 項目を読み、指摘はすべて親が資料で確かめてから直した。**合格 67・小さな直し 30・大きな直し 3・不合格 0**
- **4（見落としの率）**: 学生が読む中身が間違っていた項目（**大きな直し＋不合格**）は **100 項目中 3**（95% 信頼区間 0.6〜8.5%。verified 1,608 項目に当てると 50 前後）。3 つとも文そのものが学生に誤りを教えていた（motion-problem の見出し、write-an-equation・be-inscribed-in の mapping）。小さな直しは 30（21.2〜40.0%）。型ごとの数は 4. の表。第 1 回（8）と合わせると **200 項目中 11**（5.5%、2.8〜9.6%）
- **5（公開の判断）**: 3 は閾値 3 を超えない。**指示 5 のとおり「公開してよい」**。ただし (a) 第 1 回の H-a 2（第 1 回の型の一覧を公開の前にどこまで直すか）はユーザーの判断のまま残っていて、今回見つかった型もその一覧に足した（5. の表。T1a は正規表現を広げて 46 行、T7 は新しい型で 6 行）、(b) 2 回の抜き取りの大きな直し 11 のうち 8 が mapping と見出しの型（M1・M5・前回の M3・M4）で、機械の一覧で残りを探せる型。告知を伴う正式な公開はユーザーの確認が要る（CLAUDE.md 規則 6）
- verified: terms 1,044 → **1,047**（0′ で +6、大きな直し −3）、symbols 219 → **220**（0′ で +1）、phrases **273**、conventions **72**。4 つのコレクションとも公開の閾値を超えたまま
- いま問題の flag: **audit-major-fix 3**（motion-problem・write-an-equation・be-inscribed-in）、**audit-human 2**（第 1 回のフレーズ class-asking-another-example・office-hours-do-you-have-a-minute。ユーザーの判断待ち）、draft 1（quadratic-regression）
- 段ごとに直し・判定のコミットのあと push した（b8c5345・cb60849・192b6b0・67c02bd・a0ccaab・153612f と本コミット）。コミットはすべて `git add` → `git commit`（pre-commit フックが validate・tsc・test を回す。--no-verify は使っていない）

## 0 と 0′. 監査 15 の J-2 と、第 1 回の audit-major-fix 7 項目の見直し（b8c5345 直し・cb60849 判定。batch 0）

- **0**: 指示 0 の conventions/us-only-precalculus-topics は第 1 回が見直して verified にしていた（e96104a・ab93c99）。このセッションでは触っていない
- **0′**: 第 1 回のレポートの J-2「最初に flag audit-major-fix の 7 項目を見直す（直したセッションと別のセッションで）」を、指示 0 と同じ型の仕事としてこのセッションが行った（DECISIONS）。見直し役 r0 1 人（Fable 5.1。`audits/work/major-sf2-r0.md`）: 指摘 6 件（大 0・小 5・要確認 1）。**7 項目とも第 1 回の直しは資料どおり**: 右・左リーマン和の定義（CED topic 6.2 の uniform or nonuniform partitions、OpenStax 5.2）、derivative-of-a-parametric-curve の見出し（CED 9.1・9.2 の learning objective。前の見出しは 9.2 の題の一部）、expression・trigonometric-ratio・disk-method の mapping near（それぞれ中学校解説と日本語版 Wikipedia「等式」、IM Geometry の鋭角の定義、日本語版 Wikipedia「回転体」の円板法）、tangent-of-theta の読みの並び（symctx の文脈に別の意味なし）
- 小さな直し（親が資料で確かめた）: right-/left-riemann-sum の latex・読みを Δx_i に（定義の「幅はそろっていなくてもよい」と式をそろえた。CED topic 6.3 の書き方）、expression の不等式の側の根拠に中学校学習指導要領解説（数量の関係を表す式を等式または不等式に表す）、trigonometric-ratio の mapping_note に参照が一般の角の値にも trigonometric ratios と言う箇所（IM Algebra 2 6.6、OpenStax Calculus Volume 2 3.3・Volume 3 2.1）、tangent-of-theta に冠詞つきの読み the tangent of theta（49。sine・cosine と同じ扱い。1 つ目は tangent theta のまま。DECISIONS）
- 判定: 合格 2（derivative-of-a-parametric-curve・disk-method）・小さな直し 5 → **7 項目とも verified**（terms +6、symbols +1）

## 1. 抜き取り

- 母集団: 本セッションの開始時（3606db1）の verified **1,608 項目**（terms 1,044・symbols 219・phrases 273・conventions 72）を (collection, id) の昇順に並べたリスト。0′ で verified に戻した 7 項目は開始時には likely なので入っていない
- `random.Random(20261010).sample(リスト, 100)`（指示 1 の種）。第 1 回の母集団（2510669 の 1,616 項目）とは、第 1 回で likely に戻った 9 項目が抜け、verified になった conventions/us-only-precalculus-topics が入った分だけ違う。抜き取りの添字は同じでも添字の指す項目が 1 つずれるので、**同じ種でも第 1 回と同じ 100 項目にはならない**（第 1 回のレポート H-a 1 の「同じ 100 項目になる」は母集団を 2510669 に固めた場合の話）。第 1 回と重なるのは 20 項目（一覧の「第 1 回」の欄）。母集団を今の verified にしたのは、第 1 回の直しの後の全体の見落としの率を新しく測るため（第 1 回の 100 項目を読み直しても全体の率は出ない。DECISIONS）
- 内訳 terms 70・phrases 14・symbols 13・conventions 3。見直し役の割り当て: r1〜r3 は terms を抜き取りの順に 20 ずつ、r4 は terms の残り 10・conventions 3・symbols 7、r5 は symbols 6・phrases 14（第 1 回と同じ）

## 2. やり方

- 見直し役（読み取り専用、Claude Fable 5.1、資料を引く道具つき。Agent の model を fable に指定）: `audits/reviewer-instructions.md` の観点すべて（terms の 13、symbols の S1〜S6、phrases の P1〜P6、conventions の C1〜C7）。第 1 回の見直し役のメモは読ませない（独立に読むため）。同時に動かすのは 4 人まで（r1〜r3 と r0 → r4・r5）。r3 は途中で API の接続エラーで止まり、同じ指示で再開した（書き進めた分は残る）。結果は `audits/work/sample-fable-2-r1〜r5.md`・`major-sf2-r0.md`（gitignore）
- 親（Fable 5.1）: 100 項目を show_batch.py と資料で読み（自分で見つけたもの: compare-coefficients の level.jp 中3、integration-by-substitution の ja.alt、angle-sum-of-a-triangle の「米国の Geometry は」、element の判定の説明、implicit-function の implicit curve、optimization-problem の 数B、office-hours-english-terms-are-new の Math Stack Exchange の抜粋）、見直し役の指摘を 1 件ずつ資料で確かめた（refgrep・kaisetsu_subjects --find・ced.py・jawiki.py・enwiki.py・corpus:probe・symctx.ts、OpenStax の節番号は collection.xml、Math Stack Exchange と Merriam-Webster は内蔵ブラウザ）。見直し役の案を親が退けたもの: cross-method の mapping near の案（PLAN §6 の直訳禁止リストが none と書くので仕様を変えず、H-a に）、diophantine-equation の mapping near の案（高校の用法では同じ）、explaining-solution-derivative-equal-to-zero の 18.03 の critical points を別の意味とする読み（同じ操作なので数える）、perimeter の「周囲の長さ」を残す案（数学の資料に 0 件）、arccosine の ja.term の注記（外来語。backlog）
- 判定は監査と同じ（合格・小さな直し・大きな直し・不合格）。小さな直しは verified のまま、大きな直しは likely ＋ flag audit-major-fix（scripts/audit/edit.py）。判定の記録は batch 0 で、直した項目だけ（合格の 67 は行を足さず付録 A に書く。第 1 回と同じ）

## 3. 結果

| コレクション | 項目 | 合格 | 小さな直し | 大きな直し | 不合格 |
|---|---|---|---|---|---|
| terms | 70 | 42 | 25 | 3 | 0 |
| symbols | 13 | 8 | 5 | 0 | 0 |
| phrases | 14 | 14 | 0 | 0 | 0 |
| conventions | 3 | 3 | 0 | 0 | 0 |
| **計** | **100** | **67** | **30** | **3** | **0** |

見直し役ごと（見直し役の案 → 親の判定）: r1 合格 11・小 9・大 0 → 合格 13・小 7・大 0 ／ r2 合格 11・小 6・大 3 → 合格 12・小 6・大 2（cross-method の大の案は退けた） ／ r3 合格 13・小 6・大 1 → 合格 13・小 6・大 1 ／ r4 合格 13・小 7・大 0 → 合格 14・小 6・大 0（repeating-decimal-bar は記録だけで合格） ／ r5 合格 16・小 4・大 0 → 合格 15・小 5・大 0（complex-conjugate-bar の要確認を小に）。

**大きな直しの 3 項目**（不合格は無い）:

| 項目 | 判定 | 何が違っていたか（資料） | 文そのものの誤りか |
|---|---|---|---|
| terms/motion-problem | 大きな直し | en.term が uniform motion（等速運動の名前）で、書き言葉 35 件はすべて uniform motion applications ／ problems の内側。OpenStax Elementary Algebra（3.5・8.8）・Intermediate Algebra（2.4）の本文は問題の型を uniform motion problems と呼ぶ（書 ①、OpenStax だけ）。節の名前 uniform motion applications は候補にしない（STYLE）。variants の distance, rate, and time は公式の名前、motion problem は CED では別の型の問題 | はい（見出し） |
| terms/write-an-equation | 大きな直し | mapping exact だが、エントリ自身の定義・pitfalls[0] が「等号を含むなら equation、含まないなら expression」と範囲の差を書いていた（「式で表す」は両方を指す）。兄弟の expression・equation は near。第 1 回の M1 型 | はい（mapping） |
| terms/be-inscribed-in | 大きな直し | mapping exact だが、pitfalls[1] が「2 円が内接する」は internally tangent と書き、日本語版 Wikipedia「円 (数学)」・共通テスト 令和3年度 第1日程 数学I・A 第5問は 2 円に「内接する」を使う。英語の inscribed in は多角形と円・楕円の関係。第 1 回の M1 型 | はい（mapping） |

## 4. 見落としの率

- **学生が読む中身が間違っていた項目（大きな直し＋不合格）: 100 項目中 3**（95% 信頼区間 0.6〜8.5%。verified 1,608 項目に当てると 50 前後）。3 つとも文そのものが学生に誤りを教えていた（見出し 1・mapping 2）。第 1 回の 8（うち文そのものの誤り 4）と合わせると 200 項目中 11（5.5%、2.8〜9.6%）、文そのものの誤りは 7
- **小さな直し: 30**（21.2〜40.0%）。うち、学生が読む事実・数学の記述が不正確だったもの 9（center-of-dilation の負の scale factor、angle-sum-of-a-triangle の資料に無い言い方、arctangent の arctan x、area-under-the-curve の資料の名前の無い主張、implicit-function の CED の主張と implicit curve、triangle-proportionality-theorem の「本プロジェクトの言い方」、orthographic-projection の Grade 6 と記事の段、compare-coefficients の compare ／ equate、sum-of-an-arithmetic-sequence の読み）。ほかは level・ja.alt・出典・register・言い方の補い
- 第 1 回（8）より少ないが、見つかった型は同じ系（M1 の mapping が 2 回続けて出た）。第 1 回でも読んだ 20 項目（重なり）は、今回は合格 18・小さな直し 2（limit-of-a-riemann-sum の出典の note、sum-of-an-arithmetic-sequence の読み）で大きな直しは無く、大きな直し 3 はすべて重なりの外の 80 項目から出た（第 1 回の直しの後の項目には大きな直しが残っていなかった）

**型ごとの数**（1 項目が複数の型に入ることがある。付録 A の「型」の欄）:

| 型 | 中身 | 項目 | 判定 |
|---|---|---|---|
| M1 | mapping exact だが、エントリ自身の本文が日本語と英語の範囲の差を書く（第 1 回と同じ型） | write-an-equation・be-inscribed-in | 大 2 |
| M5（新） | 見出しの語を書き言葉がもっと長い言い方（… problems ／ applications）の先頭としてばかり使い、見出しが別のもの（運動）の名前になっている | motion-problem | 大 1 |
| m1 | level（jp・us）の根拠が資料に無い・足りない | compare-coefficients・composite-number・collinear・distribute・orthographic-projection・element・acute-angle・dividend・implicit-function・optimization-problem・cube-root | 小 11 |
| m2 | ja.alt・spoken_ja・name_ja の資料（0 件・資料の言い方） | compare-coefficients・summation-notation・integration-by-substitution・collinear・distribute・perimeter・combine-like-terms・therefore-sign・cube-root（ほかに大の write-an-equation） | 小 9 |
| m3 | 参照・資料の言い方と食い違う事実の記述 | compare-coefficients・integration-by-substitution・center-of-dilation・angle-sum-of-a-triangle・triangle-proportionality-theorem・arctangent・orthographic-projection・implicit-function・area-under-the-curve（ほかに大の be-inscribed-in の楕円） | 小 9 |
| m5 | en.alt・evidence が別の概念・見出しの語を含む言い回し・0 件の言い方 | compare-coefficients・center-of-dilation・angle-sum-of-a-triangle・rotate・implicit-function | 小 5 |
| m6 | 出典・出典の note・related の補い | composite-number・same-side-interior-angles・ascending-order・limit-of-a-riemann-sum・derivatives-of-inverse-trig-functions・therefore-sign・inverse-cosine-notation・hyperbolic-functions-notation | 小 8 |
| m7 | 読み・判定の説明・書き写しの精度 | orthographic-projection・element・sum-of-an-arithmetic-sequence | 小 3 |
| m8（新） | 記号の 1 つ目の読みが 1 ソース頼みで、規則 9 の ② になる（2 つ目の register） | complex-conjugate-bar | 小 1 |

第 1 回の型のうち M2（定義の日本語の限定）・M3（③ の根拠が題の一部）・M4（記号の読みの形の逆関数）・F1（フレーズの Math Stack Exchange の根拠）はこの 100 項目には出なかった（F1 に当たる office-hours-english-terms-are-new は抜粋を読んで根拠が保てた）。m4（資料の名前の無い日本側の主張）も出なかった。新しいのは M5 と m8。

## 5. 公開の判断

- 大きな直し＋不合格は **3 で閾値 3 を超えない**。指示 5 のとおり **「公開してよい」**と書く
- ただし、第 1 回の 5 の「次のセッションが sample-types.md を直してから公開する」と H-a 2（T6・T5 の量が多いので、公開の前に全部やるか大きな直しの型だけにするか）は、ユーザーの判断のまま残っている。今回の 3 の型は第 1 回の一覧に足した（`scripts/audit/sample_types.py`: T1a の正規表現を広げ、T7 を足した）。2 回の抜き取りの大きな直し 11 のうち 8 が mapping・見出しの型なので、公開の前に少なくとも **T1a の verified 34 行と T7 の 6 行**を読むことを勧める（T1a には circumference・derivative・limit・integration・line・circle・x-intercept のように、日本語と英語の範囲の差を本文が書いている verified の語が並ぶ）

| 型 | 一覧の中身 | 行（うち verified） | 第 1 回の最後 | 抜き取りの例 |
|---|---|---|---|---|
| T1a | mapping exact で、エントリ自身の文が日本語と英語の範囲の違いを書いている（第 2 回で「A なら X、B なら Y」「日本語は…言い分けるが英語はどちらも」「〜にだけ出てくる」の型を足した） | 46（34） | 28（20） | expression・trigonometric-ratio、第 2 回: write-an-equation・be-inscribed-in（直した後は出ない） |
| T1b | mapping none の terms のうち、日本語の名前が日本側の資料にあるか mapping_note が名前を挙げる語 | 20（13）／ none 37 | 20（13） | disk-method（near に）。cross-method は PLAN §6 の表どおり none のまま（H-a） |
| T2 | 定義の日本語に、定義の英文が言わない限定 | 28（20） | 28（20） | right-/left-riemann-sum（直した後は出ない） |
| T3 | ③ の見出しの根拠がすべて別の名前（題）の一部 | 0 | 0 | derivative-of-a-parametric-curve |
| T4 | 記号の読みの形「X of *」が inverse ／ arc も数える | 4（4） | 4（4） | tangent-of-theta |
| T5 | likely の根拠が Math Stack Exchange だけのフレーズ（MICASE 3 件未満）。抜粋を読んだ記録が無いもの | 46（45）。読んでいない 37 | 46（45）。38 | office-hours-english-terms-are-new は今回読んだ（記録あり） |
| T6 | 日本側の資料に 0 件の ja.alt | 186（87） | 196（97） | 今回の ja.alt の直し 10 語で 10 行減った |
| T7（新） | 見出しの語を書き言葉のコーパスが、もっと長い言い方の先頭としてばかり使う（直後に problem ／ application ／ theorem ／ rule …）。verified の terms、書き言葉 5 件以上で 6 割以上 | 6（6） | — | motion-problem（直した後は出ない）。残る 6 行は arctangent（inverse tangent function）・differential（differential equation）・divisibility（divisibility test）・net-change（net change theorem）・number-of-elements（cardinality rule）・squeeze（squeeze theorem）で、見出しが単独の概念として使われる語が混じる。読んで決める |

（どの行も手がかりで、誤りとは限らない。）

## A-2. 仕組みに足したもの・変えたもの

| もの | 場所 | 中身 |
|---|---|---|
| 抜き取りの一覧（新） | `audits/2026-10-09-sample-fable-2-list.md` | 100 項目・種・母集団・見直し役の割り当て・第 1 回との重なり |
| 型の一覧 | `scripts/audit/sample_types.py`、`audits/checks/sample-types.md`・`.json` | T1a の正規表現を広げた（write-an-equation・be-inscribed-in の型）。T7（見出しが長い言い方の先頭）を足した。約 2 分 |
| SYMBOL_PATTERNS | `scripts/corpus/lib.ts` | tangent-of-theta に「the tangent of theta」（the tangent of *） |
| 単元ファイル | `data/curriculum/jp-chuugaku-3-niji-houteishiki.json` | term_refs から compare-coefficients を外した（level.jp 中3 と一緒に） |
| 読んで正しいとした行 | `scripts/audit/reference_quotes_checked.json`・`kaisetsu_subjects_checked.json`・`kaisetsu_absent_checked.json` | このセッションの文（7 行・2 行・2 行） |
| STYLE 追記欄 | `docs/STYLE.md` | 見出しの語を含まない collocation は候補として数えられる（公式の名前は pitfalls に）。教科書の節の名前の型（Solve … Applications）は候補にしない |
| backlog | `audits/backlog.md` | 224〜250 行 |

## 機械の確かめ（本コミットで取り直した）

| 確かめ | 一覧 | 第 1 回の最後（3606db1） | 本コミット |
|---|---|---|---|
| 書き写しの検出 | `copy-overlap.md` | 332 箇所・290 項目 | **333 箇所・291 項目**（増えた 1 は angle-sum-of-a-triangle の pitfalls[0] の IM Grade 8 の言い方 8 語。10 語未満で 1 ソースなので残す） |
| 日本側の主張（G-1 の正規表現） | `jp-claims.md` | 106 項目・109 文 | **106 項目・109 文** |
| 日本側の主張（広い正規表現） | 同上 | 489 項目・672 文 | **492 項目・673 文** |
| 米国側の主張で資料を名指しせず、出典に参照もない | `us-claims.md` の A | 4 項目・4 文 | **4 項目・4 文** |
| 同上で、出典に参照がある | `us-claims.md` の B | 22 項目・23 文 | **21 項目・22 文** |
| 確かめられない言い方（validate の警告） | `wording-warnings.md` | 13 文（verified 1） | **13 文（verified 1）** |
| 例文に見出しの語がない | `examples_headword.py` の出力 | 79 語 | **79 語** |
| 名指しした資料が出典に無い | `source-mentions.md` | 132（verified 0） | **133（verified 0）** |
| 参照の引用 | `reference-quotes.md` | 見つからない 0 | **見つからない 0**（2,570 の言い方。checked A 64・B 48。このセッションの文の 7 行を読んで checked に） |
| 解説の科目 | `kaisetsu-subjects.md` | 読む行 0（342 行） | **読む行 0**（345 行。checked A 65・B 26。このセッションの 2 行を読んで checked に） |
| 解説の「出てこない」 | `kaisetsu-absent.md` | 読む行 0（219 行） | **読む行 0**（230 行。checked A 59・B 103、語 0 68。このセッションの 2 行を読んで checked に） |
| 参照の定理名の突き合わせ | `reference-theorem-names.md` | 名前 726、一致 131、監査で見る 50 | **同じ** |
| 英語版 Wikipedia の記事名の見出し | `wikipedia-heads.md` | 19 語（verified 12） | **19 語（verified 12）** |
| 抜き取りの型 | `sample-types.md` | T1a 28・T1b 20・T2 28・T3 0・T4 4・T5 46（38）・T6 196 | **5. の表**（T7 を足した） |
| corpus:decide の判定の種類 | `audits/corpus-2026-10-09.md` | 主見出し 1318・併記 211・決まった言い方が出てこない 65・参照 314・要の部分が 3 件以上 74（MSE 47）・人間 103・判断不能 1 | **主見出し 1318・併記 210・決まった言い方が出てこない 65・参照 315・要の部分が 3 件以上 73（MSE 46）・人間 103・判断不能 1・register の食い違い 0**、エントリ側で直すこと 1（nonresponse。監査 10〜15 と同じ） |
| langlink の突き合わせ | `pnpm crosscheck` | 一致 515、flag 0 | **一致 515、flag 0** |
| level.us（監査 6 の決定 1・7） | `pnpm exec tsx scripts/audit/level-us.ts` | 0 語 | **0 語** |
| 監査の順 | `python3 scripts/audit/order.py` | 2107 行 | **2107 行**（0 行の追加） |

## コレクション別の verified と公開の閾値（PLAN §8）

| コレクション | 件数 | verified | likely | draft | 閾値 | 閾値との差 |
|---|---|---|---|---|---|---|
| terms | 1,539 | **1,047** | 491 | 1 | 1,000 | 届いた（+47） |
| symbols | 220 | **220** | 0 | 0 | 200 | 届いた（+20。全件） |
| phrases | 275 | **273** | 2 | 0 | 200 | 届いた（+73） |
| conventions | 72 | **72** | 0 | 0 | 30 | 届いた（+42。全件） |

- push 済みなので、サイトは verified の項目を本文つきで出している（likely に戻った 3 項目は既定で非表示・noindex）。pnpm build の書き出しは Anki が用語 1,047・記号 220・フレーズ 273、PDF が用語 1,047、検索の索引が 2,105 件（未確認 493）

## 人間レビュー

- audit-human の 2 フレーズ（class-asking-another-example・office-hours-do-you-have-a-minute。第 1 回）は、ユーザーが en を決める（監査 13 の前の決定 3 と同じ形。決めたら corpus-human-settled を付けて audit-human を外す）。このセッションでは触っていない
- 第 4 週の表は 2026-10-14 以降（監査 3 の決定 7）なので、このセッションでは作っていない

## I. 確認（合否はすべて終了コード）

各コミットの前に pre-commit フック（`pnpm validate && pnpm exec tsc --noEmit && pnpm test`）が回った（すべて exit 0。--no-verify は使っていない）。最後の状態で回したもの:

```
pnpm validate            # exit 0。警告 13（verified 1: qed-end-of-proof の notes[0] の 1 文目、ユーザーの文）
pnpm exec tsc --noEmit   # exit 0（pre-commit）
pnpm test                # exit 0（10 files・218 tests）
pnpm spell               # exit 0（このレポートと sample-types.md も cspell で確かめた）
pnpm crosscheck          # exit 0（一致 515、flag 0）
pnpm build               # exit 0（validate → search-index 2,105 件 → OGP → サイト → export・Anki（用語 1,047・記号 220・フレーズ 273）・PDF（用語 1,047））
pnpm audit:copy ／ pnpm audit:claims                      # exit 0
python3 scripts/audit/source_mentions.py ／ examples_headword.py ／ wording_warnings.py ／ reference_names.py ／ wikipedia_heads.py ／ reference_quotes.py ／ kaisetsu_subjects.py ／ kaisetsu_absent.py ／ sample_types.py   # exit 0
pnpm exec tsx scripts/audit/level-us.ts                  # exit 0（外す案 0 語）
pnpm corpus:count -- --ids …（7 項目）／ pnpm corpus:decide -- --write --ids …（同じ 7 項目）／ pnpm corpus:decide   # exit 0
python3 scripts/audit/order.py                           # exit 0（2107 行、0 行の追加）
```

## H. 規則の問題

### H-a. ユーザーの判断が要るもの

1. **公開**: 指示 5 のとおり、この抜き取りでは「公開してよい」。第 1 回の H-a 2（公開の前に型の一覧をどこまで直すか: T1a 46 行（verified 34）・T1b 20・T2 28・T4 4・T5 37・T6 186・T7 6）の決定と合わせて、告知を伴う正式な公開（PLAN Phase 5 の最後）を決めてほしい。勧め: 2 回の抜き取りで大きな直し 11 のうち 8 が mapping・見出しの型なので、T1a の verified 34 行と T7 の 6 行は公開の前に読む
2. **cross-method（たすき掛け）の mapping**: PLAN §6 の直訳禁止リストは「たすき掛け → none。米国は ac method / grouping / box method」と書く。見直し役 r2 は、OpenStax Elementary Algebra 7.3 の trial and error（a と c の因数の組を試して中央の項を確かめる手順）がたすき掛けと同じ手順なので、第 1 回の規則（none は名前も方法も資料に無い語だけ）を裏返して当てれば near だと指摘した。仕様（PLAN §6）が優先なので none のまま合格にした。表の行を near に直すか、none の理由（名前の無い手順は対応と見ない）を表に書くかを決めてほしい（T1b の一覧の読み方にも関わる）
3. **audit-human の 2 フレーズの en**（第 1 回。上の人間レビュー）

### H-b. backlog に積んだもの（`audits/backlog.md` の 224〜250 行）

| 行 | 出どころ | 中身 |
|---|---|---|
| 224〜227 | r0 | ② の中の並びの 1 ソース頼み、冠詞つきの読みの扱い、綴りだけの候補（disc ／ disk）、TERM_FORMS の !second と second-order |
| 228〜231 | r1 | jawiki.py --help、T6 の活用形、定理名だけの見出しの量の言い方、カタカナ語の ja.term の注記 |
| 232〜235 | r2・親 | たすき掛けの表と規則の衝突（H-a 2）、候補が 1 つの語の別の意味、重なる候補と collocation の二重数え、T6 に --search の件数 |
| 236〜240 | r3 | en.alt の見出しを含む言い回し 19 語、判定の説明の警告の型、記事の段の確かめ、plane・identity の別の意味、decideRobust の ①→② |
| 241〜244 | r4 | 記号の 2 つ目以降の形の別の意味、latex の読みの括弧、記号と用語の level.us の差、level.jp を解説の科目で機械的に拾う |
| 245〜249 | r5 | MSE の A | B の二重数え、語がそのまま読みの記号の evidence、arccosine の arc cosine、要の部分の !second、attested-only の 1 ソース頼み |
| 250 | 親 | decide --write が mismatch flag で verified を likely に落とす |

## J. 次のセッションへ

1. **同じ指示文で再開しない**。このセッションの結果は「3 で閾値以下。公開してよい」（指示 5）だが、第 1 回の H-a 2 と今回の H-a 1〜2 をユーザーが決めてから始める
2. **最初に flag audit-major-fix の 3 項目を見直す**（直したセッションと別のセッションで。見直す点は flag の note と付録 B）: terms/motion-problem（en.term・外した variants・mapping_note・pitfalls・level.jp）、write-an-equation（mapping・mapping_note・ja.alt）、be-inscribed-in（mapping・mapping_note・pitfalls[1]）
3. **型の一覧**（`audits/checks/sample-types.md`。ユーザーが範囲を決めたら）: T1a 46 行（verified 34）は「日本語は A と B を言い分けるが英語はどちらも X」の文を含む語（circumference・derivative・limit・integration）が mapping near の候補。T7 6 行は `pnpm corpus:probe -- --contexts` で読む。T1b・T2・T4・T5・T6 は第 1 回の J-3 のとおり
4. 4 つのコレクションとも公開の閾値を超えている（terms 1,047・symbols 220・phrases 273・conventions 72）。告知を伴う正式な公開はユーザーの確認が要る（CLAUDE.md 規則 6）
5. 見直し役が範囲の外で見つけたもの（その語の監査で）: terms/quotient・divisor-in-division の level.jp（dividend と同じく 小学校 を）、terms/repeating-decimal の level.us に Pre-Algebra（記号 repeating-decimal-bar の根拠 OpenStax Prealgebra・IM Grade 8）、terms/summation-notation の level.us に AP Calculus（記号 summation-sigma の CED 4 件）、terms/arccosine の候補が arc cosine（2 語）を拾わない、terms/trigonometric-function の related に trigonometric-ratio、terms/center-of-mass の related に centroid、terms/dilation の related に center-of-dilation、terms/arccosine・arcsine・arctangent の ja.term（カタカナ語）の注記の要否（backlog 231）、washer-method の mapping none（T1b。日本語版 Wikipedia「回転体」は g(x) のある式も書く）、terms/infinity・cross-product・degrees-of-freedom（第 1 回の J-5）
6. `corpus/audit-pending-changes.json`（gitignore）に、likely の語・慣習差の前からの記録が残っている（168 項目）。その項目の判定で記録に付く
7. Math Stack Exchange の検索は今日 0 件（office-hours-english-terms-are-new の抜粋は内蔵ブラウザで読んだだけ）

## 付録 A. 抜き取りの 100 項目と判定

型の記号は 4. の表（M は大きな直し、m は小さな直し）。合格の 67 項目は判定の記録に行を足していない（第 1 回と同じ）。「第 1 回にも」は第 1 回の 100 項目にも入っていた項目。

| # | 項目 | 見直し役 | 判定 | 型 | 直した内容 |
|---|---|---|---|---|---|
| 1 | terms/compare-coefficients | r1 | 小さな直し | m1・m2・m3・m5 | level.jp の 中3（根拠なし）を外し、pitfalls[0] を OpenStax を主語に（Precalculus・A&T は compare the coefficients）、en.alt の形、ja.alt の係数比較法（0 件）を外した |
| 2 | symbols/normal-distribution-n | r4 | 合格 |  |  |
| 3 | terms/region | r1 | 合格 |  |  |
| 4 | phrases/class-asking-does-it-still-work-if | r5 | 合格 |  | （第 1 回にも） |
| 5 | terms/summation-notation | r1 | 小さな直し | m2 | ja.alt の「シグマ記法での和」（0 件）を外した |
| 6 | symbols/repeating-decimal-bar | r4 | 合格 |  |  |
| 7 | terms/centroid | r1 | 合格 |  |  |
| 8 | terms/derivative-of-the-exponential-function | r1 | 合格 |  |  |
| 9 | terms/center | r1 | 合格 |  |  |
| 10 | terms/composite-number | r1 | 小さな直し | m1・m6 | level.jp 数A の根拠（素数の対概念）を解説の出典の note に |
| 11 | symbols/radian-unit | r4 | 合格 |  |  |
| 12 | terms/proof | r1 | 合格 |  |  |
| 13 | symbols/because-sign | r4 | 合格 |  |  |
| 14 | phrases/written-solution-taking-the-limit | r5 | 合格 |  |  |
| 15 | terms/cylinder | r1 | 合格 |  | （第 1 回にも） |
| 16 | terms/undo-the-log | r1 | 合格 |  |  |
| 17 | terms/face | r1 | 合格 |  |  |
| 18 | conventions/calculator-instead-of-tables | r4 | 合格 |  | （第 1 回にも） |
| 19 | terms/multiplication | r1 | 合格 |  | （第 1 回にも） |
| 20 | terms/integration-by-substitution | r1 | 小さな直し | m2・m3 | ja.alt の「u 置換」「置換法則」（0 件）を外し、「教科書によっては the substitution rule」を OpenStax Calculus Volume 1 5.5 を主語に |
| 21 | terms/arccosine | r1 | 合格 |  | （第 1 回にも） |
| 22 | terms/center-of-dilation | r1 | 小さな直し | m3・m5 | mapping_note の「正の scale factor だけ」を資料どおりに（IM Geometry の発展問題は負の scale factor も）。en.alt に IM Grade 8 の glossary の center of a dilation |
| 23 | terms/euclidean-algorithm | r1 | 合格 |  |  |
| 24 | terms/permutation-with-repetition | r1 | 合格 |  |  |
| 25 | terms/x-coordinate | r1 | 合格 |  | （第 1 回にも） |
| 26 | symbols/angle-abc | r4 | 合格 |  |  |
| 27 | symbols/difference-quotient-limit | r4 | 合格 |  |  |
| 28 | terms/collinear | r1 | 小さな直し | m1・m2 | level.jp に 中1（中学校解説）・数II（センター試験 H27 数II）、ja.alt の「共線の点」（0 件）を外した |
| 29 | terms/angle-sum-of-a-triangle | r1 | 小さな直し | m3・m5 | en.alt の angle sum of a triangle（0 件）を参照の量の言い方に替え、pitfalls[0]・mapping_note を CK-12 Geometry・IM Geometry 1.21 を主語に。③ の見出しは変わらない |
| 30 | terms/area-problem | r2 | 合格 |  |  |
| 31 | phrases/explaining-solution-plugging-back-in | r5 | 合格 |  | （第 1 回にも） |
| 32 | terms/triangle-proportionality-theorem | r2 | 小さな直し | m3 | pitfalls[3] の「見出しは本プロジェクトの言い方」を直した（日本語版 Wikipedia「六円定理」が使う） |
| 33 | phrases/exam-notes-allowed | r5 | 合格 |  | （第 1 回にも） |
| 34 | terms/same-side-interior-angles | r2 | 小さな直し | m6 | mapping_note に日本側（解説は同位角・錯角だけ）を足した |
| 35 | phrases/class-listening-this-will-be-on-the-test | r5 | 合格 |  | （第 1 回にも） |
| 36 | phrases/exam-ask-typo | r5 | 合格 |  | （第 1 回にも） |
| 37 | symbols/summation-sigma | r4 | 合格 |  |  |
| 38 | terms/binomial-coefficient | r2 | 合格 |  |  |
| 39 | terms/data | r2 | 合格 |  | （第 1 回にも） |
| 40 | terms/arctangent | r2 | 小さな直し | m3 | pitfalls[0] の「OpenStax Calculus は答えを arctan x と書く」を本文どおり tan⁻¹ x + C に |
| 41 | terms/rewrite-in-exponential-form | r2 | 合格 |  |  |
| 42 | phrases/class-listening-sanity-check | r5 | 合格 |  | （第 1 回にも） |
| 43 | terms/factor-theorem | r2 | 合格 |  |  |
| 44 | terms/cross-method | r2 | 合格 |  |  |
| 45 | phrases/office-hours-english-terms-are-new | r5 | 合格 |  |  |
| 46 | terms/symmetric-expression | r2 | 合格 |  |  |
| 47 | terms/decimal | r2 | 合格 |  |  |
| 48 | terms/monomial | r2 | 合格 |  |  |
| 49 | terms/linear-equation | r2 | 合格 |  |  |
| 50 | phrases/check-the-sign | r5 | 合格 |  |  |
| 51 | terms/linear-programming | r2 | 合格 |  |  |
| 52 | terms/distribute | r2 | 小さな直し | m1・m2 | ja.alt の「分配して展開する」（0 件）を外し、level.jp に 中1 を足した |
| 53 | symbols/complex-conjugate-bar | r5 | 小さな直し | m8 | 2 つ目の読み the complex conjugate of z を standard に（1 つ目の z bar が mit-18.06 に頼り、抜くと首位が替わる: 規則 9 の ②） |
| 54 | terms/perimeter | r2 | 小さな直し | m2 | ja.alt の「周囲の長さ」（数学の資料に 0 件）を外した |
| 55 | symbols/integers-symbol | r5 | 合格 |  |  |
| 56 | phrases/discord-notes-from-today | r5 | 合格 |  | （第 1 回にも） |
| 57 | terms/motion-problem | r2 | 大きな直し | M5 | en.term を uniform motion（等速運動の名前）から OpenStax の本文の言い方 uniform motion problem に。variants の公式の名前・別の型の motion problem を外し pitfalls に。level.jp 中1 |
| 58 | terms/choose | r2 | 合格 |  |  |
| 59 | terms/write-an-equation | r2 | 大きな直し | M1 | mapping exact → near（「式で表す」は等式も等号のない式も指し、英語は write an equation ／ write an expression）。ja.alt を解説の「文字を用いて表す」に |
| 60 | terms/ascending-order | r2 | 小さな直し | m6 | ja.alt 昇冪の順の根拠（日本語版 Wikipedia「単項式順序」）を出典に |
| 61 | terms/phase-shift | r3 | 合格 |  |  |
| 62 | terms/orthographic-projection | r3 | 小さな直し | m1・m3・m7 | 解説の 28 文字の書き写しを言い換え、IM Grade 6 → Grade 7、記事の段 5 段、level.us の Geometry（根拠なし）を外した |
| 63 | terms/rotate | r3 | 小さな直し | m5 | en.alt の rotate … about the origin（見出しの語を含む言い回し）を外した |
| 64 | terms/plane | r3 | 合格 |  |  |
| 65 | terms/distance-from-a-point-to-a-line | r3 | 合格 |  |  |
| 66 | terms/inverse-trigonometric-function | r3 | 合格 |  |  |
| 67 | symbols/hyperbolic-functions-notation | r5 | 小さな直し | m6 | OpenStax Calculus Volume 2 の出典に 6.9（level.us Calculus II の根拠） |
| 68 | terms/right-hand-limit | r3 | 合格 |  |  |
| 69 | terms/limit-of-a-riemann-sum | r3 | 小さな直し | m6 | pitfalls[1] が名指しする OpenStax 5.2 を出典の note に（第 1 回にも） |
| 70 | terms/derivatives-of-inverse-trig-functions | r3 | 小さな直し | m6 | related に inverse-trigonometric-function を |
| 71 | terms/element | r3 | 小さな直し | m1・m7 | pitfalls[2] の判定の説明を外し、level.us に Calculus I（OpenStax Calculus 1.1）を足した |
| 72 | phrases/explaining-solution-derivative-equal-to-zero | r5 | 合格 |  | （第 1 回にも） |
| 73 | terms/be-inscribed-in | r3 | 大きな直し | M1 | mapping exact → near（「内接する」は 2 円にも使い、英語の inscribed in は多角形と円・楕円。2 円は internally tangent）。日本語版 Wikipedia「円 (数学)」・共通テストを出典に |
| 74 | conventions/inequality-graph-boundary | r4 | 合格 |  | （第 1 回にも） |
| 75 | terms/identity | r3 | 合格 |  |  |
| 76 | terms/hold | r3 | 合格 |  |  |
| 77 | terms/line-perpendicular-to-a-plane | r3 | 合格 |  |  |
| 78 | terms/subtract | r3 | 合格 |  |  |
| 79 | terms/acute-angle | r3 | 小さな直し | m1 | level.jp に 数I（鋭角の三角比）、level.us に Pre-Algebra（IM Grade 6〜8） |
| 80 | phrases/written-solution-hypotheses-are-met | r5 | 合格 |  |  |
| 81 | conventions/similarity-symbol | r4 | 合格 |  | （第 1 回にも） |
| 82 | terms/radian | r3 | 合格 |  | （第 1 回にも） |
| 83 | terms/standard-normal-table | r3 | 合格 |  |  |
| 84 | terms/left-hand-limit | r3 | 合格 |  |  |
| 85 | phrases/email-subject-line | r5 | 合格 |  | （第 1 回にも） |
| 86 | terms/diophantine-equation | r3 | 合格 |  |  |
| 87 | phrases/the-one-sided-limits-agree | r5 | 合格 |  |  |
| 88 | terms/dividend | r4 | 小さな直し | m1 | level.jp に 小学校（解説の総説の表）、level.us に Pre-Algebra（OpenStax Prealgebra） |
| 89 | terms/sum-of-an-arithmetic-sequence | r4 | 小さな直し | m7 | latex の読みに the quantity・all over を入れて括弧と分数を読み分けた（第 1 回にも） |
| 90 | terms/implicit-function | r4 | 小さな直し | m1・m3・m5 | en.alt の implicit curve（別の概念）を外し、pitfalls[0] の CED の主張を本文どおりに。level.jp 数III は残し、解説に語が無いことを出典の note に |
| 91 | terms/necessary-and-sufficient-condition | r4 | 合格 |  |  |
| 92 | symbols/therefore-sign | r5 | 小さな直し | m2・m6 | spoken_ja「ゆえに」の出典に日本語版 Wikipedia「∴」。level.jp は慣習差の jp（ユーザーの決定）に合わせて残す |
| 93 | terms/logarithmic-function | r4 | 合格 |  |  |
| 94 | symbols/inverse-cosine-notation | r5 | 小さな直し | m6 | 重複した OpenStax Precalculus の出典を 1 つにして節番号 6.3、Calculus Volume 1 に 3.7 |
| 95 | terms/optimization-problem | r4 | 小さな直し | m1 | level.jp の 数B（根拠なし）を外した |
| 96 | symbols/cube-root | r5 | 小さな直し | m1・m2 | name_ja に 立方根（日本語版 Wikipedia の記事名）、level.us に Algebra 1（OpenStax Elementary Algebra 9.7） |
| 97 | terms/differentiate-twice | r4 | 合格 |  |  |
| 98 | terms/random-number | r4 | 合格 |  |  |
| 99 | terms/area-under-the-curve | r4 | 小さな直し | m3 | pitfalls[0] の資料の名前の無い「符号付きの意味で使われることがある」を OpenStax Calculus 5.2・6.7 を主語に |
| 100 | terms/combine-like-terms | r4 | 小さな直し | m2 | ja.alt の「同類項をまとめる計算」「まとめる」「式の加減」（0 件）を外した |

## 付録 B. 判定の記録（`python3 scripts/audit/report_table.py 0 --note "公開前の抜き取り（Fable、第 2 回）" --date 2026-10-09` の出力。監査 5 の決定 4）

### 順番の外の判定（batch 0、note に「公開前の抜き取り（Fable、第 2 回）」）（40 行: 合格 2・小さな直し 35・大きな直し 3・不合格 0。verified 37）

| id | 判定 | 直した内容 |
|---|---|---|
| terms/area-under-the-curve | 小さな直し | pitfalls[0] の資料の名前の無い使い方の主張を OpenStax Calculus を主語に（見直し役 r4（公開前の抜き取り（Fable、第 2 回））） ／ 出典の note に節を（pitfalls[0]。見直し役 r4（公開前の抜き取り（Fable、第 2 回））） |
| terms/optimization-problem | 小さな直し | level.jp から 数B を外した（解説 数学B の「数学と社会生活」に最大・最小・最適の問題は無く、日本語版 Wikipedia「数学 (教科)」の数学B の一覧にも無い。台帳の単元の既定が残ったもの。見直し役 r4（公開前の抜き取り（Fable、第 2 回））・親（公開前の抜き取り（Fable、第 2 回））） |
| terms/implicit-function | 小さな直し | en.alt から implicit curve を外した（F(x, y) = 0 の表す曲線の名前で、陰関数（y を x の関数として定めるもの）とは別の概念。英語版 Wikipedia も別の記事。見直し役 r4（公開前の抜き取り（Fable、第 2 回））・親（公開前の抜き取り（Fable、第 2 回））） ／ pitfalls[0] の「CED は implicit function ではなく」を本文どおりに（Unit 3 の概要は implicit functions とも書く。見直し役 r4（公開前の抜き取り（Fable、第 2 回））） ／ 高等学校学習指導要領解説を出典に（「陰関数」は出てこない。level.jp 数III の扱いは DECISIONS。見直し役 r4（公開前の抜き取り（Fable、第 2 回））の要確認を親が決めた） |
| terms/derivative-of-a-parametric-curve | 合格 | — |
| terms/derivatives-of-inverse-trig-functions | 小さな直し | related に inverse-trigonometric-function を（相手は挙げている。見直し役 r3（公開前の抜き取り（Fable、第 2 回））） |
| terms/arctangent | 小さな直し | pitfalls[0] の「OpenStax Calculus は答えを arctan x と書く」を本文どおりに（+ C の前は tan⁻¹ が大半で arctan は少数。見直し役 r2（公開前の抜き取り（Fable、第 2 回））） |
| terms/integration-by-substitution | 小さな直し | ja.alt から「u 置換」「置換法則」を外した（解説・共通テスト・日本語版 Wikipedia に 0 件。監査 7 の前の決定 4。見直し役 r1（公開前の抜き取り（Fable、第 2 回））・親（公開前の抜き取り（Fable、第 2 回））） ／ mapping_note の資料の名前の無い「教科書によっては」を OpenStax Calculus Volume 1 5.5 を主語に、外した ja.alt の文を消した（見直し役 r1（公開前の抜き取り（Fable、第 2 回））・親（公開前の抜き取り（Fable、第 2 回））） |
| terms/limit-of-a-riemann-sum | 小さな直し | 出典の note に pitfalls[1] が名指しする 5.2 を（見直し役 r3（公開前の抜き取り（Fable、第 2 回））） |
| terms/left-riemann-sum | 小さな直し | latex を L_n = Σ_(i=1)^n f(x_(i−1)) Δx_i に（定義の「小区間の幅はそろっていなくてもよい」と式をそろえ、right-riemann-sum と同じ形に。CED topic 6.3 の Δx_i。見直し役 r0（公開前の抜き取り（Fable、第 2 回）の 0′（前回の audit-major-fix の見直し））） ／ 読みを latex に合わせた（見直し役 r0（公開前の抜き取り（Fable、第 2 回）の 0′（前回の audit-major-fix の見直し））） ／ CED の出典の note に topic 6.3（Δx_i の書き方）を（見直し役 r0（公開前の抜き取り（Fable、第 2 回）の 0′（前回の audit-major-fix の見直し））） |
| terms/right-riemann-sum | 小さな直し | latex の Δx を Δx_i に（定義の「小区間の幅はそろっていなくてもよい」と式をそろえた。CED topic 6.3 は Σ f(x_i*)Δx_i と書き、Δx_i を i 番目の小区間の幅とする。見直し役 r0（公開前の抜き取り（Fable、第 2 回）の 0′（前回の audit-major-fix の見直し））） ／ 読みを latex に合わせた（見直し役 r0（公開前の抜き取り（Fable、第 2 回）の 0′（前回の audit-major-fix の見直し））） ／ CED の出典の note に topic 6.3（Δx_i の書き方）を（見直し役 r0（公開前の抜き取り（Fable、第 2 回）の 0′（前回の audit-major-fix の見直し））） |
| terms/disk-method | 合格 | — |
| terms/summation-notation | 小さな直し | ja.alt から「シグマ記法での和」を外した（解説・共通テスト・日本語版 Wikipedia に 0 件。監査 7 の前の決定 4。見直し役 r1（公開前の抜き取り（Fable、第 2 回））） |
| terms/compare-coefficients | 小さな直し | level.jp から 中3 を外した（中学校学習指導要領解説に係数を比較する手順は無く、恒等式の未定係数法は数学II。台帳の単元 中3 二次方程式の既定が残ったもの。単元ファイルの term_refs も外した。見直し役 r1（公開前の抜き取り（Fable、第 2 回））・親（公開前の抜き取り（Fable、第 2 回））） ／ en.alt の形を compare … coefficients に（OpenStax Precalculus 7.4・Algebra and Trigonometry 11.4 の compare the coefficients、IM Algebra 2 3.16 の Compare the coefficients of x を数える。③ の見出し equate coefficients は変わらない。見直し役 r1（公開前の抜き取り（Fable、第 2 回））） ／ ja.alt から「係数比較法」を外した（解説・共通テスト・日本語版 Wikipedia に 0 件。監査 7 の前の決定 4。見直し役 r1（公開前の抜き取り（Fable、第 2 回））） ／ pitfalls[0] の「英語では「比べる」（compare）より「等しいとおく」（equate）で言う」を参照を主語に（OpenStax Precalculus・Algebra and Trigonometry は compare the coefficients と書く。見直し役 r1（公開前の抜き取り（Fable、第 2 回））） ／ 出典の note に節を（見直し役 r1（公開前の抜き取り（Fable、第 2 回））） ／ OpenStax Precalculus を出典に（見直し役 r1（公開前の抜き取り（Fable、第 2 回））） ／ OpenStax Algebra and Trigonometry を出典に（見直し役 r1（公開前の抜き取り（Fable、第 2 回））） |
| terms/rotate | 小さな直し | en.alt から rotate … about the origin を外した（見出しの語を含む言い回しは alt に置かない。監査 5 の決定 3。collocations に残る。見直し役 r3（公開前の抜き取り（Fable、第 2 回））） |
| terms/perimeter | 小さな直し | ja.alt から「周囲の長さ」を外した（解説・共通テスト・手元の日本語版 Wikipedia に 0 件。日本語版 Wikipedia の検索の 31 件は島・池などの地理の記事。監査 7 の前の決定 4。見直し役 r2（公開前の抜き取り（Fable、第 2 回））） |
| terms/write-an-equation | 大きな直し | mapping を exact から near に: 日本語の「式で表す」は等式（方程式）も等号を含まない式も指すが、英語は write an equation ／ write an expression と言い分ける（エントリ自身の定義・pitfalls[0] が書く範囲の差。前回の抜き取りの M1 型。兄弟の expression・equation は near）（大。見直し役 r2（公開前の抜き取り（Fable、第 2 回））） ／ mapping near の理由を mapping_note に（見直し役 r2（公開前の抜き取り（Fable、第 2 回））） ／ ja.alt の「文字を使って表す」（資料に 0 件）を中学校学習指導要領解説の言い方「文字を用いて表す」に（見直し役 r2（公開前の抜き取り（Fable、第 2 回））） ／ 中学校学習指導要領解説を出典に（見直し役 r2（公開前の抜き取り（Fable、第 2 回）））<br>（公開前の抜き取り（Fable、第 2 回）: mapping exact → near（日本語の「式で表す」は等式（方程式）も等号を含まない式も指し、英語は write an equation ／ write an expression と言い分ける。エントリ自身の定義・pitfalls[0] が書く範囲の差。前回の M1 型。兄弟の expression・equation と同じ）。mapping_note を書き、ja.alt の「文字を使って表す」（0 件）を中学校解説の「文字を用いて表す」に。見直す点: mapping・mapping_note・ja.alt） |
| terms/orthographic-projection | 小さな直し | mapping_note の中学校解説の 28 文字の書き写しを言い換え、IM Grade 6 を Grade 7 に（front view は Grade 7 1.7・1.12、top view は 7.16）、「数学カテゴリの外」を 5 段に（見直し役 r3（公開前の抜き取り（Fable、第 2 回））） ／ IM の出典を Grade 6 から Grade 7 に（見直し役 r3（公開前の抜き取り（Fable、第 2 回））） ／ level.us から Geometry を外した（CK-12 Geometry・IM Geometry に front view・top view・orthographic は 0 件。CK-12 9.3 の断面・展開図は別の概念。見直し役 r3（公開前の抜き取り（Fable、第 2 回））） ／ 英語版 Wikipedia を出典に（mapping_note が記事名を名指しする。見直し役 r3（公開前の抜き取り（Fable、第 2 回））） |
| terms/expression | 小さな直し | mapping_note の日本側の根拠に中学校学習指導要領解説（数量の関係を表す式を等式または不等式に表す）を足した（不等式の側は日本語版 Wikipedia「等式」では確かめられなかった。見直し役 r0（公開前の抜き取り（Fable、第 2 回）の 0′（前回の audit-major-fix の見直し））） ／ 中学校学習指導要領解説を出典に（mapping_note。見直し役 r0（公開前の抜き取り（Fable、第 2 回）の 0′（前回の audit-major-fix の見直し））） |
| terms/combine-like-terms | 小さな直し | ja.alt の「同類項をまとめる計算」「まとめる」「式の加減」（解説・共通テスト・日本語版 Wikipedia に 0 件。まとめる は一般の動詞）を外した（監査 7 の前の決定 4。見直し役 r4（公開前の抜き取り（Fable、第 2 回））） |
| terms/same-side-interior-angles | 小さな直し | mapping_note に日本側（解説は同位角・錯角だけ）を足した（見直し役 r2（公開前の抜き取り（Fable、第 2 回））） ／ 中学校学習指導要領解説を出典に（mapping_note。見直し役 r2（公開前の抜き取り（Fable、第 2 回））） |
| terms/angle-sum-of-a-triangle | 小さな直し | en.alt から angle sum of a triangle（用例コーパス・参照に 0 件）を外し、量として参照が使う sum of the … angles of a triangle（OpenStax Prealgebra 9.3 の the sum of the measures of the angles of a triangle）を足した。③ の見出し（CK-12 の triangle sum theorem）は変わらない（見直し役 r1（公開前の抜き取り（Fable、第 2 回））） ／ pitfalls[0] の資料に 0 件の言い方 angle sum of a triangle を、参照の言い方（OpenStax Prealgebra 9.3、IM Grade 8 1.16）に（見直し役 r1（公開前の抜き取り（Fable、第 2 回））） ／ mapping_note の「米国の Geometry は」を CK-12 Geometry と IM Geometry を主語に（見直し役 r1（公開前の抜き取り（Fable、第 2 回））・親（公開前の抜き取り（Fable、第 2 回））） ／ IM Geometry を出典に（見直し役 r1（公開前の抜き取り（Fable、第 2 回））・親（公開前の抜き取り（Fable、第 2 回））） ／ OpenStax Prealgebra を出典に（見直し役 r1（公開前の抜き取り（Fable、第 2 回））） ／ IM Grade 8 を出典に（見直し役 r1（公開前の抜き取り（Fable、第 2 回））） ／ pitfalls[0] の IM Grade 8 の引用（11 語）を短くした（書き写しの検出。親（公開前の抜き取り（Fable、第 2 回）の締め）） |
| terms/acute-angle | 小さな直し | level.jp に 数I を足した（解説 数学I 図形と計量の鋭角の三角比。見直し役 r3（公開前の抜き取り（Fable、第 2 回））） ／ level.us に Pre-Algebra を足した（IM Grade 6 1.9・Grade 7 1.4・Grade 8 1.1 が acute angle を使う。見直し役 r3（公開前の抜き取り（Fable、第 2 回））） ／ 高等学校学習指導要領解説を出典に（level.jp。見直し役 r3（公開前の抜き取り（Fable、第 2 回））） ／ IM 6–8 を出典に（level.us。見直し役 r3（公開前の抜き取り（Fable、第 2 回））） |
| terms/motion-problem | 大きな直し | en.term を uniform motion から uniform motion problem に。uniform motion は等速運動の名前で、問題の型「速さの問題」の言い方ではなく、書き言葉の件数はすべて uniform motion applications ／ problems の内側だった。問題の型の言い方は OpenStax Elementary Algebra（3.5・8.8）・Intermediate Algebra（2.4）の本文の uniform motion problems（書 ①、OpenStax だけ）。節の名前の uniform motion applications は候補にしない（STYLE: 教科書の節の名前は見出しに立てない。DECISIONS）（大。見直し役 r2（公開前の抜き取り（Fable、第 2 回））） ／ variants を外した: distance, rate, and time は公式の名前（the distance, rate, and time formula）で collocation に、motion problem は書き言葉の件数の大半が uniform motion problem の内側で、残りと CED の motion problems は別の型の問題（見直し役 r2（公開前の抜き取り（Fable、第 2 回））） ／ collocation に the distance, rate, and time formula（OpenStax Prealgebra・Elementary Algebra）を（見直し役 r2（公開前の抜き取り（Fable、第 2 回））） ／ mapping_note を OpenStax の節の名前と本文の言い方に（見直し役 r2（公開前の抜き取り（Fable、第 2 回））） ／ pitfalls に、CED・OpenStax Algebra and Trigonometry の motion problems が別の型の問題であることを（見直し役 r2（公開前の抜き取り（Fable、第 2 回））） ／ level.jp に 中1 を足した（中学校学習指導要領解説 第 1 学年の (道のり) = (速さ) × (時間) の言葉の式）。中2 は連立方程式の利用の内容として残す（見直し役 r2（公開前の抜き取り（Fable、第 2 回））の要確認を親が決めた） ／ 出典の note に節と本文の言い方を（見直し役 r2（公開前の抜き取り（Fable、第 2 回））） ／ OpenStax Intermediate Algebra を出典に（見直し役 r2（公開前の抜き取り（Fable、第 2 回））） ／ CED を出典に（pitfalls[3]。見直し役 r2（公開前の抜き取り（Fable、第 2 回））） ／ OpenStax Algebra and Trigonometry を出典に（pitfalls[3]。見直し役 r2（公開前の抜き取り（Fable、第 2 回））） ／ 中学校学習指導要領解説を出典に（level.jp。見直し役 r2（公開前の抜き取り（Fable、第 2 回））） ／ collocation の the distance, rate, and time formula を外した（見出しの語を含まない collocation は候補として数えられ、uniform motion problem と併記になる。公式の名前は pitfalls[1] に。親（公開前の抜き取り（Fable、第 2 回））） ／ pitfalls[1] に公式の名前 the distance, rate, and time formula を（親（公開前の抜き取り（Fable、第 2 回）））<br>（公開前の抜き取り（Fable、第 2 回）: en.term を uniform motion（等速運動の名前。書き言葉の件数はすべて uniform motion applications ／ problems の内側）から OpenStax Elementary Algebra 3.5・8.8・Intermediate Algebra 2.4 の本文の言い方 uniform motion problem（書 ①、OpenStax だけ）に。節の名前の uniform motion applications は候補にしない（STYLE: 節の名前は見出しにしない）。variants の distance, rate, and time（公式の名前）と motion problem（大半が uniform motion problem の内側。CED の motion problems は別の型）を外し、公式の名前と別の型の motion problems を pitfalls に。level.jp に 中1。見直す点: en.term・en.register、外した variants、mapping_note、pitfalls[1]・[3]、level.jp） |
| terms/collinear | 小さな直し | level.jp に 中1（中学校学習指導要領解説: 平面は同一直線上にない 3 点で決まる）と 数II（センター試験 平成27年度 数学II: 3 点 O, P, Q が一直線上にある）を足した。数A はメネラウスの定理・チェバの定理の内容として残す（見直し役 r1（公開前の抜き取り（Fable、第 2 回））の要確認を親が決めた） ／ ja.alt から「共線の点」を外した（資料に 0 件。共線は日本語版 Wikipedia に 18 件。見直し役 r1（公開前の抜き取り（Fable、第 2 回））） ／ 中学校学習指導要領解説を出典に（level.jp。見直し役 r1（公開前の抜き取り（Fable、第 2 回））） ／ センター試験を出典に（level.jp。見直し役 r1（公開前の抜き取り（Fable、第 2 回））） |
| terms/distribute | 小さな直し | ja.alt から「分配して展開する」を外した（資料に 0 件。監査 7 の前の決定 4。見直し役 r2（公開前の抜き取り（Fable、第 2 回））） ／ level.jp に 中1 を足した（中学校学習指導要領解説は 2(3x + 4) − 3(x − 5) のような 1 次式の加法と減法を第 1 学年に置く。見直し役 r2（公開前の抜き取り（Fable、第 2 回））） ／ 中学校学習指導要領解説を出典に（level.jp。見直し役 r2（公開前の抜き取り（Fable、第 2 回））） |
| terms/dividend | 小さな直し | level.jp に 小学校 を足した（解説の「被除数」は総説の小学校の内容の表（第 4 学年: 被除数・除数・商・余りの関係）にだけある。中2 は単項式の乗除の内容として残す。見直し役 r4（公開前の抜き取り（Fable、第 2 回））） ／ level.us に Pre-Algebra を足した（出典の OpenStax Prealgebra が dividend を使う。見直し役 r4（公開前の抜き取り（Fable、第 2 回））） ／ 高等学校学習指導要領解説を出典に（level.jp。見直し役 r4（公開前の抜き取り（Fable、第 2 回））） |
| terms/triangle-proportionality-theorem | 小さな直し | pitfalls[3] の「見出しは本プロジェクトの言い方」を直した（日本語版 Wikipedia「六円定理」が「三角形と比の定理より」と使う。見直し役 r2（公開前の抜き取り（Fable、第 2 回））） ／ 日本語版 Wikipedia「六円定理」を出典に（見直し役 r2（公開前の抜き取り（Fable、第 2 回））） |
| terms/center-of-dilation | 小さな直し | mapping_note の「正の scale factor の dilation だけを扱う」を資料どおりに（IM Geometry の発展問題は scale factor −1・−2 の dilation も出す。見直し役 r1（公開前の抜き取り（Fable、第 2 回））） ／ en.alt に IM Grade 8 の glossary の見出し center of a dilation を（話 ① center of dilation は変わらない。見直し役 r1（公開前の抜き取り（Fable、第 2 回））） ／ IM の出典の note に glossary の見出しと発展問題を（見直し役 r1（公開前の抜き取り（Fable、第 2 回））） |
| terms/ascending-order | 小さな直し | 日本語版 Wikipedia「単項式順序」を出典に（ja.alt 昇冪の順の根拠。見直し役 r2（公開前の抜き取り（Fable、第 2 回））） |
| terms/element | 小さな直し | pitfalls[2] の「見出しの register は書き言葉」（判定の説明。監査 6 の決定 8）を外した（見直し役 r3（公開前の抜き取り（Fable、第 2 回））・親（公開前の抜き取り（Fable、第 2 回））） ／ level.us に Calculus I を足した（OpenStax Calculus Volume 1 1.1 Review of Functions が x is an element of A と同じ概念を使う。見直し役 r3（公開前の抜き取り（Fable、第 2 回））） ／ 出典の note に節を（見直し役 r3（公開前の抜き取り（Fable、第 2 回））） |
| terms/trigonometric-ratio | 小さな直し | OpenStax Precalculus を出典に（mapping_note が名指しする。公開前の抜き取りの締めの source-mentions） ／ OpenStax Algebra and Trigonometry を出典に（mapping_note が名指しする。公開前の抜き取りの締めの source-mentions） ／ 定義の英文が OpenStax Precalculus と 8 語一致していたので言い換えた（意味は同じ。公開前の抜き取りの締めの書き写しの検出） ／ 定義の英文が IM と 9 語一致していたので、もう一度言い換えた（意味は同じ。公開前の抜き取りの締めの書き写しの検出） ／ 定義の英文が OpenStax の 3 冊と 8 語一致していたので、もう一度言い換えた（意味は同じ。公開前の抜き取りの締めの書き写しの検出） ／ 定義の英文が IM と 9 語一致していたので、もう一度言い換えた（意味は同じ。公開前の抜き取りの締めの書き写しの検出） ／ mapping_note に、参照が一般の角の値にも trigonometric ratios を使う箇所（IM Algebra 2 6.6、OpenStax Calculus Volume 2 3.3・Volume 3 2.1）を足した（見直し役 r0（公開前の抜き取り（Fable、第 2 回）の 0′（前回の audit-major-fix の見直し））） ／ 出典の note に節を（見直し役 r0（公開前の抜き取り（Fable、第 2 回）の 0′（前回の audit-major-fix の見直し））） ／ 出典の note に節を（見直し役 r0（公開前の抜き取り（Fable、第 2 回）の 0′（前回の audit-major-fix の見直し））） ／ IM Algebra 2 を出典に（mapping_note。見直し役 r0（公開前の抜き取り（Fable、第 2 回）の 0′（前回の audit-major-fix の見直し））） |
| terms/composite-number | 小さな直し | 高等学校学習指導要領解説を出典に（level.jp 数A の根拠。「合成数」の語は出てこない。見直し役 r1（公開前の抜き取り（Fable、第 2 回））の要確認を親が決めた） |
| terms/be-inscribed-in | 大きな直し | mapping を exact から near に: 日本語の「内接する」は 2 円（一方が他方の内側にあって 1 点を共有）にも使うが、英語の inscribed in は多角形と円・楕円の関係に使い、2 円は internally tangent（エントリ自身の pitfalls[1] が書く範囲の差。前回の抜き取りの M1 型）（大。見直し役 r3（公開前の抜き取り（Fable、第 2 回））） ／ mapping near の理由を mapping_note に（見直し役 r3（公開前の抜き取り（Fable、第 2 回））） ／ pitfalls[1] に楕円を（OpenStax Calculus の rectangle inscribed in the ellipse。親（公開前の抜き取り（Fable、第 2 回））） ／ 日本語版 Wikipedia「円 (数学)」を出典に（mapping_note。見直し役 r3（公開前の抜き取り（Fable、第 2 回））） ／ 共通テストを出典に（mapping_note。見直し役 r3（公開前の抜き取り（Fable、第 2 回）））<br>（公開前の抜き取り（Fable、第 2 回）: mapping exact → near（日本語の「内接する」は 2 円の一方が他方の内側で 1 点を共有する場合にも使う: 日本語版 Wikipedia「円 (数学)」・共通テスト 令和3年度 第1日程 数学I・A 第5問。英語の inscribed in は多角形と円・楕円の関係で、2 円は internally tangent。エントリ自身の pitfalls[1] が書く範囲の差。前回の M1 型）。mapping_note を書き、出典 2 件を足した。見直す点: mapping・mapping_note・pitfalls[1]） |
| terms/sum-of-an-arithmetic-sequence | 小さな直し | latex の読みに the quantity・all over を入れて括弧と分数の範囲を読み分けた（見直し役 r4（公開前の抜き取り（Fable、第 2 回））） |
| symbols/cube-root | 小さな直し | name_ja に 立方根（日本語版 Wikipedia の記事名。「三乗根ともいう」）を（見直し役 r5（公開前の抜き取り（Fable、第 2 回））） ／ level.us に Algebra 1 を足した（出典の OpenStax Elementary Algebra 2e 9.7 Higher Roots に cube root。見直し役 r5（公開前の抜き取り（Fable、第 2 回））） ／ 日本語版 Wikipedia「立方根」を出典に（見直し役 r5（公開前の抜き取り（Fable、第 2 回））） ／ 出典の note に節を（見直し役 r5（公開前の抜き取り（Fable、第 2 回））） ／ 出典の note に節を（見直し役 r5（公開前の抜き取り（Fable、第 2 回））） |
| symbols/hyperbolic-functions-notation | 小さな直し | 出典の note に節を（見直し役 r5（公開前の抜き取り（Fable、第 2 回））） |
| symbols/inverse-cosine-notation | 小さな直し | note の無い OpenStax Precalculus 2e の出典（重複）を外した（見直し役 r5（公開前の抜き取り（Fable、第 2 回））） ／ 出典の note に節番号 6.3 を（見直し役 r5（公開前の抜き取り（Fable、第 2 回））） ／ 出典の note に節を（見直し役 r5（公開前の抜き取り（Fable、第 2 回））） |
| symbols/tangent-of-theta | 小さな直し | spoken_en に 4 つ目の読み the tangent of theta（standard）を足した（sine-of-theta・cosine-of-theta と同じく冠詞つきの読みを別に数える。形 the tangent of * は lib.ts SYMBOL_PATTERNS。1 つ目は tangent theta のまま。見直し役 r0（公開前の抜き取り（Fable、第 2 回）の 0′（前回の audit-major-fix の見直し））） |
| symbols/therefore-sign | 小さな直し | 日本語版 Wikipedia「∴」を出典に（spoken_ja の根拠。because-sign と同じ形。見直し役 r5（公開前の抜き取り（Fable、第 2 回））） |
| symbols/complex-conjugate-bar | 小さな直し | 2 つ目の読み the complex conjugate of z の register を spoken から standard に: 1 つ目 z bar 17 件は mit-18.06 13 件に頼り、抜くと 4 対 8 で首位が替わる（CLAUDE.md 規則 9 の 1 ソース頼み → ② 併記）。1 つ目は z bar のまま。DECISIONS（見直し役 r5（公開前の抜き取り（Fable、第 2 回））） |
