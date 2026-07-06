/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { CollectionLanding } from "../../src/components/lecture-kit/CollectionLanding";
import { FreeResponse } from "../../src/components/lecture-kit/FreeResponse";
import { PracticeTask } from "../../src/components/lecture-kit/PracticeTask";
import { QuestionSet } from "../../src/components/lecture-kit/QuestionSet";
import { Quiz } from "../../src/components/lecture-kit/Quiz";

afterEach(() => {
  cleanup();
});

describe("assessment visual hierarchy", () => {
  it("renders collection assessment index grouped by lecture below lecture list", () => {
    const html = renderToStaticMarkup(
      <CollectionLanding
        validation={{
          lectureCount: 2,
          allPassed: true,
          courseMetadata: { status: "absent", path: "lectures/course.yaml", errors: [] },
          results: [
            {
              slug: "01-intro",
              templatePath: "lectures/01-intro/lecture.template.md",
              valid: true,
              errors: [],
              template: {
                metadata: { title: "Intro", description: "First lecture", audience: "", duration: "10 minutes", level: "beginner" },
                overview: [],
                objectives: [],
                sections: [
                  {
                    title: "Practice",
                    anchor: "practice",
                    blocks: [
                      {
                        kind: "component",
                        locator: { line: 1 },
                        component: { type: "quiz", anchor: "quiz-1", question: "What is X?", options: ["A", "B"], answer: "A" }
                      }
                    ]
                  }
                ],
                takeaways: []
              }
            },
            {
              slug: "02-advanced",
              templatePath: "lectures/02-advanced/lecture.template.md",
              valid: true,
              errors: [],
              template: {
                metadata: { title: "Advanced", description: "Second lecture", audience: "", duration: "15 minutes", level: "beginner" },
                overview: [],
                objectives: [],
                sections: [
                  {
                    title: "Review",
                    anchor: "review",
                    blocks: [
                      {
                        kind: "component",
                        locator: { line: 1 },
                        component: { type: "quiz", anchor: "quiz-2", question: "What is Y?", options: ["C", "D"], answer: "C" }
                      },
                      {
                        kind: "component",
                        locator: { line: 2 },
                        component: { type: "free_response", anchor: "free-1", title: "Explain Y", prompt: "Write about Y." }
                      }
                    ]
                  }
                ],
                takeaways: []
              }
            }
          ]
        }}
      />
    );

    const lectureListEnd = html.indexOf("</ol>");
    const assessmentStart = html.indexOf("assessment-index");
    expect(assessmentStart).toBeGreaterThan(lectureListEnd);

    expect(html).toContain("assessment-group-title");
    expect(html).toContain("Intro");
    expect(html).toContain("Advanced");
    expect(html).toContain('href="/lectures/01-intro#quiz-1"');
    expect(html).toContain('href="/lectures/02-advanced#quiz-2"');
    expect(html).toContain('href="/lectures/02-advanced#free-1"');
  });

  it("truncates long assessment titles in the index", () => {
    const html = renderToStaticMarkup(
      <CollectionLanding
        validation={{
          lectureCount: 1,
          allPassed: true,
          courseMetadata: { status: "absent", path: "lectures/course.yaml", errors: [] },
          results: [
            {
              slug: "01-lecture",
              templatePath: "lectures/01-lecture/lecture.template.md",
              valid: true,
              errors: [],
              template: {
                metadata: { title: "Lecture", description: "", audience: "", duration: "5 minutes", level: "beginner" },
                overview: [],
                objectives: [],
                sections: [
                  {
                    title: "Section",
                    anchor: "section",
                    blocks: [
                      {
                        kind: "component",
                        locator: { line: 1 },
                        component: {
                          type: "quiz",
                          anchor: "long-quiz",
                          question: "This is a very long quiz question that should be truncated when displayed in the assessment index to keep the UI scannable and readable on mobile screens",
                          options: ["A", "B"],
                          answer: "A"
                        }
                      }
                    ]
                  }
                ],
                takeaways: []
              }
            }
          ]
        }}
      />
    );

    expect(html).toContain("\u2026");
    expect(html).toContain("This is a very long quiz question that should be truncate\u2026");
    expect(html).not.toContain(">This is a very long quiz question that should be truncated when displayed in the assessment index to keep the UI scannable");
  });

  it("renders assessment index as a details disclosure element", () => {
    const html = renderToStaticMarkup(
      <CollectionLanding
        validation={{
          lectureCount: 1,
          allPassed: true,
          courseMetadata: { status: "absent", path: "lectures/course.yaml", errors: [] },
          results: [
            {
              slug: "01-lecture",
              templatePath: "lectures/01-lecture/lecture.template.md",
              valid: true,
              errors: [],
              template: {
                metadata: { title: "Lecture", description: "", audience: "", duration: "5 minutes", level: "beginner" },
                overview: [],
                objectives: [],
                sections: [],
                takeaways: []
              }
            }
          ]
        }}
      />
    );

    expect(html).toContain("assessment-index-disclosure");
    expect(html).toContain("<summary");
    expect(html).toContain("Assessment locations for reviewers");
  });

  it("quiz hierarchy places prompt first, then options, then action, then answer", async () => {
    const { container } = render(
      <Quiz
        component={{
          type: "quiz",
          anchor: "hierarchy-quiz",
          question: "What comes first?",
          options: ["Option A", "Option B"],
          answer: "Option A",
          explanation: "Because."
        }}
      />
    );

    const aside = container.querySelector("aside");
    const children = aside!.children;
    const tagOrder = Array.from(children).map((el) => el.tagName.toLowerCase());
    const questionIdx = tagOrder.findIndex((t) => t === "h3");
    const radiogroupIdx = tagOrder.findIndex((t, i) => i > questionIdx && children[i].querySelector('[role="radiogroup"]'));
    const buttonIdx = tagOrder.findIndex((t) => t === "button");
    const answerIdx = tagOrder.findIndex((t, i) => i > buttonIdx && children[i].classList.contains("quiz-answer"));

    expect(questionIdx).toBeLessThan(radiogroupIdx);
    expect(radiogroupIdx).toBeLessThan(buttonIdx);
    expect(buttonIdx).toBeLessThan(answerIdx);
  });

  it("question-set hierarchy places prompt first, then options, then action, then feedback", async () => {
    const { container } = render(
      <QuestionSet
        component={{
          type: "question_set",
          anchor: "hierarchy-set",
          title: "Check understanding",
          questions: [
            { question: "Is this first?", options: ["Yes", "No"], answer: "Yes", feedback: "Yes is right." }
          ]
        }}
      />
    );

    const aside = container.querySelector("aside");
    const questionRegion = aside!.querySelector(".assessment-region");
    const radiogroup = questionRegion!.querySelector('[role="radiogroup"]');
    const button = aside!.querySelector(".assessment-reveal-button");
    const hiddenRegion = aside!.querySelector(".assessment-hidden-region");

    const elements = [questionRegion!.querySelector("h4")!, radiogroup!, button!, hiddenRegion!];
    const positions = elements.map((el) => {
      let count = 0;
      let node: Element | null = el;
      while (node && node !== aside) {
        node = node.previousElementSibling;
        if (node) count++;
      }
      return count;
    });

    for (let i = 1; i < positions.length; i++) {
      expect(positions[i]).toBeGreaterThan(positions[i - 1]);
    }
  });

  it("free-response hierarchy places prompt first, then textarea, then action, then guidance", async () => {
    const { container } = render(
      <FreeResponse
        component={{
          type: "free_response",
          anchor: "hierarchy-free",
          title: "Explain",
          prompt: "What is the purpose?",
          guidance: "The purpose is to learn."
        }}
      />
    );

    const aside = container.querySelector("aside");
    const children = Array.from(aside!.children);
    const promptIdx = children.findIndex((el) => el.textContent?.includes("What is the purpose?"));
    const textareaIdx = children.findIndex((el) => el.tagName.toLowerCase() === "textarea" || el.getAttribute("for") !== null);
    const buttonIdx = children.findIndex((el) => el.tagName.toLowerCase() === "button");
    const hiddenIdx = children.findIndex((el) => el.classList.contains("assessment-hidden-region"));

    expect(promptIdx).toBeLessThan(textareaIdx);
    expect(textareaIdx).toBeLessThan(buttonIdx);
    expect(buttonIdx).toBeLessThan(hiddenIdx);
  });

  it("practice-task hierarchy places task first, then hints/solution actions at end", async () => {
    const { container } = render(
      <PracticeTask
        component={{
          type: "practice_task",
          anchor: "hierarchy-practice",
          title: "Apply",
          task: "Fix the issue.",
          hints: ["Check the logs."],
          solution: "The fix is simple."
        }}
      />
    );

    const aside = container.querySelector("aside");
    const children = Array.from(aside!.children);
    const taskIdx = children.findIndex((el) => el.textContent?.includes("Fix the issue."));
    const hintIdx = children.findIndex((el) => el.textContent?.includes("Show hints") || el.textContent?.includes("Hide hints"));
    const solutionIdx = children.findIndex((el) => el.textContent?.includes("Show solution") || el.textContent?.includes("Hide solution"));

    expect(taskIdx).toBeLessThan(hintIdx);
    expect(hintIdx).toBeLessThan(solutionIdx);
  });

  it("does not use formal grading language in assessment components", () => {
    const html = renderToStaticMarkup(
      <>
        <Quiz
          component={{ type: "quiz", anchor: "q1", question: "Test?", options: ["A"], answer: "A" }}
        />
        <QuestionSet
          component={{
            type: "question_set",
            anchor: "qs1",
            title: "Check",
            questions: [{ question: "Q1?", options: ["A"], answer: "A" }]
          }}
        />
        <FreeResponse
          component={{ type: "free_response", anchor: "fr1", title: "Write", prompt: "Explain." }}
        />
        <PracticeTask
          component={{ type: "practice_task", anchor: "pt1", title: "Do", task: "Apply." }}
        />
      </>
    );

    const lower = html.toLowerCase();
    expect(lower).not.toContain("grade");
    expect(lower).not.toContain("grading");
    expect(lower).not.toContain("scored");
    expect(lower).not.toContain("scoring");
    expect(lower).not.toContain("passing score");
  });
});
