import type { QuoteComponent } from "@/lib/lecture-template/types";
import { Card } from "@/components/component-kit";

export function Quote({ component }: { component: QuoteComponent }) {
  return (
    <Card as="figure" altitude="quiet" label="Source quote" className="quote-card">
      {component.context ? <p className="quote-context">{component.context}</p> : null}
      <blockquote>
        <p>{component.quote}</p>
      </blockquote>
      {component.attribution ? <figcaption>{component.attribution}</figcaption> : null}
    </Card>
  );
}
