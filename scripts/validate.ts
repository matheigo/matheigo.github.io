/**
 * Stage 1 of the four-stage QA in PLAN.md 8: machine checks.
 *
 * - JSON Schema (schema/*.schema.json)
 * - filename stem == id, no duplicate ids, no duplicate ja.term
 * - every LaTeX string compiles under KaTeX
 * - related / term_ref / term_refs resolve to an existing entry
 * - the "definition of done" in CLAUDE.md (sources, examples, mapping_note)
 * - a verified entry carries no problem flag (record flags may stay; lib/flags.ts)
 * - a Japanese word shared by two entries is a listed homonym (SAME_JA)
 * - no count from the example corpus in the body text (lib/corpus-count.ts; a warning)
 *
 * Exit code 1 on any error. Warnings do not fail the build.
 */
import Ajv2020, { type ErrorObject } from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import katex from "katex";
import { bodyTexts, corpusCountSentences } from "./lib/corpus-count.js";
import { PROBLEM_FLAGS, RECORD_FLAGS, isProblemFlag } from "./lib/flags.js";
import { COLLECTIONS, loadAll, readSchema, type Collection, type Entry } from "./lib/load.js";

const errors: string[] = [];
const warnings: string[] = [];

const err = (where: string, msg: string) => errors.push(`${where}: ${msg}`);
const warn = (where: string, msg: string) => warnings.push(`${where}: ${msg}`);

// ---------------------------------------------------------------- schema ---

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
ajv.addSchema(readSchema("_common"));
const validators = Object.fromEntries(
  COLLECTIONS.map((c) => [c, ajv.compile(readSchema(c))]),
) as Record<Collection, ReturnType<typeof ajv.compile>>;

const formatAjv = (e: ErrorObject) => `${e.instancePath || "/"} ${e.message ?? ""}`.trim();

// ------------------------------------------------------------------ load ---

const all = loadAll();
const idsByCollection = Object.fromEntries(
  COLLECTIONS.map((c) => [c, new Set(all[c].map((e) => e.data.id))]),
) as Record<Collection, Set<string>>;

// --------------------------------------------------------------- helpers ---

function checkLatex(where: string, latex: unknown) {
  if (typeof latex !== "string" || latex.length === 0) return;
  try {
    katex.renderToString(latex, { throwOnError: true, displayMode: true });
  } catch (e) {
    err(where, `LaTeX does not compile under KaTeX: ${(e as Error).message.split("\n")[0]}`);
  }
  if (latex.includes("\\displaystyle")) {
    warn(where, "\\displaystyle is discouraged (PLAN 6-8)");
  }
}

function checkRef(where: string, field: string, id: unknown, target: Collection) {
  if (typeof id !== "string") return;
  if (!idsByCollection[target].has(id)) {
    err(where, `${field} points at "${id}", which has no file in data/${target}/`);
  }
}

const sourcesOf = (d: Entry) => (Array.isArray(d.sources) ? d.sources : []);

/** The phrase mapping_note uses for a Japanese headword not found in Japanese textbooks. */
const PROJECT_TRANSLATION = "本プロジェクトの訳語";
/**
 * The phrase mapping_note uses for an exact term the US high-school sources do
 * not cover (DECISIONS, Phase 2 代数 2・Precalculus の単元の前の修正; since
 * Phase 2 幾何・離散の単元 2 the sources are the CEDs, OpenStax and IM, CK-12
 * since 単元 3, and
 * decide asks for it on every word settled past them): the words match, so
 * the mapping stays exact, and the note is about the range.
 */
const NOT_IN_US_COURSES = "米国の高校課程（CED・OpenStax・IM・CK-12）では扱わない";

/**
 * Intended homonyms: two concepts that English calls by the same en.term
 * (Phase 1: "同じ英語でも別概念なら別 id"). Each pair is a human judgement;
 * the entries point at each other in related / pitfalls.
 */
