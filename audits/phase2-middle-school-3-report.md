# Phase 2 レポート（中学の単元 3）— 1〜5 を直し、台帳の残り 81 行（バッチ 7・8）を生成した

作成: 2026-09-25 ／ 対象: 58c400d（中学の単元 2 のレポート）→ 本コミット
指示: audits/phase2-middle-school-2-report.md を受けた 1〜7。判断は `docs/DECISIONS.md` の「Phase 2 中学の単元 3 の前の修正」と「Phase 2 中学・Algebra 1／2・Pre-Algebra・Integrated Math・数B の単元 3」。
7（Phase 2 のまとめ）は別のファイル `audits/phase2-final-report.md` に書いた。

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified に上げた語はない。

## まとめ

- **1〜5 はすべて終えた**（8b4e93c）。1 の規則を全語に当てて **13 語の en.term が変わった**（中学 3・微積分ほか 10）。指示にあった 3 語のうち **constant-of-proportionality は変わらない**（書き言葉の首位が OpenStax の 2 冊に分かれていて、指示の定義の「1 ソース頼み」に当たらない。B-1）
- **6（生成）はバッチ 7・8 の 81 語**（ee3dfc5・8178125）。likely 80 ／ draft 1。人間レビュー行きの ③ は **バッチ 7 で 1 語（2%）、バッチ 8 で 0 語**。1 割を超えたバッチはない
- **台帳の残りは 0 行**（1,540 行すべてにエントリ）。Phase 2 のまとめは `audits/phase2-final-report.md`
- 途中で validate が id の衝突（terms と conventions の slope-intercept-form）を止めた。5 の規則どおり終了コードで判定し、直してからコミットした（C-2）
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて終了コード 0（F）

## A. 1〜5 の結果

### 1. 書き言葉の首位も 1 ソース頼みのとき

`lib.ts` に `levelReferenceOf`・`levelReferenceHead` を足し、`spokenLeanHead` に level を渡した（単体テスト 5 つ）。話し言葉の首位が 1 ソース頼みで、書き言葉 ① も 1 ソース頼み（件数の最も多いソースを抜くと ③ か別の候補が首位）なら、書き言葉では決めず、level の参照の言い方にする。

- level の読み方: level.jp に中1〜中3 → IM、なければ level.us の Geometry → CK-12 と IM（同じ段）、なければ AP Calculus AB／BC・AP Statistics → CED。この順に最初に当たるもの。ほかの level（Precalculus・Algebra・Calculus I〜III・大学）には参照を当てない（指示の 3 つに限った）
- 参照の言い方は、その参照が最も多く使う候補（本文・節の名前・glossary を合わせる）。同点なら決まらない。ただし box plot ／ boxplot のように同じ箇所を 2 回数えた同点は、候補の順の先を採る
- 参照が決まらないか、参照が話し言葉の首位と同じ言い方なら、話し言葉の首位のまま

**当てはまる語 16（variable-of-integration を外した後は 15）。en.term を変えた 13 語:**

| id | 変更 | 理由 |
|---|---|---|
| rectangular-prism | rectangular box → **rectangular prism** | 書き言葉 ① は OpenStax Calculus 頼み。IM も rectangular prism |
| lateral-area | lateral surface area → **lateral area** | 書き言葉 ① は OpenStax Calculus 頼み。IM は候補を使わない（CK-12 は lateral area だが、中学の語なので IM だけを見る） |
| significant-figures | significant digits → **significant figures** | 書き言葉 ① は OpenStax Calculus 頼み。IM は候補を使わない |
| arctangent | inverse tangent → **arctangent** | 書き言葉 ① は OpenStax Algebra and Trigonometry 頼み。CED は候補を使わない |
| change-the-limits-of-integration | → **change the bounds** | 書き言葉 ① は OpenStax Calculus 頼み。CED は候補を使わない |
| corner-nondifferentiable | sharp corner → **sharp turn** | 同上 |
| derivative-of-a-vector-function | → **derivative of a vector function** | 同上 |
| differentiate-both-sides | → **take the derivative of both sides** | 同上 |
| evaluate-the-integral | → **compute the integral** | 同上（話し言葉の首位は MIT 18.02 頼み） |
| find-the-equation-of-the-tangent-line | find an equation … → **find the equation of the tangent line** | 同上 |
| hyperbolic-functions | → **hyperbolic trig functions** | 書き言葉 ① は OpenStax Calculus 頼み。Calculus I だけの語で参照なし |
| substitute-new-variable | make the substitution → **make a substitution** | 書き言葉 ① は OpenStax Calculus 頼み。IM（中3）は候補を使わない |
| trigonometric-substitution | → **trig substitution** | 書き言葉 ① は OpenStax Calculus 頼み。Calculus II だけの語で参照なし |

