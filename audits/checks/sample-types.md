# 公開前の抜き取り（Fable）で見つかった型の一覧

作成: 2026-10-09 ／ `python3 scripts/audit/sample_types.py`（規則は scripts/audit/sample_types.py の説明）。抜き取りの 100 項目で大きな直し・不合格が 8（閾値 3 を超えた）だったので、その型と、小さな直しで 3 回出た型（T6）を全エントリで探した。どの行も手がかりで、誤りとは限らない。次のセッションが 1 行ずつ資料で読んで直し、それから公開する（audits/2026-10-09-sample-fable.md の J）。

## T1a. mapping exact で、エントリ自身の文が日本語と英語の範囲の違いを書いている

- 行: **28**（verified 20・likely 8）。抜き取りで見つけた例: expression（「式」は等式・不等式も指す）・trigonometric-ratio（三角比は鈍角まで）。範囲が違うなら mapping near（CLAUDE.md 規則 5。兄弟の equation・algebraic-expression は near）。言い方だけの注意なら exact のまま

| id | confidence | 欄 | 文 |
|---|---|---|---|
| alternate-interior-angles | verified | pitfalls[0] | 英語では外側の組 alternate exterior angles（エントリ alternate-exterior-angles）と区別するため interior を付ける。 |
| check | verified | pitfalls[0] | check は「チェックマークを付ける」「点検する」など意味が広い。 |
| circle | verified | pitfalls[0] | 英語の circle は周の曲線だけを指し、内部を含む「円板」は disk（エントリ disk）。 |
| differentiation | verified | pitfalls[0] | 日本語の「微分」は操作（differentiation）も結果の関数（derivative）も指す。 |
| discontinuous | verified | pitfalls[0] | 不連続の種類は、英語では removable（除去可能）・jump（跳躍）・infinite（無限）と名前で呼び分ける。 |
| edge | verified | pitfalls[0] | 英語では、多角形の辺は side（エントリ side）、立体の辺は edge と言い分ける。 |
| exterior-angle | verified | definition_en | The angle formed outside a polygon by one side and the extension of the side next to it. At each vertex, the interior angle and the exterior angle add up to 180… |
| infinite-geometric-sequence | verified | pitfalls[0] | 英語では sequence（数列）と series（級数）を区別する。 |
| integration | verified | pitfalls[0] | 日本語の「積分」は操作にも式にも使うが、英語では操作は integration、∫ で書かれた式そのものは an integral と言い分ける（take the integral ／ this integral diverges）。 |
| line | verified | pitfalls[0] | 英語の line は両方向に限りなくのびる直線だけを指す。 |
| line | verified | pitfalls[2] | 日本語の「線」は曲線も含むが、英語の line はまっすぐな線。 |
| phase-shift | verified | pitfalls[3] | Algebra and Trigonometry の phase shift C/B はずれの量そのもので、数の意味が違う。 |
| point-of-intersection | verified | pitfalls[1] | 英語では接する場合も point of intersection と言うか、the graph touches the x-axis（x 軸に接する）と言い分ける。 |
| square-root-of-a-number | verified | pitfalls[3] | 英語の the square root of 49 は √49 = 7 だけを指す。 |
| supplementary-angle | verified | definition_en | Two angles are supplementary when their measures add up to 180°; the supplement of an angle θ is 180° − θ. |
| triangle | verified | definition_en | A polygon with three sides, formed by joining three points that do not lie on one line; its three interior angles add up to 180°. |
| triangle-inequality | verified | pitfalls[0] | 英語の triangle inequality は \|a + b\| ≦ \|a\| + \|b\| と三角形の辺の不等式だけ。 |
| unit-circle | verified | pitfalls[0] | 高等学校学習指導要領解説（数学I 図形と計量）は単位円を使わず、座標平面の第 1 象限で原点を端点とする長さ α の線分 OP と点 P の座標 (α cos θ, α sin θ) で三角比を鈍角まで拡張する。 |
| vertex | verified | pitfalls[1] | グラフ理論（点と辺のグラフ）の頂点も vertex だが、意味が違うので別のエントリ（頂点（グラフ））にした。 |
| x-intercept | verified | pitfalls[0] | 日本語の「交点」は点 (3, 0) で答えるが、英語の x-intercept は x 座標の 3 だけを指すこともある。 |
| dynamical-system | likely | pitfalls[0] | 日本語の「力学系」は微分方程式で表す連続の系も含む。 |
| gradient | likely | pitfalls[1] | 日本語の「勾配」は直線の傾き（slope）の意味でも使うが、英語の gradient は多変数の勾配ベクトルを指す。 |
| identity-matrix | likely | definition_en | The square matrix with 1s on the main diagonal and 0s elsewhere, written E in Japanese textbooks and I in US ones. |
| minor-arc | likely | pitfalls[0] | 英語では 2 文字の arc AB が劣弧を指し、優弧は 3 文字（arc ACB）で書いて区別する。 |
| proof-by-cases | likely | pitfalls[1] | 日本語の「場合分け」は証明だけでなく、絶対値を外す計算や不等式の解法にも使うが、この見出しは証明の方法の名前。 |
| quantifier | likely | pitfalls[1] | ∀x ∃y と ∃y ∀x は意味が違う。 |
| tautology | likely | pitfalls[0] | 日常英語の tautology は「同じことを言い換えて繰り返すだけの言い方（同語反復）」の意味で使う。 |
| treatment | likely | pitfalls[0] | 日本語の「処理」はデータの処理の意味でも使うが、英語の treatment は実験の処理（与える条件）。 |

