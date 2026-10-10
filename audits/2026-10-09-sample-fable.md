# Phase 5 公開前の抜き取り（Fable）

作成: 2026-10-09 ／ 範囲: 2510669（監査 15 のレポート）→ 本コミット
指示: 公開前の抜き取り（DECISIONS「監査のモデル」の決定: 公開の直前に一度、Claude Fable 5.1 で verified の全体から 100 項目を抜き取って見直し、見落としの率を出す）。最初の指示文の 0〜6 と、監査 3 の抜き取り（DECISIONS 2026-09-26 の抜き取りの行）のやり方で。0 は監査 15 の J-2 の audit-major-fix 1 項目、1〜5 は抜き取り・見直し・判定・見落としの率・公開の判断。

**これは生成したセッションとも、監査 15 で大きな直しをしたセッションとも別のセッションです**（CLAUDE.md 絶対ルール 8）。大きな直しをした項目は、このセッションでは verified にしていない。

**モデルについて（大事）**: 指示文はこのセッションを Opus 5.5 と別のモデルとしていたが、**このセッション（親）は Claude Opus 5.5 で動いていた**。DECISIONS「監査のモデル」の「Claude Fable 5.1 で見直す」は、**読み取り専用の見直し役 5 人（と 0 の 1 人）を Fable 5.1 にして**当てた。親は Opus 5.5 のまま 100 項目を全部読み、見直し役の指摘を資料で確かめて直した（監査 3 の抜き取りの前半と同じ形。DECISIONS に記録）。別のモデルで読む部分は見直し役が担っている。モデルを替えて同じ指示文でやり直すかはユーザーが決める（H-a の 1）。

## まとめ

- **0（監査 15 の J-2）**: conventions/us-only-precalculus-topics は、監査 15 の大きな直しが資料どおり（解説の数学II・数学III・数学C・理数数学I、日本語版 Wikipedia「数学 (教科)」、OpenStax の節）。小さな直し（座標軸の回転、advice_ja を OpenStax を主語に、IM を出典に、引用を原文どおりに）で **verified**。conventions 72 / 72
- **1（抜き取り）**: 開始時の verified 1,616 項目から `random.Random(20261010).sample` で 100 項目（terms 70・phrases 14・symbols 13・conventions 3）。一覧は `audits/2026-10-09-sample-fable-list.md`
- **2〜3（見直しと判定）**: 見直し役 5 人（Fable 5.1）に 20 項目ずつ、親も 100 項目を読み、指摘はすべて親が資料で確かめてから直した。**合格 63・小さな直し 29・大きな直し 6・不合格 2**（範囲の外で left-riemann-sum も大きな直し）
- **4（見落としの率）**: 学生が読む中身が間違っていた項目（**大きな直し＋不合格**）は **100 項目中 8**（95% 信頼区間 4.1〜15.0%。verified 1,616 項目に当てると 130 前後）。小さな直しは 29。型ごとの数は 4. の表。8 のうち **文そのものが誤りを教えていたのは 4**（right-riemann-sum の定義、expression・trigonometric-ratio・disk-method の mapping）、残る 4 は規則の当て方の誤り（見出しの根拠・記号の読みの並び・フレーズの根拠）
- **5（公開の判断）**: 8 は閾値 3 を超える（文そのものの誤りの 4 で数えても超える）ので、**まだ公開しない**。見つかった型を全エントリで機械的に探す一覧 `scripts/audit/sample_types.py` → `audits/checks/sample-types.md` を作った。**次のセッションでこの一覧を読んで直してから公開する**（J）
- verified: terms 1,050 → **1,044**、symbols 220 → **219**、phrases 275 → **273**、conventions 71 → **72**。4 つのコレクションとも公開の閾値を超えたまま
- いま問題の flag: **audit-major-fix 7**（抜き取りの 6 と left-riemann-sum）、**audit-human 2**（抜き取りのフレーズ 2）、draft 1（quadratic-regression）
- 段ごとに直し・判定のコミットのあと push した。コミットはすべて `git add` → `git commit`（pre-commit フックが validate・tsc・test を回す。--no-verify は使っていない）

## 0. 監査 15 の audit-major-fix の見直し（e96104a 直し・ab93c99 判定。batch 0）

- 見直し役 1 人（Fable 5.1。`audits/work/major-sf-r0.md`）: 指摘 8 件（大 0・小 4・任意 2・範囲の外 2）。**監査 15 の直しは資料どおり**（組立除法は数学II の高次方程式にある、連続複利は数学III の e の例だけ、数学C は二次曲線の回転を扱わないと明記、無理方程式は理数数学I の例だけ、OpenStax の 6 節の題と番号が合う）。慣習差として同じ段で成り立つ（C4）
- 小さな直し: us の「二次曲線の軸の回転」→ 座標軸の回転（A&T 12.4 が回すのは座標軸）、us の 2 文目に節番号、advice_ja の「Algebra 2・Precalculus には…が入る」を OpenStax Algebra and Trigonometry を主語に（IM 9–12 には 3 つとも 0 件。IM Algebra 2 を出典に）、jp の理数数学I の引用（締めで書き写しを避けて言い換えた）、解説の出典の note の節名（平面上の曲線と複素数平面）。範囲の外の likely 2 語（radical-equation・continuous-compounding）は監査 15 の J-5 のとおりその語の監査で

## 1. 抜き取り

- 母集団: 本セッションの開始時（2510669）の verified 1,616 項目（terms 1,050・symbols 220・phrases 275・conventions 71）を (collection, id) の昇順に並べたリスト。0 で verified にした項目は 0 で見直したので入れていない（0 と 1 の見直し役を同時に動かすため、母集団をコミットで固めた。DECISIONS）
- `random.Random(20261010).sample(リスト, 100)`。同じ種と同じ母集団で同じ 100 項目になる
- 内訳 terms 70・phrases 14・symbols 13・conventions 3。見直し役の割り当て: r1〜r3 は terms を抜き取りの順に 20 ずつ、r4 は terms の残り 10・conventions 3・symbols 7、r5 は symbols 6・phrases 14（`audits/2026-10-09-sample-fable-list.md`）

## 2. やり方

- 見直し役（読み取り専用、Claude Fable 5.1、資料を引く道具つき）: `audits/reviewer-instructions.md` の観点すべて（terms の 13、symbols の S1〜S6、phrases の P1〜P5、conventions の C1〜C7）。同時に動かすのは 4 人まで（メモの教訓）。結果は `audits/work/sample-fable-r1〜r5.md`（gitignore）
- 親（Opus 5.5）: 100 項目を show_batch.py と資料で読み、見直し役の指摘を 1 件ずつ資料で確かめた（refgrep・ced.py・jawiki.py・enwiki.py・corpus:probe・symctx.ts、Math Stack Exchange の抜粋は内蔵ブラウザ、共通テストの図は PDF を画像にして見た）。親が自分で見つけたもの: limit-of-a-riemann-sum の pitfalls（OpenStax 5.2 の定義は等分のまま）、office-hours-do-you-have-a-minute の Math Stack Exchange の根拠（3 件のうち 1 件は別の意味）。見直し役の案を資料で退けたもの: trigonometric-ratio の不合格案（資料で決まるので大きな直し）、area-preserving-transformation の大の案（IM Grade 6 に平行四辺形の文があり、注記の事実の直しなので小）、subset-sign・equilateral-triangle・supplementary-angle・partitioning-into-groups・check-the-concavity の直し案（資料で誤りと言えない。DECISIONS と backlog）
- 判定は監査と同じ（合格・小さな直し・大きな直し・不合格）。小さな直しは verified のまま、大きな直しは likely ＋ flag audit-major-fix、不合格は likely ＋ flag audit-human（scripts/audit/edit.py）。判定の記録は batch 0 で、直した項目だけ（合格の 63 は行を足さず、付録 A に書く。監査 3 の抜き取りと同じ）

## 3. 結果

