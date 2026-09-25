# Phase 2 レポート — 人間が決めた印・残った ③・同形語の直しと、数II（代数・三角・指数対数・図形と方程式）と Precalculus の単元（174 語）

作成: 2026-09-24 ／ 対象: 42c069d（Phase 2 series report）→ 本コミット
指示: audits/phase2-series-report.md を受けて 1〜3 を直し、4 で 数II 三角関数・指数関数と対数関数・式と証明・複素数と方程式・図形と方程式と us-precalculus の全単元に進む。判断は `docs/DECISIONS.md` の「Phase 2 代数 2・Precalculus の単元の前の修正」（8 行）と「Phase 2 代数 2・Precalculus の単元」（31 行）。

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified に上げた語はない。

## まとめ

- **1. reviewed.human を使うのをやめた**（A）。人間が ③ の見出しを決めた印は flag の `corpus-human-settled`（note に日付と DECISIONS の行）だけにした。decide はこの flag を書き直さずに残し、話・書とも ③ の語では規則 1・2 より先に人間の決定として扱う。前回 reviewed.human を入れた 4 語は null に戻した
- **2. 残った ③ をあなたの決定どおりにした**（B）。5 語に corpus-human-settled を付けた。nth-roots-of-unity は「1の冪根」→ Root of unity を crosscheck で確かめて likely に上げた。am-gm-inequality の level.us はスキーマの範囲で空にできた（止める必要はなかった）
- **3. validate に同形語の許可リストを足した**（C）。divergence のほか、生成中に出た 3 組（相加平均 ／ 等差中項、相乗平均 ／ 等比中項、真数 ／ 偏角、増減表 ／ 符号図）も入れた。**validate の警告は 0**
- **4. 数II・Precalculus の単元に進んだ**（D〜F）。台帳の 275 行に今までの規則を先に当てて **174 エントリ ＋ symbols 1** にし、50 ／ 50 ／ 50 ／ 24 の 4 バッチで生成・検証・コミットした。**likely 172 ／ draft 2**。③（人間レビュー行き）は **2 ／ 3 ／ 1 ／ 0 語**（4.0% ／ 6.0% ／ 2.0% ／ 0%）で、1 割を超えたバッチはない。英語に決まった言い方がない 11、参照で見出し 22、register 不一致 0。台帳は 2,199 行 → 2,082 行
- 生成中に数え方の穴を 3 つ見つけて直した（G）: 語幹が語末の ss を落としていた（compress と compressed が合わない）、字幕と OpenStax のハイフンの違い 2 つ（change of base、row echelon）。どれも既存のエントリの件数は変わらない
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて緑（validate 警告 0、spell 0 件、test 88/88、build 553 ページ、export の terms は 542 件＝draft 4 件を除く）。crosscheck 179/179 一致

## A. reviewed.human をやめ、corpus-human-settled だけにした（指示 1）

| 変更 | ファイル |
|---|---|
| `humanSettled`（reviewed.human を読む）を `humanFlag`（flag corpus-human-settled を読む）に替えた | `scripts/corpus/decide.ts` |
| flag の書き直しで `corpus-` で始まるものを消すとき、corpus-human-settled だけは残す（手で書いた note をそのまま保つ） | 同 |
| 話・書とも ③ でこの flag があれば、規則 1（決まった言い方なし）・規則 2（CED ／ OpenStax）より先に人間の決定とする。規則だけならどうなるかはレポートに並べる | 同 |
| flag があるのにコーパスで決まるようになった語は「人間が見出しを決めたが、今はコーパスで決まるもの」の節に出す（flag は消さない） | 同 |
| 4 語（number-of-real-solutions・prime-notation・find-the-inflection-points・convergence-of-improper-integrals）の reviewed.human を null に戻した | data/terms |

人間の決定を規則より先にしたのは、locus と squeeze が mapping near で全候補 10 件未満なので、規則 1 を先にすると「英語に決まった言い方がない」になり、あなたの決定と食い違うため。convergence-of-improper-integrals には flag を付けていない（新しい見出しが OpenStax の本文に当たり、規則 2 で決着しているので、人間の決定を先にすると参照で決まった記録が消える）。

