import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiTrash2, FiAlertTriangle, FiInbox } from "react-icons/fi";
import { transcript } from "../data/transcript.js";
import api from "../lib/api.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

const t = transcript.messages;

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setStatus("loading");
    api
      .get("/messages")
      .then((res) => {
        setMessages(res.data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markRead = async (id) => {
    try {
      const { data } = await api.patch(`/messages/${id}/read`);
      setMessages((prev) => prev.map((m) => (m._id === id ? data : m)));
      toast.success(transcript.toasts.messageRead);
    } catch {
      toast.error(transcript.toasts.actionFailed);
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await api.delete(`/messages/${deleting._id}`);
      setMessages((prev) => prev.filter((m) => m._id !== deleting._id));
      toast.success(transcript.toasts.messageDeleted);
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

        {status === "ready" && messages.length === 0 && (
          <div className="glass-card flex flex-col items-center gap-4 p-10 text-center">
            <FiInbox className="h-9 w-9 text-primary dark:text-glow" />
            <p className="text-sm text-zinc-600 dark:text-muted">{t.empty}</p>
          </div>
        )}

        {status === "ready" && messages.length > 0 && (
          <div className="space-y-4">
            {messages.map((m) => (
              <article
                key={m._id}
                className={`glass-card p-5 ${!m.read ? "border-primary/40" : ""}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="flex items-center gap-2 font-display font-semibold">
                      <span className="truncate">{m.subject}</span>
                      {!m.read && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary dark:text-glow">
                          {t.unread}
                        </span>
                      )}
                    </h2>
                    <p className="mt-0.5 text-sm text-zinc-500 dark:text-muted">
                      {m.name} · <a href={`mailto:${m.email}`} className="hover:text-primary">{m.email}</a>
                    </p>
                  </div>
                  <time className="shrink-0 text-xs text-zinc-400 dark:text-muted">
                    {new Date(m.createdAt).toLocaleString()}
                  </time>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-300">
                  {m.message}
                </p>

                <div className="mt-4 flex justify-end gap-2">
                  {!m.read && (
                    <button className="btn-ghost" onClick={() => markRead(m._id)}>
                      <FiCheck className="h-4 w-4" />
                      {t.markRead}
                    </button>
                  )}
                  <button className="btn-danger" onClick={() => setDeleting(m)}>
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
