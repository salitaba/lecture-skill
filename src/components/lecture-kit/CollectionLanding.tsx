import type { CollectionValidationResult, LectureValidationResult } from "@/lib/lecture-template/types";

export interface CollectionLandingProps {
  validation: CollectionValidationResult;
}

export function CollectionLanding({ validation }: CollectionLandingProps) {
  const totalMinutes = validation.results.reduce((sum, result) => sum + parseDurationMinutes(result), 0);
  const passingCount = validation.results.filter((result) => result.valid).length;
  const courseMetadata = validation.courseMetadata.status === "valid" ? validation.courseMetadata.metadata : undefined;
  const title = courseMetadata?.title ?? "Lecture Collection";
  const description =
    courseMetadata?.description ??
    `${validation.lectureCount} ${validation.lectureCount === 1 ? "lecture" : "lectures"} in authored order.`;

  return (
    <section className="collection-landing" aria-labelledby="collection-title">
      <header className="collection-header">
        <p className="eyebrow">Collection</p>
        <h1 id="collection-title">{title}</h1>
        <p className="description">{description}</p>
        <p className="collection-summary">
          {validation.lectureCount} {validation.lectureCount === 1 ? "lecture" : "lectures"} • {formatMinutes(totalMinutes)} total
          • {passingCount} passing
        </p>
        {courseMetadata ? (
          <dl className="lecture-list-meta" aria-label="Course metadata">
            {courseMetadata.audience ? (
              <div>
                <dt>Audience</dt>
                <dd>{courseMetadata.audience}</dd>
              </div>
            ) : null}
            {courseMetadata.level ? (
              <div>
                <dt>Level</dt>
                <dd>{courseMetadata.level}</dd>
              </div>
            ) : null}
            {courseMetadata.duration ? (
              <div>
                <dt>Duration</dt>
                <dd>{courseMetadata.duration}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}
      </header>

      <ol className="lecture-list">
        {validation.results.map((result, index) => {
          const template = result.template ?? fallbackTemplate(result);
          const lectureNumber = lectureNumberFromSlug(result.slug, index);
          const lectureTitle = template.metadata.title.trim() || humanizeSlug(result.slug);
          const statusClass = result.valid ? "validation-badge-pass" : "validation-badge-fail";
          const statusLabel = result.valid ? "PASS" : "FAIL";
          const statusIcon = result.valid ? "✓" : "✕";

          return (
            <li key={result.slug} className="lecture-list-item">
              <article aria-labelledby={`lecture-${result.slug}-title`}>
                <div className="lecture-list-header">
                  <span className={`validation-badge ${statusClass}`}>
                    {statusIcon} {statusLabel}
                  </span>
                  <h2 id={`lecture-${result.slug}-title`}>
                    <a className="lecture-list-link" href={`/lectures/${result.slug}`}>
                      {lectureNumber}. {lectureTitle}
                    </a>
                  </h2>
                  <p className="lecture-list-description">{template.metadata.description}</p>
                </div>

                <dl className="lecture-list-meta" aria-label="Lecture metadata">
                  <div>
                    <dt>Audience</dt>
                    <dd>{template.metadata.audience}</dd>
                  </div>
                  <div>
                    <dt>Level</dt>
                    <dd>{template.metadata.level}</dd>
                  </div>
                  <div>
                    <dt>Duration</dt>
                    <dd>{template.metadata.duration}</dd>
                  </div>
                  <div>
                    <dt>Sections</dt>
                    <dd>
                      {template.sections.length} {template.sections.length === 1 ? "section" : "sections"}
                    </dd>
                  </div>
                </dl>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function parseDurationMinutes(result: LectureValidationResult): number {
  const duration = result.template?.metadata.duration ?? "";
  const match = duration.match(/(\d+)/);
  return match ? Number.parseInt(match[1] ?? "0", 10) : 0;
}

function formatMinutes(totalMinutes: number): string {
  return `${totalMinutes} ${totalMinutes === 1 ? "minute" : "minutes"}`;
}

function lectureNumberFromSlug(slug: string, index: number): string {
  const match = slug.match(/^(\d{2})-/);
  return match?.[1] ?? String(index + 1).padStart(2, "0");
}

function humanizeSlug(slug: string): string {
  const base = slug.replace(/^\d{2}-/, "").replace(/[-_]+/g, " ").trim();
  if (base === "") return slug;
  return base.replace(/\b\w/g, (character) => character.toUpperCase());
}

function fallbackTemplate(result: LectureValidationResult) {
  return {
    metadata: {
      title: humanizeSlug(result.slug),
      description: "",
      audience: "",
      duration: "",
      level: "beginner"
    },
    overview: [],
    objectives: [],
    sections: [],
    takeaways: []
  };
}
