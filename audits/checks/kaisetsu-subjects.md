# 学習指導要領解説を主語にして科目名を書いた文と、解説のその箇所（Phase 5 監査 14 の前の決定 3）

作成: `python3 scripts/audit/kaisetsu_subjects.py`（規則は scripts/audit/kaisetsu_subjects.py の説明）。高等学校学習指導要領解説を主語にして科目名（数学I〜C）を書いた文と解説の出典の note の鍵（「」の引用・節の名前・見出しの語）を、解説のページの節（数学I〜C、理数数学I・II・特論、付録の本文、総説ほか）で探す。ok 以外は誤りとは限らない（数式は pdftotext で崩れる、別の資料の引用、総説の表）。監査が 1 行ずつ読む。

- 行: **342**（checked A 63・checked B 26・ok 253）
- verified で読む行（理数だけ・一部が理数だけ・別の科目・総説だけ・見つからない）: 0

| 状態 | コレクション | id | confidence | 欄 | 科目 | 鍵と解説の節（件数） | 文 |
|---|---|---|---|---|---|---|---|

ok の 253 行と、監査が読んで正しいとした 89 行（kaisetsu_subjects_checked.json）は .json に。
