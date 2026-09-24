/**
 * PLAN.md 15, step 1 for every caption source: Khan Academy and the six
 * YouTube channels. The batch counterpart of fetch-captions.sh.
 *
 *   pnpm corpus:fetch:captions                        every configured source
 *   pnpm corpus:fetch:captions -- khan-ap-calc        one or more sources by id
 *
 * Like fetch-captions.sh this is run by hand, never by CI: collecting from
 * YouTube is the operator's decision. Requires yt-dlp. Only subtitles are
 * downloaded - never audio or video.
 *
 * Captions. Khan sources take human-made English captions only. Khan uploads
 * them under a named track ("en-ehkg1hFWq8A", English - Default) as well as
 * plain "en", so the language pattern takes en, en-US and en-<track id>. The
 * YouTube channels take human captions when a video has them and YouTube's
 * own English auto captions otherwise; the manifest marks each file auto:true
 * or auto:false (PLAN 15: auto captions misread formulas, so they are never
 * the only basis for a symbol reading). Machine translations into English
 * (en-bg, en-ko ...) are never read.
 *
 * Scope. Khan sources take every video of their playlists. A YouTube channel
 * takes the listed math playlists (or, for a channel without playlists, its
 * videos filtered by title and length) and keeps at most CHANNEL_CAP videos,
 * spread evenly over that list, so no channel dominates the fetch; the 25%
 * weight cap in decide.ts still applies on top.
 *
 * Every yt-dlp call has a socket timeout, a process timeout and a retry
 * limit; progress is printed as done/total, overall and per source. Results
 * are cached: video lists under corpus/<dir>/playlists/, captions as
 * corpus/<dir>/<video>.txt, and videos without usable captions in
 * corpus/<dir>/state.json, so a re-run only asks for what is missing. The
 * manifest is merged every MANIFEST_EVERY videos, so the counts can be run on
 * a partial fetch.
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
const CHANNEL_CAP = 100;
const HUMAN_LANGS = "en(-US|-[A-Za-z0-9_-]{11})?";
/**
 * Human tracks plus YouTube's English auto captions, first request. Plain "en"
 * is left out on purpose: for an auto-captioned video it is YouTube's
 * translated variant of the ASR track, which answers 429 under load, while
 * "en-orig" (the original ASR track) downloads fine. A human "en" track is
 * fetched by a second request, only when the video has one.
 */
const HUMAN_OR_AUTO_LANGS = "en-(US|GB|orig|[A-Za-z0-9_-]{11})";
/** Consecutive videos that fail even after retries before a source is stopped (rate limit: re-run later). */
const MAX_CONSECUTIVE_FAILURES = 3;
const HUMAN_KEY = /^en(-US|-GB|-[A-Za-z0-9_-]{11})?$/;

interface Source {
  id: string;
  /** Folder under corpus/. Differs from id only where the id has a colon. */
  dir: string;
  title: string;
  license: string;
  captions: "human" | "human-or-auto";
  playlists?: string[];
  /** A channel without playlists: its uploads, filtered. */
  channel?: { handle: string; match: RegExp; minSeconds: number };
  /** At most this many videos, spread evenly over the list. */
  cap?: number;
  /**
   * Captions fetched before files were named by video id were named by title
   * (yt-dlp "%(title).80B"). Such a file is renamed to <video>.txt instead of
   * being fetched again.
   */
  legacyNames?: boolean;
}

const KHAN_LICENSE = "CC BY-NC-SA";
const YT_LICENSE = "captions, counted as facts only";

