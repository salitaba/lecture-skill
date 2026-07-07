import type { ReactNode } from "react";

export type CardAltitude = "quiet" | "card" | "emphasis";

export interface CardProps {
  as?: "aside" | "figure";
  id?: string;
  altitude?: CardAltitude;
  label?: ReactNode;
  title?: ReactNode;
  className: string;
  /** Escape hatch for wrapper-level DOM attributes (e.g. `data-enhanced`) a caller needs that aren't otherwise part of this primitive's contract. */
  attributes?: Record<string, string>;
  children: ReactNode;
}

export function Card({ as = "aside", id, altitude, label, title, className, attributes, children }: CardProps) {
  const classes = ["lecture-component", altitude ? `surface-${altitude}` : null, className].filter(Boolean).join(" ");
  const Element = as;

  return (
    <Element id={id} className={classes} {...attributes}>
      {label ? <p className="component-label">{label}</p> : null}
      {title ? <h3>{title}</h3> : null}
      {children}
    </Element>
  );
}
