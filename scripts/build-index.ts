/**
 * Builds public/search-index.json, the single file the site fetches for search
 * (PLAN.md 7). Every entry is reachable from かな / カナ / ローマ字 / English:
 *
 *   ja      解の公式 + alternates
 *   reading かいのこうしき          (romaji is derived from it in the browser)
 *   en      quadratic formula + alternates
 *
 * The format is compact (src/lib/search.ts CompactDoc): arrays instead of
 * objects, and nothing the browser can derive (URL, romaji, level), so the
 * first search on a slow phone stays under a second (PLAN Phase 4).
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, isPublishable, loadAll } from "./lib/load.js";
import { isExplanatoryTranslation, referenceWordings } from "../src/lib/gloss.js";
import { BIT_GLOSS, BIT_VERIFIED, type CompactDoc, type CompactIndex } from "../src/lib/search.js";

const bits = (data: Record<string, unknown>, gloss = false): number =>
  (data.confidence === "verified" ? BIT_VERIFIED : 0) | (gloss ? BIT_GLOSS : 0);

function build(): CompactDoc[] {
  const all = loadAll();
  const docs: CompactDoc[] = [];
  const wordings = referenceWordings(all.terms.map((e) => e.data));

  for (const { data } of all.terms) {
    if (!isPublishable(data)) continue;
    const ja = data.ja as { term: string; reading: string; alt?: string[] };
    const en = data.en as { term: string; alt?: string[] };
    docs.push(["t", data.id, [ja.term, ...(ja.alt ?? [])], ja.reading, [en.term, ...(en.alt ?? [])], "", bits(data, isExplanatoryTranslation(data, wordings))]);
  }

  for (const { data } of all.symbols) {
    if (!isPublishable(data)) continue;
    const spoken = (data.spoken_en as { text: string }[]).map((s) => s.text);
    docs.push(["s", data.id, [String(data.name_ja)], String(data.spoken_ja), [...spoken, String(data.name_en)], "", bits(data)]);
  }

  for (const { data } of all.phrases) {
    if (!isPublishable(data)) continue;
    const variants = ((data.variants as { en: string }[] | undefined) ?? []).map((v) => v.en);
    docs.push(["p", data.id, [String(data.intent), String(data.ja)], "", [String(data.en), ...variants], String(data.situation), bits(data)]);
  }

  for (const { data } of all.conventions) {
    if (!isPublishable(data)) continue;
    docs.push(["c", data.id, [String(data.title_ja)], "", [String(data.title_en)], "", bits(data)]);
  }

  return docs;
}

const docs = build();
const index: CompactIndex = { v: 2, docs };
const out = path.join(ROOT, "public", "search-index.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(index), "utf8");

const kb = (fs.statSync(out).size / 1024).toFixed(1);
const unverified = docs.filter((d) => (d[6] & BIT_VERIFIED) === 0).length;
console.log(`search-index.json: ${docs.length} documents (${unverified} unverified), ${kb} KB`);
