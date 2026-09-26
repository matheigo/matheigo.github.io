import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  balance,
  bookSections,
  candidatesOf,
  cedSections,
  cnxmlToText,
  countEntry,
  countPattern,
  countPhrase,
  countTerm,
  dedupeSections,
  countedAs,
  decide,
  decideRobust,
  dedupe,
  forCollection,
  headsOf,
  inflections,
  mergeCandidates,
  normalize,
  NOT_PLURAL_S,
  referenceHits,
  sameWording,
  sampleTermContexts,
  cedText,
  settleSymbolReading,
  settlePhraseReference,
  phraseBelowFloor,
  phraseDocs,
  phraseGroup,
  PHRASE_ATTESTED,
  settleUndecided,
  sourceWeights,
  spokenLeanHead,
  levelReferenceHead,
  levelReferenceOf,
  levelReferences,
  levelTiersOf,
  matcherFor,
  weigh,
  wikipediaHead,
  wordsFor,
  type CorpusDoc,
  type ReferenceHits,
} from "../scripts/corpus/lib";
import { micaseEvent, parseChat, speakerClass, wordCount } from "../scripts/corpus/micase";

describe("normalize", () => {
  it("reads a typed dy/dx as it is said", () => {
    expect(normalize("solve for dy/dx")).toBe("solve for dy dx");
  });

  it("folds the spellings of L'Hôpital", () => {
    expect(normalize("L'Hôpital's rule, L'Hopital's rule and L'Hospital's rule")).toBe("l'hopital's rule, l'hopital's rule and l'hopital's rule");
  });

  it("folds the spellings of the same spoken form", () => {
    expect(normalize("F-prime of x")).toBe("f prime of x");
    expect(normalize("f prime of x")).toBe("f prime of x");
    expect(normalize("x-squared plus 1")).toBe("x squared plus one");
    expect(normalize("d x")).toBe("dx");
  });

  it("reads an en dash between two words as the hyphen of one word", () => {
    expect(normalize("write it in slope\u2013intercept form")).toBe("write it in slope-intercept form");
    expect(countTerm(normalize("the slope\u2013intercept form"), "intercept form")).toBe(0);
    expect(normalize("x \u2013 y")).toBe("x \u2013 y");
  });

  it("drops transcript markup", () => {
    expect(normalize("so [INAUDIBLE] we integrate")).toBe("so we integrate");
  });

  it("repairs the common transcription slips", () => {
    expect(normalize("the intergral of the derivitive")).toBe("the integral of the derivative");
  });

  it("rejoins a variable and its hyphenated suffix split by inline math", () => {
    expect(normalize("the x -axis and the y -intercept")).toBe("the x-axis and the y-intercept");
    expect(normalize("a - b")).toBe("a - b");
  });

  it("folds hyphenation of the same word, but not a subscript read aloud", () => {
    expect(normalize("do a u substitution")).toBe("do a u-substitution");
    expect(normalize("the anti-derivative, the anti derivative")).toBe("the antiderivative, the antiderivative");
    expect(normalize("u sub n")).toBe("u sub n");
  });
});

describe("PHRASE_FORMS (DECISIONS, Phase 3 の準備: フレーズの数え方)", () => {
  it("counts a phrase by its key part, with the blank and inflection of terms", () => {
    const re = matcherFor("phrases")(countedAs("phrases", "class-asking-repeat", "Sorry, could you say that again?"))!;
    expect(normalize("sorry, could you say that last part again? and can you say that again").match(re)?.length).toBe(2);
    expect(countTerm(normalize("i started by factoring. we start by factoring."), "i started by | i start by")).toBe(1);
    expect(countTerm(normalize("let me walk you through it"), "walk … through")).toBe(1);
  });

  it("does not count a sentence whose key part cannot be told apart", () => {
    const entry = {
      id: "written-solution-therefore",
      en: "Therefore x = 3 is the only solution.",
      variants: [{ en: "Hence x = 3 is the only solution." }, { en: "So x = 3 is the only solution." }],
    };
    expect(candidatesOf("phrases", entry)).toEqual(["therefore", "hence"]);
  });
});

describe("countPhrase", () => {
  const text = normalize("just plug in x equals two, then plug into the formula, and plug in again");

  it("counts whole phrases only", () => {
    expect(countPhrase(text, "plug in")).toBe(2);
    expect(countPhrase(text, "plug into")).toBe(1);
  });

  it("returns zero rather than a partial match", () => {
    expect(countPhrase(text, "plug in the quadratic formula")).toBe(0);
  });
});

describe("countTerm", () => {
  it("folds plural, third person, past and -ing of content words", () => {
    const text = normalize("riemann sums and a riemann sum; we revolved it, she revolves it, revolving it");
    expect(countTerm(text, "Riemann sum")).toBe(2);
    expect(countTerm(text, "revolve")).toBe(3);
    expect(inflections("revolve")).toEqual(expect.arrayContaining(["revolve", "revolves", "revolved", "revolving"]));
  });

  it("keeps a final ss as part of the word", () => {
    const text = normalize("the graph is compressed horizontally; compress it horizontally; it compresses");
    expect(countTerm(text, "compress horizontally")).toBe(1);
    expect(countTerm(text, "compress")).toBe(3);
  });

  it("matches closed-class words as written", () => {
    const text = normalize("take these antiderivatives. take the thing antiderivative");
    expect(countTerm(text, "take the antiderivative")).toBe(0);
    expect(countTerm(normalize("part on"), "part one")).toBe(0);
  });

  it("keeps different words apart", () => {
    const text = normalize("integration by parts, integrate by parts, integral");
    expect(countTerm(text, "integrate by parts")).toBe(1);
    expect(countTerm(text, "integral")).toBe(1);
  });

  it("reads … as a blank of one to three words", () => {
    const text = normalize(
      "rotate it around the x-axis. rotate this region around the x-axis. rotate the shaded region here around the x-axis. rotate around the x-axis",
    );
    expect(countTerm(text, "rotate … around the x-axis")).toBe(2);
    expect(countTerm(text, "rotate ... around the x-axis")).toBe(2);
    expect(countTerm(text, "rotate around the x-axis")).toBe(1);
  });

  it("does not let a blank run past the end of a sentence", () => {
    expect(countTerm(normalize("we rotate. around the x-axis"), "rotate … around the x-axis")).toBe(0);
  });

  it("is countPhrase for a wording with no content word to fold", () => {
    const text = normalize("plug it in, plug in, plug into");
    expect(countTerm(text, "plug in")).toBe(countPhrase(text, "plug in"));
  });
});

describe("words ending in e", () => {
  // DECISIONS, Phase 2 統計・ベクトルの単元: dropping the e makes another word
  it("does not fold mode into mod, or plane into plan", () => {
    expect(inflections("mode")).not.toContain("mod");
    expect(inflections("plane")).not.toContain("plan");
    expect(inflections("plan")).not.toContain("plane");
    expect(inflections("mode")).toContain("modes");
  });

  it("still finds the lemma of an -ing form", () => {
    expect(inflections("completing")).toContain("complete");
    expect(inflections("revolved")).toContain("revolve");
  });
});

describe("short stems", () => {
  it("does not fold a three-letter word down to two letters", () => {
    expect(countTerm("the pivots d one up to dn. the limit is dne.", "DNE")).toBe(1);
    expect(countTerm("let us use it. we used it.", "use")).toBe(2);
  });
});

