"use client";

import type { ProgressSection } from "@/lib/lecture-template/progress";
import { useAnnotationsOptional } from "./progress/AnnotationsProvider";

export function AnnotationsIndexDisclosure({ sections }: { sections: ProgressSection[] }) {
  const annotations = useAnnotationsOptional();
  const highlights = annotations?.highlights ?? [];
  const notes = annotations?.notes ?? {};
  const noteEntries = Object.entries(notes).filter(([, text]) => text.trim() !== "");

  const count = highlights.length + noteEntries.length;
  if (count === 0) return null;

  const titleFor = (anchor: string) => sections.find((section) => section.anchor === anchor)?.title ?? anchor;

  return (
    <details className="annotations-index-disclosure">
      <summary>
        <span className="annotations-index-disclosure-label-closed">Show your highlights &amp; notes ({count})</span>
        <span className="annotations-index-disclosure-label-open">Hide your highlights &amp; notes ({count})</span>
      </summary>
      <div className="annotations-index-body">
        {highlights.length > 0 ? (
          <div className="annotations-index-group">
            <h3 className="annotations-index-group-title">Highlights</h3>
            <ul className="annotations-index-list">
              {highlights.map((highlight) => (
                <li key={highlight.id}>
                  <a href={`#${highlight.sectionAnchor}`}>“{highlight.snippet}”</a>
                  <span className="annotations-index-meta">{titleFor(highlight.sectionAnchor)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {noteEntries.length > 0 ? (
          <div className="annotations-index-group">
            <h3 className="annotations-index-group-title">Notes</h3>
            <ul className="annotations-index-list">
              {noteEntries.map(([anchor, text]) => (
                <li key={anchor}>
                  <a href={`#${anchor}`}>{titleFor(anchor)}</a>
                  <span className="annotations-index-meta">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </details>
  );
}
