/**
 * Stage 2 of the QA in PLAN.md 8: cross-checking against outside sources.
 *
 * For every entry whose `sources` contains a `wikipedia-langlink`, ask the
 * MediaWiki API for the real ja -> en language link and compare it with the
 * claimed English title. Mismatches are reported and, with --write, recorded
 * as `flags` on the entry so it cannot be promoted to `verified`.
 *
 *   pnpm crosscheck            report only
 *   pnpm crosscheck -- --write write flags back into data/
 *
 * Nothing is copied from Wikipedia; only titles are compared.
 */
import fs from "node:fs";
import { loadAll, type LoadedEntry } from "./lib/load.js";

const WRITE = process.argv.includes("--write");
const API = "https://ja.wikipedia.org/w/api.php";
const TODAY = new Date().toISOString().slice(0, 10);

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

async function enTitleOf(
  jaTitle: string,
): Promise<{ title: string | null; redirectedTo?: string }> {
  const url =
    `${API}?action=query&prop=langlinks&lllang=en&redirects=1&format=json&formatversion=2` +
    `&titles=${encodeURIComponent(jaTitle)}&origin=*`;
  const res = await fetch(url, {
    headers: { "User-Agent": "MathEigo crosscheck (CC0 dataset)" },
  });
  if (!res.ok) throw new Error(`MediaWiki API ${res.status}`);
  const json = (await res.json()) as {
    query?: {
      redirects?: { from: string; to: string }[];
      pages?: { missing?: boolean; langlinks?: { title: string }[] }[];
    };
  };
  const page = json.query?.pages?.[0];
  const redirectedTo = json.query?.redirects?.[0]?.to;
  if (!page || page.missing) return { title: null, redirectedTo };
  return { title: page.langlinks?.[0]?.title ?? null, redirectedTo };
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

  for (const entry of targets) {
    const src = ((entry.data.sources as LangSource[]) ?? []).find(
      (s) => s.type === "wikipedia-langlink",
    )!;
    const claimedJa = src.ja ?? (entry.data.ja as { term: string } | undefined)?.term ?? "";
    const claimedEn = src.en ?? (entry.data.en as { term: string } | undefined)?.term ?? "";
    const label = `${entry.collection}/${entry.stem}`;

    try {
      const { title, redirectedTo } = await enTitleOf(claimedJa);
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
    } catch (e) {
      console.log(`  skip  ${label}  ${(e as Error).message}`);
    }
    await new Promise((r) => setTimeout(r, 200)); // be polite to the API
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
