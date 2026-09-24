# Phase 1 修正 4 レポート — 曖昧さ回避の例外・記号のワイルドカード・register の付け直し・コーパス全量

作成: 2026-09-24 ／ 対象: 6f6880b → 本コミット ／ 手順: `pnpm corpus:fetch:notes` と `pnpm corpus:fetch:captions`（1 つのバックグラウンドジョブで並列。途中で 1 回止めて再開、A-3）→ `python3 scripts/ledger/fix_phase1.py` → `pnpm corpus:count && pnpm corpus:decide -- --write`

## まとめ

- **決定 1（曖昧さ回避）**: † の 5 件を `fix_decisions.py` の新しい表 `EN_CHECK_WRONG` で外した。title 行 ok **166 → 161**。台帳で変わったのはこの 5 行だけ（B）
- **決定 2（定積分）**: 候補表現を the integral from * to * of にした。話し言葉は **③（3 件）→ ①（246 対 11、22.4:1）**。記号の written は「対象外」として数えず、判定もしない
  - 途中で分かったこと: DECISIONS・HANDOFF が前提にしていた `countPattern` は、**どのコミットのコードにも無かった**（HANDOFF の 1 行だけ）。今回 `lib.ts` に実装した（C）
- **決定 3（移項）**: from both sides ／ to both sides を both にした。修正 3 の register 不一致は解消
- **決定 4（使い分けの note）**: 代入・移項の variants の note に、ソース別の件数から分かる使い分けを自作の文で書いた。YouTube を入れたあとの件数で書いたので、あなたの整理と少し違う点がある（D）
- **決定 5（コーパス全量）**: **12 → 19 ソース、重複除去後 357 万 → 520 万語**（話 322 万 ／ 書 198 万）。取得 1,422 本・109 PDF、最終的な失敗 0（A）
- **決定 6**: PLAN.md 15 と SOURCES.md の OpenStax のライセンスを CC BY-NC-SA 4.0 に直した。PHASE1-HANDOFF.md にも同じ誤りがあったので直した
- **決定 7**: `tsc --noEmit` が緑。decide.ts の型エラーのほかに、src/lib/data.ts の `import.meta.glob` で 6 件のエラーがあった（`src/env.d.ts` を追加して解消）
- **再判定**: 11 件中 **8 件で判定か比が変わり**、そのうち判定そのものが変わったのは 3 件（E）
- **人間レビューに残るもの: 0 件**（③ 0 ／ register 不一致 0）
- `tsc --noEmit`、`pnpm validate && pnpm spell && pnpm test && pnpm build` はすべて緑（test 45/45、build 21 ページ、export まで）

## A. 取得（決定 5）

### A-1. ソースごと

| ソース ID | 対象 | 取得 | 字幕の種類 | 語数（生） | 重複除去後 |
|---|---|---:|---|---:|---:|
| khan-algebra | 再生リスト 3 本 → 動画 217 本 | **217/217**（キャッシュ 182 ＋ 新規 35） | 人手 | 202,704 | 198,864 |
| khan-ap-calc（既存） | 再生リスト 25 本 → 動画 544 本 | 544/544（全部キャッシュ） | 人手 | 565,883 | 559,104 |
| khan-ap-stats | 再生リスト 13 本 → 動画 166 本 | **166/166** | 人手 | 167,671 | 167,275 |
| yt:profleonard | 講義 826 本から 100 本 | 96/100（字幕なし 4） | 自動 96 | 509,207 | 498,333 |
| yt:organicchem | 再生リスト 7 本・565 本から 100 本 | 99/100（取得不可 1） | 自動 99 | 169,550 | 169,550 |
| yt:patrickjmt | 再生リスト 26 本・471 本から 100 本 | 100/100 | 人手 5 ／ 自動 95 | 91,208 | 91,208 |
| yt:nancypi | 2 分以上の全動画 42 本 | 42/42 | 人手 42 | 77,731 | 77,485 |
| yt:blackpenredpen | 再生リスト 43 本・601 本から 100 本 | 82/100（字幕なし 11、取得不可 7） | 人手 11 ／ 自動 71 | 93,872 | 93,872 |
| yt:3blue1brown | 再生リスト 6 本・53 本 | 53/53 | 人手 49 ／ 自動 4 | 234,672 | 234,618 |
| mit-notes（written） | OCW 4 科目の講義ノート 109 PDF | **109/109** | — | 482,328 | **278,411** |

