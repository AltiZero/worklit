import Link from "next/link";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";

import { prisma } from "@/lib/prisma";

type EyebrowIcon = React.ComponentType<{ className?: string }>;

function Eyebrow({ icon: Icon, children }: { icon: EyebrowIcon; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-text-mid">
      <Icon className="w-3.5 h-3.5 text-text-soft" />
      {children}
    </span>
  );
}

export async function SentUnopened({ userId }: { userId: string }) {
  const now = new Date();
  const tokens = await prisma.clientToken.findMany({
    where: {
      viewedAt: null,
      revokedAt: null,
      expiresAt: { gt: new Date() },
      project: { userId },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
    include: {
      project: { select: { id: true, title: true, clientName: true } },
    },
  });

  if (tokens.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3.5 px-1">
        <Eyebrow icon={PaperAirplaneIcon}>Sent, no response</Eyebrow>
      </div>
      <p className="text-[12.5px] text-text-soft mb-3 px-1">
        Active review links the client has not opened yet.
      </p>
      <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
        {tokens.map((t, i) => {
          const days = Math.floor((now.getTime() - t.createdAt.getTime()) / 86_400_000);
          const isLast = i === tokens.length - 1;
          const sentLabel =
            days === 0 ? "sent today" : `sent ${days} ${days === 1 ? "day" : "days"} ago`;
          return (
            <Link
              key={t.id}
              href={`/dashboard/projects/${t.project.id}`}
              className={`group flex items-center gap-4 px-[22px] py-[15px] no-underline transition-colors duration-100 hover:bg-bg-alt/45 ${
                isLast ? "" : "border-b border-border"
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-green-light text-green-dark flex items-center justify-center text-[12.5px] font-semibold flex-shrink-0">
                {t.project.clientName[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-text truncate">{t.project.title}</div>
                <div className="text-[12px] text-text-soft mt-0.5 truncate">{t.project.clientName}</div>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0">
                <span className="text-[12px] text-text-soft tabular-nums">{sentLabel}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
