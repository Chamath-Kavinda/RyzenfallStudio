export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="glass-card flex items-center gap-4 p-5">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary dark:text-glow">
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-sm text-zinc-500 dark:text-muted">{label}</p>
      </div>
    </div>
  );
}
