/**
 * OGP images (PLAN §9 Phase 4 の 5). One image per indexable page, generated
 * at build time by scripts/build-og.ts; pages that carry noindex (everything
 * not yet verified) share the site-wide image, since they are not meant to be
 * found or shared yet (DECISIONS, Phase 4).
 */
export type OgCollection = "terms" | "symbols" | "conventions";

export const OG_DEFAULT = "/og/default.png";

export function ogPath(collection: OgCollection, id: string, indexable: boolean): string {
  return indexable ? `/og/${collection}/${id}.png` : OG_DEFAULT;
}
