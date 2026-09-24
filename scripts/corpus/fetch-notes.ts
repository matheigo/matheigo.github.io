/**
 * PLAN.md 15, step 1 for the written corpus: MIT OCW lecture notes (mit-notes).
 *
 *   pnpm corpus:fetch:notes
 *
 * OCW publishes lecture notes as PDFs under CC BY-NC-SA, off its own servers,
 * so gathering them is a plain download. For each course below, the notes
 * page links one resource page per lecture (or chapter); each resource page
 * links its PDF. The PDF is turned into text with pdftotext (poppler), which
 * must be installed: brew install poppler.
 *
 * Courses: the same five subjects as the spoken OCW corpus, in the offerings
 * that publish typed notes. 18.06 has none (the course uses Strang's
 * textbook, which is not open), so it is absent.
 *
 * Every request has a timeout and a retry limit, progress is printed as
 * done/total, and everything is cached under corpus/mit-notes/ (the list of
 * PDFs per course, the PDFs, the text): a re-run only downloads what is
 * missing.
 *
 * Writes corpus/mit-notes/<course>-<name>.txt and merges corpus/manifest.json.
 * corpus/ is gitignored: note text never enters the repository.
 */
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { ROOT } from "../lib/load.js";
import type { ManifestEntry } from "./fetch.js";

const run = promisify(execFile);
const BASE = "https://ocw.mit.edu";
const CORPUS = path.join(ROOT, "corpus");
const DIR = path.join(CORPUS, "mit-notes");
const UA = "MathEigo corpus builder (CC0 dictionary project; contact via GitHub issues)";
const TIMEOUT_MS = 30_000;
const MAX_RETRY = 3;
const PAUSE_MS = 150;

interface Course {
  key: string; // file name prefix
  slug: string;
  page: string; // the page that links every note
  title: string;
}

const COURSES: Course[] = [
  { key: "18.01", slug: "18-01-single-variable-calculus-fall-2006", page: "pages/lecture-notes", title: "MIT OCW 18.01 Single Variable Calculus (Fall 2006) lecture notes" },
  { key: "18.02", slug: "18-02-multivariable-calculus-fall-2007", page: "pages/lecture-notes", title: "MIT OCW 18.02 Multivariable Calculus (Fall 2007) lecture notes" },
  { key: "18.03", slug: "18-03-differential-equations-spring-2010", page: "pages/lecture-notes", title: "MIT OCW 18.03 Differential Equations (Spring 2010) lecture notes" },
  { key: "6.042", slug: "6-042j-mathematics-for-computer-science-fall-2010", page: "pages/readings", title: "MIT OCW 6.042J Mathematics for Computer Science (Fall 2010) course text" },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** GET with a timeout and at most MAX_RETRY retries. 404 is an answer, not a failure. */
async function get(url: string): Promise<Buffer | null> {
  let last: unknown = null;
  for (let attempt = 0; attempt <= MAX_RETRY; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (res.status === 404) return null;
      if (res.ok) return Buffer.from(await res.arrayBuffer());
      last = `HTTP ${res.status}`;
    } catch (e) {
      last = e;
    }
    if (attempt < MAX_RETRY) {
      const wait = 5_000 * (attempt + 1);
      console.log(`  retry ${attempt + 1}/${MAX_RETRY} in ${wait / 1000}s: ${String(last)}`);
      await sleep(wait);
    }
  }
  throw new Error(`gave up after ${MAX_RETRY} retries: ${url} (${String(last)})`);
}

/** PDF text: ligatures unfolded (ﬁ -> fi, NFKC), hyphenated line breaks joined, whitespace collapsed. */
export function pdfTextToProse(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/\f/g, "\n")
    .replace(/([a-z])-\n([a-z])/g, "$1$2")
    .replace(/\s+/g, " ")
    .trim();
}

interface Note {
  name: string; // resource name, e.g. lec1
  pdf: string; // absolute URL
}

