/* eslint-disable @next/next/no-html-link-for-pages */

export interface NavTarget {
  slug: string;
  title: string;
}

export interface LectureNavigationProps {
  previous?: NavTarget;
  next?: NavTarget;
}

export function LectureNavigation({ previous, next }: LectureNavigationProps) {
  return (
    <nav className="lecture-nav" aria-label="Lecture navigation">
      <div className="lecture-nav-inner">
        {previous ? (
          <a className="lecture-nav-link lecture-nav-prev" href={`/lectures/${previous.slug}`}>
            ← {previous.title}
          </a>
        ) : null}
        <a className="lecture-nav-link lecture-nav-back" href="/">
          Back to course
        </a>
        {next ? (
          <a className="lecture-nav-link lecture-nav-next" href={`/lectures/${next.slug}`}>
            {next.title} →
          </a>
        ) : null}
      </div>
    </nav>
  );
}
