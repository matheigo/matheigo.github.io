#!/usr/bin/env python3
"""Pre-publication sample (Fable, 2026-10-09), step 5: the types the sample found, looked for in every entry.

    python3 scripts/audit/sample_types.py          -> audits/checks/sample-types.md (and .json)
    python3 scripts/audit/sample_types.py --help

The sample of 100 verified items (audits/2026-10-09-sample-fable.md) found 6 major fixes and 2 fails,
more than the 3 the user set for publication, so its types are listed here for the next session to read
and fix before publication. Every row is a hint, not a verdict: the session reads each one.

  T1a  mapping exact, but the entry's own text says the Japanese and English words differ in scope
       (expression: 「式」 also covers equations; trigonometric-ratio: 三角比 goes up to 180°).
  T1b  mapping none, but the Japanese name is in a Japanese source (disk-method: 日本語版 Wikipedia
       「回転体」 calls it 円板法; shell-method is near for the same reason).
  T2   definition_ja restricts what definition_en does not (right-riemann-sum: 「区間を等分した」;
       CED 6.2 allows nonuniform partitions).
  T3   a ③ headword whose every hit in the reference that decided it sits inside a longer title-case
       name (derivative-of-a-parametric-curve: the CED's "derivatives of parametric equations" was part of
       topic 9.2's title "Second Derivatives of Parametric Equations").
  T4   a symbol reading form "X of *" that also counts "inverse X of" / "arc X of" ... (tangent-of-theta:
       inverse tangent of x, arc tangent of x moved the first reading).
  T5   a phrase whose likely ground is Math Stack Exchange alone (MICASE under 3) and whose search
       excerpts DECISIONS does not say were read (class-asking-another-example, office-hours-do-you-
       have-a-minute: the excerpts fell below 3, so human review by audit 13's pre-decision 1).
  T6   a ja.alt with no hit in the local Japanese sources (解説・試験・取得済みの日本語版 Wikipedia):
       check with `python3 scripts/audit/jawiki.py --search <語>` before removing (audit 7's
       pre-decision 4; local-maximum's 相対最大値 was 相対的最大値 in 「最大と最小」).

Reads data/, corpus/ref (references, Japanese sources), corpus/probe-cache.json (T4; run
`pnpm corpus:probe -- x` once if it is missing) and docs/DECISIONS.md. Writes only the two files
under audits/checks. Source text goes to no file: rows hold the entries' own words and counts.
"""
import argparse
import datetime
import glob
import json
import os
import re
import sys
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
OUT_MD = os.path.join(ROOT, "audits", "checks", "sample-types.md")
OUT_JSON = os.path.join(ROOT, "audits", "checks", "sample-types.json")


def entries(collection):
    for f in sorted(glob.glob(os.path.join(ROOT, "data", collection, "*.json"))):
        yield json.load(open(f, encoding="utf-8"))


def norm(s):
    return re.sub(r"\s+", "", unicodedata.normalize("NFKC", s))


def sentences(text):
    return [s + "。" for s in re.split(r"。", text or "") if s.strip()]


# ---------- T1a ----------
SCOPE = re.compile(
    r"日本語の「[^」]+」は[^。]*(?:も|にも)[^。]*(?:指す|使う|含む|言う)"
    r"|英語の [^。]+? は[^。]*(?:だけ|のみ)"
    r"|英語では[^。]*(?:言い分ける|区別する|呼び分ける)"
    r"|(?:範囲|意味)が(?:違う|異なる|広い|狭い)"
    r"|より(?:広い|狭い)範囲"
    r"|(?:鈍角|一般角)まで(?:広げ|含め|拡張)"
    # round 2 (2026-10-09): "A なら X、B なら Y" with an English word (write-an-equation), "〜にだけ出てくる ／ 使う" (be-inscribed-in)
    r"|なら [a-z]{4,}[^。]*(?:なら|なければ) [a-z]{4,}"  # 等号を含むなら equation、含まないなら expression
    r"|にだけ(?:出てくる|使う|言う|用いる)"
    r"|^(?=[^。]*日本語)[^。]*(?:言い分ける|呼び分ける|使い分ける|どちらも)")  # 日本語は A と B を言い分けるが、英語はどちらも X
