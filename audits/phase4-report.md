# Phase 4 のまとめ — サイト

作成: 2026-09-26 ／ 対象: 8c843bd（Phase 3 のまとめ）→ 本コミット
指示: audits/phase3-final-report.md・phase3-conventions-2-report.md を受けた 1〜5。判断は `docs/DECISIONS.md` の「Phase 4 の前の修正」「Phase 4 サイト」。

**これはサイトを作ったのと同じ作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified の項目は 0。

## まとめ

- **1〜3**: conditional-probability-subscript-jp に学習指導要領解説（数学A、p.94 の P_A(B)）を出典に足して likely にした。NHK 高校講座は資料に使わない（SOURCES.md）。Phase 5 の論点に「terms の日本側の主張も資料で確かめる」を足した
- **4**: PLAN §9 Phase 4 を実装した。用語 1,528・記号 219・慣習差 80 は 1 項目 1 ページ、フレーズ 275 は場面ごとの 9 ページ、カリキュラム 163 単元は 1 単元 1 ページ。全 2,006 ページが静的
- **完了条件**: Lighthouse（モバイル）の Performance は代表 9 ページすべてで **100**（未確認を表示したビルドでも記号の一覧の 98 以外は 100）。初回の検索までの時間は Lighthouse のモバイルと同じ低速設定で **824 ms**（ページを開いてすぐ打ったとき。落ち着いたページで打つと 21 ms）。DevTools の「Slow 4G」（遅延 562.5 ms）では **1,713 ms** で 1 秒に入らない（D-3）
- **5**: ページの種類ごとに 9 コミット（修正、用語、記号、フレーズ、慣習差、カリキュラム、検索、ダウンロード、SEO）＋ 計測とこのレポート。各コミットの前に tsc・validate・test・build を終了コードで確かめた（1 回だけ、終了コードが 2 のまま検索のコミットが先に入り、直してから amend した。F）

## A. 1〜3 の結果

| 指示 | 結果 |
|---|---|
| 1. conditional-probability-subscript-jp | 高等学校学習指導要領解説 数学編 理数編（数学A 場合の数と確率、p.94 の図と式 P(A∩B) = P(A)P_A(B) = P(B)P_B(A)）を解説の本文で確かめ、出典に足して **likely**。記号の draft は ceiling-brackets の 1 件だけ（export symbols.json 219 件）。ceiling-brackets（記号）・quadratic-regression（用語）は draft のまま。written-solution-given-prove の en は具体例の文のまま |
| 2. NHK 高校講座 | docs/SOURCES.md の行を「資料に使わない（2026-09-26 ユーザーの判断）。人間が同意して使うこともしない。外した慣習差 41 行は NHK を手がかりに戻さない」に書き直した。ledger/conventions-excluded.csv の 41 行はそのまま |
| 3. Phase 5 の論点 | PLAN §9 Phase 5 の 1 と audits/phase3-final-report.md F-6 に足した。直すのは別セッションなので、ここでは本文を書き換えていない。目安: 「日本(の教科書\|では\|の高校\|の授業\|の答案\|の中学\|の入試\|の数学\|で)」に当たる文は **286 語・300 文**（正規表現で数えただけで、主張でない文も混じる） |

## B. 作ったページと機能

### B-1. ページ

