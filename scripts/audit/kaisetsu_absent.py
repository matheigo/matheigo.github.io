#!/usr/bin/env python3
"""Phase 5 audit (session 15, the user's decision 2): sentences that say the 解説 lacks something.

    python3 scripts/audit/kaisetsu_absent.py            -> audits/checks/kaisetsu-absent.md (and .json)
    python3 scripts/audit/kaisetsu_absent.py --all      every entry, not only verified ones
    python3 scripts/audit/kaisetsu_absent.py --find '連続複利' '金利' [-c 60]   hits in both 解説 with their sections

Audit 14 found "学習指導要領解説に連続複利は出てこない" right by the word (0 hits) and wrong by
the content: the high-school 解説's 数学III introduces e with "限りなく短い時間ごとに金利が発生
したら預けたお金は何倍になるか" (backlog 196). Decision 3's list (kaisetsu_subjects.py) only
takes sentences that name a subject. This one takes, from verified entries, every sentence of
the text fields (as kaisetsu_subjects.FIELDS) that names the 学習指導要領 or its 解説 and says
something is not there (出てこない／扱わない／名前を付けない／無い …, outside 「」), and every
note of a 学習指導要領 source that says so, and looks the missing thing up in the 解説 it names
(中学校 → kaisetsu-chu.txt, 高等学校 → kaisetsu-kou.txt with its sections, neither → both):

  keys       what the sentence says is missing: the 「…」 quotes in the clause that says so,
             else the words before が／は … 出てこない in that clause (逆三角関数, ln, ε-δ); a note
             also gives its heading. With none, the entry's Japanese name (ja.term and ja.alt,
             name_ja). Paraphrases of the content that the audit used are kept in
             kaisetsu_absent_keys.json ({collection, id, keys}) and searched too
  kind       語: the sentence is about a word (a quote, or the Japanese heading called the
             project's translation); 名前: it says the 解説 gives the thing no name; 中身: it says the
             content is not there
  status     語がある: a key is in the 解説 named (the sentence may be wrong, or a key caught a
             longer word). 見出しがある: the entry's Japanese name (the fallback key) is there.
             語 0: the sentence is only about a quoted word and the word is not there (the content
             may be there; the sentence does not deny it). 言い換えがある: a name or content is said
             to be missing and a paraphrase key is there. 読む: no key is there (the audit searches
             the 解説 by the content)

Kanji numerals before 次 are written as digits on both sides (二次 = 2次), whitespace dropped and
NFKC applied (pdftotext breaks lines in words). Rows read and found right are kept in
kaisetsu_absent_checked.json (A: the 解説 lacks the word and the content; B: the sentence is
about a word or a name and that is right, though the content is there) and counted apart; a
sentence edited since is listed again. The 解説's text goes to no file.
"""
import glob
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kaisetsu_subjects import FIELDS, norm as _norm, section_at, sections, sentences  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CHU = os.path.join(ROOT, "corpus", "ref", "jp", "kaisetsu-chu.txt")
OUT = os.path.join(ROOT, "audits", "checks", "kaisetsu-absent")
HERE = os.path.dirname(os.path.abspath(__file__))
CHECKED = os.path.join(HERE, "kaisetsu_absent_checked.json")
KEYS = os.path.join(HERE, "kaisetsu_absent_keys.json")

KANJI = {"一": "1", "二": "2", "三": "3", "四": "4", "五": "5"}


def norm(s):
    t = _norm(s)
    return re.sub(r"([一二三四五])(?=次)", lambda m: KANJI[m.group(1)], t)


NEG = re.compile(r"出てこない|出てこず|出て来ない|出ていない|扱わない|扱っていない|扱いが(?:無|な)い|名前を付けない|名前をつけない|名付けない|名づけない"
                 r"|触れない|触れていない|書かない|書いていない|含まれない|含まない|載っていない|登場しない|現れない|使わない|使っていない|用いない"
                 r"|呼ばない|言わない|定義しない|定義していない|見当たらない|(?<![0-9])0件|(?:は|が|も)(?:無|な)い(?![よ])")
