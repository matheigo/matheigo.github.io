# 英語版 Wikipedia の記事名で見出しを決めた語（監査 6 の決定 5）

作成: 2026-10-09 ／ `python3 scripts/audit/wikipedia_heads.py`。flag corpus-reference-fallback の note が「見出しは Wikipedia の記事名」の語。記事が見出しと同じ概念かを機械で確かめる方法は無いので、監査で記事を読む（`python3 scripts/audit/enwiki.py "<記事>" "<見出し>"`）。別の概念なら lib.ts `WIKIPEDIA_NOT_SAME` に理由付きで足して数え直す。

- 語: **19**（verified 12）

| バッチ | id | confidence | en.term | ja.term | 記事 | 記事の見つけ方 |
|---|---|---|---|---|---|---|
| 14 | space-diagonal | verified | space diagonal | 立体の対角線 | Space diagonal | en.term のリダイレクト先 |
| 15 | alternating-expression | verified | alternating polynomial | 交代式 | Alternating polynomial | ja の langlink 先 |
| 15 | elementary-symmetric-polynomial | verified | elementary symmetric polynomial | 基本対称式 | Elementary symmetric polynomial | en.term のリダイレクト先 |
| 15 | fractional-part | verified | fractional part | 小数部分 | Fractional part | ja の langlink 先 |
| 15 | nested-radical | verified | nested radical | 二重根号 | Nested radical | en.term のリダイレクト先 |
| 15 | symmetric-expression | verified | symmetric polynomial | 対称式 | Symmetric polynomial | ja の langlink 先 |
| 18 | cevas-theorem | verified | Ceva's theorem | チェバの定理 | Ceva's theorem | ja の langlink 先 |
| 18 | dihedral-angle | verified | dihedral angle | 二面角 | Dihedral angle | ja の langlink 先 |
| 18 | menelauss-theorem | verified | Menelaus's theorem | メネラウスの定理 | Menelaus's theorem | ja の langlink 先 |
| 18 | numeral-system | verified | numeral system | 記数法 | Numeral system | en.term のリダイレクト先 |
| 18 | power-of-a-point | verified | power of a point | 方べきの定理 | Power of a point | ja の langlink 先 |
| 18 | relationship-between-roots-and-coefficients | verified | Vieta's formulas | 解と係数の関係 | Vieta's formulas | ja の langlink 先 |
| 31 | bezouts-identity | likely | Bézout's identity | ベズーの等式 | Bézout's identity | ja の langlink 先 |
| 31 | chinese-remainder-theorem | likely | Chinese remainder theorem | 中国剰余定理 | Chinese remainder theorem | ja の langlink 先 |
| 31 | fermats-little-theorem | likely | Fermat's little theorem | フェルマーの小定理 | Fermat's little theorem | ja の langlink 先 |
| 31 | infinitude-of-primes | likely | Euclid's theorem | 素数の無限性 | Euclid's theorem | en.term のリダイレクト先 |
| 31 | modular-inverse | likely | modular multiplicative inverse | モジュラ逆数 | Modular multiplicative inverse | ja の langlink 先 |
| 31 | rules-of-inference | likely | rules of inference | 推論規則 | Rule of inference | ja の langlink 先 |
| 31 | well-ordering-principle | likely | well-ordering principle | 整列原理 | Well-ordering principle | en.term のリダイレクト先 |
