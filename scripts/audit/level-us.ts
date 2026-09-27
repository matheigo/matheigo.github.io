/**
 * Phase 5 audit 6, decisions 1 and 7 (audit 5 H-1, H-7): the level.us defaults of the ledger that the
 * references do not bear out, found by machine.
 *
 *   pnpm exec tsx scripts/audit/level-us.ts            prints what would change
 *   pnpm exec tsx scripts/audit/level-us.ts --json F   also writes the plan as JSON to F (applied with edit.py)
 *
 * 1. A term whose mapping_note or pitfalls says 米国の高校課程（CED・OpenStax・IM・CK-12）では扱わない
 *    loses its school courses (Pre-Algebra, Algebra 1 / 2, Geometry, Integrated Math 1-3, Precalculus).
 *    A college course stays when its reference uses one of the entry's wordings (en.term, en.alt,
 *    en.variants, counted as corpus:count counts them) or a name judged the entry's concept
 *    (scripts/audit/reference_names_same.json): Discrete Math - Levin, Linear Algebra - Nicholson,
 *    Intro Statistics / Calculus I-III - OpenStax (none of these terms has an OpenStax hit). A college
 *    course the entry lacks is added when its reference uses one wording REFERENCE_NAMED (3) times or
 *    more (sequence of differences, Levin). Nothing verified: level.us is [].
 * 2. A 数I / 数A term with Geometry in level.us none of whose wordings (nor a same-concept name) is in
 *    CK-12 Geometry or IM Geometry (lessons, glossary) loses Geometry.
 * The curriculum units of a removed course drop the term from their term_refs.
 *
 * Reads corpus/counts.json (the reference hits; `pnpm corpus:count` first) and
 * audits/checks/reference-theorem-names.json. Writes nothing to data/ itself.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadAll } from "../lib/load.js";
import { countedAs, REFERENCE_NAMED, type ReferenceHits } from "../corpus/lib.js";
import type { CountsFile } from "../corpus/count.js";

const NOT_IN_HIGH_SCHOOL = /米国の高校課程（CED・OpenStax・IM・CK-12）では(?:ほぼ)?扱わない/;
const SCHOOL = ["Pre-Algebra", "Algebra 1", "Geometry", "Algebra 2", "Integrated Math 1", "Integrated Math 2", "Integrated Math 3", "Precalculus"];
const COLLEGE: Record<string, (r: ReferenceHits, w: string) => number> = {
  "Discrete Math": (r, w) => Object.values(r.levin?.[w] ?? {}).reduce((a, b) => a + b, 0),
  "Linear Algebra": (r, w) => Object.values(r.nicholson?.[w] ?? {}).reduce((a, b) => a + b, 0),
  "Intro Statistics": (r, w) => r.openstax[w] ?? 0,
  "Calculus I": (r, w) => r.openstaxCalculus?.[w] ?? 0,
  "Calculus II": (r, w) => r.openstaxCalculus?.[w] ?? 0,
  "Calculus III": (r, w) => r.openstaxCalculus?.[w] ?? 0,
};
/** Which reference's names (reference-theorem-names.json refs) stand for a college course. */
const COLLEGE_NAMES: Record<string, RegExp> = { "Discrete Math": /^Levin$/, "Linear Algebra": /^Nicholson$/, "Intro Statistics": /Introductory Statistics/, "Calculus I": /Calculus Volume/, "Calculus II": /Calculus Volume/, "Calculus III": /Calculus Volume/ };
const ADDED = ["Discrete Math", "Linear Algebra"];

type Term = { id: string; en: { term: string; alt?: string[]; variants?: { term: string }[] }; level: { jp: string[]; us: string[] }; mapping_note?: string; pitfalls?: string[]; confidence: string };
interface Change {
  id: string;
  confidence: string;
  rule: 1 | 7;
  from: string[];
  to: string[];
  why: string;
}

