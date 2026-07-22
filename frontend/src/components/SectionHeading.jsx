export default function SectionHeading({ title, subtitle, align = "left" }) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        <span className="gradient-text">{title}</span>
      </h2>
      {subtitle && (
        <p
          className={`mt-3 max-w-2xl text-zinc-600 dark:text-muted ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
