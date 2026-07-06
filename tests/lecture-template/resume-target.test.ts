import { describe, expect, it } from "vitest";
import { calculateResumeTarget } from "../../src/lib/lecture-template/resumeTarget";
import type { CollectionProgress, ProgressLecture } from "../../src/lib/lecture-template/progress";

const lectures: ProgressLecture[] = [
  { slug: "01-intro", sections: [{ anchor: "s1", title: "S1" }, { anchor: "s2", title: "S2" }] },
  { slug: "02-core", sections: [{ anchor: "s3", title: "S3" }, { anchor: "s4", title: "S4" }] },
  { slug: "03-wrap", sections: [{ anchor: "s5", title: "S5" }] }
];

describe("calculateResumeTarget", () => {
  it("returns Start course for empty progress", () => {
    const target = calculateResumeTarget({}, lectures);
    expect(target).toEqual({ label: "Start course", href: "/lectures/01-intro" });
  });

  it("returns Start course when lectures are empty", () => {
    const target = calculateResumeTarget({}, []);
    expect(target).toEqual({ label: "Start course", href: "/" });
  });

  it("returns Resume course targeting first incomplete section", () => {
    const progress: CollectionProgress = {
      "01-intro": { s1: true }
    };
    const target = calculateResumeTarget(progress, lectures);
    expect(target).toEqual({ label: "Resume course", href: "/lectures/01-intro#s2" });
  });

  it("returns Resume course targeting first lecture with no progress when previous lectures are complete", () => {
    const progress: CollectionProgress = {
      "01-intro": { s1: true, s2: true }
    };
    const target = calculateResumeTarget(progress, lectures);
    expect(target).toEqual({ label: "Resume course", href: "/lectures/02-core" });
  });

  it("returns Resume course targeting first incomplete section in second lecture", () => {
    const progress: CollectionProgress = {
      "01-intro": { s1: true, s2: true },
      "02-core": { s3: true }
    };
    const target = calculateResumeTarget(progress, lectures);
    expect(target).toEqual({ label: "Resume course", href: "/lectures/02-core#s4" });
  });

  it("returns Continue course when all sections are complete", () => {
    const progress: CollectionProgress = {
      "01-intro": { s1: true, s2: true },
      "02-core": { s3: true, s4: true },
      "03-wrap": { s5: true }
    };
    const target = calculateResumeTarget(progress, lectures);
    expect(target).toEqual({ label: "Continue course", href: "/lectures/01-intro" });
  });

  it("returns Resume course for malformed progress with unknown slug", () => {
    const progress: CollectionProgress = {
      "unknown-slug": { s1: true }
    };
    const target = calculateResumeTarget(progress, lectures);
    expect(target).toEqual({ label: "Resume course", href: "/lectures/01-intro" });
  });
});
