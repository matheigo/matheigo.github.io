import { loadReferences } from "./references.ts";
import { countTerm } from "./lib.ts";
const r = loadReferences();
for (const w of process.argv.slice(2)) for (const k of ["nicholson","levin","cedStats"] as const) {
  const hits = (r[k]??[]).map(([n,x])=>[n,countTerm(x,w)] as const).filter(([,n])=>n>0);
  if (hits.length) console.log(w, k, hits.map(([n,c])=>`${n.slice(0,30)}×${c}`).join("; "));
}
