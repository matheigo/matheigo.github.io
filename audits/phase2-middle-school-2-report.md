# Phase 2 レポート（中学の単元 2）— 1〜4 を直し、バッチ 1〜6（300 語）を生成した

作成: 2026-09-25 ／ 対象: e775ade（中学の単元 1 のレポート）→ 本コミット
指示: audits/phase2-middle-school-report.md を受けた 1〜5。判断は `docs/DECISIONS.md` の「Phase 2 中学の単元 2 の前の修正」と「Phase 2 中学・Algebra 1／2・Pre-Algebra の単元 2」。

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified に上げた語はない。

## まとめ

- **1〜4 はすべて終えた**（b9d226f）。本文から用例コーパスの件数を外した（726 エントリ・946 欄。validate の警告 1,095 → 0）、割合を独立したエントリ `rate` にした、見出しの規則（1 ソース頼みの話し言葉）を足して全語に当て 9 語を直した、aas-congruence を AAS にした
- **5（生成）はバッチ 1〜6 の 300 語**（fab4054・ae6dddc・a5aa2f5・2e820f1・8963718・b0a401c）。likely 300 ／ draft 0。人間レビュー行きの ③ は **1 語**（バッチ 6 の 2%）で、どのバッチも 1 割を超えなかった
- 途中で「キリのいいところで終わってね」とあったが、ちょうど予定の 6 バッチ目を終えるところだったので、そこで止めてこのレポートを書いた
- **バッチ 6 のコミット（b0a401c）は `pnpm test` の失敗を見落としたまま作った**。新しい terms/square-root が symbols/square-root と検索索引の id でぶつかっていた。6f20658 で平方根を `square-root-of-a-number` に改名し、validate に「2 つのコレクションで同じ id」をエラーにする検査を足した（I）
- 台帳全体の残り: **1,540 行中 81 行**（エントリ 1,459）
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて緑（J）

## A. 1〜4 の結果

### 1. 本文に用例コーパスの件数を書かない

- 規則を STYLE（原則 5、追記欄の最初、表の中の数）・CLAUDE.md 規則 10・PLAN Phase 4（用語ページに evidence の件数の表を出す）に書いた
- validate に警告を足した（`scripts/lib/corpus-count.ts`、単体テスト 7）。文（。で区切る。括弧の中の 。 では切らない）に件数（「N 件」「138 対 353」。「1 対 1」は除く）があり、用例コーパスを指す語（用例コーパス・話し言葉・書き言葉・講義・字幕・Khan・MIT・OCW・チャンネル名・「件未満」）を含むか、参照の名前（CED・OpenStax・IM・CK-12・Nicholson・Levin・Wikipedia）を含まなければ警告する
- 書き直した: **726 エントリ（terms 716・symbols 9・conventions 1）、946 欄**。8 つの書き直し役に分け、警告の出た文だけを、今の件数（counts.json のソース別）で比べる書き方に直させた（ほかの文は一字も変えない。check スクリプトで確かめた）。ほかに「英語に決まった言い方がない（話 N 件 ／ 書 M 件）」の定型 22 件を機械的に外し、警告に掛からない形の 8 欄（「41 件中 31 件」「話し言葉 1,405 対 391」「10 件未満」ほか）を手で直した
- **H の 123 語のうち 116 語**がこの書き直しに入った。残る 7 語（fractional-part・general-multiplication-rule・hexadecimal・histogram・image・random-sampling・scatter-plot）は参照の件数だけなのでそのまま。前回 218 語を直した語も全部この判定を通した（件数を新しくするのではなく外した）
- 書き直しで今の件数が古い文と食い違った語は今の件数に合わせた（dilation・prime-factorization・place・scale-factor・straight-angle・adjacent-angles・base-n・least-common-multiple・greatest-common-divisor・laws-of-exponents・leading-digit・rigid-motion・relatively-prime ほか。どれも Khan Academy の中学の字幕が加わったため）

### 2. 割合

