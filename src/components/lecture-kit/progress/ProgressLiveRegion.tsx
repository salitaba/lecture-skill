"use client";

import { useProgress } from "./ProgressProvider";

export function ProgressLiveRegion() {
  const { announcement, toast, toastVariant } = useProgress();

  return (
    <>
      <div className="progress-live-region" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      {toast ? (
        <div className={`progress-toast${toastVariant === "milestone" ? " progress-toast-milestone" : ""}`} role="status">
          {toast}
        </div>
      ) : null}
    </>
  );
}
