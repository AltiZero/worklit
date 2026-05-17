import Link from "next/link";
import { ClockIcon } from "@heroicons/react/16/solid";

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

export async function AwaitingLongest({ userId }: { userId: string }) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86_400_000);

  const items = await prisma.scopeItem.findMany({
    where: {
      status: "PENDING",
      updatedAt: { lt: sevenDaysAgo },
      project: { userId },
    },
    orderBy: { updatedAt: "asc" },
    take: 5,
    include: {
      project: { select: { id: true, title: true, clientName: true } },
    },
  });

  if (items.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3.5 px-1">
        <Eyebrow icon={ClockIcon}>Awaiting longest</Eyebrow>
        <Link
          href="/dashboard/scopes"
          className="text-[12px] text-text-mid no-underline hover:text-green transition-colors duration-150"
        >
          View all
        </Link>
      </div>
      <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
        {items.map((item, i) => {
          const days = Math.floor((now.getTime() - item.updatedAt.getTime()) / 86_400_000);
          const isLast = i === items.length - 1;
          return (
            <Link
              key={item.id}
              href={`/dashboard/projects/${item.project.id}`}
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
                  {item.project.title} <span className="text-text-soft/60 mx-0.5">·</span> {item.project.clientName}
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0">
                <span className="font-heading text-[17px] text-text leading-none tracking-[-0.01em] tabular-nums">
                  {fmtMoney(Number(item.price))}
                </span>
                <span className="text-[11px] text-text-soft tabular-nums">
                  {days} {days === 1 ? "day" : "days"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
