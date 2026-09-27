# 見直し役（読み取り専用のレビュー）への指示

Phase 5 監査の各バッチで、監査のセッション（親）が 10 語ずつ頼む見直し役への指示。監査 6 から指示文をこのファイルに置く（監査 6 の決定 3）。
モデルは Opus 5.5（監査 6 の DECISIONS。公開の直前に一度 Claude Fable 5.1 で verified から 100 項目を抜き取って見直す）。
人数（監査 8 の前の決定 4）: terms は 1 バッチ 5 人（10 語ずつ）、symbols と phrases は 3 人（17・17・16 項目ずつ）、conventions は 5 人（10 項目ずつ。日米両方の主張があるため）。1 セッションは terms・conventions が 2 バッチまで、symbols・phrases が 3 バッチまで（監査 9 の前の決定 4）。symbols・phrases・conventions の観点は「13 の観点」の後の節。
どのコレクションでも、結果は `audits/work/` のファイルに書き、親には件数と場所だけを返す。

## 役割と約束

- **読むだけ**。data/・scripts/・docs/ ほかリポジトリのファイルを変えない。書いてよいのは親が指定した `audits/work/<バッチ>-r<K>.md`（gitignore）だけ
- 見つけた問題は資料で確かめてから書く。確かめきれない疑いは「要確認」と書く。直し案は出すが、直すかどうかは親が資料で確かめて決める
- **候補を足すと、規則どおり参照が見出しを決め直すことがある。候補の追加は親が規則で判断する**（監査 6 の決定 3。causation に causal relationship を足したら ③ の見出しが変わった）。「参照の言い方を en.alt に」と書くときは、足すとどの見出しになりうるかも書く（`pnpm corpus:probe -- --decide --file x.txt` で確かめられる）
- 親への返事は **件数と場所だけ**（「10 語、指摘 N 件（大 a・小 b・要確認 c）、audits/work/batch17-r1.md」）。中身は返事に書かない
- コーパス・参照の本文は短い引用（根拠の 1 文まで）にとどめる。work のファイルはコミットしないが、本文の長い写しは作らない

## 道具

- `python3 scripts/audit/show_batch.py --ids terms/a,terms/b` … エントリを並べ、機械の一覧（!COPY 書き写し、!JP 日本側の主張、!US 米国側の主張、!REF 参照の定理名、!WIKI 記事名の見出し、!③REF 参照が決めた見出し）を添える
- `python3 scripts/audit/refgrep.py jp <語>` … 学習指導要領解説（中・高）、共通テスト／センター試験、日本語版 Wikipedia。`-s` で件数だけ、`-c 80` で文脈を長く
- `python3 scripts/audit/refgrep.py us <語>` … CED 2 つ・OpenStax 9 冊・IM・CK-12・Nicholson・Levin
- `python3 scripts/audit/ced.py calc|stats <topic|unitN> <語>` … CED の topic ごとの本文
- `python3 scripts/audit/jawiki.py <記事名>`（`--search`）、`python3 scripts/audit/enwiki.py "<記事名>" "<語>"`（`--depth`）
- `pnpm corpus:probe -- "<語>"`（`--contexts` で用例コーパスと参照の文脈、`--decide --file x.txt` で判定）
- 機械の一覧: `audits/checks/`（copy-overlap・jp-claims・us-claims・source-mentions・wording-warnings・examples-headword・reference-theorem-names・wikipedia-heads）
- 規則: `docs/STYLE.md`（原則 1 の ①②③ と追記欄）、`docs/SOURCES.md`、`CLAUDE.md`

## 13 の観点

1. **英語の見出しと register**（en.term・en.register・evidence・flags）: 見出しが規則どおりか（①②③、1 ソース頼み、話し言葉の首位が 1 ソース頼みのときの書き言葉・CED）。ふつうの英単語の見出しは `--contexts` で別の意味が混ざっていないか
   - **③ で参照が見出しを決めた語（!③REF）は、`pnpm corpus:probe -- --contexts "<見出し>"` で参照の根拠の文脈（行頭「参」）を必ず読む**（監査 6 の決定 9）。件数が別の意味・練習問題の指示・定理の前提などで数えられていないか
   - **英語版 Wikipedia の記事名で決めた見出し（!WIKI）は、`enwiki.py` で記事を読み、見出しと同じ概念かを確かめる**（監査 6 の決定 5。別の概念なら WIKIPEDIA_NOT_SAME に足す案を書く）
