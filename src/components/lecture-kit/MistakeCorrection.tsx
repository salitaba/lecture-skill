import type { MistakeCorrectionComponent } from "@/lib/lecture-template/types";
import { Card, LabeledSection } from "@/components/component-kit";

export function MistakeCorrection({ component }: { component: MistakeCorrectionComponent }) {
  return (
    <Card altitude="card" label="Common mistake" title={component.title} className="mistake-correction">
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
      <LabeledSection label="Why it fails" className="mistake-why">
        <p>{component.why_it_fails}</p>
      </LabeledSection>
    </Card>
  );
}
