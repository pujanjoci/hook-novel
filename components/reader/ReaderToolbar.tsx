"use client";

import Link from "next/link";
import { useReader } from "@/hooks/useReader";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";

interface ReaderToolbarProps {
  novelTitle: string;
  chapterTitle: string;
  novelSlug: string;
}

export default function ReaderToolbar({
  novelTitle,
  chapterTitle,
  novelSlug,
}: ReaderToolbarProps) {
  const { fontSize, darkMode, setFontSize, toggleDarkMode } = useReader();
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollPercent(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 w-full bg-bg/95 backdrop-blur-md border-b border-border">
      {/* Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-accent transition-all duration-150 ease-out"
        style={{ width: `${scrollPercent}%` }}
      />

      <div className="container-site h-14 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3 min-w-0 pr-4">
          <Link
            href={`/novels/${novelSlug}`}
            className="text-xs text-text-muted hover:text-accent transition-colors truncate hidden lg:block"
          >
            {novelTitle}
          </Link>
          <span className="text-text-muted/30 hidden lg:block">/</span>
          <h2 className="text-xs sm:text-sm font-medium truncate tracking-tight">{chapterTitle}</h2>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Font Size Selectors */}
          <div className="flex items-center gap-0.5 sm:gap-1 border-r border-border pr-2 mr-1 sm:mr-2">
            {(["sm", "md", "lg"] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={cn(
                  "w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[10px] sm:text-xs rounded transition-colors",
                  fontSize === size
                    ? "bg-accent text-bg"
                    : "text-text-muted hover:text-text hover:bg-surface"
                )}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="w-8 h-8 sm:w-9 sm:h-9 p-0 rounded-full"
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☼" : "☾"}
          </Button>

          <Link href={`/novels/${novelSlug}`}>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex px-3">
              Close
            </Button>
            <Button variant="ghost" size="sm" className="sm:hidden w-8 h-8 p-0" aria-label="Close reader">
               ✕
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
