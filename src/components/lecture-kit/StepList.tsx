import type { StepListComponent } from "@/lib/lecture-template/types";
import { Card } from "@/components/component-kit";

export function StepList({ component }: { component: StepListComponent }) {
  return (
    <Card altitude="card" label="Step-by-step" title={component.title} className="step-list">
      <ol>
        {component.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </Card>
  );
}
