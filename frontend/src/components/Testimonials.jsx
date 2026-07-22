import { useEffect, useRef, useState } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { gsap, prefersReducedMotion } from "../lib/gsap.js";
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

function Avatar({ name }) {
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-glow to-violet-deep text-sm font-semibold text-white">
      {initials(name)}
    </span>
  );
}

// 3-or-fewer: static row with the middle card emphasized.
function Grid() {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-3 md:items-center">
      {t.items.map((item, i) => {
        const featured = t.items.length === 3 && i === 1;
        return (
          <Reveal key={item.name} delay={i * 0.08}>
            <figure
              className={`glass-card gradient-border flex h-full flex-col p-6 transition-shadow ${
                featured ? "shadow-[var(--shadow-glow)] md:scale-105 md:p-7" : ""
              }`}
            >
              <FaQuoteLeft className="h-6 w-6 text-primary/60 dark:text-glow/70" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                {item.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-zinc-200/70 pt-5 dark:border-white/10">
                <Avatar name={item.name} />
                <span className="min-w-0">
                  <span className="block truncate font-medium">{item.name}</span>
                  <span className="block truncate text-xs text-zinc-500 dark:text-muted">
                    {item.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        );
      })}
    </div>
  );
}

// 4-or-more: auto-rotating carousel.
function Carousel() {
  const [index, setIndex] = useState(0);
  const cardRef = useRef(null);
  const len = t.items.length;

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % len), 4800);
    return () => clearInterval(id);
  }, [len]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    gsap.fromTo(
      cardRef.current,
      { autoAlpha: 0, y: 24, scale: 0.98 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }
    );
  }, [index]);

  const item = t.items[index];
  const go = (n) => setIndex((n + len) % len);

  const arrow =
    "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-zinc-300/70 text-zinc-600 transition-colors hover:border-primary hover:text-primary dark:border-white/10 dark:text-muted dark:hover:text-glow";

  return (
    <div className="mx-auto mt-10 max-w-2xl">
      <figure ref={cardRef} className="glass-card gradient-border p-8 text-center sm:p-10">
        <FaQuoteLeft className="mx-auto h-7 w-7 text-primary/60 dark:text-glow/70" />
        <blockquote className="mt-5 text-lg leading-relaxed text-zinc-700 dark:text-zinc-200">
          {item.quote}
        </blockquote>
        <figcaption className="mt-6 flex flex-col items-center gap-2">
          <Avatar name={item.name} />
          <span>
            <span className="block font-medium">{item.name}</span>
            <span className="block text-xs text-zinc-500 dark:text-muted">{item.role}</span>
          </span>
        </figcaption>
      </figure>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button type="button" onClick={() => go(index - 1)} aria-label={t.prev} className={arrow}>
          <FiChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          {t.items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${t.goTo} ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-primary" : "w-2 bg-zinc-300 dark:bg-white/20"
              }`}
            />
          ))}
        </div>
        <button type="button" onClick={() => go(index + 1)} aria-label={t.next} className={arrow}>
          <FiChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const isCarousel = t.items.length >= 4;
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <Reveal>
        <SectionHeading title={t.title} subtitle={t.subtitle} />
      </Reveal>
      {isCarousel ? <Carousel /> : <Grid />}
    </section>
  );
}
