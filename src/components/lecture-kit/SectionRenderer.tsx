import type { LectureSection, RenderBlock } from "@/lib/lecture-template/types";
import { renderMarkdownBlocks } from "@/lib/lecture-template/renderMarkdown";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { Comparison } from "./Comparison";
import { ConceptCard } from "./ConceptCard";
import { Diagram } from "./Diagram";
import { FreeResponse } from "./FreeResponse";
import { PracticeTask } from "./PracticeTask";
import { QuestionSet } from "./QuestionSet";
import { Quiz } from "./Quiz";
import { Quote } from "./Quote";
import { StepList } from "./StepList";
import { Summary } from "./Summary";
import { SectionCompletionToggle } from "./progress/SectionCompletionToggle";
import { SectionProgressFrame } from "./progress/SectionProgressFrame";

export function SectionRenderer({ section, index }: { section: LectureSection; index: number }) {
  return (
    <SectionProgressFrame anchor={section.anchor}>
      <p className="section-number">Section {index + 1}</p>
      <div className="section-heading-row">
        <h2 id={`${section.anchor}-heading`}>{section.title}</h2>
        <SectionCompletionToggle anchor={section.anchor} title={section.title} />
      </div>
      <RenderBlocks blocks={section.blocks} />
    </SectionProgressFrame>
  );
}

export function RenderBlocks({ blocks }: { blocks: RenderBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.kind !== "component") {
          return renderMarkdownBlocks([block])[0];
        }

        const component = block.component;
        switch (component.type) {
          case "callout":
            return <Callout key={index} component={component} />;
          case "concept_card":
            return <ConceptCard key={index} component={component} />;
          case "step_list":
            return <StepList key={index} component={component} />;
          case "code_block":
            return <CodeBlock key={index} component={component} />;
          case "comparison":
            return <Comparison key={index} component={component} />;
          case "summary":
            return <Summary key={index} component={component} />;
          case "quote":
            return <Quote key={index} component={component} />;
          case "quiz":
            return <Quiz key={index} component={component} />;
          case "question_set":
            return <QuestionSet key={index} component={component} />;
          case "free_response":
            return <FreeResponse key={index} component={component} />;
          case "practice_task":
            return <PracticeTask key={index} component={component} />;
          case "diagram":
            return <Diagram key={index} component={component} />;
          default:
            return assertNever(component);
        }
      })}
    </>
  );
}

function assertNever(value: never): never {
  throw new Error(`Unhandled lecture component: ${JSON.stringify(value)}`);
}
