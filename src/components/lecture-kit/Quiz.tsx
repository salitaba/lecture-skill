"use client";

import { useId, useState } from "react";
import type { QuizComponent } from "@/lib/lecture-template/types";

export function Quiz({ component }: { component: QuizComponent }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const baseId = useId();
  const answerRegionId = `${baseId}-answer`;
  const answerLabelId = `${baseId}-answer-label`;
  const isCorrect = selected === component.answer;
  const hasSelection = selected !== null;

  return (
    <aside id={component.anchor} className="lecture-component surface-emphasis quiz-card">
      <p className="component-label">Quiz: Knowledge check</p>
      <h3 className="quiz-question">{component.question}</h3>
      <fieldset className="quiz-options-fieldset">
        <legend className="sr-only">Choose an answer</legend>
        <div className="quiz-options" role="radiogroup" aria-labelledby={`${baseId}-question`}>
          <span id={`${baseId}-question`} className="sr-only">{component.question}</span>
          {component.options.map((option, index) => (
            <label key={`${option}-${index}`} className={`quiz-option${selected === option ? " quiz-option-selected" : ""}${revealed && option === component.answer ? " quiz-option-correct" : ""}${revealed && selected === option && option !== component.answer ? " quiz-option-incorrect" : ""}`}>
              <input
                type="radio"
                name={`${baseId}-quiz`}
                id={`${baseId}-option-${index}`}
                value={option}
                checked={selected === option}
                onChange={() => setSelected(option)}
                disabled={revealed}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {revealed && hasSelection ? (
        <p className={`quiz-feedback ${isCorrect ? "quiz-feedback-correct" : "quiz-feedback-incorrect"}`} role="status">
          {isCorrect ? "Correct!" : "Not quite."}
        </p>
      ) : null}
      <button
        type="button"
        className="quiz-reveal-button"
        aria-expanded={revealed}
        aria-controls={answerRegionId}
        onClick={() => setRevealed((current) => !current)}
      >
        {revealed ? "Hide answer" : hasSelection ? "Check answer" : "Show answer"}
      </button>
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
    </aside>
  );
}
