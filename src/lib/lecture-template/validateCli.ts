import { readFile } from "node:fs/promises";
import { ACTIVE_TEMPLATE_PATH, repositoryPath } from "./readTemplate";
import { validateCollection } from "./collection";
import type { CollectionValidationResult, CourseMetadataValidationResult, ValidationError, ValidationResult } from "./types";
import { validateTemplateSource } from "./validateTemplate";
import { summarizeLectureAssessments } from "./assessments";

export interface CliValidationOutput {
  status: number;
  stdout: string;
  stderr: string;
}

export async function validateCollectionCli(): Promise<CliValidationOutput> {
  try {
    const collection = await validateCollection();

    if (collection.lectureCount === 0) {
      if (collection.courseMetadata.status !== "invalid") {
        return {
          status: 0,
          stdout: `Collection validation: 0 lectures found\n`,
          stderr: ""
        };
      }
      const lines = ["Collection validation: 0 lectures found", ""];
      appendCourseMetadataHumanOutput(lines, collection.courseMetadata);
      return {
        status: 1,
        stdout: `${lines.join("\n")}\n`,
        stderr: ""
      };
    }

    const lines = [`Collection validation: ${collection.lectureCount} lectures found`, ""];

    appendCourseMetadataHumanOutput(lines, collection.courseMetadata);

    for (const result of collection.results) {
      lines.push(`  [${result.valid ? "PASS" : "FAIL"}] ${result.slug}/lecture.template.md`);
      if (!result.valid) {
        for (const error of result.errors) {
          lines.push(`    - ${error.code}: ${error.message}`);
        }
      }
    }

    const passingCount = collection.results.filter((result) => result.valid).length;
    lines.push("");
    lines.push(`${passingCount} of ${collection.lectureCount} lectures passed validation.`);

    return {
      status: collection.allPassed ? 0 : 1,
      stdout: `${lines.join("\n")}\n`,
      stderr: ""
    };
  } catch (error) {
    return {
      status: 1,
      stdout: "",
      stderr: `Could not validate collection: ${error instanceof Error ? error.message : String(error)}\n`
    };
  }
}

export async function validateTemplateFile(templatePath = ACTIVE_TEMPLATE_PATH): Promise<CliValidationOutput> {
  try {
    const source = await readFile(repositoryPath(templatePath), "utf8");
    const result = validateTemplateSource(source);

    if (result.valid) {
      return {
        status: 0,
        stdout: `Valid lecture template: ${templatePath}\n`,
        stderr: ""
      };
    }

    return {
      status: 1,
      stdout: "",
      stderr: [`Invalid lecture template: ${templatePath}`, ...result.errors.map(formatError)].join("\n") + "\n"
    };
  } catch (error) {
    return {
      status: 1,
      stdout: "",
      stderr: `Could not validate ${templatePath}: ${error instanceof Error ? error.message : String(error)}\n`
    };
  }
}

export async function validateCollectionJsonCli(): Promise<CliValidationOutput> {
  try {
    const collection = await validateCollection({ logSkippedDirectories: false });
    return {
      status: collection.allPassed ? 0 : 1,
      stdout: `${JSON.stringify(buildCollectionJsonOutput(collection), null, 2)}\n`,
      stderr: ""
    };
  } catch (error) {
    return {
      status: 1,
      stdout: `${JSON.stringify(
        {
          ok: false,
          mode: "collection",
          errors: [
            {
              code: "COLLECTION_VALIDATION_FAILED",
              message: error instanceof Error ? error.message : String(error)
            }
          ]
        },
        null,
        2
      )}\n`,
      stderr: ""
    };
  }
}

