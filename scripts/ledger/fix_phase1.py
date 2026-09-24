"""Apply the Phase 1 review to the ledger (docs/DECISIONS.md, "Phase 1 修正").

    python3 scripts/ledger/fix_phase1.py

Input is the ledger exactly as committed at the end of Phase 1 (git 5593045),
so the result is the same however many times this runs. The judgements live in
fix_decisions.py; this file only applies them and derives the rest:

  1. mapping re-assigned per word (US-side "none" meant "outside Japanese high
     school", which is level.jp = 大学, not a mapping)
  2. Wikipedia langlinks kept only when the ja article is filed under a math
     category (wiki_cat.json from wikicat.py) and is the same concept
  3. one concept, one row: dedup-suffixed ids merged or renamed; unit and
     level_jp become multi-valued ("|"); katakana and aliases go to ja_alt
  4. level_jp "—" resolved; out-of-scope rows move to ledger/out-of-scope.csv
  5. ja_basis / ja_check against the course of study (scripts/ledger/mext/)

Writes ledger/terms.csv, ledger/out-of-scope.csv, ledger/id-changes.csv and a
summary for the report to scripts/ledger/fix_stats.json.
"""
import csv
import io
import json
import os
import re
import subprocess
import sys
from collections import Counter, OrderedDict

import fix_decisions as D

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
PHASE1 = "5593045"
LEVELS = ["小学校", "中1", "中2", "中3", "数I", "数A", "数II", "数B", "数III", "数C", "大学"]
SOURCE_RANK = {"wikipedia-langlink": 0, "wikidata": 1, "textbook": 2, "editorial": 3}
COLUMNS = ["id", "ja", "ja_alt", "en", "en_alt", "en_variants", "pos", "unit", "domain",
           "level_jp", "level_us", "mapping", "source", "wiki_ja", "wiki_en", "wikidata",
           "ja_basis", "ja_check", "flag", "note"]
LIST_COLS = ["ja_alt", "en_alt", "en_variants", "unit", "domain", "level_jp", "level_us", "flag"]


def split(v, sep="|"):
    return [x for x in (v or "").split(sep) if x]


def load_phase1():
    raw = subprocess.run(["git", "show", f"{PHASE1}:ledger/terms.csv"], cwd=ROOT,
                         capture_output=True, check=True).stdout.decode("utf-8")
    rows = OrderedDict()
    for r in csv.DictReader(io.StringIO(raw)):
        r = dict(r)
        r["ja_alt"], r["en_variants"] = [], []
        r["en_alt"] = split(r["en_alt"], "; ")
        r["unit"], r["level_us"] = split(r["unit"]), split(r["level_us"])
        r["domain"] = split(r["domain"])
        r["level_jp"] = split(r["level_jp"])
        r["flag"] = r["flag"].split()
        r["orig_id"] = r["id"]
        rows[r["id"]] = r
    return rows


def add(lst, *vals):
    for v in vals:
        if v and v not in lst:
            lst.append(v)


def note_add(r, text):
    r["note"] = f"{r['note']} ／ {text}" if r["note"] else text


# ------------------------------------------------------------------ 2. wiki
def report_mismatch_ids():
    """The 210 rows listed in ledger/phase1-report.md (langlink title != en)."""
    raw = subprocess.run(["git", "show", f"{PHASE1}:ledger/phase1-report.md"], cwd=ROOT,
                         capture_output=True, check=True).stdout.decode("utf-8")
    part = raw.split("## 機械的に拾った要確認", 1)[1]
    ids = []
    for line in part.splitlines():
        m = re.match(r"\| ([a-z0-9-]+) \|", line)
        if m and m.group(1) != "id":
            ids.append(m.group(1))
    return ids


