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
