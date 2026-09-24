# 数学 日英用語辞典 実行計画書 v1.0
作業名: **MathBridge JA⇄EN**（名前は §10 で決める。それまでの仮称）
作成日: 2026-09-10 ／ 計画: Claude Fable 5.1 ／ 実装: Claude Code (Opus)
ステータス: 実行用ドラフト

---

## 0. この文書の使い方

- これは Claude Code に渡す **実行仕様書**。リポジトリ直下に `docs/PLAN.md` として置き、§11 の `CLAUDE.md` と一緒に使う。
- 章の順番は「なぜ → 何を → どう作る → どう検証 → どう配る」。Opus は §9 のフェーズを上から順に実行する。
- 人間（あなた）の仕事は §10 に全部まとめてある。それ以外は Opus の仕事。
- 迷ったらこの文書の §6（編集方針）と §8（品質基準）が優先。仕様にない判断は `docs/DECISIONS.md` に1行で記録して進める（止まらない）。

---

## 1. 一言で

日本で数学を学んだ人が、米国の教室・オフィスアワー・宿題・試験で **「言える・書ける・聞き取れる」** ようになるための、無料・オープンデータの日英数学辞典。

単語帳ではなく5点セット:
1. **用語**（日⇄英、読み、定義、例文）
2. **記号・式の読み上げ**（"x squared", "the integral from a to b of f of x dx"）
3. **場面別フレーズ**（質問する／解き方を説明する／答案に書く）
4. **日米の慣習差**（≦ と ≤、y=ax+b と y=mx+b、log と ln、∴∵ の使用頻度…）
5. **カリキュラム対応表**（中1〜数C ⇄ Algebra 1〜Calc III / Linear Algebra / Stats）

---

## 2. 調査結果 —「実際に使われているもの」と「空白」

### 2.1 米国側で制度として使われているもの
- **NY州教育局 (NYSED) Bilingual Glossaries**: 英語学習者（ELL/MLL）向けの「一対一対訳・定義なし」の用語集。州の Regents 試験で持ち込みが認められる正式なテスト・アコモデーション。日本語版は Elementary / Intermediate (6–8) / High School Common Core Math Terms Addenda まで存在する。**Algebra 2 の言語一覧に日本語は無く、Calculus は中国語・フランス語・ハイチ語・スペイン語の4言語のみ。**
  → 高校後半〜大学初年次レベルの日本語対訳は、米国の制度側にも存在しない。ここが本プロジェクトの主戦場。
- **ACT の word-to-word 辞書リスト**: 試験持込可の「一対一辞書」一覧を維持している。
  → v1 で「定義なし・一対一」形式の PDF を別途出しておくと、学校によっては試験アコモデーションとして使える可能性がある（各校・各州の方針次第。サイト上で断言はしない）。

### 2.2 英語圏で定番の「数式の読み方」資料（本プロジェクトの英語側の参照基準）
- Jan Nekovář, *Mathematical English (a brief summary)* — 30ページPDF。記号→英語の読み方＋練習問題。ESL・ナレーター界隈で定番。
- Jerzy Trzeciak, *Mathematical English Usage – a Dictionary* — IMPAN（ポーランド科学アカデミー）が無料公開。論文英語の用法辞典。大学以上向け。
- Utah State Univ. Engineering Math Resource Center, *Reading and Writing Mathematical Expressions* — 演算子ごとの「Reads」列がある表。
- Wikipedia *Glossary of mathematical symbols*。
- Andy Gillett (UEfAP) の記号読み方表（IPA付き）。

### 2.3 日本語側の既存資料
| 資料 | 実態 | 使えるか |
|---|---|---|
| 文部省『学術用語集 数学編』(1954, 増訂 1991) | 公式対訳の原典。紙のみ、国会図書館は館内限定 | 参照のみ。オンライン再利用不可 |
| 新潟大 kimlab「英語での数式の読み方」 | 四則〜微積の読み方、米大学生に取材 | 参考にして自作 |
| optics-words「数学の英語」/ sci-pursuit / toishi.info | 単元別の読み方解説ページ | 同上 |
| 上智大 OCW *How to Read Figures, Mathematical Expressions and Equations, and Glossary* (PDF) | 理工系向け。分数・添字・ベクトル・微積の読み方＋用語集 | 同上 |
| mazack.org *How to Read Math in Japanese* | 英日の読み方リスト（米国人数学者作） | 同上 |
| 留学サイト「数学用語の英語一覧」(2026-07) | 高校留学向け対訳表 | 需要の証拠 |
| Weblio「学術用語英和対訳集」「JST科学技術用語日英対訳辞書」 | 商用ライセンス | **転載不可** |
| JMdict (EDRDG, CC BY-SA 4.0) | `{math}` タグ付き語が多数 | 突合には使う。**転載するとライセンスが伝播するので転載しない** |
| MEXT 高等学校学習指導要領 英訳版（仮訳, 2018改訂） | 科目名・単元名の公式寄り英訳 | 単元名の英訳の基準 |
| 学習指導要領LOD (jp-cos.github.io) | 学習指導要領を Linked Open Data 化。教科名の英訳付き | 単元コード体系の参考 |
| CRICED（筑波大）学習指導要領解説 算数・数学 日英対訳 | 小中の用語英訳の権威ソース | 用語英訳の基準（小中） |
| GitHub | xfq/glossary（個人用・未分類）程度 | **構造化された日英数学データセットは存在しない** |

### 2.4 結論 — 差別化ポイント（これを外さない）
1. **レベル**: 高校後半〜大学初年次（数II/B/III/C ⇄ Precalc / Calc I–III / Linear Algebra / Intro Stats）は日本語対訳の制度的空白。
2. **品詞**: 既存は名詞リスト。困っているのは「説明する・質問する・読み上げる」＝ **動詞・フレーズ・記号**。
3. **慣習差**: 日米の記法・言い回しの違いを一箇所にまとめた資料がない。
4. **データ**: 構造化・CC0・検索可能・Anki/PDF 書き出し可能なものがない。

---

## 3. ターゲットと利用シーン

- **主ターゲット**: 日本の中高で数学を学び、米国（英語圏）の高校・コミュニティカレッジ・大学で数学を履修する学生。
- **副ターゲット**: インター校の生徒、英語で数学を教える日本人教員、日本で学ぶ外国人留学生（英→日の逆引き）、翻訳者、LLM 開発者（学習・評価データ）。

| シーン | 困りごと | 使う機能 |
|---|---|---|
| 授業 | 先生の "f prime of x" が何を指すか分からない | 記号・読み上げ集 |
| オフィスアワー | 「ここまでは分かるけど、この変形が分からない」と言えない | 場面別フレーズ |
| 宿題・試験 | 解答を英語で書く。∴ を使っていいのか、増減表は通じるのか | 答案テンプレ・慣習差 |
| 履修計画 | 数IIIの内容は Calc I なのか BC なのか | カリキュラム対応表 |
| 暗記 | 通学中に回したい | Anki デッキ・PDF |

---

## 4. 製品範囲

