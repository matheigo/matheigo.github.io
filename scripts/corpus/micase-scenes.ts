/**
 * Counts wordings in the students' utterances of MICASE, per speech event
 * (DECISIONS, Phase 3 フレーズの前の修正 5): the numbers behind the rows that
 * ledger/phrases.csv took from MICASE (columns micase_scene, micase_counts).
 *
 *   pnpm corpus:scenes -- --file forms.txt     one wording per line, "# ..." skipped
 *   pnpm corpus:scenes -- "does that mean" "which one"
 *
 * Counted as terms and phrases are (lib.ts countTerm: inflection folded, "…"
 * a one-to-three-word blank, "A | B", "!w"), on corpus/micase/*.student.txt
 * as corpus/manifest.json lists them (fetch-micase.ts). Prints counts only.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "../lib/load.js";
import type { ManifestEntry } from "./fetch.js";
import { countTerm, normalize } from "./lib.js";

export const SCENES = ["office hours", "study group", "discussion section", "lab section"] as const;

function main() {
  const corpus = path.join(ROOT, "corpus");
  const manifestPath = path.join(corpus, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    console.log("corpus/manifest.json is missing - run pnpm corpus:fetch:micase first.");
    return;
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as ManifestEntry[];
  const texts: Record<string, string[]> = {};
  for (const e of manifest) {
    if (e.id !== "micase" || e.speaker !== "student" || !e.scene) continue;
    const file = path.join(corpus, e.file);
    if (fs.existsSync(file)) (texts[e.scene] ??= []).push(normalize(fs.readFileSync(file, "utf8")));
  }
  const args = process.argv.slice(2).filter((a) => a !== "--");
  const at = args.indexOf("--file");
  const forms = (at >= 0 ? fs.readFileSync(args[at + 1], "utf8").split("\n") : args.filter((a) => !a.startsWith("--")))
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith("#"));
  for (const f of forms) {
    const per = SCENES.map((s) => `${s} ${(texts[s] ?? []).reduce((n, t) => n + countTerm(t, f), 0)}`);
    const all = Object.values(texts).flat().reduce((n, t) => n + countTerm(t, f), 0);
    console.log(`${f}\t${per.join(", ")}\t(all speech events ${all})`);
  }
}

main();
