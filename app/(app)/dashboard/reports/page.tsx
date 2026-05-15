import Link from "next/link";
import {
  ChartBarSquareIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  Squares2X2Icon,
  CheckCircleIcon,
} from "@heroicons/react/16/solid";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";
import { ArrowIcon, PlusIcon } from "@/components/dashboard/icons";

function fmtMoney(n: number) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function statusLabel(status: string) {
  switch (status) {
    case "ACTIVE": return "Active";
    case "PENDING_REVIEW": return "Awaiting client";
    case "DRAFT": return "Draft";
    case "COMPLETED": return "Completed";
    case "ARCHIVED": return "Archived";
    default: return status;
  }
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type EyebrowIcon = React.ComponentType<{ className?: string }>;

function Eyebrow({ icon: Icon, children }: { icon: EyebrowIcon; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-text-mid">
      <Icon className="w-3.5 h-3.5 text-text-soft" />
      {children}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <dt className="text-[12.5px] text-text-soft">{label}</dt>
      <dd className="text-[12.5px] text-text font-medium text-right tabular-nums">{value}</dd>
    </>
  );
}

export default async function ReportsPage() {
  const user = await requireAuth();

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    include: { scopeItems: true },
  });

  const allScopeItems = projects.flatMap((p) => p.scopeItems);
  const totalItems = allScopeItems.length;
  const approvedItems = allScopeItems.filter((s) => s.status === "APPROVED");
  const pendingItems = allScopeItems.filter((s) => s.status === "PENDING");

  const approvedValue = approvedItems.reduce((sum, s) => sum + Number(s.price), 0);
  const outstandingValue = pendingItems.reduce((sum, s) => sum + Number(s.price), 0);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const monthRevenue = approvedItems
    .filter((s) => s.updatedAt >= monthStart)
    .reduce((sum, s) => sum + Number(s.price), 0);
  const yearRevenue = approvedItems
    .filter((s) => s.updatedAt >= yearStart)
    .reduce((sum, s) => sum + Number(s.price), 0);

  const activeProjects = projects.filter((p) => p.status === "ACTIVE").length;
  const completedProjects = projects.filter((p) => p.status === "COMPLETED").length;
  const approvalRate = totalItems > 0 ? Math.round((approvedItems.length / totalItems) * 100) : 0;

  // Monthly trend: last 6 months of approved revenue
  const trend: { monthIdx: number; label: string; value: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const value = approvedItems
      .filter((s) => s.updatedAt >= start && s.updatedAt < end)
      .reduce((sum, s) => sum + Number(s.price), 0);
    trend.push({
      monthIdx: start.getMonth(),
      label: MONTHS[start.getMonth()],
      value,
    });
  }
  const maxTrend = Math.max(...trend.map((t) => t.value), 1);

  // Projects by value
  const projectsByValue = projects
    .map((p) => {
      const value = p.scopeItems.reduce((sum, s) => sum + Number(s.price), 0);
      const total = p.scopeItems.length;
      const approved = p.scopeItems.filter((s) => s.status === "APPROVED").length;
      const completion = total > 0 ? Math.round((approved / total) * 100) : 0;
      return { ...p, value, total, approved, completion };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const hasData = projects.length > 0;
  const summaryLine = hasData
    ? "Revenue, projects, and approvals at a glance."
    : "Numbers show up once you have a project in motion.";

  return (
    <div className="flex flex-col gap-7">
      {/* Hero */}
      <header className="flex items-end justify-between gap-6 flex-wrap pt-1">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-soft mb-2.5">
            Insights
          </div>
          <h1 className="font-heading text-[clamp(34px,3.4vw,46px)] tracking-[-0.025em] leading-[1.04] text-text">
            Reports
          </h1>
          <p className="text-[15px] text-text-mid mt-2.5 max-w-[52ch]">{summaryLine}</p>
        </div>
      </header>

      {!hasData ? (
        <section className="bg-bg-card border border-border rounded-[var(--radius-lg)] px-[28px] py-[44px] flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-[var(--radius)] bg-green-light flex items-center justify-center mb-5">
            <ChartBarSquareIcon className="w-5 h-5 text-green" />
          </div>
          <div className="font-heading text-[26px] text-text tracking-[-0.015em] mb-2">
            Not enough data yet.
          </div>
          <p className="text-[14px] text-text-mid leading-[1.6] max-w-[400px] mb-6">
            Reports populate as you create projects and clients approve scope items.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center justify-center gap-1.5 px-[20px] py-[11px] rounded-[var(--radius)] border border-border-mid text-[13.5px] font-medium text-text no-underline transition-[border-color,background] duration-150 hover:border-text-mid hover:bg-bg-alt/50"
          >
            <PlusIcon size={14} /> Create a project
          </Link>
        </section>
      ) : (
        <>
          {/* Stats row */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Revenue */}
            <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px] flex flex-col gap-5">
              <Eyebrow icon={CurrencyDollarIcon}>Revenue</Eyebrow>
              <div>
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="font-heading text-[44px] tracking-[-0.03em] leading-none text-text tabular-nums">
                    {fmtMoney(monthRevenue)}
                  </span>
                  <span className="text-[12.5px] text-text-soft">this month</span>
                </div>
                <div className="text-[11.5px] text-text-soft mt-3 tabular-nums">
                  {fmtMoney(yearRevenue)} year to date
                </div>
              </div>
              <dl className="grid grid-cols-[1fr_auto] gap-y-2.5 gap-x-4 pt-[18px] border-t border-border">
                <DetailRow label="Approved items" value={`${approvedItems.length}`} />
                <DetailRow label="Approval rate" value={`${approvalRate}%`} />
              </dl>
            </div>

            {/* Approved scope value */}
            <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px] flex flex-col gap-5">
              <Eyebrow icon={CheckCircleIcon}>Approved scope</Eyebrow>
              <div>
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="font-heading text-[44px] tracking-[-0.03em] leading-none text-text tabular-nums">
                    {fmtMoney(approvedValue)}
                  </span>
                  <span className="text-[12.5px] text-text-soft">signed off</span>
                </div>
                <div className="text-[11.5px] text-text-soft mt-3 tabular-nums">
                  {approvedItems.length} of {totalItems} {totalItems === 1 ? "item" : "items"}
                </div>
              </div>
              <dl className="grid grid-cols-[1fr_auto] gap-y-2.5 gap-x-4 pt-[18px] border-t border-border">
                <DetailRow label="Active projects" value={`${activeProjects}`} />
                <DetailRow label="Completed" value={`${completedProjects}`} />
              </dl>
            </div>

            {/* Outstanding */}
            <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px] flex flex-col gap-5">
              <Eyebrow icon={Squares2X2Icon}>Outstanding</Eyebrow>
              <div>
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="font-heading text-[44px] tracking-[-0.03em] leading-none text-text tabular-nums">
                    {fmtMoney(outstandingValue)}
                  </span>
                  <span className="text-[12.5px] text-text-soft">pending</span>
                </div>
                <div className="text-[11.5px] text-text-soft mt-3 tabular-nums">
                  {pendingItems.length} {pendingItems.length === 1 ? "item awaits" : "items await"} review
                </div>
              </div>
              <dl className="grid grid-cols-[1fr_auto] gap-y-2.5 gap-x-4 pt-[18px] border-t border-border">
                <DetailRow label="Total projects" value={`${projects.length}`} />
                <DetailRow label="Total items" value={`${totalItems}`} />
              </dl>
            </div>
          </section>

          {/* Two-column area */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
            {/* Projects by value */}
            <section className="min-w-0">
              <div className="flex items-center justify-between mb-3.5 px-1">
                <Eyebrow icon={Squares2X2Icon}>Projects by value</Eyebrow>
                <Link
                  href="/dashboard/projects"
                  className="text-[12px] text-text-mid no-underline hover:text-green transition-colors duration-150"
                >
                  View all
                </Link>
              </div>
              <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
                {projectsByValue.map((p, i) => {
                  const isLast = i === projectsByValue.length - 1;
                  return (
                    <Link
                      key={p.id}
                      href={`/dashboard/projects/${p.id}`}
                      className={`group flex items-center gap-4 px-[22px] py-[15px] no-underline transition-colors duration-100 hover:bg-bg-alt/45 ${
                        isLast ? "" : "border-b border-border"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-green-light text-green-dark flex items-center justify-center text-[12.5px] font-semibold flex-shrink-0">
                        {p.clientName[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-medium text-text truncate">{p.title}</div>
                        <div className="text-[12px] text-text-soft mt-0.5 truncate">
                          {p.clientName} <span className="text-text-soft/60 mx-0.5">·</span> {statusLabel(p.status)}
                        </div>
                      </div>
                      <div className="hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0">
                        <span className="font-heading text-[17px] text-text leading-none tracking-[-0.01em] tabular-nums">
                          {fmtMoney(p.value)}
                        </span>
                        <span className="text-[11px] text-text-soft tabular-nums">
                          {p.total === 0 ? "no items yet" : `${p.completion}% complete`}
                        </span>
                      </div>
                      <ArrowIcon size={12} />
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Monthly trend */}
            <aside className="min-w-0">
              <div className="flex items-center justify-between mb-3.5 px-1">
                <Eyebrow icon={CalendarIcon}>Monthly trend</Eyebrow>
              </div>
              <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px] flex flex-col gap-5">
                <div>
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className="font-heading text-[28px] tracking-[-0.02em] leading-none text-text tabular-nums">
                      {fmtMoney(monthRevenue)}
                    </span>
                    <span className="text-[12px] text-text-soft">this month</span>
                  </div>
                </div>

                {/* Sparkline bars */}
                <div className="flex items-end gap-2 h-[96px]">
                  {trend.map((t, i) => {
                    const heightPct = (t.value / maxTrend) * 100;
                    const isCurrent = i === trend.length - 1;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
                        <div
                          className={`w-full rounded-[var(--radius-sm)] transition-[height] duration-300 ${
                            isCurrent ? "bg-green" : "bg-border-mid"
                          }`}
                          style={{ height: `${Math.max(heightPct, 3)}%` }}
                        />
                        <div
                          className={`text-[10px] font-semibold tracking-[0.04em] tabular-nums ${
                            isCurrent ? "text-text" : "text-text-soft"
                          }`}
                        >
                          {t.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <dl className="grid grid-cols-[1fr_auto] gap-y-2.5 gap-x-4 pt-[18px] border-t border-border">
                  <DetailRow label="6mo total" value={fmtMoney(trend.reduce((s, t) => s + t.value, 0))} />
                  <DetailRow label="Peak month" value={fmtMoney(maxTrend)} />
                  <DetailRow label="Year to date" value={fmtMoney(yearRevenue)} />
                </dl>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
