# DECISIONS

仕様（docs/PLAN.md）に書かれていない判断を 1 行ずつ記録する。止まらずに進むための帳簿であって、
議事録ではない。スキーマを変えた場合は必ずここに理由を書く。

書式: `YYYY-MM-DD | フェーズ | 決めたこと | 理由`

## Phase 0

- 2026-09-11 | 0 | 名前は **MathEigo**（あなたが決定）。当初の仮称 MathBridge は取り下げ | Math-Bridge は9か国の大学が共同開発した汎ヨーロッパの数学 e ラーニング基盤（math-bridge.org）として実在し、多言語×数学教育という同じ棚で競合する。検索でもドメインでも埋もれる
- 2026-09-11 | 0 | JSON Schema の `$id` は `https://matheigo.org/schema/...`。**これは名前空間の識別子であって取得先ではない。実際のドメインが別になっても変更しない** | $id を変えると全スキーマの相対 $ref の基底が動く。取得ドメインに追随させる利点がない
- 2026-09-11 | 0 | `astro.config.mjs` の `site` と用語ページの GitHub URL はプレースホルダのまま。ドメインはデプロイ直前に取得する方針 | Phase 0〜3 は静的生成に絶対 URL を必要としない
- 2026-09-10 | 0 | `schema/_common.schema.json` を追加（PLAN 5 には無い）。id・confidence・level・domain・source・flags・reviewed を共有定義に | 5 コレクションで同じ定義を 5 回書くと必ずずれる
- 2026-09-10 | 0 | `level.us` の語彙を enum で固定。PLAN 内で "AP Calc AB"（5.2）と "AP Calculus BC"（5.5）が混在していたため **AP Calculus AB / AP Calculus BC** に統一 | 表記ゆれは検索・集計・カリキュラム対応表を静かに壊す
- 2026-09-10 | 0 | `level.jp` も enum で固定（小学校・中1〜中3・数I〜数C・大学）。`curriculum.subject` は「数学III」表記のまま自由記述 | PLAN 5.1 は「数I」、5.5 は「数学III」を使っており、用途が違うのでそのまま残した
- 2026-09-10 | 0 | `domains` を enum 化（21 分野） | 自由記述だと同義の分野名が増える
- 2026-09-10 | 0 | `register` の語彙をコレクションごとに分けた。terms.en=spoken/written/both、terms.examples=spoken/written、symbols=standard/spoken/written、phrases=polite/neutral/casual/written | PLAN の各例がそれぞれ別の語彙を使っている。統一すると例に合わなくなる
- 2026-09-10 | 0 | `flags` の形を `{code, note, raised}` と定義（PLAN 8-2 が参照するが形は未定義） | crosscheck が機械的に書き込むため
- 2026-09-10 | 0 | `curriculum` に `track`（traditional/integrated/ap/college）と `jp_equivalents` を追加 | PLAN 5.5 の例は日本側ファイルのみ。米国側ファイルは逆向きの対応を持つ必要がある
- 2026-09-10 | 0 | PLAN 5.2 の例にある `"term_ref": "definite-integral"` は、その用語をまだ作っていないので `null` にした | 参照切れは validate がエラーにする。Phase 2 で用語を作ってから繋ぐ
- 2026-09-10 | 0 | サンプル 25 件の `confidence` は `verified` ではなく `likely` | CLAUDE.md 絶対ルール 8。自分で書いた語を自分で verified にしない
- 2026-09-10 | 0 | `SHOW_UNVERIFIED`（`src/lib/data.ts` と環境変数 `MB_SHOW_UNVERIFIED`）で likely の表示を切替。既定は表示、公開時に false | PLAN 8 の「likely は非公開 or 未確認バッジ付き（設定で切替）」の実装
- 2026-09-10 | 0 | 検索は MiniSearch のまま、CJK 用にトークナイザを自作。**索引側は「語全体＋全 bigram」、クエリ側は bigram のみ** | クエリに語全体を含めると combineWith:"AND" が索引に無い語を要求し、「詰まって」で「どこで詰まっているか」に当たらない。tests/search.test.ts で固定
- 2026-09-10 | 0 | フォントは外部読み込みせず `Noto Sans JP` → `Hiragino Sans` → `Yu Gothic` → system-ui のフォールバック | Lighthouse 95+ と「Cookie なし・外部依存なし」の方針。self-host するかは Phase 4 で判断
- 2026-09-10 | 0 | `pnpm export` は JSON / CSV / Quizlet TSV まで実装。Anki `.apkg`（genanki）と word-to-word PDF（Playwright）は骨組みのみ | Phase 0 の完了条件は validate と build。Anki はデッキ ID を固定する必要があり、Phase 4 で一度に決める
- 2026-09-10 | 0 | `astro.config.mjs` の `site` は `https://example.invalid`。用語ページの報告リンクは `USERNAME/matheigo` | ドメインと GitHub アカウントは人間が接続する（PLAN 10）。接続時にこの 2 箇所を置換する
- 2026-09-10 | 0 | pnpm 12 のビルドスクリプト承認は `pnpm-workspace.yaml` の `allowBuilds` に記録（`onlyBuiltDependencies` も併記して pnpm 10-11 に対応） | 承認が無いと `pnpm install` が exit 1 になり CI が落ちる
- 2026-09-10 | 0 | Anki のデッキ ID / モデル ID は未採番 | Phase 4 で採番してこの行を更新する。更新時に重複デッキを作らないため、一度決めたら変えない

## Phase 0（2026-09-11 の確定分）

- 2026-09-11 | 0 | ホストは GitHub Pages。org `matheigo` / リポジトリ `matheigo.github.io`。`astro.config.mjs` の `site` を実 URL に、報告リンクも実 URL に | org サイトリポジトリなので公開 URL が直下になり、Astro の `base` 設定が不要。独自ドメイン（.org のみ取得予定）は後から追加でき、`site` 以外に影響しない
- 2026-09-11 | 0 | `level.us` の語彙を PLAN 付録 A の科目名と完全一致させた。`Introductory Statistics` → **`Intro Statistics`**、`Discrete Mathematics` → **`Discrete Math`** に修正。定義は `schema/_common.schema.json` の 1 箇所のみ | 付録 A がカリキュラム対応表の正。2 つの表記が並ぶと対応表が静かにずれる
- 2026-09-11 | 0 | **スキーマ変更**: `terms.en.variants`（`{term, register, note}` の配列、任意）を追加 | register が spoken / written で割れる語（移項、代入）を `alt` の平坦な文字列配列では表現できない。既存項目に影響しない追加のみ
- 2026-09-11 | 0 | `likely` は「消す」のではなく**既定 OFF のトグル**「未確認の語も表示」にした。localStorage に保存。既定値は dev=ON / build=OFF。未確認の用語ページには `noindex` を付ける | 開発中はサイト上でレビューできる必要がある。一方、未監査の語を Google に拾わせると、直したあとも誤りが流通する
- 2026-09-11 | 0 | Anki `.apkg` と Quizlet TSV と印刷用 PDF は **verified のみ**。JSON / CSV は likely も含め `confidence` 付きで出す | 毎朝回す暗記カードと試験に持ち込む紙は、間違いのコストが高い。データセットは利用者が自分で絞れる
- 2026-09-11 | 0 | 増減表: 数IIIの凹凸付きの表も同じ扱い（凹凸は f″ の別の sign chart）。`mapping_note` に「答案に書いても減点はまずされないが、行の意味と矢印を一言添える」を追加 | あなたの指摘（2026-09-11）
- 2026-09-11 | 0 | 移項: `en.variants` で spoken（move / bring it over）と written（subtract 3 from both sides）を分離。名詞 transposition は載せない | あなたの指摘（2026-09-11）。Algebra 1 の先生は口頭でも「両辺に同じ操作」を好む

## PLAN §15（用例コーパス）の反映 — 2026-09-11

- 2026-09-11 | 0 | `docs/PLAN.md` に §15 を追記。`corpus/` を .gitignore に追加 | 書き起こし本文はリポジトリに入れない（§15 ライセンス方針）
- 2026-09-11 | 0 | **スキーマ変更**: `evidence`（`{spoken, written, sources, counted}`、任意）を `_common` に定義し、terms / symbols / phrases から参照 | §15 の例をそのまま構造化。`sources` と `counted` のみ必須にしたのは、片方の register だけ件数が付く語があるため
- 2026-09-11 | 0 | パイプラインは `scripts/corpus/` に fetch / count / decide の 3 本。**report は decide に統合**（§15 は 5 ステップだが、normalize は lib、report は decide の出力の一部） | 判定と報告は同じ計算の表裏で、別プロセスにすると counts.json を 2 度読むだけになる
- 2026-09-11 | 0 | 判定規則: 各 register で首位が次点の 3 倍以上、かつその register の総件数 10 以上で決着。それ以外は `corpus-undecided` flag → 人間レビュー | §15 の「3:1 以上」「総件数 10 未満」をそのまま実装。`scripts/corpus/lib.ts` の RATIO / MIN_TOTAL で一元管理
- 2026-09-11 | 0 | 見出し変更の提案は、語形変化・省略を同一視してから出す（`sameWording`）。「completing the square → complete the square」「f prime of x → f prime」は提案しない | 合成コーパスで通したところ、この 2 件が偽陽性として出た。人間に見せる表が雑音で埋まると誰も見なくなる
- 2026-09-11 | 0 | symbols で根拠が自動字幕のみの場合、`corpus-auto-only` flag を立てて verified に上げない | §15 の注意「自動字幕は数式を誤認識する」の実装
- 2026-09-11 | 0 | 1 ソースが語数の 25% を超えたら count が警告する | §15 の「1 チャンネルの比率上限 25%」。止めずに警告なのは、初期は必ず偏るため
- 2026-09-11 | 0 | fetch は取得元一覧とマニフェスト検証のみで、自動ダウンロードはしない | 取得元ごとに規約と道具が違う。Phase 1 完了後に手で集める（§15 実施タイミング）
- 2026-09-11 | 0 | §15 の副産物「辞典に無い高頻度表現の発見」（n-gram 抽出）は未実装。report に節だけ用意 | Phase 2 で台帳の抜けを埋めるときに実装する。コーパスが無い今は空振りする

