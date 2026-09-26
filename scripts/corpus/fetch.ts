/**
 * Step 1 of PLAN.md 15: bring transcripts into corpus/.
 *
 *   pnpm corpus:fetch --list          show the planned sources
 *   pnpm corpus:fetch --check         verify corpus/manifest.json against what is on disk
 *
 * This file only describes the plan. Actual fetching is split by who
 * distributes the material:
 *
 *   MIT OCW   automated - OCW publishes its own .vtt transcripts under
 *             CC BY-NC-SA. See fetch-ocw.ts (`pnpm corpus:fetch:ocw`).
 *   OCW notes automated - lecture-note PDFs from OCW, through pdftotext. See
 *             fetch-notes.ts (`pnpm corpus:fetch:notes`).
 *   OpenStax  automated - the book source (CNXML) is public on GitHub. See
 *             fetch-openstax.ts (`pnpm corpus:fetch:openstax`).
 *   MICASE    manual - TalkBank serves it to signed-in users only. Download
 *             the zip by hand and run fetch-micase.ts on it
 *             (`pnpm corpus:fetch:micase -- <zip>`). Phrases only.
 *   YouTube   manual - terms of service are the operator's call, and it needs
 *   / Khan    yt-dlp. fetch-captions.ts runs every configured Khan playlist and
 *             YouTube channel as one batch; fetch-captions.sh takes any one
 *             URL. You run them, not CI.
 *
 * corpus/ is gitignored. Transcript text never enters the repository - only
 * counts, source ids and dates do (PLAN 15, licensing).
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "../lib/load.js";

import type { ManifestEntry } from "./sources.js";
export type { ManifestEntry };
import { CORPUS_SOURCES as PLANNED } from "./sources.js";

/** Excluded on purpose: PLAN 15 keeps the English to US classrooms. */
const EXCLUDED = [
  "Eddie Woo and other UK/AU channels - different vocabulary (maths, brackets, sandwich theorem)",
  "Individual channels by non-native lecturers - the target is what US teachers say",
];

const CORPUS = path.join(ROOT, "corpus");

function list() {
  console.log("PLAN 15 corpus sources\n");
  for (const reg of ["spoken", "written"] as const) {
    console.log(`[${reg}]`);
    for (const s of PLANNED.filter((p) => p.register === reg)) {
      console.log(`  ${s.id.padEnd(22)} ${s.auto ? "auto " : "human"}  ${s.title}  (${s.license})${s.collections ? `  [${s.collections.join(", ")} only]` : ""}`);
    }
    console.log("");
  }
  console.log("excluded:");
  for (const e of EXCLUDED) console.log(`  - ${e}`);
  console.log(`\nMIT OCW:        pnpm corpus:fetch:ocw`);
  console.log(`OCW notes:      pnpm corpus:fetch:notes`);
  console.log(`OpenStax:       pnpm corpus:fetch:openstax`);
  console.log(`Khan / YouTube: pnpm corpus:fetch:captions [-- <id> ...]   (run by hand)`);
  console.log(`MICASE:         pnpm corpus:fetch:micase -- <MICASE.zip>   (download by hand after signing in to TalkBank; phrases only)`);
  console.log(`YouTube / Khan: ./scripts/corpus/fetch-captions.sh <id> <url>   (run by hand)`);
  console.log(`Anything else:  plain text at corpus/<id>/*.txt, listed in corpus/manifest.json.`);
  console.log(`See scripts/corpus/manifest.example.json for the shape.`);
}

function check() {
  const manifestPath = path.join(CORPUS, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    console.log(`no corpus yet: ${manifestPath} does not exist`);
    console.log(`this is expected until Phase 1 is finished (PLAN 15, 実施タイミング)`);
    return;
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as ManifestEntry[];
  let missing = 0;
  for (const m of manifest) {
    const p = path.join(CORPUS, m.file);
    if (!fs.existsSync(p)) {
      console.log(`  MISSING ${m.id}  ${m.file}`);
      missing += 1;
    }
  }
  const known = new Set(PLANNED.map((p) => p.id));
  for (const m of manifest) {
    if (!known.has(m.id)) console.log(`  note    ${m.id} is not in the planned source list`);
  }
  console.log(`${manifest.length} file(s) listed, ${missing} missing`);
}

const arg = process.argv[2] ?? "--list";
if (arg === "--check") check();
else list();
