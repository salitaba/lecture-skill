import { closeSync, existsSync, mkdirSync, mkdtempSync, openSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { RAW_SOURCE_PLACEHOLDER, readRawSourceEvidence } from "../../src/lib/lecture-template/rawSourceEvidence";
import { detectAuthoringMode, scaffoldCollection, scaffoldLecture } from "../../src/lib/lecture-template/scaffold";
import { validateTemplateSource } from "../../src/lib/lecture-template/validateTemplate";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
let tempRoot = "";

describe("authoring scaffolds", () => {
  beforeEach(() => {
    tempRoot = mkdtempSync(path.join(os.tmpdir(), "lecture-scaffold-"));
    process.chdir(tempRoot);
  });

  afterEach(() => {
    process.chdir(repoRoot);
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
  });

  it("creates a minimal collection scaffold", async () => {
    const result = await scaffoldCollection();

    expect(result.ok).toBe(true);
    expect(pathExists("lectures/course.yaml")).toBe(true);
    expect(pathExists("lectures/01-introduction/lecture.template.md")).toBe(true);
    expect(pathExists("lectures/01-introduction/raw-lecture.txt")).toBe(true);
    expect(pathExists("lectures/raw-course.txt")).toBe(false);
    expect(readFileSync(path.join(tempRoot, "lectures/01-introduction/raw-lecture.txt"), "utf8")).toBe(RAW_SOURCE_PLACEHOLDER);
    expect((await readRawSourceEvidence("lectures/01-introduction/raw-lecture.txt")).status).toBe("placeholder");
    expect(result.message).toContain("raw-source placeholder");
    expect(validateTemplateSource(readFileSync(path.join(tempRoot, "lectures/01-introduction/lecture.template.md"), "utf8")).valid).toBe(true);
  });

  it("refuses to overwrite an existing collection workspace", async () => {
    mkdirSync(path.join(tempRoot, "lectures"), { recursive: true });

    const result = await scaffoldCollection();

    expect(result.ok).toBe(false);
    expect(result.message).toContain("Refusing");
  });

  it("detects empty lectures directory as collection authoring mode", async () => {
    mkdirSync(path.join(tempRoot, "lectures"), { recursive: true });

    expect(await detectAuthoringMode()).toBe("collection");
  });

  it("creates the next numbered collection lecture", async () => {
    mkdirSync(path.join(tempRoot, "lectures", "01-introduction"), { recursive: true });
    writeText("lectures/01-introduction/lecture.template.md", "placeholder");

    const result = await scaffoldLecture();

    expect(result.ok).toBe(true);
    expect(result.createdPaths).toEqual(["lectures/02-new-lecture/lecture.template.md", "lectures/02-new-lecture/raw-lecture.txt"]);
    expect(readFileSync(path.join(tempRoot, "lectures/02-new-lecture/raw-lecture.txt"), "utf8")).toBe(RAW_SOURCE_PLACEHOLDER);
    expect((await readRawSourceEvidence("lectures/02-new-lecture/raw-lecture.txt")).status).toBe("placeholder");
    expect(validateTemplateSource(readFileSync(path.join(tempRoot, "lectures/02-new-lecture/lecture.template.md"), "utf8")).valid).toBe(true);
  });

  it("preserves existing collection raw sources and does not create shared source", async () => {
    mkdirSync(path.join(tempRoot, "lectures", "01-introduction"), { recursive: true });
    writeText("lectures/01-introduction/lecture.template.md", "placeholder");
    writeText("lectures/01-introduction/raw-lecture.txt", "Human lecture source.\n");
    writeText("lectures/raw-course.txt", "Human shared source.\n");

    const result = await scaffoldLecture();

    expect(result.ok).toBe(true);
    expect(readFileSync(path.join(tempRoot, "lectures/01-introduction/raw-lecture.txt"), "utf8")).toBe("Human lecture source.\n");
    expect(readFileSync(path.join(tempRoot, "lectures/raw-course.txt"), "utf8")).toBe("Human shared source.\n");
  });

  it("creates a single-lecture template only when missing", async () => {
    const created = await scaffoldLecture();
    const refused = await scaffoldLecture();

    expect(created.ok).toBe(true);
    expect(pathExists("content/lecture.template.md")).toBe(true);
    expect(refused.ok).toBe(false);
    expect(refused.message).toContain("Refusing to overwrite");
  });

  it("new lecture script prints created paths", () => {
    copyFixture("scripts/ts-loader.mjs", "scripts/ts-loader.mjs");

    const result = runScript(path.join(repoRoot, "scripts/newLecture.ts"));

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Created:");
    expect(result.stdout).toContain("content/lecture.template.md");
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

function pathExists(relativePath: string): boolean {
  return existsSync(path.join(tempRoot, relativePath));
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
