import Link from "next/link";
import { FolderOpenIcon } from "@heroicons/react/16/solid";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";
import { PlusIcon } from "@/components/dashboard/icons";

import { ProjectsList, type ProjectListItem } from "./projects-list";

function fmtMoney(n: number) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default async function ProjectsPage() {
  const user = await requireAuth();

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { scopeItems: true },
  });

  const hasAnyProjects = projects.length > 0;
  const totalValue = projects.reduce(
    (sum, p) => sum + p.scopeItems.reduce((s, i) => s + Number(i.price), 0),
    0,
  );

  const listItems: ProjectListItem[] = projects.map((p) => {
    const value = p.scopeItems.reduce((s, i) => s + Number(i.price), 0);
    const approved = p.scopeItems.filter((s) => s.status === "APPROVED").length;
    const pending = p.scopeItems.filter((s) => s.status === "PENDING").length;
    return {
      id: p.id,
      title: p.title,
      clientName: p.clientName,
      status: p.status,
      updatedAt: p.updatedAt.toISOString(),
      value,
      total: p.scopeItems.length,
      approved,
      pending,
    };
  });

  return (
    <div className="flex flex-col gap-7">
      {/* Hero */}
      <header className="flex items-end justify-between gap-6 flex-wrap pt-1">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-soft mb-2.5">
            Workspace
          </div>
          <h1 className="font-heading text-[clamp(34px,3.4vw,46px)] tracking-[-0.025em] leading-[1.04] text-text">
            Projects
          </h1>
          <p className="text-[15px] text-text-mid mt-2.5 max-w-[52ch]">
            {hasAnyProjects
              ? `${projects.length} ${projects.length === 1 ? "project" : "projects"}, ${fmtMoney(totalValue)} in scope.`
              : "Create a project to start sending scope approvals."}
          </p>
        </div>
        {hasAnyProjects && (
          <Link
            href="/dashboard/projects/new"
            className="bg-green text-white py-[11px] px-[20px] rounded-[var(--radius)] text-[13.5px] font-medium no-underline inline-flex items-center gap-1.5 shadow-[var(--shadow-sm)] transition-[background,box-shadow] duration-200 hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97]"
          >
            <PlusIcon size={14} /> New project
          </Link>
        )}
      </header>

      {hasAnyProjects ? (
        <ProjectsList projects={listItems} />
      ) : (
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[44px] flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-[var(--radius)] bg-green-light flex items-center justify-center mb-5">
            <FolderOpenIcon className="w-5 h-5 text-green" />
          </div>
          <div className="font-heading text-[26px] text-text tracking-[-0.015em] mb-2">
            No projects yet.
          </div>
          <p className="text-[14px] text-text-mid leading-[1.6] max-w-[380px] mb-6">
            Create your first project to start defining deliverables and sending scope approvals to clients.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="bg-green text-white py-[13px] px-[26px] rounded-[var(--radius)] text-[14.5px] font-medium no-underline inline-flex items-center gap-2 shadow-[var(--shadow-sm)] transition-[background,box-shadow] duration-200 hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97]"
          >
            <PlusIcon size={14} /> Create a project
          </Link>
        </div>
      )}
    </div>
  );
}
