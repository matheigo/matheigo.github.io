# Phase 2 修正レポート — 積分の単元のやり直し（123 語 → 85 語）

作成: 2026-09-24 ／ 対象: 4d47e6f（Phase 2 integral report）→ 本コミット
指示: audits/phase2-integral-report.md を受けて、仕組みを 6 点直してから積分の 123 語をやり直す（1 概念 1 エントリ、語形変化と「…」の空き、1 ソース頼みの判定、CED、本プロジェクトの訳語、langlink の取り直し）。判断は `docs/DECISIONS.md` の「Phase 2 修正」に 33 行。

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified に上げた語はない。

## まとめ

- **積分の単元は 85 語**（123 語から 39 id を統合・移動し、1 語を新設）。同じ概念の統合 14 行、教科書の節の名前の統合 11 行、symbols への統合 1 行、phrases 候補への移動 13 行。新設は probability-density-function（節の名前の行の中身の移し先）
- **③（判断不能）は 52 ／ 123 語 → 16 ／ 85 語**。前の 52 語のうち 11 語は phrases 候補へ、19 語は統合で id が消えた（統合先で決着 15・統合先も ③ 4）、残った 22 語のうち 6 語が新しい数え方で決着、16 語が ③ のまま
- **1 ソース頼みで ① → ② に下げたもの 25 判定（24 語）**。② のまま頼っているソースを記録したもの 18 判定、併記する相手のない唯一の言い方で ① のまま記録だけしたもの 31 判定
- **register 不一致 0**（全 105 件）。corpus-undecided は積分の 16 語と既存の 9 件
- **CED（AP Calculus AB/BC、2020 年版）** で D-1 の主張を確かめた（表 D）。CED で確かめて topic 番号を出典にしたもの、CED の範囲外を OpenStax・コーパス・学習指導要領の本文で確かめて対象を限定したもの、確かめられず「教科書による」に弱めたもの、消したもの（LIPET など）に分けた。向きが逆だった主張（second fundamental theorem）と誤りだった主張（pound・foot が多い）を 1 件ずつ直した。accumulation-function は CED の topic 6.4 で確かめて likely に上げた
- **台帳の langlink を全体で取り直した**: 空の wiki_en を 169 行埋め、wikidata → wikipedia-langlink が 150 行（積分の単元では 4 行）。原因は build.py が API の `continue` を追わないこと
- パイプラインで見つけたバグ 2 つを直した: OpenStax の本文で x-axis が「x -axis」に割れていた（書き言葉 1,011 件）、語形変化をまとめると同じ出現を 2 回数える
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて緑（validate 警告 0、spell 0 件、test 66/66、build 105 ページ、export の terms は 94 件＝draft 1 件を除く）

## A. 統合・移動した id（39）

消した id はすべて `ledger/id-changes.csv` に action `merged-into`（new_id は寄せた先）か `to-phrases` で残る。台帳は `scripts/ledger/fix_decisions.py` の `PHASE2_*` を `fix_phase1.py` の手順 8 が適用する。見出しは `pnpm corpus:probe -- --decide` で決めた。

### A-1. 同じ概念（D-3）: 14 行 → 10 エントリ。ja は ja.alt、en は en.alt か variants へ

