"use client";

import { type ReactNode } from "react";
import { useProgressOptional } from "./ProgressProvider";

export function SectionProgressFrame({
  anchor,
  children
}: {
  anchor: string;
  children: ReactNode;
}) {
  const progress = useProgressOptional()?.progress ?? {};
  const completed = progress[anchor] === true;

  return (
    <section
      id={anchor}
      className={completed ? "lecture-section lecture-section-complete" : "lecture-section"}
      aria-labelledby={`${anchor}-heading`}
      data-progress-complete={completed ? "true" : "false"}
    >
      {children}
    </section>
  );
}
