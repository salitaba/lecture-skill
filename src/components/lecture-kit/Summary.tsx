import type { SummaryComponent } from "@/lib/lecture-template/types";

export function Summary({ component }: { component: SummaryComponent }) {
  return (
    <aside className="lecture-component summary-card">
      <p className="component-label">Section summary</p>
      <h3>{component.title}</h3>
      <ul>
        {component.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