| コレクション | 項目 | 合格 | 小さな直し | 大きな直し | 不合格 |
|---|---|---|---|---|---|
| terms | 70 | 40 | 25 | 5 | 0 |
| symbols | 13 | 8 | 4 | 1 | 0 |
| phrases | 14 | 12 | 0 | 0 | 2 |
| conventions | 3 | 3 | 0 | 0 | 0 |
| **計** | **100** | **63** | **29** | **6** | **2** |

見直し役ごと（見直し役の案 → 親の判定）: r1 合格 10・小 7・大 2・不合格 1 → 合格 11・小 6・大 3 ／ r2 合格 9・小 10・大 1 → 合格 12・小 7・大 1 ／ r3 合格 12・小 7・大 1 → 合格 12・小 7・大 1 ／ r4 合格 12・小 7・大 1 → 合格 13・小 7・大 0 ／ r5 合格 17・小 2・大 1（要確認 1）→ 合格 15・小 2・大 1・不合格 2。

**大きな直し・不合格の 8 項目**:

| 項目 | 判定 | 何が違っていたか（資料） | 文そのものの誤りか |
|---|---|---|---|
| terms/right-riemann-sum | 大きな直し | 定義の日本語が「区間を等分した各小区間の右端…」。AP の CED topic 6.2 は uniform or nonuniform partitions の両方で近似し、定義の英文も等分を言わない（表で与えられた関数は幅がそろわない）。範囲の外の left-riemann-sum も同じ | はい（定義） |
| terms/expression | 大きな直し | mapping exact だが、エントリ自身が「日本語の「式」は等式や不等式にも使う」と範囲の差を書いていた。兄弟の equation・algebraic-expression は near。日本語版 Wikipedia「等式」を出典に near | はい（mapping） |
| terms/trigonometric-ratio | 大きな直し | mapping exact で、定義の英文が鈍角まで trigonometric ratio と書き、例文が「Find the values of the trigonometric ratios of 150°」。参照（IM 22 件・CK-12・OpenStax）の trigonometric ratio は直角三角形の鋭角だけで、鈍角は単位円の三角関数（OpenStax Precalculus 5.2・A&T 7.3） | はい（mapping・定義・例文） |
| terms/disk-method | 大きな直し | mapping none だが、日本語版 Wikipedia「回転体」は同じ方法を円板法（円板分割法）と呼び、数学III は回転体の体積を同じ積分で求める。shell-method（バウムクーヘン積分）は同じ理由で near | はい（mapping） |
| terms/derivative-of-a-parametric-curve | 大きな直し | ③ の見出し derivatives of parametric equations の根拠（CED の 2 件）は、どちらも topic 9.2 の題 Second Derivatives of Parametric Equations（二階微分）の一部。CED が一階の微分に使う言い方は 9.1・9.2 の learning objective の derivatives of parametric functions（TERM_FORMS の「!second」で除いて規則どおり） | いいえ（前の見出しも OpenStax Calculus Volume 2 7.2 の言い方） |
| symbols/tangent-of-theta | 大きな直し | 1 つ目の読み tangent of theta の形「!the tangent of *」が inverse tangent of x・arc tangent of x も数えていた（196）。除くと 168 で tangent theta（185）が 1 つ目 | いいえ（3 つとも standard の読み） |
| phrases/class-asking-another-example | 不合格 | likely の根拠の Math Stack Exchange の件数のうち、頼む文は 1 件だけ（do another example は質問者が自分で例を挙げる文、do one more は one more step ほか）。MICASE の学生の発話は 0 件 → 監査 13 の前の決定 1 で人間レビュー | いいえ（Could you do another example? は自然な文） |
| phrases/office-hours-do-you-have-a-minute | 不合格 | Math Stack Exchange の have a minute 3 件のうち、相手の時間を求める文は 2 件（1 件は you have a minute per question）。3 件に届かず MICASE も 0 件 → 人間レビュー | いいえ（Do you have a minute? は自然な文） |

## 4. 見落としの率

- **学生が読む中身が間違っていた項目（大きな直し＋不合格）: 100 項目中 8**（95% 信頼区間 4.1〜15.0%。verified 1,616 項目に当てると 130 前後）。うち **文そのものが学生に誤りを教えていたもの 4**（1.6〜9.8%、65 前後）、規則の当て方の誤りで学生が読む言い方そのものは使われている英語のもの 4
- **小さな直し: 29**（21.0〜38.5%）。うち、学生が読む事実・数学の記述が不正確だったもの 8（limit-of-a-riemann-sum の OpenStax の定義の説明、half-open-interval の notes、distance の例文「always positive」、right-angle の語源、commutative-property の「教科書（OpenStax）は」、area-preserving-transformation の mapping_note、derivative-of-an-inverse-function の参照の件数、trapezoid の参照先）。ほかは level・ja.alt・出典・register・言い方の補い
- 前の抜き取り（監査 3、監査 1 の verified 50 語を Fable で見直し）は 50 語のうち直し 19（大 1）。今回は 100 項目のうち直し 37（大・不合格 8）で、Opus の監査 2〜15 の後でも、別のモデルが見ると大きな直しの型が残っていた

**型ごとの数**（1 項目が 2 つの型に入ることがある。付録 A の「型」の欄）:

| 型 | 中身 | 項目 | 判定 |
|---|---|---|---|
| M1 | mapping がエントリ自身の本文・兄弟のエントリ・日本側の資料と食い違う | expression・trigonometric-ratio・disk-method | 大 3 |
| M2 | 定義の日本語が、英語の見出しの意味（参照の定義）より狭い | right-riemann-sum（範囲の外の left-riemann-sum も） | 大 1 |
| M3 | ③ で参照が決めた見出しの根拠が、参照の別の概念の題の一部 | derivative-of-a-parametric-curve | 大 1 |
| M4 | 記号の読みの形が別の読み（逆関数）も数え、1 つ目の読みが入れ替わる | tangent-of-theta | 大 1 |
| F1 | 学生の場面のフレーズの likely の根拠（Math Stack Exchange）が意図を運ばない | class-asking-another-example・office-hours-do-you-have-a-minute | 不合格 2 |
| m1 | level（jp・us）の根拠が資料に無い・足りない | central-angle・monotonic・arc-length・work・arccosine・minimum・like-terms・double-root・open-interval・area-preserving-transformation | 小 10 |
| m2 | ja.alt・spoken_ja の資料（資料に 0 件、同じ意味でない、読みの形） | coin・limit-of-a-riemann-sum・local-maximum・repeated-combination-h-jp・intersection-sign（ほかに大の derivative-of-a-parametric-curve） | 小 5 |
| m3 | 参照・資料の言い方と食い違う事実の記述 | commutative-property・trapezoid・right-angle・derivative-of-an-inverse-function・limit-of-a-riemann-sum・area-preserving-transformation・half-open-interval | 小 7 |
| m4 | 資料の名前の無い主張（日本の教科書は…） | differential-equation | 小 1 |
| m5 | evidence が別の意味を数える（register・alt） | opposite-angle・substitution-method | 小 2 |
| m6 | 参照の言い方・出典・米国の扱いの補い | monotonic・trapezoid・arccosine・exterior-angle-bisector・midpoint-riemann-sum・volume-by-cross-sections・r-squared | 小 7 |
| m7 | 数学・英文の精度 | distance・height | 小 2 |

前の抜き取りで見つかり機械の検査に入った型（名指しした資料が出典に無い・書き写し・資料の名前の無い日本側の主張・英語には〜がない）は、この 100 項目では m4 の 1 文だけだった。新しく見つかった型は M1〜M4・F1 と m1・m2（m2 は監査 7 の前の決定 4 より前に監査した項目に残る型）。

## 5. 公開の判断

