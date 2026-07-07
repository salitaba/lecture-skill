"use client";

import { collectLectureAnswerKey } from "@/lib/lecture-template/assessments";
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
  const answers = progressContext?.answers ?? {};

  if (Object.keys(answers).length === 0) return null;

  const entries = collectLectureAnswerKey(lecture).filter((entry) => entry.type === "quiz" || entry.type === "question_set");
  const items: ReviewItem[] = [];

  for (const entry of entries) {
    if (entry.type === "quiz") {
      const attempt = answers[entry.anchor];
      if (!attempt) {
        items.push({ key: entry.anchor, href: `#${entry.anchor}`, label: entry.title, status: "unattempted" });
      } else if (!attempt.correct) {
        items.push({ key: entry.anchor, href: `#${entry.anchor}`, label: entry.title, status: "missed" });
      }
      continue;
    }

    entry.questions?.forEach((question, index) => {
      const itemKey = `${entry.anchor}:${index}`;
      const attempt = answers[itemKey];
      const label = `${question.question} (${entry.title})`;
      if (!attempt) {
        items.push({ key: itemKey, href: `#${entry.anchor}`, label, status: "unattempted" });
      } else if (!attempt.correct) {
        items.push({ key: itemKey, href: `#${entry.anchor}`, label, status: "missed" });
      }
    });
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
