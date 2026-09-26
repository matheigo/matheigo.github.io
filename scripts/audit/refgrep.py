#!/usr/bin/env python3
"""Phase 5 audit, point ⑦: look a word up in the sources a claim may rest on.

    python3 scripts/audit/refgrep.py jp '増減表' ['凹凸' ...]    # 学習指導要領解説・共通テスト／センター試験・日本語版 Wikipedia
    python3 scripts/audit/refgrep.py us 'sign chart' ...         # CED 2 つ・OpenStax 9 冊・IM・CK-12・Nicholson・Levin
    options: -c N  characters of context to print per hit (default 40, 0 = counts only), -n N  hits shown per source (default 3)
             -s    one line per word: hits per kind of source (解説 中・高, exam papers, Wikipedia articles / CED, OpenStax ...)

Whitespace is ignored on the Japanese side (pdftotext breaks lines in the
middle of words) and case on the English side (a plural -s / -es counts as the word). The context goes to the
terminal only: the source text is never written to the repository.
"""
import glob
import json
import os
import re
import sys
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
REF = os.path.join(ROOT, "corpus", "ref")


def jp_sources():
    for k in ("kaisetsu-chu", "kaisetsu-kou"):
        f = os.path.join(REF, "jp", f"{k}.txt")
        if os.path.exists(f):
            yield k, open(f, encoding="utf-8").read()
    for f in sorted(glob.glob(os.path.join(REF, "jp", "exams", "*.txt"))):
        yield "exam:" + os.path.basename(f)[:-4], open(f, encoding="utf-8").read()
    for f in sorted(glob.glob(os.path.join(REF, "jp", "wiki", "*.json"))):
        j = json.load(open(f, encoding="utf-8"))
        yield "wiki:" + j.get("title", os.path.basename(f)), j.get("text", "")


def us_sources():
    for k in ("ap-calculus-ab-bc-ced", "ap-statistics-ced", "im-6-8", "im-9-12", "ck12-geometry", "ck12-algebra",
              "nicholson-lawa-2021a", "levin-dmoi4"):
        f = os.path.join(REF, f"{k}.txt")
        if os.path.exists(f):
            yield k, open(f, encoding="utf-8").read()
    for d in sorted(glob.glob(os.path.join(ROOT, "corpus", "openstax-*"))):
        if d.endswith("openstax-raw"):
            continue
        text = "\n".join(open(f, encoding="utf-8").read() for f in sorted(glob.glob(os.path.join(d, "*.txt"))))
        yield os.path.basename(d), text


def main():
    args = sys.argv[1:]
    ctx, per = 40, 3
    summary = "-s" in args
    if summary:
        args.remove("-s")
    if "-c" in args:
        i = args.index("-c"); ctx = int(args[i + 1]); del args[i:i + 2]
    if "-n" in args:
        i = args.index("-n"); per = int(args[i + 1]); del args[i:i + 2]
    side, words = args[0], args[1:]
    srcs = list(jp_sources() if side == "jp" else us_sources())
    for w in words:
        if not summary:
            print(f"### {w}")
        total = 0
        kinds = {}
        for name, text in srcs:
            if side == "jp":
                t = unicodedata.normalize("NFKC", re.sub(r"\s+", "", text))
                pat = re.escape(unicodedata.normalize("NFKC", re.sub(r"\s+", "", w)))
                flags = 0
            else:
                t = re.sub(r"\s+", " ", text)
                pat = r"(?<![A-Za-z])" + re.escape(w).replace(r"\ ", r"\s+") + r"(?:s|es)?(?![a-z])"
                flags = re.I
            hits = [m.start() for m in re.finditer(pat, t, flags)]
            if not hits:
                continue
            total += len(hits)
            kind = name.split(":")[0]
            n, k = kinds.get(kind, (0, 0))
            kinds[kind] = (n + len(hits), k + 1)
            if summary:
                continue
            print(f"  {name}: {len(hits)}")
            if ctx:
                for h in hits[:per]:
                    print("     … " + t[max(0, h - ctx): h + len(w) + ctx].replace("\n", " ") + " …")
        if summary:
            print(f"{w}: " + (", ".join(f"{k} {n}" + (f"（{a} 件の記事・ファイル）" if a > 1 else "") for k, (n, a) in kinds.items()) or "0"))
        else:
            print(f"  (total {total})")


if __name__ == "__main__":
    main()