## §15 の指摘反映 — 2026-09-11（実データ投入）

- 2026-09-11 | 0 | **合成コーパスの結果（plug in 4.0:1）は動作確認の証拠であって言語的な証拠ではない。** §15 の例に合わせて自分で書いたデータなので、そう出るのは当然 | あなたの指摘。以後、レポートの数字は必ず実コーパスの出典 ID 付きで読む
- 2026-09-11 | 0 | MIT OCW の取得を自動化（`scripts/corpus/fetch-ocw.ts`）。OCW は `.vtt` 書き起こしを自社サーバで公式配布しているので、単なるダウンロード。`/courses/<slug>/pages/` を BFS して `.vtt` を集め、タイミング行を落として平文にする | YouTube と違い規約上の判断が要らない。18.01SC から 87 本・142,270 語を実際に取得した
- 2026-09-11 | 0 | YouTube / Khan は `scripts/corpus/fetch-captions.sh`（yt-dlp、`--skip-download` で字幕のみ）。CI では実行しない。人間が手で叩く | 規約の判断は運用者の責任。自動字幕は `auto: true` で区別する
- 2026-09-11 | 0 | **25% 上限を「警告」から「重み付け」に変更。** 各ソースの寄与を max(25%, 1/ソース数) に water-filling で均し、超過分を他へ再配分する（`sourceWeights`）。ratio と総件数は重み付け後の値で判定し、`evidence` には生の件数を書く | ソースが 1 つなら上限は 100% になるので、OCW だけの初期状態でも回る。毎回鳴る警告は誰も読まない
- 2026-09-11 | 0 | `sameWording` の統合条件を厳格化。**語形変化（completing / complete）と引数省略（f prime of x / f prime）のみ。** 省略できるのは冠詞・前置詞・1 文字の変数・dx 等に限る | integral / integrate / integration は別の語。substitute / substitute back も別（back が意味を持つ）
- 2026-09-11 | 0 | 統合した件数は見出し語に**合算**し、レポートに「統合済み」節として残す。黙って落とさない | あなたの指摘。人間が後から何が起きたか追えるようにする
- 2026-09-11 | 0 | `evidence` に書くのは**生の件数**（観測された事実）。重み付けは読み方なので `audits/` のレポートにだけ出す | 事実と解釈を同じ場所に混ぜない
- 2026-09-11 | 0 | `textbook` 出典の第一基準は **OpenStax *Calculus* Volume 1**（CC BY 4.0）。Precalculus 以下は OpenStax の対応書、統計は *Introductory Statistics* | あなたの指定。CC BY なので written コーパスにもそのまま使える
- 2026-09-11 | 0 | `docs/PLAN.md` の §15 は Opus が本文から起こしたもので、**正本ではない**。最新の PLAN.md（673 行）が届いたら全文差し替える | §14 の音声・Anki 仕様は旧版に含まれており現状も入っている

## 判定の3分岐と実コーパス投入 — 2026-09-11

- 2026-09-11 | 0 | `decide` の結果を 3 通りにした。①首位が 3:1 以上 → 主見出し ②首位が 3 倍に届かず複数が各 10 件以上 → **併記**（頻度順）③総件数 10 件未満 → 判断不能 | あなたの指示。②を作らないと、どちらも使われている語で辞典が勝手に好みを作ってしまう
- 2026-09-11 | 0 | 人間レビューに回すのは **③と register 不一致のみ**。不一致 = コーパスがその register で使うと言った表現を、エントリがその register に持っていない（`corpus-register-mismatch`） | 「首位が 3 倍未満」だけでは人間に回さない。②で決着するため
- 2026-09-11 | 0 | OCW の資料探索を BFS から **コース別 sitemap**（`/courses/<slug>/sitemap.xml`）に変更。見つからない場合のみ BFS に落ちる | 18.06 は動画ページを `/resources/` に置き、その索引を JS で描画するため BFS では 1 本しか拾えなかった。sitemap なら 36 本取れる
- 2026-09-11 | 0 | 6.042 のスラッグを `spring-2015` から `fall-2010` に修正 | spring-2015 版には書き起こしが無かった
- 2026-09-11 | 0 | コーパスは MIT OCW 5 コース・291 本・約 93 万語。最大シェアは 18.03 の 25.3%、重み係数は全て ×0.99〜1.01 | 偶然ほぼ均等になった。重み付けが効いていることの確認は tests/corpus.test.ts で担保
- 2026-09-11 | 0 | **代入する**: 実コーパスで plug in 220 / substitute 106（比 2.1）→ ②併記。`en.term` を `plug in` に、`en.variants` に頻度順で plug in / substitute / sub in | あなたの指示（plug in を先に）。§6-3 の「教室では plug in が圧倒的」は、実際には 2 倍であって圧倒的ではなかった
- 2026-09-11 | 0 | `docs/PLAN.md` は 673 行で §14・§15 の要所が貼られた本文と一致することを確認済み。差し替え不要 | 添付ファイルは届かず本文として渡されたが、内容は同じ

- 2026-09-11 | 0 | `package.json` に `pretest: pnpm run build:index` を追加。`tests/search.test.ts` が gitignore 対象の生成物 `public/search-index.json` を読むため、fresh checkout（CI は test → build の順）で落ちていた | prebuild と同じ形にした。テスト側で index を組み立て直すより変更が小さい
- 2026-09-11 | 0 | `.gitignore` の `corpus/` を `/corpus/` に変更 | 無印だと `scripts/corpus/`（fetch/count/decide 本体）まで無視され、初回コミットから抜け落ちていた。ルート直下の本文置き場だけを除外する

## Phase 1（台帳）— 2026-09-11

