import Link from "next/link";
import {
  BanknotesIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/16/solid";

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

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <dt className="text-[12.5px] text-text-soft">{label}</dt>
      <dd className="text-[12.5px] text-text font-medium text-right tabular-nums">{value}</dd>
    </>
  );
}

export default async function InvoicesPage() {
  const user = await requireAuth();

  const projects = await prisma.project.findMany({
    where: {
      userId: user.id,
      scopeItems: {
        some: { status: "APPROVED" },
        none: { status: { not: "APPROVED" } },
      },
    },
    include: { scopeItems: { orderBy: { createdAt: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });

  const readyTotal = projects.reduce(
    (sum, project) => sum + project.scopeItems.reduce((itemSum, item) => itemSum + Number(item.price), 0),
    0,
  );
  const readyItems = projects.reduce((sum, project) => sum + project.scopeItems.length, 0);
  const hasReadyScopes = projects.length > 0;

  const summaryLine = hasReadyScopes
    ? `${fmtMoney(readyTotal)} ready to bill across ${projects.length} ${projects.length === 1 ? "project" : "projects"}.`
    : "Approved projects become downloadable invoice PDFs here.";

  return (
    <div className="flex flex-col gap-7">
      <header className="flex items-end justify-between gap-6 flex-wrap pt-1">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-soft mb-2.5">
            Billing
          </div>
          <h1 className="font-heading text-[clamp(34px,3.4vw,46px)] tracking-[-0.025em] leading-[1.04] text-text">
            Invoices
          </h1>
          <p className="text-[15px] text-text-mid mt-2.5 max-w-[52ch]">{summaryLine}</p>
        </div>
      </header>

      {hasReadyScopes ? (
        <>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px] flex flex-col gap-5">
              <Eyebrow icon={ReceiptPercentIcon}>Ready total</Eyebrow>
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="font-heading text-[44px] tracking-[-0.03em] leading-none text-text tabular-nums">
                  {fmtMoney(readyTotal)}
                </span>
                <span className="text-[12.5px] text-text-soft">approved</span>
              </div>
              <dl className="grid grid-cols-[1fr_auto] gap-y-2.5 gap-x-4 pt-[18px] border-t border-border">
                <DetailRow label="Projects" value={projects.length} />
                <DetailRow label="Items" value={readyItems} />
              </dl>
            </div>

            <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px] flex flex-col gap-5 md:col-span-2">
              <Eyebrow icon={CheckCircleIcon}>What this means</Eyebrow>
              <div>
                <div className="font-heading text-[24px] text-text tracking-[-0.015em] leading-[1.15]">
                  Approved scope is ready to send as an invoice.
                </div>
                <p className="text-[13px] text-text-mid leading-[1.6] mt-2 max-w-[64ch]">
                  Open a draft, review the line items, then download a PDF to send to your client.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3.5 px-1">
              <Eyebrow icon={BanknotesIcon}>Ready to invoice</Eyebrow>
              <span className="text-[12px] text-text-soft tabular-nums">
                {projects.length} {projects.length === 1 ? "project" : "projects"}
              </span>
            </div>
            <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
              {projects.map((project, i) => {
                const isLast = i === projects.length - 1;
                const total = project.scopeItems.reduce((sum, item) => sum + Number(item.price), 0);
                return (
                  <Link
                    key={project.id}
                    href={`/dashboard/invoices/${project.id}`}
                    className={`group flex items-center gap-4 px-[22px] py-[15px] no-underline transition-colors duration-100 hover:bg-bg-alt/45 ${
                      isLast ? "" : "border-b border-border"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-green-light text-green-dark flex items-center justify-center text-[12.5px] font-semibold flex-shrink-0">
                      {project.clientName[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-medium text-text truncate">{project.title}</div>
                      <div className="text-[12px] text-text-soft mt-0.5 truncate">
                        {project.clientName}
                        <span className="text-text-soft/60 mx-1">·</span>
                        {project.scopeItems.length} {project.scopeItems.length === 1 ? "item" : "items"} approved
                      </div>
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0">
                      <span className="font-heading text-[17px] text-text leading-none tracking-[-0.01em] tabular-nums">
                        {fmtMoney(total)}
                      </span>
                      <span className="text-[11px] text-text-soft">View invoice</span>
                    </div>
                    <ArrowIcon size={12} />
                  </Link>
                );
              })}
            </div>
          </section>
        </>
      ) : (
        <section className="bg-bg-card border border-border rounded-[var(--radius-lg)] px-[28px] py-[44px] flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-[var(--radius)] bg-green-light flex items-center justify-center mb-5">
            <DocumentTextIcon className="w-5 h-5 text-green" />
          </div>
          <div className="font-heading text-[26px] text-text tracking-[-0.015em] mb-2">
            No invoice-ready scopes yet.
          </div>
          <p className="text-[14px] text-text-mid leading-[1.6] max-w-[400px] mb-6">
            Get every item in a project approved, and a downloadable invoice PDF will appear here.
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
