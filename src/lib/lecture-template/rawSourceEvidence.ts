import { readFile } from "node:fs/promises";
import path from "node:path";
import { LECTURES_DIR, repositoryPath } from "./readTemplate";

export const SINGLE_RAW_SOURCE_PATH = "content/raw-lecture.txt";
export const COLLECTION_SHARED_RAW_SOURCE_PATH = "lectures/raw-course.txt";
export const COLLECTION_RAW_SOURCE_FILENAME = "raw-lecture.txt";
export const RAW_SOURCE_PLACEHOLDER = "Add raw source evidence for this lecture here.\n";

// These aliases make the ownership contract easy to discover without creating
// another sentinel that could drift from the scaffold content.
export const RAW_SOURCE_PLACEHOLDER_CONTENT = RAW_SOURCE_PLACEHOLDER;
export const HUMAN_RAW_SOURCE_PLACEHOLDER = RAW_SOURCE_PLACEHOLDER;

export type RawSourceEvidenceStatus = "present" | "missing" | "placeholder";
export type SourceReviewEvidenceRole = "primary" | "shared";

export interface RawSourceFileEvidence {
  sourcePath: string;
  status: RawSourceEvidenceStatus;
  contents?: string;
}

export function collectionRawSourcePath(slug: string): string {
  return path.posix.join(LECTURES_DIR, slug, COLLECTION_RAW_SOURCE_FILENAME);
}

/**
 * Classify an expected raw-source path for repository evidence workflows.
 * Only a missing path is converted to an evidence state; other filesystem
 * failures remain errors so diagnostics cannot silently hide repository bugs.
 */
export async function readRawSourceEvidence(sourcePath: string): Promise<RawSourceFileEvidence> {
  try {
    const contents = await readFile(repositoryPath(sourcePath), "utf8");
    return {
      sourcePath,
      status: contents === RAW_SOURCE_PLACEHOLDER ? "placeholder" : "present",
      ...(contents === RAW_SOURCE_PLACEHOLDER ? {} : { contents })
    };
  } catch (error) {
    if (isMissingPath(error)) return { sourcePath, status: "missing" };
    throw error;
  }
}

export const classifyRawSourceEvidence = readRawSourceEvidence;

function isMissingPath(error: unknown): boolean {
  return error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT";
}