### v1（公開ライン）
- 用語 **1,500〜2,500 語**（中学数学〜数C ＋ 米国側 Calc I–III, Linear Algebra, Intro Statistics, Discrete Math の基礎語）
- 記号・式の読み上げ **300〜500 パターン**
- 場面別フレーズ **300〜500**（授業／質問／解説／答案／メール・Discord）
- 日米慣習差 **50〜100 項目**
- カリキュラム対応表（日本: 中1〜数C ／ 米国: Traditional・Integrated・大学初年次）
- Web サイト（検索・各語ページ・読み上げ・ダウンロード・報告ボタン）
- 書き出し: JSON / CSV / Anki (.apkg) / word-to-word PDF

### v2（v1 公開後）
- 英→日の逆引き UX 強化、大学2年以上（解析・線形代数・確率統計・離散数学の深部）
- 「自分の解答を英語で言い直す」AI 支援（API コストが発生するので任意）
- 人間収録の音声

### やらないこと
- 教科書的な解説（定義は2文まで）、問題演習、有料機能、広告、ログイン

---

## 5. 情報設計

5 コレクション。すべて JSON、**1 エントリ 1 ファイル**（差分レビューと PR がしやすい）。`id` は英語のケバブケース。

```
data/
  terms/        quadratic-formula.json ...
  symbols/      integral-definite.json ...
  phrases/      office-hours-stuck-at-step.json ...
  conventions/  inequality-symbols.json ...
  curriculum/   jp-suugaku-2.json, us-precalculus.json ...
schema/         terms.schema.json symbols.schema.json ...
```

### 5.1 terms（用語）

```json
{
  "id": "quadratic-formula",
  "ja": {
    "term": "解の公式",
    "reading": "かいのこうしき",
    "alt": ["二次方程式の解の公式"]
  },
  "en": {
    "term": "quadratic formula",
    "alt": [],
    "uk": null,
    "register": "both"
  },
  "pos": "noun",
  "mapping": "exact",
  "mapping_note": null,
  "domains": ["algebra"],
  "level": {
    "jp": ["中3", "数I"],
    "us": ["Algebra 1", "Algebra 2", "Integrated Math 2"]
  },
  "definition_ja": "二次方程式 ax²+bx+c=0 の解を係数から直接求める公式。",
  "definition_en": "A formula that gives the solutions of ax²+bx+c=0 directly from the coefficients.",
  "latex": "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",
  "spoken_en": "x equals negative b, plus or minus the square root of b squared minus four a c, all over two a",
  "examples": [
    {
      "en": "If it doesn't factor, just use the quadratic formula.",
      "ja": "因数分解できなければ解の公式を使えばいい。",
      "register": "spoken"
    }
  ],
  "collocations": [
    {"en": "plug into the quadratic formula", "ja": "解の公式に代入する"},
    {"en": "apply the quadratic formula", "ja": "解の公式を適用する"}
  ],
  "pitfalls": [
    "米国では判別式を D と置かず b²−4ac と書いたまま進めることが多い。"
  ],
  "related": ["discriminant", "completing-the-square", "quadratic-equation"],
  "sources": [
    {"type": "wikipedia-langlink", "ja": "二次方程式の解の公式", "en": "Quadratic formula"},
    {"type": "nysed-glossary", "doc": "HS Common Core Math Terms Addenda (Japanese)"}
  ],
  "confidence": "verified",
  "reviewed": {"machine": "2026-09-12", "audit": "2026-09-14", "human": "2026-09-20"},
  "updated": "2026-09-20"
}
```

必須: `id, ja.term, ja.reading, en.term, pos, mapping, domains, level, definition_ja, definition_en, sources, confidence`。
`confidence` は `draft → likely → verified` の3段階。**`verified` 以外はサイトに出さない**（§8）。
`mapping` は `exact | near | none`。`near`/`none` のときは `mapping_note` 必須（例: 「増減表」→ `none`、「米国では sign chart / first-derivative test の表として説明する」）。
`pos` は `noun | verb | adjective | phrase | symbol`。動詞（代入する、移項する、約分する、場合分けする…）を必ず収録する。

### 5.2 symbols（記号・式の読み上げ）

```json
{
  "id": "integral-definite",
  "latex": "\\int_a^b f(x)\\,dx",
  "spoken_en": [
    {"text": "the integral from a to b of f of x d x", "register": "standard"},
    {"text": "the integral of f of x from a to b", "register": "spoken"}
  ],
  "spoken_ja": "インテグラル a から b、f(x) dx ／ f(x) の a から b までの定積分",
  "name_en": "definite integral",
  "name_ja": "定積分",
  "term_ref": "definite-integral",
  "level": {"jp": ["数II", "数III"], "us": ["AP Calc AB", "Calculus I"]},
  "notes": ["dx は 'd x' と2音で読む。'dee ex' と書くこともある。"],
  "sources": [{"type": "reference", "title": "Nekovář, Mathematical English"}],
  "confidence": "verified"
}
```

### 5.3 phrases（場面別フレーズ）

```json
{
  "id": "office-hours-stuck-at-step",
  "situation": "office-hours",
  "intent": "どこで詰まっているかを伝える",
  "en": "I follow it up to here, but I don't see how you get from this line to the next one.",
  "ja": "ここまでは分かるのですが、この行から次の行への変形が分かりません。",
  "register": "polite",
  "variants": [
    {"en": "I'm lost at this step.", "register": "casual"},
    {"en": "Could you walk me through this step?", "register": "polite"}
  ],
  "tags": ["asking", "derivation"],
  "sources": [{"type": "editorial"}],
  "confidence": "verified"
}
```

`situation` の初期値: `class-listening / class-asking / office-hours / explaining-solution / written-solution / exam / email / group-study / discord`。

### 5.4 conventions（日米慣習差）

```json
{
  "id": "inequality-symbols",
  "title_ja": "≦ と ≤",
  "title_en": "≦ vs ≤",
  "jp": "教科書・答案では ≦ ≧ を使う。",
  "us": "≤ ≥ が標準。≦ は見慣れないが通じる。手書きでは ≤ に寄せる。",
  "advice_ja": "米国の答案では ≤ ≥ を使う。",
  "category": "notation",
  "level": {"jp": ["中1"], "us": ["Pre-Algebra"]},
  "sources": [{"type": "editorial"}],
  "confidence": "verified"
}
```

`category`: `notation | letters | terminology | proof-style | handwriting | calculator | classroom-culture`。

### 5.5 curriculum（単元マッピング）

日本側は科目→単元→小項目（MEXT 2018 改訂に準拠、学習指導要領LOD のコード体系を参考）、米国側は Traditional / Integrated / AP / 大学初年次（一般名）の4系統。1単元 1 ファイルで、`term_refs` に主要用語 id を持たせる。

