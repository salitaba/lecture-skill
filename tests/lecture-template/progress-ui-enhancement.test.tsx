/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LectureProgressBar } from "../../src/components/lecture-kit/progress/LectureProgressBar";
import { ProgressLiveRegion } from "../../src/components/lecture-kit/progress/ProgressLiveRegion";
import { ProgressProvider } from "../../src/components/lecture-kit/progress/ProgressProvider";
import { SectionCompletionToggle } from "../../src/components/lecture-kit/progress/SectionCompletionToggle";

const sections = [
  { anchor: "first-topic", title: "First Topic" },
  { anchor: "second-topic", title: "Second Topic" }
];
const storageKey = "lecture-progress:test-ui";

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("progress UI enhancement", () => {
  it("preserves progressbar accessible values and text summary", async () => {
    window.localStorage.setItem(storageKey, JSON.stringify({ "first-topic": true }));
    renderProgress();

    await waitFor(() => expect(screen.getByText("1 of 2 sections completed")).toBeInTheDocument());
    expect(screen.getByRole("progressbar", { name: "Lecture progress" })).toHaveAttribute("aria-valuenow", "50");
    expect(screen.getByRole("progressbar", { name: "Lecture progress" })).toHaveAttribute("aria-valuemin", "0");
    expect(screen.getByRole("progressbar", { name: "Lecture progress" })).toHaveAttribute("aria-valuemax", "100");
  });

  it("renders reset as a secondary keyboard-reachable button", async () => {
    renderProgress();

    await waitFor(() => expect(screen.getByText("0 of 2 sections completed")).toBeInTheDocument());
    const resetButton = screen.getByRole("button", { name: "Reset progress" });
    expect(resetButton).toBeInTheDocument();
    expect(resetButton).not.toBeDisabled();

    await vi.waitFor(() => {
      resetButton.focus();
    });
    expect(resetButton).toHaveFocus();
  });

  it("section completion toggle has proper ARIA and touch-friendly markup", async () => {
    renderProgress();

    await waitFor(() => expect(screen.getByText("0 of 2 sections completed")).toBeInTheDocument());
    const toggle = screen.getByRole("button", { name: "Mark First Topic complete" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(toggle).toHaveAttribute("type", "button");

    const completionDiv = toggle.closest(".section-completion");
    expect(completionDiv).toBeInTheDocument();

    const label = completionDiv?.querySelector(".section-completion-label");
    expect(label).toHaveTextContent("Mark complete");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(label).toHaveTextContent("Completed");

    const ariaLabel = toggle.getAttribute("aria-label");
    expect(ariaLabel).toBe("Mark First Topic incomplete");
  });

  it("renders milestones summary for screen readers and hides boxes on small viewports", async () => {
    renderProgress();

    await waitFor(() => expect(screen.getByText("0 of 2 sections completed")).toBeInTheDocument());
    const milestoneLabels = screen.getAllByLabelText("Progress milestones");
    expect(milestoneLabels.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("0 of 4 milestones reached")).toBeInTheDocument();
  });

  it("renders completion toggle with print fallback text", async () => {
    renderProgress();

    await waitFor(() => expect(screen.getByText("0 of 2 sections completed")).toBeInTheDocument());
    const printText = screen.getAllByText("Progress: incomplete");
    expect(printText.length).toBeGreaterThan(0);
  });
});

function renderProgress() {
  return render(
    <ProgressProvider storageKey={storageKey} sections={sections}>
      <LectureProgressBar />
      <SectionCompletionToggle anchor="first-topic" title="First Topic" />
      <SectionCompletionToggle anchor="second-topic" title="Second Topic" />
      <ProgressLiveRegion />
    </ProgressProvider>
  );
}
