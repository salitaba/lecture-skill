import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lecture Site Engine",
    short_name: "Lectures",
    description: "Local lecture preview generated from a structured template.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#134e4a",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" }
    ]
  };
}
