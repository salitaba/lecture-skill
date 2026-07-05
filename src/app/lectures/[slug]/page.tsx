import { notFound } from "next/navigation";
import { LecturePage } from "@/components/lecture-kit/LecturePage";
import { ValidationScreen } from "@/components/lecture-kit/ValidationScreen";
import { scanLectureCollection, validateCollection } from "@/lib/lecture-template/collection";

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

  return <LecturePage lecture={lecture.template} templatePath={lecture.templatePath} />;
}
