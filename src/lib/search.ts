/**
 * Search behaviour, shared by the site and by tests/search.test.ts.
 *
 * PLAN.md 13 names the failure mode to guard against: Japanese input being
 * weak. The three queries in that risk row - かいのこうしき / kainokoushiki /
 * quadratic - are asserted in the test suite.
 *
 * public/search-index.json is compact (arrays, no derivable fields) so the
 * first search on a slow phone stays under a second (PLAN Phase 4). The page
 * expands it with `expand`, answers with a plain substring scan (`scan`) at
 * once, and switches to MiniSearch (prefix + fuzzy) as soon as it is built.
 */
import MiniSearch, { type Options, type SearchOptions } from "minisearch";
import { isRomaji, toKana, toRomaji } from "wanakana";

export type DocType = "term" | "symbol" | "phrase" | "convention";

export interface SearchDoc {
  /** Unique across collections: `${type}:${id}`. */
  key: string;
  id: string;
  type: DocType;
  url: string;
  ja: string;
  reading: string;
  romaji: string;
  en: string;
  /** What the result row shows under the Japanese. */
  label: string;
  hint: string;
  verified: boolean;
  /** 説明の訳（英語の用語ではない）: en is this project's paraphrase, not an English term. */
  gloss: boolean;
}

/**
 * One row of search-index.json:
 *   [type, id, ja[], reading, en[], extra, bits]
 * type: t / s / p / c. ja[0] and en[0] are what a result row shows.
 * extra: the situation for phrases (it is part of the URL), else "".
 * bits: 1 = verified, 2 = explanatory translation.
 */
export type CompactDoc = [string, string, string[], string, string[], string, number];
export interface CompactIndex {
  v: 2;
  docs: CompactDoc[];
}

export const TYPE_CODE: Record<DocType, string> = { term: "t", symbol: "s", phrase: "p", convention: "c" };
const CODE_TYPE: Record<string, DocType> = { t: "term", s: "symbol", p: "phrase", c: "convention" };

export const BIT_VERIFIED = 1;
export const BIT_GLOSS = 2;

export function urlOf(type: DocType, id: string, extra: string): string {
  switch (type) {
    case "term":
      return `/terms/${id}/`;
    case "symbol":
      return `/symbols/${id}/`;
    case "convention":
      return `/conventions/${id}/`;
    case "phrase":
      return `/phrases/${extra}/#${id}`;
  }
}

const romajiOf = (reading: string): string => {
  if (!reading) return "";
  const r = toRomaji(reading);
  return `${r} ${r.replace(/[^a-z0-9]/gi, "")}`;
};

export function expand(index: CompactIndex): SearchDoc[] {
  return index.docs.map(([code, id, ja, reading, en, extra, bits]) => {
    const type = CODE_TYPE[code];
    return {
      key: `${code}:${id}`,
      id,
      type,
      url: urlOf(type, id, extra),
      ja: ja.join(" "),
      reading,
      // Symbols carry their Japanese reading (spoken_ja), which is not kana-only.
      romaji: type === "term" ? romajiOf(reading) : "",
      en: en.join(" "),
      label: ja[0],
      hint: en[0] ?? "",
      verified: (bits & BIT_VERIFIED) !== 0,
      gloss: (bits & BIT_GLOSS) !== 0,
    };
  });
}

