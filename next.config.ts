import type { NextConfig } from "next";

const nextConfig: NextConfig =
  process.env.LECTURE_REVIEW_EXPORT === "1"
    ? {
        output: "export",
        trailingSlash: true
      }
    : {};

export default nextConfig;
