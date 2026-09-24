/**
 * Counts candidate wordings BEFORE they are written into an entry, so the
 * headword and register can follow the corpus from the start (STYLE 原則 1).
 * corpus:count / corpus:decide still write the evidence afterwards; this only
 * looks.
 *
 *   pnpm corpus:probe -- "u-substitution" "integration by substitution"
 *   pnpm corpus:probe -- --file phrases.txt     one per line, "# ..." = heading
 *   pnpm corpus:probe -- --decide --file groups.txt
 *       each block (separated by a blank line or a "# ..." heading) is one
 *       entry's candidates, headword first; prints the verdict per register
 *       exactly as corpus:count + corpus:decide would reach it
 *   --literal   count as written (phrases); the default counts as terms do:
 *               inflection folded, "…" = a one-to-three-word blank
 *
 * Prints counts only - never corpus text (the corpus is CC BY-NC-SA; the data
 * is CC0). Duplicates are removed exactly as corpus:count does. The deduped
 * corpus is cached in corpus/probe-cache.json (gitignored with the rest of
 * corpus/) and rebuilt when manifest.json or the normalize rules change.
 *
 * Columns: S = spoken total, W = written total, top = the source with the
 * most hits (raw) and its share, then per family:
 * ocw / khan / yt (spoken), C1 C2 C3 = OpenStax Calculus volumes,
 * AT = Algebra and Trigonometry, PC = Precalculus, IS = Introductory
 * Statistics, notes = MIT OCW lecture notes.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "../lib/load.js";
import {
  balance,
  countEntry,
  countPhrase,
  countTerm,
  decideRobust,
  dedupe,
  normalize,
  sourceWeights,
  VARIANTS,
  type CorpusDoc,
  type Verdict,
} from "./lib.js";
import type { ManifestEntry } from "./fetch.js";

const CORPUS = path.join(ROOT, "corpus");
const MANIFEST = path.join(CORPUS, "manifest.json");
const CACHE = path.join(CORPUS, "probe-cache.json");

interface Cache {
  manifestMtime: number;
  /** The normalize rules the cached text went through. */
  rules?: string;
  docs: CorpusDoc[];
}

const RULES = VARIANTS.map(([re, to]) => `${re.source}/${re.flags}->${to}`).join("\n");

function load(): CorpusDoc[] {
  const mtime = fs.statSync(MANIFEST).mtimeMs;
  if (fs.existsSync(CACHE)) {
    const cache = JSON.parse(fs.readFileSync(CACHE, "utf8")) as Cache;
    if (cache.manifestMtime === mtime && cache.rules === RULES) return cache.docs;
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
  fs.writeFileSync(CACHE, JSON.stringify({ manifestMtime: mtime, rules: RULES, docs: deduped } satisfies Cache));
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

function verdict(v: Verdict): string {
  const lean = v.kind !== "undecided" && v.dependsOn ? ` [${v.dependsOn.source} ${v.dependsOn.hits}/${v.dependsOn.of}]` : "";
  if (v.kind === "single") return `① ${v.head} (${v.ratio === Infinity ? "only" : v.ratio.toFixed(1) + ":1"})${lean}`;
  if (v.kind === "both") return `${v.demoted ? "①→②" : "②"} ${v.heads.map((h, i) => `${h} ${Math.round(v.counts[i])}`).join(" / ")}${lean}`;
  return `③ ${v.reason} (${v.total.toFixed(1)})`;
}

function probeDecide(docs: CorpusDoc[], blocks: string[][]) {
  const words: Record<string, number> = {};
  for (const r of balance(docs).rows) words[r.source] = r.words;
  const weights = sourceWeights(words);
  for (const block of blocks) {
    const t = countEntry(docs, "terms", block, block[0]);
    console.log(`# ${block[0]}`);
    for (const register of ["spoken", "written"] as const) {
      const counts = t[register];
      const raw = Object.entries(counts)
        .map(([c, by]) => [c, Object.values(by).reduce((a, b) => a + b, 0)] as const)
        .sort((a, b) => b[1] - a[1])
        .map(([c, n]) => `${c} ${n}`)
        .join(", ");
      const v = decideRobust(counts, weights, register);
      console.log(`  ${register === "spoken" ? "話" : "書"} ${verdict(v)}   {${raw}}`);
    }
    if (t.merges.length) console.log(`  merged: ${t.merges.map((m) => `${m.from.join(" / ")} -> ${m.into}`).join("; ")}`);
  }
}

function main() {
  if (!fs.existsSync(MANIFEST)) {
    console.log("corpus/manifest.json is missing - fetch the corpus first (pnpm corpus:fetch).");
    return;
  }
  const args = process.argv.slice(2).filter((a) => a !== "--");
  const literal = args.includes("--literal");
  const decideMode = args.includes("--decide");
  const fileAt = args.indexOf("--file");
  const lines =
    fileAt >= 0
      ? fs.readFileSync(args[fileAt + 1], "utf8").split("\n")
      : args.filter((a) => !a.startsWith("--"));
  const phrases = lines.map((s) => s.trim()).filter(Boolean);
  if (phrases.length === 0) {
    console.log('usage: pnpm corpus:probe -- "phrase" ... | --file phrases.txt');
    return;
  }

  const docs = load();
  if (decideMode) {
    const blocks: string[][] = [[]];
    for (const line of lines.map((l) => l.trim())) {
      if (!line || line.startsWith("#")) {
        if (blocks[blocks.length - 1].length) blocks.push([]);
        continue;
      }
      blocks[blocks.length - 1].push(line);
    }
    probeDecide(docs, blocks.filter((b) => b.length));
    return;
  }
  const count = literal ? countPhrase : countTerm;
  for (const phrase of phrases) {
    if (phrase.startsWith("#")) {
      console.log(phrase);
      continue;
    }
    let spoken = 0;
    let written = 0;
    const by: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    for (const doc of docs) {
      const n = count(doc.text, phrase);
      if (n === 0) continue;
      bySource[doc.id] = (bySource[doc.id] ?? 0) + n;
      if (doc.register === "spoken") spoken += n;
      else written += n;
      const f = family(doc);
      by[f] = (by[f] ?? 0) + n;
    }
    const detail = Object.entries(by)
      .map(([k, v]) => `${k} ${v}`)
      .join("  ");
    const [top, topN] = Object.entries(bySource).sort((a, b) => b[1] - a[1])[0] ?? ["", 0];
    const lead = top ? `top ${top} ${topN}/${spoken + written}` : "";
    console.log(
      `  ${phrase.padEnd(46)} S ${String(spoken).padStart(5)}  W ${String(written).padStart(5)}   ${lead.padEnd(30)} ${detail}`,
    );
  }
}

main();
