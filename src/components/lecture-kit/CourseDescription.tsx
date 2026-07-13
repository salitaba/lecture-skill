const LONG_DESCRIPTION_CHARACTER_LIMIT = 180;
const PREVIEW_WORD_LIMIT = 30;

export function CourseDescription({ description }: { description: string }) {
  const normalized = description.trim();
  if (!normalized) return null;

  if (!isLongDescription(normalized)) {
    return <p className="description course-description">{normalized}</p>;
  }

  return (
    <details className="course-description-disclosure">
      <summary>
        <span className="course-description-preview">{previewDescription(normalized)}</span>
        <span className="course-description-label">About this course</span>
      </summary>
      <p className="description course-description-full">{normalized}</p>
    </details>
  );
}

function isLongDescription(description: string): boolean {
  return description.length > LONG_DESCRIPTION_CHARACTER_LIMIT || description.split(/\s+/).length > PREVIEW_WORD_LIMIT;
}

function previewDescription(description: string): string {
  const firstSentence = description.match(/^(.{60,180}?[.!?])(?:\s|$)/)?.[1];
  if (firstSentence) return firstSentence;

  const words = description.split(/\s+/);
  if (words.length <= PREVIEW_WORD_LIMIT) return description;
  return `${words.slice(0, PREVIEW_WORD_LIMIT).join(" ")}…`;
}
