import { fileURLToPath } from "node:url";
import path from "node:path";

export function getPackageRoot(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, "..");
}
