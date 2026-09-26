# SOURCES — 参照（③ の見出しの決め方に使う資料）

用例コーパス（PLAN 15。`corpus/manifest.json`）とは別に、コーパスで決まらない語（話・書とも ③）の見出しを決めるときに読む資料。
**本文は写さない。使うのは件数と節の番号・見出しだけ**（STYLE 原則 5）。PDF とテキストは `corpus/ref/`（gitignore）に置き、リポジトリには入れない。

取得は 1 回でまとめて: `python3 scripts/ledger/refetch.py refs`（PDF 4 つと IM と CK-12。タイムアウト 30 秒・リトライ 3 回、進捗 done/total、
取得済みのテキスト・ページがあるものは取り直さない）。英語版 Wikipedia の記事名は `python3 scripts/ledger/wikihead.py`
（同じくタイムアウト・リトライ上限・done/total、キャッシュ `scripts/ledger/wiki_head_cache.json`）。
count.ts と probe.ts は `scripts/corpus/references.ts` で読む。

## 規則 2 の参照の順

話・書とも ③ で「用例コーパスと参照には決まった言い方が出てこない」（corpus-no-fixed-expression）に当たらない語は、次の順に最初に呼び方が見つかった資料の呼び方を見出しにする
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

**記号（symbols）**も話し言葉で ③ なら同じ段の順で読みを決める（lib.ts `settleSymbolReading`。DECISIONS「Phase 3 記号と慣習差の前の修正」2）。
ただし段が読みを決めるのは、その段の参照の 1 つが読みの形（SYMBOL_PATTERNS）を 3 件以上使うとき（CED は 1 件から）。4 の Wikipedia は使わない（記事名は読みではない）。
参照の本文の数学用英数字（Levin の 𝑃・𝐴）は普通の文字に畳んで数える（lib.ts `cedText`）。添字の読み方だけが違う候補（{aₙ}）は参照で比べられないので決めない（`SYMBOL_NOT_READ_IN_REFERENCES`）。

3 か 4 で決まった語（CED・OpenStax・IM・CK-12 のどの候補も 0 件）は、mapping_note に「米国の高校課程（CED・OpenStax・IM・CK-12）では扱わない」と件数を書く
（decide が「直すこと」に出す）。
「決まった言い方が出てこない」の例外（英語の名前があると分かっているもの）に数えるのは、1 の CED の呼び方、
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

### 用例コーパス（話し言葉）に足した MICASE（2026-09-25）

参照ではなく用例コーパス（PLAN 15 の話し言葉）。**phrases の数え方にだけ使い、terms と symbols の判定には入れない**（manifest の `collections: ["phrases"]`。
count.ts・decide.ts・probe.ts が terms・symbols の件数と重みから外す。lib.ts `forCollection`・`wordsFor`）。講義の書き起こしにほとんどない学生の側の言い方
（質問・オフィスアワー・勉強会）を数えるため。

| source id | コーパス | 収録 | 取得元 | ライセンス・利用条件 |
|---|---|---|---|---|
| micase | *The Michigan Corpus of Academic Spoken English*（TalkBank CABank の CHAT 版。152 の発話イベント、話者 1,571 人、1,695,540 語（MICASE Manual 表 4）。講義・discussion section・office hours・study group・lab・seminar・advising ほか 15 種） | 1997〜2001 年、University of Michigan | https://ca.talkbank.org/access/MICASE.html（DOI 10.21415/QT9V-2J96。書き起こしの zip は TalkBank にサインインした人だけが取れる。2026-09-25 に確かめた） | 研究・教育目的は無料、商用は許可が必要。TalkBank の決まりにより、使うときは下の文献を挙げる。使うのは件数だけで、本文は写さない（STYLE 原則 5 と同じ扱い） |

引用（TalkBank の MICASE のページの指定）: R. C. Simpson, S. L. Briggs, J. Ovens, and J. M. Swales. (1999). *The Michigan Corpus of Academic Spoken English*. Ann Arbor, MI: The Regents of the University of Michigan.

- 取り方: talkbank.org にサインインし、上のページの Download transcripts で zip を落として `pnpm corpus:fetch:micase -- <zip>` を回す（Safari が展開したフォルダでもよい: `-- ~/Downloads/MICASE`。人間が手で実行する。
  YouTube の字幕と同じ扱い）。スクリプトは zip を `corpus/micase/raw/` に 1 回だけ展開し、書き起こしごとに学生・教員・その他の発話を
  `corpus/micase/<ID>.<student|instructor|other>.txt` に分け、manifest に source `micase`・場面（scene）・話者（speaker）を付けて足す（変換済みは取り直さない）
- 場面はファイル名の発話イベントの記号（MICASE Manual 2.3。OFC office hours、SGR study group、DIS discussion section、LES／LEL small／large lecture ほか）、
  話者は @ID の役割の欄（語: Student・Teacher・Speaker・Audience ほか）を先に見て、Teacher は教員・Student は学生、それ以外の語は教育の欄の
  Manual 2.4 の学年・職の記号で振る（JU・SU・MU・JG・SG・MG は学生、JF・SF・MF は教員、ほかは other。2026-09-25 に実データで確かめた）。
  場面と話者ごとの語数は `corpus/micase/stats.json`。CABank 版のフォルダ分けは Manual の表 4-4 と少し違う（office hours 14、advising 2、tutorial の区分なし）
