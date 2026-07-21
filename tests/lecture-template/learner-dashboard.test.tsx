/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LearnerDashboardSummary } from "../../src/components/lecture-kit/LearnerDashboardSummary";
import { ProgressProvider } from "../../src/components/lecture-kit/progress/ProgressProvider";
import { ReviewProvider } from "../../src/components/lecture-kit/progress/ReviewProvider";
import type { AssessmentSummary } from "../../src/lib/lecture-template/assessments";
import type { LearningObjective } from "../../src/lib/lecture-template/types";

const objectives: LearningObjective[] = [{ id: "outcome", text: "Explain the outcome", isExplicit: true, textLocator: { line: 1 } }];
const assessments: AssessmentSummary[] = [{
  id: "check", anchor: "check-anchor", type: "quiz", title: "Check", sectionTitle: "Practice", sectionAnchor: "practice",
  evaluationMode: "choice", supportsAnswerReview: true, supportsAnswerKey: true, isExplicitId: true, objectiveRefs: ["outcome"], responseItems: [{ key: "check-anchor", label: "Check" }]
}];

describe("learner dashboard", () => {
  it("keeps counts neutral while local state hydrates", () => {
    render(<ProgressProvider storageKey="lecture-progress:dashboard" sections={[{ anchor: "practice", title: "Practice" }]} lectureId="dashboard" answerDefinitions={{}}><ReviewProvider lectureId="dashboard" activityKeys={["check"]}><LearnerDashboardSummary objectives={objectives} assessments={assessments} firstActionHref="#practice" /></ReviewProvider></ProgressProvider>);
    expect(screen.getByText(/checking saved progress on this device/i)).toBeInTheDocument();
    expect(screen.getAllByText("—")).toHaveLength(3);
    expect(screen.getByRole("region", { name: "Your learning loop" })).toBeInTheDocument();
  });

  it("prioritizes due review over resume", async () => {
    window.localStorage.setItem("lecture-progress:dashboard-due:reviews", JSON.stringify({
      check: { activityKey: "check", status: "review", repetitions: 1, intervalDays: 1, dueAt: "2020-01-01T00:00:00.000Z", lastReviewedAt: "2019-12-31T00:00:00.000Z" }
    }));
    render(<ProgressProvider storageKey="lecture-progress:dashboard-due" sections={[{ anchor: "practice", title: "Practice" }]} lectureId="dashboard-due" answerDefinitions={{}}><ReviewProvider lectureId="dashboard-due" activityKeys={["check"]}><LearnerDashboardSummary objectives={objectives} assessments={assessments} firstActionHref="#practice" /></ReviewProvider></ProgressProvider>);
    await waitFor(() => expect(screen.getByRole("link", { name: "Review due items" })).toHaveAttribute("href", "#review-queue"));
  });

  it("defers to the resume prompt when no review is due", async () => {
    window.localStorage.setItem("lecture-progress:dashboard-resume", JSON.stringify({ practice: true, reflection: false }));
    render(<ProgressProvider storageKey="lecture-progress:dashboard-resume" sections={[{ anchor: "practice", title: "Practice" }, { anchor: "reflection", title: "Reflection" }]} lectureId="dashboard-resume" answerDefinitions={{}}><ReviewProvider lectureId="dashboard-resume" activityKeys={["check"]}><LearnerDashboardSummary objectives={objectives} assessments={assessments} firstActionHref="#practice" /></ReviewProvider></ProgressProvider>);
    await waitFor(() => expect(screen.getByText("Use the resume prompt above to continue from your last spot.")).toBeInTheDocument());
    expect(screen.queryByRole("link", { name: "Continue from where you stopped" })).not.toBeInTheDocument();
  });
});
