# Phase 2 レポート（中学の単元 1）— 1〜4 を直し、Khan の中学の字幕を足して全語を数え直した。生成はバッチ 0 で区切った

作成: 2026-09-25 ／ 対象: 1ea16e0（Phase 2 geometry / discrete 3 report）→ 本コミット
指示: audits/phase2-geometry-discrete-3-report.md を受けた 1〜5。判断は `docs/DECISIONS.md` の「Phase 2 中学の単元の前の修正」と「Phase 2 中学・Algebra 1／2・Pre-Algebra の単元」。

**これはエントリを生成したのと同じ系列の作業の自己点検です。** 監査（Phase 5）は別セッションで行う（CLAUDE.md 絶対ルール 8）。verified に上げた語はない。

## まとめ

- **1〜4 はすべて終えた**（本コミット）。4 の後に全語の corpus:count → corpus:decide -- --write をやり直し、register の食い違い 13 語を直した（不一致 0、直すこと 0）
- **5（最後の単元の生成）は、途中で「キリがいいところで止めて」と指示があったので、バッチを 1 つもコミットせずに止めた**。先にやった準備: 台帳の残り 654 行に今までの規則を当てて 381 行にした（fix_decisions.py PHASE2G_*、手順 15。これは本コミットに入っている）。バッチ 1〜4（200 語）の本文の下書きと、バッチ 1〜5 の見出しの案・候補表現は作ってあるが、コミットしていない（K）
- 人間レビュー行きの ③ は **15 → 5**（terms 10 → 0、phrases 5 のまま）。terms の 10 語と、あなたが決めた 2 語は corpus-human-settled にした
- **Khan の中学の字幕: 868 本、602,794 語**（882 本のうち人手の英語字幕が無かったのは 14 本）
- **判定が変わった既存の語**（件数だけの変化を除く）: 人間が決めた 12・register を直した 13・参照から用例コーパスの決着に変わった 9・その他 2（C）。evidence が変わった既存の語は 212
- **件数を書いた本文の書き直しは終えていない**: evidence が変わった 212 語のうち、本文に件数を書いた語が 123（H・K）
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて緑（L）

## A. 1〜4 の結果

### 1. 規則 1 の例外の「3 件以上」の数え方

- 参照ごとに、同じ候補の形（by AAS ／ AAS congruence ／ (AAS) congruence ほか）を足し合わせて数える。別の候補同士、別の参照同士は足さない
- **形はもとから 1 つの正規表現の選択肢（TERM_FORMS の「A | B」）として数えていたので、候補の件数は形の件数の和になっていた**。aas-congruence の CK-12 は、AAS の形が 2 件（(AAS) congruence 1 ＋ AAS triangle congruence 1）、angle-angle-side の形が 2 件（angle-angle-side (AAS) congruence 1 ＋ angle-angle-side theorem 1）。どちらも 3 件に届かないので、**aas-congruence は「英語に決まった言い方がない」のまま**
- 「英語に決まった言い方がない」65 語の全候補を、形ごとに別々に数えて足した数でも確かめた（IM・CK-12・Nicholson・Levin・OpenStax）。1 つの正規表現で数えた数と全部一致し、3 件に届く参照は無かった。**判定が変わった語は無い**
- lib.ts REFERENCE_NAMED の注と単体テスト（3 つの形が 1 つの参照で 3 件なら例外、2 形 ＋ 別の候補 1 件では例外にならない）で固定した
- CK-12 4.15 の節の名前「ASA and AAS」と本文の AAS (Angle-Angle-Side)・use AAS・For AAS は、どの形にも当たらないので数えていない（H）

### 2. あなたの決めた 2 語（corpus-human-settled、register は主張しない）

| id（指示の名前） | 変更 |
|---|---|
| proof-by-cases（指示の proof-by-exhaustion。場合分けによる証明） | en.term を proof by cases、en.alt に proof by exhaustion・case analysis。例文 2 文を proof by cases に直した。mapping_note に英語版 Wikipedia の記事名が Proof by exhaustion（proof by cases はそのリダイレクト）であることを残した |
| lexicographic-order（辞書式順序） | en.term を lexicographic order（英語版 Wikipedia の記事名）、en.alt に alphabetical order・dictionary order。mapping_note の頭に見出しの出どころを足した |

### 3. 残った ③

