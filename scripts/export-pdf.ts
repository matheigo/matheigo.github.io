/**
 * The word-to-word PDF (PLAN §7): scripts/lib/print.ts renders the list from
 * dist/data/terms.json (written by pnpm export), headless Chrome prints it.
 *
 *   pnpm export && pnpm export:pdf            -> dist/data/matheigo-word-to-word.pdf
 *   pnpm export:pdf -- --data <dir> --out <file.pdf>
 *
 * Verified entries only. With none, nothing is written (the download page says
 * the PDF ships after the audit). Chrome: $CHROME_PATH, else the usual install
 * locations on macOS and Linux.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { ROOT, localDate } from "./lib/load.js";
import { renderWordToWord, wordToWordRows, type PrintTerm } from "./lib/print.js";

const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];

export function findChrome(): string | null {
  const fromEnv = process.env.CHROME_PATH;
  if (fromEnv && fs.existsSync(fromEnv)) return fromEnv;
  return CHROME_CANDIDATES.find((p) => fs.existsSync(p)) ?? null;
}

export async function exportPdf(dataDir: string, out: string): Promise<string | null> {
  const terms = JSON.parse(fs.readFileSync(path.join(dataDir, "terms.json"), "utf8")) as PrintTerm[];
  const { jaEn } = wordToWordRows(terms);
  if (!jaEn.length) {
    console.log("export-pdf: no verified terms yet - nothing written (the PDF ships after the Phase 5 audit)");
    return null;
  }
  const chrome = findChrome();
  if (!chrome) throw new Error("export-pdf: no Chrome found; set CHROME_PATH");

  const html = renderWordToWord(terms, localDate());
  const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--no-sandbox"] });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await page.pdf({ path: out, format: "A4", printBackground: true, preferCSSPageSize: true });
  } finally {
    await browser.close();
  }
  console.log(`export-pdf: ${jaEn.length} terms -> ${out}`);
  return out;
}

async function main() {
  const args = process.argv.slice(2);
  const opt = (name: string, dflt: string) => {
    const i = args.indexOf(name);
    return i >= 0 && args[i + 1] ? path.resolve(args[i + 1]) : dflt;
  };
  const dataDir = opt("--data", path.join(ROOT, "dist", "data"));
  const out = opt("--out", path.join(dataDir, "matheigo-word-to-word.pdf"));
  await exportPdf(dataDir, out);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
}
