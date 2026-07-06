import type { QuoteComponent } from "@/lib/lecture-template/types";

export function Quote({ component }: { component: QuoteComponent }) {
  return (
    <figure className="lecture-component surface-quiet quote-card">
      <p className="component-label">Source quote</p>
      {component.context ? <p className="quote-context">{component.context}</p> : null}
      <blockquote>
        <p>{component.quote}</p>
      </blockquote>
      {component.attribution ? <figcaption>{component.attribution}</figcaption> : null}
    </figure>
  );
}