## T1b. mapping none の語（日本語の名前が日本側の資料にあるか）

- mapping none の terms: **37**（verified 16・likely 21）、うち日本語の名前が日本側の資料（解説・試験・取得済みの日本語版 Wikipedia）にあるか mapping_note が名前を挙げる行 **20**（verified 13・likely 7）。抜き取りで見つけた例: disk-method（日本語版 Wikipedia「回転体」の円板法。shell-method のバウムクーヘン積分と同じ型で near）。方法そのものが日本の高校にあり名前だけが解説に無いなら near、日本の名前も方法も無い（washer-method の型）なら none のまま

| id | confidence |  | 日本語の名前と日本側の資料の件数 |
|---|---|---|---|
| area-preserving-transformation | verified |  | 等積変形 0 |
| auxiliary-angle-form | verified | 読む | 三角関数の合成 13 |
| candidates-test | verified | 読む | 候補点テスト 0 |
| circle-through-the-intersections-of-two-circles | verified | 読む | 2 円の交点を通る円 0、Pencil (geometry) 0 |
| comparison-for-divergence | verified | 読む | 追い出しの原理 2、はさみうちの原理 14 |
| cross-method | verified | 読む | たすき掛け 0、たすきがけ 9、因数分解 260 |
| grouped-sequence | verified | 読む | 群数列 1、数学 (教科) 2 |
| liate | verified |  | LIATE 0 |
| net-change | verified | 読む | 純変化量 0、純変化定理 0、累積 44、位置の変化 5、道のり 4 |
| one-sixth-formula | verified | 読む | 1/6 公式 5、1/6公式 5 |
| rate | verified | 読む | 割合 230、比べる量 ÷ もとにする量 0 |
| sign-chart | verified |  | 増減表 0 |
| surplus-and-shortage | verified | 読む | 過不足 0、余る 2、足りない 4 |
| system-of-recurrences | verified | 読む | 連立漸化式 6 |
| three-perpendiculars-theorem | verified | 読む | 三垂線の定理 1 |
| washer-method | verified | 読む | ワッシャー法 0、外側の回転体から内側の回転体を引く 0 |
| angle-addition-postulate | likely | 読む | 角の加法公理 0 |
| coordinate-rule | likely | 読む | 座標の規則 0 |
| coterminal-angle | likely |  | 共終角 0 |
| cpctc | likely |  | CPCTC 0、合同な三角形の対応する部分は等しい 0、合同な図形の対応する辺（角）は等しい 0 |
| end-behavior | likely |  | 関数の終端挙動 0、終端挙動 0 |
| flowchart-proof | likely |  | フローチャート証明 0 |
| foil | likely |  | FOIL 0 |
| horizontal-line-test | likely |  | 水平線テスト 0、単調増加（減少）なら逆関数がある 0 |
| joint-variation | likely |  | 結合変化 0、z は x と y の積に比例する 0 |
| literal-equation | likely | 読む | リテラル方程式 0、等式の変形 2 |
| midline | likely |  | 振動の中心線 0、中央線 0、y 軸方向に 1 平行移動したもの 0 |
| paragraph-proof | likely | 読む | 段落証明 0 |
| parent-function | likely |  | 親関数 0、y = x² のグラフを平行移動したもの 0 |
| pemdas | likely |  | PEMDAS 0 |
| perpendicular-postulate | likely |  | 垂線の公準 0、直線外の 1 点を通る垂線はただ 1 本 0 |
| rise-over-run | likely |  | 上昇分と水平移動分の比 0、y の増加量 ÷ x の増加量 0 |
| ruler-postulate | likely |  | 数直線上の距離 0 |
| segment-addition-postulate | likely | 読む | 線分の加法公理 0 |
| sohcahtoa | likely | 読む | SOHCAHTOA 0、三角関数の暗記方法 1 |
| two-column-proof | likely | 読む | 二段組みの証明 0、statements（主張） 0、reasons（理由） 0 |
| vertical-line-test | likely |  | 垂直線テスト 0 |

## T2. 定義の日本語に、定義の英文が言わない限定がある

- 行: **28**（verified 20・likely 8）。抜き取りで見つけた例: right-riemann-sum・left-riemann-sum（「区間を等分した」。CED topic 6.2 は nonuniform partitions も認める）。英語の見出しの意味（参照の定義）より狭いなら定義の日本語を直す（定義の意味の変更は大きな直し）