NAMEISH = re.compile(r"名前|名称|呼び名|呼び方|言い方|訳語")
SUBJECT_HEAD = re.compile(r"^.*?(?:学習指導要領(?:\([^)]*\))?(?:解説)?(?:\([^)]*\))?(?:の[^、。]*?)?|解説(?:\([^)]*\))?)(?:には|では|に|は|も|にも)")
MENTION = re.compile(r"学習指導要領|(?<![・講])解説")
STOP = re.compile(r"^(?:内容|本文|項目|例|用語|語|記号|名前|中学校|高等学校|日本の|別の|.*節|.*[0-9]年度.*)$")
GAP = re.compile(r"^(?:という語|の語|の記号|の名前|の言い方|の形|など)?(?:は|が|も|と|・|や|、|,)*$")


def strip_quotes(s):
    return re.sub(r"「[^「」]*」", "「」", s)


def segments(n):
    """(segment, kind) for each 出てこない … in a normalized sentence: the words before it back to the
    last 、。,;/ at the same bracket depth, or to the bracket that holds it."""
    masked = strip_quotes(n)
    # positions in masked and n differ; work on n with quotes protected by a parallel depth scan
    out = []
    qdepth, pdepth, bounds = 0, 0, []
    depth_at = []
    for i, ch in enumerate(n):
        if ch == "「":
            qdepth += 1
        elif ch == "」":
            qdepth = max(0, qdepth - 1)
        if qdepth == 0 and ch == "(":
            pdepth += 1
        depth_at.append((qdepth, pdepth))
        if qdepth == 0 and ch == ")":
            pdepth = max(0, pdepth - 1)
    prev_end = 0
    for m in NEG.finditer(n):
        q, d = depth_at[m.start()]
        if q:
            continue  # inside a quote
        i = m.start() - 1
        while i >= prev_end:
            qi, di = depth_at[i]
            ch = n[i]
            if qi == 0 and di == d and ch in "、。,;；/":
                break
            if qi == 0 and ch == "(" and di == d:
                break
            i -= 1
        out.append(n[i + 1:m.start()])
        prev_end = m.end()
    return out


def missing_keys(sent):
    """The things the sentence says are missing, and its kind (語 ／ 名前 ／ 中身)."""
    n = norm(sent)
    keys, kinds = [], set()
    for seg in segments(n):
        quotes = [(m.start(), m.end(), m.group(1)) for m in re.finditer(r"「([^「」]+)」", seg)]
        picked, tail = [], len(seg)
        for a, b, q in reversed(quotes):
            if GAP.match(seg[b:tail]):
                picked.insert(0, q)
                tail = a
            else:
                break
        if picked:
            keys += picked
            kinds.add("語")
            continue
        if NAMEISH.search(seg):
            kinds.add("名前")
            continue
        head = SUBJECT_HEAD.sub("", seg)
        head = re.sub(r"^.*[:：]", "", head)
        parens = re.findall(r"\(([^()]*)\)(?=(?:は|が|も)?$)", head)
        head = re.sub(r"\([^()]*\)", "", head)
        head = re.sub(r"(?:は|が|も|を|に)$", "", head)
        head = re.sub(r"^(?:には|では|に|は|も)", "", head)
        head = re.sub(r"(?:など(?:の.*)?|の語|という語|の記号)$", "", head)
        found = False
        for part in [head] + parens:
            for k in re.split(r"・", part):
                if 1 <= len(k) <= 20 and not STOP.match(k) and not MENTION.search(k) and not re.search(r"共通テスト|センター試験|Wikipedia|OpenStax", k):
                    keys.append(k)
                    found = True
        kinds.add("中身" if found else "中身?")
    if "本プロジェクトの訳語" in n or re.search(r"見出し(?:の日本語)?は", n):
        kinds.add("語")
    kind = "語" if kinds == {"語"} else "名前" if "名前" in kinds else "中身" if kinds else "中身"
    return [k for i, k in enumerate(keys) if k and k not in keys[:i]], kind


def names(c, d):
    if c == "terms":
        ja = d.get("ja") or {}
        return [x for x in [ja.get("term")] + list(ja.get("alt") or []) if x]
    if c == "symbols":
        return [d["name_ja"]] if d.get("name_ja") else []
    return []


