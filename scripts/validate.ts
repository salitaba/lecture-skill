import { ACTIVE_TEMPLATE_PATH } from "../src/lib/lecture-template/readTemplate";
import { isCollectionMode } from "../src/lib/lecture-template/collection";
import { validateCollectionCli, validateTemplateFile } from "../src/lib/lecture-template/validateCli";

const templatePath = process.argv[2] ?? ACTIVE_TEMPLATE_PATH;
const output = (await isCollectionMode()) ? await validateCollectionCli() : await validateTemplateFile(templatePath);

if (output.stdout) process.stdout.write(output.stdout);
if (output.stderr) process.stderr.write(output.stderr);
process.exit(output.status);
