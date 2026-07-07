/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnnotationsProvider } from "../../src/components/lecture-kit/progress/AnnotationsProvider";
import { HighlightableContent } from "../../src/components/lecture-kit/progress/HighlightableContent";
import { ProgressProvider } from "../../src/components/lecture-kit/progress/ProgressProvider";
import { SectionRenderer } from "../../src/components/lecture-kit/SectionRenderer";

const annotationsKey = "lecture-progress:test-lecture:annotations";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

function seed(highlights: unknown[]) {
  window.localStorage.setItem(annotationsKey, JSON.stringify({ highlights, notes: {} }));
}

describe("HighlightableContent", () => {
  it("renders a saved highlight as a <mark> wrapping the matching text", async () => {
    seed([{ id: "intro:0:6:11", sectionAnchor: "intro", blockIndex: 0, start: 6, end: 11, snippet: "World" }]);

    render(
      <AnnotationsProvider lectureId="test-lecture">
        <HighlightableContent anchor="intro">
          <p>Hello World, this is prose.</p>
        </HighlightableContent>
      </AnnotationsProvider>
    );

    await waitFor(() => expect(document.querySelector("mark.learner-highlight")).toBeInTheDocument());
    expect(document.querySelector("mark.learner-highlight")).toHaveTextContent("World");
    expect(screen.getByText(/Hello/).textContent).toBe("Hello World, this is prose.");
  });

  it("drops a highlight whose saved text no longer matches the rendered content", async () => {
    seed([{ id: "intro:0:6:11", sectionAnchor: "intro", blockIndex: 0, start: 6, end: 11, snippet: "Wrong" }]);

    render(
      <AnnotationsProvider lectureId="test-lecture">
        <HighlightableContent anchor="intro">
          <p>Hello World, this is prose.</p>
        </HighlightableContent>
      </AnnotationsProvider>
    );

    await waitFor(() => expect(screen.getByText(/Hello World/)).toBeInTheDocument());
    expect(document.querySelector("mark.learner-highlight")).not.toBeInTheDocument();
  });

  it("ignores highlights authored against a component block instead of prose", async () => {
    seed([{ id: "intro:0:0:4", sectionAnchor: "intro", blockIndex: 0, start: 0, end: 4, snippet: "Quiz" }]);

    render(
      <AnnotationsProvider lectureId="test-lecture">
        <HighlightableContent anchor="intro">
          <aside className="lecture-component">Quiz: pick one</aside>
        </HighlightableContent>
      </AnnotationsProvider>
    );

    await waitFor(() => expect(screen.getByText("Quiz: pick one")).toBeInTheDocument());
    expect(document.querySelector("mark.learner-highlight")).not.toBeInTheDocument();
  });

  it("removes a highlight on click, and again via Enter after re-adding", async () => {
    seed([{ id: "intro:0:6:11", sectionAnchor: "intro", blockIndex: 0, start: 6, end: 11, snippet: "World" }]);

    render(
      <AnnotationsProvider lectureId="test-lecture">
        <HighlightableContent anchor="intro">
          <p>Hello World, this is prose.</p>
        </HighlightableContent>
      </AnnotationsProvider>
    );

    await waitFor(() => expect(document.querySelector("mark.learner-highlight")).toBeInTheDocument());
    const mark = document.querySelector("mark.learner-highlight")!;
    expect(mark).toHaveAttribute("role", "button");
    expect(mark).toHaveAttribute("tabindex", "0");

    vi.useFakeTimers();
    fireEvent.click(mark);

    expect(document.querySelector("mark.learner-highlight")).not.toBeInTheDocument();
    expect(screen.getByText("Hello World, this is prose.")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(300);
    });
    vi.useRealTimers();

    expect(JSON.parse(window.localStorage.getItem(annotationsKey) ?? "{}").highlights ?? []).toEqual([]);
  });

  it("shows a Highlight action on text selection and persists the new highlight on click", async () => {
    render(
      <AnnotationsProvider lectureId="test-lecture">
        <HighlightableContent anchor="intro">
          <p>Hello World, this is prose.</p>
        </HighlightableContent>
      </AnnotationsProvider>
    );

    const paragraph = await screen.findByText(/Hello World/);
    const textNode = paragraph.firstChild;
    expect(textNode).not.toBeNull();

    const range = document.createRange();
    range.setStart(textNode!, 0);
    range.setEnd(textNode!, 5);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    document.dispatchEvent(new Event("selectionchange"));

    const highlightButton = await screen.findByRole("button", { name: "Highlight" });
    fireEvent.click(highlightButton);

    await waitFor(() => expect(document.querySelector("mark.learner-highlight")).toHaveTextContent("Hello"));
    expect(screen.queryByRole("button", { name: "Highlight" })).not.toBeInTheDocument();
  });

  it("survives an unrelated re-render of the enclosing section (e.g. toggling section completion)", async () => {
    seed([{ id: "intro:0:6:11", sectionAnchor: "intro", blockIndex: 0, start: 6, end: 11, snippet: "World" }]);

    render(
      <ProgressProvider storageKey="lecture-progress:test-lecture" sections={[{ anchor: "intro", title: "Introduction" }]}>
        <AnnotationsProvider lectureId="test-lecture">
          <SectionRenderer
            index={0}
            section={{
              anchor: "intro",
              title: "Introduction",
              blocks: [{ kind: "paragraph", text: "Hello World, this is prose.", locator: { line: 1 } }]
            }}
          />
        </AnnotationsProvider>
      </ProgressProvider>
    );

    await waitFor(() => expect(document.querySelector("mark.learner-highlight")).toHaveTextContent("World"));

    fireEvent.click(screen.getByRole("button", { name: "Mark Introduction complete" }));

    expect(screen.getByRole("button", { name: "Mark Introduction incomplete" })).toBeInTheDocument();
    expect(document.querySelector("mark.learner-highlight")).toHaveTextContent("World");
  });
});
