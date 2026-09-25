# Phase 2 レポート 2 — 参照に IM と英語版 Wikipedia の記事名を足し、③ をやり直して、Geometry の続き（50 語、バッチ 5 で停止）

作成: 2026-09-25 ／ 対象: 60d8336（Phase 2 geometry / discrete report）→ 本コミット
指示: audits/phase2-geometry-discrete-report.md を受けて 1〜5 を直し、6 で残りの 131 行に進む。判断は `docs/DECISIONS.md` の「Phase 2 幾何・離散の単元 2 の前の修正」（16 行）と「Phase 2 幾何・離散の単元 2」（13 行）。

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified に上げた語はない。

## まとめ

- **1〜5 はすべて直した**（コミット 9a3c5ce）。参照に IM（6 コース、799 レッスン、glossary 399 語）と英語版 Wikipedia の記事名を足し、全語の decide をやり直した。**人間レビュー行きの ③ は 24 → 12（terms 18 → 7）**。バッチ 4 の ③ 11 語のうち 8 語が決まった
- 平行移動は **en.term を shift → translation** にした（IM の図形の平行移動 260 件・glossary の見出し）。shift はグラフの言い方として両 register の variant に残した。ₙPᵣ は読みと記法の違いを直して corpus-human-settled
- **6 はバッチ 5 で止めた**。バッチ 5（Geometry 50 語）の人間レビュー行きの ③ が **20／50（40%）** で 1 割を超えた。米国の幾何の固有の名前（公準・証明の形式・角の組・優弧／劣弧・CPCTC・HL）は IM も使わず、英語版 Wikipedia の幾何の記事は数学カテゴリから 5 段以上深い（4 段の規則で使えない）か、記事がない
- 生成した 50 語: **likely 50 ／ draft 0**。参照で見出し 15（IM 12・Levin 3）、英語に決まった言い方がない 10、コーパスで決着 5
- 規則 1（英語に決まった言い方がない）の例外を 2 つ足した（IM の glossary の見出し、mapping none の米国の名前で ja が本プロジェクトの訳語）。**これはあなたの指示ではなく私の判断**（F-3・I）
- **残りは 81 行**（対象の単元）、**台帳全体では 735 行**（K）
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて緑（L）。crosscheck 363/363 一致

## A. 1〜2 で足した参照

### IM（指示 1）

| id（corpus/ref/） | 資料 | 版 | ライセンス | 取った範囲 |
|---|---|---|---|---|
| im-6-8 | Illustrative Mathematics, *IM 6–8 Math*（Grade 6・7・8） | Kendall Hunt 配布版（© 2017–2019 Open Up Resources、改訂 © 2019 Illustrative Mathematics） | CC BY 4.0（名前とロゴは対象外。各ページの表示で確かめた） | 423 レッスンの生徒向けページと練習問題、glossary（78・68・60 語） |
| im-9-12 | Illustrative Mathematics, *IM 9–12 Math*（Algebra 1・Geometry・Algebra 2） | Kendall Hunt 配布版（© 2019 Illustrative Mathematics） | 同上 | 376 レッスン、glossary（73・82・38 語）。Algebra 1 Supports は取らない |

- 取得: `python3 scripts/ledger/refetch.py im`（`refs` にも含む）。コース → 単元 → レッスンの順にたどり、1,604 ページ（レッスンと練習問題）＋ glossary 6 ＋ 索引 55。タイムアウト 30 秒・リトライ 3 回・4 並列、進捗 done/total、`<main>` だけをページ単位でキャッシュ（`corpus/ref/im/pages/`、gitignore）。再実行は足りない分だけ取る（2 回目は 0 件取得で済むことを確かめた）
- 練習問題の無いレッスン 49 ページは 404。404 はリトライせず「ページ無し」として記録する（初回はリトライ上限まで試してから失敗にしていたので直した）
- 本文は写さない。使うのはレッスンごとの件数、レッスン名、glossary の見出しだけ。docs/SOURCES.md に版・ライセンス・取得元を書いた

### 英語版 Wikipedia の記事名（指示 2）

