/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { AnswerReviewDisclosure } from "../../src/components/lecture-kit/AnswerReviewDisclosure";
import { ProgressProvider, useProgress } from "../../src/components/lecture-kit/progress/ProgressProvider";
import type { LectureTemplate } from "../../src/lib/lecture-template/types";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

function lecture(): LectureTemplate {
  return {
    metadata: { title: "Review", description: "", audience: "", duration: "10 minutes", level: "beginner" },
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
            component: { type: "quiz", anchor: "quiz-a", question: "Quiz A?", options: ["A", "B"], answer: "A" }
          },
          {
            kind: "component",
            locator: { line: 2 },
            component: { type: "quiz", anchor: "quiz-b", question: "Quiz B?", options: ["A", "B"], answer: "B" }
          },
          {
            kind: "component",
            locator: { line: 3 },
            component: {
              type: "question_set",
              anchor: "set-c",
              title: "Set C",
              questions: [{ question: "Question C1?", options: ["X", "Y"], answer: "X" }]
            }
          }
        ]
      }
    ],
    takeaways: []
  };
}

function Seed({ answers, children }: { answers: Record<string, { selected: string; correct: boolean }>; children: React.ReactNode }) {
  const { recordAnswer } = useProgress();

  useEffect(() => {
    for (const [key, attempt] of Object.entries(answers)) {
      recordAnswer(key, attempt.selected, attempt.correct);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}

describe("AnswerReviewDisclosure", () => {
  it("renders nothing outside a ProgressProvider", () => {
    render(<AnswerReviewDisclosure lecture={lecture()} />);
    expect(screen.queryByText("Review your answers")).not.toBeInTheDocument();
  });

  it("lists all objective items after answer state has loaded, even before an attempt", async () => {
    render(
      <ProgressProvider storageKey="lecture-progress:test" sections={[]}>
        <AnswerReviewDisclosure lecture={lecture()} />
      </ProgressProvider>
    );

    await waitFor(() => expect(screen.getByText("Review your answers")).toBeInTheDocument());
    expect(screen.getByRole("link", { name: "Quiz A?" })).toBeInTheDocument();
  });

  it("renders nothing once every item has been attempted correctly", () => {
    const single: LectureTemplate = {
      ...lecture(),
      sections: [
        {
          title: "Practice",
          anchor: "practice",
          blocks: [
            {
              kind: "component",
              locator: { line: 1 },
              component: { type: "quiz", anchor: "quiz-a", question: "Quiz A?", options: ["A", "B"], answer: "A" }
            }
          ]
        }
      ]
    };

    render(
      <ProgressProvider storageKey="lecture-progress:test" sections={[]}>
        <Seed answers={{ "quiz-a": { selected: "A", correct: true } }}>
          <AnswerReviewDisclosure lecture={single} />
        </Seed>
      </ProgressProvider>
    );

    expect(screen.queryByText("Review your answers")).not.toBeInTheDocument();
  });

  it("lists only missed and unattempted items, with links to the right anchors", async () => {
    render(
      <ProgressProvider storageKey="lecture-progress:test" sections={[]}>
        <Seed
          answers={{
            "quiz-a": { selected: "A", correct: true },
            "quiz-b": { selected: "A", correct: false }
          }}
        >
          <AnswerReviewDisclosure lecture={lecture()} />
        </Seed>
      </ProgressProvider>
    );

    await waitFor(() => expect(screen.getByText("Review your answers")).toBeInTheDocument());
    expect(screen.queryByText("Quiz A?")).not.toBeInTheDocument();

    const missedLink = screen.getByRole("link", { name: "Quiz B?" });
    expect(missedLink).toHaveAttribute("href", "#quiz-b");
    expect(missedLink.closest(".answer-review-item")).toHaveTextContent("Missed");

    const unattemptedLink = screen.getByRole("link", { name: "Question C1? (Set C)" });
    expect(unattemptedLink).toHaveAttribute("href", "#set-c");
    expect(unattemptedLink.closest(".answer-review-item")).toHaveTextContent("Not attempted");
  });
});
