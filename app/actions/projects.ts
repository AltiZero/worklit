"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";

export type ProjectState = { message?: string; success?: boolean };

export async function createProject(_prev: ProjectState, formData: FormData): Promise<ProjectState> {
  const user = await requireAuth();

  const title = (formData.get("title") as string).trim();
  const clientName = (formData.get("clientName") as string).trim();
  const clientEmail = (formData.get("clientEmail") as string).trim();

  if (!title) return { message: "Project title is required." };
  if (!clientName) return { message: "Client name is required." };
  if (!clientEmail) return { message: "Client email is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
    return { message: "Enter a valid client email." };
  }

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      title,
      clientName,
      clientEmail,
    },
  });

  await prisma.changelogEntry.create({
    data: {
      projectId: project.id,
      action: "created project",
      actor: "FREELANCER",
      actorName: user.email ?? undefined,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateProject(projectId: string, _prev: ProjectState, formData: FormData): Promise<ProjectState> {
  const user = await requireAuth();

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== user.id) {
    return { message: "Project not found." };
  }

  const title = (formData.get("title") as string).trim();
  const clientName = (formData.get("clientName") as string).trim();
  const clientEmail = (formData.get("clientEmail") as string).trim();

  if (!title) return { message: "Project title is required." };
  if (!clientName) return { message: "Client name is required." };
  if (!clientEmail) return { message: "Client email is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
    return { message: "Enter a valid client email." };
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { title, clientName, clientEmail, updatedAt: new Date() },
  });

  await prisma.changelogEntry.create({
    data: {
      projectId,
      action: "edited project details",
      actor: "FREELANCER",
      actorName: user.email ?? undefined,
    },
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteProject(projectId: string) {
  const user = await requireAuth();

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== user.id) {
    return;
  }

  await prisma.project.delete({ where: { id: projectId } });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
