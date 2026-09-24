/**
 * PLAN.md 15, step 1 for caption sources configured as playlist lists
 * (Khan Academy). The batch counterpart of fetch-captions.sh.
 *
 *   pnpm corpus:fetch:captions -- khan-ap-calc
 *
 * Like fetch-captions.sh this is run by hand, never by CI: collecting from
 * YouTube is the operator's decision. Requires yt-dlp. Only subtitles are
 * downloaded - never audio or video.
 *
 * Human-made English captions only. Khan uploads them under a named track
 * ("en-ehkg1hFWq8A", English - Default) as well as plain "en", so the
 * language pattern takes en, en-US and en-<track id>. Auto captions and their
 * machine translations (en-bg, en-ko ...) live in a different list that
 * --write-subs never reads.
 *
 * Every yt-dlp call has a socket timeout, a process timeout and a retry
 * limit; progress is printed as done/total. Results are cached: playlists
 * under corpus/<id>/playlists/, captions as corpus/<id>/<video>.txt, and
 * videos without human captions in corpus/<id>/state.json, so a re-run only
 * asks for what is missing. The manifest is merged every MANIFEST_EVERY
 * videos, so the counts can be run on a partial fetch.
 */
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { ROOT } from "../lib/load.js";
import type { ManifestEntry } from "./fetch.js";

const run = promisify(execFile);
const CORPUS = path.join(ROOT, "corpus");
const SOCKET_TIMEOUT_S = 30;
const PROCESS_TIMEOUT_MS = 120_000;
const MAX_RETRY = 3;
const PAUSE_MS = 1_500;
const MANIFEST_EVERY = 25;
const SUB_LANGS = "en(-US|-[A-Za-z0-9_-]{11})?";

interface Source {
  id: string;
  title: string;
  license: string;
  playlists: string[];
}

const SOURCES: Source[] = [
  {
    id: "khan-ap-calc",
    title: "Khan Academy AP Calculus",
    license: "CC BY-NC-SA",
    // Every unit playlist of AP Calculus AB and BC on the Khan Academy channel.
    // BC repeats most AB videos; videos are fetched once by id.
    playlists: [
      "PLSQl0a2vh4HBxF5ogRo056-5Ef6duqh7n", // AB Limits and continuity
      "PLSQl0a2vh4HDNbLOtJbydGnZg0IZ7XLvV", // AB Derivatives introduction
      "PLSQl0a2vh4HBY0-BZOePhgg46abJ9iVYS", // AB Derivative rules
      "PLSQl0a2vh4HC-Fe6iDWn_eEHvW54E6SiM", // AB Differentiation: composite, implicit, and inverse functions
      "PLSQl0a2vh4HAxQsy9JC2Q199_NG0O_uGQ", // AB Advanced derivatives
      "PLSQl0a2vh4HDV4laENr1vNSfieh9JM2X6", // AB Contextual applications of differentiation
      "PLSQl0a2vh4HCtyDCGGa8-ds6b5ZRDP-Q7", // AB Existence theorems
      "PLSQl0a2vh4HD912PzvD-6F-vUl4MH1CLE", // AB Using derivatives to analyze functions
      "PLSQl0a2vh4HDO1-bLXAybU8xDazLGUnlU", // AB Applying derivatives to analyze functions
      "PLSQl0a2vh4HBZCG7kSoYbhsO_aFGasc3m", // AB Applications of derivatives
      "PLSQl0a2vh4HAT3WMejcb8SdWNeFC8rn6w", // AB Accumulation and Riemann sums
      "PLSQl0a2vh4HDs4GWlrzkl2hGp2uQk-TK5", // AB Antiderivatives and the fundamental theorem of calculus
      "PLSQl0a2vh4HBi4W3BcQ1VT9CbFEFcy0BI", // AB Applications of integration
      "PLSQl0a2vh4HDACpg7HiuCiiVoB3CZs1lq", // AB Differential equations
      "PLSQl0a2vh4HDi52jSWjkqskCtXyL09gk1", // AB Applications of definite integrals
      "PLSQl0a2vh4HBq1h1BRx4N11B0DlMI5yef", // AB solved exams
      "PLSQl0a2vh4HBReS9_V4QYOnqP2aguahxS", // BC Limits and continuity
      "PLSQl0a2vh4HC7bLF725m1zVhr4Wc61Qcn", // BC Advanced derivatives
      "PLSQl0a2vh4HAjRrIJ95UZ7KRUygIioqQY", // BC Applications of derivatives
      "PLSQl0a2vh4HCF6n9DhNVgQsYpCyNiwI41", // BC Integration and accumulation of change
      "PLSQl0a2vh4HDK8YxxqCvRVpl10aISqXeL", // BC Antiderivatives and the fundamental theorem of calculus
      "PLSQl0a2vh4HA3rBfCvZPsEREvCkSSalfg", // BC Differential equations
      "PLSQl0a2vh4HASC0hzF_lPzX9_QMQJ-zxx", // BC Applications of definite integrals
      "PLSQl0a2vh4HDe1hn9KwPKKhzVOXeR_SeO", // BC Series
      "PLSQl0a2vh4HD3ptvg4rRVjEAPbd-IY2iS", // BC solved exams
    ],
  },
];

