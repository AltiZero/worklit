"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Sidebar } from "@/components/dashboard/sidebar";
import { cn } from "@/lib/utils";
import { SearchPalette, type SearchProject } from "./search-palette";

const crumbLabels: Record<string, string> = {
  dashboard: "Home",
  projects: "Projects",
  new: "New project",
  scopes: "Scopes",
  invoices: "Invoices",
  clients: "Clients",
  reports: "Reports",
  settings: "Settings",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function Breadcrumbs({
  className,
  projectTitles,
}: {
  className?: string;
  projectTitles: Record<string, string>;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className={`flex items-center gap-0 text-[13px] ${className ?? ""}`}>
      {segments.map((seg, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const prev = segments[i - 1];
        const projectName = (prev === "projects" || prev === "invoices") && UUID_RE.test(seg) ? projectTitles[seg] : undefined;
        const label =
          projectName ??
          crumbLabels[seg] ??
          (UUID_RE.test(seg) ? seg.slice(0, 8) : seg.charAt(0).toUpperCase() + seg.slice(1));
        const isLast = i === segments.length - 1;

        return (
          <span key={href} className="flex items-center gap-0">
            {i > 0 && <span className="text-text-soft mx-1.5">/</span>}
            <Link
              href={href}
              className={cn(
                "no-underline transition-colors duration-150",
                isLast ? "text-text-mid font-medium hover:text-text" : "text-text-soft hover:text-text",
              )}
              aria-current={isLast ? "page" : undefined}
            >
              {label}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}

export function AppLayoutClient({
  initials,
  email,
  projectTitles,
  searchProjects,
  children,
}: {
  initials: string;
  email: string;
  projectTitles: Record<string, string>;
  searchProjects: SearchProject[];
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="min-h-screen bg-bg grid max-[960px]:flex max-[960px]:flex-col transition-[grid-template-columns] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] print:block print:bg-bg-card"
      style={{ gridTemplateColumns: collapsed ? "60px 1fr" : "240px 1fr" }}
    >
      <Sidebar
        initials={initials}
        email={email}
        collapsed={collapsed}
      />

      {/* Inset panel that holds the top bar + page content */}
      <div className="min-w-0 py-3 pr-3 max-[960px]:p-0 print:p-0">
        <div className="min-h-[calc(100vh-1.5rem)] bg-bg-card border border-border rounded-[var(--radius-lg)] flex flex-col overflow-hidden max-[960px]:rounded-none max-[960px]:border-x-0 max-[960px]:border-t-0 max-[960px]:min-h-0 print:min-h-0 print:border-0 print:rounded-none">
          {/* Top bar: toggle + breadcrumbs (inside the panel) */}
          <div className="flex items-center gap-0.5 h-11 p-[5px] border-b border-border flex-shrink-0 max-[960px]:h-12 max-[960px]:gap-2 max-[960px]:px-5 max-[960px]:py-1.5 print:hidden">
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="w-[34px] h-[34px] rounded-md bg-transparent border-none cursor-pointer inline-flex items-center justify-center text-text-soft hover:bg-bg-alt hover:text-text transition-[background,color] duration-[0.1s] flex-shrink-0 max-[960px]:hidden"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="16" rx="2.5" />
                <line x1="9" y1="4" x2="9" y2="20" />
              </svg>
            </button>
            <div className="w-px h-4 bg-border max-[960px]:hidden" aria-hidden="true" />
            <Breadcrumbs className="ml-2 min-w-0 overflow-hidden max-[960px]:ml-0" projectTitles={projectTitles} />
            <div className="ml-auto flex-shrink-0 pl-2 pr-2 max-[960px]:pl-3 max-[960px]:pr-0">
              <SearchPalette projects={searchProjects} />
            </div>
          </div>

          <main className="flex-1 p-[28px] flex flex-col gap-[18px] min-w-0 max-[960px]:p-[22px] print:p-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
