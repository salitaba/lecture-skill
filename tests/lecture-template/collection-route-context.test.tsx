import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import CollectionLecturePage from "../../src/app/lectures/[slug]/page";

const repoRoot = process.cwd();
let tempRoot = "";

beforeEach(() => {
  tempRoot = mkdtempSync(path.join(os.tmpdir(), "lecture-collection-route-"));
  process.chdir(tempRoot);
});

afterEach(() => {
  process.chdir(repoRoot);
  if (tempRoot) {
    rmSync(tempRoot, { recursive: true, force: true });
  }
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

function setupTwoLectureCollection() {
  copyFixture("examples/multi-lecture/lectures/01-introduction/lecture.template.md", "lectures/01-introduction/lecture.template.md");
  copyFixture("examples/multi-lecture/lectures/02-core-concepts/lecture.template.md", "lectures/02-core-concepts/lecture.template.md");
}

function setupThreeLectureCollection() {
  copyFixture("examples/multi-lecture/lectures/01-introduction/lecture.template.md", "lectures/01-introduction/lecture.template.md");
  copyFixture("examples/multi-lecture/lectures/02-core-concepts/lecture.template.md", "lectures/02-core-concepts/lecture.template.md");
  writeText(
    "lectures/03-wrap-up/lecture.template.md",
    `---
title: "Wrap Up"
description: "Final summary."
audience: "Engineers"
duration: "10 minutes"
level: "beginner"
---

## Overview

Wrap up content.

## Learning Objectives

- Summarize.

## Section: Conclusion

Final thoughts.

## Key Takeaways

- All done.
`
  );
}

describe("collection lecture route context", () => {
  it("returns notFound for a missing slug", async () => {
    setupTwoLectureCollection();

    await expect(
      CollectionLecturePage({ params: Promise.resolve({ slug: "99-nonexistent" }) })
    ).rejects.toThrow();
  });

  it("renders first lecture with next but no previous", async () => {
    setupTwoLectureCollection();

    const html = await renderToStaticMarkup(
      await CollectionLecturePage({ params: Promise.resolve({ slug: "01-introduction" }) })
    );

    expect(html).toContain("Opening The Collection");
    expect(html).toContain('href="/lectures/02-core-concepts"');
    expect(html).toContain("Core Concepts");
    expect(html).not.toContain('href="/lectures/01-introduction"');
    expect(html).toContain('href="/"');
    expect(html).toContain("Back to course");
    expect(html).toContain("lecture-nav-top");
  });

  it("renders last lecture with previous but no next", async () => {
    setupTwoLectureCollection();

    const html = await renderToStaticMarkup(
      await CollectionLecturePage({ params: Promise.resolve({ slug: "02-core-concepts" }) })
    );

    expect(html).toContain("Core Concepts");
    expect(html).toContain('href="/lectures/01-introduction"');
    expect(html).toContain("Opening");
    expect(html).not.toContain('href="/lectures/03-wrap-up"');
    expect(html).toContain('href="/"');
    expect(html).toContain("Back to course");
  });

  it("renders middle lecture with both previous and next", async () => {
    setupThreeLectureCollection();

    const html = await renderToStaticMarkup(
      await CollectionLecturePage({ params: Promise.resolve({ slug: "02-core-concepts" }) })
    );

    expect(html).toContain('href="/lectures/01-introduction"');
    expect(html).toContain('href="/lectures/03-wrap-up"');
    expect(html).toContain('href="/"');
    expect(html).toContain("Back to course");
  });

  it("provides back link targeting course landing", async () => {
    setupTwoLectureCollection();

    const html = await renderToStaticMarkup(
      await CollectionLecturePage({ params: Promise.resolve({ slug: "01-introduction" }) })
    );

    const backLinks = (html.match(/class="lecture-nav-link lecture-nav-back" href="\/"/g) ?? []).length;
    expect(backLinks).toBeGreaterThanOrEqual(1);
  });

  it("renders lecture content in collection mode", async () => {
    setupTwoLectureCollection();

    const html = await renderToStaticMarkup(
      await CollectionLecturePage({ params: Promise.resolve({ slug: "01-introduction" }) })
    );

    expect(html).toContain("lecture-layout");
    expect(html).toContain("Learning path");
    expect(html).toContain("Overview");
    expect(html).toContain("Key Takeaways");
  });
});
