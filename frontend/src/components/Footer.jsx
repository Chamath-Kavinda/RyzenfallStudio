import { Link } from "react-router-dom";
import { FiGithub, FiTwitter, FiLinkedin, FiMail, FiArrowUpRight } from "react-icons/fi";
import { transcript } from "../data/transcript.js";
import Logo from "./Logo.jsx";

const f = transcript.footer;

const socials = [
  { icon: FiGithub, href: "https://github.com", label: "GitHub" },
  { icon: FiTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FiLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FiMail, href: `mailto:${f.email}`, label: "Email" },
];

const navLinks = [
  { to: "/about", label: transcript.nav.about },
  { to: "/solutions", label: transcript.nav.solutions },
  { to: "/works", label: transcript.nav.works },
  { to: "/contact", label: transcript.nav.contact },
];

const solutionLinks = transcript.solutions.categories.map((c) => ({
  to: `/solutions/${c.slug}`,
  label: c.title,
}));

function LinkColumn({ title, links }) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-muted">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="text-sm text-zinc-600 transition-colors hover:text-primary dark:text-zinc-300 dark:hover:text-glow"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-zinc-200/60 bg-white/60 dark:border-white/10 dark:bg-surface/40">
      {/* Gradient top accent + ambient glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 h-56 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-12">
        {/* Brand */}
        <div className="lg:col-span-5">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-600 dark:text-muted">
            {f.tagline}
          </p>
          <div className="mt-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-muted">
              {f.social}
            </h3>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-zinc-300/70 text-zinc-600 transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-[var(--shadow-glow)] dark:border-white/10 dark:text-muted dark:hover:text-glow"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <LinkColumn title={f.nav} links={navLinks} />
        </div>
        <div className="lg:col-span-2">
          <LinkColumn title={f.solutionsTitle} links={solutionLinks} />
        </div>

        {/* Contact card */}
        <div className="sm:col-span-2 lg:col-span-3">
          <div className="glass-card gradient-border h-full p-5">
            <h3 className="font-display font-semibold">{f.contactTitle}</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-muted">{f.contactText}</p>
            <a
              href={`mailto:${f.email}`}
              className="mt-3 block break-all text-sm font-medium text-primary hover:text-glow"
            >
              {f.email}
            </a>
            <Link
              to="/contact"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-glow hover:shadow-[var(--shadow-glow)]"
            >
              {f.contactCta}
              <FiArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative border-t border-zinc-200/60 px-5 py-6 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-xs text-zinc-500 dark:text-muted sm:flex-row">
          <p>
            © {year} {transcript.brand.name}. {f.rights}
          </p>
          <p>{f.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}