- 大きな直し＋不合格は **8 で閾値 3 を超える**（文そのものの誤りの 4 で数えても超える）。指示 5 のとおり **まだ公開しない**
- 見つかった型を全エントリで機械的に探す一覧を作った（`python3 scripts/audit/sample_types.py` → `audits/checks/sample-types.md` と .json。`--help` があり、知らない引数は拒む）。**次のセッションがこの一覧を 1 行ずつ資料で読んで直し、それから公開する**

| 型 | 一覧の中身 | 行（うち verified） | 抜き取りの例 |
|---|---|---|---|
| T1a | mapping exact で、エントリ自身の文が日本語と英語の範囲の違いを書いている | 28（20） | expression・trigonometric-ratio（直した後は出ない） |
| T1b | mapping none の terms 37 語のうち、日本語の名前が日本側の資料にあるか mapping_note が名前を挙げる語 | 20（13） | disk-method（直した後は near なので出ない） |
| T2 | 定義の日本語に、定義の英文が言わない限定（等分・だけ・限る・鋭角・正の数 ほか） | 28（20） | right-riemann-sum・left-riemann-sum（直した後は出ない） |
| T3 | ③ の見出しの根拠が、決めた参照ですべて別の名前（題）の一部 | 0 | derivative-of-a-parametric-curve（直す前の状態で拾うことを確かめた） |
| T4 | 記号の読みの形「X of *」が inverse ／ arc ／ hyperbolic X of … も数える | 4（4。件数が小さく、並びの変わるものは無い） | tangent-of-theta（直した後は出ない） |
| T5 | likely の根拠が Math Stack Exchange だけのフレーズ（MICASE 3 件未満） | 46（45）。抜粋を読んだ記録が無い 38（38） | class-asking-another-example・office-hours-do-you-have-a-minute |
| T6 | 手元の日本側の資料に 0 件の ja.alt（小さな直しの型） | 196（97）、172 語（84） | local-maximum・derivative-of-a-parametric-curve・limit-of-a-riemann-sum・coin |

（どの行も手がかりで、誤りとは限らない。T1a・T2 は語の型で拾うので、言い方の注意だけの行や「二等分」以外の正しい限定も混じる。）

## A-2. 仕組みに足したもの・変えたもの

| もの | 場所 | 中身 |
|---|---|---|
| 抜き取りの一覧（新） | `audits/2026-10-09-sample-fable-list.md` | 100 項目・種・母集団・見直し役の割り当て |
| 型の一覧（新） | `scripts/audit/sample_types.py`、`audits/checks/sample-types.md`・`.json` | 5. の T1a〜T6。`--help`、知らない引数は拒む（メモの教訓）。1 分 40 秒ほど |
| TERM_FORMS | `scripts/corpus/lib.ts` | derivative-of-a-parametric-curve（「!second derivatives of parametric equations」）、opposite-angle（四角形・三角形の対角の言い方だけ） |
| SYMBOL_PATTERNS | `scripts/corpus/lib.ts` | sine-of-theta・cosine-of-theta・tangent-of-theta の 1 つ目の形に「!inverse !arc」 |
| MSE_SKIP | `scripts/corpus/mse.ts` | do another example・do one more example・do one more（質問者が自分で例・手順をする文） |
| 読んで正しいとした行 | `scripts/audit/kaisetsu_subjects_checked.json`・`kaisetsu_absent_checked.json`・`reference_quotes_checked.json` | このセッションの文と、verified になった us-only-precalculus-topics の行（15 行） |
| STYLE 追記欄 | `docs/STYLE.md` | 本文が範囲の差を書く語は mapping near、日本の名前が資料にある方法は none にしない |
| cspell | `cspell.json` | angulus（right-angle の語源）、nonregular（OpenStax の nonregular partition） |
| backlog | `audits/backlog.md` | 211〜223 行 |

## 機械の確かめ（本コミットで取り直した）

| 確かめ | 一覧 | 監査 15 の最後（2510669） | 本コミット |
|---|---|---|---|
| 書き写しの検出 | `copy-overlap.md` | 331 箇所・289 項目 | **332 箇所・290 項目**（このセッションの文が一致した 5 か所を言い換え、増えた 1 は IM のレッスン名 1.9 Formula for the Area of a Triangle の引用） |
| 日本側の主張（G-1 の正規表現） | `jp-claims.md` | 106 項目・109 文 | **106 項目・109 文** |
| 日本側の主張（広い正規表現） | 同上 | 486 項目・668 文 | **489 項目・672 文**（資料を主語にした文が増えた） |
| 米国側の主張で資料を名指しせず、出典に参照もない | `us-claims.md` の A | 4 項目・4 文 | **4 項目・4 文** |
| 同上で、出典に参照がある | `us-claims.md` の B | 22 項目・23 文 | **22 項目・23 文** |
| 確かめられない言い方（validate の警告） | `wording-warnings.md` | 13 文（verified 1） | **13 文（verified 1）** |
| 例文に見出しの語がない | `examples_headword.py` の出力 | 80 語 | **79 語**（volume-by-cross-sections に見出しの例文を足した。md は監査 10 のまま） |
| 名指しした資料が出典に無い | `source-mentions.md` | 132（verified 0） | **132（verified 0）** |
| 参照の引用 | `reference-quotes.md` | 見つからない 0 | **見つからない 0**（2,512 の言い方。checked B に 2） |
| 解説の科目 | `kaisetsu-subjects.md` | 読む行 0 | **読む行 0**（342 行。checked A 63・B 26） |
| 解説の「出てこない」 | `kaisetsu-absent.md` | 読む行 0 | **読む行 0**（219 行。checked A 57・B 100、語 0 62） |
| 参照の定理名の突き合わせ | `reference-theorem-names.md` | 名前 726、一致 131、監査で見る 50 | **同じ** |
| 英語版 Wikipedia の記事名の見出し | `wikipedia-heads.md` | 19 語（verified 12） | **19 語（verified 12）** |
| 抜き取りの型（新） | `sample-types.md` | — | 5. の表 |
| corpus:decide の判定の種類 | `audits/corpus-2026-10-09.md` | 主見出し 1318・併記 211・決まった言い方が出てこない 65・参照 314・要の部分が 3 件以上 74（MSE 47）・人間 103・判断不能 0 | **主見出し 1317・併記 211・決まった言い方が出てこない 65・参照 315・要の部分が 3 件以上 73（MSE 46）・人間 103・判断不能 1**（opposite-angle が ① → 参照、class-asking-another-example が判断不能 → 人間レビュー）、エントリ側で直すこと 1（nonresponse。監査 10〜15 と同じ） |
| langlink の突き合わせ | `pnpm crosscheck` | 一致 515、flag 0 | **一致 515、flag 0** |
| level.us（監査 6 の決定 1・7） | `pnpm exec tsx scripts/audit/level-us.ts` | 0 語 | **0 語** |
| 監査の順 | `python3 scripts/audit/order.py` | 2107 行 | **2107 行**（0 行の追加） |

## コレクション別の verified と公開の閾値（PLAN §8）

| コレクション | 件数 | verified | likely | draft | 閾値 | 閾値との差 |
|---|---|---|---|---|---|---|
| terms | 1,539 | **1,044** | 494 | 1 | 1,000 | 届いた（+44） |
| symbols | 220 | **219** | 1 | 0 | 200 | 届いた（+19） |
| phrases | 275 | **273** | 2 | 0 | 200 | 届いた（+73） |
| conventions | 72 | **72** | 0 | 0 | 30 | 届いた（+42。全件） |

- push 済みなので、サイトは verified の項目を本文つきで出している（likely に戻った 9 項目は既定で非表示・noindex）。pnpm build の書き出しは Anki が用語 1,044・記号 219・フレーズ 273、PDF が用語 1,044、検索の索引が 2,105 件（未確認 497）

## 人間レビュー

- audit-human の 2 フレーズ（class-asking-another-example・office-hours-do-you-have-a-minute）は、ユーザーが en を決める（監査 13 の前の決定 3 と同じ形。決めたら corpus-human-settled を付けて audit-human を外す）。どちらも今の en は自然な文で、根拠の件数が規則に届かないだけ
- 第 4 週の表は 2026-10-14 以降（監査 3 の決定 7）なので、このセッションでは作っていない

