import type { ReviewRecord, ReviewStatus } from "./reviewSchedule";

export type ReviewState = Record<string, ReviewRecord>;

export function validateReviewState(value: unknown, allowedActivityKeys?: Iterable<string>): ReviewState {
  if (!isPlainRecord(value)) return {};
  const allowed = allowedActivityKeys ? new Set(allowedActivityKeys) : undefined;
  const normalized: ReviewState = {};

  for (const [key, rawRecord] of Object.entries(value)) {
    if (allowed && !allowed.has(key)) continue;
    if (!isPlainRecord(rawRecord)) continue;
    const status = rawRecord.status;
    const repetitions = rawRecord.repetitions;
    const intervalDays = rawRecord.intervalDays;
    const dueAt = rawRecord.dueAt;
    const lastReviewedAt = rawRecord.lastReviewedAt;
    if (!isReviewStatus(status) || typeof repetitions !== "number" || !Number.isInteger(repetitions) || repetitions < 0 || typeof intervalDays !== "number" || !Number.isFinite(intervalDays) || intervalDays < 0) continue;
    if (typeof dueAt !== "string" || !isIsoTimestamp(dueAt) || typeof lastReviewedAt !== "string" || !isIsoTimestamp(lastReviewedAt)) continue;
    if ((status === "learning" && repetitions !== 0) || (status === "review" && repetitions <= 0)) continue;
    normalized[key] = {
      activityKey: key,
      status,
      repetitions,
      intervalDays,
      dueAt: new Date(Date.parse(dueAt)).toISOString(),
      lastReviewedAt: new Date(Date.parse(lastReviewedAt)).toISOString()
    };
  }

  return normalized;
}

export function serializeReviewState(state: ReviewState): string {
  return JSON.stringify(state);
}

function isReviewStatus(value: unknown): value is ReviewStatus {
  return value === "learning" || value === "review";
}

function isIsoTimestamp(value: string): boolean {
  return value.includes("T") && Number.isFinite(Date.parse(value));
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
