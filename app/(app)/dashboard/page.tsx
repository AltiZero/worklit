import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";
import { ArrowIcon, BellIcon, PlusIcon, SearchIcon, UpIcon, DownIcon, CheckIcon } from "@/components/dashboard/icons";

const KPIS = [
  { label: "This month", value: "$12,840", delta: +18.4, sub: "vs $10,840 last month" },
  { label: "Outstanding", value: "$4,250", delta: -8.2, sub: "3 invoices unpaid", invert: true },
  { label: "Pending approval", value: "5", delta: +2, sub: "across 3 projects", isCount: true },
  { label: "Avg time to approval", value: "1.8d", delta: -0.4, sub: "down from 2.2d", isCount: true, invert: true },
];

const INVOICES = [
  { id: "INV-024", client: "Linear", amount: 2400, due: "Nov 12", overdue: false },
  { id: "INV-023", client: "Notion", amount: 1800, due: "Nov 04", overdue: true },
  { id: "INV-022", client: "Vercel", amount: 4250, due: "Oct 28", overdue: true },
];

function fmtMoney(n: number) {
  return "$" + n.toLocaleString();
}

function DeltaBadge({ delta, isCount, invert }: { delta: number; isCount?: boolean; invert?: boolean }) {
  const positive = invert ? delta < 0 : delta > 0;
  return (
    <span className={`inline-flex items-center gap-[3px] text-[11.5px] font-semibold py-[2px] px-[7px] rounded-full ${positive ? "bg-green-light text-green-dark" : "bg-bg-alt text-text-mid"}`}>
      {delta > 0 ? <UpIcon /> : <DownIcon />}
      {Math.abs(delta)}{isCount ? "" : "%"}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const color = status === "ACTIVE" ? "var(--green)" : status === "PENDING_REVIEW" ? "var(--text-soft)" : "var(--text-soft)";
  return <span className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />;
}

function statusLabel(status: string) {
  switch (status) {
    case "ACTIVE": return "Active";
    case "PENDING_REVIEW": return "Awaiting";
    case "DRAFT": return "Draft";
    case "COMPLETED": return "Done";
    default: return status;
  }
}

export default async function DashboardPage() {
  const user = await requireAuth();

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs text-text-soft mb-0.5">Workspace</div>
          <h1 className="font-heading text-[28px] tracking-[-0.02em] font-normal leading-none">Home</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-bg-card border border-border rounded-[var(--radius)] py-[7px] px-2.5 min-w-[280px] text-text-soft transition-[border-color] duration-[0.15s] focus-within:border-green">
            <SearchIcon size={14} />
            <input
              className="flex-1 border-none outline-none text-[13.5px] text-text bg-transparent placeholder:text-text-soft"
              placeholder="Search projects, clients, invoices…"
            />
            <span className="text-[10px] py-0.5 px-[5px] rounded-sm bg-bg-alt text-text-soft border border-border">
              ⌘K
            </span>
          </div>
          <button className="relative w-[34px] h-[34px] rounded-lg bg-bg-card border border-border flex items-center justify-center text-text-mid cursor-pointer transition-[background,color] duration-[0.15s] hover:bg-bg-alt hover:text-text" aria-label="Notifications">
            <BellIcon size={16} />
            <span className="absolute top-[7px] right-[7px] w-[7px] h-[7px] rounded-full bg-green border-2 border-bg-card" />
          </button>
          <div className="w-7 h-7 rounded-full bg-green-light text-green-dark flex items-center justify-center text-[11px] font-semibold tracking-[0.02em]">
            {user.email?.charAt(0).toUpperCase() ?? "?"}
          </div>
        </div>
      </header>

      {/* KPI Row */}
      <section className="grid grid-cols-4 gap-[18px]">
        {KPIS.map((k, i) => (
          <div key={i} className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px] flex flex-col gap-1.5">
            <div className="text-xs text-text-soft font-medium">{k.label}</div>
            <div className="font-heading text-[30px] tracking-[-0.02em] text-text leading-none my-0.5">{k.value}</div>
            <div className="flex items-center gap-2">
              <DeltaBadge delta={k.delta} isCount={k.isCount} invert={k.invert} />
              <span className="text-[11.5px] text-text-soft">{k.sub}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-[1.5fr_1fr] gap-[18px]">
        {/* Revenue Chart */}
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px]">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-green mb-1">Revenue</div>
              <div className="font-heading text-[19px] tracking-[-0.01em] leading-[1.1]">Last 12 months</div>
            </div>
            <div className="inline-flex gap-0.5 bg-bg-alt p-[3px] rounded-lg">
              {["12M", "YTD", "3M"].map((label) => (
                <button key={label} className={`bg-transparent border-none py-[5px] px-[11px] font-medium text-xs cursor-pointer rounded-md transition-[background,color] duration-[0.15s] ${label === "12M" ? "bg-bg-card text-text shadow-[var(--shadow-sm)]" : "text-text-mid hover:text-text"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-8 mb-4">
            <div>
              <div className="font-heading text-[32px] tracking-[-0.02em] leading-none">$12,840</div>
              <div className="text-[11.5px] text-text-soft mt-1">Nov 2026</div>
            </div>
            <div>
              <div className="font-heading text-[22px] text-text-mid tracking-[-0.02em] leading-none">$102,440</div>
              <div className="text-[11.5px] text-text-soft mt-1">12-mo total</div>
            </div>
            <div>
              <div className="font-heading text-[22px] text-text-mid tracking-[-0.02em] leading-none">$8,537</div>
              <div className="text-[11.5px] text-text-soft mt-1">monthly avg</div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-1.5 h-[140px] pt-3 border-t border-dashed border-border">
            {["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"].map((m, i) => {
              const values = [6200, 7800, 9100, 8400, 10200, 11600, 9800, 12300, 11200, 13400, 10840, 12840];
              const max = Math.max(...values);
              const isCurrent = i === 11;
              return (
                <div key={m} className="flex flex-col items-center justify-end gap-1.5 cursor-pointer group">
                  <div
                    className={`w-full max-w-[28px] rounded-t-[5px] transition-[background,transform] duration-[0.15s] group-hover:!bg-green-mid ${isCurrent ? "bg-green group-hover:!bg-green-hover" : "bg-bg-alt"}`}
                    style={{ height: `${(values[i] / max) * 100}%` }}
                  />
                  <div className="text-[10.5px] text-text-soft">{m}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Approvals + Activity (right column) */}
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px] flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-1 bg-transparent">
              {["Approvals", "Activity"].map((label) => (
                <button key={label} className={`py-1.5 px-3 rounded-full font-medium text-xs cursor-pointer inline-flex items-center gap-1.5 transition-[background,color] duration-[0.15s] ${label === "Approvals" ? "bg-text text-bg" : "bg-bg-alt text-text-mid hover:text-text"}`}>
                  {label}
                  {label === "Approvals" && <span className="text-[10px] font-semibold py-px px-1.5 rounded-full bg-[oklch(98%_0.006_70_/_0.2)]">0</span>}
                  {label === "Activity" && <span className="text-[10px] font-semibold py-px px-1.5 rounded-full bg-green text-white">0</span>}
                </button>
              ))}
            </div>
            <Link href="#" className="text-xs text-text-mid no-underline inline-flex items-center gap-1 transition-colors duration-[0.15s] hover:text-green">
              View all <ArrowIcon size={12} />
            </Link>
          </div>

          <p className="text-[13px] text-text-soft text-center py-12">
            No pending approvals yet. Create a project to get started.
          </p>
        </div>

        {/* Projects Table */}
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px]">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-green mb-1">Active</div>
              <div className="font-heading text-[19px] tracking-[-0.01em] leading-[1.1]">Projects</div>
            </div>
            <Link href="/dashboard/projects/new" className="bg-green text-white border-none py-2 px-3.5 rounded-[var(--radius)] font-medium text-[12.5px] cursor-pointer no-underline inline-flex items-center gap-1.5 transition-[background,transform] duration-[0.15s,0.1s] hover:bg-green-hover hover:-translate-y-px active:scale-[0.97]">
              <PlusIcon size={14} /> New scope
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-xl bg-green-light flex items-center justify-center mx-auto mb-5">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="2" width="10" height="12" rx="2" stroke="var(--green)" strokeWidth="1.5" />
                  <path d="M6 6h4M6 9h4M6 12h2" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="font-heading text-[20px] text-text mb-2 tracking-[-0.01em]">
                No projects yet
              </div>
              <p className="text-[14px] text-text-mid leading-[1.6] max-w-[360px] mx-auto">
                Create your first project to start sending scope approvals to clients.
              </p>
            </div>
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-[2fr_0.8fr_1.2fr_0.6fr_0.7fr] gap-3 pb-2.5 text-[10.5px] font-semibold tracking-[0.08em] uppercase text-text-soft border-b border-border">
                <div>Project</div>
                <div>Status</div>
                <div>Progress</div>
                <div>Due</div>
                <div className="text-right">Amount</div>
              </div>
              {projects.map((p) => (
                <Link href={`/dashboard/projects/${p.id}`} key={p.id} className="grid grid-cols-[2fr_0.8fr_1.2fr_0.6fr_0.7fr] gap-3 items-center py-3 border-b border-border cursor-pointer transition-colors duration-[0.1s] hover:bg-[oklch(98%_0.006_70_/_0.6)] last:border-b-0 no-underline">
                  <div className="flex items-center gap-2.5 text-[13.5px] font-medium min-w-0">
                    <div className="w-[22px] h-[22px] rounded-full bg-green-light text-green-dark flex items-center justify-center text-[10px] font-semibold flex-shrink-0">
                      {p.clientName[0]}
                    </div>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">{p.title}</span>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs text-text-mid font-medium">
                      <StatusDot status={p.status} />
                      {statusLabel(p.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-[5px] bg-bg-alt rounded-full overflow-hidden">
                      <div className="h-full bg-border-mid rounded-full" style={{ width: "0%" }} />
                    </div>
                    <span className="text-[11.5px] text-text-mid min-w-[28px] text-right">–</span>
                  </div>
                  <div className="text-[12.5px] text-text-soft">
                    {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                  <div className="font-heading text-[15px] text-text text-right tracking-[-0.01em]">–</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Invoices */}
        <div>
          <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px]">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-green mb-1">Outstanding</div>
                <div className="font-heading text-[19px] tracking-[-0.01em] leading-[1.1]">Invoices</div>
              </div>
              <Link href="#" className="text-xs text-text-mid no-underline inline-flex items-center gap-1 transition-colors duration-[0.15s] hover:text-green">
                All <ArrowIcon size={12} />
              </Link>
            </div>

            <div className="flex flex-col">
              {INVOICES.map((inv, i) => (
                <div key={i} className="flex justify-between items-center py-3.5 border-b border-border last:border-b-0">
                  <div>
                    <div className="text-xs font-semibold text-text tracking-[0.02em]">{inv.id}</div>
                    <div className="text-[11.5px] text-text-soft mt-0.5">{inv.client}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-heading text-base text-text tracking-[-0.01em]">{fmtMoney(inv.amount)}</div>
                    <div className={`text-[11px] mt-0.5 inline-flex items-center gap-1 justify-end ${inv.overdue ? "text-[oklch(50%_0.150_30)] font-medium" : "text-text-soft"}`}>
                      {inv.overdue && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
                        </svg>
                      )}
                      Due {inv.due}
                    </div>
                  </div>
                </div>
              ))}
              <button className="bg-transparent border border-border py-2 px-3.5 rounded-[var(--radius)] font-medium text-[12.5px] text-text-mid cursor-pointer mt-3 transition-all duration-[0.15s] hover:border-text-soft hover:text-text">
                Send reminder
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
