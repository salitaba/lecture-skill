/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LectureNavigation } from "../../src/components/lecture-kit/LectureNavigation";

afterEach(() => {
  cleanup();
});

describe("collection lecture navigation", () => {
  it("first lecture shows back to course and next lecture only", () => {
    render(
      <LectureNavigation
        next={{ slug: "02-core-concepts", title: "Core Concepts" }}
        backHref="/"
        backLabel="Back to course"
      />
    );

    const backLink = screen.getByRole("link", { name: "Back to course" });
    expect(backLink).toHaveAttribute("href", "/");

    const nextLink = screen.getByRole("link", { name: /Core Concepts/ });
    expect(nextLink).toHaveAttribute("href", "/lectures/02-core-concepts");

    expect(screen.queryByRole("link", { name: /←/ })).not.toBeInTheDocument();
  });

  it("middle lecture shows previous, back, and next", () => {
    render(
      <LectureNavigation
        previous={{ slug: "01-intro", title: "Introduction" }}
        next={{ slug: "03-wrap", title: "Wrap Up" }}
        backHref="/"
        backLabel="Back to course"
      />
    );

    const prevLink = screen.getByRole("link", { name: /← Introduction/ });
    expect(prevLink).toHaveAttribute("href", "/lectures/01-intro");

    const backLink = screen.getByRole("link", { name: "Back to course" });
    expect(backLink).toHaveAttribute("href", "/");

    const nextLink = screen.getByRole("link", { name: /Wrap Up →/ });
    expect(nextLink).toHaveAttribute("href", "/lectures/03-wrap");
  });

  it("last lecture shows previous and back to course only", () => {
    render(
      <LectureNavigation
        previous={{ slug: "02-core", title: "Core Concepts" }}
        backHref="/"
        backLabel="Back to course"
      />
    );

    const prevLink = screen.getByRole("link", { name: /← Core Concepts/ });
    expect(prevLink).toHaveAttribute("href", "/lectures/02-core");

    const backLink = screen.getByRole("link", { name: "Back to course" });
    expect(backLink).toHaveAttribute("href", "/");

    expect(screen.queryByRole("link", { name: /→/ })).not.toBeInTheDocument();
  });

  it("uses custom backHref and backLabel when provided", () => {
    render(
      <LectureNavigation
        backHref="/lectures/landing"
        backLabel="Return to course"
      />
    );

    const backLink = screen.getByRole("link", { name: "Return to course" });
    expect(backLink).toHaveAttribute("href", "/lectures/landing");
  });

  it("all links are normal anchors for no-JS compatibility", () => {
    const { container } = render(
      <LectureNavigation
        previous={{ slug: "01-intro", title: "Introduction" }}
        next={{ slug: "03-wrap", title: "Wrap Up" }}
        backHref="/"
        backLabel="Back to course"
      />
    );

    const links = container.querySelectorAll("a");
    for (const link of links) {
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href");
    }
  });

  it("renders with accessible aria-label", () => {
    render(
      <LectureNavigation
        next={{ slug: "02-core", title: "Core" }}
        backHref="/"
      />
    );

    expect(screen.getByRole("navigation", { name: "Lecture navigation" })).toBeInTheDocument();
  });
});
