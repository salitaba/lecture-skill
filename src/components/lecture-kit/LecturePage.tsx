import { AnswerKeyAppendix } from "@/components/lecture-kit/AnswerKeyAppendix";
import { GlossaryIndex } from "@/components/lecture-kit/GlossaryIndex";
import { Icon } from "@/components/component-kit";
import { LectureHeader } from "@/components/lecture-kit/LectureHeader";
import { LectureNavigation, type NavTarget } from "@/components/lecture-kit/LectureNavigation";
import { PageShell } from "@/components/lecture-kit/PageShell";
import { RenderBlocks, SectionRenderer } from "@/components/lecture-kit/SectionRenderer";
import { SectionNavigation } from "@/components/lecture-kit/SectionNavigation";
import { collectLectureGlossary } from "@/lib/lecture-template/glossaryIndex";
import { lectureNavigationTargets } from "@/lib/lecture-template/navigationTargets";
import { progressIdFromTemplatePath, singleLectureProgressKey } from "@/lib/lecture-template/progress";
import { lectureReadingMinutes, sectionReadingMinutes } from "@/lib/lecture-template/readingTime";
import type { LectureTemplate } from "@/lib/lecture-template/types";
import type { ProgressLecture } from "@/lib/lecture-template/progress";
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
  const sectionMinutes = Object.fromEntries(lecture.sections.map((section) => [section.anchor, sectionReadingMinutes(section)]));
  const glossaryEntries = collectLectureGlossary(lecture);

  return (
    <PageShell>
      <ProgressProvider
        storageKey={storageKey}
        sections={progressSections}
        collectionStorageKey={collectionContext?.collectionStorageKey}
        collectionLectures={collectionContext?.collectionLectures}
      >
        <LectureHeader metadata={lecture.metadata} sectionCount={lecture.sections.length} readingMinutes={readingMinutes} />
        <ResumePrompt />
        <LectureProgressBar />
        {collectionNavigation ? (
          <CollectionTopNav
            next={collectionNavigation.next}
            backHref={collectionNavigation.backHref}
            backLabel={collectionNavigation.backLabel}
          />
        ) : null}
        <div className="lecture-layout">
          <SectionNavigation sections={lecture.sections} sectionMinutes={sectionMinutes} />
          <article className="lecture-content">
            <section className="overview-section lecture-panel" aria-labelledby={lectureNavigationTargets.overview.id}>
              <p className="section-kicker">Start Here</p>
              <h2 id={lectureNavigationTargets.overview.id}>{lectureNavigationTargets.overview.label}</h2>
              <RenderBlocks blocks={lecture.overview} />
            </section>

            <section className="objectives-section lecture-panel" aria-labelledby={lectureNavigationTargets.objectives.id}>
              <p className="section-kicker">Outcomes</p>
              <h2 id={lectureNavigationTargets.objectives.id}>{lectureNavigationTargets.objectives.label}</h2>
              <ul>
                {lecture.objectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </section>

            {lecture.sections.map((section, index) => (
              <SectionRenderer key={section.anchor} section={section} index={index} lectureId={lectureId} />
            ))}

            <section className="takeaways-section lecture-panel surface-emphasis" aria-labelledby={lectureNavigationTargets.takeaways.id}>
              <p className="section-kicker">Review</p>
              <h2 id={lectureNavigationTargets.takeaways.id}>{lectureNavigationTargets.takeaways.label}</h2>
              <ul>
                {lecture.takeaways.map((takeaway, index) => (
                  <li key={index}>{takeaway}</li>
                ))}
              </ul>
            </section>

            <GlossaryIndex entries={glossaryEntries} id="lecture-glossary-index" />

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
      </ProgressProvider>
    </PageShell>
  );
}

function CollectionTopNav({
  next,
  backHref,
  backLabel = "Back to course"
}: {
  next?: NavTarget;
  backHref: string;
  backLabel?: string;
}) {
  return (
    <nav className="lecture-nav lecture-nav-top" aria-label="Course navigation">
      <div className="lecture-nav-inner">
        <a className="lecture-nav-link lecture-nav-back" href={backHref}>
          {backLabel}
        </a>
        {next ? (
          <a className="lecture-nav-link lecture-nav-next" href={`/lectures/${next.slug}`}>
            {next.title} <Icon name="arrow-next" />
          </a>
        ) : null}
      </div>
    </nav>
  );
}
