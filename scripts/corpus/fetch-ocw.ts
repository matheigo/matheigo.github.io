/**
 * PLAN.md 15, step 1 for MIT OCW only.
 *
 * OCW distributes hand-made caption files (.vtt) for its lecture and
 * recitation videos under CC BY-NC-SA, straight off its own servers, so
 * gathering them is a plain download and is automated here. YouTube and Khan
 * captions are a different matter - terms of service and a separate tool - and
 * stay manual: see scripts/corpus/fetch-captions.sh.
 *
 *   pnpm corpus:fetch:ocw                     all configured courses
 *   pnpm corpus:fetch:ocw -- --course mit-18.01
 *   pnpm corpus:fetch:ocw -- --course mit-18.01 --limit 20
 *
 * Writes corpus/<id>/<name>.txt and merges corpus/manifest.json.
 * corpus/ is gitignored: transcript text never enters the repository.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "../lib/load.js";
import type { ManifestEntry } from "./fetch.js";

const BASE = "https://ocw.mit.edu";
const CORPUS = path.join(ROOT, "corpus");
const UA = "MathEigo corpus builder (CC0 dictionary project; contact via GitHub issues)";

interface Course {
  id: string;
  slug: string;
  title: string;
}

const COURSES: Course[] = [
  { id: "mit-18.01", slug: "18-01sc-single-variable-calculus-fall-2010", title: "MIT OCW 18.01SC Single Variable Calculus" },
  { id: "mit-18.02", slug: "18-02sc-multivariable-calculus-fall-2010", title: "MIT OCW 18.02SC Multivariable Calculus" },
  { id: "mit-18.06", slug: "18-06-linear-algebra-spring-2010", title: "MIT OCW 18.06 Linear Algebra" },
  { id: "mit-18.03", slug: "18-03sc-differential-equations-fall-2011", title: "MIT OCW 18.03SC Differential Equations" },
  { id: "mit-6.042", slug: "6-042j-mathematics-for-computer-science-fall-2010", title: "MIT OCW 6.042J Mathematics for Computer Science" },
];

const arg = (name: string): string | null => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? (process.argv[i + 1] ?? null) : null;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function get(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/**
 * Every page of the course, from its own sitemap. OCW publishes one per
 * course at /courses/<slug>/sitemap.xml, which lists resource pages that the
 * navigation does not always link to server-side (18.06 hangs its video
 * pages off /resources/ and renders the index with JavaScript). Falls back to
 * crawling /pages/ if a course has no sitemap.
 */
async function discover(slug: string): Promise<string[]> {
  const root = `${BASE}/courses/${slug}`;
  const vttRe = /[0-9a-f]{16,40}_[A-Za-z0-9_-]+\.vtt/g;
  const vtts = new Set<string>();

  let urls: string[] = [];
  const sitemap = await get(`${root}/sitemap.xml`);
  if (sitemap) {
    urls = [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)]
      .map((m) => m[1])
      .filter((u) => u.startsWith(root));
  }

  if (urls.length === 0) {
    // no sitemap: walk /pages/ and /resources/ instead
    const seen = new Set([`${root}/`, `${root}/pages/`]);
    const queue = [`${root}/`, `${root}/pages/`];
    const pageRe = new RegExp(`href="(/courses/${slug}/(?:pages|resources)/[^"]*)"`, "g");
    while (queue.length) {
      const batch = queue.splice(0, 6);
      for (const html of await Promise.all(batch.map(get))) {
        if (!html) continue;
        for (const m of html.matchAll(vttRe)) vtts.add(`${root}/${m[0]}`);
        for (const m of html.matchAll(pageRe)) {
          const next = `${BASE}${m[1].endsWith("/") ? m[1] : m[1] + "/"}`;
          if (!seen.has(next)) {
            seen.add(next);
            queue.push(next);
          }
        }
      }
      await sleep(150);
    }
    process.stdout.write(`\r  crawled ${seen.size} page(s), found ${vtts.size} transcript(s)\n`);
    return [...vtts].sort();
  }

  for (let i = 0; i < urls.length; i += 6) {
    for (const html of await Promise.all(urls.slice(i, i + 6).map(get))) {
      if (!html) continue;
      for (const m of html.matchAll(vttRe)) vtts.add(`${root}/${m[0]}`);
    }
    process.stdout.write(`\r  scanned ${Math.min(i + 6, urls.length)}/${urls.length} page(s), found ${vtts.size} transcript(s)`);
    await sleep(120);
  }
  process.stdout.write("\n");
  return [...vtts].sort();
}

