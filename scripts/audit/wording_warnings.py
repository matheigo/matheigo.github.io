#!/usr/bin/env python3
"""Phase 5 audit: the wording warnings of validate as a list (audits/checks/wording-warnings.md).

    python3 scripts/audit/wording_warnings.py        runs `pnpm validate` and collects its "has a wording STYLE forbids"
                                                     and "looks like a count from the example corpus" warnings

Audit 2 (H-5) and audit 3 (AT_LARGE) added the warnings to validate (scripts/lib/wording.ts,
scripts/lib/corpus-count.ts); the sessions since collected them into this list by hand.
Each row gives the batch of audits/phase5-order.csv, so a batch's rows can be cleared before its verdicts.
"""
import csv
import datetime
import json
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "audits", "checks", "wording-warnings.md")
WARN = re.compile(r"warn\s+(terms|symbols|phrases|conventions)/([a-z0-9-]+)\.json: (\S+) has (?:a wording STYLE forbids|what looks like a count from the example corpus)[^:]*: (.*)$")


def main():
    r = subprocess.run(["pnpm", "validate"], cwd=ROOT, capture_output=True, text=True)
    batch = {}
    with open(os.path.join(ROOT, "audits", "phase5-order.csv"), encoding="utf-8") as f:
        for row in csv.DictReader(f):
            batch[(row["collection"], row["id"])] = row["batch"]
    rows = []
    for line in (r.stdout + r.stderr).splitlines():
        m = WARN.search(line)
        if not m:
            continue
        c, i, field, sentence = m.groups()
        conf = json.load(open(os.path.join(ROOT, "data", c, f"{i}.json"), encoding="utf-8")).get("confidence")
        rows.append((int(batch.get((c, i), "0") or 0), c, i, conf, field, sentence.strip()))
    rows.sort()
    verified = sum(1 for x in rows if x[3] == "verified")
    lines = ["# 確かめられない言い方の警告（validate。scripts/lib/wording.ts・scripts/lib/corpus-count.ts）", "",
             f"作成: {datetime.date.today().isoformat()} ／ `python3 scripts/audit/wording_warnings.py`（`pnpm validate` の warn を集めた）。監査 2 の H-5 で足した警告（通じる／一番よく使う／減点／資料の名前のない「ことが多い」）、監査 3 の AT_LARGE（資料の名前のない「英語には〜がない」）、本文の用例コーパスの件数らしい数字。", "",
             f"- 文: **{len(rows)}**（verified {verified}）", "",
             "| バッチ | コレクション | id | confidence | 欄 | 文 |", "|---|---|---|---|---|---|"]
    for b, c, i, conf, field, s in rows:
        lines.append(f"| {b or ''} | {c} | {i} | {conf} | {field} | {s.replace('|', '\\|')} |")
    open(OUT, "w", encoding="utf-8").write("\n".join(lines) + "\n")
    print(f"{len(rows)} warnings ({verified} verified) -> audits/checks/wording-warnings.md; validate exit {r.returncode}")


if __name__ == "__main__":
    main()
