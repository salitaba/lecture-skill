"use client";

import { useMemo } from "react";
import type { CollectionValidationResult, CourseMetadata, LectureValidationResult } from "@/lib/lecture-template/types";
import type { ProgressLecture } from "@/lib/lecture-template/progress";
import { calculateResumeTarget } from "@/lib/lecture-template/resumeTarget";
import { FactsList } from "../component-kit";
import { COLLECTION_REVIEW_STATUS_ID } from "./CollectionReviewStatus";
import { useCollectionProgress } from "./progress/CollectionProgressProvider";
import { CollectionLectureProgress } from "./progress/CollectionProgressBar";

type LearnerState = "not-started" | "in-progress" | "completed";

export function LectureList({
  results,
  progressLectures,
  courseMetadata
}: {
  results: CollectionValidationResult["results"];
  progressLectures: ProgressLecture[];
  courseMetadata?: CourseMetadata;
}) {
  const { progress, lectures, loaded } = useCollectionProgress();
  const resumeTarget = useMemo(() => calculateResumeTarget(progress, progressLectures), [progress, progressLectures]);
  const resumeSlug = loaded && resumeTarget.label !== "Continue course" ? resumeTarget.slug : undefined;

  return (
    <section className="lecture-list-section" aria-labelledby="lecture-list-heading">
      <header className="lecture-list-heading">
        <p className="section-kicker">Course map</p>
        <h2 id="lecture-list-heading">Lectures</h2>
        <p>Move through the course in order, or resume where you left off.</p>
      </header>
      <ol className="lecture-list" id="lecture-list">
        {results.map((result, index) => {
          const template = result.template ?? fallbackTemplate(result);
          const lectureNumber = lectureNumberFromSlug(result.slug, index);
          const lectureTitle = template.metadata.title.trim() || humanizeSlug(result.slug);
          const summary = lectures.find((lecture) => lecture.slug === result.slug);
          const learnerState: LearnerState | undefined = !loaded || !result.valid || !summary
            ? undefined
            : summary.percentComplete === 100
              ? "completed"
              : summary.percentComplete > 0
                ? "in-progress"
                : "not-started";
          const isResumeCard = result.slug === resumeSlug;
          const itemClassName = [
            "lecture-list-item",
            isResumeCard ? "lecture-list-item-resume" : null,
            learnerState === "completed" ? "lecture-list-item-complete" : null
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <li key={result.slug} className={itemClassName}>
              <article aria-labelledby={`lecture-${result.slug}-title`}>
                <div className="lecture-list-header">
                  <h2 id={`lecture-${result.slug}-title`}>
                    <a className="lecture-list-link" href={`/lectures/${result.slug}`}>
                      {lectureNumber}. {lectureTitle}
                    </a>
                  </h2>
                  {isResumeCard ? (
                    <span className="lecture-state lecture-state-resume">Resume here</span>
                  ) : learnerState ? (
                    <span className={`lecture-state lecture-state-${learnerState}`}>{learnerStateLabel(learnerState)}</span>
                  ) : null}
                  <p className="lecture-list-description">{template.metadata.description}</p>
                </div>

                <FactsList
                  aria-label="Lecture metadata"
                  className="lecture-list-meta"
                  variant="compact"
                  items={lectureFacts(template.metadata, template.sections.length, courseMetadata)}
                />
                {result.valid ? (
                  <CollectionLectureProgress slug={result.slug} />
                ) : (
                  <p className="collection-progress-unavailable lecture-list-validation">
                    <strong>Author/reviewer note:</strong> This lecture is not available to learners until its template issues are fixed. {" "}
                    <a href={`#${COLLECTION_REVIEW_STATUS_ID}`}>Review validation details</a>.
                  </p>
                )}
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function lectureFacts(
  metadata: { audience: string; duration: string; level: string },
  sectionCount: number,
  courseMetadata?: CourseMetadata
) {
  const facts = [
    { label: "Estimated study time", value: metadata.duration },
    { label: "Sections", value: `${sectionCount} ${sectionCount === 1 ? "section" : "sections"}` }
  ];

  if (!courseMetadata || normalize(metadata.audience) !== normalize(courseMetadata.audience)) {
    facts.push({ label: "Audience", value: metadata.audience });
  }
  if (!courseMetadata || normalize(metadata.level) !== normalize(courseMetadata.level)) {
    facts.push({ label: "Level", value: metadata.level });
  }

  return facts;
}

function normalize(value: string | undefined): string {
  return value?.trim().toLocaleLowerCase() ?? "";
}

function learnerStateLabel(state: LearnerState): string {
  if (state === "completed") return "Completed";
  if (state === "in-progress") return "In progress";
  return "Not started";
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
