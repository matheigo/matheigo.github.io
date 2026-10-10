# 参照の名前と並べた英語の言い方が、その参照の本文にあるか（Phase 5 監査 13 の前の決定 2）

作成: `python3 scripts/audit/reference_quotes.py`（規則は scripts/audit/reference_quotes.py の説明）。「no」「partial」は参照の本文に見つからない言い方で、誤りとは限らない（言い換え・地の文・大文字の見出し）。監査が 1 行ずつ読む。

- 行: **2512**（checked A 60・checked B 45・yes 2407）
- verified で見つからないもの: 0

| 見つかったか | コレクション | id | confidence | 欄 | 参照 | 言い方 |
|---|---|---|---|---|---|---|

見つかった 2407 行と、監査が読んで正しいとした 105 行（reference_quotes_checked.json）は .json に。
