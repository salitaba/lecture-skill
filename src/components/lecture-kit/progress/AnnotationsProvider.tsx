"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  highlightId,
  singleLectureAnnotationsKey,
  validateAnnotations,
  type Annotations,
  type Highlight
} from "@/lib/lecture-template/progress";

export interface AnnotationsContextValue {
  highlights: Highlight[];
  notes: Record<string, string>;
  loaded: boolean;
  addHighlight: (highlight: Omit<Highlight, "id">) => void;
  removeHighlight: (id: string) => void;
  setNote: (sectionAnchor: string, text: string) => void;
}

export interface AnnotationsProviderProps {
  lectureId: string;
  children: ReactNode;
}

const AnnotationsContext = createContext<AnnotationsContextValue | undefined>(undefined);
const writeDelayMs = 300;

export function AnnotationsProvider({ lectureId, children }: AnnotationsProviderProps) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const writeTimerRef = useRef<number | undefined>(undefined);
  const storageKey = useMemo(() => singleLectureAnnotationsKey(lectureId), [lectureId]);

  useEffect(() => {
    let cancelled = false;
    let next: Annotations = { highlights: [], notes: {} };
    let available = true;

    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        try {
          next = validateAnnotations(JSON.parse(stored));
        } catch (error) {
          console.warn(`Ignoring corrupted annotations for ${storageKey}.`, error);
        }
      }
    } catch (error) {
      available = false;
      console.warn("Annotations storage is unavailable; annotations will not persist.", error);
    }

    queueMicrotask(() => {
      if (cancelled) return;
      setHighlights(next.highlights);
      setNotes(next.notes);
      setStorageAvailable(available);
      setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  useEffect(() => {
    if (!loaded || !storageAvailable) return undefined;

    writeTimerRef.current = window.setTimeout(() => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify({ highlights, notes }));
      } catch (error) {
        setStorageAvailable(false);
        console.warn("Annotations could not be saved; persistence has been disabled.", error);
      }
    }, writeDelayMs);

    return () => {
      if (writeTimerRef.current) window.clearTimeout(writeTimerRef.current);
    };
  }, [highlights, notes, loaded, storageAvailable, storageKey]);

  const addHighlight = useCallback((highlight: Omit<Highlight, "id">) => {
    const id = highlightId(highlight.sectionAnchor, highlight.blockIndex, highlight.start, highlight.end);
    setHighlights((current) => {
      if (current.some((existing) => existing.id === id)) return current;
      return [...current, { ...highlight, id }];
    });
  }, []);

  const removeHighlight = useCallback((id: string) => {
    setHighlights((current) => current.filter((highlight) => highlight.id !== id));
  }, []);

  const setNote = useCallback((sectionAnchor: string, text: string) => {
    setNotes((current) => {
      const next = { ...current };
      if (text.trim() === "") {
        delete next[sectionAnchor];
      } else {
        next[sectionAnchor] = text;
      }
      return next;
    });
  }, []);

  const value = useMemo<AnnotationsContextValue>(
    () => ({ highlights, notes, loaded, addHighlight, removeHighlight, setNote }),
    [highlights, notes, loaded, addHighlight, removeHighlight, setNote]
  );

  return <AnnotationsContext.Provider value={value}>{children}</AnnotationsContext.Provider>;
}

export function useAnnotations(): AnnotationsContextValue {
  const context = useContext(AnnotationsContext);
  if (!context) throw new Error("useAnnotations must be used inside AnnotationsProvider.");
  return context;
}

export function useAnnotationsOptional(): AnnotationsContextValue | undefined {
  return useContext(AnnotationsContext);
}
