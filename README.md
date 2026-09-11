# MathEigo JA⇄EN

日本で数学を学んだ人が、米国の教室・オフィスアワー・宿題・試験で
**言える・書ける・聞き取れる**ようになるための、無料・オープンデータの日英数学辞典。

単語帳ではなく 5 点セット。

1. **用語** — 日⇄英、読み、定義、例文
2. **記号・式の読み上げ** — "x squared", "the integral from a to b of f of x d x"
3. **場面別フレーズ** — 質問する／解き方を説明する／答案に書く
4. **日米の慣習差** — ≦ と ≤、y=ax+b と y=mx+b、∴ を書くか書かないか
5. **カリキュラム対応表** — 中1〜数C ⇄ Algebra 1〜Calculus III / Linear Algebra / Statistics

データは **CC0 1.0**、コードは **MIT**。再利用・アプリ組み込み・言語モデルの学習に制限はありません。

---

## A Japanese–English mathematics dictionary

Free, open (CC0) bilingual reference for students who learned mathematics in
Japanese and now take it in English. Beyond term pairs it covers how to *read
expressions aloud*, what to *say in class and office hours*, how notation and
proof style differ between Japanese and US classrooms, and how the two
curricula line up. Contributions and error reports are welcome.

---

## 使い方（開発）

```bash
pnpm install
pnpm dev        # ローカルで表示・検索
pnpm validate   # スキーマ・重複・LaTeX・参照切れ
pnpm test       # 検索と検証のテスト
pnpm build      # validate → 検索インデックス → サイト → dist/data
pnpm crosscheck # Wikipedia の言語間リンクと突合
```

Node 20 以上と pnpm が必要です。

## 構成

| 場所 | 中身 |
|---|---|
| `data/` | 5 コレクション。1 エントリ 1 ファイルの JSON |
| `schema/` | JSON Schema。`validate` が使う |
| `scripts/` | validate / crosscheck / build-index / export |
| `src/` | Astro の静的サイト |
| `docs/PLAN.md` | 仕様書。何をどう作るか |
| `docs/STYLE.md` | 英語表現の編集方針。生成時に毎回読む |
| `docs/DECISIONS.md` | 仕様に無い判断の記録 |

## 貢献

一番ありがたいのは「米国の教室では実際にこう言う」という報告です。
[CONTRIBUTING.md](CONTRIBUTING.md) を読んでから issue を立ててください。

## 状態

Phase 0（土台）完了。サンプル 25 件で CI が通る状態です。
用語の本格生成は Phase 2 から。公開の閾値は `verified` が用語 1,000・記号 200・フレーズ 200・慣習差 30。
