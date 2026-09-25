# Phase 2 レポート — 参照 3 つ・一筆書き・語形変化・残った ③・flags の説明と、統計・ベクトル・線形代数の単元の残り（83 語）

作成: 2026-09-25 ／ 対象: cdd01ab（Phase 2 statistics / vectors report）→ 本コミット
指示: audits/phase2-stats-vectors-report.md を受けて 1〜5 を直し、6 で残りの単元に進む。判断は `docs/DECISIONS.md` の「Phase 2 統計・ベクトルの単元 2 の前の修正」（15 行）と「Phase 2 統計・ベクトルの単元 2」（24 行）。

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified に上げた語はない。

## まとめ

- **1〜5 はすべて直した**（A〜E。コミット 0303b2e）。参照 3 つを足したあと既存の全語の decide をやり直し、**③（判断不能）は 15 → 11**（terms は 10 → 6。phrases の 5 は変わらず）。統計の draft 7 語のうち **6 語が参照で出典つきの likely** になった
- **一筆書きは Levin の呼び方にしたが、Levin 4 版の呼び方は Euler path ではなく Euler trail** だった（B）。見出しは Euler trail、Euler path は en.alt
- **6 は最後まで進めた**: 残り 85 行 → 規則を当てて **83 語**、バッチ 5（50 語、b0bff70）とバッチ 6（33 語、fe88cc8）。③ の人間レビュー行きは **1 ／ 50（2%）と 2 ／ 33（6%）** で、1 割に届かなかった
- 生成した 83 語: **likely 79 ／ draft 4**。参照で見出しを決めた語 23、英語に決まった言い方がない 0
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて緑（J）。crosscheck 291/291 一致

## A. 参照 3 つ（指示 1）

| 参照 | 版 | ライセンス | 取得元 |
|---|---|---|---|
| AP Statistics の CED（College Board） | **Effective Fall 2026（5 単元）** | College Board の著作物 | apcentral.collegeboard.org の配布 PDF |
| Nicholson, *Linear Algebra with Applications*（Lyryx） | 2021A | CC BY-NC-SA 4.0 | eCampusOntario Open Library の配布 PDF（lyryx.com は名前解決できなかった） |
| Levin, *Discrete Mathematics: An Open Introduction* | 4th edition | **CC BY-NC-SA 4.0**（4 版で NC が加わった。3 版までは CC BY-SA） | discrete.openmathbooks.org |

一覧・区切り方・注意は新しい `docs/SOURCES.md`。規則 2 の順は **CED（AP Calculus ／ AP Statistics）→ OpenStax → Nicholson ／ Levin**（lib.ts `settleUndecided`。同じ段の中では件数の多い候補）。「英語に決まった言い方がない」の例外に数えるのは今までどおり CED だけ。

取得: `python3 scripts/ledger/refetch.py refs` で 4 冊を 1 回に（タイムアウト 30 秒・リトライ 3 回、進捗 done/total、テキストがあるものは取り直さない。2 回目は「4 cached, 0 to fetch」）。読み込みは `scripts/corpus/references.ts` にまとめ、count と probe が同じ区切りを見る。

区切り: CED は今までの TOPIC 区切り。本は `bookSections`（奇数ページの柱「n.m. 題」で節の範囲を知り、その少し前の本文の見出しから節を始める。目次・前付け・略解・索引は数えない）。途中で見つけた CED の区切りの誤り 2 つも直した（AP Statistics の前付けの見本 TOPIC 1.1 ページ、Exam Overview の前の改ページ。後者のせいで AP Calculus の試験の例題が topic 10.15 に数えられていた。変わったのは lagrange-error-bound の note の節だけ）。

### 参照を足す前後の ③

| | 前（HEAD の規則） | 参照を足した後 | 4 の決定の後 | 生成の後（最終） |
|---|---|---|---|---|
| ③ 判断不能（人間レビュー行き） | **15**（terms 10・phrases 5） | **11**（terms 6・phrases 5） | 8（terms 3・phrases 5） | 11（terms 6・phrases 5） |
| 参照で見出し | 87 | 91 | 91 | 114 |
| 人間が決めた ③ | 14 | 14 | 18 | 18 |

### 1 で決まった語

