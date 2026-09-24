# Phase 1 修正 3 レポート — 曖昧さ回避の照合・register の付け直し・コーパス全量・重複除去

作成: 2026-09-24 ／ 対象: 666a9a6 → 本コミット ／ 手順: `pnpm corpus:fetch:openstax` と `pnpm corpus:fetch:captions -- khan-ap-calc`（1 つのバックグラウンドジョブで並列）→ `python3 scripts/ledger/wikien.py` → `python3 scripts/ledger/fix_phase1.py` → `pnpm corpus:count -- --no-dedupe`（比較用）→ `pnpm corpus:count && pnpm corpus:decide -- --write`

## まとめ

- **決定 1（曖昧さ回避）: 出典を失った 8 件のうち 5 件が戻った**（origin・inverse・scalar・work・kernel）。戻らなかった 3 件（face・intersection・multiplicity-of-a-zero）は en.term が曖昧さ回避ページではない（人の顔の記事・交わり一般の記事・記事なし）ので、新しい規則の対象外
  - 規則全体では title 258 行のうち **ok 142 → 166（+24）**、wikipedia を外した行は 116 → 92
  - **副作用（例外行は足していない）**: 修正 2 で「別概念」と見た 代入 → Substitution (logic)、極 → Zeros and poles も戻り、source が wikipedia-langlink になった。外れると見込んでいた 5 件のうち 4 件（相似変換・特性方程式・極・発散する）も ok に戻った。下の B-2