| 残したエントリ | 見出し（ja ／ en） | 統合した行 | コーパスの判定（話 ／ 書） |
|---|---|---|---|
| area-between-two-curves | 2 曲線間の面積 ／ area between two curves | area-between-curves、area-bounded-by-curves、area-between-a-parabola-and-a-line | ③ ／ ② area between the curves・area between two curves |
| limit-of-a-riemann-sum | リーマン和の極限（ja.alt 定積分と和の極限）／ limit of a Riemann sum | limit-of-riemann-sums | ③ ／ ③ |
| reverse-of-differentiation | 微分の逆 ／ antidifferentiation | inverse-operation | ③ ／ ③ |
| integrals-of-even-and-odd-functions | 偶関数・奇関数の積分 ／ integrals of even and odd functions | integral-of-an-even-function、integral-of-an-odd-function | ③ ／ ③ |
| integration-by-substitution | 置換積分法 ／ u-substitution | substitution-rule | ① u-substitution ／ ① → ② u-substitution・integration by substitution |
| partial-fraction-decomposition | 部分分数分解 ／ partial fraction decomposition | integration-by-partial-fractions | ② ／ ② |
| evaluate-the-integral | 積分を計算する ／ evaluate the integral | evaluate-the-definite-integral | ② compute ・ evaluate ・ evaluate the definite ／ ① → ② evaluate・compute |
| constant-of-integration | 積分定数 ／ constant of integration（variant plus C） | plus-c | ① plus C ／ ① constant of integration |
| accumulation-function | 定積分で表された関数（ja.alt 累積関数）／ accumulation function | function-defined-by-an-integral | ① area function ／ ③ |
| net-change | 純変化量 ／ net change | net-change-theorem、accumulation | ③ ／ ② net change・net change theorem |

「累積」グループは 2 つに分けた（accumulation の定義は積み重なった変化の見方で、関数ではない）。品詞が違う行（find-an-antiderivative、decompose-into-partial-fractions、find-the-arc-length、let-u-equal、substitute-new-variable）は Phase 1 の決定どおり別エントリ。

### A-2. 教科書の節の名前（D-4）: 11 行 → 中身の用語の 10 エントリ。節の名前は別名にしない

| 節の名前の行 | 寄せた先 | 移した中身 |
|---|---|---|
| antiderivatives（不定積分と原始関数） | antiderivative | 例文 1、CED topic 6.8 |
| definite-integrals-and-area（定積分と面積） | area-under-the-curve | signed area の説明、例文 1 |
| velocity-and-position（速度と位置） | displacement | x(b) = x(a) + ∫v dt、例文 1、pitfall 2、CED topic 8.2 |
| areas-and-distances（面積と距離、draft） | riemann-sum | 速度のグラフの長方形の例文、CED topic 6.2・6.3 |
| using-integral-tables（積分表の利用） | integration-formulas | ja.alt 積分表、en.alt table of integrals、CAS の pitfall |
| integral-of-the-exponential-function（指数関数の積分） | integration-formulas | ∫eˣ dx、ln と log の pitfall |
| probability-density-and-integrals（確率密度と積分） | probability-density-function（新設） | 定義・例文・pitfall を移して作り直した |
| inequalities-involving-integrals（定積分と不等式） | properties-of-integrals | 比較の性質を定義に、例文 1、CED topic 6.6 |
| integrals-of-trigonometric-functions（三角関数の積分） | trigonometric-integrals | ja.alt 三角関数の積分、基本の積分を定義に |
| integral-of-a-rational-function（分数関数の積分） | partial-fraction-decomposition | 分数関数と rational function の違い、long division |
| integral-involving-radicals（無理関数の積分） | trigonometric-substitution | 無理関数と radical function、例文 1 |

### A-3. symbols へ（1）

the-integral-from-a-to-b → symbols/integral-definite。読み方の注意 2 つを notes に移し、term_ref を definite-integral に繋いだ（Phase 0 で null にしていた）。

### A-4. Phase 3 の phrases 候補へ（13）

dont-forget-the-plus-c、top-minus-bottom、area-is-never-negative、check-by-differentiating、add-up-thin-disks、find-the-intersections-to-get-the-limits、split-the-integral、write-as-a-limit-of-a-sum、integrate-the-inequality、the-area-of-the-region-bounded-by（以上、指示の 10 語）、enclosed-region（the region bounded by …）、find-the-area-by-integration、integrate-by-parts-repeatedly（同じ基準で足した 3 語）。

