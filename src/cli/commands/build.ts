import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { getMaterializedAppDirPath, materializeAppDir } from "../materialize";
import { getPackageRoot } from "../paths";

export interface RunBuildOptions {
  exportStatic?: boolean;
}

export interface RunBuildResult {
  status: number;
  appDir: string;
}

export async function runBuild(options: RunBuildOptions = {}): Promise<RunBuildResult> {
  const packageRoot = getPackageRoot();
  let appDir: string;
  try {
    appDir = await materializeAppDir();
  } catch (error) {
    process.stderr.write(`Failed to prepare the build app: ${error instanceof Error ? error.message : String(error)}\n`);
    return { status: 1, appDir: getMaterializedAppDirPath() };
  }
  const contentRoot = process.cwd();
  const require = createRequire(import.meta.url);
  const nextBin = require.resolve("next/dist/bin/next", { paths: [packageRoot] });

  const status = await new Promise<number>((resolve) => {
    const child = spawn(process.execPath, [nextBin, "build", "--webpack", appDir], {
      stdio: "inherit",
      env: {
        ...process.env,
        LECTURE_CONTENT_ROOT: contentRoot,
        ...(options.exportStatic ? { LECTURE_REVIEW_EXPORT: "1" } : {})
      }
    });

    child.on("close", (code) => resolve(code ?? 1));
    child.on("error", (error) => {
      process.stderr.write(`Failed to run build: ${error.message}\n`);
      resolve(1);
    });
  });

  return { status, appDir };
}
