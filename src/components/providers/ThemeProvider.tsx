"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type DragonTheme = "black-dragon" | "white-dragon";

const STORAGE_KEY = "nakama-theme";
const DEFAULT_THEME: DragonTheme = "black-dragon";

interface ThemeContextValue {
  theme: DragonTheme;
  setTheme: (t: DragonTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Read the data-theme attribute already set by the inline script.
  // Falls back to default — no server/client mismatch because
  // <html> has suppressHydrationWarning.
  const [theme, setThemeState] = useState<DragonTheme>(DEFAULT_THEME);

  // On mount, sync from the real DOM attribute (set by the inline script).
  useEffect(() => {
    const saved = (document.documentElement.getAttribute("data-theme") as DragonTheme) ?? DEFAULT_THEME;
    setThemeState(saved);
  }, []);

  const setTheme = useCallback((next: DragonTheme) => {
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "black-dragon" ? "white-dragon" : "black-dragon");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