- 2026-09-11 | 1 | `curriculum.subject` は中学が **「中1」「中2」「中3」**、高校が「数学I」〜「数学C」。`us` 側の `subject` と `us_equivalents.course` は `level.us` の enum と完全一致させ、`jp_equivalents.subject` は「<科目> <単元>」（例「数学II 三角関数」）で日本側ファイルの subject＋unit と一致させる（生成時に自己検査） | 対応表の左右をクリックで往復できるようにするには、名前の一致を機械で保証する必要がある
- 2026-09-11 | 1 | 日本側は MEXT の単元を正としつつ、複合単元は教科書の章に分けた。数II「いろいろな式」→ 式と証明／複素数と方程式、「微分・積分の考え」→ 微分の考え／積分の考え、数I の集合と命題は独立単元。数III は MEXT 通り 3 単元（分数関数・逆関数・合成関数は「極限」の小項目）。中学は 2017 改訂の「データの活用」（旧「資料の活用」） | 台帳を単元で切るとき 100 語超の単元は人間が眺めにくい。教科書の章が学習者の頭の中の単位
- 2026-09-11 | 1 | 数III の id は既存サンプル `jp-suugaku-3-sekibun` に揃えて `-kyokugen` / `-bibun` / `-sekibun`。中学は `jp-chuugaku-N-...` | 既存ファイルを消さずに済む
- 2026-09-11 | 1 | 米国側は 4 系統 118 単元。Traditional は OpenStax の章 ＋ Geometry は一般的な高校教科書の章立て、Integrated は CCSS Appendix A、AP は CED の Unit、大学は OpenStax Calculus 1–3 / Introductory Statistics の章、Linear Algebra は Lay、Discrete Math は Rosen の章立て。**章構成だけを参照し、文章は引かない** | 付録 A は科目単位で単元がない。用語を単元に紐づけるには米国側にも単元が要る
- 2026-09-11 | 1 | AP Calculus BC は AB と共通の Unit 1–8 を作らず、BC 固有分（部分積分・部分分数・広義積分・Euler 法・ロジスティック・弧長）を 1 ファイル ＋ Unit 9・10 の計 3 ファイル | 同じ内容を 2 度持つと `jp_equivalents` がずれる
- 2026-09-11 | 1 | 小学校の範囲（分数・小数、割合）は `jp_equivalents` で名前だけ参照し、ファイルは作らない | v1 の範囲は中1 から（PLAN 4）
- 2026-09-11 | 1 | 台帳の列は `id, ja, en, en_alt, pos, unit, domain, level_jp, level_us, mapping, source, wiki_ja, wiki_en, wikidata, flag, note`。列の意味は `ledger/README.md` | 完了条件「全行に単元・品詞・レベル・出典種別」＋ Phase 2 に必要な id と crosscheck の材料
- 2026-09-11 | 1 | 同じ `ja` が複数単元で別の英語になった語は **1 行に統合**し、他候補を `en_alt` に残す（`flag: ja-merged`）。同音異義（表／裏（硬貨）、頂点（グラフ）、回転・発散（ベクトル解析）、像（線形写像）、次数（頂点））は `ja` に括弧で区別 | validate は `ja.term` の重複をエラーにする。Phase 2 で `en.alt` / `en.variants` に振り分ける材料を落とさない
- 2026-09-11 | 1 | `source` の仮置きは **名詞だけ** `wikipedia-langlink` / `wikidata` にし、動詞・形容詞・句は `editorial`。ja.wikipedia の曖昧さ回避ページ（円、関数、三平方の定理…）は「円 (数学)」型の記事に付け替え、リダイレクト先が別概念（余角→角度、約分→分数）や数学外の記事（縮図→映画）に当たったものは出典にせず `flag` だけ残す | 絶対ルール 2「出典を捏造しない」。Wikipedia は動詞の言い方の根拠にならない
- 2026-09-11 | 1 | 台帳は **2,488 行**（日本側 1,671、米国側から逆に洗った語 817。米国側の候補 951 のうち日本側と同じ語 134 は日本側の単元に残した）。目標 2,000 行を 25% 超えるが削らない | 米国側の逆洗い（付録 A の「米国にあって日本にない」語）を独立に数えたため。抜けより余りの方が人間の 15 分レビューで落としやすい
- 2026-09-11 | 1 | 動詞・形容詞・句は日本側全体で 33%、単元別の最低は 15%（数学C 数学的な表現の工夫）。10% 未満の単元なし | 完了条件
- 2026-09-11 | 1 | 米国側から洗った語は `unit` を米国側の単元に置き、`level_jp` は大学で扱うものが `大学`、日本の教育課程に対応物がない覚え方・作法（PEMDAS、FOIL、CPCTC、two-column proof …）は `—` | `level.jp` の enum に「該当なし」がない。スキーマは変えない
- 2026-09-11 | 1 | 生成スクリプトは `scripts/ledger/`（Python: `build.py` ＋ `curriculum_spec.py` ＋ `seed_*.txt`）。Wikipedia / Wikidata の応答キャッシュ `wiki_cache.json` は .gitignore | 台帳は再生成できる状態で残す。キャッシュは 1 MB 超で差分に向かない
- 2026-09-11 | 1 | Cowork の作業 VM に pnpm が無く、npm registry にも出られないため、`validate` と `spell` は `node --experimental-strip-types` で `scripts/validate.ts` と cspell を直接実行して緑を確認した。**`pnpm test` と `pnpm build` は未実行**（esbuild が darwin バイナリのため） | 人間が Mac で `pnpm test && pnpm build` を一度叩く
- 2026-09-11 | 1 | cspell に `"id": "..."` の値と Markdown のバッククォート内を無視する regex を追加 | curriculum の id はローマ字（`jp-chuugaku-1-seifu-no-suu`）で、単語登録では追いつかない。id はスキーマの正規表現で別に検査している

## Phase 1 修正 — 2026-09-23

- 2026-09-23 | 1 | 30 語レビューは全件承認として反映（4 に directly proportional、17 に relative maximum を `en_variants`、9 と 20 は書き言葉 necessary and sufficient condition / substitution を written で残す） | あなたの判定。判断表は `scripts/ledger/fix_decisions.py` の `REVIEW30`
- 2026-09-23 | 1 | 台帳の修正は `scripts/ledger/fix_phase1.py` が **Phase 1 のコミット（5593045）の terms.csv を入力に**毎回同じ結果を出す。判断は `fix_decisions.py` に 1 行ずつ | CSV の手直しでは、どの行をなぜ変えたかが残らない。1 行単位で異論を言えるようにする
- 2026-09-23 | 1 | `mapping` は語の対応の質。米国側の none 365 は「日本の高校範囲外」の意味だったので付け直した（exact 269 / near 42 / none 35、残りは統合・範囲外で消滅）。範囲外は `level_jp = 大学` で表す | あなたの指摘。固有値 = eigenvalue は大学の語でも exact
- 2026-09-23 | 1 | `level_jp` の「—」は、日本の学習者がその**内容**に出会う段階にした（PEMDAS → 中1、two-column proof → 中2、FOIL → 中3、washer method → 数III）。内容自体が日本の教育課程に無いもの（glide reflection、joint variation、stem-and-leaf plot）は 大学 | enum に「該当なし」が無く、スキーマは変えない。名前が無いことは mapping: none が表す
- 2026-09-23 | 1 | 米国側の行を日本側の行に統合するとき、米国側の level_jp（仮置きの 大学 / —）は持ち込まない | 持ち込むと x 切片が「中2・数I・大学」になり、範囲外の意味と矛盾する
- 2026-09-23 | 1 | Wikipedia の langlink は **ja 記事が `Category:数学` / `統計学` / `数理科学` の 4 段以内**にあるときだけ採用（`scripts/ledger/wikicat.py`） | あなたの指示。深さ 5 にするとデル・テクノロジーズ、フィート、マイルが数学扱いになる。en 側のカテゴリは Demarchy が 3 段で届くほど雑なので使わない
- 2026-09-23 | 1 | カテゴリ規則は機械的に適用し、例外を作らない。帰無仮説・トートロジー・交代級数判定法・等高線（level curve）は同じ概念だが ja 記事のカテゴリが数学に届かないので出典から外れた（source は editorial / textbook） | 例外リストを作ると規則が形骸化する。Phase 2 で別の出典（textbook）を付ければ済む
- 2026-09-23 | 1 | カテゴリ内でも別概念の langlink は外す（三角不等式 → Triangle inequality、基底 → Base (topology)、外積 → Exterior algebra、底 → 底 (初等幾何学) など 21 件）。一覧は `fix_decisions.py` の `WIKI_WRONG` | 数学記事どうしの取り違えはカテゴリでは検出できない
- 2026-09-23 | 1 | 1 概念 1 行。同じ英語でも別概念なら統合せず、意味の分かる id に改名（`divisor` 約数 / `divisor-in-division` 除数、`range` 値域 / `range-of-data` 範囲、`median` / `median-of-a-triangle`）。品詞が違うもの（平方 / 2 乗する）も別行 | 統合すると定義が 2 つになる。id の `-keisan` `-functions` のような単元名の接尾辞は意味を持たない
- 2026-09-23 | 1 | サンプル 10 語の id を台帳側が譲る: 代入する = `substitute`（置き換える は `substitute-new-variable`）、移項する = `move-term-to-other-side` | Phase 0 のファイルが既にあり、Phase 2 で同じ id に別の語が入ると上書きになる
- 2026-09-23 | 1 | `unit` / `level_jp` / `ja_alt` / `en_variants` を台帳の列に追加（複数値は `\|`）。台帳を読むコードは無く、スキーマは変えていない | 単元の複数所属は curriculum の `term_refs` 側で表せる
- 2026-09-23 | 1 | out-of-scope は 5 件: 単位あたりの量（小学校）、foot / mile（ヤード・ポンド法）、sales tax / tip（米国の文章題の生活文脈）。後者 4 件は conventions で扱う | 数学用語ではないが、米国の教室で必要なのは確か。捨てずに置き場所を変える
- 2026-09-23 | 1 | `ja_basis` / `ja_check` を新設。basis は mext（学習指導要領の**本文**に同じ表記。1 文字語は〔用語・記号〕にあるものだけ）> wikipedia > editorial。check は見出し語と根拠の表記の照合（ok / alt / title / —） | 「日本語の見出し語がどこから来たか」を Phase 2 で辿れるようにする。1 文字語（項・元・根）は本文のどこにでも現れるので部分一致を使えない
- 2026-09-23 | 1 | 学習指導要領の本文は MEXT の解説 PDF の付録から `scripts/ledger/fetch_mext.py` で切り出す（中学 平成29年告示、高校 平成30年告示）。本文はリポジトリに入れず、〔用語・記号〕一覧（用語 48・記号 22）だけ `ledger/mext-yougo.csv` に置く | 最初に取った HTML 版は平成20年告示の旧版だった（「資料の活用」「素数なし」）。解説 PDF の付録なら告示と同じ版
- 2026-09-23 | 0 | `fetch-captions.sh` の字幕言語を `en.*` から `en,en-US`（人手字幕のみ）に変更。自動字幕は `AUTO=1` のときだけ `en` を取る | `en.*` は他言語からの機械翻訳（en-bg、en-ko …）まで拾い、しかも全部同じ .txt 名に変換されるので最後に処理した翻訳字幕が残っていた。429 の原因でもあった
- 2026-09-23 | 0 | Khan Academy は `khan-algebra` として Algebra I（100）・Algebra II（100）・Algebra Basics の一次方程式（35）の 235 本を対象にし、人手字幕のある 182 本（175,056 語）を取得 | 通分・移項の判断材料。Algebra の授業の話し言葉が OCW（大学）に欠けていた
- 2026-09-23 | 0 | OCW はこのマシンに corpus/ が無かったため `pnpm corpus:fetch:ocw` で取り直した。18.01 が 142,270 語 → 487,139 語に増えた（sitemap から拾える動画が増えた）。重み付けで 25% に均される | 前回の数字（93 万語）と比べるときは注意

