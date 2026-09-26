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
  "dont-forget-the-plus-c": {
    "Don't forget the plus C.": "plus c",
    "Don't forget your constant of integration.": "constant of integration",
  },
  "top-minus-bottom": {
    "It's top minus bottom.": "top minus bottom | top … minus bottom | top minus … bottom | top … minus … bottom",
    "Subtract the bottom curve from the top curve.": "subtract the bottom | subtract the lower",
  },
  "area-is-never-negative": {
    "Area is always positive, so if you get a negative number, something went wrong.": "area is always positive | area is positive | areas are positive | area is always going to be positive",
    "Area can't be negative.": "area can't be negative | area cannot be negative | can't have negative area | can't have a negative area",
  },
  "check-by-differentiating": {
    "You can always check your answer by taking the derivative.": "check your answer",
    "Take the derivative, and you should get back the integrand.": "you should get back | you get back the",
  },
  "add-up-thin-disks": {
    "Think of it as cutting the solid into a bunch of thin slices.": "bunch of slices | thin slices | little slices",
    "We're adding up a bunch of thin disks.": "bunch of disks | lot of disks | stack of disks | infinitely many disks | little disks | thin disks",
  },
  "find-the-intersections-to-get-the-limits": {
    "First find where the curves intersect — those are your bounds of integration.": "where … intersect",
    "Set them equal to get the bounds.": "set them equal | set … equal to each other",
  },
  "split-the-integral": {
    "Let's break this into two pieces at x = 0.": "into two pieces | into two parts",
    "We need to split the integral here.": "break … integral | split … integral",
  },
  "write-as-a-limit-of-a-sum": {
    "Let's write this as the limit as n approaches infinity of a sum.": "limit as n approaches infinity of",
    "Write it as the limit of a Riemann sum.": "limit of … riemann sum | limit of the sum | limit of this sum",
  },
  "integrate-the-inequality": {
    "Integrating both sides of the inequality from 0 to 1, we get": "integrate both sides | integrate … sides",
  },
  "the-area-of-the-region-bounded-by": {
    "Find the area of the region bounded by y = x² and y = x + 2.": "region bounded by",
    "Find the area of the region enclosed by the two curves.": "region enclosed by",
  },
  "find-the-area-by-integration": {
    "Let's set up an integral for the area.": "set up an integral | set up the integral",
    "We'll find the area by integrating.": "by integrating",
  },
  "integrate-by-parts-repeatedly": {
    "You'll have to integrate by parts twice.": "by parts twice",
    "Just integrate by parts again.": "by parts again",
  },
  "let-h-go-to-zero": {
    "Now take the limit as h approaches zero.": "as h approaches zero | as h approaches 0",
    "Now let h go to zero.": "h goes to zero | h goes to 0 | h go to zero | h go to 0",
  },
  "the-tangent-line-passes-through": {
    "Since the tangent line passes through (0, −1),": "passes through",
    "The tangent line goes through (0, −1).": "goes through",
  },
  "divide-numerator-and-denominator-by-n": {
    "Divide the numerator and denominator by n.": "numerator and denominator by",
    "Divide top and bottom by n.": "top and bottom by",
  },
  "rationalize-and-take-the-limit": {
    "Rationalize first, then take the limit.": "rationalize",
    "Multiply by the conjugate, and then take the limit.": "multiply by the conjugate | multiply … by the conjugate",
  },
  "the-one-sided-limits-agree": {
    "Since the left-hand and right-hand limits are equal, the limit exists.": "left-hand and right-hand limits | left- and right-hand limits | right-hand and left-hand limits",
    "Since the one-sided limits are equal, the limit exists.": "one-sided limits",
  },
  "differentiate-the-outside-first": {
    "Take the derivative of the outside first.": "derivative of the outside | derivative of the outer",
    "Differentiate the outside and leave the inside alone.": "leave the inside alone | leave the inside",
  },
  "multiply-by-the-derivative-of-the-inside": {
    "Then multiply by the derivative of the inside.": "derivative of the inside | derivative of the inner",
  },
  "f-double-prime-is-positive": {
    "Since f″(x) > 0, the graph of f is concave up.": "concave up",
  },
  "the-derivative-is-zero": {
    "The graph of f has a horizontal tangent at x = a.": "horizontal tangent",
    "The derivative is zero at x = a.": "derivative is zero | derivative equals zero | derivative is equal to zero",
  },
  "continuous-but-not-differentiable": {
    "It's continuous at 0, but it's not differentiable there.": "not differentiable",
    "It's continuous, but there's a sharp corner.": "sharp corner | a sharp point | a cusp | a kink",
  },
  "assume-it-holds-for-n-k": {
    "Inductive hypothesis: assume the statement is true for n = k.": "inductive hypothesis | induction hypothesis",
    "Suppose the statement holds for n = k.": "assume … true for | assume that … true for | suppose … true for | assume … holds for | suppose … holds for",
  },
  "it-also-holds-for-n-k-1": {
    "Inductive step: we show that the statement also holds for n = k + 1.": "inductive step | induction step",
    "So it is also true for n = k + 1.": "also true for",
  },
  "the-common-ratio-is-less-than-1": {
    "Since |r| < 1, the series converges.": "the series converges",
  },
  "multiply-by-r-and-subtract": {
    "Multiply both sides by r and subtract.": "multiply by r | multiply … by r",
    "Now subtract one equation from the other.": "subtract the two equations | subtract these two equations | subtract one from the other | subtract one equation from the other",
  },
  "find-the-pattern": {
    "Do you see a pattern?": "see a pattern | see the pattern",
    "Does anyone notice a pattern?": "notice a pattern | notice the pattern",
  },
  "squares-are-nonnegative": {
    "Since a square is never negative, (x − 1)² ≥ 0.": "never negative",
    "Squares of real numbers are always nonnegative.": "always nonnegative",
  },
  "left-side-minus-right-side": {
    "Consider the left side minus the right side.": "left side minus the right side | left-hand side minus the right-hand side | lhs minus rhs",
    "Subtract the right side from the left side and show the result is nonnegative.": "subtract the right side | subtract the right-hand side",
  },
  "the-equation-holds": {
    "Therefore, the identity is verified.": "the identity is verified | we have verified the identity",
    "Hence the identity holds.": "the identity holds | the equation holds | the equality holds",
  },
  "what-we-want-to-show": {
    "We want to show that f(x) > 0 for all x.": "we want to show",
    "We need to show that f(x) > 0 for all x.": "we need to show",
  },
  "involves-imaginary-numbers": {
    "You get complex roots.": "complex roots | complex solutions",
    "You get imaginary solutions.": "imaginary roots | imaginary solutions",
    "There are no real solutions.": "no real solutions | no real roots | no real solution",
  },
  "conversely": {
    "Conversely, if f′(x) > 0, then f is increasing.": "conversely",
    "Now for the other direction,": "other direction",
  },
  "rewrite-the-expression": {
    "Let's rewrite this as a single fraction.": "rewrite … as | rewrite this as | rewrite it as",
    "Let's rewrite the expression.": "rewrite the expression | rewrite this expression",
  },
  "on-the-interval-from-0-to-2": {
    "Find all solutions on the interval [0, 2π).": "on the interval",
    "Find all solutions in the interval [0, 2π).": "in the interval",
  },
  "the-base-is-greater-than-1": {
    "Since the base is greater than 1, the inequality sign stays the same.": "the inequality sign",
    "Since the base is greater than 1, the direction of the inequality does not change.": "direction of the inequality",
  },
  "split-at-the-median": {
    "The median splits the data into a lower half and an upper half.": "lower half | upper half",
  },
  "evaluate-critically": {
    "Critique the reasoning.": "critique",
    "Does this conclusion hold up?": "",
  },
  "organize-the-data": {
    "Put the data in order from least to greatest.": "least to greatest",
    "Put the numbers in order from smallest to largest.": "smallest to largest",
  },
  "probabilities-sum-to-1": {
    "The probabilities have to add up to one.": "add up to one | add up to 1",
    "The probabilities sum to one.": "sum to one | sum to 1",
  },
  "let-p-be-the-position-vector-of-p": {
    "Let p be the position vector of P.": "position vector of",
    "Let p = OP.": "",
  },
  "organize-in-a-table": {
    "Let's make a table.": "make a table",
    "Let's organize this in a table.": "organize … in a table | put … in a table",
  },
  "represent-with-a-graph": {
    "Let's graph it and see what it looks like.": "graph it",
    "Let's draw a graph.": "draw a graph",
  },
  "where": {
    "x = π/2 + kπ, where k is an integer.": "where … is an integer | where … is a constant | where … are constants | where … is a positive",
  },
  "clearly": {
    "Clearly, f(0) = 1.": "clearly",
    "It is clear that f(0) = 1.": "it is clear that | it's clear that",
  },
  "in-general": {
    "In general, this is not true.": "in general",
  },
  "take-positive-values": {
    "f(x) is always positive.": "is always positive | always positive",
    "f takes only positive values.": "takes only positive values | takes positive values | only positive values",
  },
  "apply-the-theorem": {
    "Now we can use the mean value theorem.": "use the … theorem",
    "Now we can apply the intermediate value theorem.": "apply the … theorem",
  },
  "by-definition": {
    "By definition,": "by definition",
    "By the definition of the derivative,": "by the definition of",
  },
  "check-the-sign": {
    "Let's check the sign of f prime on each interval.": "sign of f prime | the sign of the derivative",
    "Check the sign.": "check the sign",
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
