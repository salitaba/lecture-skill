import type { GlossaryTermComponent } from "@/lib/lecture-template/types";

export function GlossaryTerm({ component, id }: { component: GlossaryTermComponent; id?: string }) {
  return (
    <aside id={id} className="lecture-component surface-quiet glossary-term">
      <p className="component-label">Glossary</p>
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
    </aside>
  );
}