EN_SCOPE = re.compile(r"\(the Japanese [^)]*\)|\bin Japan(?:ese)?\b|\bup to 180", re.I)


def t1a():
    rows = []
    for d in entries("terms"):
        if d["mapping"] != "exact":
            continue
        hits = []
        for field in ("definition_ja", "mapping_note"):
            hits += [(field, s) for s in sentences(d.get(field)) if SCOPE.search(s)]
        for i, p in enumerate(d.get("pitfalls") or []):
            hits += [(f"pitfalls[{i}]", s) for s in sentences(p) if SCOPE.search(s)]
        if EN_SCOPE.search(d.get("definition_en") or ""):
            hits.append(("definition_en", d["definition_en"]))
        for field, s in hits:
            rows.append({"id": d["id"], "confidence": d["confidence"], "field": field, "text": s})
    return rows


# ---------- T1b ----------
def jp_text():
    import refgrep
    return "\n".join(norm(t) for _, t in refgrep.jp_sources())


def t1b(jp):
    rows = []
    for d in entries("terms"):
        if d["mapping"] != "none":
            continue
        names = [d["ja"]["term"]] + list(d["ja"].get("alt") or [])
        names += re.findall(r"「([^」]{2,20})」", d.get("mapping_note") or "")
        counts = {n: jp.count(norm(n)) for n in dict.fromkeys(names) if norm(n)}
        named = bool(re.search(r"にはある|と呼(?:ぶ|ばれ)", d.get("mapping_note") or ""))
        rows.append({"id": d["id"], "confidence": d["confidence"], "names": counts, "noteNamesJp": named,
                     "read": named or any(v > 0 for v in counts.values())})
    return rows


# ---------- T2 ----------
RESTRICT = [  # (Japanese restriction in definition_ja, English words that would carry it in definition_en)
    (r"(?<!二)等分", r"\bequal(?:ly)?\b|\bregular\b|\buniform\b|\bsame (?:width|length)\b"),  # not 二等分（bisect）
    (r"鋭角", r"\bacute\b"),
    (r"正の(?:数|整数|実数)", r"\bpositive\b"),
    (r"自然数", r"\bnatural\b|\bpositive integer"),
    (r"(?:だけ|のみ)(?:を|で|の|に)", r"\bonly\b|\bjust\b|\bexactly\b|\balone\b"),
    (r"に限る|に限り(?!なく)|に限って", r"\bonly\b|\bexactly\b|\bmust\b"),  # not 限りなく（approach）
    (r"必ず|常に", r"\balways\b|\bmust\b|\bevery\b"),
]


def t2():
    rows = []
    for d in entries("terms"):
        ja, en = d.get("definition_ja") or "", d.get("definition_en") or ""
        for jp_pat, en_pat in RESTRICT:
            m = re.search(jp_pat, ja)
            if m and not re.search(en_pat, en, re.I):
                rows.append({"id": d["id"], "confidence": d["confidence"], "word": m.group(0), "definition_ja": ja, "definition_en": en})
    return rows


# ---------- T3 ----------
REF_FILES = {"CED": ["ap-calculus-ab-bc-ced.txt", "ap-statistics-ced.txt"], "IM": ["im-6-8.txt", "im-9-12.txt"],
             "CK-12": ["ck12-geometry.txt", "ck12-algebra.txt"], "Nicholson": ["nicholson-lawa-2021a.txt"], "Levin": ["levin-dmoi4.txt"]}
TITLE_STOP = {"The", "A", "An", "In", "On", "Of", "For", "To", "And", "Or", "By", "With", "Find", "Use", "Using", "Topic", "TOPIC",
              "Unit", "UNIT", "Lesson", "Example", "Definition", "This", "These", "That", "If", "When", "Is", "Are", "We", "It",
              "Then", "Thus", "So", "Calculate", "Determine", "Identify", "Interpret", "Explain", "Represent", "Describe"}
FALLBACK = re.compile(r"見出しは (CED|AP Statistics の CED|OpenStax|IM|CK-12|Nicholson|Levin) の呼び方")


