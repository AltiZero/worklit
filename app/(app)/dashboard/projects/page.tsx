import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";
import { ArrowIcon, PlusIcon } from "@/components/dashboard/icons";

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

export default async function ProjectsPage() {
  const user = await requireAuth();

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { scopeItems: true },
  });

  const statuses = ["ALL", "ACTIVE", "PENDING_REVIEW", "DRAFT", "COMPLETED"] as const;
  const counts: Record<string, number> = { ALL: projects.length };
  for (const s of statuses) {
    if (s === "ALL") continue;
    counts[s] = projects.filter((p) => p.status === s).length;
  }

  const pendingCount = projects.reduce((sum, p) => sum + p.scopeItems.filter((s) => s.status === "PENDING").length, 0);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-green mb-2">Workspace</div>
          <h1 className="font-heading text-[32px] tracking-[-0.02em] leading-none">Projects</h1>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="min-h-[40px] rounded-[var(--radius)] border border-transparent bg-green px-5 py-[10px] text-[14px] font-medium leading-none text-white no-underline inline-flex items-center gap-1.5 shadow-[0_1px_3px_oklch(20%_0.012_60_/_0.04)] transition-[background,transform,box-shadow] duration-[0.18s,0.16s,0.18s] hover:-translate-y-px hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97]"
        >
          <PlusIcon size={14} /> New project
        </Link>
      </header>

      {/* Status filters */}
      <div className="flex items-center gap-1">
        {statuses.map((s) => (
          <button
            key={s}
            className={`px-3 py-1.5 rounded-md text-[12px] font-medium border-none cursor-pointer transition-[background,color] duration-[0.1s] ${
              s === "ALL"
                ? "bg-bg-alt text-text"
                : "bg-transparent text-text-mid hover:bg-bg-alt hover:text-text"
            }`}
          >
            {s === "ALL" ? "All" : statusLabel(s)}
            <span className="ml-1.5 text-[11px] text-text-soft">{counts[s]}</span>
          </button>
        ))}
      </div>

      {projects.length > 0 ? (
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
                  {pendingCount > 0 && p.scopeItems.some((s) => s.status === "PENDING") && (
                    <span className="text-green-dark font-medium"> · {p.scopeItems.filter((s) => s.status === "PENDING").length} pending</span>
                  )}
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
      ) : (
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-12 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-green-light flex items-center justify-center mb-5">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <rect x="3" y="2" width="10" height="12" rx="2" stroke="var(--green)" strokeWidth="1.5" />
              <path d="M6 6h4M6 9h4M6 12h2" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="font-heading text-[22px] text-text mb-2 tracking-[-0.01em]">No projects yet</div>
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
    </div>
  );
}
