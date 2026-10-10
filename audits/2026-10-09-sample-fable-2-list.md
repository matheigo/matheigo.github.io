# 公開前の抜き取り（Fable、第 2 回）の 100 項目

作成: 2026-10-09 ／ DECISIONS「監査のモデル」（2026-09-27）の決定: 公開の直前に一度、Claude Fable 5.1 で verified の全体から 100 項目を抜き取って見直し、見落としの率を出す。第 1 回（`audits/2026-10-09-sample-fable.md`）は親が Opus 5.5 だったので（その H-a の 1）、同じ指示文で親も Claude Fable 5.1 のセッションでやり直した。結果は `audits/2026-10-09-sample-fable-2.md`。

- 母集団: 本セッションの開始時（3606db1。第 1 回のレポートのコミット）の verified **1,608 項目**（terms 1,044・symbols 219・phrases 273・conventions 72）を (collection, id) の昇順に並べたリスト。第 1 回の母集団（2510669 の 1,616 項目）とは、第 1 回で likely に戻った 9 項目が抜け、verified になった conventions/us-only-precalculus-topics が入った分だけ違う
- 抜き取り: `random.Random(20261010).sample(リスト, 100)`（指示 1 の種。母集団が変わったので、同じ種でも第 1 回と同じ 100 項目にはならない: 抜き取りの添字は同じでも、添字の指す項目が 1 つずれる。第 1 回と重なるのは 20 項目で、「前回も」の欄に印）
- 内訳: terms 70・phrases 14・symbols 13・conventions 3
- 見直し役（読み取り専用。Claude Fable 5.1、資料を引く道具つき）5 人に 20 項目ずつ: r1〜r3 は terms（抜き取りの順に 20 ずつ）、r4 は terms の残り 10・conventions 3・symbols 7、r5 は symbols 6・phrases 14

