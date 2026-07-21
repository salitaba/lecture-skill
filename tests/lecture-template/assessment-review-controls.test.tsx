/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AssessmentReviewControls } from "../../src/components/lecture-kit/AssessmentReviewControls";
import { ReviewProvider } from "../../src/components/lecture-kit/progress/ReviewProvider";

describe("assessment review controls", () => {
  it("explains rating outcomes and confirms the selected schedule", async () => {
    const user = userEvent.setup();
    render(
      <ReviewProvider lectureId="review-controls" activityKeys={["activity"]}>
        <AssessmentReviewControls activityKey="activity" evaluated mode="choice" />
      </ReviewProvider>
    );

    expect(screen.getByRole("button", { name: "Good" })).toHaveAccessibleDescription("Again reviews now · Hard soon · Good later · Easy much later.");
    await user.click(screen.getByRole("button", { name: "Good" }));
    expect(screen.getByRole("status")).toHaveTextContent("Good selected");
  });
});
