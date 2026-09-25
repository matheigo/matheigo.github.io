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
  // OpenStax CNXML: inline math padded with spaces splits "x-axis" into
  // "x -axis" (1,011 times in the written corpus against 32 joined).
  [/\b([a-z]) -(?=[a-z])/g, "$1-"],
  // The same for an ordinal suffix glued to inline math: "<m:math>n</m:math>th
  // term" reads "n th term" (138 times in the written corpus).
  [/\b([a-z]) th\b/g, "$1th"],
  // Hyphenation only. "u sub" is left alone: it is also how a subscript is read (u sub n).
  [/\bu\s+substitution/g, "u-substitution"],
  [/\banti[-\s]derivative/g, "antiderivative"],
  // Hyphenation of compound modifiers (Phase 2 数列・級数の単元): captions write
  // "p series", "vector valued", "term by term", "first order"; OpenStax hyphenates
  [/\bp\s+series\b/g, "p-series"],
  [/\bvector\s+valued\b/g, "vector-valued"],
  [/\bterm\s+by\s+term\b/g, "term-by-term"],
  [/\b(first|second)\s+order\b/g, "$1-order"],
  // Leibniz notation typed with a slash in captions ("dy/dx") is said "dy dx"
  [/\bd([a-z])\/d([a-z])\b/g, "d$1 d$2"],
  // One name, three spellings: L'Hôpital (OpenStax), L'Hopital (captions), L'Hospital (older)
  [/\bl'?h[oô]s?pital/g, "l'hopital"],
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
      // math glued to a hyphenated word ("<m:math>x</m:math>-axis") stays glued
      .replace(/<\/m:math>-(?=\w)/g, "</m:math>\u0001")
      .replace(/<m:math\b[\s\S]*?<\/m:math>/g, (math) => {
        const tokens = [...math.matchAll(/<m:(mi|mn|mo|mtext)\b[^>]*>([\s\S]*?)<\/m:\1>/g)].map((t) => t[2].trim());
        return ` ${tokens.filter(Boolean).join(" ")} `;
      })
      .replace(/<\/(para|item|title|caption|td|th|entry|li)>|<newline\s*\/>/g, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/ *\u0001/g, "-")
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

// ------------------------------------------------------------------ wording

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

/**
 * Latin and Greek plurals, which the suffix rule cannot see: local extrema is
 * the plural of local extremum, not another wording (DECISIONS, Phase 2 微分の
 * 単元). Plural -> singular. Words with two readings (bases: base / basis,
 * ellipses: ellipse / ellipsis) are left out.
 */
const IRREGULAR: Record<string, string> = {
  extrema: "extremum",
  maxima: "maximum",
  minima: "minimum",
  vertices: "vertex",
  radii: "radius",
  axes: "axis",
  matrices: "matrix",
  indices: "index",
  criteria: "criterion",
  foci: "focus",
  loci: "locus",
  formulae: "formula",
  hypotheses: "hypothesis",
  parentheses: "parenthesis",
};

/** Strips inflection only. integral / integrate / integration stay distinct. */
const stem = (w: string): string =>
  IRREGULAR[w] ? stem(IRREGULAR[w]) : w.replace(/(ing|ed|es|s)$/, "").replace(/e$/, "");

/**
 * The blank in a verb phrase with an object in the middle: "revolve … around
 * the x-axis" (DECISIONS, Phase 2 修正). Written "…" or "...".
 */
export const GAP = /^(?:\u2026|\.\.\.)$/;
export const GAP_MIN = 1;
export const GAP_MAX = 3;

/** The words of a wording, without the blank. */
const wordsOf = (t: string) => normalize(t).split(" ").filter((w) => w && !GAP.test(w));

/**
 * Words matched exactly as written when a term is counted: articles,
 * prepositions, pronouns, auxiliaries, number words and anything of two
 * letters or fewer. Folding "the" by its stem would also match "these" and
 * "thing"; folding "one" would match "on".
 */
const CLOSED_CLASS = new Set([
  ...ARGUMENT_WORDS,
  "and", "or", "but", "nor", "is", "are", "was", "were", "be", "been", "being", "as", "than", "then",
  "so", "if", "not", "no", "never", "these", "those", "its", "their", "your", "our", "we", "you",
  "they", "he", "she", "into", "onto", "over", "under", "between", "around", "about", "along",
  "through", "up", "down", "out", "off", "each", "every", "all", "any", "some", "what", "which",
  "who", "how", "when", "where", "there", "here", "has", "have", "had", "do", "does", "did", "can",
  "will", "would", "should", "must", "may", "might",
  ...Object.values(NUMBER_WORDS),
]);

/**
 * Every form with the same stem (sameWording's notion of inflection):
 * plural, third person, past, -ing. revolve -> revolves, revolved, revolving.
 * A form of two letters or fewer is never generated: those are matched as
 * written (CLOSED_CLASS), and the bare stem of a three-letter word would be
 * one (DNE -> "dn", the pivot dₙ; use -> "us").
 */
export function inflections(word: string): string[] {
  const s = stem(word);
  const forms = new Set([word]);
  for (const e of ["", "e"]) {
    for (const x of ["", "s", "es", "ed", "ing"]) {
      const t = s + e + x;
      if (t.length > 2 && stem(t) === s) forms.add(t);
    }
  }
  for (const [plural, singular] of Object.entries(IRREGULAR)) {
    if (stem(singular) === s) forms.add(plural).add(singular);
  }
  return [...forms].sort((a, b) => b.length - a.length);
}

// -------------------------------------------------------------------- count

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Whole words only: "plug in" must not fire inside "plug into". */
const wholeWords = (body: string) => new RegExp(`(?<![\\w-])${body}(?![\\w-])`, "g");

/** Where each match starts. Matches of one wording do not overlap. */
function starts(haystack: string, re: RegExp | null): number[] {
  if (!re) return [];
  return [...haystack.matchAll(re)].map((m) => m.index ?? 0);
}

function phraseRegex(phrase: string): RegExp | null {
  const p = normalize(phrase);
  return p ? wholeWords(escape(p)) : null;
}

/**
 * Terms (DECISIONS, Phase 2 修正): a content word also matches its
 * inflections (Riemann sum / Riemann sums, revolve / revolved), and a blank
 * "…" in a verb phrase matches GAP_MIN to GAP_MAX words that do not end a
 * sentence. Everything else is literal, as in countPhrase.
 */
function termRegex(phrase: string): RegExp | null {
  const words = normalize(phrase).split(" ").filter(Boolean);
  while (words.length && GAP.test(words[0])) words.shift();
  while (words.length && GAP.test(words[words.length - 1])) words.pop();
  if (words.length === 0) return null;
  const body = words
    .map((w, i) => {
      const sep = i === words.length - 1 ? "" : " ";
      if (GAP.test(w)) return `(?:[^ ]*[^ .?!] ){${GAP_MIN},${GAP_MAX}}`;
      const m = w.match(/^([a-z]{3,})([^a-z0-9'-]*)$/);
      if (!m || CLOSED_CLASS.has(m[1])) return escape(w) + sep;
      return `(?:${inflections(m[1]).map(escape).join("|")})${escape(m[2])}${sep}`;
    })
    .join("");
  return wholeWords(body);
}

/**
 * Wildcard match for symbol readings (DECISIONS 修正 4). A reading names its
 * variables ("from a to b"), but a lecture integrates from 0 to 1, from
 * negative infinity to infinity ... so a literal count finds almost nothing.
 * In a pattern each `*` stands for one to WILDCARD_MAX words; everything else
 * is literal and whole-phrase, as in countPhrase.
 */
export const WILDCARD_MAX = 5;

function patternRegex(pattern: string): RegExp | null {
  const parts = normalize(pattern.replace(/\*/g, " \u0000 ")).split(" ").filter(Boolean);
  if (parts.length === 0 || parts.every((w) => w === "\u0000")) return null;
  const slot = `[^ ]+(?: [^ ]+){0,${WILDCARD_MAX - 1}}?`;
  return wholeWords(parts.map((w) => (w === "\u0000" ? slot : escape(w))).join(" "));
}

/** Literal whole-phrase count. phrases are counted this way. */
export function countPhrase(haystack: string, phrase: string): number {
  return starts(haystack, phraseRegex(phrase)).length;
}

/** Inflection-folded count with blanks. terms are counted this way. */
export function countTerm(haystack: string, phrase: string): number {
  return starts(haystack, termRegex(phrase)).length;
}

/** Wildcard count. symbols are counted this way. */
export function countPattern(haystack: string, pattern: string): number {
  return starts(haystack, patternRegex(pattern)).length;
}

/** How a collection's wordings are matched. */
export function matcherFor(collection: string): (wording: string) => RegExp | null {
  if (collection === "symbols") return patternRegex;
  if (collection === "terms") return termRegex;
  return phraseRegex;
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
  // The short reading "root x squared plus one" stays literal: a `*` cannot
  // leave out "square … of", so any pattern for it also counts the long one.
  "square-root": {
    "the square root of x squared plus one": "the square root of *",
  },
  "summation-sigma": {
    "the sum from k equals one to n of a sub k": "the sum from * to * of",
    "the sum of a k, k from one to n": "the sum of * from * to *",
  },
};

/**
 * Generic words counted in the form of a mathematical sentence (DECISIONS,
 * Phase 2 数列・級数の単元の前の修正): "goes to" alone is 26,571 spoken hits,
 * most of them not "approaches"; "as … goes to" is the limit. Entry id ->
 * wording as written in the entry -> the form it is counted as, with "…" a
 * one-to-three-word blank as usual. As with SYMBOL_PATTERNS, the form is also
 * the key in counts and `evidence`, and the references (CED, OpenStax) are
 * searched for the form too.
 */
export const TERM_FORMS: Record<string, Record<string, string>> = {
  approaches: {
    approaches: "as … approaches",
    "goes to": "as … goes to",
    "tends to": "as … tends to",
  },
  squeeze: {
    squeeze: "squeeze … between",
    sandwich: "sandwich … between",
  },
  // Generated with these forms from the start (Phase 2 数列・級数の単元)
  focus: { focus: "focus of the" }, // not "let's focus on"
  pole: { pole: "the pole" }, // not a pole of a function's pole diagram, or a flagpole
  "standard-form-of-a-conic": { "standard form": "standard form of the equation of" }, // not Ax + By = C
  "curl-vector": { curl: "curl of" },
  "divergence-vector": { divergence: "the divergence of" }, // not a divergent series
  "arithmetic-middle-term": { "arithmetic mean": "arithmetic mean of … and" }, // not the mean of a data set
  "geometric-middle-term": { "geometric mean": "geometric mean of … and" },
  "modulus-of-a-complex-number": { modulus: "modulus of" }, // not the modulus of a congruence
  "argument-of-a-complex-number": { argument: "argument of … complex number" }, // not the argument of a function
  // Phase 2 代数 2・Precalculus の単元
  solution: { solution: "solution to the equation" }, // not the solution to a homework problem
  remainder: { remainder: "the remainder is" }, // not the rest of a region
  symmetric: { symmetric: "symmetric about" }, // not a symmetric matrix
  tangent: { tangent: "tangent of", tan: "tan of" }, // the ratio, not the tangent line
  expansion: { expansion: "expansion of" },
  identity: { identity: "an identity" }, // not the identity matrix or function
};

/** The wording a candidate is counted and recorded as. */
export function countedAs(collection: string, id: string, wording: string): string {
  if (collection === "symbols") return SYMBOL_PATTERNS[id]?.[wording] ?? wording;
  if (collection === "terms") return TERM_FORMS[id]?.[wording] ?? wording;
  return wording;
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
  | {
      kind: "single";
      register: Register;
      head: string;
      runnerUp: string | null;
      ratio: number;
      total: number;
      dependsOn?: Dependence;
      /**
       * Short of RATIO, but the leader alone clears MIN_TOTAL: the runner-up
       * is a minor variant (DECISIONS, Phase 2 規則の修正).
       */
      byFloor?: boolean;
    }
  | {
      kind: "both";
      register: Register;
      heads: string[];
      counts: number[];
      total: number;
      dependsOn?: Dependence;
      /** Was ① until the leader's biggest source was taken out (decideRobust). */
      demoted?: boolean;
    }
  | { kind: "undecided"; reason: "too-few" | "too-close"; total: number };

/**
 * The leader's verdict rests on one source: without the source that gives the
 * leading wording most of its hits, the verdict is not the same.
 */
export interface Dependence {
  source: string;
  /** The leader's hits from that source, and from all sources (raw). */
  hits: number;
  of: number;
  /** The verdict without that source. */
  without: Verdict;
}

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
  // Only the leader clears the floor (axis of revolution 13 / axis of
  // rotation 7): the leader is the headword and the rest are minor variants,
  // even short of RATIO.
  if (standing.length === 1) return { kind: "single", register, head, runnerUp, ratio, total, byFloor: true };

  return { kind: "undecided", reason: "too-close", total };
}

/** The wording(s) the corpus settled on for a register, in frequency order. */
export function headsOf(v: Verdict): string[] {
  if (v.kind === "single") return [v.head];
  if (v.kind === "both") return v.heads;
  return [];
}

/**
 * Does `a` contain the wording `lead` and add to it? "the integrand is odd"
 * extends "integrand": a collocation built on the headword, not another way
 * to say it, so it is never set side by side with it.
 */
function extendsWording(a: string, lead: string): boolean {
  const [x, y] = [wordsOf(a).map(stem).join(" "), wordsOf(lead).map(stem).join(" ")];
  return x !== y && ` ${x} `.includes(` ${y} `);
}

/** Removes one source from every candidate's tally. */
function without(counts: BySource, source: string): BySource {
  return Object.fromEntries(
    Object.entries(counts).map(([c, by]) => [c, Object.fromEntries(Object.entries(by).filter(([s]) => s !== source))]),
  );
}

/**
 * decide(), then the one-source check (DECISIONS, Phase 2 規則の修正): take
 * out the source with the most hits for the leading wording and decide again.
 * If the verdict is not the same (same kind, same leader), the leader rests on
 * that source and the dependence is recorded. A single headword is lowered to
 * ② only when ANOTHER wording leads without that source - it is then set side
 * by side with that wording and whatever else stands. When the verdict merely
 * thins out (③ without the source, or ② under the same leader) nothing else
 * has overtaken it, so it stays ① with the source recorded. A ② stays ② and
 * only records the dependence. A collocation that contains the leader ("the
 * integrand is odd") is not another wording and never takes the lead from it.
 */
export function decideRobust(counts: BySource, weights: Record<string, number>, register: Register): Verdict {
  const weighted = weigh(counts, weights);
  const v = decide(weighted, register);
  if (v.kind === "undecided") return v;
  const lead = headsOf(v)[0];
  const bySource = Object.entries(counts[lead] ?? {}).sort((a, b) => b[1] - a[1]);
  if (bySource.length === 0) return v;
  const [top, hits] = bySource[0];
  const of = bySource.reduce((n, [, k]) => n + k, 0);
  const w = decide(weigh(without(counts, top), weights), register);
  if (w.kind === v.kind && headsOf(w)[0] === lead) return v;

  const dependsOn: Dependence = { source: top, hits, of, without: w };
  if (v.kind === "both") return { ...v, dependsOn };
  const newLead = headsOf(w)[0];
  if (newLead === undefined || newLead === lead || extendsWording(newLead, lead)) return { ...v, dependsOn };
  const rivals = headsOf(w).filter((h) => h !== lead && !extendsWording(h, lead));
  const heads = [lead, ...rivals].sort((a, b) => weighted[b] - weighted[a]);
  return {
    kind: "both",
    register,
    heads,
    counts: heads.map((h) => weighted[h]),
    total: v.total,
    dependsOn,
    demoted: true,
  };
}

// ------------------------------------------------ ③ (Phase 2 規則の修正)

/**
 * The AP Calculus CED split into sections (the same cut as refetch.py
 * ced_topics): "front" before the Unit 1 opener, "unitN" for a unit opener,
 * "n.m" for each TOPIC page, "exam" from the exam overview on. The text is
 * College Board's; only section names and hit counts leave this function's
 * callers.
 */
export function cedSections(text: string): [string, string][] {
  const first = /^TOPIC 1\.1$/m.exec(text);
  if (!first) return [["front", text]];
  const units = [...text.slice(0, first.index).matchAll(/^UNIT 1$/gm)];
  const start = units.length ? (units[units.length - 1].index ?? 0) : first.index;
  const end = /^Exam Overview$/m.exec(text.slice(first.index));
  const stop = end ? first.index + end.index : text.length;
  const body = text.slice(start, stop);
  const marks = [
    ...[...body.matchAll(/^TOPIC (\d{1,2}\.\d{1,2})$/gm)].map((m) => [m.index ?? 0, m[1]] as const),
    ...[...body.matchAll(/^UNIT (\d{1,2})\b.*$/gm)].map((m) => [m.index ?? 0, `unit${m[1]}`] as const),
  ].sort((a, b) => a[0] - b[0]);
  const out: [string, string][] = [["front", text.slice(0, start)]];
  marks.forEach(([at, name], i) => out.push([name, body.slice(at, i + 1 < marks.length ? marks[i + 1][0] : body.length)]));
  out.push(["exam", text.slice(stop)]);
  return out;
}

/** pdftotext output to countable text: soft hyphens and line-end hyphenation joined. */
export const cedText = (s: string) => normalize(s.replace(/­/g, "").replace(/-\n/g, ""));

/**
 * What the reference works call a concept, for the ③ fallback: the CED
 * (hits per section) and OpenStax (hits in the body of the four books, and
 * the section titles the wording occurs in).
 */
export interface ReferenceHits {
  /** candidate -> CED section -> hits */
  ced: Record<string, Record<string, number>>;
  /** candidate -> hits in the OpenStax body (written corpus) */
  openstax: Record<string, number>;
  /** candidate -> OpenStax section titles that contain it */
  openstaxTitles: Record<string, string[]>;
}

export const emptyReference = (): ReferenceHits => ({ ced: {}, openstax: {}, openstaxTitles: {} });

/**
 * Counts each candidate in the references the way terms are counted
 * (inflection folded, "…" a blank). `ced` is cedSections() of cedText();
 * `openstax` the normalized OpenStax docs; `titles` their section titles.
 */
export function referenceHits(
  candidates: string[],
  ced: [string, string][],
  openstax: string[],
  titles: string[],
): ReferenceHits {
  const out = emptyReference();
  for (const c of candidates) {
    const re = termRegex(c);
    if (!re) continue;
    for (const [section, text] of ced) {
      const n = starts(text, re).length;
      if (n) (out.ced[c] ??= {})[section] = (out.ced[c]?.[section] ?? 0) + n;
    }
    const body = openstax.reduce((n, text) => n + starts(text, re).length, 0);
    if (body) out.openstax[c] = body;
    const inTitles = [...new Set(titles.filter((t) => starts(normalize(t), re).length > 0))];
    if (inTitles.length) out.openstaxTitles[c] = inTitles;
  }
  return out;
}

/**
 * What becomes of an entry the corpus left undecided in both registers
 * (DECISIONS, Phase 2 規則の修正):
 *
 *   no-fixed-expression  mapping near / none and every candidate together has
 *                        fewer than MIN_TOTAL hits in each register: English
 *                        has no set way to say it. That is the finding - it
 *                        does not go to the human. Not when the English name
 *                        is known to exist, just rare: an English name taken
 *                        over as the Japanese headword (LIATE), or a wording
 *                        the CED itself uses (the Candidates Test)
 *   reference            otherwise the headword is what the CED calls it, or
 *                        failing that what OpenStax calls it (body or section
 *                        title). No register is claimed
 *   undecided            neither reference uses any candidate: a human looks
 */
export type Settled =
  | { kind: "no-fixed-expression"; spoken: number; written: number }
  | { kind: "reference"; by: "ced" | "openstax"; head: string; where: string[] }
  | { kind: "undecided" };

export function settleUndecided(
  entry: { mapping?: string; ja?: string; en?: string },
  raw: { spoken: number; written: number },
  ref: ReferenceHits,
  order: string[],
): Settled {
  const { mapping, ja, en } = entry;
  const best = (score: (c: string) => number) =>
    order.filter((c) => score(c) > 0).sort((a, b) => score(b) - score(a) || order.indexOf(a) - order.indexOf(b))[0];
  const cedTotal = (c: string) => Object.values(ref.ced[c] ?? {}).reduce((a, b) => a + b, 0);
  const ced = best(cedTotal);
  const borrowed = ja !== undefined && en !== undefined && ja.trim().toLowerCase() === en.trim().toLowerCase();
  const named = borrowed || ced !== undefined;
  if ((mapping === "near" || mapping === "none") && !named && raw.spoken < MIN_TOTAL && raw.written < MIN_TOTAL) {
    return { kind: "no-fixed-expression", ...raw };
  }
  if (ced) {
    const sections = Object.keys(ref.ced[ced]);
    const topics = sections.filter((s) => /^\d/.test(s));
    return { kind: "reference", by: "ced", head: ced, where: topics.length ? topics : sections };
  }
  const os = best((c) => (ref.openstax[c] ?? 0) + (ref.openstaxTitles[c]?.length ?? 0));
  if (os) {
    const titles = ref.openstaxTitles[os] ?? [];
    return { kind: "reference", by: "openstax", head: os, where: titles.length ? titles : [`本文 ${ref.openstax[os]} 件`] };
  }
  return { kind: "undecided" };
}

/**
 * Are two wordings the same phrase? Only two things are folded together:
 *
 *   inflection        completing the square  ==  complete the square
 *   argument ellipsis f prime of x           ==  f prime
 *                     revolve … around the x-axis == revolve around the x-axis
 *   punctuation       calculus, part one       ==  calculus part one
 *
 * Different words are never folded: integral / integrate / integration are
 * three wordings, and so are substitute / substitute back.
 */
export function sameWording(a: string, b: string): boolean {
  // "calculus, part one" and "calculus part one" are one wording: punctuation
  // after a word is not a word
  const bare = (t: string) => wordsOf(t).map((w) => w.replace(/[^\w'-]+$/, "")).filter(Boolean);
  const [x, y] = [bare(a), bare(b)];
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

/** Same-wording groups, in the order the names first appear. */
export function groupWordings(names: string[]): string[][] {
  const groups: string[][] = [];
  for (const name of names) {
    const g = groups.find((group) => group.some((other) => sameWording(other, name)));
    if (g) g.push(name);
    else groups.push([name]);
  }
  return groups;
}

/** The headword if it is in the group, else the member seen most often. */
function canonicalOf(group: string[], preferred: string, total: (n: string) => number): string {
  return (
    group.find((n) => normalize(n) === normalize(preferred)) ??
    [...group].sort((a, b) => total(b) - total(a))[0]
  );
}

/**
 * Folds same-wording candidates together so they do not compete with each
 * other in decide(). Counts are summed into the canonical wording - never
 * dropped - and the merge is reported so a human can see what happened.
 * (For counts taken from the corpus, countEntry folds by position instead, so
 * one occurrence matched by two wordings is not counted twice.)
 */
export function mergeCandidates(
  counts: Record<string, Record<string, number>>,
  preferred: string,
): { counts: Record<string, Record<string, number>>; merges: Merge[] } {
  const out: Record<string, Record<string, number>> = {};
  const merges: Merge[] = [];
  const total = (n: string) => Object.values(counts[n]).reduce((a, b) => a + b, 0);

  for (const group of groupWordings(Object.keys(counts))) {
    const canonical = canonicalOf(group, preferred, total);
    const bucket: Record<string, number> = {};
    for (const n of group) {
      for (const [src, v] of Object.entries(counts[n])) bucket[src] = (bucket[src] ?? 0) + v;
    }
    out[canonical] = bucket;
    if (group.length > 1) merges.push({ into: canonical, from: group.filter((n) => n !== canonical) });
  }
  return { counts: out, merges };
}

/** candidate -> source -> occurrences */
export type BySource = Record<string, Record<string, number>>;

export interface EntryTally {
  spoken: BySource;
  written: BySource;
  merges: Merge[];
  sources: string[];
  /** Spoken hits from auto captions / from human transcripts (symbols need the latter). */
  auto: boolean;
  human: boolean;
}

/**
 * Counts one entry's candidate wordings (PLAN 15, step 3) and folds
 * same-wording candidates into one. An occurrence is counted once even when
 * several wordings of the group match it - "Riemann sum" and "Riemann sums"
 * both match "riemann sums" once terms fold inflection, and "f prime" matches
 * wherever "f prime of x" does - so a group's count is the number of distinct
 * match positions, not the sum of its members.
 */
export function countEntry(
  docs: CorpusDoc[],
  collection: string,
  candidates: string[],
  preferred: string,
): EntryTally {
  const regexOf = matcherFor(collection);
  const res = new Map(candidates.map((c) => [c, regexOf(c)] as const));
  const sources = new Set<string>();
  let auto = false;
  let human = false;
  const tally: Record<Register, BySource> = { spoken: {}, written: {} };
  const merges: Merge[] = [];

  for (const register of ["spoken", "written"] as const) {
    // Symbols are readings aloud: the written corpus is out of scope for them
    // (DECISIONS 修正 4).
    if (collection === "symbols" && register === "written") continue;
    const inRegister = docs.filter((d) => d.register === register);
    // candidate -> doc index -> match starts
    const hits = new Map<string, Map<number, number[]>>();
    inRegister.forEach((doc, i) => {
      for (const c of candidates) {
        const at = starts(doc.text, res.get(c) ?? null);
        if (at.length === 0) continue;
        if (!hits.has(c)) hits.set(c, new Map());
        hits.get(c)!.set(i, at);
      }
    });
    const total = (c: string) => [...(hits.get(c)?.values() ?? [])].reduce((n, at) => n + at.length, 0);

    for (const group of groupWordings([...hits.keys()])) {
      const canonical = canonicalOf(group, preferred, total);
      const bucket: Record<string, number> = {};
      const docsHit = new Set(group.flatMap((c) => [...hits.get(c)!.keys()]));
      for (const i of docsHit) {
        const at = new Set(group.flatMap((c) => hits.get(c)!.get(i) ?? []));
        const doc = inRegister[i];
        bucket[doc.id] = (bucket[doc.id] ?? 0) + at.size;
        sources.add(doc.id);
        if (register === "spoken") {
          if (doc.auto) auto = true;
          else human = true;
        }
      }
      tally[register][canonical] = bucket;
      if (group.length > 1) {
        const m = { into: canonical, from: group.filter((n) => n !== canonical) };
        if (!merges.some((x) => x.into === m.into && x.from.join() === m.from.join())) merges.push(m);
      }
    }
  }
  return { spoken: tally.spoken, written: tally.written, merges, sources: [...sources].sort(), auto, human };
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
    const words = [en.term, ...(en.alt ?? []), ...(en.variants ?? []).map((v) => v.term)];
    for (const c of (entry.collocations as { en: string }[] | undefined) ?? []) words.push(c.en);
    out.push(...words.map((w) => countedAs(collection, entry.id as string, w)));
  } else if (collection === "symbols") {
    for (const s of (entry.spoken_en as { text: string }[]) ?? []) out.push(countedAs(collection, entry.id as string, s.text));
  } else if (collection === "phrases") {
    out.push(entry.en as string);
    for (const v of (entry.variants as { en: string }[] | undefined) ?? []) out.push(v.en);
  }
  return [...new Set(out.map((s) => s.trim()).filter(Boolean))];
}
