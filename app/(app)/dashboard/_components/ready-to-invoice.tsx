import Link from "next/link";
import { BanknotesIcon } from "@heroicons/react/16/solid";

import { prisma } from "@/lib/prisma";

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

export async function ReadyToInvoice({ userId }: { userId: string }) {
  const projects = await prisma.project.findMany({
    where: {
      userId,
      scopeItems: {
        some: { status: "APPROVED" },
        none: { status: { not: "APPROVED" } },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 4,
    include: { scopeItems: true },
  });

  if (projects.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3.5 px-1">
        <Eyebrow icon={BanknotesIcon}>Ready to invoice</Eyebrow>
      </div>
      <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
        <div className="px-[22px] py-[14px] border-b border-border text-[12.5px] text-text-soft">
          All items approved, ready to bill.
        </div>
        {projects.map((p, i) => {
          const approvedItems = p.scopeItems.filter((s) => s.status === "APPROVED");
          const total = approvedItems.reduce((sum, s) => sum + Number(s.price), 0);
          const isLast = i === projects.length - 1;
          return (
            <div
              key={p.id}
              className={`flex items-center gap-4 px-[22px] py-[15px] ${
                isLast ? "" : "border-b border-border"
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-green-light text-green-dark flex items-center justify-center text-[12.5px] font-semibold flex-shrink-0">
                {p.clientName[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-text truncate">{p.title}</div>
                <div className="text-[12px] text-text-soft mt-0.5 truncate">
                  {p.clientName} <span className="text-text-soft/60 mx-0.5">·</span>{" "}
                  <span className="tabular-nums">
                    {approvedItems.length} {approvedItems.length === 1 ? "item" : "items"} approved
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0">
                <span className="font-heading text-[17px] text-text leading-none tracking-[-0.01em] tabular-nums">
                  {fmtMoney(total)}
                </span>
              </div>
              <Link
                href="/dashboard/invoices"
                className="inline-flex items-center justify-center px-3 py-[7px] rounded-[var(--radius)] border border-border-mid text-[12px] font-medium text-text no-underline transition-[border-color,background] duration-150 hover:border-text-mid hover:bg-bg-alt/50 flex-shrink-0"
              >
                Generate invoice
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
