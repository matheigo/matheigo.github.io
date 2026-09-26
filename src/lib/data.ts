/** Build-time access to data/. Vite's import.meta.glob keeps the site static. */
import { CORPUS_SOURCES } from "../../scripts/corpus/sources";
import { isExplanatoryTranslation } from "./gloss";

const termMods = import.meta.glob("../../data/terms/*.json", { eager: true, import: "default" });
const symbolMods = import.meta.glob("../../data/symbols/*.json", {
  eager: true,
  import: "default",
});
const phraseMods = import.meta.glob("../../data/phrases/*.json", {
  eager: true,
  import: "default",
});
const conventionMods = import.meta.glob("../../data/conventions/*.json", {
  eager: true,
  import: "default",
});
const curriculumMods = import.meta.glob("../../data/curriculum/*.json", {
  eager: true,
  import: "default",
});

const values = <T>(mods: Record<string, unknown>): T[] => Object.values(mods) as T[];

export const SITE_NAME = "MathEigo";
export const REPO = "https://github.com/matheigo/matheigo.github.io";

export type Confidence = "draft" | "likely" | "verified";

export interface Level {
  jp: string[];
  us: string[];
}
export interface Source {
  type: string;
  ja?: string;
  en?: string;
  qid?: string;
  doc?: string;
  title?: string;
  url?: string;
  note?: string;
}
export interface Flag {
  code: string;
  note: string;
  raised?: string;
}
export interface Evidence {
  spoken?: Record<string, number>;
  written?: Record<string, number>;
  sources: string[];
  counted: string;
}

export interface Term {
  id: string;
  ja: { term: string; reading: string; alt?: string[] };
  en: {
    term: string;
    alt?: string[];
    variants?: { term: string; register: string; note?: string }[];
    uk?: string | null;
    register?: string;
  };
  pos: string;
  mapping: "exact" | "near" | "none";
  mapping_note?: string | null;
  domains: string[];
  level: Level;
  definition_ja: string;
  definition_en: string;
  latex?: string | null;
  spoken_en?: string | null;
  tts_text?: string;
  respelling?: string;
  examples?: { en: string; ja: string; register: string }[];
  collocations?: { en: string; ja: string }[];
  pitfalls?: string[];
  related?: string[];
  sources: Source[];
  flags?: Flag[];
  evidence?: Evidence;
  confidence: Confidence;
  updated?: string;
}

export interface Symbol_ {
  id: string;
  latex: string;
  spoken_en: { text: string; register: string }[];
  spoken_ja: string;
  name_en: string;
  name_ja: string;
  category?: string;
  term_ref?: string | null;
  related?: string[];
  level: Level;
  notes?: string[];
  tts_text?: string;
  respelling?: string;
  sources: Source[];
  flags?: Flag[];
  evidence?: Evidence;
  confidence: Confidence;
  updated?: string;
}

export interface Phrase {
  id: string;
  situation: string;
  intent: string;
  en: string;
  ja: string;
  register: string;
  variants?: { en: string; register: string; note?: string }[];
  notes?: string[];
  tags?: string[];
  sources: Source[];
  flags?: Flag[];
  evidence?: Evidence;
  confidence: Confidence;
  updated?: string;
}

export interface Convention {
  id: string;
  title_ja: string;
  title_en: string;
  jp: string;
  us: string;
  advice_ja: string;
  category: string;
  level: Level;
  term_refs?: string[];
  related?: string[];
  sources: Source[];
  confidence: Confidence;
  updated?: string;
}

export interface CurriculumUnit {
  id: string;
  system: "jp" | "us";
  track?: string;
  subject: string;
  unit: string;
  topics: string[];
  us_equivalents?: { course: string; coverage: string; note?: string }[];
  jp_equivalents?: { subject: string; coverage: string; note?: string }[];
  term_refs: string[];
  sources?: Source[];
  updated?: string;
}

/**
 * Everything past `draft` is built into the site. `likely` entries are marked
 * with data-unverified-item so the off-by-default header toggle can hide them,
 * and their pages carry noindex. `draft` never ships (PLAN 8).
 */
const published = <T extends { confidence: string }>(xs: T[]): T[] =>
  xs.filter((x) => x.confidence !== "draft");

/**
 * Toggle default: on while developing, off for any build (DECISIONS, Phase 0).
 * MB_SHOW_UNVERIFIED=1 builds a copy with the toggle on by default, used only
 * to measure pages with their content visible (scripts/perf/measure.ts).
 */
export const SHOW_UNVERIFIED_BY_DEFAULT =
  import.meta.env.DEV || process.env.MB_SHOW_UNVERIFIED === "1";