| id | confidence | 語 | definition_ja | definition_en |
|---|---|---|---|---|
| change-of-base-formula | verified | 正の数 | log_a b = log_c b / log_c a（a, c は 1 でない正の数、b > 0）。底の違う対数を同じ底にそろえる。 | log_a b = log_c b / log_c a (a, c > 0, a ≠ 1, c ≠ 1, b > 0), used to rewrite logarithms with a common base. |
| checking-whether-the-solution-makes-sense | verified | 自然数 | 文章題で求めた方程式の解が、問題の条件（個数や人数は自然数、長さは正の数など）に合っているかを確かめること。合わない解は問題の答えにしない。 | Checking whether a solution of the equation fits the situation in the word problem, for example that a number… |
| classification-by-remainder | verified | 自然数 | 整数を、ある自然数 m で割ったときの余り 0, 1, …, m − 1 によって m 個の組に分けること。整数の性質を場合分けで証明するときに使う。 | Sorting the integers into m groups by the remainder 0, 1, …, m − 1 they leave when divided by m, so that a… |
| decreasing | verified | 必ず | x が増えると、関数の値が必ず減る。1 次関数ではグラフが右下がりになること（傾きが負）。 | Of a function: its value goes down whenever x goes up; for a linear function, the graph falls from left to… |
| divisibility-rules | verified | だけを | 実際に割り算をせずに、各位の数字の和や下の何桁かだけを見て、ある整数が 3・4・9 などの倍数かどうかを見分ける方法。 | A shortcut for deciding whether an integer is divisible by a number such as 3, 4, or 9 by looking at its… |
| is-monotonically-increasing | verified | 必ず | x が増えると、関数の値も必ず増える。 | Of a function: to rise as x increases, over an interval. |
| natural-number | verified | 正の整数 | 1, 2, 3, … のように、ものを数えるときに使う数。正の整数と同じで、0 を含まない。 | A counting number: 1, 2, 3, and so on. Some books, especially in college math, also count 0 as a natural… |
| polyhedron | verified | だけで | 平面の多角形だけで囲まれた立体。囲んでいる多角形を面、面と面が交わる線分を辺、辺が集まる点を頂点という。 | A solid whose surface is made up entirely of flat polygons. The polygons are its faces, the segments where… |
| prime-factor | verified | 自然数 | ある自然数の約数のうち、素数であるもの。たとえば 12 = 2 × 2 × 3 なので、12 の素因数は 2 と 3。 | A factor of a whole number that is also a prime number. For example, 12 = 2 × 2 × 3, so the prime factors of 1… |
| prime-factorization | verified | 自然数 | 自然数を素数だけの積の形に表すこと。また、その積の形。1 より大きい自然数では、積の順番を除いてただ 1 通りに決まる。 | Writing a whole number as a product of prime numbers, or the product itself; for any whole number greater… |
| prime-factorization | verified | だけの | 自然数を素数だけの積の形に表すこと。また、その積の形。1 より大きい自然数では、積の順番を除いてただ 1 通りに決まる。 | Writing a whole number as a product of prime numbers, or the product itself; for any whole number greater… |
| prime-number | verified | 自然数 | 2 以上の自然数のうち、1 とその数自身のほかに正の約数をもたないもの。1 は素数ではない。 | A whole number greater than 1 whose only positive factors are 1 and itself. The number 1 is not prime. |
| restricted-domain | verified | に限る | 関数の定義域を一部に限ること。1 対 1 でない関数に逆関数を考えるときなどに使う。 | Cutting a function's domain down to part of it, for instance so that a function which fails the horizontal… |
| scale | verified | だけの | 地図や縮図で、実際の長さをどれだけの割合に縮めて表したかを示すもの。1 : 25000 のような比で書く。 | On a map or a scale drawing, the relationship between lengths in the drawing and the actual lengths they… |
| simplify-radicals | verified | 自然数 | 根号の中の数から平方因数を外に出し、根号の中をできるだけ小さい自然数にする。根号を含む式では、そのうえで同じ根号の項をまとめる。 | To pull square factors out from under a radical so that the number left inside is as small as possible, then… |
| square-root-of-a-number | verified | 正の数 | 2 乗すると a になる数を、a の平方根という。正の数 a の平方根は正と負の 2 つあり、まとめて ±√a と表す。 | Either of the numbers that give a when squared. For a > 0 there are exactly two of them, √a and −√a. |
| subset | verified | だけで | 集合 B の要素だけでできている集合 A のこと。A のどの要素も B の要素であるとき、A を B の部分集合という。 | A set A is a subset of a set B when nothing in A lies outside B: each member of A belongs to B as well. |
| sufficient-condition | verified | 必ず | 「p ならば q」が真のとき、p を q であるための十分条件という。p が成り立てば q も必ず成り立つ。 | If "if p, then q" is true, p is a sufficient condition for q: whenever p holds, q holds as well. |
| x-coordinate | verified | だけの | 点の座標 (x, y) の 1 つ目の数。点が原点から右（正）または左（負）にどれだけの位置にあるかを表す。 | In an ordered pair (x, y), the number written first. It tells how far right (positive) or left (negative) of… |
| y-coordinate | verified | だけの | 点の座標 (x, y) の 2 つ目の数。点が原点から上（正）または下（負）にどれだけの位置にあるかを表す。 | In an ordered pair (x, y), the number written second. It tells how far above (positive) or below (negative)… |
| convenience-sample | likely | だけを | 調べやすい人や物だけを選んで標本にする方法。偏りが生じやすい。 | A sample made of the individuals that are easiest to reach; it is likely to be biased. |
| existence-proof | likely | だけを | ある条件を満たすものが少なくとも 1 つ存在することを示す証明のこと。実際に例を作って示す方法（構成的）と、例を作らずに存在だけを示す方法（非構成的）がある。 | A proof that at least one object with a given property exists. It can be constructive, by giving an example,… |
| graph-coloring | likely | 必ず | グラフの各頂点に色を割り当て、辺で結ばれた 2 頂点が必ず異なる色になるようにすること。必要な色の最小の個数を彩色数という。 | An assignment of colors to the vertices of a graph so that any two vertices joined by an edge get different… |
| partial-derivative | likely | だけに | 多変数関数を 1 つの変数だけについて微分し、ほかの変数は定数とみなしたもの。 | The derivative of a function of several variables with respect to one variable, holding the others constant. |
| quantifier | likely | だけの | 述語の変数について、「すべての x について」「ある x について」のように、どれだけの値で成り立つかを指定する語や記号のこと。∀ と ∃ がある。 | A word or symbol, such as "for all" (∀) or "there exists" (∃), that tells for how many values of a variable a… |
| row-echelon-form | likely | だけの | 各行の最初の 0 でない成分（先頭の 1）が、下の行ほど右にある形の行列。0 だけの行は下にまとめる。 | The form of a matrix in which each row's first nonzero entry (the leading 1) lies to the right of the one… |
| scalar | likely | だけで | ベクトルに対して、向きをもたず大きさだけで表される量。ふつうの実数。 | A quantity described by a single number, with no direction, as opposed to a vector; an ordinary real number. |
| strong-induction | likely | だけで | 数学的帰納法の一種で、n = 1, 2, …, k のすべてで成り立つと仮定して、n = k + 1 でも成り立つことを示す証明法。直前の 1 つだけでなく、それより前のすべての場… | A form of induction in which you assume the statement holds for every case from the base case up to k, and… |

