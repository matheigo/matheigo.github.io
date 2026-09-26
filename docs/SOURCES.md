# SOURCES — 参照（③ の見出しの決め方に使う資料）

用例コーパス（PLAN 15。`corpus/manifest.json`）とは別に、コーパスで決まらない語（話・書とも ③）の見出しを決めるときに読む資料。
**本文は写さない。使うのは件数と節の番号・見出しだけ**（STYLE 原則 5）。PDF とテキストは `corpus/ref/`（gitignore）に置き、リポジトリには入れない。

取得は 1 回でまとめて: `python3 scripts/ledger/refetch.py refs`（PDF 4 つと IM と CK-12。タイムアウト 30 秒・リトライ 3 回、進捗 done/total、
取得済みのテキスト・ページがあるものは取り直さない）。英語版 Wikipedia の記事名は `python3 scripts/ledger/wikihead.py`
（同じくタイムアウト・リトライ上限・done/total、キャッシュ `scripts/ledger/wiki_head_cache.json`）。
count.ts と probe.ts は `scripts/corpus/references.ts` で読む。

## 規則 2 の参照の順

話・書とも ③ で「英語に決まった言い方がない」に当たらない語は、次の順に最初に呼び方が見つかった資料の呼び方を見出しにする
（`corpus-reference-fallback`。register は主張しない。lib.ts `settleUndecided`）。同じ段の中では件数の多い候補。

1. **CED**: AP Calculus ／ AP Statistics（College Board）
2. **OpenStax・IM・CK-12**（同じ段）: OpenStax は用例コーパスの 9 冊の本文と節の名前、IM は 6 コースのレッスン・練習問題の件数と glossary の見出し、
   CK-12 は Geometry と Algebra の節の本文の件数と節の名前。3 つを合わせて件数の多い候補（lib.ts `settleUndecided`）。
   IM と CK-12 は、前の節（レッスン）に出た 8 語以上の文を数えない（練習問題の再掲・レッスンごとの glossary の繰り返し。lib.ts `dedupeSections`）
3. **Nicholson ／ Levin**
4. **英語版 Wikipedia の記事名**: ja 側の langlink 先（エントリの wikipedia-langlink の出典、無ければ ja.term の記事。
   ja の記事は数学カテゴリから 4 段以内で、別の記事へのリダイレクトでないもの）、無ければ en.term がリダイレクト解決後に当たる記事。
   英語の記事も数学カテゴリから 4 段以内（ja 側と同じ規則。wikicat.py）で、曖昧さ回避ページ・別の記事の節へのリダイレクトは使わない。
   記事が別の概念のものは lib.ts `WIKIPEDIA_NOT_SAME` に理由付きで外す。flag は corpus-reference-fallback、note は「Wikipedia の記事名」

3 か 4 で決まった語（CED・OpenStax・IM・CK-12 のどの候補も 0 件）は、mapping_note に「米国の高校課程（CED・OpenStax・IM・CK-12）では扱わない」と件数を書く
（decide が「直すこと」に出す）。
「英語に決まった言い方がない」の例外（英語の名前があると分かっているもの）に数えるのは、1 の CED の呼び方、
参照（CED・OpenStax・IM・CK-12・Nicholson・Levin）のどれか 1 つが候補の 1 つを 3 件以上使っている語（lib.ts `REFERENCE_NAMED`。IM の glossary の見出しの例外を一般にしたもの）、
mapping none で ja が本プロジェクトの訳語の語（米国の名前が元）、ja と en が同じ語（LIATE）（DECISIONS「Phase 2 幾何・離散の単元 2」「単元 3 の前の修正」）。

## 一覧

