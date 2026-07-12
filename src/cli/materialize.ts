import { cp, mkdir, rm, symlink } from "node:fs/promises";
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
 * Turbopack/webpack treat anything under a node_modules path as pre-built vendor
 * code and refuse to transform it, even when it's the explicit project root passed
 * to `next dev`/`next build` - so the bundled app can't run straight out of the
 * installed package directory. It also rejects a node_modules symlink that points
 * outside its project's filesystem subtree, so the materialized copy has to live
 * inside the consumer project (sibling to their real node_modules), not in the OS
 * temp dir.
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

  await relinkNodeModules(workDir);

  return workDir;
}

async function relinkNodeModules(workDir: string): Promise<void> {
  const linkPath = path.join(workDir, "node_modules");
  const consumerNodeModules = path.join(process.cwd(), "node_modules");

  // Removing a symlink never touches the target's contents, only the link itself.
  await rm(linkPath, { recursive: true, force: true });
  await symlink(consumerNodeModules, linkPath, "dir");
}
