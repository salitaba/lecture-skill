import { createDoctorReport, renderDoctorReport } from "../../lib/lecture-template/doctor";

export async function runDoctor(): Promise<number> {
  try {
    const report = await createDoctorReport();
    process.stdout.write(renderDoctorReport(report));
    return 0;
  } catch (error) {
    process.stderr.write(`Could not inspect project: ${error instanceof Error ? error.message : String(error)}\n`);
    return 1;
  }
}
