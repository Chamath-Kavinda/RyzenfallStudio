import { Link } from "react-router-dom";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { transcript } from "../data/transcript.js";
import { solutionIcons } from "../lib/solutionIcons.js";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

const t = transcript.solutions;

export default function Solutions() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <Reveal>
        <SectionHeading title={t.title} subtitle={t.subtitle} align="center" />
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {t.categories.map((cat, i) => {
          const Icon = solutionIcons[cat.key];
          return (
            <Reveal key={cat.slug} delay={i * 0.08}>
              <Link
                to={`/solutions/${cat.slug}`}
                className="glass-card gradient-border group flex h-full flex-col p-7 transition-shadow hover:shadow-[var(--shadow-glow)]"
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary dark:text-glow">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold">{cat.title}</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-muted">{cat.text}</p>

                <ul className="mt-5 space-y-2 border-t border-zinc-200/70 pt-5 dark:border-white/10">
                  {cat.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm">
                      <FiCheck className="h-4 w-4 shrink-0 text-primary dark:text-glow" />
                      <span className="text-zinc-600 dark:text-zinc-300">{p}</span>
                    </li>
                  ))}
                </ul>

                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary dark:text-glow">
                  {t.explore}
                  <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
