/**
 * Corpus evidence: the logic behind PLAN.md 15.
 *
 * Nothing here touches the network or the filesystem, so it is unit-testable
 * without a corpus. fetch.ts brings transcripts in, count.ts walks them,
 * decide.ts writes `evidence` back into data/.
 *
 * The transcripts themselves never enter the repository (corpus/ is ignored).
 * What gets committed is counts, source ids and a date.
 */

export type Register = "spoken" | "written";

export interface CorpusDoc {
  /** Stable id used in `evidence.sources`, e.g. mit-18.01, khan-ap-calc, yt:profleonard. */
  id: string;
  register: Register;
  /** Auto-generated captions misread formulas; symbols must not rely on them. */
  auto: boolean;
  text: string;
  /** Path under corpus/, for reports. */
  file?: string;
}

export interface Counts {
  [candidate: string]: number;
}

// ---------------------------------------------------------------- normalize

/**
 * Spellings of the same spoken form. Left side is what appears in
 * transcripts and captions; right side is what we count as.
 * Grow this as count.ts reports near-misses.
 */
export const VARIANTS: [RegExp, string][] = [
  [/\bf[-\s]?prime\b/g, "f prime"],
  [/\bf[-\s]?double[-\s]?prime\b/g, "f double prime"],
  [/\bd\s?x\b/g, "dx"],
  [/\bd\s?y\b/g, "dy"],
  [/\bdee\s?(ex|why)\b/g, "dx"],
  [/\b(\w+)[-\s]squared\b/g, "$1 squared"],
  [/\b(\w+)[-\s]cubed\b/g, "$1 cubed"],
  [/\bintergral\b/g, "integral"],
  [/\bderivitive\b/g, "derivative"],
  [/\bcoeffecient\b/g, "coefficient"],
  [/\bplug\s+it\s+in\b/g, "plug in"],
  [/\bplugging\s+in\b/g, "plug in"],
  [/\bplugs?\s+into\b/g, "plug into"],
  [/\bsubstituting\b/g, "substitute"],
  [/\bsubstitutes?\b/g, "substitute"],
  [/\bsquare\s+rooting\b/g, "square root"],
];

/** Numbers spoken aloud. Transcripts mix digits and words. */
export const NUMBER_WORDS: Record<string, string> = {
  "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four",
  "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine",
  "10": "ten", "100": "one hundred",
};

export function normalize(text: string): string {
  let out = text
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\[[^\]]*\]/g, " ") // [INAUDIBLE], [MUSIC] and friends
    .replace(/\s+/g, " ");

  out = out.replace(/\b\d+\b/g, (d) => NUMBER_WORDS[d] ?? d);
  for (const [re, to] of VARIANTS) out = out.replace(re, to);
  return out.replace(/\s+/g, " ").trim();
}

// ------------------------------------------------------------ written text

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

const decodeEntities = (s: string) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : " ";
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });

/**
 * OpenStax CNXML to running prose (PLAN 15, written corpus). Inline MathML is
 * reduced to its tokens ("x = 3") so the words around it stay in one sentence:
 * "subtract <math>3</math> from both sides" still reads "subtract 3 from both
 * sides". Metadata ids and titles are dropped; the learning objectives in the
 * abstract are prose and stay.
 */
