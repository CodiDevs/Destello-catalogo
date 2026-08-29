"use client";

import {
  createContext,
  useCallback,
  useContext,
<<<<<<< HEAD
  useEffect,
  useState,
=======
  useState,
  type ReactNode,
>>>>>>> 88bb355 (Agrega modo admin, descuentos y productos)
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
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("destello-theme") as Theme | null;
    const preferred =
      stored ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(preferred);
    applyTheme(preferred);
  }, []);
=======
function initialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  const fromAttribute = document.documentElement.getAttribute("data-theme");
  return fromAttribute === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
>>>>>>> 88bb355 (Agrega modo admin, descuentos y productos)

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
>>>>>>> 88bb355 (Agrega modo admin, descuentos y productos)
