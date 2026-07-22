import { FiExternalLink } from "react-icons/fi";
import { transcript } from "../data/transcript.js";

export default function ProjectCard({ project }) {
  return (
    <article className="glass-card gradient-border group overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-glow backdrop-blur">
          {project.category === "game"
            ? transcript.works.filters.games
            : transcript.works.filters.websites}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg font-semibold">{project.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-muted">
          {project.description}
        </p>

        {project.techStack?.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-primary/30 px-2.5 py-0.5 text-xs text-primary dark:text-glow"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-glow"
          >
            {transcript.actions.viewLive}
            <FiExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
}
