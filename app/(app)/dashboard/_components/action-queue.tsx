import Link from "next/link";
import {
  BanknotesIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  InboxIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/16/solid";

import { prisma } from "@/lib/prisma";
import { ArrowIcon } from "@/components/dashboard/icons";

type ActionIcon = React.ComponentType<{ className?: string }>;

type ActionItem = {
  id: string;
  priority: number;
  icon: ActionIcon;
  label: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  meta: string;
  value?: string;
};

function fmtMoney(n: number) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function daysBetween(now: Date, date: Date) {
  return Math.max(0, Math.floor((now.getTime() - date.getTime()) / 86_400_000));
}

function daysUntil(now: Date, date: Date) {
  return Math.ceil((date.getTime() - now.getTime()) / 86_400_000);
}

function ageLabel(days: number) {
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function expiryLabel(days: number) {
  if (days <= 0) return "expires today";
  if (days === 1) return "expires tomorrow";
  return `expires in ${days} days`;
}

function Eyebrow({ icon: Icon, children }: { icon: ActionIcon; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-text-mid">
      <Icon className="w-3.5 h-3.5 text-text-soft" />
      {children}
    </span>
  );
}

export async function ActionQueue({ userId }: { userId: string }) {
  const now = new Date();
  const soon = new Date(now.getTime() + 2 * 86_400_000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86_400_000);

  const [
    clientChanges,
    expiredReviewProjects,
    expiringTokens,
    awaitingItems,
    readyProjects,
    draftProjects,
  ] = await Promise.all([
    prisma.changelogEntry.findMany({
      where: {
        actor: "CLIENT",
        newStatus: { in: ["REJECTED", "DEFERRED"] },
        project: { userId },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        project: { select: { id: true, title: true, clientName: true } },
        scopeItem: { select: { title: true } },
      },
    }),
    prisma.project.findMany({
      where: {
        userId,
        status: "PENDING_REVIEW",
        clientTokens: { none: { expiresAt: { gt: now }, revokedAt: null } },
      },
      orderBy: { updatedAt: "asc" },
      take: 3,
      include: { scopeItems: true },
    }),
    prisma.clientToken.findMany({
      where: {
        usedAt: null,
        revokedAt: null,
        expiresAt: { gt: now, lte: soon },
        project: { userId },
      },
      orderBy: { expiresAt: "asc" },
      take: 3,
      include: { project: { select: { id: true, title: true, clientName: true } } },
    }),
    prisma.scopeItem.findMany({
      where: {
        status: "PENDING",
        updatedAt: { lt: sevenDaysAgo },
        project: { userId },
      },
      orderBy: { updatedAt: "asc" },
      take: 4,
      include: { project: { select: { id: true, title: true, clientName: true } } },
    }),
    prisma.project.findMany({
      where: {
        userId,
        scopeItems: {
          some: { status: "APPROVED" },
          none: { status: { not: "APPROVED" } },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 3,
      include: { scopeItems: true },
    }),
    prisma.project.findMany({
      where: {
        userId,
        status: "DRAFT",
        scopeItems: { none: {} },
      },
      orderBy: { updatedAt: "asc" },
      take: 3,
    }),
  ]);

  const actions: ActionItem[] = [
    ...clientChanges.map((entry): ActionItem => {
      const status = entry.newStatus === "REJECTED" ? "rejected" : "deferred";
      const itemTitle = entry.scopeItem?.title ?? "a scope item";
      return {
        id: `client-change-${entry.id}`,
        priority: 10,
        icon: InboxIcon,
        label: "Client response",
        title: `${entry.project.clientName} ${status} ${itemTitle}`,
        body: entry.note ?? `Decide whether to revise, replace, or leave this item out of scope.`,
        href: `/dashboard/projects/${entry.project.id}`,
        cta: "Open response",
        meta: ageLabel(daysBetween(now, entry.createdAt)),
      };
    }),
    ...expiredReviewProjects.map((project): ActionItem => {
      const pendingCount = project.scopeItems.filter((item) => item.status === "PENDING").length;
      const value = project.scopeItems.reduce((sum, item) => sum + Number(item.price), 0);
      return {
        id: `expired-review-${project.id}`,
        priority: 20,
        icon: ShieldExclamationIcon,
        label: "Review link",
        title: `Review link expired for ${project.title}`,
        body: pendingCount > 0
          ? `${pendingCount} ${pendingCount === 1 ? "item still needs" : "items still need"} a client decision.`
          : "Send a fresh review link or close out the project.",
        href: `/dashboard/projects/${project.id}`,
        cta: "Generate link",
        meta: project.clientName,
        value: value > 0 ? fmtMoney(value) : undefined,
      };
    }),
    ...expiringTokens.map((token): ActionItem => {
      const days = daysUntil(now, token.expiresAt);
      return {
        id: `expiring-token-${token.id}`,
        priority: 30,
        icon: PaperAirplaneIcon,
        label: "Follow up",
        title: `Nudge ${token.project.clientName}`,
        body: `The review link for ${token.project.title} ${expiryLabel(days)} with no client response.`,
        href: `/dashboard/projects/${token.project.id}`,
        cta: "Open project",
        meta: expiryLabel(days),
      };
    }),
    ...awaitingItems.map((item): ActionItem => {
      const days = daysBetween(now, item.updatedAt);
      return {
        id: `awaiting-item-${item.id}`,
        priority: 40,
        icon: ClockIcon,
        label: "Waiting",
        title: `Follow up on ${item.title}`,
        body: `${item.project.clientName} has had this item pending for ${days} ${days === 1 ? "day" : "days"}.`,
        href: `/dashboard/projects/${item.project.id}`,
        cta: "Open scope",
        meta: item.project.title,
        value: fmtMoney(Number(item.price)),
      };
    }),
    ...readyProjects.map((project): ActionItem => {
      const total = project.scopeItems.reduce((sum, item) => sum + Number(item.price), 0);
      return {
        id: `ready-project-${project.id}`,
        priority: 50,
        icon: BanknotesIcon,
        label: "Ready to bill",
        title: `Invoice ${project.title}`,
        body: `All scope items are approved for ${project.clientName}.`,
        href: "/dashboard/invoices",
        cta: "Open invoices",
        meta: `${project.scopeItems.length} ${project.scopeItems.length === 1 ? "item" : "items"} approved`,
        value: fmtMoney(total),
      };
    }),
    ...draftProjects.map((project): ActionItem => ({
      id: `draft-project-${project.id}`,
      priority: 60,
      icon: PencilSquareIcon,
      label: "Setup",
      title: `Add scope to ${project.title}`,
      body: `${project.clientName} has a project record, but no deliverables yet.`,
      href: `/dashboard/projects/${project.id}`,
      cta: "Add items",
      meta: ageLabel(daysBetween(now, project.updatedAt)),
    })),
  ]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5);

  return (
    <section>
      <div className="flex items-center justify-between mb-3.5 px-1">
        <Eyebrow icon={ClipboardDocumentCheckIcon}>Needs attention</Eyebrow>
        <span className="text-[12px] text-text-soft tabular-nums">
          {actions.length === 0 ? "All clear" : `${actions.length} ${actions.length === 1 ? "item" : "items"}`}
        </span>
      </div>

      <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
        {actions.length === 0 ? (
          <div className="px-[22px] py-[18px] flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-green-light text-green-dark flex items-center justify-center flex-shrink-0">
              <ClipboardDocumentCheckIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-medium text-text">Nothing urgent right now.</div>
              <div className="text-[12.5px] text-text-soft mt-0.5">
                New client decisions, expiring links, and invoice-ready work will appear here.
              </div>
            </div>
          </div>
        ) : (
          actions.map((action, index) => {
            const Icon = action.icon;
            const isLast = index === actions.length - 1;
            return (
              <Link
                key={action.id}
                href={action.href}
                className={`group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-[22px] py-[15px] no-underline transition-colors duration-100 hover:bg-bg-alt/45 ${
                  isLast ? "" : "border-b border-border"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-bg-alt border border-border text-text-mid flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10.5px] font-semibold tracking-[0.12em] uppercase text-text-soft">
                      {action.label}
                    </span>
                    <span className="text-[11.5px] text-text-soft truncate">{action.meta}</span>
                  </div>
                  <div className="text-[14px] font-medium text-text truncate">{action.title}</div>
                  <div className="text-[12.5px] text-text-mid mt-0.5 truncate">{action.body}</div>
                </div>
                <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
                  {action.value && (
                    <span className="font-heading text-[17px] text-text leading-none tracking-[-0.01em] tabular-nums">
                      {action.value}
                    </span>
                  )}
                  <span className="text-[12px] font-medium text-text-mid inline-flex items-center gap-1 transition-colors duration-150 group-hover:text-green">
                    {action.cta} <ArrowIcon size={12} />
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}
