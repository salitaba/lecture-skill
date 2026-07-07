"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  calculateCollectionProgress,
  calculateLectureProgress,
  singleLectureAnswersKey,
  type AnswerAttempts,
  type LectureProgress,
  type ProgressLecture,
  type ProgressSection,
  validateAnswerAttempts,
  validateLectureProgress
} from "@/lib/lecture-template/progress";

export type ProgressToastVariant = "default" | "milestone";

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
  toastVariant: ProgressToastVariant;
  currentSectionAnchor?: string;
  resumeTarget?: ProgressSection;
  dismissResumePrompt: () => void;
  jumpToResumeTarget: () => void;
  answers: AnswerAttempts;
  answersLoaded: boolean;
  recordAnswer: (key: string, selected: string, correct: boolean) => void;
}

export interface ProgressProviderProps {
  storageKey: string;
  sections: ProgressSection[];
  children: ReactNode;
  collectionStorageKey?: string;
  collectionLectures?: ProgressLecture[];
  /** Enables answer-attempt persistence (a sibling `localStorage` key derived from this id). Optional so tests can render `ProgressProvider` without it. */
  lectureId?: string;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);
const writeDelayMs = 300;
const toastDelayMs = 1500;
const milestoneToastDelayMs = 3200;

export function ProgressProvider({ storageKey, sections, children, collectionStorageKey, collectionLectures, lectureId }: ProgressProviderProps) {
  const [progress, setProgress] = useState<LectureProgress>({});
  const [loaded, setLoaded] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  const [toast, setToast] = useState("");
  const [toastVariant, setToastVariant] = useState<ProgressToastVariant>("default");
  const [currentSectionAnchor, setCurrentSectionAnchor] = useState<string | undefined>(sections[0]?.anchor);
  const [resumeDismissed, setResumeDismissed] = useState(false);
  const [answers, setAnswers] = useState<AnswerAttempts>({});
  const [answersLoaded, setAnswersLoaded] = useState(false);
  const storageAvailableRef = useRef(true);
  const skipNextWriteRef = useRef(false);
  const writeTimerRef = useRef<number | undefined>(undefined);
  const toastTimerRef = useRef<number | undefined>(undefined);
  const answersWriteTimerRef = useRef<number | undefined>(undefined);
  const collectionStorageKeyRef = useRef(collectionStorageKey);
  const collectionLecturesRef = useRef(collectionLectures);
  const sectionAnchors = useMemo(() => sections.map((section) => section.anchor), [sections]);
  const sectionAnchorKey = sectionAnchors.join("\u001f");
  const summary = useMemo(() => calculateLectureProgress(progress, sections), [progress, sections]);
  const answersKey = useMemo(() => (lectureId ? singleLectureAnswersKey(lectureId) : undefined), [lectureId]);

  const announce = useCallback((message: string, variant: ProgressToastVariant = "default") => {
    setAnnouncement(message);
    setToast(message);
    setToastVariant(variant);
  }, []);

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
    if (!answersKey) return undefined;
    let cancelled = false;
    let nextAnswers: AnswerAttempts = {};

    try {
      const stored = window.localStorage.getItem(answersKey);
      if (stored) {
        try {
          nextAnswers = validateAnswerAttempts(JSON.parse(stored));
        } catch (error) {
          console.warn(`Ignoring corrupted answer attempts for ${answersKey}.`, error);
        }
      }
    } catch {
      /* answer-attempt storage is best-effort; a read failure just leaves answers empty */
    }

    queueMicrotask(() => {
      if (cancelled) return;
      setAnswers(nextAnswers);
      setAnswersLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [answersKey]);

  useEffect(() => {
    if (!answersKey || !answersLoaded || !storageAvailable) return undefined;

    answersWriteTimerRef.current = window.setTimeout(() => {
      try {
        window.localStorage.setItem(answersKey, JSON.stringify(answers));
      } catch {
        /* answer-attempt persistence is best-effort and does not flip the shared storageAvailable flag */
      }
    }, writeDelayMs);

    return () => {
      if (answersWriteTimerRef.current) window.clearTimeout(answersWriteTimerRef.current);
    };
  }, [answers, answersKey, answersLoaded, storageAvailable]);

  useEffect(() => {
    if (!toast) return undefined;

    const delay = toastVariant === "milestone" ? milestoneToastDelayMs : toastDelayMs;
    toastTimerRef.current = window.setTimeout(() => setToast(""), delay);
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, [toast, toastVariant]);

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

  useEffect(() => {
    collectionStorageKeyRef.current = collectionStorageKey;
    collectionLecturesRef.current = collectionLectures;
  }, [collectionStorageKey, collectionLectures]);

  useEffect(() => {
    if (!loaded || !collectionStorageKeyRef.current || !collectionLecturesRef.current) return undefined;
    if (skipNextWriteRef.current) return undefined;

    const collectionKey = collectionStorageKeyRef.current;
    const lectures = collectionLecturesRef.current;
    const lectureSlug = lectures.find((lecture) => lecture.sections.some((section) => section.anchor === sections[0]?.anchor))?.slug;
    if (!lectureSlug) return undefined;

    const timer = window.setTimeout(() => {
      try {
        const existing = window.localStorage.getItem(collectionKey);
        let collection: Record<string, LectureProgress> = {};
        if (existing) {
          try {
            const parsed = JSON.parse(existing);
            if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
              collection = parsed;
            }
          } catch {
            collection = {};
          }
        }

        const beforePercent = calculateCollectionProgress(collection, lectures).percentComplete;
        collection[lectureSlug] = progress;
        const afterPercent = calculateCollectionProgress(collection, lectures).percentComplete;
        window.localStorage.setItem(collectionKey, JSON.stringify(collection));

        if (beforePercent < 100 && afterPercent === 100) {
          announce("You've completed the whole course. Nice work!", "milestone");
        }
      } catch {
        /* collection write is best-effort */
      }
    }, writeDelayMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [announce, loaded, progress, sections]);

  const toggleSection = useCallback(
    (sectionAnchor: string) => {
      const section = sections.find((candidate) => candidate.anchor === sectionAnchor);
      if (!section) return;

      setProgress((current) => {
        const previousPercent = calculateLectureProgress(current, sections).percentComplete;
        const nextComplete = current[sectionAnchor] !== true;
        const next = { ...current, [sectionAnchor]: nextComplete };
        const nextSummary = calculateLectureProgress(next, sections);
        const justCompletedLecture = nextComplete && previousPercent < 100 && nextSummary.percentComplete === 100;

        announce(
          justCompletedLecture
            ? `Lecture complete! All ${nextSummary.totalSections} sections finished.`
            : nextComplete
              ? `Section marked complete. ${nextSummary.completedSections} of ${nextSummary.totalSections} sections finished.`
              : `Section marked incomplete. ${nextSummary.completedSections} of ${nextSummary.totalSections} sections finished.`,
          justCompletedLecture ? "milestone" : "default"
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

    const cKey = collectionStorageKeyRef.current;
    const cLectures = collectionLecturesRef.current;
    if (cKey && cLectures) {
      const lectureSlug = cLectures.find((lecture) => lecture.sections.some((section) => section.anchor === sections[0]?.anchor))?.slug;
      if (lectureSlug) {
        try {
          const existing = window.localStorage.getItem(cKey);
          if (existing) {
            const parsed = JSON.parse(existing);
            if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
              delete parsed[lectureSlug];
              window.localStorage.setItem(cKey, JSON.stringify(parsed));
            }
          }
        } catch {
          /* collection reset is best-effort */
        }
      }
    }
  }, [announce, sections, storageKey]);

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

  const recordAnswer = useCallback((key: string, selected: string, correct: boolean) => {
    setAnswers((current) => ({ ...current, [key]: { selected, correct } }));
  }, []);

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
      toastVariant,
      currentSectionAnchor,
      resumeTarget,
      dismissResumePrompt,
      jumpToResumeTarget,
      answers,
      answersLoaded,
      recordAnswer
    }),
    [
      announcement,
      answers,
      answersLoaded,
      progress,
      currentSectionAnchor,
      dismissResumePrompt,
      jumpToResumeTarget,
      loaded,
      recordAnswer,
      resetProgress,
      resumeTarget,
      sections,
      storageAvailable,
      summary.completedSections,
      summary.percentComplete,
      summary.totalSections,
      toast,
      toastVariant,
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
