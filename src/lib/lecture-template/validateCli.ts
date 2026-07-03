import { readFile } from "node:fs/promises";
import { ACTIVE_TEMPLATE_PATH, repositoryPath } from "./readTemplate";
import { validateCollection } from "./collection";
import type { ValidationError } from "./types";
import { validateTemplateSource } from "./validateTemplate";

export interface CliValidationOutput {
  status: number;
  stdout: string;
  stderr: string;
}

export async function validateCollectionCli(): Promise<CliValidationOutput> {
  try {
    const collection = await validateCollection();

    if (collection.lectureCount === 0) {
      return {
        status: 0,
        stdout: `Collection validation: 0 lectures found\n`,
        stderr: ""
      };
    }

    const lines = [`Collection validation: ${collection.lectureCount} lectures found`, ""];

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

function formatLocation(error: ValidationError): string | undefined {
  if (!error.locator) return undefined;
  const line = error.locator.line ? `line ${error.locator.line}` : undefined;
  const column = error.locator.column ? `column ${error.locator.column}` : undefined;
  const context = error.locator.context ? error.locator.context : undefined;
  return [line, column, context].filter(Boolean).join(", ");
}
