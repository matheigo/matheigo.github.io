/**
 * Steps 2-3 of PLAN.md 15: normalize the corpus and count every candidate
 * wording for every entry, keeping the tally per source so that decide.ts can
 * weight sources (no channel above 25%).
 *
 *   pnpm corpus:count                 corpus/ -> corpus/counts.json
 *   pnpm corpus:count -- --contexts   also writes corpus/contexts.txt for review
 *
 * Same-wording candidates are folded together here so they do not compete in
 * decide(): "completing the square" and "complete the square" are one wording.
 * Folded counts are summed into the headword and the merge is recorded, never
 * silently dropped.
 *
 * Everything written stays under corpus/, which is gitignored.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadAll, type Collection } from "../lib/load.js";
import {
  balance,
  candidatesOf,
  contexts,
  countPhrase,
  mergeCandidates,
  normalize,
  type ContextHit,
  type CorpusDoc,
  type Merge,
} from "./lib.js";
import type { ManifestEntry } from "./fetch.js";

const CORPUS = path.join(ROOT, "corpus");
const WITH_CONTEXTS = process.argv.includes("--contexts");
const COUNTED: Collection[] = ["terms", "symbols", "phrases"];

/** candidate -> source -> occurrences */
export type BySource = Record<string, Record<string, number>>;

export interface EntryCounts {
  collection: Collection;
  id: string;
  spoken: BySource;
  written: BySource;
  merges: Merge[];
  sources: string[];
  /** True when every spoken hit came from auto captions (weak evidence for symbols). */
  autoOnly: boolean;
}

export interface CountsFile {
  counted: string;
  /** source id -> words, used by decide.ts to compute weights */
  sources: Record<string, number>;
  entries: EntryCounts[];
}

function loadCorpus(): CorpusDoc[] {
  const manifestPath = path.join(CORPUS, "manifest.json");
  if (!fs.existsSync(manifestPath)) return [];
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as ManifestEntry[];
  return manifest
    .filter((m) => fs.existsSync(path.join(CORPUS, m.file)))
    .map((m) => ({
      id: m.id,
      register: m.register,
      auto: m.auto,
      text: normalize(fs.readFileSync(path.join(CORPUS, m.file), "utf8")),
    }));
}

/** The wording currently used as the entry's headword. */
function headwordOf(collection: Collection, data: Record<string, unknown>): string {
  if (collection === "terms") return (data.en as { term: string }).term;
  if (collection === "symbols") return (data.spoken_en as { text: string }[])[0].text;
  return data.en as string;
}

function main() {
  const docs = loadCorpus();
  if (docs.length === 0) {
    console.log("corpus/ is empty - nothing to count.");
    console.log("MIT OCW: pnpm corpus:fetch:ocw     YouTube/Khan: scripts/corpus/fetch-captions.sh");
    return;
  }

  const { rows } = balance(docs);
  console.log(`corpus: ${docs.length} file(s), ${rows.length} source(s)`);
  for (const r of rows) {
    console.log(
      `  ${r.source.padEnd(22)} ${r.words.toLocaleString().padStart(10)} words  ${(r.share * 100).toFixed(1)}%`,
    );
  }
  console.log("  (shares above 25% are evened out by weighting in decide, not rejected)");

  const words: Record<string, number> = {};
  for (const r of rows) words[r.source] = r.words;

  const all = loadAll();
  const entries: EntryCounts[] = [];
  const hits: ContextHit[] = [];

  for (const collection of COUNTED) {
    for (const { data } of all[collection]) {
      const record = data as unknown as Record<string, unknown>;
      const candidates = candidatesOf(collection, record);
      const spoken: BySource = {};
      const written: BySource = {};
      const sources = new Set<string>();
      let human = false;
      let auto = false;

      for (const candidate of candidates) {
        for (const doc of docs) {
          const n = countPhrase(doc.text, candidate);
          if (n === 0) continue;
          const bucket = doc.register === "spoken" ? spoken : written;
          bucket[candidate] ??= {};
          bucket[candidate][doc.id] = (bucket[candidate][doc.id] ?? 0) + n;
          sources.add(doc.id);
          if (doc.register === "spoken") {
            if (doc.auto) auto = true;
            else human = true;
          }
          if (WITH_CONTEXTS) hits.push(...contexts(doc.text, candidate, doc.id));
        }
      }

      if (sources.size === 0) continue;

      const head = headwordOf(collection, record);
      const s = mergeCandidates(spoken, head);
      const w = mergeCandidates(written, head);
      const merges = [...s.merges];
      for (const m of w.merges) {
        if (!merges.some((x) => x.into === m.into && x.from.join() === m.from.join())) merges.push(m);
      }

      entries.push({
        collection,
        id: data.id,
        spoken: s.counts,
        written: w.counts,
        merges,
        sources: [...sources].sort(),
        autoOnly: auto && !human,
      });
    }
  }

  const out: CountsFile = {
    counted: new Date().toISOString().slice(0, 10),
    sources: words,
    entries,
  };
  fs.mkdirSync(CORPUS, { recursive: true });
  fs.writeFileSync(path.join(CORPUS, "counts.json"), JSON.stringify(out, null, 2) + "\n", "utf8");

  const merged = entries.reduce((n, e) => n + e.merges.length, 0);
  console.log(`\ncounted ${entries.length} entr${entries.length === 1 ? "y" : "ies"} with at least one hit`);
  console.log(`  ${merged} same-wording merge(s) folded into headwords`);
  console.log("  -> corpus/counts.json");

  if (WITH_CONTEXTS) {
    fs.writeFileSync(
      path.join(CORPUS, "contexts.txt"),
      hits.map((h) => `${h.source}\t${h.candidate}\t${h.snippet}`).join("\n") + "\n",
      "utf8",
    );
    console.log(`  ${hits.length} context line(s) -> corpus/contexts.txt (review only)`);
  }
}

main();
