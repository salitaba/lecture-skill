import type { AccordionComponent } from "@/lib/lecture-template/types";

export function Accordion({ component }: { component: AccordionComponent }) {
  return (
    <aside className="lecture-component surface-card accordion">
      <p className="component-label">More detail</p>
      <h3>{component.title}</h3>
      <div className="accordion-items">
        {component.items.map((item, index) => (
          <details className="accordion-item" key={`${item.title}-${index}`} open={component.default_open === item.title}>
            <summary>{item.title}</summary>
            <div className="accordion-body">
              <p>{item.body}</p>
            </div>
            <div className="accordion-print-body" aria-hidden="true">
              {item.body}
            </div>
          </details>
        ))}
      </div>
    </aside>
  );
}
