"""Phase 3 フレーズの前の修正 5: MICASE の学生の発話から、学生の場面の候補を ledger/phrases.csv に足す。

office hours・study group・discussion section・lab section の学生の発話で 5 件以上ある質問・依頼・確認の形のうち、
今の ledger/phrases.csv と意図が重ならず、数学の授業で使えるもの（DECISIONS「Phase 3 フレーズの前の修正」5）。
件数は `pnpm corpus:scenes` の出力（語形変化をまとめ、「!w」も terms と同じ）。micase_scene は 5 件以上になった場面、
micase_counts はその形の 4 つの場面の件数。何度回しても同じ行になる（同じ id の行を置き換える）。

    python3 scripts/ledger/phrases_micase.py
"""
from __future__ import annotations

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LEDGER = ROOT / "ledger" / "phrases.csv"
SRC = "MICASE（学生の発話。pnpm corpus:scenes）"

# id, situation, ja, en（「 ／ 」区切り、先頭が主文）, micase_scene, micase_counts
ROWS = [
    ("office-hours-i-was-wondering", "office-hours",
     "2 番の答えを見ていただけないかと思いまして。",
     "I was wondering if you could look over my answer to number 2. ／ I was wondering whether this counts as a proof.",
     "office hours",
     "i was wondering: office hours 6, study group 1, discussion section 3, lab section 0"),
    ("group-study-does-that-mean", "group-study",
     "ということは、x = 0 では微分できないってこと？",
     "Does that mean it's not differentiable at x = 0? ／ So that means the limit doesn't exist?",
     "study group",
     "does that mean: office hours 2, study group 16, discussion section 1, lab section 4"),
    ("group-study-which-one-do-you-mean", "group-study",
     "どれのこと？ 2 本目の式？",
     "Which one? The second equation? ／ Are you talking about the second equation? ／ Do you mean the second equation?",
     "study group",
     "which one（of・is・you・we・they が続くものを除く）: office hours 7, study group 22, discussion section 1, lab section 6 ／ "
     "are you talking about: office hours 1, study group 5, discussion section 0, lab section 4"),
    ("group-study-is-that-right", "group-study",
     "答えは 3 で合ってる？",
     "The answer is 3, is that right? ／ Is it just 2x?",
     "study group",
     "is that right: office hours 0, study group 8, discussion section 0, lab section 1 ／ "
     "is it just: office hours 3, study group 7, discussion section 2, lab section 3"),
    ("group-study-so-youre-saying", "group-study",
     "つまり、先に通分するってこと？",
     "So you're saying we should find a common denominator first? ／ Oh, so we find a common denominator first?",
     "study group",
     "so you're saying: office hours 1, study group 10, discussion section 0, lab section 2 ／ "
     "oh so: office hours 13, study group 34, discussion section 1, lab section 3"),
    ("group-study-i-thought-it-was", "group-study",
     "あれ、答えは負の数だと思ってたんだけど。",
     "Wait, I thought it was negative. ／ I thought you said the answer was 5.",
     "study group",
     "i thought it was ／ i thought that was: office hours 5, study group 18, discussion section 2, lab section 7 ／ "
     "i thought you: office hours 1, study group 11, discussion section 0, lab section 2"),
    ("group-study-do-you-see-what-i-mean", "group-study",
     "言いたいこと、伝わってる？",
     "Do you see what I mean? ／ Do you know what I'm saying? ／ Does that make sense?",
     "study group",
     "do you see ／ know what i mean ／ what i'm saying: office hours 2, study group 38, discussion section 1, lab section 1 ／ "
     "does that make sense: office hours 2, study group 19, discussion section 0, lab section 0"),
    ("group-study-what-do-you-mean", "group-study",
     "「ここで打ち消し合う」ってどういう意味？",
     "What do you mean by \"they cancel here\"? ／ What does that mean?",
     "study group",
     "what do you mean: office hours 2, study group 9, discussion section 2, lab section 6 ／ "
     "what does that mean: office hours 0, study group 10, discussion section 0, lab section 1"),
]


def main() -> None:
    with open(LEDGER, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fields = list(reader.fieldnames or [])
        rows = list(reader)
    for extra in ["micase_scene", "micase_counts"]:
        if extra not in fields:
            fields.append(extra)
    ids = {r[0] for r in ROWS}
    out = [r for r in rows if r["id"] not in ids]
    for rid, situation, ja, en, scene, counts in ROWS:
        out.append({"id": rid, "situation": situation, "ja": ja, "en": en, "level": "all", "source": SRC,
                    "merged_from": "", "micase_scene": scene, "micase_counts": counts})
    with open(LEDGER, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields, lineterminator="\n")
        w.writeheader()
        for r in out:
            w.writerow({k: r.get(k, "") for k in fields})
    print(f"phrases.csv: {len(out)} rows ({len(ROWS)} from MICASE)")


if __name__ == "__main__":
    main()
