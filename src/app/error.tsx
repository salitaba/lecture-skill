"use client";

import { PageShell } from "@/components/lecture-kit/PageShell";
import { Button } from "@/components/component-kit";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PageShell>
      <section className="validation-screen" aria-labelledby="error-heading">
        <div className="validation-panel">
          <p className="eyebrow">Something went wrong</p>
          <h1 id="error-heading">This page hit an unexpected error</h1>
          <p className="validation-summary">Try again, or head back to the course while we look into it.</p>
          <div className="resume-prompt-actions">
            <Button onClick={reset}>Try again</Button>
            <Button as="a" variant="ghost" href="/">
              Back to course
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
