import { notFound } from "next/navigation";
import {
  CheckIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  UserIcon,
} from "@heroicons/react/16/solid";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";
import { AddItemForm } from "./add-item-form";
import { EditProject } from "./edit-project";

type Props = { params: Promise<{ id: string }> };

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

function ScopeStatusBadge({ status }: { status: string }) {
  if (status === "APPROVED") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium py-[3px] pl-1.5 pr-2 rounded-full bg-green-light text-green-dark border border-green-mid">
        <CheckIcon className="w-3 h-3" />
        Approved
      </span>
    );
  }
  if (status === "PENDING") {
    return (
      <span className="inline-flex items-center text-[11px] font-medium py-[3px] px-2 rounded-full bg-bg-alt text-text-mid border border-border-mid">
        Pending
      </span>
    );
  }
  const label = status === "REJECTED" ? "Rejected" : status === "DEFERRED" ? "Deferred" : status;
  return (
    <span className="inline-flex items-center text-[11px] font-medium py-[3px] px-2 rounded-full bg-bg-alt text-text-soft border border-border-mid opacity-55">
      {label}
    </span>
  );
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

  const items = project.scopeItems;
  const hasItems = items.length > 0;
  const total = items.reduce((sum, item) => sum + Number(item.price), 0);
  const approvedItems = items.filter((s) => s.status === "APPROVED");
  const pendingItems = items.filter((s) => s.status === "PENDING");
  const approvedTotal = approvedItems.reduce((sum, item) => sum + Number(item.price), 0);
  const outstandingTotal = pendingItems.reduce((sum, item) => sum + Number(item.price), 0);
  const progress = hasItems ? (approvedItems.length / items.length) * 100 : 0;

  const summaryPieces: string[] = [project.clientName, statusLabel(project.status)];
  if (hasItems) {
    summaryPieces.push(
      `${approvedItems.length} of ${items.length} approved`,
    );
  }

  return (
    <div className="flex flex-col gap-7">
      {/* Hero (header + edit menu live inside EditProject) */}
      <EditProject
        projectId={project.id}
        title={project.title}
        clientName={project.clientName}
        clientEmail={project.clientEmail}
        summary={summaryPieces.join("  ·  ")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6">
        {/* LEFT: scope items */}
        <div className="flex flex-col gap-5 min-w-0">
          <section>
            <div className="flex items-center justify-between mb-3.5 px-1">
              <Eyebrow icon={ClipboardDocumentListIcon}>Deliverables</Eyebrow>
              {hasItems && (
                <span className="text-[12px] text-text-soft tabular-nums">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>

            {!hasItems ? (
              <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] px-[28px] py-[40px] flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-[var(--radius)] bg-green-light flex items-center justify-center mb-5">
                  <ClipboardDocumentListIcon className="w-5 h-5 text-green" />
                </div>
                <div className="font-heading text-[24px] text-text mb-2 tracking-[-0.015em]">
                  No deliverables yet.
                </div>
                <p className="text-[14px] text-text-mid leading-[1.6] max-w-[380px]">
                  Add scope items below. Each one becomes a line the client can approve or reject.
                </p>
              </div>
            ) : (
              <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
                {items.map((item, i) => {
                  const isLast = i === items.length - 1;
                  const isRejected = item.status === "REJECTED" || item.status === "DEFERRED";
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-4 px-[22px] py-[15px] ${
                        isLast ? "" : "border-b border-border"
                      } ${isRejected ? "opacity-55" : ""}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-bg-alt text-text-mid flex items-center justify-center text-[12px] font-semibold flex-shrink-0 tabular-nums">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-medium text-text truncate">{item.title}</div>
                        {item.description && (
                          <div className="text-[12px] text-text-soft mt-0.5 truncate">
                            {item.description}
                          </div>
                        )}
                      </div>
                      <ScopeStatusBadge status={item.status} />
                      <div className="font-heading text-[16px] text-text leading-none tracking-[-0.01em] tabular-nums w-[90px] text-right flex-shrink-0">
                        {fmtMoney(Number(item.price))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Add item form */}
          <AddItemForm projectId={id} />
        </div>

        {/* RIGHT: summary card */}
        <aside className="flex flex-col gap-5 min-w-0">
          <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px] flex flex-col gap-5">
            <Eyebrow icon={CurrencyDollarIcon}>Scope total</Eyebrow>

            <div>
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="font-heading text-[44px] tracking-[-0.03em] leading-none text-text tabular-nums">
                  {fmtMoney(total)}
                </span>
                <span className="text-[12.5px] text-text-soft">
                  {items.length === 0
                    ? "no items yet"
                    : `${items.length} ${items.length === 1 ? "item" : "items"}`}
                </span>
              </div>

              {hasItems && (
                <div className="mt-4">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-text-soft">
                      Approved
                    </span>
                    <span className="text-[12px] text-text-mid tabular-nums">
                      {approvedItems.length} of {items.length}
                    </span>
                  </div>
                  <div className="h-[6px] rounded-full bg-bg-alt overflow-hidden">
                    <div
                      className="h-full bg-green rounded-full transition-[width] duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <dl className="grid grid-cols-[1fr_auto] gap-y-2.5 gap-x-4 pt-[18px] border-t border-border">
              <DetailRow label="Approved" value={fmtMoney(approvedTotal)} />
              <DetailRow label="Outstanding" value={fmtMoney(outstandingTotal)} />
              <DetailRow
                label="Pending items"
                value={`${pendingItems.length}`}
              />
            </dl>
          </div>

          <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px] flex flex-col gap-4">
            <Eyebrow icon={UserIcon}>Client</Eyebrow>
            <div>
              <div className="font-heading text-[22px] tracking-[-0.015em] leading-[1.15] text-text">
                {project.clientName}
              </div>
              <div className="text-[12.5px] text-text-soft mt-1 break-all">
                {project.clientEmail}
              </div>
            </div>
            <dl className="grid grid-cols-[1fr_auto] gap-y-2.5 gap-x-4 pt-[18px] border-t border-border">
              <DetailRow label="Status" value={statusLabel(project.status)} />
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
