# 日本側の主張の文（Phase 5 の監査の前の機械の確かめ 2）

作成: 2026-09-26 ／ `pnpm audit:claims`（scripts/audit/claims.ts）

対象の欄: terms の mapping_note・pitfalls・variants の note・definition_ja、symbols の notes、phrases の notes・variants の note。
慣習差（conventions）は jp の欄そのものが日本側の主張で、生成のときに項目ごとに日本側の資料を出典に入れたので、ここには入れない（監査は慣習差の順で見る）。

- phase4-report G-1 の正規表現（日本(の教科書|では|の高校|の授業|の答案|の中学|の入試|の数学|で)）に当たる文: **296 項目・366 文**
- 広い正規表現（日本・数学 I〜C・中学・高校・学習指導要領・教科書・入試・共通テスト・センター試験）に当たる文: **525 項目・726 文**（主張でない文も混じる。監査の ⑦ で 1 文ずつ見る）

| コレクション | id | 欄 | G-1 | 文 |
|---|---|---|---|---|
| terms | 30-60-90-triangle | pitfalls[1] | ○ | 日本では三角定規の形として覚えるが、英語では辺を短い方から x, x√3, 2x と書く。 |
| terms | aa-similarity | pitfalls[1] | ○ | 相似の記号は日本では ∽、英語では ~（△ADE ~ △ABC）。 |
| terms | aas-congruence | mapping_note | ○ | 見出しの「2 組の角とその間にない 1 辺がそれぞれ等しい」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | aas-congruence | mapping_note |  | 日本の三角形の合同条件には無い（1 辺とその両端の角が等しい、に帰着する）。 |
| terms | aas-congruence | pitfalls[1] | ○ | 日本の合同条件にはこの形がないので、日本の答案では残りの角も等しいことを示してから「1 組の辺とその両端の角がそれぞれ等しい」を使う。 |
| terms | absolute-extrema | mapping_note | ○ | ja.alt の「絶対極値」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | accumulation-function | mapping_note |  | 日本の数IIの「定積分で表された関数」は、上端が変数の ∫ₐˣ f(t)dt と、∫₀¹ f(t)dt のように値が定数になる積分を含む式の両方を扱う問題群の名前。 |
| terms | accumulation-function | mapping_note |  | 後者の「定積分を定数 k とおく」型の問題が米国の教科書にあるかは教科書による。 |
| terms | accumulation-function | mapping_note | ○ | ja.alt の「累積関数」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | adjacent-angles | mapping_note |  | 用例コーパスでは話し言葉に少しあり（ほとんどが Khan Academy の中学の講義）、書き言葉には出てこない。 |
| terms | adjacent-angles | mapping_note | ○ | 見出しの「隣接角」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | adjacent-angles | mapping_note | ○ | 日本の教科書はこの 2 つの角の関係に名前をつけない。 |
| terms | algebraic-expression | mapping_note | ○ | 日本の中学の「文字式」は、文字を使って表した式のこと。 |
| terms | all | en.variants[3].note |  | 話し言葉は半分が Khan Academy の中学の講義で、MIT OCW・Professor Leonard が次ぐ。 |
| terms | alternate-exterior-angles | mapping_note | ○ | 見出しの「外錯角」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | alternate-exterior-angles | mapping_note | ○ | 日本の教科書は錯角（内側）だけを扱い、外側の組に名前を付けない。 |
| terms | alternate-interior-angles-theorem | mapping_note | ○ | 見出しの「錯角の定理」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | alternate-interior-angles-theorem | mapping_note |  | 日本の中2 では「平行線の錯角は等しい」を平行線の性質として扱う。 |
| terms | alternate-interior-angles | pitfalls[0] | ○ | 日本の中学の「錯角」は内側の組のこと。 |
| terms | alternating-series-error-bound | mapping_note | ○ | 見出しの「交代級数の誤差限界」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | alternating-series-test | mapping_note | ○ | 見出しの「交代級数判定法」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | am-gm-inequality | pitfalls[0] | ○ | 日本の高校（数II）では最小値を求める定番の道具。 |
| terms | ambiguous-case | mapping_note | ○ | 見出しの「曖昧な場合」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | ambiguous-case | mapping_note | ○ | 日本の教科書では、2 辺とその一方の対角が与えられたときに三角形が 2 つできる場合を、名前をつけずに扱う。 |
| terms | angle-addition-postulate | mapping_note | ○ | 見出しの「角の加法公理」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | angle-addition-postulate | mapping_note | ○ | 日本の教科書は ∠AOB + ∠BOC = ∠AOC に名前をつけない。 |
| terms | angle-addition-postulate | pitfalls[0] | ○ | 日本の教科書は ∠AOB = 38° のように同じ記号で大きさも表す。 |
| terms | angle-bisector-theorem | pitfalls[1] |  | 日本の数A では内角の二等分線（D は辺 BC を内分）と外角の二等分線（交点は辺 BC を外分）をセットで学ぶ。 |
| terms | angle | pitfalls[1] | ○ | 日本の教科書は区別せず ∠ABC = 60° と書く。 |
| terms | antiderivative | mapping_note |  | 日本の数IIで原始関数と不定積分を同じ意味で使うかは教科書によるので、英語では 1 つを指すのか全体を指すのかで言い分ける。 |
| terms | apothem | pitfalls[0] |  | 日本の問題で「内接円の半径」と書かれている長さが、英語の apothem にあたることがある。 |
| terms | arc-length-of-a-curve | pitfalls[0] |  | 日本の「弧長」は円弧の長さの意味で使うことも多いが、英語の arc length は一般の曲線の長さにも使う。 |
| terms | arc-length | pitfalls[1] |  | 度数法なら 2πr × a/360、弧度法（数II）なら rθ。 |
| terms | arc-measure | mapping_note | ○ | 見出しの「弧の度数」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | arc-measure | mapping_note | ○ | 日本では弧の大きさを中心角で言い、弧そのものに度数を付けない。 |
| terms | arcsine | pitfalls[1] |  | 日本の数I では三角比の表から角を読む。 |
| terms | arctangent | pitfalls[0] |  | 日本の数III の積分 ∫ dx/(1 + x²) は x = tan θ と置換して求めるが、米国では答えを arctan x と書く。 |
| terms | area-between-two-curves | pitfalls[3] |  | 数IIIでは媒介変数表示の曲線で囲まれた面積も扱うが、米国では Calc II の parametric curves の単元で別に扱う。 |
| terms | area-in-polar-coordinates | mapping_note | ○ | 見出しの「極座標での面積」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | area-model | mapping_note |  | 日本の中 3 の教科書も、長方形の面積で式の展開を説明するが、図に決まった名前はない。 |
| terms | area-of-a-regular-polygon | pitfalls[0] |  | 日本の数I では、中心と各頂点を結んで n 個の合同な二等辺三角形に分け、外接円の半径 r を使って (n/2)r² sin(360°/n) と求める。 |
| terms | area-of-the-base | pitfalls[0] | ○ | 日本の教科書は底面積を S として V = Sh と書くが、英語の公式では大文字の B を使う（V = Bh）。 |
| terms | area-problem | mapping_note | ○ | 見出しの「面積問題」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | area-problem | definition_ja |  | 積分の出発点として教科書で紹介される。 |
| terms | area-under-the-curve | pitfalls[1] |  | 日本の「定積分と面積」の節の内容にあたり、面積を求めるときは x 軸より下の部分の定積分に − を付けるか、区間を分けて絶対値にする。 |
| terms | arrange-by-the-variable-of-lowest-degree | mapping_note |  | 日本の因数分解の技法で、英語で説明するなら「次数の最も低い文字について式を整理する」と手順をそのまま言う。 |
| terms | augmented-matrix | pitfalls[0] | ○ | 日本の高校の学習指導要領には含まれないが、米国では Precalculus（OpenStax Algebra and Trigonometry）で扱う。 |
| terms | auxiliary-angle-form | mapping_note |  | 英国の教科書では harmonic form ／ auxiliary angle method と呼ぶことがあるが、米国の用例には出てこない。 |
| terms | average-value-of-a-function | pitfalls[0] | ○ | 日本の高校では扱わない。 |
| terms | bar-chart | pitfalls[0] |  | Khan Academy はどちらも使う（中学の講義では bar graph、AP Statistics では bar chart が多い）。 |
| terms | base-case | mapping_note | ○ | 日本の答案は「[1] n = 1 のとき」と書くだけで、この段に名前をつけないことが多い。 |
| terms | base-n | mapping_note |  | in base ／ written in base ／ base-n representation をまとめて数えると、OpenStax Algebra and Trigonometry の本文にはわずかで、用例コーパスの話し言葉のほうが多い（大半が Khan Academy の中学の講義）。 |
| terms | base-n | pitfalls[1] | ○ | 日本の教科書は 142₍₅₎ と括弧付きの添え字で書く。 |
| terms | base-of-the-natural-logarithm | pitfalls[1] |  | 日本の数III は自然対数を log x と書くが、米国の教科書は ln x と書く。 |
| terms | basic-properties-of-probability | pitfalls[0] |  | 日本の「確率の基本性質」の範囲とは少し違う。 |
| terms | basic-properties-of-probability | pitfalls[1] |  | 数A の確率の基本性質と同じ内容。 |
| terms | basic-variable | pitfalls[0] |  | 教科書により呼び方が違う: MIT 18.06 は pivot variable、Nicholson は leading variable。 |
| terms | bezouts-identity | pitfalls[0] |  | 日本の数A では、一次不定方程式の単元で「a, b が互いに素なら ax + by = 1 は整数解をもつ」という形で出てくる。 |
| terms | biconditional | pitfalls[0] |  | 日本の数I では「双条件文」という名前を使わず、「p ⇔ q」「p は q であるための必要十分条件」「p と q は同値」と言う。 |
| terms | binomial-identities | pitfalls[0] | ○ | 日本の教科書は nCk と書くが、英語の本では縦に並べた (n k) や C(n, k) と書き、n choose k と読む。 |
| terms | binomial-probability | pitfalls[0] |  | 日本の ₙCₖ は、英語では括弧の記号 (n k)（縦に並べる）で書き、n choose k と読む。 |
| terms | blocking | mapping_note | ○ | 見出しの「ブロック化」は日本の高校の教科書に無い、本プロジェクトの訳語。 |
| terms | boundary | pitfalls[0] | ○ | 日本の答案の「境界線を含む／含まない」は、英語ではグラフの実線（solid line）と点線（dashed line）の描き分けでも示す（用例コーパスでは dashed line は話し言葉にも書き言葉にも出てくる）。 |
| terms | box-plot | en.variants[1].note |  | 話し言葉は Khan Academy の中学の講義と Professor Leonard。 |
| terms | can-be-integrated | mapping_note | ○ | 日本の高校で「積分できる」と言うと、ふつうは原始関数を式で書けること（計算できること）を指す。 |
| terms | candidates-test | mapping_note | ○ | 日本の教科書は、閉区間での最大値・最小値を、増減表で端点と極値の値を比べて求め、方法に名前を付けない。 |
| terms | cardioid | pitfalls[0] |  | 日本の数III ／ 数C の教科書では「カージオイド（心臓形）」と書く。 |
| terms | ceiling-function | pitfalls[0] | ○ | 日本の高校のガウス記号 [x] は x 以下の最大の整数（床関数 ⌊x⌋）で、天井関数ではない。 |
| terms | center-of-dilation | pitfalls[1] |  | 日本の「相似の位置にある」2 つの図形で、対応する点を結ぶ直線が集まる点がこれに当たる。 |
| terms | central-limit-theorem | pitfalls[1] |  | 標本の大きさの目安を n ≥ 30（at least 30 など）とすることが多いが、教科書によって違う。 |
| terms | chain-rule | pitfalls[0] | ○ | 日本の高校の教科書は「合成関数の微分法」と呼び、「連鎖律」は大学の呼び方。 |
| terms | change-the-limits-of-integration | pitfalls[0] | ○ | 日本の答案の「x \| 0 → 1 ／ t \| 1 → 2」の対応表を英語で書くなら、when x = 0, u = 1 のように文で書く。 |
| terms | change-together | mapping_note |  | 「ともなって変わる」は日本の中 1 で関数を導入するときの言い方で、英語では y changes as x changes、y depends on x、as x increases, y increases のように、文で言い表す。 |
| terms | change | mapping_note | ○ | 日本の中学の「x の増加量」「y の増加量」は、英語で change in x、change in y と言い、Δx、Δy（delta x、delta y と読む）とも書く。 |
| terms | characteristic-equation | mapping_note |  | 日本の数B の「特性方程式」は、aₙ₊₁ = paₙ + q に対して α = pα + q とおく式を指すことが多い。 |
| terms | chinese-remainder-theorem | pitfalls[1] |  | 日本の数A では「3 で割ると 2 余り、5 で割ると 3 余る整数」のような問題として、定理の名前を出さずに扱うことがある。 |
| terms | closed-interval | pitfalls[0] |  | 数I では定義域を 0 ≦ x ≦ 3 のように不等式で書くのがふつう。 |
| terms | cofunction-identity | mapping_note | ○ | 日本の教科書は名前を付けずに公式を並べる（「90° − θ の三角比」）が、英語では cofunction identities と名前で呼ぶ。 |
| terms | cofunction-identity | pitfalls[1] | ○ | 日本の高校では cot をふつう使わないので tan(90° − θ) = 1/tan θ と書くが、英語の cofunction identity は tan(90° − θ) = cot θ の形になる。 |
| terms | combination-with-repetition | mapping_note | ○ | ₙHᵣ は日本の教科書の記法なので、英語で書くときは ₙ₊ᵣ₋₁Cᵣ（二項係数）の形に直す。 |
| terms | combination-with-repetition | pitfalls[0] | ○ | ₙHᵣ の H は日本の教科書の記号。 |
| terms | combination | pitfalls[1] | ○ | ₙCᵣ は日本の教科書の書き方。 |
| terms | common-logarithm | pitfalls[0] | ○ | 日本の高校の数II では底 10 を省かず log₁₀ x と書く。 |
| terms | compare-coefficients | pitfalls[1] | ○ | 「係数比較法」と「数値代入法」は日本の教科書の呼び名。 |
| terms | complement | pitfalls[0] | ○ | 日本の教科書は補集合を Ā と書く。 |
| terms | complement | pitfalls[0] |  | 英語の本では Aᶜ、A′、Ā など記号は教科書による。 |
| terms | complementary-event | pitfalls[0] | ○ | 日本の教科書は Ā と書くが、英語の教科書では A^c や A′ などを使う（教科書による）。 |
| terms | completely-randomized-design | mapping_note | ○ | 見出しの「完全無作為化計画」は日本の高校の教科書に無い、本プロジェクトの訳語。 |
| terms | completing-the-square | pitfalls[0] |  | 平方完成した形 a(x − h)² + k の呼び方は教科書で分かれる。 |
| terms | complex-number | pitfalls[0] |  | 米国の教科書では a + bi の形を standard form（または rectangular form）と呼ぶ（OpenStax Algebra and Trigonometry）。 |
| terms | complex-plane | pitfalls[0] |  | 数C の「複素数平面」を、英語では complex plane と言う（number は入らない）。 |
| terms | component-form | pitfalls[0] |  | 米国の教科書は成分表示を山かっこ ⟨a₁, a₂⟩ で書き、点の座標 (a₁, a₂) と区別する（OpenStax Calculus Volume 3）。 |
| terms | component-form | pitfalls[0] | ○ | 日本の教科書は丸かっこ。 |
| terms | composite-figure | mapping_note | ○ | 日本の教科書は「いくつかの図形を組み合わせた図形」と説明することが多く、決まった名前を使わない。 |
| terms | composite-function | pitfalls[0] | ○ | 日本の教科書の (f ∘ g)(x) と書き方は同じ。 |
| terms | concavity | pitfalls[0] |  | 日本の「下に凸」は concave up、「上に凸」は concave down。 |
| terms | condition | pitfalls[0] |  | 数I では、真偽が決まる文を「命題」、変数の値で真偽が変わる文を「条件」と分ける。 |
| terms | conditional-probability | pitfalls[0] | ○ | 日本の教科書は P_A(B) と書くが、英語では P(B \| A) と書き、the probability of B given A と読む。 |
| terms | conditional-statement | mapping_note |  | 日本の数I は「命題 p ⇒ q」と言い、この形の命題そのものに名前を付けない（含意は論理学の語）。 |
| terms | conditions-for-a-parallelogram | mapping_note |  | 日本の中 2 では四角形が平行四辺形になるための条件を 5 つまとめて学ぶが、英語にはそれらをまとめた決まった名前がなく、「四角形が平行四辺形であることを示す」（prove that a quadrilateral is a parallelogram）のように、示すことを文で言う。 |
| terms | confidence-level | pitfalls[0] | ○ | 日本の教科書では「信頼度 95%」と言い、英語では 95% confidence level または at the 95% level と言う。 |
| terms | congruence-criteria-for-right-triangles | mapping_note |  | 米国の Geometry は、日本の 2 つの条件のうち「斜辺と他の 1 辺がそれぞれ等しい」を HL（hypotenuse-leg）と呼んで定理として扱い、「斜辺と 1 つの鋭角がそれぞれ等しい」は AAS で示せる。 |
| terms | congruence-criteria | mapping_note |  | 日本の三角形の合同条件は 3 つ（3 組の辺、2 組の辺とその間の角、1 組の辺とその両端の角）で、「合同条件」とまとめて呼ぶ。 |
| terms | congruence-criteria | definition_ja |  | 日本の中2 では「3 組の辺」「2 組の辺とその間の角」「1 組の辺とその両端の角」がそれぞれ等しい、の 3 つ。 |
| terms | congruence-criteria | pitfalls[0] | ○ | AAS（エントリ aas-congruence）は日本の合同条件に無く、日本の答案では残りの角も等しいことを示して「1 組の辺とその両端の角」に直す。 |
| terms | congruence-criteria | pitfalls[0] | ○ | HL（エントリ hl-congruence）は、日本では直角三角形の合同条件（エントリ congruence-criteria-for-right-triangles）として別に扱う。 |
| terms | congruent-arcs | pitfalls[0] | ○ | 日本の教科書は等しい弧を「弧 AB = 弧 CD」のように等号で書き、「等しい弧」と呼ぶ。 |
| terms | congruent | pitfalls[0] | ○ | 合同の記号は日本の教科書では ≡、英語では ≅。 |
| terms | conic-section | pitfalls[0] |  | 日本の数C は「二次曲線」、英語は円錐の切り口として conic section と呼ぶ。 |
| terms | conjugate-roots | mapping_note |  | 日本の「共役な解」は、実数係数の方程式で a + bi が解なら a − bi も解になる、という関係を指す。 |
| terms | constant-function | pitfalls[2] | ○ | 日本の中学の一次関数は y = ax + b で a ≠ 0 とするので、定数関数は一次関数に含めない（エントリ linear-function）。 |
| terms | constant-multiple-rule | mapping_note | ○ | 見出しの「定数倍の法則」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | constant-multiple-rule | mapping_note | ○ | 日本の教科書は {kf(x)}′ = kf′(x) を導関数の性質として示し、名前を付けない。 |
| terms | constant-of-proportionality | pitfalls[0] |  | 見出しは中学の教材（IM Grade 7・Grade 8 の glossary）と授業（Khan Academy の中学）の constant of proportionality にした。 |
| terms | constraint | pitfalls[0] |  | 日本の問題文の「x, y が … を満たすとき」は、英語では subject to the constraint(s) … と書ける。 |
| terms | continuous-compounding | mapping_note | ○ | 日本の高校数学では連続複利を扱わない（e は数III で極限として導入する）。 |
| terms | continuous-compounding | pitfalls[0] |  | 英語は名詞の continuous compounding より、interest compounded continuously ／ continuously compounded interest の形で言うことが多い（教科書は compounded continuously、授業では continuously compounded の語順が多い）。 |
| terms | convenience-sample | mapping_note | ○ | 見出しの「便宜的抽出」は日本の高校の教科書に無い、本プロジェクトの訳語。 |
| terms | coordinate-plane | en.variants[0].note |  | 中学・Algebra の講義と教科書は coordinate plane。 |
| terms | coordinate-proof | mapping_note |  | 日本の数II では「座標を用いて証明せよ」として、図形を座標平面に置き、2 点間の距離や中点の座標で性質を示す。 |
| terms | coordinate-proof | pitfalls[2] |  | 数II では中線定理 AB² + AC² = 2(AM² + BM²) の証明が代表的な例。 |
| terms | coordinate-rule | mapping_note | ○ | 見出しの「座標の規則」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | coordinate-rule | mapping_note | ○ | 日本の教科書は平行移動を「x 軸方向に 3、y 軸方向に −2 だけ平行移動」と言葉で書き、(x, y) → (x + 3, y − 2) の形の記法を使わない。 |
| terms | coordinates | pitfalls[1] |  | 数Aの「座標の考え方」で扱う空間の点の位置も、英語では coordinates in space（(x, y, z)）で言う。 |
| terms | corner-nondifferentiable | mapping_note | ○ | 見出しの「角（微分不可能点）」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | corresponding-angles-of-congruent-figures | pitfalls[1] | ○ | 日本の教科書は合同の記号に ≡ を使い、英語では ≅ を使う（エントリ congruent）。 |
| terms | corresponding-angles-postulate | mapping_note | ○ | 見出しの「同位角の公準」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | corresponding-angles-postulate | mapping_note |  | 日本の中2 では「平行線の同位角は等しい」を平行線の性質として扱う。 |
| terms | corresponding-angles-postulate | mapping_note |  | 米国の教科書では公準（postulate）とするものと定理（theorem）とするものがある。 |
| terms | cosecant | mapping_note | ○ | 日本の高校では csc を使わず 1/sin θ と書く。 |
| terms | cotangent | mapping_note | ○ | 日本の高校では cot を使わず 1/tan θ と書く。 |
| terms | coterminal-angle | mapping_note | ○ | 見出しの「共終角」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | coterminal-angle | mapping_note |  | 日本の数II では一般角 θ + 360°n（動径が同じ角）として扱い、この関係の角に名前を付けない。 |
| terms | coterminal-angle | pitfalls[0] |  | 日本の一般角（エントリ general-angle）は θ + 360°n という角の表し方で、coterminal angle は動径が同じ角どうしの関係を指す。 |
| terms | cpctc | mapping_note | ○ | 見出しの「CPCTC」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | cpctc | mapping_note |  | 日本の証明では「合同な図形の対応する辺（角）は等しい」と文で書き、略語はない。 |
| terms | cramers-rule | pitfalls[0] | ○ | 日本の高校の学習指導要領には含まれない。 |
| terms | critical-point | mapping_note | ○ | 日本の高校の教科書は、f′(x) = 0 となる x に名前を付けない。 |
| terms | critical-point | mapping_note | ○ | 見出しの「臨界点」は日本の高校の教科書に無い、本プロジェクトの訳語。 |
| terms | cross-method | mapping_note |  | 係数を斜めに掛けて組み合わせを探すのは日本の方法で、米国では ac method（ac を 2 つに分けて factoring by grouping、エントリ factoring-by-grouping）、box method、guess and check などと呼ばれる方法で ax² + bx + c を因数分解する。 |
| terms | cross-product | pitfalls[0] | ○ | 日本の高校の数C では外積を扱わない。 |
| terms | cross-sectional-area | pitfalls[0] | ○ | 日本の教科書では断面積を S(x) と書くことがある。 |
| terms | cubic-units | mapping_note | ○ | 見出しの「立方単位」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | cubic-units | mapping_note | ○ | 日本では cm³・m³ のように決まった単位で答える。 |
| terms | cubic-units | pitfalls[0] |  | 日本の問題では体積を cm³ や m³ で答え、「立方単位」とは言わない。 |
| terms | cubic-units | pitfalls[2] |  | 用例コーパスで cubic units は話・書とも使い、話し言葉はほとんどが Khan Academy（多くは中学の講義）、書き言葉は OpenStax Calculus と OpenStax Prealgebra が中心。 |
| terms | cylindrical-shell | mapping_note | ○ | 「円柱の殻」は英語の cylindrical shell を訳した言い方で、日本の高校には決まった名前がない（バウムクーヘン積分の「1 枚の皮」にあたる）。 |
| terms | cylindrical-shell | mapping_note | ○ | 見出しの「円柱の殻」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | decreasing | mapping_note |  | 見出しの「単調に減少する」は 数II（指数・対数関数）の言い方。 |
| terms | decreasing | mapping_note |  | 中学の「右下がり」（1 次関数のグラフ）にも当たるが、英語ではグラフの形ではなく関数の性質（is decreasing）か傾きの符号で言う。 |
| terms | definite-integral | pitfalls[0] |  | 日本の数IIは定積分を F(b) − F(a) で定義するが、米国の教科書は Riemann sum の極限で定義し、F(b) − F(a) で計算できることを微積分学の基本定理として示す。 |
| terms | degree-measure | pitfalls[0] |  | 用例コーパスでは degree measure は話・書とも少ない（話し言葉は Khan Academy の中学の講義だけ）。 |
| terms | derivative-of-a-parametric-curve | mapping_note | ○ | ja.alt の「媒介変数曲線の微分」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | derivative-of-the-exponential-function | mapping_note |  | 日本の「指数関数の導関数」は (eˣ)′ = eˣ と (aˣ)′ = aˣ log a をまとめて言う。 |
| terms | derivative-of-the-exponential-function | pitfalls[0] | ○ | 日本の教科書は aˣ log a と書くが、米国の教科書は aˣ ln a と書く（log は常用対数を指すことがある）。 |
| terms | derivative-of-the-logarithm | pitfalls[0] |  | 日本の数III の log x（自然対数）は、米国では ln x と書き、ell en x や natural log of x と読む。 |
| terms | derivatives-in-polar-form | mapping_note | ○ | 見出しの「極曲線の微分」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | derivatives-of-inverse-trig-functions | pitfalls[0] | ○ | 日本の高校では逆三角関数を扱わない。 |
| terms | derivatives-of-trigonometric-functions | pitfalls[0] | ○ | 日本の教科書の (tan x)′ = 1/cos²x は、米国では sec²x（secant squared x）と書く。 |
| terms | descartes-rule-of-signs | pitfalls[0] | ○ | 日本の高校では扱わない。 |
| terms | determine-the-coefficients | pitfalls[1] |  | 数I の「二次関数の決定」はこのエントリで扱う。 |
| terms | determine-where-the-function-is-increasing-and-decreasing | pitfalls[0] |  | 端点を含めるかどうかは教科書による。 |
| terms | difference-quotient | mapping_note | ○ | 見出しの「差分商」は日本の高校の教科書に無い、本プロジェクトの訳語。 |
| terms | difference-quotient | mapping_note | ○ | 日本の高校では (f(a + h) − f(a))/h を「平均変化率」として扱い、別の名前をつけない。 |
| terms | differential-equation | pitfalls[0] |  | 高等学校学習指導要領（平成30年告示）の本文には「微分方程式」の語が無く、数IIIの教科書で扱うかは教科書による。 |
| terms | dilation | mapping_note |  | 日本の中3 の相似は拡大図・縮図や相似の位置で扱い、中心と比を決めた変換そのものに名前を付けない。 |
| terms | dilation | pitfalls[2] |  | 用例コーパスでは、話し言葉はほとんどが Khan Academy の中学の講義で、書き言葉にはほとんど出てこない。 |
| terms | direct-proportion | mapping_note | ○ | 日本の中学 1 年の「比例」は、y = ax（a は 0 でない定数）で表される関係を指す。 |
| terms | discriminant | pitfalls[0] | ○ | 日本の答案では D と置いて「D > 0 より」と書く。 |
| terms | disk-method | mapping_note |  | 日本の数IIIでは回転体の体積を V = π∫ₐᵇ {f(x)}²dx の式で求めるだけで、方法に名前を付けない。 |
| terms | disk-method | mapping_note | ○ | 見出しの「円板法」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | disk | pitfalls[0] |  | 米国の教科書は disk。 |
| terms | displacement | pitfalls[0] |  | 数IIIでは「位置の変化量」と言い、変位は物理の用語。 |
| terms | displacement | pitfalls[2] |  | 米国の教科書では、数直線上を動く点を a particle moving along a line と言い、位置を s(t) や x(t)、速度を v(t) と書く。 |
| terms | distance-formula | pitfalls[0] | ○ | 日本では中 3 で三平方の定理を使って 2 点間の距離を求め、数II で公式として扱う。 |
| terms | diverge-to-negative-infinity | pitfalls[0] |  | 日本の数III は自然対数を log x と書くが、米国の教科書は ln x と書く。 |
| terms | divergence | pitfalls[1] |  | 日本の数III と同じく、英語でも振動する数列は diverge する（収束しないもの全体が divergence）。 |
| terms | divisibility | pitfalls[1] |  | 数A では「a は b で割り切れる」「a は b の倍数」と言い、divisibility に当たる名詞はあまり使わない。 |
| terms | divisibility | pitfalls[2] |  | 書き言葉は OpenStax Prealgebra・MIT の講義ノート・OpenStax Elementary Algebra、話し言葉は Khan Academy の中学の講義が中心。 |
| terms | divisor | mapping_note |  | 米国の小中学校の教材（IM・OpenStax Prealgebra）は「約数」を factor と言い、the factors of 12 のように使う。 |
| terms | domain-and-range | pitfalls[0] | ○ | 日本の教科書の −1 ≦ x ≦ 3 は、英語では ≤ を使って −1 ≤ x ≤ 3 と書く。 |
| terms | domain | definition_ja |  | 中学では「x の変域」と言う。 |
| terms | domain | pitfalls[0] |  | 中学の「x の変域」も英語では domain（エントリ domain-and-range）。 |
| terms | dot-product | mapping_note |  | 高校の「内積」は英語の dot product（OpenStax は scalar product とも書く）。 |
| terms | elimination | mapping_note |  | 日本の「加減法」は式を足す・引くという操作から付いた名前で、英語は文字を消去することから elimination method（method of elimination）と呼ぶ。 |
| terms | empirical-rule | mapping_note |  | 日本の数B では正規分布表を使って確率を求め、この目安に名前を付けない。 |
| terms | end-behavior | mapping_note | ○ | 見出しの「関数の終端挙動」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | end-behavior | mapping_note |  | 日本の数III では x → ±∞ のときの極限（エントリ limit-at-infinity）として扱い、まとめた名前はない。 |
| terms | end-behavior | pitfalls[1] |  | 日本の数III の lim を使う書き方とは形が違う。 |
| terms | end-of-proof | mapping_note | ○ | 日本の答案は最後に「（証明終わり）」や「終」と書く。 |
| terms | end-of-proof | definition_ja | ○ | 日本の答案では「（証明終わり）」や「終」と書く。 |
| terms | epsilon-delta-definition | pitfalls[0] | ○ | 日本の高校（数III）では扱わない。 |
| terms | equal-angles | pitfalls[0] | ○ | 日本の教科書は ∠A = ∠B と書くが、∠A ≅ ∠B と m∠A = m∠B を使い分ける書き方もある。 |
| terms | equal | pitfalls[1] | ○ | 日本の教科書は線分や角にも = を使う（エントリ congruent、equal-angles）。 |
| terms | equation-in-quadratic-form | mapping_note | ○ | 見出しの「2 次方程式の形の方程式」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | equation-in-quadratic-form | mapping_note | ○ | 日本では「x² = t とおく」のように、おき換えの手順として扱い、この種類の方程式に名前を付けない（x⁴ + ax² + b = 0 の形は「複 2 次式」と呼ぶことがある）。 |
| terms | equation-of-a-circle | pitfalls[0] |  | 米国の教科書は (x − h)² + (y − k)² = r² と中心を (h, k) で書き、standard form of the equation of a circle と呼ぶ（OpenStax Algebra and Trigonometry）。 |
| terms | equation-of-a-plane | pitfalls[1] |  | 数C では法線ベクトルとの内積で導く。 |
| terms | equiangular-triangle | mapping_note | ○ | 見出しの「等角三角形」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | equiangular-triangle | mapping_note | ○ | 日本では 3 つの角が等しい三角形は正三角形（equilateral triangle）と呼び、角で呼ぶ名前を使わない（平面では同じ三角形）。 |
| terms | equivalence-relation | pitfalls[1] | ○ | 日本の高校で習う「命題 p と q は同値」は equivalent（論理の同値）で、同値関係（equivalence relation）とは別の話。 |
| terms | eulerian-path | pitfalls[1] |  | 教科書によっては Euler path を始点に戻らないものに限り、Euler circuit と対にする。 |
| terms | eulers-formula | pitfalls[0] | ○ | 日本の高校の数C では扱わない。 |
| terms | evaluate | pitfalls[0] | ○ | ja.alt の「式を評価する」は直訳に近く、日本の中学・高校の教科書は「式の値を求める」と書く。 |
| terms | existence-proof | pitfalls[1] |  | 数III の中間値の定理を使って「解が存在することを示せ」と答えるのは、解を具体的に求めない（非構成的な）存在証明にあたる。 |
| terms | existential-quantifier | pitfalls[1] |  | 数I の「ある…」の否定が「すべての…でない」になるのと同じ規則。 |
| terms | expanding-and-condensing-logs | mapping_note | ○ | 見出しの「対数の展開と圧縮」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | expanding-and-condensing-logs | mapping_note | ○ | 日本の教科書では「対数の性質を使って式を変形する」とだけ言う。 |
| terms | experimental-probability | mapping_note |  | experimental probability は参照（CED・OpenStax・IM・CK-12）には出てこず、用例コーパスでは Khan Academy の中学の講義に少し出てくるだけ。 |
| terms | exponential-model | mapping_note | ○ | 見出しの「指数モデル」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | exponential-regression | pitfalls[0] | ○ | 日本の高校では扱わない。 |
| terms | extended-euclidean-algorithm | pitfalls[0] |  | 数A の一次不定方程式では、この手順を名前を付けずに「互除法の式を逆にたどる」形で使う。 |
| terms | extraneous-solution | pitfalls[1] | ○ | 日本では「解の吟味」（エントリ checking-whether-the-solution-makes-sense）で除くと言う。 |
| terms | extreme-value-theorem | mapping_note | ○ | ja.alt の「極値定理」は日本の教科書に無い、本プロジェクトの訳語（extreme value theorem の直訳）。 |
| terms | factored-form | mapping_note | ○ | 見出しの「因数分解形」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | factored-form | mapping_note | ○ | 日本の教科書では y = a(x − α)(x − β) を「x 軸と x = α, β で交わる放物線」の式として扱う。 |
| terms | factoring-by-grouping | mapping_note | ○ | 見出しの「グループ分けによる因数分解」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | factoring-by-grouping | mapping_note | ○ | 日本の教科書では名前を付けず、「組み合わせてくくる」「共通因数をくくり出す」と手順で説明する。 |
| terms | factoring | mapping_note |  | 英語の授業・教科書では動詞の factor で言うことが多く（Factor the polynomial.、factor completely）、名詞は factoring または factorization。 |
| terms | fail-to-reject | mapping_note | ○ | 日本の教科書は「棄却されない」「棄却できない」と受け身・可能で書くが、英語は主語を we にして fail to reject（話し言葉）／ do not reject（書き言葉）と言う。 |
| terms | feasible-region | pitfalls[0] | ○ | 日本の高校の教科書では「連立不等式の表す領域」と言う。 |
| terms | find-the-arc-length | pitfalls[0] |  | 数IIIの「曲線の長さ」は英語では arc length。 |
| terms | find-the-asymptotes | mapping_note |  | 日本の「漸近線を求める」は 1 つの指示だが、英語の問題や説明では垂直な漸近線（vertical asymptotes）と水平な漸近線（horizontal asymptote）を分けて求めることが多い（用例コーパスでは find the vertical asymptotes のほうが find the asymptotes より多い）。 |
| terms | find-the-equation | en.variants[1].note |  | 話し言葉は大半が Khan Academy（特に中学の講義）、書き言葉は多くが OpenStax Algebra and Trigonometry。 |
| terms | first-derivative-test | mapping_note |  | 日本の数II・数III は、f′(x) の符号の変化から極大・極小を判定することを増減表で行い、判定法に名前を付けない。 |
| terms | first-derivative-test | mapping_note | ○ | 見出しの「第 1 次導関数判定法」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | floor-function | definition_ja | ○ | 日本では [x]、英語では ⌊x⌋ と書く。 |
| terms | floor-function | pitfalls[1] |  | 日本の [x] を英語の文にそのまま書くと、ただの角かっこ（brackets）に見える。 |
| terms | flowchart-proof | mapping_note | ○ | 見出しの「フローチャート証明」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | flowchart-proof | mapping_note | ○ | 日本の教科書には、根拠を矢印でつなぐこの答案の形式はない。 |
| terms | foil | mapping_note | ○ | 日本では分配法則で 1 項ずつ掛けて展開し、順序の覚え方に名前はない。 |
| terms | function-of-several-variables | pitfalls[0] |  | 授業と教科書で多いのは 2 変数の場合の function of two variables（特に書き言葉に多い）。 |
| terms | fundamental-theorem-of-calculus-part-1 | mapping_note |  | 日本の数IIでは d/dx ∫ₐˣ f(t)dt = f(x) を「微分と積分の関係」として式だけで扱い、定理の番号は付けない。 |
| terms | fundamental-theorem-of-calculus-part-1 | mapping_note |  | 番号や名前（first ／ second fundamental theorem）の付け方は教科書による。 |
| terms | fundamental-theorem-of-calculus-part-2 | mapping_note |  | 日本の数IIでは ∫ₐᵇ f(x)dx = F(b) − F(a) を定積分の定義として教えるので、定理として名前を付けない。 |
| terms | fundamental-theorem-of-calculus-part-2 | mapping_note |  | 番号と名前の付け方は教科書による。 |
| terms | fundamental-theorem-of-calculus | mapping_note | ○ | 日本の高校では「微分と積分の関係」として d/dx ∫ₐˣ f(t)dt = f(x) と F(b) − F(a) の計算を扱うことが多く、定理の名前はあまり前面に出ない。 |
| terms | fundamental-theorem-of-calculus | mapping_note |  | 番号の付け方は教科書による。 |
| terms | gaussian-elimination | pitfalls[1] |  | 行階段形で止めて後ろから代入するか、既約行階段形（reduced row-echelon form）まで進めるかは教科書による。 |
| terms | general-addition-rule | mapping_note |  | 日本の数A の「確率の加法定理」は互いに排反な事象の式 P(A ∪ B) = P(A) + P(B) を指し、重なりを引く式は「和事象の確率」として別に扱う。 |
| terms | general-form-of-a-circle | pitfalls[0] |  | 米国の教科書は係数に D, E, F を使うことが多い。 |
| terms | general-multiplication-rule | pitfalls[0] | ○ | 日本の教科書は条件付き確率を P_A(B) と書くが、OpenStax Introductory Statistics は P(B \| A) と書き（P(A \| B) と合わせて 44 件）、B given A と読む。 |
| terms | general-solution | definition_ja |  | 方程式の解をすべて、整数 n や任意定数 C を使って 1 つの式で表したもの。 |
| terms | glide-reflection | pitfalls[0] | ○ | 日本の中学・高校の教科書では「映進」という名前を使わず、対称移動と平行移動の組み合わせとして扱う。 |
| terms | graph-network | pitfalls[1] |  | 数学 C は単に「グラフ」と呼ぶ。 |
| terms | greater-than-or-equal-to | pitfalls[0] | ○ | 記号は日本の教科書では ≧、米国の教科書（OpenStax）では ≥。 |
| terms | greatest-common-divisor | en.variants[1].note |  | 話し言葉では Khan Academy の中学の講義が最も多く、The Organic Chemistry Tutor・Professor Leonard・patrickJMT が続く。 |
| terms | greatest-common-divisor | en.variants[3].note |  | 話し言葉は MIT OCW が中心で、Khan Academy の中学の講義にも出てくる。 |
| terms | greatest-common-divisor | pitfalls[1] | ○ | 日本の教科書は記号 gcd(a, b) を使わず言葉で書く。 |
| terms | grouped-sequence | mapping_note |  | 項をいくつかずつの組（group）に分けて考える日本の受験の手法で、英語で説明するなら group the terms like this: (1), (2, 3), (4, 5, 6), … と式で見せる。 |
| terms | half-angle-formulas | pitfalls[0] |  | 米国の教科書は sin(α/2) = ±√((1 − cos α)/2) と平方根の形で書く（符号は α/2 の象限で決める）。 |
| terms | half-angle-formulas | pitfalls[0] | ○ | 日本の教科書は 2 乗の形で書く。 |
| terms | hexadecimal | pitfalls[0] | ○ | 日本の教科書は 2F₍₁₆₎ のように括弧つきの添字で基数を書く。 |
| terms | hl-congruence | pitfalls[0] |  | 日本の直角三角形の合同条件は 2 つある。 |
| terms | horizontal-line-test | mapping_note | ○ | 見出しの「水平線テスト」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | horizontal-line-test | mapping_note |  | 日本の数III では「単調増加（減少）なら逆関数がある」のように説明し、判定法に名前を付けない。 |
| terms | hydrostatic-force | mapping_note | ○ | 日本語の見出し「静水圧による力」は日本の教科書に無い、本プロジェクトの訳語（静水圧は hydrostatic pressure で、板全体が受ける力とは別の量）。 |
| terms | hydrostatic-force | pitfalls[1] | ○ | 日本の高校数学の学習指導要領（平成30年告示）には無い（物理の内容）。 |
| terms | hyperbola | definition_ja |  | 数学 C では、2 つの定点（焦点）からの距離の差が一定である点の集まりとして定める。 |
| terms | hyperbola | pitfalls[0] |  | 中 1 の反比例 y = a/x のグラフも、数 C の二次曲線 x²/a² − y²/b² = 1 も、同じ hyperbola。 |
| terms | hyperbolic-functions | pitfalls[0] | ○ | 日本の高校では扱わない。 |
| terms | hypothesis | pitfalls[0] |  | 統計の「仮説」（数I データの分析の仮説検定）も英語では hypothesis で、別の語。 |
| terms | identity-matrix | definition_ja |  | E（米国の教科書では I）と書く。 |
| terms | identity-matrix | pitfalls[0] | ○ | 日本の教科書は単位行列を E で表すが、英語の教科書は I で表す（OpenStax Algebra and Trigonometry は次数を添えて Iₙ）。 |
| terms | image | mapping_note | ○ | 日本の中学では「移した図形」「移動後の図形」と言い、像という言葉は写像（大学）で使うことが多い。 |
| terms | imaginary-number | pitfalls[0] |  | 英語の imaginary number は、教科書によって bi（純虚数）だけを指すこともある（OpenStax Algebra and Trigonometry は bi の形の数として説明する）。 |
| terms | imaginary-number | pitfalls[0] |  | 日本の「虚数」は b ≠ 0 の複素数全体。 |
| terms | imaginary-solution | mapping_note |  | 日本の「虚数解」（実数でない解）をはっきり言うときは nonreal (complex) solution、imaginary solution。 |
| terms | implicit-differentiation | mapping_note | ○ | ja.alt の「陰関数微分」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | improper-integral | pitfalls[1] | ○ | 日本の高校の範囲外。 |
| terms | inclusion-exclusion-principle | pitfalls[0] |  | 数 A の n(A ∪ B) = n(A) + n(B) − n(A ∩ B) は 2 つの集合の場合。 |
| terms | inclusion-exclusion-principle | pitfalls[0] | ○ | 日本の高校の教科書はこの原理に名前を付けない。 |
| terms | increasing-and-decreasing | pitfalls[0] |  | 日本の数II・数III は、微分を使って不等式 f(x) > g(x) を証明する方法（h(x) = f(x) − g(x) の増減を調べる）を節にしている。 |
| terms | indefinite-integral | mapping_note |  | 日本の数IIで「不定積分」と「原始関数」を同じ意味で使うかは教科書による。 |
| terms | indefinite-integral | definition_ja |  | 微分すると f(x) になる関数全体を、積分定数 C を付けて F(x) + C の形で表したもの。 |
| terms | indefinite-integral | pitfalls[1] | ○ | ∫(1/x)dx は日本では log\|x\| + C と書くが、米国の教科書では ln\|x\| + C と書く。 |
| terms | indefinite-integral | pitfalls[1] |  | 米国の高校では log x を底 10 の常用対数と読むので、答案では ln を使う。 |
| terms | independence-of-events | pitfalls[2] |  | 数 A の「独立な試行」も同じ考え方。 |
| terms | independent-system | mapping_note | ○ | 見出しの「独立な連立方程式」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | independent-system | mapping_note | ○ | 日本では「解がただ 1 組」「解が無数にある（不定）」「解がない（不能）」と言い、連立方程式の種類に名前を付けない。 |
| terms | independent-system | pitfalls[1] |  | 教科書によって分類の仕方が違う。 |
| terms | indirect-measurement | mapping_note |  | 数I の「測量」は、直接測れない高さや距離を三角比・相似で求める問題を指す。 |
| terms | inductive-step | mapping_note | ○ | 見出しの「帰納段階」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | inductive-step | mapping_note | ○ | 日本の答案では「n = k のとき成り立つと仮定すると、n = k + 1 のとき …」と書き、段階に名前をつけない。 |
| terms | inequality-sign | pitfalls[0] | ○ | 日本の教科書の ≦ ≧ は、米国の教科書（OpenStax）では ≤ ≥ と書く。 |
| terms | inequality | pitfalls[0] | ○ | 日本の教科書の ≦ ≧ は、米国の教科書（OpenStax）では ≤ ≥ と書く。 |
| terms | inferential-statistics | pitfalls[0] | ○ | 日本の数学 B の単元名は「統計的な推測」。 |
| terms | infinite-discontinuity | mapping_note | ○ | 見出しの「無限不連続」は日本の高校の教科書に無い、本プロジェクトの訳語。 |
| terms | infinite-limit | mapping_note | ○ | 見出しの「無限大の極限」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | infinite-limit | mapping_note |  | 日本の数III は同じことを「正の無限大（負の無限大）に発散する」と言う。 |
| terms | infinite-series | pitfalls[1] |  | 日本の「級数」はふつう無限級数を指す。 |
| terms | influential-point | mapping_note | ○ | 見出しの「影響点」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | inscribed-polygon | pitfalls[1] |  | 日本の数A では「円に内接する四角形」の性質（向かい合う角の和が 180°）として習う。 |
| terms | instantaneous-rate-of-change | mapping_note | ○ | 見出しの「瞬間変化率」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | instantaneous-rate-of-change | mapping_note |  | 日本の数II は同じ量を微分係数と呼ぶ。 |
| terms | instantaneous-velocity | mapping_note |  | 数II の「瞬間の速さ」は位置の変化率で負にもなるので、英語では velocity（向きを含む）に当たる。 |
| terms | instantaneous-velocity | mapping_note |  | 英語の speed は velocity の絶対値（数III の「速さ」）を指す。 |
| terms | integrals-giving-inverse-trig-functions | mapping_note | ○ | 日本の高校では逆三角関数を扱わないので、∫1/(1 + x²)dx は x = tan θ と置換して定積分の値だけを求める。 |
| terms | integration-by-completing-the-square | mapping_note | ○ | 日本の高校では逆三角関数を使わないので、x + 1 = 2 tan θ と置換して定積分の値だけを求める。 |
| terms | integration-by-completing-the-square | mapping_note | ○ | 見出しの「平方完成による積分」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | integration-by-long-division | mapping_note | ○ | 日本では「分子の次数を分母より下げてから積分する」と説明し、米国の AP Calculus の CED は topic 6.10 で long division を使う積分として同じ手順を扱う。 |
| terms | integration-by-long-division | mapping_note | ○ | 見出しの「長除法による積分」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | integration-by-long-division | pitfalls[0] |  | 日本の「整式の割り算」は、米国では long division と言い、筆算の形で書く。 |
| terms | integration-by-parts | pitfalls[0] | ○ | 日本の教科書の ∫fg′dx = fg − ∫f′g dx の形より、米国では u と dv を決めて ∫u dv = uv − ∫v du と書くのがふつう。 |
| terms | integration-by-substitution | mapping_note |  | 日本の置換積分法は、g(x) = t とおく形と x = g(t) とおく形の両方を含む。 |
| terms | integration-by-substitution | mapping_note |  | 教科書の節の名前や答案では単に substitution（教科書によっては the substitution rule）とも書く。 |
| terms | integration-by-substitution | mapping_note | ○ | ja.alt の「置換法則」は日本の教科書に無い、本プロジェクトの訳語（英語 substitution rule の訳）。 |
| terms | integration-by-substitution | pitfalls[0] | ○ | 日本の教科書は新しい変数に t を使うことが多いが、米国ではほぼ u を使う（名前も u-substitution）。 |
| terms | integration-formulas | pitfalls[1] | ○ | n = −1 のときは ln\|x\| + C（日本の教科書では log\|x\| + C）。 |
| terms | integration-formulas | pitfalls[2] |  | 米国の高校の教科書では log a は底 10 の常用対数を表すので、答案では ln を使う。 |
| terms | intercepted-arc | mapping_note | ○ | 見出しの「切片の弧」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | intercepted-arc | mapping_note |  | 日本の数A は「弧 AB に対する円周角」と言い、角の側から弧を「切り取られた弧」と呼ばない。 |
| terms | intercepted-arc | pitfalls[0] | ○ | 日本では同じことを「同じ弧に対する中心角の半分」と中心角で言う。 |
| terms | intersecting-chords-theorem | mapping_note | ○ | 見出しの「交わる弦の定理」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | intersecting-chords-theorem | mapping_note | ○ | 日本では方べきの定理の 1 つの場合（2 本の弦 AB, CD が円の内部の点 P で交わるとき PA·PB = PC·PD）として扱い、この場合だけの名前は付けない。 |
| terms | intersecting-chords-theorem | pitfalls[0] | ○ | 日本では方べきの定理の 1 つの場合として習い、この場合だけの名前は付けない。 |
| terms | interval-notation | pitfalls[0] | ○ | 日本の高校では 2 < x ≦ 5 のように不等式で書き、この書き方は大学で使う（閉区間 closed-interval、開区間 open-interval）。 |
| terms | interval-notation | pitfalls[0] |  | 米国の教科書は Algebra 1（OpenStax Elementary Algebra）から、不等式の解をこの形でも書かせる。 |
| terms | interval-of-integration | mapping_note |  | 日本の「積分区間」は区間 a ≦ x ≦ b そのものを指すが、米国では区間より両端の値を limits of integration（話し言葉では bounds of integration も）と呼ぶのがふつう。 |
| terms | interval | pitfalls[0] | ○ | 日本の教科書は区間を a ≦ x ≦ b と不等式で書くが、英語の教科書では区間記法 [a, b]、(a, b)、[a, ∞) も使う。 |
| terms | inverse-proportion | mapping_note | ○ | 日本の中学 1 年の「反比例」は、y = a/x（a は 0 でない定数）、つまり xy = a（一定）で表される関係。 |
| terms | inverse-trigonometric-function | pitfalls[0] | ○ | 日本の高校の学習指導要領には含まれないが、米国では Precalculus（OpenStax Algebra and Trigonometry）で扱い、AP Calculus でも微分する（CED topic 3.3）。 |
| terms | is-monotonically-increasing | mapping_note |  | 等号を含めるかどうかの定義は教科書によるので、区別するときは strictly increasing（狭義）と nondecreasing（広義）を使う。 |
| terms | is-monotonically-increasing | pitfalls[0] |  | 中学の「右上がり」（1 次関数のグラフ）は、英語ではグラフの形ではなく is increasing か the slope is positive と言う。 |
| terms | joint-variation | mapping_note | ○ | 見出しの「結合変化」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | joint-variation | mapping_note | ○ | 日本では「z は x と y の積に比例する」と言う。 |
| terms | jump-discontinuity | mapping_note | ○ | 見出しの「跳躍不連続」は日本の高校の教科書に無い、本プロジェクトの訳語。 |
| terms | lagrange-error-bound | mapping_note | ○ | 見出しの「ラグランジュの誤差限界」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | lagrange-error-bound | mapping_note |  | 日本の大学の教科書はテイラーの定理の剰余項（ラグランジュの剰余項）として扱い、その上からの評価に名前をつけない。 |
| terms | law-of-detachment | pitfalls[0] |  | 米国の Geometry の教科書では law of detachment、論理学・離散数学では modus ponens と呼ぶ。 |
| terms | law-of-sines | pitfalls[0] |  | 日本の正弦定理は「= 2R」（R は外接円の半径）まで含めて書く。 |
| terms | law-of-syllogism | pitfalls[0] | ○ | 日本の数学で言う三段論法（p ⇒ q、q ⇒ r なら p ⇒ r）は、英語では law of syllogism（論理学では hypothetical syllogism）。 |
| terms | laws-of-exponents | en.variants[0].note |  | 話し言葉では Khan Academy の中学の講義と Professor Leonard が中心。 |
| terms | laws-of-exponents | pitfalls[0] |  | 用例コーパスの話し言葉では exponent rules が首位で、大半は Khan Academy の中学の講義と Professor Leonard。 |
| terms | leading-digit | pitfalls[0] |  | 用例コーパスでは leading digit は少なく、話し言葉（Khan Academy の中学の講義）にしか出てこない。 |
| terms | least-common-denominator | en.variants[0].note |  | 教科書は最初にこの形で導入し、あとは LCD と書く（OpenStax）。 |
| terms | least-common-multiple | en.variants[0].note |  | 話し言葉では少ない（Khan Academy の中学の講義・NancyPi）。 |
| terms | least-common-multiple | en.variants[1].note |  | 話し言葉ではこちらがずっと多く、ほとんどが Khan Academy の中学の講義。 |
| terms | left-hand-limit | pitfalls[0] | ○ | 日本の教科書は x → a − 0 と書くが、米国の教科書は x → a⁻ と書き、a minus と読む（approaches a from the left）。 |
| terms | left-riemann-sum | mapping_note | ○ | 見出しの「左リーマン和」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | left-riemann-sum | pitfalls[0] |  | 日本の区分求積法では Σ_{k=0}^{n−1}（左端）と Σ_{k=1}^{n}（右端）を名前を付けずに使うが、AP の CED（topic 6.2）は left ／ right ／ midpoint Riemann sums と trapezoidal sums に名前を付けて比べる。 |
| terms | less-than-or-equal-to | pitfalls[0] | ○ | 記号は日本の教科書では ≦、米国の教科書（OpenStax）では ≤。 |
| terms | let-u-equal | en.variants[2].note |  | 答案・教科書では Let u = x² + 1. のように = で書く。 |
| terms | let-u-equal | pitfalls[0] | ○ | 日本の答案の「x² + 1 = t とおく」は式が先だが、英語では Let u = x² + 1. と新しい文字を先に書く。 |
| terms | let-u-equal | pitfalls[1] |  | 中学の文章題の「〜を x とする」も同じ形で、文字を先に書いて Let x = the number of students. とする。 |
| terms | lhopitals-rule | pitfalls[2] |  | 学習指導要領（平成30年告示）の本文に「ロピタル」は無い。 |
| terms | lhopitals-rule | pitfalls[2] | ○ | 日本の高校の答案で使ってよいかは教科書・先生による。 |
| terms | liate | mapping_note | ○ | 米国の教科書（OpenStax Calculus Volume 2）が紹介する覚え方で、日本の教科書には対応するものがない。 |
| terms | like-radicals | mapping_note | ○ | 見出しの「同類根号」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | like-radicals | mapping_note |  | 日本の中 3 では「根号の中が同じ数」の和・差として、名前を付けずに計算する。 |
| terms | likelihood | pitfalls[0] |  | 中学の確率で言う likelihood は「起こりやすさ」の意味。 |
| terms | limit-at-infinity | mapping_note | ○ | 見出しの「無限遠での極限」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | limit-at-infinity | mapping_note |  | 日本の数III は「x → ∞ のときの極限」と言う。 |
| terms | limit-at-infinity | pitfalls[0] |  | x → ±∞ でのグラフのふるまいを、米国の教科書は end behavior と言う（用例コーパスの書き言葉に多い）。 |
| terms | limit-comparison-test | mapping_note | ○ | 見出しの「極限比較判定法」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | limit-of-a-riemann-sum | pitfalls[1] |  | 日本の区分求積法は区間を n 等分して端点をとる形がほとんどだが、OpenStax Calculus Volume 1 の定義では幅の違う分け方や任意の代表点（sample point, xᵢ*）も許す。 |
| terms | limit-of-sine-x-over-x | mapping_note |  | 日本の数III の節「三角関数の極限」の中心は lim_{x→0} sin x / x = 1 で、英語では名前を付けず、式をそのまま the limit as x approaches 0 of sine x over x equals 1 と読む。 |
| terms | line | pitfalls[1] | ○ | 日本の教科書は記号を使わず「直線 AB」と書く。 |
| terms | linear-approximation | mapping_note | ○ | ja.alt の「接線近似」は日本の教科書に無い、本プロジェクトの訳語（tangent line approximation の訳）。 |
| terms | linear-function | pitfalls[0] |  | m が傾き（slope）、b が y 切片（y-intercept）で、日本の y = ax + b の a が m に当たる。 |
| terms | linear-function | pitfalls[1] | ○ | 日本の中学の一次関数は a ≠ 0 とする。 |
| terms | linear-inequality | pitfalls[0] | ○ | 日本の教科書は ≦ ≧、英語の教材は ≤ ≥ と書く。 |
| terms | linear-inequality | pitfalls[1] | ○ | そのグラフ（半平面）は日本では数II の「不等式の表す領域」で扱う。 |
| terms | linear-pair | mapping_note | ○ | 見出しの「一直線をなす角」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | linear-pair | mapping_note | ○ | 日本では「隣り合う 2 つの角の和が 180°」を性質として扱い、2 角の組に名前を付けない。 |
| terms | linear-recurrence-relation | pitfalls[0] |  | 日本の数B では「線形漸化式」という名前を使わないことが多く、aₙ₊₁ = paₙ + q の形や隣接 3 項間の漸化式として個別に扱う。 |
| terms | linear-transformation-of-a-random-variable | pitfalls[0] | ○ | 分散の記号は日本の教科書が V(X)。 |
| terms | linear-transformation | pitfalls[0] | ○ | 日本の高校（旧課程）は「一次変換」、大学の線形代数は「線形変換」「線形写像」と呼ぶ。 |
| terms | linearity-of-expectation | pitfalls[0] |  | 日本の数B では E(X + Y) = E(X) + E(Y) や E(aX + b) = aE(X) + b を公式として扱う。 |
| terms | linearly-independent | pitfalls[0] | ○ | 日本の高校は「一次独立」、大学の線形代数は「線形独立」と呼ぶことが多いが、英語はどちらも linearly independent（名詞は linear independence）。 |
| terms | literal-equation | mapping_note | ○ | 見出しの「リテラル方程式」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | literal-equation | mapping_note | ○ | 日本では中 2 で「等式の変形」（エントリ rearranging-an-equation）として扱い、この種の等式に名前はない。 |
| terms | local-extremum | mapping_note | ○ | ja.alt の「相対極値」は日本の教科書に無い、本プロジェクトの訳語（relative extremum の訳）。 |
| terms | local-maximum | mapping_note | ○ | ja.alt の「相対最大値」は日本の教科書に無い、本プロジェクトの訳語（relative maximum の訳）。 |
| terms | logarithm | pitfalls[2] | ○ | 日本の高校の log x（数III）は自然対数。 |
| terms | logical-connective | pitfalls[0] |  | 日本の数I では「かつ」「または」「でない」を扱うが、「論理結合子」という名前は使わない。 |
| terms | logical-connective | pitfalls[0] |  | 否定も数I では上線（p̄）で書き、¬p や ~p の記号は使わない。 |
| terms | logical-connective | pitfalls[1] |  | 数学の or は両方が真の場合も真になる（日本の「または」と同じ）。 |
| terms | logistic-growth | mapping_note | ○ | 見出しの「ロジスティック増加」は日本の高校の教科書に無い、本プロジェクトの訳語。 |
| terms | make-a-sign-chart | mapping_note |  | 日本の増減表は x・f′(x)・f(x) の行を 1 つの表にまとめるが、この表に当たる定型の表は AP の CED にも OpenStax Calculus にも出てこない。 |
| terms | mean-absolute-deviation | pitfalls[0] | ○ | 日本の中学・高校では扱わず、散らばりは範囲・四分位範囲・分散・標準偏差（エントリ standard-deviation）で表す。 |
| terms | midline | mapping_note | ○ | 見出しの「振動の中心線」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | midline | mapping_note |  | 日本の数II では y = sin θ + 1 のグラフを「y 軸方向に 1 平行移動したもの」として扱い、この線に名前を付けない。 |
| terms | midpoint-formula | mapping_note | ○ | 見出しの「中点公式」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | midpoint-formula | mapping_note | ○ | 日本の教科書は「中点の座標」として式を示す。 |
| terms | midpoint-riemann-sum | mapping_note | ○ | 見出しの「中点リーマン和」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | mixture-problem | mapping_note |  | 日本の「濃度の問題」は、食塩水の濃度など、濃さの違うものを混ぜ合わせる文章題を指す。 |
| terms | monomial | pitfalls[0] | ○ | 日本の中学では多項式を単項式の和（項が 2 つ以上）として単項式と区別するが、英語の polynomial は monomial も含む（エントリ polynomial）。 |
| terms | monotone-convergence-theorem | pitfalls[1] |  | 数III の教科書では「有界な単調数列は収束する」を定理の名前なしで扱うことがある。 |
| terms | motion-problem | mapping_note |  | OpenStax の Algebra の教科書はこれを uniform motion applications と呼び、D = rt（distance = rate × time）の式を立てる。 |
| terms | move-term-to-other-side | en.variants[0].note |  | Khan Academy（中学の講義と高校向け）と YouTube の解説が中心で、大学の講義（MIT OCW）には少ない。 |
| terms | multiplicity | pitfalls[0] | ○ | 日本の高校では重解（エントリ double-root）までで、重複度という語は大学で使う。 |
| terms | natural-logarithm | pitfalls[1] |  | 日本の数III では自然対数を log x と書く（底を省く）。 |
| terms | natural-number | mapping_note | ○ | 日本の教科書の自然数は 1, 2, 3, … で、0 を含まない。 |
| terms | natural-number | definition_ja | ○ | 正の整数と同じで、日本の教科書では 0 を含まない。 |
| terms | negation | pitfalls[0] | ○ | 日本の教科書は否定を p の上に線を引いて p̄ と書く。 |
| terms | negative-correlation | en.variants[0].note |  | 話し言葉では negative correlation より多いが、すべて Khan Academy（AP Statistics と中学の講義）。 |
| terms | negative-correlation | pitfalls[0] |  | 用例コーパスの話し言葉では negative linear relationship のほうが多いが、すべて Khan Academy（AP Statistics と中学の講義）なので、見出しは AP Statistics の CED（topic 5.2）の negative correlation にし、negative linear relationship は話し言葉の variant にした。 |
| terms | negative-reciprocal | mapping_note | ○ | 見出しの「符号を変えた逆数」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | negative-reciprocal | mapping_note | ○ | 日本では垂直条件を「傾きの積が −1」（m₁m₂ = −1）と言い、この数に名前を付けない。 |
| terms | net-change | mapping_note | ○ | 日本の高校では「変化量」とは言うが、定積分で求まる変化の合計に名前は付けない。 |
| terms | net-change | mapping_note | ○ | 見出しの「純変化量」と ja.alt の「純変化定理」は、日本の教科書に無い、本プロジェクトの訳語。 |
| terms | newtons-law-of-cooling | pitfalls[0] | ○ | 日本の高校の学習指導要領（数学）には含まれない。 |
| terms | nonlinear-system | mapping_note | ○ | 日本では数I・数II で「連立方程式（2 次を含む）」として扱い、放物線と直線の共有点を求める問題として学ぶ。 |
| terms | normal-approximation-to-the-binomial | pitfalls[0] |  | 近似を使ってよい目安（np ≥ 10 かつ n(1 − p) ≥ 10 など）は教科書によって数が違う。 |
| terms | normal-distribution | pitfalls[0] | ○ | 日本の教科書は N(μ, σ²) と分散を書くが、OpenStax Introductory Statistics は X ~ N(μ, σ) と標準偏差を書く（51 件）。 |
| terms | normal-probability-plot | mapping_note | ○ | 見出しの「正規確率プロット」は日本の高校の教科書に無い、本プロジェクトの訳語。 |
| terms | nth-roots-of-unity | pitfalls[1] |  | 数II の 1 の 3 乗根 ω（ω² + ω + 1 = 0、ω³ = 1）は、英語でも cube roots of unity と呼び、ω（omega）の記号を使うが、米国の高校課程では ω に決まった呼び名や性質の練習はほぼない。 |
| terms | nth-term-test | mapping_note | ○ | 見出しの「n 項判定法」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | nth-term-test | mapping_note | ○ | 日本の教科書では「級数が収束すれば aₙ → 0」の対偶として扱い、判定法の名前はつけない。 |
| terms | nth-term | pitfalls[1] |  | 日本の「一般項」は、第 n 項を n の式で表したもの。 |
| terms | number-line | pitfalls[0] | ○ | 日本の教科書の ● ○ と同じ使い分け。 |
| terms | number-of-elements | mapping_note |  | 日本の数Iの n(A) は有限集合の要素の個数だけを指す。 |
| terms | number-of-elements | mapping_note |  | 英語の cardinality は無限集合の大きさ（日本の大学でいう「濃度」）まで含む語で、用例コーパスでは話し言葉はすべて MIT OCW（6.042）、書き言葉はすべて MIT の講義ノート。 |
| terms | number-of-elements | mapping_note |  | 高校の範囲の問題文は number of elements の形で書ける。 |
| terms | number-of-elements | pitfalls[1] |  | 高校の「要素の個数」の意味だけなら number of elements でよい。 |
| terms | numerical-integration | pitfalls[0] | ○ | 日本の高校では数値積分は扱わない。 |
| terms | objective-function | pitfalls[0] | ○ | 日本の高校の問題文は「x + y の最大値を求めよ」のように書く。 |
| terms | one-sixth-formula | mapping_note |  | 日本の受験で使う公式で、OpenStax Calculus にも AP の CED にも無く、英語に決まった言い方がない（用例コーパスにも出てこない）。 |
| terms | one-to-one-property | mapping_note | ○ | 見出しの「一対一の性質」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | one-to-one-property | mapping_note | ○ | 日本の教科書では、指数関数・対数関数が単調であることから直接 aˣ = aʸ ⇔ x = y を使い、名前をつけない。 |
| terms | optimization-problem | mapping_note |  | 日本の数II・数III は、文章題の最大・最小を「最大・最小の応用」として扱い、「最適化」とは呼ばない。 |
| terms | optimization-problem | definition_ja |  | 微分を使うほか、数B では不等式の表す領域（線形計画法）などを使う。 |
| terms | order-matters | pitfalls[0] |  | 用例コーパスでは order matters ／ order doesn't matter ／ order does not matter をまとめて数え、話し言葉（Khan Academy の中学の講義が最も多い）・書き言葉（大半が OpenStax Algebra and Trigonometry）の両方に出てくる。 |
| terms | origin | pitfalls[1] | ○ | 日本の教科書は原点を文字 O（オー）で表す。 |
| terms | orthographic-projection | mapping_note | ○ | 日本の中学の投影図は、立面図（正面から見た図）と平面図（真上から見た図）を組にしたもので、英語では front view（立面図）・top view（平面図）・side view と、見る向きで図を呼ぶ。 |
| terms | orthographic-projection | mapping_note |  | 見出しの orthographic projection は製図でこの図法を呼ぶ名前で、米国の中学・高校の教材（OpenStax・IM・CK-12）には出てこない。 |
| terms | paragraph-proof | mapping_note | ○ | 見出しの「段落証明」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | paragraph-proof | mapping_note |  | 日本の証明はふつうこの形（文章で書く）なので、わざわざ名前を付けない。 |
| terms | paragraph-proof | pitfalls[0] | ○ | 日本の答案の証明はほぼこの形。 |
| terms | parallel-vectors | pitfalls[0] | ○ | 日本の教科書の「平行条件」（a ∥ b ⇔ b = ka）は、英語では条件に名前をつけず、one vector is a scalar multiple of the other のように言う（scalar multiple of は用例コーパスに少し出てくる）。 |
| terms | parametric-equations | mapping_note | ○ | ja.alt の「媒介変数方程式」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | parent-function | mapping_note | ○ | 見出しの「親関数」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | parent-function | mapping_note | ○ | 日本では「y = x² のグラフを平行移動したもの」と言い、もとになる関数に名前を付けない（エントリ transformations-of-functions）。 |
| terms | partial-fraction-decomposition | pitfalls[0] |  | 数Bの数列の和で使う 1/k(k + 1) = 1/k − 1/(k + 1) の分解も英語では同じく partial fractions。 |
| terms | partial-fraction-decomposition | pitfalls[1] | ○ | 日本の答案では log\|x\| − log\|x + 1\| + C = log\|x/(x + 1)\| + C とまとめることが多いが、米国の教科書では ln を使う。 |
| terms | partial-fraction-decomposition | pitfalls[2] | ○ | 日本の高校の「分数関数」は主に (ax + b)/(cx + d) の形を指すが、米国の rational function は多項式 ÷ 多項式の関数全般を指す。 |
| terms | partial-fraction-decomposition | pitfalls[4] | ○ | ∫(1/x)dx は、日本では log\|x\| + C、米国では ln\|x\| + C と書く。 |
| terms | partial-sum | pitfalls[0] |  | 数B では「初項から第 n 項までの和」、数III では「部分和」。 |
| terms | pemdas | mapping_note |  | 日本には演算の順序の覚え方の決まった名前がない。 |
| terms | percent-change | mapping_note | ○ | 日本では「〜% 増える」「〜% 減る」「増加率」と言い、増減をまとめた名前はない。 |
| terms | permutation | pitfalls[0] | ○ | 記号は日本では ₙPᵣ。 |
| terms | permutation | pitfalls[0] |  | 米国の教科書では P(n, r) や ₙPᵣ と書く。 |
| terms | perpendicular-lines | pitfalls[0] |  | 日本の「傾きの積が −1」と同じ内容。 |
| terms | perpendicular-postulate | mapping_note | ○ | 見出しの「垂線の公準」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | perpendicular-postulate | mapping_note | ○ | 日本の教科書は「直線外の 1 点を通る垂線はただ 1 本」を公準として立てない（作図で扱う）。 |
| terms | phase-shift | pitfalls[1] | ○ | 日本の教科書では「x 軸方向に π/2 だけ平行移動」と表す。 |
| terms | piecewise-function | mapping_note | ○ | 日本の高校では「場合分けして定義された関数」として扱い、名前を付けないことが多い。 |
| terms | pigeonhole-principle | pitfalls[1] | ○ | 日本の入試問題の解説では「部屋割り論法」と呼ぶことがある。 |
| terms | place | en.variants[0].note |  | 話し言葉はほとんどが Khan Academy の中学の講義。 |
| terms | place | en.variants[1].note |  | 話し言葉は大半が Khan Academy の中学の講義、書き言葉は大半が OpenStax Prealgebra。 |
| terms | point-of-internal-division | mapping_note |  | 内分点の座標の公式は英国・インドの教科書では section formula と呼ぶが、米国の用例コーパスには出てこない。 |
| terms | point-of-intersection | pitfalls[1] |  | 日本の「共有点」は接する点も含む。 |
| terms | point-of-tangency | pitfalls[0] |  | 日本の解答の「接点の x 座標を t とおく」は、英語では Let the point of tangency be (t, f(t)). と書き始める。 |
| terms | point-slope-form | mapping_note | ○ | 見出しの「点傾き形」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | point-slope-form | mapping_note | ○ | 日本では数II で「点 (x₁, y₁) を通り傾き m の直線の方程式」として同じ式を学ぶが、形の名前はない。 |
| terms | polynomial-inequality | mapping_note | ○ | 見出しの「多項式不等式」は日本の教科書に無い、本プロジェクトの訳語（日本では 3 次以上のものを高次不等式と呼ぶ）。 |
| terms | polynomial | pitfalls[0] |  | 高校の「整式」を integral expression と直訳しない。 |
| terms | polynomial | pitfalls[1] |  | 中学の「多項式」は単項式の和（2 項以上）で単項式と区別するが、英語の polynomial は単項式（monomial）も含む。 |
| terms | polynomial | pitfalls[1] |  | 範囲は高校の「整式」と同じ。 |
| terms | positive-and-negative-numbers | en.variants[0].note |  | 話し言葉ではこちらだけを使う（ほとんどが Khan Academy の中学の講義）。 |
| terms | positive-number | pitfalls[1] |  | 正の整数（positive integer）は 1, 2, 3, … で、日本の自然数と同じ範囲（エントリ natural-number）。 |
| terms | postulate | mapping_note | ○ | 日本の高校数学では「公理」と言い、「公準」はユークリッド原論の訳語として出てくる程度。 |
| terms | power-rule | mapping_note | ○ | 日本の教科書は (xⁿ)′ = nxⁿ⁻¹ を公式として使い、名前を付けない。 |
| terms | power-rule | mapping_note | ○ | ja.alt の「べき乗則」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | predicate | pitfalls[0] |  | 日本の数I では、x > 3 のように変数を含み値を決めると真偽が決まる文を「条件」と呼び、「述語」とは言わない。 |
| terms | preimage | mapping_note | ○ | 日本の中学では「もとの図形」と言い、原像という言葉は写像（大学）で使う。 |
| terms | prime-factorization | pitfalls[2] |  | 話し言葉はほとんどが Khan Academy の中学の講義、書き言葉は大半が OpenStax Prealgebra と Elementary Algebra。 |
| terms | prime-polynomial | mapping_note | ○ | 日本の中学・高校では「これ以上因数分解できない」と言い、名前を付けない。 |
| terms | probability-density-function | pitfalls[1] |  | 日本の数Bでは正規分布表で確率を求めることが多い。 |
| terms | probability-density-function | pitfalls[1] |  | 米国の微積分の教科書には、積分の応用として P(a ≤ X ≤ b) = ∫ₐᵇ f(x)dx や平均 ∫ x f(x) dx を扱う節を置くものがある（教科書による）。 |
| terms | probability | pitfalls[2] | ○ | 日本の高校では全事象を U で表すが、上の式では標本空間を S とした（sample-space を参照）。 |
| terms | projectile-motion | mapping_note |  | 日本の中 3 の数学では、物を落としたときの落ちる距離 y m と時間 x 秒の関係 y = 4.9x² を、関数 y = ax² の例として扱う。 |
| terms | projectile-motion | pitfalls[0] |  | 日本の中 3 の y = 4.9x² は落ちた距離（下向きに測る）なので x² の係数が正。 |
| terms | properties-of-integrals | pitfalls[0] |  | 数IIIの「定積分と不等式」は、比較の性質を使って不等式を証明する節。 |
| terms | proposition | mapping_note |  | 日本の「命題」は真か偽かがはっきり決まる文や式。 |
| terms | proposition | pitfalls[1] | ○ | 「x > 3」のように変数の値で真偽が変わるものは、日本の教科書では「条件」と呼んで命題と区別する。 |
| terms | propositional-logic | pitfalls[1] |  | 数I「集合と命題」では否定を p̄ と上に線を引いて書き、「かつ」「または」は言葉で書く。 |
| terms | proving-an-identity | pitfalls[1] |  | 証明の途中で両辺に同じ操作をして 1 = 1 を導く書き方は、米国の教科書でも避ける（片側を変形していく）。 |
| terms | pythagorean-identity | mapping_note | ○ | 見出しの「ピタゴラスの恒等式」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | pythagorean-identity | mapping_note | ○ | 日本の教科書では sin²θ + cos²θ = 1 を「三角関数の相互関係」の 1 つとして扱い、個別の名前をつけない。 |
| terms | pythagorean-identity | pitfalls[0] |  | 米国の教科書は 1 + tan²θ = sec²θ、1 + cot²θ = csc²θ も合わせて Pythagorean identities（複数形）と呼ぶ。 |
| terms | quadrant | pitfalls[0] | ○ | 日本の教科書は第 1 象限〜第 4 象限と書くが、米国の教科書（OpenStax）はローマ数字で Quadrant I〜IV と書く（Quadrant III は quadrant three と読む）。 |
| terms | quadrantal-angle | mapping_note | ○ | 見出しの「座標軸上の角」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | quadrantal-angle | mapping_note | ○ | 日本の教科書では 0°, 90°, 180°, 270° などの角にまとめた名前をつけない。 |
| terms | quadratic-function | definition_ja |  | 中 3 では y = ax²（a ≠ 0）の形だけを扱い、高校で y = ax² + bx + c の形に広げる。 |
| terms | quadratic-inequality | pitfalls[0] | ○ | 日本の答案は −2 < x < 3 のように不等式で書くが、英語の答案では区間記法 (−2, 3) で書くこともある。 |
| terms | quadrilateral | pitfalls[2] | ○ | m∠A は「∠A の大きさ」（the measure of angle A、エントリ measure）の書き方で、日本の教科書の ∠A = 85° にあたる。 |
| terms | quantifier | pitfalls[0] |  | 日本の数I では「すべての」「ある」を言葉で扱い（「すべての x について p」の否定は「ある x について p でない」）、∀ ∃ の記号や「量化子」という名前は使わない。 |
| terms | quartic-equation | definition_ja |  | 高校では複2次式 x⁴ + ax² + b = 0 を x² = t とおいて解く形が多い。 |
| terms | radian | pitfalls[0] | ○ | 日本の答案ではラジアンの単位を省略して θ = π/3 と書く。 |
| terms | radical-equation | pitfalls[1] | ○ | 日本では数III で扱うが、米国の教科書では Algebra 1 の OpenStax Elementary Algebra から扱う（Intermediate Algebra、Algebra and Trigonometry にも出てくる）。 |
| terms | radical-expression | mapping_note | ○ | 見出しの「根号式」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | radical-expression | mapping_note | ○ | 日本では「根号を含む式」と言う。 |
| terms | radical-function | mapping_note |  | 日本の数III の「無理関数」は √ を含む式で表される関数（y = √(ax + b) など）。 |
| terms | radical-function | mapping_note | ○ | ja.alt の「根号関数」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | range | definition_ja |  | 中学で習う「y の変域」のこと。 |
| terms | range | pitfalls[1] |  | 中学の「y の変域」も range と言い、x の変域と合わせて言うときは domain and range（エントリ domain-and-range）。 |
| terms | rank-nullity-theorem | pitfalls[0] |  | rank theorem は教科書によって別の定理（行の階数と列の階数が等しい）を指すので候補にしなかった。 |
| terms | rate-of-change | mapping_note |  | 中学の「変化の割合」は x の増加量に対する y の増加量の比。 |
| terms | ratio-of-areas-of-similar-figures | pitfalls[1] |  | 相似の記号 ∽ は日本の書き方。 |
| terms | rational-expression | pitfalls[0] |  | 米国の教科書は excluded values（または restrictions）と呼ぶ。 |
| terms | rational-function | mapping_note |  | 日本の数III の「分数関数」は y = (ax + b)/(cx + d) の形を中心に扱う。 |
| terms | rationalizing-the-denominator | pitfalls[2] | ○ | 分母が √3 + √2 のような 2 項の和のときは、√3 − √2 を分母と分子に掛けて有理化する（日本では数学 I で扱う）。 |
| terms | real-number | pitfalls[1] |  | 日本の「自然数」は 1 から始まる。 |
| terms | real-number | pitfalls[1] |  | 英語の natural numbers は 0 を含めるかどうかが教科書による。 |
| terms | rectangular-prism | pitfalls[2] |  | V = lwh の l、w、h は length、width、height の頭文字で、日本の「縦 × 横 × 高さ」と同じ計算。 |
| terms | recurrence-relation | mapping_note |  | 日本の「漸化式」はどちらにも当たる。 |
| terms | reduced-row-echelon-form | pitfalls[0] |  | 教科書では Nicholson が使う。 |
| terms | reduced-row-echelon-form | pitfalls[1] |  | 日本語は教科書により簡約階段形・既約行階段形など呼び方が分かれる。 |
| terms | reference-angle | mapping_note | ○ | 日本の教科書には名前がない。 |
| terms | reflexive-property | pitfalls[0] |  | 日本の証明では「BD は共通」と書き、反射律という名前は使わない。 |
| terms | regression-line | pitfalls[1] |  | OpenStax は ŷ = a + bx（a が切片、b が傾き）と書き（11 件）、日本の y = ax + b と文字の役割が逆になる。 |
| terms | related-rates | mapping_note |  | 日本の数III は、時刻とともに変わる 2 つの量の変化率の関係を、微分の応用（速度・変化率）の問題として扱い、単元に名前を付けない。 |
| terms | relationship-between-roots-and-coefficients | mapping_note |  | 大学の教科書や Wikipedia では Vieta's formulas と呼ぶが、米国の高校の授業では名前を出さず、the sum of the roots is −b/a, the product is c/a と式で言う。 |
| terms | relatively-prime | mapping_note | ○ | 日本の教科書は「互いに素」を 2 つの整数について定義する。 |
| terms | relatively-prime | mapping_note |  | 用例コーパスの relatively prime はほとんどが MIT（話し言葉は大半が MIT OCW で、ほかは Khan Academy の中学の講義。書き言葉はすべて MIT の講義ノート）。 |
| terms | remainder-theorem | pitfalls[0] |  | 2 次式で割った余り（ax + b の形）を求める問題は、米国の高校ではあまり扱わない。 |
| terms | remainder | pitfalls[2] |  | 数A の合同式では、余りを剰余とも言う。 |
| terms | removable-discontinuity | pitfalls[0] | ○ | 日本の高校の教科書は不連続点の種類に名前を付けない。 |
| terms | repeated-trials | mapping_note |  | 日本の「反復試行」は、同じ試行を独立に何回も繰り返すこと。 |
| terms | repeating-decimal | pitfalls[0] | ○ | 日本の教科書は繰り返す部分の最初と最後の数字の上に点を打つ（0.1̇23̇）。 |
| terms | representations-of-a-function | mapping_note | ○ | 日本の中学では、1 つの関数を表・式・グラフの 3 つで表し、互いに行き来する。 |
| terms | resistant-statistic | mapping_note | ○ | 見出しの「抵抗性がある」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | revolve-around-the-y-axis | pitfalls[1] | ○ | y 軸のまわりの回転体は、日本では x = g(y) と書き直して π∫x²dy で求めることが多い。 |
| terms | riemann-sum | mapping_note |  | 日本の「lim (1/n)Σ f(k/n) を定積分で表せ」型の問題は、米国では express the limit as a definite integral のように指示される。 |
| terms | right-hand-limit | pitfalls[0] | ○ | 日本の教科書は x → a + 0 と書くが、米国の教科書は x → a⁺ と書き、a plus と読む（approaches a from the right）。 |
| terms | right-riemann-sum | mapping_note | ○ | 見出しの「右リーマン和」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | right-riemann-sum | pitfalls[0] |  | 日本の区分求積法でよく使う (1/n)Σ_{k=1}^{n} f(k/n) は、区間 [0, 1] の right Riemann sum にあたる。 |
| terms | right-triangle-similarity | mapping_note | ○ | 見出しの「直角三角形の相似」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | right-triangle-similarity | mapping_note | ○ | 日本では直角三角形の直角の頂点から斜辺に垂線を引いてできる 3 つの三角形が相似であることを、定理の名前を付けずに使う。 |
| terms | right-triangle-similarity | pitfalls[2] |  | 定理の英語名は教科書による。 |
| terms | right-triangle | pitfalls[2] |  | 日本の中2 では、直角三角形だけに使える合同条件（斜辺と 1 つの鋭角、斜辺と他の 1 辺）を別に学ぶ（エントリ congruence-criteria-for-right-triangles）。 |
| terms | rigid-motion | mapping_note |  | 日本の中1 は平行移動・回転移動・対称移動をまとめて「移動」と呼ぶ。 |
| terms | rigid-motion | pitfalls[2] |  | 用例コーパスでは話し言葉に rigid transformation が多く（すべて Khan Academy の中学の講義）、rigid motion はほとんど出てこない（3Blue1Brown）。 |
| terms | rise-over-run | mapping_note | ○ | 見出しの「上昇分と水平移動分の比」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | rise-over-run | mapping_note | ○ | 日本では「x が 1 増えると y がいくつ増えるか」「y の増加量 ÷ x の増加量」と言う。 |
| terms | rotated-conics | pitfalls[0] | ○ | 軸の回転の公式は日本の高校の学習指導要領には含まれない。 |
| terms | ruler-postulate | mapping_note | ○ | 見出しの「数直線上の距離」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | ruler-postulate | mapping_note | ○ | 日本の教科書は 2 点間の距離を数直線上の座標の差の絶対値として扱い、公準として名前を付けない。 |
| terms | same-side-exterior-angles | mapping_note | ○ | 見出しの「同側外角」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | same-side-exterior-angles | mapping_note | ○ | 日本の教科書には名前がない。 |
| terms | same-side-exterior-angles | pitfalls[1] |  | same-side と consecutive のどちらを使うかは教科書による。 |
| terms | sample-space | pitfalls[0] | ○ | 日本の高校では全事象を U で表す。 |
| terms | scale-factor | mapping_note |  | 日本の相似比は 2 つの図形の対応する長さの比（2 : 3 のように比で書く）。 |
| terms | scale-factor | pitfalls[0] |  | 日本の相似比 2 : 3 は向きを言わずに比で書く。 |
| terms | scale-factor | pitfalls[2] |  | 用例コーパスでは、話し言葉はほとんどが Khan Academy の中学の講義で、書き言葉は少ない（MIT の講義ノートと OpenStax）。 |
| terms | scalene-triangle | pitfalls[0] | ○ | 日本では「3 辺の長さがすべて異なる三角形」をふつう名前で呼ばない。 |
| terms | scientific-notation | mapping_note |  | 日本の中 3 では、近似値を（整数部分が 1 桁の数）×（10 の累乗）の形で書くことを学ぶが、この書き方に名前を付けない。 |
| terms | secant-line | mapping_note | ○ | 日本の教科書の「割線」は、円と 2 点で交わる直線（方べきの定理で使う）。 |
| terms | secant-line | mapping_note |  | 日本の数II・数III では、この直線を「2 点を通る直線」と呼び、割線とは言わないことが多い。 |
| terms | secant-line | pitfalls[0] |  | 数II・数III の「2 点を通る直線の傾き」「平均変化率」は、英語では secant line の傾きとして言う。 |
| terms | secant-tangent-theorem | mapping_note | ○ | 見出しの「割線と接線の定理」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | secant-tangent-theorem | mapping_note | ○ | 日本では方べきの定理の、円の外の点 P から引いた割線と接線の場合（PT² = PA·PB）として扱う。 |
| terms | secant | mapping_note | ○ | 日本の高校では sec を使わず 1/cos θ と書く（1 + tan²θ = 1/cos²θ）。 |
| terms | secant | pitfalls[2] |  | 日本の 1 + tan²θ = 1/cos²θ は英語の式では 1 + tan²θ = sec²θ と書き、tan x の導関数も sec²x と書く。 |
| terms | second-derivative-test | mapping_note |  | 日本の数III は、f′(a) = 0 かつ f″(a) の符号で極大・極小を判定することを性質として示し、名前を付けない。 |
| terms | second-derivative-test | mapping_note | ○ | 見出しの「第 2 次導関数判定法」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | segment-addition-postulate | mapping_note | ○ | 見出しの「線分の加法公理」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | segment-addition-postulate | mapping_note | ○ | 日本の教科書は AB + BC = AC に名前をつけない。 |
| terms | segment | mapping_note | ○ | 英語の記法では線分 AB を AB の上に横線を引いて表し、その長さは横線なしの AB と書き分ける（日本の教科書では線分も長さも AB）。 |
| terms | separable-differential-equation | pitfalls[1] | ○ | 両辺を積分して出てくる ln\|y\| を、日本の教科書では log\|y\| と書く。 |
| terms | set-builder-notation | mapping_note |  | 日本の数A（集合）でも {x \| x は 12 の約数} のように書くが、書き方に名前を付けず「条件を満たすものの集まりとして表す」と言う。 |
| terms | set-builder-notation | pitfalls[1] |  | 要素を書き並べる書き方（{1, 2, 3, 4} など、日本の「要素を書き並べる方法」）は roster notation と言い、set-builder notation とは別。 |
| terms | set-up-a-recurrence | mapping_note |  | 高校の教科書（OpenStax Algebra and Trigonometry）の write a recursive formula は、並んだ項から漸化式を書く問いで使う。 |
| terms | shell-method | mapping_note | ○ | 日本ではバウムクーヘン積分と呼ばれ、高校の教科書で扱うかは教科書による。 |
| terms | shell-method | mapping_note | ○ | 見出しの「シェル法」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | shortest-path | pitfalls[0] |  | 日本の「最短経路の数」の問題は lattice path で言う。 |
| terms | side-angle-inequality | pitfalls[1] |  | 数I では「最大の角」を求める問題で使う。 |
| terms | sign-chart-inequality | mapping_note | ○ | 見出しの「符号図」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | sign-chart-inequality | mapping_note |  | 日本の増減表（sign-chart）と英語の名前は同じだが、こちらは不等式を解くための図で、関数の増減は表さない。 |
| terms | sign-chart | mapping_note |  | 日本の増減表（x の行・f′(x) の行・f(x) の行を並べ、矢印で増減を書く表）に当たる定型の表は、AP の CED にも OpenStax Calculus にも出てこない。 |
| terms | sign-chart | mapping_note |  | 数IIIの凹凸まで入れた表も同じで、凹凸は f″ の符号で判断する（concavity、CED topic 5.6）。 |
| terms | significant-figures | mapping_note |  | 日本の中 3 では、有効数字をはっきりさせるために測定値を 2.30 × 10³ のように（整数部分が 1 桁の数）×（10 の累乗）の形で書く。 |
| terms | similar-triangles | pitfalls[0] | ○ | 相似の記号は日本では ∽、米国では ~（△ABC ~ △DEF）。 |
| terms | similar | pitfalls[1] |  | 日本の記号 ∽ で書いた △ABC ∽ △DEF も、triangle ABC is similar to triangle DEF と読む。 |
| terms | similarity-criteria | mapping_note |  | 日本の三角形の相似条件は 3 つ（3 組の辺の比がすべて等しい、2 組の辺の比とその間の角がそれぞれ等しい、2 組の角がそれぞれ等しい）で、「相似条件」とまとめて呼ぶ。 |
| terms | simplify-radicals | en.variants[0].note |  | 話し言葉は NancyPi と Khan Academy の中学の講義に出てくるが、数は少ない。 |
| terms | simplify-radicals | pitfalls[0] |  | 話し言葉はどれも少ない（いちばん多い simplify radicals も NancyPi と Khan Academy の中学の講義だけ）。 |
| terms | sinusoid | mapping_note |  | 日本の数II では y = sin θ のグラフを「正弦曲線」と呼ぶ。 |
| terms | sketch-of-a-solid | pitfalls[1] |  | 中学の見取図では、平行な辺は平行にかく。 |
| terms | sketch | mapping_note |  | 日本の問題文の「図示せよ」は、領域なら Sketch ／ Graph ／ Shade the region、曲線なら Sketch the graph と言う。 |
| terms | slope-field | pitfalls[0] | ○ | 日本の高校では扱わない。 |
| terms | slope-formula | mapping_note | ○ | 見出しの「傾きの公式」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | slope-formula | mapping_note | ○ | 日本では「変化の割合 = y の増加量 ÷ x の増加量」（エントリ rate-of-change）として同じ計算をするが、公式の名前はない。 |
| terms | slope-intercept-form-of-a-line | mapping_note | ○ | 見出しの「傾き切片形」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | slope-intercept-form-of-a-line | mapping_note | ○ | 日本では y = ax + b を一次関数の式として扱い、形に名前を付けない。 |
| terms | slope-intercept-form-of-a-line | pitfalls[0] |  | 日本の一次関数 y = ax + b の a が m にあたる。 |
| terms | slope | pitfalls[0] | ○ | 日本の教科書の y = ax + b の a に当たる。 |
| terms | sohcahtoa | mapping_note | ○ | 見出しの「SOHCAHTOA」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | sohcahtoa | mapping_note | ○ | 日本では sin・cos・tan の定義を筆記体の s・c・t の形で覚える方法があり、この語呂合わせは使わない。 |
| terms | solution-pair | pitfalls[2] | ○ | 日本の教科書は解を x = 2, y = 3 や (x, y) = (2, 3) と書く。 |
| terms | solution-set | pitfalls[0] | ○ | 区間の記法 (2, 3)、[1, ∞) は日本の高校の教科書では使わない（2 < x < 3、x ≧ 1 と書く）。 |
| terms | solve-for-y-prime | pitfalls[0] | ○ | 日本の答案は y′ と書くことが多いが、米国の授業では dy/dx と書くことが多い（用例コーパスの話し言葉でも solve for dy/dx が多く、solve for y prime はほとんど出てこない）。 |
| terms | solve-the-right-triangle | mapping_note | ○ | 見出しの「三角比で辺を求める」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | solving-triangles | pitfalls[0] |  | 米国の教科書は正弦定理を law of sines、余弦定理を law of cosines と呼ぶ（OpenStax Algebra and Trigonometry）。 |
| terms | space-diagonal | pitfalls[0] |  | 英語に決まった 1 語はなく、教科書は diagonal of the rectangular prism ／ box のように立体の名前をつけて言う。 |
| terms | split-into-cases | mapping_note |  | 数 I の「軸の位置で場合分けする」は、英語で説明するなら頂点（軸）が区間の左・内側・右のどこにあるかで cases を分ける、という言い方になる。 |
| terms | spread | en.variants[1].note |  | 話し言葉はすべて Khan Academy（中学の講義と AP Statistics）。 |
| terms | square-pyramid | mapping_note |  | 日本の「正四角錐」（底面が正方形で、頂点が底面の中心の真上にあるもの）は square pyramid に当たる。 |
| terms | square-units | mapping_note | ○ | 見出しの「平方単位」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | square-units | mapping_note | ○ | 日本では cm²・m² のように決まった単位で答える。 |
| terms | square-units | pitfalls[1] |  | 日本の問題では面積を cm² や m² で答え、「平方単位」とは言わない。 |
| terms | sss-congruence | pitfalls[0] | ○ | 日本の答案は「3 組の辺がそれぞれ等しいから」と文で書く。 |
| terms | standard-deviation | pitfalls[0] |  | 数I の標準偏差は n で割る。 |
| terms | standard-form-of-a-line | mapping_note | ○ | 見出しの「直線の標準形」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | standard-form-of-a-line | mapping_note |  | 日本の数II では直線の方程式の一般形を ax + by + c = 0（右辺が 0）と書くので、英語の standard form（定数が右辺）と形が違う。 |
| terms | standard-form-of-a-line | pitfalls[0] |  | 日本の数II の一般形 ax + by + c = 0 から書き直すと、定数の符号が変わる。 |
| terms | standard-form-of-a-line | pitfalls[1] |  | 二次関数の ax² + bx + c の形（日本の「一般形」、エントリ standard-form）や、英国での科学的記数法（エントリ scientific-notation）にも使うので、「直線の」「一次方程式の」を付けて区別する。 |
| terms | standard-form | pitfalls[0] |  | 日本の「一般形」を standard form と訳すと、日本の「標準形」a(x − h)² + k の意味に取られることがある（OpenStax Algebra and Trigonometry の standard form はこちら）。 |
| terms | standard-matrix | mapping_note | ○ | 見出しの「標準行列」は日本の教科書に無い、本プロジェクトの訳語（日本語は「線形写像の表現行列」と言うことが多い）。 |
| terms | standard-normal-table | mapping_note |  | 日本の数B の正規分布表は 0 から u までの確率 P(0 ≤ Z ≤ u) を載せる形が多い。 |
| terms | standard-score | mapping_note |  | 英語で日本の制度を説明するときはローマ字の hensachi と書く。 |
| terms | standard-unit-vectors | pitfalls[0] | ○ | 日本の教科書は e₁, e₂（空間では e₃）、米国の教科書は i, j, k と書く（OpenStax Calculus Volume 3）。 |
| terms | statistical-variable | mapping_note |  | 日本の数I「データの分析」では、データの項目（身長・点数など）を変量と呼び、式の文字の「変数」と言葉を分ける。 |
| terms | step-function | pitfalls[0] |  | 最大整数関数 ⌊x⌋（日本のガウス記号、エントリ floor-function）は step function の代表。 |
| terms | straight-angle | pitfalls[0] |  | 用例コーパスの話し言葉では straight angle はほとんどが Khan Academy の中学の講義。 |
| terms | strong-induction | pitfalls[0] |  | 数B の「n = k, k + 1 のとき成り立つと仮定して n = k + 2 を示す」形の帰納法は、strong induction の特別な場合にあたる。 |
| terms | structural-induction | pitfalls[1] | ○ | 日本の高校数学では扱わず、大学の離散数学や情報科学で出てくる。 |
| terms | subset | pitfalls[1] | ○ | 日本の教科書の ⊂ は A = B の場合も含む。 |
| terms | subset | pitfalls[1] |  | 英語の本では ⊆ と ⊂（真部分集合）を書き分けるものと、⊂ だけを使うものがあり、記号は教科書による。 |
| terms | substitute-new-variable | pitfalls[0] |  | 日本の「x + 1 = A とおく」は式が先だが、英語の答案では Let A = x + 1. と新しい文字を先に書く。 |
| terms | substitute | pitfalls[0] |  | 答案・教科書では substitute。 |
| terms | substitution-in-a-definite-integral | mapping_note | ○ | 日本では置換したら積分区間を新しい変数の値に必ず書き換え、x と t の対応表（x: 0 → 1 のとき t: 1 → 2）を添える。 |
| terms | substitution-in-a-definite-integral | mapping_note |  | 米国の教科書が示すのは、区間を u の値に書き換える方法と、いったん不定積分を求めて x に戻し元の区間で計算する方法で、どちらを示すか、対応表を書くかは教科書による。 |
| terms | substitution-property | mapping_note | ○ | 見出しの「代入の性質」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | substitution-property | mapping_note | ○ | 日本では「等しいものを代入してよい」を名前のある性質として挙げない。 |
| terms | substitution-property | pitfalls[1] |  | 日本の証明では「∠1 = ∠3 を代入して」と書くだけで、理由に名前を付けない。 |
| terms | summation-notation | pitfalls[0] |  | 日本の数Bの教科書は Σ_{k=1}^{n} のように添字に k を使うことが多い。 |
| terms | supplementary-angle | pitfalls[1] |  | 話し言葉は Khan Academy の中学の講義と The Organic Chemistry Tutor、書き言葉は OpenStax Prealgebra と OpenStax Elementary Algebra が中心。 |
| terms | surface-area-of-revolution | pitfalls[0] | ○ | 日本の高校では回転体の体積は扱うが、回転面の面積は扱わない。 |
| terms | synthetic-division | pitfalls[0] | ○ | 日本の教科書では発展的な扱いのことがある。 |
| terms | system-of-inequalities | mapping_note |  | and でつないだもの（両方を満たす x、つまり共通範囲を答える）が日本の連立不等式にあたり、or でつないだもの（どちらかを満たす x）は連立不等式ではない。 |
| terms | system-of-inequalities | pitfalls[2] |  | system of inequalities は、OpenStax では 2 変数の不等式の組をグラフで解く節（Elementary Algebra の Graphing Systems of Linear Inequalities ほか）の言い方で、数II の「連立不等式の表す領域」に当たる（書き言葉では OpenStax Elementary Algebra と OpenStax Algebra and Trigonometry に出てくるが、話し言葉にはほとんど出てこない）。 |
| terms | system-of-linear-equations | pitfalls[0] |  | 中学の連立方程式は、1 次の式だけなら system of linear equations、一般には system of equations とも言う。 |
| terms | system-of-linear-inequalities | mapping_note |  | 日本の数I の「連立不等式」は 1 変数（英語の compound inequality、エントリ system-of-inequalities）。 |
| terms | system-of-linear-inequalities | mapping_note |  | 2 変数の連立不等式は数II の「不等式の表す領域」で扱う。 |
| terms | system-of-linear-inequalities | pitfalls[1] |  | 日本の数I の「連立不等式」は 1 変数の不等式の組で、英語では compound inequality と言う（エントリ system-of-inequalities）。 |
| terms | tangent-problem | mapping_note | ○ | 見出しの「接線問題」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | tangent-problem | definition_ja |  | 微分の出発点として教科書で紹介される。 |
| terms | telescoping-series | mapping_note | ○ | 見出しの「望遠鏡級数」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | telescoping-series | mapping_note |  | 日本の数B では Σ1/(k(k + 1)) を 1/k − 1/(k + 1) に分けて途中を消す方法として扱い、級数に名前をつけない。 |
| terms | terminal-side | mapping_note |  | 日本の「動径」は、始線から回転して角をつくる半直線そのもの。 |
| terms | test-point | mapping_note | ○ | 見出しの「テスト点」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | test-point | mapping_note | ○ | 日本の教科書では区間の代表の値を代入して符号を調べる手順に名前をつけない。 |
| terms | toss | en.variants[0].note |  | 話し言葉では toss より多い（Khan Academy の中学の講義に多い）。 |
| terms | total-distance-traveled | pitfalls[0] |  | 数IIIの「道のり」に当たる。 |
| terms | transformations-of-functions | mapping_note | ○ | 日本では「平行移動」「対称移動」を別々に学び、まとめた名前はあまり使わない。 |
| terms | transitive-property | pitfalls[0] | ○ | 日本では推移律は大学（同値関係・順序関係）の語で、中学・高校の証明では「∠1 = ∠2、∠2 = ∠3 より」と理由に名前を付けずに書く。 |
| terms | translation | pitfalls[0] |  | 日本の「x 軸方向に p、y 軸方向に q だけ平行移動」は、英語では向きで言う（shift 3 units to the right and 2 units up）。 |
| terms | transversal | pitfalls[0] | ○ | 日本の教科書は交わる直線に名前を付けず「2 直線に 1 直線が交わるとき」と言う。 |
| terms | transversal | pitfalls[2] |  | 用例コーパスで transversal は話し言葉だけに出てくる（Khan Academy の中学の講義が最も多く、次が The Organic Chemistry Tutor）。 |
| terms | triangle-inequality | pitfalls[1] |  | 数II の「絶対値と不等式」で扱う \|a\| + \|b\| ≧ \|a + b\| も英語では triangle inequality と呼ぶ。 |
| terms | trigonometric-function | pitfalls[0] |  | 米国の教科書は sin・cos・tan に加えて csc（cosecant）・sec（secant）・cot（cotangent）も使う。 |
| terms | trigonometric-function | pitfalls[0] | ○ | 日本の高校では使わない。 |
| terms | trigonometric-identities | mapping_note |  | 日本の「相互関係」は同じ角の sin・cos・tan の 3 つの関係式（sin²θ + cos²θ = 1、tan θ = sin θ / cos θ、1 + tan²θ = 1/cos²θ）を指す。 |
| terms | trigonometric-identities | pitfalls[0] |  | 1 + tan²θ = 1/cos²θ は米国の教科書では 1 + tan²θ = sec²θ と secant で書く（OpenStax Algebra and Trigonometry）。 |
| terms | trigonometric-identities | pitfalls[0] | ○ | 日本の高校では sec を使わない。 |
| terms | trigonometric-integrals | pitfalls[0] | ○ | 日本では ∫(1/cos²x)dx = tan x + C と書くが、米国では sec²x（secant squared x）を使って ∫sec²x dx = tan x + C と書く。 |
| terms | trigonometric-ratio | pitfalls[3] |  | 数I の三角比は、直角三角形の鋭角で定めてから、座標を使って 0° ≦ θ ≦ 180° まで広げる。 |
| terms | trigonometric-ratio | pitfalls[3] |  | 数II で一般角に広げたものが三角関数（trigonometric function）。 |
| terms | trigonometric-substitution | mapping_note | ○ | 日本の高校でも x = a sin θ などの置換は使うが、手法に名前は付けない。 |
| terms | trigonometric-substitution | pitfalls[0] | ○ | 日本では 1/cos²θ と書くところを、米国では sec²θ と書く。 |
| terms | trigonometric-substitution | pitfalls[2] |  | √ を含む関数（日本の「無理関数」）は、米国では irrational function とはまず言わず、radical function ／ square root function と呼ぶ。 |
| terms | truth-table | pitfalls[0] |  | 日本の数I では命題の真偽を集合の包含関係（ベン図）で調べ、真理値表は使わない。 |
| terms | turning-points | mapping_note | ○ | 日本では数II・数III で微分して極大・極小を求め、グラフの形から極値をとる点の個数を数える言い方はしない。 |
| terms | two-column-proof | mapping_note | ○ | 見出しの「二段組みの証明」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | two-column-proof | mapping_note | ○ | 日本の中学・高校の証明は文章で書き、「statements（主張）」と「reasons（理由）」を 2 列に並べる答案の形式はない。 |
| terms | two-column-proof | pitfalls[0] | ○ | 日本の答案の「仮定より」は、この形式では理由の列に Given と書く。 |
| terms | two-proportion-z-test | mapping_note | ○ | 見出しの「2 標本比率の検定」は日本の高校の教科書に無い、本プロジェクトの訳語。 |
| terms | two-variable-data | pitfalls[0] |  | 日本の数I では「2 つの変量のデータ」として散布図・相関係数を学ぶ。 |
| terms | unit-circle | pitfalls[0] |  | 数I では単位円の上半分（0° ≦ θ ≦ 180°）を使って鈍角の sin・cos・tan を定める。 |
| terms | unit-circle | pitfalls[0] |  | 全周を使って一般角に広げるのは数II。 |
| terms | universal-quantifier | pitfalls[1] |  | 数I の「すべての…」の否定が「ある…でない」になるのと同じ規則。 |
| terms | variable | mapping_note | ○ | 日本の中学では、式の中の x や a を「文字」と呼ぶことが多い。 |
| terms | variance | pitfalls[0] |  | 日本の数I は n で割るが、米国の教科書の sample variance（s²）は n − 1 で割る（OpenStax Introductory Statistics）。 |
| terms | vector-equation-of-a-circle | mapping_note |  | 米国の教科書は円を (x − h)² + (y − k)² = r² の形で扱い、ベクトル方程式としては立てない。 |
| terms | vector | pitfalls[0] | ○ | 日本の教科書は矢印（→）を文字の上に書くが、米国の教科書は太字（v）か、手書きでは上の矢印 v⃗ を使う。 |
| terms | venn-diagram | pitfalls[1] | ○ | 補集合の記号は日本の教科書では Ā。 |
| terms | vertex-form | mapping_note |  | 日本の「標準形」y = a(x − p)² + q は英語の vertex form に当たる。 |
| terms | vertex-form | mapping_note |  | 「標準形」を standard form と直訳すると食い違う: OpenStax Algebra and Trigonometry は a(x − h)² + k を quadratic function の standard form と呼び、vertex form とも呼ぶと書くが、ax² + bx + c（日本の一般形）を standard form と呼ぶ話し手もいる。 |
| terms | vertex-form | pitfalls[0] |  | 日本の「標準形」を standard form と直訳しない。 |
| terms | vertex-form | pitfalls[1] | ○ | 英語では頂点を (h, k) と書き、日本の教科書の (p, q) と文字が違う。 |
| terms | vertical-asymptote | pitfalls[1] | ○ | 日本では数III で漸近線（エントリ asymptote）として扱い、向きで名前を分けない。 |
| terms | vertical-line-test | mapping_note | ○ | 見出しの「垂直線テスト」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | vertical-line-test | mapping_note | ○ | 日本では「x の値を決めると y の値がただ 1 つに決まるとき y は x の関数」という定義で考え、グラフでの判定法に名前を付けない。 |
| terms | vertical-tangent | pitfalls[0] | ○ | 日本の高校の教科書は、接線が y 軸に平行になる点に名前を付けない。 |
| terms | voluntary-response-bias | mapping_note | ○ | 見出しの「自発的回答の偏り」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | washer-method | mapping_note |  | 日本の数IIIでは、穴のある回転体の体積を「外側の回転体から内側の回転体を引く」π∫({f(x)}² − {g(x)}²)dx として求め、名前は付けない。 |
| terms | washer-method | mapping_note | ○ | 見出しの「ワッシャー法」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | which-one-to-differentiate | mapping_note | ○ | 日本の教科書は「どちらを微分し、どちらを積分するか」と考えるが、米国では ∫u dv の u（微分する側）と dv（積分する側）を選ぶ、と言う。 |
| terms | write-dx-in-terms-of-du | pitfalls[0] |  | dx を解き出す（solve for dx）か、被積分関数の中の 2x dx をそのまま du に置き換えるかは教科書による。 |
| terms | y-intercept | mapping_note | ○ | 日本の中学では「切片」と言えば y 切片、つまり直線が y 軸と交わる点の y 座標（y = ax + b の b）を指す。 |
| terms | z-score | pitfalls[0] |  | 日本の偏差値（hensachi）とは別。 |
| terms | zero-product-property | mapping_note | ○ | 見出しの「零因子の性質」は日本の教科書に無い、本プロジェクトの訳語。 |
| terms | zero-product-property | mapping_note | ○ | 日本の教科書はこの性質に名前を付けず、「AB = 0 ならば A = 0 または B = 0」という文のまま使う。 |
| terms | zeros-of-a-polynomial | pitfalls[0] | ○ | 日本の高校の教科書は「方程式 P(x) = 0 の解」として扱う。 |
| symbols | combination-ncr | notes[0] | ○ | 日本の教科書は ₙCᵣ と書き、米国の教科書は C(n, r)、ₙCᵣ、または縦に並べた二項係数 (n over r) の形で書く。 |
| symbols | conditional-probability-subscript-jp | notes[0] |  | 日本の P_A(B) は、米国の書き方では P(B \| A)。 |
| symbols | congruence-mod | notes[1] | ○ | ≡ は日本の中学では図形の合同の記号（congruent-sign）。 |
| symbols | congruent-sign | notes[0] |  | 日本の ≡ も読みは同じ。 |
| symbols | cosecant-of-theta | notes[0] |  | 書くときは csc（英国や日本の大学の本は cosec とも）。 |
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
