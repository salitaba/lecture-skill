"use client";

import { useCollectionProgress } from "./CollectionProgressProvider";
import { ProgressMeter } from "@/components/component-kit";

export function CollectionProgressBar() {
  const { completedSections, totalSections, percentComplete, storageAvailable, loaded } = useCollectionProgress();
  const progressKnown = loaded;
  const progressText = !loaded
    ? "Loading progress"
    : totalSections > 0 && percentComplete === 100
      ? `${completedSections} of ${totalSections} sections completed. Course complete.`
      : totalSections > 0 && completedSections === 0
        ? `0 of ${totalSections} sections completed. Not started yet.`
        : `${completedSections} of ${totalSections} sections completed (${percentComplete}%).`;
  const storageText = loaded && !storageAvailable ? " Progress is session-only and not saved in this browser." : "";

  return (
    <section className="collection-progress" aria-labelledby="collection-progress-title">
      <div>
        <p className="section-kicker">Progress</p>
        <h2 id="collection-progress-title">Course progress</h2>
        <p className="collection-progress-status" aria-live="polite">{progressText}{storageText}</p>
      </div>
      <ProgressMeter value={progressKnown ? percentComplete : undefined} label="Course progress" />
    </section>
  );
}

export function CollectionLectureProgress({ slug }: { slug: string }) {
  const { lectures, loaded } = useCollectionProgress();
  const summary = lectures.find((lecture) => lecture.slug === slug);

  if (!loaded) {
    return (
      <div className="collection-progress-mini collection-progress-mini-loading" aria-label={`Progress for ${slug}`}>
        <p>Loading progress</p>
      </div>
    );
  }
  if (!summary) return null;
  if (summary.percentComplete === 0) return null;

  return (
    <div className="collection-progress-mini" aria-label={`Progress for ${slug}`}>
      <p>
        {summary.percentComplete === 100 ? "Completed — " : null}
        {summary.completedSections} of {summary.totalSections} sections completed ({summary.percentComplete}%)
      </p>
      <ProgressMeter value={summary.percentComplete} label={`Progress for ${slug}`} size="mini" />
    </div>
  );
}
