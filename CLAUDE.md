# MathEigo JA⇄EN

日本の中高〜大学初年次の数学用語を、米国の教室で「言える・書ける・聞き取れる」ようにするための
無料・オープンデータ（CC0）の日英数学辞典。仕様は docs/PLAN.md、編集方針は docs/STYLE.md。

## コマンド
- pnpm validate   … JSON Schema・重複・LaTeX・参照切れ・完了の定義（コミット前に必ず）
- pnpm spell      … 英語スペル検査（cspell）
- pnpm crosscheck … Wikipedia langlinks / 対訳表との突合（`-- --write` で flags を書き戻す）
- pnpm corpus:fetch … 用例コーパスの取得元一覧 / マニフェスト検証（PLAN 15）
- pnpm corpus:fetch:ocw … MIT OCW の書き起こし(.vtt)を自動取得（公式配布・CC BY-NC-SA）
  YouTube / Khan は人間が手で実行する: `pnpm corpus:fetch:captions`（Khan 4 ソースと YouTube 6 チャンネルを一括。
  `-- <id>` で絞る）／ `./scripts/corpus/fetch-captions.sh <id> <url>`（任意の 1 URL）
- pnpm corpus:fetch:openstax … OpenStax 9 冊の本文（CNXML）を written コーパスとして取得（CC BY-NC-SA、コミット固定）
- pnpm corpus:fetch:notes … MIT OCW の講義ノート（PDF → pdftotext）を written コーパス mit-notes として取得
- pnpm corpus:fetch:micase -- <zip か展開済みフォルダ> … MICASE（TalkBank CABank）の書き起こしを話し言葉コーパス micase にする。**phrases だけに数える**。
  TalkBank はサインインした人にしか zip を出さないので、人間が落として手で実行する（docs/SOURCES.md）
- pnpm corpus:fetch:mse … phrases の学生の場面と email・discord の要の部分を Math Stack Exchange の検索で数える（件数だけ。API キーなし・1 日 300 件。corpus:count の後に回す。キャッシュ scripts/corpus/mse-counts.json）
- pnpm corpus:count … コーパスの重複（同じファイル・同じ文）を除いて候補表現を数える → corpus/counts.json
- pnpm corpus:probe … 書く前に候補表現を数える。`-- --decide --file x.txt` で 1 ブロック 1 エントリの判定まで出す
- pnpm corpus:decide … 頻度比で register を決め、`-- --write` で evidence と flags を書き戻す（`--units <curriculum id,…>` で単元に絞る）
- python3 scripts/ledger/refetch.py … 台帳の langlink と参照（AP Calculus ／ AP Statistics の CED・Nicholson・Levin。docs/SOURCES.md）を一括取得（キャッシュ・タイムアウト・リトライ上限つき）
- python3 scripts/ledger/fetch_jp_exams.py … 慣習差の日本側: 共通テスト・センター試験の本試験 数学の問題と正解（センターのサイトと Internet Archive の写し）を一括取得し、画像だけの PDF は macOS の Vision で OCR（docs/SOURCES.md）
- pnpm build      … validate → search-index → OGP 画像 → サイト → dist/data の書き出し（Anki・PDF は verified があるときだけ）まで通す
- pnpm export     … JSON/CSV/Quizlet TSV を dist/data に出力
- pnpm export:anki ／ pnpm export:pdf … Anki デッキ（genanki。`python3 -m venv .venv && .venv/bin/pip install -r scripts/requirements.txt`）と単語対訳表 PDF（手元の Chrome）。verified だけ。0 件なら何も書かない
- pnpm perf       … Phase 4 の完了条件を測る（Lighthouse モバイル・初回の検索までの時間）。`-- --site <dir> --label <name>`。結果は perf/（gitignore）
- pnpm test       … スクリプトと検索のユニットテスト
- pnpm dev        … ローカルで確認

