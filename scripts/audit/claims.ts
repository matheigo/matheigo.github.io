/**
 * Phase 5 audit, checks 1b and 1c: sentences that claim something about the
 * Japanese side or the US side, so that the audit can hold each to a source
 * (PLAN §9 Phase 5 の 1; audits/phase4-report.md G-1).
 *
 * 1b  Japanese side: "日本の教科書は〜", "日本では〜", "数学II では〜", "入試では〜" ...
 *     The Japanese side is checked against the 学習指導要領・解説, the
 *     共通テスト／センター試験 papers and Japanese Wikipedia, as the
 *     conventions were. Conventions are left out: their `jp` field is the
 *     claim itself and was written with a Japanese source for each entry.
 * 1c  US side: "米国では〜", "AP では〜", "Calc I では〜" ... A sentence is
 *     listed when it names no reference (CED, OpenStax, IM, CK-12, Nicholson,
 *     Levin, Wikipedia) and no part of the corpus (講義, 書き言葉, Khan ...).
 *     Those whose entry has a reference or textbook among its sources are
 *     listed apart from those whose entry has none.
 *
 * Output (committed): audits/checks/jp-claims.{md,json}, audits/checks/us-claims.{md,json}
 *
 *   pnpm audit:claims
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadCollection, type Collection } from "../lib/load";
import { CORPUS_WORDS, REFERENCE_WORDS, bodyTexts, sentences } from "../lib/corpus-count";

/** Fields where the claims live: the notes, not the definitions or the examples. */
const FIELDS: Partial<Record<Collection, RegExp>> = {
  terms: /^(mapping_note|pitfalls\[\d+\]|en\.variants\[\d+\]\.note|definition_ja)$/,
  symbols: /^notes\[\d+\]$/,
  phrases: /^(notes\[\d+\]|variants\[\d+\]\.note)$/,
};

/** The pattern of audits/phase4-report.md G-1 (the 286 terms / 300 sentences). */
export const G1 = /日本(の教科書|では|の高校|の授業|の答案|の中学|の入試|の数学|で)/;

/** Broader: every sentence that says how Japan teaches, writes or examines. */
export const JP_CLAIM =
  /日本(?!語)|数学\s?[IⅠⅡⅢABC]{1,3}(?![A-Za-z])|数\s?[IⅠⅡⅢABC]{1,3}(?![A-Za-z])|中学(校)?(では|で|の)|高校(では|で|の)|学習指導要領|検定教科書|教科書(では|は|に|で)|入試|共通テスト|センター試験/;

export const US_CLAIM =
  /米国|アメリカ|(?<![A-Za-z])AP\s?(Calculus|Statistics|Calc|Stat|では|の|で)|CED|College Board|英語圏|Calc(ulus)?\s?(I{1,3}|AB|BC)(?![A-Za-z])/;

/** A sentence that names where its claim comes from. */
const NAMES_A_SOURCE = new RegExp(
  `${REFERENCE_WORDS.source}|${CORPUS_WORDS.source}|topic\\s?\\d|Illustrative|Stewart|Larson|Nekov|Trzeciak|NYSED|Common Core|学習指導要領|解説|共通テスト|センター試験`,
);

interface Claim {
  collection: Collection;
  id: string;
  field: string;
  sentence: string;
  g1?: boolean;
  entrySources?: string; // US: reference / textbook titles among the entry's sources
}

type Src = { type: string; title?: string; doc?: string };

