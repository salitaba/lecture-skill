"use client";

import { useCollectionProgress } from "./CollectionProgressProvider";

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
      <div
        className="collection-progress-bar"
        role="progressbar"
        aria-label="Course progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentComplete}
      >
        <span className="collection-progress-fill" style={{ width: `${percentComplete}%` }} />
      </div>
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
      <div
        className="collection-progress-mini-bar"
        role="progressbar"
        aria-label={`Progress for ${slug}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={summary.percentComplete}
      >
        <span className="collection-progress-fill" style={{ width: `${summary.percentComplete}%` }} />
      </div>
    </div>
  );
}
