import { readFileSync } from "node:fs";
import path from "node:path";
import { validateTemplateSource } from "../../src/lib/lecture-template/validateTemplate";

export function fixture(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

export function errorCodes(relativePath: string): string[] {
  const result = validateTemplateSource(fixture(relativePath));
  if (result.valid) return [];
  return result.errors.map((error) => error.code);
}

export function validationErrors(relativePath: string) {
  const result = validateTemplateSource(fixture(relativePath));
  if (result.valid) return [];
  return result.errors;
}
