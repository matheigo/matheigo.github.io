"""Fetch the mathematics sections of the Japanese course of study (学習指導要領).

    python3 scripts/ledger/fetch_mext.py

Downloads the official MEXT commentary PDFs (解説), runs pdftotext, and cuts out
the appendix that reproduces the course-of-study text itself (本文):
  中学校学習指導要領（平成29年告示）第2章 第3節 数学
  高等学校学習指導要領（平成30年告示）第2章 第4節 数学
into scripts/ledger/mext/{chu,kou}.txt (gitignored: the repository keeps only
the extracted 〔用語・記号〕 list, ledger/mext-yougo.csv). Needs pdftotext.
MEXT_PDF_CHU / MEXT_PDF_KOU point at already-downloaded PDFs instead.
"""
import os
import re
import subprocess
import sys
import tempfile
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "mext")

SOURCES = {
    "chu": (
        "https://www.mext.go.jp/component/a_menu/education/micro_detail/__icsFiles/afieldfile/2019/03/18/1387018_004.pdf",
        r"中学校学習指導要領\s+第２章\s+第３節\s+数学",
        r"小学校学習指導要領\s+第２章",
    ),
    "kou": (
        "https://www.mext.go.jp/content/20260115-mxt_kyoiku02-100002620_04.pdf",
        r"高等学校学習指導要領\s+第２章\s+第４節\s+数学",
        r"高等学校学習指導要領\s+第２章\s+第５節",
    ),
}


def main():
    os.makedirs(OUT, exist_ok=True)
    for key, (url, start, end) in SOURCES.items():
        with tempfile.TemporaryDirectory() as tmp:
            pdf = os.path.join(tmp, "a.pdf")
            txt = os.path.join(tmp, "a.txt")
            local = os.environ.get(f"MEXT_PDF_{key.upper()}")  # reuse a PDF already on disk
            if local:
                pdf = local
            else:
                req = urllib.request.Request(url, headers={"User-Agent": "MathEigo-ledger/0.1"})
                with urllib.request.urlopen(req, timeout=120) as r, open(pdf, "wb") as f:
                    f.write(r.read())
            subprocess.run(["pdftotext", "-layout", pdf, txt], check=True)
            lines = open(txt, encoding="utf-8").read().splitlines()
        # the appendix is the last occurrence of the section heading
        s = max(i for i, l in enumerate(lines) if re.search(start, l))
        e = next(i for i in range(s + 1, len(lines)) if re.search(end, lines[i]))
        open(os.path.join(OUT, f"{key}.txt"), "w", encoding="utf-8").write("\n".join(lines[s:e]) + "\n")
        print(f"{key}: lines {s}-{e} -> scripts/ledger/mext/{key}.txt")


if __name__ == "__main__":
    sys.exit(main())