- `python3 scripts/ledger/wikihead.py` → `scripts/ledger/wiki_head.json`（コミット。タイトルと段数だけ）。全エントリと台帳の未生成の行（1,816）について、ja 側（エントリの wikipedia-langlink の出典、無ければ ja.term の ja 記事の langlink）と en.term のリダイレクト先を 50 タイトルずつ引き、英語の記事の数学カテゴリからの段数を wikicat.py で数えた。キャッシュ `wiki_head_cache.json`（gitignore）
- 使う条件: 英語の記事が数学カテゴリから 4 段以内、曖昧さ回避ページでない、別の記事の節へのリダイレクトでない。ja.term の記事が別の記事へのリダイレクトなら使わない（外心 → 外接円）。記事が別の概念のものは `WIKIPEDIA_NOT_SAME` に理由付きで外す（6 語。F）
- 使える記事があるのは 1,816 中 712

### 規則 2 の参照の順（lib.ts `settleUndecided`）

CED → **OpenStax と IM（同じ段、件数の多い候補）** → Nicholson ／ Levin → **英語版 Wikipedia の記事名**。Nicholson ／ Levin ／ Wikipedia で決まった語（CED・OpenStax・IM のどの候補も 0 件）は mapping_note に「米国の高校課程（CED・OpenStax・IM）では扱わない」と件数を書く（decide が「直すこと」に出す）。

## B. 足す前と後の ③

| | 足す前（60d8336） | 1〜5 の後（9a3c5ce） | バッチ 5 の後（本コミット） |
|---|---|---|---|
| terms | 18 | **7** | 28（新しい 20 ＋ 既存の angle-addition-postulate） |
| phrases | 5 | 5 | 5 |
| symbols | 1（ₙPᵣ） | 0 | 0 |
| 計 | **24** | **12** | 33 |

decide の全体: 主見出し決着 740 ／ 併記 98 ／ 英語に決まった言い方なし 81 ／ 参照で見出し 176 ／ 人間が決めた 25 ／ 判断不能 33 ／ register 不一致 0 ／ 直すこと 0。

## C. 3〜5 の結果

### 3. 全語の decide のやり直し

足す前の terms の ③ 18 語のうち 11 語が決まった。

| id | 決着 |
|---|---|
| circumcenter | IM Geometry の glossary の見出し、23 件（7.5・7.6） |
| incenter | IM Geometry の glossary の見出し、29 件（7.6・7.7） |
| cyclic-quadrilateral | IM Geometry の glossary の見出し、13 件（7.4・7.5） |
| inscribed-circle | IM Geometry（7.6〜7.9）13 件。三角形の形で数え直した（F） |
| cevas-theorem ／ menelauss-theorem ／ dihedral-angle ／ angle-bisector-theorem | Wikipedia の記事名（ja の langlink 先。Ceva's theorem・Menelaus's theorem・Dihedral angle・Angle bisector theorem） |
| fractional-part | Wikipedia の記事名 Fractional part（IM の 2 件は別の意味。F） |
| numeral-system ／ universal-set | Wikipedia の記事名（en.term のリダイレクト先。Numeral system・Universal set） |

**残った 7 語**: circular-permutation・number-of-divisors・prime-factorization（Wikipedia の記事が別の概念。F）、common-tangent・excenter・exterior-angle-bisector・undefined-terms（どの参照にも無い。英語版 Wikipedia も記事がないか節へのリダイレクト）。

見出しが変わった既存の語: circumscribed-circle（circumcircle → circumscribed circle。IM 21 件 対 OpenStax 1 件）、stacked-bar-chart（stacked bar graph → segmented bar graph。IM Grade 8 の glossary の見出しで 30 件）。例文の英語も合わせた。
Nicholson ／ Levin ／ Wikipedia で決まっている既存の 40 語に「米国の高校課程（CED・OpenStax・IM）では扱わない（… は CED・OpenStax・IM とも 0 件）」を足した。0 件は counts.json の参照の件数で全候補について確かめた（0 でなければ止まるスクリプト）。前からの文言「米国の高校課程（OpenStax 6 冊・CED）には出てこない」の 3 語も、IM でも 0 件を確かめて新しい文言にした。
IM ／ Wikipedia で決まった語には出典（type reference）を足した。

### 4. 平行移動（translation、ja 平行移動）

| 言い方 | 用例コーパス（講義・OpenStax） | IM Grade 8 | IM Geometry | IM Algebra 2 |
|---|---|---|---|---|
| shift の形（vertical ／ horizontal shift、shifted … units ほか） | 話 96 ／ 書 208 | shift 2 | shift 4 | shift 11 |
| translation の形（グラフ） | 話 1 ／ 書 11 | — | — | — |
| translation（語のまま） | （語の翻訳と混ざるので数えない） | 94（glossary） | 166（glossary） | 28 |
| translate（動詞） | — | 48 | 101 | 41 |