def t3():
    texts = {k: " ".join(open(os.path.join(ROOT, "corpus", "ref", f), encoding="utf-8").read() for f in v
                         if os.path.exists(os.path.join(ROOT, "corpus", "ref", f))) for k, v in REF_FILES.items()}
    texts["OpenStax"] = " ".join(open(f, encoding="utf-8").read() for f in glob.glob(os.path.join(ROOT, "corpus", "openstax-*", "*.txt")))
    rows = []
    for d in entries("terms"):
        fl = [x for x in d.get("flags", []) if x["code"] == "corpus-reference-fallback"]
        m = FALLBACK.search(fl[0]["note"]) if fl else None
        if not m:
            continue
        who = "CED" if "CED" in m.group(1) else m.group(1)
        words = [w for w in re.split(r"[\s…]+", d["en"]["term"]) if w]
        if len(words) < 2:
            continue
        rx = re.compile(r"\b" + r"\s+".join(re.escape(w) + r"s?" for w in words), re.I)
        text = texts[who]
        hits, inside = 0, set()
        for h in rx.finditer(text):
            hits += 1
            before = re.search(r"([A-Za-z][\w’'-]*)\s*$", text[max(0, h.start() - 40):h.start()])
            if before and before.group(1)[0].isupper() and before.group(1) not in TITLE_STOP and h.group(0)[:1].isupper():
                inside.add(before.group(1))
            else:
                break
        else:
            if hits:
                rows.append({"id": d["id"], "confidence": d["confidence"], "headword": d["en"]["term"], "reference": who,
                             "hits": hits, "before": sorted(inside)})
    return rows


# ---------- T4 ----------
MODIFIERS = ["inverse", "arc", "hyperbolic", "second", "third", "partial", "natural", "common"]


def t4():
    cache = os.path.join(ROOT, "corpus", "probe-cache.json")
    if not os.path.exists(cache):
        return None
    spoken = "\n".join(x["text"] for x in json.load(open(cache, encoding="utf-8"))["docs"] if x["register"] == "spoken")
    seen = {}
    rows = []
    for d in entries("symbols"):
        ev = (d.get("evidence") or {}).get("spoken") or {}
        for form, n in ev.items():
            for alt in re.split(r"\s+\|\s+", form):
                excluded = set(re.findall(r"!(\w+)", alt))
                bare = " ".join(w for w in alt.split() if not w.startswith("!"))
                m = re.match(r"([a-z]+) of \*$", bare)  # only a form that starts with "X of *": a word fixed before X keeps a modifier out
                if not m:
                    continue
                head = m.group(1)
                for mod in MODIFIERS:
                    if mod in excluded:
                        continue
                    if (mod, head) not in seen:
                        seen[(mod, head)] = len(re.findall(rf"\b{mod}[ -]?{re.escape(head)} of\b", spoken, re.I))
                    k = seen[(mod, head)]
                    if k:
                        rows.append({"id": d["id"], "confidence": d["confidence"], "form": form, "count": n, "modifier": f"{mod} {head} of", "hits": k,
                                     "readings": [r["text"] for r in d.get("spoken_en", [])], "others": {f: c for f, c in ev.items() if f != form}})
    return rows


# ---------- T7 (round 2) ----------
FOLLOWERS = ("problem", "application", "method", "theorem", "rule", "formula", "function", "equation", "test", "property", "law", "identity", "sum", "notation")


def t7():
    """A verified term whose en.term the written corpus uses mostly as the start of a longer wording
    (uniform motion -> uniform motion problems / applications): the headword may name something else
    (the motion, not the problem). Counts the written docs of corpus/probe-cache.json (as T4 does for spoken)."""
    cache = os.path.join(ROOT, "corpus", "probe-cache.json")
    if not os.path.exists(cache):
        return None
    written = "\n".join(x["text"] for x in json.load(open(cache, encoding="utf-8"))["docs"] if x["register"] == "written").lower()
    rows = []
    for d in entries("terms"):
        if d["confidence"] != "verified":
            continue
        head = d["en"]["term"].lower()
        if "…" in head or len(head) < 4 or head not in written:
            continue
        rx = re.compile(r"\b" + r"\s+".join(re.escape(w) for w in head.split()) + r"s?\b(?:\s+(" + "|".join(FOLLOWERS) + r")s?\b)?")
        total = 0
        after = {}
        for m in rx.finditer(written):
            total += 1
            if m.group(1):
                after[m.group(1)] = after.get(m.group(1), 0) + 1
        inside = sum(after.values())
        if total >= 5 and inside / total >= 0.6:
            rows.append({"id": d["id"], "confidence": d["confidence"], "headword": d["en"]["term"], "total": total, "inside": inside,
                         "followers": dict(sorted(after.items(), key=lambda x: -x[1]))})
    return rows


