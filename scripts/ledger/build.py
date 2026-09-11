# -*- coding: utf-8 -*-
"""Phase 1 builder.

  python3 scripts/ledger/build.py curriculum   -> data/curriculum/*.json
  python3 scripts/ledger/build.py ledger       -> ledger/terms.csv (+ wiki cache)
  python3 scripts/ledger/build.py report       -> ledger/phase1-report.md (単元別件数表 + 怪しい語)
"""
import csv, json, os, re, sys, time, unicodedata, urllib.parse, urllib.request
from collections import Counter, OrderedDict, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))  # scripts/ledger -> repo root
sys.path.insert(0, HERE)
import curriculum_spec as spec  # noqa: E402

TODAY = "2026-09-11"
LEVEL_US = {"Pre-Algebra", "Algebra 1", "Geometry", "Algebra 2", "Integrated Math 1", "Integrated Math 2",
            "Integrated Math 3", "Precalculus", "AP Calculus AB", "AP Calculus BC", "AP Statistics",
            "Calculus I", "Calculus II", "Calculus III", "Linear Algebra", "Intro Statistics", "Discrete Math"}
LEVEL_JP = {"小学校", "中1", "中2", "中3", "数I", "数A", "数II", "数B", "数III", "数C", "大学"}
SUBJECT_TO_LEVEL = {"中1": "中1", "中2": "中2", "中3": "中3", "数学I": "数I", "数学A": "数A", "数学II": "数II",
                    "数学B": "数B", "数学III": "数III", "数学C": "数C"}

# ------------------------------------------------------------------ curriculum

def jp_units():
    out = OrderedDict()
    for (id_, subject, unit, topics, us_eq, levels_us, domain) in spec.JP:
        for e in us_eq:
            assert e[0] in LEVEL_US, (id_, e)
        for l in levels_us:
            assert l in LEVEL_US, (id_, l)
        out[id_] = dict(id=id_, subject=subject, unit=unit, topics=topics, us_eq=us_eq,
                        levels_us=levels_us, domain=domain, system="jp")
    return out

def us_units():
    jp_names = {f"{u['subject']} {u['unit']}" for u in jp_units().values()} | spec.ELEMENTARY
    # 既存サンプル us-precalculus-trigonometry も参照される名前を使っているか確認
    out = OrderedDict()
    for (id_, track, subject, unit, topics, jp_eq, domain, sources) in spec.US:
        assert subject in LEVEL_US, (id_, subject)
        for e in jp_eq:
            assert e[0] in jp_names, (id_, e[0])
        out[id_] = dict(id=id_, track=track, subject=subject, unit=unit, topics=topics, jp_eq=jp_eq,
                        domain=domain, sources=sources, system="us")
    return out

def write_json(path, obj):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
        f.write("\n")

def build_curriculum():
    outdir = os.path.join(ROOT, "data", "curriculum")
    os.makedirs(outdir, exist_ok=True)
    n = 0
    for u in jp_units().values():
        src = spec.MEXT_JHS if u["subject"].startswith("中") else spec.MEXT_HS
        obj = OrderedDict()
        obj["id"] = u["id"]; obj["system"] = "jp"; obj["subject"] = u["subject"]; obj["unit"] = u["unit"]
        obj["topics"] = u["topics"]
        obj["us_equivalents"] = [OrderedDict([("course", e[0]), ("coverage", e[1])] + ([("note", e[2])] if len(e) > 2 else []))
                                 for e in u["us_eq"]]
        obj["term_refs"] = []
        obj["sources"] = [src]
        obj["updated"] = TODAY
        write_json(os.path.join(outdir, u["id"] + ".json"), obj); n += 1
    for u in us_units().values():
        obj = OrderedDict()
        obj["id"] = u["id"]; obj["system"] = "us"; obj["track"] = u["track"]; obj["subject"] = u["subject"]
        obj["unit"] = u["unit"]; obj["topics"] = u["topics"]
        obj["jp_equivalents"] = [OrderedDict([("subject", e[0]), ("coverage", e[1])] + ([("note", e[2])] if len(e) > 2 else []))
                                 for e in u["jp_eq"]]
        obj["term_refs"] = []
        obj["sources"] = u["sources"]
        obj["updated"] = TODAY
        write_json(os.path.join(outdir, u["id"] + ".json"), obj); n += 1
    print(f"curriculum: wrote {n} files ({len(jp_units())} jp + {len(us_units())} us)")

