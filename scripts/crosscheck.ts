/**
 * Stage 2 of the QA in PLAN.md 8: cross-checking against outside sources.
 *
 * For every entry whose `sources` contains a `wikipedia-langlink`, ask the
 * MediaWiki API for the real ja -> en language link and compare it with the
 * claimed English title. Mismatches are reported and, with --write, recorded
 * as `flags` on the entry so it cannot be promoted to `verified`.
 *
 *   pnpm crosscheck               report only
 *   pnpm crosscheck -- --write    write flags back into data/
 *   pnpm crosscheck -- --refresh  ask the API again for every title
 *
 * Titles are asked for 50 at a time, following the API's `continue`. Every
 * request has a timeout and a retry limit, progress is printed as done/total,
 * and answers are cached in corpus/cache/crosscheck.json (gitignored with the
 * rest of corpus/): a re-run asks only for titles not cached yet.
 *
 * Nothing is copied from Wikipedia; only titles are compared.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadAll, localDate, type LoadedEntry } from "./lib/load.js";

const WRITE = process.argv.includes("--write");
const REFRESH = process.argv.includes("--refresh");
const API = "https://ja.wikipedia.org/w/api.php";
const TODAY = localDate();
const CACHE = path.join(ROOT, "corpus", "cache", "crosscheck.json");
const BATCH = 50; // MediaWiki titles per query
const TIMEOUT_MS = 30_000;
const MAX_RETRY = 3;
const PAUSE_MS = 500;

interface LangSource {
  type: string;
  ja?: string;
  en?: string;
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*$/, "")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

interface Answer {
  /** en langlink of the ja article (after redirects), or null */
  title: string | null;
  redirectedTo?: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** GET with a timeout and a retry limit. 429 waits Retry-After (or 10 s × attempt). */
async function getJson(url: string): Promise<unknown> {
  let last: unknown;
  for (let attempt = 0; attempt <= MAX_RETRY; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "MathEigo crosscheck (CC0 dataset)" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (res.ok) return await res.json();
      last = new Error(`MediaWiki API ${res.status}`);
      if (attempt === MAX_RETRY) break;
      const wait = res.status === 429 ? Number(res.headers.get("retry-after")) || 10 * (attempt + 1) : 5 * (attempt + 1);
      console.log(`  retry ${attempt + 1}/${MAX_RETRY} in ${wait}s: ${res.status}`);
      await sleep(wait * 1000);
    } catch (e) {
      last = e;
      if (attempt === MAX_RETRY) break;
      console.log(`  retry ${attempt + 1}/${MAX_RETRY} in ${5 * (attempt + 1)}s: ${(e as Error).message}`);
      await sleep(5000 * (attempt + 1));
    }
  }
  throw new Error(`gave up after ${MAX_RETRY} retries: ${(last as Error)?.message ?? last}`);
}

interface QueryJson {
  continue?: Record<string, string>;
  query?: {
    normalized?: { from: string; to: string }[];
    redirects?: { from: string; to: string }[];
    pages?: { title: string; missing?: boolean; invalid?: boolean; langlinks?: { title: string }[] }[];
  };
}

/** One batch of ja titles -> en langlinks, following `continue` until complete. */
async function fetchBatch(titles: string[]): Promise<Record<string, Answer>> {
  const norm = new Map<string, string>();
  const redir = new Map<string, string>();
  const pages = new Map<string, { missing?: boolean; invalid?: boolean }>();
  const links = new Map<string, string>();
  let cont: Record<string, string> = {};
  for (;;) {
    const params = new URLSearchParams({
      action: "query",
      prop: "langlinks",
      lllang: "en",
      lllimit: "max",
      redirects: "1",
      format: "json",
      formatversion: "2",
      titles: titles.join("|"),
      ...cont,
    });
    const json = (await getJson(`${API}?${params}`)) as QueryJson;
    for (const n of json.query?.normalized ?? []) norm.set(n.from, n.to);
    for (const r of json.query?.redirects ?? []) redir.set(r.from, r.to);
    for (const p of json.query?.pages ?? []) {
      pages.set(p.title, p);
      for (const l of p.langlinks ?? []) links.set(p.title, l.title);
    }
    if (!json.continue) break;
    cont = json.continue;
    await sleep(PAUSE_MS);
  }
  const out: Record<string, Answer> = {};
  for (const t of titles) {
    const t2 = norm.get(t) ?? t;
    const t3 = redir.get(t2) ?? t2;
    const page = pages.get(t3);
    const redirectedTo = t3 !== t2 ? t3 : undefined;
    out[t] = !page || page.missing || page.invalid ? { title: null, redirectedTo } : { title: links.get(t3) ?? null, redirectedTo };
  }
  return out;
}

