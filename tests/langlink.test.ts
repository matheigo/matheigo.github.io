import { describe, expect, it } from "vitest";
import { normalizeTitle } from "../scripts/lib/langlink.js";

describe("normalizeTitle (crosscheck)", () => {
  it("drops a trailing qualifier, case, dashes and punctuation", () => {
    expect(normalizeTitle("Proportionality (mathematics)")).toBe("proportionality");
    expect(normalizeTitle("Tangent–secant theorem")).toBe(normalizeTitle("tangent-secant theorem"));
  });

  it("drops a link to a section of the article (Phase 5 監査 3 H-7)", () => {
    const withSection = "Proportionality (mathematics)#Inverse proportionality";
    expect(normalizeTitle(withSection)).toBe("proportionality");
    expect(normalizeTitle(withSection)).toBe(normalizeTitle("Proportionality (mathematics)"));
  });
});