```json
{
  "id": "jp-suugaku-3-sekibun",
  "system": "jp",
  "subject": "数学III",
  "unit": "積分法",
  "topics": ["不定積分", "定積分", "置換積分法", "部分積分法", "面積", "体積", "曲線の長さ"],
  "us_equivalents": [
    {"course": "AP Calculus BC", "coverage": "most"},
    {"course": "Calculus II", "coverage": "most", "note": "数IIIの積分は Calc I 後半〜Calc II 前半に相当。級数・Taylor は日本の高校範囲外。"}
  ],
  "term_refs": ["indefinite-integral", "definite-integral", "integration-by-substitution", "integration-by-parts", "solid-of-revolution", "arc-length"]
}
```

---

## 6. 英語表現の編集方針（スタイルガイド）— 生成時の最重要ルール

1. **基準は「米国の教室で先生・TA が実際に口にする言い方」**。書き言葉と話し言葉を分けて記録する（`register`）。
2. **米国優先**。英国異形は `en.uk` に入れる（"math/maths", "negative three / minus three", "parentheses / brackets", "trig / trigonometry" 等）。
3. **直訳禁止語リスト**を `docs/STYLE.md` に育てる。初期例:
   - 増減表 → ✕ increase-decrease table → ○ `mapping: none`、「sign chart / table for the first-derivative test」として説明
   - 場合の数 → ✕ number of cases → ○ counting（分野名）／ the number of ways（個数）
   - 三角関数の合成 → ✕ synthesis of trig functions → ○ `mapping: near`、「writing a sin θ + b cos θ as R sin(θ+α)」（auxiliary-angle form / harmonic form）
   - 内分点 → ○ point that divides the segment internally in the ratio m:n（`mapping: near`。米国では section formula として扱われることが少ない）
   - 整式 → ○ polynomial（「多項式」と区別しない）
   - 微分係数 → ○ derivative at a point / the value of the derivative at x=a
   - 解と係数の関係 → ○ Vieta's formulas（大学）／ relationship between roots and coefficients（高校では説明的に）
   - 平方完成 → ○ completing the square
   - 移項 → ○ move (a term) to the other side（動詞句。名詞 transposition は通じにくい）
   - 約分 → ○ reduce (a fraction) / cancel（動詞）
   - 通分 → ○ find a common denominator
   - 代入 → ○ substitute / plug in（教室では plug in が圧倒的）
   - たすき掛け → `mapping: none`。米国は ac method / grouping / box method
   - 相加相乗平均 → ○ AM–GM inequality
   - はさみうちの原理 → ○ squeeze theorem（sandwich theorem は英国寄り）
   - 区分求積法 → ○ Riemann sum（`near`。「区分求積」という名前の手法としては教えない）
   - 背理法 → ○ proof by contradiction ／ 対偶 → ○ contrapositive ／ 数学的帰納法 → ○ (proof by) induction
4. **対応が 1 対 1 でないものを隠さない**。`mapping` を正直に付け、`mapping_note` で「米国ではどう扱うか」を書く。ここが一番価値がある。
5. **定義は自作、2文以内**。他資料の文章をコピーしない。JMdict / Weblio / 教科書の定義文は見てもよいが、書き写さない。
6. **読み（ひらがな）必須**。ローマ字は wanakana で自動生成。カタカナ語（インテグラル、シグマ）も `ja.alt` に入れる。
7. **出典 1 件以上**。無ければ `confidence: draft` のまま。出典の種類:
   `wikipedia-langlink`（日英の記事対応）／ `wikidata`（Qid）／ `mext-translation`／ `criced`／ `nysed-glossary`／ `reference`（Nekovář, Trzeciak, USU 等の読み方資料）／ `textbook`（米国教科書名: Stewart *Calculus*, Larson *Precalculus*, OpenStax *Algebra and Trigonometry* 等）／ `editorial`（本プロジェクトの編集判断。フレーズ集は基本これ）
8. **数式は LaTeX、KaTeX でレンダリングできる範囲**。`\displaystyle` 乱用禁止。
9. **例文は「教室で聞こえてくる文」**。論文調は Trzeciak に任せる。1語につき最低1文、動詞は2文。
10. **文化的注意は事実だけ**。「米国の学生は〜」の一般化は書かない。書くなら「米国の教科書では〜」「Calc I の講義では〜が多い」と対象を限定する。

---

## 7. 技術構成

| 層 | 選定 | 理由 |
|---|---|---|
| データ | JSON（1エントリ1ファイル）＋ JSON Schema ＋ `scripts/`（Node/TS） | 差分レビュー・PR・機械検証が容易 |
| サイト | **Astro（静的）＋ TypeScript**、必要なら Tailwind | ビルド後は静的ファイルのみ。1語1ページで Google に「〜 英語」で拾わせる |
| 検索 | ビルド時に `search-index.json` を生成 → クライアント側 **MiniSearch**。入力は **wanakana** で かな/カナ/ローマ字/英語 を正規化して前方一致＋あいまい検索 | 辞書 UX は「打った瞬間に出る」が命。Pagefind/Starlight は docs 向けで CJK 分かち書きが弱く不採用 |
| 数式 | KaTeX（ビルド時に静的レンダリング） | 軽い・速い |
| 読み上げ | ブラウザの **Web Speech API**（`speechSynthesis`, `en-US`） | 無料・オフライン可・サーバ不要。品質は端末依存と明記 |
| 書き出し | `npm run export` → `dist/data/terms.json`, `terms.csv`, `symbols.json`, `phrases.json`；Anki は Python **genanki** で `.apkg`；word-to-word PDF は Astro のプリント用ページ → Playwright で PDF 化 | Anki 利用者と試験持込用途に対応 |
| CI/CD | GitHub Actions: schema 検証 → 重複検出 → LaTeX コンパイル検査 → ビルド → **Cloudflare Pages または GitHub Pages** に自動デプロイ | 運用費ゼロ |
| ライセンス | データ **CC0 1.0**、コード **MIT**。`SOURCES.md` に参照元を礼儀として列挙 | 再利用・AI 学習・アプリ組込みを妨げない。**CC0 にする以上、BY-SA/商用資料からの転載は一切しない**（§6-5） |
| 解析 | Cloudflare Web Analytics（Cookie なし） or Plausible 自ホスト | プライバシー配慮、ログイン不要と整合 |

サイトのページ構成:
```
/                     検索ボックス（初期表示は「今日の10語」）
/terms/{id}           用語ページ（日英・読み・定義・式・読み上げ・例文・慣習差・関連語・出典・報告ボタン）
/symbols              記号・式の読み上げ一覧（単元別、🔊 付き）
/phrases/{situation}  場面別フレーズ
/conventions          日米慣習差
/curriculum           対応表（日本 ⇄ 米国、クリックで単元の用語一覧へ）
/download             JSON / CSV / Anki / PDF、ライセンス表示
/about                目的・出典・貢献方法・免責（試験持込可否は各校に確認）
```
URL は英語 id 固定。`hreflang` で ja/en を分けない（1ページに両言語）。OGP 画像はビルド時に自動生成（satori 等）。

---

## 8. 品質保証（4段。全部通ったものだけ公開）