def docs_of(text):
    t = norm(text)
    out = []
    if "中学校" in t or "中学" in t:
        out.append("chu")
    if "高等学校" in t or "高校" in t:
        out.append("kou")
    return out or ["chu", "kou"]


class Kaisetsu:
    def __init__(self):
        self.kou, self.marks = sections()
        self.kou_n = re.sub(r"([一二三四五])(?=次)", lambda m: KANJI[m.group(1)], self.kou)
        self.chu = norm(open(CHU, encoding="utf-8").read())

    def hits(self, key, docs):
        k = norm(key)
        out = {}
        if not k:
            return out
        if "kou" in docs:
            for m in re.finditer(re.escape(k), self.kou_n):
                sec = "高 " + section_at(self.marks, m.start())
                out[sec] = out.get(sec, 0) + 1
        if "chu" in docs:
            c = len(re.findall(re.escape(k), self.chu))
            if c:
                out["中学校"] = c
        return out

    def context(self, key, docs, ctx=60):
        k = norm(key)
        res = []
        if "kou" in docs:
            for m in re.finditer(re.escape(k), self.kou_n):
                res.append(("高 " + section_at(self.marks, m.start()), self.kou_n[max(0, m.start() - ctx):m.end() + ctx]))
        if "chu" in docs:
            for m in re.finditer(re.escape(k), self.chu):
                res.append(("中学校", self.chu[max(0, m.start() - ctx):m.end() + ctx]))
        return res


def find(words, ctx):
    k = Kaisetsu()
    for w in words:
        res = k.context(w, ["chu", "kou"], ctx)
        print(f"### {w}: {len(res)}")
        for sec, t in res:
            print(f"  [{sec}] …{t}…")


