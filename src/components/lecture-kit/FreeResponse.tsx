"use client";

import { useId, useState } from "react";
import type { FreeResponseComponent } from "@/lib/lecture-template/types";
import { Button, DisclosureTrigger, useDisclosure } from "@/components/component-kit";
import { AssessmentFeedback, AssessmentShell, useHydrated, useLocalAssessmentLifecycle } from "./assessment/AssessmentShell";

export function FreeResponse({ component }: { component: FreeResponseComponent }) {
  const [response, setResponse] = useState("");
  const { open: revealed, toggle, regionId: guidanceRegionId } = useDisclosure("guidance");
  const { status, markUnderstood, markNeedsReview } = useLocalAssessmentLifecycle();
  const hydrated = useHydrated();
  const baseId = useId();
  const textareaId = `${baseId}-response`;
  const guidanceLabelId = `${guidanceRegionId}-label`;

  return (
    <AssessmentShell
      id={component.anchor}
      label="Assessment: Free response"
      title={component.title}
      className="free-response-card"
      noScriptFallback={component.guidance ? <>Guidance: {component.guidance}</> : "Write a response and compare it with your own reasoning."}
    >
      <p>{component.prompt}</p>
      <label className="assessment-textarea-label" htmlFor={textareaId}>Your response</label>
      <textarea
        id={textareaId}
        className="assessment-textarea"
        value={response}
        onChange={(event) => setResponse(event.target.value)}
        placeholder={component.placeholder ?? "Draft your response here..."}
      />
      <p className="assessment-helper">Your response is local to this browser tab and is not saved or submitted.</p>
      <div className="assessment-lifecycle-actions" aria-label="Self-assessment">
        <Button size="compact" onClick={markUnderstood}>Mark as understood</Button>
        <Button variant="ghost" size="compact" onClick={markNeedsReview}>Needs review</Button>
      </div>
      {status !== "unattempted" ? <AssessmentFeedback>{status === "needs_review" ? "Marked for review." : "Marked as understood."}</AssessmentFeedback> : null}
      {component.guidance ? (
        <>
          <DisclosureTrigger className="assessment-reveal-button" open={revealed} regionId={guidanceRegionId} onToggle={toggle}>
            {revealed ? "Hide guidance" : "Compare your answer"}
          </DisclosureTrigger>
          <div id={guidanceRegionId} className="assessment-hidden-region" hidden={hydrated && !revealed} aria-labelledby={guidanceLabelId}>
            <p id={guidanceLabelId} className="assessment-region-label">Guidance</p>
            <p>{component.guidance}</p>
          </div>
        </>
      ) : null}
    </AssessmentShell>
  );
}
