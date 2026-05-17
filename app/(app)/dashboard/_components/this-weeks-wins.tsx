import { SparklesIcon } from "@heroicons/react/16/solid";

import { prisma } from "@/lib/prisma";

function fmtMoney(n: number) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export async function ThisWeeksWins({ userId }: { userId: string }) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86_400_000);

  const items = await prisma.scopeItem.findMany({
    where: {
      status: "APPROVED",
      updatedAt: { gte: sevenDaysAgo },
      project: { userId },
    },
  });

  if (items.length === 0) return null;

  const total = items.reduce((sum, s) => sum + Number(s.price), 0);
  const count = items.length;

  return (
    <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px] flex flex-col gap-5">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-text-mid">
        <SparklesIcon className="w-3.5 h-3.5 text-text-soft" />
        This week
      </span>

      <div>
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <span className="font-heading text-[44px] tracking-[-0.03em] leading-none text-text tabular-nums">
            {fmtMoney(total)}
          </span>
          <span className="text-[12.5px] text-text-soft">approved</span>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold py-[2px] px-[7px] rounded-full bg-green-light text-green-dark tabular-nums">
            {count} {count === 1 ? "item" : "items"} signed off
          </span>
        </div>
      </div>
    </div>
  );
}
