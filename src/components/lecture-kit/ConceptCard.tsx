import type { ConceptCardComponent } from "@/lib/lecture-template/types";
import { Card } from "@/components/component-kit";

export function ConceptCard({ component }: { component: ConceptCardComponent }) {
  return (
    <Card altitude="card" label="Concept card" title={component.title} className="concept-card">
      <p>{component.body}</p>
    </Card>
  );
}