## Phase 1 修正 2 — 2026-09-24

- 2026-09-24 | 1 | ja.check の title 258 件は人間レビューに回さず英語側で機械照合する。ja 側の着地記事の en langlink と、en.term の en.wikipedia 記事（リダイレクト解決後）が一致すれば ok、不一致なら wikipedia を ja.basis から外す。Wikipedia 固有の表記（線型・函数・冪）は見出しを教科書表記（線形・関数・べき）にし、Wikipedia 表記は ja_alt へ | あなたの決定。`scripts/ledger/wikien.py` が取得して `wiki_en.json` に固定、`fix_phase1.py` の手順 6 で適用。ok 142 ／ 外した 116（相似変換・特性方程式・極・発散する・直交座標を含む）。表記: 見出しの変更 0 件、ja_alt への追加 8 件
- 2026-09-24 | 1 | ja.check の alt 18 件は見出し語を入れ替えない（見出しは高校教科書の表記）。例外は 可逆行列 → 正則行列 の 1 件で、可逆行列は ja_alt | あなたの決定。`fix_decisions.py` の JA_FIX。alt は 17 件残る。以後 alt は「根拠の表記が ja_alt 側にある」印で、入れ替え候補ではない
- 2026-09-24 | 0 | 通分する・移項するは照合規則（terms は literal）を変えずに候補表現を直す。移項: from both sides ／ to both sides ／ to the other side。通分: common denominator 1 本（動詞の型は Phase 2 の例文で扱う）。直してから corpus:count → corpus:decide をやり直した | あなたの決定。通分は ③ → ①（話 common denominator 29 件・唯一）、移項は ③ → ②（話 from both sides 98 ／ to both sides 90 ／ to the other side 48）
- 2026-09-24 | 0 | substitute back の register 不一致は OpenStax 投入後に再判定する | あなたの決定。再判定の結果は不一致のまま（話 substitute back 11 件、OpenStax では 0 件）。書き言葉 substitute（OpenStax 66 件・唯一）の不一致が新たに加わった。人間レビュー行き
- 2026-09-24 | 0 | OpenStax *Calculus* Volume 1 を written コーパス `openstax-calculus` として投入（PLAN 15）。`pnpm corpus:fetch:openstax` | あなたの決定。54 節・283,436 語（正規化後）、生の比率 15.2%、係数 ×1.02。written のソースはこれ 1 つ
- 2026-09-24 | 1 | 英語照合で不一致の行は、langlink を出典にも使わない。wiki_ja / wiki_en / wikidata を空にし、source の wikipedia-langlink / wikidata は editorial（米国側の単元なら textbook）に戻し、flag を wiki-rejected、note に理由 | ledger/README の wiki_ja は「同じ概念のときだけ残す」。極 → 極 (複素解析) を出典に残すと絶対ルール 2 に触れる。代わりに、en.term が曖昧さ回避や数学外の記事に当たっただけの正しい対応（原点、面、スカラー、核、仕事など）も出典を失う。source が変わったのは 17 件（一覧は audits/phase1-fix2-report.md）
- 2026-09-24 | 1 | en.term の記事は、書いたままの表記で引き、無ければ各語の頭を大文字にして引き直す。曖昧さ回避ページに着いたら不一致 | 大文字小文字だけで「記事なし」にしないため。曖昧さ回避ではどの記事か決まらないので、一致とは言えない
- 2026-09-24 | 1 | 照合で ok になった行の wiki_en は、今回取った langlink で埋める（Phase 1 の台帳で空だった 46 件） | 照合に使った事実を台帳に残す。空だった理由は Phase 1 の取得側にあり、今回の取得で langlink があると確認できた
- 2026-09-24 | 0 | **OpenStax *Calculus* のライセンスは CC BY 4.0 ではなく CC BY-NC-SA 4.0**（コレクションのメタデータで確認）。STYLE.md と `scripts/corpus/fetch.ts` の記載を直した | 2026-09-11 の行の「CC BY なので」は誤り。使うのは件数だけで本文はリポジトリに入れないので、OCW（同じ NC-SA）と扱いは変わらない
- 2026-09-24 | 0 | OpenStax は openstax/osbooks-calculus-bundle の CNXML をコミット 8dbc2ce に固定して取る。前書きは除き、章と付録の 54 節。インライン MathML はトークンだけ残す（`cnxmlToText`） | 再実行しても同じ本文になる。「subtract 3 from both sides」の 3 が数式要素でも文が切れない
- 2026-09-24 | 0 | 通分の en.term を find a common denominator から common denominator に変えた。動詞句 3 つは mapping_note に移し、例文はそのまま | 数えられる候補は en.term・en.alt・en.variants・collocations の全部なので、en.term を動詞句のままにすると「1 本」にならない
- 2026-09-24 | 0 | 移項の候補表現の register は元の割り振りのまま（to the other side は spoken、from / to both sides は written）。コーパスは両辺の言い方を話し言葉でも ② 併記と出したので、register 不一致として人間レビューへ | 絶対ルール 9。不一致を解くのは人間で、自分で register を書き換えない
- 2026-09-24 | 0 | `audits/corpus-2026-09-24.md` は同じ日付で上書きされた。前の版は 3b53eb1 にある | decide はファイル名を実行日で決める

## Phase 1 修正 3 — 2026-09-24

- 2026-09-24 | 1 | 英語照合に規則を足す: en.term が曖昧さ回避ページに着いても、そのページが ja 側着地記事の en langlink 先（リダイレクト解決後）にリンクしていれば ok。例外行は足さない | あなたの決定。`wikien.py` が曖昧さ回避ページ 40 件のリンク先を取り `wiki_en.json` の `disambig_links` に固定。title 258 行: ok 142 → 166（+24）、外した 116 → 92。出典を失った 8 件のうち 5 件が戻った（origin・inverse・scalar・work・kernel）。戻らない 3 件（face・intersection・multiplicity-of-a-zero）は曖昧さ回避ではない。代入 → Substitution (logic)、極 → Zeros and poles、外れると見込んだ 相似変換・特性方程式・発散する も ok に戻る（audits/phase1-fix3-report.md）
- 2026-09-24 | 0 | 移項する: 3 つの variant をすべて spoken にし、頻度順（from both sides → to both sides → to the other side）。written は判断不能として何も主張しない（written の variant・例文・pitfall を置かない。例文 2 文とも spoken） | あなたの決定。その後 OpenStax 6 冊で書き言葉が ② from both sides 24 ／ to both sides 24 になり、corpus:decide が register 不一致（書）を付けた。エントリは直さず人間レビューへ（絶対ルール 9）
- 2026-09-24 | 0 | 代入する: variants を plug in（spoken）→ substitute（both）→ substitute back（spoken）→ sub in。substitute back は collocations から variants へ移した。note の「書き言葉コーパスは未取得」と古い件数（OCW 220 対 106）を今回の件数に直した | あなたの決定。再判定で不一致は消えた（話 ② plug in 358 ／ substitute 253 ／ substitute back 22、書 ① substitute 140.8:1）
- 2026-09-24 | 0 | Phase 2 の前に PLAN 15 のコーパスをそろえた: `khan-ap-calc`（AP Calculus AB・BC の単元再生リスト 25 本、重複を除いて動画 544 本、全本に人手字幕）、OpenStax Calculus Vol 2・3（`openstax-calculus` に合算）、Algebra and Trigonometry 2e（`openstax-algtrig`）、Precalculus 2e（`openstax-precalculus`）、Introductory Statistics 2e（`openstax-introstats`） | あなたの決定。版は各リポジトリの 2e（初版はリポジトリに無い）。`pnpm corpus:fetch:openstax` と新設の `pnpm corpus:fetch:captions -- khan-ap-calc` を 1 つのバックグラウンドジョブで並列に回した
- 2026-09-24 | 0 | Khan の人手の英語字幕は名前付きトラック（en-ehkg1hFWq8A「English - Default」）で出るので、字幕言語を en ／ en-US ／ en-<11 文字のトラック ID> にした（fetch-captions.ts と .sh の両方） | en,en-US では試した AP Calc の動画（-CTaxKTzbEI）で「字幕なし」になった。自動字幕とその機械翻訳は --write-subs では読まれない。khan-algebra（182/235 本）はこの理由で最大 53 本取りこぼしている可能性がある。取り直しはしていない
- 2026-09-24 | 0 | OpenStax の残り 5 冊もライセンスはすべて CC BY-NC-SA 4.0（各コレクションのメタデータで確認）。`fetch.ts` の予定表を直した | PLAN.md 15 の「CC BY 4.0」は誤り。仕様書は書き換えず、ここに記録する
- 2026-09-24 | 0 | corpus:count で重複を除く（`lib.ts` の `dedupe`）: 前に出たファイルと 8 語シングルの 50% 以上が重なるファイルは写しとして捨て、残ったファイルでは既出の 8 語以上の文を消す。全ソース横断・manifest 順で、最初の写しを残す。`--no-dedupe` で旧来の数え方 | あなたの決定（OCW の同じ文・同じファイル）。OCW の演習は YouTube ID 名と MIT18_01SCF10Rec_nn 名で 2 回入っていた（18.01 で 87 本、18.02 で 72 本）。ファイル対の重なりは 70% 以上か 10% 未満に分かれ、50% の閾値で迷う対は無い。8 語未満の文（"plug it in." など）は言い直しなので消さない
- 2026-09-24 | 0 | OpenStax の取得順は Algebra and Trigonometry を Precalculus より先にする | 2 冊は多くの節を共有していて、dedupe は先に来た本に残す。範囲の広い本に残すため。Precalculus 86 節のうち 78 節が写しとして落ちる
- 2026-09-24 | 0 | STYLE 原則 5 に追記: OCW・OpenStax（と Khan の字幕）は CC BY-NC-SA なので、例文・定義文・note にコーパスの文を転載しない。使うのは件数だけ。辞典のデータは CC0 のまま | あなたの決定
- 2026-09-24 | 0 | STYLE の直訳禁止リストと register 表の 移項・代入 の行をコーパスの結論に合わせた（「plug in が圧倒的」を「併記」に、移項の話し言葉を頻度順に） | 表とエントリが食い違ったままだと、次のバッチで古い表に合わせてしまう

