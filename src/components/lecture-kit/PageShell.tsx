import type { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" className="page-shell">
      {children}
    </main>
  );
}
