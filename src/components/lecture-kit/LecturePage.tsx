import { AnswerKeyAppendix } from "@/components/lecture-kit/AnswerKeyAppendix";
import { AnswerReviewDisclosure } from "@/components/lecture-kit/AnswerReviewDisclosure";
import { AssessmentIndexDisclosure } from "@/components/lecture-kit/AssessmentIndexDisclosure";
import { AnnotationsIndexDisclosure } from "@/components/lecture-kit/AnnotationsIndexDisclosure";
import { GlossaryIndex } from "@/components/lecture-kit/GlossaryIndex";
import { LectureHeader } from "@/components/lecture-kit/LectureHeader";
import { LectureNavigation, type NavTarget } from "@/components/lecture-kit/LectureNavigation";
import { PageShell } from "@/components/lecture-kit/PageShell";
import { RenderBlocks, SectionRenderer } from "@/components/lecture-kit/SectionRenderer";
import { SectionNavigation } from "@/components/lecture-kit/SectionNavigation";
import { collectLectureGlossary } from "@/lib/lecture-template/glossaryIndex";
import { collectLectureAnswerDefinitions, collectLectureAssessments } from "@/lib/lecture-template/assessments";
import { lectureNavigationTargets } from "@/lib/lecture-template/navigationTargets";
import { progressIdFromTemplatePath, singleLectureProgressKey } from "@/lib/lecture-template/progress";
import { lectureReadingMinutes } from "@/lib/lecture-template/readingTime";
import type { LectureTemplate } from "@/lib/lecture-template/types";
import type { ProgressLecture } from "@/lib/lecture-template/progress";
import { AnnotationsProvider } from "./progress/AnnotationsProvider";
import { LectureProgressBar } from "./progress/LectureProgressBar";
import { ProgressLiveRegion } from "./progress/ProgressLiveRegion";
import { ProgressProvider } from "./progress/ProgressProvider";
import { ReviewProvider } from "./progress/ReviewProvider";
import { ResumePrompt } from "./progress/ResumePrompt";
import { LearnerDashboardSummary } from "./LearnerDashboardSummary";
import { ObjectiveEvidenceMap } from "./ObjectiveEvidenceMap";
import { ReviewQueue } from "./ReviewQueue";
import { FragmentFocusTarget } from "./progress/FragmentFocusTarget";

export interface CollectionNavigationContext {
  previous?: NavTarget;
  next?: NavTarget;
  backHref: string;
  backLabel?: string;
}

export interface LecturePageProps {
  lecture: LectureTemplate;
  templatePath: string;
  collectionNavigation?: CollectionNavigationContext;
  collectionContext?: {
    collectionStorageKey: string;
    collectionLectures: ProgressLecture[];
  };
}

export function LecturePage({ lecture, templatePath, collectionNavigation, collectionContext }: LecturePageProps) {
  const lectureId = progressIdFromTemplatePath(templatePath, lecture.metadata.title);
  const storageKey = singleLectureProgressKey(lectureId);
  const progressSections = lecture.sections.map((section) => ({ anchor: section.anchor, title: section.title }));
  const readingMinutes = lectureReadingMinutes(lecture);
  const glossaryEntries = collectLectureGlossary(lecture);
  const assessments = collectLectureAssessments(lecture);
  const answerDefinitions = collectLectureAnswerDefinitions(lecture);
  const reviewActivityKeys = assessments.flatMap((assessment) => assessment.type === "question_set" ? assessment.responseItems.map((_, index) => `${assessment.id}:${index}`) : [assessment.id]);

  return (
    <PageShell>
      <FragmentFocusTarget />
      <ProgressProvider
        storageKey={storageKey}
        sections={progressSections}
        collectionStorageKey={collectionContext?.collectionStorageKey}
        collectionLectures={collectionContext?.collectionLectures}
        lectureId={lectureId}
        answerDefinitions={answerDefinitions}
      >
        <ReviewProvider lectureId={lectureId} activityKeys={reviewActivityKeys}>
          <AnnotationsProvider lectureId={lectureId}>
          <LectureHeader
            metadata={lecture.metadata}
            sectionCount={lecture.sections.length}
            readingMinutes={readingMinutes}
            backHref={collectionNavigation?.backHref}
            backLabel={collectionNavigation?.backLabel}
          />
          <ResumePrompt />
          <LectureProgressBar />
          <div className="lecture-layout">
            <SectionNavigation sections={lecture.sections} />
            <article className="lecture-content">
              <section className="overview-section lecture-panel quiet-reading-surface" aria-labelledby={lectureNavigationTargets.overview.id}>
                <p className="section-kicker">Start Here</p>
                <h2 id={lectureNavigationTargets.overview.id}>{lectureNavigationTargets.overview.label}</h2>
                <div className="lecture-prose">
                  <RenderBlocks blocks={lecture.overview} />
                </div>
              </section>

              <section className="objectives-section lecture-panel quiet-reading-surface" aria-labelledby={lectureNavigationTargets.objectives.id}>
                <p className="section-kicker">Outcomes</p>
                <h2 id={lectureNavigationTargets.objectives.id}>{lectureNavigationTargets.objectives.label}</h2>
                <div className="lecture-prose">
                  <ul>
                    {lecture.objectives.map((objective) => (
                      <li key={objective.id}>{objective.text}</li>
                    ))}
                  </ul>
                </div>
              </section>

              {lecture.sections.map((section, index) => (
                <SectionRenderer key={section.anchor} section={section} index={index} lectureId={lectureId} />
              ))}

              <ObjectiveEvidenceMap objectives={lecture.objectives} assessments={assessments} />

              <section className="takeaways-section lecture-panel surface-emphasis" aria-labelledby={lectureNavigationTargets.takeaways.id}>
                <p className="section-kicker">Review</p>
                <h2 id={lectureNavigationTargets.takeaways.id}>{lectureNavigationTargets.takeaways.label}</h2>
                <div className="lecture-prose">
                  <ul>
                    {lecture.takeaways.map((takeaway, index) => (
                      <li key={index}>{takeaway}</li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="lecture-study-tools" aria-labelledby="lecture-study-tools-title">
                <header className="lecture-study-tools-header">
                  <p className="section-kicker">After the lesson</p>
                  <h2 id="lecture-study-tools-title">Study tools</h2>
                  <p>Review your progress, revisit activities, or find an assessment when you need it.</p>
                </header>
                <LearnerDashboardSummary objectives={lecture.objectives} assessments={assessments} firstActionHref={`#${lecture.sections[0]?.anchor ?? lectureNavigationTargets.overview.id}`} />
                <ReviewQueue
                  objectives={lecture.objectives}
                  assessments={assessments}
                  emptyStateHref="#learning-path"
                  emptyStateLabel="Browse learning path"
                  compactEmpty
                />
                <AssessmentIndexDisclosure assessments={assessments} linkMode="single" id="lecture-assessment-index" />
              </section>

              <GlossaryIndex entries={glossaryEntries} id="lecture-glossary-index" />

              <AnswerReviewDisclosure lecture={lecture} />

              <AnnotationsIndexDisclosure sections={progressSections} />

              <AnswerKeyAppendix lecture={lecture} />
            </article>
          </div>
          {collectionNavigation ? (
            <LectureNavigation
              previous={collectionNavigation.previous}
              next={collectionNavigation.next}
              backHref={collectionNavigation.backHref}
              backLabel={collectionNavigation.backLabel}
            />
          ) : null}
          <ProgressLiveRegion />
          </AnnotationsProvider>
        </ReviewProvider>
      </ProgressProvider>
    </PageShell>
  );
}
