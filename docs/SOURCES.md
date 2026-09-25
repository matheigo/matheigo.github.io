# SOURCES — 参照（③ の見出しの決め方に使う資料）

用例コーパス（PLAN 15。`corpus/manifest.json`）とは別に、コーパスで決まらない語（話・書とも ③）の見出しを決めるときに読む資料。
**本文は写さない。使うのは件数と節の番号・見出しだけ**（STYLE 原則 5）。PDF とテキストは `corpus/ref/`（gitignore）に置き、リポジトリには入れない。

取得は 1 回でまとめて: `python3 scripts/ledger/refetch.py refs`（タイムアウト 30 秒・リトライ 3 回、進捗 done/total、
取得済みのテキストがあるものは取り直さない）。count.ts と probe.ts は `scripts/corpus/references.ts` で読む。

## 規則 2 の参照の順

話・書とも ③ で「英語に決まった言い方がない」に当たらない語は、次の順に最初に呼び方が見つかった資料の呼び方を見出しにする
（`corpus-reference-fallback`。register は主張しない。lib.ts `settleUndecided`）。同じ段の中では件数の多い候補。

1. **CED**: AP Calculus ／ AP Statistics（College Board）
2. **OpenStax**: 用例コーパスの 6 冊の本文と節の名前
3. **Nicholson ／ Levin**

「英語に決まった言い方がない」の例外（英語の名前があると分かっているもの）に数えるのは 1 の CED だけ（今までどおり）。

## 一覧

| id（corpus/ref/） | 資料 | 版 | ライセンス | 取得元 | 区切り |
|---|---|---|---|---|---|
| ap-calculus-ab-bc-ced | College Board, *AP Calculus AB and BC Course and Exam Description* | Effective Fall 2020 | College Board の著作物（公開 PDF） | https://apcentral.collegeboard.org/media/pdf/ap-calculus-ab-and-bc-course-and-exam-description.pdf | TOPIC n.m ／ unitN ／ front ／ exam |
| ap-statistics-ced | College Board, *AP Statistics Course and Exam Description* | Effective Fall 2026（5 単元） | College Board の著作物（公開 PDF） | https://apcentral.collegeboard.org/media/pdf/ap-statistics-course-and-exam-description.pdf | 同上 |
| nicholson-lawa-2021a | W. Keith Nicholson, *Linear Algebra with Applications*（Lyryx with Open Texts） | 2021A | CC BY-NC-SA 4.0 | eCampusOntario Open Library の配布 PDF: https://openlibrary-repo.ecampusontario.ca/jspui/bitstream/123456789/897/2/Nicholson-OpenLAWA-2021A.pdf | 節 n.m（本文の見出し） |
| levin-dmoi4 | Oscar Levin, *Discrete Mathematics: An Open Introduction* | 4th edition | **CC BY-NC-SA 4.0**（4 版のページ https://discrete.openmathbooks.org/dmoi4.html の License 欄。3 版までの CC BY-SA に Non-Commercial が加わった） | https://discrete.openmathbooks.org/pdfs/dmoi4.pdf | 節 n.m（本文の見出し） |

### 注意

- **AP Statistics の CED は 2026 年版で 5 単元**（1 探索的データ分析とデータの集め方、2 確率・確率変数・確率分布、3 カテゴリデータの推測、4 量的データの推測、5 回帰）。
  台帳と data/curriculum の単元も 2026 年版の 5 単元（`us-ap-statistics-1-exploring-and-collecting-data`〜`5-regression-analysis`）。旧版の 9 単元からの付け替え表は `scripts/ledger/fix_decisions.py` の `AP_STATS_2026_*`（fix_phase1.py 手順 13）。2026 年版に無い内容（傾きの推測・適合度検定・幾何分布・確率変数の和など 16 語）は level.us を Intro Statistics にした。
- Nicholson の出版元 lyryx.com は 2026-09-25 に名前解決できなかったので、eCampusOntario の公開リポジトリ（CC BY-NC-SA 4.0 と明記）の 2021A を使った。
- Nicholson と Levin は CC BY-NC-SA、CED は College Board の著作物。どれも辞典のデータ（CC0）に文を入れない。
- 本から数える範囲は本文だけ。前付け（目次・序文）と後付け（略解・索引）は数えない（lib.ts `bookSections`）。
- 出典に挙げるときは `type: reference`、`title` に書名と版、`url`、`note` に topic 番号か節の番号と見出し。
