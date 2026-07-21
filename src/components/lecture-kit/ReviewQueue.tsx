"use client";

import { useMemo } from "react";
import { Card } from "@/components/component-kit";
import { activityKeysForAssessment } from "@/lib/lecture-template/objectiveEvidence";
import { dueReviewQueue, type ReviewRecord } from "@/lib/lecture-template/reviewSchedule";
import type { AssessmentSummary } from "@/lib/lecture-template/assessments";
import type { LearningObjective } from "@/lib/lecture-template/types";
import { useReviewOptional } from "./progress/ReviewProvider";

export interface ReviewQueueProps {
  objectives: readonly LearningObjective[];
  assessments: readonly AssessmentSummary[];
  baseHref?: string;
  title?: string;
  id?: string;
  titleId?: string;
  now?: string;
  records?: Readonly<Record<string, ReviewRecord>>;
  loaded?: boolean;
  storageAvailable?: boolean;
  emptyStateHref?: string;
  emptyStateLabel?: string;
  scopes?: readonly ReviewQueueScope[];
  compactEmpty?: boolean;
}

export interface ReviewQueueScope {
  id: string;
  title?: string;
  baseHref?: string;
  objectives: readonly LearningObjective[];
  assessments: readonly AssessmentSummary[];
  records: Readonly<Record<string, ReviewRecord>>;
}

interface DueReviewQueueItem {
  record: ReviewRecord;
  scope: ReviewQueueScope;
  item: { assessment: AssessmentSummary; responseLabel?: string; objectiveLabels: string[] };
}

export function ReviewQueue({ objectives, assessments, baseHref = "", title = "Review queue", id = "review-queue", titleId, now = new Date().toISOString(), records, loaded, storageAvailable, emptyStateHref, emptyStateLabel = "Continue learning", scopes, compactEmpty = false }: ReviewQueueProps) {
  const review = useReviewOptional();
  const contextRecords = review?.records;
  const isLoaded = loaded ?? review?.loaded ?? false;
  const isStorageAvailable = storageAvailable ?? review?.storageAvailable ?? true;
  const resolvedTitleId = titleId ?? `${id}-title`;
  const queueScopes = useMemo<readonly ReviewQueueScope[]>(() => scopes ?? [{
    id: "single-lecture",
    baseHref,
    objectives,
    assessments,
    records: records ?? contextRecords ?? {}
  }], [assessments, baseHref, contextRecords, objectives, records, scopes]);
  const due = useMemo<DueReviewQueueItem[]>(() => queueScopes.flatMap((scope) => {
    const authoredOrder = scope.assessments.flatMap(activityKeysForAssessment);
    const byActivity = new Map<string, { assessment: AssessmentSummary; responseLabel?: string; objectiveLabels: string[] }>();
    for (const assessment of scope.assessments) {
      const refs = new Set(assessment.objectiveRefs ?? []);
      const objectiveLabels = scope.objectives.filter((objective) => refs.has(objective.id)).map((objective) => objective.text);
      activityKeysForAssessment(assessment).forEach((activityKey, index) => {
        byActivity.set(activityKey, { assessment, responseLabel: assessment.responseItems[index]?.label, objectiveLabels });
      });
    }
    return dueReviewQueue(Object.values(scope.records), authoredOrder, now).flatMap((record) => {
      const item = byActivity.get(record.activityKey);
      return item ? [{ record, scope, item }] : [];
    });
  }), [now, queueScopes]);
  const groupedDue = useMemo(() => {
    const groups = new Map<string, { scope: ReviewQueueScope; items: DueReviewQueueItem[] }>();
    for (const item of due) {
      const existing = groups.get(item.scope.id);
      if (existing) existing.items.push(item);
      else groups.set(item.scope.id, { scope: item.scope, items: [item] });
    }
    return Array.from(groups.values());
  }, [due]);

  return (
    <Card as="section" role="region" className={`review-queue${compactEmpty && due.length === 0 ? " review-queue-compact-empty" : ""}`} id={id} titleId={resolvedTitleId} label="Local review" title={title}>
      <p className="review-queue-intro">Return to the authored activity when local review metadata says it is due.</p>
      {!isStorageAvailable ? <p className="review-storage-notice" role="status">Review choices are available for this session but cannot be saved on this device.</p> : null}
      {!isLoaded ? <p className="review-queue-empty" role="status" aria-live="polite">Checking saved review timing on this device…</p> : due.length === 0 ? (
        <div className="review-queue-empty-state">
          <p className="review-queue-empty" role="status" aria-live="polite">Nothing is due right now.</p>
          {emptyStateHref ? <a className="review-queue-empty-action" href={emptyStateHref}>{emptyStateLabel}</a> : null}
        </div>
      ) : (
        <div className="review-queue-groups">
          {groupedDue.map(({ scope, items }) => (
            <section key={scope.id} className="review-queue-group" aria-labelledby={scope.title ? `${id}-${scope.id}-title` : undefined}>
              {scopes && scope.title ? <h4 id={`${id}-${scope.id}-title`} className="review-queue-group-title">{scope.title}</h4> : null}
              <ol className="review-queue-list">
                {items.map(({ record, item }) => (
                  <li key={`${scope.id}:${record.activityKey}`} className="review-queue-item">
                    <div>
                      <a href={`${scope.baseHref ?? ""}#${item.assessment.anchor}`}><strong>{item.responseLabel ?? item.assessment.title}</strong></a>
                      <span>{scope.title ? `${scope.title} · ` : ""}{item.assessment.sectionTitle}</span>
                      {item.objectiveLabels.map((label) => <small key={label}>{label}</small>)}
                    </div>
                    <span className="review-queue-due">Due now</span>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </Card>
  );
}
