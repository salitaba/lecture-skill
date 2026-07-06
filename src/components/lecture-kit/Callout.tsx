import type { CalloutComponent } from "@/lib/lecture-template/types";

export function Callout({ component }: { component: CalloutComponent }) {
  const label = `${component.variant[0].toUpperCase()}${component.variant.slice(1)} callout`;

  return (
    <aside className={`lecture-component surface-card callout callout-${component.variant}`}>
      <p className="component-label">{label}</p>
      <h3>{component.title}</h3>
      <p>{component.body}</p>
    </aside>
  );
}
