# 米国側の主張の文で出典に当たる参照がないもの（Phase 5 の監査の前の機械の確かめ 3）

作成: 2026-10-09 ／ `pnpm audit:claims`（scripts/audit/claims.ts）

対象の欄は日本側と同じ。米国側の主張（米国・アメリカ・AP・CED・College Board・英語圏・Calc I〜III・Calculus AB／BC）の文のうち、
文の中に参照（CED・OpenStax・IM・CK-12・Nicholson・Levin・Wikipedia・topic の番号ほか）も用例コーパス（講義・話し言葉・書き言葉・Khan・MIT ほか）も名指ししないもの。

- 米国側の主張の文で参照かコーパスを名指しするもの: 426 文（一覧にしない）
- **A. 名指しがなく、エントリの出典にも reference ／ textbook がない: 4 項目・4 文**
- B. 名指しはないが、エントリの出典に reference ／ textbook がある（その参照が文を支えるかは監査で見る）: 21 項目・22 文

## A. エントリの出典にも参照がない

| コレクション | id | 欄 | 文 |
|---|---|---|---|
| terms | equivalence-relation | pitfalls[0] | 米国の Geometry で習う reflexive property などは、等号や合同についての同じ性質の名前。 |
| terms | postulate | mapping_note | 米国の Geometry では証明の前提を postulate と呼び、名前付きで使う（segment addition postulate、parallel postulate など）。 |
| terms | quadratic-regression | mapping_note | 米国は Algebra 1・2 のグラフ電卓の QuadReg。 |
| terms | vector-equation-of-a-circle | mapping_note | 米国の教科書は円を (x − h)² + (y − k)² = r² の形で扱い、ベクトル方程式としては立てない。 |

## B. エントリの出典に参照がある

