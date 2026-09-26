/**
 * The planned corpus sources (PLAN.md 15). Pure data, no I/O, so the site can
 * import it to name the sources in the evidence table on each page.
 */
export interface ManifestEntry {
  id: string;
  register: "spoken" | "written";
  auto: boolean;
  file: string;
  title: string;
  license: string;
  url?: string;
  /** Collections this file may be counted for; absent means all (MICASE: phrases only). */
  collections?: string[];
  /** MICASE: the speech event and the speaker class (fetch-micase.ts). */
  scene?: string;
  speaker?: string;
}

export const CORPUS_SOURCES: Omit<ManifestEntry, "file">[] = [
  // spoken, hand-transcribed - the strongest evidence, and the only acceptable
  // basis for symbols (auto captions misread formulas).
  { id: "mit-18.01", register: "spoken", auto: false, title: "MIT OCW 18.01 Single Variable Calculus", license: "CC BY-NC-SA", url: "https://ocw.mit.edu/" },
  { id: "mit-18.02", register: "spoken", auto: false, title: "MIT OCW 18.02 Multivariable Calculus", license: "CC BY-NC-SA" },
  { id: "mit-18.06", register: "spoken", auto: false, title: "MIT OCW 18.06 Linear Algebra", license: "CC BY-NC-SA" },
  { id: "mit-18.03", register: "spoken", auto: false, title: "MIT OCW 18.03 Differential Equations", license: "CC BY-NC-SA" },
  { id: "mit-6.042", register: "spoken", auto: false, title: "MIT OCW 6.042 Mathematics for Computer Science", license: "CC BY-NC-SA" },
  // spoken, captions
  { id: "khan-algebra", register: "spoken", auto: false, title: "Khan Academy Algebra", license: "CC BY-NC-SA" },
  { id: "khan-ap-calc", register: "spoken", auto: false, title: "Khan Academy AP Calculus", license: "CC BY-NC-SA" },
  { id: "khan-ap-stats", register: "spoken", auto: false, title: "Khan Academy AP Statistics", license: "CC BY-NC-SA" },
  { id: "khan-middle", register: "spoken", auto: false, title: "Khan Academy Middle School (6th-8th Grade, Pre-Algebra)", license: "CC BY-NC-SA" },
  { id: "yt:profleonard", register: "spoken", auto: true, title: "Professor Leonard", license: "captions, counted as facts only" },
  { id: "yt:organicchem", register: "spoken", auto: true, title: "The Organic Chemistry Tutor", license: "captions, counted as facts only" },
  { id: "yt:patrickjmt", register: "spoken", auto: true, title: "PatrickJMT", license: "captions, counted as facts only" },
  { id: "yt:nancypi", register: "spoken", auto: true, title: "NancyPi", license: "captions, counted as facts only" },
  { id: "yt:blackpenredpen", register: "spoken", auto: true, title: "blackpenredpen", license: "captions, counted as facts only" },
  { id: "yt:3blue1brown", register: "spoken", auto: true, title: "3Blue1Brown", license: "captions, counted as facts only" },
  // spoken, hand-transcribed academic speech (office hours, study groups, discussion sections ...).
  // Counted for phrases only, never for terms or symbols (DECISIONS, Phase 3 記号の前の修正 5).
  { id: "micase", register: "spoken", auto: false, title: "MICASE (Michigan Corpus of Academic Spoken English, TalkBank CABank)", license: "TalkBank; research and education free, commercial use needs permission", url: "https://ca.talkbank.org/access/MICASE.html", collections: ["phrases"] },
  // written
  { id: "openstax-calculus", register: "written", auto: false, title: "OpenStax Calculus Vol 1-3", license: "CC BY-NC-SA 4.0" },
  { id: "openstax-precalculus", register: "written", auto: false, title: "OpenStax Precalculus 2e", license: "CC BY-NC-SA 4.0" },
  { id: "openstax-algtrig", register: "written", auto: false, title: "OpenStax Algebra and Trigonometry 2e", license: "CC BY-NC-SA 4.0" },
  { id: "openstax-introstats", register: "written", auto: false, title: "OpenStax Introductory Statistics 2e", license: "CC BY-NC-SA 4.0" },
  { id: "openstax-prealgebra", register: "written", auto: false, title: "OpenStax Prealgebra 2e", license: "CC BY-NC-SA 4.0" },
  { id: "openstax-elemalg", register: "written", auto: false, title: "OpenStax Elementary Algebra 2e", license: "CC BY-NC-SA 4.0" },
  { id: "openstax-intalg", register: "written", auto: false, title: "OpenStax Intermediate Algebra 2e", license: "CC BY-NC-SA 4.0" },
  { id: "mit-notes", register: "written", auto: false, title: "MIT OCW lecture notes", license: "CC BY-NC-SA" },
];
