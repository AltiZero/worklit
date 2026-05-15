import Link from "next/link";
import {
  BanknotesIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/16/solid";

import { ArrowIcon } from "@/components/dashboard/icons";

// ── Types ──

type InvoiceStatus = "PAID" | "SENT" | "DRAFT";

interface Invoice {
  id: string;
  invoiceId: string;
  title: string;
  clientName: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
}

// ── Mock data ──

const invoices: Invoice[] = [
  { id: "1", invoiceId: "INV-001", title: "Brand identity, phase 1", clientName: "Acme Corp",          amount: 4200, status: "PAID", dueDate: "2026-05-01" },
  { id: "2", invoiceId: "INV-002", title: "Website redesign",        clientName: "Brightwave Studio",  amount: 2800, status: "SENT", dueDate: "2026-04-15" },
  { id: "3", invoiceId: "INV-003", title: "Marketing site build",    clientName: "Northwind Creative", amount: 3500, status: "SENT", dueDate: "2026-05-20" },
  { id: "4", invoiceId: "INV-004", title: "Logo refresh",            clientName: "Stonehaven Design",  amount: 5600, status: "PAID", dueDate: "2026-05-05" },
  { id: "5", invoiceId: "INV-005", title: "Product launch package",  clientName: "Meridian Group",     amount: 1800, status: "SENT", dueDate: "2026-03-28" },
  { id: "6", invoiceId: "INV-006", title: "Editorial design system", clientName: "Timber & Vine",      amount: 7200, status: "DRAFT", dueDate: "2026-06-01" },
];

// ── Helpers ──

function fmtMoney(n: number) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function statusLabel(status: InvoiceStatus) {
  switch (status) {
    case "PAID":  return "Paid";
    case "SENT":  return "Sent";
    case "DRAFT": return "Draft";
  }
}

function statusStyles(status: InvoiceStatus): string {
  switch (status) {
    case "PAID":
      return "bg-green-light text-green-dark border-green-mid";
    case "SENT":
      return "bg-bg-alt text-text-mid border-border-mid";
    case "DRAFT":
      return "bg-bg-alt text-text-soft border-border-mid";
  }
}

function statusIcon(status: InvoiceStatus) {
  if (status !== "PAID") return null;
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Eyebrow ──

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

// ── Page ──

export default async function InvoicesPage() {
  const hasInvoices = invoices.length > 0;

  const totalOutstanding = invoices
    .filter((inv) => inv.status !== "PAID")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const outstandingCount = invoices.filter((inv) => inv.status !== "PAID").length;

  const paidThisMonth = invoices
    .filter(
      (inv) =>
        inv.status === "PAID" &&
        inv.dueDate.startsWith("2026-05"),
    )
    .reduce((sum, inv) => sum + inv.amount, 0);

  const paidThisMonthCount = invoices.filter(
    (inv) => inv.status === "PAID" && inv.dueDate.startsWith("2026-05"),
  ).length;

  const draftCount = invoices.filter((inv) => inv.status === "DRAFT").length;
  const sentCount = invoices.filter((inv) => inv.status === "SENT").length;

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  const dateLabel = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const summaryLine = !hasInvoices
    ? "Invoices appear once a scope is signed off."
    : outstandingCount > 0
      ? `${fmtMoney(totalOutstanding)} across ${outstandingCount} open ${outstandingCount === 1 ? "invoice" : "invoices"}.`
      : `All settled. ${fmtMoney(totalBilled)} billed to date.`;

  return (
    <div className="flex flex-col gap-7">
      {/* Hero */}
      <header className="flex items-end justify-between gap-6 flex-wrap pt-1">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-soft mb-2.5">
            {dateLabel}
          </div>
          <h1 className="font-heading text-[clamp(34px,3.4vw,46px)] tracking-[-0.025em] leading-[1.04] text-text">
            Invoices
          </h1>
          <p className="text-[15px] text-text-mid mt-2.5 max-w-[52ch]">{summaryLine}</p>
        </div>
      </header>

      {hasInvoices ? (
        <>
          {/* Summary cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Outstanding */}
            <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px] flex flex-col gap-5">
              <Eyebrow icon={ClockIcon}>Outstanding</Eyebrow>
              <div>
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="font-heading text-[44px] tracking-[-0.03em] leading-none text-text tabular-nums">
                    {fmtMoney(totalOutstanding)}
                  </span>
                  <span className="text-[12.5px] text-text-soft">awaiting payment</span>
                </div>
              </div>
              <dl className="grid grid-cols-[1fr_auto] gap-y-2.5 gap-x-4 pt-[18px] border-t border-border">
                <DetailRow label="Sent" value={`${sentCount}`} />
                <DetailRow label="Drafts" value={`${draftCount}`} />
              </dl>
            </div>

            {/* Paid this month */}
            <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px] flex flex-col gap-5">
              <Eyebrow icon={CurrencyDollarIcon}>Paid this month</Eyebrow>
              <div>
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="font-heading text-[44px] tracking-[-0.03em] leading-none text-text tabular-nums">
                    {fmtMoney(paidThisMonth)}
                  </span>
                  <span className="text-[12.5px] text-text-soft">this month</span>
                </div>
                {paidThisMonthCount > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold py-[2px] px-[7px] rounded-full bg-green-light text-green-dark">
                      <BanknotesIcon className="w-3 h-3" /> Settled
                    </span>
                    <span className="text-[11.5px] text-text-soft">
                      {paidThisMonthCount} {paidThisMonthCount === 1 ? "invoice" : "invoices"} cleared
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Total billed */}
            <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px] flex flex-col gap-5">
              <Eyebrow icon={ReceiptPercentIcon}>Total billed</Eyebrow>
              <div>
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="font-heading text-[44px] tracking-[-0.03em] leading-none text-text tabular-nums">
                    {fmtMoney(totalBilled)}
                  </span>
                  <span className="text-[12.5px] text-text-soft">to date</span>
                </div>
              </div>
              <dl className="grid grid-cols-[1fr_auto] gap-y-2.5 gap-x-4 pt-[18px] border-t border-border">
                <DetailRow label="Invoices" value={`${invoices.length}`} />
                <DetailRow label="Clients" value={`${new Set(invoices.map((i) => i.clientName)).size}`} />
              </dl>
            </div>
          </section>

          {/* Invoice list */}
          <section>
            <div className="flex items-center justify-between mb-3.5 px-1">
              <Eyebrow icon={DocumentTextIcon}>All invoices</Eyebrow>
              <span className="text-[12px] text-text-soft tabular-nums">
                {invoices.length} total
              </span>
            </div>
            <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
              {invoices.map((inv, i) => {
                const isLast = i === invoices.length - 1;
                return (
                  <div
                    key={inv.id}
                    className={`group flex items-center gap-4 px-[22px] py-[15px] transition-colors duration-100 hover:bg-bg-alt/45 ${
                      isLast ? "" : "border-b border-border"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-green-light text-green-dark flex items-center justify-center text-[12.5px] font-semibold flex-shrink-0">
                      {inv.clientName[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-medium text-text truncate">
                        {inv.title}
                      </div>
                      <div className="text-[12px] text-text-soft mt-0.5 truncate">
                        {inv.invoiceId} <span className="text-text-soft/60 mx-0.5">·</span> {inv.clientName}
                      </div>
                    </div>
                    <div className="hidden sm:flex flex-shrink-0">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium py-[3px] px-2.5 rounded-full border ${statusStyles(inv.status)}`}>
                        {statusIcon(inv.status)}
                        {statusLabel(inv.status)}
                      </span>
                    </div>
                    <div className="hidden md:flex flex-col items-end gap-0.5 flex-shrink-0 w-[120px]">
                      <span className="font-heading text-[17px] text-text leading-none tracking-[-0.01em] tabular-nums">
                        {fmtMoney(inv.amount)}
                      </span>
                      <span className="text-[11px] text-text-soft tabular-nums">
                        due {formatDate(inv.dueDate)}
                      </span>
                    </div>
                    <ArrowIcon size={12} />
                  </div>
                );
              })}
            </div>
          </section>
        </>
      ) : (
        /* Empty state */
        <section className="bg-bg-card border border-border rounded-[var(--radius-lg)] px-[28px] py-[44px] flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-[var(--radius)] bg-green-light flex items-center justify-center mb-5">
            <DocumentTextIcon className="w-5 h-5 text-green" />
          </div>
          <div className="font-heading text-[26px] text-text tracking-[-0.015em] mb-2">
            No invoices yet.
          </div>
          <p className="text-[14px] text-text-mid leading-[1.6] max-w-[400px] mb-6">
            Invoices populate here automatically once your client signs off on scope items.
            Get a project approved, then come back to bill for it.
          </p>
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-[11px] rounded-[var(--radius)] border border-border-mid text-[13px] font-medium text-text no-underline transition-[border-color,background] duration-150 hover:border-text-mid hover:bg-bg-alt/50"
          >
            View projects <ArrowIcon size={12} />
          </Link>
        </section>
      )}
    </div>
  );
}