| 段 | 何をする | 誰が | 落ちたら |
|---|---|---|---|
| 1. 機械 | JSON Schema 検証、`id` 重複、`ja.term` 重複、必須項目、LaTeX が KaTeX でコンパイルできるか、英語スペルチェック（cspell）、`related` の参照切れ | CI（毎 push） | マージ不可 |
| 2. 突合 | `sources` に `wikipedia-langlink` があれば MediaWiki API で日→英の langlink を実際に取得して `en.term` と照合（表記ゆれは許容）。CRICED / NYSED / MEXT の対訳表と機械照合 | `scripts/crosscheck.ts` | `flags` に理由を書いて `confidence: likely` 止まり |
| 3. 監査 | 生成した Claude Code セッションとは **別セッション**（できれば別モデル）で 50 語ずつ監査。観点: ①米国の教室で通じるか ②直訳になっていないか ③`mapping` の主張は正しいか ④例文が不自然でないか ⑤定義が他資料の書き写しでないか。結果は `audits/YYYY-MM-DD.md` に記録し、修正は PR | Opus（別セッション） | 修正して再監査 |
| 4. 人間 | あなたが週 30 分、`flags` 付き＋ランダム 20 語を見る。判定は「自分ならそう言う／聞いたことがある／怪しい」の3択。怪しいは issue 化 | あなた | `verified` に昇格しない |

公開の閾値: v1 公開時点で **`verified` が用語 1,000 語・記号 200・フレーズ 200・慣習差 30** 以上。`likely` は非公開 or 「未確認」バッジ付き（設定で切替）。

---

## 9. 実行フェーズ（Opus 用。各フェーズは新しいセッションで開始）

### Phase 0 — 土台（半日）
やること:
1. リポジトリ初期化（`pnpm`、Astro、TypeScript、Vitest、ESLint/Prettier、cspell）
2. `schema/*.schema.json`（§5 を忠実に）、`scripts/validate.ts`、`scripts/build-index.ts`、`scripts/export.ts` の骨組み
3. GitHub Actions（validate → build）、Pages/Cloudflare のデプロイ設定は人間が接続するまで dry-run
4. `CLAUDE.md`（§11）、`docs/STYLE.md`（§6 を転記して育てる）、`docs/DECISIONS.md`、`SOURCES.md`、`LICENSE`（コード MIT）、`data/LICENSE`（CC0）
5. サンプルとして **terms 10 語・symbols 5・phrases 5・conventions 3・curriculum 2** を手で作り、CI が緑になることを確認

完了条件: `pnpm validate && pnpm build` が通り、サンプルがローカルで検索・表示できる。

渡すプロンプト:
> `docs/PLAN.md` を読んで Phase 0 を実行して。§5 のスキーマは 1 文字も勝手に変えず、変える必要があれば `docs/DECISIONS.md` に理由を書いてから変えて。終わったら完了条件の確認結果を報告して。

### Phase 1 — 台帳（見出し語だけ、本文はまだ書かない）
やること:
1. `data/curriculum/` を先に完成させる（付録 A を JSON 化。MEXT 2018 改訂の科目・単元・小項目を正、米国側は Traditional / Integrated / AP / 大学初年次）
2. 単元ごとに **見出し語候補**（`ja.term` と暫定 `en.term` だけ）を `ledger/terms.csv` に列挙。目標 2,000 行。名詞だけでなく **動詞・形容詞・句** を単元ごとに必ず入れる（例: 代入する、移項する、両辺を〜で割る、成り立つ、満たす、任意の、ある〜が存在する）
3. ブートストラップ: 日本語 Wikipedia の数学記事タイトル（高校数学の範囲）と MediaWiki API の langlinks で英語対応を取得し、`ledger` に `source=wikipedia-langlink` として流し込む。Wikidata（CC0）のラベルも同様
4. `ledger` を単元・品詞・レベルでタグ付けし、重複・表記ゆれを解消
5. 米国側から逆に洗う: Stewart *Calculus*、OpenStax *Precalculus* / *Algebra and Trigonometry* / *Introductory Statistics* の目次と索引に出る語で、日本語側に無いもの（sec/csc/cot, hyperbolic functions, Taylor series, washer/shell method, related rates, optimization, u-substitution, epsilon-delta 等）を `ledger` に追加して `mapping` を仮置き

完了条件: `ledger/terms.csv` 2,000 行前後、全行に単元・品詞・レベル・出典種別。人間が 15 分眺めて「抜け」を指摘できる状態。

渡すプロンプト:
> Phase 1 を実行。本文は書かず見出し語の台帳だけ作って。名詞に偏らないよう単元ごとに動詞・句を最低 10% 入れて。終わったら単元別の件数表と、対応が怪しい語 30 個を挙げて。

### Phase 2 — 本文生成（バッチ）
やること:
1. `ledger` から **50 語ずつ** `data/terms/*.json` を生成（§5.1 の全項目）。1 バッチ 1 コミット。生成時に §6 の STYLE.md を毎回読む
2. 各語に `sources` を必ず付ける。付けられない語は `confidence: draft` で残す（捨てない）
3. バッチごとに `pnpm validate` と `scripts/crosscheck.ts` を回し、`flags` を埋める
4. 動詞・句は例文を 2 文以上、`register` を分ける
5. 200 語ごとに `audits/` に自己監査メモ（怪しい点の列挙）を残す。修正はしない（Phase 5 の別セッションに回す）

完了条件: 2,000 語が `likely` 以上、`draft` は理由付きで一覧化。

渡すプロンプト:
> Phase 2。`ledger` の単元「数学I 数と式」から 50 語ずつ生成して。毎バッチの前に `docs/STYLE.md` を読み直し、直訳禁止リストに触れる語は `mapping` を正直に付けて。50 語終わるごとに validate と crosscheck を回してコミット。私に確認は求めず、判断に迷ったら `docs/DECISIONS.md` に書いて進めて。

### Phase 3 — 記号・フレーズ・慣習差
やること:
1. `symbols`: 四則・分数・指数・根号・添字・関数・三角・対数・極限・微分・積分・総和・集合・論理・ベクトル・行列・確率統計・幾何（角・線分・合同・相似・平行・垂直）を網羅。読み方は Nekovář / USU / Gillett の資料を参照して自作。`spoken_en` は standard と spoken の 2 通り
2. `phrases`: `situation` ごとに 40〜60。特に **explaining-solution**（"First I set up…, then I isolated x…, plugging back in gives…, which checks out"）と **written-solution**（Let / Suppose / Then / Hence / Therefore / which implies / as desired / "so" で十分な場面）を厚く。日本語は「授業で言いそうな自然な日本語」に
3. `conventions`: 付録 B を起点に 50〜100 項目。カテゴリを揃える
4. すべて `confidence: likely` で入れ、Phase 5 の監査で `verified` に

完了条件: symbols 300+、phrases 300+、conventions 50+。