export async function validateTemplateFileJson(templatePath = ACTIVE_TEMPLATE_PATH): Promise<CliValidationOutput> {
  try {
    const source = await readFile(repositoryPath(templatePath), "utf8");
    const result = validateTemplateSource(source);
    return {
      status: result.valid ? 0 : 1,
      stdout: `${JSON.stringify(buildSingleJsonOutput(templatePath, result), null, 2)}\n`,
      stderr: ""
    };
  } catch (error) {
    return {
      status: 1,
      stdout: `${JSON.stringify(
        {
          ok: false,
          mode: "single-lecture",
          templatePath,
          valid: false,
          errors: [
            {
              code: "TEMPLATE_READ_FAILED",
              message: `Could not validate ${templatePath}: ${error instanceof Error ? error.message : String(error)}`
            }
          ]
        },
        null,
        2
      )}\n`,
      stderr: ""
    };
  }
}

export function formatError(error: ValidationError): string {
  const parts = [`- [${error.code}] ${error.message}`];
  const location = formatLocation(error);
  if (location) parts.push(`  Location: ${location}`);
  const context = [
    error.field ? `field=${error.field}` : undefined,
    error.heading ? `heading=${error.heading}` : undefined,
    error.sectionTitle !== undefined ? `section=${error.sectionTitle || "(empty title)"}` : undefined,
    error.componentType ? `component=${error.componentType}` : undefined
  ].filter(Boolean);
  if (context.length > 0) parts.push(`  Context: ${context.join(", ")}`);
  if (error.hint) parts.push(`  Hint: ${error.hint}`);
  return parts.join("\n");
}

function appendCourseMetadataHumanOutput(lines: string[], courseMetadata: CourseMetadataValidationResult) {
  if (courseMetadata.status === "absent") return;

  lines.push(`Course metadata: ${courseMetadata.status.toUpperCase()} ${courseMetadata.path}`);
  if (courseMetadata.status === "valid") {
    lines.push(`  Title: ${courseMetadata.metadata.title}`, `  Description: ${courseMetadata.metadata.description}`, "");
    return;
  }

  for (const error of courseMetadata.errors) {
    lines.push(`  - ${error.code}: ${error.message}`);
  }
  lines.push("");
}

function buildCollectionJsonOutput(collection: CollectionValidationResult) {
  return {
    ok: collection.allPassed,
    mode: "collection",
    lectureCount: collection.lectureCount,
    courseMetadata: serializeCourseMetadata(collection.courseMetadata),
    lectures: collection.results.map((result) => ({
      slug: result.slug,
      templatePath: result.templatePath,
      valid: result.valid,
      ...(result.valid && result.template ? { assessmentSummary: summarizeLectureAssessments(result.template) } : {}),
      errors: result.errors.map(serializeError)
    })),
    errors: [
      ...(collection.courseMetadata.status === "invalid" ? collection.courseMetadata.errors : []),
      ...collection.results.flatMap((result) => result.errors)
    ].map(serializeError)
  };
}

function buildSingleJsonOutput(templatePath: string, result: ValidationResult) {
  return {
    ok: result.valid,
    mode: "single-lecture",
    templatePath,
    valid: result.valid,
    ...(result.valid && result.template ? { assessmentSummary: summarizeLectureAssessments(result.template) } : {}),
    errors: result.valid ? [] : result.errors.map(serializeError)
  };
}

function serializeCourseMetadata(result: CourseMetadataValidationResult) {
  return {
    status: result.status,
    path: result.path,
    metadata: result.status === "valid" ? result.metadata : undefined,
    errors: result.errors.map(serializeError)
  };
}

function serializeError(error: ValidationError) {
  return {
    code: error.code,
    message: error.message,
    locator: error.locator,
    field: error.field,
    heading: error.heading,
    sectionTitle: error.sectionTitle,
    componentType: error.componentType,
    hint: error.hint
  };
}

function formatLocation(error: ValidationError): string | undefined {
  if (!error.locator) return undefined;
  const line = error.locator.line ? `line ${error.locator.line}` : undefined;
  const column = error.locator.column ? `column ${error.locator.column}` : undefined;
  const context = error.locator.context ? error.locator.context : undefined;
  return [line, column, context].filter(Boolean).join(", ");
}