def main():
    if "-h" in sys.argv or "--help" in sys.argv:
        print(__doc__)
        return
    unknown = [a for a in sys.argv[1:] if a.startswith("-") and a not in ("--all", "--find", "-c")]
    if unknown and "--find" not in sys.argv:
        sys.exit(f"unknown option {unknown[0]} (see --help)")
    if "--find" in sys.argv:
        args = sys.argv[sys.argv.index("--find") + 1:]
        ctx = 60
        if "-c" in args:
            i = args.index("-c"); ctx = int(args[i + 1]); del args[i:i + 2]
        return find(args, ctx)
    every = "--all" in sys.argv
    k = Kaisetsu()
    checked = {}
    if os.path.exists(CHECKED):
        for c in json.load(open(CHECKED, encoding="utf-8")):
            checked[(c["collection"], c["id"], c["field"], c["sentence"])] = c["class"]
    extra = {}
    if os.path.exists(KEYS):
        for e in json.load(open(KEYS, encoding="utf-8")):
            extra.setdefault((e["collection"], e["id"]), []).extend(e["keys"])
    rows = []
    for c in ("terms", "symbols", "phrases", "conventions"):
        for f in sorted(glob.glob(os.path.join(ROOT, "data", c, "*.json"))):
            d = json.load(open(f, encoding="utf-8"))
            if not every and d.get("confidence") != "verified":
                continue
            cands = []
            for field, s in FIELDS[c](d):
                for sent in sentences(s):
                    n = norm(sent)
                    if MENTION.search(n) and NEG.search(strip_quotes(n)):
                        cands.append((field, sent, docs_of(sent), False))
            for i, src in enumerate(d.get("sources") or []):
                title = src.get("title") or ""
                note = src.get("note") or ""
                if "学習指導要領" in title and note and NEG.search(strip_quotes(norm(note))):
                    cands.append((f"sources[{i}].note", note, docs_of(title), True))
            for field, sent, docs, is_note in cands:
                keys, kind = missing_keys(sent)
                fallback = False
                if not keys:
                    keys, fallback = names(c, d), True
                    if kind == "語":  # the heading itself called absent: its ja.term only
                        keys = keys[:1]
                hits = {key: k.hits(key, docs) for key in keys}
                para = {key: k.hits(key, docs) for key in extra.get((c, d["id"]), [])}
                if any(hits.values()):
                    status = "見出しがある" if fallback else "語がある"
                elif kind == "語":
                    status = "語 0"  # only a word is said to be missing: the content may well be there
                elif any(para.values()):
                    status = "言い換えがある"
                else:
                    status = "読む"
                key = (c, d["id"], field, sent.strip())
                if status != "語 0" and key in checked:
                    status = "checked " + checked[key]
                rows.append({"collection": c, "id": d["id"], "confidence": d.get("confidence"), "field": field,
                             "docs": docs, "kind": kind, "status": status, "sentence": sent.strip(),
                             "keys": hits, "fallback": fallback, "paraphrases": para})
    order = {"語がある": 0, "見出しがある": 1, "言い換えがある": 2, "読む": 3, "checked A": 4, "checked B": 5, "語 0": 6}
    rows.sort(key=lambda r: (order[r["status"]], r["collection"], r["id"], r["field"]))
    count = {}
    for r in rows:
        count[r["status"]] = count.get(r["status"], 0) + 1
    READ = ("語がある", "見出しがある", "言い換えがある", "読む")
    to_read = [r for r in rows if r["status"] in READ]
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump({"rows": len(rows), "status": count, "toRead": len(to_read),
               "entriesToRead": len({(r["collection"], r["id"]) for r in to_read}), "list": rows},
              open(OUT + ".json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    def where(h):
        parts = []
        for key, secs in h.items():
            s = "・".join(f"{sec} {n}" for sec, n in sorted(secs.items(), key=lambda x: -x[1])[:4]) or "0"
            parts.append(f"「{key[:20]}」{s}")
        return " ／ ".join(parts) or "鍵なし"

    lines = ["# 学習指導要領解説に「…出てこない／扱わない／名前を付けない」と書いた文（Phase 5 監査 15 の前の決定 2）", "",
             "作成: `python3 scripts/audit/kaisetsu_absent.py`（規則は scripts/audit/kaisetsu_absent.py の説明）。"
             "verified のエントリの文と学習指導要領の出典の note のうち、学習指導要領（解説）に何かが無いと書くものを抜き出し、"
             "無いと書いたもの（「」の語、が／は…出てこないの前の語。無ければ見出しの日本語）と、監査が使った中身の言い換え（kaisetsu_absent_keys.json）を、"
             "文が名指しした解説（中学校・高等学校。高等学校は節つき）で探す。語 0 は語だけの主張で語が無い行。"
             "それ以外は監査が解説を語と中身の言い換えで読む（公開前の最後の一覧）。", "",
             f"- 行: **{len(rows)}**（" + "・".join(f"{s} {count[s]}" for s in sorted(count, key=lambda x: order[x])) + "）",
             f"- 読む行（語がある・見出しがある・言い換えがある・読む）: **{len(to_read)}**（{len({(r['collection'], r['id']) for r in to_read})} 項目）", "",
             "| 状態 | 種類 | コレクション | id | 欄 | 解説 | 無いと書いたものと解説の hit（件数） | 文 |", "|---|---|---|---|---|---|---|---|"]
    for r in to_read:
        sent = r["sentence"].replace("|", "｜")
        hit = where(r["keys"]) + (" ／ 見出し" if r["fallback"] else "")
        if r["paraphrases"]:
            hit += " ／ 言い換え: " + where(r["paraphrases"])
        lines.append(f"| {r['status']} | {r['kind']} | {r['collection']} | {r['id']} | {r['field']} | {'・'.join(r['docs'])} | "
                     f"{hit.replace('|', '｜')} | {sent[:150]}{'…' if len(sent) > 150 else ''} |")
    nchecked = count.get("checked A", 0) + count.get("checked B", 0)
    lines += ["", f"語 0 の {count.get('語 0', 0)} 行と、監査が読んで正しいとした {nchecked} 行（kaisetsu_absent_checked.json）は .json に。"]
    open(OUT + ".md", "w", encoding="utf-8").write("\n".join(lines) + "\n")
    print(f"{len(rows)} rows: {count}; to read {len(to_read)} -> {os.path.relpath(OUT, ROOT)}.md")


if __name__ == "__main__":
    main()
