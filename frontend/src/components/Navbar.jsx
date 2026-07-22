import { useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../lib/gsap.js";
import { transcript } from "../data/transcript.js";
import Logo from "./Logo.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const links = [
  { to: "/", label: transcript.nav.home },
  { to: "/solutions", label: transcript.nav.solutions },
  { to: "/works", label: transcript.nav.works },
  { to: "/about", label: transcript.nav.about },
  { to: "/contact", label: transcript.nav.contact },
];

export default function Navbar({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useGSAP(
    () => {
      if (!open || prefersReducedMotion) return;
      gsap.from(".mobile-link", {
        y: 16,
        opacity: 0,
        stagger: 0.06,
        duration: 0.35,
        ease: "power2.out",
      });
    },
    { scope: menuRef, dependencies: [open] }
  );

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-ink/70">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" aria-label={transcript.brand.name}>
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary dark:text-glow"
                      : "text-zinc-600 hover:text-primary dark:text-muted dark:hover:text-glow"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-zinc-300/70 text-zinc-700 dark:border-white/10 dark:text-muted md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? transcript.actions.closeMenu : transcript.actions.openMenu}
            aria-expanded={open}
          >
            {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div ref={menuRef} className="md:hidden">
          <ul className="flex flex-col gap-1 px-5 pb-5">
            {links.map((l) => (
              <li key={l.to} className="mobile-link">
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary dark:text-glow"
                        : "text-zinc-700 hover:bg-zinc-100 dark:text-muted dark:hover:bg-white/5"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
