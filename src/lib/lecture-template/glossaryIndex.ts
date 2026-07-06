import { uniqueAnchors } from "./anchors";
import type { CollectionValidationResult, GlossaryTermComponent, LectureSection, LectureTemplate, RenderBlock } from "./types";

export interface GlossaryOccurrence {
  anchor: string;
  lectureSlug?: string;
  lectureTitle?: string;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  context?: string;
  aliases: string[];
  occurrences: GlossaryOccurrence[];
}

function isGlossaryTermBlock(block: RenderBlock): block is Extract<RenderBlock, { kind: "component" }> & {
  component: GlossaryTermComponent;
} {
  return block.kind === "component" && block.component.type === "glossary_term";
}

export function glossaryAnchorsForSection(section: LectureSection): string[] {
  const terms = section.blocks.filter(isGlossaryTermBlock).map((block) => block.component.term);
  return uniqueAnchors(
    terms.map((term) => `glossary ${term}`),
    "glossary-term"
  );
}

function collectRawGlossaryEntries(lecture: LectureTemplate, lectureSlug?: string, lectureTitle?: string): GlossaryEntry[] {
  const entries: GlossaryEntry[] = [];

  for (const section of lecture.sections) {
    const anchors = glossaryAnchorsForSection(section);
    let occurrenceIndex = 0;

    for (const block of section.blocks) {
      if (!isGlossaryTermBlock(block)) continue;
      const component = block.component;
      const anchor = anchors[occurrenceIndex];
      occurrenceIndex += 1;

      entries.push({
        term: component.term,
        definition: component.definition,
        context: component.context,
        aliases: component.aliases ?? [],
        occurrences: [{ anchor, lectureSlug, lectureTitle: lectureTitle ?? lecture.metadata.title }]
      });
    }
  }

  return entries;
}

export function dedupeAndSort(entries: GlossaryEntry[]): GlossaryEntry[] {
  const byTerm = new Map<string, GlossaryEntry>();

  for (const entry of entries) {
    const key = entry.term.trim().toLowerCase();
    const existing = byTerm.get(key);

    if (!existing) {
      byTerm.set(key, { ...entry, aliases: [...entry.aliases], occurrences: [...entry.occurrences] });
      continue;
    }

    existing.occurrences.push(...entry.occurrences);
    for (const alias of entry.aliases) {
      if (!existing.aliases.includes(alias)) existing.aliases.push(alias);
    }
    if (!existing.definition && entry.definition) existing.definition = entry.definition;
  }

  return Array.from(byTerm.values()).sort((a, b) => a.term.toLowerCase().localeCompare(b.term.toLowerCase()));
}

export function collectLectureGlossary(lecture: LectureTemplate, lectureSlug?: string): GlossaryEntry[] {
  return dedupeAndSort(collectRawGlossaryEntries(lecture, lectureSlug));
}

export function collectCollectionGlossary(validation: CollectionValidationResult): GlossaryEntry[] {
  const raw = validation.results.flatMap((result) => {
    if (!result.valid || !result.template) return [];
    return collectRawGlossaryEntries(result.template, result.slug);
  });
  return dedupeAndSort(raw);
}
