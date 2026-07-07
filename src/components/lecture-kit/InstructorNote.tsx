import type { InstructorNoteComponent } from "@/lib/lecture-template/types";
import { Card } from "@/components/component-kit";

export function InstructorNote({ component }: { component: InstructorNoteComponent }) {
  return (
    <Card altitude="quiet" label="Instructor note" title={component.title} className="instructor-note">
      <dl className="instructor-note-meta">
        <div>
          <dt>Audience</dt>
          <dd>{component.audience}</dd>
        </div>
        {component.timing ? (
          <div>
            <dt>Timing</dt>
            <dd>{component.timing}</dd>
          </div>
        ) : null}
      </dl>
      <p>{component.body}</p>
    </Card>
  );
}
