import type { LectureSection } from "@/lib/lecture-template/types";
import { LearningPathNavigation } from "./LearningPathNavigation";

export function SectionNavigation({
  sections,
  sectionMinutes
}: {
  sections: LectureSection[];
  sectionMinutes?: Record<string, number>;
}) {
  return <LearningPathNavigation sections={sections} sectionMinutes={sectionMinutes} />;
}
