"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-elevated text-ink transition hover:border-gold hover:text-gold"
      aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      title={isDark ? "Tema claro" : "Tema oscuro"}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1Zm0 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.5-2.5a1 1 0 1 1 0-2H21a1 1 0 1 1 0 2h-1.5ZM3 13a1 1 0 1 1 0-2h1.5a1 1 0 1 1 0 2H3Zm14.95-6.45a1 1 0 0 1 0 1.4l-1.06 1.06a1 1 0 1 1-1.4-1.4l1.05-1.06a1 1 0 0 1 1.41 0ZM7.51 15.99a1 1 0 0 1 0 1.41l-1.06 1.06a1 1 0 1 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 0Zm9.98 1.41a1 1 0 0 1-1.41 0l-1.06-1.06a1 1 0 1 1 1.41-1.41l1.06 1.06a1 1 0 0 1 0 1.41ZM6.45 6.45a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 0 1-1.41 1.41L6.45 7.86a1 1 0 0 1 0-1.41ZM12 17a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V18a1 1 0 0 1 1-1Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M17.5 14.2A6.7 6.7 0 0 1 9.8 6.5a7 7 0 1 0 7.7 7.7Z" />
        </svg>
      )}
    </button>
  );
}
