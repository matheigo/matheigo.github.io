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
| 14 | 監査 7（バッチ 19 の r1） | ③ の見出しで英語版 Wikipedia の記事名が参照の 1〜2 件より先になるのは mapping near ／ none の語だけ（lib.ts `settleUndecided`）。mapping exact の quartic-equation は OpenStax Algebra and Trigonometry の 1 つの例題（2 件）の fourth-degree equation が見出しで、英語版 Wikipedia「Quartic equation」の名前は alt | exact の語でも記事名を参照の 1〜2 件より先にするかを決める | どちらも正しい英語で、alt と pitfalls に両方の名前がある |
| 15 | 監査 7（バッチ 19 の r1） | ③ の 10 件は候補の合計で見るので、別の意味の 1 件を候補に足すと首位が ① になり register が変わる（general-angle に general angle（MIT 18.03 の「任意の角」）を足すと coterminal angles 9:1 で ①） | 候補を足すときは別の意味の一致を TERM_FORMS で除く、を STYLE に書く | 監査は足さなかった。候補を足すときだけの問題 |
| 16 | 監査 7（バッチ 19 の r1） | validate の `judgementSentences` は「このエントリの見出しは…同じ語を使っている」の型（見出しの決め方の説明）を拾わない | `HEADWORD_BASIS` に型を足す | general-angle の文は監査で直した |
| 17 | 監査 7（バッチ 19 の r1） | 学習指導要領解説・試験に名前の無い概念の level.jp（代数学の基本定理・有理根定理の 数II。日本語版 Wikipedia にだけある）を何で決めるかの規則が無い | level.jp の根拠に日本語版 Wikipedia「数学 (教科)」などを使ってよいかを決める | 誤りとは確かめられない（単元の割り当てのまま） |
| 18 | 監査 7（バッチ 19 の r2・r3） | `examples_headword.py` と `copy-check.ts`（headwordLength）が、複数形の見出し（double-angle formulas ほか）と例文の単数形（a double-angle formula）を同じ言い方としない。examples-headword に double・half・triple-angle-formulas と sum-to-product-formulas が誤って出る | 語形変化をまとめて照合する | 一覧の誤検出 |
| 19 | 監査 7（バッチ 19 の r2） | 参照の件数（referenceHits）で別の概念の一致を除く仕組みが TERM_FORMS しかなく、angle-addition-formulas の alt addition formula に IM Algebra 2 2.25 A Geometric Addition Formula（等比数列の和）が 1 件入る | 参照の節で除く仕組みを足すか | 書き言葉は ② で判定に効かない |
| 20 | 監査 7（バッチ 19 の r2） | `jawiki.py` ／ `enwiki.py` は --help を記事名として扱う（jawiki の _index.json に --help が missing として入る） | 引数を確かめる | 道具の問題 |
| 21 | 監査 7（バッチ 19 の r3） | lib.ts `settleUndecided` の最後の段（英語版 Wikipedia）は、記事名が候補に無くても記事名を見出しにする。三角不等式 → Triangle inequality は STYLE 原則 1 が別の概念の例に挙げるのに `WIKIPEDIA_NOT_SAME` に無い | `WIKIPEDIA_NOT_SAME` に trigonometric-inequality を足す（exponential-inequality・logarithmic-inequality の langlink も確かめる） | trigonometric-inequality は mapping near で「決まった言い方が出てこない」になり、記事名は使われない |
| 22 | 監査 7（バッチ 19 の r3） | 英語が問題の型に名前を付けないことを理由に mapping near にして規則 1（決まった言い方が出てこない）に落とす型（trigonometric-inequality・exponential-inequality・logarithmic-inequality）が、DECISIONS 2026-09-25 の「規則 1 に落とすために near にしない（write-dx-in-terms-of-du）」と揃っているか | 型をまとめて見直し、near の理由の書き方を決める | 今の規則（DECISIONS 2026-09-25 の select-at-random・ratio-of-areas-of-similar-figures: 英語は名前を付けず文で言う → near）では正しい |
| 23 | 監査 7（バッチ 19 の r3） | ふつうの英単語の件数に別のエントリの見出しを含む言い方が入る（phase の件数に phase-shift の phase shift）。監査 6 の決定 4 の `longerCandidates` は同じエントリの候補の中だけ | 別エントリの en.term を含む一致を除く仕組みを足すか | phase は TERM_FORMS で直した。判定は変わらなかった |
| 24 | 監査 7（バッチ 19 の r3） | Phase 3 の準備 A-5 の none（level.us にあるのにそのコースの単元に入らない語。Algebra 2 だけで 58 語）を level.us と突き合わせていない | 一覧にしてバッチの監査で見る | バッチ 19 は監査で確かめた（product-to-sum ほかは OpenStax Algebra and Trigonometry が根拠、auxiliary-angle-form・trigonometric-inequality は直した） |
| 25 | 監査 7（バッチ 19 の r4） | collocations も候補として数えるので、別のエントリの言い方を collocations に置くと evidence に件数が出る（find-a-common-denominator の reduce the fraction は reduce の en.alt） | validate で他のエントリの en.term・en.alt と同じ collocation を警告する | エントリは監査で直した |
| 26 | 監査 7（バッチ 19 の r4） | STYLE 追記欄の「件数の注意を pitfalls に書く」（別の意味と形で分けられない語）と監査 6 の決定 8（数え方の説明を pitfalls に書かない）が食い違う | 前者を「別の意味にも使う語だと学習者向けに書く」に揃える | polynomial-division は監査で学習者向けの文にした |
| 27 | 監査 7（バッチ 19 の r4） | ja.term の根拠の決まりの隙間: 監査 7 の前の決定 4 は ja.alt だけ、STYLE の「本プロジェクトの訳語」の型は資料に無い訳語だけを扱い、資料に別の意味でだけ出る ja.term（clockwise の 負の向き: 試験では座標軸の向き）や資料に 0 件の言い回しの ja.term（division-algorithm の 割り算の原理）を当てる決まりが無い | ja.term にも決定 4 と同じ根拠を求め、別の意味でだけ出る語は mapping_note に書く、を STYLE に | 監査はエントリで直した（除法の原理へ。負の向きは mapping_note に試験の意味を書いた） |
| 28 | 監査 7（バッチ 19 の r4） | long division algorithm（OpenStax Algebra and Trigonometry 3 件）は polynomial-division の long division と division-algorithm の division algorithm の両方に数えられる | division algorithm の直前の long を除く形にする | どちらの判定も変わらない |
| 29 | 監査 7（バッチ 19 の r4） | probe --decide のファイルに collocation の印が無く、見出しを含む collocation も候補として数える（count は containsWording で数えない） | @collocation の行を足す | 見直しの道具のずれ |
| 30 | 監査 7（バッチ 19 の r4） | en.uk の揃え: counterclockwise の anticlockwise は英語版 Wikipedia「Clockwise」が Commonwealth English の言い方とするのに en.uk は null で、mapping_note の文だけ（監査 3 の H-4 で本文として残した） | Commonwealth English の言い方を en.uk に入れるかを決める | 書き方の揃え |
| 31 | 監査 7（バッチ 19 の r5） | 語形変化をまとめる数え方（lib.ts `inflections`）が別の語に当たる: geometric mean が geometric meaning（「幾何的な意味」）に当たる（話し言葉の数件） | 見出しの最後の語の語形変化を名詞の複数形に限るか、除く語を持つ | 見出し・register は変わらない |
| 32 | 監査 7（バッチ 19 の r5） | 成句を持つ数学の名詞（general term の in general terms、話し言葉の約半分）は、STYLE 追記欄の「ふつうの英単語だけの句は文脈を 10 件見る」に当たらない | 文脈の確かめを成句を持つ語にも広げる | "!in general term" で数えても ① both |
| 33 | 監査 7（バッチ 19 の r5） | `scripts/lib/wording.ts` の AT_LARGE は「1 対 1 で当たる英語の名詞はない」（reduce）・「名詞にまとめた言い方はない」（equality-holds）も拾わない（10 と同じ型） | 10 と合わせて形を足す | 当たった 2 語は監査で直した |
