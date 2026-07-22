import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiUserPlus, FiTrash2, FiAlertTriangle, FiInbox, FiUser } from "react-icons/fi";
import { transcript } from "../data/transcript.js";
import api from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import UserModal from "../components/UserModal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

const t = transcript.users;

export default function Users() {
  const { admin } = useAuth();
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setStatus("loading");
    api
      .get("/users")
      .then((res) => {
        setUsers(res.data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (form) => {
    setBusy(true);
    try {
      await api.post("/users", form);
      toast.success(transcript.toasts.userCreated);
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || transcript.toasts.userFailed);
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await api.delete(`/users/${deleting._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== deleting._id));
      toast.success(transcript.toasts.userDeleted);
      setDeleting(null);
    } catch (err) {
      toast.error(err.response?.data?.message || transcript.toasts.actionFailed);
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
        <button className="btn-primary" onClick={() => setModalOpen(true)}>
          <FiUserPlus className="h-4 w-4" />
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

        {status === "ready" && users.length === 0 && (
          <div className="glass-card flex flex-col items-center gap-4 p-10 text-center">
            <FiInbox className="h-9 w-9 text-primary dark:text-glow" />
            <p className="text-sm text-zinc-600 dark:text-muted">{t.empty}</p>
          </div>
        )}

        {status === "ready" && users.length > 0 && (
          <div className="glass-card overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-b border-zinc-200/70 text-xs uppercase tracking-wide text-zinc-500 dark:border-white/10 dark:text-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">{t.table.email}</th>
                  <th className="px-5 py-3 font-medium">{t.table.added}</th>
                  <th className="px-5 py-3 text-right font-medium">{t.table.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/70 dark:divide-white/10">
                {users.map((u) => {
                  const isSelf = admin?.id === u._id;
                  return (
                    <tr key={u._id}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary dark:text-glow">
                            <FiUser className="h-4 w-4" />
                          </span>
                          <span className="font-medium">{u.email}</span>
                          {isSelf && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary dark:text-glow">
                              {t.you}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-zinc-500 dark:text-muted">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end">
                          <button
                            onClick={() => setDeleting(u)}
                            disabled={isSelf}
                            aria-label={`${t.delete} ${u.email}`}
                            className="grid h-8 w-8 place-items-center rounded-lg border border-red-500/30 text-red-500 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserModal
        open={modalOpen}
        busy={busy}
        onClose={() => setModalOpen(false)}
        onSubmit={create}
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
