/**
 * SEO (PLAN §9 Phase 4 の 5): the sitemap lists only pages that may be
 * indexed, and OGP images render with Japanese glyphs.
 */
import { describe, expect, it } from "vitest";
import sharp from "sharp";
import { indexablePages } from "../src/lib/seo";
import { terms, symbols, conventions } from "../src/lib/data";
import { fontsFor, renderCard } from "../scripts/build-og";
import { ogPath } from "../src/lib/og";

describe("sitemap", () => {
  const paths = indexablePages().map((p) => p.path);

  it("always lists the top, about, download and curriculum pages", () => {
    expect(paths).toEqual(expect.arrayContaining(["/", "/about/", "/download/", "/curriculum/"]));
    expect(paths.filter((p) => p.startsWith("/curriculum/")).length).toBeGreaterThan(100);
  });

  it("lists an entry page only when the entry is verified (the rest carry noindex)", () => {
    const listed = (prefix: string) => paths.filter((p) => p.startsWith(prefix) && p !== prefix);
    expect(listed("/terms/").length).toBe(terms.filter((t) => t.confidence === "verified").length);
    expect(listed("/symbols/").length).toBe(symbols.filter((s) => s.confidence === "verified").length);
    expect(listed("/conventions/").length).toBe(conventions.filter((c) => c.confidence === "verified").length);
  });

  it("uses trailing slashes like the site's links", () => {
    for (const p of paths) expect(p.endsWith("/")).toBe(true);
  });
});

describe("OGP images", () => {
  it("loads only the Noto Sans JP subsets the text needs", () => {
    const few = fontsFor("割合");
    const more = fontsFor("割合 ratio to the base amount 解の公式 微分積分");
    expect(few.length).toBeGreaterThan(0);
    expect(few.length).toBeLessThanOrEqual(more.length);
    expect(more.length).toBeLessThan(40);
  });

  it("renders a 1200×630 PNG for an entry, with the 説明の訳 mark when needed", async () => {
    const png = await renderCard({
      kicker: "数学の用語 日本語 → 英語",
      title: "割合",
      sub: "わりあい",
      en: "ratio to the base amount",
      mark: "説明の訳（英語の用語ではない）",
    });
    const meta = await sharp(png).metadata();
    expect(meta.format).toBe("png");
    expect([meta.width, meta.height]).toEqual([1200, 630]);
  });

  it("gives noindex pages the site-wide image", () => {
    expect(ogPath("terms", "rate", false)).toBe("/og/default.png");
    expect(ogPath("terms", "rate", true)).toBe("/og/terms/rate.png");
  });
});
