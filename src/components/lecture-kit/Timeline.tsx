import type { TimelineComponent } from "@/lib/lecture-template/types";

export function Timeline({ component }: { component: TimelineComponent }) {
  return (
    <aside className={`lecture-component timeline timeline-${component.orientation}`}>
      <p className="component-label">Timeline</p>
      <h3>{component.title}</h3>
      <ol className="timeline-items">
        {component.items.map((item, index) => (
          <li className="timeline-item" key={`${item.label}-${index}`}>
            <span className="timeline-marker" aria-label={`Step ${index + 1}`}>
              {index + 1}
            </span>
            <div>
              {item.date ? <p className="timeline-date">{item.date}</p> : null}
              <h4>{item.label}</h4>
              <p>{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
