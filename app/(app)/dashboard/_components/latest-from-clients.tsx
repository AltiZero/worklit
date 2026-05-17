import Link from "next/link";
import { InboxIcon } from "@heroicons/react/16/solid";

import { prisma } from "@/lib/prisma";

function relativeTime(d: Date) {
  const ago = Date.now() - d.getTime();
  const mins = Math.floor(ago / 60_000);
  const hrs = Math.floor(ago / 3_600_000);
  const days = Math.floor(ago / 86_400_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

export async function LatestFromClients({ userId }: { userId: string }) {
  const entries = await prisma.changelogEntry.findMany({
    where: { actor: "CLIENT", project: { userId } },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { project: { select: { title: true } } },
  });

  if (entries.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3.5 px-1">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-text-mid">
          <InboxIcon className="w-3.5 h-3.5 text-text-soft" />
          From clients
        </span>
      </div>
      <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
        {entries.map((entry, i) => (
          <div
            key={entry.id}
            className={`flex items-center gap-3 px-[18px] py-[10px] ${
              i < entries.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green flex-shrink-0" />
            <div className="flex-1 min-w-0 text-[12.5px] text-text-mid truncate">
              <span className="text-text font-medium">
                {entry.actorName ?? "Your client"}
              </span>{" "}
              {entry.action}{" "}
              <Link
                href={`/dashboard/projects/${entry.projectId}`}
                className="text-text font-medium no-underline hover:text-green transition-colors duration-150"
              >
                {entry.project.title}
              </Link>
            </div>
            <div className="text-[11.5px] text-text-soft flex-shrink-0 tabular-nums">
              {relativeTime(entry.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
