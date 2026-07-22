import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiGrid, FiFolder, FiMail, FiInbox, FiUsers, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { transcript } from "../data/transcript.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../hooks/useTheme.js";
import Logo from "./Logo.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const links = [
  { to: "/", label: transcript.nav.dashboard, icon: FiGrid, end: true },
  { to: "/projects", label: transcript.nav.projects, icon: FiFolder },
  { to: "/messages", label: transcript.nav.messages, icon: FiMail },
  { to: "/applications", label: transcript.nav.applications, icon: FiInbox },
  { to: "/users", label: transcript.nav.users, icon: FiUsers },
];

export default function DashboardLayout({ children }) {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success(transcript.toasts.loggedOut);
    navigate("/login", { replace: true });
  };

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary/10 text-primary dark:text-glow"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-muted dark:hover:bg-white/5"
            }`
          }
        >
          <Icon className="h-4.5 w-4.5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  const sidebarBody = (
    <div className="flex h-full flex-col p-5">
      <div className="mb-8">
        <Logo />
      </div>
      {nav}
      <button
        onClick={handleLogout}
        className="mt-2 flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-500 dark:text-muted"
      >
        <FiLogOut className="h-4.5 w-4.5" />
        {transcript.nav.logout}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200/60 bg-white/60 dark:border-white/10 dark:bg-surface/40 md:block">
        {sidebarBody}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-white/10 bg-white dark:bg-surface">
            {sidebarBody}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-zinc-200/60 px-5 py-3.5 dark:border-white/10 md:justify-end">
          <button
            className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-300/70 dark:border-white/10 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={transcript.nav.dashboard}
          >
            {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>
        <main className="min-w-0 flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
