"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  FolderIcon,
  HomeIcon,
  ReceiptPercentIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/16/solid";

import { cn } from "@/lib/utils";
import { logout } from "@/app/actions/auth";

type NavGroup = {
  label: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
};

const navGroups: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { label: "Home", href: "/dashboard", icon: HomeIcon },
      { label: "Projects", href: "/dashboard/projects", icon: FolderIcon },
      { label: "Scopes", href: "/dashboard/scopes", icon: DocumentTextIcon },
      { label: "Invoices", href: "/dashboard/invoices", icon: ReceiptPercentIcon },
      { label: "Clients", href: "/dashboard/clients", icon: UsersIcon },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Reports", href: "/dashboard/reports", icon: ChartBarSquareIcon },
      { label: "Settings", href: "/dashboard/settings", icon: Cog6ToothIcon },
    ],
  },
];

function BrandMark() {
  return (
    <div className="w-[22px] h-[22px] rounded-[6px] bg-green flex items-center justify-center text-white flex-shrink-0">
      <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
        <path d="M2 7.5L5.5 11L12 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function UserSection({ initials, email, collapsed }: { initials: string; email: string; collapsed: boolean }) {
  return (
    <div className="flex items-center gap-2.5 rounded-[var(--radius)] bg-bg-alt p-2 overflow-hidden">
      <div className="w-7 h-7 rounded-full bg-green-light text-green-dark flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
        {initials}
      </div>
      <div
        className={cn(
          "flex-1 min-w-0 transition-opacity duration-200",
          collapsed && "opacity-0",
        )}
        aria-hidden={collapsed}
      >
        <div className="text-[12px] font-medium text-text truncate">{email}</div>
      </div>
      <form
        action={logout}
        className={cn(
          "flex-shrink-0 transition-opacity duration-200",
          collapsed && "opacity-0 pointer-events-none",
        )}
      >
        <button
          type="submit"
          className="text-text-soft bg-transparent border-none cursor-pointer hover:text-text transition-colors duration-150 p-1 flex items-center justify-center"
          title="Log out"
          tabIndex={collapsed ? -1 : undefined}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
        </button>
      </form>
    </div>
  );
}

function NavItems({ collapsed, onSelect }: { collapsed: boolean; onSelect?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col gap-px overflow-hidden">
      <Link
        href="/dashboard/projects/new"
        onClick={onSelect}
        className="flex items-center gap-2 bg-text text-bg no-underline rounded-[var(--radius)] py-[9px] pl-[15px] pr-3 mx-2 mb-3 text-[13px] font-medium cursor-pointer overflow-hidden whitespace-nowrap transition-[background,transform] duration-[0.15s,0.1s] hover:bg-[oklch(28%_0.014_60)] active:scale-[0.97]"
        title={collapsed ? "New scope" : undefined}
      >
        <PlusIcon className="w-3.5 h-3.5 flex-shrink-0" />
        <span className={cn("transition-opacity duration-200", collapsed && "opacity-0")}>
          New scope
        </span>
      </Link>

      {navGroups.map((group, groupIdx) => (
        <div key={group.label} className="flex flex-col gap-px">
          {groupIdx > 0 && <div className="mx-3 my-2 border-t border-border" />}
          {group.items.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onSelect}
              title={collapsed ? item.label : undefined}
              style={{ animationDelay: `${i * 30}ms` }}
              className={cn(
                "flex items-center gap-2.5 mx-2 py-[7px] pl-[14px] pr-2.5 rounded-md text-[13px] no-underline overflow-hidden whitespace-nowrap",
                "transition-[background,color,box-shadow] duration-[0.1s]",
                "animate-[navItemIn_250ms_ease-out_both]",
                isActive(item.href)
                  ? "bg-bg-card text-text font-medium shadow-[inset_0_0_0_1px_var(--border)]"
                  : "text-text-mid hover:bg-bg-alt/60 hover:text-text",
              )}
            >
              <item.icon className="w-4 h-4 stroke-[1.5] flex-shrink-0" />
              <span className={cn("transition-opacity duration-200", collapsed && "opacity-0")}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Sidebar({ initials, email, collapsed, onToggle }: { initials: string; email: string; collapsed: boolean; onToggle: () => void }) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="hidden max-[960px]:flex items-center justify-between h-14 px-5 bg-bg-card border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-semibold text-base tracking-[-0.3px] no-underline text-text">
          <BrandMark />
          Worklit
        </Link>
        <button
          className={cn(
            "flex flex-col justify-center items-center gap-[5px] w-9 h-9 bg-transparent border-none cursor-pointer p-1 rounded-lg transition-colors duration-150 hover:bg-bg-alt",
          )}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={cn(
            "block w-[18px] h-[1.5px] bg-text rounded-sm transition-[transform,opacity] duration-250 ease-out origin-center",
            open && "translate-y-[6.5px] rotate-45",
          )} />
          <span className={cn(
            "block w-[18px] h-[1.5px] bg-text rounded-sm transition-[transform,opacity] duration-250 ease-out origin-center",
            open && "opacity-0 scale-x-0",
          )} />
          <span className={cn(
            "block w-[18px] h-[1.5px] bg-text rounded-sm transition-[transform,opacity] duration-250 ease-out origin-center",
            open && "-translate-y-[6.5px] -rotate-45",
          )} />
        </button>
      </div>

      {/* Mobile overlay + drawer */}
      <div
        className={cn(
          "hidden max-[960px]:fixed inset-0 z-40 bg-text/30 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={close}
      />
      <div
        className={cn(
          "hidden max-[960px]:fixed top-0 left-0 bottom-0 z-50 w-[260px] bg-bg-card border-r border-border flex-col gap-3 pt-[18px] pb-[14px] overflow-y-auto transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Link href="/dashboard" onClick={close} className="flex items-center gap-2.5 font-semibold text-base tracking-[-0.3px] no-underline text-text px-3 py-1">
          <BrandMark />
          Worklit
        </Link>
        <NavItems collapsed={false} onSelect={close} />
        <div className="mt-auto mx-2">
          <UserSection initials={initials} email={email} collapsed={false} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "bg-bg flex flex-col gap-3 pt-3 pb-3 flex-shrink-0 sticky top-0 h-screen overflow-y-auto transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] max-[960px]:hidden",
          collapsed ? "w-[60px]" : "w-[240px]",
        )}
      >
        {/* Brand */}
        <div className="flex items-center h-11 px-[19px] overflow-hidden">
          <Link
            href="/dashboard"
            title={collapsed ? "Home" : undefined}
            className="flex items-center gap-2.5 font-semibold text-base tracking-[-0.3px] no-underline text-text overflow-hidden whitespace-nowrap"
          >
            <BrandMark />
            <span className={cn("transition-opacity duration-200", collapsed && "opacity-0")}>
              Worklit
            </span>
          </Link>
        </div>

        <NavItems collapsed={collapsed} />

        <div className="mt-auto mx-2">
          <UserSection initials={initials} email={email} collapsed={collapsed} />
        </div>
      </aside>
    </>
  );
}