| ページ | URL | 数 | 中身 |
|---|---|---|---|
| トップ | / | 1 | 検索、今日の10語、各一覧への入口 |
| 用語 | /terms/{id}/ | 1,528 | 日英・読み・ローマ字・品詞・register、「こう言う」＋🔊、式（KaTeX）、場面で変わる言い方（variants）、意味（日英）、日英の対応（near/none の mapping_note）、例文＋🔊、コロケーション、落とし穴、日米の慣習差（逆引き）、記号・式の読み上げ（逆引き）、関連語、出てくる単元（逆引き）、**用例コーパスの件数の表**、出典（リンク付き）、範囲・分野・確認の段階・更新日、間違いを報告 |
| 記号 | /symbols/ ・ /symbols/{id}/ | 1 ＋ 219 | 一覧は単元別（四則〜幾何の 21 区分）。各ページ: 式、読み（標準・話し言葉）＋🔊、日本語の読み、注意（notes）、用語へのリンク、**related の慣習差・記号**、件数の表、出典、報告 |
| フレーズ | /phrases/ ・ /phrases/{situation}/ | 1 ＋ 9 | 意図、英語＋🔊、日本語、register、variants、**notes**、「件数と出典」の折りたたみ（件数の表は要の部分）、報告 |
| 慣習差 | /conventions/ ・ /conventions/{id}/ | 1 ＋ 80 | 一覧は分類別。各ページ: 「米国では」の一文、日本と米国を並べて、**related の記号**、関係する用語、出典、報告 |
| カリキュラム | /curriculum/ ・ /curriculum/{id}/ | 1 ＋ 163 | 日本（中1〜数学C）と米国（Traditional・Integrated・AP・大学初年次）を左右（スマホは上下）。単元のページに相手側の対応と、その単元の用語の一覧 |
| ダウンロード | /download/ | 1 | JSON・CSV の件数とリンク、Anki・PDF・Quizlet は「監査の後に公開します」、CC0 と MIT、データの更新日・生成日 |
| このサイト | /about/ | 1 | 目的、英語の言い方の決め方（用例コーパス）、説明の訳、未確認の項目、読み上げ、出典、免責、報告 |
| 404・sitemap.xml・robots.txt | | | |

### B-2. PLAN Phase 4 の 2 で足された項目

- **evidence の件数の表**（用語・記号・フレーズ）: 行は言い方（話し言葉と書き言葉の和の多い順）、列は話し言葉・書き言葉の件数。その側を数えていないときは「—」。取得元（話し言葉・書き言葉に分けて、MIT OCW 18.01 … の名前）、数えた日。本文には件数を書かない（CLAUDE.md 10）ので、件数はここで見せる
- **「説明の訳（英語の用語ではない）」の印**: mapping none かつ flags に corpus-no-fixed-expression の 14 語（src/lib/gloss.ts の 1 つの規則）。用語ページ（ラベル・注記・「英語で説明するなら」・title）、関連語、単元の一覧、検索結果、JSON（`en_is_explanatory_translation`）・CSV（同じ列）・Quizlet・Anki（裏面のラベル、タグ、聞き取りのカードなし）・PDF（日本語→英語にラベル、English→Japanese に載せない）・OGP 画像。「今日の10語」には出さない
- **記号と慣習差の related**: 両方向にリンク
- **フレーズの notes**: 「注意」として出す

### B-3. 検索

- MiniSearch ＋ wanakana。ひらがな・カタカナ・漢字・ローマ字・英語で引ける（かいのこうしき ／ kainokoushiki ／ 解の公式 ／ quadratic）。ローマ字は IME モードと通常のかなの両方で引く（bibun → びぶん）
- 索引は配列の形にしてブラウザで作れるもの（URL・ローマ字・level・hint）を外した: gzip 133 KB → **80 KB**。トップで preload
- 索引が届いたら部分一致の走査ですぐ答え、MiniSearch は分けて作って（addAllAsync）でき次第切り替える。表示の順は見出しの一致・前方一致（短い見出しが先）→ MiniSearch → 記号の部分一致（≤ など）
- トグルに従う（OFF なら「未確認の N 件を隠しています［表示する］」）。問い合わせは ?q= に残る
- テスト: tests/search.test.ts 17 件（PLAN §13 の 3 つを MiniSearch・ページの検索・走査のそれぞれで、微分・せきぶん・integral の 1 位、≤、説明の訳の印、URL）

### B-4. ダウンロード

