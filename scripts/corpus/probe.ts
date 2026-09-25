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
 *       exactly as corpus:count + corpus:decide would reach it. A line
 *       "@mapping near" in a block gives the entry's mapping ("@ja 極値" its
 *       Japanese headword, "@id circumcenter" the entry whose English
 *       Wikipedia article is the last step of rule 2, "@translation" a
 *       Japanese headword that is this project's translation); when both
 *       registers are ③ it prints how the ③ is settled (no fixed expression,
 *       or the CED / OpenStax / IM / Nicholson / Levin / Wikipedia headword)
 *   --literal   count as written (phrases); the default counts as terms do:
 *               inflection folded, "…" = a one-to-three-word blank
 *   --contexts [n]  also print n contexts (default 10) of each wording per
 *               register, picked at even steps through its hits (lib.ts
 *               sampleTermContexts). For the check of an everyday-word
 *               headword before it is settled (DECISIONS, Phase 2 統計・ベクトル
 *               の単元の前の修正). Terminal only: corpus text is never written
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
  flatten,
  referenceHits,
  settleUndecided,
  countPhrase,
  countTerm,
  decideRobust,
  dedupe,
  normalize,
  sampleTermContexts,
  sourceWeights,
  VARIANTS,
  type CorpusDoc,
  type Verdict,
  WIKIPEDIA_NOT_SAME,
} from "./lib.js";
import type { ManifestEntry } from "./fetch.js";
import { loadReferences, REFERENCE_NAMES, wikipediaNames } from "./references.js";

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

/** Source families as the variants' notes name them (DECISIONS, Phase 2 修正: counts per source, mechanically). */
const FAMILY_NAMES: [RegExp, string][] = [
  [/^mit-notes$/, "MIT の講義ノート"],
  [/^mit-/, "MIT OCW"],
  [/^khan-/, "Khan Academy"],
  [/^yt:profleonard$/, "Professor Leonard"],
  [/^yt:organicchem$/, "The Organic Chemistry Tutor"],
  [/^yt:patrickjmt$/, "patrickJMT"],
  [/^yt:nancypi$/, "NancyPi"],
  [/^yt:blackpenredpen$/, "blackpenredpen"],
  [/^yt:3blue1brown$/, "3Blue1Brown"],
  [/^openstax-calculus$/, "OpenStax Calculus"],
  [/^openstax-algtrig$/, "OpenStax Algebra and Trigonometry"],
  [/^openstax-precalculus$/, "OpenStax Precalculus"],
  [/^openstax-introstats$/, "OpenStax Introductory Statistics"],
];

/** "話し言葉で 20 件（Khan Academy 15・MIT OCW 5）" - the breakdown the variants' notes carry. */
function breakdown(label: string, by: Record<string, number> | undefined): string {
  const fam: Record<string, number> = {};
  for (const [src, n] of Object.entries(by ?? {})) {
    const name = FAMILY_NAMES.find(([re]) => re.test(src))?.[1] ?? src;
    fam[name] = (fam[name] ?? 0) + n;
  }
  const rows = Object.entries(fam).sort((a, b) => b[1] - a[1]);
  const total = rows.reduce((n, [, k]) => n + k, 0);
  if (total === 0) return `${label}では 0 件`;
  if (rows.length === 1) return `${label}で ${total} 件（すべて ${rows[0][0]}）`;
  const top = rows.slice(0, 3).map(([k, n]) => `${k} ${n}`);
  const rest = rows.slice(3).reduce((n, [, k]) => n + k, 0);
  return `${label}で ${total} 件（${top.join("・")}${rest ? ` ほか ${rest}` : ""}）`;
}

function printContexts(docs: CorpusDoc[], wording: string, n: number) {
  for (const register of ["spoken", "written"] as const) {
    for (const h of sampleTermContexts(docs.filter((d) => d.register === register), wording, n)) {
      console.log(`      ${register === "spoken" ? "話" : "書"} ${h.source.padEnd(20)} ${h.snippet}`);
    }
  }
}

