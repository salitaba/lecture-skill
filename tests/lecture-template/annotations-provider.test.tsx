/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnnotationsProvider, useAnnotations, useAnnotationsOptional } from "../../src/components/lecture-kit/progress/AnnotationsProvider";

const annotationsKey = "lecture-progress:test-lecture:annotations";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  window.localStorage.clear();
});

function Harness() {
  const { highlights, notes, addHighlight, removeHighlight, setNote } = useAnnotations();

  return (
    <>
      <p data-testid="highlight-count">{highlights.length}</p>
      <ul>
        {Object.entries(notes).map(([anchor, text]) => (
          <li key={anchor}>
            {anchor}: {text}
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => addHighlight({ sectionAnchor: "intro", blockIndex: 0, start: 0, end: 5, snippet: "Hello" })}>
        Add highlight
      </button>
      <button
        type="button"
        onClick={() => highlights[0] && removeHighlight(highlights[0].id)}
      >
        Remove first highlight
      </button>
      <button type="button" onClick={() => setNote("intro", "My note")}>
        Set note
      </button>
    </>
  );
}

describe("AnnotationsProvider", () => {
  it("loads stored annotations and debounces writes", async () => {
    window.localStorage.setItem(
      annotationsKey,
      JSON.stringify({ highlights: [{ id: "intro:0:0:5", sectionAnchor: "intro", blockIndex: 0, start: 0, end: 5, snippet: "Hello" }], notes: {} })
    );

    render(
      <AnnotationsProvider lectureId="test-lecture">
        <Harness />
      </AnnotationsProvider>
    );

    await waitFor(() => expect(screen.getByTestId("highlight-count")).toHaveTextContent("1"));

    vi.useFakeTimers();
    fireEvent.click(screen.getByRole("button", { name: "Set note" }));

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(JSON.parse(window.localStorage.getItem(annotationsKey) ?? "{}").notes).toEqual({ intro: "My note" });
  });

  it("adds and removes highlights without duplicating identical ranges", async () => {
    render(
      <AnnotationsProvider lectureId="test-lecture">
        <Harness />
      </AnnotationsProvider>
    );

    await waitFor(() => expect(screen.getByTestId("highlight-count")).toHaveTextContent("0"));

    fireEvent.click(screen.getByRole("button", { name: "Add highlight" }));
    fireEvent.click(screen.getByRole("button", { name: "Add highlight" }));
    expect(screen.getByTestId("highlight-count")).toHaveTextContent("1");

    fireEvent.click(screen.getByRole("button", { name: "Remove first highlight" }));
    expect(screen.getByTestId("highlight-count")).toHaveTextContent("0");
  });

  it("ignores corrupted stored annotations without breaking the page", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    window.localStorage.setItem(annotationsKey, "{not json");

    render(
      <AnnotationsProvider lectureId="test-lecture">
        <Harness />
      </AnnotationsProvider>
    );

    await waitFor(() => expect(screen.getByTestId("highlight-count")).toHaveTextContent("0"));
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("Ignoring corrupted annotations"), expect.any(SyntaxError));
  });

  it("useAnnotationsOptional returns undefined outside a provider", () => {
    function Standalone() {
      const context = useAnnotationsOptional();
      return <p>{context === undefined ? "no-provider" : "has-provider"}</p>;
    }

    render(<Standalone />);
    expect(screen.getByText("no-provider")).toBeInTheDocument();
  });
});
