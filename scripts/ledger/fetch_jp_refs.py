"""Fetch the Japanese-side references for the conventions (慣習差), in one run.

    python3 scripts/ledger/fetch_jp_refs.py            # 解説 PDFs + ja.wikipedia articles
    python3 scripts/ledger/fetch_jp_refs.py wiki       # only ja.wikipedia
    python3 scripts/ledger/fetch_jp_refs.py search     # only the full-text searches (JA_WIKI_SEARCH)

Each row of ledger/conventions.csv is checked on both sides before it is
generated (DECISIONS, Phase 3 慣習差の生成). The Japanese side is read in
  - 中学校学習指導要領（平成29年告示）解説 数学編 and
    高等学校学習指導要領（平成30年告示）解説 数学編 理数編 (MEXT PDFs -> pdftotext)
  - ja.wikipedia articles (plain-text extracts, MediaWiki API), JA_WIKI_TITLES
into corpus/ref/jp/ (gitignored, like the other references: only the article
titles, section names and what they say in our own words leave it).

Every request has a timeout and a retry limit, progress is printed as
done/total, and what is already on disk is not fetched again (a re-run
fetches only what is missing). A title the wiki does not have is recorded as
missing in corpus/ref/jp/wiki/_index.json and not asked for again.
"""
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(ROOT, "corpus", "ref", "jp")
WIKI = os.path.join(OUT, "wiki")
UA = "MathEigo-ledger/0.1 (https://github.com/matheigo/matheigo.github.io)"
TIMEOUT = 30  # seconds per request
MAX_RETRY = 3
PAUSE = 0.5

KAISETSU = {
    # the same PDFs fetch_mext.py cuts the course-of-study text out of
    "kaisetsu-chu": "https://www.mext.go.jp/component/a_menu/education/micro_detail/__icsFiles/afieldfile/2019/03/18/1387018_004.pdf",
    "kaisetsu-kou": "https://www.mext.go.jp/content/20260115-mxt_kyoiku02-100002620_04.pdf",
}

