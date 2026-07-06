import { describe, expect, it } from "vitest";
import {
  countWordsInLecture,
  countWordsInSection,
  estimateReadingMinutes,
  lectureReadingMinutes,
  sectionReadingMinutes,
  sumLectureReadingMinutes
} from "../../src/lib/lecture-template/readingTime";
import type { LectureSection, LectureTemplate, RenderBlock } from "../../src/lib/lecture-template/types";

function words(count: number): string {
  return new Array(count).fill("word").join(" ");
}

function paragraph(text: string): RenderBlock {
  return { kind: "paragraph", text, locator: { line: 1 } };
}

function section(title: string, blocks: RenderBlock[]): LectureSection {
  return { title, anchor: title.toLowerCase().replace(/\s+/g, "-"), blocks };
}

function lecture(sections: LectureSection[]): LectureTemplate {
  return {
    metadata: { title: "Test", description: "", audience: "", duration: "10 minutes", level: "beginner" },
    overview: [],
    objectives: [],
    sections,
    takeaways: []
  };
}

describe("readingTime", () => {
  it("returns zero words and zero minutes for an empty lecture", () => {
    const empty = lecture([]);
    expect(countWordsInLecture(empty)).toBe(0);
    expect(lectureReadingMinutes(empty)).toBe(0);
  });

  it("applies a one-minute floor for any non-zero lecture", () => {
    const short = lecture([section("Intro", [paragraph(words(5))])]);
    expect(countWordsInLecture(short)).toBe(5);
    expect(lectureReadingMinutes(short)).toBe(1);
  });

  it("rounds to the nearest minute at 200 words per minute", () => {
    expect(estimateReadingMinutes(100)).toBe(1); // 0.5 -> rounds up
    expect(estimateReadingMinutes(300)).toBe(2); // 1.5 -> rounds up
    expect(estimateReadingMinutes(500)).toBe(3); // 2.5 -> rounds up
  });

  it("matches the spec example of a 2000-word lecture yielding ~10 min", () => {
    const long = lecture([section("Body", [paragraph(words(2000))])]);
    expect(countWordsInLecture(long)).toBe(2000);
    expect(lectureReadingMinutes(long)).toBe(10);
  });

  it("counts mixed markdown blocks and component text, excluding answer-key-only fields", () => {
    const mixed = lecture([
      section("Mixed", [
        { kind: "heading", depth: 3, text: words(2), locator: { line: 1 } },
        { kind: "bullet_list", items: [words(3), words(2)], locator: { line: 2 } },
        { kind: "code_fence", language: "ts", code: words(4), locator: { line: 3 } },
        {
          kind: "component",
          locator: { line: 4 },
          component: {
            type: "quiz",
            anchor: "q1",
            question: words(3),
            options: ["A", "B"],
            answer: words(20),
            explanation: words(20)
          }
        }
      ])
    ]);

    // 2 (heading) + 5 (bullets) + 4 (code) + 3 (quiz question) = 14; answer/explanation excluded.
    expect(countWordsInSection(mixed.sections[0])).toBe(14);
  });

  it("computes a per-section estimate independent of other sections", () => {
    const lec = lecture([section("A", [paragraph(words(400))]), section("B", [paragraph(words(10))])]);
    expect(sectionReadingMinutes(lec.sections[0])).toBe(2);
    expect(sectionReadingMinutes(lec.sections[1])).toBe(1);
  });

  it("sums reading minutes across multiple lectures", () => {
    const lectures = [lecture([section("A", [paragraph(words(400))])]), lecture([section("B", [paragraph(words(600))])])];
    expect(sumLectureReadingMinutes(lectures)).toBe(5);
  });
});