| id（corpus/ref/） | 資料 | 版 | ライセンス | 取得元 | 区切り |
|---|---|---|---|---|---|
| ap-calculus-ab-bc-ced | College Board, *AP Calculus AB and BC Course and Exam Description* | Effective Fall 2020 | College Board の著作物（公開 PDF） | https://apcentral.collegeboard.org/media/pdf/ap-calculus-ab-and-bc-course-and-exam-description.pdf | TOPIC n.m ／ unitN ／ front ／ exam |
| ap-statistics-ced | College Board, *AP Statistics Course and Exam Description* | Effective Fall 2026（5 単元） | College Board の著作物（公開 PDF） | https://apcentral.collegeboard.org/media/pdf/ap-statistics-course-and-exam-description.pdf | 同上 |
| nicholson-lawa-2021a | W. Keith Nicholson, *Linear Algebra with Applications*（Lyryx with Open Texts） | 2021A | CC BY-NC-SA 4.0 | eCampusOntario Open Library の配布 PDF: https://openlibrary-repo.ecampusontario.ca/jspui/bitstream/123456789/897/2/Nicholson-OpenLAWA-2021A.pdf | 節 n.m（本文の見出し） |
| im-6-8 | Illustrative Mathematics, *IM 6–8 Math*（Grade 6・7・8。生徒向けのレッスンと練習問題のページ、各学年の glossary） | Kendall Hunt 配布版（2026-09-25 取得。© 2017–2019 Open Up Resources、改訂 © 2019 Illustrative Mathematics） | **CC BY 4.0**（ページ下の表示。Illustrative Mathematics の名前とロゴは対象外） | https://im.kendallhunt.com/MS/students/1/index.html ほか（/MS/students/{1,2,3}/…、glossary.html） | レッスン「Grade 7 3.2 Title」（単元.レッスン） |
| im-9-12 | Illustrative Mathematics, *IM 9–12 Math*（Algebra 1・Geometry・Algebra 2。同上） | Kendall Hunt 配布版（2026-09-25 取得。© 2019 Illustrative Mathematics） | **CC BY 4.0**（同上。名前とロゴは対象外） | https://im.kendallhunt.com/HS/students/1/index.html ほか（/HS/students/{1,2,3}/…。Algebra 1 Supports の 4 は取らない） | レッスン「Geometry 1.3 Title」 |
| ck12-geometry | CK-12 Foundation, *CK-12 Geometry*（K12 LibreTexts の Bookshelves/Mathematics/Geometry。9 章 173 節） | K12 LibreTexts 版（2026-09-25 取得） | **CK-12 Curriculum Materials License**（各ページの表示と タグ license:ck12。CC ではない。教育目的に限った利用・改変・配布を認める CK-12 独自のライセンス: https://www.ck12info.org/curriculum-materials-license/ ） | https://k12.libretexts.org/Bookshelves/Mathematics/Geometry | 節「CK-12 Geometry 4.16 HL」（章.節） |
| ck12-algebra | CK-12 Foundation, *CK-12 Algebra*（K12 LibreTexts の Bookshelves/Mathematics/Algebra） | 同上 | 同上 | https://k12.libretexts.org/Bookshelves/Mathematics/Algebra | 節「CK-12 Algebra 2.1.1 Writing Basic Equations」 |
| levin-dmoi4 | Oscar Levin, *Discrete Mathematics: An Open Introduction* | 4th edition | **CC BY-NC-SA 4.0**（4 版のページ https://discrete.openmathbooks.org/dmoi4.html の License 欄。3 版までの CC BY-SA に Non-Commercial が加わった） | https://discrete.openmathbooks.org/pdfs/dmoi4.pdf | 節 n.m（本文の見出し） |

### 用例コーパス（書き言葉）に足した OpenStax 3 冊（2026-09-25）

参照ではなく用例コーパス（PLAN 15 の書き言葉。OpenStax 6 冊と同じ扱い）。`pnpm corpus:fetch:openstax` がほかの 6 冊と一緒に取る。
中学・Algebra の単元の register の根拠を足すため。

| source id | 本 | 取得元（コミット固定） | ライセンス |
|---|---|---|---|
| openstax-prealgebra | OpenStax *Prealgebra 2e*（74 モジュール） | github.com/openstax/osbooks-prealgebra-bundle @ 38cae454 | **CC BY-NC-SA 4.0**（collection の md:license） |
| openstax-elemalg | OpenStax *Elementary Algebra 2e*（81 モジュール） | 同上 | 同上 |
| openstax-intalg | OpenStax *Intermediate Algebra 2e*（82 モジュール） | 同上 | 同上 |

3 冊はマニフェストの最後に置き、前からの 6 冊の文を減らさない（count の重複除去は先に出た方を残す）。Elementary と Intermediate は章を共有するので、
重複除去の後の語数は Prealgebra 253,498・Elementary 316,432・Intermediate 209,982（Intermediate は 82 中 23 ファイルが写しとして落ちる）。

### 用例コーパス（話し言葉）に足した MICASE（2026-09-26）

参照ではなく用例コーパス（PLAN 15 の話し言葉）。**phrases の数え方にだけ使い、terms と symbols の判定には入れない**（manifest の `collections: ["phrases"]`。
count.ts・decide.ts・probe.ts が terms・symbols の件数と重みから外す。lib.ts `forCollection`・`wordsFor`）。講義の書き起こしにほとんどない学生の側の言い方
（質問・オフィスアワー・勉強会）を数えるため。

| source id | コーパス | 収録 | 取得元 | ライセンス・利用条件 |
|---|---|---|---|---|
| micase | *The Michigan Corpus of Academic Spoken English*（TalkBank CABank の CHAT 版。152 の発話イベント、話者 1,571 人、1,695,540 語（MICASE Manual 表 4）。講義・discussion section・office hours・study group・lab・seminar・advising ほか 15 種） | 1997〜2001 年、University of Michigan | https://ca.talkbank.org/access/MICASE.html（DOI 10.21415/QT9V-2J96。書き起こしの zip は TalkBank にサインインした人だけが取れる。2026-09-26 に確かめた） | 研究・教育目的は無料、商用は許可が必要。TalkBank の決まりにより、使うときは下の文献を挙げる。使うのは件数だけで、本文は写さない（STYLE 原則 5 と同じ扱い） |

