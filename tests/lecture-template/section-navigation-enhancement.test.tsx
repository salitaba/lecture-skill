/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { SectionNavigation } from "../../src/components/lecture-kit/SectionNavigation";
import { ProgressProvider } from "../../src/components/lecture-kit/progress/ProgressProvider";
import { SectionCompletionToggle } from "../../src/components/lecture-kit/progress/SectionCompletionToggle";

const sections = [
  { anchor: "intro", title: "Introduction", blocks: [] },
  { anchor: "deep-dive", title: "Deep Dive", blocks: [] },
  { anchor: "conclusion", title: "Conclusion", blocks: [] }
];

afterEach(() => {
  cleanup();
});

describe("section navigation enhancement", () => {
  it("renders learning path with section count and navigation items", () => {
    renderNav();

    expect(screen.getByLabelText("Learning path")).toBeInTheDocument();
    const counts = screen.getAllByText("3 sections");
    expect(counts.length).toBeGreaterThanOrEqual(2);

    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("#overview-heading");
    expect(hrefs).toContain("#objectives-heading");
    expect(hrefs).toContain("#intro");
    expect(hrefs).toContain("#deep-dive");
    expect(hrefs).toContain("#conclusion");
    expect(hrefs).toContain("#takeaways-heading");
  });

  it("renders mobile summary with chevron", () => {
    renderNav();

    const summaryTexts = screen.getAllByText("Learning path");
    expect(summaryTexts.length).toBeGreaterThanOrEqual(2);

    const summary = summaryTexts.find((el) => el.classList.contains("learning-path-summary-text"));
    expect(summary).toBeDefined();
    expect(summary?.closest("summary")).toBeTruthy();
  });

  it("does not set aria-current in static server-rendered HTML", () => {
    const html = renderToStaticMarkup(<SectionNavigation sections={sections} />);
    expect(html).not.toContain("aria-current");
  });

  it("sets aria-current on active section in hydrated client output", () => {
    renderNav();
    const links = screen.getAllByRole("link");
    const currentLinks = links.filter((l) => l.hasAttribute("aria-current"));
    expect(currentLinks.length).toBeGreaterThanOrEqual(1);
    expect(currentLinks[0]).toHaveAttribute("aria-current", "location");
    expect(currentLinks[0]).toHaveClass("nav-item-active");
  });

  it("renders section labels with proper wrapping", () => {
    const longSections = [
      { anchor: "very-long-section-name", title: "A Very Long Section Title That Should Wrap Properly Without Breaking", blocks: [] }
    ];
    renderNav(longSections);

    const labels = screen.getAllByText("A Very Long Section Title That Should Wrap Properly Without Breaking");
    expect(labels.length).toBeGreaterThanOrEqual(2);
  });

  it("maintains accessible summary with section count", () => {
    renderNav([{ anchor: "single", title: "Single Section", blocks: [] }]);

    const counts = screen.getAllByText("1 section");
    expect(counts.length).toBeGreaterThanOrEqual(2);
  });

  it("marks a nav item complete when its section is toggled, independent of active state", () => {
    render(
      <ProgressProvider storageKey="test-nav-complete" sections={sections}>
        <SectionCompletionToggle anchor="deep-dive" title="Deep Dive" />
        <SectionNavigation sections={sections} />
      </ProgressProvider>
    );

    const introLink = screen.getAllByRole("link", { name: /Introduction/ })[0];
    const deepDiveLinkBefore = screen.getAllByRole("link", { name: /Deep Dive/ })[0];
    expect(introLink.closest("li")).not.toHaveClass("nav-item-complete");
    expect(deepDiveLinkBefore.closest("li")).not.toHaveClass("nav-item-complete");

    fireEvent.click(screen.getByRole("button", { name: "Mark Deep Dive complete" }));

    const deepDiveLinkAfter = screen.getAllByRole("link", { name: /Deep Dive/ })[0];
    expect(deepDiveLinkAfter.closest("li")).toHaveClass("nav-item-complete");
    expect(deepDiveLinkAfter).toHaveTextContent("(completed)");
    expect(screen.getAllByRole("link", { name: /Introduction/ })[0].closest("li")).not.toHaveClass(
      "nav-item-complete"
    );
  });
});

function renderNav(overrideSections = sections) {
  return render(
    <ProgressProvider storageKey="test-nav" sections={overrideSections}>
      <SectionNavigation sections={overrideSections} />
    </ProgressProvider>
  );
}

