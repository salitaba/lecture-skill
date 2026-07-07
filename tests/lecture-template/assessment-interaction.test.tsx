/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FreeResponse } from "../../src/components/lecture-kit/FreeResponse";
import { PracticeTask } from "../../src/components/lecture-kit/PracticeTask";
import { QuestionSet } from "../../src/components/lecture-kit/QuestionSet";
import { ProgressProvider } from "../../src/components/lecture-kit/progress/ProgressProvider";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
  window.localStorage.clear();
});

describe("assessment interactions", () => {
  it("keeps question-set selection and per-question reveal state local", async () => {
    const user = userEvent.setup();
    render(
      <QuestionSet
        component={{
          type: "question_set",
          anchor: "set",
          title: "Check",
          questions: [
            { question: "First?", options: ["Yes", "No"], answer: "Yes", feedback: "Yes is correct." },
            { question: "Second?", options: ["One", "Two"], answer: "Two", feedback: "Two is correct." }
          ]
        }}
      />
    );

    await user.click(screen.getByLabelText("No"));
    expect(screen.getByText("Selected: No")).toBeVisible();

    const buttons = screen.getAllByRole("button", { name: "Reveal answer" });
    await user.click(buttons[0]);

    expect(buttons[0]).toHaveTextContent("Hide feedback");
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    expect(buttons[1]).toHaveTextContent("Reveal answer");
    expect(buttons[1]).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Yes is correct.")).toBeVisible();
    expect(screen.getByText("Two is correct.")).not.toBeVisible();
  });

  it("keeps multiple question sets independent", async () => {
    const user = userEvent.setup();
    render(
      <>
        <QuestionSet
          component={{
            type: "question_set",
            anchor: "set-one",
            title: "First set",
            questions: [
              { question: "A?", options: ["A1", "A2"], answer: "A1" },
              { question: "B?", options: ["B1", "B2"], answer: "B2" }
            ]
          }}
        />
        <QuestionSet
          component={{
            type: "question_set",
            anchor: "set-two",
            title: "Second set",
            questions: [
              { question: "C?", options: ["C1", "C2"], answer: "C1" },
              { question: "D?", options: ["D1", "D2"], answer: "D2" }
            ]
          }}
        />
      </>
    );

    const firstSet = screen.getByRole("heading", { name: "First set" }).closest("aside");
    const secondSet = screen.getByRole("heading", { name: "Second set" }).closest("aside");
    expect(firstSet).toBeTruthy();
    expect(secondSet).toBeTruthy();

    await user.click(within(firstSet as HTMLElement).getAllByRole("button", { name: "Reveal answer" })[0]);

    expect(within(firstSet as HTMLElement).getByRole("button", { name: "Hide feedback" })).toHaveAttribute("aria-expanded", "true");
    expect(within(secondSet as HTMLElement).getAllByRole("button", { name: "Reveal answer" })[0]).toHaveAttribute("aria-expanded", "false");
  });

  it("tracks selected authored option text after preview-only shuffle", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const user = userEvent.setup();
    render(
      <QuestionSet
        component={{
          type: "question_set",
          anchor: "shuffle",
          title: "Shuffle",
          shuffle_options: true,
          questions: [
            { question: "Pick?", options: ["Authored answer", "Distractor"], answer: "Authored answer" },
            { question: "Second?", options: ["One", "Two"], answer: "Two" }
          ]
        }}
      />
    );

    await waitFor(() => expect(screen.getAllByRole("radio").map((input) => (input as HTMLInputElement).value).slice(0, 2)).toEqual(["Distractor", "Authored answer"]));
    await user.click(screen.getByRole("radio", { name: "Authored answer" }));
    expect(screen.getByText("Selected: Authored answer")).toBeVisible();
    await user.click(screen.getAllByRole("button", { name: "Reveal answer" })[0]);
    expect(screen.getByText("Authored answer", { selector: ".assessment-hidden-region p" })).toBeVisible();
  });

  it("restores a per-question attempt from a prior visit when wrapped in ProgressProvider", async () => {
    const component = {
      type: "question_set" as const,
      anchor: "set-persisted",
      title: "Persisted set",
      questions: [
        { question: "First?", options: ["Yes", "No"], answer: "Yes" },
        { question: "Second?", options: ["One", "Two"], answer: "Two" }
      ]
    };

    const first = render(
      <ProgressProvider storageKey="lecture-progress:test-lecture" sections={[]} lectureId="test-lecture">
        <QuestionSet component={component} />
      </ProgressProvider>
    );

    await waitFor(() => expect(screen.getByLabelText("No")).toBeInTheDocument());

    vi.useFakeTimers();
    fireEvent.click(screen.getByLabelText("No"));
    fireEvent.click(screen.getAllByRole("button", { name: "Reveal answer" })[0]);

    act(() => {
      vi.advanceTimersByTime(300);
    });
    vi.useRealTimers();

    expect(JSON.parse(window.localStorage.getItem("lecture-progress:test-lecture:answers") ?? "{}")).toEqual({
      "set-persisted:0": { selected: "No", correct: false }
    });

    first.unmount();

    render(
      <ProgressProvider storageKey="lecture-progress:test-lecture" sections={[]} lectureId="test-lecture">
        <QuestionSet component={component} />
      </ProgressProvider>
    );

    await waitFor(() => expect(screen.getAllByRole("button", { name: "Hide feedback" })[0]).toBeInTheDocument());
    expect(screen.getByLabelText("No")).toBeChecked();
    expect(screen.getAllByRole("button", { name: "Reveal answer" })[0]).toBeInTheDocument();
  });

  it("can disable preview-only shuffle for review package rendering", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(
      <QuestionSet
        enableShuffle={false}
        component={{
          type: "question_set",
          anchor: "review-order",
          title: "Review order",
          shuffle_options: true,
          questions: [
            { question: "Pick?", options: ["First authored", "Second authored"], answer: "First authored" },
            { question: "Second?", options: ["One", "Two"], answer: "Two" }
          ]
        }}
      />
    );

    await waitFor(() => expect(screen.getAllByRole("radio").map((input) => (input as HTMLInputElement).value).slice(0, 2)).toEqual(["First authored", "Second authored"]));

    const options = screen.getAllByRole("radio").map((input) => (input as HTMLInputElement).value);
    expect(options.slice(0, 2)).toEqual(["First authored", "Second authored"]);
  });

  it("keeps free-response textarea and guidance state local per component", async () => {
    const user = userEvent.setup();
    render(
      <>
        <FreeResponse
          component={{
            type: "free_response",
            anchor: "free-one",
            title: "First prompt",
            prompt: "Explain one.",
            guidance: "First guidance."
          }}
        />
        <FreeResponse
          component={{
            type: "free_response",
            anchor: "free-two",
            title: "Second prompt",
            prompt: "Explain two.",
            guidance: "Second guidance."
          }}
        />
      </>
    );

    const textboxes = screen.getAllByRole("textbox", { name: "Your response" });
    await user.type(textboxes[0], "Local draft");
    expect(textboxes[0]).toHaveValue("Local draft");
    expect(textboxes[1]).toHaveValue("");

    const firstButton = screen.getAllByRole("button", { name: "Compare your answer" })[0];
    await user.click(firstButton);
    expect(screen.getByText("First guidance.")).toBeVisible();
    expect(screen.getByText("Second guidance.")).not.toBeVisible();
    expect(screen.queryByRole("button", { name: "Submit" })).not.toBeInTheDocument();
  });

  it("keeps practice-task hint and solution disclosures independent", async () => {
    const user = userEvent.setup();
    render(
      <PracticeTask
        component={{
          type: "practice_task",
          anchor: "practice",
          title: "Practice",
          task: "Fix it.",
          hints: ["Inspect the field path."],
          solution: "Repair the answer.",
          rubric: [{ criterion: "Valid", expected: "Validation passes." }]
        }}
      />
    );

    const hintButton = screen.getByRole("button", { name: "Show hints" });
    const solutionButton = screen.getByRole("button", { name: "Show solution" });

    await user.click(hintButton);

    expect(screen.getByRole("button", { name: "Hide hints" })).toHaveAttribute("aria-expanded", "true");
    expect(solutionButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Inspect the field path.")).toBeVisible();
    expect(screen.getByText("Repair the answer.")).not.toBeVisible();
    expect(screen.getByText("Valid:")).toBeVisible();
  });
});
