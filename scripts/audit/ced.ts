/**
 * Phase 5 audit, point ⑦: does a CED section say what an entry says it does?
 *
 *   python3 scripts/audit/ced.py calc 1.8 "squeeze theorem" ["sandwich"]   # AP Calculus AB and BC CED (ced.py runs this file)
 *   python3 scripts/audit/ced.py stats 2.4 "conditional probability"        # AP Statistics CED
 *   python3 scripts/audit/ced.py calc unit1 "sign chart"                    # the Unit 1 opener
 *   python3 scripts/audit/ced.py calc all "sign chart"                      # which sections use a word
 *
 * The CED is cut into sections exactly as validate's CED note check cuts it
 * (scripts/lib/ced-notes.ts cedSectionTexts over scripts/corpus/lib.ts
 * cedSections: "n.m" topic pages, "unitN" unit openers, "front", "exam"), and
 * a word is looked for with the same pattern as a note's word (wordPattern:
 * inflections, up to two words between two words) in the normalized and the raw
 * text (Phase 5 監査 5 の決定 5 and 9: one implementation for the audit tool
 * and validate; the old ced.py cut a topic at the next TOPIC only, so a unit
 * opener fell into the topic before it). Prints the hits with a little context
 * to the terminal only; the CED's text never leaves corpus/ref/.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "../lib/load.js";
import { cedSectionTexts, wordPattern } from "../lib/ced-notes.js";
import { cedSections } from "../corpus/lib.js";

const FILES = { calc: "ap-calculus-ab-bc-ced.txt", stats: "ap-statistics-ced.txt" } as const;

function main() {
  const [which, section, ...words] = process.argv.slice(2);
  if (!(which in FILES) || !section || words.length === 0) {
    console.error('usage: ced.ts calc|stats <n.m|unitN|all> "<word>" ...');
    process.exit(2);
  }
  const text = fs.readFileSync(path.join(ROOT, "corpus", "ref", FILES[which as keyof typeof FILES]), "utf8");
  const both = cedSectionTexts(text); // normalized + raw, what validate searches
  const raw = new Map<string, string>(); // the CED's own text, for the context shown
  for (const [name, t] of cedSections(text)) raw.set(name, `${raw.get(name) ?? ""} ${t}`);
  const want = section.replace(/^unit\s+/i, "unit");
  const keys = want === "all" ? [...both.keys()].filter((k) => /^\d+\.\d+$|^unit\d+$/.test(k)) : [want];
  for (const w of words) {
    const pat = wordPattern(w);
    const found: string[] = [];
    for (const k of keys) {
      const body = both.get(k);
      if (!body || !pat.test(body)) continue;
      found.push(k);
      if (want !== "all") {
        const shown = (raw.get(k) ?? "").replace(/\s+/g, " ");
        const g = new RegExp(pat.source, "gi");
        let m: RegExpExecArray | null;
        let n = 0;
        while ((m = g.exec(shown)) && n < 3) {
          n++;
          console.log(`  ${k} … ${shown.slice(Math.max(0, m.index - 70), m.index + 90)} …`);
        }
      }
    }
    const where = want === "all" ? ` (${found.join(", ")})` : "";
    console.log(`${w}: ${want} → ${found.length ? "ある" : "無い"}${where}`);
  }
}

main();
