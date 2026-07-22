import { useCallback, useEffect, useMemo, useState } from "react";
import { FiAlertTriangle, FiInbox } from "react-icons/fi";
import { transcript } from "../data/transcript.js";
import api from "../lib/api.js";
import { useWebSocket } from "../hooks/useWebSocket.js";
import ProjectCard from "../components/ProjectCard.jsx";
import ProjectSkeleton from "../components/ProjectSkeleton.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

const t = transcript.works;

const filters = [
  { key: "all", label: t.filters.all },
  { key: "website", label: t.filters.websites },
  { key: "game", label: t.filters.games },
];

export default function Works() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [filter, setFilter] = useState("all");

  const load = useCallback(() => {
    setStatus("loading");
    api
      .get("/projects")
      .then((res) => {
        setProjects(res.data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Live updates from the backend WebSocket.
  useWebSocket(
    useCallback(({ type, payload }) => {
      setProjects((prev) => {
        if (type === "project:created") return [payload, ...prev];
        if (type === "project:updated")
          return prev.map((p) => (p._id === payload._id ? payload : p));
        if (type === "project:deleted") return prev.filter((p) => p._id !== payload._id);
        return prev;
      });
    }, [])
  );

  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [projects, filter]
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <Reveal>
        <SectionHeading title={t.title} subtitle={t.subtitle} />
      </Reveal>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label={t.title}>
        {filters.map((f) => (
          <button
            key={f.key}
            role="tab"
            aria-selected={filter === f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              filter === f.key
                ? "bg-primary text-white shadow-[var(--shadow-glow)]"
                : "border border-zinc-300/70 text-zinc-600 hover:border-primary hover:text-primary dark:border-white/10 dark:text-muted dark:hover:text-glow"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {status === "loading" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectSkeleton key={i} />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="glass-card flex flex-col items-center gap-4 px-6 py-16 text-center">
            <FiAlertTriangle className="h-10 w-10 text-primary dark:text-glow" />
            <p className="text-zinc-600 dark:text-muted">{t.error}</p>
            <button onClick={load} className="btn-ghost">
              {t.retry}
            </button>
          </div>
        )}

        {status === "ready" && visible.length === 0 && (
          <div className="glass-card flex flex-col items-center gap-4 px-6 py-16 text-center">
            <FiInbox className="h-10 w-10 text-primary dark:text-glow" />
            <p className="text-zinc-600 dark:text-muted">{t.empty}</p>
          </div>
        )}

        {status === "ready" && visible.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p, i) => (
              <Reveal key={p._id} delay={(i % 3) * 0.06}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
