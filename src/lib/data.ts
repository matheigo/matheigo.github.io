/** Build-time access to data/. Vite's import.meta.glob keeps the site static. */

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

export interface Level {
  jp: string[];
  us: string[];
}
export interface Source {
  type: string;
  ja?: string;
  en?: string;
  doc?: string;
  title?: string;
  url?: string;
  note?: string;
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
  confidence: "draft" | "likely" | "verified";
  updated?: string;
}

export interface Symbol_ {
  id: string;
  latex: string;
  spoken_en: { text: string; register: string }[];
  spoken_ja: string;
  name_en: string;
  name_ja: string;
  term_ref?: string | null;
  level: Level;
  notes?: string[];
  tts_text?: string;
  sources: Source[];
  confidence: "draft" | "likely" | "verified";
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
  confidence: "draft" | "likely" | "verified";
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
  sources: Source[];
  confidence: "draft" | "likely" | "verified";
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
}

/**
 * Everything past `draft` is built into the site. `likely` entries are marked
 * with data-unverified so the off-by-default header toggle can hide them, and
 * their pages carry noindex. `draft` never ships (PLAN 8).
 */
const published = <T extends { confidence: string }>(xs: T[]): T[] =>
  xs.filter((x) => x.confidence !== "draft");

/** Toggle default: on while developing, off for any build. Persisted per reader. */
export const SHOW_UNVERIFIED_BY_DEFAULT = import.meta.env.DEV;

export const isUnverified = (x: { confidence: string }): boolean => x.confidence !== "verified";

const byId = (a: { id: string }, b: { id: string }) => a.id.localeCompare(b.id);

export const terms: Term[] = published(values<Term>(termMods)).sort(byId);
export const symbols: Symbol_[] = published(values<Symbol_>(symbolMods)).sort(byId);
export const phrases: Phrase[] = published(values<Phrase>(phraseMods)).sort(byId);
export const conventions: Convention[] = published(values<Convention>(conventionMods)).sort(byId);
export const curriculum: CurriculumUnit[] = values<CurriculumUnit>(curriculumMods).sort(byId);

export const termById = new Map(terms.map((t) => [t.id, t]));

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

export const MAPPING_LABELS: Record<string, string> = {
  exact: "1対1で対応",
  near: "近いが同じではない",
  none: "対応する語がない",
};
