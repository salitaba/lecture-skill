import type { GlossaryTermComponent } from "@/lib/lecture-template/types";
import { Card } from "@/components/component-kit";

export function GlossaryTerm({ component, id }: { component: GlossaryTermComponent; id?: string }) {
  return (
    <Card altitude="quiet" id={id} label="Glossary" className="glossary-term">
      <dl>
        <div>
          <dt>{component.term}</dt>
          <dd>{component.definition}</dd>
        </div>
      </dl>
      {component.context ? <p className="glossary-context">{component.context}</p> : null}
      {component.aliases ? (
        <p className="glossary-aliases">
          <span>Also called:</span> {component.aliases.join(", ")}
        </p>
      ) : null}
    </Card>
  );
}