# ---------------------------------------------------------------------- ledger

POS = {"n": "noun", "v": "verb", "adj": "adjective", "ph": "phrase"}
SEEDS = ["seed_jp_chuu.txt", "seed_jp_kou1.txt", "seed_jp_kou2.txt", "seed_jp_kou3.txt", "seed_jp_kou4.txt", "seed_us.txt"]

def slug(en):
    s = unicodedata.normalize("NFKD", en).encode("ascii", "ignore").decode()
    s = s.lower().replace("'", "")
    s = re.sub(r"\(.*?\)", " ", s)
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s

def parse_seeds():
    rows = []
    for fn in SEEDS:
        unit = None
        with open(os.path.join(HERE, fn), encoding="utf-8") as f:
            for ln, line in enumerate(f, 1):
                line = line.rstrip("\n")
                if not line.strip() or line.startswith("#") and not line.startswith("##"):
                    continue
                if line.startswith("## "):
                    unit = line[3:].strip(); continue
                parts = [p.strip() for p in line.split("|")]
                while len(parts) < 8:
                    parts.append("")
                ja, en, pos, mapping, note, id_, wiki, lvjp = parts[:8]
                assert ja and en and pos in POS, (fn, ln, line)
                assert mapping in ("", "exact", "near", "none"), (fn, ln, line)
                assert unit, (fn, ln)
                rows.append(dict(ja=ja, en=en, pos=POS[pos], mapping=mapping or "exact", note=note,
                                 id=id_ or slug(en), wiki=wiki, lvjp=lvjp, unit=unit, src=f"{fn}:{ln}"))
    return rows

def assign(rows):
    jp = jp_units(); us = us_units()
    for r in rows:
        u = jp.get(r["unit"]) or us.get(r["unit"])
        assert u, ("unknown unit", r["unit"], r["src"])
        r["domain"] = u["domain"]
        if u["system"] == "jp":
            r["level_jp"] = SUBJECT_TO_LEVEL[u["subject"]]
            r["level_us"] = "|".join(u["levels_us"])
        else:
            r["level_us"] = u["subject"]
            r["level_jp"] = r["lvjp"] or "大学"
        assert r["level_jp"] in LEVEL_JP or r["level_jp"] == "—", r
    return rows

def dedupe(rows):
    """同じ ja+en は最初の単元に残す。同じ ja で en が違うものは両方残して flag。id 衝突は単元で接尾。"""
    seen_pair = {}
    seen_ja = defaultdict(list)
    out = []
    for r in rows:
        key = (r["ja"], r["en"].lower())
        if key in seen_pair:
            continue  # 再出（後の単元）は落とす
        seen_pair[key] = r
        seen_ja[r["ja"]].append(r)
        out.append(r)
    # 同じ ja で en が違うものは 1 行に統合し、他の en を en_alt に残す（Phase 2 で ja.term は一意）
    drop = set()
    for ja, rs in seen_ja.items():
        if len(rs) > 1:
            keep = rs[0]
            alts = []
            for r in rs[1:]:
                tail = re.sub(r"^(jp|us)-", "", r["unit"])
                alts.append(f"{r['en']} [{tail}]")
                if r["note"] and r["note"] not in keep["note"]:
                    keep["note"] = (keep["note"] + " ／ " + r["note"]).strip(" ／")
                drop.add(id(r))
            keep["en_alt"] = "; ".join(alts)
            keep["flag"] = "ja-merged"
    out = [r for r in out if id(r) not in drop]
    ids = defaultdict(list)
    for r in out:
        ids[r["id"]].append(r)
    for id_, rs in ids.items():
        if len(rs) > 1:
            for r in rs[1:]:
                tail = r["unit"].split("-")[-1]
                r["id"] = f"{id_}-{tail}"
                r["flag"] = (r.get("flag", "") + " id-dedup").strip()
    assert len({r["id"] for r in out}) == len(out)
    return out

# ------------------------------------------------------------- wikipedia/wikidata

