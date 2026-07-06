import type { LectureSection } from "@/lib/lecture-template/types";
import { LearningPathNavigation } from "./LearningPathNavigation";

export function SectionNavigation({ sections }: { sections: LectureSection[] }) {
  return <LearningPathNavigation sections={sections} />;
}
