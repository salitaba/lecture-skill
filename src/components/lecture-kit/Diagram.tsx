"use client";

import type { DiagramComponent } from "@/lib/lecture-template/types";
import { useId, useEffect, useRef, useState } from "react";
import { Card } from "@/components/component-kit";

let mermaidReady: Promise<typeof import("mermaid").default> | null = null;

function getMermaid() {
  if (!mermaidReady) {
    mermaidReady = import("mermaid").then((mod) => {
      const m = mod.default;
      m.initialize({ startOnLoad: false });
      return m;
    });
  }
  return mermaidReady;
}

export function Diagram({ component }: { component: DiagramComponent }) {
  const diagramId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      let mermaid;
      try {
        mermaid = await getMermaid();
      } catch {
        if (!cancelled) setLoadError(true);
        return;
      }
      if (cancelled) return;

      try {
        mermaid.mermaidAPI.setConfig({ theme: component.theme || "default" });
        const { svg } = await mermaid.render(diagramId, component.code);
        if (cancelled) return;

        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch {
        if (!cancelled) setRenderError(true);
      }
    }

    renderDiagram();
    return () => { cancelled = true; };
  }, [diagramId, component.code, component.theme]);

  return (
    <Card as="figure" label="Diagram" className="diagram-card" attributes={{ role: "img", "aria-label": component.title }}>
      <noscript>
        <style>{`.diagram-card .diagram-svg-container pre { display: block !important; }`}</style>
        Diagrams require JavaScript for interactive rendering. Raw source code is shown below.
      </noscript>
      <div className="diagram-svg-container" ref={containerRef}>
        <pre>
          <code>{component.code}</code>
        </pre>
      </div>
      <figcaption>{component.title}</figcaption>
      <details>
        <summary>Diagram source code</summary>
        <pre>
          <code>{component.code}</code>
        </pre>
      </details>
      <div aria-live="polite">
        {loadError && <p className="diagram-error">Diagram library failed to load. Showing source code.</p>}
        {renderError && <p className="diagram-error">Diagram could not be rendered. Showing source code.</p>}
      </div>
    </Card>
  );
}
