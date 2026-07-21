"use client";

import { useMemo } from "react";
import { Button, Card } from "@/components/component-kit";
import { adaptLearnerActivityEvidence } from "@/lib/lecture-template/learnerActivityEvidence";
import { activityKeysForAssessment, buildObjectiveEvidence } from "@/lib/lecture-template/objectiveEvidence";
import { dueReviewQueue, isDue } from "@/lib/lecture-template/reviewSchedule";
import type { AssessmentSummary } from "@/lib/lecture-template/assessments";
import type { LearningObjective } from "@/lib/lecture-template/types";
import { useProgressOptional } from "./progress/ProgressProvider";
import { useReviewOptional } from "./progress/ReviewProvider";
import { useCollectionProgress } from "./progress/CollectionProgressProvider";
import { useCollectionReview } from "./progress/CollectionReviewProvider";
import type { CollectionReviewRegistryEntry } from "@/lib/lecture-template/collection";
import type { ProgressLecture } from "@/lib/lecture-template/progress";
import { calculateResumeTarget } from "@/lib/lecture-template/resumeTarget";

export interface LearnerDashboardSummaryProps {
  objectives: readonly LearningObjective[];
  assessments: readonly AssessmentSummary[];
  firstActionHref: string;
  firstActionLabel?: string;
  title?: string;
}

export function LearnerDashboardSummary({ objectives, assessments, firstActionHref, firstActionLabel = "Continue learning", title = "Your learning loop" }: LearnerDashboardSummaryProps) {
  const progress = useProgressOptional();
  const review = useReviewOptional();
  const now = new Date().toISOString();
  const evidence = useMemo(() => {
    if (!progress || !review) return [];
    const activities = adaptLearnerActivityEvidence({ assessments, answers: progress.answers, lifecycle: review.activityState, reviews: review.records, now });
    return buildObjectiveEvidence({ objectives, assessments, activities });
  }, [assessments, objectives, progress, review, now]);
  const reviewCount = evidence.filter((item) => item.status === "review_recommended").length;
  const dueCount = review ? Object.values(review.records).filter((record) => isDue(record, now)).length : 0;
  const hydrated = Boolean(progress?.loaded && progress.answersLoaded && review?.loaded);
  const actionHref = hydrated && dueCount > 0
    ? "#review-queue"
    : progress?.resumeTarget
      ? `#${progress.resumeTarget.anchor}`
      : firstActionHref;
  const actionLabel = hydrated && dueCount > 0
    ? "Review due items"
    : progress?.resumeTarget
      ? "Continue from where you stopped"
      : firstActionLabel;
  const showResumePromptNote = hydrated && dueCount === 0 && Boolean(progress?.resumeTarget);

  return (
    <Card as="section" role="region" className="learner-dashboard-summary" id="learner-dashboard" titleId="learner-dashboard-title" label="Learner dashboard" title={title}>
      <div className="learner-dashboard-grid" data-dashboard-state={hydrated ? "ready" : "hydrating"}>
        <div>
          <p className="learner-dashboard-summary-copy" role="status" aria-live="polite">
            {hydrated
              ? reviewCount > 0
                ? `${reviewCount} learning outcome${reviewCount === 1 ? "" : "s"} suggest a return visit.`
                : "Keep reading, practice when ready, and return when a review is due."
              : "Checking saved progress on this device…"}
          </p>
          {showResumePromptNote ? (
            <p className="learner-dashboard-action-note">
              Use the resume prompt above to continue from your last spot.
            </p>
          ) : (
            <Button as="a" href={actionHref} size="compact">{actionLabel}</Button>
          )}
        </div>
        <div className="learner-dashboard-stats" role="group" aria-label="Learning summary">
          <div><strong>{hydrated ? `${progress?.completedSections ?? 0}/${progress?.totalSections ?? 0}` : "—"}</strong><span>sections read</span></div>
          <div><strong>{hydrated ? dueCount : "—"}</strong><span>reviews due</span></div>
          <div><strong>{hydrated ? reviewCount : "—"}</strong><span>review suggestions</span></div>
        </div>
      </div>
    </Card>
  );
}

export function CollectionLearnerDashboardSummary({ registry, lectures }: { registry: readonly CollectionReviewRegistryEntry[]; lectures: readonly ProgressLecture[] }) {
  const progress = useCollectionProgress();
  const review = useCollectionReview();
  const reviewSummary = useMemo(() => {
    const now = new Date().toISOString();
    return registry.reduce((summary, entry) => {
      const records = review.recordsForLecture(entry.lectureId);
      const due = dueReviewQueue(records ? Object.values(records) : [], entry.assessments.flatMap(activityKeysForAssessment), now);
      const dueKeys = new Set(due.map((record) => record.activityKey));
      const recommendedObjectiveIds = new Set(
        entry.assessments.flatMap((assessment) => {
          const hasDueActivity = activityKeysForAssessment(assessment).some((activityKey) => dueKeys.has(activityKey));
          return hasDueActivity ? assessment.objectiveRefs ?? [] : [];
        })
      );
      return {
        dueCount: summary.dueCount + due.length,
        reviewSuggestions: summary.reviewSuggestions + recommendedObjectiveIds.size
      };
    }, { dueCount: 0, reviewSuggestions: 0 });
  }, [registry, review]);
  const dueCount = reviewSummary.dueCount;
  const target = calculateResumeTarget(progress.progress, lectures);
  const hydrated = progress.loaded && review.loaded;
  const reviewSuggestions = reviewSummary.reviewSuggestions;

  return (
    <Card as="section" role="region" className="learner-dashboard-summary collection-learner-dashboard" id="course-learner-dashboard" titleId="course-learner-dashboard-title" label="Learner dashboard" title="Your course learning loop">
      <div className="learner-dashboard-grid" data-dashboard-state={hydrated ? "ready" : "hydrating"}>
        <div>
          <p className="learner-dashboard-summary-copy" role="status" aria-live="polite">{hydrated ? (reviewSuggestions > 0 ? `${reviewSuggestions} review suggestion${reviewSuggestions === 1 ? "" : "s"} across the course.` : "Choose the next lecture and build your own review rhythm.") : "Checking saved progress on this device…"}</p>
          <Button as="a" href={hydrated && dueCount > 0 ? "#course-review-queue" : target.href} size="compact">{hydrated && dueCount > 0 ? "Review due items" : hydrated ? target.label : "Start course"}</Button>
        </div>
        <div className="learner-dashboard-stats" role="group" aria-label="Course learning summary">
          <div><strong>{hydrated ? `${progress.completedSections}/${progress.totalSections}` : "—"}</strong><span>sections read</span></div>
          <div><strong>{hydrated ? dueCount : "—"}</strong><span>reviews due</span></div>
          <div><strong>{hydrated ? reviewSuggestions : "—"}</strong><span>review suggestions</span></div>
        </div>
      </div>
    </Card>
  );
}
