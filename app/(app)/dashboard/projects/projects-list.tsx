"use client";

import Link from "next/link";
import { useState } from "react";
import { FolderOpenIcon, Squares2X2Icon } from "@heroicons/react/16/solid";

import { ArrowIcon } from "@/components/dashboard/icons";

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

const FILTERS = [
  { key: "ALL", label: "All" },
  { key: "ACTIVE", label: "Active" },
  { key: "PENDING_REVIEW", label: "Awaiting" },
  { key: "DRAFT", label: "Draft" },
  { key: "COMPLETED", label: "Completed" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export type ProjectListItem = {
  id: string;
  title: string;
  clientName: string;
  status: string;
  updatedAt: string;
  value: number;
  total: number;
  approved: number;
  pending: number;
};

export function ProjectsList({ projects }: { projects: ProjectListItem[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ALL");

  const counts: Record<FilterKey, number> = {
    ALL: projects.length,
    ACTIVE: 0,
    PENDING_REVIEW: 0,
    DRAFT: 0,
    COMPLETED: 0,
  };
  for (const p of projects) {
    if (p.status in counts) counts[p.status as FilterKey] += 1;
  }

  const visibleProjects =
    activeFilter === "ALL" ? projects : projects.filter((p) => p.status === activeFilter);

  return (
    <>
      {/* Status filter tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {FILTERS.map((f) => {
          const isActive = f.key === activeFilter;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              className={`inline-flex items-center gap-1.5 px-[14px] py-[8px] rounded-[var(--radius)] text-[12.5px] cursor-pointer transition-[background,color,box-shadow] duration-150 ${
                isActive
                  ? "bg-bg-card border border-border shadow-[inset_0_0_0_1px_var(--border)] text-text font-medium"
                  : "bg-transparent border border-transparent text-text-mid hover:text-text"
              }`}
            >
              {f.label}
              <span
                className={`text-[11px] tabular-nums ${
                  isActive ? "text-text-soft" : "text-text-soft/80"
                }`}
              >
                {counts[f.key]}
              </span>
            </button>
          );
        })}
      </div>

      {visibleProjects.length > 0 ? (
        <section>
          <div className="flex items-center justify-between mb-3.5 px-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-text-mid">
              <Squares2X2Icon className="w-3.5 h-3.5 text-text-soft" />
              {activeFilter === "ALL" ? "All projects" : statusLabel(activeFilter)}
            </span>
            <span className="text-[12px] text-text-soft tabular-nums">
              {visibleProjects.length} {visibleProjects.length === 1 ? "result" : "results"}
            </span>
          </div>
          <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
            {visibleProjects.map((p, i) => {
              const isLast = i === visibleProjects.length - 1;
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
                      {p.clientName}
                      <span className="text-text-soft/60 mx-1">·</span>
                      {statusLabel(p.status)}
                      {p.pending > 0 && (
                        <>
                          <span className="text-text-soft/60 mx-1">·</span>
                          <span className="text-green-dark font-medium tabular-nums">
                            {p.pending} pending
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0">
                    <span className="font-heading text-[17px] text-text leading-none tracking-[-0.01em] tabular-nums">
                      {fmtMoney(p.value)}
                    </span>
                    <span className="text-[11px] text-text-soft tabular-nums">
                      {p.total === 0 ? "no items yet" : `${p.approved}/${p.total} approved`}
                    </span>
                  </div>
                  <span className="text-[11.5px] text-text-soft tabular-nums hidden md:inline-block">
                    {new Date(p.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <ArrowIcon size={12} />
                </Link>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[36px] flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-[var(--radius)] bg-green-light flex items-center justify-center mb-5">
            <FolderOpenIcon className="w-5 h-5 text-green" />
          </div>
          <div className="font-heading text-[26px] text-text tracking-[-0.015em] mb-2">
            Nothing here yet.
          </div>
          <p className="text-[14px] text-text-mid leading-[1.6] max-w-[360px] mb-6">
            No projects match this filter. Try a different status or view all.
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter("ALL")}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-[11px] rounded-[var(--radius)] border border-border-mid text-[13px] font-medium text-text bg-transparent cursor-pointer transition-[border-color,background] duration-150 hover:border-text-mid hover:bg-bg-alt/50"
          >
            View all projects
          </button>
        </div>
      )}
    </>
  );
}
