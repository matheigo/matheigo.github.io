# Phase 3 記号と慣習差 — 修正 1〜3、記号の残り（バッチ 4・5）、慣習差（バッチ 1〜3）

作成: 2026-09-25 ／ 対象: b532122（Phase 3 記号のレポート）→ 本コミット
指示: audits/phase3-symbols-report.md を受けた 1〜5。判断は `docs/DECISIONS.md` の「Phase 3 記号と慣習差の前の修正」「Phase 3 記号の生成 バッチ 4・5」「Phase 3 慣習差の生成」。

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified の語は 0。

## まとめ

- **1**: スキーマ変更（symbols と conventions の任意項目 `related`）は了承として DECISIONS に記録した
- **2**: 記号の ③ に規則 2（参照で決める）を入れた（lib.ts `settleSymbolReading`）。**D-3 の 22 件のうち 17 件が参照で決まり（likely）、5 件が残った（draft）**。参照の本文の数学用イタリック（Levin の 𝑃・𝐴）と IM・CK-12 の行内数式の \( \) を外して読むようにした（terms の判定は前後で 1 行も変わらない）
- **3**: MICASE を取り込んだ。~/Downloads に zip はなく、Safari が展開した `MICASE` フォルダが 1 つだけあったので、それを読むようにした（fetch-micase.ts がフォルダも受け付ける）。**152 書き起こし・1,796,311 語**。@ID の役割の欄は語（Student・Teacher ほか）、教育の欄に Manual の記号（SU・JF ほか）。phrases の ③ 2 件はどちらも話し言葉 ① になった
- **4**: 記号の残り 70 行を 2 バッチで生成（**新しい記号 70、likely 66 ／ draft 4**。記号は ledger の 220 行すべて）。コーパスで ③ だったのはバッチ 4 が 12、バッチ 5 が 7 で、規則 2 で 16 件が決まり、**残った ③ はバッチ 4 が 0 ／ 50、バッチ 5 が 3 ／ 20（15%）**。バッチ 5 は 1 割を超えたが、記号の最後のバッチなので指示 5 に進んだ（F の 1 つ目）
- **5**: 慣習差 121 行を 3 バッチで処理し、**71 行を生成（likely 71）、50 行を外した**（日本側を確かめられない 35、米国側が参照と合わない・確かめられない 5、両側とも確かめられない 5、日米で同じ 5。一覧は C-3）。記号と慣習差の related は両側に入れた（47 組）
- バッチは記号 2 ＋ 慣習差 3 ＝ 5（6 以内）
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて終了コード 0（G）

## A. 修正 2 — 記号の ③ を参照で決める

### A-1. 決めた規則（DECISIONS「Phase 3 記号と慣習差の前の修正」2）

- 話し言葉で ③ の記号は、参照の本文で読みの形（SYMBOL_PATTERNS）を数える。段の順は terms と同じ（CED → OpenStax・IM・CK-12 → Nicholson・Levin）。段が読みを決めるのは、その段の参照の 1 つが読みを **3 件以上**使うとき（CED は terms と同じく 1 件から。1 つの読みの形は足し、2 つの読み・2 つの参照は足さない）。同じ段では件数の多い読み
- 英語版 Wikipedia の記事名は使わない（読みではない）。mapping がないので「英語に決まった言い方がない」も当てない。**節の名前・IM の glossary の見出しも数えない**（本文だけ。arc-ab が IM の glossary の arc で 3 件に届いていたのを見て入れた）
- flag は corpus-reference-fallback、register は主張しない。決めた読みを spoken_en の 1 つ目（standard）に置き、話し言葉で 1 件以上ある読みを spoken に、0 件の読みは外した。決めた参照を出典に入れて likely にした
- Levin ／ Nicholson で決まり、高校の参照が 0 件の記号は notes に「米国の高校課程（CED・OpenStax・IM・CK-12）では扱わない」と参照の件数を書いた（decide が「直すこと」に出す）
- 参照の読み方の直し: 数学用英数字（U+1D400〜1D7FF）を普通の文字に畳む（Levin の “𝑃 ∨ 𝑄 is read 𝑃 or 𝑄” が p or q で数えられる）。IM・CK-12 の \( \) を外す（parallelogram \(ABCD\) が parallelogram abcd で数えられる）。どちらも terms の判定は前後で変わらない（decide のレポートの terms の行を比べた。coordinate-rule の CK-12 の件数が 18 → 16 になっただけで、見出しは同じ）
- 参照が添字の読み方を示さない記号は参照で決めない（lib.ts `SYMBOL_NOT_READ_IN_REFERENCES`: sequence-braces。候補の違いは a sub n ／ a n で、参照は the sequence aₙ = … と数式で書く）
- 数え直しで形を直した: curly-braces の braces は複数形だけ（単数の brace は参照ではほとんどが三平方の定理の文章題の筋交い）、product-pi-notation は the product of … from one to …（translate from math notation to words の誤一致を除く）、set-difference は名前の set difference ｜ difference of sets を standard に（A minus B は数の引き算と分けられないので notes へ）、vector-ab-arrow に vector PQ の形を足した

### A-2. D-3 の 22 件の結果（17 件が決まり、5 件が残った）

