import type { CollectionProgress, ProgressLecture } from "./progress";

export interface ResumeTarget {
  label: string;
  href: string;
  slug?: string;
}

export function calculateResumeTarget(
  progress: CollectionProgress,
  lectures: readonly ProgressLecture[],
  collectionTitle?: string
): ResumeTarget {
  const fallbackHref = lectures.length > 0 ? `/lectures/${lectures[0].slug}` : "/";
  const fallbackSlug = lectures[0]?.slug;

  if (Object.keys(progress).length === 0) {
    return { label: "Start course", href: fallbackHref, slug: fallbackSlug };
  }

  for (const lecture of lectures) {
    const lectureProgress = progress[lecture.slug];
    if (!lectureProgress) {
      return { label: "Resume course", href: `/lectures/${lecture.slug}`, slug: lecture.slug };
    }

    for (const section of lecture.sections) {
      if (lectureProgress[section.anchor] !== true) {
        return { label: "Resume course", href: `/lectures/${lecture.slug}#${section.anchor}`, slug: lecture.slug };
      }
    }
  }

  return { label: "Continue course", href: fallbackHref, slug: fallbackSlug };
}
