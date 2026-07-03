import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildLecturePreviewTemplate, isCollectionMode, scanLectureCollection } from "./collection";
import { parseLectureTemplate } from "./parseTemplate";
import { ACTIVE_TEMPLATE_PATH, LECTURES_DIR, repositoryPath } from "./readTemplate";
import type { LectureMetadata, LectureTemplate, ValidationError } from "./types";
import { formatError } from "./validateCli";
import { validateTemplateSource } from "./validateTemplate";

export const SINGLE_RAW_SOURCE_PATH = "content/raw-lecture.txt";
export const SINGLE_TEMPLATE_PATH = ACTIVE_TEMPLATE_PATH;
export const COLLECTION_SHARED_RAW_SOURCE_PATH = "lectures/raw-course.txt";
export const COLLECTION_RAW_SOURCE_FILENAME = "raw-lecture.txt";
export const SOURCE_REVIEW_WORKSHEET_DIR = "docs/review-worksheets";

export type SourceReviewMode = "single-lecture" | "collection";
export type SourceEvidenceStatus = "present" | "missing";
export type SourceReviewValidationStatus = "passed" | "failed";
export type SourceReviewEvidenceRole = "primary" | "shared";

export interface SourceReviewSourceEvidence {
  sourcePath: string;
  status: SourceEvidenceStatus;
  role: SourceReviewEvidenceRole;
  lectureSlug?: string;
  packagePath?: string;
}

export interface SourceReviewValidation {
  command: string;
  status: number;
  result: SourceReviewValidationStatus;
  stdout: string;
  stderr: string;
}

export interface SourceReviewPackageContext {
  packagePath: string;
  entryHtmlPath: string;
}

export interface SourceReviewLecture {
  slug?: string;
  templatePath: string;
  packageTemplatePath?: string;
  renderedRoute: string;
  renderedOutputPath?: string;
  validationStatus: SourceReviewValidationStatus;
  validationErrors: ValidationError[];
  metadata?: LectureMetadata;
  sectionCount: number;
  sectionTitles: string[];
  primarySource: SourceReviewSourceEvidence;
  additionalSources: SourceReviewSourceEvidence[];
}

export interface SourceReviewWorksheet {
  projectName: string;
  createdAt: string;
  mode: SourceReviewMode;
  validation: SourceReviewValidation;
  lectureCount: number;
  collectionLandingRoute?: string;
  sharedSource?: SourceReviewSourceEvidence;
  packageContext?: SourceReviewPackageContext;
  lectures: SourceReviewLecture[];
}

export interface CreateSourceReviewWorksheetOptions {
  createdAt?: Date;
  packageContext?: SourceReviewPackageContext;
}

export interface WriteSourceReviewWorksheetOptions extends CreateSourceReviewWorksheetOptions {
  worksheetDir?: string;
}

export interface WriteSourceReviewWorksheetResult {
  worksheet: SourceReviewWorksheet;
  worksheetPath: string;
}

const projectName = "lecture-site-engine";
const validationCommand = "npm run validate";

export async function createSourceReviewWorksheet(
  options: CreateSourceReviewWorksheetOptions = {}
): Promise<SourceReviewWorksheet> {
  const createdAt = (options.createdAt ?? new Date()).toISOString();
  if (await isCollectionMode()) {
    return createCollectionWorksheet(createdAt, options.packageContext);
  }

  return createSingleLectureWorksheet(createdAt, options.packageContext);
}

export async function writeSourceReviewWorksheet(
  options: WriteSourceReviewWorksheetOptions = {}
): Promise<WriteSourceReviewWorksheetResult> {
  const worksheet = await createSourceReviewWorksheet(options);
  const worksheetDir = options.worksheetDir ?? SOURCE_REVIEW_WORKSHEET_DIR;
  const worksheetPath = path.posix.join(worksheetDir, `${createFilesystemSafeTimestamp(new Date(worksheet.createdAt))}-source-fidelity-review.md`);
  await mkdir(repositoryPath(worksheetDir), { recursive: true });
  await writeFile(repositoryPath(worksheetPath), renderSourceReviewWorksheetMarkdown(worksheet), "utf8");
  return { worksheet, worksheetPath };
}

