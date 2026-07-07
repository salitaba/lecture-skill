import type { ReactNode } from "react";

export interface LabeledSectionProps {
  label: ReactNode;
  /** Sets an id on the heading and, when present, `aria-labelledby` on the section itself, making it a named landmark region. */
  headingId?: string;
  className?: string;
  children: ReactNode;
}

export function LabeledSection({ label, headingId, className, children }: LabeledSectionProps) {
  const classes = ["labeled-section", className].filter(Boolean).join(" ");

  return (
    <section className={classes} aria-labelledby={headingId}>
      <h4 id={headingId}>{label}</h4>
      {children}
    </section>
  );
}