export function cnxmlToText(xml: string): string {
  return decodeEntities(
    xml
      .replace(/<md:(content-id|uuid|title)>[\s\S]*?<\/md:\1>/g, " ")
      .replace(/<m:math\b[\s\S]*?<\/m:math>/g, (math) => {
        const tokens = [...math.matchAll(/<m:(mi|mn|mo|mtext)\b[^>]*>([\s\S]*?)<\/m:\1>/g)].map((t) => t[2].trim());
        return ` ${tokens.filter(Boolean).join(" ")} `;
      })
      .replace(/<\/(para|item|title|caption|td|th|entry|li)>|<newline\s*\/>/g, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[\u2061-\u2064\u200b]/g, "") // invisible times / function application
    .replace(/[ \t\r\f\v]+/g, " ")
    .replace(/ *\n[\s]*/g, "\n")
    .trim();
}

// ------------------------------------------------------------------- dedupe

/** Sentences shorter than this are left alone: "plug it in." is said again, not copied. */
export const DEDUPE_MIN_WORDS = 8;
/** A file whose 8-word shingles are mostly seen already is another copy of the same talk or section. */
export const DUPLICATE_FILE_SHARE = 0.5;
const SHINGLE = 8;

export interface DedupeStats {
  files: number;
  droppedFiles: number;
  droppedSentences: number;
  wordsBefore: number;
  wordsAfter: number;
}

/** FNV-1a, so the seen-set holds numbers rather than millions of strings. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

const wordCount = (s: string) => s.split(" ").filter(Boolean).length;

/**
 * Counts must not see the same words twice. OCW publishes many recitations
 * twice (a YouTube id and an MIT18_01SCF10Rec_nn name), and every lecture
 * opens with the same license notice; OpenStax books share sections. Two
 * passes over normalized text, in manifest order, across all sources:
 *
 *   file      if DUPLICATE_FILE_SHARE of a file's 8-word shingles were seen
 *             in earlier files, the file is a copy and is dropped whole
 *   sentence  in the files that stay, a sentence of DEDUPE_MIN_WORDS or more
 *             words that was seen before (in any file) is removed
 *
 * The first copy wins, so manifest order decides which file keeps the text.
 */
export function dedupe<T extends CorpusDoc>(docs: T[]): { docs: T[]; stats: Record<string, DedupeStats>; dropped: T[] } {
  const seenShingles = new Set<number>();
  const seenSentences = new Set<number>();
  const stats: Record<string, DedupeStats> = {};
  const out: T[] = [];
  const dropped: T[] = [];

  for (const doc of docs) {
    const st = (stats[doc.id] ??= { files: 0, droppedFiles: 0, droppedSentences: 0, wordsBefore: 0, wordsAfter: 0 });
    const words = doc.text.split(" ").filter(Boolean);
    st.files++;
    st.wordsBefore += words.length;

    const shingles: number[] = [];
    for (let i = 0; i + SHINGLE <= words.length; i++) shingles.push(hash(words.slice(i, i + SHINGLE).join(" ")));
    const seen = shingles.filter((h) => seenShingles.has(h)).length;
    if (shingles.length > 0 && seen / shingles.length >= DUPLICATE_FILE_SHARE) {
      st.droppedFiles++;
      dropped.push(doc);
      continue;
    }
    for (const h of shingles) seenShingles.add(h);

    const kept: string[] = [];
    for (const sentence of doc.text.split(/(?<=[.?!])\s+/)) {
      if (wordCount(sentence) >= DEDUPE_MIN_WORDS) {
        const h = hash(sentence);
        if (seenSentences.has(h)) {
          st.droppedSentences++;
          continue;
        }
        seenSentences.add(h);
      }
      kept.push(sentence);
    }
    const text = kept.join(" ");
    st.wordsAfter += wordCount(text);
    out.push({ ...doc, text });
  }
  return { docs: out, stats, dropped };
}

// -------------------------------------------------------------------- count

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Whole-phrase matches only: "plug in" must not fire inside "plug into". */
export function countPhrase(haystack: string, phrase: string): number {
  const p = normalize(phrase);
  if (!p) return 0;
  const re = new RegExp(`(?<![\\w-])${escape(p)}(?![\\w-])`, "g");
  return (haystack.match(re) ?? []).length;
}

/**
 * Wildcard match for symbol readings (DECISIONS 修正 4). A reading names its
 * variables ("from a to b"), but a lecture integrates from 0 to 1, from
 * negative infinity to infinity ... so a literal count finds almost nothing.
 * In a pattern each `*` stands for one to WILDCARD_MAX words; everything else
 * is literal and whole-phrase, as in countPhrase. terms / phrases stay literal.
 */
export const WILDCARD_MAX = 5;

export function countPattern(haystack: string, pattern: string): number {
  const parts = normalize(pattern.replace(/\*/g, " \u0000 ")).split(" ").filter(Boolean);
  if (parts.length === 0 || parts.every((w) => w === "\u0000")) return 0;
  const slot = `[^ ]+(?: [^ ]+){0,${WILDCARD_MAX - 1}}?`;
  const body = parts.map((w) => (w === "\u0000" ? slot : escape(w))).join(" ");
  const re = new RegExp(`(?<![\\w-])${body}(?![\\w-])`, "g");
  return (haystack.match(re) ?? []).length;
}

/**
 * Symbol readings counted as patterns: symbol id -> reading as written in
 * spoken_en -> the pattern counted for it. The pattern is also the key the
 * counts and `evidence` are recorded under, so nobody mistakes a pattern
 * count for a literal one.
 */
export const SYMBOL_PATTERNS: Record<string, Record<string, string>> = {
  "integral-definite": {
    "the integral from a to b of f of x d x": "the integral from * to * of",
    "the integral of f of x from a to b": "the integral of * from * to *",
  },
};

/** The wording a candidate is counted and recorded as. */
export function countedAs(collection: string, id: string, wording: string): string {
  return collection === "symbols" ? (SYMBOL_PATTERNS[id]?.[wording] ?? wording) : wording;
}

export interface ContextHit {
  candidate: string;
  source: string;
  snippet: string;
}

/** Eight words either side, for human review. Written to a temp file, never committed. */
export function contexts(haystack: string, phrase: string, source: string, limit = 5): ContextHit[] {
  const p = normalize(phrase);
  const re = new RegExp(`((?:\\S+\\s+){0,8})(${escape(p)})((?:\\s+\\S+){0,8})`, "g");
  const out: ContextHit[] = [];
  for (const m of haystack.matchAll(re)) {
    out.push({ candidate: phrase, source, snippet: `${m[1]}[${m[2]}]${m[3]}`.trim() });
    if (out.length >= limit) break;
  }
  return out;
}

// ----------------------------------------------------------------- decide

export const RATIO = 3; // "3:1 以上" (PLAN 15)
export const MIN_TOTAL = 10; // fewer than this and the corpus has not spoken

/**
 * Three outcomes, not two (the user's call on 2026-09-11):
 *
 *   single     one wording leads by RATIO or more -> it becomes the headword
 *   both       no leader, but two or more wordings each clear MIN_TOTAL ->
 *              record them side by side in frequency order. "plug in" and
 *              "substitute" are both what people say; picking one would be
 *              the dictionary inventing a preference the corpus does not show
 *   undecided  the corpus has too little to say -> a human looks at it
 */
export type Verdict =
  | { kind: "single"; register: Register; head: string; runnerUp: string | null; ratio: number; total: number }
  | { kind: "both"; register: Register; heads: string[]; counts: number[]; total: number }
  | { kind: "undecided"; reason: "too-few" | "too-close"; total: number };

export function decide(counts: Counts, register: Register): Verdict {
  const ranked = Object.entries(counts)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);
  const total = ranked.reduce((s, [, n]) => s + n, 0);

  if (total < MIN_TOTAL) return { kind: "undecided", reason: "too-few", total };

  if (ranked.length === 1) {
    return { kind: "single", register, head: ranked[0][0], runnerUp: null, ratio: Infinity, total };
  }

  const [head, headN] = ranked[0];
  const [runnerUp, runnerN] = ranked[1];
  const ratio = runnerN === 0 ? Infinity : headN / runnerN;
  if (ratio >= RATIO) return { kind: "single", register, head, runnerUp, ratio, total };

  // No leader. Anything that clears the floor on its own is genuinely in use.
  const standing = ranked.filter(([, n]) => n >= MIN_TOTAL);
  if (standing.length >= 2) {
    return {
      kind: "both",
      register,
      heads: standing.map(([name]) => name),
      counts: standing.map(([, n]) => n),
      total,
    };
  }

  return { kind: "undecided", reason: "too-close", total };
}