- **khan-algebra**: 元の再生リスト URL はどこにも記録が無かった。キャッシュ 182 件のファイル名（yt-dlp の `%(title).80B`。80 バイトで切ってから `|` → `｜` に置き換える）を、Khan チャンネルの再生リストの動画タイトルと照合して特定した: *Algebra I ｜ High School Math*（100）、*Algebra II ｜ High School Math*（100）、*Linear equations and inequalities ｜ Algebra Basics*（35）。重複を除くと 217 本で、**キャッシュの 182 件は全部一致した**。キャッシュのファイルは `<動画 ID>.txt` に付け替え、manifest の同じ位置で置き換えた（dedupe が manifest 順に写しを判定するため）。残りの 35 本は新しい字幕言語（en ／ en-US ／ en-<トラック ID>）で**全部に人手字幕があった**。修正 3 の「最大 53 本の取りこぼし」は 35 本だった（53 は重複を含む 235 − 182）
- **khan-ap-stats**: チャンネルの一覧に出る AP Statistics の単元再生リスト 13 本（3 単元は新旧 2 本）。ID が 13 文字の `PLMKj04Mp417E` は通常の再生リストではないので入れていない
- **YouTube 6 チャンネル**: 数学の再生リストだけを対象にした（Professor Leonard はチャンネルに再生リストのタブが無いので、Calculus 1–3 ／ Intermediate Algebra ／ Precalculus ／ Statistics ／ Differential Equations をタイトルに含む 10 分以上の動画）。**1 チャンネル最大 100 本**を、一覧の中に均等に散らして選んだ。Leonard だけで 1,216 本・602 時間あるため。結果は最大の Leonard でも全体の 9.6% で、重み付けの上限 25% には届かない（全ソースの係数 ×1.00）
- **mit-notes**: 18.01（Fall 2006）・18.02（Fall 2007）・18.03（Spring 2010）の lecture notes と 6.042J（Fall 2010）の course text。18.06 には公開ノートが無い（Strang の教科書を使う科目）。PDF は pdftotext で文章化し、合字（ﬁ・ﬀ。"diﬀerentiate" のままだと数えられない）は NFKC で戻した。**109 ファイル中 48 が写しとして落ちる**: 18.01 のページは各回のノートと単元のまとめ PDF の両方にリンクし、6.042 のページは全文 PDF と各章の PDF の両方にリンクしている。重なりは dedupe に任せた

### A-2. 上限・進捗・キャッシュ

- yt-dlp: ソケットタイムアウト 30 秒、プロセスタイムアウト 120 秒、リトライ上限 3 回（429 は 60 秒×回数待つ）、動画の間は 1.5 秒。**3 本続けて失敗したらそのソースを止める**（A-3 のあとに追加）
- OCW（ノート）: タイムアウト 30 秒、リトライ上限 3 回、リクエストの間は 0.15 秒
- 進捗は全体と各ソースの done/total（`[captions] 1400/1422  yt:3blue1brown 31/53 (...)`、`[notes] 57/109 ...`）。報告は全体の 100 本ごと
- キャッシュ: 動画の一覧は `corpus/<dir>/playlists/`、字幕は `<動画 ID>.txt`、字幕なし・非公開は `state.json`、自動字幕の ID は `auto.json`。ノートは PDF の一覧を `mit-notes/index/`、PDF を `raw/`、文章を `<科目>-<名前>.txt`
- **もう一度流して取得 0 件**を確かめた（1,422 本すべてキャッシュか state、ノート 109 件すべてキャッシュ）。`corpus:fetch --check` は 2,432 ファイル・欠け 0
- manifest は書くたびに読み直し、一時ファイルに書いて rename する（並列の 2 本が互いの行を消さず、読みかけの壊れた JSON も読まない）。ジョブの最後にノート側をもう一度流して merge を確かめた

### A-3. 429 と再開

