"use client";

import { useProgress } from "./ProgressProvider";

export function ResumePrompt() {
  const { resumeTarget, jumpToResumeTarget, dismissResumePrompt } = useProgress();

  if (!resumeTarget) return null;

  return (
    <aside className="resume-prompt" aria-label="Resume lecture">
      <p>
        Continue from <strong>{resumeTarget.title ?? resumeTarget.anchor}</strong>
      </p>
      <div className="resume-prompt-actions">
        <a
          className="resume-prompt-action"
          href={`#${resumeTarget.anchor}`}
          onClick={(event) => {
            event.preventDefault();
            jumpToResumeTarget();
          }}
        >
          Continue reading
        </a>
        <button type="button" className="resume-prompt-dismiss" onClick={dismissResumePrompt}>
          Dismiss
        </button>
      </div>
    </aside>
  );
}