/** Videos that answered "no human English captions" or "unavailable": not asked again. */
interface State {
  nosubs: string[];
  unavailable: string[];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const PERMANENT = /Video unavailable|Private video|has been removed|members-only|account associated/i;

/** yt-dlp with a process timeout and at most MAX_RETRY retries. */
async function ytdlp(args: string[]): Promise<{ stdout: string; stderr: string }> {
  let last = "";
  for (let attempt = 0; attempt <= MAX_RETRY; attempt++) {
    try {
      return await run("yt-dlp", ["--no-update", "--socket-timeout", String(SOCKET_TIMEOUT_S), "--retries", "3", ...args], {
        timeout: PROCESS_TIMEOUT_MS,
        maxBuffer: 64 * 1024 * 1024,
      });
    } catch (e) {
      const err = e as { stderr?: string; killed?: boolean; message: string };
      last = err.killed ? `timed out after ${PROCESS_TIMEOUT_MS / 1000}s` : (err.stderr || err.message).trim().split("\n").pop()!;
      if (PERMANENT.test(err.stderr ?? "")) throw Object.assign(new Error(last), { permanent: true });
    }
    if (attempt < MAX_RETRY) {
      const wait = (/429|Too Many Requests/.test(last) ? 60_000 : 5_000) * (attempt + 1);
      console.log(`  retry ${attempt + 1}/${MAX_RETRY} in ${wait / 1000}s: ${last}`);
      await sleep(wait);
    }
  }
  throw new Error(`gave up after ${MAX_RETRY} retries: ${last}`);
}

/** Same treatment as fetch-captions.sh: cues only, tags stripped, rolling repeats dropped. */
export function vttToText(vtt: string): string {
  const lines: string[] = [];
  for (const raw of vtt.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line === "WEBVTT" || line.includes("-->")) continue;
    if (/^\d+$/.test(line) || /^(NOTE|STYLE|REGION|Kind:|Language:)/.test(line)) continue;
    lines.push(line.replace(/<[^>]+>/g, ""));
  }
  const deduped = lines.filter((l, i) => i === 0 || l !== lines[i - 1]);
  return deduped.join(" ").replace(/\s+/g, " ").trim();
}

function mergeManifest(entries: ManifestEntry[]) {
  const manifestPath = path.join(CORPUS, "manifest.json");
  // Re-read every time: another fetcher may be writing it too.
  const current: ManifestEntry[] = fs.existsSync(manifestPath)
    ? (JSON.parse(fs.readFileSync(manifestPath, "utf8")) as ManifestEntry[])
    : [];
  const merged = new Map(current.map((e) => [e.file, e]));
  for (const e of entries) merged.set(e.file, e);
  fs.writeFileSync(manifestPath, JSON.stringify([...merged.values()], null, 2) + "\n", "utf8");
  return merged.size;
}

async function listVideos(src: Source, dir: string): Promise<{ videos: Map<string, string>; failed: number }> {
  const videos = new Map<string, string>(); // id -> title, first playlist wins
  let failed = 0;
  fs.mkdirSync(path.join(dir, "playlists"), { recursive: true });
  for (const [i, pl] of src.playlists.entries()) {
    const file = path.join(dir, "playlists", `${pl}.tsv`);
    let tsv: string | null = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
    if (tsv === null) {
      try {
        tsv = (await ytdlp(["--flat-playlist", "--print", "%(id)s\t%(title)s", `https://www.youtube.com/playlist?list=${pl}`])).stdout;
        fs.writeFileSync(file, tsv, "utf8");
      } catch (e) {
        failed++;
        console.log(`  playlist ${pl} skipped (${(e as Error).message}); re-run to list it`);
      }
    }
    for (const line of (tsv ?? "").split("\n").filter(Boolean)) {
      const [id, ...title] = line.split("\t");
      if (!videos.has(id)) videos.set(id, title.join("\t"));
    }
    console.log(`[captions] ${src.id} playlists ${i + 1}/${src.playlists.length}  (${videos.size} videos so far)`);
  }
  return { videos, failed };
}