- fix_decisions.py の PHASE2G_SAME から ("rate", "percent") を外し、台帳を作り直した（残り 381 → 382 行）
- エントリ `rate`（割合）: mapping none、en.term は `ratio to the base amount`（「比べる量 ÷ もとにする量」の本プロジェクトの説明的な訳。用例コーパス・参照とも 0 件）。mapping_note と pitfalls に「英語に 1 語で当たる語はない。場面で ratio ／ rate ／ fraction ／ percent を使い分ける」。参照: IM は ratio・percent・percentage を Grade 6 の glossary の見出しにしている、OpenStax Prealgebra は ratio（同じ単位）と rate（違う単位）を Ratios and Rate の節で分け、proportion は比例式（Solve Proportions and their Applications）
- decide は「英語に決まった言い方がない」（corpus-no-fixed-expression）と判定。crosscheck は 割合 → Rate (mathematics) で一致
- バッチ 2 の percent からは 割合 の ja.alt・mapping_note を外し、mapping を exact にした

### 3. 見出しの規則（1 ソース頼みの話し言葉）

- `lib.ts spokenLeanHead`（単体テスト 6）と decide の「エントリ側で直すこと」・報告の新しい節。話し言葉の首位が 1 ソース頼み（件数の最も多いソースを抜くと ③ か別の候補が首位）で、書き言葉 ① か CED が別の言い方で決まっていれば、その言い方を en.term にし、話し言葉の言い方を register spoken の variant にする。書き言葉が先、CED が次
- 当てはめの細部（DECISIONS に書いた）: 書き言葉（① か ②）か CED（最も多く使う候補）が話し言葉の首位と同じなら当てない（left Riemann sum は CED の呼び方）。書き言葉の `let u =` は話し言葉の `let u equal` と同じ言い方として扱う。冠詞だけの違い（find the ／ an equation、make a ／ the substitution）はコーパスが別に数えているので別の言い方として当てた

**3 で見出しが変わった既存の語（9 語）**

| id | 変更 |
|---|---|
| negative-correlation | negative linear relationship → **negative correlation**（AP Statistics の CED topic 5.2。書き言葉は ③）。negative linear relationship は spoken の variant |
| measure-of-center | measure of central tendency → **measure of center**（AP Statistics の CED topic 1.7 ほか） |
| standard-normal-table | z-table → **standard normal table**（AP Statistics の CED topic 2.11） |
| system-of-linear-equations | linear system → **system of linear equations**（書き言葉 ①） |
| find-the-equation-of-the-tangent-line | find the equation of the tangent line → **find an equation of the tangent line**（書き言葉 ①） |
| substitute-new-variable | make a substitution → **make the substitution**（書き言葉 ①） |
| evaluate-the-integral | en.term はそのまま。compute the integral を spoken の variant に（both → spoken） |
| trigonometric-substitution | en.term はそのまま。trig substitution を spoken の variant に |
| variable-of-integration | en.term はそのまま。dummy variable を spoken の variant に |

規則に当たる既存の語は 30（うち 21 語はもとから規則どおり）。CED で決めた 3 語は書き言葉が ③ なので en.register を外した。let-u-equal は上の細部で当てなかった。

生成したバッチで規則に当たって見出しを決めた語: constant-of-proportionality（constant of variation）、direct-proportion（is proportional to。CED topic 7.8）、lateral-area（lateral surface area）、rectangular-prism（rectangular box）、significant-figures（significant digits）。ほかに規則どおりに variant を置いた語: coordinate-plane（xy-plane）、rearranging-an-equation（solve for a variable）。

### 4. aas-congruence

en.term `AAS`、en.alt `angle-angle-side`（指示の「angle-angle-side（AAS）」の括弧は AAS の元の語の注と読んだ）、mapping near、mapping_note「見出しの…は本プロジェクトの訳語。日本の三角形の合同条件には無い（1 辺とその両端の角が等しい、に帰着する）」。corpus-no-fixed-expression を外して corpus-human-settled（register は主張しない）。

## B. 生成（5）

