import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiX, FiSend } from "react-icons/fi";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../lib/gsap.js";
import { transcript } from "../data/transcript.js";
import api from "../lib/api.js";

const a = transcript.solutions.apply;
const empty = { name: "", email: "", projectName: "", description: "" };

export default function ApplyModal({ open, solution, item, onClose }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const panelRef = useRef(null);

  useGSAP(
    () => {
      if (!open || prefersReducedMotion) return;
      gsap.from(panelRef.current, {
        y: 32,
        autoAlpha: 0,
        scale: 0.97,
        duration: 0.45,
        ease: "power3.out",
      });
    },
    { dependencies: [open], scope: panelRef }
  );

  useEffect(() => {
    if (open) {
      setForm(empty);
      setErrors({});
    }
  }, [open, item]);

  if (!open) return null;

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = {};
    if (!form.projectName.trim()) found.projectName = a.errors.projectName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) found.email = a.errors.email;
    if (!form.description.trim()) found.description = a.errors.description;
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }

    setSending(true);
    try {
      await api.post("/applications", {
        solution: solution.title,
        item: item.title,
        ...form,
      });
      toast.success(transcript.toasts.applicationSent);
      onClose();
    } catch {
      toast.error(transcript.toasts.applicationFailed);
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-300/70 bg-white/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary dark:border-white/10 dark:bg-surface/60 dark:text-text";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <form
        ref={panelRef}
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="glass-card gradient-border my-8 w-full max-w-lg p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold">{a.title}</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-muted">
              {a.forPrefix}{" "}
              <span className="font-medium text-primary dark:text-glow">{item.title}</span>{" "}
              · {solution.title}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label={a.cancel}>
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="projectName" className="mb-1.5 block text-sm font-medium">
              {a.fields.projectName}
            </label>
            <input
              id="projectName"
              name="projectName"
              value={form.projectName}
              onChange={update}
              placeholder={a.fields.projectNamePlaceholder}
              aria-invalid={!!errors.projectName}
              className={inputClass}
            />
            {errors.projectName && (
              <p className="mt-1.5 text-xs text-red-500">{errors.projectName}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                {a.fields.name}
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={update}
                placeholder={a.fields.namePlaceholder}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                {a.fields.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                placeholder={a.fields.emailPlaceholder}
                aria-invalid={!!errors.email}
                className={inputClass}
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
              {a.fields.description}
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={update}
              placeholder={a.fields.descriptionPlaceholder}
              aria-invalid={!!errors.description}
              className={`${inputClass} resize-none`}
            />
            {errors.description && (
              <p className="mt-1.5 text-xs text-red-500">{errors.description}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn-ghost" onClick={onClose} disabled={sending}>
            {a.cancel}
          </button>
          <button type="submit" className="btn-primary" disabled={sending}>
            {sending ? a.sending : a.submit}
            {!sending && <FiSend className="h-4 w-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
