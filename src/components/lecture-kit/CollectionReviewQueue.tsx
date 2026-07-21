"use client";

import type { CollectionReviewRegistryEntry } from "@/lib/lecture-template/collection";
import { ReviewQueue } from "./ReviewQueue";
import { useCollectionReview } from "./progress/CollectionReviewProvider";

export function CollectionReviewQueue({ registry }: { registry: readonly CollectionReviewRegistryEntry[] }) {
  const review = useCollectionReview();
  const firstLecture = registry[0];
  return (
    <ReviewQueue
      objectives={[]}
      assessments={[]}
      loaded={review.loaded}
      storageAvailable={review.storageAvailable}
      id="course-review-queue"
      titleId="course-review-queue-title"
      emptyStateHref={firstLecture ? `/lectures/${firstLecture.slug}` : undefined}
      emptyStateLabel={firstLecture ? "Start the first lecture" : undefined}
      title="Review across the course"
      scopes={registry.map((entry) => ({
        id: entry.lectureId,
        title: entry.title,
        baseHref: `/lectures/${entry.slug}`,
        objectives: entry.objectives,
        assessments: entry.assessments,
        records: review.recordsForLecture(entry.lectureId)
      }))}
    />
  );
}
