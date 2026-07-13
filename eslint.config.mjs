import nextConfig from "eslint-config-next";

const config = [
  ...nextConfig,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".lecture-site-engine/**",
      "coverage/**",
      "dist/**",
      "out/**",
      "review-packages/**",
      "*.tsbuildinfo"
    ]
  }
];

export default config;
