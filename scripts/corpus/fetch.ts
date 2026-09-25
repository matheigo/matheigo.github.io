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

export interface ManifestEntry {
  id: string;
  register: "spoken" | "written";
  auto: boolean;
  file: string;
  title: string;
  license: string;
  url?: string;
}

const PLANNED: Omit<ManifestEntry, "file">[] = [
  // spoken, hand-transcribed - the strongest evidence, and the only acceptable
  // basis for symbols (auto captions misread formulas).
  { id: "mit-18.01", register: "spoken", auto: false, title: "MIT OCW 18.01 Single Variable Calculus", license: "CC BY-NC-SA", url: "https://ocw.mit.edu/" },
  { id: "mit-18.02", register: "spoken", auto: false, title: "MIT OCW 18.02 Multivariable Calculus", license: "CC BY-NC-SA" },
  { id: "mit-18.06", register: "spoken", auto: false, title: "MIT OCW 18.06 Linear Algebra", license: "CC BY-NC-SA" },
  { id: "mit-18.03", register: "spoken", auto: false, title: "MIT OCW 18.03 Differential Equations", license: "CC BY-NC-SA" },
  { id: "mit-6.042", register: "spoken", auto: false, title: "MIT OCW 6.042 Mathematics for Computer Science", license: "CC BY-NC-SA" },
  // spoken, captions
  { id: "khan-algebra", register: "spoken", auto: false, title: "Khan Academy Algebra", license: "CC BY-NC-SA" },
  { id: "khan-ap-calc", register: "spoken", auto: false, title: "Khan Academy AP Calculus", license: "CC BY-NC-SA" },
  { id: "khan-ap-stats", register: "spoken", auto: false, title: "Khan Academy AP Statistics", license: "CC BY-NC-SA" },
  { id: "yt:profleonard", register: "spoken", auto: true, title: "Professor Leonard", license: "captions, counted as facts only" },
  { id: "yt:organicchem", register: "spoken", auto: true, title: "The Organic Chemistry Tutor", license: "captions, counted as facts only" },
  { id: "yt:patrickjmt", register: "spoken", auto: true, title: "PatrickJMT", license: "captions, counted as facts only" },
  { id: "yt:nancypi", register: "spoken", auto: true, title: "NancyPi", license: "captions, counted as facts only" },
  { id: "yt:blackpenredpen", register: "spoken", auto: true, title: "blackpenredpen", license: "captions, counted as facts only" },
  { id: "yt:3blue1brown", register: "spoken", auto: true, title: "3Blue1Brown", license: "captions, counted as facts only" },
  // written
  { id: "openstax-calculus", register: "written", auto: false, title: "OpenStax Calculus Vol 1-3", license: "CC BY-NC-SA 4.0" },
  { id: "openstax-precalculus", register: "written", auto: false, title: "OpenStax Precalculus 2e", license: "CC BY-NC-SA 4.0" },
  { id: "openstax-algtrig", register: "written", auto: false, title: "OpenStax Algebra and Trigonometry 2e", license: "CC BY-NC-SA 4.0" },
  { id: "openstax-introstats", register: "written", auto: false, title: "OpenStax Introductory Statistics 2e", license: "CC BY-NC-SA 4.0" },
  { id: "openstax-prealgebra", register: "written", auto: false, title: "OpenStax Prealgebra 2e", license: "CC BY-NC-SA 4.0" },
  { id: "openstax-elemalg", register: "written", auto: false, title: "OpenStax Elementary Algebra 2e", license: "CC BY-NC-SA 4.0" },
  { id: "openstax-intalg", register: "written", auto: false, title: "OpenStax Intermediate Algebra 2e", license: "CC BY-NC-SA 4.0" },
  { id: "mit-notes", register: "written", auto: false, title: "MIT OCW lecture notes", license: "CC BY-NC-SA" },
];

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
      console.log(`  ${s.id.padEnd(22)} ${s.auto ? "auto " : "human"}  ${s.title}  (${s.license})`);
    }
    console.log("");
  }
  console.log("excluded:");
  for (const e of EXCLUDED) console.log(`  - ${e}`);
  console.log(`\nMIT OCW:        pnpm corpus:fetch:ocw`);
  console.log(`OCW notes:      pnpm corpus:fetch:notes`);
  console.log(`OpenStax:       pnpm corpus:fetch:openstax`);
  console.log(`Khan / YouTube: pnpm corpus:fetch:captions [-- <id> ...]   (run by hand)`);
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
