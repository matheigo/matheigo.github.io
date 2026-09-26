/**
 * Flag codes, in two kinds (DECISIONS, Phase 2 統計・ベクトルの単元の前の修正):
 *
 *   problem  something about the entry is still open. A verified entry may
 *            not carry one (validate), and decide / crosscheck lower a
 *            verified entry that gets one back to likely
 *   record   how a question about the entry was settled. It stays on the
 *            entry as the record of that decision and does not stand in the
 *            way of verified
 *
 * validate reads this table. A code in neither list is treated as a problem,
 * and validate warns about it so it gets a kind.
 */
export const PROBLEM_FLAGS = new Set([
  "corpus-undecided", // ③ that neither the rules nor the human have settled
  "corpus-register-mismatch", // the corpus contradicts the entry's register
  "corpus-auto-only", // a symbol reading backed by auto captions only
  "corpus-student-rare", // an email / discord phrase whose key part the MICASE students use fewer than 3 times
  "langlink-missing", // crosscheck: the ja article has no en langlink
  "langlink-mismatch", // crosscheck: the en langlink is not the entry's term
  "draft-reason", // why the entry is still a draft (no source)
]);

export const RECORD_FLAGS = new Set([
  "corpus-human-settled", // the human settled the headword of a ③
  "corpus-reference-fallback", // a ③ whose headword is what a reference (CED, OpenStax, Nicholson, Levin) calls it
  "corpus-no-fixed-expression", // a ③ for which English has no set way to say it
  "corpus-attested-only", // a phrase none of whose key parts reaches 10, its leader used 3 times or more by its speakers
]);

export const isProblemFlag = (code: string) => !RECORD_FLAGS.has(code);