CACHE = os.path.join(HERE, "wiki_cache.json")
UA = {"User-Agent": "MathEigo phase1 ledger bootstrap (CC0 dataset; contact via GitHub matheigo)"}
TIMEOUT = 30       # 秒。1 リクエストの上限
MAX_RETRY = 3      # リトライ上限（429 / タイムアウト）
PAUSE = 1.0        # リクエスト間隔（秒）
BATCH = 50         # MediaWiki titles / Wikidata ids の上限

def save_cache(cache):
    tmp = CACHE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=0)
    os.replace(tmp, CACHE)

def api(url):
    req = urllib.request.Request(url, headers=UA)
    last = None
    for attempt in range(MAX_RETRY + 1):
        try:
            with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
                return json.load(resp)
        except Exception as e:  # noqa: BLE001
            last = e
            if attempt == MAX_RETRY:
                break
            wait = 10 * (attempt + 1)
            print(f"    retry {attempt + 1}/{MAX_RETRY} in {wait}s: {e}", flush=True)
            time.sleep(wait)
    raise RuntimeError(f"gave up after {MAX_RETRY} retries: {url[:120]} ... ({last})")

def progress(stage, done, total):
    print(f"  [{stage}] {done}/{total}", flush=True)

def strip_variants(ja):
    c = [ja]
    for suf in ("する", "な", "である", "の"):
        if ja.endswith(suf) and len(ja) > len(suf) + 1:
            c.append(ja[: -len(suf)])
    return c

def fetch_langlinks(titles, cache):
    """ja.wikipedia: 50 タイトルずつ langlinks(en) を取る。redirects=1 で転送先も解決。"""
    todo = [t for t in OrderedDict.fromkeys(titles) if t not in cache]
    print(f"langlinks: {len(titles)} titles, {len(titles) - len(todo)} cached, {len(todo)} to fetch", flush=True)
    for i in range(0, len(todo), BATCH):
        batch = todo[i:i + BATCH]
        q = urllib.parse.quote("|".join(batch))
        url = ("https://ja.wikipedia.org/w/api.php?action=query&prop=langlinks&lllang=en&lllimit=500&redirects=1"
               f"&format=json&formatversion=2&titles={q}")
        j = api(url)
        norm = {n["from"]: n["to"] for n in j.get("query", {}).get("normalized", [])}
        redir = {r["from"]: r["to"] for r in j.get("query", {}).get("redirects", [])}
        pages = {p["title"]: p for p in j.get("query", {}).get("pages", [])}
        for t in batch:
            t2 = norm.get(t, t); t3 = redir.get(t2, t2)
            p = pages.get(t3)
            if not p or p.get("missing"):
                cache[t] = {"ja": None, "en": None}
            else:
                ll = p.get("langlinks") or []
                cache[t] = {"ja": t3, "en": ll[0]["title"] if ll else None}
        save_cache(cache)
        progress("langlinks", i + len(batch), len(todo))
        time.sleep(PAUSE)
    return cache

def fetch_wikidata(ja_titles, cache):
    """Wikidata: jawiki のタイトル 50 件ずつ QID と英語ラベルを取る。"""
    todo = [t for t in OrderedDict.fromkeys(ja_titles) if ("wd:" + t) not in cache]
    print(f"wikidata: {len(ja_titles)} titles, {len(ja_titles) - len(todo)} cached, {len(todo)} to fetch", flush=True)
    for i in range(0, len(todo), BATCH):
        batch = todo[i:i + BATCH]
        q = urllib.parse.quote("|".join(batch))
        url = ("https://www.wikidata.org/w/api.php?action=wbgetentities&sites=jawiki&props=labels|sitelinks|descriptions"
               f"&languages=en|ja&sitefilter=jawiki|enwiki&format=json&titles={q}")
        j = api(url)
        found = {}
        for qid, ent in j.get("entities", {}).items():
            if not qid.startswith("Q"):
                continue
            sl = ent.get("sitelinks", {}).get("jawiki", {}).get("title")
            lab = ent.get("labels", {}).get("en", {}).get("value")
            desc = ent.get("descriptions", {}).get("en", {}).get("value", "")
            if sl:
                found[sl] = {"qid": qid, "en": lab}
                cache["desc:" + qid] = desc
        for t in batch:
            cache["wd:" + t] = found.get(t, {"qid": None, "en": None})
        save_cache(cache)
        progress("wikidata", i + len(batch), len(todo))
        time.sleep(PAUSE)
    return cache

