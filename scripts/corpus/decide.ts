/**
 * Steps 4-5 of PLAN.md 15: turn counts into decisions, write `evidence` back
 * into data/, and leave a report for the human review.
 *
 *   pnpm corpus:decide                report only
 *   pnpm corpus:decide -- --write     write evidence + flags into data/
 *
 * Three outcomes per register (see lib.ts): a single headword at 3:1 or
 * better, two or more wordings recorded side by side when none leads but each
 * clears the floor, or undecided.
 *
 * Ratios use WEIGHTED counts - each source is evened out to at most
 * max(25%, 1/n) of the corpus, so one lecturer cannot set the headword.
 * `evidence` stores the raw counts, because those are the facts; the
 * weighting is a reading of them.
 *
 * Only two things reach the human (the user's call on 2026-09-11):
 *   - undecided entries
 *   - entries where the corpus contradicts the register recorded in the data
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadAll, type Collection } from "../lib/load.js";
import {
  decide,
  flatten,
  headsOf,
  sameWording,
  sourceWeights,
  weigh,
  type Register,
  type Verdict,
} from "./lib.js";
import type { CountsFile } from "./count.js";

const WRITE = process.argv.includes("--write");
const TODAY = new Date().toISOString().slice(0, 10);
const CORPUS = path.join(ROOT, "corpus");
const COUNTED: Collection[] = ["terms", "symbols", "phrases"];

function describe(v: Verdict): string {
  if (v.kind === "single") {
    return `${v.head}（${v.ratio === Infinity ? "唯一" : `${v.ratio.toFixed(1)}:1`}）`;
  }
  if (v.kind === "both") {
    return v.heads.map((h, i) => `${h} ${Math.round(v.counts[i])}`).join(" ／ ");
  }
  return v.reason === "too-few"
    ? `判断不能: 重み付け後 ${v.total.toFixed(0)} 件（10 未満）`
    : "判断不能: 首位が 3 倍に届かず、次点も 10 件未満";
}

/**
 * The wordings the entry itself records at a given register. Used to spot the
 * case where the corpus says people use a wording the entry files elsewhere -
 * or does not file at all.
 */
function recordedAt(collection: Collection, data: Record<string, unknown>, register: Register): string[] {
  const out: string[] = [];

  if (collection === "terms") {
    const en = data.en as {
      term: string;
      alt?: string[];
      variants?: { term: string; register: string }[];
      register?: string;
    };
    const head = en.register ?? "both";
    if (head === register || head === "both") out.push(en.term, ...(en.alt ?? []));
    for (const v of en.variants ?? []) {
      if (v.register === register || v.register === "both") out.push(v.term);
    }
  } else if (collection === "symbols") {
    // "standard" is the neutral reading: it counts for both registers.
    for (const s of (data.spoken_en as { text: string; register: string }[]) ?? []) {
      if (s.register === "standard" || s.register === register) out.push(s.text);
    }
  } else {
    const isWritten = (r: string) => r === "written";
    const head = data.register as string;
    if (isWritten(head) === (register === "written")) out.push(data.en as string);
    for (const v of (data.variants as { en: string; register: string }[] | undefined) ?? []) {
      if (isWritten(v.register) === (register === "written")) out.push(v.en);
    }
  }
  return out;
}

interface Line {
  key: string;
  spoken: Verdict;
  written: Verdict;
  merges: { into: string; from: string[] }[];
  mismatch: string | null;
}