- 取り込んだもの（2026-09-25）: 152 書き起こし・1,796,311 語（CHAT の記号を除いた語数。Manual の 1,695,540 語とは数え方が違う）
- ソースの重み（1 ソース 25% まで）は MICASE を 1 ソースとして phrases にだけ当てる。MICASE のマニュアル（https://ca.talkbank.org/access/0docs/MICASE.pdf）は公開されている

### 学生の言い方の件数に足した Math Stack Exchange（2026-09-26）

参照でも用例コーパスでもなく、**phrases の学生の場面（class-asking・office-hours・group-study・exam の学生の質問）と email・discord の件数だけ**に使う
（terms・symbols には使わない。DECISIONS「Phase 3 フレーズ 3 の前の修正」1）。MICASE の学生の発話で首位の要の部分が 3 件未満のときに、質問の件数で「学生が実際にそう書く」ことを確かめる。①②（件数の競い合い）には使わない。

| id | 資料 | ライセンス | 取得元 | 使うもの |
|---|---|---|---|---|
| math-stack-exchange | Mathematics Stack Exchange（https://math.stackexchange.com/） | 投稿は **CC BY-SA 4.0**（Stack Exchange の利用規約）。**使うのは件数だけ**で、本文は取らない・写さない | Stack Exchange API 2.3 の /search/advanced（`site=math`、`q` は要の部分を引用符で囲んだ完全一致、`filter=!9n30I5cCu9fW` は total と quota だけを返す）。API キーは使わない（1 IP 1 日 300 リクエスト） | 検索の件数（質問の数）と取得日 |

- 取り方: `pnpm corpus:count` の後に `pnpm corpus:fetch:mse`（`-- --dry` で検索する語の一覧だけ）。要るフレーズ（mse.ts `needsMse`）の要の部分を選択肢ごとに 1 回ずつ検索する。
  タイムアウト 20 秒・リトライ 3 回、進捗は done/total。件数は `scripts/corpus/mse-counts.json`（件数と日付だけなのでコミットする）にキャッシュし、再実行は足りない検索だけを送る。
  1 日の上限に届いたら止まるので、翌日に同じコマンドを回すとキャッシュから続ける
- 完全一致で語形変化はまとめない。「A | B」は選択肢ごとの件数を足す（1 つの質問に 2 つあれば 2 回数える）。「!w」は外して数え、「…」の空きの選択肢は数えない。
  数学の質問のサイトでは語がほとんど別の意味になる選択肢（scroll up、more slowly、have a second ほか）は検索しない（mse.ts `MSE_SKIP`）
- 本文を取らないので、件数に別の意味が混じっていても文脈で確かめられない。レポートの怪しい点に書く

### 慣習差の日本側の資料（2026-09-25・2026-09-26）

慣習差（conventions）の日本側を確かめる資料。**書き方・言い方があるかどうかと、その箇所を確かめるだけ**で、本文は写さない（辞典のデータは CC0）。
取得したものは `corpus/ref/jp/`（gitignore）に置き、出典には資料の名前・年度・科目・大問（箇所）を書く。

| id（corpus/ref/jp/） | 資料 | 取得元 | 取り方 |
|---|---|---|---|
| kaisetsu-chu ／ kaisetsu-kou | 中学校学習指導要領（平成29年告示）解説 数学編、高等学校学習指導要領（平成30年告示）解説 数学編 理数編（文部科学省） | mext.go.jp の公開 PDF | `python3 scripts/ledger/fetch_jp_refs.py`（pdftotext） |
| wiki/ | 日本語版 Wikipedia の記事（テキスト抽出） | MediaWiki API | 同上（`wiki`・`search`） |
| exams/ | 大学入試センター **大学入学共通テスト**（令和3〜8年度）と **大学入試センター試験**（平成26〜令和2年度）の本試験 数学の問題と正解（公開 PDF） | 令和6〜8年度は大学入試センターの「過去３年分の試験問題」（https://www.dnc.ac.jp/kyotsu/kakomondai/ ）。それより前はセンターのページから外されたので、Internet Archive（web.archive.org）に残るセンターのページと PDF（センターが公開したもの）を読む | `python3 scripts/ledger/fetch_jp_exams.py`（索引のページから「数学」の PDF を選び、pdftotext -layout。`_index.json` に年度・科目・取得元・archive の日付） |

- 取得はすべて 1 回のコマンドでまとめて行い、各リクエストにタイムアウトとリトライ上限（fetch_jp_refs.py は 30 秒・3 回、fetch_jp_exams.py は 60 秒・4 回。429 ／ 5xx は待って再試行）、進捗は done/total、取得済みは取り直さない（再実行は足りない分だけ）
- 共通テスト・センター試験の問題はマーク式で、答案の書き方（「証明終わり」、途中式、積分定数の書き添え）は問題文と正解の表からは分からない。確かめられるのは問題文の記号・言い方（成分の丸かっこ、否定の上線、「条件」、分散の定義、Σ の添字）まで
- **NHK 高校講座（数学Ⅰ・数学A・数学Ⅱ・数学B ほか）は資料に使わない**（2026-09-26 ユーザーの判断）。https://www.nhk.or.jp/kokokoza/ は https://edu.web.nhk/kokokoza/ に移り、各回の「文字と画像で見る」ページの本文は NHK ONE の「ご利用にあたって」に同意した後にだけ読み込まれ、その同意に受信契約の確認・地域の選択が含まれる。人間が同意して使うこともしない。外した慣習差 41 行（ledger/conventions-excluded.csv）は、NHK 高校講座を手がかりにして戻さない

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
