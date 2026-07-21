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
import { CollectionPrimaryAction } from "./CollectionPrimaryAction";
import { CollectionProgressProvider } from "./progress/CollectionProgressProvider";
import { CollectionReviewProvider } from "./progress/CollectionReviewProvider";
import { CourseDescription } from "./CourseDescription";
import { LectureList } from "./LectureList";
import { buildCollectionReviewRegistry } from "@/lib/lecture-template/collection";
import { CollectionLearnerDashboardSummary } from "./LearnerDashboardSummary";
import { CollectionReviewQueue } from "./CollectionReviewQueue";

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
  const reviewRegistry = buildCollectionReviewRegistry(validation);

  return (
    <CollectionProgressProvider storageKey={storageKey} lectures={progressLectures}>
      <CollectionReviewProvider registry={reviewRegistry}>
      <section className="collection-landing" aria-labelledby="collection-title">
        <header className="collection-header">
          <div className="collection-hero-copy">
            <p className="eyebrow">Course collection</p>
            <h1 id="collection-title">{title}</h1>
            <CourseDescription description={description} />
            <div className="collection-header-actions">
              <CollectionPrimaryAction lectures={progressLectures} />
              <a href="#lecture-list" className="collection-view-all-lectures">
                View all lectures <Icon name="arrow-next" />
              </a>
            </div>
          </div>
          <aside className="collection-course-facts" aria-label="Course at a glance">
            <p className="section-kicker">At a glance</p>
            <FactsList
              aria-label="Essential course facts"
              className="collection-summary"
              items={[
                { label: "Lectures", value: `${validation.lectureCount}` },
                { label: "Study time", value: formatMinutes(totalMinutes) },
                ...(readingMinutes > 0 ? [{ label: "Reading", value: `~${readingMinutes} min` }] : [])
              ]}
            />
            {courseMetadata ? (
              <FactsList
                aria-label="Additional course details"
                className="course-secondary-facts"
                variant="compact"
                items={[
                  { label: "Level", value: courseMetadata.level ?? "" },
                  { label: "Audience", value: courseMetadata.audience ?? "" },
                  { label: "Authored duration", value: courseMetadata.duration ?? "" }
                ]}
              />
            ) : null}
          </aside>
        </header>

        <CollectionLearnerDashboardSummary registry={reviewRegistry} lectures={progressLectures} />

        {reviewRegistry.length > 0 ? <CollectionReviewQueue registry={reviewRegistry} /> : null}

        <LectureList results={validation.results} progressLectures={progressLectures} courseMetadata={courseMetadata} />

        <CollectionReviewStatus validation={validation} />
        <AssessmentIndexDisclosure assessments={assessments} linkMode="collection" id="assessment-index" />
        <CollectionGlossaryIndex entries={glossaryEntries} />
      </section>
      </CollectionReviewProvider>
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
