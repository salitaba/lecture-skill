import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Callout } from "../../src/components/lecture-kit/Callout";
import { CodeBlock } from "../../src/components/lecture-kit/CodeBlock";
import { Comparison } from "../../src/components/lecture-kit/Comparison";
import { ConceptCard } from "../../src/components/lecture-kit/ConceptCard";
import { Diagram } from "../../src/components/lecture-kit/Diagram";
import { LectureHeader } from "../../src/components/lecture-kit/LectureHeader";
import { Quiz } from "../../src/components/lecture-kit/Quiz";
import { Quote } from "../../src/components/lecture-kit/Quote";
import { SectionNavigation } from "../../src/components/lecture-kit/SectionNavigation";
import { SectionRenderer } from "../../src/components/lecture-kit/SectionRenderer";
import { StepList } from "../../src/components/lecture-kit/StepList";
import { Summary } from "../../src/components/lecture-kit/Summary";
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

  it("renders every supported component label and core content", () => {
    const html = renderToStaticMarkup(
      <>
        <Callout component={{ type: "callout", variant: "note", title: "Note", body: "Useful context" }} />
        <Callout component={{ type: "callout", variant: "warning", title: "Careful", body: "Avoid a mistake" }} />
        <Callout component={{ type: "callout", variant: "insight", title: "Insight", body: "Connect ideas" }} />
        <ConceptCard component={{ type: "concept_card", title: "Concept", body: "One idea" }} />
        <StepList component={{ type: "step_list", title: "Workflow", steps: ["First step", "Second step"] }} />
        <CodeBlock component={{ type: "code_block", language: "ts", code: "const value = '<unsafe>'; // should escape" }} />
        <Comparison
          component={{
            type: "comparison",
            title: "Local vs Shared",
            leftLabel: "Local",
            rightLabel: "Shared",
            items: [{ label: "Ownership", left: "One component", right: "Many components" }]
          }}
        />
        <Summary component={{ type: "summary", title: "Remember", items: ["Keep schema explicit", "Validate before preview"] }} />
        <Quote component={{ type: "quote", quote: "Short source-grounded excerpt.", attribution: "Lecture notes" }} />
        <Quiz
          component={{
            type: "quiz",
            question: "Which command validates?",
            options: ["npm run validate", "npm run dev"],
            answer: "npm run validate",
            explanation: "Validation checks the template."
          }}
        />
      </>
    );

    expect(html).toContain("Note callout");
    expect(html).toContain("Warning callout");
    expect(html).toContain("Insight callout");
    expect(html).toContain("Concept card");
    expect(html).toContain("Step-by-step");
    expect(html).toContain("Code example");
    expect(html).toContain("ts");
    expect(html).toContain("Comparison");
    expect(html).toContain("Section summary");
    expect(html).toContain("Source quote");
    expect(html).toContain("Quiz: Knowledge check");
    expect(html).toContain("&lt;unsafe&gt;");
  });

  it("renders comparison values with programmatic topic and side context", () => {
    const html = renderToStaticMarkup(
      <Comparison
        component={{
          type: "comparison",
          title: "Local vs Shared",
          leftLabel: "Local",
          rightLabel: "Shared",
          items: [{ label: "Ownership", left: "One component", right: "Many components" }]
        }}
      />
    );

    const topicLabelId = html.match(/<span id="([^"]+)">Topic<\/span>/)?.[1];
    const leftLabelId = html.match(/<span id="([^"]+)">Local<\/span>/)?.[1];
    const rightLabelId = html.match(/<span id="([^"]+)">Shared<\/span>/)?.[1];
    const topicId = html.match(/<h4 id="([^"]+)" aria-labelledby="[^"]+">Ownership<\/h4>/)?.[1];

    expect(topicLabelId).toBeTruthy();
    expect(leftLabelId).toBeTruthy();
    expect(rightLabelId).toBeTruthy();
    expect(topicId).toBeTruthy();
    expect(html).toContain(`<h4 id="${topicId}" aria-labelledby="${topicLabelId} ${topicId}">Ownership</h4>`);
    expect(html).toContain(`<p aria-labelledby="${topicId} ${leftLabelId}">One component</p>`);
    expect(html).toContain(`<p aria-labelledby="${topicId} ${rightLabelId}">Many components</p>`);
  });

  it("renders quiz as a collapsed reveal check and quote as blockquote", () => {
    const html = renderToStaticMarkup(
      <>
        <Quote
          component={{
            type: "quote",
            quote: "Short source-grounded excerpt.",
            attribution: "Lecture notes",
            context: "Use this before a tradeoff."
          }}
        />
        <Quiz
          component={{
            type: "quiz",
            question: "Which command validates?",
            options: ["npm run validate", "npm run dev"],
            answer: "npm run validate",
            explanation: "Validation checks the template."
          }}
        />
      </>
    );

    expect(html).toContain("Source quote");
    expect(html).toContain("<blockquote>");
    expect(html).toContain("<figcaption>Lecture notes</figcaption>");
    expect(html).toContain("Quiz: Knowledge check");
    expect(html).toContain('<h3 class="quiz-question">Which command validates?</h3>');
    expect(html).toContain('<ol class="quiz-options">');
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("Show answer");
    const answerRegionId = html.match(/aria-controls="([^"]+)"/)?.[1];
    const answerLabelId = html.match(/aria-labelledby="([^"]+)"/)?.[1];
    expect(answerRegionId).toBeTruthy();
    expect(answerLabelId).toBeTruthy();
    expect(html).toContain(`id="${answerRegionId}"`);
    expect(html).toContain(`id="${answerLabelId}"`);
    expect(html).toContain(`id="${answerRegionId}" class="quiz-answer" hidden="" aria-labelledby="${answerLabelId}"`);
    expect(html).toContain(`<p id="${answerLabelId}" class="quiz-answer-label">Answer</p>`);
    expect(html).toContain('<noscript class="quiz-noscript">');
    expect(html).toContain(".quiz-reveal-button { display: none !important; }");
    expect(html).toContain("Interactive answer reveal requires JavaScript.");
    expect(html).toContain('<p class="quiz-answer-value">npm run validate</p>');
    expect(html).toContain("Validation checks the template.");
  });

  it("escapes raw HTML-like text in every component type", () => {
    const html = renderToStaticMarkup(
      <>
        <Callout component={{ type: "callout", variant: "warning", title: "Careful <script>alert(0)</script>", body: "Avoid <img src=x onerror=alert(0)>" }} />
        <ConceptCard component={{ type: "concept_card", title: "Concept <script>alert(0)</script>", body: "<img src=x onerror=alert(0)>" }} />
        <StepList component={{ type: "step_list", title: "Workflow <script>alert(0)</script>", steps: ["<img src=x onerror=alert(0)>"] }} />
        <CodeBlock component={{ type: "code_block", language: "html", code: "<script>alert(0)</script><img src=x onerror=alert(0)>" }} />
        <Comparison
          component={{
            type: "comparison",
            title: "Compare <script>alert(1)</script>",
            leftLabel: "Left",
            rightLabel: "Right",
            items: [{ label: "Label", left: "<img src=x onerror=alert(1)>", right: "Safe text" }]
          }}
        />
        <Summary component={{ type: "summary", title: "Summary", items: ["<script>alert(2)</script>"] }} />
        <Quote component={{ type: "quote", quote: "<script>alert(3)</script>" }} />
        <Quiz
          component={{
            type: "quiz",
            question: "Run <script>alert(4)</script>?",
            options: ["<script>alert(5)</script>", "No"],
            answer: "<script>alert(5)</script>"
          }}
        />
        <Diagram
          component={{
            type: "diagram",
            diagram_type: "flowchart",
            title: "Diagram <script>alert(6)</script>",
            code: "graph LR\n  A --> B"
          }}
        />
      </>
    );

    expect(html).toContain("&lt;script&gt;alert(0)&lt;/script&gt;");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(html).toContain("&lt;script&gt;alert(5)&lt;/script&gt;");
    expect(html).toContain("&lt;script&gt;alert(6)&lt;/script&gt;");
    expect(html).not.toContain("<script>alert");
    expect(html).not.toContain("<img src=x");
  });

  it("dispatches every supported component through SectionRenderer with surrounding Markdown", () => {
    const html = renderToStaticMarkup(
      <SectionRenderer
        index={0}
        section={{
          title: "Learning Components",
          anchor: "learning-components",
          blocks: [
            { kind: "paragraph", text: "Before components.", locator: { line: 1 } },
            {
              kind: "component",
              locator: { line: 2 },
              component: { type: "callout", variant: "note", title: "Note", body: "Context" }
            },
            {
              kind: "component",
              locator: { line: 3 },
              component: { type: "concept_card", title: "Concept", body: "One idea" }
            },
            {
              kind: "component",
              locator: { line: 4 },
              component: { type: "step_list", title: "Workflow", steps: ["First", "Second"] }
            },
            {
              kind: "component",
              locator: { line: 5 },
              component: { type: "code_block", language: "ts", code: "const valid = true;" }
            },
            {
              kind: "component",
              locator: { line: 6 },
              component: {
                type: "comparison",
                title: "A vs B",
                leftLabel: "A",
                rightLabel: "B",
                items: [{ label: "Use", left: "One", right: "Two" }]
              }
            },
            {
              kind: "component",
              locator: { line: 7 },
              component: { type: "summary", title: "Recap", items: ["One recap"] }
            },
            {
              kind: "component",
              locator: { line: 8 },
              component: { type: "quote", quote: "Quoted text" }
            },
            {
              kind: "component",
              locator: { line: 9 },
              component: { type: "quiz", question: "Question?", options: ["Yes", "No"], answer: "Yes" }
            },
            {
              kind: "component",
              locator: { line: 10 },
              component: { type: "diagram", diagram_type: "flowchart", title: "Diagram", code: "graph LR\n  A --> B" }
            },
            { kind: "paragraph", text: "After components.", locator: { line: 11 } }
          ]
        }}
      />
    );

    expect(html).toContain("Before components.");
    expect(html).toContain("Note callout");
    expect(html).toContain("Concept card");
    expect(html).toContain("Step-by-step");
    expect(html).toContain("Code example");
    expect(html).toContain("A vs B");
    expect(html).toContain("Recap");
    expect(html).toContain("<blockquote>");
    expect(html).toContain("Quiz: Knowledge check");
    expect(html).toContain("Show answer");
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("Diagram");
    expect(html).toContain("diagram-card");
    expect(html).toContain("diagram-svg-container");
    expect(html).toContain("Diagram source code");
    expect(html).toContain("After components.");
  });

  it("renders Diagram accessible markup with role, aria-label, and figcaption", () => {
    const html = renderToStaticMarkup(
      <Diagram
        component={{
          type: "diagram",
          diagram_type: "flowchart",
          title: "Data flow",
          code: "graph LR\n  A --> B"
        }}
      />
    );

    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Data flow"');
    expect(html).toContain("<figcaption>Data flow</figcaption>");
    expect(html).toContain("Diagram");
    expect(html).toContain("diagram-card");
  });

  it("renders Diagram raw source in pre fallback", () => {
    const html = renderToStaticMarkup(
      <Diagram
        component={{
          type: "diagram",
          diagram_type: "sequence",
          title: "Sequence",
          code: "sequenceDiagram\n  A->>B: msg"
        }}
      />
    );

    expect(html).toContain("sequenceDiagram");
    expect(html).toContain("A-&gt;&gt;B: msg");
    expect(html).toContain("diagram-svg-container");
  });

  it("renders Diagram details with source code", () => {
    const html = renderToStaticMarkup(
      <Diagram
        component={{
          type: "diagram",
          diagram_type: "flowchart",
          title: "Flow",
          code: "graph TD\n  X --> Y"
        }}
      />
    );

    expect(html).toContain("<summary>Diagram source code</summary>");
    expect(html).toContain("graph TD");
    expect(html).toContain("X --&gt; Y");
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
