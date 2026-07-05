import { cp, mkdir, mkdtemp, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { accessSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { isCollectionMode, validateCollection } from "./collection";
import { COURSE_METADATA_PATH } from "./courseMetadata";
import { ACTIVE_TEMPLATE_PATH, repositoryPath } from "./readTemplate";
import { collectionProgressKey, singleLectureProgressKey } from "./progress";
import {
  COLLECTION_SHARED_RAW_SOURCE_PATH,
  SINGLE_RAW_SOURCE_PATH,
  type SourceReviewLecture,
  type SourceReviewSourceEvidence,
  type SourceReviewWorksheet,
  collectionRawSourcePath,
  renderSourceReviewWorksheetMarkdown
} from "./sourceReview";
import type { CourseMetadata, CourseMetadataValidationResult, LectureMetadata, LectureTemplate } from "./types";
import { validateTemplateSource } from "./validateTemplate";
import { formatError } from "./validateCli";

export type ReviewPackageMode = "single-lecture" | "collection";

export interface ReviewPackageSourceRecord {
  templatePath: string;
  packagePath: string;
  contents: string;
}

export interface ReviewPackageCourseMetadataRecord {
  sourcePath: string;
  packagePath: string;
  contents: string;
}

export interface ReviewPackageRawEvidenceRecord {
  sourcePath: string;
  packagePath: string;
  status: "present" | "missing";
  role: "primary" | "shared";
  lectureSlug?: string;
  contents?: string;
}

export interface ReviewPackageRoute {
  route: string;
  outputPath: string;
}

export interface ReviewPackageLecture {
  slug?: string;
  title: string;
  description: string;
  audience: string;
  level: string;
  duration: string;
  sourceTemplatePath: string;
  packageSourcePath: string;
  renderedOutputPath: string;
  sectionCount: number;
}

export interface ReviewPackageValidationOutput {
  command: string;
  status: number;
  stdout: string;
  stderr: string;
}

export type ReviewPackagePreflight =
  | {
      valid: true;
      mode: ReviewPackageMode;
      validation: ReviewPackageValidationOutput;
      lectureCount: number;
      lectures: ReviewPackageLecture[];
      sources: ReviewPackageSourceRecord[];
      courseMetadata?: CourseMetadataValidationResult;
      courseMetadataSource?: ReviewPackageCourseMetadataRecord;
      rawEvidence: ReviewPackageRawEvidenceRecord[];
      routes: ReviewPackageRoute[];
      ignoredInactiveTemplatePaths: string[];
    }
  | {
      valid: false;
      mode: ReviewPackageMode;
      validation: ReviewPackageValidationOutput;
      lectureCount: number;
      lectures: ReviewPackageLecture[];
      sources: ReviewPackageSourceRecord[];
      courseMetadata?: CourseMetadataValidationResult;
      courseMetadataSource?: ReviewPackageCourseMetadataRecord;
      rawEvidence: ReviewPackageRawEvidenceRecord[];
      routes: ReviewPackageRoute[];
      ignoredInactiveTemplatePaths: string[];
    };

export interface ReviewPackageRuntimeMetadata {
  gitCommit: string;
  gitDirtyStatus: string;
  nodeVersion: string;
  npmVersion: string;
}

export interface ReviewPackageManifest {
  createdAt: string;
  projectName: string;
  packageType: "static-review-package";
  sourceMode: ReviewPackageMode;
  validationCommand: string;
  validationResult: "passed";
  exportedRouteCount: number;
  lectureCount: number;
  entryHtmlPath: string;
  packagePath: string;
  contents: {
    renderedPages: string[];
    sourceTemplates: string[];
    courseMetadata: string[];
    rawSourceEvidence: string[];
    reviewerFiles: string[];
  };
  courseMetadata?: CourseMetadata;
  lectures: ReviewPackageLecture[];
  rawEvidence: Omit<ReviewPackageRawEvidenceRecord, "contents">[];
  progressTracking: ReviewPackageProgressTracking;
  ignoredInactiveTemplatePaths: string[];
  gitCommit: string;
  gitDirtyStatus: string;
  nodeVersion: string;
  npmVersion: string;
}

export interface ReviewPackageProgressTracking {
  storageModel: "browser localStorage";
  stateIncludedInPackage: false;
  syncedOrExported: false;
  singleLectureKeyPrefix: string;
  collectionKeyPrefix: string;
  reviewerVerification: string;
}

export interface SourceSnapshotVerification {
  ok: boolean;
  message?: string;
}

export interface CreateManifestOptions {
  createdAt?: Date;
  packagePath?: string;
  runtimeMetadata?: Partial<ReviewPackageRuntimeMetadata>;
}

export interface AssembleReviewPackageOptions extends CreateManifestOptions {
  exportedOutDir: string;
  packagesRoot?: string;
  checklistSourcePath?: string;
}

export interface AssembleReviewPackageResult {
  packageDir: string;
  entryHtmlPath: string;
  manifest: ReviewPackageManifest;
}

const packageType = "static-review-package" as const;
const projectName = "lecture-site-engine";
const validationCommand = "npm run validate";
const reviewerFiles = ["manifest.json", "MANIFEST.md", "README.md", "REVIEW_WORKSHEET.md", "REVIEW_CHECKLIST.md"];

export async function runReviewPackagePreflight(): Promise<ReviewPackagePreflight> {
  if (await isCollectionMode()) {
    return runCollectionPreflight();
  }

  return runSingleLecturePreflight();
}

export async function verifyReviewPackageSourceSnapshot(preflight: ReviewPackagePreflight): Promise<SourceSnapshotVerification> {
  if (!preflight.valid) {
    return {
      ok: false,
      message: "Cannot verify source snapshots for an invalid review-package preflight."
    };
  }

  for (const source of preflight.sources) {
    let currentContents: string;
    try {
      currentContents = await readFile(repositoryPath(source.templatePath), "utf8");
    } catch (error) {
      return {
        ok: false,
        message: `Source template changed after validation: ${source.templatePath} is no longer readable (${formatUnknownError(error)}).`
      };
    }

    if (currentContents !== source.contents) {
      return {
        ok: false,
        message: `Source template changed after validation: ${source.templatePath}. Re-run npm run package:review after saving the final content.`
      };
    }
  }

  if (preflight.courseMetadataSource) {
    let currentContents: string;
    try {
      currentContents = await readFile(repositoryPath(preflight.courseMetadataSource.sourcePath), "utf8");
    } catch (error) {
      return {
        ok: false,
        message: `Course metadata changed after validation: ${preflight.courseMetadataSource.sourcePath} is no longer readable (${formatUnknownError(error)}). Re-run npm run package:review.`
      };
    }

    if (currentContents !== preflight.courseMetadataSource.contents) {
      return {
        ok: false,
        message: `Course metadata changed after validation: ${preflight.courseMetadataSource.sourcePath}. Re-run npm run package:review after saving the final content.`
      };
    }
  }

  for (const source of preflight.rawEvidence) {
    if (source.status === "missing") continue;

    let currentContents: string;
    try {
      currentContents = await readFile(repositoryPath(source.sourcePath), "utf8");
    } catch (error) {
      return {
        ok: false,
        message: `Raw source evidence changed after validation: ${source.sourcePath} is no longer readable (${formatUnknownError(error)}). Re-run npm run package:review.`
      };
    }

    if (currentContents !== source.contents) {
      return {
        ok: false,
        message: `Raw source evidence changed after validation: ${source.sourcePath}. Re-run npm run package:review after saving the final content.`
      };
    }
  }

  return { ok: true };
}

export function createReviewPackageManifest(
  preflight: ReviewPackagePreflight,
  options: CreateManifestOptions = {}
): ReviewPackageManifest {
  if (!preflight.valid) {
    throw new Error("Cannot create a review package manifest from an invalid preflight.");
  }

  const runtimeMetadata = {
    ...getReviewPackageRuntimeMetadata(),
    ...options.runtimeMetadata
  };

  return {
    createdAt: (options.createdAt ?? new Date()).toISOString(),
    projectName,
    packageType,
    sourceMode: preflight.mode,
    validationCommand: preflight.validation.command,
    validationResult: "passed",
    exportedRouteCount: preflight.routes.length,
    lectureCount: preflight.lectureCount,
    entryHtmlPath: "index.html",
    packagePath: options.packagePath ?? "review-packages/<timestamp>-lecture-site",
    contents: {
      renderedPages: preflight.routes.map((route) => route.outputPath),
      sourceTemplates: preflight.sources.map((source) => source.packagePath),
      courseMetadata: preflight.courseMetadataSource ? [preflight.courseMetadataSource.packagePath] : [],
      rawSourceEvidence: preflight.rawEvidence
        .filter((source) => source.status === "present")
        .map((source) => source.packagePath),
      reviewerFiles
    },
    courseMetadata: preflight.courseMetadata?.status === "valid" ? preflight.courseMetadata.metadata : undefined,
    lectures: preflight.lectures,
    rawEvidence: preflight.rawEvidence.map(({ contents: _contents, ...source }) => source),
    progressTracking: createReviewPackageProgressTracking(),
    ignoredInactiveTemplatePaths: preflight.ignoredInactiveTemplatePaths,
    gitCommit: runtimeMetadata.gitCommit,
    gitDirtyStatus: runtimeMetadata.gitDirtyStatus,
    nodeVersion: runtimeMetadata.nodeVersion,
    npmVersion: runtimeMetadata.npmVersion
  };
}

export function renderReviewPackageManifestMarkdown(manifest: ReviewPackageManifest): string {
  const lines = [
    "# Static Review Package Manifest",
    "",
    `Package path: ${manifest.packagePath}`,
    `Entry file: ${manifest.entryHtmlPath}`,
    `Created at: ${manifest.createdAt}`,
    `Project: ${manifest.projectName}`,
    `Mode: ${manifest.sourceMode}`,
    `Validation: ${manifest.validationResult} (${manifest.validationCommand})`,
    `Lectures: ${manifest.lectureCount}`,
    `Exported routes: ${manifest.exportedRouteCount}`,
    `Git commit: ${manifest.gitCommit}`,
    `Working tree: ${manifest.gitDirtyStatus}`,
    `Node.js: ${manifest.nodeVersion}`,
    `npm: ${manifest.npmVersion}`,
    "",
    "## Rendered Pages",
    "",
    ...manifest.contents.renderedPages.map((page) => `- ${page}`),
    "",
    "## Source Templates",
    "",
    ...manifest.contents.sourceTemplates.map((source) => `- ${source}`),
    "",
    "## Course Metadata",
    "",
    ...renderManifestCourseMetadataLines(manifest),
    "",
    "## Raw Source Evidence",
    "",
    ...manifest.rawEvidence.map((source) =>
      `- ${source.sourcePath}: ${source.status}${source.status === "present" ? ` -> ${source.packagePath}` : ""}${
        source.lectureSlug ? ` (${source.lectureSlug}, ${source.role})` : ` (${source.role})`
      }`
    ),
    "",
    "## Progress Tracking",
    "",
    `- Storage model: ${manifest.progressTracking.storageModel}`,
    `- Progress state included in package: ${manifest.progressTracking.stateIncludedInPackage ? "yes" : "no"}`,
    `- Synced or exported: ${manifest.progressTracking.syncedOrExported ? "yes" : "no"}`,
    `- Single lecture key prefix: ${manifest.progressTracking.singleLectureKeyPrefix}`,
    `- Collection key prefix: ${manifest.progressTracking.collectionKeyPrefix}`,
    `- Reviewer verification: ${manifest.progressTracking.reviewerVerification}`,
    "",
    "## Lectures",
    ""
  ];

  for (const lecture of manifest.lectures) {
    lines.push(
      `- ${lecture.slug ? `${lecture.slug}: ` : ""}${lecture.title}`,
      `  Source: ${lecture.sourceTemplatePath}`,
      `  Rendered output: ${lecture.renderedOutputPath}`,
      `  Audience: ${lecture.audience}`,
      `  Level: ${lecture.level}`,
      `  Duration: ${lecture.duration}`,
      `  Sections: ${lecture.sectionCount}`
    );
  }

  if (manifest.ignoredInactiveTemplatePaths.length > 0) {
    lines.push("", "## Ignored Inactive Templates", "", ...manifest.ignoredInactiveTemplatePaths.map((source) => `- ${source}`));
  }

  return `${lines.join("\n")}\n`;
}

function renderManifestCourseMetadataLines(manifest: ReviewPackageManifest): string[] {
  if (!manifest.courseMetadata) {
    return ["No course metadata was declared. Collection labels were inferred."];
  }

  return [
    ...manifest.contents.courseMetadata.map((source) => `- Source: ${source}`),
    `Title: ${manifest.courseMetadata.title}`,
    `Description: ${manifest.courseMetadata.description}`,
    `Audience: ${manifest.courseMetadata.audience ?? "(not specified)"}`,
    `Level: ${manifest.courseMetadata.level ?? "(not specified)"}`,
    `Duration: ${manifest.courseMetadata.duration ?? "(not specified)"}`
  ];
}

export function renderReviewPackageReadme(manifest: ReviewPackageManifest): string {
  return [
    "# Lecture Review Package",
    "",
    "Open `index.html` in a browser to review the rendered lecture experience.",
    "",
    "This folder is self-contained for review. It does not require Node.js, `npm install`, a local static server, or the Next.js development server.",
    "",
    "## Contents",
    "",
    "- `index.html`: rendered entry page.",
    "- `_next/`: static assets used by the rendered pages.",
    "- `source/`: copied active lecture template files.",
    "- `manifest.json`: machine-readable package metadata.",
    "- `MANIFEST.md`: human-readable package metadata.",
    "- `REVIEW_WORKSHEET.md`: source fidelity worksheet. Start here when comparing raw source evidence to rendered output.",
    "- `REVIEW_CHECKLIST.md`: review checklist for educational quality and source fidelity.",
    "",
    "## Progress Tracking",
    "",
    "Learner progress is runtime browser `localStorage` state. It is not included in this package, synced, exported, or shared.",
    "",
    `Expected single-lecture key prefix: \`${manifest.progressTracking.singleLectureKeyPrefix}\``,
    `Expected collection key prefix: \`${manifest.progressTracking.collectionKeyPrefix}\``,
    "",
    "To verify it, open a rendered page in a browser, mark a section complete, and inspect localStorage for the expected key prefix.",
    "",
    `Package path recorded at export time: ${manifest.packagePath}`,
    `Source mode: ${manifest.sourceMode}`,
    manifest.courseMetadata ? `Course title: ${manifest.courseMetadata.title}` : "Course metadata: not declared",
    `Lecture count: ${manifest.lectureCount}`,
    ""
  ].join("\n");
}

function createReviewPackageProgressTracking(): ReviewPackageProgressTracking {
  return {
    storageModel: "browser localStorage",
    stateIncludedInPackage: false,
    syncedOrExported: false,
    singleLectureKeyPrefix: singleLectureProgressKey("<lecture-id>"),
    collectionKeyPrefix: collectionProgressKey("<collection-id>"),
    reviewerVerification: "Toggle a section in the browser and inspect localStorage for the expected key prefix."
  };
}

export function createFilesystemSafeTimestamp(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}-${hours}${minutes}`;
}

export function rewriteExportedHtmlForFileProtocol(html: string, htmlPath: string, packageRoot: string): string {
  let rewritten = html.replace(/\bsrcset=(["'])(.*?)\1/g, (_match, quote: string, value: string) => {
    return `srcset=${quote}${rewriteSrcset(value, htmlPath, packageRoot)}${quote}`;
  });

  rewritten = rewritten.replace(/\b(href|src)=(["'])(.*?)\2/g, (_match, attribute: string, quote: string, value: string) => {
    return `${attribute}=${quote}${rewritePackageUrl(value, htmlPath, packageRoot)}${quote}`;
  });

  return rewritten;
}

export async function assembleReviewPackage(
  preflight: ReviewPackagePreflight,
  options: AssembleReviewPackageOptions
): Promise<AssembleReviewPackageResult> {
  if (!preflight.valid) {
    throw new Error("Cannot assemble a review package from an invalid preflight.");
  }

  const packagesRoot = options.packagesRoot ?? repositoryPath("review-packages");
  const createdAt = options.createdAt ?? new Date();
  const timestamp = createFilesystemSafeTimestamp(createdAt);
  await mkdir(packagesRoot, { recursive: true });

  const finalPackageDir = await choosePackageDirectory(packagesRoot, `${timestamp}-lecture-site`);
  const stagingDir = await mkdtemp(path.join(packagesRoot, `.tmp-${timestamp}-`));

  try {
    await cp(options.exportedOutDir, stagingDir, { recursive: true });
    if (preflight.mode === "single-lecture") {
      await rm(path.join(stagingDir, "lectures"), { recursive: true, force: true });
    }
    await writeCapturedSources(stagingDir, preflight.sources);
    await writeCapturedCourseMetadata(stagingDir, preflight.courseMetadataSource);
    await writeCapturedRawEvidence(stagingDir, preflight.rawEvidence);
    await rewriteHtmlFiles(stagingDir);

    const packagePath = path.relative(process.cwd(), finalPackageDir) || finalPackageDir;
    const manifest = createReviewPackageManifest(preflight, {
      createdAt,
      packagePath,
      runtimeMetadata: options.runtimeMetadata
    });

    await writeFile(path.join(stagingDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    await writeFile(path.join(stagingDir, "MANIFEST.md"), renderReviewPackageManifestMarkdown(manifest), "utf8");
    await writeFile(path.join(stagingDir, "README.md"), renderReviewPackageReadme(manifest), "utf8");
    await writeFile(path.join(stagingDir, "REVIEW_WORKSHEET.md"), renderSourceReviewWorksheetMarkdown(createPackageWorksheet(preflight, manifest)), "utf8");
    await writeFile(path.join(stagingDir, "REVIEW_CHECKLIST.md"), await readReviewChecklist(options.checklistSourcePath), "utf8");

    await rename(stagingDir, finalPackageDir);

    return {
      packageDir: finalPackageDir,
      entryHtmlPath: path.join(finalPackageDir, "index.html"),
      manifest
    };
  } catch (error) {
    await rm(stagingDir, { recursive: true, force: true });
    throw error;
  }
}

export function getReviewPackageRuntimeMetadata(): ReviewPackageRuntimeMetadata {
  return {
    gitCommit: runMetadataCommand("git", ["rev-parse", "HEAD"]),
    gitDirtyStatus: getGitDirtyStatus(),
    nodeVersion: process.version,
    npmVersion: runMetadataCommand("npm", ["--version"])
  };
}

async function runSingleLecturePreflight(): Promise<ReviewPackagePreflight> {
  const templatePath = ACTIVE_TEMPLATE_PATH;

  let source: string;
  try {
    source = await readFile(repositoryPath(templatePath), "utf8");
  } catch (error) {
    return invalidPreflight("single-lecture", {
      command: validationCommand,
      status: 1,
      stdout: "",
      stderr: `Could not validate ${templatePath}: ${formatUnknownError(error)}\n`
    });
  }

  const result = validateTemplateSource(source);
  if (!result.valid) {
    return invalidPreflight("single-lecture", {
      command: validationCommand,
      status: 1,
      stdout: "",
      stderr: [`Invalid lecture template: ${templatePath}`, ...result.errors.map(formatError)].join("\n") + "\n"
    });
  }

  return {
    valid: true,
    mode: "single-lecture",
    validation: {
      command: validationCommand,
      status: 0,
      stdout: `Valid lecture template: ${templatePath}\n`,
      stderr: ""
    },
    lectureCount: 1,
    lectures: [buildLectureRecord(result.template, undefined, templatePath, "source/content/lecture.template.md", "index.html")],
    sources: [
      {
        templatePath,
        packagePath: "source/content/lecture.template.md",
        contents: source
      }
    ],
    rawEvidence: [await captureRawEvidence(SINGLE_RAW_SOURCE_PATH, "source/content/raw-lecture.txt", "primary")],
    routes: [{ route: "/", outputPath: "index.html" }],
    ignoredInactiveTemplatePaths: []
  };
}

async function runCollectionPreflight(): Promise<ReviewPackagePreflight> {
  const collection = await validateCollection();
  const sources: ReviewPackageSourceRecord[] = [];
  const rawEvidence: ReviewPackageRawEvidenceRecord[] = [];
  const lectures: ReviewPackageLecture[] = [];
  let courseMetadataSource: ReviewPackageCourseMetadataRecord | undefined;
  const sharedRawEvidence = await captureRawEvidence(
    COLLECTION_SHARED_RAW_SOURCE_PATH,
    "source/lectures/raw-course.txt",
    "shared"
  );
  rawEvidence.push(sharedRawEvidence);

  for (const result of collection.results) {
    let source: string;
    try {
      source = await readFile(repositoryPath(result.templatePath), "utf8");
    } catch (error) {
      return invalidPreflight("collection", {
        command: validationCommand,
        status: 1,
        stdout: "",
        stderr: `Could not validate collection: ${formatUnknownError(error)}\n`
      }, { courseMetadata: collection.courseMetadata });
    }

    if (!result.valid || !result.template) {
      continue;
    }

    const packageSourcePath = path.posix.join("source", result.templatePath);
    const renderedOutputPath = path.posix.join("lectures", result.slug, "index.html");
    rawEvidence.push(
      await captureRawEvidence(
        collectionRawSourcePath(result.slug),
        path.posix.join("source", "lectures", result.slug, "raw-lecture.txt"),
        "primary",
        result.slug
      )
    );
    sources.push({
      templatePath: result.templatePath,
      packagePath: packageSourcePath,
      contents: source
    });
    lectures.push(buildLectureRecord(result.template, result.slug, result.templatePath, packageSourcePath, renderedOutputPath));
  }

  const validation = buildCollectionPackageValidation(collection);

  if (collection.courseMetadata.status === "valid") {
    courseMetadataSource = {
      sourcePath: COURSE_METADATA_PATH,
      packagePath: "source/lectures/course.yaml",
      contents: await readFile(repositoryPath(COURSE_METADATA_PATH), "utf8")
    };
  }

  if (!collection.allPassed) {
    return {
      valid: false,
      mode: "collection",
      validation,
      lectureCount: collection.lectureCount,
      lectures,
      sources,
      courseMetadata: collection.courseMetadata,
      courseMetadataSource,
      rawEvidence,
      routes: [],
      ignoredInactiveTemplatePaths: activeTemplateExists() ? [ACTIVE_TEMPLATE_PATH] : []
    };
  }

  return {
    valid: true,
    mode: "collection",
    validation,
    lectureCount: lectures.length,
    lectures,
    sources,
    courseMetadata: collection.courseMetadata,
    courseMetadataSource,
    rawEvidence,
    routes: [
      { route: "/", outputPath: "index.html" },
      ...lectures.map((lecture) => ({
        route: `/lectures/${lecture.slug}`,
        outputPath: lecture.renderedOutputPath
      }))
    ],
    ignoredInactiveTemplatePaths: activeTemplateExists() ? [ACTIVE_TEMPLATE_PATH] : []
  };
}

function invalidPreflight(
  mode: ReviewPackageMode,
  validation: ReviewPackageValidationOutput,
  extras: Partial<Pick<Extract<ReviewPackagePreflight, { valid: false }>, "courseMetadata" | "courseMetadataSource">> = {}
): ReviewPackagePreflight {
  return {
    valid: false,
    mode,
    validation,
    lectureCount: 0,
    lectures: [],
    sources: [],
    courseMetadata: extras.courseMetadata,
    courseMetadataSource: extras.courseMetadataSource,
    rawEvidence: [],
    routes: [],
    ignoredInactiveTemplatePaths: []
  };
}

function buildCollectionPackageValidation(collection: Awaited<ReturnType<typeof validateCollection>>): ReviewPackageValidationOutput {
  const lines = [`Collection validation: ${collection.lectureCount} lectures found`, ""];
  if (collection.courseMetadata.status === "valid") {
    lines.push(
      `Course metadata: VALID ${collection.courseMetadata.path}`,
      `  Title: ${collection.courseMetadata.metadata.title}`,
      `  Description: ${collection.courseMetadata.metadata.description}`,
      ""
    );
  } else if (collection.courseMetadata.status === "invalid") {
    lines.push(`Course metadata: INVALID ${collection.courseMetadata.path}`);
    for (const error of collection.courseMetadata.errors) {
      lines.push(`  - ${error.code}: ${error.message}`);
    }
    lines.push("");
  }

  for (const result of collection.results) {
    lines.push(`  [${result.valid ? "PASS" : "FAIL"}] ${result.slug}/lecture.template.md`);
    if (!result.valid) {
      for (const error of result.errors) {
        lines.push(`    - ${error.code}: ${error.message}`);
      }
    }
  }

  const passingCount = collection.results.filter((result) => result.valid).length;
  lines.push("", `${passingCount} of ${collection.lectureCount} lectures passed validation.`);

  return {
    command: validationCommand,
    status: collection.allPassed ? 0 : 1,
    stdout: `${lines.join("\n")}\n`,
    stderr: ""
  };
}

function buildLectureRecord(
  template: LectureTemplate,
  slug: string | undefined,
  sourceTemplatePath: string,
  packageSourcePath: string,
  renderedOutputPath: string
): ReviewPackageLecture {
  return {
    slug,
    title: template.metadata.title,
    description: template.metadata.description,
    audience: template.metadata.audience,
    level: template.metadata.level,
    duration: template.metadata.duration,
    sourceTemplatePath,
    packageSourcePath,
    renderedOutputPath,
    sectionCount: template.sections.length
  };
}

function activeTemplateExists(): boolean {
  try {
    accessSync(repositoryPath(ACTIVE_TEMPLATE_PATH), constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function getGitDirtyStatus(): string {
  const output = runMetadataCommand("git", ["status", "--porcelain"]);
  if (output === "unavailable") return output;
  return output.trim() === "" ? "clean" : "dirty";
}

function runMetadataCommand(command: string, args: string[]): string {
  try {
    const output = execFileSync(command, args, {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    return output === "" ? "unavailable" : output;
  } catch {
    return "unavailable";
  }
}

function rewriteSrcset(value: string, htmlPath: string, packageRoot: string): string {
  return value
    .split(",")
    .map((candidate) => {
      const trimmed = candidate.trim();
      const [url, ...descriptor] = trimmed.split(/\s+/);
      if (!url) return candidate;
      const rewrittenUrl = rewritePackageUrl(url, htmlPath, packageRoot);
      return [rewrittenUrl, ...descriptor].join(" ");
    })
    .join(", ");
}

function rewritePackageUrl(value: string, htmlPath: string, packageRoot: string): string {
  if (!value.startsWith("/") || value.startsWith("//") || shouldPreserveUrl(value)) {
    return value;
  }

  const { pathname, suffix } = splitUrlSuffix(value);
  let targetPath = pathname.replace(/^\/+/, "");

  if (targetPath === "") {
    targetPath = "index.html";
  } else if (targetPath.endsWith("/")) {
    targetPath = `${targetPath}index.html`;
  } else if (targetPath.startsWith("lectures/") && !targetPath.endsWith(".html")) {
    targetPath = `${targetPath}/index.html`;
  }

  const htmlRelativePath = toPosixPath(path.relative(packageRoot, htmlPath));
  const htmlDirectory = path.posix.dirname(htmlRelativePath);
  const relativePath = path.posix.relative(htmlDirectory === "." ? "" : htmlDirectory, targetPath);
  return `${relativePath || path.posix.basename(targetPath)}${suffix}`;
}

function shouldPreserveUrl(value: string): boolean {
  return (
    value.startsWith("#") ||
    /^[a-z][a-z0-9+.-]*:/i.test(value) ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:") ||
    value.startsWith("data:")
  );
}

function splitUrlSuffix(value: string): { pathname: string; suffix: string } {
  const match = value.match(/^([^?#]*)([?#].*)?$/);
  return {
    pathname: match?.[1] ?? value,
    suffix: match?.[2] ?? ""
  };
}

async function writeCapturedSources(packageRoot: string, sources: ReviewPackageSourceRecord[]) {
  for (const source of sources) {
    const destination = path.join(packageRoot, source.packagePath);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, source.contents, "utf8");
  }
}

async function writeCapturedCourseMetadata(packageRoot: string, source?: ReviewPackageCourseMetadataRecord) {
  if (!source) return;
  const destination = path.join(packageRoot, source.packagePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, source.contents, "utf8");
}

async function writeCapturedRawEvidence(packageRoot: string, sources: ReviewPackageRawEvidenceRecord[]) {
  for (const source of sources) {
    if (source.status === "missing") continue;
    const destination = path.join(packageRoot, source.packagePath);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, source.contents ?? "", "utf8");
  }
}

async function captureRawEvidence(
  sourcePath: string,
  packagePath: string,
  role: ReviewPackageRawEvidenceRecord["role"],
  lectureSlug?: string
): Promise<ReviewPackageRawEvidenceRecord> {
  try {
    const contents = await readFile(repositoryPath(sourcePath), "utf8");
    return {
      sourcePath,
      packagePath,
      status: "present",
      role,
      lectureSlug,
      contents
    };
  } catch (error) {
    if (isMissingPath(error)) {
      return {
        sourcePath,
        packagePath,
        status: "missing",
        role,
        lectureSlug
      };
    }
    throw error;
  }
}

function createPackageWorksheet(preflight: Extract<ReviewPackagePreflight, { valid: true }>, manifest: ReviewPackageManifest): SourceReviewWorksheet {
  const sharedSource = preflight.rawEvidence.find((source) => source.role === "shared");
  const lectures: SourceReviewLecture[] = preflight.lectures.map((lecture) => {
    const primarySource = preflight.rawEvidence.find(
      (source) => source.role === "primary" && (lecture.slug ? source.lectureSlug === lecture.slug : source.sourcePath === SINGLE_RAW_SOURCE_PATH)
    );
    const additionalSources = preflight.rawEvidence
      .filter((source) => source.role === "shared" && source.status === "present")
      .map(toSourceReviewEvidence);

    return {
      slug: lecture.slug,
      templatePath: lecture.sourceTemplatePath,
      packageTemplatePath: lecture.packageSourcePath,
      renderedRoute: lecture.slug ? `/lectures/${lecture.slug}` : "/",
      renderedOutputPath: lecture.renderedOutputPath,
      validationStatus: "passed",
      validationErrors: [],
      metadata: {
        title: lecture.title,
        description: lecture.description,
        audience: lecture.audience,
        duration: lecture.duration,
        level: lecture.level as LectureMetadata["level"]
      },
      sectionCount: lecture.sectionCount,
      sectionTitles: [],
      primarySource: toSourceReviewEvidence(
        primarySource ?? {
          sourcePath: lecture.slug ? collectionRawSourcePath(lecture.slug) : SINGLE_RAW_SOURCE_PATH,
          packagePath: lecture.slug ? path.posix.join("source", "lectures", lecture.slug, "raw-lecture.txt") : "source/content/raw-lecture.txt",
          status: "missing",
          role: "primary",
          lectureSlug: lecture.slug
        }
      ),
      additionalSources
    };
  });

  return {
    projectName,
    createdAt: manifest.createdAt,
    mode: preflight.mode,
    validation: {
      command: preflight.validation.command,
      status: preflight.validation.status,
      result: "passed",
      stdout: preflight.validation.stdout,
      stderr: preflight.validation.stderr
    },
    lectureCount: preflight.lectureCount,
    collectionLandingRoute: preflight.mode === "collection" ? "/" : undefined,
    courseMetadata: preflight.courseMetadata,
    sharedSource: sharedSource ? toSourceReviewEvidence(sharedSource) : undefined,
    packageContext: {
      packagePath: manifest.packagePath,
      entryHtmlPath: manifest.entryHtmlPath
    },
    lectures
  };
}

function toSourceReviewEvidence(source: ReviewPackageRawEvidenceRecord): SourceReviewSourceEvidence {
  return {
    sourcePath: source.sourcePath,
    packagePath: source.status === "present" ? source.packagePath : undefined,
    status: source.status,
    role: source.role,
    lectureSlug: source.lectureSlug
  };
}

async function rewriteHtmlFiles(packageRoot: string) {
  const htmlFiles = await collectHtmlFiles(packageRoot);
  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, "utf8");
    await writeFile(htmlFile, rewriteExportedHtmlForFileProtocol(html, htmlFile, packageRoot), "utf8");
  }
}

async function collectHtmlFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const htmlFiles: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      htmlFiles.push(...(await collectHtmlFiles(absolutePath)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      htmlFiles.push(absolutePath);
    }
  }

  return htmlFiles;
}

async function choosePackageDirectory(packagesRoot: string, baseName: string): Promise<string> {
  let candidate = path.join(packagesRoot, baseName);
  let suffix = 2;

  while (await pathExists(candidate)) {
    candidate = path.join(packagesRoot, `${baseName}-${suffix}`);
    suffix += 1;
  }

  return candidate;
}

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await stat(targetPath);
    return true;
  } catch (error) {
    if (error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}

function isMissingPath(error: unknown): boolean {
  return error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT";
}

async function readReviewChecklist(sourcePath?: string): Promise<string> {
  const defaultChecklistPath = repositoryPath("docs/mvp-review-checklist.md");
  const checklistPath = sourcePath ?? defaultChecklistPath;

  try {
    return appendProgressChecklist(await readFile(checklistPath, "utf8"));
  } catch {
    return appendProgressChecklist([
      "# Review Checklist",
      "",
      "- [ ] Open `index.html` directly from the package folder.",
      "- [ ] Confirm the rendered lecture or collection matches the intended source templates.",
      "- [ ] Confirm titles, audience, objectives, sections, and key takeaways are visible.",
      "- [ ] Inspect copied files under `source/` when comparing rendered output with authored content.",
      "- [ ] Record any educational quality, source fidelity, or navigation issues.",
      ""
    ].join("\n"));
  }
}

function appendProgressChecklist(contents: string): string {
  const trimmed = contents.trimEnd();
  return [
    trimmed,
    "",
    "## Runtime Progress Tracking",
    "",
    "- [ ] Toggle an authored section in the browser and confirm the progress bar updates.",
    `- [ ] Inspect browser localStorage for \`${singleLectureProgressKey("<lecture-id>")}\` or \`${collectionProgressKey("<collection-id>")}\`.`,
    "- [ ] Confirm progress state is not included in the review package, source snapshots, or manifest source contents.",
    ""
  ].join("\n");
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join(path.posix.sep);
}

function formatUnknownError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
