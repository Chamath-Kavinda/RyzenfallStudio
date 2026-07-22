import { FiAlertTriangle } from "react-icons/fi";

export default function ConfirmDialog({ open, title, text, confirmLabel, cancelLabel, onConfirm, onCancel, busy }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div className="glass-card w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <span className="grid h-11 w-11 place-items-center rounded-full bg-red-500/10 text-red-500">
          <FiAlertTriangle className="h-5 w-5" />
        </span>
        <h2 className="mt-4 font-display text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-muted">{text}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-ghost" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
          <button className="btn-danger" onClick={onConfirm} disabled={busy}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
