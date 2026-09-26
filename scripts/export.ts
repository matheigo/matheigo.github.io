/**
 * Writes the downloadable dataset to dist/data (PLAN.md 4, 7).
 *
 *   JSON  every collection, entries past draft, with `confidence`
 *   CSV   a flat table per collection (terms, symbols, phrases, conventions)
 *   TSV   Quizlet import (EN<TAB>JA(reading)), verified only (PLAN 14)
 *
 * The Anki deck (scripts/export-anki.py) and the word-to-word PDF
 * (scripts/export-pdf.ts) read the JSON written here and keep verified
 * entries only (DECISIONS, Phase 0).
 *
 * Terms whose English is this project's paraphrase of a Japanese-only concept
 * carry `en_is_explanatory_translation: true` (JSON) and the same column in the
 * CSV; every export that shows the English marks it (PLAN §9 Phase 4 の 2).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { COLLECTIONS, ROOT, isPublishable, isVerified, loadAll, localDate, type Entry } from "./lib/load.js";
import { GLOSS_LABEL, isExplanatoryTranslation } from "../src/lib/gloss.js";

export const OUT = path.join(ROOT, "dist", "data");

const csvCell = (v: unknown): string => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const toCsv = (rows: unknown[][]): string => rows.map((r) => r.map(csvCell).join(",")).join("\n") + "\n";

const join = (xs: unknown) => (Array.isArray(xs) ? xs.join("; ") : "");

/** Adds the derived flag to a term; other collections pass through unchanged. */
export function withGloss(d: Entry): Entry {
  return { ...d, en_is_explanatory_translation: isExplanatoryTranslation(d) };
}

/** The English as an export shows it: explanatory translations carry the label. */
export const enForExport = (d: Entry): string => {
  const en = (d.en as { term: string }).term;
  return isExplanatoryTranslation(d) ? `${en}（${GLOSS_LABEL}）` : en;
};

export function termsCsv(terms: Entry[]): string {
  const header = [
    "id",
    "ja_term",
    "ja_reading",
    "en_term",
    "en_is_explanatory_translation",
    "en_alt",
    "pos",
    "mapping",
    "domains",
    "level_jp",
    "level_us",
    "definition_ja",
    "definition_en",
    "latex",
    "spoken_en",
    "confidence",
  ];
  const rows = terms.map((d) => {
    const ja = d.ja as { term: string; reading: string };
    const en = d.en as { term: string; alt?: string[] };
    const level = d.level as { jp: string[]; us: string[] };
    return [
      d.id,
      ja.term,
      ja.reading,
      en.term,
      isExplanatoryTranslation(d) ? "true" : "false",
      join(en.alt),
      d.pos,
      d.mapping,
      join(d.domains),
      join(level.jp),
      join(level.us),
      d.definition_ja,
      d.definition_en,
      d.latex ?? "",
      d.spoken_en ?? "",
      d.confidence,
    ];
  });
  return toCsv([header, ...rows]);
}

function symbolsCsv(rows: Entry[]): string {
  const header = ["id", "category", "name_ja", "name_en", "latex", "spoken_en", "spoken_ja", "term_ref", "level_jp", "level_us", "confidence"];
  return toCsv([
    header,
    ...rows.map((d) => [
      d.id,
      d.category ?? "",
      d.name_ja,
      d.name_en,
      d.latex,
      (d.spoken_en as { text: string; register: string }[]).map((s) => `${s.text} (${s.register})`).join("; "),
      d.spoken_ja,
      d.term_ref ?? "",
      join((d.level as { jp: string[] }).jp),
      join((d.level as { us: string[] }).us),
      d.confidence,
    ]),
  ]);
}

function phrasesCsv(rows: Entry[]): string {
  const header = ["id", "situation", "intent", "en", "ja", "register", "variants", "notes", "confidence"];
  return toCsv([
    header,
    ...rows.map((d) => [
      d.id,
      d.situation,
      d.intent,
      d.en,
      d.ja,
      d.register,
      ((d.variants as { en: string; register: string }[] | undefined) ?? []).map((v) => `${v.en} (${v.register})`).join("; "),
      join(d.notes),
      d.confidence,
    ]),
  ]);
}