decide の最後の実行: 人間が決めた 8 語（前回の 3 語 ＋ 今回の 5 語）。レポートの「規則だけなら」の列では、locus と squeeze が「英語に決まった言い方がない」、ほかの 6 語は「判断不能」。

## B. 残った ③（指示 2）

| id | あなたの決定 | 実施 |
|---|---|---|
| locus | mapping near、mapping_note | 「米国の高校・OpenStax はほぼ locus と言わず、the set of all points … such that … と書く」に件数を添えた: locus は話・書とも 0 件、the set of all points は書き言葉 31 件（OpenStax Algebra and Trigonometry 18・Calculus Volume 3 10・Volume 2 3）・話し言葉 3 件。pitfalls の同じ件数の文は消した |
| nth-roots-of-unity | 「1の冪根」を crosscheck | ja.wikipedia「1の冪根」の en langlink は Root of unity で一致。wikipedia-langlink を出典にして likely に上げ、draft-reason と editorial の出典を外した |
| argument-of-a-complex-number | pitfalls に「関数の引数も argument」 | pitfalls の先頭に足した（偏角の意味では the argument of z と何の argument かを添える、真数も argument）|
| squeeze | mapping near、mapping_note | 「英語に決まった動詞はない。ふつうは定理の名前 squeeze theorem で言う」に件数を添えた: squeeze theorem 話 15 ／ 書 13、squeeze … between 1、sandwich … between 4 |
| am-gm-inequality | level.us を外す、mapping_note | level.us を空の配列にした（スキーマは us を必須にするが要素数の下限はない）。サイトは空のとき「米国 —」と出す。mapping_note に「米国の高校課程（OpenStax 6 冊・CED）には出てこない」 |
| phrases 5 件 | Phase 3 まで corpus-undecided | 変えていない |

5 語すべてに corpus-human-settled（note: 見出しは人間が決めた（2026-09-24。docs/DECISIONS.md「Phase 2 代数 2・Precalculus の単元の前の修正」の、残った ③ を人間が決めた行））を付けた。register は主張しない。

am-gm-inequality は mapping exact のまま mapping_note を持つので、validate の「exact なのに note がある」警告が出る。あなたの決定の文言「米国の高校課程（OpenStax 6 冊・CED）には出てこない」を、「本プロジェクトの訳語」と同じく許す決まった文言として validate に入れた（DECISIONS）。

## C. 同形語の許可リスト（指示 3）

`scripts/validate.ts` の `SAME_EN_TERM`（id の組）に入っている組は、en.term が重なっても警告しない。1 組 1 行で、理由をコメントに書く。

| 組 | 日本語 | 英語 | いつ |
|---|---|---|---|
| divergence ／ divergence-vector | 発散（数列・級数）／ 発散（ベクトル場） | divergence | 指示 3 |
| arithmetic-mean ／ arithmetic-middle-term | 相加平均 ／ 等差中項 | arithmetic mean | バッチ 1 |
| geometric-mean ／ geometric-middle-term | 相乗平均 ／ 等比中項 | geometric mean | バッチ 1 |
| argument ／ argument-of-a-complex-number | 真数 ／ 偏角 | argument | バッチ 3 |
| sign-chart ／ sign-chart-inequality | 増減表 ／ 符号図（不等式） | sign chart | バッチ 3 |

どれも「同じ英語でも別概念なら別 id」（Phase 1）の組で、互いに related で結んだ。

## D. 台帳の振り分け（275 行 → 174 エントリ ＋ symbols 1）

`scripts/ledger/fix_decisions.py` の PHASE2D_* を `fix_phase1.py` の手順 11 が適用する。消した id は `ledger/id-changes.csv` に残る（117 行: merged-into 100（うち symbols への 1 行は new_id が symbols/combination-ncr）、to-phrases 17）。