2. **mapping**（exact／near／none）と mapping_note: 日米で 1 対 1 か。near・none の理由が資料で確かめられるか。多義は near の理由にしない
3. **en.alt・collocations・variants**: 用例コーパス・参照に 0 件の言い方がないか、参照が使う言い方が抜けていないか（足すと見出しが変わりうることは上の約束のとおり）。見出しの語を含む参照の定理名（side-angle-side triangle congruence theorem）は見出しと競わせない（監査 7 の前の決定 3。lib.ts が数えない）
4. **数学の正しさ**: 定義・例文・pitfalls・latex の数学の誤り
5. **書き写し**: 定義文・例文が参照・用例コーパスと一致していないか（!COPY。10 語以上で 1〜2 ソースの一致と、定義文の一致は言い換える）
6. **日本側の主張**: 資料（解説・〔用語・記号〕・共通テスト／センター試験・日本語版 Wikipedia）を主語にして書いているか（!JP）。「日本の教科書は」は書かない
7. **米国側の主張**: CED・OpenStax・IM・CK-12・Nicholson・Levin・英語版 Wikipedia の名前で書いているか（!US）。確かめられない「米国では」は書かない
8. **出典**: 本文で名指しした資料が sources にあるか（source-mentions）、note が正しいか。**langlink の記事が見出しと同じ概念か**（監査 5 の H-6。台帳が機械で付けた langlink は記事名しか突き合わせていない）
9. **level**（jp・us）: 資料に根拠のある学年・コースか（「米国の高校課程では扱わない」語は大学のコースだけ、数I・数A の Geometry は CK-12 Geometry・IM Geometry に言い方があるものだけ。監査 6 の決定 1・7）。**level.us は概念で決めてよい**: 参照の本文に同じ概念があれば言い方が違ってもそのコースを残す（その言い方は見出しの候補に足さない。監査 7 の前の決定 2）。「扱わない」の型の文が概念として誤り（参照が同じ概念を別の名前で扱う）なら、文と level を直す案を出す（決定 1）
10. **ja.term・ja.alt・読み**: 日本語の見出しが解説・日本語版 Wikipedia の言い方か、本プロジェクトの訳語ならそう書いてあるか。**ja.alt は資料（解説・〔用語・記号〕、共通テスト・センター試験、日本語版 Wikipedia）に根拠があるものだけ**（監査 7 の前の決定 4。0 件なら外す案）
11. **alt の根拠**: en.alt・ja.alt が資料で確かめられるか
12. **例文**: 教室で聞こえる自然な文か、日英が対応しているか、少なくとも 1 つが見出し（en.term）の語を使うか
13. **pitfalls・related・domains**: 学習者向けの注意だけか（**判定の説明**＝数え方・件数の出どころ・見出しの決め方は書かない。validate が警告する。監査 6 の決定 8）、related が相互か、確かめられない言い方（通じる・ことが多い・英語には〜がない）がないか

## symbols・phrases・conventions の観点（監査 9 で足した。監査 8 の J-4）

上の 13 の観点は terms の欄の名前で書いてある。symbols・phrases・conventions も、欄を読み替えて同じ観点（④ 数学の正しさ、⑤ 書き写し、⑥⑦ 日米の主張を資料を主語に、⑧ 出典、⑨ level、⑬ 確かめられない言い方と判定の説明を本文に書かない）で見て、次を足す。`show_batch.py --ids symbols/x,phrases/y,conventions/z` はどのコレクションもそのまま並べる。**機械の一覧が拾わない欄がある**: jp-claims・us-claims は symbols の notes、phrases の notes・variants の note だけで、conventions の jp・us・advice_ja は拾わない（wording-warnings と source-mentions は拾う）。慣習差は全文を自分で読む。

### symbols（記号の読み。3 人で 17・17・16 項目）

