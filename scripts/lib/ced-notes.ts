/**
 * Does a CED source's note say what the CED says? (DECISIONS, Phase 5 監査
 * セッション 2, H-3; audits/2026-09-26-audit-1.md H-3.)
 *
 * A source of type reference for the AP Calculus / AP Statistics CED carries a
 * note like "Topic 5.4（first derivative test）" or "Unit 9 の概要（sign chart）".
 * The words in the parentheses are what the entry says the CED calls the
 * concept; the audit found notes whose topic number was wrong, or whose words
 * the CED never uses (audit-1 E-2: inverse trig topic 3.3 -> 3.4, "disc").
 *
 * validate reads the notes with `cedNoteGroups` and, when the CED texts are
 * fetched (corpus/ref/, gitignored), looks each word up in the sections the
 * note names (scripts/corpus/lib.ts cedSections: "n.m" topics, "unitN" unit
 * openers). A word not found is a warning: the check is a heuristic on free
 * text, and the editor reads the note against the CED.
 *
 * Section names of a note:
 *   Topic 5.4 / topic 5.4 / 5.4          the topic
 *   Topic 8.4–8.6                        the topics 8.4, 8.5, 8.6
 *   Topic 3.14・3.15, 6.4、6.5            each topic
 *   Unit 9 の概要                         the unit opener only ("unit9")
 *   Unit 5                               the opener and every topic 5.x
 * The words of a note are the English pieces inside （…）, split at ／ 、 ・ 。
 * and " と ". A piece that itself begins with "Topic n.m" names that topic for
 * the piece. Japanese pieces are not looked up. A （…） group is checked
 * against the sections named just before it; a group with no sections before
 * it uses the sections named earlier in the note.
 */

export interface NoteGroup {
  /** "5.4", "unit9" ... as cedSections names them; a unit without の概要 also lists its topics as "unit5:*" */
  sections: string[];
  words: string[];
}

const TOPIC = /(\d{1,2})\.(\d{1,2})(?:\s*[–—-]\s*(\d{1,2})\.(\d{1,2}))?/g;
const UNIT = /[Uu]nit\s*(\d{1,2})(\s*の概要)?/g;

/** The section names in a piece of a note ("Topic 8.4–8.6、Unit 9 の概要"). */
export function sectionsIn(spec: string): string[] {
  const out: string[] = [];
  for (const m of spec.matchAll(UNIT)) out.push(m[2] ? `unit${m[1]}` : `unit${m[1]}:*`);
  const rest = spec.replace(UNIT, " ");
  for (const m of rest.matchAll(TOPIC)) {
    const [, u1, a, u2, b] = m;
    if (u2 !== undefined && u2 === u1 && Number(b) >= Number(a)) {
      for (let i = Number(a); i <= Number(b); i++) out.push(`${u1}.${i}`);
    } else {
      out.push(`${u1}.${a}`);
      if (u2 !== undefined) out.push(`${u2}.${b}`);
    }
  }
  return out;
}

const ENGLISH = /^[A-Za-z][A-Za-z0-9 '’\-.,]*$/;

/** The （…） groups of a note with the sections each is checked against. */
export function cedNoteGroups(note: string): NoteGroup[] {
  const out: NoteGroup[] = [];
  let pos = 0;
  let earlier: string[] = [];
  for (const m of note.matchAll(/（([^）]*)）/g)) {
    const spec = note.slice(pos, m.index);
    pos = (m.index ?? 0) + m[0].length;
    const named = sectionsIn(spec);
    if (named.length) earlier = [...earlier, ...named];
    const sections = named.length ? named : earlier;
    const words: string[] = [];
    const extra: string[] = [];
    for (let piece of m[1].split(/\s*[／、・。]\s*|\s+と\s+/)) {
      piece = piece.trim();
      // "Topic 7.3 slope fields": the piece names its own topic
      const own = /^(?:[Tt]opic\s*)?(\d{1,2}\.\d{1,2})\s+(.*)$/.exec(piece);
      if (own) piece = own[2].trim();
      if (!ENGLISH.test(piece) || piece.length <= 2) continue;
      words.push(piece);
      if (own) extra.push(own[1]);
    }
    if (!words.length) continue;
    const all = [...sections, ...extra];
    if (!all.length) continue;
    out.push({ sections: all, words });
  }
  return out;
}

/**
 * One word of a note as a regex: its plural and the CED's inflections are the
 * same word ("sums" matches "sum", "oscillate" matches "oscillating").
 */
function inflected(w: string): string {
  const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let stem = w;
  if (/[a-z]{3}s$/i.test(stem) && !/(?:ss|us|is)$/i.test(stem)) stem = stem.slice(0, -1); // sums -> sum (not class, radius, axis)
  if (/[a-z]{2}e$/i.test(stem)) return `${esc(stem.slice(0, -1))}(?:e|es|ed|ing)?`; // oscillate -> oscillating
  return `${esc(stem)}(?:s|es|ing|ed)?`;
}

/** The words as a regex over a CED section: inflections aside, up to 2 words (or punctuation) may sit between two words. */
export function wordPattern(word: string): RegExp {
  const words = word.match(/[A-Za-z0-9'’]+/g) ?? [];
  const gap = "(?:[\\s\\-,;:]+\\S+){0,2}?[\\s\\-,;:]+";
  return new RegExp(`(?<![A-Za-z])${words.map(inflected).join(gap)}(?![A-Za-z])`, "i");
}

/** The text of the sections a group names, from a CED split by cedSections (name -> text). */
export function textOf(sections: string[], ced: Map<string, string>): string {
  const parts: string[] = [];
  for (const s of sections) {
    if (s.endsWith(":*")) {
      const unit = s.slice(0, -2);
      for (const [name, text] of ced) if (name === unit || name.startsWith(`${unit.replace("unit", "")}.`)) parts.push(text);
    } else if (ced.has(s)) parts.push(ced.get(s)!);
  }
  return parts.join(" ");
}

export interface NoteMismatch {
  word: string;
  sections: string[];
  /** true when none of the named sections exists in the CED (a topic number that does not exist) */
  noSuchSection: boolean;
}

/** The words of a note the named CED sections do not contain. */
export function checkCedNote(note: string, ced: Map<string, string>): NoteMismatch[] {
  const out: NoteMismatch[] = [];
  for (const g of cedNoteGroups(note)) {
    const text = textOf(g.sections, ced);
    for (const w of g.words) {
      if (!wordPattern(w).test(text)) out.push({ word: w, sections: g.sections, noSuchSection: text.length === 0 });
    }
  }
  return out;
}
