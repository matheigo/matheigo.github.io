#!/usr/bin/env python3
"""Phase 5 audit, point ⑦: does a CED topic say what an entry says it does?

    python3 scripts/audit/ced.py calc 1.8 "squeeze theorem" ["sandwich"]   # AP Calculus AB and BC CED
    python3 scripts/audit/ced.py stats 2.4 "conditional probability"        # AP Statistics CED
    python3 scripts/audit/ced.py calc all "sign chart"                      # which topics use a word

A topic is the text from "TOPIC n.m" to the next "TOPIC" (the topic pages of
the CED). Prints the hits per word with a little context, to the terminal only.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FILES = {"calc": "ap-calculus-ab-bc-ced.txt", "stats": "ap-statistics-ced.txt"}


def topics(text):
    parts = re.split(r"\n(TOPIC \d+\.\d+)\n", text)
    out = {}
    for i in range(1, len(parts) - 1, 2):
        out.setdefault(parts[i].split()[1], []).append(parts[i + 1])
    return out


def main():
    which, topic, words = sys.argv[1], sys.argv[2], sys.argv[3:]
    text = open(os.path.join(ROOT, "corpus", "ref", FILES[which]), encoding="utf-8").read()
    t = topics(text)
    keys = sorted(t, key=lambda k: tuple(map(int, k.split(".")))) if topic == "all" else [topic]
    for w in words:
        pat = re.compile(r"(?<![A-Za-z])" + re.escape(w).replace(r"\ ", r"\s+") + r"(?:s|es)?(?![a-z])", re.I)
        found = []
        for k in keys:
            body = re.sub(r"\s+", " ", " ".join(t.get(k, [])))
            hits = [m.start() for m in pat.finditer(body)]
            if hits:
                found.append(k)
                if topic != "all":
                    for h in hits[:3]:
                        print(f"  {k} … {body[max(0, h - 70): h + 90]} …")
        print(f"{w}: topic {topic} → {'ある' if found else '無い'}" + (f" ({', '.join(found)})" if topic == 'all' else ""))


if __name__ == "__main__":
    main()
