/**
 * OGP images (PLAN §9 Phase 4 の 5): public/og/default.png for the site, and
 * one image per indexable entry page (terms, symbols, conventions at
 * confidence verified). Pages under noindex share the default image: they are
 * not meant to be found or shared before the audit (DECISIONS, Phase 4).
 *
 * satori lays the card out as SVG with the text turned into outlines, sharp
 * rasterises it. Noto Sans JP comes from @fontsource/noto-sans-jp (OFL): the
 * package splits the face into unicode-range subsets, and only the subsets the
 * text needs are loaded.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import sharp from "sharp";
import { ROOT, loadAll, type Entry } from "./lib/load.js";
import { GLOSS_SHORT, isExplanatoryTranslation, referenceWordings } from "../src/lib/gloss.js";

const FONT_DIR = path.join(ROOT, "node_modules", "@fontsource", "noto-sans-jp");
export const OG_DIR = path.join(ROOT, "public", "og");

type Range = [number, number];
let subsets: { name: string; ranges: Range[] }[] | null = null;

function loadSubsets() {
  if (subsets) return subsets;
  const table = JSON.parse(fs.readFileSync(path.join(FONT_DIR, "unicode.json"), "utf8")) as Record<string, string>;
  subsets = Object.entries(table).map(([key, spec]) => ({
    name: key.replace(/^\[(\d+)\]$/, "$1"),
    ranges: spec.split(",").map((r) => {
      const [a, b] = r.trim().replace(/^U\+/i, "").split("-");
      return [parseInt(a, 16), parseInt(b ?? a, 16)] as Range;
    }),
  }));
  return subsets;
}

const fontCache = new Map<string, Buffer>();

/** The woff files (weights 400 and 700) whose unicode-range covers the text. */
export function fontsFor(text: string) {
  const needed = new Set<string>();
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    const hit = loadSubsets().find((s) => s.ranges.some(([a, b]) => cp >= a && cp <= b));
    if (hit) needed.add(hit.name);
  }
  needed.add("latin");
  const fonts: { name: string; data: Buffer; weight: 400 | 700; style: "normal" }[] = [];
  for (const name of needed) {
    for (const weight of [400, 700] as const) {
      const file = path.join(FONT_DIR, "files", `noto-sans-jp-${name}-${weight}-normal.woff`);
      if (!fontCache.has(file)) fontCache.set(file, fs.readFileSync(file));
      // One family per subset: satori does not fall back between faces that share a name.
      fonts.push({ name: `Noto Sans JP ${name}`, data: fontCache.get(file)!, weight, style: "normal" });
    }
  }
  return fonts;
}

export interface Card {
  kicker: string;
  title: string;
  sub?: string;
  en?: string;
  mark?: string;
}

type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
});

export async function renderCard(card: Card): Promise<Buffer> {
  const text = [card.kicker, card.title, card.sub, card.en, card.mark, "MathEigo matheigo.github.io"].join("");
  const fonts = fontsFor(text);
  const family = [...new Set(fonts.map((f) => f.name))].join(", ");
  const long = card.title.length > 14;
  const svg = await satori(
    el(
      "div",
      {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: "#fdfdfc",
        color: "#121826",
        fontFamily: family,
        borderLeft: "16px solid #0b4f8a",
      },
      [
        el("div", { fontSize: 30, color: "#545e70", display: "flex" }, card.kicker),
        el("div", { display: "flex", flexDirection: "column" }, [
          el("div", { fontSize: long ? 64 : 88, fontWeight: 700, lineHeight: 1.2, display: "flex" }, card.title),
          ...(card.sub ? [el("div", { fontSize: 32, color: "#545e70", marginTop: 12, display: "flex" }, card.sub)] : []),
          ...(card.en
            ? [el("div", { fontSize: long ? 44 : 54, color: "#0b4f8a", marginTop: 28, display: "flex" }, card.en)]
            : []),
          ...(card.mark
            ? [
                el(
                  "div",
                  {
                    fontSize: 26,
                    color: "#7a4f00",
                    border: "2px dashed #7a4f00",
                    borderRadius: 8,
                    padding: "4px 14px",
                    marginTop: 16,
                    display: "flex",
                    alignSelf: "flex-start",
                  },
                  card.mark,
                ),
              ]
            : []),
        ]),
        el("div", { display: "flex", justifyContent: "space-between", fontSize: 28, color: "#545e70" }, [
          el("div", { fontWeight: 700, color: "#121826", display: "flex" }, "MathEigo"),
          el("div", { display: "flex" }, "matheigo.github.io"),
        ]),
      ],
    ) as unknown as Parameters<typeof satori>[0],
    { width: 1200, height: 630, fonts },
  );
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toBuffer();
}

export const DEFAULT_CARD: Card = {
  kicker: "数学の日英辞典",
  title: "日本の数学を、米国の教室の英語で",
  sub: "用語・記号の読み上げ・場面別フレーズ・日米の慣習差",
  en: "Japanese ⇄ English math dictionary",
};

export function cardsFor(all: ReturnType<typeof loadAll>): { file: string; card: Card }[] {
  const ok = (d: Entry) => d.confidence === "verified";
  const out: { file: string; card: Card }[] = [];
  const wordings = referenceWordings(all.terms.map((e) => e.data));
  for (const { data: t } of all.terms.filter((e) => ok(e.data))) {
    const ja = t.ja as { term: string; reading: string };
    const gloss = isExplanatoryTranslation(t, wordings);
    out.push({
      file: `terms/${t.id}.png`,
      card: { kicker: "数学の用語 日本語 → 英語", title: ja.term, sub: ja.reading, en: (t.en as { term: string }).term, mark: gloss ? GLOSS_SHORT + "（英語の用語ではない）" : undefined },
    });
  }
  for (const { data: s } of all.symbols.filter((e) => ok(e.data))) {
    out.push({
      file: `symbols/${s.id}.png`,
      card: { kicker: "記号・式の英語の読み方", title: String(s.name_ja), en: (s.spoken_en as { text: string }[])[0].text },
    });
  }
  for (const { data: c } of all.conventions.filter((e) => ok(e.data))) {
    out.push({
      file: `conventions/${c.id}.png`,
      card: { kicker: "日米の慣習差", title: String(c.title_ja), en: String(c.title_en) },
    });
  }
  return out;
}

async function main() {
  const all = loadAll();
  const jobs = [{ file: "default.png", card: DEFAULT_CARD }, ...cardsFor(all)];
  // Start clean: an entry that lost its verified status must lose its image too.
  fs.rmSync(OG_DIR, { recursive: true, force: true });
  let written = 0;
  for (const { file, card } of jobs) {
    const out = path.join(OG_DIR, file);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, await renderCard(card));
    written++;
  }
  console.log(`og: ${written} image(s) -> public/og (default + ${written - 1} verified entry pages)`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
