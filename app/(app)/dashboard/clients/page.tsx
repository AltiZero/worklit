import Link from "next/link";
import { UsersIcon } from "@heroicons/react/16/solid";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";
import { ArrowIcon, PlusIcon } from "@/components/dashboard/icons";

function fmtMoney(n: number) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
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

type ClientGroup = {
  name: string;
  email: string;
  projectCount: number;
  totalValue: number;
  lastProjectTitle: string;
  lastProjectId: string;
  lastUpdatedAt: Date;
};

export default async function ClientsPage() {
  const user = await requireAuth();

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { scopeItems: true },
  });

  const clientMap = new Map<string, ClientGroup>();

  for (const p of projects) {
    const value = p.scopeItems.reduce((sum, s) => sum + Number(s.price), 0);
    const existing = clientMap.get(p.clientEmail);
    if (existing) {
      existing.projectCount += 1;
      existing.totalValue += value;
      if (p.updatedAt > existing.lastUpdatedAt) {
        existing.lastUpdatedAt = p.updatedAt;
        existing.lastProjectTitle = p.title;
        existing.lastProjectId = p.id;
      }
    } else {
      clientMap.set(p.clientEmail, {
        name: p.clientName,
        email: p.clientEmail,
        projectCount: 1,
        totalValue: value,
        lastProjectTitle: p.title,
        lastProjectId: p.id,
        lastUpdatedAt: p.updatedAt,
      });
    }
  }

  const clients = Array.from(clientMap.values()).sort((a, b) => b.totalValue - a.totalValue);
  const totalProjects = projects.length;
  const hasClients = clients.length > 0;

  const summaryLine = hasClients
    ? `${clients.length} ${clients.length === 1 ? "client" : "clients"} across ${totalProjects} ${totalProjects === 1 ? "project" : "projects"}.`
    : "Clients appear here as you create projects.";

  return (
    <div className="flex flex-col gap-7">
      {/* Hero */}
      <header className="flex items-end justify-between gap-6 flex-wrap pt-1">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-soft mb-2.5">
            Roster
          </div>
          <h1 className="font-heading text-[clamp(34px,3.4vw,46px)] tracking-[-0.025em] leading-[1.04] text-text">
            Clients
          </h1>
          <p className="text-[15px] text-text-mid mt-2.5 max-w-[52ch]">{summaryLine}</p>
        </div>
        {hasClients && (
          <Link
            href="/dashboard/projects/new"
            className="bg-green text-white py-[11px] px-[20px] rounded-[var(--radius)] text-[13.5px] font-medium no-underline inline-flex items-center gap-1.5 shadow-[var(--shadow-sm)] transition-[background,transform,box-shadow] duration-200 hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97]"
          >
            <PlusIcon size={14} /> New project
          </Link>
        )}
      </header>

      {hasClients ? (
        <section>
          <div className="flex items-center justify-between mb-3.5 px-1">
            <Eyebrow icon={UsersIcon}>All clients</Eyebrow>
          </div>
          <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
            {clients.map((client, i) => {
              const isLast = i === clients.length - 1;
              return (
                <Link
                  key={client.email}
                  href={`/dashboard/projects/${client.lastProjectId}`}
                  className={`group flex items-center gap-4 px-[22px] py-[15px] no-underline transition-colors duration-100 hover:bg-bg-alt/45 ${
                    isLast ? "" : "border-b border-border"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-green-light text-green-dark flex items-center justify-center text-[12.5px] font-semibold flex-shrink-0">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-text truncate">{client.name}</div>
                    <div className="text-[12px] text-text-soft mt-0.5 truncate">{client.email}</div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0">
                    <span className="font-heading text-[17px] text-text leading-none tracking-[-0.01em] tabular-nums">
                      {fmtMoney(client.totalValue)}
                    </span>
                    <span className="text-[11px] text-text-soft tabular-nums">
                      {client.projectCount} {client.projectCount === 1 ? "project" : "projects"}
                    </span>
                  </div>
                  <ArrowIcon size={12} />
                </Link>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="bg-bg-card border border-border rounded-[var(--radius-lg)] px-[28px] py-[44px] flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-[var(--radius)] bg-green-light flex items-center justify-center mb-5">
            <UsersIcon className="w-5 h-5 text-green" />
          </div>
          <div className="font-heading text-[26px] text-text tracking-[-0.015em] mb-2">
            No clients yet.
          </div>
          <p className="text-[14px] text-text-mid leading-[1.6] max-w-[400px] mb-6">
            Clients appear when you create your first project.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="bg-green text-white py-[13px] px-[26px] rounded-[var(--radius)] text-[14.5px] font-medium no-underline inline-flex items-center gap-2 shadow-[var(--shadow-sm)] transition-[background,transform,box-shadow] duration-200 hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97]"
          >
            <PlusIcon size={14} /> Create a project
          </Link>
        </section>
      )}
    </div>
  );
}