function main() {
  const jp: Claim[] = [];
  const usNone: Claim[] = [];
  const usEntry: Claim[] = [];
  let usNamed = 0;
  for (const c of Object.keys(FIELDS) as Collection[]) {
    for (const e of loadCollection(c)) {
      const refs = ((e.data.sources as Src[] | undefined) ?? [])
        .filter((s) => s.type === "reference" || s.type === "textbook")
        .map((s) => s.title ?? s.doc ?? s.type);
      for (const [at, text] of bodyTexts(e.data)) {
        if (!FIELDS[c]!.test(at)) continue;
        for (const s of sentences(text)) {
          const sentence = s.trim();
          if (!sentence) continue;
          if (JP_CLAIM.test(sentence))
            jp.push({ collection: c, id: e.data.id, field: at, sentence, g1: G1.test(sentence) });
          if (US_CLAIM.test(sentence)) {
            if (NAMES_A_SOURCE.test(sentence)) usNamed++;
            else if (refs.length)
              usEntry.push({
                collection: c,
                id: e.data.id,
                field: at,
                sentence,
                entrySources: refs.join("; "),
              });
            else usNone.push({ collection: c, id: e.data.id, field: at, sentence });
          }
        }
      }
    }
  }

  const outDir = path.join(ROOT, "audits", "checks");
  fs.mkdirSync(outDir, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
  const count = (l: Claim[]) =>
    `${new Set(l.map((x) => `${x.collection}/${x.id}`)).size} 項目・${l.length} 文`;

  const g1 = jp.filter((x) => x.g1);
  fs.writeFileSync(
    path.join(outDir, "jp-claims.json"),
    JSON.stringify({ checked: today, claims: jp }, null, 2) + "\n",
  );
  fs.writeFileSync(
    path.join(outDir, "jp-claims.md"),
    [
      "# 日本側の主張の文（Phase 5 の監査の前の機械の確かめ 2）",
      "",
      `作成: ${today} ／ \`pnpm audit:claims\`（scripts/audit/claims.ts）`,
      "",
      "対象の欄: terms の mapping_note・pitfalls・variants の note・definition_ja、symbols の notes、phrases の notes・variants の note。",
      "慣習差（conventions）は jp の欄そのものが日本側の主張で、生成のときに項目ごとに日本側の資料を出典に入れたので、ここには入れない（監査は慣習差の順で見る）。",
      "",
      `- phase4-report G-1 の正規表現（${G1.source}）に当たる文: **${count(g1)}**`,
      `- 広い正規表現（日本・数学 I〜C・中学・高校・学習指導要領・教科書・入試・共通テスト・センター試験）に当たる文: **${count(jp)}**（主張でない文も混じる。監査の ⑦ で 1 文ずつ見る）`,
      "",
      "| コレクション | id | 欄 | G-1 | 文 |",
      "|---|---|---|---|---|",
      ...jp.map(
        (x) =>
          `| ${x.collection} | ${x.id} | ${x.field} | ${x.g1 ? "○" : ""} | ${esc(x.sentence)} |`,
      ),
      "",
    ].join("\n"),
  );

  fs.writeFileSync(
    path.join(outDir, "us-claims.json"),
    JSON.stringify(
      { checked: today, named: usNamed, noReference: usNone, entryHasReference: usEntry },
      null,
      2,
    ) + "\n",
  );
  fs.writeFileSync(
    path.join(outDir, "us-claims.md"),
    [
      "# 米国側の主張の文で出典に当たる参照がないもの（Phase 5 の監査の前の機械の確かめ 3）",
      "",
      `作成: ${today} ／ \`pnpm audit:claims\`（scripts/audit/claims.ts）`,
      "",
      "対象の欄は日本側と同じ。米国側の主張（米国・アメリカ・AP・CED・College Board・英語圏・Calc I〜III・Calculus AB／BC）の文のうち、",
      "文の中に参照（CED・OpenStax・IM・CK-12・Nicholson・Levin・Wikipedia・topic の番号ほか）も用例コーパス（講義・話し言葉・書き言葉・Khan・MIT ほか）も名指ししないもの。",
      "",
      `- 米国側の主張の文で参照かコーパスを名指しするもの: ${usNamed} 文（一覧にしない）`,
      `- **A. 名指しがなく、エントリの出典にも reference ／ textbook がない: ${count(usNone)}**`,
      `- B. 名指しはないが、エントリの出典に reference ／ textbook がある（その参照が文を支えるかは監査で見る）: ${count(usEntry)}`,
      "",
      "## A. エントリの出典にも参照がない",
      "",
      "| コレクション | id | 欄 | 文 |",
      "|---|---|---|---|",
      ...usNone.map((x) => `| ${x.collection} | ${x.id} | ${x.field} | ${esc(x.sentence)} |`),
      "",
      "## B. エントリの出典に参照がある",
      "",
      "| コレクション | id | 欄 | 文 | エントリの参照 |",
      "|---|---|---|---|---|",
      ...usEntry.map(
        (x) =>
          `| ${x.collection} | ${x.id} | ${x.field} | ${esc(x.sentence)} | ${esc(x.entrySources ?? "")} |`,
      ),
      "",
    ].join("\n"),
  );
  console.log(
    JSON.stringify({
      jpG1: count(g1),
      jpAll: count(jp),
      usNamed,
      usNoReference: count(usNone),
      usEntryHasReference: count(usEntry),
    }),
  );
}

main();
