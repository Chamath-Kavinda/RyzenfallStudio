import { useState } from "react";
import { FiX } from "react-icons/fi";
import { transcript } from "../data/transcript.js";

export default function TechTagInput({ tags, onChange }) {
  const [draft, setDraft] = useState("");

  const add = (value) => {
    const tag = value.trim();
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setDraft("");
  };

  const remove = (tag) => onChange(tags.filter((t) => t !== tag));

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && !draft && tags.length) {
      remove(tags[tags.length - 1]);
    }
  };

  return (
    <div className="field flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary dark:text-glow"
        >
          {tag}
          <button type="button" onClick={() => remove(tag)} aria-label={`Remove ${tag}`}>
            <FiX className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => add(draft)}
        placeholder={transcript.projects.form.techPlaceholder}
        className="min-w-[8rem] flex-1 bg-transparent text-sm outline-none"
      />
    </div>
  );
}