| id | 記号 | 読み（1 つ目が standard） | 決め方 | confidence |
|---|---|---|---|---|
| minus-plus-sign | `\mp` | minus or plus | ③ のまま（人間レビューへ） | draft |
| curly-braces | `\{\ \}` | braces ／ curly braces | 参照 OpenStax （本文 9 件） | likely |
| proportion-colon | `a : b = c : d` | a is to b as c is to d | 参照 CED （unit3） | likely |
| sequence-braces | `\{a_n\}` | the sequence a sub n ／ the sequence a n | ③ のまま（人間レビューへ） | draft |
| max-min-notation | `\max\{a, b\},\ \min\{a, b\}` | the larger of a and b ／ the maximum of a and b ／ the max of a and b | 参照 AP Statistics の CED （topic 4.7・topic 4.10） | likely |
| ceiling-brackets | `\lceil x \rceil` | the ceiling of x ／ the smallest integer greater than or equal to x | ③ のまま（人間レビューへ） | draft |
| product-pi-notation | `\prod_{i=1}^{n} a_i` | the product of a sub i, i from one to n | 参照 OpenStax （本文 3 件） | likely |
| repeated-combination-h-jp | `{}_{n}\mathrm{H}_{r}` | n plus r minus one choose r ／ n multichoose r ／ the number of combinations with repetition of n things taken r at a time | ③ のまま（人間レビューへ） | draft |
| not-element-of-sign | `a \notin A` | a is not an element of A ／ a is not a member of A | 参照 Levin （5.1 Sets・1.5 Proofs about Discrete Structures・2.1 Problems and Definit） | likely |
| proper-subset-sign | `A \subsetneq B` | A is a proper subset of B | 参照 Levin （1.5 Proofs about Discrete Structures・5.1 Sets） | likely |
| empty-set-symbol | `\emptyset` | the empty set | 参照 Levin （5.1 Sets・1.5 Proofs about Discrete Structures・3.1 Pascal’s Arithmetica） | likely |
| rationals-symbol | `\mathbb{Q}` | the rational numbers | 参照 OpenStax （本文 11 件） | likely |
| set-builder-braces | `\{x \mid x > 0\}` | the set of all x such that x is greater than zero | 参照 OpenStax （本文 5 件） | likely |
| roster-braces | `\{1, 2, 3\}` | the set containing one, two, and three ／ the set one, two, three | 参照 Levin （5.1 Sets・1.5 Proofs about Discrete Structures） | likely |
| cartesian-product-cross | `A \times B` | the Cartesian product of A and B | 参照 Levin （5.1 Sets・2.6 Relations and Graphs・3.7 Applications to Probability） | likely |
| power-set-notation | `\mathcal{P}(A)` | the power set of A | 参照 Levin （5.1 Sets） | likely |
| set-difference | `A \setminus B,\ A - B` | the set difference of A and B | 参照 Levin （5.1 Sets・1.5 Proofs about Discrete Structures） | likely |
| half-open-interval | `[a, b)` | the half-open interval from a to b ／ the interval from a to b, including a but not b | ③ のまま（人間レビューへ） | draft |
| logical-or-vee | `p \lor q` | p or q | 参照 Levin （1.1 Mathematical Statements・1.6 Chapter Summary） | likely |
| qed-end-of-proof | `\blacksquare,\ \square,\ \text{Q.E.D.}` | which completes the proof ／ end of proof ／ Q E D | 参照 Nicholson （2.5 Elementary Matrices・2.7 LU-Factorization・3.2 Determinants and Matr） | likely |
| vector-ab-arrow | `\overrightarrow{AB}` | vector AB ／ the vector from A to B | 参照 OpenStax （本文 8 件） | likely |
| angle-bracket-vector | `\langle a, b \rangle` | the vector with components a and b | 参照 OpenStax （本文 5 件） | likely |

残った 5 件（draft、corpus-undecided。次のレポートで人間が決める）:

| id | 記号 | 話し言葉 | 参照 | 残った理由 |
|---|---|---|---|---|
| minus-plus-sign | ∓ | minus or plus がわずか | どの参照も言葉で読まない（OpenStax は cos(α ± β) = … ∓ … と数式で書くだけ） | 読みの語が参照にない |
| sequence-braces | {aₙ} | the sequence a sub n ／ a n がわずか | 参照は the sequence aₙ = … と数式で書く | 添字の読み方を参照で比べられない（SYMBOL_NOT_READ_IN_REFERENCES） |
| ceiling-brackets | ⌈x⌉ | the ceiling of がわずか | OpenStax 1 件（3 件に届かない）、Levin 0 | 3 件に届かない |
| repeated-combination-h-jp | ₙHᵣ | plus … minus one choose … が 1 件 | どの参照も記号の読みを言葉で書かない（Levin は multiset・stars and bars の名前を使うが、ₙHᵣ の読みではない） | 読みの語が参照にない |
| half-open-interval | [a, b) | including … but not … がわずか | OpenStax に half-open interval 1 件・including … but not … 1 件 | 3 件に届かない |

## B. 修正 3 — MICASE

### B-1. 見つけたもの

- ~/Downloads に MICASE の zip はなかった。`~/Downloads/MICASE`（Safari が落としたときに展開したフォルダ）が 1 つだけあり、中身は CHAT の書き起こし .cha が 152 と 0metadata.cdc（Creator: Römer, Ute ／ Swales, John、DOI 10.21415/QT9V-2J96）。それらしいものは 1 つだけなので止めずに使った
- `pnpm corpus:fetch:micase -- ~/Downloads/MICASE`: fetch-micase.ts が zip のほかに展開済みフォルダも受け付けるようにし、corpus/micase/raw/ に 1 回だけ写す（done/total を表示。ネットワークには出ない）

### B-2. @ID の役割の欄（実データで確かめた）

