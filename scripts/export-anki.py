#!/usr/bin/env python3
"""Build the Anki deck (PLAN.md 14).

    python3 -m venv .venv && .venv/bin/pip install -r scripts/requirements.txt
    pnpm export                       # writes dist/data/*.json
    .venv/bin/python scripts/export-anki.py --out dist/data/matheigo.apkg

Reads the JSON that scripts/export.ts wrote (so the 説明の訳 rule lives in one
place, src/lib/gloss.ts) and keeps **verified entries only**: a wrong card you
drill every morning is worse than a missing one (DECISIONS, Phase 0). With no
verified entry it writes nothing and says so.

Three note types, sub-decks by Japanese curriculum unit, tags jp::数III /
us::Calculus-I / pos::verb / mapping::none / gloss::説明の訳. Card types:

  MathEigo Term    JA -> EN (production)   Audio -> JA (listening)
                   EN -> JA (reading, off: generated only when the
                   Enable_EN_JA field is filled in)
  MathEigo Symbol  LaTeX front (Anki's MathJax, \\( ... \\)), spoken_en back
  MathEigo Phrase  Japanese intent front, English + variants back

Explanatory translations (en_is_explanatory_translation) carry the label on
the back and get no listening card: their English is not something a US
teacher says (PLAN §9 Phase 4 の 2).

The model and deck IDs are frozen (docs/DECISIONS.md, Phase 4). Changing them
makes Anki import a duplicate deck instead of updating the cards.
"""
import argparse
import hashlib
import json
import os
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

# Frozen on 2026-09-26 (random.randrange(1 << 30, 1 << 31)). Never change.
MODEL_ID_TERM = 1217344312
MODEL_ID_SYMBOL = 1727963048
MODEL_ID_PHRASE = 2049674010
DECK_ID_ROOT = 1310870968

DECK_ROOT = "MathEigo"
SITE = "https://matheigo.github.io"
GLOSS_LABEL = "説明の訳（英語の用語ではない）"

# Japanese subjects in teaching order (src/lib/data.ts JP_SUBJECTS).
JP_SUBJECTS = ["中1", "中2", "中3", "数学I", "数学A", "数学II", "数学B", "数学III", "数学C"]

TERM_FIELDS = [
    "ID", "JA", "Reading", "EN", "EN_Note", "TTS_Text", "Respelling", "Definition_JA",
    "Definition_EN", "LaTeX", "Example_EN", "Example_JA", "Level_JP", "Level_US",
    "Domain", "Audio", "URL", "Listen", "Enable_EN_JA",
]
SYMBOL_FIELDS = ["ID", "LaTeX", "Spoken_EN", "TTS_Text", "Spoken_JA", "Name_JA", "Name_EN", "Notes", "URL"]
PHRASE_FIELDS = ["ID", "Intent", "JA", "EN", "Variants", "Notes", "Situation", "URL"]

CSS = """.card { font-family: "Noto Sans JP", "Hiragino Sans", system-ui, sans-serif; font-size: 22px;
  text-align: center; color: #121826; background: #fdfdfc; line-height: 1.5; }
.nightMode .card, .card.nightMode { color: #e6eaf2; background: #0f131b; }
.en { font-family: system-ui, sans-serif; color: #0b4f8a; font-size: 26px; }
.nightMode .en { color: #8ab8e8; }
.sub { font-size: 15px; color: #5c6679; }
.gloss { display: inline-block; font-size: 14px; color: #7a4f00; border: 1px dashed currentColor;
  border-radius: 4px; padding: 0 6px; margin-top: 4px; }
.ex { font-size: 17px; margin-top: 12px; }
"""


def stable_id(name):
    """Deck ids for sub-decks: derived from the deck name, so they never move."""
    h = int(hashlib.sha1(name.encode("utf-8")).hexdigest()[:8], 16)
    return DECK_ID_ROOT + 1 + (h % (1 << 29))


