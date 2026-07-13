import type { CollectionValidationResult, LectureValidationResult } from "@/lib/lecture-template/types";

export const COLLECTION_REVIEW_STATUS_ID = "collection-review-status";

export function CollectionReviewStatus({ validation }: { validation: CollectionValidationResult }) {
  const invalidResults = validation.results.filter((result) => !result.valid);
  if (invalidResults.length === 0) return null;

  return (
    <details className="collection-review-disclosure" id={COLLECTION_REVIEW_STATUS_ID}>
      <summary>
        Author/reviewer status: {invalidResults.length} lecture{invalidResults.length === 1 ? "" : "s"} need{invalidResults.length === 1 ? "s" : ""} attention
      </summary>
      <p>
        These authored lectures are excluded from learner progress until their template issues are fixed. Review the actionable
        validation messages below, then run validation again.
      </p>
      <ul className="collection-review-list">
        {invalidResults.map((result) => (
          <ReviewItem key={result.slug} result={result} />
        ))}
      </ul>
    </details>
  );
}

function ReviewItem({ result }: { result: LectureValidationResult }) {
  const title = result.template?.metadata.title.trim() || humanizeSlug(result.slug);
  const messages = result.errors.length > 0 ? result.errors.map((error) => error.message) : ["Fix the template validation errors before publishing this lecture."];

  return (
    <li>
      <strong>{title}</strong> <code>{result.slug}</code>
      <ul>
        {messages.map((message, index) => (
          <li key={`${message}-${index}`}>{message}</li>
        ))}
      </ul>
    </li>
  );
}

function humanizeSlug(slug: string): string {
  const base = slug.replace(/^\d{2}-/, "").replace(/[-_]+/g, " ").trim();
  if (base === "") return slug;
  return base.replace(/\b\w/g, (character) => character.toUpperCase());
}
