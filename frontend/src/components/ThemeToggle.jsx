import { FiMoon, FiSun } from "react-icons/fi";
import { transcript } from "../data/transcript.js";

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={transcript.actions.toggleTheme}
      className="grid h-10 w-10 place-items-center rounded-full border border-zinc-300/70 text-zinc-700 transition-colors hover:text-primary dark:border-white/10 dark:text-muted dark:hover:text-glow"
    >
      {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
    </button>
  );
}
