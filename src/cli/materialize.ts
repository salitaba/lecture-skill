import { cp, mkdir, rm, stat, symlink } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { getPackageRoot } from "./paths";

const APP_ENTRIES: Array<{ src: string; dest: string }> = [
  { src: "src/app", dest: "src/app" },
  { src: "src/components", dest: "src/components" },
  { src: "src/lib", dest: "src/lib" },
  { src: "next.config.ts", dest: "next.config.ts" },
  { src: "next-env.d.ts", dest: "next-env.d.ts" },
  { src: "tsconfig.app.json", dest: "tsconfig.json" },
  { src: "package.json", dest: "package.json" }
];

/**
 * The generated app must live outside the installed package's node_modules tree.
 * Next can then treat it as a normal application root while LECTURE_CONTENT_ROOT
 * keeps the consumer's authored files as the source of truth.
 */
export function getMaterializedAppDirPath(): string {
  return path.join(process.cwd(), ".lecture-site-engine", "app");
}

export async function materializeAppDir(): Promise<string> {
  const packageRoot = getPackageRoot();
  const workDir = getMaterializedAppDirPath();

  await mkdir(workDir, { recursive: true });

  for (const entry of APP_ENTRIES) {
    const dest = path.join(workDir, entry.dest);
    await rm(dest, { recursive: true, force: true });
    await mkdir(path.dirname(dest), { recursive: true });
    await cp(path.join(packageRoot, entry.src), dest, { recursive: true });
  }

  await prepareNodeModules(workDir, packageRoot);

  return workDir;
}

const RUNTIME_DEPENDENCIES = ["next", "react", "react-dom", "mermaid", "yaml"];

async function prepareNodeModules(workDir: string, packageRoot: string): Promise<void> {
  const nodeModulesPath = path.join(workDir, "node_modules");
  const consumerNodeModules = path.join(process.cwd(), "node_modules");

  await rm(nodeModulesPath, { recursive: true, force: true });

  if (await hasRuntimeDependencies(consumerNodeModules)) {
    // Keep an existing consumer install without copying a potentially large
    // dependency tree. The dev/build commands use webpack, which can consume
    // this compatibility link from the materialized app.
    await symlink(consumerNodeModules, nodeModulesPath, "dir");
  } else {
    // A content-only consumer may not have node_modules at all. Link to the
    // dependencies already installed with the CLI package instead of creating
    // the dangling link that made the old preview command fail at startup.
    const packagedNodeModules = resolvePackagedNodeModules(packageRoot);
    await symlink(packagedNodeModules, nodeModulesPath, "dir");
  }
}

async function hasRuntimeDependencies(nodeModulesPath: string): Promise<boolean> {
  if (!(await pathExists(nodeModulesPath))) return false;

  const results = await Promise.all(
    RUNTIME_DEPENDENCIES.map((dependency) => pathExists(path.join(nodeModulesPath, dependency, "package.json")))
  );
  return results.every(Boolean);
}

function resolvePackagedNodeModules(packageRoot: string): string {
  const require = createRequire(path.join(packageRoot, "package.json"));
  const nextPackagePath = require.resolve("next/package.json", { paths: [packageRoot] });
  return path.dirname(path.dirname(nextPackagePath));
}

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await stat(targetPath);
    return true;
  } catch (error) {
    if (error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}
