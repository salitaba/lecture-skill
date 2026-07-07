"use client";

import { useCollectionProgress } from "./CollectionProgressProvider";
import { ProgressMeter } from "@/components/component-kit";

export function CollectionProgressBar() {
  const { completedSections, totalSections, percentComplete, storageAvailable, loaded } = useCollectionProgress();

  return (
    <section className="collection-progress" aria-labelledby="collection-progress-title">
      <div>
        <p className="section-kicker">Progress</p>
        <h2 id="collection-progress-title">Course progress</h2>
        <p>
          {completedSections} of {totalSections} sections completed ({percentComplete}%)
          {loaded && !storageAvailable ? " (not saved)" : ""}
        </p>
      </div>
      <ProgressMeter value={percentComplete} label="Course progress" />
    </section>
  );
}

export function CollectionLectureProgress({ slug }: { slug: string }) {
  const { lectures } = useCollectionProgress();
  const summary = lectures.find((lecture) => lecture.slug === slug);

  if (!summary) return null;

  return (
    <div className="collection-progress-mini" aria-label={`Progress for ${slug}`}>
      <p>
        {summary.completedSections} of {summary.totalSections} sections completed ({summary.percentComplete}%)
      </p>
      <ProgressMeter value={summary.percentComplete} label={`Progress for ${slug}`} size="mini" />
    </div>
  );
}
