import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { COURSE_METADATA_PATH } from "./courseMetadata";
import { RAW_SOURCE_PLACEHOLDER } from "./rawSourceEvidence";
import { ACTIVE_TEMPLATE_PATH, LECTURES_DIR, repositoryPath } from "./readTemplate";

export type AuthoringMode = "single-lecture" | "collection";

export interface ScaffoldResult {
  ok: boolean;
  mode: AuthoringMode | "new-collection";
  createdPaths: string[];
  message: string;
  nextCommands: string[];
}

const firstLectureSlug = "01-introduction";
const newLectureSlug = "new-lecture";

export async function detectAuthoringMode(): Promise<AuthoringMode> {
  if (await pathExists(LECTURES_DIR)) return "collection";
  return "single-lecture";
}

export async function scaffoldCollection(): Promise<ScaffoldResult> {
  if (await pathExists(LECTURES_DIR)) {
    return {
      ok: false,
      mode: "new-collection",
      createdPaths: [],
      message: "Refusing to create a collection because lectures/ already exists.",
      nextCommands: []
    };
  }

  const lectureDir = path.posix.join(LECTURES_DIR, firstLectureSlug);
  const templatePath = path.posix.join(lectureDir, "lecture.template.md");
  const rawPath = path.posix.join(lectureDir, "raw-lecture.txt");
  const createdPaths = [COURSE_METADATA_PATH, templatePath, rawPath];

  await mkdir(repositoryPath(lectureDir), { recursive: true });
  await writeFile(repositoryPath(COURSE_METADATA_PATH), defaultCourseYaml(), "utf8");
  await writeFile(repositoryPath(templatePath), defaultLectureTemplate("Introduction", "Introduces the course workflow."), "utf8");
  await writeFile(repositoryPath(rawPath), RAW_SOURCE_PLACEHOLDER, "utf8");

  return {
    ok: true,
    mode: "new-collection",
    createdPaths,
    message: "Created a minimal lecture collection scaffold with a raw-source placeholder. Replace it with real human course material before asking an agent to author the lecture or requesting source-fidelity approval.",
    nextCommands: ["npm run validate", "npm run dev", "npm run review:source"]
  };
}

export async function scaffoldLecture(): Promise<ScaffoldResult> {
  const mode = await detectAuthoringMode();
  if (mode === "single-lecture") {
    if (await pathExists(ACTIVE_TEMPLATE_PATH)) {
      return {
        ok: false,
        mode,
        createdPaths: [],
        message: `Refusing to overwrite existing ${ACTIVE_TEMPLATE_PATH}.`,
        nextCommands: []
      };
    }

    await mkdir(repositoryPath(path.posix.dirname(ACTIVE_TEMPLATE_PATH)), { recursive: true });
    await writeFile(repositoryPath(ACTIVE_TEMPLATE_PATH), defaultLectureTemplate("Untitled Lecture", "A placeholder lecture."), "utf8");
    return {
      ok: true,
      mode,
      createdPaths: [ACTIVE_TEMPLATE_PATH],
      message: "Created a single-lecture template scaffold. Add human source evidence before asking an agent to author the lecture.",
      nextCommands: ["npm run validate", "npm run dev", "npm run review:source"]
    };
  }

  const slug = await nextCollectionLectureSlug();
  const lectureDir = path.posix.join(LECTURES_DIR, slug);
  const templatePath = path.posix.join(lectureDir, "lecture.template.md");
  const rawPath = path.posix.join(lectureDir, "raw-lecture.txt");

  await mkdir(repositoryPath(lectureDir), { recursive: false });
  await writeFile(repositoryPath(templatePath), defaultLectureTemplate("New Lecture", "A placeholder collection lecture."), { encoding: "utf8", flag: "wx" });
  await writeFile(repositoryPath(rawPath), RAW_SOURCE_PLACEHOLDER, { encoding: "utf8", flag: "wx" });

  return {
    ok: true,
    mode,
    createdPaths: [templatePath, rawPath],
    message: `Created collection lecture ${slug} with a raw-source placeholder. Replace it with real human course material before asking an agent to author the lecture or requesting source-fidelity approval.`,
    nextCommands: ["npm run validate", "npm run dev", "npm run review:source"]
  };
}

async function nextCollectionLectureSlug(): Promise<string> {
  await mkdir(repositoryPath(LECTURES_DIR), { recursive: true });
  const entries = await readdir(repositoryPath(LECTURES_DIR), { withFileTypes: true });
  const maxOrder = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name.match(/^(\d{2})-/)?.[1])
    .filter((value): value is string => Boolean(value))
    .map((value) => Number.parseInt(value, 10))
    .reduce((max, value) => Math.max(max, value), 0);
  return `${String(maxOrder + 1).padStart(2, "0")}-${newLectureSlug}`;
}

function defaultCourseYaml(): string {
  return [
    'title: "Untitled Course"',
    'description: "A short description of the course."',
    'audience: "Technical learners"',
    'level: "beginner"',
    'duration: "1 hour"',
    ""
  ].join("\n");
}

function defaultLectureTemplate(title: string, description: string): string {
  return [
    "---",
    `title: "${title}"`,
    `description: "${description}"`,
    'audience: "Technical learners"',
    'duration: "30 minutes"',
    'level: "beginner"',
    "---",
    "",
    "## Overview",
    "",
    "Replace this overview with source-grounded lecture context before publishing.",
    "",
    "## Learning Objectives",
    "",
    "- Explain the main idea of this lecture.",
    "",
    "## Section: Main Idea",
    "",
    "Replace this section with the authored lesson content.",
    "",
    "## Key Takeaways",
    "",
    "- Replace this takeaway with a source-grounded summary.",
    ""
  ].join("\n");
}

async function pathExists(relativePath: string): Promise<boolean> {
  try {
    await stat(repositoryPath(relativePath));
    return true;
  } catch (error) {
    if (error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}
