import { describe, expect, it } from "vitest";
import {
  calculateCollectionProgress,
  calculateLectureProgress,
  collectionProgressKey,
  progressIdFromCollectionBase,
  progressIdFromTemplatePath,
  sanitizeProgressId,
  singleLectureProgressKey,
  validateCollectionProgress,
  validateLectureProgress
} from "../../src/lib/lecture-template/progress";

describe("progress model helpers", () => {
  const sections = [
    { anchor: "first-topic", title: "First Topic" },
    { anchor: "second-topic", title: "Second Topic" }
  ];

  it("builds exact storage keys and sanitized ids", () => {
    expect(singleLectureProgressKey("content-lecture-template-md")).toBe("lecture-progress:content-lecture-template-md");
    expect(collectionProgressKey("lectures")).toBe("lecture-progress:collection:lectures");
    expect(sanitizeProgressId(" Content/Lecture Template.md ")).toBe("content-lecture-template-md");
    expect(sanitizeProgressId("!!!")).toBe("default");
    expect(progressIdFromTemplatePath("content/lecture.template.md", "Fallback")).toBe("content-lecture-template-md");
    expect(progressIdFromCollectionBase(undefined, "Course Title")).toBe("course-title");
    expect(progressIdFromCollectionBase("lectures", "Course Title")).toBe("lectures-course-title");
    expect(progressIdFromCollectionBase("lectures", "Different Course")).toBe("lectures-different-course");
  });

  it("validates lecture progress without coercing malformed values", () => {
    expect(validateLectureProgress(null, ["first-topic"])).toEqual({});
    expect(validateLectureProgress([], ["first-topic"])).toEqual({});
    expect(validateLectureProgress("bad", ["first-topic"])).toEqual({});
    expect(
      validateLectureProgress(
        {
          "first-topic": true,
          "second-topic": false,
          unknown: true,
          coerced: "true"
        },
        ["first-topic", "second-topic", "coerced"]
      )
    ).toEqual({
      "first-topic": true,
      "second-topic": false
    });
  });

  it("validates collection progress by known slugs and section anchors", () => {
    const progress = validateCollectionProgress(
      {
        intro: { "first-topic": true, unknown: true },
        invalid: { "first-topic": true },
        core: { "core-topic": "yes", "deep-topic": false }
      },
      [
        { slug: "intro", sections },
        { slug: "core", sections: [{ anchor: "core-topic" }, { anchor: "deep-topic" }] }
      ]
    );

    expect(progress).toEqual({
      intro: { "first-topic": true },
      core: { "deep-topic": false }
    });
  });

  it("calculates lecture percentages including empty sections", () => {
    expect(calculateLectureProgress({}, [])).toEqual({
      totalSections: 0,
      completedSections: 0,
      percentComplete: 0
    });
    expect(calculateLectureProgress({ "first-topic": true, "second-topic": false, unknown: true }, sections)).toEqual({
      totalSections: 2,
      completedSections: 1,
      percentComplete: 50
    });
    expect(calculateLectureProgress({ "first-topic": true, "second-topic": true }, sections).percentComplete).toBe(100);
  });

  it("calculates collection totals across lectures", () => {
    expect(
      calculateCollectionProgress(
        {
          intro: { "first-topic": true },
          core: { "core-topic": true, "deep-topic": true }
        },
        [
          { slug: "intro", sections },
          { slug: "core", sections: [{ anchor: "core-topic" }, { anchor: "deep-topic" }] },
          { slug: "empty", sections: [] }
        ]
      )
    ).toEqual({
      totalSections: 4,
      completedSections: 3,
      percentComplete: 75,
      lectures: [
        { slug: "intro", totalSections: 2, completedSections: 1, percentComplete: 50 },
        { slug: "core", totalSections: 2, completedSections: 2, percentComplete: 100 },
        { slug: "empty", totalSections: 0, completedSections: 0, percentComplete: 0 }
      ]
    });
  });
});