| id | 数え直し | 結果 |
|---|---|---|
| flowchart-proof | flow proof・flow diagram proof・flow chart proof を足した | 用例コーパス・参照（CED・OpenStax・IM・CK-12・Nicholson・Levin）とも全部 0 件。指示どおり en.term flowchart proof・en.alt flow proof。flow diagram proof は候補に残さず pitfalls に 0 件と書いた |
| same-side-exterior-angles | consecutive exterior angles（もとから en.alt） | 全部 0 件。そのまま |
| symmetric-property | symmetric property of equality ／ of congruence の形（TERM_FORMS に足した） | 全部 0 件。そのまま。**K12 LibreTexts の CK-12 Geometry には 2.13・2.14（等式・合同の性質の節と思われる）が無い**（2 章のページが 2.01〜2.12 と 2.15 しか並べず、2.13 の URL は 404）。pitfalls に書いた |
| reflex-angle | — | そのまま。mapping_note「米国の高校課程（CED・OpenStax・IM・CK-12）ではほぼ扱わない（reflex angle は CED・OpenStax・IM・CK-12 とも 0 件。CK-12 Geometry は 180° より大きい角を凹多角形の説明で 2 回言うだけで、名前は付けない）」 |
| existence-proof | — | そのまま。mapping_note「英語版 Wikipedia の Constructive proof（existence proof のリダイレクト先）は構成的証明で、別の概念」 |
| perpendicular-postulate・triangle-proportionality-theorem・undefined-terms・circumscribed-polygon・extended-euclidean-algorithm | — | そのまま（circumscribed-polygon の pitfalls の「人間レビュー待ち」を消した） |

10 語すべて corpus-undecided を外して corpus-human-settled にした（register は主張しない）。phrases の 5 件は Phase 3 で扱うので触っていない。

### 4. 話し言葉コーパスに Khan Academy の中学のコース

| source id | 再生リスト | 動画 | 人手の英語字幕 | 語数（重複除去の前） |
|---|---|---|---|---|
| khan-middle | 6th Grade の単元 8・7th Grade 7・8th Grade 6・Pre-Algebra 9、IM に揃えた 6th ／ 7th ／ 8th grade のコース 3（計 33 本） | 882 | **868**（14 本は無し） | **602,794** |

コース別（再生リストの順に最初に出た方に数えた）:

| コース | 本数 | 語数 |
|---|---|---|
| 6th grade | 189 | 122,565 |
| 7th grade | 210 | 137,467 |
| 8th grade | 212 | 164,127 |
| Pre-Algebra | 257 | 178,635 |

- 取得は `pnpm corpus:fetch:captions -- khan-middle`。khan-algebra と同じく人手の英語字幕だけ（en ／ en-US ／ en-<11 文字のトラック ID>。機械翻訳 en-xx と自動字幕は取らない）。自動字幕 0 本
- 全リクエストに socket timeout 30 秒・process timeout 120 秒・リトライ 3 回、進捗 done/total、再生リスト・字幕・字幕なしの動画をキャッシュ（再実行は足りない分だけ取る）。失敗 0
- ほかの Khan ソースの再生リストにある 65 本は取らない（leaveTo）。古い「Pre-algebra」再生リスト（39 本、27 本は Pre-Algebra の単元と重複、残りは (old) の付いた古い版）は取らなかった
- 4 コースを 1 つのソース khan-middle にした（khan-algebra と同じ。ほぼ同じ講師なので、分けると 1 ソース頼みの判定が甘くなる）。重み付けは今までどおりで、khan-middle の比率は 25% より小さく係数 1.00
- 話し言葉の Khan は 4 ソースになった（CLAUDE.md・PLAN 15・fetch.ts を直した）

## B. 数え直しの前と後

| | 前（1ea16e0） | 1〜4 の後（本コミット） |
|---|---|---|
| 主見出し決着 | 789 | 798 |
| 併記 | 100 | 103 |
| 英語に決まった言い方なし | 65 | 65 |
| 参照で見出しを決めた | 234 | 223 |
| 人間が決めた | 29 | 41 |
| 判断不能（人間レビュー行き） | 15（terms 10・phrases 5） | **5（phrases 5）** |
| register 不一致 | 0 | 13 → **0**（C） |
| 直すこと | 0 | 0 |

用例コーパスの話し言葉で 1 ソース頼み（抜くと判定が変わる）の語は 561（decide の報告）。中学の語の多くは khan-middle 頼みになる（H）。

