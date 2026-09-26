/**
 * The word-to-word list (PLAN §2.1, §4): Japanese ⇄ English, no definitions,
 * the format a school may accept as a one-to-one dictionary in an exam (the
 * page itself says to ask; the site never claims it is allowed).
 *
 * Verified entries only (DECISIONS, Phase 0). Explanatory translations carry
 * the label (PLAN §9 Phase 4 の 2).
 */
import { GLOSS_LABEL, isExplanatoryTranslation } from "../../src/lib/gloss.js";

export interface PrintTerm {
  id: string;
  ja: { term: string; reading: string };
  en: { term: string };
  mapping: string;
  flags?: { code: string }[];
  confidence: string;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

const collatorJa = new Intl.Collator("ja");
const collatorEn = new Intl.Collator("en", { sensitivity: "base" });

export function wordToWordRows(terms: PrintTerm[]) {
  const rows = terms
    .filter((t) => t.confidence === "verified")
    .map((t) => ({ ja: t.ja.term, reading: t.ja.reading, en: t.en.term, gloss: isExplanatoryTranslation(t) }));
  return {
    jaEn: [...rows].sort((a, b) => collatorJa.compare(a.reading, b.reading)),
    // A paraphrase is not an English headword, so it is not listed under A–Z.
    enJa: rows.filter((r) => !r.gloss).sort((a, b) => collatorEn.compare(a.en, b.en)),
  };
}

export function renderWordToWord(terms: PrintTerm[], date: string): string {
  const { jaEn, enJa } = wordToWordRows(terms);
  const mark = `<span class="gloss">${GLOSS_LABEL}</span>`;
  const jaRows = jaEn
    .map((r) => `<tr><td>${esc(r.ja)}<span class="r">${esc(r.reading)}</span></td><td lang="en">${esc(r.en)}${r.gloss ? ` ${mark}` : ""}</td></tr>`)
    .join("\n");
  const enRows = enJa.map((r) => `<tr><td lang="en">${esc(r.en)}</td><td>${esc(r.ja)}</td></tr>`).join("\n");
  return `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><title>MathEigo 数学 日英・英日 単語対訳表</title>
<meta name="robots" content="noindex">
<style>
  @page { size: A4; margin: 14mm 12mm; }
  body { font-family: "Noto Sans JP", "Noto Sans CJK JP", "Hiragino Sans", "Yu Gothic", sans-serif; font-size: 9.5pt; color: #000; }
  h1 { font-size: 14pt; margin: 0 0 2mm; }
  h2 { font-size: 11pt; margin: 6mm 0 2mm; break-after: avoid; }
  p.note { font-size: 8pt; margin: 0 0 3mm; }
  .cols { column-count: 2; column-gap: 8mm; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 0.6mm 1mm; border-bottom: 0.2pt solid #999; vertical-align: top; break-inside: avoid; }
  td:first-child { width: 50%; }
  [lang="en"] { font-family: "Helvetica Neue", Arial, sans-serif; }
  .r { display: block; font-size: 7pt; color: #444; }
  .gloss { font-size: 7pt; border: 0.4pt dashed #000; padding: 0 1mm; white-space: nowrap; }
</style></head>
<body>
<h1>数学 日英・英日 単語対訳表（定義なし）</h1>
<p class="note">MathEigo（https://matheigo.github.io/）${esc(date)} 版。監査済みの ${jaEn.length} 語。データは CC0 1.0。
「${GLOSS_LABEL}」の印は、日本にしかない概念をこの辞典が英語で説明した訳で、英語の用語ではありません。
試験への持ち込みの可否は学校・州の方針によります。必ず担当の先生に確認してください。</p>
<h2>日本語 → 英語</h2>
<div class="cols"><table>${jaRows}</table></div>
<h2>English → Japanese</h2>
<div class="cols"><table>${enRows}</table></div>
</body></html>
`;
}
