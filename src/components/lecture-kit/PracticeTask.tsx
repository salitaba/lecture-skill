"use client";

import type { PracticeTaskComponent } from "@/lib/lecture-template/types";
import { CodeBlock } from "./CodeBlock";
import { Card, DisclosureTrigger, LabeledSection, useDisclosure } from "@/components/component-kit";

export function PracticeTask({ component }: { component: PracticeTaskComponent }) {
  const { open: hintsRevealed, toggle: toggleHints, regionId: hintsRegionId } = useDisclosure("hints");
  const { open: solutionRevealed, toggle: toggleSolution, regionId: solutionRegionId } = useDisclosure("solution");
  const hintsLabelId = `${hintsRegionId}-label`;
  const solutionLabelId = `${solutionRegionId}-label`;

  return (
    <Card id={component.anchor} altitude="emphasis" label="Practice task" title={component.title} className="assessment-card practice-task-card">
      {component.scenario ? (
        <LabeledSection label="Scenario">
          <p>{component.scenario}</p>
        </LabeledSection>
      ) : null}
      <LabeledSection label="Task">
        <p>{component.task}</p>
      </LabeledSection>
      {component.steps ? (
        <LabeledSection label="Steps">
          <ol>
            {component.steps.map((step, index) => (
              <li key={`${step}-${index}`}>{step}</li>
            ))}
          </ol>
        </LabeledSection>
      ) : null}
      {component.starter_code ? (
        <LabeledSection label="Starter code" className="practice-starter-code">
          <CodeBlock component={{ type: "code_block", language: component.starter_code.language, code: component.starter_code.code }} />
        </LabeledSection>
      ) : null}
      {component.rubric ? (
        <LabeledSection label="Rubric" className="practice-rubric">
          <ul>
            {component.rubric.map((item, index) => (
              <li key={`${item.criterion}-${index}`}>
                <strong>{item.criterion}:</strong> {item.expected}
              </li>
            ))}
          </ul>
        </LabeledSection>
      ) : null}
      {component.hints ? (
        <>
          <DisclosureTrigger className="assessment-reveal-button" open={hintsRevealed} regionId={hintsRegionId} onToggle={toggleHints}>
            {hintsRevealed ? "Hide hints" : "Show hints"}
          </DisclosureTrigger>
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
          <DisclosureTrigger className="assessment-reveal-button" open={solutionRevealed} regionId={solutionRegionId} onToggle={toggleSolution}>
            {solutionRevealed ? "Hide solution" : "Show solution"}
          </DisclosureTrigger>
          <div id={solutionRegionId} className="assessment-hidden-region" hidden={!solutionRevealed} aria-labelledby={solutionLabelId}>
            <p id={solutionLabelId} className="assessment-region-label">
              Solution
            </p>
            <p>{component.solution}</p>
          </div>
        </>
      ) : null}
      <noscript className="assessment-noscript">Interactive hint and solution reveal requires JavaScript. Printed output includes hidden guidance.</noscript>
    </Card>
  );
}
