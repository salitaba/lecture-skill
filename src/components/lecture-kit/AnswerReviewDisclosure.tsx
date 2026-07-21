"use client";

import { collectLectureAssessments } from "@/lib/lecture-template/assessments";
import type { LectureTemplate } from "@/lib/lecture-template/types";
import { useProgressOptional } from "./progress/ProgressProvider";

interface ReviewItem {
  key: string;
  href: string;
  label: string;
  status: "missed" | "unattempted";
}

export function AnswerReviewDisclosure({ lecture }: { lecture: LectureTemplate }) {
  const progressContext = useProgressOptional();
  if (!progressContext?.answersLoaded) return null;

  const answers = progressContext.answers;
  const entries = collectLectureAssessments(lecture).filter((entry) => entry.supportsAnswerReview);
  const items: ReviewItem[] = [];

  for (const entry of entries) {
    for (const responseItem of entry.responseItems) {
      const attempt = answers[responseItem.key];
      if (!attempt) {
        items.push({ key: responseItem.key, href: `#${entry.anchor}`, label: responseItem.label, status: "unattempted" });
      } else if (!attempt.correct) {
        items.push({ key: responseItem.key, href: `#${entry.anchor}`, label: responseItem.label, status: "missed" });
      }
    }
  }

  if (items.length === 0) return null;

  return (
    <section className="lecture-panel answer-review" aria-labelledby="answer-review-heading">
      <p className="section-kicker">Review</p>
      <h2 id="answer-review-heading">Review your answers</h2>
      <p className="answer-review-summary">
        {items.length} {items.length === 1 ? "item" : "items"} to revisit — missed or not yet attempted.
      </p>
      <ul className="answer-review-list">
        {items.map((item) => (
          <li key={item.key} className="answer-review-item">
            <a href={item.href}>{item.label}</a>
            <span className={`answer-review-status answer-review-status-${item.status}`}>
              {item.status === "missed" ? "Missed" : "Not attempted"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
