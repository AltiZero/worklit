import Link from "next/link";
import {
  CheckCircleIcon,
  ClockIcon,
  InboxIcon,
} from "@heroicons/react/16/solid";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";
import { ArrowIcon, PlusIcon } from "@/components/dashboard/icons";

function fmtMoney(n: number) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function relativeTime(d: Date) {
  const ago = Date.now() - d.getTime();
  const mins = Math.floor(ago / 60_000);
  const hrs = Math.floor(ago / 3_600_000);
  const days = Math.floor(ago / 86_400_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
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

export default async function ScopesPage() {
  const user = await requireAuth();

  const pendingItems = await prisma.scopeItem.findMany({
    where: {
      status: "PENDING",
      project: { userId: user.id },
    },
    include: { project: true },
    orderBy: { createdAt: "desc" },
  });

  const approvedItems = await prisma.scopeItem.findMany({
    where: {
      status: "APPROVED",
      project: { userId: user.id },
    },
    include: { project: true },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  const hasPending = pendingItems.length > 0;
  const hasApproved = approvedItems.length > 0;
  const hasAnything = hasPending || hasApproved;

  const summaryLine = hasPending
    ? `${pendingItems.length} ${pendingItems.length === 1 ? "item is" : "items are"} waiting on you.`
    : hasApproved
      ? "Nothing pending. Recent approvals below."
      : "Add deliverables to your projects to see them here.";

  return (
    <div className="flex flex-col gap-7">
      {/* Hero */}
      <header className="flex items-end justify-between gap-6 flex-wrap pt-1">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-soft mb-2.5">
            Approval inbox
          </div>
          <h1 className="font-heading text-[clamp(34px,3.4vw,46px)] tracking-[-0.025em] leading-[1.04] text-text">
            Scopes
          </h1>
          <p className="text-[15px] text-text-mid mt-2.5 max-w-[52ch]">{summaryLine}</p>
        </div>
      </header>

      {/* Pending — attention strip */}
      {hasPending && (
        <section>
          <div className="flex items-center justify-between mb-3.5 px-1">
            <Eyebrow icon={ClockIcon}>
              Awaiting, {pendingItems.length}
            </Eyebrow>
          </div>
          <div className="flex flex-col gap-3">
            {pendingItems.map((item) => (
              <Link
                key={item.id}
                href={`/dashboard/projects/${item.projectId}`}
                className="group bg-green-light/55 border border-green-mid rounded-[var(--radius-lg)] px-5 py-4 no-underline flex items-center gap-4 transition-[background,box-shadow] duration-200 hover:bg-green-light hover:shadow-[var(--shadow-md)]"
              >
                <div className="w-9 h-9 rounded-full bg-green-mid flex items-center justify-center text-[13px] font-semibold text-green-dark flex-shrink-0">
                  {item.project.clientName[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-green-dark/85">
                    Pending approval
                  </div>
                  <div className="text-[14px] text-text font-medium mt-0.5 truncate">
                    {item.title}
                  </div>
                  <div className="text-[12px] text-text-mid mt-0.5 truncate">
                    {item.project.title}
                    <span className="text-text-soft/60 mx-1">·</span>
                    {item.project.clientName}
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0">
                  <span className="font-heading text-[16px] text-text leading-none tracking-[-0.01em] tabular-nums">
                    {fmtMoney(Number(item.price))}
                  </span>
                  <span className="text-[11px] text-text-soft tabular-nums">
                    {relativeTime(item.createdAt)}
                  </span>
                </div>
                <div className="text-[12px] font-semibold text-green-dark inline-flex items-center gap-1 flex-shrink-0 transition-transform duration-150 group-hover:translate-x-0.5">
                  Review <ArrowIcon size={12} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recently approved */}
      {hasApproved && (
        <section>
          <div className="flex items-center justify-between mb-3.5 px-1">
            <Eyebrow icon={CheckCircleIcon}>
              Approved, recent
            </Eyebrow>
            {!hasPending && (
              <span className="text-[12px] text-text-mid">Everything is signed off.</span>
            )}
          </div>
          <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
            {approvedItems.map((item, i) => {
              const isLast = i === approvedItems.length - 1;
              return (
                <Link
                  key={item.id}
                  href={`/dashboard/projects/${item.projectId}`}
                  className={`group flex items-center gap-4 px-[22px] py-[15px] no-underline transition-colors duration-100 hover:bg-bg-alt/45 ${
                    isLast ? "" : "border-b border-border"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-green-light text-green-dark flex items-center justify-center text-[12.5px] font-semibold flex-shrink-0">
                    {item.project.clientName[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-text truncate">{item.title}</div>
                    <div className="text-[12px] text-text-soft mt-0.5 truncate">
                      {item.project.title}
                      <span className="text-text-soft/60 mx-1">·</span>
                      {item.project.clientName}
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0">
                    <span className="font-heading text-[16px] text-text leading-none tracking-[-0.01em] tabular-nums">
                      {fmtMoney(Number(item.price))}
                    </span>
                    <span className="text-[11px] text-text-soft tabular-nums">
                      {relativeTime(item.updatedAt)}
                    </span>
                  </div>
                  <ArrowIcon size={12} />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty state, nothing at all */}
      {!hasAnything && (
        <section className="bg-bg-card border border-border rounded-[var(--radius-lg)] px-[28px] py-[44px] flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-[var(--radius)] bg-green-light flex items-center justify-center mb-5">
            <InboxIcon className="w-5 h-5 text-green" />
          </div>
          <div className="font-heading text-[26px] text-text tracking-[-0.015em] mb-2">
            No scope items yet.
          </div>
          <p className="text-[14px] text-text-mid leading-[1.6] max-w-[400px] mb-6">
            Add deliverables to a project and they will land here once your client opens the magic
            link for sign-off.
          </p>
          <Link
            href="/dashboard/projects"
            className="bg-green text-white py-[11px] px-[20px] rounded-[var(--radius)] text-[13.5px] font-medium no-underline inline-flex items-center gap-1.5 shadow-[var(--shadow-sm)] transition-[background,transform,box-shadow] duration-200 hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97]"
          >
            <PlusIcon size={14} /> Go to projects
          </Link>
        </section>
      )}
    </div>
  );
}
