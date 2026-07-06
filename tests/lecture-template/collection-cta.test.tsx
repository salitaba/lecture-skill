/* @vitest-environment jsdom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CollectionPrimaryAction } from "../../src/components/lecture-kit/CollectionPrimaryAction";
import { CollectionProgressProvider } from "../../src/components/lecture-kit/progress/CollectionProgressProvider";
import type { ProgressLecture } from "../../src/lib/lecture-template/progress";

afterEach(() => {
  cleanup();
});

const lectures: ProgressLecture[] = [
  { slug: "01-intro", sections: [{ anchor: "s1", title: "S1" }, { anchor: "s2", title: "S2" }] },
  { slug: "02-core", sections: [{ anchor: "s3", title: "S3" }] }
];

function renderWithProvider(ui: React.ReactNode) {
  return render(
    <CollectionProgressProvider storageKey="test-progress" lectures={lectures}>
      {ui}
    </CollectionProgressProvider>
  );
}

describe("CollectionPrimaryAction", () => {
  it("renders Start course when no progress exists", () => {
    renderWithProvider(<CollectionPrimaryAction lectures={lectures} />);
    const link = screen.getByRole("link", { name: "Start course" });
    expect(link).toHaveAttribute("href", "/lectures/01-intro");
  });

  it("renders with collection-primary-action class", () => {
    renderWithProvider(<CollectionPrimaryAction lectures={lectures} />);
    const link = screen.getByRole("link", { name: "Start course" });
    expect(link).toHaveClass("collection-primary-action");
  });

  it("defaults to Start course while loading", () => {
    renderWithProvider(<CollectionPrimaryAction lectures={lectures} />);
    expect(screen.getByRole("link", { name: "Start course" })).toBeInTheDocument();
  });
});
