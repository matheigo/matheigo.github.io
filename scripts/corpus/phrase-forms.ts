/**
 * The key parts of the phrases (lib.ts countedAs) and who says each one
 * (lib.ts phraseGroup). Data only: lib.ts reads it. Kept apart from lib.ts
 * because it grows with every phrases batch.
 */
import type { PhraseGroup } from "./lib.js";

/**
 * Phrases are not counted as whole sentences (DECISIONS, Phase 3 の準備: フレーズの数え方): a sentence
 * never recurs word for word, so "Sorry, could you say that last part again?"
 * is 0 in any corpus. What is counted is the key part that carries the
 * intent, written as a terms verb phrase is ("…" a one-to-three-word blank,
 * inflection folded, "A | B" and "!w" as in TERM_FORMS): phrase id -> the
 * sentence as written in `en` / `variants` -> its key part. The key part is
 * also the key in counts and `evidence`. "" marks a sentence whose key part
 * cannot be told apart from other uses of the same words (a sentence-initial
 * "So"): it is not counted, as a term's uncountable wording goes to pitfalls.
 */
export const PHRASE_FORMS: Record<string, Record<string, string>> = {
  "class-asking-repeat": {
    "Sorry, could you say that again?": "say … again",
    "Could you repeat that last part?": "could you repeat | can you repeat",
    "Sorry, what did you say?": "what did you say",
  },
  // The variants are three different questions, not three ways to ask one (see the Phase 3 prep report).
  "exam-clarify-instruction": {
    'Does "simplify" here mean I should rationalize the denominator?': "does … mean i should",
    "Do you want the answer in exact form or as a decimal?": "in exact form",
    "Should I show all the steps for this one?": "show all … steps | show all the work | show your work",
  },
  "explaining-solution-first-step": {
    "First I set the two expressions equal, then I solved for x and checked the answer.": "first i",
    "What I did was set them equal and solve for x.": "what i did was",
    "I started by setting the two expressions equal to each other.": "i started by | i start by",
  },
  "office-hours-stuck-at-step": {
    "I'm confused about how you got from this line to the next one.": "i'm confused | i am confused",
    "I don't see how you got this line.": "i don't see how | i do not see how",
    "I don't understand how you got this line.": "i don't understand how | i do not understand how",
  },
  "written-solution-therefore": {
    "Therefore x = 3 is the only solution.": "therefore",
    "Hence x = 3 is the only solution.": "hence",
    "So x = 3 is the only solution.": "", // "so" is everywhere; a sentence-initial So cannot be told apart
  },
};

/**
 * Exam phrases that are said aloud during an exam - a student asking the
 * proctor, the proctor announcing - are counted by who says them, not on the
 * written corpus (DECISIONS, Phase 3 フレーズの前の修正 4): id -> group.
 */
export const PHRASE_SPEAKER: Record<string, PhraseGroup> = {
  "exam-clarify-instruction": "student",
};