## T3. ③ で参照が決めた見出しの根拠が、すべて参照の別の名前（題）の一部

- 行: **0**（verified 0・likely 0）。抜き取りで見つけた例: derivative-of-a-parametric-curve（CED の derivatives of parametric equations は 2 件とも topic 9.2 の題 Second Derivatives of Parametric Equations の一部。直した後は 0 行）。`pnpm corpus:probe -- --contexts "<見出し>"` の参を読み、別の概念なら TERM_FORMS の「!w」で除いて数え直す（監査 6 の決定 9）

| id | confidence | 見出し | 参照 | 件数 | 前の語 |
|---|---|---|---|---|---|

## T4. 記号の読みの形「X of *」が、逆関数ほかの読み（inverse X of ／ arc X of …）も数えている

- 行: **4**（verified 4・likely 0）。抜き取りで見つけた例: tangent-of-theta（inverse tangent of x・arc tangent of x を数え、除くと 1 つ目の読みが tangent theta に入れ替わった。sine・cosine は除いても並びは変わらない）。件数は話し言葉のコーパスの生の数（形の数え方とは違う）。除いて並びが変わりうる行は `pnpm exec tsx scripts/audit/symctx.ts "!the !inverse !arc X of *"` で数え直す

| id | confidence | 形 | 件数 | 別の読み | その件数 | ほかの形の件数 |
|---|---|---|---|---|---|---|
| cosine-of-theta | verified | !the !inverse !arc cosine of * | 993 | hyperbolic cosine of | 4 | cosine theta \| cosine x \| cosine alpha \| cosine two x 594、the cosine of * 144 |
| cosine-of-theta | verified | !the !inverse !arc cosine of * | 993 | third cosine of | 1 | cosine theta \| cosine x \| cosine alpha \| cosine two x 594、the cosine of * 144 |
| sine-of-theta | verified | !the !inverse !arc sine of * | 931 | hyperbolic sine of | 1 | sine theta \| sine x \| sine alpha \| sine two x 418、the sine of * 126 |
| sine-of-theta | verified | !the !inverse !arc sine of * | 931 | second sine of | 1 | sine theta \| sine x \| sine alpha \| sine two x 418、the sine of * 126 |

## T5. likely の根拠が Math Stack Exchange だけのフレーズ（MICASE の学生の発話は 3 件未満）

- フレーズ: **46**（verified 45・likely 1）、うち DECISIONS に抜粋を読んだ記録が見当たらないもの **38**（verified 38・likely 0）。抜き取りで見つけた例: class-asking-another-example（do another example は質問者が自分で例を挙げる文）・office-hours-do-you-have-a-minute（have a minute 3 件のうち頼む文は 2 件）。内蔵ブラウザで `https://math.stackexchange.com/search?q=%22<要の部分>%22+is%3Aquestion` の抜粋（と質問の本文）を読み、意図を運ぶ文が 3 件に届かなければ MSE_SKIP と監査 13 の前の決定 1（MICASE に 3 件なければ人間レビュー）

