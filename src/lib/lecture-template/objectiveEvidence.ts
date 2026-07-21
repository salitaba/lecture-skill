import type { AssessmentSummary } from "./assessments";
import type { LearningObjective } from "./types";
import type { ReviewRecord } from "./reviewSchedule";

export type ObjectiveEvidenceStatus = "not_started" | "practicing" | "review_recommended" | "demonstrated" | "not_assessed";
export type LearnerOutcome = "correct" | "incorrect";
export type SelfAssessmentSignal = "understood" | "needs_review";

export interface LearnerActivityEvidence {
  activityKey: string;
  assessmentId: string;
  responseKey?: string;
  attempted?: boolean;
  revealed?: boolean;
  outcome?: LearnerOutcome;
  selfAssessment?: SelfAssessmentSignal;
  reviewRecord?: ReviewRecord;
  due?: boolean;
}

export interface ObjectiveEvidenceLink {
  activityKey: string;
  assessmentId: string;
  responseKey?: string;
  lectureSlug?: string;
  sectionTitle: string;
  sectionAnchor: string;
  assessmentAnchor: string;
}

export interface ObjectiveEvidenceActivity extends ObjectiveEvidenceLink {
  attempted: boolean;
  revealed: boolean;
  outcome?: LearnerOutcome;
  selfAssessment?: SelfAssessmentSignal;
  due: boolean;
}

export interface ObjectiveEvidence {
  objective: LearningObjective;
  status: ObjectiveEvidenceStatus;
  links: ObjectiveEvidenceLink[];
  activities: ObjectiveEvidenceActivity[];
}

export interface ObjectiveEvidenceInput {
  objectives: readonly LearningObjective[];
  assessments: readonly AssessmentSummary[];
  activities?: readonly LearnerActivityEvidence[];
}

export function buildObjectiveEvidence({ objectives, assessments, activities = [] }: ObjectiveEvidenceInput): ObjectiveEvidence[] {
  const activityByKey = new Map(activities.map((activity) => [activity.activityKey, activity]));
  return objectives.map((objective) => {
    const linkedAssessments = assessments.filter((assessment) => assessment.objectiveRefs?.includes(objective.id));
    const links = linkedAssessments.flatMap((assessment) => assessmentActivities(assessment).map((activity) => toLink(assessment, activity)));
    const evidenceActivities = links.map((link) => {
      const activity = activityByKey.get(link.activityKey);
      return {
        ...link,
        attempted: activity?.attempted === true,
        revealed: activity?.revealed === true,
        ...(activity?.outcome ? { outcome: activity.outcome } : {}),
        ...(activity?.selfAssessment ? { selfAssessment: activity.selfAssessment } : {}),
        due: activity?.due === true
      } satisfies ObjectiveEvidenceActivity;
    });

    return {
      objective,
      status: evidenceStatus(evidenceActivities, links.length > 0),
      links,
      activities: evidenceActivities
    };
  });
}

export function activityKeysForAssessment(assessment: AssessmentSummary): string[] {
  return assessmentActivities(assessment).map((activity) => activity.activityKey);
}

function assessmentActivities(assessment: AssessmentSummary): Array<{ activityKey: string; responseKey?: string }> {
  if (assessment.type !== "question_set") return [{ activityKey: assessment.id }];
  if (assessment.responseItems.length === 0) return [{ activityKey: assessment.id }];
  return assessment.responseItems.map((item, index) => ({ activityKey: `${assessment.id}:${index}`, responseKey: item.key }));
}

function toLink(assessment: AssessmentSummary, activity: { activityKey: string; responseKey?: string }): ObjectiveEvidenceLink {
  return {
    activityKey: activity.activityKey,
    assessmentId: assessment.id,
    ...(activity.responseKey ? { responseKey: activity.responseKey } : {}),
    ...(assessment.lectureSlug ? { lectureSlug: assessment.lectureSlug } : {}),
    sectionTitle: assessment.sectionTitle,
    sectionAnchor: assessment.sectionAnchor,
    assessmentAnchor: assessment.anchor
  };
}

function evidenceStatus(activities: readonly ObjectiveEvidenceActivity[], hasLinks: boolean): ObjectiveEvidenceStatus {
  if (!hasLinks) return "not_assessed";
  if (activities.some((activity) => activity.due || activity.outcome === "incorrect" || activity.selfAssessment === "needs_review")) {
    return "review_recommended";
  }
  if (activities.some((activity) => !isCompletedPositive(activity))) return activities.some(hasLearnerActivity) ? "practicing" : "not_started";
  return "demonstrated";
}

function hasLearnerActivity(activity: ObjectiveEvidenceActivity): boolean {
  return activity.attempted || activity.revealed || activity.selfAssessment !== undefined || activity.due;
}

function isCompletedPositive(activity: ObjectiveEvidenceActivity): boolean {
  if (activity.outcome === "correct" || activity.selfAssessment === "understood") return true;
  return false;
}