一覧と生成済みの本文の場所は `ledger/phrases-candidates.csv`（`from` 列 = `4d47e6f:data/terms/<id>.json`）。integrate-by-parts-repeatedly の pitfall にあった「教科書によっては tabular integration」は、CED にもコーパスにも無く確かめられていない。Phase 3 で持ち込まないこと。

## B. ③ の件数の前後（52 → 16）

| 前の ③ 52 語の行き先 | 語数 |
|---|---|
| phrases 候補へ | 11 |
| 統合で id が消えた（統合先で決着） | 15 |
| 統合で id が消えた（統合先も ③: inverse-operation、integral-of-an-even-function、integral-of-an-odd-function、limit-of-riemann-sums） | 4 |
| 残って決着（新しい数え方） | 6: volume-of-a-solid-of-revolution、revolve-around-the-x-axis、revolve-around-the-y-axis、cylindrical-shell、accumulation-function、fundamental-theorem-of-calculus-part-1 |
| 残って ③ のまま | 16（E） |

決着した理由: 語形変化（cylindrical shells、volumes of revolution）、「…」の空き（rotate this region around the x-axis）、x-axis の修正（書き言葉の revolve … around the x-axis 27 件はほぼすべて「x -axis」に割れていた）、句読点の同一視（fundamental theorem of calculus, part 1）、area function の variant（accumulation-function）。

## C. 1 ソース頼みの判定

規則（DECISIONS）: 首位の言い方の件数が最も多いソース（manifest の id）を抜いて判定し直し、種類か首位が変われば頼っているとする。① は ② に下げる。首位を含むだけのコロケーションは併記の相手にしない。

### C-1. ① → ② に下げたもの（25 判定・24 語）

| 語 | 抜いたソース（首位の件数中） | ② の併記（頻度順） |
|---|---|---|
| find-an-antiderivative（話） | khan-ap-calc 93 ／ 107 | take the antiderivative ・ find an antiderivative（抜くと find an が首位） |
| fundamental-theorem-of-calculus（書） | openstax-calculus 76 ／ 89 | fundamental theorem of calculus ・ FTC（抜くと MIT の講義ノートの FTC が首位） |
| disk-method（話） | khan-ap-calc 15 ／ 20 | disk method ・ disc method |
| eulers-method（話） | mit-18.03 19 ／ 26 | Euler's method ・ Euler method |
| separable-differential-equation（話） | khan-ap-calc 28 ／ 29 | separable differential equation ・ separable equation |
| summation-notation（話） | khan-ap-calc 21 ／ 43 | sigma notation ・ summation notation |
| trigonometric-integrals（話） | mit-18.01 22 ／ 36 | trig integrals ・ trigonometric integrals |
| revolve-around-the-y-axis（話） | mit-18.01 11 ／ 17 | rotate … around the y-axis ・ revolve around the y-axis |
| can-be-integrated（書） | openstax-calculus 40 ／ 40 | integrable ・ can be integrated |
| evaluate-the-integral（書） | openstax-calculus 112 ／ 115 | evaluate the integral ・ compute the integral |
| fundamental-theorem-of-calculus-part-1（書） | openstax-calculus 10 ／ 10 | …, part 1 ・ first fundamental theorem of calculus |
| fundamental-theorem-of-calculus-part-2（書） | openstax-calculus 15 ／ 15 | …, part 2 ・ evaluation theorem |
| integrate-by-parts（書） | openstax-calculus 19 ／ 20 | use integration by parts ・ integrate by parts |
| integration-by-substitution（書） | openstax-calculus 25 ／ 25 | u-substitution ・ integration by substitution |
| integration-formulas（書） | openstax-calculus 37 ／ 37 | integration formulas ・ table of integrals |
| interval-of-integration（書） | openstax-calculus 58 ／ 60 | limits of integration ・ interval of integration |
| left-riemann-sum（書） | openstax-calculus 21 ／ 21 | left-endpoint approximation ・ left Riemann sum |
| right-riemann-sum（書） | openstax-calculus 33 ／ 33 | right-endpoint approximation ・ right Riemann sum |
| let-u-equal（書） | openstax-calculus 71 ／ 78 | let u = ・ let u equal |
| properties-of-integrals（書） | openstax-calculus 8 ／ 8 | properties of the definite integral ・ properties of integrals |
| substitute-new-variable（書） | openstax-calculus 11 ／ 19 | make the substitution ・ make a substitution |
| trigonometric-integrals（書） | openstax-calculus 11 ／ 16 | trigonometric integrals ・ trig integrals |
| trigonometric-substitution（書） | openstax-calculus 15 ／ 22 | trigonometric substitution ・ trig substitution |
| variable-of-integration（書） | openstax-calculus 14 ／ 14 | variable of integration ・ dummy variable |
| volume-by-cross-sections（書） | openstax-calculus 21 ／ 21 | slicing method ・ method of slicing |

