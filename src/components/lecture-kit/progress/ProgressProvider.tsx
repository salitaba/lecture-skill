"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  calculateLectureProgress,
  type LectureProgress,
  type ProgressSection,
  validateLectureProgress
} from "@/lib/lecture-template/progress";

export interface ProgressContextValue {
  progress: LectureProgress;
  toggleSection: (sectionAnchor: string) => void;
  resetProgress: () => void;
  totalSections: number;
  completedSections: number;
  percentComplete: number;
  sections: ProgressSection[];
  storageAvailable: boolean;
  loaded: boolean;
  announcement: string;
  toast: string;
  currentSectionAnchor?: string;
  resumeTarget?: ProgressSection;
  dismissResumePrompt: () => void;
  jumpToResumeTarget: () => void;
}

export interface ProgressProviderProps {
  storageKey: string;
  sections: ProgressSection[];
  children: ReactNode;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);
const writeDelayMs = 300;
const toastDelayMs = 1500;

export function ProgressProvider({ storageKey, sections, children }: ProgressProviderProps) {
  const [progress, setProgress] = useState<LectureProgress>({});
  const [loaded, setLoaded] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  const [toast, setToast] = useState("");
  const [currentSectionAnchor, setCurrentSectionAnchor] = useState<string | undefined>(sections[0]?.anchor);
  const [resumeDismissed, setResumeDismissed] = useState(false);
  const storageAvailableRef = useRef(true);
  const skipNextWriteRef = useRef(false);
  const writeTimerRef = useRef<number | undefined>(undefined);
  const toastTimerRef = useRef<number | undefined>(undefined);
  const sectionAnchors = useMemo(() => sections.map((section) => section.anchor), [sections]);
  const sectionAnchorKey = sectionAnchors.join("\u001f");
  const summary = useMemo(() => calculateLectureProgress(progress, sections), [progress, sections]);

  useEffect(() => {
    storageAvailableRef.current = storageAvailable;
  }, [storageAvailable]);

  useEffect(() => {
    let cancelled = false;
    let nextProgress: LectureProgress = {};
    let available = true;

    try {
      const storage = window.localStorage;
      const stored = storage.getItem(storageKey);
      if (stored) {
        try {
          nextProgress = validateLectureProgress(JSON.parse(stored), sectionAnchors);
        } catch (error) {
          console.warn(`Ignoring corrupted lecture progress for ${storageKey}.`, error);
        }
      }
    } catch (error) {
      available = false;
      console.warn("Lecture progress storage is unavailable; progress will not persist.", error);
    }

    queueMicrotask(() => {
      if (cancelled) return;
      setProgress(nextProgress);
      setStorageAvailable(available);
      setLoaded(true);
      setResumeDismissed(false);
      setCurrentSectionAnchor((current) => (current && sectionAnchors.includes(current) ? current : sectionAnchors[0]));
    });

    return () => {
      cancelled = true;
    };
  }, [storageKey, sectionAnchorKey, sectionAnchors]);

  useEffect(() => {
    if (!loaded || !storageAvailable) return undefined;
    if (skipNextWriteRef.current) {
      skipNextWriteRef.current = false;
      return undefined;
    }

    writeTimerRef.current = window.setTimeout(() => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(progress));
      } catch (error) {
        setStorageAvailable(false);
        console.warn("Lecture progress could not be saved; persistence has been disabled.", error);
      }
    }, writeDelayMs);

    return () => {
      if (writeTimerRef.current) window.clearTimeout(writeTimerRef.current);
    };
  }, [loaded, progress, storageAvailable, storageKey]);

  useEffect(() => {
    if (!toast) return undefined;

    toastTimerRef.current = window.setTimeout(() => setToast(""), toastDelayMs);
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, [toast]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
        if (visibleEntry?.target.id) setCurrentSectionAnchor(visibleEntry.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] }
    );

    for (const anchor of sectionAnchors) {
      const element = document.getElementById(anchor);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [sectionAnchorKey, sectionAnchors]);

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    setToast(message);
  }, []);

  const toggleSection = useCallback(
    (sectionAnchor: string) => {
      const section = sections.find((candidate) => candidate.anchor === sectionAnchor);
      if (!section) return;

      setProgress((current) => {
        const nextComplete = current[sectionAnchor] !== true;
        const next = { ...current, [sectionAnchor]: nextComplete };
        const nextSummary = calculateLectureProgress(next, sections);
        announce(
          nextComplete
            ? `Section marked complete. ${nextSummary.completedSections} of ${nextSummary.totalSections} sections finished.`
            : `Section marked incomplete. ${nextSummary.completedSections} of ${nextSummary.totalSections} sections finished.`
        );
        return next;
      });
    },
    [announce, sections]
  );

  const resetProgress = useCallback(() => {
    if (writeTimerRef.current) window.clearTimeout(writeTimerRef.current);
    skipNextWriteRef.current = true;
    setProgress({});
    setResumeDismissed(true);
    announce("Progress reset.");

    if (!storageAvailableRef.current) return;

    try {
      window.localStorage.removeItem(storageKey);
    } catch (error) {
      setStorageAvailable(false);
      console.warn("Lecture progress could not be reset in localStorage.", error);
    }
  }, [announce, storageKey]);

  const firstIncompleteSection = useMemo(
    () => sections.find((section) => progress[section.anchor] !== true),
    [progress, sections]
  );
  const resumeTarget =
    loaded && !resumeDismissed && summary.percentComplete > 0 && summary.percentComplete < 100
      ? firstIncompleteSection ?? sections[0]
      : undefined;

  const jumpToResumeTarget = useCallback(() => {
    if (!resumeTarget) return;
    document.getElementById(resumeTarget.anchor)?.scrollIntoView({ block: "start", behavior: "smooth" });
    setCurrentSectionAnchor(resumeTarget.anchor);
    setResumeDismissed(true);
  }, [resumeTarget]);

  const dismissResumePrompt = useCallback(() => setResumeDismissed(true), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return;
      if (isEditableShortcutTarget(event.target)) return;
      const key = event.key.toLowerCase();
      if (key === "m") {
        event.preventDefault();
        const target = currentSectionAnchor ?? firstIncompleteSection?.anchor ?? sections[0]?.anchor;
        if (target) toggleSection(target);
      }
      if (key === "r") {
        event.preventDefault();
        if (window.confirm("Reset progress for this lecture?")) resetProgress();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentSectionAnchor, firstIncompleteSection, resetProgress, sections, toggleSection]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      toggleSection,
      resetProgress,
      totalSections: summary.totalSections,
      completedSections: summary.completedSections,
      percentComplete: summary.percentComplete,
      sections,
      storageAvailable,
      loaded,
      announcement,
      toast,
      currentSectionAnchor,
      resumeTarget,
      dismissResumePrompt,
      jumpToResumeTarget
    }),
    [
      announcement,
      progress,
      currentSectionAnchor,
      dismissResumePrompt,
      jumpToResumeTarget,
      loaded,
      resetProgress,
      resumeTarget,
      sections,
      storageAvailable,
      summary.completedSections,
      summary.percentComplete,
      summary.totalSections,
      toast,
      toggleSection
    ]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress must be used inside ProgressProvider.");
  return context;
}

export function useProgressOptional(): ProgressContextValue | undefined {
  return useContext(ProgressContext);
}

function isEditableShortcutTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return target.matches("input, textarea, select");
}