# The ja.wikipedia articles the conventions are checked against (redirects followed).
JA_WIKI_TITLES = [
    "∴", "∵", "不等号", "一次関数", "相似", "合同 (幾何学)", "線分", "円周角", "円周角の定理", "弧 (幾何学)",
    "条件付き確率", "補集合", "余事象", "組合せ (数学)", "順列", "重複組合せ", "二項係数",
    "対数", "自然対数", "常用対数", "三角関数", "逆三角関数", "正規分布", "標準正規分布表", "乱数表",
    "ベクトル", "数ベクトル", "標準基底", "区間 (数学)", "増減表", "積分法", "微分積分学の基本定理",
    "原始関数", "不定積分", "積分定数", "置換積分", "部分積分", "初等関数", "区分求積法",
    "合同条件", "三角形の合同条件", "直角三角形", "方べきの定理", "命題", "対偶 (論理学)", "平行移動",
    "相似比", "正多角形", "因数分解", "たすき掛け", "不等式", "球", "球面", "円 (数学)", "位取り記数法",
    "床関数と天井関数", "ガウス記号", "ロピタルの定理", "平均偏差", "四分位数", "四分位範囲", "共分散",
    "不定方程式", "合同式", "チェバの定理", "メネラウスの定理", "三垂線の定理", "アポロニウスの円",
    "相加相乗平均の不等式", "群数列", "階差数列", "真数", "三角関数の合成", "解と係数の関係", "五心",
    "三角形の五心", "半角の公式", "放物線", "平方完成", "直線", "自由落下", "虚数", "複素数", "速度",
    "変位", "級数", "確率", "排反事象", "加法定理", "証明", "Q.E.D.", "判別式", "極限", "片側極限",
    "単位行列", "連立方程式", "最大公約数", "方程式", "式 (数学)", "一筆書き", "オイラー路",
    "自然数", "象限", "濃度 (数学)", "集合", "回帰分析", "分散 (確率論)", "全体集合", "標本空間",
    "多項式", "単項式", "平方根", "分数関数", "有理関数", "一次不等式", "台形", "互いに素 (整数論)",
    "仮説検定", "棄却域", "有意水準", "標本分散", "不偏分散", "四捨五入", "端数処理", "循環小数",
    "部分集合", "偏差値", "母線", "零点", "方程式の解", "導関数", "数列", "総和", "負の数",
    "三角定規", "媒介変数", "特性方程式", "漸化式", "ニアリーイコール", "除算", "乗算", "乗算記号",
    "除算記号", "小数点", "有理化", "弧度法", "関数 (数学)", "期待値", "標準偏差", "二項分布",
    "統計的推測", "信頼区間", "度数分布", "箱ひげ図", "散布図", "相関係数", "ベン図", "内分",
    "点と直線の距離", "漸近線", "三角比", "正弦定理", "余弦定理", "ヘロンの公式", "円錐", "角錐",
    "平均値の定理", "中間値の定理", "ロルの定理", "テイラー展開", "マクローリン展開", "数学的帰納法",
    "背理法", "必要条件と十分条件", "否定", "論理和", "論理積", "全称記号", "存在記号", "写像",
    "定義域", "値域", "逆関数", "合成関数", "絶対値", "有理数", "無理数", "実数", "整数",
    "約数", "倍数", "素数", "素因数分解", "ユークリッドの互除法", "n進法", "二進法", "十六進法",
    "ベクトルの内積", "外積", "行列", "行列式", "転置行列", "逆行列", "複素数平面", "偏角", "極形式",
    "ド・モアブルの定理", "二次曲線", "楕円", "双曲線", "媒介変数表示", "極座標", "極方程式",
    "微分方程式", "回転体", "定積分", "曲線の長さ", "数値積分", "平均絶対偏差", "箱ひげ図",
    "度 (角度)", "ラジアン", "角", "有向線分", "位置ベクトル", "平行四辺形", "ひし形", "長方形",
    "正方形", "四角形", "多角形", "三角形", "二等辺三角形", "正三角形", "円周率", "π",
    # second round (the first round's missing titles under other names, and more rows)
    "極値", "変曲点", "≒", "近似", "三角関数の公式の一覧", "三角関数の加法定理", "等式", "解 (数学)",
    "仮説検定", "統計的仮説検定", "直角三角形の合同条件", "証明終了", "ダッシュ (記号)", "プライム (記号)",
    "マイナス記号", "負号", "減法", "筆算", "有理化 (数学)", "分母の有理化", "度数法", "定義域と値域",
    "初項", "等差数列", "等比数列", "一般項", "無限級数", "部分和", "平方単位", "面積", "体積",
    "錐体", "柱体", "外積", "ベクトル積", "位置ベクトル", "内積", "行列の積", "正方行列",
]


# Words with no article of their own: the articles a full-text search finds for them
# (the first SEARCH_TOP results) are fetched like the titles above.
JA_WIKI_SEARCH = [
    "増減表", "三垂線の定理", "群数列", "三角関数の合成", "半角の公式", "棄却域", "分数関数", "内分点",
    "直角三角形の合同条件", "分母を有理化", "証明終わり", "たすき掛け 因数分解", "平方単位",
    "定積分で表された関数", "対応表 置換積分", "積分定数 C", "標準形 二次関数", "特性方程式 漸化式",
]
SEARCH_TOP = 3


def open_url(url, what):
    """urlopen with a timeout and a retry limit. 429 / 5xx wait and retry."""
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(1, MAX_RETRY + 1):
        try:
            with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and attempt < MAX_RETRY:
                wait = int(e.headers.get("Retry-After", "5") or 5)
                print(f"  {what}: HTTP {e.code}, retry {attempt}/{MAX_RETRY} in {wait}s")
                time.sleep(wait)
                continue
            raise
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            if attempt < MAX_RETRY:
                print(f"  {what}: {e}, retry {attempt}/{MAX_RETRY}")
                time.sleep(3 * attempt)
                continue
            raise
    raise RuntimeError(f"{what}: gave up after {MAX_RETRY} tries")


