import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { materializeAppDir } from "../materialize";
import { getPackageRoot } from "../paths";

export async function runDev(): Promise<number> {
  const packageRoot = getPackageRoot();
  const appDir = await materializeAppDir();
  const contentRoot = process.cwd();
  const require = createRequire(import.meta.url);
  const nextBin = require.resolve("next/dist/bin/next", { paths: [packageRoot] });

  return new Promise((resolve) => {
    const child = spawn(process.execPath, [nextBin, "dev", appDir], {
      stdio: "inherit",
      env: { ...process.env, LECTURE_CONTENT_ROOT: contentRoot }
    });

    child.on("close", (code) => resolve(code ?? 1));
    child.on("error", (error) => {
      process.stderr.write(`Failed to start dev server: ${error.message}\n`);
      resolve(1);
    });
  });
}