## I. 確認（合否はすべて終了コード）

各コミットの前に pre-commit フック（`pnpm validate && pnpm exec tsc --noEmit && pnpm test`）が回った（すべて exit 0。--no-verify は使っていない）。最後の状態で回したもの:

```
pnpm validate            # exit 0。警告 13（verified 1: qed-end-of-proof の notes[0] の 1 文目、ユーザーの文）
pnpm exec tsc --noEmit   # exit 0
pnpm test                # exit 0（10 files・218 tests）
pnpm spell               # exit 0（angulus・nonregular を cspell.json に。このレポートと sample-types.md も cspell で確かめた）
pnpm crosscheck          # exit 0（一致 515、flag 0）
pnpm build               # exit 0（validate → search-index 2,105 件 → OGP → サイト → export・Anki（用語 1,044・記号 219・フレーズ 273）・PDF（用語 1,044）。KaTeX の ▱ の「No character metrics」の警告は監査 11 の決定 2 のとおり）
pnpm audit:copy ／ pnpm audit:claims                      # exit 0
python3 scripts/audit/source_mentions.py ／ examples_headword.py ／ wording_warnings.py ／ reference_names.py ／ wikipedia_heads.py ／ reference_quotes.py ／ kaisetsu_subjects.py ／ kaisetsu_absent.py ／ sample_types.py   # exit 0
pnpm exec tsx scripts/audit/level-us.ts                  # exit 0（外す案 0 語）
pnpm corpus:count -- --ids …（9 項目）／ pnpm corpus:decide -- --write --ids …（同じ 9 項目）／ pnpm corpus:decide   # exit 0
python3 scripts/audit/order.py                           # exit 0（2107 行、0 行の追加）
```

## H. 規則の問題

### H-a. ユーザーの判断が要るもの

1. **抜き取りのモデル**: このセッション（親）は Opus 5.5 で、Fable 5.1 は見直し役 5 人だった（冒頭）。決定「公開の直前に一度、Claude Fable 5.1 で…見直す」をこれで済んだとするか、親も Fable 5.1 のセッションでやり直すかを決めてほしい。やり直すなら、同じ種と同じ母集団（2510669 の verified 1,616 項目）で同じ 100 項目になる（このセッションの直しの後の状態を見ることになる）
2. **公開の前に直す範囲**: 指示 5 のとおり、次のセッションが sample-types.md を直してから公開する。T6（ja.alt の 196 行）と T5（Math Stack Exchange の 38 フレーズ）は小さな直し・根拠の確かめの型で量が多いので、公開の前に全部やるか、大きな直しの型（T1a・T1b・T2・T4）だけにするかを決めてほしい
3. **audit-human の 2 フレーズの en**（上の人間レビュー）

### H-b. backlog に積んだもの（`audits/backlog.md` の 211〜223 行）

| 行 | 出どころ | 中身 |
|---|---|---|
| 211 | r1 | ③ の根拠が参照の別の概念の題の一部か、!③REF に印を |
| 212 | r1 | 台帳の既定の level.us が参照 0 件でも残る |
| 213 | r1・r3 | 台帳の統合で ja.alt に置いた語（同音異義・統合した行）と監査 7 の前の決定 4 の衝突 |
| 214 | r2 | terms の候補が綴りの分かれ（arccosine ／ arc cosine）をまとめない |
| 215 | r2 | CED の topic の題の言い方が候補に当たらない |
| 216 | r2 | 中学の図形の語の level.us が Geometry だけ |
| 217 | r3 | 前置詞・形容詞にも使う語を含む見出しの文脈を、10〜20 件の ① でも読む |
| 218 | r4 | 記号の読みの形が同じ字の別の記号を数える（ソースを限る印） |
| 219 | r4 | 例文の見出し語の規則を、説明的な訳の見出しに当てない |
| 220 | r5 | Math Stack Exchange の抜粋を読んだ記録を DECISIONS に残す決まり |
| 221 | r0 | 1 つの参照だけが扱う内容を advice_ja が一般化する型（backlog 194 の広げ方） |
| 222 | r0 | 出典の note の解説の節名と見出しの突き合わせ |
| 223 | 親 | 補角・余角・等積変形の level.jp の根拠 |

## J. 次のセッションへ

1. **同じ指示文で再開しない**。このセッションの結果は「まだ公開しない。sample-types.md を直してから公開する」（指示 5）。H-a の 1〜3 をユーザーが決めてから始める
2. **最初に flag audit-major-fix の 7 項目を見直す**（直したセッションと別のセッションで。見直す点は flag の note と付録 B）: terms/right-riemann-sum・left-riemann-sum（定義の日本語）、derivative-of-a-parametric-curve（en.term と TERM_FORMS）、expression・trigonometric-ratio・disk-method（mapping。trigonometric-ratio は定義の英文と例文も）、symbols/tangent-of-theta（読みの並び）
3. **sample-types.md を 1 行ずつ資料で読んで直す**: T1a（28 行）・T1b（20 語）・T2（28 行）は mapping・定義の型で大きな直しになりうる。T4 の 4 行は件数が小さく並びは変わらない見込み。T5 は内蔵ブラウザで Math Stack Exchange の抜粋を読む（38 フレーズ。根拠が崩れたら MSE_SKIP と監査 13 の前の決定 1）。T6 は `jawiki.py --search` で確かめてから資料の言い方にするか外す。直したら一覧を取り直して 0 にし、型の数をレポートに
4. 4 つのコレクションとも公開の閾値を超えている（terms 1,044・symbols 219・phrases 273・conventions 72）。告知を伴う正式な公開はユーザーの確認が要る（CLAUDE.md 規則 6）
5. 見直し役が範囲の外で見つけたもの（その語の監査で）: terms/infinity の level.us に Algebra 2 が無い（記号側の infinity-symbol にはある）、terms/cross-product（likely）の level.jp 数C（解説に外積 0 件）、terms/degrees-of-freedom（likely）の level.us に Intro Statistics が無い
6. `corpus/audit-pending-changes.json`（gitignore）に、trigonometric-ratio の締めの直し（定義の英文の言い換え・出典）と、likely の語・慣習差の前からの記録が残っている。その項目の判定で記録に付く
7. Math Stack Exchange の検索は今日 0 件（抜粋は内蔵ブラウザで読んだだけ）

## 付録 A. 抜き取りの 100 項目と判定

型の記号は 4. の表（M・F は大きな直し・不合格、m は小さな直し）。合格の 63 項目は判定の記録に行を足していない（監査 3 の抜き取りと同じ）。

