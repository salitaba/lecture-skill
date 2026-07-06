import type { LectureComponent, LectureSection, LectureTemplate, RenderBlock } from "./types";

const DEFAULT_WORDS_PER_MINUTE = 200;

export function countWords(text: string | undefined): number {
  if (!text) return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function sumWords(values: string[] | undefined): number {
  if (!values) return 0;
  return values.reduce((sum, value) => sum + countWords(value), 0);
}

export function countWordsInRenderBlock(block: RenderBlock): number {
  switch (block.kind) {
    case "paragraph":
      return countWords(block.text);
    case "bullet_list":
    case "numbered_list":
      return sumWords(block.items);
    case "code_fence":
      return countWords(block.code);
    case "table":
      return sumWords(block.rows);
    case "heading":
      return countWords(block.text);
    case "component":
      return countWordsInComponent(block.component);
    default:
      return 0;
  }
}

function countWordsInComponent(component: LectureComponent): number {
  switch (component.type) {
    case "callout":
      return countWords(component.body);
    case "concept_card":
      return countWords(component.body);
    case "step_list":
      return sumWords(component.steps);
    case "code_block":
      return countWords(component.code);
    case "comparison":
      return component.items.reduce((sum, item) => sum + countWords(item.left) + countWords(item.right), 0);
    case "summary":
      return sumWords(component.items);
    case "quote":
      return countWords(component.quote) + countWords(component.context);
    case "quiz":
      // quiz.answer / quiz.explanation are answer-key content; excluded to avoid double counting.
      return countWords(component.question);
    case "question_set":
      // questions[].answer / questions[].feedback are answer-key content; excluded.
      return countWords(component.instructions) + component.questions.reduce((sum, question) => sum + countWords(question.question), 0);
    case "free_response":
      // guidance is revealed answer-key content; excluded.
      return countWords(component.prompt);
    case "practice_task":
      // hints / solution / rubric are reveal-gated answer-key content; excluded.
      return countWords(component.scenario) + countWords(component.task) + sumWords(component.steps);
    case "diagram":
      return 0;
    case "glossary_term":
      return countWords(component.definition) + countWords(component.context);
    case "tabs":
      return component.tabs.reduce((sum, tab) => sum + countWords(tab.content), 0);
    case "accordion":
      return component.items.reduce((sum, item) => sum + countWords(item.body), 0);
    case "timeline":
      return component.items.reduce((sum, item) => sum + countWords(item.detail), 0);
    case "checklist":
      return sumWords(component.items);
    case "flashcard":
      return countWords(component.prompt) + countWords(component.answer) + countWords(component.hint);
    case "worked_example":
      return countWords(component.problem) + sumWords(component.walkthrough) + countWords(component.solution) + countWords(component.takeaway);
    case "mistake_correction":
      return (
        countWords(component.mistake) +
        countWords(component.why_it_fails) +
        countWords(component.correction) +
        countWords(component.example_before) +
        countWords(component.example_after)
      );
    case "resource_links":
      return component.links.reduce((sum, link) => sum + countWords(link.description), 0);
    case "instructor_note":
      return 0;
    default:
      return 0;
  }
}

export function countWordsInSection(section: LectureSection): number {
  return section.blocks.reduce((sum, block) => sum + countWordsInRenderBlock(block), 0);
}

export function countWordsInLecture(lecture: LectureTemplate): number {
  return lecture.sections.reduce((sum, section) => sum + countWordsInSection(section), 0);
}

export function estimateReadingMinutes(totalWords: number, wordsPerMinute = DEFAULT_WORDS_PER_MINUTE): number {
  if (totalWords <= 0) return 0;
  return Math.max(1, Math.round(totalWords / wordsPerMinute));
}

export function lectureReadingMinutes(lecture: LectureTemplate): number {
  return estimateReadingMinutes(countWordsInLecture(lecture));
}

export function sectionReadingMinutes(section: LectureSection): number {
  return estimateReadingMinutes(countWordsInSection(section));
}

export function sumLectureReadingMinutes(lectures: LectureTemplate[]): number {
  const totalWords = lectures.reduce((sum, lecture) => sum + countWordsInLecture(lecture), 0);
  return estimateReadingMinutes(totalWords);
}
