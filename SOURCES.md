# SOURCES

参照した資料の一覧。**礼儀として挙げるもので、転載はしていない。**
本プロジェクトのデータ（`data/`）は CC0 1.0 で、定義文・例文はすべて書き下ろし。
BY-SA や商用ライセンスの資料からは一文も写していない（CLAUDE.md 絶対ルール 3）。

## 米国・制度

- NYS Bilingual Glossaries（NYU Steinhardt / NYS Statewide Language RBERN）
  https://steinhardt.nyu.edu/metrocenter/statewide-rbern/resources/bilingual-glossaries-and-cognates
- 同 日本語版 Intermediate (6–8) Math
  https://docs.steinhardt.nyu.edu/pdfs/metrocenter/atn293/msmath/6-8math_glossary_japanese.pdf
- 同 日本語版 Elementary Math
  https://docs.steinhardt.nyu.edu/pdfs/metrocenter/atn293/elemath/elementary_math_japanese.pdf
- Baldwin HS 言語別一覧（Algebra 2 / Calculus の対応言語）
  https://bhs.baldwinschools.org/academic-departments-programs/english-as-a-new-language/testing-accommodations-bilingual-glossaries

## 英語の読み方（英語側の参照基準）

- Jan Nekovar, *Mathematical English (a brief summary)*
- Jerzy Trzeciak, *Mathematical English Usage – a Dictionary*（IMPAN 無料公開）
- Utah State University, *Reading and Writing Mathematical Expressions*
  https://engineering.usu.edu/students/engineering-math-resource-center/topics/pre-calculus/foundations/reading-and-writing-mathematics
- Wikipedia, *Glossary of mathematical symbols*
- Andy Gillett (UEfAP) の記号読み方表

## 日本語側

- 新潟大 kimlab「英語での数式の読み方」
  https://www.gs.niigata-u.ac.jp/~kimlab/lecture/math/index.html
- 上智大 OCW *How to Read Figures, Mathematical Expressions and Equations, and Glossary*
  https://ocw.cc.sophia.ac.jp/wp-content/uploads/2019/02/2009SCT50900_1_01.pdf
- optics-words「微分の英語表現と読み方」 https://www.optics-words.com/english_for_science/differential.html
- sci-pursuit「英語による数式の読み方」 https://sci-pursuit.com/English/numerical_formula-1.html
- mazack.org *How to Read Math in Japanese* http://mazack.org/japanese/en_jp_math.php
- 文部省『学術用語集 数学編』（参照のみ。オンライン再利用不可）
  https://ndlsearch.ndl.go.jp/books/R100000002-I000002305903

## カリキュラム

- 文部科学省 平成30年改訂 高等学校学習指導要領 英訳版（仮訳）
  https://www.mext.go.jp/a_menu/shotou/new-cs/1417513.htm
- 文部科学省 学習指導要領（本文・解説・英訳） https://www.mext.go.jp/a_menu/shotou/new-cs/1384661.htm
- 学習指導要領LOD（英語表記の出典） https://jp-cos.github.io/SourceOfEnglishName
- CRICED（筑波大）小学校学習指導要領解説 算数編 日英対訳
  https://www.criced.tsukuba.ac.jp/math/apec/ICME12/Lesson_Study_set/ElementarySchoolTeachingGuide-Mathmatics-JP-EN.pdf

## 使わないもの（ライセンス上）

- Weblio「学術用語英和対訳集」「JST科学技術用語日英対訳辞書」— 商用ライセンス。**転載不可**
- JMdict (EDRDG, CC BY-SA 4.0) — 突合の参考にはするが、CC0 のデータに BY-SA を混ぜないため**転載しない**

## 教科書の基準

- **OpenStax *Calculus* Volume 1**（CC BY 4.0）— 微積分の用語・記法の第一基準。`textbook` 出典はまずこれ
- OpenStax *Precalculus* / *Algebra and Trigonometry* / *Introductory Statistics*（CC BY 4.0）
- Stewart *Calculus*、Larson *Precalculus* — 書名を出典に挙げるのみ。文章は引かない

## 用例コーパス（PLAN 15）

頻度の裏付けに使う。**書き起こし本文はこのリポジトリに入れない**（`corpus/` は .gitignore）。
残すのは出典 ID・件数・日付だけで、各エントリの `evidence` に入る。

- MIT OpenCourseWare の講義・演習の書き起こし（.vtt、CC BY-NC-SA 4.0）— 人手の書き起こしで、数式の読み方が正確。
  `pnpm corpus:fetch:ocw` が OCW のサーバから直接取得する
- Khan Academy / YouTube の字幕 — `scripts/corpus/fetch-captions.sh` を人間が手で実行する。自動字幕は `auto: true` で区別し、
  記号の読み上げの唯一の根拠にはしない
- OpenStax の教科書本文 — `register: written` の根拠

## 突合のしかた

`pnpm crosscheck` が、`sources` に `wikipedia-langlink` を持つ項目について
日本語版 Wikipedia の言語間リンクを MediaWiki API から取得し、記録した英語表記と照合する。
一致しない場合は `flags` に理由を書き、`verified` に昇格させない。取得するのは記事タイトルだけで、本文は取得しない。
