"use client";

import { useProgress } from "./ProgressProvider";

export function ResumePrompt() {
  const { resumeTarget, jumpToResumeTarget, dismissResumePrompt } = useProgress();

  if (!resumeTarget) return null;

  return (
    <div className="resume-progress-prompt" role="status">
      <p>
        Resume with <strong>{resumeTarget.title ?? resumeTarget.anchor}</strong>.
      </p>
      <div className="resume-progress-actions">
        <button type="button" onClick={jumpToResumeTarget}>
          Jump to section
        </button>
        <button type="button" className="resume-dismiss-button" onClick={dismissResumePrompt}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
