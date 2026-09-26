/**
 * Math Stack Exchange as a witness of how students word a question
 * (DECISIONS, Phase 3 フレーズ 3 の前の修正 1). Phrases only - never terms or
 * symbols. Only counts are used: the Stack Exchange API's full-text search
 * (site=math, the key part in quotes for an exact match, a filter that returns
 * the total and nothing else). No post text is fetched or kept.
 *
 * Where it counts (lib.ts phraseGroup):
 *   student  class-asking, office-hours, group-study and a student's question
 *            at an exam: when the leading key part in the MICASE students'
 *            utterances is used fewer than PHRASE_ATTESTED times, a key part
 *            asked PHRASE_ATTESTED times or more on Math Stack Exchange makes
 *            the phrase likely (flag corpus-attested-only, the note naming Math
 *            Stack Exchange). Never in ①② (the counts are not set against
 *            the corpus)
 *   email    email, discord: STUDENT_SEEN times or more in the MICASE students'
 *            utterances or on Math Stack Exchange is likely
 *
 * The search matches words exactly (no inflection: "graded incorrect" does not
 * find "graded incorrectly"), so a key part is searched as its alternatives
 * ("A | B") one by one and the totals are added, as the forms of one wording
 * add up in the corpus. A "!w" mark cannot be searched and is dropped (the
 * count is then looser); an alternative with a "…" blank cannot be searched
 * and is not counted. A question holding two alternatives counts twice.
 *
 * The totals are cached in MSE_CACHE (committed: counts and dates only).
 * fetch-mse.ts fills it; decide.ts and probe.ts only read it.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FORM_OR, flatten, phraseBelowFloor, PHRASE_ATTESTED, STUDENT_SEEN, type BySource, type PhraseGroup } from "./lib.js";

export const MSE_CACHE = path.join(path.dirname(fileURLToPath(import.meta.url)), "mse-counts.json");

/** One exact-phrase search: the query as sent and its total. */
export interface MseHit {
  total: number;
  fetched: string;
}

export type MseCache = Record<string, MseHit>;

export function loadMseCache(file = MSE_CACHE): MseCache {
  return fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, "utf8")) as MseCache) : {};
}

export function saveMseCache(cache: MseCache, file = MSE_CACHE): void {
  const sorted = Object.fromEntries(Object.keys(cache).sort().map((k) => [k, cache[k]]));
  fs.writeFileSync(file, JSON.stringify(sorted, null, 2) + "\n", "utf8");
}

/**
 * Alternatives of a key part not searched on Math Stack Exchange: on a site of
 * written mathematics questions their words mostly carry another, mathematical
 * sense, and the post text that would tell them apart is not fetched (counts
 * only). Decided from the words alone, before any count was seen
 * (DECISIONS, Phase 3 フレーズ 3 の前の修正 1).
 */
export const MSE_SKIP: Record<string, string> = {
  "scroll up": "the asker pointing readers to the post",
  "scroll back up": "the asker pointing readers to the post",
  "go back to the previous": "the previous step or equation",
  "more slowly": "a rate of growth or convergence",
  "a little slower": "a rate of growth or convergence",
  "a bit slower": "a rate of growth or convergence",
  "slow down a little": "motion or a rate",
  "slow down a bit": "motion or a rate",
  "have a second": "a second derivative, root or solution",
  "got a second": "a second derivative, root or solution",
  "right direction": "the direction of a vector",
  "in the right direction": "the direction of a vector",
  "odd numbered": "odd-numbered terms",
  "odd-numbered": "odd-numbered terms",
  "only the odd": "odd terms or numbers",
  "what problems": "what problems arise (a general question)",
  "without a calculator": "working a problem by hand (the question itself), not whether a calculator is allowed",
};

/** The exact phrases a key part is searched as: one per alternative, "!w" dropped, "…" and MSE_SKIP not searched. */
export function mseQueries(keyPart: string): string[] {
  if (!keyPart.trim()) return [];
  const out: string[] = [];
  for (const alt of keyPart.split(FORM_OR)) {
    if (alt.includes("…")) continue;
    const words = alt
      .trim()
      .split(/\s+/)
      .filter((w) => !w.startsWith("!"));
    const q = words.join(" ").toLowerCase();
    if (q && !(q in MSE_SKIP)) out.push(q);
  }
  return [...new Set(out)];
}

/** A key part's total on Math Stack Exchange (its alternatives added), and the alternatives not in the cache yet. */
export function mseCount(keyPart: string, cache: MseCache): { hits: number; missing: string[]; searched: number } {
  let hits = 0;
  const missing: string[] = [];
  const queries = mseQueries(keyPart);
  for (const q of queries) {
    const hit = cache[q];
    if (hit) hits += hit.total;
    else missing.push(q);
  }
  return { hits, missing, searched: queries.length };
}

/**
 * The leading key part on Math Stack Exchange (first key part wins a tie, the
 * headline sentence's coming first), or null when none of them can be searched.
 */
export function mseLeader(
  keyParts: string[],
  cache: MseCache,
): { wording: string; hits: number; missing: string[]; all: { wording: string; hits: number }[] } | null {
  const all = keyParts
    .filter((k) => mseQueries(k).length)
    .map((k) => ({ wording: k, ...mseCount(k, cache) }));
  if (!all.length) return null;
  const lead = all.reduce((a, b) => (b.hits > a.hits ? b : a));
  return {
    wording: lead.wording,
    hits: lead.hits,
    missing: all.flatMap((a) => a.missing),
    all: all.map((a) => ({ wording: a.wording, hits: a.hits })),
  };
}

/** Groups Math Stack Exchange is used for (phrases said or written by a student). */
export const MSE_GROUPS: PhraseGroup[] = ["student", "email"];

/**
 * Whether a phrase goes to Math Stack Exchange: a student phrase none of whose
 * key parts reaches 10 in the MICASE students' utterances and whose leader is
 * used fewer than PHRASE_ATTESTED times; an email / discord phrase whose most
 * used key part is there fewer than STUDENT_SEEN times.
 */
export function needsMse(group: PhraseGroup | null, spoken: BySource, weights: Record<string, number>): boolean {
  if (group === "student") {
    const below = phraseBelowFloor(spoken, weights);
    return below !== null && below.hits < PHRASE_ATTESTED;
  }
  if (group === "email") {
    const top = Math.max(0, ...Object.values(flatten(spoken)));
    return top < STUDENT_SEEN;
  }
  return false;
}