export const isUnverified = (x: { confidence: string }): boolean => x.confidence !== "verified";

const byId = (a: { id: string }, b: { id: string }) => a.id.localeCompare(b.id);

export const terms: Term[] = published(values<Term>(termMods)).sort(byId);
export const symbols: Symbol_[] = published(values<Symbol_>(symbolMods)).sort(byId);
export const phrases: Phrase[] = published(values<Phrase>(phraseMods)).sort(byId);
export const conventions: Convention[] = published(values<Convention>(conventionMods)).sort(byId);
export const curriculum: CurriculumUnit[] = values<CurriculumUnit>(curriculumMods).sort(byId);

export const termById = new Map(terms.map((t) => [t.id, t]));
export const symbolById = new Map(symbols.map((s) => [s.id, s]));
export const conventionById = new Map(conventions.map((c) => [c.id, c]));
export const unitById = new Map(curriculum.map((u) => [u.id, u]));

export { isExplanatoryTranslation };

// reverse links ---------------------------------------------------------------

const groupBy = <T>(pairs: [string, T][]): Map<string, T[]> => {
  const m = new Map<string, T[]>();
  for (const [k, v] of pairs) m.set(k, [...(m.get(k) ?? []), v]);
  return m;
};

/** Curriculum units that list a term in term_refs. */
export const unitsByTerm = groupBy(curriculum.flatMap((u) => u.term_refs.map((r) => [r, u] as [string, CurriculumUnit])));
/** Conventions that name a term in term_refs. */
export const conventionsByTerm = groupBy(
  conventions.flatMap((c) => (c.term_refs ?? []).map((r) => [r, c] as [string, Convention])),
);
/** Symbols whose term_ref is the term. */
export const symbolsByTerm = groupBy(
  symbols.filter((s) => s.term_ref).map((s) => [s.term_ref!, s] as [string, Symbol_]),
);

// labels ----------------------------------------------------------------------

export const SITUATIONS = [
  "class-listening",
  "class-asking",
  "office-hours",
  "explaining-solution",
  "written-solution",
  "exam",
  "email",
  "group-study",
  "discord",
] as const;

export const SITUATION_LABELS: Record<string, string> = {
  "class-listening": "授業で聞く",
  "class-asking": "授業で質問する",
  "office-hours": "オフィスアワー",
  "explaining-solution": "解き方を説明する",
  "written-solution": "答案に書く",
  exam: "試験",
  email: "メール",
  "group-study": "グループ学習",
  discord: "Discord",
};

export const PHRASE_REGISTER_LABELS: Record<string, string> = {
  polite: "丁寧",
  neutral: "ふつう",
  casual: "くだけた",
  written: "書き言葉",
};

export const MAPPING_LABELS: Record<string, string> = {
  exact: "1対1で対応",
  near: "近いが同じではない",
  none: "対応する語がない",
};

export const POS_LABELS: Record<string, string> = {
  noun: "名詞",
  verb: "動詞",
  adjective: "形容詞",
  phrase: "句",
  symbol: "記号",
};

export const REGISTER_LABELS: Record<string, string> = {
  spoken: "話し言葉",
  written: "書き言葉・答案",
  both: "話し言葉・書き言葉",
  standard: "標準",
};

export const DOMAIN_LABELS: Record<string, string> = {
  arithmetic: "数と計算",
  algebra: "代数",
  geometry: "図形",
  trigonometry: "三角比・三角関数",
  functions: "関数",
  sequences: "数列",
  calculus: "微分積分",
  analysis: "解析",
  "linear-algebra": "線形代数",
  vectors: "ベクトル",
  "complex-numbers": "複素数",
  "number-theory": "整数",
  combinatorics: "場合の数",
  probability: "確率",
  statistics: "統計",
  discrete: "離散数学",
  logic: "論理",
  "set-theory": "集合",
  proof: "証明",
  notation: "記法",
  classroom: "教室",
};

export const CONVENTION_CATEGORY_LABELS: Record<string, string> = {
  notation: "記法",
  letters: "使う文字",
  terminology: "用語",
  "proof-style": "証明・答案",
  handwriting: "手書き",
  calculator: "計算機",
  "classroom-culture": "教室の習慣",
};

export const COVERAGE_LABELS: Record<string, string> = {
  full: "ほぼ一致",
  most: "大部分",
  some: "一部",
  none: "対応なし",
};

// symbols by unit ---------------------------------------------------------------