| バッチ | 範囲 | 語数 | 参照で見出し | 決まった言い方なし | 人間レビュー（③） |
|---|---|---|---|---|---|
| 1 | 中1 正負の数・文字と式の前半 | 50 | 1 | 0 | 0 |
| 2 | 中1 文字と式の後半・一次方程式・比例と反比例 | 50 | 0 | 2 | 0 |
| 3 | 中1 平面図形・空間図形 | 50 | 7 | 2 | 0 |
| 4 | 中1 空間図形の残り・中2 式の計算・連立方程式・一次関数 | 50 | 6 | 2 | 0 |
| 5 | 中2 一次関数の残り・平行と合同・三角形と四角形・確率の前半 | 50 | 15 | 3 | 0 |
| 6 | 中2 確率の残り・中3 展開と因数分解・平方根・二次方程式・y = ax²・相似・円 | 50 | 9 | 2 | 1 |
| 計 | | **300**（likely 300 ／ draft 0） | 38 | 11 | **1** |

- 手順（前のレポート K）: バッチ 1〜4 は前のセッションの見出しの案を、バッチ 5・6 は新しく作った候補一覧を、全部のコーパスで probe し直して見出し・register・variants を決めた。本文はバッチ 1〜4 が前のセッションの下書き（バッチ 4 は未読だったので全部読んだ）、バッチ 5・6 は下書き役 5 人ずつに事実欄つきで書かせた。全部読んで直してから build_entries.py で書き出し、corpus:count → corpus:decide -- --write。バッチごとに mismatch 0・直すこと 0 を確かめ、新しい語の en.register をコーパスの判定と突き合わせるスクリプトでも確かめた（ずれていた range・coin を直した）
- 本文の直し（前のレポート E）: 米国の授業・教科書の主張を確かめた範囲に絞った（≥ ≤ は「米国の教科書（OpenStax）」、commutative property of addition ／ of multiplication は「とも言う」、distribute the 3 は「授業では」、−3 の読みは STYLE の米英差として）、cross-multiply の例文の日本語を分数の形に、球 ／ sphere を near に、速さ・濃度の問題の例文を問題文に（バッチ 4）
- ふつうの英単語の見出しは文脈を 10 件ずつ見た（STYLE 追記欄）。別の意味が多かった語は TERM_FORMS の形で数え直した: quantity（括弧の読み the quantity x plus one）、corresponding-angles（相似な図形・参照角）、diagonal（行列）、square-shape（a squared）、factoring（名詞の factor）、similar（「似ている」、行列の相似）ほか。バッチ 5・6 で TERM_FORMS に 24 語の形を足した
- 単元に当たる既存の語に中学の内容を足した: let-u-equal（〜を x とする）、distance（道のり）、number-of-real-solutions（解の個数）、perpendicular-lines（垂線）、system-of-linear-equations（連立方程式）、digit・place・divisibility・remainder（中 2 の文字式の証明）、symmetric・point-of-tangency・rigid-motion（台帳の ja_alt）

### ③ の一覧

- **人間レビュー行き（1）**: converse-of-the-inscribed-angle-theorem（円周角の定理の逆）。用例コーパス・CED・OpenStax・IM・CK-12・Nicholson・Levin・Wikipedia とも 0 件。mapping は台帳の exact のままにした（near に変えて「決まった言い方がない」に逃がすことはしなかった）
- **英語に決まった言い方がない（11）**: value-of-a-ratio・change-together・point-symmetry・orthographic-projection・sketch-of-a-solid・surplus-and-shortage・congruence-criteria-for-right-triangles・conditions-for-a-parallelogram・area-preserving-transformation・cross-method・angle-inscribed-in-a-semicircle（ほかに 2 の rate）
- **参照で見出し（38）**: CK-12 17（line-symmetry・regular-polygon・skew-lines・same-side-interior-angles・sum-of-the-interior-angles・sum-of-the-exterior-angles・angle-sum-of-a-triangle・obtuse-angle・acute-triangle・obtuse-triangle・base-angle・vertex-angle・midsegment-theorem・terminating-decimal・non-terminating-decimal・inscribed-angle-theorem・congruent-arcs）、IM 13（compass・construct・regular-polyhedron・net・regular-tetrahedron・edge・base-of-a-solid・corresponding-angles・congruence-criteria・auxiliary-line・similarity-criteria・ratio-of-volumes-of-similar-solids・concyclic）、OpenStax 7（linear-expression・lateral-face・lie-in・mixture-problem・corresponding-angles-of-congruent-figures・certain・impossible）、CED 1（representations-of-a-function）

