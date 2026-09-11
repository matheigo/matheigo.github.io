#!/usr/bin/env python3
"""Phase 0 sample data writer. NOT RE-RUN - data/ is authoritative.

Several seed entries have been edited by hand since this ran (sign-chart,
move-term-to-other-side). Running this again would overwrite those edits.
Kept only to record where the first 25 entries came from.

Writes the 10 terms / 5 symbols / 5 phrases / 3 conventions / 2 curriculum units
that PLAN.md 9 (Phase 0, item 5) asks for by hand. Kept as a script only so the
seed set is reproducible; from Phase 2 on, entries are authored as JSON directly.
"""
import json
import os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
TODAY = "2026-09-10"


def w(collection, obj):
    path = os.path.join(ROOT, "data", collection, obj["id"] + ".json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
        f.write("\n")


# --------------------------------------------------------------------------
# terms
# --------------------------------------------------------------------------

TERMS = [
    {
        "id": "quadratic-formula",
        "ja": {"term": "解の公式", "reading": "かいのこうしき", "alt": ["二次方程式の解の公式"]},
        "en": {"term": "quadratic formula", "alt": [], "uk": None, "register": "both"},
        "pos": "noun",
        "mapping": "exact",
        "mapping_note": None,
        "domains": ["algebra"],
        "level": {"jp": ["中3", "数I"], "us": ["Algebra 1", "Algebra 2", "Integrated Math 2"]},
        "definition_ja": "二次方程式 ax²+bx+c=0 の解を係数から直接求める公式。",
        "definition_en": "A formula that gives the solutions of ax²+bx+c=0 directly from the coefficients.",
        "latex": "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",
        "spoken_en": "x equals negative b, plus or minus the square root of b squared minus four a c, all over two a",
        "examples": [
            {
                "en": "If it doesn't factor, just use the quadratic formula.",
                "ja": "因数分解できなければ解の公式を使えばいい。",
                "register": "spoken",
            }
        ],
        "collocations": [
            {"en": "plug into the quadratic formula", "ja": "解の公式に代入する"},
            {"en": "apply the quadratic formula", "ja": "解の公式を適用する"},
        ],
        "pitfalls": ["米国では判別式を D と置かず b²−4ac と書いたまま進めることが多い。"],
        "related": ["discriminant", "completing-the-square"],
        "sources": [
            {"type": "wikipedia-langlink", "ja": "二次方程式の解の公式", "en": "Quadratic formula"}
        ],
        "confidence": "likely",
    },
    {
        "id": "discriminant",
        "ja": {"term": "判別式", "reading": "はんべつしき", "alt": []},
        "en": {"term": "discriminant", "alt": [], "uk": None, "register": "both"},
        "pos": "noun",
        "mapping": "exact",
        "mapping_note": None,
        "domains": ["algebra"],
        "level": {"jp": ["中3", "数I"], "us": ["Algebra 1", "Algebra 2"]},
        "definition_ja": "二次方程式 ax²+bx+c=0 の b²−4ac のこと。符号で実数解の個数が決まる。",
        "definition_en": "The quantity b²−4ac attached to ax²+bx+c=0; its sign tells you how many real solutions there are.",
        "latex": "b^2 - 4ac",
        "spoken_en": "b squared minus four a c",
        "examples": [
            {
                "en": "The discriminant is negative, so there are no real solutions.",
                "ja": "判別式が負なので実数解はありません。",
                "register": "spoken",
            },
            {
                "en": "Since b² − 4ac = 0, the equation has a double root.",
                "ja": "b²−4ac=0 より、この方程式は重解をもつ。",
                "register": "written",
            },
        ],
        "collocations": [
            {"en": "the discriminant is positive/zero/negative", "ja": "判別式が正／0／負である"},
            {"en": "check the discriminant", "ja": "判別式を調べる"},
        ],
        "pitfalls": [
            "日本の答案では D と置いて「D>0 より」と書くが、米国の教室では b²−4ac をそのまま書き、名前だけ discriminant と呼ぶことが多い。"
        ],
        "related": ["quadratic-formula"],
        "sources": [{"type": "wikipedia-langlink", "ja": "判別式", "en": "Discriminant"}],
        "confidence": "likely",
        "respelling": "dih-SKRIM-uh-nunt",
    },
    {
        "id": "completing-the-square",
        "ja": {"term": "平方完成", "reading": "へいほうかんせい", "alt": ["平方完成する"]},
        "en": {"term": "completing the square", "alt": [], "uk": None, "register": "both"},
        "pos": "noun",
        "mapping": "exact",
        "mapping_note": None,
        "domains": ["algebra"],
        "level": {"jp": ["中3", "数I"], "us": ["Algebra 1", "Algebra 2", "Precalculus"]},
        "definition_ja": "二次式を a(x−p)²+q の形に変形すること。頂点や最大最小を読み取るために使う。",
        "definition_en": "Rewriting a quadratic as a(x−p)²+q so that the vertex, or the maximum or minimum, can be read off.",
        "latex": "x^2 + 6x + 5 = (x+3)^2 - 4",
        "spoken_en": "x squared plus six x plus five equals the quantity x plus three, squared, minus four",
        "examples": [
            {
                "en": "Complete the square to find the vertex.",
                "ja": "平方完成して頂点を求めなさい。",
                "register": "written",
            },
            {
                "en": "You could factor it, but completing the square is faster here.",
                "ja": "因数分解でもできるけど、ここは平方完成のほうが速い。",
                "register": "spoken",
            },
        ],
        "collocations": [
            {"en": "complete the square", "ja": "平方完成する"},
            {"en": "in vertex form", "ja": "平方完成した形で"},
        ],
        "pitfalls": [
            "米国では平方完成した形を vertex form と呼び、その名前のほうが授業でよく出る。"
        ],
        "related": ["quadratic-formula"],
        "sources": [
            {"type": "wikipedia-langlink", "ja": "平方完成", "en": "Completing the square"}
        ],
        "confidence": "likely",
    },
    {
        "id": "substitute",
        "ja": {"term": "代入する", "reading": "だいにゅうする", "alt": ["代入"]},
        "en": {
            "term": "substitute",
            "alt": ["plug in", "sub in"],
            "uk": None,
            "register": "both",
        },
        "pos": "verb",
        "mapping": "exact",
        "mapping_note": None,
        "domains": ["algebra", "classroom"],
        "level": {"jp": ["中1", "数I"], "us": ["Pre-Algebra", "Algebra 1"]},
        "definition_ja": "文字に具体的な値や別の式を当てはめること。",
        "definition_en": "To put a value or another expression in place of a variable.",
        "latex": None,
        "spoken_en": None,
        "examples": [
            {
                "en": "Plug x = 2 into the equation and see what you get.",
                "ja": "x=2 を方程式に代入してみて。",
                "register": "spoken",
            },
            {
                "en": "Substituting t = 2x gives a quadratic in t.",
                "ja": "t=2x を代入すると t の二次方程式になる。",
                "register": "written",
            },
        ],
        "collocations": [
            {"en": "plug in x = 2", "ja": "x=2 を代入する"},
            {"en": "substitute back", "ja": "もとに戻して代入する"},
            {"en": "substitute u for 2x", "ja": "2x を u とおく"},
        ],
        "pitfalls": [
            "教室の話し言葉では plug in が圧倒的に多い。答案や論文調の文では substitute を使う。",
            "substitute A for B は「B の代わりに A を入れる」。順序を逆にしやすい。",
        ],
        "related": ["move-term-to-other-side"],
        "sources": [{"type": "editorial"}],
        "confidence": "likely",
    },
    {
        "id": "move-term-to-other-side",
        "ja": {"term": "移項する", "reading": "いこうする", "alt": ["移項"]},
        "en": {
            "term": "move a term to the other side",
            "alt": ["bring it over to the other side", "subtract it from both sides"],
            "uk": None,
            "register": "both",
        },
        "pos": "verb",
        "mapping": "near",
        "mapping_note": "英語には「移項」に当たる一語の名詞がない。名詞 transposition は通じにくい。米国の教室では動詞句で言うか、同じ操作を「両辺から引く」と説明することが多い。",
        "domains": ["algebra", "classroom"],
        "level": {"jp": ["中1"], "us": ["Pre-Algebra", "Algebra 1"]},
        "definition_ja": "等式や不等式の項を、符号を変えて反対側へ移すこと。",
        "definition_en": "To move a term to the other side of an equation or inequality, changing its sign.",
        "latex": None,
        "spoken_en": None,
        "examples": [
            {
                "en": "Move the 3x over to the other side so the x's are together.",
                "ja": "3x を移項して x をまとめて。",
                "register": "spoken",
            },
            {
                "en": "Subtracting 5 from both sides gives 2x = 8.",
                "ja": "5 を移項して 2x = 8 となる。",
                "register": "written",
            },
        ],
        "collocations": [
            {"en": "get all the x's on one side", "ja": "x を片側に集める"},
            {"en": "isolate x", "ja": "x について解く（x だけにする）"},
        ],
        "pitfalls": [
            "答案では「両辺から引く」と書くほうが自然に読まれる。transpose は使わない。"
        ],
        "related": ["substitute"],
        "sources": [{"type": "editorial"}],
        "confidence": "likely",
    },
    {
        "id": "sign-chart",
        "ja": {"term": "増減表", "reading": "ぞうげんひょう", "alt": []},
        "en": {"term": "sign chart", "alt": ["sign diagram"], "uk": None, "register": "both"},
        "pos": "noun",
        "mapping": "none",
        "mapping_note": "日本の増減表（x の行・f′(x) の行・f(x) の行を並べ、矢印で増減を書く表）は米国では定型として教えない。同じ判断は first-derivative test で行い、符号は数直線上に + と − を書く sign chart で示すのが普通。表を書いても減点はされないが、記法は説明を添える。",
        "domains": ["calculus"],
        "level": {"jp": ["数II", "数III"], "us": ["AP Calculus AB", "Calculus I"]},
        "definition_ja": "導関数の符号を区間ごとに並べ、もとの関数の増減と極値を読み取る表。",
        "definition_en": "A number line, or table, marked with the sign of the derivative on each interval, used to find where a function rises and falls.",
        "latex": None,
        "spoken_en": None,
        "examples": [
            {
                "en": "Make a sign chart for f prime and see where it changes from plus to minus.",
                "ja": "f′ の増減表を書いて、正から負に変わるところを見て。",
                "register": "spoken",
            },
            {
                "en": "By the first-derivative test, f has a local maximum at x = 1.",
                "ja": "増減表より、f は x=1 で極大となる。",
                "register": "written",
            },
        ],
        "collocations": [
            {"en": "make a sign chart", "ja": "増減表を書く"},
            {"en": "f prime changes sign at x = 1", "ja": "x=1 の前後で f′ の符号が変わる"},
        ],
        "pitfalls": [
            "「increase-decrease table」は直訳で、米国の教室では通じない。",
            "極大・極小は local maximum / local minimum。最大・最小（区間全体）は absolute または global をつける。",
        ],
        "related": ["derivative-at-a-point"],
        "sources": [{"type": "editorial"}],
        "confidence": "likely",
    },
    {
        "id": "squeeze-theorem",
        "ja": {"term": "はさみうちの原理", "reading": "はさみうちのげんり", "alt": ["はさみうちの定理"]},
        "en": {
            "term": "squeeze theorem",
            "alt": [],
            "uk": "sandwich theorem",
            "register": "both",
        },
        "pos": "noun",
        "mapping": "exact",
        "mapping_note": None,
        "domains": ["calculus", "analysis"],
        "level": {"jp": ["数III"], "us": ["AP Calculus AB", "Calculus I"]},
        "definition_ja": "g(x) ≦ f(x) ≦ h(x) で g と h が同じ極限をもつとき、f もその極限をもつという定理。",
        "definition_en": "If g(x) ≤ f(x) ≤ h(x) and g and h have the same limit, then f has that limit too.",
        "latex": "\\lim_{x \\to 0} x^2 \\sin\\frac{1}{x} = 0",
        "spoken_en": "the limit as x goes to zero of x squared sine of one over x is zero",
        "examples": [
            {
                "en": "This one is a squeeze theorem problem — bound it between negative x squared and x squared.",
                "ja": "これははさみうちの問題。−x² と x² ではさんで。",
                "register": "spoken",
            }
        ],
        "collocations": [
            {"en": "by the squeeze theorem", "ja": "はさみうちの原理より"},
            {"en": "squeeze it between", "ja": "〜ではさむ"},
        ],
        "pitfalls": ["sandwich theorem は英国寄り。米国の教科書はほぼ squeeze theorem。"],
        "related": [],
        "sources": [{"type": "wikipedia-langlink", "ja": "はさみうちの原理", "en": "Squeeze theorem"}],
        "confidence": "likely",
    },
    {
        "id": "derivative-at-a-point",
        "ja": {"term": "微分係数", "reading": "びぶんけいすう", "alt": []},
        "en": {
            "term": "derivative at a point",
            "alt": ["the value of the derivative at x = a", "f prime of a"],
            "uk": None,
            "register": "both",
        },
        "pos": "noun",
        "mapping": "near",
        "mapping_note": "米国では「微分係数」に当たる独立した名詞を立てず、導関数 (derivative) の x=a での値として言う。記号 f′(a) をそのまま「f prime of a」と読むことが多い。",
        "domains": ["calculus"],
        "level": {"jp": ["数II", "数III"], "us": ["AP Calculus AB", "Calculus I"]},
        "definition_ja": "関数 f の x=a における変化率。グラフの点 (a, f(a)) での接線の傾きに等しい。",
        "definition_en": "The rate of change of f at x = a, equal to the slope of the tangent line at the point (a, f(a)).",
        "latex": "f'(a) = \\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}",
        "spoken_en": "f prime of a equals the limit as h goes to zero of f of a plus h minus f of a, all over h",
        "examples": [
            {
                "en": "f prime of two is the slope of the tangent line there.",
                "ja": "f′(2) はそこでの接線の傾きです。",
                "register": "spoken",
            }
        ],
        "collocations": [
            {"en": "evaluate the derivative at x = 2", "ja": "x=2 における微分係数を求める"},
            {"en": "the slope of the tangent line at x = 2", "ja": "x=2 での接線の傾き"},
        ],
        "pitfalls": [
            "「differential coefficient」は英国の古い教科書の語で、米国の教室ではまず聞かない。"
        ],
        "related": ["sign-chart"],
        "sources": [{"type": "editorial"}],
        "confidence": "likely",
    },
    {
        "id": "find-a-common-denominator",
        "ja": {"term": "通分する", "reading": "つうぶんする", "alt": ["通分"]},
        "en": {
            "term": "find a common denominator",
            "alt": ["get a common denominator", "put them over a common denominator"],
            "uk": None,
            "register": "both",
        },
        "pos": "verb",
        "mapping": "near",
        "mapping_note": "英語は動詞句で言う。名詞 1 語の対応はない。",
        "domains": ["arithmetic", "algebra"],
        "level": {"jp": ["小学校", "中1"], "us": ["Pre-Algebra", "Algebra 1"]},
        "definition_ja": "分母の異なる分数を、分母をそろえた形に書き直すこと。",
        "definition_en": "To rewrite fractions so that they share the same denominator.",
        "latex": "\\frac{1}{2} + \\frac{1}{3} = \\frac{3}{6} + \\frac{2}{6}",
        "spoken_en": "one half plus one third equals three sixths plus two sixths",
        "examples": [
            {
                "en": "Get a common denominator first, then add the numerators.",
                "ja": "まず通分して、それから分子を足す。",
                "register": "spoken",
            },
            {
                "en": "Putting both terms over a common denominator gives a single fraction.",
                "ja": "両方の項を通分すると 1 つの分数にまとまる。",
                "register": "written",
            },
        ],
        "collocations": [
            {"en": "the least common denominator (LCD)", "ja": "最小公倍数を分母にした形"},
            {"en": "reduce the fraction", "ja": "約分する"},
        ],
        "pitfalls": [
            "約分（reduce / cancel）と通分（find a common denominator）は英語では別の言い方になる。まとめて一語では言えない。"
        ],
        "related": [],
        "sources": [{"type": "editorial"}],
        "confidence": "likely",
    },
    {
        "id": "am-gm-inequality",
        "ja": {
            "term": "相加平均と相乗平均の関係",
            "reading": "そうかへいきんとそうじょうへいきんのかんけい",
            "alt": ["相加相乗平均の不等式", "相加相乗"],
        },
        "en": {
            "term": "AM-GM inequality",
            "alt": ["arithmetic mean-geometric mean inequality"],
            "uk": None,
            "register": "both",
        },
        "pos": "noun",
        "mapping": "exact",
        "mapping_note": None,
        "domains": ["algebra", "proof"],
        "level": {"jp": ["数II"], "us": ["Precalculus", "Discrete Math"]},
        "definition_ja": "正の数 a, b について (a+b)/2 ≧ √(ab) が成り立ち、等号は a=b のときに限るという関係。",
        "definition_en": "For positive a and b, the arithmetic mean (a+b)/2 is at least the geometric mean √(ab), with equality exactly when a = b.",
        "latex": "\\frac{a+b}{2} \\ge \\sqrt{ab}",
        "spoken_en": "a plus b over two is greater than or equal to the square root of a b",
        "examples": [
            {
                "en": "Use AM-GM here; equality holds when the two terms are equal.",
                "ja": "ここは相加相乗を使う。等号は 2 つが等しいときです。",
                "register": "spoken",
            }
        ],
        "collocations": [
            {"en": "by AM-GM", "ja": "相加相乗平均の関係より"},
            {"en": "equality holds when a = b", "ja": "等号成立は a=b のとき"},
        ],
        "pitfalls": [
            "日本の高校では最小値を求める定番の道具だが、米国の標準的な高校課程では扱いが薄く、競技数学や大学の授業で出てくることが多い。",
            "答案では「等号成立条件」を書く習慣は米国でも同じく必要。equality holds when ... と書く。",
        ],
        "related": [],
        "sources": [{"type": "editorial"}],
        "confidence": "likely",
    },
]

# --------------------------------------------------------------------------
# symbols
# --------------------------------------------------------------------------

SYMBOLS = [
    {
        "id": "integral-definite",
        "latex": "\\int_a^b f(x)\\,dx",
        "spoken_en": [
            {"text": "the integral from a to b of f of x d x", "register": "standard"},
            {"text": "the integral of f of x from a to b", "register": "spoken"},
        ],
        "spoken_ja": "インテグラル a から b、f(x) dx ／ f(x) の a から b までの定積分",
        "name_en": "definite integral",
        "name_ja": "定積分",
        "term_ref": None,
        "level": {"jp": ["数II", "数III"], "us": ["AP Calculus AB", "Calculus I"]},
        "notes": ["dx は 'd x' と2音で読む。'dee ex' と書くこともある。"],
        "tts_text": "the integral from a to b of f of x, d x",
        "sources": [{"type": "reference", "title": "Nekovar, Mathematical English (a brief summary)"}],
        "confidence": "likely",
    },
    {
        "id": "derivative-prime",
        "latex": "f'(x)",
        "spoken_en": [
            {"text": "f prime of x", "register": "standard"},
            {"text": "f prime", "register": "spoken"},
        ],
        "spoken_ja": "エフ ダッシュ エックス（日本では「ダッシュ」、英語では prime）",
        "name_en": "derivative (prime notation)",
        "name_ja": "導関数（プライム記法）",
        "term_ref": "derivative-at-a-point",
        "level": {"jp": ["数II", "数III"], "us": ["AP Calculus AB", "Calculus I"]},
        "notes": [
            "日本語の「エフ ダッシュ」をそのまま f dash と言っても米国では通じにくい。prime を使う。",
            "二階微分 f''(x) は 'f double prime of x'。",
        ],
        "sources": [{"type": "editorial"}],
        "confidence": "likely",
    },
    {
        "id": "summation-sigma",
        "latex": "\\sum_{k=1}^{n} a_k",
        "spoken_en": [
            {"text": "the sum from k equals one to n of a sub k", "register": "standard"},
            {"text": "the sum of a k, k from one to n", "register": "spoken"},
        ],
        "spoken_ja": "シグマ、k イコール 1 から n まで、a の k",
        "name_en": "summation",
        "name_ja": "総和（シグマ）",
        "term_ref": None,
        "level": {"jp": ["数B"], "us": ["Precalculus", "AP Calculus BC", "Calculus II"]},
        "notes": [
            "添字は 'a sub k' と読む。'a k' でも通じるが、式が込み入ると sub をはさむほうが安全。",
            "Σ そのものは 'sigma'。'the summation sign' とも言う。",
        ],
        "tts_text": "the sum from k equals one to n of a sub k",
        "sources": [{"type": "editorial"}],
        "confidence": "likely",
    },
    {
        "id": "square-root",
        "latex": "\\sqrt{x^2+1}",
        "spoken_en": [
            {"text": "the square root of x squared plus one", "register": "standard"},
            {"text": "root x squared plus one", "register": "spoken"},
        ],
        "spoken_ja": "ルート x の 2 乗 プラス 1",
        "name_en": "square root",
        "name_ja": "平方根（ルート）",
        "term_ref": None,
        "level": {"jp": ["中3", "数I"], "us": ["Algebra 1"]},
        "notes": [
            "根号が全体にかかっていることを示すには 'the square root of the quantity x squared plus one' と言う。'the quantity' が括弧の役割をする。",
            "3 乗根は 'the cube root of', n 乗根は 'the nth root of'。",
        ],
        "sources": [{"type": "editorial"}],
        "confidence": "likely",
    },
    {
        "id": "power-squared",
        "latex": "x^2",
        "spoken_en": [
            {"text": "x squared", "register": "standard"},
            {"text": "x to the second power", "register": "written"},
        ],
        "spoken_ja": "エックスの 2 乗",
        "name_en": "square (second power)",
        "name_ja": "2 乗",
        "term_ref": None,
        "level": {"jp": ["中1", "中2"], "us": ["Pre-Algebra", "Algebra 1"]},
        "notes": [
            "2 乗は squared、3 乗は cubed、4 乗以上は 'to the fourth (power)'。",
            "x^{n+1} は 'x to the n plus one' と読むと曖昧なので 'x to the power n plus one' か 'x to the quantity n plus one' と言う。",
        ],
        "sources": [{"type": "editorial"}],
        "confidence": "likely",
    },
]

# --------------------------------------------------------------------------
# phrases
# --------------------------------------------------------------------------

PHRASES = [
    {
        "id": "office-hours-stuck-at-step",
        "situation": "office-hours",
        "intent": "どこで詰まっているかを伝える",
        "en": "I follow it up to here, but I don't see how you get from this line to the next one.",
        "ja": "ここまでは分かるのですが、この行から次の行への変形が分かりません。",
        "register": "polite",
        "variants": [
            {"en": "I'm lost at this step.", "register": "casual"},
            {"en": "Could you walk me through this step?", "register": "polite"},
        ],
        "tags": ["asking", "derivation"],
        "sources": [{"type": "editorial"}],
        "confidence": "likely",
    },
    {
        "id": "class-asking-repeat",
        "situation": "class-asking",
        "intent": "聞き取れなかったので、もう一度言ってほしい",
        "en": "Sorry, could you say that last part again?",
        "ja": "すみません、最後のところをもう一度お願いできますか。",
        "register": "polite",
        "variants": [
            {"en": "Could you repeat the last step?", "register": "polite"},
            {
                "en": "Sorry, I missed that.",
                "register": "casual",
                "note": "短く済ませたいとき。授業中に一番よく使う。",
            },
        ],
        "tags": ["asking", "listening"],
        "sources": [{"type": "editorial"}],
        "confidence": "likely",
    },
    {
        "id": "explaining-solution-first-step",
        "situation": "explaining-solution",
        "intent": "自分の解き方を、順を追って説明し始める",
        "en": "First I set the two expressions equal, then I solved for x and checked the answer.",
        "ja": "まず 2 つの式を等号で結んで、x について解いて、最後に答えを確かめました。",
        "register": "neutral",
        "variants": [
            {"en": "What I did was set them equal and solve for x.", "register": "casual"},
            {
                "en": "I started by setting the two expressions equal to each other.",
                "register": "polite",
            },
        ],
        "tags": ["explaining", "sequence"],
        "sources": [{"type": "editorial"}],
        "confidence": "likely",
    },
    {
        "id": "written-solution-therefore",
        "situation": "written-solution",
        "intent": "答案で「よって」「したがって」と書く",
        "en": "Therefore x = 3 is the only solution.",
        "ja": "よって x=3 が唯一の解である。",
        "register": "written",
        "variants": [
            {"en": "Hence x = 3 is the only solution.", "register": "written"},
            {
                "en": "So x = 3 is the only solution.",
                "register": "neutral",
                "note": "米国の答案では so で十分な場面が多い。硬くしすぎない。",
            },
        ],
        "tags": ["writing", "conclusion"],
        "sources": [{"type": "editorial"}],
        "confidence": "likely",
    },
    {
        "id": "exam-clarify-instruction",
        "situation": "exam",
        "intent": "試験中に、問題文の指示の意味を確認する",
        "en": "Does \"simplify\" here mean I should rationalize the denominator?",
        "ja": "ここでの simplify は、分母を有理化しろという意味ですか。",
        "register": "polite",
        "variants": [
            {"en": "Do you want the answer in exact form or as a decimal?", "register": "polite"},
            {"en": "Should I show all the steps for this one?", "register": "polite"},
        ],
        "tags": ["asking", "instructions"],
        "sources": [{"type": "editorial"}],
        "confidence": "likely",
    },
]

# --------------------------------------------------------------------------
# conventions
# --------------------------------------------------------------------------

CONVENTIONS = [
    {
        "id": "inequality-symbols",
        "title_ja": "≦ と ≤",
        "title_en": "Inequality signs",
        "jp": "教科書・答案では ≦ ≧ を使う。",
        "us": "≤ ≥ が標準。≦ は見慣れないが通じる。手書きでは ≤ に寄せる。",
        "advice_ja": "米国の答案では ≤ ≥ を使う。",
        "category": "notation",
        "level": {"jp": ["中1"], "us": ["Pre-Algebra"]},
        "term_refs": [],
        "sources": [{"type": "editorial"}],
        "confidence": "likely",
    },
    {
        "id": "therefore-because-symbols",
        "title_ja": "∴ と ∵",
        "title_en": "Therefore and because signs",
        "jp": "答案で ∴（ゆえに）と ∵（なぜならば）を多用する。",
        "us": "記号としてはほとんど書かない。therefore / so / since / because と語で書く。読み手によっては ∴ を知らないこともある。",
        "advice_ja": "語で書く。結論は Therefore か So、理由は Since か Because。段階を示したいだけなら So で十分。",
        "category": "proof-style",
        "level": {"jp": ["中2", "数I"], "us": ["Geometry", "Algebra 2"]},
        "term_refs": [],
        "sources": [{"type": "editorial"}],
        "confidence": "likely",
    },
    {
        "id": "slope-intercept-form",
        "title_ja": "y = ax + b と y = mx + b",
        "title_en": "Slope-intercept form",
        "jp": "一次関数は y = ax + b と書き、a を傾き、b を切片と呼ぶ。",
        "us": "y = mx + b が標準で、m が slope、b が y-intercept。この形の名前は slope-intercept form。点と傾きから書く point-slope form、Ax + By = C の standard form も授業で区別して使う。",
        "advice_ja": "傾きは m と書く。授業では式の「形」に名前があるので、slope-intercept / point-slope / standard の 3 つを覚えておくと指示が読める。",
        "category": "notation",
        "level": {"jp": ["中2", "数I"], "us": ["Algebra 1", "Algebra 2"]},
        "term_refs": [],
        "sources": [{"type": "editorial"}],
        "confidence": "likely",
    },
]

# --------------------------------------------------------------------------
# curriculum
# --------------------------------------------------------------------------

CURRICULUM = [
    {
        "id": "jp-suugaku-3-sekibun",
        "system": "jp",
        "subject": "数学III",
        "unit": "積分法",
        "topics": [
            "不定積分",
            "定積分",
            "置換積分法",
            "部分積分法",
            "面積",
            "体積",
            "曲線の長さ",
        ],
        "us_equivalents": [
            {"course": "AP Calculus BC", "coverage": "most"},
            {
                "course": "Calculus II",
                "coverage": "most",
                "note": "数IIIの積分は Calc I 後半〜Calc II 前半に相当。級数・Taylor は日本の高校範囲外。",
            },
        ],
        "term_refs": [],
        "sources": [{"type": "mext-translation", "doc": "高等学校学習指導要領（平成30年告示）英訳版（仮訳）"}],
        "updated": TODAY,
    },
    {
        "id": "us-precalculus-trigonometry",
        "system": "us",
        "track": "traditional",
        "subject": "Precalculus",
        "unit": "Trigonometric functions",
        "topics": [
            "unit circle",
            "radian measure",
            "sine, cosine, tangent",
            "secant, cosecant, cotangent",
            "graphs and transformations",
            "inverse trigonometric functions",
            "trigonometric identities",
            "law of sines and law of cosines",
        ],
        "jp_equivalents": [
            {
                "subject": "数学I 図形と計量",
                "coverage": "some",
                "note": "三角比・正弦定理・余弦定理はここ。",
            },
            {
                "subject": "数学II 三角関数",
                "coverage": "most",
                "note": "弧度法・グラフ・加法定理はここ。sec/csc/cot と逆三角関数は日本の高校では扱わない。",
            },
        ],
        "term_refs": [],
        "updated": TODAY,
    },
]


def main():
    for t in TERMS:
        t.setdefault("reviewed", {"machine": TODAY, "audit": None, "human": None})
        t.setdefault("updated", TODAY)
        w("terms", t)
    for s in SYMBOLS:
        s.setdefault("updated", TODAY)
        w("symbols", s)
    for p in PHRASES:
        p.setdefault("updated", TODAY)
        w("phrases", p)
    for c in CONVENTIONS:
        c.setdefault("updated", TODAY)
        w("conventions", c)
    for c in CURRICULUM:
        w("curriculum", c)
    print(
        f"terms={len(TERMS)} symbols={len(SYMBOLS)} phrases={len(PHRASES)} "
        f"conventions={len(CONVENTIONS)} curriculum={len(CURRICULUM)}"
    )


if __name__ == "__main__":
    main()
