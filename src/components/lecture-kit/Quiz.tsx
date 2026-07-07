"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { QuizComponent } from "@/lib/lecture-template/types";
import { Button, Card, RadioOptionGroup } from "@/components/component-kit";
import { useProgressOptional } from "./progress/ProgressProvider";

export function Quiz({ component }: { component: QuizComponent }) {
  const progressContext = useProgressOptional();
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const hydratedRef = useRef(false);
  const baseId = useId();
  const answerRegionId = `${baseId}-answer`;
  const answerLabelId = `${answerRegionId}-label`;
  const isCorrect = selected === component.answer;
  const hasSelection = selected !== null;

  useEffect(() => {
    if (hydratedRef.current || !progressContext?.answersLoaded) return undefined;
    hydratedRef.current = true;
    const attempt = progressContext.answers[component.anchor];
    if (!attempt) return undefined;

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setSelected(attempt.selected);
      setRevealed(true);
    });
    return () => {
      cancelled = true;
    };
  }, [component.anchor, progressContext?.answers, progressContext?.answersLoaded]);

  const toggleRevealed = () => {
    const next = !revealed;
    if (next && selected !== null) {
      progressContext?.recordAnswer(component.anchor, selected, selected === component.answer);
    }
    setRevealed(next);
  };

  return (
    <Card id={component.anchor} altitude="emphasis" label="Quiz: Knowledge check" className="quiz-card">
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
        </RadioOptionGroup>
      </fieldset>
      {revealed && hasSelection ? (
        <p className={`quiz-feedback ${isCorrect ? "quiz-feedback-correct" : "quiz-feedback-incorrect"}`} role="status">
          {isCorrect ? "Correct!" : "Not quite."}
        </p>
      ) : null}
      <Button className="quiz-reveal-button" aria-expanded={revealed} aria-controls={answerRegionId} onClick={toggleRevealed}>
        {revealed ? "Hide answer" : hasSelection ? "Check answer" : "Show answer"}
      </Button>
      <div id={answerRegionId} className="quiz-answer" hidden={!revealed} aria-labelledby={answerLabelId}>
        <p id={answerLabelId} className="quiz-answer-label">
          Answer
        </p>
        <p className="quiz-answer-value">{component.answer}</p>
        {component.explanation ? <p className="quiz-explanation">{component.explanation}</p> : null}
      </div>
      <noscript className="quiz-noscript">
        <style>{".quiz-reveal-button { display: none !important; }"}</style>
        Interactive answer reveal requires JavaScript. Printed output includes the answer and explanation.
      </noscript>
    </Card>
  );
}
