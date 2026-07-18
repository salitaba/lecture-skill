import type { LectureMetadata } from "@/lib/lecture-template/types";
import { FactsList, Icon } from "@/components/component-kit";

export function LectureHeader({
  metadata,
  sectionCount,
  readingMinutes,
  backHref,
  backLabel = "Back to course"
}: {
  metadata: LectureMetadata;
  sectionCount: number;
  readingMinutes?: number;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="lecture-header">
      {backHref ? (
        <a className="course-breadcrumb" href={backHref}>
          <Icon name="arrow-prev" />
          {backLabel}
        </a>
      ) : null}
      <p className="eyebrow">Lecture</p>
      <h1>{metadata.title}</h1>
      <p className="description">{metadata.description}</p>
      <FactsList
        aria-label="Lecture metadata"
        className="metadata-grid"
        items={[
          { label: "Audience", value: metadata.audience },
          { label: "Estimated study time", value: metadata.duration },
          ...(readingMinutes ? [{ label: "Reading time", value: `~${readingMinutes} min read` }] : []),
          { label: "Level", value: metadata.level },
          { label: "Sections", value: `${sectionCount} ${sectionCount === 1 ? "section" : "sections"}` }
        ]}
      />
      <div className="lecture-header-actions">
        <a className="header-action-primary" href="#overview-heading">
          Start reading <Icon name="arrow-next" />
        </a>
        <a className="header-action-secondary" href="#learning-path">
          View learning path
        </a>
      </div>
    </header>
  );
}