## C. 判定が変わった既存の語

| 変化 | 語数 | 語 |
|---|---|---|
| ③ 人間レビュー → 人間が決めた（3） | 10 | flowchart-proof・same-side-exterior-angles・symmetric-property・reflex-angle・perpendicular-postulate・triangle-proportionality-theorem・undefined-terms・circumscribed-polygon・extended-euclidean-algorithm・existence-proof |
| 参照 → 人間が決めた（2） | 2 | proof-by-cases（Wikipedia）・lexicographic-order（OpenStax） |
| 書き言葉だけの ① → 話し言葉でも ①（register を both に） | 8 | bar-chart・binomial-coefficient・cubic-units・decimal-system・divisibility・image・prime-factorization（話し言葉 102 件のうち 101 件が khan-middle）・repeating-decimal |
| 話し言葉の首位が変わった・② に並んだ（register を直した） | 4 | box-plot（話し言葉 ② box-and-whisker plot 19 ／ box plot 14）・segment（話し言葉 ② に line segment）・simplify-radicals（話し言葉 ① simplify radicals を variant に）・system-of-linear-equations（話し言葉 ② linear system 41 ／ system of linear equations 23） |
| 参照 → 用例コーパス（話し言葉 ①、register を spoken に） | 9 | base-n・dilation（collocation の center of dilation を外した。後のバッチの行）・equal-angles（congruent angles）・hexadecimal・negate・**negative-correlation（en.term を negative linear relationship に。話し言葉 12 件、首位だけが 10 件以上）**・rigid-motion（rigid transformation）・scale-factor・straight-angle |
| 併記と主見出しの入れ替わり（register の食い違いは無し） | 2 | point-of-intersection（話し言葉 ② → ①）・rectangular-coordinates（話し言葉 ① → ②） |

## D. 最後の単元の準備（5。本コミットに入っているもの）

### 台帳の残りの行に今までの規則を当てた（fix_phase1.py 手順 15、fix_decisions.py PHASE2G_*）

654 行 → **381 行**。同じ概念 100、節の名前 28、引数を入れただけの行・コロケーション・課題 132、改名 7、phrases の候補へ 9、範囲外 4。

- 主な統合: 代入 → substitute、移項 → move-term-to-other-side、平方完成する → completing-the-square（どれも既存エントリの ja.alt に同じ語がある）、〜を x とする → let-u-equal、式を立てる・文字を使って表す → 式で表す（英語はどれも write an equation）、道のり → distance、割合 → 百分率（percent。割合に当たる 1 語が英語に無く、数えられる候補が percent of などしかない）、垂線 → perpendicular-lines（英語はどちらも perpendicular line(s)）、比例関係 → 比例、inverse variation → 反比例、連立方程式 → system-of-linear-equations、inconsistent system → 解なし、dependent system → 解が無数、表・裏 → 硬貨、ac 法・ボックス法 → たすき掛け、拡大・縮小 → dilation、根・零点 → zeros-of-a-polynomial、穴 → removable-discontinuity、再帰的公式 → recurrence-relation、等比数列の和・等差数列の和・シグマ記法・底の変換・放物線の焦点など US の行を既存エントリへ
- 改名 7: **台帳の 1 行の id が「x > 2}。日本では「条件で表す」」になっていた**（Phase 1 の seed の note「{x | x > 2}」を区切りの「|」で切っていた）ので set-builder-notation に直した。ほかに base → base-of-a-power、satisfy-the-equation → satisfy、pass-through-a-point → pass-through、measure-the-length → measure、similar-figures → similar、four-points-are-concyclic → concyclic
- phrases の候補へ 9（省略する・順に・仮定より・〜より・よって・ゆえに・それぞれ等しい・図形を分ける・平方して足す）。範囲外 4（時間・関係・制動距離・値引き）
- 既存のエントリの行に統合した行があっても、既存の行の source・記事は変えない（統合した行の記事が別の概念のことがある: 零点 → Zero (complex analysis) を zeros-of-a-polynomial に持ち込んでいた）
- 統合で単元の増えた既存の語 88 を data/curriculum の term_refs に足した（33 単元）。wikihead.py をやり直した（1,539 行中 1,217 に記事、689 が使える）

### 数え方の直し

