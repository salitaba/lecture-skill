"use client";

import { useProgress } from "./ProgressProvider";
import { Button, ProgressMeter } from "@/components/component-kit";

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

      <ProgressMeter value={percentComplete} label="Lecture progress" />

      <div className="lecture-progress-footer">
        <span className="progress-reset-row">
          <Button
            variant="ghost"
            tone="muted"
            className="progress-reset-button"
            onClick={onReset}
            disabled={totalSections === 0}
            aria-keyshortcuts="Alt+R"
          >
            Reset progress
          </Button>
          <span className="progress-reset-shortcut-hint">Alt+R</span>
        </span>
      </div>
    </section>
  );
}
