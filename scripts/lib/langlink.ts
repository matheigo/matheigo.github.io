/**
 * How crosscheck compares an English Wikipedia title with the English an
 * entry claims (PLAN.md 8, stage 2). Case, a trailing "(qualifier)", dashes
 * and punctuation are not differences; neither is a link to a section of the
 * article ("Proportionality (mathematics)#Inverse proportionality"): the
 * langlink of 反比例 may point to the article or to its section (Phase 5
 * 監査 3 の H-7).
 */
export const normalizeTitle = (s: string): string =>
  s
    .replace(/#.*$/, "")
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*$/, "")
    .replace(/[‐-―]/g, "-")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
