# ledger — Phase 1 の見出し語台帳

`terms.csv` は Phase 2 で `data/terms/*.json` を生成するための **見出し語候補の一覧**。本文（定義・例文）は持たない。
人間が 15 分眺めて「抜け」「怪しい対応」を指摘するためのもの。編集は CSV を直接でよい（1 行 1 語）。

再生成: `python3 scripts/ledger/build.py all`（`--offline` で Wikipedia / Wikidata を叩かず、キャッシュだけで作る）。
元データは `scripts/ledger/seed_*.txt`（単元ごとの候補）と `scripts/ledger/curriculum_spec.py`（単元定義）。

## 列

| 列 | 内容 |
|---|---|
| `id` | 暫定の英語ケバブケース id。Phase 2 のファイル名候補。衝突したものは `-<単元の末尾>` が付いている（`flag` に `id-dedup`）。Phase 2 で改名してよい |
| `ja` | 見出し語（日本語）。同音異義は「表（硬貨）」のように括弧で区別 |
| `en` | 暫定 `en.term`。「米国の教室で言う言い方」を優先。Phase 2 でコーパス（PLAN 15）により確定する |
| `en_alt` | 同じ `ja` が別の単元で別の英語になっていた場合の他候補。`英語 [単元]` の形。Phase 2 で `en.alt` / `en.variants` に振り分ける |
| `pos` | `noun` / `verb` / `adjective` / `phrase` |
| `unit` | `data/curriculum/` の id。その語を最初に習う単元 1 つだけ |
| `domain` | `schema/_common.schema.json` の `domain` enum。単元の既定値 |
| `level_jp` | `level.jp` の enum 値。米国側から洗った語は `大学`、日本の教育課程に対応物がない語（PEMDAS、FOIL 等）は `—` |
| `level_us` | `level.us` の enum 値。複数は `\|` 区切り |
| `mapping` | 仮置きの `exact` / `near` / `none`。`near` / `none` の理由は `note` |
| `source` | 出典種別の仮置き。`wikipedia-langlink`（ja 記事に en 記事対応あり）／ `wikidata`（ja 記事と QID はあるが en 記事なし）／ `textbook`（米国側の教科書の目次・索引由来）／ `editorial`。**名詞以外は必ず editorial**（Wikipedia は動詞の出典にならない） |
| `wiki_ja` | 突合に使った ja.wikipedia の記事名（リダイレクト解決後）。参考情報で、`source` が editorial でも入っていることがある |
| `wiki_en` | その記事の英語版タイトル（langlink）。`en` と一致しなくてよい（記事名 ≠ 教室の言い方）。Phase 2 の crosscheck の材料 |
| `wikidata` | QID |
| `flag` | `id-dedup` ／ `ja-merged`（同じ ja の行を統合した）／ `wiki-redirect`（記事が別概念へのリダイレクトだった。出典にしていない）／ `wiki-disambig`（曖昧さ回避ページ）／ `wiki-nonmath`（数学以外の記事に当たった。出典にしていない） |
| `note` | mapping の理由、米国での言い方、STYLE.md への参照など |

## 数の目安

単元別の件数、品詞の内訳、出典の内訳、対応が怪しい語 30 は `phase1-report.md`。