### D-1. 同じ概念（12 行）
comparing-coefficients → compare-coefficients、reducing-a-fraction → reduce、**finding-a-common-denominator → find-a-common-denominator（既存）**、**partial-fractions → partial-fraction-decomposition（既存）**、long-division → polynomial-division、verifying-identities → proving-an-identity、polynomial-equation-of-degree-n → polynomial-equation-of-higher-degree、standard-form-of-a-circle → equation-of-a-circle、**increasing → is-monotonically-increasing（既存）**、**trigonometric-form-of-a-complex-number → polar-form（既存）**、**finding-an-inverse → find-the-inverse（既存）**、**area-under-a-curve → area-under-the-curve（既存）**

名詞と動詞で英語の候補が同じ行（約分 ／ 約分する、通分 ／ 通分する、係数比較 ／ 係数を比較する）は、differentiate と find-the-derivative と同じ理由で 1 つにした。

### D-2. 節の名前（26 行）
operations-with-rational-expressions → rational-expression、absolute-value-and-inequalities → triangle-inequality、arithmetic-of-complex-numbers → complex-number、solutions-of-a-quadratic-equation → quadratic-formula、real-and-nonreal-solutions → imaginary-solution、graphs-of-trigonometric-functions ／ maximum-and-minimum-of-trigonometric-functions → trigonometric-function、symmetry-of-functions → even-function、product-to-sum-and-sum-to-product → product-to-sum-formulas、graphs-of-inverse-trig-functions ／ composition-with-inverse-trig → inverse-trigonometric-function、extending-the-exponent → laws-of-exponents、graph-of-an-exponential-function → exponential-function、definition-of-a-logarithm → logarithm、graph-of-a-logarithmic-function → logarithmic-function、applications-of-exponentials-and-logs → exponential-model、graphing-rational-functions → rational-function、magnitude-and-direction → vector、graphs-of-polar-equations → polar-equation、focus-and-directrix → focus、major-and-minor-axes → major-axis、intuitive-definition-of-a-limit → limit、finding-limits-numerically ／ graphically → find-the-limit、limit-definition-of-the-slope → tangent-problem、factoring-over-the-complex-numbers（二次式の因数分解）→ relationship-between-roots-and-coefficients

### D-3. 引数を入れただけの行・問いの形・コロケーション（61 行）
主なもの: find-the-locus ／ equation-of-the-locus ／ set-of-points-satisfying-the-condition → locus、take-the-conjugate → complex-conjugate、cube-roots-of-unity ／ omega → nth-roots-of-unity、nth-roots-of-a-complex-number → nth-root、eliminate-the-parameter ／ eliminating-the-parameter → parameter、foci-of-an-ellipse → focus、classify-the-solutions → discriminant、write-as-a-square → completing-the-square、sum-of-the-roots ／ product-of-the-roots → relationship-between-roots-and-coefficients、proving-an-inequality（不等式の証明）→ prove、the-argument-must-be-positive（真数条件）→ argument、compare-the-exponents ／ compare-the-arguments → compare、find-tan-theta → tangent、solve-for-theta → solve-for、shift-the-graph-horizontally → phase-shift、shade-the-region → sketch、tangent-to-a-circle ／ equation-of-the-tangent-line → tangent-line。一覧は fix_decisions.py の PHASE2D_INSTANCE。

### D-4. 前回の単元・前の単元の行
- **前回先に生成した行と同じ単元に残る行**（あなたの指示）: center-of-rotation（中1 平面図形）→ rotation。find-the-locus → locus、take-the-conjugate → complex-conjugate は D-3 のとおり今回の単元の行
- **寄せ先としてこの単元で生成した前の単元の行 15**: solution・solve・solve-for・remainder・prove・tangent・tangent-line・point-of-intersection・distance・point-of-internal-division・perpendicular-bisector・reflection・symmetric・triangle-inequality・vector（中1〜数A・数C の行。今回の単元の行を寄せる先がこれらだった）
- symbols へ 1: combination-notation → **combination-ncr（新設）**
- phrases 候補へ 17: squares-are-nonnegative、take-the-difference-of-the-two-sides、left-side-minus-right-side、form-the-difference、the-equation-holds、what-we-want-to-show、involves-imaginary-numbers、one-of-the-solutions-is、the-other-solutions、as-p-moves、conversely、relation-between-x-and-y、rewrite-the-expression、on-the-interval-from-0-to-2、the-value-of-sine-theta、the-base-is-greater-than-1、the-domain-is-the-positive-reals

