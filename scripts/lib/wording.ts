/**
 * Wordings STYLE forbids because they cannot be checked against a source
 * (STYLE 追記欄「「米国では〜」の主張は…確かめられないもの（通じる／通じない、
 * 減点されない、一番よく使う）は書かない」; DECISIONS, Phase 5 監査 セッション 1
 * D-5 and セッション 2, H-5). validate warns on them in the claim fields (the
 * notes, not the examples: a teacher's line "+C がないから 1 点減点ね" is an
 * example, not a claim).
 *
 *   通じる ／ 通じない ／ 通じやすい ／ 通じにくい   whether a wording is understood
 *   一番よく使う ／ 最もよく使う ／ 最もよく言う ほか   which wording is used most (the corpus decides that: evidence)
 *   減点される ／ 減点されない                    how an answer is graded
 *   ことが多い ／ ことが少ない                     how often - allowed when the sentence names the source it was checked
 *                                                against (a reference, the corpus, the 解説, the exam papers, Wikipedia)
 *   英語には〜がない ／ 決まった名前はない          a claim about English (or Japanese) at large: only the corpus and the
 *                                                references were checked, so the sentence says so or names its source
 *                                                (STYLE 原則 1; DECISIONS, Phase 5 監査 セッション 2 H-1 and セッション 3, the
 *                                                spot check redone by Claude Fable 5.1)
 */
import { CORPUS_WORDS, REFERENCE_WORDS, sentences } from "./corpus-count.js";

export const UNVERIFIABLE = /通じ(?:る|ない|やす|にく|ます|ません)|(?:一番|最も)よく(?:使|言|出|見|聞)|減点(?:され|しない|する)/;
export const OFTEN = /ことが(?:多い|少ない|ほとんど)/;
/** "English has no word for it": a claim about the language at large. Allowed when the sentence names what was checked. */
export const AT_LARGE = /英語には[^。]*?(?:ない|なく|無い|無く)|英語の決まった名前ではな|決まった(?:名前|言い方|語句)(?:は|が)な[いく]/;
/** A sentence that names what it was checked against. */
export const NAMES_A_SOURCE = new RegExp(`${REFERENCE_WORDS.source}|${CORPUS_WORDS.source}|学習指導要領|解説|共通テスト|センター試験|MICASE|Math Stack Exchange|Levin|Nicholson`);

/** The sentences of `text` that carry an unverifiable wording. */
export function unverifiableSentences(text: string): string[] {
  return sentences(text).filter((s) => UNVERIFIABLE.test(s) || ((OFTEN.test(s) || AT_LARGE.test(s)) && !NAMES_A_SOURCE.test(s)));
}

/** The claim fields of each collection (the notes; examples and phrases' sentences are not claims). */
export const CLAIM_FIELDS: Record<string, RegExp> = {
  terms: /^(mapping_note|pitfalls\[\d+\]|en\.variants\[\d+\]\.note|definition_ja|definition_en)$/,
  symbols: /^notes\[\d+\]$/,
  phrases: /^(notes\[\d+\]|variants\[\d+\]\.note)$/,
  conventions: /^(jp|us|advice_ja)$/,
};