function main() {
  const out = process.argv.includes("--json") ? process.argv[process.argv.indexOf("--json") + 1] : null;
  const counts = JSON.parse(fs.readFileSync(path.join(ROOT, "corpus", "counts.json"), "utf8")) as CountsFile;
  const ref = new Map(counts.entries.filter((e) => e.collection === "terms").map((e) => [e.id, e.reference]));
  const names = JSON.parse(fs.readFileSync(path.join(ROOT, "audits", "checks", "reference-theorem-names.json"), "utf8")) as {
    names: { name: string; refs: Record<string, number>; sections?: Record<string, string[]>; judged: { id?: string; related?: boolean; skip?: boolean } | null }[];
  };
  // entry id -> the references (keys of refs) whose name was judged the entry's concept
  const judged = new Map<string, { name: string; refs: Record<string, number>; sections: Record<string, string[]> }[]>();
  for (const n of names.names) {
    const j = n.judged;
    if (!j?.id || j.related || j.skip) continue;
    (judged.get(j.id) ?? judged.set(j.id, []).get(j.id)!).push({ name: n.name, refs: n.refs, sections: n.sections ?? {} });
  }

  const changes: Change[] = [];
  for (const { data } of loadAll().terms) {
    const d = data as unknown as Term;
    const wordings = [d.en.term, ...(d.en.alt ?? []), ...(d.en.variants ?? []).map((v) => v.term)].map((w) => countedAs("terms", d.id, w));
    const r = ref.get(d.id);
    const text = [d.mapping_note ?? "", ...(d.pitfalls ?? [])].join("\n");
    let us = [...d.level.us];

    if (NOT_IN_HIGH_SCHOOL.test(text)) {
      const hits = (course: string) => (r ? Math.max(0, ...wordings.map((w) => COLLEGE[course](r, w))) : 0);
      const named = (course: string) => (judged.get(d.id) ?? []).some((n) => Object.keys(n.refs).some((k) => COLLEGE_NAMES[course].test(k)));
      const kept = us.filter((c) => c in COLLEGE && (hits(c) > 0 || named(c)));
      const added = ADDED.filter((c) => !us.includes(c) && hits(c) >= REFERENCE_NAMED);
      const next = [...kept, ...added];
      if (next.join() !== us.join()) {
        const dropped = us.filter((c) => !next.includes(c));
        const why = [
          dropped.length ? `外した ${dropped.join("・")}` : "",
          kept.length ? `残した ${kept.map((c) => `${c}（${hits(c) > 0 ? `${c === "Discrete Math" ? "Levin" : c === "Linear Algebra" ? "Nicholson" : "OpenStax"} ${hits(c)} 件` : "参照の同じ概念の名前"}）`).join("・")}` : "",
          added.length ? `足した ${added.map((c) => `${c}（${c === "Discrete Math" ? "Levin" : "Nicholson"} ${hits(c)} 件）`).join("・")}` : "",
        ].filter(Boolean).join("、");
        changes.push({ id: d.id, confidence: d.confidence, rule: 1, from: us, to: next, why });
        us = next;
      }
    }

    if (us.includes("Geometry") && d.level.jp.some((j) => j === "数I" || j === "数A")) {
      const ck12 = (w: string) =>
        Object.entries(r?.ck12?.[w] ?? {}).filter(([s]) => s.startsWith("CK-12 Geometry")).reduce((a, [, n]) => a + n, 0) +
        (r?.ck12Titles?.[w] ?? []).filter((s) => s.startsWith("CK-12 Geometry")).length;
      const im = (w: string) =>
        Object.entries(r?.im?.[w] ?? {}).filter(([s]) => s.startsWith("Geometry ")).reduce((a, [, n]) => a + n, 0) +
        ((r?.imGlossary?.[w] ?? []).includes("Geometry") ? 1 : 0);
      const inGeometry = wordings.some((w) => ck12(w) + im(w) > 0);
      const namedInGeometry = (judged.get(d.id) ?? []).some(
        (n) => (n.refs["CK-12 Geometry"] ?? 0) > 0 || (n.sections["IM 9–12"] ?? []).some((s) => s.startsWith("Geometry ")),
      );
      if (!inGeometry && !namedInGeometry) {
        const next = us.filter((c) => c !== "Geometry");
        changes.push({ id: d.id, confidence: d.confidence, rule: 7, from: us, to: next, why: "見出し・alt・variants が CK-12 Geometry・IM Geometry に 0 件" });
        us = next;
      }
    }
  }

  for (const c of changes) console.log(`${c.rule === 1 ? "H-1" : "H-7"}  ${c.id.padEnd(44)} ${c.confidence.padEnd(8)} ${JSON.stringify(c.from)} -> ${JSON.stringify(c.to)}  ${c.why}`);
  const by = (k: 1 | 7) => changes.filter((c) => c.rule === k);
  console.log(`\nH-1 (決定 1): ${by(1).length} terms (verified ${by(1).filter((c) => c.confidence === "verified").length}); H-7 (決定 7): ${by(7).length} terms (verified ${by(7).filter((c) => c.confidence === "verified").length})`);
  if (out) fs.writeFileSync(out, JSON.stringify(changes, null, 1) + "\n", "utf8");
}

main();