describe("a final s that is not a plural, and y / ies / ied", () => {
  it("does not fold a proper name into another word (Bayes is not bays)", () => {
    expect(inflections("bayes")).not.toContain("bay");
    expect(sameWording("Bayes theorem", "bay theorem")).toBe(false);
    expect(countTerm(normalize("the bay and the bays"), "Bayes")).toBe(0);
    expect(countTerm(normalize("by Bayes rule"), "Bayes rule")).toBe(1);
  });

  it("keeps the s of -us, -is and a listed noun, and still takes -es / -ed", () => {
    expect(inflections("bias")).toEqual(expect.arrayContaining(["bias", "biases", "biased"]));
    expect(inflections("bias")).not.toContain("bia");
    expect(inflections("census")).toContain("censuses");
    expect(inflections("focus")).toEqual(expect.arrayContaining(["focuses", "focused", "foci"]));
  });

  it("folds vary / varies / varied / varying and probability / probabilities", () => {
    expect(inflections("vary")).toEqual(expect.arrayContaining(["vary", "varies", "varied", "varying"]));
    expect(inflections("varies")).toContain("vary");
    expect(sameWording("probabilities", "probability")).toBe(true);
    expect(inflections("survey")).toEqual(expect.arrayContaining(["surveys", "surveyed", "surveying"]));
  });

  it("lists every capitalized name ending in s that an entry uses", () => {
    const words = new Set<string>();
    const root = path.join(__dirname, "..", "data");
    for (const c of ["terms", "symbols", "phrases"]) {
      for (const f of fs.readdirSync(path.join(root, c))) {
        const d = JSON.parse(fs.readFileSync(path.join(root, c, f), "utf8"));
        const texts = typeof d.en === "string" ? [d.en] : [d.en?.term, ...(d.en?.alt ?? []), ...(d.en?.variants ?? []).map((v: { term: string }) => v.term)];
        for (const t of texts) for (const w of String(t ?? "").match(/\b[A-Z][a-z]+s\b(?!')/g) ?? []) words.add(w);
      }
    }
    // a capitalized word ending in s that is a name and not a plural (Apollonius, Bayes);
    // sentence-initial words ("Oops, …") and a capitalized plural (the phrase "… are Tuesdays from 2 to 4") are not names
    const names = [...words].filter((w) => !["Does", "Is", "Has", "This", "Its", "Oops", "Tuesdays"].includes(w));
    for (const w of names) expect(NOT_PLURAL_S.has(w.toLowerCase()) || /(?:ss|us|is)$/.test(w.toLowerCase()), w).toBe(true);
  });
});

describe("irregular plurals", () => {
  it("counts local extrema as local extremum", () => {
    expect(countTerm("find the local extrema. a local extremum is", "local extremum")).toBe(2);
    expect(countTerm("the relative maxima and minima", "relative maximum")).toBe(1);
  });

  it("treats the Latin plural as the same wording", () => {
    expect(sameWording("local extremum", "local extrema")).toBe(true);
    expect(sameWording("axis of rotation", "axes of rotation")).toBe(true);
    expect(sameWording("local maximum", "local minimum")).toBe(false);
  });
});

describe("countEntry", () => {
  const doc = (id: string, text: string, register: "spoken" | "written" = "spoken") => ({
    id,
    register,
    auto: false,
    text: normalize(text),
  });

  it("counts an occurrence once when two wordings of a group match it", () => {
    const t = countEntry([doc("mit-18.01", "riemann sums, a riemann sum")], "terms", ["Riemann sum", "Riemann sums"], "Riemann sum");
    expect(t.spoken).toEqual({ "Riemann sum": { "mit-18.01": 2 } });
    expect(t.merges).toEqual([{ into: "Riemann sum", from: ["Riemann sums"] }]);
  });

  it("folds a blank with the same phrase without it", () => {
    const t = countEntry(
      [doc("khan-ap-calc", "rotate it around the x-axis, then rotate around the x-axis")],
      "terms",
      ["rotate … around the x-axis", "rotate around the x-axis"],
      "rotate … around the x-axis",
    );
    expect(t.spoken["rotate … around the x-axis"]).toEqual({ "khan-ap-calc": 2 });
  });

  it("keeps the registers apart and lists the sources", () => {
    const t = countEntry(
      [doc("mit-18.01", "the midpoint rule"), doc("openstax-calculus", "the midpoint rule", "written")],
      "terms",
      ["midpoint rule"],
      "midpoint rule",
    );
    expect(t.spoken["midpoint rule"]).toEqual({ "mit-18.01": 1 });
    expect(t.written["midpoint rule"]).toEqual({ "openstax-calculus": 1 });
    expect(t.sources).toEqual(["mit-18.01", "openstax-calculus"]);
  });
});

describe("countPattern", () => {
  const text = normalize(
    "so the integral from 0 to 1 of x squared, and the integral from negative infinity to infinity of e to the minus x squared. " +
      "the integral of f of x from a to b",
  );

  it("lets each * stand for one to five words", () => {
    expect(countPattern(text, "the integral from * to * of")).toBe(2);
    expect(countPattern(text, "the integral of * from * to *")).toBe(1);
  });

  it("needs at least one word in each slot, and matches whole words", () => {
    expect(countPattern(normalize("the integral from to of"), "the integral from * to * of")).toBe(0);
    expect(countPattern(normalize("the integrals from 0 to 1 of"), "the integral from * to * of")).toBe(0);
  });

  it("does not stretch a slot past five words", () => {
    const long = normalize("the integral from one two three four five six to 1 of x");
    expect(countPattern(long, "the integral from * to * of")).toBe(0);
  });

  it("without a * it is countPhrase", () => {
    expect(countPattern(text, "the integral")).toBe(countPhrase(text, "the integral"));
  });
});

describe("decide", () => {
  it("① gives one headword when the leader clears 3:1", () => {
    const v = decide({ "plug in": 412, substitute: 133 }, "spoken");
    expect(v.kind).toBe("single");
    expect(headsOf(v)).toEqual(["plug in"]);
  });

  it("① accepts a sole survivor above the floor", () => {
    expect(decide({ "squeeze theorem": 22 }, "written").kind).toBe("single");
  });

  it("② records both when neither leads but each clears 10", () => {
    const v = decide({ "plug in": 40, substitute: 30 }, "spoken");
    expect(v.kind).toBe("both");
    expect(headsOf(v)).toEqual(["plug in", "substitute"]);
  });

  it("② orders the co-headwords by frequency", () => {
    const v = decide({ substitute: 18, "plug in": 44, "sub in": 11 }, "spoken");
    expect(headsOf(v)).toEqual(["plug in", "substitute", "sub in"]);
  });

  it("① takes a leader short of 3:1 when only the leader clears the floor", () => {
    // axis of revolution 13 / axis of rotation 7 (DECISIONS, Phase 2 規則の修正)
    const v = decide({ "axis of revolution": 13, "axis of rotation": 7 }, "written");
    expect(v).toMatchObject({ kind: "single", head: "axis of revolution", runnerUp: "axis of rotation", byFloor: true });
  });

  it("③ is undecided when nothing clears the floor", () => {
    const v = decide({ "plug in": 7, substitute: 5 }, "spoken");
    expect(v).toMatchObject({ kind: "undecided", reason: "too-close" });
  });

  it("③ is undecided when the corpus barely mentions it", () => {
    const v = decide({ "plug in": 6, substitute: 1 }, "spoken");
    expect(v).toMatchObject({ kind: "undecided", reason: "too-few" });
  });

  it("lets the two registers disagree", () => {
    const spoken = decide({ "plug in": 412, substitute: 133 }, "spoken");
    const written = decide({ substitute: 96, "plug in": 4 }, "written");
    expect(headsOf(spoken)).toEqual(["plug in"]);
    expect(headsOf(written)).toEqual(["substitute"]);
  });

  it("returns no heads for an undecided register", () => {
    expect(headsOf(decide({ x: 2 }, "spoken"))).toEqual([]);
  });
});

describe("decideRobust", () => {
  const even = { a: 1, b: 1, c: 1, d: 1 };

  it("keeps ① when the leader survives without its biggest source", () => {
    const v = decideRobust({ "find an antiderivative": { a: 30, b: 30, c: 30 }, "take the antiderivative": { a: 5 } }, even, "spoken");
    expect(v.kind).toBe("single");
    expect(v.kind !== "undecided" && v.dependsOn).toBeUndefined();
  });

  it("sets ① side by side when one source carries the leader", () => {
    const v = decideRobust(
      { "take the antiderivative": { a: 81, b: 11 }, "find an antiderivative": { b: 16, c: 7 } },
      even,
      "spoken",
    );
    expect(v).toMatchObject({ kind: "both", demoted: true, heads: ["take the antiderivative", "find an antiderivative"] });
    expect(v.kind === "both" && v.dependsOn).toMatchObject({ source: "a", hits: 81, of: 92 });
  });

  it("keeps ① when the verdict only thins out to ③ without that source", () => {
    const v = decideRobust({ "pick u": { yt: 10, b: 3 }, "choose u": { b: 2 } }, { yt: 1, b: 1 }, "spoken");
    expect(v).toMatchObject({ kind: "single", head: "pick u" });
    expect(v.kind === "single" && v.dependsOn).toMatchObject({ source: "yt", without: { kind: "undecided" } });
  });

  it("keeps ① when the same leader is still first without that source", () => {
    // sigma notation 43 / summation notation 10 -> 21 / 10 without Khan
    const v = decideRobust({ "sigma notation": { khan: 22, b: 21 }, "summation notation": { b: 10 } }, { khan: 1, b: 1 }, "spoken");
    expect(v).toMatchObject({ kind: "single", head: "sigma notation" });
    expect(v.kind === "single" && v.dependsOn).toMatchObject({ source: "khan", without: { kind: "both" } });
  });

  it("does not set a collocation built on the leader beside it", () => {
    const v = decideRobust({ integrand: { os: 77, b: 9 }, "the integrand is odd": { os: 2 } }, { os: 1, b: 1 }, "written");
    expect(v.kind).toBe("single");
    expect(v.kind === "single" && v.dependsOn?.source).toBe("os");
  });

  it("keeps a sole wording at ① and records the dependence", () => {
    const v = decideRobust({ "common denominator": { khan: 25, b: 4 } }, { khan: 1, b: 1 }, "spoken");
    expect(v.kind).toBe("single");
    expect(v.kind === "single" && v.dependsOn?.source).toBe("khan");
  });

  it("leaves ② as ② and records which source leads it", () => {
    const v = decideRobust({ "plug in": { yt: 40, b: 5 }, substitute: { b: 30 } }, { yt: 1, b: 1 }, "spoken");
    expect(v.kind).toBe("both");
    expect(v.kind === "both" && v.demoted).toBeFalsy();
    expect(v.kind === "both" && v.dependsOn?.source).toBe("yt");
  });

  it("leaves ③ alone", () => {
    expect(decideRobust({ x: { a: 3 } }, { a: 1 }, "spoken").kind).toBe("undecided");
  });
});

// DECISIONS, Phase 2 中学の単元 2 の前の修正 3: a spoken leader that rests on one
// source does not set the headword against the written corpus or a CED
describe("spokenLeanHead", () => {
  const w = { k: 1, m: 1, os: 1, b: 1 };
  const ref = (r: Partial<ReferenceHits>): ReferenceHits => ({ ced: {}, openstax: {}, openstaxTitles: {}, ...r });

  it("takes the CED's wording when the written corpus is ③ (negative correlation)", () => {
    // negative linear relationship: 12, all Khan Academy (8 of them one source) -> ③ without it
    const spoken = decideRobust(
      { "negative linear relationship": { k: 8, m: 4 }, "negative correlation": { k: 7 } },
      w,
      "spoken",
    );
    const written = decideRobust({ "negative correlation": { os: 7 }, "negative linear relationship": { os: 1 } }, w, "written");
    expect(spoken).toMatchObject({ kind: "single", head: "negative linear relationship" });
    expect(written.kind).toBe("undecided");
    expect(
      spokenLeanHead(spoken, written, ref({ cedStats: { "negative correlation": { "5.2": 1 } } })),
    ).toEqual({ spoken: "negative linear relationship", source: "k", head: "negative correlation", by: "ced" });
  });

  it("takes the written ① before the CED", () => {
    const spoken = decideRobust({ "linear system": { k: 30, b: 5 }, "system of linear equations": { b: 5 } }, w, "spoken");
    // two written sources: without the bigger one it still leads (not one source)
    const written = decideRobust({ "system of linear equations": { os: 25, m: 15 } }, w, "written");
    // the CED names a third wording: the written corpus comes first
    expect(spokenLeanHead(spoken, written, ref({ ced: { "system of equations": { "1.1": 5 } } }))).toMatchObject({
      head: "system of linear equations",
      by: "written",
    });
  });

  it("keeps the spoken leader when the written corpus or the CED backs it", () => {
    const spoken = decideRobust({ "left riemann sum": { k: 20, b: 2 } }, w, "spoken");
    const written = decideRobust({ "left-endpoint approximation": { os: 15 } }, w, "written");
    // the CED calls it left Riemann sum: the rule does not apply
    expect(spokenLeanHead(spoken, written, ref({ ced: { "left riemann sum": { "6.2": 3 } } }))).toBeNull();
    // the written corpus uses it too
    const both = decideRobust({ "left riemann sum": { os: 12 }, "left-endpoint approximation": { os: 15 } }, w, "written");
    expect(spokenLeanHead(spoken, both, ref({}))).toBeNull();
  });

  it("reads a written = as the spoken equal (let u = is let u equal)", () => {
    const spoken = decideRobust({ "let u equal": { k: 12, b: 2 }, "set u equal to": { b: 3 } }, w, "spoken");
    const written = decideRobust({ "let u =": { os: 88 } }, w, "written");
    expect(spokenLeanHead(spoken, written, ref({}))).toBeNull();
  });

  it("leaves a leader that only thins out without its source (the same leader, ②)", () => {
    // A 52 / B 10 -> 12 / 10 without k: still A first
    const spoken = decideRobust({ A: { k: 40, b: 12 }, B: { b: 10 } }, w, "spoken");
    expect(spoken.kind === "single" && spoken.dependsOn?.without.kind).toBe("both");
    const written = decideRobust({ B: { os: 30 } }, w, "written");
    expect(spokenLeanHead(spoken, written, ref({}))).toBeNull();
  });

  it("leaves a leader that does not rest on one source", () => {
    const spoken = decideRobust({ A: { k: 20, m: 20, b: 20 } }, w, "spoken");
    const written = decideRobust({ B: { os: 30 } }, w, "written");
    expect(spokenLeanHead(spoken, written, ref({}))).toBeNull();
  });

  // DECISIONS, Phase 2 中学の単元 3 の前の修正 1: the written ① rests on one source too
  const w2 = { k: 1, m: 1, os: 1, calc: 1, b: 1 };
  const leanSpoken = decideRobust({ "rectangular prism": { k: 17, b: 7 } }, w2, "spoken");
  const leanWritten = decideRobust({ "rectangular box": { calc: 22, os: 4 }, "rectangular prism": { os: 3 } }, w2, "written");

  it("takes the level's reference when the written ① rests on one source too", () => {
    expect(leanWritten).toMatchObject({ kind: "single", head: "rectangular box" });
    const im = ref({ im: { "right prism": { "Grade 7 7.12": 5 } } });
    expect(spokenLeanHead(leanSpoken, leanWritten, im, { jp: ["中1"], us: ["Geometry"] })).toMatchObject({
      head: "right prism",
      by: "im",
      written: { head: "rectangular box", source: "calc" },
    });
    // Geometry: CK-12 and IM together; the CED is not read for a 中学 / Geometry word
    const ck = ref({ ck12: { cuboid: { "CK-12 Geometry 11.4": 9 } }, ced: { "rectangular box": { "8.9": 1 } } });
    expect(spokenLeanHead(leanSpoken, leanWritten, ck, { jp: ["数A"], us: ["Geometry"] })).toMatchObject({ head: "cuboid", by: "ck12-im" });
  });

  it("keeps the spoken leader when the level's reference names it or names nothing", () => {
    const im = ref({ im: { "rectangular prism": { "Grade 6 1.1": 116 } } });
    expect(spokenLeanHead(leanSpoken, leanWritten, im, { jp: ["中1"], us: [] })).toMatchObject({
      head: "rectangular prism",
      by: "spoken",
      agrees: "im",
    });
    // Linear Algebra has no level reference (IM, CK-12, the CED and OpenStax Calculus are the four)
    const out = spokenLeanHead(leanSpoken, leanWritten, im, { jp: ["大学"], us: ["Linear Algebra"] });
    expect(out).toMatchObject({ head: "rectangular prism", by: "spoken" });
    expect(out?.agrees).toBeUndefined();
  });

  // Phase 3 の準備の前の修正 1: AP Calculus and Calculus I–III read the CED, then OpenStax Calculus
  const calcSpoken = decideRobust({ "compute the integral": { m: 20, b: 2 } }, w2, "spoken");
  const calcWritten = decideRobust({ "evaluate the integral": { calc: 30, os: 2 } }, w2, "written");

  it("reads OpenStax Calculus after the CED for a calculus word", () => {
    expect(calcWritten).toMatchObject({ kind: "single", head: "evaluate the integral" });
    const os = ref({ openstaxCalculus: { "evaluate the integral": 30 } });
    expect(spokenLeanHead(calcSpoken, calcWritten, os, { jp: ["大学"], us: ["Calculus I"] })).toMatchObject({
      head: "evaluate the integral",
      by: "openstax-calculus",
    });
    expect(spokenLeanHead(calcSpoken, calcWritten, os, { jp: ["数III"], us: ["AP Calculus AB"] })).toMatchObject({
      by: "openstax-calculus",
    });
    // the CED comes first when it names a wording
    const ced = ref({ ced: { "find the integral": { "6.1": 2 } }, openstaxCalculus: { "evaluate the integral": 30 } });
    expect(spokenLeanHead(calcSpoken, calcWritten, ced, { jp: ["数III"], us: ["AP Calculus AB"] })).toMatchObject({
      head: "find the integral",
      by: "ced",
    });
    // OpenStax Calculus names the spoken leader: it stays
    const same = ref({ openstaxCalculus: { "compute the integral": 3 } });
    expect(spokenLeanHead(calcSpoken, calcWritten, same, { jp: ["大学"], us: ["Calculus II"] })).toMatchObject({
      head: "compute the integral",
      by: "spoken",
      agrees: "openstax-calculus",
    });
    // AP Statistics reads the CED only
    expect(spokenLeanHead(calcSpoken, calcWritten, os, { jp: ["数B"], us: ["AP Statistics"] })).toMatchObject({ by: "spoken" });
    // 中3 and AP Calculus: IM names nothing, so the CED and OpenStax Calculus are read next
    expect(spokenLeanHead(calcSpoken, calcWritten, os, { jp: ["中3"], us: ["AP Calculus AB"] })).toMatchObject({
      head: "evaluate the integral",
      by: "openstax-calculus",
    });
    // ... but IM decides when it names a wording
    const im = ref({ im: { "find the integral": { "Grade 8 1.1": 2 } }, openstaxCalculus: { "evaluate the integral": 30 } });
    expect(spokenLeanHead(calcSpoken, calcWritten, im, { jp: ["中3"], us: ["AP Calculus AB"] })).toMatchObject({ by: "im" });
    expect(levelTiersOf({ jp: ["中3"], us: ["Geometry", "AP Calculus AB", "AP Statistics"] })).toEqual(["im", "ck12-im", "calculus"]);
  });

  it("reads one wording counted twice as one (box plot / boxplot tie in the same places)", () => {
    const same = { "Grade 6 12.1": 3 };
    const r = ref({ im: { "box plot": same, boxplot: same }, imGlossary: { "box plot": ["Grade 6"], boxplot: ["Grade 6"] } });
    expect(levelReferenceHead(r, "im", ["box plot", "boxplot"])).toBe("box plot");
    const tie = ref({ im: { A: { x: 2 }, B: { y: 2 } } });
    expect(levelReferenceHead(tie, "im", ["A", "B"])).toBeNull();
  });

  it("still uses the written ① when only the spoken leader rests on one source", () => {
    // constant of variation: two OpenStax books, one of them out and it still leads
    const spoken = decideRobust({ "constant of proportionality": { k: 67, m: 6 } }, w2, "spoken");
    const written = decideRobust({ "constant of variation": { os: 17, calc: 14 }, "constant of proportionality": { b: 4 } }, w2, "written");
    expect(spokenLeanHead(spoken, written, ref({}), { jp: ["中1"], us: [] })).toMatchObject({
      head: "constant of variation",
      by: "written",
    });
  });
});

describe("levelReferenceOf", () => {
  it("takes 中学 first, then Geometry, then calculus, then AP Statistics", () => {
    expect(levelReferenceOf({ jp: ["中3"], us: ["Geometry", "AP Calculus AB"] })).toBe("im");
    expect(levelReferenceOf({ jp: ["数A"], us: ["Geometry"] })).toBe("ck12-im");
    expect(levelReferenceOf({ jp: ["数III"], us: ["AP Calculus AB", "Calculus I"] })).toBe("calculus");
    expect(levelReferenceOf({ jp: ["大学"], us: ["Calculus II"] })).toBe("calculus");
    expect(levelReferenceOf({ jp: ["数B"], us: ["AP Statistics"] })).toBe("ced");
    expect(levelReferenceOf({ jp: ["大学"], us: ["Linear Algebra"] })).toBeNull();
    expect(levelReferences("calculus")).toEqual(["ced", "openstax-calculus"]);
  });
});

describe("settleSymbolReading (rule 2 for symbols)", () => {
  const ref = (r: Partial<ReferenceHits>): ReferenceHits => ({ ced: {}, openstax: {}, openstaxTitles: {}, ...r });
  const order = ["the empty set | an empty set", "the null set"];

  it("reads a symbol the way a reference reads it three times or more", () => {
    const s = settleSymbolReading("empty-set-symbol", ref({ levin: { [order[0]]: { "5.1 Sets": 8, "1.5 Proofs": 4 } } }), order);
    expect(s).toMatchObject({ kind: "reference", by: "levin", head: order[0] });
  });

  it("leaves it undecided when no reference uses a reading three times", () => {
    const hits = ref({ openstax: { [order[0]]: 1 }, im: { [order[0]]: { "Grade 6 1.1": 2 } }, levin: { [order[1]]: { "5.1 Sets": 2 } } });
    expect(settleSymbolReading("empty-set-symbol", hits, order)).toEqual({ kind: "undecided" });
  });

  it("takes a CED reading at three hits or more, before the other references", () => {
    const s = settleSymbolReading("x", ref({ cedStats: { [order[1]]: { "4.7": 2, "4.10": 1 } }, levin: { [order[0]]: { "5.1 Sets": 9 } } }), order);
    expect(s).toMatchObject({ kind: "reference", by: "ced-stats", head: order[1] });
  });

  it("does not take a CED reading used fewer than three times (a term's name: any number)", () => {
    const hits = ref({ cedStats: { [order[1]]: { "4.7": 2 } }, levin: { [order[0]]: { "5.1 Sets": 9 } } });
    expect(settleSymbolReading("x", hits, order)).toMatchObject({ kind: "reference", by: "levin", head: order[0] });
    expect(settleSymbolReading("x", ref({ ced: { [order[1]]: { unit3: 1 } } }), order)).toEqual({ kind: "undecided" });
  });

  it("does not use the Wikipedia article name, and skips the listed symbols", () => {
    const wiki = ref({ wikipedia: { title: "Empty set", via: "en-redirect" } });
    expect(settleSymbolReading("empty-set-symbol", wiki, order)).toEqual({ kind: "undecided" });
    const hits = ref({ openstax: { "the sequence a n": 6 } });
    expect(settleSymbolReading("sequence-braces", hits, ["the sequence a n"])).toEqual({ kind: "undecided" });
  });

  it("counts the body only, not a section title or a glossary headword", () => {
    const hits = ref({ im: { [order[0]]: { "Geometry 7.1": 2 } }, imGlossary: { [order[0]]: ["Geometry"] }, openstaxTitles: { [order[0]]: ["Sets"] } });
    expect(settleSymbolReading("empty-set-symbol", hits, order)).toEqual({ kind: "undecided" });
  });

  it("reads Levin's mathematical italic letters as plain ones", () => {
    expect(cedText("𝑃 ∨ 𝑄 is read “𝑃 or 𝑄” and ℚ stays")).toBe('p ∨ q is read "p or q" and ℚ stays');
    expect(cedText("parallelogram \\(ABCD\\) and the \\(x\\)-intercept")).toBe("parallelogram abcd and the x-intercept");
    expect(countPattern(cedText("𝐴 × 𝐵 is the Cartesian product of 𝐴 and 𝐵"), "the cartesian product of *")).toBe(1);
  });
});

describe("settleUndecided", () => {
  const ref = (r: Partial<ReferenceHits>): ReferenceHits => ({ ced: {}, openstax: {}, openstaxTitles: {}, ...r });
  const order = ["integration by long division", "integrating using long division"];

  it("finds no fixed English expression for a near / none entry under 10 in both registers", () => {
    const s = settleUndecided({ mapping: "near", ja: "長除法による積分", en: order[0] }, { spoken: 0, written: 9 }, ref({}), order);
    expect(s).toEqual({ kind: "no-fixed-expression", spoken: 0, written: 9 });
  });

  it("does not apply that to an exact entry", () => {
    expect(settleUndecided({ mapping: "exact" }, { spoken: 0, written: 0 }, ref({}), order).kind).toBe("undecided");
  });

  it("does not apply that when a register reaches 10", () => {
    const s = settleUndecided({ mapping: "near", ja: "微分の逆", en: "x" }, { spoken: 11, written: 3 }, ref({}), order);
    expect(s.kind).toBe("undecided");
  });

  it("does not apply that to an English name taken over as the headword", () => {
    const s = settleUndecided({ mapping: "none", ja: "LIATE", en: "LIATE" }, { spoken: 2, written: 7 }, ref({ openstax: { LIATE: 7 } }), ["LIATE"]);
    expect(s).toMatchObject({ kind: "reference", by: "openstax", head: "LIATE" });
  });

  it("does not apply that to a wording the CED uses", () => {
    const s = settleUndecided(
      { mapping: "none", ja: "候補点テスト", en: "candidates test" },
      { spoken: 0, written: 0 },
      ref({ ced: { "candidates test": { "5.5": 1 } } }),
      ["candidates test"],
    );
    expect(s).toEqual({ kind: "reference", by: "ced", head: "candidates test", where: ["5.5"] });
  });

  it("does not apply that to a wording one reference uses 3 times or more (CK-12 linear pair)", () => {
    const s = settleUndecided(
      { mapping: "near", ja: "一直線をなす角", en: "linear pair" },
      { spoken: 7, written: 0 },
      ref({ ck12: { "linear pair": { "CK-12 Geometry 1.15 Supplementary Angles": 2, "CK-12 Geometry 2.7 Deductive Reasoning": 1 } } }),
      ["linear pair"],
    );
    expect(s).toMatchObject({ kind: "reference", by: "ck12", head: "linear pair" });
  });

  it("still applies it when no single reference reaches 3 for one wording", () => {
    const s = settleUndecided(
      { mapping: "near", ja: "2 組の角とその間にない 1 辺", en: "angle-angle-side" },
      { spoken: 0, written: 0 },
      ref({ ck12: { "angle-angle-side": { "CK-12 Geometry 4.15 ASA and AAS": 2 }, AAS: { "CK-12 Geometry 4.15 ASA and AAS": 2 } }, im: { AAS: { "Geometry 2.7": 2 } } }),
      ["angle-angle-side", "AAS"],
    );
    expect(s).toEqual({ kind: "no-fixed-expression", spoken: 0, written: 0 });
  });

  it("adds up the forms of one wording in one reference, but not two wordings (Phase 2 中学の単元の前の修正)", () => {
    const aas = "by AAS | AAS congruence | (AAS) congruence | AAS triangle congruence";
    const spelled = "angle-angle-side congruence | angle-angle-side theorem";
    const section = normalize(
      "The Angle-Angle-Side (AAS) Congruence Theorem. The triangles are congruent by AAS. ASA and AAS triangle congruence. The angle-angle-side theorem.",
    );
    const hits = referenceHits([aas, spelled], [], [], [], { ck12: [["CK-12 Geometry 4.15 ASA and AAS", section]] });
    // three forms of one wording in one section: 3
    expect(hits.ck12?.[aas]).toEqual({ "CK-12 Geometry 4.15 ASA and AAS": 3 });
    expect(hits.ck12?.[spelled]).toEqual({ "CK-12 Geometry 4.15 ASA and AAS": 1 });
    const entry = { mapping: "near", ja: "2 組の角とその間にない 1 辺", en: "angle-angle-side" };
    expect(settleUndecided(entry, { spoken: 0, written: 0 }, hits, [spelled, aas])).toMatchObject({ kind: "reference", by: "ck12", head: aas });
    // two forms of one wording (2) and one of another (1) do not add up to 3
    const two = normalize("The triangles are congruent by AAS. ASA and AAS triangle congruence. The angle-angle-side theorem.");
    const fewer = referenceHits([aas, spelled], [], [], [], { ck12: [["CK-12 Geometry 4.15 ASA and AAS", two]] });
    expect(settleUndecided(entry, { spoken: 0, written: 0 }, fewer, [spelled, aas])).toEqual({ kind: "no-fixed-expression", spoken: 0, written: 0 });
  });

  it("takes the CED's name before OpenStax's, with its topics", () => {
    const s = settleUndecided(
      { mapping: "exact" },
      { spoken: 3, written: 4 },
      ref({ ced: { [order[1]]: { unit6: 2, "6.10": 2 } }, openstax: { [order[0]]: 5 } }),
      order,
    );
    expect(s).toEqual({ kind: "reference", by: "ced", head: order[1], where: ["6.10"] });
  });

  it("falls back to OpenStax: body hits and section titles", () => {
    const s = settleUndecided({ mapping: "exact" }, { spoken: 0, written: 1 }, ref({ openstaxTitles: { [order[1]]: ["Integrating Using Long Division"] } }), order);
    expect(s).toEqual({ kind: "reference", by: "openstax", head: order[1], where: ["Integrating Using Long Division"] });
  });

  it("reads the AP Statistics CED as a CED, before OpenStax", () => {
    const s = settleUndecided(
      { mapping: "exact" },
      { spoken: 9, written: 0 },
      ref({ cedStats: { [order[1]]: { "1.13": 2 } }, openstax: { [order[0]]: 5 } }),
      order,
    );
    expect(s).toEqual({ kind: "reference", by: "ced-stats", head: order[1], where: ["1.13"] });
  });

  it("counts an AP Statistics CED wording as a known English name (not no-fixed-expression)", () => {
    const s = settleUndecided({ mapping: "near" }, { spoken: 0, written: 0 }, ref({ cedStats: { [order[0]]: { "1.12": 1 } } }), order);
    expect(s.kind).toBe("reference");
  });

  it("falls back to Nicholson / Levin after OpenStax, with their sections", () => {
    const books = ref({ nicholson: { [order[0]]: { "8.11 Principal Components": 3 } }, levin: { [order[1]]: { "2.4 Euler Trails": 5, "2.3 Planar Graphs": 1 } } });
    expect(settleUndecided({ mapping: "exact" }, { spoken: 0, written: 0 }, books, order)).toEqual({
      kind: "reference",
      by: "levin",
      head: order[1],
      where: ["2.4 Euler Trails", "2.3 Planar Graphs"],
    });
    const withOpenStax = { ...books, openstax: { [order[0]]: 1 } };
    expect(settleUndecided({ mapping: "exact" }, { spoken: 0, written: 0 }, withOpenStax, order)).toMatchObject({ by: "openstax" });
  });

  it("reads OpenStax and IM as one tier: the candidate with more hits in both wins", () => {
    const s = settleUndecided(
      { mapping: "exact" },
      { spoken: 0, written: 0 },
      ref({ openstax: { [order[0]]: 1 }, im: { [order[1]]: { "Geometry 7.5 Triangles in Circles": 20, "Geometry 7.4 Quadrilaterals": 1 } }, imGlossary: { [order[1]]: ["Geometry"] } }),
      order,
    );
    expect(s).toEqual({
      kind: "reference",
      by: "im",
      head: order[1],
      where: ["Geometry glossary", "Geometry 7.5 Triangles in Circles", "Geometry 7.4 Quadrilaterals", "計 21 件"],
    });
    // OpenStax's own wording is recorded as OpenStax's when it has more hits there
    const os = settleUndecided({ mapping: "exact" }, { spoken: 0, written: 0 }, ref({ openstax: { [order[0]]: 3 }, im: { [order[0]]: { "Algebra 1 2.1 X": 1 } } }), order);
    expect(os).toMatchObject({ by: "openstax", head: order[0] });
    // and IM comes before Nicholson / Levin
    const books = ref({ levin: { [order[0]]: { "2.4 Euler Trails": 9 } }, im: { [order[1]]: { "Grade 8 1.1 X": 1 } } });
    expect(settleUndecided({ mapping: "exact" }, { spoken: 0, written: 0 }, books, order)).toMatchObject({ by: "im", head: order[1] });
  });

  it("reads CK-12 in the OpenStax / IM tier: its section titles first, then the sections by hits", () => {
    const s = settleUndecided(
      { mapping: "exact" },
      { spoken: 0, written: 0 },
      ref({
        openstax: { [order[0]]: 2 },
        ck12: { [order[1]]: { "CK-12 Geometry 4.4 Isosceles Triangles": 1, "CK-12 Geometry 4.5 Equilateral Triangles": 4 } },
        ck12Titles: { [order[1]]: ["CK-12 Geometry 4.4 Isosceles Triangles"] },
      }),
      order,
    );
    expect(s).toEqual({
      kind: "reference",
      by: "ck12",
      head: order[1],
      where: ["CK-12 Geometry 4.4 Isosceles Triangles", "CK-12 Geometry 4.5 Equilateral Triangles", "計 5 件"],
    });
  });

  it("falls back to the English Wikipedia article's name last, as the matching candidate", () => {
    const wiki = ref({ wikipedia: { title: "Integrating using long division (calculus)", via: "ja-langlink" } });
    expect(settleUndecided({ mapping: "exact" }, { spoken: 0, written: 0 }, wiki, order)).toEqual({
      kind: "reference",
      by: "wikipedia",
      head: order[1],
      where: ["Integrating using long division (calculus)", "ja の langlink 先"],
    });
    const withLevin = { ...wiki, levin: { [order[0]]: { "1.1 Statements": 1 } } };
    expect(settleUndecided({ mapping: "exact" }, { spoken: 0, written: 0 }, withLevin, order)).toMatchObject({ by: "levin" });
    // not before "no fixed expression"
    expect(settleUndecided({ mapping: "near", ja: "x", en: "y" }, { spoken: 0, written: 0 }, wiki, order).kind).toBe("no-fixed-expression");
  });

  it("stays undecided when neither reference names it", () => {
    expect(settleUndecided({ mapping: "exact" }, { spoken: 0, written: 0 }, ref({}), order)).toEqual({ kind: "undecided" });
  });
});

describe("cedSections / referenceHits", () => {
  const ced = ["front matter", "UNIT 1", "Limits", "TOPIC 1.1", "a limit here", "TOPIC 1.2", "one-sided limits", "Exam Overview", "limit"].join("\n");

  it("splits the CED into front, unit openers, topics and exam", () => {
    expect(cedSections(ced).map(([n]) => n)).toEqual(["front", "unit1", "1.1", "1.2", "exam"]);
  });

  it("skips a sample topic page before the Unit 1 opener and finds an exam that opens a page", () => {
    const stats = ["how to read a unit", "TOPIC 1.1", "sample page", "UNIT 1", "Data", "TOPIC 1.1", "blocking", "\fExam Overview", "p-value"].join("\n");
    const sections = cedSections(stats);
    expect(sections.map(([n]) => n)).toEqual(["front", "unit1", "1.1", "exam"]);
    expect(sections[0][1]).toContain("sample page");
  });

  it("splits a book at its body headings, checked against the running heads", () => {
    const book = [
      "Contents\n1.1 Walks . . . . 3\n2.1 Trees . . . . 9",
      "1.1\n\nWalks\n\nan Euler trail",
      "2\nmore on walks",
      "1.1. Walks\nstill walks\n\n2.1 Trees\nA tree is",
      "4\ntrees",
      "2.1. Trees\na spanning tree",
      "Selected Solutions\na tree",
    ].join("\f");
    const sections = bookSections(book);
    expect(sections.map(([n]) => n)).toEqual(["1.1 Walks", "2.1 Trees"]);
    expect(sections[0][1]).toContain("still walks");
    expect(sections[1][1]).not.toContain("Selected Solutions");
    expect(sections[1][1].startsWith("2.1 Trees")).toBe(true);
  });

  it("counts candidates per CED section, in the OpenStax body and in section titles", () => {
    const sections = cedSections(ced).map(([n, t]) => [n, normalize(t)] as [string, string]);
    const r = referenceHits(["limit", "one-sided limit"], sections, ["the limit of f", "limits"], ["One-Sided Limits"]);
    expect(r.ced.limit).toEqual({ unit1: 1, "1.1": 1, "1.2": 1, exam: 1 });
    expect(r.ced["one-sided limit"]).toEqual({ "1.2": 1 });
    expect(r.openstax).toEqual({ limit: 2 });
    expect(r.openstaxTitles).toEqual({ limit: ["One-Sided Limits"], "one-sided limit": ["One-Sided Limits"] });
  });
});

describe("wikipediaHead", () => {
  it("drops the disambiguation and lowers the first letter of a common noun", () => {
    expect(wikipediaHead("Translation (geometry)")).toBe("translation");
    expect(wikipediaHead("Dihedral angle")).toBe("dihedral angle");
  });
  it("keeps a name", () => {
    expect(wikipediaHead("Ceva's theorem")).toBe("Ceva's theorem");
    expect(wikipediaHead("LU decomposition")).toBe("LU decomposition");
  });
});

describe("referenceHits (IM)", () => {
  it("counts IM lessons and a glossary headword that is the whole wording", () => {
    const r = referenceHits(["incenter", "center"], [], [], [], {
      im: [["Geometry 7.6 A Special Point", "the incenter of the triangle"]],
      imGlossary: { Geometry: ["incenter", "center of a dilation"], "Grade 8": ["center (of a circle)"] },
    });
    expect(r.im).toEqual({ incenter: { "Geometry 7.6 A Special Point": 1 } });
    expect(r.imGlossary).toEqual({ incenter: ["Geometry"], center: ["Grade 8"] });
  });
});

describe("balance", () => {
  it("flags a channel that dominates the corpus", () => {
    const docs: CorpusDoc[] = [
      { id: "yt:one", register: "spoken", auto: true, text: "a ".repeat(700) },
      { id: "mit-18.01", register: "spoken", auto: false, text: "a ".repeat(200) },
      { id: "khan-ap-calc", register: "spoken", auto: false, text: "a ".repeat(100) },
    ];
    const { over } = balance(docs);
    expect(over.map((o) => o.source)).toEqual(["yt:one"]);
  });
});

describe("candidatesOf", () => {
  it("gathers every wording worth counting for a term", () => {
    const got = candidatesOf("terms", {
      en: { term: "substitute", alt: ["plug in"], variants: [{ term: "sub in" }] },
      collocations: [{ en: "plug into the formula", ja: "" }],
    });
    expect(got).toEqual(["substitute", "plug in", "sub in", "plug into the formula"]);
  });
});

describe("sameWording", () => {
  it("folds inflection", () => {
    expect(sameWording("completing the square", "complete the square")).toBe(true);
    expect(sameWording("plug in", "plugging in")).toBe(true);
  });

  it("folds argument ellipsis", () => {
    expect(sameWording("f prime of x", "f prime")).toBe(true);
    expect(sameWording("the derivative of f with respect to x", "the derivative")).toBe(true);
  });

  it("keeps different words apart", () => {
    expect(sameWording("integral", "integrate")).toBe(false);
    expect(sameWording("integrate", "integration")).toBe(false);
    expect(sameWording("integral", "integration")).toBe(false);
    expect(sameWording("substitute", "plug in")).toBe(false);
  });

  it("ignores punctuation after a word", () => {
    expect(sameWording("fundamental theorem of calculus, part 1", "fundamental theorem of calculus part 1")).toBe(true);
  });

  it("reads a blank as argument ellipsis", () => {
    expect(sameWording("revolve … around the x-axis", "revolve around the x-axis")).toBe(true);
    expect(sameWording("revolve … around the x-axis", "rotate … around the x-axis")).toBe(false);
  });

  it("does not swallow a phrase that adds meaning", () => {
    expect(sameWording("substitute", "substitute back")).toBe(false);
    expect(sameWording("sign chart", "sign chart for the second derivative")).toBe(false);
  });
});

describe("mergeCandidates", () => {
  it("sums folded counts into the headword and reports the merge", () => {
    const { counts, merges } = mergeCandidates(
      {
        "completing the square": { "mit-18.01": 16 },
        "complete the square": { "mit-18.01": 9 },
        "substitute back": { "mit-18.01": 3 },
      },
      "completing the square",
    );
    expect(counts["completing the square"]).toEqual({ "mit-18.01": 25 });
    expect(counts["substitute back"]).toEqual({ "mit-18.01": 3 });
    expect(merges).toEqual([{ into: "completing the square", from: ["complete the square"] }]);
  });

  it("loses no occurrences", () => {
    const input = { "f prime of x": { a: 5 }, "f prime": { a: 7 } };
    const { counts } = mergeCandidates(input, "f prime of x");
    const total = Object.values(counts).flatMap((b) => Object.values(b)).reduce((x, y) => x + y, 0);
    expect(total).toBe(12);
  });
});

describe("sourceWeights", () => {
  it("leaves a single source alone, so an OCW-only corpus still works", () => {
    expect(sourceWeights({ "mit-18.01": 142270 })).toEqual({ "mit-18.01": 1 });
  });

  it("evens out a source that dominates, without rejecting it", () => {
    const w = sourceWeights({ "mit-18.01": 800, "yt:a": 100, "yt:b": 100 });
    const shares = { "mit-18.01": 0.8, "yt:a": 0.1, "yt:b": 0.1 };
    const effective = Object.fromEntries(
      Object.entries(w).map(([k, v]) => [k, v * shares[k as keyof typeof shares]]),
    );
    expect(effective["mit-18.01"]).toBeCloseTo(1 / 3, 5);
    expect(w["mit-18.01"]).toBeLessThan(1);
    expect(w["yt:a"]).toBeGreaterThan(1);
  });

  it("keeps the total mass at one", () => {
    const words = { a: 700, b: 200, c: 50, d: 50 };
    const w = sourceWeights(words);
    const total = Object.values(words).reduce((x, y) => x + y, 0);
    const sum = Object.entries(w).reduce((s, [k, v]) => s + (words[k as keyof typeof words] / total) * v, 0);
    expect(sum).toBeCloseTo(1, 5);
  });
});

describe("weigh", () => {
  it("applies the per-source weights", () => {
    const counts = { "plug in": { "mit-18.01": 100, "yt:a": 10 } };
    const out = weigh(counts, { "mit-18.01": 0.5, "yt:a": 2 });
    expect(out["plug in"]).toBe(70);
  });
});

describe("cnxmlToText", () => {
  const para = (body: string) =>
    `<document xmlns:m="http://www.w3.org/1998/Math/MathML"><metadata><md:content-id>m1</md:content-id>` +
    `<md:title>T</md:title></metadata><content><para id="p1">${body}</para></content></document>`;

  it("keeps a sentence whole across inline math", () => {
    const xml = para("Subtracting <m:math><m:mrow><m:mn>3</m:mn></m:mrow></m:math> from both sides gives <m:math><m:mrow><m:mi>x</m:mi><m:mo>=</m:mo><m:mn>2</m:mn></m:mrow></m:math>.");
    const text = cnxmlToText(xml);
    expect(text).toBe("Subtracting 3 from both sides gives x = 2 .");
    expect(countPhrase(normalize(text), "from both sides")).toBe(1);
  });

  it("keeps a variable glued to its hyphenated suffix", () => {
    expect(cnxmlToText(para("the <m:math><m:mi>x</m:mi></m:math>-axis"))).toBe("the x-axis");
  });

  it("drops metadata ids and decodes entities", () => {
    const text = cnxmlToText(para("a &lt; b &amp; f&#8290;(x) &#8722; 1"));
    expect(text).not.toContain("m1");
    expect(text).toBe("a < b & f(x) \u2212 1");
  });
});

describe("dedupe", () => {
  const doc = (id: string, text: string, file = id): CorpusDoc => ({ id, register: "spoken", auto: false, text: normalize(text), file });
  const lecture =
    "Today we are going to talk about the derivative of a product of two functions. " +
    "So you plug in the value and you see what happens to the limit as h goes to zero. " +
    "Plug it in. Plug it in. That is the product rule and we will use it again next time in class.";
  const notice = "The following content is provided under a Creative Commons license and is free to share.";

  it("drops a file that is another copy of an earlier one", () => {
    const { docs, stats, dropped } = dedupe([doc("mit-18.01", lecture, "a"), doc("mit-18.01", lecture, "b")]);
    expect(docs.map((d) => d.file)).toEqual(["a"]);
    expect(dropped.map((d) => d.file)).toEqual(["b"]);
    expect(stats["mit-18.01"]).toMatchObject({ files: 2, droppedFiles: 1 });
  });

  it("dedupeSections removes a long sentence an earlier section had, keeping every section", () => {
    const repeat = "find the measure of each angle in the triangle shown below.";
    const { sections, dropped } = dedupeSections([
      ["Geometry 1.1 A", `${repeat} short one.`],
      ["Geometry 1.2 B", `${repeat} short one. a new problem about the rigid transformation of a figure.`],
    ]);
    expect(dropped).toBe(1);
    expect(sections.map(([n]) => n)).toEqual(["Geometry 1.1 A", "Geometry 1.2 B"]);
    expect(sections[1][1]).toBe("short one. a new problem about the rigid transformation of a figure.");
  });

  it("removes a long sentence seen before but keeps short repeats", () => {
    const { docs, stats } = dedupe([
      doc("mit-18.01", `${notice} ${lecture}`),
      doc("mit-18.02", `${notice} Now take the partial derivative with respect to x and hold y fixed while you do it. Plug it in.`),
    ]);
    expect(docs).toHaveLength(2);
    expect(docs[1].text).not.toContain("creative commons");
    expect(countPhrase(docs[0].text, "plug in")).toBe(3);
    expect(countPhrase(docs[1].text, "plug in")).toBe(1);
    expect(stats["mit-18.02"].droppedSentences).toBe(1);
  });
});

describe("TERM_FORMS (generic words counted in a sentence form)", () => {
  it("counts approaches as as … approaches, not the bare words", () => {
    const got = candidatesOf("terms", {
      id: "approaches",
      en: { term: "approaches", alt: [], variants: [{ term: "goes to" }, { term: "tends to" }] },
    });
    expect(got).toEqual(["as … approaches", "as … goes to", "as … tends to"]);
  });

  it("the form keeps the other senses out", () => {
    const text = normalize("As x goes to 3 this goes to 9. Then he goes to the board. It tends to be slow.");
    expect(countTerm(text, "goes to")).toBe(3);
    expect(countTerm(text, "as … goes to")).toBe(1);
    expect(countTerm(text, "as … tends to")).toBe(0);
  });

  it("leaves other entries and collections as written", () => {
    expect(countedAs("terms", "limit", "goes to")).toBe("goes to");
    expect(countedAs("phrases", "approaches", "goes to")).toBe("goes to");
  });

  // DECISIONS, Phase 2 統計・ベクトルの単元の前の修正
  it('"A | B" counts either form, each place once', () => {
    const text = normalize("A bounded sequence converges if the sequence is bounded and increasing. The region bounded by y = x.");
    expect(countTerm(text, "bounded sequence | sequence is bounded")).toBe(2);
    expect(countTerm(text, "bounded")).toBe(3);
  });

  it('"A !w" leaves out A followed by w', () => {
    const text = normalize("Solve for dx dt here. Now solve for dx and plug it in. We solve for dx.");
    expect(countTerm(text, "solve for dx !dt")).toBe(2);
    expect(countTerm(text, "solve for dx")).toBe(3);
  });

  it('"A !v !w" leaves out both', () => {
    const text = normalize("Find the average rate of change. Find the average value of f. Find the average of the scores.");
    expect(countTerm(text, "find the average !rate !value")).toBe(1);
  });

  // Phase 2 中学の単元: a plural in a form folds back to its singular, so forms avoid bare plurals
  it("a plural word in a form also matches its singular and other inflections", () => {
    const text = normalize("A constant term. The constants are 3 and 5. x cubed is not a cube.");
    expect(countTerm(text, "constants")).toBe(2);
    expect(countTerm(text, "cubes")).toBe(2);
    // "the constants" is the noun (counted); "A constant term" is kept out by !term
    expect(countTerm(text, "a constant !term | the constant !term")).toBe(1);
  });

  it('"!w A" leaves out A after w', () => {
    const text = normalize("The frequency column. The natural frequency. A relative frequency. Frequency is a count.");
    expect(countTerm(text, "!natural !relative frequency")).toBe(2);
  });

  it("samples contexts at even steps through the hits", () => {
    const docs: CorpusDoc[] = [
      { id: "a", register: "spoken", auto: false, text: normalize("one pole two pole three pole four pole") },
      { id: "b", register: "spoken", auto: false, text: normalize("five pole six pole") },
    ];
    const got = sampleTermContexts(docs, "pole", 3);
    expect(got.map((h) => h.source)).toEqual(["a", "a", "b"]);
    expect(got[0].snippet).toBe("one [pole] two pole three pole four pole");
  });
});

describe("SYMBOL_PATTERNS for square-root and summation-sigma", () => {
  it("counts the readings with any radicand or bounds", () => {
    const text = normalize("the square root of two over two. the sum from k equals one to n of k squared");
    expect(countPattern(text, countedAs("symbols", "square-root", "the square root of x squared plus one"))).toBe(1);
    expect(countPattern(text, countedAs("symbols", "summation-sigma", "the sum from k equals one to n of a sub k"))).toBe(1);
    // the short reading stays literal
    expect(countedAs("symbols", "square-root", "root x squared plus one")).toBe("root x squared plus one");
  });
});

describe("MICASE (phrases only)", () => {
  // A made-up transcript in CHAT form, not MICASE text.
  const chat = [
    "@UTF8",
    "@Begin",
    "@Participants:\tS1 Student, S2 Teacher, S3 Unidentified, S4 Speaker",
    "@ID:\teng|MICASE|S1|20;|female|NS||Student|JU||",
    "@ID:\teng|MICASE|S2|45;|male|NS||Teacher|SG||",
    "@ID:\teng|MICASE|S3||female|NS||Unidentified|UN||",
    "@ID:\teng|MICASE|S4|50;|male|NS||Speaker|SF||",
    "*S1:\tcould you walk me through [/] through this step ? \u001512_34\u0015",
    "*S2:\tsure &-uh so (be)cause the <derivative> [>] is zero +...",
    "\twe get a critical point .",
    "*S3:\txxx okay .",
    "%com:\tlaughter",
    "@End",
  ].join("\n");

  it("reads the speech event from the file name", () => {
    expect(micaseEvent("raw/MICASE/ofc575mu046.cha")).toEqual({ id: "OFC575MU046", type: "OFC", scene: "office hours", discipline: "575", level: "MU" });
    expect(micaseEvent("0metadata.cha")).toBeNull();
  });

  it("splits a transcript into students, instructors and the rest, without CHAT markup", () => {
    const t = parseChat(chat);
    expect(t.speakers).toEqual({ S1: "student", S2: "instructor", S3: "other", S4: "instructor" });
    expect(t.text.student).toEqual(["could you walk me through through this step ?"]);
    expect(t.text.instructor).toEqual(["sure so because the derivative is zero we get a critical point ."]);
    expect(t.text.other).toEqual(["okay ."]);
    expect(wordCount(t.text.instructor)).toBe(13);
  });

  it("classifies by the role word first, then by the academic-role code", () => {
    expect(speakerClass("Teacher", "SG")).toBe("instructor"); // a graduate student teaching a section
    expect(speakerClass("Student", "SU")).toBe("student");
    expect(speakerClass("Speaker", "JG")).toBe("student");
    expect(speakerClass("Audience", "JF")).toBe("instructor");
    expect(speakerClass("Participant", "ST")).toBe("other");
    expect(speakerClass("Unidentified", "UN")).toBe("other");
  });

  it("counts a phrase on the words of whoever says it (Phase 3 フレーズの前の修正 4)", () => {
    const docs: CorpusDoc[] = [
      { id: "mit-18.01", register: "spoken", auto: false, text: "a" },
      { id: "micase", register: "spoken", auto: false, text: "s", collections: ["phrases"], speaker: "student" },
      { id: "micase", register: "spoken", auto: false, text: "i", collections: ["phrases"], speaker: "instructor" },
      { id: "micase", register: "spoken", auto: false, text: "o", collections: ["phrases"], speaker: "other" },
      { id: "openstax-calculus", register: "written", auto: false, text: "w" },
    ];
    const texts = (g: Parameters<typeof phraseDocs>[1]) => phraseDocs(docs, g).map((d) => d.text);
    expect(texts("student")).toEqual(["s"]);
    expect(texts("email")).toEqual(["s"]);
    expect(texts("instructor")).toEqual(["a", "i"]);
    expect(texts("written")).toEqual(["w"]);
    // explaining-solution: the lectures and the whole of MICASE (Phase 3 フレーズ 2 の前の修正 2)
    expect(texts("classroom")).toEqual(["a", "s", "i", "o"]);
    expect(phraseGroup("explaining-solution-first-step", "explaining-solution")).toBe("classroom");
    expect(phraseGroup("office-hours-stuck-at-step", "office-hours")).toBe("student");
    expect(phraseGroup("dont-forget-the-plus-c", "class-listening")).toBe("instructor");
    expect(phraseGroup("exam-justify-your-answer", "exam")).toBe("written");
    expect(phraseGroup("exam-clarify-instruction", "exam")).toBe("student"); // said aloud during the exam
    expect(phraseGroup("email-greeting", "email")).toBe("email");
    // every exam phrase said aloud goes by its speaker (修正 3)
    expect(phraseGroup("exam-ask-how-much-time", "exam")).toBe("student");
    expect(phraseGroup("exam-pencils-down", "exam")).toBe("instructor");
  });

  it("does not set key parts short of ten against each other (Phase 3 フレーズ 2 の前の修正 1)", () => {
    const w = { a: 1, b: 1 };
    // a key part reaches ten: judged ①②③ as before
    expect(phraseBelowFloor({ "extra credit": { a: 10 }, "bonus question": { a: 4 } }, w)).toBeNull();
    // 9 against 2 was ① (3:1, 11 in all); now no key part reaches ten
    expect(phraseBelowFloor({ "extra credit": { a: 6, b: 3 }, "bonus question": { a: 2 } }, w)).toEqual({ wording: "extra credit", hits: 9 });
    expect(phraseBelowFloor({ "pass your papers": { a: 2 } }, w)).toEqual({ wording: "pass your papers", hits: 2 });
    expect(phraseBelowFloor({ "pass your papers": {} }, w)).toEqual({ wording: null, hits: 0 });
    expect(PHRASE_ATTESTED).toBe(3);
    // the leader is picked on the weighted counts, its hits are raw
    expect(phraseBelowFloor({ x: { a: 4 }, y: { b: 3 } }, { a: 0.5, b: 2 })).toEqual({ wording: "y", hits: 3 });
  });

  it("settles a written phrase on the references at three hits, a CED too", () => {
    const ref = (r: Partial<ReferenceHits>): ReferenceHits => ({ ced: {}, openstax: {}, openstaxTitles: {}, ...r });
    const order = ["justify your answer", "give a reason for your answer"];
    expect(settlePhraseReference(ref({ ced: { [order[1]]: { "2.1": 2 } }, openstax: { [order[0]]: 4 } }), order)).toMatchObject({
      kind: "reference",
      by: "openstax",
      head: order[0],
    });
    expect(settlePhraseReference(ref({ ced: { [order[1]]: { "2.1": 3 } } }), order)).toMatchObject({ kind: "reference", by: "ced", head: order[1] });
    expect(settlePhraseReference(ref({ openstax: { [order[0]]: 2 }, openstaxTitles: { [order[0]]: ["x", "y", "z"] } }), order)).toEqual({ kind: "undecided" });
  });

  it("keeps a phrases-only source out of the terms' docs and weights", () => {
    const docs: CorpusDoc[] = [
      { id: "mit", register: "spoken", auto: false, text: "a" },
      { id: "micase", register: "spoken", auto: false, text: "b", collections: ["phrases"] },
    ];
    expect(forCollection(docs, "terms").map((d) => d.id)).toEqual(["mit"]);
    expect(forCollection(docs, "phrases").map((d) => d.id)).toEqual(["mit", "micase"]);
    const words = { mit: 100, micase: 300 };
    const restricted = { micase: ["phrases"] };
    expect(wordsFor(words, restricted, "terms")).toEqual({ mit: 100 });
    expect(wordsFor(words, restricted, "phrases")).toEqual(words);
    expect(sourceWeights(wordsFor(words, restricted, "terms"))).toEqual({ mit: 1 });
  });
});

describe("symbol patterns with alternatives and excluded words", () => {
  it("counts either form and keeps an excluded neighbour out", () => {
    const text = normalize("x equals negative three. y is negative two. the slope is negative. x minus three");
    expect(countPattern(text, "equals negative * | is negative *")).toBe(2); // "is negative." ends a sentence
    expect(countPattern(text, "!x minus *")).toBe(0);
    expect(countPattern(text, "minus *")).toBe(1);
    expect(countPattern(text, "the slope is * !three")).toBe(1);
  });
});
