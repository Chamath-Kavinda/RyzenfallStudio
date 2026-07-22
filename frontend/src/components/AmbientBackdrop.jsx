import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../lib/gsap.js";

/**
 * Slow ambient hero backdrop: drifting neon orbs over a faint perspective grid.
 * Purely decorative — hidden from assistive tech and stilled for reduced motion.
 */
export default function AmbientBackdrop() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      gsap.to(".orb-a", { x: 60, y: -40, duration: 14, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".orb-b", { x: -50, y: 50, duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".orb-c", { x: 40, y: 30, duration: 22, repeat: -1, yoyo: true, ease: "sine.inOut" });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="orb-a absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary/30 blur-[90px] dark:bg-primary/40"
      />
      <div
        className="orb-b absolute right-0 top-32 h-80 w-80 rounded-full bg-violet-deep/30 blur-[100px] dark:bg-violet-deep/40"
      />
      <div
        className="orb-c absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-glow/20 blur-[90px] dark:bg-glow/30"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 opacity-[0.15] dark:opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(168,85,247,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          transform: "perspective(340px) rotateX(60deg)",
          transformOrigin: "bottom",
          maskImage: "linear-gradient(to top, black, transparent)",
          WebkitMaskImage: "linear-gradient(to top, black, transparent)",
        }}
      />
    </div>
  );
}
