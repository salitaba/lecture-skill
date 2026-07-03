import type { LectureSection } from "@/lib/lecture-template/types";
import { lectureNavigationTargets } from "@/lib/lecture-template/navigationTargets";

export function SectionNavigation({ sections }: { sections: LectureSection[] }) {
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
        <NavigationList items={items} />
      </div>
      <details className="learning-path learning-path-mobile">
        <summary>
          <span>Learning path</span>
          <span className="nav-summary-count">
            {sections.length} {sections.length === 1 ? "section" : "sections"}
          </span>
        </summary>
        <NavigationList items={items} />
      </details>
    </nav>
  );
}

function NavigationList({
  items
}: {
  items: Array<{
    key: string;
    href: string;
    prefix: string;
    label: string;
  }>;
}) {
  return (
    <ol>
      {items.map((item) => (
        <li className="nav-item" key={item.key}>
          <a href={item.href}>
            <span className="nav-prefix">{item.prefix}</span>
            <span>{item.label}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
