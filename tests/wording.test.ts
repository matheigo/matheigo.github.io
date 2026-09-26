import { describe, expect, it } from "vitest";
import { CLAIM_FIELDS, unverifiableSentences } from "../scripts/lib/wording";

// DECISIONS, Phase 5 監査 セッション 2, H-5: STYLE's forbidden wordings (通じる,
// 一番よく使う, 減点されない) become validate warnings in the claim fields
describe("unverifiableSentences", () => {
  it("flags 通じる, 一番よく使う and 減点", () => {
    expect(unverifiableSentences("略号は米国の答案では理由としてそのまま通じる。")).toHaveLength(1);
    expect(unverifiableSentences("名前で言っても通じないので、中身を言う。")).toHaveLength(1);
    expect(unverifiableSentences("plug in が一番よく使う言い方。")).toHaveLength(1);
    expect(unverifiableSentences("+C を忘れても減点されない。")).toHaveLength(1);
  });

  it("flags ことが多い only when the sentence names no source", () => {
    expect(unverifiableSentences("授業では単に in radians と言うことが多い。")).toEqual(["授業では単に in radians と言うことが多い。"]);
    expect(unverifiableSentences("Khan Academy の講義では substitute と言うことが多い。")).toEqual([]);
    expect(unverifiableSentences("OpenStax Calculus は disk と書くことが多い。")).toEqual([]);
    expect(unverifiableSentences("学習指導要領解説は「増減表」と書くことが多い。")).toEqual([]);
  });

  it("leaves sourced comparisons and plain facts alone", () => {
    expect(unverifiableSentences("話し言葉では take the derivative が多く、書き言葉では differentiate が多い。")).toEqual([]);
    expect(unverifiableSentences("極大・極小は local maximum ／ minimum。")).toEqual([]);
    expect(unverifiableSentences("通じ方は資料で確かめられないので書かない。")).toHaveLength(0);
  });

  it("checks claim fields, not examples", () => {
    expect(CLAIM_FIELDS.terms.test("pitfalls[0]")).toBe(true);
    expect(CLAIM_FIELDS.terms.test("mapping_note")).toBe(true);
    expect(CLAIM_FIELDS.terms.test("examples[0].ja")).toBe(false);
    expect(CLAIM_FIELDS.phrases.test("ja")).toBe(false);
    expect(CLAIM_FIELDS.conventions.test("advice_ja")).toBe(true);
  });
});
