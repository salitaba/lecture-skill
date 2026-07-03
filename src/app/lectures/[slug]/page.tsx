import { LectureNavigation } from "@/components/lecture-kit/LectureNavigation";
import { LecturePage } from "@/components/lecture-kit/LecturePage";
import { ValidationScreen } from "@/components/lecture-kit/ValidationScreen";
import { readLectureEntry, scanLectureCollection } from "@/lib/lecture-template/collection";
import { parseLectureTemplate } from "@/lib/lecture-template/parseTemplate";
import type { LectureCollectionEntry } from "@/lib/lecture-template/types";
import { validateTemplateSource } from "@/lib/lecture-template/validateTemplate";
import { notFound } from "next/navigation";

export const dynamicParams = false;

const staticExportPlaceholderSlug = "__review-package-placeholder__";

export async function generateStaticParams() {
  const collection = await scanLectureCollection();
  if (collection.entries.length === 0 && process.env.LECTURE_REVIEW_EXPORT === "1") {
    return [{ slug: staticExportPlaceholderSlug }];
  }

  return collection.entries.map((entry) => ({ slug: entry.slug }));
}

export default async function LectureSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === staticExportPlaceholderSlug) {
    notFound();
  }

  const collection = await scanLectureCollection();
  const currentIndex = collection.entries.findIndex((entry) => entry.slug === slug);

  if (currentIndex === -1) {
    notFound();
  }

  const entry = collection.entries[currentIndex];
  const source = await readLectureEntry(entry);
  const result = validateTemplateSource(source);
  const [previous, next] = await Promise.all([
    currentIndex > 0 ? buildNavigationTarget(collection.entries[currentIndex - 1]) : Promise.resolve(undefined),
    currentIndex < collection.entries.length - 1 ? buildNavigationTarget(collection.entries[currentIndex + 1]) : Promise.resolve(undefined)
  ]);

  if (!result.valid) {
    return (
      <>
        <ValidationScreen errors={result.errors} templatePath={entry.templatePath} />
        <LectureNavigation previous={previous} next={next} />
      </>
    );
  }

  return (
    <>
      <LecturePage lecture={result.template} templatePath={entry.templatePath} />
      <LectureNavigation previous={previous} next={next} />
    </>
  );
}

async function buildNavigationTarget(entry: LectureCollectionEntry) {
  const source = await readLectureEntry(entry);
  const parsed = parseLectureTemplate(source);
  const validation = validateTemplateSource(source);
  const title = validation.valid ? validation.template.metadata.title : stringValue(parsed.frontmatter.value.title);

  return {
    slug: entry.slug,
    title: title.trim() || humanizeSlug(entry.slug)
  };
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function humanizeSlug(slug: string): string {
  const base = slug.replace(/^\d{2}-/, "").replace(/[-_]+/g, " ").trim();
  if (base === "") return slug;
  return base.replace(/\b\w/g, (character) => character.toUpperCase());
}