### Phase 4 — サイト
やること:
1. Astro で §7 のページを実装。検索は MiniSearch ＋ wanakana、初回ロードで `search-index.json`（gzip 後 300 KB 目安）を取得
2. 用語ページ: 日英・読み・定義・式（KaTeX）・🔊（Web Speech API, en-US。ボイスが無ければボタン非表示）・例文・コロケーション・落とし穴・関連語・単元リンク・出典・「間違いを報告」（GitHub issue テンプレへ）
3. `/curriculum`: 日本側と米国側を左右に、単元クリックで用語一覧
4. `/download`: JSON / CSV / Anki / PDF、ライセンス表示、更新日
5. SEO: `<title>` は「解の公式 英語 | quadratic formula — MathBridge」型、`description` は定義文、JSON-LD `DefinedTerm`、sitemap、OGP 自動生成
6. モバイル最優先（片手で検索できる）。ダークモード。フォントは Noto Sans JP ＋ system-ui。派手な装飾は不要、速さと読みやすさ

完了条件: Lighthouse Performance 95+、モバイルで初回検索まで 1 秒以内、全ページ静的。

### Phase 5 — 検証・公開
やること:
1. **別セッション**で §8-3 の監査を全コレクションに実施。修正 PR
2. あなたの人間レビュー（§10）を 3 週分回す
3. 閾値（§8）を満たしたら公開。README（日英）、`SOURCES.md`、`CONTRIBUTING.md`（issue テンプレ: 誤訳報告／追加提案）
4. 公開時の告知文（日英）を `docs/LAUNCH.md` に用意

### Phase 6 — 配布・運用
- Anki 共有デッキとして AnkiWeb に登録
- word-to-word PDF を「試験持込用（定義なし版）」として明示
- 掲載依頼: 留学系メディア、各大学の日本人学生会、日本語で数学を教える教員コミュニティ、Zenn/Qiita/note に制作記
- 英語側: Reddit の該当コミュニティ、ESL 教員向け、Hacker News（データセットとして）
- Hugging Face Datasets にも CC0 で置く（LLM 開発者向け）
- 運用: issue は週 1 でまとめて処理、月 1 で `crosscheck` を全件再実行、四半期で監査

---

## 10. 人間（あなた）の仕事 — 合計 数時間 ＋ 週 30 分

| いつ | 何を | 時間 |
|---|---|---|
| 今日 | 名前を決める（候補: MathBridge / すうえい Sūei / MathWords JP / HowToSayMath）。**決め手は「〜 英語」で検索した人が覚えられるか** | 5 分 |
| 今日 | GitHub にリポジトリ作成（public）、Claude Code を Opus に設定して Phase 0 を開始 | 15 分 |
| Phase 0 後 | Cloudflare Pages か GitHub Pages を接続（独自ドメインは後回しでよい） | 15 分 |
| Phase 1 後 | 台帳を 15 分眺めて「自分が授業で困った語」を追加。**これが一番価値のある入力** | 15 分 |
| Phase 2〜5 | 週 30 分のレビュー（§8-4）。授業で聞いた「言い回し」をメモしておいて渡す | 週 30 分 |
| 公開時 | 友人・同じ境遇の学生 5 人に使ってもらい、詰まった所を聞く | 1 時間 |

**やらなくていいこと**: コードを読む、JSON を手で書く、英語の正誤に自信を持つこと（監査と出典が担保する）。

---

## 11. CLAUDE.md（リポジトリ直下にコピペ）

```markdown
# MathBridge JA⇄EN

日本の中高〜大学初年次の数学用語を、米国の教室で「言える・書ける・聞き取れる」ようにするための
無料・オープンデータ（CC0）の日英数学辞典。仕様は docs/PLAN.md、編集方針は docs/STYLE.md。

## コマンド
- pnpm validate   … JSON Schema・重複・LaTeX・スペル検査（コミット前に必ず）
- pnpm crosscheck … Wikipedia langlinks / 対訳表との突合
- pnpm build      … サイトと search-index を生成
- pnpm export     … JSON/CSV/Anki/PDF を dist/data に出力
- pnpm test       … スクリプトのユニットテスト

## 絶対ルール
1. データは 1 エントリ 1 ファイル。id は英語ケバブケース。スキーマ（schema/）を勝手に変えない。
2. 出典のない語は confidence: draft。出典を捏造しない。分からなければ draft のまま残す。
3. 定義・例文は自作。JMdict / Weblio / 教科書 / 他サイトの文章を書き写さない（データは CC0）。
4. 英語は「米国の教室で先生・TA が実際に言う言い方」を基準にし、書き言葉と話し言葉を register で分ける。
5. 日米で 1 対 1 対応しない語は mapping: near/none を正直に付け、mapping_note で米国の扱いを書く。
6. 判断に迷ったら止まらず docs/DECISIONS.md に 1 行書いて進める。ユーザーに確認を求めるのはスキーマ変更と公開時だけ。
7. 生成は 50 語 1 バッチ 1 コミット。各バッチ前に docs/STYLE.md を読み直す。
8. 監査（audits/）は生成したセッションと別セッションで行う。自分で生成した語を自分で verified にしない。

## 完了の定義（1 エントリ）
必須項目すべて／読み仮名／出典 1 件以上／validate 緑／crosscheck の flags なし（あれば理由付き）／例文 1 文以上（動詞は 2 文）。
```

---

## 12. 最初の指示文（Claude Code に貼る）

> このリポジトリの `docs/PLAN.md` と `CLAUDE.md` を読んで。私は日本で高校数学を学び、今アメリカの大学で数学を履修している学生で、英語で説明したり質問したりするときの言葉に困っている。同じ境遇の人のために PLAN.md の辞典を作りたい。
> まず PLAN.md を要約せず、**あなたが不明だと思う点を最大 5 個**だけ挙げて。私が答えたら Phase 0 に入って。以後、私に確認を求めるのはスキーマ変更と公開の 2 回だけにして、他は `docs/DECISIONS.md` に書いて進めて。

---

## 13. 指標とリスク

### 指標（公開 3 か月）
- `verified` 用語 1,500 ／ 記号 300 ／ フレーズ 300 ／ 慣習差 50
- Google に用語ページが 1,000 件以上インデックス
- 月間ユーザー 1,000（Cloudflare Analytics）、Anki デッキ DL 200
- 誤り報告の平均対応 7 日以内
- 「この辞典があって助かった」の声 10 件（issue / DM / SNS）

### リスク と 手当
| リスク | 手当 |
|---|---|
| 直訳で米国で通じない語が混ざる | STYLE.md の禁止リスト、別セッション監査、`mapping` の明示、あなたの週次レビュー |
| 出典なしの語が増える | `draft` は非公開。捨てずに残して後で補う |
| ライセンス汚染（BY-SA / 商用辞書の転載） | CLAUDE.md 絶対ルール 3、SOURCES.md、PR テンプレのチェック項目 |
| スコープ肥大（大学 2 年以上、問題演習…） | v1 範囲は §4 で固定。追加は v2 の issue に積む |
| 検索が日本語入力で弱い | 読み仮名必須 ＋ wanakana 正規化 ＋ 前方一致優先。実機で「かいのこうしき」「kainokoushiki」「quadratic」で当たることをテスト |
| 誰にも届かない | Phase 6 の配布を計画に含めた。SEO の「〜 英語」需要が下支え |
| 試験持込を保証できない | サイトに「各校に確認」を明記。PDF は定義なし版と明示 |

