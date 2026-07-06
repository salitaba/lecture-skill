import type { ConceptCardComponent } from "@/lib/lecture-template/types";

export function ConceptCard({ component }: { component: ConceptCardComponent }) {
  return (
    <aside className="lecture-component surface-card concept-card">
      <p className="component-label">Concept card</p>
      <h3>{component.title}</h3>
      <p>{component.body}</p>
    </aside>
  );
}
