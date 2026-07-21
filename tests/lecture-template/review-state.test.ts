import { describe, expect, it } from "vitest";
import { singleLectureReviewsKey } from "../../src/lib/lecture-template/progress";
import { validateReviewState } from "../../src/lib/lecture-template/reviewState";

describe("review state", () => {
  it("uses a lecture-local namespace and prunes stale or malformed records", () => {
    expect(singleLectureReviewsKey("lectures-01")).toBe("lecture-progress:lectures-01:reviews");
    const state = validateReviewState({
      known: { status: "review", repetitions: 1, intervalDays: 1, dueAt: "2026-07-22T12:00:00.000Z", lastReviewedAt: "2026-07-21T12:00:00.000Z" },
      stale: { status: "review", repetitions: 1, intervalDays: 1, dueAt: "2026-07-22T12:00:00.000Z", lastReviewedAt: "2026-07-21T12:00:00.000Z" },
      badDate: { status: "review", repetitions: 1, intervalDays: 1, dueAt: "bad", lastReviewedAt: "2026-07-21T12:00:00.000Z" },
      badStatus: { status: "learning", repetitions: 1, intervalDays: 0, dueAt: "2026-07-21T12:00:00.000Z", lastReviewedAt: "2026-07-21T12:00:00.000Z" }
    }, ["known"]);
    expect(Object.keys(state)).toEqual(["known"]);
    expect(state.known?.activityKey).toBe("known");
  });

  it("recovers corrupted JSON as empty state", () => {
    expect(validateReviewState(JSON.parse("{}"))).toEqual({});
    expect(validateReviewState(null)).toEqual({});
  });
});
