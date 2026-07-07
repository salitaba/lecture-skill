"use client";

import { useSyncExternalStore } from "react";
import type { FlashcardComponent } from "@/lib/lecture-template/types";
import { Card, DisclosureTrigger, useDisclosure } from "@/components/component-kit";

export function Flashcard({ component }: { component: FlashcardComponent }) {
  const { open: revealed, toggle, regionId: answerId } = useDisclosure("flashcard-answer");
  const hydrated = useHydrated();

  return (
    <Card altitude="card" label={`Flashcard${component.category ? `: ${component.category}` : ""}`} title={component.prompt} className="flashcard">
      {component.hint ? <p className="flashcard-hint">Hint: {component.hint}</p> : null}
      <DisclosureTrigger variant="ghost" className="flashcard-reveal" open={revealed} regionId={answerId} onToggle={toggle}>
        {revealed ? "Hide answer" : "Reveal answer"}
      </DisclosureTrigger>
      <div id={answerId} className="flashcard-answer" hidden={hydrated && !revealed}>
        <p className="flashcard-answer-label">Answer</p>
        <p>{component.answer}</p>
      </div>
      <noscript className="flashcard-noscript">The answer is shown when JavaScript is unavailable. Printed output includes the answer.</noscript>
    </Card>
  );
}

function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
