# 書き写しの検出（Phase 5 の監査の前の機械の確かめ 1）

作成: 2026-09-26 ／ `pnpm audit:copy`（scripts/audit/copy-check.ts）

規則: 英語は連続 8 語以上、日本語は空白を除いて 20 文字以上、エントリの本文（定義・例文・pitfalls・mapping_note・variants の note・コロケーション、記号の notes・日本語の読み、フレーズの en・ja・意図・variants・notes、慣習差の題・jp・us・advice_ja）が
用例コーパス（manifest の全ファイル: MIT OCW・Khan Academy・YouTube・MICASE・OpenStax・MIT の講義ノート）と参照（CED 2 つ・Nicholson・Levin・IM 2 つ・CK-12 2 つ）、
日本側の資料（学習指導要領解説 2 つ・共通テスト／センター試験の問題と正解の本文（画像だけの PDF は OCR）・日本語版 Wikipedia）と一致する箇所。数式だけの窓（3 文字以上の英単語が 3 語未満）と、日本語の窓でかな・漢字が 10 文字未満のもの（日本語の文の中の英語の名前）は数えない。
表の「一致」はエントリ側の語（コーパスの文はここに書かない）。ソースの数は一致が見つかったソース（manifest の id、参照、日本側の資料）の数。3 つ以上のソースにある一致は、数式の読みや決まった言い回しのことが多い。

- 調べた本文の欄: 15626
- 英語のソース: 3884 ファイル ／ 日本語のソース: 367 ファイル
- 一致した箇所: **568**（466 項目）