/** WEBVTT to running prose. OCW hard-wraps mid-sentence, so lines are joined. */
export function vttToText(vtt: string): string {
  const out: string[] = [];
  for (const raw of vtt.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line === "WEBVTT") continue;
    if (line.includes("-->")) continue;
    if (/^\d+$/.test(line)) continue;
    if (/^(NOTE|STYLE|REGION)\b/.test(line)) continue;
    out.push(line.replace(/^[A-Z][A-Z ]{2,}:\s*/, "")); // PROFESSOR:, AUDIENCE:
  }
  return out.join(" ").replace(/\s+/g, " ").trim();
}

async function fetchCourse(course: Course, limit: number | null): Promise<ManifestEntry[]> {
  console.log(`\n${course.id}  ${course.title}`);
  let urls = await discover(course.slug);
  if (urls.length === 0) {
    console.log("  no transcripts found - the course slug may have changed");
    return [];
  }
  if (limit) urls = urls.slice(0, limit);

  const dir = path.join(CORPUS, course.id);
  fs.mkdirSync(dir, { recursive: true });
  const entries: ManifestEntry[] = [];
  let words = 0;

  for (const [i, url] of urls.entries()) {
    const name = url.split("/").pop()!.replace(/\.vtt$/, "").replace(/^[0-9a-f]+_/, "");
    const file = path.join(dir, `${name}.txt`);
    if (!fs.existsSync(file)) {
      const vtt = await get(url);
      if (!vtt) continue;
      fs.writeFileSync(file, vttToText(vtt), "utf8");
      await sleep(120);
    }
    words += fs.readFileSync(file, "utf8").split(/\s+/).filter(Boolean).length;
    entries.push({
      id: course.id,
      register: "spoken",
      auto: false, // OCW captions are made by hand - the reason symbols may rely on them
      file: path.relative(CORPUS, file),
      title: `${course.title} - ${name}`,
      license: "CC BY-NC-SA 4.0",
      url,
    });
    if ((i + 1) % 25 === 0) process.stdout.write(`\r  downloaded ${i + 1}/${urls.length}`);
  }
  console.log(`\r  ${entries.length} transcript(s), ${words.toLocaleString()} words`);
  return entries;
}

async function main() {
  const only = arg("course");
  const limitRaw = arg("limit");
  const limit = limitRaw ? Number(limitRaw) : null;
  const courses = only ? COURSES.filter((c) => c.id === only) : COURSES;
  if (courses.length === 0) {
    console.error(`unknown course "${only}". Known: ${COURSES.map((c) => c.id).join(", ")}`);
    process.exit(1);
  }

  fs.mkdirSync(CORPUS, { recursive: true });
  const manifestPath = path.join(CORPUS, "manifest.json");
  const existing: ManifestEntry[] = fs.existsSync(manifestPath)
    ? (JSON.parse(fs.readFileSync(manifestPath, "utf8")) as ManifestEntry[])
    : [];

  const fresh: ManifestEntry[] = [];
  for (const c of courses) fresh.push(...(await fetchCourse(c, limit)));

  const merged = new Map(existing.map((e) => [e.file, e]));
  for (const e of fresh) merged.set(e.file, e);
  fs.writeFileSync(manifestPath, JSON.stringify([...merged.values()], null, 2) + "\n", "utf8");

  console.log(`\nmanifest: ${merged.size} file(s) -> corpus/manifest.json`);
  console.log("next: pnpm corpus:count && pnpm corpus:decide");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
