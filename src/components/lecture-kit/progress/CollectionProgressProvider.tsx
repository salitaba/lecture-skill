"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  calculateCollectionProgress,
  type CollectionProgress,
  type CollectionProgressSummary,
  type ProgressLecture,
  validateCollectionProgress
} from "@/lib/lecture-template/progress";

export interface CollectionProgressContextValue extends CollectionProgressSummary {
  progress: CollectionProgress;
  loaded: boolean;
  storageAvailable: boolean;
}

export interface CollectionProgressProviderProps {
  storageKey: string;
  lectures: ProgressLecture[];
  children: ReactNode;
}

const CollectionProgressContext = createContext<CollectionProgressContextValue | undefined>(undefined);

export function CollectionProgressProvider({ storageKey, lectures, children }: CollectionProgressProviderProps) {
  const [progress, setProgress] = useState<CollectionProgress>({});
  const [loaded, setLoaded] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const lectureKey = useMemo(
    () => lectures.map((lecture) => `${lecture.slug}:${lecture.sections.map((section) => section.anchor).join(",")}`).join("|"),
    [lectures]
  );
  const summary = useMemo(() => calculateCollectionProgress(progress, lectures), [progress, lectures]);

  useEffect(() => {
    let cancelled = false;
    let nextProgress: CollectionProgress = {};
    let available = true;

    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        try {
          nextProgress = validateCollectionProgress(JSON.parse(stored), lectures);
        } catch (error) {
          console.warn(`Ignoring corrupted collection progress for ${storageKey}.`, error);
        }
      }
    } catch (error) {
      available = false;
      console.warn("Collection progress storage is unavailable; progress cannot be read.", error);
    }

    queueMicrotask(() => {
      if (cancelled) return;
      setProgress(nextProgress);
      setStorageAvailable(available);
      setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [storageKey, lectureKey, lectures]);

  const value = useMemo<CollectionProgressContextValue>(
    () => ({
      progress,
      loaded,
      storageAvailable,
      ...summary
    }),
    [loaded, progress, storageAvailable, summary]
  );

  return <CollectionProgressContext.Provider value={value}>{children}</CollectionProgressContext.Provider>;
}

export function useCollectionProgress(): CollectionProgressContextValue {
  const context = useContext(CollectionProgressContext);
  if (!context) throw new Error("useCollectionProgress must be used inside CollectionProgressProvider.");
  return context;
}