def apply_wiki(rows, stats):
    cat = json.load(open(os.path.join(HERE, "wiki_cat.json"), encoding="utf-8"))["ja"]
    mism = report_mismatch_ids()
    verdict = {}
    for r in rows.values():
        if not r["wiki_ja"]:
            continue
        reason = None
        if cat.get(r["wiki_ja"]) is None:
            reason = "数学カテゴリ外"
        elif r["id"] in D.WIKI_WRONG:
            reason = "別概念"
        verdict[r["id"]] = reason
        if not reason:
            continue
        detail = D.WIKI_WRONG.get(r["id"]) or f"「{r['wiki_ja']}」は数学カテゴリ配下にない"
        note_add(r, f"wiki 除外（{reason}）: {r['wiki_ja']} → {r['wiki_en'] or '(en なし)'}。{detail}")
        if r["source"] in ("wikipedia-langlink", "wikidata"):
            r["source"] = "textbook" if r["unit"][0].startswith("us-") else "editorial"
        r["wiki_ja"] = r["wiki_en"] = r["wikidata"] = ""
        r["flag"] = [f for f in r["flag"] if f != "wiki-nonmath"] + ["wiki-rejected"]
    split_210 = Counter("別概念で除外" if verdict.get(i) else "記事名違いで問題なし" for i in mism)
    reasons_210 = Counter(verdict.get(i) for i in mism if verdict.get(i))
    stats["wiki"] = {
        "mismatch_total": len(mism),
        "split": dict(split_210),
        "wrong_reasons": dict(reasons_210),
        "wrong_ids": [i for i in mism if verdict.get(i)],
        "checked": len(verdict),
        "rejected_all": sum(1 for v in verdict.values() if v),
        "rejected_outside_210": sorted(i for i, v in verdict.items() if v and i not in mism),
    }


# ---------------------------------------------------------------- 3. merges
def merge(rows, frm, into, main, log):
    a, b = rows.pop(frm), rows[into]
    if a["pos"] != b["pos"]:
        print(f"  warn: merging different pos {frm}({a['pos']}) -> {into}({b['pos']})")
    if main == "from":
        add(b["ja_alt"], b["ja"])
        b["ja"] = a["ja"]
    else:
        add(b["ja_alt"], a["ja"])
    add(b["ja_alt"], *a["ja_alt"])
    b["ja_alt"] = [x for x in b["ja_alt"] if x != b["ja"]]
    add(b["en_alt"], a["en"] if a["en"] != b["en"] else "", *a["en_alt"])
    add(b["en_variants"], *a["en_variants"])
    for col in ("unit", "domain", "level_us"):
        add(b[col], *a[col])
    # a US-side row's level_jp was a placeholder (大学 / —); the Japanese row knows
    # where the concept is taught
    if not (a["unit"][0].startswith("us-") and not b["unit"][0].startswith("us-")):
        add(b["level_jp"], *a["level_jp"])
    if SOURCE_RANK.get(a["source"], 9) < SOURCE_RANK.get(b["source"], 9):
        for col in ("source", "wiki_ja", "wiki_en", "wikidata"):
            b[col] = a[col]
    add(b["flag"], *[f for f in a["flag"] if f != "id-dedup"])
    add(b["flag"], "merged")
    if a["note"] and a["note"] not in b["note"]:
        note_add(b, a["note"])
    log.append((a["orig_id"], into, "merged"))


def rename(rows, old, new, fields, log):
    if new in rows:
        raise SystemExit(f"rename {old} -> {new}: id already taken")
    r = rows.pop(old)
    r["id"] = new
    for k, v in fields.items():
        if k == "en" and r["en"] != v:
            add(r["en_alt"], r["en"])
        r[k] = v
    rows[new] = r
    log.append((r["orig_id"], new, "renamed"))


# ------------------------------------------------------------------ 5. mext
def norm(s):
    return re.sub(r"[\s〜~]", "", s)


def mext_text():
    parts = []
    for key in ("chu", "kou"):
        p = os.path.join(HERE, "mext", f"{key}.txt")
        if not os.path.exists(p):
            raise SystemExit(f"{p} is missing: run python3 scripts/ledger/fetch_mext.py")
        parts.append(re.sub(r"[\s\f]", "", open(p, encoding="utf-8").read()))
    return "".join(parts)