---

## 付録 A — 単元マッピングの叩き台（Phase 1 で JSON 化）

凡例: ◎ ほぼ一致 ／ ○ 大部分 ／ △ 一部 ／ — 米国側に対応科目なし（大学で扱う or 扱わない）

| 日本 | 主な内容 | 米国 Traditional | 米国 Integrated | AP / 大学 |
|---|---|---|---|---|
| 中1 | 正負の数、文字式、一次方程式、比例・反比例、平面図形・空間図形、資料の活用 | Pre-Algebra ◎ | Math 7–8 ◎ | — |
| 中2 | 連立方程式、一次関数、図形の証明（合同）、確率 | Algebra 1 ○ / Geometry △ | Integrated 1 ○ | — |
| 中3 | 展開・因数分解、平方根、二次方程式、二次関数 y=ax²、相似、円周角、三平方の定理、標本調査 | Algebra 1 ○ / Geometry ○ | Integrated 1–2 ○ | — |
| 数学I | 数と式（実数、不等式）、集合と命題、二次関数、図形と計量（三角比）、データの分析 | Algebra 1–2 ○ / Geometry △ | Integrated 2 ○ | 統計は AP Statistics △ |
| 数学A | 場合の数と確率、図形の性質、数学と人間の活動（整数、n進法、互除法） | Geometry ○ / Precalculus △ | Integrated 2–3 △ | Discrete Math ○（整数・組合せ） |
| 数学II | 式と証明、複素数と方程式、図形と方程式、三角関数、指数・対数関数、微分・積分の考え | Algebra 2 ○ / Precalculus ○ | Integrated 3 ○ | AP Calc AB △（多項式の微積のみ） |
| 数学B | 数列、統計的な推測、数学と社会生活 | Precalculus △（数列・数学的帰納法） | Integrated 3 △ | AP Statistics ○（推測） |
| 数学III | 極限（無限級数を含む）、微分法、積分法（超越関数、置換・部分積分、体積、曲線の長さ） | — | — | AP Calc AB ○ ＋ BC ○ ／ Calculus I ◎ ＋ II ○（級数は等比のみ、収束判定は米国側のみ） |
| 数学C | ベクトル、平面上の曲線と複素数平面、数学的な表現の工夫（行列・統計グラフ等） | Precalculus ○（ベクトル・極座標・円錐曲線・複素数） | — | Calc III △（3D ベクトル）／ Linear Algebra △（行列） |

米国側にあって日本の高校に無い（`mapping` 要注意、Phase 1 で追加）:
sec / csc / cot、hyperbolic functions、interval notation、slope-intercept / point-slope / standard form（y=mx+b）、FOIL、PEMDAS、related rates、optimization（文章題としての最適化）、Taylor / Maclaurin series、series convergence tests、washer / shell method、improper integrals、epsilon-delta（Calc では扱う所も）、matrices（一部）、SOHCAHTOA、unit circle の暗記、graphing calculator（TI-84）文化。

日本側にあって米国で希薄（`mapping: near/none` の候補）:
増減表、区分求積法、三角関数の合成、内分・外分、チェバ・メネラウス、方べきの定理、整数問題（合同式・互除法を高校で本格的に）、たすき掛け、階差数列、群数列、数学的帰納法の答案作法、「〜を示せ」型の証明答案、複素数平面（米国は薄い）、確率の「反復試行」という括り。

## 付録 B — 日米慣習差の初期リスト（Phase 3 で 50〜100 に育てる）

| # | 項目 | 日本 | 米国 | 答案での推奨 |
|---|---|---|---|---|
| 1 | 不等号 | ≦ ≧ | ≤ ≥ | ≤ ≥ |
| 2 | 近似 | ≒ | ≈ | ≈ |
| 3 | 一次関数 | y = ax + b（a: 傾き） | y = mx + b（m: slope） | m を使う |
| 4 | 対数 | log は常用対数、ln は稀 | 高校: log = 常用、大学 Calc: log = ln のことも。教科書ごとに宣言 | 混乱を避けたいなら ln と log₁₀ を明示 |
| 5 | ∴ ∵ | 答案で多用 | ほぼ使わない。"so", "therefore", "since" と書く | 文で書く |
| 6 | 証明終わり | ■ / （証明終） | ∎ / QED / "which completes the proof" | ∎ か文 |
| 7 | 負の数の読み | マイナス 3 | negative three（minus three は英国寄り） | negative |
| 8 | 割り算記号 | ÷ | / または分数。÷ は小学校まで | / |
| 9 | 掛け算記号 | × ・ | · または並置。× はベクトルの外積・次元 | · |
| 10 | 小数点・桁区切り | 3.14 / 1,000 | 同じ | — |
| 11 | 三角比 | sin cos tan のみ | sec csc cot も日常的、SOHCAHTOA | 覚える |
| 12 | 逆三角関数 | 高校では扱わない | sin⁻¹ と arcsin 両方、Calc で必須 | arcsin 表記が安全 |
| 13 | 微分の記法 | y', dy/dx | f'(x), dy/dx, d/dx[ ]、"f prime" | 同じ |
| 14 | 増減表 | 表で書く | first-derivative test、sign chart（数直線に + −） | sign chart |
| 15 | 組合せ | nCr, nPr | C(n,r), ₙCᵣ, (n r) 縦書き "n choose r"、P(n,r) | "n choose r" |
| 16 | ベクトル | \vec{a}（矢印） | 太字 **a** または矢印。成分は ⟨a, b⟩ も | 講義の記法に合わせる |
| 17 | 区間 | a ≦ x ≦ b と書く | interval notation [a, b], (a, b) が標準 | 区間記法を覚える |
| 18 | 手書き数字 | 7 に横棒、1 に旗 | 7 は棒なし、1 は縦棒のみ。横棒付き 7 は F や 4 に見えることがある | 米国式に寄せる |
| 19 | 手書きの z, x | — | z に横棒は稀。x と × の区別に注意 | — |
| 20 | 問題文の指示語 | 求めよ／示せ／図示せよ | Find / Evaluate / Show that / Prove / Sketch / Simplify / Solve for x | 動詞の対応表 |
| 21 | 解答の見せ方 | 計算過程を縦に整然と | "Show your work" は必須だが、単位・箱で囲む "box your answer" の習慣 | 最終解を四角で囲む |
| 22 | 平方根の有理化 | 必ず有理化 | 答えとして 1/√2 も許容されることがある（講師次第） | 講師に確認 |
| 23 | 角度 | 度と弧度法（数II） | Precalc から radians 中心、Calc は radians のみ | radians |
| 24 | 計算機 | 入試で禁止 | TI-84 などのグラフ電卓が授業・試験で前提のことが多い | 持つ |
| 25 | 単位 | SI | 文章題は feet, miles, gallons が普通 | 換算に慣れる |
| 26 | 「関数」の記号 | f(x) | 同じ。ただし "f of x" と読む | — |
| 27 | 判別式 | D | b² − 4ac をそのまま書く。discriminant | 名前は覚える |
| 28 | 直線の方程式 | ax + by + c = 0 も普通 | standard form は Ax + By = C | 形が違う |
| 29 | 数列 | {aₙ}, 初項 a₁ | aₙ, a₁ または a₀ から始めることが多い | 添字の開始に注意 |
| 30 | 証明のスタイル | 「〜より」「〜である」の箇条書き | 文で書く（Let…, Since…, it follows that…） | フレーズ集 written-solution |

