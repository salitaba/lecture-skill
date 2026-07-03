import type { LectureSection, RenderBlock } from "@/lib/lecture-template/types";
import { renderMarkdownBlocks } from "@/lib/lecture-template/renderMarkdown";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { ConceptCard } from "./ConceptCard";
import { StepList } from "./StepList";

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
        if (component.type === "callout") return <Callout key={index} component={component} />;
        if (component.type === "concept_card") return <ConceptCard key={index} component={component} />;
        if (component.type === "step_list") return <StepList key={index} component={component} />;
        if (component.type === "code_block") return <CodeBlock key={index} component={component} />;
        return null;
      })}
    </>
  );
}