- **TERM_FORMS の形に複数形だけの語を置かない**。語形変化をまとめて数えるので、複数形は単数・過去形にも当たる（cubes は x cubed に、constants は bare の constant に）。準備中に気づき、単体テストと STYLE 追記欄に書いた。本コミットの TERM_FORMS には、まだエントリの無い中学の語（バッチ 1〜4）の形も入っている（エントリが無い間は使われない）
- 字幕の left hand side ／ right hand side ／ cross multiply ／ same side interior（CK-12 の Same Side Interior Angles）を、ハイフン付きと同じ言い方として数える（VARIANTS）

## E. 生成（5）

**生成語数 0（likely 0 ／ draft 0）。③ の一覧も無し。** バッチ 1〜6 はコミットしていない。

止めた時点で出来ていたもの（コミットしていない。corpus/drafts/phase2-middle/ に置いた。corpus/ は gitignore）:

| バッチ | 範囲（中学の学年順） | 見出しの案（spec） | 候補表現 | 本文の下書き |
|---|---|---|---|---|
| 1 | 中1 正負の数（40）・文字と式の前半（10） | あり | あり（部分コーパスで probe 済み） | 50 語、読んだ |
| 2 | 中1 文字と式の後半・一次方程式・比例と反比例 | あり | あり | 50 語、読んだ |
| 3 | 中1 平面図形・空間図形 | あり（仮） | あり | 50 語、読んだ |
| 4 | 中1 空間図形の残り・データ・中2 式の計算・連立方程式・一次関数 | あり（仮） | あり | 50 語 |
| 5 | 中2 一次関数の残り・平行と合同・三角形と四角形・確率 | — | あり（probe 済み） | — |

下書きを読んで直すと決めていたこと（次のセッション向け）: 米国の授業についての主張は件数で確かめた範囲に絞る（commutative property of addition 31 件・of multiplication 13 件、distribute the 話し言葉 161 件、Quadrant I〜IV は書き言葉の書き方で話し言葉は first quadrant が多い、OpenStax は ≥ を使う）、cross-multiply の例文の日本語を分数の形にそろえる、球 ／ sphere を near にする、速さ・濃度の問題の例文を問題文にする、ほか。見出しは全部のコーパスで probe し直してから決める（下書きの一部は部分コーパスで決めた仮の見出しを使っている）。

## F. 確かめた主張

- Khan Academy のチャンネルの再生リスト一覧（543 本）から中学のコースを特定した: 6th Grade 8・7th Grade 7・8th Grade 6・Pre-Algebra 9 の単元再生リストと、6th grade (Illustrative Mathematics-aligned)・7th ／ 8th grade math (IM® v.360 aligned)。IM に揃えた 3 本は単元再生リストと動画が重ならない（130 本）
- 規則 1 の例外: 65 語の全候補を形ごとに数えた数と 1 つの正規表現で数えた数が一致すること（A-1）
- reflex angle の件数（CED・OpenStax・IM・CK-12 の本文を grep。CK-12 の reflex 18 件はすべて reflexive）
- CK-12 Geometry の 2.13 が 404 であること（curl）
- 下書きの主張の件数（E に挙げたもの）

## G. 決めたこと（あなたの指示の外）

1. khan-middle を 1 ソースにした。ほかの Khan ソースと重なる 65 本と古い Pre-algebra 再生リストを取らなかった
2. 台帳の残りの行の統合（D）。とくに割合 → 百分率、式を立てる → 式で表す、垂線 → perpendicular-lines は、英語で数え分けられないことが理由
3. 参照で決めていた 9 語が話し言葉で ① になったので register を spoken にし、negative-correlation の en.term を negative linear relationship に変えた（規則 1 が先）
4. 「キリがいいところで止めて」を受けて、1〜4 のコミットとこのレポートで区切った。5 のバッチは 1 つもコミットしていない

## H. 怪しい点（Phase 5 の監査へ）

