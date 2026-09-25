import { loadReferences } from "./references.ts";
import { countTerm } from "./lib.ts";
const r = loadReferences();
for (const w of process.argv.slice(2)) {
  const t = (s: [string,string][]|undefined) => (s??[]).reduce((n,[,x])=>n+countTerm(x,w),0);
  const topics = (r.cedStats??[]).filter(([n,x])=>countTerm(x,w)>0).map(([n,x])=>`${n}×${countTerm(x,w)}`).join(" ");
  console.log(`${w.padEnd(30)} calcCED ${t(r.ced)}  statsCED ${t(r.cedStats)}  nicholson ${t(r.nicholson)}  levin ${t(r.levin)}   [${topics}]`);
}
