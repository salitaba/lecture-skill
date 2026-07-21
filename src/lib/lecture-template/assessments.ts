import type {
  CollectionValidationResult,
  LectureComponent,
  LectureTemplate,
  PracticeRubricItem,
  QuestionSetQuestion,
  SourceLocator
} from "./types";

export type AssessmentKind = "quiz" | "question_set" | "free_response" | "practice_task" | "flashcard";
/** @deprecated Use AssessmentKind. Kept as a source-compatible alias for integrations. */
export type AssessmentType = AssessmentKind;
export type AssessmentEvaluationMode = "choice" | "self_assess" | "rubric" | "reveal";

export interface AssessmentResponseItem {
  key: string;
  label: string;
}

export interface AssessmentCapability {
  evaluationMode: AssessmentEvaluationMode;
  supportsAnswerReview: boolean;
  supportsAnswerKey: boolean;
}

export const assessmentCapabilities: Record<AssessmentKind, AssessmentCapability> = {
  quiz: { evaluationMode: "choice", supportsAnswerReview: true, supportsAnswerKey: true },
  question_set: { evaluationMode: "choice", supportsAnswerReview: true, supportsAnswerKey: true },
  free_response: { evaluationMode: "self_assess", supportsAnswerReview: false, supportsAnswerKey: false },
  practice_task: { evaluationMode: "rubric", supportsAnswerReview: false, supportsAnswerKey: false },
  flashcard: { evaluationMode: "reveal", supportsAnswerReview: false, supportsAnswerKey: false }
};

