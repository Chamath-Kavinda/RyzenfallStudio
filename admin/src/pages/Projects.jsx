import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiAlertTriangle, FiInbox } from "react-icons/fi";
import { transcript } from "../data/transcript.js";
import api from "../lib/api.js";
import { useWebSocket } from "../hooks/useWebSocket.js";
import ProjectModal from "../components/ProjectModal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

const t = transcript.projects;

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

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

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setModalOpen(true);
  };

  const save = async (formData) => {
    setBusy(true);
    try {
      if (editing) {
        await api.put(`/projects/${editing._id}`, formData);
        toast.success(transcript.toasts.projectUpdated);
      } else {
        await api.post("/projects", formData);
        toast.success(transcript.toasts.projectCreated);
      }
      setModalOpen(false);
      setEditing(null);
      load();
    } catch {
      toast.error(transcript.toasts.projectFailed);
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await api.delete(`/projects/${deleting._id}`);
      toast.success(transcript.toasts.projectDeleted);
      setDeleting(null);
      load();
    } catch {
      toast.error(transcript.toasts.actionFailed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            <span className="gradient-text">{t.title}</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-muted">{t.subtitle}</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <FiPlus className="h-4 w-4" />
          {t.add}
        </button>
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

        {status === "ready" && projects.length === 0 && (
          <div className="glass-card flex flex-col items-center gap-4 p-10 text-center">
            <FiInbox className="h-9 w-9 text-primary dark:text-glow" />
            <p className="text-sm text-zinc-600 dark:text-muted">{t.empty}</p>
          </div>
        )}

        {status === "ready" && projects.length > 0 && (
          <div className="glass-card overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-zinc-200/70 text-xs uppercase tracking-wide text-zinc-500 dark:border-white/10 dark:text-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">{t.table.title}</th>
                  <th className="px-5 py-3 font-medium">{t.table.category}</th>
                  <th className="px-5 py-3 font-medium">{t.table.link}</th>
                  <th className="px-5 py-3 text-right font-medium">{t.table.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/70 dark:divide-white/10">
                {projects.map((p) => (
                  <tr key={p._id}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {p.image && (
                          <img src={p.image} alt="" className="h-10 w-14 shrink-0 rounded object-cover" />
                        )}
                        <span className="font-medium">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full border border-primary/30 px-2.5 py-0.5 text-xs text-primary dark:text-glow">
                        {p.category === "game" ? t.form.game : t.form.website}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {p.link ? (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:text-glow"
                        >
                          <FiExternalLink className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          aria-label={`${t.edit} ${p.title}`}
                          className="grid h-8 w-8 place-items-center rounded-lg border border-zinc-300/70 text-zinc-600 transition-colors hover:text-primary dark:border-white/10 dark:text-muted dark:hover:text-glow"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleting(p)}
                          aria-label={`${t.delete} ${p.title}`}
                          className="grid h-8 w-8 place-items-center rounded-lg border border-red-500/30 text-red-500 transition-colors hover:bg-red-500/10"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProjectModal
        open={modalOpen}
        project={editing}
        busy={busy}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={save}
      />

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