const SAME_EN_TERM: [string, string][] = [
  ["divergence", "divergence-vector"], // 発散（数列・級数） ／ 発散（ベクトル場）
  ["geometric-mean", "geometric-middle-term"], // 相乗平均 ／ 等比中項
  ["argument", "argument-of-a-complex-number"], // 真数 ／ 偏角（英語はどちらも関数の引数と同じ argument）
  ["sign-chart", "sign-chart-inequality"], // 増減表 ／ 不等式を解く符号図（英語はどちらも sign chart）
  ["arc-length", "arc-length-of-a-curve"], // 弧の長さ（円） ／ 曲線の長さ
  ["vertex", "vertex-graph"], // 頂点（図形・放物線） ／ 頂点（グラフ理論）
  ["hypothesis", "statistical-hypothesis"], // 仮定（証明） ／ 仮説（統計）
  ["median", "median-of-a-triangle"], // 中央値 ／ 中線
  ["variable", "statistical-variable"], // 変数（式の文字） ／ 変量（統計）
  // グラフ（関数の、名詞） ／ グラフをかく（動詞） ／ グラフ（離散数学の頂点と辺）: English says graph for all three
  ["graph", "draw-a-graph"],
  ["graph", "graph-network"],
  ["draw-a-graph", "graph-network"],
  ["base-of-a-power", "base-of-a-solid"], // 底（累乗） ／ 底面（立体）
  ["cube", "cube-solid"], // 立方（3 乗） ／ 立方体
  ["edge", "edge-of-a-graph"], // 辺・稜（立体） ／ 辺（グラフ）
  ["base-of-a-triangle", "base-of-a-power"], // 底辺 ／ 底（累乗）
  ["base-of-a-triangle", "base-of-a-solid"], // 底辺 ／ 底面
  ["corresponding-angles", "corresponding-angles-of-congruent-figures"], // 同位角 ／ 対応する角
  ["range", "range-of-data"], // 値域 ／ 範囲（統計）
  ["square", "square-shape"], // 平方（2 乗） ／ 正方形
  ["divisor", "factor"], // 約数 ／ 因数（英語はどちらも factor）
  ["estimation", "bound-estimate"], // 推定（統計） ／ 評価する（値の範囲をはさむ）
];
const intendedHomonym = (a: string, b: string) =>
  SAME_EN_TERM.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

/**
 * Intended Japanese homonyms: one Japanese word that names two concepts, as
 * the ja.term of one entry and the ja.alt of another (or the ja.alt of both).
 * Two entries may not share a ja.term (that is an error above); a shared
 * ja.alt is a warning unless the pair is listed here. A listed pair must name
 * each other in `related` and say in `pitfalls` which is which.
 */
const SAME_JA: [string, string, string][] = [
  // 三角形の成立条件 |a + b| ≦ |a| + |b| ／ 三角関数を含む不等式 (DECISIONS, Phase 2 統計・ベクトルの単元の前の修正)
  ["三角不等式", "triangle-inequality", "trigonometric-inequality"],
  // 集合の要素 ／ 行列の成分 (Phase 2 幾何・離散の単元)
  ["要素", "element", "entry"],
  // 線形写像の像（列空間） ／ 変換で移った図形 (Phase 2 幾何・離散の単元 3)
  ["像", "column-space", "image"],
  // 直線・線分の垂直 ／ ベクトルの垂直（直交） (Phase 2 中学の単元 2)
  ["垂直", "orthogonal", "perpendicular"],
  // 多項式の次数 ／ グラフの頂点の次数
  ["次数", "degree", "degree-vertex"],
  // 多角形の辺 ／ 立体の辺（稜）
  ["辺", "edge", "side"],
];

// ------------------------------------------------------------ per-entry ----

