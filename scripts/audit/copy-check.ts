/**
 * Phase 5 audit, check 1a: text copied from the corpus or the references.
 *
 * The data is CC0, so no sentence of it may come from OpenStax, MIT OCW, Khan
 * Academy, YouTube captions, MICASE (NC / NC-SA), the CEDs, IM, CK-12,
 * Nicholson, Levin, or - on the Japanese side - the 学習指導要領解説, the
 * 共通テスト／センター試験 papers or Japanese Wikipedia (STYLE 原則 5).
 *
 * A match is a run of 8 or more words (English) or 20 or more characters
 * (Japanese, whitespace removed) that an entry's prose shares with a source.
 * The entry side is small, so its windows go in a map and every source is
 * streamed past it once.
 *
 * Output (committed; it holds only the entry's own words, never corpus text):
 *   audits/checks/copy-overlap.json   every span with the sources it was found in
 *   audits/checks/copy-overlap.md     the same as a table
 *
 *   pnpm audit:copy
 */
import fs from "node:fs";
import path from "node:path";
import { COLLECTIONS, ROOT, loadCollection, type Collection } from "../lib/load";
import { bodyTexts } from "../lib/corpus-count";

const EN_N = 8;
const JA_N = 20;

/** The prose fields of each collection (not ids, readings, levels or evidence). */
const PROSE: Partial<Record<Collection, RegExp>> = {
  terms:
    /^(definition_(ja|en)|examples\[\d+\]\.(en|ja)|pitfalls\[\d+\]|mapping_note|en\.variants\[\d+\]\.note|collocations\[\d+\]\.(en|ja))$/,
  symbols: /^(notes\[\d+\]|spoken_ja)$/,
  phrases: /^(en|ja|intent|variants\[\d+\]\.(en|note)|notes\[\d+\])$/,
  conventions: /^(jp|us|advice_ja|title_ja|title_en)$/,
};

const JA_CHAR = /[぀-ヿ一-鿿]/;
const JA_CHARS = /[぀-ヿ一-鿿]/g;

/**
 * A window counts only when it is prose: 3 or more English words of 3 or more
 * letters, or 10 or more kana / kanji. Formulas (f x g x f x g x ...) and
 * English names inside Japanese text (necessaryandsufficientcondition) are
 * not text that can be copied.
 */
const enProse = (w: string[]) => w.filter((t) => /^[a-z]{3,}/.test(t)).length >= 3;
const jaProse = (w: string) => (w.match(JA_CHARS)?.length ?? 0) >= 10;

