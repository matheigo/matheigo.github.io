/**
 * Phase 5 audit, symbols S1・S2: count a symbol's reading form and read its contexts.
 *
 *   pnpm exec tsx scripts/audit/symctx.ts "floor of *"                     # spoken / written totals by source, sampled contexts
 *   pnpm exec tsx scripts/audit/symctx.ts -n 20 "the cube root of *" "!the cube root of *"
 *
 * `pnpm corpus:probe` counts terms' wordings, so a symbol's `*` (one to five
 * words) and its "A | B" / "!w" marks stay literal there. This counts a form
 * exactly as corpus:count does for symbols (lib.ts matcherFor("symbols")) on
 * the deduplicated corpus of corpus:probe (corpus/probe-cache.json; run
 * `pnpm corpus:probe -- x` once if it is missing), without MICASE, and on the
 * bodies of the references (the CEDs, IM, CK-12, Nicholson, Levin). Contexts
 * are picked at even steps. Terminal only: corpus text is never written
 * (Phase 5 監査 9: the reviewers' helper of batches 32-33, backlog 79).
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "../lib/load.js";
import { matcherFor, normalize } from "../corpus/lib.js";
import { loadReferences } from "../corpus/references.js";

type Doc = { id: string; register: string; text: string };

const cache = path.join(ROOT, "corpus", "probe-cache.json");
if (!fs.existsSync(cache)) {
  console.error(`missing ${cache}: run \`pnpm corpus:probe -- x\` once to build it`);
  process.exit(1);
}
const docs = (JSON.parse(fs.readFileSync(cache, "utf8")) as { docs: Doc[] }).docs;
const refs = loadReferences() as unknown as Record<string, [string, string][] | undefined>;

const args = process.argv.slice(2);
let n = 8;
const forms: string[] = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "-n") n = Number(args[++i]);
  else forms.push(args[i]);
}
if (forms.length === 0) {
  console.error('usage: pnpm exec tsx scripts/audit/symctx.ts [-n 8] "<form>" ["<form>" ...]');
  process.exit(2);
}

function sample(list: { id: string; text: string }[], re: RegExp, k: number) {
  const all: { id: string; at: number; len: number; text: string }[] = [];
  for (const d of list) for (const m of d.text.matchAll(re)) all.push({ id: d.id, at: m.index ?? 0, len: m[0].length, text: d.text });
  const step = all.length / Math.min(k, all.length || 1);
  const picked = all.length <= k ? all : Array.from({ length: k }, (_, i) => all[Math.floor(i * step)]);
  const words = (s: string) => s.trim().split(" ");
  return {
    total: all.length,
    lines: picked.map(({ id, at, len, text }) => {
      const before = words(text.slice(Math.max(0, at - 70), at)).slice(-8).join(" ");
      const after = words(text.slice(at + len, at + len + 70)).slice(0, 8).join(" ");
      return `${id.slice(0, 40)} | ${before} [${text.slice(at, at + len)}] ${after}`;
    }),
  };
}

const matcher = matcherFor("symbols");
for (const form of forms) {
  const re = matcher(form);
  console.log(`\n##### ${form}`);
  if (!re) {
    console.log("  (no pattern)");
    continue;
  }
  const global = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  for (const register of ["spoken", "written"]) {
    const list = docs.filter((d) => d.register === register && !(d.id ?? "").startsWith("micase"));
    const by: Record<string, number> = {};
    for (const d of list) {
      const c = [...d.text.matchAll(global)].length;
      if (c) by[d.id] = (by[d.id] ?? 0) + c;
    }
    const s = sample(list, global, n);
    console.log(`  ${register}: total ${s.total}  ${JSON.stringify(by)}`);
    for (const l of s.lines) console.log(`    ${register === "spoken" ? "話" : "書"} ${l}`);
  }
  for (const k of ["ced", "cedStats", "im", "ck12", "nicholson", "levin"]) {
    const list = (refs[k] ?? []).map(([section, text]) => ({ id: `${k} ${section}`, text: normalize(text) }));
    const s = sample(list, global, n);
    if (s.total) {
      console.log(`  参 ${k}: ${s.total}`);
      for (const l of s.lines) console.log(`    参 ${l}`);
    }
  }
}