def fetch_descriptions(qids, cache):
    """Wikidata: QID 50 件ずつ英語の説明文（曖昧さ回避ページの判定用）。"""
    todo = [q for q in OrderedDict.fromkeys(qids) if ("desc:" + q) not in cache]
    print(f"descriptions: {len(qids)} qids, {len(qids) - len(todo)} cached, {len(todo)} to fetch", flush=True)
    for i in range(0, len(todo), BATCH):
        batch = todo[i:i + BATCH]
        url = ("https://www.wikidata.org/w/api.php?action=wbgetentities&props=descriptions&languages=en"
               f"&format=json&ids={'|'.join(batch)}")
        j = api(url)
        for q in batch:
            cache["desc:" + q] = j.get("entities", {}).get(q, {}).get("descriptions", {}).get("en", {}).get("value", "")
        save_cache(cache)
        progress("descriptions", i + len(batch), len(todo))
        time.sleep(PAUSE)
    return cache

MATH_PAREN = re.compile(r"^(.+?) \((数学|幾何学|代数学|解析学|確率論|統計学|論理学|位相空間論|線型代数学|線形代数学|集合論|数論|幾何|微分積分学|物理学|情報)\)$")

def pick_math_article(title, links):
    base = re.sub(r"\s*\(.*?\)$", "", title)
    for l in links:
        m = MATH_PAREN.match(l)
        if m and m.group(1) == base:
            return l
    for l in links:
        if l.startswith(base) and any(k in l for k in ("数学", "幾何", "確率", "統計", "論理", "代数", "解析")):
            return l
    return None

def resolve_disambig(titles, cache):
    """曖昧さ回避ページ 50 件ずつ prop=links を取り、「X (数学)」型のリンク先を選ぶ。plcontinue も追う。"""
    todo = [t for t in OrderedDict.fromkeys(titles) if ("dis:" + t) not in cache]
    print(f"disambig: {len(titles)} pages, {len(titles) - len(todo)} cached, {len(todo)} to fetch", flush=True)
    for i in range(0, len(todo), BATCH):
        batch = todo[i:i + BATCH]
        links = defaultdict(list)
        cont = ""
        while True:
            url = ("https://ja.wikipedia.org/w/api.php?action=query&prop=links&plnamespace=0&pllimit=500&format=json"
                   f"&formatversion=2&titles={urllib.parse.quote('|'.join(batch))}{cont}")
            j = api(url)
            for p in j.get("query", {}).get("pages", []):
                links[p["title"]] += [l["title"] for l in p.get("links", [])]
            c = j.get("continue", {}).get("plcontinue")
            if not c:
                break
            cont = "&plcontinue=" + urllib.parse.quote(c)
            time.sleep(PAUSE)
        norm = {n["from"]: n["to"] for n in j.get("query", {}).get("normalized", [])}
        for t in batch:
            cache["dis:" + t] = pick_math_article(t, links.get(norm.get(t, t), []))
        save_cache(cache)
        progress("disambig", i + len(batch), len(todo))
        time.sleep(PAUSE)
    return {t: cache.get("dis:" + t) for t in titles}

def is_disambig(cache, ja_title):
    wd = cache.get("wd:" + ja_title, {})
    return "disambiguation" in (cache.get("desc:" + (wd.get("qid") or ""), "") or "").lower()

