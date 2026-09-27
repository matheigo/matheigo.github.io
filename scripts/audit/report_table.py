#!/usr/bin/env python3
"""Phase 5 audit (session 5, decision 4): the report's tables of verdicts and fixes, from the log, by machine.

    python3 scripts/audit/report_table.py 15 16                # one section per batch: the counts, then | id | 判定 | 直した内容 |
    python3 scripts/audit/report_table.py 0 --note "監査 5"     # batch 0 (out-of-order verdicts): only the rows whose note holds the text
    python3 scripts/audit/report_table.py 15 --date 2026-09-26  # only the rows of that date

Reads audits/phase5-audit-log.csv (written by scripts/audit/edit.py). The report
(audits/2026-MM-DD-audit-N.md) pastes the output as its appendix; by hand it keeps
only the summary, the judgments and the hand-over (audit 4 report H-6). A row of
大きな直し / 不合格 shows the log's note (what the next session looks at) after the fixes.
"""
import csv
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LOG = os.path.join(ROOT, "audits", "phase5-audit-log.csv")
ORDER = ("合格", "小さな直し", "大きな直し", "不合格")


def cell(s):
    return (s or "").replace("|", "\\|").replace("\n", " ").strip()


def main():
    args = sys.argv[1:]
    note = date = None
    batches = []
    i = 0
    while i < len(args):
        if args[i] == "--note":
            note = args[i + 1]
            i += 2
        elif args[i] == "--date":
            date = args[i + 1]
            i += 2
        else:
            batches.append(args[i])
            i += 1
    if not batches:
        print(__doc__)
        sys.exit(2)
    with open(LOG, encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    for b in batches:
        sel = [r for r in rows if r["batch"] == b and (not note or note in (r["note"] or "")) and (not date or r["date"] == date)]
        sel.sort(key=lambda r: int(r["seq"] or 0))
        counts = {k: sum(1 for r in sel if r["verdict"] == k) for k in ORDER}
        verified = counts["合格"] + counts["小さな直し"]
        head = f"バッチ {b}" if b != "0" else "順番の外の判定（batch 0" + (f"、note に「{note}」" if note else "") + "）"
        print(f"### {head}（{len(sel)} 行: " + "・".join(f"{k} {v}" for k, v in counts.items()) + f"。verified {verified}）")
        print()
        print("| id | 判定 | 直した内容 |")
        print("|---|---|---|")
        for r in sel:
            changes = cell(r["changes"]) or "—"
            if r["verdict"] in ("大きな直し", "不合格") and r["note"]:
                changes += f"<br>（{cell(r['note'])}）"
            print(f"| {r['collection']}/{r['id']} | {r['verdict']} | {changes} |")
        print()


if __name__ == "__main__":
    main()
