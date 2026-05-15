import Link from "next/link";
import { MoonIcon } from "@heroicons/react/16/solid";

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

export async function StaleProjects({ userId }: { userId: string }) {
  const fourteenDaysAgo = new Date(Date.now() - 14 * 86_400_000);

  const projects = await prisma.project.findMany({
    where: {
      userId,
      status: { in: ["DRAFT", "ACTIVE", "PENDING_REVIEW"] },
      updatedAt: { lt: fourteenDaysAgo },
    },
    orderBy: { updatedAt: "asc" },
    take: 4,
    include: { scopeItems: true },
  });

  if (projects.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3.5 px-1">
        <Eyebrow icon={MoonIcon}>Quiet for a while</Eyebrow>
      </div>
      <p className="text-[12.5px] text-text-soft mb-3 px-1">
        These haven&apos;t moved in a couple weeks.
      </p>
      <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
        {projects.map((p, i) => {
          const days = Math.floor((Date.now() - p.updatedAt.getTime()) / 86_400_000);
          const value = p.scopeItems.reduce((sum, s) => sum + Number(s.price), 0);
          const isLast = i === projects.length - 1;
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
                <div className="text-[12px] text-text-soft mt-0.5 truncate">{p.clientName}</div>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0">
                <span className="font-heading text-[17px] text-text leading-none tracking-[-0.01em] tabular-nums">
                  {fmtMoney(value)}
                </span>
                <span className="text-[11px] text-text-soft tabular-nums">
                  {days} days idle
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
