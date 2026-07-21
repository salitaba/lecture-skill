// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { cleanup } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { ReviewProvider, useReview } from "../../src/components/lecture-kit/progress/ReviewProvider";

function Harness() {
  const review = useReview();
  return (
    <>
      <p data-testid="status">{review.loaded ? "loaded" : "loading"} {Object.keys(review.records).length}</p>
      <button onClick={() => review.rate("quiz-one", "good", "2026-07-21T12:00:00.000Z")}>Rate</button>
      <button onClick={() => review.markReviewRecommended("quiz-one", "2026-07-21T12:00:00.000Z")}>Recommend</button>
      <button onClick={review.resetReviews}>Reset</button>
    </>
  );
}

describe("ReviewProvider", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("hydrates, persists, and resets review metadata independently", async () => {
    const user = userEvent.setup();
    render(<ReviewProvider lectureId="lecture-one" activityKeys={["quiz-one"]}><Harness /></ReviewProvider>);
    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("loaded 0"));
    await user.click(screen.getByRole("button", { name: "Rate" }));
    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("loaded 1"));
    expect(window.localStorage.getItem("lecture-progress:lecture-one:reviews")).toBeNull();
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    expect(window.localStorage.getItem("lecture-progress:lecture-one:reviews")).toContain("quiz-one");
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(window.localStorage.getItem("lecture-progress:lecture-one:reviews")).toBeNull();
  });

  it("keeps review actions usable when storage is unavailable", async () => {
    const original = window.localStorage.setItem;
    Object.defineProperty(window.localStorage, "setItem", { configurable: true, value: () => { throw new Error("blocked"); } });
    const user = userEvent.setup();
    render(<ReviewProvider lectureId="lecture-two" activityKeys={["quiz-one"]}><Harness /></ReviewProvider>);
    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("loaded 0"));
    await user.click(screen.getByRole("button", { name: "Rate" }));
    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("loaded 1"));
    Object.defineProperty(window.localStorage, "setItem", { configurable: true, value: original });
  });

  it("makes a negative signal immediately due without creating untouched activity", async () => {
    const user = userEvent.setup();
    render(<ReviewProvider lectureId="lecture-three" activityKeys={["quiz-one"]}><Harness /></ReviewProvider>);
    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("loaded 0"));
    await user.click(screen.getByRole("button", { name: "Recommend" }));
    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("loaded 1"));
    expect(screen.getByTestId("status")).toHaveTextContent("1");
  });
});
