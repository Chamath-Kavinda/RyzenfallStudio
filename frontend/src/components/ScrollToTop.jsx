import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { prefersReducedMotion } from "../lib/gsap.js";

// Scrolls to the top on every route change — smoothly, unless reduced motion is preferred.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, [pathname]);

  return null;
}
