"use client";

import type { DiagramComponent } from "@/lib/lecture-template/types";
import { useId, useEffect, useRef, useState } from "react";
import { Button, Card, Icon } from "@/components/component-kit";

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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [loadError, setLoadError] = useState(false);
  const [renderError, setRenderError] = useState(false);
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);

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
        setSvgMarkup(svg);
      } catch {
        if (!cancelled) setRenderError(true);
      }
    }

    renderDiagram();
    return () => { cancelled = true; };
  }, [diagramId, component.code, component.theme]);

  const canExpand = svgMarkup !== null && !loadError && !renderError;

  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();

  const downloadSvg = () => {
    if (!svgMarkup) return;
    const blob = new Blob([svgMarkup], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(component.title)}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
      {canExpand ? (
        <Button variant="ghost" tone="muted" className="diagram-expand-button" onClick={openDialog}>
          <Icon name="expand" /> Expand diagram
        </Button>
      ) : null}
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
      <dialog ref={dialogRef} className="diagram-dialog" aria-label={`${component.title} (expanded)`}>
        <div className="diagram-dialog-header">
          <p className="diagram-dialog-title">{component.title}</p>
          <div className="diagram-dialog-actions">
            <Button variant="ghost" tone="muted" size="compact" onClick={downloadSvg}>
              <Icon name="download" /> Download SVG
            </Button>
            <Button variant="ghost" tone="muted" size="compact" onClick={closeDialog}>
              Close
            </Button>
          </div>
        </div>
        {svgMarkup ? <div className="diagram-dialog-svg" dangerouslySetInnerHTML={{ __html: svgMarkup }} /> : null}
      </dialog>
    </Card>
  );
}

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "diagram";
}
