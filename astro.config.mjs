// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://matheigo.github.io", // org site repo: no `base` needed. A custom .org domain can be added later without touching this.
  output: "static",
  trailingSlash: "always",
  build: {
    format: "directory",
    // One request per page: the stylesheet (and KaTeX's, on pages with math) is
    // inlined so the first paint does not wait on a second round trip (PLAN Phase 4: Lighthouse 95+).
    inlineStylesheets: "always",
  },
  devToolbar: { enabled: false },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
