/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LearningPathNavigation } from "../../src/components/lecture-kit/LearningPathNavigation";
import { AnnotationsProvider } from "../../src/components/lecture-kit/progress/AnnotationsProvider";
import { SectionNote } from "../../src/components/lecture-kit/progress/SectionNote";

const annotationsKey = "lecture-progress:test-lecture:annotations";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  window.localStorage.clear();
});

function stubDialog() {
  const showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  });
  const close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute("open");
  });
  HTMLDialogElement.prototype.showModal = showModal;
  HTMLDialogElement.prototype.close = close;
  return { showModal, close };
}

describe("SectionNote", () => {
  it("is usable with no text selection: opens in a popup, saves on blur, persists, and surfaces in the learning path", async () => {
    stubDialog();
    const user = userEvent.setup();

    const first = render(
      <AnnotationsProvider lectureId="test-lecture">
        <SectionNote anchor="intro" title="Introduction" />
        <LearningPathNavigation sections={[{ anchor: "intro", title: "Introduction", blocks: [] }]} />
      </AnnotationsProvider>
    );

    expect(screen.queryByText("Introduction", { selector: ".nav-item-note-icon" })).not.toBeInTheDocument();
    expect(document.querySelector(".nav-item-note-icon")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add a note" }));
    const textarea = screen.getByLabelText("Your note");
    await user.type(textarea, "Remember this part");

    vi.useFakeTimers();
    fireEvent.blur(textarea);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    vi.useRealTimers();

    await waitFor(() =>
      expect(JSON.parse(window.localStorage.getItem(annotationsKey) ?? "{}").notes).toEqual({ intro: "Remember this part" })
    );
    expect(document.querySelector(".nav-item-note-icon")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit note" })).toBeInTheDocument();

    first.unmount();

    render(
      <AnnotationsProvider lectureId="test-lecture">
        <SectionNote anchor="intro" title="Introduction" />
        <LearningPathNavigation sections={[{ anchor: "intro", title: "Introduction", blocks: [] }]} />
      </AnnotationsProvider>
    );

    await waitFor(() => expect(screen.getByRole("button", { name: "Edit note" })).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: "Edit note" }));
    expect(screen.getByLabelText("Your note")).toHaveValue("Remember this part");
    expect(document.querySelector(".nav-item-note-icon")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));
  });

  it("does nothing outside an AnnotationsProvider", async () => {
    stubDialog();
    const user = userEvent.setup();
    render(<SectionNote anchor="intro" title="Introduction" />);

    await user.click(screen.getByRole("button", { name: "Add a note" }));
    const textarea = screen.getByLabelText("Your note");
    await user.type(textarea, "Ignored");
    fireEvent.blur(textarea);

    expect(window.localStorage.getItem(annotationsKey)).toBeNull();
  });

  it("focuses the note field and saves the draft before restoring trigger focus on close", async () => {
    stubDialog();
    const user = userEvent.setup();
    render(
      <AnnotationsProvider lectureId="test-lecture">
        <SectionNote anchor="intro" title="Introduction" />
      </AnnotationsProvider>
    );

    const trigger = screen.getByRole("button", { name: "Add a note" });
    await user.click(trigger);
    const textarea = screen.getByLabelText("Your note");
    await waitFor(() => expect(textarea).toHaveFocus());
    await user.type(textarea, "Saved on close");
    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(trigger).toHaveFocus();
    await waitFor(() => expect(JSON.parse(window.localStorage.getItem(annotationsKey) ?? "{}").notes).toEqual({ intro: "Saved on close" }));
  });
});
