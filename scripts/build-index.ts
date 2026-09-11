/**
 * Builds public/search-index.json, the single file the site fetches on first
 * search (PLAN.md 7). Every document carries four searchable surfaces so that
 * かな / カナ / ローマ字 / English all hit the same entry:
 *
 *   ja      解の公式 + alternates
 *   reading かいのこうしき
 *   romaji  kainokoushiki  (wanakana, plus a hyphenless form)
 *   en      quadratic formula + alternates
 */
import fs from "node:fs";
import path from "node:path";
import { toRomaji } from "wanakana";
import { ROOT, isPublishable, loadAll, type Entry } from "./lib/load.js";

export interface SearchDoc {
  id: string;
  type: "term" | "symbol" | "phrase" | "convention";
  url: string;
  ja: string;
  reading: string;
  romaji: string;
  en: string;
  hint: string;
  confidence: string;
  level: string;
}

const romajiOf = (reading: string): string => {
  const r = toRomaji(reading);
  return [r, r.replace(/[^a-z0-9]/gi, "")].join(" ");
};

const levelLabel = (data: Entry): string => {
  const level = data.level as { jp?: string[]; us?: string[] } | undefined;
  if (!level) return "";
  return [...(level.jp ?? []), ...(level.us ?? [])].join(" ");
};

function build(): SearchDoc[] {
  const all = loadAll();
  const docs: SearchDoc[] = [];

  for (const { data } of all.terms) {
    if (!isPublishable(data)) continue;
    const ja = data.ja as { term: string; reading: string; alt?: string[] };
    const en = data.en as { term: string; alt?: string[] };
    docs.push({
      id: data.id,
      type: "term",
      url: `/terms/${data.id}`,
      ja: [ja.term, ...(ja.alt ?? [])].join(" "),
      reading: ja.reading,
      romaji: romajiOf(ja.reading),
      en: [en.term, ...(en.alt ?? [])].join(" "),
      hint: en.term,
      confidence: String(data.confidence),
      level: levelLabel(data),
    });
  }

  for (const { data } of all.symbols) {
    if (!isPublishable(data)) continue;
    const spoken = (data.spoken_en as { text: string }[]).map((s) => s.text);
    docs.push({
      id: data.id,
      type: "symbol",
      url: `/symbols#${data.id}`,
      ja: String(data.name_ja),
      reading: String(data.spoken_ja),
      romaji: "",
      en: [String(data.name_en), ...spoken].join(" "),
      hint: spoken[0] ?? String(data.name_en),
      confidence: String(data.confidence),
      level: levelLabel(data),
    });
  }

  for (const { data } of all.phrases) {
    if (!isPublishable(data)) continue;
    const variants = ((data.variants as { en: string }[] | undefined) ?? []).map((v) => v.en);
    docs.push({
      id: data.id,
      type: "phrase",
      url: `/phrases/${data.situation}#${data.id}`,
      ja: [String(data.intent), String(data.ja)].join(" "),
      reading: "",
      romaji: "",
      en: [String(data.en), ...variants].join(" "),
      hint: String(data.en),
      confidence: String(data.confidence),
      level: String(data.situation),
    });
  }

  for (const { data } of all.conventions) {
    if (!isPublishable(data)) continue;
    docs.push({
      id: data.id,
      type: "convention",
      url: `/conventions#${data.id}`,
      ja: [String(data.title_ja), String(data.advice_ja)].join(" "),
      reading: "",
      romaji: "",
      en: String(data.title_en),
      hint: String(data.advice_ja),
      confidence: String(data.confidence),
      level: levelLabel(data),
    });
  }

  return docs;
}

const docs = build();
const out = path.join(ROOT, "public", "search-index.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(docs), "utf8");

const kb = (fs.statSync(out).size / 1024).toFixed(1);
const unverified = docs.filter((d) => d.confidence !== "verified").length;
console.log(`search-index.json: ${docs.length} documents (${unverified} unverified), ${kb} KB`);
