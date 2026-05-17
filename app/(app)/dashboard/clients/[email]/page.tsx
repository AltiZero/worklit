import Link from "next/link";
import { notFound } from "next/navigation";
import { UsersIcon } from "@heroicons/react/16/solid";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";
import { ArrowIcon } from "@/components/dashboard/icons";
import { statusLabel } from "@/lib/helpers";

type Props = { params: Promise<{ email: string }> };

type EyebrowIcon = React.ComponentType<{ className?: string }>;

function Eyebrow({ icon: Icon, children }: { icon: EyebrowIcon; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-text-mid">
      <Icon className="w-3.5 h-3.5 text-text-soft" />
      {children}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${
        status === "ACTIVE" ? "bg-green" : "bg-text-soft"
      }`}
    />
  );
}

export default async function ClientDetailPage({ params }: Props) {
  const user = await requireAuth();
  const { email } = await params;
  const decodedEmail = decodeURIComponent(email);

  const projects = await prisma.project.findMany({
    where: { userId: user.id, clientEmail: decodedEmail },
    include: { scopeItems: { select: { id: true, status: true } } },
    orderBy: { updatedAt: "desc" },
  });

  if (projects.length === 0) notFound();

  const clientName = projects[0].clientName;
  const totalItems = projects.reduce((sum, p) => sum + p.scopeItems.length, 0);
  const approvedItems = projects.reduce(
    (sum, p) => sum + p.scopeItems.filter((s) => s.status === "APPROVED").length,
    0,
  );

  return (
    <div className="flex flex-col gap-7 w-full">
      <Link
        href="/dashboard/clients"
        className="text-[13px] text-text-mid no-underline hover:text-text transition-colors duration-150 inline-flex items-center gap-1.5 group"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform duration-150">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to clients
      </Link>

      <header className="flex items-end justify-between gap-6 flex-wrap pt-1">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-soft mb-2.5">
            Client
          </div>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-green-light text-green-dark flex items-center justify-center text-[15px] font-semibold flex-shrink-0">
              {clientName.charAt(0).toUpperCase()}
            </div>
            <h1 className="font-heading text-[clamp(34px,3.4vw,46px)] tracking-[-0.025em] leading-[1.04] text-text truncate">
              {clientName}
            </h1>
          </div>
          <p className="text-[15px] text-text-mid mt-2.5 max-w-[52ch] break-all">{decodedEmail}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-[520px]:grid-cols-1 max-[520px]:w-full">
          <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] px-5 py-3 text-center">
            <div className="text-[22px] font-heading text-text tracking-[-0.01em]">{projects.length}</div>
            <div className="text-[11px] text-text-soft mt-0.5">project{projects.length !== 1 ? "s" : ""}</div>
          </div>
          <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] px-5 py-3 text-center">
            <div className="text-[22px] font-heading text-text tracking-[-0.01em]">{totalItems}</div>
            <div className="text-[11px] text-text-soft mt-0.5">item{totalItems !== 1 ? "s" : ""}</div>
          </div>
          <div className="bg-green-light/40 border border-green-mid rounded-[var(--radius-lg)] px-5 py-3 text-center">
            <div className="text-[22px] font-heading text-green-dark tracking-[-0.01em]">{approvedItems}</div>
            <div className="text-[11px] text-green-dark mt-0.5">approved</div>
          </div>
        </div>
      </header>

      {/* Projects */}
      <div>
        <div className="mb-3.5 px-1">
          <Eyebrow icon={UsersIcon}>Projects</Eyebrow>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {projects.map((project) => {
            const pendingCount = project.scopeItems.filter((s) => s.status === "PENDING").length;
            const approvedCount = project.scopeItems.filter((s) => s.status === "APPROVED").length;

            return (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-5 no-underline transition-[border-color,box-shadow,transform] duration-200 hover:border-green-mid hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <StatusDot status={project.status} />
                    <span className="text-[11px] text-text-mid font-medium">{statusLabel(project.status)}</span>
                  </div>
                  <span className="text-[11px] text-text-soft">
                    {new Date(project.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>

                <div className="font-heading text-[18px] text-text tracking-[-0.01em] leading-[1.15] mb-2 group-hover:text-green transition-colors duration-150">
                  {project.title}
                </div>

                <div className="flex items-center gap-x-4 gap-y-1 text-[12px] flex-wrap">
                  <span className="text-text-mid">{project.scopeItems.length} item{project.scopeItems.length !== 1 ? "s" : ""}</span>
                  {pendingCount > 0 && (
                    <span className="text-green-dark font-medium">{pendingCount} pending</span>
                  )}
                  {approvedCount > 0 && (
                    <span className="text-text-soft">{approvedCount} approved</span>
                  )}
                </div>
                <div className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-text-mid transition-colors duration-150 group-hover:text-green-dark">
                  Open project <ArrowIcon size={12} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