def fetch_kaisetsu():
    os.makedirs(OUT, exist_ok=True)
    items = list(KAISETSU.items())
    for i, (name, url) in enumerate(items, 1):
        pdf = os.path.join(OUT, f"{name}.pdf")
        txt = os.path.join(OUT, f"{name}.txt")
        if os.path.exists(txt) and os.path.getsize(txt) > 0:
            print(f"  {i}/{len(items)} {name}: cached")
            continue
        if not (os.path.exists(pdf) and os.path.getsize(pdf) > 0):
            data = open_url(url, name)
            with open(pdf, "wb") as f:
                f.write(data)
        subprocess.run(["pdftotext", pdf, txt], check=True, timeout=300)
        print(f"  {i}/{len(items)} {name}: {os.path.getsize(txt):,} bytes of text")


def safe(title):
    return urllib.parse.quote(title, safe="") + ".json"


def fetch_wiki():
    os.makedirs(WIKI, exist_ok=True)
    index_path = os.path.join(WIKI, "_index.json")
    index = json.load(open(index_path, encoding="utf-8")) if os.path.exists(index_path) else {}
    titles = list(dict.fromkeys(JA_WIKI_TITLES))
    todo = [t for t in titles if t not in index]
    print(f"ja.wikipedia: {len(titles)} titles, {len(titles) - len(todo)} cached, {len(todo)} to fetch")
    for i, title in enumerate(todo, 1):
        q = urllib.parse.urlencode({
            "action": "query", "prop": "extracts", "explaintext": 1, "redirects": 1,
            "titles": title, "format": "json", "formatversion": 2,
        })
        data = json.loads(open_url(f"https://ja.wikipedia.org/w/api.php?{q}", title))
        pages = data.get("query", {}).get("pages", [])
        page = pages[0] if pages else {}
        if page.get("missing") or "extract" not in page:
            index[title] = {"missing": True}
        else:
            index[title] = {"title": page["title"], "file": safe(page["title"])}
            with open(os.path.join(WIKI, safe(page["title"])), "w", encoding="utf-8") as f:
                json.dump({"title": page["title"], "pageid": page.get("pageid"), "text": page["extract"]}, f, ensure_ascii=False)
        if i % 20 == 0 or i == len(todo):
            print(f"  {i}/{len(todo)}")
            with open(index_path, "w", encoding="utf-8") as f:
                json.dump(index, f, ensure_ascii=False, indent=1)
        time.sleep(PAUSE)
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=1)
    missing = [t for t, v in index.items() if v.get("missing")]
    print(f"ja.wikipedia: {len(index) - len(missing)} articles, {len(missing)} missing: {', '.join(missing)}")


def search_titles():
    """Titles the full-text searches find; cached in corpus/ref/jp/wiki/_search.json."""
    path = os.path.join(WIKI, "_search.json")
    cache = json.load(open(path, encoding="utf-8")) if os.path.exists(path) else {}
    todo = [q for q in JA_WIKI_SEARCH if q not in cache]
    print(f"ja.wikipedia search: {len(JA_WIKI_SEARCH)} queries, {len(todo)} to run")
    for i, query in enumerate(todo, 1):
        q = urllib.parse.urlencode({"action": "query", "list": "search", "srsearch": query, "srlimit": SEARCH_TOP, "format": "json", "formatversion": 2})
        data = json.loads(open_url(f"https://ja.wikipedia.org/w/api.php?{q}", query))
        cache[query] = [r["title"] for r in data.get("query", {}).get("search", [])]
        print(f"  {i}/{len(todo)} {query}: {', '.join(cache[query])}")
        time.sleep(PAUSE)
    os.makedirs(WIKI, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=1)
    return [t for q in JA_WIKI_SEARCH for t in cache.get(q, [])]


def main():
    what = sys.argv[1] if len(sys.argv) > 1 else "all"
    if what in ("all", "kaisetsu"):
        fetch_kaisetsu()
    if what in ("all", "search"):
        JA_WIKI_TITLES.extend(search_titles())
    if what in ("all", "wiki", "search"):
        fetch_wiki()


if __name__ == "__main__":
    main()
