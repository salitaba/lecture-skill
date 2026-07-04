import { closeSync, mkdtempSync, openSync, readFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { validateTemplateFile, validateTemplateFileJson } from "../../src/lib/lecture-template/validateCli";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

describe("validation CLI", () => {
  it("validates content/lecture.template.md by default", async () => {
    const result = await validateTemplateFile();

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Valid lecture template: content/lecture.template.md");
  });

  it("prints locatable errors and exits nonzero for invalid templates", async () => {
    const result = await validateTemplateFile("examples/invalid/unsupported-component-type.template.md");

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("UNSUPPORTED_COMPONENT_TYPE");
    expect(result.stderr).toContain("component=flashcard");
    expect(result.stderr).toContain("section=Valid Section");
    expect(result.stderr).toContain("Location: line");
    expect(result.stderr).toContain("Hint:");
    expect(result.stderr).toContain("comparison");
    expect(result.stderr).toContain("quiz");
  });

  it("prints precise fields for nested learning component failures", async () => {
    const comparisonResult = await validateTemplateFile("examples/invalid/comparison-field-errors.template.md");
    const quizResult = await validateTemplateFile("examples/invalid/quiz-field-errors.template.md");

    expect(comparisonResult.status).not.toBe(0);
    expect(comparisonResult.stderr).toContain("component=comparison");
    expect(comparisonResult.stderr).toContain("section=Comparison Problems");
    expect(comparisonResult.stderr).toContain("field=items[0].label");
    expect(comparisonResult.stderr).toContain("field=items[0].left");
    expect(comparisonResult.stderr).toContain("field=items[0].right");

    expect(quizResult.status).not.toBe(0);
    expect(quizResult.stderr).toContain("component=quiz");
    expect(quizResult.stderr).toContain("section=Quiz Problems");
    expect(quizResult.stderr).toContain("field=options[0]");
    expect(quizResult.stderr).toContain("field=answer");
  });

  it("emits single-lecture JSON output", async () => {
    const result = await validateTemplateFileJson("examples/invalid/unsupported-component-type.template.md");
    const json = JSON.parse(result.stdout);

    expect(result.status).toBe(1);
    expect(json).toMatchObject({
      ok: false,
      mode: "single-lecture",
      templatePath: "examples/invalid/unsupported-component-type.template.md",
      valid: false
    });
    expect(json.errors[0].code).toBe("UNSUPPORTED_COMPONENT_TYPE");
  });

  it("script rejects unknown flags", () => {
    const result = runScript(["--unknown"]);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Unknown validate option: --unknown");
  });
});

function runScript(args: string[]) {
  const tempRoot = mkdtempSync(path.join(os.tmpdir(), "validate-cli-"));
  try {
    const stdoutPath = path.join(tempRoot, "script.stdout.log");
    const stderrPath = path.join(tempRoot, "script.stderr.log");
    const stdoutFd = openSync(stdoutPath, "w");
    const stderrFd = openSync(stderrPath, "w");
    const result = spawnSync(process.execPath, ["--import", path.join(repoRoot, "scripts/register-ts-loader.mjs"), path.join(repoRoot, "scripts/validate.ts"), ...args], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", stdoutFd, stderrFd]
    });
    closeSync(stdoutFd);
    closeSync(stderrFd);
    return {
      ...result,
      stdout: readFileSync(stdoutPath, "utf8"),
      stderr: readFileSync(stderrPath, "utf8")
    };
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}