- **S1 読み（spoken_en）の 1 つ目（standard）が規則どおりか**: 読みは読みの形（lib.ts `SYMBOL_PATTERNS`。`*` は 1〜5 語の空き、「A | B」「!w」も使う）で数え、①②③（CLAUDE.md 規則 9）。話し言葉だけで数える（書き言葉は「対象外」）。③ は参照で決める（lib.ts `settleSymbolReading`）: CED → OpenStax・IM・CK-12 → Nicholson・Levin の**本文**（節の題・IM の用語集は数えない）で、1 つの参照が **3 件以上**使う読み（CED も 3 件から。英語版 Wikipedia は使わない）。flag corpus-reference-fallback の記号は `pnpm exec tsx scripts/audit/symctx.ts "<読みの形>"` で参照の根拠（行頭「参」）を読み（**`pnpm corpus:probe` は記号の `*` を数えない**。監査 9 で足した道具。backlog 79）、その記号を読む文（記号の定義・説明のところ）か、別の意味の同じ語句ではないかを確かめる
- **S2 読みの形が別のものを数えていないか**: evidence のパターンが別の記号・別の意味を拾っていないか（`* squared` が square feet、`* prime` が prime number、`the quantity *` が数量の意味、`floor of *` が部屋の床、など。監査 9 のバッチ 32・33 で多数）。`symctx.ts` で首位の文脈を 10 件以上読む。形を直すと件数・並びが変わりうるので、直し案には数え直した件数を添えるregister（standard ／ spoken ／ written）の付け方が evidence と合うか
- **S3 読みの正しさ**: latex と spoken_en が同じ式を読んでいるか（範囲・括弧の読み分け: a sub n plus one と a sub n, plus one、the quantity）。latex が KaTeX で表示できる書き方か
- **S4 日本語側**: spoken_ja・name_ja が〔用語・記号〕・学習指導要領解説・共通テスト／センター試験・日本語版 Wikipedia の読み・呼び方か（`refgrep.py jp`）。資料に無い読みを言い切っていないか
- **S5 notes**: 日米の違いの説明は related の慣習差に任せ、記号の notes は読み方と書き方だけ（DECISIONS「Phase 3 記号の前の修正」2。同じ説明を 2 か所に書かない）。発音の主張（「カイ」「エンス」など）は Merriam-Webster を出典に（監査 4 の決定 2。WebFetch・curl では開けないので、既存の出典に無ければ「要確認」で親に回す）。Levin ／ Nicholson で決まり高校の参照が 0 件の記号は「米国の高校課程（CED・OpenStax・IM・CK-12）では扱わない」と参照の件数（STYLE 追記欄）
- **S6 term_ref・related・category・level**: term_ref の用語が同じ概念か（用語の en.term と読みが食い違っていないか）、related の慣習差が相手も自分を指しているか（validate の警告）、category が /symbols の単元として合うか、level が資料に根拠のある学年・コースか（term_ref の用語の level と食い違いがないか）
- 重さ: **大** は spoken_en の 1 つ目（standard）を変える・latex の意味を変える・notes の読み方の誤り（学生が違う読みを覚える）、**小** は 2 つ目以降の読み・register・spoken_ja の言い換え・出典・level・category・related

### phrases（場面別フレーズ。3 人で 17・17・16 項目）

- **P1 話者と要の部分**: 要の部分（`scripts/corpus/phrase-forms.ts` の `PHRASE_FORMS`）が意図を運ぶ言い方か、別の使い方（文頭の So など）を拾っていないか。場面の話者で数えているか（学生の場面 class-asking・office-hours・group-study は MICASE の学生の発話、explaining-solution は講義と MICASE 全体、class-listening は講義と MICASE の教員、written-solution・exam の書く文は書き言葉 → ③ は参照、exam の口で言う文は話者、email・discord は MICASE の学生か Math Stack Exchange で 3 件以上なら likely）。`pnpm corpus:probe -- --decide --group <student|instructor|written|email|classroom> --file x.txt` と `--contexts`
- **P2 en と variants**: en が規則どおりか（①②③。どの要の部分も 10 件に届かなければ競わせない（corpus-attested-only）。Math Stack Exchange は使われている証拠だけで en を選ばない）。variants が**同じ意図の言い換え**か（別の質問を並べていないか）。register（polite ／ neutral ／ casual ／ written）が場面と文に合うか
- **P3 自然さと対応**: 米国の教室・オフィスアワー・メール・Discord で実際に言う・書く文か。ja が en と同じことを言っているか、intent（カードの表）が en と ja の両方に合うか。文の中の式・数・答えが正しいか
- **P4 notes・variants の note**: 使うときの注意だけ（判定の説明・用例コーパスの件数は書かない）。米国での扱いの主張は資料の名前で。確かめられない言い方（丁寧すぎる・失礼になる、ことが多い）は資料で確かめられなければ直す案
- **P5 書き写し**: en・variants・ja が用例コーパス・参照の文を長く写していないか（!COPY の 10 語以上で 1〜2 ソースの一致は言い換える案。要の部分そのものの一致は決まった言い方なのでよい）
- **P6 出典**: フレーズは editorial が基本（STYLE「出典の種類」）。notes が名指しした資料は sources にあるか
- 重さ: **大** は en を変える・intent や situation を変える・ja の意味を変える、**小** は variants の追加・削除・register・notes の言い換え・出典

