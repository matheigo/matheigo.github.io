"""Fetch the Japanese entrance-exam papers the conventions are checked against, in one run.

    python3 scripts/ledger/fetch_jp_exams.py          # index pages -> math PDFs -> pdftotext
    python3 scripts/ledger/fetch_jp_exams.py --list   # what is cached and what is missing

The Japanese side of a convention (DECISIONS, Phase 3 慣習差 2 の前の修正 4) is
checked in the 大学入試センター's own papers: the 大学入学共通テスト and the
大学入試センター試験, 本試験, 数学 (the problems and the 正解 tables). Only
whether a way of writing or saying something occurs, and where, is used: no
problem text leaves corpus/ref/jp/exams/ (gitignored, like the other references).

  - 共通テスト 令和6〜8年度: the DNC's pages (https://www.dnc.ac.jp/kyotsu/kakomondai/),
    which keep the last three years
  - 共通テスト 令和3〜5年度 and センター試験 平成26〜令和2年度: the DNC took these
    pages down; their copies in the Internet Archive (web.archive.org, the DNC's
    own pages and PDFs as published) are read instead

Each index page is read for the links whose text names 数学 (not the covers);
each PDF is fetched once and turned into text with pdftotext. Most センター試験
papers are scanned images with no text layer: those (text under OCR_BELOW bytes)
are rendered with pdftoppm and read with the macOS Vision framework
(scripts/ledger/ocr.swift, run locally; the text is marked "ocr" in _index.json).
OCR keeps the Japanese but loses most symbols (overbars, arrows, Σ): a notation
is confirmed by looking at the rendered page. Every request has
a timeout and a retry limit (429 / 5xx wait and retry), progress is printed as
done/total, and what is on disk is not fetched again: a re-run fetches only
what is missing. A PDF the archive does not hold is recorded as missing in
_index.json and not asked for again.
"""
import html
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(ROOT, "corpus", "ref", "jp", "exams")
UA = "MathEigo-ledger/0.1 (https://github.com/matheigo/matheigo.github.io)"
TIMEOUT = 60  # seconds per request
MAX_RETRY = 4
PAUSE_DNC = 1.0
PAUSE_ARCHIVE = 3.0  # the Internet Archive answers 429 to quick runs of requests
OCR_BELOW = 200  # bytes of pdftotext output: less than this is an image-only paper
OCR_DPI = 150
# covers (数学１ ／ 数学２), the 別冊 and the other subjects printed in the 数学② booklet are not read
NOT_OCR = re.compile(r"数学[１２12]\(|別冊|簿記|情報")
OCR_BIN = os.path.join(OUT, "_ocr")
DNC = "https://www.dnc.ac.jp"