- JSON（5 コレクション）・CSV（4 コレクション）は likely を含めて confidence 付き
- **Anki**（scripts/export-anki.py、genanki 0.13.1）と**単語対訳表 PDF**（scripts/export-pdf.ts、puppeteer-core ＋ Chrome）、Quizlet TSV は verified だけ。**今は verified が 0 なので何も書かず、ダウンロードのページは「監査の後に公開します」**。postbuild で回るので、verified が出ればビルドがそのまま作ってサイトに置く
- Anki のモデル ID・デッキ ID を採番した（DECISIONS）。カード: 日本語→英語、音声→日本語（既定）、英語→日本語（既定 OFF）
- **生成の仕組みはテストで確かめた**（tests/export.test.ts 8 件）: 実データの 4 項目を一時ディレクトリで verified にして .apkg を作り、中の SQLite（ノート 4、likely が入らない、モデル ID、カード、サブデッキ名、説明の訳の印と聞き取りのカードなし）を読む。PDF は定義なし・両方向・印と、Chrome で印刷した先頭が %PDF-。verified 0 のときは何も書かない

### B-5. トグル・noindex・SEO・見た目

- 「未確認の語も表示」は既定 OFF（ビルド）。OFF のとき、未確認の詳細ページは本文を隠して「この用語はまだ監査を通っていません」と［未確認の内容を表示する］を出す。一覧は隠した件数を出す
- noindex: 未確認の項目のページと、中身がすべて未確認の一覧。**sitemap.xml は索引してよいページだけ**（トップ・このサイト・ダウンロード・カリキュラム 164、計 167）。ビルドの出力で「sitemap にある ⇔ noindex でない」を全 2,006 ページで確かめ、食い違い 0（noindex 1,839）
- title「解の公式 英語 | quadratic formula — MathEigo」、description は定義文、canonical、JSON-LD（用語・記号に DefinedTerm、トップに WebSite ＋ SearchAction）、OGP 画像（satori ＋ Noto Sans JP。今はサイト共通の 1 枚。verified のページには 1 枚ずつ作る）
- モバイル優先（1 段組み、ナビは横スクロール、タップの的は 36〜44 px）、ダークモード（端末の設定に従う）、フォントは Noto Sans JP ＋ system-ui（Web フォントは読み込まない。DECISIONS）

## C. 完了条件の数値

