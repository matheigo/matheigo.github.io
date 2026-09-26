# 米国側の主張の文で出典に当たる参照がないもの（Phase 5 の監査の前の機械の確かめ 3）

作成: 2026-09-26 ／ `pnpm audit:claims`（scripts/audit/claims.ts）

対象の欄は日本側と同じ。米国側の主張（米国・アメリカ・AP・CED・College Board・英語圏・Calc I〜III・Calculus AB／BC）の文のうち、
文の中に参照（CED・OpenStax・IM・CK-12・Nicholson・Levin・Wikipedia・topic の番号ほか）も用例コーパス（講義・話し言葉・書き言葉・Khan・MIT ほか）も名指ししないもの。

- 米国側の主張の文で参照かコーパスを名指しするもの: 365 文（一覧にしない）
- **A. 名指しがなく、エントリの出典にも reference ／ textbook がない: 17 項目・18 文**
- B. 名指しはないが、エントリの出典に reference ／ textbook がある（その参照が文を支えるかは監査で見る）: 57 項目・59 文

## A. エントリの出典にも参照がない

| コレクション | id | 欄 | 文 |
|---|---|---|---|
| terms | arrange-by-the-variable-of-lowest-degree | mapping_note | いちばん近い米国の手法は factoring by grouping（項をまとめて共通因数をくくる）だが、同じ手法ではない。 |
| terms | auxiliary-angle-form | mapping_note | 英国の教科書では harmonic form ／ auxiliary angle method と呼ぶことがあるが、米国の用例には出てこない。 |
| terms | auxiliary-angle-form | mapping_note | 米国では write a sin θ + b cos θ as a single sine function（R sin(θ + α) の形に書く）と手順で言う。 |
| terms | cauchy-schwarz-inequality | pitfalls[0] | 米国の高校課程では名前を出さず、ベクトルの \|u · v\| ≤ \|u\|\|v\| として触れる程度。 |
| terms | congruence-criteria-for-right-triangles | mapping_note | 米国の Geometry は、日本の 2 つの条件のうち「斜辺と他の 1 辺がそれぞれ等しい」を HL（hypotenuse-leg）と呼んで定理として扱い、「斜辺と 1 つの鋭角がそれぞれ等しい」は AAS で示せる。 |
| terms | cross-method | mapping_note | 係数を斜めに掛けて組み合わせを探すのは日本の方法で、米国では ac method（ac を 2 つに分けて factoring by grouping、エントリ factoring-by-grouping）、box method、guess and check などと呼ばれる方法で ax² + bx + c を因数分解する。 |
| terms | equivalence-relation | pitfalls[0] | 米国の Geometry で習う reflexive property などは、等号や合同についての同じ性質の名前。 |
| terms | nth-roots-of-unity | pitfalls[1] | 数II の 1 の 3 乗根 ω（ω² + ω + 1 = 0、ω³ = 1）は、英語でも cube roots of unity と呼び、ω（omega）の記号を使うが、米国の高校課程では ω に決まった呼び名や性質の練習はほぼない。 |
| terms | position-of-a-line-relative-to-a-circle | mapping_note | 米国では「直線が円と 2 点で交わる／接する／交わらない」を how many points the line and the circle have in common として個別に言い、ひとまとめの名前はない。 |
| terms | postulate | mapping_note | 米国の Geometry では証明の前提を postulate と呼び、名前付きで使う（segment addition postulate、parallel postulate など）。 |
| terms | transformation-of-a-variable | pitfalls[1] | AP Statistics では、散布図が曲がっているとき y の対数をとるなどして直線に近づけることも transforming data と言う。 |
| terms | vector-equation-of-a-circle | mapping_note | 米国の教科書は円を (x − h)² + (y − k)² = r² の形で扱い、ベクトル方程式としては立てない。 |
| symbols | combination-ncr | notes[0] | 日本の教科書は ₙCᵣ と書き、米国の教科書は C(n, r)、ₙCᵣ、または縦に並べた二項係数 (n over r) の形で書く。 |
| symbols | integers-symbol | notes[0] | 文字どおり Z（米国の発音は zee）とも言う。 |
| symbols | mixed-number | notes[1] | 米国の Pre-Algebra の教材は帯分数を使い続ける。 |
| symbols | piecewise-brace | notes[1] | 米国の教科書は条件を式の右に書き（x² if x ≥ 0）、日本のように ( ) でくくらないことが多い。 |
| symbols | vector-arrow-notation | notes[1] | 米国の教科書は太字で書き、手書きでは矢印を付ける。 |
| phrases | explaining-solution-in-context | variants[0].note | AP の記述問題で求められる「文脈に即した解釈」。 |

## B. エントリの出典に参照がある

