import type { CalloutComponent } from "@/lib/lecture-template/types";
import { Card } from "@/components/component-kit";

export function Callout({ component }: { component: CalloutComponent }) {
  const label = `${component.variant[0].toUpperCase()}${component.variant.slice(1)} callout`;

  return (
    <Card altitude="card" label={label} title={component.title} className={`callout callout-${component.variant}`}>
      <p>{component.body}</p>
    </Card>
  );
}