どのソースがどちらを使うかは、各エントリの `en.variants[].note` に書いた（言い方の特徴は自作の文、件数とソースの内訳は判定と同じ件数から機械的に）。find-an-antiderivative は en.term を take the antiderivative から、両 register で首位集合に入る find an antiderivative に変えた。

### C-2. ② のまま、頼っているソースを記録したもの（18）

area-between-two-curves（書）、area-under-the-curve（書）、as-n-approaches-infinity（話 khan-ap-calc 95/112）、evaluate-the-integral（話 mit-18.02 16/29）、find-an-antiderivative（書 openstax 29/29）、interval-of-integration（話 khan-ap-calc 25/42）、let-u-equal（話 blackpenredpen 10/14）、logistic-differential-equation（書）、net-change（書）、overestimate-and-underestimate（書）、revolve-around-the-x-axis（書）、revolve-around-the-y-axis（書）、substitute-new-variable（話 profleonard 19/32）、summation-notation（書 openstax-algtrig 31/35）、trapezoidal-rule（話 khan-ap-calc 16/16）、trigonometric-substitution（話 mit-18.01 62/79）、variable-of-integration（話 profleonard 9/19）、volume-of-a-solid-of-revolution（書）。

### C-3. 下げなかったもの

- **which-one-to-differentiate**（指示で例に挙がった語）: 語形変化をまとめると話し言葉の pick u は 17 件で、MIT OCW 5・NancyPi 5・patrickJMT 4・Professor Leonard 3 に分かれ、どのソースを抜いても ① のまま。前のレポートの「10 件が YouTube」は YouTube の 6 チャンネルを 1 つと数えた数で、ソースの単位（manifest の id、重み付けの 25% 上限と同じ）に揃えると頼っていない。書き言葉の choose u は OpenStax だけ（15/15）だが、併記する相手がない。どのソースがどちらを使うかは pitfall と note に書いた
- 唯一の言い方で 1 ソース頼み（31 判定）: cylindrical shell（話 Professor Leonard 24/29）、hydrostatic force（話 blackpenredpen 10/10）、midpoint rule（書 OpenStax 44/44）など。`audits/corpus-2026-09-24.md` の「1 ソース頼み」節に全件

## D. CED で確かめた結果（D-1 の主張）

CED: College Board, *AP Calculus AB and BC Course and Exam Description*（Effective Fall 2020）。`python3 scripts/ledger/refetch.py ced` で PDF を corpus/ref/ に取り（gitignore）、`ced-find` で TOPIC 見出しごとの語の有無だけを見た。出典は `type: reference`、note に topic 番号。

