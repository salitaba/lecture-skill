import type { WorkedExampleComponent } from "@/lib/lecture-template/types";
import { CodeBlock } from "./CodeBlock";
import { Card, LabeledSection } from "@/components/component-kit";

export function WorkedExample({ component }: { component: WorkedExampleComponent }) {
  return (
    <Card altitude="card" label="Worked example" title={component.title} className="worked-example">
      <LabeledSection label="Problem">
        <p>{component.problem}</p>
      </LabeledSection>
      {component.starter_code ? (
        <LabeledSection label="Starter code">
          <CodeBlock component={{ type: "code_block", language: component.language ?? "text", code: component.starter_code }} />
        </LabeledSection>
      ) : null}
      <LabeledSection label="Walkthrough">
        <ol>
          {component.walkthrough.map((step, index) => (
            <li key={`${step}-${index}`}>{step}</li>
          ))}
        </ol>
      </LabeledSection>
      <LabeledSection label="Solution" className="worked-example-solution">
        <p>{component.solution}</p>
      </LabeledSection>
      {component.takeaway ? (
        <LabeledSection label="Takeaway">
          <p>{component.takeaway}</p>
        </LabeledSection>
      ) : null}
    </Card>
  );
}