- **en.term を translation にし、shift を variants（register both、グラフの言い方）にした**。1 概念 1 エントリのまま、使い分けを件数付きで pitfalls と variants の note に書いた（関数のグラフは講義・OpenStax で shift、図形は IM で translation、IM Algebra 2 はグラフにも translation／translate）
- コーパスの ① shift は両 register の variant として記録しているので、decide の register 不一致にはならない。出典に IM（Grade 8・Geometry の glossary）を足した

### 5. 記号 permutation-npr

- spoken_en: 1 番目 the number of permutations of n things taken r at a time、2 番目 n P r（どちらも standard）
- notes に記法の違い: 日本 ₙPᵣ、OpenStax Algebra and Trigonometry 2e ／ Precalculus 2e の Counting Principles は **P(n, r) が各 11 件、P(12, 9) の形が各 12 件**、nPr は計算機・コンピュータの表記として各 3 件。symbols のスキーマに pitfalls の欄がないので notes に書いた（スキーマは変えない）
- corpus-undecided を外して corpus-human-settled
- decide.ts が symbols の corpus-human-settled で落ちた（symbols に en がない）のを直した

## D. 生成（指示 6）

| | 範囲 | 語数 | likely | draft | ③ 人間 | 決まった言い方なし | 参照で見出し | コーパスで決着 | コミット |
|---|---|---|---|---|---|---|---|---|---|
| バッチ 5 | Geometry foundations・reasoning-and-proof・parallel-and-perpendicular・congruent-triangles・similarity、right-triangles と circles の始め | 50 | 50 | 0 | **20（40%）** | 10 | 15（IM 12・Levin 3） | 5 | 59528b0 |

書き方は前回と同じ: 見出し・register・mapping・出典・件数の事実は `corpus:probe --decide` で数えてこちらで仕様書に決め、本文（定義・例文・pitfalls）は 5 本の下書き役に 10 語ずつ書かせた。書いたあと count → decide で全語を照合し、下書き役の報告（F）と本文を読んで直した。

### ③（人間レビュー行き）20 語

| id | ja | 件数（話 ／ 書、IM） | 理由 |
|---|---|---|---|
| two-column-proof ／ paragraph-proof ／ flowchart-proof | 二段組みの証明 ほか（訳語） | 0 ／ 0、IM 0 | 米国の証明の形式の名前。IM は使わない。Wikipedia は Mathematical proof の節 |
| ruler-postulate ／ perpendicular-postulate ／ corresponding-angles-postulate | 訳語 | 0 ／ 0、IM 0 | 公準の名前。IM は公準を立てない |
| cpctc | CPCTC（訳語） | 8 ／ 0（すべて The Organic Chemistry Tutor）、IM 0 | 10 件に届かない。IM は corresponding parts（68 件）と書くが略語は使わない |
| hl-congruence | 斜辺と他の 1 辺がそれぞれ等しい | 0 ／ 0、IM 0 | |
| transitive- ／ reflexive- ／ symmetric-property | 推移律・反射律・対称律 | 2 ／ 0、5 ／ 0、0 ／ 0 | Wikipedia の記事は関係・対称性一般（別の概念） |
| law-of-syllogism | 三段論法 | 0 ／ 0 | ja の langlink 先 Syllogism は定言三段論法 |
| deductive-reasoning | 演繹的推論 | 2 ／ 0 | Wikipedia の記事が数学カテゴリから 5 段以上 |
| alternate-exterior-angles ／ same-side-exterior-angles | 外錯角・同側外角（訳語） | 9 ／ 0、0 ／ 0 | 外錯角は 1 件足りない（すべて The Organic Chemistry Tutor） |
| exterior-angle-theorem | 外角定理 | 0 ／ 0 | Wikipedia の記事が 5 段以上 |
| triangle-proportionality-theorem | 三角形と比の定理 | 0 ／ 0 | IM は名前を付けない。Wikipedia は Intercept theorem（行から届かない） |
| major-arc ／ minor-arc ／ reflex-angle | 優弧・劣弧・優角 | 0 ／ 0 | Wikipedia は節へのリダイレクトか曖昧さ回避 |

既存の angle-addition-postulate も規則 1 の例外（mapping none の訳語）で ③ になった。

### 参照で見出しを決めた 15 語

