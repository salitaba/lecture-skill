export interface NavTarget {
  slug: string;
  title: string;
}

export interface LectureNavigationProps {
  previous?: NavTarget;
  next?: NavTarget;
  backHref?: string;
  backLabel?: string;
}

export function LectureNavigation({ previous, next, backHref = "/", backLabel = "Back to course" }: LectureNavigationProps) {
  return (
    <nav className="lecture-nav" aria-label="Lecture navigation">
      <div className="lecture-nav-inner">
        {previous ? (
          <a className="lecture-nav-link lecture-nav-prev" href={`/lectures/${previous.slug}`}>
            ← {previous.title}
          </a>
        ) : null}
        <a className="lecture-nav-link lecture-nav-back" href={backHref}>
          {backLabel}
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
