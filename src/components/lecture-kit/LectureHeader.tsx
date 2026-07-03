import type { LectureMetadata } from "@/lib/lecture-template/types";

export function LectureHeader({ metadata, sectionCount }: { metadata: LectureMetadata; sectionCount: number }) {
  return (
    <header className="lecture-header">
      <p className="eyebrow">Lecture</p>
      <h1>{metadata.title}</h1>
      <p className="description">{metadata.description}</p>
      <dl className="metadata-grid" aria-label="Lecture metadata">
        <div>
          <dt>Audience</dt>
          <dd>{metadata.audience}</dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>{metadata.duration}</dd>
        </div>
        <div>
          <dt>Level</dt>
          <dd>{metadata.level}</dd>
        </div>
        <div>
          <dt>Sections</dt>
          <dd>
            {sectionCount} {sectionCount === 1 ? "section" : "sections"}
          </dd>
        </div>
      </dl>
    </header>
  );
}
