"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/component-kit";
import { useAnnotationsOptional } from "./AnnotationsProvider";

export function SectionNote({ anchor, title }: { anchor: string; title: string }) {
  const annotations = useAnnotationsOptional();
  const savedNote = annotations?.notes[anchor] ?? "";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState(savedNote);
  const regionId = useId();
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current || !annotations?.loaded) return undefined;
    hydratedRef.current = true;
    const stored = annotations.notes[anchor];
    if (!stored) return undefined;

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setDraft(stored);
    });
    return () => {
      cancelled = true;
    };
  }, [anchor, annotations?.loaded, annotations?.notes]);

  const hasNote = savedNote.trim() !== "";
  const textareaId = `${regionId}-textarea`;
  const titleId = `${regionId}-title`;
  const descriptionId = `${regionId}-description`;

  const saveDraft = () => annotations?.setNote(anchor, draft);
  const restoreFocus = () => openerRef.current?.focus();
  const openDialog = (event: React.MouseEvent<HTMLButtonElement>) => {
    openerRef.current = event.currentTarget;
    dialogRef.current?.showModal();
    queueMicrotask(() => textareaRef.current?.focus());
  };
  const closeDialog = () => {
    saveDraft();
    dialogRef.current?.close();
    restoreFocus();
  };
  const handleCancel = (event: React.SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    saveDraft();
    dialogRef.current?.close();
    restoreFocus();
  };

  return (
    <div className="section-note">
      <Button
        variant="ghost"
        size="compact"
        tone="muted"
        className="section-note-toggle"
        aria-haspopup="dialog"
        onClick={openDialog}
      >
        {hasNote ? "Edit note" : "Add a note"}
      </Button>
      <dialog
        ref={dialogRef}
        className="section-note-dialog"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={handleCancel}
        onClose={restoreFocus}
      >
        <div className="section-note-dialog-header">
          <p id={titleId} className="section-note-dialog-title">
            Note for {title}
          </p>
          <Button variant="ghost" tone="muted" size="compact" onClick={closeDialog}>
            Close
          </Button>
        </div>
        <p id={descriptionId} className="sr-only">
          Notes are saved in this browser when storage is available.
        </p>
        <label className="sr-only" htmlFor={textareaId}>
          Your note
        </label>
        <textarea
          id={textareaId}
          ref={textareaRef}
          className="section-note-textarea"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={saveDraft}
          placeholder="Jot a note for this section…"
        />
      </dialog>
    </div>
  );
}
