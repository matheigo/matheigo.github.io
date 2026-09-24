# STYLE — 英語表現の編集方針

PLAN.md §6 をそのまま作業用に移したもの。**生成時に毎バッチ読み直す。** 気づいたことはここに足していく。
仕様と衝突したら PLAN.md §6 と §8 が優先。

## 10 の原則

1. 基準は「米国の教室で先生・TA が実際に口にする言い方」。書き言葉と話し言葉を分けて記録する（`register`）。
   **勘ではなく頻度で決める。** `pnpm corpus:count && pnpm corpus:decide` を回す。結果は register ごとに 3 通り。
   ① 首位が 3:1 以上 → その言い方を主見出しにする。
   ② 首位が 3 倍に届かないが、複数が各 10 件以上 → **併記**。`en.variants` に頻度順で入れる。
   どちらも実際に使われているのに一方を選ぶと、コーパスに無い好みを辞典が作ることになる。
   ③ 総件数 10 件未満 → 判断不能。`corpus-undecided` が付いて人間レビューへ。自分で判断して埋めない。
2. 米国優先。英国異形は `en.uk` に入れる（math/maths、negative three / minus three、parentheses / brackets、trig / trigonometry）。
3. 直訳禁止リスト（下）に触れる語は `mapping` を正直に付ける。
4. 対応が 1 対 1 でないものを隠さない。`mapping_note` に「米国ではどう扱うか」を書く。**ここが一番価値がある。**
5. 定義は自作、2 文以内。他資料の文章をコピーしない。JMdict / Weblio / 教科書の定義文は見てもよいが書き写さない。
6. 読み（ひらがな）必須。ローマ字は wanakana で自動生成。カタカナ語（インテグラル、シグマ）も `ja.alt` に入れる。
7. 出典 1 件以上。無ければ `confidence: draft` のまま。
8. 数式は LaTeX、KaTeX でレンダリングできる範囲。`\displaystyle` 乱用禁止。
9. 例文は「教室で聞こえてくる文」。論文調は Trzeciak に任せる。1 語につき最低 1 文、動詞は 2 文。
10. 文化的注意は事実だけ。「米国の学生は〜」の一般化は書かない。「米国の教科書では〜」「Calc I の講義では〜が多い」と対象を限定する。

## 出典の種類

`wikipedia-langlink`（日英の記事対応）／`wikidata`（Qid）／`mext-translation`／`criced`／`nysed-glossary`／
`reference`（Nekovar, Trzeciak, USU などの読み方資料）／`textbook`／`editorial`（本プロジェクトの編集判断。フレーズ集は基本これ）

`textbook` の第一基準は **OpenStax *Calculus* Volume 1**（CC BY-NC-SA 4.0）。微積分の用語・記法で迷ったらこれに合わせる。
written コーパス（`openstax-calculus`）として件数だけを使う。本文はリポジトリに入れず、出典には書名を挙げる。
Precalculus 以下は OpenStax *Precalculus* / *Algebra and Trigonometry*、統計は *Introductory Statistics*。
Stewart *Calculus* や Larson *Precalculus* は書名を出典に挙げるだけにとどめ、文章は引かない。

## 直訳禁止リスト

| 日本語 | ✕ 直訳 | ○ 実際の言い方 | mapping |
|---|---|---|---|
| 増減表 | increase-decrease table | sign chart ／ first-derivative test。凹凸は f″ の別の sign chart（concavity）| none |
| 場合の数 | number of cases | counting（分野名）／ the number of ways（個数） | near |
| 三角関数の合成 | synthesis of trig functions | writing a sin θ + b cos θ as R sin(θ+α)（auxiliary-angle form / harmonic form） | near |
| 内分点 | internally dividing point | the point that divides the segment internally in the ratio m:n | near |
| 整式 | integral expression | polynomial（「多項式」と区別しない） | exact |
| 微分係数 | differential coefficient | derivative at a point ／ the value of the derivative at x=a | near |
| 解と係数の関係 | relation of solutions and coefficients | Vieta's formulas（大学）／ relationship between roots and coefficients（高校では説明的に） | near |
| 平方完成 | — | completing the square（完成形は vertex form） | exact |
| 移項 | transposition | 話: move / bring it over to the other side ／ 書: subtract 3 from both sides | near |
| 約分 | — | reduce (a fraction) ／ cancel（動詞） | near |
| 通分 | — | find a common denominator（動詞句） | near |
| 代入 | — | substitute ／ plug in（教室では plug in が圧倒的） | exact |
| たすき掛け | cross multiplication | ac method ／ grouping ／ box method | none |
| 相加相乗平均 | — | AM–GM inequality | exact |
| はさみうちの原理 | — | squeeze theorem（sandwich theorem は英国寄り） | exact |
| 区分求積法 | piecewise quadrature | Riemann sum（手法名としては教えない） | near |
| 背理法 | — | proof by contradiction | exact |
| 対偶 | — | contrapositive | exact |
| 数学的帰納法 | — | (proof by) induction | exact |

## register が割れる語（`en.variants` を使う）

同じ操作でも、口で言うときと答案に書くときで英語が変わる語がある。`en.alt` は同じ register の同義語のためのもので、
register が違う言い方は `en.variants` に `register` を付けて入れる。

| 日本語 | 話し言葉 | 書き言葉・答案 |
|---|---|---|
| 移項する | move the 3x over to the other side | subtract 3 from both sides（両辺に同じ操作）|
| 代入する | plug in ／ substitute（②併記。OCW 5 コースで 220 対 106） | substitute（OpenStax Calc 1 で 66 件・唯一。エントリへの反映は人間レビュー待ち） |
| よって | so | therefore / hence |

Algebra 1 の先生は、口頭でも「両辺に同じ操作」の言い方を好むことが多い。迷ったら written 側を答案に使う。

この表はコーパスで裏が取れたものから埋める。`corpus:decide` の「register が割れたもの」節に出た語が候補。

## 追記欄（Phase 2 以降に育てる）

- 「エフ ダッシュ」は f dash では通じない。prime を使う（f prime of x、二階は f double prime）。
- 「極大・極小」は local maximum / minimum。区間全体の最大・最小には absolute か global を付ける。
- 「〜とおく」は let。"Let u = 2x" が答案でも口頭でも標準。
- 凹凸は concave up / concave down。「上に凸」を convex upward と直訳しても通じにくい。
- 答案に日本式の増減表を書いても減点はまずされない。ただし f′(x) / f(x) の行が何で、矢印が increasing / decreasing を表すことを一言添える。
