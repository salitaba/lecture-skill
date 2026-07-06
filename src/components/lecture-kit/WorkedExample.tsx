import type { WorkedExampleComponent } from "@/lib/lecture-template/types";
import { CodeBlock } from "./CodeBlock";

export function WorkedExample({ component }: { component: WorkedExampleComponent }) {
  return (
    <aside className="lecture-component surface-card worked-example">
      <p className="component-label">Worked example</p>
      <h3>{component.title}</h3>
      <section className="worked-example-region">
        <h4>Problem</h4>
        <p>{component.problem}</p>
      </section>
      {component.starter_code ? (
        <section className="worked-example-region">
          <h4>Starter code</h4>
          <CodeBlock component={{ type: "code_block", language: component.language ?? "text", code: component.starter_code }} />
        </section>
      ) : null}
      <section className="worked-example-region">
        <h4>Walkthrough</h4>
        <ol>
          {component.walkthrough.map((step, index) => (
            <li key={`${step}-${index}`}>{step}</li>
          ))}
        </ol>
      </section>
      <section className="worked-example-region worked-example-solution">
        <h4>Solution</h4>
        <p>{component.solution}</p>
      </section>
      {component.takeaway ? (
        <section className="worked-example-region">
          <h4>Takeaway</h4>
          <p>{component.takeaway}</p>
        </section>
      ) : null}
    </aside>
  );
}
