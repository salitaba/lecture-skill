export const DEFAULT_REVIEW_INTERVALS = [0, 1, 3, 7, 14, 30] as const;

export type ReviewRating = "again" | "hard" | "good" | "easy";
export type ReviewStatus = "learning" | "review";

export interface ReviewRecord {
  activityKey: string;
  status: ReviewStatus;
  repetitions: number;
  intervalDays: number;
  dueAt: string;
  lastReviewedAt: string;
}

export interface ReviewQueueItem extends ReviewRecord {
  isDue: true;
}

export function reviewActivityKey(assessmentId: string, responseKey?: string): string {
  return responseKey ? `${assessmentId}:${responseKey}` : assessmentId;
}

export function isDue(record: ReviewRecord, now: string): boolean {
  const nowMs = validTimestamp(now, "now");
  const dueMs = validTimestamp(record.dueAt, "dueAt");
  return nowMs >= dueMs;
}

export function scheduleReview(previous: ReviewRecord | undefined, rating: ReviewRating, now: string, activityKey = previous?.activityKey ?? ""): ReviewRecord {
  const nowMs = validTimestamp(now, "now");
  const baseMs = Math.max(nowMs, previous ? validTimestamp(previous.lastReviewedAt, "lastReviewedAt") : nowMs);
  const base = new Date(baseMs).toISOString();

  if (!previous) {
    if (rating === "again") return record(activityKey, "learning", 0, 0, base, base);
    if (rating === "easy") return record(activityKey, "review", 1, 3, base, addDays(baseMs, 3));
    return record(activityKey, "review", 1, 1, base, addDays(baseMs, 1));
  }

  if (rating === "again") return record(previous.activityKey, "learning", 0, 0, base, base);

  if (rating === "hard") {
    const intervalDays = Math.max(1, Math.ceil(previous.intervalDays * 1.5));
    return record(previous.activityKey, "review", previous.repetitions + 1, intervalDays, base, addDays(baseMs, intervalDays));
  }

  const intervalIndex = Math.min(previous.repetitions + (rating === "easy" ? 2 : 1), DEFAULT_REVIEW_INTERVALS.length - 1);
  const intervalDays = DEFAULT_REVIEW_INTERVALS[intervalIndex] ?? 30;
  return record(previous.activityKey, "review", Math.max(1, previous.repetitions + (rating === "easy" ? 2 : 1)), intervalDays, base, addDays(baseMs, intervalDays));
}

export function dueReviewQueue(records: Iterable<ReviewRecord>, authoredOrder: readonly string[], now: string): ReviewQueueItem[] {
  validTimestamp(now, "now");
  const byKey = new Map(Array.from(records, (record) => [record.activityKey, record]));
  const ordered: ReviewQueueItem[] = [];
  for (const key of authoredOrder) {
    const record = byKey.get(key);
    if (record && isDue(record, now)) ordered.push({ ...record, isDue: true });
  }
  return ordered;
}

function record(activityKey: string, status: ReviewStatus, repetitions: number, intervalDays: number, lastReviewedAt: string, dueAt: string): ReviewRecord {
  return {
    activityKey,
    status,
    repetitions,
    intervalDays,
    dueAt,
    lastReviewedAt
  };
}

function addDays(timestamp: number, days: number): string {
  return new Date(timestamp + days * 24 * 60 * 60 * 1000).toISOString();
}

function validTimestamp(value: string, field: string): number {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp) || !value.includes("T")) {
    throw new RangeError(`${field} must be a valid ISO timestamp.`);
  }
  return timestamp;
}
