import type {
  CollectionValidationResult,
  LectureComponent,
  LectureTemplate,
  PracticeRubricItem,
  QuestionSetQuestion
} from "./types";

export type AssessmentType = "quiz" | "question_set" | "free_response" | "practice_task";

export interface AssessmentSummary {
  lectureSlug?: string;
  lectureTitle?: string;
  sectionTitle: string;
  sectionAnchor: string;
  type: AssessmentType;
  title: string;
  anchor: string;
}

export interface AnswerKeyEntry extends AssessmentSummary {
  questions?: QuestionSetQuestion[];
  answer?: string;
  explanation?: string;
  guidance?: string;
  hints?: string[];
  solution?: string;
  rubric?: PracticeRubricItem[];
}

export function collectLectureAssessments(lecture: LectureTemplate, lectureSlug?: string): AssessmentSummary[] {
  return collectAssessmentEntries(lecture, lectureSlug).map(({ entry }) => entry);
}

export function collectLectureAnswerKey(lecture: LectureTemplate, lectureSlug?: string): AnswerKeyEntry[] {
  return collectAssessmentEntries(lecture, lectureSlug).map(({ entry, component }) => {
    if (component.type === "quiz") {
      return {
        ...entry,
        answer: component.answer,
        ...(component.explanation ? { explanation: component.explanation } : {})
      };
    }
    if (component.type === "question_set") {
      return {
        ...entry,
        questions: component.questions
      };
    }
    if (component.type === "free_response") {
      return {
        ...entry,
        ...(component.guidance ? { guidance: component.guidance } : {})
      };
    }
    return {
      ...entry,
      ...(component.hints ? { hints: component.hints } : {}),
      ...(component.solution ? { solution: component.solution } : {}),
      ...(component.rubric ? { rubric: component.rubric } : {})
    };
  });
}

export function collectCollectionAssessments(validation: CollectionValidationResult): AssessmentSummary[] {
  return validation.results.flatMap((result) => {
    if (!result.valid || !result.template) return [];
    return collectLectureAssessments(result.template, result.slug);
  });
}

function collectAssessmentEntries(lecture: LectureTemplate, lectureSlug?: string): Array<{ entry: AssessmentSummary; component: AssessmentComponent }> {
  return lecture.sections.flatMap((section) =>
    section.blocks.flatMap((block) => {
      if (block.kind !== "component" || !isAssessmentComponent(block.component)) return [];
      const component = block.component;
      return [
        {
          component,
          entry: {
            lectureSlug,
            lectureTitle: lecture.metadata.title,
            sectionTitle: section.title,
            sectionAnchor: section.anchor,
            type: component.type,
            title: assessmentTitle(component),
            anchor: component.anchor
          }
        }
      ];
    })
  );
}

type AssessmentComponent = Extract<LectureComponent, { type: AssessmentType }>;

function isAssessmentComponent(component: LectureComponent): component is AssessmentComponent {
  return ["quiz", "question_set", "free_response", "practice_task"].includes(component.type);
}

function assessmentTitle(component: AssessmentComponent): string {
  if (component.type === "quiz") return component.question;
  if (component.type === "free_response") return component.title;
  if (component.type === "practice_task") return component.title;
  return component.title;
}
