#!/usr/bin/env python3
"""Phase 5 audit: the order in which every entry is audited, 50 to a batch.

    python3 scripts/audit/order.py            # writes audits/phase5-order.csv
    python3 scripts/audit/order.py --launch   # once: lays out symbols, phrases and conventions again

Order (the user's instruction 4, 2026-09-26):
  1. terms of the calculus units: 極限 → 微分 → 積分 (Japanese and US units of
     limits, differentiation and integration; the unit lists are below)
  2. the other terms, unit by unit: 中1 … 数学C, then the US-only units
     (Traditional, Integrated, AP, college), then terms in no unit
  3. symbols (by the /symbols unit), 4. phrases (by situation), 5. conventions

Before the launch (the user's decision 3 before audit 8, 2026-09-27): once 1,000
terms are verified, the other terms wait until after the launch, and the audit
goes on to symbols → phrases → conventions for their thresholds (200 / 200 / 30).
`--launch` lays out the rows of those three collections again, each starting a
batch of its own after the last terms batch: symbols by category (the
/symbols unit), phrases by situation, conventions by the number of related
(symbols; ties: more term_refs, then category, then id). It refuses when an
entry of theirs already has a verdict in its batch (batch 0, out of the order,
does not count). The term rows do not move.

Each entry appears once, at its first unit. The batch column is fixed here, so
a later session resumes at the first batch that still has entries without
reviewed.audit. Re-running keeps the rows already written and appends entries
that are new since, in new batches after the last one, so batch numbers never move.
"""
import csv
import glob
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "audits", "phase5-order.csv")
BATCH = 50

CALCULUS = [
    ("極限", ["jp-suugaku-3-kyokugen", "us-ap-calculus-ab-1-limits", "us-calculus-1-limits", "us-precalculus-limits"]),
    ("微分", ["jp-suugaku-2-bibun-no-kangae", "jp-suugaku-3-bibun", "us-ap-calculus-ab-2-differentiation-basics",
              "us-ap-calculus-ab-3-differentiation-advanced", "us-ap-calculus-ab-4-contextual-applications",
              "us-ap-calculus-ab-5-analytical-applications", "us-calculus-1-derivatives",
              "us-calculus-1-applications-of-derivatives"]),
    ("積分", ["jp-suugaku-2-sekibun-no-kangae", "jp-suugaku-3-sekibun", "us-ap-calculus-ab-6-integration",
              "us-ap-calculus-ab-7-differential-equations", "us-ap-calculus-ab-8-applications-of-integration",
              "us-ap-calculus-bc-6-integration-techniques", "us-calculus-1-integration",
              "us-calculus-1-applications-of-integration", "us-calculus-2-techniques-of-integration",
              "us-calculus-2-applications-of-integration", "us-calculus-2-differential-equations"]),
]
JP_SUBJECTS = ["中1", "中2", "中3", "数学I", "数学A", "数学II", "数学B", "数学III", "数学C"]
US_COURSES = ["Pre-Algebra", "Algebra 1", "Geometry", "Algebra 2", "Precalculus", "Integrated Math 1",
              "Integrated Math 2", "Integrated Math 3", "AP Calculus AB", "AP Calculus BC", "AP Statistics",
              "Calculus I", "Calculus II", "Calculus III", "Linear Algebra", "Intro Statistics", "Discrete Math"]
SYMBOL_UNITS = ["arithmetic", "fractions", "exponents", "roots", "subscripts", "functions", "trigonometry",
                "logarithms", "limits", "derivatives", "integrals", "sums", "sets", "logic", "vectors", "matrices",
                "complex-numbers", "number-theory", "probability-statistics", "geometry", "notation-other"]
SITUATIONS = ["class-listening", "class-asking", "office-hours", "explaining-solution", "written-solution", "exam",
              "email", "group-study", "discord"]
CONVENTION_CATEGORIES = ["notation", "letters", "terminology", "proof-style", "handwriting", "calculator",
                         "classroom-culture"]


