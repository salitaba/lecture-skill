import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { runInit } from "../../src/cli/commands/init";

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
    expect(readFileSync(path.join(tempRoot, "lectures/01-introduction/raw-lecture.txt"), "utf8")).toContain("Add raw source evidence");
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
});