def load(data_dir, name):
    path = os.path.join(data_dir, f"{name}.json")
    if not os.path.exists(path):
        return []
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def verified(rows):
    return [r for r in rows if r.get("confidence") == "verified"]


def term_unit(term_id, units):
    """The first Japanese unit (in teaching order) that lists the term."""
    for u in units:
        if term_id in u.get("term_refs", []):
            return f"{u['subject']}::{u['unit']}"
    return None


def term_fields(t):
    ex = (t.get("examples") or [{}])[0]
    gloss = bool(t.get("en_is_explanatory_translation"))
    return {
        "ID": t["id"],
        "JA": t["ja"]["term"],
        "Reading": t["ja"]["reading"],
        "EN": t["en"]["term"],
        "EN_Note": GLOSS_LABEL if gloss else "",
        "TTS_Text": t.get("tts_text") or t.get("spoken_en") or t["en"]["term"],
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
        "URL": f"{SITE}/terms/{t['id']}/",
        # A listening card trains the ear on what US teachers say; a paraphrase is not that.
        "Listen": "" if gloss else "1",
        "Enable_EN_JA": "",
    }


def term_tags(t):
    out = [f"jp::{lv}" for lv in t["level"]["jp"]]
    out += [f"us::{lv.replace(' ', '-')}" for lv in t["level"]["us"]]
    out.append(f"pos::{t['pos']}")
    out.append(f"mapping::{t['mapping']}")
    if t.get("en_is_explanatory_translation"):
        out.append("gloss::説明の訳")
    return out


