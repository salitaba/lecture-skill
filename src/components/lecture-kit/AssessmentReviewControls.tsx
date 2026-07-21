"use client";

import { useId, useState } from "react";
import { Button } from "@/components/component-kit";
import type { ReviewRating } from "@/lib/lecture-template/reviewSchedule";
import { useReviewOptional } from "./progress/ReviewProvider";

export interface AssessmentReviewControlsProps {
  activityKey: string;
  evaluated: boolean;
  canRetry?: boolean;
  onRetry?: () => void;
  mode: "choice" | "reveal" | "self_assess" | "rubric";
}

export function AssessmentReviewControls({ activityKey, evaluated, canRetry = false, onRetry, mode }: AssessmentReviewControlsProps) {
  const review = useReviewOptional();
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const helpId = useId();
  if (!review || !evaluated) return canRetry && onRetry ? <RetryControl onRetry={onRetry} /> : null;

  const rate = (rating: ReviewRating) => {
    review.rate(activityKey, rating);
    setConfirmation(`${ratingCopy[rating].label} selected — ${ratingCopy[rating].result}.`);
  };
  return (
    <fieldset className="assessment-review-controls">
      <legend className="assessment-review-label">How did this review feel?</legend>
      {canRetry && onRetry ? <RetryControl onRetry={onRetry} /> : null}
      <p id={helpId} className="assessment-review-help">Again reviews now · Hard soon · Good later · Easy much later.</p>
      {!review.storageAvailable ? <p className="assessment-review-storage-warning" role="status">Review choices are available for this session but cannot be saved on this device.</p> : null}
      <div className="assessment-review-actions">
        {(Object.keys(ratingCopy) as ReviewRating[]).map((rating) => (
          <Button key={rating} size="compact" variant={rating === "good" ? "primary" : "ghost"} onClick={() => rate(rating)} aria-describedby={helpId}>
            {ratingCopy[rating].label}
          </Button>
        ))}
      </div>
      {confirmation ? <span className="assessment-review-confirmation" role="status" aria-live="polite">{confirmation}</span> : null}
      <span className="sr-only">Evaluation mode: {mode.replace("_", " ")}.</span>
    </fieldset>
  );
}

const ratingCopy: Record<ReviewRating, { label: string; result: string }> = {
  again: { label: "Again", result: "scheduled for review now" },
  hard: { label: "Hard", result: "scheduled for review soon" },
  good: { label: "Good", result: "scheduled for a later review" },
  easy: { label: "Easy", result: "scheduled for a much later review" }
};

function RetryControl({ onRetry }: { onRetry: () => void }) {
  return <Button size="compact" variant="ghost" onClick={onRetry} aria-label="Retry this assessment">Retry</Button>;
}