const SOURCES: Source[] = [
  {
    id: "khan-algebra",
    dir: "khan-algebra",
    title: "Khan Academy Algebra",
    license: KHAN_LICENSE,
    captions: "human",
    legacyNames: true,
    playlists: [
      "PLSQl0a2vh4HCYMbX9nmPgDjZ8YWOVOmT7", // Algebra I | High School Math
      "PLSQl0a2vh4HCI6_FsC0_7Us0IwsZHQ7Tu", // Algebra II | High School Math
      "PLSQl0a2vh4HCnd_jI7E7IUcMasEgT6hpe", // Linear equations and inequalities | Algebra Basics
    ],
  },
  {
    id: "khan-ap-calc",
    dir: "khan-ap-calc",
    title: "Khan Academy AP Calculus",
    license: KHAN_LICENSE,
    captions: "human",
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
  {
    id: "khan-ap-stats",
    dir: "khan-ap-stats",
    title: "Khan Academy AP Statistics",
    license: KHAN_LICENSE,
    captions: "human",
    // Every AP Statistics unit playlist on the channel. Three units appear
    // twice (an older and a newer playlist); videos are fetched once by id.
    playlists: [
      "PLSQl0a2vh4HCcEEDH7-80YJgWDx3MD1e7", // Displaying and comparing quantitative data
      "PLSQl0a2vh4HAe6mF7lbA6GA-5R4-IPAmM", // Summarizing quantitative data
      "PLSQl0a2vh4HCvPg3_-L5LEF48Na-HZj58", // Summarizing quantitative data
      "PLSQl0a2vh4HAm53KxN8i1znSGPNxNTMhq", // Modeling data distributions
      "PLSQl0a2vh4HA8e1qvmOzBfmcpzCFqkxhP", // Exploring bivariate numerical data
      "PLSQl0a2vh4HBsIdl-7Ysh7haiTk-vDMDJ", // Exploring bivariate numerical data
      "PLSQl0a2vh4HA__gtkQQzr1dsl0n0hHP5w", // Study design
      "PLSQl0a2vh4HBN0ECD0oSSP1iG9XzfjNDm", // Study design
      "PLSQl0a2vh4HBklDDmyvFqK7LlLIbLl8JQ", // Analyzing categorical data
      "PLSQl0a2vh4HAwVM-oR3LWY_zdmDsXVfPn", // Random variables
      "PLSQl0a2vh4HBrMFHsJOEQLOKpfEAyYOAJ", // Sampling distributions
      "PLSQl0a2vh4HBNxqWanMyJobind_frsqzC", // Confidence intervals
      "PLSQl0a2vh4HDkZ6uqdJnOtFICy5_jX-0C", // Significance tests (hypothesis testing)
    ],
  },
  {
    id: "yt:profleonard",
    dir: "yt-profleonard",
    title: "Professor Leonard",
    license: YT_LICENSE,
    captions: "human-or-auto",
    cap: CHANNEL_CAP,
    // The channel has no playlists tab. Course lectures carry the course in the
    // title; announcements and shorts do not.
    channel: {
      handle: "ProfessorLeonard",
      match: /Calculus [123]|Intermediate Algebra|Pre-?calculus|Precaluclus|Statistics|Differential Equations/i,
      minSeconds: 600,
    },
  },
  {
    id: "yt:organicchem",
    dir: "yt-organicchem",
    title: "The Organic Chemistry Tutor",
    license: YT_LICENSE,
    captions: "human-or-auto",
    cap: CHANNEL_CAP,
    playlists: [
      "PL0o_zxa4K1BUeF2o-MlNpbRiS-oE2Kn6J", // New Algebra Playlist
      "PL0o_zxa4K1BVkRxCZubMPcCJ5Q5QwZdEM", // Geometry Video Playlist
      "PL0o_zxa4K1BVCB8iCVCGOES9pEF6byTMT", // New Trigonometry Playlist
      "PL0o_zxa4K1BU5sTWZ2YxFhpXwsnMfMke7", // New Precalculus Video Playlist
      "PL0o_zxa4K1BWYThyV4T2Allw6zY0jEumv", // New Calculus Video Playlist
      "PL0o_zxa4K1BXDMB9u4YU7CGq1PDNIXn7r", // Basic Integration
      "PL0o_zxa4K1BVsziIRdfv4Hl4UIqDZhXWV", // Statistics
    ],
  },
  {
    id: "yt:patrickjmt",
    dir: "yt-patrickjmt",
    title: "PatrickJMT",
    license: YT_LICENSE,
    captions: "human-or-auto",
    cap: CHANNEL_CAP,
    playlists: [
      "PL6CFAC6134E64B29B", // Linear Equations
      "PL4997BC748738CE54", // Linear Inequalities
      "PLC667783EF4C96BC9", // Absolute Value
      "PLE5D9EE572CDF2A2A", // Exponents
      "PL13F93BB7FFB4D731", // Polynomials: Introduction
      "PLD8CF85E686758097", // Polynomials : Factoring
      "PLF3430B50FCFA6805", // Polynomials: Finding Zeroes and More
      "PLFACC72B70062EB2D", // All about quadratic equations
      "PL53C3D67376C418BF", // Quadratic Equations: Word Problems
      "PLACB14EA21E2F13C0", // Quadratic Inequalities
      "PL3A9C41D9F515CC2F", // Solving Rational Equations
      "PLD0FC8343BA3E43D7", // Rational Inequalities
      "PL9F8908A958AF7DC9", // Functions : The basics
      "PLE7DF9515359493FD", // Piecewise Defined Functions
      "PL3B78F47A04C34EC0", // The Basics of Graphs
      "PL71AB9C761AC029D1", // Inverses of Functions
      "PL7DA48E186D1D8049", // Logarithms
      "PLDDDAA7E0D61A5CFA", // Conic Sections
      "PLANMHOrJaFxMaKxtJgZICR7IlstkLLWQ4", // Graphing the Trigonometric Functions
      "PLANMHOrJaFxM2UbRPM9YNQ1YT3s4gX4Rp", // Inverse Trigonometric Functions
      "PLDE077A2EC488104D", // Derivatives
      "PLDC0E2E78840869A5", // Related Rates
      "PLF1E94C1948483103", // Optimization Problems
      "PLECD6CD1B292B9015", // Integrals / Antiderivatives
      "PLANMHOrJaFxNMdSTu48JS0dmaybAddozV", // Review Problems for Calculus
      "PLANMHOrJaFxNi-nN4nGO3OKvg3c1WcQrM", // Statistics and Probability
    ],
  },
  {
    id: "yt:nancypi",
    dir: "yt-nancypi",
    title: "NancyPi",
    license: YT_LICENSE,
    captions: "human-or-auto",
    cap: CHANNEL_CAP,
    // A small channel of math explainers: every upload of two minutes or more.
    channel: { handle: "NancyPi", match: /./, minSeconds: 120 },
  },
  {
    id: "yt:blackpenredpen",
    dir: "yt-blackpenredpen",
    title: "blackpenredpen",
    license: YT_LICENSE,
    captions: "human-or-auto",
    cap: CHANNEL_CAP,
    // Course playlists only (algebra, trigonometry, Calculus 1-2, AP FRQs);
    // the "math for fun" and competition playlists are left out.
    playlists: [
      "PLj7p5OoL6vGxNBkDQ6n_fIOWGFTGjaQO7", // Algebra Basics
      "PLj7p5OoL6vGwh4_Y8yP64vIRIMn68XXXl", // Trigonometry Basics
      "PLj7p5OoL6vGztbg3te4S2UZgjRzKOirgM", // 10 Precalculus Practice Tests
      "PLj7p5OoL6vGxhgezGI5E_K4QfzqZNyRFH", // Sect 2.3, Evaluating Limits Algebraically
      "PLj7p5OoL6vGyEwC4y4drwe6azA_V30eJx", // Sect 2.5, Graph, Limits, & Continuity
      "PLj7p5OoL6vGxJybsnz7UpB_spK1hg41B8", // Sect 2.7, Definition of Derivative
      "PLj7p5OoL6vGwFOcE1SQpgOL5UMBTvSF5k", // Sect 2.8
      "PLj7p5OoL6vGwzCW5N_hyGa88BzGQHv1ax", // Epsilon-Delta definition of limits
      "PLj7p5OoL6vGw2aCCkAQRKrxx2ZV36i_Gh", // Sect 3.1
      "PLj7p5OoL6vGxw8aTibU4pbNhSPDsGsdZw", // Sect 3.2
      "PLj7p5OoL6vGx1MIo1krsa1Q-ty-MmJKC0", // Sect 3.3, Derivative of Trig Functions
      "PLj7p5OoL6vGxEprSkcOOCtGhZkYorYkSX", // Sect 3.4, Chain Rule
      "PLj7p5OoL6vGw3Qws3uRvsZSTRVdfOYgvH", // Sect 3.7, Applications of derivative
      "PLj7p5OoL6vGwfR4fzDBcBRodORMGfJcnF", // Sect 3.10
      "PLj7p5OoL6vGwr3gSAU-QfkzRRUKoppuRj", // Sect 4.2, The Mean Value Theorem
      "PLj7p5OoL6vGzoLeilee5w9RNElkn_qO65", // Sect 4.3, f, f' and f''
      "PLj7p5OoL6vGwLWpCYVVekN5knk3jmHZiR", // Sect 5.1
      "PLj7p5OoL6vGwf-GHBxqf9JiZV3FYYbaY2", // Sect 5.2, The Definite Integral
      "PLj7p5OoL6vGyhgDkgUgKsVUZQvdPS-_WB", // Calculus 2, Sect 7.1, Integration by Parts
      "PLj7p5OoL6vGyKrScQeswVIq5ud2Ui5wwX", // Trig Integrals, Calculus 2
      "PLj7p5OoL6vGwi8Fdeq-4ppvGmjx47a0Eo", // Trig Substitution, Calculus 2
      "PLj7p5OoL6vGz-m0ZabGCR3WIBAzjt14tD", // Integration by Partial Fractions, Calculus 2
      "PLj7p5OoL6vGyYgZTbOroGJl9X_5ycUsDn", // Approximate Integrals, Calculus 2
      "PLj7p5OoL6vGw2nOX-WKhevMoQ0nu8_ca8", // Improper Integrals, Calculus 2
      "PLj7p5OoL6vGydl8D8YP7IkVyMp1yueyRX", // L'Hospital's Rule, Calculus 2
      "PLj7p5OoL6vGy6e7TJc9xScMg89rSBYmpL", // Arc Length & Surface Area
      "PLj7p5OoL6vGyn7L8k1aC0TxDWI64JTdzA", // Sect 8.2 Surface Area
      "PLj7p5OoL6vGy9XJ7XYANbuG5Qxx27qYMJ", // Centroid, Calculus 2
      "PLj7p5OoL6vGzkmnXI5k-Z6Kn6wDDPpokz", // Sect 8.3 Centroid & Hydrostatic Force
      "PLj7p5OoL6vGx46ItdqVx0OZhDZfidThP7", // Work & Hydrostatic Force, Calculus 2
      "PLj7p5OoL6vGz8_2HEDjgLfCezt-Qz0OPO", // Introduction to Differential Equations, Calculus 2
      "PLj7p5OoL6vGzjK_yhJa00rhjoyKZ7JWUX", // Separable Differential Equations, Calculus 2
      "PLj7p5OoL6vGxiijbq1_eVHcdyj0jCI3Bm", // Parametric Equations, Calculus 2
      "PLj7p5OoL6vGyw7wS7oIJbVBS_3DKzBHib", // Polar Equations & Calculus
      "PLj7p5OoL6vGwIIlduXZWNm_Q9gDVU32wS", // Sequence, Calculus 2
      "PLj7p5OoL6vGy7EbKDcCzCMuH3H8WyXiVb", // Intro to Series, calculus 2
      "PLj7p5OoL6vGzm6mVGTl8jWMYoC4uOEwEz", // The Integral Test, Calculus 2
      "PLj7p5OoL6vGwZ8T4734RMWn2c3UZ23JVr", // Alternating Series & Absolute Convergence, Calculus 2
      "PLj7p5OoL6vGxCs-k6NMtKexC7mzfbK73Z", // Ratio & Root Tests, Calculus 2
      "PLj7p5OoL6vGy8LKfly0aBXA2Q2DlHUfhV", // Best Friend 1/(1-x) & Power Series, calculus 2
      "PLj7p5OoL6vGxu7ttFPCaOKZk9nII1ziZf", // Other Friends & Taylor Series, Calculus 2
      "PLj7p5OoL6vGzuzhYkqsR4_O3GIKe5-_29", // Hyperbolic Functions, Calculus 2
      "PLj7p5OoL6vGzbY7KkaFvvtacfcnXI2h9j", // AP Calculus Past FRQs
    ],
  },
  {
    id: "yt:3blue1brown",
    dir: "yt-3blue1brown",
    title: "3Blue1Brown",
    license: YT_LICENSE,
    captions: "human-or-auto",
    cap: CHANNEL_CAP,
    playlists: [
      "PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", // Essence of calculus
      "PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", // Essence of linear algebra
      "PLZHQObOWTQDNPOjrT6KVlfJuKtYTftqH6", // Differential equations
      "PLZHQObOWTQDOMxJDswBaLu8xBMKxSTvg8", // Central limit theorem
      "PLZHQObOWTQDOjmo3Y6ADm0ScWAlEXf-fp", // Probabilities of probabilities
      "PLZHQObOWTQDP5CVelJJ1bNDouqrAhVPev", // Lockdown math
    ],
  },
];

/** Videos that answered "no usable captions" or "unavailable": not asked again. */
interface State {
  nosubs: string[];
  unavailable: string[];
}

interface Video {
  id: string;
  title: string;
  seconds: number | null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const PERMANENT = /Video unavailable|Private video|has been removed|members-only|account associated|confirm your age/i;

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
    const text = line.replace(/<[^>]+>/g, "").trim();
    if (text) lines.push(text);
  }
  const deduped = lines.filter((l, i) => i === 0 || l !== lines[i - 1]);
  return deduped.join(" ").replace(/\s+/g, " ").trim();
}