async function answersFor(titles: string[]): Promise<Record<string, Answer>> {
  const cache: { fetched?: string; ja: Record<string, Answer> } =
    !REFRESH && fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, "utf8")) : { ja: {} };
  const todo = [...new Set(titles)].filter((t) => !(t in cache.ja));
  console.log(`  ${titles.length} title(s), ${titles.length - todo.length} cached, ${todo.length} to fetch`);
  for (let i = 0; i < todo.length; i += BATCH) {
    const batch = todo.slice(i, i + BATCH);
    Object.assign(cache.ja, await fetchBatch(batch));
    cache.fetched = TODAY;
    fs.mkdirSync(path.dirname(CACHE), { recursive: true });
    fs.writeFileSync(CACHE, JSON.stringify(cache, null, 1) + "\n", "utf8");
    console.log(`  [crosscheck] ${Math.min(i + BATCH, todo.length)}/${todo.length}`);
    await sleep(PAUSE_MS);
  }
  return cache.ja;
}

interface Finding {
  entry: LoadedEntry;
  code: string;
  note: string;
}

async function main() {
  const all = loadAll();
  const targets = [...all.terms, ...all.symbols, ...all.conventions].filter((e) =>
    ((e.data.sources as LangSource[] | undefined) ?? []).some(
      (s) => s.type === "wikipedia-langlink",
    ),
  );

  console.log(
    `crosscheck: ${targets.length} entr${targets.length === 1 ? "y" : "ies"} claim a wikipedia-langlink`,
  );

  const findings: Finding[] = [];
  let ok = 0;

  const claimedJaOf = (entry: LoadedEntry) => {
    const src = ((entry.data.sources as LangSource[]) ?? []).find((s) => s.type === "wikipedia-langlink")!;
    return src.ja ?? (entry.data.ja as { term: string } | undefined)?.term ?? "";
  };
  const answers = await answersFor(targets.map(claimedJaOf));

  for (const entry of targets) {
    const src = ((entry.data.sources as LangSource[]) ?? []).find((s) => s.type === "wikipedia-langlink")!;
    const claimedJa = claimedJaOf(entry);
    const claimedEn = src.en ?? (entry.data.en as { term: string } | undefined)?.term ?? "";
    const label = `${entry.collection}/${entry.stem}`;
    const { title, redirectedTo } = answers[claimedJa] ?? { title: null };

    if (title === null) {
      findings.push({
        entry,
        code: "langlink-missing",
        note: `ja.wikipedia「${claimedJa}」に英語版へのリンクが無い（記事が存在しない可能性）`,
      });
      console.log(`  MISS  ${label}  ${claimedJa} -> (no en langlink)`);
    } else if (normalize(title) !== normalize(claimedEn)) {
      findings.push({
        entry,
        code: "langlink-mismatch",
        note: `ja.wikipedia「${claimedJa}」の英語版は "${title}"。データは "${claimedEn}"`,
      });
      console.log(`  DIFF  ${label}  ${claimedJa} -> "${title}" (data says "${claimedEn}")`);
    } else {
      ok += 1;
      const via = redirectedTo ? ` (via redirect to ${redirectedTo})` : "";
      console.log(`  ok    ${label}  ${claimedJa} -> "${title}"${via}`);
    }
  }

  console.log(`\nmatched ${ok}, flagged ${findings.length}`);

  if (!WRITE) {
    if (findings.length) console.log("run with --write to record these as flags");
    return;
  }

  for (const f of findings) {
    const data = f.entry.data as Record<string, unknown>;
    const flags = ((data.flags as { code: string }[] | undefined) ?? []).filter(
      (x) => x.code !== f.code,
    );
    flags.push({ code: f.code, note: f.note, raised: TODAY } as { code: string });
    data.flags = flags;
    if (data.confidence === "verified") data.confidence = "likely";
    fs.writeFileSync(f.entry.file, JSON.stringify(data, null, 2) + "\n", "utf8");
  }
  if (findings.length) console.log(`wrote flags to ${findings.length} file(s)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
