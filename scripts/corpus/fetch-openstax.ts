/**
 * PLAN.md 15, step 1 for the written corpus: OpenStax textbooks.
 *
 * OpenStax publishes the source of its books (CNXML, one file per section) in
 * public GitHub repositories. Downloading them is a plain fetch, pinned to one
 * commit so that a re-run reads the same text. Chapters and appendices are
 * taken; the preface (about the book, not mathematics) is not.
 *
 *   pnpm corpus:fetch:openstax
 *
 * Books (PLAN 15, written): Calculus Volumes 1-3, Algebra and Trigonometry,
 * Precalculus, Introductory Statistics. All are CC BY-NC-SA 4.0, read from
 * each collection's metadata. Only counts are used - no sentence from these
 * books goes into the dictionary (STYLE.md).
 *
 * Every request has a timeout and a retry limit, progress is printed as
 * done/total over all books, and the raw CNXML is cached under corpus/ (see
 * Book.raw): a re-run only downloads the modules that are missing.
 *
 * Writes corpus/<id>/<book>-<module>.txt and merges corpus/manifest.json.
 * corpus/ is gitignored: book text never enters the repository.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "../lib/load.js";
import type { ManifestEntry } from "./fetch.js";
import { cnxmlToText } from "./lib.js";

const CORPUS = path.join(ROOT, "corpus");
const UA = "MathEigo corpus builder (CC0 dictionary project; contact via GitHub issues)";
const TIMEOUT_MS = 30_000;
const MAX_RETRY = 3;
const PAUSE_MS = 150;

interface Book {
  id: string; // corpus source id (evidence.sources)
  slug: string; // collection file name in the repository
  repo: string;
  ref: string; // pinned commit
  title: string;
  /** Raw CNXML cache, relative to corpus/. Books from one repository share it. */
  raw: string;
}

const CALCULUS = { repo: "openstax/osbooks-calculus-bundle", ref: "8dbc2ce19e804924b2517b89ac72ee45be949d15", raw: "openstax-calculus/raw" };
const ALGEBRA = { repo: "openstax/osbooks-college-algebra-bundle", ref: "463991614337632b0e02cbb6c76223cbb0d423d3", raw: "openstax-raw/college-algebra-bundle" };
const STATS = { repo: "openstax/osbooks-introductory-statistics-bundle", ref: "1f6a35825395bb4aa2834cf1eca37512655f920c", raw: "openstax-raw/introductory-statistics-bundle" };