def build(data_dir, out):
    terms = verified(load(data_dir, "terms"))
    symbols = verified(load(data_dir, "symbols"))
    phrases = verified(load(data_dir, "phrases"))
    if not (terms or symbols or phrases):
        print("export-anki: no verified entries yet - nothing written (the deck ships after the Phase 5 audit)")
        return None

    import genanki  # only needed once there is something to write

    order = {s: i for i, s in enumerate(JP_SUBJECTS)}
    units = sorted(
        (u for u in load(data_dir, "curriculum") if u.get("system") == "jp"),
        key=lambda u: (order.get(u["subject"], 99), u["id"]),
    )

    term_model = genanki.Model(
        MODEL_ID_TERM,
        "MathEigo Term",
        fields=[{"name": f} for f in TERM_FIELDS],
        templates=[
            {
                "name": "JA→EN",
                "qfmt": '{{JA}}<div class="sub">{{Reading}}</div>',
                "afmt": '{{FrontSide}}<hr id="answer"><div class="en">{{EN}}</div>'
                '{{#EN_Note}}<div class="gloss">{{EN_Note}}</div>{{/EN_Note}}'
                '{{#Listen}}<div>{{tts en_US:TTS_Text}}</div>{{/Listen}}{{Audio}}'
                '{{#Example_EN}}<div class="ex en">{{Example_EN}}</div><div class="sub">{{Example_JA}}</div>{{/Example_EN}}',
            },
            {
                "name": "Audio→JA",
                # genanki reads {{tts ...}} as an empty field, so the hidden ID keeps
                # Listen as the only field that decides whether this card exists.
                "qfmt": '{{#Listen}}{{tts en_US:TTS_Text}}{{Audio}}<span style="display:none">{{ID}}</span>{{/Listen}}',

                "afmt": '{{FrontSide}}<hr id="answer"><div class="en">{{EN}}</div><div>{{JA}}</div>'
                '<div class="sub">{{Definition_JA}}</div>',
            },
            {
                "name": "EN→JA",
                "qfmt": '{{#Enable_EN_JA}}<div class="en">{{EN}}</div>{{/Enable_EN_JA}}',
                "afmt": '{{FrontSide}}<hr id="answer">{{JA}}<div class="sub">{{Reading}}</div>',
            },
        ],
        css=CSS,
    )
    symbol_model = genanki.Model(
        MODEL_ID_SYMBOL,
        "MathEigo Symbol",
        fields=[{"name": f} for f in SYMBOL_FIELDS],
        templates=[
            {
                "name": "Symbol→Reading",
                "qfmt": "{{LaTeX}}",
                "afmt": '{{FrontSide}}<hr id="answer"><div class="en">{{Spoken_EN}}</div>'
                '<div>{{tts en_US:TTS_Text}}</div><div class="sub">{{Spoken_JA}}</div><div class="sub">{{Notes}}</div>',
            }
        ],
        css=CSS,
    )
    phrase_model = genanki.Model(
        MODEL_ID_PHRASE,
        "MathEigo Phrase",
        fields=[{"name": f} for f in PHRASE_FIELDS],
        templates=[
            {
                "name": "Intent→EN",
                "qfmt": '{{Intent}}<div class="sub">{{Situation}}</div>',
                "afmt": '{{FrontSide}}<hr id="answer"><div class="en">{{EN}}</div><div>{{tts en_US:EN}}</div>'
                '<div class="sub">{{JA}}</div><div class="ex">{{Variants}}</div><div class="sub">{{Notes}}</div>',
            }
        ],
        css=CSS,
    )

    decks = {}

    def deck(name):
        full = f"{DECK_ROOT}::{name}" if name else DECK_ROOT
        if full not in decks:
            decks[full] = genanki.Deck(DECK_ID_ROOT if not name else stable_id(full), full)
        return decks[full]

    for t in terms:
        unit = term_unit(t["id"], units) or "米国の科目だけ"
        fields = term_fields(t)
        note = genanki.Note(
            model=term_model,
            fields=[fields[f] for f in TERM_FIELDS],
            tags=term_tags(t),
            guid=genanki.guid_for("term", t["id"]),
        )
        deck(f"用語::{unit}").add_note(note)

    for s in symbols:
        fields = {
            "ID": s["id"],
            "LaTeX": f"\\({s['latex']}\\)",
            "Spoken_EN": "<br>".join(x["text"] for x in s["spoken_en"]),
            "TTS_Text": s.get("tts_text") or s["spoken_en"][0]["text"],
            "Spoken_JA": s["spoken_ja"],
            "Name_JA": s["name_ja"],
            "Name_EN": s["name_en"],
            "Notes": "<br>".join(s.get("notes") or []),
            "URL": f"{SITE}/symbols/{s['id']}/",
        }
        deck("記号").add_note(
            genanki.Note(
                model=symbol_model,
                fields=[fields[f] for f in SYMBOL_FIELDS],
                tags=[f"jp::{lv}" for lv in s["level"]["jp"]],
                guid=genanki.guid_for("symbol", s["id"]),
            )
        )

    for p in phrases:
        fields = {
            "ID": p["id"],
            "Intent": p["intent"],
            "JA": p["ja"],
            "EN": p["en"],
            "Variants": "<br>".join(v["en"] for v in p.get("variants") or []),
            "Notes": "<br>".join(p.get("notes") or []),
            "Situation": p["situation"],
            "URL": f"{SITE}/phrases/{p['situation']}/#{p['id']}",
        }
        deck(f"フレーズ::{p['situation']}").add_note(
            genanki.Note(
                model=phrase_model,
                fields=[fields[f] for f in PHRASE_FIELDS],
                tags=[f"situation::{p['situation']}"],
                guid=genanki.guid_for("phrase", p["id"]),
            )
        )

    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    genanki.Package(list(decks.values())).write_to_file(out)
    print(f"export-anki: {len(terms)} term, {len(symbols)} symbol, {len(phrases)} phrase notes in {len(decks)} decks -> {out}")
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", default=os.path.join(ROOT, "dist", "data"), help="directory with the JSON from pnpm export")
    ap.add_argument("--out", default=os.path.join(ROOT, "dist", "data", "matheigo.apkg"))
    args = ap.parse_args()
    if not os.path.exists(os.path.join(args.data, "terms.json")):
        sys.exit(f"export-anki: {args.data}/terms.json not found - run pnpm export first")
    build(args.data, args.out)


if __name__ == "__main__":
    main()
