/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GlossaryIndex } from "../../src/components/lecture-kit/GlossaryIndex";
import { CollectionGlossaryIndex } from "../../src/components/lecture-kit/CollectionGlossaryIndex";
import type { GlossaryEntry } from "../../src/lib/lecture-template/glossaryIndex";

afterEach(() => {
  cleanup();
});

function entry(term: string, anchor: string, overrides: Partial<GlossaryEntry> = {}): GlossaryEntry {
  return {
    term,
    definition: `${term} definition.`,
    aliases: [],
    occurrences: [{ anchor, lectureSlug: undefined, lectureTitle: undefined }],
    ...overrides
  };
}

describe("GlossaryIndex", () => {
  it("renders nothing for an empty entry list", () => {
    const { container } = render(<GlossaryIndex entries={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders one row per term with a count summary and anchor links", () => {
    render(<GlossaryIndex entries={[entry("API", "glossary-api"), entry("Schema", "glossary-schema")]} />);

    expect(screen.getAllByText("2 terms")).not.toHaveLength(0);
    const links = screen.getAllByRole("link", { name: /API|Schema/ });
    expect(links.some((link) => link.getAttribute("href") === "#glossary-api")).toBe(true);
    expect(links.some((link) => link.getAttribute("href") === "#glossary-schema")).toBe(true);
  });

  it("uses singular term count for a single entry", () => {
    render(<GlossaryIndex entries={[entry("API", "glossary-api")]} />);
    expect(screen.getAllByText("1 term").length).toBeGreaterThan(0);
  });
});

describe("CollectionGlossaryIndex", () => {
  it("aggregates across multiple lectures and includes lecture titles for cross-lecture terms", () => {
    const entries: GlossaryEntry[] = [
      {
        term: "API",
        definition: "Application programming interface.",
        aliases: [],
        occurrences: [
          { anchor: "glossary-api", lectureSlug: "01-intro", lectureTitle: "Intro" },
          { anchor: "glossary-api", lectureSlug: "02-core", lectureTitle: "Core" }
        ]
      }
    ];

    const { container } = render(<CollectionGlossaryIndex entries={entries} />);

    expect(screen.getAllByText("Course glossary").length).toBeGreaterThan(0);
    const desktopLinks = Array.from(container.querySelectorAll(".glossary-index-desktop a"));
    expect(desktopLinks).toHaveLength(2);
    const hrefs = desktopLinks.map((link) => link.getAttribute("href"));
    expect(hrefs).toContain("/lectures/01-intro#glossary-api");
    expect(hrefs).toContain("/lectures/02-core#glossary-api");
    expect(container.querySelector(".glossary-index-desktop")?.textContent).toContain("Intro");
    expect(container.querySelector(".glossary-index-desktop")?.textContent).toContain("Core");
  });
});
