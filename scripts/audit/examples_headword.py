#!/usr/bin/env python3
"""Phase 5 audit: terms none of whose examples use the headword (en.term).

    python3 scripts/audit/examples_headword.py            # every term with examples
    python3 scripts/audit/examples_headword.py --verified # only verified ones

DECISIONS (Phase 5 監査 セッション 2, 5): at least one example of a term uses the
words of en.term, not only a variant or an alt (midpoint-riemann-sum's examples
said midpoint rule; has-a-local-maximum-at's said relative maximum). This lists
the terms that break the rule, with the variant / alt the examples use instead.

Matching: case-insensitive; a plural (extremum / extrema too) / -s / -ed / -ing
on any word (take / taking, testing / test); a hyphen or a space between words;
"…" in the headword is 0-3 words; a one-letter variable (a, x, n, k, c, u, f,
θ ...) or a number in the headword stands for any one token (as x approaches a
matches "as x approaches 2"). Prints to the terminal.

Not every remaining row is a fault: a headword that names a topic (derivatives of
trigonometric functions), a headword with a generic object (move a term to the
other side: the example moves "the 3x"), and an explanatory translation (説明の訳:
its examples show how to say the idea, not the paraphrase) may stay as they are.
"""
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
VAR = re.compile(r"^(?:[a-z]|θ|\d+(?:\.\d+)?|[a-z]′?\([a-z]\))$")
# Latin / Greek plurals the -s rule misses (extremum / extrema)
IRREGULAR = {"extremum": "extrema", "maximum": "maxima", "minimum": "minima", "radius": "radii", "vertex": "vertices",
             "matrix": "matrices", "axis": "axes", "hypothesis": "hypotheses", "analysis": "analyses", "formula": "formulae",
             "locus": "loci", "focus": "foci", "criterion": "criteria", "index": "indices", "datum": "data", "modulus": "moduli"}


def word(w):
    """One headword word as a regex: plural, -s, -ed, -ing, an e dropped before -ing (take / taking), an irregular plural."""
    if w in IRREGULAR:
        return f"(?:{re.escape(w)}|{re.escape(IRREGULAR[w])})"
    if w.endswith("ing") and len(w) > 5:  # testing -> test, tests, tested, testing
        return re.escape(w[:-3]) + r"(?:s|es|ed|ing)?"
    if w.endswith("e") and len(w) > 3:  # take -> takes, taking, taken
        return re.escape(w[:-1]) + r"(?:e|es|ed|ing|en)?"
    return re.escape(w).replace(r"\-", r"[\- ]?") + r"(?:s|es|ed|ing)?"


def pattern(term):
    """The headword as a regex over an example sentence."""
    chunks = [c.strip() for c in re.split(r"…|\.\.\.", term.lower()) if c.strip()]
    parts = []
    for c in chunks:
        words = re.findall(r"[a-z0-9'’θ′()\-]+", c)
        rx = []
        for w in words:
            w = w.strip("-")
            if not w:
                continue
            if VAR.match(w):
                rx.append(r"\S+")  # a variable or a number stands for any token
            else:
                rx.append(word(w))
        if rx:
            parts.append(r"(?<![a-z])" + r"[\s\-]+".join(rx) + r"(?![a-z])")
    return re.compile(r"(?:\s+\S+){0,3}\s+".join(parts), re.I) if parts else None


def main():
    only_verified = "--verified" in sys.argv
    rows = []
    for f in sorted(glob.glob(os.path.join(ROOT, "data", "terms", "*.json"))):
        d = json.load(open(f, encoding="utf-8"))
        if only_verified and d.get("confidence") != "verified":
            continue
        examples = d.get("examples") or []
        if not examples:
            continue
        head = d["en"]["term"]
        rx = pattern(head)
        text = " ".join(e["en"] for e in examples)
        if rx is None or rx.search(text):
            continue
        used = []
        for v in d["en"].get("variants") or []:
            r2 = pattern(v["term"])
            if r2 and r2.search(text):
                used.append(f"variant {v['term']}")
        for a in d["en"].get("alt") or []:
            r2 = pattern(a)
            if r2 and r2.search(text):
                used.append(f"alt {a}")
        rows.append((d["id"], d["confidence"], head, used, [e["en"] for e in examples]))
    print(f"{len(rows)} terms whose examples do not use en.term ({sum(1 for r in rows if r[3])} use a variant / alt instead)")
    for id_, conf, head, used, exs in rows:
        print(f"{id_} | {conf} | {head} | {'; '.join(used) or '(neither)'}")
        for e in exs:
            print(f"    {e}")


if __name__ == "__main__":
    main()
