import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { runInit } from "../../src/cli/commands/init";

const repoRoot = process.cwd();
let tempRoot = "";

describe("raw-source agent guidance contract", () => {
  beforeEach(() => {
    tempRoot = mkdtempSync(path.join(os.tmpdir(), "lecture-guidance-"));
    process.chdir(tempRoot);
  });

  afterEach(() => {
    process.chdir(repoRoot);
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
  });

  it("keeps the ownership and opt-in policy aligned across repository guidance", () => {
    const guidance = [
      ".claude/skills/lecture-site-engine/SKILL.md",
      "SKILL.md",
      ".codex/skills/lecture-site-engine/SKILL.md",
      "AGENTS.md",
      "CLAUDE.md"
    ].map((relativePath) => readFileSync(path.join(repoRoot, relativePath), "utf8"));

    for (const contents of guidance) {
      expect(contents).toMatch(/never (?:create|creating).*raw|never.*(?:edit|rewrite|overwrite).*raw/i);
      expect(contents).toMatch(/raw-course\.txt/);
      expect(contents).toMatch(/explicit(?:ly)? requested|presence alone is not authorization/i);
      expect(contents).toMatch(/placeholder.*(?:not|non-).*evidence|placeholder.*replace/i);
      expect(contents).toMatch(/cryptograph(?:ic|ically).*AI-generated|AI-generated.*cryptograph/i);
    }
  });

  it("installs only distributed skills and preserves repository-only guidance", async () => {
    const status = await runInit([], { packageRoot: repoRoot });

    expect(status).toBe(0);
    expect(existsSync(path.join(tempRoot, "SKILL.md"))).toBe(true);
    expect(existsSync(path.join(tempRoot, ".claude/skills/lecture-site-engine/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(tempRoot, ".codex/skills/lecture-site-engine/SKILL.md"))).toBe(true);
    expect(existsSync(path.join(tempRoot, "AGENTS.md"))).toBe(false);
    expect(existsSync(path.join(tempRoot, "CLAUDE.md"))).toBe(false);
    expect(readFileSync(path.join(tempRoot, "SKILL.md"), "utf8")).toContain("Raw source files are human/user/educator evidence");
  });
});
