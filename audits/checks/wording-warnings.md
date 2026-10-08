# 確かめられない言い方の警告（validate。scripts/lib/wording.ts・scripts/lib/corpus-count.ts）

作成: 2026-10-07 ／ `python3 scripts/audit/wording_warnings.py`（`pnpm validate` の warn を集めた）。監査 2 の H-5 で足した警告（通じる／一番よく使う／減点／資料の名前のない「ことが多い」）、監査 3 の AT_LARGE（資料の名前のない「英語には〜がない」）、本文の用例コーパスの件数らしい数字、監査 6 の決定 8 の判定の説明（pitfalls・notes の「用例コーパスでは…の形で数えた」など）。

- 文: **22**（verified 1）

| バッチ | コレクション | id | confidence | 欄 | 文 |
|---|---|---|---|---|---|
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
| 30 | terms | generating-function | likely | pitfalls[1] | 母関数では x に値を代入せず、係数を並べる入れ物として扱うことが多い。 |
| 31 | terms | recursive-algorithm | likely | pitfalls[1] | 日本語の「帰納的」も「再帰的」も英語では recursive になることが多い（帰納的定義 = recursive definition）。 |
| 34 | symbols | qed-end-of-proof | verified | notes[0] | 記号そのものは読まないことが多い。 |
| 43 | conventions | calculator-instead-of-tables | likely | advice_ja | 米国の授業では電卓の関数で確率を出すことが多い。 |
| 43 | conventions | congruence-abbreviations-in-proofs | likely | advice_ja | 略号（SSS、CPCTC）は米国の答案では理由としてそのまま通じる。 |
| 43 | conventions | constant-of-integration-remark | likely | advice_ja | C が何かの説明は、英語の教科書では省くことが多い。 |
| 43 | conventions | interval-notation-vs-inequalities | likely | advice_ja | 米国では解を (2, 3]・[1, ∞) のように区間で答えることが多い。 |
| 43 | conventions | jp-named-techniques-unnamed-in-us | likely | advice_ja | 名前で言っても通じないので、中身を言う（rewrite a sin θ + b cos θ as a single sine function、the sum of the roots is −b/a、the set of all points such that …）。 |
| 43 | conventions | jp-only-number-theory | likely | advice_ja | 高校の授業では通じないことがある。 |
| 43 | conventions | jp-only-synthetic-geometry | likely | advice_ja | Ceva’s theorem・Menelaus’s theorem は英語の名前もあるが、米国の高校の Geometry では扱わないことが多い。 |
| 43 | conventions | logic-in-geometry-course | likely | advice_ja | 米国の Geometry の最初の単元に論理が入っていることが多い。 |
| 43 | conventions | two-column-proof-format | likely | advice_ja | 米国の Geometry では two-column proof を指示されることが多い。 |