## Phase 1 修正 4 — 2026-09-24

- 2026-09-24 | 1 | 曖昧さ回避経由で ok になった 5 件（substitution 代入、pole 極、diverge 発散する、similarity-transformation 相似変換、characteristic-equation 特性方程式）は別概念として外す。`fix_decisions.py` に `EN_CHECK_WRONG` を新設して 1 行ずつ足し、`fix_phase1.py` の英語照合が参照する。曖昧さ回避の規則そのものは変えない | あなたの決定。理由: ja 側の着地記事が見出しと別の概念で、曖昧さ回避ページのリンクは同一概念の証拠にならない。title 行 ok 166 → 161、source が戻ったのは substitution・pole の 2 件（→ editorial）
- 2026-09-24 | 0 | symbols/integral-definite の候補表現をワイルドカードにした: the integral from * to * of。記号の written は「対象外」として判定しない（数えず、flag も出さない） | あなたの決定。話 ③（3 件）→ ①（246 対 11、22.4:1）
- 2026-09-24 | 0 | `countPattern` を実装した（`lib.ts`）。PHASE1-HANDOFF に「記号の count はワイルドカード照合（countPattern）」とあったが、コードにはどのコミットにも存在しなかった。`*` は 1〜5 語、他は literal・語境界つきで countPhrase と同じ。使うのは symbols だけで、読みごとのパターンは `SYMBOL_PATTERNS`。counts と evidence のキーはパターンそのもの | literal と取り違えないため。5 語は「from negative infinity to infinity」「from x equals zero to x equals one」を拾い、文をまたいだ誤一致を抑える幅
- 2026-09-24 | 0 | integral-definite の 2 本目の読み（the integral of f of x from a to b）も the integral of * from * to * にした | 片方だけパターンにすると literal との比較になり、比が構造的に偏る
- 2026-09-24 | 0 | move-term-to-other-side: from both sides と to both sides の register を both にした。to the other side は spoken のまま | あなたの決定（書き言葉 ② 24/24 の根拠。修正 4 の全量では 25/26）。register 不一致は解消
- 2026-09-24 | 0 | substitute と move-term-to-other-side の variants の note に、件数から分かる使い分けを自作の文で書いた | あなたの決定。YouTube 投入後の件数で書いた: plug in は OCW 353・YouTube 1,045・Khan 5、substitute は Khan 132・OCW 128・YouTube 101。「substitute は Khan 中心」は「Khan はほぼ substitute だけ」という形で書いた（substitute の総数では Khan が 37%）。移項は両辺が Khan・YouTube 中心、other side は OCW 28/52
- 2026-09-24 | 0 | PLAN.md 15 と SOURCES.md の「OpenStax は CC BY 4.0」を CC BY-NC-SA 4.0 に直した。PHASE1-HANDOFF.md の同じ誤りも直した | あなたの決定（2026-09-24 修正 3 の行「仕様書は書き換えず」を上書き）
- 2026-09-24 | 0 | `tsc --noEmit` を通した: decide.ts の byId を `Map<string, …>` に型付け、`src/env.d.ts`（astro/client の型参照）を追加。後者は src/lib/data.ts の import.meta.glob の 6 件 | あなたの決定（decide.ts）。env.d.ts は Astro の標準ファイルで、無いと tsc が通らなかった
- 2026-09-24 | 0 | コーパスを PLAN 15 の全量にした（あなたの決定）。取得は `pnpm corpus:fetch:captions`（Khan 3 ソース＋YouTube 6 チャンネルを一括）と新設の `pnpm corpus:fetch:notes` を 1 つのバックグラウンドジョブで並列に回した | 19 ソース、重複除去後 5,203,004 語（話 3,222,833 ／ 書 1,980,171）。詳細は audits/phase1-fix4-report.md
- 2026-09-24 | 0 | khan-algebra の元の再生リストは記録が無かったので、キャッシュ 182 件のファイル名（yt-dlp の %(title).80B）と照合して特定した: Algebra I ｜ High School Math、Algebra II ｜ High School Math、Linear equations and inequalities ｜ Algebra Basics（計 235 本・重複を除いて 217 本、182 件すべて一致）。キャッシュはファイル名を <動画 ID>.txt に付け替え（manifest の位置は保つ）、残り 35 本を新しい字幕言語で取った | 35 本すべてに人手字幕があった。「最大 53 本の取りこぼし」は 35 本だった（53 は重複を数えていた）
- 2026-09-24 | 0 | khan-ap-stats は AP Statistics の単元再生リスト 13 本（3 単元は新旧 2 本ずつ）、動画 166 本。チャンネルの一覧に出る ID が 13 文字の「PLMKj04Mp417E」は通常の再生リスト ID ではないので入れていない | 他の 13 本で単元はすべて埋まる
- 2026-09-24 | 0 | YouTube 6 チャンネルは数学の再生リストだけを対象にし（Professor Leonard は再生リストのタブが無いので、講義名を含むタイトルかつ 10 分以上の動画）、1 チャンネル最大 100 本を一覧に均等に散らして選ぶ。NancyPi は 2 分以上の全動画（42 本）。3Blue1Brown は Essence of calculus / linear algebra など 6 本 | Leonard だけで 1,216 本・602 時間ある。上限なしでは取得に何日もかかり、1 チャンネルの比率上限 25%（重み付け）以前に一つの講師が語数を占める。均等に散らすのは単元の偏りを避けるため。結果は最大の Leonard でも 9.6%
- 2026-09-24 | 0 | YouTube チャンネルは人手字幕を優先し、無ければ自動字幕の en-orig（元の音声認識トラック）を取る。manifest の auto で区別。自動字幕の "en"（翻訳版）は要求しない | "en" は 429 を返し続けた（1 本目で 3 回リトライして失敗）。en-orig は同じ動画で問題なく取れた。3 本続けて失敗したらそのソースを止める安全弁も足した
- 2026-09-24 | 0 | mit-notes は OCW の講義ノート PDF を pdftotext で文章化: 18.01（Fall 2006）、18.02（Fall 2007）、18.03（Spring 2010）の lecture notes、6.042J（Fall 2010）の course text。18.06 はノートが公開されていない（Strang の教科書）ので無し。合字（ﬁ・ﬀ）は NFKC で戻す | 109 PDF・497,533 語。18.01 の単元まとめ PDF と 6.042 の全文 PDF が各回・各章と重なるので、dedupe で 48 ファイルが写しとして落ち 278,411 語になる。重なりは dedupe に任せ、取得側では選ばない

## Phase 2（積分の単元）— 2026-09-24