/** The file name yt-dlp gave "-o %(title).80B.%(ext)s": 80 bytes of the title, then sanitised. */
export function legacyName(title: string): string {
  const cut = Buffer.from(title, "utf8").subarray(0, 80).toString("utf8").replace(/�+$/, "");
  return cut.replace(/\|/g, "｜").replace(/\//g, "⧸").replace(/:/g, "：").replace(/\?/g, "？").replace(/"/g, "＂");
}

/** At most `cap` items, spread evenly over the list (first item always kept). */
export function spread<T>(items: T[], cap: number | undefined): T[] {
  if (!cap || items.length <= cap) return items;
  return Array.from({ length: cap }, (_, i) => items[Math.floor((i * items.length) / cap)]);
}

/**
 * Merge entries into corpus/manifest.json. `renamed` maps an old file path to
 * the new one; the old entry is replaced in place so that manifest order
 * (which dedupe follows) does not change.
 */
function mergeManifest(entries: ManifestEntry[], renamed: Map<string, string> = new Map()) {
  const manifestPath = path.join(CORPUS, "manifest.json");
  // Re-read every time: another fetcher may be writing it too.
  const current: ManifestEntry[] = fs.existsSync(manifestPath)
    ? (JSON.parse(fs.readFileSync(manifestPath, "utf8")) as ManifestEntry[])
    : [];
  const byFile = new Map(entries.map((e) => [e.file, e]));
  const out: ManifestEntry[] = [];
  const placed = new Set<string>();
  for (const e of current) {
    const file = renamed.get(e.file) ?? e.file;
    if (placed.has(file)) continue;
    out.push(byFile.get(file) ?? e);
    placed.add(file);
  }
  for (const e of entries) if (!placed.has(e.file)) out.push(e);
  // Write-then-rename, so a concurrent reader never sees half a file.
  fs.writeFileSync(`${manifestPath}.${process.pid}`, JSON.stringify(out, null, 2) + "\n", "utf8");
  fs.renameSync(`${manifestPath}.${process.pid}`, manifestPath);
  return out.length;
}

/** "id\ttitle" (older cache) or "id\tseconds\ttitle". */
function parseList(tsv: string): Video[] {
  return tsv
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("\t");
      if (parts.length >= 3 && /^(\d+(\.\d+)?|NA)$/.test(parts[1])) {
        return { id: parts[0], seconds: parts[1] === "NA" ? null : Number(parts[1]), title: parts.slice(2).join("\t") };
      }
      return { id: parts[0], seconds: null, title: parts.slice(1).join("\t") };
    });
}

