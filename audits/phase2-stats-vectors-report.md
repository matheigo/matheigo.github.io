# Phase 2 レポート — 汎用の句・既存の語・同形語・flag の種類・残った ③ の直しと、統計・ベクトル・行列の単元（200 語、途中で止めた）

作成: 2026-09-25 ／ 対象: 09d60d5（Phase 2 algebra 2 report）→ 本コミット
指示: audits/phase2-algebra2-report.md を受けて 1〜5 を直し、6 で統計・ベクトル・線形代数の単元に進む。判断は `docs/DECISIONS.md` の「Phase 2 統計・ベクトルの単元の前の修正」（15 行）と「Phase 2 統計・ベクトルの単元」。

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified に上げた語はない。

## まとめ

- **1〜5 はすべて直した**（A〜E）。汎用の句は既存の 546 語のうち 102 語の文脈を見て、**12 語を形で数え直した**。途中で語形変化の穴（mode → mod など）も 1 つ見つけて直した（F）
- **6 は 6 バッチのうち 4 バッチ（200 語）で止めた**。あなたの「キリがいいところで止めて」を受けて、書きかけのバッチ 5（34 語、未コミット）は外した。バッチ 5 は線形代数の語が中心で、見積もりでは ③（人間レビュー行き）が **約 11 ／ 50（22%）** になり、どのみち「1 割を超えたら止める」に当たる（G）
- 生成した 200 語: **likely 193 ／ draft 7**。③ の人間レビュー行きはバッチごとに **0 ／ 3 ／ 1 ／ 5**（0% ／ 6% ／ 2% ／ **10.0%**）。バッチ 4 はちょうど 1 割で「超えた」ではないので進んだ
- 統計の語は 1 ソース頼みの記録が多い（新しい 200 語のうち 121 語。首位のソースは OpenStax Introductory Statistics 78、Khan Academy AP Statistics 38）。①→② に下がった語はない（H）
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて緑（K）。crosscheck 256/256 一致

## A. 汎用の句の見出しの確認（指示 1）

規則（DECISIONS）: 見出しがふつうの英単語だけの句（1 語の compare・region も含める）が ① か ② のとき、首位の候補の文脈を register ごとに 10 件見る。**別の意味が 5 件以上か、除くと判定が変わるとき**に TERM_FORMS の形で数え直す。

道具: `pnpm corpus:probe -- --contexts [n] "<候補>"`（lib.ts `sampleTermContexts`。件数と同じ照合で全ヒットから等間隔に n 件。表示は端末だけ）。形の記号を 2 つ足した: `A | B`（どちらか）、`!w`（前に置けば直前が w、後ろに置けば直後が w のものを数えない）。

見た語: ふつうの語だけの見出し 76 語（compare・region・phase・distance・first term・upper limit ほか）と、ふつうの語 2 つでできた名前 26 語（chain rule・comparison test・shell method・critical point ほか）。

### さかのぼって直した 12 語

