import type { AccordionComponent } from "@/lib/lecture-template/types";
import { Card } from "@/components/component-kit";

export function Accordion({ component }: { component: AccordionComponent }) {
  return (
    <Card altitude="card" label="More detail" title={component.title} className="accordion">
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
    </Card>
  );
}