## C. 統合と移動

- 割合を百分率から戻した（2）。平方根の id を `square-root-of-a-number` に改名した（I）
- coin の en.alt から heads ／ tails を外した（台帳で統合した 表・裏 の英語だが、coin の別の言い方ではなく、数えると話し言葉の首位が heads になる。pitfalls に残した）
- midsegment-theorem（中点連結定理）の level.jp を 中3 にした（今の学習指導要領では中 3 の相似。台帳の単元は中 2 のまま）
- 同じ英語の見出しを SAME_EN_TERM に 13 組、同じ日本語を SAME_JA に 3 組（垂直・次数・辺）足し、互いを related・pitfalls で指した
- congruence-criteria-for-right-triangles の候補から hypotenuse-leg を外した（hl-congruence の見出し）。perfect-square-trinomial の候補から perfect square（平方数）を外した

## D. 確かめた主張（本文・参照ファイルで）

- OpenStax Prealgebra: Ratios and Rate の節で ratio（同じ単位）と rate（違う単位）を分ける定義文、Solve Proportions and their Applications、Understand Percent、`Let n = the number of …` の形、estimate square roots の between two consecutive integers
- OpenStax Elementary Algebra: `D = rt`、conditional equation ／ identity ／ contradiction の分類、Binomial Squares Pattern、Product of Conjugates Pattern、Square Root Property、Factor by Grouping、special products、inconsistent ／ dependent system
- OpenStax Algebra and Trigonometry: addition method、in increasing powers、total number of outcomes、certain ／ impossible event
- OpenStax Intermediate Algebra・Prealgebra・CK-12 Algebra: literal equation。IM 6–8: number cube
- CK-12 Geometry は台形を「平行な辺がちょうど 1 組」、IM Geometry は「少なくとも 1 組」と定義する。CK-12 Geometry 9.4 Surface Area の lateral faces
- AP Statistics の CED: sample proportion。授業の Quadrant I〜IV の読み（Khan Academy は序数 the first quadrant、YouTube の解説は quadrant one が多い）は probe で確かめた
- 書き直した本文の比べ方は counts.json のソース別の件数に合わせた（A-1）

## E. 決めたこと（指示の外）

1. 件数の警告は発見的な判定にした（文の中の語で用例コーパスか参照かを読む）。OpenStax は書き言葉コーパスでもあるので、参照として件数を書くときは OpenStax を主語にした文にする
2. 3 の当てはめの細部（let u = を同じ言い方とする、冠詞だけの違いは別の言い方、CED は最も多く使う候補、書き言葉か CED が話し言葉の首位を支えるなら当てない）
3. 割合の en.term を説明的な訳にした（ratio や rate を en.term にすると件数で ① になり「決まった言い方がない」にならない）
4. aas-congruence の en.alt を angle-angle-side とした
5. 平方根の改名で、fix_phase1.py を全部やり直す代わりに台帳を 1 行ずつ手で直した（やり直すと既にエントリのある行の source 列が動く）

## F. 怪しい点（Phase 5 の監査へ）

