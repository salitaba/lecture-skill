import { defineConfig } from "tsup";

export default defineConfig({
  entry: { cli: "src/cli/index.ts" },
  outDir: "dist",
  format: ["esm"],
  target: "node20",
  clean: true,
  splitting: false,
  sourcemap: false,
  external: ["next", "react", "react-dom", "mermaid", "yaml"]
});
