import { collectMissingPrimarySourcePaths, writeSourceReviewWorksheet } from "../src/lib/lecture-template/sourceReview";

async function main() {
  try {
    const { worksheet, worksheetPath } = await writeSourceReviewWorksheet();
    const missingSources = collectMissingPrimarySourcePaths(worksheet);

    process.stdout.write("Source fidelity review worksheet created.\n");
    process.stdout.write(`Worksheet: ${worksheetPath}\n`);
    process.stdout.write(`Mode: ${worksheet.mode}\n`);
    process.stdout.write(`Validation: ${worksheet.validation.result}\n`);
    process.stdout.write(`Lectures: ${worksheet.lectureCount}\n`);

    if (missingSources.length > 0) {
      process.stdout.write("Missing raw source evidence:\n");
      for (const sourcePath of missingSources) {
        process.stdout.write(`- ${sourcePath}\n`);
      }
    } else {
      process.stdout.write("Missing raw source evidence: none\n");
    }

    process.stdout.write("Human review fields still need completion before source fidelity approval.\n");
  } catch (error) {
    process.stderr.write(`Source fidelity review failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

await main();