| # | コレクション | id | 見直し役 | 第 1 回 |
|---|---|---|---|---|
| 1 | terms | compare-coefficients | r1 |  |
| 2 | symbols | normal-distribution-n | r4 |  |
| 3 | terms | region | r1 |  |
| 4 | phrases | class-asking-does-it-still-work-if | r5 | 前回も |
| 5 | terms | summation-notation | r1 |  |
| 6 | symbols | repeating-decimal-bar | r4 |  |
| 7 | terms | centroid | r1 |  |
| 8 | terms | derivative-of-the-exponential-function | r1 |  |
| 9 | terms | center | r1 |  |
| 10 | terms | composite-number | r1 |  |
| 11 | symbols | radian-unit | r4 |  |
| 12 | terms | proof | r1 |  |
| 13 | symbols | because-sign | r4 |  |
| 14 | phrases | written-solution-taking-the-limit | r5 |  |
| 15 | terms | cylinder | r1 | 前回も |
| 16 | terms | undo-the-log | r1 |  |
| 17 | terms | face | r1 |  |
| 18 | conventions | calculator-instead-of-tables | r4 | 前回も |
| 19 | terms | multiplication | r1 | 前回も |
| 20 | terms | integration-by-substitution | r1 |  |
| 21 | terms | arccosine | r1 | 前回も |
| 22 | terms | center-of-dilation | r1 |  |
| 23 | terms | euclidean-algorithm | r1 |  |
| 24 | terms | permutation-with-repetition | r1 |  |
| 25 | terms | x-coordinate | r1 | 前回も |
| 26 | symbols | angle-abc | r4 |  |
| 27 | symbols | difference-quotient-limit | r4 |  |
| 28 | terms | collinear | r1 |  |
| 29 | terms | angle-sum-of-a-triangle | r1 |  |
| 30 | terms | area-problem | r2 |  |
| 31 | phrases | explaining-solution-plugging-back-in | r5 | 前回も |
| 32 | terms | triangle-proportionality-theorem | r2 |  |
| 33 | phrases | exam-notes-allowed | r5 | 前回も |
| 34 | terms | same-side-interior-angles | r2 |  |
| 35 | phrases | class-listening-this-will-be-on-the-test | r5 | 前回も |
| 36 | phrases | exam-ask-typo | r5 | 前回も |
| 37 | symbols | summation-sigma | r4 |  |
| 38 | terms | binomial-coefficient | r2 |  |
| 39 | terms | data | r2 | 前回も |
| 40 | terms | arctangent | r2 |  |
| 41 | terms | rewrite-in-exponential-form | r2 |  |
| 42 | phrases | class-listening-sanity-check | r5 | 前回も |
| 43 | terms | factor-theorem | r2 |  |
| 44 | terms | cross-method | r2 |  |
| 45 | phrases | office-hours-english-terms-are-new | r5 |  |
| 46 | terms | symmetric-expression | r2 |  |
| 47 | terms | decimal | r2 |  |
| 48 | terms | monomial | r2 |  |
| 49 | terms | linear-equation | r2 |  |
| 50 | phrases | check-the-sign | r5 |  |
| 51 | terms | linear-programming | r2 |  |
| 52 | terms | distribute | r2 |  |
| 53 | symbols | complex-conjugate-bar | r5 |  |
| 54 | terms | perimeter | r2 |  |
| 55 | symbols | integers-symbol | r5 |  |
| 56 | phrases | discord-notes-from-today | r5 | 前回も |
| 57 | terms | motion-problem | r2 |  |
| 58 | terms | choose | r2 |  |
| 59 | terms | write-an-equation | r2 |  |
| 60 | terms | ascending-order | r2 |  |
| 61 | terms | phase-shift | r3 |  |
| 62 | terms | orthographic-projection | r3 |  |
| 63 | terms | rotate | r3 |  |
| 64 | terms | plane | r3 |  |
| 65 | terms | distance-from-a-point-to-a-line | r3 |  |
| 66 | terms | inverse-trigonometric-function | r3 |  |
| 67 | symbols | hyperbolic-functions-notation | r5 |  |
| 68 | terms | right-hand-limit | r3 |  |
| 69 | terms | limit-of-a-riemann-sum | r3 | 前回も |
| 70 | terms | derivatives-of-inverse-trig-functions | r3 |  |
| 71 | terms | element | r3 |  |
| 72 | phrases | explaining-solution-derivative-equal-to-zero | r5 | 前回も |
| 73 | terms | be-inscribed-in | r3 |  |
| 74 | conventions | inequality-graph-boundary | r4 | 前回も |
| 75 | terms | identity | r3 |  |
| 76 | terms | hold | r3 |  |
| 77 | terms | line-perpendicular-to-a-plane | r3 |  |
| 78 | terms | subtract | r3 |  |
| 79 | terms | acute-angle | r3 |  |
| 80 | phrases | written-solution-hypotheses-are-met | r5 |  |
| 81 | conventions | similarity-symbol | r4 | 前回も |
| 82 | terms | radian | r3 | 前回も |
| 83 | terms | standard-normal-table | r3 |  |
| 84 | terms | left-hand-limit | r3 |  |
| 85 | phrases | email-subject-line | r5 | 前回も |
| 86 | terms | diophantine-equation | r3 |  |
| 87 | phrases | the-one-sided-limits-agree | r5 |  |
| 88 | terms | dividend | r4 |  |
| 89 | terms | sum-of-an-arithmetic-sequence | r4 | 前回も |
| 90 | terms | implicit-function | r4 |  |
| 91 | terms | necessary-and-sufficient-condition | r4 |  |
| 92 | symbols | therefore-sign | r5 |  |
| 93 | terms | logarithmic-function | r4 |  |
| 94 | symbols | inverse-cosine-notation | r5 |  |
| 95 | terms | optimization-problem | r4 |  |
| 96 | symbols | cube-root | r5 |  |
| 97 | terms | differentiate-twice | r4 |  |
| 98 | terms | random-number | r4 |  |
| 99 | terms | area-under-the-curve | r4 |  |
| 100 | terms | combine-like-terms | r4 |  |