async function fetchSource(src: Source): Promise<number> {
  const dir = path.join(CORPUS, src.id);
  const statePath = path.join(dir, "state.json");
  const listed = await listVideos(src, dir);
  const state: State = fs.existsSync(statePath)
    ? (JSON.parse(fs.readFileSync(statePath, "utf8")) as State)
    : { nosubs: [], unavailable: [] };
  const skip = new Set([...state.nosubs, ...state.unavailable]);
  const saveState = () => fs.writeFileSync(statePath, JSON.stringify(state, null, 1) + "\n", "utf8");

  const entry = (id: string, title: string): ManifestEntry => ({
    id: src.id,
    register: "spoken",
    auto: false,
    file: path.join(src.id, `${id}.txt`),
    title: `${src.title} - ${title.replace(/ \| Khan Academy$/, "")}`,
    license: src.license,
    url: `https://www.youtube.com/watch?v=${id}`,
  });

  const total = listed.videos.size;
  const entries: ManifestEntry[] = [];
  let done = 0;
  let failed = listed.failed;
  const vttDir = path.join(dir, "vtt");
  fs.mkdirSync(vttDir, { recursive: true });

  for (const [id, title] of listed.videos) {
    const txt = path.join(dir, `${id}.txt`);
    if (fs.existsSync(txt)) {
      entries.push(entry(id, title));
    } else if (!skip.has(id)) {
      try {
        await ytdlp([
          "--skip-download", "--write-subs", "--sub-langs", SUB_LANGS, "--sub-format", "vtt",
          "-o", path.join(vttDir, "%(id)s.%(ext)s"), `https://www.youtube.com/watch?v=${id}`,
        ]);
        // en before en-US before a named track, when a video has more than one
        const vtts = fs.readdirSync(vttDir).filter((f) => f.startsWith(`${id}.`) && f.endsWith(".vtt")).sort((a, b) => a.length - b.length);
        if (vtts.length) {
          fs.writeFileSync(txt, vttToText(fs.readFileSync(path.join(vttDir, vtts[0]), "utf8")) + "\n", "utf8");
          entries.push(entry(id, title));
        } else {
          state.nosubs.push(id);
          saveState();
        }
        for (const f of vtts) fs.rmSync(path.join(vttDir, f));
      } catch (e) {
        if ((e as { permanent?: boolean }).permanent) {
          state.unavailable.push(id);
          saveState();
        } else {
          failed++;
          console.log(`  ${id} skipped (${(e as Error).message}); re-run to fetch it`);
        }
      }
      await sleep(PAUSE_MS);
    }
    done++;
    const none = state.nosubs.length + state.unavailable.length;
    console.log(`[captions] ${src.id} ${done}/${total}  (captions ${entries.length}, no human captions ${none}, failed ${failed})`);
    if (done % MANIFEST_EVERY === 0) mergeManifest(entries);
  }
  const size = mergeManifest(entries);
  console.log(`[captions] ${src.id}: ${entries.length}/${total} videos with human English captions -> manifest ${size} file(s)`);
  return failed;
}

async function main() {
  const wanted = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  const sources = wanted.length ? SOURCES.filter((s) => wanted.includes(s.id)) : SOURCES;
  if (sources.length === 0) {
    console.log(`unknown source: ${wanted.join(", ")}. Configured: ${SOURCES.map((s) => s.id).join(", ")}`);
    process.exit(1);
  }
  let failed = 0;
  for (const s of sources) failed += await fetchSource(s);
  if (failed) {
    console.log(`[captions] ${failed} item(s) not fetched - re-run to fill the gaps`);
    process.exit(1);
  }
  console.log("[captions] done");
}

main().catch((e) => {
  console.error(`[captions] failed: ${(e as Error).message}`);
  process.exit(1);
});