export interface AssessmentSummary {
  lectureSlug?: string;
  lectureTitle?: string;
  sectionTitle: string;
  sectionAnchor: string;
  type: AssessmentKind;
  title: string;
  anchor: string;
  id: string;
  evaluationMode: AssessmentEvaluationMode;
  supportsAnswerReview: boolean;
  supportsAnswerKey: boolean;
  isExplicitId: boolean;
  sourceLocator?: SourceLocator;
  objectiveRefs?: string[];
  responseItems: AssessmentResponseItem[];
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

export interface AnswerDefinition {
  options: string[];
  answer: string;
}

export type AnswerDefinitions = Record<string, AnswerDefinition>;

export interface AssessmentDiagnosticsSummary {
  total: number;
  byType: Record<AssessmentKind, number>;
  byEvaluationMode: Record<AssessmentEvaluationMode, number>;
  entries: Array<{
    id: string;
    anchor: string;
    type: AssessmentKind;
    title: string;
    sectionTitle: string;
    evaluationMode: AssessmentEvaluationMode;
    objectiveRefs?: string[];
  }>;
  answerKeyCount: number;
  learnerStateIncluded: false;
}

export function collectLectureAssessments(lecture: LectureTemplate, lectureSlug?: string): AssessmentSummary[] {
  return collectAssessmentEntries(lecture, lectureSlug).map(({ entry }) => entry);
}

export function collectLectureAnswerKey(lecture: LectureTemplate, lectureSlug?: string): AnswerKeyEntry[] {
  const answerKey: AnswerKeyEntry[] = [];
  for (const { entry, component } of collectAssessmentEntries(lecture, lectureSlug)) {
    if (component.type === "flashcard") continue;
    if (component.type === "quiz") {
      answerKey.push({
        ...entry,
        answer: component.answer,
        ...(component.explanation ? { explanation: component.explanation } : {})
      });
      continue;
    }
    if (component.type === "question_set") {
      answerKey.push({ ...entry, questions: component.questions });
      continue;
    }
    if (component.type === "free_response") {
      answerKey.push({ ...entry, ...(component.guidance ? { guidance: component.guidance } : {}) });
      continue;
    }
    answerKey.push({
      ...entry,
      ...(component.hints ? { hints: component.hints } : {}),
      ...(component.solution ? { solution: component.solution } : {}),
      ...(component.rubric ? { rubric: component.rubric } : {})
    });
  }
  return answerKey;
}

export function collectLectureAnswerDefinitions(lecture: LectureTemplate): AnswerDefinitions {
  const definitions: AnswerDefinitions = {};

  for (const { component } of collectAssessmentEntries(lecture)) {
    if (component.type === "quiz") {
      definitions[component.anchor] = { options: component.options, answer: component.answer };
    }
    if (component.type === "question_set") {
      component.questions.forEach((question, index) => {
        definitions[`${component.anchor}:${index}`] = { options: question.options, answer: question.answer };
      });
    }
  }

  return definitions;
}

export function summarizeLectureAssessments(lecture: LectureTemplate): AssessmentDiagnosticsSummary {
  const entries = collectLectureAssessments(lecture);
  const byType = {} as Record<AssessmentKind, number>;
  const byEvaluationMode = {} as Record<AssessmentEvaluationMode, number>;

  for (const entry of entries) {
    byType[entry.type] = (byType[entry.type] ?? 0) + 1;
    byEvaluationMode[entry.evaluationMode] = (byEvaluationMode[entry.evaluationMode] ?? 0) + 1;
  }

  return {
    total: entries.length,
    byType: sortRecord(byType),
    byEvaluationMode: sortRecord(byEvaluationMode),
    entries: entries.map((entry) => ({
      id: entry.id,
      anchor: entry.anchor,
      type: entry.type,
      title: entry.title,
      sectionTitle: entry.sectionTitle,
      evaluationMode: entry.evaluationMode,
      ...(entry.objectiveRefs ? { objectiveRefs: entry.objectiveRefs } : {})
    })),
    answerKeyCount: entries.filter((entry) => entry.supportsAnswerKey).length,
    learnerStateIncluded: false
  };
}

export function collectCollectionAssessments(validation: CollectionValidationResult): AssessmentSummary[] {
  return validation.results.flatMap((result) => {
    if (!result.valid || !result.template) return [];
    return collectLectureAssessments(result.template, result.slug);
  });
}

function collectAssessmentEntries(
  lecture: LectureTemplate,
  lectureSlug?: string
): Array<{ entry: AssessmentSummary; component: AssessmentComponent }> {
  return lecture.sections.flatMap((section) =>
    section.blocks.flatMap((block, blockIndex) => {
      if (block.kind !== "component" || !isAssessmentComponent(block.component)) return [];
      const component = block.component;
      const anchor = component.anchor ?? `${section.anchor}-${component.type}-${blockIndex + 1}`;
      const capability = assessmentCapabilities[component.type];
      const responseItems = responseItemsFor(component, anchor);
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
            anchor,
            id: component.id ?? anchor,
            isExplicitId: component.id !== undefined,
            evaluationMode: capability.evaluationMode,
            supportsAnswerReview: capability.supportsAnswerReview,
            supportsAnswerKey: capability.supportsAnswerKey,
            ...(component.objectiveRefs ? { objectiveRefs: component.objectiveRefs } : {}),
            sourceLocator: block.locator,
            responseItems
          }
        }
      ];
    })
  );
}

type AssessmentComponent = Extract<LectureComponent, { type: AssessmentKind }>;

function isAssessmentComponent(component: LectureComponent): component is AssessmentComponent {
  return ["quiz", "question_set", "free_response", "practice_task", "flashcard"].includes(component.type);
}

function assessmentTitle(component: AssessmentComponent): string {
  if (component.type === "quiz") return component.question;
  if (component.type === "flashcard") return component.prompt;
  return component.title;
}

function responseItemsFor(component: AssessmentComponent, anchor: string): AssessmentResponseItem[] {
  if (component.type === "quiz") return [{ key: anchor, label: component.question }];
  if (component.type === "question_set") {
    return component.questions.map((question, index) => ({
      key: `${anchor}:${index}`,
      label: `${question.question} (${component.title})`
    }));
  }
  return [];
}

function sortRecord<T extends Record<string, number>>(record: T): T {
  return Object.fromEntries(Object.entries(record).sort(([left], [right]) => left.localeCompare(right))) as T;
}
