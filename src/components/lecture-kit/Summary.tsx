import type { SummaryComponent } from "@/lib/lecture-template/types";
import { Card } from "@/components/component-kit";

export function Summary({ component }: { component: SummaryComponent }) {
  return (
    <Card altitude="card" label="Section summary" title={component.title} className="summary-card">
      <ul>
        {component.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}
