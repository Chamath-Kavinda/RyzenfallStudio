import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiGlobe, FiPlay, FiInbox, FiMail, FiArrowRight } from "react-icons/fi";
import { transcript } from "../data/transcript.js";
import api from "../lib/api.js";
import { useWebSocket } from "../hooks/useWebSocket.js";
import StatCard from "../components/StatCard.jsx";

const t = transcript.dashboard;

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [applications, setApplications] = useState([]);

  const loadProjects = useCallback(() => {
    api.get("/projects").then((res) => setProjects(res.data)).catch(() => {});
  }, []);

  const loadApplications = useCallback(() => {
    api.get("/applications").then((res) => setApplications(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    loadProjects();
    loadApplications();
    api.get("/messages").then((res) => setMessages(res.data)).catch(() => {});
  }, [loadProjects, loadApplications]);

  useWebSocket(
    useCallback(
      ({ type }) => {
        if (type?.startsWith("project:")) loadProjects();
        if (type === "application:created") loadApplications();
      },
      [loadProjects, loadApplications]
    )
  );

  const websites = projects.filter((p) => p.category === "website").length;
  const games = projects.filter((p) => p.category === "game").length;
  const unread = messages.filter((m) => !m.read).length;
  const newRequests = applications.filter((a) => !a.read).length;
  const latest = messages.slice(0, 5);

  const stats = [
    { label: t.stats.websites, value: websites, icon: FiGlobe },
    { label: t.stats.games, value: games, icon: FiPlay },
    { label: t.stats.unread, value: unread, icon: FiMail },
    { label: t.stats.requests, value: newRequests, icon: FiInbox },
  ];

  return (
    <div>
      <header>
        <h1 className="font-display text-2xl font-semibold">
          <span className="gradient-text">{t.title}</span>
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-muted">{t.subtitle}</p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">{t.latest.title}</h2>
          <Link
            to="/messages"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-glow"
          >
            {t.latest.viewAll}
            <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="glass-card divide-y divide-zinc-200/70 dark:divide-white/10">
          {latest.length === 0 ? (
            <p className="p-6 text-center text-sm text-zinc-500 dark:text-muted">{t.latest.empty}</p>
          ) : (
            latest.map((m) => (
              <div key={m._id} className="flex items-start justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-medium">
                    <span className="truncate">{m.subject}</span>
                    {!m.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </p>
                  <p className="truncate text-sm text-zinc-500 dark:text-muted">
                    {m.name} · {m.email}
                  </p>
                </div>
                <time className="shrink-0 text-xs text-zinc-400 dark:text-muted">
                  {new Date(m.createdAt).toLocaleDateString()}
                </time>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
