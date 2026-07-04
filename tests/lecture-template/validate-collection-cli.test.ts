import { closeSync, mkdirSync, mkdtempSync, openSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { validateCollectionCli, validateCollectionJsonCli } from "../../src/lib/lecture-template/validateCli";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
let tempRoot = "";

describe("collection validation CLI", () => {
  beforeEach(() => {
    tempRoot = mkdtempSync(path.join(os.tmpdir(), "lecture-collection-cli-"));
    process.chdir(tempRoot);
  });

  afterEach(() => {
    process.chdir(repoRoot);
    if (tempRoot) {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it("prints a pass summary for a valid collection", async () => {
    copyFixture(
      "examples/multi-lecture/lectures/01-introduction/lecture.template.md",
      "lectures/01-introduction/lecture.template.md"
    );
    copyFixture(
      "examples/multi-lecture/lectures/02-core-concepts/lecture.template.md",
      "lectures/02-core-concepts/lecture.template.md"
    );

    const result = await validateCollectionCli();

    expect(result).toEqual({
      status: 0,
      stdout: [
        "Collection validation: 2 lectures found",
        "",
        "  [PASS] 01-introduction/lecture.template.md",
        "  [PASS] 02-core-concepts/lecture.template.md",
        "",
        "2 of 2 lectures passed validation.",
        ""
      ].join("\n"),
      stderr: ""
    });
  });

  it("accepts a collection lecture containing learning components", async () => {
    copyFixture(
      "examples/multi-lecture/lectures/01-introduction/lecture.template.md",
      "lectures/01-introduction/lecture.template.md"
    );
    copyFixture("examples/component-demo.template.md", "lectures/02-learning-components/lecture.template.md");

    const result = await validateCollectionCli();

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Collection validation: 2 lectures found");
    expect(result.stdout).toContain("[PASS] 02-learning-components/lecture.template.md");
    expect(result.stdout).toContain("2 of 2 lectures passed validation.");
    expect(result.stderr).toBe("");
  });

  it("prints mixed pass and fail output in authored order", async () => {
    copyFixture(
      "examples/multi-lecture/lectures/01-introduction/lecture.template.md",
      "lectures/01-introduction/lecture.template.md"
    );
    copyFixture("examples/invalid/invalid-level.template.md", "lectures/02-core-concepts/lecture.template.md");

    const result = await validateCollectionCli();

    expect(result).toEqual({
      status: 1,
      stdout: [
        "Collection validation: 2 lectures found",
        "",
        "  [PASS] 01-introduction/lecture.template.md",
        "  [FAIL] 02-core-concepts/lecture.template.md",
        '    - INVALID_LEVEL: Invalid level "expert".',
        "",
        "1 of 2 lectures passed validation.",
        ""
      ].join("\n"),
      stderr: ""
    });
  });

  it("handles an empty collection without failing", async () => {
    mkdirSync(path.join(tempRoot, "lectures"), { recursive: true });

    const result = await validateCollectionCli();

    expect(result).toEqual({
      status: 0,
      stdout: "Collection validation: 0 lectures found\n",
      stderr: ""
    });
  });

  it("exits nonzero when any lecture fails validation", async () => {
    copyFixture("examples/invalid/invalid-level.template.md", "lectures/01-introduction/lecture.template.md");

    const result = await validateCollectionCli();

    expect(result.status).toBe(1);
  });

  it("prints invalid course metadata in human output", async () => {
    writeText("lectures/course.yaml", "title: ''\ndescription: ''\n");
    copyFixture("examples/multi-lecture/lectures/01-introduction/lecture.template.md", "lectures/01-introduction/lecture.template.md");

    const result = await validateCollectionCli();

    expect(result.status).toBe(1);
    expect(result.stdout).toContain("Course metadata: INVALID lectures/course.yaml");
    expect(result.stdout).toContain("COURSE_METADATA_REQUIRED_FIELD");
    expect(result.stdout).toContain("[PASS] 01-introduction/lecture.template.md");
  });

  it("emits parseable collection JSON with course metadata", async () => {
    writeText("lectures/course.yaml", 'title: "Course Title"\ndescription: "Course description."\n');
    copyFixture("examples/multi-lecture/lectures/01-introduction/lecture.template.md", "lectures/01-introduction/lecture.template.md");
    mkdirSync(path.join(tempRoot, "lectures", "notes"), { recursive: true });

    const result = await validateCollectionJsonCli();
    const json = JSON.parse(result.stdout);

    expect(result.status).toBe(0);
    expect(json).toMatchObject({
      ok: true,
      mode: "collection",
      lectureCount: 1,
      courseMetadata: {
        status: "valid",
        path: "lectures/course.yaml",
        metadata: {
          title: "Course Title"
        },
        errors: []
      }
    });
    expect(result.stdout).not.toContain("Skipping lecture directory");
  });

  it("script supports npm-style --json argument path", () => {
    copyFixture("scripts/ts-loader.mjs", "scripts/ts-loader.mjs");
    copyFixture("examples/multi-lecture/lectures/01-introduction/lecture.template.md", "lectures/01-introduction/lecture.template.md");

    const result = runScript(path.join(repoRoot, "scripts/validate.ts"), ["--json"]);

    expect(result.status).toBe(0);
    expect(() => JSON.parse(result.stdout)).not.toThrow();
    expect(JSON.parse(result.stdout)).toMatchObject({ mode: "collection", ok: true });
    expect(result.stderr).toBe("");
  });
});

function copyFixture(sourcePath: string, destinationPath: string) {
  const source = readFileSync(path.join(repoRoot, sourcePath), "utf8");
  writeText(destinationPath, source);
}

function writeText(destinationPath: string, contents: string) {
  const absolutePath = path.join(tempRoot, destinationPath);
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, contents, "utf8");
}

function runScript(scriptPath: string, args: string[] = []) {
  const stdoutPath = path.join(tempRoot, "script.stdout.log");
  const stderrPath = path.join(tempRoot, "script.stderr.log");
  const stdoutFd = openSync(stdoutPath, "w");
  const stderrFd = openSync(stderrPath, "w");
  const result = spawnSync(process.execPath, ["--import", path.join(repoRoot, "scripts/register-ts-loader.mjs"), scriptPath, ...args], {
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
