import { FaQuoteLeft } from "react-icons/fa";
import { transcript } from "../data/transcript.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

const t = transcript.home.testimonials;

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <Reveal>
        <SectionHeading title={t.title} subtitle={t.subtitle} />
      </Reveal>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {t.items.map((item, i) => (
          <Reveal key={item.name} delay={i * 0.08}>
            <figure className="glass-card gradient-border flex h-full flex-col p-6">
              <FaQuoteLeft className="h-6 w-6 text-primary/60 dark:text-glow/70" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                {item.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-zinc-200/70 pt-5 dark:border-white/10">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-glow to-violet-deep text-sm font-semibold text-white">
                  {initials(item.name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{item.name}</span>
                  <span className="block truncate text-xs text-zinc-500 dark:text-muted">
                    {item.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