| エントリ | 前の主張 | 確かめ方 | 結果・書き直し |
|---|---|---|---|
| shell-method | AP の試験範囲は disk と washer まで | CED: 回転体は disc method（8.9・8.10）と washer method（8.11・8.12）、shell ／ cylindrical は 0 件 | 確かめた。CED を出典に |
| trigonometric-substitution | AP の試験範囲に含まれない | CED: trigonometric substitution 0 件。BC の技法は 6.11–6.13 | 確かめた。topic 番号で書き直し |
| accumulation-function | AP では accumulation function と呼ぶ | CED: accumulation functions が 6.4・6.5・8.3、functions defined by integrals が 6.4 | 確かめた。**draft → likely** |
| net-change（旧 accumulation） | AP は積分の単元を accumulation of change として組み立てる | CED: Unit 6 の名前 Integration and Accumulation of Change、net change は 8.3 | 確かめた |
| fundamental-theorem-of-calculus（3 語） | どちらを Part 1 と呼ぶかは教科書で逆のことがある | CED: 番号なし（6.4・6.7）。OpenStax は Part 1 ／ Part 2 と Evaluation Theorem（コーパス 4 件） | 「番号の付け方は教科書による」に弱め、OpenStax と CED の事実を書いた |
| fundamental-theorem-of-calculus-part-2 | second fundamental theorem を d/dx ∫ₐˣ の名前に使う教材もある | コーパス: Khan Academy が 14 件で、主に ∫ₐᵇ f = F(b) − F(a) の名前として使う | 主張の向きが逆だった。Khan の使い方に書き直した |
| axis-of-revolution | 米国の問題は座標軸以外の直線を回転軸にすることが多い | CED: 座標軸（8.9・8.11）と other axes（8.10・8.12）が別の topic | 「多い」は確かめられないので消し、CED の topic の分け方に書き直した |
| volume-by-cross-sections | AP では断面の形を指定して出題されることが多い | CED: squares and rectangles（8.7）、triangles and semicircles（8.8） | topic の事実に書き直した |
| differential-equation | 日本の数IIIでは軽く扱うことが多い ／ 米国では AB から slope field 等 | 学習指導要領（平成30年告示）本文に「微分方程式」0 件。CED: slope fields 7.3・separation of variables 7.6 は AB、7.5・7.9 は BC のみ | 両方確かめて書き直した |
| one-sixth-formula | 米国の授業は途中式を重く見る | CED: Mathematical Practices に justification と communication and notation、記述問題の supporting work。1/6 公式は CED・OpenStax・コーパスに 0 件 | CED の事実に書き直した |
| left-riemann-sum ／ right ／ midpoint | 米国では left ／ right ／ midpoint と名前を付けて比べる | CED 6.2 | 確かめた。3 語とも CED を出典に。midpoint の見出しを **midpoint Riemann sum** に、midpoint rule は書き言葉の variant |
| trapezoidal-rule | —（D-1 には無い） | CED 6.2 は trapezoidal sums | 見出しは変えず（指示の範囲外）、CED を出典に足した |
| disk-method | — | CED は disc method と綴る | disc method を話し言葉の variant に |
| summation-notation | 米国の微積分の教科書は添字に i が多い | OpenStax Calculus Volume 1 の Approximating Areas・The Definite Integral: ∑ i = 1 が 78・31 件、k・j は 8・6・0 件。CED 6.3 は summation notation | OpenStax に限定して書き直し、CED を出典に |
| cross-sectional-area | 日本は S(x)、米国は A(x) | OpenStax Volume 1 Determining Volumes by Slicing: A(x) 9 件、S(x) 0 件 | 米国側は OpenStax に限定、日本側は「書くことがある」に弱めた |
| hydrostatic-force | 米国の問題は pound・foot を使うことが多い | OpenStax Volume 1 Physical Applications: lb 32・ft 56、m 43・N 11 | 「多い」は誤り（両方ある）。両方載せると書き直した |
| indefinite-integral ／ antiderivative | 日本の数IIの教科書には同じ意味で定義するものがある ／ 米国の教科書は呼び分ける | OpenStax: most general antiderivative など | 日本側を「教科書による」に弱め、米国側は OpenStax に限定 |
| indefinite-integral | 米国の解答例は「C は積分定数」をあまり書かない | 書き言葉コーパスに where C is a constant が 17 件 | 主張を消し、英語の書き方だけ残した |
| change-the-limits-of-integration ／ substitution-in-a-definite-integral ／ write-dx-in-terms-of-du | 対応表は米国では書かない ／ dx を解き出さない書き方が多い | CED の範囲外、確かめる資料なし | 「教科書による」に弱めた |
| liate | LIPET などの変種 | CED 0 件、コーパス 0 件 | **消した**。「米国の授業で教える」も「OpenStax Calculus Volume 2 が紹介する」に限定 |
| integrate-by-parts-repeatedly | 教科書によっては tabular integration | CED・コーパス 0 件 | エントリは phrases 候補へ。Phase 3 に持ち込まない（A-4） |
| trigonometric-substitution | 直角三角形（reference triangle）を描く | OpenStax Volume 2 に reference triangle 16 件 | OpenStax に限定して残した |
| shell-method | 米国では Calc II で標準の方法として教える | OpenStax Volume 1 の節 Volumes of Revolution: Cylindrical Shells、method of cylindrical shells 16 件 | OpenStax に限定して書き直し。日本側（受験の技法）は「教科書による」 |