- **③ が参照で決着**: blocking（AP Statistics の CED topic 1.13。見出しは今の block design の形のまま）、completely-randomized-design（1.13）、voluntary-response-bias（1.12。含む関係で語のままの voluntary response を en.alt から外した）、covariance（Nicholson 8.11。ただし 4 のとおり人間の決定を先にした）
- **draft → likely（出典つき）6 語**: vertex-graph（Levin 2.1）、tree（Levin 2.2）、blocking・completely-randomized-design・voluntary-response-bias（CED 1.12〜1.13）、unbiased-estimator（CED topic 3.1。連語 unbiased estimator は 0 件で、「推定量が unbiased」の説明として出てくる）
- **決まらなかった**: normal-probability-plot（どの参照にもない。draft と ③ のまま）、bayes-theorem（語形変化を直しても Bayes の形は 3 件。どの参照にも名前がない）、linear-transformation-of-a-random-variable（0 件）
- **決着の資料が変わっただけの既存の語 10 語**: OpenStax → AP Statistics の CED（basic-properties-of-probability・causation・five-number-summary・general-multiplication-rule・negative-correlation・nonresponse・residual-plot・resistant-statistic・skewness・statistically-significant）。見出しが変わった語はない
- 人間が決めた ③ のうち cauchy-schwarz-inequality・linear-programming・nth-roots-of-unity・covariance は、規則だけでも Nicholson で決まるようになった（人間の決定が先なのでそのまま。decide のレポートの「規則だけなら」の列）

## B. 一筆書き（指示 2）

eulerian-path（id はそのまま）の en.term を **Euler trail**、en.alt に Euler circuit・Euler path・Euler walk・Euler tour。mapping near のまま、出典に Levin 2.4 を足した。

**指示の括弧（Euler path と Euler circuit）と違う点**: Levin 4 版は Euler trail（本文 51 件）と Euler circuit（22 件）で呼び、Euler path は別名として 1 回出てくるだけだった。「Levin の呼び方で」を優先して見出しを Euler trail にし、Euler path は en.alt に置いた。Levin の Euler trail は始点に戻るものも含み、一筆書きの範囲とそのまま合う。mapping_note に「一筆書きは戻る場合も戻らない場合も含む」と Levin の件数、pitfalls に「教科書によっては Euler path を戻らないものに限る」「MIT 6.042 の Euler tour は戻るもの」を書いた。用例コーパスは MIT 6.042 の Euler tour（話 23・書 14）だけで、見出しとは合わない（en.alt に残した。derivative-at-a-point の先例）。

## C. 語形変化（指示 3）

lib.ts の `stem` を直した（テスト 4 件）:

- **固有名の語末の s を落とさない**: `NOT_PLURAL_S`（bayes・stokes・descartes・pythagoras・apollonius ほか）。エントリの大文字の名前がこの表にあることをテストで見る（data/ を読む）
- 同じ穴として、**-us・-is・-ss で終わる語**と bias・lens などの s も落とさない（radius ／ radiuses、census ／ censuses、bias ／ biases ／ biased）
- **y と -ies ／ -ied の i を同じ文字にする**: vary ／ varies ／ varied ／ varying、probability ／ probabilities、surveyed（inflections は y の形も作る）

前後の counts.json の差: 件数が変わったのは **23 語 37 か所**（ほとんどが複数形 identities・probabilities・discontinuities・frequencies を数えるようになった分）。**判定が変わったのは 4 語**で、エントリを直した:

| id | 前 | 後 | 直したこと |
|---|---|---|---|
| limit-laws | 話 ① limit properties | 話 ② limit properties 17 ／ properties of limits 10 | en.register を both に |
| relative-frequency | 話 ③（4） | 話 ① 11（すべて Khan Academy） | en.register を both に |
| properties-of-integrals | 書 ① properties of the definite integral | 話・書とも ③ → OpenStax の呼び方で決着（見出しは同じ） | en.register を外した |
| properties-of-logarithms | 書 ② | 書 ① 3.3:1 | なし（variant はそのまま） |

is-biased は名詞の bias も数えるようになった（話 31 → 65）が判定は同じ。

## D. 残った ③ 4 語（指示 4）

4 語に corpus-human-settled（note に日付と DECISIONS の節）を付け、corpus-undecided を外した。register は主張しない。

| id | 見出し | mapping_note（件数は確かめた） |
|---|---|---|
| covariance | covariance | 米国の高校・初年次統計（OpenStax Introductory Statistics・Khan Academy の AP Statistics・AP Statistics の CED）には出てこない（**どれも 0 件**） |
| rejection-region | rejection region | OpenStax Introductory Statistics と AP Statistics は p 値で判断する（**OpenStax: p-value 475 件・rejection region 0 件、CED 2026 年版: p-value 100 件・rejection region 0 件**） |
| moving-average | moving average | そのまま |
| write-dx-in-terms-of-du | solve for dx | そのまま |

