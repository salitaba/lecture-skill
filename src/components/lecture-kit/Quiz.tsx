"use client";

import { useId, useState } from "react";
import type { QuizComponent } from "@/lib/lecture-template/types";

export function Quiz({ component }: { component: QuizComponent }) {
  const [revealed, setRevealed] = useState(false);
  const baseId = useId();
  const answerRegionId = `${baseId}-answer`;
  const answerLabelId = `${baseId}-answer-label`;

  return (
    <aside id={component.anchor} className="lecture-component quiz-card">
      <p className="component-label">Quiz: Knowledge check</p>
      <h3 className="quiz-question">{component.question}</h3>
      <ol className="quiz-options">
        {component.options.map((option, index) => (
          <li key={`${option}-${index}`}>{option}</li>
        ))}
      </ol>
      <button
        type="button"
        className="quiz-reveal-button"
        aria-expanded={revealed}
        aria-controls={answerRegionId}
        onClick={() => setRevealed((current) => !current)}
      >
        {revealed ? "Hide answer" : "Show answer"}
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
