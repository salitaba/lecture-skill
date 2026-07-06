import type { CollectionProgress, ProgressLecture } from "./progress";

export interface ResumeTarget {
  label: string;
  href: string;
}

export function calculateResumeTarget(
  progress: CollectionProgress,
  lectures: ProgressLecture[],
  collectionTitle?: string
): ResumeTarget {
  const fallbackHref = lectures.length > 0 ? `/lectures/${lectures[0].slug}` : "/";

  if (Object.keys(progress).length === 0) {
    return { label: "Start course", href: fallbackHref };
  }

  for (const lecture of lectures) {
    const lectureProgress = progress[lecture.slug];
    if (!lectureProgress) {
      return { label: "Resume course", href: `/lectures/${lecture.slug}` };
    }

    for (const section of lecture.sections) {
      if (lectureProgress[section.anchor] !== true) {
        return { label: "Resume course", href: `/lectures/${lecture.slug}#${section.anchor}` };
      }
    }
  }

  return { label: "Continue course", href: fallbackHref };
}
