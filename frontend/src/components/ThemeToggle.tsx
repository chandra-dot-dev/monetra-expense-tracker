import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-zinc-100/80 hover:bg-zinc-200/80 dark:bg-zinc-900/50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 transition-all border border-zinc-200/50 dark:border-zinc-800/85 cursor-pointer flex items-center justify-center shadow-xs"
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <Moon size={18} className="text-zinc-800" />
      ) : (
        <Sun size={18} className="text-amber-400" />
      )}
    </button>
  );
};

export default ThemeToggle;