既存のエントリに寄せた行は、ja.alt・level・pitfalls・例文だけを足した（件数に効くコロケーションは足していない）: find-a-common-denominator（数II）、partial-fraction-decomposition（ja.alt 部分分数、数II）、is-monotonically-increasing（ja.alt 単調増加・右上がり、中2）、nth-roots-of-unity（ja.alt 1 の 3 乗根、数II、ω の例文）、complex-conjugate、rotation。curriculum の term_refs には新しい単元の分も足した。

## E. 生成語数と判定

| | 語数 | likely | draft | ③ | 決まった言い方なし | 参照で見出し | register 不一致 |
|---|---|---|---|---|---|---|---|
| バッチ 1（d35eb94） | 50 | 50 | 0 | 2 | 5 | 4 | 0 |
| バッチ 2（d9ed8aa） | 50 | 49 | 1 | 3 | 4 | 7 | 0 |
| バッチ 3（231598b） | 50 | 50 | 0 | 1 | 2 | 9 | 0 |
| バッチ 4（3d5204e） | 24 | 23 | 1 | 0 | 0 | 2 | 0 |
| 計 | **174** | **172** | **2** | **6** | **11** | **22** | **0** |

（バッチ 1 の決まった言い方なし 5 は、レポートを書く前の見直しで直した substituting-values を含む。H を参照。）

判定（174 語 × 2 register）: 話し言葉 ① 81・首位だけ ① 1・② 12・③ 80 ／ 書き言葉 ① 113・首位だけ ① 2・② 10・③ 49。①→② はなし。1 ソース頼みの記録 102 判定。コーパスに 1 件も出ない語が 14。

draft 2: triple-angle-formulas（英語は固有の名前だが OpenStax にも Wikipedia にもなく 0 件）、inductive-step（MIT 6.042 だけ、base-case と同じ）。

symbols/combination-ncr は読み n choose r を n choose * の形（上が n）で数えて話し言葉 ①（唯一）。

## F. ③・決まった言い方なし・参照で見出し

### F-1. ③（人間レビュー行き、6 語）

| id | 見出し（ja ／ en） | mapping | 話 | 書 | 見立て |
|---|---|---|---|---|---|
| multinomial-theorem | 多項定理 ／ multinomial theorem | exact | 0 | 2 | MIT の講義ノートに 2 件だけ。Wikipedia で likely |
| cauchy-schwarz-inequality | コーシー・シュワルツの不等式 ／ Cauchy-Schwarz inequality | exact | 0 | 0 | OpenStax 6 冊にも 0 件。Wikipedia で likely |
| linear-programming | 線形計画法 ／ linear programming | exact | 0 | 0 | OpenStax Algebra and Trigonometry は feasible region（9 件）を使うがこの名前は 0 件 |
| apollonian-circle | アポロニウスの円 ／ Apollonian circle | exact | 0 | 0 | 台帳の near は「米国の高校では扱わない」（範囲）だったので exact にした（DECISIONS）|
| triple-angle-formulas | 3 倍角の公式 ／ triple-angle formulas | exact | 0 | 0 | draft |
| polynomial-inequality | 多項式不等式 ／ polynomial inequality | exact | 0 | 0 | 日本語は本プロジェクトの訳語（高次不等式は ja.alt）|

これで decide の判断不能は 11 件（上の 6 語と phrases 5）。

### F-2. 英語に決まった言い方がない（11 語）
内分点・数値代入法・等号成立・複素数の相等・解と係数の関係（バッチ 1）、円と直線の位置関係・2 円の交点を通る円・三角関数の合成・三角不等式（バッチ 2）、指数不等式・対数不等式（バッチ 3）