## E. 残る ③（16 語。話・書は生の件数）

| id | 見出し | 話 | 書 | 見立て |
|---|---|---|---|---|
| axis-of-revolution | 回転軸 ／ axis of revolution | 4 | 20 | 書は axis of revolution 13 対 axis of rotation 7（3 倍に届かず、次点が 10 件未満） |
| comparison-test-for-integrals | 比較判定法（積分） ／ comparison theorem | 0 | 5 | comparison test は級数と共用で候補にしていない |
| convergence-of-improper-integrals | 広義積分の収束 | 0 | 0 | 名詞句としては言わない（the integral converges と動詞で言う） |
| decompose-into-partial-fractions | 部分分数に分解する | 0 | 4 | 空きの形 decompose … into partial fractions も話 1 件。名詞 partial fractions の側で決着している |
| integral-involving-absolute-value | 絶対値を含む積分 | 7 | 1 | |
| integrals-giving-inverse-trig-functions | 逆三角関数の積分 | 0 | 1 | OpenStax の節の名前の言い方 |
| integrals-of-even-and-odd-functions | 偶関数・奇関数の積分 | 0 | 2 | 統合しても件数が増えなかった |
| integration-by-completing-the-square | 平方完成による積分 | 0 | 0 | 確立した名前ではない（mapping near） |
| integration-by-long-division | 長除法による積分 | 0 | 0 | 同上 |
| liate | LIATE | 2 | 7 | |
| limit-of-a-riemann-sum | リーマン和の極限 | 1 | 5 | 統合しても 10 件に届かない。CED 6.3 の言い方 |
| one-sixth-formula | 1/6 公式 | 0 | 0 | mapping none。英語に名前がないことが結論 |
| rationalizing-substitution | 有理化置換 | 0 | 0 | draft のまま |
| reverse-of-differentiation | 微分の逆 ／ antidifferentiation | 11 | 3 | 話は antidifferentiation 6 対 inverse operation 4 |
| substitution-in-a-definite-integral | 定積分の置換積分 | 0 | 2 | |
| surface-area-of-revolution | 回転面の面積 | 2 | 9 | 書は area of a surface of revolution 8 で 10 件に 1 件足りない |

## F. パイプラインの変更

