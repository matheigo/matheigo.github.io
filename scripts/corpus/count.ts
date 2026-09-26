/**
 * Steps 2-3 of PLAN.md 15: normalize the corpus and count every candidate
 * wording for every entry, keeping the tally per source so that decide.ts can
 * weight sources (no channel above 25%).
 *
 *   pnpm corpus:count                 corpus/ -> corpus/counts.json
 *   pnpm corpus:count -- --contexts   also writes corpus/contexts.txt for review
 *   pnpm corpus:count -- --no-dedupe  counts duplicates too (to measure what dedupe removes)
 *
 * Duplicates are removed first (lib.ts dedupe): a file that is another copy
 * of an earlier one is dropped, and a long sentence seen before is removed.
 * The dropped files are listed in corpus/dedupe.txt.
 *
 * Same-wording candidates are folded together here so they do not compete in
 * decide(): "completing the square" and "complete the square" are one wording.
 * An occurrence is counted once for the group, under the headword, and the
 * merge is recorded, never silently dropped (lib.ts countEntry).
 *
 * terms fold inflection and read "…" as a one-to-three-word blank; symbols
 * are wildcard patterns; phrases are literal (lib.ts matcherFor).
 *
 * Everything written stays under corpus/, which is gitignored.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadAll, localDate, type Collection } from "../lib/load.js";
import {
  balance,
  candidatesOf,
  contexts,
  countEntry,
  countedAs,
  dedupe,
  forCollection,
  matcherFor,
  normalize,
  referenceHits,
  referred as anyReference,
  type BySource,
  type ContextHit,
  type CorpusDoc,
  type DedupeStats,
  type Merge,
  type ReferenceHits,
  WIKIPEDIA_NOT_SAME,
} from "./lib.js";
import type { ManifestEntry } from "./fetch.js";
import { loadReferences, wikipediaNames } from "./references.js";

const CORPUS = path.join(ROOT, "corpus");
const WITH_CONTEXTS = process.argv.includes("--contexts");
const DEDUPE = !process.argv.includes("--no-dedupe");
const COUNTED: Collection[] = ["terms", "symbols", "phrases"];

export type { BySource };

export interface EntryCounts {
  collection: Collection;
  id: string;
  spoken: BySource;
  written: BySource;
  merges: Merge[];
  sources: string[];
  /** True when every spoken hit came from auto captions (weak evidence for symbols). */
  autoOnly: boolean;
  /** terms: what the CEDs, OpenStax, IM, CK-12, Nicholson, Levin and Wikipedia call it, for the ③ fallback (lib.ts settleUndecided); symbols: how those references (not Wikipedia) read it (settleSymbolReading). */
  reference?: ReferenceHits;
}

export interface CountsFile {
  counted: string;
  /** source id -> words, used by decide.ts to compute weights */
  sources: Record<string, number>;
  /** source id -> the only collections it is counted for (MICASE: phrases); sources not listed count for all */
  restricted?: Record<string, string[]>;
  /** source id -> what dedupe removed; absent with --no-dedupe */
  dedupe?: Record<string, DedupeStats>;
  entries: EntryCounts[];
}

/** OpenStax section titles ("OpenStax Calculus Volume 1 - Areas between Curves" -> "Areas between Curves"), of one book when `id` is given. */
function openstaxTitles(id?: string): string[] {
  const manifestPath = path.join(CORPUS, "manifest.json");
  if (!fs.existsSync(manifestPath)) return [];
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as ManifestEntry[];
  return manifest.filter((m) => (id ? m.id === id : m.id.startsWith("openstax-"))).map((m) => m.title.replace(/^.*? - /, ""));
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
      file: m.file,
      ...(m.collections ? { collections: m.collections } : {}),
    }));
}

/** The wording currently used as the entry's headword (as counted: a symbol pattern or a term's form where one is set). */
function headwordOf(collection: Collection, data: Record<string, unknown>): string {
  if (collection === "terms") return countedAs(collection, data.id as string, (data.en as { term: string }).term);
  if (collection === "symbols") return countedAs(collection, data.id as string, (data.spoken_en as { text: string }[])[0].text);
  return countedAs(collection, data.id as string, data.en as string);
}