/** The notes of one course, cached in corpus/mit-notes/index/<key>.json. */
async function listNotes(course: Course): Promise<Note[]> {
  const indexFile = path.join(DIR, "index", `${course.key}.json`);
  if (fs.existsSync(indexFile)) return JSON.parse(fs.readFileSync(indexFile, "utf8")) as Note[];
  const root = `/courses/${course.slug}`;
  const page = await get(`${BASE}${root}/${course.page}/`);
  if (!page) throw new Error(`${course.key}: notes page not found`);
  const resourceRe = new RegExp(`href="(${root}/resources/[^"/]+/)"`, "g");
  const resources = [...new Set([...page.toString("utf8").matchAll(resourceRe)].map((m) => m[1]))];
  const notes: Note[] = [];
  for (const [i, r] of resources.entries()) {
    const html = await get(`${BASE}${r}`);
    const pdf = html?.toString("utf8").match(new RegExp(`href="(${root}/[0-9a-f]+_[^"/]+\\.pdf)"`));
    if (pdf) notes.push({ name: r.split("/").at(-2)!, pdf: `${BASE}${pdf[1]}` });
    process.stdout.write(`\r[notes] ${course.key} resource pages ${i + 1}/${resources.length}`);
    await sleep(PAUSE_MS);
  }
  process.stdout.write("\n");
  fs.mkdirSync(path.dirname(indexFile), { recursive: true });
  fs.writeFileSync(indexFile, JSON.stringify(notes, null, 1) + "\n", "utf8");
  return notes;
}

function mergeManifest(entries: ManifestEntry[]) {
  const manifestPath = path.join(CORPUS, "manifest.json");
  // Re-read: the caption fetcher may be writing it at the same time.
  const current: ManifestEntry[] = fs.existsSync(manifestPath)
    ? (JSON.parse(fs.readFileSync(manifestPath, "utf8")) as ManifestEntry[])
    : [];
  const merged = new Map(current.map((e) => [e.file, e]));
  for (const e of entries) merged.set(e.file, e);
  // Write-then-rename, so a concurrent reader never sees half a file.
  fs.writeFileSync(`${manifestPath}.${process.pid}`, JSON.stringify([...merged.values()], null, 2) + "\n", "utf8");
  fs.renameSync(`${manifestPath}.${process.pid}`, manifestPath);
  return merged.size;
}

async function main() {
  fs.mkdirSync(path.join(DIR, "raw"), { recursive: true });
  const plans: { course: Course; notes: Note[] }[] = [];
  let failed = 0;
  for (const course of COURSES) {
    try {
      plans.push({ course, notes: await listNotes(course) });
    } catch (e) {
      failed++;
      console.log(`[notes] ${course.key} not listed (${(e as Error).message}); re-run to list it`);
    }
  }
  const total = plans.reduce((n, p) => n + p.notes.length, 0);
  console.log(`[notes] ${total} PDFs in ${plans.length} course(s)`);

  const entries: ManifestEntry[] = [];
  let done = 0;
  let words = 0;
  for (const { course, notes } of plans) {
    for (const note of notes) {
      const base = `${course.key}-${note.name}`;
      const txt = path.join(DIR, `${base}.txt`);
      const pdf = path.join(DIR, "raw", `${base}.pdf`);
      try {
        if (!fs.existsSync(txt)) {
          if (!fs.existsSync(pdf)) {
            const body = await get(note.pdf);
            if (!body) throw new Error("404");
            fs.writeFileSync(pdf, body);
            await sleep(PAUSE_MS);
          }
          const { stdout } = await run("pdftotext", ["-enc", "UTF-8", pdf, "-"], { timeout: 60_000, maxBuffer: 64 * 1024 * 1024 });
          fs.writeFileSync(txt, pdfTextToProse(stdout) + "\n", "utf8");
        }
        words += fs.readFileSync(txt, "utf8").split(/\s+/).filter(Boolean).length;
        entries.push({
          id: "mit-notes",
          register: "written",
          auto: false,
          file: path.relative(CORPUS, txt),
          title: `${course.title} - ${note.name}`,
          license: "CC BY-NC-SA 4.0",
          url: note.pdf,
        });
      } catch (e) {
        failed++;
        console.log(`  ${base} skipped (${(e as Error).message}); re-run to fetch it`);
      }
      done++;
      console.log(`[notes] ${done}/${total}  ${base}  (${words.toLocaleString()} words so far, failed ${failed})`);
    }
  }
  const size = mergeManifest(entries);
  console.log(`[notes] ${entries.length}/${total} notes, ${words.toLocaleString()} words -> manifest ${size} file(s)`);
  if (failed) {
    console.log(`[notes] ${failed} item(s) not fetched - re-run to fill the gaps`);
    process.exit(1);
  }
  console.log("[notes] done");
}

main().catch((e) => {
  console.error(`[notes] failed: ${(e as Error).message}`);
  process.exit(1);
});
