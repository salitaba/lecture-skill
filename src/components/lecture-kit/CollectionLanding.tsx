import type { CollectionValidationResult, LectureValidationResult } from "@/lib/lecture-template/types";
import { collectCollectionAssessments } from "@/lib/lecture-template/assessments";
import { collectCollectionGlossary } from "@/lib/lecture-template/glossaryIndex";
import { LECTURES_DIR } from "@/lib/lecture-template/readTemplate";
import { collectionProgressKey, progressIdFromCollectionBase, type ProgressLecture } from "@/lib/lecture-template/progress";
import { sumLectureReadingMinutes } from "@/lib/lecture-template/readingTime";
import { AssessmentIndexDisclosure } from "./AssessmentIndexDisclosure";
import { CollectionGlossaryIndex } from "./CollectionGlossaryIndex";
import { CollectionProgressBar } from "./progress/CollectionProgressBar";
import { CollectionPrimaryAction } from "./CollectionPrimaryAction";
import { CollectionProgressProvider } from "./progress/CollectionProgressProvider";
import { LectureList } from "./LectureList";

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
  const glossaryEntries = collectCollectionGlossary(validation);
  const validTemplates = validation.results.filter((result) => result.valid && result.template).map((result) => result.template!);
  const readingMinutes = sumLectureReadingMinutes(validTemplates);
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
            {readingMinutes > 0 ? <> • ~{readingMinutes} min read</> : null} • {passingCount} passing
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

        <LectureList results={validation.results} progressLectures={progressLectures} />

        <AssessmentIndexDisclosure assessments={assessments} id="assessment-index" />
        <CollectionGlossaryIndex entries={glossaryEntries} />
      </section>
    </CollectionProgressProvider>
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
