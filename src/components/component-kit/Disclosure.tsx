"use client";

import { useId, useState, type ReactNode } from "react";
import { Button, type ButtonSize, type ButtonTone, type ButtonVariant } from "./Button";

export interface DisclosureState {
  open: boolean;
  toggle: () => void;
  regionId: string;
}

export function useDisclosure(idSuffix = "region"): DisclosureState {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const regionId = `${baseId}-${idSuffix}`;
  const toggle = () => setOpen((current) => !current);
  return { open, toggle, regionId };
}

export interface DisclosureTriggerProps {
  open: boolean;
  regionId: string;
  onToggle: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  tone?: ButtonTone;
  className?: string;
  children: ReactNode;
}

export function DisclosureTrigger({ open, regionId, onToggle, variant, size, tone, className, children }: DisclosureTriggerProps) {
  return (
    <Button variant={variant} size={size} tone={tone} className={className} aria-expanded={open} aria-controls={regionId} onClick={onToggle}>
      {children}
    </Button>
  );
}
