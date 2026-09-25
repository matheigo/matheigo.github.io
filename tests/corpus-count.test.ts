import { describe, expect, it } from "vitest";
import { bodyTexts, corpusCountSentences, sentences } from "../scripts/lib/corpus-count";

// DECISIONS, Phase 2 中学の単元 2 の前の修正 1: counts from the example corpus stay
// in evidence; counts from the references (CED, OpenStax, IM, CK-12, Nicholson,
// Levin) may be written
describe("corpusCountSentences", () => {
  it("flags a count that speaks of the corpus", () => {
    expect(corpusCountSentences("話し言葉で 825 件（Khan Academy 437・MIT OCW 105）。")).toHaveLength(1);
    expect(corpusCountSentences("用例コーパスで 0 件。")).toHaveLength(1);
    expect(corpusCountSentences("書き言葉 20 件（OpenStax Prealgebra 13・OpenStax Elementary Algebra 7）。")).toHaveLength(1);
  });

  it("lets a count of a named reference stand", () => {
    expect(corpusCountSentences("IM Geometry は circumscribed circle と書く（18 件）。")).toEqual([]);
    expect(corpusCountSentences("OpenStax Prealgebra は divisibility test と書く（13 件）。")).toEqual([]);
    expect(corpusCountSentences("CED・OpenStax・IM・CK-12 とも 0 件。Levin の本では 5 件。")).toEqual([]);
  });

  it("flags a count that names no reference", () => {
    expect(corpusCountSentences("prove the identity は 5 件。")).toEqual(["prove the identity は 5 件。"]);
  });

  it("leaves a comparison without a count alone", () => {
    expect(corpusCountSentences("話し言葉では take the derivative が多く、書き言葉では differentiate が多い。")).toEqual([]);
  });

  it("does not cut a sentence at a 。 inside parentheses", () => {
    expect(sentences("IM は A と書く（B は少ない。C は 3 件）。次の文。")).toEqual(["IM は A と書く（B は少ない。C は 3 件）。", "次の文。"]);
    expect(corpusCountSentences("CK-12 は A と書く（B は 3 件。C は 1 件）。")).toEqual([]);
  });
});

describe("bodyTexts", () => {
  it("walks the prose and leaves evidence, flags and sources out", () => {
    const texts = bodyTexts({
      id: "x",
      mapping_note: "note",
      pitfalls: ["p0"],
      en: { term: "t", variants: [{ term: "v", register: "spoken", note: "vn" }] },
      evidence: { spoken: { t: 3 } },
      flags: [{ code: "c", note: "話し言葉で 3 件" }],
      sources: [{ type: "editorial" }],
    });
    expect(texts.map(([f]) => f)).toEqual(["id", "mapping_note", "pitfalls[0]", "en.term", "en.variants[0].term", "en.variants[0].register", "en.variants[0].note"]);
  });
});

describe("counts set against each other", () => {
  it("flags 138 対 353 and a corpus threshold, not 1 対 1", () => {
    expect(corpusCountSentences("plug in のほうが多い（OCW で 138 対 353）。")).toHaveLength(1);
    expect(corpusCountSentences("どちらも 10 件未満で、OpenStax の節の名前を見出しにした。")).toHaveLength(1);
    expect(corpusCountSentences("f が 1 対 1 のときに存在する。")).toEqual([]);
  });
});
