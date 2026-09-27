# 規則と仕組みの backlog（公開の後にまとめて判断する）

2026-09-27 のユーザーの決定（DECISIONS「Phase 5 監査（セッション 7）の前の決定」）: 公開までは、規則と仕組みの変更を
**学生が読む中身（en・mapping・定義・例文・注記の事実・level）が間違うもの**に限る。それ以外の規則の問題
（書き方の揃え、警告の範囲、記録の欄、出どころの文など）は直さず、ここに積んで公開の後にまとめて判断する。
監査のレポートの H は「中身が間違うもの」と「backlog に積んだもの」を分けて書き、後者はここに行を足す。

各行: 出どころ ／ 問題 ／ 案 ／ 中身が間違わない理由。

| # | 出どころ | 問題 | 案 | 中身が間違わない理由 |
|---|---|---|---|---|
| 1 | 監査 6 の H-4 | mapping_note に判定の説明（数え方・見出しの決め方）が 17 文（verified 9）残る。監査 6 の決定 8 の警告（scripts/lib/wording.ts `judgementSentences`）は pitfalls・notes だけを見る | validate の警告を mapping_note にも広げ、当たる文を消す | 判定の説明は学習者向けの注意ではないが、書いてあることは flag・evidence と同じで誤りではない |
| 2 | 監査 6 の H-5 | 用例コーパスの出どころだけの文（「用例コーパスの書き言葉は大半が OpenStax Introductory Statistics」「話し言葉はほとんど Professor Leonard」）は判定の説明の警告に当たらない。監査 5 の DECISIONS は出どころも判定の説明とした | 「用例コーパス」＋「大半が／すべて／ほとんど」＋資料の名前の文を機械で一覧にし、消すか残すかを決める | 出どころの事実としては正しい（evidence の sources と同じ） |
| 3 | 監査 6 の H-6 | latex があるのに spoken_en が null の語がある（バッチ 17・18 に十数語: independence-of-events・numeral-system・circumcenter・complementary-angle・real-part ほか） | validate の警告にし、読みを足す | 欠けで、誤りではない（latex はそのまま表示される） |
| 4 | 監査 6 の H-9 | 人間が見出しを決めた語（corpus-human-settled）の register は監査 6 の決定 2 の対象外にした（constant-of-proportionality: 話 ① constant of proportionality・書 ① constant of variation）。人間の決定が古くなった語（今はコーパスで決まる）にも決定 2 を当てるか | 人間の決定の日付とコーパスの判定を並べて一覧にし、決定 2 を当てるかを語ごとに決める | 見出しは人間が決めたとおりで、register が無いのは記録の欠け |
