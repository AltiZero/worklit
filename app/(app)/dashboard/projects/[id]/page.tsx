import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";
import { AddItemForm } from "./add-item-form";
import { EditProject } from "./edit-project";

type Props = { params: Promise<{ id: string }> };

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-bg-alt text-text-mid border-border-mid",
    APPROVED: "bg-green-light text-green-dark border-green-mid",
    DEFERRED: "bg-bg-alt text-text-mid border-border-mid",
    REJECTED: "bg-bg-alt text-text-soft border-border-mid opacity-55",
  };
  const labels: Record<string, string> = {
    PENDING: "Pending",
    APPROVED: "Approved",
    DEFERRED: "Deferred",
    REJECTED: "Rejected",
  };

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium py-[3px] px-2 rounded-full border ${styles[status] || styles.PENDING}`}>
      {labels[status] || status}
    </span>
  );
}

function fmtMoney(n: number) {
  return "$" + n.toLocaleString();
}

export default async function ProjectDetailPage({ params }: Props) {
  const user = await requireAuth();
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { scopeItems: { orderBy: { createdAt: "asc" } } },
  });

  if (!project || project.userId !== user.id) {
    notFound();
  }

  const approvedTotal = project.scopeItems
    .filter((item) => item.status === "APPROVED")
    .reduce((sum, item) => sum + Number(item.price), 0);

  const total = project.scopeItems.reduce((sum, item) => sum + Number(item.price), 0);
  const hasItems = project.scopeItems.length > 0;

  return (
    <div>
      <Link
        href="/dashboard"
        className="text-[13px] text-text-mid no-underline hover:text-text transition-colors duration-150 inline-flex items-center gap-1.5 mb-8 group"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform duration-150">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to dashboard
      </Link>

      {/* Header with edit */}
      <div className="mb-8">
        <EditProject
          projectId={project.id}
          title={project.title}
          clientName={project.clientName}
          clientEmail={project.clientEmail}
        />
      </div>

      {/* Total card */}
      {hasItems && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] px-5 py-4">
            <div className="text-[11px] text-text-soft mb-1">Total scope</div>
            <div className="font-heading text-[24px] text-text tracking-[-0.01em]">{fmtMoney(total)}</div>
            <div className="text-[11px] text-text-soft mt-0.5">{project.scopeItems.length} item{project.scopeItems.length !== 1 ? "s" : ""}</div>
          </div>
          <div className="bg-green-light/40 border border-green-mid rounded-[var(--radius-lg)] px-5 py-4">
            <div className="text-[11px] text-green-dark mb-1">Approved</div>
            <div className="font-heading text-[24px] text-green-dark tracking-[-0.01em]">{fmtMoney(approvedTotal)}</div>
            <div className="text-[11px] text-green-dark mt-0.5">
              {project.scopeItems.filter((s) => s.status === "APPROVED").length} approved
            </div>
          </div>
          <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] px-5 py-4 flex items-center justify-center">
            <button className="bg-text text-bg-card border-none rounded-[var(--radius)] py-[10px] px-5 text-[13px] font-medium cursor-pointer transition-[background,transform] duration-[0.15s,0.1s] hover:bg-green hover:text-white active:scale-[0.97]">
              Preview as client
            </button>
          </div>
        </div>
      )}

      {/* Scope items */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-green mb-1">Deliverables</div>
            <div className="font-heading text-[24px] tracking-[-0.01em] leading-[1.1]">Scope items</div>
          </div>
        </div>

        {!hasItems ? (
          <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-12 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-green-light flex items-center justify-center mb-5">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="2" width="10" height="12" rx="2" stroke="var(--green)" strokeWidth="1.5" />
                <path d="M6 6h4M6 9h4M6 12h2" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="font-heading text-[24px] text-text mb-2 tracking-[-0.01em]">No deliverables yet</div>
            <p className="text-[14px] text-text-mid leading-[1.6] max-w-[360px]">
              Start adding scope items. Each one becomes a line the client can approve or reject.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {project.scopeItems.map((item, i) => (
              <div
                key={item.id}
                className={`bg-bg-card border rounded-[var(--radius)] px-5 py-4 flex items-center gap-4 transition-[border-color,background] duration-200 ${
                  item.status === "APPROVED"
                    ? "border-green-mid bg-green-light/30"
                    : item.status === "REJECTED"
                      ? "border-border-mid opacity-55"
                      : "border-border"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-bg-alt border border-border flex items-center justify-center text-[11px] font-semibold text-text-mid flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-text">{item.title}</div>
                  {item.description && (
                    <div className="text-[12px] text-text-soft mt-0.5 truncate">{item.description}</div>
                  )}
                </div>
                <StatusBadge status={item.status} />
                <div className="text-[14px] font-semibold text-text w-[80px] text-right flex-shrink-0">
                  {fmtMoney(Number(item.price))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add item form */}
      <AddItemForm projectId={id} />
    </div>
  );
}
