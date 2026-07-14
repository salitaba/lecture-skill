import {
  collectMissingPrimarySourcePaths,
  collectPlaceholderPrimarySourcePaths,
  writeSourceReviewWorksheet
} from "../src/lib/lecture-template/sourceReview";

async function main() {
  try {
    const { worksheet, worksheetPath } = await writeSourceReviewWorksheet();
    const missingSources = collectMissingPrimarySourcePaths(worksheet);
    const placeholderSources = collectPlaceholderPrimarySourcePaths(worksheet);
    const presentSources = worksheet.lectures
      .map((lecture) => lecture.primarySource)
      .filter((source) => source.status === "present")
      .map((source) => source.sourcePath);

    process.stdout.write("Source fidelity review worksheet created.\n");
    process.stdout.write(`Worksheet: ${worksheetPath}\n`);
    process.stdout.write(`Mode: ${worksheet.mode}\n`);
    process.stdout.write(`Validation: ${worksheet.validation.result}\n`);
    process.stdout.write(`Lectures: ${worksheet.lectureCount}\n`);

    if (presentSources.length > 0) {
      process.stdout.write("Primary human source evidence:\n");
      for (const sourcePath of presentSources) process.stdout.write(`- ${sourcePath}\n`);
    } else {
      process.stdout.write("Primary human source evidence: none\n");
    }

    if (missingSources.length > 0) {
      process.stdout.write("Missing primary human source evidence:\n");
      for (const sourcePath of missingSources) {
        process.stdout.write(`- ${sourcePath}\n`);
      }
    } else {
      process.stdout.write("Missing primary human source evidence: none\n");
    }

    if (placeholderSources.length > 0) {
      process.stdout.write("Ignored scaffold placeholders (replace with human source):\n");
      for (const sourcePath of placeholderSources) process.stdout.write(`- ${sourcePath}\n`);
    } else {
      process.stdout.write("Ignored scaffold placeholders: none\n");
    }

    if (worksheet.sharedSource) {
      process.stdout.write(
        `Optional shared human source evidence: ${worksheet.sharedSource.sourcePath} (${worksheet.sharedSource.status})\n`
      );
    }

    process.stdout.write("Human review fields still need completion before source fidelity approval.\n");
  } catch (error) {
    process.stderr.write(`Source fidelity review failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

await main();
