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

/**
 * Academic roles (Manual 2.4), the MICASE code in the @ID tier's education
 * field (JU, SU, JF ...): students and instructors; the rest (RE researcher,
 * ST staff, VO visitor, UN unknown) are "other".
 */
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

/**
 * Classifies a speaker. The CABank MICASE transcripts (checked on the corpus,
 * 2026-09-25) carry a CHAT role word in the @ID role field - Student, Teacher,
 * Speaker, Audience, Member, Participant, Investigator, Leader, Visitor,
 * Other, Unidentified - and the Manual's academic-role code in the education
 * field (JU, SG, SF ...). The role word decides when it is Teacher or Student
 * (a graduate student teaching a section is Teacher / SG: an instructor); any
 * other role word (a colloquium Speaker, an Audience member, a study-group
 * Member) goes by the code.
 */
export function speakerClass(role: string | undefined, code: string | undefined): SpeakerClass {
  const r = (role ?? "").trim();
  if (/^(teacher|instructor|professor|faculty|lecturer)$/i.test(r)) return "instructor";
  if (/^(student|undergraduate|graduate)$/i.test(r)) return "student";
  const c = (code ?? "").trim().toUpperCase();
  if (INSTRUCTOR_ROLES.has(c)) return "instructor";
  if (STUDENT_ROLES.has(c)) return "student";
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

  // speaker code -> role word and academic-role code. @ID wins; @Participants
  // ("S1 Teacher" or "S1 Name Teacher": the role is the last word) fills in.
  const roles: Record<string, { role?: string; code?: string }> = {};
  for (const t of tiers) {
    const participants = t.match(/^@Participants:\s*(.*)$/);
    if (participants) {
      for (const p of participants[1].split(",")) {
        const parts = p.trim().split(/\s+/);
        if (parts[0] && parts.length > 1) (roles[parts[0]] ??= {}).role ??= parts[parts.length - 1];
      }
    }
  }
  for (const t of tiers) {
    const id = t.match(/^@ID:\s*(.*)$/);
    if (!id) continue;
    // language|corpus|code|age|sex|group|SES|role|education|custom|
    const f = id[1].split("|").map((x) => x.trim());
    if (!f[2]) continue;
    const r = (roles[f[2]] ??= {});
    if (f[7]) r.role = f[7];
    if (f[8]) r.code = f[8];
  }
  const speakers: Record<string, SpeakerClass> = {};
  for (const [code, r] of Object.entries(roles)) speakers[code] = speakerClass(r.role, r.code);

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
