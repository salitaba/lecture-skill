import type { CollectionValidationResult, LectureValidationResult } from "@/lib/lecture-template/types";
import { collectCollectionAssessments } from "@/lib/lecture-template/assessments";
import { LECTURES_DIR } from "@/lib/lecture-template/readTemplate";
import { collectionProgressKey, progressIdFromCollectionBase, type ProgressLecture } from "@/lib/lecture-template/progress";
import { CollectionProgressBar, CollectionLectureProgress } from "./progress/CollectionProgressBar";
import { CollectionPrimaryAction } from "./CollectionPrimaryAction";
import { CollectionProgressProvider } from "./progress/CollectionProgressProvider";

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
  const assessments = collectCollectionAssessments(validation);
  const progressLectures: ProgressLecture[] = validation.results
    .filter((result) => result.valid && result.template)
    .map((result) => ({
      slug: result.slug,
      sections: result.template?.sections.map((section) => ({ anchor: section.anchor, title: section.title })) ?? []
    }));
  const collectionId = progressIdFromCollectionBase(LECTURES_DIR, courseMetadata?.title);
  const storageKey = collectionProgressKey(collectionId);

  return (
    <CollectionProgressProvider storageKey={storageKey} lectures={progressLectures}>
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
          <CollectionPrimaryAction lectures={progressLectures} />
          <a href="#lecture-list" className="collection-view-all-lectures">
            View all lectures
          </a>
        </header>

        <CollectionProgressBar />

        <ol className="lecture-list" id="lecture-list">
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
                    <h2 id={`lecture-${result.slug}-title`}>
                      <a className="lecture-list-link" href={`/lectures/${result.slug}`}>
                        {lectureNumber}. {lectureTitle}
                      </a>
                    </h2>
                    <span className={`validation-badge ${statusClass}`}>
                      {statusIcon} {statusLabel}
                    </span>
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
                  {result.valid ? <CollectionLectureProgress slug={result.slug} /> : <p className="collection-progress-unavailable">Progress unavailable until this lecture validates.</p>}
                </article>
              </li>
            );
          })}
        </ol>

        <details className="assessment-index-disclosure">
          <summary>Assessment locations for reviewers</summary>
          {assessments.length > 0 ? (
            <ol className="assessment-group-list">
              {groupAssessmentsByLecture(assessments).map(({ lectureTitle, lectureSlug, items }) => (
                <li key={lectureSlug ?? lectureTitle} className="assessment-group">
                  <h3 className="assessment-group-title">{lectureTitle}</h3>
                  <ol className="assessment-group-items">
                    {items.map((assessment) => (
                      <li key={`${assessment.lectureSlug}-${assessment.anchor}`}>
                        <a href={`/lectures/${assessment.lectureSlug}#${assessment.anchor}`} title={assessment.title}>
                          {truncateTitle(assessment.title)}
                        </a>
                        <span className="assessment-group-meta">
                          {labelForAssessment(assessment.type)}
                        </span>
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ol>
          ) : (
            <p>No assessments found in valid lectures.</p>
          )}
        </details>
      </section>
    </CollectionProgressProvider>
  );
}

function labelForAssessment(type: string): string {
  if (type === "quiz") return "Quiz";
  if (type === "question_set") return "Question set";
  if (type === "free_response") return "Free response";
  return "Practice task";
}

function truncateTitle(title: string): string {
  return title.length > 60 ? title.slice(0, 57) + "\u2026" : title;
}

interface AssessmentGroup {
  lectureTitle: string;
  lectureSlug: string | undefined;
  items: ReturnType<typeof collectCollectionAssessments>;
}

function groupAssessmentsByLecture(assessments: ReturnType<typeof collectCollectionAssessments>): AssessmentGroup[] {
  const map = new Map<string, AssessmentGroup>();
  for (const assessment of assessments) {
    const key = assessment.lectureSlug ?? assessment.lectureTitle ?? "unknown";
    if (!map.has(key)) {
      map.set(key, { lectureTitle: assessment.lectureTitle ?? key, lectureSlug: assessment.lectureSlug, items: [] });
    }
    map.get(key)!.items.push(assessment);
  }
  return Array.from(map.values());
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
