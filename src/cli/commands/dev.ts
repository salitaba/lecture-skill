import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { materializeAppDir } from "../materialize";
import { getPackageRoot } from "../paths";

export async function runDev(): Promise<number> {
  const packageRoot = getPackageRoot();
  let appDir: string;
  try {
    appDir = await materializeAppDir();
  } catch (error) {
    process.stderr.write(`Failed to prepare the preview app: ${error instanceof Error ? error.message : String(error)}\n`);
    return 1;
  }

  const contentRoot = process.cwd();
  const require = createRequire(import.meta.url);
  const nextBin = require.resolve("next/dist/bin/next", { paths: [packageRoot] });

  process.stdout.write("Starting the Lecture Site Engine preview (webpack mode).\n");

  return new Promise((resolve) => {
    const child = spawn(process.execPath, [nextBin, "dev", "--webpack", appDir], {
      stdio: "inherit",
      env: { ...process.env, LECTURE_CONTENT_ROOT: contentRoot }
    });

    child.on("close", (code) => {
      if (code && code !== 0) process.stderr.write(`Preview server stopped with status ${code}.\n`);
      resolve(code ?? 1);
    });
    child.on("error", (error) => {
      process.stderr.write(`Failed to start dev server: ${error.message}\n`);
      resolve(1);
    });
  });
}
