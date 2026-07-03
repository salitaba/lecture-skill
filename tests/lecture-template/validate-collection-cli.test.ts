import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { validateCollectionCli } from "../../src/lib/lecture-template/validateCli";

const repoRoot = process.cwd();
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
});

function copyFixture(sourcePath: string, destinationPath: string) {
  const source = readFileSync(path.join(repoRoot, sourcePath), "utf8");
  const absolutePath = path.join(tempRoot, destinationPath);
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, source, "utf8");
}
