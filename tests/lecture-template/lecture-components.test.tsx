import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AnswerKeyAppendix } from "../../src/components/lecture-kit/AnswerKeyAppendix";
import { Accordion } from "../../src/components/lecture-kit/Accordion";
import { Callout } from "../../src/components/lecture-kit/Callout";
import { Checklist } from "../../src/components/lecture-kit/Checklist";
import { CodeBlock } from "../../src/components/lecture-kit/CodeBlock";
import { CollectionLanding } from "../../src/components/lecture-kit/CollectionLanding";
import { Comparison } from "../../src/components/lecture-kit/Comparison";
import { ConceptCard } from "../../src/components/lecture-kit/ConceptCard";
import { Diagram } from "../../src/components/lecture-kit/Diagram";
import { Flashcard } from "../../src/components/lecture-kit/Flashcard";
import { FreeResponse } from "../../src/components/lecture-kit/FreeResponse";
import { GlossaryTerm } from "../../src/components/lecture-kit/GlossaryTerm";
import { InstructorNote } from "../../src/components/lecture-kit/InstructorNote";
import { LectureHeader } from "../../src/components/lecture-kit/LectureHeader";
import { LecturePage } from "../../src/components/lecture-kit/LecturePage";
import { MistakeCorrection } from "../../src/components/lecture-kit/MistakeCorrection";
import { PracticeTask } from "../../src/components/lecture-kit/PracticeTask";
import { QuestionSet } from "../../src/components/lecture-kit/QuestionSet";
import { Quiz } from "../../src/components/lecture-kit/Quiz";
import { Quote } from "../../src/components/lecture-kit/Quote";
import { ResourceLinks } from "../../src/components/lecture-kit/ResourceLinks";
import { SectionNavigation } from "../../src/components/lecture-kit/SectionNavigation";
import { SectionRenderer } from "../../src/components/lecture-kit/SectionRenderer";
import { StepList } from "../../src/components/lecture-kit/StepList";
import { Summary } from "../../src/components/lecture-kit/Summary";
import { Tabs } from "../../src/components/lecture-kit/Tabs";
import { Timeline } from "../../src/components/lecture-kit/Timeline";
import { ValidationScreen } from "../../src/components/lecture-kit/ValidationScreen";
import { WorkedExample } from "../../src/components/lecture-kit/WorkedExample";
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
    expect(html).toContain("Estimated study time");
    expect(html).not.toContain("<dt>Duration</dt>");
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

  it("renders lecture progress controls without changing authored section anchors", () => {
    const lecture = validLecture("content/lecture.template.md");
    const html = renderToStaticMarkup(<LecturePage lecture={lecture} templatePath="content/lecture.template.md" />);

    expect(html).toContain("Lecture progress");
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-label="Lecture progress"');
    expect(html).toContain('aria-valuemin="0"');
    expect(html).toContain('aria-valuemax="100"');
    expect(html).not.toContain('aria-valuenow="0"');
    expect(html).toContain("Loading progress");
    expect(html).not.toContain("Reset progress");
    expect(html).toContain(`id="${lecture.sections[0].anchor}"`);
    expect(html).toContain(`aria-labelledby="${lecture.sections[0].anchor}-heading"`);
    expect(html).toContain(`aria-label="Mark ${lecture.sections[0].title} complete"`);
    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain("section-completion-print");
    expect(html).toContain("quiet-reading-surface");
    expect(html).not.toContain("Overview complete");
    expect(html).not.toContain("Key Takeaways complete");
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
            anchor: "quiz-command",
            question: "Which command validates?",
            options: ["npm run validate", "npm run dev"],
            answer: "npm run validate",
            explanation: "Validation checks the template."
          }}
        />
        <QuestionSet
          component={{
            type: "question_set",
            anchor: "question-set",
            title: "Check",
            instructions: "Try these.",
            questions: [
              { question: "First?", options: ["Yes", "No"], answer: "Yes", feedback: "Correct." },
              { question: "Second?", options: ["One", "Two"], answer: "Two" }
            ]
          }}
        />
        <FreeResponse
          component={{
            type: "free_response",
            anchor: "free-response",
            title: "Explain",
            prompt: "Explain the tradeoff.",
            guidance: "Compare against this guidance."
          }}
        />
        <PracticeTask
          component={{
            type: "practice_task",
            anchor: "practice-task",
            title: "Apply",
            task: "Fix the issue.",
            hints: ["Read the field path."],
            solution: "Repair the YAML.",
            rubric: [{ criterion: "Valid", expected: "Validation passes." }]
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
    expect(html).toContain("Assessment: Question set");
    expect(html).toContain("Assessment: Free response");
    expect(html).toContain("Practice task");
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
            anchor: "quiz-command",
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
    expect(html).toContain('role="radiogroup"');
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("Show answer");
    const answerRegionId = html.match(/aria-controls="([^"]+)"/)?.[1];
    expect(answerRegionId).toBeTruthy();
    expect(html).toContain(`id="${answerRegionId}"`);
    const answerLabelId = html.match(new RegExp(`id="${answerRegionId}" class="quiz-answer"[^>]+aria-labelledby="([^"]+)"`))?.[1];
    expect(answerLabelId).toBeTruthy();
    expect(html).toContain(`id="${answerLabelId}"`);
    expect(html).toContain(`id="${answerRegionId}" class="quiz-answer" aria-labelledby="${answerLabelId}"`);
    expect(html).toContain(`<p id="${answerLabelId}" class="quiz-answer-label">Answer</p>`);
    expect(html).toContain('<noscript class="assessment-noscript">');
    expect(html).toContain("Answer: npm run validate");
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
            anchor: "quiz-unsafe",
            question: "Run <script>alert(4)</script>?",
            options: ["<script>alert(5)</script>", "No"],
            answer: "<script>alert(5)</script>"
          }}
        />
        <QuestionSet
          component={{
            type: "question_set",
            anchor: "question-set-unsafe",
            title: "Set <script>alert(7)</script>",
            questions: [
              {
                question: "Question <script>alert(8)</script>",
                options: ["<script>alert(9)</script>", "No"],
                answer: "<script>alert(9)</script>",
                feedback: "<img src=x onerror=alert(10)>"
              },
              { question: "Second?", options: ["Yes", "No"], answer: "Yes" }
            ]
          }}
        />
        <FreeResponse
          component={{
            type: "free_response",
            anchor: "free-response-unsafe",
            title: "Free <script>alert(11)</script>",
            prompt: "<img src=x onerror=alert(12)>",
            placeholder: "<script>alert(13)</script>",
            guidance: "<script>alert(14)</script>"
          }}
        />
        <PracticeTask
          component={{
            type: "practice_task",
            anchor: "practice-task-unsafe",
            title: "Practice <script>alert(15)</script>",
            task: "<img src=x onerror=alert(16)>",
            starter_code: { language: "html", code: "<script>alert(17)</script>" },
            rubric: [{ criterion: "<script>alert(18)</script>", expected: "<img src=x onerror=alert(19)>" }]
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
        <GlossaryTerm component={{ type: "glossary_term", term: "Term <script>alert(20)</script>", definition: "<img src=x onerror=alert(21)>" }} />
        <Tabs
          component={{
            type: "tabs",
            title: "Tabs <script>alert(22)</script>",
            tabs: [
              { label: "A", content: "<img src=x onerror=alert(23)>" },
              { label: "B", content: "Safe" }
            ]
          }}
        />
        <Flashcard component={{ type: "flashcard", prompt: "Prompt <script>alert(24)</script>", answer: "<img src=x onerror=alert(25)>" }} />
        <WorkedExample
          component={{
            type: "worked_example",
            title: "Example <script>alert(26)</script>",
            problem: "<img src=x onerror=alert(27)>",
            walkthrough: ["<script>alert(28)</script>"],
            solution: "<script>alert(29)</script>"
          }}
        />
        <MistakeCorrection
          component={{
            type: "mistake_correction",
            title: "Mistake <script>alert(30)</script>",
            mistake: "<script>alert(31)</script>",
            why_it_fails: "<script>alert(32)</script>",
            correction: "<script>alert(33)</script>"
          }}
        />
        <ResourceLinks component={{ type: "resource_links", title: "Links", links: [{ label: "<script>alert(34)</script>", url: "https://example.com" }] }} />
        <InstructorNote component={{ type: "instructor_note", title: "Note", body: "<script>alert(35)</script>", audience: "instructor" }} />
      </>
    );

    expect(html).toContain("&lt;script&gt;alert(0)&lt;/script&gt;");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(html).toContain("&lt;script&gt;alert(5)&lt;/script&gt;");
    expect(html).toContain("&lt;script&gt;alert(6)&lt;/script&gt;");
    expect(html).toContain("&lt;script&gt;alert(9)&lt;/script&gt;");
    expect(html).toContain("&lt;script&gt;alert(14)&lt;/script&gt;");
    expect(html).toContain("&lt;script&gt;alert(17)&lt;/script&gt;");
    expect(html).toContain("&lt;script&gt;alert(20)&lt;/script&gt;");
    expect(html).toContain("&lt;img src=x onerror=alert(23)&gt;");
    expect(html).toContain("&lt;script&gt;alert(35)&lt;/script&gt;");
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
              component: { type: "quiz", anchor: "learning-components-quiz-question", question: "Question?", options: ["Yes", "No"], answer: "Yes" }
            },
            {
              kind: "component",
              locator: { line: 10 },
              component: {
                type: "question_set",
                anchor: "learning-components-question-set",
                title: "Set",
                questions: [
                  { question: "First?", options: ["Yes", "No"], answer: "Yes" },
                  { question: "Second?", options: ["One", "Two"], answer: "Two" }
                ]
              }
            },
            {
              kind: "component",
              locator: { line: 11 },
              component: {
                type: "free_response",
                anchor: "learning-components-free-response",
                title: "Write",
                prompt: "Explain."
              }
            },
            {
              kind: "component",
              locator: { line: 12 },
              component: {
                type: "practice_task",
                anchor: "learning-components-practice-task",
                title: "Practice",
                task: "Apply it."
              }
            },
            {
              kind: "component",
              locator: { line: 13 },
              component: { type: "diagram", diagram_type: "flowchart", title: "Diagram", code: "graph LR\n  A --> B" }
            },
            { kind: "component", locator: { line: 14 }, component: { type: "glossary_term", term: "Schema", definition: "A contract." } },
            {
              kind: "component",
              locator: { line: 15 },
              component: {
                type: "tabs",
                title: "Modes",
                tabs: [
                  { label: "CLI", content: "Validate." },
                  { label: "Browser", content: "Preview." }
                ]
              }
            },
            {
              kind: "component",
              locator: { line: 16 },
              component: { type: "accordion", title: "Details", items: [{ title: "More", body: "Extra detail." }] }
            },
            {
              kind: "component",
              locator: { line: 17 },
              component: {
                type: "timeline",
                title: "Steps",
                orientation: "vertical",
                items: [
                  { label: "Draft", detail: "Write." },
                  { label: "Review", detail: "Check." }
                ]
              }
            },
            { kind: "component", locator: { line: 18 }, component: { type: "checklist", title: "Ready", items: ["Validate"], storage: "session" } },
            { kind: "component", locator: { line: 19 }, component: { type: "flashcard", prompt: "Prompt?", answer: "Answer." } },
            {
              kind: "component",
              locator: { line: 20 },
              component: { type: "worked_example", title: "Example", problem: "Problem.", walkthrough: ["Step"], solution: "Solution." }
            },
            {
              kind: "component",
              locator: { line: 21 },
              component: { type: "mistake_correction", title: "Fix", mistake: "Wrong.", why_it_fails: "Breaks.", correction: "Right." }
            },
            {
              kind: "component",
              locator: { line: 22 },
              component: { type: "resource_links", title: "Links", links: [{ label: "Docs", url: "https://example.com/docs" }] }
            },
            {
              kind: "component",
              locator: { line: 23 },
              component: { type: "instructor_note", title: "Teach", body: "Mention review.", audience: "both" }
            },
            { kind: "paragraph", text: "After components.", locator: { line: 14 } }
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
    expect(html).toContain("Assessment: Question set");
    expect(html).toContain("Assessment: Free response");
    expect(html).toContain("Practice task");
    expect(html).toContain("Show answer");
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("Diagram");
    expect(html).toContain("diagram-card");
    expect(html).toContain("diagram-svg-container");
    expect(html).toContain("Diagram source code");
    expect(html).toContain("Glossary");
    expect(html).toContain("Tabs");
    expect(html).toContain("More detail");
    expect(html).toContain("Timeline");
    expect(html).toContain("Checklist");
    expect(html).toContain("Flashcard");
    expect(html).toContain("Worked example");
    expect(html).toContain("Common mistake");
    expect(html).toContain("Resources");
    expect(html).toContain("Instructor note");
    expect(html).toContain("After components.");
  });

  it("renders advanced component labels, core content, and print hooks", () => {
    const html = renderToStaticMarkup(
      <>
        <GlossaryTerm component={{ type: "glossary_term", term: "Schema", definition: "A contract.", aliases: ["Template contract"] }} />
        <Tabs component={{ type: "tabs", title: "Modes", tabs: [{ label: "CLI", content: "Validate." }, { label: "Browser", content: "Preview." }] }} />
        <Accordion component={{ type: "accordion", title: "Details", default_open: "Open", items: [{ title: "Open", body: "Visible detail." }] }} />
        <Timeline component={{ type: "timeline", title: "Sequence", orientation: "vertical", items: [{ label: "One", detail: "Start." }, { label: "Two", detail: "Finish." }] }} />
        <Checklist component={{ type: "checklist", title: "Ready", items: ["Validate"], storage: "session", reset_label: "Reset" }} instanceId="test" />
        <Flashcard component={{ type: "flashcard", prompt: "Prompt?", answer: "Answer.", hint: "Think." }} />
        <WorkedExample component={{ type: "worked_example", title: "Example", problem: "Problem.", walkthrough: ["Step"], solution: "Solution.", takeaway: "Remember." }} />
        <MistakeCorrection component={{ type: "mistake_correction", title: "Fix", mistake: "Wrong.", why_it_fails: "Breaks.", correction: "Right." }} />
        <ResourceLinks component={{ type: "resource_links", title: "Links", links: [{ label: "Docs", url: "https://example.com/docs", description: "Read more." }] }} />
        <InstructorNote component={{ type: "instructor_note", title: "Teach", body: "Mention review.", audience: "both", timing: "Before class" }} />
      </>
    );

    for (const text of ["Glossary", "Tabs", "More detail", "Timeline", "Checklist", "Flashcard", "Worked example", "Common mistake", "Resources", "Instructor note"]) {
      expect(html).toContain(text);
    }
    expect(html).toContain("accordion-print-body");
    expect(html).toContain("flashcard-answer");
    expect(html).toContain('<div id="_');
    expect(html).not.toContain('class="flashcard-answer" hidden=""');
    expect(html).toContain("resource-link-url");
    expect(html).toContain("resource-link-full-url");
    expect(html).toContain("https://example.com/docs");
    expect(html).toContain("example.com");
    expect(html).not.toContain("<script>");
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

  it("renders answer-key appendix with assessment anchors and guidance", () => {
    const lecture = validLecture("examples/component-demo.template.md");
    const html = renderToStaticMarkup(<AnswerKeyAppendix lecture={lecture} />);

    expect(html).toContain("answer-key-appendix");
    expect(html).toContain('class="lecture-panel answer-key-appendix" open=""');
    expect(html).toContain("Answer key appendix");
    expect(html).toContain('href="#check-understanding-components-quiz-quiz-which-command-validates-the-active-lecture-or-collection-before-previewing-the-component-gallery-at-narrow-tablet-and-desktop-viewport-widths"');
    expect(html).toContain("Component Review Questions");
    expect(html).toContain("Explain Reveal Pacing");
    expect(html).toContain("Repair An Invalid Assessment");
    expect(html).toContain("Validation checks the active template or collection");
    expect(html).toContain("A drafted answer makes the learner commit");
    expect(html).toContain("Schema correctness");
  });

  it("renders collection assessment index links for valid lectures only", () => {
    const lecture = validLecture("examples/component-demo.template.md");
    const html = renderToStaticMarkup(
      <CollectionLanding
        validation={{
          lectureCount: 2,
          allPassed: false,
          courseMetadata: { status: "absent", path: "lectures/course.yaml", errors: [] },
          results: [
            { slug: "01-demo", templatePath: "lectures/01-demo/lecture.template.md", valid: true, errors: [], template: lecture },
            { slug: "02-invalid", templatePath: "lectures/02-invalid/lecture.template.md", valid: false, errors: [] }
          ]
        }}
      />
    );

    expect(html).toContain("Show 5 assessments");
    expect(html).toContain("Course progress");
    expect(html).toContain("Loading progress");
    expect(html).toContain("Author/reviewer note");
    expect(html).toContain("Review validation details");
    expect(html).toContain("collection-review-status");
    expect(html).toContain('/lectures/01-demo#check-understanding-components-question-set-component-review-questions');
    expect(html).not.toContain("/lectures/02-invalid#");
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
