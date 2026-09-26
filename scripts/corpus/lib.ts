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
  // (Phase 2 代数 2 の単元) captions write "change of base formula"; OpenStax hyphenates
  [/\bchange\s+of\s+base\b/g, "change-of-base"],
  // and "row echelon form" (captions, MIT OCW) against "row-echelon form" (OpenStax)
  [/\brow\s+echelon\b/g, "row-echelon"],
  // (Phase 2 統計・ベクトルの単元 2) "LU factorization" against Nicholson's "LU-factorization"
  [/\b(lu|qr)\s+factorization/g, "$1-factorization"],
  // and Levin's "inclusion/exclusion" against "inclusion-exclusion"
  [/\binclusion\s*\/\s*exclusion/g, "inclusion-exclusion"],
  // (Phase 2 統計の単元) captions write "five number summary"; OpenStax hyphenates
  [/\bfive\s+number\s+summar/g, "five-number summar"],
  // and "box and whisker(s) plot" (captions) against "box-and-whisker plot" (OpenStax)
  [/\bbox\s+and\s+whiskers?\s+plot/g, "box-and-whisker plot"],
  // one word or two: "scatterplot" / "scatter plot", "boxplot" / "box plot"; and
  // "z score", "z table" (captions) against "z-score", "z-table"
  [/\bscatterplot/g, "scatter plot"],
  [/\bboxplot/g, "box plot"],
  [/\bz\s+(score|table)/g, "z-$1"],
  // "p value", "non-response", "stem plot", "stem and leaf" against the hyphenated
  // or joined spellings; "Type I / II error" as said aloud ("type one error")
  [/\bp\s+value/g, "p-value"],
  [/\bnon-response/g, "nonresponse"],
  [/\bstem\s+plot/g, "stemplot"],
  [/\bstem\s+and\s+leaf/g, "stem-and-leaf"],
  [/\btype\s+ii\s+error/g, "type two error"],
  [/\btype\s+i\s+error/g, "type one error"],
  // Leibniz notation typed with a slash in captions ("dy/dx") is said "dy dx"
  [/\bd([a-z])\/d([a-z])\b/g, "d$1 d$2"],
  // One name, three spellings: L'Hôpital (OpenStax), L'Hopital (captions), L'Hospital (older)
  [/\bl'?h[oô]s?pital/g, "l'hopital"],
  // (Phase 2 中学の単元) captions write "left hand side", "cross multiply"; OpenStax hyphenates
  [/\b(left|right)\s+hand\s+side/g, "$1-hand side"],
  [/\bcross\s+multipl/g, "cross-multipl"],
  // and CK-12 Geometry's "Same Side Interior Angles" against "same-side interior angles"
  [/\bsame\s+side\s+(interior|exterior)/g, "same-side $1"],
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
    // "slope–intercept form" (OpenStax Elementary Algebra writes an en dash) is one
    // hyphenated word, not "intercept form" after a dash (DECISIONS, Phase 2 幾何・離散の単元 3)
    .replace(/(?<=[a-z])[\u2010\u2011\u2013](?=[a-z])/g, "-")
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

/**
 * The sentence pass of dedupe() for a sectioned reference (IM, CK-12;
 * DECISIONS, Phase 2 幾何・離散の単元 3): a sentence of DEDUPE_MIN_WORDS or
 * more words seen in an earlier section is removed. IM's practice pages
 * repeat problems from earlier lessons and every lesson repeats the glossary
 * entries it uses; only the first copy is counted. Sections stay whole (no
 * file pass: a lesson is never a copy of another). Returns the sections and
 * how many sentences went.
 */
export function dedupeSections(sections: [string, string][]): { sections: [string, string][]; dropped: number } {
  const seen = new Set<number>();
  let dropped = 0;
  const out = sections.map(([name, text]) => {
    const kept: string[] = [];
    for (const sentence of text.split(/(?<=[.?!])\s+/)) {
      if (wordCount(sentence) >= DEDUPE_MIN_WORDS) {
        const h = hash(sentence);
        if (seen.has(h)) {
          dropped++;
          continue;
        }
        seen.add(h);
      }
      kept.push(sentence);
    }
    return [name, kept.join(" ")] as [string, string];
  });
  return { sections: out, dropped };
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

/**
 * Words whose final s is not a plural or third-person ending (DECISIONS,
 * Phase 2 統計・ベクトルの単元 2): proper names (Bayes is not the plural of
 * bay, Stokes not of stoke) and a few common nouns in -as and -ns. Nouns in
 * -us, -is and -ss (radius, basis, compress) are caught by their ending.
 * A name written with a capital in an entry must be listed here
 * (tests/corpus.test.ts checks data/).
 */
export const NOT_PLURAL_S = new Set([
  // proper names
  "bayes", "stokes", "descartes", "pythagoras", "archimedes", "apollonius", "menelaus", "pappus",
  "thales", "diophantus", "eratosthenes", "gibbs", "lucas", "wilks", "jacobs", "hermes",
  // common nouns
  "bias", "gas", "atlas", "canvas", "alias", "lens", "chaos", "cosmos",
]);

/**
 * Strips inflection only. integral / integrate / integration stay distinct.
 * A final "y" and the "i" of "-ies" / "-ied" are one letter here, so vary,
 * varies, varied and varying share the stem "vari" (as lie, lies and lying
 * share "li").
 */
const stem = (w: string): string => {
  if (IRREGULAR[w]) return stem(IRREGULAR[w]);
  // A final "ss", "us" or "is" is part of the word (compress, radius, basis),
  // not a plural: only "-es" comes off it (compresses, radiuses). So is the s of
  // a listed word (Bayes, bias).
  const lemma = NOT_PLURAL_S.has(w) || /(?:ss|us|is)$/.test(w);
  const bare = lemma ? w : w.replace(/(ing|ed|es|s)$/, "");
  return bare.replace(/e$/, "").replace(/y$/, "i");
};

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
  // The bare stem and stem + s are another word when the e is dropped from a
  // word that ends in e (mode -> mod, plane -> plan, rate -> rat, note -> not)
  // or added to a word that does not (plan -> plane, sin -> sine). An -ing or
  // -ed form still finds its lemma with the e (completing -> complete).
  // (DECISIONS, Phase 2 統計・ベクトルの単元)
  const endsInE = word.endsWith("e");
  const isLemma = word === s;
  for (const e of ["", "e"]) {
    for (const x of ["", "s", "es", "ed", "ing"]) {
      if ((x === "" || x === "s") && (e === "" ? endsInE : isLemma && !endsInE)) continue;
      const t = s + e + x;
      if (t.length > 2 && stem(t) === s) forms.add(t);
    }
  }
  // vary / varies / varied / varying: the stem ends in the i of -ies, the lemma in y
  if (s.endsWith("i")) {
    for (const x of ["", "s", "ed", "ing"]) {
      const t = s.slice(0, -1) + "y" + x; // surveyed, played
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
  const bodies = phrase.split(FORM_OR).map(termBody).filter((b): b is string => b !== null);
  if (bodies.length === 0) return null;
  return wholeWords(bodies.length === 1 ? bodies[0] : `(?:${bodies.join("|")})`);
}

/**
 * Two marks a counted form (TERM_FORMS) may use when a phrase alone cannot
 * keep another meaning out (DECISIONS, Phase 2 統計・ベクトルの単元の前の修正):
 *
 *   "A | B"      either form: bounded sequence | sequence is bounded
 *   "!w"         a word that may not stand there. Before the form, the form may
 *                not follow it; after, it may not follow the form. Several
 *                may be given: "solve for dx !dt" (not dx/dt), "!natural
 *                !angular frequency" (not a physical frequency)
 *
 * Both stay in the key the counts and `evidence` are recorded under.
 */
export const FORM_OR = /\s+\|\s+/;
const NOT = /^!(\S+)$/;

function termBody(phrase: string): string | null {
  const tokens = phrase.trim().split(/\s+/);
  const before: string[] = [];
  const after: string[] = [];
  while (tokens.length && NOT.test(tokens[0])) before.push(tokens.shift()!.slice(1));
  while (tokens.length && NOT.test(tokens[tokens.length - 1])) after.unshift(tokens.pop()!.slice(1));
  const form = tokens.join(" ");
  const words = normalize(form).split(" ").filter(Boolean);
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
  const notBefore = before.map((w) => `(?<!(?:^|[^\\w-])${escape(normalize(w))} )`).join("");
  const notAfter = after.map((w) => `(?! ${escape(normalize(w))}(?![\\w-]))`).join("");
  return notBefore + body + notAfter;
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
  // (Phase 2 代数 2 の単元) "n choose k", "n choose r", "n choose two": the top is n. A
  // bare "* choose *" would also count "we choose u".
  "combination-ncr": {
    "n choose r": "n choose *",
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
  // Phase 2 幾何・離散の単元 (batch 1): everyday or many-sense words, counted in the
  // sense of the entry (contexts checked)
  multiple: { multiple: "multiple of" }, // not "multiple times", "multiple methods"
  "common-factor": { "common factor": "!greatest common factor" }, // the GCF is its own entry
  "arc-length": {
    // the arc of a circle, not the length of a curve (arc-length-of-a-curve)
    "arc length":
      "arc length of the sector | arc length of a sector | arc length of a circle | arc length of the circle | arc length formula | length of the arc | length of an arc",
  },
  congruent: {
    // figures, not a congruence modulo n (mit-notes)
    congruent:
      "congruent triangles | congruent angles | congruent sides | congruent segments | congruent figures | congruent shapes | congruent polygons",
  },
  translation: {
    // a graph or figure moved, not a translation of words or of a definition
    shift: "vertical shift | horizontal shift | shifted … units | shift … units",
    translation:
      "vertical translation | horizontal translation | translation of the graph | translations of the graph | translation of the parabola | translation of the function | translated … units",
  },
  set: { set: "the set of | a set of | set of all" }, // not "set it equal to", "set up"
  element: {
    element: "is an element of | are elements of | element of the set | elements of the set | elements of a set",
    member: "member of the set | members of the set",
  },
  segment: { segment: "!line segment" }, // bare "segment"; "line segment" is counted on its own
  // batch 2
  complement: { complement: "complement of" }, // 補集合; not "complementary", "to complement"
  union: { union: "union of" },
  inverse: {
    // 裏 (not p → not q), not an inverse function or matrix
    inverse:
      "the inverse is the statement | contrapositive, and inverse | contrapositive and inverse | converse, inverse | the inverse of this statement | inverse of this statement",
  },
  // batch 3
  bearing: { bearing: "bearing of" }, // navigation (a bearing of 120°), not "bearing in mind"
  combination: {
    // counting (nCr); bare "combination" is mostly a mixture or a linear combination
    combination:
      "number of combinations | permutations and combinations | combinations of n | combination formula | combinations of r | a combination of r | combinations of k",
  },
  arrange: {
    // counting arrangements, not "arrange the work" or "arrange the terms"
    arrange: "ways to arrange | ways can … be arranged | arrange … in a row | ways of arranging | number of arrangements",
  },
  "union-of-events": { "union of events": "union of two events | union of events" },
  "intersection-of-events": { "intersection of events": "intersection of two events | intersection of events" },
  "order-matters": { "order matters": "order matters | order doesn't matter | order does not matter" }, // 順序を考える ／ 考えない
  // 円順列; the only OpenStax hits are cyclic permutations of the variables x, y, z (vector calculus)
  // 内接円; OpenStax Calculus's "inscribed circle" is the osculating circle of a curve
  // ("the curvature / radius of the inscribed circle"). IM Geometry's are a triangle's
  // or a polygon's (7.6-7.9), mostly without "of the triangle": the forms IM uses
  // (Phase 2 幾何・離散 2)
  "inscribed-circle": {
    "inscribed circle":
      "inscribed circle of the triangle | inscribed circle of a triangle | circle inscribed in a triangle | circle inscribed in the triangle | triangle's inscribed circle | its inscribed circle | inscribed circle for the triangle | inscribed circle is tangent | inscribed circle's radius | an inscribed circle",
  },
  // 小数部分 {x}: IM Grade 6's two "fractional parts" are parts of a whole cut into fractions
  // 単元 3: OpenStax Elementary / Intermediate Algebra's "conjugate pair" is mostly the pair of
  // binomials (a − b)(a + b); the roots come "in conjugate pairs"
  "conjugate-roots": { "conjugate pairs": "in conjugate pairs | conjugate pair of roots | conjugate pair of solutions | conjugate pair of zeros" },
  // 単元 3: "intercept form" after "slope" is the slope-intercept form of a line (captions write no hyphen)
  "factored-form": { "intercept form": "!slope intercept form" },
  // 単元 3 (batch 6)
  "cross-section": { "cross section": "cross section | cross-section" }, // one word, two spellings
  // density of mass / population, not a probability density (function, curve)
  density: { density: "!probability !exponential !kernel density !function !functions !curve !curves !plot !plots" },
  // the image of a point under a transformation, not a mirror image or a picture
  image: { image: "!mirror image of | image point | image points | its image" },
  // "tiling" folds into tile / tiles (floor tiles, fraction tiles): only the tiling of the plane
  tessellation: { tiling: "tiling of the plane | tilings of the plane | tiling the plane" },
  // 単元 3 (batch 7): everyday words and the homonyms of other entries, counted as the concept
  relation: { relation: "binary relation | relation on | relations on | the relation r | a relation r" },
  "degree-vertex": { "degree of a vertex": "degree of a vertex | degree of the vertex | degree of each vertex | degree of vertex" },
  connected: { connected: "connected graph | graph is connected" },
  intersection: { intersection: "intersection of a and b | intersection of sets | intersection of two sets | intersection of the sets | a intersect b | a intersection b" },
  "complementary-event": { "complement of an event": "complement of an event | complement of the event | complement of event" },
  "median-of-a-triangle": { median: "median of a triangle | median of the triangle | medians of a triangle | medians of the triangle" },
  "congruence-modulo-n": { "congruence modulo n": "congruent modulo | congruent mod | congruence modulo | congruence mod" },
  // 10 進法: "base ten" alone is mostly "log, base ten"
  "decimal-system": { "base ten": "base-ten | base ten system | base ten number | base ten numeral | base ten place | in base ten" },
  // 割線: "secant" alone is also sec θ
  "secant-line": { "secant line": "secant line | a secant of | secant of the circle | secants of the circle" },
  // CK-12 Algebra's "a fractional part of a power of one-tenth" is a decimal place, not x − ⌊x⌋ (単元 3)
  "fractional-part": { "fractional part": "!a fractional part of | fractional part is" },
  // ガウス記号: the reading "floor of" (x), not the floor of a room or a building
  // (IM's 7 hits: "the floor of a rectangular room", "the top floor of a ... building";
  // OpenStax Prealgebra / Elementary Algebra: "the floor of your room", 単元 3)
  "floor-function": { "floor of": "!top floor of !a !an !the !this !that !his !her !their !its !your" },
  "circular-permutation": { "circular permutation": "number of circular permutations | circular permutations of n | circular permutation formula" },
  // batch 4
  "eulers-formula-for-polyhedra": {
    // the bare name is also e^(iθ) = cos θ + i sin θ
    "Euler's formula for polyhedra": "Euler's formula for polyhedra | Euler's polyhedron formula | Euler's formula for planar graphs",
  },
  "supplementary-angle": { "supplementary angles": "supplementary" }, // the pair is supplementary; "supplementary angles" is inside it
  "base-n": { "base n": "in base | written in base | base-n representation" }, // "base b" is mostly the base of a logarithm
  binary: { binary: "in binary | binary number | binary representation | base 2 | base two" }, // not a binary relation / tree
  place: { place: "ones place | tens place | hundreds place" }, // 位, not "take place"
  "undefined-terms": {
    // OpenStax's one "undefined term" is an expression that is undefined (division by zero)
    "undefined terms": "undefined terms of geometry | undefined terms in geometry | undefined terms point, line",
  },
  "tangent-segments-are-equal": { "tangent segments are equal": "tangent segments" },
  // Phase 2 幾何・離散の単元 2 (batch 5). The bare letters are other things too: ASA is the
  // American Statistical Association (AP Statistics CED), SAS a case of the law of cosines
  // (OpenStax "given SAS") and a statistics package. Counted as the congruence criterion.
  // CK-12 names each one with the abbreviation in parentheses, "Angle-Angle-Side (AAS)
  // Congruence Theorem": "(AAS) congruence" is that name (単元 3).
  "sss-congruence": { SSS: "by SSS | SSS congruence | (SSS) congruence | SSS postulate | SSS criterion | SSS theorem | SSS triangle congruence" },
  "sas-congruence": { SAS: "by SAS | SAS congruence | (SAS) congruence | SAS postulate | SAS criterion | SAS theorem | SAS triangle congruence" },
  "asa-congruence": { ASA: "by ASA | ASA congruence | (ASA) congruence | ASA postulate | ASA criterion | ASA theorem | ASA triangle congruence" },
  "aas-congruence": {
    AAS: "by AAS | AAS congruence | (AAS) congruence | AAS postulate | AAS criterion | AAS theorem | AAS triangle congruence",
    // OpenStax's one "angle-angle-side" names a law-of-sines problem situation, not the criterion
    "angle-angle-side":
      "angle-angle-side congruence | angle-angle-side (AAS) congruence | angle-angle-side triangle congruence | angle-angle-side theorem | angle-angle-side postulate",
  },
  "hl-congruence": { HL: "by HL | HL congruence | (HL) congruence | HL theorem | HL postulate | HL criterion" },
  // 対称律, counted by the names Geometry gives it (Phase 2 中学の単元の前の修正)
  "symmetric-property": { "symmetric property": "symmetric property of equality | symmetric property of congruence" },
  // 仮定: "hypothesis" alone is mostly a statistical hypothesis; the proof's "Given" cannot be counted
  hypothesis: {
    hypothesis:
      "hypothesis and conclusion | hypothesis and the conclusion | hypotheses of the theorem | hypothesis of the theorem | hypothesis of the conditional | hypothesis of the implication | hypothesis of an implication",
  },
  "side-angle-inequality": { "side-angle inequality": "side-angle inequality | opposite the longer side | opposite the longest side" },
  "standard-form": {
    // 一般形 ax² + bx + c. "standard form" names both forms (OpenStax: a(x − h)² + k), so it is not counted
    "general form": "general form of a quadratic | quadratic function in general form | general form of the quadratic",
  },
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
  // "the pole" was half MIT 18.03's pole diagrams in speech (Phase 2 統計・ベクトルの単元の前の修正)
  pole: { pole: "from the pole" }, // the distance from the pole, not a pole diagram or a flagpole
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
  // "expansion of" was eight tenths series expansion in speech (Phase 2 統計・ベクトルの単元の前の修正)
  expansion: { expansion: "expansion of (" }, // the expansion of (x + y)^n, not a power series expansion
  identity: { identity: "an identity" }, // not the identity matrix or function
  period: { period: "period of" }, // not a period of time
  logarithm: { logarithm: "the logarithm of", log: "the log of" }, // "log" alone is too short to count as a word
  argument: { argument: "argument of the logarithm" }, // 真数, not a function's argument in general
  // "with the same base" was mostly the exponent rule "multiply powers with the same base"
  // (Phase 2 統計・ベクトルの単元の前の修正); "with a common base" is the rewriting
  "write-with-the-same-base": { "write with the same base": "as a power with the same base", "write with a common base": "with a common base" },
  "rewrite-in-exponential-form": { "rewrite in exponential form": "in exponential form" },
  "rewrite-in-logarithmic-form": { "rewrite in logarithmic form": "in logarithmic form" },
  work: { work: "work done" }, // not "let's work it out"
  // Phase 2 統計・ベクトルの単元の前の修正: everyday-word headwords whose leading wording
  // meant something else in half or more of ten sampled contexts, or enough to change the verdict
  bounded: { bounded: "bounded sequence | sequence is bounded | bounded function | function is bounded" }, // "bounded" folds into "bound(s)": bounds of integration, upper bound, region bounded by
  parameter: { parameter: "parameter t" }, // not a population parameter (statistics)
  orientation: { orientation: "orientation of the curve" }, // not the orientation of space (determinants) or of a surface
  "first-term": { "first term": "first term of … sequence | first term of … series | where the first term is" }, // not the first term of an expression
  "last-term": { "last term": "last term in … series | last term of … sequence" }, // not the last term of a trinomial (FOIL)
  "upper-limit": {
    "upper limit": "upper limit of integration | at the upper limit",
    "upper limit of integration": "upper limit of integration | at the upper limit",
  }, // not the upper limit of summation or of a confidence interval
  "lower-limit": {
    "lower limit": "lower limit of integration | at the lower limit",
    "lower limit of integration": "lower limit of integration | at the lower limit",
  },
  "write-dx-in-terms-of-du": { "solve for dx": "solve for dx !dt" }, // not "solve for dx dt" (dx/dt in related rates)
  // Phase 2 統計・ベクトルの単元, batch 1 (checked in ten contexts each)
  frequency: { frequency: "frequency table | frequency column | frequency polygon | frequency distribution" }, // speech is mostly a physical frequency
  "relative-frequency": { "relative frequency": "!cumulative relative frequency" },
  mode: { mode: "the mode !menu" }, // not a calculator's degree / radian mode
  spread: { spread: "the spread" }, // not "spread out the paper" or the spread of a disease
  maximum: { maximum: "the maximum value | absolute maximum", "maximum value": "the maximum value | absolute maximum" }, // not a local maximum
  minimum: { minimum: "the minimum value | absolute minimum", "minimum value": "the minimum value | absolute minimum" },
  "take-the-average": { "take the average": "take the average of", "find the average": "find the average of" }, // not the average rate of change
  sampling: { sampling: "sampling method | sampling technique" }, // "sampling" folds into "sample"
  deviation: { deviation: "!standard !absolute !quartile deviation" }, // not a standard deviation
  census: { census: "census !bureau" }, // not the U.S. Census Bureau
  "arithmetic-mean": { mean: "the mean !value" }, // the mean of data; not "I mean" or the mean value theorem
  // batch 2
  test: { test: "test the claim | test the hypothesis | conduct a hypothesis test | perform a hypothesis test | do a hypothesis test" }, // not a comparison test or a school test
  "one-tailed-test": { "one-tailed test": "one-tailed test | right-tailed test | left-tailed test" }, // OpenStax names the side
  estimation: { estimate: "estimate the population | estimate of the population | estimate a population | estimate of a population" }, // not an estimate of an integral
  // batch 3
  components: { components: "components of the vector | component of the vector | horizontal component | vertical component | x-component" }, // not connected components of a graph
  row: { row: "first row | second row | row of the matrix | row of a matrix" }, // not "in a row"
  column: { column: "first column | second column | column of the matrix" }, // not a column of a table in general
  entry: { entry: "entry in row | entries of the matrix" }, // "element" is mostly an element of a set
  // batch 4
  "vertex-graph": { vertex: "adjacent vertices | degree of a vertex | vertices u and v | set of vertices" }, // not the vertex of a parabola or polygon
  tree: { tree: "a tree !diagram" }, // not a tree diagram
  // Phase 2 統計・ベクトルの単元 2, batch 5 (checked in ten contexts each)
  "paired-t-test": { "matched pairs": "matched pairs !design" }, // not a matched pairs design (an experiment)
  pivot: { pivot: "pivot column | pivot position | pivot entry | first pivot | second pivot | third pivot | product of the pivots" }, // written "pivot" is a planimeter's or an irrigation pivot
  minor: { minor: "matrix of minors | expand by minors | minor of the entry | the minor of | determinant of the minor" }, // not the minor axis, not "a minor point"
  span: { span: "the span of | spans the … space | span the … space | in the span | span of the columns | span of two vectors" }, // not a time span or a bridge's span
  basis: { basis: "basis for … space | basis vector | orthonormal basis | standard basis | basis for the column | basis for the null | basis for r" }, // not "on the basis of"
  dimension: {
    dimension: "dimension of the … space | dimension of a … space | dimension of the null | dimension of the column | dimension of the row | dimension of the subspace | dimension of that space",
  }, // not "in three dimensions" or a rectangle's dimensions
  rank: { rank: "rank of the matrix | rank of a matrix | full rank | full column rank | full row rank | rank one matrix | rank r | the rank is | rank of a" }, // not a ranking or a card's rank
  onto: { onto: "is onto | onto function | onto map | one-to-one and onto | onto mapping | onto transformation" }, // not the preposition (project onto)
  // batch 6
  "edge-of-a-graph": {
    edge: "edges of the graph | edge of the graph | edges in the graph | an edge between | edge from | number of edges | vertices and edges | edges and vertices | edge connecting | edges connecting",
  }, // not the edge of a region or a cube
  "path-in-a-graph": {
    path: "path in the graph | path in a graph | path from u to v | path of length | hamilton path | hamiltonian path | shortest path | simple path | walk or path",
  }, // not the path of a particle or a line integral's path
  "graph-network": {
    graph: "simple graph | connected graph | directed graph | complete graph | bipartite graph | planar graph | graph with … vertices | graph on … vertices",
  }, // not the graph of a function
  statistics: { statistics: "in statistics | field of statistics | study of statistics | statistics is the | statistics class | statistics course | statistics students" }, // the field, not the plural of statistic
  statistic: { statistic: "a statistic | sample statistic | statistics and parameters | parameter and a statistic | summary statistics" }, // not the field "statistics", not a test statistic
  "independence-of-events": {
    "independent events": "independent events | events are independent | independence of events | event … independent of",
  }, // not an independent variable or linear independence
  "error-bound": { "error bound": "!lagrange !legrange error bound" }, // not the Lagrange error bound (Taylor polynomials)
  "quadratic-form": { "quadratic form": "!in !the !standard !undoing quadratic form" }, // not an equation "in quadratic form" (u = x²)
  blocking: { blocking: "block design" }, // "blocking" folds into "block": stacks of blocks, Jordan blocks
  // Phase 2 中学の単元 (batch 1): everyday words and words that name other entries too
  sign: { sign: "!radical !equal !equals !inequality !summation !integral !plus !minus sign" }, // 符号, not a symbol's name
  // A plural in a form folds back to its singular (inflection), so a form never lists "constants" or
  // "unknowns" alone: that would count every "constant" (Phase 2 中学の単元)
  opposite: { opposite: "the opposite of | its opposite" }, // 反数, not "the opposite way"
  addition: { addition: "!in addition" }, // not "in addition" (そのうえ)
  power: { power: "to the … power | to the power of | raised to a power | raised to the power | to a power | powers of" }, // 累乗, not power series / power rule / statistical power
  square: { square: "the square of | squares of | square the | square each | square both" }, // 平方, not a square (正方形) or square root
  cube: { cube: "the cube of | cubes of | cube the | cube both" }, // 立方, not a cube (立方体)
  "prime-number": { prime: "is prime | is a prime | are prime" }, // the adjective; bare "prime" is also f prime
  term: { term: "!in term" }, // not "in terms of"
  "greater-than": { "greater than": "greater than !or" }, // not "greater than or equal to"
  "less-than": { "less than": "less than !or", "smaller than": "smaller than !or" },
  round: { round: "round to | round up | round down | round … to the nearest" }, // not "round here", "a round table"
  "base-of-a-power": {
    base: "the base is | same base | base and exponent | base and the exponent | base of the power | base of the exponent | bases are the same",
  }, // 底, not "based on", a base case, the base of a triangle
  variable: {
    variable: "!random !independent !dependent !response !explanatory !categorical !quantitative !lurking !confounding !dummy !free !basic !indicator variable",
  }, // 変数, not the statistics variables (statistical-variable) or a random variable
  coefficient: { coefficient: "!correlation !binomial coefficient" },
  constant: { constant: "a constant !of !function !rate !speed !term | the constant !of !function !rate !speed !term" }, // not the constant of integration / proportionality, a constant function or the constant term
  // 数量, not the spoken bracket "the quantity x plus one" / "two quantity squared" (contexts checked,
  // Phase 2 中学の単元 2); "the quantities" would fold back to "the quantity"
  quantity: {
    quantity:
      "a quantity !squared !cubed | two quantities !squared !cubed | these quantities | both quantities | each quantity | another quantity | unknown quantity | known quantity | same quantity | related quantities",
  },
  // Phase 2 中学の単元 2 (batch 5): contexts checked
  range: { range: "range of the function | range of a function | range of f | range of g | range of this function" }, // 値域, not the range of data (range-of-data)
  // 同位角 (parallel lines cut by a transversal); bare "corresponding angles" is mostly the matching angles of
  // similar or congruent figures, or the reference angle in another quadrant
  "corresponding-angles": {
    "corresponding angles":
      "are corresponding angles | pair of corresponding angles | pairs of corresponding angles | corresponding angles theorem | corresponding angles converse",
  },
  // 対応する角 of congruent / similar figures
  "corresponding-angles-of-congruent-figures": {
    "corresponding angles": "corresponding angle measures | corresponding angles have the same measure | corresponding angles are equal in measure",
  },
  equal: { equal: "equal to | are equal | is equal | equal in | be equal" }, // 等しい, not "equal sign"
  // 対角線, not the diagonal of a matrix (main diagonal, diagonal entries)
  diagonal: {
    diagonal:
      "diagonal of the !matrix | diagonal of a !matrix | diagonals of the !matrix | diagonals of a !matrix | length of the diagonal | diagonals bisect | diagonals intersect",
  },
  "base-of-a-triangle": { base: "base of the triangle | base of a triangle | base times height | base and height | base and the height" }, // 底辺
  // 正方形. "a square" / "is a square" fold into "a squared" (a²), and a plural-only "squares" into every
  // "square" and "squared", so the figure is counted where only the figure fits
  "square-shape": {
    square:
      "area of a square | area of the square | perimeter of a square | perimeter of the square | a square has | the square has | squares and rectangles | rectangles and squares | draw a square | shape of a square | rectangle is a square",
  },
  die: { die: "a die | the die | two dice | a fair die | roll dice | the dice" }, // さいころ, not "die" (to die)
  draw: {
    draw: "draw a card | draw a marble | draw a ball | drawn at random | drawn from | draw two | draw one | draw a chip | draw a name",
  }, // 取り出す, not draw a graph / a picture
  toss: {
    toss: "toss a coin | tosses a coin | coin toss | toss the coin",
    flip: "flip a coin | flips a coin | coin flip | flip the coin",
    roll: "roll a die | roll the die | roll two dice | rolls a die | roll a number cube",
  },
  // batch 6: contexts checked
  likelihood: { likelihood: "likelihood !function !ratio" }, // 起こりやすさ, not the likelihood function (statistics)
  certain: { certain: "!a certain event | event is certain | certain to happen | certain to occur" }, // not "a certain event" (some event)
  impossible: { impossible: "impossible event | event is impossible | impossible to happen | impossible to occur" },
  // 因数分解: the verb in use. "factoring" folds into every "factor" (a factor of 15, a scale factor)
  factoring: {
    factoring: "factor the | factor this | factor each | factor it | factor completely",
    factorization: "factorization !prime",
  },
  factor: { factor: "linear factor | quadratic factor | each factor | two factors | the factors are | irreducible factor" }, // 因数 of a product
  binomial: {
    binomial:
      "binomial !theorem !distribution !distributions !coefficient !coefficients !expansion !probability !random !experiment !setting !formula !model !squares !square",
  }, // 二項式, not the binomial theorem / distribution, or binomial squares (square-of-a-binomial)
  error: {
    error: "absolute error | measurement error | error in the measurement | error in measurement | amount of error | round-off error | rounding error",
  }, // 誤差, not an error in the work or the margin of error (error-bound)
  measurement: { measurement: "!of !linear measurement !error !errors !of !unit !units !system !systems" }, // 測定値, not a system of measurement
  "bound-estimate": {
    estimate:
      "between two consecutive integers | between which two integers | between two consecutive whole numbers | estimate the square root | estimate the value of the square root",
  }, // 評価する (√10 lies between 3 and 4), not an estimate in general (estimation)
  scale: {
    scale: "scale of the map | scale of the drawing | the scale is | map scale | scale on the map | scale of a map | scale of a drawing",
  }, // 縮尺, not a scale factor or the scale of an axis
  // 相似 of figures; "are similar" / "is similar to" are mostly "alike" (proofs, methods) or similar matrices
  similar: {
    similar:
      "triangles are similar | figures are similar | polygons are similar | rectangles are similar | shapes are similar | similar figures | similar polygons | similar solids | similar rectangles | is similar to triangle",
  },
  // batch 2
  unit: {
    unit: "units of measure | unit of measure | units of measurement | unit of measurement | same units | label the units | include units | in the units | units of length | unit of length",
  }, // 単位, not the unit circle, a unit vector or "Unit 3"
  times: { times: "times as many | times as much | times as large | times as long | times as big | times larger | times bigger | times greater" }, // 〜倍, not "3 times 4" or "many times"
  ratio: { ratio: "!common !golden ratio !test" }, // 比, not a common ratio or the ratio test
  "value-of-a-ratio": { "value of a ratio": "value of a ratio | value of the ratio" },
  proportion: {
    proportion:
      "set up a proportion | set up the proportion | solve the proportion | solve a proportion | solve proportions | write a proportion | using a proportion | use a proportion | the proportion is true",
  }, // 比例式; bare "proportion" is mostly the statistics proportion (割合)
  "cross-multiply": {
    // captions write "cross multiply" (normalize joins it); the hyphenated word does not fold inflection
    "cross-multiply": "cross-multiply | cross-multiplying | cross-multiplied | cross-multiplies | cross-multiplication",
    "cross multiplication": "cross-multiply | cross-multiplying | cross-multiplied | cross-multiplies | cross-multiplication",
  }, // "cross products" is mostly the vector cross product
  unknown: { unknown: "the unknown !population | an unknown !population | two unknowns | three unknowns | unknown number | unknown value | unknown quantity" }, // the noun, not "unknown population mean"
  hold: {
    hold: "holds for | hold for | holds true | hold true | still holds | also holds | equation holds | inequality holds | equality holds",
    "hold true": "holds for | hold for | holds true | hold true | still holds | also holds | equation holds | inequality holds | equality holds",
  }, // 成り立つ, not "hold on"
  check: {
    check: "check your answer | check the answer | check our answer | check your work | check the solution | check our solution | check by | check your solution",
  }, // 確かめる, not "let me check" or "check this out"
  graph: { graph: "graph of | the graph !theory" }, // the graph of a function, not a verb or graph theory (graph-network)
  "plot-a-point": { "plot a point": "plot … point | plot point" },
  "draw-a-graph": { graph: "graph the | graph each | graph this | graph these | graph it" }, // the verb
  // batch 3
  line: { line: "!number !tangent !secant !regression !normal !real !straight line !segment !segments !integral !integrals !graph !graphs" }, // 直線, not a number / tangent / regression line or a line segment
  side: {
    side:
      "side of the triangle | side of a triangle | side of the square | side of a square | side length | length of the side | length of each side | three sides | four sides | all sides | side of the polygon",
  }, // 辺, not "both sides" or "the left side"
  perpendicular: { perpendicular: "perpendicular !bisector !bisectors !lines !line" }, // the adjective; perpendicular lines and bisectors are entries
  parallel: { parallel: "parallel !lines !line" },
  center: { center: "center of the circle | center of a circle | center of the sphere | its center | the center is | centered at" }, // not a center of mass
  arc: { arc: "arc !length" },
  construction: { construction: "!by construction" }, // not "by construction" in a proof
  straightedge: { ruler: "ruler !postulate" },
  construct: {
    construct:
      "construct a perpendicular | construct the perpendicular | construct an angle | construct a line | construct the bisector | construct a triangle | construct a circle | construct a square | construct a hexagon | construct a copy | construct the angle | construct the line | construct a parallel",
  }, // 作図する, not "construct a confidence interval"
  "be-tangent-to": { "be tangent to": "tangent to" },
  translate: {
    translate:
      "translate the graph | translated … units | translate … units | translate the figure | translate the triangle | translate the point | translated up | translated down | translated left | translated right | translate it",
  }, // 平行移動する, not "translate the sentence into an equation"
  reflect: {
    reflect: "reflect over | reflect across | reflect … over | reflect … across | reflect it over | reflect it across | reflect about",
  }, // 折り返す, not "reflect on"
  measure: { measure: "measure the length | measure the angle | measure the height | measure the side | measure each | measure it | measure with" }, // the verb; "the measure of angle A" is a noun
  solid: { solid: "a solid !line !dot !circle !curve !lines !dots | the solid !line !dot !circle !curve !lines !dots | solid figure" }, // 立体, not a solid line or dot
  plane: { plane: "!coordinate !complex !cartesian !tangent !projective !osculating plane" },
  net: { net: "net of a | net of the | a net for | the net for" }, // 展開図, not a net change or net force
  // batch 4
  edge: {
    edge: "edge of the cube | edge of a cube | edge length | edge of the prism | edge of a polyhedron | faces, edges | faces and edges | edges and vertices | edges, and vertices",
  }, // 稜, not the edge of a graph (edge-of-a-graph) or of a table
  face: { face: "face of the | face of a | faces, edges | faces and edges | lateral face | number of faces" },
  "lie-in": { "lie in": "lies in the plane | lie in the plane | lies in a plane | lie in a plane | contained in the plane" },
  "base-of-a-solid": {
    base: "base of the prism | base of a prism | base of the cylinder | base of a cylinder | base of the pyramid | base of a pyramid | base of the cone | base of a cone",
  }, // 底面, not the base of a power, a triangle or a logarithm
  "cube-solid": { cube: "a cube !root !roots | the cube !root !roots !of | unit cube" }, // 立方体, not a cube root or x cubed
  "range-of-data": { range: "range of the data | range of a data | range of the scores | range of each data set | range of the data set" }, // 範囲, not the range of a function
  degree: {
    degree:
      "degree of the polynomial | degree of a polynomial | degree of the term | degree of a term | degree of the monomial | degree of each term | highest degree | degree two polynomial | degree three polynomial | degree n polynomial",
  }, // 次数, not an angle's degree
  quotient: { quotient: "quotient !rule" },
  product: { product: "the product of | a product of" }, // not "products of" (a dot product of …)
  sum: { sum: "the sum of | a sum of" },
  difference: { difference: "the difference of | the difference between" },
  divisor: { factor: "is a factor of | are factors of | factors of" }, // 約数; "factors of" is also the factors of a polynomial
  "divisor-in-division": {
    divisor: "the divisor is | divide by the divisor | dividend and divisor | dividend by the divisor | divisor and the dividend",
  }, // 除数, not a divisor (約数)
  elimination: { elimination: "by elimination | using elimination | use elimination | elimination method | method of elimination" }, // not Gaussian elimination
  "rearranging-an-equation": {
    "solve the formula for": "solve the formula for | solve a formula for | solve each formula for",
    "solve for a variable": "solve for a variable | solve for the variable",
    "rearrange the equation": "rearrange the equation | rearrange the formula | rearrange an equation | rearrange a formula",
  },
  "checking-whether-the-solution-makes-sense": {
    "check that the answer makes sense":
      "answer makes sense | solution makes sense | answer is reasonable | solution is reasonable | reasonable answer | makes sense in the context",
    "check that the answer is reasonable":
      "answer makes sense | solution makes sense | answer is reasonable | solution is reasonable | reasonable answer | makes sense in the context",
  },
  change: { change: "change in x | change in y | change in the x | change in the y" }, // 増加量 (Δx, Δy)
  domain: { domain: "the domain !and | domain of" }, // not "domain and range" (変域)
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

/**
 * `n` contexts of a term's wording, matched as terms are counted (inflection
 * folded, "…" a blank), picked at even steps through every hit in corpus
 * order so the sample follows the sources in proportion. Seven words either
 * side. For the check of an everyday-word headword (DECISIONS, Phase 2 統計・
 * ベクトルの単元の前の修正): printed to the terminal, never written to a file.
 */
export function sampleTermContexts(docs: CorpusDoc[], wording: string, n = 10): ContextHit[] {
  const re = termRegex(wording);
  if (!re) return [];
  const all: { doc: CorpusDoc; at: number; len: number }[] = [];
  for (const doc of docs) for (const m of doc.text.matchAll(re)) all.push({ doc, at: m.index ?? 0, len: m[0].length });
  const step = all.length / Math.min(n, all.length || 1);
  const picked = all.length <= n ? all : Array.from({ length: n }, (_, i) => all[Math.floor(i * step)]);
  return picked.map(({ doc, at, len }) => {
    const before = doc.text.slice(Math.max(0, at - 80), at).trim().split(" ").slice(-7).join(" ");
    const after = doc.text.slice(at + len, at + len + 80).trim().split(" ").slice(0, 8).join(" ");
    return { candidate: wording, source: doc.id, snippet: `${before} [${doc.text.slice(at, at + len)}] ${after}`.trim() };
  });
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
  // The AP Statistics CED shows a sample TOPIC 1.1 page in its front matter,
  // before the Unit 1 opener: the first topic is the first one after that opener.
  const opener = /^UNIT 1$/m.exec(text);
  const topic1 = /^TOPIC 1\.1$/gm;
  topic1.lastIndex = opener ? opener.index : 0;
  const first = topic1.exec(text) ?? /^TOPIC 1\.1$/m.exec(text);
  if (!first) return [["front", text]];
  const units = [...text.slice(0, first.index).matchAll(/^UNIT 1$/gm)];
  const start = units.length ? (units[units.length - 1].index ?? 0) : first.index;
  // pdftotext starts a page with a form feed: the exam section opens a page.
  const end = /^\f?Exam Overview$/m.exec(text.slice(first.index));
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
 * A book of the references split into sections (Nicholson, Levin). pdftotext
 * keeps one form feed per page, and every odd page opens with a running head
 * "n.m. Title". A section starts at its body heading - "1.2 Gaussian
 * Elimination" on one line (Nicholson), or "2.4", a blank line and the title
 * (Levin) - looked for on the pages just before the first page that carries
 * its running head (the table of contents is far earlier and has dot
 * leaders); failing that, at that page. A section too short to carry a
 * running head stays inside the one before it. The front matter before the
 * first section and the back matter from the selected answers / solutions and
 * the index on are left out. Section names are "n.m Title"; only names and
 * hit counts leave this function's callers.
 */
export function bookSections(text: string): [string, string][] {
  const pages = text.split("\f");
  const offsets: number[] = [];
  let at = 0;
  for (const p of pages) {
    offsets.push(at);
    at += p.length + 1;
  }
  const firstLine = (p: string) => (p.split("\n").find((l) => l.trim() !== "") ?? "").trim();
  const heads = pages.map(firstLine);
  const running: { num: string; title: string; page: number }[] = [];
  heads.forEach((h, page) => {
    const m = /^(\d{1,2}\.\d{1,2})\.\s+(.+?)(?:\s+\d+)?$/.exec(h);
    if (m && !running.some((r) => r.num === m[1])) running.push({ num: m[1], title: m[2].trim(), page });
  });
  if (running.length === 0) return [];
  const backPage = heads.findIndex((h, i) => i > running[0].page && /^(Selected |Index$|INDEX$)/.test(h));
  const back = backPage < 0 ? text.length : offsets[backPage];
  const LOOK_BACK = 3; // pages
  const starts: { at: number; name: string }[] = [];
  for (const r of running) {
    if (offsets[r.page] >= back) break;
    const words = r.title.split(/\s+/).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const re = new RegExp(`^\\f?${r.num.replace(".", "\\.")}[ \\t]*\\n?[ \\t]*\\n?[ \\t]*${words.join("\\s+")}[ \\t]*$`, "gm");
    const from = offsets[Math.max(0, r.page - LOOK_BACK)];
    const to = offsets[r.page] + pages[r.page].length;
    // A heading that opens a page starts after the form feed.
    const hits = [...text.slice(from, to).matchAll(re)].map((m) => from + (m.index ?? 0) + (m[0].startsWith("\f") ? 1 : 0));
    const start = hits.length ? hits[hits.length - 1] : offsets[r.page];
    if (starts.length && start <= starts[starts.length - 1].at) continue;
    starts.push({ at: start, name: `${r.num} ${r.title}` });
  }
  return starts.map((x, i) => [x.name, text.slice(x.at, i + 1 < starts.length ? starts[i + 1].at : back)]);
}

/**
 * The references of the ③ fallback (DECISIONS, Phase 2 統計・ベクトルの単元 2),
 * in the order rule 2 reads them:
 *
 *   1. the CEDs: AP Calculus AB/BC (`ced`) and AP Statistics (`cedStats`),
 *      hits per section ("front", "unitN", topic "n.m", "exam")
 *   2. OpenStax: hits in the body of the books, and the section titles
 *      the wording occurs in; Illustrative Mathematics (IM 6–8 and
 *      9–12): hits per lesson ("Geometry 1.3 Title") and the course
 *      glossaries that list the wording as a headword; and CK-12 Geometry /
 *      Algebra: hits per section ("CK-12 Geometry 1.17 Vertical Angles") and
 *      the section titles. One tier: the candidate with more hits in the
 *      three together wins (DECISIONS, Phase 2 幾何・離散の単元 2 and 3)
 *   3. Nicholson, Linear Algebra with Applications, and Levin, Discrete
 *      Mathematics: An Open Introduction: hits per section ("n.m Title")
 *   4. the English Wikipedia article the entry lands on (not per candidate:
 *      scripts/ledger/wikihead.py)
 *
 * The fields added after 2 are optional so that a counts.json written
 * before them still reads.
 */
export interface ReferenceHits {
  /** candidate -> AP Calculus CED section -> hits */
  ced: Record<string, Record<string, number>>;
  /** candidate -> AP Statistics CED section -> hits */
  cedStats?: Record<string, Record<string, number>>;
  /** candidate -> hits in the OpenStax body (written corpus) */
  openstax: Record<string, number>;
  /** candidate -> OpenStax section titles that contain it */
  openstaxTitles: Record<string, string[]>;
  /** candidate -> Nicholson section -> hits */
  nicholson?: Record<string, Record<string, number>>;
  /** candidate -> Levin section -> hits */
  levin?: Record<string, Record<string, number>>;
  /** candidate -> IM lesson ("Geometry 1.3 Title") -> hits */
  im?: Record<string, Record<string, number>>;
  /** candidate -> IM courses whose glossary has it as a headword */
  imGlossary?: Record<string, string[]>;
  /** candidate -> CK-12 section ("CK-12 Geometry 1.17 Vertical Angles") -> hits in the body */
  ck12?: Record<string, Record<string, number>>;
  /** candidate -> CK-12 section titles that contain it */
  ck12Titles?: Record<string, string[]>;
  /** The English Wikipedia article that names the entry (rule 2, last step). */
  wikipedia?: WikipediaName;
}

/** Where the Wikipedia name came from: the ja article's en langlink, or en.term after redirects. */
export interface WikipediaName {
  title: string;
  via: "ja-langlink" | "en-redirect";
}

/**
 * Entries whose English Wikipedia article (wikihead.py) is another concept,
 * so its name does not settle the headword (DECISIONS, Phase 2 幾何・離散の
 * 単元 2: a reference's name counts only for the same concept). id -> why.
 */
export const WIKIPEDIA_NOT_SAME: Record<string, string> = {
  // en.term "circular permutation" redirects there: a permutation with one cycle (group theory),
  // not the arrangements around a circle of 円順列
  "circular-permutation": "Cyclic permutation",
  // en.term "number of divisors" redirects there: the family σ_x (sum of the x-th powers of
  // the divisors), of which the number of divisors is one member
  "number-of-divisors": "Divisor function",
  // 素因数分解's langlink: factoring an integer into any factors, an article about the
  // computational problem and its algorithms; "prime factorization" itself redirects there
  "prime-factorization": "Integer factorization",
  // batch 5: the Geometry properties of equality / congruence and the law of syllogism.
  // "transitive property" redirects to the relations that have the property, not the property
  "transitive-property": "Transitive relation",
  // "symmetric property" redirects to symmetry in general (figures, physics)
  "symmetric-property": "Symmetry",
  // 三段論法's langlink: the categorical syllogism (Aristotle); the law of syllogism is the
  // hypothetical syllogism p → q, q → r ⊢ p → r
  "law-of-syllogism": "Syllogism",
  // 単元 3: "existence proof" redirects to the constructive proof, one kind of existence proof
  "existence-proof": "Constructive proof",
};

/** "Translation (geometry)" -> "translation"; a name keeps its capital ("Ceva's theorem"). */
export function wikipediaHead(title: string): string {
  const t = title.replace(/\s*\([^)]*\)$/, "");
  const first = t.split(/\s+/)[0];
  const name = /['’]s$/.test(first) || /^[A-Z][a-z]*[A-Z]/.test(first) || /^[A-Z]{2,}/.test(first);
  return name ? t : t.charAt(0).toLowerCase() + t.slice(1);
}

export const emptyReference = (): ReferenceHits => ({
  ced: {},
  cedStats: {},
  openstax: {},
  openstaxTitles: {},
  nicholson: {},
  levin: {},
  im: {},
  imGlossary: {},
  ck12: {},
  ck12Titles: {},
});

/** The sectioned texts of the references other than OpenStax, already normalized. */
export interface MoreReferences {
  cedStats?: [string, string][];
  nicholson?: [string, string][];
  levin?: [string, string][];
  /** IM 6–8 and 9–12, one section per lesson */
  im?: [string, string][];
  /** course -> glossary headwords */
  imGlossary?: Record<string, string[]>;
  /** CK-12 Geometry and Algebra, one section per page ("CK-12 Geometry 1.17 Vertical Angles") */
  ck12?: [string, string][];
}

/**
 * Counts each candidate in the references the way terms are counted
 * (inflection folded, "…" a blank). `ced` is cedSections() of cedText();
 * `openstax` the normalized OpenStax docs; `titles` their section titles;
 * `more` the AP Statistics CED, the two books, IM and CK-12, sectioned and
 * normalized, and the IM glossaries. A CK-12 section title ("… 1.17
 * Vertical Angles") counts like an OpenStax one. A glossary counts a candidate when the
 * whole headword is that wording ("translation", "arc (of a circle)" is arc).
 */
export function referenceHits(
  candidates: string[],
  ced: [string, string][],
  openstax: string[],
  titles: string[],
  more: MoreReferences = {},
): ReferenceHits {
  const out = emptyReference();
  const bySection = (into: Record<string, Record<string, number>>, c: string, re: RegExp, sections: [string, string][]) => {
    for (const [section, text] of sections) {
      const n = starts(text, re).length;
      if (n) (into[c] ??= {})[section] = (into[c]?.[section] ?? 0) + n;
    }
  };
  for (const c of candidates) {
    const re = termRegex(c);
    if (!re) continue;
    bySection(out.ced, c, re, ced);
    bySection(out.cedStats!, c, re, more.cedStats ?? []);
    const body = openstax.reduce((n, text) => n + starts(text, re).length, 0);
    if (body) out.openstax[c] = body;
    const inTitles = [...new Set(titles.filter((t) => starts(normalize(t), re).length > 0))];
    if (inTitles.length) out.openstaxTitles[c] = inTitles;
    bySection(out.nicholson!, c, re, more.nicholson ?? []);
    bySection(out.levin!, c, re, more.levin ?? []);
    bySection(out.im!, c, re, more.im ?? []);
    bySection(out.ck12!, c, re, more.ck12 ?? []);
    const ck12Titles = (more.ck12 ?? [])
      .map(([name]) => name)
      .filter((name) => starts(normalize(name.replace(/^CK-12 \S+ [\d.]+ /, "")), re).length > 0);
    if (ck12Titles.length) out.ck12Titles![c] = ck12Titles;
    // A form's alternatives without its "!w" marks ("vertical shift | shifted … units").
    const forms = c.split(FORM_OR).map((f) => f.split(/\s+/).filter((w) => !NOT.test(w)).join(" "));
    const courses = Object.entries(more.imGlossary ?? {})
      .filter(([, heads]) => heads.some((h) => forms.some((f) => sameWording(h.replace(/\s*\([^)]*\)\s*$/, ""), f))))
      .map(([course]) => course);
    if (courses.length) out.imGlossary![c] = courses;
  }
  return out;
}

/** Does the reference count name any candidate at all? */
export const referred = (r: ReferenceHits): boolean =>
  r.wikipedia !== undefined ||
  [r.ced, r.cedStats ?? {}, r.openstax, r.openstaxTitles, r.nicholson ?? {}, r.levin ?? {}, r.im ?? {}, r.imGlossary ?? {}, r.ck12 ?? {}, r.ck12Titles ?? {}].some(
    (x) => Object.keys(x).length > 0,
  );

/** Which reference settled the headword. */
export type ReferenceBy = "ced" | "ced-stats" | "openstax" | "im" | "ck12" | "nicholson" | "levin" | "wikipedia";

/** The high-school references of rule 2 (CED, OpenStax, IM, CK-12): hits of every candidate together, per reference. */
export function highSchoolHits(ref: ReferenceHits, order: string[]): { ced: number; openstax: number; im: number; ck12: number } {
  const sum = (by: Record<string, Record<string, number>> | undefined, c: string) =>
    Object.values(by?.[c] ?? {}).reduce((a, b) => a + b, 0);
  let ced = 0;
  let openstax = 0;
  let im = 0;
  let ck12 = 0;
  for (const c of order) {
    ced += sum(ref.ced, c) + sum(ref.cedStats, c);
    openstax += (ref.openstax[c] ?? 0) + (ref.openstaxTitles[c]?.length ?? 0);
    im += sum(ref.im, c) + (ref.imGlossary?.[c]?.length ?? 0);
    ck12 += sum(ref.ck12, c) + (ref.ck12Titles?.[c]?.length ?? 0);
  }
  return { ced, openstax, im, ck12 };
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
 *                        over as the Japanese headword (LIATE), a US name
 *                        with no Japanese counterpart (mapping none) whose
 *                        Japanese headword is this project's translation
 *                        (two-column proof: the English is the original),
 *                        a wording a CED itself uses (the Candidates Test), or
 *                        a wording one reference uses REFERENCE_NAMED times
 *                        or more (CED, OpenStax, IM, CK-12, Nicholson, Levin;
 *                        linear pair in CK-12 Geometry)
 *   reference            otherwise the headword is what the CEDs (AP Calculus
 *                        / AP Statistics) call it, failing that what OpenStax,
 *                        IM or CK-12 calls it (one tier: body, section title,
 *                        lesson, glossary), failing that what Nicholson /
 *                        Levin call it, failing that the name of the English
 *                        Wikipedia article (wikihead.py). No register is claimed
 *   undecided            no reference uses any candidate: a human looks
 */
export type Settled =
  | { kind: "no-fixed-expression"; spoken: number; written: number }
  | { kind: "reference"; by: ReferenceBy; head: string; where: string[] }
  | { kind: "undecided" };

/**
 * A wording one reference uses this many times or more is a name English has
 * (DECISIONS, Phase 2 幾何・離散の単元 3: the IM-glossary exception made general).
 * Counted per reference and per wording: the forms of one wording ("by AAS |
 * AAS congruence | (AAS) congruence", TERM_FORMS) add up, since its hits are
 * the matches of all its forms; two wordings (AAS, angle-angle-side) or two
 * references are never added (Phase 2 中学の単元の前の修正).
 */
export const REFERENCE_NAMED = 3;

export function settleUndecided(
  entry: { mapping?: string; ja?: string; en?: string; projectTranslation?: boolean },
  raw: { spoken: number; written: number },
  ref: ReferenceHits,
  order: string[],
): Settled {
  const { mapping, ja, en } = entry;
  const best = (score: (c: string) => number) =>
    order.filter((c) => score(c) > 0).sort((a, b) => score(b) - score(a) || order.indexOf(a) - order.indexOf(b))[0];
  const sum = (by: Record<string, Record<string, number>> | undefined, c: string) =>
    Object.values(by?.[c] ?? {}).reduce((a, b) => a + b, 0);
  const cedTotal = (c: string) => sum(ref.ced, c) + sum(ref.cedStats, c);
  const ced = best(cedTotal);
  const borrowed = ja !== undefined && en !== undefined && ja.trim().toLowerCase() === en.trim().toLowerCase();
  const openstax = (c: string) => (ref.openstax[c] ?? 0) + (ref.openstaxTitles[c]?.length ?? 0);
  const im = (c: string) => sum(ref.im, c) + (ref.imGlossary?.[c]?.length ?? 0);
  const ck12 = (c: string) => sum(ref.ck12, c) + (ref.ck12Titles?.[c]?.length ?? 0);
  // One reference uses the wording REFERENCE_NAMED times or more (a CED, any number).
  const inOne = (c: string) =>
    [openstax(c), im(c), ck12(c), sum(ref.nicholson, c), sum(ref.levin, c)].some((n) => n >= REFERENCE_NAMED);
  const usedByReference = order.some(inOne);
  // A US name with no Japanese counterpart (mapping none) whose Japanese headword this
  // project made up: the English name is where the entry comes from.
  const usName = entry.projectTranslation === true && mapping === "none";
  const named = borrowed || usName || ced !== undefined || usedByReference;
  if ((mapping === "near" || mapping === "none") && !named && raw.spoken < MIN_TOTAL && raw.written < MIN_TOTAL) {
    return { kind: "no-fixed-expression", ...raw };
  }
  // Topic numbers when the wording is in a topic, else the unit openers / front / exam.
  const topicsOf = (by: Record<string, number>) => {
    const sections = Object.keys(by);
    const topics = sections.filter((s) => /^\d/.test(s));
    return topics.length ? topics : sections;
  };
  if (ced) {
    const stats = sum(ref.cedStats, ced) > sum(ref.ced, ced);
    return stats
      ? { kind: "reference", by: "ced-stats", head: ced, where: topicsOf(ref.cedStats![ced]) }
      : { kind: "reference", by: "ced", head: ced, where: topicsOf(ref.ced[ced]) };
  }
  const os = best((c) => openstax(c) + im(c) + ck12(c));
  if (os) {
    if (ck12(os) > openstax(os) && ck12(os) > im(os)) {
      const titles = ref.ck12Titles?.[os] ?? [];
      const sections = Object.entries(ref.ck12?.[os] ?? {}).sort((a, b) => b[1] - a[1]).map(([s]) => s);
      const listed = [...titles, ...sections.filter((s) => !titles.includes(s))];
      return { kind: "reference", by: "ck12", head: os, where: [...listed, `計 ${sum(ref.ck12, os)} 件`] };
    }
    if (im(os) > openstax(os)) {
      const glossary = (ref.imGlossary?.[os] ?? []).map((g) => `${g} glossary`);
      const lessons = Object.entries(ref.im?.[os] ?? {}).sort((a, b) => b[1] - a[1]).map(([s]) => s);
      return { kind: "reference", by: "im", head: os, where: [...glossary, ...lessons, `計 ${sum(ref.im, os)} 件`] };
    }
    const titles = ref.openstaxTitles[os] ?? [];
    return { kind: "reference", by: "openstax", head: os, where: titles.length ? titles : [`本文 ${ref.openstax[os]} 件`] };
  }
  const book = best((c) => sum(ref.nicholson, c) + sum(ref.levin, c));
  if (book) {
    const levin = sum(ref.levin, book) > sum(ref.nicholson, book);
    const by = (levin ? ref.levin : ref.nicholson)![book];
    const where = Object.entries(by).sort((a, b) => b[1] - a[1]).map(([s]) => s);
    return { kind: "reference", by: levin ? "levin" : "nicholson", head: book, where };
  }
  if (ref.wikipedia) {
    const w = ref.wikipedia;
    const head = order.find((c) => sameWording(c, wikipediaHead(w.title))) ?? wikipediaHead(w.title);
    return { kind: "reference", by: "wikipedia", head, where: [w.title, w.via === "ja-langlink" ? "ja の langlink 先" : "en.term のリダイレクト先"] };
  }
  return { kind: "undecided" };
}

// ------------------------- 見出しの規則: 1 ソース頼みの話し言葉 (中学の単元 2)

/**
 * The headword when the spoken leader rests on one source (DECISIONS, Phase 2
 * 中学の単元 2 の前の修正 3): without the source that gives the spoken leader
 * most of its hits, the spoken verdict is ③ or another wording leads, while
 * the written corpus (①) or a CED settles on another wording. The headword is
 * then the written / CED wording and the spoken leader a spoken variant - one
 * lecturer's habit does not set the headword against the textbooks and the
 * CED (negative linear relationship, Khan Academy only, against negative
 * correlation in OpenStax and the AP Statistics CED).
 *
 * The written corpus comes before the CED (the corpus before the references,
 * as in rule 1 and 2). The rule does not apply when the written corpus (① or
 * ②) or the CED (its most-used candidate) backs the spoken leader - left
 * Riemann sum is the CED's name, whatever OpenStax writes - nor to a leader
 * that only thins out without its source (the same leader, ② instead of ①).
 *
 * When the written ① rests on one source as well (without its biggest source
 * it is ③ or another wording leads), neither register speaks for the classroom
 * and the written wording does not take the headword (DECISIONS, Phase 2 中学の
 * 単元 3 の前の修正 1: rectangular box is OpenStax Calculus, constant of variation
 * the OpenStax Algebra books). The headword is then what the reference for the
 * entry's level calls it (levelReference): IM for 中学, CK-12 and IM for
 * Geometry, the CED for AP. When that reference names no wording, or names the
 * spoken leader, the spoken leader stays (by "spoken").
 */
export interface LeanHead {
  /** The spoken leader, and the source it rests on. */
  spoken: string;
  source: string;
  /** The wording the headword takes, and where that comes from. */
  head: string;
  by: "written" | "ced" | LevelReference | "spoken";
  /** by level reference / spoken: the written ① that also rests on one source, and that source. */
  written?: { head: string; source: string };
  /** by spoken: the level's reference that names the spoken leader too (none: it names no wording). */
  agrees?: LevelReference;
}

/** The reference for an entry's level (DECISIONS, Phase 2 中学の単元 3 の前の修正 1). */
export type LevelReference = "im" | "ck12-im" | "ced";

export interface Level {
  jp?: string[];
  us?: string[];
}

/**
 * 中学 (中1–中3) -> IM, else Geometry -> CK-12 and IM (one tier), else AP
 * Calculus / AP Statistics -> the CEDs. The first that applies, in this order
 * (the level where the learner meets the word first). Other levels have none.
 */
export function levelReferenceOf(level: Level | undefined): LevelReference | null {
  if ((level?.jp ?? []).some((l) => /^中[123]$/.test(l))) return "im";
  if ((level?.us ?? []).includes("Geometry")) return "ck12-im";
  if ((level?.us ?? []).some((l) => l.startsWith("AP "))) return "ced";
  return null;
}

/**
 * The wording the level's reference uses most (lessons, sections, section
 * titles and glossaries together, as in settleUndecided). None when it uses no
 * candidate, or two candidates equally often - unless the two are one wording
 * counted twice (box plot / boxplot match the same places): then the one
 * first in `order` (en.term, alt, variants).
 */
export function levelReferenceHead(ref: ReferenceHits | undefined, by: LevelReference, order: string[] = []): string | null {
  if (!ref) return null;
  const sum = (x: Record<string, Record<string, number>> | undefined, c: string) =>
    Object.values(x?.[c] ?? {}).reduce((a, b) => a + b, 0);
  const im = (c: string) => sum(ref.im, c) + (ref.imGlossary?.[c]?.length ?? 0);
  const ck12 = (c: string) => sum(ref.ck12, c) + (ref.ck12Titles?.[c]?.length ?? 0);
  const ced = (c: string) => sum(ref.ced, c) + sum(ref.cedStats, c);
  const score = by === "im" ? im : by === "ck12-im" ? (c: string) => ck12(c) + im(c) : ced;
  const names = [
    ...new Set([
      ...Object.keys(ref.ced),
      ...Object.keys(ref.cedStats ?? {}),
      ...Object.keys(ref.im ?? {}),
      ...Object.keys(ref.imGlossary ?? {}),
      ...Object.keys(ref.ck12 ?? {}),
      ...Object.keys(ref.ck12Titles ?? {}),
    ]),
  ]
    .filter((c) => score(c) > 0)
    .sort((a, b) => score(b) - score(a) || rank(a) - rank(b));
  function rank(c: string) {
    const i = order.findIndex((o) => sameWording(o, c) || o === c);
    return i < 0 ? order.length : i;
  }
  if (names.length === 0) return null;
  const places = (c: string) =>
    JSON.stringify([ref.im?.[c], ref.imGlossary?.[c], ref.ck12?.[c], ref.ck12Titles?.[c], ref.ced[c], ref.cedStats?.[c]]);
  if (names.length > 1 && score(names[0]) === score(names[1]) && places(names[0]) !== places(names[1])) return null;
  return names[0];
}

/** Does a ① rest on one source: without its biggest source, ③ or another wording leads? */
function leansOnOne(v: Verdict | null): v is Verdict & { dependsOn: Dependence } {
  if (v === null || v.kind === "undecided" || !v.dependsOn) return false;
  const w = v.dependsOn.without;
  return w.kind === "undecided" || !sameWording(headsOf(w)[0], headsOf(v)[0]);
}

export function spokenLeanHead(
  spoken: Verdict,
  written: Verdict | null,
  ref: ReferenceHits | undefined,
  level?: Level,
  order: string[] = [],
): LeanHead | null {
  if (!leansOnOne(spoken)) return null;
  const lead = headsOf(spoken)[0];
  const source = spoken.dependsOn.source;
  // The written corpus or the CED backs the spoken leader: it stays. A written
  // "let u =" is the spoken "let u equal" with the sign written out, not
  // another wording.
  const read = (t: string) => t.replace(/\s*=\s*/g, " equal ").trim();
  if (written && headsOf(written).some((h) => sameWording(read(h), read(lead)))) return null;
  const sum = (by: Record<string, Record<string, number>> | undefined, c: string) =>
    Object.values(by?.[c] ?? {}).reduce((a, b) => a + b, 0);
  const ced = (c: string) => (ref ? sum(ref.ced, c) + sum(ref.cedStats, c) : 0);
  const top = ref
    ? [...new Set([...Object.keys(ref.ced), ...Object.keys(ref.cedStats ?? {})])]
        .filter((c) => ced(c) > 0)
        .sort((a, b) => ced(b) - ced(a))[0]
    : undefined;
  if (top !== undefined && ced(lead) >= ced(top)) return null;
  if (written?.kind === "single" && leansOnOne(written)) {
    // Both registers rest on one source: the level's reference, else the spoken leader.
    const also = { head: written.head, source: written.dependsOn.source };
    const by = levelReferenceOf(level);
    const head = by ? levelReferenceHead(ref, by, order) : null;
    if (by && head !== null && !sameWording(head, lead)) return { spoken: lead, source, head, by, written: also };
    return { spoken: lead, source, head: lead, by: "spoken", written: also, ...(by && head !== null ? { agrees: by } : {}) };
  }
  if (written?.kind === "single") return { spoken: lead, source, head: written.head, by: "written" };
  if (top !== undefined) return { spoken: lead, source, head: top, by: "ced" };
  return null;
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
