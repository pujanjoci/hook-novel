"use client";

import { useState, useEffect, createContext, useContext, useRef } from "react";
import type { ReaderPreferences } from "@/lib/types";

const STORAGE_KEY = "hook-novel-prefs";

const DEFAULT_PREFS: ReaderPreferences = {
  fontSize: "md",
  darkMode: false,
};

interface ReaderContextType extends ReaderPreferences {
  setFontSize: (size: ReaderPreferences["fontSize"]) => void;
  toggleDarkMode: () => void;
  isMounted: boolean;
}

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

export function ReaderProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<ReaderPreferences>(DEFAULT_PREFS);
  const [isMounted, setIsMounted] = useState(false);
  const isInitializing = useRef(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPrefs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse reader preferences", e);
      }
    }
    setIsMounted(true);
    // Use a small delay or next tick to ensure initialization is complete before effects trigger
    setTimeout(() => {
      isInitializing.current = false;
    }, 0);
  }, []);

  // Update localStorage and document class when prefs change
  useEffect(() => {
    if (!isMounted || isInitializing.current) return;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));

    // Handle dark mode class on html/body
    if (prefs.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [prefs, isMounted]);

  const setFontSize = (size: ReaderPreferences["fontSize"]) => {
    setPrefs((prev) => ({ ...prev, fontSize: size }));
  };

  const toggleDarkMode = () => {
    setPrefs((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  return (
    <ReaderContext.Provider
      value={{
        ...prefs,
        setFontSize,
        toggleDarkMode,
        isMounted,
      }}
    >
      {children}
    </ReaderContext.Provider>
  );
}

export function useReader() {
  const context = useContext(ReaderContext);
  if (context === undefined) {
    throw new Error("useReader must be used within a ReaderProvider");
  }
  return context;
}