/** The wording(s) the corpus settled on for a register, in frequency order. */
export function headsOf(v: Verdict): string[] {
  if (v.kind === "single") return [v.head];
  if (v.kind === "both") return v.heads;
  return [];
}

/**
 * Words that may be dropped when a wording is quoted in short form: articles,
 * prepositions, and the variables themselves. "f prime of x" -> "f prime" is
 * the same wording; "substitute back" -> "substitute" is not, because "back"
 * carries meaning.
 */
const ARGUMENT_WORDS = new Set([
  "a", "an", "the", "of", "to", "from", "for", "at", "in", "on", "by", "with",
  "respect", "it", "that", "this", "dx", "dy", "dt", "du",
]);

const isArgumentWord = (w: string) => ARGUMENT_WORDS.has(w) || w.length === 1;

/** Strips inflection only. integral / integrate / integration stay distinct. */
const stem = (w: string) => w.replace(/(ing|ed|es|s)$/, "").replace(/e$/, "");

/**
 * Are two wordings the same phrase? Only two things are folded together:
 *
 *   inflection        completing the square  ==  complete the square
 *   argument ellipsis f prime of x           ==  f prime
 *
 * Different words are never folded: integral / integrate / integration are
 * three wordings, and so are substitute / substitute back.
 */
export function sameWording(a: string, b: string): boolean {
  const wordsOf = (t: string) => normalize(t).split(" ").filter(Boolean);
  const [x, y] = [wordsOf(a), wordsOf(b)];
  if (x.length === 0 || y.length === 0) return false;

  const [short, long] = x.length <= y.length ? [x, y] : [y, x];
  const heads = short.every((w, i) => stem(w) === stem(long[i]));
  if (!heads) return false;
  if (short.length === long.length) return true;
  return long.slice(short.length).every(isArgumentWord);
}

