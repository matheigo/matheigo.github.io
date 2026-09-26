/**
 * Measures the Phase 4 completion criteria (PLAN §9 Phase 4):
 *
 *   1. Lighthouse (mobile preset: simulated slow 4G, 4x CPU slowdown,
 *      Moto G Power screen) Performance on the representative pages.
 *   2. Time to the first search on a throttled phone: how long until results
 *      are on screen when the user types at once, and when the user types
 *      after the page has loaded.
 *
 *   pnpm build && pnpm perf                       # the release build (dist/)
 *   pnpm perf -- --site perf/site-show --label show   # a build with the toggle on
 *
 * The site is served by a small static server with gzip, like GitHub Pages.
 * Results go to perf/<label>.json (gitignored) and a table on stdout.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import zlib from "node:zlib";
import type { AddressInfo } from "node:net";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import puppeteer, { PredefinedNetworkConditions, type Page } from "puppeteer-core";
import { ROOT } from "../lib/load.js";
import { findChrome } from "../export-pdf.js";

const args = process.argv.slice(2);
const opt = (name: string, dflt: string) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : dflt;
};
const SITE = path.resolve(ROOT, opt("--site", "dist"));
const LABEL = opt("--label", "release");
const RUNS = Number(opt("--runs", "3"));
const SEARCH_RUNS = Number(opt("--search-runs", "5"));

export const PAGES: [string, string][] = [
  ["トップ", "/"],
  ["用語", "/terms/quadratic-formula/"],
  ["用語（説明の訳）", "/terms/rate/"],
  ["記号", "/symbols/integral-definite/"],
  ["記号の一覧", "/symbols/"],
  ["フレーズ", "/phrases/class-listening/"],
  ["慣習差", "/conventions/conditional-probability-notation/"],
  ["カリキュラム", "/curriculum/"],
  ["カリキュラムの単元", "/curriculum/jp-suugaku-3-sekibun/"],
];

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

function serve(dir: string): Promise<http.Server> {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://x");
    let file = path.join(dir, decodeURIComponent(url.pathname));
    if (!file.startsWith(dir)) return void res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      return void res.end(fs.readFileSync(path.join(dir, "404.html")));
    }
    const type = TYPES[path.extname(file)] ?? "application/octet-stream";
    const body = fs.readFileSync(file);
    const headers: Record<string, string> = { "Content-Type": type, "Cache-Control": "max-age=600" };
    if (/text|json|javascript|svg|xml/.test(type) && /gzip/.test(String(req.headers["accept-encoding"]))) {
      headers["Content-Encoding"] = "gzip";
      res.writeHead(200, headers);
      return void res.end(zlib.gzipSync(body, { level: 9 }));
    }
    res.writeHead(200, headers);
    res.end(body);
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};

interface LhRun {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  fcp: number;
  lcp: number;
  tbt: number;
  cls: number;
  si: number;
  bytes: number;
}

async function runLighthouse(base: string, chromePath: string) {
  const chrome = await chromeLauncher.launch({ chromePath, chromeFlags: ["--headless=new", "--no-sandbox"] });
  const out: Record<string, { runs: LhRun[]; median: LhRun }> = {};
  try {
    for (const [name, p] of PAGES) {
      const runs: LhRun[] = [];
      for (let i = 0; i < RUNS; i++) {
        const r = await lighthouse(`${base}${p}`, {
          port: chrome.port,
          output: "json",
          logLevel: "error",
          onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
        });
        if (!r) throw new Error(`lighthouse returned nothing for ${p}`);
        const lhr = r.lhr;
        const num = (id: string) => Number(lhr.audits[id]?.numericValue ?? NaN);
        runs.push({
          performance: Math.round((lhr.categories.performance.score ?? 0) * 100),
          accessibility: Math.round((lhr.categories.accessibility.score ?? 0) * 100),
          bestPractices: Math.round((lhr.categories["best-practices"].score ?? 0) * 100),
          seo: Math.round((lhr.categories.seo.score ?? 0) * 100),
          fcp: num("first-contentful-paint"),
          lcp: num("largest-contentful-paint"),
          tbt: num("total-blocking-time"),
          cls: num("cumulative-layout-shift"),
          si: num("speed-index"),
          bytes: num("total-byte-weight"),
        });
      }
      const pick = (k: keyof LhRun) => median(runs.map((x) => x[k]));
      out[name] = {
        runs,
        median: {
          performance: pick("performance"),
          accessibility: pick("accessibility"),
          bestPractices: pick("bestPractices"),
          seo: pick("seo"),
          fcp: pick("fcp"),
          lcp: pick("lcp"),
          tbt: pick("tbt"),
          cls: pick("cls"),
          si: pick("si"),
          bytes: pick("bytes"),
        },
      };
      const m = out[name].median;
      console.log(
        `  ${name.padEnd(12)} perf ${m.performance} (runs ${runs.map((x) => x.performance).join("/")})  FCP ${(m.fcp / 1000).toFixed(2)}s  LCP ${(m.lcp / 1000).toFixed(2)}s  TBT ${m.tbt.toFixed(0)}ms  CLS ${m.cls.toFixed(3)}  ${(m.bytes / 1024).toFixed(0)} KB  a11y ${m.accessibility}  bp ${m.bestPractices}  seo ${m.seo}`,
      );
    }
  } finally {
    await chrome.kill();
  }
  return out;
}

/** Network profiles for the search timing. */
const PROFILES = {
  // Lighthouse's mobile preset (simulated): 150 ms RTT, 1.6 Mbps down, 750 Kbps up, 4x CPU.
  "lighthouse-mobile": { download: (1.6 * 1024 * 1024) / 8, upload: (750 * 1024) / 8, latency: 150 },
  // Chrome DevTools' "Slow 4G" (the same link with packet-level latency folded in): 562.5 ms.
  "devtools-slow-4g": PredefinedNetworkConditions["Slow 4G"],
};

