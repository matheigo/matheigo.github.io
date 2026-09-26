/**
 * Counts the key parts of the student phrases on Math Stack Exchange
 * (mse.ts; DECISIONS, Phase 3 フレーズ 3 の前の修正 1). Counts only: the filter
 * returns the total and the quota, never a post.
 *
 *   pnpm corpus:fetch:mse                 every phrase that needs it (mse.ts needsMse), from corpus/counts.json
 *   pnpm corpus:fetch:mse -- --dry        list what would be searched, send nothing
 *   pnpm corpus:fetch:mse -- --ids a,b    only these phrases (still only if they need it)
 *
 * Run corpus:count first: which phrases need Math Stack Exchange depends on
 * their counts in the MICASE students' utterances.
 *
 * One pass over everything missing: each search has a timeout and a retry
 * limit, progress is shown as done/total, every answer goes to the cache at
 * once (scripts/corpus/mse-counts.json), and a re-run searches only what the
 * cache lacks. No API key: the anonymous quota is 300 requests a day per IP.
 * When it runs out (quota_remaining 0 or a throttle error) the run stops and
 * says so; run it again the next day and it carries on from the cache.
 */
import fs from "node:fs";
import path from "node:path";
import { loadCollection, localDate, ROOT } from "../lib/load.js";
import { candidatesOf, phraseGroup, sourceWeights } from "./lib.js";
import { loadMseCache, mseQueries, needsMse, saveMseCache, MSE_GROUPS } from "./mse.js";
import type { CountsFile } from "./count.js";

const API = "https://api.stackexchange.com/2.3/search/advanced";
/** A filter with .total, .quota_remaining, .quota_max and .backoff only (made once with /filters/create). */
const FILTER = "!9n30I5cCu9fW";
const TIMEOUT_MS = 20_000;
const RETRIES = 3;
/** Stack Exchange asks for no more than 30 requests a second; one every 400 ms is well under. */
const GAP_MS = 400;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const argAfter = (flag: string) => {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? (process.argv[i + 1] ?? "").split(",").filter(Boolean) : [];
};

interface Answer {
  total?: number;
  quota_remaining?: number;
  quota_max?: number;
  backoff?: number;
  error_id?: number;
  error_name?: string;
  error_message?: string;
}

class QuotaSpent extends Error {}

async function search(phrase: string): Promise<Answer> {
  const url = `${API}?${new URLSearchParams({ site: "math", q: `"${phrase}"`, filter: FILTER })}`;
  let last: unknown = null;
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      const body = (await res.json()) as Answer;
      // 502 throttle_violation / 400 with quota spent: stop, do not retry.
      if (body.error_id === 502 || body.error_name === "throttle_violation" || (body.quota_remaining === 0 && body.total === undefined)) {
        throw new QuotaSpent(`${body.error_name ?? "quota"}: ${body.error_message ?? "quota_remaining 0"}`);
      }
      if (body.error_id !== undefined) throw new Error(`${body.error_id} ${body.error_name}: ${body.error_message}`);
      if (typeof body.total !== "number") throw new Error(`no total in ${JSON.stringify(body)}`);
      return body;
    } catch (err) {
      if (err instanceof QuotaSpent) throw err;
      last = err;
      if (attempt < RETRIES) await sleep(2000 * attempt);
    }
  }
  throw new Error(`"${phrase}": ${(last as Error)?.message ?? last}`);
}

async function main() {
  const countsPath = path.join(ROOT, "corpus", "counts.json");
  if (!fs.existsSync(countsPath)) {
    console.log("corpus/counts.json is missing - run `pnpm corpus:count` first.");
    process.exit(1);
  }
  const file = JSON.parse(fs.readFileSync(countsPath, "utf8")) as CountsFile;
  const counted = new Map(file.entries.filter((e) => e.collection === "phrases").map((e) => [e.id, e]));
  const only = new Set(argAfter("--ids"));
  const cache = loadMseCache();

  const wanted: { id: string; queries: string[] }[] = [];
  for (const entry of loadCollection("phrases")) {
    const record = entry.data as Record<string, unknown>;
    if (only.size && !only.has(entry.data.id)) continue;
    const group = phraseGroup(entry.data.id, record.situation as string);
    if (!MSE_GROUPS.includes(group)) continue;
    const c = counted.get(entry.data.id);
    if (!needsMse(group, c?.spoken ?? {}, sourceWeights(file.phraseSources?.[group] ?? {}))) continue;
    wanted.push({ id: entry.data.id, queries: candidatesOf("phrases", record).flatMap(mseQueries) });
  }
  const all = [...new Set(wanted.flatMap((w) => w.queries))];
  const todo = all.filter((q) => !cache[q]);
  console.log(`phrases that need Math Stack Exchange: ${wanted.length}; searches ${all.length}, cached ${all.length - todo.length}, to fetch ${todo.length}`);
  if (process.argv.includes("--dry")) {
    for (const w of wanted) console.log(`  ${w.id}: ${w.queries.map((q) => (cache[q] ? `${q}=${cache[q].total}` : `${q}=?`)).join(" ／ ")}`);
    return;
  }

  const today = localDate();
  let done = 0;
  let quota: number | undefined;
  const failed: string[] = [];
  for (const q of todo) {
    try {
      const a = await search(q);
      cache[q] = { total: a.total!, fetched: today };
      saveMseCache(cache);
      quota = a.quota_remaining;
      done++;
      process.stdout.write(`\r${done}/${todo.length}  quota ${quota ?? "?"}/${a.quota_max ?? "?"}   `);
      if (a.backoff) await sleep(a.backoff * 1000);
      else await sleep(GAP_MS);
      if (quota === 0) {
        console.log(`\nquota spent after ${done}/${todo.length}: stopped. Run again tomorrow; the cache keeps what was fetched.`);
        process.exit(2);
      }
    } catch (err) {
      if (err instanceof QuotaSpent) {
        console.log(`\n${err.message}: stopped at ${done}/${todo.length}. Run again tomorrow; the cache keeps what was fetched.`);
        process.exit(2);
      }
      failed.push(`${q}: ${(err as Error).message}`);
      done++;
      process.stdout.write(`\r${done}/${todo.length}  (failed ${failed.length})   `);
    }
  }
  console.log(`\nfetched ${todo.length - failed.length}/${todo.length}; quota left ${quota ?? "?"}`);
  if (failed.length) {
    console.log(`failed (${failed.length}), not cached - run again:\n  ${failed.join("\n  ")}`);
    process.exit(1);
  }
}

main();
