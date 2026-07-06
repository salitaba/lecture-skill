"use client";

import { useId, useState, useSyncExternalStore } from "react";
import type { FlashcardComponent } from "@/lib/lecture-template/types";

export function Flashcard({ component }: { component: FlashcardComponent }) {
  const [revealed, setRevealed] = useState(false);
  const hydrated = useHydrated();
  const id = useId();
  const answerId = `${id}-flashcard-answer`;

  return (
    <aside className="lecture-component surface-card flashcard">
      <p className="component-label">Flashcard{component.category ? `: ${component.category}` : ""}</p>
      <h3>{component.prompt}</h3>
      {component.hint ? <p className="flashcard-hint">Hint: {component.hint}</p> : null}
      <button
        type="button"
        className="flashcard-reveal"
        aria-expanded={revealed}
        aria-controls={answerId}
        onClick={() => setRevealed((current) => !current)}
      >
        {revealed ? "Hide answer" : "Reveal answer"}
      </button>
      <div id={answerId} className="flashcard-answer" hidden={hydrated && !revealed}>
        <p className="flashcard-answer-label">Answer</p>
        <p>{component.answer}</p>
      </div>
      <noscript className="flashcard-noscript">The answer is shown when JavaScript is unavailable. Printed output includes the answer.</noscript>
    </aside>
  );
}

function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