- 2026-09-24 | 2 | Phase 2 は積分の 8 単元から始める（あなたの指示。§9 の「数学I 数と式」からを入れ替え）。対象は台帳の unit に 8 単元のいずれかを含む 123 行（重複なし・既存 0）。台帳の行順に 50／50／23 の 3 バッチ | 台帳の順なら同じ単元の語が同じバッチに入り、related を張りやすい
- 2026-09-24 | 2 | 見出し語と register は、書く前にコーパスで候補表現を数えて決める（新設 `pnpm corpus:probe`。件数だけを出し、本文は出さない）。STYLE 原則 1 の ①②③ をそのまま当てはめ、③ の register は主張しない（両方 ③ なら en.register を書かない）。書いたあと corpus:count → corpus:decide -- --write で evidence と flags を付ける | 生成後に decide の結論へ register を書き換えると絶対ルール 9（不一致は人間が解く）に触れる。書く時点で頻度に従っておけば、残る不一致は本当の食い違いだけになる
- 2026-09-24 | 2 | 候補表現（en.term／alt／variants／collocations。count が数える範囲）に、別の意味でも大量に数えられる汎用語を入れない（substitution、upper bound、bounds、arbitrary constant、solid of revolution、above the x-axis など）。そうした言い方は mapping_note・pitfalls・例文に書く。collocations は見出し語を含むか件数の小さいものにする | literal の照合は意味を区別しない。substitution（話 704 件）には連立方程式の代入法も三角置換も入り、入れると ① で主見出しを奪う。collocation が見出し語と競って ③ や不一致を作るのは言語の事実ではなく数え方の副作用
- 2026-09-24 | 2 | `normalize` に表記ゆれを 2 つ足した: u substitution → u-substitution、anti-derivative ／ anti derivative → antiderivative。u sub → u-sub は足さない | ハイフンの有無は同じ言い方（Khan の人手字幕で u-substitution 40 ／ u substitution 19、anti-derivative 128）。u sub は添字の読み（u sub n）と区別できない
- 2026-09-24 | 2 | corpus:decide は、コーパスに 1 件も出ない語も ③（0 件）と判定して corpus-undecided を付ける。evidence は sources: [] と counted だけ | count.ts は 1 件以上ヒットした語しか counts.json に書かず、decide はそれしか見ていなかったので、0 件の語が人間レビューを素通りしていた。既存の sign-chart・am-gm-inequality・symbols 2 件・phrases 5 件にも今回初めて flag が付いた
- 2026-09-24 | 2 | crosscheck.ts は 429 を受けたら待って再試行する（Retry-After か 10 秒 × 回数、5 回まで） | MediaWiki API は 10 件ほど続けると 429 を返し、残りは skip として何も記録されずに終わっていた
- 2026-09-24 | 2 | 出典の付け方: wikipedia-langlink は台帳が採用した記事に加え、見出し語か ja.alt の記事が台帳と同じ規則（カテゴリ 4 段以内・同じ概念）を満たすもの（置換積分、リーマン和、総和、回転体など）。textbook は en.term か en.alt が OpenStax のその巻の本文に実際に出るときだけで、書名は巻まで書く（corpus:probe の件数で確認）。editorial は動詞・句、mapping near／none の説明、英語が固有の用語でなく説明的な句の名詞 | 絶対ルール 2。確かめていない本は出典に書かない
- 2026-09-24 | 2 | draft の基準: 英語側が固有の用語を名乗る名詞で、Wikipedia・OpenStax のどちらでも確認できないもの。理由は flags に code `draft-reason` で書く | 「出典のない語は draft」を editorial で逃げずに運用するため。説明的な句（area between a parabola and a line）は用語を名乗っていないので editorial で likely
- 2026-09-24 | 2 | 例文の register は例文の文体（口頭の説明か、答案・問題文か）を表す。動詞・句は spoken と written を 1 文ずつ置く。コーパスの判定（en.register）とは別 | あなたの指示。移項の「written を主張しない」は移項についてのあなたの決定
- 2026-09-24 | 2 | 台帳で同じ概念が別の単元から別の行になっているもの（2 曲線間の面積 ／ 曲線間の面積 ／ 曲線で囲まれた面積、定積分と和の極限 ／ リーマン和の極限 など）は台帳どおり別エントリにし、それぞれの単元の角度で定義を書いて related で結んだ。統合するかは人間が決める（一覧は audits/phase2-integral-report.md） | id を消すと台帳・curriculum の term_refs と食い違う
- 2026-09-24 | 2 | 台帳の en（暫定）と mapping（仮置き）は、コーパスと内容で付け直した。台帳そのものは直さない（変えた語はレポートに一覧） | ledger/README「en は Phase 2 でコーパスにより確定する」。台帳は fix_phase1.py で再生成されるので、手で直すと次に消える
- 2026-09-24 | 2 | curriculum の term_refs に、生成済みの語をその語の unit すべてに台帳の順で入れた。Phase 0 のサンプル 10 語も同時に入った | ledger/README「Phase 2 で各単元の term_refs に入る」
- 2026-09-24 | 2 | integration-formulas の ja.term を台帳の「積分表」から「積分公式」に変えた（ja.alt に「不定積分の公式」） | 積分表は table of integrals（using-integral-tables の側）で、integration formulas の訳としては別物
- 2026-09-24 | 2 | 英語の見出しが確立した名前でなく説明的な句のもの（integration by long division、integration by completing the square）は mapping near にし、「確立した名前ではない」と mapping_note に書いて editorial で likely にした。accumulation function は AP で使う名前を名乗るので draft | draft の基準（固有の用語を名乗るか）をそのまま当てはめた
- 2026-09-24 | 2 | 前のバッチの語から新しいバッチの語への related は、新しいバッチのコミットで足す | related は存在する id しか指せない（validate）。バッチの順に作るので、前向きの参照は後から張るしかない
- 2026-09-24 | 2 | hydrostatic-force の ja.term を台帳の「静水圧」から「静水圧による力」に変えた | 静水圧は hydrostatic pressure（単位面積あたり）で、hydrostatic force（板全体が受ける力）とは別の量。台帳の ja は pressure と force を取り違えていた
- 2026-09-24 | 2 | OpenStax の節の名前（corpus/manifest.json の title。本文ではなくモジュールのメタデータ）も textbook 出典の確認に使う。area-between-curves に OpenStax Calculus Volume 1（節 Areas between Curves）を足した | cnxmlToText は節の名前を本文から落とすので、節の名前にしか出ない語は件数 0 になる。節の名前に出ることは、その本がその言い方を使っている事実
- 2026-09-24 | 2 | 見出しに句読点を含む語（fundamental theorem of calculus, part 1）は、句読点なしの形も en.alt に入れる | countPhrase は句読点も literal で照合するので、教科書の「…Calculus, Part 1」と口頭の「… part one」が別の表現として数えられる。normalize で句読点を落とすと既存の件数がすべて変わるので、今回は変えない
- 2026-09-24 | 2 | level も台帳（単元ごとの既定値）から内容で付け直した（123 語中 99 語）。主に、数IIの基本語に数IIIを足す、数III 積分法の行の既定値 AP Calculus BC ／ Calculus II を AP の CED と OpenStax の章立てに合わせて AB ／ Calc I に直す（u-substitution・三角関数の積分など）、米国側から洗った行の level.jp「大学」を日本の学習者がその内容に出会う段階（数III）に直す | 台帳の level は単元の既定値で、語ごとには見ていない（ledger/README）。一覧は audits/phase2-integral-report.md

## Phase 2 修正（積分の単元のやり直し）— 2026-09-24