YouTube に入った 1 本目（Leonard）で自動字幕の `en` が **429 を 3 回続けて**返した。1 本ごとにリトライで 6 分待つと 600 本で数十時間かかるので、ジョブを止めて調べた。同じ動画の `en-orig`（元の音声認識トラック）は問題なく取れた。自動字幕の `en` は翻訳版の扱いで、負荷がかかると 429 を返す。直したこと:

1. 自動字幕は `en-orig` だけを要求する。人手の `en` は、動画に人手の `en` がある時だけ 2 回目のリクエストで取る
2. 3 本続けて失敗したらそのソースを止める（残りは再実行で埋まる）

再開後のリトライは 0 回。止める前に取り終えていた Khan の 3 ソースはキャッシュから読んだ。

## B. 決定 1: 曖昧さ回避経由の 5 件を外す

`fix_decisions.py` に `EN_CHECK_WRONG`（id → 理由）を足し、`fix_phase1.py` の英語照合では「曖昧さ回避ページ経由で ok になる行」のうちこの表にある行を不一致にする。曖昧さ回避の規則そのものは変えていない。

| id | 見出し | ja 記事 → en langlink | 外した理由（表に書いた文） | source |
|---|---|---|---|---|
| substitution | 代入 | 代入 (論理学) → Substitution (logic) | 論理式の置換。式への値の代入ではない | wikipedia-langlink → **editorial** |
| pole | 極 | 極 (複素解析) → Zeros and poles | 複素関数の極。極座標の極ではない | wikipedia-langlink → **editorial** |
| diverge | 発散する | 発散 (ベクトル解析) → Divergence | ベクトル場の発散（div）。数列・級数の発散ではない | editorial のまま |
| similarity-transformation | 相似変換 | 行列の相似 → Matrix similarity | P⁻¹AP。図形の相似変換ではない | textbook のまま |
| characteristic-equation | 特性方程式 | 固有多項式 → Characteristic polynomial | 行列の特性多項式。漸化式の特性方程式ではない | editorial のまま |

5 行とも wiki_ja ／ wiki_en ／ wikidata を空にし、ja_basis を editorial、ja_check を —、flag を wiki-rejected にした。note に理由を書いた。

| | 修正 3 | 修正 4 |
|---|---:|---:|
| title 行 → ok（うち曖昧さ回避経由） | 166（24） | **161（19）** |
| title 行 → wikipedia を外した | 92 | **97**（別の記事 43 ／ en.term の記事なし 27 ／ en.term は曖昧さ回避 13 ／ ja 記事に en 版なし 9 ／ **別概念（曖昧さ回避経由）5**） |
| ja.basis: mext ／ wikipedia ／ editorial | 363 ／ 468 ／ 1526 | 363 ／ **463** ／ **1531** |
| source: wikipedia-langlink ／ editorial ／ textbook ／ wikidata | 312 ／ 1237 ／ 641 ／ 167 | **310** ／ **1239** ／ 641 ／ 167 |
| flag wiki-rejected | 205 | **210** |

## C. 決定 2: 定積分の候補表現と `countPattern`

**`countPattern` は存在しなかった。** PHASE1-HANDOFF.md に「記号の count はワイルドカード照合（`countPattern`）。terms / phrases は literal」とあるが、どのコミットのコードにもこの関数は無く、記号も literal で数えていた。修正 3 で定積分が 3 件しか取れなかったのはこのため（"the integral from a to b of f of x d x" をそのまま探していた）。今回実装した:

- `*` は 1〜5 語。それ以外は literal で語境界つき（countPhrase と同じ）。5 語あれば "from negative infinity to infinity" や "from x equals zero to x equals one" の片側を拾え、文をまたぐ誤一致は抑えられる
- 使うのは symbols だけ。どの読みをどのパターンで数えるかは `lib.ts` の `SYMBOL_PATTERNS` に置く。counts と `evidence` のキーはパターンそのもので、literal の件数と見分けられる
- 2 本目の読み（the integral of f of x from a to b）も the integral of * from * to * にした。片方だけパターンにすると literal との比較になって比が偏るため（DECISIONS に 1 行）
- 記号は written を数えない。decide は written を「対象外」と表示し、判断不能の flag も register 不一致も出さない
- テスト 4 件（`countPattern`）

