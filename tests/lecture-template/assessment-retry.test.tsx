/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Quiz } from "../../src/components/lecture-kit/Quiz";
import { ProgressProvider } from "../../src/components/lecture-kit/progress/ProgressProvider";
import { ReviewProvider } from "../../src/components/lecture-kit/progress/ReviewProvider";
import type { QuizComponent } from "../../src/lib/lecture-template/types";

const quiz: QuizComponent = { type: "quiz", id: "stable-quiz", anchor: "quiz-anchor", question: "Which?", options: ["A", "B"], answer: "A" };

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("assessment retry", () => {
  it("unlocks a restored choice without creating a second answer history", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem("lecture-progress:retry-lecture:answers", JSON.stringify({ "quiz-anchor": { selected: "A", correct: true } }));
    render(
      <ProgressProvider storageKey="lecture-progress:retry-lecture" sections={[]} lectureId="retry-lecture" answerDefinitions={{ "quiz-anchor": { options: ["A", "B"], answer: "A" } }}>
        <ReviewProvider lectureId="retry-lecture" activityKeys={["stable-quiz"]}><Quiz component={quiz} /></ReviewProvider>
      </ProgressProvider>
    );
    await screen.findByRole("button", { name: "Retry this assessment" }, { timeout: 3000 });
    await user.click(screen.getByRole("button", { name: "Retry this assessment" }));
    expect(screen.getByRole("radio", { name: "A" })).not.toBeChecked();
    expect(window.localStorage.getItem("lecture-progress:retry-lecture:answers")).toContain("quiz-anchor");
  });

  it("shows review ratings only after a checked answer", async () => {
    const user = userEvent.setup();
    render(
      <ProgressProvider storageKey="lecture-progress:new-lecture" sections={[]} lectureId="new-lecture" answerDefinitions={{ "quiz-anchor": { options: ["A", "B"], answer: "A" } }}>
        <ReviewProvider lectureId="new-lecture" activityKeys={["stable-quiz"]}><Quiz component={quiz} /></ReviewProvider>
      </ProgressProvider>
    );
    expect(screen.queryByRole("button", { name: "Good" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "A" }));
    await user.click(screen.getByRole("button", { name: "Check answer" }));
    expect(screen.getByRole("button", { name: "Good" })).toBeInTheDocument();
  });
});