def convention_order(c):
    """More related (symbols) first; ties: more term_refs, then category, then id (decision 3 before audit 8)."""
    return (-len(c.get("related", [])), -len(c.get("term_refs", [])), CONVENTION_CATEGORIES.index(c["category"]), c["id"])


def launch_layout(old, rows):
    """The rows of symbols, phrases and conventions again, each collection from a new batch (see the docstring)."""
    log = os.path.join(ROOT, "audits", "phase5-audit-log.csv")
    judged = set()
    if os.path.exists(log):
        judged = {(r["collection"], r["id"]) for r in csv.DictReader(open(log, encoding="utf-8")) if r["batch"] != "0"}
    tail = [r for r in old if r["collection"] != "terms"]
    done = [f"{r['collection']}/{r['id']}" for r in tail if (r["collection"], r["id"]) in judged]
    assert not done, f"already judged in their batch: {done}"
    out = [r for r in old if r["collection"] == "terms"]
    last = max((int(r["batch"]) for r in out), default=0)
    for collection in ("symbols", "phrases", "conventions"):
        group = [r for r in rows if r["collection"] == collection]
        for k, r in enumerate(group):
            out.append({"seq": len(out) + 1, "batch": last + 1 + k // BATCH, **r})
        last += (len(group) - 1) // BATCH + 1 if group else 0
    return out


def load(c):
    out = {}
    for f in sorted(glob.glob(os.path.join(ROOT, "data", c, "*.json"))):
        d = json.load(open(f, encoding="utf-8"))
        out[d["id"]] = d
    return out


def main():
    rows = []
    seen = set()

    def add(collection, id_, group, unit):
        if (collection, id_) in seen:
            return
        seen.add((collection, id_))
        rows.append({"collection": collection, "id": id_, "group": group, "unit": unit})

    units = load("curriculum")
    terms = load("terms")
    for group, ids in CALCULUS:
        for u in ids:
            for t in units[u]["term_refs"]:
                add("terms", t, f"微積分:{group}", u)
    jp = sorted((u for u in units.values() if u["system"] == "jp"), key=lambda u: (JP_SUBJECTS.index(u["subject"]), u["id"]))
    us = sorted((u for u in units.values() if u["system"] != "jp"),
                key=lambda u: (US_COURSES.index(u["subject"]) if u["subject"] in US_COURSES else 99, u["id"]))
    for u in jp + us:
        for t in u.get("term_refs", []):
            add("terms", t, "用語:" + u["subject"], u["id"])
    for t in terms:
        add("terms", t, "用語:単元なし", "")
    symbols = load("symbols")
    for s in sorted(symbols.values(), key=lambda s: (SYMBOL_UNITS.index(s.get("category", "notation-other")), s["id"])):
        add("symbols", s["id"], "記号", s.get("category", ""))
    phrases = load("phrases")
    for p in sorted(phrases.values(), key=lambda p: (SITUATIONS.index(p["situation"]), p["id"])):
        add("phrases", p["id"], "フレーズ", p["situation"])
    conventions = load("conventions")
    for c in sorted(conventions.values(), key=convention_order):
        add("conventions", c["id"], "慣習差", c["category"])

    # keep the batches already written; append what is new
    old = []
    if os.path.exists(OUT):
        old = list(csv.DictReader(open(OUT, encoding="utf-8")))
    if "--launch" in sys.argv:
        old = launch_layout(old, rows)
    have = {(r["collection"], r["id"]) for r in old}
    new = [r for r in rows if (r["collection"], r["id"]) not in have]
    out = old[:]
    last = max((int(r["batch"]) for r in out), default=0)
    for k, r in enumerate(new):
        out.append({"seq": len(out) + 1, "batch": last + 1 + k // BATCH, **r})
    with open(OUT, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["seq", "batch", "collection", "id", "group", "unit"])
        w.writeheader()
        w.writerows(out)
    print(f"{len(out)} rows ({len(new)} new), {max(int(r['batch']) for r in out)} batches -> {os.path.relpath(OUT, ROOT)}")


if __name__ == "__main__":
    main()