export function enTokens(text: string): string[] {
  return (
    text
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .match(/[a-z0-9]+(?:'[a-z0-9]+)*/g) ?? []
  );
}

export function jaChars(text: string): string {
  return text.normalize("NFKC").replace(/\s+/g, "");
}

interface Field {
  collection: Collection;
  id: string;
  field: string;
  text: string;
  en: string[];
  ja: string;
  enHits: Map<number, Map<string, number>>; // window start -> source -> count
  jaHits: Map<number, Map<string, number>>;
}

function loadFields(): Field[] {
  const out: Field[] = [];
  for (const c of COLLECTIONS) {
    const re = PROSE[c];
    if (!re) continue;
    for (const e of loadCollection(c)) {
      for (const [at, text] of bodyTexts(e.data)) {
        if (!re.test(at)) continue;
        out.push({
          collection: c,
          id: e.data.id,
          field: at,
          text,
          en: enTokens(text),
          ja: JA_CHAR.test(text) ? jaChars(text) : "",
          enHits: new Map(),
          jaHits: new Map(),
        });
      }
    }
  }
  return out;
}

/** English sources: every file of the corpus manifest, and the reference texts. */
function englishSources(): [string, string][] {
  const out: [string, string][] = [];
  const manifest = JSON.parse(
    fs.readFileSync(path.join(ROOT, "corpus", "manifest.json"), "utf8"),
  ) as {
    id: string;
    file: string;
  }[];
  for (const m of manifest) out.push([m.id, path.join(ROOT, "corpus", m.file)]);
  for (const r of [
    "ap-calculus-ab-bc-ced",
    "ap-statistics-ced",
    "nicholson-lawa-2021a",
    "levin-dmoi4",
    "im-6-8",
    "im-9-12",
    "ck12-geometry",
    "ck12-algebra",
  ])
    out.push([`ref:${r}`, path.join(ROOT, "corpus", "ref", `${r}.txt`)]);
  return out.filter(([, f]) => fs.existsSync(f));
}

/** Japanese sources: the 解説, the exam papers (text and OCR), Japanese Wikipedia. */
function japaneseSources(): [string, () => string][] {
  const jp = path.join(ROOT, "corpus", "ref", "jp");
  const out: [string, () => string][] = [];
  for (const k of ["kaisetsu-chu", "kaisetsu-kou"]) {
    const f = path.join(jp, `${k}.txt`);
    if (fs.existsSync(f)) out.push([`jp:${k}`, () => fs.readFileSync(f, "utf8")]);
  }
  const d = path.join(jp, "exams"); // the text of each paper (pdftotext, or OCR for image-only PDFs)
  if (fs.existsSync(d))
    for (const f of fs.readdirSync(d).filter((x) => x.endsWith(".txt")))
      out.push([
        `jp:exams/${f.replace(/\.txt$/, "")}`,
        () => fs.readFileSync(path.join(d, f), "utf8"),
      ]);
  const w = path.join(jp, "wiki");
  if (fs.existsSync(w))
    for (const f of fs.readdirSync(w).filter((x) => x.endsWith(".json"))) {
      out.push([
        "jp:wikipedia",
        () => {
          const j = JSON.parse(fs.readFileSync(path.join(w, f), "utf8")) as { text?: string };
          return j.text ?? "";
        },
      ]);
    }
  return out;
}

function bump(m: Map<number, Map<string, number>>, pos: number, src: string) {
  let s = m.get(pos);
  if (!s) m.set(pos, (s = new Map()));
  s.set(src, (s.get(src) ?? 0) + 1);
}

interface Span {
  collection: Collection;
  id: string;
  field: string;
  lang: "en" | "ja";
  length: number; // words (en) or characters (ja)
  span: string; // the entry's own words
  sources: Record<string, number>;
}

/** Joins overlapping windows of one field into maximal spans. */
function spans(f: Field, lang: "en" | "ja"): Span[] {
  const hits = lang === "en" ? f.enHits : f.jaHits;
  const n = lang === "en" ? EN_N : JA_N;
  const starts = [...hits.keys()].sort((a, b) => a - b);
  const out: Span[] = [];
  let i = 0;
  while (i < starts.length) {
    const from = starts[i];
    let to = from + n;
    const src = new Map<string, number>();
    let j = i;
    while (j < starts.length && starts[j] <= to - 1) {
      to = Math.max(to, starts[j] + n);
      for (const [s, c] of hits.get(starts[j])!) src.set(s, Math.max(src.get(s) ?? 0, c));
      j++;
    }
    const span =
      lang === "en" ? f.en.slice(from, to).join(" ") : [...f.ja].slice(from, to).join("");
    out.push({
      collection: f.collection,
      id: f.id,
      field: f.field,
      lang,
      length: to - from,
      span,
      sources: Object.fromEntries([...src].sort((a, b) => b[1] - a[1])),
    });
    i = j;
  }
  return out;
}

function main() {
  const fields = loadFields();

  // English windows of the entries
  const enIndex = new Map<string, [Field, number][]>();
  const first = new Set<string>();
  const last = new Set<string>();
  for (const f of fields)
    for (let i = 0; i + EN_N <= f.en.length; i++) {
      if (!enProse(f.en.slice(i, i + EN_N))) continue;
      const key = f.en.slice(i, i + EN_N).join(" ");
      let l = enIndex.get(key);
      if (!l) enIndex.set(key, (l = []));
      l.push([f, i]);
      first.add(f.en[i]);
      last.add(f.en[i + EN_N - 1]);
    }
  const en = englishSources();
  let done = 0;
  for (const [src, file] of en) {
    const toks = enTokens(fs.readFileSync(file, "utf8"));
    for (let i = 0; i + EN_N <= toks.length; i++) {
      if (!first.has(toks[i]) || !last.has(toks[i + EN_N - 1])) continue;
      const l = enIndex.get(toks.slice(i, i + EN_N).join(" "));
      if (l) for (const [f, p] of l) bump(f.enHits, p, src);
    }
    if (++done % 500 === 0) process.stderr.write(`en ${done}/${en.length}\n`);
  }
  process.stderr.write(`en ${done}/${en.length}\n`);

  // Japanese windows of the entries
  const jaIndex = new Map<string, [Field, number][]>();
  for (const f of fields) {
    const cs = [...f.ja];
    for (let i = 0; i + JA_N <= cs.length; i++) {
      const key = cs.slice(i, i + JA_N).join("");
      if (!jaProse(key)) continue;
      let l = jaIndex.get(key);
      if (!l) jaIndex.set(key, (l = []));
      l.push([f, i]);
    }
  }
  const ja = japaneseSources();
  done = 0;
  for (const [src, read] of ja) {
    const cs = [...jaChars(read())];
    for (let i = 0; i + JA_N <= cs.length; i++) {
      const l = jaIndex.get(cs.slice(i, i + JA_N).join(""));
      if (l) for (const [f, p] of l) bump(f.jaHits, p, src);
    }
    if (++done % 100 === 0) process.stderr.write(`ja ${done}/${ja.length}\n`);
  }
  process.stderr.write(`ja ${done}/${ja.length}\n`);

  const all = fields.flatMap((f) => [...spans(f, "en"), ...spans(f, "ja")]);
  const outDir = path.join(ROOT, "audits", "checks");
  fs.mkdirSync(outDir, { recursive: true });
  const summary = {
    checked: new Date().toISOString().slice(0, 10),
    rule: `English: ${EN_N}+ consecutive words; Japanese: ${JA_N}+ characters (whitespace removed)`,
    fields: fields.length,
    englishSources: en.length,
    japaneseSources: ja.length,
    spans: all.length,
    entries: new Set(all.map((s) => `${s.collection}/${s.id}`)).size,
  };
  fs.writeFileSync(
    path.join(outDir, "copy-overlap.json"),
    JSON.stringify({ summary, spans: all }, null, 2) + "\n",
  );

  const srcLabel = (s: Record<string, number>) => {
    const k = Object.keys(s);
    return k.slice(0, 6).join(", ") + (k.length > 6 ? " ほか" : "");
  };
  const rows = all
    .sort(
      (a, b) =>
        a.collection.localeCompare(b.collection) || a.id.localeCompare(b.id) || b.length - a.length,
    )
    .map(
      (s) =>
        `| ${s.collection} | ${s.id} | ${s.field} | ${s.lang} | ${s.length} | ${s.span.replace(/\|/g, "\\|")} | ${Object.keys(s.sources).length} | ${srcLabel(s.sources)} |`,
    );
  const md = [
    "# 書き写しの検出（Phase 5 の監査の前の機械の確かめ 1）",
    "",
    `作成: ${summary.checked} ／ \`pnpm audit:copy\`（scripts/audit/copy-check.ts）`,
    "",
    `規則: 英語は連続 ${EN_N} 語以上、日本語は空白を除いて ${JA_N} 文字以上、エントリの本文（定義・例文・pitfalls・mapping_note・variants の note・コロケーション、記号の notes・日本語の読み、フレーズの en・ja・意図・variants・notes、慣習差の題・jp・us・advice_ja）が`,
    "用例コーパス（manifest の全ファイル: MIT OCW・Khan Academy・YouTube・MICASE・OpenStax・MIT の講義ノート）と参照（CED 2 つ・Nicholson・Levin・IM 2 つ・CK-12 2 つ）、",
    "日本側の資料（学習指導要領解説 2 つ・共通テスト／センター試験の問題と正解の本文（画像だけの PDF は OCR）・日本語版 Wikipedia）と一致する箇所。数式だけの窓（3 文字以上の英単語が 3 語未満）と、日本語の窓でかな・漢字が 10 文字未満のもの（日本語の文の中の英語の名前）は数えない。",
    "表の「一致」はエントリ側の語（コーパスの文はここに書かない）。ソースの数は一致が見つかったソース（manifest の id、参照、日本側の資料）の数。3 つ以上のソースにある一致は、数式の読みや決まった言い回しのことが多い。",
    "",
    `- 調べた本文の欄: ${summary.fields}`,
    `- 英語のソース: ${summary.englishSources} ファイル ／ 日本語のソース: ${summary.japaneseSources} ファイル`,
    `- 一致した箇所: **${summary.spans}**（${summary.entries} 項目）`,
    "",
    "| コレクション | id | 欄 | 言語 | 長さ | 一致（エントリの語） | ソースの数 | ソース |",
    "|---|---|---|---|---|---|---|---|",
    ...rows,
    "",
  ].join("\n");
  fs.writeFileSync(path.join(outDir, "copy-overlap.md"), md);
  console.log(JSON.stringify(summary));
}

main();
