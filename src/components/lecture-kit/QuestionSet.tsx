"use client";

import { useEffect, useId, useMemo, useState } from "react";
import type { QuestionSetComponent } from "@/lib/lecture-template/types";
import { DisclosureTrigger, LabeledSection, RadioOptionGroup } from "@/components/component-kit";
import { AssessmentShell, useChoiceAssessmentAttempt, useHydrated } from "./assessment/AssessmentShell";
import { AssessmentReviewControls } from "./AssessmentReviewControls";

export function QuestionSet({ component, enableShuffle = true, assessmentId = component.id ?? component.anchor }: { component: QuestionSetComponent; enableShuffle?: boolean; assessmentId?: string }) {
  const [previewShuffleEnabled, setPreviewShuffleEnabled] = useState(false);
  const shuffledOptions = useMemo(() => component.questions.map((question) => shuffleOptions(question.options)), [component.questions]);
  const optionsByQuestion = previewShuffleEnabled && component.shuffle_options ? shuffledOptions : component.questions.map((question) => question.options);

  useEffect(() => {
    const timer = window.setTimeout(() => setPreviewShuffleEnabled(enableShuffle && window.location.protocol !== "file:"), 0);
    return () => window.clearTimeout(timer);
  }, [enableShuffle]);

  return (
    <AssessmentShell
      id={component.anchor}
      label="Assessment: Question set"
      title={component.title}
      className="question-set-card"
      noScriptFallback={
        <ol>
          {component.questions.map((question, index) => <li key={`${question.question}-${index}`}>{question.answer}{question.feedback ? ` — ${question.feedback}` : ""}</li>)}
        </ol>
      }
    >
      {component.instructions ? <p className="assessment-instructions">{component.instructions}</p> : null}
      <div className="question-set-list">
        {component.questions.map((question, questionIndex) => (
          <QuestionSetItem
            key={`${question.question}-${questionIndex}`}
            question={question}
            options={optionsByQuestion[questionIndex] ?? question.options}
            itemKey={`${component.anchor}:${questionIndex}`}
            activityKey={`${assessmentId}:${questionIndex}`}
          />
        ))}
      </div>
    </AssessmentShell>
  );
}

function QuestionSetItem({ question, options, itemKey, activityKey }: { question: QuestionSetComponent["questions"][number]; options: string[]; itemKey: string; activityKey: string }) {
  const baseId = useId();
  const answerRegionId = `${baseId}-answer`;
  const answerLabelId = `${answerRegionId}-label`;
  const questionHeadingId = `${answerRegionId}-heading`;
  const hydrated = useHydrated();
  const { selected, setSelected, revealed, toggleReveal, isCorrect, retry } = useChoiceAssessmentAttempt({
    key: itemKey,
    answer: question.answer,
    lockAfterReveal: false,
    activityKey
  });

  const select = (value: string) => {
    setSelected(value);
  };

  return (
    <LabeledSection label={question.question} headingId={questionHeadingId} className="assessment-region">
      <RadioOptionGroup
        name={answerRegionId}
        options={options}
        selected={selected}
        onSelect={select}
        optionClassName="assessment-option"
        groupClassName="assessment-options"
        groupLabelledBy={questionHeadingId}
      />
      {selected ? <p className="assessment-selection">Selected: {selected}</p> : <p className="assessment-selection">Select an option before revealing the answer.</p>}
      <DisclosureTrigger className="assessment-reveal-button" open={revealed} regionId={answerRegionId} onToggle={toggleReveal}>
        {revealed ? "Hide feedback" : "Reveal answer"}
      </DisclosureTrigger>
      <div id={answerRegionId} className="assessment-hidden-region" hidden={hydrated && !revealed} aria-labelledby={answerLabelId}>
        <p id={answerLabelId} className="assessment-region-label">Answer</p>
        <p>{question.answer}</p>
        {selected ? <p className="assessment-feedback" role="status">{isCorrect ? "Correct." : "Not quite."}</p> : null}
        {question.feedback ? <p>{question.feedback}</p> : null}
      </div>
      <AssessmentReviewControls activityKey={activityKey} evaluated={revealed && Boolean(selected)} canRetry={revealed} onRetry={retry} mode="choice" />
    </LabeledSection>
  );
}

function shuffleOptions(options: string[]): string[] {
  const shuffled = [...options];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
}
