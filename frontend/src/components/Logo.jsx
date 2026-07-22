import { transcript } from "../data/transcript.js";

export default function Logo({ withText = true, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src="/logo-placeholder.svg"
        alt={`${transcript.brand.name} logo`}
        className="h-9 w-9"
      />
      {withText && (
        <span className="font-display text-lg font-semibold tracking-tight">
          {transcript.brand.name}
        </span>
      )}
    </span>
  );
}
