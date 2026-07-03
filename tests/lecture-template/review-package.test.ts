import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  assembleReviewPackage,
  createReviewPackageManifest,
  renderReviewPackageManifestMarkdown,
  rewriteExportedHtmlForFileProtocol,
  runReviewPackagePreflight,
  verifyReviewPackageSourceSnapshot
} from "../../src/lib/lecture-template/reviewPackage";

const repoRoot = process.cwd();
let tempRoot = "";

describe("review package helpers", () => {
  beforeEach(() => {
    tempRoot = mkdtempSync(path.join(os.tmpdir(), "lecture-review-package-"));
    process.chdir(tempRoot);
  });

  afterEach(() => {
    process.chdir(repoRoot);
    if (tempRoot) {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it("captures a valid single-lecture source snapshot and route plan", async () => {
    copyFixture("examples/golden.template.md", "content/lecture.template.md");

    const preflight = await runReviewPackagePreflight();

    expect(preflight.valid).toBe(true);
    expect(preflight.mode).toBe("single-lecture");
    expect(preflight.lectureCount).toBe(1);
    expect(preflight.routes).toEqual([{ route: "/", outputPath: "index.html" }]);
    expect(preflight.sources).toEqual([
      {
        templatePath: "content/lecture.template.md",
        packagePath: "source/content/lecture.template.md",
        contents: readFileSync(path.join(tempRoot, "content/lecture.template.md"), "utf8")
      }
    ]);
    expect(preflight.lectures[0]).toMatchObject({
      title: "Evidence-Driven Debugging for Production Incidents",
      sourceTemplatePath: "content/lecture.template.md",
      renderedOutputPath: "index.html",
      sectionCount: 4
    });
  });

  it("captures collection sources in authored order and excludes inactive single-lecture content", async () => {
    copyFixture("examples/golden.template.md", "content/lecture.template.md");
    copyFixture(
      "examples/multi-lecture/lectures/02-core-concepts/lecture.template.md",
      "lectures/02-core-concepts/lecture.template.md"
    );
    copyFixture(
      "examples/multi-lecture/lectures/01-introduction/lecture.template.md",
      "lectures/01-introduction/lecture.template.md"
    );

    const preflight = await runReviewPackagePreflight();

    expect(preflight.valid).toBe(true);
    expect(preflight.mode).toBe("collection");
    expect(preflight.lectureCount).toBe(2);
    expect(preflight.lectures.map((lecture) => lecture.slug)).toEqual(["01-introduction", "02-core-concepts"]);
    expect(preflight.sources.map((source) => source.packagePath)).toEqual([
      "source/lectures/01-introduction/lecture.template.md",
      "source/lectures/02-core-concepts/lecture.template.md"
    ]);
    expect(preflight.routes.map((route) => route.outputPath)).toEqual([
      "index.html",
      "lectures/01-introduction/index.html",
      "lectures/02-core-concepts/index.html"
    ]);
    expect(preflight.ignoredInactiveTemplatePaths).toEqual(["content/lecture.template.md"]);
  });

  it("fails source snapshot verification when content changes after preflight", async () => {
    copyFixture("examples/golden.template.md", "content/lecture.template.md");
    const preflight = await runReviewPackagePreflight();

    writeText("content/lecture.template.md", `${readFileSync(path.join(tempRoot, "content/lecture.template.md"), "utf8")}\n`);

    await expect(verifyReviewPackageSourceSnapshot(preflight)).resolves.toEqual({
      ok: false,
      message: expect.stringContaining("Source template changed after validation")
    });
  });

  it("fails raw evidence snapshot verification when raw source changes after preflight", async () => {
    copyFixture("examples/golden.template.md", "content/lecture.template.md");
    writeText("content/raw-lecture.txt", "Original raw source.");
    const preflight = await runReviewPackagePreflight();

    writeText("content/raw-lecture.txt", "Changed raw source.");

    await expect(verifyReviewPackageSourceSnapshot(preflight)).resolves.toEqual({
      ok: false,
      message: expect.stringContaining("Raw source evidence changed after validation")
    });
  });

  it("returns invalid preflight results without creating package output", async () => {
    copyFixture("examples/invalid/empty-overview.template.md", "content/lecture.template.md");

    const single = await runReviewPackagePreflight();

    expect(single.valid).toBe(false);
    expect(single.validation.status).toBe(1);
    expect(single.validation.stderr).toContain("Invalid lecture template: content/lecture.template.md");
    expect(pathExists("review-packages")).toBe(false);

    rmSync(path.join(tempRoot, "content"), { recursive: true, force: true });
    copyFixture("examples/invalid/invalid-level.template.md", "lectures/01-introduction/lecture.template.md");

    const collection = await runReviewPackagePreflight();

    expect(collection.valid).toBe(false);
    expect(collection.mode).toBe("collection");
    expect(collection.validation.stdout).toContain("[FAIL] 01-introduction/lecture.template.md");
    expect(pathExists("review-packages")).toBe(false);
  });

  it("builds a stable manifest model and readable MANIFEST.md", async () => {
    copyFixture("examples/golden.template.md", "content/lecture.template.md");
    writeText("content/raw-lecture.txt", "Raw source for review.");
    const preflight = await runReviewPackagePreflight();

    const manifest = createReviewPackageManifest(preflight, {
      createdAt: new Date("2026-07-04T01:30:00.000Z"),
      packagePath: "review-packages/2026-07-04-0130-lecture-site",
      runtimeMetadata: {
        gitCommit: "unavailable",
        gitDirtyStatus: "unavailable",
        npmVersion: "unavailable"
      }
    });

    expect(manifest).toMatchObject({
      createdAt: "2026-07-04T01:30:00.000Z",
      projectName: "lecture-site-engine",
      packageType: "static-review-package",
      sourceMode: "single-lecture",
      validationCommand: "npm run validate",
      validationResult: "passed",
      exportedRouteCount: 1,
      lectureCount: 1,
      entryHtmlPath: "index.html",
      packagePath: "review-packages/2026-07-04-0130-lecture-site",
      gitCommit: "unavailable",
      gitDirtyStatus: "unavailable",
      npmVersion: "unavailable"
    });
    expect(JSON.stringify(manifest)).not.toContain("You are about to use Codex");

    const markdown = renderReviewPackageManifestMarkdown(manifest);
    expect(markdown).toContain("Mode: single-lecture");
    expect(markdown).toContain("Lectures: 1");
    expect(markdown).toContain("Entry file: index.html");
    expect(markdown).toContain("Source: content/lecture.template.md");
    expect(markdown).toContain("## Raw Source Evidence");
    expect(markdown).toContain("content/raw-lecture.txt: present -> source/content/raw-lecture.txt");
    expect(markdown).toContain("Package path: review-packages/2026-07-04-0130-lecture-site");
  });

  it("marks missing raw source evidence in package manifests without failing assembly", async () => {
    copyFixture("examples/golden.template.md", "content/lecture.template.md");
    const preflight = await runReviewPackagePreflight();
    writeText("out/index.html", '<a href="/">Home</a>');

    const result = await assembleReviewPackage(preflight, {
      exportedOutDir: path.join(tempRoot, "out"),
      packagesRoot: path.join(tempRoot, "review-packages"),
      createdAt: new Date(2026, 6, 4, 1, 30),
      runtimeMetadata: {
        gitCommit: "unavailable",
        gitDirtyStatus: "unavailable",
        npmVersion: "unavailable"
      }
    });

    const manifest = JSON.parse(readFileSync(path.join(result.packageDir, "manifest.json"), "utf8"));
    const manifestMarkdown = readFileSync(path.join(result.packageDir, "MANIFEST.md"), "utf8");
    const worksheet = readFileSync(path.join(result.packageDir, "REVIEW_WORKSHEET.md"), "utf8");

    expect(manifest.rawEvidence).toEqual([
      {
        sourcePath: "content/raw-lecture.txt",
        packagePath: "source/content/raw-lecture.txt",
        status: "missing",
        role: "primary"
      }
    ]);
    expect(manifestMarkdown).toContain("content/raw-lecture.txt: missing (primary)");
    expect(worksheet).toContain("Primary raw source: content/raw-lecture.txt (missing)");
    expect(pathExists(path.join(result.packageDir, "source/content/raw-lecture.txt"))).toBe(false);
  });

  it("rewrites root exported HTML for direct file opening", () => {
    const packageRoot = path.join(tempRoot, "package");
    const htmlPath = path.join(packageRoot, "index.html");
    const html = [
      '<a href="/">Home</a>',
      '<a href="/lectures/01-introduction/">Lecture</a>',
      '<link rel="stylesheet" href="/_next/static/css/app.css">',
      '<link rel="modulepreload" href="/_next/static/chunks/app.js">',
      '<script src="/_next/static/chunks/main.js"></script>',
      '<img src="/_next/static/media/hero.png" srcset="/_next/static/media/hero.png 1x, /_next/static/media/hero@2x.png 2x">',
      '<a href="https://example.com/path">External</a>',
      '<a href="//cdn.example.com/file.js">Protocol</a>',
      '<a href="#section">Hash</a>',
      '<a href="mailto:review@example.com">Email</a>',
      '<a href="tel:+10000000000">Phone</a>',
      '<img src="data:image/png;base64,AAAA">',
      '<a href="manifest.json">Manifest</a>'
    ].join("");

    const rewritten = rewriteExportedHtmlForFileProtocol(html, htmlPath, packageRoot);

    expect(rewritten).toContain('href="index.html"');
    expect(rewritten).toContain('href="lectures/01-introduction/index.html"');
    expect(rewritten).toContain('href="_next/static/css/app.css"');
    expect(rewritten).toContain('href="_next/static/chunks/app.js"');
    expect(rewritten).toContain('src="_next/static/chunks/main.js"');
    expect(rewritten).toContain('src="_next/static/media/hero.png"');
    expect(rewritten).toContain('srcset="_next/static/media/hero.png 1x, _next/static/media/hero@2x.png 2x"');
    expect(rewritten).toContain('href="https://example.com/path"');
    expect(rewritten).toContain('href="//cdn.example.com/file.js"');
    expect(rewritten).toContain('href="#section"');
    expect(rewritten).toContain('href="mailto:review@example.com"');
    expect(rewritten).toContain('href="tel:+10000000000"');
    expect(rewritten).toContain('src="data:image/png;base64,AAAA"');
    expect(rewritten).toContain('href="manifest.json"');
  });

  it("rewrites nested exported HTML to root and sibling pages", () => {
    const packageRoot = path.join(tempRoot, "package");
    const htmlPath = path.join(packageRoot, "lectures", "01-introduction", "index.html");
    const html =
      '<a href="/">Back</a><a href="/lectures/02-core-concepts/">Next</a><script src="/_next/static/chunks/main.js"></script>';

    const rewritten = rewriteExportedHtmlForFileProtocol(html, htmlPath, packageRoot);

    expect(rewritten).toContain('href="../../index.html"');
    expect(rewritten).toContain('href="../02-core-concepts/index.html"');
    expect(rewritten).toContain('src="../../_next/static/chunks/main.js"');
  });

  it("assembles a package from exported output and captured sources", async () => {
    copyFixture("examples/golden.template.md", "content/lecture.template.md");
    writeText("content/raw-lecture.txt", "Captured raw source.");
    const preflight = await runReviewPackagePreflight();
    writeText("content/raw-lecture.txt", "Changed after preflight but before assembly.");
    writeText("out/index.html", '<a href="/lectures/01-introduction/">Lecture</a><script src="/_next/static/main.js"></script>');
    writeText("out/_next/static/main.js", "console.log('ok');");

    const result = await assembleReviewPackage(preflight, {
      exportedOutDir: path.join(tempRoot, "out"),
      packagesRoot: path.join(tempRoot, "review-packages"),
      createdAt: new Date(2026, 6, 4, 1, 30),
      runtimeMetadata: {
        gitCommit: "unavailable",
        gitDirtyStatus: "unavailable",
        npmVersion: "unavailable"
      }
    });

    expect(result.packageDir).toBe(path.join(tempRoot, "review-packages", "2026-07-04-0130-lecture-site"));
    expect(readFileSync(path.join(result.packageDir, "index.html"), "utf8")).toContain('href="lectures/01-introduction/index.html"');
    expect(readFileSync(path.join(result.packageDir, "source/content/lecture.template.md"), "utf8")).toBe(
      readFileSync(path.join(tempRoot, "content/lecture.template.md"), "utf8")
    );
    expect(readFileSync(path.join(result.packageDir, "source/content/raw-lecture.txt"), "utf8")).toBe("Captured raw source.");
    expect(pathExists(path.join(result.packageDir, "manifest.json"))).toBe(true);
    expect(pathExists(path.join(result.packageDir, "MANIFEST.md"))).toBe(true);
    expect(pathExists(path.join(result.packageDir, "README.md"))).toBe(true);
    expect(pathExists(path.join(result.packageDir, "REVIEW_WORKSHEET.md"))).toBe(true);
    expect(pathExists(path.join(result.packageDir, "REVIEW_CHECKLIST.md"))).toBe(true);
    expect(readFileSync(path.join(result.packageDir, "README.md"), "utf8")).toContain("REVIEW_WORKSHEET.md");
    expect(result.manifest.contents.reviewerFiles).toContain("REVIEW_WORKSHEET.md");
  });

  it("packages collection raw evidence only from expected paths", async () => {
    copyFixture(
      "examples/multi-lecture/lectures/01-introduction/lecture.template.md",
      "lectures/01-introduction/lecture.template.md"
    );
    copyFixture(
      "examples/multi-lecture/lectures/02-core-concepts/lecture.template.md",
      "lectures/02-core-concepts/lecture.template.md"
    );
    writeText("lectures/01-introduction/raw-lecture.txt", "Introduction raw source.");
    writeText("lectures/02-core-concepts/raw-lecture.txt", "Core concepts raw source.");
    writeText("lectures/raw-course.txt", "Shared raw source.");
    writeText("lectures/notes/raw-lecture.txt", "Unrelated raw source.");
    const preflight = await runReviewPackagePreflight();
    writeText("out/index.html", '<a href="/lectures/01-introduction/">Lecture</a>');
    writeText("out/lectures/01-introduction/index.html", '<a href="/">Home</a>');
    writeText("out/lectures/02-core-concepts/index.html", '<a href="/">Home</a>');

    const result = await assembleReviewPackage(preflight, {
      exportedOutDir: path.join(tempRoot, "out"),
      packagesRoot: path.join(tempRoot, "review-packages"),
      createdAt: new Date(2026, 6, 4, 1, 30),
      runtimeMetadata: {
        gitCommit: "unavailable",
        gitDirtyStatus: "unavailable",
        npmVersion: "unavailable"
      }
    });

    expect(readFileSync(path.join(result.packageDir, "source/lectures/01-introduction/raw-lecture.txt"), "utf8")).toBe(
      "Introduction raw source."
    );
    expect(readFileSync(path.join(result.packageDir, "source/lectures/02-core-concepts/raw-lecture.txt"), "utf8")).toBe(
      "Core concepts raw source."
    );
    expect(readFileSync(path.join(result.packageDir, "source/lectures/raw-course.txt"), "utf8")).toBe("Shared raw source.");
    expect(pathExists(path.join(result.packageDir, "source/lectures/notes/raw-lecture.txt"))).toBe(false);
    expect(result.manifest.rawEvidence.map((source) => source.sourcePath)).toEqual([
      "lectures/raw-course.txt",
      "lectures/01-introduction/raw-lecture.txt",
      "lectures/02-core-concepts/raw-lecture.txt"
    ]);
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

function pathExists(targetPath: string): boolean {
  return existsSync(path.isAbsolute(targetPath) ? targetPath : path.join(tempRoot, targetPath));
}
