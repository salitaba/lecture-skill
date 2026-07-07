"use client";

import { useProgress } from "./ProgressProvider";
import { Button } from "@/components/component-kit";

export function ResumePrompt() {
  const { resumeTarget, jumpToResumeTarget, dismissResumePrompt } = useProgress();

  if (!resumeTarget) return null;

  return (
    <aside className="resume-prompt" aria-label="Resume lecture">
      <p>
        Continue from <strong>{resumeTarget.title ?? resumeTarget.anchor}</strong>
      </p>
      <div className="resume-prompt-actions">
        <Button
          as="a"
          size="compact"
          className="resume-prompt-action"
          href={`#${resumeTarget.anchor}`}
          onClick={(event) => {
            event.preventDefault();
            jumpToResumeTarget();
          }}
        >
          Continue reading
        </Button>
        <Button variant="ghost" tone="text" className="resume-prompt-dismiss" onClick={dismissResumePrompt}>
          Dismiss
        </Button>
      </div>
    </aside>
  );
}
