// scratch: IM hits per course for some wordings (counts only)
import { loadReferences } from "./references.js";
import { countTerm } from "./lib.js";
const refs = loadReferences();
const words = process.argv.slice(2).filter((a) => a !== "--");
const course = (s: string) => (s.startsWith("Grade") || s.startsWith("Algebra") ? s.split(" ").slice(0, 2).join(" ") : s.split(" ")[0]);
for (const w of words) {
  const by: Record<string, number> = {};
  for (const [s, t] of refs.im ?? []) {
    const n = countTerm(t, w);
    if (n) by[course(s)] = (by[course(s)] ?? 0) + n;
  }
  const g = Object.entries(refs.imGlossary ?? {}).filter(([, hs]) => hs.some((h) => h.toLowerCase() === w.toLowerCase())).map(([c]) => c);
  console.log(`${w.padEnd(40)} ${Object.values(by).reduce((a, b) => a + b, 0)}  ${JSON.stringify(by)}${g.length ? `  glossary: ${g.join(", ")}` : ""}`);
}
