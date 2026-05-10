"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";

export type ProjectState = { message?: string };

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

  await prisma.project.create({
    data: {
      userId: user.id,
      title,
      clientName,
      clientEmail,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
