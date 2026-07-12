import { rm, stat } from "node:fs/promises";
import path from "node:path";
import {
  assembleReviewPackage,
  runReviewPackagePreflight,
  verifyReviewPackageSourceSnapshot
} from "../../lib/lecture-template/reviewPackage";
import { getMaterializedAppDirPath } from "../materialize";
import { runBuild } from "./build";

export async function runPackageReview(): Promise<number> {
  const contentRoot = process.cwd();
  const outDir = path.join(getMaterializedAppDirPath(), "out");
  const packagesRoot = path.join(contentRoot, "review-packages");

  const preflight = await runReviewPackagePreflight();
  if (preflight.validation.stdout) process.stdout.write(preflight.validation.stdout);
  if (preflight.validation.stderr) process.stderr.write(preflight.validation.stderr);

  if (!preflight.valid) {
    return 1;
  }

  if (await pathExists(outDir)) {
    process.stderr.write(
      "Cannot create review package because a stale build output already exists. Remove it and run package:review again.\n"
    );
    return 1;
  }

  const snapshot = await verifyReviewPackageSourceSnapshot(preflight);
  if (!snapshot.ok) {
    process.stderr.write(`${snapshot.message ?? "Source template changed after validation."}\n`);
    return 1;
  }

  try {
    const build = await runBuild({ exportStatic: true });
    if (build.status !== 0) {
      throw new Error(`next build exited with status ${build.status}`);
    }

    const result = await assembleReviewPackage(preflight, {
      exportedOutDir: outDir,
      packagesRoot
    });

    process.stdout.write("\nReview package created.\n");
    process.stdout.write(`Package directory: ${result.packageDir}\n`);
    process.stdout.write(`Open: ${result.entryHtmlPath}\n`);
    process.stdout.write(`Source fidelity worksheet: ${path.join(result.packageDir, "REVIEW_WORKSHEET.md")}\n`);

    const includedRawSources = result.manifest.rawEvidence.filter((source) => source.status === "present");
    const missingPrimarySources = result.manifest.rawEvidence.filter(
      (source) => source.status === "missing" && source.role === "primary"
    );

    if (includedRawSources.length > 0) {
      process.stdout.write("Included raw source evidence:\n");
      for (const source of includedRawSources) {
        process.stdout.write(`- ${source.sourcePath} -> ${source.packagePath}\n`);
      }
    } else {
      process.stdout.write("Included raw source evidence: none\n");
    }

    if (missingPrimarySources.length > 0) {
      process.stdout.write("Missing raw source evidence:\n");
      for (const source of missingPrimarySources) {
        process.stdout.write(`- ${source.sourcePath}\n`);
      }
    }

    return 0;
  } catch (error) {
    process.stderr.write(`Review package failed: ${error instanceof Error ? error.message : String(error)}\n`);
    return 1;
  } finally {
    await rm(outDir, { recursive: true, force: true });
  }
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
