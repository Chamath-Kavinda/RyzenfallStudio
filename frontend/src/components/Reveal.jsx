import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../lib/gsap.js";

/**
 * Wraps children and reveals them on scroll with a gentle rise + fade.
 */
export default function Reveal({ children, className = "", y = 40, delay = 0 }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      gsap.fromTo(
        ref.current,
        { y, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.1,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            // Replay on scroll down, reverse (reset) when scrolling back up past it.
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
