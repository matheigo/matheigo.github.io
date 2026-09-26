#!/usr/bin/env python3
"""Phase 5: the table for the weekly human review (PLAN §8-4, §15).

    python3 scripts/audit/human_review.py --week 1 --seed 20260926 [--n 20]
        -> audits/human-review-week-1.md

Rows: every entry (terms, symbols, phrases, conventions) with a problem flag
(scripts/lib/flags.ts), then --n entries drawn at random from the verified
ones with random.Random(seed), so the draw can be repeated. Each row has the
Japanese, the English, one example, the page URL, and three boxes to tick:
自分ならそう言う ／ 聞いたことがある ／ 怪しい (怪しい becomes an issue).
"""
import argparse
import glob
import json
import os
import random

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SITE = "https://matheigo.github.io"
RECORD = {"corpus-human-settled", "corpus-reference-fallback", "corpus-no-fixed-expression", "corpus-attested-only"}
BOXES = "□ 自分ならそう言う<br>□ 聞いたことがある<br>□ 怪しい"


def load():
    out = []
    for c in ("terms", "symbols", "phrases", "conventions"):
        for f in sorted(glob.glob(os.path.join(ROOT, "data", c, "*.json"))):
            with open(f, encoding="utf-8") as fh:
                out.append((c, json.load(fh)))
    return out


def cells(c, d):
    """Japanese, English, one example, URL."""
    if c == "terms":
        ex = (d.get("examples") or [{}])[0]
        example = f"{ex.get('en', '')}<br>{ex.get('ja', '')}"
        return d["ja"]["term"], d["en"]["term"], example, f"{SITE}/terms/{d['id']}/"
    if c == "symbols":
        say = d["spoken_en"][0]["text"]
        return f"{d['name_ja']}（{d['latex']}）", d["name_en"], f"{say}<br>{d['spoken_ja']}", f"{SITE}/symbols/{d['id']}/"
    if c == "phrases":
        return d["ja"], d["en"], (d.get("variants") or [{}])[0].get("en", ""), f"{SITE}/phrases/{d['situation']}/#{d['id']}"
    return d["title_ja"], d["title_en"], d["us"], f"{SITE}/conventions/{d['id']}/"


def esc(s):
    return str(s).replace("|", "\\|").replace("\n", " ")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--week", type=int, required=True)
    ap.add_argument("--seed", type=int, required=True)
    ap.add_argument("--n", type=int, default=20)
    a = ap.parse_args()
    entries = load()
    flagged = []
    for c, d in entries:
        probs = [f for f in d.get("flags", []) if f["code"] not in RECORD]
        if probs:
            flagged.append((c, d, probs))
    verified = [(c, d) for c, d in entries if d.get("confidence") == "verified"]
    rng = random.Random(a.seed)
    sample = rng.sample(verified, min(a.n, len(verified)))

    head = "| # | コレクション | id | 日本語 | 英語 | 例文（または読み・米国側） | ページ | 判定 | メモ |\n|---|---|---|---|---|---|---|---|---|"
    lines = [
        f"# 人間レビュー 第 {a.week} 週",
        "",
        f"作成: `python3 scripts/audit/human_review.py --week {a.week} --seed {a.seed} --n {a.n}`（PLAN §8-4・§15。週 30 分）",
        "",
        "1 項目ごとに、判定の欄の 3 つのうち 1 つに ✓ を付けてください（**自分ならそう言う ／ 聞いたことがある ／ 怪しい**）。",
        "「怪しい」は GitHub の issue にします。メモの欄には、授業で聞いた言い方などを自由に書いてください。",
        "draft の項目はサイトに出ていないので、ページの URL はまだ開けません（likely の項目は「未確認の内容を表示する」を押すと見えます）。",
        "",
        f"## A. 問題の flag が付いた項目（{len(flagged)}）",
        "",
        "flag の理由を読んで、見出しの英語・日本語が妥当かを判定してください。",
        "",
        head,
    ]
    for i, (c, d, probs) in enumerate(flagged, 1):
        ja, en, ex, url = cells(c, d)
        why = "<br>".join(f"**{f['code']}**: {f['note']}" for f in probs)
        page = url if d.get("confidence") != "draft" else "（draft のためページなし）"
        lines.append(f"| A{i} | {c} | {d['id']} | {esc(ja)} | {esc(en)} | {esc(ex)} | {page} | {BOXES} | {esc(why)} |")
    lines += [
        "",
        f"## B. 監査済み（verified）からランダムに {len(sample)} 項目",
        "",
        f"乱数の種: **{a.seed}**（Python の random.Random({a.seed}).sample。verified {len(verified)} 項目から選んだ。同じ種で同じ項目が選ばれる）",
        "",
        head,
    ]
    for i, (c, d) in enumerate(sample, 1):
        ja, en, ex, url = cells(c, d)
        lines.append(f"| B{i} | {c} | {d['id']} | {esc(ja)} | {esc(en)} | {esc(ex)} | {url} | {BOXES} | |")
    lines.append("")
    out = os.path.join(ROOT, "audits", f"human-review-week-{a.week}.md")
    with open(out, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"{len(flagged)} flagged, {len(sample)} random of {len(verified)} verified -> {os.path.relpath(out, ROOT)}")


if __name__ == "__main__":
    main()