def apply_basis(rows, yougo, stats):
    text = mext_text()
    yougo_terms = {y["item"] for y in yougo if y["kind"] == "用語"}

    def in_mext(term):
        t = norm(term)
        if not t:
            return False
        if len(t) == 1:  # a single kanji matches everywhere; only the listed 用語 count
            return t in yougo_terms
        return t in text

    mism = []
    for r in rows.values():
        head = in_mext(r["ja"])
        alt = next((a for a in r["ja_alt"] if in_mext(a)), None)
        if head or alt:
            r["ja_basis"] = "mext"
            r["ja_check"] = "ok" if head else f"alt:{alt}"
        elif r["wiki_ja"]:
            r["ja_basis"] = "wikipedia"
            same = norm(r["wiki_ja"]) in {norm(r["ja"])} | {norm(a) for a in r["ja_alt"]}
            r["ja_check"] = "ok" if norm(r["wiki_ja"]) == norm(r["ja"]) else (
                f"alt:{r['wiki_ja']}" if same else f"title:{r['wiki_ja']}")
        else:
            r["ja_basis"] = "editorial"
            r["ja_check"] = "—"
        if r["ja_check"] not in ("ok", "—"):
            mism.append((r["id"], r["ja"], r["ja_basis"], r["ja_check"]))
    stats["basis"] = dict(Counter(r["ja_basis"] for r in rows.values()))
    stats["check"] = dict(Counter(r["ja_check"].split(":")[0] for r in rows.values()))
    stats["check_mismatch"] = mism


def coverage(rows, yougo):
    index = {}
    for r in rows.values():
        for t in [r["ja"], *r["ja_alt"]]:
            index.setdefault(norm(t), r["id"])
    out = []
    for y in yougo:
        hit = index.get(norm(y["item"]))
        if not hit and y["kind"] == "記号":
            hit = next((r["id"] for r in rows.values() if y["item"] in (r["en"], r["ja"])), None)
        out.append({**y, "ledger_id": hit or ""})
    return out


