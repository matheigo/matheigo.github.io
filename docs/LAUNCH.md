# 公開の告知文（v1.0）

作成: 2026-11-18 ／ PLAN Phase 5 の 4、ROADMAP「v1.0 公開」の 3

**状態: 下書き。** 投稿するのはユーザーが確認してから（CLAUDE.md 絶対ルール 6 の「公開」）。この文書をコミット・push しても告知にはならない。

- URL は ROADMAP の決定 4 どおり **https://matheigo.org/** で書いた（2026-11-18 の whois では未登録）。取れなかったら、下の文の `https://matheigo.org/` をすべて `https://matheigo.github.io/` に置き換える（パスは同じ）。
- 数字は 2026-11-18 の verified の件数（用語 1,050・記号 220・フレーズ 275・慣習差 72、単元 163）。投稿の直前に /download/ の件数か `pnpm build` の出力で確かめ、変わっていたら直す。likely の 488 語を足した 1,539 は使わない。
- 例に使った項目はすべて verified（増減表 `sign-chart`、微分係数 `derivative-at-a-point`、移項する `move-term-to-other-side`、記号 `derivative-prime`・`integral-definite`、フレーズ `office-hours-hint-not-the-answer`・`office-hours-stuck-at-step`、慣習差 `inequality-symbols`・`slope-intercept-form`・`therefore-because-symbols`・`trapezoid-definition`）。

## 0. 投稿の前に

| # | やること | 誰が | 状態 |
|---|---|---|---|
| 1 | matheigo.org を取り、GitHub Pages のカスタムドメインにする（`astro.config.mjs` の site、`public/CNAME`、HTTPS の強制） | 取得と DNS はユーザー、設定は Claude | 未 |
| 2 | GoatCounter（0 件検索をイベントで数える）と Google Search Console。フッターに「クッキーを使わない匿名の集計（GoatCounter）」の 1 行 | 登録はユーザー、組み込みは Claude | 未 |
| 3 | 「AI（Claude）で下書きした」ことを、サイトの「このサイトについて」にも書く（告知文には書いた。DECISIONS 2026-11-18） | 書くかどうかはユーザーが決める | 未 |
| 4 | README の「状態」を今に合わせる | Claude | 済（2026-11-18） |
| 5 | この文書のリンクがすべて開けること、Anki・PDF が落とせることを確かめる | Claude | 投稿の直前 |
| 6 | 友人・同じ境遇の学生 5 人に使ってもらい、詰まった所を聞く（PLAN §10。下の 2.3） | ユーザー | 公開の日 |

## 1. どの版にも通す核

- 日本語: 日本で数学を習った人が、米国の授業で「言える・書ける・聞き取れる」ようになるための、無料の日英数学辞典。
- English: A free, open (CC0) Japanese–English math dictionary for students who learned math in Japanese and now take it in English.
- どの版でも外さない 3 点:
  1. 対訳だけで終わらない。式の読み上げ、授業やオフィスアワーで使う言い回し、日米で違う書き方まで入れた。
  2. 1 対 1 で対応しない語は「近いが同じではない」「対応する語がない」とはっきり書く（verified 1,050 語のうち 258 語）。
  3. 英語の言い方は、米国の講義の書き起こしと教科書で実際に数えて決めた。データは CC0 で、JSON・CSV・Anki・PDF で配っている。
- 範囲を言うときは verified が厚いところに限る。米国側は Pre-Algebra から Calculus I（AP Calculus AB）までが中心。Calculus II と統計は一部だけ（verified はどちらも 80 語足らず）、Linear Algebra（14 語）と Calculus III（13 語）はまだ少ない。

## 2. 日本語

### 2.1 長い版（大学の日本人学生会、留学系メディアへの掲載依頼、Zenn か note の制作記の冒頭）

