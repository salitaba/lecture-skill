/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AnnotationsIndexDisclosure } from "../../src/components/lecture-kit/AnnotationsIndexDisclosure";
import { AnnotationsProvider } from "../../src/components/lecture-kit/progress/AnnotationsProvider";

const annotationsKey = "lecture-progress:test-lecture:annotations";
const sections = [
  { anchor: "intro", title: "Introduction" },
  { anchor: "wrap-up", title: "Wrap Up" }
];

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("AnnotationsIndexDisclosure", () => {
  it("renders nothing outside a provider", () => {
    render(<AnnotationsIndexDisclosure sections={sections} />);
    expect(screen.queryByText(/highlights & notes/)).not.toBeInTheDocument();
  });

  it("renders nothing when there are no highlights or notes", () => {
    render(
      <AnnotationsProvider lectureId="test-lecture">
        <AnnotationsIndexDisclosure sections={sections} />
      </AnnotationsProvider>
    );

    expect(screen.queryByText(/highlights & notes/)).not.toBeInTheDocument();
  });

  it("lists highlights and notes with links to their section anchors, collapsed by default", async () => {
    window.localStorage.setItem(
      annotationsKey,
      JSON.stringify({
        highlights: [{ id: "intro:0:0:5", sectionAnchor: "intro", blockIndex: 0, start: 0, end: 5, snippet: "Hello" }],
        notes: { "wrap-up": "Remember the summary." }
      })
    );

    render(
      <AnnotationsProvider lectureId="test-lecture">
        <AnnotationsIndexDisclosure sections={sections} />
      </AnnotationsProvider>
    );

    const disclosure = await screen.findByText("Show your highlights & notes (2)");
    expect(disclosure.closest("details")).not.toHaveAttribute("open");

    const highlightLink = screen.getByRole("link", { name: "“Hello”" });
    expect(highlightLink).toHaveAttribute("href", "#intro");
    expect(highlightLink.closest("li")).toHaveTextContent("Introduction");

    const noteLink = screen.getByRole("link", { name: "Wrap Up" });
    expect(noteLink).toHaveAttribute("href", "#wrap-up");
    expect(noteLink.closest("li")).toHaveTextContent("Remember the summary.");
  });
});
