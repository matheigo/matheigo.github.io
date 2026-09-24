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
 * Every request has a timeout and a retry limit, progress is printed as
 * done/total, and the raw CNXML is cached under corpus/<id>/raw/: a re-run
 * only downloads the modules that are missing.
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
}

const BOOKS: Book[] = [
  {
    id: "openstax-calculus",
    slug: "calculus-volume-1",
    repo: "openstax/osbooks-calculus-bundle",
    ref: "8dbc2ce19e804924b2517b89ac72ee45be949d15",
    title: "OpenStax Calculus Volume 1",
  },
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

async function fetchBook(book: Book): Promise<{ entries: ManifestEntry[]; failed: number }> {
  const raw = (p: string) => `https://raw.githubusercontent.com/${book.repo}/${book.ref}/${p}`;
  const dir = path.join(CORPUS, book.id);
  const collection = await cached(
    path.join(dir, "raw", `${book.slug}.collection.xml`),
    raw(`collections/${book.slug}.collection.xml`),
  );
  if (!collection) throw new Error(`${book.slug}: collection not found at ${book.ref}`);

  const license = licenseName(collection.match(/<md:license url="([^"]+)"/)?.[1] ?? "unknown");
  // Top-level modules before the first chapter are front matter (the preface).
  const firstChapter = collection.indexOf("<col:subcollection>");
  const modules = [...collection.matchAll(/<col:module document="(m\d+)"/g)]
    .filter((m) => m.index! > firstChapter)
    .map((m) => m[1]);

  console.log(`[openstax] ${book.slug}: ${modules.length} modules (${license}) @ ${book.ref.slice(0, 7)}`);
  const entries: ManifestEntry[] = [];
  let words = 0;
  let failed = 0;
  for (const [i, mod] of modules.entries()) {
    const url = raw(`modules/${mod}/index.cnxml`);
    let xml: string | null = null;
    let error = false;
    const hadCache = fs.existsSync(path.join(dir, "raw", `${mod}.cnxml`));
    try {
      xml = await cached(path.join(dir, "raw", `${mod}.cnxml`), url);
    } catch (e) {
      error = true;
      failed++;
      console.log(`  ${mod} skipped (${(e as Error).message}); re-run to fetch it`);
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
      if (!hadCache) await sleep(PAUSE_MS);
    } else if (!error) {
      console.log(`  ${mod}: not in the repository at this commit`);
    }
    console.log(`[openstax] ${book.slug} ${i + 1}/${modules.length}`);
  }
  console.log(`[openstax] ${book.slug}: ${entries.length} section(s), ${words.toLocaleString()} words`);
  return { entries, failed };
}

async function main() {
  fs.mkdirSync(CORPUS, { recursive: true });
  const manifestPath = path.join(CORPUS, "manifest.json");
  const existing: ManifestEntry[] = fs.existsSync(manifestPath)
    ? (JSON.parse(fs.readFileSync(manifestPath, "utf8")) as ManifestEntry[])
    : [];

  const fresh: ManifestEntry[] = [];
  let failed = 0;
  for (const b of BOOKS) {
    const r = await fetchBook(b);
    fresh.push(...r.entries);
    failed += r.failed;
  }

  const merged = new Map(existing.map((e) => [e.file, e]));
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
