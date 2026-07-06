import type { AssessmentSummary } from "@/lib/lecture-template/assessments";

export function AssessmentIndexDisclosure({
  assessments,
  id = "assessment-index"
}: {
  assessments: AssessmentSummary[];
  id?: string;
}) {
  const count = assessments.length;
  const unit = count === 1 ? "assessment" : "assessments";

  return (
    <details className="assessment-index-disclosure" id={id}>
      <summary>
        <span className="assessment-index-disclosure-label-closed">Show {count} {unit}</span>
        <span className="assessment-index-disclosure-label-open">Hide {count} {unit}</span>
      </summary>
      {count > 0 ? (
        <ol className="assessment-group-list">
          {groupAssessmentsByLecture(assessments).map(({ lectureTitle, lectureSlug, items }) => (
            <li key={lectureSlug ?? lectureTitle} className="assessment-group">
              <h3 className="assessment-group-title">{lectureTitle}</h3>
              <ol className="assessment-group-items">
                {items.map((assessment) => (
                  <li key={`${assessment.lectureSlug}-${assessment.anchor}`}>
                    <a href={`/lectures/${assessment.lectureSlug}#${assessment.anchor}`} title={assessment.title}>
                      {truncateTitle(assessment.title)}
                    </a>
                    <span className="assessment-group-meta">{labelForAssessment(assessment.type)}</span>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      ) : (
        <p>No assessments found in valid lectures.</p>
      )}
    </details>
  );
}

function labelForAssessment(type: string): string {
  if (type === "quiz") return "Quiz";
  if (type === "question_set") return "Question set";
  if (type === "free_response") return "Free response";
  return "Practice task";
}

function truncateTitle(title: string): string {
  return title.length > 60 ? title.slice(0, 57) + "…" : title;
}

interface AssessmentGroup {
  lectureTitle: string;
  lectureSlug: string | undefined;
  items: AssessmentSummary[];
}

function groupAssessmentsByLecture(assessments: AssessmentSummary[]): AssessmentGroup[] {
  const map = new Map<string, AssessmentGroup>();
  for (const assessment of assessments) {
    const key = assessment.lectureSlug ?? assessment.lectureTitle ?? "unknown";
    if (!map.has(key)) {
      map.set(key, { lectureTitle: assessment.lectureTitle ?? key, lectureSlug: assessment.lectureSlug, items: [] });
    }
    map.get(key)!.items.push(assessment);
  }
  return Array.from(map.values());
}