## 絶対ルール
1. データは 1 エントリ 1 ファイル。id は英語ケバブケースで、ファイル名と一致させる。スキーマ（schema/）を勝手に変えない。
2. 出典のない語は confidence: draft。出典を捏造しない。分からなければ draft のまま残す。
3. 定義・例文は自作。JMdict / Weblio / 教科書 / 他サイトの文章を書き写さない（データは CC0）。
4. 英語は「米国の教室で先生・TA が実際に言う言い方」を基準にし、書き言葉と話し言葉を register で分ける。
5. 日米で 1 対 1 対応しない語は mapping: near/none を正直に付け、mapping_note で米国の扱いを書く。
6. 判断に迷ったら止まらず docs/DECISIONS.md に 1 行書いて進める。ユーザーに確認を求めるのはスキーマ変更と公開時だけ。
7. 生成は 50 語 1 バッチ 1 コミット。各バッチ前に docs/STYLE.md を読み直す。
8. 監査（audits/）は生成したセッションと別セッションで行う。自分で生成した語を自分で verified にしない。
9. register の判断はコーパスの頻度を優先する（PLAN 15）。`evidence` は corpus:decide が書くもので、手で書かない。
   判定は 3 通り: ①3:1 以上か、首位だけが 10 件以上で主見出し ②各 10 件以上なら併記（頻度順で `en.variants` へ）③10 件未満は判断不能。
   件数の最も多いソースを抜くと別の言い方が首位になる ① は ② に下げる（1 ソース頼み。抜いて ③ になるだけなら ① のまま記録）。
   terms は語形変化をまとめ、「…」は 1〜3 語の空き。話・書とも ③ の語は、mapping near/none で全候補が話・書とも 10 件未満なら
   「英語に決まった言い方がない」（参照のどれかが候補を 3 件以上使っていれば除く）、それ以外は CED（AP Calculus ／ AP Statistics）→ OpenStax・IM・CK-12（同じ段、件数の多い候補）→ Nicholson ／ Levin → 英語版 Wikipedia の記事名（数学カテゴリから 4 段以内）の呼び方を見出しにする（どちらも register は主張しない）。
   記号の ③ も同じ段の順で、参照の 1 つが 3 件以上使う読み（CED は 1 件から。Wikipedia は使わない）にする（lib.ts settleSymbolReading）。
   話し言葉の首位が 1 ソース頼み（抜くと ③ か別の候補が首位）で、書き言葉（①）か CED が別の言い方で決まっていれば、
   その言い方を en.term にし、話し言葉の言い方は register spoken の variant にする（書き言葉か CED が同じ言い方なら当てない）。
   **人間レビューに回るのは、そのどれにも当たらない ③ と、コーパスの結論がエントリの register と食い違うものだけ。**
   全 2,000 語を人間が見る前提は廃止された。
10. コーパス本文はリポジトリに入れない（`corpus/` は .gitignore）。残すのは出典 ID・件数・日付だけ。
    本文（definition・examples・pitfalls・mapping_note・variants の note）に用例コーパスの件数を書かない。比べる書き方にし、件数は evidence に任せる
    （参照 CED・OpenStax・IM・CK-12・Nicholson・Levin の件数は書いてよい。validate が警告する）。
11. テスト・検証（tsc・validate・spell・test・build・crosscheck）の合否は**終了コードで判定する**。出力を grep・tail・head で絞って
    合否を読まない（「Tests 120 passed」だけを拾って「Test Files 1 failed」を見落としたバッチ 6 の再発防止）。
    `cmd > log 2>&1; echo "exit=$?"` のように終了コードを必ず表示し、0 でなければコミットしない。ログを絞るのは失敗の中身を読むときだけ。

## 完了の定義（1 エントリ）
必須項目すべて／読み仮名（ひらがな）／出典 1 件以上／validate 緑／crosscheck の flags なし（あれば理由付き）／
例文 1 文以上（pos が verb なら 2 文）。

## リポジトリの地図
```
data/          5 コレクション。1 エントリ 1 ファイル
schema/        JSON Schema。_common.schema.json に共有定義
scripts/       validate / crosscheck / build-index / export（TypeScript, tsx で実行）
scripts/corpus/ 用例コーパスのパイプライン（fetch → count → decide）。lib.ts に判定ロジック
corpus/        取得した書き起こし。gitignore。本文はコミットしない
src/           Astro サイト。src/lib/data.ts がビルド時にデータを読む
ledger/        Phase 1 の見出し語台帳（CSV）
audits/        Phase 5 の別セッション監査の記録
docs/          PLAN.md（仕様） STYLE.md（編集方針） DECISIONS.md（仕様外の判断） SOURCES.md（参照）
```
