/**
 * Counts from the example corpus do not go in an entry's text (STYLE 追記欄;
 * DECISIONS, Phase 2 中学の単元 2 の前の修正). The corpus grows - a new
 * source changes every count - so a number in a pitfall or a variant's note
 * goes stale while `evidence` (written by corpus:decide) stays current. The
 * text compares instead ("講義では A が多い、教科書では B"), and the site shows
 * the evidence counts next to it (PLAN Phase 4).
 *
 * Counts from the references (the CEDs, OpenStax, IM, CK-12, Nicholson,
 * Levin) may be written: those documents do not change. OpenStax is also the
 * written corpus, so a count is read as OpenStax's only when the sentence
 * names OpenStax and says nothing of the corpus (話し言葉, 書き言葉, 用例コーパス,
 * a lecture or a channel).
 *
 * A sentence (cut at 。) is suspect when it has a count ("12 件", "138 対 353")
 * and either speaks of the corpus (a threshold like "10 件未満" is the corpus's)
 * or names no reference at all. It is a heuristic for
 * validate's warning, not a proof: a count the heuristic cannot place is
 * shown to the editor, who rewrites it as a comparison or names the reference.
 */

/** Words that place a sentence in the example corpus. */
export const CORPUS_WORDS =
  /用例コーパス|コーパス|話し言葉|書き言葉|話・書|字幕|書き起こし|講義|Khan|MIT|OCW|3Blue1Brown|blackpenredpen|NancyPi|patrickJMT|PatrickJMT|Leonard|Organic Chemistry Tutor|YouTube|件未満/;

/** Words that name a reference whose counts may be written. */
export const REFERENCE_WORDS = /CED|OpenStax|(?<![A-Za-z])IM(?![A-Za-z])|CK-12|Nicholson|Levin|Wikipedia/;

/** "12 件", or two counts set against each other ("138 対 353"; "1 対 1" is a one-to-one correspondence). */
const COUNT = /\d[\d,]*\s*件|(?!1\s*対\s*1(?![\d,]))\d[\d,]*\s*対\s*\d[\d,]*/;

/** Cuts at 。 outside parentheses: a 。 inside （…） ends a sentence within the aside, not the aside. */
export function sentences(text: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of text) {
    cur += ch;
    if (ch === "（" || ch === "(") depth++;
    else if ((ch === "）" || ch === ")") && depth > 0) depth--;
    else if (ch === "。" && depth === 0) {
      out.push(cur.trim());
      cur = "";
    }
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** The sentences of `text` that look like they carry a count from the example corpus. */
export function corpusCountSentences(text: string): string[] {
  return sentences(text).filter((s) => COUNT.test(s) && (CORPUS_WORDS.test(s) || !REFERENCE_WORDS.test(s)));
}

/**
 * The body text of an entry, as [field path, text] pairs: what a reader sees
 * as prose. `evidence`, `flags` and `sources` are records, not prose, and are
 * left out (flags carry decide's counts on purpose).
 */
export function bodyTexts(data: Record<string, unknown>): [string, string][] {
  const out: [string, string][] = [];
  const walk = (x: unknown, at: string) => {
    if (typeof x === "string") out.push([at, x]);
    else if (Array.isArray(x)) x.forEach((y, i) => walk(y, `${at}[${i}]`));
    else if (x && typeof x === "object") {
      for (const [k, v] of Object.entries(x)) {
        if (at === "" && (k === "evidence" || k === "flags" || k === "sources")) continue;
        walk(v, at ? `${at}.${k}` : k);
      }
    }
  };
  walk(data, "");
  return out;
}
