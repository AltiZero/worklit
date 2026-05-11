"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Sidebar } from "@/components/dashboard/sidebar";

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

function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className={`flex items-center gap-0 text-[13px] ${className ?? ""}`}>
      {segments.map((seg, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const label = crumbLabels[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
        const isLast = i === segments.length - 1;

        return (
          <span key={href} className="flex items-center gap-0">
            {i > 0 && <span className="text-text-soft mx-1.5">/</span>}
            {isLast ? (
              <span className="text-text-mid font-medium">{label}</span>
            ) : (
              <Link href={href} className="text-text-soft no-underline hover:text-text transition-colors duration-150">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export function AppLayoutClient({
  initials,
  email,
  children,
}: {
  initials: string;
  email: string;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="min-h-screen bg-bg grid max-[960px]:flex max-[960px]:flex-col transition-[grid-template-columns] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
      style={{ gridTemplateColumns: collapsed ? "60px 1fr" : "240px 1fr" }}
    >
      <Sidebar
        initials={initials}
        email={email}
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
      />
      <div className="min-w-0 flex flex-col">
        {/* Top bar: toggle + breadcrumbs */}
        <div className="flex items-center gap-3 h-12 px-[22px] border-b border-border bg-bg-card">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="w-[36px] h-[36px] rounded-md bg-transparent border-none cursor-pointer flex items-center justify-center text-text-soft hover:bg-bg-alt hover:text-text transition-[background,color] duration-[0.1s] group flex-shrink-0"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="">
                <path d="M9 18l6-6-6-6M15 18l6-6-6-6" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="">
                <path d="M15 6l-6 6 6 6M9 6l-6 6 6 6" />
              </svg>
            )}
          </button>
          <Breadcrumbs />
        </div>

        <main className="flex-1 p-[22px] flex flex-col gap-[18px]">
          {children}
        </main>
      </div>
    </div>
  );
}