解と係数の関係は Wikipedia の記事名が Vieta's formulas だが、用例コーパス・OpenStax・CED のどれにも出ない。規則 1 のとおり「英語に決まった言い方がない」とし、mapping_note に Vieta's formulas のことを書いた。

### F-3. 参照で見出しを決めた（22 語）

| id | 見出し | 根拠（OpenStax の本文の件数）|
|---|---|---|
| perpendicular-bisector | perpendicular bisector | 1 |
| compare-coefficients | equate coefficients | 6（Calculus Volume 2）|
| triangle-inequality | triangle inequality | 6 |
| square-root-of-a-negative-number | square root of a negative number | 9 |
| cubic-equation | cubic equation | 1 |
| quartic-equation | fourth-degree equation | 2 |
| distance-from-a-point-to-a-line | distance from a point to a line | 3 |
| general-form-of-a-circle | general form of the equation of a circle | 1 |
| degree-measure | degree measure | 3 |
| quadrantal-angle | quadrantal angle | 6 |
| compress-horizontally | compress (…) horizontally | 5 |
| argument（真数）| argument of the logarithm | 4 |
| number-of-digits | number of digits | 2 |
| grow-exponentially | grow exponentially | 6 |
| rewrite-in-exponential-form ／ logarithmic-form | in exponential form ／ in logarithmic form | 9 ／ 5 |
| composition-of-transformations | combining transformations | 3 |
| expanding-and-condensing-logs | expand the logarithm | 3 |
| ambiguous-case | ambiguous case | 7 |
| area-formula-with-sine | area of an oblique triangle | 7 |
| vector-projection | vector projection | 9 |
| feasible-region | feasible region | 9 |

CED で見出しが決まった語はない（今回の単元はほぼ AP Calculus の範囲外）。

## G. パイプラインの変更

| 変更 | ファイル | 理由 |
|---|---|---|
| corpus-human-settled の読み方（A） | `decide.ts` | 指示 1 |
| 同形語の許可リスト、exact の note の決まった文言 | `validate.ts` | 指示 2・3 |
| level.us が空のとき「米国 —」 | `src/pages/terms/[id].astro` | 指示 2（am-gm-inequality）|
| 語幹で語末の ss を落とさない（compress ／ compressed）。テスト 1 件（計 88）| `lib.ts`、`tests/corpus.test.ts` | バッチ 2 の compress … horizontally が 0 件になっていた |
| normalize: change of base → change-of-base、row echelon → row-echelon | `lib.ts` | 字幕はハイフンなし、OpenStax はハイフン付き |
| TERM_FORMS 16 語（solution・remainder・symmetric・tangent・expansion・identity・period・logarithm・argument・work、動詞句 3 つ）| `lib.ts` | 汎用語は最初から形で数える（前回の修正の規則）|
| SYMBOL_PATTERNS: combination-ncr の n choose * | `lib.ts` | we choose u（部分積分）を数えないため |
| 台帳の手順 11（PHASE2D_*）| `fix_phase1.py`、`fix_decisions.py` | D |

語幹と normalize の変更は、counts.json の前後比較で既存のエントリの件数が 1 件も変わらないことを確かめた。

## H. CED と OpenStax で確かめた主張

「米国では〜」の主張は、書く前に corpus:probe（本文の件数とソース）で確かめて、確かめた範囲で書いた（STYLE の追記）。**CED は今回 2 か所だけ**: inverse-trigonometric-function「AP Calculus でも微分する（CED topic 3.3）」と、sign-chart-inequality「CED（Unit 9 の概要）は sign chart を道具として挙げる」。どちらも topic に語が出ることの確認で、文は読んでいない。

OpenStax の本文の件数で確かめた主な主張:

| エントリ | 主張 | 根拠 |
|---|---|---|
| equation-of-a-line | slope-intercept ／ point-slope ／ standard form と呼び分ける | OpenStax Algebra and Trigonometry（前回の conventions と同じ）|
| perpendicular-lines | 傾きの条件を negative reciprocals と言う | 書き言葉 21・話し言葉 13 |
| trigonometric-identities | 1 + tan²θ = sec²θ と secant で書く | OpenStax Algebra and Trigonometry |
| rational-expression | 定義されない値を excluded values と呼ぶ | 書き言葉 14 |
| complex-number | a + bi を standard form と呼ぶ | OpenStax Algebra and Trigonometry |
| rational-root-theorem | rational zero theorem と呼ぶ | 書き言葉 22 |
| conjugate-roots | Complex Conjugate Theorem と名前をつける | 本文 3 |
| equation-of-a-circle | 中心 (h, k)、standard form of the equation of a circle | 書き言葉 3 |
| boundary | 実線・点線の描き分け（dashed line） | 話 11 ／ 書 10 |
| amplitude | amplitude・period・phase shift・midline を読む（midline 79 件）| OpenStax Algebra and Trigonometry |
| initial-side | standard position と呼ぶ | 書き言葉 47 |
| area-of-a-sector | (1/2)r²θ がある | OpenStax Algebra and Trigonometry |
| angle-addition-formulas | sum and difference formulas（30 件）| 同上 |
| inverse-trigonometric-function | inverse sine of x と読む（話し言葉 18） | コーパス |
| logarithm ／ common-logarithm | log x は常用対数、ln x は自然対数 | OpenStax Algebra and Trigonometry |
| component-form | 山かっこ ⟨a₁, a₂⟩ で書く | OpenStax Calculus Volume 3 |
| standard-unit-vectors | i, j, k と書く | 同上 |
| vector-projection | proj_b a と scalar projection を呼び分ける（9 件）| 同上 |
| solving-triangles | law of sines ／ law of cosines | 書き言葉 34 ／ 52 |
| distance | distance formula と呼ぶ | 書き言葉 46 |
| constraint | subject to the constraint | 書き言葉 10 |
| augmented-matrix ／ cramers-rule ／ newtons-law-of-cooling | Precalculus で扱う | OpenStax Algebra and Trigonometry（66 ／ 51 ／ 15 件）|

確かめられない主張（「日本の教科書ではあまり使わない」「米国では必ず答えさせる」「受験参考書に多い」「発音」など）は、書いたあとの見直しで消すか、確かめた範囲（学習指導要領に含まれない、OpenStax 6 冊で N 件）に弱めた。日本側について「学習指導要領には含まれない」と書いたもの: 逆三角関数、軸の回転、拡大係数行列、クラメルの公式、ニュートンの冷却法則。

## I. 気になっている点（Phase 5 の監査へ）

