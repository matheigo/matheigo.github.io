/**
 * Writes the downloadable dataset to dist/data (PLAN.md 4, 7).
 *
 * Implemented here: JSON per collection, a flat CSV of terms, and the Quizlet
 * import TSV (EN<TAB>JA(reading)) described in PLAN.md 14.
 * Anki .apkg (scripts/export-anki.py, genanki) and the word-to-word PDF
 * (Playwright over /print) are wired up in Phase 4; see docs/DECISIONS.md.
 */
import fs from "node:fs";
import path from "node:path";
import { COLLECTIONS, ROOT, isPublishable, isVerified, loadAll, localDate, type Entry } from "./lib/load.js";

const OUT = path.join(ROOT, "dist", "data");

const csvCell = (v: unknown): string => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const toCsv = (rows: unknown[][]): string =>
  rows.map((r) => r.map(csvCell).join(",")).join("\n") + "\n";

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const all = loadAll();
  const summary: string[] = [];

  for (const c of COLLECTIONS) {
    const rows = all[c].map((e) => e.data).filter(isPublishable);
    fs.writeFileSync(path.join(OUT, `${c}.json`), JSON.stringify(rows, null, 2) + "\n", "utf8");
    summary.push(`${c}.json ${rows.length}`);
  }

  // flat CSV of terms ------------------------------------------------------
  const terms = all.terms.map((e) => e.data).filter(isPublishable);
  const header = [
    "id",
    "ja_term",
    "ja_reading",
    "en_term",
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
  const rows = terms.map((d: Entry) => {
    const ja = d.ja as { term: string; reading: string };
    const en = d.en as { term: string; alt?: string[] };
    const level = d.level as { jp: string[]; us: string[] };
    return [
      d.id,
      ja.term,
      ja.reading,
      en.term,
      (en.alt ?? []).join("; "),
      d.pos,
      d.mapping,
      (d.domains as string[]).join("; "),
      level.jp.join("; "),
      level.us.join("; "),
      d.definition_ja,
      d.definition_en,
      d.latex ?? "",
      d.spoken_en ?? "",
      d.confidence,
    ];
  });
  fs.writeFileSync(path.join(OUT, "terms.csv"), toCsv([header, ...rows]), "utf8");
  summary.push(`terms.csv ${rows.length}`);

  // Quizlet import TSV -----------------------------------------------------
  // Verified only, like the Anki deck: a wrong card you drill is worse than a
  // missing one (PLAN 8, and the user's call on 2026-09-11).
  const drillable = terms.filter(isVerified);
  const tsv = drillable
    .map((d: Entry) => {
      const ja = d.ja as { term: string; reading: string };
      return `${(d.en as { term: string }).term}\t${ja.term}（${ja.reading}）`;
    })
    .join("\n");
  fs.writeFileSync(path.join(OUT, "terms.quizlet.tsv"), tsv + "\n", "utf8");
  summary.push(`terms.quizlet.tsv ${drillable.length} (verified only)`);

  fs.writeFileSync(
    path.join(OUT, "README.txt"),
    [
      "MathEigo JA<->EN dataset",
      "",
      "Data in this directory is released under CC0 1.0 (public domain dedication).",
      "You may reuse it for any purpose, including training models, with no attribution required.",
      "",
      `Generated: ${localDate()}`,
      'JSON and CSV include entries at confidence "likely"; filter on the `confidence` field if you only want reviewed ones.',
      "The Quizlet TSV, the Anki deck and the print PDF contain verified entries only.",
      "",
      "Anki .apkg and the word-to-word PDF are published as GitHub Release assets.",
    ].join("\n") + "\n",
    "utf8",
  );

  console.log(`export -> dist/data: ${summary.join(", ")}`);
}

main();
