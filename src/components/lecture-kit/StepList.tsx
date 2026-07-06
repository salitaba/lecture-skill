import type { StepListComponent } from "@/lib/lecture-template/types";

export function StepList({ component }: { component: StepListComponent }) {
  return (
    <aside className="lecture-component surface-card step-list">
      <p className="component-label">Step-by-step</p>
      <h3>{component.title}</h3>
      <ol>
        {component.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </aside>
  );
}
