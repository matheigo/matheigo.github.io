import { describe, expect, it } from "vitest";
import { cedNoteGroups, cedSectionTexts, checkCedNote, sectionsIn, wordPattern } from "../scripts/lib/ced-notes";

// DECISIONS, Phase 5 監査 セッション 2, H-3: a CED source's note ("Topic 5.4（first
// derivative test）") is checked against the CED's own text
describe("sectionsIn", () => {
  it("reads topics, ranges, lists and units", () => {
    expect(sectionsIn("Topic 5.4")).toEqual(["5.4"]);
    expect(sectionsIn("Topic 8.4–8.6")).toEqual(["8.4", "8.5", "8.6"]);
    expect(sectionsIn("topic 3.14・3.15")).toEqual(["3.14", "3.15"]);
    expect(sectionsIn("Topic 6.4、6.5、8.3")).toEqual(["6.4", "6.5", "8.3"]);
    expect(sectionsIn("Unit 9 の概要")).toEqual(["unit9"]);
    expect(sectionsIn("Unit 5")).toEqual(["unit5:*"]);
  });
});

describe("cedNoteGroups", () => {
  it("binds each （…） group to the sections named before it", () => {
    expect(cedNoteGroups("Unit 9 の概要（sign chart）、Topic 5.4（first derivative test）・5.6（concavity）")).toEqual([
      { sections: ["unit9"], words: ["sign chart"] },
      { sections: ["5.4"], words: ["first derivative test"] },
      { sections: ["5.6"], words: ["concavity"] },
    ]);
  });

  it("splits the words at ／ 、 ・ 。 and と, and skips Japanese pieces", () => {
    expect(cedNoteGroups("Topic 6.2（left ／ right ／ midpoint Riemann sums と trapezoidal sums）、6.3")).toEqual([
      { sections: ["6.2"], words: ["left", "right", "midpoint Riemann sums", "trapezoidal sums"] },
    ]);
    expect(cedNoteGroups("Topic 8.4–8.6（area between curves。x の関数・y の関数）")).toEqual([
      { sections: ["8.4", "8.5", "8.6"], words: ["area between curves"] },
    ]);
  });

  it("lets a piece name its own topic and falls back to sections named earlier", () => {
    expect(cedNoteGroups("Unit 7（Topic 7.3 slope fields、7.6 separation of variables。7.5・7.9 は BC のみ）")).toEqual([
      { sections: ["unit7:*", "7.3", "7.6"], words: ["slope fields", "separation of variables"] },
    ]);
    expect(cedNoteGroups("Topic 1.2（approaches）。同じ topic（as x approaches）")).toEqual([
      { sections: ["1.2"], words: ["approaches"] },
      { sections: ["1.2"], words: ["as x approaches"] },
    ]);
  });

  it("returns nothing for a note without a section or without English words", () => {
    expect(cedNoteGroups("Mathematical Practices（justification）")).toEqual([]);
    expect(cedNoteGroups("Topic 3.14・3.15")).toEqual([]);
  });
});

describe("wordPattern", () => {
  it("matches inflections and short gaps, not other words", () => {
    expect(wordPattern("midpoint Riemann sums").test("a midpoint riemann sum, or a trapezoidal sum")).toBe(true);
    expect(wordPattern("oscillate").test("if the function is oscillating near this value")).toBe(true);
    expect(wordPattern("integrating using long division").test("integrating functions using long division and completing")).toBe(true);
    expect(wordPattern("shape, center, and variability").test("students describe shape, center, and variability (spread)")).toBe(true);
    expect(wordPattern("sign chart").test("a sign change of the derivative")).toBe(false);
    expect(wordPattern("class").test("the classes of functions")).toBe(true);
    expect(wordPattern("radius").test("the radius of the circle")).toBe(true);
  });
});

describe("checkCedNote", () => {
  const ced = new Map<string, string>([
    ["unit9", "as with analysis of graphs, sign charts can be useful tools"],
    ["5.4", "the first derivative test for local extrema"],
    ["5.6", "points of inflection and concavity"],
    ["6.2", "a left riemann sum, a right riemann sum, a midpoint riemann sum, or a trapezoidal sum"],
  ]);

  it("passes a note whose words the named sections use", () => {
    expect(checkCedNote("Unit 9 の概要（sign chart）、Topic 5.4（first derivative test）・5.6（concavity）", ced)).toEqual([]);
    expect(checkCedNote("Topic 6.2（left ／ right ／ midpoint Riemann sums と trapezoidal sums）", ced)).toEqual([]);
    expect(checkCedNote("Topic 5.6（point of inflection）", ced)).toEqual([]);
  });

  it("reports a word the section does not use, and a section the CED does not have", () => {
    expect(checkCedNote("Topic 5.4（sandwich theorem）", ced)).toEqual([{ word: "sandwich theorem", sections: ["5.4"], noSuchSection: false }]);
    expect(checkCedNote("Topic 3.3（inverse trigonometric functions）", ced)).toEqual([
      { word: "inverse trigonometric functions", sections: ["3.3"], noSuchSection: true },
    ]);
  });

  it("reads a unit without の概要 as the opener and its topics", () => {
    expect(checkCedNote("Unit 5（concavity）", ced)).toEqual([]);
    expect(checkCedNote("Unit 9（first derivative test）", ced)).toEqual([{ word: "first derivative test", sections: ["unit9:*"], noSuchSection: false }]);
  });
});

// Phase 5 監査 5 の決定 5 and 9 (audit 4 report H-7, audit 3 report H-6): validate and the audit's ced tool
// read the CED through one function, which cuts it as cedSections does and keeps the CED's own spelling
// next to the normalized one, so "scatterplot" in a note is found where the CED writes it in one word
describe("cedSectionTexts", () => {
  const ced = [
    "front matter",
    "UNIT 1",
    "Exploring One-Variable Data",
    "TOPIC 1.1",
    "A scatterplot shows two variables.",
    "TOPIC 1.2",
    "Boxplots here.",
    "Exam Overview",
    "the exam",
  ].join("\n");

  it("cuts the CED into the sections validate names (front, unit openers, topics, exam)", () => {
    expect([...cedSectionTexts(ced).keys()]).toEqual(["front", "unit1", "1.1", "1.2", "exam"]);
  });

  it("finds a note's word in the CED's own spelling and in the normalized one", () => {
    const m = cedSectionTexts(ced);
    expect(checkCedNote("Topic 1.1（scatterplot）", m)).toEqual([]);
    expect(checkCedNote("Topic 1.1（scatter plot）", m)).toEqual([]);
    expect(checkCedNote("Topic 1.2（boxplot ／ box plot）", m)).toEqual([]);
    expect(checkCedNote("Topic 1.2（scatter plot）", m)).toHaveLength(1);
  });
});
