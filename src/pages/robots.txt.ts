import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://matheigo.github.io");
  // Everything may be crawled; pages of unverified entries say noindex themselves.
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap.xml", base).href}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
