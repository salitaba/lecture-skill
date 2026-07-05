import type { GlossaryTermComponent } from "@/lib/lecture-template/types";

export function GlossaryTerm({ component }: { component: GlossaryTermComponent }) {
  return (
    <aside className="lecture-component glossary-term">
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
