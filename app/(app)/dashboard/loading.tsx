function Skeleton({ className }: { className?: string }) {
  return <div className={`rounded-[var(--radius)] bg-bg-alt animate-pulse ${className ?? ""}`} />;
}

export default function DashboardLoading() {
  return (
    <>
      {/* Header skeleton */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <Skeleton className="h-3 w-16 mb-2" />
          <Skeleton className="h-7 w-28" />
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-[280px] rounded-[var(--radius)]" />
          <Skeleton className="h-[34px] w-[34px] rounded-lg" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      </header>

      {/* KPI row skeleton */}
      <section className="grid grid-cols-4 gap-[18px]">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px] flex flex-col gap-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-28 my-1" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </section>

      {/* Content grid skeleton */}
      <section className="grid grid-cols-[1.5fr_1fr] gap-[18px]">
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px]">
          <div className="flex justify-between mb-4">
            <div>
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-7 w-[120px] rounded-lg" />
          </div>
          <Skeleton className="h-[140px] w-full rounded-lg" />
        </div>

        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px]">
          <Skeleton className="h-7 w-[200px] rounded-full mb-4" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[52px] w-full mb-2" />
          ))}
        </div>

        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px]">
          <Skeleton className="h-5 w-24 mb-4" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[44px] w-full mb-1" />
          ))}
        </div>

        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px]">
          <Skeleton className="h-5 w-20 mb-4" />
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-[48px] w-full mb-1" />
          ))}
        </div>
      </section>
    </>
  );
}