> **MathEigo — 数学は同じ。言葉が違う。**
>
> 日本で数学を習ったあとに米国の高校・コミュニティカレッジ・大学で数学を取ると、中身は分かるのに言葉で止まります。先生の "f prime of x" が f′(x) のことだと気づくのに時間がかかる。オフィスアワーで「この行から次の行への変形が分からない」と言えない。答案に増減表を書いていいのか分からない。
>
> MathEigo は、そういうときのための無料の日英数学辞典です。
>
> - **用語 1,050 語**: 英語の見出し、読み、定義、例文、つまずきやすい点。日本側は中学数学から数III・数C まで。米国側は Pre-Algebra から Calculus I（AP Calculus AB）までが中心で、Calculus II・統計・線形代数はこれから増やします
> - **記号・式の読み上げ 220**: たとえば ∫ₐᵇ f(x) dx は "the integral from a to b of f of x d x"
> - **場面別フレーズ 275**: 授業、オフィスアワー、答案、試験、メール、Discord。たとえば「答えではなく、ヒントだけいただけますか。」は "Could you give me a hint instead of the answer?"
> - **日米の慣習差 72**: ≦ と ≤、y = ax + b と y = mx + b、∴ を書くか Therefore と書くか。米国では台形の定義が教材によって違うこと
> - **カリキュラム対応表**: 日本 46・米国 117 の単元の対応
>
> こだわったのは 2 つです。
>
> 1. **対応するふりをしない。** 1,050 語のうち 258 語は英語と 1 対 1 に対応しません。たとえば増減表に当たる決まった表は米国の教材に出てこないので、「対応する語がない」と書いたうえで、米国では sign chart を道具として使い、答案では first derivative test の名前で理由を書く、と説明しています。微分係数にも一語の名詞はなく、the derivative at a point と言います。
> 2. **先生・TA が実際に言う言い方で決める。** 米国の講義の書き起こし・字幕（MIT OpenCourseWare、Khan Academy ほか）と教科書（OpenStax ほか）で候補の言い方を数え、話し言葉と書き言葉を分けています。たとえば移項は、一語の名詞より "subtract 3 from both sides" のように言うのがいちばん多い、という具合です。
>
> 本文は AI（Claude）で下書きし、出典（学習指導要領と解説、AP の Course and Exam Description、OpenStax、Wikipedia の言語間リンクなど）との照合と、下書きとは別のセッションによる監査を通ったものだけを公開しています。人間が全件を読んだわけではありません。間違いや、「米国の教室では実際にこう言う」という例を見つけたら、各ページの「間違いを報告する」から教えてください。
>
> Anki デッキ（1,545 項目）と、定義を載せない単語対訳表 PDF も置いています。試験に持ち込めるかどうかは学校や州によって違うので、必ず先生に確認してください。データは CC0（パブリックドメイン提供）で、アプリへの組み込みや言語モデルの学習にも自由に使えます。広告・ログイン・有料機能はありません。
>
> https://matheigo.org/

### 2.2 短い版（X・Bluesky など。X の 140 字に収まる）

> 数学は同じ。言葉が違う。日本で数学を習って米国で授業を取る人のための、無料の日英数学辞典を公開しました。用語、式の読み上げ、オフィスアワーの言い回し、≦ と ≤ のような日米の違いまで。Anki と PDF もあります。
> https://matheigo.org/

### 2.3 直接送る版（知り合いの学生・先生へ。PLAN §10 の 5 人もこれで）

> 〇〇さん
>
> 日本で数学を習ってから米国で数学を取る人向けに、日英の数学辞典を作りました。
> https://matheigo.org/
>
> 今の授業で出てくる語を 2〜3 個引いてみてもらえませんか。見つからなかった語、分かりにくかった所、「授業ではこう言っている」という違いがあれば、一言でいいので教えてもらえると助かります。

## 3. English

### 3.1 Long version (Reddit, forums, ESL teacher lists)

Title: **MathEigo: a free Japanese–English math dictionary (terms, how to read expressions aloud, classroom phrases)**

> I made a free Japanese–English math dictionary for students who learned math in Japanese and now take it in English, in US high schools, community colleges and universities.
>
> The math is the same; the words aren't. The hard part is usually not the content but the language around it: realizing that "f prime of x" means f′(x), asking at office hours how the teacher got from one line to the next, or knowing whether the Japanese increase/decrease table is acceptable on an exam.
>
> What's in it (audited entries only):
>
> - 1,050 terms with readings, definitions, example sentences and common pitfalls, mostly from pre-algebra through Calculus I (Calculus II, statistics, linear algebra and Calculus III are thinner and growing)
> - 220 symbols and expressions with how to read them aloud ("the integral from a to b of f of x d x")
> - 275 phrases for class, office hours, written solutions, exams, email and Discord ("Could you give me a hint instead of the answer?")
> - 72 notation and convention differences: ≦ vs. ≤, y = ax + b vs. y = mx + b, ∴ vs. "Therefore," and the two definitions of a trapezoid found in US materials
> - a map between Japanese and US course units
>
> Two things I cared about:
>
> 1. It doesn't pretend everything has a one-to-one translation. 258 of the 1,050 terms are marked "near" or "no equivalent," with a note on how US classes handle the idea. For example, the Japanese increase/decrease table has no standard US counterpart, so the entry says so and explains the US approach: a sign chart as a tool, with the justification written out using the first derivative test.
> 2. The English is what teachers and TAs actually say. Candidate phrasings were counted in US lecture transcripts and captions (MIT OpenCourseWare, Khan Academy and others) and in textbooks (OpenStax and others), and spoken and written usage are kept apart.
>
> The entries were drafted with AI (Claude), then checked against sources (Japanese curriculum guidelines, the AP Course and Exam Descriptions, OpenStax, Wikipedia interlanguage links) and audited in separate sessions. Only entries that passed are shown. I haven't read every entry myself, so corrections, especially "in my class we actually say…," are very welcome through the "report an error" link on each page.
>
> There's an Anki deck, a word-to-word PDF without definitions (check with your teacher before bringing it to an exam; policies vary), and the full dataset as JSON and CSV under CC0. No ads, no login. The interface is in Japanese for now.
>
> https://matheigo.org/

