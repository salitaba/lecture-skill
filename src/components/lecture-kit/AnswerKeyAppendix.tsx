import { collectLectureAnswerKey } from "@/lib/lecture-template/assessments";
import type { LectureTemplate } from "@/lib/lecture-template/types";

export function AnswerKeyAppendix({ lecture }: { lecture: LectureTemplate }) {
  const entries = collectLectureAnswerKey(lecture);

  if (entries.length === 0) return null;

  return (
    <details className="lecture-panel answer-key-appendix" open>
      <summary>Answer key appendix</summary>
      <p>This appendix is for review and printing. Answers and guidance are pacing aids, not secure hidden content.</p>
      <ol>
        {entries.map((entry) => (
          <li key={entry.anchor} className="answer-key-entry">
            <h3>
              <a href={`#${entry.anchor}`}>{entry.title}</a>
            </h3>
            <p className="answer-key-meta">
              {labelForType(entry.type)} in {entry.sectionTitle}
            </p>
            {entry.answer ? (
              <p>
                <strong>Answer:</strong> {entry.answer}
              </p>
            ) : null}
            {entry.explanation ? <p>{entry.explanation}</p> : null}
            {entry.questions ? (
              <ol>
                {entry.questions.map((question, index) => (
                  <li key={`${entry.anchor}-${index}`}>
                    <p>{question.question}</p>
                    <p>
                      <strong>Answer:</strong> {question.answer}
                    </p>
                    {question.feedback ? <p>{question.feedback}</p> : null}
                  </li>
                ))}
              </ol>
            ) : null}
            {entry.guidance ? (
              <p>
                <strong>Guidance:</strong> {entry.guidance}
              </p>
            ) : null}
            {entry.hints ? (
              <>
                <p>
                  <strong>Hints:</strong>
                </p>
                <ul>
                  {entry.hints.map((hint, index) => (
                    <li key={`${entry.anchor}-hint-${index}`}>{hint}</li>
                  ))}
                </ul>
              </>
            ) : null}
            {entry.solution ? (
              <p>
                <strong>Solution:</strong> {entry.solution}
              </p>
            ) : null}
            {entry.rubric ? (
              <>
                <p>
                  <strong>Rubric:</strong>
                </p>
                <ul>
                  {entry.rubric.map((item, index) => (
                    <li key={`${entry.anchor}-rubric-${index}`}>
                      {item.criterion}: {item.expected}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </details>
  );
}

function labelForType(type: string): string {
  if (type === "quiz") return "Quiz";
  if (type === "question_set") return "Question set";
  if (type === "free_response") return "Free response";
  return "Practice task";
}
