import { describe, expect, it } from "vitest";
import { isAnchorSafeAssessmentId, slugifySectionTitle, uniqueAnchors, uniqueSectionAnchors } from "../../src/lib/lecture-template/anchors";

describe("section anchors", () => {
  it("slugifies section titles", () => {
    expect(slugifySectionTitle(" First Section Title! ")).toBe("first-section-title");
  });

  it("keeps duplicate section anchors unique and ordered", () => {
    expect(uniqueSectionAnchors(["Repeat", "Repeat", "Other", "Repeat"])).toEqual([
      "repeat",
      "repeat-2",
      "other",
      "repeat-3"
    ]);
  });

  it("keeps duplicate generic anchors unique and ordered", () => {
    expect(uniqueAnchors(["Practice", "Practice", "Check"], "assessment")).toEqual(["practice", "practice-2", "check"]);
  });

  it("recognizes stable authored assessment ids without slugifying them", () => {
    expect(isAnchorSafeAssessmentId("choice-check-1")).toBe(true);
    expect(isAnchorSafeAssessmentId("Choice Check")).toBe(false);
    expect(isAnchorSafeAssessmentId("choice_check")).toBe(false);
  });
});