interface SearchRun {
  /** navigation start → results on screen, typing as soon as the box exists */
  immediate: number;
  /** navigation start → substring scan ready (index fetched and expanded) */
  scanReady: number;
  /** navigation start → MiniSearch built */
  miniReady: number;
  /** first keystroke → results, typing once the page has settled (network idle) */
  afterLoad: number;
}

const INSTRUMENT = () => {
  try {
    localStorage.setItem("matheigo:show-unverified", "1");
  } catch {}
  const w = window as unknown as Record<string, number>;
  new MutationObserver(() => {
    const s = document.documentElement.dataset.search;
    if (s === "scan" && !w.__scan) w.__scan = performance.now();
    if (s === "ready" && !w.__ready) w.__ready = performance.now();
  }).observe(document, { attributes: true, subtree: true, attributeFilter: ["data-search"] });
  document.addEventListener(
    "input",
    () => {
      if (!w.__key) w.__key = performance.now();
    },
    true,
  );
  document.addEventListener("matheigo:searched", () => {
    if (!w.__hits && document.querySelectorAll("#hits li").length) w.__hits = performance.now();
  });
};

async function throttle(page: Page, profile: keyof typeof PROFILES) {
  await page.emulateNetworkConditions(PROFILES[profile]);
  await page.emulateCPUThrottling(4);
  await page.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true });
}

async function searchTimings(base: string, chromePath: string) {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: true, args: ["--no-sandbox"] });
  const out: Record<string, { runs: SearchRun[]; median: SearchRun; max: SearchRun }> = {};
  try {
    for (const profile of Object.keys(PROFILES) as (keyof typeof PROFILES)[]) {
      const runs: SearchRun[] = [];
      for (let i = 0; i < SEARCH_RUNS; i++) {
        // Cold cache each time: a fresh browser context.
        const ctx = await browser.createBrowserContext();
        const page = await ctx.newPage();
        await throttle(page, profile);
        await page.evaluateOnNewDocument(INSTRUMENT);
        const nav = page.goto(`${base}/`, { waitUntil: "load" });
        await page.waitForSelector("#q");
        await page.type("#q", "bibun");
        await page.waitForFunction(() => (window as unknown as Record<string, number>).__hits > 0, { polling: 10, timeout: 60_000 });
        await nav;
        await page.waitForFunction(() => document.documentElement.dataset.search === "ready", { timeout: 60_000 });
        const a = await page.evaluate(() => {
          const w = window as unknown as Record<string, number>;
          return { hits: w.__hits, scan: w.__scan, ready: w.__ready };
        });
        await ctx.close();

        // The usual pattern: the page has settled, then the user taps the box and types.
        const ctx2 = await browser.createBrowserContext();
        const page2 = await ctx2.newPage();
        await throttle(page2, profile);
        await page2.evaluateOnNewDocument(INSTRUMENT);
        await page2.goto(`${base}/`, { waitUntil: "networkidle0" });
        await page2.type("#q", "sekibun");
        await page2.waitForFunction(() => (window as unknown as Record<string, number>).__hits > 0, { polling: 10, timeout: 60_000 });
        const b = await page2.evaluate(() => {
          const w = window as unknown as Record<string, number>;
          return w.__hits - w.__key;
        });
        await ctx2.close();

        runs.push({ immediate: a.hits, scanReady: a.scan, miniReady: a.ready, afterLoad: b });
      }
      const pick = (k: keyof SearchRun, f: (xs: number[]) => number) => f(runs.map((r) => r[k]));
      const max = (xs: number[]) => Math.max(...xs);
      out[profile] = {
        runs,
        median: {
          immediate: pick("immediate", median),
          scanReady: pick("scanReady", median),
          miniReady: pick("miniReady", median),
          afterLoad: pick("afterLoad", median),
        },
        max: {
          immediate: pick("immediate", max),
          scanReady: pick("scanReady", max),
          miniReady: pick("miniReady", max),
          afterLoad: pick("afterLoad", max),
        },
      };
      const m = out[profile].median;
      const x = out[profile].max;
      console.log(
        `  ${profile.padEnd(18)} typing at once → results ${m.immediate.toFixed(0)} ms (max ${x.immediate.toFixed(0)})  index ready ${m.scanReady.toFixed(0)} ms  MiniSearch ${m.miniReady.toFixed(0)} ms  keystroke on a settled page → results ${m.afterLoad.toFixed(0)} ms (max ${x.afterLoad.toFixed(0)})`,
      );
    }
  } finally {
    await browser.close();
  }
  return out;
}

async function main() {
  const chromePath = findChrome();
  if (!chromePath) throw new Error("no Chrome found; set CHROME_PATH");
  if (!fs.existsSync(path.join(SITE, "index.html"))) throw new Error(`${SITE} has no index.html - build first`);
  const server = await serve(SITE);
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  console.log(`measuring ${SITE} (${LABEL}) at ${base}`);
  try {
    console.log(`Lighthouse, mobile preset, median of ${RUNS}:`);
    const lh = await runLighthouse(base, chromePath);
    console.log(`first search, 4x CPU, median of ${SEARCH_RUNS} cold loads:`);
    const search = await searchTimings(base, chromePath);
    const outFile = path.join(ROOT, "perf", `${LABEL}.json`);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(
      outFile,
      JSON.stringify({ measured: new Date().toISOString(), site: path.relative(ROOT, SITE), label: LABEL, lighthouse: lh, search }, null, 2),
    );
    console.log(`-> ${path.relative(ROOT, outFile)}`);
  } finally {
    server.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
