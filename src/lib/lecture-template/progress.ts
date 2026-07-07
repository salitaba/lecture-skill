import type { LectureSection } from "./types";

export type LectureProgress = Record<string, boolean>;
export type CollectionProgress = Record<string, LectureProgress>;

export interface ProgressSection {
  anchor: string;
  title?: string;
}

export interface ProgressLecture {
  slug: string;
  sections: ProgressSection[];
}

export interface LectureProgressSummary {
  totalSections: number;
  completedSections: number;
  percentComplete: number;
}

export interface CollectionLectureProgressSummary extends LectureProgressSummary {
  slug: string;
}

export interface CollectionProgressSummary extends LectureProgressSummary {
  lectures: CollectionLectureProgressSummary[];
}

export interface AnswerAttempt {
  selected: string;
  correct: boolean;
}

export type AnswerAttempts = Record<string, AnswerAttempt>;

export interface Highlight {
  id: string;
  sectionAnchor: string;
  blockIndex: number;
  start: number;
  end: number;
  snippet: string;
}

export interface Annotations {
  highlights: Highlight[];
  notes: Record<string, string>;
}

export function highlightId(sectionAnchor: string, blockIndex: number, start: number, end: number): string {
  return `${sectionAnchor}:${blockIndex}:${start}:${end}`;
}

export function singleLectureProgressKey(lectureId: string): string {
  return `lecture-progress:${lectureId}`;
}

export function singleLectureAnswersKey(lectureId: string): string {
  return `lecture-progress:${lectureId}:answers`;
}

export function singleLectureAnnotationsKey(lectureId: string): string {
  return `lecture-progress:${lectureId}:annotations`;
}

export function collectionProgressKey(collectionId: string): string {
  return `lecture-progress:collection:${collectionId}`;
}

export function sanitizeProgressId(value: string): string {
  const sanitized = value
    .trim()
    .toLowerCase()
    .replace(/\\/g, "/")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return sanitized || "default";
}

export function progressIdFromTemplatePath(templatePath: string, fallbackTitle: string): string {
  return sanitizeProgressId(templatePath || fallbackTitle);
}

export function progressIdFromCollectionBase(basePath: string | undefined, fallbackTitle: string | undefined): string {
  if (basePath && fallbackTitle) return sanitizeProgressId(`${basePath}-${fallbackTitle}`);
  return sanitizeProgressId(basePath || fallbackTitle || "default");
}

export function validateLectureProgress(value: unknown, allowedAnchors: Iterable<string>): LectureProgress {
  if (!isPlainRecord(value)) return {};

  const allowed = new Set(allowedAnchors);
  const normalized: LectureProgress = {};

  for (const [anchor, completed] of Object.entries(value)) {
    if (!allowed.has(anchor) || typeof completed !== "boolean") continue;
    normalized[anchor] = completed;
  }

  return normalized;
}

export function validateAnswerAttempts(value: unknown): AnswerAttempts {
  if (!isPlainRecord(value)) return {};

  const normalized: AnswerAttempts = {};

  for (const [key, attempt] of Object.entries(value)) {
    if (!isPlainRecord(attempt)) continue;
    if (typeof attempt.selected !== "string" || typeof attempt.correct !== "boolean") continue;
    normalized[key] = { selected: attempt.selected, correct: attempt.correct };
  }

  return normalized;
}

export function validateAnnotations(value: unknown): Annotations {
  if (!isPlainRecord(value)) return { highlights: [], notes: {} };

  const highlights: Highlight[] = Array.isArray(value.highlights) ? value.highlights.filter(isValidHighlight) : [];
  const notes: Record<string, string> = {};

  if (isPlainRecord(value.notes)) {
    for (const [anchor, note] of Object.entries(value.notes)) {
      if (typeof note === "string" && note.trim() !== "") notes[anchor] = note;
    }
  }

  return { highlights, notes };
}

function isValidHighlight(value: unknown): value is Highlight {
  if (!isPlainRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.sectionAnchor === "string" &&
    typeof value.blockIndex === "number" &&
    typeof value.start === "number" &&
    typeof value.end === "number" &&
    typeof value.snippet === "string"
  );
}

export function validateCollectionProgress(value: unknown, lectures: ProgressLecture[]): CollectionProgress {
  if (!isPlainRecord(value)) return {};

  const lectureMap = new Map(lectures.map((lecture) => [lecture.slug, lecture.sections.map((section) => section.anchor)]));
  const normalized: CollectionProgress = {};

  for (const [slug, lectureValue] of Object.entries(value)) {
    const anchors = lectureMap.get(slug);
    if (!anchors) continue;
    const lectureProgress = validateLectureProgress(lectureValue, anchors);
    if (Object.keys(lectureProgress).length > 0) normalized[slug] = lectureProgress;
  }

  return normalized;
}

export function calculateLectureProgress(progress: LectureProgress, sections: ProgressSection[] | LectureSection[]): LectureProgressSummary {
  const totalSections = sections.length;
  const completedSections = sections.reduce((count, section) => count + (progress[section.anchor] === true ? 1 : 0), 0);

  return {
    totalSections,
    completedSections,
    percentComplete: calculatePercent(completedSections, totalSections)
  };
}

export function calculateCollectionProgress(progress: CollectionProgress, lectures: ProgressLecture[]): CollectionProgressSummary {
  const lectureSummaries = lectures.map((lecture) => ({
    slug: lecture.slug,
    ...calculateLectureProgress(progress[lecture.slug] ?? {}, lecture.sections)
  }));
  const totalSections = lectureSummaries.reduce((sum, lecture) => sum + lecture.totalSections, 0);
  const completedSections = lectureSummaries.reduce((sum, lecture) => sum + lecture.completedSections, 0);

  return {
    totalSections,
    completedSections,
    percentComplete: calculatePercent(completedSections, totalSections),
    lectures: lectureSummaries
  };
}

function calculatePercent(completedSections: number, totalSections: number): number {
  if (totalSections <= 0) return 0;
  return Math.round((completedSections / totalSections) * 100);
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