前の見出しは register written（話し言葉 ② にも入る言い方は both）の variant にし、en.register を spoken にした。本文の「見出しは…」の文と例文を合わせた（rectangular-prism・lateral-area・significant-figures・hyperbolic-functions・evaluate-the-integral・substitute-new-variable。ほかに line-of-intersection・slant-height の例文の rectangular box ／ lateral surface area も直した）。

**変えなかった語:**
- box-plot（書き言葉も 1 ソース頼みだが、IM Grade 6 の glossary が box plot で今の見出しと同じ）、interquartile-range（IM は IQR で今の見出しと同じ）
- **constant-of-proportionality**: 書き言葉の首位 constant of variation は OpenStax Elementary Algebra と Algebra and Trigonometry の 2 冊に分かれていて、多い方を抜いてももう 1 冊で首位のまま。指示の定義に当たらないので constant of variation のまま。「OpenStax の複数の本を 1 つのソースと数える」なら当たり、IM と同じ constant of proportionality になる（B-1）
- variable-of-integration: 規則では話し言葉の首位 dummy variable が見出しになるが、dummy variable は「見かけの変数」（Σ の添え字にも使う広い語）で積分変数の別名ではないので、候補から外して pitfalls に書いた。数え直すと話し言葉も variable of integration が首位で、規則に当たらない

### 2. direct-proportion（比例）

IM Grade 7 の glossary の見出しは **proportional relationship**（Grade 7・8 には constant of proportionality も）と確かめた。en.term を proportional relationship（register spoken。話し言葉 ② の首位）にし、variants は varies directly・direct variation（both）。**is proportional to は候補から外し、例文（written）と mapping_note に回した**。variant に置くと候補として数えられ、CED topic 7.8 の 1 件で見出しの規則がまた is proportional to を指すため（CED の用例は微分方程式の「変化率が y に比例する」で、名詞の比例の呼び方ではない）。

### 3. converse-of-the-inscribed-angle-theorem（円周角の定理の逆）

en.term はそのまま。mapping_note に「米国の教材（CED・OpenStax・IM・CK-12）には出てこない（4 つとも 0 件）。CK-12 Geometry と IM Geometry は円周角と円周角の定理は扱うが、その逆は扱わない」と書いた（参照の本文を converse と inscribed angle の近さでも探して 0 件）。flags を corpus-human-settled にし（register は主張しない）、人間レビューの一覧から外した。

### 4. PLAN Phase 4

用語ページに「mapping none の語のうち、en.term が英語の用語ではなく本プロジェクトの説明の訳の語には『説明の訳（英語の用語ではない）』の印を付けて表示する。検索結果・一覧・書き出し（Anki・PDF）でも同じ印を付ける」と足した。対象はデータから機械的に決まる形にした: **mapping none で flags に corpus-no-fixed-expression がある語（今 14 語）**。mapping none の 30 語のうち、米国の用語が元の語（PEMDAS・two-column proof・CPCTC ほか 14 語。ja が本プロジェクトの訳語）と、英語の用語をそのまま見出しにした LIATE・sign chart には付けない。

### 5. CLAUDE.md

絶対ルール 11: 「テスト・検証（tsc・validate・spell・test・build・crosscheck）の合否は終了コードで判定する。出力を grep・tail・head で絞って合否を読まない。`cmd > log 2>&1; echo "exit=$?"` のように終了コードを必ず表示し、0 でなければコミットしない」。このセッションの検証はすべてこの形で回した。

## B. 1 の当てはめで判断が要るもの

1. **constant-of-proportionality**（A-1）。指示の定義どおりなら変わらない。変えるなら「OpenStax の本はまとめて 1 ソース」と数える（1 ソース頼みの判定全体に効く）か、この語だけ人間の決定にする
2. **微積分の語 10 語**（A-1 の表の下 10 行）。微積分の書き言葉はほぼ OpenStax Calculus だけなので、この規則に当たりやすい。AP の語は CED が候補を使わず、大学の語は参照がないので、話し言葉の 1 ソース（Khan Academy・MIT OCW・Professor Leonard）の言い方が見出しになった（compute the integral、take the derivative of both sides、sharp turn ほか）。STYLE は微積分の第一基準を OpenStax Calculus としているので、「Calculus I〜III の level の参照は OpenStax Calculus」と足せば前の見出しに戻る。指示の 3 つに限ったので足していない

