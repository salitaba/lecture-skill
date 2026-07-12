#!/usr/bin/env node
import { runValidate } from "./commands/validate";
import { runNewLecture } from "./commands/newLecture";
import { runNewCollection } from "./commands/newCollection";
import { runDoctor } from "./commands/doctor";
import { runReviewSource } from "./commands/reviewSource";
import { runDev } from "./commands/dev";
import { runBuild } from "./commands/build";
import { runPackageReview } from "./commands/packageReview";

const usage = `Usage: lecture-site-engine <command> [options]

Commands:
  validate [--json] [path]   Validate the active lecture template or collection
  new:lecture                 Scaffold the next lecture template
  new:collection               Scaffold a new lecture collection
  doctor                       Report project readiness
  review:source                 Write a source fidelity review worksheet
  dev                           Start a preview server at http://localhost:3000
  build                         Run a production build
  package:review                 Validate, build, and export a static review package
`;

async function main(): Promise<number> {
  const [command, ...rest] = process.argv.slice(2);

  switch (command) {
    case "validate":
      return runValidate(rest);
    case "new:lecture":
      return runNewLecture();
    case "new:collection":
      return runNewCollection();
    case "doctor":
      return runDoctor();
    case "review:source":
      return runReviewSource();
    case "dev":
      return runDev();
    case "build":
      return (await runBuild()).status;
    case "package:review":
      return runPackageReview();
    default:
      process.stdout.write(usage);
      return command === undefined || command === "--help" || command === "-h" ? 0 : 1;
  }
}

main().then((status) => {
  process.exitCode = status;
});
