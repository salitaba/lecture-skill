import { execFileSync } from "node:child_process";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { validateCollection } from "./collection";
import { COURSE_METADATA_PATH } from "./courseMetadata";
import { detectAuthoringMode } from "./scaffold";
import {
  COLLECTION_SHARED_RAW_SOURCE_PATH,
  SINGLE_RAW_SOURCE_PATH,
  SOURCE_REVIEW_WORKSHEET_DIR
} from "./sourceReview";
import { collectionRawSourcePath, readRawSourceEvidence, type RawSourceEvidenceStatus } from "./rawSourceEvidence";
import { ACTIVE_TEMPLATE_PATH, repositoryPath } from "./readTemplate";
import { collectionProgressKey, singleLectureProgressKey } from "./progress";
import { validateTemplateSource } from "./validateTemplate";
import type { CourseMetadataValidationResult } from "./types";

export interface DoctorReport {
  runtime: {
    nodeVersion: string;
    npmVersion: string;
    requiredNode?: string;
    nodeSatisfiesRequirement: boolean;
  };
  mode: "single-lecture" | "collection";
  templatePaths: string[];
  courseMetadata?: CourseMetadataValidationResult;
  lectureCount: number;
  validationPassed: boolean;
  rawSource: {
    present: string[];
    missing: string[];
    placeholder: string[];
    shared?: RawSourceEvidenceStatus;
  };
  latestWorksheetPath?: string;
  latestReviewPackagePath?: string;
  readiness: {
    preview: boolean;
    sourceFidelityReview: boolean;
    staticPackage: boolean;
  };
  progressTracking: {
    configured: true;
    storageModel: "browser localStorage";
    runtimeInspection: "browser-only";
    singleLectureKeyPrefix: string;
    collectionKeyPrefix: string;
  };
  warnings: string[];
}

export async function createDoctorReport(): Promise<DoctorReport> {
  const mode = await detectAuthoringMode();
  const packageJson = await readPackageJson();
  const requiredNode = packageJson.engines?.node;
  const nodeSatisfiesRequirement = satisfiesNodeRequirement(process.version, requiredNode);
  const warnings: string[] = [];

  let templatePaths: string[] = [];
  let courseMetadata: CourseMetadataValidationResult | undefined;
  let lectureCount = 0;
  let validationPassed = false;
  const rawSource: DoctorReport["rawSource"] = { present: [], missing: [], placeholder: [] };

  if (!nodeSatisfiesRequirement && requiredNode) {
    warnings.push(`WARN_UNSUPPORTED_NODE: current ${process.version} does not satisfy ${requiredNode}.`);
  }

  if (mode === "collection") {
    const validation = await validateCollection({ logSkippedDirectories: false });
    templatePaths = validation.results.map((result) => result.templatePath);
    courseMetadata = validation.courseMetadata;
    lectureCount = validation.lectureCount;
    validationPassed = validation.allPassed;
    if (courseMetadata.status === "absent") warnings.push(`WARN_MISSING_METADATA: ${COURSE_METADATA_PATH} is optional but not present.`);
    if (courseMetadata.status === "invalid") warnings.push(`WARN_INVALID_METADATA: ${COURSE_METADATA_PATH} is invalid.`);
    if (!validation.allPassed) warnings.push("WARN_INVALID_TEMPLATES: validation did not pass.");

    const sharedEvidence = await readRawSourceEvidence(COLLECTION_SHARED_RAW_SOURCE_PATH);
    rawSource.shared = sharedEvidence.status;
    if (sharedEvidence.status === "present") rawSource.present.push(COLLECTION_SHARED_RAW_SOURCE_PATH);

    for (const result of validation.results) {
      const rawPath = collectionRawSourcePath(result.slug);
      const evidence = await readRawSourceEvidence(rawPath);
      addRawSourceStatus(rawSource, evidence.status, rawPath);
    }
  } else {
    templatePaths = [ACTIVE_TEMPLATE_PATH];
    lectureCount = 1;
    try {
      const source = await readFile(repositoryPath(ACTIVE_TEMPLATE_PATH), "utf8");
      validationPassed = validateTemplateSource(source).valid;
    } catch {
      validationPassed = false;
    }
    if (!validationPassed) warnings.push("WARN_INVALID_TEMPLATES: validation did not pass.");
    const evidence = await readRawSourceEvidence(SINGLE_RAW_SOURCE_PATH);
    addRawSourceStatus(rawSource, evidence.status, SINGLE_RAW_SOURCE_PATH);
  }

  if (rawSource.missing.length > 0) warnings.push("WARN_MISSING_RAW_SOURCE: one or more primary raw source files are missing.");
  if (rawSource.placeholder.length > 0) {
    warnings.push("WARN_PLACEHOLDER_RAW_SOURCE: one or more primary raw source files are scaffold placeholders; replace them with human source evidence.");
  }

  const latestWorksheetPath = await latestPath(SOURCE_REVIEW_WORKSHEET_DIR);
  if (!latestWorksheetPath) warnings.push("WARN_MISSING_WORKSHEET: no source-fidelity worksheet was found.");

  const latestReviewPackagePath = await latestPath("review-packages");
  if (!latestReviewPackagePath) warnings.push("WARN_MISSING_PACKAGE: no static review package was found.");

  return {
    runtime: {
      nodeVersion: process.version,
      npmVersion: npmVersion(),
      requiredNode,
      nodeSatisfiesRequirement
    },
    mode,
    templatePaths,
    courseMetadata,
    lectureCount,
    validationPassed,
    rawSource,
    latestWorksheetPath,
    latestReviewPackagePath,
    readiness: {
      preview: validationPassed,
      sourceFidelityReview: validationPassed && rawSource.missing.length === 0 && rawSource.placeholder.length === 0,
      staticPackage: validationPassed
    },
    progressTracking: createProgressTrackingReport(),
    warnings
  };
}

