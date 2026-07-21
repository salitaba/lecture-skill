"use client";

import type { FlashcardComponent } from "@/lib/lecture-template/types";
import { useId } from "react";
import { Button, DisclosureTrigger } from "@/components/component-kit";
import { AssessmentFeedback, AssessmentShell, useHydrated, useLocalAssessmentLifecycle } from "./assessment/AssessmentShell";
import { AssessmentReviewControls } from "./AssessmentReviewControls";
import { useReviewOptional } from "./progress/ReviewProvider";

export function Flashcard({ component, assessmentId = component.id ?? component.anchor ?? "flashcard" }: { component: FlashcardComponent; assessmentId?: string }) {
  const review = useReviewOptional();
  const { status, revealed, toggleReveal, markUnderstood, markNeedsReview } = useLocalAssessmentLifecycle();
  const hydrated = useHydrated();
  const answerId = `${useId()}-answer`;
  const reveal = () => {
    toggleReveal();
    if (!revealed) review?.recordActivity(assessmentId, { revealed: true });
  };
  const understood = () => {
    markUnderstood();
    review?.recordActivity(assessmentId, { revealed: true, selfAssessment: "understood" });
  };
  const needsReview = () => {
    markNeedsReview();
    review?.recordActivity(assessmentId, { revealed: true, selfAssessment: "needs_review" });
    review?.markReviewRecommended(assessmentId);
  };

  return (
    <AssessmentShell
      id={component.anchor}
      label={`Flashcard${component.category ? `: ${component.category}` : ""}`}
      title={component.prompt}
      className="flashcard"
      noScriptFallback={<>Answer: {component.answer}</>}
    >
      {component.hint ? <p className="flashcard-hint">Hint: {component.hint}</p> : null}
      <DisclosureTrigger variant="ghost" className="flashcard-reveal" open={revealed} regionId={answerId} onToggle={reveal}>
        {revealed ? "Hide answer" : "Reveal answer"}
      </DisclosureTrigger>
      <div id={answerId} className="flashcard-answer" hidden={hydrated && !revealed}>
        <p className="flashcard-answer-label">Answer</p>
        <p>{component.answer}</p>
      </div>
      <div className="assessment-lifecycle-actions" aria-label="Self-assessment">
        <Button size="compact" onClick={understood}>Mark as understood</Button>
        <Button variant="ghost" size="compact" onClick={needsReview}>Needs review</Button>
      </div>
      {status !== "unattempted" ? <AssessmentFeedback>{status === "needs_review" ? "Marked for review." : "Marked as understood."}</AssessmentFeedback> : null}
      <AssessmentReviewControls activityKey={assessmentId} evaluated={status !== "unattempted"} mode="reveal" />
    </AssessmentShell>
  );
}
