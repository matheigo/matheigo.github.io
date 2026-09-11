// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://matheigo.github.io", // org site repo: no `base` needed. A custom .org domain can be added later without touching this.
  output: "static",
  build: { format: "directory" },
  devToolbar: { enabled: false },
});