- IM（12）: straight angle（Grade 7・8 glossary）、alternate interior angles theorem（1 件）、scalene triangle（1 件）、side-side-side ／ side-angle-side ／ angle-side-angle（17 ／ 28 ／ 22 件）、isosceles triangle theorem（1 件）、rigid transformation（139 件、glossary）、dilation（372 件、glossary）、scale factor（579 件、glossary）、angle-angle triangle similarity（16 件）、similarity transformation（2 件）
- Levin（3）: inductive reasoning（4.5）、biconditional（1.1・1.2）、modus ponens（1.3。law of detachment は en.alt）

### 英語に決まった言い方がない 10 語

hypothesis（仮定。論理では hypothesis、答案では Given）、linear-pair・substitution-property・equiangular-triangle・right-triangle-similarity・aas-congruence・intercepted-arc・arc-measure・solve-the-right-triangle（mapping near の訳語）、indirect-measurement（測量）。

### コーパスで決着 5 語

implication（① 話 28 ／ 書 37。含意 = conditional statement）、midpoint formula（書 ① 12）、postulate（話 ① 10、The Organic Chemistry Tutor だけ）、transversal（話 ① 27）、SOHCAHTOA（話 ② SOHCAHTOA 19 ／ soh cah toa 13。書き起こしの綴りの違いなので en.alt）。

### 統合と移動

- 台帳（fix_decisions.py PHASE2F_SAME の末尾）: given（与えられた条件）→ hypothesis（仮定、中2）、ratio-of-similarity（相似比、中3）→ scale-factor（相似比を見出し）
- ja の見出しを台帳から変えた語: 合同条件 SSS ／ SAS ／ ASA → 日本の教科書の言い方（「3 組の辺がそれぞれ等しい」ほか）、AAS → 訳語「2 組の角とその間にない 1 辺がそれぞれ等しい」、HL → 「斜辺と他の 1 辺がそれぞれ等しい」、AA 相似 → 「2 組の角がそれぞれ等しい」、三角形の比例定理 → 三角形と比の定理（台帳の語は ja.alt）
- 台帳の mapping を変えた語（near → exact）: straight-angle・reflex-angle・biconditional・law-of-syllogism・law-of-detachment・hl-congruence・triangle-proportionality-theorem・same-side-exterior-angles・transversal
- level.jp を台帳の「大学」から内容の学年に直した語 19（DECISIONS）

### 既存の語で単元に当たったもの

prove（Geometry の合同の証明の例文）、parallel-lines（横断線と錯角の例文）、vector ／ arcsine（level.us に Geometry、例文。arcsine には直角三角形の角を inverse sine で求める pitfall）、area-of-a-sector（度数法の例文）。geometric-mean は足りている。
data/curriculum の term_refs を台帳から同期した（新しい 50 語と、台帳の単元にあるのに漏れていた既存の 6 語: eulerian-path・recurrence-relation・parallel-lines・vector・arcsine・gaussian-elimination）。

## E. パイプラインの変更

| 変更 | ファイル |
|---|---|
| IM の取得（`refetch.py im`、`refs` に含む。404 はリトライしない） | scripts/ledger/refetch.py |
| 英語版 Wikipedia の記事名（新規）、台帳の未生成の行も対象 | scripts/ledger/wikihead.py → wiki_head.json |
| IM の読み込み（レッスンの区切り、glossary）と Wikipedia の記事名 | scripts/corpus/references.ts |
| ReferenceHits に im ／ imGlossary ／ wikipedia、settleUndecided に OpenStax＋IM の段と Wikipedia の段、規則 1 の例外 2 つ、WIKIPEDIA_NOT_SAME、wikipediaHead、TERM_FORMS 11 語 | scripts/corpus/lib.ts |
| count に Wikipedia、decide に「高校課程では扱わない」の直すこと・symbols の修正・Wikipedia の見出しの比べ方、probe に IM・`@id`・`@translation` | scripts/corpus/count.ts・decide.ts・probe.ts |
| mapping_note の文言の例外を新しい文言に | scripts/validate.ts |
| IM の件数をコース別に見る補助（件数だけ） | scripts/corpus/_im.ts |

テストは 105 → 110（OpenStax と IM の段、Wikipedia の段、wikipediaHead、IM の glossary の数え方）。

## F. 確かめた主張

書いたあとに文脈（端末だけ）・counts.json・参照の本文で確かめたもの:

