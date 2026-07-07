"use client";

import { useId, useState } from "react";
import type { QuizComponent } from "@/lib/lecture-template/types";
import { Button, Card, RadioOptionGroup, useDisclosure } from "@/components/component-kit";

export function Quiz({ component }: { component: QuizComponent }) {
  const [selected, setSelected] = useState<string | null>(null);
  const { open: revealed, toggle: toggleRevealed, regionId: answerRegionId } = useDisclosure("answer");
  const baseId = useId();
  const answerLabelId = `${answerRegionId}-label`;
  const isCorrect = selected === component.answer;
  const hasSelection = selected !== null;

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
