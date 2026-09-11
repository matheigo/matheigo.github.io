/**
 * Search behaviour, shared by the site and by tests/search.test.ts.
 *
 * PLAN.md 13 names the failure mode to guard against: Japanese input being
 * weak. The three queries in that risk row - かいのこうしき / kainokoushiki /
 * quadratic - are asserted in the test suite.
 */
import MiniSearch, { type Options, type SearchOptions } from "minisearch";
import { isRomaji, toKana } from "wanakana";

export interface SearchDoc {
  id: string;
  type: "term" | "symbol" | "phrase" | "convention";
  url: string;
  ja: string;
  reading: string;
  romaji: string;
  en: string;
  hint: string;
  confidence: string;
  level: string;
}

const CJK = /[\u3040-\u30FF\u3400-\u9FFF\uF900-\uFAFF]/;
const RUNS = /[\u3040-\u30FF\u3400-\u9FFF\uF900-\uFAFF]+|[A-Za-z0-9'\u2019]+/g;

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
  fields: ["ja", "reading", "romaji", "en"],
  storeFields: ["id", "type", "url", "ja", "reading", "en", "hint"],
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

/** Runs the query as typed, and again as kana when the input looks like romaji. */
export function search(mini: MiniSearch<SearchDoc>, raw: string, limit = 30): SearchDoc[] {
  const q = raw.trim();
  if (!q) return [];

  const queries = [q];
  if (isRomaji(q)) {
    const kana = toKana(q, { IMEMode: true });
    if (kana && kana !== q) queries.push(kana);
  }

  const seen = new Set<string>();
  const results: SearchDoc[] = [];
  for (const query of queries) {
    for (const hit of mini.search(query, searchOptions)) {
      const doc = hit as unknown as SearchDoc;
      if (seen.has(doc.id)) continue;
      seen.add(doc.id);
      results.push(doc);
    }
  }
  return results.slice(0, limit);
}
