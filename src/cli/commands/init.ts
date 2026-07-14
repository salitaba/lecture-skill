import { cp, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { scaffoldCollection } from "../../lib/lecture-template/scaffold";
import { repositoryPath } from "../../lib/lecture-template/readTemplate";
import { getPackageRoot } from "../paths";

const coreSkillFiles = [
  "SKILL.md",
  ".claude/skills/lecture-site-engine/SKILL.md"
] as const;
const codexSkillRoot = ".codex/skills";

export interface InitOptions {
  packageRoot?: string;
}

export async function runInit(args: string[] = [], options: InitOptions = {}): Promise<number> {
  if (args.length > 0) {
    process.stderr.write(`The init command does not accept options: ${args[0]}\n`);
    return 1;
  }

  const packageRoot = options.packageRoot ?? getPackageRoot();
  const installed: string[] = [];
  const skipped: string[] = [];
  const skillFiles = [
    ...coreSkillFiles,
    ...(await collectFiles(path.join(packageRoot, codexSkillRoot), codexSkillRoot))
  ];

  for (const relativePath of skillFiles) {
    const destination = repositoryPath(relativePath);
    if (await pathExists(destination)) {
      skipped.push(relativePath);
      continue;
    }

    await mkdir(path.dirname(destination), { recursive: true });
    await cp(path.join(packageRoot, relativePath), destination);
    installed.push(relativePath);
  }

  let scaffoldMessage = "";
  const hasCollection = await pathExists(repositoryPath("lectures"));
  const hasSingleTemplate = await pathExists(repositoryPath("content/lecture.template.md"));

  if (!hasCollection && !hasSingleTemplate) {
    const result = await scaffoldCollection();
    scaffoldMessage = result.message;
  } else {
    scaffoldMessage = "Existing lecture project detected; preserved its authored files.";
  }

  process.stdout.write("Lecture Site Engine initialized.\n");
  process.stdout.write(`- ${scaffoldMessage}\n`);
  if (installed.length > 0) {
    process.stdout.write(`Installed ${installed.length} agent skill files.\n`);
    const installedCodexSkills = skillNames(installed);
    if (installedCodexSkills.length > 0) {
      process.stdout.write(`Available Codex skills:\n${installedCodexSkills.map((name) => `- ${name}`).join("\n")}\n`);
    }
  }
  if (skipped.length > 0) process.stdout.write(`Preserved ${skipped.length} existing agent skill files.\n`);
  process.stdout.write(
    `Next steps:\n- ${nextSourceStep({ hasCollection, hasSingleTemplate })}\n- Ask Claude Code or Codex to follow the lecture-site-engine skill\n- Run npx lecture-site-engine validate\n- Run npx lecture-site-engine dev\n`
  );

  return 0;
}

function nextSourceStep(options: { hasCollection: boolean; hasSingleTemplate: boolean }): string {
  if (options.hasCollection) {
    return "Add or verify real human source evidence at each lectures/<slug>/raw-lecture.txt; replace any scaffold placeholders before asking an agent to author a lecture";
  }
  if (options.hasSingleTemplate) {
    return "Add or verify real human source evidence at content/raw-lecture.txt before asking an agent to author the lecture";
  }
  return "Replace the scaffold placeholder in lectures/01-introduction/raw-lecture.txt with real human course material";
}

async function pathExists(absolutePath: string): Promise<boolean> {
  try {
    await stat(absolutePath);
    return true;
  } catch (error) {
    if (error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}

async function collectFiles(absoluteDirectory: string, relativeDirectory: string): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(absoluteDirectory, { withFileTypes: true });
  } catch (error) {
    if (error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const files: string[] = [];
  for (const entry of entries) {
    const absolutePath = path.join(absoluteDirectory, entry.name);
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(absolutePath, relativePath)));
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }
  return files.sort();
}

function skillNames(files: string[]): string[] {
  return [...new Set(
    files
      .filter((file) => file.startsWith(`${codexSkillRoot}/`))
      .map((file) => file.split("/")[2])
      .filter((name): name is string => Boolean(name))
  )].sort();
}