| コレクション | id | 欄 | 言語 | 長さ | 一致（エントリの語） | ソースの数 | ソース |
|---|---|---|---|---|---|---|---|
| conventions | accumulation-function-scope | us | en | 11 | topic 6 4 the fundamental theorem of calculus and accumulation functions | 1 | ref:ap-calculus-ab-bc-ced |
| conventions | natural-numbers-and-zero | us | en | 10 | in this book we define the natural numbers to be | 1 | ref:levin-dmoi4 |
| phrases | class-listening-recall-that | en | en | 8 | the derivative of sin x is cos x | 1 | mit-18.01 |
| phrases | class-listening-recall-that | variants[0].en | en | 8 | the derivative of sin x is cos x | 1 | mit-18.01 |
| phrases | exam-set-up-but-do-not-evaluate | variants[0].en | en | 11 | write but do not evaluate an integral expression for the area | 1 | khan-ap-calc |
| phrases | exam-set-up-but-do-not-evaluate | en | en | 8 | set up but do not evaluate an integral | 1 | openstax-calculus |
| phrases | exam-show-your-work | variants[0].en | en | 8 | show the work that leads to your answer | 1 | ref:ap-calculus-ab-bc-ced |
| phrases | exam-use-the-table-to-approximate | variants[0].en | en | 10 | use the data in the table to approximate r 5 | 2 | ref:ap-calculus-ab-bc-ced, khan-ap-calc |
| phrases | exam-write-an-equation-for-the-tangent-line | variants[0].en | en | 14 | write an equation for the line tangent to the graph of f at x | 4 | openstax-calculus, khan-ap-calc, ref:ap-calculus-ab-bc-ced, mit-notes |
| phrases | exam-write-an-equation-for-the-tangent-line | en | en | 10 | find the equation of the tangent line at x 2 | 5 | khan-ap-calc, yt:profleonard, yt:patrickjmt, yt:nancypi, yt:organicchem |
| phrases | explaining-solution-derivative-equal-to-zero | variants[0].en | en | 8 | the derivative and set it equal to zero | 1 | micase |
| phrases | multiply-by-the-derivative-of-the-inside | en | en | 8 | then multiply by the derivative of the inside | 2 | yt:profleonard, yt:organicchem |
| phrases | organize-the-data | variants[0].en | en | 8 | the numbers in order from smallest to largest | 1 | openstax-prealgebra |
| phrases | the-area-of-the-region-bounded-by | variants[0].en | en | 9 | find the area of the region enclosed by the | 1 | openstax-calculus |
| phrases | the-area-of-the-region-bounded-by | en | en | 8 | find the area of the region bounded by | 1 | openstax-calculus |
| phrases | write-as-a-limit-of-a-sum | en | en | 10 | this as the limit as n approaches infinity of a | 1 | khan-ap-calc |
| symbols | delta-x | notes[1] | en | 9 | the change in y over the change in x | 5 | khan-middle, khan-ap-calc, khan-algebra, openstax-algtrig, yt:profleonard |
| symbols | derivative-leibniz | notes[1] | en | 9 | the derivative of x squared with respect to x | 1 | khan-ap-calc |
| symbols | difference-quotient-limit | notes[0] | en | 17 | the limit as h approaches zero of f of x plus h minus f of x all | 2 | khan-ap-calc, yt:organicchem |
| symbols | directional-derivative-notation | notes[0] | en | 10 | the directional derivative of f in the direction of u | 1 | openstax-calculus |
| symbols | floor-brackets | notes[0] | en | 9 | the greatest integer less than or equal to x | 1 | openstax-calculus |
| symbols | gcd-notation | notes[0] | en | 8 | the greatest common divisor of a and b | 2 | mit-6.042, mit-notes |
| symbols | geq-sign | notes[0] | en | 8 | x is greater than or equal to zero | 5 | khan-ap-calc, yt:profleonard, khan-algebra, yt:organicchem, yt:patrickjmt |
| symbols | integral-definite | notes[1] | en | 8 | the integral from a to b of f | 3 | mit-18.01, khan-ap-calc, yt:patrickjmt |
| symbols | leq-sign | notes[0] | en | 9 | x is less than or equal to five is | 1 | yt:organicchem |
| symbols | limit-from-left | notes[0] | en | 9 | x a x approaches a from the left x | 2 | openstax-algtrig, openstax-precalculus |
| symbols | limit-from-right | notes[0] | en | 9 | x a x approaches a from the right x | 2 | openstax-algtrig, openstax-precalculus |
| symbols | limit-x-to-a | notes[0] | en | 8 | the limit as x approaches a of f | 2 | khan-ap-calc, yt:organicchem |
| symbols | natural-log-ln | notes[1] | en | 9 | the natural log of the absolute value of x | 1 | khan-ap-calc |
| symbols | partial-derivative-leibniz | notes[0] | en | 9 | the partial derivative of f with respect to x | 3 | yt:profleonard, openstax-calculus, mit-18.02 |
| symbols | partial-derivative-leibniz | notes[0] | en | 8 | the partial of f with respect to x | 3 | yt:profleonard, mit-18.03, openstax-calculus |
| symbols | permutation-npr | notes[1] | en | 13 | the number of permutations of n distinct objects taken r at a time | 2 | openstax-algtrig, openstax-precalculus |
| symbols | probability-of-union | notes[0] | en | 8 | probability of a or b the probability of | 1 | micase |
| symbols | second-derivative-leibniz | notes[0] | en | 9 | the second derivative of y with respect to x | 2 | khan-ap-calc, mit-18.01 |
| symbols | set-builder-braces | notes[0] | en | 11 | the set of all x such that x is greater than | 3 | openstax-algtrig, openstax-precalculus, ref:levin-dmoi4 |
| symbols | square-root | notes[0] | en | 9 | the square root of the quantity x squared plus | 2 | mit-18.01, mit-18.02 |
| symbols | there-exists-quantifier | notes[0] | en | 8 | there exists an x such that there is | 1 | micase |
| terms | aa-similarity | definition_en | en | 9 | the angles of a triangle add up to 180 | 3 | khan-algebra, openstax-intalg, khan-middle |
| terms | aas-congruence | definition_en | en | 14 | if two angles and a non included side of one triangle are congruent to | 2 | ref:im-9-12, ref:ck12-geometry |
| terms | absolute-extrema | examples[1].en | en | 10 | find the absolute maximum and minimum values of f x | 1 | openstax-calculus |
| terms | absolute-value | definition_en | en | 9 | the absolute value of a number is never negative | 2 | openstax-elemalg, openstax-intalg |
| terms | absolute-value | definition_en | en | 8 | distance from zero on the number line since | 1 | openstax-intalg |
| terms | absolute-value-function | examples[1].en | en | 8 | graph the absolute value function f x x | 2 | openstax-algtrig, openstax-precalculus |
| terms | acceleration | definition_en | en | 10 | the rate of change of velocity with respect to time | 1 | khan-ap-calc |
| terms | acute-triangle | pitfalls[1] | en | 10 | ck 12 geometry 4 2 classify triangles by angle measurement | 1 | ref:ck12-geometry |
| terms | algebraic-multiplicity | definition_en | en | 8 | occurs as a root of the characteristic polynomial | 1 | ref:nicholson-lawa-2021a |
| terms | alternate-exterior-angles | examples[0].en | en | 10 | the parallel lines and on opposite sides of the transversal | 1 | ref:im-6-8 |
| terms | alternate-exterior-angles | definition_en | en | 8 | lines and on opposite sides of the transversal | 1 | ref:im-6-8 |
| terms | alternate-exterior-angles | examples[1].en | en | 8 | two parallel lines are cut by a transversal | 1 | ref:ck12-geometry |
| terms | alternate-exterior-angles | pitfalls[1] | en | 8 | 2 converse of the alternate exterior angles theorem | 1 | ref:ck12-geometry |
| terms | alternate-interior-angles | definition_en | en | 8 | lines and on opposite sides of the transversal | 1 | ref:im-6-8 |
| terms | angle-between-vectors | examples[0].en | en | 12 | use the dot product to find the angle between the two vectors | 3 | openstax-algtrig, openstax-precalculus, openstax-calculus |
| terms | angle-bisector-theorem | examples[1].ja | ja | 21 | ∠Aの二等分線と辺BCの交点をDとするとき | 1 | jp:kaisetsu-chu |
| terms | angle-of-depression | definition_en | en | 8 | the angle between the horizontal and the line | 2 | openstax-algtrig, openstax-precalculus |
| terms | angle-of-elevation | definition_en | en | 8 | the angle between the horizontal and the line | 2 | openstax-algtrig, openstax-precalculus |
| terms | angle-of-elevation | examples[1].en | en | 8 | building the angle of elevation to the top | 2 | openstax-algtrig, openstax-precalculus |
| terms | angle-sum-of-a-triangle | definition_en | en | 12 | that the three interior angles of any triangle add up to 180 | 1 | ref:ck12-geometry |
| terms | angle-sum-of-a-triangle | mapping_note | en | 9 | ck 12 geometry 4 17 triangle angle sum theorem | 1 | ref:ck12-geometry |
| terms | apothem | pitfalls[2] | en | 11 | ck 12 geometry 5 21 area of regular and irregular polygons | 1 | ref:ck12-geometry |
| terms | arc-length | definition_en | en | 8 | the length of an arc of a circle | 2 | openstax-algtrig, openstax-precalculus |
| terms | area | examples[0].en | en | 12 | the area of a triangle is one half base times height so | 6 | yt:organicchem, khan-middle, openstax-prealgebra, openstax-elemalg, openstax-intalg, ref:ck12-geometry |
| terms | area | examples[1].en | en | 10 | find the area of a triangle with sides of length | 2 | openstax-algtrig, openstax-precalculus |
| terms | area-between-two-curves | examples[1].en | en | 10 | the region is bounded on the left and right by | 1 | openstax-calculus |
| terms | area-between-two-curves | pitfalls[2] | en | 9 | find the area of the region bounded by the | 1 | openstax-calculus |
| terms | area-in-polar-coordinates | definition_en | en | 10 | the area of a region bounded by a polar curve | 1 | openstax-calculus |
| terms | area-in-polar-coordinates | examples[1].en | en | 8 | find the area of the region enclosed by | 1 | openstax-calculus |
| terms | area-model | definition_en | en | 11 | area is the sum of the areas of the smaller rectangles | 5 | ref:ck12-geometry, ref:im-6-8, mit-18.01, yt:3blue1brown, openstax-prealgebra |
| terms | area-of-a-regular-polygon | pitfalls[0] | en | 11 | ck 12 geometry 5 21 area of regular and irregular polygons | 1 | ref:ck12-geometry |
| terms | area-of-a-regular-polygon | examples[1].en | en | 8 | use the formula for the area of a | 5 | openstax-calculus, ref:ck12-geometry, openstax-intalg, openstax-elemalg, ref:ck12-algebra |
| terms | area-of-a-sector | examples[2].en | en | 11 | find the area of a sector of a circle with radius | 4 | openstax-calculus, openstax-algtrig, openstax-precalculus, ref:im-9-12 |
| terms | area-of-a-triangle | examples[0].en | en | 11 | the area of a triangle is one half base times height | 6 | yt:organicchem, khan-middle, openstax-prealgebra, openstax-elemalg, openstax-intalg, ref:ck12-geometry |
| terms | area-of-a-triangle-using-vectors | examples[1].en | en | 8 | find the area of the triangle with vertices | 1 | ref:nicholson-lawa-2021a |
| terms | area-under-the-curve | definition_en | en | 8 | the x axis from x a to x | 1 | openstax-calculus |
| terms | arithmetic-sequence | definition_en | en | 9 | a sequence in which each term is the previous | 1 | ref:im-9-12 |
| terms | as-x-approaches-infinity | examples[0].en | en | 8 | as x goes to infinity e to the | 1 | mit-18.01 |
| terms | asa-congruence | definition_en | en | 17 | angles and the included side of one triangle are congruent to two angles and the included side | 2 | ref:im-9-12, ref:ck12-geometry |
| terms | at-least-one | examples[1].en | en | 9 | find the probability of getting at least one 6 | 2 | openstax-introstats, ref:levin-dmoi4 |
| terms | auxiliary-angle-form | examples[0].en | en | 9 | the square root of a squared plus b squared | 3 | yt:organicchem, mit-18.06, mit-18.03 |
| terms | auxiliary-line | examples[1].en | en | 9 | prove that the sum of the interior angles of | 2 | ref:levin-dmoi4, khan-algebra |
| terms | average-rate-of-change | examples[0].en | en | 10 | the average rate of change from x 1 to x | 2 | openstax-algtrig, openstax-precalculus |
| terms | average-rate-of-change | examples[1].en | en | 9 | find the average rate of change of f x | 3 | openstax-precalculus, openstax-algtrig, khan-ap-calc |
| terms | axis-of-symmetry | examples[1].en | en | 11 | the vertex and the equation of the axis of symmetry of | 2 | openstax-intalg, openstax-elemalg |
| terms | axis-of-symmetry | examples[0].en | en | 10 | the axis of symmetry goes right through the vertex so | 1 | yt:profleonard |
| terms | base-of-a-solid | examples[1].en | en | 9 | find the number of faces edges and vertices of | 1 | ref:ck12-geometry |
| terms | base-of-a-solid | pitfalls[1] | en | 8 | area of the base area of the base | 1 | khan-middle |
| terms | base-of-the-natural-logarithm | examples[0].en | en | 8 | e to the x is its own derivative | 1 | yt:3blue1brown |
| terms | basic-properties-of-probability | definition_en | en | 8 | the probability of the sample space is 1 | 1 | ref:ap-statistics-ced |
| terms | basic-variable | examples[1].en | en | 8 | the leading variables in terms of the parameters | 1 | ref:nicholson-lawa-2021a |
| terms | basis | examples[1].en | en | 8 | find a basis for the column space of | 1 | mit-18.06 |
| terms | be-circumscribed-about | mapping_note | en | 8 | the circle that passes through all three vertices | 1 | ref:ck12-geometry |
| terms | biconditional | definition_en | en | 8 | p and q have the same truth value | 1 | ref:levin-dmoi4 |
| terms | bisect | examples[0].en | en | 9 | the diagonals of a parallelogram bisect each other so | 3 | ref:im-9-12, mit-18.02, ref:nicholson-lawa-2021a |
| terms | both-sides | examples[0].en | en | 13 | whatever you do to one side you have to do to the other | 2 | khan-middle, yt:profleonard |
| terms | both-sides | definition_en | en | 10 | both the left hand side and the right hand side | 5 | khan-ap-calc, mit-18.01, yt:3blue1brown, khan-algebra, khan-middle |
| terms | can-be-integrated | examples[1].en | en | 8 | continuous on a b then f is integrable | 1 | openstax-calculus |
| terms | cartesian-product | definition_en | en | 8 | of all ordered pairs a b with a | 1 | ref:levin-dmoi4 |
| terms | cavalieris-principle | definition_en | en | 8 | then the two solids have the same volume | 1 | ref:im-9-12 |
| terms | center | definition_en | en | 8 | the point that is the same distance from | 1 | ref:im-9-12 |
| terms | central-angle | definition_en | en | 11 | an angle whose vertex is at the center of a circle | 1 | ref:im-9-12 |
| terms | central-limit-theorem | definition_en | en | 9 | the distribution of the sample mean is approximately normal | 1 | openstax-introstats |
| terms | centroid | examples[1].en | en | 9 | find the coordinates of the centroid of the triangle | 1 | ref:ck12-geometry |
| terms | chain-rule | examples[1].en | en | 9 | use the chain rule to find the derivative of | 4 | ref:ap-calculus-ab-bc-ced, yt:organicchem, openstax-calculus, yt:nancypi |
| terms | chain-rule | examples[0].en | en | 8 | chain rule take the derivative of the outside | 1 | yt:nancypi |
| terms | chain-rule | examples[0].en | en | 8 | then multiply by the derivative of the inside | 2 | yt:profleonard, yt:organicchem |
| terms | change | examples[0].en | en | 8 | is 3 and the change in y is | 1 | khan-middle |
| terms | change-of-base-formula | definition_ja | en | 8 | log a b log c b log c | 1 | openstax-algtrig |
| terms | change-of-base-formula | definition_en | en | 8 | log a b log c b log c | 1 | openstax-algtrig |
| terms | checking-whether-the-solution-makes-sense | examples[2].en | en | 8 | the side length of a square with area | 2 | ref:im-6-8, ref:im-9-12 |
| terms | circle | definition_en | en | 17 | the set of all points in a plane that are the same distance from a fixed point | 5 | openstax-algtrig, openstax-precalculus, openstax-intalg, openstax-calculus, ref:ck12-geometry |
| terms | circle | examples[1].en | en | 9 | find the area of a circle with a radius | 2 | ref:ck12-geometry, khan-middle |
| terms | circumcenter | definition_en | en | 8 | the point where the perpendicular bisectors of the | 1 | ref:ck12-geometry |
| terms | circumference | examples[1].en | en | 10 | find the circumference of a circle with a radius of | 2 | openstax-algtrig, ref:ck12-geometry |
| terms | circumscribed-circle | definition_en | en | 8 | where the perpendicular bisectors of the sides meet | 1 | ref:ck12-geometry |
| terms | clear-the-denominators | definition_en | en | 12 | multiply both sides of an equation by the least common denominator lcd | 5 | openstax-prealgebra, openstax-elemalg, openstax-intalg, ref:im-9-12, ref:ck12-algebra |
| terms | clear-the-denominators | examples[1].en | en | 8 | first clear the fractions by multiplying both sides | 2 | openstax-algtrig, openstax-precalculus |
| terms | clear-the-denominators | examples[2].en | en | 8 | multiply both sides by 10 to clear the | 1 | openstax-prealgebra |
| terms | coefficient-of-determination | examples[1].en | en | 8 | find the coefficient of determination and interpret it | 1 | openstax-introstats |
| terms | column-space | examples[0].en | en | 8 | exactly when b is in the column space | 1 | mit-18.06 |
| terms | column-space | examples[1].en | en | 8 | b lies in the column space of a | 1 | ref:nicholson-lawa-2021a |
| terms | complementary-angle | examples[0].en | en | 10 | the two acute angles in a right triangle are complementary | 3 | openstax-algtrig, openstax-precalculus, ref:im-9-12 |
| terms | complementary-event | definition_en | en | 9 | outcomes in the sample space that are not in | 2 | openstax-algtrig, openstax-precalculus |
| terms | complementary-event | examples[0].en | en | 8 | the probability of the complement of the event | 1 | ref:levin-dmoi4 |
| terms | complex-conjugate | examples[0].en | en | 12 | multiply the top and bottom by the complex conjugate of the denominator | 1 | mit-18.03 |
| terms | complex-conjugate | examples[1].en | en | 8 | is a real number if and only if | 1 | openstax-calculus |
| terms | complex-number | definition_en | en | 8 | the real part and b the imaginary part | 1 | openstax-intalg |
| terms | complex-number | examples[0].en | en | 8 | multiply the top and bottom by the conjugate | 1 | yt:blackpenredpen |
| terms | component-form | examples[1].en | en | 8 | find the component form of the vector from | 1 | openstax-calculus |
| terms | composite-figure | mapping_note | en | 8 | 5 18 area and perimeter of composite shapes | 1 | ref:ck12-geometry |
| terms | composite-figure | pitfalls[0] | en | 8 | 5 18 area and perimeter of composite shapes | 1 | ref:ck12-geometry |
| terms | compute | examples[2].en | en | 8 | the area of a circle with a radius | 1 | khan-middle |
| terms | conclusion | examples[1].en | en | 10 | if two angles are vertical angles then they are congruent | 1 | ref:ck12-geometry |
| terms | conditional-statement | examples[0].en | en | 9 | the hypothesis is true and the conclusion is false | 1 | ref:levin-dmoi4 |
| terms | conditions-for-a-parallelogram | examples[0].en | en | 8 | to prove that a quadrilateral is a parallelogram | 1 | ref:ck12-geometry |
| terms | cone | examples[1].en | en | 10 | has a radius of 3 cm and a height of | 1 | ref:im-6-8 |
| terms | confidence-interval | examples[1].en | en | 9 | construct a 95 confidence interval for the population mean | 2 | openstax-introstats, yt:profleonard |
| terms | congruence-criteria | mapping_note | en | 8 | geometry 2 6 side angle side triangle congruence | 1 | ref:im-9-12 |
| terms | congruence-criteria-for-right-triangles | definition_en | en | 8 | the hypotenuses and one pair of legs are | 1 | ref:ck12-geometry |
| terms | congruence-modulo-n | examples[1].en | en | 9 | prove that congruence modulo n is an equivalence relation | 1 | ref:levin-dmoi4 |
| terms | congruent-arcs | pitfalls[0] | en | 8 | ck 12 geometry 6 9 arcs in circles | 1 | ref:ck12-geometry |
| terms | connected | definition_en | en | 9 | there is a path between every pair of vertices | 2 | mit-notes, ref:levin-dmoi4 |
| terms | consecutive-terms | examples[1].en | en | 8 | the difference between any two consecutive terms is | 2 | openstax-algtrig, openstax-precalculus |
| terms | contingency-table | examples[1].en | en | 9 | find the probability that a randomly chosen student is | 1 | openstax-introstats |
| terms | continuous | examples[0].en | en | 8 | you can draw it without lifting your pencil | 1 | yt:profleonard |
| terms | converse | examples[1].en | en | 9 | if two angles are vertical angles then they are | 1 | ref:ck12-geometry |
| terms | converse-of-the-pythagorean-theorem | examples[1].en | en | 8 | the converse of the pythagorean theorem to determine | 1 | ref:ck12-geometry |
| terms | coordinate-proof | examples[1].en | en | 9 | that the diagonals of a parallelogram bisect each other | 3 | ref:im-9-12, mit-18.02, ref:nicholson-lawa-2021a |
| terms | coordinate-vector | definition_en | en | 10 | a vector as a linear combination of the basis vectors | 1 | ref:nicholson-lawa-2021a |
| terms | correlation-coefficient | definition_en | en | 9 | the strength and direction of the linear relationship between | 1 | openstax-introstats |
| terms | cosecant | examples[1].en | en | 15 | in right triangle abc angle c is a right angle ab 13 and bc 5 | 1 | ref:im-9-12 |
| terms | cpctc | definition_en | en | 9 | corresponding parts of congruent triangles are congruent it is | 1 | ref:ck12-geometry |
| terms | cpctc | pitfalls[2] | en | 8 | cpctc corresponding parts of congruent triangles are congruent | 2 | ref:ck12-geometry, yt:organicchem |
| terms | cross-method | examples[0].en | en | 8 | numbers that multiply to 6 and add to | 1 | openstax-elemalg |
| terms | cross-section | examples[1].en | en | 15 | cross sections perpendicular to the x axis are squares find the volume of the solid | 1 | khan-ap-calc |
| terms | cross-section | examples[1].en | en | 8 | the base of a solid is the region | 1 | khan-ap-calc |
| terms | cross-section | examples[1].en | en | 8 | the x axis and the line x 4 | 1 | openstax-calculus |
| terms | cryptography | pitfalls[2] | en | 10 | 8 8 an application to linear codes over finite fields | 1 | ref:nicholson-lawa-2021a |
| terms | cubic-units | pitfalls[2] | en | 8 | geometry 5 7 the root of the problem | 1 | ref:im-9-12 |
| terms | curve-sketching | pitfalls[0] | en | 10 | connecting a function its first derivative and its second derivative | 1 | ref:ap-calculus-ab-bc-ced |
| terms | cyclic-quadrilateral | pitfalls[2] | en | 9 | ck 12 geometry 6 15 inscribed quadrilaterals in circles | 1 | ref:ck12-geometry |
| terms | cycloid | examples[1].en | en | 14 | find the length of one arch of the cycloid x sin y 1 cos | 1 | openstax-calculus |
| terms | cycloid | definition_en | en | 11 | the curve traced by a point on the rim of a | 1 | openstax-calculus |
| terms | cylinder | examples[1].en | en | 12 | a cylinder has a radius of 4 cm and a height of | 1 | ref:im-6-8 |
| terms | decomposition-of-a-vector | examples[1].en | en | 8 | as a linear combination of a and b | 1 | mit-notes |
| terms | density-curve | examples[0].en | en | 8 | the area under the density curve between two | 1 | openstax-introstats |
| terms | derivative | definition_en | en | 11 | the slope of the tangent line to the graph of f | 8 | openstax-calculus, khan-ap-calc, yt:profleonard, openstax-precalculus, mit-18.01, mit-notes ほか |
| terms | derivative-at-a-point | definition_en | en | 10 | to the slope of the tangent line at the point | 3 | openstax-calculus, openstax-precalculus, khan-ap-calc |
| terms | derivative-at-a-point | examples[0].en | en | 10 | of two is the slope of the tangent line there | 1 | khan-ap-calc |
| terms | derivative-at-a-point | collocations[1].en | en | 8 | the slope of the tangent line at x | 1 | khan-ap-calc |
| terms | derivative-of-a-sum | definition_en | en | 8 | of a sum is the sum of the | 2 | mit-notes, openstax-calculus |
| terms | derivative-of-a-vector-function | examples[1].en | en | 9 | the derivative of the vector valued function r t | 1 | openstax-calculus |
| terms | derivative-of-the-exponential-function | examples[0].en | en | 13 | the derivative of e to the x is just e to the x | 6 | khan-ap-calc, yt:organicchem, mit-18.01, yt:nancypi, yt:3blue1brown, yt:blackpenredpen |
| terms | derivatives-in-polar-form | examples[1].en | en | 8 | find the slope of the tangent line to | 4 | openstax-calculus, khan-ap-calc, yt:profleonard, yt:blackpenredpen |
| terms | derivatives-of-inverse-trig-functions | definition_en | en | 8 | the formulas for the derivatives of the inverse | 2 | openstax-calculus, yt:patrickjmt |
| terms | derivatives-of-inverse-trig-functions | examples[0].en | en | 8 | x is one over one plus x squared | 1 | khan-ap-calc |
| terms | derivatives-of-trigonometric-functions | examples[0].en | en | 10 | the derivative of sine is cosine and the derivative of | 2 | yt:organicchem, khan-ap-calc |
| terms | derivatives-of-trigonometric-functions | definition_ja | en | 8 | sin x cos x cos x sin x | 4 | openstax-calculus, mit-notes, openstax-algtrig, openstax-precalculus |
| terms | descartes-rule-of-signs | examples[1].en | en | 16 | use descartes rule of signs to determine the possible numbers of positive and negative real zeros | 2 | openstax-algtrig, openstax-precalculus |
| terms | diagonalization | definition_en | en | 8 | finding an invertible matrix p such that p | 1 | ref:nicholson-lawa-2021a |
| terms | diameter | definition_en | en | 9 | a line segment that passes through the center of | 2 | openstax-algtrig, openstax-precalculus |
| terms | diameter | examples[0].en | en | 9 | all the way across the circle through the center | 1 | khan-middle |
| terms | die | examples[1].en | en | 9 | find the probability of rolling a number greater than | 3 | openstax-algtrig, openstax-precalculus, khan-middle |
| terms | difference | pitfalls[0] | en | 10 | the difference of a and b a b the difference | 2 | openstax-elemalg, ref:levin-dmoi4 |
| terms | dilation | pitfalls[2] | en | 10 | ck 12 geometry 7 16 dilation in the coordinate plane | 1 | ref:ck12-geometry |
| terms | dimension | examples[1].en | en | 8 | the dimension of the null space of a | 1 | mit-18.06 |
| terms | directed-segment | definition_en | en | 8 | from its initial point to its terminal point | 1 | openstax-calculus |
| terms | direction-angle | examples[0].en | en | 8 | is measured counterclockwise from the positive x axis | 1 | ref:nicholson-lawa-2021a |
| terms | directional-derivative | examples[1].en | en | 8 | find the directional derivative of f x y | 1 | openstax-calculus |
| terms | disk-method | definition_en | en | 9 | finding the volume of a solid of revolution by | 2 | openstax-calculus, mit-18.01 |
| terms | distance-formula | examples[1].en | en | 9 | use the distance formula to find the distance between | 3 | openstax-intalg, openstax-algtrig, openstax-precalculus |
| terms | distance-formula | definition_en | en | 8 | points x1 y1 and x2 y2 in the | 1 | ref:nicholson-lawa-2021a |
| terms | distance-formula | examples[0].en | en | 8 | and the square root of 25 is 5 | 1 | yt:organicchem |
| terms | distance-from-a-point-to-a-line | examples[0].en | en | 9 | the distance from a point to a line is | 3 | openstax-calculus, ref:im-9-12, ref:ck12-geometry |
| terms | divergence-theorem | examples[1].en | en | 10 | use the divergence theorem to find the outward flux of | 1 | openstax-calculus |
| terms | divergence-theorem | definition_en | en | 9 | the triple integral of the divergence over the solid | 1 | mit-18.02 |
| terms | double-integral | definition_en | en | 9 | of a function of two variables over a region | 1 | openstax-calculus |
| terms | draw-a-graph | examples[0].en | en | 8 | points and connect them with a straight line | 1 | openstax-prealgebra |
| terms | element | definition_en | en | 8 | that a is an element of the set | 2 | ref:nicholson-lawa-2021a, ref:levin-dmoi4 |
| terms | elementary-event | examples[1].en | en | 9 | list all the outcomes in the sample space for | 1 | ref:im-9-12 |
| terms | empirical-rule | examples[1].en | en | 12 | approximately normal with a mean of 70 and a standard deviation of | 2 | ref:im-9-12, openstax-introstats |
| terms | empirical-rule | definition_en | en | 10 | fall within one standard deviation of the mean about 95 | 2 | yt:3blue1brown, openstax-introstats |
| terms | end-behavior | definition_en | en | 10 | as x goes to positive infinity and to negative infinity | 1 | yt:nancypi |
| terms | entry | examples[1].en | en | 9 | the entry in row 1 column 2 of the | 2 | openstax-algtrig, openstax-precalculus |
| terms | entry | examples[0].en | en | 8 | the entry in row 2 column 3 is | 2 | openstax-algtrig, openstax-precalculus |
| terms | equal-angles | examples[1].en | en | 8 | the base angles of an isosceles triangle are | 2 | ref:im-9-12, ref:ck12-geometry |
| terms | equal-vectors | definition_en | en | 9 | they have the same magnitude and the same direction | 3 | openstax-algtrig, openstax-precalculus, openstax-calculus |
| terms | equality-of-complex-numbers | examples[1].en | en | 10 | find the real numbers x and y such that x | 2 | ref:nicholson-lawa-2021a, ref:levin-dmoi4 |
| terms | equation-of-a-circle | pitfalls[0] | en | 8 | standard form of the equation of a circle | 4 | openstax-intalg, openstax-algtrig, openstax-precalculus, yt:organicchem |
| terms | equation-of-a-line | examples[1].en | en | 8 | find the equation of the line passing through | 1 | openstax-algtrig |
| terms | equation-of-a-sphere | definition_en | en | 10 | the sphere with center a b c and radius r | 2 | openstax-calculus, ref:im-9-12 |
| terms | eulers-formula-for-polyhedra | definition_en | en | 8 | with v vertices e edges and f faces | 1 | ref:levin-dmoi4 |
| terms | eulers-method | examples[0].en | en | 8 | use euler's method with a step size of | 2 | openstax-calculus, khan-ap-calc |
| terms | even-function | definition_en | en | 8 | its graph is symmetric about the y axis | 3 | ref:im-9-12, openstax-algtrig, openstax-precalculus |
| terms | exist | examples[1].en | en | 8 | there exists a real number x such that | 3 | openstax-calculus, openstax-algtrig, openstax-precalculus |
| terms | expected-value | examples[1].en | en | 9 | find the expected value of the number of heads | 2 | mit-notes, openstax-introstats |
| terms | experimental-probability | examples[1].en | en | 8 | the probability that a thumbtack lands point up | 1 | ref:levin-dmoi4 |
| terms | exponent | pitfalls[0] | en | 8 | x to the fifth x to the fifth | 1 | khan-ap-calc |
| terms | exponential-model | definition_en | en | 8 | the rate of change is proportional to the | 1 | yt:3blue1brown |
| terms | exterior-angle-theorem | definition_en | en | 9 | the two interior angles that are not adjacent to | 1 | ref:ck12-geometry |
| terms | extreme-value-theorem | definition_en | en | 8 | both an absolute maximum and an absolute minimum | 1 | openstax-calculus |
| terms | factorial | examples[0].en | en | 9 | 5 times 4 times 3 times 2 times 1 | 1 | yt:nancypi |
| terms | fail-to-reject | examples[1].en | en | 10 | there is not sufficient evidence to conclude that the mean | 1 | openstax-introstats |
| terms | find-the-equation | examples[1].en | en | 11 | find the equation of the circle with center 2 1 that | 2 | openstax-intalg, ref:ck12-geometry |
| terms | find-the-equation-of-the-tangent-line | examples[1].en | en | 9 | find an equation of the tangent line to y | 2 | openstax-calculus, openstax-precalculus |
| terms | find-the-equation-of-the-tangent-line | examples[0].en | en | 8 | to find the equation of the tangent line | 4 | khan-ap-calc, yt:patrickjmt, yt:organicchem, yt:nancypi |
| terms | find-the-equation-of-the-tangent-line | pitfalls[0] | en | 8 | equation of the tangent line the equation of | 1 | khan-ap-calc |
| terms | find-the-nth-term | examples[1].en | en | 8 | formula for the nth term of the sequence | 1 | ref:levin-dmoi4 |
| terms | first-term | examples[1].en | en | 8 | the first term and the common difference of | 2 | openstax-algtrig, openstax-precalculus |
| terms | five-number-summary | definition_en | en | 11 | the first quartile the median the third quartile and the maximum | 2 | openstax-introstats, ref:im-9-12 |
| terms | floor-function | definition_en | en | 9 | the greatest integer less than or equal to x | 1 | openstax-calculus |
| terms | foil | definition_en | en | 8 | to multiply two binomials multiply the first terms | 1 | openstax-elemalg |
| terms | foot-of-the-perpendicular | examples[1].en | en | 8 | point p 1 2 3 to the plane | 1 | openstax-calculus |
| terms | frequency-polygon | definition_en | en | 9 | the midpoints of the tops of the bars of | 1 | openstax-introstats |
| terms | frequency-polygon | examples[0].en | en | 8 | the midpoints of the tops of the bars | 1 | openstax-introstats |
| terms | function | examples[1].en | en | 8 | an equation for y in terms of x | 2 | mit-18.01, yt:nancypi |
| terms | general-angle | examples[1].en | en | 11 | find the angle between 0 and 360 that is coterminal with | 2 | openstax-algtrig, openstax-precalculus |
| terms | general-form-of-a-circle | examples[1].en | en | 8 | find the center and radius of the circle | 1 | ref:im-9-12 |
| terms | generating-function | examples[1].en | en | 11 | find the generating function for the sequence 1 2 4 8 | 1 | ref:levin-dmoi4 |
| terms | generating-function | examples[0].en | en | 8 | the generating function for 1 1 1 1 | 1 | ref:levin-dmoi4 |
| terms | geometric-mean | examples[0].en | en | 8 | the square root of 16 which is 4 | 3 | yt:organicchem, khan-ap-stats, khan-middle |
| terms | geometric-sequence | definition_en | en | 9 | a sequence in which each term is the previous | 1 | ref:im-9-12 |
| terms | geometric-sequence | examples[1].en | en | 8 | of the geometric sequence 3 6 12 24 | 1 | openstax-intalg |
| terms | gradient | examples[1].en | en | 8 | find the gradient of f x y z | 1 | openstax-calculus |
| terms | graph | definition_en | en | 8 | the points x y on the coordinate plane | 1 | ref:im-6-8 |
| terms | graph-coloring | definition_en | en | 8 | different colors the smallest number of colors needed | 1 | ref:levin-dmoi4 |
| terms | greater-than | pitfalls[1] | en | 9 | than or equal to greater than or equal to | 1 | khan-middle |
| terms | greater-than | examples[0].en | en | 8 | farther to the right on the number line | 1 | ref:ck12-algebra |
| terms | greatest-common-divisor | examples[0].en | en | 8 | is the biggest number that goes into both | 1 | khan-middle |
| terms | half-angle-formulas | examples[1].en | en | 10 | a half angle formula to find the exact value of | 2 | openstax-algtrig, openstax-precalculus |
| terms | height | definition_en | en | 8 | segment from a vertex to the opposite side | 1 | ref:im-9-12 |
| terms | herons-formula | examples[1].en | en | 12 | use heron's formula to find the area of a triangle with sides | 3 | openstax-algtrig, openstax-precalculus, ref:im-6-8 |
| terms | hl-congruence | definition_en | en | 8 | right triangle are congruent to the hypotenuse and | 1 | ref:ck12-geometry |
| terms | horizontal-asymptote | definition_en | en | 8 | the degrees of the numerator and the denominator | 3 | openstax-algtrig, openstax-precalculus, yt:nancypi |
| terms | horizontal-line-test | definition_en | en | 10 | one to one if no horizontal line crosses the graph | 2 | openstax-algtrig, openstax-precalculus |
| terms | horizontal-line-test | examples[1].en | en | 8 | use the horizontal line test to determine whether | 1 | openstax-calculus |
| terms | hyperbola | definition_en | en | 9 | is the set of all points for which the | 1 | openstax-calculus |
| terms | hyperbolic-functions | examples[0].en | en | 10 | e to the x and e to the negative x | 1 | mit-18.03 |
| terms | hypotenuse | examples[1].en | en | 8 | the legs of a right triangle are 6 | 1 | ref:ck12-geometry |
| terms | hypothesis-testing | examples[1].en | en | 9 | conduct a hypothesis test at the 5 significance level | 1 | openstax-introstats |
| terms | image | pitfalls[2] | en | 9 | 7 2 kernel and image of a linear transformation | 1 | ref:nicholson-lawa-2021a |
| terms | inequality | pitfalls[0] | en | 20 | less than or equal to greater than or equal to less than or equal to greater than or equal to | 3 | khan-middle, openstax-introstats, khan-ap-calc |
| terms | inequality | examples[1].en | en | 8 | and graph the solution on a number line | 1 | ref:im-6-8 |
| terms | inequality-sign | pitfalls[2] | en | 9 | less than b a b a is greater than | 3 | openstax-prealgebra, openstax-elemalg, openstax-intalg |
| terms | infinite-geometric-series | examples[1].en | en | 8 | find the sum of the infinite geometric series | 3 | openstax-algtrig, openstax-precalculus, openstax-intalg |
| terms | infinitely-many-solutions | definition_en | en | 8 | that is always true such as 0 0 | 2 | openstax-algtrig, openstax-precalculus |
| terms | initial-condition | definition_en | en | 8 | the value of the function at one point | 1 | khan-ap-calc |
| terms | initial-point | examples[0].en | en | 9 | put the tail of the second vector at the | 1 | khan-ap-calc |
| terms | inner-function | examples[0].en | en | 9 | to multiply by the derivative of the inside function | 5 | yt:patrickjmt, mit-18.01, yt:nancypi, mit-18.02, yt:profleonard |
| terms | inscribed-angle-theorem | definition_ja | ja | 23 | その弧に対する中心角の大きさの半分であるという | 1 | jp:kaisetsu-chu |
| terms | inscribed-angle-theorem | definition_en | en | 12 | that the measure of an inscribed angle is half the measure of | 1 | ref:ck12-geometry |
| terms | inscribed-angle-theorem | definition_en | en | 8 | inscribed angles that intercept the same arc are | 1 | ref:ck12-geometry |
| terms | instantaneous-rate-of-change | examples[0].en | en | 8 | is the slope of the tangent line there | 1 | khan-ap-calc |
| terms | instantaneous-rate-of-change | examples[1].en | en | 8 | the instantaneous rate of change of f x | 1 | openstax-calculus |
| terms | instantaneous-velocity | examples[1].en | en | 9 | find the instantaneous velocity of the ball at t | 3 | openstax-calculus, openstax-precalculus, yt:organicchem |
| terms | instantaneous-velocity | definition_en | en | 8 | the derivative of position with respect to time | 1 | khan-ap-calc |
| terms | integer-part | mapping_note | en | 9 | the greatest integer less than or equal to x | 1 | openstax-calculus |
| terms | integrate-by-parts | examples[1].en | en | 8 | integration by parts with u ln x and | 1 | openstax-calculus |
| terms | intercepted-arc | mapping_note | en | 8 | 6 16 angles on and inside a circle | 1 | ref:ck12-geometry |
| terms | intermediate-value-theorem | examples[1].en | en | 8 | use the intermediate value theorem to show that | 4 | yt:organicchem, openstax-calculus, openstax-algtrig, openstax-precalculus |
| terms | interquartile-range | examples[0].en | en | 8 | spread out the middle half of the data | 1 | ref:im-6-8 |
| terms | intersecting-chords-theorem | pitfalls[2] | en | 8 | ck 12 geometry 6 13 segments from chords | 1 | ref:ck12-geometry |
| terms | intersection | definition_en | en | 8 | the set of all elements that belong to | 2 | openstax-algtrig, openstax-precalculus |
| terms | inverse | pitfalls[1] | en | 10 | ck 12 geometry 2 12 converse inverse and contrapositive statements | 1 | ref:ck12-geometry |
| terms | isosceles-triangle | examples[2].en | en | 9 | that the base angles of an isosceles triangle are | 2 | ref:im-9-12, ref:ck12-geometry |
| terms | isosceles-triangle | definition_en | en | 8 | a triangle with two sides of equal length | 1 | openstax-prealgebra |
| terms | isosceles-triangle-theorem | definition_en | en | 8 | base angles of an isosceles triangle are congruent | 2 | ref:im-9-12, ref:ck12-geometry |
| terms | joint-variation | definition_en | en | 9 | a relationship in which one quantity is a constant | 2 | openstax-algtrig, openstax-precalculus |
| terms | lateral-area | examples[1].en | en | 9 | a radius of 3 cm and a height of | 1 | ref:im-6-8 |
| terms | latus-rectum | examples[1].en | en | 9 | the focus directrix and endpoints of the latus rectum | 2 | openstax-algtrig, openstax-precalculus |
| terms | law-of-cosines | definition_en | en | 13 | of the other two sides and the cosine of the angle between them | 3 | openstax-algtrig, openstax-precalculus, openstax-calculus |
| terms | law-of-detachment | definition_en | en | 11 | q is true and p is true then q is true | 1 | ref:ck12-geometry |
| terms | law-of-large-numbers | definition_en | en | 8 | the number of trials or the sample size | 1 | openstax-introstats |
| terms | laws-of-exponents | examples[0].en | en | 12 | when you multiply powers with the same base you add the exponents | 2 | ref:im-6-8, khan-middle |
| terms | least-common-denominator | examples[0].en | en | 8 | the lcd of 1 4 and 1 6 | 1 | openstax-prealgebra |
| terms | least-common-multiple | examples[2].en | en | 8 | find the least common multiple of 18 and | 1 | openstax-elemalg |
| terms | least-squares | examples[1].en | en | 8 | least squares to fit a line to the | 1 | mit-18.02 |
| terms | left-hand-limit | definition_en | en | 8 | the limit of f x as x approaches | 4 | khan-ap-calc, openstax-calculus, openstax-precalculus, ref:ap-calculus-ab-bc-ced |
| terms | legs | examples[1].en | en | 10 | in right triangle abc angle c is a right angle | 1 | ref:im-9-12 |
| terms | legs | examples[0].en | en | 8 | the two sides that make the right angle | 1 | ref:im-6-8 |
| terms | less-than | pitfalls[1] | en | 10 | less than or equal to less than or equal to | 2 | khan-ap-calc, openstax-introstats |
| terms | less-than-or-equal-to | examples[0].en | en | 8 | has to be less than or equal to | 5 | khan-algebra, khan-ap-stats, yt:blackpenredpen, yt:patrickjmt, khan-middle |
| terms | let-u-equal | examples[3].en | en | 8 | the sum of the two numbers is 31 | 1 | openstax-algtrig |
| terms | lhopitals-rule | examples[1].en | en | 9 | use l'h pital's rule to evaluate lim x 0 | 1 | openstax-calculus |
| terms | limit | pitfalls[1] | en | 8 | the limit as x approaches a of f | 2 | khan-ap-calc, yt:organicchem |
| terms | limit-definition-of-the-derivative | examples[1].en | en | 8 | use the definition of the derivative to find | 1 | yt:organicchem |
| terms | limit-laws | examples[1].en | en | 9 | use the limit laws to evaluate lim x 2 | 1 | openstax-calculus |
| terms | limit-of-a-riemann-sum | examples[1].en | en | 8 | is defined as a limit of riemann sums | 1 | openstax-calculus |
| terms | limit-of-sine-x-over-x | definition_en | en | 9 | the limit of sin x x as x approaches | 1 | yt:nancypi |
| terms | limit-of-sine-x-over-x | mapping_note | en | 8 | the limit as x approaches 0 of sine | 2 | khan-ap-calc, yt:profleonard |
| terms | line-of-intersection | examples[2].en | en | 8 | find parametric equations for the line of intersection | 1 | openstax-calculus |
| terms | line-of-intersection | examples[2].en | en | 8 | the planes x y z 1 and x | 1 | openstax-calculus |
| terms | linear-diophantine-equation | definition_en | en | 8 | an equation of the form ax by c | 1 | ref:nicholson-lawa-2021a |
| terms | linear-function | definition_en | en | 14 | y mx b where m is the slope and b is the y intercept | 5 | khan-ap-calc, khan-middle, ref:ck12-geometry, khan-algebra, yt:organicchem |
| terms | linear-inequality | pitfalls[0] | en | 10 | less than or equal to greater than or equal to | 1 | khan-middle |
| terms | linear-pair | examples[0].en | en | 8 | so they have to add up to 180 | 1 | yt:organicchem |
| terms | linearity-of-expectation | definition_en | en | 10 | that the expected value of a sum of random variables | 2 | mit-notes, mit-6.042 |
| terms | linearly-dependent | definition_en | en | 9 | can be written as a linear combination of the | 3 | mit-notes, ref:nicholson-lawa-2021a, openstax-calculus |
| terms | maclaurin-series | examples[0].en | en | 8 | the maclaurin series for e to the x | 1 | khan-ap-calc |
| terms | major-arc | pitfalls[2] | en | 8 | ck 12 geometry 6 9 arcs in circles | 1 | ref:ck12-geometry |
| terms | major-axis | examples[1].en | en | 9 | find the length of the major axis of the | 1 | openstax-calculus |
| terms | mean-absolute-deviation | definition_en | en | 8 | distance between each data value and the mean | 2 | ref:im-6-8, ref:im-9-12 |
| terms | mean-value-theorem | examples[1].en | en | 9 | satisfies the hypotheses of the mean value theorem on | 2 | mit-18.01, openstax-calculus |
| terms | median-of-a-triangle | definition_en | en | 12 | a vertex of a triangle to the midpoint of the opposite side | 1 | ref:im-9-12 |
| terms | midline | definition_en | en | 9 | halfway between the maximum and minimum values of a | 2 | ref:im-9-12, ref:im-6-8 |
| terms | midline | examples[1].en | en | 8 | the amplitude period and midline of the graph | 2 | openstax-algtrig, openstax-precalculus |
| terms | midpoint | examples[1].en | en | 8 | find the coordinates of the midpoint of the | 1 | openstax-algtrig |
| terms | midpoint-formula | examples[1].en | en | 10 | use the midpoint formula to find the midpoint of the | 1 | openstax-intalg |
| terms | midsegment-theorem | definition_en | en | 19 | joining the midpoints of two sides of a triangle is parallel to the third side and half as long | 2 | ref:ck12-geometry, ref:nicholson-lawa-2021a |
| terms | midsegment-theorem | mapping_note | en | 8 | theorem ck 12 geometry 4 19 midsegment theorem | 1 | ref:ck12-geometry |
| terms | minor | examples[1].en | en | 8 | by minors along the first row to evaluate | 3 | openstax-intalg, openstax-algtrig, openstax-precalculus |
| terms | minor-arc | pitfalls[2] | en | 8 | ck 12 geometry 6 9 arcs in circles | 1 | ref:ck12-geometry |
| terms | mode | examples[1].en | en | 8 | find the mean median and mode of the | 1 | khan-ap-stats |
| terms | modulus | examples[1].en | en | 8 | mod n then a c b c mod | 1 | ref:levin-dmoi4 |
| terms | modulus-of-a-complex-number | examples[1].en | en | 9 | find the absolute value of the complex number 5 | 2 | openstax-algtrig, openstax-precalculus |
| terms | monotone-convergence-theorem | examples[1].en | en | 8 | use the monotone convergence theorem to show that | 1 | openstax-calculus |
| terms | natural-number | mapping_note | en | 9 | counting numbers 1 2 3 whole numbers 0 1 | 2 | openstax-elemalg, openstax-intalg |
| terms | necessary-and-sufficient-condition | en.variants[0].note | en | 8 | if and only if if and only if | 1 | khan-ap-calc |
| terms | necessary-and-sufficient-condition | examples[1].en | en | 8 | if and only if means you have to | 1 | mit-6.042 |
| terms | net | examples[1].en | en | 9 | of a square with a side length of 4 | 2 | ref:ck12-geometry, ref:im-6-8 |
| terms | normal-approximation-to-the-binomial | examples[1].en | en | 8 | use the normal approximation to the binomial to | 1 | openstax-introstats |
| terms | normal-distribution | examples[1].en | en | 9 | a normal distribution with mean 50 and standard deviation | 1 | openstax-introstats |
| terms | normal-line | examples[1].en | en | 8 | find an equation of the normal line to | 1 | openstax-calculus |
| terms | nth-term | examples[1].en | en | 8 | formula for the nth term of the sequence | 1 | ref:levin-dmoi4 |
| terms | number-line | pitfalls[1] | en | 8 | the distance from 0 on the number line | 2 | openstax-algtrig, openstax-precalculus |
| terms | number-of-elements | examples[1].en | en | 8 | find the number of elements in a b | 1 | ref:levin-dmoi4 |
| terms | number-of-possible-outcomes | definition_en | en | 9 | the probability of an event is the number of | 1 | openstax-prealgebra |
| terms | number-of-possible-outcomes | examples[1].en | en | 9 | find the probability that the sum of the numbers | 3 | openstax-introstats, openstax-algtrig, openstax-precalculus |
| terms | number-of-real-solutions | examples[2].en | en | 8 | have two real solutions one real solution or | 1 | yt:patrickjmt |
| terms | one-sample-t-test | definition_en | en | 9 | population mean when the population standard deviation is unknown | 2 | openstax-introstats, ref:ap-statistics-ced |
| terms | one-sample-t-test | pitfalls[0] | en | 9 | a single population mean using the student t distribution | 1 | openstax-introstats |
| terms | one-to-one-property | examples[0].en | en | 8 | by the one to one property the exponents | 2 | openstax-algtrig, openstax-precalculus |
| terms | one-to-one-property | examples[1].en | en | 8 | use the one to one property to solve | 2 | openstax-algtrig, openstax-precalculus |
| terms | opposite | definition_en | en | 16 | the number that is the same distance from zero on the number line but on the | 4 | openstax-prealgebra, openstax-intalg, openstax-elemalg, ref:im-6-8 |
| terms | origin | definition_en | en | 9 | it is the point where the x axis and | 3 | openstax-prealgebra, openstax-elemalg, openstax-intalg |
| terms | outlier | definition_en | en | 8 | far away from the rest of the data | 1 | ref:im-6-8 |
| terms | p-value | definition_en | en | 8 | the probability assuming the null hypothesis is true | 1 | khan-ap-stats |
| terms | paragraph-proof | examples[1].en | en | 10 | that the base angles of an isosceles triangle are congruent | 2 | ref:im-9-12, ref:ck12-geometry |
| terms | parallel-lines | examples[0].en | en | 10 | parallel lines have the same slope but different y intercepts | 5 | openstax-elemalg, openstax-algtrig, openstax-precalculus, khan-middle, ref:im-9-12 |
| terms | parallelogram | definition_en | en | 9 | a quadrilateral with both pairs of opposite sides parallel | 1 | ref:im-9-12 |
| terms | parametric-equations | examples[1].en | en | 8 | the curve given by the parametric equations x | 1 | openstax-calculus |
| terms | partial-derivative | examples[1].en | en | 8 | the partial derivatives f x and f y | 1 | openstax-calculus |
| terms | partial-order | definition_en | en | 8 | a relation that is reflexive antisymmetric and transitive | 1 | ref:levin-dmoi4 |
| terms | partial-sum | definition_en | en | 8 | of the first n terms of a sequence | 4 | openstax-algtrig, openstax-precalculus, openstax-intalg, ref:levin-dmoi4 |
| terms | pascals-triangle | examples[1].en | en | 8 | use pascal's triangle to expand x y 5 | 1 | openstax-intalg |
| terms | pass-through | examples[1].en | en | 14 | find the equation of the line that passes through the origin and the point | 4 | openstax-algtrig, openstax-precalculus, ref:im-9-12, yt:3blue1brown |
| terms | percent-change | definition_en | en | 8 | as a percent of the original amount the | 1 | openstax-prealgebra |
| terms | perimeter | definition_en | en | 8 | is the sum of the lengths of all | 1 | mit-notes |
| terms | permutation | definition_en | en | 8 | the number of permutations of n objects taken | 2 | openstax-algtrig, openstax-precalculus |
| terms | perpendicular-lines | examples[0].en | en | 8 | perpendicular lines have slopes that are negative reciprocals | 3 | openstax-elemalg, openstax-intalg, openstax-algtrig |
| terms | piecewise-function | definition_en | en | 10 | defined by different formulas on different parts of its domain | 1 | openstax-calculus |
| terms | planar-graph | definition_en | en | 9 | a graph that can be drawn in the plane | 1 | mit-notes |
| terms | point-of-intersection | examples[0].en | en | 8 | set the two equations equal to each other | 1 | micase |
| terms | point-slope-form | definition_en | en | 8 | the equation of the line with slope m | 1 | openstax-algtrig |
| terms | poisson-distribution | definition_en | en | 8 | in a fixed interval of time or space | 1 | openstax-introstats |
| terms | pole | examples[0].en | en | 8 | the distance from the pole to the point | 1 | yt:profleonard |
| terms | polygon | examples[1].en | en | 10 | find the sum of the interior angles of a polygon | 4 | ref:ck12-geometry, ref:levin-dmoi4, khan-algebra, openstax-prealgebra |
| terms | population-proportion | examples[1].en | en | 10 | construct a 95 confidence interval for the population proportion of | 2 | openstax-introstats, yt:profleonard |
| terms | population-standard-deviation | examples[0].en | en | 9 | when we know the population standard deviation we use | 1 | openstax-introstats |
| terms | population-standard-deviation | examples[1].en | en | 8 | construct a 95 confidence interval for the mean | 2 | openstax-introstats, ref:ap-statistics-ced |
| terms | positive-number | definition_en | en | 12 | on a number line positive numbers are to the right of zero | 1 | openstax-prealgebra |
| terms | postulate | definition_en | en | 9 | a statement that is accepted as true without proof | 1 | ref:ck12-geometry |
| terms | potential-function | examples[1].en | en | 8 | find a potential function for f x y | 1 | openstax-calculus |
| terms | power-series | examples[1].en | en | 10 | find a power series representation for f x 1 1 | 1 | openstax-calculus |
| terms | preimage | examples[1].en | en | 8 | the y axis find the coordinates of the | 1 | ref:ck12-geometry |
| terms | prism | examples[1].en | en | 8 | the height of the prism is 10 cm | 1 | ref:im-6-8 |
| terms | probability | examples[2].en | en | 16 | probability the probability of an event is the sum of the probabilities of the outcomes in | 3 | mit-notes, openstax-prealgebra, mit-6.042 |
| terms | probability-density-function | examples[1].en | en | 9 | the probability density function of x is f x | 1 | openstax-introstats |
| terms | probability-density-function | definition_en | en | 8 | the integral of f from a to b | 1 | openstax-calculus |
| terms | product | definition_en | en | 8 | the result of multiplying two or more numbers | 1 | openstax-prealgebra |
| terms | product-rule | examples[0].en | en | 11 | derivative of the first times the second plus the first times | 2 | yt:profleonard, mit-18.01 |
| terms | product-to-sum-formulas | pitfalls[0] | en | 8 | sum to product and product to sum formulas | 2 | openstax-algtrig, openstax-precalculus |
| terms | properties-of-equality | examples[0].en | en | 10 | you do to one side you do to the other | 1 | yt:nancypi |
| terms | properties-of-inequalities | definition_en | en | 8 | multiplying or dividing by a negative number reverses | 1 | openstax-algtrig |
| terms | properties-of-logarithms | definition_ja | en | 8 | log a m log a n log a | 3 | openstax-intalg, openstax-algtrig, openstax-precalculus |
| terms | proposition | examples[2].en | en | 11 | a proposition is a statement that is either true or false | 2 | mit-notes, mit-6.042 |
| terms | proposition | examples[1].en | en | 9 | determine whether the following statement is true or false | 3 | openstax-algtrig, openstax-precalculus, ref:ck12-geometry |
| terms | pure-imaginary-number | definition_en | en | 10 | whose real part is 0 and whose imaginary part is | 1 | yt:3blue1brown |
| terms | pyramid | examples[1].en | en | 8 | pyramid has a square base with sides of | 1 | ref:im-9-12 |
| terms | pythagorean-theorem | examples[1].en | en | 12 | 12 use the pythagorean theorem to find the length of the hypotenuse | 8 | openstax-elemalg, openstax-prealgebra, openstax-intalg, ref:ck12-geometry, openstax-algtrig, openstax-precalculus ほか |
| terms | pythagorean-theorem | definition_en | en | 10 | right triangle with legs a and b and hypotenuse c | 1 | ref:im-9-12 |
| terms | pythagorean-theorem | definition_en | en | 8 | the sum of the squares of the legs | 2 | ref:im-6-8, ref:ck12-geometry |
| terms | pythagorean-triple | definition_en | en | 8 | are the side lengths of a right triangle | 1 | ref:levin-dmoi4 |
| terms | quadrant | definition_en | en | 8 | the x axis and the y axis divide | 1 | openstax-elemalg |
| terms | quadratic-equation | definition_en | en | 9 | an equation that can be written in the form | 2 | openstax-calculus, openstax-prealgebra |
| terms | quartile | examples[0].en | en | 9 | and q3 is the median of the upper half | 1 | yt:organicchem |
| terms | quartile | examples[0].en | en | 8 | q1 is the median of the lower half | 1 | yt:organicchem |
| terms | quotient | pitfalls[0] | en | 11 | divided by b the quotient of a and b a b | 3 | openstax-prealgebra, openstax-intalg, openstax-elemalg |
| terms | radius | examples[0].en | en | 8 | the diameter so if the diameter is 10 | 1 | yt:organicchem |
| terms | random-variable | examples[0].en | en | 8 | be the random variable for the number of | 1 | mit-6.042 |
| terms | random-variable | examples[1].en | en | 8 | the random variable x is the number of | 1 | khan-ap-stats |
| terms | range-of-data | definition_en | en | 8 | is one way to measure how spread out | 1 | ref:im-6-8 |
| terms | rank | examples[1].en | en | 9 | the rank of the matrix and the dimension of | 1 | mit-18.06 |
| terms | ratio-of-areas-of-similar-figures | examples[1].en | en | 9 | 3 find the ratio of the areas of the | 1 | ref:ck12-geometry |
| terms | ratio-of-areas-of-similar-figures | mapping_note | en | 8 | 5 22 area and perimeter of similar polygons | 1 | ref:ck12-geometry |
| terms | ratio-of-areas-of-similar-figures | definition_en | en | 8 | the ratio of the areas of two similar | 1 | ref:ck12-geometry |
| terms | rational-number | definition_en | en | 10 | m n where m and n are integers and n | 1 | openstax-algtrig |
| terms | rational-number | definition_en | en | 8 | a number that can be written as a | 3 | openstax-prealgebra, openstax-elemalg, openstax-intalg |
| terms | rational-root-theorem | examples[1].en | en | 14 | use the rational zero theorem to list all possible rational zeros of f x | 2 | openstax-algtrig, openstax-precalculus |
| terms | rationalizing-the-denominator | definition_en | en | 10 | multiplying the numerator and the denominator by the same number | 2 | khan-middle, khan-ap-calc |
| terms | real-number | definition_en | en | 8 | a number that is either rational or irrational | 3 | openstax-elemalg, openstax-intalg, openstax-prealgebra |
| terms | reduced-row-echelon-form | definition_en | en | 8 | is the only nonzero entry in its column | 1 | ref:nicholson-lawa-2021a |
| terms | reflect | definition_en | en | 8 | on the opposite side of the line the | 1 | ref:im-6-8 |
| terms | region | definition_en | en | 8 | the set of all points x y satisfying | 2 | openstax-algtrig, openstax-precalculus |
| terms | regression-line | examples[1].en | en | 10 | find the equation of the least squares regression line and | 2 | openstax-introstats, ref:ap-statistics-ced |
| terms | relation | definition_en | en | 10 | a relation from a set a to a set b | 2 | mit-notes, mit-6.042 |
| terms | relative-frequency | definition_en | en | 9 | divided by the total number of data values the | 1 | openstax-introstats |
| terms | remainder-theorem | examples[1].en | en | 9 | use the remainder theorem to find the remainder when | 3 | openstax-intalg, openstax-algtrig, openstax-precalculus |
| terms | restricted-domain | definition_en | en | 8 | a function that is not one to one | 2 | openstax-algtrig, openstax-precalculus |
| terms | restricted-domain | examples[1].en | en | 8 | find the inverse of f x x 2 | 2 | openstax-algtrig, openstax-precalculus |
| terms | revolve-around-the-x-axis | examples[1].en | en | 9 | the x axis find the volume of the solid | 1 | openstax-calculus |
| terms | revolve-around-the-x-axis | examples[0].en | en | 8 | take this region and rotate it around the | 1 | khan-ap-calc |
| terms | riemann-sum | definition_en | en | 8 | used to approximate the area under a curve | 1 | openstax-calculus |
| terms | right-hand-limit | definition_en | en | 8 | the limit of f x as x approaches | 4 | khan-ap-calc, openstax-calculus, openstax-precalculus, ref:ap-calculus-ab-bc-ced |
| terms | right-triangle | definition_en | en | 9 | the side opposite the right angle is the hypotenuse | 1 | ref:ck12-geometry |
| terms | right-triangle | definition_en | en | 9 | sides that form the right angle are the legs | 1 | ref:ck12-geometry |
| terms | right-triangle | examples[0].en | en | 8 | always the longest side of a right triangle | 1 | ref:im-6-8 |
| terms | rise-over-run | examples[1].en | en | 15 | use rise over run to find the slope of the line through the points 1 | 5 | openstax-elemalg, openstax-prealgebra, openstax-intalg, ref:ck12-geometry, openstax-calculus |
| terms | round | examples[1].en | en | 8 | and round your answer to the nearest hundredth | 1 | openstax-algtrig |
| terms | row-space | examples[1].en | en | 8 | a basis for the row space of the | 1 | mit-18.06 |
| terms | ruler-postulate | definition_en | en | 13 | that the distance between two points is the absolute value of the difference | 1 | ref:ck12-geometry |
| terms | ruler-postulate | examples[1].en | en | 8 | points a and b on a number line | 1 | openstax-calculus |
| terms | saddle-point | definition_en | en | 9 | is neither a local maximum nor a local minimum | 1 | openstax-calculus |
| terms | same-side-interior-angles | mapping_note | en | 9 | ck 12 geometry 3 7 same side interior angles | 1 | ref:ck12-geometry |
| terms | same-side-interior-angles | examples[0].en | en | 8 | same side interior angles add up to 180 | 1 | ref:ck12-geometry |
| terms | sample-mean | examples[1].en | en | 9 | construct a 95 confidence interval for the population mean | 2 | openstax-introstats, yt:profleonard |
| terms | sample-space | definition_en | en | 9 | the set of all possible outcomes of an experiment | 3 | openstax-algtrig, openstax-precalculus, openstax-introstats |
| terms | sas-congruence | definition_en | en | 17 | sides and the included angle of one triangle are congruent to two sides and the included angle | 2 | ref:im-9-12, ref:ck12-geometry |
| terms | scalar-triple-product | examples[1].en | en | 16 | the triple scalar product to find the volume of the parallelepiped determined by u v and | 2 | openstax-calculus, ref:nicholson-lawa-2021a |
| terms | scale-factor | definition_en | en | 10 | a scaled copy a scale factor greater than 1 enlarges | 1 | ref:im-9-12 |
| terms | scientific-notation | definition_en | en | 9 | way to write very large or very small numbers | 1 | ref:im-6-8 |
| terms | secant-line | definition_en | en | 9 | the average rate of change between the two points | 1 | openstax-precalculus |
| terms | second-derivative-test | definition_en | en | 9 | f has a local maximum at c if f | 1 | openstax-calculus |
| terms | sector | definition_en | en | 11 | of a circle bounded by two radii and the arc between | 3 | ref:ck12-geometry, openstax-algtrig, openstax-precalculus |
| terms | sequence | examples[1].en | en | 8 | write the first five terms of the sequence | 3 | openstax-intalg, openstax-algtrig, openstax-precalculus |
| terms | set | examples[0].en | en | 11 | the domain is the set of all real numbers except 2 | 4 | openstax-calculus, openstax-intalg, openstax-algtrig, openstax-precalculus |
| terms | set-builder-notation | definition_en | en | 12 | the set of all x such that x is greater than 2 | 3 | openstax-algtrig, openstax-precalculus, ref:levin-dmoi4 |
| terms | set-builder-notation | examples[0].en | en | 9 | all x such that x is greater than 2 | 1 | ref:levin-dmoi4 |
| terms | set-up-a-recurrence | examples[1].en | en | 9 | write a recursive formula for the arithmetic sequence 2 | 2 | openstax-algtrig, openstax-precalculus |
| terms | shell-method | definition_en | en | 9 | finding the volume of a solid of revolution by | 2 | openstax-calculus, mit-18.01 |
| terms | shortest-path | examples[1].en | en | 9 | the number of lattice paths from 0 0 to | 1 | ref:levin-dmoi4 |
| terms | side | examples[1].en | en | 9 | the side length of a square whose area is | 1 | ref:im-6-8 |
| terms | side-angle-inequality | mapping_note | en | 8 | 4 25 comparing angles and sides in triangles | 1 | ref:ck12-geometry |
| terms | side-angle-inequality | mapping_note | en | 8 | the largest angle is opposite the longest side | 1 | ref:ck12-geometry |
| terms | side-angle-inequality | definition_en | en | 8 | the largest angle is opposite the longest side | 1 | ref:ck12-geometry |
| terms | sign-chart | examples[1].en | en | 13 | by the first derivative test f has a local maximum at x 1 | 1 | openstax-calculus |
| terms | similarity-criteria | mapping_note | ja | 20 | 2組の辺の比とその間の角がそれぞれ等しい | 2 | jp:kaisetsu-chu, jp:wikipedia |
| terms | similarity-criteria | definition_ja | ja | 20 | 2組の辺の比とその間の角がそれぞれ等しい | 2 | jp:kaisetsu-chu, jp:wikipedia |
| terms | simplify | definition_en | en | 8 | by removing parentheses combining like terms or reducing | 1 | ref:ck12-algebra |
| terms | sine | definition_en | en | 8 | on the unit circle the y coordinate of | 1 | ref:im-9-12 |
| terms | skew-lines | mapping_note | en | 9 | ck 12 geometry 3 2 parallel and skew lines | 1 | ref:ck12-geometry |
| terms | slant-asymptote | definition_en | en | 15 | the degree of the numerator is exactly one more than the degree of the denominator | 2 | yt:patrickjmt, openstax-calculus |
| terms | slope | definition_en | en | 15 | the change in y divided by the change in x between any two points on | 4 | openstax-algtrig, openstax-precalculus, khan-ap-calc, yt:organicchem |
| terms | slope | examples[1].en | en | 8 | find the slope of the line passing through | 1 | openstax-calculus |
| terms | slope-formula | examples[1].en | en | 13 | use the slope formula to find the slope of the line passing through | 5 | openstax-elemalg, openstax-prealgebra, openstax-intalg, openstax-algtrig, openstax-calculus |
| terms | slope-intercept-form-of-a-line | definition_en | en | 11 | where m is the slope and b is the y intercept | 5 | khan-ap-calc, khan-middle, khan-algebra, ref:ck12-geometry, yt:organicchem |
| terms | slope-of-the-tangent-line | definition_en | en | 12 | the slope of the line tangent to a curve at a point | 2 | ref:ap-calculus-ab-bc-ced, openstax-calculus |
| terms | slope-of-the-tangent-line | examples[1].en | en | 9 | find the slope of the tangent line to y | 6 | openstax-calculus, khan-ap-calc, yt:profleonard, mit-notes, yt:blackpenredpen, mit-18.01 |
| terms | slope-of-the-tangent-line | examples[0].en | en | 8 | the slope of the tangent line at x | 1 | khan-ap-calc |
| terms | sohcahtoa | examples[1].en | en | 8 | the opposite side the adjacent side and the | 1 | yt:organicchem |
| terms | solid-of-revolution | examples[1].en | en | 8 | find the volume of the solid of revolution | 3 | openstax-calculus, mit-18.01, mit-notes |
| terms | solution-set | pitfalls[1] | en | 8 | the set of all x such that x | 3 | openstax-algtrig, openstax-precalculus, ref:levin-dmoi4 |
| terms | solve-the-recurrence | definition_en | en | 8 | find a formula for the nth term of | 1 | ref:levin-dmoi4 |
| terms | solving-by-graphing | definition_en | en | 8 | of solving a system of equations by graphing | 1 | openstax-intalg |
| terms | solving-by-graphing | pitfalls[2] | en | 8 | solve a system of linear equations by graphing | 4 | openstax-elemalg, openstax-intalg, openstax-algtrig, openstax-precalculus |
| terms | solving-by-taking-square-roots | examples[1].en | en | 10 | use the square root property to solve x 3 2 | 2 | openstax-algtrig, openstax-precalculus |
| terms | solving-by-taking-square-roots | mapping_note | en | 8 | solve quadratic equations using the square root property | 3 | openstax-elemalg, openstax-intalg, yt:organicchem |
| terms | solving-by-taking-square-roots | definition_en | en | 8 | to solve a quadratic equation of the form | 2 | openstax-intalg, openstax-elemalg |
| terms | space-diagonal | examples[1].en | en | 9 | the length of the diagonal of a rectangular prism | 1 | yt:organicchem |
| terms | spanning-tree | examples[1].en | en | 8 | find two different spanning trees of the graph | 1 | ref:levin-dmoi4 |
| terms | special-products | mapping_note | en | 8 | product of conjugates pattern a b a b | 1 | openstax-elemalg |
| terms | spherical-coordinates | examples[1].en | en | 13 | use spherical coordinates to find the volume of the solid inside the sphere | 1 | openstax-calculus |
| terms | square-matrix | definition_en | en | 8 | a matrix with the same number of rows | 1 | openstax-intalg |
| terms | square-of-a-binomial | definition_en | en | 11 | the middle term is twice the product of the two terms | 2 | openstax-algtrig, openstax-elemalg |
| terms | square-root-of-a-number | definition_en | en | 8 | square root of a is a number that | 1 | openstax-algtrig |
| terms | square-shape | definition_en | en | 8 | with four equal sides and four right angles | 1 | ref:ck12-geometry |
| terms | square-units | examples[1].en | en | 8 | 4 so the area of the rectangle is | 1 | ref:im-6-8 |
| terms | square-units | examples[2].en | en | 8 | find the area of the triangle with vertices | 1 | ref:nicholson-lawa-2021a |
| terms | standard-deviation | definition_en | en | 8 | spread in the same units as the data | 1 | openstax-introstats |
| terms | standard-deviation | examples[1].en | en | 8 | the mean and standard deviation of the data | 1 | ref:im-9-12 |
| terms | standard-form-of-a-line | definition_en | en | 9 | on the left and the constant on the right | 2 | openstax-prealgebra, openstax-elemalg |
| terms | standard-normal-distribution | definition_en | en | 9 | normal distribution with mean 0 and standard deviation 1 | 1 | ref:ap-statistics-ced |
| terms | standard-normal-table | mapping_note | en | 8 | area to the left of the z score | 1 | openstax-introstats |
| terms | stokes-theorem | examples[1].en | en | 8 | use stokes theorem to evaluate s curl f | 1 | openstax-calculus |
| terms | straight-angle | definition_en | en | 9 | point in opposite directions and form a straight line | 1 | ref:im-6-8 |
| terms | subset | definition_en | en | 9 | every element of a is also an element of | 1 | ref:levin-dmoi4 |
| terms | subset | definition_en | en | 8 | set a is a subset of a set | 1 | ref:levin-dmoi4 |
| terms | subtraction | definition_en | en | 11 | subtracting a number gives the same result as adding its opposite | 1 | ref:im-6-8 |
| terms | sum | definition_en | en | 8 | the result of adding two or more numbers | 1 | openstax-prealgebra |
| terms | sum-of-a-geometric-sequence | definition_en | en | 11 | the sum of the first n terms of a geometric sequence | 8 | openstax-algtrig, openstax-precalculus, openstax-intalg, ref:levin-dmoi4, khan-ap-calc, openstax-calculus ほか |
| terms | sum-of-an-arithmetic-sequence | definition_en | en | 12 | the sum of the first n terms of an arithmetic sequence the | 9 | openstax-algtrig, openstax-precalculus, openstax-intalg, ref:levin-dmoi4, khan-ap-calc, openstax-calculus ほか |
| terms | sum-of-the-interior-angles | examples[1].en | en | 10 | the sum of the interior angles of a polygon is | 4 | ref:ck12-geometry, ref:levin-dmoi4, khan-algebra, openstax-prealgebra |
| terms | summation-notation | pitfalls[1] | en | 8 | the sum from i equals one to n | 1 | khan-ap-calc |
| terms | surface-area | examples[1].en | en | 9 | the surface area of a rectangular prism that is | 1 | ref:im-6-8 |
| terms | surface-integral | examples[1].en | en | 10 | the plane x y z 1 in the first octant | 1 | openstax-calculus |
| terms | symmetric | examples[0].en | en | 12 | the graph of an even function is symmetric about the y axis | 3 | openstax-algtrig, openstax-precalculus, openstax-calculus |
| terms | system-of-inequalities | examples[2].en | en | 8 | and graph the solution on a number line | 1 | ref:im-6-8 |
| terms | system-of-linear-inequalities | definition_en | en | 9 | is the set of all points x y that | 3 | openstax-algtrig, openstax-precalculus, yt:3blue1brown |
| terms | system-of-three-equations | examples[1].en | en | 13 | solve the system of three equations in three variables x y z 2 | 2 | openstax-algtrig, openstax-precalculus |
| terms | take-the-average | pitfalls[1] | en | 8 | the average rate of change find the average | 1 | openstax-precalculus |
| terms | take-the-limit | examples[1].en | en | 8 | taking the limit of both sides as n | 1 | openstax-calculus |
| terms | take-the-log-of-both-sides | definition_en | en | 8 | to both sides of an equation or inequality | 1 | khan-middle |
| terms | take-the-log-of-both-sides | examples[0].en | en | 8 | take the natural log of both sides and | 1 | khan-ap-calc |
| terms | take-the-partial-derivative | examples[0].en | en | 8 | take the partial derivative with respect to y | 1 | yt:profleonard |
| terms | tangent-line | examples[1].en | en | 9 | find the equation of the tangent line to the | 3 | openstax-calculus, openstax-precalculus, khan-ap-calc |
| terms | tangent-plane | examples[1].en | en | 8 | find an equation of the tangent plane to | 1 | openstax-calculus |
| terms | tangent-problem | definition_en | en | 13 | finding the slope of the tangent line to a curve at a point | 2 | yt:profleonard, openstax-calculus |
| terms | tessellation | pitfalls[2] | en | 8 | grade 8 9 1 tessellations of the plane | 1 | ref:im-6-8 |
| terms | test-point | examples[1].en | en | 9 | choose a test point in each interval to determine | 1 | openstax-calculus |
| terms | the-limit-does-not-exist | examples[1].en | en | 8 | lim x 0 x x does not exist | 1 | openstax-calculus |
| terms | theorem | examples[1].en | en | 8 | the base angles of an isosceles triangle are | 2 | ref:im-9-12, ref:ck12-geometry |
| terms | three-perpendiculars-theorem | examples[1].en | en | 8 | the foot of the perpendicular from p to | 1 | ref:nicholson-lawa-2021a |
| terms | triangle-proportionality-theorem | definition_en | en | 9 | a line parallel to one side of a triangle | 1 | ref:im-9-12 |
| terms | trigonometric-function | definition_en | en | 9 | the coordinates of a point on the unit circle | 3 | openstax-precalculus, ref:im-9-12, openstax-algtrig |
| terms | trigonometric-function | examples[1].en | en | 8 | find the maximum and minimum values of the | 2 | openstax-calculus, ref:im-9-12 |
| terms | trigonometric-integrals | definition_ja | en | 11 | sin x dx cos x c cos x dx sin x | 1 | mit-notes |
| terms | trigonometric-ratio | definition_en | en | 8 | the coordinates of a point on a circle | 2 | openstax-algtrig, openstax-precalculus |
| terms | trinomial | examples[0].en | en | 9 | numbers that multiply to 6 and add to 5 | 2 | openstax-elemalg, yt:nancypi |
| terms | truth-value | pitfalls[1] | en | 9 | ck 12 geometry 2 9 and and or statements | 1 | ref:ck12-geometry |
| terms | truth-value | examples[1].en | en | 8 | determine whether each statement is true or false | 1 | ref:ck12-geometry |
| terms | turning-points | definition_en | en | 9 | from increasing to decreasing or from decreasing to increasing | 2 | khan-ap-calc, yt:profleonard |
| terms | type-ii-error | examples[1].en | en | 9 | the consequence of a type ii error in this | 1 | khan-ap-stats |
| terms | union | definition_en | en | 8 | the set of all elements that belong to | 2 | openstax-algtrig, openstax-precalculus |
| terms | union-of-events | examples[1].en | en | 8 | a card is drawn from a standard deck | 2 | openstax-algtrig, openstax-precalculus |
| terms | unit-circle | definition_en | en | 9 | the circle of radius 1 centered at the origin | 4 | mit-18.02, openstax-calculus, openstax-algtrig, openstax-precalculus |
| terms | unit-circle | examples[0].en | en | 8 | on the unit circle the x coordinate is | 1 | yt:patrickjmt |
| terms | unit-normal-vector | examples[1].en | en | 8 | unit normal vector n t for r t | 1 | openstax-calculus |
| terms | unit-tangent-vector | examples[1].en | en | 11 | find the unit tangent vector t t for r t 3 | 1 | openstax-calculus |
| terms | unit-vector | examples[1].en | en | 9 | find the unit vector in the direction of v | 3 | openstax-calculus, openstax-algtrig, openstax-precalculus |
| terms | variable-of-integration | examples[1].en | en | 8 | x does not change the value of the | 1 | openstax-algtrig |
| terms | vector-field | examples[1].en | en | 9 | sketch the vector field f x y y x | 1 | openstax-calculus |
| terms | vector-valued-function | examples[1].en | en | 8 | of the vector valued function r t t | 1 | openstax-calculus |
| terms | velocity | definition_en | en | 10 | the rate of change of position with respect to time | 1 | khan-ap-calc |
| terms | velocity-vector | examples[0].en | en | 8 | the velocity vector is tangent to the path | 2 | mit-18.02, openstax-calculus |
| terms | vertex-angle | examples[1].ja | ja | 20 | ∠Aの二等分線と辺BCとの交点をDとする | 1 | jp:exams/h30-hon-03 |
| terms | vertex-angle | definition_en | en | 13 | bisector of the vertex angle is also the perpendicular bisector of the base | 1 | ref:ck12-geometry |
| terms | vertical-line-test | examples[1].en | en | 8 | use the vertical line test to determine whether | 2 | openstax-calculus, khan-middle |
| terms | volume | definition_en | en | 8 | is measured in cubic units such as cubic | 1 | openstax-prealgebra |
| terms | volume-by-cross-sections | examples[0].en | en | 9 | cross sections perpendicular to the x axis are squares | 1 | khan-ap-calc |
| terms | volume-by-cross-sections | pitfalls[0] | en | 9 | cross sections perpendicular to the x axis are squares | 1 | khan-ap-calc |
| terms | washer-method | definition_en | en | 10 | finding the volume of a solid of revolution with a | 2 | openstax-calculus, mit-18.01 |
| terms | whisker | definition_en | en | 8 | from the ends of the box to the | 1 | openstax-introstats |
| terms | word-problem | examples[1].en | en | 10 | write an equation for each word problem and then solve | 1 | ref:ck12-algebra |
| terms | write-out-the-first-few-terms | examples[1].en | en | 9 | write out the first few terms of the sequence | 2 | ref:levin-dmoi4, openstax-intalg |
| terms | x-coordinate | definition_en | en | 9 | the first number in an ordered pair x y | 1 | openstax-elemalg |
| terms | x-intercept | examples[0].en | en | 9 | set y equal to zero and solve for x | 1 | openstax-algtrig |
| terms | y-coordinate | definition_en | en | 9 | the second number in an ordered pair x y | 1 | openstax-elemalg |
| terms | y-intercept | examples[0].en | en | 12 | the y intercept is where the line crosses the y axis so | 1 | openstax-elemalg |
| terms | y-intercept | examples[1].en | en | 8 | the slope and the y intercept of the | 1 | ref:im-9-12 |
| terms | zero-product-property | definition_en | en | 9 | if the product of two numbers is 0 then | 1 | ref:im-9-12 |
