# SOURCES — 参照（③ の見出しの決め方に使う資料）

用例コーパス（PLAN 15。`corpus/manifest.json`）とは別に、コーパスで決まらない語（話・書とも ③）の見出しを決めるときに読む資料。
**本文は写さない。使うのは件数と節の番号・見出しだけ**（STYLE 原則 5）。PDF とテキストは `corpus/ref/`（gitignore）に置き、リポジトリには入れない。

取得は 1 回でまとめて: `python3 scripts/ledger/refetch.py refs`（PDF 4 つと IM。タイムアウト 30 秒・リトライ 3 回、進捗 done/total、
取得済みのテキスト・ページがあるものは取り直さない）。英語版 Wikipedia の記事名は `python3 scripts/ledger/wikihead.py`
（同じくタイムアウト・リトライ上限・done/total、キャッシュ `scripts/ledger/wiki_head_cache.json`）。
count.ts と probe.ts は `scripts/corpus/references.ts` で読む。

## 規則 2 の参照の順

話・書とも ③ で「英語に決まった言い方がない」に当たらない語は、次の順に最初に呼び方が見つかった資料の呼び方を見出しにする
（`corpus-reference-fallback`。register は主張しない。lib.ts `settleUndecided`）。同じ段の中では件数の多い候補。

1. **CED**: AP Calculus ／ AP Statistics（College Board）
2. **OpenStax と IM**（同じ段）: OpenStax は用例コーパスの 6 冊の本文と節の名前、IM は 6 コースのレッスン・練習問題の件数と glossary の見出し。
   2 つを合わせて件数の多い候補（lib.ts `settleUndecided`）
3. **Nicholson ／ Levin**
4. **英語版 Wikipedia の記事名**: ja 側の langlink 先（エントリの wikipedia-langlink の出典、無ければ ja.term の記事。
   ja の記事は数学カテゴリから 4 段以内で、別の記事へのリダイレクトでないもの）、無ければ en.term がリダイレクト解決後に当たる記事。
   英語の記事も数学カテゴリから 4 段以内（ja 側と同じ規則。wikicat.py）で、曖昧さ回避ページ・別の記事の節へのリダイレクトは使わない。
   記事が別の概念のものは lib.ts `WIKIPEDIA_NOT_SAME` に理由付きで外す。flag は corpus-reference-fallback、note は「Wikipedia の記事名」

3 か 4 で決まった語（CED・OpenStax・IM のどの候補も 0 件）は、mapping_note に「米国の高校課程（CED・OpenStax・IM）では扱わない」と件数を書く
（decide が「直すこと」に出す）。
「英語に決まった言い方がない」の例外（英語の名前があると分かっているもの）に数えるのは、1 の CED の呼び方、IM の glossary の見出し、mapping none で ja が本プロジェクトの訳語の語（米国の名前が元）、ja と en が同じ語（LIATE）（DECISIONS「Phase 2 幾何・離散の単元 2」）。

## 一覧