| 候補表現 | OCW | Khan | YouTube | 計 |
|---|---:|---:|---:|---:|
| the integral from * to * of | 157 | 81 | 8 | **246** |
| the integral of * from * to * | 7 | 2 | 2 | 11 |

→ 話し言葉 **① the integral from * to * of（22.4:1）**。`corpus-undecided` の flag は消えた。YouTube は 8 件と少ない（理由は調べていない）。判定は人手の書き起こし・字幕（OCW と Khan）で決まっていて、`corpus-auto-only` にも当たらない。

## D. 決定 3・4: 移項・代入のエントリ

### D-1. ソース別の件数（重複除去後、生の件数）

| 項目 | 候補表現 | 話: OCW（大学） | 話: Khan（高校向け） | 話: YouTube | 話 計 | 書 計 |
|---|---|---:|---:|---:|---:|---:|
| 代入 | plug in | **353** | **5** | **1,045** | 1,403 | 35（うち MIT ノート 30） |
| | substitute | 128 | **132** | 101 | 361 | 739 |
| | substitute back | 4 | 18 | 7 | 29 | 5 |
| 移項 | from both sides | 6 | **165** | 78 | 249 | 25 |
| | to both sides | 8 | **144** | 91 | 243 | 26 |
| | to the other side | **28** | 3 | 21 | 52 | 1 |

### D-2. あなたの整理との違い（決定 4）

- **移項**: あなたの整理どおり。両辺の 2 つは Khan 中心（YouTube の 169 件は PatrickJMT 61・Leonard 40・NancyPi 34・Organic Chemistry Tutor 34）で、OCW では 14 件だけ。to the other side は OCW が 52 件中 28 件
- **代入**: plug in が大学の講義中心なのはそのとおり（OCW 353、Khan 5）。ただし YouTube を入れると **plug in の最大の出どころは YouTube（1,045 件、Leonard だけで 591）**。substitute は総数で見ると OCW 128 ／ Khan 132 ／ YouTube 101 とほぼ均等で、「substitute が Khan 中心」とは言えない。件数で言えるのは「**Khan はほぼ substitute だけを使う**（132 対 5）」なので、note はその形で書いた

### D-3. エントリの変更（どちらも手で直した。例文・note・pitfall は自作の文で、コーパスの文は写していない）

**移項する `move-term-to-other-side`**
- variants: from both sides **spoken → both**、to both sides **spoken → both**、to the other side spoken のまま（決定 3）
- note: 3 本とも上の件数とソースの偏りで書き直した
- pitfall 1: 「中学・高校レベルの説明では両辺の言い方が多い。大学の講義では move ... over to the other side のほうをよく聞く。答案に書くなら両辺の言い方」
- mapping_note: 「両辺の言い方が話し言葉でも書き言葉でも最も多い」に直した
- 例文は 2 文とも spoken のまま（pos verb で 2 文の条件は満たしている）

**代入する `substitute`**
- variants の register は変えていない（plug in spoken ／ substitute both ／ substitute back spoken ／ sub in spoken）
- note: 4 本とも件数を今回の数字に直した。plug in と substitute は D-2 の形で使い分けを書いた
- pitfall 1: 「大学の講義や YouTube の解説では plug in が多い（1,403 対 361）。ただし高校向けの Khan は substitute を使うので、どちらも耳にする。答案・教科書では substitute」

合わせて STYLE.md の直訳禁止リストと register 表の 移項・代入 の行を今回の結論に合わせた。

## E. 再判定（修正 3 → 修正 4）

コーパス: 12 ソース 3,568,113 語 → **19 ソース 5,203,004 語**（重複除去後。話 3,222,833 ／ 書 1,980,171）。最大は openstax-calculus の 16.0% で、全ソース ×1.00。

### E-1. 判定が変わった語

| 項目 | 話し言葉 修正 3 → 修正 4 | 書き言葉 修正 3 → 修正 4 | flag |
|---|---|---|---|
| symbols/integral-definite | **③（3 件）→ ① the integral from * to * of（22.4:1）** | ③ → **対象外** | corpus-undecided → **なし** |
| terms/substitute | **② plug in 358 ／ substitute 253 ／ substitute back 22 → ① plug in（3.9:1）** | ① substitute 140.8:1 → 21.1:1（MIT ノートの plug in 30 件） | なし |
| terms/move-term-to-other-side | ② 159 ／ 146 ／ 31 → ② 249 ／ 243 ／ 52 | ② 24 ／ 24 → ② to both sides 26 ／ from both sides 25 | **register 不一致（書）→ なし**（決定 3） |

