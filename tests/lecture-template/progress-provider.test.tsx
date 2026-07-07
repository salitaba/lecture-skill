/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LectureProgressBar } from "../../src/components/lecture-kit/progress/LectureProgressBar";
import { ProgressLiveRegion } from "../../src/components/lecture-kit/progress/ProgressLiveRegion";
import { ProgressProvider, useProgress } from "../../src/components/lecture-kit/progress/ProgressProvider";
import { ResumePrompt } from "../../src/components/lecture-kit/progress/ResumePrompt";
import { SectionCompletionToggle } from "../../src/components/lecture-kit/progress/SectionCompletionToggle";

const sections = [
  { anchor: "first-topic", title: "First Topic" },
  { anchor: "second-topic", title: "Second Topic" }
];
const storageKey = "lecture-progress:test-lecture";

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("ProgressProvider", () => {
  it("loads stored progress, renders summaries, and debounces writes", async () => {
    window.localStorage.setItem(storageKey, JSON.stringify({ "first-topic": true, unknown: true }));
    renderProgress();

    await waitFor(() => expect(screen.getByText("1 of 2 sections completed")).toBeInTheDocument());
    vi.useFakeTimers();
    expect(screen.getByRole("button", { name: "Mark First Topic incomplete" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("progressbar", { name: "Lecture progress" })).toHaveAttribute("aria-valuenow", "50");

    fireEvent.click(screen.getByRole("button", { name: "Mark Second Topic complete" }));

    expect(screen.getByText("2 of 2 sections completed")).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(storageKey) ?? "{}")).toEqual({ "first-topic": true, unknown: true });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(JSON.parse(window.localStorage.getItem(storageKey) ?? "{}")).toEqual({
      "first-topic": true,
      "second-topic": true
    });
  });

  it("resets immediately after confirmation and cancels pending writes", async () => {
    window.localStorage.setItem(storageKey, JSON.stringify({ "first-topic": true }));
    vi.spyOn(window, "confirm").mockReturnValue(true);
    renderProgress();

    await waitFor(() => expect(screen.getByText("1 of 2 sections completed")).toBeInTheDocument());
    vi.useFakeTimers();
    fireEvent.click(screen.getByRole("button", { name: "Mark Second Topic complete" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset progress" }));

    expect(window.confirm).toHaveBeenCalledWith("Reset progress for this lecture?");
    expect(window.localStorage.getItem(storageKey)).toBeNull();
    expect(screen.getByText("0 of 2 sections completed")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(window.localStorage.getItem(storageKey)).toBeNull();
    expect(screen.getAllByText("Progress reset.").length).toBeGreaterThan(0);
  });

  it("ignores corrupted JSON without breaking the page", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    window.localStorage.setItem(storageKey, "{bad json");

    renderProgress();

    await waitFor(() => expect(screen.getByText("0 of 2 sections completed")).toBeInTheDocument());
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("Ignoring corrupted lecture progress"), expect.any(SyntaxError));
  });

  it("continues when localStorage is unavailable", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    renderProgress();

    await waitFor(() => expect(screen.getByText("0 of 2 sections completed (not saved)")).toBeInTheDocument());
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("Lecture progress storage is unavailable"), expect.any(Error));
    fireEvent.click(screen.getByRole("button", { name: "Mark First Topic complete" }));
    expect(screen.getByText("1 of 2 sections completed (not saved)")).toBeInTheDocument();
  });

  it("announces toggles, supports shortcuts, and clears toast timers", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    renderProgressWithSections();

    await waitFor(() => expect(screen.getByText("0 of 2 sections completed")).toBeInTheDocument());
    vi.useFakeTimers();
    fireEvent.keyDown(window, { key: "m", altKey: true });

    expect(screen.getByRole("button", { name: "Mark First Topic incomplete" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByText("Section marked complete. 1 of 2 sections finished.").length).toBeGreaterThan(0);

    fireEvent.keyDown(window, { key: "r", altKey: true });

    expect(window.confirm).toHaveBeenCalledWith("Reset progress for this lecture?");
    expect(screen.getByText("0 of 2 sections completed")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.queryByRole("status", { name: "" })).not.toBeInTheDocument();
  });

  it("announces a distinct lecture-complete milestone toast only when the last section finishes", async () => {
    renderProgress();

    await waitFor(() => expect(screen.getByText("0 of 2 sections completed")).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Mark First Topic complete" }));

    expect(screen.getAllByText("Section marked complete. 1 of 2 sections finished.").length).toBeGreaterThan(0);
    expect(document.querySelector(".progress-toast-milestone")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Mark Second Topic complete" }));

    expect(screen.getAllByText("Lecture complete! All 2 sections finished.").length).toBeGreaterThan(0);
    expect(document.querySelector(".progress-toast-milestone")).toBeInTheDocument();
  });

  it("does not run progress shortcuts from editable controls", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    render(
      <ProgressProvider storageKey={storageKey} sections={sections}>
        <LectureProgressBar />
        <textarea aria-label="Your response" />
        <SectionCompletionToggle anchor="first-topic" title="First Topic" />
      </ProgressProvider>
    );

    await waitFor(() => expect(screen.getByText("0 of 2 sections completed")).toBeInTheDocument());
    const textarea = screen.getByRole("textbox", { name: "Your response" });
    textarea.focus();

    fireEvent.keyDown(textarea, { key: "m", altKey: true });
    fireEvent.keyDown(textarea, { key: "r", altKey: true });

    expect(screen.getByRole("button", { name: "Mark First Topic complete" })).toHaveAttribute("aria-pressed", "false");
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it("shows a session-only resume prompt for partial stored progress", async () => {
    window.localStorage.setItem(storageKey, JSON.stringify({ "first-topic": true }));
    const scrollIntoView = vi.fn();
    document.body.innerHTML = '<section id="second-topic"></section>';
    vi.spyOn(document, "getElementById").mockReturnValue({ scrollIntoView } as unknown as HTMLElement);

    render(
      <ProgressProvider storageKey={storageKey} sections={sections}>
        <ResumePrompt />
        <LectureProgressBar />
        <SectionCompletionToggle anchor="first-topic" title="First Topic" />
        <SectionCompletionToggle anchor="second-topic" title="Second Topic" />
        <ProgressLiveRegion />
      </ProgressProvider>
    );

    await waitFor(() => expect(screen.getByText(/Continue from/)).toBeInTheDocument());
    expect(screen.getByText("Second Topic")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: "Continue reading" }));

    expect(scrollIntoView).toHaveBeenCalledWith({ block: "start", behavior: "smooth" });
    expect(screen.queryByText(/Continue from/)).not.toBeInTheDocument();
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

function renderProgressWithSections() {
  return render(
    <ProgressProvider storageKey={storageKey} sections={sections}>
      <LectureProgressBar />
      <ProgressHarness />
      <ProgressLiveRegion />
    </ProgressProvider>
  );
}

function ProgressHarness() {
  const { progress } = useProgress();

  return (
    <>
      <section id="first-topic" className={progress["first-topic"] ? "lecture-section lecture-section-complete" : "lecture-section"}>
        <SectionCompletionToggle anchor="first-topic" title="First Topic" />
      </section>
      <section id="second-topic">
        <SectionCompletionToggle anchor="second-topic" title="Second Topic" />
      </section>
    </>
  );
}
