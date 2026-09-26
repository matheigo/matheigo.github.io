import type { APIRoute } from "astro";
import { indexablePages } from "../lib/seo";

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://matheigo.github.io");
  const urls = indexablePages()
    .map(
      (p) =>
        `  <url><loc>${new URL(p.path, base).href}</loc>${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ""}</url>`,
    )
    .join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