function main() {
  const countsPath = path.join(CORPUS, "counts.json");
  if (!fs.existsSync(countsPath)) {
    console.log("corpus/counts.json is missing - run `pnpm corpus:count` first.");
    return;
  }
  const file = JSON.parse(fs.readFileSync(countsPath, "utf8")) as CountsFile;
  const weights = sourceWeights(file.sources);

  const all = loadAll();
  const byId = new Map(COUNTED.flatMap((c) => all[c].map((e) => [`${c}/${e.data.id}`, e] as const)));

  const lines: Line[] = [];

  for (const c of file.entries) {
    const key = `${c.collection}/${c.id}`;
    const entry = byId.get(key);
    if (!entry) continue;
    const record = entry.data as unknown as Record<string, unknown>;

    const spoken = decide(weigh(c.spoken, weights), "spoken");
    const written = decide(weigh(c.written, weights), "written");

    // Contradiction: the corpus settled on a wording the entry does not file
    // at that register. Merging already folded inflection and ellipsis away,
    // so what is left is a real disagreement.
    const problems: string[] = [];
    for (const [register, verdict] of [
      ["spoken", spoken],
      ["written", written],
    ] as const) {
      const heads = headsOf(verdict);
      if (heads.length === 0) continue;
      const recorded = recordedAt(c.collection, record, register);
      const missing = heads.filter((h) => !recorded.some((r) => sameWording(r, h)));
      if (missing.length) {
        problems.push(`${register === "spoken" ? "話" : "書"}: ${missing.join(" / ")}`);
      }
    }
    const mismatch = problems.length ? problems.join(" ／ ") : null;

    lines.push({ key, spoken, written, merges: c.merges, mismatch });

    if (!WRITE) continue;

    record.evidence = {
      ...(Object.keys(c.spoken).length ? { spoken: flatten(c.spoken) } : {}),
      ...(Object.keys(c.written).length ? { written: flatten(c.written) } : {}),
      sources: c.sources,
      counted: file.counted,
    };

    const flags = ((record.flags as { code: string }[] | undefined) ?? []).filter(
      (f) => !f.code.startsWith("corpus-"),
    );
    if (spoken.kind === "undecided" && written.kind === "undecided") {
      flags.push({
        code: "corpus-undecided",
        note: `コーパスで決まらない（話: ${describe(spoken)} ／ 書: ${describe(written)}）。人間レビューへ。`,
        raised: TODAY,
      } as { code: string });
    }
    if (mismatch) {
      flags.push({
        code: "corpus-register-mismatch",
        note: `コーパスの結論がエントリの register と食い違う（${mismatch}）。人間レビューへ。`,
        raised: TODAY,
      } as { code: string });
    }
    if (c.collection === "symbols" && c.autoOnly) {
      flags.push({
        code: "corpus-auto-only",
        note: "根拠が自動字幕のみ。自動字幕は数式を誤認識するので、OCW の人手書き起こしで裏が取れるまで verified にしない（PLAN 15）。",
        raised: TODAY,
      } as { code: string });
    }
    if (flags.length) record.flags = flags;
    else delete record.flags;
    if (record.confidence === "verified" && flags.length) record.confidence = "likely";

    fs.writeFileSync(entry.file, JSON.stringify(record, null, 2) + "\n", "utf8");
  }

  // ------------------------------------------------------------- report ---
  const single = lines.filter((l) => l.spoken.kind === "single" || l.written.kind === "single");
  const both = lines.filter((l) => l.spoken.kind === "both" || l.written.kind === "both");
  const undecided = lines.filter((l) => l.spoken.kind === "undecided" && l.written.kind === "undecided");
  const mismatched = lines.filter((l) => l.mismatch);
  const merges = lines.filter((l) => l.merges.length);

  const totalWords = Object.values(file.sources).reduce((a, b) => a + b, 0) || 1;
  const weightRows = Object.entries(file.sources)
    .sort((a, b) => b[1] - a[1])
    .map(([id, w]) => {
      const raw = (w / totalWords) * 100;
      const eff = raw * (weights[id] ?? 1);
      return `| ${id} | ${w.toLocaleString()} | ${raw.toFixed(1)}% | ${eff.toFixed(1)}% | ×${(weights[id] ?? 1).toFixed(2)} |`;
    });

  const md = [
    `# コーパス集計 ${TODAY}`,
    "",
    `対象 ${lines.length} 件。主見出し決着 ${single.length} ／ 併記 ${both.length} ／ 判断不能 ${undecided.length} ／ register 不一致 ${mismatched.length}。`,
    "",
    "## ソースの重み",
    "",
    "1 ソースの寄与は max(25%, 1/ソース数) までに均す。拒否ではなく重み付けなので、OCW だけの状態でも回る。",
    "",
    "| ソース | 語数 | 生の比率 | 重み付け後 | 係数 |",
    "|---|---|---|---|---|",
    ...weightRows,
    "",
    "## ① 主見出しが決まったもの（3:1 以上）",
    "",
    single.length ? "| 項目 | 話し言葉 | 書き言葉 |\n|---|---|---|" : "なし。",
    ...single.map((l) => `| ${l.key} | ${describe(l.spoken)} | ${describe(l.written)} |`),
    "",
    "## ② 併記（首位が 3 倍に届かず、各 10 件以上。頻度順）",
    "",
    "どちらも実際に使われている。辞典が勝手に一方を選ぶとコーパスに無い好みを作ることになる。",
    "`en.variants` に頻度順で両方入れる。",
    "",
    both.length ? "| 項目 | 話し言葉 | 書き言葉 |\n|---|---|---|" : "なし。",
    ...both.map((l) => `| ${l.key} | ${describe(l.spoken)} | ${describe(l.written)} |`),
    "",
    "## 統合済み（語形変化・引数省略として見出し語に合算）",
    "",
    "別の語（integral / integrate / integration）は統合していない。合算した件数は落としていない。",
    "",
    merges.length ? "| 項目 | 合算先 | 合算した表記 |\n|---|---|---|" : "なし。",
    ...merges.flatMap((l) => l.merges.map((m) => `| ${l.key} | ${m.into} | ${m.from.join(" / ")} |`)),
    "",
    "---",
    "",
    "# 人間レビュー行き",
    "",
    "週 30 分で見るのはここだけ。",
    "",
    "## ③ コーパスで決まらないもの",
    "",
    undecided.length ? "| 項目 | 話し言葉 | 書き言葉 |\n|---|---|---|" : "なし。",
    ...undecided.map((l) => `| ${l.key} | ${describe(l.spoken)} | ${describe(l.written)} |`),
    "",
    "## register がエントリと食い違うもの",
    "",
    "コーパスが「その register で使われている」と言った表現を、エントリがその register に持っていない。",
    "",
    mismatched.length ? "| 項目 | 食い違い | コーパスの結論 |\n|---|---|---|" : "なし。",
    ...mismatched.map((l) => `| ${l.key} | ${l.mismatch} | 話 ${describe(l.spoken)} ／ 書 ${describe(l.written)} |`),
    "",
    "## 辞典に無い高頻度表現",
    "",
    "（未実装。PLAN 15 step 5 の副産物。Phase 2 で n-gram 抽出を足す）",
    "",
  ].join("\n");

  fs.mkdirSync(path.join(ROOT, "audits"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "audits", `corpus-${TODAY}.md`), md, "utf8");

  console.log(
    `sources ${Object.keys(file.sources).length}: ${Object.entries(weights)
      .map(([k, v]) => `${k} x${v.toFixed(2)}`)
      .join(", ")}`,
  );
  console.log(
    `single ${single.length}, both ${both.length}, undecided ${undecided.length}, mismatch ${mismatched.length}, merges ${merges.length}`,
  );
  console.log(`report -> audits/corpus-${TODAY}.md`);
  if (!WRITE) console.log("run with --write to record evidence and flags in data/");
}

main();
