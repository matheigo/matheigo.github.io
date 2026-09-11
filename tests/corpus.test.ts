import { describe, expect, it } from "vitest";
import {
  balance,
  candidatesOf,
  countPhrase,
  decide,
  headsOf,
  mergeCandidates,
  normalize,
  sameWording,
  sourceWeights,
  weigh,
  type CorpusDoc,
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

  it("③ is undecided when the runner-up is below the floor", () => {
    const v = decide({ "plug in": 12, substitute: 5 }, "spoken");
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
