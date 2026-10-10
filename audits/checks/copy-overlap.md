# 書き写しの検出（Phase 5 の監査の前の機械の確かめ 1）

作成: 2026-10-09 ／ `pnpm audit:copy`（scripts/audit/copy-check.ts）

規則: 英語は連続 8 語以上、日本語は空白を除いて 20 文字以上、エントリの本文（定義・例文・pitfalls・mapping_note・variants の note・コロケーション、記号の notes・日本語の読み、フレーズの en・ja・意図・variants・notes、慣習差の題・jp・us・advice_ja）が
用例コーパス（manifest の全ファイル: MIT OCW・Khan Academy・YouTube・MICASE・OpenStax・MIT の講義ノート）と参照（CED 2 つ・Nicholson・Levin・IM 2 つ・CK-12 2 つ）、
日本側の資料（学習指導要領解説 2 つ・共通テスト／センター試験の問題と正解の本文（画像だけの PDF は OCR）・日本語版 Wikipedia）と一致する箇所。数式だけの窓（3 文字以上の英単語が 3 語未満）と、日本語の窓でかな・漢字が 10 文字未満のもの（日本語の文の中の英語の名前）は数えない。
表の「一致」はエントリ側の語（コーパスの文はここに書かない）。ソースの数は一致が見つかったソース（manifest の id、参照、日本側の資料）の数。3 つ以上のソースにある一致は、数式の読みや決まった言い回しのことが多い。

- 調べた本文の欄: 15661
- 英語のソース: 3884 ファイル ／ 日本語のソース: 542 ファイル
- 一致した箇所: **333**（291 項目）
- 見出しの句を含む一致で除いたもの: 150 箇所（138 項目。見出し（en.term・en.alt・variants ／ ja.term・ja.alt）の語を除いた残りが 8 語（日本語 20 文字）に届かない一致は、手法の名前そのものなので一覧に出さない。Phase 5 監査 5 の決定 7。copy-overlap.json の headword に残す）

