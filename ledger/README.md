# ledger — Phase 1 の見出し語台帳

`terms.csv` は Phase 2 で `data/terms/*.json` を生成するための **見出し語候補の一覧**。本文（定義・例文）は持たない。
人間が 15 分眺めて「抜け」「怪しい対応」を指摘するためのもの。編集は CSV を直接でよい（1 行 1 語）。

作り方は 2 段:
1. `python3 scripts/ledger/build.py all` — Phase 1 の生成（`--offline` でキャッシュだけで作る）。元データは
   `scripts/ledger/seed_*.txt`（単元ごとの候補）と `scripts/ledger/curriculum_spec.py`（単元定義）
2. `python3 scripts/ledger/fix_phase1.py` — Phase 1 レビューの反映。**入力は Phase 1 のコミット（5593045）の
   `terms.csv` 固定**なので何度回しても同じ結果になる。判断は `scripts/ledger/fix_decisions.py` に 1 行ずつ。
   前提: `python3 scripts/ledger/wikicat.py`（Wikipedia のカテゴリ判定 → `wiki_cat.json`）と
   `python3 scripts/ledger/fetch_mext.py`（学習指導要領の本文 → `scripts/ledger/mext/`、gitignore）と
   `python3 scripts/ledger/wikien.py`（`title:` 行の英語照合に使う langlink とリダイレクト先、曖昧さ回避ページのリンク先 → `wiki_en.json`）

   `python3 scripts/ledger/refetch.py langlinks`（台帳の wiki_ja すべての en langlink を取り直す → `langlinks.json`。手順 7 が使う）

2 以降に CSV を手で直した場合は、`fix_phase1.py` を回し直すと上書きされる。直した内容は `fix_decisions.py` に足す。

`fix_phase1.py` の手順 7・8 は Phase 2 修正（DECISIONS 2026-09-24）: 7 は取り直した langlink で空の wiki_en を埋め、
wikidata だけだった行を wikipedia-langlink にする。8 は積分の単元の 1 概念 1 エントリ（`fix_decisions.py` の
`PHASE2_SAME` 同じ概念 ／ `PHASE2_SECTION` 教科書の節の名前 ／ `PHASE2_TO_SYMBOLS` ／ `PHASE2_TO_PHRASES` 授業の言い回し）。
9 は微分・極限の単元に同じ規則を当てる（`PHASE2B_SAME` ／ `PHASE2B_SECTION` ／ `PHASE2B_INSTANCE` 引数を入れただけの行・コロケーション ／
`PHASE2B_RENAME` ／ `PHASE2B_TO_SYMBOLS` ／ `PHASE2B_TO_PHRASES`）。
10 は数列・級数・多変数の単元に同じ規則を当て、人間が範囲外にした ③ を out-of-scope に移す（`PHASE2C_SAME` ／ `PHASE2C_SECTION` ／
`PHASE2C_INSTANCE` ／ `PHASE2C_RENAME` ／ `PHASE2C_TO_SYMBOLS` ／ `PHASE2C_TO_PHRASES` ／ `PHASE2C_OUT_OF_SCOPE`）。寄せ先が後の単元の行なら、その行もこの単元に入る。

13 は AP Statistics の単元を CED 2026 年版の 5 単元に付け替える（`AP_STATS_2026_MAP` 旧単元 → 新単元 ／ `AP_STATS_2026_BY_ID` 行ごとの例外 ／
`AP_STATS_2026_DROP` 2026 年版に無い内容: level_us から AP Statistics を外し Intro Statistics にする）。旧 id は手順 13 の後には残らない。

## 列

複数値は `|` 区切り（`flag` だけ空白区切り）。

