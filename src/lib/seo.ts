/**
 * Which pages search engines may index (PLAN §9 Phase 4 の 5, DECISIONS
 * Phase 0: pages of unverified entries carry noindex). The sitemap lists
 * exactly these; every other page carries <meta name="robots" content="noindex">.
 */
import { conventions, curriculum, phrases, symbols, terms, SITUATIONS } from "./data";

export interface SitemapEntry {
  path: string;
  lastmod?: string;
}

const verified = (x: { confidence: string }) => x.confidence === "verified";
const newest = (xs: { updated?: string }[]) => xs.map((x) => x.updated ?? "").reduce((a, b) => (b > a ? b : a), "") || undefined;

export function indexablePages(): SitemapEntry[] {
  const out: SitemapEntry[] = [
    { path: "/" },
    { path: "/about/" },
    { path: "/download/" },
    { path: "/curriculum/", lastmod: newest(curriculum) },
    ...curriculum.map((u) => ({ path: `/curriculum/${u.id}/`, lastmod: u.updated })),
  ];
  const vt = terms.filter(verified);
  const vs = symbols.filter(verified);
  const vp = phrases.filter(verified);
  const vc = conventions.filter(verified);
  out.push(...vt.map((t) => ({ path: `/terms/${t.id}/`, lastmod: t.updated })));
  if (vs.length) out.push({ path: "/symbols/", lastmod: newest(vs) }, ...vs.map((s) => ({ path: `/symbols/${s.id}/`, lastmod: s.updated })));
  if (vc.length)
    out.push({ path: "/conventions/", lastmod: newest(vc) }, ...vc.map((c) => ({ path: `/conventions/${c.id}/`, lastmod: c.updated })));
  if (vp.length) {
    out.push({ path: "/phrases/", lastmod: newest(vp) });
    for (const s of SITUATIONS) {
      const items = vp.filter((p) => p.situation === s);
      if (items.length) out.push({ path: `/phrases/${s}/`, lastmod: newest(items) });
    }
  }
  return out;
}
