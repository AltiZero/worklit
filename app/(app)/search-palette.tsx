"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  FolderIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  ReceiptPercentIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import { cn } from "@/lib/utils";

export type SearchProject = {
  id: string;
  title: string;
  clientName: string;
  status: string;
};

type PageItem = {
  kind: "page";
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
};

type ProjectItem = {
  kind: "project";
  id: string;
  title: string;
  clientName: string;
  status: string;
};

type Item = PageItem | ProjectItem;

const PAGES: PageItem[] = [
  { kind: "page", label: "Home", href: "/dashboard", icon: HomeIcon },
  { kind: "page", label: "Projects", href: "/dashboard/projects", icon: FolderIcon },
  { kind: "page", label: "Scopes", href: "/dashboard/scopes", icon: DocumentTextIcon },
  { kind: "page", label: "Invoices", href: "/dashboard/invoices", icon: ReceiptPercentIcon },
  { kind: "page", label: "Clients", href: "/dashboard/clients", icon: UsersIcon },
  { kind: "page", label: "Reports", href: "/dashboard/reports", icon: ChartBarSquareIcon },
  { kind: "page", label: "Settings", href: "/dashboard/settings", icon: Cog6ToothIcon },
];

function statusLabel(status: string) {
  switch (status) {
    case "ACTIVE": return "Active";
    case "PENDING_REVIEW": return "Awaiting";
    case "DRAFT": return "Draft";
    case "COMPLETED": return "Completed";
    case "ARCHIVED": return "Archived";
    default: return status;
  }
}

function useMac() {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/i.test(navigator.userAgent));
  }, []);
  return isMac;
}

export function SearchPalette({ projects }: { projects: SearchProject[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isMac = useMac();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
  }, []);

  // Global cmd-k / ctrl-k
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const items: Item[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return [...PAGES, ...projects.slice(0, 6).map((p): ProjectItem => ({ kind: "project", ...p }))];
    }
    const pageMatches = PAGES.filter((p) => p.label.toLowerCase().includes(q));
    const projectMatches = projects
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) || p.clientName.toLowerCase().includes(q),
      )
      .map((p): ProjectItem => ({ kind: "project", ...p }));
    return [...pageMatches, ...projectMatches];
  }, [query, projects]);

  // Reset cursor on query change
  useEffect(() => {
    setCursor(0);
  }, [query]);

  // Scroll cursor into view
  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>(`[data-idx="${cursor}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  function hrefFor(item: Item): string {
    return item.kind === "page" ? item.href : `/dashboard/projects/${item.id}`;
  }

  function select(item: Item) {
    router.push(hrefFor(item));
    close();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = items[cursor];
      if (item) select(item);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  return (
    <>
      {/* Trigger button in the top bar */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 h-[30px] w-[220px] pl-2.5 pr-1.5 rounded-[var(--radius)] border border-border-mid bg-transparent text-[12.5px] text-text-soft hover:text-text hover:border-text-soft transition-[border-color,color] duration-150 cursor-pointer max-[640px]:w-auto"
        aria-label="Open search"
      >
        <MagnifyingGlassIcon className="w-3.5 h-3.5 stroke-[1.75]" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline-flex items-center justify-center font-sans tabular-nums text-[10.5px] h-[20px] px-1.5 rounded-[6px] bg-bg-alt border border-border text-text-soft ml-auto">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>

      {/* Palette overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[14vh] px-4 animate-[fadeUp_180ms_ease-out]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            className="absolute inset-0 bg-text/30 backdrop-blur-[2px]"
            onMouseDown={close}
          />
          <div className="relative w-full max-w-[560px] bg-bg-card border border-border rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] overflow-hidden">
            <div className="flex items-center gap-2.5 px-[18px] py-[14px] border-b border-border">
              <MagnifyingGlassIcon className="w-4 h-4 stroke-[1.5] text-text-soft flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search projects, pages..."
                className="flex-1 bg-transparent border-none outline-none text-[15px] text-text placeholder:text-text-soft min-w-0"
              />
              <kbd className="hidden sm:inline-flex items-center justify-center font-sans tabular-nums text-[10.5px] h-[20px] px-1.5 rounded-[6px] bg-bg-alt border border-border text-text-soft">
                Esc
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[58vh] overflow-y-auto py-1.5">
              {items.length === 0 ? (
                <div className="px-[18px] py-[28px] text-center text-[13px] text-text-soft">
                  No matches for &ldquo;{query}&rdquo;.
                </div>
              ) : (
                items.map((item, i) => (
                  <Link
                    key={item.kind === "page" ? `page-${item.href}` : `project-${item.id}`}
                    href={hrefFor(item)}
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => close()}
                    data-idx={i}
                    className={cn(
                      "flex items-center gap-3 mx-1.5 px-[14px] py-[9px] rounded-md no-underline transition-colors duration-100",
                      i === cursor
                        ? "bg-bg-alt text-text"
                        : "text-text-mid hover:bg-bg-alt/60",
                    )}
                  >
                    {item.kind === "page" ? (
                      <item.icon className="w-4 h-4 stroke-[1.5] text-text-soft flex-shrink-0" />
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-green-light text-green-dark flex items-center justify-center text-[10.5px] font-semibold flex-shrink-0">
                        {item.clientName[0]?.toUpperCase()}
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] text-text truncate">
                        {item.kind === "page" ? item.label : item.title}
                      </div>
                      {item.kind === "project" && (
                        <div className="text-[11.5px] text-text-soft truncate">
                          {item.clientName} <span className="text-text-soft/60 mx-0.5">·</span>{" "}
                          {statusLabel(item.status)}
                        </div>
                      )}
                    </div>
                    <span className="text-[10.5px] uppercase tracking-[0.1em] text-text-soft flex-shrink-0">
                      {item.kind === "page" ? "Page" : "Project"}
                    </span>
                  </Link>
                ))
              )}
            </div>

            <div className="flex items-center justify-between gap-3 px-[18px] py-[10px] border-t border-border bg-bg-alt/40 text-[11px] text-text-soft">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="inline-flex items-center justify-center font-sans text-[10px] h-[16px] min-w-[16px] px-1 rounded-[4px] bg-bg-card border border-border">↑</kbd>
                  <kbd className="inline-flex items-center justify-center font-sans text-[10px] h-[16px] min-w-[16px] px-1 rounded-[4px] bg-bg-card border border-border">↓</kbd>
                  Navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="inline-flex items-center justify-center font-sans text-[10px] h-[16px] px-1.5 rounded-[4px] bg-bg-card border border-border">Enter</kbd>
                  Open
                </span>
              </div>
              <span className="tabular-nums">
                {items.length} {items.length === 1 ? "result" : "results"}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