async function cachedList(file: string, url: string): Promise<Video[] | null> {
  if (!fs.existsSync(file)) {
    try {
      const tsv = (await ytdlp(["--flat-playlist", "--print", "%(id)s\t%(duration)s\t%(title)s", url])).stdout;
      fs.writeFileSync(file, tsv, "utf8");
    } catch (e) {
      console.log(`  ${url} not listed (${(e as Error).message}); re-run to list it`);
      return null;
    }
  }
  return parseList(fs.readFileSync(file, "utf8"));
}

async function listVideos(src: Source): Promise<{ videos: Video[]; failed: number; candidates: number }> {
  const dir = path.join(CORPUS, src.dir, "playlists");
  fs.mkdirSync(dir, { recursive: true });
  const seen = new Map<string, Video>(); // first playlist wins
  let failed = 0;
  const lists: [string, string][] = src.channel
    ? [[path.join(dir, "channel.tsv"), `https://www.youtube.com/@${src.channel.handle}/videos`]]
    : (src.playlists ?? []).map((pl) => [path.join(dir, `${pl}.tsv`), `https://www.youtube.com/playlist?list=${pl}`]);
  for (const [i, [file, url]] of lists.entries()) {
    const videos = await cachedList(file, url);
    if (videos === null) failed++;
    for (const v of videos ?? []) {
      if (seen.has(v.id)) continue;
      if (src.channel && !(src.channel.match.test(v.title) && (v.seconds ?? 0) >= src.channel.minSeconds)) continue;
      if (/^\[(Private|Deleted) video\]$/.test(v.title)) continue;
      seen.set(v.id, v);
    }
    console.log(`[captions] ${src.id} lists ${i + 1}/${lists.length}  (${seen.size} videos so far)`);
  }
  const all = [...seen.values()];
  return { videos: spread(all, src.cap), failed, candidates: all.length };
}

