/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

afterEach(() => {
  cleanup();
});

describe("quiz feedback CSS classes", () => {
  it("includes selected, correct, and not-quite state styles in globals.css", () => {
    const css = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");

    expect(css).toContain(".quiz-option-selected");
    expect(css).toContain(".quiz-correct");
    expect(css).toContain(".quiz-not-quite");
    expect(css).toContain(".quiz-feedback-message");
    expect(css).toContain(".quiz-feedback-correct");
    expect(css).toContain(".quiz-feedback-not-quite");
  });

  it("defines visual distinction for selected state", () => {
    const css = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    const selectedMatch = css.match(/\.quiz-option-selected\s*\{[^}]+\}/);

    expect(selectedMatch).toBeTruthy();
    expect(selectedMatch![0]).toContain("border-color");
    expect(selectedMatch![0]).toContain("background");
  });

  it("defines correct feedback styling", () => {
    const css = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    const correctMatch = css.match(/\.quiz-correct\s*\{[^}]+\}/);

    expect(correctMatch).toBeTruthy();
    expect(correctMatch![0]).toContain("border-color");
    expect(correctMatch![0]).toContain("background");
  });

  it("defines not-quite feedback styling", () => {
    const css = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    const notQuiteMatch = css.match(/\.quiz-not-quite\s*\{[^}]+\}/);

    expect(notQuiteMatch).toBeTruthy();
    expect(notQuiteMatch![0]).toContain("border-color");
    expect(notQuiteMatch![0]).toContain("background");
  });

  it("includes print rules that neutralize feedback backgrounds", () => {
    const css = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    const printSection = css.match(/@media print\s*\{[\s\S]*?\n\}/);

    expect(printSection).toBeTruthy();
    expect(printSection![0]).toContain(".quiz-option-selected");
    expect(printSection![0]).toContain(".quiz-correct");
    expect(printSection![0]).toContain(".quiz-not-quite");
    expect(printSection![0]).toContain("background: transparent");
  });
});
