/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Quiz } from "../../src/components/lecture-kit/Quiz";

afterEach(() => {
  cleanup();
});

describe("quiz reveal interaction", () => {
  it("starts collapsed with accessible disclosure wiring and reveals feedback on click", async () => {
    const user = userEvent.setup();
    const { container } = render(
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
    );

    expect(screen.getByText("Quiz: Knowledge check")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Which command validates?" })).toBeInTheDocument();
    expect(screen.getByRole("list")).toHaveClass("quiz-options");
    expect(screen.getByText("npm run dev")).toBeVisible();

    const button = screen.getByRole("button", { name: "Show answer" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("aria-expanded", "false");
    const answerRegionId = button.getAttribute("aria-controls");
    expect(answerRegionId).toBeTruthy();

    const answerRegion = container.ownerDocument.getElementById(answerRegionId ?? "");
    expect(answerRegion).toBeInTheDocument();
    expect(answerRegion).toHaveAttribute("hidden");
    expect(answerRegion).not.toBeVisible();

    const answerLabelId = answerRegion?.getAttribute("aria-labelledby");
    expect(answerLabelId).toBeTruthy();
    const answerLabel = container.ownerDocument.getElementById(answerLabelId ?? "");
    expect(answerLabel).toHaveTextContent("Answer");
    expect(answerRegion).toContainElement(answerLabel);
    expect(answerRegion).toHaveTextContent("npm run validate");
    expect(answerRegion).toHaveTextContent("Validation checks the template.");

    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");

    expect(screen.getByRole("button", { name: "Hide answer" })).toHaveAttribute("aria-expanded", "true");
    expect(answerRegion).not.toHaveAttribute("hidden");

    await user.keyboard(" ");

    expect(screen.getByRole("button", { name: "Show answer" })).toHaveAttribute("aria-expanded", "false");
    expect(answerRegion).toHaveAttribute("hidden");

    await user.click(button);

    expect(screen.getByRole("button", { name: "Hide answer" })).toHaveAttribute("aria-expanded", "true");
    expect(answerRegion).not.toHaveAttribute("hidden");
    expect(answerRegion).toBeVisible();
    expect(screen.getByText("Answer")).toBeVisible();
    expect(screen.getByText("Validation checks the template.")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Hide answer" }));

    expect(screen.getByRole("button", { name: "Show answer" })).toHaveAttribute("aria-expanded", "false");
    expect(answerRegion).toHaveAttribute("hidden");
    expect(answerRegion).not.toBeVisible();
  });

  it("keeps multiple quizzes independent with distinct answer regions", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <Quiz
          component={{
            type: "quiz",
            anchor: "quiz-first",
            question: "First question?",
            options: ["First answer", "Other"],
            answer: "First answer"
          }}
        />
        <Quiz
          component={{
            type: "quiz",
            anchor: "quiz-second",
            question: "Second question?",
            options: ["Second answer", "Other"],
            answer: "Second answer"
          }}
        />
      </>
    );

    const buttons = screen.getAllByRole("button", { name: "Show answer" });
    expect(buttons).toHaveLength(2);

    const firstRegionId = buttons[0].getAttribute("aria-controls");
    const secondRegionId = buttons[1].getAttribute("aria-controls");
    expect(firstRegionId).toBeTruthy();
    expect(secondRegionId).toBeTruthy();
    expect(firstRegionId).not.toBe(secondRegionId);

    const firstRegion = container.ownerDocument.getElementById(firstRegionId ?? "");
    const secondRegion = container.ownerDocument.getElementById(secondRegionId ?? "");
    expect(firstRegion).toHaveAttribute("hidden");
    expect(secondRegion).toHaveAttribute("hidden");

    await user.click(buttons[0]);

    expect(buttons[0]).toHaveTextContent("Hide answer");
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    expect(buttons[1]).toHaveTextContent("Show answer");
    expect(buttons[1]).toHaveAttribute("aria-expanded", "false");
    expect(firstRegion).not.toHaveAttribute("hidden");
    expect(secondRegion).toHaveAttribute("hidden");
    expect(firstRegion).toHaveTextContent("First answer");
    expect(secondRegion).toHaveTextContent("Second answer");
  });
});