| id（corpus/ref/） | 資料 | 版 | ライセンス | 取得元 | 区切り |
|---|---|---|---|---|---|
| ap-calculus-ab-bc-ced | College Board, *AP Calculus AB and BC Course and Exam Description* | Effective Fall 2020 | College Board の著作物（公開 PDF） | https://apcentral.collegeboard.org/media/pdf/ap-calculus-ab-and-bc-course-and-exam-description.pdf | TOPIC n.m ／ unitN ／ front ／ exam |
| ap-statistics-ced | College Board, *AP Statistics Course and Exam Description* | Effective Fall 2026（5 単元） | College Board の著作物（公開 PDF） | https://apcentral.collegeboard.org/media/pdf/ap-statistics-course-and-exam-description.pdf | 同上 |
| nicholson-lawa-2021a | W. Keith Nicholson, *Linear Algebra with Applications*（Lyryx with Open Texts） | 2021A | CC BY-NC-SA 4.0 | eCampusOntario Open Library の配布 PDF: https://openlibrary-repo.ecampusontario.ca/jspui/bitstream/123456789/897/2/Nicholson-OpenLAWA-2021A.pdf | 節 n.m（本文の見出し） |
| im-6-8 | Illustrative Mathematics, *IM 6–8 Math*（Grade 6・7・8。生徒向けのレッスンと練習問題のページ、各学年の glossary） | Kendall Hunt 配布版（2026-09-25 取得。© 2017–2019 Open Up Resources、改訂 © 2019 Illustrative Mathematics） | **CC BY 4.0**（ページ下の表示。Illustrative Mathematics の名前とロゴは対象外） | https://im.kendallhunt.com/MS/students/1/index.html ほか（/MS/students/{1,2,3}/…、glossary.html） | レッスン「Grade 7 3.2 Title」（単元.レッスン） |
| im-9-12 | Illustrative Mathematics, *IM 9–12 Math*（Algebra 1・Geometry・Algebra 2。同上） | Kendall Hunt 配布版（2026-09-25 取得。© 2019 Illustrative Mathematics） | **CC BY 4.0**（同上。名前とロゴは対象外） | https://im.kendallhunt.com/HS/students/1/index.html ほか（/HS/students/{1,2,3}/…。Algebra 1 Supports の 4 は取らない） | レッスン「Geometry 1.3 Title」 |
| levin-dmoi4 | Oscar Levin, *Discrete Mathematics: An Open Introduction* | 4th edition | **CC BY-NC-SA 4.0**（4 版のページ https://discrete.openmathbooks.org/dmoi4.html の License 欄。3 版までの CC BY-SA に Non-Commercial が加わった） | https://discrete.openmathbooks.org/pdfs/dmoi4.pdf | 節 n.m（本文の見出し） |

### 注意

- **AP Statistics の CED は 2026 年版で 5 単元**（1 探索的データ分析とデータの集め方、2 確率・確率変数・確率分布、3 カテゴリデータの推測、4 量的データの推測、5 回帰）。
  台帳と data/curriculum の単元も 2026 年版の 5 単元（`us-ap-statistics-1-exploring-and-collecting-data`〜`5-regression-analysis`）。旧版の 9 単元からの付け替え表は `scripts/ledger/fix_decisions.py` の `AP_STATS_2026_*`（fix_phase1.py 手順 13）。2026 年版に無い内容（傾きの推測・適合度検定・幾何分布・確率変数の和など 16 語）は level.us を Intro Statistics にした。
- Nicholson の出版元 lyryx.com は 2026-09-25 に名前解決できなかったので、eCampusOntario の公開リポジトリ（CC BY-NC-SA 4.0 と明記）の 2021A を使った。
- Nicholson と Levin は CC BY-NC-SA、CED は College Board の著作物。どれも辞典のデータ（CC0）に文を入れない。
- IM は `refetch.py im` がコース → 単元 → レッスンの順にたどり、各レッスンの生徒向けページ（index.html）と練習問題（practice.html）の `<main>` だけを
  `corpus/ref/im/pages/` にページ単位でキャッシュし、`corpus/ref/im-6-8.txt` ／ `im-9-12.txt`（レッスンごとの区切り）と `im-glossary.json`（コース → glossary の見出し）にまとめる。
  GeoGebra の埋め込みデータは捨てる。CC BY 4.0 だが、辞典のデータ（CC0）には文を入れず、件数とレッスンの名前・glossary の見出しだけを使う（STYLE 原則 5 と同じ扱い）。
- 英語版 Wikipedia は記事名（タイトル）だけを使う。`scripts/ledger/wiki_head.json`（コミットする。タイトルと段数だけ）。
- 本から数える範囲は本文だけ。前付け（目次・序文）と後付け（略解・索引）は数えない（lib.ts `bookSections`）。
- 出典に挙げるときは `type: reference`、`title` に書名と版、`url`、`note` に topic 番号か節の番号と見出し。
