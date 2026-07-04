import { scaffoldLecture } from "../src/lib/lecture-template/scaffold";

const result = await scaffoldLecture();

process.stdout.write(`${result.message}\n`);
if (result.createdPaths.length > 0) {
  process.stdout.write(`Created:\n${result.createdPaths.map((createdPath) => `- ${createdPath}`).join("\n")}\n`);
}
if (result.nextCommands.length > 0) {
  process.stdout.write(`Next commands:\n${result.nextCommands.map((command) => `- ${command}`).join("\n")}\n`);
}

process.exitCode = result.ok ? 0 : 1;