## 付録 C — 参考 URL（調査で確認済み。転載はせず参照のみ）

**米国・制度**
- NYS Bilingual Glossaries 一覧（NYU Steinhardt / NYS Statewide Language RBERN）: https://steinhardt.nyu.edu/metrocenter/statewide-rbern/resources/bilingual-glossaries-and-cognates
- 同 日本語版 Intermediate (6–8) Math: https://docs.steinhardt.nyu.edu/pdfs/metrocenter/atn293/msmath/6-8math_glossary_japanese.pdf
- 同 日本語版 Elementary Math: https://docs.steinhardt.nyu.edu/pdfs/metrocenter/atn293/elemath/elementary_math_japanese.pdf
- Baldwin HS の言語別一覧（Algebra 2 / Calculus の対応言語が分かる）: https://bhs.baldwinschools.org/academic-departments-programs/english-as-a-new-language/testing-accommodations-bilingual-glossaries

**英語の読み方（英語側の参照基準）**
- Nekovář *Mathematical English (a brief summary)*（PDF はタイトルで検索。narratorsroadmap の紹介ページ: https://www.narratorsroadmap.com/how-to-say-mathematical-symbols-and-equations/ ）
- Trzeciak *Mathematical English Usage – a Dictionary*（IMPAN で無料公開。タイトルで検索）
- USU *Reading and Writing Mathematical Expressions*: https://engineering.usu.edu/students/engineering-math-resource-center/topics/pre-calculus/foundations/reading-and-writing-mathematics

**日本語側**
- 新潟大 kimlab「英語での数式の読み方」: https://www.gs.niigata-u.ac.jp/~kimlab/lecture/math/index.html
- 上智大 OCW *How to Read Figures, Mathematical Expressions and Equations, and Glossary*: https://ocw.cc.sophia.ac.jp/wp-content/uploads/2019/02/2009SCT50900_1_01.pdf
- optics-words「微分の英語表現と読み方」: https://www.optics-words.com/english_for_science/differential.html
- sci-pursuit「英語による数式の読み方」: https://sci-pursuit.com/English/numerical_formula-1.html
- mazack.org *How to Read Math in Japanese*: http://mazack.org/japanese/en_jp_math.php
- 留学サイト「数学用語の英語一覧」(2026-07): https://www.ryugakusite.com/article/high_school_math/
- 学術用語集 数学編（NDL 書誌）: https://ndlsearch.ndl.go.jp/books/R100000002-I000002305903

**カリキュラム**
- MEXT 平成30年改訂 高等学校学習指導要領 英訳版（仮訳）: https://www.mext.go.jp/a_menu/shotou/new-cs/1417513.htm
- MEXT 学習指導要領（本文・解説・英訳）: https://www.mext.go.jp/a_menu/shotou/new-cs/1384661.htm
- 学習指導要領LOD（英語表記の出典）: https://jp-cos.github.io/SourceOfEnglishName
- CRICED 小学校学習指導要領解説 算数編 日英対訳: https://www.criced.tsukuba.ac.jp/math/apec/ICME12/Lesson_Study_set/ElementarySchoolTeachingGuide-Mathmatics-JP-EN.pdf

**データ・技術**
- 既存の GitHub 用語集（参考程度）: https://github.com/xfq/glossary
- Weblio 学術カテゴリ（商用。ライセンスの確認用）: https://www.weblio.jp/category/academic/tmcyg
- Starlight の検索/i18n（不採用の根拠確認用）: https://starlight.astro.build/hi/guides/site-search

---

## 14. 音声と Anki の仕様（追補 2026-09-10）

### 結論
- **英語音声は収録する**（terms / symbols / phrases）。**日本語音声は収録しない**（対象者は日本語話者。読み仮名で足りる）。
- 配布形態: Anki `.apkg`（音声同梱）＋ 音声 zip（他アプリ用）＋ Quizlet 取込用 TSV（音声なし。米国の学生は Quizlet 派が多い）。

### 音声の作り方（3 段階、費用ゼロ）
1. **v1 即日**: Anki の内蔵 TTS タグ `{{tts en_US:TTS_Text}}` を裏面テンプレに入れる。音声ファイル不要、端末の音声エンジンが読む（Anki デスクトップ 2.1.20 以降、AnkiMobile、AnkiDroid。対応バージョンは README に記載）。サイト側は Web Speech API（§7）。
2. **v1 公開時**: オープンな TTS で全クリップを事前生成し `.apkg` に同梱。第一候補 **Kokoro-82M**（Apache 2.0）、第二候補 **Piper**（MIT）。形式は mp3 64 kbps mono（または ogg/opus）、1 クリップ 1〜4 秒、想定 3,000 クリップで 30〜60 MB（AnkiWeb 共有デッキの上限内）。生成は `scripts/gen-audio.py`、CI の通常ジョブには入れず手動ジョブ。出力は `audio/{collection}/{id}.mp3`、`dist/audio.zip` を GitHub Release に添付。
3. **v2**: 人間収録（ネイティブの友人 or クラウドソース）。v1 の反応を見て判断。

### スキーマ追加（terms / symbols / phrases 共通、すべて任意項目）
| 項目 | 内容 | 例 |
|---|---|---|
| `tts_text` | TTS に読ませる文字列。`en.term` / `spoken_en` と異なるときだけ入れる | "ln x" → "natural log of x"／"Euler" → "Oiler"／"dx" → "d x"／"csc" → "cosecant"／"sinh" → "hyperbolic sine"／"arcsin" → "arc sine"／"Q.E.D." → "Q E D" |
| `respelling` | 人向けの発音ヒント。日本人が定番で間違える語のみ | asymptote → "ASS-im-tote"／hypotenuse → "hy-POT-uh-noose"／Euler → "OY-ler"／Leibniz → "LIBE-nits"／Cauchy → "KOH-shee"／integer → "IN-tuh-jer"／parentheses → "puh-REN-thuh-seez"／trigonometry → "trig-uh-NOM-uh-tree"／determinant → "dih-TUR-mih-nunt" |
| `ipa` | IPA 表記 | 任意 |
| `audio` | 生成後のファイル相対パス | `audio/terms/asymptote.mp3` |

### Anki のノート型とカード型
**ノート型 `MathBridge Term`** — フィールド: ID, JA, Reading, EN, TTS_Text, Respelling, Definition_JA, Definition_EN, LaTeX, Example_EN, Example_JA, Level_JP, Level_US, Domain, Audio, URL

