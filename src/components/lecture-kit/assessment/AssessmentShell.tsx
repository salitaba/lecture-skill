"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Card } from "@/components/component-kit";
import { useProgressOptional } from "../progress/ProgressProvider";

export interface AssessmentShellProps {
  id?: string;
  label: ReactNode;
  title?: ReactNode;
  className: string;
  children: ReactNode;
  noScriptFallback?: ReactNode;
}

export function AssessmentShell({ id, label, title, className, children, noScriptFallback }: AssessmentShellProps) {
  return (
    <Card id={id} altitude="emphasis" label={label} title={title} className={`assessment-card ${className}`}>
      {children}
      {noScriptFallback ? <noscript className="assessment-noscript">{noScriptFallback}</noscript> : null}
    </Card>
  );
}

export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export interface ChoiceAssessmentAttemptOptions {
  key: string;
  answer: string;
  lockAfterReveal?: boolean;
}

export interface ChoiceAssessmentAttempt {
  selected: string | null;
  setSelected: (value: string) => void;
  revealed: boolean;
  toggleReveal: () => void;
  isCorrect: boolean;
  hasSelection: boolean;
}

export function useChoiceAssessmentAttempt({ key, answer, lockAfterReveal = true }: ChoiceAssessmentAttemptOptions): ChoiceAssessmentAttempt {
  const progressContext = useProgressOptional();
  const [state, setState] = useState<{ selected: string | null; revealed: boolean }>({ selected: null, revealed: false });
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current || !progressContext?.answersLoaded) return undefined;
    hydratedRef.current = true;
    const attempt = progressContext.answers[key];
    if (!attempt) return undefined;
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setState({ selected: attempt.selected, revealed: true });
    });
    return () => {
      cancelled = true;
    };
  }, [key, progressContext?.answers, progressContext?.answersLoaded]);

  const setSelected = (selected: string) => {
    setState((current) => (lockAfterReveal && current.revealed ? current : { ...current, selected }));
  };

  const toggleReveal = () => {
    const nextRevealed = !state.revealed;
    if (nextRevealed && state.selected !== null) {
      progressContext?.recordAnswer(key, state.selected, state.selected === answer);
    }
    setState((current) => ({ ...current, revealed: nextRevealed }));
  };

  return {
    selected: state.selected,
    setSelected,
    revealed: state.revealed,
    toggleReveal,
    isCorrect: state.selected === answer,
    hasSelection: state.selected !== null
  };
}

export type LocalAssessmentStatus = "unattempted" | "revealed" | "understood" | "needs_review";

export function useLocalAssessmentLifecycle() {
  const [status, setStatus] = useState<LocalAssessmentStatus>("unattempted");
  const [revealed, setRevealed] = useState(false);

  return {
    status,
    revealed,
    toggleReveal: () => {
      setRevealed((current) => !current);
      setStatus((current) => (current === "unattempted" ? "revealed" : current));
    },
    markUnderstood: () => setStatus("understood"),
    markNeedsReview: () => setStatus("needs_review"),
    reset: () => {
      setRevealed(false);
      setStatus("unattempted");
    }
  };
}

export function AssessmentFeedback({ children, variant = "neutral" }: { children: ReactNode; variant?: "neutral" | "positive" | "negative" }) {
  return <p className={`assessment-feedback assessment-feedback-${variant}`} role="status">{children}</p>;
}
