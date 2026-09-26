#!/usr/bin/env python3
"""Phase 5 audit: apply one batch's fixes and verdicts to data/, and log them.

A batch is written as a small Python file that imports this module:

    from edit import *                      # scripts/audit/ on sys.path
    rep("terms/limit", "pitfalls[0]", "old words", "new words", "what and why")   # replace inside a field
    put("terms/limit", "mapping_note", "whole new text", "what and why")          # set a field
    drop("terms/limit", "pitfalls[2]", "what and why")                           # remove a list item / key
    source("terms/limit", {"type": "reference", ...}, "what and why")           # add a source
    fixes_done()                                            # writes the fixed entries (updated = today)

    verdict(1, "terms/limit", "pass" | "minor" | "major" | "fail", "note")      # after the fix commit
    verdicts_done()                                         # confidence, reviewed.audit, flags, log

pass / minor -> confidence verified (a problem flag left on the entry stops it:
validate would refuse). major -> likely + flag audit-major-fix. fail -> likely +
flag audit-human. Every audited entry gets reviewed.audit = today and a row in
audits/phase5-audit-log.csv (batch, seq, collection, id, verdict, what was
changed, note).
"""
import csv
import datetime
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TODAY = datetime.date.today().isoformat()
LOG = os.path.join(ROOT, "audits", "phase5-audit-log.csv")
PENDING = os.path.join(ROOT, "corpus", "audit-pending-changes.json")  # gitignored: kept between the fix commit and the verdict commit
PROBLEM = {"corpus-undecided", "corpus-register-mismatch", "corpus-auto-only", "corpus-student-rare",
           "langlink-missing", "langlink-mismatch", "draft-reason", "audit-major-fix", "audit-human"}
RECORD = {"corpus-human-settled", "corpus-reference-fallback", "corpus-no-fixed-expression", "corpus-attested-only"}
LABEL = {"pass": "合格", "minor": "小さな直し", "major": "大きな直し", "fail": "不合格"}

_cache = {}
_changes = {}  # key -> [description]


def _file(key):
    c, i = key.split("/", 1)
    return os.path.join(ROOT, "data", c, f"{i}.json")


def get(key):
    if key not in _cache:
        with open(_file(key), encoding="utf-8") as f:
            _cache[key] = json.load(f)
    return _cache[key]


def _walk(d, path):
    parts = re.findall(r"[^.\[\]]+|\[\d+\]", path)
    for p in parts[:-1]:
        d = d[int(p[1:-1])] if p.startswith("[") else d[p]
    last = parts[-1]
    return d, (int(last[1:-1]) if last.startswith("[") else last)


def _note(key, what):
    _changes.setdefault(key, []).append(what)


def rep(key, path, old, new, what):
    d, k = _walk(get(key), path)
    assert isinstance(d[k], str) and old in d[k], f"{key} {path}: {old!r} not in {d[k]!r}"
    d[k] = d[k].replace(old, new, 1)
    _note(key, what)


def put(key, path, value, what):
    d, k = _walk(get(key), path)
    if isinstance(d, list) and k == len(d):
        d.append(value)
    else:
        d[k] = value
    _note(key, what)


def drop(key, path, what):
    d, k = _walk(get(key), path)
    del d[k]
    _note(key, what)


def source(key, src, what):
    get(key).setdefault("sources", []).append(src)
    _note(key, what)


def _save(key):
    with open(_file(key), "w", encoding="utf-8") as f:
        f.write(json.dumps(_cache[key], ensure_ascii=False, indent=2) + "\n")


def fixes_done():
    """Write every fixed entry (updated = today) and keep the change notes for the verdicts."""
    for key in _changes:
        get(key)["updated"] = TODAY
        _save(key)
    path = PENDING
    old = json.load(open(path, encoding="utf-8")) if os.path.exists(path) else {}
    for k, v in _changes.items():
        old.setdefault(k, []).extend(v)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(old, f, ensure_ascii=False, indent=1)
    print(f"fixed {len(_changes)} entries")


_verdicts = []


def verdict(batch, key, kind, note=""):
    assert kind in LABEL
    _verdicts.append((batch, key, kind, note))


def verdicts_done():
    path = PENDING
    pending = json.load(open(path, encoding="utf-8")) if os.path.exists(path) else {}
    order = {}
    with open(os.path.join(ROOT, "audits", "phase5-order.csv"), encoding="utf-8") as f:
        for r in csv.DictReader(f):
            order[f"{r['collection']}/{r['id']}"] = r["seq"]
    new_log = not os.path.exists(LOG)
    rows = []
    for batch, key, kind, note in _verdicts:
        d = get(key)
        flags = [f for f in d.get("flags", []) if f["code"] not in ("audit-major-fix", "audit-human")]
        if kind == "major":
            flags.append({"code": "audit-major-fix", "note": f"Phase 5 監査（{TODAY}）で大きな直し: {note}。次の監査のセッションが見直す。", "raised": TODAY})
        if kind == "fail":
            flags.append({"code": "audit-human", "note": f"Phase 5 監査（{TODAY}）で判断がつかない: {note}。人間レビューへ。", "raised": TODAY})
        if flags:
            d["flags"] = flags
        elif "flags" in d:
            del d["flags"]
        problems = [f["code"] for f in flags if f["code"] not in RECORD]
        if kind in ("pass", "minor"):
            assert not problems, f"{key}: {kind} but problem flags {problems}"
            d["confidence"] = "verified"
        elif d.get("confidence") == "verified":
            d["confidence"] = "likely"
        rv = d.get("reviewed") or {"machine": None, "audit": None, "human": None}
        rv["audit"] = TODAY
        d["reviewed"] = rv
        d["updated"] = TODAY
        _save(key)
        c, i = key.split("/", 1)
        rows.append([batch, order.get(key, ""), c, i, LABEL[kind], " ／ ".join(pending.pop(key, [])), note, TODAY])
    with open(LOG, "a", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        if new_log:
            w.writerow(["batch", "seq", "collection", "id", "verdict", "changes", "note", "date"])
        w.writerows(rows)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(pending, f, ensure_ascii=False, indent=1)
    if not pending:
        os.remove(path)
    from collections import Counter
    print(Counter(r[4] for r in rows))