# ---------- T5 ----------
def t5():
    dec = open(os.path.join(ROOT, "docs", "DECISIONS.md"), encoding="utf-8").read()
    rows = []
    for d in entries("phrases"):
        for f in d.get("flags", []):
            if f["code"] != "corpus-attested-only" or "Math Stack Exchange" not in f["note"]:
                continue
            read = [ln for ln in dec.splitlines() if d["id"] in ln and ("抜粋" in ln or "excerpt" in ln)]
            rows.append({"id": d["id"], "confidence": d["confidence"], "situation": d.get("situation"), "en": d.get("en"),
                         "note": f["note"], "excerptsRead": bool(read)})
    return rows


# ---------- T6 ----------
def t6(jp):
    rows = []
    for d in entries("terms"):
        for a in d["ja"].get("alt") or []:
            k = norm(re.sub(r"（[^）]*）|\([^)]*\)", "", a))
            if k and jp.count(k) == 0:
                rows.append({"id": d["id"], "confidence": d["confidence"], "alt": a})
    return rows


def cut(s, n):
    """At most n characters, not ending inside an English word."""
    s = s or ""
    if len(s) <= n:
        return s
    s = s[:n]
    return re.sub(r"[A-Za-z]+$", "", s).rstrip() + "…"


def table(rows, cols, head):
    out = ["| " + " | ".join(head) + " |", "|" + "---|" * len(head)]
    for r in rows:
        out.append("| " + " | ".join(str(c(r)).replace("|", "\\|").replace("\n", " ") for c in cols) + " |")
    return out


def count(rows):
    v = sum(1 for r in rows if r["confidence"] == "verified")
    return f"**{len(rows)}**（verified {v}・likely {sum(1 for r in rows if r['confidence'] == 'likely')}）"


