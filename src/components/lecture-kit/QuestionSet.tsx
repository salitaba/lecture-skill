"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { QuestionSetComponent } from "@/lib/lecture-template/types";
import { Card, DisclosureTrigger, LabeledSection, RadioOptionGroup } from "@/components/component-kit";
import { useProgressOptional } from "./progress/ProgressProvider";

export function QuestionSet({ component, enableShuffle = true }: { component: QuestionSetComponent; enableShuffle?: boolean }) {
  const [previewShuffleEnabled, setPreviewShuffleEnabled] = useState(false);
  const shuffledOptions = useMemo(
    () => component.questions.map((question) => shuffleOptions(question.options)),
    [component.questions]
  );
  const optionsByQuestion = previewShuffleEnabled && component.shuffle_options ? shuffledOptions : component.questions.map((question) => question.options);

  useEffect(() => {
    const timer = window.setTimeout(() => setPreviewShuffleEnabled(enableShuffle && window.location.protocol !== "file:"), 0);
    return () => window.clearTimeout(timer);
  }, [enableShuffle]);

  return (
    <Card id={component.anchor} altitude="emphasis" label="Assessment: Question set" title={component.title} className="assessment-card question-set-card">
      {component.instructions ? <p className="assessment-instructions">{component.instructions}</p> : null}
      <div className="question-set-list">
        {component.questions.map((question, questionIndex) => (
          <QuestionSetItem
            key={`${question.question}-${questionIndex}`}
            question={question}
            options={optionsByQuestion[questionIndex]}
            itemKey={`${component.anchor}:${questionIndex}`}
          />
        ))}
      </div>
      <noscript className="assessment-noscript">
        Interactive answer reveal requires JavaScript. Printed output includes all answers and feedback.
      </noscript>
    </Card>
  );
}

function QuestionSetItem({
  question,
  options,
  itemKey
}: {
  question: QuestionSetComponent["questions"][number];
  options: string[];
  itemKey: string;
}) {
  const progressContext = useProgressOptional();
  const [selected, setSelected] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const baseId = useId();
  const answerRegionId = `${baseId}-answer`;
  const answerLabelId = `${answerRegionId}-label`;
  const questionHeadingId = `${answerRegionId}-heading`;
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current || !progressContext?.answersLoaded) return undefined;
    hydratedRef.current = true;
    const attempt = progressContext.answers[itemKey];
    if (!attempt) return undefined;

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setSelected(attempt.selected);
      setIsRevealed(true);
    });
    return () => {
      cancelled = true;
    };
  }, [itemKey, progressContext?.answers, progressContext?.answersLoaded]);

  const toggle = () => {
    const next = !isRevealed;
    if (next && selected !== null) {
      progressContext?.recordAnswer(itemKey, selected, selected === question.answer);
    }
    setIsRevealed(next);
  };

  return (
    <LabeledSection label={question.question} headingId={questionHeadingId} className="assessment-region">
      <RadioOptionGroup
        name={answerRegionId}
        options={options}
        selected={selected}
        onSelect={setSelected}
        optionClassName="assessment-option"
        groupClassName="assessment-options"
        groupLabelledBy={questionHeadingId}
      />
      {selected ? (
        <p className="assessment-selection">Selected: {selected}</p>
      ) : (
        <p className="assessment-selection">Select an option before revealing the answer.</p>
      )}
      <DisclosureTrigger className="assessment-reveal-button" open={isRevealed} regionId={answerRegionId} onToggle={toggle}>
        {isRevealed ? "Hide feedback" : "Reveal answer"}
      </DisclosureTrigger>
      <div id={answerRegionId} className="assessment-hidden-region" hidden={!isRevealed} aria-labelledby={answerLabelId}>
        <p id={answerLabelId} className="assessment-region-label">
          Answer
        </p>
        <p>{question.answer}</p>
        {question.feedback ? <p>{question.feedback}</p> : null}
      </div>
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
