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
    "Sorry, could you say that again?": "!to !must say … again",
    "Could you repeat that last part?": "could you repeat | can you repeat",
    "Sorry, what did you say?": "what did you say",
  },
  // Three ways to ask what the instruction "simplify" means (narrowed to one intent in Phase 3; DECISIONS 750)
  "exam-clarify-instruction": {
    "What do you mean by \"simplify\" here?": "what do you mean by",
    "When it says \"simplify,\" do you want us to rationalize the denominator?": "do you want us to",
    "Are we supposed to rationalize the denominator?": "are we supposed to",
  },
  "explaining-solution-first-step": {
    "First I set the two expressions equal, then I solved for x and checked the answer.": "!the !at first i",
    "What I did was set them equal and solve for x.": "what i did was",
  },
  "office-hours-stuck-at-step": {
    "I'm confused about how you got from this line to the next one.": "i'm confused | i am confused",
    "I don't see how you got this line.": "i don't see how | i do not see how",
    "I don't understand how you got this line.": "i don't understand how | i do not understand how",
  },
  "written-solution-therefore": {
    "Therefore x = 3 is the only solution.": "therefore",
    "Thus x = 3 is the only solution.": "thus",
    "Hence x = 3 is the only solution.": "hence",
    "So x = 3 is the only solution.": "",
  },
  "dont-forget-the-plus-c": {
    "Don't forget the plus C.": "plus c",
    "Don't forget your constant of integration.": "constant of integration",
  },
  "top-minus-bottom": {
    "It's top minus bottom.": "top minus bottom | top … minus bottom !exponent !power | top minus … bottom !exponent !power | top … minus … bottom !exponent !power",
    "Subtract the bottom curve from the top curve.": "subtract the bottom | subtract the lower",
  },
  "area-is-never-negative": {
    "Area is never negative.": "area is never negative | areas are never negative | area is always positive | area can't be negative | area cannot be negative",
  },
  // check your answer was mostly checking against the video's work or an equation's solution (Phase 5 監査 11)
  "check-by-differentiating": {
    "You can always check your answer by taking the derivative.": "check by differentiating | check … by differentiating | check by taking the derivative | check … by taking the derivative",
    "Take the derivative, and you should get back the integrand.": "you should get back | you get back the",
  },
  "add-up-thin-disks": {
    "Think of it as cutting the solid into a bunch of thin slices and adding up their volumes.": "bunch of slices | thin slices | little slices",
    "We're adding up a bunch of thin disks.": "bunch of disks | lot of disks | stack of disks | infinitely many disks | little disks | thin disks",
  },
  "find-the-intersections-to-get-the-limits": {
    "First find where the curves intersect — those are your bounds of integration.": "where … intersect",
    "Set them equal to get the bounds.": "set them equal | set … equal to each other",
  },
  // into two pieces / into two parts alone were mostly other splits (a pie, partial fractions, a sum) (Phase 5 監査 11)
  "split-the-integral": {
    "We need to split the integral here.": "break … integral | split … integral | splitting … integral | broke … integral | broken … integral",
    "Let's break it into two intervals at x = 0.": "into two intervals",
  },
  // limit as n approaches infinity of alone was mostly a sequence or a series test (Phase 5 監査 11)
  "write-as-a-limit-of-a-sum": {
    "Write it as the limit of a Riemann sum.": "limit of … riemann sum | limit of the sum | limit of this sum",
    "Let's write the integral as the limit as n approaches infinity of a sum.": "limit as n approaches infinity of a riemann sum | limit as n approaches infinity of the sum | limit as n approaches infinity of a sum",
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
  // numerator and denominator by / top and bottom by were mostly multiplying (a conjugate, a common denominator) (Phase 5 監査 11)
  "divide-numerator-and-denominator-by-n": {
    "Divide the numerator and denominator by n.": "divide … numerator and denominator by | divide numerator and denominator by",
    "Divide top and bottom by n.": "divide … top and bottom by | divide top and bottom by",
  },
  "rationalize-and-take-the-limit": {
    "Rationalize first, then take the limit.": "rationalize",
    "Multiply by the conjugate, and then take the limit.": "multiply by the conjugate | multiply … by the conjugate",
  },
  // the limits' names alone were mostly definitions and exercises; 22 to 22 after weighting was read (Phase 5 監査 12)
  "the-one-sided-limits-agree": {
    "Since the left-hand and right-hand limits are equal, the limit exists.": "left-hand and right-hand limits … equal | left- and right-hand limits … equal | right-hand and left-hand limits … equal | left-hand and right-hand limits are the same | left- and right-hand limits are the same",
    "Since the one-sided limits are equal, the limit exists.": "one-sided limits … equal | one-sided limits agree | one-sided limits are the same",
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
    "The derivative is zero at x = a.": "!second !partial !its !whose derivative is zero | !second !partial !its !whose derivative equals zero | !second !partial !its !whose derivative is equal to zero",
  },
  "continuous-but-not-differentiable": {
    "It's continuous at 0, but it's not differentiable there.": "not differentiable",
    "It's continuous, but there's a sharp corner.": "sharp corner | a sharp point | a cusp | a kink",
  },
  "assume-it-holds-for-n-k": {
    "Inductive hypothesis: assume the statement is true for n = k.": "inductive hypothesis | induction hypothesis",
    "Assume the statement is true for some k ≥ 1.": "assume … true for | assume that … true for | suppose … true for | assume … holds for | suppose … holds for",
  },
  "it-also-holds-for-n-k-1": {
    "Inductive step: we show that the statement also holds for n = k + 1.": "inductive step | induction step",
    "Now we show that it is also true for n = k + 1.": "also true for",
  },
  "the-common-ratio-is-less-than-1": {
    "Since |r| < 1, the series converges.": "the series converges",
  },
  // The human's en (監査 12 の前の決定 3). multiply … by r alone was mostly polar coordinates, a Jacobian, a radius (Phase 5 監査 11);
  // subtract one from the other was mostly a distance, rational expressions; multiply both sides by r alone was r² in physics, a formula, polar (監査 12)
  "multiply-by-r-and-subtract": {
    "Multiply both sides by r, then subtract the two equations.": "multiply both sides by r, then subtract | multiply both sides by r and subtract | multiply … by r and subtract",
    "Multiply every term by r.": "multiply every term by r | multiply each term by r",
    "Subtract one equation from the other.": "subtract one equation from the other | subtract the two equations | subtract these two equations",
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
  // other direction alone was a direction in space or an order of integration (Phase 5 監査 11)
  "conversely": {
    "Conversely, if a² + b² = c², then the triangle is a right triangle.": "conversely",
    "Now for the other direction,": "for the other direction | the other direction of the proof | prove the other direction",
  },
  "rewrite-the-expression": {
    "Let's rewrite this as a single fraction.": "rewrite … as | rewrite this as | rewrite it as",
    "Let's rewrite the expression.": "rewrite the expression | rewrite this expression",
  },
  "on-the-interval-from-0-to-2": {
    "Find all solutions on the interval [0, 2π).": "solutions … on the interval | solutions on the interval | solve … on the interval | solve on the interval | equations on the interval | equation on the interval | exactly on the interval",
    "Find all solutions in the interval [0, 2π).": "solutions … in the interval | solutions in the interval | solve … in the interval | solve in the interval | equations in the interval | equation in the interval | exactly in the interval",
  },
  "the-base-is-greater-than-1": {
    "Since the base is greater than 1, the inequality sign stays the same.": "inequality stays the same | inequality … stays the same",
    "Since the base is greater than 1, the direction of the inequality does not change.": "direction of the inequality",
  },
  "split-at-the-median": {
    "The median splits the data into a lower half and an upper half.": "lower half | upper half",
  },
  // The human's en (監査 12 の前の決定 3). critique alone was the humanities' critique of a text (Phase 5 監査 11).
  // A "…" blank never crosses a "?", so "Do you agree with Noah? Why or why not?" is read by hand (DECISIONS)
  "evaluate-critically": {
    "Do you agree with this reasoning? Why or why not?": "agree … why or why not | explain your reasoning",
    "Critique the reasoning.": "critique the reasoning | critique reasoning",
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
    "Let p = OP⃗.": "",
  },
  "organize-in-a-table": {
    "Let's make a table.": "make a table",
    "Let's set up a table.": "set up a table",
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
  // ⓑ in general was an exercise's part heading, in general form an equation's form (Phase 5 監査 11)
  "in-general": {
    "In general, this is not true.": "!ⓑ in general !form",
  },
  "take-positive-values": {
    "f(x) is always positive.": "is always positive | always positive",
    "f takes only positive values.": "takes only positive values | takes positive values | takes on only positive values | takes on positive values",
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
    "Let's check the sign of f prime on each interval.": "sign of f prime !prime | the sign of the derivative",
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
  // into rectangles alone was mostly a Riemann sum's rectangles (Phase 5 監査 11)
  "divide-the-figure": {
    "Break the figure up into rectangles and triangles.": "into rectangles and triangles | into a rectangle and | into triangles | into two triangles | into two rectangles",
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
    "Open your books to page 45.": "open your books to | open your book to | open … to page",
  },
  "class-listening-homework-is": {
    "For homework, do section 3.2, problems 1 through 25, odds.": "for homework",
    "Tonight's homework is 3.2, odd problems 1 to 25.": "homework is | tonight's homework",
  },
  "class-listening-answers-in-the-back": {
    "The answers to the odd-numbered problems are in the back of the book.": "back of the book | back of your book",
  },
  "class-listening-its-due": {
    "It's due Friday.": "it's due !to | !credit is due !to | due on",
    "Turn it in at the start of class on Friday.": "turn it in | hand it in",
  },
  "class-listening-pass-your-papers-forward": {
    "Pass your papers forward.": "pass … forward | pass your papers | pass … to the front",
  },
  "class-listening-try-this-one": {
    "Go ahead and try this one — I'll give you a couple of minutes.": "try this one",
  },
  // talk to your neighbor / with your neighbor were a neighbor next door, whispering in a quiz, shaking hands (Phase 5 監査 11)
  "class-listening-work-with-a-partner": {
    "Work with a partner.": "with a partner",
    "Turn to your neighbor and compare.": "turn to your neighbor | turn to the person next to you",
  },
  "class-listening-who-wants-to-come-up": {
    "Can I get a volunteer?": "!as !with a volunteer | any volunteers",
    "Who wants to come up and do this one?": "come up to the board | come up and do | come on up",
  },
  // let me / let's / I'll write that down is the lecturer writing on the board (Phase 5 監査 11)
  "class-listening-write-this-down": {
    "Write this down.": "!me !let's !lets !to !gonna !i'll !i !we !can !will !won't !shall !just !actually !quickly !also !again write this down | !me !let's !lets !to !gonna !i'll !i !we !can !will !won't !shall !just !actually !quickly !also !again write that down",
    "You'll want this in your notes.": "in your notes",
  },
  // on the test / on the exam alone were mostly scores (their score on the test) (Phase 5 監査 11)
  "class-listening-this-will-be-on-the-test": {
    "This will be on the exam.": "be on the exam | what's on the exam | that's on the exam | is on the exam",
    "This will be on the test.": "be on the test | what's on the test | that's on the test | is on the test",
  },
  // the formula sheet alone was mostly a video's description section (Phase 5 監査 11)
  "class-listening-you-dont-need-to-memorize": {
    "You'll get a formula sheet, so you don't need to memorize this.": "your formula sheet | a formula sheet",
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
  // next step alone was mostly the lecturer's own next step (the next step is to ...) (Phase 5 監査 11)
  "class-listening-whats-the-next-step": {
    "What's the next step?": "what's the next step | what is the next step | what's our next step | what is our next step | what about the next step | what would be the next step",
    "What do we do now? Anybody?": "what do we do now | what do we do next | what should we do next | what do i do now",
  },
  "class-listening-oops-good-catch": {
    "Oops, my mistake — that should be a minus.": "my mistake !was !i | my bad !little !attitude",
    "Sorry, my bad — that should be a minus.": "my mistake !was !i | my bad !little !attitude",
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
    "I have office hours on Tuesdays from 2 to 4.": "i have office hours | i'll have office hours | i will have office hours",
  },
  "class-listening-raise-your-hand-if": {
    "Raise your hand if you got 5.": "raise your hand",
    "Thumbs up if you got 5.": "!your thumbs up",
  },
  "class-listening-lets-go-over-the-homework": {
    "Let's go over the homework.": "go over the homework | go over homework | go over the problem set | go over the assignment",
  },
  "class-listening-what-do-you-notice": {
    "What do you notice?": "what do you notice",
  },
  "class-listening-same-idea-as-before": {
    "This is the same idea as before.": "same idea",
    "It's just like the last problem.": "just like the last problem | just like the last one | just like before",
  },
  "class-listening-warm-up": {
    "Let's start with a quick warm-up.": "warm-up | warm up",
  },
  // why that works counted the lecturer's own explanations, not a question to the class (Phase 5 監査 11)
  "class-listening-in-your-own-words": {
    "Can you explain why that works?": "can you explain | can someone explain | can somebody explain | can anyone explain | can anybody explain | who can explain",
    "Explain it in your own words.": "in your own words",
  },
  "class-listening-sanity-check": {
    "Let's do a quick sanity check.": "sanity check",
    "Does this answer make sense?": "answer make sense | answer makes sense",
  },
  "class-asking-where-did-that-come-from": {
    "How do you get from this line to that one?": "how do you get",
    "Where did the 2 come from?": "where did … come from | where does … come from | where'd … come from",
  },
  // how come you / I / they were questions about someone's life; you know why is that was rhetorical (Phase 5 監査 11; !you dropped in 監査 12: "why do you why is that …")
  "class-asking-why-can-we": {
    "Why is that?": "!know why is that",
    "How come we can divide by x here?": "how come !you !i !they",
  },
  "class-asking-how-do-you-read-this": {
    "How do you say this symbol?": "how do you say",
  },
  "class-asking-is-there-a-name-for-this": {
    "What's this called?": "what's it called | what is it called | what's that called | what is that called | what's this called | what is this called",
    "What do you call this?": "what do you call !it",
  },
  "class-asking-difference-between": {
    "What's the difference between a local max and an absolute max?": "what's the difference between | what is the difference between",
    "How is this different from a local max?": "how is … different from | how is that different",
  },
  // is that okay / can i just alone were mostly a schedule, a permission or another request (Phase 5 監査 11)
  // the ledger's first sentence is the en again: Math Stack Exchange does not pick the en (Phase 5 監査 13)
  "class-asking-can-i-write-it-this-way": {
    "Is it okay if I write it like this?": "okay if i write !on | ok if i write !on | alright if i write !on | all right if i write !on | okay to write it | ok to write it",
    "I wrote it as 2(x + 1) — is that okay?": "i wrote it as | i wrote this as | i wrote that as",
    "Can I just write it as 2x + 2?": "can i just write | can i write it as | can i write this as",
  },
  "class-asking-does-it-still-work-if": {
    "What if x is negative?": "what if",
    "Does this still work if x is negative?": "does it still work | does that still work | does this still work",
  },
  "class-asking-typo-on-the-board": {
    "Should that be a minus?": "should it be | shouldn't it be | should that be | shouldn't that be",
    "Is that a typo?": "a typo",
  },
  "class-asking-go-back": {
    "Could you go back to the previous slide?": "could you go back | can you go back | go back to the previous | go back to the last slide | go back a slide",
  },
  "class-asking-slow-down": {
    "Could you slow down a little?": "slow down a little | slow down a bit | could you slow down | can you slow down",
  },
  "class-asking-i-got-a-different-answer": {
    "I got a different answer.": "got a different answer | got something different | got a different number | get a different answer",
    "What am I doing wrong?": "did i do something wrong | what did i do wrong | where did i go wrong | what am i doing wrong",
  },
  "class-asking-which-problems": {
    "Which problems are we supposed to do?": "which problems | what problems | which questions are",
    "Was that odds only?": "odds only | just the odds | only the odd | odd numbered | odd-numbered",
  },
  "class-asking-when-is-it-due": {
    "When is this due?": "when is it due | when is that due | when's it due | when is this due | when's that due | when is the homework due | when is the paper due | when are they due",
    "Is that due Friday or Monday?": "due on friday | due friday | due on monday | due monday | due next week",
  },
  // need to know this / that alone were mostly statements (Phase 5 監査 11)
  "class-asking-will-this-be-on-the-test": {
    "Do we need to know this for the exam?": "do we need to know | do we have to know | do we hafta know | do i need to know | do i have to know",
    "Will this be on the test?": "be on the test | be on the exam | be on the midterm | be on the final | be on the quiz",
  },
  // need to memorize alone was students telling each other what to memorize (Phase 5 監査 11)
  "class-asking-do-we-need-to-memorize": {
    "Do we need to memorize this formula?": "do we need to memorize | do we have to memorize | do i need to memorize | do i have to memorize | should we memorize | should i memorize | do we memorize",
    "Will we get a formula sheet?": "formula sheet | equation sheet | cheat sheet | note card | index card",
  },
  "class-asking-calculator-on-the-test": {
    "Can we use a calculator on the test?": "use a calculator | use calculators | use our calculators | bring a calculator | bring calculators",
    "Is the test calculator or non-calculator?": "non-calculator | no calculator | no calculators | without a calculator",
  },
  "class-asking-is-there-an-easier-way": {
    "Is there an easier way to do this?": "easier way | simpler way | quicker way | faster way",
    "Is there a shortcut?": "a shortcut | any shortcut",
  },
  "class-asking-could-we-use-another-method": {
    "Couldn't we just use the quadratic formula?": "couldn't we just | couldn't you just | can't we just | can't you just | couldn't i just | can't i just",
    "Can I use L'Hôpital's rule here instead?": "use … instead | instead of using",
  },
  "class-asking-another-example": {
    "Could you do another example?": "do another example | give us another example | show us another example | go over another example | do one more example | another example please",
    "Can you show us one more?": "do one more | show us one more | go through one more",
  },
  "class-asking-simplify-further": {
    "Do we need to simplify this further?": "simplify further | simplify it further | simplify this further | simplify it more | simplify any further | simplify that further | simplify more",
    "Is that as simple as it gets?": "as simple as it gets | as simplified as",
  },
  "office-hours-do-you-have-a-minute": {
    "Do you have a minute?": "have a minute | have a second | got a minute | got a second | have a sec",
    "Is now a good time?": "is this a good time | is now a good time | is it a good time | is this a bad time",
  },
  "office-hours-question-about-homework": {
    "I had a question about number 3 on the homework.": "had a question | have a question | got a question | have a couple of questions | had a couple of questions",
    "I wanted to ask about problem 3.": "wanted to ask | want to ask | wanted to ask you",
  },
  "office-hours-can-i-show-you-what-i-tried": {
    "Can I show you what I tried?": "show you what i | what i tried to do | tell you what i did | show you what i did",
    "Here's what I have so far.": "what i have so far | what i've got so far | what i got so far | so far i have | so far i've",
  },
  "office-hours-am-i-on-the-right-track": {
    "Am I on the right track?": "on the right track | in the right direction | right direction",
    "Is this approach going to work?": "will this work | would this work | would that work | will that work | is this going to work | is that going to work",
  },
  "office-hours-hint-not-the-answer": {
    "Could you give me a hint instead of the answer?": "a hint | any hints | a little hint | some hints",
    "Could you point me in the right direction?": "point me in the right direction | point us in the right direction",
  },
  // lost points / points off alone were the rules of an upcoming exam or one's own reason; on a math site they are points off a line or a game's score (Phase 5 監査 11)
  "office-hours-why-did-i-lose-points": {
    "I'm not sure why I lost points here.": "why i lost points | lost points on | lost points for | took points off | took off points | why did i lose points",
    "Could you explain what was wrong with my answer?": "what was wrong with my | what's wrong with my | what i did wrong",
  },
  "office-hours-regrade": {
    "I think this might have been graded incorrectly. Could you take another look?": "another look | regrade | re-grade | look at it again | look at this again | graded wrong | graded incorrectly | grading was wrong | grading error",
  },
  // study for alone was mostly a statement (I'm gonna go study for the quiz) (Phase 5 監査 11)
  "office-hours-how-to-study": {
    "How would you recommend studying for the midterm?": "how to study | how should i study | best way to study | how do i study | recommend studying | what would you recommend",
    "What's the best way to study for the exam?": "how to study | how should i study | best way to study | how do i study | recommend studying | what would you recommend",
  },
  // practice exam alone was students talking about the practice exam, not asking for one (Phase 5 監査 11)
  "office-hours-extra-practice": {
    "Do you have any old exams I could practice with?": "any old exams | have old exams | are there old exams | any practice exams | is there a practice exam | any past exams | any old tests",
    "Are there any extra practice problems I could do?": "any practice problems | any extra problems | more practice problems | extra practice problems | any extra practice",
  },
  "office-hours-understand-in-class-not-alone": {
    "I understand it in class, but I get stuck when I try it on my own.": "get stuck | got stuck | i'm stuck | i was stuck | i get lost | i got lost",
    "I can follow it in class, but I can't do it on my own.": "do it on my own | do it by myself | try it on my own | try it by myself | on my own i | by myself i",
    "It makes sense in lecture, but I keep getting stuck on the homework.": "get stuck | got stuck | i'm stuck | i was stuck | i get lost | i got lost",
  },
  // intuition alone was mostly one's own intuition (0 of 9 not getting it) (Phase 5 監査 11)
  "office-hours-intuition": {
    "I can follow the algebra, but I don't get the intuition behind it.": "the intuition behind | intuition behind | the intuition for | don't get the intuition",
    "What's the big picture here?": "what's the big picture | the big picture here",
  },
  "office-hours-when-to-use-which": {
    "How do I know which method to use?": "which method | which one to use | which formula to use | which equation to use",
    "How do I know when to use substitution and when to use integration by parts?": "when to use | when do you use | when do i use | when would you use | when should i use",
  },
  // getting used to alone was a lab tool, a professor's speech, a reader (0 of 5 about English terms) (Phase 5 監査 11)
  "office-hours-english-terms-are-new": {
    "I learned this in Japanese, so I'm still getting used to the English terms.": "the english terms | english terms | used to the english",
    "I understand the math, but I don't know the English terms yet.": "the english terms | english terms | used to the english",
  },
  // look it over / look this over were a chair's handout or reading one's own draft (Phase 5 監査 11)
  "office-hours-is-this-rigorous-enough": {
    "Could you look over my proof and tell me if it's rigorous enough?": "look over my | look at my proof | check my proof | check my work | get it looked over",
    "Is this rigorous enough?": "rigorous enough | is this rigorous | is my proof rigorous",
  },
  "office-hours-which-course-next": {
    "Should I take Linear Algebra or Calc II next semester?": "should i take | should i be taking | would you recommend taking | do you recommend taking",
    "Which one would you recommend taking next semester?": "should i take | should i be taking | would you recommend taking | do you recommend taking",
  },
  "office-hours-can-i-come-back": {
    "Can I come back if I get stuck again?": "can i come back | could i come back | if i come back | come back later | come back tomorrow | come back next week | stop by again | come by again | come back if",
  },
  // make more sense now counted a question to another student; that's helpful to answer was not thanks (Phase 5 監査 11)
  "office-hours-thanks-that-helps": {
    "Thanks, that really helps.": "that really helps | that helps a lot | that helped a lot | that's helpful !to | that was helpful | that's very helpful | that was really helpful | that's really helpful | that's so helpful",
    "Thanks, that makes a lot more sense now.": "that makes more sense now | it makes more sense now | makes a lot more sense now | makes sense now | makes more sense then | starting to make sense",
  },
  // the idea here is that ... explained a concept, not a plan (Phase 5 監査 11)
  "explaining-solution-overall-plan": {
    "The idea is to find the intersection points first and then integrate.": "the idea is to | the idea here is to | the idea was to | the basic idea is to | the whole idea is to",
    "My plan was to find where the curves meet and then integrate.": "my plan was | my plan is | our plan is | the game plan",
  },
  "explaining-solution-let-x-be": {
    "For the width, I just called it x.": "call it x | called it x | call that x | call this x",
    "I let x be the width of the rectangle.": "let x be | let x equal | let x equals | let x represent | let x stand for",
  },
  // write the equation of a line was finding a line's equation, not setting one up (Phase 5 監査 11)
  "explaining-solution-set-up-an-equation": {
    "First I wrote an equation from the given information.": "write an equation !of | wrote an equation !of | write down an equation | write the equation !of !in !as !this !for",
    "I set up an equation from what the problem says.": "set up an equation | set up the equation | set up equations | set up a system",
  },
  "explaining-solution-isolated-x": {
    "Then I solved for x.": "solve for x | solved for x",
    "I got x by itself.": "x by itself | x alone | x all by itself",
    "Then I isolated x.": "isolate x | isolate the x | isolate the variable",
  },
  // bare 'back into the original' counted the en's own plug ... back into twice; plug back in what u was undoes a u-substitution (Phase 5 監査 11)
  "explaining-solution-plugging-back-in": {
    "When I plugged it back in, I got 17, so it checks out.": "plug … back in !what !for | plug back in !what !for | plug … back into",
    "I substituted it back into the original equation.": "substitute it back | substitute that back | substitute … back into the original",
  },
  // everything to the left alone was mostly a number line (shade everything to the left of 2) (Phase 5 監査 11)
  "explaining-solution-moved-everything-to-one-side": {
    "I moved everything to one side.": "everything to one side | everything on one side | all to one side | everything over to one side | all on one side",
    "I got everything on the left side.": "everything to the left side | everything over to the left | move everything to the left | everything on the left side",
  },
  "explaining-solution-factored-and-set-to-zero": {
    "I factored it and set each factor equal to zero.": "each factor equal to zero | each factor equal to 0 | each factor to zero | set each factor | each factor is equal to zero",
    "Then I used the zero product property.": "zero product property | zero-product property | zero product rule",
  },
  // extraneous solution is its own term (extraneous-solution), not throwing out a solution; bare thrown out / throw that out were mostly
  // another sense (thrown out of school, I just throw that out for discussion) (Phase 5 監査 11)
  "explaining-solution-threw-out-a-solution": {
    "I threw out the negative solution because a length can't be negative.": "throw out … solution | threw out … solution | throw away … solution | threw away … solution | throw out … answer | threw out … answer | thrown out as | throw it out !there | threw it out !there",
    "I rejected the negative solution because a length can't be negative.": "reject … solution | reject that solution",
  },
  "explaining-solution-used-the-rule": {
    "I used the chain rule here.": "use the … rule | using the … rule",
    "Here I applied the product rule.": "apply the … rule | applying the … rule",
  },
  "explaining-solution-multiplied-both-sides": {
    "I divided both sides by x, which is okay since x isn't zero.": "divide both sides by | divide both sides",
    "I multiplied both sides by 2.": "multiply both sides by | multiply both sides",
  },
  "explaining-solution-flipped-the-inequality": {
    "I divided by a negative, so I flipped the inequality sign.": "flip the inequality | flip the inequality sign | flip the sign of the inequality | flip the direction of the inequality",
    "Dividing by a negative switches the inequality.": "switch the inequality | reverse the inequality | switch the direction of the inequality | reverse the direction of the inequality | switch the sign of the inequality",
  },
  "explaining-solution-drew-a-picture": {
    "I started by drawing a picture.": "draw a picture | drew a picture | draw a diagram | drew a diagram | draw a figure | drew a figure",
    "I sketched the graph to see what was going on.": "sketch the graph | sketch a graph | draw the graph | draw a graph | drew the graph | drew a graph",
  },
  "explaining-solution-worked-backwards": {
    "I worked backwards from what we want to show.": "work backwards | work backward | working backwards | working backward | worked backwards",
  },
  "explaining-solution-the-key-was": {
    "The key was noticing that the two triangles are similar.": "the key is | the key was | the key here is | the key thing is | the key idea is | the key step is",
    "The trick is to see that the triangles are similar.": "the trick is | the trick here is | the trick was | the trick is to",
  },
  "explaining-solution-thats-where-it-comes-from": {
    "That's where the 2 comes from.": "that's where … comes from | that's where … come from | that is where … comes from | that's where that comes from | that's where it comes from",
  },
  "explaining-solution-these-cancel": {
    "These two terms cancel out.": "cancel out | cancel each other | cancel with each other",
    "Everything in the middle cancels.": "everything cancels | all cancel | everything in the middle cancels | everything else cancels",
  },
  "explaining-solution-so-the-answer-is": {
    "So the answer is 12.": "the answer is | our answer is | my answer is | the final answer is",
    "So I got 12.": "",
    "And that gives us 12.": "",
  },
  // units of alone was mostly units in general (a unit of mass, units of time, a unit of labor) (Phase 5 監査 11)
  "explaining-solution-with-units": {
    "So the velocity is 4 meters per second.": "meters per second | feet per second | miles per hour | per second squared",
    "The units are meters per second.": "the units are | the units would be | the units will be | the units are going to be | in units of",
  },
  "explaining-solution-in-context": {
    "So this means the tank is draining at 3 liters per minute at t = 5.": "so this means | what this means is",
    "In context, that means the tank is losing 3 liters per minute.": "in context | in the context of the problem | in the context of this problem",
  },
  // not sure about / might be wrong were often about someone else (if you're not sure about that) (Phase 5 監査 11)
  "explaining-solution-not-sure-about-this-step": {
    "I'm not totally sure about this step.": "i'm not sure about | i'm not totally sure | i'm not really sure | i'm not quite sure | i'm not entirely sure | i'm not a hundred percent sure",
    "This part might be wrong.": "i might be wrong | i could be wrong | i may be wrong | this might be wrong | this could be wrong | that might be wrong | that could be wrong",
  },
  // the en's key part gains its own 'I made a mistake', which carries the intent (Phase 5 監査 11)
  "explaining-solution-let-me-back-up": {
    "Wait, let me back up — I made a mistake here.": "let me back up | let's back up | back up a little | back up a second | back up a step | i made a mistake | made a mistake here",
    "Wait, I take that back.": "take that back !up",
  },
  // that can't be true closed a proof by contradiction; both key parts narrowed alike (Phase 5 監査 11)
  "explaining-solution-that-cant-be-right": {
    "Wait, that can't be right — a probability can't be bigger than 1.": "that can't be right | that cannot be right",
    "Hmm, that doesn't seem right.": "doesn't seem right | does not seem right | !still doesn't look right | does not look right",
  },
  "explaining-solution-that-makes-sense": {
    "That makes sense, because the answer should be a little less than 10.": "makes sense because | make sense because",
    "That seems reasonable, since it should be a little less than 10.": "seems reasonable | seem reasonable | sounds reasonable",
  },
  "explaining-solution-matches-the-other-way": {
    "I got the same answer as before, so it's probably right.": "same answer as before | the same answer as !long | same answer we got | same answer i got",
    "This matches what we got the other way.": "matches what we got | matches what i got | agrees with what we got | agrees with what i got",
  },
  "explaining-solution-another-way": {
    "You could also complete the square.": "you could also",
    "Another way to do it is to complete the square.": "another way to do | another way of doing",
  },
  "explaining-solution-by-symmetry": {
    "By symmetry, the other half is the same, so I just doubled it.": "by symmetry",
    "Since it's symmetric, I found one half and doubled it.": "since it's symmetric | because it's symmetric | since it is symmetric | because it is symmetric",
  },
  "explaining-solution-derivative-equal-to-zero": {
    "I found the critical points by setting the derivative equal to zero.": "find the critical points | found the critical points",
    "I took the derivative and set it equal to zero.": "derivative and set it equal to | derivative and set it to | set the derivative equal to | set the derivative to | derivative equal to zero",
  },
  // the two key parts now both take end points (two words), as the captions spell it (Phase 5 監査 11)
  "explaining-solution-checked-the-endpoints": {
    "I also checked the endpoints.": "check … endpoints | check … end points | check the endpoint | check the end point",
    "I plugged in the endpoints too.": "plug in the endpoints | plugged in the endpoints | plug in the end points | plugged in the end points | plug in the end point | evaluate at the endpoints | evaluated at the endpoints",
  },
  "explaining-solution-used-a-calculator": {
    "I used my calculator to get a decimal approximation at the end.": "use a calculator | use my calculator | use your calculator | on my calculator | on your calculator",
    "At the end, I put it into my calculator.": "into my calculator | into your calculator | into the calculator | into a calculator",
  },
  "explaining-solution-rounded-at-the-end": {
    "I didn't round until the very end.": "round until | rounding until | round at the very end | round at the end | don't round until",
  },
  "explaining-solution-im-assuming": {
    "I'm assuming the speed is constant.": "i'm assuming | i am assuming | we're assuming | we are assuming",
    "This only works if the speed is constant.": "only works if | only work if",
  },
  // wrote is an irregular past, not folded with write: both key parts list both tenses (Phase 5 監査 11)
  "explaining-solution-rewrote-it-as": {
    "I wrote it as (x − 3)² + 1.": "wrote it as | write it as | wrote this as | write this as | wrote that as | write that as",
    "I rewrote it as (x − 3)² + 1.": "rewrote it as | rewrite it as | rewrote this as | rewrite this as | rewrote that as | rewrite that as",
  },
  "explaining-solution-tried-small-cases": {
    "I plugged in some numbers first to get a feel for it.": "plug in some numbers | plug in a few | try some numbers | try some values",
    "I tried a few simple cases first to see what happens.": "simple cases | simpler cases | small cases | a few cases",
  },
  "explaining-solution-otherwise-contradiction": {
    "If it weren't true, we'd get a contradiction, so it has to be true.": "we'd get a contradiction | we get a contradiction | we would get a contradiction | that's a contradiction | get a contradiction",
    "Assuming the opposite leads to a contradiction.": "leads to a contradiction | lead to a contradiction | leading to a contradiction",
  },
  "written-solution-let": {
    "Let x be the number of tickets sold.": "let … be the",
    "Let x represent the number of tickets sold.": "let … represent",
    "Let x denote the number of tickets sold.": "let … denote",
  },
  "written-solution-suppose": {
    "Suppose that f(a) = f(b).": "suppose that",
    "Assume that f(a) = f(b).": "assume that",
  },
  "written-solution-suppose-for-contradiction": {
    "Suppose, for the sake of contradiction, that √2 is rational.": "for the sake of contradiction | for contradiction",
    "Assume to the contrary that √2 is rational.": "to the contrary",
    "Suppose not. Then √2 is rational.": "suppose not | assume not",
  },
  "written-solution-then": {
    "This gives f′(x) = 2x − 4.": "this gives | which gives",
    "Then we have f′(x) = 2x − 4.": "then we have",
  },
  "written-solution-which-implies": {
    "2x = 6. It follows that x = 3.": "it follows that",
    "2x = 6, which implies x = 3.": "which implies",
    "2x = 6, so x = 3.": "",
    "2x = 6 ⟹ x = 3": "",
  },
  // The closing of a proof only (Phase 5 監査 5 バッチ 16, moved here with terms/end-of-proof by 監査 6 の決定 11):
  // "as desired" closes OpenStax Calculus's proofs (", as desired." □), not "as small as desired"; "completes the proof"
  // is the closing sentence, not "Complete the proof that …" (an exercise)
  // to / then complete the proof and having completed the proof were plans, not the closing line; as required by … meant a condition (Phase 5 監査 12)
  "written-solution-as-desired": {
    "This completes the proof.": "this completes the proof !that !of | which completes the proof !that !of | !having !then !to completes the proof. | !having !then !to completes the proof, | !having !then !to completing the proof !that !of",
    "Hence a + b is even, as desired.": "!small !large !close !accurate !accurately as desired. | !small !large !close !accurate !accurately as desired,",
    "Hence a + b is even, as required.": "as required. | as required,",
    "Hence a + b is even, which is what we wanted to show.": "what we wanted to show | what we wanted to prove | what we needed to show",
    "∎": "",
  },
  "written-solution-note-that": {
    "Notice that x² + 1 > 0 for all x.": "notice that",
    "Note that x² + 1 > 0 for all x.": "note that",
  },
  "written-solution-similarly": {
    "Similarly, BD = CE.": "similarly",
    "By the same argument, BD = CE.": "by the same argument | by the same reasoning | by a similar argument",
  },
  "written-solution-on-the-other-hand": {
    "On the other hand, f(3) < 0.": "on the other hand",
  },
  "written-solution-we-have": {
    "We have that f(2) = 5, so the point (2, 5) is on the graph of f.": "we have that",
    "We get that f(2) = 5.": "we get that",
  },
  "written-solution-taking-the-limit": {
    "Taking the limit as n → ∞, we get L = 1/2.": "taking the limit as | taking the limit of both sides | taking limits",
    "Letting n approach infinity, we get L = 1/2.": "letting … approach | letting … go to | letting … tend to",
  },
  "written-solution-reject-extraneous": {
    "x = −2 is an extraneous solution, so we reject it.": "is extraneous | are extraneous | extraneous solution | extraneous solutions",
    "x = −2 does not satisfy the original equation.": "not satisfy the original",
  },
  "written-solution-for-some-integer": {
    "n = 2k + 1, where k is an integer.": "where … is an integer | where … is any integer | where … are integers",
    "n = 2k + 1 for some integer k.": "for some integer",
  },
  "written-solution-case": {
    "There are two cases: x ≥ 0 and x < 0.": "two cases | three cases",
    "Case 1: x ≥ 0.": "case one",
  },
  "written-solution-final-answer": {
    "The solution is x = 3.": "the solution is | the solutions are | the solution set is",
    "Answer: x = 3": "",
  },
  // combining these alone folded combine like terms, compose functions, add forces (Phase 5 監査 12)
  "written-solution-combining": {
    "Putting this together, x = 2.": "putting this together | putting these together | putting it all together | putting everything together",
    "Combining these two results, we get x = 2.": "combining these two results | combining these results | combining the two results | combining these equalities | combining these … equalities | combining these inequalities | combining these … inequalities | combining these equations | combining these … equations | combining these … approximations | combining these conditions !is | combining these … conditions | combining these … cases | combining this with | !property combining both",
    "From (1) and (2), x = 2.": "",
  },
  "written-solution-by-induction": {
    "By induction, the statement holds for all n ≥ 1.": "by induction !hypothesis",
    "By the principle of mathematical induction, the statement holds for all n ≥ 1.": "by mathematical induction | by the principle of mathematical induction",
  },
  "written-solution-it-suffices-to-show": {
    "It suffices to show that f′(x) > 0.": "it suffices to show | it suffices to prove | suffices to show",
    "It is enough to show that f′(x) > 0.": "it is enough to show | it's enough to show | enough to show that",
  },
  "written-solution-given-prove": {
    "Given: AB = CD, AB ∥ CD. Prove: △ABC ≅ △CDA.": "given … prove",
  },
  "written-solution-i-e": {
    "The tangent line at x = 1 is horizontal; that is, f′(1) = 0.": "that is,",
    "The tangent line at x = 1 is horizontal, i.e., f′(1) = 0.": "i.e.",
  },
  // using the … theorem folded the imperative "Use the … theorem to find …" of the exercises (Phase 5 監査 12)
  "written-solution-by-the-theorem": {
    "By the Pythagorean Theorem, AC = 5.": "!guaranteed !predicted !implied by the … theorem",
    "Using the Pythagorean Theorem, AC = 5.": "!we !that !to !equation using the … theorem,",
    "It follows from the Pythagorean Theorem that AC = 5.": "follows from the … theorem",
  },
  "written-solution-hypotheses-are-met": {
    "Since f is continuous on [1, 3] and differentiable on (1, 3), the Mean Value Theorem applies.": "theorem applies | rule applies | theorem can be applied | theorem may be applied | rule can be applied",
    "The hypotheses of the Mean Value Theorem are satisfied.": "hypotheses … are satisfied | conditions … are satisfied | hypotheses are met | conditions are met | hypotheses are satisfied | conditions are satisfied",
  },
  "written-solution-conclusion-because-reason": {
    "f changes from increasing to decreasing at x = 2, so f has a relative maximum there.": "changes from increasing to decreasing | changes from decreasing to increasing",
    "f has a relative maximum at x = 2 because f′ changes from positive to negative there.": "changes from negative to positive | changes from positive to negative | changes sign from negative to positive | changes sign from positive to negative",
  },
  "written-solution-from-the-graph": {
    "From the graph, f(2) = 3.": "from the graph | from the graphs",
    "The graph shows that f(2) = 3.": "graph shows that | graphs show that",
  },
  "written-solution-no-solution": {
    "Therefore, there is no solution.": "no solution | no solutions",
    "The equation has no real solutions.": "no real solution | no real solutions | no real roots",
  },
  "written-solution-let-epsilon-be-given": {
    "Let ε > 0 be given.": "let ε > zero be given | ε > zero be given | let ε > zero",
  },
  "exam-show-that": {
    "Show that f has a zero on [0, 1].": "show that",
  },
  "exam-justify-your-answer": {
    "Justify your answer.": "justify your answer",
    "Give a reason for your answer.": "give a reason for your answer | give a reason for",
  },
  "exam-explain-your-reasoning": {
    "Explain your reasoning.": "explain your reasoning",
    "Explain how you know.": "explain how you know",
  },
  "exam-show-your-work": {
    "Show your work.": "show your work | show all your work | show all work",
    "Show the work that leads to your answer.": "show the work that leads to | show the work that led to",
    "Answers without supporting work will receive no credit.": "without supporting work | receive no credit | no work, no credit",
  },
  "exam-exact-form": {
    "Give the exact value, not a decimal approximation.": "the exact value | an exact value | exact answer",
    "Leave your answer in exact form.": "in exact form | exact form",
  },
  "exam-three-decimal-places": {
    "Round your answer to three decimal places.": "round to three decimal places | round … to three decimal places | rounded to three decimal places",
    "Give your answer correct to three decimal places.": "correct to three decimal places | accurate to three decimal places | correct to three places",
    "Your answer should be accurate to three places after the decimal point.": "places after the decimal point",
  },
  "exam-simplest-form": {
    "Write your answer in simplest form.": "in simplest form | simplest form !of",
    "Express your answer as a fraction in lowest terms.": "in lowest terms",
  },
  "exam-express-in-terms-of": {
    "Express y in terms of x.": "express … in terms of",
    "Write your answer in terms of x.": "write … in terms of",
  },
  "exam-determine-whether": {
    "Determine whether the series converges or diverges.": "determine whether",
    "Determine if the series converges or diverges.": "determine if",
    "Decide whether the series converges or diverges.": "decide whether",
    "Tell whether the series converges or diverges.": "tell whether",
  },
  "exam-interpret-in-context": {
    "Interpret the meaning of f′(5) in context.": "in context",
    "Interpret the meaning of f′(5) in the context of the problem.": "in the context of the problem | in the context of this problem",
  },
  // 7 to 7 read: include 5-6, appropriate 4 (unit conversions, Kepler's law) (Phase 5 監査 12)
  "exam-indicate-units": {
    "Include units in your answer.": "include units | include the units",
    "Indicate units of measure.": "indicate units",
    "Use appropriate units.": "appropriate units !conversions | !the correct units",
  },
  "exam-use-the-table-to-approximate": {
    "Use the table to approximate W′(12).": "use the table to | using the table",
    "Use the data in the table to approximate W′(12).": "use the data in the table | using the data in the table",
  },
  "exam-write-an-equation-for-the-tangent-line": {
    "Find the equation of the tangent line at x = 2.": "equation of the tangent line | equation for the tangent line",
    "Write an equation for the line tangent to the graph of f at x = 2.": "equation for the line tangent to | equation of the line tangent to",
  },
  "exam-describe-the-distribution": {
    "Describe the distribution.": "describe the distribution | describe the shape of the distribution",
    "Describe the shape, center, and variability of the distribution.": "center, and variability | center and variability | center, and spread | center and spread",
  },
  "exam-which-of-the-following": {
    "Which of the following is true?": "which of the following",
    "Which of the following could be the graph of f?": "which of the following",
  },
  "exam-set-up-but-do-not-evaluate": {
    "Set up, but do not evaluate, an integral for the volume.": "do not evaluate | don't evaluate",
    "Write, but do not evaluate, an integral expression that gives the area of R.": "do not evaluate | don't evaluate",
  },
  "exam-label-your-axes": {
    "Label and scale the axes.": "label and scale",
    "Label the axes.": "label the axes !intercepts | label your axes | label each axis",
  },
  "exam-box-your-answer": {
    "Circle your final answer.": "circle your answer | circle the answer | circle your final answer",
    "Box your answer.": "box your answer | box your final answer",
  },
  "exam-calculator-allowed": {
    "You may use a calculator on this part.": "may use a calculator | calculators are allowed | calculator is allowed | can use a calculator | can use your calculator | calculator active",
    "Calculator not permitted": "calculator not permitted | calculator is not permitted | calculators are not permitted",
  },
  "exam-multiple-choice-and-free-response": {
    "The exam has a multiple-choice section and a free-response section.": "multiple-choice section | multiple choice section | multiple choice part | free-response section | free response section | free response part",
  },
  "exam-partial-credit": {
    "Show your work — you can get partial credit.": "partial credit",
  },
  "exam-notes-allowed": {
    "You can bring one sheet of notes, front and back.": "bring … page of note | bring … sheet of note | bring … index card | bring … cheat sheet | bring … note sheet",
    "You're allowed a cheat sheet.": "allowed a cheat sheet | allowed one cheat sheet",
  },
  "exam-time-remaining": {
    "You have 10 minutes left.": "minutes left",
    "Ten minutes remaining.": "minutes remaining",
  },
  "exam-pencils-down": {
    "Time's up. Pencils down.": "time's up | time is up | pencils down | pens down",
  },
  "exam-ask-typo": {
    "Should this be f(2) instead of f(3)?": "should this be | should that be",
    "Is there a typo in number 4?": "a typo | typo in",
  },
  // scratch paper alone named the thing, not a request for it (Phase 5 監査 12)
  "exam-ask-scratch-paper": {
    "Could I have another sheet of scratch paper?": "another sheet of scratch paper | more scratch paper | extra scratch paper | another sheet of paper",
    "Can I get some more paper?": "more paper",
    "Can I get another piece of scratch paper?": "another piece of scratch paper | another piece of paper",
  },
  "exam-ask-can-i-write-on-the-back": {
    "Can I write on the back?": "write on the back | use the back",
  },
  "exam-ask-how-much-time": {
    "How much time do we have left?": "how much time is left | how much time do we have | how much time left | how many minutes",
  },
  "exam-when-do-we-get-it-back": {
    "When will we get the exams back?": "exam back | test back",
    "When are we getting our midterms back?": "midterm back",
  },
  "exam-is-it-curved": {
    "Is the exam curved?": "exam curved | test curved | curve the exam | curve the test",
  },
  "email-subject-line": {
    "Subject: MATH 221 Sec. 3 – Question about HW 5": "question about",
  },
  "email-greeting": {
    "Dear Professor Smith,": "dear professor",
    "Hi Professor Smith,": "hi professor | hello professor",
  },
  "email-introduce-yourself": {
    "My name is Taro Yamada, and I'm in your MATH 221 section that meets MWF at 10.": "my name is | my name's",
  },
  "email-writing-to-ask": {
    "I'm writing to ask about problem 4 on the homework.": "i'm writing to | i am writing to",
    "I have a question about problem 4 on the homework.": "i have a question about | i had a question about",
  },
  "email-describe-where-stuck": {
    "For problem 3, I got as far as setting up the integral, but I'm not sure how to handle the absolute value.": "not sure how to",
    "I set up the integral, but I got stuck on the absolute value.": "got stuck on | get stuck on",
  },
  "email-missed-class": {
    "I'm sorry I had to miss class on Wednesday. Is there anything I should do to catch up?": "miss class",
    "Is there anything I need to catch up on?": "catch up on",
  },
  "email-cannot-make-office-hours": {
    "I have a class during your office hours. Would it be possible to meet at another time?": "would it be possible to",
  },
  "email-regrade-request": {
    "I'd like to ask about the grading on problem 2 of the midterm. I've attached a scan of my work.": "about the grading",
    "Could you take another look at problem 2?": "another look | regrade | re-grade | look at it again | look at this again | graded wrong | graded incorrectly | grading was wrong | grading error",
  },
  "email-extension": {
    "Would it be possible to get an extension on the homework?": "an extension on | extension on the homework",
  },
  "email-attached": {
    "I've attached my work as a PDF.": "i've attached | i have attached",
    "Please see the attached file.": "see the attached | the attached file",
  },
  "email-dictionary-during-exam": {
    "English is not my first language. Would it be possible for me to use a paper bilingual dictionary during the exam?": "my first language | my native language",
  },
  "email-exam-conflict": {
    "I have a conflict with the final exam time. Would it be possible to take it at a different time?": "a conflict with | have a conflict | conflict with my exam | conflict with my final | conflict with the final exam",
    "Could I take the exam at another time?": "at a different time | at another time",
    "I have two finals scheduled at the same time.": "two finals scheduled at the same time | two exams scheduled at the same time | two finals at the same time | two exams at the same time",
  },
  "email-prerequisite": {
    "I took calculus in Japan (Math III). Would that satisfy the prerequisite for MATH 221?": "prerequisite for | the prerequisite !of",
  },
  "email-confirm": {
    "Could you confirm whether the quiz on Friday covers Section 4.3?": "could you confirm | can you confirm",
  },
  "email-follow-up": {
    "I just wanted to follow up on my email from last week.": "follow up on | following up on",
  },
  "email-thank-you-for-your-time": {
    "Thank you for your time.": "thank you for your time | thanks for your time",
    "Thanks in advance.": "thanks in advance | thank you in advance",
  },
  "email-sign-off": {
    "Best, Taro Yamada": "",
    "Best regards, Taro Yamada": "best regards | kind regards",
    "Sincerely, Taro Yamada": "sincerely",
  },
  "group-study-work-together": {
    "Do you want to work on the homework together?": "work on homework together | work on … homework together",
    "Do you want to work on the problem set together?": "work on … problem set together",
    "Want to study together for the midterm?": "study together | studying together | want to study together | wanna study together | study together for the",
  },
  // at the library named a place; the students' own question is do you wanna meet … (Phase 5 監査 12)
  "group-study-where-to-meet": {
    "Do you want to meet at the library at 7?": "you wanna meet | we wanna meet | guys wanna meet | anybody wanna meet | anyone wanna meet | you want to meet | we want to meet | guys want to meet | anybody want to meet | anyone want to meet",
    "Does 7 at the library work?": "",
    "Let's meet at the library at 7.": "let's meet | meet at the library",
  },
  "group-study-what-did-you-get": {
    "What did you get for number 5?": "what did you get | what'd you get",
  },
  "group-study-how-did-you-get-that": {
    "I got something different — how did you get that?": "how did you get | how'd you get",
    "Can you show me how you got that?": "show me how you got | show me how you did",
  },
  "group-study-you-dropped-a-sign": {
    "I think you dropped a negative sign.": "dropped a negative | dropped a sign | dropped the negative | forgot the negative | forgot a negative",
    "I think you forgot the 2 here.": "you forgot the | you forgot a",
  },
  "group-study-split-them-up": {
    "Let's each do a few and then explain them to each other.": "explain them to each other | explain it to each other",
    "Should we split them up?": "split them up | divide them up",
    "Should we split up the problems?": "split up the problems | divide up the problems | split the problems",
  },
  "group-study-write-up-our-own": {
    "We can talk about the problems, but we have to write up our own solutions.": "write up our own | write up your own | write our own solutions | write your own solutions | write up your own solutions",
  },
  "group-study-answer-key-wrong": {
    "I think the answer key might be wrong.": "the answer key",
    "The back of the book says 12, but I keep getting 13.": "back of the book",
  },
  "group-study-ask-the-ta": {
    "Should we ask the TA?": "ask the ta",
    "Let's ask at office hours.": "ask at office hours | go to office hours",
  },
  "group-study-can-i-see-your-notes": {
    "Can I see your notes?": "see your notes | borrow your notes | look at your notes | copy your notes",
  },
  "group-study-quiz-each-other": {
    "Let's quiz each other.": "quiz each other | test each other | quiz me",
  },
  "group-study-not-sure-but": {
    "I'm not sure, but I think it's 4.": "not sure but",
    "Don't quote me on this, but I think it's 4.": "don't quote me",
  },
  "group-study-oh-that-makes-sense": {
    "Oh, I see.": "oh i see | ohh i see | oh okay i see",
    "Okay, that makes sense.": "okay that makes sense | yeah that makes sense | oh that makes sense",
  },
  // practice exam alone named the exam; no student suggested doing one (Phase 5 監査 12)
  "group-study-practice-exam": {
    "Let's do the practice exam under timed conditions.": "let's do the practice | let's take the practice | let's do a practice | under timed conditions",
    "Let's time ourselves.": "time ourselves | time yourself",
  },
  "group-study-what-is-it-asking": {
    "What is this question even asking?": "what is it asking | what's it asking | what is this question asking | what is this question even asking | what is it even asking",
    "What are they asking for here?": "what are they asking",
  },
  "group-study-where-do-we-start": {
    "Where do we even start with this one?": "where do we start | where do i start | where to start | where do we even start | where do i even start",
    "Any ideas for number 7?": "!have !has any ideas",
  },
  "discord-anyone-get": {
    "Did anyone get #3?": "did anyone get | has anyone gotten",
    "anyone figure out 3?": "anyone figure out | anyone figured out",
  },
  "discord-due-tonight": {
    "Is the homework due tonight?": "due tonight | due at midnight",
  },
  "discord-can-someone-explain": {
    "Can someone explain why the limit is 0 here?": "can someone explain | could someone explain",
  },
  "discord-here-is-my-work": {
    "Here's my work so far — where did I go wrong?": "here's my work | here is my work",
    "Where did I go wrong?": "where did i go wrong",
  },
  "discord-hint-no-spoilers": {
    "Can someone give me a hint? No full solutions pls.": "a hint | any hints | no full solutions",
    "Just a nudge please, no spoilers.": "no spoilers | a nudge",
  },
  "discord-nvm-figured-it-out": {
    "never mind, got it": "never mind | nevermind",
    "nvm, figured it out": "figured it out",
  },
  "discord-thanks": {
    "thanks, that helped": "that helped | that helps",
    "ty!": "",
  },
  "discord-same-answer": {
    "Same, I got 12 too.": "",
    "I got the same answer — 12.": "i got the same | got the same answer",
    "+1": "",
  },
  "discord-notes-from-today": {
    "Can someone share their notes from today?": "share their notes | share your notes | notes from today",
  },
  "discord-office-hours-today": {
    "Are you still having office hours today?": "have office hours | having office hours",
    "Are office hours still happening today?": "office hours today | office hours still",
  },
  // on the quiz alone was mostly grades (how did you do on the test) (Phase 5 監査 12)
  "discord-quiz-covers": {
    "Is 4.3 on the quiz too?": "be on the quiz | be on the test | be on the exam | is … on the quiz | is … on the test | is … on the exam | what's on the quiz | what's on the test | what's on the exam",
    "Does the quiz cover 4.3?": "quiz cover | exam cover | test cover",
  },
  "discord-when-is-the-midterm": {
    "When is the midterm?": "when is the midterm | when's the midterm | when is the exam | when's the exam",
  },
  "discord-typo-in-the-pset": {
    "I think there's a typo in #5 on the pset.": "a typo in | typo in the",
  },
  "discord-right-channel": {
    "Is this the right channel for calc questions?": "right channel",
    "Is this the right place to ask?": "right place to ask",
  },
  "discord-study-on-a-call": {
    "Anyone want to hop on a call and study?": "hop on a call | jump on a call | on a zoom call",
  },
  // i was wondering if opened requests (6) and polite questions (4) (Phase 5 監査 11)
  "office-hours-i-was-wondering": {
    "I was wondering if you could look over my answer to number 2.": "i was wondering if you could | i was wondering if you might | i was wondering if i could",
    "I was wondering whether you could take a look at my proof.": "i was wondering whether",
  },
  "group-study-does-that-mean": {
    "Does that mean it's not differentiable at x = 0?": "!what !exactly !world does that mean | !what !exactly !world does this mean",
    "So that means the limit doesn't exist?": "so that means",
  },
  "group-study-which-one-do-you-mean": {
    "Which one? The second equation?": "which one ?",
    "Are you talking about the second equation?": "!what are you talking about",
    "Do you mean the second equation?": "do you mean the",
  },
  // or is it just … asked which of two things; is that right here was a place (Phase 5 監査 12)
  "group-study-is-that-right": {
    "The answer is 3, is that right?": "is that right !here",
    "Is it just 2x?": "!or is it just",
  },
  "group-study-so-youre-saying": {
    "Oh, so we find a common denominator first?": "oh so",
    "So you're saying we should find a common denominator first?": "so you're saying | so you are saying",
  },
  "group-study-i-thought-it-was": {
    "Wait, I thought it was negative.": "i thought it was | i thought that was",
    "I thought you said the answer was 5.": "i thought you",
  },
  "group-study-do-you-see-what-i-mean": {
    "Do you see what I mean?": "see what i mean | know what i mean",
    "Do you know what I'm saying?": "know what i'm saying | see what i'm saying",
    "Does that make sense?": "does that make sense",
  },
  "group-study-what-do-you-mean": {
    "What do you mean by \"they cancel here\"?": "what do you mean",
    "What does that mean?": "what does that mean",
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
