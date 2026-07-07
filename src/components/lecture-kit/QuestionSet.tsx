"use client";

import { useEffect, useMemo, useState } from "react";
import type { QuestionSetComponent } from "@/lib/lecture-template/types";
import { Card, DisclosureTrigger, LabeledSection, RadioOptionGroup, useDisclosure } from "@/components/component-kit";

export function QuestionSet({ component, enableShuffle = true }: { component: QuestionSetComponent; enableShuffle?: boolean }) {
  const [previewShuffleEnabled, setPreviewShuffleEnabled] = useState(false);
  const shuffledOptions = useMemo(
    () => component.questions.map((question) => shuffleOptions(question.options)),
    [component.questions]
  );
  const optionsByQuestion = previewShuffleEnabled && component.shuffle_options ? shuffledOptions : component.questions.map((question) => question.options);

  useEffect(() => {
    const timer = window.setTimeout(() => setPreviewShuffleEnabled(enableShuffle && window.location.protocol !== "file:"), 0);
    return () => window.clearTimeout(timer);
  }, [enableShuffle]);

  return (
    <Card id={component.anchor} altitude="emphasis" label="Assessment: Question set" title={component.title} className="assessment-card question-set-card">
      {component.instructions ? <p className="assessment-instructions">{component.instructions}</p> : null}
      <div className="question-set-list">
        {component.questions.map((question, questionIndex) => (
          <QuestionSetItem key={`${question.question}-${questionIndex}`} question={question} options={optionsByQuestion[questionIndex]} />
        ))}
      </div>
      <noscript className="assessment-noscript">
        Interactive answer reveal requires JavaScript. Printed output includes all answers and feedback.
      </noscript>
    </Card>
  );
}

function QuestionSetItem({ question, options }: { question: QuestionSetComponent["questions"][number]; options: string[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const { open: isRevealed, toggle, regionId: answerRegionId } = useDisclosure("answer");
  const answerLabelId = `${answerRegionId}-label`;
  const questionHeadingId = `${answerRegionId}-heading`;

  return (
    <LabeledSection label={question.question} headingId={questionHeadingId} className="assessment-region">
      <RadioOptionGroup
        name={answerRegionId}
        options={options}
        selected={selected}
        onSelect={setSelected}
        optionClassName="assessment-option"
        groupClassName="assessment-options"
        groupLabelledBy={questionHeadingId}
      />
      {selected ? (
        <p className="assessment-selection">Selected: {selected}</p>
      ) : (
        <p className="assessment-selection">Select an option before revealing the answer.</p>
      )}
      <DisclosureTrigger className="assessment-reveal-button" open={isRevealed} regionId={answerRegionId} onToggle={toggle}>
        {isRevealed ? "Hide feedback" : "Reveal answer"}
      </DisclosureTrigger>
      <div id={answerRegionId} className="assessment-hidden-region" hidden={!isRevealed} aria-labelledby={answerLabelId}>
        <p id={answerLabelId} className="assessment-region-label">
          Answer
        </p>
        <p>{question.answer}</p>
        {question.feedback ? <p>{question.feedback}</p> : null}
      </div>
    </LabeledSection>
  );
}

function shuffleOptions(options: string[]): string[] {
  const shuffled = [...options];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
}
