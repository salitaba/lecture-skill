"use client";

import { useMemo } from "react";
import { Card } from "@/components/component-kit";
import { adaptLearnerActivityEvidence } from "@/lib/lecture-template/learnerActivityEvidence";
import { buildObjectiveEvidence, type ObjectiveEvidenceStatus } from "@/lib/lecture-template/objectiveEvidence";
import type { AssessmentSummary } from "@/lib/lecture-template/assessments";
import type { LearningObjective } from "@/lib/lecture-template/types";
import { useProgressOptional } from "./progress/ProgressProvider";
import { useReviewOptional } from "./progress/ReviewProvider";

export function ObjectiveEvidenceMap({ objectives, assessments }: { objectives: readonly LearningObjective[]; assessments: readonly AssessmentSummary[] }) {
  const progress = useProgressOptional();
  const review = useReviewOptional();
  const now = new Date().toISOString();
  const assessmentById = useMemo(() => new Map(assessments.map((assessment) => [assessment.id, assessment])), [assessments]);
  const evidence = useMemo(() => {
    return buildObjectiveEvidence({
      objectives,
      assessments,
      activities: adaptLearnerActivityEvidence({
        assessments,
        answers: progress?.answers ?? {},
        lifecycle: review?.activityState ?? {},
        reviews: review?.records ?? {},
        now
      })
    });
  }, [assessments, objectives, progress, review, now]);
  const hydrated = Boolean(progress?.loaded && progress.answersLoaded && review?.loaded);

  return (
    <Card as="section" role="region" className="objective-evidence-map" id="objective-evidence" titleId="objective-evidence-title" label="Learning outcomes" title="See what your practice is showing">
      <p className="objective-evidence-intro">These are evidence signals from your local activity, not grades or permanent mastery claims.</p>
      <p className="sr-only" role="status" aria-live="polite">{hydrated ? "Learning outcome evidence is ready." : "Checking local learning activity."}</p>
      <ul className="objective-evidence-list">
        {evidence.map((item) => (
          <li key={item.objective.id} className="objective-evidence-item">
            <div className="objective-evidence-heading">
              <strong>{item.objective.text}</strong>
              <span className={`objective-evidence-status objective-evidence-status-${item.status}`}>{hydrated ? statusLabel(item.status) : "Checking local activity"}</span>
            </div>
            {item.links.length > 0 ? (
              <ul className="objective-evidence-links">
                {item.links.map((link) => {
                  const assessment = assessmentById.get(link.assessmentId);
                  const responseLabel = link.responseKey ? assessment?.responseItems.find((response) => response.key === link.responseKey)?.label : undefined;
                  const activityLabel = responseLabel ?? assessment?.title;
                  const linkLabel = activityLabel ? `Review ${link.sectionTitle}: ${activityLabel}` : `Review ${link.sectionTitle}`;
                  return <li key={link.activityKey}><a href={`#${link.assessmentAnchor}`}>{linkLabel}</a></li>;
                })}
              </ul>
            ) : <p className="objective-evidence-muted">No linked practice yet.</p>}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function statusLabel(status: ObjectiveEvidenceStatus): string {
  if (status === "not_assessed") return "No linked practice";
  if (status === "not_started") return "Not started";
  if (status === "practicing") return "Practicing";
  if (status === "review_recommended") return "Review recommended";
  return "Demonstrated recently";
}
