import { access, readdir } from "node:fs/promises";
import path from "node:path";
import { LECTURES_DIR as SHARED_LECTURES_DIR, readLectureEntry as readLectureTemplateEntry, repositoryPath } from "./readTemplate";
import { readCourseMetadata } from "./courseMetadata";
import { parseLectureTemplate } from "./parseTemplate";
import { validateTemplateSource } from "./validateTemplate";
import { collectLectureAssessments, type AssessmentSummary } from "./assessments";
import { progressIdFromTemplatePath } from "./progress";
import type {
  CollectionValidationResult,
  LectureCollection,
  LectureCollectionEntry,
  LectureLevel,
  LectureTemplate,
  LectureValidationResult
} from "./types";

export interface CollectionReviewRegistryEntry {
  slug: string;
  lectureId: string;
  order: number;
  title: string;
  objectives: NonNullable<LectureTemplate>["objectives"];
  assessments: AssessmentSummary[];
  sections: Array<{ anchor: string; title: string }>;
}

export function buildCollectionReviewRegistry(validation: CollectionValidationResult): CollectionReviewRegistryEntry[] {
  return validation.results
    .filter((result): result is LectureValidationResult & { template: LectureTemplate } => result.valid && Boolean(result.template))
    .map((result, index) => ({
      slug: result.slug,
      lectureId: progressIdFromTemplatePath(result.templatePath, result.template.metadata.title),
      order: collectionOrder(result.slug, index),
      title: result.template.metadata.title,
      objectives: result.template.objectives,
      assessments: collectLectureAssessments(result.template, result.slug),
      sections: result.template.sections.map((section) => ({ anchor: section.anchor, title: section.title }))
    }))
    .sort((left, right) => left.order - right.order || left.slug.localeCompare(right.slug));
}

function collectionOrder(slug: string, fallback: number): number {
  const match = slug.match(/^(\d+)/);
  return match ? Number.parseInt(match[1] ?? "", 10) : fallback;
}

export const LECTURES_DIR = SHARED_LECTURES_DIR;

export async function isCollectionMode(): Promise<boolean> {
  const entries = await collectLectureEntries(false);
  return entries.length > 0;
}

export interface ScanLectureCollectionOptions {
  logSkippedDirectories?: boolean;
}

export async function scanLectureCollection(options: ScanLectureCollectionOptions = {}): Promise<LectureCollection> {
  const [entries, courseMetadata] = await Promise.all([
    collectLectureEntries(options.logSkippedDirectories ?? true),
    readCourseMetadata()
  ]);
  return {
    basePath: LECTURES_DIR,
    entries,
    courseMetadata
  };
}

export async function readLectureEntry(entry: LectureCollectionEntry): Promise<string> {
  return readLectureTemplateEntry(entry);
}

export async function validateCollection(options: ScanLectureCollectionOptions = {}): Promise<CollectionValidationResult> {
  const collection = await scanLectureCollection(options);
  const results: LectureValidationResult[] = [];

  for (const entry of collection.entries) {
    const source = await readLectureEntry(entry);
    const validation = validateTemplateSource(source);
    const template = validation.valid ? validation.template : buildLecturePreviewTemplate(parseLectureTemplate(source));

    results.push({
      slug: entry.slug,
      templatePath: entry.templatePath,
      valid: validation.valid,
      errors: validation.valid ? [] : validation.errors,
      template
    });
  }

  const firstAssessmentById = new Map<string, { slug: string; templatePath: string; locator?: { line?: number } }>();
  for (const result of results) {
    if (!result.valid || !result.template) continue;
    for (const assessment of collectLectureAssessments(result.template, result.slug)) {
      const previous = firstAssessmentById.get(assessment.id);
      if (previous) {
        result.valid = false;
        result.errors.push({
          code: "DUPLICATE_ASSESSMENT_ID",
          message: `Assessment registry id "${assessment.id}" is declared by ${previous.templatePath}${formatLine(previous.locator?.line)} and ${result.templatePath}${formatLine(assessment.sourceLocator?.line)}.`,
          locator: assessment.sourceLocator,
          field: "id",
          sectionTitle: assessment.sectionTitle,
          componentType: assessment.type,
          hint: "Use a unique id across the collection, or change the generated assessment title/section so registry ids do not collide."
        });
      } else {
        firstAssessmentById.set(assessment.id, { slug: result.slug, templatePath: result.templatePath, locator: assessment.sourceLocator });
      }
    }
  }

  return {
    lectureCount: results.length,
    results,
    courseMetadata: collection.courseMetadata,
    allPassed: results.every((result) => result.valid) && collection.courseMetadata.status !== "invalid"
  };
}

function formatLine(line: number | undefined): string {
  return line === undefined ? "" : `:${line}`;
}

async function collectLectureEntries(logSkippedDirectories: boolean): Promise<LectureCollectionEntry[]> {
  try {
    const entries = await readdir(repositoryPath(LECTURES_DIR), { withFileTypes: true });
    const lectureEntries: LectureCollectionEntry[] = [];

    for (const dirent of entries) {
      if (!dirent.isDirectory()) continue;

      const match = dirent.name.match(/^(\d{2})-(.+)$/);
      if (!match) {
        if (logSkippedDirectories) {
          console.warn(`Skipping lecture directory "${dirent.name}" because it does not match NN-slug naming.`);
        }
        continue;
      }

      const order = Number.parseInt(match[1] ?? "", 10);
      const templatePath = path.posix.join(LECTURES_DIR, dirent.name, "lecture.template.md");

      try {
        await access(repositoryPath(templatePath));
      } catch {
        continue;
      }

      lectureEntries.push({
        slug: dirent.name,
        order,
        templatePath
      });
    }

    lectureEntries.sort((left, right) => left.order - right.order || left.slug.localeCompare(right.slug));
    return lectureEntries;
  } catch (error) {
    if (isMissingDirectory(error)) return [];
    throw error;
  }
}

export function buildLecturePreviewTemplate(parsed: ReturnType<typeof parseLectureTemplate>): LectureTemplate {
  return {
    metadata: {
      title: stringValue(parsed.frontmatter.value.title),
      description: stringValue(parsed.frontmatter.value.description),
      audience: stringValue(parsed.frontmatter.value.audience),
      duration: stringValue(parsed.frontmatter.value.duration),
      level: stringValue(parsed.frontmatter.value.level) as LectureLevel
    },
    overview: [],
    objectives: [],
    sections: parsed.sections.map((section) => ({
      title: section.title.trim(),
      anchor: section.anchor,
      blocks: []
    })),
    takeaways: []
  };
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isMissingDirectory(error: unknown): boolean {
  return error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT";
}
