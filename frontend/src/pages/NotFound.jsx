import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { transcript } from "../data/transcript.js";

const t = transcript.notFound;

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-32 text-center">
      <p className="font-display text-7xl font-bold gradient-text">404</p>
      <h1 className="mt-6 font-display text-3xl font-semibold">{t.title}</h1>
      <p className="mt-3 text-zinc-600 dark:text-muted">{t.subtitle}</p>
      <Link to="/" className="btn-primary mt-8">
        <FiArrowLeft className="h-4 w-4" />
        {t.button}
      </Link>
    </div>
  );
}
