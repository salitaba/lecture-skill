"use client";

import { useId, useState } from "react";
import type { FreeResponseComponent } from "@/lib/lecture-template/types";

export function FreeResponse({ component }: { component: FreeResponseComponent }) {
  const [response, setResponse] = useState("");
  const [revealed, setRevealed] = useState(false);
  const baseId = useId();
  const textareaId = `${baseId}-response`;
  const guidanceRegionId = `${baseId}-guidance`;
  const guidanceLabelId = `${baseId}-guidance-label`;

  return (
    <aside id={component.anchor} className="lecture-component assessment-card free-response-card">
      <p className="component-label">Assessment: Free response</p>
      <h3>{component.title}</h3>
      <p>{component.prompt}</p>
      <label className="assessment-textarea-label" htmlFor={textareaId}>
        Your response
      </label>
      <textarea
        id={textareaId}
        className="assessment-textarea"
        value={response}
        onChange={(event) => setResponse(event.target.value)}
        placeholder={component.placeholder ?? "Draft your response here..."}
      />
      <p className="assessment-helper">Your response is local to this browser tab and is not saved or submitted.</p>
      {component.guidance ? (
        <>
          <button
            type="button"
            className="assessment-reveal-button"
            aria-expanded={revealed}
            aria-controls={guidanceRegionId}
            onClick={() => setRevealed((current) => !current)}
          >
            {revealed ? "Hide guidance" : "Compare your answer"}
          </button>
          <div id={guidanceRegionId} className="assessment-hidden-region" hidden={!revealed} aria-labelledby={guidanceLabelId}>
            <p id={guidanceLabelId} className="assessment-region-label">
              Guidance
            </p>
            <p>{component.guidance}</p>
          </div>
        </>
      ) : null}
      <noscript className="assessment-noscript">Interactive guidance reveal requires JavaScript. Printed output includes guidance.</noscript>
    </aside>
  );
}
