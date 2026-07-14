import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { runInit } from "../../src/cli/commands/init";
import { RAW_SOURCE_PLACEHOLDER, readRawSourceEvidence } from "../../src/lib/lecture-template/rawSourceEvidence";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
let tempRoot = "";

describe("project initialization", () => {
  beforeEach(() => {
    tempRoot = mkdtempSync(path.join(os.tmpdir(), "lecture-init-"));
    process.chdir(tempRoot);
  });

  afterEach(() => {
    process.chdir(repoRoot);
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
  });

  it("installs both agent skill entry points and a collection scaffold", async () => {
    const status = await runInit([], { packageRoot: repoRoot });

    expect(status).toBe(0);
    expect(existsSync(path.join(tempRoot, "SKILL.md"))).toBe(true);
    expect(existsSync(path.join(tempRoot, ".claude/skills/lecture-site-engine/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(tempRoot, ".codex/skills/lecture-site-engine/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(tempRoot, "lectures/course.yaml"))).toBe(true);
    expect(existsSync(path.join(tempRoot, "lectures/01-introduction/lecture.template.md"))).toBe(true);
    expect(readFileSync(path.join(tempRoot, "lectures/01-introduction/raw-lecture.txt"), "utf8")).toBe(RAW_SOURCE_PLACEHOLDER);
    expect(existsSync(path.join(tempRoot, "lectures/raw-course.txt"))).toBe(false);
    expect((await readRawSourceEvidence("lectures/01-introduction/raw-lecture.txt")).status).toBe("placeholder");
    const output = await runInit([], { packageRoot: repoRoot });
    expect(output).toBe(0);
    expect(readFileSync(path.join(tempRoot, "lectures/01-introduction/raw-lecture.txt"), "utf8")).toBe(RAW_SOURCE_PLACEHOLDER);
  });

  it("preserves existing agent files and authored project files", async () => {
    mkdirSync(path.join(tempRoot, ".claude/skills/lecture-site-engine"), { recursive: true });
    mkdirSync(path.join(tempRoot, "content"), { recursive: true });
    const existingSkill = "custom skill instructions\n";
    const existingTemplate = "custom lecture template\n";
    const skillPath = path.join(tempRoot, ".claude/skills/lecture-site-engine/SKILL.md");
    const templatePath = path.join(tempRoot, "content/lecture.template.md");
    writeFileSync(skillPath, existingSkill, "utf8");
    writeFileSync(templatePath, existingTemplate, "utf8");

    const status = await runInit([], { packageRoot: repoRoot });

    expect(status).toBe(0);
    expect(readFileSync(skillPath, "utf8")).toBe(existingSkill);
    expect(readFileSync(templatePath, "utf8")).toBe(existingTemplate);
  });

  it("preserves existing human raw sources and shared course evidence", async () => {
    mkdirSync(path.join(tempRoot, "lectures", "01-introduction"), { recursive: true });
    const primaryPath = path.join(tempRoot, "lectures/01-introduction/raw-lecture.txt");
    const sharedPath = path.join(tempRoot, "lectures/raw-course.txt");
    writeFileSync(primaryPath, "Human lecture source.\n", "utf8");
    writeFileSync(sharedPath, "Human shared course source.\n", "utf8");

    const status = await runInit([], { packageRoot: repoRoot });

    expect(status).toBe(0);
    expect(readFileSync(primaryPath, "utf8")).toBe("Human lecture source.\n");
    expect(readFileSync(sharedPath, "utf8")).toBe("Human shared course source.\n");
  });
});