| 変更 | ファイル | 理由 |
|---|---|---|
| terms を語形変化をまとめて数える（`countTerm`。語幹は sameWording と同じ、閉じた語類は literal） | `scripts/corpus/lib.ts` | 指示 2 |
| 見出しの「…」を 1〜3 語の空きとして数える。空きなしの形と同じ言い方として扱う | `lib.ts`（`termRegex`、`sameWording`） | 指示 2 |
| 同じ言い方のグループは同じ出現を 1 回と数える（`countEntry`）。count.ts はこれを使う | `lib.ts`、`scripts/corpus/count.ts` | 語形変化をまとめると 2 回数えていた |
| sameWording が語の後ろの句読点を無視する | `lib.ts` | FTC, part 1 と part 1 が割れていた |
| 1 ソース頼みの判定（`decideRobust`）。コロケーションは併記の相手にしない。レポートに「1 ソース頼み」節 | `lib.ts`、`scripts/corpus/decide.ts` | 指示 3 |
| decide に `--units` ／ `--ids`（書き戻しの範囲） | `decide.ts` | 積分の単元だけ書き戻す |
| normalize: 「x -axis」→「x-axis」。cnxmlToText もハイフンを離さない | `lib.ts` | OpenStax の本文で 1,011 件割れていた |
| probe: terms と同じ数え方、最多ソースの表示、`--decide` モード、キャッシュを normalize の規則でも作り直す | `scripts/corpus/probe.ts` | 見出しを probe で決めるため |
| crosscheck: 50 タイトル／リクエスト、continue、タイムアウト・リトライ上限、done/total、キャッシュ（corpus/cache/crosscheck.json） | `scripts/crosscheck.ts` | 取得の作法（指示） |
| refetch.py: 台帳の langlink（→ langlinks.json）と CED（→ corpus/ref/）。同じ作法 | `scripts/ledger/refetch.py` | 指示 4・6 |
| fix_phase1.py 手順 7（langlink）・8（Phase 2 修正）、merge() の記事の保持 | `scripts/ledger/fix_phase1.py`、`fix_decisions.py` | 指示 1・6 |
| validate: exact のエントリでも mapping_note が「本プロジェクトの訳語」を含めば警告しない | `scripts/validate.ts` | 指示 5 |
| テスト 20 件追加（計 66） | `tests/corpus.test.ts` | |

## G. 積分の単元の外への影響

decide は積分の 8 単元と symbols/integral-definite の 86 件だけ書き戻した。ほかの 20 件（Phase 0 のサンプル 9 語・symbols 4・phrases 5・squeeze-theorem など）は、新しい規則でも corpus-* flags が変わらないことを確かめて書き戻していない。書き戻すと変わるのは「1 ソース頼み」の記録だけ:

- substitute: 話 ① → ② plug in 1,405 ／ substitute 391 ／ substitute back 30（plug in のうち yt:profleonard 593）。エントリはもともと 3 つとも持っているので不一致にならない
- derivative-at-a-point: 話 ① → ② f prime of a ／ derivative at a point（khan-ap-calc 17 ／ 19）
- move-term-to-other-side: ② のまま（khan-algebra 98 ／ 249）。squeeze-theorem: 唯一の言い方で ① のまま（khan-ap-calc 9 ／ 15、書は OpenStax 13 ／ 13）

evidence の件数も語形変化で増えるので、次にこれらの語を触るときに書き戻す。

## H. 台帳

- `langlinks.json`: 575 タイトル中 558 に en langlink。手順 7 で空の wiki_en 169 行を埋め、150 行を wikidata → wikipedia-langlink に。記録済みと食い違う行・消えた行は 0。積分の単元では arc-length-of-a-curve、improper-integral、probability-density-function、riemann-sum の 4 行（エントリは Phase 2 で既に langlink を出典にしていた。probability-density-function は新設時に付けた）
- 原因: build.py は `continue` を追わない。lllimit なしでは 50 タイトルに 10 件しか返らず continue になることを API で確かめた。コミットされた build.py は lllimit=500 付きなので、Phase 1 のキャッシュを作ったときの版の違いと思われるが、キャッシュが無く確かめられない
- 台帳で wiki_ja が無い行（置換積分・変数分離・総和・回転面・バウムクーヘン積分の見出し）は取り直していない（DECISIONS）
- 台帳 2,357 行 → 2,318 行（39 行を統合・移動）。`id-changes.csv` に 39 行、`phrases-candidates.csv` を新設

