"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { Theme, ThemeMode } from "@/types";
import { themes } from "@/lib/themes";

const THEME_STORAGE_KEY = "todo-app-theme";

interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  mounted: boolean;
}

const defaultContextValue: ThemeContextValue = {
  theme: themes.light,
  themeMode: "light",
  toggleTheme: () => {},
  setThemeMode: () => {},
  mounted: false,
};

const ThemeContext = createContext<ThemeContextValue>(defaultContextValue);

/**
 * Retrieves the theme mode from localStorage or system preference.
 * Only called on the client after mount.
 */
function getStoredThemeMode(): ThemeMode {
  // Check localStorage first
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return "light";
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Theme provider component that manages light/dark mode state.
 * Persists preference to localStorage and respects system preference.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Always start with 'light' to match SSR
  const [themeMode, setThemeModeState] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedMode = getStoredThemeMode();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeModeState(storedMode);
    setMounted(true);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (!stored) {
        setThemeModeState(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mounted]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode(themeMode === "light" ? "dark" : "light");
  }, [themeMode, setThemeMode]);

  const theme = useMemo(() => themes[themeMode], [themeMode]);

  const value = useMemo(
    () => ({
      theme,
      themeMode,
      toggleTheme,
      setThemeMode,
      mounted,
    }),
    [theme, themeMode, toggleTheme, setThemeMode, mounted]
  );

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={theme}>
        <div
          style={{
            visibility: mounted ? "visible" : "hidden",
            minHeight: "100vh",
            width: "100%",
          }}
        >
          {children}
        </div>
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
