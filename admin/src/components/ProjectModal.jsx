import { useEffect, useRef, useState } from "react";
import { FiX, FiUploadCloud } from "react-icons/fi";
import { transcript } from "../data/transcript.js";
import TechTagInput from "./TechTagInput.jsx";

const f = transcript.projects.form;

const blank = {
  title: "",
  category: "website",
  description: "",
  techStack: [],
  link: "",
  featured: false,
};

export default function ProjectModal({ open, project, onClose, onSubmit, busy }) {
  const [form, setForm] = useState(blank);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    if (project) {
      setForm({
        title: project.title || "",
        category: project.category || "website",
        description: project.description || "",
        techStack: project.techStack || [],
        link: project.link || "",
        featured: !!project.featured,
      });
      setPreview(project.image || "");
    } else {
      setForm(blank);
      setPreview("");
    }
    setFile(null);
  }, [open, project]);

  // Revoke object URLs to avoid leaks when a new file is chosen.
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!open) return null;

  const update = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", form.title);
    data.append("category", form.category);
    data.append("description", form.description);
    data.append("link", form.link);
    data.append("featured", String(form.featured));
    data.append("techStack", JSON.stringify(form.techStack));
    if (file) data.append("image", file);
    onSubmit(data);
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="glass-card my-8 w-full max-w-lg p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            {project ? f.editTitle : f.createTitle}
          </h2>
          <button type="button" onClick={onClose} aria-label={f.cancel}>
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium">{f.title}</label>
            <input
              id="title"
              name="title"
              required
              value={form.title}
              onChange={update}
              placeholder={f.titlePlaceholder}
              className="field"
            />
          </div>

          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-medium">{f.category}</label>
            <select id="category" name="category" value={form.category} onChange={update} className="field">
              <option value="website">{f.website}</option>
              <option value="game">{f.game}</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium">{f.description}</label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              value={form.description}
              onChange={update}
              placeholder={f.descriptionPlaceholder}
              className="field resize-none"
            />
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium">{f.tech}</span>
            <TechTagInput
              tags={form.techStack}
              onChange={(techStack) => setForm((prev) => ({ ...prev, techStack }))}
            />
          </div>

          <div>
            <label htmlFor="link" className="mb-1.5 block text-sm font-medium">{f.link}</label>
            <input
              id="link"
              name="link"
              type="url"
              value={form.link}
              onChange={update}
              placeholder={f.linkPlaceholder}
              className="field"
            />
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium">{f.image}</span>
            <div className="flex items-center gap-4">
              <div className="grid h-20 w-28 shrink-0 place-items-center overflow-hidden rounded-lg border border-dashed border-zinc-300/70 dark:border-white/10">
                {preview ? (
                  <img src={preview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <FiUploadCloud className="h-6 w-6 text-zinc-400" />
                )}
              </div>
              <div>
                <button type="button" className="btn-ghost" onClick={() => fileRef.current?.click()}>
                  {f.image}
                </button>
                <p className="mt-1.5 text-xs text-zinc-500 dark:text-muted">{f.imageHint}</p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={update}
              className="h-4 w-4 accent-[var(--color-primary)]"
            />
            {f.featured}
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn-ghost" onClick={onClose} disabled={busy}>
            {f.cancel}
          </button>
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? f.saving : f.save}
          </button>
        </div>
      </form>
    </div>
  );
}
