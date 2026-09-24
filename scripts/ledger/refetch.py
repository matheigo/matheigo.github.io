"""Re-fetch the outside facts the Phase 2 fix needs, in one run.

    python3 scripts/ledger/refetch.py              # langlinks + ced
    python3 scripts/ledger/refetch.py langlinks    # ja.wikipedia en langlinks for every wiki_ja in the ledger
    python3 scripts/ledger/refetch.py ced          # College Board AP Calculus AB/BC CED (PDF -> text)
    python3 scripts/ledger/refetch.py ced-find "accumulation function" "shell method"

langlinks (docs/DECISIONS.md, Phase 2 修正): the Phase 1 ledger has 167 rows
whose ja article was kept but whose en langlink came back empty, although
ja.wikipedia has one (リーマン和 -> Riemann sum, 広義積分 -> Improper integral).
build.py never followed the API's `continue`: without lllimit the API returns
10 langlinks per 50 titles and continues. This asks again for every wiki_ja the
fixed ledger keeps, 50 titles per request, following `continue`. The result is
scripts/ledger/langlinks.json (committed; fix_phase1.py reads it offline). It is
also the cache: a re-run requests only titles that are not in it yet.

ced: the CED is College Board's; only topic numbers and whether a wording
occurs are used. The PDF and its text stay under corpus/ref/ (gitignored) and
never enter the repository.

Every request has a timeout and a retry limit; progress is printed as done/total.
"""
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import OrderedDict

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)

LANGLINKS = os.path.join(HERE, "langlinks.json")
REF = os.path.join(ROOT, "corpus", "ref")
CED_URL = "https://apcentral.collegeboard.org/media/pdf/ap-calculus-ab-and-bc-course-and-exam-description.pdf"
CED_PDF = os.path.join(REF, "ap-calculus-ab-bc-ced.pdf")
CED_TXT = os.path.join(REF, "ap-calculus-ab-bc-ced.txt")

UA = "MathEigo-ledger/0.1 (https://github.com/matheigo/matheigo.github.io)"
TIMEOUT = 30  # seconds per request
MAX_RETRY = 3  # then give up; what was fetched so far stays saved
PAUSE = 0.5  # between requests
BATCH = 50  # MediaWiki titles per query


def open_url(url, what):
    """urlopen with a timeout and a retry limit. 429 honours Retry-After."""
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    last = None
    for attempt in range(MAX_RETRY + 1):
        try:
            return urllib.request.urlopen(req, timeout=TIMEOUT)
        except Exception as e:  # noqa: BLE001 - any network failure counts toward the limit
            last = e
            if attempt == MAX_RETRY:
                break
            wait = 5 * (attempt + 1)
            if isinstance(e, urllib.error.HTTPError) and e.code == 429:
                wait = max(wait, int(e.headers.get("Retry-After", "0") or 0))
            print(f"  retry {attempt + 1}/{MAX_RETRY} in {wait}s ({what}): {e}", flush=True)
            time.sleep(wait)
    raise RuntimeError(f"{what}: gave up after {MAX_RETRY} retries: {last}")


def api(params):
    params = {"action": "query", "format": "json", "formatversion": "2", **params}
    url = "https://ja.wikipedia.org/w/api.php?" + urllib.parse.urlencode(params)
    with open_url(url, "ja.wikipedia") as r:
        return json.load(r)


# -------------------------------------------------------------- langlinks
def ledger_titles():
    import fix_phase1 as F

    rows, _, _, _ = F.transform(langlinks=False)
    return list(OrderedDict.fromkeys(r["wiki_ja"] for r in rows.values() if r["wiki_ja"]))


def load_langlinks():
    if os.path.exists(LANGLINKS):
        return json.load(open(LANGLINKS, encoding="utf-8"))
    return {"fetched": None, "ja": {}}


def save_langlinks(data):
    tmp = LANGLINKS + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1, sort_keys=True)
        f.write("\n")
    os.replace(tmp, LANGLINKS)


def fetch_batch(titles):
    """{title: {"page": ja article after redirects or None, "en": en langlink or None}}.
    Follows `continue` until the batch is complete."""
    langlinks, pages, norm, redir = {}, {}, {}, {}
    cont = {}
    while True:
        j = api({"prop": "langlinks", "lllang": "en", "lllimit": "max", "redirects": "1",
                 "titles": "|".join(titles), **cont})
        q = j.get("query", {})
        norm.update({n["from"]: n["to"] for n in q.get("normalized", [])})
        redir.update({r["from"]: r["to"] for r in q.get("redirects", [])})
        for p in q.get("pages", []):
            pages[p["title"]] = p
            for ll in p.get("langlinks", []):
                langlinks[p["title"]] = ll["title"]
        if "continue" not in j:
            break
        cont = j["continue"]
        time.sleep(PAUSE)
    out = {}
    for t in titles:
        t2 = norm.get(t, t)
        t3 = redir.get(t2, t2)
        p = pages.get(t3)
        if not p or p.get("missing") or p.get("invalid"):
            out[t] = {"page": None, "en": None}
        else:
            out[t] = {"page": t3, "en": langlinks.get(t3)}
    return out


