"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";

export type ScopeItemState = { message?: string };

export async function addScopeItem(projectId: string, _prev: ScopeItemState, formData: FormData): Promise<ScopeItemState> {
  const user = await requireAuth();

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== user.id) {
    return { message: "Project not found." };
  }

  const title = (formData.get("title") as string).trim();
  const description = (formData.get("description") as string).trim() || null;
  const priceStr = (formData.get("price") as string).trim();

  if (!title) return { message: "Item title is required." };
  if (!priceStr) return { message: "Price is required." };

  const price = parseFloat(priceStr);
  if (isNaN(price) || price <= 0) {
    return { message: "Enter a valid price." };
  }

  const item = await prisma.scopeItem.create({
    data: {
      projectId,
      title,
      description,
      price,
    },
  });

  await prisma.changelogEntry.create({
    data: {
      projectId,
      scopeItemId: item.id,
      action: `added "${item.title}"`,
      actor: "FREELANCER",
      actorName: user.email ?? undefined,
    },
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath("/dashboard");
  return {};
}
