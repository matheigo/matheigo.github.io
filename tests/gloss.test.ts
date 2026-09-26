import { describe, expect, it } from "vitest";
import { holdsReferenceWording, isExplanatoryTranslation, referenceWordings } from "../src/lib/gloss";

// DECISIONS, Phase 5 監査 セッション 2, H-2: the 説明の訳 mark is not put on a term
// whose en holds a noun that a CED or a reference calls a concept (make a sign chart)
const noFixed = { code: "corpus-no-fixed-expression", note: "英語に決まった言い方がない（話 0 件 ／ 書 0 件）" };
const ced = { type: "reference", title: "College Board, AP Calculus AB and BC Course and Exam Description (Effective Fall 2020)", note: "Unit 9 の概要（sign chart）" };

const terms = [
  { id: "sign-chart", en: { term: "sign chart" }, mapping: "none", confidence: "verified", sources: [ced], flags: [{ code: "corpus-reference-fallback", note: "見出しは CED の呼び方 sign chart（unit9）" }] },
  { id: "ratio", en: { term: "ratio" }, mapping: "exact", confidence: "verified", sources: [{ type: "textbook", title: "OpenStax Prealgebra 2e" }] },
  { id: "two-circles", en: { term: "two circles" }, mapping: "exact", confidence: "draft", sources: [{ type: "textbook", title: "OpenStax Precalculus 2e" }] },
  { id: "by-wikipedia", en: { term: "modular multiplicative inverse" }, mapping: "exact", confidence: "likely", sources: [{ type: "editorial" }], flags: [{ code: "corpus-reference-fallback", note: "見出しは Wikipedia の記事名 Modular multiplicative inverse" }] },
  { id: "rate", en: { term: "ratio to the base amount" }, mapping: "none", confidence: "likely", sources: [{ type: "editorial" }], flags: [noFixed] },
  { id: "make-a-sign-chart", en: { term: "make a sign chart" }, mapping: "none", confidence: "likely", sources: [{ type: "editorial" }], flags: [noFixed] },
];

describe("referenceWordings", () => {
  it("collects two-word-or-longer en.terms backed by a CED / reference, not drafts, paraphrases or Wikipedia names", () => {
    const w = referenceWordings(terms);
    expect(w.has("sign chart")).toBe(true);
    expect(w.has("ratio")).toBe(false); // one word
    expect(w.has("two circles")).toBe(false); // draft
    expect(w.has("modular multiplicative inverse")).toBe(false); // settled by a Wikipedia article name
    expect(w.has("ratio to the base amount")).toBe(false); // itself a paraphrase
  });
});

describe("isExplanatoryTranslation", () => {
  const w = referenceWordings(terms);

  it("marks mapping none + corpus-no-fixed-expression, and nothing else", () => {
    expect(isExplanatoryTranslation(terms[4])).toBe(true);
    expect(isExplanatoryTranslation(terms[0])).toBe(false);
    expect(isExplanatoryTranslation({ mapping: "near", flags: [noFixed] })).toBe(false);
  });

  it("does not mark a paraphrase that holds a reference wording, when the wordings are given", () => {
    expect(isExplanatoryTranslation(terms[5])).toBe(true);
    expect(isExplanatoryTranslation(terms[5], w)).toBe(false);
    expect(holdsReferenceWording("make a sign chart", w)).toBe("sign chart");
    expect(isExplanatoryTranslation(terms[4], w)).toBe(true); // "ratio" is one word: rate stays a paraphrase
    expect(holdsReferenceWording("Sign-Chart method", w)).toBe("sign chart"); // hyphen and case do not matter
    expect(holdsReferenceWording("assign charts", w)).toBeNull(); // whole words only
  });
});