export function createFilesystemSafeTimestamp(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}-${hours}${minutes}`;
}

export function renderSourceReviewWorksheetMarkdown(worksheet: SourceReviewWorksheet): string {
  const lines = [
    "# Source Fidelity Review Worksheet",
    "",
    `Project: ${worksheet.projectName}`,
    `Created at: ${worksheet.createdAt}`,
    `Source mode: ${worksheet.mode}`,
    `Validation command: ${worksheet.validation.command}`,
    `Validation result: ${worksheet.validation.result}`,
    `Lecture count: ${worksheet.lectureCount}`
  ];

  if (worksheet.packageContext) {
    lines.push(`Package path: ${worksheet.packageContext.packagePath}`, `Package entry HTML: ${worksheet.packageContext.entryHtmlPath}`);
  }

  if (worksheet.mode === "collection") {
    lines.push(`Collection landing route: ${worksheet.collectionLandingRoute ?? "/"}`);
    if (worksheet.sharedSource) {
      lines.push(`Shared raw course source: ${formatEvidence(worksheet.sharedSource)}`);
    }
  }

  lines.push("", "## Validation Output", "");
  if (worksheet.validation.stdout.trim()) {
    lines.push("```text", worksheet.validation.stdout.trimEnd(), "```", "");
  }
  if (worksheet.validation.stderr.trim()) {
    lines.push("```text", worksheet.validation.stderr.trimEnd(), "```", "");
  }
  if (!worksheet.validation.stdout.trim() && !worksheet.validation.stderr.trim()) {
    lines.push("No validation output was recorded.", "");
  }

  if (worksheet.mode === "single-lecture") {
    lines.push("## Lecture Review", "");
    appendLectureSection(lines, worksheet.lectures[0]);
  } else {
    lines.push("## Collection Review", "");
    for (const lecture of worksheet.lectures) {
      lines.push(`### ${lecture.slug ?? lecture.metadata?.title ?? lecture.templatePath}`, "");
      appendLectureSection(lines, lecture);
    }
  }

  return `${lines.join("\n")}\n`;
}

export function collectMissingPrimarySourcePaths(worksheet: SourceReviewWorksheet): string[] {
  return worksheet.lectures
    .map((lecture) => lecture.primarySource)
    .filter((source) => source.status === "missing")
    .map((source) => source.sourcePath);
}

export function collectionRawSourcePath(slug: string): string {
  return path.posix.join(LECTURES_DIR, slug, COLLECTION_RAW_SOURCE_FILENAME);
}

async function createSingleLectureWorksheet(
  createdAt: string,
  packageContext?: SourceReviewPackageContext
): Promise<SourceReviewWorksheet> {
  const lecture = await buildLecture(SINGLE_TEMPLATE_PATH, "/", await readEvidence(SINGLE_RAW_SOURCE_PATH, "primary"));
  const validation = buildSingleValidation(lecture);

  return {
    projectName,
    createdAt,
    mode: "single-lecture",
    validation,
    lectureCount: 1,
    packageContext,
    lectures: [lecture]
  };
}

async function createCollectionWorksheet(
  createdAt: string,
  packageContext?: SourceReviewPackageContext
): Promise<SourceReviewWorksheet> {
  const collection = await scanLectureCollection();
  const sharedSource = await readEvidence(COLLECTION_SHARED_RAW_SOURCE_PATH, "shared");
  const lectures: SourceReviewLecture[] = [];

  for (const entry of collection.entries) {
    const primarySource = await readEvidence(collectionRawSourcePath(entry.slug), "primary", entry.slug);
    const lecture = await buildLecture(entry.templatePath, `/lectures/${entry.slug}`, primarySource, {
      slug: entry.slug,
      additionalSources: sharedSource.status === "present" ? [{ ...sharedSource }] : []
    });
    lectures.push(lecture);
  }

  return {
    projectName,
    createdAt,
    mode: "collection",
    validation: buildCollectionValidation(lectures),
    lectureCount: lectures.length,
    collectionLandingRoute: "/",
    sharedSource,
    packageContext,
    lectures
  };
}

async function buildLecture(
  templatePath: string,
  renderedRoute: string,
  primarySource: SourceReviewSourceEvidence,
  options: { slug?: string; additionalSources?: SourceReviewSourceEvidence[] } = {}
): Promise<SourceReviewLecture> {
  let source: string;
  try {
    source = await readFile(repositoryPath(templatePath), "utf8");
  } catch (error) {
    return {
      slug: options.slug,
      templatePath,
      renderedRoute,
      validationStatus: "failed",
      validationErrors: [
        {
          code: "TEMPLATE_READ_FAILED",
          message: `Could not read ${templatePath}: ${formatUnknownError(error)}`
        }
      ],
      sectionCount: 0,
      sectionTitles: [],
      primarySource,
      additionalSources: options.additionalSources ?? []
    };
  }

  const validation = validateTemplateSource(source);
  const template = validation.valid ? validation.template : buildLecturePreviewTemplate(parseLectureTemplate(source));

  return {
    slug: options.slug,
    templatePath,
    renderedRoute,
    validationStatus: validation.valid ? "passed" : "failed",
    validationErrors: validation.valid ? [] : validation.errors,
    metadata: template.metadata,
    sectionCount: template.sections.length,
    sectionTitles: template.sections.map((section) => section.title),
    primarySource,
    additionalSources: options.additionalSources ?? []
  };
}

async function readEvidence(
  sourcePath: string,
  role: SourceReviewEvidenceRole,
  lectureSlug?: string
): Promise<SourceReviewSourceEvidence> {
  try {
    await access(repositoryPath(sourcePath));
    return { sourcePath, status: "present", role, lectureSlug };
  } catch {
    return { sourcePath, status: "missing", role, lectureSlug };
  }
}

