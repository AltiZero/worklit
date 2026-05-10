"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { DocIcon, FolderIcon, HomeIcon, PlusIcon, ReceiptIcon, UsersIcon } from "./icons";

const navItems = [
  { label: "Home", href: "/dashboard", icon: HomeIcon },
  { label: "Projects", href: "/dashboard/projects", icon: FolderIcon, badge: "0" },
  { label: "Scopes", href: "/dashboard/scopes", icon: DocIcon },
  { label: "Invoices", href: "/dashboard/invoices", icon: ReceiptIcon, badge: "0" },
  { label: "Clients", href: "/dashboard/clients", icon: UsersIcon },
];

export function Sidebar({ initials, email }: { initials: string; email: string }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-[232px] bg-bg border-r border-border flex flex-col gap-3.5 pt-[18px] pb-[14px] px-[14px] flex-shrink-0 sticky top-0 h-screen overflow-y-auto max-[960px]:hidden">
      <Link href="/dashboard" className="flex items-center gap-[9px] font-semibold text-base tracking-[-0.3px] no-underline text-text px-2 py-1">
        <div className="w-6 h-6 rounded-[7px] bg-green flex items-center justify-center text-white">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M2 7.5L5.5 11L12 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        Worklit
      </Link>

      <Link
        href="/dashboard/projects/new"
        className="flex items-center justify-center gap-[7px] bg-text text-bg no-underline rounded-[var(--radius)] py-[9px] px-3 text-[13.5px] font-medium cursor-pointer transition-[background,transform] duration-[0.15s,0.1s] hover:bg-[oklch(28%_0.014_60)] hover:-translate-y-px active:scale-[0.97]"
      >
        <PlusIcon size={14} />
        New scope
      </Link>

      <nav className="flex flex-col gap-px">
        <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-text-soft pt-1 pb-1 px-[10px]">
          Workspace
        </div>
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-[10px] py-[7px] px-[10px] rounded-lg text-[13.5px] font-normal no-underline transition-[background,color] duration-[0.12s] ${
              isActive(item.href)
                ? "bg-green-light text-green-dark font-medium"
                : "text-text-mid hover:bg-bg-alt hover:text-text"
            }`}
          >
            <item.icon size={16} />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className={`text-[11px] font-medium py-px px-[7px] rounded-full ${
                isActive(item.href) ? "bg-green text-white" : "bg-bg-alt text-text-soft"
              }`}>
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <nav className="flex flex-col gap-px">
        <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-text-soft pt-1 pb-1 px-[10px]" style={{ marginTop: 18 }}>
          Insights
        </div>
        <Link
          href="/dashboard/reports"
          className={`flex items-center gap-[10px] py-[7px] px-[10px] rounded-lg text-[13.5px] font-normal no-underline transition-[background,color] duration-[0.12s] ${
            isActive("/dashboard/reports") ? "bg-green-light text-green-dark font-medium" : "text-text-mid hover:bg-bg-alt hover:text-text"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18M7 14l4-4 3 3 5-7"/></svg>
          <span>Reports</span>
        </Link>
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-[10px] py-[7px] px-[10px] rounded-lg text-[13.5px] font-normal no-underline transition-[background,color] duration-[0.12s] ${
            isActive("/dashboard/settings") ? "bg-green-light text-green-dark font-medium" : "text-text-mid hover:bg-bg-alt hover:text-text"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h0a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v0a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          <span>Settings</span>
        </Link>
      </nav>

      {/* User */}
      <div className="mt-auto flex items-center gap-[10px] p-[10px] rounded-[10px] bg-bg-alt">
        <div className="w-8 h-8 rounded-full bg-green-light text-green-dark flex items-center justify-center text-xs font-semibold tracking-[0.02em] flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-text truncate">{email}</div>
          <div className="text-[11.5px] text-text-soft">Pro</div>
        </div>
      </div>
    </aside>
  );
}