export function renderDoctorReport(report: DoctorReport): string {
  const lines = [
    "Lecture Site Doctor",
    "",
    `Node.js: ${report.runtime.nodeVersion}`,
    `npm: ${report.runtime.npmVersion}`,
    `Required Node.js: ${report.runtime.requiredNode ?? "(not specified)"}`,
    `Node requirement satisfied: ${report.runtime.nodeSatisfiesRequirement ? "yes" : "no"}`,
    `Mode: ${report.mode}`,
    `Lecture count: ${report.lectureCount}`,
    `Schema validation: ${report.validationPassed ? "passed" : "failed"}`,
    "",
    "Active templates:",
    ...(report.templatePaths.length > 0 ? report.templatePaths.map((templatePath) => `- ${templatePath}`) : ["- (none)"])
  ];

  if (report.mode === "collection") {
    lines.push("", `Course metadata: ${report.courseMetadata?.status ?? "absent"} (${report.courseMetadata?.path ?? COURSE_METADATA_PATH})`);
  }

  lines.push(
    "",
    "Raw source evidence:",
    ...report.rawSource.present
      .filter((sourcePath) => sourcePath !== COLLECTION_SHARED_RAW_SOURCE_PATH)
      .map((sourcePath) => `- Primary human source evidence: ${sourcePath} (present)`),
    ...report.rawSource.missing.map((sourcePath) => `- Primary human source evidence: ${sourcePath} (missing)`),
    ...report.rawSource.placeholder.map(
      (sourcePath) => `- Primary human source evidence: ${sourcePath} (Scaffold placeholder; replace with human source)`
    ),
    ...(report.mode === "collection" && report.rawSource.shared
      ? [`- Optional shared human source evidence: ${COLLECTION_SHARED_RAW_SOURCE_PATH} (${report.rawSource.shared})`]
      : []),
    "",
    `Latest source-fidelity worksheet: ${report.latestWorksheetPath ?? "(none)"}`,
    `Latest static review package: ${report.latestReviewPackagePath ?? "(none)"}`,
    "",
    "Readiness:",
    `- preview: ${report.readiness.preview ? "ready" : "not ready"}`,
    `- source-fidelity review: ${report.readiness.sourceFidelityReview ? "ready" : "not ready"}`,
    `- static package: ${report.readiness.staticPackage ? "ready" : "not ready"}`,
    "",
    "Progress tracking:",
    `- configured: ${report.progressTracking.configured ? "yes" : "no"}`,
    `- storage model: ${report.progressTracking.storageModel}`,
    `- runtime inspection: ${report.progressTracking.runtimeInspection}; CLI cannot read a learner's browser localStorage`,
    `- single lecture key prefix: ${report.progressTracking.singleLectureKeyPrefix}`,
    `- collection key prefix: ${report.progressTracking.collectionKeyPrefix}`
  );

  if (report.warnings.length > 0) {
    lines.push("", "Warnings:", ...report.warnings.map((warning) => `- ${warning}`));
  }

  return `${lines.join("\n")}\n`;
}

function createProgressTrackingReport(): DoctorReport["progressTracking"] {
  return {
    configured: true,
    storageModel: "browser localStorage",
    runtimeInspection: "browser-only",
    singleLectureKeyPrefix: singleLectureProgressKey("<lecture-id>"),
    collectionKeyPrefix: collectionProgressKey("<collection-id>")
  };
}

function addRawSourceStatus(
  rawSource: DoctorReport["rawSource"],
  status: RawSourceEvidenceStatus,
  sourcePath: string
): void {
  if (status === "present") rawSource.present.push(sourcePath);
  else if (status === "placeholder") rawSource.placeholder.push(sourcePath);
  else rawSource.missing.push(sourcePath);
}

async function readPackageJson(): Promise<{ engines?: { node?: string } }> {
  try {
    return JSON.parse(await readFile(repositoryPath("package.json"), "utf8"));
  } catch {
    return {};
  }
}

function satisfiesNodeRequirement(version: string, requirement?: string): boolean {
  if (!requirement) return true;
  const match = requirement.match(/^>=\s*(\d+)/);
  if (!match) return true;
  return Number.parseInt(version.replace(/^v/, "").split(".")[0] ?? "0", 10) >= Number.parseInt(match[1] ?? "0", 10);
}

function runVersionCommand(command: string, args: string[]): string {
  try {
    const output = execFileSync(command, args, { cwd: process.cwd(), encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    return output === "" ? "unavailable" : output;
  } catch {
    return "unavailable";
  }
}

function npmVersion(): string {
  const fromCommand = runVersionCommand("npm", ["--version"]);
  if (fromCommand !== "unavailable") return fromCommand;
  const match = process.env.npm_config_user_agent?.match(/\bnpm\/([^\s]+)/);
  return match?.[1] ?? "unavailable";
}

async function latestPath(relativeDir: string): Promise<string | undefined> {
  try {
    const entries = await readdir(repositoryPath(relativeDir), { withFileTypes: true });
    const candidates = await Promise.all(
      entries.map(async (entry) => {
        const relativePath = path.posix.join(relativeDir, entry.name);
        const info = await stat(repositoryPath(relativePath));
        return { relativePath, mtime: info.mtimeMs };
      })
    );
    candidates.sort((left, right) => right.mtime - left.mtime);
    return candidates[0]?.relativePath;
  } catch {
    return undefined;
  }
}