// Order matters: corpus:count keeps the first copy of a section that two books
// share (Algebra and Trigonometry and Precalculus reuse many modules), so the
// broader book comes first.
const BOOKS: Book[] = [
  { id: "openstax-calculus", slug: "calculus-volume-1", title: "OpenStax Calculus Volume 1", ...CALCULUS },
  { id: "openstax-calculus", slug: "calculus-volume-2", title: "OpenStax Calculus Volume 2", ...CALCULUS },
  { id: "openstax-calculus", slug: "calculus-volume-3", title: "OpenStax Calculus Volume 3", ...CALCULUS },
  { id: "openstax-algtrig", slug: "algebra-and-trigonometry-2e", title: "OpenStax Algebra and Trigonometry 2e", ...ALGEBRA },
  { id: "openstax-precalculus", slug: "precalculus-2e", title: "OpenStax Precalculus 2e", ...ALGEBRA },
  { id: "openstax-introstats", slug: "introductory-statistics-2e", title: "OpenStax Introductory Statistics 2e", ...STATS },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** GET with a timeout and at most MAX_RETRY retries. 404 is an answer, not a failure. */
async function get(url: string): Promise<string | null> {
  let last: unknown = null;
  for (let attempt = 0; attempt <= MAX_RETRY; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (res.status === 404) return null;
      if (res.ok) return await res.text();
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

/** Cached download: the file on disk wins, the network fills the gaps. */
async function cached(file: string, url: string): Promise<string | null> {
  if (fs.existsSync(file)) return fs.readFileSync(file, "utf8");
  const body = await get(url);
  if (body === null) return null;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body, "utf8");
  return body;
}

/** "http://creativecommons.org/licenses/by-nc-sa/4.0/" -> "CC BY-NC-SA 4.0" */
function licenseName(url: string): string {
  const m = url.match(/licenses\/([a-z-]+)\/(\d\.\d)/);
  return m ? `CC ${m[1].toUpperCase()} ${m[2]}` : url;
}

interface Plan {
  book: Book;
  modules: string[];
  license: string;
}

/** Collection file -> the chapter and appendix modules, in book order. */
async function plan(book: Book): Promise<Plan> {
  const raw = `https://raw.githubusercontent.com/${book.repo}/${book.ref}/collections/${book.slug}.collection.xml`;
  const collection = await cached(path.join(CORPUS, book.raw, `${book.slug}.collection.xml`), raw);
  if (!collection) throw new Error(`${book.slug}: collection not found at ${book.ref}`);
  const license = licenseName(collection.match(/<md:license url="([^"]+)"/)?.[1] ?? "unknown");
  // Top-level modules before the first chapter are front matter (the preface).
  const firstChapter = collection.indexOf("<col:subcollection>");
  const modules = [...collection.matchAll(/<col:module document="(m\d+)"/g)]
    .filter((m) => m.index! > firstChapter)
    .map((m) => m[1]);
  console.log(`[openstax] ${book.slug}: ${modules.length} modules (${license}) @ ${book.ref.slice(0, 7)}`);
  return { book, modules, license };
}

async function fetchAll(plans: Plan[]): Promise<{ entries: ManifestEntry[]; failed: number }> {
  const total = plans.reduce((n, p) => n + p.modules.length, 0);
  const entries: ManifestEntry[] = [];
  let done = 0;
  let failed = 0;
  let fetched = 0;
  for (const { book, modules, license } of plans) {
    const dir = path.join(CORPUS, book.id);
    fs.mkdirSync(dir, { recursive: true });
    let words = 0;
    for (const mod of modules) {
      const url = `https://raw.githubusercontent.com/${book.repo}/${book.ref}/modules/${mod}/index.cnxml`;
      const rawFile = path.join(CORPUS, book.raw, `${mod}.cnxml`);
      const hadCache = fs.existsSync(rawFile);
      let xml: string | null = null;
      let error = false;
      try {
        xml = await cached(rawFile, url);
      } catch (e) {
        error = true;
        failed++;
        console.log(`  ${book.slug} ${mod} skipped (${(e as Error).message}); re-run to fetch it`);
      }
      if (xml) {
        const title = cnxmlToText(xml.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? mod);
        const file = path.join(dir, `${book.slug}-${mod}.txt`);
        const text = cnxmlToText(xml);
        fs.writeFileSync(file, text + "\n", "utf8");
        words += text.split(/\s+/).filter(Boolean).length;
        entries.push({
          id: book.id,
          register: "written",
          auto: false,
          file: path.relative(CORPUS, file),
          title: `${book.title} - ${title}`,
          license,
          url,
        });
        if (!hadCache) {
          fetched++;
          await sleep(PAUSE_MS);
        }
      } else if (!error) {
        console.log(`  ${book.slug} ${mod}: not in the repository at this commit`);
      }
      done++;
      console.log(`[openstax] ${done}/${total}  (${book.slug}, ${fetched} downloaded, ${done - fetched - failed} cached, ${failed} failed)`);
    }
    console.log(`[openstax] ${book.slug}: ${words.toLocaleString()} words`);
  }
  return { entries, failed };
}

async function main() {
  fs.mkdirSync(CORPUS, { recursive: true });
  const manifestPath = path.join(CORPUS, "manifest.json");
  const plans: Plan[] = [];
  for (const b of BOOKS) plans.push(await plan(b));
  const { entries: fresh, failed } = await fetchAll(plans);

  // Re-read just before writing: another fetcher may have added its files meanwhile.
  const current: ManifestEntry[] = fs.existsSync(manifestPath)
    ? (JSON.parse(fs.readFileSync(manifestPath, "utf8")) as ManifestEntry[])
    : [];
  const merged = new Map(current.map((e) => [e.file, e]));
  for (const e of fresh) merged.set(e.file, e);
  fs.writeFileSync(manifestPath, JSON.stringify([...merged.values()], null, 2) + "\n", "utf8");

  console.log(`[openstax] done: manifest ${merged.size} file(s) -> corpus/manifest.json`);
  if (failed) {
    console.log(`[openstax] ${failed} module(s) not fetched - re-run to fill the gaps`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(`[openstax] failed: ${(e as Error).message}`);
  process.exit(1);
});