### 3.2 Show HN (as a dataset)

Title: **Show HN: MathEigo, an open Japanese–English math dictionary (CC0)**

> MathEigo is a free Japanese–English dictionary of school and first-year college math, for students who learned math in Japanese and now study it in English. It has 1,050 terms, 220 expressions with how to read them aloud, 275 classroom and office-hours phrases, 72 Japan–US notation differences and a map between the two curricula.
>
> Some details that may be interesting here:
>
> - The data is one JSON file per entry with a JSON Schema, released under CC0, downloadable as JSON and CSV (plus an Anki deck and a PDF). Every term says whether the pair is exact, near or has no equivalent; 258 of the 1,050 are not one-to-one.
> - Spoken vs. written wording is decided from counts, not intuition. Candidate phrasings are counted in lecture transcripts and captions (MIT OpenCourseWare, Khan Academy and others) and in textbooks (OpenStax and others), with duplicate files and sentences removed. A phrasing becomes the headword only when it clearly dominates (3:1); close calls list both, and counts too small to decide fall back to references such as the AP Course and Exam Descriptions.
> - Entries were drafted by Claude and audited in separate sessions against sources (Wikipedia interlanguage links through the MediaWiki API, Japanese curriculum guidelines, AP Course and Exam Descriptions, OpenStax). Unaudited entries are hidden and not indexed. The audit reports are in the repo.
> - The site is a static Astro build with client-side search that accepts kana, romaji or English.
>
> Site: https://matheigo.org/
> Repo: https://github.com/matheigo/matheigo.github.io
>
> The interface is in Japanese. Feedback from anyone who teaches or learns math across the two languages is welcome.

### 3.3 Short version (X, Bluesky, Mastodon; under 280 characters)

> MathEigo: a free Japanese–English math dictionary for students who learned math in Japanese and now take it in English. Terms, how to read expressions aloud, office-hours phrases and Japan–US notation differences (≦ vs. ≤). Anki deck and CC0 data.
> https://matheigo.org/

### 3.4 To a teacher (email)

> Subject: A free Japanese–English math glossary for Japanese-speaking students
>
> Hi [name],
>
> I've put together a free Japanese–English math dictionary for students who learned math in Japan and now take it in English. Besides term pairs, it notes where the two systems differ (for example, why a student from Japan may write ≦ or ∴, or reach for a table of increase and decrease where you'd expect a first derivative test), how to read expressions aloud, and phrases for asking questions in class and at office hours.
>
> If you have Japanese-speaking students, it may help them. I'd also be grateful for any corrections from the classroom side.
>
> https://matheigo.org/
>
> Thank you,
> [name]

## 4. 送り先と順番（ROADMAP「v1.0 公開」の 5、PLAN Phase 6）

広く一斉に投稿しない。直接連絡できる相手から始め、1 日に 1〜2 か所、反応を見てから次へ。

| 順 | 相手 | 使う版 |
|---|---|---|
| 1 | 直接連絡できる人（SRJC の日本人学生と先生、母校）。PLAN §10 の 5 人もここから | 2.3 ／ 3.4 |
| 2 | 大学の日本人学生会、留学系メディア | 2.1 |
| 3 | 日本語で数学を教える教員（補習校、塾、大学） | 2.1 |
| 4 | Zenn か note の制作記 | 2.1 を冒頭に。本文（コーパスで数えた話、監査の流れ）は別に書く |
| 5 | 英語側: Reddit（r/Anki、r/LearnJapanese などの候補）、ESL 教員向け | 3.1 ／ 3.3 |
| 6 | Hacker News（データセットとして） | 3.2 |

Reddit などは、投稿の前にそのコミュニティの自己宣伝と AI 生成物の規則を読む。禁じていれば投稿しない。

## 5. 書かないこと

- 試験に持ち込めると書かない。「学校や州によって違うので先生に確認」と書く（PLAN §2.1・§13）
- 「公式の」「人間が全件を確認した」と書かない。AI で下書きし、出典との照合と別セッションの監査を通ったもの、と書く
- 件数は verified だけを書く（上の注意）。米国側の範囲は 1 の最後の行のとおりに書く
- ほかのサイトや辞書と比べてけなさない。資料の文を写さない（CLAUDE.md 絶対ルール 3。告知文も同じ）

## 6. 公開の日と、その後

- 公開の日: matheigo.org で各ページが開くこと、GoatCounter に数が入ることを確かめる。Search Console にサイトマップ（/sitemap.xml）を出す
- 反応の受け口は GitHub の issue（誤りの報告、語の追加の提案）。週 1 でまとめて処理する（PLAN Phase 6）
- 公開から 3 か月後（2027-02-15）に判定 1（ROADMAP の表）
