"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-xl bg-surface border border-border shadow-soft hover:bg-muted transition-all relative flex items-center justify-center overflow-hidden w-10 h-10"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 transition-all dark:-rotate-90 dark:opacity-0 text-primary" />
      <Moon className="absolute h-5 w-5 rotate-90 opacity-0 transition-all dark:rotate-0 dark:opacity-100 text-teal-400" />
    </button>
  );
}
