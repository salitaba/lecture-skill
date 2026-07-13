/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ThemeToggle } from "../../src/components/lecture-kit/ThemeToggle";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
  document.head.querySelector('meta[data-lecture-theme-color]')?.remove();
});

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
  document.head.querySelector('meta[data-lecture-theme-color]')?.remove();
});

describe("ThemeToggle", () => {
  it("reserves non-interactive chrome before hydration", async () => {
    render(<ThemeToggle />);

    expect(document.querySelector(".theme-toggle-placeholder")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("button")).toBeInTheDocument());
  });

  it("hydrates a stored theme and synchronizes the owned browser-color override", async () => {
    window.localStorage.setItem("theme", "dark");
    render(<ThemeToggle />);

    const button = await screen.findByRole("button", { name: "Switch to light theme" });
    const meta = document.head.querySelector('meta[name="theme-color"][data-lecture-theme-color]');
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(meta).toHaveAttribute("content", "#1c2124");

    await userEvent.setup().click(button);

    expect(button).toHaveAccessibleName("Switch to dark theme");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(window.localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(meta).toHaveAttribute("content", "#ffffff");
  });
});
