import { FiMoon, FiSun } from "react-icons/fi";
import { transcript } from "../data/transcript.js";

export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={transcript.nav.toggleTheme}
      className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-300/70 text-zinc-700 transition-colors hover:text-primary dark:border-white/10 dark:text-muted dark:hover:text-glow"
    >
      {theme === "dark" ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
    </button>
  );
}