- **3 の規則で、書き言葉 ① そのものも 1 ソース頼みの語がある**: rectangular-prism（書き言葉 ① rectangular box はほとんど OpenStax Calculus。中学・Geometry の教材 IM・CK-12 は rectangular prism）、lateral-area（lateral surface area はすべて OpenStax Calculus）、constant-of-proportionality（constant of variation は OpenStax の Algebra 2 冊。IM Grade 7・8 は constant of proportionality を glossary の見出しに）。規則どおりにしたが、中学の語としては話し言葉・IM の言い方のほうが教室に近い。「書き言葉 ① も 1 ソース頼みなら当てない」を足すかどうかは判断してほしい
- direct-proportion（比例、名詞）の en.term が動詞句 is proportional to になった（CED topic 7.8 の 1 件で決まった）
- 本文の件数を外した書き直しは 8 人の書き直し役の仕事で、全部を一文ずつ読んだわけではない（抜き取りで読み、check スクリプトと validate の警告 0 で確かめた）。候補表現でない言い方（on the number line・vertex form ほか）は古い件数から「少ない」「よく出てくる」と書いた
- 件数の警告は発見的なので、参照の名前と「件」を含む文に用例コーパスの件数が混ざっていても見逃す。「OpenStax の 6 冊」のように書き言葉コーパスが 9 冊になる前の書き方が残っている文がある（件数ではないので直していない）
- バッチ 6 のコミットは test の失敗を見落としていた（6f20658 で直した）。バッチ 5 の前は STYLE を読み直すコマンドを明示的に打っていない（バッチ 4 の後・6 の前には読んだ）
- midsegment-theorem は level 中3 だが、台帳の単元は中 2（三角形と四角形）のまま
- converse-of-the-inscribed-angle-theorem は米国の教材での扱いを確かめていない（人間レビュー行き）
- K12 LibreTexts の CK-12 Geometry は 2.13・2.14 が無い（前回のまま）

## G. 残りの行数と次のセッション

**台帳全体の残り: 1,540 行中 81 行**（エントリ 1,459）。中1 4・中2 3・中3 14・US と数B 60。

次のセッションで同じ指示から再開するときは、1〜4 は済んでいる。バッチ 7 から:
1. `corpus/drafts/phase2-middle/` の手順（候補一覧 → probe --decide → spec.py → words-N.md → 下書き役 → 読んで直す → build_entries.py → sync_refs.py → corpus:count → corpus:decide -- --write → register の突き合わせ）。scratchpad のパスは使うたびに直す（ledger_json.py・gen_probe.ts）
2. 残りの 81 行は order.py の順（中3 の残り・Algebra 1／2・Pre-Algebra・Integrated Math・数B）。新しい TERM_FORMS は文脈を見てから足す（複数形だけの形、a ＋名詞の形は語形変化で別の語に畳まれる）
3. F の 1 つ目（書き言葉 ① も 1 ソース頼みのときの 3 の規則）の判断

## H. 確認

```
pnpm validate                                # terms 1,459、警告 0（件数の警告 1,095 → 0）
pnpm corpus:count && pnpm corpus:decide -- --write
                                             # 主見出し 1,038 ／ 併記 122 ／ 決まった言い方なし 76 ／ 参照 261 ／ 人間が決めた 42 ／
                                             # 判断不能 6（terms 1・phrases 5）／ 不一致 0 ／ 直すこと 0 ／ 1 ソース頼みの規則 37 語（全部規則どおり）
pnpm crosscheck                              # 507 語、一致 507（割合 → Rate (mathematics)。反比例は langlink が節 #Inverse proportionality を指していたので出典を直した）
pnpm exec tsc --noEmit                       # 緑
pnpm spell                                   # 0 件
pnpm test                                    # 130/130（4 ファイル）
pnpm build                                   # 緑。1,459 ページ。export: terms.json 1,448（draft 11 を除く）
```

## I. 検索索引の id の衝突（6f20658）

バッチ 6 で terms/square-root（平方根）を作ったところ、`scripts/build-index.ts` が terms・symbols・phrases・conventions を裸の id で索引に入れるので、symbols/square-root（√ の読み）とぶつかり、`tests/search.test.ts` が落ちた。バッチ 6 のコミットのとき、テスト結果の行を grep で拾った「Tests 120 passed」だけを見て、「Test Files 1 failed」を見落とした。平方根を `square-root-of-a-number`（square-shape・cube-solid と同じ名付け）に改名し、validate に「2 つのコレクションで同じ id はエラー」を足した。
