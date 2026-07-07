"use client";

import { KeyboardEvent, useId, useMemo, useState, useSyncExternalStore } from "react";
import type { TabsComponent } from "@/lib/lecture-template/types";
import { Button, Card } from "@/components/component-kit";

export function Tabs({ component }: { component: TabsComponent }) {
  const idPrefix = useId().replaceAll(":", "");
  const defaultIndex = Math.max(
    0,
    component.default_tab ? component.tabs.findIndex((panel) => panel.label === component.default_tab) : 0
  );
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const enhanced = useHydrated();
  const ids = useMemo(
    () =>
      component.tabs.map((_, index) => ({
        tab: `${idPrefix}-tab-${index}`,
        panel: `${idPrefix}-panel-${index}`
      })),
    [component.tabs, idPrefix]
  );

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const last = component.tabs.length - 1;
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? last
          : event.key === "ArrowLeft" || event.key === "ArrowUp"
            ? index === 0
              ? last
              : index - 1
            : index === last
              ? 0
              : index + 1;
    setActiveIndex(next);
    document.getElementById(ids[next]?.tab ?? "")?.focus();
  }

  return (
    <Card
      altitude="card"
      label="Tabs"
      title={component.title}
      className="tabs"
      attributes={{ "data-enhanced": enhanced ? "true" : "false" }}
    >
      <div className="tabs-list" role="tablist" aria-label={component.title}>
        {component.tabs.map((panel, index) => (
          <Button
            variant="ghost"
            id={ids[index].tab}
            key={`${panel.label}-${index}`}
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={ids[index].panel}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {panel.label}
          </Button>
        ))}
      </div>
      <div className="tabs-panels">
        {component.tabs.map((panel, index) => (
          <section
            id={ids[index].panel}
            className="tabs-panel"
            key={`${panel.label}-${index}`}
            role="tabpanel"
            aria-labelledby={ids[index].tab}
            hidden={enhanced && activeIndex !== index}
          >
            <h4>{panel.label}</h4>
            <p>{panel.content}</p>
          </section>
        ))}
      </div>
      <noscript className="tabs-noscript">All tab panels are shown in the authored order when JavaScript is unavailable.</noscript>
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
