/**
 * The two typefaces of design D (docs/design/README.md): STIX Two Text for English and math,
 * BIZ UDPMincho for Japanese, both from Google Fonts with display=swap.
 *
 * Google serves STIX Two Text in Latin, Latin Extended, Greek, Cyrillic and Vietnamese slices,
 * none of which holds the math symbols (∈ ≤ ∞ → ∫ …). Those come from a second request with
 * `text=`: every character the pages print, rendered math included, that the slices leave out
 * and that is not Japanese. Google answers with the glyphs the font has, under a unicode-range,
 * so the browser takes each symbol from STIX and anything STIX lacks from the next face.
 */
import katex from "katex";
import { conventions, phrases, symbols, terms } from "./data";

export const FONTS_CSS =
  "https://fonts.googleapis.com/css2?family=STIX+Two+Text:ital,wght@0,400;0,500;0,600;1,400;1,500&family=BIZ+UDPMincho:wght@400;700&display=swap";

/** Code points the regular STIX Two Text slices already cover (Google Fonts' unicode-range lists). */
const inSlices = (c: number) =>
  c <= 0x024f ||
  (c >= 0x0250 && c <= 0x036f) ||
  (c >= 0x0370 && c <= 0x03ff) ||
  (c >= 0x0400 && c <= 0x052f) ||
  (c >= 0x1d00 && c <= 0x1dbf) ||
  (c >= 0x1e00 && c <= 0x1eff) ||
  (c >= 0x2000 && c <= 0x206f) ||
  (c >= 0x20a0 && c <= 0x20c4) ||
  [0x2113, 0x2116, 0x2122, 0x2191, 0x2193, 0x2212, 0x2215, 0xfeff, 0xfffd].includes(c);

/** Japanese (and the rest of CJK) is set in BIZ UDPMincho. */
const isCjk = (c: number) =>
  (c >= 0x2e80 && c <= 0x9fff) || (c >= 0xf900 && c <= 0xfaff) || (c >= 0xfe30 && c <= 0xfe4f) || (c >= 0xff00 && c <= 0xffef);

const strings = (x: unknown, out: string[]) => {
  if (typeof x === "string") out.push(x);
  else if (Array.isArray(x)) x.forEach((y) => strings(y, out));
  else if (x && typeof x === "object") Object.values(x).forEach((y) => strings(y, out));
};

const textOf = (latex: string) => {
  const html = katex.renderToString(latex, { throwOnError: false, output: "html", displayMode: true });
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
};

/** Characters printed in the site's own chrome (the tagline's arrow and the like). */
const CHROME = "→⇄";

let cached: string | null = null;

/** The URL of the math-symbol subset of STIX Two Text, or null when nothing is outside the slices. */
export function mathFontsCss(): string | null {
  if (cached !== null) return cached || null;
  const all: string[] = [CHROME];
  strings([terms, symbols, phrases, conventions], all);
  for (const x of [...terms, ...symbols]) if (x.latex) all.push(textOf(x.latex));
  const chars = new Set<string>();
  for (const s of all)
    for (const ch of s) {
      const c = ch.codePointAt(0)!;
      if (c > 0xffff && !(c >= 0x1d400 && c <= 0x1d7ff)) continue;
      // KaTeX's private-use glyphs stay in KaTeX's own faces
      if (c >= 0xe000 && c <= 0xf8ff) continue;
      if (!inSlices(c) && !isCjk(c)) chars.add(ch);
    }
  const text = [...chars].sort().join("");
  cached = text
    ? `https://fonts.googleapis.com/css2?family=STIX+Two+Text:ital,wght@0,400;0,600;1,400&display=swap&text=${encodeURIComponent(text)}`
    : "";
  return cached || null;
}
