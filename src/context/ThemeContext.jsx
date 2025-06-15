import React, { createContext, useContext, useEffect, useState } from "react";
import { useSkillContext } from "./SkillContext";
import { FALLBACK_THEME } from "@/constants/settingsConstants";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { settings, updateSettings } = useSkillContext();
  const [resolvedTheme, setResolvedTheme] = useState("light");

  // Get system preference
  const getSystemTheme = () => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  };

  // Apply theme to document
  const applyTheme = (theme) => {
    const root = document.documentElement;
    const resolved = theme === "system" ? getSystemTheme() : theme;

    setResolvedTheme(resolved);

    if (resolved === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  // Initialize theme and watch for changes
  useEffect(() => {
    if (settings?.theme) {
      applyTheme(settings.theme);
    }
  }, [settings?.theme]);

  // Watch for system theme changes
  useEffect(() => {
    if (settings?.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [settings?.theme]);

  // Update theme
  const updateTheme = (newTheme) => {
    updateSettings({
      ...settings,
      theme: newTheme,
    });
  };

  const value = {
    theme: settings?.theme || FALLBACK_THEME,
    resolvedTheme,
    updateTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
