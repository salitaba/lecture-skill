"use client";

import { useId } from "react";
import type { QuizComponent } from "@/lib/lecture-template/types";
import { Button, RadioOptionGroup } from "@/components/component-kit";
import { AssessmentFeedback, AssessmentShell, useChoiceAssessmentAttempt, useHydrated } from "./assessment/AssessmentShell";
import { AssessmentReviewControls } from "./AssessmentReviewControls";

export function Quiz({ component, assessmentId = component.id ?? component.anchor }: { component: QuizComponent; assessmentId?: string }) {
  const baseId = useId();
  const answerRegionId = `${baseId}-answer`;
  const answerLabelId = `${answerRegionId}-label`;
  const revealStatusId = `${baseId}-reveal-status`;
  const hydrated = useHydrated();
  const { selected, setSelected, revealed, toggleReveal, isCorrect, hasSelection, retry } = useChoiceAssessmentAttempt({
    key: component.anchor,
    answer: component.answer,
    activityKey: assessmentId
  });

  return (
    <AssessmentShell
      id={component.anchor}
      label="Quiz: Knowledge check"
      className="quiz-card"
      noScriptFallback={<>Answer: {component.answer}{component.explanation ? ` — ${component.explanation}` : ""}</>}
    >
      <h3 className="quiz-question">{component.question}</h3>
      <fieldset className="quiz-options-fieldset">
        <legend className="sr-only">Choose an answer</legend>
        <RadioOptionGroup
          name={`${baseId}-quiz`}
          idPrefix={`${baseId}-option`}
          options={component.options}
          selected={selected}
          onSelect={setSelected}
          disabled={revealed}
          optionClassName="quiz-option"
          groupClassName="quiz-options"
          groupLabelledBy={`${baseId}-question`}
          groupDescribedBy={revealed ? revealStatusId : undefined}
          optionExtraClassName={(option) =>
            [
              selected === option ? "quiz-option-selected" : null,
              revealed && option === component.answer ? "quiz-option-correct" : null,
              revealed && selected === option && option !== component.answer ? "quiz-option-incorrect" : null
            ]
              .filter(Boolean)
              .join(" ")
          }
        >
          <span id={`${baseId}-question`} className="sr-only">{component.question}</span>
          {revealed ? <span id={revealStatusId} className="sr-only">Answer revealed; options are locked.</span> : null}
        </RadioOptionGroup>
      </fieldset>
      {revealed && hasSelection ? <AssessmentFeedback variant={isCorrect ? "positive" : "negative"}>{isCorrect ? "Correct!" : "Not quite."}</AssessmentFeedback> : null}
      <Button className="quiz-reveal-button" aria-expanded={revealed} aria-controls={answerRegionId} onClick={toggleReveal}>
        {revealed ? "Hide answer" : hasSelection ? "Check answer" : "Show answer"}
      </Button>
      <div id={answerRegionId} className="quiz-answer" hidden={hydrated && !revealed} aria-labelledby={answerLabelId}>
        <p id={answerLabelId} className="quiz-answer-label">Answer</p>
        <p className="quiz-answer-value">{component.answer}</p>
        {component.explanation ? <p className="quiz-explanation">{component.explanation}</p> : null}
      </div>
      <AssessmentReviewControls activityKey={assessmentId} evaluated={revealed && hasSelection} canRetry={revealed} onRetry={retry} mode="choice" />
    </AssessmentShell>
  );
}
