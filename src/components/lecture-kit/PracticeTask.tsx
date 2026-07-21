"use client";

import type { PracticeTaskComponent } from "@/lib/lecture-template/types";
import { Button, DisclosureTrigger, LabeledSection, useDisclosure } from "@/components/component-kit";
import { AssessmentFeedback, AssessmentShell, useHydrated, useLocalAssessmentLifecycle } from "./assessment/AssessmentShell";
import { AssessmentReviewControls } from "./AssessmentReviewControls";
import { useReviewOptional } from "./progress/ReviewProvider";
import { CodeBlock } from "./CodeBlock";

export function PracticeTask({ component, assessmentId = component.id ?? component.anchor }: { component: PracticeTaskComponent; assessmentId?: string }) {
  const review = useReviewOptional();
  const { open: hintsRevealed, toggle: toggleHints, regionId: hintsRegionId } = useDisclosure("hints");
  const { open: solutionRevealed, toggle: toggleSolution, regionId: solutionRegionId } = useDisclosure("solution");
  const { status, markUnderstood, markNeedsReview } = useLocalAssessmentLifecycle();
  const hydrated = useHydrated();
  const hintsLabelId = `${hintsRegionId}-label`;
  const solutionLabelId = `${solutionRegionId}-label`;
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
      label="Practice task"
      title={component.title}
      className="practice-task-card"
      noScriptFallback={
        <>
          {component.hints?.length ? <>Hints: {component.hints.join("; ")} </> : null}
          {component.solution ? <>Solution: {component.solution}</> : null}
        </>
      }
    >
      {component.scenario ? <LabeledSection label="Scenario"><p>{component.scenario}</p></LabeledSection> : null}
      <LabeledSection label="Task"><p>{component.task}</p></LabeledSection>
      {component.steps ? <LabeledSection label="Steps"><ol>{component.steps.map((step, index) => <li key={`${step}-${index}`}>{step}</li>)}</ol></LabeledSection> : null}
      {component.starter_code ? (
        <LabeledSection label="Starter code" className="practice-starter-code">
          <CodeBlock component={{ type: "code_block", language: component.starter_code.language, code: component.starter_code.code }} />
        </LabeledSection>
      ) : null}
      {component.rubric ? (
        <LabeledSection label="Rubric" className="practice-rubric">
          <ul>{component.rubric.map((item, index) => <li key={`${item.criterion}-${index}`}><strong>{item.criterion}:</strong> {item.expected}</li>)}</ul>
        </LabeledSection>
      ) : null}
      <div className="assessment-lifecycle-actions" aria-label="Self-assessment">
        <Button size="compact" onClick={understood}>Mark as understood</Button>
        <Button variant="ghost" size="compact" onClick={needsReview}>Needs review</Button>
      </div>
      {status !== "unattempted" ? <AssessmentFeedback>{status === "needs_review" ? "Marked for review." : "Marked as understood."}</AssessmentFeedback> : null}
      {component.hints ? (
        <>
          <DisclosureTrigger className="assessment-reveal-button" open={hintsRevealed} regionId={hintsRegionId} onToggle={toggleHints}>
            {hintsRevealed ? "Hide hints" : "Show hints"}
          </DisclosureTrigger>
          <div id={hintsRegionId} className="assessment-hidden-region" hidden={hydrated && !hintsRevealed} aria-labelledby={hintsLabelId}>
            <p id={hintsLabelId} className="assessment-region-label">Hints</p>
            <ul>{component.hints.map((hint, index) => <li key={`${hint}-${index}`}>{hint}</li>)}</ul>
          </div>
        </>
      ) : null}
      {component.solution ? (
        <>
          <DisclosureTrigger className="assessment-reveal-button" open={solutionRevealed} regionId={solutionRegionId} onToggle={toggleSolution}>
            {solutionRevealed ? "Hide solution" : "Show solution"}
          </DisclosureTrigger>
          <div id={solutionRegionId} className="assessment-hidden-region" hidden={hydrated && !solutionRevealed} aria-labelledby={solutionLabelId}>
            <p id={solutionLabelId} className="assessment-region-label">Solution</p>
            <p>{component.solution}</p>
          </div>
        </>
      ) : null}
      <AssessmentReviewControls activityKey={assessmentId} evaluated={status !== "unattempted"} mode="rubric" />
    </AssessmentShell>
  );
}