## C. 生成（6）

### C-1. バッチ

| バッチ | 範囲（order.py の順） | 語数 | 参照で見出し | 決まった言い方なし | 人間レビュー（③） |
|---|---|---|---|---|---|
| 7 | 中3 三平方の定理・Pre-Algebra・Algebra 1・Algebra 2 の前半（1〜50 行） | 50 | 13 | 0 | 1（2%） |
| 8 | Algebra 2 の残り・Integrated Math 1 の統計・数B の経験則（51〜81 行） | 31 | 6 | 0 | 0 |
| 計 | | **81**（likely 80 ／ draft 1） | 19 | 0 | **1** |

- 手順（前のレポート G）: 候補一覧を全部のコーパスで probe（バッチ 7 は 2 回）→ spec.py で見出し・register を決める → 事実欄 words-N.md → 下書き役（バッチ 7 は 5 人、8 は 3 人）→ 全部読んで直す → build_entries.py → sync_refs.py → corpus:count → corpus:decide（直すこと 0・不一致 0 を確かめる）→ `-- --write` → en.register を probe の判定と突き合わせるスクリプト（81 語すべて一致）。各バッチの前に STYLE を読み直した
- **参照で見出し（19）**: CK-12 5（converse-of-the-pythagorean-theorem・30-60-90-triangle・pythagorean-triple・shortest-distance・pemdas）、IM 2（45-45-90-triangle → isosceles right triangle、area-model → area diagram）、OpenStax 8（バッチ 7 の space-diagonal → diagonal of a rectangular prism・literal-equation・standard-form-of-a-line → standard form of a linear equation・independent-system・prime-polynomial・transformations-of-functions → transformations of the graph と、バッチ 8 の joint-variation・continuous-compounding）、AP Statistics の CED 4（バッチ 8 の randomization・one-variable-data・two-variable-data → bivariate data・conditional-relative-frequency）
- **人間レビュー行き（1）**: quadratic-regression。用例コーパス・参照・Wikipedia とも 0 件。確かめられる出典もないので confidence draft（draft-reason 付き）
- **TERM_FORMS に 9 語の形**（文脈を 10 件ずつ見た）: legs・convert・residual・standard-form-of-a-line・space-diagonal・prime-polynomial・multiplicity・experiment・secant
- **候補から外したもの**: MAD（話し言葉の大半が「怒る」の mad）、shortest path（グラフ理論の最短経路）、nonlinear system（話し言葉はすべて MIT 18.03 の連立微分方程式）、rule of signs（同じ箇所の二重数え）、quadratic form（線形代数の二次形式と同じ語）、family of functions（別の概念）。どれも pitfalls に書いた
- **名詞のエントリの候補は名詞句だけにした**: joint-variation の varies jointly、continuous-compounding の compounded continuously ／ continuously compounded は、コーパスではこちらが首位だが動詞句・分詞句なので pitfalls に回した（2 の is proportional to と同じ扱い。見出しの規則が分詞句を en.term にするよう指したため）
- **ja を台帳から変えた語 15**（直角二等辺三角形・単利・分数方程式・重複度・正弦曲線ほか）、**mapping を変えた語 9**（order-of-operations・radical-equation・extraneous-solution・multiplicity・slant-asymptote・rational-equation を exact に、point-slope-form を none から near に、convert を near に、simple-interest を exact に）。一覧と理由は DECISIONS
- 見出しの英語が既存の語と同じになった 1 組（general-angle 一般角 ／ coterminal-angle 共終角）を SAME_EN_TERM に足し、互いを pitfalls・related で指した

### C-2. 改名

- **graphing-systems-of-inequalities → system-of-linear-inequalities**: 台帳の行は節の名前（Graphing Systems of Linear Inequalities）。概念の名前にし、1 変数の既存の system-of-inequalities（連立不等式、compound inequality）と区別した
- **slope-intercept-form → slope-intercept-form-of-a-line**: 生成後の validate が、conventions/slope-intercept-form（y = ax + b と y = mx + b の慣習差）と検索索引の id がぶつかるとエラーにした（前回足した検査）。**終了コード 1 を見てコミットせず**、terms 側を改名した。conventions の term_refs から直線の式の 3 つの形を指した
- 台帳は fix_decisions.py PHASE2G_RENAME と、ledger/terms.csv・id-changes.csv の 1 行ずつの手直し（CRLF を保った）