- 2026-09-24 | 2 | 1 概念 1 エントリ（Phase 1 修正の決定）を積分の単元に適用した。D-3 のグループは、品詞が同じ行を 1 エントリに統合（14 行 → 10 エントリに吸収）。品詞が違う行（find-an-antiderivative、decompose-into-partial-fractions、find-the-arc-length、let-u-equal、substitute-new-variable）は Phase 1 の「平方 / 2 乗する は別行」に従って別エントリのまま | あなたの指示（統合）と Phase 1 の決定（品詞）の両方を満たす。これが D-2 で 1 ソース頼みの例に挙がった語を残す根拠にもなる
- 2026-09-24 | 2 | D-3 の「累積」グループは 2 つに分けた: function-defined-by-an-integral → accumulation-function、accumulation と net-change-theorem → net-change | accumulation の定義は「変化率を積分して積み重なった変化を求める見方」で、関数 F(x) = ∫ f(t)dt ではなく net change の側。定理の行は同じ量の定理なので量のエントリに寄せた
- 2026-09-24 | 2 | 統合先の id は既存のものを残し、ja.term は日本の教科書の語にする（accumulation-function は「定積分で表された関数」、limit-of-a-riemann-sum は「リーマン和の極限」。「定積分と和の極限」「累積関数」は ja.alt）。統合した行の ja は ja.alt、en は en.alt か variants | あなたの指示。id を変えると related・term_refs・台帳が全部動く。見出しの日本語が訳語より教科書の語のほうが引きやすい
- 2026-09-24 | 2 | 統合したグループの見出しは新設の `pnpm corpus:probe -- --decide --file …`（1 ブロック = 1 エントリの候補、先頭が見出し。count → decide と同じ判定を件数だけで出す）で決めた。② の見出しは en.term に首位集合の言い方を置き、全部を variants に頻度順で並べる（既存の ② エントリと同じ形） | あなたの指示（見出しは corpus:probe で決める）。decide を回す前に結論が分かるので、書いてから直す往復が要らない
- 2026-09-24 | 2 | find-an-antiderivative の en.term を take the antiderivative から find an antiderivative に変えた | 話し言葉の ① take the antiderivative は 107 件中 93 件が Khan Academy で ② に下がった（下記 1 ソース頼み）。find an antiderivative は話し言葉・書き言葉の両方で ② の首位集合に入る唯一の言い方
- 2026-09-24 | 2 | D-4 の節の名前の行（10 行 ＋ D-3 と重なる antiderivatives）は中身の用語のエントリに寄せ、節の名前そのものは ja.alt ／ en.alt に入れない（台帳では fix_phase1.py の merge(names=False)）。中身が用語として立つものだけ別名にした: 積分表 ／ table of integrals（integration-formulas）、三角関数の積分（trigonometric-integrals） | 節の名前は言葉ではないので、別名に入れると検索の同義語が汚れる。「積分表」は台帳で元々 integration-formulas の ja だった語
- 2026-09-24 | 2 | probability-density-and-integrals（確率密度と積分）は、台帳にある数Bの行 probability-density-function に寄せ、中身を移して data/terms/probability-density-function.json を作った | 積分の単元に中身の用語のエントリが無い。寄せる先を作らないと生成した中身が消える。数Bのバッチより先に 1 語だけ生成することになる
- 2026-09-24 | 2 | terms/the-integral-from-a-to-b は symbols/integral-definite に統合した（読み方の注意を notes に移し、term_ref を definite-integral に繋いだ）。台帳では merged-into の new_id を `symbols/integral-definite` と書く | 台帳の note に「symbols へ」とあった。Phase 0 で term_ref を null にした理由（定積分のエントリが無い）が解消した
- 2026-09-24 | 2 | 授業での言い回し 13 行を terms から外して Phase 3 の phrases 候補にした。あなたの 10 行に加えて enclosed-region（the region bounded by … は問題文の枠）、find-the-area-by-integration と integrate-by-parts-repeatedly（手順の一文）。候補は ledger/phrases-candidates.csv に、生成済みの本文の場所（4d47e6f:data/terms/<id>.json）とともに置く | 同じ基準（用語ではなく、授業や問題文の一文）に当たるものを残すと、次の単元で同じ判断をまた迫られる
- 2026-09-24 | 2 | 台帳には fix_decisions.py の PHASE2_SAME ／ PHASE2_SECTION ／ PHASE2_TO_SYMBOLS ／ PHASE2_TO_PHRASES として足し、fix_phase1.py の手順 8 で適用する。消した id は ledger/id-changes.csv に action `merged-into`（new_id は寄せた先）か `to-phrases` で残る（39 行） | 台帳は fix_phase1.py が毎回作り直すので、CSV の手直しは次に消える
- 2026-09-24 | 2 | fix_phase1.py の merge() は、Phase 2 の統合で吸収される行に記事が無いとき、残る行の記事（wiki_ja ／ wiki_en ／ wikidata）を消さない | antiderivatives（出典 textbook、記事なし）を antiderivative に寄せたとき、出典の順位だけで 不定積分 の記事が消えていた。Phase 1 の統合には触れない（出力が変わらないことを確かめた）
- 2026-09-24 | 2 | terms の件数は語形変化をまとめて数える（`countTerm`）。sameWording と同じ語幹（stem）の形を同じ語として照合するが、冠詞・前置詞・代名詞・助動詞・数詞・2 文字以下の語は書いたとおりに照合する。phrases は literal、symbols はパターンのまま | あなたの決定（sameWording の既存の決定の範囲）。the を語幹で照合すると these ／ thing に、one は on に当たる
- 2026-09-24 | 2 | 見出しに「…」がある動詞句に限り、「…」を 1〜3 語の空きとして数える。空きの語は文末（. ? !）で終わらないもの。空きなしの形（revolve around the x-axis）は sameWording で同じ言い方（引数の省略）として扱い、en.alt に並べてあれば同じ位置を 1 回だけ数える | あなたの決定（terms は literal という決定をこの形だけ緩める）。受け身の is revolved around the x-axis は空きなしの形でしか数えられない
- 2026-09-24 | 2 | 同じ言い方のグループは、グループ内のどの言い方が当たっても同じ位置は 1 回と数える（count.ts は lib.ts の `countEntry` を使う） | 語形変化をまとめると Riemann sum と Riemann sums が同じ出現に両方当たり、合算すると 2 倍になる。f prime ／ f prime of x の重なりもこれで消える
- 2026-09-24 | 2 | sameWording は語の後ろの句読点を無視する（fundamental theorem of calculus, part 1 と … part 1 は同じ言い方） | 句読点の有無で 2 つの言い方に割れ、FTC part 1 が ③ になっていた（2026-09-24 Phase 2 の句読点の決定の後始末。件数そのものは変わらない）
- 2026-09-24 | 2 | normalize に「1 文字の変数 ＋ 空白 ＋ -語」を「x-axis」の形に戻す規則を足し、cnxmlToText もインライン数式の直後のハイフンを離さないようにした | OpenStax の本文は数式の前後に空白を入れるので x-axis が「x -axis」になっていた（書き言葉で 1,011 件対 32 件）。x-axis ／ y-axis ／ x-intercept ／ u-substitution を含む書き言葉がほぼ数えられていなかった
- 2026-09-24 | 2 | corpus:probe のキャッシュは manifest に加えて normalize の規則が変わったときも作り直す | 規則を変えても古い正規化の本文を読み続けていた
- 2026-09-24 | 2 | 1 ソース頼みの判定を下げる（lib.ts `decideRobust`）: 首位の言い方の件数が最も多いソースを抜いて判定し直し、種類（①／②）と首位が同じでなければ頼っているとする。① は ② に下げ、首位と「抜いたときの首位（なければ次点）」を併記する。② はそのまま、頼っているソースを記録する。ソースは manifest の id（YouTube は 6 チャンネル、Khan は 3 ソース、OpenStax は 4 ソースを別に数える） | あなたの決定。重み付けの 25% 上限と同じ単位で数える。「抜くと 10 件未満」も同じ判定ではないので下げる
- 2026-09-24 | 2 | 1 ソース頼みでも、併記する相手の無い唯一の言い方は ① のまま頼っていることだけ記録する。首位を含んで伸ばしただけのコロケーション（the integrand is odd、find the indefinite integral）は併記の相手に数えない | 相手が無いと ② にしても並べる語が無い。コロケーションは言い換えではなく見出し語の使い方なので、並べると「integrand と the integrand is odd を併記」という意味の無い結論になる
- 2026-09-24 | 2 | which-one-to-differentiate は語形変化をまとめたあと 1 ソース頼みに当たらなかった（話し言葉 pick u 17 件が MIT OCW 5・NancyPi 5・patrickJMT 4・Professor Leonard 3）。下げずに、どのソースがどちらを使うかだけ pitfalls と variants の note に書いた | 前のレポートの「10 件が YouTube」は YouTube を 1 つと数えた数。ソースの単位を上の行に揃えると頼っていない
- 2026-09-24 | 2 | ② の variants の note は、言い方の特徴を自作の文で書き、件数とソースの内訳（例: 話し言葉で 107 件（Khan Academy 93・MIT OCW 14））は判定と同じ件数から機械的に付けた。古い件数を引いていた pitfall と note は今回の件数に直した | 件数の数え方が変わったので、前の数字は evidence と食い違う
- 2026-09-24 | 2 | integration-by-substitution の collocation「use u-substitution」を外した | x-axis の修正で書き言葉の u-substitution が数えられるようになり、見出し語を含むこのコロケーションが ② の相手になった（Phase 2 の決定: collocation は見出し語と競わないものにする）
- 2026-09-24 | 2 | corpus:decide に --units（curriculum の term_refs）と --ids を足し、今回は積分の 8 単元と symbols/integral-definite だけ書き戻した（86 件）。ほかの 20 件は新しい規則でも flags が変わらないことを確かめて、書き戻していない | あなたの指示は積分の単元の decide のやり直し。ほかの語の evidence の数字が note と食い違うのを避ける。新しい規則で書き戻すと substitute などに「1 ソース頼み」の記録が加わるだけ（audits/phase2-integral-fix-report.md）
- 2026-09-24 | 2 | AP Calculus の CED は College Board の 2020 年版 PDF（Effective Fall 2020）を scripts/ledger/refetch.py で corpus/ref/ に取り（gitignore）、TOPIC n.m の見出しで区切って語の有無と topic 番号だけを見た。出典は type: reference、title に CED、url、note に topic 番号と日本語の説明。本文は写さない | あなたの指示。CED は College Board の著作物で、使うのは topic 番号と語の有無という事実だけ
- 2026-09-24 | 2 | accumulation-function は CED の topic 6.4・6.5・8.3 に accumulation functions があるので likely にした。見出しは accumulation function のまま（コーパス 0 件）で、話し言葉の area function（11 件、3Blue1Brown 8）を variant にした | あなたの指示。コーパスの ① area function は唯一の言い方で 1 ソース頼み。AP の名前を見出しにする根拠は CED
- 2026-09-24 | 2 | midpoint-riemann-sum の en.term を CED（topic 6.2）の midpoint Riemann sum にし、midpoint rule を書き言葉の variant にした。trapezoidal-rule は CED の trapezoidal sum が既に話し言葉の variant だったので、見出しは変えず CED を出典に足した。disk-method は CED の綴り disc method を話し言葉の variant にした | あなたの指示は midpoint。trapezoidal は同じ形だが、見出しを変えるのは指示の範囲を越えるので出典だけ
- 2026-09-24 | 2 | D-1 の主張を CED ／ OpenStax ／ コーパス ／ 学習指導要領の本文で確かめ、確かめたものは出典か根拠を書き、確かめられないものは「教科書による」に弱めるか消した（一覧は audits/phase2-integral-fix-report.md の D）。LIPET は消した（コーパス 0 件、CED にも無い） | あなたの指示。米国側の主張はまず CED、CED の範囲外（教科書の書き方）は OpenStax の本文の件数で確かめた
- 2026-09-24 | 2 | 日本の教科書に無い日本語見出し（D-5 の 11 語 ＋ 平方完成による積分）は、mapping_note に「見出しの「X」は日本の教科書に無い、本プロジェクトの訳語。」と書いた。ja.alt に残った訳語（累積関数・純変化定理・置換法則）も書いた | あなたの指示。平方完成による積分は長除法による積分と同じ作り方の訳語
- 2026-09-24 | 2 | validate の「mapping が exact なのに mapping_note がある」警告は、note に「本プロジェクトの訳語」を含むときは出さない | 左リーマン和などは対応が exact のまま、日本語の見出しが訳語であることを書く場所が mapping_note しかない。スキーマは変えない
- 2026-09-24 | 2 | 台帳全体の langlink を取り直した（scripts/ledger/refetch.py → scripts/ledger/langlinks.json、fix_phase1.py の手順 7）。空だった wiki_en 169 行を埋め、うち wikidata → wikipedia-langlink が 150 行。記録済みの langlink と食い違う行・消えた行は 0 | D-8。原因は build.py が API の `continue` を追わないこと（`lllimit` なしでは 50 タイトルに 10 件しか返らず continue になることを確かめた。コードは `lllimit=500` 付きなので、Phase 1 のキャッシュを作った版の違いと思われるが、キャッシュが無く確かめられない）。取り直しは `continue` を追う
- 2026-09-24 | 2 | 台帳で wiki_ja の無い行（置換積分・変数分離・総和・回転面・バウムクーヘン積分の見出し）は取り直しの対象にしていない | 見出しや ja_alt から新しく記事を探すにはカテゴリと同一概念の判定がもう一度要る。エントリ側は Phase 2 の決定（出典の付け方）で既に langlink を出典にしている
- 2026-09-24 | 2 | 取得はすべて同じ作法にした: まとめて（MediaWiki は 50 タイトル／リクエスト、continue を追う）、タイムアウト 30 秒・リトライ 3 回（429 は Retry-After）、進捗は done/total、結果はキャッシュして再実行では足りない分だけ取る。refetch.py（langlinks.json、CED の PDF）と crosscheck.ts（corpus/cache/crosscheck.json）| あなたの指示。crosscheck は 1 語 1 リクエストで、タイムアウトもキャッシュも無かった
- 2026-09-24 | 2 | 2026-09-24 Phase 2 の行「同じ概念の別の行は台帳どおり別エントリにし、統合は人間が決める」は、あなたの決定（1 概念 1 エントリの適用）で置き換わった | 古い行は消さずに残す

