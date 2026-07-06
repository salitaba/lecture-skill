import { describe, expect, it } from "vitest";
import {
  collectCollectionGlossary,
  collectLectureGlossary,
  dedupeAndSort,
  glossaryAnchorsForSection
} from "../../src/lib/lecture-template/glossaryIndex";
import type { CollectionValidationResult, LectureSection, LectureTemplate, RenderBlock } from "../../src/lib/lecture-template/types";

function glossaryBlock(term: string, definition: string, aliases?: string[]): RenderBlock {
  return {
    kind: "component",
    locator: { line: 1 },
    component: { type: "glossary_term", term, definition, aliases }
  };
}

function section(title: string, blocks: RenderBlock[]): LectureSection {
  return { title, anchor: title.toLowerCase().replace(/\s+/g, "-"), blocks };
}

function lecture(title: string, sections: LectureSection[]): LectureTemplate {
  return {
    metadata: { title, description: "", audience: "", duration: "10 minutes", level: "beginner" },
    overview: [],
    objectives: [],
    sections,
    takeaways: []
  };
}

describe("glossaryAnchorsForSection", () => {
  it("returns one anchor per glossary term in a section, in order", () => {
    const s = section("Basics", [glossaryBlock("API", "Application programming interface."), glossaryBlock("Schema", "A contract.")]);
    expect(glossaryAnchorsForSection(s)).toEqual(["glossary-api", "glossary-schema"]);
  });

  it("disambiguates repeated terms within the same section", () => {
    const s = section("Basics", [glossaryBlock("API", "First."), glossaryBlock("API", "Second.")]);
    expect(glossaryAnchorsForSection(s)).toEqual(["glossary-api", "glossary-api-2"]);
  });
});

describe("collectLectureGlossary", () => {
  it("returns an empty list for a lecture with no glossary terms", () => {
    const lec = lecture("Intro", [section("Basics", [{ kind: "paragraph", text: "No terms here.", locator: { line: 1 } }])]);
    expect(collectLectureGlossary(lec)).toEqual([]);
  });

  it("finds every glossary_term component and sorts alphabetically", () => {
    const lec = lecture("Intro", [
      section("Basics", [glossaryBlock("Schema", "A contract."), glossaryBlock("API", "Application programming interface.")])
    ]);
    const entries = collectLectureGlossary(lec);
    expect(entries.map((entry) => entry.term)).toEqual(["API", "Schema"]);
  });

  it("links each entry to the correct section anchor", () => {
    const lec = lecture("Intro", [section("Basics", [glossaryBlock("API", "Application programming interface.")])]);
    const entries = collectLectureGlossary(lec);
    expect(entries[0].occurrences).toEqual([{ anchor: "glossary-api", lectureSlug: undefined, lectureTitle: "Intro" }]);
  });

  it("folds aliases and repeated occurrences of the same term into one entry", () => {
    const lec = lecture("Intro", [
      section("Basics", [glossaryBlock("API", "Application programming interface.", ["Interface"])]),
      section("Advanced", [glossaryBlock("api", "", ["Contract"])])
    ]);
    const entries = collectLectureGlossary(lec);
    expect(entries).toHaveLength(1);
    expect(entries[0].aliases.sort()).toEqual(["Contract", "Interface"]);
    expect(entries[0].occurrences).toHaveLength(2);
    expect(entries[0].definition).toBe("Application programming interface.");
  });
});

describe("collectCollectionGlossary", () => {
  function makeValidation(): CollectionValidationResult {
    return {
      lectureCount: 3,
      allPassed: false,
      courseMetadata: { status: "absent", path: "lectures/course.yaml", errors: [] },
      results: [
        {
          slug: "01-intro",
          templatePath: "lectures/01-intro/lecture.template.md",
          valid: true,
          errors: [],
          template: lecture("Intro", [section("Basics", [glossaryBlock("API", "Application programming interface.")])])
        },
        {
          slug: "02-core",
          templatePath: "lectures/02-core/lecture.template.md",
          valid: true,
          errors: [],
          template: lecture("Core", [section("Depth", [glossaryBlock("API", "Duplicate definition."), glossaryBlock("Schema", "A contract.")])])
        },
        {
          slug: "03-broken",
          templatePath: "lectures/03-broken/lecture.template.md",
          valid: false,
          errors: [{ code: "PARSE_ERROR", message: "broken" }]
        }
      ]
    };
  }

  it("aggregates terms across valid lectures and skips invalid ones", () => {
    const entries = collectCollectionGlossary(makeValidation());
    expect(entries.map((entry) => entry.term)).toEqual(["API", "Schema"]);
  });

  it("keeps one anchor per lecture occurrence for a term shared across lectures", () => {
    const entries = collectCollectionGlossary(makeValidation());
    const api = entries.find((entry) => entry.term === "API")!;
    expect(api.occurrences).toEqual([
      { anchor: "glossary-api", lectureSlug: "01-intro", lectureTitle: "Intro" },
      { anchor: "glossary-api", lectureSlug: "02-core", lectureTitle: "Core" }
    ]);
  });
});

describe("dedupeAndSort", () => {
  it("is stable for already-sorted, already-deduped input", () => {
    const entries = [
      { term: "API", definition: "d1", aliases: [], occurrences: [{ anchor: "a", lectureSlug: undefined, lectureTitle: undefined }] },
      { term: "Schema", definition: "d2", aliases: [], occurrences: [{ anchor: "b", lectureSlug: undefined, lectureTitle: undefined }] }
    ];
    expect(dedupeAndSort(entries)).toEqual(entries);
  });
});
