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
 * Shared by the site, the search index and every export, so the mark is the
 * same wherever the English appears.
 */
export const GLOSS_LABEL = "説明の訳（英語の用語ではない）";
export const GLOSS_SHORT = "説明の訳";
export const GLOSS_NOTE =
  "この英語は、日本にしかない概念を説明するためにこの辞典が付けた訳です。米国の教室で使う決まった用語ではないので、英語の用語として覚えないでください。";

interface GlossInput {
  mapping?: unknown;
  flags?: unknown;
}

export function isExplanatoryTranslation(entry: GlossInput): boolean {
  if (entry.mapping !== "none") return false;
  const flags = Array.isArray(entry.flags) ? (entry.flags as { code?: unknown }[]) : [];
  return flags.some((f) => f?.code === "corpus-no-fixed-expression");
}
