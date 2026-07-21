import type { CollectionValidationResult } from "@/lib/lecture-template/types";
import { collectCollectionAssessments } from "@/lib/lecture-template/assessments";
import { collectCollectionGlossary } from "@/lib/lecture-template/glossaryIndex";
import { LECTURES_DIR } from "@/lib/lecture-template/readTemplate";
import { collectionProgressKey, progressIdFromCollectionBase, type ProgressLecture } from "@/lib/lecture-template/progress";
import { sumLectureReadingMinutes } from "@/lib/lecture-template/readingTime";
import { FactsList, Icon } from "@/components/component-kit";
import { AssessmentIndexDisclosure } from "./AssessmentIndexDisclosure";
import { CollectionGlossaryIndex } from "./CollectionGlossaryIndex";
import { CollectionReviewStatus } from "./CollectionReviewStatus";
import { CollectionProgressBar } from "./progress/CollectionProgressBar";
import { CollectionPrimaryAction } from "./CollectionPrimaryAction";
import { CollectionProgressProvider } from "./progress/CollectionProgressProvider";
import { CourseDescription } from "./CourseDescription";
import { LectureList } from "./LectureList";

export interface CollectionLandingProps {
  validation: CollectionValidationResult;
}

export function CollectionLanding({ validation }: CollectionLandingProps) {
  const courseMetadata = validation.courseMetadata.status === "valid" ? validation.courseMetadata.metadata : undefined;
  const title = courseMetadata?.title ?? "Lecture Collection";
  const description =
    courseMetadata?.description ??
    `${validation.lectureCount} ${validation.lectureCount === 1 ? "lecture" : "lectures"} in authored order.`;
  const assessments = collectCollectionAssessments(validation);
  const glossaryEntries = collectCollectionGlossary(validation);
  const validTemplates = validation.results.filter((result) => result.valid && result.template).map((result) => result.template!);
  const totalMinutes = validTemplates.reduce((sum, template) => sum + parseDurationMinutes(template.metadata.duration), 0);
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
          <CourseDescription description={description} />
          <FactsList
            aria-label="Essential course facts"
            className="collection-summary"
            items={[
              { label: "Lectures", value: `${validation.lectureCount} ${validation.lectureCount === 1 ? "lecture" : "lectures"}` },
              { label: "Estimated study time", value: formatMinutes(totalMinutes) },
              ...(readingMinutes > 0 ? [{ label: "Reading time", value: `~${readingMinutes} min read` }] : [])
            ]}
          />
          {courseMetadata ? (
            <FactsList
              aria-label="Additional course details"
              className="course-secondary-facts"
              variant="compact"
              items={[
                { label: "Audience", value: courseMetadata.audience ?? "" },
                { label: "Level", value: courseMetadata.level ?? "" },
                { label: "Authored duration", value: courseMetadata.duration ?? "" }
              ]}
            />
          ) : null}
          <div className="collection-header-actions">
            <CollectionPrimaryAction lectures={progressLectures} />
            <a href="#lecture-list" className="collection-view-all-lectures">
              View all lectures <Icon name="arrow-next" />
            </a>
          </div>
        </header>

        <CollectionProgressBar />

        <LectureList results={validation.results} progressLectures={progressLectures} courseMetadata={courseMetadata} />

        <CollectionReviewStatus validation={validation} />
        <AssessmentIndexDisclosure assessments={assessments} linkMode="collection" id="assessment-index" />
        <CollectionGlossaryIndex entries={glossaryEntries} />
      </section>
    </CollectionProgressProvider>
  );
}

function parseDurationMinutes(duration: string): number {
  const match = duration.match(/(\d+)/);
  return match ? Number.parseInt(match[1] ?? "0", 10) : 0;
}

function formatMinutes(totalMinutes: number): string {
  return `${totalMinutes} ${totalMinutes === 1 ? "minute" : "minutes"}`;
}