def main():
    ap = argparse.ArgumentParser(description="List, in every entry, the types the pre-publication sample (Fable) found.")
    ap.parse_args()
    jp = jp_text()
    order = lambda rows: sorted(rows, key=lambda r: (r["confidence"] != "verified", r["id"]))
    res = {"T1a": order(t1a()), "T1b": order(t1b(jp)), "T2": order(t2()), "T3": order(t3()), "T5": order(t5()), "T6": order(t6(jp))}
    t4rows = t4()
    res["T4"] = order(t4rows) if t4rows is not None else None
    t7rows = t7()
    res["T7"] = order(t7rows) if t7rows is not None else None
    today = datetime.date.today().isoformat()
    L = ["# 公開前の抜き取り（Fable）で見つかった型の一覧", "",
         f"作成: {today} ／ `python3 scripts/audit/sample_types.py`（規則は scripts/audit/sample_types.py の説明）。"
         "抜き取りの 100 項目で大きな直し・不合格が 8（閾値 3 を超えた）だったので、その型と、小さな直しで 3 回出た型（T6）を全エントリで探した。"
         "どの行も手がかりで、誤りとは限らない。次のセッションが 1 行ずつ資料で読んで直し、それから公開する（audits/2026-10-09-sample-fable.md の J）。", ""]
    L += ["## T1a. mapping exact で、エントリ自身の文が日本語と英語の範囲の違いを書いている", "",
          f"- 行: {count(res['T1a'])}。抜き取りで見つけた例: expression（「式」は等式・不等式も指す）・trigonometric-ratio（三角比は鈍角まで）、第 2 回: write-an-equation（等号を含むなら equation、含まないなら expression）・be-inscribed-in（inscribed in は多角形と円にだけ）。"
          "範囲が違うなら mapping near（CLAUDE.md 規則 5。兄弟の equation・algebraic-expression は near）。言い方だけの注意なら exact のまま", ""]
    L += table(res["T1a"], [lambda r: r["id"], lambda r: r["confidence"], lambda r: r["field"], lambda r: cut(r["text"], 160)], ["id", "confidence", "欄", "文"]) + [""]
    t1b_read = [r for r in res["T1b"] if r["read"]]
    L += ["## T1b. mapping none の語（日本語の名前が日本側の資料にあるか）", "",
          f"- mapping none の terms: {count(res['T1b'])}、うち日本語の名前が日本側の資料（解説・試験・取得済みの日本語版 Wikipedia）にあるか mapping_note が名前を挙げる行 {count(t1b_read)}。"
          "抜き取りで見つけた例: disk-method（日本語版 Wikipedia「回転体」の円板法。shell-method のバウムクーヘン積分と同じ型で near）。"
          "方法そのものが日本の高校にあり名前だけが解説に無いなら near、日本の名前も方法も無い（washer-method の型）なら none のまま", ""]
    L += table(res["T1b"], [lambda r: r["id"], lambda r: r["confidence"], lambda r: "読む" if r["read"] else "", lambda r: "、".join(f"{k} {v}" for k, v in r["names"].items())],
               ["id", "confidence", "", "日本語の名前と日本側の資料の件数"]) + [""]
    L += ["## T2. 定義の日本語に、定義の英文が言わない限定がある", "",
          f"- 行: {count(res['T2'])}。抜き取りで見つけた例: right-riemann-sum・left-riemann-sum（「区間を等分した」。CED topic 6.2 は nonuniform partitions も認める）。"
          "英語の見出しの意味（参照の定義）より狭いなら定義の日本語を直す（定義の意味の変更は大きな直し）", ""]
    L += table(res["T2"], [lambda r: r["id"], lambda r: r["confidence"], lambda r: r["word"], lambda r: cut(r["definition_ja"], 90), lambda r: cut(r["definition_en"], 110)],
               ["id", "confidence", "語", "definition_ja", "definition_en"]) + [""]
    L += ["## T3. ③ で参照が決めた見出しの根拠が、すべて参照の別の名前（題）の一部", "",
          f"- 行: {count(res['T3'])}。抜き取りで見つけた例: derivative-of-a-parametric-curve（CED の derivatives of parametric equations は 2 件とも topic 9.2 の題 Second Derivatives of Parametric Equations の一部。直した後は 0 行）。"
          "`pnpm corpus:probe -- --contexts \"<見出し>\"` の参を読み、別の概念なら TERM_FORMS の「!w」で除いて数え直す（監査 6 の決定 9）", ""]
    L += table(res["T3"], [lambda r: r["id"], lambda r: r["confidence"], lambda r: r["headword"], lambda r: r["reference"], lambda r: r["hits"], lambda r: "、".join(r["before"])],
               ["id", "confidence", "見出し", "参照", "件数", "前の語"]) + [""]
    L += ["## T4. 記号の読みの形「X of *」が、逆関数ほかの読み（inverse X of ／ arc X of …）も数えている", ""]
    if res["T4"] is None:
        L += ["- corpus/probe-cache.json が無いので数えていない（`pnpm corpus:probe -- x` を一度回す）", ""]
    else:
        L += [f"- 行: {count(res['T4'])}。抜き取りで見つけた例: tangent-of-theta（inverse tangent of x・arc tangent of x を数え、除くと 1 つ目の読みが tangent theta に入れ替わった。sine・cosine は除いても並びは変わらない）。"
              "件数は話し言葉のコーパスの生の数（形の数え方とは違う）。除いて並びが変わりうる行は `pnpm exec tsx scripts/audit/symctx.ts \"!the !inverse !arc X of *\"` で数え直す", ""]
        L += table(res["T4"], [lambda r: r["id"], lambda r: r["confidence"], lambda r: r["form"], lambda r: r["count"], lambda r: r["modifier"], lambda r: r["hits"],
                               lambda r: "、".join(f"{k} {v}" for k, v in r["others"].items())],
                   ["id", "confidence", "形", "件数", "別の読み", "その件数", "ほかの形の件数"]) + [""]
    L += ["## T7. 見出しの語を書き言葉のコーパスが、もっと長い言い方の先頭としてばかり使う（第 2 回）", ""]
    if res["T7"] is None:
        L += ["- corpus/probe-cache.json が無いので数えていない（`pnpm corpus:probe -- x` を一度回す）", ""]
    else:
        L += [f"- 行: {count(res['T7'])}（verified の terms で、書き言葉の生の件数が 5 以上、うち 6 割以上が直後に problem ／ application ／ method ／ theorem ／ rule ／ formula ／ function ／ equation ／ test ／ property ／ law ／ identity ／ sum ／ notation の語を伴うもの）。"
              "第 2 回で見つけた例: motion-problem（uniform motion の書き言葉はすべて uniform motion applications ／ problems の内側で、見出しが運動の名前になっていた → uniform motion problem）。"
              "見出しが単独の概念（the derivative、the product rule の product）として使われる語も混じるので、`pnpm corpus:probe -- --contexts \"<見出し>\"` で読んで決める", ""]
        L += table(res["T7"], [lambda r: r["id"], lambda r: r["confidence"], lambda r: r["headword"], lambda r: r["total"], lambda r: r["inside"],
                               lambda r: "、".join(f"{k} {v}" for k, v in r["followers"].items())],
                   ["id", "confidence", "見出し", "書き言葉の件数", "長い言い方の内側", "直後の語"]) + [""]
    t5_unread = [r for r in res["T5"] if not r["excerptsRead"]]
    L += ["## T5. likely の根拠が Math Stack Exchange だけのフレーズ（MICASE の学生の発話は 3 件未満）", "",
          f"- フレーズ: {count(res['T5'])}、うち DECISIONS に抜粋を読んだ記録が見当たらないもの {count(t5_unread)}。"
          "抜き取りで見つけた例: class-asking-another-example（do another example は質問者が自分で例を挙げる文）・office-hours-do-you-have-a-minute（have a minute 3 件のうち頼む文は 2 件）。"
          "内蔵ブラウザで `https://math.stackexchange.com/search?q=%22<要の部分>%22+is%3Aquestion` の抜粋（と質問の本文）を読み、意図を運ぶ文が 3 件に届かなければ MSE_SKIP と監査 13 の前の決定 1（MICASE に 3 件なければ人間レビュー）", ""]
    L += table(res["T5"], [lambda r: r["id"], lambda r: r["confidence"], lambda r: "記録あり" if r["excerptsRead"] else "読む", lambda r: r["en"],
                           lambda r: cut(re.sub(r"^.*?Math Stack Exchange の質問で", "", r["note"]), 140)],
               ["id", "confidence", "抜粋", "en", "flag の note（MSE の部分）"]) + [""]
    L += ["## T6. 日本側の手元の資料に 0 件の ja.alt（小さな直しの型）", "",
          f"- 行: {count(res['T6'])}。抜き取りで見つけた例: local-maximum の「相対最大値」（日本語版 Wikipedia「最大と最小」は「相対的最大値」）、derivative-of-a-parametric-curve の「媒介変数曲線の微分」、limit-of-a-riemann-sum の「定積分と和の極限」、coin の「表（硬貨）」（硬貨の言い換えではない）。"
          "手元に無い記事は `python3 scripts/audit/jawiki.py --search <語>` で確かめてから、資料の言い方にするか外す（監査 7 の前の決定 4。言い換えでない台帳の統合の名残も外す）", ""]
    L += table(res["T6"], [lambda r: r["id"], lambda r: r["confidence"], lambda r: r["alt"]], ["id", "confidence", "ja.alt"]) + [""]
    with open(OUT_MD, "w", encoding="utf-8") as f:
        f.write("\n".join(L))
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump({"made": today, **res}, f, ensure_ascii=False, indent=1)
    summary = {k: (None if v is None else len(v)) for k, v in res.items()}
    summary["T1b read"] = len(t1b_read)
    summary["T5 unread"] = len(t5_unread)
    print(f"{summary} -> audits/checks/sample-types.md")


if __name__ == "__main__":
    main()
