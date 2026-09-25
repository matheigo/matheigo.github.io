# STYLE — 英語表現の編集方針

PLAN.md §6 をそのまま作業用に移したもの。**生成時に毎バッチ読み直す。** 気づいたことはここに足していく。
仕様と衝突したら PLAN.md §6 と §8 が優先。

## 10 の原則

1. 基準は「米国の教室で先生・TA が実際に口にする言い方」。書き言葉と話し言葉を分けて記録する（`register`）。
   **勘ではなく頻度で決める。** `pnpm corpus:count && pnpm corpus:decide` を回す。結果は register ごとに 3 通り。
   ① 首位が 3:1 以上 → その言い方を主見出しにする。
   ② 首位が 3 倍に届かないが、複数が各 10 件以上 → **併記**。`en.variants` に頻度順で入れる。
   どちらも実際に使われているのに一方を選ぶと、コーパスに無い好みを辞典が作ることになる。
   首位だけが 10 件以上（2 位は 10 件未満）なら 3 倍に届かなくても ①。2 位は少数の variant にする。
   ③ 総件数 10 件未満 → 判断不能。話・書とも ③ のときは次の順に決める（register は主張しない）。
     ・mapping near ／ none で全候補が話・書とも 10 件未満 → 「英語に決まった言い方がない」（`corpus-no-fixed-expression`）。
       mapping_note にそう書く。英語の名前をそのまま見出しにした語（LIATE）、CED の呼び方・IM の glossary の見出しになっている語、
       mapping none で ja が本プロジェクトの訳語の語（two-column proof など米国の名前が元の語）は除く。
     ・それ以外 → 見出しは CED（AP Calculus ／ AP Statistics）→ OpenStax と IM（同じ段）→ Nicholson ／ Levin → 英語版 Wikipedia の記事名の順に最初に見つかった呼び方（`corpus-reference-fallback`。docs/SOURCES.md）。
       Nicholson ／ Levin ／ Wikipedia で決まった語は mapping_note に「米国の高校課程（CED・OpenStax・IM）では扱わない」と件数を書く。
     ・どれにも無い → `corpus-undecided` で人間レビューへ。自分で判断して埋めない。
2. 米国優先。英国異形は `en.uk` に入れる（math/maths、negative three / minus three、parentheses / brackets、trig / trigonometry）。
3. 直訳禁止リスト（下）に触れる語は `mapping` を正直に付ける。
4. 対応が 1 対 1 でないものを隠さない。`mapping_note` に「米国ではどう扱うか」を書く。**ここが一番価値がある。**
5. 定義は自作、2 文以内。他資料の文章をコピーしない。JMdict / Weblio / 教科書の定義文は見てもよいが書き写さない。
   **用例コーパスの文も転載しない。** MIT OCW・OpenStax（と Khan Academy の字幕）は CC BY-NC-SA なので、
   例文・定義文・note にコーパスの文を写さない。コーパスから使うのは件数だけ。
   辞典のデータは CC0 のまま（NC-SA の文が混ざると CC0 で出せなくなる）。
6. 読み（ひらがな）必須。ローマ字は wanakana で自動生成。カタカナ語（インテグラル、シグマ）も `ja.alt` に入れる。
7. 出典 1 件以上。無ければ `confidence: draft` のまま。
8. 数式は LaTeX、KaTeX でレンダリングできる範囲。`\displaystyle` 乱用禁止。
9. 例文は「教室で聞こえてくる文」。論文調は Trzeciak に任せる。1 語につき最低 1 文、動詞は 2 文。
10. 文化的注意は事実だけ。「米国の学生は〜」の一般化は書かない。「米国の教科書では〜」「Calc I の講義では〜が多い」と対象を限定する。

## 出典の種類

`wikipedia-langlink`（日英の記事対応）／`wikidata`（Qid）／`mext-translation`／`criced`／`nysed-glossary`／
`reference`（Nekovar, Trzeciak, USU などの読み方資料）／`textbook`／`editorial`（本プロジェクトの編集判断。フレーズ集は基本これ）

`textbook` の第一基準は **OpenStax *Calculus* Volume 1**（CC BY-NC-SA 4.0）。微積分の用語・記法で迷ったらこれに合わせる。
written コーパス（`openstax-calculus` ほか）として件数だけを使う（原則 5）。本文はリポジトリに入れず、出典には書名を挙げる。
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
| 移項 | transposition | subtract 3 from both sides ／ add 3 to both sides ／ move it over to the other side（話し言葉はこの頻度順。書き言葉は両辺の言い方） | near |
| 約分 | — | reduce (a fraction) ／ cancel（動詞） | near |
| 通分 | — | find a common denominator（動詞句） | near |
| 代入 | — | plug in ／ substitute（話し言葉は plug in、書き言葉は substitute。高校向けの Khan は話し言葉でも substitute） | exact |
| たすき掛け | cross multiplication | ac method ／ grouping ／ box method | none |
| 相加相乗平均 | — | AM–GM inequality | exact |
| はさみうちの原理 | — | squeeze theorem（CED topic 1.8・OpenStax。sandwich theorem は Khan Academy の講義に少数） | exact |
| 区分求積法 | piecewise quadrature | Riemann sum（手法名としては教えない） | near |
| 背理法 | — | proof by contradiction | exact |
| 対偶 | — | contrapositive | exact |
| 数学的帰納法 | — | (proof by) induction | exact |

## register が割れる語（`en.variants` を使う）

