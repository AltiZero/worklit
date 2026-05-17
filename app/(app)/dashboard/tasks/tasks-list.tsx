"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { fmtMoney, relativeTime } from "@/lib/helpers";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  DEFERRED: "Deferred",
  REJECTED: "Rejected",
};

const STATUSES = ["PENDING", "APPROVED", "DEFERRED", "REJECTED"] as const;
const FILTERS = ["ALL", ...STATUSES] as const;

type FilterKey = (typeof FILTERS)[number];

export type TaskListItem = {
  id: string;
  projectId: string;
  title: string;
  price: number;
  status: string;
  createdAt: string;
  projectTitle: string;
  clientName: string;
};

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-bg-alt text-text-mid border-border-mid",
    APPROVED: "bg-green-light text-green-dark border-green-mid",
    DEFERRED: "bg-bg-alt text-text-mid border-border-mid",
    REJECTED: "bg-bg-alt text-text-soft border-border-mid opacity-55",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-[3px] text-[11px] font-medium ${styles[status] || styles.PENDING}`}>
      {status === "APPROVED" && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12l5 5L20 7" />
        </svg>
      )}
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function TasksList({ items }: { items: TaskListItem[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ALL");

  const counts = useMemo(() => {
    const next: Record<FilterKey, number> = {
      ALL: items.length,
      PENDING: 0,
      APPROVED: 0,
      DEFERRED: 0,
      REJECTED: 0,
    };
    for (const item of items) {
      if (item.status in next) next[item.status as FilterKey] += 1;
    }
    return next;
  }, [items]);

  const visibleItems = useMemo(
    () => activeFilter === "ALL" ? items : items.filter((item) => item.status === activeFilter),
    [activeFilter, items],
  );

  if (items.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-1.5 flex-wrap">
        {FILTERS.map((status) => {
          const isActive = status === activeFilter;
          return (
            <button
              key={status}
              type="button"
              onClick={() => setActiveFilter(status)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-1.5 rounded-[var(--radius)] px-[14px] py-[8px] text-[12.5px] cursor-pointer transition-[background,color,box-shadow] duration-150 ${
                isActive
                  ? "bg-bg-card border border-border shadow-[inset_0_0_0_1px_var(--border)] text-text font-medium"
                  : "bg-transparent border border-transparent text-text-mid hover:text-text"
              }`}
            >
              {status === "ALL" ? "All" : STATUS_LABELS[status]}
              <span className={`text-[11px] tabular-nums ${isActive ? "text-text-soft" : "text-text-soft/80"}`}>
                {counts[status]}
              </span>
            </button>
          );
        })}
      </div>

      {visibleItems.length > 0 ? (
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
          {visibleItems.map((item, i) => {
            const isLast = i === visibleItems.length - 1;
            return (
              <Link
                key={item.id}
                href={`/dashboard/projects/${item.projectId}`}
                className={`flex items-center gap-4 px-[22px] py-[16px] no-underline transition-colors duration-[0.1s] hover:bg-bg-alt/40 max-[640px]:items-start max-[640px]:gap-3 ${
                  isLast ? "" : "border-b border-border"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-bg-alt border border-border flex items-center justify-center text-[11px] font-semibold text-text-mid flex-shrink-0">
                  {item.clientName[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-text-soft mb-0.5 truncate">
                    {item.projectTitle}
                  </div>
                  <div className="text-[14px] font-medium text-text truncate">{item.title}</div>
                  <div className="hidden max-[640px]:block text-[11.5px] text-text-soft mt-1">
                    {item.clientName} · {relativeTime(new Date(item.createdAt))}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 max-[640px]:flex-col max-[640px]:items-end max-[640px]:gap-1.5">
                  <span className="text-[14px] font-semibold text-text tabular-nums">{fmtMoney(item.price)}</span>
                  <StatusBadge status={item.status} />
                  <span className="text-[11.5px] text-text-soft w-[60px] text-right max-[640px]:hidden">
                    {relativeTime(new Date(item.createdAt))}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[36px] flex flex-col items-center text-center">
          <div className="font-heading text-[24px] text-text tracking-[-0.015em] mb-2">
            No {STATUS_LABELS[activeFilter]?.toLowerCase()} tasks.
          </div>
          <p className="text-[14px] text-text-mid leading-[1.6] max-w-[360px] mb-6">
            Try a different status or return to the full task list.
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter("ALL")}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-[11px] rounded-[var(--radius)] border border-border-mid text-[13px] font-medium text-text bg-transparent cursor-pointer transition-[border-color,background] duration-150 hover:border-text-mid hover:bg-bg-alt/50"
          >
            View all tasks
          </button>
        </div>
      )}
    </>
  );
}