| # | 項目 | 見直し役 | 判定 | 型 | 直した内容 |
|---|---|---|---|---|---|
| 1 | terms/commutative-property | r1 | 小さな直し | m3 | 「教科書（OpenStax）は law ではなく」を OpenStax Prealgebra に限った |
| 2 | symbols/negative-sign | r4 | 合格 |  |  |
| 3 | terms/recursive-definition | r1 | 合格 |  |  |
| 4 | phrases/class-asking-does-it-still-work-if | r5 | 合格 |  |  |
| 5 | terms/sum-of-an-arithmetic-sequence | r1 | 合格 |  |  |
| 6 | symbols/repeated-combination-h-jp | r4 | 小さな直し | m2 | spoken_ja を エヌ エイチ アール に |
| 7 | terms/central-angle | r1 | 小さな直し | m1 | level.us から Pre-Algebra |
| 8 | terms/derivative-of-a-parametric-curve | r1 | 大きな直し | M3・m2 | en.term → derivatives of parametric functions（CED 9.1・9.2）。ja.alt を外した |
| 9 | terms/causation | r1 | 合格 |  |  |
| 10 | terms/compose | r1 | 合格 |  |  |
| 11 | symbols/r-squared | r4 | 小さな直し | m6 | OpenStax の節（読んだ件数を DECISIONS に） |
| 12 | terms/probability-density-function | r1 | 合格 |  |  |
| 13 | symbols/base-n-subscript | r4 | 合格 |  |  |
| 14 | phrases/written-solution-suppose-for-contradiction | r5 | 合格 |  |  |
| 15 | terms/cusp | r1 | 合格 |  |  |
| 16 | terms/trigonometric-ratio | r1 | 大きな直し | M1 | mapping exact → near、定義の英文、例文 2（150°） |
| 17 | terms/expression | r1 | 大きな直し | M1 | mapping exact → near（「式」は等式・不等式も指す） |
| 18 | conventions/calculator-instead-of-tables | r4 | 合格 |  |  |
| 19 | terms/x-coordinate | r1 | 合格 |  |  |
| 20 | terms/monotonic | r1 | 小さな直し | m1・m6 | level.us から AP Calculus BC、level.jp に 数II、en.alt の出典 |
| 21 | terms/integrating-factor | r1 | 合格 |  |  |
| 22 | terms/arc-length | r1 | 小さな直し | m1 | level.jp 中3 → 数II |
| 23 | terms/census | r1 | 合格 |  |  |
| 24 | terms/equilateral-triangle | r1 | 合格 |  |  |
| 25 | terms/perfect-square-trinomial | r1 | 合格 |  |  |
| 26 | terms/work | r1 | 小さな直し | m1 | level.us から Precalculus、level.jp 数C の根拠を資料を主語に |
| 27 | symbols/alpha | r4 | 合格 |  |  |
| 28 | symbols/df-degrees-of-freedom | r4 | 合格 |  |  |
| 29 | terms/coin | r1 | 小さな直し | m2 | ja.alt の 表（硬貨）・裏（硬貨）を外した |
| 30 | terms/angle-of-depression | r2 | 合格 |  |  |
| 31 | terms/area-of-the-base | r2 | 合格 |  |  |
| 32 | phrases/explaining-solution-plugging-back-in | r5 | 合格 |  |  |
| 33 | terms/trapezoid | r2 | 小さな直し | m3・m6 | mapping_note に日本側の定義（日本語版 Wikipedia・共通テスト）、legs の参照先 |
| 34 | phrases/exam-notes-allowed | r5 | 合格 |  |  |
| 35 | terms/right-riemann-sum | r2 | 大きな直し | M2 | 定義の日本語「区間を等分した」→ 幅がそろわなくてもよい（CED 6.2 nonuniform partitions） |
| 36 | phrases/class-listening-this-will-be-on-the-test | r5 | 合格 |  |  |
| 37 | phrases/exam-ask-typo | r5 | 合格 |  |  |
| 38 | symbols/subset-sign | r4 | 合格 |  |  |
| 39 | terms/binary | r2 | 合格 |  |  |
| 40 | terms/cylinder | r2 | 合格 |  |  |
| 41 | terms/arccosine | r2 | 小さな直し | m1・m6 | level.us に Geometry・IM2、OpenStax Calculus Volume 3 を出典に |
| 42 | terms/represent | r2 | 合格 |  |  |
| 43 | phrases/class-listening-sanity-check | r5 | 合格 |  |  |
| 44 | terms/exterior-angle-bisector | r2 | 小さな直し | m6 | mapping_note に米国の扱い（高校課程の参照に 0 件） |
| 45 | terms/covariance | r2 | 合格 |  |  |
| 46 | phrases/office-hours-do-you-have-a-minute | r5 | 不合格 | F1 | Math Stack Exchange の have a minute で頼む文 2（3 件未満）→ 人間レビュー |
| 47 | terms/supplementary-angle | r2 | 合格 |  |  |
| 48 | terms/data | r2 | 合格 |  |  |
| 49 | terms/midpoint-riemann-sum | r2 | 小さな直し | m6 | en.alt に CED の midpoint sum |
| 50 | terms/line-of-reflection | r2 | 合格 |  |  |
| 51 | phrases/class-asking-another-example | r5 | 不合格 | F1 | Math Stack Exchange の根拠が意図を運ばない（頼む文 1）→ 人間レビュー |
| 52 | terms/linear-diophantine-equation | r2 | 合格 |  |  |
| 53 | terms/distance | r2 | 小さな直し | m7 | 例文 1「always positive」→ never negative |
| 54 | symbols/complex-a-plus-bi | r5 | 合格 |  |  |
| 55 | terms/partitioning-into-groups | r2 | 合格 |  |  |
| 56 | symbols/infinity-symbol | r5 | 合格 |  |  |
| 57 | phrases/discord-notes-from-today | r5 | 合格 |  |  |
| 58 | terms/minimum | r2 | 小さな直し | m1 | level.jp に 数I、level.us に Algebra 1・2 |
| 59 | terms/check-the-concavity | r2 | 合格 |  |  |
| 60 | terms/volume-by-cross-sections | r2 | 小さな直し | m6 | en.alt に CED の言い方、見出しを使う例文、mapping_note |
| 61 | terms/as-x-approaches-infinity | r3 | 合格 |  |  |
| 62 | terms/permutation-of-a-multiset | r3 | 合格 |  |  |
| 63 | terms/opposite-angle | r3 | 小さな直し | m5 | TERM_FORMS で対角の意味だけを数え直し、register を外した。CK-12 の対頂角の言い方 |
| 64 | terms/right-angle | r3 | 小さな直し | m3 | 語源を英語版 Wikipedia「Right angle」の言い方に |
| 65 | terms/perpendicular-bisector | r3 | 合格 |  |  |
| 66 | terms/disk-method | r3 | 大きな直し | M1 | mapping none → near（日本語版 Wikipedia「回転体」の円板法） |
| 67 | terms/interval-estimation | r3 | 合格 |  |  |
| 68 | symbols/half-open-interval | r5 | 小さな直し | m3 | notes[1] の [0, π)・値域 → [0, 2π) の三角方程式 |
| 69 | terms/revolve-around-the-y-axis | r3 | 合格 |  |  |
| 70 | terms/like-terms | r3 | 小さな直し | m1 | level.jp に 中2（〔用語・記号〕） |
| 71 | terms/derivative-of-an-inverse-function | r3 | 小さな直し | m3 | 参照の件数 15 → 14 |
| 72 | terms/double-root | r3 | 小さな直し | m1 | level.jp に 数I |
| 73 | phrases/explaining-solution-derivative-equal-to-zero | r5 | 合格 |  |  |
| 74 | terms/basic-properties-of-probability | r3 | 合格 |  |  |
| 75 | conventions/inequality-graph-boundary | r4 | 合格 |  |  |
| 76 | terms/hydrostatic-force | r3 | 合格 |  |  |
| 77 | terms/height | r3 | 小さな直し | m7 | 定義の英文の straight across from を言い換え |
| 78 | terms/limit-of-a-riemann-sum | r3 | 小さな直し | m2・m3 | ja.alt を外した。OpenStax 5.2 の定義の説明（等分のまま） |
| 79 | terms/subset | r3 | 合格 |  |  |
| 80 | terms/acceleration | r3 | 合格 |  |  |
| 81 | phrases/written-solution-given-prove | r5 | 合格 |  |  |
| 82 | conventions/similarity-symbol | r4 | 合格 |  |  |
| 83 | terms/quantity | r3 | 合格 |  |  |
| 84 | terms/square-shape | r3 | 合格 |  |  |
| 85 | terms/leading-coefficient | r3 | 合格 |  |  |
| 86 | phrases/email-subject-line | r5 | 合格 |  |  |
| 87 | terms/digit | r4 | 合格 |  |  |
| 88 | phrases/the-equation-holds | r5 | 合格 |  |  |
| 89 | terms/diverge-to-negative-infinity | r4 | 合格 |  |  |
| 90 | terms/substitution-method | r4 | 小さな直し | m5 | en.alt の method of substitution（すべて置換積分）を外した |
| 91 | terms/imaginary-number | r4 | 合格 |  |  |
| 92 | terms/multiplication | r4 | 合格 |  |  |
| 93 | symbols/tangent-of-theta | r5 | 大きな直し | M4 | 1 つ目の読み tangent of theta → tangent theta（逆関数の読みを除いて 168 ／ 185） |
| 94 | terms/local-maximum | r4 | 小さな直し | m2 | ja.alt 相対最大値 → 相対的最大値・局所的最大値（日本語版 Wikipedia「最大と最小」） |
| 95 | symbols/intersection-sign | r5 | 小さな直し | m2 | spoken_ja の出典（日本語版 Wikipedia「キャップ」） |
| 96 | terms/open-interval | r4 | 小さな直し | m1 | level.jp 数I → 数II |
| 97 | symbols/cross-product-cross | r5 | 合格 |  |  |
| 98 | terms/differential-equation | r4 | 小さな直し | m4 | 「数IIIの教科書で扱うかは教科書による」を外した |
| 99 | terms/radian | r4 | 合格 |  |  |
| 100 | terms/area-preserving-transformation | r4 | 小さな直し | m3・m1 | mapping_note を IM Grade 6 1.6・1.9 の文に、level.us Pre-Algebra |

