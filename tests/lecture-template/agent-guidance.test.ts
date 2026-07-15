import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { runInit } from "../../src/cli/commands/init";

const repoRoot = process.cwd();
let tempRoot = "";

const guidancePaths = [
  ".claude/skills/lecture-site-engine/SKILL.md",
  "SKILL.md",
  ".codex/skills/lecture-site-engine/SKILL.md",
  "AGENTS.md",
  "CLAUDE.md"
];

function readGuidance() {
  return guidancePaths.map((relativePath) => readFileSync(path.join(repoRoot, relativePath), "utf8"));
}

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
    const guidance = readGuidance();

    for (const contents of guidance) {
      expect(contents).toMatch(/never (?:create|creating).*raw|never.*(?:edit|rewrite|overwrite).*raw/i);
      expect(contents).toMatch(/raw-course\.txt/);
      expect(contents).toMatch(/explicit(?:ly)? requested|presence alone is not authorization/i);
      expect(contents).toMatch(/placeholder.*(?:not|non-).*evidence|placeholder.*replace/i);
      expect(contents).toMatch(/cryptograph(?:ic|ically).*AI-generated|AI-generated.*cryptograph/i);
    }
  });

  it("keeps the staged authoring UX aligned across all guidance entry points", () => {
    for (const contents of readGuidance()) {
      expect(contents).toMatch(/source[- ]status|source-aware intake/i);
      expect(contents).toMatch(/standalone.{0,80}collection|collection.{0,80}standalone/i);
      expect(contents).toMatch(/standalone.{0,100}(?:one lecture|stays|remains)/i);
      expect(contents).toMatch(/01-introduction/);
      expect(contents).toMatch(/starter scaffold|scaffold.{0,40}(?:course plan|course outline|does not define)/i);
      expect(contents).toMatch(/broad.{0,140}(?:targeted|recommended|silently|not a course plan)|silently.{0,100}(?:starter|lecture|course)/i);
      expect(contents).toMatch(/targeted.{0,80}(?:scope|lecture.?vs.?course|standalone)|recommended.{0,80}(?:collection|assumption)/i);
      expect(contents).toMatch(/(?:direct|explicit).{0,50}user authorization|explicit.{0,50}authorization/i);
      expect(contents).toMatch(/research brief/);
      expect(contents).toMatch(/outline/);
      expect(contents).toMatch(/scope checkpoint/);
      expect(contents).toMatch(/resource_links/);
      expect(contents).toMatch(/derived draft/);
      expect(contents).toMatch(/derived draft.{0,120}(?:never|does not).{0,120}(?:human evidence|present human)/i);
      expect(contents).toMatch(/content\/lecture\.template\.md.{0,160}lectures\/<slug>\/lecture\.template\.md|lectures\/<slug>\/lecture\.template\.md.{0,160}content\/lecture\.template\.md/);
      expect(contents).toMatch(/(?:created|updated).{0,80}files/);
      expect(contents).toMatch(/lecture count/);
      expect(contents).toMatch(/validation/);
      expect(contents).toMatch(/human-source.{0,40}(?:evidence|status)|evidence.{0,40}status/i);
      expect(contents).toMatch(/warnings/);
      expect(contents).toMatch(/next action/);
      expect(contents).toMatch(/runtime.{0,50}(?:URL )?fetch/i);
      expect(contents).toMatch(/(?:npm run dev|npx lecture-site-engine dev)/);
      expect(contents).toMatch(/(?:ready|reported).{0,80}(?:URL|preview)|(?:URL|preview).{0,80}(?:respond|HTTP)/i);
      expect(contents).toMatch(/(?:do not|don't).{0,100}(?:bypass|launch Next|npm cache)/i);
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