| id | 前の数え方 | 文脈 10 件の中身 | 新しい形 | 判定の変化 |
|---|---|---|---|---|
| bounded | bounded（語形変化で bound とまとまる） | bounds of integration・upper bound・region bounded by が大半 | bounded sequence \| sequence is bounded \| bounded function \| function is bounded | 話 ① 836 → ③ 4、書 ① 982 → ① 18（register を written に） |
| parameter | parameter | 話し言葉 6 件が統計の母数（population parameter） | parameter t | ① のまま（15 ／ 31） |
| orientation | orientation | 話し言葉 5〜6 件が 3Blue1Brown の空間の向き | orientation of the curve | 話 ① → ③、書 ① 16（written に） |
| first-term | first term | 話し言葉の半分が式の最初の項 | first term of … sequence \| … series \| where the first term is | 話 ① → ③、書 ① 17 |
| last-term | last term | 書き言葉 8 件が FOIL・完全平方式の最後の項 | last term in … series \| last term of … sequence | 話・書とも ③ → OpenStax の呼び方で決着 |
| upper-limit ／ lower-limit | upper ／ lower limit | 書き言葉 6〜7 件が Σ の上端・信頼区間 | … limit of integration \| at the … limit | 話 ①（10）、書 ③（register を spoken に） |
| expansion | expansion of | 話し言葉 8 件が級数展開 | expansion of ( | 話 ③、書 ① 11 |
| pole | the pole | 話し言葉 5 件が MIT 18.03 の pole diagram | from the pole | ① のまま |
| write-with-the-same-base | with the same base | 大半が指数法則の multiply powers with the same base | as a power with the same base ／ with a common base | en.term を write with a common base に（書 ① 10 対 2） |
| write-dx-in-terms-of-du | solve for dx | 12 件中 4 件が関連変化率の solve for dx dt | solve for dx !dt | 話 ① 12 → ③ 8。**新しい ③（人間レビュー行き）** |
| phase-shift | variant horizontal shift | 大半が三角関数に限らない x 軸方向の平行移動 | horizontal shift を候補から外し pitfalls へ | ② → ① phase shift |

### 見たが直さなかった語（線に届かない）
general-term（話し言葉 4 件が in general terms）、phase（4 件が phase line ／ plane）、critical-point（4 件が MIT 18.03 の平衡点）、compose（書き言葉 3 件が composed of）、compare（統計の比較。意味は同じ「比べる」）、population・skewed・spread・magnitude（3〜4 件）。そのほかの語は別の意味が 0〜2 件だった。

## B. 既存の語を飛ばさない（指示 2）

今回の単元の行が当たった既存の語 15 語に、単元の意味・例文・level・ja.alt・related を足した: compare（分布の比較。中2）、**arithmetic-mean（平均値を寄せた。en.term が mean に。下）**、probability-density-function（数B。OpenStax の PDF が離散型も指すこと）、vector・component-form・dot-product（inner product ／ scalar product を en.alt。判定は ① dot product のまま）・coordinates-in-space・equation-of-a-plane（数C）、optimization-problem（数B の最適化・線形計画法）、transformation-of-a-variable（AP の transforming data を寄せた）。
one-to-one・composition-of-transformations・orthogonal-projection・gaussian-elimination（線形代数の単元）は、その単元の行がバッチ 5・6 に入るので**まだ見直していない**。

**平均値 → 相加平均（arithmetic-mean）**: データの平均も n 個の数の和を n で割った値で同じ概念なので寄せた。ja.term は相加平均のまま ja.alt に平均値・平均。候補に the mean !value（the mean value theorem を除く）を足すと話・書とも ① mean（11.6:1 ／ 117.6:1）になり、en.term を mean にした（arithmetic mean は en.alt）。validate の同形語の許可リストから arithmetic-mean ／ arithmetic-middle-term を外した。

## C. 三角不等式（指示 3）

validate に ja の同形語のチェックを足した: 2 つのエントリが同じ日本語（ja.term か ja.alt）を持つとき、`SAME_JA` にない組は警告、ある組は related と pitfalls で互いを名指ししていなければ警告（ja.term どうしは今までどおりエラー）。三角不等式（triangle-inequality の ja.alt ／ trigonometric-inequality の ja.term）を入れ、triangle-inequality の related に trigonometric-inequality を足した。546 語の中でほかの重なりはなかった。

## D. verified の条件（指示 4）

| | 前 | 後 |
|---|---|---|
| validate の verified の条件 | flag が 1 つでもあればエラー | **問題の flag** があるときだけエラー。どちらにも入っていないコードは警告 |
| 問題の flag | — | corpus-undecided・corpus-register-mismatch・corpus-auto-only・langlink-missing・langlink-mismatch・draft-reason |
| 記録の flag | — | corpus-human-settled・corpus-reference-fallback・corpus-no-fixed-expression |
| decide が verified を likely に下げる条件 | flag が 1 つでもある | 問題の flag があるとき |

表は `scripts/lib/flags.ts`（validate と decide が読む）。テスト 1 件（記録の flag なら verified で通り、問題の flag なら止まる）。
**スキーマの flags の description**（「verified への昇格を止める所見」）は変えていない。記録の flag は止めないので説明と運用が合っていない。直すならスキーマの変更になるので判断をお願いします。

## E. 残った ③ 6 語（指示 5）

6 語すべてに corpus-human-settled（note に日付と DECISIONS の節）を付け、register は外した。mapping_note: cauchy-schwarz-inequality・apollonian-circle に「米国の高校課程（OpenStax 6 冊・CED）には出てこない」（どちらも 0 件を確かめた）、linear-programming に「OpenStax は linear programming という名前を出さず feasible region で扱う（書き言葉 9 件、すべて OpenStax Algebra and Trigonometry）」。linear-programming は exact に note を持つので、validate の「exact なのに note」警告を corpus-human-settled の語では出さないようにした。triple-angle-formulas は draft のまま。

## F. パイプラインの変更

| 変更 | ファイル | 理由 |
|---|---|---|
| `--contexts [n]`（文脈の標本） | probe.ts・lib.ts | 指示 1 |
| 形の記号 `A \| B` と `!w`、レポートの表で `\|` をエスケープ | lib.ts・decide.ts | 1 つの句では別の意味を締め出せない語があった |
| **語形変化: e で終わる語から e を落とした形を作らない**（mode → mod、plane → plan、rate → rat、note → not、sine → sin）。逆に e を足した形も作らない | lib.ts | バッチ 1 の mode の書き言葉 204 件のうち 96 件が合同式の mod だった。既存のエントリで件数が変わったのは 8 か所、判定が変わったのは arcsine の書き言葉だけ（② → ① inverse sine。21 件の多くは記号 arcsin）で、note を直した |
| normalize に 11 個: five number summary、box and whisker(s) plot、scatterplot、boxplot、z score ／ table、p value、non-response、stem plot、stem and leaf、Type I ／ II error | lib.ts | 字幕のハイフン・つづりの違い。箱ひげ図の話し言葉 19 件、p 値の話し言葉の ② 割れなどを直した |
| flag の種類、SAME_JA、human-settled の note | validate.ts・lib/flags.ts | 指示 3・4・5 |
| 台帳の手順 12（PHASE2E_*） | fix_phase1.py・fix_decisions.py | 指示 6 |

テスト 88 → 96（形の記号 4、文脈の標本 1、e で終わる語 2、flag の種類 1）。

## G. 生成（指示 6）と止めた理由

対象の 388 行に今までの規則を先に当てて **291 語**にした（同じ概念 34 行、節の名前 21 行、引数を入れただけの行 45 行、phrases 候補へ 10 行。後の単元の同じ概念の行 6 行〔two-way-table・independent-events・independent・margin-of-error・数A の加法定理・乗法定理〕も寄せた。一覧は fix_decisions.py の PHASE2E_*）。

| | 語数 | likely | draft | ③ 人間 | 決まった言い方なし | 参照で見出し | コミット |
|---|---|---|---|---|---|---|---|
| バッチ 1（中1〜数I データ） | 50 | 50 | 0 | 0 | 5 | 4 | e31edb2 |
| バッチ 2（相関・検定・確率分布・推定） | 50 | 50 | 0 | 3 | 2 | 6 | ea8dd2e |
| バッチ 3（回帰・ベクトル・行列） | 50 | 50 | 0 | 1 | 6 | 4 | d07aae0 |
| バッチ 4（グラフ・AP Statistics 1〜6） | 50 | 43 | 7 | **5（10.0%）** | 0 | 9 | 36f6d47 |
| 計 | **200** | **193** | **7** | **9** | **13** | **23** | |

**③（人間レビュー行き）9 語**: covariance（0 件）、linear-transformation-of-a-random-variable（0 件）、rejection-region（話し言葉 6 件）、moving-average（話し言葉 3 件）、bayes-theorem（Bayes' rule 3 件）、blocking（block design 9 件）、completely-randomized-design（0 件）、normal-probability-plot（0 件）、voluntary-response-bias（4 件）。前からの write-dx-in-terms-of-du（A）と phrases 5 件を合わせて、decide の判断不能は 15 件。

**draft 7 語**（英語は固有の用語だが OpenStax・Wikipedia で確かめられない）: vertex-graph・tree（グラフ理論、MIT 6.042 だけ）、normal-probability-plot・voluntary-response-bias・blocking・completely-randomized-design・unbiased-estimator（AP Statistics）。

**止めた理由と残り**: 残りは 89 行（バッチ 5・6）。バッチ 5 は AP Statistics 7〜9 と線形代数で、書きかけの 34 語の probe では、one-sample ／ two-sample t-test・t-test for the slope・elementary matrix・LU decomposition・block matrix・adjugate・rank-nullity theorem・coordinate vector・standard matrix・eigenspace の **11 語が ③（参照もなし）**。線形代数の語は用例コーパスでは MIT OCW 18.06 だけに頼り、OpenStax に線形代数の本がないので参照でも決まらない。**続ける前に、線形代数の ③ をどう扱うか（参照に何を足すか、範囲外にするか）を決めてください。** 書きかけの 34 語は外して手元に残した（未コミット）。

## H. 1 ソース頼み（統計の語）

新しい 200 語のうち **121 語**で、首位の言い方がそのソースを抜くと変わる（decide の「1 ソース頼み」）。首位のソース: OpenStax Introductory Statistics 78、Khan Academy AP Statistics 38、OpenStax Calculus 9、OpenStax Algebra and Trigonometry 8、MIT の講義ノート 7。**①→② に下がった語はない**（どれも抜くと ③ に薄くなるだけで、別の言い方が首位にならない）。書き言葉はほぼ OpenStax 1 冊、話し言葉はほぼ Khan Academy 1 か所で決まっている、というのが統計の語の実態。variants の note と pitfalls にソースの内訳を書いた。

## I. 確かめた主張

「米国では〜」「OpenStax は〜」の主張は書いたあとに corpus:probe で確かめ、確かめられないものは消すか弱めた。確かめた主なもの: OpenStax は the data are が多い（71 対 40）、X ~ N(μ, σ) と標準偏差を書く（51 件）、X ~ B(n, p)（13 件）、標本分散は n − 1 で割る（本文に divide by the sample size minus one）、表は z の左側の面積（area to the left of the z-score）、確率は電卓の normalcdf（54 件）、単位行列は Iₙ、P(B | A) と書く（44 件）、addition rule は重なりを引く一般の式、ŷ = a + bx（11 件）、test of two proportions（3 件）。消したもの: two-sided test（0 件）、modified box plot（0 件）、multiply along the branches（0 件）、tally marks（0 件）、日本の教科書についての言い切り（標準誤差・中心極限定理・連続修正の扱い）、AP Statistics の呼び方の言い切り（general addition rule・segmented bar graph・two-proportion z-test は用例コーパスで 0 件）。

## J. 怪しい点（Phase 5 の監査へ）

- **Bayes が bay（湾）と同じ語になる**: 語形変化の規則が固有名の語末の s を複数形として落とす。今回は Bayes' の形だけを数えて避けたが、stem は直していない
- **vary ／ varies、estimate ／ estimation** のような y → i の変化や派生語はまとめない。今回は形を決めて避けた
- **見出しの意味の範囲を狭めた語**: 度数（frequency を frequency table ほかの複合語で数えた）、上端・下端（of integration ／ at the の形だけで話し言葉の the upper limit を落とした）、階級（en.term を class interval に）、一筆書き（Euler tour は閉じた道）
- **台帳の langlink が別概念だった語**（出典にしなかった）: 推定 → Presumption、自由度 → Degrees of freedom (physics and chemistry)、随伴行列 → Conjugate transpose（余因子行列の見出しも変えた）
- **ja の見出しを台帳から変えた語**: 質的データ・量的データ（カテゴリ変数・量的変数）、確率の加法定理・確率の乗法定理（一般加法法則・一般乗法法則）、抵抗性がある、連立一次方程式（線形方程式系）
- **① の言い方を en.term にせず variant にした語**（derivative-at-a-point の先例）: 不偏推定量（unbiased estimate）。四分位範囲は規則どおり en.term を IQR（略称）にした
- **SAME_EN_TERM の組を 1 つ外した**（arithmetic-mean の en.term が mean になったため）。等差中項は英語で arithmetic mean のまま

## K. 確認

```
python3 scripts/ledger/fix_phase1.py         # 手順 12: same 34 ／ section 21 ／ instance 45 ／ phrases 10
pnpm corpus:count && pnpm corpus:decide      # 主見出し決着 577 ／ 併記 78 ／ 決まった言い方なし 38 ／ 参照 87 ／ 人間が決めた 14 ／ 判断不能 15 ／ 不一致 0 ／ 直すこと 0
pnpm crosscheck -- --write                   # 256/256 一致（新しいタイトルはバッチごとに取得、残りは cached）
pnpm exec tsc --noEmit                       # 緑
pnpm validate                                # terms 746、警告 0
pnpm spell                                   # 0 件
pnpm test                                    # 96/96
pnpm build                                   # 緑。export: terms.json 735（draft 11 を除く）
```

取得は Wikipedia の langlink だけ（crosscheck.ts: 50 タイトル／リクエスト、タイムアウト 30 秒・リトライ 3 回、進捗 done/total、キャッシュして足りない分だけ）。用例コーパス・OpenStax・CED は取得済みのものを使った。
