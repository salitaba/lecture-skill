"use client";

import { useMemo } from "react";
import { useCollectionProgress } from "./progress/CollectionProgressProvider";
import { calculateResumeTarget } from "@/lib/lecture-template/resumeTarget";
import type { ProgressLecture } from "@/lib/lecture-template/progress";
import { Button } from "@/components/component-kit";

export function CollectionPrimaryAction({ lectures }: { lectures: ProgressLecture[] }) {
  const { progress, loaded } = useCollectionProgress();
  const target = useMemo(() => calculateResumeTarget(progress, lectures), [progress, lectures]);

  if (!loaded) {
    return (
      <Button as="a" size="lg" className="collection-primary-action" href={lectures.length > 0 ? `/lectures/${lectures[0].slug}` : "/"}>
        Start course
      </Button>
    );
  }

  return (
    <Button as="a" size="lg" className="collection-primary-action" href={target.href}>
      {target.label}
    </Button>
  );
}