const CJK = /[぀-ヿ㐀-鿿豈-﫿]/;
const RUNS = /[぀-ヿ㐀-鿿豈-﫿]+|[A-Za-z0-9'’]+/g;

/**
 * MiniSearch splits on whitespace, which never fires inside Japanese text.
 * Latin runs stay whole words; Japanese runs contribute the whole run plus
 * every bigram, so 解の公式 is reachable from 公式 as well as from 解.
 */
export function tokenize(text: string): string[] {
  const out: string[] = [];
  for (const run of text.match(RUNS) ?? []) {
    out.push(run);
    if (CJK.test(run) && run.length > 1) {
      for (let i = 0; i < run.length - 1; i++) out.push(run.slice(i, i + 2));
    }
  }
  return out;
}

export const indexOptions: Options<SearchDoc> = {
  idField: "key",
  fields: ["ja", "reading", "romaji", "en"],
  storeFields: ["key", "id", "type", "url", "label", "reading", "hint", "verified", "gloss"],
  tokenize,
  processTerm: (t: string) => t.toLowerCase(),
};

/**
 * Query-side tokenizer. Indexing keeps the whole Japanese run so exact matches
 * rank first, but a query must not carry that run as a token: combineWith
 * "AND" would then demand a run the index never stored, and 詰まって would
 * miss どこで詰まっているかを伝える. Queries therefore reduce to bigrams.
 */
export function tokenizeQuery(text: string): string[] {
  const out: string[] = [];
  for (const run of text.match(RUNS) ?? []) {
    if (CJK.test(run) && run.length > 2) {
      for (let i = 0; i < run.length - 1; i++) out.push(run.slice(i, i + 2));
    } else {
      out.push(run);
    }
  }
  return out;
}

export const searchOptions: SearchOptions = {
  tokenize: tokenizeQuery,
  prefix: true,
  fuzzy: 0.2,
  combineWith: "AND",
  boost: { ja: 4, reading: 3, en: 3, romaji: 2 },
};

export function createIndex(docs: SearchDoc[]): MiniSearch<SearchDoc> {
  const mini = new MiniSearch<SearchDoc>(indexOptions);
  mini.addAll(docs);
  return mini;
}

/** The query as typed, and as kana when the input looks like romaji. */
export function queryForms(raw: string): string[] {
  const q = raw.trim();
  if (!q) return [];
  const forms = [q];
  if (isRomaji(q)) {
    // IME mode keeps a trailing n as "n" (the user may be typing "na"); the
    // plain form reads it as ん, which is what a finished word needs.
    for (const kana of [toKana(q), toKana(q, { IMEMode: true })]) {
      if (kana && kana !== q && !forms.includes(kana)) forms.push(kana);
    }
  }
  return forms;
}

/** Runs every query form through MiniSearch and merges the hits in order. */
export function search(mini: MiniSearch<SearchDoc>, raw: string, limit = 50): SearchDoc[] {
  const seen = new Set<string>();
  const results: SearchDoc[] = [];
  for (const query of queryForms(raw)) {
    for (const hit of mini.search(query, searchOptions)) {
      const doc = hit as unknown as SearchDoc;
      if (seen.has(doc.key)) continue;
      seen.add(doc.key);
      results.push(doc);
    }
  }
  return results.slice(0, limit);
}

/**
 * Substring scan used until MiniSearch is built (a few milliseconds over the
 * whole index, even on a throttled phone). Ranks: an exact headword or reading
 * first, then a headword/reading prefix, then anything that contains the query.
 */
export function scan(docs: SearchDoc[], raw: string, limit = 50): SearchDoc[] {
  return scored(docs, raw)
    .slice(0, limit)
    .map((s) => s[2]);
}

function scored(docs: SearchDoc[], raw: string): [number, number, SearchDoc][] {
  const forms = queryForms(raw).map((f) => f.toLowerCase());
  if (!forms.length) return [];
  const out: [number, number, SearchDoc][] = [];
  for (const d of docs) {
    const heads = [d.label.toLowerCase(), d.reading, d.hint.toLowerCase()];
    const hay = `${d.ja} ${d.reading} ${d.romaji} ${d.en}`.toLowerCase();
    let best = 0;
    for (const f of forms) {
      if (heads.includes(f)) best = Math.max(best, 3);
      else if (heads.some((h) => h.startsWith(f))) best = Math.max(best, 2);
      else if (hay.includes(f)) best = Math.max(best, 1);
    }
    // Within a rank, the shorter headword first: 微分係数 before 微分可能性の定義.
    if (best) out.push([best, d.label.length, d]);
  }
  out.sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  return out;
}

/**
 * What the page shows. Before MiniSearch is built: the scan. After: headwords
 * and readings that equal or start with the query first (a dictionary must put
 * 微分 above everything that merely contains it), then MiniSearch's ranking,
 * which adds bigram and fuzzy matches.
 */
export function lookup(docs: SearchDoc[], mini: MiniSearch<SearchDoc> | null, raw: string, limit = 50): SearchDoc[] {
  if (!mini) return scan(docs, raw, limit);
  const all = scored(docs, raw);
  const heads = all.filter((s) => s[0] >= 2).map((s) => s[2]);
  const seen = new Set(heads.map((d) => d.key));
  const out = [...heads];
  const add = (d: SearchDoc) => {
    if (seen.has(d.key)) return;
    seen.add(d.key);
    out.push(d);
  };
  search(mini, raw, limit).forEach(add);
  // Substrings MiniSearch's tokenizer drops (≤, ∫, x²) still come back from the scan.
  all.forEach(([, , d]) => add(d));
  return out.slice(0, limit);
}
