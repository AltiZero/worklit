import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";

function fmtMoney(n: number) {
  return "$" + n.toLocaleString();
}

function relativeTime(date: Date) {
  const ago = Date.now() - date.getTime();
  const mins = Math.floor(ago / 60000);
  const hrs = Math.floor(ago / 3600000);
  const days = Math.floor(ago / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

export default async function ScopesPage() {
  const user = await requireAuth();

  const pendingItems = await prisma.scopeItem.findMany({
    where: {
      status: "PENDING",
      project: { userId: user.id },
    },
    include: { project: true },
    orderBy: { createdAt: "desc" },
  });

  const approvedItems = await prisma.scopeItem.findMany({
    where: {
      status: "APPROVED",
      project: { userId: user.id },
    },
    include: { project: true },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  const hasPending = pendingItems.length > 0;
  const hasApproved = approvedItems.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-green">Approvals</div>
        <h1 className="font-heading text-[32px] tracking-[-0.02em] leading-none mt-1">Scopes</h1>
      </header>

      {/* Pending — needs attention */}
      {hasPending ? (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-green" />
            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-text-mid">
              Needs approval · {pendingItems.length}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {pendingItems.map((item) => (
              <div
                key={item.id}
                className="bg-bg-card border border-border rounded-[var(--radius)] px-5 py-4 flex items-center gap-4 hover:border-green-mid hover:bg-green-light/10 transition-[border-color,background] duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-bg-alt border border-border flex items-center justify-center text-[11px] font-semibold text-text-mid flex-shrink-0">
                  {item.project.clientName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/dashboard/projects/${item.projectId}`}
                    className="text-[11px] font-semibold tracking-[0.08em] uppercase text-text-soft no-underline hover:text-green transition-colors duration-150"
                  >
                    {item.project.title}
                  </Link>
                  <div className="text-[14px] font-medium text-text mt-0.5">{item.title}</div>
                  {item.description && (
                    <div className="text-[12px] text-text-soft mt-0.5 truncate">{item.description}</div>
                  )}
                </div>
                <div className="text-[14px] font-semibold text-text flex-shrink-0">{fmtMoney(Number(item.price))}</div>
                <span className="text-[11.5px] text-text-soft flex-shrink-0">{relativeTime(item.createdAt)}</span>
                <Link
                  href={`/dashboard/projects/${item.projectId}`}
                  className="min-h-[34px] rounded-[var(--radius)] border border-transparent bg-green px-4 py-[7px] text-[12px] font-medium leading-none text-white no-underline inline-flex items-center gap-1 shadow-[0_1px_3px_oklch(20%_0.012_60_/_0.04)] transition-[background,transform,box-shadow] duration-[0.18s,0.16s,0.18s] hover:-translate-y-px hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97]"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="bg-green-light/30 border border-green-mid rounded-[var(--radius-lg)] px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-mid flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7" />
            </svg>
          </div>
          <div>
            <div className="font-heading text-[18px] text-green-dark tracking-[-0.01em]">All caught up.</div>
            <div className="text-[13px] text-text-mid mt-0.5">No pending items across all projects.</div>
          </div>
        </div>
      )}

      {/* Recently approved */}
      {hasApproved && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-green-mid" />
            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-text-mid">
              Recently approved · {approvedItems.length}
            </span>
          </div>

          <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
            {approvedItems.map((item, i) => (
              <Link
                key={item.id}
                href={`/dashboard/projects/${item.projectId}`}
                className={`flex items-center gap-4 px-[22px] py-3.5 no-underline transition-colors duration-[0.1s] hover:bg-bg-alt/40 ${
                  i < approvedItems.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <span className="text-[11px] text-text-soft w-5 flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-text-soft mb-0.5">
                    {item.project.title}
                  </div>
                  <div className="text-[13px] font-medium text-text">{item.title}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[11px] font-medium text-text-soft">{relativeTime(item.updatedAt)}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium py-[3px] px-2 rounded-full bg-green-light text-green-dark border border-green-mid">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                    Approved
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Completely empty */}
      {!hasPending && !hasApproved && (
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-12 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-green-light flex items-center justify-center mb-5">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <rect x="3" y="2" width="10" height="12" rx="2" stroke="var(--green)" strokeWidth="1.5" />
              <path d="M6 6h4M6 9h4M6 12h2" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="font-heading text-[22px] text-text mb-2 tracking-[-0.01em]">No scope items yet</div>
          <p className="text-[14px] text-text-mid leading-[1.6] max-w-[360px] mb-6">
            Add deliverables to your projects and they will appear here for approval.
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