interface Progress {
  done: number;
  total: number;
}

async function fetchSource(src: Source, videos: Video[], overall: Progress, listFailed: number): Promise<number> {
  const dir = path.join(CORPUS, src.dir);
  const statePath = path.join(dir, "state.json");
  const state: State = fs.existsSync(statePath)
    ? (JSON.parse(fs.readFileSync(statePath, "utf8")) as State)
    : { nosubs: [], unavailable: [] };
  const skip = new Set([...state.nosubs, ...state.unavailable]);
  const saveState = () => fs.writeFileSync(statePath, JSON.stringify(state, null, 1) + "\n", "utf8");
  const autoPath = path.join(dir, "auto.json"); // video ids whose captions are YouTube auto captions
  const autoIds = new Set<string>(fs.existsSync(autoPath) ? (JSON.parse(fs.readFileSync(autoPath, "utf8")) as string[]) : []);
  const saveAuto = () => fs.writeFileSync(autoPath, JSON.stringify([...autoIds], null, 1) + "\n", "utf8");

  const entry = (v: Video): ManifestEntry => ({
    id: src.id,
    register: "spoken",
    auto: autoIds.has(v.id),
    file: path.join(src.dir, `${v.id}.txt`),
    title: `${src.title} - ${v.title.replace(/ \| Khan Academy$/, "")}`,
    license: src.license,
    url: `https://www.youtube.com/watch?v=${v.id}`,
  });

  const total = videos.length;
  const entries: ManifestEntry[] = [];
  const renamed = new Map<string, string>();
  let done = 0;
  let failed = listFailed;
  let cached = 0;
  let streak = 0;
  const vttDir = path.join(dir, "vtt");
  fs.mkdirSync(vttDir, { recursive: true });

  for (const v of videos) {
    if (streak >= MAX_CONSECUTIVE_FAILURES) {
      const left = total - done;
      failed += left;
      overall.total -= left;
      console.log(`  ${src.id}: ${streak} videos in a row failed - stopping this source, ${left} left for a re-run`);
      break;
    }
    const txt = path.join(dir, `${v.id}.txt`);
    const legacy = src.legacyNames ? path.join(dir, `${legacyName(v.title)}.txt`) : null;
    if (!fs.existsSync(txt) && legacy && fs.existsSync(legacy)) {
      fs.renameSync(legacy, txt);
      renamed.set(path.relative(CORPUS, legacy), path.relative(CORPUS, txt));
    }
    if (fs.existsSync(txt)) {
      cached++;
      entries.push(entry(v));
    } else if (!skip.has(v.id)) {
      try {
        const human = src.captions === "human";
        const { stdout } = await ytdlp([
          "--skip-download",
          ...(human
            ? ["--write-subs", "--sub-langs", HUMAN_LANGS]
            : ["--write-subs", "--write-auto-subs", "--sub-langs", HUMAN_OR_AUTO_LANGS, "--no-simulate", "-O", "%(subtitles)j"]),
          "--sub-format", "vtt",
          "-o", path.join(vttDir, "%(id)s.%(ext)s"), `https://www.youtube.com/watch?v=${v.id}`,
        ]);
        const listVtts = () => fs.readdirSync(vttDir).filter((f) => f.startsWith(`${v.id}.`) && f.endsWith(".vtt"));
        const lang = (f: string) => f.slice(v.id.length + 1, -".vtt".length);
        // Which of the downloaded tracks are human-made: yt-dlp prints the
        // video's (human) subtitle list; auto captions are not in it.
        let humanKeys: Set<string>;
        if (human) humanKeys = new Set(listVtts().map(lang));
        else {
          const printed = stdout.trim().split("\n").pop() ?? "NA";
          humanKeys = new Set(printed.startsWith("{") ? Object.keys(JSON.parse(printed) as object).filter((k) => HUMAN_KEY.test(k)) : []);
          if (humanKeys.has("en")) {
            await sleep(PAUSE_MS);
            await ytdlp(["--skip-download", "--write-subs", "--sub-langs", "en", "--sub-format", "vtt",
              "-o", path.join(vttDir, "%(id)s.%(ext)s"), `https://www.youtube.com/watch?v=${v.id}`]);
          }
        }
        const vtts = listVtts();
        // en before en-US before a named track; auto: the original ASR track first
        const byLen = (a: string, b: string) => a.length - b.length;
        const humanFile = vtts.filter((f) => humanKeys.has(lang(f))).sort(byLen)[0];
        const autoFile = human ? undefined : vtts.find((f) => lang(f) === "en-orig");
        const chosen = humanFile ?? autoFile;
        if (chosen) {
          fs.writeFileSync(txt, vttToText(fs.readFileSync(path.join(vttDir, chosen), "utf8")) + "\n", "utf8");
          if (!humanFile) {
            autoIds.add(v.id);
            saveAuto();
          }
          entries.push(entry(v));
        } else {
          state.nosubs.push(v.id);
          saveState();
        }
        for (const f of vtts) fs.rmSync(path.join(vttDir, f));
        streak = 0;
      } catch (e) {
        if ((e as { permanent?: boolean }).permanent) {
          state.unavailable.push(v.id);
          saveState();
        } else {
          failed++;
          streak++;
          console.log(`  ${v.id} skipped (${(e as Error).message}); re-run to fetch it`);
        }
      }
      await sleep(PAUSE_MS);
    }
    done++;
    overall.done++;
    const none = state.nosubs.length + state.unavailable.length;
    const auto = entries.filter((e) => e.auto).length;
    console.log(
      `[captions] ${overall.done}/${overall.total}  ${src.id} ${done}/${total}  (captions ${entries.length}: auto ${auto}, cached ${cached}; no captions ${none}, failed ${failed})`,
    );
    if (done % MANIFEST_EVERY === 0) mergeManifest(entries, renamed);
  }
  const size = mergeManifest(entries, renamed);
  if (renamed.size) console.log(`[captions] ${src.id}: ${renamed.size} title-named file(s) renamed to <video>.txt`);
  console.log(`[captions] ${src.id}: ${entries.length}/${total} videos with captions -> manifest ${size} file(s)`);
  return failed;
}

async function main() {
  const wanted = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  const sources = wanted.length ? SOURCES.filter((s) => wanted.includes(s.id)) : SOURCES;
  if (sources.length === 0 || sources.length < wanted.length) {
    console.log(`unknown source in: ${wanted.join(", ")}. Configured: ${SOURCES.map((s) => s.id).join(", ")}`);
    process.exit(1);
  }
  // List everything first so that progress can be shown against one total.
  const plans: { src: Source; videos: Video[]; failed: number }[] = [];
  for (const src of sources) {
    const { videos, failed, candidates } = await listVideos(src);
    plans.push({ src, videos, failed });
    const capped = candidates > videos.length ? ` (spread from ${candidates})` : "";
    console.log(`[captions] ${src.id}: ${videos.length} videos${capped}`);
  }
  const overall: Progress = { done: 0, total: plans.reduce((n, p) => n + p.videos.length, 0) };
  console.log(`[captions] ${overall.total} videos in ${plans.length} source(s)`);
  let failed = 0;
  for (const p of plans) failed += await fetchSource(p.src, p.videos, overall, p.failed);
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
