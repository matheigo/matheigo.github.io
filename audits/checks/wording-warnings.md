# 確かめられない言い方の警告（validate。scripts/lib/wording.ts・scripts/lib/corpus-count.ts）

作成: 2026-09-26 ／ `python3 scripts/audit/wording_warnings.py`（`pnpm validate` の warn を集めた）。監査 2 の H-5 で足した警告（通じる／一番よく使う／減点／資料の名前のない「ことが多い」）、監査 3 の AT_LARGE（資料の名前のない「英語には〜がない」）、本文の用例コーパスの件数らしい数字。

- 文: **45**（verified 0）

| バッチ | コレクション | id | confidence | 欄 | 文 |
|---|---|---|---|---|---|
| 17 | terms | circular-permutation | likely | pitfalls[1] | 問題文では arrange … around a round table のように並べ方を文で書くことが多い。 |
| 17 | terms | diophantine-equation | likely | definition_ja | 未知数の数が式の数より多く、解が 1 つに定まらないことが多い。 |
| 17 | terms | intersection-of-events | likely | pitfalls[0] | 確率では A ∩ B を「A and B」と読むことが多い。 |
| 17 | terms | union-of-events | likely | pitfalls[0] | 確率では A ∪ B を「A or B」と読むことが多い。 |
| 18 | terms | cubic-equation | likely | pitfalls[0] | 授業では単に a cubic（3 次式）と言うことが多い。 |
| 18 | terms | polynomial-equation-of-higher-degree | likely | definition_ja | 因数定理で因数分解して解くことが多い。 |
| 19 | terms | angle-addition-formulas | likely | pitfalls[0] | 値を「求めよ」は、米国の問題では find the exact value（小数ではなく正確な値）と書くことが多い。 |
| 19 | terms | auxiliary-angle-form | likely | mapping_note | 「合成」を synthesis と訳すと通じない言い方になる（STYLE の直訳禁止リスト）。 |
| 19 | terms | division-algorithm | likely | pitfalls[0] | 授業では式 A = BQ + R をそのまま言うことが多い。 |
| 19 | terms | even-function | likely | pitfalls[0] | 米国の問題は even, odd, or neither（どちらでもない）の 3 択で聞くことが多い。 |
| 19 | terms | radian-measure | likely | pitfalls[1] | 授業では単に in radians と言うことが多い（radian を参照）。 |
| 20 | terms | general-form-of-a-circle | likely | pitfalls[0] | 米国の教科書は係数に D, E, F を使うことが多い。 |
| 20 | terms | mathematical-model | likely | pitfalls[0] | 英語では a model、modeling（モデル化）と言うことが多い。 |
| 21 | terms | base-case | likely | mapping_note | 日本の答案は「[1] n = 1 のとき」と書くだけで、この段に名前をつけないことが多い。 |
| 21 | terms | central-limit-theorem | likely | pitfalls[1] | 標本の大きさの目安を n ≥ 30（at least 30 など）とすることが多いが、教科書によって違う。 |
| 21 | terms | characteristic-equation | likely | mapping_note | 日本の数B の「特性方程式」は、aₙ₊₁ = paₙ + q に対して α = pα + q とおく式を指すことが多い。 |
| 21 | terms | interval-estimation | likely | mapping_note | 日本語の「区間推定」は推定の方法の名前で、英語の interval estimate は推定した区間（信頼区間 confidence interval）を指すことが多い。 |
| 22 | terms | statistical-graph | likely | pitfalls[0] | 英語では総称より、個々のグラフの名前（bar graph、line graph、pie chart など）で呼ぶことが多い。 |
| 23 | terms | argument-of-a-complex-number | likely | pitfalls[2] | 極座標の θ（偏角）には名前をつけないことが多い（polar-angle を参照）。 |
| 23 | terms | linearly-independent | likely | pitfalls[0] | 日本の高校は「一次独立」、大学の線形代数は「線形独立」と呼ぶことが多いが、英語はどちらも linearly independent（名詞は linear independence）。 |
| 23 | terms | pemdas | likely | mapping_note | 日本には演算の順序の覚え方の決まった名前がない。 |
| 24 | terms | area-model | likely | mapping_note | 日本の中 3 の教科書も、長方形の面積で式の展開を説明するが、図に決まった名前はない。 |
| 24 | terms | foil | likely | pitfalls[2] | Outer と Inner の項は同類項になることが多いので、FOIL のあとでまとめる（(x + 4)(x − 3) = x² − 3x + 4x − 12 = x² + x − 12）。 |
| 24 | terms | piecewise-function | likely | mapping_note | 日本の高校では「場合分けして定義された関数」として扱い、名前を付けないことが多い。 |
| 24 | terms | point-slope-form | likely | mapping_note | 中 2 では y = ax + b に点の座標を代入して b を求めることが多い。 |
| 25 | terms | image | likely | mapping_note | 日本の中学では「移した図形」「移動後の図形」と言い、像という言葉は写像（大学）で使うことが多い。 |
| 26 | terms | continuous-compounding | likely | pitfalls[0] | 英語は名詞の continuous compounding より、interest compounded continuously ／ continuously compounded interest の形で言うことが多い（教科書は compounded continuously、授業では continuously compounded の語順が多い）。 |
| 28 | terms | statistical-power | likely | pitfalls[0] | 授業では単に power と言うことが多いが、語のままの power は累乗（x to the power of）と同じ語で数えられない。 |
| 30 | terms | generating-function | likely | pitfalls[1] | 母関数では x に値を代入せず、係数を並べる入れ物として扱うことが多い。 |
| 31 | terms | recursive-algorithm | likely | pitfalls[1] | 日本語の「帰納的」も「再帰的」も英語では recursive になることが多い（帰納的定義 = recursive definition）。 |
| 32 | symbols | piecewise-brace | likely | notes[1] | 米国の教科書は条件を式の右に書き（x² if x ≥ 0）、日本のように ( ) でくくらないことが多い。 |
| 33 | symbols | element-of-sign | likely | notes[1] | x ∈ ℝ は x is a real number と言いかえることが多い。 |
| 33 | symbols | integral-definite | likely | notes[1] | 日本では「インテグラル a から b、f(x) dx」と記号を左から順に読むことが多い。 |
| 34 | symbols | angle-bracket-vector | likely | notes[0] | 山かっこ（angle brackets）は読まないことが多い。 |
| 37 | phrases | class-asking-which-problems | likely | variants[0].note | 教科書の奇数番の問題（巻末に答えがあることが多い）だけかを聞く。 |
| 41 | conventions | interval-notation-vs-inequalities | likely | advice_ja | 米国では解を (2, 3]・[1, ∞) のように区間で答えることが多い。 |
| 41 | phrases | discord-anyone-get | likely | variants[0].note | チャットでは文頭を小文字で書くことが多い。 |
| 42 | conventions | congruence-abbreviations-in-proofs | likely | advice_ja | 略号（SSS、CPCTC）は米国の答案では理由としてそのまま通じる。 |
| 42 | conventions | constant-of-integration-remark | likely | advice_ja | C が何かの説明は、英語の教科書では省くことが多い。 |
| 42 | conventions | jp-named-techniques-unnamed-in-us | likely | advice_ja | 名前で言っても通じないので、中身を言う（write a sin θ + b cos θ as a single sine function、the sum of the roots is −b/a、the set of all points such that …）。 |
| 43 | conventions | calculator-instead-of-tables | likely | advice_ja | 米国の授業では電卓の関数で確率を出すことが多い。 |
| 43 | conventions | jp-only-number-theory | likely | advice_ja | 高校の授業では通じないことがある。 |
| 43 | conventions | jp-only-synthetic-geometry | likely | advice_ja | Ceva’s theorem・Menelaus’s theorem は英語の名前もあるが、米国の高校の Geometry では扱わないことが多い。 |
| 43 | conventions | logic-in-geometry-course | likely | advice_ja | 米国の Geometry の最初の単元に論理が入っていることが多い。 |
| 43 | conventions | two-column-proof-format | likely | advice_ja | 米国の Geometry では two-column proof を指示されることが多い。 |