- substitute: 話し言葉が ② から ① に変わった。plug in が主見出し、substitute は 3.9 分の 1。エントリはもともと plug in を見出しにし、substitute を both で持っているので不一致にはならない。Khan だけで見ると逆（substitute 132 対 plug in 5）なので、この ① は大学の講義と YouTube の結論（D-2）
- symbols/derivative-prime・power-squared も書き言葉は ③ から「対象外」に変わった（数えなくなっただけで、話し言葉の ① は同じ）

### E-2. 比だけ変わった語（判定は同じ）

| 項目 | 話し言葉 | 書き言葉 |
|---|---|---|
| terms/completing-the-square | ① 23.5:1 → 15.2:1 | ① 52.0:1 → 63.0:1 |
| terms/derivative-at-a-point | ① 6.0:1 → 6.3:1 | ③（7 件）のまま |
| terms/find-a-common-denominator | ①（唯一）→ ① 85.5:1 | ① 26.5:1 → 27.5:1 |
| terms/quadratic-formula | ① 12.0:1 → 41.7:1 | ① 47.0:1 → 52.0:1 |
| terms/squeeze-theorem | ① 9.0:1 → 7.5:1 | ① 13.0:1 のまま |
| symbols/power-squared | ① 373.2:1 → 241.3:1 | ③ → 対象外 |
| terms/discriminant ・ symbols/derivative-prime | ①（唯一）のまま | — |

## F. 人間レビューに残るもの

**0 件。**

- ③ コーパスで決まらないもの: なし（修正 3 の integral-definite は決定 2 で ① になった）
- register がエントリと食い違うもの: なし（修正 3 の move-term-to-other-side は決定 3 で解消）

参考（レビュー対象ではない）: derivative-at-a-point の書き言葉は ③（7 件）のままだが、話し言葉で ① が出ているので「両方 ③」の条件に当たらず、flag は出ない。

## G. 変えたファイル

- `scripts/ledger/fix_decisions.py`（`EN_CHECK_WRONG`）、`fix_phase1.py`（英語照合で参照）、`ledger/terms.csv`（5 行）、`ledger/README.md`
- `scripts/corpus/fetch-captions.ts`（全 9 ソース、khan-algebra のファイル名付け替え、YouTube の人手→自動、100 本上限と均等選択、en-orig、3 本連続失敗で停止、manifest の原子的な書き込み）、`fetch-notes.ts`（新設、`pnpm corpus:fetch:notes`）、`fetch.ts`（一覧表示とコメント）
- `scripts/corpus/lib.ts`（`countPattern`・`SYMBOL_PATTERNS`・`countedAs`）、`count.ts`（記号はパターン照合・written を数えない）、`decide.ts`（記号の written を対象外、型エラー）、`tests/corpus.test.ts`（4 件）
- `src/env.d.ts`（新設、astro/client の型参照）
- `data/terms/move-term-to-other-side.json`、`substitute.json`（手で直した）。ほか 9 件は `corpus:decide -- --write` が evidence と flags を書き換えた
- `audits/corpus-2026-09-24.md`（同じ日付で 4 度目の上書き。前の版は 6f6880b にある）
- `docs/DECISIONS.md`（修正 4 の 14 行）、`docs/STYLE.md`、`docs/PLAN.md`、`docs/PHASE1-HANDOFF.md`、`SOURCES.md`、`CLAUDE.md`、`package.json`、`cspell.json`（チャンネル ID・pdftotext・NFKC・Strang）

## H. 検証

| コマンド | 結果 |
|---|---|
| `tsc --noEmit` | エラー 0 |
| `pnpm validate` | passed（0 warning） |
| `pnpm spell` | 195 ファイル・0 件 |
| `pnpm test` | 45/45 |
| `pnpm build` | 21 ページ、export まで完了 |
