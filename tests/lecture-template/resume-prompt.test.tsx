/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { LecturePage } from "../../src/components/lecture-kit/LecturePage";
import { ProgressProvider } from "../../src/components/lecture-kit/progress/ProgressProvider";
import { ResumePrompt } from "../../src/components/lecture-kit/progress/ResumePrompt";
import { validateTemplateSource } from "../../src/lib/lecture-template/validateTemplate";
import { fixture } from "./testUtils";

const sections = [
  { anchor: "first-topic", title: "First Topic" },
  { anchor: "second-topic", title: "Second Topic" }
];
const storageKey = "lecture-progress:resume-prompt-test";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("ResumePrompt", () => {
  it("renders nothing when there is no resume target", () => {
    render(
      <ProgressProvider storageKey={storageKey} sections={sections}>
        <ResumePrompt />
      </ProgressProvider>
    );

    expect(screen.queryByLabelText("Resume lecture")).not.toBeInTheDocument();
  });

  it("renders a single primary action naming the section when progress is partial", async () => {
    window.localStorage.setItem(storageKey, JSON.stringify({ "first-topic": true }));

    render(
      <ProgressProvider storageKey={storageKey} sections={sections}>
        <ResumePrompt />
      </ProgressProvider>
    );

    await waitFor(() => expect(screen.getByLabelText("Resume lecture")).toBeInTheDocument());
    expect(screen.getByText(/Continue from/)).toBeInTheDocument();
    expect(screen.getByText("Second Topic")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Continue reading" })).toHaveLength(1);
  });

  it("is dismissible for the current mount without navigating away", async () => {
    window.localStorage.setItem(storageKey, JSON.stringify({ "first-topic": true }));

    render(
      <ProgressProvider storageKey={storageKey} sections={sections}>
        <ResumePrompt />
      </ProgressProvider>
    );

    await waitFor(() => expect(screen.getByLabelText("Resume lecture")).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));

    expect(screen.queryByLabelText("Resume lecture")).not.toBeInTheDocument();
  });
});

describe("LecturePage layout order", () => {
  it("renders the header, resume prompt slot, progress bar, and learning path in the spec order", () => {
    const result = validateTemplateSource(fixture("content/lecture.template.md"));
    if (!result.valid) throw new Error("fixture should be valid");

    const html = renderToStaticMarkup(<LecturePage lecture={result.template} templatePath="content/lecture.template.md" />);

    const headerIndex = html.indexOf("lecture-header");
    const progressIndex = html.indexOf("lecture-progress");
    const layoutIndex = html.indexOf("lecture-layout");

    expect(headerIndex).toBeGreaterThan(-1);
    expect(progressIndex).toBeGreaterThan(headerIndex);
    expect(layoutIndex).toBeGreaterThan(progressIndex);
  });

  it("puts teaching content before secondary study tools", () => {
    const result = validateTemplateSource(fixture("content/lecture.template.md"));
    if (!result.valid) throw new Error("fixture should be valid");

    const html = renderToStaticMarkup(<LecturePage lecture={result.template} templatePath="content/lecture.template.md" />);
    const overviewIndex = html.indexOf('id="overview-heading"');
    const firstSectionIndex = html.indexOf(`id="${result.template.sections[0]?.anchor}"`);
    const takeawaysIndex = html.indexOf('id="takeaways-heading"');
    const studyToolsIndex = html.indexOf('id="lecture-study-tools-title"');
    const dashboardIndex = html.indexOf('id="learner-dashboard"');

    expect(overviewIndex).toBeGreaterThan(-1);
    expect(firstSectionIndex).toBeGreaterThan(overviewIndex);
    expect(takeawaysIndex).toBeGreaterThan(firstSectionIndex);
    expect(studyToolsIndex).toBeGreaterThan(takeawaysIndex);
    expect(dashboardIndex).toBeGreaterThan(studyToolsIndex);
  });
});
