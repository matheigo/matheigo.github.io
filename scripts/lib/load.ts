import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

export const COLLECTIONS = ["terms", "symbols", "phrases", "conventions", "curriculum"] as const;
export type Collection = (typeof COLLECTIONS)[number];

export interface Entry {
  id: string;
  [key: string]: unknown;
}

export interface LoadedEntry {
  collection: Collection;
  file: string;
  stem: string;
  data: Entry;
}

export function loadCollection(collection: Collection): LoadedEntry[] {
  const dir = path.join(ROOT, "data", collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .sort()
    .map((f) => {
      const file = path.join(dir, f);
      let data: Entry;
      try {
        data = JSON.parse(fs.readFileSync(file, "utf8")) as Entry;
      } catch (err) {
        throw new Error(`${collection}/${f}: invalid JSON - ${(err as Error).message}`);
      }
      return { collection, file, stem: f.replace(/\.json$/, ""), data };
    });
}

export function loadAll(): Record<Collection, LoadedEntry[]> {
  const out = {} as Record<Collection, LoadedEntry[]>;
  for (const c of COLLECTIONS) out[c] = loadCollection(c);
  return out;
}

export function readSchema(name: string): object {
  return JSON.parse(fs.readFileSync(path.join(ROOT, "schema", `${name}.schema.json`), "utf8"));
}

/**
 * Anything past `draft` ships. `likely` entries are shipped but hidden behind
 * the off-by-default "未確認の語も表示" toggle and carry noindex (PLAN 8).
 * `draft` never leaves the repository.
 */
export function isPublishable(data: Entry): boolean {
  if (!("confidence" in data)) return true; // curriculum has no confidence field
  return data.confidence !== "draft";
}

/** Stricter gate for Anki and the print PDF: memorisation and exam use only. */
export function isVerified(data: Entry): boolean {
  return !("confidence" in data) || data.confidence === "verified";
}
