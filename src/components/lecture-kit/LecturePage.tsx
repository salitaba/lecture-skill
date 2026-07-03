import { LectureHeader } from "@/components/lecture-kit/LectureHeader";
import { PageShell } from "@/components/lecture-kit/PageShell";
import { RenderBlocks, SectionRenderer } from "@/components/lecture-kit/SectionRenderer";
import { SectionNavigation } from "@/components/lecture-kit/SectionNavigation";
import { lectureNavigationTargets } from "@/lib/lecture-template/navigationTargets";
import type { LectureTemplate } from "@/lib/lecture-template/types";

export interface LecturePageProps {
  lecture: LectureTemplate;
  templatePath: string;
}

export function LecturePage({ lecture, templatePath }: LecturePageProps) {
  void templatePath;

  return (
    <PageShell>
      <LectureHeader metadata={lecture.metadata} sectionCount={lecture.sections.length} />
      <div className="lecture-layout">
        <SectionNavigation sections={lecture.sections} />
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
            <SectionRenderer key={section.anchor} section={section} index={index} />
          ))}

          <section className="takeaways-section lecture-panel" aria-labelledby={lectureNavigationTargets.takeaways.id}>
            <p className="section-kicker">Review</p>
            <h2 id={lectureNavigationTargets.takeaways.id}>{lectureNavigationTargets.takeaways.label}</h2>
            <ul>
              {lecture.takeaways.map((takeaway, index) => (
                <li key={index}>{takeaway}</li>
              ))}
            </ul>
          </section>
        </article>
      </div>
    </PageShell>
  );
}
