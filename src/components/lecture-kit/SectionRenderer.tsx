import type { LectureSection, RenderBlock } from "@/lib/lecture-template/types";
import { renderMarkdownBlocks } from "@/lib/lecture-template/renderMarkdown";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { Comparison } from "./Comparison";
import { ConceptCard } from "./ConceptCard";
import { Quiz } from "./Quiz";
import { Quote } from "./Quote";
import { StepList } from "./StepList";
import { Summary } from "./Summary";

export function SectionRenderer({ section, index }: { section: LectureSection; index: number }) {
  return (
    <section id={section.anchor} className="lecture-section" aria-labelledby={`${section.anchor}-heading`}>
      <p className="section-number">Section {index + 1}</p>
      <h2 id={`${section.anchor}-heading`}>{section.title}</h2>
      <RenderBlocks blocks={section.blocks} />
    </section>
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