| id | confidence | 抜粋 | en | flag の note（MSE の部分） |
|---|---|---|---|---|
| class-asking-calculator-on-the-test | verified | 読む | Can we use a calculator on the test? | 最も多い要の部分 use a calculator \| use calculators \| use our calculators \| bring a calculator \| bring calculators（248 件。3 件以上）なので使われている。en の要の部分… |
| class-asking-can-i-write-it-this-way | verified | 記録あり | Is it okay if I write it like this? | 最も多い要の部分 can i just write \| can i write it as \| can i write this as（126 件。3 件以上）なので使われている。en の要の部分 okay if i write !on \| ok if i write !on \|… |
| class-asking-do-we-need-to-memorize | verified | 読む | Do we need to memorize this formula? | 最も多い要の部分 formula sheet \| equation sheet \| cheat sheet \| note card \| index card（79 件。3 件以上）なので使われている。en の要の部分 do we need to memorize \| do we… |
| class-asking-how-do-you-read-this | verified | 読む | How do you say this symbol? | 最も多い要の部分 how do you say（21 件。3 件以上）なので使われている。en の要の部分 how do you say も 21 件（3 件以上）なので en のまま。register は主張しない。 |
| class-asking-i-got-a-different-answer | verified | 読む | I got a different answer. | 最も多い要の部分 did i do something wrong \| what did i do wrong \| where did i go wrong \| what am i doing wrong（8141 件。3 件以上）なので使われている。en の要の部分 got… |
| class-asking-is-there-an-easier-way | verified | 読む | Is there an easier way to do this? | 最も多い要の部分 easier way \| simpler way \| quicker way \| faster way（7163 件。3 件以上）なので使われている。en の要の部分 easier way \| simpler way \| quicker way \|… |
| class-asking-simplify-further | verified | 読む | Do we need to simplify this further? | 最も多い要の部分 simplify further \| simplify it further \| simplify this further \| simplify it more \| simplify any further \| simplify that further \|… |
| class-asking-when-is-it-due | verified | 読む | When is this due? | 最も多い要の部分 due on friday \| due friday \| due on monday \| due monday \| due next week（9 件。3 件以上）なので使われている。en の要の部分 when is it due \| when is that… |
| discord-anyone-get | verified | 記録あり | Did anyone get #3? |  anyone figure out \| anyone figured out が 43 件（3 件以上）なので likely。en の要の部分 did anyone get \| has anyone gotten は 2 件。en は Math Stack Exchange で… |
| discord-can-someone-explain | verified | 読む | Can someone explain why the limit is 0 here? |  can someone explain \| could someone explain が 10187 件（3 件以上）なので likely。en の要の部分 can someone explain \| could someone explain も 10187 件（3 件以上… |
| discord-here-is-my-work | verified | 読む | Here's my work so far — where did I go wrong? |  where did i go wrong が 2305 件（3 件以上）なので likely。en の要の部分 here's my work \| here is my work も 1105 件（3 件以上）なので en のまま。 |
| discord-hint-no-spoilers | verified | 記録あり | Can someone give me a hint? No full solutions pls. |  a hint \| any hints \| no full solutions が 35939 件（3 件以上）なので likely。en の要の部分 a hint \| any hints \| no full solutions も 35939 件（3 件以上）なので en のま… |
| discord-right-channel | verified | 読む | Is this the right channel for calc questions? |  right place to ask が 159 件（3 件以上）なので likely。en の要の部分 right channel は Math Stack Exchange で検索しない。en は Math Stack Exchange では選ばない。 |
| discord-same-answer | verified | 記録あり | Same, I got 12 too. |  i got the same \| got the same answer が 285 件（3 件以上）なので likely。en の要の部分 （数えない） は Math Stack Exchange で検索しない。en は Math Stack Exchange では選ばない。 |
| discord-typo-in-the-pset | verified | 読む | I think there's a typo in #5 on the pset. |  a typo in \| typo in the が 1176 件（3 件以上）なので likely。en の要の部分 a typo in \| typo in the も 1176 件（3 件以上）なので en のまま。 |
| email-attached | verified | 読む | I've attached my work as a PDF. |  i've attached \| i have attached が 719 件（3 件以上）なので likely。en の要の部分 i've attached \| i have attached も 719 件（3 件以上）なので en のまま。 |
| email-confirm | verified | 読む | Could you confirm whether the quiz on Friday covers Section 4.3? |  could you confirm \| can you confirm が 256 件（3 件以上）なので likely。en の要の部分 could you confirm \| can you confirm も 256 件（3 件以上）なので en のまま。 |
| email-describe-where-stuck | verified | 読む | For problem 3, I got as far as setting up the integral, but I'm not sure how to handle the absolute value. |  not sure how to が 33258 件（3 件以上）なので likely。en の要の部分 not sure how to も 33258 件（3 件以上）なので en のまま。 |
| email-dictionary-during-exam | verified | 読む | English is not my first language. Would it be possible for me to use a paper bilingual dictionary during the exam? |  my first language \| my native language が 665 件（3 件以上）なので likely。en の要の部分 my first language \| my native language も 665 件（3 件以上）なので en のまま。 |
| email-follow-up | verified | 読む | I just wanted to follow up on my email from last week. |  follow up on \| following up on が 194 件（3 件以上）なので likely。en の要の部分 follow up on \| following up on も 194 件（3 件以上）なので en のまま。 |
| email-missed-class | verified | 読む | I'm sorry I had to miss class on Wednesday. Is there anything I should do to catch up? |  catch up on が 25 件（3 件以上）なので likely。en の要の部分 miss class は 0 件。en は Math Stack Exchange では選ばない。 |
| email-regrade-request | verified | 記録あり | I'd like to ask about the grading on problem 2 of the midterm. I've attached a scan of my work. |  another look \| regrade \| re-grade \| look at it again \| look at this again \| graded wrong \| graded incorrectly \| grading was wrong \|… |
| email-sign-off | verified | 読む | Best, Taro Yamada |  best regards \| kind regards が 1683 件（3 件以上）なので likely。en の要の部分 （数えない） は Math Stack Exchange で検索しない。en は Math Stack Exchange では選ばない。 |
| email-thank-you-for-your-time | verified | 読む | Thank you for your time. |  thanks in advance \| thank you in advance が 68661 件（3 件以上）なので likely。en の要の部分 thank you for your time \| thanks for your time も 3724 件（3 件以上）… |
| exam-when-do-we-get-it-back | verified | 読む | When will we get the exams back? | 最も多い要の部分 exam back \| test back（22 件。3 件以上）なので使われている。en の要の部分 exam back \| test back も 22 件（3 件以上）なので en のまま。register は主張しない。 |
| group-study-answer-key-wrong | verified | 読む | I think the answer key might be wrong. | 最も多い要の部分 the answer key（1150 件。3 件以上）なので使われている。en の要の部分 the answer key も 1150 件（3 件以上）なので en のまま。register は主張しない。 |
| group-study-ask-the-ta | verified | 読む | Should we ask the TA? | 最も多い要の部分 ask at office hours \| go to office hours（4 件。3 件以上）なので使われている。en の要の部分 ask the ta は 2 件。en は Math Stack Exchange では選ばない。register は主張… |
| group-study-not-sure-but | verified | 読む | I'm not sure, but I think it's 4. | 最も多い要の部分 not sure but（467 件。3 件以上）なので使われている。en の要の部分 not sure but も 467 件（3 件以上）なので en のまま。register は主張しない。 |
| group-study-practice-exam | verified | 読む | Let's do the practice exam under timed conditions. | 最も多い要の部分 let's do the practice \| let's take the practice \| let's do a practice \| under timed conditions（3 件。3 件以上）なので使われている。en の要の部分 let's… |
| group-study-what-is-it-asking | verified | 読む | What is this question even asking? | 最も多い要の部分 what is it asking \| what's it asking \| what is this question asking \| what is this question even asking \| what is it even asking（53… |
| group-study-where-do-we-start | verified | 読む | Where do we even start with this one? | 最も多い要の部分 !have !has any ideas（15320 件。3 件以上）なので使われている。en の要の部分 where do we start \| where do i start \| where to start \| where do we even… |
| group-study-you-dropped-a-sign | verified | 読む | I think you dropped a negative sign. | 最も多い要の部分 dropped a negative \| dropped a sign \| dropped the negative \| forgot the negative \| forgot a negative（7 件。3 件以上）なので使われている。en の要の部分… |
| office-hours-am-i-on-the-right-track | verified | 読む | Am I on the right track? | 最も多い要の部分 on the right track \| in the right direction \| right direction（4350 件。3 件以上）なので使われている。en の要の部分 on the right track \| in the right… |
| office-hours-can-i-come-back | verified | 読む | Can I come back if I get stuck again? | 最も多い要の部分 can i come back \| could i come back \| if i come back \| come back later \| come back tomorrow \| come back next week \| stop by again \|… |
| office-hours-can-i-show-you-what-i-tried | verified | 読む | Can I show you what I tried? | 最も多い要の部分 what i have so far \| what i've got so far \| what i got so far \| so far i have \| so far i've（12929 件。3 件以上）なので使われている。en の要の部分 show… |
| office-hours-english-terms-are-new | verified | 読む | I learned this in Japanese, so I'm still getting used to the English terms. | 最も多い要の部分 the english terms \| english terms \| used to the english（43 件。3 件以上）なので使われている。en の要の部分 the english terms \| english terms \| used to… |
| office-hours-extra-practice | verified | 記録あり | Do you have any old exams I could practice with? | 最も多い要の部分 any practice problems \| any extra problems \| more practice problems \| extra practice problems \| any extra practice（14 件。3 件以上）なので使わ… |
| office-hours-hint-not-the-answer | verified | 読む | Could you give me a hint instead of the answer? | 最も多い要の部分 a hint \| any hints \| a little hint \| some hints（42142 件。3 件以上）なので使われている。en の要の部分 a hint \| any hints \| a little hint \| some hints も… |
| office-hours-intuition | verified | 読む | I can follow the algebra, but I don't get the intuition behind it. | 最も多い要の部分 the intuition behind \| intuition behind \| the intuition for \| don't get the intuition（6203 件。3 件以上）なので使われている。en の要の部分 the… |
| office-hours-is-this-rigorous-enough | verified | 読む | Could you look over my proof and tell me if it's rigorous enough? | 最も多い要の部分 look over my \| look at my proof \| check my proof \| check my work \| get it looked over（1472 件。3 件以上）なので使われている。en の要の部分 look over my… |
| office-hours-regrade | verified | 記録あり | I think this might have been graded incorrectly. Could you take another look? | 最も多い要の部分 another look \| regrade \| re-grade \| look at it again \| look at this again \| graded wrong \| graded incorrectly \| grading was wrong \|… |
| office-hours-thanks-that-helps | verified | 読む | Thanks, that really helps. | 最も多い要の部分 that really helps \| that helps a lot \| that helped a lot \| that's helpful !to \| that was helpful \| that's very helpful \| that was… |
| office-hours-understand-in-class-not-alone | verified | 読む | I understand it in class, but I get stuck when I try it on my own. | 最も多い要の部分 get stuck \| got stuck \| i'm stuck \| i was stuck \| i get lost \| i got lost（33579 件。3 件以上）なので使われている。en の要の部分 get stuck \| got stuck \|… |
| office-hours-when-to-use-which | verified | 読む | How do I know which method to use? | 最も多い要の部分 which method \| which one to use \| which formula to use \| which equation to use（867 件。3 件以上）なので使われている。en の要の部分 which method \| which… |
| office-hours-why-did-i-lose-points | verified | 読む | I'm not sure why I lost points here. | 最も多い要の部分 what was wrong with my \| what's wrong with my \| what i did wrong（1614 件。3 件以上）なので使われている。en の要の部分 why i lost points \| lost points… |
| office-hours-do-you-have-a-minute | likely | 記録あり | Do you have a minute? | 最も多い要の部分 have a minute \| have a second \| got a minute \| got a second \| have a sec（3 件。3 件以上）なので使われている。en の要の部分 have a minute \| have a… |

