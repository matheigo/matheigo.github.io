#!/usr/bin/env python3
"""Phase 5 audit, point ⑦: does a CED section say what an entry says it does?

    python3 scripts/audit/ced.py calc 1.8 "squeeze theorem" ["sandwich"]   # AP Calculus AB and BC CED
    python3 scripts/audit/ced.py stats 2.4 "conditional probability"        # AP Statistics CED
    python3 scripts/audit/ced.py calc unit1 "sign chart"                    # the Unit 1 opener
    python3 scripts/audit/ced.py calc all "sign chart"                      # which sections use a word

Runs scripts/audit/ced.ts, which cuts the CED exactly as validate's CED note
check does (scripts/lib/ced-notes.ts cedSectionTexts; Phase 5 監査 5 の決定 9:
one implementation) and looks a word up in the normalized and the raw text
(決定 5). Prints to the terminal only.
"""
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

if __name__ == "__main__":
    sys.exit(subprocess.call(["pnpm", "exec", "tsx", os.path.join("scripts", "audit", "ced.ts"), *sys.argv[1:]], cwd=ROOT))
