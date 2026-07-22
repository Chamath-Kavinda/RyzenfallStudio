export default function ProjectSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="aspect-video animate-pulse bg-zinc-200 dark:bg-white/5" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-white/5" />
        <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-white/5" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-200 dark:bg-white/5" />
        <div className="flex gap-2 pt-2">
          <div className="h-5 w-14 animate-pulse rounded-full bg-zinc-200 dark:bg-white/5" />
          <div className="h-5 w-14 animate-pulse rounded-full bg-zinc-200 dark:bg-white/5" />
        </div>
      </div>
    </div>
  );
}
