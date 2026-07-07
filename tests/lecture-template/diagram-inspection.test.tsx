/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Diagram } from "../../src/components/lecture-kit/Diagram";

const fakeSvg = '<svg role="presentation"><text>Diagram</text></svg>';

vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    mermaidAPI: { setConfig: vi.fn() },
    render: vi.fn(async () => ({ svg: fakeSvg }))
  }
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Diagram inspection", () => {
  it("shows Expand diagram once rendered, opening a dialog with download and close actions", async () => {
    const user = userEvent.setup();
    const showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    });
    const close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute("open");
    });
    HTMLDialogElement.prototype.showModal = showModal;
    HTMLDialogElement.prototype.close = close;
    const createObjectURL = vi.fn(() => "blob:fake-url");
    const revokeObjectURL = vi.fn();
    URL.createObjectURL = createObjectURL as unknown as typeof URL.createObjectURL;
    URL.revokeObjectURL = revokeObjectURL as unknown as typeof URL.revokeObjectURL;

    render(
      <Diagram
        component={{
          type: "diagram",
          diagram_type: "flowchart",
          title: "Sample Flow",
          code: "graph TD; A-->B;"
        }}
      />
    );

    const expandButton = await screen.findByRole("button", { name: /Expand diagram/ });
    await user.click(expandButton);

    expect(showModal).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /Download SVG/ }));
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:fake-url");

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(close).toHaveBeenCalledTimes(1);
  });

  it("does not show Expand diagram when rendering fails", async () => {
    const mermaidModule = await import("mermaid");
    vi.mocked(mermaidModule.default.render).mockRejectedValueOnce(new Error("bad diagram"));

    render(
      <Diagram
        component={{
          type: "diagram",
          diagram_type: "flowchart",
          title: "Broken Flow",
          code: "graph TD; A-->B;"
        }}
      />
    );

    await waitFor(() => expect(screen.getByText("Diagram could not be rendered. Showing source code.")).toBeInTheDocument());
    expect(screen.queryByRole("button", { name: /Expand diagram/ })).not.toBeInTheDocument();
  });
});
