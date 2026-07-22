import { useState } from "react";
import toast from "react-hot-toast";
import { FiSend, FiMail } from "react-icons/fi";
import { transcript } from "../data/transcript.js";
import api from "../lib/api.js";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

const t = transcript.contact;

const emptyForm = { name: "", email: "", subject: "", message: "" };

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = t.errors.name;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = t.errors.email;
  if (!form.subject.trim()) errors.subject = t.errors.subject;
  if (!form.message.trim()) errors.message = t.errors.message;
  return errors;
}

const fields = [
  { name: "name", type: "text", label: t.form.name, placeholder: t.form.namePlaceholder },
  { name: "email", type: "email", label: t.form.email, placeholder: t.form.emailPlaceholder },
  { name: "subject", type: "text", label: t.form.subject, placeholder: t.form.subjectPlaceholder },
];

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    setSending(true);
    try {
      await api.post("/messages", form);
      toast.success(transcript.toasts.messageSent);
      setForm(emptyForm);
    } catch {
      toast.error(transcript.toasts.messageFailed);
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-300/70 bg-white/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary dark:border-white/10 dark:bg-surface/60 dark:text-text";

  return (
    <div className="mx-auto max-w-5xl px-5 py-20">
      <Reveal>
        <SectionHeading title={t.title} subtitle={t.subtitle} />
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <form onSubmit={submit} noValidate className="glass-card gradient-border space-y-5 p-6">
            {fields.map((f) => (
              <div key={f.name}>
                <label htmlFor={f.name} className="mb-1.5 block text-sm font-medium">
                  {f.label}
                </label>
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type}
                  value={form[f.name]}
                  onChange={update}
                  placeholder={f.placeholder}
                  aria-invalid={!!errors[f.name]}
                  className={inputClass}
                />
                {errors[f.name] && (
                  <p className="mt-1.5 text-xs text-red-500">{errors[f.name]}</p>
                )}
              </div>
            ))}

            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                {t.form.message}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={update}
                placeholder={t.form.messagePlaceholder}
                aria-invalid={!!errors.message}
                className={`${inputClass} resize-none`}
              />
              {errors.message && <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>}
            </div>

            <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-60">
              {sending ? t.form.sending : t.form.submit}
              {!sending && <FiSend className="h-4 w-4" />}
            </button>
          </form>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass-card h-full p-6">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary dark:text-glow">
              <FiMail className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold">{t.info.title}</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-muted">{t.info.text}</p>
            <a
              href="mailto:hello@ryzenfallstudio.com"
              className="mt-4 inline-block text-sm font-medium text-primary hover:text-glow"
            >
              hello@ryzenfallstudio.com
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
