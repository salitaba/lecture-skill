import type { MistakeCorrectionComponent } from "@/lib/lecture-template/types";

export function MistakeCorrection({ component }: { component: MistakeCorrectionComponent }) {
  return (
    <aside className="lecture-component mistake-correction">
      <p className="component-label">Common mistake</p>
      <h3>{component.title}</h3>
      <div className="mistake-correction-grid">
        <section className="mistake-region">
          <h4>Mistake</h4>
          <p>{component.mistake}</p>
          {component.example_before ? <pre className="mistake-example">{component.example_before}</pre> : null}
        </section>
        <section className="correction-region">
          <h4>Correction</h4>
          <p>{component.correction}</p>
          {component.example_after ? <pre className="mistake-example">{component.example_after}</pre> : null}
        </section>
      </div>
      <section className="mistake-why">
        <h4>Why it fails</h4>
        <p>{component.why_it_fails}</p>
      </section>
    </aside>
  );
}
