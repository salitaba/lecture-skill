"use client";

import { useId, useState } from "react";
import type { ChecklistComponent } from "@/lib/lecture-template/types";
import { Button, Card } from "@/components/component-kit";

export function Checklist({ component, instanceId }: { component: ChecklistComponent; instanceId?: string }) {
  const fallbackId = useId();
  const storageKey = `lecture-checklist:${instanceId ?? fallbackId}:${component.title}`;
  const [checked, setChecked] = useState<boolean[]>(() => initialChecklistState(component, storageKey));

  function updateItem(index: number, value: boolean) {
    const next = checked.map((current, itemIndex) => (itemIndex === index ? value : current));
    setChecked(next);
    if (component.storage === "local") {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Ignore quota and privacy-mode failures.
      }
    }
  }

  function reset() {
    const next = component.items.map(() => false);
    setChecked(next);
    if (component.storage === "local") {
      try {
        window.localStorage.removeItem(storageKey);
      } catch {
        // Ignore storage failures.
      }
    }
  }

  return (
    <Card altitude="card" label="Checklist" title={component.title} className="checklist">
      <ul className="checklist-items">
        {component.items.map((item, index) => {
          const inputId = `${storageKey}-${index}`.replace(/[^a-zA-Z0-9_-]/g, "-");
          return (
            <li className="checklist-item" key={`${item}-${index}`}>
              <input id={inputId} type="checkbox" checked={checked[index] ?? false} onChange={(event) => updateItem(index, event.target.checked)} />
              <label htmlFor={inputId}>{item}</label>
            </li>
          );
        })}
      </ul>
      {component.reset_label ? (
        <Button variant="ghost" className="checklist-reset" onClick={reset}>
          {component.reset_label}
        </Button>
      ) : null}
      <p className="checklist-storage-note">Saved only in this browser when local storage is enabled for this checklist.</p>
    </Card>
  );
}

function initialChecklistState(component: ChecklistComponent, storageKey: string): boolean[] {
  if (component.storage !== "local" || typeof window === "undefined") {
    return component.items.map(() => false);
  }

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return component.items.map(() => false);
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return component.items.map((_, index) => parsed[index] === true);
    }
  } catch {
    // Storage is optional learner convenience; ignore unavailable or malformed state.
  }

  return component.items.map(() => false);
}
