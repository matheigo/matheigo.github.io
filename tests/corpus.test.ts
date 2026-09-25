import { describe, expect, it } from "vitest";
import {
  balance,
  candidatesOf,
  cedSections,
  cnxmlToText,
  countEntry,
  countPattern,
  countPhrase,
  countTerm,
  decide,
  decideRobust,
  dedupe,
  headsOf,
  inflections,
  mergeCandidates,
  normalize,
  referenceHits,
  sameWording,
  settleUndecided,
  sourceWeights,
  weigh,
  type CorpusDoc,
  type ReferenceHits,
} from "../scripts/corpus/lib";

describe("normalize", () => {
  it("folds the spellings of the same spoken form", () => {
    expect(normalize("F-prime of x")).toBe("f prime of x");
    expect(normalize("f prime of x")).toBe("f prime of x");
    expect(normalize("x-squared plus 1")).toBe("x squared plus one");
    expect(normalize("d x")).toBe("dx");
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

describe("short stems", () => {
  it("does not fold a three-letter word down to two letters", () => {
    expect(countTerm("the pivots d one up to dn. the limit is dne.", "DNE")).toBe(1);
    expect(countTerm("let us use it. we used it.", "use")).toBe(2);
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

  it("stays undecided when neither reference names it", () => {
    expect(settleUndecided({ mapping: "exact" }, { spoken: 0, written: 0 }, ref({}), order)).toEqual({ kind: "undecided" });
  });
});

describe("cedSections / referenceHits", () => {
  const ced = ["front matter", "UNIT 1", "Limits", "TOPIC 1.1", "a limit here", "TOPIC 1.2", "one-sided limits", "Exam Overview", "limit"].join("\n");

  it("splits the CED into front, unit openers, topics and exam", () => {
    expect(cedSections(ced).map(([n]) => n)).toEqual(["front", "unit1", "1.1", "1.2", "exam"]);
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
