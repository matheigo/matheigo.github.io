#!/usr/bin/env python3
"""Pre-generate the English TTS clips bundled into the Anki deck (PLAN.md 14).

Not wired into CI: this is a manual job. Stage 1 of the audio plan uses Anki's
built-in {{tts en_US:...}} tag and needs no files at all; this script is stage 2,
run once before a release.

    python3 scripts/gen-audio.py --engine kokoro          # first choice, Apache 2.0
    python3 scripts/gen-audio.py --engine piper           # second choice, MIT
    python3 scripts/gen-audio.py --only terms --force

Output: audio/{collection}/{id}.mp3, 64 kbps mono. Entries are skipped when the
hash of their spoken text has not changed since the last run (audio/.hashes.json),
so a regeneration only touches what actually changed.

TODO(Phase 4): install and call the chosen engine. Everything below the engine
call - selection, hashing, skipping, the manifest - is already in place.
"""
import argparse
import hashlib
import json
import os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
AUDIO = os.path.join(ROOT, "audio")
HASHES = os.path.join(AUDIO, ".hashes.json")
COLLECTIONS = ("terms", "symbols", "phrases")


def spoken_text(collection, entry):
    """What the voice should say. tts_text wins when the written form misreads."""
    if entry.get("tts_text"):
        return entry["tts_text"]
    if collection == "terms":
        # en.term, not spoken_en: the JA -> EN card asks for the words, and
        # spoken_en reads out the formula, which is a different clip.
        return entry["en"]["term"]
    if collection == "symbols":
        return entry["spoken_en"][0]["text"]
    return entry["en"]


def load(collection):
    d = os.path.join(ROOT, "data", collection)
    for name in sorted(os.listdir(d)):
        if name.endswith(".json"):
            with open(os.path.join(d, name), encoding="utf-8") as f:
                yield json.load(f)


def synthesize(text, out_path, engine):
    raise NotImplementedError(
        f"Phase 4: call {engine} here and write 64 kbps mono mp3 to {out_path}. "
        f"Text: {text!r}"
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--engine", default="kokoro", choices=["kokoro", "piper"])
    ap.add_argument("--only", choices=COLLECTIONS)
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--dry-run", action="store_true", default=True,
                    help="list what would be generated (default until Phase 4)")
    args = ap.parse_args()

    old = json.load(open(HASHES, encoding="utf-8")) if os.path.exists(HASHES) else {}
    new, todo = {}, []

    for collection in ([args.only] if args.only else COLLECTIONS):
        for entry in load(collection):
            text = spoken_text(collection, entry)
            key = f"{collection}/{entry['id']}"
            digest = hashlib.sha256(text.encode("utf-8")).hexdigest()[:16]
            new[key] = digest
            if args.force or old.get(key) != digest:
                todo.append((collection, entry["id"], text))

    print(f"{len(new)} clip(s) total, {len(todo)} to (re)generate with {args.engine}")
    for collection, entry_id, text in todo:
        out = os.path.join(AUDIO, collection, f"{entry_id}.mp3")
        if args.dry_run:
            print(f"  would write audio/{collection}/{entry_id}.mp3  <- {text!r}")
            continue
        os.makedirs(os.path.dirname(out), exist_ok=True)
        synthesize(text, out, args.engine)

    if not args.dry_run:
        os.makedirs(AUDIO, exist_ok=True)
        json.dump(new, open(HASHES, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

    print(
        "\nPLAN 14 quality gate: after generating, listen to every clip for "
        "mathematician names, abbreviations (ln, csc, arcsin, dx, Q.E.D.) and "
        "symbol readings. Fix via tts_text and regenerate."
    )


if __name__ == "__main__":
    main()
