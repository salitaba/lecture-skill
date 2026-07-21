import type { AssessmentSummary } from "./assessments";
import type { AnswerAttempts } from "./progress";
import { isDue, type ReviewRecord } from "./reviewSchedule";
import type { LearnerActivityEvidence, SelfAssessmentSignal } from "./objectiveEvidence";

export interface AssessmentLifecycleSnapshot {
  attempted?: boolean;
  revealed?: boolean;
  selfAssessment?: SelfAssessmentSignal;
}

export interface LearnerActivityEvidenceInput {
  assessments: readonly AssessmentSummary[];
  answers?: AnswerAttempts;
  lifecycle?: Readonly<Record<string, AssessmentLifecycleSnapshot>>;
  reviews?: Readonly<Record<string, ReviewRecord>>;
  now: string;
}

export function adaptLearnerActivityEvidence({ assessments, answers = {}, lifecycle = {}, reviews = {}, now }: LearnerActivityEvidenceInput): LearnerActivityEvidence[] {
  const activities: LearnerActivityEvidence[] = [];

  for (const assessment of assessments) {
    const responseItems = assessment.type === "question_set" && assessment.responseItems.length > 0
      ? assessment.responseItems
      : [{ key: assessment.responseItems[0]?.key ?? assessment.anchor, label: assessment.title }];

    responseItems.forEach((response, index) => {
      const activityKey = assessment.type === "question_set" ? `${assessment.id}:${index}` : assessment.id;
      const answer = answers[response.key];
      const state = lifecycle[activityKey] ?? lifecycle[response.key];
      const reviewRecord = reviews[activityKey];
      const activity: LearnerActivityEvidence = {
        activityKey,
        assessmentId: assessment.id,
        ...(assessment.type === "question_set" ? { responseKey: response.key } : {}),
        ...(state?.attempted !== undefined || answer ? { attempted: state?.attempted ?? true } : {}),
        ...(state?.revealed !== undefined || answer ? { revealed: state?.revealed ?? true } : {}),
        ...(answer ? { outcome: answer.correct ? "correct" : "incorrect" } : {}),
        ...(state?.selfAssessment ? { selfAssessment: state.selfAssessment } : {}),
        ...(reviewRecord ? { reviewRecord, due: isDue(reviewRecord, now) } : {})
      };
      activities.push(activity);
    });
  }

  return activities;
}