- CHAT の @ID は `言語|コーパス|話者|年齢|性別|グループ|SES|役割|教育|注記|`。MICASE では **役割の欄（8 欄目）が語**（Student 1,081・Teacher 132・Other 106・Speaker 102・Unidentified 81・Audience 73・Participant 63・Member 56・Investigator 37・Leader 22・Visitor 5・Friend 1）、**教育の欄（9 欄目）に Manual の学年・職の記号**（SU・JU・JG・SG・SF・JF・ST・RE・VO・UN ほか）
- 振り方（micase.ts `speakerClass`）: 役割が Teacher なら教員、Student なら学生。ほかの語（Speaker・Audience・Member ほか）は記号で振る（JF・SF・MF は教員、JU・SU・MU・JG・SG・MG は学生、ST・RE・VO・UN は other）。授業をする院生（Teacher／SG 21 人）は教員側。Student に教員の記号が付いた行はない
- 単体テストを実データの形（`eng|MICASE|S1|36;|female|NS||Teacher|JF||`）に合わせた

### B-3. 場面 × 話者の語数（corpus/micase/stats.json。CHAT の記号を除いた語数）

| 場面 | 書き起こし | 学生 | 教員 | その他 |
|---|---|---|---|---|
| advising session | 2 | 10,894 | 25,708 | 161 |
| colloquium | 14 | 17,926 | 130,338 | 18,886 |
| discussion section | 9 | 15,690 | 64,389 | 41 |
| dissertation defense | 4 | 35,746 | 20,476 | 510 |
| interview | 3 | 5,250 | 7,286 | 0 |
| lab section | 8 | 40,664 | 40,981 | 202 |
| large lecture | 30 | 16,194 | 260,265 | 649 |
| meeting | 6 | 43,824 | 11,608 | 17,316 |
| office hours | 14 | 57,340 | 118,355 | 1,255 |
| seminar | 7 | 63,034 | 84,590 | 136 |
| service encounter | 2 | 16,848 | 4 | 11,513 |
| small lecture | 32 | 44,413 | 294,853 | 7,864 |
| student presentation | 11 | 116,486 | 27,723 | 4,692 |
| study group | 8 | 139,197 | 0 | 4 |
| tour | 2 | 14,325 | 0 | 8,675 |

計 1,796,311 語。Manual の表 4-4（1,695,540 語）とは数え方が違う（CHAT の語の区切りで数えた）。CABank 版のフォルダ分けは Manual と少し違い、office hours が 14（Manual は office hours 8・tutorial 3）、advising が 2（Manual は 5）。

### B-4. phrases の ③ 2 件の数え直し（MICASE は phrases だけに数える）

| id | 話し言葉の判定（MICASE 込み） | MICASE の中の話者（grep の概数） |
|---|---|---|
| class-asking-repeat | **①** could you repeat ｜ can you repeat（首位だけが 10 件以上、2.2:1。首位の件数のほとんどが MICASE で、抜くと ③ になるだけなので ① のまま） | could／can you repeat は学生 6・教員 4、could you say … again は学生 5・教員 1、i missed that は学生 2・教員 1 |
| office-hours-stuck-at-step | **①** walk … through（首位だけが 10 件以上、1.3:1。首位の半分が yt:profleonard、抜くと ③ になるだけ） | walk … through は学生 5・教員 5（学生の walk us／you through 2）、i don't see how は学生 6・教員 0、i'm lost は学生 2 |

- どちらも evidence は書き戻していない（Phase 3 の準備と同じく phrases の生成で書く）。office-hours-stuck-at-step の首位 walk … through は教員の発話も同じだけ含む（F）

## C. 修正 4・5 — 生成

### C-1. 記号のバッチ 4・5（ledger/symbols.csv の 151〜220 行）

| バッチ | 行 | 新しい記号 | likely | draft | コーパスで ③ | 規則 2 で決まった | 残った ③ | ② 併記 |
|---|---|---|---|---|---|---|---|---|
| 4 | 151〜200（ベクトル・行列・確率統計・ギリシャ文字・複素数） | 50 | 49 | 1 | 12 | 12 | **0** | 8 |
| 5 | 201〜220（複素数の極形式・π・度・幾何の記号・プライム・座標） | 20 | 17 | 3 | 7 | 4 | **3（15%）** | 0 |
| 計 | 70 行 | **70** | **66** | **4** | 19 | 16 | 3 | 8 |

- data/symbols は 150 → 220（ledger の 220 行すべて）。draft は全体で 9（残った ③ 8 と、出典が editorial だけの conditional-probability-subscript-jp）
- ② 併記の 8 件: probability-of-a（the probability of A ／ P of A）・standard-deviation-sigma（the standard deviation of X ／ sigma）・mu-population-mean（mu ／ the population mean）・x-bar-sample-mean（the sample mean ／ x bar）・p-hat-sample-proportion（p hat ／ the sample proportion）・z-star-critical-value（z star ／ the critical value）・h-sub-a-alternative（the alternative hypothesis ／ H one）・iqr-abbreviation（the interquartile range ／ I Q R）
- 数え方（DECISIONS「Phase 3 記号の生成 バッチ 4・5」）: 読みは字形の読み方として数えた（r² の r squared は πr² も同じ読み、P(A) の P of A は多項式 p(a) と同じ読み、A′ の A prime は微分の a′ と同じ読み）。大文字のギリシャ文字は同じ名前で読むので名前の件数に入るが、別の記号として立つものは形で除いた（σ から Σ の sigma notation・σ² の sigma squared・MIT 18.06 の特異値の Σ、δ は ε-δ の言い方だけ）。文字 1 つの読みは使う形で数えた（i は i squared equals negative one、a + bi は plus b i）。数えられない読み（S E・p prime・文字の s）は候補に置かなかった
- 日本だけの記号 P_A(B) は米国の書き方 P(B | A) の読み the probability of B given A で数えた（gauss-bracket-jp と同じ）

規則 2 で決まった 16 件と、残った 3 件:

