"use client";

import { useId, useState } from "react";
import type { FreeResponseComponent } from "@/lib/lecture-template/types";
import { Card, DisclosureTrigger, useDisclosure } from "@/components/component-kit";

export function FreeResponse({ component }: { component: FreeResponseComponent }) {
  const [response, setResponse] = useState("");
  const { open: revealed, toggle, regionId: guidanceRegionId } = useDisclosure("guidance");
  const baseId = useId();
  const textareaId = `${baseId}-response`;
  const guidanceLabelId = `${guidanceRegionId}-label`;

  return (
    <Card id={component.anchor} altitude="emphasis" label="Assessment: Free response" title={component.title} className="assessment-card free-response-card">
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
          <DisclosureTrigger className="assessment-reveal-button" open={revealed} regionId={guidanceRegionId} onToggle={toggle}>
            {revealed ? "Hide guidance" : "Compare your answer"}
          </DisclosureTrigger>
          <div id={guidanceRegionId} className="assessment-hidden-region" hidden={!revealed} aria-labelledby={guidanceLabelId}>
            <p id={guidanceLabelId} className="assessment-region-label">
              Guidance
            </p>
            <p>{component.guidance}</p>
          </div>
        </>
      ) : null}
      <noscript className="assessment-noscript">Interactive guidance reveal requires JavaScript. Printed output includes guidance.</noscript>
    </Card>
  );
}
