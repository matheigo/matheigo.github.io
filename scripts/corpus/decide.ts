/**
 * Steps 4-5 of PLAN.md 15: turn counts into decisions, write `evidence` back
 * into data/, and leave a report for the human review.
 *
 *   pnpm corpus:decide                report only
 *   pnpm corpus:decide -- --write     write evidence + flags into data/
 *   pnpm corpus:decide -- --write --units jp-suugaku-3-sekibun,us-calculus-1-integration
 *                                     write only the terms of those curriculum
 *                                     units (their term_refs); --ids symbols/x,terms/y
 *                                     adds entries by collection/id. The report
 *                                     still covers every entry.
 *
 * Three outcomes per register (see lib.ts): a single headword at 3:1 or
 * better, two or more wordings recorded side by side when none leads but each
 * clears the floor, or undecided.
 *
 * Ratios use WEIGHTED counts - each source is evened out to at most
 * max(25%, 1/n) of the corpus, so one lecturer cannot set the headword.
 * On top of that, a leader that loses its verdict when its biggest source is
 * taken out is set side by side with the rest (② instead of ①; lib.ts
 * decideRobust), and the report says which source it rested on.
 * `evidence` stores the raw counts, because those are the facts; the
 * weighting is a reading of them.
 *
 * Symbols are readings aloud, so their written verdict is "対象外" (out of
 * scope): it is not judged and raises no flag (DECISIONS 修正 4).
 *
 * An entry undecided in both registers (③) is settled further where it can be
 * (lib.ts settleUndecided, DECISIONS Phase 2 規則の修正):
 *   - mapping near / none and fewer than 10 hits in each register: English has
 *     no set way to say it (corpus-no-fixed-expression). Not for the human
 *   - otherwise the headword is what the CEDs (AP Calculus / AP Statistics),
 *     failing that OpenStax, IM or CK-12 (one tier), failing that Nicholson / Levin
 *     call it, failing that the English Wikipedia article's name
 *     (corpus-reference-fallback). No register is claimed
 *
 * Only two things reach the human (the user's call on 2026-09-11):
 *   - undecided entries that neither reference names (corpus-undecided),
 *     unless the human has already settled the headword. That mark is the
 *     flag corpus-human-settled, written by hand with the date and the
 *     DECISIONS line in its note; decide keeps it as it is and does not send
 *     the entry back. reviewed.human is not used for this: it marks a human
 *     review of the whole entry (the ground for verified in Phase 5)
 *   - entries where the corpus contradicts the register recorded in the data
 *
 * A spoken leader that rests on one source does not set the headword against
 * the written corpus or a CED (lib.ts spokenLeanHead, DECISIONS Phase 2 中学の
 * 単元 2 の前の修正 3): the headword is the written / CED wording and the
 * spoken leader a spoken variant. decide lists what the entry must change.
 */
import fs from "node:fs";
import path from "node:path";
import { isProblemFlag } from "../lib/flags.js";
import { ROOT, loadAll, localDate, type Collection } from "../lib/load.js";
import {
  candidatesOf,
  countedAs,
  decideRobust,
  emptyReference,
  flatten,
  headsOf,
  sameWording,
  settleUndecided,
  sourceWeights,
  spokenLeanHead,
  type LeanHead,
  type Register,
  type Settled,
  type Verdict,
} from "./lib.js";
import type { CountsFile, EntryCounts } from "./count.js";

const WRITE = process.argv.includes("--write");
const argAfter = (flag: string) => {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? (process.argv[i + 1] ?? "").split(",").filter(Boolean) : [];
};
const UNITS = argAfter("--units");
const IDS = argAfter("--ids");
const TODAY = localDate();
const CORPUS = path.join(ROOT, "corpus");
const COUNTED: Collection[] = ["terms", "symbols", "phrases"];

