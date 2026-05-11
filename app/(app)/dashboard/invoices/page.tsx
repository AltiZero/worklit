import Link from "next/link";

// ── Types ──

type InvoiceStatus = "PAID" | "OVERDUE" | "PENDING";

interface Invoice {
  id: string;
  invoiceId: string;
  clientName: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
}

// ── Mock data ──

const invoices: Invoice[] = [
  { id: "1", invoiceId: "INV-001", clientName: "Acme Corp",          amount: 4200, status: "PAID",    dueDate: "2026-05-01" },
  { id: "2", invoiceId: "INV-002", clientName: "Brightwave Studio",  amount: 2800, status: "OVERDUE", dueDate: "2026-04-15" },
  { id: "3", invoiceId: "INV-003", clientName: "Northwind Creative", amount: 3500, status: "PENDING", dueDate: "2026-05-20" },
  { id: "4", invoiceId: "INV-004", clientName: "Stonehaven Design",  amount: 5600, status: "PAID",    dueDate: "2026-05-05" },
  { id: "5", invoiceId: "INV-005", clientName: "Meridian Group",     amount: 1800, status: "OVERDUE", dueDate: "2026-03-28" },
  { id: "6", invoiceId: "INV-006", clientName: "Timber & Vine",      amount: 7200, status: "PENDING", dueDate: "2026-06-01" },
];

// ── Helpers ──

function fmtMoney(n: number) {
  return "$" + n.toLocaleString();
}

function statusLabel(status: InvoiceStatus) {
  switch (status) {
    case "PAID":    return "Paid";
    case "OVERDUE": return "Overdue";
    case "PENDING": return "Pending";
  }
}

function statusStyles(status: InvoiceStatus): string {
  switch (status) {
    case "PAID":
      return "bg-green-light text-green-dark border-green-mid";
    case "OVERDUE":
      return "bg-bg-alt text-text-mid border-border-mid";
    case "PENDING":
      return "bg-bg-alt text-text-mid border-border-mid";
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

// ── Page ──

export default async function InvoicesPage() {
  const hasInvoices = invoices.length > 0;

  const totalOutstanding = invoices
    .filter((inv) => inv.status !== "PAID")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdueCount = invoices.filter((inv) => inv.status === "OVERDUE").length;

  const paidThisMonth = invoices
    .filter(
      (inv) =>
        inv.status === "PAID" &&
        inv.dueDate.startsWith("2026-05"),
    )
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div>
      {/* ── Header ── */}
      <header className="mb-8">
        <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-green mb-4">
          Money
        </div>
        <h1 className="font-heading text-[32px] tracking-[-0.02em] leading-none">
          Invoices
        </h1>
      </header>

      {hasInvoices ? (
        <>
          {/* ── Summary cards ── */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px]">
              <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-text-soft mb-2">
                Outstanding
              </div>
              <div className="font-heading text-[28px] tracking-[-0.02em] text-text leading-none tabular-nums">
                {fmtMoney(totalOutstanding)}
              </div>
            </div>

            <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px]">
              <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-text-soft mb-2">
                Overdue
              </div>
              <div className="font-heading text-[28px] tracking-[-0.02em] text-text leading-none tabular-nums">
                {overdueCount}
              </div>
              {overdueCount > 0 && (
                <div className="text-[12px] text-text-mid mt-1.5">
                  {overdueCount} invoice{overdueCount !== 1 ? "s" : ""} past due
                </div>
              )}
            </div>

            <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px]">
              <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-text-soft mb-2">
                Paid This Month
              </div>
              <div className="font-heading text-[28px] tracking-[-0.02em] text-text leading-none tabular-nums">
                {paidThisMonth > 0 ? fmtMoney(paidThisMonth) : "$0"}
              </div>
            </div>
          </div>

          {/* ── Invoices table ── */}
          <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_1fr_120px_120px_140px] px-[22px] py-3 border-b border-border text-[11px] font-semibold tracking-[0.12em] uppercase text-text-soft">
              <div>Invoice</div>
              <div>Client</div>
              <div className="text-right">Amount</div>
              <div className="text-center">Status</div>
              <div className="text-right">Due Date</div>
            </div>

            {/* Table rows */}
            {invoices.map((inv, i) => (
              <div
                key={inv.id}
                className={`grid grid-cols-[1fr_1fr_120px_120px_140px] px-[22px] py-4 items-center ${
                  i < invoices.length - 1 ? "border-b border-border" : ""
                } transition-colors duration-[0.1s] hover:bg-bg-alt/40`}
              >
                <div className="text-[14px] font-medium text-text">
                  {inv.invoiceId}
                </div>
                <div className="text-[14px] text-text-mid">
                  {inv.clientName}
                </div>
                <div className="text-[14px] font-medium text-text text-right tabular-nums">
                  {fmtMoney(inv.amount)}
                </div>
                <div className="flex justify-center">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-medium py-[3px] px-2.5 rounded-full border ${statusStyles(inv.status)}`}>
                    {statusIcon(inv.status)}
                    {statusLabel(inv.status)}
                  </span>
                </div>
                <div className="text-[14px] text-text-mid text-right tabular-nums">
                  {formatDate(inv.dueDate)}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* ── Empty state ── */
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-12 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-green-light flex items-center justify-center mb-5">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="1" width="12" height="14" rx="2" stroke="var(--green)" strokeWidth="1.5" />
              <path d="M5 4h6M5 7h6M5 10h3" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="font-heading text-[24px] text-text mb-2 tracking-[-0.01em]">
            No invoices yet
          </div>
          <p className="text-[14px] text-text-mid leading-[1.6] max-w-[360px] mb-6">
            Invoices are generated from approved scope items. Once a scope is fully approved, you can create an invoice here.
          </p>
          <Link
            href="/dashboard/projects"
            className="bg-green text-white py-[13px] px-[26px] rounded-[var(--radius)] font-sans text-[15px] font-medium no-underline transition-[background,transform,box-shadow] duration-[0.18s,0.16s,0.18s] inline-flex items-center gap-2 shadow-[0_1px_3px_oklch(20%_0.012_60_/_0.04)] hover:bg-green-hover hover:-translate-y-px hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97]"
          >
            View approved scopes
          </Link>
        </div>
      )}
    </div>
  );
}
