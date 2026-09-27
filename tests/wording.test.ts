import { describe, expect, it } from "vitest";
import { CLAIM_FIELDS, judgementSentences, unverifiableSentences } from "../scripts/lib/wording";

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

  it("flags claims about English at large unless the sentence names what was checked (監査 3 の抜き取り)", () => {
    expect(unverifiableSentences("英語には「微分係数」に当たる独立した名詞がなく、the derivative at a point と言う。")).toHaveLength(1);
    expect(unverifiableSentences("この公式に英語の決まった名前はない。")).toHaveLength(1);
    expect(unverifiableSentences("見出しの cross method も英語の決まった名前ではない。")).toHaveLength(1);
    expect(unverifiableSentences("「変域」1 語に当たる語は用例コーパスと参照に出てこない。")).toEqual([]);
    expect(unverifiableSentences("OpenStax Prealgebra にはこの図の決まった名前はない。")).toEqual([]);
    expect(unverifiableSentences("英語には x と y の 2 つの言い方がある。")).toEqual([]);
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

describe("judgementSentences (Phase 5 監査 6 の決定 8)", () => {
  it("finds how the corpus was counted and how the headword was settled", () => {
    expect(judgementSentences("用例コーパスでは the span of の形で数えた。span は区間の意味でも使う。")).toEqual(["用例コーパスでは the span of の形で数えた。"]);
    expect(judgementSentences("用例コーパスでは話・書とも決まらなかった。")).toHaveLength(1);
    expect(judgementSentences("見出しは Levin の本の呼び方（2.1 ほか 4 件）。")).toHaveLength(1);
    expect(judgementSentences("AP の CED の呼び方を見出しにした。")).toHaveLength(1);
    // the sentence before named the corpus
    expect(judgementSentences("そのため数え上げの形だけを数えた。")).toHaveLength(1);
    expect(judgementSentences("PIE は pie chart と同じ語なので数えなかった。")).toHaveLength(1);
    expect(judgementSentences("用例コーパスでは a tree の形で数え、a tree diagram を除いた。")).toHaveLength(1);
    expect(judgementSentences("order matters ／ order doesn't matter をまとめて数え、両方に出てくる。")).toHaveLength(1);
  });

  it("leaves a learner's note alone", () => {
    expect(judgementSentences("講義では A、教科書では B を多く使う（用例コーパス）。")).toEqual([]);
    expect(judgementSentences("一番上の 1 を row 0 と数えると、n 段目が (a + b)ⁿ の係数になる。")).toEqual([]);
    expect(judgementSentences("データを数え、種類や階級ごとの個数にまとめる。")).toEqual([]);
    expect(judgementSentences("IM は ratio を Grade 6 の glossary の見出しにしている。")).toEqual([]);
    expect(judgementSentences("英語の見出しは訳語で、決まった言い方ではない。")).toEqual([]);
  });
});

