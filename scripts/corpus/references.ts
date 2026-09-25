/**
 * The references of the ③ fallback, read from corpus/ref/ (gitignored),
 * where `python3 scripts/ledger/refetch.py refs` puts them (docs/SOURCES.md).
 * Shared by count.ts and probe.ts so that both see the same sections.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "../lib/load.js";
import { bookSections, cedSections, cedText, dedupeSections, type MoreReferences, type WikipediaName } from "./lib.js";

const REF = path.join(ROOT, "corpus", "ref");

export const REFERENCE_FILES = {
  ced: path.join(REF, "ap-calculus-ab-bc-ced.txt"),
  cedStats: path.join(REF, "ap-statistics-ced.txt"),
  nicholson: path.join(REF, "nicholson-lawa-2021a.txt"),
  levin: path.join(REF, "levin-dmoi4.txt"),
  im68: path.join(REF, "im-6-8.txt"),
  im912: path.join(REF, "im-9-12.txt"),
  imGlossary: path.join(REF, "im-glossary.json"),
  ck12Geometry: path.join(REF, "ck12-geometry.txt"),
  ck12Algebra: path.join(REF, "ck12-algebra.txt"),
} as const;

/** scripts/ledger/wikihead.py: the English Wikipedia article of each terms entry (committed, titles only). */
const WIKI_HEAD = path.join(ROOT, "scripts", "ledger", "wiki_head.json");

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

/**
 * IM, written by refetch.py im: one section per lesson, opened by a line
 * "\f@@ <course> <unit>.<lesson> <title>" (lesson and practice pages together).
 * CK-12 (refetch.py ck12) has the same layout, one section per page.
 */
function im(file: string): [string, string][] {
  const text = read(file);
  if (text === null) return [];
  return text
    .split("\f@@ ")
    .filter((part) => part.trim())
    .map((part) => {
      const nl = part.indexOf("\n");
      return [part.slice(0, nl).trim(), cedText(part.slice(nl + 1))] as [string, string];
    });
}

interface WikiRow {
  ja?: { source?: boolean; term?: string; page?: string; depth?: number | null; article?: string | null; article_depth?: number | null; fragment?: string; disambig?: boolean };
  en?: { page: string; depth: number | null; fragment?: string; disambig?: boolean };
}

/**
 * The English Wikipedia article that names an entry (rule 2, last step;
 * DECISIONS, Phase 2 幾何・離散の単元 2): the en langlink of its ja article
 * first (its own wikipedia-langlink source, or ja.term when that is an
 * article of its own under a math category within 4 levels), else en.term
 * after redirects. The en article must sit under a math category within 4
 * levels, and be neither a disambiguation page nor a section of another
 * article. `notSame` lists entries whose article is another concept.
 */
export function wikipediaNames(notSame: Set<string>): Map<string, WikipediaName> {
  const out = new Map<string, WikipediaName>();
  if (!fs.existsSync(WIKI_HEAD)) return out;
  const rows = (JSON.parse(fs.readFileSync(WIKI_HEAD, "utf8")) as { entries: Record<string, WikiRow> }).entries;
  for (const [id, row] of Object.entries(rows)) {
    if (notSame.has(id)) continue;
    const j = row.ja;
    const jaOwn = j !== undefined && (j.source === true || (j.depth != null && j.page === j.term));
    if (j?.article && jaOwn && j.article_depth != null && !j.fragment && !j.disambig) {
      out.set(id, { title: j.article, via: "ja-langlink" });
      continue;
    }
    const e = row.en;
    if (e?.page && e.depth != null && !e.fragment && !e.disambig) out.set(id, { title: e.page, via: "en-redirect" });
  }
  return out;
}

export interface LoadedReferences extends MoreReferences {
  ced: [string, string][];
  /** Which files were missing (the fallback then skips them). */
  missing: string[];
  /** Sentences dedupeSections() removed from IM and from CK-12. */
  deduped: { im: number; ck12: number };
}

/** --no-dedupe (count.ts, probe.ts) keeps IM's and CK-12's repeated sentences, to measure what dedupe removes. */
const DEDUPE = !process.argv.includes("--no-dedupe");

export function loadReferences(): LoadedReferences {
  // IM's practice pages repeat earlier problems and each lesson repeats its glossary
  // entries: a long sentence is counted once, in course and lesson order (lib.ts dedupeSections).
  const imRaw = [...im(REFERENCE_FILES.im68), ...im(REFERENCE_FILES.im912)];
  const ck12Raw = [...im(REFERENCE_FILES.ck12Geometry), ...im(REFERENCE_FILES.ck12Algebra)];
  const imD = DEDUPE ? dedupeSections(imRaw) : { sections: imRaw, dropped: 0 };
  const ck12D = DEDUPE ? dedupeSections(ck12Raw) : { sections: ck12Raw, dropped: 0 };
  const out: LoadedReferences = {
    ced: ced(REFERENCE_FILES.ced),
    cedStats: ced(REFERENCE_FILES.cedStats),
    nicholson: book(REFERENCE_FILES.nicholson),
    levin: book(REFERENCE_FILES.levin),
    im: imD.sections,
    ck12: ck12D.sections,
    deduped: { im: imD.dropped, ck12: ck12D.dropped },
    imGlossary: fs.existsSync(REFERENCE_FILES.imGlossary)
      ? (JSON.parse(fs.readFileSync(REFERENCE_FILES.imGlossary, "utf8")) as { courses: Record<string, string[]> }).courses
      : {},
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
  im: "IM",
  ck12: "CK-12",
  nicholson: "Nicholson",
  levin: "Levin",
  wikipedia: "英語版 Wikipedia の記事名",
};