# ------------------------------------------------------------------- main
def main():
    stats = {}
    rows = load_phase1()
    stats["phase1_rows"] = len(rows)
    us_none = {i for i, r in rows.items() if r["unit"][0].startswith("us-") and r["mapping"] == "none"}
    dash = {i for i, r in rows.items() if r["level_jp"] == ["—"]}
    stats["us_none_before"] = len(us_none)
    stats["dash_before"] = len(dash)

    apply_wiki(rows, stats)

    log = []
    for frm, into, main_ in D.MERGES:
        merge(rows, frm, into, main_, log)
    for old, new, fields in D.RENAMES:
        rename(rows, old, new, fields, log)
    for frm, into, main_ in D.MERGES_AFTER_RENAME:
        merge(rows, frm, into, main_, log)
    renamed = {o: n for o, n, a in log}

    # 4. out of scope
    oos = []
    for i, reason in D.OUT_OF_SCOPE.items():
        r = rows.pop(i)
        oos.append({"id": i, "ja": r["ja"], "en": r["en"], "unit": "|".join(r["unit"]),
                    "level_jp": "|".join(r["level_jp"]), "reason": reason})
        log.append((i, "", "out-of-scope"))

    # 1. review 30
    for i, f in D.REVIEW30.items():
        r = rows[i]
        for k, v in f.items():
            if k == "en":
                if r["en"] != v:
                    add(r["en_alt"], r["en"])
                r["en"] = v
                r["en_alt"] = [x for x in r["en_alt"] if x != v]
            elif k in ("en_alt", "ja_alt"):
                add(r[k], *v)
            elif k == "en_variants":
                add(r[k], *[f"{t}@{reg}" for t, reg in v])
            else:
                r[k] = v
        add(r["flag"], "reviewed-30")

    for i, (ja, alts) in D.JA_FIX.items():
        r = rows[i]
        if ja and ja != r["ja"]:
            if r["ja"] not in alts and i != "slope-field":
                add(r["ja_alt"], r["ja"])
            r["ja"] = ja
        r["ja_alt"] = [x for x in r["ja_alt"] if x != r["ja"] and not (i == "slope-field" and x == "勾配場")]
        add(r["ja_alt"], *[a for a in alts if a != r["ja"]])

    # 4. level_jp "—"  /  1. mapping
    def cur(i):
        return renamed.get(i, i)

    for i, lv in D.LEVEL_JP.items():
        r = rows[cur(i)]
        r["level_jp"] = [x for x in r["level_jp"] if x != "—"]
        add(r["level_jp"], lv)
    for i, lv in D.LEVEL_JP_FIX.items():
        rows[cur(i)]["level_jp"] = [lv]
    for r in rows.values():
        r["level_jp"] = sorted(set(r["level_jp"]) - {"—"}, key=LEVELS.index)
    left = [r["id"] for r in rows.values() if not r["level_jp"]]
    if left:
        raise SystemExit(f"level_jp still empty: {left}")

    changed = Counter()
    merged_away = {o for o, _, a in log if a != "renamed"}
    for oid in us_none:
        i = cur(oid)
        if oid in merged_away or i not in rows:
            continue  # the surviving row keeps its own mapping
        new = D.MAPPING.get(i, D.MAPPING.get(oid, "exact"))
        changed[new] += 1
        rows[i]["mapping"] = new
    for i, m in D.MAPPING.items():
        if i in rows:
            rows[i]["mapping"] = m
    stats["us_none_after"] = dict(changed)

    # 5. basis / check / coverage
    yougo = list(csv.DictReader(open(os.path.join(ROOT, "ledger", "mext-yougo.csv"), encoding="utf-8")))
    apply_basis(rows, yougo, stats)
    stats["coverage"] = coverage(rows, yougo)

    # write. Units in curriculum order (the Phase 1 CSV is ordered by unit), so
    # the first unit is where the term is met first.
    order = {}
    for r in load_phase1().values():
        order.setdefault(r["unit"][0], len(order))
    for r in rows.values():
        r["flag"] = [f for f in r["flag"] if f not in ("id-dedup",)]
        r["unit"].sort(key=lambda u: order.get(u, len(order)))
    with open(os.path.join(ROOT, "ledger", "terms.csv"), "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, COLUMNS, extrasaction="ignore")
        w.writeheader()
        for r in rows.values():
            out = dict(r)
            for c in LIST_COLS:
                out[c] = (" " if c == "flag" else "|").join(r[c])
            w.writerow(out)
    with open(os.path.join(ROOT, "ledger", "out-of-scope.csv"), "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, ["id", "ja", "en", "unit", "level_jp", "reason"])
        w.writeheader()
        w.writerows(oos)
    with open(os.path.join(ROOT, "ledger", "id-changes.csv"), "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(["old_id", "new_id", "action"])
        w.writerows(log)

    stats["rows"] = len(rows)
    stats["actions"] = dict(Counter(a for _, _, a in log))
    stats["oos"] = oos
    stats["mapping"] = dict(Counter(r["mapping"] for r in rows.values()))
    stats["level_jp"] = dict(Counter(lv for r in rows.values() for lv in r["level_jp"]))
    stats["multi_unit"] = sum(1 for r in rows.values() if len(r["unit"]) > 1)
    stats["dup_en"] = {e: ids for e, ids in _dup_en(rows).items()}
    json.dump(stats, open(os.path.join(HERE, "fix_stats.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print(json.dumps({k: v for k, v in stats.items()
                      if k not in ("coverage", "check_mismatch", "oos", "dup_en")}, ensure_ascii=False, indent=1))


def _dup_en(rows):
    by = {}
    for r in rows.values():
        by.setdefault((r["en"].lower(), r["pos"]), []).append(r["id"])
    return {f"{e} ({p})": ids for (e, p), ids in by.items() if len(ids) > 1}


if __name__ == "__main__":
    sys.path.insert(0, HERE)
    sys.exit(main())
