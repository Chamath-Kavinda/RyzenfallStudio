import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiTrash2, FiAlertTriangle, FiInbox, FiLayers } from "react-icons/fi";
import { transcript } from "../data/transcript.js";
import api from "../lib/api.js";
import { useWebSocket } from "../hooks/useWebSocket.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

const t = transcript.applications;

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setStatus("loading");
    api
      .get("/applications")
      .then((res) => {
        setApplications(res.data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Live: new requests appear without a refresh.
  useWebSocket(
    useCallback(({ type, payload }) => {
      if (type === "application:created") {
        setApplications((prev) => [payload, ...prev.filter((a) => a._id !== payload._id)]);
      }
    }, [])
  );

  const markRead = async (id) => {
    try {
      const { data } = await api.patch(`/applications/${id}/read`);
      setApplications((prev) => prev.map((a) => (a._id === id ? data : a)));
      toast.success(transcript.toasts.applicationRead);
    } catch {
      toast.error(transcript.toasts.actionFailed);
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await api.delete(`/applications/${deleting._id}`);
      setApplications((prev) => prev.filter((a) => a._id !== deleting._id));
      toast.success(transcript.toasts.applicationDeleted);
      setDeleting(null);
    } catch {
      toast.error(transcript.toasts.actionFailed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <header>
        <h1 className="font-display text-2xl font-semibold">
          <span className="gradient-text">{t.title}</span>
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-muted">{t.subtitle}</p>
      </header>

      <div className="mt-8">
        {status === "loading" && (
          <div className="glass-card p-10 text-center text-sm text-zinc-500 dark:text-muted">
            {t.loading}
          </div>
        )}

        {status === "error" && (
          <div className="glass-card flex flex-col items-center gap-4 p-10 text-center">
            <FiAlertTriangle className="h-9 w-9 text-primary dark:text-glow" />
            <p className="text-sm text-zinc-600 dark:text-muted">{t.error}</p>
            <button className="btn-ghost" onClick={load}>{t.retry}</button>
          </div>
        )}

        {status === "ready" && applications.length === 0 && (
          <div className="glass-card flex flex-col items-center gap-4 p-10 text-center">
            <FiInbox className="h-9 w-9 text-primary dark:text-glow" />
            <p className="text-sm text-zinc-600 dark:text-muted">{t.empty}</p>
          </div>
        )}

        {status === "ready" && applications.length > 0 && (
          <div className="space-y-4">
            {applications.map((a) => (
              <article
                key={a._id}
                className={`glass-card p-5 ${!a.read ? "border-primary/40" : ""}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="flex flex-wrap items-center gap-2 font-display font-semibold">
                      <span className="inline-flex items-center gap-1.5 text-primary dark:text-glow">
                        <FiLayers className="h-4 w-4" />
                        {a.solution || "—"}
                      </span>
                      {a.item && (
                        <span className="rounded-full border border-primary/30 px-2.5 py-0.5 text-xs font-medium text-primary dark:text-glow">
                          {a.item}
                        </span>
                      )}
                      {!a.read && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary dark:text-glow">
                          {t.unread}
                        </span>
                      )}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-muted">
                      {t.project}: <span className="font-medium text-zinc-700 dark:text-zinc-300">{a.projectName}</span>
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-muted">
                      {t.from}: {a.name ? `${a.name} · ` : ""}
                      <a href={`mailto:${a.email}`} className="hover:text-primary">{a.email}</a>
                    </p>
                  </div>
                  <time className="shrink-0 text-xs text-zinc-400 dark:text-muted">
                    {new Date(a.createdAt).toLocaleString()}
                  </time>
                </div>

                <p className="mt-3 whitespace-pre-wrap border-t border-zinc-200/70 pt-3 text-sm text-zinc-600 dark:border-white/10 dark:text-zinc-300">
                  {a.description}
                </p>

                <div className="mt-4 flex justify-end gap-2">
                  {!a.read && (
                    <button className="btn-ghost" onClick={() => markRead(a._id)}>
                      <FiCheck className="h-4 w-4" />
                      {t.markRead}
                    </button>
                  )}
                  <button className="btn-danger" onClick={() => setDeleting(a)}>
                    <FiTrash2 className="h-4 w-4" />
                    {t.delete}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleting}
        title={t.confirm.title}
        text={t.confirm.text}
        confirmLabel={t.confirm.confirm}
        cancelLabel={t.confirm.cancel}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
