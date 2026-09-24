# MathEigo JA⇄EN

日本の中高〜大学初年次の数学用語を、米国の教室で「言える・書ける・聞き取れる」ようにするための
無料・オープンデータ（CC0）の日英数学辞典。仕様は docs/PLAN.md、編集方針は docs/STYLE.md。

## コマンド
- pnpm validate   … JSON Schema・重複・LaTeX・参照切れ・完了の定義（コミット前に必ず）
- pnpm spell      … 英語スペル検査（cspell）
- pnpm crosscheck … Wikipedia langlinks / 対訳表との突合（`-- --write` で flags を書き戻す）
- pnpm corpus:fetch … 用例コーパスの取得元一覧 / マニフェスト検証（PLAN 15）
- pnpm corpus:fetch:ocw … MIT OCW の書き起こし(.vtt)を自動取得（公式配布・CC BY-NC-SA）
  YouTube / Khan は `./scripts/corpus/fetch-captions.sh` を人間が手で実行する
- pnpm corpus:fetch:openstax … OpenStax の本文（CNXML）を written コーパスとして取得（CC BY-NC-SA、コミット固定）
- pnpm corpus:count … コーパスを走査して候補表現を数える → corpus/counts.json
- pnpm corpus:decide … 頻度比で register を決め、`-- --write` で evidence と flags を書き戻す
- pnpm build      … validate → search-index → サイト → dist/data の書き出しまで通す
- pnpm export     … JSON/CSV/Quizlet TSV を dist/data に出力
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
   判定は 3 通り: ①3:1 以上で主見出し ②各 10 件以上なら併記（頻度順で `en.variants` へ）③10 件未満は判断不能。
   **人間レビューに回るのは ③ と、コーパスの結論がエントリの register と食い違うものだけ。**
   全 2,000 語を人間が見る前提は廃止された。
10. コーパス本文はリポジトリに入れない（`corpus/` は .gitignore）。残すのは出典 ID・件数・日付だけ。

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
docs/          PLAN.md（仕様） STYLE.md（編集方針） DECISIONS.md（仕様外の判断）
```
