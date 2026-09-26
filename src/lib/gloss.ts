/**
 * 「説明の訳（英語の用語ではない）」— PLAN §9 Phase 4 の 2.
 *
 * Some Japanese concepts have no English name. For those, en.term is this
 * project's own paraphrase (rate → "ratio to the base amount"), and a reader
 * must not learn it as an English term. The set is decided by the data alone:
 * mapping none, and decide.ts found no fixed English expression
 * (flag corpus-no-fixed-expression). Terms whose English name is a real US term
 * (PEMDAS, two-column proof, LIATE, sign chart) never carry that flag.
 *
 * Exception (DECISIONS, Phase 5 監査 セッション 2, H-2): the mark is not put on
 * a term whose en contains a noun that is what a CED or a reference (OpenStax,
 * IM, CK-12, Nicholson, Levin) calls a concept - "make a sign chart" holds the
 * CED's "sign chart", so the English is not a paraphrase even when the whole
 * phrase is counted nowhere. A reference wording is the en.term, of two words
 * or more, of another term that is not a draft, is not itself an explanatory
 * translation, and is backed by a CED / reference source or was settled by one
 * (flag corpus-reference-fallback, not by a Wikipedia article name). One-word
 * nouns (ratio, circle, polynomial) do not count: nearly every paraphrase has
 * one, and "ratio to the base amount" stays a paraphrase.
 *
 * Shared by the site, the search index and every export, so the mark is the
 * same wherever the English appears. Callers that have all the terms pass
 * `referenceWordings(terms)`; without it the exception is not applied.
 */
export const GLOSS_LABEL = "説明の訳（英語の用語ではない）";
export const GLOSS_SHORT = "説明の訳";
export const GLOSS_NOTE =
  "この英語は、日本にしかない概念を説明するためにこの辞典が付けた訳です。米国の教室で使う決まった用語ではないので、英語の用語として覚えないでください。";

type Loose = { [key: string]: unknown };

const flagsOf = (e: Loose): { code?: unknown; note?: unknown }[] => (Array.isArray(e.flags) ? (e.flags as { code?: unknown; note?: unknown }[]) : []);

/** mapping none and flag corpus-no-fixed-expression: the rule without the exception. */
function paraphrase(e: Loose): boolean {
  if (e.mapping !== "none") return false;
  return flagsOf(e).some((f) => f?.code === "corpus-no-fixed-expression");
}

/** A CED or one of the references of rule 2 (docs/SOURCES.md), by the title of a source. */
const REFERENCE_TITLE = /Course and Exam Description|(?<![A-Za-z])CED(?![A-Za-z])|OpenStax|Illustrative Mathematics|(?<![A-Za-z])IM(?![A-Za-z])|CK-12|Nicholson|Levin/;

const normalize = (s: string) => s.toLowerCase().replace(/[’]/g, "'").replace(/[\s\-]+/g, " ").trim();

/**
 * The en.terms (two words or more) that a CED or a reference calls a concept,
 * from all the terms: the set the exception of isExplanatoryTranslation reads.
 */
export function referenceWordings(terms: Loose[]): Set<string> {
  const out = new Set<string>();
  for (const t of terms) {
    if (t.confidence === "draft" || paraphrase(t)) continue;
    const en = (t.en as { term?: unknown } | undefined)?.term;
    if (typeof en !== "string") continue;
    const wording = normalize(en);
    if (wording.split(" ").length < 2) continue;
    const sources = Array.isArray(t.sources) ? (t.sources as { type?: unknown; title?: unknown }[]) : [];
    const byReference =
      sources.some((s) => (s.type === "reference" || s.type === "textbook") && typeof s.title === "string" && REFERENCE_TITLE.test(s.title)) ||
      flagsOf(t).some((f) => f?.code === "corpus-reference-fallback" && typeof f.note === "string" && !/Wikipedia/.test(f.note));
    if (byReference) out.add(wording);
  }
  return out;
}

/** Does en.term hold one of the reference wordings as whole words? */
export function holdsReferenceWording(en: string, wordings: Set<string>): string | null {
  const text = ` ${normalize(en)} `;
  for (const w of wordings) if (text.includes(` ${w} `)) return w;
  return null;
}

export function isExplanatoryTranslation(entry: Loose | { mapping: string; flags?: { code: string }[] }, wordings?: Set<string>): boolean {
  const e = entry as Loose;
  if (!paraphrase(e)) return false;
  if (wordings && wordings.size) {
    const en = (e.en as { term?: unknown } | undefined)?.term;
    if (typeof en === "string" && holdsReferenceWording(en, wordings)) return false;
  }
  return true;
}