## 付録 B. 判定の記録（`python3 scripts/audit/report_table.py 0 --note "公開前の抜き取り" --date 2026-10-09` の出力。監査 5 の決定 4）

### 順番の外の判定（batch 0、note に「公開前の抜き取り」）（43 行: 合格 0・小さな直し 34・大きな直し 7・不合格 2。verified 34）

| id | 判定 | 直した内容 |
|---|---|---|
| terms/monotonic | 小さな直し | level.us から AP Calculus BC を外した（CED に monotone・monotonic 0 件、有界単調数列の収束も CED に無い。見直し役 r1（公開前の抜き取り）） ／ level.jp に 数II を足した（解説で「単調」が出てくるのは数学II の対数の節の「2^x が単調に増加する」だけ。見直し役 r1（公開前の抜き取り）） ／ 英語版 Wikipedia「Monotonic function」を出典に（en.alt の monotonic は用例コーパス・参照に 0 件。見直し役 r1（公開前の抜き取り）） ／ 高等学校学習指導要領解説を出典に（level.jp 数II の根拠。見直し役 r1（公開前の抜き取り）） |
| terms/local-maximum | 小さな直し | ja.alt の「相対最大値」（資料に同じ意味で 0 件）を、日本語版 Wikipedia「最大と最小」の言い方「相対的最大値」「局所的最大値」に（監査 7 の前の決定 4。見直し役 r4（公開前の抜き取り）） ／ mapping_note を ja.alt の資料に合わせた（見直し役 r4（公開前の抜き取り）） ／ 解説の出典の note を ja.alt に合わせた（見直し役 r4（公開前の抜き取り）） ／ 日本語版 Wikipedia「最大と最小」を出典に（ja.alt。見直し役 r4（公開前の抜き取り）） |
| terms/derivative-of-an-inverse-function | 小さな直し | pitfalls[0] の参照の件数を節の件数どおりに（見直し役 r3（公開前の抜き取り）） |
| terms/derivative-of-a-parametric-curve | 大きな直し | en.term を derivatives of parametric equations から CED の言い方 derivatives of parametric functions（topic 9.1・9.2 の learning objective）に。CED の derivatives of parametric equations は 2 件とも topic 9.2 の題 Second Derivatives of Parametric Equations（二階微分）の一部で、③ の根拠が別の概念だった（監査 6 の決定 9。TERM_FORMS で !second を除いて数え直した。見直し役 r1（公開前の抜き取り）） ／ en.alt に OpenStax Calculus Volume 2（7.2）の derivatives of parametric equations を（見直し役 r1（公開前の抜き取り）） ／ CED の出典の note を見出しの根拠（9.1・9.2 の learning objective）に（見直し役 r1（公開前の抜き取り）） ／ ja.alt の「媒介変数曲線の微分」（解説・共通テスト・日本語版 Wikipedia に 0 件の本プロジェクトの訳語）を外した（監査 7 の前の決定 4。見直し役 r1（公開前の抜き取り）） ／ mapping_note を ja.term の型の文に（ja.term も解説・日本語版 Wikipedia に 0 件。見直し役 r1（公開前の抜き取り）） ／ 解説の出典の note を mapping_note に合わせた（見直し役 r1（公開前の抜き取り））<br>（公開前の抜き取り（Fable）: en.term を CED の言い方 derivatives of parametric functions（topic 9.1・9.2 の learning objective）に。前の見出しの根拠は topic 9.2 の題 Second Derivatives of Parametric Equations（二階微分）の一部だった。見直す点: en.term・en.alt、TERM_FORMS の !second、ja.alt を外した、mapping_note と解説の出典の note） |
| terms/arccosine | 小さな直し | level.us に Geometry・Integrated Math 2 を足した（IM Geometry の用語集に arccosine。姉妹エントリ arcsine とそろう。見直し役 r2（公開前の抜き取り）） ／ IM Geometry を出典に（level.us。見直し役 r2（公開前の抜き取り）） ／ OpenStax Calculus Volume 3 を出典に（pitfalls[0] が名指しする。見直し役 r2（公開前の抜き取り）） |
| terms/limit-of-a-riemann-sum | 小さな直し | ja.alt の「定積分と和の極限」（解説・共通テスト・日本語版 Wikipedia に 0 件。台帳の統合の名残）を外した（監査 7 の前の決定 4。見直し役 r3（公開前の抜き取り）） ／ pitfalls[1] の「OpenStax の定義は幅の違う分け方も許す」（OpenStax Volume 1 5.2 は regular partition のまま定義し、nonregular なら最大の幅 → 0 の極限が要ると書くだけ）を資料どおりに（本セッションが見つけた） |
| terms/volume-by-cross-sections | 小さな直し | en.alt に CED の topic 8.7・8.8 の題の言い方 volumes with cross sections を（用例コーパスは 0 件で、判定は変わらない。見直し役 r2（公開前の抜き取り）） ／ 見出しの slicing method を使う例文を足した（例文が 1 つで見出しの語を使わなかった。見直し役 r2（公開前の抜き取り）） ／ mapping_note に ja.term の型の文を（解説（数学）・日本語版 Wikipedia に 0 件。STYLE 追記欄。見直し役 r2（公開前の抜き取り）） |
| terms/volume-by-cross-sections | 小さな直し | 高等学校学習指導要領解説を出典に（mapping_note が名指しする。公開前の抜き取りの締めの source-mentions） ／ 足した例文が OpenStax Calculus の練習問題と 18 語一致していたので書き直した（公開前の抜き取りの締めの書き写しの検出） |
| terms/differential-equation | 小さな直し | pitfalls[0] の資料の名前の無い「数IIIの教科書で扱うかは教科書による」を外した（STYLE 追記欄: 日本の教科書は書かない。見直し役 r4（公開前の抜き取り）） |
| terms/left-riemann-sum | 大きな直し | 定義の日本語の「区間を等分した」を外した（AP の CED topic 6.2 は uniform or nonuniform partitions の両方で近似するとし、定義の英文も等分を言わない。見直し役 r2（公開前の抜き取り）） ／ pitfalls に CED の nonuniform partitions を足した（見直し役 r2（公開前の抜き取り）） ／ variants の note の「主見出し」（見出しの決め方の説明）を、資料の言い方の比べ方に（見直し役 r2（公開前の抜き取り）） ／ CED の出典の note に nonuniform partitions を（見直し役 r2（公開前の抜き取り））<br>（公開前の抜き取り（Fable）（範囲の外。right-riemann-sum と同じ型）: 定義の日本語の「区間を等分した」を外した（CED topic 6.2 は uniform or nonuniform partitions）。見直す点: definition_ja・pitfalls・variants の note） |
| terms/right-riemann-sum | 大きな直し | 定義の日本語の「区間を等分した」を外した（AP の CED topic 6.2 は uniform or nonuniform partitions の両方で近似するとし、定義の英文も等分を言わない。見直し役 r2（公開前の抜き取り）） ／ pitfalls に CED の nonuniform partitions を足した（見直し役 r2（公開前の抜き取り）） ／ variants の note の「主見出し」（見出しの決め方の説明）を、資料の言い方の比べ方に（見直し役 r2（公開前の抜き取り）） ／ CED の出典の note に nonuniform partitions を（見直し役 r2（公開前の抜き取り））<br>（公開前の抜き取り（Fable）: 定義の日本語の「区間を等分した」を外した（CED topic 6.2 は uniform or nonuniform partitions）。pitfalls に CED の nonuniform partitions。見直す点: definition_ja・pitfalls[1]・variants の note） |
| terms/midpoint-riemann-sum | 小さな直し | en.alt に CED の試験問題の言い方 midpoint sum を（topic 6.2。用例コーパスは 0 件で、判定は変わらない。見直し役 r2（公開前の抜き取り）） |
| terms/disk-method | 大きな直し | mapping を none から near に: 回転体の体積を π∫{f(x)}²dx で求めることは数学III にあり、日本語版 Wikipedia「回転体」は同じ方法を円板法（円板分割法）と呼ぶ。名前が解説に無いだけで、日本語の名前が資料にある shell-method（バウムクーヘン積分）と同じ型（見直し役 r3（公開前の抜き取り）） ／ pitfalls[0]「disc method と綴る教材もある」（資料の名前が無く、pitfalls[1] の CED の綴りと重なる）を外した（見直し役 r3（公開前の抜き取り））<br>（公開前の抜き取り（Fable）: mapping none → near（日本語版 Wikipedia「回転体」が同じ方法を円板法と呼び、数学III は回転体の体積を同じ積分で求める。shell-method と同じ型）。見直す点: mapping、pitfalls[0] を外した） |
| terms/work | 小さな直し | level.us から Precalculus を外した（OpenStax Precalculus・Algebra and Trigonometry に work done・W = F·d は 0 件。見直し役 r1（公開前の抜き取り）） ／ level.jp 数C の根拠を資料を主語に書いた（解説の「仕事」は理科だけ。見直し役 r1（公開前の抜き取り）） ／ 高等学校学習指導要領解説を出典に（pitfalls[0]。見直し役 r1（公開前の抜き取り）） |
| terms/minimum | 小さな直し | level.jp に 数I を足した（例文 2 の二次関数の最小値。解説 数学I に「二次関数の最大値や最小値」。対の maximum とそろう。見直し役 r2（公開前の抜き取り）） ／ level.us に Algebra 1・Algebra 2 を足した（minimum value は OpenStax Elementary Algebra・Algebra and Trigonometry にある。maximum とそろう。見直し役 r2（公開前の抜き取り）） |
| terms/distance | 小さな直し | 例文 1 の「always positive ／ いつも正」（距離は 0 にもなる）を never negative に（意味と役割は同じ。見直し役 r2（公開前の抜き取り）） |
| terms/central-angle | 小さな直し | level.us から Pre-Algebra を外した（OpenStax Prealgebra・IM 6–8 に central angle 0 件。見直し役 r1（公開前の抜き取り）） |
| terms/height | 小さな直し | 定義の英文の straight across from（真向かいと読める）を言い換えた（意味は同じ。見直し役 r3（公開前の抜き取り）） |
| terms/expression | 大きな直し | mapping を exact から near に: 日本語の「式」は等式・不等式も指すが、英語の expression は等号を含まない式だけ（エントリ自身の pitfalls[0]・定義の日本語が書く範囲の差。兄弟の equation・algebraic-expression は同じ型で near。CLAUDE.md 規則 5。見直し役 r1（公開前の抜き取り）） ／ mapping near の理由を mapping_note に（pitfalls[0] から移した。日本側を資料を主語に。見直し役 r1（公開前の抜き取り）） ／ pitfalls[0]（mapping_note に移した）を外した（見直し役 r1（公開前の抜き取り）） ／ 日本語版 Wikipedia「等式」を出典に（mapping_note。見直し役 r1（公開前の抜き取り））<br>（公開前の抜き取り（Fable）: mapping exact → near（日本語の「式」は等式・不等式も指し、英語の expression は等号を含まない式だけ。pitfalls[0] を mapping_note に移し、日本語版 Wikipedia「等式」を出典に）。見直す点: mapping・mapping_note） |
| terms/like-terms | 小さな直し | level.jp に 中2 を足した（同類項の語は中学校学習指導要領の第 2 学年 A 数と式の〔用語・記号〕。中1 の一次式の加法・減法は概念として残す。見直し役 r3（公開前の抜き取り）） ／ 中学校学習指導要領〔用語・記号〕を出典に（level.jp 中2。見直し役 r3（公開前の抜き取り）） |
| terms/commutative-property | 小さな直し | variants の note の「教科書（OpenStax）は」を本に限った（OpenStax Algebra and Trigonometry・Precalculus に Commutative law of multiplication が各 1 件。見直し役 r1（公開前の抜き取り）） ／ pitfalls[1] の「教科書（OpenStax）は law ではなく」を本に限った（同上。見直し役 r1（公開前の抜き取り）） |
| terms/right-angle | 小さな直し | pitfalls[0] の語源の主張を資料（英語版 Wikipedia「Right angle」）を主語に、記事の言い方（rectus は upright）に（「正しい」は記事に無い。見直し役 r3（公開前の抜き取り）） ／ 英語版 Wikipedia「Right angle」の Etymology を出典に（pitfalls[0]。見直し役 r3（公開前の抜き取り）） |
| terms/coin | 小さな直し | ja.alt の「表（硬貨）」「裏（硬貨）」を外した（硬貨の言い換えではなく heads ／ tails の日本語。台帳の同音異義の統合（DECISIONS 2026-09-11）の名残で、監査 7 の前の決定 4 の「同じ意味」に当たらない。表・裏は pitfalls[0] が書く。見直し役 r1（公開前の抜き取り）） |
| terms/substitution-method | 小さな直し | en.alt から method of substitution を外した（用例コーパス 5 件と参照はすべて置換積分。pitfalls[0] が別物と断る方。見直し役 r4（公開前の抜き取り）） |
| terms/trapezoid | 小さな直し | mapping_note に日本側の定義を（near の何と何が違うかが読めなかった。見直し役 r2（公開前の抜き取り）） ／ 日本語版 Wikipedia「台形」を出典に（mapping_note。見直し役 r2（公開前の抜き取り）） ／ 共通テストを出典に（mapping_note。見直し役 r2（公開前の抜き取り）） ／ pitfalls[0] の直角三角形の legs の参照先をエントリ legs に（見直し役 r2（公開前の抜き取り）） |
| terms/opposite-angle | 小さな直し | pitfalls[1] に、CK-12 Geometry が対頂角を opposite angles と説明することを足した（見直し役 r3（公開前の抜き取り）） ／ CK-12 Geometry を出典に（pitfalls[1]。見直し役 r3（公開前の抜き取り）） ／ IM Geometry を出典に（見出しの根拠。TERM_FORMS で四角形・三角形の対角の言い方だけを数え直した。見直し役 r3（公開前の抜き取り）） ／ en.register（both）を外した: 用例コーパスの opposite angle は偶関数の opposite angles（θ と −θ）・対頂角・前置詞の the side opposite angle θ が大半で、対角の意味は話 1・書 4 だけ。TERM_FORMS で対角の言い方だけを数え直すと ③ で IM の呼び方（見出しは変わらない。corpus:decide のエントリ側で直すこと。見直し役 r3（公開前の抜き取り）） |
| terms/opposite-angle | 小さな直し | pitfalls[1] の CK-12 の 9 語の引用を短くした（公開前の抜き取りの締めの書き写しの検出） |
| terms/area-preserving-transformation | 小さな直し | mapping_note の「三角形は面積が等しいと文で説明する」（参照にその文は無い）を、参照にある文（IM Grade 6 1.6 の平行四辺形、1.9 の三角形）に（見直し役 r4（公開前の抜き取り）） ／ level.us の Geometry を Pre-Algebra に（同じ考えが出てくるのは IM Grade 6 の 1.6・1.9 だけで、Geometry の参照には無い。見直し役 r4（公開前の抜き取り）） ／ IM 6–8 を出典に（mapping_note・level.us。見直し役 r4（公開前の抜き取り）） |
| terms/area-preserving-transformation | 小さな直し | mapping_note の IM の 15 語の英文の引用を外した（公開前の抜き取りの締めの書き写しの検出） |
| terms/arc-length | 小さな直し | level.jp の 中3 を 数II に（中学校の解説の弧の長さは第 1 学年の扇形だけ、高等学校の解説は数学II の弧度法で扇形の弧の長さ。pitfalls[1] も数II と書く。見直し役 r1（公開前の抜き取り）） |
| terms/double-root | 小さな直し | level.jp に 数I を足した（日本語版 Wikipedia「数学 (教科)」の新課程の数学I に二次方程式の判別式。エントリ discriminant も 数I・数II。見直し役 r3（公開前の抜き取り）） ／ 日本語版 Wikipedia「数学 (教科)」を出典に（level.jp 数I。見直し役 r3（公開前の抜き取り）） |
| terms/open-interval | 小さな直し | level.jp の 数I を 数II に（解説の数学I の節に区間は出てこない。区間は数学II の微分・積分（区間を制限した関数の最大値・最小値）と数学III（閉区間 [a, b]）。見直し役 r4（公開前の抜き取り）） ／ 高等学校学習指導要領解説を出典に（level.jp。見直し役 r4（公開前の抜き取り）） |
| terms/trigonometric-ratio | 大きな直し | mapping を exact から near に: 高等学校学習指導要領解説の数学I の三角比は鈍角（0° ≦ θ ≦ 180°）まで含むが、参照の trigonometric ratio は直角三角形の鋭角の比（IM Geometry 22 件・CK-12・OpenStax とも鈍角・単位円の文脈では 0 件）。鈍角の値は米国では三角関数の値（見直し役 r1（公開前の抜き取り）） ／ mapping near の理由と米国側の扱いを mapping_note に（見直し役 r1（公開前の抜き取り）） ／ 定義の英文を英語の trigonometric ratio の範囲（直角三角形の鋭角）に。鈍角に広げる日本の三角比の範囲は定義の日本語と mapping_note が書く（見直し役 r1（公開前の抜き取り）） ／ 例文 2 の Find the values of the trigonometric ratios of 150° を差し替えた（参照は鈍角に trigonometric ratio を使わない。見直し役 r1（公開前の抜き取り））<br>（公開前の抜き取り（Fable）: mapping exact → near（参照の trigonometric ratio は直角三角形の鋭角の比。日本の三角比は鈍角まで）。定義の英文を鋭角の比に、例文 2 を Find sin 150°, cos 150°, and tan 150°. に差し替えた。見直す点: mapping・mapping_note・definition_en・examples[1]） |
| terms/exterior-angle-bisector | 小さな直し | mapping_note に米国の扱いを（level.us が [] なのに理由が読めなかった。STYLE 原則 4。見直し役 r2（公開前の抜き取り）） |
| symbols/tangent-of-theta | 大きな直し | spoken_en の並びを件数どおりに: 1 つ目の読みの形「!the tangent of *」が逆関数の読み inverse tangent of x・arc tangent of x も数えていた（196）。「!the !inverse !arc tangent of *」で数え直すと 168 で、tangent theta（185）が 1 つ目（3 つとも standard のまま。見直し役 r5（公開前の抜き取り）） ／ notes[0] の並びを spoken_en に合わせた（見直し役 r5（公開前の抜き取り））<br>（公開前の抜き取り（Fable）: spoken_en の 1 つ目を tangent theta に（1 つ目の読みの形が inverse tangent of x・arc tangent of x を数えていた。数え直して 185 ／ 168 ／ 76。3 つとも standard のまま）。見直す点: spoken_en の並び・notes[0]、lib.ts SYMBOL_PATTERNS の !inverse !arc） |
| symbols/half-open-interval | 小さな直し | notes[1] の「値域・区間を [0, π) のような」（[0, π) は 1 回だけで、値域の例は無い。[0, 2π) が 33 回）を資料どおりに（見直し役 r5（公開前の抜き取り）） ／ 出典の note を notes[1] に合わせた（見直し役 r5（公開前の抜き取り）） |
| symbols/intersection-sign | 小さな直し | 日本語版 Wikipedia「キャップ」を出典に（spoken_ja の読みの根拠。見直し役 r5（公開前の抜き取り）） |
| symbols/r-squared | 小さな直し | OpenStax Introductory Statistics の出典に節を（見直し役 r4（公開前の抜き取り）。evidence の r squared 259 の大半は半径・変数の r で、統計のソース（Khan Academy の AP Statistics）だけでも r squared 11 ・coefficient of determination 4 で読みの並びは変わらない。DECISIONS） |
| symbols/repeated-combination-h-jp | 小さな直し | spoken_ja の「エイチ n r」を、同じ単元の combination-ncr（エヌ シー アール）・permutation-npr（エヌ ピー アール）と同じ読みの形に（見直し役 r4（公開前の抜き取り）） |
| phrases/class-asking-another-example | 不合格 | —<br>（公開前の抜き取り（Fable）: likely の根拠だった Math Stack Exchange の件数が意図を運ばない（do another example 6・do one more example 1 は質問者が自分で例を挙げる文、do one more 14 は one more step ほか。another example please 2 のうち頼む文は 1）。MICASE の学生の発話は 0 件で、監査 13 の前の決定 1 により人間レビューへ（en Could you do another example? の文そのものの誤りではない）） |
| phrases/office-hours-do-you-have-a-minute | 不合格 | —<br>（公開前の抜き取り（Fable）: likely の根拠の Math Stack Exchange の have a minute 3 件を読むと、相手の時間を求める文は 2 件（I really hope one of you guys have a minute to take a look・I'd appreciate if you have a minute to skim）で、1 件は you have a minute per question（1 問 1 分）。3 件に届かず MICASE の学生の発話も 0 件なので、監査 13 の前の決定 1 により人間レビューへ（en Do you have a minute? の文そのものの誤りではない。形では 1 件だけを除けないので MSE_SKIP にはしていない）） |
| conventions/us-only-precalculus-topics | 小さな直し | level.jp 数II・数III・数C → 数II・数III・数C・理数（jp の無理方程式は理数数学I の発展・拡充の例だけ。監査 15 の前のユーザーの決定 3） ／ jp の理数数学I の引用を解説の原文どおりに（見直し役 r0（公開前の抜き取りのセッション）） ／ us の「二次曲線の軸の回転」を A&T 12.4 の中身（座標軸を回す）どおりに（見直し役 r0（公開前の抜き取りのセッション）） ／ us の 2 文目に節番号を（見直し役 r0（公開前の抜き取りのセッション）） ／ advice_ja の「Algebra 2・Precalculus には…が入る」を資料を主語に（3 つを扱うのは OpenStax だけで、IM 9–12 は 0 件。見直し役 r0（公開前の抜き取りのセッション）） ／ 解説の出典の note の節名を解説の見出しどおりに（見直し役 r0（公開前の抜き取りのセッション）） ／ IM を出典に（advice_ja の「IM Algebra 2 には出てこない」。見直し役 r0（公開前の抜き取りのセッション）） |
| conventions/us-only-precalculus-topics | 小さな直し | jp の解説の 27 文字の引用を言い換えた（公開前の抜き取りの締めの書き写しの検出） |

