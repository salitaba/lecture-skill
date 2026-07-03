import { access, readdir } from "node:fs/promises";
import path from "node:path";
import { LECTURES_DIR as SHARED_LECTURES_DIR, readLectureEntry as readLectureTemplateEntry, repositoryPath } from "./readTemplate";
import { parseLectureTemplate } from "./parseTemplate";
import { validateTemplateSource } from "./validateTemplate";
import type {
  CollectionValidationResult,
  LectureCollection,
  LectureCollectionEntry,
  LectureLevel,
  LectureTemplate,
  LectureValidationResult
} from "./types";

export const LECTURES_DIR = SHARED_LECTURES_DIR;

export async function isCollectionMode(): Promise<boolean> {
  const entries = await collectLectureEntries(false);
  return entries.length > 0;
}

export async function scanLectureCollection(): Promise<LectureCollection> {
  const entries = await collectLectureEntries(true);
  return {
    basePath: LECTURES_DIR,
    entries
  };
}

export async function readLectureEntry(entry: LectureCollectionEntry): Promise<string> {
  return readLectureTemplateEntry(entry);
}

export async function validateCollection(): Promise<CollectionValidationResult> {
  const collection = await scanLectureCollection();
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

  return {
    lectureCount: results.length,
    results,
    allPassed: results.every((result) => result.valid)
  };
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

function buildLecturePreviewTemplate(parsed: ReturnType<typeof parseLectureTemplate>): LectureTemplate {
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
