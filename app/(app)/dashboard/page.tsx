import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";
import { ArrowIcon, PlusIcon, SearchIcon, BellIcon } from "@/components/dashboard/icons";

function StatusDot({ status }: { status: string }) {
  const color = status === "ACTIVE" ? "var(--green)" : "var(--text-soft)";
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
    orderBy: { updatedAt: "desc" },
    take: 10,
    include: { scopeItems: true },
  });

  const pendingItems = projects.flatMap((p) =>
    p.scopeItems.filter((s) => s.status === "PENDING").map((s) => ({ ...s, projectTitle: p.title, projectId: p.id, clientName: p.clientName })),
  );

  const recentActivity = await prisma.changelogEntry.findMany({
    where: { project: { userId: user.id } },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { project: { select: { title: true } } },
  });

  const hasAttention = pendingItems.length > 0;
  const allApproved = projects.length > 0 && projects.every((p) => p.scopeItems.every((s) => s.status !== "PENDING"));
  const hasProjects = projects.length > 0;
  const hasActivity = recentActivity.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs text-text-soft mb-0.5">
            {user.email}
          </div>
          <h1 className="font-heading text-[32px] tracking-[-0.02em] font-normal leading-none">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}.
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/projects/new"
            className="min-h-[40px] rounded-[var(--radius)] border border-transparent bg-green px-5 py-[10px] text-[14px] font-medium leading-none text-white no-underline inline-flex items-center gap-1.5 shadow-[0_1px_3px_oklch(20%_0.012_60_/_0.04)] transition-[background,transform,box-shadow] duration-[0.18s,0.16s,0.18s] hover:-translate-y-px hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97]"
          >
            <PlusIcon size={14} /> New scope
          </Link>
          <button className="relative w-[44px] h-[44px] rounded-lg bg-bg-card border border-border flex items-center justify-center text-text-mid cursor-pointer transition-[background,color] duration-[0.15s] hover:bg-bg-alt hover:text-text" aria-label="Notifications">
            <BellIcon size={16} />
          </button>
          <div className="w-7 h-7 rounded-full bg-green-light text-green-dark flex items-center justify-center text-[11px] font-semibold tracking-[0.02em]">
            {user.email?.charAt(0).toUpperCase() ?? "?"}
          </div>
        </div>
      </header>

      {/* Attention strip */}
      {hasAttention && (
        <section className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-3">
          {pendingItems.slice(0, 3).map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/projects/${item.projectId}`}
              className="bg-green-light/60 border border-green-mid rounded-[var(--radius-lg)] px-5 py-4 no-underline flex items-center gap-4 transition-[background,box-shadow,transform] duration-200 hover:bg-green-light hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 group"
            >
              <div className="w-9 h-9 rounded-full bg-green-mid flex items-center justify-center text-sm font-semibold text-green-dark flex-shrink-0">
                {item.clientName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-green-dark">
                  Pending approval
                </div>
                <div className="text-[14px] text-text font-medium mt-0.5 truncate">
                  {item.title}
                </div>
                <div className="text-[12px] text-text-mid mt-0.5">
                  {item.projectTitle}
                </div>
              </div>
              <div className="text-[12px] font-medium text-green-dark inline-flex items-center gap-1 flex-shrink-0 group-hover:translate-x-0.5 transition-transform duration-150">
                Review <ArrowIcon size={12} />
              </div>
            </Link>
          ))}
          {pendingItems.length > 3 && (
            <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] px-5 py-4 flex items-center justify-center text-[13px] text-text-mid">
              +{pendingItems.length - 3} more pending across other projects
            </div>
          )}
        </section>
      )}

      {/* All clear celebration */}
      {allApproved && (
        <div className="bg-green-light/40 border border-green-mid rounded-[var(--radius-lg)] px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-mid flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7" />
            </svg>
          </div>
          <div>
            <div className="font-heading text-[18px] text-green-dark tracking-[-0.01em]">Everything is approved.</div>
            <div className="text-[13px] text-text-mid mt-0.5">No pending items across {projects.length} project{projects.length !== 1 ? "s" : ""}.</div>
          </div>
        </div>
      )}

      {/* Projects */}
      {hasProjects ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-green">Active</div>
              <div className="font-heading text-[24px] tracking-[-0.01em] leading-[1.1]">Projects</div>
            </div>
            <Link
              href="/dashboard/projects/new"
              className="text-[12px] font-medium text-text-mid no-underline inline-flex items-center gap-1 transition-colors duration-[0.15s] hover:text-green"
            >
              New <PlusIcon size={12} />
            </Link>
          </div>

          <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
            {projects.map((p, i) => (
              <Link
                key={p.id}
                href={`/dashboard/projects/${p.id}`}
                className={`flex items-center gap-4 px-[22px] py-[16px] no-underline transition-colors duration-[0.1s] hover:bg-bg-alt/40 ${
                  i < projects.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-green-light text-green-dark flex items-center justify-center text-[12px] font-semibold flex-shrink-0">
                  {p.clientName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-text truncate">{p.title}</div>
                  <div className="text-[12px] text-text-soft mt-0.5">
                    {p.clientName}
                    {p.scopeItems.length > 0 && ` · ${p.scopeItems.length} item${p.scopeItems.length !== 1 ? "s" : ""}`}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-text-mid font-medium">
                    <StatusDot status={p.status} />
                    {statusLabel(p.status)}
                  </span>
                  <span className="text-[12px] text-text-soft">
                    {new Date(p.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <ArrowIcon size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-12 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-green-light flex items-center justify-center mb-5">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <rect x="3" y="2" width="10" height="12" rx="2" stroke="var(--green)" strokeWidth="1.5" />
              <path d="M6 6h4M6 9h4M6 12h2" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="font-heading text-[24px] text-text mb-2 tracking-[-0.01em]">
            No projects yet
          </div>
          <p className="text-[14px] text-text-mid leading-[1.6] max-w-[360px] mb-6">
            Create your first project to start sending scope approvals to clients.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="bg-green text-white py-[13px] px-[26px] rounded-[var(--radius)] font-sans text-[15px] font-medium no-underline transition-[background,transform,box-shadow] duration-[0.18s,0.16s,0.18s] inline-flex items-center gap-2 shadow-[0_1px_3px_oklch(20%_0.012_60_/_0.04)] hover:bg-green-hover hover:-translate-y-px hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97]"
          >
            Create a project
          </Link>
        </div>
      )}

      {/* Setup card — new users */}
      {!hasProjects && (
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-6">
          <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-green mb-4">Getting started</div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { step: "1", label: "Create a project", desc: "Add a client and a project title.", done: false, href: "/dashboard/projects/new" },
              { step: "2", label: "Add scope items", desc: "Define deliverables with prices.", done: false },
              { step: "3", label: "Send to client", desc: "Share a magic link for approval.", done: false },
              { step: "4", label: "Get paid", desc: "Generate an invoice from approved items.", done: false },
            ].map((s) => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-bg-alt border border-border flex items-center justify-center text-[12px] font-semibold text-text-mid flex-shrink-0 mt-0.5">
                  {s.step}
                </div>
                <div>
                  <div className="text-[13px] font-medium text-text-mid">
                    {s.href ? <Link href={s.href} className="text-text-mid no-underline hover:text-green transition-colors duration-150">{s.label}</Link> : s.label}
                  </div>
                  <div className="text-[12px] text-text-soft mt-0.5">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      {hasActivity && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-green mb-1">Recent</div>
              <div className="font-heading text-[24px] tracking-[-0.01em] leading-[1.1]">Activity</div>
            </div>
          </div>

          <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
            {recentActivity.map((entry, i) => {
              const ago = Date.now() - entry.createdAt.getTime();
              const mins = Math.floor(ago / 60000);
              const hrs = Math.floor(ago / 3600000);
              const days = Math.floor(ago / 86400000);
              const time = mins < 1 ? "just now" : mins < 60 ? `${mins}m ago` : hrs < 24 ? `${hrs}h ago` : `${days}d ago`;

              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-3 px-[22px] py-3.5 ${
                    i < recentActivity.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-green flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] text-text-mid">
                      <span className="text-text font-medium">{entry.actorName ?? "You"}</span>{" "}
                      {entry.action}{" "}
                      <Link
                        href={`/dashboard/projects/${entry.projectId}`}
                        className="text-text font-medium no-underline hover:text-green transition-colors duration-150"
                      >
                        {entry.project.title}
                      </Link>
                    </span>
                  </div>
                  <div className="text-[11.5px] text-text-soft flex-shrink-0">{time}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Revenue — simplified */}
      {hasProjects && (
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-green mb-1">Revenue</div>
            <div className="flex items-baseline gap-3">
              <div className="font-heading text-[24px] tracking-[-0.02em] text-text leading-none">$12,840</div>
              <div className="text-[11.5px] text-text-soft">this month</div>
              <span className="inline-flex items-center gap-[3px] text-[11.5px] font-semibold py-[2px] px-[7px] rounded-full bg-green-light text-green-dark">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l7-7 7 7M12 5v14"/></svg>
                18.4%
              </span>
            </div>
          </div>
          <Link
            href="/dashboard/reports"
            className="text-[12px] text-text-mid no-underline inline-flex items-center gap-1 transition-colors duration-[0.15s] hover:text-green"
          >
            View reports <ArrowIcon size={12} />
          </Link>
        </div>
      )}
    </div>
  );
}
