"use client";

import { useProgress } from "./ProgressProvider";

const milestones = [25, 50, 75, 100];

export function LectureProgressBar() {
  const { completedSections, totalSections, percentComplete, resetProgress, storageAvailable, loaded } = useProgress();

  const onReset = () => {
    if (window.confirm("Reset progress for this lecture?")) resetProgress();
  };

  return (
    <section className="lecture-progress" aria-labelledby="lecture-progress-title">
      <div className="lecture-progress-header">
        <div>
          <p className="section-kicker">Progress</p>
          <h2 id="lecture-progress-title">Lecture progress</h2>
          <p className="lecture-progress-summary">
            {completedSections} of {totalSections} {totalSections === 1 ? "section" : "sections"} completed
            {loaded && !storageAvailable ? " (not saved)" : ""}
          </p>
        </div>
      </div>

      <div
        className="lecture-progress-bar"
        role="progressbar"
        aria-label="Lecture progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentComplete}
      >
        <span className="lecture-progress-fill" style={{ width: `${percentComplete}%` }} />
      </div>

      <div className="lecture-progress-milestones-wrapper">
        <ol className="lecture-progress-milestones" aria-label="Progress milestones">
          {milestones.map((milestone) => (
            <li key={milestone} className={percentComplete >= milestone ? "milestone-complete" : undefined}>
              <span>{milestone}%</span>
            </li>
          ))}
        </ol>
        <p className="lecture-progress-milestones-summary" aria-label="Progress milestones">
          {milestones.filter((m) => percentComplete >= m).length} of {milestones.length} milestones reached
        </p>
      </div>

      <div className="lecture-progress-footer">
        <button type="button" className="progress-reset-button" onClick={onReset} disabled={totalSections === 0}>
          Reset progress
        </button>
      </div>
    </section>
  );
}
