/**
 * The references of the ③ fallback, read from corpus/ref/ (gitignored),
 * where `python3 scripts/ledger/refetch.py refs` puts them (docs/SOURCES.md).
 * Shared by count.ts and probe.ts so that both see the same sections.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "../lib/load.js";
import { bookSections, cedSections, cedText, type MoreReferences } from "./lib.js";

const REF = path.join(ROOT, "corpus", "ref");

export const REFERENCE_FILES = {
  ced: path.join(REF, "ap-calculus-ab-bc-ced.txt"),
  cedStats: path.join(REF, "ap-statistics-ced.txt"),
  nicholson: path.join(REF, "nicholson-lawa-2021a.txt"),
  levin: path.join(REF, "levin-dmoi4.txt"),
} as const;

const read = (file: string) => (fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null);

/** A CED split into sections and normalized; [] when it is not fetched. */
function ced(file: string): [string, string][] {
  const text = read(file);
  return text === null ? [] : cedSections(text).map(([n, t]) => [n, cedText(t)] as [string, string]);
}

function book(file: string): [string, string][] {
  const text = read(file);
  return text === null ? [] : bookSections(text).map(([n, t]) => [n, cedText(t)] as [string, string]);
}

export interface LoadedReferences extends MoreReferences {
  ced: [string, string][];
  /** Which files were missing (the fallback then skips them). */
  missing: string[];
}

export function loadReferences(): LoadedReferences {
  const out: LoadedReferences = {
    ced: ced(REFERENCE_FILES.ced),
    cedStats: ced(REFERENCE_FILES.cedStats),
    nicholson: book(REFERENCE_FILES.nicholson),
    levin: book(REFERENCE_FILES.levin),
    missing: [],
  };
  for (const [k, f] of Object.entries(REFERENCE_FILES)) if (!fs.existsSync(f)) out.missing.push(k);
  return out;
}

/** "AP Calculus CED" etc., for reports. */
export const REFERENCE_NAMES: Record<string, string> = {
  ced: "AP Calculus の CED",
  "ced-stats": "AP Statistics の CED",
  openstax: "OpenStax",
  nicholson: "Nicholson",
  levin: "Levin",
};
