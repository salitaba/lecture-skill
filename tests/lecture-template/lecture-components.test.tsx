import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Callout } from "../../src/components/lecture-kit/Callout";
import { CodeBlock } from "../../src/components/lecture-kit/CodeBlock";
import { ConceptCard } from "../../src/components/lecture-kit/ConceptCard";
import { LectureHeader } from "../../src/components/lecture-kit/LectureHeader";
import { SectionNavigation } from "../../src/components/lecture-kit/SectionNavigation";
import { SectionRenderer } from "../../src/components/lecture-kit/SectionRenderer";
import { StepList } from "../../src/components/lecture-kit/StepList";
import { ValidationScreen } from "../../src/components/lecture-kit/ValidationScreen";
import { lectureNavigationTargets } from "../../src/lib/lecture-template/navigationTargets";
import { ACTIVE_TEMPLATE_PATH } from "../../src/lib/lecture-template/readTemplate";
import type { LectureTemplate } from "../../src/lib/lecture-template/types";
import { validateTemplateSource } from "../../src/lib/lecture-template/validateTemplate";
import { fixture } from "./testUtils";

describe("lecture component UX contracts", () => {
  it("renders header metadata with a visible authored-section count", () => {
    const lecture = validLecture("content/lecture.template.md");
    const html = renderToStaticMarkup(<LectureHeader metadata={lecture.metadata} sectionCount={lecture.sections.length} />);

    expect(html).toContain("Evidence-Driven Debugging for Production Incidents");
    expect(html).toContain("Early-career backend engineers");
    expect(html).toContain("45 minutes");
    expect(html).toContain("beginner");
    expect(html).toContain("4 sections");
  });

  it("renders complete real-anchor navigation without active-section state", () => {
    const lecture = validLecture("examples/ux-stress.template.md");
    const html = renderToStaticMarkup(<SectionNavigation sections={lecture.sections} />);

    expect(html).toContain('aria-label="Learning path"');
    expect(html).toContain(`href="${lectureNavigationTargets.overview.href}"`);
    expect(html).toContain(`href="${lectureNavigationTargets.objectives.href}"`);
    expect(html).toContain(`href="#duplicate-topic"`);
    expect(html).toContain(`href="#duplicate-topic-2"`);
    expect(html).toContain(`href="${lectureNavigationTargets.takeaways.href}"`);
    expect(html).toContain("Section 10");
    expect(html).toContain("<summary>");
    expect(html).not.toContain("aria-current");
  });

  it("keeps navigation hrefs aligned with rendered heading targets", () => {
    const lecture = validLecture("examples/ux-stress.template.md");
    const navHtml = renderToStaticMarkup(<SectionNavigation sections={lecture.sections} />);
    const contentHtml = renderToStaticMarkup(<RouteHeadingHarness lecture={lecture} />);
    const hrefs = Array.from(new Set([...navHtml.matchAll(/href="([^"]+)"/g)].map((match) => match[1])));

    for (const href of hrefs) {
      expect(href.startsWith("#")).toBe(true);
      expect(contentHtml).toContain(`id="${href.slice(1)}"`);
    }
  });

  it("renders validation summary and self-contained error details", () => {
    const result = validateTemplateSource(fixture("examples/invalid/ux-validation-mixed.template.md"));

    expect(result.valid).toBe(false);
    if (!result.valid) {
      const html = renderToStaticMarkup(<ValidationScreen errors={result.errors} templatePath={ACTIVE_TEMPLATE_PATH} />);

      expect(html).toContain(`The active template has ${result.errors.length} blocking errors.`);
      expect(html).toContain(`Active template: ${ACTIVE_TEMPLATE_PATH}`);
      for (const error of result.errors) {
        expect(html).toContain(`Template</dt><dd>${ACTIVE_TEMPLATE_PATH}</dd>`);
        expect(html).toContain(escapeHtml(error.message));
        expect(html).toContain(error.code);
        if (error.hint) expect(html).toContain(escapeHtml(error.hint));
      }
      expect(html).toContain("Frontmatter");
      expect(html).toContain("Heading structure");
      expect(html).toContain("Component");
      expect(html).toContain("line ");
      expect(html).toContain("Field</dt><dd>level</dd>");
      expect(html).toContain("Section</dt><dd>Component Problems</dd>");
      expect(html).toContain("Component</dt><dd>callout</dd>");
      expect(html).toContain("Hint");
    }
  });

  it("renders supported component labels and content without raw HTML injection", () => {
    const html = renderToStaticMarkup(
      <>
        <Callout component={{ type: "callout", variant: "warning", title: "Careful", body: "Avoid <script>alert(1)</script>" }} />
        <ConceptCard component={{ type: "concept_card", title: "Concept", body: "One idea" }} />
        <StepList component={{ type: "step_list", title: "Workflow", steps: ["First step", "Second step"] }} />
        <CodeBlock component={{ type: "code_block", language: "ts", code: "const value = '<unsafe>'; // should escape" }} />
      </>
    );

    expect(html).toContain("Warning callout");
    expect(html).toContain("Concept card");
    expect(html).toContain("Step list");
    expect(html).toContain("Code example");
    expect(html).toContain("ts");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).toContain("&lt;unsafe&gt;");
    expect(html).not.toContain("<script>alert(1)</script>");
  });
});

function validLecture(relativePath: string): LectureTemplate {
  const result = validateTemplateSource(fixture(relativePath));
  if (!result.valid) {
    throw new Error(`${relativePath} should be a valid fixture`);
  }
  return result.template;
}

function RouteHeadingHarness({ lecture }: { lecture: LectureTemplate }) {
  return (
    <article>
      <section aria-labelledby={lectureNavigationTargets.overview.id}>
        <h2 id={lectureNavigationTargets.overview.id}>{lectureNavigationTargets.overview.label}</h2>
      </section>
      <section aria-labelledby={lectureNavigationTargets.objectives.id}>
        <h2 id={lectureNavigationTargets.objectives.id}>{lectureNavigationTargets.objectives.label}</h2>
      </section>
      {lecture.sections.map((section, index) => (
        <SectionRenderer key={section.anchor} section={section} index={index} />
      ))}
      <section aria-labelledby={lectureNavigationTargets.takeaways.id}>
        <h2 id={lectureNavigationTargets.takeaways.id}>{lectureNavigationTargets.takeaways.label}</h2>
      </section>
    </article>
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
