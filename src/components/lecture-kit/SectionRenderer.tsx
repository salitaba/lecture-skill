import type { LectureSection, RenderBlock } from "@/lib/lecture-template/types";
import { glossaryAnchorsForSection } from "@/lib/lecture-template/glossaryIndex";
import { renderMarkdownBlocks } from "@/lib/lecture-template/renderMarkdown";
import { Accordion } from "./Accordion";
import { Callout } from "./Callout";
import { Checklist } from "./Checklist";
import { CodeBlock } from "./CodeBlock";
import { Comparison } from "./Comparison";
import { ConceptCard } from "./ConceptCard";
import { Diagram } from "./Diagram";
import { Flashcard } from "./Flashcard";
import { FreeResponse } from "./FreeResponse";
import { GlossaryTerm } from "./GlossaryTerm";
import { InstructorNote } from "./InstructorNote";
import { MistakeCorrection } from "./MistakeCorrection";
import { PracticeTask } from "./PracticeTask";
import { QuestionSet } from "./QuestionSet";
import { Quiz } from "./Quiz";
import { Quote } from "./Quote";
import { ResourceLinks } from "./ResourceLinks";
import { StepList } from "./StepList";
import { Summary } from "./Summary";
import { Tabs } from "./Tabs";
import { Timeline } from "./Timeline";
import { WorkedExample } from "./WorkedExample";
import { SectionCompletionToggle } from "./progress/SectionCompletionToggle";
import { SectionProgressFrame } from "./progress/SectionProgressFrame";

export function SectionRenderer({ section, index, lectureId }: { section: LectureSection; index: number; lectureId?: string }) {
  const glossaryAnchors = glossaryAnchorsForSection(section);

  return (
    <SectionProgressFrame anchor={section.anchor}>
      <p className="section-number">Section {index + 1}</p>
      <div className="section-heading-row">
        <h2 id={`${section.anchor}-heading`}>{section.title}</h2>
        <SectionCompletionToggle anchor={section.anchor} title={section.title} />
      </div>
      <RenderBlocks blocks={section.blocks} sectionAnchor={section.anchor} lectureId={lectureId} glossaryAnchors={glossaryAnchors} />
    </SectionProgressFrame>
  );
}

export function RenderBlocks({
  blocks,
  sectionAnchor,
  lectureId,
  glossaryAnchors
}: {
  blocks: RenderBlock[];
  sectionAnchor?: string;
  lectureId?: string;
  glossaryAnchors?: string[];
}) {
  const glossaryAnchorByBlockIndex = glossaryAnchorsPerBlock(blocks, glossaryAnchors);

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
          case "glossary_term":
            return <GlossaryTerm key={index} component={component} id={glossaryAnchorByBlockIndex[index]} />;
          case "tabs":
            return <Tabs key={index} component={component} />;
          case "accordion":
            return <Accordion key={index} component={component} />;
          case "timeline":
            return <Timeline key={index} component={component} />;
          case "checklist":
            return (
              <Checklist
                key={index}
                component={component}
                instanceId={`${lectureId ?? "lecture"}:${sectionAnchor ?? "section"}:${index}`}
              />
            );
          case "flashcard":
            return <Flashcard key={index} component={component} />;
          case "worked_example":
            return <WorkedExample key={index} component={component} />;
          case "mistake_correction":
            return <MistakeCorrection key={index} component={component} />;
          case "resource_links":
            return <ResourceLinks key={index} component={component} />;
          case "instructor_note":
            return <InstructorNote key={index} component={component} />;
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

function glossaryAnchorsPerBlock(blocks: RenderBlock[], glossaryAnchors: string[] | undefined): (string | undefined)[] {
  let occurrence = 0;
  return blocks.map((block) => {
    if (block.kind !== "component" || block.component.type !== "glossary_term") return undefined;
    const anchor = glossaryAnchors?.[occurrence];
    occurrence += 1;
    return anchor;
  });
}
