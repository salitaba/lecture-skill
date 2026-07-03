import { closeSync, mkdirSync, mkdtempSync, openSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createSourceReviewWorksheet,
  renderSourceReviewWorksheetMarkdown
} from "../../src/lib/lecture-template/sourceReview";

const repoRoot = process.cwd();
let tempRoot = "";

describe("source fidelity review worksheet", () => {
  beforeEach(() => {
    tempRoot = mkdtempSync(path.join(os.tmpdir(), "source-review-"));
    process.chdir(tempRoot);
  });

  afterEach(() => {
    process.chdir(repoRoot);
    if (tempRoot) {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it("builds a single-lecture worksheet with present raw source evidence", async () => {
    copyFixture("examples/golden.template.md", "content/lecture.template.md");
    writeText("content/raw-lecture.txt", "Raw incident debugging lecture notes.");

    const worksheet = await createSourceReviewWorksheet({
      createdAt: new Date("2026-07-04T01:30:00.000Z")
    });

    expect(worksheet).toMatchObject({
      projectName: "lecture-site-engine",
      createdAt: "2026-07-04T01:30:00.000Z",
      mode: "single-lecture",
      lectureCount: 1,
      validation: {
        result: "passed",
        status: 0
      }
    });
    expect(worksheet.lectures[0]).toMatchObject({
      templatePath: "content/lecture.template.md",
      renderedRoute: "/",
      validationStatus: "passed",
      metadata: {
        title: "Evidence-Driven Debugging for Production Incidents"
      },
      sectionCount: 4,
      primarySource: {
        sourcePath: "content/raw-lecture.txt",
        status: "present",
        role: "primary"
      }
    });
  });

  it("marks missing single-lecture raw source as nonfatal", async () => {
    copyFixture("examples/golden.template.md", "content/lecture.template.md");

    const worksheet = await createSourceReviewWorksheet();

    expect(worksheet.validation.result).toBe("passed");
    expect(worksheet.lectures[0].primarySource).toMatchObject({
      sourcePath: "content/raw-lecture.txt",
      status: "missing"
    });
  });

  it("keeps preview metadata and section context for invalid single lectures", async () => {
    copyFixture("examples/invalid/invalid-level.template.md", "content/lecture.template.md");

    const worksheet = await createSourceReviewWorksheet();

    expect(worksheet.validation.result).toBe("failed");
    expect(worksheet.validation.stderr).toContain("Invalid lecture template: content/lecture.template.md");
    expect(worksheet.lectures[0]).toMatchObject({
      validationStatus: "failed",
      metadata: {
        title: "Invalid Level"
      }
    });
    expect(worksheet.lectures[0].sectionCount).toBeGreaterThan(0);
    expect(worksheet.lectures[0].validationErrors.map((error) => error.code)).toContain("INVALID_LEVEL");
  });

  it("records per-lecture and shared collection evidence", async () => {
    copyFixture(
      "examples/multi-lecture/lectures/01-introduction/lecture.template.md",
      "lectures/01-introduction/lecture.template.md"
    );
    copyFixture(
      "examples/multi-lecture/lectures/02-core-concepts/lecture.template.md",
      "lectures/02-core-concepts/lecture.template.md"
    );
    writeText("lectures/01-introduction/raw-lecture.txt", "Introduction source notes.");
    writeText("lectures/02-core-concepts/raw-lecture.txt", "Core concepts source notes.");
    writeText("lectures/raw-course.txt", "Shared course source.");

    const worksheet = await createSourceReviewWorksheet();

    expect(worksheet.mode).toBe("collection");
    expect(worksheet.validation.result).toBe("passed");
    expect(worksheet.sharedSource).toMatchObject({
      sourcePath: "lectures/raw-course.txt",
      status: "present",
      role: "shared"
    });
    expect(worksheet.lectures.map((lecture) => lecture.slug)).toEqual(["01-introduction", "02-core-concepts"]);
    expect(worksheet.lectures.map((lecture) => lecture.primarySource.status)).toEqual(["present", "present"]);
    expect(worksheet.lectures[0].additionalSources).toEqual([
      expect.objectContaining({
        sourcePath: "lectures/raw-course.txt",
        status: "present",
        role: "shared"
      })
    ]);
  });

  it("includes valid and invalid collection lectures and marks missing primary sources", async () => {
    copyFixture(
      "examples/multi-lecture/lectures/01-introduction/lecture.template.md",
      "lectures/01-introduction/lecture.template.md"
    );
    copyFixture("examples/invalid/invalid-level.template.md", "lectures/02-core-concepts/lecture.template.md");
    writeText("lectures/01-introduction/raw-lecture.txt", "Introduction source notes.");

    const worksheet = await createSourceReviewWorksheet();

    expect(worksheet.validation.result).toBe("failed");
    expect(worksheet.lectures).toHaveLength(2);
    expect(worksheet.lectures[0]).toMatchObject({
      slug: "01-introduction",
      validationStatus: "passed",
      primarySource: {
        status: "present"
      }
    });
    expect(worksheet.lectures[1]).toMatchObject({
      slug: "02-core-concepts",
      validationStatus: "failed",
      primarySource: {
        sourcePath: "lectures/02-core-concepts/raw-lecture.txt",
        status: "missing"
      }
    });
  });

  it("renders reviewer fields, checklist items, paths, routes, and package context", async () => {
    copyFixture("examples/golden.template.md", "content/lecture.template.md");
    writeText("content/raw-lecture.txt", "Raw source.");
    const worksheet = await createSourceReviewWorksheet({
      createdAt: new Date("2026-07-04T01:30:00.000Z"),
      packageContext: {
        packagePath: "review-packages/2026-07-04-0130-lecture-site",
        entryHtmlPath: "index.html"
      }
    });

    const markdown = renderSourceReviewWorksheetMarkdown(worksheet);

    expect(markdown).toContain("Source mode: single-lecture");
    expect(markdown).toContain("Validation result: passed");
    expect(markdown).toContain("Template path: content/lecture.template.md");
    expect(markdown).toContain("Primary raw source: content/raw-lecture.txt (present)");
    expect(markdown).toContain("Rendered route: /");
    expect(markdown).toContain("Package path: review-packages/2026-07-04-0130-lecture-site");
    expect(markdown).toContain("Reviewer name:");
    expect(markdown).toContain("[ ] Pass / [ ] Fail / [ ] Needs revision - Every major claim");
    expect(markdown).toContain("Overall result: [ ] Pass / [ ] Fail / [ ] Needs revision");
  });

  it("script creates a worksheet for invalid templates and exits zero", () => {
    copyFixture("examples/invalid/empty-overview.template.md", "content/lecture.template.md");

    const result = runReviewSourceScript();

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Validation: failed");
    const worksheetFiles = readdirSync(path.join(tempRoot, "docs/review-worksheets"));
    expect(worksheetFiles).toHaveLength(1);
    const worksheet = readFileSync(path.join(tempRoot, "docs/review-worksheets", worksheetFiles[0]), "utf8");
    expect(worksheet).toContain("Not ready for source fidelity approval until validation passes");
  });

  it("script exits nonzero when the worksheet cannot be written", () => {
    copyFixture("examples/golden.template.md", "content/lecture.template.md");
    writeText("docs/review-worksheets", "not a directory");

    const result = runReviewSourceScript();

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Source fidelity review failed:");
  });
});

function runReviewSourceScript() {
  copyFixture("scripts/ts-loader.mjs", "scripts/ts-loader.mjs");
  const stdoutPath = path.join(tempRoot, "review-source.stdout.log");
  const stderrPath = path.join(tempRoot, "review-source.stderr.log");
  const stdoutFd = openSync(stdoutPath, "w");
  const stderrFd = openSync(stderrPath, "w");
  const result = spawnSync(
    process.execPath,
    ["--import", path.join(repoRoot, "scripts/register-ts-loader.mjs"), path.join(repoRoot, "scripts/reviewSource.ts")],
    {
      cwd: tempRoot,
      encoding: "utf8",
      stdio: ["ignore", stdoutFd, stderrFd]
    }
  );
  closeSync(stdoutFd);
  closeSync(stderrFd);

  return {
    ...result,
    stdout: readFileSync(stdoutPath, "utf8"),
    stderr: readFileSync(stderrPath, "utf8")
  };
}

function copyFixture(sourcePath: string, destinationPath: string) {
  const source = readFileSync(path.join(repoRoot, sourcePath), "utf8");
  writeText(destinationPath, source);
}

function writeText(destinationPath: string, contents: string) {
  const absolutePath = path.join(tempRoot, destinationPath);
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, contents, "utf8");
}
