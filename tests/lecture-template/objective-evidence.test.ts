import { describe, expect, it } from "vitest";
import { buildObjectiveEvidence, type LearnerActivityEvidence } from "../../src/lib/lecture-template/objectiveEvidence";
import type { AssessmentSummary } from "../../src/lib/lecture-template/assessments";
import type { LearningObjective } from "../../src/lib/lecture-template/types";

const objectives: LearningObjective[] = [
  { id: "first", text: "Explain first", isExplicit: true, textLocator: { line: 1 } },
  { id: "second", text: "Explain second", isExplicit: true, textLocator: { line: 2 } },
  { id: "unlinked", text: "Explain unlinked", isExplicit: true, textLocator: { line: 3 } }
];

const assessments: AssessmentSummary[] = [
  {
    id: "quiz-one",
    anchor: "quiz-one-anchor",
    type: "quiz",
    title: "First check",
    lectureSlug: "01-first",
    sectionTitle: "First section",
    sectionAnchor: "first-section",
    evaluationMode: "choice",
    supportsAnswerReview: true,
    supportsAnswerKey: true,
    isExplicitId: true,
    objectiveRefs: ["first"],
    responseItems: []
  },
  {
    id: "set-one",
    anchor: "set-one-anchor",
    type: "question_set",
    title: "Set",
    lectureSlug: "01-first",
    sectionTitle: "First section",
    sectionAnchor: "first-section",
    evaluationMode: "choice",
    supportsAnswerReview: true,
    supportsAnswerKey: true,
    isExplicitId: true,
    objectiveRefs: ["second"],
    responseItems: [{ key: "q0", label: "Question 1" }, { key: "q1", label: "Question 2" }]
  }
];

describe("objective evidence", () => {
  it("distinguishes unassessed and not-started objectives", () => {
    const evidence = buildObjectiveEvidence({ objectives, assessments });
    expect(evidence.map((item) => item.status)).toEqual(["not_started", "not_started", "not_assessed"]);
    expect(evidence[1]?.activities.map((activity) => activity.activityKey)).toEqual(["set-one:0", "set-one:1"]);
  });

  it("applies review recommendation before practice and demonstration", () => {
    const activities: LearnerActivityEvidence[] = [
      { activityKey: "quiz-one", assessmentId: "quiz-one", attempted: true, revealed: true, outcome: "correct", due: true },
      { activityKey: "set-one:0", assessmentId: "set-one", responseKey: "q0", attempted: true, revealed: true, outcome: "correct" },
      { activityKey: "set-one:1", assessmentId: "set-one", responseKey: "q1", attempted: false }
    ];
    const evidence = buildObjectiveEvidence({ objectives, assessments, activities });
    expect(evidence[0]?.status).toBe("review_recommended");
    expect(evidence[1]?.status).toBe("practicing");
  });

  it("marks all-positive completed activities as demonstrated without exposing answers", () => {
    const activities: LearnerActivityEvidence[] = [
      { activityKey: "quiz-one", assessmentId: "quiz-one", attempted: true, revealed: true, outcome: "correct" },
      { activityKey: "set-one:0", assessmentId: "set-one", responseKey: "q0", attempted: true, revealed: true, outcome: "correct" },
      { activityKey: "set-one:1", assessmentId: "set-one", responseKey: "q1", attempted: true, revealed: true, outcome: "correct" }
    ];
    const evidence = buildObjectiveEvidence({ objectives, assessments, activities });
    expect(evidence[0]?.status).toBe("demonstrated");
    expect(evidence[1]?.status).toBe("demonstrated");
    expect(JSON.stringify(evidence)).not.toContain("answer");
  });

  it("treats self-assessment needs-review and unknown references safely", () => {
    const freeResponse: AssessmentSummary = {
      ...assessments[0],
      id: "free-response",
      type: "free_response",
      title: "Explain",
      objectiveRefs: ["first", "unknown"]
    };
    const evidence = buildObjectiveEvidence({
      objectives,
      assessments: [freeResponse],
      activities: [{ activityKey: "free-response", assessmentId: "free-response", revealed: true, selfAssessment: "needs_review" }]
    });
    expect(evidence[0]?.status).toBe("review_recommended");
    expect(evidence[1]?.status).toBe("not_assessed");
  });

  it("treats a revealed choice without an answer as practicing", () => {
    const evidence = buildObjectiveEvidence({
      objectives: [objectives[0]!],
      assessments: [assessments[0]!],
      activities: [{ activityKey: "quiz-one", assessmentId: "quiz-one", revealed: true }]
    });
    expect(evidence[0]?.status).toBe("practicing");
  });
});
