/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ObjectiveEvidenceMap } from "../../src/components/lecture-kit/ObjectiveEvidenceMap";
import type { AssessmentSummary } from "../../src/lib/lecture-template/assessments";
import type { LearningObjective } from "../../src/lib/lecture-template/types";

const objective: LearningObjective = { id: "build", text: "Build the model", isExplicit: true, textLocator: { line: 1 } };
const assessment: AssessmentSummary = {
  id: "model-check", anchor: "model-check-anchor", type: "quiz", title: "Model check", sectionTitle: "Model", sectionAnchor: "model",
  evaluationMode: "choice", supportsAnswerReview: true, supportsAnswerKey: true, isExplicitId: true, objectiveRefs: ["build"], responseItems: [{ key: "model-check-anchor", label: "Model check" }]
};

describe("objective evidence map", () => {
  it("renders authored objective text before any browser state is available", () => {
    render(<ObjectiveEvidenceMap objectives={[objective]} assessments={[assessment]} />);
    expect(screen.getByText("Build the model")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Review Model: Model check" })).toHaveAttribute("href", "#model-check-anchor");
    expect(screen.getByRole("region", { name: "See what your practice is showing" })).toBeInTheDocument();
  });
});
