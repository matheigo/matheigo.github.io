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
  "class-asking-go-back": {
    "Could you go back to the previous slide?": "could you go back | can you go back | go back to the previous | go back to the last slide | go back a slide",
  },
  "class-asking-slow-down": {
    "Could you slow down a little?": "slow down a little | slow down a bit | could you slow down | can you slow down",
  },
  "class-asking-i-got-a-different-answer": {
    "I got 8 — did I do something wrong?": "did i do something wrong | what did i do wrong | where did i go wrong | what am i doing wrong",
    "I got a different answer.": "got a different answer | got something different | got a different number | get a different answer",
  },
  "class-asking-which-problems": {
    "Which problems are we supposed to do?": "which problems | what problems | which questions are",
    "Was that odds only?": "odds only | just the odds | only the odd | odd numbered | odd-numbered",
  },
  "class-asking-when-is-it-due": {
    "Is that due Friday or Monday?": "due on friday | due friday | due on monday | due monday | due next week",
    "When is this due?": "when is it due | when is that due | when's it due | when is this due | when's that due | when is the homework due | when is the paper due | when are they due",
  },
  "class-asking-will-this-be-on-the-test": {
    "Do we need to know this for the exam?": "need to know this | have to know this | need to know that | have to know that | need to know all",
    "Will this be on the test?": "be on the test | be on the exam | be on the midterm | be on the final | be on the quiz",
  },
  "class-asking-do-we-need-to-memorize": {
    "Do we need to memorize this formula?": "need to memorize | have to memorize | should we memorize | do we memorize",
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
    "Can you show us one more?": "do one more | show us one more | go through one more",
    "Could you do another example?": "do another example | give us another example | show us another example | go over another example | do one more example | another example please",
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
    "Here's what I have so far.": "what i have so far | what i've got so far | what i got so far | so far i have | so far i've",
    "Can I show you what I tried?": "show you what i | what i tried to do | tell you what i did | show you what i did",
  },
  "office-hours-am-i-on-the-right-track": {
    "Am I on the right track?": "on the right track | in the right direction | right direction",
    "Is this approach going to work?": "will this work | would this work | would that work | will that work | is this going to work | is that going to work",
  },
  "office-hours-hint-not-the-answer": {
    "Could you give me a hint instead of the answer?": "a hint | any hints | a little hint | some hints",
    "Could you point me in the right direction?": "point me in the right direction | point us in the right direction",
  },
  "office-hours-why-did-i-lose-points": {
    "I'm not sure why I lost points here.": "lost points | lose points | took off points | take off points | points off | lost a point | took points off",
    "Could you explain what was wrong with my answer?": "what was wrong with my | what's wrong with my | what i did wrong",
  },
  "office-hours-regrade": {
    "I think this might have been graded incorrectly. Could you take another look?": "another look | regrade | re-grade | look at it again | look at this again",
    "I think this might have been graded incorrectly.": "graded wrong | graded incorrectly | grading was wrong | grading error",
  },
  "office-hours-how-to-study": {
    "How would you recommend studying for the midterm?": "study for | studying for | how to study | how should i study | best way to study",
    "What should I focus on for the exam?": "focus on for | should i focus on | should we focus on | should i concentrate on",
  },
  "office-hours-extra-practice": {
    "Do you have any old exams I could practice with?": "old exams | past exams | old tests | practice exams | practice exam | old midterms | old quizzes",
    "Are there any extra practice problems I could do?": "practice problems | extra problems | more problems | extra practice | more practice",
  },
  "office-hours-understand-in-class-not-alone": {
    "I understand it in class, but I get stuck when I try it on my own.": "get stuck | got stuck | i'm stuck | i was stuck | i get lost | i got lost",
    "I can follow it in class, but I can't do it on my own.": "do it on my own | do it by myself | try it on my own | try it by myself | on my own i | by myself i",
    "I keep getting stuck on the homework.": "get stuck | got stuck | i'm stuck | i was stuck | i get lost | i got lost",
  },
  "office-hours-intuition": {
    "I can follow the algebra, but I don't get the intuition behind it.": "intuition | intuitive | intuitively",
    "What's the big picture here?": "the big picture",
  },
  "office-hours-when-to-use-which": {
    "How do I know which method to use?": "which method | which one to use | which formula to use | which equation to use",
    "How do I know when to use substitution and when to use integration by parts?": "when to use | when do you use | when do i use | when would you use | when should i use",
  },
  "office-hours-english-terms-are-new": {
    "I learned this in Japanese, so I'm still getting used to the English terms.": "getting used to | get used to | not used to",
    "English isn't my first language.": "english is not my first language | english isn't my first language | english is my second language | not a native speaker | i'm not a native speaker",
  },
  "office-hours-is-this-rigorous-enough": {
    "Could you look over my proof and tell me if it's rigorous enough?": "look over my | look it over | look this over | look over this | looked over my | get it looked over | look at my proof | look at my work",
    "Is this rigorous enough?": "rigorous | enough justification | is this enough | is that enough | explain enough",
  },
  "office-hours-which-course-next": {
    "Should I take Linear Algebra or Calc II next semester?": "should i take | should i be taking | would you recommend taking | do you recommend taking",
    "Do you think I'm ready for Calc III?": "i'm ready for | am i ready for | ready to take",
  },
  "office-hours-can-i-come-back": {
    "Can I come back if I get stuck again?": "can i come back | could i come back | if i come back | come back later | come back tomorrow | come back next week | stop by again | come by again | come back if",
  },
  "office-hours-thanks-that-helps": {
    "That makes a lot more sense now.": "makes more sense now | makes a lot more sense now | makes sense now | make sense now | make more sense now | makes more sense then",
    "Thanks, that really helps.": "that really helps | that helps a lot | that helped a lot | that's helpful | that was helpful | that's very helpful | that was really helpful | that's really helpful | that's so helpful",
  },
  "explaining-solution-overall-plan": {
    "The idea is to find the intersection points first and then integrate.": "the idea is to | the idea here is | the idea was to | the basic idea is | the whole idea is",
    "My plan was to find where the curves meet and then integrate.": "my plan was | the plan is | our plan is | the plan was | my plan is | the game plan",
  },
  "explaining-solution-let-x-be": {
    "For the width, I just called it x.": "call it x | called it x | call that x | call this x",
    "I let x be the width of the rectangle.": "let x be | let x equal | let x equals | let x represent | let x stand for",
  },
  "explaining-solution-set-up-an-equation": {
    "First I wrote an equation from the given information.": "write an equation | wrote an equation | write down an equation | write the equation",
    "I set up an equation from what the problem says.": "set up an equation | set up the equation | set up equations | set up a system",
  },
  "explaining-solution-isolated-x": {
    "Then I solved for x.": "solve for x | solved for x",
    "I got x by itself.": "x by itself | x alone | x all by itself",
    "Then I isolated x.": "isolate x | isolate the x | isolate the variable",
  },
  "explaining-solution-plugging-back-in": {
    "When I plugged it back in, I got 17, so it checks out.": "plug … back in | plug back in | plug … back into",
    "I substituted it back into the original equation.": "substitute it back | substitute that back | substitute … back into the original | back into the original",
  },
  "explaining-solution-moved-everything-to-one-side": {
    "I moved everything to one side.": "everything to one side | everything on one side | all to one side | everything over to one side | all on one side",
    "I got everything on the left side.": "everything on the left | everything to the left | everything over to the left | everything on the left side",
  },
  "explaining-solution-factored-and-set-to-zero": {
    "I factored it and set each factor equal to zero.": "each factor equal to zero | each factor equal to 0 | each factor to zero | set each factor | each factor is equal to zero",
    "Then I used the zero product property.": "zero product property | zero-product property | zero product rule",
  },
  "explaining-solution-threw-out-a-solution": {
    "I rejected the negative solution because a length can't be negative.": "reject … solution | reject that solution | extraneous solution | extraneous root",
    "I threw out the negative solution.": "throw out … solution | throw away … solution | throw out … answer | throw away … answer | throw that out | throw that one out | throw it out",
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
  "explaining-solution-with-units": {
    "So the velocity is 4 meters per second.": "meters per second | feet per second | miles per hour | per second squared",
    "The units are meters per second.": "the units are | the units would be | the units will be | units of | in units of",
  },
  "explaining-solution-in-context": {
    "So this means the tank is draining at 3 liters per minute at t = 5.": "so this means | what this means is",
    "In context, that means the tank is losing 3 liters per minute.": "in context | in the context of the problem | in the context of this problem",
  },
  "explaining-solution-not-sure-about-this-step": {
    "I'm not totally sure about this step.": "not sure about | not totally sure | not really sure | not quite sure | not entirely sure | not a hundred percent sure",
    "This part might be wrong.": "might be wrong | could be wrong | may be wrong",
  },
  "explaining-solution-let-me-back-up": {
    "Wait, let me back up — I made a mistake here.": "let me back up | let's back up | back up a little | back up a second | back up a step",
    "Actually, scratch that.": "scratch that",
  },
  "explaining-solution-that-cant-be-right": {
    "Wait, that can't be right — a probability can't be bigger than 1.": "that can't be right | that cannot be right | that can't be true",
    "Hmm, that doesn't seem right.": "doesn't seem right | does not seem right | doesn't look right | does not look right",
  },
  "explaining-solution-that-makes-sense": {
    "That makes sense, because the answer should be a little less than 10.": "makes sense because | make sense because",
    "That seems reasonable, since it should be a little less than 10.": "seems reasonable | seem reasonable | sounds reasonable",
  },
  "explaining-solution-matches-the-other-way": {
    "I got the same answer as before, so it's probably right.": "same answer as before | the same answer as | same answer we got | same answer i got",
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
  "explaining-solution-checked-the-endpoints": {
    "I also checked the endpoints.": "check the endpoints | checked the endpoints | check the end points | checked the end points",
    "I plugged in the endpoints too.": "plug in the endpoints | plugged in the endpoints | evaluate at the endpoints | evaluated at the endpoints",
  },
  "explaining-solution-used-a-calculator": {
    "I used my calculator to get a decimal approximation at the end.": "use a calculator | use my calculator | use your calculator | on my calculator | on your calculator",
    "At the end, I put it into my calculator.": "into my calculator | into your calculator | into the calculator | into a calculator",
  },
  "explaining-solution-rounded-at-the-end": {
    "I didn't round until the very end.": "round until | rounding until | round at the very end | round at the end | don't round until",
    "I kept the exact value until the last step.": "keep the exact | kept the exact | keep it exact | leave it exact | keep everything exact",
  },
  "explaining-solution-im-assuming": {
    "I'm assuming the speed is constant.": "i'm assuming | i am assuming | we're assuming | we are assuming",
    "This only works if the speed is constant.": "only works if | only work if",
  },
  "explaining-solution-rewrote-it-as": {
    "I rewrote it as (x − 3)^2 + 1.": "rewrote it as | rewrite it as | rewrote this as | rewrite this as | rewrote that as | rewrite that as",
    "I wrote it as (x − 3)^2 + 1 instead.": "wrote it as | wrote this as | wrote that as",
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
  "written-solution-as-desired": {
    "This completes the proof.": "completes the proof",
    "Hence a + b is even, as desired.": "as desired",
    "Hence a + b is even, as required.": "as required",
    "Hence a + b is even, which is what we wanted to show.": "what we wanted to show | what we wanted to prove | what we needed to show",
    "∎": "",
  },
  "written-solution-note-that": {
    "Notice that x^2 + 1 > 0 for all x.": "notice that",
    "Note that x^2 + 1 > 0 for all x.": "note that",
  },
  "written-solution-similarly": {
    "Similarly, BD = CE.": "similarly",
    "By the same argument, BD = CE.": "by the same argument | by the same reasoning | by a similar argument",
  },
  "written-solution-on-the-other-hand": {
    "On the other hand, f(3) < 0.": "on the other hand",
  },
  "written-solution-we-have": {
    "We have that f(2) = 5, so f has a zero in (2, 3).": "we have that",
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
  "written-solution-combining": {
    "Combining these two results, we get x = 2.": "combining these | combining the two | combining this with | combining both",
    "Putting this together, x = 2.": "putting this together | putting these together | putting it all together | putting everything together",
    "From (1) and (2), x = 2.": "",
  },
  "written-solution-by-induction": {
    "By induction, the statement holds for all n ≥ 1.": "by induction",
    "By mathematical induction, the statement holds for all n ≥ 1.": "by mathematical induction | by the principle of mathematical induction",
  },
  "written-solution-it-suffices-to-show": {
    "It suffices to show that f′(x) > 0.": "it suffices to show | it suffices to prove | suffices to show",
    "It is enough to show that f′(x) > 0.": "it is enough to show | it's enough to show | enough to show that",
  },
  "written-solution-given-prove": {
    "Given: AB ≅ CD. Prove: △ABC ≅ △CDA.": "given … prove",
  },
  "written-solution-i-e": {
    "f is increasing on (0, ∞), i.e., f′(x) > 0 there.": "i.e.",
    "f is increasing on (0, ∞); that is to say, f′(x) > 0 there.": "that is to say",
  },
  "written-solution-by-the-theorem": {
    "Using the Pythagorean Theorem, AC = 5.": "using the … theorem",
    "By the Pythagorean Theorem, AC = 5.": "by the … theorem",
    "It follows from the Pythagorean Theorem that AC = 5.": "follows from the … theorem",
  },
  "written-solution-hypotheses-are-met": {
    "Since f is continuous on [1, 3] and differentiable on (1, 3), the Mean Value Theorem applies.": "theorem applies | rule applies | theorem can be applied | theorem may be applied | rule can be applied",
    "The hypotheses of the Mean Value Theorem are satisfied.": "hypotheses … are satisfied | conditions … are satisfied | hypotheses are met | conditions are met | hypotheses are satisfied | conditions are satisfied",
  },
  "written-solution-conclusion-because-reason": {
    "f changes from increasing to decreasing at x = 2, so f has a relative maximum there.": "changes from increasing to decreasing | changes from decreasing to increasing",
    "f has a relative minimum at x = 2 because f′ changes from negative to positive there.": "changes from negative to positive | changes from positive to negative | changes sign from negative to positive | changes sign from positive to negative",
  },
  "written-solution-from-the-graph": {
    "From the graph, f(2) = 3.": "from the graph | from the graphs",
    "The graph shows that f(2) = 3.": "the graph shows | graph shows that",
  },
  "written-solution-no-solution": {
    "Therefore, there is no solution.": "no solution | no solutions",
    "The equation has no real solutions.": "no real solution | no real solutions | no real roots",
  },
  "written-solution-let-epsilon-be-given": {
    "For any ε > 0, there is a δ > 0 such that |f(x) − L| < ε whenever 0 < |x − a| < δ.": "for any ε | for every ε | for all ε | given any ε",
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
    "Write your answer in simplest form.": "in simplest form | simplest form",
    "Express your answer as a fraction in lowest terms.": "in lowest terms",
  },
  "exam-express-in-terms-of": {
    "Express y in terms of x.": "express … in terms of",
    "Write your answer in terms of x.": "write … in terms of",
  },
  "exam-determine-whether": {
    "Determine whether the series converges or diverges.": "determine whether",
    "Tell whether the series converges or diverges.": "tell whether",
  },
  "exam-interpret-in-context": {
    "Interpret the meaning of f′(5) in context.": "in context",
    "Interpret the meaning of f′(5) in the context of the problem.": "in the context of the problem | in the context of this problem",
  },
  "exam-indicate-units": {
    "Use appropriate units.": "appropriate units | correct units",
    "Indicate units of measure.": "indicate units | include units | include the units",
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
