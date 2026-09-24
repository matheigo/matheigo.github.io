#!/usr/bin/env bash
# YouTube and Khan Academy captions for the corpus (PLAN.md 15).
#
# MIT OCW is automated (`pnpm corpus:fetch:ocw`) because OCW distributes its
# transcripts itself. This one is NOT automated and is not run by CI: the
# terms of service are the operator's responsibility, so you run it by hand,
# on channels you have decided you may collect from.
#
# Requires yt-dlp.  brew install yt-dlp   |   pipx install yt-dlp
#
#   ./scripts/corpus/fetch-captions.sh yt:profleonard "https://www.youtube.com/@ProfessorLeonard"
#   ./scripts/corpus/fetch-captions.sh khan-ap-calc  "https://www.youtube.com/playlist?list=..."
#
# Only subtitles are downloaded - never audio or video (--skip-download).
# Output: corpus/<id>/*.txt plus corpus/<id>/manifest.part.json, which you then
# merge into corpus/manifest.json.
set -euo pipefail

ID="${1:?usage: fetch-captions.sh <source-id> <channel-or-playlist-url> [max]}"
URL="${2:?usage: fetch-captions.sh <source-id> <channel-or-playlist-url> [max]}"
MAX="${3:-40}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="$ROOT/corpus/$ID"
mkdir -p "$OUT"

echo "fetching up to $MAX caption files for $ID"

# Human-made English captions only, by default. AUTO=1 takes YouTube's own
# English auto captions instead (tagged auto:true below; auto captions misread
# formulas, so they are never the sole basis for a symbol reading).
# The language list is exact on purpose: "en.*" also matches machine
# translations into English from other tracks (en-bg, en-ko, ...), and those
# all map to the same .txt name, so the last one converted would win.
# Khan uploads its human captions as a named track (en-ehkg1hFWq8A, "English -
# Default"), hence en-<11-character track id> as well as en and en-US.
if [[ "${AUTO:-0}" == "1" ]]; then
  SUBS=(--write-auto-subs --sub-langs "en")
else
  SUBS=(--write-subs --sub-langs 'en(-US|-[A-Za-z0-9_-]{11})?')
fi
yt-dlp \
  --skip-download \
  "${SUBS[@]}" --sub-format vtt \
  --playlist-end "$MAX" \
  --sleep-requests 1 \
  --ignore-errors \
  -o "$OUT/%(title).80B.%(ext)s" \
  "$URL"

# VTT -> plain text, same treatment as fetch-ocw.ts
python3 - "$OUT" "${AUTO:-0}" <<'PY'
import glob, json, os, re, sys
out = sys.argv[1]
auto = sys.argv[2] == "1"
entries = []
for vtt in sorted(glob.glob(os.path.join(out, "*.vtt"))):
    lines = []
    for raw in open(vtt, encoding="utf-8", errors="replace"):
        line = raw.strip()
        if not line or line == "WEBVTT" or "-->" in line:
            continue
        if line.isdigit() or re.match(r"^(NOTE|STYLE|REGION|Kind:|Language:)", line):
            continue
        lines.append(re.sub(r"<[^>]+>", "", line))
    # auto captions repeat each line as the caption rolls; drop neighbours
    deduped = [l for i, l in enumerate(lines) if i == 0 or l != lines[i - 1]]
    txt = vtt.rsplit(".", 2)[0] + ".txt"
    open(txt, "w", encoding="utf-8").write(re.sub(r"\s+", " ", " ".join(deduped)).strip())
    entries.append({
        "id": os.path.basename(out),
        "register": "spoken",
        "auto": auto,
        "file": os.path.join(os.path.basename(out), os.path.basename(txt)),
        "title": os.path.basename(txt)[:-4],
        "license": "captions; counted as facts only, no text redistributed",
    })
    os.remove(vtt)
json.dump(entries, open(os.path.join(out, "manifest.part.json"), "w"), ensure_ascii=False, indent=2)
print(f"{len(entries)} transcript(s) -> {out}")
PY

echo
echo "now merge corpus/$ID/manifest.part.json into corpus/manifest.json, then:"
echo "  pnpm corpus:count && pnpm corpus:decide"
