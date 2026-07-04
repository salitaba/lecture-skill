import { closeSync, mkdirSync, mkdtempSync, openSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createDoctorReport, renderDoctorReport } from "../../src/lib/lecture-template/doctor";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
let tempRoot = "";

describe("doctor readiness report", () => {
  beforeEach(() => {
    tempRoot = mkdtempSync(path.join(os.tmpdir(), "lecture-doctor-"));
    process.chdir(tempRoot);
    copyFixture("package.json", "package.json");
  });

  afterEach(() => {
    process.chdir(repoRoot);
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
  });

  it("reports single-lecture mode, validation, raw source, and readiness", async () => {
    copyFixture("examples/golden.template.md", "content/lecture.template.md");
    writeText("content/raw-lecture.txt", "Raw source.");

    const report = await createDoctorReport();
    const output = renderDoctorReport(report);

    expect(report.mode).toBe("single-lecture");
    expect(report.templatePaths).toEqual(["content/lecture.template.md"]);
    expect(report.validationPassed).toBe(true);
    expect(report.readiness.preview).toBe(true);
    expect(output).toContain("Mode: single-lecture");
    expect(output).toContain("Schema validation: passed");
  });

  it("reports collection metadata, lecture count, and missing raw source warnings", async () => {
    writeText("lectures/course.yaml", 'title: "Course Title"\ndescription: "Course description."\n');
    copyFixture("examples/multi-lecture/lectures/01-introduction/lecture.template.md", "lectures/01-introduction/lecture.template.md");

    const report = await createDoctorReport();

    expect(report.mode).toBe("collection");
    expect(report.courseMetadata?.status).toBe("valid");
    expect(report.lectureCount).toBe(1);
    expect(report.rawSource.missing).toEqual(["lectures/01-introduction/raw-lecture.txt"]);
    expect(report.warnings).toContain("WARN_MISSING_RAW_SOURCE: one or more primary raw source files are missing.");
  });

  it("warns for invalid metadata without throwing", async () => {
    writeText("lectures/course.yaml", "title: ''\ndescription: ''\n");
    copyFixture("examples/multi-lecture/lectures/01-introduction/lecture.template.md", "lectures/01-introduction/lecture.template.md");

    const report = await createDoctorReport();

    expect(report.validationPassed).toBe(false);
    expect(report.warnings).toContain("WARN_INVALID_METADATA: lectures/course.yaml is invalid.");
  });

  it("doctor script exits zero with readiness warnings", () => {
    copyFixture("scripts/ts-loader.mjs", "scripts/ts-loader.mjs");
    copyFixture("examples/golden.template.md", "content/lecture.template.md");

    const result = runScript(path.join(repoRoot, "scripts/doctor.ts"));

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Lecture Site Doctor");
    expect(result.stdout).toContain("Warnings:");
  });
});

function copyFixture(sourcePath: string, destinationPath: string) {
  writeText(destinationPath, readFileSync(path.join(repoRoot, sourcePath), "utf8"));
}

function writeText(destinationPath: string, contents: string) {
  const absolutePath = path.join(tempRoot, destinationPath);
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, contents, "utf8");
}

function runScript(scriptPath: string) {
  const stdoutPath = path.join(tempRoot, "script.stdout.log");
  const stderrPath = path.join(tempRoot, "script.stderr.log");
  const stdoutFd = openSync(stdoutPath, "w");
  const stderrFd = openSync(stderrPath, "w");
  const result = spawnSync(process.execPath, ["--import", path.join(repoRoot, "scripts/register-ts-loader.mjs"), scriptPath], {
    cwd: tempRoot,
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
}