- IM の各ページの表示: CC BY 4.0、Illustrative Mathematics の名前とロゴは対象外。IM 6–8 は Open Up Resources の著作（2017–2019）を IM が改訂（2019）
- ₙPᵣ: OpenStax Algebra and Trigonometry 2e ／ Precalculus 2e の Counting Principles で P(n, r) 各 11 件、P(12, 9) の形 各 12 件、nPr は計算機・コンピュータの表記として各 3 件
- 参照の件数が別の意味だったもの（形で数え直した）: IM の floor of 7 件（部屋・建物の床）、IM Grade 6 の fractional part 2 件（1 を分数に分けた部分）、OpenStax の inscribed circle 3 件（曲率円）、OpenStax の angle-angle-side（正弦定理で解く問題の場合分け ASA ／ AAS の名前）、用例コーパスの surveying 494 件（統計の調査）、AP Statistics の CED の ASA（American Statistical Association）
- Wikipedia の記事が別の概念だったもの（WIKIPEDIA_NOT_SAME）: circular permutation → Cyclic permutation（群論）、number of divisors → Divisor function（σ_k の族）、素因数分解 → Integer factorization（素数に限らない因数分解とその計算）、transitive property → Transitive relation、symmetric property → Symmetry、三段論法 → Syllogism（定言三段論法）
- Wikipedia の段数: Cyclic quadrilateral は Types of quadrilaterals → Quadrilaterals → Polygons by the number of sides → Types of polygons で 4 段以内に数学の根に届かない（キャッシュのカテゴリで確かめた）。Exterior angle theorem・Circumcircle・Incenter・Deductive reasoning も 4 段以内に届かない
- IM isosceles triangle theorem 1 件は Geometry 2.8 の二等辺三角形の定理の証明の話（同じ概念）。IM measure of the arc 4 件は中心角と弧の度数の問題
- 平行移動の IM の件数（C-4 の表）。floor of の数学の意味は話し言葉 4 件（前の 6 件のうち 2 件は Walker の最上階と箱の底）

消した・弱めた主張: postulate の pitfall「名前付きの postulate は日本語では「公理」と訳す（segment addition postulate は「線分の加法公理」）」（本辞典の訳語を一般の訳し方のように書いていた）、scalene の IPA（cspell に通らない。「スケイリーン」のような読みに）。

## G. 決めたこと（あなたの指示の外）

1. **規則 1 の例外を 2 つ足した**。① mapping none で ja が本プロジェクトの訳語の語（two-column proof・CPCTC・SOHCAHTOA・ruler postulate）は、英語の名前が元なので「英語に決まった言い方がない」にしない。② IM の glossary の見出しの語（dilation 372 件・scale factor 579 件）も同じ。docs/SOURCES.md は「例外に数えるのは CED だけ（今までどおり）」だったが、これを書き換えた。最初は ① を mapping near の訳語にも当てたが、2026-09-24 に決着していた 3 語（長除法による積分ほか、英語も手順の説明の語）まで人間レビューに戻ったので、mapping none に絞った
2. 「米国の高校課程（CED・OpenStax・IM）では扱わない」を Wikipedia で決まった語だけでなく Nicholson ／ Levin で決まった語にも当てた（その段に来る語はどれも CED・OpenStax・IM で 0 件）
3. ガウス記号（floor-function）の mapping を near → exact にした（floor of を正しく数えると 10 件を下回り、near のままだと「英語に決まった言い方がない」になる。trigonometric-ratio と同じ扱い）

## H. 怪しい点（Phase 5 の監査へ）

