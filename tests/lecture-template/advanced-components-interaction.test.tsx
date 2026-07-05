/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Accordion } from "../../src/components/lecture-kit/Accordion";
import { Checklist } from "../../src/components/lecture-kit/Checklist";
import { Flashcard } from "../../src/components/lecture-kit/Flashcard";
import { Tabs } from "../../src/components/lecture-kit/Tabs";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe("advanced component interactions", () => {
  it("enhances tabs after hydration while keeping panels addressable", async () => {
    const user = userEvent.setup();
    render(
      <Tabs
        component={{
          type: "tabs",
          title: "Modes",
          tabs: [
            { label: "CLI", content: "Validate with npm run validate." },
            { label: "Browser", content: "Preview the layout." }
          ]
        }}
      />
    );

    const cliTab = screen.getByRole("tab", { name: "CLI" });
    const browserTab = screen.getByRole("tab", { name: "Browser" });
    expect(cliTab).toHaveAttribute("aria-selected", "true");
    expect(browserTab).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tabpanel", { name: "CLI" })).toBeVisible();

    await user.click(browserTab);

    expect(browserTab).toHaveAttribute("aria-selected", "true");
    expect(cliTab).toHaveAttribute("aria-selected", "false");
    expect(screen.getByText("Preview the layout.")).toBeVisible();

    await user.keyboard("{ArrowLeft}");
    expect(cliTab).toHaveAttribute("aria-selected", "true");
  });

  it("keeps repeated tab component ids unique in the DOM", () => {
    render(
      <>
        <Tabs component={{ type: "tabs", title: "First", tabs: [{ label: "A", content: "A1" }, { label: "B", content: "B1" }] }} />
        <Tabs component={{ type: "tabs", title: "Second", tabs: [{ label: "A", content: "A2" }, { label: "B", content: "B2" }] }} />
      </>
    );

    const ids = Array.from(document.querySelectorAll("[id]")).map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("tracks checklist state locally and resets it", async () => {
    const user = userEvent.setup();
    render(
      <Checklist
        instanceId="lecture:section:1"
        component={{
          type: "checklist",
          title: "Ready",
          storage: "local",
          reset_label: "Reset checklist",
          items: ["Validate", "Print"]
        }}
      />
    );

    const validate = screen.getByRole("checkbox", { name: "Validate" });
    const print = screen.getByRole("checkbox", { name: "Print" });

    await user.click(validate);
    expect(validate).toBeChecked();
    expect(print).not.toBeChecked();
    expect(window.localStorage.length).toBe(1);

    await user.click(screen.getByRole("button", { name: "Reset checklist" }));
    expect(validate).not.toBeChecked();
    expect(print).not.toBeChecked();
    expect(window.localStorage.length).toBe(0);
  });

  it("recovers when checklist localStorage is unavailable", async () => {
    const user = userEvent.setup();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(<Checklist instanceId="blocked" component={{ type: "checklist", title: "Ready", storage: "local", items: ["Validate"] }} />);

    const checkbox = screen.getByRole("checkbox", { name: "Validate" });
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("reveals flashcard answers independently", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Flashcard component={{ type: "flashcard", prompt: "First?", answer: "One." }} />
        <Flashcard component={{ type: "flashcard", prompt: "Second?", answer: "Two." }} />
      </>
    );

    const cards = screen.getAllByText("Flashcard").map((label) => label.closest("aside") as HTMLElement);
    await user.click(within(cards[0]).getByRole("button", { name: "Reveal answer" }));

    expect(within(cards[0]).getByRole("button", { name: "Hide answer" })).toHaveAttribute("aria-expanded", "true");
    expect(within(cards[0]).getByText("One.")).toBeVisible();
    expect(within(cards[1]).getByRole("button", { name: "Reveal answer" })).toHaveAttribute("aria-expanded", "false");
    expect(within(cards[1]).getByText("Two.")).not.toBeVisible();
  });

  it("renders accordion disclosure with default-open item", () => {
    render(
      <Accordion
        component={{
          type: "accordion",
          title: "Details",
          default_open: "Open",
          items: [
            { title: "Open", body: "Visible." },
            { title: "Closed", body: "Available." }
          ]
        }}
      />
    );

    expect(screen.getByText("Open").closest("details")).toHaveAttribute("open");
    expect(screen.getByText("Closed").closest("details")).not.toHaveAttribute("open");
    expect(screen.getAllByText("Available.")).toHaveLength(2);
  });
});
