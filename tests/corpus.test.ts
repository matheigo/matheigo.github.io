import { describe, expect, it } from "vitest";
import {
  balance,
  candidatesOf,
  cnxmlToText,
  countPattern,
  countPhrase,
  decide,
  dedupe,
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
