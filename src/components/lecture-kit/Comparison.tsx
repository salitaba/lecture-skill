import { useId } from "react";
import type { ComparisonComponent } from "@/lib/lecture-template/types";

export function Comparison({ component }: { component: ComparisonComponent }) {
  const idPrefix = useId().replaceAll(":", "");
  const topicLabelId = `${idPrefix}-comparison-topic-label`;
  const leftLabelId = `${idPrefix}-comparison-left-label`;
  const rightLabelId = `${idPrefix}-comparison-right-label`;

  return (
    <aside className="lecture-component comparison">
      <p className="component-label">Comparison</p>
      <h3>{component.title}</h3>
      <div className="comparison-list">
        <div className="comparison-header">
          <span id={topicLabelId}>Topic</span>
          <span id={leftLabelId}>{component.leftLabel}</span>
          <span id={rightLabelId}>{component.rightLabel}</span>
        </div>
        {component.items.map((item, index) => {
          const topicId = `${idPrefix}-comparison-topic-${index}`;

          return (
            <div className="comparison-row" key={`${item.label}-${index}`}>
              <h4 id={topicId} aria-labelledby={`${topicLabelId} ${topicId}`}>
                {item.label}
              </h4>
              <div>
                <span className="comparison-cell-label" aria-hidden="true">
                  {component.leftLabel}
                </span>
                <p aria-labelledby={`${topicId} ${leftLabelId}`}>{item.left}</p>
              </div>
              <div>
                <span className="comparison-cell-label" aria-hidden="true">
                  {component.rightLabel}
                </span>
                <p aria-labelledby={`${topicId} ${rightLabelId}`}>{item.right}</p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
