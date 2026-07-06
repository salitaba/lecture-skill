"use client";

import { useId, useState } from "react";
import type { PracticeTaskComponent } from "@/lib/lecture-template/types";
import { CodeBlock } from "./CodeBlock";

export function PracticeTask({ component }: { component: PracticeTaskComponent }) {
  const [hintsRevealed, setHintsRevealed] = useState(false);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const baseId = useId();
  const hintsRegionId = `${baseId}-hints`;
  const hintsLabelId = `${baseId}-hints-label`;
  const solutionRegionId = `${baseId}-solution`;
  const solutionLabelId = `${baseId}-solution-label`;

  return (
    <aside id={component.anchor} className="lecture-component surface-emphasis assessment-card practice-task-card">
      <p className="component-label">Practice task</p>
      <h3>{component.title}</h3>
      {component.scenario ? (
        <section className="assessment-region">
          <h4>Scenario</h4>
          <p>{component.scenario}</p>
        </section>
      ) : null}
      <section className="assessment-region">
        <h4>Task</h4>
        <p>{component.task}</p>
      </section>
      {component.steps ? (
        <section className="assessment-region">
          <h4>Steps</h4>
          <ol>
            {component.steps.map((step, index) => (
              <li key={`${step}-${index}`}>{step}</li>
            ))}
          </ol>
        </section>
      ) : null}
      {component.starter_code ? (
        <section className="practice-starter-code">
          <h4>Starter code</h4>
          <CodeBlock component={{ type: "code_block", language: component.starter_code.language, code: component.starter_code.code }} />
        </section>
      ) : null}
      {component.rubric ? (
        <section className="assessment-region practice-rubric">
          <h4>Rubric</h4>
          <ul>
            {component.rubric.map((item, index) => (
              <li key={`${item.criterion}-${index}`}>
                <strong>{item.criterion}:</strong> {item.expected}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {component.hints ? (
        <>
          <button
            type="button"
            className="assessment-reveal-button"
            aria-expanded={hintsRevealed}
            aria-controls={hintsRegionId}
            onClick={() => setHintsRevealed((current) => !current)}
          >
            {hintsRevealed ? "Hide hints" : "Show hints"}
          </button>
          <div id={hintsRegionId} className="assessment-hidden-region" hidden={!hintsRevealed} aria-labelledby={hintsLabelId}>
            <p id={hintsLabelId} className="assessment-region-label">
              Hints
            </p>
            <ul>
              {component.hints.map((hint, index) => (
                <li key={`${hint}-${index}`}>{hint}</li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
      {component.solution ? (
        <>
          <button
            type="button"
            className="assessment-reveal-button"
            aria-expanded={solutionRevealed}
            aria-controls={solutionRegionId}
            onClick={() => setSolutionRevealed((current) => !current)}
          >
            {solutionRevealed ? "Hide solution" : "Show solution"}
          </button>
          <div id={solutionRegionId} className="assessment-hidden-region" hidden={!solutionRevealed} aria-labelledby={solutionLabelId}>
            <p id={solutionLabelId} className="assessment-region-label">
              Solution
            </p>
            <p>{component.solution}</p>
          </div>
        </>
      ) : null}
      <noscript className="assessment-noscript">Interactive hint and solution reveal requires JavaScript. Printed output includes hidden guidance.</noscript>
    </aside>
  );
}
