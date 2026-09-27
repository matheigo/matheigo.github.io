# 見直し役（読み取り専用のレビュー）への指示

Phase 5 監査の各バッチで、監査のセッション（親）が 10 語ずつ頼む見直し役への指示。監査 6 から指示文をこのファイルに置く（監査 6 の決定 3）。
モデルは Opus 5.5（監査 6 の DECISIONS。公開の直前に一度 Claude Fable 5.1 で verified から 100 項目を抜き取って見直す）。

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
3. **en.alt・collocations・variants**: 用例コーパス・参照に 0 件の言い方がないか、参照が使う言い方が抜けていないか（足すと見出しが変わりうることは上の約束のとおり）
4. **数学の正しさ**: 定義・例文・pitfalls・latex の数学の誤り
5. **書き写し**: 定義文・例文が参照・用例コーパスと一致していないか（!COPY。10 語以上で 1〜2 ソースの一致と、定義文の一致は言い換える）
6. **日本側の主張**: 資料（解説・〔用語・記号〕・共通テスト／センター試験・日本語版 Wikipedia）を主語にして書いているか（!JP）。「日本の教科書は」は書かない
7. **米国側の主張**: CED・OpenStax・IM・CK-12・Nicholson・Levin・英語版 Wikipedia の名前で書いているか（!US）。確かめられない「米国では」は書かない
8. **出典**: 本文で名指しした資料が sources にあるか（source-mentions）、note が正しいか。**langlink の記事が見出しと同じ概念か**（監査 5 の H-6。台帳が機械で付けた langlink は記事名しか突き合わせていない）
9. **level**（jp・us）: 資料に根拠のある学年・コースか（「米国の高校課程では扱わない」語は大学のコースだけ、数I・数A の Geometry は CK-12 Geometry・IM Geometry に言い方があるものだけ。監査 6 の決定 1・7）
10. **ja.term・ja.alt・読み**: 日本語の見出しが解説・日本語版 Wikipedia の言い方か、本プロジェクトの訳語ならそう書いてあるか
11. **alt の根拠**: en.alt・ja.alt が資料で確かめられるか
12. **例文**: 教室で聞こえる自然な文か、日英が対応しているか、少なくとも 1 つが見出し（en.term）の語を使うか
13. **pitfalls・related・domains**: 学習者向けの注意だけか（**判定の説明**＝数え方・件数の出どころ・見出しの決め方は書かない。validate が警告する。監査 6 の決定 8）、related が相互か、確かめられない言い方（通じる・ことが多い・英語には〜がない）がないか

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