## T6. 日本側の手元の資料に 0 件の ja.alt（小さな直しの型）

- 行: **196**（verified 97・likely 98）。抜き取りで見つけた例: local-maximum の「相対最大値」（日本語版 Wikipedia「最大と最小」は「相対的最大値」）、derivative-of-a-parametric-curve の「媒介変数曲線の微分」、limit-of-a-riemann-sum の「定積分と和の極限」、coin の「表（硬貨）」（硬貨の言い換えではない）。手元に無い記事は `python3 scripts/audit/jawiki.py --search <語>` で確かめてから、資料の言い方にするか外す（監査 7 の前の決定 4。言い換えでない台帳の統合の名残も外す）

| id | confidence | ja.alt |
|---|---|---|
| 30-60-90-triangle | verified | 30-60-90 の三角形 |
| 45-45-90-triangle | verified | 45°, 45°, 90° の三角形 |
| aa-similarity | verified | AA 相似 |
| absolute-extrema | verified | 絶対極値 |
| absolute-value-equation | verified | 絶対値方程式 |
| accumulation-function | verified | 累積関数 |
| accumulation-function | verified | 積分で定義された関数 |
| area-between-two-curves | verified | 曲線間の面積 |
| area-between-two-curves | verified | 曲線で囲まれた面積 |
| area-between-two-curves | verified | 放物線と直線で囲まれた面積 |
| ascending-order | verified | 昇冪の順 |
| be-skewed | verified | 右に歪んだ |
| be-skewed | verified | 分布が偏る |
| change-together | verified | y が x に伴って変わる |
| check | verified | 解の確かめ |
| checking-whether-the-solution-makes-sense | verified | 解の吟味をする |
| clear-the-denominators | verified | 係数を整数にする |
| collinear | verified | 共線の点 |
| combine-like-terms | verified | 同類項をまとめる計算 |
| compare | verified | 大小を比較する |
| compare-coefficients | verified | 係数を比べる |
| compare-coefficients | verified | 係数比較法 |
| concyclic | verified | 4 点が同一円周上にある |
| conditional-statement | verified | 「p ならば q」の形の命題 |
| congruence-modulo-n | verified | 〜を法として合同 |
| constant-of-integration | verified | プラス C |
| cross-multiply | verified | 内項の積 |
| cross-multiply | verified | 外項の積 |
| derivative-of-the-logarithm | verified | ln x の導関数 |
| difference-of-squares | verified | 二乗の差 |
| differentiate-both-sides | verified | 両辺を x で微分する |
| direct-proportion | verified | 〜に比例する |
| distribute | verified | 分配して展開する |
| dividend | verified | 割られる数 |
| epsilon-delta-definition | verified | 極限の厳密な定義 |
| exponential-model | verified | 指数増加・減衰のモデル |
| first-derivative-test | verified | 第 1 次導関数テスト |
| first-order-linear-differential-equation | verified | 線形一階微分方程式 |
| frequency-polygon | verified | 度数分布多角形 |
| function-notation | verified | 関数記法 |
| greater-than | verified | 〜を超える |
| indirect-measurement | verified | 間接測定 |
| infinitely-many-solutions | verified | 従属な連立方程式 |
| inscribed-angle | verified | 内接角 |
| integrals-of-even-and-odd-functions | verified | 偶関数の定積分 |
| integrals-of-even-and-odd-functions | verified | 奇関数の定積分 |
| integration-by-substitution | verified | u 置換 |
| integration-by-substitution | verified | 置換法則 |
| inverse-proportion | verified | 〜に反比例する |
| inverse-proportion | verified | 逆変化 |
| less-than | verified | 〜より小さい |
| let-u-equal | verified | 〜を x とする |
| linear-approximation | verified | 一次近似 |
| linear-approximation | verified | 線形近似 |
| local-extremum | verified | 相対極値 |
| measure | verified | 長さを測る |
| measure-of-center | verified | 中心の測度 |
| midpoint | verified | 中点の座標 |
| negate | verified | 否定をつくる |
| net-change | verified | 純変化定理 |
| no-solution | verified | 矛盾する連立方程式 |
| parametric-equations | verified | 媒介変数方程式 |
| parentheses | verified | 丸かっこ |
| partial-fraction-decomposition | verified | 部分分数による積分 |
| perimeter | verified | 周囲の長さ |
| perpendicular-lines | verified | 垂直な 2 直線 |
| plot-a-point | verified | 点をとる操作 |
| power-rule | verified | べき乗則 |
| projectile-motion | verified | 投射運動 |
| proof-by-contrapositive | verified | 対偶による証明 |
| prove | verified | 証明せよ |
| rationalizing-the-denominator | verified | 有理化する |
| related-rates | verified | 関連変化率の問題 |
| rigid-motion | verified | 剛体変換 |
| sampling | verified | 標本抽出法 |
| second-derivative-test | verified | 第 2 次導関数テスト |
| sketch | verified | 図示せよ |
| slant-height | verified | 斜高 |
| slope-field | verified | 傾きの場 |
| solving-by-taking-square-roots | verified | 平方根をとって解く |
| spread | verified | ばらつく |
| spread | verified | 散らばりの測度 |
| squeeze-theorem | verified | はさみうちの定理 |
| stretch-vertically | verified | y 軸方向に拡大・縮小する |
| sum-to-product-formulas | verified | 和を積に直す公式 |
| summation-notation | verified | シグマ記法での和 |
| survey | verified | 質問票 |
| system-of-linear-equations | verified | 線形方程式系 |
| system-of-linear-equations | verified | 連立 1 次方程式 |
| take-the-log-of-both-sides | verified | 両辺の対数をとる |
| tangent-chord-theorem | verified | 接線と弦のなす角 |
| transformation-of-a-variable | verified | データの変換 |
| trapezoidal-rule | verified | 台形則 |
| work-backwards | verified | 逆演算で解く |
| write-an-equation | verified | 文字を使って表す |
| zero-product-property | verified | 零積の性質 |
| zero-product-property | verified | 零因子の性質 |
| adjugate | likely | 古典随伴行列 |
| ambiguous-case | likely | 2 通りの三角形ができる場合 |
| area-in-polar-coordinates | likely | 極座標の面積 |
| area-model | likely | 面積モデル |
| biconditional | likely | 同値な命題 |
| blinding | likely | 盲検化 |
| cardioid | likely | 心臓形 |
| categorical-variable | likely | カテゴリ変数 |
| categorical-variable | likely | 質的変数 |
| change-of-basis | likely | 基底変換 |
| chi-square-test | likely | χ² 検定 |
| cluster-sampling | likely | 集落抽出法 |
| component-form | likely | 成分形 |
| composite-figure | likely | 合成図形 |
| composition-of-transformations | likely | 関数の変換の合成 |
| conservative-vector-field | likely | 保存ベクトル場 |
| contingency-table | likely | 二元分割表 |
| continuity-correction | likely | 半整数補正 |
| convenience-sample | likely | 便宜的標本 |
| coordinate-proof | likely | 座標証明 |
| coordinates-in-space | likely | 三次元座標系 |
| cpctc | likely | 合同な三角形の対応する部分は等しい |
| decomposition-of-a-vector | likely | ベクトルを分解する |
| empirical-rule | likely | 68-95-99.7 則 |
| end-behavior | likely | 終端挙動 |
| error-bound | likely | 誤差の範囲 |
| exterior-angle-theorem | likely | 三角形の外角の性質 |
| gaussian-elimination | likely | 掃き出し法 |
| generating-function | likely | 生成関数 |
| glide-reflection | likely | グライド反射 |
| gradient | likely | グラディエント |
| gram-schmidt-process | likely | グラム・シュミットの直交化 |
| graph-coloring | likely | 彩色 |
| hamiltonian-path | likely | ハミルトン経路 |
| homogeneous-system | likely | 斉次連立一次方程式 |
| homogeneous-system | likely | 同次連立一次方程式 |
| image | likely | 移した図形 |
| inclusion-exclusion-principle | likely | 包含排除原理 |
| inclusion-exclusion-principle | likely | 包含と排除の原理 |
| intercepted-arc | likely | 角に対する弧 |
| isosceles-triangle-theorem | likely | 二等辺三角形の底角は等しい |
| isosceles-triangle-theorem | likely | 底角定理 |
| law-of-detachment | likely | モーダスポネンス |
| limacon | likely | 蝸牛形 |
| limacon | likely | パスカルの蝸牛形 |
| linearly-dependent | likely | 線形従属 |
| midline | likely | 中央線 |
| monotone-convergence-theorem | likely | 単調数列定理 |
| newtons-law-of-cooling | likely | ニュートンの冷却の法則 |
| orientation | likely | 曲線の向き |
| paired-t-test | likely | 対応のある標本 |
| partial-order | likely | 半順序関係 |
| piecewise-function | likely | 区分的定義 |
| pigeonhole-principle | likely | 部屋割り論法 |
| pigeonhole-principle | likely | ディリクレの箱入れ原理 |
| planar-graph | likely | 平面的グラフ |
| polynomial-inequality | likely | 高次不等式 |
| preimage | likely | もとの図形 |
| prime-polynomial | likely | 素多項式 |
| prime-polynomial | likely | これ以上因数分解できない式 |
| quadratic-regression | draft | 二次関数の回帰 |
| quantitative-variable | likely | 量的変数 |
| radical-equation | likely | 根号方程式 |
| rank-nullity-theorem | likely | 次元定理 |
| ratio-test | likely | ダランベールの判定法 |
| reduced-row-echelon-form | likely | 簡約階段形 |
| resistant-statistic | likely | 抵抗性のある統計量 |
| resultant | likely | 和ベクトル |
| right-triangle-similarity | likely | 斜辺への垂線 |
| rose-curve | likely | 正葉曲線 |
| rotated-conics | likely | 回転した二次曲線 |
| rotated-conics | likely | 回転した円錐曲線 |
| row-echelon-form | likely | 階段行列 |
| sampling-error | likely | 標本抽出の誤り |
| sampling-error | likely | 標本の変動 |
| skewness | likely | 分布の歪み |
| solve-the-right-triangle | likely | 直角三角形を解く |
| span | likely | スパン |
| standard-unit-vectors | likely | 単位ベクトル i, j |
| statistic | likely | 標本統計量 |
| statistically-significant | likely | 統計的に有意 |
| stem-and-leaf-plot | likely | 幹葉表示 |
| strong-induction | likely | 強帰納法 |
| strong-induction | likely | 強い数学的帰納法 |
| subspace | likely | 線形部分空間 |
| system-of-linear-inequalities | likely | 連立不等式の表す領域 |
| system-of-linear-inequalities | likely | 連立不等式のグラフ |
| system-of-three-equations | likely | 3 元 1 次連立方程式 |
| systematic-sampling | likely | 系統抽出法 |
| t-distribution | likely | スチューデントの t 分布 |
| tessellation | likely | テセレーション |
| test-for-homogeneity | likely | 一様性の検定 |
| transformations-of-functions | likely | 関数の変換 |
| treatment | likely | 処理条件 |
| turning-points | likely | 極大・極小の点 |
| unit-normal-vector | likely | 単位主法線ベクトル |
| vector-projection | likely | ベクトル射影 |
| well-ordering-principle | likely | 自然数の整列性 |
| without-loss-of-generality | likely | 一般性を失うことなく |