/**
 * Units of /symbols, in page order. Each symbol names its unit in the optional
 * `category` field (moved from ledger/symbols.csv into the data in Phase 5).
 */
export const SYMBOL_CATEGORIES: [string, string][] = [
  ["arithmetic", "四則"],
  ["fractions", "分数"],
  ["exponents", "指数"],
  ["roots", "根号"],
  ["subscripts", "添字"],
  ["functions", "関数"],
  ["trigonometry", "三角関数"],
  ["logarithms", "対数"],
  ["limits", "極限"],
  ["derivatives", "微分"],
  ["integrals", "積分"],
  ["sums", "総和"],
  ["sets", "集合"],
  ["logic", "論理"],
  ["vectors", "ベクトル"],
  ["matrices", "行列"],
  ["complex-numbers", "複素数"],
  ["number-theory", "整数"],
  ["probability-statistics", "確率・統計"],
  ["geometry", "幾何"],
  ["notation-other", "その他の記法"],
];

export const symbolCategory = new Map(symbols.map((s) => [s.id, s.category || "notation-other"]));

// curriculum order -------------------------------------------------------------

export const JP_SUBJECTS = ["中1", "中2", "中3", "数学I", "数学A", "数学II", "数学B", "数学III", "数学C"];
export const US_TRACKS: [string, string, string[]][] = [
  ["traditional", "Traditional", ["Pre-Algebra", "Algebra 1", "Geometry", "Algebra 2", "Precalculus"]],
  ["integrated", "Integrated", ["Integrated Math 1", "Integrated Math 2", "Integrated Math 3"]],
  ["ap", "AP", ["AP Calculus AB", "AP Calculus BC", "AP Statistics"]],
  [
    "college",
    "大学初年次",
    ["Calculus I", "Calculus II", "Calculus III", "Linear Algebra", "Intro Statistics", "Discrete Math"],
  ],
];

/** Anchor for a subject or course heading on /curriculum. */
export const subjectAnchor = (s: string) =>
  "c-" + s.toLowerCase().replace(/[^a-z0-9぀-鿿]+/g, "-").replace(/^-|-$/g, "");

// corpus sources ---------------------------------------------------------------

const SOURCE_TITLES = new Map(CORPUS_SOURCES.map((s) => [s.id, s]));

export function corpusSourceLabel(id: string): string {
  return SOURCE_TITLES.get(id)?.title ?? id;
}
export function corpusSourceRegister(id: string): "spoken" | "written" | undefined {
  return SOURCE_TITLES.get(id)?.register;
}

// sources ---------------------------------------------------------------------

const wiki = (lang: string, title: string) =>
  `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;

export interface SourceView {
  label: string;
  href?: string;
  detail?: string;
  links?: { text: string; href: string }[];
}

export function sourceView(s: Source): SourceView {
  switch (s.type) {
    case "wikipedia-langlink":
      return {
        label: "Wikipedia の言語間リンク",
        links: [
          ...(s.ja ? [{ text: `ja: ${s.ja}`, href: wiki("ja", s.ja) }] : []),
          ...(s.en ? [{ text: `en: ${s.en}`, href: wiki("en", s.en) }] : []),
        ],
        detail: s.note,
      };
    case "wikidata":
      return {
        label: "Wikidata",
        links: s.qid ? [{ text: s.qid, href: `https://www.wikidata.org/wiki/${s.qid}` }] : [],
      };
    case "mext-translation":
      return { label: "文部科学省 学習指導要領 英訳", detail: s.doc ?? s.note };
    case "criced":
      return { label: "CRICED 学習指導要領解説 日英対訳", detail: s.doc ?? s.note };
    case "nysed-glossary":
      return { label: "NYSED Bilingual Glossary", detail: s.doc ?? s.note };
    case "editorial":
      return { label: "MathEigo の編集判断", detail: s.note };
    default:
      return { label: s.title ?? s.doc ?? s.type, href: s.url, detail: s.note };
  }
}

// small helpers ---------------------------------------------------------------

export const levelText = (l: Level) =>
  `日本 ${l.jp.length ? l.jp.join("・") : "—"} ／ 米国 ${l.us.length ? l.us.join("・") : "—"}`;

/** 「今日の10語」— deterministic per build day so the page can stay static. */
export function todaysTerms(n = 10): Term[] {
  const pool = terms.filter((t) => !isExplanatoryTranslation(t));
  const day = Math.floor(Date.now() / 86_400_000);
  const start = pool.length ? (day * 37) % pool.length : 0;
  return Array.from({ length: Math.min(n, pool.length) }, (_, i) => pool[(start + i * 97) % pool.length]);
}
