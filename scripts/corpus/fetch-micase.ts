/**
 * PLAN.md 15, step 1 for MICASE (Michigan Corpus of Academic Spoken English,
 * TalkBank CABank; DECISIONS, Phase 3 記号の前の修正 5).
 *
 *   pnpm corpus:fetch:micase -- <MICASE.zip>     default corpus/micase/MICASE.zip
 *
 * TalkBank serves the MICASE transcripts only to a signed-in user (the zip at
 * https://talkbank.org/data/ca/MICASE?f=zip, the folder and each .cha answer
 * with the sign-in form; checked 2026-09-26). So this is run by hand, like
 * the caption fetch: sign in at talkbank.org, download "Download transcripts"
 * from https://ca.talkbank.org/access/MICASE.html, and point this script at
 * the zip. Nothing here signs in or goes to the network.
 *
 * Each transcript becomes up to three files under corpus/micase/ - the words
 * of its students, of its instructors and of everyone else - listed in the
 * manifest as source "micase" with the speech event (scene) and the speaker
 * class, and `collections: ["phrases"]`: MICASE counts for phrases only, never
 * for terms or symbols. corpus/micase/stats.json has the words by scene and
 * speaker. Cached: the zip is unpacked once (corpus/micase/raw/), and a
 * transcript already converted is skipped on a re-run. Progress is done/total.
 *
 * Use (TalkBank rules, https://ca.talkbank.org/access/MICASE.html): any use is
 * cited as Simpson, Briggs, Ovens and Swales (1999), The Michigan Corpus of
 * Academic Spoken English (docs/SOURCES.md). Only counts leave corpus/.
 */
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { ROOT } from "../lib/load.js";
import type { ManifestEntry } from "./fetch.js";
import { micaseEvent, parseChat, wordCount, type SpeakerClass } from "./micase.js";

const run = promisify(execFile);
const CORPUS = path.join(ROOT, "corpus");
const DIR = path.join(CORPUS, "micase");
const RAW = path.join(DIR, "raw");
const UNZIP_TIMEOUT_MS = 120_000;
const LICENSE = "TalkBank CABank; free for research and education, commercial use needs permission; counted as facts only";
const URL = "https://ca.talkbank.org/access/MICASE.html";
const CLASSES: SpeakerClass[] = ["student", "instructor", "other"];

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : d.name.toLowerCase().endsWith(".cha") ? [p] : [];
  });
}

async function unpack(zip: string) {
  if (fs.existsSync(RAW) && walk(RAW).length > 0) {
    console.log(`raw transcripts already unpacked: ${path.relative(ROOT, RAW)} (delete it to unpack again)`);
    return;
  }
  if (!fs.existsSync(zip)) {
    console.error(`no zip at ${zip}`);
    console.error(`sign in at talkbank.org, download the transcripts from ${URL}, and pass the zip's path.`);
    process.exit(1);
  }
  fs.mkdirSync(RAW, { recursive: true });
  await run("unzip", ["-q", "-o", zip, "-d", RAW], { timeout: UNZIP_TIMEOUT_MS });
}

async function main() {
  const zip = path.resolve(process.argv.slice(2).find((a) => !a.startsWith("-")) ?? path.join(DIR, "MICASE.zip"));
  fs.mkdirSync(DIR, { recursive: true });
  await unpack(zip);

  const files = walk(RAW).sort();
  const fresh: ManifestEntry[] = [];
  const words: Record<string, Record<SpeakerClass, number>> = {};
  const transcripts: Record<string, number> = {};
  let skipped = 0;
  let done = 0;
  for (const file of files) {
    done += 1;
    const event = micaseEvent(file);
    if (!event) {
      skipped += 1;
      continue;
    }
    const t = parseChat(fs.readFileSync(file, "utf8"));
    transcripts[event.scene] = (transcripts[event.scene] ?? 0) + 1;
    words[event.scene] ??= { student: 0, instructor: 0, other: 0 };
    for (const cls of CLASSES) {
      const lines = t.text[cls];
      if (lines.length === 0) continue;
      const rel = `micase/${event.id}.${cls}.txt`;
      const out = path.join(CORPUS, rel);
      if (!fs.existsSync(out)) fs.writeFileSync(out, lines.join("\n") + "\n", "utf8");
      words[event.scene][cls] += wordCount(lines);
      fresh.push({
        id: "micase",
        register: "spoken",
        auto: false,
        file: rel,
        title: `MICASE ${event.id} (${event.scene}, ${cls})`,
        license: LICENSE,
        url: URL,
        collections: ["phrases"],
        scene: event.scene,
        speaker: cls,
      });
    }
    if (done % 20 === 0 || done === files.length) console.log(`  ${done}/${files.length} transcripts`);
  }

  const manifestPath = path.join(CORPUS, "manifest.json");
  const existing: ManifestEntry[] = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : [];
  const merged = new Map(existing.filter((e) => e.id !== "micase").map((e) => [e.file, e]));
  for (const e of fresh) merged.set(e.file, e);
  fs.writeFileSync(manifestPath, JSON.stringify([...merged.values()], null, 2) + "\n", "utf8");

  const total = Object.values(words).reduce((n, w) => n + w.student + w.instructor + w.other, 0);
  fs.writeFileSync(path.join(DIR, "stats.json"), JSON.stringify({ transcripts, words, total }, null, 2) + "\n", "utf8");
  console.log(`\nMICASE: ${files.length - skipped} transcript(s), ${total.toLocaleString()} words, ${fresh.length} file(s) (skipped ${skipped} without a MICASE id)`);
  for (const [scene, w] of Object.entries(words).sort()) {
    console.log(`  ${scene.padEnd(22)} ${String(transcripts[scene]).padStart(3)}  student ${w.student.toLocaleString()}  instructor ${w.instructor.toLocaleString()}  other ${w.other.toLocaleString()}`);
  }
  console.log(`manifest: ${merged.size} file(s) -> corpus/manifest.json`);
  console.log("next: pnpm corpus:count && pnpm corpus:decide   (MICASE counts for phrases only)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
