"use client";

import { useProgress } from "./ProgressProvider";
import { Button, ProgressMeter } from "@/components/component-kit";

export function LectureProgressBar() {
  const { completedSections, totalSections, percentComplete, resetProgress, storageAvailable, loaded } = useProgress();
  const hasWork = completedSections > 0;
  const progressSummary = !loaded
    ? "Loading progress"
    : percentComplete === 100
      ? `Lecture complete — ${completedSections} of ${totalSections} ${totalSections === 1 ? "section" : "sections"} finished.`
      : `${completedSections} of ${totalSections} ${totalSections === 1 ? "section" : "sections"} completed`;

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
            {progressSummary}
            {loaded && !storageAvailable ? " (not saved; session only)" : ""}
          </p>
        </div>
      </div>

      <ProgressMeter value={loaded ? percentComplete : undefined} label="Lecture progress" />

      <div className="lecture-progress-footer">
        {hasWork ? (
          <span className="progress-reset-row">
            <Button variant="ghost" tone="muted" className="progress-reset-button" onClick={onReset} aria-keyshortcuts="Alt+R">
              Reset progress
            </Button>
            <span className="progress-reset-shortcut-hint">Alt+R</span>
          </span>
        ) : null}
      </div>
    </section>
  );
}
