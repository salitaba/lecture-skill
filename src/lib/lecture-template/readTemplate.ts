import { readFile } from "node:fs/promises";
import path from "node:path";
import type { LectureCollectionEntry } from "./types";

export const ACTIVE_TEMPLATE_PATH = "content/lecture.template.md";
export const LECTURES_DIR = "lectures";

export function repositoryPath(relativePath: string): string {
  if (process.env.LECTURE_CONTENT_ROOT) {
    return path.join(process.env.LECTURE_CONTENT_ROOT, relativePath);
  }
  return path.join(/*turbopackIgnore: true*/ process.cwd(), relativePath);
}

export async function readActiveTemplate(): Promise<string> {
  return readFile(repositoryPath(ACTIVE_TEMPLATE_PATH), "utf8");
}

export async function readLectureEntry(entry: LectureCollectionEntry): Promise<string> {
  return readFile(repositoryPath(entry.templatePath), "utf8");
}
