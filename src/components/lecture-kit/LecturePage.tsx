import { AnswerKeyAppendix } from "@/components/lecture-kit/AnswerKeyAppendix";
import { AnswerReviewDisclosure } from "@/components/lecture-kit/AnswerReviewDisclosure";
import { AnnotationsIndexDisclosure } from "@/components/lecture-kit/AnnotationsIndexDisclosure";
import { GlossaryIndex } from "@/components/lecture-kit/GlossaryIndex";
import { LectureHeader } from "@/components/lecture-kit/LectureHeader";
import { LectureNavigation, type NavTarget } from "@/components/lecture-kit/LectureNavigation";
import { PageShell } from "@/components/lecture-kit/PageShell";
import { RenderBlocks, SectionRenderer } from "@/components/lecture-kit/SectionRenderer";
import { SectionNavigation } from "@/components/lecture-kit/SectionNavigation";
import { collectLectureGlossary } from "@/lib/lecture-template/glossaryIndex";
import { lectureNavigationTargets } from "@/lib/lecture-template/navigationTargets";
import { progressIdFromTemplatePath, singleLectureProgressKey } from "@/lib/lecture-template/progress";
import { lectureReadingMinutes } from "@/lib/lecture-template/readingTime";
import type { LectureTemplate } from "@/lib/lecture-template/types";
import type { ProgressLecture } from "@/lib/lecture-template/progress";
import { AnnotationsProvider } from "./progress/AnnotationsProvider";
import { LectureProgressBar } from "./progress/LectureProgressBar";
import { ProgressLiveRegion } from "./progress/ProgressLiveRegion";
import { ProgressProvider } from "./progress/ProgressProvider";
import { ResumePrompt } from "./progress/ResumePrompt";

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

  return (
    <PageShell>
      <ProgressProvider
        storageKey={storageKey}
        sections={progressSections}
        collectionStorageKey={collectionContext?.collectionStorageKey}
        collectionLectures={collectionContext?.collectionLectures}
        lectureId={lectureId}
      >
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
                    {lecture.objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              </section>

              {lecture.sections.map((section, index) => (
                <SectionRenderer key={section.anchor} section={section} index={index} lectureId={lectureId} />
              ))}

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
      </ProgressProvider>
    </PageShell>
  );
}
