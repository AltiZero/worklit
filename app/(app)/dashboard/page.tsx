import Link from "next/link";
import {
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  FolderOpenIcon,
  Squares2X2Icon,
} from "@heroicons/react/16/solid";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";
import { ArrowIcon, PlusIcon } from "@/components/dashboard/icons";

import { AwaitingLongest } from "./_components/awaiting-longest";
import { LatestFromClients } from "./_components/latest-from-clients";
import { ReadyToInvoice } from "./_components/ready-to-invoice";
import { SentUnopened } from "./_components/sent-unopened";
import { StaleProjects } from "./_components/stale-projects";
import { ThisWeeksWins } from "./_components/this-weeks-wins";

function fmtMoney(n: number) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function statusLabel(status: string) {
  switch (status) {
    case "ACTIVE": return "Active";
    case "PENDING_REVIEW": return "Awaiting client";
    case "DRAFT": return "Draft";
    case "COMPLETED": return "Completed";
    case "ARCHIVED": return "Archived";
    default: return status;
  }
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

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <dt className="text-[12.5px] text-text-soft">{label}</dt>
      <dd className="text-[12.5px] text-text font-medium text-right tabular-nums">{value}</dd>
    </>
  );
}

export default async function DashboardPage() {
  const user = await requireAuth();

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: 10,
    include: { scopeItems: true },
  });

  const pendingItems = projects.flatMap((p) =>
    p.scopeItems
      .filter((s) => s.status === "PENDING")
      .map((s) => ({ ...s, projectTitle: p.title, projectId: p.id, clientName: p.clientName })),
  );

  const allItems = projects.flatMap((p) => p.scopeItems);
  const approvedItems = allItems.filter((s) => s.status === "APPROVED");
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthRevenue = approvedItems
    .filter((s) => s.updatedAt >= monthStart)
    .reduce((sum, s) => sum + Number(s.price), 0);
  const outstandingValue = allItems
    .filter((s) => s.status === "PENDING")
    .reduce((sum, s) => sum + Number(s.price), 0);
  const activeProjectCount = projects.filter((p) => p.status === "ACTIVE").length;

  const nextUp =
    projects.find((p) => p.scopeItems.some((s) => s.status === "PENDING")) ??
    projects.find((p) => p.status === "ACTIVE") ??
    projects[0];

  const nextUpApproved = nextUp?.scopeItems.filter((s) => s.status === "APPROVED").length ?? 0;
  const nextUpPending = nextUp?.scopeItems.filter((s) => s.status === "PENDING").length ?? 0;
  const nextUpTotal = nextUp?.scopeItems.length ?? 0;
  const nextUpValue = nextUp?.scopeItems.reduce((sum, s) => sum + Number(s.price), 0) ?? 0;
  const nextUpProgress = nextUpTotal > 0 ? (nextUpApproved / nextUpTotal) * 100 : 0;

  const hour = new Date().getHours();
  const greeting = hour < 5 ? "Up late." : hour < 12 ? "Good morning." : hour < 17 ? "Good afternoon." : "Good evening.";

  const hasAttention = pendingItems.length > 0;
  const hasProjects = projects.length > 0;

  const summaryLine = !hasProjects
    ? "Let's get your first project shipped."
    : hasAttention
      ? `${pendingItems.length} ${pendingItems.length === 1 ? "item is" : "items are"} waiting on you.`
      : `Nothing pending. ${activeProjectCount || projects.length} active ${(activeProjectCount || projects.length) === 1 ? "project" : "projects"}.`;

  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-7">
      {/* Hero */}
      <header className="flex items-end justify-between gap-6 flex-wrap pt-1">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-soft mb-2.5">
            Today, {dateLabel}
          </div>
          <h1 className="font-heading text-[clamp(34px,3.4vw,46px)] tracking-[-0.025em] leading-[1.04] text-text">
            {greeting}
          </h1>
          <p className="text-[15px] text-text-mid mt-2.5 max-w-[52ch]">{summaryLine}</p>
        </div>
        {hasProjects && (
          <Link
            href="/dashboard/projects/new"
            className="bg-green text-white py-[11px] px-[20px] rounded-[var(--radius)] text-[13.5px] font-medium no-underline inline-flex items-center gap-1.5 shadow-[var(--shadow-sm)] transition-[background,transform,box-shadow] duration-200 hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97]"
          >
            <PlusIcon size={14} /> New project
          </Link>
        )}
      </header>

      {/* Attention strip */}
      {hasAttention && (
        <section
          className="grid gap-3"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}
        >
          {pendingItems.slice(0, 3).map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/projects/${item.projectId}`}
              className="group bg-green-light/55 border border-green-mid rounded-[var(--radius-lg)] px-5 py-4 no-underline flex items-center gap-4 transition-[background,box-shadow] duration-200 hover:bg-green-light hover:shadow-[var(--shadow-md)]"
            >
              <div className="w-9 h-9 rounded-full bg-green-mid flex items-center justify-center text-[13px] font-semibold text-green-dark flex-shrink-0">
                {item.clientName[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-green-dark/85">
                  Pending approval
                </div>
                <div className="text-[14px] text-text font-medium mt-0.5 truncate">{item.title}</div>
                <div className="text-[12px] text-text-mid mt-0.5 truncate">{item.projectTitle}</div>
              </div>
              <div className="text-[12px] font-semibold text-green-dark inline-flex items-center gap-1 flex-shrink-0 transition-transform duration-150 group-hover:translate-x-0.5">
                Review <ArrowIcon size={12} />
              </div>
            </Link>
          ))}
          {pendingItems.length > 3 && (
            <Link
              href="/dashboard/scopes"
              className="bg-bg-card border border-border border-dashed rounded-[var(--radius-lg)] px-5 py-4 no-underline flex items-center justify-center text-[13px] text-text-mid hover:border-border-mid hover:text-text transition-colors duration-150"
            >
              +{pendingItems.length - 3} more pending
            </Link>
          )}
        </section>
      )}

      {!hasProjects ? (
        /* Empty new-user state: full width, with setup guide */
        <section className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
          <div className="px-[28px] py-[36px] flex flex-col items-center text-center border-b border-border">
            <div className="w-12 h-12 rounded-[var(--radius)] bg-green-light flex items-center justify-center mb-5">
              <Squares2X2Icon className="w-5 h-5 text-green" />
            </div>
            <div className="font-heading text-[26px] text-text tracking-[-0.015em] mb-2">
              Start your first project.
            </div>
            <p className="text-[14px] text-text-mid leading-[1.6] max-w-[400px] mb-6">
              Define deliverables, send a magic link to your client, and get every item signed off.
              The whole thing takes about five minutes.
            </p>
            <Link
              href="/dashboard/projects/new"
              className="bg-green text-white py-[13px] px-[26px] rounded-[var(--radius)] text-[14.5px] font-medium no-underline inline-flex items-center gap-2 shadow-[var(--shadow-sm)] transition-[background,transform,box-shadow] duration-200 hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97]"
            >
              <PlusIcon size={14} /> Create a project
            </Link>
          </div>
          <div className="px-[28px] py-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
            {[
              { step: "01", label: "Create a project", desc: "Add a client and a project title." },
              { step: "02", label: "Add scope items", desc: "Define deliverables with prices." },
              { step: "03", label: "Send to client", desc: "Share a magic link for approval." },
              { step: "04", label: "Get paid", desc: "Invoice from approved items." },
            ].map((s) => (
              <div key={s.step} className="flex gap-3">
                <div className="font-heading text-[18px] text-text-soft tracking-[-0.01em] mt-[-2px] tabular-nums">
                  {s.step}
                </div>
                <div className="min-w-0">
                  <div className="text-[13.5px] font-medium text-text">{s.label}</div>
                  <div className="text-[12.5px] text-text-mid mt-0.5 leading-[1.5]">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* Has projects: two-column layout */
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
          {/* LEFT */}
          <div className="flex flex-col gap-7 min-w-0">
            <AwaitingLongest userId={user.id} />
            <ReadyToInvoice userId={user.id} />

            {/* Projects */}
            <section>
              <div className="flex items-center justify-between mb-3.5 px-1">
                <Eyebrow icon={Squares2X2Icon}>Projects</Eyebrow>
                <Link
                  href="/dashboard/projects"
                  className="text-[12px] text-text-mid no-underline hover:text-green transition-colors duration-150"
                >
                  View all
                </Link>
              </div>
              <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
                {projects.slice(0, 6).map((p, i) => {
                  const total = p.scopeItems.length;
                  const approved = p.scopeItems.filter((s) => s.status === "APPROVED").length;
                  const value = p.scopeItems.reduce((sum, s) => sum + Number(s.price), 0);
                  const isLast = i === Math.min(projects.length, 6) - 1;
                  return (
                    <Link
                      key={p.id}
                      href={`/dashboard/projects/${p.id}`}
                      className={`group flex items-center gap-4 px-[22px] py-[15px] no-underline transition-colors duration-100 hover:bg-bg-alt/45 ${
                        isLast ? "" : "border-b border-border"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-green-light text-green-dark flex items-center justify-center text-[12.5px] font-semibold flex-shrink-0">
                        {p.clientName[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-medium text-text truncate">{p.title}</div>
                        <div className="text-[12px] text-text-soft mt-0.5 truncate">
                          {p.clientName} <span className="text-text-soft/60 mx-0.5">·</span> {statusLabel(p.status)}
                        </div>
                      </div>
                      <div className="hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0">
                        <span className="font-heading text-[17px] text-text leading-none tracking-[-0.01em] tabular-nums">
                          {fmtMoney(value)}
                        </span>
                        <span className="text-[11px] text-text-soft tabular-nums">
                          {total === 0 ? "no items yet" : `${approved}/${total} approved`}
                        </span>
                      </div>
                      <ArrowIcon size={12} />
                    </Link>
                  );
                })}
              </div>
            </section>

            <StaleProjects userId={user.id} />
            <SentUnopened userId={user.id} />
          </div>

          {/* RIGHT */}
          <aside className="flex flex-col gap-5 min-w-0">
            <ThisWeeksWins userId={user.id} />

            {/* Revenue */}
            <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px] flex flex-col gap-5">
              <Eyebrow icon={CurrencyDollarIcon}>Revenue</Eyebrow>

              <div>
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="font-heading text-[44px] tracking-[-0.03em] leading-none text-text tabular-nums">
                    {fmtMoney(monthRevenue)}
                  </span>
                  <span className="text-[12.5px] text-text-soft">this month</span>
                </div>
                {monthRevenue > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold py-[2px] px-[7px] rounded-full bg-green-light text-green-dark">
                      <ArrowTrendingUpIcon className="w-3 h-3" /> Approved
                    </span>
                    <span className="text-[11.5px] text-text-soft">
                      {approvedItems.length} {approvedItems.length === 1 ? "item" : "items"} signed off
                    </span>
                  </div>
                )}
              </div>

              <dl className="grid grid-cols-[1fr_auto] gap-y-2.5 gap-x-4 pt-[18px] border-t border-border">
                <DetailRow label="Outstanding" value={fmtMoney(outstandingValue)} />
                <DetailRow
                  label="Pending items"
                  value={`${pendingItems.length}`}
                />
                <DetailRow
                  label="Active projects"
                  value={`${activeProjectCount}`}
                />
              </dl>

              <Link
                href="/dashboard/reports"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-[11px] rounded-[var(--radius)] border border-border-mid text-[13px] font-medium text-text no-underline transition-[border-color,background] duration-150 hover:border-text-mid hover:bg-bg-alt/50"
              >
                View reports <ArrowIcon size={12} />
              </Link>
            </div>

            {/* Next up */}
            {nextUp && (
              <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px] flex flex-col gap-5">
                <Eyebrow icon={FolderOpenIcon}>Next up</Eyebrow>

                <div>
                  <div className="font-heading text-[22px] tracking-[-0.015em] leading-[1.15] text-text">
                    {nextUp.title}
                  </div>
                  <div className="text-[12.5px] text-text-soft mt-1">{nextUp.clientName}</div>
                </div>

                {nextUpTotal > 0 && (
                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-text-soft">
                        Scope
                      </span>
                      <span className="text-[12px] text-text-mid tabular-nums">
                        {nextUpApproved} of {nextUpTotal} approved
                      </span>
                    </div>
                    <div className="h-[6px] rounded-full bg-bg-alt overflow-hidden">
                      <div
                        className="h-full bg-green rounded-full transition-[width] duration-500"
                        style={{ width: `${nextUpProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <dl className="grid grid-cols-[1fr_auto] gap-y-2.5 gap-x-4 pt-[18px] border-t border-border">
                  <DetailRow label="Scope value" value={fmtMoney(nextUpValue)} />
                  {nextUpPending > 0 && (
                    <DetailRow
                      label="Pending"
                      value={`${nextUpPending} ${nextUpPending === 1 ? "item" : "items"}`}
                    />
                  )}
                  <DetailRow label="Status" value={statusLabel(nextUp.status)} />
                </dl>

                <Link
                  href={`/dashboard/projects/${nextUp.id}`}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-[11px] rounded-[var(--radius)] bg-green text-white text-[13px] font-medium no-underline shadow-[var(--shadow-sm)] transition-[background,transform,box-shadow] duration-200 hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97]"
                >
                  Open project <ArrowIcon size={12} />
                </Link>
              </div>
            )}

            <LatestFromClients userId={user.id} />
          </aside>
        </div>
      )}
    </div>
  );
}