| コレクション | id | 欄 | 言語 | 長さ | 一致（エントリの語） | ソースの数 | ソース |
|---|---|---|---|---|---|---|---|
| conventions | accumulation-function-scope | us | en | 11 | topic 6 4 the fundamental theorem of calculus and accumulation functions | 1 | ref:ap-calculus-ab-bc-ced |
| conventions | constant-of-integration-remark | us | en | 9 | f x c where c is any real number | 1 | openstax-calculus |
| conventions | descriptive-statistics-coverage | advice_ja | en | 11 | grade 6 8 12 using mean and mad to make comparisons | 1 | ref:im-6-8 |
| conventions | floor-function-notation | us | en | 9 | the greatest integer less than or equal to x | 1 | openstax-calculus |
| conventions | floor-function-notation | advice_ja | en | 9 | the greatest integer less than or equal to x | 1 | openstax-calculus |
| conventions | hensachi | us | en | 9 | 2 3 measures of the location of the data | 1 | openstax-introstats |
| conventions | inverse-trig-functions | us | en | 9 | geometry 4 9 using trigonometric ratios to find angles | 1 | ref:im-9-12 |
| conventions | mapping-rule-notation | jp | ja | 22 | 図形を一定の方向に一定の距離だけ移動すること | 1 | jp:kaisetsu-chu |
| conventions | probability-and-or-notation | us | en | 8 | the addition rule p a or b p | 1 | openstax-introstats |
| conventions | quadrant-roman-numerals | us | en | 9 | algebra 2 6 6 the pythagorean identity part 2 | 1 | ref:im-9-12 |
| conventions | rounding-place | jp | ja | 25 | 指定された桁数の一つ下の桁を四捨五入して答えなさい | 4 | jp:exams/h30-hon-01, jp:exams/h30-hon-04, jp:exams/r3-dai1-01, jp:exams/r3-dai1-02 |
| conventions | rounding-place | jp | ja | 22 | 小数第2位を四捨五入して小数第1位まで求める | 2 | jp:exams/h29-hon-03, jp:exams/h29-hon-04 |
| conventions | sample-variance-n-minus-1 | us | en | 9 | 2 7 measures of the spread of the data | 1 | openstax-introstats |
| conventions | transformations-define-congruence-and-similarity | jp | ja | 25 | 一方の図形を移動して他方の図形に重ねることができる | 1 | jp:kaisetsu-chu |
| phrases | class-listening-recall-that | en | en | 8 | the derivative of sin x is cos x | 1 | mit-18.01 |
| phrases | class-listening-recall-that | variants[0].en | en | 8 | the derivative of sin x is cos x | 1 | mit-18.01 |
| phrases | class-listening-what-do-you-notice | notes[0] | en | 8 | what do you notice what do you wonder | 3 | ref:im-9-12, ref:im-6-8, ref:levin-dmoi4 |
| phrases | exam-label-your-axes | variants[0].note | en | 9 | label the axes and decide on an appropriate scale | 1 | ref:im-6-8 |
| phrases | exam-set-up-but-do-not-evaluate | en | en | 8 | set up but do not evaluate an integral | 1 | openstax-calculus |
| phrases | exam-set-up-but-do-not-evaluate | variants[0].en | en | 8 | write but do not evaluate an integral expression | 1 | khan-ap-calc |
| phrases | exam-show-your-work | variants[0].en | en | 8 | show the work that leads to your answer | 1 | ref:ap-calculus-ab-bc-ced |
| phrases | exam-use-the-table-to-approximate | variants[0].en | en | 8 | use the data in the table to approximate | 2 | ref:ap-calculus-ab-bc-ced, khan-ap-calc |
| phrases | exam-write-an-equation-for-the-tangent-line | variants[0].en | en | 14 | write an equation for the line tangent to the graph of f at x | 4 | openstax-calculus, khan-ap-calc, ref:ap-calculus-ab-bc-ced, mit-notes |
| phrases | exam-write-an-equation-for-the-tangent-line | en | en | 10 | find the equation of the tangent line at x 2 | 5 | khan-ap-calc, yt:profleonard, yt:patrickjmt, yt:nancypi, yt:organicchem |
| phrases | explaining-solution-derivative-equal-to-zero | variants[0].en | en | 8 | the derivative and set it equal to zero | 1 | micase |
| phrases | multiply-by-the-derivative-of-the-inside | en | en | 8 | then multiply by the derivative of the inside | 2 | yt:profleonard, yt:organicchem |
| phrases | organize-the-data | variants[0].en | en | 8 | the numbers in order from smallest to largest | 1 | openstax-prealgebra |
| phrases | the-area-of-the-region-bounded-by | variants[0].en | en | 9 | find the area of the region enclosed by the | 1 | openstax-calculus |
| phrases | the-area-of-the-region-bounded-by | en | en | 8 | find the area of the region bounded by | 1 | openstax-calculus |
| phrases | write-as-a-limit-of-a-sum | variants[0].en | en | 9 | as the limit as n approaches infinity of a | 1 | khan-ap-calc |
| phrases | written-solution-by-induction | variants[0].en | en | 8 | by the principle of mathematical induction the statement | 1 | ref:levin-dmoi4 |
| symbols | delta-x | notes[1] | en | 9 | the change in y over the change in x | 5 | khan-middle, khan-ap-calc, khan-algebra, openstax-algtrig, yt:profleonard |
| symbols | derivative-leibniz | notes[1] | en | 9 | the derivative of x squared with respect to x | 1 | khan-ap-calc |
| symbols | directional-derivative-notation | notes[0] | en | 10 | the directional derivative of f in the direction of u | 1 | openstax-calculus |
| symbols | floor-brackets | notes[0] | en | 9 | the greatest integer less than or equal to x | 1 | openstax-calculus |
| symbols | gauss-bracket-jp | notes[0] | en | 9 | the greatest integer less than or equal to x | 1 | openstax-calculus |
| symbols | gcd-notation | notes[0] | en | 8 | the greatest common divisor of a and b | 2 | mit-6.042, mit-notes |
| symbols | geq-sign | notes[0] | en | 8 | x is greater than or equal to zero | 5 | khan-ap-calc, yt:profleonard, khan-algebra, yt:organicchem, yt:patrickjmt |
| symbols | integral-definite | notes[1] | en | 8 | the integral from a to b of f | 3 | mit-18.01, khan-ap-calc, yt:patrickjmt |
| symbols | leq-sign | notes[0] | en | 9 | x is less than or equal to five is | 1 | yt:organicchem |
| symbols | limit-from-left | notes[0] | en | 12 | the limit of f x as x approaches a from the left | 4 | khan-ap-calc, openstax-calculus, openstax-precalculus, ref:ap-calculus-ab-bc-ced |
| symbols | limit-from-left | notes[0] | en | 8 | x a x approaches a from the left | 2 | openstax-algtrig, openstax-precalculus |
| symbols | limit-from-right | notes[0] | en | 12 | the limit of f x as x approaches a from the right | 4 | khan-ap-calc, openstax-calculus, openstax-precalculus, ref:ap-calculus-ab-bc-ced |
| symbols | limit-from-right | notes[0] | en | 8 | x a x approaches a from the right | 2 | openstax-algtrig, openstax-precalculus |
| symbols | limit-x-to-a | notes[0] | en | 8 | the limit as x approaches a of f | 2 | khan-ap-calc, yt:organicchem |
| symbols | long-division-bracket | notes[0] | en | 8 | the divisor 3 goes into 18 six times | 1 | openstax-prealgebra |
| symbols | natural-log-ln | notes[1] | en | 9 | the natural log of the absolute value of x | 1 | khan-ap-calc |
| symbols | partial-derivative-leibniz | notes[0] | en | 9 | the partial derivative of f with respect to x | 3 | yt:profleonard, openstax-calculus, mit-18.02 |
| symbols | partial-derivative-leibniz | notes[0] | en | 8 | the partial of f with respect to x | 3 | yt:profleonard, mit-18.03, openstax-calculus |
| symbols | partial-derivative-leibniz | notes[2] | en | 8 | the partial of f with respect to x | 3 | yt:profleonard, mit-18.03, openstax-calculus |
| symbols | probability-of-union | notes[0] | en | 8 | probability of a or b the probability of | 1 | micase |
| symbols | second-derivative-leibniz | notes[0] | en | 9 | the second derivative of y with respect to x | 2 | khan-ap-calc, mit-18.01 |
| symbols | set-builder-braces | notes[0] | en | 11 | the set of all x such that x is greater than | 3 | openstax-algtrig, openstax-precalculus, ref:levin-dmoi4 |
| symbols | square-root | notes[0] | en | 9 | the square root of the quantity x squared plus | 2 | mit-18.01, mit-18.02 |
| symbols | there-exists-quantifier | notes[0] | en | 8 | there exists an x such that there is | 1 | micase |
| terms | aas-congruence | definition_en | en | 14 | if two angles and a non included side of one triangle are congruent to | 2 | ref:im-9-12, ref:ck12-geometry |
| terms | absolute-extrema | examples[1].en | en | 9 | the absolute maximum value and the absolute minimum value | 1 | openstax-calculus |
| terms | acute-triangle | pitfalls[1] | en | 10 | ck 12 geometry 4 2 classify triangles by angle measurement | 1 | ref:ck12-geometry |
| terms | algebraic-multiplicity | definition_en | en | 8 | occurs as a root of the characteristic polynomial | 1 | ref:nicholson-lawa-2021a |
| terms | alternate-exterior-angles | examples[0].en | en | 10 | the parallel lines and on opposite sides of the transversal | 1 | ref:im-6-8 |
| terms | alternate-exterior-angles | definition_en | en | 8 | lines and on opposite sides of the transversal | 1 | ref:im-6-8 |
| terms | alternate-exterior-angles | examples[1].en | en | 8 | two parallel lines are cut by a transversal | 1 | ref:ck12-geometry |
| terms | angle-between-vectors | examples[0].en | en | 12 | use the dot product to find the angle between the two vectors | 3 | openstax-algtrig, openstax-precalculus, openstax-calculus |
| terms | angle-sum-of-a-triangle | pitfalls[0] | en | 8 | the sum of the angles in a triangle | 1 | ref:im-6-8 |
| terms | apothem | pitfalls[2] | en | 11 | ck 12 geometry 5 21 area of regular and irregular polygons | 1 | ref:ck12-geometry |
| terms | area | examples[0].en | en | 12 | the area of a triangle is one half base times height so | 6 | yt:organicchem, khan-middle, openstax-prealgebra, openstax-elemalg, openstax-intalg, ref:ck12-geometry |
| terms | area-between-two-curves | pitfalls[2] | en | 9 | find the area of the region bounded by the | 1 | openstax-calculus |
| terms | area-in-polar-coordinates | examples[1].en | en | 8 | find the area of the region enclosed by | 1 | openstax-calculus |
| terms | area-model | definition_en | en | 11 | area is the sum of the areas of the smaller rectangles | 5 | ref:ck12-geometry, ref:im-6-8, mit-18.01, yt:3blue1brown, openstax-prealgebra |
| terms | area-of-a-regular-polygon | pitfalls[0] | en | 11 | ck 12 geometry 5 21 area of regular and irregular polygons | 1 | ref:ck12-geometry |
| terms | area-of-a-regular-polygon | examples[1].en | en | 8 | use the formula for the area of a | 5 | openstax-calculus, ref:ck12-geometry, openstax-intalg, openstax-elemalg, ref:ck12-algebra |
| terms | area-of-a-triangle-using-vectors | examples[1].en | en | 8 | find the area of the triangle with vertices | 1 | ref:nicholson-lawa-2021a |
| terms | area-preserving-transformation | mapping_note | en | 9 | 1 9 formula for the area of a triangle | 1 | ref:im-6-8 |
| terms | auxiliary-angle-form | examples[0].en | en | 9 | the square root of a squared plus b squared | 3 | yt:organicchem, mit-18.06, mit-18.03 |
| terms | auxiliary-line | examples[1].en | en | 9 | prove that the sum of the interior angles of | 2 | ref:levin-dmoi4, khan-algebra |
| terms | base-of-a-solid | examples[1].en | en | 9 | find the number of faces edges and vertices of | 1 | ref:ck12-geometry |
| terms | base-of-the-natural-logarithm | examples[0].en | en | 8 | e to the x is its own derivative | 1 | yt:3blue1brown |
| terms | basic-variable | examples[1].en | en | 8 | the leading variables in terms of the parameters | 1 | ref:nicholson-lawa-2021a |
| terms | be-circumscribed-about | pitfalls[2] | en | 8 | ck 12 geometry 4 22 concurrence and constructions | 1 | ref:ck12-geometry |
| terms | be-circumscribed-about | pitfalls[3] | en | 8 | ck 12 geometry 6 2 identify circle components | 1 | ref:ck12-geometry |
| terms | biconditional | definition_en | en | 8 | p and q have the same truth value | 1 | ref:levin-dmoi4 |
| terms | bisect | examples[0].en | en | 9 | the diagonals of a parallelogram bisect each other so | 3 | ref:im-9-12, mit-18.02, ref:nicholson-lawa-2021a |
| terms | both-sides | definition_en | en | 9 | the left hand side and the right hand side | 5 | khan-ap-calc, mit-18.01, khan-algebra, yt:3blue1brown, khan-middle |
| terms | cartesian-product | definition_en | en | 8 | of all ordered pairs a b with a | 1 | ref:levin-dmoi4 |
| terms | cavalieris-principle | definition_en | en | 8 | then the two solids have the same volume | 1 | ref:im-9-12 |
| terms | centroid | examples[1].en | en | 9 | find the coordinates of the centroid of the triangle | 1 | ref:ck12-geometry |
| terms | chain-rule | examples[0].en | en | 8 | then multiply by the derivative of the inside | 2 | yt:profleonard, yt:organicchem |
| terms | change-of-base-formula | definition_ja | en | 8 | log a b log c b log c | 1 | openstax-algtrig |
| terms | change-of-base-formula | definition_en | en | 8 | log a b log c b log c | 1 | openstax-algtrig |
| terms | checking-whether-the-solution-makes-sense | examples[2].en | en | 8 | the side length of a square with area | 2 | ref:im-6-8, ref:im-9-12 |
| terms | circle | examples[1].en | en | 9 | find the area of a circle with a radius | 2 | ref:ck12-geometry, khan-middle |
| terms | circumscribed-circle | pitfalls[2] | en | 8 | ck 12 geometry 4 22 concurrence and constructions | 1 | ref:ck12-geometry |
| terms | clear-the-denominators | definition_en | en | 10 | multiply both sides of an equation by the lcd of | 5 | openstax-prealgebra, openstax-elemalg, openstax-intalg, ref:im-9-12, ref:ck12-algebra |
| terms | clear-the-denominators | examples[2].en | en | 8 | multiply both sides by 10 to clear the | 1 | openstax-prealgebra |
| terms | complementary-event | examples[0].en | en | 8 | the probability of the complement of the event | 1 | ref:levin-dmoi4 |
| terms | complex-conjugate | examples[1].en | en | 8 | is a real number if and only if | 1 | openstax-calculus |
| terms | complex-number | examples[0].en | en | 8 | multiply the top and bottom by the conjugate | 1 | yt:blackpenredpen |
| terms | composite-figure | mapping_note | en | 8 | 5 18 area and perimeter of composite shapes | 1 | ref:ck12-geometry |
| terms | composite-figure | pitfalls[0] | en | 8 | 5 18 area and perimeter of composite shapes | 1 | ref:ck12-geometry |
| terms | compress-horizontally | pitfalls[2] | en | 8 | horizontally compressed by a factor of 1 4 | 2 | openstax-algtrig, openstax-precalculus |
| terms | compute | examples[2].en | en | 8 | the area of a circle with a radius | 1 | khan-middle |
| terms | concurrent | mapping_note | en | 8 | ck 12 geometry 4 22 concurrence and constructions | 1 | ref:ck12-geometry |
| terms | condition | pitfalls[0] | ja | 22 | 実数xに関する次の条件p,q,r,sを考える | 2 | jp:exams/h30-hon-02, jp:exams/h30-hon-03 |
| terms | conditional-statement | examples[0].en | en | 9 | the hypothesis is true and the conclusion is false | 1 | ref:levin-dmoi4 |
| terms | conditional-statement | mapping_note | en | 8 | ck 12 geometry 2 11 if then statements | 1 | ref:ck12-geometry |
| terms | congruence-criteria | mapping_note | en | 8 | geometry 2 6 side angle side triangle congruence | 1 | ref:im-9-12 |
| terms | congruent-arcs | pitfalls[0] | en | 8 | ck 12 geometry 6 9 arcs in circles | 1 | ref:ck12-geometry |
| terms | connected | definition_en | en | 9 | there is a path between every pair of vertices | 2 | mit-notes, ref:levin-dmoi4 |
| terms | contingency-table | examples[1].en | en | 9 | find the probability that a randomly chosen student is | 1 | openstax-introstats |
| terms | continuous | examples[0].en | en | 8 | you can draw it without lifting your pencil | 1 | yt:profleonard |
| terms | converse | examples[1].en | en | 9 | if two angles are vertical angles then they are | 1 | ref:ck12-geometry |
| terms | converse-of-the-inscribed-angle-theorem | mapping_note | en | 9 | ck 12 geometry 6 14 inscribed angles in circles | 1 | ref:ck12-geometry |
| terms | converse-of-the-pythagorean-theorem | pitfalls[1] | en | 10 | ck 12 geometry 4 29 pythagorean theorem to classify triangles | 1 | ref:ck12-geometry |
| terms | converse-of-the-pythagorean-theorem | pitfalls[1] | en | 10 | 4 36 distance and triangle classification using the pythagorean theorem | 1 | ref:ck12-geometry |
| terms | coordinate-proof | examples[1].en | en | 9 | that the diagonals of a parallelogram bisect each other | 3 | ref:im-9-12, mit-18.02, ref:nicholson-lawa-2021a |
| terms | coordinate-vector | definition_en | en | 10 | a vector as a linear combination of the basis vectors | 1 | ref:nicholson-lawa-2021a |
| terms | cosecant | examples[1].en | en | 15 | in right triangle abc angle c is a right angle ab 13 and bc 5 | 1 | ref:im-9-12 |
| terms | cross-method | examples[0].en | en | 8 | numbers that multiply to 6 and add to | 1 | openstax-elemalg |
| terms | cross-section | examples[1].en | en | 9 | perpendicular to the x axis is a square find | 1 | khan-ap-calc |
| terms | cryptography | pitfalls[2] | en | 10 | 8 8 an application to linear codes over finite fields | 1 | ref:nicholson-lawa-2021a |
| terms | cubic-units | pitfalls[2] | en | 8 | geometry 5 7 the root of the problem | 1 | ref:im-9-12 |
| terms | curve-sketching | pitfalls[0] | en | 10 | connecting a function its first derivative and its second derivative | 1 | ref:ap-calculus-ab-bc-ced |
| terms | cyclic-quadrilateral | pitfalls[2] | en | 9 | ck 12 geometry 6 15 inscribed quadrilaterals in circles | 1 | ref:ck12-geometry |
| terms | cycloid | examples[1].en | en | 14 | find the length of one arch of the cycloid x sin y 1 cos | 1 | openstax-calculus |
| terms | cycloid | definition_en | en | 11 | the curve traced by a point on the rim of a | 1 | openstax-calculus |
| terms | decomposition-of-a-vector | examples[1].en | en | 8 | as a linear combination of a and b | 1 | mit-notes |
| terms | derivative-at-a-point | examples[1].en | en | 8 | the slope of the tangent line there the | 1 | khan-ap-calc |
| terms | derivative-at-a-point | collocations[1].en | en | 8 | the slope of the tangent line at x | 1 | khan-ap-calc |
| terms | derivative-of-a-vector-function | examples[1].en | en | 9 | the derivative of the vector valued function r t | 1 | openstax-calculus |
| terms | derivatives-in-polar-form | examples[1].en | en | 8 | find the slope of the tangent line to | 4 | openstax-calculus, khan-ap-calc, yt:profleonard, yt:blackpenredpen |
| terms | derivatives-of-inverse-trig-functions | examples[0].en | en | 8 | x is one over one plus x squared | 1 | khan-ap-calc |
| terms | derivatives-of-trigonometric-functions | definition_ja | en | 8 | sin x cos x cos x sin x | 4 | openstax-calculus, mit-notes, openstax-algtrig, openstax-precalculus |
| terms | derivatives-of-trigonometric-functions | examples[0].en | en | 8 | but the derivative of cosine is negative sine | 1 | yt:nancypi |
| terms | descartes-rule-of-signs | examples[1].en | en | 16 | use descartes rule of signs to determine the possible numbers of positive and negative real zeros | 2 | openstax-algtrig, openstax-precalculus |
| terms | diagonalization | definition_en | en | 8 | finding an invertible matrix p such that p | 1 | ref:nicholson-lawa-2021a |
| terms | diameter | examples[0].en | en | 9 | all the way across the circle through the center | 1 | khan-middle |
| terms | die | examples[1].en | en | 9 | find the probability of rolling a number greater than | 3 | openstax-algtrig, openstax-precalculus, khan-middle |
| terms | difference-of-squares | mapping_note | en | 8 | a product of a sum and a difference | 1 | ref:im-9-12 |
| terms | dilation | mapping_note | ja | 20 | 一つの図形を操作して新たな図形を作ること | 1 | jp:kaisetsu-chu |
| terms | dilation | pitfalls[2] | en | 10 | ck 12 geometry 7 16 dilation in the coordinate plane | 1 | ref:ck12-geometry |
| terms | directed-segment | definition_en | en | 8 | from its initial point to its terminal point | 1 | openstax-calculus |
| terms | direction-angle | examples[0].en | en | 8 | is measured counterclockwise from the positive x axis | 1 | ref:nicholson-lawa-2021a |
| terms | distance-formula | examples[1].en | en | 11 | use the distance formula to find the distance between the points | 3 | openstax-intalg, openstax-algtrig, openstax-precalculus |
| terms | distance-formula | examples[0].en | en | 8 | and the square root of 25 is 5 | 1 | yt:organicchem |
| terms | divergence-theorem | examples[1].en | en | 10 | use the divergence theorem to find the outward flux of | 1 | openstax-calculus |
| terms | divergence-theorem | definition_en | en | 9 | the triple integral of the divergence over the solid | 1 | mit-18.02 |
| terms | double-integral | definition_en | en | 9 | of a function of two variables over a region | 1 | openstax-calculus |
| terms | draw-a-graph | examples[0].en | en | 8 | points and connect them with a straight line | 1 | openstax-prealgebra |
| terms | elementary-event | examples[1].en | en | 9 | list all the outcomes in the sample space for | 1 | ref:im-9-12 |
| terms | empirical-rule | examples[1].en | en | 12 | approximately normal with a mean of 70 and a standard deviation of | 2 | ref:im-9-12, openstax-introstats |
| terms | empirical-rule | definition_en | en | 10 | fall within one standard deviation of the mean about 95 | 2 | yt:3blue1brown, openstax-introstats |
| terms | end-behavior | definition_en | en | 10 | as x goes to positive infinity and to negative infinity | 1 | yt:nancypi |
| terms | entry | examples[1].en | en | 9 | the entry in row 1 column 2 of the | 2 | openstax-algtrig, openstax-precalculus |
| terms | equal-angles | examples[1].en | en | 8 | the base angles of an isosceles triangle are | 2 | ref:im-9-12, ref:ck12-geometry |
| terms | equal-vectors | definition_en | en | 9 | they have the same magnitude and the same direction | 3 | openstax-algtrig, openstax-precalculus, openstax-calculus |
| terms | equation-of-a-line | examples[1].en | en | 8 | find the equation of the line passing through | 1 | openstax-algtrig |
| terms | equation-of-a-sphere | definition_en | en | 10 | the sphere with center a b c and radius r | 2 | openstax-calculus, ref:im-9-12 |
| terms | exist | examples[1].en | en | 8 | there exists a real number x such that | 3 | openstax-calculus, openstax-algtrig, openstax-precalculus |
| terms | exponent | pitfalls[0] | en | 8 | x to the fifth x to the fifth | 1 | khan-ap-calc |
| terms | exterior-angle-theorem | definition_en | en | 9 | the two interior angles that are not adjacent to | 1 | ref:ck12-geometry |
| terms | factorial | examples[0].en | en | 9 | 5 times 4 times 3 times 2 times 1 | 1 | yt:nancypi |
| terms | fail-to-reject | examples[1].en | en | 10 | there is not sufficient evidence to conclude that the mean | 1 | openstax-introstats |
| terms | find-the-equation-of-the-tangent-line | pitfalls[0] | en | 8 | equation of the tangent line the equation of | 1 | khan-ap-calc |
| terms | find-the-nth-term | examples[1].en | en | 8 | formula for the nth term of the sequence | 1 | ref:levin-dmoi4 |
| terms | floor-function | definition_ja | en | 9 | the greatest integer less than or equal to x | 1 | openstax-calculus |
| terms | floor-function | pitfalls[1] | en | 9 | the greatest integer less than or equal to x | 1 | openstax-calculus |
| terms | foil | definition_en | en | 8 | to multiply two binomials multiply the first terms | 1 | openstax-elemalg |
| terms | foot-of-the-perpendicular | examples[1].en | en | 8 | point p 1 2 3 to the plane | 1 | openstax-calculus |
| terms | function | examples[1].en | en | 8 | an equation for y in terms of x | 2 | mit-18.01, yt:nancypi |
| terms | general-form-of-a-circle | examples[1].en | en | 8 | find the center and radius of the circle | 1 | ref:im-9-12 |
| terms | general-term | pitfalls[1] | en | 9 | the r 1 th term of the binomial expansion | 2 | openstax-algtrig, openstax-precalculus |
| terms | generating-function | examples[1].en | en | 11 | find the generating function for the sequence 1 2 4 8 | 1 | ref:levin-dmoi4 |
| terms | geometric-mean | pitfalls[0] | en | 9 | geometry 3 13 using the pythagorean theorem and similarity | 1 | ref:im-9-12 |
| terms | geometric-mean | examples[0].en | en | 8 | the square root of 16 which is 4 | 3 | yt:organicchem, khan-ap-stats, khan-middle |
| terms | graph-coloring | definition_en | en | 8 | different colors the smallest number of colors needed | 1 | ref:levin-dmoi4 |
| terms | greater-than | examples[0].en | en | 8 | farther to the right on the number line | 1 | ref:ck12-algebra |
| terms | greatest-common-divisor | examples[0].en | en | 8 | is the biggest number that goes into both | 1 | khan-middle |
| terms | hl-congruence | definition_en | en | 8 | right triangle are congruent to the hypotenuse and | 1 | ref:ck12-geometry |
| terms | horizontal-asymptote | definition_en | en | 8 | the degrees of the numerator and the denominator | 3 | openstax-algtrig, openstax-precalculus, yt:nancypi |
| terms | horizontal-line-test | definition_en | en | 10 | one to one if no horizontal line crosses the graph | 2 | openstax-algtrig, openstax-precalculus |
| terms | hyperbolic-functions | examples[0].en | en | 10 | e to the x and e to the negative x | 1 | mit-18.03 |
| terms | hypotenuse | examples[1].en | en | 8 | the legs of a right triangle are 6 | 1 | ref:ck12-geometry |
| terms | identity | pitfalls[1] | en | 8 | algebra 2 2 23 polynomial identities part 1 | 1 | ref:im-9-12 |
| terms | image | pitfalls[2] | en | 9 | 7 2 kernel and image of a linear transformation | 1 | ref:nicholson-lawa-2021a |
| terms | imaginary-part | pitfalls[0] | en | 8 | algebra 2 3 12 arithmetic with complex numbers | 1 | ref:im-9-12 |
| terms | imaginary-solution | mapping_note | en | 8 | find all complex solutions real and non real | 2 | openstax-algtrig, openstax-precalculus |
| terms | inequality | pitfalls[0] | en | 20 | less than or equal to greater than or equal to less than or equal to greater than or equal to | 3 | khan-middle, openstax-introstats, khan-ap-calc |
| terms | inequality | examples[1].en | en | 8 | and graph the solution on a number line | 1 | ref:im-6-8 |
| terms | inequality-sign | pitfalls[2] | en | 9 | less than b a b a is greater than | 3 | openstax-prealgebra, openstax-elemalg, openstax-intalg |
| terms | initial-point | examples[0].en | en | 9 | put the tail of the second vector at the | 1 | khan-ap-calc |
| terms | inscribed-circle | pitfalls[2] | en | 8 | ck 12 geometry 4 22 concurrence and constructions | 1 | ref:ck12-geometry |
| terms | instantaneous-rate-of-change | examples[0].en | en | 8 | is the slope of the tangent line there | 1 | khan-ap-calc |
| terms | integer-part | mapping_note | en | 9 | the greatest integer less than or equal to x | 1 | openstax-calculus |
| terms | integrate-by-parts | examples[1].en | en | 8 | integration by parts with u ln x and | 1 | openstax-calculus |
| terms | intercepted-arc | mapping_note | en | 8 | 6 16 angles on and inside a circle | 1 | ref:ck12-geometry |
| terms | interquartile-range | examples[0].en | en | 8 | spread out the middle half of the data | 1 | ref:im-6-8 |
| terms | isosceles-triangle-theorem | definition_en | en | 8 | base angles of an isosceles triangle are congruent | 2 | ref:im-9-12, ref:ck12-geometry |
| terms | joint-variation | definition_en | en | 9 | a relationship in which one quantity is a constant | 2 | openstax-algtrig, openstax-precalculus |
| terms | lateral-area | examples[1].en | en | 9 | a radius of 3 cm and a height of | 1 | ref:im-6-8 |
| terms | law-of-detachment | definition_en | en | 11 | q is true and p is true then q is true | 1 | ref:ck12-geometry |
| terms | laws-of-exponents | examples[0].en | en | 10 | x squared times x cubed is x to the fifth | 1 | yt:organicchem |
| terms | left-hand-limit | definition_en | en | 8 | the limit of f x as x approaches | 4 | khan-ap-calc, openstax-calculus, openstax-precalculus, ref:ap-calculus-ab-bc-ced |
| terms | less-than | pitfalls[1] | en | 10 | less than or equal to less than or equal to | 2 | khan-ap-calc, openstax-introstats |
| terms | let-u-equal | examples[3].en | en | 8 | the sum of the two numbers is 31 | 1 | openstax-algtrig |
| terms | limit-at-infinity | mapping_note | ja | 23 | xの値を限りなく大きくしたときのf(x)の極限 | 1 | jp:kaisetsu-kou |
| terms | limit-of-sine-x-over-x | definition_en | en | 9 | the limit of sin x x as x approaches | 1 | yt:nancypi |
| terms | limit-of-sine-x-over-x | mapping_note | en | 8 | the limit as x approaches 0 of sine | 2 | khan-ap-calc, yt:profleonard |
| terms | linear-inequality | pitfalls[0] | en | 10 | less than or equal to greater than or equal to | 1 | khan-middle |
| terms | linear-pair | examples[0].en | en | 8 | so they have to add up to 180 | 1 | yt:organicchem |
| terms | linearity-of-expectation | definition_en | en | 10 | that the expected value of a sum of random variables | 2 | mit-notes, mit-6.042 |
| terms | linearly-dependent | definition_en | en | 9 | can be written as a linear combination of the | 3 | mit-notes, ref:nicholson-lawa-2021a, openstax-calculus |
| terms | logical-connective | pitfalls[2] | en | 9 | ck 12 geometry 2 9 and and or statements | 1 | ref:ck12-geometry |
| terms | major-arc | pitfalls[2] | en | 8 | ck 12 geometry 6 9 arcs in circles | 1 | ref:ck12-geometry |
| terms | mean-absolute-deviation | definition_en | en | 8 | distance between each data value and the mean | 2 | ref:im-6-8, ref:im-9-12 |
| terms | midline | definition_en | en | 9 | halfway between the maximum and minimum values of a | 2 | ref:im-9-12, ref:im-6-8 |
| terms | midpoint-formula | examples[1].en | en | 10 | use the midpoint formula to find the midpoint of the | 1 | openstax-intalg |
| terms | midsegment-theorem | definition_en | en | 9 | connecting the midpoints of two sides of a triangle | 2 | ref:ck12-geometry, ref:nicholson-lawa-2021a |
| terms | minor | examples[1].en | en | 8 | by minors along the first row to evaluate | 3 | openstax-intalg, openstax-algtrig, openstax-precalculus |
| terms | minor-arc | pitfalls[2] | en | 8 | ck 12 geometry 6 9 arcs in circles | 1 | ref:ck12-geometry |
| terms | modulus-of-a-complex-number | examples[1].en | en | 9 | find the absolute value of the complex number 5 | 2 | openstax-algtrig, openstax-precalculus |
| terms | natural-number | mapping_note | en | 9 | counting numbers 1 2 3 whole numbers 0 1 | 2 | openstax-elemalg, openstax-intalg |
| terms | net | examples[1].en | en | 9 | of a square with a side length of 4 | 2 | ref:ck12-geometry, ref:im-6-8 |
| terms | number-of-possible-outcomes | examples[1].en | en | 9 | find the probability that the sum of the numbers | 3 | openstax-introstats, openstax-algtrig, openstax-precalculus |
| terms | number-of-real-solutions | examples[2].en | en | 8 | have two real solutions one real solution or | 1 | yt:patrickjmt |
| terms | one-sample-t-test | definition_en | en | 9 | population mean when the population standard deviation is unknown | 2 | openstax-introstats, ref:ap-statistics-ced |
| terms | one-sample-t-test | pitfalls[0] | en | 9 | a single population mean using the student t distribution | 1 | openstax-introstats |
| terms | one-sixth-formula | mapping_note | en | 13 | topic 8 4 finding the area between curves expressed as functions of x | 1 | ref:ap-calculus-ab-bc-ced |
| terms | p-value | definition_en | en | 8 | the probability assuming the null hypothesis is true | 1 | khan-ap-stats |
| terms | paragraph-proof | examples[1].en | en | 10 | that the base angles of an isosceles triangle are congruent | 2 | ref:im-9-12, ref:ck12-geometry |
| terms | parallel-lines | examples[0].en | en | 10 | parallel lines have the same slope but different y intercepts | 5 | openstax-elemalg, openstax-algtrig, openstax-precalculus, khan-middle, ref:im-9-12 |
| terms | partial-derivative | examples[1].en | en | 8 | the partial derivatives f x and f y | 1 | openstax-calculus |
| terms | partial-order | definition_en | en | 8 | a relation that is reflexive antisymmetric and transitive | 1 | ref:levin-dmoi4 |
| terms | pass-through | examples[1].en | en | 14 | find the equation of the line that passes through the origin and the point | 4 | openstax-algtrig, openstax-precalculus, ref:im-9-12, yt:3blue1brown |
| terms | percent-change | definition_en | en | 8 | as a percent of the original amount the | 1 | openstax-prealgebra |
| terms | perfect-square-trinomial | pitfalls[0] | en | 8 | algebra 1 7 11 what are perfect squares | 1 | ref:im-9-12 |
| terms | piecewise-function | definition_en | en | 10 | defined by different formulas on different parts of its domain | 1 | openstax-calculus |
| terms | planar-graph | definition_en | en | 9 | a graph that can be drawn in the plane | 1 | mit-notes |
| terms | point-of-internal-division | mapping_note | en | 12 | ck 12 geometry 1 6 points that partition line segments section formula | 1 | ref:ck12-geometry |
| terms | point-of-intersection | examples[0].en | en | 8 | set the two equations equal to each other | 1 | micase |
| terms | point-slope-form | definition_en | en | 8 | the equation of the line with slope m | 1 | openstax-algtrig |
| terms | poisson-distribution | definition_en | en | 8 | in a fixed interval of time or space | 1 | openstax-introstats |
| terms | polygon | examples[1].en | en | 10 | find the sum of the interior angles of a polygon | 4 | ref:ck12-geometry, ref:levin-dmoi4, khan-algebra, openstax-prealgebra |
| terms | population-proportion | examples[1].en | en | 10 | construct a 95 confidence interval for the population proportion of | 2 | openstax-introstats, yt:profleonard |
| terms | population-standard-deviation | examples[1].en | en | 8 | construct a 95 confidence interval for the mean | 2 | openstax-introstats, ref:ap-statistics-ced |
| terms | positive-number | definition_en | en | 9 | to the right of 0 on the number line | 3 | openstax-algtrig, khan-middle, ref:im-6-8 |
| terms | postulate | definition_en | en | 9 | a statement that is accepted as true without proof | 1 | ref:ck12-geometry |
| terms | power-series | examples[1].en | en | 10 | find a power series representation for f x 1 1 | 1 | openstax-calculus |
| terms | preimage | examples[1].en | en | 8 | the y axis find the coordinates of the | 1 | ref:ck12-geometry |
| terms | properties-of-inequalities | pitfalls[3] | en | 9 | property of inequality multiplication and division property of inequality | 1 | openstax-intalg |
| terms | properties-of-inequalities | pitfalls[3] | en | 8 | subtraction property of inequality addition property of inequality | 1 | openstax-elemalg |
| terms | properties-of-logarithms | definition_ja | en | 8 | log a m log a n log a | 3 | openstax-intalg, openstax-algtrig, openstax-precalculus |
| terms | proposition | examples[1].en | en | 9 | determine whether the following statement is true or false | 3 | openstax-algtrig, openstax-precalculus, ref:ck12-geometry |
| terms | proving-an-identity | pitfalls[1] | en | 9 | identities sum to product and product to sum formulas | 2 | openstax-algtrig, openstax-precalculus |
| terms | pythagorean-theorem | examples[1].en | en | 12 | 12 use the pythagorean theorem to find the length of the hypotenuse | 8 | openstax-elemalg, openstax-prealgebra, openstax-intalg, ref:ck12-geometry, openstax-algtrig, openstax-precalculus ほか |
| terms | quotient | pitfalls[0] | en | 11 | divided by b the quotient of a and b a b | 3 | openstax-prealgebra, openstax-intalg, openstax-elemalg |
| terms | radius | examples[0].en | en | 8 | the diameter so if the diameter is 10 | 1 | yt:organicchem |
| terms | rank | examples[1].en | en | 9 | the rank of the matrix and the dimension of | 1 | mit-18.06 |
| terms | ratio-of-areas-of-similar-figures | mapping_note | en | 8 | 5 22 area and perimeter of similar polygons | 1 | ref:ck12-geometry |
| terms | rationalizing-the-denominator | pitfalls[2] | ja | 27 | 分母が二項程度までの分数の形に表された数の分母の有理化 | 1 | jp:kaisetsu-kou |
| terms | reduced-row-echelon-form | definition_en | en | 8 | is the only nonzero entry in its column | 1 | ref:nicholson-lawa-2021a |
| terms | relation | definition_en | en | 10 | a relation from a set a to a set b | 2 | mit-notes, mit-6.042 |
| terms | relative-positions-of-two-circles | mapping_note | en | 8 | ck 12 geometry 6 2 identify circle components | 1 | ref:ck12-geometry |
| terms | relative-positions-of-two-lines | mapping_note | en | 9 | ck 12 geometry 3 2 parallel and skew lines | 1 | ref:ck12-geometry |
| terms | restricted-domain | examples[1].en | en | 8 | find the inverse of f x x 2 | 2 | openstax-algtrig, openstax-precalculus |
| terms | revolve-around-the-x-axis | examples[1].en | en | 9 | the x axis find the volume of the solid | 1 | openstax-calculus |
| terms | revolve-around-the-x-axis | examples[0].en | en | 8 | take this region and rotate it around the | 1 | khan-ap-calc |
| terms | right-hand-limit | definition_en | en | 8 | the limit of f x as x approaches | 4 | khan-ap-calc, openstax-calculus, openstax-precalculus, ref:ap-calculus-ab-bc-ced |
| terms | rise-over-run | examples[1].en | en | 15 | use rise over run to find the slope of the line through the points 1 | 5 | openstax-elemalg, openstax-prealgebra, openstax-intalg, ref:ck12-geometry, openstax-calculus |
| terms | ruler-postulate | definition_en | en | 13 | that the distance between two points is the absolute value of the difference | 1 | ref:ck12-geometry |
| terms | ruler-postulate | examples[1].en | en | 8 | points a and b on a number line | 1 | openstax-calculus |
| terms | saddle-point | definition_en | en | 9 | is neither a local maximum nor a local minimum | 1 | openstax-calculus |
| terms | sample-mean | examples[1].en | en | 8 | a 95 confidence interval for the population mean | 1 | openstax-introstats |
| terms | sampling-distribution-of-the-mean | en.variants[0].note | en | 9 | 7 1 the central limit theorem for sample means | 1 | openstax-introstats |
| terms | scalar-triple-product | examples[1].en | en | 16 | the triple scalar product to find the volume of the parallelepiped determined by u v and | 2 | openstax-calculus, ref:nicholson-lawa-2021a |
| terms | scientific-notation | definition_en | en | 9 | way to write very large or very small numbers | 1 | ref:im-6-8 |
| terms | semicircle | pitfalls[3] | en | 8 | ck 12 geometry 6 9 arcs in circles | 1 | ref:ck12-geometry |
| terms | set | examples[0].en | en | 11 | the domain is the set of all real numbers except 2 | 4 | openstax-calculus, openstax-intalg, openstax-algtrig, openstax-precalculus |
| terms | set-builder-notation | definition_en | en | 12 | the set of all x such that x is greater than 2 | 3 | openstax-algtrig, openstax-precalculus, ref:levin-dmoi4 |
| terms | set-builder-notation | examples[0].en | en | 9 | all x such that x is greater than 2 | 1 | ref:levin-dmoi4 |
| terms | shortest-path | examples[1].en | en | 9 | the number of lattice paths from 0 0 to | 1 | ref:levin-dmoi4 |
| terms | shortest-path | pitfalls[0] | en | 8 | how many lattice paths from 0 0 to | 1 | ref:levin-dmoi4 |
| terms | side | examples[1].en | en | 9 | the side length of a square whose area is | 1 | ref:im-6-8 |
| terms | side-angle-inequality | mapping_note | en | 11 | ck 12 geometry 4 25 comparing angles and sides in triangles | 1 | ref:ck12-geometry |
| terms | side-angle-inequality | mapping_note | en | 9 | the angle opposite the longer side will be larger | 1 | ref:ck12-geometry |
| terms | side-angle-inequality | mapping_note | en | 8 | the largest angle is opposite the longest side | 1 | ref:ck12-geometry |
| terms | similarity-criteria | mapping_note | ja | 20 | 2組の辺の比とその間の角がそれぞれ等しい | 2 | jp:kaisetsu-chu, jp:wikipedia |
| terms | simplify-radicals | pitfalls[3] | ja | 24 | 根号の中に現れる自然数が最小となる形で答えなさい | 2 | jp:exams/h30-hon-01, jp:exams/h30-hon-04 |
| terms | slant-asymptote | definition_en | en | 15 | the degree of the numerator is exactly one more than the degree of the denominator | 2 | yt:patrickjmt, openstax-calculus |
| terms | slope-formula | examples[1].en | en | 13 | use the slope formula to find the slope of the line passing through | 5 | openstax-elemalg, openstax-prealgebra, openstax-intalg, openstax-algtrig, openstax-calculus |
| terms | slope-intercept-form-of-a-line | definition_en | en | 11 | where m is the slope and b is the y intercept | 5 | khan-ap-calc, khan-middle, khan-algebra, ref:ck12-geometry, yt:organicchem |
| terms | sohcahtoa | examples[1].en | en | 8 | the opposite side the adjacent side and the | 1 | yt:organicchem |
| terms | solution-set | pitfalls[1] | en | 8 | the set of all x such that x | 3 | openstax-algtrig, openstax-precalculus, ref:levin-dmoi4 |
| terms | solving-by-graphing | definition_en | en | 8 | of solving a system of equations by graphing | 1 | openstax-intalg |
| terms | solving-by-taking-square-roots | definition_en | en | 8 | by taking the square root of each side | 1 | ref:ck12-geometry |
| terms | spanning-tree | examples[1].en | en | 8 | find two different spanning trees of the graph | 1 | ref:levin-dmoi4 |
| terms | special-products | mapping_note | en | 8 | product of conjugates pattern a b a b | 1 | openstax-elemalg |
| terms | spherical-coordinates | examples[1].en | en | 13 | use spherical coordinates to find the volume of the solid inside the sphere | 1 | openstax-calculus |
| terms | square-matrix | definition_en | en | 8 | a matrix with the same number of rows | 1 | openstax-intalg |
| terms | square-units | examples[1].en | en | 8 | 4 so the area of the rectangle is | 1 | ref:im-6-8 |
| terms | square-units | examples[2].en | en | 8 | find the area of the triangle with vertices | 1 | ref:nicholson-lawa-2021a |
| terms | standard-form-of-a-line | definition_en | en | 9 | on the left and the constant on the right | 2 | openstax-prealgebra, openstax-elemalg |
| terms | standard-normal-table | mapping_note | en | 8 | area to the left of the z score | 1 | openstax-introstats |
| terms | straight-angle | definition_en | en | 9 | point in opposite directions and form a straight line | 1 | ref:im-6-8 |
| terms | subtended-by | mapping_note | en | 9 | ck 12 geometry 6 14 inscribed angles in circles | 1 | ref:ck12-geometry |
| terms | sum-of-a-geometric-sequence | mapping_note | en | 13 | geometric series the sum of the first n terms of a geometric series | 8 | openstax-algtrig, openstax-precalculus, openstax-intalg, ref:levin-dmoi4, khan-ap-calc, openstax-calculus ほか |
| terms | summation-notation | pitfalls[1] | en | 8 | the sum from i equals one to n | 1 | khan-ap-calc |
| terms | surface-integral | examples[1].en | en | 10 | the plane x y z 1 in the first octant | 1 | openstax-calculus |
| terms | symmetric | examples[0].en | en | 12 | the graph of an even function is symmetric about the y axis | 3 | openstax-algtrig, openstax-precalculus, openstax-calculus |
| terms | system-of-linear-inequalities | definition_en | en | 9 | is the set of all points x y that | 3 | openstax-algtrig, openstax-precalculus, yt:3blue1brown |
| terms | system-of-three-equations | examples[1].en | en | 13 | solve the system of three equations in three variables x y z 2 | 2 | openstax-algtrig, openstax-precalculus |
| terms | take-the-limit | examples[1].en | en | 8 | taking the limit of both sides as n | 1 | openstax-calculus |
| terms | tangent-chord-theorem | mapping_note | en | 8 | 6 16 angles on and inside a circle | 1 | ref:ck12-geometry |
| terms | tangent-segments-are-equal | mapping_note | en | 21 | two tangents theorem if two tangent segments are drawn to one circle from the same external point then they are congruent | 1 | ref:ck12-geometry |
| terms | tessellation | pitfalls[2] | en | 8 | grade 8 9 1 tessellations of the plane | 1 | ref:im-6-8 |
| terms | the-limit-does-not-exist | examples[1].en | en | 8 | lim x 0 x x does not exist | 1 | openstax-calculus |
| terms | theorem | examples[1].en | en | 8 | the base angles of an isosceles triangle are | 2 | ref:im-9-12, ref:ck12-geometry |
| terms | three-perpendiculars-theorem | examples[1].en | en | 8 | the foot of the perpendicular from p to | 1 | ref:nicholson-lawa-2021a |
| terms | trigonometric-function | examples[1].en | en | 8 | find the maximum and minimum values of the | 2 | openstax-calculus, ref:im-9-12 |
| terms | trigonometric-integrals | definition_ja | en | 11 | sin x dx cos x c cos x dx sin x | 1 | mit-notes |
| terms | trigonometric-ratio | mapping_note | en | 9 | algebra 2 6 6 the pythagorean identity part 2 | 1 | ref:im-9-12 |
| terms | trinomial | examples[0].en | en | 9 | numbers that multiply to 6 and add to 5 | 2 | openstax-elemalg, yt:nancypi |
| terms | truth-value | examples[1].en | en | 8 | determine whether each statement is true or false | 1 | ref:ck12-geometry |
| terms | truth-value | pitfalls[0] | en | 8 | determine whether the statement is true or false | 3 | openstax-calculus, ref:ck12-geometry, openstax-algtrig |
| terms | turning-points | definition_en | en | 9 | from increasing to decreasing or from decreasing to increasing | 2 | khan-ap-calc, yt:profleonard |
| terms | union-of-events | examples[1].en | en | 8 | a card is drawn from a standard deck | 2 | openstax-algtrig, openstax-precalculus |
| terms | union-of-events | pitfalls[0] | en | 8 | a union b the probability of the union | 1 | ref:ap-statistics-ced |
| terms | unit-normal-vector | examples[1].en | en | 8 | unit normal vector n t for r t | 1 | openstax-calculus |
| terms | unit-tangent-vector | examples[1].en | en | 11 | find the unit tangent vector t t for r t 3 | 1 | openstax-calculus |
| terms | variable-of-integration | examples[1].en | en | 8 | x does not change the value of the | 1 | openstax-algtrig |
| terms | variance | pitfalls[0] | ja | 28 | 平均値との差に基づいてデータの散らばりの度合いを表す指標 | 1 | jp:kaisetsu-kou |
| terms | volume-by-cross-sections | examples[0].en | en | 9 | cross sections perpendicular to the x axis are squares | 1 | khan-ap-calc |
| terms | volume-by-cross-sections | pitfalls[0] | en | 9 | cross sections perpendicular to the x axis are squares | 1 | khan-ap-calc |
| terms | x-intercept | examples[0].en | en | 9 | set y equal to zero and solve for x | 1 | openstax-algtrig |