## E. flags の description（指示 5）

`schema/_common.schema.json` の flags の description を「A problem flag blocks promotion to 'verified'. A record flag records how a question about the entry was settled and does not block it.（表は scripts/lib/flags.ts）」にした。

## F. 生成（指示 6）

対象は 85 行（前のレポートの「約 89」は、すでに寄せた 4 行を数えていた）。規則を先に当てて 83 語: **質問票 → survey**（英語は調査票も調査も survey。ばらつく → spread と同じ）、**予測 → regression-line**（回帰直線の使い方。ŷ）。書きかけのバッチ 5（34 語）は捨てて作り直した。

| | 語数 | likely | draft | ③ 人間 | 決まった言い方なし | 参照で見出し | コミット |
|---|---|---|---|---|---|---|---|
| バッチ 5（AP Statistics 7〜9、Intro Statistics の検定、線形代数: 連立〜固有値） | 50 | 47 | 3 | **1（2%）** | 0 | 12 | b0bff70 |
| バッチ 6（直交・固有値の応用、Intro Statistics の分布と検定、数C のグラフ） | 33 | 32 | 1 | **2（6%）** | 0 | 11 | fe88cc8 |
| 計 | **83** | **79** | **4** | **3** | **0** | **23** | |

**③（人間レビュー行き）3 語**: t-test-for-the-slope（0 件。CED 2026 年版は回帰の推測を扱わず、OpenStax は相関係数の検定として扱う）、coefficient-of-variation（話し言葉 6 件。OpenStax Introductory Statistics・CED に 0 件）、geometric-multiplicity（話し言葉 2 件。Nicholson はこの名前を使わない）。前からのものと合わせて decide の判断不能は 11 件（terms 6・phrases 5）。

**draft 4 語**: t-test-for-the-slope、pivot・free-variable（MIT 18.06 だけ。Nicholson は leading 1 ／ parameter と書き、Wikipedia は曖昧さ回避か論理学の別概念）、geometric-multiplicity。

**参照で見出しを決めた 23 語**: CED で one-sample t-test・two-sample t-test・statistical inference（推測統計）、OpenStax で hypergeometric distribution・power of the test、Nicholson で elementary matrix・LU factorization・block matrix・cofactor expansion・adjugate・**dimension theorem**（階数・退化次数の定理）・coordinate vector・standard matrix・eigenspace・diagonalization・algebraic multiplicity・Markov chain・dynamical system・**Gram-Schmidt algorithm**・orthogonal complement・QR factorization・quadratic form、Levin で principle of inclusion-exclusion。

**コーパスの判定で見出しが台帳と変わった主な語**: 連立一次方程式 → linear system（書き言葉は system of linear equations を variant）、対応のある t 検定 → paired samples（mapping near。英語は検定でなく標本の種類で呼ぶ）、期待度数 → expected frequency、観測度数 → observed value、独立性の検定 → test of independence、基本変数 → pivot variable、全射 → surjective、誤差限界 → margin of error（書き言葉は error bound を variant）。

**ja の見出しを台帳から変えた語**: 線形方程式系 → 連立一次方程式、随伴行列 → **余因子行列**（台帳の langlink は共役転置で別概念）、標本抽出の誤り → 標本誤差、離散グラフ → グラフ（離散数学）、包含排除原理 → 包除原理、グラム・シュミットの直交化 → 〜の直交化法（どれも台帳の語は ja.alt）。

**統合と移動**: 質問票 → survey、予測 → regression-line（fix_decisions.py の PHASE2E_SAME ／ PHASE2E_INSTANCE の末尾。fix_phase1.py を回し直して ledger に反映）。

**既存の語で単元に当たったもの**: one-to-one（線形写像の単射）・composition-of-transformations（合成は行列の積 BA）・gaussian-elimination（既約行階段形）・orthogonal-projection（部分空間への正射影）に線形代数の意味と Nicholson の出典を、survey・regression-line に寄せた語の意味を足した。

**1 ソース頼み**: 新しい 83 語のうち 55 語（首位のソース: OpenStax Introductory Statistics 22、MIT 18.06 18、MIT の講義ノート 8、3Blue1Brown 4 ほか）。①→② に下がった語はない。**線形代数の話し言葉はほぼ MIT 18.06 1 か所で決まっている**。

## G. パイプラインの変更