- **決定 2（移項する）**: variants を 3 つとも spoken、頻度順（from both sides → to both sides → to the other side）。written の variant・例文・pitfall は置いていない
- **決定 3（代入する）**: plug in（spoken）→ substitute（both）→ substitute back（spoken、3 番手）→ sub in。note の「書き言葉コーパスは未取得」を直した
- **決定 4（コーパス全量）**: khan-ap-calc 544 本（全本に人手字幕）、OpenStax Calculus Vol 2・3、Algebra and Trigonometry 2e、Precalculus 2e、Introductory Statistics 2e を取得。コーパスは **7 → 11 ソース、186 万 → 357 万語**（重複除去後）
- **決定 5（重複除去）**: OCW の 484 ファイルのうち **159 ファイルが同じ演習動画の写し**だった（18.01 で 87、18.02 で 72）。OCW の語数は 1,401,681 → 1,132,524（−19.2%）。OCW の件数は、例として plug in 450 → 353、f prime of x 223 → 122、x squared 1,383 → 732。**①②③ の判定は 1 件も変わらなかった**
- **決定 6**: STYLE 原則 5 に、CC BY-NC-SA のコーパスの文を例文・定義文に転載しないこと、使うのは件数だけであること、データは CC0 のままであることを明記した
- 再判定（修正 2 と比べて）: 11 件中 **8 件で判定が変わった**。③ 判断不能 **3 → 1**（integral-definite だけ残る）。register 不一致 **2 → 1**（substitute は解消、移項は「話」が消えて「書」が出た）
- **人間レビューに残るもの: ③ 1 件、register 不一致 1 件（計 2 件）**。一覧は F
- `pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて緑（test 41/41、build 21 ページ、export まで）

## A. 取得（決定 4）

2 本を 1 つのバックグラウンドジョブで並列に回した。進捗は Khan を 100 本ごとに報告した（100 → 200 → 300 → 400 → 500 → 544/544）。

| 対象 | ソース ID | 件数 | リクエスト | 結果 | 語数（生） | 重複除去後 |
|---|---|---:|---:|---|---:|---:|
| OpenStax Calculus Vol 1（既存） | openstax-calculus | 54 節 | 0（キャッシュ） | 54/54 | 306,447 | ↓ 合算 |
| OpenStax Calculus Vol 2 | openstax-calculus | 53 節 | 1＋32（21 節は Vol 1 と同じモジュールでキャッシュ） | 53/53 | 304,078 | ↓ 合算 |
| OpenStax Calculus Vol 3 | openstax-calculus | 53 節 | 1＋44（9 節は共有） | 53/53 | 415,987 | 834,155（3 冊計） |
| OpenStax Algebra and Trigonometry 2e | openstax-algtrig | 93 節 | 1＋93 | 93/93 | 584,931 | 537,928 |
| OpenStax Precalculus 2e | openstax-precalculus | 86 節 | 1＋41（45 節は Algebra and Trigonometry と共有） | 86/86 | 527,873 | 39,912 |
| OpenStax Introductory Statistics 2e | openstax-introstats | 101 節 | 1＋101 | 101/101 | 299,997 | 289,765 |
| Khan Academy AP Calculus AB・BC | khan-ap-calc | 再生リスト 25 本 → 動画 544 本 | 25＋544 | **544/544 に人手字幕** | 565,883 | 559,104 |

- OpenStax: 440 節（新規ダウンロード 311 ＋ 共有・既存のキャッシュ 129、コレクション 5）を 1 回で取得。**リトライ 0 回**。コミットは各リポジトリで固定（calculus-bundle 8dbc2ce、college-algebra-bundle 4639916、introductory-statistics-bundle 1f6a358）。版は 2e で、リポジトリに初版は無い。ライセンスは **5 冊とも CC BY-NC-SA 4.0**（コレクションのメタデータで確認。PLAN 15 の「CC BY 4.0」は誤り）
- Khan: チャンネルにある AP Calculus の再生リスト 25 本をすべて指定した（AB 16 本・BC 9 本。solved exams を含む）。BC は AB の動画を繰り返すので、動画 ID で重複を除いて 544 本になった。**リトライ 0 回**、字幕なし 0 本
- **字幕言語を直した**: Khan の人手字幕は名前付きトラック `en-ehkg1hFWq8A`（English - Default）で出ている。従来の `en,en-US` では試した動画が「字幕なし」になったので、`en(-US|-<11 文字のトラック ID>)?` にした（`fetch-captions.ts` と `.sh` の両方）。自動字幕とその機械翻訳（en-bg など）は `--write-subs` では読まれない
- 全リクエストに次の上限を付けた。OpenStax はタイムアウト 30 秒・リトライ上限 3 回。yt-dlp はソケットタイムアウト 30 秒、プロセスタイムアウト 120 秒、リトライ上限 3 回（429 は 60 秒×回数待つ）で、動画の間は 1.5 秒空けた。上限に達したものは飛ばして終了コード 1 で終わり、再実行で埋まる
- キャッシュ: OpenStax の生の CNXML は `corpus/openstax-calculus/raw/` と `corpus/openstax-raw/<repo>/` に置いた（Algebra and Trigonometry と Precalculus は共有）。Khan の再生リストは `corpus/khan-ap-calc/playlists/`、字幕は `<動画 ID>.txt`、字幕なし・非公開の動画は `state.json` に置いた。**もう一度流して取得 0 件**（OpenStax 440 件キャッシュ・0 件ダウンロード、Khan 544/544 キャッシュ）を確かめた
- manifest は Khan 側が 25 本ごとに読み直して書き戻す。並列の OpenStax 側も書く直前に読み直すので、互いの行を消さない。最終 1,650 ファイル

**集めていないもの**（PLAN 15 にあるが、今回の指示の一覧に無かった）: `khan-ap-stats`、YouTube の 6 チャンネル（Professor Leonard ほか）、`mit-notes`（OCW の講義ノート）。また khan-algebra（182/235 本）は、上の字幕言語の理由で最大 53 本を取りこぼしている可能性がある。取り直してはいない。

## B. 決定 1: 曖昧さ回避ページのリンクで照合

規則: en.term の記事が曖昧さ回避ページ（リダイレクト解決後）のとき、そのページがリンクしている記事（こちらもリダイレクト解決後）に ja 側着地記事の en langlink 先が含まれていれば ok。それ以外は修正 2 と同じ。例外行は足していない。

`wikien.py` は曖昧さ回避ページ 40 件のリンク先を取得した（1 ページ 1 クエリ・タイムアウト 30 秒・リトライ上限 3 回・`links n/40` で進捗表示・キャッシュ済み）。結果は `wiki_en.json` の `disambig_links` に固定してある。ja 208 件・en 691 件はキャッシュから読んだ。

### B-1. 出典を失っていた 8 件

| id | 見出し | 曖昧さ回避ページ | 結果 | source |
|---|---|---|---|---|
| origin | 原点 | Origin | **戻った**（Origin (mathematics) にリンク） | editorial → wikipedia-langlink |
| inverse | 裏 | Inverse | **戻った**（Inverse (logic)） | editorial → wikipedia-langlink |
| scalar | スカラー | Scalar | **戻った**（Scalar (mathematics)） | editorial → wikipedia-langlink |
| work | 仕事 | Work | **戻った**（Work (physics)） | textbook → wikipedia-langlink |
| kernel | 核 | Kernel | **戻った**（Kernel (algebra)） | textbook → wikipedia-langlink |
| face | 面 | （Face は人の顔の記事で、曖昧さ回避ではない） | 戻らない（別の記事） | editorial |
| intersection | 共通部分 | （Intersection は交わり一般の記事） | 戻らない（別の記事） | editorial |
| multiplicity-of-a-zero | 根の重複度 | （en.term の記事なし） | 戻らない | textbook |

**8 件中 5 件が戻った。**

### B-2. ok になった 24 件（曖昧さ回避経由）

**要確認**: † の 5 件は、修正 2 で私が「別概念」と見た行か、外れると見込んでいた行。規則を機械的に当てると戻る。曖昧さ回避ページは語の意味を全部並べるので、「リンクしている」は「その意味もある」までしか言わない。例外は足していないので、外すなら `fix_decisions.py` に 1 行ずつ足す形になる。

| id | 見出し | en | ja 記事 → en langlink | 曖昧さ回避ページ（リンク数） | source |
|---|---|---|---|---|---|
| origin | 原点 | origin | 原点 (数学) → Origin (mathematics) | Origin（119） | editorial → **wikipedia-langlink** |
| round | 四捨五入する | round | 端数処理 → Rounding | Round（38） | editorial |
| substitution † | 代入 | substitution | 代入 (論理学) → Substitution (logic) | Substitution（25） | editorial → **wikipedia-langlink** |
| ray | 半直線 | ray | 直線 → Line (geometry) | Ray（78） | editorial |
| die | さいころ | die | サイコロ → Dice | Die（31） | editorial |
| rationalize | 有理化する | rationalize | 有理化 → Rationalisation (mathematics) | Rationalization（10） | editorial |
| or | または | or | 論理和 → Logical disjunction | Or（52） | editorial |
| complement | 補集合 | complement | 差集合 → Complement (set theory) | Complement（35） | editorial |
| inverse | 裏 | inverse | 裏 (論理学) → Inverse (logic) | Inverse（15） | editorial → **wikipedia-langlink** |
| differentiate | 微分する | differentiate | 微分 → Derivative | Differentiation（19） | editorial |
| integrate | 積分する | integrate | 積分法 → Integral calculus | Integration（44） | editorial |
| characteristic-equation † | 特性方程式 | characteristic equation | 固有多項式 → Characteristic polynomial | Characteristic equation（4） | editorial |
| diverge † | 発散する | diverge | 発散 (ベクトル解析) → Divergence | Divergence (disambiguation)（33） | editorial |
| scalar | スカラー | scalar | スカラー (数学) → Scalar (mathematics) | Scalar（14） | editorial → **wikipedia-langlink** |
| pole † | 極 | pole | 極 (複素解析) → Zeros and poles | Pole（49） | editorial → **wikipedia-langlink** |
| similarity-transformation † | 相似変換 | similarity transformation | 行列の相似 → Matrix similarity | Similarity transformation（5） | textbook |
| work | 仕事 | work | 仕事 (物理学) → Work (physics) | Work（64） | textbook → **wikipedia-langlink** |
| constraint | 制約条件 | constraint | 制約 (数学) → Constraint (mathematics) | Constraint（30） | textbook |
| cofactor | 余因子 | cofactor | 小行列式 → Minor (linear algebra) | Cofactor（5） | textbook |
| kernel | 核 | kernel | 核 (代数学) → Kernel (algebra) | Kernel（36） | textbook → **wikipedia-langlink** |
| base-of-a-solid | 底面 | base | 底 (初等幾何学) → Base (geometry) | Base（61） | editorial |
| factor-an-expression | 因数分解する | factor | 因数分解 → Factorization | Factor（46） | editorial |
| congruence-modulo-n | 合同式 | congruence | 整数の合同 → Congruence (integers) | Congruence（23） | editorial |
| secant | セカント | secant | 三角関数 → Trigonometric functions | Secant（6） | textbook |

- 修正 2 で「別概念」と見た行（B-3）: **代入**（論理学の置換）と **極**（複素解析の極。極座標の極ではない）
- 外れると見込んでいた 5 件: **相似変換・特性方程式・極・発散する** は ok に戻った（発散する の ja 記事はベクトル解析の発散で、数列・級数の diverge とは別）。**直交座標** だけ外れたまま（曖昧さ回避ではなく別の記事）
- source が変わったのは 7 件（上の太字）。残りの 17 件は ja.basis が wikipedia になっただけで、source は元の editorial / textbook のまま（source が langlink でなかった行）
- 6 件は `wiki_en` を今回の langlink で埋めた（round・characteristic-equation・similarity-transformation・cofactor・base-of-a-solid・congruence-modulo-n）

### B-3. 台帳の数

| | 修正 2 | 修正 3 |
|---|---:|---:|
| title 行 → ok | 142 | **166** |
| title 行 → wikipedia を外した | 116 | **92**（別の記事 43 ／ en.term の記事なし 27 ／ en.term は曖昧さ回避 13 ／ ja 記事に en 版なし 9） |
| ja.basis: mext ／ wikipedia ／ editorial | 363 ／ 444 ／ 1550 | 363 ／ **468** ／ **1526** |
| ja.check: ok ／ alt ／ — | 790 ／ 17 ／ 1550 | **814** ／ 17 ／ **1526** |
| source: wikipedia-langlink ／ editorial ／ textbook ／ wikidata | 305 ／ 1242 ／ 643 ／ 167 | **312** ／ **1237** ／ **641** ／ 167 |
| flag wiki-rejected | 229 | **205** |

曖昧さ回避のまま外れた 13 件は、そのページが langlink 先にリンクしていなかった: unknown（未知数）、increase（増加する）、SSS・SAS・ASA・AA、tree diagram（樹形図）、any（任意の）、false（偽）、digit（桁）、reduce（約分する）、test（検定する）、power（検出力）。

## C. 決定 2・3: register の付け直し

### 移項する `move-term-to-other-side`

| | 前 | 後 |
|---|---|---|
| variants | to the other side（spoken）／ from both sides（written）／ to both sides（written） | **from both sides（spoken）→ to both sides（spoken）→ to the other side（spoken）** |
| 例文 2 | "Subtracting 5 from both sides gives 2x = 8."（written） | "Subtract 5 from both sides, and now you've got 2x = 8."（spoken。自作） |
| pitfall 1 | 答案では「両辺から引く」と書く | 教室では両辺の言い方が move ... over より多い。どちらも通じる |
| mapping_note | 書くときは両辺の言い方が標準 | 書き言葉への言及を外し、話し言葉の頻度だけ書いた |

written については何も主張していない。ただし再判定で書き言葉が決まったので、F に不一致として残る。

### 代入する `substitute`

| | 前 | 後 |
|---|---|---|
| variants | plug in（spoken）／ substitute（spoken）／ sub in（spoken） | **plug in（spoken）→ substitute（both）→ substitute back（spoken）→ sub in（spoken）** |
| collocations | … ／ substitute back ／ … | substitute back は variants に移した（候補表現としては同じ 1 本で、二重には数えない） |
| note | 「書き言葉コーパスは未取得」「OCW 5 コース（約 93 万語）で 220 件」 | 今回の件数に直した（話 358 ／ 253 ／ 22、書 substitute 704 対 plug in 5） |

## D. 決定 5: 重複除去

`corpus:count` は数える前に重複を除くようにした（`lib.ts` の `dedupe`。`--no-dedupe` で旧来の数え方）。

- **同じファイル**: 前のファイルと 8 語シングルの 50% 以上が重なるファイルは、写しとして丸ごと捨てる
- **同じ文**: 残ったファイルでは、既に出た 8 語以上の文を消す。8 語未満の文（"Plug it in." など）は言い直しとして残す
- 全ソース横断で manifest 順に処理し、最初の写しを残す。捨てたファイルの一覧は `corpus/dedupe.txt`（gitignore、274 件）

OCW の実態: 演習（recitation）動画が、YouTube ID 名（`7vVBtiVXIw.txt`）と `MIT18_01SCF10Rec_41_300k.txt` 名の 2 回入っていた。ファイル対の重なりは **70% 以上か 10% 未満のどちらか**で、間の対は無い。なので閾値 50% で判断が割れる対は無い。文単位の重複で目立つのは講義冒頭のライセンス告知（除去前は同じ文が 58 ファイルにあった）。

### D-1. ソースごと

| ソース | 写しとして捨てたファイル | 消した文 | 語数 前 → 後 |
|---|---:|---:|---|
| mit-18.01 | **87 / 209** | 111 | 487,139 → 343,133（−29.6%） |
| mit-18.02 | **72 / 142** | 29 | 246,694 → 122,807（−50.2%） |
| mit-18.06 | 0 / 36 | 6 | 196,768 → 196,692 |
| mit-18.03 | 0 / 72 | 7 | 236,317 → 236,214 |
| mit-6.042 | 0 / 25 | 79 | 234,763 → 233,678 |
| **OCW 計** | **159 / 484** | 232 | **1,401,681 → 1,132,524（−19.2%）** |
| khan-algebra | 0 / 182 | 36 | 175,056 → 174,725 |
| khan-ap-calc | 5 / 544 | 155 | 565,883 → 559,104 |
| openstax-calculus | 30 / 160 | 347 | 977,634 → 834,155（Vol 2 の積分の章などが Vol 1 と同じ節） |
| openstax-algtrig | 0 / 93 | 430 | 543,702 → 537,928 |
| openstax-precalculus | **78 / 86** | 125 | 491,320 → 39,912（Algebra and Trigonometry と同じ節） |
| openstax-introstats | 2 / 101 | 807 | 299,873 → 289,765 |

語数の「前」は正規化後の数え方。A の表の語数は取得時の生の数え方なので少し違う。

### D-2. OCW の件数への影響（生の件数、OCW 5 コースの合計）

| 項目 | 候補表現 | 除去前 | 除去後 |
|---|---|---:|---:|
| symbols/power-squared | x squared | 1,383 | **732** |
| terms/substitute | plug in | 450 | **353** |
| | substitute | 178 | 128 |
| | substitute back | 7 | 4 |
| symbols/derivative-prime | f prime of x | 223 | **122** |
| terms/completing-the-square | completing the square | 47 | 30 |
| terms/move-term-to-other-side | to the other side | 46 | 28 |
| | to both sides | 13 | 8 |
| | from both sides | 9 | 6 |
| terms/find-a-common-denominator | common denominator | 21 | 15 |
| terms/discriminant | discriminant | 16 | 15 |
| terms/quadratic-formula | quadratic formula | 16 | 15 |
| symbols/integral-definite | the integral from a to b of f of x d x | 2 | 1 |
| terms/derivative-at-a-point | f prime of a | 1 | 1 |

同じ全量コーパスで除去あり・なしを比べると、**①②③ の判定と見出しの順序は 11 件とも同じ**だった。変わったのは比だけ（例: completing the square の話し言葉 32.0:1 → 23.5:1、x squared 504.2:1 → 373.2:1）。

## E. 再判定（修正 2 → 修正 3）

コーパス: 7 ソース 1,860,173 語（修正 2） → **11 ソース 3,568,113 語**（重複除去後。話し言葉 1,866,353 ／ 書き言葉 1,701,760）。1 ソースの上限は max(25%, 1/11) = 25%。最大の openstax-calculus が 23.4% なので、重みは全ソース ×1.00 になった。

### E-1. 判定が変わった語（8 件）

| 項目 | 話し言葉 修正 2 → 修正 3 | 書き言葉 修正 2 → 修正 3 | flag |
|---|---|---|---|
| terms/derivative-at-a-point | ③（1 件） → **① f prime of a（6.0:1）** | ③（1 件） → ③（7 件） | corpus-undecided → なし |
| terms/squeeze-theorem | ③（0 件） → **① squeeze theorem（9.0:1）** | ③（8 件） → **① squeeze theorem（13.0:1）** | corpus-undecided → なし |
| terms/completing-the-square | ① 29.4:1 → ① 23.5:1 | ③（0 件） → **① completing the square（52.0:1）** | なし |
| terms/discriminant | ①（唯一） | ③（1 件） → **① discriminant（唯一）** | なし |
| terms/find-a-common-denominator | ①（唯一） | ③（2 件） → **① common denominator（26.5:1）** | なし |
| terms/quadratic-formula | ① 11.4:1 → ① 12.0:1 | ③（8 件） → **① quadratic formula（47.0:1）** | なし |
| terms/move-term-to-other-side | ② 98 ／ 90 ／ 48 → ② from both sides 159 ／ to both sides 146 ／ to the other side 31 | ③（3 件） → **② from both sides 24 ／ to both sides 24** | 不一致（話）→ **不一致（書）** |
| terms/substitute | ② plug in 441 ／ substitute 213 ／ substitute back 11 → ② 358 ／ 253 ／ 22 | ①（唯一、66 件） → ① substitute（140.8:1、704 件） | 不一致（話・書）→ **なし** |

変わらなかったもの: symbols/derivative-prime（① f prime of x ／ ③）、symbols/power-squared（① x squared ／ ③）、symbols/integral-definite（③ ／ ③）。

気づいたこと（処理には使っていない）:
- 話し言葉の plug in 358 件は **ほぼ OCW**（18.01 198・6.042 73・18.03 44・18.02 32・18.06 6）で、Khan は 5 件だけ（algebra 0、AP Calc 5）。Khan は substitute を使う（125 件）。1 ソースの上限 25% の範囲内だが、「教室で最も多い」は大学の講義寄りの結論
- 移項の from both sides ／ to both sides（話）は **ほぼ Khan**（159 件中 153、146 件中 138）。to the other side は OCW 寄り（31 件中 28）

## F. 人間レビューに残るもの（③ と register 不一致）

**計 2 件。**

### ③ コーパスで決まらないもの（1 件）

| 項目 | 話し言葉 | 書き言葉 |
|---|---|---|
| symbols/integral-definite | 重み付け後 3 件（10 未満） | 0 件 |

### register がエントリと食い違うもの（1 件）

| 項目 | 食い違い | コーパスの結論 |
|---|---|---|
| terms/move-term-to-other-side | 書: from both sides / to both sides | 話 ② from both sides 159 ／ to both sides 146 ／ to the other side 31 ／ 書 ② from both sides 24 ／ to both sides 24 |

決定 2 で written は「判断不能として何も主張しない」にした。そのあと OpenStax 6 冊で書き言葉に ② が出た（Algebra and Trigonometry 12 ／ 13、Calculus 10 ／ 10）。エントリは直していない（絶対ルール 9。register を書き換えるのは人間）。解き方は 2 通りある。① written 側にも同じ 2 つを入れる（register を both にする）。② 書き言葉の件数は数学の文章中の出現で、答案の書き方の根拠ではないと判断して据え置き、flag に理由を書く。

## G. 決定 6: STYLE.md

原則 5 に追記した: 「用例コーパスの文も転載しない。MIT OCW・OpenStax（と Khan Academy の字幕）は CC BY-NC-SA なので、例文・定義文・note にコーパスの文を写さない。コーパスから使うのは件数だけ。辞典のデータは CC0 のまま」。今回書いた例文（移項の例文 2）と note は自作で、件数だけを引いている。

合わせて、STYLE の直訳禁止リストと register 表の 移項・代入 の行をコーパスの結論に合わせた（「plug in が圧倒的」→ 併記など）。

## H. 変えたファイル

- `scripts/ledger/wikien.py`（曖昧さ回避ページのリンク取得）、`fix_phase1.py`（照合規則）、`wiki_en.json`、`ledger/terms.csv`、`ledger/README.md`
- `scripts/corpus/fetch-openstax.ts`（6 冊・全体の done/total・共有キャッシュ）、`fetch-captions.ts`（新設、`pnpm corpus:fetch:captions`）、`fetch-captions.sh`（字幕言語）、`fetch.ts`（ライセンス表記）
- `scripts/corpus/lib.ts`（`dedupe`）、`count.ts`（重複除去と `--no-dedupe`）、`tests/corpus.test.ts`（dedupe のテスト 2 件）
- `data/terms/move-term-to-other-side.json`、`substitute.json`（手で直した）、ほか 9 件は `corpus:decide -- --write` が evidence と flags を書き換えた
- `audits/corpus-2026-09-24.md`（同じ日付で 3 度目の上書き。前の版は 666a9a6 にある）
- `docs/DECISIONS.md`（修正 3 の 10 行）、`docs/STYLE.md`、`CLAUDE.md`（コマンド一覧）、`cspell.json`

## I. 検証

| コマンド | 結果 |
|---|---|
| `pnpm validate` | passed（0 warning） |
| `pnpm spell` | 195 ファイル・0 件（source ID の algtrig・introstats とトラック ID の ehkg を辞書に追加） |
| `pnpm test` | 41/41 |
| `pnpm build` | 21 ページ、export まで完了 |

補足: `tsc --noEmit` では `scripts/corpus/decide.ts(113)` に型エラーが 1 件ある。これは 666a9a6 の時点からあるもので（tsx は型検査をしないので実行には影響しない）、今回は触っていない。