- **英語版 Wikipedia の 4 段の規則は幾何のほとんどの記事を締め出す**（Cyclic quadrilateral・Exterior angle theorem・Circumcircle・Incenter）。Wikipedia で決まったのは定理の名前（Ceva・Menelaus・Angle bisector theorem）と集合・記数法の語だけ
- IM の 1〜2 件で見出しを決めた語: alternate interior angles theorem・scalene triangle・isosceles triangle theorem（各 1 件）、similarity transformation（2 件）。見出しの語は教科書の名前として自然だが、根拠は薄い
- IM の件数はレッスンと練習問題を合わせて数え、重複を除いていない（IM の練習問題には前のレッスンの問題の再掲がある）。件数の比で見出しを決めた語（rigid transformation 139 対 rigid motion 77、side-side-side 17 対 side-side-side triangle congruence 12）は再掲の分だけ多めに出ている可能性がある
- 平行移動の en.term はコーパスの ① shift ではなく参照（IM）で決めた。規則の上では register の判定（コーパス）と矛盾しないが、見出しの選び方はあなたの指示の解釈による
- 「英語に決まった言い方がない」にした訳語のうち、英語に名前がある語（linear pair・intercepted arc・AAS・arc measure）。mapping near の訳語を規則 1 に当てた結果で、2026-09-24 の決定（一般形 general form も OpenStax に 5 件あって同じ扱い）と揃えた
- 「米国の高校課程（CED・OpenStax・IM）では扱わない」は言い方の件数で決めていて、概念の有無ではない。inverse（裏）・negation・truth value は米国の Geometry の教科書（IM 以外）では扱うものがある
- 仮定（hypothesis）は「英語に決まった言い方がない」にした（論理は hypothesis、答案は Given）。Given は数えられない
- level.jp を台帳から直した 19 語、mapping を変えた 9 語（D）
- 三角形の読みが entries でさんかくけい ／ さんかっけいに分かれている（既存のデータから。どちらも正しい読み）
- 用例コーパスの幾何の話し言葉は今回も The Organic Chemistry Tutor 1 か所頼み（linear pair・CPCTC・alternate exterior angles・postulate・reflexive property）

## I. 止めた理由と、決めてほしいこと

バッチ 5 の人間レビュー行きが 20／50（40%）で 1 割を超えたので、バッチ 6 に進まず止めた。**IM と Wikipedia を足しても、米国の Geometry の固有の名前は決まらなかった**: IM は公準・証明の形式・角の組の名前を使わず、英語版 Wikipedia の幾何の記事は 4 段の規則の外にある。

決めてほしいこと:

1. Geometry の ③ 20 語（B・D）の見出しを人間が決めるか、参照をさらに足すか（たとえば英語版 Wikipedia の段数を幾何だけ 6 段にする、米国の伝統的な Geometry の教科書を参照に足す）
2. 規則 1 の例外 2 つ（G-1）をこのまま残してよいか
3. 残りの Geometry 20 行（area-and-volume 8・transformations 6・circles 5・coordinate-geometry 1）も同じ性質（apothem・glide reflection・composite figure・coordinate rule ほか）で、今の参照では ③ が多い見込み。Discrete Math 49 行は Levin で多くが決まる見込みなので、**先に Discrete Math と数I／数A の残り（台帳の順を変える）** にするかどうか

## K. 残りの行数

**対象の単元で 81 行**（台帳の unit にこの 4 系統を含み、まだエントリのない行）。

| 単元 | 行 |
|---|---|
| Discrete Math（graphs-and-relations 13・logic-and-proofs 12・number-theory 8・induction-and-recursion 5・sets-and-functions 5・counting 4・discrete-probability 2 ほか） | 49 |
| Geometry（area-and-volume 8・transformations 6・circles 5・coordinate-geometry 1） | 20 |
| 数I・数A（共通部分・仮説・変量・余事象・和の法則・積の法則・中線・合同式・10 進法・割線・同一平面上にある ほか） | 12 |

**台帳全体の残り: 1,814 行中 735 行**（エントリ 1,079）。先頭の単元で数えると、中学 511・Algebra 1／2 123・Discrete Math 49・Geometry 20・数I／数A 13・Pre-Algebra 11・Integrated Math 8。

## L. 確認

```
python3 scripts/ledger/refetch.py im       # courses 6、units 49、lessons 1,604（うち 404 が 49）、glossary 399 語。再実行は 0 件取得
python3 scripts/ledger/wikihead.py         # 1,816 行中 1,308 に記事、712 が使える
python3 scripts/ledger/fix_phase1.py       # 手順 14: same 33（+2）ほか前回どおり
pnpm corpus:count && pnpm corpus:decide -- --write
                                           # 対象 1,095。主見出し 740 ／ 併記 98 ／ 決まった言い方なし 81 ／ 参照 176 ／ 人間が決めた 25 ／ 判断不能 33 ／ 不一致 0 ／ 直すこと 0
pnpm crosscheck -- --write                 # 363/363 一致
pnpm exec tsc --noEmit                     # 緑
pnpm validate                              # terms 1,079、警告 0
pnpm spell                                 # 0 件
pnpm test                                  # 110/110
pnpm build                                 # 緑。export: terms.json 1,068（draft 11 を除く）、symbols.json 11
```
