import Link from "next/link";
import { ClipboardDocumentListIcon } from "@heroicons/react/16/solid";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";
import { PlusIcon } from "@/components/dashboard/icons";

import { TasksList, type TaskListItem } from "./tasks-list";

export default async function TasksPage() {
  const user = await requireAuth();

  const items = await prisma.scopeItem.findMany({
    where: { project: { userId: user.id } },
    include: { project: { select: { id: true, title: true, clientName: true } } },
    orderBy: { createdAt: "desc" },
  });

  const taskItems: TaskListItem[] = items.map((item) => ({
    id: item.id,
    projectId: item.projectId,
    title: item.title,
    price: Number(item.price),
    status: item.status,
    createdAt: item.createdAt.toISOString(),
    projectTitle: item.project.title,
    clientName: item.project.clientName,
  }));

  const summaryLine = items.length > 0
    ? `${items.length} ${items.length === 1 ? "deliverable" : "deliverables"} across your workspace.`
    : "Add scope items to your projects and they will appear here.";

  return (
    <div className="flex flex-col gap-7">
      <header className="flex items-end justify-between gap-6 flex-wrap pt-1">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-soft mb-2.5">
            Workspace
          </div>
          <h1 className="font-heading text-[clamp(34px,3.4vw,46px)] tracking-[-0.025em] leading-[1.04] text-text">
            Tasks
          </h1>
          <p className="text-[15px] text-text-mid mt-2.5 max-w-[52ch]">{summaryLine}</p>
        </div>
      </header>

      {items.length > 0 ? (
        <TasksList items={taskItems} />
      ) : (
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-12 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-[var(--radius)] bg-green-light flex items-center justify-center mb-5">
            <ClipboardDocumentListIcon className="w-5 h-5 text-green" />
          </div>
          <div className="font-heading text-[26px] text-text tracking-[-0.015em] mb-2">No tasks yet.</div>
          <p className="text-[14px] text-text-mid leading-[1.6] max-w-[360px] mb-6">
            Add scope items to your projects and they will appear here.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="bg-green text-white py-[13px] px-[26px] rounded-[var(--radius)] text-[14.5px] font-medium no-underline inline-flex items-center gap-2 shadow-[var(--shadow-sm)] transition-[background,transform,box-shadow] duration-200 hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97]"
          >
            <PlusIcon size={14} /> Create a project
          </Link>
        </div>
      )}
    </div>
  );
}
