import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";
import { AddItemForm } from "./add-item-form";

type Props = { params: Promise<{ id: string }> };

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
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
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium py-[3px] px-2 rounded-full border ${colors[status] || colors.PENDING}`}>
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

  return (
    <div className="max-w-[800px]">
      <Link
        href="/dashboard"
        className="text-[13px] text-text-mid no-underline hover:text-text transition-colors duration-150 inline-flex items-center gap-1.5 mb-8 group"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform duration-150">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to dashboard
      </Link>

      {/* Project header */}
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-green mb-3">
            Project
          </div>
          <h1 className="font-heading text-[clamp(28px,3vw,40px)] leading-[1.08] tracking-[-0.02em] text-text mb-2">
            {project.title}
          </h1>
          <p className="text-[15px] text-text-mid">
            {project.clientName} · {project.clientEmail}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 bg-bg-card border border-border rounded-[var(--radius-lg)] px-6 py-4">
          <div className="text-[11px] text-text-soft text-right">Approved</div>
          <div className="font-heading text-[22px] text-text tracking-[-0.01em]">{fmtMoney(approvedTotal)}</div>
          <div className="text-[11px] text-text-soft">{project.scopeItems.length} item{project.scopeItems.length !== 1 ? "s" : ""}</div>
        </div>
      </div>

      {/* Scope items */}
      <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px] mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-green mb-1">Deliverables</div>
            <div className="font-heading text-[19px] tracking-[-0.01em] leading-[1.1]">Scope items</div>
          </div>
        </div>

        {project.scopeItems.length === 0 ? (
          <p className="text-[13px] text-text-soft text-center py-12">
            No items yet. Add the first deliverable below.
          </p>
        ) : (
          <div className="flex flex-col">
            {project.scopeItems.map((item, i) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 py-3.5 border-b border-border last:border-b-0 ${
                  item.status === "APPROVED" ? "bg-green-light/40 -mx-[22px] px-[22px]" : ""
                }${item.status === "REJECTED" ? "opacity-55" : ""}`}
              >
                <div className="text-[11px] text-text-soft w-6 flex-shrink-0">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-medium text-text">{item.title}</div>
                  {item.description && (
                    <div className="text-[11.5px] text-text-soft mt-0.5 truncate">{item.description}</div>
                  )}
                </div>
                <StatusBadge status={item.status} />
                <div className="text-[13px] font-semibold text-text w-[80px] text-right flex-shrink-0">
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
