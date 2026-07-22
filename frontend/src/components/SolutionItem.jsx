import { useEffect, useRef } from "react";
import { FiChevronDown, FiArrowRight, FiCheck } from "react-icons/fi";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../lib/gsap.js";
import { transcript } from "../data/transcript.js";

const d = transcript.solutions.detail;

export default function SolutionItem({ item, index, isOpen, onToggle, onApply }) {
  const bodyRef = useRef(null);
  const firstRun = useRef(true);

  // Start collapsed without a flash before GSAP takes over.
  useGSAP(
    () => {
      gsap.set(bodyRef.current, { height: 0, autoAlpha: 0 });
    },
    { scope: bodyRef }
  );

  // Animate open/close whenever the parent-controlled state changes.
  useEffect(() => {
    const el = bodyRef.current;
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (prefersReducedMotion) {
      gsap.set(el, { height: isOpen ? "auto" : 0, autoAlpha: isOpen ? 1 : 0 });
      return;
    }
    gsap.to(el, {
      height: isOpen ? "auto" : 0,
      autoAlpha: isOpen ? 1 : 0,
      duration: isOpen ? 0.5 : 0.4,
      ease: isOpen ? "power2.out" : "power2.in",
    });
  }, [isOpen]);

  return (
    <div
      className={`glass-card gradient-border overflow-hidden transition-shadow duration-300 ${
        isOpen ? "shadow-[var(--shadow-glow)]" : ""
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-4 p-5 text-left"
      >
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border text-sm font-semibold transition-colors duration-300 ${
            isOpen
              ? "border-transparent bg-gradient-to-br from-glow to-violet-deep text-white"
              : "border-primary/30 text-primary dark:text-glow"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 font-display text-base font-semibold sm:text-lg">
          {item.title}
        </span>
        <FiChevronDown
          className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 dark:text-glow ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div ref={bodyRef} style={{ height: 0, overflow: "hidden" }}>
        <div className="border-t border-zinc-200/70 px-5 py-5 dark:border-white/10">
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-muted">
            {item.description}
          </p>

          {item.features?.length > 0 && (
            <>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-muted">
                {d.includes}
              </p>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {item.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary dark:text-glow">
                      <FiCheck className="h-3 w-3" />
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300">{f}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <button type="button" onClick={() => onApply(item)} className="btn-primary mt-6">
            {d.apply}
            <FiArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
