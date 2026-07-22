import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCode, FiPenTool, FiPlay } from "react-icons/fi";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../lib/gsap.js";
import { transcript } from "../data/transcript.js";
import api from "../lib/api.js";
import { useWebSocket } from "../hooks/useWebSocket.js";
import AmbientBackdrop from "../components/AmbientBackdrop.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import ProjectSkeleton from "../components/ProjectSkeleton.jsx";
import Testimonials from "../components/Testimonials.jsx";

const t = transcript.home;

const serviceIcons = { web: FiCode, design: FiPenTool, game: FiPlay };

export default function Home() {
  const hero = useRef(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Only projects explicitly marked "Feature on home page" appear here.
  const featured = useMemo(
    () => projects.filter((p) => p.featured).slice(0, 6),
    [projects]
  );

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      const tl = gsap.timeline({
        defaults: { ease: "expo.out", clearProps: "transform,opacity,visibility" },
      });
      tl.from(".hero-eyebrow", { y: 24, autoAlpha: 0, duration: 1 })
        .from(".hero-title", { y: 60, scale: 0.96, autoAlpha: 0, duration: 1.6 }, "-=0.5")
        .from(".hero-subtitle", { y: 32, autoAlpha: 0, duration: 1.2 }, "-=1.05")
        .fromTo(
          ".hero-cta",
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, stagger: 0.18, duration: 1, clearProps: "transform,opacity,visibility" },
          "-=0.75"
        );
    },
    { scope: hero }
  );

  useEffect(() => {
    let active = true;
    api
      .get("/projects")
      .then((res) => active && setProjects(res.data))
      .catch(() => active && setProjects([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // Keep the featured section live when projects change in the admin.
  useWebSocket(
    useCallback(({ type, payload }) => {
      setProjects((prev) => {
        if (type === "project:created") return [payload, ...prev.filter((p) => p._id !== payload._id)];
        if (type === "project:updated") return prev.map((p) => (p._id === payload._id ? payload : p));
        if (type === "project:deleted") return prev.filter((p) => p._id !== payload._id);
        return prev;
      });
    }, [])
  );

  return (
    <>
      <section ref={hero} className="relative flex min-h-[90vh] items-center">
        <AmbientBackdrop />
        <div className="mx-auto w-full max-w-5xl px-5 py-24 text-center">
          <p className="hero-eyebrow mb-5 inline-block rounded-full border border-primary/30 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-primary dark:text-glow">
            {t.hero.eyebrow}
          </p>
          <h1 className="hero-title font-display text-[length:var(--text-display)] font-bold leading-[1.05] tracking-tight">
            <span className="gradient-text">{t.hero.title}</span>
          </h1>
          <p className="hero-subtitle mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-muted">
            {t.hero.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link to="/works" className="hero-cta btn-primary">
              {t.hero.ctaPrimary}
              <FiArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="hero-cta btn-ghost">
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading title={t.featured.title} subtitle={t.featured.subtitle} />
            <Link
              to="/works"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-glow"
            >
              {t.featured.viewAll}
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <ProjectSkeleton key={i} />)
          ) : featured.length === 0 ? (
            <p className="col-span-full py-10 text-center text-zinc-500 dark:text-muted">
              {t.featured.empty}
            </p>
          ) : (
            featured.map((p, i) => (
              <Reveal key={p._id} delay={i * 0.08}>
                <ProjectCard project={p} />
              </Reveal>
            ))
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <SectionHeading title={t.servicesStrip.title} subtitle={t.servicesStrip.subtitle} />
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {transcript.solutions.categories.map((s, i) => {
            const Icon = serviceIcons[s.key] || FiCode;
            return (
              <Reveal key={s.key} delay={i * 0.08}>
                <Link
                  to={`/solutions/${s.slug}`}
                  className="glass-card gradient-border group block h-full p-6 transition-shadow hover:shadow-[var(--shadow-glow)]"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary dark:text-glow">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-muted">{s.text}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <Testimonials />

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <Reveal>
          <div className="glass-card gradient-border relative overflow-hidden px-6 py-16 text-center">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              <span className="gradient-text">{t.cta.title}</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-zinc-600 dark:text-muted">{t.cta.subtitle}</p>
            <Link to="/contact" className="btn-primary mt-8">
              {t.cta.button}
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