def enrich(rows, online=True):
    cache = json.load(open(CACHE, encoding="utf-8")) if os.path.exists(CACHE) else {}
    cands = []
    for r in rows:
        r["cands"] = ([r["wiki"]] if r["wiki"] else []) + strip_variants(r["ja"])
        cands += r["cands"]
    cands = list(OrderedDict.fromkeys(cands))
    if online:
        # 1. langlinks  2. wikidata(QID+説明文)  3. 曖昧さ回避 → 数学記事  4. その記事で 1・2 をもう一度
        fetch_langlinks(cands, cache)
        ja_hits = list(OrderedDict.fromkeys(cache[c]["ja"] for c in cands if cache.get(c, {}).get("ja")))
        fetch_wikidata(ja_hits, cache)
        qids = list(OrderedDict.fromkeys(v["qid"] for k, v in cache.items() if k.startswith("wd:") and v.get("qid")))
        fetch_descriptions(qids, cache)
        disamb = list(OrderedDict.fromkeys(cache[c]["ja"] for c in cands
                                           if cache.get(c, {}).get("ja") and is_disambig(cache, cache[c]["ja"])))
        resolved = resolve_disambig(disamb, cache)
        new_titles = [t for t in resolved.values() if t]
        fetch_langlinks(new_titles, cache)
        ja_hits = [cache[t]["ja"] for t in new_titles if cache.get(t, {}).get("ja")]
        fetch_wikidata(ja_hits, cache)
        qids = list(OrderedDict.fromkeys(v["qid"] for k, v in cache.items() if k.startswith("wd:") and v.get("qid")))
        fetch_descriptions(qids, cache)
        print("fetch done", flush=True)
    # 曖昧さ回避 → 数学記事 への置き換えを候補に足す
    for r in rows:
        extra = []
        for c in r["cands"]:
            h = cache.get(c)
            if h and h["ja"]:
                t = cache.get("dis:" + h["ja"])
                if t:
                    extra.append(t)
        r["cands"] = extra + r["cands"]
    for r in rows:
        r["wiki_ja"] = r["wiki_en"] = r["wikidata"] = r["wd_en"] = ""
        fl = []
        for c in r["cands"]:
            h = cache.get(c)
            if not (h and h["ja"]):
                continue
            wd = cache.get("wd:" + h["ja"], {})
            desc = cache.get("desc:" + (wd.get("qid") or ""), "") or ""
            if "disambiguation" in desc.lower():
                fl.append("wiki-disambig")
                continue
            r["wiki_ja"] = h["ja"]
            r["wiki_en"] = (h["en"] or "").split("#")[0]
            r["wikidata"] = wd.get("qid") or ""
            r["wd_en"] = wd.get("en") or ""
            if not same_title(c, h["ja"]):
                fl.append("wiki-redirect")
            break
        # 数学の記事か（Wikidata の説明文 / 英語記事名で判定）。定規 → Ruler、縮図 → Epitome (film) を出典にしない
        if r["wiki_ja"]:
            desc = (cache.get("desc:" + r["wikidata"], "") or "").lower()
            text = desc + " " + r["wiki_en"].lower() + " " + r["wiki_ja"]
            exact = unicodedata.normalize("NFKC", r["wiki_ja"]) == unicodedata.normalize("NFKC", r["ja"])
            if not any(k in text for k in MATH_WORDS) and not (exact and r["wiki_en"] and not desc):
                fl.append("wiki-nonmath")
        good = r["wiki_ja"] and "wiki-redirect" not in fl and "wiki-nonmath" not in fl and r["pos"] == "noun"
        if good and r["wiki_en"]:
            r["source"] = "wikipedia-langlink"
        elif good and r["wikidata"]:
            r["source"] = "wikidata"
        elif r["unit"].startswith("us-"):
            r["source"] = "textbook"
        else:
            r["source"] = "editorial"
        if fl:
            r["flag"] = (r.get("flag", "") + " " + " ".join(OrderedDict.fromkeys(fl))).strip()
    return rows

MATH_WORDS = ("math", "geometr", "algebra", "statistic", "probab", "number", "function", "theorem", "calculus",
              "logic", "set ", "sets", "graph", "vector", "matri", "polynomial", "equation", "sequence", "series",
              "trigonom", "angle", "integer", "fraction", "decimal", "integral", "derivative", "limit", "line",
              "circle", "triangle", "polygon", "polyhedr", "solid", "point", "coordinate", "variable", "operation",
              "inequalit", "proof", "proposition", "quantif", "relation", "combinator", "permutation", "distribution",
              "sampl", "mean", "variance", "deviation", "regression", "correlation", "hypothes", "estimat", "random",
              "measure", "arithmetic", "exponent", "logarithm", "root", "prime", "divis", "multiple", "ratio",
              "proportion", "symmetr", "transformation", "rotation", "translation", "reflection", "dimension",
              "space", "curve", "surface", "conic", "ellipse", "parabola", "hyperbola", "complex", "real", "rational",
              "irrational", "infinit", "converg", "diverg", "continu", "differenti", "optimi", "constraint",
              "formula", "identity", "axiom", "lemma", "corollary", "definition", "notation", "symbol", "numeral",
              "binary", "hexadecimal", "algorithm", "recursion", "induction", "counting", "expected", "sigma",
              "tree", "path", "network", "cardinal", "physics", "force", "velocity", "acceleration", "work",
              "interest", "percent", "tax", "unit", "die", "dice", "coin", "quadrilateral", "parallel", "shape", "figure",
              "prism", "pyramid", "sides", "edge", "vertex", "vertices", "curvature", "tensor", "manifold", "determinant",
              "cofactor", "expansion", "tautolog", "predicate", "example", "condition", "value", "convex", "concav",
              "average", "approximat", "plot", "chart", "diagram", "table", "placebo", "experiment", "数学", "幾何", "代数", "解析", "確率", "統計", "論理")