| カード型 | 表 | 裏 | 既定 | 目的 |
|---|---|---|---|---|
| **JA→EN（産出）** | 微分係数 | derivative at a point ＋ 音声 ＋ 例文 | ON | 「英語で何と言う？」（本プロジェクトの主目的） |
| **Audio→JA（聴解）** | 音声のみ（テキスト非表示） | EN 表記 ＋ 日本語 ＋ 定義 | ON | 授業で聞き取る訓練 |
| EN→JA（読解） | derivative at a point | 微分係数 | OFF | 読めれば分かる人が多い |

**ノート型 `MathBridge Symbol`** — 表: LaTeX（Anki 内蔵の MathJax、`\( ... \)` 表記で画像不要）、裏: `spoken_en` ＋ 音声 ＋ 日本語の読み。
**ノート型 `MathBridge Phrase`** — 表: 日本語の意図（例「どこで詰まっているかを伝えたい」）、裏: 英文 ＋ 音声 ＋ variants。

- サブデッキは日本のカリキュラム単元別。タグ `jp::数III`、`us::Calc1`、`pos::verb`、`mapping::none` で絞れるようにする。
- `.apkg` の生成は Python **genanki**、`scripts/export-anki.py`。モデル ID・デッキ ID は固定（更新時に重複デッキにならないよう `docs/DECISIONS.md` に記録）。
- Quizlet 用 TSV は `EN<TAB>JA（読み）` の 2 列、単元ごとに 1 ファイル。

### 音声の品質管理
- 生成後、**固有名詞（数学者名）・略語（ln, csc, arcsin, dx, Q.E.D.）・記号読み上げ** のクリップは全数聴取し、`tts_text` で修正して再生成。
- TTS 由来であることを About とデッキ説明に明記。人間収録に置き換えたら差し替え、`audio` のパスは変えない。
- 音声の再生成は `tts_text` か `spoken_en` が変わったエントリだけ（ハッシュで差分検出）。

### やらないこと
日本語音声／Forvo 等の外部発音 API（ライセンスと依存が増える）／有料 TTS（不要）／音声のストリーミング配信（静的ファイルで足りる）。

---

## 15. 用例コーパスによる裏付け（追補 2026-09-10）

### 目的
「米国の教室で実際に言う言い方」の判断を、人の勘ではなく **書き起こしの頻度** で裏付ける。人間レビューの対象を「コーパスで決まらないもの」だけに絞る。§6-1 の基準（先生・TA が実際に口にする言い方）に証拠を付ける仕組み。

### コーパス — 話し言葉（優先順）
1. **MIT OpenCourseWare** の講義トランスクリプト: 18.01 Single Variable Calculus、18.02 Multivariable Calculus、18.06 Linear Algebra、18.03 Differential Equations、6.042 Mathematics for Computer Science。公式配布、CC BY-NC-SA、人手の書き起こし（数式の読み方が正確）。
2. **Khan Academy**（字幕あり、CC BY-NC-SA）: Algebra 1〜AP Calculus、AP Statistics。
3. **YouTube の講義録画・解説チャンネル（米国）**: Professor Leonard（コミュニティカレッジの講義録画）、The Organic Chemistry Tutor、PatrickJMT、NancyPi、blackpenredpen、3Blue1Brown。字幕または自動字幕を取得。
   - 除外または別タグ: 英国・豪州系（Eddie Woo 等）、非ネイティブ講師の個人チャンネル。
   - 1 チャンネルの比率上限 25%（講師の癖を辞典にしない）。
規模の目安: 300〜500 本、300〜500 時間、数百万語。

### コーパス — 書き言葉
OpenStax *Calculus* Vol 1–3、*Precalculus*、*Algebra and Trigonometry*、*Introductory Statistics*（CC BY-NC-SA 4.0）、MIT OCW の講義ノート。`register: written` の根拠に使う。

### ライセンスと保存ルール
- 書き起こし本文は **リポジトリに保存しない**（`corpus/` は `.gitignore`）。保存するのは出典 ID・タイムスタンプ・件数だけ。
- 字幕の取得は各サービスの規約に従う。利用は集計（事実）のみ。本文・長い引用の転載はしない（データは CC0 なので特に）。
- エントリに `evidence` を追加（任意項目）:
```json
"evidence": {
  "spoken": {"plug in": 412, "plug into": 87, "substitute": 133},
  "written": {"substitute": 96, "plug in": 4},
  "sources": ["mit-18.01", "khan-ap-calc", "yt:profleonard"],
  "counted": "2026-09-14"
}
```

### パイプライン `scripts/corpus/`
1. **fetch**: OCW トランスクリプト（公式配布ページから）、Khan/YouTube 字幕（字幕取得ツール。自動字幕は `auto: true` を付けて区別）。
2. **normalize**: 小文字化、数式読みの表記ゆれ辞書（"f prime"/"f-prime"、"d x"/"dx"/"DX"、"x squared"/"x-squared"、"the integral"/"the intergral" 等）、数字の読み。
3. **count**: 各エントリの候補表現（`en.term`、`en.alt`、`collocations`、`spoken_en`、`phrases.en`）を正規表現で数える。前後 8 語の文脈は一時ファイルに出す（レビュー用、コミットしない）。
4. **decide**: 頻度比で `register` を決めるルール。例: spoken コーパスで 3:1 以上ならその表現を spoken の見出しに、written で 3:1 以上なら written の見出しに。両方で閾値未満 or 総件数 10 未満は **「コーパスで判断不能」フラグ** → 人間レビュー行き。
5. **report**: `audits/corpus-YYYY-MM-DD.md` に、判断が変わった語・新たに見つかった言い回し（辞典にない高頻度表現）を列挙。**辞典に無い高頻度表現の発見** がこの仕組みの副産物で、Phase 1 の台帳の抜けを埋める。

### 人間レビューの再定義（§8-4 を置き換え）
週 30 分はそのまま、対象を次に限定する:
- コーパスで判断不能のフラグ付き（教室の儀式 "box your answer"、試験の指示語、オフィスアワーの言い回し）
- 日本語側の用語・読みの妥当性
- 「うちの先生はこう言う」のメモ（授業で聞いた表現をそのまま渡す。裏付けはコーパスで取る）
全 2,000 語を人間が判定する前提は **廃止**。

### 注意
- 自動字幕は数式を誤認識するので、**symbols（読み上げ）の根拠は人手書き起こし（OCW）を優先**、自動字幕は補助。
- 講義動画は「解説の話し言葉」であって「学生同士の会話」ではない。学生側のフレーズ（質問の仕方）は、コーパスでは裏付けにくいので `editorial` のまま監査で見る。
- コーパスの偏り（Calc に厚く、Geometry・統計に薄い）を `sources` の集計で可視化し、薄い単元は閾値を緩めない（判断不能のまま人間へ）。
- モデル: パイプラインは Sonnet で十分。LLM を使うのは候補表現の列挙と曖昧ヒットの判定だけ。GPT 等の別サービスは不要。
- 実施タイミング: Phase 2 の前に fetch〜normalize を済ませ、Phase 2 の各バッチで count〜decide を回す。Phase 1 の台帳が終わった直後に着手。
