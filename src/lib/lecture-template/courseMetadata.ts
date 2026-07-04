import { access, readFile } from "node:fs/promises";
import { isMap, parseDocument } from "yaml";
import { repositoryPath } from "./readTemplate";
import type { CourseMetadata, CourseMetadataValidationResult, LectureLevel, ValidationError } from "./types";

export const COURSE_METADATA_PATH = "lectures/course.yaml";

const validLevels = new Set<LectureLevel>(["beginner", "intermediate", "advanced"]);

export async function readCourseMetadata(path = COURSE_METADATA_PATH): Promise<CourseMetadataValidationResult> {
  try {
    await access(repositoryPath(path));
  } catch (error) {
    if (isMissingPath(error)) {
      return { status: "absent", path, errors: [] };
    }
    throw error;
  }

  const source = await readFile(repositoryPath(path), "utf8");
  return parseCourseMetadata(source, path);
}

export function parseCourseMetadata(source: string, path = COURSE_METADATA_PATH): CourseMetadataValidationResult {
  const document = parseDocument(source, { prettyErrors: false });
  if (document.errors.length > 0) {
    return {
      status: "invalid",
      path,
      errors: document.errors.map((error) => ({
        code: "COURSE_METADATA_YAML_INVALID",
        message: `Could not parse course metadata YAML: ${error.message}`,
        locator: { context: path },
        hint: "Fix the YAML syntax in lectures/course.yaml."
      }))
    };
  }

  if (!isMap(document.contents)) {
    return {
      status: "invalid",
      path,
      errors: [
        {
          code: "COURSE_METADATA_ROOT_TYPE",
          message: "Course metadata must be a YAML mapping.",
          locator: { context: path },
          hint: "Use key-value pairs such as title: and description:."
        }
      ]
    };
  }

  const value = document.toJSON() as Record<string, unknown>;
  const errors: ValidationError[] = [];
  const title = requiredString(value.title, "title", errors, path);
  const description = requiredString(value.description, "description", errors, path);
  const audience = optionalString(value.audience, "audience", errors, path);
  const duration = optionalString(value.duration, "duration", errors, path);
  const level = optionalLevel(value.level, errors, path);

  if (errors.length > 0) {
    return {
      status: "invalid",
      path,
      errors
    };
  }

  const metadata: CourseMetadata = {
    title,
    description
  };
  if (audience) metadata.audience = audience;
  if (level) metadata.level = level;
  if (duration) metadata.duration = duration;

  return {
    status: "valid",
    path,
    metadata,
    errors: []
  };
}

function requiredString(value: unknown, field: string, errors: ValidationError[], path: string): string {
  if (value === undefined || value === null) {
    errors.push({
      code: "COURSE_METADATA_REQUIRED_FIELD",
      message: `Course metadata field "${field}" is required.`,
      field,
      locator: { context: `${path}:${field}` },
      hint: `Add a non-empty ${field} value to lectures/course.yaml.`
    });
    return "";
  }

  if (typeof value !== "string") {
    errors.push(fieldTypeError(field, path));
    return "";
  }

  const trimmed = value.trim();
  if (trimmed === "") {
    errors.push(emptyFieldError(field, path));
  }
  return trimmed;
}

function optionalString(value: unknown, field: string, errors: ValidationError[], path: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") {
    errors.push(fieldTypeError(field, path));
    return undefined;
  }

  const trimmed = value.trim();
  if (trimmed === "") {
    errors.push(emptyFieldError(field, path));
    return undefined;
  }
  return trimmed;
}

function optionalLevel(value: unknown, errors: ValidationError[], path: string): LectureLevel | undefined {
  const level = optionalString(value, "level", errors, path);
  if (!level) return undefined;
  if (!validLevels.has(level as LectureLevel)) {
    errors.push({
      code: "COURSE_METADATA_INVALID_LEVEL",
      message: `Invalid course metadata level "${level}".`,
      field: "level",
      locator: { context: `${path}:level` },
      hint: "Use one of: beginner, intermediate, advanced."
    });
    return undefined;
  }
  return level as LectureLevel;
}

function fieldTypeError(field: string, path: string): ValidationError {
  return {
    code: "COURSE_METADATA_FIELD_TYPE",
    message: `Course metadata field "${field}" must be a string.`,
    field,
    locator: { context: `${path}:${field}` },
    hint: `Set ${field} to a non-empty string value.`
  };
}

function emptyFieldError(field: string, path: string): ValidationError {
  return {
    code: field === "title" || field === "description" ? "COURSE_METADATA_REQUIRED_FIELD" : "COURSE_METADATA_FIELD_TYPE",
    message: `Course metadata field "${field}" must not be empty.`,
    field,
    locator: { context: `${path}:${field}` },
    hint: `Set ${field} to a non-empty string value.`
  };
}

function isMissingPath(error: unknown): boolean {
  return error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT";
}