## Phase 2 規則の修正（③・1 ソース頼み・リーマン和）— 2026-09-24

- 2026-09-24 | 2 | 規則 1: 話・書とも ③ で、mapping が near か none、全候補の件数（生の件数の合計）が話・書とも 10 未満の terms は「英語に決まった言い方がない」と判定する。flag は corpus-no-fixed-expression、mapping_note にその旨を書き、en.register は書かない。人間レビューに回さない（lib.ts `settleUndecided`） | あなたの指示。件数は evidence と同じ生の件数で見る。symbols ／ phrases は mapping を持たないので対象外（③ は corpus-undecided のまま）
- 2026-09-24 | 2 | 規則 1 は、英語の名前をそのまま日本語の見出しにした語（ja.term と en.term が同じ。LIATE）には当てない。その語は規則 2 に進む | LIATE の mapping none は「日本側に対応物がない」の意味で、英語の名前は LIATE そのもの。規則 1 を当てると mapping_note に「英語に決まった言い方がない」という誤りを書くことになる。機械的に判定できる形（ja と en が同じ）に絞り、例外の表は作らない
- 2026-09-24 | 2 | 規則 2: それ以外の ③ は、見出しを CED の呼び方、無ければ OpenStax の呼び方（4 冊の本文か節の名前）で決める。候補表現（en.term・alt・variants・collocations）を terms と同じ数え方で CED（TOPIC ごとに区切る。refetch.py の ced_topics と同じ切り方）と OpenStax に当て、件数の最も多い候補（同数なら候補の順）を見出しにする。flag は corpus-reference-fallback（note に topic 番号か節の名前）、en.register は書かない。どちらにも無ければ corpus-undecided で人間レビューへ | あなたの指示。count.ts が参照の件数を counts.json の reference に置き、decide が判定する。見出しとエントリが食い違えば decide のレポートの「エントリ側で直すこと」に出る
- 2026-09-24 | 2 | 規則 2 の続き: 首位が 10 件以上で 2 位が 10 件未満なら、比が 3 倍未満でも首位を ①（byFloor）とし、2 位は少数の variant にする。件数は他の判定と同じく重み付け後 | あなたの指示（axis-of-revolution 13 ／ 7）。積分の単元で新たに ① になったのは axis-of-revolution（書）、shell-method（書 method of cylindrical shells）、logistic-differential-equation（話）、revolve-around-the-x-axis（話 rotate）
- 2026-09-24 | 2 | 規則 3（1 ソース頼みの直し）: 最多ソースを抜いて判定し直し、別の言い方が首位になるときだけ ① を ② に下げる。抜くと ③ になるとき、同じ言い方が首位のまま ② になるときは ① のまま、頼っているソースを記録する。首位を含むだけのコロケーションが首位になっても下げない | あなたの指示。前の修正の C-1（25 判定）は 23 判定が ① に戻り、② のままは find-an-antiderivative（話: 抜くと find an antiderivative が首位）と fundamental-theorem-of-calculus（書: 抜くと FTC が首位）の 2 判定
- 2026-09-24 | 2 | 規則の変更で結論が変わった語は、エントリを新しい結論に合わせた（en.register を en.term が首位の register に、新しい ① の言い方を その register の variant に、2 位を少数の variant に）。register 不一致として人間に回していない | 規則を変えて decide をやり直すのはあなたの指示で、生成時と同じく書く時点の結論に従う（2026-09-24 Phase 2 の行）。直したのは trigonometric-integrals・let-u-equal・left ／ right-riemann-sum・axis-of-revolution・shell-method・logistic-differential-equation の 7 語。不一致は 0
- 2026-09-24 | 2 | 規則 4: trapezoidal-rule の en.term を CED（topic 6.2）の trapezoidal sum にし、trapezoidal rule を書き言葉の variant にした（midpoint と同じ形）。id は trapezoidal-rule のまま | id を変えると related・term_refs・台帳・id-changes が動く（midpoint-riemann-sum は元からその id だった）
- 2026-09-24 | 2 | 規則 4: revolve-around-the-x-axis の en.term を rotate … around the x-axis にした（y と同じ動詞）。両方の書き言葉の ② に rotate と revolve がともに入るので、話し言葉で両方の ① でもある rotate を選んだ。id は変えない | あなたの指示（「両方の ② の集合に入っている方」）は 2 語とも満たすので、もう一段の決め手に話し言葉の結論を使った
- 2026-09-24 | 2 | 規則 2 で見出しが変わった語: integral-involving-absolute-value → integral of the absolute value（CED topic 8.6）、surface-area-of-revolution → area of a surface of revolution（OpenStax の本文 8 件）。元の見出しは en.alt | decide のレポートの「エントリ側で直すこと」に従った
- 2026-09-24 | 2 | integration-by-long-division と integration-by-completing-the-square の出典に CED topic 6.10 を足した（ced-find で long division ／ completing the square がともに 6.10 に 2 件） | 規則 1 の mapping_note に「CED は手順として扱うが名前ではない」と書く根拠
- 2026-09-24 | 2 | sign-chart（Phase 0 の語、積分の単元の外）も規則 1 に当たる（話・書とも 0 件、mapping none）が、書き戻していない | 書き戻しは今回の単元の語だけ（前の修正と同じ範囲の決め方）。sign-chart は次の単元（数II 微分の考え）の既存語で、あなたの指示「既存は飛ばす」に従う。レポートの怪しい点に残す
- 2026-09-24 | 0 | count ／ decide ／ crosscheck ／ export の日付を UTC ではなくマシンの日付にした（`scripts/lib/load.ts` の `localDate`） | 太平洋時間の夕方には toISOString() が翌日になり、flags の raised とレポート名が 2026-09-25 になった
