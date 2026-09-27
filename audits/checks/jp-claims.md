# 日本側の主張の文（Phase 5 の監査の前の機械の確かめ 2）

作成: 2026-09-27 ／ `pnpm audit:claims`（scripts/audit/claims.ts）

対象の欄: terms の mapping_note・pitfalls・variants の note・definition_ja、symbols の notes、phrases の notes・variants の note。
慣習差（conventions）は jp の欄そのものが日本側の主張で、生成のときに項目ごとに日本側の資料を出典に入れたので、ここには入れない（監査は慣習差の順で見る）。

- phase4-report G-1 の正規表現（日本(の教科書|では|の高校|の授業|の答案|の中学|の入試|の数学|で)）に当たる文: **135 項目・139 文**
- 広い正規表現（日本・数学 I〜C・中学・高校・学習指導要領・教科書・入試・共通テスト・センター試験）に当たる文: **502 項目・682 文**（主張でない文も混じる。監査の ⑦ で 1 文ずつ見る）

| コレクション | id | 欄 | G-1 | 文 |
|---|---|---|---|---|
| terms | aa-similarity | pitfalls[1] |  | 相似の記号は、中学校学習指導要領解説（〔用語・記号〕）では ∽、IM Geometry・CK-12 Geometry では ∼（△ABC ∼ △DEF）。 |
| terms | aas-congruence | mapping_note |  | 見出しの「2 組の角とその間にない 1 辺がそれぞれ等しい」は学習指導要領解説に無い（日本語版 Wikipedia「図形の合同」は AAS をほぼ同じ言い方で挙げる）。 |
| terms | aas-congruence | mapping_note |  | 日本の三角形の合同条件には無い（1 辺とその両端の角が等しい、に帰着する）。 |
| terms | aas-congruence | pitfalls[1] | ○ | 日本の合同条件にはこの形がないので、日本の答案では残りの角も等しいことを示してから「1 組の辺とその両端の角がそれぞれ等しい」を使う。 |
| terms | absolute-extrema | mapping_note |  | ja.alt の「絶対極値」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | accumulation-function | mapping_note |  | 見出しの「定積分で表された関数」は学習指導要領解説に無い。 |
| terms | accumulation-function | mapping_note |  | 後者の「定積分を定数 k とおく」型の問題が米国の教科書にあるかは教科書による。 |
| terms | accumulation-function | mapping_note |  | ja.alt の「累積関数」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | adjacent-angles | mapping_note |  | 用例コーパスでは話し言葉に少しあり（ほとんどが Khan Academy の中学の講義）、書き言葉には出てこない。 |
| terms | adjacent-angles | mapping_note |  | 見出しの「隣接角」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | adjacent-angles | mapping_note | ○ | 日本の教科書はこの 2 つの角の関係に名前をつけない。 |
| terms | algebraic-expression | mapping_note |  | 中学校学習指導要領解説の「文字式」（文字を用いた式）は、文字を使って表した式のこと。 |
| terms | all | en.variants[3].note |  | 話し言葉は半分が Khan Academy の中学の講義で、MIT OCW・Professor Leonard が次ぐ。 |
| terms | all | pitfalls[1] |  | 共通テスト（令和 5・6 年度 数学II 第3問）の「すべての実数 r に対して」は文頭や文中に置くが、用例コーパスの for all x は述語の後ろに置く（f(c) ≥ f(x) for all x in the domain）。 |
| terms | alternate-exterior-angles | mapping_note |  | 見出しの「外錯角」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | alternate-exterior-angles | mapping_note | ○ | 日本の教科書は錯角（内側）だけを扱い、外側の組に名前を付けない。 |
| terms | alternate-interior-angles-theorem | mapping_note |  | 見出しの「錯角の定理」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | alternate-interior-angles-theorem | mapping_note |  | 日本の中2 では「平行線の錯角は等しい」を平行線の性質として扱う。 |
| terms | alternating-series-error-bound | mapping_note |  | 見出しの「交代級数の誤差限界」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | alternating-series-test | mapping_note |  | 見出しの「交代級数判定法」は学習指導要領解説に無い（日本語版 Wikipedia に記事「交代級数判定法」がある）。 |
| terms | alternative-hypothesis | pitfalls[0] |  | 高等学校学習指導要領解説（数学B）は H₁、AP Statistics の CED と OpenStax Introductory Statistics は Hₐ と書く。 |
| terms | am-gm-inequality | pitfalls[0] | ○ | 日本の高校（数II）では最小値を求める定番の道具。 |
| terms | ambiguous-case | mapping_note |  | 見出しの「曖昧な場合」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | ambiguous-case | mapping_note | ○ | 日本の教科書では、2 辺とその一方の対角が与えられたときに三角形が 2 つできる場合を、名前をつけずに扱う。 |
| terms | angle-addition-postulate | mapping_note |  | 見出しの「角の加法公理」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | angle-addition-postulate | mapping_note | ○ | 日本の教科書は ∠AOB + ∠BOC = ∠AOC に名前をつけない。 |
| terms | angle-addition-postulate | pitfalls[0] | ○ | 日本の教科書は ∠AOB = 38° のように同じ記号で大きさも表す。 |
| terms | angle-bisector-theorem | pitfalls[1] |  | 高等学校学習指導要領解説（数学A）は角の二等分線と辺の比の関係を外角の場合も含めて扱い、中学校学習指導要領解説は相似の活用の例としてこの性質の証明を挙げる。 |
| terms | angle | pitfalls[1] |  | 共通テストの問題文は区別せず ∠ABC = 60° のように書く。 |
| terms | antiderivative | mapping_note |  | 学習指導要領解説（数学II・III）には「不定積分」だけが出てきて「原始関数」は出てこない。 |
| terms | apothem | pitfalls[0] |  | 日本の問題で「内接円の半径」と書かれている長さが、英語の apothem にあたることがある。 |
| terms | arc-length | pitfalls[1] |  | 度数法なら 2πr × a/360、弧度法（数II）なら rθ。 |
| terms | arc-measure | mapping_note |  | 見出しの「弧の度数」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | arc-measure | mapping_note | ○ | 日本では弧の大きさを中心角で言い、弧そのものに度数を付けない。 |
| terms | arcsine | pitfalls[1] |  | 日本の共通テスト（数学I）は三角比の表を添えて角を読ませる。 |
| terms | arctangent | pitfalls[0] |  | 学習指導要領解説には逆三角関数が出てこないので、日本の数III の ∫ dx/(1 + x²) は x = tan θ と置換して定積分として求める。 |
| terms | area-in-polar-coordinates | mapping_note |  | 見出しの「極座標での面積」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | area-model | mapping_note |  | 日本の中 3 の教科書も、長方形の面積で式の展開を説明するが、図に決まった名前はない。 |
| terms | area-of-a-regular-polygon | pitfalls[0] |  | 日本の数I では、中心と各頂点を結んで n 個の合同な二等辺三角形に分け、外接円の半径 r を使って (n/2)r² sin(360°/n) と求める。 |
| terms | area-problem | mapping_note |  | 見出しの「面積問題」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | arrange-by-the-variable-of-lowest-degree | mapping_note |  | 見出しの日本語は学習指導要領解説に出てこない。 |
| terms | augmented-matrix | pitfalls[0] | ○ | 日本の高校の学習指導要領には含まれないが、米国では Precalculus（OpenStax Algebra and Trigonometry）で扱う。 |
| terms | average-value-of-a-function | pitfalls[0] |  | 学習指導要領解説には出てこない。 |
| terms | bar-chart | pitfalls[0] |  | Khan Academy はどちらも使う（中学の講義では bar graph、AP Statistics では bar chart が多い）。 |
| terms | base-case | mapping_note | ○ | 日本の答案は「[1] n = 1 のとき」と書くだけで、この段に名前をつけないことが多い。 |
| terms | base-n | mapping_note |  | in base ／ written in base ／ base-n representation をまとめて数えると、OpenStax Algebra and Trigonometry の本文にはわずかで、用例コーパスの話し言葉のほうが多い（大半が Khan Academy の中学の講義）。 |
| terms | base-n | pitfalls[1] | ○ | 日本の教科書は 142₍₅₎ と括弧付きの添え字で書く。 |
| terms | base-of-the-natural-logarithm | pitfalls[1] |  | OpenStax Algebra and Trigonometry は自然対数を ln x、底を省いた log x を常用対数（底 10）と書く（学習指導要領解説には ln が出てこない）。 |
| terms | basic-properties-of-probability | pitfalls[0] |  | 日本の「確率の基本性質」の範囲とは少し違う。 |
| terms | basic-properties-of-probability | pitfalls[1] |  | 数A の確率の基本性質と同じ内容。 |
| terms | basic-variable | pitfalls[0] |  | 教科書により呼び方が違う: MIT 18.06 は pivot variable、Nicholson は leading variable。 |
| terms | bezouts-identity | pitfalls[0] |  | 日本の数A では、一次不定方程式の単元で「a, b が互いに素なら ax + by = 1 は整数解をもつ」という形で出てくる。 |
| terms | biconditional | pitfalls[0] |  | 日本の数I では「双条件文」という名前を使わず、「p ⇔ q」「p は q であるための必要十分条件」「p と q は同値」と言う。 |
| terms | binomial-identities | pitfalls[0] | ○ | 日本の教科書は nCk と書くが、英語の本では縦に並べた (n k) や C(n, k) と書き、n choose k と読む。 |
| terms | binomial-probability | pitfalls[0] |  | 日本の ₙCₖ は、英語では括弧の記号 (n k)（縦に並べる）で書き、n choose k と読む。 |
| terms | blocking | mapping_note |  | 見出しの「ブロック化」は学習指導要領解説に無い（日本語版 Wikipedia「実験計画法」にはある）。 |
| terms | boundary | pitfalls[0] | ○ | 日本の答案の「境界線を含む／含まない」は、英語ではグラフの実線（solid line）と点線（dashed line）の描き分けでも示す（用例コーパスでは dashed line は話し言葉にも書き言葉にも出てくる）。 |
| terms | box-plot | en.variants[1].note |  | 話し言葉は Khan Academy の中学の講義と Professor Leonard。 |
| terms | candidates-test | mapping_note |  | 学習指導要領解説には、閉区間で端点と極値の値を比べて最大値・最小値を求める方法の名前が出てこない。 |
| terms | cardioid | pitfalls[0] |  | 日本の数III ／ 数C の教科書では「カージオイド（心臓形）」と書く。 |
| terms | ceiling-function | pitfalls[0] | ○ | 日本の高校のガウス記号 [x] は x 以下の最大の整数（床関数 ⌊x⌋）で、天井関数ではない。 |
| terms | center-of-dilation | mapping_note |  | 中学校学習指導要領解説の相似の位置は、対応する点を通る直線が 1 点を通ることで定め、中心が 2 つの図形の間にある場合も含む。 |
| terms | center-of-dilation | pitfalls[1] |  | 中学校学習指導要領解説の「相似の位置」にある 2 つの図形で、対応する点を結ぶ直線が集まる点（相似の中心）がこれに当たる。 |
| terms | central-limit-theorem | pitfalls[1] |  | 標本の大きさの目安を n ≥ 30（at least 30 など）とすることが多いが、教科書によって違う。 |
| terms | chain-rule | pitfalls[0] |  | 学習指導要領解説（数学III）は「合成関数の微分法」と言い、「連鎖律」は出てこない（日本語版 Wikipedia の記事名は「連鎖律」）。 |
| terms | change-together | mapping_note |  | 「伴って変わる」は中学校学習指導要領解説が関数を導入する言い方（「伴って変わる二つの数量」）で、英語では y changes as x changes、y depends on x、as x increases, y increases のように、文で言い表す。 |
| terms | change | mapping_note |  | 中学校学習指導要領解説の「x の増加量」「y の増加量」（変化の割合は x の増加量に対する y の増加量の割合）は、英語で change in x、change in y と言い、Δx、Δy（delta x、delta y と読む）とも書く。 |
| terms | characteristic-equation | mapping_note |  | 日本の数B の「特性方程式」は、aₙ₊₁ = paₙ + q に対して α = pα + q とおく式を指すことが多い。 |
| terms | chinese-remainder-theorem | pitfalls[1] |  | 日本の数A では「3 で割ると 2 余り、5 で割ると 3 余る整数」のような問題として、定理の名前を出さずに扱うことがある。 |
| terms | closed-interval | pitfalls[0] |  | 共通テスト・センター試験の数学I は定義域を 0 ≦ x ≦ 3 のように不等式で書き、学習指導要領解説で閉区間 [a, b] が出るのは数学III の積分だけ。 |
| terms | cofunction-identity | mapping_note |  | 高等学校学習指導要領解説（数学I 図形と計量）は三角比の基本的な相互関係として sin A = cos(90° − A)・cos A = sin(90° − A) を挙げるだけで名前を付けず、OpenStax Algebra and Trigonometry（Right Triangle Trigonometry の節）は cofunction identities と呼ぶ（15 件）。 |
| terms | cofunction-identity | mapping_note |  | near なのは、OpenStax の cofunction identities が sin／cos・tan／cot・sec／csc の 3 組で、高等学校学習指導要領〔用語・記号〕の数学I が sin・cos・tan だけだから。 |
| terms | cofunction-identity | mapping_note |  | 見出しの「90° − θ の三角比」は学習指導要領解説に無い（日本語版 Wikipedia「三角関数」は余角公式）。 |
| terms | cofunction-identity | pitfalls[1] |  | 高等学校学習指導要領〔用語・記号〕（数学I 図形と計量）は sin・cos・tan だけで cot は無く、共通テストの問題文にも cot は出てこないので tan(90° − θ) = 1/tan θ と書くが、英語の cofunction identity は tan(90° − θ) = cot θ の形になる。 |
| terms | combination-with-repetition | mapping_note | ○ | ₙHᵣ は日本の教科書の記法なので、英語で書くときは ₙ₊ᵣ₋₁Cᵣ（二項係数）の形に直す。 |
| terms | combination-with-repetition | pitfalls[0] | ○ | ₙHᵣ の H は日本の教科書の記号。 |
| terms | combination | pitfalls[1] | ○ | ₙCᵣ は日本の教科書の書き方。 |
| terms | common-logarithm | pitfalls[0] | ○ | 日本の高校の数II では底 10 を省かず log₁₀ x と書く。 |
| terms | compare-coefficients | pitfalls[1] |  | 「係数比較法」と「数値代入法」は日本語の呼び名（学習指導要領解説には出てこない）。 |
| terms | complement | pitfalls[0] |  | 高等学校学習指導要領解説（数学I）は集合の記号として Ā（A の補集合）を挙げ、共通テスト（令和 4 年度 数学I ほか）は「X の補集合を X̄ と表す」と書く。 |
| terms | complementary-event | pitfalls[0] |  | センター試験の問題文（平成 30 年度 数学Ⅰ・数学Ａ）は余事象を Ā と書き、学習指導要領解説も P(Ā) = 1 − P(A) と書く。 |
| terms | complementary-event | pitfalls[0] |  | OpenStax Introductory Statistics は A′、Algebra and Trigonometry は E′ と書く（教科書による）。 |
| terms | completely-randomized-design | mapping_note |  | 見出しの「完全無作為化計画」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | complex-number | pitfalls[0] |  | 米国の教科書では a + bi の形を standard form（または rectangular form）と呼ぶ（OpenStax Algebra and Trigonometry）。 |
| terms | complex-plane | pitfalls[0] |  | 数C の「複素数平面」を、英語では complex plane と言う（number は入らない）。 |
| terms | component-form | pitfalls[0] |  | 米国の教科書は成分表示を山かっこ ⟨a₁, a₂⟩ で書き、点の座標 (a₁, a₂) と区別する（OpenStax Calculus Volume 3）。 |
| terms | component-form | pitfalls[0] | ○ | 日本の教科書は丸かっこ。 |
| terms | composite-figure | mapping_note | ○ | 日本の教科書は「いくつかの図形を組み合わせた図形」と説明することが多く、決まった名前を使わない。 |
| terms | concavity | pitfalls[0] |  | 日本の「下に凸」は concave up、「上に凸」は concave down。 |
| terms | condition | pitfalls[0] |  | センター試験（平成 30 年度 数学I・A）は「実数 x に関する次の条件 p, q, r, s を考える」、共通テスト（令和 3 年度 数学I・A）は「条件 p, q を次のように定める」と、変数を含み真偽が変わる文を「条件」と呼ぶ。 |
| terms | condition | pitfalls[0] |  | 高等学校学習指導要領解説（数学I）の「条件」は「命題の条件や結論」（仮定）の意味。 |
| terms | conditional-probability | pitfalls[0] | ○ | 日本の教科書は P_A(B) と書くが、英語では P(B \| A) と書き、the probability of B given A と読む。 |
| terms | conditional-statement | mapping_note |  | 高等学校学習指導要領解説（数学I）は命題「p → q」と書き、この形の命題そのものに名前を付けない（含意は論理学の語）。 |
| terms | conditional-statement | mapping_note |  | 見出しの「含意」は学習指導要領解説に無い（日本語版 Wikipedia「論理包含」「必要条件と十分条件」にはある）。 |
| terms | conditions-for-a-parallelogram | mapping_note |  | 中学校学習指導要領解説（第 2 学年）は「平行四辺形になるための条件」を平行四辺形の性質と並べて挙げる（本エントリの定義の 5 つ）が、用例コーパスと参照にはそれらをまとめた名前が出てこず、「四角形が平行四辺形であることを示す」（prove that a quadrilateral is a parallelogram）のように、示すことを文で言う。 |
| terms | conditions-that-determine-a-triangle | mapping_note |  | 高等学校学習指導要領解説（数学I）は正弦定理・余弦定理を三角形の決定条件と関連付けて理解すると書き、中学校学習指導要領解説（第 2 学年）は合同条件を三角形の決定条件を基に認めると書く。 |
| terms | confidence-level | pitfalls[0] | ○ | 日本の教科書では「信頼度 95%」と言い、英語では 95% confidence level または at the 95% level と言う。 |
| terms | congruence-criteria-for-right-triangles | mapping_note |  | CK-12 Geometry は、日本の 2 つの条件のうち「斜辺と他の 1 辺がそれぞれ等しい」を Hypotenuse-Leg (HL) Congruence Theorem と呼んで定理として扱う（4.16 HL Triangle Congruence）。 |
| terms | congruence-criteria | mapping_note |  | 中学校学習指導要領解説の三角形の合同条件は 3 つ（対応する 3 組の辺、2 組の辺とその間の角、1 組の辺とその両端の角）で、「合同条件」とまとめて呼ぶ。 |
| terms | congruence-criteria | definition_ja |  | 中学校学習指導要領解説（第 2 学年）では「3 組の辺」「2 組の辺とその間の角」「1 組の辺とその両端の角」がそれぞれ等しい、の 3 つ。 |
| terms | congruence-criteria | pitfalls[0] |  | AAS（エントリ aas-congruence）は学習指導要領解説の合同条件に無い。 |
| terms | congruent-arcs | pitfalls[3] |  | 中学校学習指導要領解説は「同じ弧に対する円周角」と書き、「等しい弧」という語は出てこない。 |
| terms | congruent | pitfalls[0] | ○ | 合同の記号は日本では ≡（中学校学習指導要領の〔用語・記号〕）、英語では ≅（CK-12 Geometry・IM）。 |
| terms | conic-section | pitfalls[0] |  | 日本の数C は「二次曲線」、英語は円錐の切り口として conic section と呼ぶ。 |
| terms | conjugate-roots | mapping_note |  | 日本の「共役な解」は、実数係数の方程式で a + bi が解なら a − bi も解になる、という関係を指す。 |
| terms | constant-multiple-rule | mapping_note |  | 見出しの「定数倍の法則」は学習指導要領解説に無い（日本語版 Wikipedia「積の微分法則」にはある）。 |
| terms | constant-multiple-rule | mapping_note |  | 学習指導要領解説には {kf(x)}′ = kf′(x) の性質の名前が出てこない。 |
| terms | constant-of-proportionality | pitfalls[0] |  | 見出しは中学の教材（IM Grade 7・Grade 8 の glossary）と授業（Khan Academy の中学）の constant of proportionality にした。 |
| terms | continuous-compounding | mapping_note | ○ | 日本の高校数学では連続複利を扱わない（e は数III で極限として導入する）。 |
| terms | continuous-compounding | pitfalls[0] |  | 英語は名詞の continuous compounding より、interest compounded continuously ／ continuously compounded interest の形で言うことが多い（教科書は compounded continuously、授業では continuously compounded の語順が多い）。 |
| terms | convenience-sample | mapping_note |  | 見出しの「便宜的抽出」は学習指導要領解説に無い（日本語版 Wikipedia「標本調査」には節「便宜的抽出」がある）。 |
| terms | coordinate-plane | en.variants[0].note |  | 中学・Algebra の講義と教科書は coordinate plane。 |
| terms | coordinate-proof | mapping_note |  | 日本の数II では「座標を用いて証明せよ」として、図形を座標平面に置き、2 点間の距離や中点の座標で性質を示す。 |
| terms | coordinate-proof | pitfalls[2] |  | 数II では中線定理 AB² + AC² = 2(AM² + BM²) の証明が代表的な例。 |
| terms | coordinate-rule | mapping_note |  | 見出しの「座標の規則」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | coordinate-rule | mapping_note | ○ | 日本の教科書は平行移動を「x 軸方向に 3、y 軸方向に −2 だけ平行移動」と言葉で書き、(x, y) → (x + 3, y − 2) の形の記法を使わない。 |
| terms | coordinates | pitfalls[1] |  | 数Aの「座標の考え方」で扱う空間の点の位置も、英語では coordinates in space（(x, y, z)）で言う。 |
| terms | corner-nondifferentiable | mapping_note |  | 見出しの「角（微分不可能点）」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | corresponding-angles-of-congruent-figures | pitfalls[1] |  | 中学校学習指導要領の〔用語・記号〕は合同の記号に ≡ を挙げ、英語（CK-12 Geometry・IM）では ≅ を使う（エントリ congruent）。 |
| terms | corresponding-angles-postulate | mapping_note |  | 見出しの「同位角の公準」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | corresponding-angles-postulate | mapping_note |  | 日本の中2 では「平行線の同位角は等しい」を平行線の性質として扱う。 |
| terms | corresponding-angles-postulate | mapping_note |  | 米国の教科書では公準（postulate）とするものと定理（theorem）とするものがある。 |
| terms | cosecant | mapping_note | ○ | 日本の高校では csc を使わず 1/sin θ と書く。 |
| terms | cotangent | mapping_note | ○ | 日本の高校では cot を使わず 1/tan θ と書く。 |
| terms | coterminal-angle | mapping_note |  | 見出しの「共終角」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | coterminal-angle | mapping_note |  | 日本の数II では一般角 θ + 360°n（動径が同じ角）として扱い、この関係の角に名前を付けない。 |
| terms | coterminal-angle | pitfalls[0] |  | 日本の一般角（エントリ general-angle）は θ + 360°n という角の表し方で、coterminal angle は動径が同じ角どうしの関係を指す。 |
| terms | cpctc | mapping_note |  | 見出しの「CPCTC」は英語の略語をそのまま使う（学習指導要領解説に無い）。 |
| terms | cpctc | mapping_note |  | 日本の証明では「合同な図形の対応する辺（角）は等しい」と文で書き、略語はない。 |
| terms | cramers-rule | pitfalls[0] | ○ | 日本の高校の学習指導要領には含まれない。 |
| terms | critical-point | mapping_note |  | 学習指導要領解説には f′(x) = 0 となる x の名前が出てこない。 |
| terms | cross-multiply | mapping_note |  | 日本語の「内項の積と外項の積は等しい」（学習指導要領解説には内項・外項の語は無く、日本語版 Wikipedia「比例式」にある）に当たる性質を、英語の参照（OpenStax・IM・CK-12）は名前で呼ばず、比例式を a/b = c/d の分数の形にして cross-multiply する（ad = bc）と手順を動詞で言う。 |
| terms | cross-product | pitfalls[0] | ○ | 日本の高校の数C では外積を扱わない。 |
| terms | cubic-units | mapping_note |  | 見出しの「立方単位」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | cubic-units | mapping_note | ○ | 日本では cm³・m³ のように決まった単位で答える。 |
| terms | cubic-units | pitfalls[0] |  | 日本の問題では体積を cm³ や m³ で答え、「立方単位」とは言わない。 |
| terms | cubic-units | pitfalls[2] |  | 用例コーパスで cubic units は話・書とも使い、話し言葉はほとんどが Khan Academy（多くは中学の講義）、書き言葉は OpenStax Calculus と OpenStax Prealgebra が中心。 |
| terms | cylindrical-shell | mapping_note |  | 学習指導要領解説には、この薄い円筒の名前も、それを使う体積の求め方の名前も出てこない。 |
| terms | cylindrical-shell | mapping_note |  | 見出しの「円柱の殻」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | decreasing | mapping_note |  | 見出しの「単調に減少する」は学習指導要領解説に無い（日本語版 Wikipedia には「単調減少」がある）。 |
| terms | definite-integral | pitfalls[0] |  | 学習指導要領解説（数学II）は、面積 S(t) の導関数が f(t) になることから定積分が面積を表すことを導く扱いと、区分求積法の考えで定義する扱いに触れる。 |
| terms | degree-measure | pitfalls[0] |  | 用例コーパスでは degree measure は話・書とも少ない（話し言葉は Khan Academy の中学の講義だけ）。 |
| terms | derivative-of-a-parametric-curve | mapping_note |  | ja.alt の「媒介変数曲線の微分」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | derivative-of-the-exponential-function | mapping_note |  | 学習指導要領解説（数学III）は「指数関数の導関数」を三角関数・対数関数の導関数と並べて挙げる（(eˣ)′ = eˣ と (aˣ)′ = aˣ log a をまとめた言い方）。 |
| terms | derivative-of-the-exponential-function | pitfalls[0] |  | OpenStax Calculus は aˣ ln a と書く（OpenStax Algebra and Trigonometry は底を省いた log x を常用対数とし、学習指導要領解説には ln が出てこない）。 |
| terms | derivative-of-the-logarithm | pitfalls[0] |  | OpenStax は自然対数を ln x と書き（学習指導要領解説には ln が出てこない）、ell en x や natural log of x と読む。 |
| terms | derivatives-in-polar-form | mapping_note |  | 見出しの「極曲線の微分」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | derivatives-of-inverse-trig-functions | pitfalls[0] |  | 学習指導要領解説には逆三角関数が出てこない。 |
| terms | derivatives-of-trigonometric-functions | pitfalls[0] |  | (tan x)′ = 1/cos²x は、OpenStax Calculus では sec²x（secant squared x）と書く（学習指導要領解説には sec が出てこない）。 |
| terms | descartes-rule-of-signs | pitfalls[0] | ○ | 日本の高校では扱わない。 |
| terms | determine-the-coefficients | pitfalls[0] |  | 「二次関数の決定」（学習指導要領解説・共通テストには出てこない言い方）の内容はこのエントリで扱う。 |
| terms | determine-where-the-function-is-increasing-and-decreasing | pitfalls[0] |  | 端点を含めるかどうかは教科書による。 |
| terms | difference-quotient | mapping_note |  | 見出しの「差分商」は学習指導要領解説に無い（日本語版 Wikipedia「微分」にはある）。 |
| terms | difference-quotient | mapping_note | ○ | 日本の高校では (f(a + h) − f(a))/h を「平均変化率」として扱い、別の名前をつけない。 |
| terms | differential-equation | pitfalls[0] |  | 高等学校学習指導要領（平成30年告示）の数学III には「微分方程式」の語が無く（理数数学II は dy/dx = ky 程度の簡単な微分方程式の意味と解法を扱う）、数IIIの教科書で扱うかは教科書による。 |
| terms | dilation | mapping_note |  | 中学校学習指導要領解説（第 3 学年）は、拡大・縮小を一つの図形を操作して新たな図形を作ることと書き、相似の位置・相似の中心を扱うが、変換の名前は出てこない（縮図・拡大図は小学校第 6 学年）。 |
| terms | dilation | pitfalls[2] |  | 用例コーパスでは、話し言葉はほとんどが Khan Academy の中学の講義で、書き言葉にはほとんど出てこない。 |
| terms | direct-proof | mapping_note |  | 見出しの「直接証明」は学習指導要領解説に無い（日本語版 Wikipedia「証明 (数学)」にはある）。 |
| terms | direct-proof | mapping_note |  | 数I に置くのは対偶を利用した証明・背理法と対比する語として。 |
| terms | direct-proportion | mapping_note |  | 中学校学習指導要領解説（第 1 学年）の「比例」は、a を比例定数として y = ax で表される関係。 |
| terms | discriminant | pitfalls[0] |  | 共通テスト・センター試験（数学II）の問題文は「判別式を D とすると」と置き（平成 28・31 年度 第1問、令和 5 年度 第3問）、日本語版 Wikipedia「判別式」も D で表記する。 |
| terms | disk-method | mapping_note |  | 学習指導要領解説（数学III）には、回転体の体積の求め方の名前が出てこない。 |
| terms | disk-method | mapping_note |  | 見出しの「円板法」は学習指導要領解説に無い（日本語版 Wikipedia「回転体」にはある）。 |
| terms | displacement | pitfalls[0] |  | 学習指導要領解説（数学III）は「位置の変化」と言い、「変位」は物理の項目にだけ出てくる。 |
| terms | distance-formula | pitfalls[0] |  | 中学校学習指導要領解説は、三平方の定理の活用として座標平面における 2 点間の距離を求めることを挙げ、高等学校学習指導要領解説（数学II）は座標を用いて二点間の距離を表すことを扱う。 |
| terms | diverge-to-negative-infinity | pitfalls[0] |  | OpenStax Algebra and Trigonometry は自然対数を ln x、底を省いた log x を常用対数（底 10）と書く（学習指導要領解説には ln が出てこない）。 |
| terms | divisibility | pitfalls[1] |  | 学習指導要領解説（中学校・高等学校）は約数・倍数の言い方で扱い、「整除性」「整除」は出てこない。 |
| terms | divisibility | pitfalls[1] |  | センター試験の問題文は「37a が 4 で割り切れる」のように「割り切れる」と言う。 |
| terms | divisibility | pitfalls[2] |  | 書き言葉は OpenStax Prealgebra・MIT の講義ノート・OpenStax Elementary Algebra、話し言葉は Khan Academy の中学の講義が中心。 |
| terms | divisor | mapping_note |  | 米国の小中学校の教材（IM・OpenStax Prealgebra）は「約数」を factor と言い、the factors of 12 のように使う。 |
| terms | domain-and-range | pitfalls[0] |  | 日本の −1 ≦ x ≦ 3（共通テスト・センター試験の問題文も ≦ を使う）は、英語では ≤ を使って −1 ≤ x ≤ 3 と書く。 |
| terms | domain | definition_ja |  | 中学校学習指導要領解説は「x の変域」と言う。 |
| terms | domain | pitfalls[0] |  | 中学の「x の変域」も英語では domain（エントリ domain-and-range）。 |
| terms | dot-product | mapping_note |  | 高校の「内積」は英語の dot product（OpenStax は scalar product とも書く）。 |
| terms | elimination | mapping_note |  | 中学校学習指導要領解説の「加減法」は式を足す・引くという操作から付いた名前で、英語は文字を消去することから elimination method（method of elimination）と呼ぶ。 |
| terms | empirical-rule | mapping_note |  | 日本の数B では正規分布表を使って確率を求め、この目安に名前を付けない。 |
| terms | end-behavior | mapping_note |  | 見出しの「関数の終端挙動」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | end-behavior | mapping_note |  | 日本の数III では x → ±∞ のときの極限（エントリ limit-at-infinity）として扱い、まとめた名前はない。 |
| terms | end-behavior | pitfalls[1] |  | 日本の数III の lim を使う書き方とは形が違う。 |
| terms | endpoint | pitfalls[0] |  | 高等学校学習指導要領解説（数学I 図形と計量）と共通テストは線分・半直線の端を「端点」と書き、区間の端は日本語版 Wikipedia「区間 (数学)」が端点 (endpoints) と呼ぶ。 |
| terms | epsilon-delta-definition | pitfalls[0] |  | 学習指導要領解説（数学III）には出てこない。 |
| terms | equal-angles | pitfalls[0] | ○ | 日本の教科書は ∠A = ∠B と書くが、∠A ≅ ∠B と m∠A = m∠B を使い分ける書き方もある。 |
| terms | equal | pitfalls[1] |  | 共通テスト・センター試験の問題文は、線分の長さや角にも = を使う（AB = AC、∠ABC = B）（エントリ congruent、equal-angles）。 |
| terms | equation-in-quadratic-form | mapping_note |  | 見出しの「2 次方程式の形の方程式」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | equation-in-quadratic-form | mapping_note | ○ | 日本では「x² = t とおく」のように、おき換えの手順として扱い、この種類の方程式に名前を付けない（x⁴ + ax² + b = 0 の形は「複 2 次式」と呼ぶことがある）。 |
| terms | equation-of-a-circle | pitfalls[0] |  | 米国の教科書は (x − h)² + (y − k)² = r² と中心を (h, k) で書き、standard form of the equation of a circle と呼ぶ（OpenStax Algebra and Trigonometry）。 |
| terms | equation-of-a-plane | pitfalls[1] |  | 数C では法線ベクトルとの内積で導く。 |
| terms | equiangular-triangle | mapping_note |  | 見出しの「等角三角形」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | equiangular-triangle | mapping_note | ○ | 日本では 3 つの角が等しい三角形は正三角形（equilateral triangle）と呼び、角で呼ぶ名前を使わない（平面では同じ三角形）。 |
| terms | equivalence-relation | pitfalls[1] | ○ | 日本の高校で習う「命題 p と q は同値」は equivalent（論理の同値）で、同値関係（equivalence relation）とは別の話。 |
| terms | equivalent | pitfalls[2] |  | 同値変形は、方程式を equivalent equation に変形していくこと（中学校学習指導要領解説（第 1 学年 方程式）は「同値な方程式」「同値変形」と書く）。 |
| terms | eulerian-path | pitfalls[1] |  | 教科書によっては Euler path を始点に戻らないものに限り、Euler circuit と対にする。 |
| terms | eulers-formula | pitfalls[0] | ○ | 日本の高校の数C では扱わない。 |
| terms | evaluate | pitfalls[0] |  | 学習指導要領解説（中学校・高等学校）は「式の値を求める」と書く。 |
| terms | existence-proof | pitfalls[1] |  | 数III の中間値の定理を使って「解が存在することを示せ」と答えるのは、解を具体的に求めない（非構成的な）存在証明にあたる。 |
| terms | existential-quantifier | pitfalls[1] |  | 数I の「ある…」の否定が「すべての…でない」になるのと同じ規則。 |
| terms | expanding-and-condensing-logs | mapping_note |  | 見出しの「対数の展開と圧縮」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | expanding-and-condensing-logs | mapping_note | ○ | 日本の教科書では「対数の性質を使って式を変形する」とだけ言う。 |
| terms | experimental-probability | mapping_note |  | experimental probability は参照（CED・OpenStax・IM・CK-12）には出てこず、用例コーパスでは Khan Academy の中学の講義に少し出てくるだけ。 |
| terms | exponential-model | mapping_note |  | 見出しの「指数モデル」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | exponential-regression | pitfalls[0] | ○ | 日本の高校では扱わない。 |
| terms | extended-euclidean-algorithm | pitfalls[0] |  | 数A の一次不定方程式では、この手順を名前を付けずに「互除法の式を逆にたどる」形で使う。 |
| terms | extraneous-solution | pitfalls[1] | ○ | 日本では「解の吟味」（エントリ checking-whether-the-solution-makes-sense）で除くと言う。 |
| terms | extreme-value-theorem | mapping_note |  | ja.alt の「極値定理」は学習指導要領解説に無い（日本語版 Wikipedia「最大値最小値定理」は extreme value theorem の訳として挙げる）。 |
| terms | factored-form | mapping_note |  | 見出しの「因数分解形」は学習指導要領解説に無い（日本語版 Wikipedia「二次関数」にはある）。 |
| terms | factored-form | mapping_note |  | 日本語版 Wikipedia「二次関数」は f(x) = a(x − s)(x − t) の形を因数分解形（単に分解形とも）と呼び、高等学校学習指導要領解説（数学I）はこの形に名前を付けず、二次方程式の解を二次関数のグラフと x 軸との共有点の x 座標として扱う。 |
| terms | factoring-by-grouping | mapping_note |  | 見出しの「グループ分けによる因数分解」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | factoring-by-grouping | mapping_note |  | 学習指導要領解説にも日本語版 Wikipedia「因数分解」にも、この方法の名前は出てこない（Wikipedia の因数分解の節は共通因数でくくる・たすきがけ・因数定理などで、項を組にしてくくる方法の節はない）。 |
| terms | fail-to-reject | mapping_note | ○ | 日本の教科書は「棄却されない」「棄却できない」と受け身・可能で書くが、英語は主語を we にして fail to reject（話し言葉）／ do not reject（書き言葉）と言う。 |
| terms | feasible-region | pitfalls[0] | ○ | 日本の高校の教科書では「連立不等式の表す領域」と言う。 |
| terms | find-the-arc-length | pitfalls[0] |  | 数IIIの「曲線の長さ」は英語では arc length。 |
| terms | find-the-asymptotes | mapping_note |  | 日本の「漸近線を求める」は 1 つの指示だが、英語の問題や説明では垂直な漸近線（vertical asymptotes）と水平な漸近線（horizontal asymptote）を分けて求めることが多い（用例コーパスでは find the vertical asymptotes のほうが find the asymptotes より多い）。 |
| terms | find-the-equation | en.variants[1].note |  | 話し言葉は大半が Khan Academy（特に中学の講義）、書き言葉は多くが OpenStax Algebra and Trigonometry。 |
| terms | first-derivative-test | mapping_note |  | 学習指導要領解説（数学II・III）には、f′(x) の符号の変化から極大・極小を判定する方法の名前が出てこない。 |
| terms | first-derivative-test | mapping_note |  | 見出しの「第 1 次導関数判定法」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | floor-function | pitfalls[1] | ○ | ガウス記号の [x] を英語の文にそのまま書くと、ただの角かっこ（brackets）に見える（日本語版 Wikipedia「床関数と天井関数」は、日本の高校数学ではガウス記号が使われることがほとんどと書く）。 |
| terms | flowchart-proof | mapping_note |  | 見出しの「フローチャート証明」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | flowchart-proof | mapping_note | ○ | 日本の教科書には、根拠を矢印でつなぐこの答案の形式はない。 |
| terms | foil | mapping_note | ○ | 日本では分配法則で 1 項ずつ掛けて展開し、順序の覚え方に名前はない。 |
| terms | function-notation | mapping_note |  | 見出しの「関数記号」は学習指導要領解説に無い、本プロジェクトの訳語（日本語版 Wikipedia「関数記号」は数理論理学の別の意味）。 |
| terms | function-of-several-variables | pitfalls[0] |  | 授業と教科書で多いのは 2 変数の場合の function of two variables（特に書き言葉に多い）。 |
| terms | fundamental-theorem-of-calculus-part-1 | mapping_note |  | 学習指導要領解説（数学II）は d/dx ∫ₐˣ f(t)dt = f(x) を「微分と積分の関係」に着目して扱い、定理の名前や番号は出てこない。 |
| terms | fundamental-theorem-of-calculus-part-1 | mapping_note |  | 番号や名前（first ／ second fundamental theorem）の付け方は教科書による。 |
| terms | fundamental-theorem-of-calculus-part-2 | mapping_note |  | 学習指導要領解説（数学II）には、∫ₐᵇ f(x)dx = F(b) − F(a) を定理として名前で呼ぶ扱いが出てこない（定積分は面積 S(t) や区分求積法の考えと関連付けて導入する）。 |
| terms | fundamental-theorem-of-calculus-part-2 | mapping_note |  | 番号と名前の付け方は教科書による。 |
| terms | fundamental-theorem-of-calculus | mapping_note |  | 学習指導要領解説（数学II）は「微分と積分の関係」に着目して扱い、定理の名前（微分積分学の基本定理）は出てこない。 |
| terms | fundamental-theorem-of-calculus | mapping_note |  | 番号の付け方は教科書による。 |
| terms | gaussian-elimination | pitfalls[1] |  | 行階段形で止めて後ろから代入するか、既約行階段形（reduced row-echelon form）まで進めるかは教科書による。 |
| terms | general-addition-rule | mapping_note |  | 日本の数A の「確率の加法定理」は互いに排反な事象の式 P(A ∪ B) = P(A) + P(B) を指し、重なりを引く式は「和事象の確率」として別に扱う。 |
| terms | general-form-of-a-circle | pitfalls[0] |  | 米国の教科書は係数に D, E, F を使うことが多い。 |
| terms | general-multiplication-rule | pitfalls[0] | ○ | 日本の教科書は条件付き確率を P_A(B) と書くが、OpenStax Introductory Statistics は P(B \| A) と書き（P(A \| B) と合わせて 44 件）、B given A と読む。 |
| terms | general-solution | definition_ja |  | 方程式の解をすべて、整数 n や任意定数 C を使って 1 つの式で表したもの。 |
| terms | glide-reflection | pitfalls[0] | ○ | 日本の中学・高校の教科書では「映進」という名前を使わず、対称移動と平行移動の組み合わせとして扱う。 |
| terms | graph-network | pitfalls[1] |  | 数学 C は単に「グラフ」と呼ぶ。 |
| terms | greater-than-or-equal-to | pitfalls[0] | ○ | 記号は日本では ≧（共通テスト・センター試験の問題文、学習指導要領解説）、米国の教科書（OpenStax）では ≥。 |
| terms | greatest-common-divisor | en.variants[1].note |  | 話し言葉では Khan Academy の中学の講義が最も多く、The Organic Chemistry Tutor・Professor Leonard・patrickJMT が続く。 |
| terms | greatest-common-divisor | en.variants[3].note |  | 話し言葉は MIT OCW が中心で、Khan Academy の中学の講義にも出てくる。 |
| terms | greatest-common-divisor | pitfalls[1] | ○ | 日本の教科書は記号 gcd(a, b) を使わず言葉で書く。 |
| terms | grouped-sequence | mapping_note |  | 項をいくつかずつの組（group）に分けて考える日本の受験の手法で、英語で説明するなら group the terms like this: (1), (2, 3), (4, 5, 6), … と式で見せる。 |
| terms | half-angle-formulas | pitfalls[0] |  | 米国の教科書は sin(α/2) = ±√((1 − cos α)/2) と平方根の形で書く（符号は α/2 の象限で決める）。 |
| terms | half-angle-formulas | pitfalls[0] | ○ | 日本の教科書は 2 乗の形で書く。 |
| terms | hexadecimal | pitfalls[0] | ○ | 日本の教科書は 2F₍₁₆₎ のように括弧つきの添字で基数を書く。 |
| terms | hl-congruence | pitfalls[0] |  | 日本の直角三角形の合同条件は 2 つある。 |
| terms | horizontal-line-test | mapping_note |  | 見出しの「水平線テスト」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | horizontal-line-test | mapping_note |  | 日本の数III では「単調増加（減少）なら逆関数がある」のように説明し、判定法に名前を付けない。 |
| terms | hydrostatic-force | mapping_note |  | 日本語の見出し「静水圧による力」は学習指導要領解説に無い、本プロジェクトの訳語（静水圧は hydrostatic pressure で、板全体が受ける力とは別の量）。 |
| terms | hydrostatic-force | pitfalls[1] |  | 高等学校学習指導要領解説（数学編 理数編）には出てこない。 |
| terms | hyperbola | definition_ja |  | 二次曲線としては、2 つの定点（焦点）からの距離の差が一定である点の集まり（日本語版 Wikipedia「双曲線」。学習指導要領解説（数学C）は双曲線を二次式で表される曲線として扱う）。 |
| terms | hyperbola | pitfalls[0] |  | 中 1 の反比例 y = a/x のグラフも、数 C の二次曲線 x²/a² − y²/b² = 1 も、同じ hyperbola。 |
| terms | hyperbolic-functions | pitfalls[0] | ○ | 日本の高校では扱わない。 |
| terms | hypothesis | pitfalls[0] |  | 統計の「仮説」（数I データの分析の仮説検定）も英語では hypothesis で、別の語。 |
| terms | identity-matrix | definition_ja |  | E（米国の教科書では I）と書く。 |
| terms | identity-matrix | pitfalls[0] | ○ | 日本の教科書は単位行列を E で表すが、英語の教科書は I で表す（OpenStax Algebra and Trigonometry は次数を添えて Iₙ）。 |
| terms | image | mapping_note | ○ | 日本の中学では「移した図形」「移動後の図形」と言い、像という言葉は写像（大学）で使うことが多い。 |
| terms | imaginary-number | pitfalls[0] |  | 英語の imaginary number は、教科書によって bi（純虚数）だけを指すこともある（OpenStax Algebra and Trigonometry は bi の形の数として説明する）。 |
| terms | imaginary-number | pitfalls[0] |  | 日本の「虚数」は b ≠ 0 の複素数全体。 |
| terms | imaginary-solution | mapping_note |  | 日本の「虚数解」（実数でない解）をはっきり言うときは nonreal (complex) solution、imaginary solution。 |
| terms | implicit-differentiation | mapping_note |  | ja.alt の「陰関数微分」は学習指導要領解説に無い（日本語版 Wikipedia「対数微分法」にはある）。 |
| terms | improper-integral | pitfalls[1] |  | 学習指導要領解説には出てこない。 |
| terms | inclusion-exclusion-principle | pitfalls[0] |  | 数 A の n(A ∪ B) = n(A) + n(B) − n(A ∩ B) は 2 つの集合の場合。 |
| terms | inclusion-exclusion-principle | pitfalls[0] | ○ | 日本の高校の教科書はこの原理に名前を付けない。 |
| terms | indefinite-integral | mapping_note |  | 学習指導要領解説（数学II・III）には「不定積分」だけが出てきて、「原始関数」は出てこない。 |
| terms | indefinite-integral | definition_ja |  | 微分すると f(x) になる関数全体を、積分定数 C を付けて F(x) + C の形で表したもの。 |
| terms | indefinite-integral | pitfalls[1] |  | OpenStax Algebra and Trigonometry は底を省いた log x を常用対数（底 10）と定める（学習指導要領解説には ln が出てこない）ので、英語の答案では ln を使う。 |
| terms | independence-of-events | pitfalls[1] |  | 数 A の「独立な試行」も同じ考え方。 |
| terms | independent-system | mapping_note |  | 見出しの「独立な連立方程式」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | independent-system | mapping_note | ○ | 日本では「解がただ 1 組」「解が無数にある（不定）」「解がない（不能）」と言い、連立方程式の種類に名前を付けない。 |
| terms | independent-system | pitfalls[1] |  | 教科書によって分類の仕方が違う。 |
| terms | indirect-measurement | mapping_note |  | 高等学校学習指導要領解説は、数学A「数学と人間の活動」で三角比を用いた測量の方法を題材にすると書き、数学I「図形と計量」では直接測定できない 2 地点間の距離などを三角比で求める活動として書く（「測量」の語は数学A）。 |
| terms | indirect-measurement | mapping_note |  | 中学校学習指導要領解説（第 3 学年）は相似・三平方の定理で高さや距離を求める学習を挙げる。 |
| terms | inductive-step | mapping_note |  | 見出しの「帰納段階」は学習指導要領解説に無い（日本語版 Wikipedia「再帰」は数学的帰納法の証明の段を「基底段階」「帰納段階」と呼ぶ）。 |
| terms | inductive-step | mapping_note | ○ | 日本の答案では「n = k のとき成り立つと仮定すると、n = k + 1 のとき …」と書き、段階に名前をつけない。 |
| terms | inequality-sign | pitfalls[0] |  | 日本の ≦ ≧（共通テスト・センター試験の問題文、学習指導要領解説）は、米国の教科書（OpenStax）では ≤ ≥ と書く。 |
| terms | inequality | pitfalls[0] |  | 日本の ≦ ≧（共通テスト・センター試験の問題文、学習指導要領解説）は、米国の教科書（OpenStax）では ≤ ≥ と書く。 |
| terms | inferential-statistics | pitfalls[0] | ○ | 日本の数学 B の単元名は「統計的な推測」。 |
| terms | infinite-discontinuity | mapping_note |  | 見出しの「無限不連続」は学習指導要領解説に無い（日本語版 Wikipedia「不連続性の分類」には「無限不連続点」がある）。 |
| terms | infinite-limit | mapping_note |  | 見出しの「無限大の極限」は学習指導要領解説に無い（日本語版 Wikipedia「数列の極限」には節「無限大の極限」がある）。 |
| terms | infinite-series | pitfalls[1] |  | 日本語版 Wikipedia「級数」は級数を無限項の和として定義し（有限個の和は残りの項を 0 とみる場合）、学習指導要領解説は「無限級数」「無限等比級数」の形で使う。 |
| terms | influential-point | mapping_note |  | 見出しの「影響点」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | inscribed-polygon | pitfalls[1] |  | 日本の数A では「円に内接する四角形」の性質（向かい合う角の和が 180°）として習う。 |
| terms | instantaneous-rate-of-change | mapping_note |  | 見出しの「瞬間変化率」は学習指導要領解説に無いが、日本語版 Wikipedia「微分」は微分係数を x = a における瞬間変化率と説明する。 |
| terms | instantaneous-rate-of-change | mapping_note |  | 学習指導要領解説（数学II）は同じ量を微分係数と呼び、瞬間の速さや接線の傾きと関連付ける。 |
| terms | instantaneous-velocity | mapping_note |  | 数II の「瞬間の速さ」は位置の変化率で負にもなるので、英語では velocity（向きを含む）に当たる。 |
| terms | instantaneous-velocity | mapping_note |  | 英語の speed は velocity の絶対値（数III の「速さ」）を指す。 |
| terms | integrals-giving-inverse-trig-functions | mapping_note |  | 学習指導要領解説には逆三角関数が出てこないので、∫1/(1 + x²)dx は x = tan θ と置換して定積分の値だけを求める。 |
| terms | integration-by-completing-the-square | mapping_note |  | 学習指導要領解説には逆三角関数が出てこないので、x + 1 = 2 tan θ と置換して定積分の値だけを求める。 |
| terms | integration-by-completing-the-square | mapping_note |  | 見出しの「平方完成による積分」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | integration-by-long-division | mapping_note |  | 見出しの「長除法による積分」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | integration-by-substitution | mapping_note |  | 日本の置換積分法は、g(x) = t とおく形と x = g(t) とおく形の両方を含む（学習指導要領解説の数学III は ax + b = t と x = a sin θ の置き換えを挙げる）。 |
| terms | integration-by-substitution | mapping_note |  | 教科書の節の名前や答案では単に substitution（教科書によっては the substitution rule）とも書く。 |
| terms | integration-by-substitution | mapping_note |  | ja.alt の「置換法則」は学習指導要領解説に無い、本プロジェクトの訳語（英語 substitution rule の訳）。 |
| terms | integration-formulas | pitfalls[2] |  | OpenStax Algebra and Trigonometry は底を省いた log を常用対数（底 10）とする（学習指導要領解説には ln が出てこない）ので、英語の答案では ln を使う。 |
| terms | intercepted-arc | mapping_note |  | 見出しの「切片の弧」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | intercepted-arc | mapping_note |  | 日本の数A は「弧 AB に対する円周角」と言い、角の側から弧を「切り取られた弧」と呼ばない。 |
| terms | intercepted-arc | pitfalls[0] | ○ | 日本では同じことを「同じ弧に対する中心角の半分」と中心角で言う。 |
| terms | intersect | mapping_note |  | 共通テストの問題文は「2 点で交わる」「接する」「共有点をもたない」を分けて言う（令和 3 年度 第 1 日程 数学II）。 |
| terms | intersecting-chords-theorem | mapping_note |  | 見出しの「交わる弦の定理」は学習指導要領解説に無い（日本語版 Wikipedia「方べきの定理」の図の説明にはある）。 |
| terms | intersecting-chords-theorem | mapping_note | ○ | 日本では方べきの定理の 1 つの場合（2 本の弦 AB, CD が円の内部の点 P で交わるとき PA·PB = PC·PD）として扱い、この場合だけの名前は付けない。 |
| terms | intersecting-chords-theorem | pitfalls[0] | ○ | 日本では方べきの定理の 1 つの場合として習い、この場合だけの名前は付けない。 |
| terms | interval-notation | pitfalls[0] | ○ | 日本の高校では 2 < x ≦ 5 のように不等式で書き、この書き方は大学で使う（閉区間 closed-interval、開区間 open-interval）。 |
| terms | interval-notation | pitfalls[0] |  | 米国の教科書は Algebra 1（OpenStax Elementary Algebra）から、不等式の解をこの形でも書かせる。 |
| terms | interval-of-integration | mapping_note |  | 日本の「積分区間」は区間 a ≦ x ≦ b そのものを指すが、英語の授業と教科書（OpenStax Calculus）では、区間より両端の値を limits of integration（話し言葉では bounds of integration も）と呼ぶことが多い。 |
| terms | interval | pitfalls[0] |  | 高等学校学習指導要領解説（数学II 積分）と共通テストは区間を a ≦ x ≦ b と不等式で書き、閉区間 [a, b] の記号が解説に出るのは数学III の積分だけ。 |
| terms | inverse-proportion | mapping_note |  | 中学校学習指導要領解説（第 1 学年）の「反比例」は、a を比例定数として y = a/x または xy = a で表される関係。 |
| terms | inverse-trigonometric-function | pitfalls[0] |  | 学習指導要領解説には出てこないが、OpenStax Algebra and Trigonometry（Precalculus）で扱い、AP Calculus でも微分する（CED topic 3.4）。 |
| terms | inverse | mapping_note |  | 見出しの「裏」は学習指導要領解説に無い（日本語版 Wikipedia「裏 (論理学)」にはある。解説（数学I）が挙げるのは対偶・必要条件・十分条件）。 |
| terms | is-biased | mapping_note |  | 中学校学習指導要領解説の「偏り」は標本の抽出について言い（偏りなく抽出する）、日本語の「偏りがある」はこの 1 つ目に当たる。 |
| terms | joint-variation | mapping_note |  | 見出しの「結合変化」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | joint-variation | mapping_note | ○ | 日本では「z は x と y の積に比例する」と言う。 |
| terms | jump-discontinuity | mapping_note |  | 見出しの「跳躍不連続」は学習指導要領解説に無い（日本語版 Wikipedia「不連続性の分類」には「跳躍不連続点」がある）。 |
| terms | lagrange-error-bound | mapping_note |  | 見出しの「ラグランジュの誤差限界」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | lagrange-error-bound | mapping_note |  | 日本の大学の教科書はテイラーの定理の剰余項（ラグランジュの剰余項）として扱い、その上からの評価に名前をつけない。 |
| terms | law-of-detachment | pitfalls[0] |  | 米国の Geometry の教科書では law of detachment、論理学・離散数学では modus ponens と呼ぶ。 |
| terms | law-of-sines | pitfalls[0] |  | 高等学校学習指導要領解説（数学I）の正弦定理は a/sin A = b/sin B = c/sin C = 2R（R は △ABC の外接円の半径）と、= 2R まで含めて書く。 |
| terms | law-of-syllogism | pitfalls[0] | ○ | 日本の数学で言う三段論法（p ⇒ q、q ⇒ r なら p ⇒ r）は、英語では law of syllogism（論理学では hypothetical syllogism）。 |
| terms | laws-of-exponents | en.variants[0].note |  | 話し言葉では Khan Academy の中学の講義と Professor Leonard が中心。 |
| terms | leading-digit | pitfalls[0] |  | 用例コーパスでは leading digit は少なく、話し言葉（Khan Academy の中学の講義）にしか出てこない。 |
| terms | least-common-denominator | en.variants[0].note |  | 教科書は最初にこの形で導入し、あとは LCD と書く（OpenStax）。 |
| terms | least-common-multiple | en.variants[0].note |  | 話し言葉では少ない（Khan Academy の中学の講義・NancyPi）。 |
| terms | least-common-multiple | en.variants[1].note |  | 話し言葉ではこちらがずっと多く、ほとんどが Khan Academy の中学の講義。 |
| terms | left-riemann-sum | mapping_note |  | 見出しの「左リーマン和」は学習指導要領解説に無い（日本語版 Wikipedia「リーマン和」にはある）。 |
| terms | left-riemann-sum | pitfalls[0] |  | 区分求積法の和 Σ_{k=0}^{n−1}（左端）と Σ_{k=1}^{n}（右端）の名前は学習指導要領解説に出てこないが、AP の CED（topic 6.2）は left ／ right ／ midpoint Riemann sums と trapezoidal sums に名前を付けて比べる。 |
| terms | legs | pitfalls[0] |  | 学習指導要領解説（中学校）と日本語版 Wikipedia「直角三角形」は「直角をはさむ 2 辺」と 2 辺まとめて書くので、英語では 1 本なら a leg、2 本なら the legs ／ both legs と単数・複数に気をつける。 |
| terms | less-than-or-equal-to | pitfalls[0] | ○ | 記号は日本では ≦（共通テスト・センター試験の問題文、学習指導要領解説）、米国の教科書（OpenStax）では ≤。 |
| terms | let-u-equal | en.variants[2].note |  | 答案・教科書では Let u = x² + 1. のように = で書く。 |
| terms | lhopitals-rule | pitfalls[2] |  | 学習指導要領（平成30年告示）の本文に「ロピタル」は無く、解説は数学III の課題学習の例で発展として触れるだけ。 |
| terms | liate | mapping_note |  | OpenStax Calculus Volume 2 が紹介する覚え方で、学習指導要領解説には対応するものが出てこない。 |
| terms | like-radicals | mapping_note |  | 見出しの「同類根号」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | like-radicals | mapping_note |  | 日本の中 3 では「根号の中が同じ数」の和・差として、名前を付けずに計算する。 |
| terms | likelihood | pitfalls[0] |  | 中学の確率で言う likelihood は「起こりやすさ」の意味。 |
| terms | limit-at-infinity | mapping_note |  | 見出しの「無限遠での極限」は学習指導要領解説に無い（日本語版 Wikipedia「拡大実数」には「無限遠における極限」がある）。 |
| terms | limit-at-infinity | mapping_note |  | 学習指導要領解説（数学III）は「x の値を限りなく大きくしたときの f(x) の極限」と言う。 |
| terms | limit-comparison-test | mapping_note |  | 見出しの「極限比較判定法」は学習指導要領解説に無い（日本語版 Wikipedia「積分判定法」の関連項目に「極限比較判定法」がある）。 |
| terms | limit-of-sine-x-over-x | mapping_note |  | 学習指導要領解説（数学III）は「三角関数の極限」で lim_{θ→0} sin θ / θ = 1 を取り扱うとし、英語では名前を付けず、式をそのまま the limit as x approaches 0 of sine x over x equals 1 と読む。 |
| terms | line | pitfalls[1] |  | 共通テストの問題文は記号を使わず「直線 AB」と書く。 |
| terms | linear-approximation | mapping_note |  | ja.alt の「接線近似」は学習指導要領解説に無い（日本語版 Wikipedia「線型近似」は接線近似とも呼ぶと書く）。 |
| terms | linear-function | pitfalls[0] |  | m が傾き（slope）、b が y 切片（y-intercept）で、中学校学習指導要領解説の y = ax + b の a が m に当たる。 |
| terms | linear-inequality | pitfalls[0] |  | 中学校学習指導要領〔用語・記号〕（中1 数と式）は ≦ ≧、OpenStax・IM は ≤ ≥ と書く（慣習差 inequality-symbols）。 |
| terms | linear-inequality | pitfalls[1] |  | そのグラフ（半平面）は、学習指導要領解説では数学II「図形と方程式」の「不等式の表す領域」で扱う（慣習差 inequality-terms-scope、エントリ system-of-linear-inequalities）。 |
| terms | linear-pair | mapping_note |  | 見出しの「一直線をなす角」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | linear-pair | mapping_note | ○ | 日本では「隣り合う 2 つの角の和が 180°」を性質として扱い、2 角の組に名前を付けない。 |
| terms | linear-recurrence-relation | pitfalls[0] |  | 日本の数B では「線形漸化式」という名前を使わないことが多く、aₙ₊₁ = paₙ + q の形や隣接 3 項間の漸化式として個別に扱う。 |
| terms | linear-transformation-of-a-random-variable | pitfalls[0] | ○ | 分散の記号は日本の教科書が V(X)。 |
| terms | linear-transformation | pitfalls[0] | ○ | 日本の高校（旧課程）は「一次変換」、大学の線形代数は「線形変換」「線形写像」と呼ぶ。 |
| terms | linearity-of-expectation | pitfalls[0] |  | 日本の数B では E(X + Y) = E(X) + E(Y) や E(aX + b) = aE(X) + b を公式として扱う。 |
| terms | linearly-independent | pitfalls[0] | ○ | 日本の高校は「一次独立」、大学の線形代数は「線形独立」と呼ぶことが多いが、英語はどちらも linearly independent（名詞は linear independence）。 |
| terms | literal-equation | mapping_note |  | 見出しの「リテラル方程式」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | literal-equation | mapping_note | ○ | 日本では中 2 で「等式の変形」（エントリ rearranging-an-equation）として扱い、この種の等式に名前はない。 |
| terms | local-extremum | mapping_note |  | ja.alt の「相対極値」は学習指導要領解説に無い、本プロジェクトの訳語（relative extremum の訳）。 |
| terms | local-maximum | mapping_note |  | ja.alt の「相対最大値」は学習指導要領解説に無い、本プロジェクトの訳語（relative maximum の訳）。 |
| terms | logarithm | pitfalls[1] | ○ | 日本の高校の log x（数III）は自然対数。 |
| terms | logical-connective | mapping_note |  | 見出しの「論理結合子」は学習指導要領解説に無い（日本語版 Wikipedia「命題」にはある。langlink の「論理演算」は論理演算子と書く）。 |
| terms | logical-connective | pitfalls[0] |  | 高等学校学習指導要領解説（数学I 集合と命題）は必要条件・十分条件・対偶や簡単な命題の証明を扱い、集合の記号として a ∈ A、A ∩ B、A ∪ B、A ⊂ B、Ā を挙げ、発展の内容として真理値表と「p → q」の否定「p ∧ (¬q)」に触れるが、「論理結合子」の名前は出てこない。 |
| terms | logistic-growth | mapping_note |  | 見出しの「ロジスティック増加」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | mean-absolute-deviation | pitfalls[0] | ○ | 日本の中学・高校では扱わず、散らばりは範囲・四分位範囲・分散・標準偏差（エントリ standard-deviation）で表す。 |
| terms | midline | mapping_note |  | 見出しの「振動の中心線」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | midline | mapping_note |  | 日本の数II では y = sin θ + 1 のグラフを「y 軸方向に 1 平行移動したもの」として扱い、この線に名前を付けない。 |
| terms | midpoint-formula | mapping_note |  | 見出しの「中点公式」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | midpoint-formula | mapping_note | ○ | 日本の教科書は「中点の座標」として式を示す。 |
| terms | midpoint-riemann-sum | mapping_note |  | 見出しの「中点リーマン和」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | monomial | pitfalls[0] |  | 中学校学習指導要領解説は「単項式と多項式の意味」と対比で挙げ、日本語版 Wikipedia「多項式」は「多項式」を単項式でない整式の意味で用いる流儀があると書く。 |
| terms | monotone-convergence-theorem | pitfalls[1] |  | 数III の教科書では「有界な単調数列は収束する」を定理の名前なしで扱うことがある。 |
| terms | motion-problem | mapping_note |  | OpenStax の Algebra の教科書はこれを uniform motion applications と呼び、D = rt（distance = rate × time）の式を立てる。 |
| terms | move-term-to-other-side | en.variants[0].note |  | Khan Academy（中学の講義と高校向け）と YouTube の解説が中心で、大学の講義（MIT OCW）には少ない。 |
| terms | multiplicity | pitfalls[0] | ○ | 日本の高校では重解（エントリ double-root）までで、重複度という語は大学で使う。 |
| terms | natural-logarithm | pitfalls[1] |  | OpenStax Algebra and Trigonometry は底を省いた log x を常用対数（底 10）と定める（学習指導要領解説には ln が出てこない）ので、英語の答案では自然対数に ln を使う。 |
| terms | natural-number | mapping_note | ○ | 日本の自然数は 1, 2, 3, … で、0 を含まない（日本語版 Wikipedia「自然数」は、日本では高校の教育課程で 0 を入れないとする）。 |
| terms | negation | pitfalls[0] |  | 共通テスト（平成 27 年度 数学I 第1問）は条件 p の否定を p̄ と上線で書き、高等学校学習指導要領解説（数学I）は発展の内容として ¬（p ∧ (¬q)）に触れる。 |
| terms | negative-correlation | en.variants[0].note |  | 話し言葉では negative association・negative correlation より多いが、すべて Khan Academy（AP Statistics と中学の講義）。 |
| terms | negative-reciprocal | mapping_note |  | 見出しの「符号を変えた逆数」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | negative-reciprocal | mapping_note | ○ | 日本では垂直条件を「傾きの積が −1」（m₁m₂ = −1）と言い、この数に名前を付けない。 |
| terms | net-change | mapping_note |  | 学習指導要領解説は「変化量」とは言うが、定積分で求まる変化の合計の名前は出てこない。 |
| terms | net-change | mapping_note |  | 見出しの「純変化量」と ja.alt の「純変化定理」は、学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | newtons-law-of-cooling | pitfalls[0] | ○ | 日本の高校の学習指導要領（数学）には含まれない。 |
| terms | nonlinear-system | mapping_note | ○ | 日本では数I・数II で「連立方程式（2 次を含む）」として扱い、放物線と直線の共有点を求める問題として学ぶ。 |
| terms | normal-approximation-to-the-binomial | pitfalls[0] |  | 近似を使ってよい目安（np ≥ 10 かつ n(1 − p) ≥ 10 など）は教科書によって数が違う。 |
| terms | normal-distribution | pitfalls[0] | ○ | 日本の教科書は N(μ, σ²) と分散を書くが、OpenStax Introductory Statistics は X ~ N(μ, σ) と標準偏差を書く（51 件）。 |
| terms | normal-probability-plot | mapping_note |  | 見出しの「正規確率プロット」は学習指導要領解説に無い（日本語版 Wikipedia「Q-Qプロット」にはある）。 |
| terms | nth-roots-of-unity | pitfalls[1] |  | 数II の 1 の 3 乗根 ω（ω² + ω + 1 = 0、ω³ = 1）は、英語でも cube roots of unity と呼び、ω（omega）の記号を使うが、米国の高校課程では ω に決まった呼び名や性質の練習はほぼない。 |
| terms | nth-term-test | mapping_note |  | 見出しの「n 項判定法」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | nth-term-test | mapping_note | ○ | 日本の教科書では「級数が収束すれば aₙ → 0」の対偶として扱い、判定法の名前はつけない。 |
| terms | nth-term | pitfalls[1] |  | 日本の「一般項」は、第 n 項を n の式で表したもの。 |
| terms | number-of-elements | mapping_note |  | 高等学校学習指導要領解説は、要素の個数の関係式 n(A ∪ B) = n(A) + n(B) − n(A ∩ B) を数学A（場合の数と確率）で扱う。 |
| terms | numerical-integration | pitfalls[0] |  | 学習指導要領解説には数値積分が出てこない。 |
| terms | objective-function | pitfalls[0] | ○ | 日本の高校の問題文は「x + y の最大値を求めよ」のように書く。 |
| terms | one-to-one-property | mapping_note |  | 見出しの「一対一の性質」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | one-to-one-property | mapping_note | ○ | 日本の教科書では、指数関数・対数関数が単調であることから直接 aˣ = aʸ ⇔ x = y を使い、名前をつけない。 |
| terms | optimization-problem | mapping_note |  | 学習指導要領解説（数学II・III）は、文章題の最大・最小を「最適化」とは呼ばない（解説の「最適化」は IoT の話だけ）。 |
| terms | optimization-problem | definition_ja |  | 微分を使うほか、不等式の表す領域を使うもの（線形計画法。学習指導要領解説の数学II の例）もある。 |
| terms | order-matters | pitfalls[0] |  | 用例コーパスでは order matters ／ order doesn't matter ／ order does not matter をまとめて数え、話し言葉（Khan Academy の中学の講義が最も多い）・書き言葉（大半が OpenStax Algebra and Trigonometry）の両方に出てくる。 |
| terms | origin | pitfalls[1] |  | 日本の問題文（共通テスト・センター試験）や学習指導要領解説は原点を文字 O（オー）で表す。 |
| terms | orthographic-projection | mapping_note |  | 中学校学習指導要領解説の投影図は、空間図形を上から見た図（平面図）や前から見た図（立面図）に表現したもので、英語では IM Grade 6 が front view・top view と、見る向きで図を呼ぶ。 |
| terms | orthographic-projection | mapping_note |  | 見出しの orthographic projection はこの図法の英語の名前（英語版 Wikipedia の記事名。数学カテゴリの外）で、米国の中学・高校の教材（OpenStax・IM・CK-12）には出てこない。 |
| terms | paragraph-proof | mapping_note |  | 見出しの「段落証明」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | paragraph-proof | mapping_note |  | 日本の証明はふつうこの形（文章で書く）なので、わざわざ名前を付けない。 |
| terms | paragraph-proof | pitfalls[0] | ○ | 日本の答案の証明はほぼこの形。 |
| terms | parallel-vectors | pitfalls[0] | ○ | 日本の教科書の「平行条件」（a ∥ b ⇔ b = ka）は、英語では条件に名前をつけず、one vector is a scalar multiple of the other のように言う（scalar multiple of は用例コーパスに少し出てくる）。 |
| terms | parallel | definition_ja |  | 直線 AB と CD が平行であることを、中学校学習指導要領の〔用語・記号〕どおり AB // CD と書く（英語の教材の記号は ∥。エントリ parallel-sign）。 |
| terms | parametric-equations | mapping_note |  | ja.alt の「媒介変数方程式」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | parent-function | mapping_note |  | 見出しの「親関数」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | parent-function | mapping_note | ○ | 日本では「y = x² のグラフを平行移動したもの」と言い、もとになる関数に名前を付けない（エントリ transformations-of-functions）。 |
| terms | partial-fraction-decomposition | pitfalls[2] |  | 学習指導要領解説（数学III）は「分数関数」について「簡単な分数関数」のグラフを扱う。 |
| terms | partial-sum | pitfalls[0] |  | 数B では「初項から第 n 項までの和」、数III では「部分和」。 |
| terms | pemdas | mapping_note |  | 日本には演算の順序の覚え方の決まった名前がない。 |
| terms | percent-change | mapping_note | ○ | 日本では「〜% 増える」「〜% 減る」「増加率」と言い、増減をまとめた名前はない。 |
| terms | permutation | pitfalls[0] | ○ | 記号は日本では ₙPᵣ。 |
| terms | permutation | pitfalls[0] |  | 米国の教科書では P(n, r) や ₙPᵣ と書く。 |
| terms | perpendicular-lines | pitfalls[0] |  | 日本の「傾きの積が −1」と同じ内容。 |
| terms | perpendicular-postulate | mapping_note |  | 見出しの「垂線の公準」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | perpendicular-postulate | mapping_note | ○ | 日本の教科書は「直線外の 1 点を通る垂線はただ 1 本」を公準として立てない（作図で扱う）。 |
| terms | phase-shift | pitfalls[1] | ○ | 日本の教科書では「x 軸方向に π/2 だけ平行移動」と表す。 |
| terms | piecewise-function | mapping_note | ○ | 日本の高校では「場合分けして定義された関数」として扱い、名前を付けないことが多い。 |
| terms | pigeonhole-principle | pitfalls[1] | ○ | 日本の入試問題の解説では「部屋割り論法」と呼ぶことがある。 |
| terms | place | en.variants[0].note |  | 話し言葉はほとんどが Khan Academy の中学の講義。 |
| terms | place | en.variants[1].note |  | 話し言葉は大半が Khan Academy の中学の講義、書き言葉は大半が OpenStax Prealgebra。 |
| terms | point-of-intersection | pitfalls[1] |  | 日本の「共有点」は接する点も含む。 |
| terms | point-slope-form | mapping_note |  | 見出しの「点傾き形」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | point-slope-form | mapping_note | ○ | 日本では数II で「点 (x₁, y₁) を通り傾き m の直線の方程式」として同じ式を学ぶが、形の名前はない。 |
| terms | polynomial-inequality | mapping_note | ○ | 見出しの「多項式不等式」は学習指導要領解説に無い、本プロジェクトの訳語（日本では 3 次以上のものを高次不等式と呼ぶ）。 |
| terms | polynomial | pitfalls[0] |  | 高校の「整式」を integral expression と直訳しない。 |
| terms | polynomial | pitfalls[1] |  | 中学校学習指導要領解説は「単項式と多項式の意味」と対比で挙げ、日本語版 Wikipedia「多項式」は「多項式」を単項式でない整式の意味で用いる流儀があると書く。 |
| terms | polynomial | pitfalls[1] |  | 範囲は高校の「整式」と同じ。 |
| terms | population-mean | pitfalls[1] |  | 学習指導要領解説（数学B）と共通テストの問題文（令和 6 年度 数学II・数学B ほか）は母平均を m と書く。 |
| terms | positive-and-negative-numbers | en.variants[0].note |  | 話し言葉ではこちらだけを使う（ほとんどが Khan Academy の中学の講義）。 |
| terms | positive-number | pitfalls[1] |  | 正の整数（positive integer）は 1, 2, 3, … で、日本の自然数と同じ範囲（エントリ natural-number）。 |
| terms | postulate | mapping_note | ○ | 日本の高校数学では「公理」と言い、「公準」はユークリッド原論の訳語として出てくる程度。 |
| terms | power-rule | mapping_note |  | 学習指導要領解説には (xⁿ)′ = nxⁿ⁻¹ の公式の名前が出てこない。 |
| terms | power-rule | mapping_note |  | ja.alt の「べき乗則」は学習指導要領解説に無い。 |
| terms | predicate | pitfalls[0] |  | 日本の数I では、x > 3 のように変数を含み値を決めると真偽が決まる文を「条件」と呼び、「述語」とは言わない。 |
| terms | preimage | mapping_note | ○ | 日本の中学では「もとの図形」と言い、原像という言葉は写像（大学）で使う。 |
| terms | prime-factorization | pitfalls[2] |  | 話し言葉はほとんどが Khan Academy の中学の講義、書き言葉は大半が OpenStax Prealgebra と Elementary Algebra。 |
| terms | prime-polynomial | mapping_note | ○ | 日本の中学・高校では「これ以上因数分解できない」と言い、名前を付けない。 |
| terms | probability-density-function | pitfalls[1] |  | 日本の共通テスト（数学B）は正規分布表を添えて確率を求めさせる。 |
| terms | probability | pitfalls[2] |  | 高等学校学習指導要領解説（数学A）は全事象を U で表す（P(U) = 1）が、上の式では標本空間を S とした（sample-space を参照）。 |
| terms | projectile-motion | mapping_note |  | 見出しの「放物運動」は数学の学習指導要領解説には無い（高等学校学習指導要領解説の物理の項目「放物運動」と日本語版 Wikipedia「放物運動」にはある）。 |
| terms | projectile-motion | mapping_note |  | 中学校学習指導要領解説（第 3 学年 関数 y = ax²）は、y = ax² で捉える事象の例に斜面をころがる物の運動・車の制動距離・噴水の水が作る形を挙げ、落下の式は挙げていない。 |
| terms | proposition | pitfalls[1] |  | 「x > 3」のように変数の値で真偽が変わるものは、センター試験（平成 30 年度 数学I・A）・共通テスト（令和 3 年度 数学I・A）は「実数 x に関する次の条件 p, q」のように「条件」と呼んで命題と区別する（エントリ condition）。 |
| terms | proposition | pitfalls[2] |  | 日本語版 Wikipedia「命題」は命題を真偽が確定した言明と定義し、高等学校学習指導要領解説（数学I 集合と命題）は命題の真偽と「条件や結論」を扱う。 |
| terms | propositional-logic | pitfalls[1] |  | 数I「集合と命題」では否定を p̄ と上に線を引いて書き、「かつ」「または」は言葉で書く。 |
| terms | proving-an-identity | pitfalls[1] |  | 証明の途中で両辺に同じ操作をして 1 = 1 を導く書き方は、米国の教科書でも避ける（片側を変形していく）。 |
| terms | pythagorean-identity | mapping_note |  | 見出しの「ピタゴラスの恒等式」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | pythagorean-identity | mapping_note | ○ | 日本の教科書では sin²θ + cos²θ = 1 を「三角関数の相互関係」の 1 つとして扱い、個別の名前をつけない。 |
| terms | pythagorean-identity | pitfalls[0] |  | 米国の教科書は 1 + tan²θ = sec²θ、1 + cot²θ = csc²θ も合わせて Pythagorean identities（複数形）と呼ぶ。 |
| terms | quadrant | pitfalls[0] |  | 日本の「第 1 象限」〜「第 4 象限」（センター試験の問題文・学習指導要領解説も第 1 象限と書く）に対し、米国の教科書（OpenStax）はローマ数字で Quadrant I〜IV と書く（Quadrant III は quadrant three と読む）。 |
| terms | quadrantal-angle | mapping_note |  | 見出しの「座標軸上の角」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | quadrantal-angle | mapping_note | ○ | 日本の教科書では 0°, 90°, 180°, 270° などの角にまとめた名前をつけない。 |
| terms | quadratic-formula | pitfalls[0] |  | 共通テストの問題文は判別式を D とおく（令和 5 年度 数学II ほか）。 |
| terms | quadratic-function | definition_ja |  | 学習指導要領解説では、中学校は関数 y = ax²（a ≠ 0）を扱い、高等学校（数学I）の二次関数で y = ax² + bx + c の形に広げる。 |
| terms | quadratic-inequality | pitfalls[0] |  | 共通テスト・センター試験の問題文と正解は解を −2 < x < 3 のように不等式で書き、OpenStax Intermediate Algebra（Solve Quadratic Inequalities）は解を区間記法 (−2, 3) で書く。 |
| terms | quadratic-inequality | pitfalls[1] |  | 共通テスト・センター試験（平成 30 年度 数学II）は解を x < −2, 2 < x のように読点で並べ、この読点は「または」の意味。 |
| terms | quadrilateral | pitfalls[2] |  | m∠A は「∠A の大きさ」（the measure of angle A、エントリ measure）の書き方で、共通テスト・センター試験の問題文の ∠ABC ＝ 60° の書き方にあたる。 |
| terms | quantifier | pitfalls[0] |  | 日本の数I では「すべての」「ある」を言葉で扱い（「すべての x について p」の否定は「ある x について p でない」）、∀ ∃ の記号や「量化子」という名前は使わない。 |
| terms | quartic-equation | definition_ja |  | 高校では複2次式 x⁴ + ax² + b = 0 を x² = t とおいて解く形が多い。 |
| terms | radian | pitfalls[0] | ○ | 日本の答案ではラジアンの単位を省略して θ = π/3 と書く。 |
| terms | radical-equation | pitfalls[1] | ○ | 日本では数III で扱うが、米国の教科書では Algebra 1 の OpenStax Elementary Algebra から扱う（Intermediate Algebra、Algebra and Trigonometry にも出てくる）。 |
| terms | radical-expression | mapping_note |  | 見出しの「根号式」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | radical-function | mapping_note |  | 学習指導要領解説（数学III）の「無理関数」は √ を含む式で表される関数で、y = √(ax + b) の形のものを中心に扱う。 |
| terms | radical-function | mapping_note |  | ja.alt の「根号関数」は学習指導要領解説に無い（日本語版 Wikipedia「冪根」は n 乗根をとる関数を根号関数と呼ぶ）。 |
| terms | range | definition_ja |  | 中学校学習指導要領解説の「y の変域」のこと。 |
| terms | range | pitfalls[1] |  | 中学の「y の変域」も range と言い、x の変域と合わせて言うときは domain and range（エントリ domain-and-range）。 |
| terms | rank-nullity-theorem | pitfalls[0] |  | rank theorem は教科書によって別の定理（行の階数と列の階数が等しい）を指すので候補にしなかった。 |
| terms | rate-of-change | mapping_note |  | 中学の「変化の割合」は x の増加量に対する y の増加量の比。 |
| terms | ratio-of-areas-of-similar-figures | pitfalls[1] |  | 相似の記号は、中学校学習指導要領解説（〔用語・記号〕）では ∽、IM Geometry・CK-12 Geometry では ∼（△ABC ∼ △DEF）。 |
| terms | rational-expression | pitfalls[0] |  | 米国の教科書は excluded values（または restrictions）と呼ぶ。 |
| terms | rational-function | mapping_note |  | 日本の数III の「分数関数」は、学習指導要領解説では「簡単な分数関数」のグラフを平行移動と結びつけて扱う。 |
| terms | rationalizing-the-denominator | pitfalls[2] |  | 分母が √3 + √2 のような 2 項の和のときは、√3 − √2 を分母と分子に掛けて有理化する（高等学校学習指導要領解説は数学I で「分母が二項程度までの分数の形に表された数の分母の有理化」を挙げる）。 |
| terms | recurrence-relation | mapping_note |  | 日本の「漸化式」はどちらにも当たる。 |
| terms | reduced-row-echelon-form | pitfalls[0] |  | 教科書では Nicholson が使う。 |
| terms | reduced-row-echelon-form | pitfalls[1] |  | 日本語は教科書により簡約階段形・既約行階段形など呼び方が分かれる。 |
| terms | reference-angle | mapping_note | ○ | 日本の教科書には名前がない。 |
| terms | reflexive-property | pitfalls[0] |  | センター試験の問題文（平成 27 年度 数学Ⅰ・数学Ａ）は「∠C は共通」のように書き、反射律という名前は使わない。 |
| terms | regression-line | pitfalls[1] |  | OpenStax は ŷ = a + bx（a が切片、b が傾き）と書き（11 件）、日本の y = ax + b と文字の役割が逆になる。 |
| terms | related-rates | mapping_note |  | 学習指導要領解説（数学III）には、時刻とともに変わる 2 つの量の変化率の関係を求める問題の名前が出てこない。 |
| terms | related-rates | mapping_note |  | 見出しの「関連変化率」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | relatively-prime | mapping_note | ○ | 日本の教科書は「互いに素」を 2 つの整数について定義する。 |
| terms | relatively-prime | mapping_note |  | 用例コーパスの relatively prime はほとんどが MIT（話し言葉は大半が MIT OCW で、ほかは Khan Academy の中学の講義。書き言葉はすべて MIT の講義ノート）。 |
| terms | remainder-theorem | pitfalls[0] |  | 2 次式で割った余り（ax + b の形）を求める問題は、米国の高校ではあまり扱わない。 |
| terms | removable-discontinuity | pitfalls[0] |  | 学習指導要領解説（数学III）には不連続点の種類の名前が出てこない。 |
| terms | repeated-trials | mapping_note |  | 日本の「反復試行」は、同じ試行を独立に何回も繰り返すこと。 |
| terms | repeating-decimal | pitfalls[0] |  | 英語版 Wikipedia「Repeating decimal」の Notation の節は、米国などは繰り返す部分の上に横線（vinculum）を引き、日本・英国などは両端の数字の上に点を打つ、と書く。 |
| terms | representations-of-a-function | mapping_note |  | 中学校学習指導要領解説は、関数を表，式，グラフを相互に関連付けて考えることを挙げる。 |
| terms | resistant-statistic | mapping_note |  | 見出しの「抵抗性がある」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | restricted-domain | mapping_note |  | 見出しの「定義域の制限」は学習指導要領解説に無い（日本語版 Wikipedia「定義域」の節「定義域の制限と延長」にはある）。 |
| terms | restricted-domain | mapping_note |  | 高等学校学習指導要領解説は同じ内容を「区間が制限された関数の最大値や最小値」（数学II 微分）、逆関数は「元の関数が 1 対 1 の対応であるとき」（数学III）と書く。 |
| terms | riemann-sum | mapping_note |  | 区分求積法は、区間を n 等分して長方形の面積の和をつくり、その極限を定積分として求める手法の名前（学習指導要領解説も区分求積法の考えで定積分を導入する扱いに触れる）。 |
| terms | riemann-sum | mapping_note |  | 日本の「lim (1/n)Σ f(k/n) を定積分で表せ」型の問題は、OpenStax Calculus では express the limit as a definite integral のように指示される。 |
| terms | right-hand-limit | pitfalls[0] |  | 学習指導要領解説（数学III）は lim_{x→+0} と書き、日本語版 Wikipedia「片側極限」は lim_{x→a+0} と書く。 |
| terms | right-riemann-sum | mapping_note |  | 見出しの「右リーマン和」は学習指導要領解説に無い（日本語版 Wikipedia「リーマン和」にはある）。 |
| terms | right-triangle-similarity | mapping_note |  | 見出しの「直角三角形の相似」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | right-triangle-similarity | mapping_note | ○ | 日本では直角三角形の直角の頂点から斜辺に垂線を引いてできる 3 つの三角形が相似であることを、定理の名前を付けずに使う。 |
| terms | right-triangle-similarity | pitfalls[2] |  | 定理の英語名は教科書による。 |
| terms | right-triangle | pitfalls[2] |  | 中学校学習指導要領解説（第 2 学年）は、直角三角形だけに使える合同条件（斜辺と一つの鋭角、斜辺と他の 1 辺）を別に扱う（エントリ congruence-criteria-for-right-triangles）。 |
| terms | rigid-motion | mapping_note |  | 日本の中1 は平行移動・回転移動・対称移動をまとめて「移動」と呼ぶ（中学校学習指導要領解説の「図形の移動」）。 |
| terms | rigid-motion | pitfalls[2] |  | 用例コーパスでは話し言葉に rigid transformation が多く（すべて Khan Academy の中学の講義）、rigid motion はほとんど出てこない（3Blue1Brown）。 |
| terms | rise-over-run | mapping_note |  | 見出しの「上昇分と水平移動分の比」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | rise-over-run | mapping_note | ○ | 日本では「x が 1 増えると y がいくつ増えるか」「y の増加量 ÷ x の増加量」と言う。 |
| terms | rotated-conics | pitfalls[0] | ○ | 軸の回転の公式は日本の高校の学習指導要領には含まれない。 |
| terms | ruler-postulate | mapping_note |  | 見出しの「数直線上の距離」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | ruler-postulate | mapping_note | ○ | 日本の教科書は 2 点間の距離を数直線上の座標の差の絶対値として扱い、公準として名前を付けない。 |
| terms | same-side-exterior-angles | mapping_note |  | 見出しの「同側外角」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | same-side-exterior-angles | mapping_note | ○ | 日本の教科書には名前がない。 |
| terms | same-side-exterior-angles | pitfalls[1] |  | same-side と consecutive のどちらを使うかは教科書による。 |
| terms | sample-space | pitfalls[0] |  | 高等学校学習指導要領解説（数学A）は全事象を U で表す（P(U) = 1）。 |
| terms | scale-drawing | mapping_note |  | 日本語の「縮図」は縮めた図だけで、拡大した図は拡大図（学習指導要領解説は縮図・拡大図を小学校第 6 学年の内容とする）。 |
| terms | scale-factor | mapping_note |  | 学習指導要領解説（中学校）は対応する線分の長さの比を相似比とし、日本語版 Wikipedia「図形の相似」は F を r 倍して G と合同になるとき F と G の相似比を 1 : r と定義する（2 つの図形を挙げた順に比で書き、1 つの数にはしない）。 |
| terms | scale-factor | mapping_note |  | 共通テスト（令和 7 年度 数学I・A）の問題文も「その相似比は □ : □」。 |
| terms | scale-factor | pitfalls[2] |  | 用例コーパスでは、話し言葉はほとんどが Khan Academy の中学の講義で、書き言葉は少ない（MIT の講義ノートと OpenStax）。 |
| terms | scalene-triangle | pitfalls[0] | ○ | 日本では「3 辺の長さがすべて異なる三角形」をふつう名前で呼ばない。 |
| terms | scientific-notation | mapping_note |  | 日本の中 3 では、近似値を（整数部分が 1 桁の数）×（10 の累乗）の形で書くことを学ぶが、この書き方に名前を付けない。 |
| terms | secant-line | mapping_note |  | 学習指導要領解説（数学II・III）には「割線」が出てこない。 |
| terms | secant-tangent-theorem | mapping_note |  | 見出しの「割線と接線の定理」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | secant-tangent-theorem | mapping_note | ○ | 日本では方べきの定理の、円の外の点 P から引いた割線と接線の場合（PT² = PA·PB）として扱う。 |
| terms | secant | mapping_note | ○ | 日本の高校では sec を使わず 1/cos θ と書く（1 + tan²θ = 1/cos²θ）。 |
| terms | secant | pitfalls[2] |  | 日本の 1 + tan²θ = 1/cos²θ は英語の式では 1 + tan²θ = sec²θ と書き、tan x の導関数も sec²x と書く。 |
| terms | second-derivative-test | mapping_note |  | 学習指導要領解説には、f′(a) = 0 かつ f″(a) の符号で極大・極小を判定する方法の名前が出てこない。 |
| terms | second-derivative-test | mapping_note |  | 見出しの「第 2 次導関数判定法」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | segment-addition-postulate | mapping_note |  | 見出しの「線分の加法公理」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | segment-addition-postulate | mapping_note | ○ | 日本の教科書は AB + BC = AC に名前をつけない。 |
| terms | segment | mapping_note |  | 英語の記法では線分 AB を AB の上に横線を引いて表し、その長さは横線なしの AB と書き分ける（共通テストの問題文では線分も長さも AB と書く）。 |
| terms | select-at-random | pitfalls[0] |  | 学習指導要領解説（中学校・高等学校）は「無作為に抽出する」と書く。 |
| terms | separable-differential-equation | pitfalls[1] |  | 両辺を積分して出てくる ln\|y\| は、日本語では log\|y\| と書く（学習指導要領解説には ln が出てこない）。 |
| terms | set-builder-notation | mapping_note |  | 日本の数A（集合）でも {x \| x は 12 の約数} のように書くが、書き方に名前を付けず「条件を満たすものの集まりとして表す」と言う。 |
| terms | set-builder-notation | pitfalls[1] |  | 要素を書き並べる書き方（{1, 2, 3, 4} など、日本の「要素を書き並べる方法」）は roster notation と言い、set-builder notation とは別。 |
| terms | set-up-a-recurrence | mapping_note |  | 高校の教科書（OpenStax Algebra and Trigonometry）の write a recursive formula は、並んだ項から漸化式を書く問いで使う。 |
| terms | shell-method | mapping_note |  | 日本語ではバウムクーヘン積分と呼ばれ（日本語版 Wikipedia の記事名）、学習指導要領解説には出てこない。 |
| terms | shell-method | mapping_note |  | 見出しの「シェル法」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | shortest-path | pitfalls[0] |  | 日本の「最短経路の数」の問題は lattice path で言う。 |
| terms | side-angle-inequality | mapping_note |  | 見出しの英語 side-angle inequality と日本語の「三角形の辺と角の大小」は本プロジェクトの言い方で、学習指導要領解説・日本語版 Wikipedia に無い。 |
| terms | sign-chart-inequality | mapping_note |  | 見出しの「符号図」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | sign-chart-inequality | mapping_note |  | 日本の増減表（sign-chart）と英語の名前は同じだが、こちらは不等式を解くための図で、関数の増減は表さない。 |
| terms | sign-chart | mapping_note |  | 日本の増減表（x の行・f′(x) の行・f(x) の行を並べ、矢印で増減を書く表）に当たる定型の表は、AP の CED にも OpenStax Calculus にも出てこない。 |
| terms | sign-chart | mapping_note |  | 数IIIの凹凸まで入れた表も同じで、凹凸は f″ の符号で判断する（concavity、CED topic 5.6）。 |
| terms | significant-figures | pitfalls[3] |  | 中学校学習指導要領解説（誤差や近似値）は、測定値を 2300 m ではなく 2.30 × 10³ m のように（整数部分が 1 桁の数）×（10 の累乗）の形で表して、どの数字までが有効数字かを明らかにする、と書く。 |
| terms | similar-triangles | pitfalls[0] |  | 相似の記号は、中学校学習指導要領解説（〔用語・記号〕）では ∽、IM Geometry・CK-12 Geometry では ∼（△ABC ∼ △DEF）。 |
| terms | similar | pitfalls[1] |  | 相似の記号は、中学校学習指導要領解説（〔用語・記号〕）では ∽、IM Geometry・CK-12 Geometry では ∼（△ABC ∼ △DEF）。 |
| terms | similarity-criteria | mapping_note |  | 中学校学習指導要領解説は三角形の相似条件を 3 つ挙げ（解説の言い方は「3組の辺の比がすべて等しい」「2組の辺の比とその間の角がそれぞれ等しい」「2組の角がそれぞれ等しい」）、「相似条件」とまとめて呼ぶ。 |
| terms | simplify-radicals | en.variants[2].note |  | 話し言葉の首位（NancyPi と Khan Academy の中学の講義）。 |
| terms | simplify-radicals | pitfalls[3] |  | センター試験の注意事項は「根号の中に現れる自然数が最小となる形で答えなさい」と書く（平成 30 年度）。 |
| terms | sinusoid | mapping_note |  | 日本の数II では y = sin θ のグラフを「正弦曲線」と呼ぶ。 |
| terms | sketch | mapping_note |  | 日本語の問題文の「図示せよ」「図示すると」（共通テストの問題文には「図示すると」がある）は、領域なら Sketch ／ Graph ／ Shade the region、曲線なら Sketch the graph と言う。 |
| terms | slope-field | pitfalls[0] |  | 学習指導要領解説には出てこない。 |
| terms | slope-formula | mapping_note |  | 見出しの「傾きの公式」は学習指導要領解説に無い（日本語版 Wikipedia「中点法」は 2 点を結ぶ直線の傾きの式を「傾きの公式」と呼ぶ）。 |
| terms | slope-formula | mapping_note | ○ | 日本では「変化の割合 = y の増加量 ÷ x の増加量」（エントリ rate-of-change）として同じ計算をするが、公式の名前はない。 |
| terms | slope-intercept-form-of-a-line | mapping_note |  | 見出しの「傾き切片形」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | slope-intercept-form-of-a-line | mapping_note | ○ | 日本では y = ax + b を一次関数の式として扱い、形に名前を付けない。 |
| terms | slope-intercept-form-of-a-line | pitfalls[0] |  | 日本の一次関数 y = ax + b の a が m にあたる。 |
| terms | slope | pitfalls[0] |  | 中学校学習指導要領解説の y = ax + b の a に当たる。 |
| terms | sohcahtoa | mapping_note |  | 見出しの「SOHCAHTOA」は英語の語呂合わせをそのまま使う（学習指導要領解説に無い。日本語版 Wikipedia「三角関数の暗記方法」は英語圏の覚え方として SOH-CAH-TOA を挙げる）。 |
| terms | sohcahtoa | mapping_note | ○ | 日本では sin・cos・tan の定義を筆記体の s・c・t の形で覚える方法があり、この語呂合わせは使わない。 |
| terms | solution-set | pitfalls[0] |  | 区間の記法 (2, 3)、[1, ∞) は、高等学校学習指導要領解説では数学III の積分に閉区間 [a, b] が出てくる程度で、共通テストの問題文は 2 < x < 3、x ≧ 1 と不等式で書く（慣習差 interval-notation-vs-inequalities）。 |
| terms | solve-the-right-triangle | mapping_note |  | 見出しの「三角比で辺を求める」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | solving-triangles | pitfalls[0] |  | 米国の教科書は正弦定理を law of sines、余弦定理を law of cosines と呼ぶ（OpenStax Algebra and Trigonometry）。 |
| terms | space-diagonal | mapping_note |  | 見出しの「立体の対角線」は学習指導要領解説に無い（日本語版 Wikipedia「対角線」は、内部を通る対角線を体対角線、面の上のものを面対角線と呼ぶ）。 |
| terms | special-products | mapping_note |  | 米国の教科書 OpenStax Elementary Algebra は 6.4 Special Products で Binomial Squares Pattern（(a + b)²、(a − b)²、エントリ square-of-a-binomial）と Product of Conjugates Pattern（(a + b)(a − b)、エントリ difference-of-squares）を扱い、(x + a)(x + b) は 6.3 でふつうの二項式の積として扱う（日本の乗法公式はこれも含む）。 |
| terms | special-right-triangles | mapping_note |  | 見出しの「特別な直角三角形」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | spread | en.variants[1].note |  | 話し言葉はすべて Khan Academy（中学の講義と AP Statistics）。 |
| terms | square-units | mapping_note |  | 見出しの「平方単位」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | square-units | mapping_note | ○ | 日本では cm²・m² のように決まった単位で答える。 |
| terms | square-units | pitfalls[1] |  | 日本の問題では面積を cm² や m² で答え、「平方単位」とは言わない。 |
| terms | sss-congruence | pitfalls[0] |  | 日本語では学習指導要領解説の言い方どおり「3 組の辺がそれぞれ等しい」と条件を文で言う。 |
| terms | standard-form-of-a-line | mapping_note |  | 見出しの「直線の標準形」は学習指導要領解説に無い（日本語版 Wikipedia「一次関数」は「平面における直線の標準形」の記事に触れる）。 |
| terms | standard-form-of-a-line | mapping_note |  | 日本の数II では直線の方程式の一般形を ax + by + c = 0（右辺が 0）と書くので、英語の standard form（定数が右辺）と形が違う。 |
| terms | standard-form-of-a-line | pitfalls[0] |  | 日本の数II の一般形 ax + by + c = 0 から書き直すと、定数の符号が変わる。 |
| terms | standard-form-of-a-line | pitfalls[1] |  | 二次関数の ax² + bx + c の形（日本の「一般形」、エントリ standard-form）や、英国での科学的記数法（エントリ scientific-notation）にも使うので、「直線の」「一次方程式の」を付けて区別する。 |
| terms | standard-form | mapping_note |  | 見出しの「一般形」は学習指導要領解説に無い（日本語版 Wikipedia「二次関数」にはある）。 |
| terms | standard-form | pitfalls[0] |  | 日本の「一般形」を standard form と訳すと、日本の「標準形」a(x − h)² + k の意味に取られることがある（OpenStax Algebra and Trigonometry の standard form はこちら）。 |
| terms | standard-matrix | mapping_note |  | 見出しの「標準行列」は学習指導要領解説に無い、本プロジェクトの訳語（日本語は「線形写像の表現行列」と言うことが多い）。 |
| terms | standard-normal-table | mapping_note |  | 日本の数B の正規分布表は 0 から u までの確率 P(0 ≤ Z ≤ u) を載せる形が多い。 |
| terms | standard-unit-vectors | pitfalls[0] | ○ | 日本の教科書は e₁, e₂（空間では e₃）、米国の教科書は i, j, k と書く（OpenStax Calculus Volume 3）。 |
| terms | statistical-variable | mapping_note |  | 高等学校学習指導要領解説（数学I データの分析）はデータの項目（身長・点数など）を変量と呼び（共通テストも「英語の得点を変量 x」のように書く）、式の文字の「変数」とは言葉を分ける。 |
| terms | step-function | pitfalls[0] |  | 最大整数関数 ⌊x⌋（日本のガウス記号、エントリ floor-function）は step function の代表。 |
| terms | stretch-vertically | mapping_note |  | 日本語の「縦に伸縮する」「y 軸方向に拡大・縮小する」は両方を指す（高等学校学習指導要領解説（数学III 式と曲線）は、中心が原点で半径 a の円を「y 軸方向に b/a 倍して」楕円の標準形を導く、と拡大も縮小も一つの言い方で書く）。 |
| terms | strong-induction | pitfalls[0] |  | 数B の「n = k, k + 1 のとき成り立つと仮定して n = k + 2 を示す」形の帰納法は、strong induction の特別な場合にあたる。 |
| terms | structural-induction | pitfalls[1] | ○ | 日本の高校数学では扱わず、大学の離散数学や情報科学で出てくる。 |
| terms | subset | pitfalls[1] |  | 共通テスト（平成 26 年度 数学I・A）は「集合 X が集合 Y の部分集合であるとき X ⊂ Y と表す」と定め、A = B の場合も ⊂ で書く。 |
| terms | substitution-property | mapping_note |  | 見出しの「代入の性質」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | substitution-property | mapping_note | ○ | 日本では「等しいものを代入してよい」を名前のある性質として挙げない。 |
| terms | substitution-property | pitfalls[1] |  | 日本の証明では「∠1 = ∠3 を代入して」と書くだけで、理由に名前を付けない。 |
| terms | summation-notation | pitfalls[0] |  | センター試験（数学Ⅱ・数学Ｂ）の数列の問題は Σ_{k=1}^{n} のように添字に k を使う（慣習差 summation-index-letter）。 |
| terms | supplementary-angle-identity | mapping_note |  | 高等学校学習指導要領解説（数学I）は cos A = −cos(180° − A) の形で公式を示すだけで名前を付けない。 |
| terms | supplementary-angle-identity | mapping_note |  | 見出しの「180° − θ の三角比」は学習指導要領解説に無い（日本語版 Wikipedia「三角関数」は補角公式）。 |
| terms | surface-area-of-revolution | pitfalls[0] |  | 学習指導要領解説（数学III）は回転体の体積を扱うが、回転面の面積は出てこない。 |
| terms | synthetic-division | pitfalls[0] | ○ | 日本の教科書では発展的な扱いのことがある。 |
| terms | system-of-inequalities | mapping_note |  | and でつないだもの（両方を満たす x、つまり共通範囲を答える）が日本の連立不等式にあたり、or でつないだもの（どちらかを満たす x）は連立不等式ではない。 |
| terms | system-of-inequalities | pitfalls[2] |  | system of inequalities は、OpenStax では 2 変数の不等式の組をグラフで解く節（Elementary Algebra の Graphing Systems of Linear Inequalities ほか）の言い方で、高等学校学習指導要領解説（数学II 図形と方程式）の「不等式の表す領域」（慣習差 inequality-terms-scope、エントリ system-of-linear-inequalities）に当たる（書き言葉では OpenStax Elementary Algebra と OpenStax Algebra and Trigonometry に出てくるが、話し言葉にはほとんど出てこない）。 |
| terms | system-of-linear-equations | pitfalls[0] |  | 中学の連立方程式は、1 次の式だけなら system of linear equations、一般には system of equations とも言う。 |
| terms | system-of-linear-inequalities | mapping_note |  | 日本の数I の「連立不等式」は 1 変数（英語の compound inequality、エントリ system-of-inequalities）。 |
| terms | system-of-linear-inequalities | mapping_note |  | 2 変数の連立不等式は数II の「不等式の表す領域」で扱う。 |
| terms | system-of-linear-inequalities | pitfalls[1] |  | 日本の数I の「連立不等式」は 1 変数の不等式の組で、英語では compound inequality と言う（エントリ system-of-inequalities）。 |
| terms | table-of-trigonometric-ratios | mapping_note |  | 高等学校学習指導要領解説（数学I 内容の取扱い）は「三角比表」を積極的に利用すると書き、共通テスト（令和 4・6 年度 数学I 第2問）は問題冊子に「三角比の表」を付ける。 |
| terms | table-of-trigonometric-ratios | mapping_note |  | IM の表は自分たちで測って作る直角三角形の比の表で、日本の三角比の表（0° から 90° の値の表）とは作りが違う。 |
| terms | tangent-chord-theorem | mapping_note |  | 日本の接弦定理の形（接線と弦のなす角は、その角の内部にある弧に対する円周角に等しい）は、the angle between a tangent and a chord equals the inscribed angle on the other side of the chord のように文で言う（本プロジェクトの書き方の例）。 |
| terms | tangent-problem | mapping_note |  | 見出しの「接線問題」は学習指導要領解説に無い（日本語版 Wikipedia「解析学」は「曲線の接線問題」と書く）。 |
| terms | telescoping-series | mapping_note |  | 見出しの「望遠鏡級数」は学習指導要領解説に無い（日本語版 Wikipedia「畳み込み級数」は telescoping series の別名として挙げる）。 |
| terms | telescoping-series | mapping_note |  | 日本の数B では Σ1/(k(k + 1)) を 1/k − 1/(k + 1) に分けて途中を消す方法として扱い、級数に名前をつけない。 |
| terms | terminal-side | mapping_note |  | 日本の「動径」は、始線から回転して角をつくる半直線そのもの。 |
| terms | test-point | mapping_note |  | 見出しの「テスト点」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | test-point | mapping_note |  | 学習指導要領解説には、区間の代表の値を代入して符号を調べる手順の名前が出てこない。 |
| terms | toss | en.variants[0].note |  | 話し言葉では toss より多い（Khan Academy の中学の講義に多い）。 |
| terms | total-distance-traveled | pitfalls[0] |  | 数IIIの「道のり」に当たる。 |
| terms | transformation-of-a-variable | mapping_note |  | 見出しの「変量の変換」は学習指導要領解説に無く、共通テスト（平成 31 年度 数学I・A 第2問、令和 5 年度 数学I・A）は「(x_i − x̄)/s と変換した」「千円単位に変換する」と動詞で言う。 |
| terms | transformations-of-functions | mapping_note | ○ | 日本では「平行移動」「対称移動」を別々に学び、まとめた名前はあまり使わない。 |
| terms | transitive-property | pitfalls[0] | ○ | 日本では推移律は大学（同値関係・順序関係）の語で、中学・高校の証明では「∠1 = ∠2、∠2 = ∠3 より」と理由に名前を付けずに書く。 |
| terms | translation | pitfalls[0] |  | 日本の「x 軸方向に p、y 軸方向に q だけ平行移動」は、英語では向きで言う（shift 3 units to the right and 2 units up）。 |
| terms | transversal | pitfalls[0] | ○ | 日本の教科書は交わる直線に名前を付けず「2 直線に 1 直線が交わるとき」と言う。 |
| terms | transversal | pitfalls[2] |  | 用例コーパスで transversal は話し言葉だけに出てくる（Khan Academy の中学の講義が最も多く、次が The Organic Chemistry Tutor）。 |
| terms | triangle-inequality | pitfalls[1] |  | 数II の「絶対値と不等式」で扱う \|a\| + \|b\| ≧ \|a + b\| も英語では triangle inequality と呼ぶ。 |
| terms | triangle-proportionality-theorem | pitfalls[3] |  | 中学校学習指導要領解説はこの内容を「平行線と線分の比についての性質」と呼び、「三角形と比の定理」は出てこない（見出しは本プロジェクトの言い方）。 |
| terms | trigonometric-function | pitfalls[0] |  | 米国の教科書は sin・cos・tan に加えて csc（cosecant）・sec（secant）・cot（cotangent）も使う。 |
| terms | trigonometric-function | pitfalls[0] | ○ | 日本の高校では使わない。 |
| terms | trigonometric-identities | mapping_note |  | 高等学校学習指導要領解説（数学I）の「三角比の基本的な相互関係」は、sin A = cos(90° − A)・cos A = sin(90° − A)、tan A = sin A / cos A、sin²A + cos²A = 1、1 + tan²A = 1/cos²A と、180° − A の三角比の関係を含む（数学II は「三角関数の相互関係」）。 |
| terms | trigonometric-identities | pitfalls[0] |  | 1 + tan²θ = 1/cos²θ は米国の教科書では 1 + tan²θ = sec²θ と secant で書く（OpenStax Algebra and Trigonometry）。 |
| terms | trigonometric-identities | pitfalls[0] |  | 学習指導要領解説には sec（正割）が出てこない。 |
| terms | trigonometric-integrals | pitfalls[0] |  | ∫(1/cos²x)dx = tan x + C は、OpenStax Calculus では sec²x（secant squared x）を使って ∫sec²x dx = tan x + C と書く（学習指導要領解説には sec が出てこない）。 |
| terms | trigonometric-ratio | pitfalls[2] |  | 高等学校学習指導要領解説では、数学I の三角比を直角三角形の鋭角で定めてから鈍角（0° ≦ θ ≦ 180°）まで広げ、数学II で一般角に広げたものを三角関数（trigonometric function）と呼ぶ。 |
| terms | trigonometric-substitution | mapping_note |  | 学習指導要領解説（数学III）は x = a sin θ の置き換えを置換積分法に含め、別の名前を付けない。 |
| terms | trigonometric-substitution | pitfalls[0] |  | 1/cos²θ は OpenStax では sec²θ と書く（学習指導要領解説には sec が出てこない）。 |
| terms | trigonometric-substitution | pitfalls[2] |  | √ を含む関数（日本の「無理関数」）は、OpenStax と AP の CED では irrational function と呼ばず、radical function ／ square root function と呼ぶ。 |
| terms | truth-table | pitfalls[0] |  | 日本の数I では命題の真偽を集合の包含関係（ベン図）で調べ、真理値表は使わない。 |
| terms | turning-points | mapping_note | ○ | 日本では数II・数III で微分して極大・極小を求め、グラフの形から極値をとる点の個数を数える言い方はしない。 |
| terms | two-column-proof | mapping_note |  | 見出しの「二段組みの証明」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | two-column-proof | mapping_note | ○ | 日本の中学・高校の証明は文章で書き、「statements（主張）」と「reasons（理由）」を 2 列に並べる答案の形式はない。 |
| terms | two-column-proof | pitfalls[0] | ○ | 日本の答案の「仮定より」は、この形式では理由の列に Given と書く。 |
| terms | two-proportion-z-test | mapping_note |  | 見出しの「2 標本比率の検定」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | two-variable-data | pitfalls[0] |  | 日本の数I では「2 つの変量のデータ」として散布図・相関係数を学ぶ。 |
| terms | unbiased | mapping_note |  | 英語の unbiased は 3 つの意味にまたがる: 標本の選び方（中学校学習指導要領解説は「偏りなく抽出する」と書く）、推定量（日本語は「不偏」。エントリ unbiased-estimator。AP Statistics の CED topic 3.1）、硬貨などの公平さ（MIT OCW の講義ノート）。 |
| terms | unit-circle | pitfalls[0] |  | 高等学校学習指導要領解説（数学I 図形と計量）は単位円を使わず、座標平面の第 1 象限で原点を端点とする長さ α の線分 OP と点 P の座標 (α cos θ, α sin θ) で三角比を鈍角まで拡張する。 |
| terms | unit-circle | pitfalls[0] |  | 単位円を使うのは数学II の三角関数（共通テスト（令和 7 年度 数学II・B・C）は「単位円を用いて」と書く）。 |
| terms | unit-circle | pitfalls[1] |  | 解説（数学I）の長さ α の線分 OP による定め方でも、単位円（α = 1）なら座標がそのまま (cos θ, sin θ) になる。 |
| terms | universal-quantifier | pitfalls[1] |  | 数I の「すべての…」の否定が「ある…でない」になるのと同じ規則。 |
| terms | universal-set | pitfalls[0] |  | 「全体集合」は共通テストの数学I 第1問（令和 3〜8 年度ほか）が「全体集合 U を…とする」と書く語で、学習指導要領解説には出てこない。 |
| terms | variable | mapping_note |  | 中学校学習指導要領解説は、式の中の x や a を「文字」と呼ぶ（「文字を用いた式」）。 |
| terms | variance | pitfalls[0] |  | センター試験 平成 30 年度 数学I の問題文は分散 s² を n で割る式で示し、日本語版 Wikipedia「分散 (確率論)」も n で割る分散（標本分散）と n − 1 で割る不偏分散を分ける。 |
| terms | variance | pitfalls[0] |  | 高等学校学習指導要領解説（数学I）は分散を、平均値との差に基づいてデータの散らばりの度合いを表す指標と書く。 |
| terms | vector-equation-of-a-circle | mapping_note |  | 米国の教科書は円を (x − h)² + (y − k)² = r² の形で扱い、ベクトル方程式としては立てない。 |
| terms | vector | pitfalls[0] | ○ | 日本の教科書は矢印（→）を文字の上に書くが、米国の教科書は太字（v）か、手書きでは上の矢印 v⃗ を使う。 |
| terms | venn-diagram | pitfalls[1] |  | 補集合の記号は高等学校学習指導要領解説（数学I）では Ā、OpenStax Introductory Statistics では A′（エントリ complement）。 |
| terms | vertex-form | mapping_note |  | 高等学校学習指導要領解説（数学I）はこの形を y = a(x − p)² + q に変形して頂点 (p, q) に着目すると書き、名前は付けない（「標準形」は数学C の放物線・楕円の方程式に使う）。 |
| terms | vertex-form | mapping_note |  | 見出しの「標準形」は学習指導要領解説に無い（日本語版 Wikipedia「二次関数」にはある）。 |
| terms | vertex-form | pitfalls[0] |  | 日本の「標準形」を standard form と直訳しない。 |
| terms | vertex-form | pitfalls[1] |  | 英語では頂点を (h, k) と書き、学習指導要領解説（数学I）や日本語版 Wikipedia「二次関数」の (p, q) と文字が違う。 |
| terms | vertical-asymptote | pitfalls[1] | ○ | 日本では数III で漸近線（エントリ asymptote）として扱い、向きで名前を分けない。 |
| terms | vertical-line-test | mapping_note |  | 見出しの「垂直線テスト」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | vertical-line-test | mapping_note | ○ | 日本では「x の値を決めると y の値がただ 1 つに決まるとき y は x の関数」という定義で考え、グラフでの判定法に名前を付けない。 |
| terms | vertical-tangent | pitfalls[0] |  | 学習指導要領解説には、接線が y 軸に平行になる点の名前が出てこない。 |
| terms | voluntary-response-bias | mapping_note |  | 見出しの「自発的回答の偏り」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | washer-method | mapping_note |  | 学習指導要領解説にはこの求め方の名前が出てこない。 |
| terms | washer-method | mapping_note |  | 見出しの「ワッシャー法」は学習指導要領解説に無い、本プロジェクトの訳語。 |
| terms | write-dx-in-terms-of-du | pitfalls[0] |  | dx を解き出す（solve for dx）か、被積分関数の中の 2x dx をそのまま du に置き換えるかは教科書による。 |
| terms | y-intercept | mapping_note |  | 日本語版 Wikipedia「一次関数」は y = ax + b の b（直線と y 軸との交点の座標）を y 切片、あるいは単に切片と呼び、センター試験の問題文（平成 31 年度 数学Ⅰ）も直線について「切片が −15」と書く。 |
| terms | z-score | pitfalls[0] |  | 日本の偏差値（hensachi）とは別。 |
| terms | zero-product-property | mapping_note |  | 見出しの「零積法則」は学習指導要領解説に無い（日本語版 Wikipedia「整域」が零因子の非存在を零積法則と呼び、「整数の合同」は零積性質と書く）。 |
| terms | zero-product-property | mapping_note |  | 中学校学習指導要領解説はこの性質に名前を付けず、「AB = 0 ならば、A = 0 または B = 0」と文で書く。 |
| terms | zeros-of-a-polynomial | pitfalls[0] | ○ | 日本の高校の教科書は「方程式 P(x) = 0 の解」として扱う。 |
| symbols | combination-ncr | notes[0] | ○ | 日本の教科書は ₙCᵣ と書き、米国の教科書は C(n, r)、ₙCᵣ、または縦に並べた二項係数 (n over r) の形で書く。 |
| symbols | conditional-probability-subscript-jp | notes[0] |  | 日本の P_A(B) は、米国の書き方では P(B \| A)。 |
| symbols | congruence-mod | notes[1] | ○ | ≡ は日本の中学では図形の合同の記号（congruent-sign）。 |
| symbols | congruent-sign | notes[0] |  | 日本の記号 ≡ で書いた合同も、英語では同じく is congruent to と読む。 |
| symbols | curl-del-cross | notes[1] |  | 日本の本の rot F（ローテーション）は、米国の教科書では curl F と書く。 |
| symbols | equals-question-mark | notes[1] | ○ | 日本の教科書では使わない。 |
| symbols | for-all-quantifier | notes[1] | ○ | 記号は英語の本で使い、日本の高校の教科書は言葉で「すべての」と書く。 |
| symbols | gauss-bracket-jp | notes[0] |  | 日本のガウス記号 [x] は英語では床関数 ⌊x⌋ と書き、the floor of x と読む。 |
| symbols | gcd-notation | notes[1] |  | 米国の Pre-Algebra の教材は greatest common factor（GCF）と呼び、中学の教材（Khan Academy の中学）と解説チャンネルに多い。 |
| symbols | geq-sign | notes[1] |  | 米国の教科書は ≥ と書く（≧ との違いは inequality-symbols）。 |
| symbols | integral-definite | notes[1] | ○ | 日本では「インテグラル a から b、f(x) dx」と記号を左から順に読むことが多い。 |
| symbols | leq-sign | notes[1] |  | 米国の教科書は ≤ と書く（≦ との違いは inequality-symbols）。 |
| symbols | log-e-jp | notes[0] |  | 数III の log x（底 e）は、英語では ln x と書いて the natural log of x か L N x と読む。 |
| symbols | log-e-jp | notes[1] |  | ∫ 1/x dx = log\|x\| + C は英語の教科書では ln\|x\| + C と書く。 |
| symbols | long-division-bracket | notes[0] |  | 筆算を進めるときは five goes into twenty four times（5 は 20 に 4 回入る）のように goes into を使い、中学の教材（Khan Academy の中学）に多い。 |
| symbols | negative-sign | notes[1] |  | the opposite of は中学の教材（Khan Academy の中学）に多い。 |
| symbols | parallel-sign | notes[1] | ○ | 日本の中学校の〔用語・記号〕は // と書き、CK-12 Geometry は ∥ と書く。 |
| symbols | permutation-npr | notes[0] | ○ | 記法の違い: 日本の教科書は ₙPᵣ と書くが、OpenStax Algebra and Trigonometry 2e ／ Precalculus 2e（13.5 ／ 11.5 Counting Principles）は P(n, r) と書く（各 11 件、数を入れた P(12, 9) の形が各 12 件）。 |
| symbols | piecewise-brace | notes[1] |  | 米国の教科書は条件を式の右に書き（x² if x ≥ 0）、日本のように ( ) でくくらないことが多い。 |
| symbols | polar-form-cis | notes[1] |  | 日本の高等学校学習指導要領解説には cis が出てこない（日本語版 Wikipedia「複素数」は r cis(φ) と書くこともあると説明する）。 |
| symbols | proportion-colon | notes[0] |  | 米国の教科書は比例式を a/b = c/d の分数の形で書くことが多く、そのときは a over b equals c over d と読む。 |
| symbols | repeated-combination-h-jp | notes[0] | ○ | ₙHᵣ は日本の教科書の記号で、米国にこの記号はない。 |
| symbols | similar-sign | notes[0] |  | 日本の ∽ も読みは同じ。 |
| symbols | union-sign | notes[1] |  | 米国の統計の教科書は確率で A OR B とも書く（probability-of-union）。 |
| symbols | vector-ab-arrow | notes[1] |  | 米国の Geometry の教科書では、同じ形の矢印を半直線 AB（ray AB）に使うことがある（ray-ab-arrow）。 |
| symbols | vector-arrow-notation | notes[1] |  | 米国の教科書は太字で書き、手書きでは矢印を付ける。 |
| symbols | wave-dash-range-jp | notes[0] |  | 日本の「3〜5」は英語では from three to five か between three and five と言う。 |
| phrases | left-side-minus-right-side | notes[0] | ○ | 日本の答案の型。 |
