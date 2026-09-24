# Phase 1 引き継ぎ（MathEigo）

Phase 0 完了時点の状態と、Phase 1 を別セッションで始めるための情報。
新しいセッションの冒頭に、このファイルごと貼るか、末尾の「貼り付け用プロンプト」を使う。

---

## Phase 0 は完了している

`pnpm validate && pnpm spell && pnpm test && pnpm build` がすべて緑。

| 項目 | 状態 |
|---|---|
| リポジトリ | Astro + TypeScript + Vitest + ESLint/Prettier + cspell |
| スキーマ | `schema/` に 5 コレクション ＋ `_common`。`evidence` / `en.variants` 追加済み |
| スクリプト | validate / crosscheck / build-index / export / corpus（fetch-ocw, count, decide） |
| サイト | `/`（検索）`/terms/{id}` `/symbols` `/phrases/{situation}` `/conventions` `/curriculum` `/download` `/about` |
| サンプル | terms 10 / symbols 5 / phrases 5 / conventions 3 / curriculum 2 |
| テスト | 41 本（検索・検証・コーパス） |
| CI | GitHub Actions（validate → spell → test → build → GitHub Pages デプロイ） |
| コーパス | MIT OCW 5 コース 291 本 約 93 万語を取得・集計済み |

**Phase 1 は未着手。** `data/curriculum/` はサンプル 2 件、`ledger/` は空。

---

## 確定している判断（覆さないこと）

すべて `docs/DECISIONS.md` に理由つきで入っている。読むこと。

- 名前は **MathEigo**。公開先は GitHub Pages の org サイト（`matheigo/matheigo.github.io`）。ドメインはデプロイ直前に `.org` を取得
- JSON Schema の `$id` は `https://matheigo.org/schema/...`。**名前空間の識別子であって取得先ではない。変えない**
- `level.us` の語彙は enum で固定。付録 A の科目名と完全一致（`Intro Statistics` / `Discrete Math`。`Introductory Statistics` や `Discrete Mathematics` ではない）
- `confidence: likely` は既定 OFF のトグルで表示。未確認ページには `noindex`。Anki / Quizlet / PDF は verified のみ
- コーパス判定は 3 通り。①3:1 以上で主見出し ②各 10 件以上なら併記（頻度順で `en.variants`）③10 件未満は判断不能
- **人間レビューに回すのは ③ と register 不一致だけ。** 全語を人間が見る前提は廃止
- `sameWording` の統合は語形変化と引数省略のみ。`integral` / `integrate` / `integration` は別の語
- ソースの重み付けは max(25%, 1/ソース数) の water-filling。拒否ではない
- 記号の count はワイルドカード照合（`countPattern`）。terms / phrases は literal
- `textbook` 出典の第一基準は **OpenStax *Calculus* Volume 1**（CC BY-NC-SA 4.0）

---

## Phase 1 でやること（PLAN.md §9）

1. **`data/curriculum/` を完成させる** — 付録 A を JSON 化。MEXT 2018 改訂の科目・単元・小項目を正、米国側は Traditional / Integrated / AP / 大学初年次の 4 系統
2. **`ledger/terms.csv` に見出し語候補を 2,000 行**。`ja.term` と暫定 `en.term` だけ。本文は書かない
3. 単元ごとに**動詞・形容詞・句を最低 10%**（代入する、移項する、両辺を〜で割る、成り立つ、満たす、任意の、ある〜が存在する…）
4. ブートストラップ: 日本語 Wikipedia の数学記事タイトル ＋ MediaWiki langlinks、Wikidata（CC0）のラベル
5. 米国側から逆に洗う: OpenStax の目次・索引に出て日本語側に無い語（sec/csc/cot, hyperbolic functions, Taylor series, washer/shell method, related rates, u-substitution, epsilon-delta …）

完了条件: `ledger/terms.csv` が 2,000 行前後、全行に単元・品詞・レベル・出典種別。

報告すること: **単元別の件数表**と、**対応が怪しい語 30 個**。

---

## Phase 1 の前後に控えている作業

- **OpenStax *Calculus* Volume 1 の written コーパス投入** — Phase 2 の前。現状コーパスは OCW（話し言葉）だけで、`written` の件数はどの語も 0
- **Khan Academy の字幕投入** — 人間が `./scripts/corpus/fetch-captions.sh` を手で実行する。通分する・移項する はこれ待ちで判断保留中
- `audits/corpus-2026-09-11.md` の「③ 人間レビュー行き」3 件

---

## 貼り付け用プロンプト

> このリポジトリの `docs/PLAN.md`、`CLAUDE.md`、`docs/DECISIONS.md`、`docs/STYLE.md` を読んで。
> Phase 0 は完了している（`pnpm validate && pnpm build` が緑、サンプル 25 件入り、MIT OCW 5 コース 93 万語のコーパス集計済み）。
> DECISIONS.md に入っている判断は覆さないで。
>
> Phase 1 を実行して。本文は書かず、`data/curriculum/` の完成と `ledger/terms.csv` の見出し語台帳だけ作る。
> 名詞に偏らないよう単元ごとに動詞・句を最低 10% 入れて。
> 終わったら単元別の件数表と、対応が怪しい語 30 個を挙げて。
> 私に確認を求めるのはスキーマ変更と公開のときだけ。他は `docs/DECISIONS.md` に 1 行書いて進めて。
