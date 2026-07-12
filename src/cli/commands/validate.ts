import { ACTIVE_TEMPLATE_PATH } from "../../lib/lecture-template/readTemplate";
import { isCollectionMode } from "../../lib/lecture-template/collection";
import {
  validateCollectionCli,
  validateCollectionJsonCli,
  validateTemplateFile,
  validateTemplateFileJson
} from "../../lib/lecture-template/validateCli";

export async function runValidate(args: string[]): Promise<number> {
  let json = false;
  let templatePath = ACTIVE_TEMPLATE_PATH;
  let argumentError: string | undefined;

  for (const arg of args) {
    if (arg === "--json") {
      json = true;
    } else if (arg.startsWith("--")) {
      argumentError = `Unknown validate option: ${arg}`;
      break;
    } else if (templatePath === ACTIVE_TEMPLATE_PATH) {
      templatePath = arg;
    } else {
      argumentError = `Unexpected validate argument: ${arg}`;
      break;
    }
  }

  if (argumentError) {
    process.stderr.write(`${argumentError}\n`);
    return 1;
  }

  const collectionMode = await isCollectionMode();
  const output = collectionMode
    ? json
      ? await validateCollectionJsonCli()
      : await validateCollectionCli()
    : json
      ? await validateTemplateFileJson(templatePath)
      : await validateTemplateFile(templatePath);

  if (output.stdout) process.stdout.write(output.stdout);
  if (output.stderr) process.stderr.write(output.stderr);
  return output.status;
}
