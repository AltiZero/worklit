"use client";

import { useMemo, useState } from "react";
import { CalendarDaysIcon, DocumentTextIcon } from "@heroicons/react/16/solid";
import { ChevronDownIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PrintInvoiceButton } from "./print-invoice-button";

const TERMS = [
  { label: "On receipt", days: 0 },
  { label: "Net 7", days: 7 },
  { label: "Net 14", days: 14 },
  { label: "Net 30", days: 30 },
  { label: "Net 45", days: 45 },
  { label: "Net 60", days: 60 },
] as const;

type TermValue = "custom" | `${number}`;

type InvoiceItem = {
  id: string;
  title: string;
  description: string | null;
  price: number;
};

type InvoiceDraftPreviewProps = {
  approvedItems: InvoiceItem[];
  clientEmail: string;
  clientName: string;
  freelancerEmail: string;
  invoiceNumber: string;
  issuedAtIso: string;
  projectId: string;
  projectTitle: string;
  total: number;
};

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtMoney(n: number) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function toInputDate(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromInputDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

type EyebrowIcon = React.ComponentType<{ className?: string }>;

function Eyebrow({ icon: Icon, children }: { icon: EyebrowIcon; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-text-mid">
      <Icon className="h-3.5 w-3.5 text-text-soft" />
      {children}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-border py-2.5 last:border-b-0">
      <dt className="text-[12.5px] text-text-soft">{label}</dt>
      <dd className="text-right text-[12.5px] font-medium text-text tabular-nums">{value}</dd>
    </div>
  );
}

export function InvoiceDraftPreview({
  approvedItems,
  clientEmail,
  clientName,
  freelancerEmail,
  invoiceNumber,
  issuedAtIso,
  projectId,
  projectTitle,
  total,
}: InvoiceDraftPreviewProps) {
  const issuedAt = useMemo(() => new Date(issuedAtIso), [issuedAtIso]);
  const earliestDueDate = useMemo(() => {
    const date = new Date(issuedAt);
    date.setHours(0, 0, 0, 0);
    return date;
  }, [issuedAt]);
  const [term, setTerm] = useState<TermValue>("14");
  const [customDueDate, setCustomDueDate] = useState(() => toInputDate(addDays(issuedAt, 14)));

  const dueDate = term === "custom" ? fromInputDate(customDueDate) : addDays(issuedAt, Number(term));
  const selectedTerm = TERMS.find((option) => String(option.days) === term);
  const termLabel = selectedTerm?.label ?? "Custom";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2.5 print:hidden sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2.5">
          <span className="text-[12.5px] text-text-soft">Due</span>
          <Popover>
            <PopoverTrigger
              render={
                <button
                  type="button"
                  className="inline-flex min-h-[38px] flex-1 cursor-pointer items-center gap-2 rounded-[var(--radius)] border border-border bg-bg-card px-3 py-1.5 text-left text-[13px] font-medium text-text outline-none transition-[border-color,box-shadow] duration-[180ms] hover:border-border-mid focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/10 sm:flex-initial"
                />
              }
            >
              <CalendarDaysIcon className="h-3.5 w-3.5 text-text-soft" aria-hidden="true" />
              <span className="tabular-nums">{fmtDate(dueDate)}</span>
              <span className="text-text-soft">·</span>
              <span className="text-text-mid">{termLabel}</span>
              <ChevronDownIcon className="ml-0.5 h-3.5 w-3.5 text-text-soft" aria-hidden="true" />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[284px] gap-2.5 p-2.5">
              <div className="grid grid-cols-3 gap-1">
                {TERMS.map((option) => {
                  const isActive = term === String(option.days);
                  return (
                    <button
                      key={option.days}
                      type="button"
                      onClick={() => setTerm(String(option.days) as TermValue)}
                      className={cn(
                        "inline-flex h-7 cursor-pointer items-center justify-center rounded-[6px] border px-2 text-[12px] font-medium outline-none transition-colors duration-150",
                        isActive
                          ? "border-green bg-green text-white"
                          : "border-border bg-bg-card text-text-mid hover:border-border-mid hover:text-text"
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-border" />
              <Calendar
                mode="single"
                selected={dueDate}
                disabled={{ before: earliestDueDate }}
                onSelect={(date) => {
                  if (!date) return;
                  setCustomDueDate(toInputDate(date));
                  setTerm("custom");
                }}
                className="w-full p-0 [&_[data-slot=calendar]]:w-full [&_button]:cursor-pointer"
                classNames={{ root: "w-full" }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <PrintInvoiceButton projectId={projectId} dueDateIso={dueDate.toISOString()} />
      </div>

      <section className="rounded-[var(--radius-lg)] border border-border bg-bg-card p-4 shadow-none sm:p-[28px] print:border-0 print:p-0">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <div className="flex items-baseline justify-between gap-5 border-b border-border pb-5 sm:pb-7">
              <div>
                <div className="font-heading text-[30px] leading-none tracking-[-0.025em] text-text sm:text-[38px]">
                  Invoice
                </div>
                <div className="mt-2 text-[13px] text-text-soft tabular-nums">{invoiceNumber}</div>
              </div>
              <div className="text-right">
                <div className="font-heading text-[30px] leading-none tracking-[-0.025em] text-text tabular-nums sm:text-[38px]">
                  {fmtMoney(total)}
                </div>
                <div className="mt-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-text-soft">
                  Total due
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 border-b border-border py-5 sm:gap-6 sm:py-7 sm:grid-cols-2">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-text-soft">From</div>
                <div className="mt-2 text-[14px] font-medium text-text">Worklit freelancer</div>
                <div className="mt-1 break-all text-[13px] text-text-mid">{freelancerEmail}</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-text-soft">Bill to</div>
                <div className="mt-2 text-[14px] font-medium text-text">{clientName}</div>
                <div className="mt-1 break-all text-[13px] text-text-mid">{clientEmail}</div>
              </div>
            </div>

            <div className="py-5 sm:py-7">
              <div className="mb-3 grid grid-cols-[minmax(0,1fr)_120px] gap-4 px-1 text-[11px] font-semibold tracking-[0.12em] uppercase text-text-soft">
                <div>Approved scope</div>
                <div className="text-right">Amount</div>
              </div>
              <div className="overflow-hidden rounded-[var(--radius)] border border-border">
                {approvedItems.map((item, i) => {
                  const isLast = i === approvedItems.length - 1;
                  return (
                    <div
                      key={item.id}
                      className={`grid grid-cols-[minmax(0,1fr)_120px] gap-4 bg-bg-card px-4 py-3.5 ${
                        isLast ? "" : "border-b border-border"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-[14px] font-medium text-text">{item.title}</div>
                        {item.description && (
                          <div className="mt-1 text-[12.5px] leading-[1.5] text-text-soft">{item.description}</div>
                        )}
                      </div>
                      <div className="text-right text-[14px] font-medium text-text tabular-nums">
                        {fmtMoney(item.price)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end border-t border-border pt-5">
              <dl className="w-full max-w-[300px]">
                <DetailRow label="Subtotal" value={fmtMoney(total)} />
                <DetailRow label="Tax" value={fmtMoney(0)} />
                <div className="grid grid-cols-[1fr_auto] gap-4 pt-4">
                  <dt className="text-[13px] font-semibold text-text">Total</dt>
                  <dd className="font-heading text-[28px] leading-none tracking-[-0.02em] text-text tabular-nums">
                    {fmtMoney(total)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <aside className="rounded-[var(--radius-lg)] border border-border bg-bg-alt/55 p-4 sm:p-[20px] print:bg-bg-card">
              <Eyebrow icon={CalendarDaysIcon}>Dates</Eyebrow>
              <dl className="mt-4">
                <DetailRow label="Issued" value={fmtDate(issuedAt)} />
                <DetailRow label="Due" value={fmtDate(dueDate)} />
              </dl>
            </aside>

            <div className="rounded-[var(--radius-lg)] border border-border bg-bg-alt/55 p-4 sm:p-[20px] print:bg-bg-card">
              <Eyebrow icon={DocumentTextIcon}>Source</Eyebrow>
              <div className="mt-3 text-[13px] font-medium leading-[1.45] text-text">{projectTitle}</div>
              <p className="mt-2 text-[12.5px] leading-[1.55] text-text-mid">
                Generated from approved Worklit scope items. Keep the project activity log as the approval record.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
