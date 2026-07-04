"use client";

import { useEffect, useId, useMemo, useState } from "react";
import type { QuestionSetComponent } from "@/lib/lecture-template/types";

export function QuestionSet({ component, enableShuffle = true }: { component: QuestionSetComponent; enableShuffle?: boolean }) {
  const baseId = useId();
  const [previewShuffleEnabled, setPreviewShuffleEnabled] = useState(false);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [selected, setSelected] = useState<Record<number, string>>({});
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
    <aside id={component.anchor} className="lecture-component assessment-card question-set-card">
      <p className="component-label">Assessment: Question set</p>
      <h3>{component.title}</h3>
      {component.instructions ? <p className="assessment-instructions">{component.instructions}</p> : null}
      <div className="question-set-list">
        {component.questions.map((question, questionIndex) => {
          const answerRegionId = `${baseId}-question-${questionIndex}-answer`;
          const answerLabelId = `${baseId}-question-${questionIndex}-answer-label`;
          const name = `${baseId}-question-${questionIndex}`;
          const isRevealed = Boolean(revealed[questionIndex]);

          return (
            <section key={`${question.question}-${questionIndex}`} className="assessment-region" aria-labelledby={`${baseId}-question-${questionIndex}`}>
              <h4 id={`${baseId}-question-${questionIndex}`}>{question.question}</h4>
              <div className="assessment-options" role="radiogroup" aria-labelledby={`${baseId}-question-${questionIndex}`}>
                {optionsByQuestion[questionIndex].map((option, optionIndex) => (
                  <label key={`${questionIndex}-${optionIndex}-${option}`} className="assessment-option">
                    <input
                      type="radio"
                      name={name}
                      value={option}
                      checked={selected[questionIndex] === option}
                      onChange={() => setSelected((current) => ({ ...current, [questionIndex]: option }))}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {selected[questionIndex] ? (
                <p className="assessment-selection">Selected: {selected[questionIndex]}</p>
              ) : (
                <p className="assessment-selection">Select an option before revealing the answer.</p>
              )}
              <button
                type="button"
                className="assessment-reveal-button"
                aria-expanded={isRevealed}
                aria-controls={answerRegionId}
                onClick={() => setRevealed((current) => ({ ...current, [questionIndex]: !current[questionIndex] }))}
              >
                {isRevealed ? "Hide feedback" : "Reveal answer"}
              </button>
              <div id={answerRegionId} className="assessment-hidden-region" hidden={!isRevealed} aria-labelledby={answerLabelId}>
                <p id={answerLabelId} className="assessment-region-label">
                  Answer
                </p>
                <p>{question.answer}</p>
                {question.feedback ? <p>{question.feedback}</p> : null}
              </div>
            </section>
          );
        })}
      </div>
      <noscript className="assessment-noscript">
        Interactive answer reveal requires JavaScript. Printed output includes all answers and feedback.
      </noscript>
    </aside>
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
