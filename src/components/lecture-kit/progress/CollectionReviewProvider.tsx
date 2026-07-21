"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { singleLectureReviewsKey } from "@/lib/lecture-template/progress";
import { activityKeysForAssessment } from "@/lib/lecture-template/objectiveEvidence";
import { validateReviewState, type ReviewState } from "@/lib/lecture-template/reviewState";
import type { CollectionReviewRegistryEntry } from "@/lib/lecture-template/collection";

export interface CollectionReviewContextValue {
  loaded: boolean;
  storageAvailable: boolean;
  snapshots: Readonly<Record<string, ReviewState>>;
  recordsForLecture: (lectureId: string) => ReviewState;
  refresh: () => void;
  resetReviews: () => void;
}

const CollectionReviewContext = createContext<CollectionReviewContextValue | undefined>(undefined);

export function CollectionReviewProvider({ registry, children, now = () => new Date().toISOString(), refreshIntervalMs = 60_000 }: { registry: readonly CollectionReviewRegistryEntry[]; children: ReactNode; now?: () => string; refreshIntervalMs?: number }) {
  const [snapshots, setSnapshots] = useState<Record<string, ReviewState>>({});
  const [loaded, setLoaded] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const nowRef = useRef(now);
  useEffect(() => {
    nowRef.current = now;
  }, [now]);
  const registryKey = registry.map((entry) => `${entry.lectureId}:${entry.assessments.map((assessment) => assessment.id).join(",")}`).join("|");

  const refresh = useCallback(() => {
    let available = true;
    const next: Record<string, ReviewState> = {};
    try {
      for (const entry of registry) {
        const allowed = entry.assessments.flatMap(activityKeysForAssessment);
        try {
          const stored = window.localStorage.getItem(singleLectureReviewsKey(entry.lectureId));
          if (stored) next[entry.lectureId] = validateReviewState(JSON.parse(stored), allowed);
        } catch {
          available = false;
        }
      }
    } catch {
      available = false;
    }
    setSnapshots(next);
    setStorageAvailable(available);
    setLoaded(true);
  }, [registry]);

  useEffect(() => {
    const initialRefresh = window.setTimeout(refresh, 0);
    const onFocus = () => refresh();
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    const timer = window.setInterval(() => {
      void nowRef.current();
      refresh();
    }, refreshIntervalMs);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(initialRefresh);
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refresh, refreshIntervalMs, registryKey]);

  const recordsForLecture = useCallback((lectureId: string) => snapshots[lectureId] ?? {}, [snapshots]);
  const resetReviews = useCallback(() => {
    for (const entry of registry) {
      try {
        window.localStorage.removeItem(singleLectureReviewsKey(entry.lectureId));
      } catch {
        setStorageAvailable(false);
      }
    }
    setSnapshots({});
  }, [registry]);
  const value = useMemo<CollectionReviewContextValue>(() => ({ loaded, storageAvailable, snapshots, recordsForLecture, refresh, resetReviews }), [loaded, recordsForLecture, refresh, resetReviews, snapshots, storageAvailable]);

  return <CollectionReviewContext.Provider value={value}>{children}</CollectionReviewContext.Provider>;
}

export function useCollectionReview(): CollectionReviewContextValue {
  const context = useContext(CollectionReviewContext);
  if (!context) throw new Error("useCollectionReview must be used inside CollectionReviewProvider.");
  return context;
}
