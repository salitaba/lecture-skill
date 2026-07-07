import { PageShell } from "@/components/lecture-kit/PageShell";
import { Button } from "@/components/component-kit";

export default function NotFound() {
  return (
    <PageShell>
      <section className="validation-screen" aria-labelledby="not-found-heading">
        <div className="validation-panel">
          <p className="eyebrow">Page not found</p>
          <h1 id="not-found-heading">This lecture doesn&apos;t exist</h1>
          <p className="validation-summary">The page you&apos;re looking for may have moved, or the link may be out of date.</p>
          <Button as="a" href="/">
            Back to course
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