def same_title(cand, resolved):
    """リダイレクト先が別概念（余角→角度、約分→分数）なら False。表記ゆれ・部分一致は True。"""
    a = unicodedata.normalize("NFKC", cand).replace(" ", "")
    b = unicodedata.normalize("NFKC", resolved).replace(" ", "")
    a = re.sub(r"\s*\(.*?\)$", "", a)
    b = re.sub(r"\s*\(.*?\)$", "", b)
    if a == b or a in b:
        return True          # 表記ゆれ、または候補を含むより長い記事名（負の数 → 正の数と負の数）
    if b in a and len(b) >= 3:
        return True          # フィボナッチ数列 → フィボナッチ数
    return False             # 回転軸 → 軸、合力 → 力、多変数関数 → 関数 は別概念として扱う


# 対応が怪しい語 30（人間レビュー向け。ledger の id / 判断の理由 / 仮置きの mapping）
SUSPICIOUS = [
    ("vertex-form", "標準形（二次関数）", "vertex form", "near", "日本の「標準形 y=a(x−p)²+q」は米国の vertex form。米国の standard form は y=ax²+bx+c（日本の一般形）。名前が交差している"),
    ("standard-form", "一般形（二次関数）", "standard form", "near", "上と対。standard form と言われて a(x−p)²+q を書くと通じない"),
    ("domain-and-range", "変域", "domain and range", "near", "日本は x の変域・y の変域を同じ語で言う。米国は domain / range を必ず区別"),
    ("direct-proportion", "比例", "direct variation", "near", "米国の教室は varies directly with。proportion は「比例式」の意味に寄る"),
    ("proportion", "比例式", "proportion", "near", "米国の proportion は a:b = c:d の等式そのもの。「比例」と訳語が逆転しやすい"),
    ("equation-houteishiki", "等式 / 方程式", "equation", "exact", "両方 equation。identity（恒等式）との区別だけが残る。2 語を 1 語に畳む判断が要る"),
    ("polynomial", "整式 / 多項式", "polynomial", "exact", "両方 polynomial。integral expression は誤訳。ja.alt に統合するか 2 エントリにするか"),
    ("proposition", "命題", "statement", "near", "米国の高校幾何は statement / conditional statement。proposition は大学の論理学の語"),
    ("necessary-and-sufficient-condition", "必要十分条件", "if and only if", "near", "教室では iff。necessary and sufficient condition は書き言葉"),
    ("trigonometric-ratio", "三角比", "trigonometric ratio", "near", "米国では Geometry の一部（SOHCAHTOA）で「三角比」という単元名はない。sec / csc / cot も同時に入る"),
    ("terminal-side", "動径", "terminal side", "near", "radius vector と直訳すると通じない。initial side / terminal side が対"),
    ("auxiliary-angle-form", "三角関数の合成", "auxiliary-angle form", "near", "米国には手法名がない。writing a sin θ + b cos θ as R sin(θ+α) と説明的に言う"),
    ("angle-addition-formulas", "加法定理（三角関数）", "sum and difference formulas", "near", "addition theorem は Wikipedia の記事名で、教室では sum / difference formulas"),
    ("trigonometric-inequality", "三角不等式（sin x > 1/2 型）", "trigonometric inequality", "near", "英語の triangle inequality（|a+b| ≦ |a|+|b|）と衝突する。誤解を招く典型"),
    ("argument", "真数", "argument (of a logarithm)", "near", "「真数条件」という名前の概念がない。the argument must be positive と言う"),
    ("derivative-at-a-point", "微分係数", "derivative at a point", "near", "differential coefficient は通じない（STYLE）"),
    ("local-maximum", "極大値 / 最大値", "local maximum / absolute maximum", "near", "日本語は極大と最大で語が違うが、英語は local / absolute (global) の形容詞で区別。省略すると混同される"),
    ("opens-downward", "上に凸", "concave down", "near", "日本語の「上」と英語の down が逆に見える。convex upward は通じにくい"),
    ("riemann-sum", "区分求積法", "Riemann sum", "near", "手法名として教えない。limit of a Riemann sum"),
    ("integration-by-substitution", "置換積分法", "u-substitution", "near", "教科書は substitution rule、教室は u-sub。日本の「置換」を replacement と訳さない"),
    ("antiderivative", "原始関数 / 不定積分", "antiderivative / indefinite integral", "near", "米国は区別が緩く、AP では antiderivative が主。日本は 2 語を区別する"),
    ("point-of-internal-division", "内分点 / 外分点", "point that divides the segment internally", "near", "section formula は英国・インド。米国は partition a segment in a ratio"),
    ("the-five-centers-of-a-triangle", "五心（外心・内心・重心・垂心・傍心）", "points of concurrency", "none", "まとめて呼ぶ名前がない。個々は circumcenter 等で通じる"),
    ("power-of-a-point", "方べきの定理", "power of a point", "near", "高校では intersecting chords theorem / secant-tangent theorem として個別に習う"),
    ("tangent-chord-theorem", "接弦定理", "tangent-chord angle", "near", "定理名がない。the angle between a tangent and a chord is half the intercepted arc"),
    ("counting", "場合の数", "counting", "near", "分野名は counting、個数は the number of ways。number of cases は誤訳（STYLE）"),
    ("repeated-trials", "反復試行", "Bernoulli trials / binomial setting", "near", "「反復試行の確率」という括りは binomial probability として扱われる"),
    ("standard-score", "偏差値", "standard score", "none", "日本固有（T-score に近い）。米国は percentile / z-score で言う。訳しても概念が伝わらない"),
    ("sequence-of-differences", "階差数列 / 群数列", "first differences / (none)", "near", "階差は名前をつけずに first differences。群数列は米国にない受験技法"),
    ("base-case", "n=1 のとき / n=k と仮定", "base case / inductive step", "near", "米国は帰納法の段階に名前がある。答案でも Base case: / Inductive step: と書く"),
]

