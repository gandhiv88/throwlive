"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="rounded px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border transition-colors"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <span className="flex items-center gap-2">☀️ <span>Light</span></span>
      ) : (
        <span className="flex items-center gap-2">🌙 <span>Dark</span></span>
      )}
    </button>
  );
}
