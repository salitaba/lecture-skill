/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProgressProvider } from "../../src/components/lecture-kit/progress/ProgressProvider";
import { LectureProgressBar } from "../../src/components/lecture-kit/progress/LectureProgressBar";
import { ProgressLiveRegion } from "../../src/components/lecture-kit/progress/ProgressLiveRegion";
import { SectionCompletionToggle } from "../../src/components/lecture-kit/progress/SectionCompletionToggle";
import { singleLectureReviewsKey } from "../../src/lib/lecture-template/progress";

const sections = [
  { anchor: "first-topic", title: "First Topic" },
  { anchor: "second-topic", title: "Second Topic" }
];
const lectureStorageKey = "lecture-progress:test-lecture";
const collectionStorageKey = "lecture-progress:collection:test-collection";
const collectionLectures = [
  { slug: "01-intro", sections: [{ anchor: "first-topic", title: "First Topic" }, { anchor: "second-topic", title: "Second Topic" }] },
  { slug: "02-core", sections: [{ anchor: "model", title: "Model" }] }
];

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("ProgressProvider collection integration", () => {
  it("keeps review storage separate from section progress", async () => {
    window.localStorage.setItem(singleLectureReviewsKey("test-lecture"), JSON.stringify({ "quiz-a": { status: "review", repetitions: 1, intervalDays: 1, dueAt: "2026-07-22T12:00:00.000Z", lastReviewedAt: "2026-07-21T12:00:00.000Z" } }));
    render(<ProgressProvider storageKey={lectureStorageKey} sections={sections}><SectionCompletionToggle anchor="first-topic" title="First Topic" /></ProgressProvider>);
    await waitFor(() => expect(screen.getByRole("button", { name: "Mark First Topic complete" })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Mark First Topic complete" }));
    await waitFor(() => expect(window.localStorage.getItem(lectureStorageKey)).toBeTruthy());
    expect(window.localStorage.getItem(singleLectureReviewsKey("test-lecture"))).toContain("quiz-a");
    expect(window.localStorage.getItem(lectureStorageKey)).not.toContain("quiz-a");
  });
  it("writes lecture progress to both lecture and collection storage keys on toggle", async () => {
    render(
      <ProgressProvider
        storageKey={lectureStorageKey}
        sections={sections}
        collectionStorageKey={collectionStorageKey}
        collectionLectures={collectionLectures}
      >
        <SectionCompletionToggle anchor="first-topic" title="First Topic" />
      </ProgressProvider>
    );

    await waitFor(() => expect(screen.getByRole("button", { name: "Mark First Topic complete" })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Mark First Topic complete" }));

    await waitFor(() => {
      const lectureData = window.localStorage.getItem(lectureStorageKey);
      expect(lectureData).toBeTruthy();
    });

    expect(JSON.parse(window.localStorage.getItem(lectureStorageKey) ?? "{}")).toEqual({ "first-topic": true });
    const collection = JSON.parse(window.localStorage.getItem(collectionStorageKey) ?? "{}");
    expect(collection["01-intro"]).toEqual({ "first-topic": true });
  });

  it("removes lecture from collection storage on reset", async () => {
    window.localStorage.setItem(lectureStorageKey, JSON.stringify({ "first-topic": true }));
    window.localStorage.setItem(
      collectionStorageKey,
      JSON.stringify({ "01-intro": { "first-topic": true }, "02-core": { model: true } })
    );
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(
      <ProgressProvider
        storageKey={lectureStorageKey}
        sections={sections}
        collectionStorageKey={collectionStorageKey}
        collectionLectures={collectionLectures}
      >
        <LectureProgressBar />
        <SectionCompletionToggle anchor="first-topic" title="First Topic" />
      </ProgressProvider>
    );

    await waitFor(() => expect(screen.getByText("1 of 2 sections completed")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "Reset progress" }));

    await waitFor(() => {
      expect(window.localStorage.getItem(lectureStorageKey)).toBeNull();
    });

    const collection = JSON.parse(window.localStorage.getItem(collectionStorageKey) ?? "{}");
    expect(collection["01-intro"]).toBeUndefined();
    expect(collection["02-core"]).toEqual({ model: true });
  });

  it("operates without collection context in single-lecture mode", async () => {
    render(
      <ProgressProvider storageKey={lectureStorageKey} sections={sections}>
        <SectionCompletionToggle anchor="first-topic" title="First Topic" />
      </ProgressProvider>
    );

    await waitFor(() => expect(screen.getByRole("button", { name: "Mark First Topic complete" })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Mark First Topic complete" }));

    await waitFor(() => {
      const lectureData = window.localStorage.getItem(lectureStorageKey);
      expect(lectureData).toBeTruthy();
    });

    expect(JSON.parse(window.localStorage.getItem(lectureStorageKey) ?? "{}")).toEqual({ "first-topic": true });
    expect(window.localStorage.getItem(collectionStorageKey)).toBeNull();
  });

  it("announces a course-complete milestone only when the last incomplete lecture in the collection finishes", async () => {
    window.localStorage.setItem(lectureStorageKey, JSON.stringify({ "first-topic": true }));
    window.localStorage.setItem(collectionStorageKey, JSON.stringify({ "01-intro": { "first-topic": true }, "02-core": { model: true } }));

    render(
      <ProgressProvider
        storageKey={lectureStorageKey}
        sections={sections}
        collectionStorageKey={collectionStorageKey}
        collectionLectures={collectionLectures}
      >
        <SectionCompletionToggle anchor="first-topic" title="First Topic" />
        <SectionCompletionToggle anchor="second-topic" title="Second Topic" />
        <ProgressLiveRegion />
      </ProgressProvider>
    );

    await waitFor(() => expect(screen.getByRole("button", { name: "Mark Second Topic complete" })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Mark Second Topic complete" }));

    await waitFor(() => {
      expect(screen.getAllByText("You've completed the whole course. Nice work!").length).toBeGreaterThan(0);
    });
    expect(document.querySelector(".progress-toast-milestone")).toBeInTheDocument();
  });

  it("does not announce course-complete when other lectures in the collection are still incomplete", async () => {
    window.localStorage.setItem(lectureStorageKey, JSON.stringify({ "first-topic": true }));
    window.localStorage.setItem(collectionStorageKey, JSON.stringify({ "01-intro": { "first-topic": true } }));

    render(
      <ProgressProvider
        storageKey={lectureStorageKey}
        sections={sections}
        collectionStorageKey={collectionStorageKey}
        collectionLectures={collectionLectures}
      >
        <SectionCompletionToggle anchor="first-topic" title="First Topic" />
        <SectionCompletionToggle anchor="second-topic" title="Second Topic" />
        <ProgressLiveRegion />
      </ProgressProvider>
    );

    await waitFor(() => expect(screen.getByRole("button", { name: "Mark Second Topic complete" })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Mark Second Topic complete" }));

    await waitFor(() => {
      const collection = JSON.parse(window.localStorage.getItem(collectionStorageKey) ?? "{}");
      expect(collection["01-intro"]).toEqual({ "first-topic": true, "second-topic": true });
    });
    expect(screen.queryAllByText("You've completed the whole course. Nice work!").length).toBe(0);
  });
});
