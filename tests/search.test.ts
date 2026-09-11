import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { createIndex, search, tokenize, type SearchDoc } from "../src/lib/search";

const indexPath = path.resolve(__dirname, "..", "public", "search-index.json");
const docs: SearchDoc[] = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const mini = createIndex(docs);

const ids = (q: string) => search(mini, q).map((d) => d.id);

describe("tokenize", () => {
  it("keeps latin words whole", () => {
    expect(tokenize("quadratic formula")).toEqual(["quadratic", "formula"]);
  });

  it("emits the run plus every bigram for Japanese", () => {
    expect(tokenize("解の公式")).toEqual(["解の公式", "解の", "の公", "公式"]);
  });
});

describe("the three queries named in PLAN.md 13", () => {
  it("finds 解の公式 from its reading", () => {
    expect(ids("かいのこうしき")).toContain("quadratic-formula");
  });

  it("finds 解の公式 from romaji", () => {
    expect(ids("kainokoushiki")).toContain("quadratic-formula");
  });

  it("finds it from English", () => {
    expect(ids("quadratic")).toContain("quadratic-formula");
  });
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
  });

  it("returns nothing for a query with no match", () => {
    expect(ids("ゼータ関数の非自明な零点")).toHaveLength(0);
  });
});
