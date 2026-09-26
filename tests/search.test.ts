import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  BIT_GLOSS,
  createIndex,
  expand,
  lookup,
  queryForms,
  scan,
  search,
  tokenize,
  type CompactIndex,
} from "../src/lib/search";

const indexPath = path.resolve(__dirname, "..", "public", "search-index.json");
const index: CompactIndex = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const docs = expand(index);
const mini = createIndex(docs);

const ids = (q: string) => lookup(docs, mini, q).map((d) => d.id);
const miniIds = (q: string) => search(mini, q).map((d) => d.id);
const scanIds = (q: string) => lookup(docs, null, q).map((d) => d.id);

describe("tokenize", () => {
  it("keeps latin words whole", () => {
    expect(tokenize("quadratic formula")).toEqual(["quadratic", "formula"]);
  });

  it("emits the run plus every bigram for Japanese", () => {
    expect(tokenize("解の公式")).toEqual(["解の公式", "解の", "の公", "公式"]);
  });
});

describe("the three queries named in PLAN.md 13", () => {
  for (const [name, find] of [
    ["MiniSearch", miniIds],
    ["the page's lookup", ids],
    ["the scan before MiniSearch is built", scanIds],
  ] as const) {
    it(`${name}: 解の公式 from its reading, romaji and English`, () => {
      expect(find("かいのこうしき")).toContain("quadratic-formula");
      expect(find("kainokoushiki")).toContain("quadratic-formula");
      expect(find("quadratic")).toContain("quadratic-formula");
    });
  }
});

describe("partial and mixed input", () => {
  it("matches a kanji substring, not just the head of the word", () => {
    expect(ids("公式")).toContain("quadratic-formula");
  });

  it("matches on a prefix while the user is still typing", () => {
    expect(ids("へいほう")).toContain("completing-the-square");
    expect(ids("quad")).toContain("quadratic-formula");
  });

  it("reaches an entry through its English alternate", () => {
    expect(ids("plug in")).toContain("substitute");
  });

  it("reaches phrases through the Japanese intent", () => {
    expect(ids("詰まって")).toContain("office-hours-stuck-at-step");
    expect(scanIds("詰まって")).toContain("office-hours-stuck-at-step");
  });

  it("returns nothing for a query with no match", () => {
    expect(ids("ゼータ関数の非自明な零点")).toHaveLength(0);
  });

  it("reads a finished romaji word with a trailing n as ん", () => {
    expect(queryForms("bibun")).toContain("びぶん");
    expect(scanIds("bibun")[0]).toBe("differentiation");
  });
});

describe("ranking on the page", () => {
  it("puts the exact headword first", () => {
    expect(ids("微分")[0]).toBe("differentiation");
    expect(ids("せきぶん")[0]).toBe("integration");
    expect(ids("integral")[0]).toBe("integral");
  });

  it("still finds symbols that MiniSearch's tokenizer drops", () => {
    expect(ids("≤").length).toBeGreaterThan(0);
  });
});

describe("the compact index", () => {
  it("has one document per published entry, with unique keys", () => {
    const keys = new Set(docs.map((d) => d.key));
    expect(keys.size).toBe(docs.length);
  });

  it("derives URLs with a trailing slash, phrases under their situation", () => {
    const term = docs.find((d) => d.key === "t:quadratic-formula")!;
    expect(term.url).toBe("/terms/quadratic-formula/");
    const phrase = docs.find((d) => d.key === "p:office-hours-stuck-at-step")!;
    expect(phrase.url).toBe("/phrases/office-hours/#office-hours-stuck-at-step");
  });

  it("marks explanatory translations (説明の訳) and nothing else", () => {
    const gloss = index.docs.filter((d) => d[6] & BIT_GLOSS).map((d) => d[1]);
    expect(gloss).toContain("rate");
    expect(gloss).toContain("one-sixth-formula");
    expect(gloss).not.toContain("sign-chart");
    expect(gloss).not.toContain("quadratic-formula");
    expect(docs.find((d) => d.id === "rate")!.gloss).toBe(true);
  });

  it("scan and lookup agree on the first hit for a plain headword", () => {
    expect(scan(docs, "解の公式")[0].id).toBe("quadratic-formula");
    expect(ids("解の公式")[0]).toBe("quadratic-formula");
  });
});
