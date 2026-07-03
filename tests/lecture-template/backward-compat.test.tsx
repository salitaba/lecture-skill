import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Home from "../../src/app/page";

const repoRoot = process.cwd();
let tempRoot = "";

describe("root page backward compatibility", () => {
  beforeEach(() => {
    tempRoot = mkdtempSync(path.join(os.tmpdir(), "lecture-backward-compat-"));
    process.chdir(tempRoot);
  });

  afterEach(() => {
    process.chdir(repoRoot);
    if (tempRoot) {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it("renders the single lecture when lectures is absent", async () => {
    copyFixture("content/lecture.template.md", "content/lecture.template.md");

    const html = renderToStaticMarkup(<>{await Home()}</>);

    expect(html).toContain("Evidence-Driven Debugging for Production Incidents");
    expect(html).toContain("lecture-header");
    expect(html).not.toContain("Lecture Collection");
    expect(html).not.toContain("collection-landing");
  });

  it("switches to collection mode when lectures exists", async () => {
    writeText(
      "content/lecture.template.md",
      `---
title: "Ignored Single Lecture"
description: "This lecture should not appear when collection mode is active."
audience: "Engineers"
duration: "15 minutes"
level: "beginner"
---

## Overview

Ignored.

## Learning Objectives

- Ignore this lecture.

## Section: Ignore

Ignored.

## Key Takeaways

- Ignored.
`
    );
    copyFixture("examples/multi-lecture/lectures/01-introduction/lecture.template.md", "lectures/01-introduction/lecture.template.md");
    copyFixture("examples/multi-lecture/lectures/02-core-concepts/lecture.template.md", "lectures/02-core-concepts/lecture.template.md");

    const html = renderToStaticMarkup(<>{await Home()}</>);

    expect(html).toContain("Lecture Collection");
    expect(html).toContain("collection-landing");
    expect(html).toContain("lecture-list");
    expect(html).toContain("Opening The Collection");
    expect(html).toContain("Core Concepts For The Collection");
    expect(html).not.toContain("Ignored Single Lecture");
    expect(html).not.toContain("Evidence-Driven Debugging for Production Incidents");
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