## I. 気になっている点（Phase 5 の監査へ。直していない）

- **② の相手が小さい**: 1 ソース頼みで下げた ② には、相手が 1〜5 件のものがある（interval-of-integration の書き言葉 limits of integration 60 ／ interval of integration 1、integrand の書き言葉は相手なしで ① のまま）。指示どおり下げたが、相手の件数に下限を設けるかは人間の判断
- **accumulation-function の見出し**: コーパスでは accumulation function が 0 件で、話し言葉は area function（3Blue1Brown 8 ／ 11）。CED の名前を見出しにした
- **revolve-around-the-x-axis ／ y-axis で見出しの動詞が違う**: x は書き言葉 ② の首位 revolve、y は両 register の首位 rotate。データに従った結果
- **en.alt が長い**: 空きなしの形を数えるために、revolve ／ rotate × around ／ about の 4 通りを en.alt に並べた
- **probability-density-function** は数Bのバッチより先に 1 語だけ生成した（節の名前の行の中身の移し先）
- **trapezoidal-rule の見出し**: CED は trapezoidal sum だが見出しは変えていない（midpoint だけが指示）
- **ソースの単位**: 1 ソース頼みは manifest の id で数えた。YouTube ／ Khan ／ OpenStax を 1 つと数えると下がる語が増える（which-one-to-differentiate など）
- 統合の ja.alt には、教科書の節の名前に近い語（定積分と和の極限）が入っている（指示: 統合した行の日本語は ja.alt）

## J. DECISIONS に足した行（33 行）

`docs/DECISIONS.md` の「Phase 2 修正（積分の単元のやり直し）— 2026-09-24」。1 概念 1 エントリの適用範囲（品詞）、累積の分け方、id と ja の残し方、probe --decide、find-an-antiderivative の見出し、節の名前、probability-density-function、symbols への統合、phrases 候補、台帳の手順 8 と merge()、語形変化、「…」、同じ出現の 1 回数え、句読点、x-axis、probe のキャッシュ、1 ソース頼みの規則とソースの単位、唯一の言い方とコロケーション、which-one-to-differentiate、note の件数、use u-substitution、decide の範囲、CED の取得と出典の書き方、accumulation-function、midpoint ／ trapezoidal ／ disc、D-1 の確かめ方、本プロジェクトの訳語、validate、langlink の取り直しと原因、wiki_ja の無い行、取得の作法、前の行の置き換え。STYLE.md の追記欄にも生成時の規則として 6 行足した。

## K. 確認

```
python3 scripts/ledger/refetch.py            # langlinks 575 タイトル（再実行は 575 cached ／ 0 件取得）、CED 7,997,796 バイト（再実行は cached）
python3 scripts/ledger/fix_phase1.py         # 手順 7: filled 169 ／ upgraded 150 ／ differ 0 ／ gone 0、手順 8: 14 ／ 11 ／ 1 ／ 13
pnpm corpus:count && pnpm corpus:decide -- --write --units <積分の 8 単元> --ids symbols/integral-definite
                                              # 主見出し決着 52 ／ 併記 37 ／ 判断不能 25（積分 16・既存 9）／ 不一致 0 ／ 1 ソース頼み 57、書き戻し 86 件
pnpm crosscheck -- --write                   # 28/28 一致（1 リクエスト。再実行は 28 cached）
pnpm exec tsc --noEmit                       # 緑
pnpm validate                                # terms 95 / symbols 5 / phrases 5 / conventions 3 / curriculum 165、警告 0
pnpm spell                                   # 280 ファイル、0 件
pnpm test                                    # 66/66
pnpm build                                   # 105 ページ、export: terms.json 94（draft 1 を除く）
```
