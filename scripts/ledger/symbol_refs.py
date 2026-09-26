"""Phase 3 prep: count where each symbol candidate occurs in the US references.

    python3 scripts/ledger/symbol_refs.py

Reads ledger/symbols.csv and scripts/ledger/symbol_probes.json (id -> literal
strings to look for), counts each probe in the local reference texts and
rewrites the reference part of the `source` column ("OpenStax 2516" ...).
The other parts of `source` (学習指導要領, data/symbols, PLAN) are kept.

References (all local, gitignored, no network):
  OpenStax   corpus/openstax-raw/**/*.cnxml and corpus/openstax-calculus/raw/*.cnxml
             (MathML: <m:mo stretchy="false">( is read as <mo>( ), and the prose of the
             written corpus corpus/openstax-*/*.txt, where math is spaced out
             ("P ( A | B )"). A probe counts in whichever form has more hits, so
             one occurrence is not counted twice
  CED        corpus/ref/ap-calculus-ab-bc-ced.txt
  CED-Stats  corpus/ref/ap-statistics-ced.txt
  CK-12      corpus/ref/ck12-geometry.txt, ck12-algebra.txt
IM is not counted: its text lost the math (formulas were images / MathJax).
"""

import csv
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LEDGER = os.path.join(ROOT, "ledger", "symbols.csv")
PROBES = os.path.join(ROOT, "scripts", "ledger", "symbol_probes.json")

REFS = {
    "OpenStax": sorted(
        glob.glob(os.path.join(ROOT, "corpus", "openstax-raw", "**", "*.cnxml"), recursive=True)
        + glob.glob(os.path.join(ROOT, "corpus", "openstax-calculus", "raw", "*.cnxml"))
    ),
    "OpenStax-text": sorted(glob.glob(os.path.join(ROOT, "corpus", "openstax-*", "*.txt"))),
    "CED": [os.path.join(ROOT, "corpus", "ref", "ap-calculus-ab-bc-ced.txt")],
    "CED-Stats": [os.path.join(ROOT, "corpus", "ref", "ap-statistics-ced.txt")],
    "CK-12": [
        os.path.join(ROOT, "corpus", "ref", "ck12-geometry.txt"),
        os.path.join(ROOT, "corpus", "ref", "ck12-algebra.txt"),
    ],
}

TAG = re.compile(r"<(/?)(?:m:)?(\w+)[^>]*>")


def load(files):
    out = []
    for f in files:
        with open(f, encoding="utf8") as fh:
            out.append(TAG.sub(r"<\1\2>", fh.read()))
    return "\n".join(out)


def main():
    missing = [k for k, fs in REFS.items() if not fs or not all(os.path.exists(f) for f in fs)]
    if missing:
        print(f"references missing: {', '.join(missing)} (python3 scripts/ledger/refetch.py refs; corpus:fetch:openstax)")
        sys.exit(1)
    texts = {k: load(fs) for k, fs in REFS.items()}
    probes = json.load(open(PROBES, encoding="utf8"))
    with open(LEDGER, encoding="utf8", newline="") as fh:
        rows = list(csv.DictReader(fh))
        fields = list(rows[0].keys())
    done = 0
    for row in rows:
        found = []
        for name, text in texts.items():
            if name == "OpenStax-text":
                continue
            ps = [TAG.sub(r"<\1\2>", p) for p in probes.get(row["id"], [])]
            if name == "OpenStax":
                n = sum(max(text.count(p), texts["OpenStax-text"].count(p)) for p in ps)
            else:
                n = sum(text.count(p) for p in ps)
            if n:
                found.append(f"{name} {n}")
        kept = [s for s in row["source"].split("|") if s and not re.match(r"^(OpenStax|CED|CED-Stats|CK-12) \d+$", s)]
        row["source"] = "|".join(kept + found)
        done += 1
        if done % 50 == 0 or done == len(rows):
            print(f"  {done}/{len(rows)}")
    with open(LEDGER, "w", encoding="utf8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=fields, lineterminator="\n")
        w.writeheader()
        w.writerows(rows)
    print(f"-> {os.path.relpath(LEDGER, ROOT)}")


if __name__ == "__main__":
    main()
