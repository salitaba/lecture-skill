import type { ValidationError } from "@/lib/lecture-template/types";

export function ValidationScreen({
  errors,
  templatePath,
  subjectLabel = "Template",
  subjectPathLabel = "Template",
  activePathLabel = "Active template",
  heading = "Fix the lecture template to preview this page",
  eyebrow = "Template validation failed"
}: {
  errors: ValidationError[];
  templatePath: string;
  subjectLabel?: string;
  subjectPathLabel?: string;
  activePathLabel?: string;
  heading?: string;
  eyebrow?: string;
}) {
  return (
    <main id="main-content" className="page-shell validation-screen">
      <section className="validation-panel" aria-labelledby="validation-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h1 id="validation-heading">{heading}</h1>
        <p className="validation-summary">
          The active {subjectLabel.toLowerCase()} has {errors.length} blocking {errors.length === 1 ? "error" : "errors"}.
          <span> {activePathLabel}: {templatePath}</span>
        </p>
        <ol className="validation-list">
          {errors.map((error, index) => (
            <li key={`${error.code}-${index}`}>
              <p className="validation-error-index">Error {index + 1}</p>
              <h2>{error.message}</h2>
              <dl>
                <div>
                  <dt>{subjectPathLabel}</dt>
                  <dd>{templatePath}</dd>
                </div>
                <div>
                  <dt>Code</dt>
                  <dd>{error.code}</dd>
                </div>
                <div>
                  <dt>Source area</dt>
                  <dd>{sourceArea(error, subjectLabel)}</dd>
                </div>
                {formatLocation(error) ? (
                  <div>
                    <dt>Location</dt>
                    <dd>{formatLocation(error)}</dd>
                  </div>
                ) : null}
                {error.field ? (
                  <div>
                    <dt>Field</dt>
                    <dd>{error.field}</dd>
                  </div>
                ) : null}
                {error.heading ? (
                  <div>
                    <dt>Heading</dt>
                    <dd>{error.heading}</dd>
                  </div>
                ) : null}
                {error.sectionTitle !== undefined ? (
                  <div>
                    <dt>Section</dt>
                    <dd>{error.sectionTitle || "(empty title)"}</dd>
                  </div>
                ) : null}
                {error.componentType ? (
                  <div>
                    <dt>Component</dt>
                    <dd>{error.componentType}</dd>
                  </div>
                ) : null}
                {error.hint ? (
                  <div className="validation-hint">
                    <dt>Hint</dt>
                    <dd>{error.hint}</dd>
                  </div>
                ) : null}
              </dl>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}

function formatLocation(error: ValidationError): string | undefined {
  if (!error.locator) return undefined;
  return [
    error.locator.line ? `line ${error.locator.line}` : undefined,
    error.locator.column ? `column ${error.locator.column}` : undefined,
    error.locator.context
  ]
    .filter(Boolean)
    .join(", ");
}

function sourceArea(error: ValidationError, subjectLabel: string): string {
  if (subjectLabel.toLowerCase().includes("course")) return "Course metadata";
  if (error.componentType) return "Component";
  if (error.field) return "Frontmatter";
  if (error.sectionTitle !== undefined) return "Section content";
  if (error.heading) return "Heading structure";
  if (error.locator?.context) return "Template body";
  return "Template";
}