| id | 記号 | 読み（1 つ目が standard） | 決め方 | confidence |
|---|---|---|---|---|
| cross-product-cross | `\vec{u} \times \vec{v}` | the cross product of u and v ／ u cross v | 参照 OpenStax （本文 32 件） | likely |
| projection-notation | `\operatorname{proj}_{\vec{v}} \vec{u}` | the projection of u onto v | 参照 OpenStax （本文 20 件） | likely |
| matrix-brackets | `\begin{bmatrix} a & b \\ c & d \end{bmatrix}` | the matrix a, b, c, d ／ the two-by-two matrix with entries a, b, c, d | 参照 Nicholson （5.5 Similarity and Diagonalization・2.2 Matrix-Vector Multiplication） | likely |
| matrix-entry-aij | `a_{ij}` | the i j entry of A | 参照 Nicholson （2.3 Matrix Multiplication・2.1 Matrix Addition, Scalar Multiplication, ） | likely |
| probability-of-union | `P(A \cup B)` | the probability of A union B ／ the probability of A or B | 参照 AP Statistics の CED （topic 2.7） | likely |
| normal-distribution-n | `N(\mu, \sigma),\ N(m, \sigma^2)` | normal with mean mu and standard deviation sigma | 参照 AP Statistics の CED （exam） | likely |
| binomial-distribution-b | `B(n, p)` | the binomial distribution with n trials and success probability p ／ B of n comma p | 参照 AP Statistics の CED （exam） | likely |
| distributed-as-tilde | `X \sim N(\mu, \sigma)` | X is normally distributed with mean mu and standard deviation sigma ／ X follows a normal distribution | 参照 OpenStax （本文 29 件） | likely |
| chi-square-symbol | `\chi^2` | chi-square | 参照 AP Statistics の CED （topic 3.14・topic 3.15） | likely |
| gamma | `\gamma` | gamma | 参照 OpenStax （本文 7 件） | likely |
| complex-conjugate-bar | `\bar{z}` | the complex conjugate of z | 参照 OpenStax （本文 20 件） | likely |
| complex-modulus-bars | `｜z｜` | the absolute value of z ／ the modulus of z | 参照 OpenStax （本文 12 件） | likely |
| argument-arg-z | `\arg z` | the argument of z ／ arg z | ③ のまま（人間レビューへ） | draft |
| polar-form-cis | `r(\cos\theta + i\sin\theta),\ r\operatorname{cis}\theta` | r times cosine theta plus i sine theta ／ r cis theta | ③ のまま（人間レビューへ） | draft |
| congruent-sign | `\triangle ABC \equiv \triangle DEF,\ \triangle ABC \cong \triangle DEF` | triangle ABC is congruent to triangle DEF | 参照 IM （Geometry 2.2 Congruent Parts, Part 2・Geometry 2.3 Congruent Triangles,） | likely |
| similar-sign | `\triangle ABC \backsim \triangle DEF,\ \triangle ABC \sim \triangle DEF` | triangle ABC is similar to triangle DEF | 参照 IM （Geometry 3.13 Using the Pythagorean Theorem and Similarity・Geometry 3.） | likely |
| arc-ab | `\overset{\frown}{AB}` | arc AB ／ the measure of arc AB | ③ のまま（人間レビューへ） | draft |
| circle-o | `\odot O` | circle O | 参照 IM （Grade 8 2.2 Circular Grid・Geometry 3.1 Scale Drawings・Geometry 7.13 Us） | likely |
| parallelogram-abcd | `\square ABCD` | parallelogram ABCD | 参照 IM （Geometry 2.13 Proofs about Parallelograms・Geometry 5.5 Scaling and Uns） | likely |

- 残った 3 件の理由: argument-arg-z（話し言葉 1 件、参照は arg を数式で書くだけ）、polar-form-cis（OpenStax Precalculus は r cis θ と数式で略記するだけで、読みを言葉で書かない）、arc-ab（話し言葉 0 件、CK-12 は弧を記号 \widehat{AB} だけで書き、IM の本文は 2 件で 3 件に届かない）

### C-2. 慣習差のバッチ 1〜3（ledger/conventions.csv の 121 行）

- 確かめ方（DECISIONS「Phase 3 慣習差の生成」）: 日本側は学習指導要領（〔用語・記号〕）・学習指導要領解説（中学校 数学編、高等学校 数学編 理数編）・日本語版 Wikipedia、米国側は OpenStax・AP の CED・IM・CK-12（大学の内容は Levin・Nicholson）。行の文（jp・us）は確かめた範囲だけで書き直し、確かめた資料を主語にした。日本側の「〜しない」は「解説に出てこない」と書いた
- 取得: `python3 scripts/ledger/fetch_jp_refs.py`（解説の PDF 2 つ → pdftotext、日本語版 Wikipedia 278 記事と全文検索 18 件で見つけた記事。タイムアウト 30 秒・リトライ 3 回・done/total・取得済みは取り直さない。corpus/ref/jp/ は gitignore）

| バッチ | 行 | 生成 | 外した | 内訳（外した） |
|---|---|---|---|---|
| 1 | 1〜50 | 37（既存の 3 行は日本側の出典を足して書き直し） | 13 | 日本側 10、米国側 1、両側 2 |
| 2 | 51〜100 | 28 | 22 | 日本側 19（資料がない 2 を含む）、米国側 1、日米で同じ 2 |
| 3 | 101〜121 | 6 | 15 | 日本側 6、米国側 3、両側 3、日米で同じ 3 |
| 計 | 121 | **71（likely 71）** | **50** | |

生成した 71 行:

