"use client";

import { useEffect } from "react";

export function FragmentFocusTarget() {
  useEffect(() => {
    const focusTarget = () => {
      const fragment = window.location.hash.slice(1);
      if (!fragment) return;
      const target = document.getElementById(decodeURIComponent(fragment));
      if (!(target instanceof HTMLElement) || !target.hasAttribute("tabindex")) return;
      window.setTimeout(() => target.focus({ preventScroll: true }), 0);
    };

    focusTarget();
    window.addEventListener("hashchange", focusTarget);
    return () => window.removeEventListener("hashchange", focusTarget);
  }, []);

  return null;
}