# (id prefix, label, index page, Internet Archive timestamp or None for the live DNC site)
PAGES = [
    ("r8-hon", "共通テスト 令和8年度 本試験 問題", "/kyotsu/kakomondai/r8/r8_honshiken_mondai.html", None),
    ("r8-hon-seikai", "共通テスト 令和8年度 本試験 正解", "/kyotsu/kakomondai/r8/r8_honsiken_seikai.html", None),
    ("r7-hon", "共通テスト 令和7年度 本試験 問題", "/kyotsu/kakomondai/r7/r7_honshiken_mondai.html", None),
    ("r7-hon-seikai", "共通テスト 令和7年度 本試験 正解", "/kyotsu/kakomondai/r7/r7_honsiken_seikai.html", None),
    ("r6-hon", "共通テスト 令和6年度 本試験 問題", "/kyotsu/kakomondai/r6/r6_honshiken_mondai.html", None),
    ("r6-hon-seikai", "共通テスト 令和6年度 本試験 正解", "/kyotsu/kakomondai/r6/r6_honsiken_seikai.html", None),
    ("r5-hon", "共通テスト 令和5年度 本試験 問題", "/kyotsu/kakomondai/r5/r5_honshiken_mondai.html", "20240408"),
    ("r5-hon-seikai", "共通テスト 令和5年度 本試験 正解", "/kyotsu/kakomondai/r5/r5_honsiken_seikai.html", "20240408"),
    ("r4-hon", "共通テスト 令和4年度 本試験 問題", "/kyotsu/kakomondai/r4/r4_honshiken_mondai.html", "20230601"),
    ("r4-hon-seikai", "共通テスト 令和4年度 本試験 正解", "/kyotsu/kakomondai/r4/r4_honshiken_seikai.html", "20230601"),
    ("r3-dai1", "共通テスト 令和3年度 第1日程 問題", "/kyotsu/kakomondai/r3/r3_dai1_mondai.html", "20220601"),
    ("r3-dai1-seikai", "共通テスト 令和3年度 第1日程 正解", "/kyotsu/kakomondai/r3/r3_dai1_seikai.html", "20220601"),
    ("r2-hon", "センター試験 令和2年度 本試験 問題", "/center/shiken_jouhou/jisshikekka/index.html", "20200601"),
    ("r2-hon-seikai", "センター試験 令和2年度 本試験 正解", "/center/shiken_jouhou/jisshikekka/r2honsiken_seikai.html", "20200601"),
    ("h31-hon", "センター試験 平成31年度 本試験 問題", "/center/kako_shiken_jouhou/h31/jisshikekka/index.html", "20200601"),
    ("h31-hon-seikai", "センター試験 平成31年度 本試験 正解", "/center/kako_shiken_jouhou/h31/jisshikekka/h31honsiken_seikai.html", "20200601"),
    ("h30-hon", "センター試験 平成30年度 本試験 問題", "/center/kako_shiken_jouhou/h30/jisshikekka/index.html", "20190601"),
    ("h30-hon-seikai", "センター試験 平成30年度 本試験 正解", "/center/kako_shiken_jouhou/h30/jisshikekka/h30honsiken_seikai.html", "20190601"),
    ("h29-hon", "センター試験 平成29年度 本試験 問題", "/center/kako_shiken_jouhou/h29/jisshikekka/index.html", "20180601"),
    ("h29-hon-seikai", "センター試験 平成29年度 本試験 正解", "/center/kako_shiken_jouhou/h29/jisshikekka/h29honsiken_seikai.html", "20180601"),
    ("h28-hon", "センター試験 平成28年度 本試験 問題", "/center/kako_shiken_jouhou/h28/jisshikekka/H28honshi_mondai.html", "20170601"),
    ("h27-hon", "センター試験 平成27年度 本試験 問題", "/center/kako_shiken_jouhou/h27/jisshikekka/27honshiken_mondai.html", "20160601"),
    ("h26-hon", "センター試験 平成26年度 本試験 問題", "/center/kako_shiken_jouhou/h26/jisshikekka/honshiken_mondai.html", "20150601"),
]

# A link is a math paper when its text names 数学 and it is not a cover or a note about the paper.
MATH = re.compile(r"数学|sugaku|suugaku", re.I)
NOT_PAPER = re.compile(r"表紙|hyoshi|見解|意見|評価|訂正|ポイント|拡大|点字|注意")


def archived(url, ts):
    """The Internet Archive's copy of a DNC URL as it was published (id_: the file itself, no banner)."""
    return f"https://web.archive.org/web/{ts}id_/{url}" if ts else url


def open_url(url, what):
    """urlopen with a timeout and a retry limit. 429 / 5xx wait and retry; 404 returns None."""
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(1, MAX_RETRY + 1):
        try:
            with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            if e.code in (429, 500, 502, 503, 504) and attempt < MAX_RETRY:
                wait = int(e.headers.get("Retry-After", "0") or 0) or 20 * attempt
                print(f"\n  {what}: HTTP {e.code}, retry {attempt}/{MAX_RETRY} in {wait}s")
                time.sleep(wait)
                continue
            raise
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            if attempt < MAX_RETRY:
                print(f"\n  {what}: {e}, retry {attempt}/{MAX_RETRY}")
                time.sleep(5 * attempt)
                continue
            raise
    raise RuntimeError(f"{what}: gave up after {MAX_RETRY} tries")


