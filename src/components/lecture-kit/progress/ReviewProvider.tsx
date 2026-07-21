"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { singleLectureReviewsKey } from "@/lib/lecture-template/progress";
import { scheduleReview, type ReviewRating } from "@/lib/lecture-template/reviewSchedule";
import { serializeReviewState, validateReviewState, type ReviewState } from "@/lib/lecture-template/reviewState";
import type { AssessmentLifecycleSnapshot } from "@/lib/lecture-template/learnerActivityEvidence";

export interface ReviewContextValue {
  records: ReviewState;
  loaded: boolean;
  storageAvailable: boolean;
  activityState: Readonly<Record<string, AssessmentLifecycleSnapshot>>;
  rate: (activityKey: string, rating: ReviewRating, now?: string) => void;
  markReviewRecommended: (activityKey: string, now?: string) => void;
  recordActivity: (activityKey: string, snapshot: AssessmentLifecycleSnapshot) => void;
  resetReviews: () => void;
}

export interface ReviewProviderProps {
  lectureId: string;
  activityKeys?: readonly string[];
  children: ReactNode;
  now?: () => string;
}

const ReviewContext = createContext<ReviewContextValue | undefined>(undefined);
const writeDelayMs = 300;

export function ReviewProvider({ lectureId, activityKeys, children, now = () => new Date().toISOString() }: ReviewProviderProps) {
  const storageKey = singleLectureReviewsKey(lectureId);
  const [records, setRecords] = useState<ReviewState>({});
  const [activityState, setActivityState] = useState<Record<string, AssessmentLifecycleSnapshot>>({});
  const [loaded, setLoaded] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const writeTimerRef = useRef<number | undefined>(undefined);
  const storageAvailableRef = useRef(true);
  const allowedKeys = useMemo(() => activityKeys ? new Set(activityKeys) : undefined, [activityKeys]);

  useEffect(() => {
    storageAvailableRef.current = storageAvailable;
  }, [storageAvailable]);

  useEffect(() => {
    let cancelled = false;
    let nextState: ReviewState = {};
    let available = true;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) nextState = validateReviewState(JSON.parse(stored), allowedKeys);
    } catch {
      available = false;
    }
    queueMicrotask(() => {
      if (cancelled) return;
      setRecords(nextState);
      setStorageAvailable(available);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [allowedKeys, storageKey]);

  useEffect(() => {
    if (!loaded || !storageAvailable || Object.keys(records).length === 0) return undefined;
    writeTimerRef.current = window.setTimeout(() => {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(storageKey, serializeReviewState(records));
      } catch {
        if (typeof window !== "undefined") setStorageAvailable(false);
      }
    }, writeDelayMs);
    return () => {
      if (writeTimerRef.current) window.clearTimeout(writeTimerRef.current);
    };
  }, [loaded, records, storageAvailable, storageKey]);

  const rate = useCallback((activityKey: string, rating: ReviewRating, timestamp = now()) => {
    if (allowedKeys && !allowedKeys.has(activityKey)) return;
    setRecords((current) => {
      const next = scheduleReview(current[activityKey], rating, timestamp, activityKey);
      return { ...current, [activityKey]: next };
    });
  }, [allowedKeys, now]);

  const markReviewRecommended = useCallback((activityKey: string, timestamp = now()) => {
    if (allowedKeys && !allowedKeys.has(activityKey)) return;
    setRecords((current) => ({
      ...current,
      [activityKey]: scheduleReview(current[activityKey], "again", timestamp, activityKey)
    }));
  }, [allowedKeys, now]);

  const recordActivity = useCallback((activityKey: string, snapshot: AssessmentLifecycleSnapshot) => {
    setActivityState((current) => ({ ...current, [activityKey]: { ...current[activityKey], ...snapshot } }));
  }, []);

  const resetReviews = useCallback(() => {
    if (writeTimerRef.current) window.clearTimeout(writeTimerRef.current);
    setRecords({});
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      setStorageAvailable(false);
    }
  }, [storageKey]);

  const value = useMemo<ReviewContextValue>(() => ({
    records,
    loaded,
    storageAvailable,
    activityState,
    rate,
    markReviewRecommended,
    recordActivity,
    resetReviews
  }), [activityState, loaded, markReviewRecommended, rate, recordActivity, records, resetReviews, storageAvailable]);

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>;
}

export function useReview(): ReviewContextValue {
  const context = useContext(ReviewContext);
  if (!context) throw new Error("useReview must be used inside ReviewProvider.");
  return context;
}

export function useReviewOptional(): ReviewContextValue | undefined {
  return useContext(ReviewContext);
}