| コレクション | id | 欄 | 文 | エントリの参照 |
|---|---|---|---|---|
| terms | accumulation-function | mapping_note | 後者の「定積分を定数 k とおく」型の問題が米国の教科書にあるかは教科書による。 | College Board, AP Calculus AB and BC Course and Exam Description (Effective Fall 2020) |
| terms | angle-addition-formulas | pitfalls[0] | 値を「求めよ」は、米国の問題では find the exact value（小数ではなく正確な値）と書くことが多い。 | OpenStax Algebra and Trigonometry 2e |
| terms | angle-sum-of-a-triangle | mapping_note | 日本語は「三角形の内角の和」という量の名前で言うが、米国の Geometry はこれを定理の名前 triangle sum theorem（triangle angle sum theorem）で呼ぶ。 | CK-12 Geometry (K12 LibreTexts) |
| terms | arc-measure | mapping_note | 米国の Geometry では弧 AB の度数を、AB の上に弧の記号を付けた記号に m を添えて書き、中心角と同じ度数で表す（長さの arc length とは別）。 | Illustrative Mathematics, IM 9–12 Math (Geometry); CK-12 Geometry (K12 LibreTexts) |
| terms | axiom | pitfalls[0] | 米国の Geometry の授業では、ユークリッド幾何の公理を postulate と呼ぶ。 | OpenStax Introductory Statistics 2e |
| terms | conditional-statement | mapping_note | 英語では論理・離散数学が implication、米国の Geometry の教科書が conditional statement（if-then statement）と呼ぶ。 | Oscar Levin, Discrete Mathematics: An Open Introduction, 4th edition |
| terms | congruence-criteria | mapping_note | 米国の Geometry は SSS・SAS・ASA に AAS と直角三角形の HL を加え、それぞれを定理（theorem）や公準（postulate）として名前で呼ぶ（エントリ sss-congruence、sas-congruence、asa-congruence、aas-congruence、hl-congruence）。 | Illustrative Mathematics, IM 9–12 Math (Geometry); 中学校学習指導要領（平成29年告示）解説 数学編 |
| terms | corollary | pitfalls[1] | 米国式の発音は第 1 音節に強勢（COR-uh-lair-ee）。 | OpenStax Calculus Volume 1; OpenStax Algebra and Trigonometry 2e |
| terms | corresponding-angles-postulate | mapping_note | 米国の教科書では公準（postulate）とするものと定理（theorem）とするものがある。 | CK-12 Geometry (K12 LibreTexts) |
| terms | difference-quotient | mapping_note | 米国の Precalculus・Calculus では difference quotient と名前で呼ぶ。 | OpenStax Calculus Volume 1 |
| terms | end-behavior | pitfalls[2] | behavior は米国の綴り（英国は behaviour）。 | OpenStax Algebra and Trigonometry 2e |
| terms | equal | pitfalls[1] | 米国の Geometry は、線分や角そのものが重なることを congruent（≅）、その長さや大きさが同じことを equal（=）と分けて書く（AB ≅ CD のとき AB = CD）。 | OpenStax Prealgebra 2e |
| terms | equation-of-a-line | pitfalls[1] | 米国では形に名前をつけて呼ぶ: slope-intercept form（y = mx + b）、point-slope form（y − y₁ = m(x − x₁)）、standard form（Ax + By = C）。 | OpenStax Algebra and Trigonometry 2e; OpenStax Calculus Volume 3 |
| terms | even-function | pitfalls[0] | 米国の問題は even, odd, or neither（どちらでもない）の 3 択で聞くことが多い。 | OpenStax Algebra and Trigonometry 2e; OpenStax Calculus Volume 1 |
| terms | expanding-and-condensing-logs | mapping_note | 米国の授業では、対数の性質で 1 つの log を和・差に分けることを expand、和・差を 1 つの log にまとめることを condense と呼ぶ。 | OpenStax Algebra and Trigonometry 2e; OpenStax Intermediate Algebra 2e |
| terms | general-form-of-a-circle | pitfalls[0] | 米国の教科書は係数に D, E, F を使うことが多い。 | OpenStax Algebra and Trigonometry 2e; OpenStax Intermediate Algebra 2e |
| terms | geometric-mean | pitfalls[0] | 米国の Geometry では、直角三角形の高さが斜辺の 2 つの部分の geometric mean になる（相似の単元）ことで出てくる。 | OpenStax Introductory Statistics 2e |
| terms | half-angle-formulas | pitfalls[0] | 米国の教科書は sin(α/2) = ±√((1 − cos α)/2) と平方根の形で書く（符号は α/2 の象限で決める）。 | OpenStax Algebra and Trigonometry 2e |
| terms | hypothesis | mapping_note | 証明の「仮定」は、論理・定理の文脈では hypothesis（p ならば q の p）、米国の Geometry の答案では Given（2 列証明の最初の行の見出し）と言い、1 語に決まらない。 | CK-12 Geometry (K12 LibreTexts) |
| terms | hypothesis | pitfalls[1] | 米国の Geometry の 2 列証明では、仮定を Given:、示すことを Prove: という見出しで書き、hypothesis とは書かない。 | CK-12 Geometry (K12 LibreTexts) |
| terms | identity-matrix | definition_ja | E（米国の教科書では I）と書く。 | OpenStax Algebra and Trigonometry 2e |
| terms | initial-side | pitfalls[0] | 始線を x 軸の正の部分にとった角を、米国では an angle in standard position（標準の位置の角）と呼ぶ。 | OpenStax Algebra and Trigonometry 2e |
| terms | law-of-detachment | pitfalls[0] | 米国の Geometry の教科書では law of detachment、論理学・離散数学では modus ponens と呼ぶ。 | Oscar Levin, Discrete Mathematics: An Open Introduction, 4th edition; CK-12 Geometry (K12 LibreTexts) |
| terms | logarithm | pitfalls[2] | 米国では log x は常用対数（底 10）、ln x は自然対数を表す。 | OpenStax Algebra and Trigonometry 2e; OpenStax Intermediate Algebra 2e |
| terms | permutation | pitfalls[0] | 米国の教科書では P(n, r) や ₙPᵣ と書く。 | OpenStax Algebra and Trigonometry 2e; OpenStax Calculus Volume 3 |
| terms | proving-an-identity | pitfalls[1] | 証明の途中で両辺に同じ操作をして 1 = 1 を導く書き方は、米国の教科書でも避ける（片側を変形していく）。 | OpenStax Algebra and Trigonometry 2e |
| terms | pythagorean-identity | pitfalls[0] | 米国の教科書は 1 + tan²θ = sec²θ、1 + cot²θ = csc²θ も合わせて Pythagorean identities（複数形）と呼ぶ。 | OpenStax Algebra and Trigonometry 2e; OpenStax Calculus Volume 1 |
| terms | rational-expression | pitfalls[0] | 米国の教科書は excluded values（または restrictions）と呼ぶ。 | OpenStax Algebra and Trigonometry 2e |
| terms | rational-function | mapping_note | 米国の rational function は多項式 ÷ 多項式の関数全般を指し、日本語では有理関数に当たる。 | OpenStax Algebra and Trigonometry 2e; OpenStax Calculus Volume 1; 高等学校学習指導要領（平成30年告示）解説 数学編 理数編 |
| terms | reflexive-property | pitfalls[0] | 米国の Geometry の 2 列証明では、理由の列に Reflexive Property（of Congruence）と書く。 | CK-12 Geometry (K12 LibreTexts) |
| terms | remainder-theorem | pitfalls[0] | 2 次式で割った余り（ax + b の形）を求める問題は、米国の高校ではあまり扱わない。 | OpenStax Algebra and Trigonometry 2e |
| terms | scientific-notation | pitfalls[0] | 英国では standard form と言うが、米国の standard form は別の意味（直線の式 Ax + By = C など、エントリ standard-form-of-a-line）。 | OpenStax Prealgebra 2e; OpenStax Elementary Algebra 2e; OpenStax Algebra and Trigonometry 2e |
| terms | similar-triangles | pitfalls[0] | 相似の記号は日本では ∽、米国では ~（△ABC ~ △DEF）。 | OpenStax Calculus Volume 1; OpenStax Algebra and Trigonometry 2e |
| terms | similarity-criteria | mapping_note | 米国の Geometry はこれを SSS similarity、SAS similarity、AA similarity（エントリ aa-similarity）と名前で呼ぶ。 | Illustrative Mathematics, IM 9–12 Math (Geometry) |
| terms | statistics | pitfalls[1] | AP Statistics・Intro Statistics のように科目名にも使う。 | OpenStax Introductory Statistics 2e |
| terms | taylors-theorem | pitfalls[0] | AP では剰余の評価を Lagrange error bound と呼ぶ（lagrange-error-bound を参照）。 | OpenStax Calculus Volume 2 |
| terms | transitive-property | pitfalls[1] | 米国の Geometry の証明では、等式なら transitive property of equality、合同なら transitive property of congruence と対象を付けて書く。 | CK-12 Geometry (K12 LibreTexts) |
| terms | trapezoid | mapping_note | 米国の教材では台形の定義が分かれる。 | OpenStax Prealgebra 2e |
| terms | trapezoidal-rule | pitfalls[1] | trapezoid（台形）は米国の言い方。 | OpenStax Calculus Volume 2; College Board, AP Calculus AB and BC Course and Exam Description (Effective Fall 2020) |
| terms | trigonometric-function | pitfalls[0] | 米国の教科書は sin・cos・tan に加えて csc（cosecant）・sec（secant）・cot（cotangent）も使う。 | OpenStax Algebra and Trigonometry 2e; OpenStax Calculus Volume 1 |
| terms | trinomial | pitfalls[1] | 米国の Algebra 1 では、x² + bx + c の形の式を因数分解することを factor trinomials と言う。 | OpenStax Elementary Algebra 2e |
| terms | triple-angle-formulas | pitfalls[0] | 米国の高校課程では公式として覚えさせず、必要なら加法定理から導く。 | English Wikipedia |
| terms | vector | pitfalls[0] | 日本の教科書は矢印（→）を文字の上に書くが、米国の教科書は太字（v）か、手書きでは上の矢印 v⃗ を使う。 | OpenStax Calculus Volume 3; OpenStax Algebra and Trigonometry 2e |
| terms | write-in-descending-order | mapping_note | 米国の授業では、項が次数の高いものから順に並んでいる多項式を in standard form と言う。 | OpenStax Algebra and Trigonometry 2e |
| terms | zeros-of-a-polynomial | pitfalls[0] | 米国では zero（関数の値が 0 になる x）・root（方程式の解）・x-intercept（グラフの交点）を使い分ける。 | OpenStax Algebra and Trigonometry 2e |
| symbols | alpha | notes[1] | AP Statistics では有意水準も α で表す。 | OpenStax Algebra and Trigonometry 2e; OpenStax Precalculus 2e; OpenStax Introductory Statistics 2e; College Board, AP Statistics Course and Exam Description (Effective Fall 2026) |
| symbols | conditional-probability-subscript-jp | notes[0] | 日本の P_A(B) は、米国の書き方では P(B \| A)。 | 高等学校学習指導要領（平成30年告示）解説 数学編 理数編 |
| symbols | curl-del-cross | notes[1] | 日本の本の rot F（ローテーション）は、米国の教科書では curl F と書く。 | OpenStax Calculus Volume 3 |
| symbols | equals-question-mark | notes[0] | ≟ は米国の教科書の検算（Check）で使い、「等しいか確かめる」ことを示す。 | OpenStax Elementary Algebra 2e; CK-12 Foundation, CK-12 Geometry (K12 LibreTexts) |
| symbols | geq-sign | notes[1] | 米国の教科書は ≥ と書く（≧ との違いは inequality-symbols）。 | 中学校学習指導要領（平成29年告示）〔用語・記号〕; OpenStax Intermediate Algebra 2e; OpenStax Calculus Volume 2 |
| symbols | implies-arrow | notes[1] | 米国の Geometry と離散数学は条件文を p → q とも書く。 | OpenStax Precalculus 2e; CK-12 Foundation, CK-12 Geometry (K12 LibreTexts) |
| symbols | leq-sign | notes[1] | 米国の教科書は ≤ と書く（≦ との違いは inequality-symbols）。 | 中学校学習指導要領（平成29年告示）〔用語・記号〕; OpenStax Calculus Volume 3; OpenStax Intermediate Algebra 2e; College Board, AP Calculus AB and BC Course and Exam Description (Effective Fall 2020) |
| symbols | proportion-colon | notes[0] | 米国の教科書は比例式を a/b = c/d の分数の形で書くことが多く、そのときは a over b equals c over d と読む。 | College Board, AP Calculus AB and BC Course and Exam Description (Effective Fall 2020); OpenStax Prealgebra 2e |
| symbols | ray-ab-arrow | notes[0] | 米国の幾何の矢印の AB は ray AB と読む。 | CK-12 Geometry (K12 LibreTexts) |
| symbols | repeated-combination-h-jp | notes[0] | ₙHᵣ は日本の教科書の記号で、米国にこの記号はない。 | Oscar Levin, Discrete Mathematics: An Open Introduction (4th edition); 日本語版 Wikipedia「重複組合せ」 |
| symbols | repeated-combination-h-jp | notes[1] | 米国では C(n + r − 1, r) と書く（repeated-combination-notation）。 | Oscar Levin, Discrete Mathematics: An Open Introduction (4th edition); 日本語版 Wikipedia「重複組合せ」 |
| symbols | union-sign | notes[1] | 米国の統計の教科書は確率で A OR B とも書く（probability-of-union）。 | OpenStax Precalculus 2e; OpenStax Algebra and Trigonometry 2e |
| symbols | vector-ab-arrow | notes[1] | 米国の Geometry の教科書では、同じ形の矢印を半直線 AB（ray AB）に使うことがある（ray-ab-arrow）。 | OpenStax Calculus Volume 3 |
| phrases | written-solution-given-prove | notes[0] | 米国の二段組の証明（two-column proof）の型。 | CK-12 Geometry (K12 LibreTexts) |