- **数値代入法の見出しを最後の見直しで直した**（DECISIONS）。台帳の substituting values が normalize で substitute values になり、公式に値を入れる一般の言い方 17 件を数えて書き言葉 ① になっていた。台帳の暫定の見出しが汎用の句になっている語は、ほかにもこの形の穴があるかもしれない。今回の 174 語は、件数の多い見出しの文脈を手元で見たが、全部ではない
- **前の単元の行 15 語をこの単元で生成した**（D-4）。solve・solution・distance・vector・tangent などの基本語が、数II ／ Precalculus の角度で書かれている。中学・数I の単元を生成するとき、中身の追加が要るかもしれない
- **見出しが件数の少ない側に決まった語**: expanding-and-condensing-logs（③ → OpenStax の expand the logarithm。condense と同数 3 件で、候補の順で expand。見出しが展開の側だけ）、sign-chart-inequality（sign chart は 0 件で CED の名前。話し言葉 ① は sign analysis 11 件で、すべて Professor Leonard）、leading-digit（話し言葉 ① first digit 14 件の多くは位取りの説明で、常用対数の問題ではない）
- **件数に別の文脈が多く混ざる見出し**: region（微積分の囲まれた部分）、orientation（曲面の向き）、phase（MIT 18.03 の振動）、compare（統計の比較）、the remainder is（テイラーの剰余項が少し）、expansion of（級数展開）、row-echelon form の話し言葉（reduced row echelon form の一部）、conjugate roots の書き言葉（すべて 2 階線形微分方程式の特性方程式）。pitfalls に書いた
- **日本語の見出しを台帳から変えた語**: decreasing（右下がり → 単調に減少する）、proving-an-identity（等式の証明 → 等式を証明する、pos phrase）、compare-coefficients（係数を比べる → 係数を比較する）、standard-unit-vectors（単位ベクトル i, j → 基本ベクトル）、vector-projection（ベクトル射影 → 正射影ベクトル）、rotated-conics（回転した円錐曲線 → 座標軸の回転）、cardioid（心臓形 → カージオイド）、triangle-inequality（ja.alt に「三角不等式」。trigonometric-inequality の ja.term と同じ語が別の意味で残る）
- **id と en.term が離れた語**: reduce（cancel the common factor）、substituting-values（plug in convenient values）、leading-digit（first digit）、undo-the-log（exponentiate）、general-angle（coterminal angles）、rotated-conics（rotation of axes）、orthogonal-projection（projection）。id は related・term_refs・台帳が動くので変えていない
- **mapping を台帳から付け直した語**: 米国側の語で日本語に名前がないものは exact ＋「本プロジェクトの訳語」にした（none のままだと規則 1 が「英語に決まった言い方がない」と誤る）。台帳の near が範囲の違いを表していた語（apollonian-circle ほか）は exact にし、範囲は pitfalls に書いた。一覧は DECISIONS
- **規則 1 は OpenStax の名前を見ない**。CED が候補を使う語は規則 1 から外れるが、OpenStax だけが名前をつける語（conjugate-roots の Complex Conjugate Theorem など）は外れない。今回は mapping を語の対応で付け直したので該当する語はなかったが、将来 near の語で OpenStax だけに名前があれば「決まった言い方がない」になる
- **corpus-human-settled は flag なので、その語は verified に上げられない**（validate は verified の語に flag を許さない）。決定の印を flag に置いたことの帰結。前回までの corpus-reference-fallback ／ corpus-no-fixed-expression と同じ扱い
- **imaginary-solution の見出し complex solution** は、英語では実数解を含むことがある。mapping near で書いた
- 文脈を手元で表示して読んだ（前回と同じ。表示は端末だけで、ファイルには残していない）

## J. DECISIONS に足した行

`docs/DECISIONS.md` の「Phase 2 代数 2・Precalculus の単元の前の修正」8 行と「Phase 2 代数 2・Precalculus の単元」31 行。

## K. 確認

```
python3 scripts/ledger/fix_phase1.py         # 手順 11: same 12 ／ section 26 ／ instance 61 ／ symbols 1 ／ phrases 17
pnpm corpus:count && pnpm corpus:decide -- --write --ids <各バッチの語と、書き直した既存の語>
                                              # 最後の実行: 主見出し決着 423 ／ 併記 73 ／ 決まった言い方なし 25 ／ 参照で見出し 63 ／ 人間が決めた 8 ／ 判断不能 11 ／ 不一致 0 ／ エントリ側で直すこと 0
pnpm crosscheck -- --write                   # 179/179 一致（新しい 49 タイトルをバッチごとに 4 回で取得、残りは cached）
pnpm exec tsc --noEmit                       # 緑
pnpm validate                                # terms 546 / symbols 8 / phrases 5 / conventions 3 / curriculum 165、警告 0
pnpm spell                                   # 734 ファイル、0 件
pnpm test                                    # 88/88
pnpm build                                   # 553 ページ、export: terms.json 542（draft 4 を除く）
```

取得は Wikipedia の langlink だけで、crosscheck.ts の既存の作法どおり、まとめて（50 タイトル／リクエスト）、タイムアウト 30 秒・リトライ 3 回（429 は Retry-After）、進捗は done/total、キャッシュ（corpus/cache/crosscheck.json）して足りない分だけ取った。CED・OpenStax・用例コーパスは取得済みのものを使い、新しい取得はしていない。
