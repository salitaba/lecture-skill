"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Card } from "@/components/component-kit";
import { useProgressOptional } from "../progress/ProgressProvider";
import { useReviewOptional } from "../progress/ReviewProvider";

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
    <Card id={id} tabIndex={id ? -1 : undefined} altitude="emphasis" label={label} title={title} className={`assessment-card ${className}`}>
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
  activityKey?: string;
}

export interface ChoiceAssessmentAttempt {
  selected: string | null;
  setSelected: (value: string) => void;
  revealed: boolean;
  toggleReveal: () => void;
  isCorrect: boolean;
  hasSelection: boolean;
  retry: () => void;
}

export function useChoiceAssessmentAttempt({ key, answer, lockAfterReveal = true, activityKey = key }: ChoiceAssessmentAttemptOptions): ChoiceAssessmentAttempt {
  const progressContext = useProgressOptional();
  const reviewContext = useReviewOptional();
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
    if (nextRevealed) {
      const selected = state.selected;
      const attempted = selected !== null;
      if (attempted) {
        progressContext?.recordAnswer(key, selected, selected === answer);
        if (selected !== answer) reviewContext?.markReviewRecommended(activityKey);
      }
      reviewContext?.recordActivity(activityKey, { attempted, revealed: true });
    }
    setState((current) => ({ ...current, revealed: nextRevealed }));
  };

  const retry = () => setState({ selected: null, revealed: false });

  return {
    selected: state.selected,
    setSelected,
    revealed: state.revealed,
    toggleReveal,
    isCorrect: state.selected === answer,
    hasSelection: state.selected !== null,
    retry
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
