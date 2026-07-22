import { useEffect, useState } from "react";
import { FiX, FiEye, FiEyeOff, FiUserPlus } from "react-icons/fi";
import { transcript } from "../data/transcript.js";

const f = transcript.users.form;
const empty = { email: "", password: "" };

export default function UserModal({ open, onClose, onSubmit, busy }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(empty);
      setErrors({});
      setShow(false);
    }
  }, [open]);

  if (!open) return null;

  const update = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const submit = (e) => {
    e.preventDefault();
    const found = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) found.email = f.errors.email;
    if (form.password.length < 6) found.password = f.errors.password;
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    onSubmit(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="glass-card w-full max-w-sm p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">{f.title}</h2>
          <button type="button" onClick={onClose} aria-label={f.cancel}>
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="user-email" className="mb-1.5 block text-sm font-medium">
              {f.email}
            </label>
            <input
              id="user-email"
              name="email"
              type="email"
              value={form.email}
              onChange={update}
              placeholder={f.emailPlaceholder}
              aria-invalid={!!errors.email}
              className="field"
            />
            {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="user-password" className="mb-1.5 block text-sm font-medium">
              {f.password}
            </label>
            <div className="relative">
              <input
                id="user-password"
                name="password"
                type={show ? "text" : "password"}
                value={form.password}
                onChange={update}
                placeholder={f.passwordPlaceholder}
                aria-invalid={!!errors.password}
                className="field pr-11"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? f.hidePassword : f.showPassword}
                className="absolute inset-y-0 right-0 grid w-11 place-items-center text-zinc-500 transition-colors hover:text-primary dark:text-muted dark:hover:text-glow"
              >
                {show ? <FiEyeOff className="h-4.5 w-4.5" /> : <FiEye className="h-4.5 w-4.5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn-ghost" onClick={onClose} disabled={busy}>
            {f.cancel}
          </button>
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? f.saving : f.save}
            {!busy && <FiUserPlus className="h-4 w-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
