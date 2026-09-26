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
    "What do you mean by \"simplify\" here?": "what do you mean by",
    "When it says \"simplify,\" do you want us to rationalize the denominator?": "do you want us to",
    "Are we supposed to rationalize the denominator?": "are we supposed to",
  },
  "explaining-solution-first-step": {
    "First I set the two expressions equal, then I solved for x and checked the answer.": "first i",
    "What I did was set them equal and solve for x.": "what i did was",
  },
  "office-hours-stuck-at-step": {
    "I'm confused about how you got from this line to the next one.": "i'm confused | i am confused",
    "I don't see how you got this line.": "i don't see how | i do not see how",
    "I don't understand how you got this line.": "i don't understand how | i do not understand how",
  },
  "written-solution-therefore": {
    "Therefore x = 3 is the only solution.": "therefore",
    "Hence x = 3 is the only solution.": "hence",
    "So x = 3 is the only solution.": "",
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
    "Area is never negative.": "area is never negative | areas are never negative | area is always positive | area can't be negative | area cannot be negative",
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
    "Subtract the right side from the left side.": "subtract the right side from the left side | subtract the right-hand side from the left-hand side | left side minus the right side | left-hand side minus the right-hand side",
  },
  "the-equation-holds": {
    "Thus, the identity is verified.": "the identity is verified | we have verified the identity",
    "Therefore, the equation holds.": "the equation holds | the identity holds | the equality holds",
  },
  "what-we-want-to-show": {
    "We need to show that f(x) > 0 for all x.": "we need to show",
    "We want to show that f(x) > 0 for all x.": "we want to show",
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
  "omit": {
    "We usually leave out the multiplication sign.": "multiplication sign | times sign | multiplication symbol",
  },
  "in-order": {
    "Work from left to right.": "left to right | from left to right",
  },
  "by-hypothesis": {
    "By assumption, AB = CD.": "by assumption",
    "By hypothesis, AB = CD.": "by hypothesis",
    "Since AB = CD is given,": "",
  },
  "since": {
    "Since f′(x) > 0, f is increasing.": "since",
    "Because f′(x) > 0, f is increasing.": "because",
  },
  "are-equal-respectively": {
    "AB, BC, and CA are equal to DE, EF, and FD, respectively.": "respectively",
    "AB = DE, BC = EF, and CA = FD.": "",
  },
  "divide-the-figure": {
    "Break the figure up into rectangles and triangles.": "into rectangles | into triangles | into two triangles | into a rectangle | into two rectangles",
    "Break it up into smaller shapes.": "into smaller shapes | into simpler shapes | into shapes we know",
  },
  "square-and-add": {
    "Square both equations and add them.": "square and add | square them and add | square … and add them",
    "Square and add.": "square and add | square them and add | square … and add them",
  },
  "class-listening-does-that-make-sense": {
    "Any questions before we move on?": "any questions",
    "Does that make sense?": "does that make sense | does this make sense",
  },
  "class-listening-take-out-a-sheet-of-paper": {
    "Take out a sheet of paper.": "take out a sheet of paper | take out a piece of paper | get out a piece of paper | get out a sheet of paper",
  },
  "class-listening-turn-to-page": {
    "Turn to page 45.": "turn to page",
    "Open your books to page 45.": "open your books to | open your book to",
  },
  "class-listening-homework-is": {
    "For homework, do section 3.2, problems 1 through 25, odds.": "for homework",
    "Tonight's homework is 3.2, odd problems 1 to 25.": "homework is | tonight's homework",
  },
  "class-listening-answers-in-the-back": {
    "The answers to the odd-numbered problems are in the back of the book.": "back of the book | back of your book",
  },
  "class-listening-its-due": {
    "It's due Friday.": "it's due !to | is due !to | due on",
    "Turn it in at the start of class on Friday.": "turn it in | hand it in",
  },
  "class-listening-pass-your-papers-forward": {
    "Pass your papers forward.": "pass … forward | pass your papers | pass … to the front",
  },
  "class-listening-try-this-one": {
    "Go ahead and try this one — I'll give you a couple of minutes.": "try this one",
  },
  "class-listening-work-with-a-partner": {
    "Turn to your neighbor and compare.": "turn to your neighbor | talk to your neighbor | with your neighbor | turn to the person next to you",
    "Work with a partner.": "with a partner",
  },
  "class-listening-who-wants-to-come-up": {
    "Can I get a volunteer?": "a volunteer | any volunteers",
    "Who wants to come up and do this one?": "come up to the board | come up and do | come on up",
  },
  "class-listening-write-this-down": {
    "Write this down.": "write this down | write that down",
    "You'll want this in your notes.": "in your notes",
  },
  "class-listening-this-will-be-on-the-test": {
    "This will be on the test.": "on the test",
    "This will be on the exam.": "on the exam",
  },
  "class-listening-you-dont-need-to-memorize": {
    "You'll get a formula sheet, so you don't need to memorize this.": "formula sheet",
    "You don't have to memorize this one.": "don't need to memorize | don't have to memorize | don't memorize | do not need to memorize",
  },
  "class-listening-common-mistake": {
    "This is a really common mistake.": "common mistake | common error",
    "Watch out — this is where people lose points.": "lose points",
  },
  "class-listening-notice-that": {
    "Notice that the two triangles share a side.": "notice that",
    "The key thing to see here is that they share a side.": "the key thing",
  },
  "class-listening-recall-that": {
    "Remember that the derivative of sin x is cos x.": "remember that",
    "Recall that the derivative of sin x is cos x.": "recall that",
  },
  "class-listening-whats-the-next-step": {
    "What's the next step?": "next step",
    "What do we do now? Anybody?": "what do we do now | what do we do next | what should we do next | what do i do now",
  },
  "class-listening-oops-good-catch": {
    "Oops, my mistake — that should be a minus.": "my mistake | my bad",
    "Good catch, thank you.": "thanks for catching | thank you for catching | good catch",
  },
  "class-listening-well-come-back-to-this": {
    "We'll come back to this later.": "come back to this | come back to that",
  },
  "class-listening-extra-credit": {
    "This one's for extra credit.": "extra credit",
    "This is a bonus question.": "bonus question | bonus problem | bonus points",
  },
  "class-listening-lowest-quiz-dropped": {
    "Your lowest quiz score will be dropped.": "drop … lowest | lowest … dropped | lowest quiz",
  },
  "class-listening-final-is-cumulative": {
    "The final is cumulative.": "is cumulative | final is cumulative | exam is cumulative",
    "The final covers everything.": "final covers everything | exam covers everything | final will cover everything | final is going to cover everything",
  },
  "class-listening-office-hours-are": {
    "My office hours are Tuesdays from 2 to 4.": "office hours",
    "Come see me in office hours.": "come see me | come and see me",
  },
  "class-listening-raise-your-hand-if": {
    "Raise your hand if you got 5.": "raise your hand",
    "Thumbs up if you got 5.": "thumbs up",
  },
  "class-listening-lets-go-over-the-homework": {
    "Let's go over the homework.": "go over the homework | go over homework | go over the problem set | go over the assignment",
  },
  "class-listening-what-do-you-notice": {
    "What happens if we make x bigger?": "what happens if",
    "What do you notice?": "what do you notice",
  },
  "class-listening-same-idea-as-before": {
    "This is the same idea as before.": "same idea",
    "It's just like the last problem.": "just like the last problem | just like the last one | just like before",
  },
  "class-listening-warm-up": {
    "Let's start with a quick warm-up.": "warm-up | warm up",
  },
  "class-listening-in-your-own-words": {
    "Can you explain why that works?": "why that works | why this works | why does that work | why does this work",
    "Explain it in your own words.": "in your own words",
  },
  "class-listening-sanity-check": {
    "Does this answer make sense?": "answer make sense | answer makes sense | reasonable answer | answer is reasonable",
    "Let's do a quick sanity check.": "sanity check",
  },
  "class-asking-where-did-that-come-from": {
    "How do you get from this line to that one?": "how do you get",
    "Where did the 2 come from?": "where did … come from | where does … come from | where'd … come from",
  },
  "class-asking-why-can-we": {
    "How come we can divide by x here?": "how come",
    "Why is that?": "why is that",
  },
  "class-asking-how-do-you-read-this": {
    "How do you say this symbol?": "how do you say",
  },
  "class-asking-is-there-a-name-for-this": {
    "What's this called?": "what's it called | what is it called | what's that called | what is that called | what's this called | what is this called",
    "What do you call this?": "what do you call",
  },
  "class-asking-difference-between": {
    "What's the difference between a local max and an absolute max?": "what's the difference between | what is the difference between",
    "How is this different from a local max?": "how is … different from | how is that different",
  },
  "class-asking-can-i-write-it-this-way": {
    "I wrote it as 2(x + 1) — is that okay?": "is that okay | is that ok | is that all right | is that alright",
    "Can I just write it as 2x + 2?": "can i just",
  },
  "class-asking-does-it-still-work-if": {
    "What if x is negative?": "what if",
    "Does this still work if x is negative?": "does it still work | does that still work | does this still work",
  },
  "class-asking-typo-on-the-board": {
    "Should that be a minus?": "should it be | shouldn't it be | should that be | shouldn't that be",
    "Is that a typo?": "a typo",
  },
};

/**
 * Exam phrases that are said aloud during an exam - a student asking the
 * proctor, the proctor announcing - are counted by who says them, not on the
 * written corpus (DECISIONS, Phase 3 フレーズの前の修正 4; all of them since
 * Phase 3 フレーズ 2 の前の修正 3): id -> group. The printed instructions of an
 * exam (Justify your answer) stay written.
 */
export const PHRASE_SPEAKER: Record<string, PhraseGroup> = {
  // a student asking during or about the exam
  "exam-clarify-instruction": "student",
  "exam-ask-typo": "student",
  "exam-ask-scratch-paper": "student",
  "exam-ask-can-i-write-on-the-back": "student",
  "exam-ask-how-much-time": "student",
  "exam-when-do-we-get-it-back": "student",
  "exam-is-it-curved": "student",
  // the instructor or proctor announcing
  "exam-calculator-allowed": "instructor",
  "exam-multiple-choice-and-free-response": "instructor",
  "exam-partial-credit": "instructor",
  "exam-notes-allowed": "instructor",
  "exam-time-remaining": "instructor",
  "exam-pencils-down": "instructor",
};
