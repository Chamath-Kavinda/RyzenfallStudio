import { transcript } from "../data/transcript.js";

export default function Logo({ withText = true }) {
  return (
    <span className="inline-flex items-center gap-2">
      <img src="/logo-placeholder.svg" alt={`${transcript.brand.name} logo`} className="h-9 w-9" />
      {withText && (
        <span className="font-display text-base font-semibold tracking-tight">
          {transcript.brand.name}
          <span className="ml-1.5 text-xs font-medium text-primary dark:text-glow">
            {transcript.brand.suffix}
          </span>
        </span>
      )}
    </span>
  );
}
