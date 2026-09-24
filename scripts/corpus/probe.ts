/**
 * Counts candidate wordings BEFORE they are written into an entry, so the
 * headword and register can follow the corpus from the start (STYLE 原則 1).
 * corpus:count / corpus:decide still write the evidence afterwards; this only
 * looks.
 *
 *   pnpm corpus:probe -- "u-substitution" "integration by substitution"
 *   pnpm corpus:probe -- --file phrases.txt     one per line, "# ..." = heading
 *
 * Prints counts only - never corpus text (the corpus is CC BY-NC-SA; the data
 * is CC0). Duplicates are removed exactly as corpus:count does. The deduped
 * corpus is cached in corpus/probe-cache.json (gitignored with the rest of
 * corpus/) and rebuilt when manifest.json changes.
 *
 * Columns: S = spoken total, W = written total, then per family:
 * ocw / khan / yt (spoken), C1 C2 C3 = OpenStax Calculus volumes,
 * AT = Algebra and Trigonometry, PC = Precalculus, IS = Introductory
 * Statistics, notes = MIT OCW lecture notes.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "../lib/load.js";
import { countPhrase, dedupe, normalize, type CorpusDoc } from "./lib.js";
import type { ManifestEntry } from "./fetch.js";

const CORPUS = path.join(ROOT, "corpus");
const MANIFEST = path.join(CORPUS, "manifest.json");
const CACHE = path.join(CORPUS, "probe-cache.json");

interface Cache {
  manifestMtime: number;
  docs: CorpusDoc[];
}

function load(): CorpusDoc[] {
  const mtime = fs.statSync(MANIFEST).mtimeMs;
  if (fs.existsSync(CACHE)) {
    const cache = JSON.parse(fs.readFileSync(CACHE, "utf8")) as Cache;
    if (cache.manifestMtime === mtime) return cache.docs;
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8")) as ManifestEntry[];
  const docs = manifest
    .filter((m) => fs.existsSync(path.join(CORPUS, m.file)))
    .map((m) => ({
      id: m.id,
      register: m.register,
      auto: m.auto,
      file: m.file,
      text: normalize(fs.readFileSync(path.join(CORPUS, m.file), "utf8")),
    }));
  const deduped = dedupe(docs).docs;
  fs.writeFileSync(CACHE, JSON.stringify({ manifestMtime: mtime, docs: deduped } satisfies Cache));
  return deduped;
}

function family(doc: CorpusDoc): string {
  const volume = doc.file?.match(/calculus-volume-(\d)/);
  if (volume) return `C${volume[1]}`;
  const books: Record<string, string> = {
    "openstax-algtrig": "AT",
    "openstax-precalculus": "PC",
    "openstax-introstats": "IS",
    "mit-notes": "notes",
  };
  if (books[doc.id]) return books[doc.id];
  if (doc.id.startsWith("mit-")) return "ocw";
  if (doc.id.startsWith("khan")) return "khan";
  if (doc.id.startsWith("yt:")) return "yt";
  return doc.id;
}

function main() {
  if (!fs.existsSync(MANIFEST)) {
    console.log("corpus/manifest.json is missing - fetch the corpus first (pnpm corpus:fetch).");
    return;
  }
  const args = process.argv.slice(2).filter((a) => a !== "--");
  const fileAt = args.indexOf("--file");
  const lines =
    fileAt >= 0
      ? fs.readFileSync(args[fileAt + 1], "utf8").split("\n")
      : args;
  const phrases = lines.map((s) => s.trim()).filter(Boolean);
  if (phrases.length === 0) {
    console.log('usage: pnpm corpus:probe -- "phrase" ... | --file phrases.txt');
    return;
  }

  const docs = load();
  for (const phrase of phrases) {
    if (phrase.startsWith("#")) {
      console.log(phrase);
      continue;
    }
    let spoken = 0;
    let written = 0;
    const by: Record<string, number> = {};
    for (const doc of docs) {
      const n = countPhrase(doc.text, phrase);
      if (n === 0) continue;
      if (doc.register === "spoken") spoken += n;
      else written += n;
      const f = family(doc);
      by[f] = (by[f] ?? 0) + n;
    }
    const detail = Object.entries(by)
      .map(([k, v]) => `${k} ${v}`)
      .join("  ");
    console.log(`  ${phrase.padEnd(46)} S ${String(spoken).padStart(5)}  W ${String(written).padStart(5)}   ${detail}`);
  }
}

main();