引用（TalkBank の MICASE のページの指定）: R. C. Simpson, S. L. Briggs, J. Ovens, and J. M. Swales. (1999). *The Michigan Corpus of Academic Spoken English*. Ann Arbor, MI: The Regents of the University of Michigan.

- 取り方: talkbank.org にサインインし、上のページの Download transcripts で zip を落として `pnpm corpus:fetch:micase -- <zip>` を回す（人間が手で実行する。
  YouTube の字幕と同じ扱い）。スクリプトは zip を `corpus/micase/raw/` に 1 回だけ展開し、書き起こしごとに学生・教員・その他の発話を
  `corpus/micase/<ID>.<student|instructor|other>.txt` に分け、manifest に source `micase`・場面（scene）・話者（speaker）を付けて足す（変換済みは取り直さない）
- 場面はファイル名の発話イベントの記号（MICASE Manual 2.3。OFC office hours、SGR study group、DIS discussion section、LES／LEL small／large lecture ほか）、
  話者は CHAT の @Participants と @ID の役割（Manual 2.4 の学年・職の記号。JU・SU・MU・JG・SG・MG は学生、JF・SF・MF は教員、ほかは other）。
  場面と話者ごとの語数は `corpus/micase/stats.json`
- ソースの重み（1 ソース 25% まで）は MICASE を 1 ソースとして phrases にだけ当てる。MICASE のマニュアル（https://ca.talkbank.org/access/0docs/MICASE.pdf）は公開されている

### 注意

- **AP Statistics の CED は 2026 年版で 5 単元**（1 探索的データ分析とデータの集め方、2 確率・確率変数・確率分布、3 カテゴリデータの推測、4 量的データの推測、5 回帰）。
  台帳と data/curriculum の単元も 2026 年版の 5 単元（`us-ap-statistics-1-exploring-and-collecting-data`〜`5-regression-analysis`）。旧版の 9 単元からの付け替え表は `scripts/ledger/fix_decisions.py` の `AP_STATS_2026_*`（fix_phase1.py 手順 13）。2026 年版に無い内容（傾きの推測・適合度検定・幾何分布・確率変数の和など 16 語）は level.us を Intro Statistics にした。
- Nicholson の出版元 lyryx.com は 2026-09-25 に名前解決できなかったので、eCampusOntario の公開リポジトリ（CC BY-NC-SA 4.0 と明記）の 2021A を使った。
- Nicholson と Levin は CC BY-NC-SA、CED は College Board の著作物。どれも辞典のデータ（CC0）に文を入れない。
- IM は `refetch.py im` がコース → 単元 → レッスンの順にたどり、各レッスンの生徒向けページ（index.html）と練習問題（practice.html）の `<main>` だけを
  `corpus/ref/im/pages/` にページ単位でキャッシュし、`corpus/ref/im-6-8.txt` ／ `im-9-12.txt`（レッスンごとの区切り）と `im-glossary.json`（コース → glossary の見出し）にまとめる。
  GeoGebra の埋め込みデータは捨てる。CC BY 4.0 だが、辞典のデータ（CC0）には文を入れず、件数とレッスンの名前・glossary の見出しだけを使う（STYLE 原則 5 と同じ扱い）。
- CK-12 は `refetch.py ck12`（`refs` に含む）が本棚 → 章 → 章のページが並べる下のページをたどり、下にページのない節だけを `corpus/ref/ck12/pages/` にページ単位でキャッシュ（リンクと本文の JSON）し、
  `corpus/ref/ck12-geometry.txt` ／ `ck12-algebra.txt`（IM と同じ区切り）にまとめる。4 並列、タイムアウト・リトライ・done/total は IM と同じ。
  **CK-12 Algebra は K12 LibreTexts 版が不完全**: 1 章・2 章の 73 節と 3 章・7 章の 1 節ずつ（計 75 節）しか本文が無く、章のページに並ぶ残りの 37 ページはホームへ転送される（2026-09-25）。
  K12 LibreTexts の Mathematics の棚に CK-12 の中学の本は無い（Algebra・Analysis・Calculus・Geometry・Precalculus・Statistics・Trigonometry）。
  CK-12 の本文は写さない。使うのは件数と節の名前だけ（STYLE 原則 5 と同じ扱い）。
- 英語版 Wikipedia は記事名（タイトル）だけを使う。`scripts/ledger/wiki_head.json`（コミットする。タイトルと段数だけ）。
- 本から数える範囲は本文だけ。前付け（目次・序文）と後付け（略解・索引）は数えない（lib.ts `bookSections`）。
- 出典に挙げるときは `type: reference`、`title` に書名と版、`url`、`note` に topic 番号か節の番号と見出し。