### conventions（日米慣習差。5 人で 10 項目ずつ）

- **C1 jp**: 日本側の主張を 1 文ずつ資料（学習指導要領・解説と〔用語・記号〕、共通テスト／センター試験、日本語版 Wikipedia）で確かめ、資料を主語に書いているか（「日本の教科書は」「日本の答案では」は書かない）。`refgrep.py jp`、`jawiki.py`
- **C2 us**: 米国側の主張を 1 文ずつ資料（CED・OpenStax・IM・CK-12・Nicholson・Levin・英語版 Wikipedia）で確かめ、資料を主語に書いているか。件数を書くなら参照の件数だけ（用例コーパスの件数は書かない。CLAUDE.md 規則 10）。`refgrep.py us`、`ced.py`
- **C3 advice_ja**: jp・us の事実から出てくる助言か。確かめられない言い方（通じる／通じない、減点される、ことが多い）がないか（validate の警告）。助言の英語が terms・symbols の見出しと食い違っていないか
- **C4 違いが本当にあるか**: 語彙だけの違い（同じものを日米で別の語で呼ぶだけ）は慣習差にしない（DECISIONS「Phase 3 記号の前の修正」3。terms の pitfalls・mapping_note の役目）。jp と us が同じ段（高校どうし）で比べられているか（日本の高校と米国の大学を比べていないか）
- **C5 題・category・level**: title_ja・title_en が中身に合うか、level が資料に根拠のある学年・コースか
- **C6 term_refs・related**: term_refs の用語の中身（en.term、mapping_note の事実）と慣習差の文が食い違っていないか、related の記号が相手も自分を指しているか
- **C7 出典**: jp・us・advice_ja で名指しした資料がすべて sources にあるか（source-mentions）。出典が「PLAN 付録 B #n」だけの行は、確かめた資料が足されているか（無ければ確かめて足す案）
- 重さ: **大** は jp ・us の事実の誤りで違いの中身が変わる・慣習差として成り立たない（語彙だけの違い）・advice_ja の助言を変える、**小** は資料を主語にする言い換え・出典・level・term_refs・related

## 規則の問題は backlog の候補として分けて書く（監査 7 の前の決定）

公開までは、規則と仕組みの変更は学生が読む中身（en・mapping・定義・例文・注記の事実・level）が間違うものだけにする。規則そのものの問題に気づいたら、ファイルの最後に「## 規則の問題（backlog の候補）」として一行ずつ書き、中身が間違うものかどうかを添える。次は `audits/backlog.md` に積んだので、エントリの直し案を出さない: mapping_note の判定の説明（監査 6 の H-4）、用例コーパスの出どころだけの文（H-5）、latex があるのに spoken_en が null（H-6）、人間が見出しを決めた語の register（H-9）。

## 書き方（audits/work/<バッチ>-r<K>.md）

```
# バッチ N レビュー（rK）— <まとめ>

対象: terms/a, terms/b, …
方法: 使った道具（一行）

## terms/a
- ① | en.term | 問題 | 根拠（道具と結果） | 直し案
- ⑥ | pitfalls[1] | … | … | …
- 問題なし（確かめたこと: …）  ← 問題が無い観点がまとまっていればこう書く
```

重さを（大）（小）で添える。**大** は en・mapping・例文の差し替え・定義の意味の変更（監査では大きな直し）、**小** は言い換え・資料名・出典・level・alt の直し（小さな直し）。
