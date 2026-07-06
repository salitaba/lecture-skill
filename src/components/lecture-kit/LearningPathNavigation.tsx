"use client";

import { useEffect, useMemo, useState } from "react";
import type { LectureSection } from "@/lib/lecture-template/types";
import { lectureNavigationTargets } from "@/lib/lecture-template/navigationTargets";
import { useProgressOptional } from "./progress/ProgressProvider";

const nonAuthoredAnchors = [
  lectureNavigationTargets.overview.href.slice(1),
  lectureNavigationTargets.objectives.href.slice(1),
  lectureNavigationTargets.takeaways.href.slice(1)
];

export function LearningPathNavigation({ sections }: { sections: LectureSection[] }) {
  const progressContext = useProgressOptional();
  const [activeAnchor, setActiveAnchor] = useState<string | undefined>(undefined);

  const allAnchors = useMemo(
    () => [...nonAuthoredAnchors, ...sections.map((s) => s.anchor)],
    [sections]
  );

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveAnchor(visible.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] }
    );

    for (const anchor of allAnchors) {
      const el = document.getElementById(anchor);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [allAnchors]);

  const currentAnchor = progressContext?.currentSectionAnchor ?? activeAnchor;

  const items = [
    {
      key: "overview",
      href: lectureNavigationTargets.overview.href,
      prefix: "Start",
      label: lectureNavigationTargets.overview.label
    },
    {
      key: "objectives",
      href: lectureNavigationTargets.objectives.href,
      prefix: "Goals",
      label: lectureNavigationTargets.objectives.label
    },
    ...sections.map((section, index) => ({
      key: section.anchor,
      href: `#${section.anchor}`,
      prefix: `Section ${index + 1}`,
      label: section.title
    })),
    {
      key: "takeaways",
      href: lectureNavigationTargets.takeaways.href,
      prefix: "Review",
      label: lectureNavigationTargets.takeaways.label
    }
  ];

  return (
    <nav className="section-nav" aria-label="Learning path">
      <div className="learning-path learning-path-desktop">
        <h2>Learning path</h2>
        <p className="nav-summary-count">
          {sections.length} {sections.length === 1 ? "section" : "sections"}
        </p>
        <NavigationList items={items} activeAnchor={currentAnchor} />
      </div>
      <details className="learning-path learning-path-mobile">
        <summary>
          <span className="learning-path-summary-text">Learning path</span>
          <span className="learning-path-summary-meta">
            <span className="nav-summary-count">
              {sections.length} {sections.length === 1 ? "section" : "sections"}
            </span>
            <span className="learning-path-chevron" aria-hidden="true" />
          </span>
        </summary>
        <NavigationList items={items} activeAnchor={currentAnchor} />
      </details>
    </nav>
  );
}

function NavigationList({
  items,
  activeAnchor
}: {
  items: Array<{
    key: string;
    href: string;
    prefix: string;
    label: string;
  }>;
  activeAnchor?: string;
}) {
  return (
    <ol>
      {items.map((item) => {
        const anchor = item.href.startsWith("#") ? item.href.slice(1) : undefined;
        const isActive = anchor !== undefined && anchor === activeAnchor;
        return (
          <li className="nav-item" key={item.key}>
            <a
              href={item.href}
              {...(isActive ? { "aria-current": "location" } : {})}
              className={isActive ? "nav-item-active" : undefined}
            >
              <span className="nav-prefix">{item.prefix}</span>
              <span>{item.label}</span>
              {isActive ? <span className="sr-only"> (current)</span> : null}
            </a>
          </li>
        );
      })}
    </ol>
  );
}
