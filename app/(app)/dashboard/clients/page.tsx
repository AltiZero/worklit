import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";

type ClientGroup = {
  name: string;
  email: string;
  projectCount: number;
  totalScopeItems: number;
};

export default async function ClientsPage() {
  const user = await requireAuth();

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    select: { clientName: true, clientEmail: true, _count: { select: { scopeItems: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const clientMap = new Map<string, ClientGroup>();

  for (const p of projects) {
    const existing = clientMap.get(p.clientEmail) ?? {
      name: p.clientName,
      email: p.clientEmail,
      projectCount: 0,
      totalScopeItems: 0,
    };
    existing.projectCount += 1;
    existing.totalScopeItems += p._count.scopeItems;
    clientMap.set(p.clientEmail, existing);
  }

  const clients = Array.from(clientMap.values());

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <header>
        <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-green">
          Roster
        </div>
        <h1 className="font-heading text-[32px] tracking-[-0.02em] leading-none mt-2">
          Clients
        </h1>
      </header>

      {clients.length > 0 ? (
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] overflow-hidden">
          {clients.map((client, i) => (
            <div
              key={client.email}
              className={`flex items-center gap-4 px-[22px] py-[16px] transition-colors duration-[0.1s] hover:bg-bg-alt/40 ${
                i < clients.length - 1 ? "border-b border-border" : ""
              }`}
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-green-light text-green-dark flex items-center justify-center text-[13px] font-semibold flex-shrink-0">
                {client.name.charAt(0).toUpperCase()}
              </div>

              {/* Name + email */}
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-text truncate">
                  {client.name}
                </div>
                <div className="text-[12px] text-text-soft mt-0.5 truncate">
                  {client.email}
                </div>
              </div>

              {/* Project count */}
              <div className="text-right">
                <div className="text-[13px] font-medium text-text">
                  {client.projectCount}
                </div>
                <div className="text-[11px] text-text-soft mt-0.5">
                  project{client.projectCount !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Scope items count */}
              <div className="text-right min-w-[70px]">
                <div className="text-[13px] font-medium text-text">
                  {client.totalScopeItems}
                </div>
                <div className="text-[11px] text-text-soft mt-0.5">
                  scope item{client.totalScopeItems !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-12 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-green-light flex items-center justify-center mb-5">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="5" r="2.5" stroke="var(--green)" strokeWidth="1.5" />
              <path
                d="M3 14c0-2.75 2.5-5 5-5s5 2.25 5 5"
                stroke="var(--green)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="font-heading text-[22px] text-text mb-2 tracking-[-0.01em]">
            No clients yet
          </div>
          <p className="text-[14px] text-text-mid leading-[1.6] max-w-[360px]">
            Clients will appear here once you create projects and add client details.
          </p>
        </div>
      )}
    </div>
  );
}
