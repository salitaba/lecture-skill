/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CollectionReviewProvider, useCollectionReview } from "../../src/components/lecture-kit/progress/CollectionReviewProvider";
import type { CollectionReviewRegistryEntry } from "../../src/lib/lecture-template/collection";

const registry: CollectionReviewRegistryEntry[] = [
  {
    slug: "01-first", lectureId: "lecture-first", order: 1, title: "First", objectives: [], sections: [],
    assessments: [{ id: "same-id", anchor: "first-anchor", type: "quiz", title: "First check", sectionTitle: "First section", sectionAnchor: "first", evaluationMode: "choice", supportsAnswerReview: true, supportsAnswerKey: true, isExplicitId: true, responseItems: [{ key: "first-anchor", label: "First check" }] }]
  },
  {
    slug: "02-second", lectureId: "lecture-second", order: 2, title: "Second", objectives: [], sections: [],
    assessments: [{ id: "same-id", anchor: "second-anchor", type: "quiz", title: "Second check", sectionTitle: "Second section", sectionAnchor: "second", evaluationMode: "choice", supportsAnswerReview: true, supportsAnswerKey: true, isExplicitId: true, responseItems: [{ key: "second-anchor", label: "Second check" }] }]
  }
];

function Harness() {
  const review = useCollectionReview();
  return <p data-testid="collection-review-status">{review.loaded ? "loaded" : "loading"} {Object.keys(review.recordsForLecture("lecture-first")).length} {Object.keys(review.recordsForLecture("lecture-second")).length}</p>;
}

describe("CollectionReviewProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem("lecture-progress:lecture-first:reviews", JSON.stringify({ "same-id": { status: "review", repetitions: 1, intervalDays: 1, dueAt: "2026-07-21T12:00:00.000Z", lastReviewedAt: "2026-07-20T12:00:00.000Z" } }));
    window.localStorage.setItem("lecture-progress:lecture-second:reviews", JSON.stringify({ "stale": { status: "review", repetitions: 1, intervalDays: 1, dueAt: "2026-07-21T12:00:00.000Z", lastReviewedAt: "2026-07-20T12:00:00.000Z" } }));
  });
  afterEach(() => window.localStorage.clear());

  it("keeps identical assessment IDs in lecture-local snapshots", async () => {
    render(<CollectionReviewProvider registry={registry}><Harness /></CollectionReviewProvider>);
    await waitFor(() => expect(screen.getByTestId("collection-review-status")).toHaveTextContent("loaded 1 0"));
  });
});
