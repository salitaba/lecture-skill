import type { GlossaryEntry } from "@/lib/lecture-template/glossaryIndex";
import { Icon } from "@/components/component-kit";

export interface GlossaryIndexProps {
  entries: GlossaryEntry[];
  id?: string;
  title?: string;
  scope?: "lecture" | "collection";
}

export function GlossaryIndex({ entries, id = "glossary-index", title = "Glossary", scope = "lecture" }: GlossaryIndexProps) {
  if (entries.length === 0) return null;

  const headingId = `${id}-heading`;
  const countLabel = `${entries.length} ${entries.length === 1 ? "term" : "terms"}`;

  return (
    <section className="glossary-index lecture-panel" id={id} aria-labelledby={headingId}>
      <div className="glossary-index-desktop">
        <h2 id={headingId}>{title}</h2>
        <p className="nav-summary-count">{countLabel}</p>
        <GlossaryList entries={entries} scope={scope} />
      </div>
      <details className="glossary-index-mobile">
        <summary>
          <span className="glossary-index-summary-text">{title}</span>
          <span className="learning-path-summary-meta">
            <span className="nav-summary-count">{countLabel}</span>
            <Icon name="chevron" className="learning-path-chevron" />
          </span>
        </summary>
        <GlossaryList entries={entries} scope={scope} />
      </details>
    </section>
  );
}

function GlossaryList({ entries, scope }: { entries: GlossaryEntry[]; scope: "lecture" | "collection" }) {
  return (
    <dl className="glossary-index-list">
      {entries.map((entry) => (
        <div key={entry.term.toLowerCase()} className="glossary-index-item">
          <dt>
            {entry.occurrences.map((occurrence, occurrenceIndex) => (
              <a
                key={`${occurrence.lectureSlug ?? "lecture"}-${occurrence.anchor}-${occurrenceIndex}`}
                className="glossary-index-term"
                href={occurrence.lectureSlug ? `/lectures/${occurrence.lectureSlug}#${occurrence.anchor}` : `#${occurrence.anchor}`}
              >
                {entry.term}
                {scope === "collection" && occurrence.lectureTitle ? (
                  <span className="glossary-index-lecture"> · {occurrence.lectureTitle}</span>
                ) : null}
              </a>
            ))}
          </dt>
          <dd className="glossary-index-definition" title={entry.definition}>
            {entry.definition}
          </dd>
        </div>
      ))}
    </dl>
  );
}
