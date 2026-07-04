import { createDoctorReport, renderDoctorReport } from "../src/lib/lecture-template/doctor";

try {
  const report = await createDoctorReport();
  process.stdout.write(renderDoctorReport(report));
  process.exitCode = 0;
} catch (error) {
  process.stderr.write(`Could not inspect project: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