| 列 | 内容 |
|---|---|
| `id` | 英語ケバブケース id。Phase 2 のファイル名。1 概念 1 行（同じ英語でも別概念なら別 id: `divisor` 約数 / `divisor-in-division` 除数）。旧 id との対応は `id-changes.csv` |
| `ja` | 見出し語（日本語）。同音異義は「表（硬貨）」のように括弧で区別 |
| `ja_alt` | 同じ概念の別名・カタカナ語（`ja.alt` になる）。統合した行の見出し語もここに入る |
| `en` | 暫定 `en.term`。「米国の教室で言う言い方」を優先。Phase 2 でコーパス（PLAN 15）により確定する |
| `en_alt` | 他の英語候補。`英語 [単元]` の形のものは、同じ `ja` が別の単元で別の英語になっていたもの。Phase 2 で `en.alt` / `en.variants` に振り分ける |
| `en_variants` | register が `en` と違う言い方（`en.variants`）。`英語@register` の形（例 `necessary and sufficient condition@written`） |
| `pos` | `noun` / `verb` / `adjective` / `phrase` |
| `unit` | `data/curriculum/` の id。その語を扱う単元（複数可。最初が最初に習う単元）。Phase 2 で各単元の `term_refs` に入る |
| `domain` | `schema/_common.schema.json` の `domain` enum。単元の既定値 |
| `level_jp` | `level.jp` の enum 値（複数可）。日本の学習者がその内容に出会う段階。日本の高校までに扱わない内容は `大学` |
| `level_us` | `level.us` の enum 値（複数可） |
| `mapping` | `exact` / `near` / `none`。**語の対応の質**であって範囲ではない（固有値 = eigenvalue は大学の語でも `exact`）。`none` は相手側に名前がない（PEMDAS、増減表）。理由は `note` |
| `source` | 出典種別の仮置き。`wikipedia-langlink`（ja 記事に en 記事対応あり）／ `wikidata`（ja 記事と QID はあるが en 記事なし）／ `textbook`（米国側の教科書の目次・索引由来）／ `editorial`。**名詞以外は必ず editorial**（Wikipedia は動詞の出典にならない） |
| `wiki_ja` | 突合に使った ja.wikipedia の記事名（リダイレクト解決後）。**ja 記事が数学カテゴリ配下（`Category:数学` / `統計学` / `数理科学` まで 4 段以内）で、同じ概念のときだけ残す**。外したものは `note` に「wiki 除外」と理由 |
| `wiki_en` | その記事の英語版タイトル（langlink）。`en` と一致しなくてよい（記事名 ≠ 教室の言い方）。Phase 2 の crosscheck の材料。英語照合で ok になった行は `wiki_en.json` の langlink で埋めてある |
| `wikidata` | QID |
| `ja_basis` | 日本語見出しの根拠。`mext`（学習指導要領の本文に同じ表記が出る。1 文字の語は〔用語・記号〕にあるものだけ）／ `wikipedia`（`wiki_ja` の記事かその転送元）／ `editorial`（本プロジェクトの訳語。米国側から洗った語の多く） |
| `ja_check` | 見出し語と根拠の表記の照合。`ok`／`alt:<表記>`（根拠の表記は `ja_alt` 側にある。見出しは教科書の表記のまま入れ替えない）／`—`（照合先なし）。見出し語が記事名と違う転送元だった行（旧 `title:`）は英語で照合する: ja 記事の en langlink と `en` の en.wikipedia 記事がリダイレクト解決後に同じなら `ok`（`en` が曖昧さ回避ページに着いた場合は、そのページが langlink 先にリンクしていれば `ok`。ただし ja 記事が見出しと別概念の行は `fix_decisions.py` の `EN_CHECK_WRONG` で 1 行ずつ外す）、違えば wikipedia を根拠から外し（`editorial` / `—`）、langlink も出典にしない（DECISIONS 2026-09-24） |
| `flag` | `ja-merged`（同じ ja の行を統合した）／ `merged`（重複 id を統合した）／ `reviewed-30`（Phase 1 の 30 語レビュー済み）／ `wiki-redirect`（記事が転送先）／ `wiki-disambig`（曖昧さ回避ページ）／ `wiki-rejected`（langlink を出典から外した） |
| `note` | mapping の理由、米国での言い方、STYLE.md への参照、wiki 除外の理由など |

## ほかのファイル

| ファイル | 内容 |
|---|---|
| `out-of-scope.csv` | 台帳から外した語と理由（小学校範囲、数学用語でないもの） |
| `id-changes.csv` | Phase 1 からの id の変化（`merged` / `renamed` / `out-of-scope`）。Phase 2 修正で消した id は `merged-into`（new_id は寄せた先。symbols に移したものは `symbols/<id>`）か `to-phrases` |
| `phrases-candidates.csv` | terms から外した授業での言い回し（Phase 3 の phrases 候補）。`from` は Phase 2 で生成した本文の場所（git のコミットとパス） |
| `symbols.csv` | Phase 3 の記号の候補（220）。`id,symbol,ja_reading,en_readings,level,source` と補助の `category,term_ref,note,related`（related は同じ記法の慣習差の id。記号は読み方と書き方、慣習差は違いの説明）。source の「OpenStax 488」などは参照での出現数（`python3 scripts/ledger/symbol_refs.py` が `scripts/ledger/symbol_probes.json` の文字列で数え直す）。en の読みは候補で、Phase 3 で用例コーパスで数える |
| `conventions.csv` | Phase 3 の日米慣習差の候補（121）。`id,summary,term_refs,source` と補助の `category,appendix_b`（PLAN 付録 B の行）`,merged_from,related`（related は同じ記法の記号の id）。Phase 2 の pitfalls・mapping_note から抜き出した |
| `phrases.csv` | Phase 3 のフレーズの候補（274）。`id,situation,ja,en,level,source` と `merged_from`（まとめた同じ意図の行）、`micase_scene,micase_counts`（MICASE の学生の発話から足した 8 行だけ。5 件以上になった場面と、形ごとの 4 つの場面の件数。`python3 scripts/ledger/phrases_micase.py` が書き、件数は `pnpm corpus:scenes` で数え直せる）。`phrases-candidates.csv` の 83 行と既存の 5 を含む。en は「 ／ 」区切りで先頭が主文。数えるのは文ではなく要の部分（`scripts/corpus/phrase-forms.ts` の `PHRASE_FORMS`）で、場面の話者のコーパスで数える（`scripts/corpus/lib.ts` の `phraseGroup`） |
| `phase3-removed.csv` | Phase 3 の記号の前の修正で conventions・phrases から外した行と理由・行き先（terms の id）。`scripts/ledger/phase3_fixes.py` が書く |
| `mext-yougo.csv` | 学習指導要領（中学 平成29年告示・高校 平成30年告示）の〔用語・記号〕一覧。網羅率の分母 |
| `phase1-report.md` | Phase 1 時点の単元別件数と、対応が怪しい語 30。修正後の数字は `audits/phase1-fix-report.md` |
