import { spawn } from "node:child_process";
import { rm, stat } from "node:fs/promises";
import path from "node:path";
import {
  assembleReviewPackage,
  runReviewPackagePreflight,
  verifyReviewPackageSourceSnapshot
} from "../src/lib/lecture-template/reviewPackage";

const outDir = path.join(process.cwd(), "out");

async function main() {
  const preflight = await runReviewPackagePreflight();
  if (preflight.validation.stdout) process.stdout.write(preflight.validation.stdout);
  if (preflight.validation.stderr) process.stderr.write(preflight.validation.stderr);

  if (!preflight.valid) {
    process.exitCode = 1;
    return;
  }

  if (await pathExists(outDir)) {
    process.stderr.write(
      "Cannot create review package because out/ already exists. Move or remove out/ and run npm run package:review again.\n"
    );
    process.exitCode = 1;
    return;
  }

  const snapshot = await verifyReviewPackageSourceSnapshot(preflight);
  if (!snapshot.ok) {
    process.stderr.write(`${snapshot.message ?? "Source template changed after validation."}\n`);
    process.exitCode = 1;
    return;
  }

  try {
    await runStaticBuild();

    const result = await assembleReviewPackage(preflight, {
      exportedOutDir: outDir,
      packagesRoot: path.join(process.cwd(), "review-packages")
    });

    process.stdout.write("\nReview package created.\n");
    process.stdout.write(`Package directory: ${result.packageDir}\n`);
    process.stdout.write(`Open: ${result.entryHtmlPath}\n`);
    process.stdout.write(`Source fidelity worksheet: ${path.join(result.packageDir, "REVIEW_WORKSHEET.md")}\n`);

    const includedRawSources = result.manifest.rawEvidence.filter((source) => source.status === "present");
    const missingPrimarySources = result.manifest.rawEvidence.filter((source) => source.status === "missing" && source.role === "primary");
    const ignoredPlaceholders = result.manifest.rawEvidence.filter((source) => source.status === "placeholder");

    if (includedRawSources.length > 0) {
      process.stdout.write("Included human source evidence:\n");
      for (const source of includedRawSources) {
        process.stdout.write(`- ${source.sourcePath} -> ${source.packagePath}\n`);
      }
    } else {
      process.stdout.write("Included human source evidence: none\n");
    }

    if (missingPrimarySources.length > 0) {
      process.stdout.write("Missing primary human source evidence:\n");
      for (const source of missingPrimarySources) {
        process.stdout.write(`- ${source.sourcePath}\n`);
      }
    } else {
      process.stdout.write("Missing primary human source evidence: none\n");
    }

    if (ignoredPlaceholders.length > 0) {
      process.stdout.write("Ignored scaffold placeholders (replace with human source):\n");
      for (const source of ignoredPlaceholders) process.stdout.write(`- ${source.sourcePath}\n`);
    } else {
      process.stdout.write("Ignored scaffold placeholders: none\n");
    }
  } catch (error) {
    process.stderr.write(`Review package failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  } finally {
    await rm(outDir, { recursive: true, force: true });
  }
}

function runStaticBuild(): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("npm", ["run", "build"], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        LECTURE_REVIEW_EXPORT: "1"
      },
      stdio: "inherit"
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`next build exited with status ${code ?? "unknown"}`));
      }
    });
  });
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

await main();
