/**
 * The downloads (PLAN §9 Phase 4 の 4). Anki and the PDF ship verified entries
 * only, and nothing is verified before the Phase 5 audit, so the release build
 * writes neither. These tests promote a few real entries to verified in a
 * temporary directory and run the real generators on them.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ROOT, loadCollection, type Entry } from "../scripts/lib/load";
import { enForExport, quizletTsv, termsCsv, withGloss } from "../scripts/export";
import { exportPdf, findChrome } from "../scripts/export-pdf";
import { renderWordToWord, wordToWordRows, type PrintTerm } from "../scripts/lib/print";
import { GLOSS_LABEL } from "../src/lib/gloss";

// The fixtures are read from the real data but forced to likely: the Phase 5 audit
// verifies entries over time (rate, substitute, ... are verified now), and these tests
// check what an export does with likely and with verified entries, not the data's state.
const likely = (e: Entry): Entry => ({ ...e, confidence: "likely" });
const read = (c: string, id: string): Entry => likely(JSON.parse(fs.readFileSync(path.join(ROOT, "data", c, `${id}.json`), "utf8")));
const verified = (e: Entry): Entry => ({ ...e, confidence: "verified" });

// rate: 割合 → "ratio to the base amount", an explanatory translation (mapping none + corpus-no-fixed-expression).
const rate = read("terms", "rate");
const quadratic = read("terms", "quadratic-formula");
const substitute = read("terms", "substitute"); // stays likely in every fixture
const symbol = read("symbols", "integral-definite");
const phrase = read("phrases", "office-hours-stuck-at-step");

const PY =
  process.env.MB_PYTHON ??
  (fs.existsSync(path.join(ROOT, ".venv", "bin", "python")) ? path.join(ROOT, ".venv", "bin", "python") : "python3");

let dir = "";
let empty = "";

beforeAll(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "matheigo-export-"));
  const write = (d: string, name: string, rows: unknown) =>
    fs.writeFileSync(path.join(d, `${name}.json`), JSON.stringify(rows), "utf8");
  write(dir, "terms", [verified(rate), verified(quadratic), substitute].map(withGloss));
  write(dir, "symbols", [verified(symbol)]);
  write(dir, "phrases", [verified(phrase)]);
  write(dir, "curriculum", loadCollection("curriculum").map((e) => e.data));

  empty = fs.mkdtempSync(path.join(os.tmpdir(), "matheigo-export-empty-"));
  write(empty, "terms", [rate, quadratic].map(withGloss));
  write(empty, "symbols", [symbol]);
  write(empty, "phrases", [phrase]);
  write(empty, "curriculum", []);
});

afterAll(() => {
  for (const d of [dir, empty]) if (d) fs.rmSync(d, { recursive: true, force: true });
});

describe("JSON / CSV / Quizlet", () => {
  it("adds en_is_explanatory_translation to terms", () => {
    expect(withGloss(rate).en_is_explanatory_translation).toBe(true);
    expect(withGloss(quadratic).en_is_explanatory_translation).toBe(false);
  });

  it("carries the flag as a CSV column", () => {
    const [header, ...rows] = termsCsv([rate, quadratic]).trim().split("\n");
    const col = header.split(",").indexOf("en_is_explanatory_translation");
    expect(col).toBeGreaterThan(0);
    expect(rows.find((r) => r.startsWith("rate,"))!.split(",")[col]).toBe("true");
    expect(rows.find((r) => r.startsWith("quadratic-formula,"))!.split(",")[col]).toBe("false");
  });

  it("Quizlet takes verified terms only and labels a paraphrase", () => {
    expect(quizletTsv([rate, quadratic]).trim()).toBe("");
    const tsv = quizletTsv([verified(rate), verified(quadratic), substitute]);
    expect(tsv).toContain(`ratio to the base amount（${GLOSS_LABEL}）\t割合（わりあい）`);
    expect(tsv).toContain("quadratic formula\t解の公式");
    expect(tsv).not.toContain("plug in");
    expect(enForExport(quadratic)).toBe("quadratic formula");
  });
});

describe("Anki deck (genanki)", () => {
  const run = (data: string, out: string) =>
    spawnSync(PY, [path.join(ROOT, "scripts", "export-anki.py"), "--data", data, "--out", out], { encoding: "utf8" });

  it("writes nothing while no entry is verified", () => {
    const out = path.join(empty, "x.apkg");
    const r = run(empty, out);
    expect(r.status, r.stderr).toBe(0);
    expect(r.stdout).toContain("no verified entries");
    expect(fs.existsSync(out)).toBe(false);
  });

  it("builds a deck from verified entries with fixed model ids, the paraphrase label and no listening card for it", () => {
    const out = path.join(dir, "matheigo.apkg");
    const r = run(dir, out);
    expect(r.status, r.stderr + r.stdout).toBe(0);
    expect(fs.existsSync(out)).toBe(true);

    // Look inside: an .apkg is a zip holding the SQLite collection.
    const inspect = `
import json, sqlite3, sys, tempfile, zipfile, os
z = zipfile.ZipFile(sys.argv[1])
d = tempfile.mkdtemp()
z.extract("collection.anki2", d)
db = sqlite3.connect(os.path.join(d, "collection.anki2"))
notes = {}
for flds, mid, tags in db.execute("select flds, mid, tags from notes"):
    f = flds.split("\\x1f")
    notes[f[0]] = {"mid": mid, "fields": f, "tags": tags.split()}
cards = {}
for nid_id, ord_ in db.execute("select n.flds, c.ord from cards c join notes n on c.nid = n.id"):
    cards.setdefault(nid_id.split("\\x1f")[0], []).append(ord_)
decks = sorted(d["name"] for d in json.loads(db.execute("select decks from col").fetchone()[0]).values())
print(json.dumps({"names": z.namelist(), "notes": notes, "cards": cards, "decks": decks}, ensure_ascii=False))
`;
    const r2 = spawnSync(PY, ["-c", inspect, out], { encoding: "utf8" });
    expect(r2.status, r2.stderr).toBe(0);
    const got = JSON.parse(r2.stdout) as {
      names: string[];
      notes: Record<string, { mid: number; fields: string[]; tags: string[] }>;
      cards: Record<string, number[]>;
      decks: string[];
    };

    expect(got.names).toContain("collection.anki2");
    // likely entries never enter the deck
    expect(Object.keys(got.notes).sort()).toEqual(
      ["integral-definite", "office-hours-stuck-at-step", "quadratic-formula", "rate"].sort(),
    );
    // frozen model ids (DECISIONS, Phase 4)
    expect(got.notes["quadratic-formula"].mid).toBe(1217344312);
    expect(got.notes["integral-definite"].mid).toBe(1727963048);
    expect(got.notes["office-hours-stuck-at-step"].mid).toBe(2049674010);
    // JA→EN and Audio→JA for a real term; EN→JA stays off
    expect(got.cards["quadratic-formula"].sort()).toEqual([0, 1]);
    // a paraphrase gets the label and no listening card
    expect(got.notes["rate"].fields).toContain(GLOSS_LABEL);
    expect(got.notes["rate"].tags).toContain("gloss::説明の訳");
    expect(got.cards["rate"]).toEqual([0]);
    expect(got.notes["quadratic-formula"].fields).not.toContain(GLOSS_LABEL);
    // sub-decks by Japanese unit
    expect(got.decks.some((d) => d.startsWith("MathEigo::用語::"))).toBe(true);
    expect(got.decks).toContain("MathEigo::記号");
    expect(got.decks).toContain("MathEigo::フレーズ::office-hours");
  });
});

describe("word-to-word PDF", () => {
  const terms = [verified(rate), verified(quadratic), substitute] as unknown as PrintTerm[];

  it("lists verified terms only, both directions, with no definitions", () => {
    const html = renderWordToWord(terms, "2026-09-26");
    expect(html).toContain("解の公式");
    expect(html).toContain("quadratic formula");
    expect(html).not.toContain("代入する"); // likely
    expect(html).not.toContain(String(quadratic.definition_ja));
    const { jaEn, enJa } = wordToWordRows(terms);
    expect(jaEn.map((r) => r.ja)).toEqual(["解の公式", "割合"]);
    // a paraphrase is labelled in 日本語→英語 and left out of English→Japanese
    expect(html).toContain(GLOSS_LABEL);
    expect(enJa.map((r) => r.en)).toEqual(["quadratic formula"]);
  });

  it("writes nothing while no term is verified", async () => {
    const out = path.join(empty, "x.pdf");
    expect(await exportPdf(empty, out)).toBeNull();
    expect(fs.existsSync(out)).toBe(false);
  });

  it.runIf(findChrome() !== null)("prints a PDF with headless Chrome", async () => {
    const out = path.join(dir, "w2w.pdf");
    expect(await exportPdf(dir, out)).toBe(out);
    const head = fs.readFileSync(out).subarray(0, 5).toString("latin1");
    expect(head).toBe("%PDF-");
  });
});