function main() {
  const loaded = loadCorpus();
  if (loaded.length === 0) {
    console.log("corpus/ is empty - nothing to count.");
    console.log("MIT OCW: pnpm corpus:fetch:ocw     YouTube/Khan: scripts/corpus/fetch-captions.sh");
    return;
  }

  let docs = loaded;
  let removed: Record<string, DedupeStats> | undefined;
  if (DEDUPE) {
    const d = dedupe(loaded);
    docs = d.docs;
    removed = d.stats;
    console.log("dedupe (files dropped as copies / long sentences removed / words before -> after):");
    for (const [id, st] of Object.entries(d.stats)) {
      console.log(
        `  ${id.padEnd(22)} ${String(st.droppedFiles).padStart(4)}/${st.files} files  ${String(st.droppedSentences).padStart(6)} sentences  ${st.wordsBefore.toLocaleString()} -> ${st.wordsAfter.toLocaleString()}`,
      );
    }
    fs.writeFileSync(path.join(CORPUS, "dedupe.txt"), d.dropped.map((x) => x.file).join("\n") + "\n", "utf8");
    console.log("  dropped files -> corpus/dedupe.txt");
  } else {
    console.log("dedupe: off (--no-dedupe)");
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

  // References for the ③ fallback: the CEDs, OpenStax (body and section titles), IM and CK-12, Nicholson and Levin,
  // and the English Wikipedia article.
  const refs = loadReferences();
  if (refs.missing.length) console.log(`  references missing (python3 scripts/ledger/refetch.py refs): ${refs.missing.join(", ")}`);
  console.log(`  references: repeated sentences removed from IM ${refs.deduped.im}, CK-12 ${refs.deduped.ck12}`);
  const openstax = docs.filter((d) => d.id.startsWith("openstax-")).map((d) => d.text);
  const titles = openstaxTitles();
  // OpenStax Calculus alone: the level reference of calculus words after the CED (lib.ts levelReferences).
  const calculus = {
    openstaxCalculus: docs.filter((d) => d.id === "openstax-calculus").map((d) => d.text),
    openstaxCalculusTitles: openstaxTitles("openstax-calculus"),
  };
  const wikipedia = wikipediaNames(new Set(Object.keys(WIKIPEDIA_NOT_SAME)));

  const restricted: Record<string, string[]> = {};
  for (const d of docs) if (d.collections) restricted[d.id] = d.collections;

  for (const collection of COUNTED) {
    // MICASE is for phrases only (lib.ts forCollection).
    const counted = forCollection(docs, collection);
    for (const { data } of all[collection]) {
      const record = data as unknown as Record<string, unknown>;
      const candidates = candidatesOf(collection, record);
      const t = countEntry(counted, collection, candidates, headwordOf(collection, record));
      const wiki = collection === "terms" ? wikipedia.get(data.id) : undefined;
      // Symbols too, as their patterns: rule 2 reads a ③ symbol the way the references do
      // (lib.ts settleSymbolReading, DECISIONS Phase 3 記号と慣習差の前の修正 2).
      const reference =
        collection === "terms"
          ? { ...referenceHits(candidates, refs.ced, openstax, titles, { ...refs, ...calculus }), ...(wiki ? { wikipedia: wiki } : {}) }
          : collection === "symbols"
            ? referenceHits(candidates, refs.ced, openstax, titles, refs, matcherFor("symbols"))
            : undefined;
      const referred = reference !== undefined && anyReference(reference);
      if (t.sources.length === 0 && !referred) continue;
      if (WITH_CONTEXTS) {
        for (const candidate of candidates) {
          for (const doc of counted) hits.push(...contexts(doc.text, candidate, doc.id));
        }
      }
      entries.push({
        collection,
        id: data.id,
        spoken: t.spoken,
        written: t.written,
        merges: t.merges,
        sources: t.sources,
        autoOnly: t.auto && !t.human,
        ...(referred ? { reference } : {}),
      });
    }
  }

  const out: CountsFile = {
    counted: localDate(),
    sources: words,
    ...(Object.keys(restricted).length ? { restricted } : {}),
    ...(removed ? { dedupe: removed } : {}),
    entries,
  };
  fs.mkdirSync(CORPUS, { recursive: true });
  fs.writeFileSync(path.join(CORPUS, "counts.json"), JSON.stringify(out, null, 2) + "\n", "utf8");

  const merged = entries.reduce((n, e) => n + e.merges.length, 0);
  console.log(`\ncounted ${entries.length} entr${entries.length === 1 ? "y" : "ies"} with at least one hit (corpus or reference)`);
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
