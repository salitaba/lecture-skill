import type { InstructorNoteComponent } from "@/lib/lecture-template/types";

export function InstructorNote({ component }: { component: InstructorNoteComponent }) {
  return (
    <aside className="lecture-component surface-quiet instructor-note">
      <p className="component-label">Instructor note</p>
      <h3>{component.title}</h3>
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
    </aside>
  );
}
