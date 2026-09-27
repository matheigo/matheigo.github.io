import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function runValidate(): { code: number; out: string } {
  try {
    const out = execFileSync("npx", ["tsx", "scripts/validate.ts"], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { code: 0, out };
  } catch (e) {
    const err = e as { status: number; stdout: string; stderr: string };
    return { code: err.status, out: (err.stdout ?? "") + (err.stderr ?? "") };
  }
}

describe("validate.ts", () => {
  it("passes on the committed data", () => {
    expect(runValidate().code).toBe(0);
  });

  it("fails when an entry breaks a rule", () => {
    const file = path.join(ROOT, "data", "terms", "zz-broken-fixture.json");
    const backup = path.join(os.tmpdir(), "mb-broken.json");
    fs.writeFileSync(
      file,
      JSON.stringify({
        id: "tmp-broken",
        ja: { term: "テスト語", reading: "テストご" },
        en: { term: "test term" },
        pos: "noun",
        mapping: "near",
        domains: ["algebra"],
        level: { jp: ["数I"], us: ["Algebra 1"] },
        definition_ja: "検証用。",
        definition_en: "For testing.",
        latex: "\\frac{1}{",
        sources: [],
        confidence: "likely",
      }),
    );
    try {
      const { code, out } = runValidate();
      expect(code).toBe(1);
      // id/filename, hiragana reading, mapping_note, sources, LaTeX, examples
      expect(out).toMatch(/does not match the filename/);
      expect(out).toMatch(/must be hiragana/);
      expect(out).toMatch(/requires mapping_note/);
      expect(out).toMatch(/requires at least one source/);
      expect(out).toMatch(/LaTeX does not compile/);
      expect(out).toMatch(/needs at least 1 example/);
    } finally {
      fs.rmSync(file, { force: true });
      fs.rmSync(backup, { force: true });
    }
  });

  // DECISIONS, Phase 2 統計・ベクトルの単元の前の修正: record flags may stay on a
  // verified entry, problem flags may not (scripts/lib/flags.ts)
  const verifiedFixture = (code: string) => ({
    id: "zz-flag-fixture",
    ja: { term: "検証用の語", reading: "けんしょうようのご" },
    en: { term: "flag fixture term" },
    pos: "noun",
    mapping: "exact",
    domains: ["algebra"],
    level: { jp: ["数I"], us: ["Algebra 1"] },
    definition_ja: "検証用。",
    definition_en: "For testing.",
    examples: [{ en: "A fixture.", ja: "検証用。", register: "written" }],
    sources: [{ type: "editorial" }],
    confidence: "verified",
    flags: [{ code, note: "fixture" }],
  });

  // Phase 5 監査 5 の決定 9 (audit 3 report H-4): one wording may not sit in two of en.term, en.alt, en.variants
  it("refuses a wording listed twice among en.term, en.alt and en.variants", () => {
    const file = path.join(ROOT, "data", "terms", "zz-twice-fixture.json");
    try {
      fs.writeFileSync(
        file,
        JSON.stringify({
          ...verifiedFixture("corpus-reference-fallback"),
          id: "zz-twice-fixture",
          ja: { term: "検証用の二重登録", reading: "けんしょうようのにじゅうとうろく" },
          en: { term: "twice fixture term", alt: ["Twice fixture term"], variants: [{ term: "another wording", register: "spoken" }, { term: "another wording", register: "written" }] },
          confidence: "likely",
          flags: undefined,
        }),
      );
      const { code, out } = runValidate();
      expect(code).toBe(1);
      expect(out).toMatch(/en "Twice fixture term" is listed twice \(en\.term and en\.alt\[0\]\)/);
      expect(out).toMatch(/en "another wording" is listed twice \(en\.variants\[0\] and en\.variants\[1\]\)/);
    } finally {
      fs.rmSync(file, { force: true });
    }
  });

  it("lets a verified entry keep a record flag, not a problem flag", () => {
    const file = path.join(ROOT, "data", "terms", "zz-flag-fixture.json");
    try {
      fs.writeFileSync(file, JSON.stringify(verifiedFixture("corpus-reference-fallback")));
      expect(runValidate().code).toBe(0);
      fs.writeFileSync(file, JSON.stringify(verifiedFixture("corpus-undecided")));
      const { code, out } = runValidate();
      expect(code).toBe(1);
      expect(out).toMatch(/problem flags are still present: corpus-undecided/);
    } finally {
      fs.rmSync(file, { force: true });
    }
  });
});