function conventionsCsv(rows: Entry[]): string {
  const header = ["id", "category", "title_ja", "title_en", "jp", "us", "advice_ja", "level_jp", "level_us", "confidence"];
  return toCsv([
    header,
    ...rows.map((d) => [
      d.id,
      d.category,
      d.title_ja,
      d.title_en,
      d.jp,
      d.us,
      d.advice_ja,
      join((d.level as { jp: string[] }).jp),
      join((d.level as { us: string[] }).us),
      d.confidence,
    ]),
  ]);
}

/** Quizlet import: EN<TAB>JA（読み）. Verified only, like the Anki deck. */
export function quizletTsv(terms: Entry[]): string {
  return (
    terms
      .filter(isVerified)
      .map((d) => {
        const ja = d.ja as { term: string; reading: string };
        return `${enForExport(d)}\t${ja.term}（${ja.reading}）`;
      })
      .join("\n") + "\n"
  );
}

export interface Manifest {
  generated: string;
  /** Newest `updated` date across the published entries. */
  updated: string;
  counts: Record<string, { published: number; verified: number }>;
}

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const all = loadAll();
  const summary: string[] = [];
  const counts: Manifest["counts"] = {};
  let updated = "";

  for (const c of COLLECTIONS) {
    const rows = all[c].map((e) => e.data).filter(isPublishable);
    const out = c === "terms" ? rows.map(withGloss) : rows;
    fs.writeFileSync(path.join(OUT, `${c}.json`), JSON.stringify(out, null, 2) + "\n", "utf8");
    counts[c] = { published: rows.length, verified: rows.filter((d) => d.confidence === "verified").length };
    for (const d of rows) if (typeof d.updated === "string" && d.updated > updated) updated = d.updated;
    summary.push(`${c}.json ${rows.length}`);
  }

  const pub = (c: (typeof COLLECTIONS)[number]) => all[c].map((e) => e.data).filter(isPublishable);
  fs.writeFileSync(path.join(OUT, "terms.csv"), termsCsv(pub("terms")), "utf8");
  fs.writeFileSync(path.join(OUT, "symbols.csv"), symbolsCsv(pub("symbols")), "utf8");
  fs.writeFileSync(path.join(OUT, "phrases.csv"), phrasesCsv(pub("phrases")), "utf8");
  fs.writeFileSync(path.join(OUT, "conventions.csv"), conventionsCsv(pub("conventions")), "utf8");
  summary.push("terms.csv / symbols.csv / phrases.csv / conventions.csv");

  const tsv = quizletTsv(pub("terms"));
  fs.writeFileSync(path.join(OUT, "terms.quizlet.tsv"), tsv, "utf8");
  summary.push(`terms.quizlet.tsv ${counts.terms.verified} (verified only)`);

  const manifest: Manifest = { generated: localDate(), updated, counts };
  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");

  fs.writeFileSync(
    path.join(OUT, "README.txt"),
    [
      "MathEigo JA<->EN dataset",
      "",
      "Data in this directory is released under CC0 1.0 (public domain dedication).",
      "You may reuse it for any purpose, including training models, with no attribution required.",
      "",
      `Generated: ${manifest.generated} / newest entry: ${manifest.updated}`,
      'JSON and CSV include entries at confidence "likely"; filter on the `confidence` field if you only want reviewed ones.',
      "The Quizlet TSV, the Anki deck and the word-to-word PDF contain verified entries only.",
      "",
      "Terms with en_is_explanatory_translation = true have no English name: en.term is this",
      "project's paraphrase of a Japanese-only concept, not an English term. Do not learn it as one.",
    ].join("\n") + "\n",
    "utf8",
  );

  console.log(`export -> dist/data: ${summary.join(", ")}`);
}

// Run only as a script, so tests can import the helpers.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