- バッチ 1（37）: therefore-because-symbols・inequality-symbols・slope-intercept-form・similarity-symbol・congruence-symbol・figure-and-measure-notation・arc-measure-notation・conditional-probability-notation・complement-bar-vs-c-prime・combination-permutation-notation・repeated-combination-notation・log-and-ln・reciprocal-trig-functions・inverse-trig-functions・calculator-instead-of-tables・normal-table-format・interval-notation-vs-inequalities・us-named-rules-and-tests・antiderivative-vs-indefinite-integral・area-and-base-letters・triangle-congruence-criteria・congruence-abbreviations-in-proofs・us-named-theorems-and-reasons-in-geometry・logic-in-geometry-course・mapping-rule-notation・graph-transformations・transformations-define-congruence-and-similarity・scale-factor-direction・factoring-trinomials-method・inequality-graph-boundary・square-and-cubic-units・circle-and-sphere-boundary・floor-function-notation・us-only-precalculus-topics・us-only-calculus-topics・lhopitals-rule-use・descriptive-statistics-coverage
- バッチ 2（28）: jp-only-number-theory・jp-only-synthetic-geometry・jp-only-algebra-and-discrete-topics・jp-named-techniques-unnamed-in-us・substitution-variable-u・let-new-variable-first・vertex-and-center-letters・quadratic-forms-naming・line-standard-form・imaginary-number-scope・series-includes-finite-sums・probability-and-or-notation・two-column-proof-format・discriminant-letter-d・one-sided-limit-notation・gcd-written-in-words・euler-trail-scope・natural-numbers-and-zero・normal-distribution-parameter・number-of-elements-notation・regression-line-letters・variance-notation・universal-set-and-sample-space・inequality-terms-scope・trapezoid-definition・rounding-place・set-builder-colon・subset-symbol
- バッチ 3（6）: hensachi・slant-height-vs-generatrix・zeros-roots-intercepts・dne-in-answers・negative-vs-minus・sequence-starting-index

- 台帳の文から直したもの（確かめた範囲に合わせた）: interval-notation-vs-inequalities（解説の数学III に閉区間 [a, b] が出てくる）、us-only-calculus-topics（「学習指導要領に微分方程式の語がない」は誤りで、理数数学II に dy/dx = ky 程度がある。数学III にない、と書いた）、lhopitals-rule-use（解説の数学III の課題学習の例に出てくる）、descriptive-statistics-coverage（共分散・四分位偏差は日本側で確かめられないので平均絶対偏差だけ）、antiderivative-vs-indefinite-integral（解説は「不定積分」だけを使い「原始関数」が出てこない）、quadratic-forms-naming（OpenStax は vertex form を standard form とも呼び、ax² + bx + c を general form と呼ぶ）、similarity-symbol・congruence-symbol（≡ は Levin では論理的同値と合同式）、complement-bar-vs-c-prime（日本語版 Wikipedia「差集合」の Ā を足した）
- **trapezoid-definition**: 日本側の定義を日本語版 Wikipedia「台形」で確かめた（少なくとも一組の対辺が平行。平行四辺形を含む）。米国は CK-12 Geometry が exactly one pair、IM Geometry が at least one pair
- 付録 B の 10 行（#2・#8・#9・#10・#18・#19・#22・#23・#26・#29）: 生成できたのは #29（sequence-starting-index）だけ。#10・#26 は日米で同じ（予想どおり）、#8（÷）・#9（×）は OpenStax Prealgebra が ÷・× を数の計算に使っていて米国側の主張と合わない、#2（≒）は日本語版 Wikipedia「近似」が記号の使い方はまちまちと書く、#18・#19（手書き）・#22（有理化）は資料がない、#23（Calculus は radians だけ）は確かめられない
- **related**: 慣習差の related 列と ledger/symbols.csv の related 列の組のうち、両方のファイルがあるものを両側に入れた（47 組。慣習差 26 行・記号 47 個）。記号の notes が外した慣習差（repeating-decimal-notation）を名前で指していたので、OpenStax Prealgebra・Elementary Algebra で確かめた文に直し、出典に足した

### C-3. 外した慣習差（50 行。ledger/conventions-excluded.csv）

