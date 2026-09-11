/**
 * Stage 1 of the four-stage QA in PLAN.md 8: machine checks.
 *
 * - JSON Schema (schema/*.schema.json)
 * - filename stem == id, no duplicate ids, no duplicate ja.term
 * - every LaTeX string compiles under KaTeX
 * - related / term_ref / term_refs resolve to an existing entry
 * - the "definition of done" in CLAUDE.md (sources, examples, mapping_note)
 *
 * Exit code 1 on any error. Warnings do not fail the build.
 */
import Ajv2020, { type ErrorObject } from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import katex from "katex";
import { COLLECTIONS, loadAll, readSchema, type Collection, type Entry } from "./lib/load.js";

const errors: string[] = [];
const warnings: string[] = [];

const err = (where: string, msg: string) => errors.push(`${where}: ${msg}`);
const warn = (where: string, msg: string) => warnings.push(`${where}: ${msg}`);

// ---------------------------------------------------------------- schema ---

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
ajv.addSchema(readSchema("_common"));
const validators = Object.fromEntries(
  COLLECTIONS.map((c) => [c, ajv.compile(readSchema(c))]),
) as Record<Collection, ReturnType<typeof ajv.compile>>;

const formatAjv = (e: ErrorObject) => `${e.instancePath || "/"} ${e.message ?? ""}`.trim();

// ------------------------------------------------------------------ load ---

const all = loadAll();
const idsByCollection = Object.fromEntries(
  COLLECTIONS.map((c) => [c, new Set(all[c].map((e) => e.data.id))]),
) as Record<Collection, Set<string>>;

// --------------------------------------------------------------- helpers ---

function checkLatex(where: string, latex: unknown) {
  if (typeof latex !== "string" || latex.length === 0) return;
  try {
    katex.renderToString(latex, { throwOnError: true, displayMode: true });
  } catch (e) {
    err(where, `LaTeX does not compile under KaTeX: ${(e as Error).message.split("\n")[0]}`);
  }
  if (latex.includes("\\displaystyle")) {
    warn(where, "\\displaystyle is discouraged (PLAN 6-8)");
  }
}

function checkRef(where: string, field: string, id: unknown, target: Collection) {
  if (typeof id !== "string") return;
  if (!idsByCollection[target].has(id)) {
    err(where, `${field} points at "${id}", which has no file in data/${target}/`);
  }
}

const sourcesOf = (d: Entry) => (Array.isArray(d.sources) ? d.sources : []);

// ------------------------------------------------------------ per-entry ----

for (const collection of COLLECTIONS) {
  const seenJa = new Map<string, string>();
  const seenEn = new Map<string, string>();

  for (const { file, stem, data } of all[collection]) {
    const where = `${collection}/${stem}.json`;

    const validate = validators[collection];
    if (!validate(data)) {
      for (const e of validate.errors ?? []) err(where, formatAjv(e));
      continue; // shape is wrong; the checks below would be noise
    }

    if (data.id !== stem) err(where, `id "${data.id}" does not match the filename`);

    // duplicates ---------------------------------------------------------
    if (collection === "terms") {
      const ja = (data.ja as { term: string }).term;
      const en = (data.en as { term: string }).term.toLowerCase();
      if (seenJa.has(ja)) err(where, `ja.term "${ja}" already used by ${seenJa.get(ja)}`);
      seenJa.set(ja, where);
      if (seenEn.has(en)) warn(where, `en.term "${en}" already used by ${seenEn.get(en)}`);
      seenEn.set(en, where);
    }

    // LaTeX --------------------------------------------------------------
    checkLatex(where, data.latex);

    // cross-references ---------------------------------------------------
    for (const r of (data.related as string[] | undefined) ?? []) {
      checkRef(where, "related", r, "terms");
      if (r === data.id) err(where, "related refers to itself");
    }
    checkRef(where, "term_ref", data.term_ref, "terms");
    for (const r of (data.term_refs as string[] | undefined) ?? []) {
      checkRef(where, "term_refs", r, "terms");
    }

    if (collection === "curriculum") continue;

    // definition of done (CLAUDE.md) -------------------------------------
    const confidence = data.confidence as string;
    const sources = sourcesOf(data);

    if (confidence !== "draft" && sources.length === 0) {
      err(where, `confidence "${confidence}" requires at least one source (PLAN 6-7)`);
    }

    if (collection === "terms") {
      const mapping = data.mapping as string;
      const note = data.mapping_note;
      if (mapping !== "exact" && !note) {
        err(where, `mapping "${mapping}" requires mapping_note (PLAN 5.1)`);
      }
      if (mapping === "exact" && note) {
        warn(where, "mapping is exact but mapping_note is set");
      }

      const examples = (data.examples as unknown[] | undefined) ?? [];
      const needed = data.pos === "verb" ? 2 : 1;
      if (confidence !== "draft" && examples.length < needed) {
        err(
          where,
          `pos "${data.pos}" needs at least ${needed} example(s), found ${examples.length}`,
        );
      }

      const reading = (data.ja as { reading: string }).reading;
      if (!/^[\u3040-\u309F\u30FC\u3005\s・]+$/.test(reading)) {
        err(where, `ja.reading "${reading}" must be hiragana (PLAN 6-6)`);
      }
    }

    // audio paths --------------------------------------------------------
    if (typeof data.audio === "string" && !data.audio.startsWith(`audio/${collection}/`)) {
      err(where, `audio path should be audio/${collection}/${data.id}.mp3`);
    }

    if (confidence === "verified" && (data.flags as unknown[] | undefined)?.length) {
      err(where, "confidence is verified but flags are still present (PLAN 8-2)");
    }
  }
}

// ----------------------------------------------------------------- report ---

const counts = COLLECTIONS.map((c) => `${c} ${all[c].length}`).join(" / ");
const published = all.terms.filter((e) => e.data.confidence === "verified").length;

console.log(`entries: ${counts}`);
console.log(`terms at confidence "verified": ${published}`);

for (const w of warnings) console.warn(`  warn  ${w}`);
for (const e of errors) console.error(`  ERROR ${e}`);

if (errors.length > 0) {
  console.error(`\nvalidate failed: ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(1);
}
console.log(`\nvalidate passed (${warnings.length} warning(s))`);
