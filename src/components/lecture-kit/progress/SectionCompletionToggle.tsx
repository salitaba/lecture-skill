"use client";

import { useProgressOptional } from "./ProgressProvider";

export function SectionCompletionToggle({ anchor, title }: { anchor: string; title: string }) {
  const progressContext = useProgressOptional();
  const progress = progressContext?.progress ?? {};
  const toggleSection = progressContext?.toggleSection;
  const completed = progress[anchor] === true;

  return (
    <div className="section-completion">
      <button
        type="button"
        className="section-completion-toggle"
        aria-pressed={completed}
        aria-label={completed ? `Mark ${title} incomplete` : `Mark ${title} complete`}
        onClick={() => toggleSection?.(anchor)}
      >
        <span aria-hidden="true">{completed ? "✓" : ""}</span>
      </button>
      <span className="section-completion-label" aria-hidden="true">
        {completed ? "Complete" : "Mark complete"}
      </span>
      <span className="section-completion-print">Progress: {completed ? "complete" : "incomplete"}</span>
    </div>
  );
}
