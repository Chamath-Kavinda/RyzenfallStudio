import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { transcript } from "../data/transcript.js";
import { solutionIcons } from "../lib/solutionIcons.js";
import Reveal from "../components/Reveal.jsx";
import SolutionItem from "../components/SolutionItem.jsx";
import ApplyModal from "../components/ApplyModal.jsx";

const t = transcript.solutions;
const d = t.detail;

export default function SolutionDetail() {
  const { slug } = useParams();
  const solution = t.categories.find((c) => c.slug === slug);
  const [activeItem, setActiveItem] = useState(null);
  const [openIndex, setOpenIndex] = useState(-1);

  // Collapse everything when switching between solutions.
  useEffect(() => setOpenIndex(-1), [slug]);

  if (!solution) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-32 text-center">
        <h1 className="font-display text-2xl font-semibold">{d.notFound}</h1>
        <Link to="/solutions" className="btn-primary mt-8">
          <FiArrowLeft className="h-4 w-4" />
          {d.backHome}
        </Link>
      </div>
    );
  }

  const Icon = solutionIcons[solution.key];

  return (
    <div className="mx-auto max-w-4xl px-5 py-20">
      <Reveal>
        <Link
          to="/solutions"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-glow"
        >
          <FiArrowLeft className="h-4 w-4" />
          {d.back}
        </Link>

        <div className="mt-6 flex items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary dark:text-glow">
            <Icon className="h-8 w-8" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              <span className="gradient-text">{solution.title}</span>
            </h1>
            <p className="mt-1 text-zinc-600 dark:text-muted">{solution.text}</p>
          </div>
        </div>
      </Reveal>

      <div className="mt-12">
        <Reveal>
          <h2 className="font-display text-xl font-semibold">{d.itemsTitle}</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-muted">{d.itemsSubtitle}</p>
        </Reveal>

        <div className="mt-6 space-y-3">
          {solution.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <SolutionItem
                item={item}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex((cur) => (cur === i ? -1 : i))}
                onApply={setActiveItem}
              />
            </Reveal>
          ))}
        </div>
      </div>

      <ApplyModal
        open={!!activeItem}
        solution={solution}
        item={activeItem || { title: "" }}
        onClose={() => setActiveItem(null)}
      />
    </div>
  );
}
