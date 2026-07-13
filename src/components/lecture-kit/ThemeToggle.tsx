"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/component-kit";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const THEME_COLOR_META_ATTRIBUTE = "data-lecture-theme-color";
const THEME_COLORS: Record<Theme, string> = {
  light: "#ffffff",
  dark: "#1c2124"
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      /* The system theme remains a useful fallback when storage is blocked. */
    }
    const initial: Theme =
      stored === "light" || stored === "dark"
        ? stored
        : typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    if (stored === "light" || stored === "dark") {
      applyThemeDom(initial, false);
    }
    queueMicrotask(() => setTheme(initial));
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyThemeDom(next, true);
  }

  if (theme === null) {
    return <span className="theme-toggle theme-toggle-placeholder" aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={theme === "dark"}
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} />
    </button>
  );
}

function applyThemeDom(theme: Theme, persist: boolean) {
  document.documentElement.setAttribute("data-theme", theme);
  if (persist) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* The active theme still applies for this session when storage is blocked. */
    }
  }
  setOwnedThemeColor(theme);
}

function setOwnedThemeColor(theme: Theme) {
  let meta = document.head.querySelector<HTMLMetaElement>(`meta[name="theme-color"][${THEME_COLOR_META_ATTRIBUTE}]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.setAttribute(THEME_COLOR_META_ATTRIBUTE, "manual");
    document.head.appendChild(meta);
  }
  meta.content = THEME_COLORS[theme];
}