def langlinks():
    titles = ledger_titles()
    data = load_langlinks()
    todo = [t for t in titles if t not in data["ja"]]
    print(f"langlinks: {len(titles)} ja titles in the ledger, {len(titles) - len(todo)} cached, "
          f"{len(todo)} to fetch", flush=True)
    done = 0
    for i in range(0, len(todo), BATCH):
        batch = todo[i:i + BATCH]
        data["ja"].update(fetch_batch(batch))
        data["fetched"] = time.strftime("%Y-%m-%d")
        save_langlinks(data)
        done += len(batch)
        print(f"  [langlinks] {done}/{len(todo)}", flush=True)
        time.sleep(PAUSE)
    have = sum(1 for t in titles if data["ja"].get(t, {}).get("en"))
    print(f"langlinks: {have}/{len(titles)} titles have an en langlink -> {os.path.relpath(LANGLINKS, ROOT)}")


# -------------------------------------------------------------------- ced
def ced():
    os.makedirs(REF, exist_ok=True)
    if os.path.exists(CED_TXT) and os.path.getsize(CED_TXT) > 0:
        print(f"ced: cached ({os.path.relpath(CED_TXT, ROOT)})")
        return
    if not (os.path.exists(CED_PDF) and os.path.getsize(CED_PDF) > 0):
        print(f"ced: downloading {CED_URL}", flush=True)
        with open_url(CED_URL, "CED") as r:
            total = int(r.headers.get("Content-Length") or 0)
            tmp = CED_PDF + ".part"
            done, step = 0, max(total // 10, 1 << 20)
            mark = step
            with open(tmp, "wb") as f:
                while True:
                    chunk = r.read(1 << 16)
                    if not chunk:
                        break
                    f.write(chunk)
                    done += len(chunk)
                    if done >= mark:
                        print(f"  [ced] {done}/{total or '?'} bytes", flush=True)
                        mark += step
            if total and done != total:
                raise RuntimeError(f"CED: got {done} of {total} bytes")
            os.replace(tmp, CED_PDF)
        print(f"  [ced] {done}/{total or done} bytes", flush=True)
    subprocess.run(["pdftotext", "-enc", "UTF-8", CED_PDF, CED_TXT], check=True, timeout=300)
    print(f"ced: text -> {os.path.relpath(CED_TXT, ROOT)} (gitignored)")


def ced_topics():
    """[(section, text)]. The unit guides run from the Unit 1 opener to the exam
    section; inside them each `TOPIC n.m` page is its own section and each unit
    opener (with its "Unit at a Glance") is `unitN`. Before that is `front`
    (course framework, the sample pages that explain how to read a unit guide);
    after it is `exam` (exam information, sample questions, scoring)."""
    if not os.path.exists(CED_TXT):
        raise SystemExit("run `python3 scripts/ledger/refetch.py ced` first")
    text = open(CED_TXT, encoding="utf-8").read()
    first = re.search(r"^TOPIC 1\.1$", text, re.M)
    if not first:
        raise SystemExit("CED text has no TOPIC 1.1 heading; the layout changed")
    start = [m.start() for m in re.finditer(r"^UNIT 1$", text[: first.start()], re.M)][-1]
    end = re.search(r"^Exam Overview$", text[first.start():], re.M)
    stop = first.start() + end.start() if end else len(text)
    body = text[start:stop]
    marks = sorted(
        [(m.start(), m.group(1)) for m in re.finditer(r"^TOPIC (\d{1,2}\.\d{1,2})$", body, re.M)]
        + [(m.start(), f"unit{m.group(1)}") for m in re.finditer(r"^UNIT (\d{1,2})\b.*$", body, re.M)]
    )
    out = [("front", text[:start])]
    for (pos, name), nxt in zip(marks, marks[1:] + [(len(body), None)]):
        out.append((name, body[pos:nxt[0]]))
    out.append(("exam", text[stop:]))
    return out


def squash(s):
    return re.sub(r"\s+", " ", s.replace("­", "").replace("-\n", "")).lower()


def ced_find(phrases):
    """Where a wording occurs in the CED: topic numbers and counts only (no text)."""
    topics = [(n, squash(t)) for n, t in ced_topics()]
    for p in phrases:
        needle = squash(p)
        hits = OrderedDict()
        for num, t in topics:
            n = len(re.findall(r"(?<![a-z])" + re.escape(needle) + r"(?![a-z])", t))
            if n:
                hits[num] = hits.get(num, 0) + n
        where = ", ".join(f"{k}×{v}" for k, v in hits.items()) or "—"
        print(f"  {p:<48} {sum(hits.values()):>4}   {where}")


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "all"
    if cmd in ("langlinks", "all"):
        langlinks()
    if cmd in ("ced", "all"):
        ced()
    if cmd == "ced-find":
        ced_find(sys.argv[2:])


if __name__ == "__main__":
    main()
