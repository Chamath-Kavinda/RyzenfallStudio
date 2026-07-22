import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../lib/gsap.js";
import { transcript } from "../data/transcript.js";

const items = transcript.home.marquee.items;

export default function Marquee() {
  const track = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      // Content is duplicated, so a -50% shift loops seamlessly.
      gsap.to(track.current, { xPercent: -50, ease: "none", duration: 22, repeat: -1 });
    },
    { scope: track }
  );

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-zinc-200/60 py-6 dark:border-white/10"
    >
      <div ref={track} className="flex w-max items-center gap-8 pr-8">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-8">
            <span className="font-display text-lg font-medium text-zinc-500 dark:text-muted">
              {item}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
          </div>
        ))}
      </div>

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent sm:w-28 dark:from-ink" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent sm:w-28 dark:from-ink" />
    </div>
  );
}
