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
| 5 | 監査 7（バッチ 17 の r4） | `scripts/audit/reference_names.py` は … Theorem ／ Postulate ／ Property ／ Rule ／ Law ／ Test だけを拾い、… Principle を拾わない。Levin 3.2 の Sum Principle・Product Principle が !REF に出なかった | キーワードに Principle を足し、一覧を取り直す | 監査が見直し役の指摘で足した（addition-principle・multiplication-principle の en.alt）。一覧の抜けで、エントリは正しい |
| 6 | 監査 7（バッチ 17 の r1） | en.alt が en.term の TERM_FORMS の形の 1 つと同じ言い方だと、同じ一致を 2 回数える（independence-of-events の independence of events、話し言葉 1 件）。longerCandidates は同じ言い方の組を外し、startsOutside は同じ長さの一致を外さない | 形に入っている言い方を en.alt から外すか、decide が同じ一致を 1 回にする | evidence がわずかに多いだけで、判定（①）は変わらない |
| 7 | 監査 7（バッチ 17） | decide の register の確かめは片方向で、en.register がコーパスで ③ の側（話し言葉 ③ なのに both）を主張していても「エントリ側で直すこと」に出ない（数え直した counting・binary は both のままだった） | ③ の側を主張する en.register を一覧に出す | ③ は「判断不能」で「使わない」ではない。数え直した語は監査で直した |
| 8 | 監査 7（バッチ 17 の r4） | order-matters の件数（order matters ／ order doesn't matter）は、交換法則・行列の積・積分の順序の意味を含み、形で数える意味だけに分けられない（話し言葉 20 件のうち数える意味は 4 件） | 分けられる形が見つかれば TERM_FORMS に。見つからなければ en.register を外すかを決める | 見出しの言い方と意味は正しく、pitfalls で別の意味に触れた |
| 9 | 監査 7（バッチ 17 の r5） | variants の note に判定の語（「併記」）が残る（modulus の mod n）。監査 6 の決定 8 の警告は pitfalls・notes だけを見る | 警告を variants の note にも広げる（1 の mapping_note と同じ扱い） | 判定の結果を言っているだけで誤りではない |
| 10 | 監査 7（バッチ 18 の r2・r3） | `scripts/lib/wording.ts` の AT_LARGE（資料の外の英語の主張）は「英語には〜ない」の形だけを拾い、「英語に…なく」「英語では…ず」「決まった言い方にはならない」「通る」を拾わない（the-five-centers-of-a-triangle の mapping_note はユーザーの決定の文言） | 形を足して一覧にする | 監査が見つけた文は直した。残るのはユーザーの決定の文言 |
| 11 | 監査 7（バッチ 18 の r2） | `scripts/audit/reference_names_same.json` の tangents secant segments theorem（CK-12 6.20、接線と割線）が power-of-a-point の関連の名前になっている。中身は secant-tangent-theorem の定理 | 判断の id を secant-tangent-theorem に直す | 道具のデータで、!REF の表示が変わるだけ |
| 12 | 監査 7（バッチ 18 の r2） | `scripts/audit/enwiki.py` は語ごとに語尾（s・es・ing・ed）を許すので、Menelaus' が Menelaus's にも当たり、「bold in」が別の綴りの太字を数える | アポストロフィで終わる語は語尾を許さない | 監査が記事を読んで確かめた |
| 13 | 監査 7（バッチ 18 の r3・r5） | 参照の切り分けが、Nicholson の番号の無い節（Supplementary Exercises for Chapter 4、付録 A・D）を直前の番号付きの節（4.5、11.2 The Jordan Canonical Form）に入れる。flag の note と probe の節の表示がずれる | 切り分けに番号の無い節と付録を足す | 出典の note は監査が本文で確かめて書いた |
