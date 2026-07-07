import type { ComponentPropsWithoutRef } from "react";

export type ButtonVariant = "primary" | "ghost";
export type ButtonSize = "default" | "compact" | "lg";
export type ButtonTone = "default" | "muted" | "text";

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  tone?: ButtonTone;
}

type ButtonAsButton = ButtonOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonOwnProps> & { as?: "button" };

type ButtonAsAnchor = ButtonOwnProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof ButtonOwnProps> & { as: "a" };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

function resolveButtonClassName(variant: ButtonVariant, size: ButtonSize, tone: ButtonTone): string {
  if (variant === "primary") {
    if (size === "compact") return "btn-primary-compact";
    if (size === "lg") return "btn-primary-lg";
    return "btn-primary";
  }
  if (tone === "muted") return "btn-ghost-muted";
  if (tone === "text") return "btn-ghost-text";
  return "btn-ghost";
}

export function Button({ as, variant = "primary", size = "default", tone = "default", className, ...rest }: ButtonProps) {
  const classes = [resolveButtonClassName(variant, size, tone), className].filter(Boolean).join(" ");

  if (as === "a") {
    return <a className={classes} {...(rest as ComponentPropsWithoutRef<"a">)} />;
  }

  return <button type="button" className={classes} {...(rest as ComponentPropsWithoutRef<"button">)} />;
}