function buildSingleValidation(lecture: SourceReviewLecture): SourceReviewValidation {
  if (lecture.validationStatus === "passed") {
    return {
      command: validationCommand,
      status: 0,
      result: "passed",
      stdout: `Valid lecture template: ${lecture.templatePath}\n`,
      stderr: ""
    };
  }

  return {
    command: validationCommand,
    status: 1,
    result: "failed",
    stdout: "",
    stderr: [`Invalid lecture template: ${lecture.templatePath}`, ...lecture.validationErrors.map(formatError)].join("\n") + "\n"
  };
}

function buildCollectionValidation(lectures: SourceReviewLecture[]): SourceReviewValidation {
  const lines = [`Collection validation: ${lectures.length} lectures found`, ""];
  for (const lecture of lectures) {
    lines.push(`  [${lecture.validationStatus === "passed" ? "PASS" : "FAIL"}] ${lecture.slug}/lecture.template.md`);
    for (const error of lecture.validationErrors) {
      lines.push(`    - ${error.code}: ${error.message}`);
    }
  }

  const passingCount = lectures.filter((lecture) => lecture.validationStatus === "passed").length;
  lines.push("", `${passingCount} of ${lectures.length} lectures passed validation.`);

  return {
    command: validationCommand,
    status: passingCount === lectures.length ? 0 : 1,
    result: passingCount === lectures.length ? "passed" : "failed",
    stdout: `${lines.join("\n")}\n`,
    stderr: ""
  };
}

function appendLectureSection(lines: string[], lecture: SourceReviewLecture) {
  lines.push(
    `Template path: ${lecture.templatePath}`,
    `Rendered route: ${lecture.renderedRoute}`,
    `Validation result: ${lecture.validationStatus}`,
    `Primary raw source: ${formatEvidence(lecture.primarySource)}`,
    ...lecture.additionalSources.map((source) => `Additional source: ${formatEvidence(source)}`)
  );
  if (lecture.packageTemplatePath) lines.push(`Package template path: ${lecture.packageTemplatePath}`);
  if (lecture.renderedOutputPath) lines.push(`Rendered output path: ${lecture.renderedOutputPath}`);
  lines.push("");

  if (lecture.metadata) {
    lines.push(
      "### Lecture Metadata",
      "",
      `Title: ${lecture.metadata.title || "(missing)"}`,
      `Description: ${lecture.metadata.description || "(missing)"}`,
      `Audience: ${lecture.metadata.audience || "(missing)"}`,
      `Duration: ${lecture.metadata.duration || "(missing)"}`,
      `Level: ${lecture.metadata.level || "(missing)"}`,
      `Section count: ${lecture.sectionCount}`,
      ""
    );
  } else {
    lines.push("### Lecture Metadata", "", "Metadata could not be parsed from the template.", "");
  }

  if (lecture.sectionTitles.length > 0) {
    lines.push("Section titles:", ...lecture.sectionTitles.map((title) => `- ${title || "(empty title)"}`), "");
  }

  if (lecture.validationStatus === "failed") {
    lines.push(
      "**Approval status:** Not ready for source fidelity approval until validation passes.",
      "",
      "Validation errors:",
      ...lecture.validationErrors.map((error) => `- ${error.code}: ${error.message}`),
      ""
    );
  }

  lines.push(
    "### Reviewer Fields",
    "",
    "Reviewer name:",
    "Review date:",
    "",
    "### Source Fidelity Checklist",
    "",
    ...sourceFidelityChecklist.map((item) => `- [ ] Pass / [ ] Fail / [ ] Needs revision - ${item}`),
    "",
    "### Educational Quality Review",
    "",
    "- [ ] Pass / [ ] Fail / [ ] Needs revision - The lecture is clear, useful, and appropriate for the stated audience.",
    "- [ ] Pass / [ ] Fail / [ ] Needs revision - The pacing, examples, and section order support the learning objectives.",
    "",
    "### Rendered Output Inspection",
    "",
    "- [ ] Pass / [ ] Fail / [ ] Needs revision - The rendered page matches the generated template metadata and section order.",
    "- [ ] Pass / [ ] Fail / [ ] Needs revision - Navigation, components, code blocks, and responsive layout are usable.",
    "",
    "Source fidelity concerns:",
    "",
    "Educational quality concerns:",
    "",
    "Rendered-output inspection notes:",
    "",
    "Required revisions:",
    "",
    "Overall result: [ ] Pass / [ ] Fail / [ ] Needs revision",
    ""
  );
}

function formatEvidence(source: SourceReviewSourceEvidence): string {
  const packagePath = source.packagePath ? ` -> ${source.packagePath}` : "";
  return source.status === "present" ? `${source.sourcePath} (present${packagePath})` : `${source.sourcePath} (missing)`;
}

function formatUnknownError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

const sourceFidelityChecklist = [
  "Every major claim in the generated lecture is supported by the listed raw source.",
  "Important examples from the source are preserved unless omitted for clear concision.",
  "Important caveats, limitations, warnings, or uncertainties are preserved.",
  "The generated lecture does not add unsupported tools, statistics, promises, references, or implementation details.",
  "Rewording and reordering do not change the source meaning.",
  "Learning objectives are supported by the source and reflected in the lecture sections.",
  "Components clarify source material and do not introduce unsupported concepts.",
  "Key takeaways recap source-grounded practical lessons."
];