- **件数を書いた本文が古いままの既存の語が 123 ある**（evidence は新しい）。register を直した語の variants の note と negative-correlation の pitfall だけ直した。次のセッションで件数表どおりに直す（前回の 218 語と同じ手順）。一覧: adjacent-angles・all・approaches・arithmetic-mean・assume・bar-chart・base-n・base-of-the-natural-logarithm・be-inscribed-in・be-skewed・binary・binomial-coefficient・box-plot・categorical-variable・compare・conditional-statement・congruent・constant-of-integration・counterclockwise・counterexample・counting・cryptography・cubic-units・data・decimal-system・degree-measure・differentiate・dilation・divisibility-rules・divisibility・double-count・element・elementary-event・enumeration・equal-angles・equality-holds・equation-of-a-line・equivalent・evaluate・exist・expected-value・experimental-probability・factored-form・find-a-common-denominator・find-the-equation・fractional-part・general-multiplication-rule・general-term・greatest-common-divisor・hexadecimal・histogram・image・is-monotonically-increasing・isosceles-triangle・laws-of-exponents・leading-digit・least-common-multiple・left-hand-limit・lexicographic-order・limit・magnitude・measure-of-center・midpoint・move-term-to-other-side・mutually-exclusive-events・necessary-and-sufficient-condition・negative-correlation・negative-exponent・net-change・number-line・number-of-digits・occur・opens-upward・order-matters・overestimate-and-underestimate・phase・place・point-of-intersection・polynomial-division・population・positive-correlation・predict・prime-factorization・proposition・prove・random-number・random-sampling・rational-exponent・rectangular-coordinates・reduce・region・regression-line・relatively-prime・remainder・right-hand-limit・rigid-motion・scale-factor・scatter-plot・segment・select-at-random・simplify-radicals・simulation・sketch・solution・spread・square-units・standardize・statistical-hypothesis・statistical-variable・straight-angle・substitute-new-variable・substitute・supplementary-angle・survey・system-of-linear-equations・take-the-average・test-point・transitive-property・translation・transversal・trial・value-of-the-function・zero-exponent
- 中学の語の話し言葉の決着の多くは khan-middle 1 ソース頼みになる（prime-factorization は 102 件中 101 件、dilation は 40 件中 39 件）。抜くと ③ になるだけなので規則どおり ① のまま
- negative-correlation の話し言葉の首位 negative linear relationship は Khan Academy だけ（AP Statistics 8・中学 4）。書き言葉と CED は negative correlation
- aas-congruence は形を足しても 2 件のまま。CK-12 の節の名前 ASA and AAS や AAS (Angle-Angle-Side) の書き方を形に入れれば 3 件を超えるが、形を件数に合わせて広げることはしなかった（前回と同じ）
- 台帳の統合の判断（D）は私の判断。割合を百分率に寄せたので、割合の説明は百分率の mapping_note に書く予定
- 前の単元の TERM_FORMS に、複数形だけの形が残っていないかは全部は見ていない（このセッションで作った形だけ直した）

## K. 残りの行数と次のセッション

**台帳全体の残り: 1,539 行中 381 行**（エントリ 1,158）。中学 310（中1 164・中2 89・中3 57）・Algebra 1／2 62・Pre-Algebra 6・Integrated Math 3。数B の 1 行（近似）は近似値に統合した。

次のセッションで同じ指示から再開するときは、1〜4 は済んでいる。先にやること:
1. H の 123 語の件数を書いた本文を新しい件数に直す（evdiff・件数表は corpus/drafts/phase2-middle/ の evdiff.py・facts.py）
2. バッチ 1 から: 全部のコーパスで probe し直し（gen_probe.ts が spec と TERM_FORMS から probe の候補を作る）、見出し・register・variants を決め、下書き（bodies）を読み直して E の直しを入れ、build_entries.py で書き出す。スクリプトの一時ファイルのパスはこのセッションの scratchpad を指しているので直して使う

## L. 確認

```
pnpm corpus:fetch:captions -- khan-middle   # 882 本、字幕あり 868・無し 14、失敗 0。自動字幕 0
python3 scripts/ledger/fix_phase1.py         # 手順 15: 同じ概念 100・節の名前 28・引数 132・改名 7・phrases 9・範囲外 4
python3 scripts/ledger/wikihead.py           # 1,539 行中 1,217 に記事、689 が使える
pnpm corpus:count && pnpm corpus:decide -- --write
                                             # 主見出し 798 ／ 併記 103 ／ 決まった言い方なし 65 ／ 参照 223 ／ 人間が決めた 41 ／ 判断不能 5 ／ 不一致 0 ／ 直すこと 0
pnpm exec tsc --noEmit                       # 緑
pnpm validate                                # terms 1,158、警告 0
pnpm spell                                   # 0 件
pnpm test                                    # 117/117
pnpm build                                   # 緑。export: terms.json 1,147（draft 11 を除く）
```
