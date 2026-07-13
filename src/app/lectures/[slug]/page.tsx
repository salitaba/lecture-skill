import { notFound } from "next/navigation";
import { LecturePage } from "@/components/lecture-kit/LecturePage";
import { ValidationScreen } from "@/components/lecture-kit/ValidationScreen";
import { scanLectureCollection, validateCollection } from "@/lib/lecture-template/collection";
import { collectionProgressKey, progressIdFromCollectionBase } from "@/lib/lecture-template/progress";
import { LECTURES_DIR } from "@/lib/lecture-template/readTemplate";

export async function generateStaticParams() {
  const collection = await scanLectureCollection({ logSkippedDirectories: false });
  return collection.entries.map((entry) => ({ slug: entry.slug }));
}

export default async function CollectionLecturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const validation = await validateCollection({ logSkippedDirectories: false });
  const lecture = validation.results.find((result) => result.slug === slug);

  if (!lecture) {
    notFound();
  }

  if (!lecture.valid || !lecture.template) {
    return <ValidationScreen errors={lecture.errors} templatePath={lecture.templatePath} />;
  }

  const validResults = validation.results.filter((result) => result.valid && result.template);
  const currentIndex = validResults.findIndex((result) => result.slug === slug);
  const previous = currentIndex > 0 ? validResults[currentIndex - 1] : undefined;
  const next = currentIndex < validResults.length - 1 ? validResults[currentIndex + 1] : undefined;

  const courseMetadata = validation.courseMetadata.status === "valid" ? validation.courseMetadata.metadata : undefined;
  const collectionId = progressIdFromCollectionBase(LECTURES_DIR, courseMetadata?.title);
  const storageKey = collectionProgressKey(collectionId);
  const progressLectures = validResults.map((result) => ({
    slug: result.slug,
    sections: result.template!.sections.map((section) => ({ anchor: section.anchor, title: section.title }))
  }));

  return (
    <LecturePage
      lecture={lecture.template}
      templatePath={lecture.templatePath}
      collectionNavigation={{
        previous: previous ? { slug: previous.slug, title: previous.template!.metadata.title } : undefined,
        next: next ? { slug: next.slug, title: next.template!.metadata.title } : undefined,
        backHref: "/",
        backLabel: "Back to course"
      }}
      collectionContext={{
        collectionStorageKey: storageKey,
        collectionLectures: progressLectures
      }}
    />
  );
}
