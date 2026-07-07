"use client";

import { useMemo } from "react";
import type { CollectionValidationResult, LectureValidationResult } from "@/lib/lecture-template/types";
import type { ProgressLecture } from "@/lib/lecture-template/progress";
import { calculateResumeTarget } from "@/lib/lecture-template/resumeTarget";
import { useCollectionProgress } from "./progress/CollectionProgressProvider";
import { CollectionLectureProgress } from "./progress/CollectionProgressBar";

type LearnerState = "not-started" | "in-progress" | "completed";

export function LectureList({
  results,
  progressLectures
}: {
  results: CollectionValidationResult["results"];
  progressLectures: ProgressLecture[];
}) {
  const { progress, lectures, loaded } = useCollectionProgress();
  const resumeTarget = useMemo(() => calculateResumeTarget(progress, progressLectures), [progress, progressLectures]);
  const resumeSlug = loaded && resumeTarget.label !== "Continue course" ? resumeTarget.slug : undefined;

  return (
    <ol className="lecture-list" id="lecture-list">
      {results.map((result, index) => {
        const template = result.template ?? fallbackTemplate(result);
        const lectureNumber = lectureNumberFromSlug(result.slug, index);
        const lectureTitle = template.metadata.title.trim() || humanizeSlug(result.slug);
        const summary = lectures.find((lecture) => lecture.slug === result.slug);
        const learnerState: LearnerState | undefined = !result.valid || !summary
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
              {result.valid ? (
                <CollectionLectureProgress slug={result.slug} />
              ) : (
                <p className="collection-progress-unavailable">Progress unavailable until this lecture validates.</p>
              )}
            </article>
          </li>
        );
      })}
    </ol>
  );
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
