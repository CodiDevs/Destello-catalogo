"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

<<<<<<< HEAD
function initialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  const fromAttribute = document.documentElement.getAttribute("data-theme");
  return fromAttribute === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    const stored = window.localStorage.getItem("destello-theme") as Theme | null;
    const preferred =
      stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(preferred);
    applyTheme(preferred);
=======
function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem("destello-theme");
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // sin acceso a localStorage: caer al sistema
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== "destello-theme") return;
      const next = event.newValue === "dark" ? "dark" : "light";
      setTheme(next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
>>>>>>> 4658474 (Se agrego los mas vendidos y poder agregar productos de diferente color)
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "light" ? "dark" : "light";
      applyTheme(next);
      window.localStorage.setItem("destello-theme", next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
<<<<<<< HEAD
}
=======
}
>>>>>>> 4658474 (Se agrego los mas vendidos y poder agregar productos de diferente color)