同じ操作でも、口で言うときと答案に書くときで英語が変わる語がある。`en.alt` は同じ register の同義語のためのもので、
register が違う言い方は `en.variants` に `register` を付けて入れる。

| 日本語 | 話し言葉 | 書き言葉・答案 |
|---|---|---|
| 移項する | subtract 3 from both sides ／ add 3 to both sides ／ move the 3x over to the other side（②併記。249 ／ 243 ／ 52。両辺は高校向け、other side は大学の講義寄り） | subtract 3 from both sides ／ add 3 to both sides（②併記。25 ／ 26）。両辺の 2 つは register both |
| 代入する | plug in（①。1,403 対 substitute 361。Khan は substitute がほぼ全部）／ substitute back | substitute（①。739 対 35）。エントリは substitute を both にした |
| よって | so | therefore / hence |

Algebra 1 の先生は、口頭でも「両辺に同じ操作」の言い方を好むことが多い。迷ったら written 側を答案に使う。

この表はコーパスで裏が取れたものから埋める。`corpus:decide` の「register が割れたもの」節に出た語が候補。

## 追記欄（Phase 2 以降に育てる）

- 「エフ ダッシュ」の f dash は用例コーパスに 0 件。prime を使う（f prime of x、二階は f double prime）。
- 「極大・極小」は local maximum / minimum。区間全体の最大・最小には absolute か global を付ける。
- 「〜とおく」は let。"Let u = 2x" が答案でも口頭でも標準。
- 凹凸は concave up / concave down（CED topic 5.6・OpenStax）。「上に凸」の直訳 convex upward は用例コーパスに 0 件。
- 日本式の増減表に当たる定型の表は CED にも OpenStax にもない。CED（Unit 9 の概要）は sign chart を答えを見つける道具として認めつつ、理由の点には定義・定理との結びつきを求める。答案では f′ の符号の変化と定理の名前（by the first derivative test）で理由を書く。
- 1 概念 1 エントリ。教科書の節の名前（定積分と面積、速度と位置…）は見出しに立てず、中身の用語のエントリに書く。授業や問題文の一文（don't forget the plus C、top minus bottom…）は terms に入れず phrases の候補（`ledger/phrases-candidates.csv`）にする。品詞が違う語（積分 ／ 積分する）は別エントリ。
- 目的語が間に入る動詞句は見出しに「…」を入れる（revolve … around the x-axis）。コーパスでは「…」を 1〜3 語の空きとして数える。空きなしの形（revolve around the x-axis、受け身の is revolved around …）も en.alt に並べると同じ言い方として 1 回だけ数える。
- terms の件数は語形変化（複数形・三単現・過去形・-ing）をまとめて数える。Riemann sums のような変化形を en.alt に別に入れなくてよい。
- 1 つのソースに頼った判定は、そのソースを抜くと別の言い方が首位になるときだけ ② に下がる（`corpus:decide` のレポートの「1 ソース頼み」）。抜くと ③ になるだけなら ① のまま。variants の note に、どのソースがどの言い方を使うかを書く（例: take the antiderivative は Khan Academy、find an antiderivative は MIT OCW）。
- AP Calculus での呼び方・範囲は College Board の CED（2020 年版）、AP Statistics は CED（2026 年版）、線形代数は Nicholson、離散数学（グラフ）は Levin で確かめる（docs/SOURCES.md）。出典は type: reference、note に topic 番号。本文は写さない。確かめられない「米国では〜」は書かないか「教科書による」とする。
- 日本の教科書に無い日本語見出しは、mapping_note に「見出しの「X」は日本の教科書に無い、本プロジェクトの訳語。」と書く（mapping が exact でも）。
- リーマン和の仲間の見出しは CED の呼び方（left ／ right ／ midpoint Riemann sum、trapezoidal sum）。教科書の left-endpoint approximation、midpoint rule、trapezoidal rule は書き言葉の variant。
- 別の意味でも大量に使う語（goes to、squeeze など）が候補表現になるときは、見出しの意味でしか現れない数学の文の形で数える（as … goes to、squeeze … between）。形は `scripts/corpus/lib.ts` の `TERM_FORMS` に書き、evidence にも形のまま記録する。別の意味も同じ構文を取る語（sum rule、product rule）は形で分けられないので、件数の注意を pitfalls に書く。
- 「米国では〜」の主張は CED か OpenStax（か用例コーパスの件数）で確かめて、確かめた範囲で書く（「OpenStax Algebra and Trigonometry は〜」「CED topic 5.4」）。確かめられないもの（通じる／通じない、減点されない、一番よく使う）は書かない。
- 見出しがふつうの英単語だけの句（数学の名詞を含まない句。1 語の compare・region も）が ① か ② になったら、確定する前に首位の候補の文脈を register ごとに 10 件見る（`pnpm corpus:probe -- --contexts "<候補>"`）。別の意味が 5 件以上か、除くと判定が変わるときは TERM_FORMS の形で数え直す。形には「A | B」（どちらか）と「!w」（前に置けば直前が w のもの、後ろに置けば直後が w のものを数えない）が使える。
- 数えられないもの（別の意味を締め出す形がない言い方）は候補（en.alt・variants・collocations）に置かず、pitfalls に書く（phase-shift の horizontal shift）。
- 新しい単元の行が既存のエントリに当たったら、その単元の意味・例文・level・ja.alt が足りているかを見て、足りなければ足す（飛ばさない）。
