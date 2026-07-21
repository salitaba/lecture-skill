import { describe, expect, it } from "vitest";
import { DEFAULT_REVIEW_INTERVALS, dueReviewQueue, isDue, scheduleReview, type ReviewRecord } from "../../src/lib/lecture-template/reviewSchedule";

const now = "2026-07-21T12:00:00.000Z";

describe("review scheduler", () => {
  it("uses the bounded interval sequence for new ratings", () => {
    expect(DEFAULT_REVIEW_INTERVALS).toEqual([0, 1, 3, 7, 14, 30]);
    expect(scheduleReview(undefined, "again", now)).toMatchObject({ status: "learning", repetitions: 0, intervalDays: 0, dueAt: now });
    expect(scheduleReview(undefined, "hard", now)).toMatchObject({ status: "review", repetitions: 1, intervalDays: 1, dueAt: "2026-07-22T12:00:00.000Z" });
    expect(scheduleReview(undefined, "good", now)).toMatchObject({ status: "review", repetitions: 1, intervalDays: 1, dueAt: "2026-07-22T12:00:00.000Z" });
    expect(scheduleReview(undefined, "easy", now)).toMatchObject({ status: "review", repetitions: 1, intervalDays: 3, dueAt: "2026-07-24T12:00:00.000Z" });
  });

  it("applies exact existing-record transitions", () => {
    const previous = { activityKey: "quiz-a", status: "review", repetitions: 2, intervalDays: 3, dueAt: now, lastReviewedAt: now } satisfies ReviewRecord;
    expect(scheduleReview(previous, "again", now)).toMatchObject({ repetitions: 0, intervalDays: 0, status: "learning" });
    expect(scheduleReview(previous, "hard", now)).toMatchObject({ repetitions: 3, intervalDays: 5, dueAt: "2026-07-26T12:00:00.000Z" });
    expect(scheduleReview(previous, "good", now)).toMatchObject({ repetitions: 3, intervalDays: 7, dueAt: "2026-07-28T12:00:00.000Z" });
    expect(scheduleReview(previous, "easy", now)).toMatchObject({ repetitions: 4, intervalDays: 14, dueAt: "2026-08-04T12:00:00.000Z" });
  });

  it("caps easy transitions at thirty days and rejects invalid clocks", () => {
    const previous = { activityKey: "quiz-a", status: "review", repetitions: 30, intervalDays: 30, dueAt: now, lastReviewedAt: now } satisfies ReviewRecord;
    expect(scheduleReview(previous, "easy", now)).toMatchObject({ intervalDays: 30, status: "review" });
    expect(() => scheduleReview(undefined, "good", "not-a-date")).toThrow(RangeError);
  });

  it("clamps rollback transitions without making a future record due early", () => {
    const previous = { activityKey: "quiz-a", status: "review", repetitions: 1, intervalDays: 1, dueAt: "2026-07-22T12:00:00.000Z", lastReviewedAt: "2026-07-22T12:00:00.000Z" } satisfies ReviewRecord;
    const next = scheduleReview(previous, "good", now);
    expect(next.lastReviewedAt).toBe(previous.lastReviewedAt);
    expect(next.dueAt).toBe("2026-07-25T12:00:00.000Z");
    expect(isDue(next, now)).toBe(false);
  });

  it("returns due records in authored order", () => {
    const records: ReviewRecord[] = [
      { activityKey: "second", status: "review", repetitions: 1, intervalDays: 1, dueAt: now, lastReviewedAt: now },
      { activityKey: "first", status: "review", repetitions: 1, intervalDays: 1, dueAt: "2026-07-22T12:00:00.000Z", lastReviewedAt: now }
    ];
    expect(dueReviewQueue(records, ["first", "second"], now).map((record) => record.activityKey)).toEqual(["second"]);
  });
});
