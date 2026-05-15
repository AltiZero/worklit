function Skeleton({ className }: { className?: string }) {
  return <div className={`rounded-[var(--radius)] bg-bg-alt animate-pulse ${className ?? ""}`} />;
}

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-7">
      {/* Hero */}
      <header className="flex items-end justify-between gap-6 pt-1">
        <div>
          <Skeleton className="h-3 w-32 mb-3" />
          <Skeleton className="h-10 w-64 mb-3" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-[42px] w-[140px] rounded-[var(--radius)]" />
      </header>

      {/* Two-column */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
        <div className="flex flex-col gap-7">
          <section>
            <Skeleton className="h-3 w-20 mb-4" />
            <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-[22px] py-[15px] ${i < 4 ? "border-b border-border" : ""}`}
                >
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-48 mb-1.5" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <Skeleton className="h-3 w-16 mb-4" />
            <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3.5 px-[22px] py-[14px] ${i < 3 ? "border-b border-border" : ""}`}
                >
                  <Skeleton className="h-1.5 w-1.5 rounded-full" />
                  <Skeleton className="h-3 flex-1" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-5">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px] flex flex-col gap-5"
            >
              <Skeleton className="h-3 w-20" />
              <div>
                <Skeleton className="h-10 w-40 mb-3" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="flex flex-col gap-2.5 pt-[18px] border-t border-border">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-[42px] w-full rounded-[var(--radius)]" />
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
