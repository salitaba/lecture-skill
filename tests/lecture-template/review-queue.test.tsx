/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReviewQueue } from "../../src/components/lecture-kit/ReviewQueue";
import type { AssessmentSummary } from "../../src/lib/lecture-template/assessments";
import type { LearningObjective } from "../../src/lib/lecture-template/types";

const objective: LearningObjective = { id: "outcome", text: "Explain the outcome", isExplicit: true, textLocator: { line: 1 } };
const assessment: AssessmentSummary = {
  id: "review-check", anchor: "review-check-anchor", type: "quiz", title: "Review check", sectionTitle: "Practice", sectionAnchor: "practice",
  evaluationMode: "choice", supportsAnswerReview: true, supportsAnswerKey: true, isExplicitId: true, objectiveRefs: ["outcome"], responseItems: [{ key: "review-check", label: "Review check" }]
};

describe("review queue", () => {
  it("renders due activities in authored order and links to source anchors", () => {
    render(<ReviewQueue objectives={[objective]} assessments={[assessment]} loaded records={{ "review-check": { activityKey: "review-check", status: "review", repetitions: 1, intervalDays: 1, dueAt: "2026-07-21T12:00:00.000Z", lastReviewedAt: "2026-07-20T12:00:00.000Z" } }} now="2026-07-21T12:00:00.000Z" />);
    expect(screen.getByRole("link", { name: "Review check" })).toHaveAttribute("href", "#review-check-anchor");
    expect(screen.getByText("Explain the outcome")).toBeInTheDocument();
    expect(screen.getByText("Due now")).toBeInTheDocument();
  });

  it("renders a neutral empty state before review state loads", () => {
    render(<ReviewQueue objectives={[objective]} assessments={[assessment]} loaded={false} records={{}} />);
    expect(screen.getByText(/checking saved review timing/i)).toBeInTheDocument();
  });

  it("provides a direct next action when nothing is due", () => {
    render(<ReviewQueue objectives={[objective]} assessments={[assessment]} loaded records={{}} emptyStateHref="#practice" emptyStateLabel="Continue reading" />);
    expect(screen.getByRole("link", { name: "Continue reading" })).toHaveAttribute("href", "#practice");
  });

  it("explains when review state cannot persist", () => {
    render(<ReviewQueue objectives={[objective]} assessments={[assessment]} loaded records={{}} storageAvailable={false} />);
    expect(screen.getByText(/cannot be saved on this device/i)).toBeInTheDocument();
  });

  it("renders scoped collection activities in one authored queue", () => {
    render(
      <ReviewQueue
        objectives={[]}
        assessments={[]}
        loaded
        scopes={[
          {
            id: "lecture-one",
            title: "First lecture",
            baseHref: "/lectures/01-first",
            objectives: [objective],
            assessments: [assessment],
            records: { "review-check": { activityKey: "review-check", status: "review", repetitions: 1, intervalDays: 1, dueAt: "2026-07-21T12:00:00.000Z", lastReviewedAt: "2026-07-20T12:00:00.000Z" } }
          },
          {
            id: "lecture-two",
            title: "Second lecture",
            baseHref: "/lectures/02-second",
            objectives: [objective],
            assessments: [{ ...assessment, id: "second-check", anchor: "second-check-anchor", title: "Second check" }],
            records: { "second-check": { activityKey: "second-check", status: "review", repetitions: 1, intervalDays: 1, dueAt: "2026-07-21T12:00:00.000Z", lastReviewedAt: "2026-07-20T12:00:00.000Z" } }
          }
        ]}
      />
    );
    const queue = screen.getAllByRole("region", { name: "Review queue" }).at(-1)!;
    const reviewLinks = within(queue).getAllByRole("link", { name: "Review check" });
    expect(reviewLinks[0]).toHaveAttribute("href", "/lectures/01-first#review-check-anchor");
    expect(reviewLinks[1]).toHaveAttribute("href", "/lectures/02-second#second-check-anchor");
    expect(screen.getByText("First lecture · Practice")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "First lecture", level: 4 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Second lecture", level: 4 })).toBeInTheDocument();
  });
});
