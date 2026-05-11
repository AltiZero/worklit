import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";

function fmtMoney(n: number) {
  return "$" + n.toLocaleString();
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Mock revenue data — the invoice system isn't built yet.
const MOCK_REVENUE = {
  thisMonth: 12840,
  lastMonth: 10850,
  trend: [
    { month: -5, value: 8200 },
    { month: -4, value: 9400 },
    { month: -3, value: 10100 },
    { month: -2, value: 10850 },
    { month: -1, value: 11800 },
    { month: 0, value: 12840 },
  ] as { month: number; value: number }[],
};

function DeltaBadge({ pct }: { pct: number }) {
  const isPositive = pct >= 0;
  return (
    <span
      className={`inline-flex items-center gap-[3px] text-[11px] font-semibold py-[3px] px-[8px] rounded-full border ${
        isPositive
          ? "bg-green-light text-green-dark border-green-mid"
          : "bg-bg-alt text-text-mid border-border-mid"
      }`}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isPositive ? "" : "rotate-180"}
      >
        <path d="M5 12l7-7 7 7M12 5v14" />
      </svg>
      {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

function StatCard({
  eyebrow,
  value,
  sub,
  delta,
}: {
  eyebrow: string;
  value: string;
  sub?: string;
  delta?: number;
}) {
  return (
    <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px]">
      <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-green mb-1">
        {eyebrow}
      </div>
      <div className="flex items-baseline gap-3">
        <div className="font-heading text-[28px] tracking-[-0.02em] text-text leading-none">
          {value}
        </div>
        {delta !== undefined && <DeltaBadge pct={delta} />}
      </div>
      {sub && (
        <div className="text-[13px] text-text-mid mt-1.5">{sub}</div>
      )}
    </div>
  );
}

export default async function ReportsPage() {
  const user = await requireAuth();

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    include: { scopeItems: true },
  });

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "ACTIVE").length;
  const completedProjects = projects.filter((p) => p.status === "COMPLETED").length;

  const allScopeItems = projects.flatMap((p) => p.scopeItems);
  const totalItems = allScopeItems.length;
  const approvedItems = allScopeItems.filter((s) => s.status === "APPROVED").length;
  const pendingItems = allScopeItems.filter((s) => s.status === "PENDING").length;
  const approvalRate = totalItems > 0 ? Math.round((approvedItems / totalItems) * 100) : 0;

  const pctChange = MOCK_REVENUE.lastMonth > 0
    ? ((MOCK_REVENUE.thisMonth - MOCK_REVENUE.lastMonth) / MOCK_REVENUE.lastMonth) * 100
    : 0;

  const now = new Date();
  const currentMonthIndex = now.getMonth();

  const maxValue = Math.max(...MOCK_REVENUE.trend.map((t) => t.value), 1);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-green mb-2">
          Insights
        </div>
        <h1 className="font-heading text-[32px] tracking-[-0.02em] leading-none text-text">
          Reports
        </h1>
      </div>

      {/* Summary cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
        {/* Revenue this month */}
        <StatCard
          eyebrow="Revenue"
          value={fmtMoney(MOCK_REVENUE.thisMonth)}
          delta={pctChange}
          sub="vs. last month"
        />

        {/* Projects */}
        <StatCard
          eyebrow="Projects"
          value={String(totalProjects)}
          sub={`${activeProjects} active · ${completedProjects} completed`}
        />

        {/* Approval rate */}
        <StatCard
          eyebrow="Approval rate"
          value={totalItems > 0 ? `${approvalRate}%` : "—"}
          sub={
            totalItems > 0
              ? `${approvedItems} of ${totalItems} items approved`
              : "No scope items yet"
          }
        />

        {/* Pending items */}
        <StatCard
          eyebrow="Pending"
          value={String(pendingItems)}
          sub={
            pendingItems > 0
              ? `${pendingItems} item${pendingItems !== 1 ? "s" : ""} awaiting review`
              : "All caught up"
          }
        />
      </div>

      {/* Monthly trend */}
      <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px]">
        <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-green mb-1">
          Trend
        </div>
        <div className="flex items-end gap-3 mt-5 h-[140px]">
          {MOCK_REVENUE.trend.map((t) => {
            const heightPct = (t.value / maxValue) * 100;
            const monthLabel = MONTHS[(currentMonthIndex + t.month + 12) % 12];
            const isCurrent = t.month === 0;
            return (
              <div key={t.month} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
                <div
                  className={`w-full max-w-[48px] rounded-[var(--radius-sm)] transition-all duration-300 ${
                    isCurrent ? "bg-green" : "bg-green-mid"
                  }`}
                  style={{ height: `${heightPct}%`, minHeight: 4 }}
                />
                <div
                  className={`text-[10px] font-semibold tracking-[0.04em] ${
                    isCurrent ? "text-green-dark" : "text-text-soft"
                  }`}
                >
                  {monthLabel}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div className="text-[12px] text-text-mid">
            6-month revenue trend
          </div>
          <div className="text-[11px] font-semibold text-text-mid">
            High: {fmtMoney(maxValue)}
          </div>
        </div>
      </div>
    </div>
  );
}
