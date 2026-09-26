/**
 * MICASE (Michigan Corpus of Academic Spoken English) in TalkBank's CHAT
 * format: turning one transcript into the words of its students and of its
 * instructors, and the speech event it records (DECISIONS, Phase 3 記号の前の
 * 修正 5). Pure functions, so they are unit-testable without the corpus;
 * fetch-micase.ts does the files.
 *
 * MICASE is counted for phrases only - it is how students ask, which the
 * lecture transcripts barely hold (PLAN 15 の注意) - never for terms or
 * symbols (manifest `collections`).
 *
 * The file name carries the speech event: LEL115SU015 is a large lecture (LEL)
 * in discipline 115 at the senior-undergraduate level (SU), the 15th event
 * recorded (MICASE Manual 3.1). Speakers carry an academic role (Manual 2.4).
 */

/** Speech event types (MICASE Manual 2.3). */
export const MICASE_EVENTS: Record<string, string> = {
  LES: "small lecture",
  LEL: "large lecture",
  DIS: "discussion section",
  LAB: "lab section",
  SEM: "seminar",
  STP: "student presentation",
  ADV: "advising session",
  COL: "colloquium",
  DEF: "dissertation defense",
  INT: "interview",
  MTG: "meeting",
  OFC: "office hours",
  SVC: "service encounter",
  SGR: "study group",
  TOU: "tour",
  TUT: "tutorial",
};

/** Academic roles (Manual 2.4): students and instructors; the rest are "other". */
const STUDENT_ROLES = new Set(["JU", "SU", "MU", "JG", "SG", "MG"]);
const INSTRUCTOR_ROLES = new Set(["JF", "SF", "MF"]);

export type SpeakerClass = "student" | "instructor" | "other";

export interface MicaseEvent {
  /** e.g. LEL115SU015 */
  id: string;
  /** code from MICASE_EVENTS, e.g. OFC */
  type: string;
  scene: string;
  discipline: string;
  level: string;
}

/** Reads the speech event from a transcript's file name; null if it is not a MICASE id. */
export function micaseEvent(fileName: string): MicaseEvent | null {
  const stem = fileName.replace(/^.*[\\/]/, "").replace(/\.cha$/i, "");
  const m = stem.match(/^([A-Za-z]{3})(\d{3})([A-Za-z]{2})(\d{3})$/);
  if (!m) return null;
  const type = m[1].toUpperCase();
  return { id: stem.toUpperCase(), type, scene: MICASE_EVENTS[type] ?? "unknown", discipline: m[2], level: m[3].toUpperCase() };
}

/** Classifies a speaker from the role words and codes CHAT records for them (@Participants role, @ID fields). */
export function speakerClass(fields: string[]): SpeakerClass {
  const words = fields.flatMap((f) => f.split(/[\s_,|]+/)).filter(Boolean);
  for (const w of words) {
    const u = w.toUpperCase();
    if (INSTRUCTOR_ROLES.has(u) || /^(teacher|instructor|professor|faculty|lecturer)$/i.test(w)) return "instructor";
  }
  for (const w of words) {
    const u = w.toUpperCase();
    if (STUDENT_ROLES.has(u) || /^(student|undergraduate|graduate)$/i.test(w)) return "student";
  }
  return "other";
}

/**
 * CHAT markup out, words in: time bullets, [bracketed] codes, &-fragments and
 * fillers, xxx/yyy/www, pauses, <overlap> brackets, terminators, @-suffixes,
 * the parentheses of omitted sounds ((be)cause -> because) and CA symbols.
 */
export function cleanChatLine(line: string): string {
  return line
    .replace(/\u0015[^\u0015]*\u0015/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/(^|\s)&\S*/g, " ")
    .replace(/(^|\s)(xxx|yyy|www)(?=\s|$)/gi, " ")
    .replace(/\(\.+\)/g, " ")
    .replace(/[<>]/g, " ")
    .replace(/\+\S*/g, " ")
    .replace(/@\w+/g, "")
    .replace(/[()]/g, "")
    .replace(/[^A-Za-z0-9'\s.,?!-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface ChatTranscript {
  /** speaker code -> class */
  speakers: Record<string, SpeakerClass>;
  /** class -> the cleaned utterances, one per line */
  text: Record<SpeakerClass, string[]>;
}

/** Splits one CHAT transcript into the utterances of students, instructors and the rest. */
export function parseChat(chat: string): ChatTranscript {
  const lines = chat.replace(/\r\n?/g, "\n").split("\n");
  // Join continuation lines (a tab at the start) onto the tier they continue.
  const tiers: string[] = [];
  for (const l of lines) {
    if (/^\t/.test(l) && tiers.length > 0) tiers[tiers.length - 1] += " " + l.trim();
    else tiers.push(l);
  }

  const roleFields: Record<string, string[]> = {};
  const add = (code: string, f: string) => (roleFields[code] ??= []).push(f);
  for (const t of tiers) {
    const participants = t.match(/^@Participants:\s*(.*)$/);
    if (participants) {
      for (const p of participants[1].split(",")) {
        const parts = p.trim().split(/\s+/);
        if (parts[0]) add(parts[0], parts.slice(1).join(" "));
      }
    }
    const id = t.match(/^@ID:\s*(.*)$/);
    if (id) {
      const f = id[1].split("|");
      // language|corpus|code|age|sex|group|SES|role|education|custom|
      if (f[2]) add(f[2].trim(), [f[5], f[7], f[8], f[9]].filter(Boolean).join(" "));
    }
  }
  const speakers: Record<string, SpeakerClass> = {};
  for (const [code, fields] of Object.entries(roleFields)) speakers[code] = speakerClass(fields);

  const text: Record<SpeakerClass, string[]> = { student: [], instructor: [], other: [] };
  for (const t of tiers) {
    const u = t.match(/^\*([A-Za-z0-9_]+):\s*(.*)$/);
    if (!u) continue;
    const cleaned = cleanChatLine(u[2]);
    if (cleaned) text[speakers[u[1]] ?? "other"].push(cleaned);
  }
  return { speakers, text };
}

export const wordCount = (lines: string[]) => lines.reduce((n, l) => n + l.split(/\s+/).filter(Boolean).length, 0);
