import type { GlossaryEntry } from "@/lib/lecture-template/glossaryIndex";
import { GlossaryIndex } from "./GlossaryIndex";

export function CollectionGlossaryIndex({ entries }: { entries: GlossaryEntry[] }) {
  return <GlossaryIndex entries={entries} id="collection-glossary-index" title="Course glossary" scope="collection" />;
}