COLS = ["id", "ja", "en", "en_alt", "pos", "unit", "domain", "level_jp", "level_us", "mapping", "source",
        "wiki_ja", "wiki_en", "wikidata", "flag", "note"]

def build_ledger(online=True):
    rows = dedupe(assign(parse_seeds()))
    rows = enrich(rows, online=online)
    os.makedirs(os.path.join(ROOT, "ledger"), exist_ok=True)
    with open(os.path.join(ROOT, "ledger", "terms.csv"), "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(COLS)
        for r in rows:
            w.writerow([r.get(c, "") for c in COLS])
    print(f"ledger: {len(rows)} rows")
    return rows

# ---------------------------------------------------------------------- report

def norm_en(s):
    s = s.lower()
    s = re.sub(r"\s*\([^)]*\)\s*$", "", s)
    s = s.replace("–", "-").replace("’", "'")
    s = re.sub(r"[^a-z0-9]+", " ", s).strip()
    return s

def build_report():
    rows = list(csv.DictReader(open(os.path.join(ROOT, "ledger", "terms.csv"), encoding="utf-8")))
    jp = jp_units(); us = us_units()
    by_unit = defaultdict(list)
    for r in rows:
        by_unit[r["unit"]].append(r)
    lines = []
    lines.append("# Phase 1 report — 台帳の単元別件数と、対応が怪しい語\n")
    lines.append(f"生成日: {TODAY} ／ `ledger/terms.csv` {len(rows)} 行\n")
    lines.append("## 単元別の件数表（日本側）\n")
    lines.append("| 単元 | 合計 | 名詞 | 動詞 | 形容詞 | 句 | 動詞・句の割合 | Wikipedia 対応あり |")
    lines.append("|---|---:|---:|---:|---:|---:|---:|---:|")
    tot = Counter()
    low = []
    for id_, u in jp.items():
        rs = by_unit.get(id_, [])
        c = Counter(r["pos"] for r in rs)
        vp = c["verb"] + c["adjective"] + c["phrase"]
        ratio = vp / len(rs) if rs else 0
        wl = sum(1 for r in rs if r["wiki_en"])
        lines.append(f"| {u['subject']} {u['unit']} | {len(rs)} | {c['noun']} | {c['verb']} | {c['adjective']} | {c['phrase']} | {ratio:.0%} | {wl} |")
        tot.update(c); tot["all"] += len(rs); tot["wl"] += wl
        if ratio < 0.10:
            low.append(f"{u['subject']} {u['unit']} ({ratio:.0%})")
    lines.append(f"| **日本側 計** | **{tot['all']}** | {tot['noun']} | {tot['verb']} | {tot['adjective']} | {tot['phrase']} | "
                 f"{(tot['verb']+tot['adjective']+tot['phrase'])/tot['all']:.0%} | {tot['wl']} |\n")
    if low:
        lines.append("動詞・句が 10% 未満の単元: " + "、".join(low) + "\n")
    lines.append("## 単元別の件数表（米国側から逆に洗った語）\n")
    lines.append("| 科目 | 単元 | 件数 | mapping none | Wikipedia 対応あり |")
    lines.append("|---|---|---:|---:|---:|")
    tot_us = Counter()
    for id_, u in us.items():
        rs = by_unit.get(id_, [])
        if not rs:
            continue
        none = sum(1 for r in rs if r["mapping"] == "none")
        wl = sum(1 for r in rs if r["wiki_en"])
        lines.append(f"| {u['subject']} | {u['unit']} | {len(rs)} | {none} | {wl} |")
        tot_us["all"] += len(rs); tot_us["none"] += none; tot_us["wl"] += wl
    lines.append(f"| **米国側 計** | | **{tot_us['all']}** | {tot_us['none']} | {tot_us['wl']} |\n")
    lines.append("## 出典種別・品詞・mapping の内訳\n")
    for key in ("source", "pos", "mapping", "level_jp"):
        c = Counter(r[key] for r in rows)
        lines.append(f"- {key}: " + "、".join(f"{k} {v}" for k, v in c.most_common()))
    lines.append("")
    lines.append("## 対応が怪しい語 30（人間レビュー向け）\n")
    lines.append("日本語の見出しをそのまま英語にすると米国の教室で通じない、または別の概念に見える語。"
                 "mapping は仮置き。Phase 2 で mapping_note に落とす。\n")
    lines.append("| # | ledger id | 日本語 | 米国で通じる言い方 | mapping | 理由 |")
    lines.append("|---:|---|---|---|---|---|")
    for i, (id_, ja, en, mp, why) in enumerate(SUSPICIOUS, 1):
        lines.append(f"| {i} | {id_} | {ja} | {en} | {mp} | {why} |")
    lines.append("")
    # 機械的に拾える「怪しい」候補
    lines.append("## 機械的に拾った要確認（Wikipedia の英語記事名と暫定 en.term が一致しない語）\n")
    lines.append("暫定 en.term は「教室で言う言い方」、Wikipedia 側は記事名なので一致しなくてよいものが多い。"
                 "Phase 2 の crosscheck で flags になる候補として列挙する。\n")
    lines.append("| id | ja | 暫定 en | Wikipedia en | 単元 |")
    lines.append("|---|---|---|---|---|")
    mism = []
    for r in rows:
        if r["wiki_en"] and norm_en(r["wiki_en"]) != norm_en(r["en"]):
            a, b = norm_en(r["en"]), norm_en(r["wiki_en"])
            if a in b or b in a:
                continue  # 部分一致は許容
            mism.append(r)
    for r in mism:
        lines.append(f"| {r['id']} | {r['ja']} | {r['en']} | {r['wiki_en']} | {r['unit']} |")
    lines.append(f"\n（{len(mism)} 件）\n")
    with open(os.path.join(ROOT, "ledger", "phase1-report.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"report: {len(mism)} mismatches; total rows {len(rows)}")

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "all"
    if cmd in ("curriculum", "all"):
        build_curriculum()
    if cmd in ("ledger", "all"):
        build_ledger(online="--offline" not in sys.argv)
    if cmd in ("report", "all"):
        build_report()