/** null: the register is out of scope for the entry (symbols, written). */
function describe(v: Verdict | null): string {
  if (v === null) return "対象外";
  const rest = (d: NonNullable<Extract<Verdict, { kind: "single" }>["dependsOn"]>) =>
    `（首位の ${d.of} 件中 ${d.hits} 件が ${d.source}。抜くと ${describe(d.without)}）`;
  if (v.kind === "single") {
    const ratio = v.ratio === Infinity ? "唯一" : `${v.ratio.toFixed(1)}:1`;
    const base = `${v.head}（${v.byFloor ? `${ratio}、首位だけが 10 件以上。次点 ${v.runnerUp} は少数` : ratio}）`;
    return v.dependsOn ? `${base} ${rest(v.dependsOn)}` : base;
  }
  if (v.kind === "both") {
    const base = v.heads.map((h, i) => `${h} ${Math.round(v.counts[i])}`).join(" ／ ");
    const mark = v.demoted ? "①→② " : "";
    return v.dependsOn ? `${mark}${base} ${rest(v.dependsOn)}` : base;
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
    // A generic word counted in a form (lib.ts TERM_FORMS) is compared as that form.
    const as = (w: string) => countedAs(collection, data.id as string, w);
    const head = en.register ?? "both";
    if (head === register || head === "both") out.push(...[en.term, ...(en.alt ?? [])].map(as));
    for (const v of en.variants ?? []) {
      if (v.register === register || v.register === "both") out.push(as(v.term));
    }
  } else if (collection === "symbols") {
    // "standard" is the neutral reading: it counts for both registers.
    // A reading counted as a pattern is compared as that pattern.
    for (const s of (data.spoken_en as { text: string; register: string }[]) ?? []) {
      if (s.register === "standard" || s.register === register) out.push(countedAs(collection, data.id as string, s.text));
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
  wroteBack: boolean;
  spoken: Verdict;
  written: Verdict | null;
  merges: { into: string; from: string[] }[];
  mismatch: string | null;
  /** Both registers undecided: what became of it. */
  settled: Settled | null;
  /** Things the entry must change to agree with how it was settled (fixed by hand, then re-run). */
  todo: string[];
  /** ③ settled by the human (flag corpus-human-settled): not sent back to the review. */
  human: boolean;
  /** The entry carries corpus-human-settled although the corpus now settles it. */
  humanStale: boolean;
  /** How the rules alone would settle a ③ the human settled (for the report). */
  ruleSettled: Settled | null;
  /** The note of the corpus-human-settled flag. */
  humanNote: string | null;
  /** The spoken leader rests on one source and the written corpus / a CED says otherwise (lib.ts spokenLeanHead). */
  lean: LeanHead | null;
}

const NO_FIXED_NOTE = "英語に決まった言い方がない";

/** mapping_note of a Japanese headword this project translated from a US name (STYLE 追記欄). */
const PROJECT_TRANSLATION = "本プロジェクトの訳語";

/**
 * Rule 2 past the high-school references (DECISIONS, Phase 2 幾何・離散の単元
 * 2; CK-12 since 単元 3): a word no candidate of which occurs in the CEDs,
 * OpenStax, IM or CK-12 says so in mapping_note, with the counts.
 */
const NOT_IN_HIGH_SCHOOL = "米国の高校課程（CED・OpenStax・IM・CK-12）では扱わない";

const HUMAN_SETTLED = "corpus-human-settled";

/**
 * A ③ whose headword the human has settled (DECISIONS, Phase 2 代数 2 の単元の
 * 前の修正): the entry carries the flag corpus-human-settled, written by hand,
 * with the date and the DECISIONS line in its note. It takes precedence over
 * the rules for a ③ (the human may have settled a word the rules would call
 * "no fixed expression"), is kept as written, and the entry does not go back
 * to the review list. reviewed.human is not read here: it marks a human review
 * of the whole entry.
 */
type Flag = { code: string; note: string; raised?: string };
const humanFlag = (record: Record<string, unknown>): Flag | null =>
  ((record.flags as Flag[] | undefined) ?? []).find((f) => f.code === HUMAN_SETTLED) ?? null;

/**
 * A report table row. A counted form may contain " | " (lib.ts TERM_FORMS),
 * which is also the Markdown cell separator, so each cell escapes it.
 */
const cells = (...xs: string[]) => `| ${xs.map((x) => x.replace(/\|/g, "\\|")).join(" | ")} |`;

function describeSettled(s: Settled): string {
  if (s.kind === "no-fixed-expression") return `英語に決まった言い方がない（話 ${s.spoken} 件 ／ 書 ${s.written} 件）`;
  if (s.kind === "reference") {
    if (s.by === "ced") return `CED の呼び方 ${s.head}（${s.where.map((w) => (/^\d/.test(w) ? `topic ${w}` : w)).join("・")}）`;
    if (s.by === "ced-stats") return `AP Statistics の CED の呼び方 ${s.head}（${s.where.map((w) => (/^\d/.test(w) ? `topic ${w}` : w)).join("・")}）`;
    if (s.by === "openstax") return `OpenStax の呼び方 ${s.head}（${s.where.slice(0, 3).join("・")}）`;
    if (s.by === "im") return `IM の呼び方 ${s.head}（${[...s.where.slice(0, -1).slice(0, 3), s.where[s.where.length - 1]].join("・")}）`;
    if (s.by === "ck12") return `CK-12 の呼び方 ${s.head}（${[...s.where.slice(0, -1).slice(0, 3), s.where[s.where.length - 1]].join("・")}）`;
    if (s.by === "wikipedia") return `Wikipedia の記事名 ${s.head}（英語版「${s.where[0]}」、${s.where[1]}）`;
    return `${s.by === "levin" ? "Levin" : "Nicholson"} の呼び方 ${s.head}（${s.where.slice(0, 3).join("・")}）`;
  }
  return "判断不能";
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
  const byId = new Map<string, (typeof all)[Collection][number]>(
    COUNTED.flatMap((c) => all[c].map((e) => [`${c}/${e.data.id}`, e] as const)),
  );

  const lines: Line[] = [];

  // Which entries --write may touch. No --units / --ids: all of them.
  const scope = new Set<string>(IDS);
  for (const unit of UNITS) {
    const file = path.join(ROOT, "data", "curriculum", `${unit}.json`);
    if (!fs.existsSync(file)) throw new Error(`--units: no curriculum file ${unit}`);
    for (const id of (JSON.parse(fs.readFileSync(file, "utf8")) as { term_refs: string[] }).term_refs) {
      scope.add(`terms/${id}`);
    }
  }
  const inScope = (key: string) => scope.size === 0 || scope.has(key);

  // count.ts only lists entries with at least one hit. An entry with none has
  // still been counted - zero is fewer than MIN_TOTAL - so it is judged too,
  // as undecided, rather than skipped past the human review.
  const counted = new Map<string, EntryCounts>(file.entries.map((c) => [`${c.collection}/${c.id}`, c]));

  for (const [key, entry] of byId) {
    const c = counted.get(key) ?? {
      collection: entry.collection,
      id: entry.data.id,
      spoken: {},
      written: {},
      merges: [],
      sources: [],
      autoOnly: false,
    };
    const record = entry.data as unknown as Record<string, unknown>;

    const spoken = decideRobust(c.spoken, weights, "spoken");
    const written = c.collection === "symbols" ? null : decideRobust(c.written, weights, "written");

    // ③: settle it where the rules allow (lib.ts settleUndecided). Only terms
    // carry a mapping and are counted against the references.
    const bothUndecided = spoken.kind === "undecided" && (written === null || written.kind === "undecided");
    const rawTotal = (by: Record<string, Record<string, number>>) =>
      Object.values(flatten(by)).reduce((a, b) => a + b, 0);
    const human = humanFlag(record);
    const ruleSettled: Settled | null = !bothUndecided
      ? null
      : c.collection === "terms"
        ? settleUndecided(
            {
              mapping: record.mapping as string | undefined,
              ja: (record.ja as { term: string }).term,
              en: (record.en as { term: string }).term,
              projectTranslation: String(record.mapping_note ?? "").includes(PROJECT_TRANSLATION),
            },
            { spoken: rawTotal(c.spoken), written: rawTotal(c.written) },
            c.reference ?? emptyReference(),
            candidatesOf(c.collection, record),
          )
        : { kind: "undecided" };
    // The human's call comes before the rules.
    const settled: Settled | null = bothUndecided && human ? { kind: "undecided" } : ruleSettled;
    const todo: string[] = [];
    if (bothUndecided && human) {
      // symbols have no en (their readings carry the register)
      const en = (record.en ?? {}) as { register?: string };
      if (en.register) todo.push(`en.register（${en.register}）を外す（register は主張しない）`);
    }
    if (settled && settled.kind !== "undecided") {
      const en = record.en as { term: string; register?: string };
      if (en.register) todo.push(`en.register（${en.register}）を外す（register は主張しない）`);
      // A word counted in a form is compared as that form; a Wikipedia name is a plain wording.
      if (
        settled.kind === "reference" &&
        !sameWording(countedAs(c.collection, entry.data.id, en.term), settled.head) &&
        !sameWording(en.term, settled.head)
      ) {
        todo.push(`en.term を ${settled.head} にする（今は ${en.term}）`);
      }
      if (
        settled.kind === "reference" &&
        ["nicholson", "levin", "wikipedia"].includes(settled.by) &&
        !String(record.mapping_note ?? "").includes(NOT_IN_HIGH_SCHOOL)
      ) {
        todo.push(`mapping_note に「${NOT_IN_HIGH_SCHOOL}」と件数を書く`);
      }
      if (settled.kind === "no-fixed-expression" && !String(record.mapping_note ?? "").includes(NO_FIXED_NOTE)) {
        todo.push(`mapping_note に「${NO_FIXED_NOTE}」と書く`);
      }
    }

    // The spoken leader rests on one source; the written corpus or a CED names
    // another wording: that wording is the headword, the spoken one a spoken
    // variant (lib.ts spokenLeanHead). Not over the human's call.
    const lean = c.collection === "terms" && !human ? spokenLeanHead(spoken, written, c.reference) : null;
    if (lean) {
      const en = record.en as { term: string; variants?: { term: string; register: string }[] };
      const as = (w: string) => countedAs(c.collection, entry.data.id, w);
      if (!sameWording(as(en.term), lean.head) && !sameWording(en.term, lean.head)) {
        todo.push(
          `en.term を ${lean.head} にする（話し言葉の首位 ${lean.spoken} は ${lean.source} 頼み、${lean.by === "written" ? "書き言葉" : "CED"} は ${lean.head}）`,
        );
      }
      if (!(en.variants ?? []).some((v) => v.register === "spoken" && sameWording(as(v.term), lean.spoken))) {
        todo.push(`${lean.spoken} を register spoken の variant にする（話し言葉の首位、${lean.source} 頼み）`);
      }
    }

    // Contradiction: the corpus settled on a wording the entry does not file
    // at that register. Merging already folded inflection and ellipsis away,
    // so what is left is a real disagreement.
    const problems: string[] = [];
    for (const [register, verdict] of [
      ["spoken", spoken],
      ["written", written],
    ] as const) {
      if (verdict === null) continue;
      const heads = headsOf(verdict);
      if (heads.length === 0) continue;
      const recorded = recordedAt(c.collection, record, register);
      const missing = heads.filter((h) => !recorded.some((r) => sameWording(r, h)));
      if (missing.length) {
        problems.push(`${register === "spoken" ? "話" : "書"}: ${missing.join(" / ")}`);
      }
    }
    const mismatch = problems.length ? problems.join(" ／ ") : null;

    const writeBack = WRITE && inScope(key);
    lines.push({
      key,
      wroteBack: writeBack,
      spoken,
      written,
      merges: c.merges,
      mismatch,
      settled,
      todo,
      human: bothUndecided && human !== null,
      humanStale: !bothUndecided && human !== null,
      ruleSettled: bothUndecided && human ? ruleSettled : null,
      humanNote: human?.note ?? null,
      lean,
    });

    if (!writeBack) continue;

    record.evidence = {
      ...(Object.keys(c.spoken).length ? { spoken: flatten(c.spoken) } : {}),
      ...(Object.keys(c.written).length ? { written: flatten(c.written) } : {}),
      sources: c.sources,
      counted: file.counted,
    };

    // corpus-human-settled is the human's, written by hand: kept as it is.
    const flags = ((record.flags as { code: string }[] | undefined) ?? []).filter(
      (f) => !f.code.startsWith("corpus-") || f.code === HUMAN_SETTLED,
    );
    if (settled?.kind === "no-fixed-expression") {
      flags.push({
        code: "corpus-no-fixed-expression",
        note: `${describeSettled(settled)}。mapping ${record.mapping as string} なので、英語に決まった言い方がないと判定した。register は主張しない。人間レビューには回さない。`,
        raised: TODAY,
      } as { code: string });
    } else if (settled?.kind === "reference") {
      flags.push({
        code: "corpus-reference-fallback",
        note: `コーパスで決まらない（話: ${describe(spoken)} ／ 書: ${describe(written)}）。見出しは ${describeSettled(settled)}。register は主張しない。`,
        raised: TODAY,
      } as { code: string });
    } else if (settled?.kind === "undecided" && human) {
      // already in flags
    } else if (settled?.kind === "undecided") {
      flags.push({
        code: "corpus-undecided",
        note:
          c.collection === "terms"
            ? `コーパスで決まらず、CED・OpenStax・IM・CK-12・Nicholson・Levin・英語版 Wikipedia のどれにも呼び方がない（話: ${describe(spoken)} ／ 書: ${describe(written)}）。人間レビューへ。`
            : `コーパスで決まらない（話: ${describe(spoken)} ／ 書: ${describe(written)}）。人間レビューへ。`,
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
    // A record flag (lib/flags.ts) may stay on a verified entry; a problem flag may not.
    if (record.confidence === "verified" && flags.some((f) => isProblemFlag(f.code))) record.confidence = "likely";

    fs.writeFileSync(entry.file, JSON.stringify(record, null, 2) + "\n", "utf8");
  }

  // ------------------------------------------------------------- report ---
  const single = lines.filter((l) => l.spoken.kind === "single" || l.written?.kind === "single");
  const both = lines.filter((l) => l.spoken.kind === "both" || l.written?.kind === "both");
  const undecided = lines.filter((l) => l.settled?.kind === "undecided" && !l.human);
  const human = lines.filter((l) => l.human);
  const humanStale = lines.filter((l) => l.humanStale);
  const noFixed = lines.filter((l) => l.settled?.kind === "no-fixed-expression");
  const byReference = lines.filter((l) => l.settled?.kind === "reference");
  const todos = lines.filter((l) => l.todo.length);
  const mismatched = lines.filter((l) => l.mismatch);
  const merges = lines.filter((l) => l.merges.length);
  const leans = (v: Verdict | null) => v !== null && v.kind !== "undecided" && v.dependsOn !== undefined;
  const oneSource = lines.filter((l) => leans(l.spoken) || leans(l.written));
  const writtenBack = lines.filter((l) => l.wroteBack);
  const leaning = lines.filter((l) => l.lean);

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
    `対象 ${lines.length} 件。主見出し決着 ${single.length} ／ 併記 ${both.length} ／ 英語に決まった言い方なし ${noFixed.length} ／ 参照で見出しを決めた ${byReference.length} ／ 人間が決めた ${human.length} ／ 判断不能 ${undecided.length} ／ register 不一致 ${mismatched.length}。`,
    "",
    scope.size
      ? `data/ に書き戻したのは ${writtenBack.length} 件（${[...UNITS, ...IDS].join("、")}）。ほかは判定を表示しただけで、evidence と flags は前回のまま。`
      : WRITE
        ? "全件を data/ に書き戻した。"
        : "書き戻していない（--write なし）。",
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
    ...single.map((l) => cells(l.key, describe(l.spoken), describe(l.written))),
    "",
    "## ② 併記（首位が 3 倍に届かず、各 10 件以上。頻度順）",
    "",
    "どちらも実際に使われている。辞典が勝手に一方を選ぶとコーパスに無い好みを作ることになる。",
    "`en.variants` に頻度順で両方入れる。",
    "",
    both.length ? "| 項目 | 話し言葉 | 書き言葉 |\n|---|---|---|" : "なし。",
    ...both.map((l) => cells(l.key, describe(l.spoken), describe(l.written))),
    "",
    "## 1 ソース頼み（首位の件数が最も多いソースを抜くと判定が変わる）",
    "",
    "①→② は、抜くと別の言い方が首位になるので ① を ② 併記に下げたもの。抜くと ③ になる（データが薄くなるだけの）ものと、",
    "同じ言い方が首位のまま ② になるものは ① のまま、頼っているソースを記録する。② はそのまま記録だけする。",
    "",
    oneSource.length ? "| 項目 | 話し言葉 | 書き言葉 |\n|---|---|---|" : "なし。",
    ...oneSource.map((l) => cells(l.key, leans(l.spoken) ? describe(l.spoken) : "—", leans(l.written) ? describe(l.written) : "—")),
    "",
    "## 話し言葉の首位が 1 ソース頼みで、書き言葉か CED が別の言い方のもの（見出しの規則）",
    "",
    "抜くと ③ か別の候補になる話し言葉の首位は見出しにしない。書き言葉（①）か CED の言い方を en.term にし、",
    "話し言葉の首位は register spoken の variant にする（DECISIONS、Phase 2 中学の単元 2 の前の修正 3）。",
    "",
    leaning.length ? "| 項目 | 話し言葉の首位 | 頼っているソース | 見出し | 根拠 |\n|---|---|---|---|---|" : "なし。",
    ...leaning.map((l) => cells(l.key, l.lean!.spoken, l.lean!.source, l.lean!.head, l.lean!.by === "written" ? "書き言葉 ①" : "CED")),
    "",
    "## 統合済み（語形変化・引数省略として見出し語に合算）",
    "",
    "別の語（integral / integrate / integration）は統合していない。合算した件数は落としていない。",
    "",
    merges.length ? "| 項目 | 合算先 | 合算した表記 |\n|---|---|---|" : "なし。",
    ...merges.flatMap((l) => l.merges.map((m) => cells(l.key, m.into, m.from.join(" / ")))),
    "",
    "## ③ のうち規則で決着したもの",
    "",
    "話・書とも判断不能のうち、mapping が near ／ none で全候補の合計が話・書とも 10 件未満のものは「英語に決まった言い方がない」",
    "（corpus-no-fixed-expression）。それ以外は見出しを CED（AP Calculus ／ AP Statistics）の呼び方、無ければ OpenStax・IM・CK-12 の呼び方（同じ段。本文・節の名前・レッスン・glossary の件数の多い候補。参照のどれかが候補を 3 件以上使う語は「決まった言い方がない」にしない）、",
    "無ければ Nicholson ／ Levin の呼び方、無ければ英語版 Wikipedia の記事名で決める",
    "（corpus-reference-fallback）。どちらも register は主張せず、人間レビューに回さない。",
    "",
    noFixed.length + byReference.length ? "| 項目 | 決着 | 話し言葉 | 書き言葉 |\n|---|---|---|---|" : "なし。",
    ...[...noFixed, ...byReference].map((l) => cells(l.key, describeSettled(l.settled!), describe(l.spoken), describe(l.written))),
    "",
    "## ③ のうち人間が見出しを決めたもの（flag corpus-human-settled）",
    "",
    "コーパスで決まらず、人間が見出しを決めた（flag の note に日付と DECISIONS の行）。規則より人間の決定を先にする。",
    "register は主張しない。人間レビューには戻さない。",
    "",
    human.length ? "| 項目 | 話し言葉 | 書き言葉 | 規則だけなら | 印 |\n|---|---|---|---|---|" : "なし。",
    ...human.map(
      (l) =>
        cells(l.key, describe(l.spoken), describe(l.written), l.ruleSettled ? describeSettled(l.ruleSettled) : "—", l.humanNote ?? ""),
    ),
    "",
    "## 人間が見出しを決めたが、今はコーパスで決まるもの",
    "",
    "corpus-human-settled は残してある。コーパスの結論とエントリが合っているかを見る。",
    "",
    humanStale.length ? "| 項目 | 話し言葉 | 書き言葉 |\n|---|---|---|" : "なし。",
    ...humanStale.map((l) => cells(l.key, describe(l.spoken), describe(l.written))),
    "",
    "## エントリ側で直すこと（決着とエントリが合っていない）",
    "",
    todos.length ? "| 項目 | 直すこと |\n|---|---|" : "なし。",
    ...todos.map((l) => cells(l.key, l.todo.join(" ／ "))),
    "",
    "---",
    "",
    "# 人間レビュー行き",
    "",
    "週 30 分で見るのはここだけ。",
    "",
    "## ③ コーパスで決まらず、CED・OpenStax・IM・CK-12・Nicholson・Levin・英語版 Wikipedia のどれにも呼び方がないもの",
    "",
    undecided.length ? "| 項目 | 話し言葉 | 書き言葉 |\n|---|---|---|" : "なし。",
    ...undecided.map((l) => cells(l.key, describe(l.spoken), describe(l.written))),
    "",
    "## register がエントリと食い違うもの",
    "",
    "コーパスが「その register で使われている」と言った表現を、エントリがその register に持っていない。",
    "",
    mismatched.length ? "| 項目 | 食い違い | コーパスの結論 |\n|---|---|---|" : "なし。",
    ...mismatched.map((l) => cells(l.key, l.mismatch ?? "", `話 ${describe(l.spoken)} ／ 書 ${describe(l.written)}`)),
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
    `single ${single.length}, both ${both.length}, no-fixed ${noFixed.length}, reference ${byReference.length}, human-settled ${human.length}, undecided ${undecided.length}, mismatch ${mismatched.length}, merges ${merges.length}, one-source ${oneSource.length}, spoken-lean ${leaning.length}, entry todo ${todos.length}`,
  );
  if (WRITE) console.log(`wrote ${writtenBack.length} entr${writtenBack.length === 1 ? "y" : "ies"} back to data/`);
  console.log(`report -> audits/corpus-${TODAY}.md`);
  if (!WRITE) console.log("run with --write to record evidence and flags in data/");
}

main();