### C-3. 本文の「米国では〜」

事実欄に私が書いた「米国では〜」のうち、参照で確かめていなかったものが本文に入っていた（interval notation を Algebra 1 から使う、piecewise function を端点の ● ○ とあわせて教える、Precalculus で csc・sec・cot を学ぶ、ほか）。b7・b8 の本文から「米国」を含む文を全部抜き出し、OpenStax・IM・CK-12・CED の本文で確かめた範囲の書き方に直した（エントリ 7 語・下書き 6 語）。確かめられなかった「端点の ● ○ とあわせて教える」は削った。dot plot を line plot とも呼ぶのは IM Grade 6 8.1 で確かめて出典に足した。

## D. 決めたこと（指示の外）

1. level の順（中学 → Geometry → AP）と、指示にない level には参照を当てないこと（A-1）
2. 参照の同点で、当たった箇所がまったく同じ 2 つは同じ言い方とする（box plot ／ boxplot）
3. variable-of-integration の dummy variable を候補から外した（別の概念）
4. direct-proportion の is proportional to を variant でなく例文と mapping_note に回した
5. 名詞のエントリの候補は名詞句だけ（joint-variation・continuous-compounding）
6. PLAN Phase 4 の印の対象を「mapping none かつ corpus-no-fixed-expression」と機械的に決めた
7. quadratic-regression を draft にした（出典がない）

## E. 怪しい点（Phase 5 の監査へ）

- **1 の規則で見出しが変わった微積分の 10 語**（B-2）。規則どおりだが、見出しが 1 人の講師・1 つの講義の言い方になった（evaluate-the-integral の compute the integral は MIT 18.02、differentiate-both-sides の take the derivative of both sides は Khan Academy）
- **constant-of-proportionality**（B-1）。中学の語としては IM・話し言葉の constant of proportionality が教室に近いが、規則の上では constant of variation のまま
- **level の参照を当てるのは level の 1 つ目だけ**。substitute-new-variable は level.jp に中3 があるので IM を見て、IM が候補を使わないので話し言葉の首位になった（AP の CED は見ていない）
- **tick-mark の見出し hash mark** は話し言葉 ①（Khan Academy の中学が中心）。書き言葉は ③ なので見出しの規則にも当たらない。教科書（OpenStax Introductory Statistics）の tick mark は en.alt
- **symmetric-distribution の見出し symmetrical distribution** は書き言葉 ①（OpenStax Introductory Statistics だけ）。AP Statistics の CED は symmetric と書くが、書き言葉 ① のときは CED を見ない規則なので変えていない
- **two-variable-data の見出し bivariate data** は CED（2026 年版）の 2 件で決まった。IM は候補を使わない
- **space-diagonal の見出し diagonal of a rectangular prism** は OpenStax Calculus の 1 件で決まった（規則どおりだが根拠は薄い）
- **least-common-denominator の見出しは略語の LCD**（書き言葉 ①。interquartile-range の IQR と同じ）
- 事実欄の段階で確かめずに書いた主張が本文に入った（C-3）。今回は全部洗ったが、前のバッチの本文も同じ形の穴があるかもしれない
- 下書き役が事実欄の外から足した一般的な数学・英語の説明（principal と principle の綴り、Descartes の読み、tan⁻¹ は arctan ほか）は、米国の扱いの主張ではないので残した

## F. 確認（合否はすべて終了コード）

```
pnpm exec tsc --noEmit                       # exit 0
pnpm validate                                # exit 0。terms 1,540、警告 0
pnpm spell                                   # exit 0。0 件（BODMAS・BIDMAS・behaviour・bivariate・arccot を辞書に足した）
pnpm test                                    # exit 0。135/135（4 ファイル。1 の単体テスト 5 を足した）
pnpm build                                   # exit 0。1,539 ページ。export: terms.json 1,528（draft 12 を除く）
pnpm crosscheck                              # exit 0。513 語、一致 513、flag 0
pnpm corpus:count && pnpm corpus:decide -- --write
                                             # 主見出し 1,097 ／ 併記 126 ／ 決まった言い方なし 76 ／ 参照 280 ／ 人間が決めた 43 ／
                                             # 判断不能 6（terms 1・phrases 5）／ 不一致 0 ／ 直すこと 0 ／ 見出しの規則に当たる語 36
```