function probeDecide(docs: CorpusDoc[], blocks: string[][]) {
  const words: Record<string, number> = {};
  for (const r of balance(docs).rows) words[r.source] = r.words;
  const weights = sourceWeights(words);
  const refs = loadReferences();
  const openstax = docs.filter((d) => d.id.startsWith("openstax-")).map((d) => d.text);
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8")) as ManifestEntry[];
  const titles = manifest.filter((m) => m.id.startsWith("openstax-")).map((m) => m.title.replace(/^.*? - /, ""));
  const wikipedia = wikipediaNames(new Set(Object.keys(WIKIPEDIA_NOT_SAME)));
  for (const raw of blocks) {
    const mapping = raw.find((l) => l.startsWith("@mapping"))?.split(/\s+/)[1];
    const id = raw.find((l) => l.startsWith("@id"))?.split(/\s+/)[1];
    const projectTranslation = raw.some((l) => l.startsWith("@translation"));
    const block = raw.filter((l) => !l.startsWith("@"));
    const t = countEntry(docs, "terms", block, block[0]);
    console.log(`# ${block[0]}`);
    const verdicts: Verdict[] = [];
    for (const register of ["spoken", "written"] as const) {
      const counts = t[register];
      const raw = Object.entries(counts)
        .map(([c, by]) => [c, Object.values(by).reduce((a, b) => a + b, 0)] as const)
        .sort((a, b) => b[1] - a[1])
        .map(([c, n]) => `${c} ${n}`)
        .join(", ");
      const v = decideRobust(counts, weights, register);
      verdicts.push(v);
      console.log(`  ${register === "spoken" ? "話" : "書"} ${verdict(v)}   {${raw}}`);
    }
    for (const c of new Set([...Object.keys(t.spoken), ...Object.keys(t.written)])) {
      console.log(`    = ${c}: ${breakdown("話し言葉", t.spoken[c])}、${breakdown("書き言葉", t.written[c])}。`);
    }
    const wiki = id ? wikipedia.get(id) : undefined;
    const ref = { ...referenceHits(block, refs.ced, openstax, titles, refs), ...(wiki ? { wikipedia: wiki } : {}) };
    const sectioned = (by: Record<string, Record<string, number>> | undefined) =>
      Object.entries(by ?? {}).map(([c, at]) => `${c} [${Object.entries(at).slice(0, 4).map(([k, n]) => `${k}×${n}`).join(" ")}${Object.keys(at).length > 4 ? " …" : ""}]`);
    const osLine = block
      .filter((c) => ref.openstax[c] || ref.openstaxTitles[c])
      .map((c) => `${c} ${ref.openstax[c] ?? 0}${ref.openstaxTitles[c] ? ` {${ref.openstaxTitles[c].slice(0, 2).join(" | ")}}` : ""}`);
    console.log(`  CED ${sectioned(ref.ced).join("; ") || "—"}   CED-stats ${sectioned(ref.cedStats).join("; ") || "—"}`);
    console.log(`  OpenStax ${osLine.join("; ") || "—"}`);
    const imLine = block
      .filter((c) => ref.im?.[c] || ref.imGlossary?.[c])
      .map((c) => `${c} ${Object.values(ref.im?.[c] ?? {}).reduce((a, b) => a + b, 0)}${ref.imGlossary?.[c] ? ` {glossary: ${ref.imGlossary[c].join(", ")}}` : ""}`);
    console.log(`  IM ${imLine.join("; ") || "—"}`);
    console.log(`  Nicholson ${sectioned(ref.nicholson).join("; ") || "—"}   Levin ${sectioned(ref.levin).join("; ") || "—"}`);
    if (id) console.log(`  Wikipedia ${wiki ? `${wiki.title} (${wiki.via})` : "—"}`);
    if (verdicts.every((v) => v.kind === "undecided")) {
      const total = (by: Record<string, Record<string, number>>) => Object.values(flatten(by)).reduce((a, b) => a + b, 0);
      const ja = raw.find((l) => l.startsWith("@ja"))?.replace(/^@ja\s+/, "");
      const s = settleUndecided({ mapping, ja, en: block[0], projectTranslation }, { spoken: total(t.spoken), written: total(t.written) }, ref, block);
      const how =
        s.kind === "no-fixed-expression"
          ? "英語に決まった言い方がない"
          : s.kind === "reference"
            ? `${REFERENCE_NAMES[s.by]} の呼び方 ${s.head} (${s.where.slice(0, 3).join(", ")})`
            : `③ のまま${mapping ? "" : "（@mapping なし）"}`;
      console.log(`  ③ -> ${how}`);
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
  const ctxAt = args.indexOf("--contexts");
  const ctxGiven = ctxAt >= 0 && /^\d+$/.test(args[ctxAt + 1] ?? "");
  const ctxN = ctxAt < 0 ? 0 : ctxGiven ? Number(args.splice(ctxAt + 1, 1)[0]) : 10;
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
    if (ctxN) printContexts(docs, phrase, ctxN);
  }
}

main();