| バッチ | id | 確かめられなかった側 | 理由 |
|---|---|---|---|
| 1 | vector-notation | 日本側 | 日本側（成分を (a₁ |
| 1 | standard-unit-vector-letters | 日本側 | 日本側（基本ベクトルを e₁ e₂ e₃ と書く）を確かめられない。日本語版 Wikipedia「標準基底」は e₁ … と i j k の両方を挙げ、解説に基本ベクトルの文字はない |
| 1 | increase-decrease-table-vs-sign-chart | 日本側 | 日本側の「増減表」が学習指導要領解説にも日本語版 Wikipedia（全文検索を含む）にも出てこない |
| 1 | definite-integral-definition | 日本側 | 日本側（数学II が定積分を F(b) − F(a) で定義する）を確かめられない。解説の数式はテキストに取り出せず、日本語版 Wikipedia に高校の定義の記述がない |
| 1 | evaluation-bar-notation | 日本側 | 日本側（[F(x)]ₐᵇ と書く）を確かめられない |
| 1 | constant-of-integration-remark | 両側 | 日本側（「ただし C は積分定数」と書き添える）と米国側（解答例で where C is a constant を省く）のどちらも確かめられない |
| 1 | substitution-limits-table | 日本側 | 日本側（置換積分で x と t の対応表を添える）を確かめられない |
| 1 | integrable-meaning | 日本側 | 日本側（高校の「積分できる」が原始関数を式で書けることを指す）を確かめられない |
| 1 | accumulation-function-scope | 両側 | 日本側の「定積分で表された関数」が解説・日本語版 Wikipedia にない。AP Calculus の CED に accumulation function の語もない |
| 1 | logic-notation | 日本側 | 日本側（数学I が否定を p̄ と上線で書く）を確かめられない |
| 1 | proposition-vs-condition | 日本側 | 日本側（変数で真偽が変わる文を「条件」と呼ぶ）を確かめられない。解説の「条件」は命題の仮定の意味で出てくる |
| 1 | regular-polygon-area-apothem | 日本側 | 日本側（数学I で外接円の半径から正多角形の面積を求める）を確かめられない。解説は小学校の内容として正多角形を挙げるだけ |
| 1 | base-n-parenthesized-subscript | 米国側 | 米国側（142₅ と括弧なしの添字で書く、in base n と言う）が手元の参照（OpenStax・CED・IM・CK-12・Levin・Nicholson）にない |
| 2 | jp-only-analytic-geometry | 米国側 | 米国側の主張（点と直線の距離の公式などが米国の高校の教科書に出てこない）が参照と合わない。CK-12 Geometry と IM に distance from a point to a line が出てくる。アポロニウスの円・2 円の交点を通る円は日本側も解説で確かめられない |
| 2 | integration-by-parts-u-dv | 日本側 | 日本側（部分積分を ∫f g′ dx = fg − ∫f′g dx の形で書く）を確かめられない。解説は「部分積分法」の名前だけ |
| 2 | acronym-mnemonics | 日本側 | 日本側（展開・演算の順序・部分積分に決まった覚え方がない、sin・cos・tan を筆記体の形で覚える）を資料で確かめられない |
| 2 | half-angle-formula-form | 日本側 | 日本側（半角の公式を 2 乗の形で書く）を確かめられない |
| 2 | perpendicular-slope-condition | 日本側 | 日本側（垂直条件を傾きの積 m₁m₂ = −1 と書く）が解説・日本語版 Wikipedia で見つからない |
| 2 | us-customary-units | 日本側 | 日本側（中 3 の落下の式 y = 4.9x²）が解説・日本語版 Wikipedia で見つからない |
| 2 | velocity-speed-displacement | 日本側 | 日本側の違い（数学II の「瞬間の速さ」が負にもなる、変位は物理の語）を確かめられない。解説の数学III は速度を扱うが、速さとの言い分けは米国と同じで違いにならない |
| 2 | addition-rule-scope | 日本側 | 日本側（数学A の「確率の加法定理」は排反な事象だけを指す）を確かめられない。解説にあるのは「排反」の語だけ |
| 2 | end-of-proof-marker | 日本側 | 日本側（答案の最後に「証明終わり」「終」と書く）を確かめられない。日本語版 Wikipedia「Q.E.D.」は記号 ∎ の説明だけ |
| 2 | identity-matrix-letter | 日本側 | 日本側（単位行列を E と書く）を決められない。日本語版 Wikipedia「単位行列」は En と In の両方が多いと書く |
| 2 | classify-equations-and-systems | 日本側 | 日本側（連立方程式の解を「不定」「不能」と答える）が解説・日本語版 Wikipedia で見つからない |
| 2 | problem-instruction-verbs | 日本側 | 日本側（問題文が「求めよ」「示せ」「図示せよ」で済ませる）を確かめられる資料がない（解説は問題文の書き方を扱わない） |
| 2 | expression-vs-equation-scope | 日本側 | 日本側（日本語の「式」が等式・不等式を含む）を確かめられない（日本語版 Wikipedia に「式 (数学)」の記事がない） |
| 2 | quadrant-roman-numerals | 日本側 | 日本側（第 1 象限〜第 4 象限と算用数字で書く）が解説・日本語版 Wikipedia で見つからない |
| 2 | polynomial-includes-monomial | 日本側 | 日本側（中学が多項式を 2 項以上の和として単項式と区別する）を確かめられない |
| 2 | principal-square-root-includes-zero | 日本側 | 日本側（「正の平方根」が 0 を含まない）を解説で確かめられない |
| 2 | rational-function-scope | 日本側 | 日本側（数学III の分数関数が (ax + b)/(cx + d) の形を中心とする）を確かめられない。解説にあるのは「分数関数」の語だけ |
| 2 | relatively-prime-pairwise | 日米で同じ | 日米で同じ。日本語版 Wikipedia「互いに素」も互いに素と対ごとに素（pairwise coprime）を言い分ける |
| 2 | justification-for-shortcut-formulas | 日本側 | 日本側（受験で 1/6 公式などだけで答えを出す）を確かめられる資料がない |
| 2 | p-value-vs-rejection-region | 日米で同じ | 日米で同じ。高等学校学習指導要領解説の数学B も有意水準と確率 p を比べて帰無仮説を判断する（棄却域の語は出てこない） |
| 2 | sample-variance-n-minus-1 | 日本側 | 日本側（数学I の分散はデータの個数 n で割る）を解説で確かめられない |
| 2 | repeating-decimal-notation | 日本側 | 日本語版 Wikipedia「循環小数」は点と上線の両方を挙げ、日本側の書き方（点を打つ）を決められない。米国側（循環節全体に横線）は OpenStax Prealgebra・Elementary Algebra で確かめた |
| 3 | solution-as-ordered-pair | 日本側 | 日本側（連立方程式の解を x = 2 |
| 3 | y-prime-vs-dy-dx | 日米で同じ | 日米で同じ。日本の解説も y′ と dy/dx の両方を使い（理数数学II の dy/dx = ky）、米国の CED も両方を使う。「授業でどちらが多いか」は資料で確かめられない |
| 3 | summation-index-letter | 日本側 | 日本側（数学B の Σ の添字に k を使うことが多い）を解説で確かめられない |
| 3 | special-right-triangles-by-angles | 日本側 | 日本側（三角定規の形として覚える）が解説・日本語版 Wikipedia で見つからない |
| 3 | area-between-curves-dy-and-parametric | 日本側 | 日本側（数学III で媒介変数表示の曲線で囲まれた面積も同じ積分の単元で扱う）を確かめられない |
| 3 | characteristic-equation-scope | 日本側 | 日本側（数学B の特性方程式が aₙ₊₁ = paₙ + q に対する α = pα + q を指す）を確かめられない。日本語版 Wikipedia「漸化式」の特性方程式は線形漸化式一般のもので、違いにならない |
| 3 | approximately-equal-notation | 日本側 | 日本側（近似を ≒ で書く）を決められない。日本語版 Wikipedia「近似」は ≃・∼・≈・≒ の使い方が分野や著者でまちまちと書く |
| 3 | division-sign-usage | 米国側 | 米国側の主張（÷ は小学校までの記号）が参照と合わない。OpenStax Prealgebra と Algebra and Trigonometry が ÷ を使う |
| 3 | multiplication-sign-usage | 米国側 | 米国側の主張（× はベクトルの外積や次元に使う）が参照と合わない。OpenStax Prealgebra が × を数の掛け算に使う |
| 3 | decimal-point-and-digit-grouping | 日米で同じ | 日米で同じ（小数点と 3 桁区切りのコンマ）。付録 B #10 |
| 3 | handwritten-digits | 両側 | 手書きの数字の形を確かめられる資料がない |
| 3 | handwritten-x-and-z | 両側 | 手書きの x・z の形を確かめられる資料がない |
| 3 | rationalizing-denominators-expectation | 両側 | 日本側（答えの分母を必ず有理化する）と米国側（1/√2 のまま認める講師もいる）のどちらも資料で確かめられない |
| 3 | angle-units-degrees-and-radians | 米国側 | 米国側（Calculus は radians だけを使う）を確かめられない。日米とも弧度法・radian を扱い、違いにならない |
| 3 | reading-f-of-x | 日米で同じ | 日米で同じ（f(x) の記号）。付録 B #26 |

## D. 確かめた主張

- MICASE: ~/Downloads の MICASE フォルダ（.cha 152、0metadata.cdc の DOI 10.21415/QT9V-2J96）。@ID の役割の欄が語、教育の欄が Manual の記号であること（@ID の全 1,759 行を数えた）。CABank 版のフォルダごとの書き起こしの数
- 参照の組み方: Levin は変数を数学用イタリックで組む（𝑃・𝐴 など上位 60 文字を数えた）、IM・CK-12 は行内数式を \( \) で囲む（IM 9–12 で 12,566 行、CK-12 Geometry で 7,132 行）。畳み込み・除去の前後で terms の判定が変わらないこと（decide のレポートの terms の行を比較）
- 規則 2 で決めた記号の根拠の文脈（すべて本文を見た）: OpenStax Prealgebra の比例式の読み方、AP Statistics の CED の the smaller of …（2 標本 t の自由度）、OpenStax Algebra and Trigonometry の n! の定義（the product of … from 1 to n）、Levin 5.1 Sets の記号の読み方（is an element of・the set containing・the Cartesian product・set difference・the power set）、Nicholson の this completes the proof、OpenStax Calculus Volume 3 の vector PQ・a vector with components、IM の … is congruent to triangle … ほか。誤一致として除いたもの（brace ＝筋交い、translate from math notation to words、glossary の arc、the sequence aₙ = … の数式）
- 記号のバッチ 4・5 の形: r squared・p of a・q one・a prime・the critical value・delta・sigma の文脈を 6〜10 件ずつ見た（B の数え方の根拠）
- CK-12 Geometry の記号の書き方の件数（∥ 52・⊥ 52・∠ 1,240・m∠ 399・≅ 414・∼ 165・上線 710・両矢印 50・矢印 39・弧 152・° 1,568）、IM 9–12（∥ 26・⊥ 32・≅ 93・上線 129・両矢印 20）
- 慣習差: 各行の日本側と米国側（出典の note に資料と箇所）。とくに、解説の数学A が条件付き確率を P_A(B) と書くこと、解説に ln・sec・逆三角関数・ロピタル（数学III 本文）・原始関数が出てこないこと、日本語版 Wikipedia「正規分布」の標準正規分布表が P(0 ≦ X ≦ z) の形で N(μ, σ²) と書くこと、「台形」が少なくとも一組の平行、「自然数」が日本の高校課程では 0 を含まないこと、CK-12 の exactly one pair と IM の at least one pair、OpenStax の DNE・vertex form/standard form・‘ac’ method・Cramer's Rule・Descartes’ Rule of Signs、AP Calculus の CED の slope field・average value・separation of variables・topic 4.7
- 取得（ネットワーク）: 学習指導要領解説の PDF 2 つと日本語版 Wikipedia（記事 278、見つからない題名 25、全文検索 18 件）。どれもタイムアウト 30 秒・リトライ 3 回・done/total・キャッシュ（scripts/ledger/fetch_jp_refs.py）。MICASE・英語の参照・コーパスは手元のファイルだけを読んだ

## E. 怪しい点

- **バッチ 5 の ③ が 1 割を超えた（3 ／ 20）のに慣習差に進んだ**。記号の最後のバッチで次の記号のバッチがなく、指示 5 は「記号が終わったら慣習差」なので、止める規則は記号のバッチの間の規則と読んだ（慣習差には ③ がない）。止めるべきだったなら、慣習差の 3 コミット（10257de・712886a・19983bc）を戻せば記号までの状態になる
- **「③」を規則 2 の後で数えた**（人間レビューに回るもの）。コーパスだけの ③ はバッチ 4 が 12 ／ 50、バッチ 5 が 7 ／ 20 で、どちらも 1 割を超える。前のレポートの「③ の一覧」も人間レビュー行きの一覧だったので揃えたが、指示の意図がコーパスの ③ なら、バッチ 4 の後で止めるべきだった
- **CED は 1 件でも読みを決める**（terms と同じ数え方）。そのため proportion-colon は CED の類推の文（function is to first derivative as …）1 件で決まった（比例式の読みの本文は OpenStax Prealgebra の 14 件で、読みは同じ a is to b as c is to d）。max-min-notation は CED の the smaller of … 2 件で the larger of a and b が standard になり、話し言葉で多い the maximum of a and b は spoken になった
- **product-pi-notation は OpenStax の 3 件（ちょうど下限）で決まった**。3 件とも n! の定義（1 から n までの整数の積）で、∏ の記号そのものを読む文ではない
- **matrix-brackets は Nicholson の数式（the matrix の後に並ぶ成分）で決まった**。成分は数なので読みと同じ並びになると見たが、印刷された数式を読みとして数えた例外に近い（sequence-braces・polar-form-cis では数式を読みとして数えていない）
- **字形の読みとして数えた件数には別の意味が混ざる**: r squared（πr²・円の式）、P of A（多項式 p(a)）、A prime（微分 a′(t)）、Q one（MIT 18.06 の直交ベクトル）、sigma（MIT 18.06 の Σ を除き切れていない分）、the critical value（MIT 18.01 の微積分の意味 4 件）。判定は変わらない（どれも首位か唯一）と見たが、evidence の件数は記号の意味だけの件数ではない
- 慣習差は **50 行（41%）を外した**。多くは日本の教科書・答案の習慣（増減表、判別式の D の書き方、「証明終わり」、三角定規、分母の有理化ほか）で、学習指導要領解説と日本語版 Wikipedia では確かめられなかった。日本の教科書（検定教科書）を資料に加えれば戻せる行が多い
- 慣習差の日本側の多くを日本語版 Wikipedia で確かめた。記事は教科書ではないので、文は「日本語版 Wikipedia「…」は…と説明する」と記事を主語にした。「解説に出てこない」も解説が教科書の全内容を挙げるわけではない点に注意（例: 解説には「判別式」「互いに素」「全体集合」も出てこない）
- 解説の PDF のテキストは上付き・上線・分数が落ちる（Ā・σ²・F(b) − F(a) が取り出せない）。記号の形はテキストで確かめられないので、その部分は日本語版 Wikipedia で確かめるか外した
- MICASE の話者の振り方: 役割の語が Teacher・Student 以外の人（Speaker・Audience・Member ほか 546 行）は記号で振った。colloquium の Audience／JF を教員にするなど、場面での立場と違う可能性がある（phrases の件数は MICASE 全体を 1 ソースで数えるので判定には効かない。stats.json の内訳だけに効く）
- office-hours-stuck-at-step の話し言葉 ① walk … through は、MICASE の中でも教員の発話（let me walk you through ほか）が学生と同じだけある。学生の言い方としては i don't see how（学生 6・教員 0）の方が近い。phrases の生成で要の部分を見直す（decide の「食い違い 2」はこの 2 件）
- conditional-probability-subscript-jp の件数は conditional-probability-bar と同じ（同じ形 the probability of * given * で数えた）
- 記号の related を足したことで、記号のファイル 47 個が変わった（related だけ）

## F. 次に要ること

- 記号の ③ 8 件の人間レビュー（A-2 の 5 件と C-1 の 3 件）
- 慣習差の外した 50 行: 日本の検定教科書を資料に加えるかどうか（加えるなら出典の形を決める）
- phrases の生成（MICASE 込みで要の部分を見直す。class-asking-repeat・office-hours-stuck-at-step）
- 止める規則の読み方（E の 1・2 つ目）の確認

## G. 確認（合否はすべて終了コード）

```
pnpm exec tsc --noEmit        # exit 0
pnpm validate                 # exit 0。terms 1,540 ／ symbols 220 ／ phrases 5 ／ conventions 71 ／ curriculum 163、警告 0
pnpm spell                    # exit 0。2,007 ファイル、0 件
pnpm test                     # exit 0。149/149（4 ファイル。記号の規則 2 と参照の読み方で 6 を足し、MICASE のテストは実データの形に書き直した）
pnpm build                    # exit 0。1,539 ページ。export: symbols.json 211（draft 9 を除く）、conventions.json 71
pnpm corpus:fetch:micase -- ~/Downloads/MICASE   # exit 0。152/152
pnpm corpus:count && pnpm corpus:decide -- --write --ids <各バッチの記号>
                              # 各回 exit 0。最後の decide: 主見出し 1,225 ／ 併記 171 ／ 英語に決まった言い方がない 76 ／ 参照 313 ／
                              # 判断不能 9（symbols 8・terms 1）／ 食い違い 2（phrases。書き戻していない）／ 直すこと 0
python3 scripts/ledger/fetch_jp_refs.py          # exit 0（all、wiki、search の 3 回。2 回目以降は足りない分だけ）
```

- 各バッチのコミット前にも tsc・validate・spell・test を回し、すべて exit 0 を確かめた（バッチ 5 と慣習差 1 の spell は最初 exit 1: evidence の形の pqrs・wxyz と、loga・ΔABC。辞書に足すか書き方を直して exit 0）
- `pnpm crosscheck` は terms を変えていないので回していない（terms で変えたのは coordinate-rule の evidence と flag の件数 18 → 16 だけ）
