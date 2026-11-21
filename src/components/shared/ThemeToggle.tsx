"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({
  className = "",
  showLabel = false,
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by rendering a stable placeholder on server and initial client render
  if (!mounted) {
    return (
      <div
        className={`h-9 ${showLabel ? "w-28" : "w-9"} rounded-xl border border-slate-200/80 bg-slate-100/50 dark:border-white/10 dark:bg-slate-900/50 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`group relative inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 p-2 text-slate-700 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-blue-400/50 hover:bg-slate-100 hover:text-blue-600 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-blue-500/40 dark:hover:bg-slate-800 dark:hover:text-blue-400 ${className}`}
    >
      {isDark ? (
        <Sun
          size={18}
          className="text-amber-400 transition-transform duration-300 group-hover:rotate-45"
        />
      ) : (
        <Moon
          size={18}
          className="text-slate-700 transition-transform duration-300 group-hover:-rotate-12 dark:text-slate-300"
        />
      )}
      {showLabel && (
        <span className="text-xs font-semibold">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}