| コレクション | id | 欄 | 文 | エントリの参照 |
|---|---|---|---|---|
| terms | accumulation-function | mapping_note | 後者の「定積分を定数 k とおく」型の問題が米国の教科書にあるかは教科書による。 | College Board, AP Calculus AB and BC Course and Exam Description (Effective Fall 2020); 高等学校学習指導要領（平成30年告示）解説 数学編 理数編; OpenStax Calculus Volume 1 |
| terms | arc-measure | mapping_note | 米国の Geometry では弧 AB の度数を、AB の上に弧の記号を付けた記号に m を添えて書き、中心角と同じ度数で表す（長さの arc length とは別）。 | Illustrative Mathematics, IM 9–12 Math (Geometry); CK-12 Geometry (K12 LibreTexts) |
| terms | corollary | pitfalls[1] | 米国式の発音は第 1 音節に強勢（COR-uh-lair-ee。Merriam-Webster: ˈkȯr-ə-ˌler-ē、英国式は kə-ˈrä-lə-rē）。 | OpenStax Calculus Volume 1; OpenStax Algebra and Trigonometry 2e; Merriam-Webster「corollary」 |
| terms | corresponding-angles-postulate | mapping_note | 米国の教科書では公準（postulate）とするものと定理（theorem）とするものがある。 | CK-12 Geometry (K12 LibreTexts) |
| terms | difference-quotient | mapping_note | 米国の Precalculus・Calculus では difference quotient と名前で呼ぶ。 | OpenStax Calculus Volume 1 |
| terms | end-behavior | pitfalls[2] | behavior は米国の綴り（英国は behaviour）。 | OpenStax Algebra and Trigonometry 2e; English Wikipedia |
| terms | expanding-and-condensing-logs | mapping_note | 米国の授業では、対数の性質で 1 つの log を和・差に分けることを expand、和・差を 1 つの log にまとめることを condense と呼ぶ。 | OpenStax Algebra and Trigonometry 2e; OpenStax Intermediate Algebra 2e |
| terms | hypothesis | mapping_note | 証明の「仮定」は、論理・定理の文脈では hypothesis（p ならば q の p）、米国の Geometry の答案では Given（2 列証明の最初の行の見出し）と言い、1 語に決まらない。 | CK-12 Geometry (K12 LibreTexts) |
| terms | hypothesis | pitfalls[1] | 米国の Geometry の 2 列証明では、仮定を Given:、示すことを Prove: という見出しで書き、hypothesis とは書かない。 | CK-12 Geometry (K12 LibreTexts) |
| terms | identity-matrix | definition_ja | E（米国の教科書では I）と書く。 | OpenStax Algebra and Trigonometry 2e |
| terms | law-of-detachment | pitfalls[0] | 米国の Geometry の教科書では law of detachment、論理学・離散数学では modus ponens と呼ぶ。 | Oscar Levin, Discrete Mathematics: An Open Introduction, 4th edition; CK-12 Geometry (K12 LibreTexts) |
| terms | pythagorean-identity | pitfalls[0] | 米国の教科書は 1 + tan²θ = sec²θ、1 + cot²θ = csc²θ も合わせて Pythagorean identities（複数形）と呼ぶ。 | OpenStax Algebra and Trigonometry 2e; OpenStax Calculus Volume 1 |
| terms | rational-function | mapping_note | 米国の rational function は多項式 ÷ 多項式の関数全般を指し、日本語では有理関数に当たる。 | OpenStax Algebra and Trigonometry 2e; OpenStax Calculus Volume 1; 高等学校学習指導要領（平成30年告示）解説 数学編 理数編 |
| terms | scientific-notation | pitfalls[0] | 英国では standard form と言うが、米国の standard form は別の意味（直線の式 Ax + By = C など、エントリ standard-form-of-a-line）。 | OpenStax Prealgebra 2e; OpenStax Elementary Algebra 2e; OpenStax Algebra and Trigonometry 2e; English Wikipedia |
| terms | statistics | pitfalls[1] | AP Statistics・Intro Statistics のように科目名にも使う。 | OpenStax Introductory Statistics 2e |
| terms | taylors-theorem | pitfalls[0] | AP では剰余の評価を Lagrange error bound と呼ぶ（lagrange-error-bound を参照）。 | OpenStax Calculus Volume 2 |
| terms | transitive-property | pitfalls[1] | 米国の Geometry の証明では、等式なら transitive property of equality、合同なら transitive property of congruence と対象を付けて書く。 | CK-12 Geometry (K12 LibreTexts) |
| terms | trapezoid | mapping_note | 米国の教材では台形の定義が分かれる。 | OpenStax Prealgebra 2e; English Wikipedia; CK-12 Geometry (K12 LibreTexts); Illustrative Mathematics, IM 9–12 Math (Geometry); 日本語版 Wikipedia「台形」; 大学入試センター 令和3年度 大学入学共通テスト 第1日程 数学Ⅱ・数学Ｂ（問題） |
| terms | trapezoidal-rule | pitfalls[1] | trapezoid（台形）は米国の言い方。 | OpenStax Calculus Volume 2; College Board, AP Calculus AB and BC Course and Exam Description (Effective Fall 2020); English Wikipedia; 高等学校学習指導要領（平成30年告示）解説 数学編 理数編 |
| terms | vector | pitfalls[0] | 日本の教科書は矢印（→）を文字の上に書くが、米国の教科書は太字（v）か、手書きでは上の矢印 v⃗ を使う。 | OpenStax Calculus Volume 3; OpenStax Algebra and Trigonometry 2e |
| terms | zeros-of-a-polynomial | pitfalls[0] | 米国では zero（関数の値が 0 になる x）・root（方程式の解）・x-intercept（グラフの交点）を使い分ける。 | OpenStax Algebra and Trigonometry 2e |
| symbols | integers-symbol | notes[0] | 文字どおり Z（米国の発音は zee。Merriam-Webster: ˈzē、カナダ・英国・オーストラリアは ˈzed）とも言う。 | Merriam-Webster「z」; Oscar Levin, Discrete Mathematics: An Open Introduction, 4th edition |