for (const collection of COLLECTIONS) {
  const seenJa = new Map<string, string>();
  const seenEn = new Map<string, string>();

  for (const { file, stem, data } of all[collection]) {
    const where = `${collection}/${stem}.json`;

    const validate = validators[collection];
    if (!validate(data)) {
      for (const e of validate.errors ?? []) err(where, formatAjv(e));
      continue; // shape is wrong; the checks below would be noise
    }

    if (data.id !== stem) err(where, `id "${data.id}" does not match the filename`);

    // duplicates ---------------------------------------------------------
    if (collection === "terms") {
      const ja = (data.ja as { term: string }).term;
      const en = (data.en as { term: string }).term.toLowerCase();
      if (seenJa.has(ja)) err(where, `ja.term "${ja}" already used by ${seenJa.get(ja)}`);
      seenJa.set(ja, where);
      const other = seenEn.get(en);
      if (other && !intendedHomonym(stem, other.replace(/^terms\/|\.json$/g, ""))) {
        warn(where, `en.term "${en}" already used by ${other}`);
      }
      seenEn.set(en, where);
    }

    // LaTeX --------------------------------------------------------------
    checkLatex(where, data.latex);

    // cross-references ---------------------------------------------------
    for (const r of (data.related as string[] | undefined) ?? []) {
      checkRef(where, "related", r, "terms");
      if (r === data.id) err(where, "related refers to itself");
    }
    checkRef(where, "term_ref", data.term_ref, "terms");
    for (const r of (data.term_refs as string[] | undefined) ?? []) {
      checkRef(where, "term_refs", r, "terms");
    }

    if (collection === "curriculum") continue;

    // counts from the example corpus stay in evidence (STYLE 追記欄) ------
    for (const [field, text] of bodyTexts(data)) {
      for (const s of corpusCountSentences(text)) {
        warn(where, `${field} has what looks like a count from the example corpus (write a comparison; counts live in evidence): ${s}`);
      }
    }

    // definition of done (CLAUDE.md) -------------------------------------
    const confidence = data.confidence as string;
    const sources = sourcesOf(data);

    if (confidence !== "draft" && sources.length === 0) {
      err(where, `confidence "${confidence}" requires at least one source (PLAN 6-7)`);
    }

    if (collection === "terms") {
      const mapping = data.mapping as string;
      const note = data.mapping_note;
      if (mapping !== "exact" && !note) {
        err(where, `mapping "${mapping}" requires mapping_note (PLAN 5.1)`);
      }
      // An exact entry may still say that its Japanese headword is this
      // project's translation (DECISIONS, Phase 2 修正 5); anything else in
      // the note of an exact entry is probably a leftover.
      // A note the human decided on (flag corpus-human-settled) is not a leftover either.
      const humanSettled = ((data.flags as { code: string }[] | undefined) ?? []).some(
        (f) => f.code === "corpus-human-settled",
      );
      if (
        mapping === "exact" &&
        note &&
        !humanSettled &&
        !String(note).includes(PROJECT_TRANSLATION) &&
        !String(note).includes(NOT_IN_US_COURSES)
      ) {
        warn(where, "mapping is exact but mapping_note is set");
      }

      const examples = (data.examples as unknown[] | undefined) ?? [];
      const needed = data.pos === "verb" ? 2 : 1;
      if (confidence !== "draft" && examples.length < needed) {
        err(
          where,
          `pos "${data.pos}" needs at least ${needed} example(s), found ${examples.length}`,
        );
      }

      const reading = (data.ja as { reading: string }).reading;
      if (!/^[\u3040-\u309F\u30FC\u3005\s・]+$/.test(reading)) {
        err(where, `ja.reading "${reading}" must be hiragana (PLAN 6-6)`);
      }
    }

    // audio paths --------------------------------------------------------
    if (typeof data.audio === "string" && !data.audio.startsWith(`audio/${collection}/`)) {
      err(where, `audio path should be audio/${collection}/${data.id}.mp3`);
    }

    // flags: a problem flag keeps an entry from verified, a record flag does not
    const flags = (data.flags as { code: string }[] | undefined) ?? [];
    for (const f of flags) {
      if (!PROBLEM_FLAGS.has(f.code) && !RECORD_FLAGS.has(f.code)) {
        warn(where, `flag code "${f.code}" is neither a problem nor a record flag (scripts/lib/flags.ts)`);
      }
    }
    const problems = flags.filter((f) => isProblemFlag(f.code)).map((f) => f.code);
    if (confidence === "verified" && problems.length) {
      err(where, `confidence is verified but problem flags are still present: ${problems.join(", ")} (PLAN 8-2)`);
    }
  }
}

// ------------------------------------------------------- ja homonyms ---

{
  const byWord = new Map<string, Set<string>>();
  const related = new Map<string, string[]>();
  const pitfalls = new Map<string, string>();
  for (const { data } of all.terms) {
    const ja = data.ja as { term?: string; alt?: string[] } | undefined;
    if (!ja?.term) continue;
    for (const w of [ja.term, ...(ja.alt ?? [])]) {
      if (!byWord.has(w)) byWord.set(w, new Set());
      byWord.get(w)!.add(data.id);
    }
    related.set(data.id, (data.related as string[] | undefined) ?? []);
    pitfalls.set(data.id, ((data.pitfalls as string[] | undefined) ?? []).join(" "));
  }
  for (const [word, set] of byWord) {
    if (set.size < 2) continue;
    const ids = [...set].sort();
    const listed = SAME_JA.find(([w, a, b]) => w === word && [a, b].sort().join() === ids.join());
    if (!listed) {
      warn(`terms/${ids.join(", ")}`, `ja "${word}" is shared and not listed in SAME_JA`);
      continue;
    }
    const [, a, b] = listed;
    for (const [x, y] of [[a, b], [b, a]]) {
      if (!related.get(x)?.includes(y)) warn(`terms/${x}.json`, `SAME_JA "${word}": related should include ${y}`);
      if (!pitfalls.get(x)?.includes(y)) warn(`terms/${x}.json`, `SAME_JA "${word}": pitfalls should name ${y}`);
    }
  }
}

// ----------------------------------------------------------------- report ---

const counts = COLLECTIONS.map((c) => `${c} ${all[c].length}`).join(" / ");
const published = all.terms.filter((e) => e.data.confidence === "verified").length;

console.log(`entries: ${counts}`);
console.log(`terms at confidence "verified": ${published}`);

for (const w of warnings) console.warn(`  warn  ${w}`);
for (const e of errors) console.error(`  ERROR ${e}`);

if (errors.length > 0) {
  console.error(`\nvalidate failed: ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(1);
}
console.log(`\nvalidate passed (${warnings.length} warning(s))`);