export interface Merge {
  into: string;
  from: string[];
}

/**
 * Folds same-wording candidates together so they do not compete with each
 * other in decide(). Counts are summed into the canonical wording - never
 * dropped - and the merge is reported so a human can see what happened.
 */
export function mergeCandidates(
  counts: Record<string, Record<string, number>>,
  preferred: string,
): { counts: Record<string, Record<string, number>>; merges: Merge[] } {
  const groups: string[][] = [];
  for (const name of Object.keys(counts)) {
    const g = groups.find((group) => group.some((other) => sameWording(other, name)));
    if (g) g.push(name);
    else groups.push([name]);
  }

  const out: Record<string, Record<string, number>> = {};
  const merges: Merge[] = [];
  const total = (n: string) => Object.values(counts[n]).reduce((a, b) => a + b, 0);

  for (const group of groups) {
    const canonical =
      group.find((n) => normalize(n) === normalize(preferred)) ??
      [...group].sort((a, b) => total(b) - total(a))[0];
    const bucket: Record<string, number> = {};
    for (const n of group) {
      for (const [src, v] of Object.entries(counts[n])) bucket[src] = (bucket[src] ?? 0) + v;
    }
    out[canonical] = bucket;
    if (group.length > 1) merges.push({ into: canonical, from: group.filter((n) => n !== canonical) });
  }
  return { counts: out, merges };
}

/**
 * Per-source weights that cap any one source's contribution (PLAN 15: no
 * channel above 25%) WITHOUT rejecting it. Water-filling: each source is
 * capped at max(25%, 1/n), and the excess is redistributed over the rest.
 * With a single source the cap is 100%, so an OCW-only corpus still works -
 * which is the state this project starts in.
 */
