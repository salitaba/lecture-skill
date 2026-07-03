import nextConfig from "eslint-config-next";

const config = [
  ...nextConfig,
  {
    ignores: ["node_modules/**", ".next/**", "coverage/**", "dist/**", "*.tsbuildinfo"]
  }
];

export default config;