計測: `pnpm perf`（scripts/perf/measure.ts）。gzip を返す静的サーバーで dist を配り、Lighthouse 13.5.0（Node の API、既定のモバイル設定: 低速 4G の模擬・CPU 4 倍遅く）、Chrome 153、MacBook（Apple Silicon）。結果は perf/*.json（gitignore）。2026-09-26 計測。

### C-1. Lighthouse（モバイル）— 3 回の中央値

公開するビルド（トグル OFF。今は未確認の本文が隠れた状態）:

| ページ | URL | Performance（3 回） | FCP | LCP | TBT | CLS | 転送量 |
|---|---|---|---|---|---|---|---|
| トップ | / | **100**（100/100/100） | 0.77 s | 1.37 s | 0 ms | 0 | 97 KB（索引 80 KB を含む） |
| 用語 | /terms/quadratic-formula/ | **100** | 0.75 s | 0.90 s | 0 ms | 0 | 13 KB |
| 用語（説明の訳） | /terms/rate/ | **100** | 0.75 s | 0.90 s | 0 ms | 0 | 13 KB |
| 記号 | /symbols/integral-definite/ | **100** | 0.75 s | 0.90 s | 0 ms | 0 | 12 KB |
| 記号の一覧 | /symbols/ | **100** | 0.79 s | 0.91 s | 0 ms | 0 | 27 KB |
| フレーズ | /phrases/class-listening/ | **100** | 0.90 s | 1.05 s | 0 ms | 0 | 18 KB |
| 慣習差 | /conventions/conditional-probability-notation/ | **100** | 0.62 s | 0.75 s | 0 ms | 0 | 7 KB |
| カリキュラム | /curriculum/ | **100** | 0.64 s | 0.75 s | 0 ms | 0 | 9 KB |
| カリキュラムの単元 | /curriculum/jp-suugaku-3-sekibun/ | **100** | 0.63 s | 0.75 s | 0 ms | 0 | 7 KB |

未確認を表示したビルド（`MB_SHOW_UNVERIFIED=1`、トグルの既定が ON。本文が見えている状態で測るため）:

| ページ | Performance | FCP | LCP | 転送量 | 公開ビルドとの違い |
|---|---|---|---|---|---|
| トップ | 100 | 0.76 s | 1.36 s | 97 KB | |
| 用語 | 100 | 1.20 s | 1.20 s | 55 KB | KaTeX のフォント（式がある） |
| 用語（説明の訳） | 100 | 0.75 s | 0.90 s | 13 KB | 式がない |
| 記号 | 100 | 1.20 s | 1.20 s | 59 KB | KaTeX のフォント |
| 記号の一覧 | **98** | 1.80 s | 1.80 s | 142 KB | 219 の式の KaTeX のフォント |
| フレーズ・慣習差・カリキュラム 2 | 100 | 0.63〜0.90 s | 0.75〜1.05 s | 7〜18 KB | |

- Accessibility・Best Practices はすべて 100。SEO は noindex のページで 66（「Page is blocked from indexing」。意図どおり）、それ以外 100
- どのページも TBT 0 ms、CLS 0（記号の一覧・用語で 0.00006）

### C-2. 初回の検索までの時間 — 5 回の中央値（最大）、毎回キャッシュなし

puppeteer で CPU 4 倍遅く、画面 412×823（モバイル）、トップを開いて検索欄ができたらすぐ「bibun」と打ち、結果が画面に出るまで（ナビゲーションの開始から）。

| 回線の設定 | 開いてすぐ打つ → 結果 | 索引が使えるまで | MiniSearch ができるまで | 落ち着いたページで打つ → 結果 |
|---|---|---|---|---|
| Lighthouse のモバイルと同じ（RTT 150 ms、下り 1.6 Mbps、上り 750 Kbps） | **824 ms**（828） | 825 ms | 1,034 ms | **21 ms**（22） |
| DevTools の「Slow 4G」（遅延 562.5 ms、下り 1.44 Mbps） | **1,713 ms**（1,718） | 1,714 ms | 1,922 ms | 21 ms（22） |

- **Lighthouse のモバイルの設定では 1 秒以内**。「全ページ静的」も満たす（Astro の static 出力、サーバーの処理なし）
- 検索のない状態で打った文字も、スクリプトが届いた時点で検索する（計測で見つけて直した。遅い回線では、スクリプトより先に打てる）

## D. 測れなかったもの・条件付きのもの

1. **実機**: 手元のスマホでは測っていない。数値はすべて Mac の Chrome で CPU と回線を絞った模擬。Lighthouse の Performance は模擬の低速化（lantern）で出す値
2. **Anki・PDF・Quizlet・項目ごとの OGP 画像の実物**: verified が 0 なので、公開するビルドでは作られない。生成はテスト（B-4）で確かめたが、**Anki のアプリに .apkg を取り込んで見る確認はしていない**（人間の作業）
3. **DevTools の Slow 4G では 1.7 秒**: HTML と索引の 2 往復で遅延だけで 1.1 秒を超え、80 KB を 1.44 Mbps で落とすのに約 0.45 秒かかる。1 秒に入れるには索引をもっと小さくしてページに埋め込む（2 往復目をなくす）必要があり、埋め込むと戻ったときに索引をキャッシュできない。今回はしていない
4. **読み上げ**: 🔊 は Web Speech API。手元の Chrome では英語の声があってボタンが出た。iPhone・Android の実機の声は聞いていない
5. **Lighthouse の SEO 66**: noindex のページの点で、公開前は意図どおり
6. dist は 97 MB（用語ページが KaTeX の CSS を埋め込むため。1 ページの転送は gzip で 13 KB 前後）。GitHub Pages の上限（1 GB）には遠い

## E. スマホで見たときの気になる点（375 px で 14 ページを見た）

1. **公開ビルドは今ほとんど空に見える**: verified が 0 なので、トップの今日の10語も各ページの本文も「未確認」の案内だけ。初めて来た人は［表示する］を押さないと何もない。Phase 5 の監査が進むまでこの見え方
2. **ナビが 1 行に入らない**: 375 px で「このサイト」が画面の外（横にスクロールする）。スクロールできることを示す印がない
3. **フレーズのページが長い**: 授業で聞く は 62 件。ページ内の絞り込みや目次がない（検索からは #id で飛べる）
4. **用例コーパスの表の取得元の一覧が長い**（用語によって 20 を超える名前）。表の下に全部出している
5. 記号の一覧は式を 219 個描くので、未確認を表示すると KaTeX のフォントで 142 KB になる（Performance 98）
6. 横にはみ出すページはなかった（14 ページで scrollWidth ≤ 375）。長い式・表は枠の中で横にスクロールする
7. 🔊 のボタンは端末に英語の声がないと出ない（仕様どおり）。出ない理由は画面に書いていない
8. ライトモード・ダークモードとも見た。ダークモードは端末の設定に従うだけで、サイトの中の切り替えはない

## F. 確認（合否はすべて終了コード）

各コミットの前に `pnpm exec tsc --noEmit`・`pnpm validate`・`pnpm test`・`pnpm build` を終了コードで確かめた。**検索のコミット（a79adff の前の版）は、確認のスクリプトが tsc=2 を返したのに、コミットの行を確認とつないでいなかったため先に入った**。型の誤り（build-index.ts から isExplanatoryTranslation に Entry を渡す型）を直し、4 つとも 0 を確かめて amend した（push の前）。以後は確認とコミットを別の手順にした。

本コミットの前:

```
pnpm exec tsc --noEmit   # exit 0
pnpm validate            # exit 0。警告 0。terms 1540 / symbols 220 / phrases 275 / conventions 80 / curriculum 163
pnpm spell               # exit 0。2,286 ファイル、0 件（postbuild・venv・Mbps を cspell.json に足した。1 回目は exit 1）
pnpm test                # exit 0。6 ファイル 177 件（search 17、export 8、seo 6 を含む）
pnpm build               # exit 0。2,007 ページ（404.html を含む）、export、Anki・PDF は「verified 0 で何も書かない」
pnpm perf                # exit 0（公開ビルドと、未確認を表示したビルド）
```

## G. Phase 5 に回すこと

1. **terms の日本側の主張**（指示 3）: pitfalls・mapping_note の「日本の教科書は〜」「日本では〜」を、慣習差と同じ基準（学習指導要領・解説、共通テスト・センター試験の問題文、日本語版 Wikipedia）で確かめ、確かめられない文は弱めるか消す。目安 286 語・300 文
2. **説明の訳の 14 語の中身**: 規則（mapping none ＋ corpus-no-fixed-expression）で決まるが、make-a-sign-chart（make a sign chart。sign chart は米国の用語）、the-five-centers-of-a-triangle（points of concurrency。米国の用語だが五心とは範囲が違う）、standard-score（hensachi。ローマ字）は「英語の用語ではない」と言い切れるか見る。変えるなら flag か mapping を直す（サイトは規則に従う）
3. **記号の単元（ledger/symbols.csv の category）をスキーマに入れるか**: 今は台帳の列をビルド時に読んでいる。symbols のスキーマに `category` を足すかは**あなたの判断**（スキーマの変更）
4. 監査で verified が出たら: Anki の .apkg を Anki のアプリ（デスクトップ・AnkiMobile・AnkiDroid）に取り込んで、カード・TTS・サブデッキを見る。単語対訳表 PDF の組版を見る。sitemap・OGP 画像が verified のページに出ることを確かめる
5. 実機（iPhone・Android）で検索の速さと 🔊 の声を見る
6. E の 2〜4（ナビ、長いフレーズのページ、取得元の一覧）を直すか
7. 公開時（PLAN §8 の閾値）: 今のサイトはすでに matheigo.github.io に出ている（push で配る。未確認は隠れて noindex）。公開の告知はユーザーの確認の後