export function sourceWeights(words: Record<string, number>): Record<string, number> {
  const ids = Object.keys(words).filter((id) => words[id] > 0);
  const n = ids.length;
  if (n === 0) return {};
  if (n === 1) return { [ids[0]]: 1 };

  const total = ids.reduce((s2, id) => s2 + words[id], 0);
  const cap = Math.max(MAX_SHARE, 1 / n);
  const share: Record<string, number> = Object.fromEntries(ids.map((id) => [id, words[id] / total]));

  const capped = new Set<string>();
  for (let pass = 0; pass < n; pass++) {
    const over = ids.filter((id) => !capped.has(id) && share[id] > cap + 1e-12);
    if (over.length === 0) break;
    let excess = 0;
    for (const id of over) {
      excess += share[id] - cap;
      share[id] = cap;
      capped.add(id);
    }
    const free = ids.filter((id) => !capped.has(id));
    const freeMass = free.reduce((s2, id) => s2 + share[id], 0);
    if (free.length === 0 || freeMass === 0) break;
    for (const id of free) share[id] += (excess * share[id]) / freeMass;
  }

  return Object.fromEntries(ids.map((id) => [id, share[id] / (words[id] / total)]));
}

/** Applies per-source weights and collapses to one number per candidate. */
export function weigh(
  counts: Record<string, Record<string, number>>,
  weights: Record<string, number>,
): Counts {
  const out: Counts = {};
  for (const [candidate, bySource] of Object.entries(counts)) {
    let sum = 0;
    for (const [src, n] of Object.entries(bySource)) sum += n * (weights[src] ?? 1);
    out[candidate] = sum;
  }
  return out;
}

/** Raw totals, for the `evidence` block: what was actually observed. */
export function flatten(counts: Record<string, Record<string, number>>): Counts {
  return Object.fromEntries(
    Object.entries(counts).map(([c, bySource]) => [
      c,
      Object.values(bySource).reduce((a, b) => a + b, 0),
    ]),
  );
}

// ------------------------------------------------------------- corpus shape

export interface Balance {
  source: string;
  words: number;
  share: number;
}

/**
 * PLAN 15: no single channel above 25%, or the dictionary learns one
 * lecturer's habits. This is a weighting target, not a rejection threshold -
 * see sourceWeights(). balance() only reports the raw shape of the corpus.
 */
export const MAX_SHARE = 0.25;

export function balance(docs: CorpusDoc[]): { rows: Balance[]; over: Balance[] } {
  const words = new Map<string, number>();
  for (const d of docs) {
    const n = d.text.split(/\s+/).filter(Boolean).length;
    words.set(d.id, (words.get(d.id) ?? 0) + n);
  }
  const total = [...words.values()].reduce((a, b) => a + b, 0) || 1;
  const rows = [...words.entries()]
    .map(([source, w]) => ({ source, words: w, share: w / total }))
    .sort((a, b) => b.words - a.words);
  return { rows, over: rows.filter((r) => r.share > MAX_SHARE) };
}

/** Candidate wordings to count for one entry (PLAN 15, step 3). */
export function candidatesOf(collection: string, entry: Record<string, unknown>): string[] {
  const out: string[] = [];
  if (collection === "terms") {
    const en = entry.en as { term: string; alt?: string[]; variants?: { term: string }[] };
    out.push(en.term, ...(en.alt ?? []), ...(en.variants ?? []).map((v) => v.term));
    for (const c of (entry.collocations as { en: string }[] | undefined) ?? []) out.push(c.en);
  } else if (collection === "symbols") {
    for (const s of (entry.spoken_en as { text: string }[]) ?? []) out.push(countedAs(collection, entry.id as string, s.text));
  } else if (collection === "phrases") {
    out.push(entry.en as string);
    for (const v of (entry.variants as { en: string }[] | undefined) ?? []) out.push(v.en);
  }
  return [...new Set(out.map((s) => s.trim()).filter(Boolean))];
}