| 変更 | ファイル |
|---|---|
| 参照 3 つの取得（refs）、CED の区切りの直し | refetch.py |
| `ReferenceHits` に cedStats・nicholson・levin、`bookSections`、`settleUndecided` の順（CED → OpenStax → Nicholson ／ Levin） | lib.ts・references.ts（新規）・count.ts・probe.ts・decide.ts |
| `stem` と `inflections`（固有名・-us ／ -is、y ／ ies ／ ied） | lib.ts |
| TERM_FORMS 16 語（pivot・minor・span・basis・dimension・rank・onto・matched pairs・edge・path・graph・statistics・statistic・independent events・error bound・quadratic form） | lib.ts |
| normalize: LU ／ QR factorization、inclusion/exclusion | lib.ts |
| flags の description | schema/_common.schema.json |

テスト 96 → 105（参照の順 3、CED の見本ページと改ページ 1、本の区切り 1、語形変化 4）。

## H. 確かめた主張

書いたあとに counts.json（`bd`: ソース別の内訳）と参照の件数で確かめ、違っていたものは直した: variant の note 2 つ（system of linear equations の内訳、matrix is invertible は「すべて MIT OCW」）を書いたあとの照合で直した。確かめた主なもの: p-value（OpenStax 475・CED 100）と rejection region（どちらも 0）、covariance（コーパス・CED とも 0、Nicholson 8.11 に 3）、Levin の Euler trail 51 ／ circuit 22 ／ path 1、Nicholson は pivot・free variable を使わない（0 件。leading 1 16、leading variable 15）、Gauss-Jordan 0 件、geometric multiplicity 0 件、CED 2026 年版に goodness-of-fit・回帰の推測（t-test for the slope）が出てこないこと、CED の対応のある検定は matched pairs design の one-sample t-test（topic 4.4）、isomorphic の書き言葉はグラフの同型（文脈 5 件）、observed value の文脈はカイ二乗検定の度数（6 件）。

## I. 怪しい点（Phase 5 の監査へ）

- **AP Statistics の CED は 2026 年版**（5 単元）。台帳の us-ap-statistics-1〜9 は旧版の分け方で、topic 番号は 2026 年版のもの。旧版で扱っていた語（傾きの推測、適合度検定）は CED で確かめられない
- **Euler trail**: 指示の括弧（Euler path）と違う見出しにした（B）
- **Nicholson の呼び方で決めた見出し**は 1 冊の流儀: dimension theorem（Wikipedia は Rank–nullity theorem）、Gram-Schmidt algorithm（process は en.alt）、LU factorization。ほかの教科書（Lay・Strang）は確かめられない
- **Nicholson は eCampusOntario の配布 PDF**（出版元のサイトに届かなかった）
- **線形代数の register は MIT 18.06 頼み**（話し言葉の首位の多くが 18.06 だけ）。書き言葉のコーパスに線形代数の本がないので、ほとんどの語が register spoken になった
- 形で数えても別の意味が混ざる語: characteristic polynomial（話し言葉 50 件のうち 41 件が MIT 18.03 の微分方程式）、linear system（18.03 の系が 10 件中 4 件）、degrees of freedom（話し言葉に「パラメータの数」の意味）、error bound（書き言葉 132 件のうち OpenStax Calculus の 8 件は数値積分の誤差）、graph の形（書き言葉 196 件のうち OpenStax の 6 件）
- **見出しが検定の名前でない**: 対応のある t 検定の en.term paired samples（英語は標本の種類で呼ぶ）。観測度数の observed value は度数でない値にも使う語
- 語形変化の直しで **is-biased が名詞の bias も数える**ようになった（判定は同じ）
- 本の区切りは柱のない短い節を前の節に含める。節の番号はページ単位のずれがありうる

## J. 確認

```
python3 scripts/ledger/refetch.py refs     # refs: 4 references, 4 cached, 0 to fetch（2 回目）
python3 scripts/ledger/fix_phase1.py       # 手順 12: same 35 ／ section 21 ／ instance 46 ／ phrases 10
pnpm corpus:count && pnpm corpus:decide    # 主見出し決着 627 ／ 併記 83 ／ 決まった言い方なし 38 ／ 参照 114 ／ 人間が決めた 18 ／ 判断不能 11 ／ 不一致 0 ／ 直すこと 0
pnpm crosscheck -- --write                 # 291/291 一致（新しいタイトルだけ取得、残りは cached）
pnpm exec tsc --noEmit                     # 緑
pnpm validate                              # terms 829、警告 0
pnpm spell                                 # 0 件
pnpm test                                  # 105/105
pnpm build                                 # 緑。export: terms.json 820（draft 9 を除く）
```
