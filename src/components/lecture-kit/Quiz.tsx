import { useId } from "react";
import type { QuizComponent } from "@/lib/lecture-template/types";

export function Quiz({ component }: { component: QuizComponent }) {
  const answerLabelId = useId();

  return (
    <aside className="lecture-component quiz-card">
      <p className="component-label">Quiz: Knowledge check</p>
      <h3 className="quiz-question">{component.question}</h3>
      <ol className="quiz-options">
        {component.options.map((option, index) => (
          <li key={`${option}-${index}`}>{option}</li>
        ))}
      </ol>
      <div className="quiz-answer" aria-labelledby={answerLabelId}>
        <p id={answerLabelId} className="quiz-answer-label">
          Static answer key
        </p>
        <p className="quiz-answer-value">{component.answer}</p>
        {component.explanation ? <p className="quiz-explanation">{component.explanation}</p> : null}
      </div>
    </aside>
  );
}
