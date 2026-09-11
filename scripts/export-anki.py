#!/usr/bin/env python3
"""Build the Anki deck (PLAN.md 14).

    pip install genanki
    python3 scripts/export-anki.py --out dist/matheigo.apkg

Three note types, sub-decks by Japanese curriculum unit, tags jp::数III /
us::Calc1 / pos::verb / mapping::none. Card types:

  MathEigo Term    JA -> EN (production, ON)   Audio -> JA (listening, ON)
                     EN -> JA (reading, OFF by default)
  MathEigo Symbol  LaTeX front (Anki's MathJax, \\( ... \\)), spoken_en back
  MathEigo Phrase  Japanese intent front, English + variants back

TODO(Phase 4): fix the model and deck IDs below and record them in
docs/DECISIONS.md. They must never change afterwards, or updating the shared
deck creates duplicates instead of replacing cards.
"""
import argparse
import json
import os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

# Assigned once in Phase 4 with random.randrange(1 << 30, 1 << 31), then frozen.
MODEL_ID_TERM = None
MODEL_ID_SYMBOL = None
MODEL_ID_PHRASE = None
DECK_ID_ROOT = None

TERM_FIELDS = [
    "ID", "JA", "Reading", "EN", "TTS_Text", "Respelling", "Definition_JA",
    "Definition_EN", "LaTeX", "Example_EN", "Example_JA", "Level_JP", "Level_US",
    "Domain", "Audio", "URL",
]


def load(collection):
    d = os.path.join(ROOT, "data", collection)
    for name in sorted(os.listdir(d)):
        if name.endswith(".json"):
            with open(os.path.join(d, name), encoding="utf-8") as f:
                yield json.load(f)


def publishable(entry, show_unverified):
    c = entry.get("confidence")
    return c == "verified" or (show_unverified and c == "likely")


def term_row(t):
    ex = (t.get("examples") or [{}])[0]
    return {
        "ID": t["id"],
        "JA": t["ja"]["term"],
        "Reading": t["ja"]["reading"],
        "EN": t["en"]["term"],
        "TTS_Text": t.get("tts_text", ""),
        "Respelling": t.get("respelling", ""),
        "Definition_JA": t["definition_ja"],
        "Definition_EN": t["definition_en"],
        "LaTeX": f"\\({t['latex']}\\)" if t.get("latex") else "",
        "Example_EN": ex.get("en", ""),
        "Example_JA": ex.get("ja", ""),
        "Level_JP": "・".join(t["level"]["jp"]),
        "Level_US": ", ".join(t["level"]["us"]),
        "Domain": ", ".join(t["domains"]),
        "Audio": f"[sound:{os.path.basename(t['audio'])}]" if t.get("audio") else "",
        "URL": f"/terms/{t['id']}",
    }


def tags(t):
    out = [f"jp::{lv}" for lv in t["level"]["jp"]]
    out += [f"us::{lv.replace(' ', '')}" for lv in t["level"]["us"]]
    out.append(f"pos::{t['pos']}")
    out.append(f"mapping::{t['mapping']}")
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="dist/matheigo.apkg")
    ap.add_argument("--include-unverified", action="store_true",
                    help="dev only. Releases ship verified entries exclusively: a wrong "
                         "card you drill every morning is worse than a missing one.")
    args = ap.parse_args()
    show = args.include_unverified

    terms = [t for t in load("terms") if publishable(t, show)]
    symbols = [s for s in load("symbols") if publishable(s, show)]
    phrases = [p for p in load("phrases") if publishable(p, show)]

    print(f"would build {len(terms)} term, {len(symbols)} symbol, {len(phrases)} phrase notes")
    print(f"sub-decks: {sorted({lv for t in terms for lv in t['level']['jp']})}")
    print(f"example row: {term_row(terms[0]) if terms else '(none)'}")
    print(f"example tags: {tags(terms[0]) if terms else '(none)'}")

    if MODEL_ID_TERM is None:
        raise SystemExit(
            "\nPhase 4: assign the model and deck IDs at the top of this file, record them "
            "in docs/DECISIONS.md, then call genanki here. Field mapping and tagging above "
            "are ready."
        )


if __name__ == "__main__":
    main()
