import {
  SiReact,
  SiJavascript,
  SiNodedotjs,
  SiMongodb,
  SiTailwindcss,
  SiVite,
  SiUnity,
  SiGodotengine,
  SiBlender,
  SiExpress,
} from "react-icons/si";
import { transcript } from "../data/transcript.js";
import Reveal from "../components/Reveal.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { FiCode, FiPlay } from "react-icons/fi";

const t = transcript.about;

const stack = [
  { icon: SiReact, label: "React" },
  { icon: SiJavascript, label: "JavaScript" },
  { icon: SiNodedotjs, label: "Node.js" },
  { icon: SiExpress, label: "Express" },
  { icon: SiMongodb, label: "MongoDB" },
  { icon: SiTailwindcss, label: "Tailwind" },
  { icon: SiVite, label: "Vite" },
  { icon: SiUnity, label: "Unity" },
  { icon: SiGodotengine, label: "Godot" },
  { icon: SiBlender, label: "Blender" },
];

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-20">
      <Reveal>
        <SectionHeading title={t.title} subtitle={t.intro} />
      </Reveal>

      <Reveal className="mt-8">
        <p className="max-w-3xl leading-relaxed text-zinc-600 dark:text-zinc-300">{t.story}</p>
      </Reveal>

      <div className="mt-14">
        <Reveal>
          <h3 className="font-display text-2xl font-semibold">{t.dual.title}</h3>
        </Reveal>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {[
            { icon: FiCode, ...t.dual.web },
            { icon: FiPlay, ...t.dual.game },
          ].map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="glass-card gradient-border h-full p-6">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary dark:text-glow">
                  <Icon className="h-6 w-6" />
                </span>
                <h4 className="mt-4 font-display text-lg font-semibold">{title}</h4>
                <p className="mt-2 text-sm text-zinc-600 dark:text-muted">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <Reveal>
          <h3 className="font-display text-2xl font-semibold">{t.stack.title}</h3>
        </Reveal>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {stack.map(({ icon: Icon, label }, i) => (
            <Reveal key={label} delay={i * 0.04} className="w-24 sm:w-28">
              <div className="glass-card flex h-full flex-col items-center gap-2 p-4 text-center">
                <Icon className="h-8 w-8 text-primary dark:text-glow" />
                <span className="text-xs text-zinc-600 dark:text-muted">{label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
