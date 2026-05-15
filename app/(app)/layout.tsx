import { AppLayoutClient } from "./layout-client";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();
  const initials = (user.email ?? "?").split("@")[0].slice(0, 2).toUpperCase();

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    select: { id: true, title: true, clientName: true, status: true },
    orderBy: { updatedAt: "desc" },
  });
  const projectTitles = Object.fromEntries(projects.map((p) => [p.id, p.title]));

  return (
    <AppLayoutClient
      initials={initials}
      email={user.email ?? ""}
      projectTitles={projectTitles}
      searchProjects={projects.map((p) => ({
        id: p.id,
        title: p.title,
        clientName: p.clientName,
        status: p.status,
      }))}
    >
      {children}
    </AppLayoutClient>
  );
}