def math_links(page_html):
    """(link text, absolute DNC URL) of the math papers on an index page."""
    out = []
    for m in re.finditer(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', page_html, re.S):
        href = html.unescape(m.group(1))
        text = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", m.group(2)))).strip()
        name = urllib.parse.unquote(href)
        if ".pdf" not in href.lower() or not (MATH.search(text) or MATH.search(name)) or NOT_PAPER.search(text + name):
            continue
        # an archived page links through the archive: take the DNC URL back out of it
        href = re.sub(r"^(?:https?://web\.archive\.org)?/web/\d+(?:id_)?/", "", href)
        url = href if href.startswith("http") else DNC + href
        out.append((text or os.path.basename(name), url))
    return list(dict.fromkeys(out))


def load_index():
    path = os.path.join(OUT, "_index.json")
    return json.load(open(path, encoding="utf-8")) if os.path.exists(path) else {"pages": {}, "papers": {}}


def save_index(index):
    with open(os.path.join(OUT, "_index.json"), "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=1)


def main():
    os.makedirs(OUT, exist_ok=True)
    index = load_index()
    if "--list" in sys.argv:
        for pid, p in index["papers"].items():
            print(pid, p["status"], p["label"], p["text"])
        return

    # 1. index pages (cached as their list of math links)
    todo = [p for p in PAGES if p[0] not in index["pages"]]
    print(f"index pages: {len(PAGES)}, {len(PAGES) - len(todo)} cached, {len(todo)} to fetch")
    for i, (pid, label, path, ts) in enumerate(todo, 1):
        body = open_url(archived(DNC + path, ts), pid)
        links = math_links(body.decode("utf-8", "replace")) if body else []
        index["pages"][pid] = {"label": label, "url": DNC + path, "archived": ts, "status": "ok" if body else "missing", "links": links}
        save_index(index)
        print(f"  {i}/{len(todo)} {pid}: {'missing' if not body else f'{len(links)} math papers'}")
        time.sleep(PAUSE_ARCHIVE if ts else PAUSE_DNC)

    # 2. the papers (cached as PDF + text; a missing one is not asked for again)
    papers = []
    for pid, label, path, ts in PAGES:
        for n, (text, url) in enumerate(index["pages"][pid]["links"], 1):
            papers.append((f"{pid}-{n:02d}", f"{label} {text}", url, ts))
    todo = [p for p in papers if p[0] not in index["papers"]]
    print(f"papers: {len(papers)}, {len(papers) - len(todo)} cached, {len(todo)} to fetch")
    for i, (key, label, url, ts) in enumerate(todo, 1):
        pdf = os.path.join(OUT, f"{key}.pdf")
        txt = os.path.join(OUT, f"{key}.txt")
        body = open_url(archived(url, ts), key)
        status = "missing"
        if body and body[:5] == b"%PDF-":
            with open(pdf, "wb") as f:
                f.write(body)
            subprocess.run(["pdftotext", "-layout", pdf, txt], check=True, timeout=300)
            status = "ok"
        index["papers"][key] = {"label": label, "url": url, "archived": ts, "status": status, "text": os.path.basename(txt) if status == "ok" else None}
        save_index(index)
        print(f"  {i}/{len(todo)} {key}: {status} {label}")
        time.sleep(PAUSE_ARCHIVE if ts else PAUSE_DNC)

    # 3. OCR for the image-only papers (local; cached as the text file, marked "ocr")
    todo = [
        k for k, p in index["papers"].items()
        if p["status"] == "ok" and not p.get("ocr") and not NOT_OCR.search(p["label"])
        and os.path.getsize(os.path.join(OUT, p["text"])) < OCR_BELOW
    ]
    print(f"OCR: {len(todo)} image-only papers")
    if todo and not os.path.exists(OCR_BIN):
        subprocess.run(["swiftc", "-O", os.path.join(HERE, "ocr.swift"), "-o", OCR_BIN], check=True, timeout=600)
    for i, key in enumerate(todo, 1):
        tmp = os.path.join(OUT, "_pages")
        os.makedirs(tmp, exist_ok=True)
        for f in os.listdir(tmp):
            os.remove(os.path.join(tmp, f))
        subprocess.run(["pdftoppm", "-r", str(OCR_DPI), "-png", os.path.join(OUT, f"{key}.pdf"), os.path.join(tmp, "p")], check=True, timeout=900)
        pages = sorted(os.path.join(tmp, f) for f in os.listdir(tmp))
        with open(os.path.join(OUT, f"{key}.txt"), "w", encoding="utf-8") as out:
            subprocess.run([OCR_BIN, *pages], check=True, timeout=1800, stdout=out)
        index["papers"][key]["ocr"] = True
        save_index(index)
        print(f"  {i}/{len(todo)} {key}: {len(pages)} pages")

    ok = sum(1 for p in index["papers"].values() if p["status"] == "ok")
    print(f"done: {ok}/{len(index['papers'])} papers as text in corpus/ref/jp/exams/")


if __name__ == "__main__":
    main()
