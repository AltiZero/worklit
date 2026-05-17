"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";

export type ScopeItemState = { message?: string; success?: boolean };

function formText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function revalidateScopeSurfaces(projectId: string) {
  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/scopes");
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard/reports");
}

export async function addScopeItem(projectId: string, _prev: ScopeItemState, formData: FormData): Promise<ScopeItemState> {
  const user = await requireAuth();

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== user.id) {
    return { message: "Project not found." };
  }

  const title = formText(formData, "title");
  const description = formText(formData, "description") || null;
  const priceStr = formText(formData, "price");

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

  revalidateScopeSurfaces(projectId);
  return { success: true };
}

export async function updateScopeItem(projectId: string, itemId: string, _prev: ScopeItemState, formData: FormData): Promise<ScopeItemState> {
  const user = await requireAuth();

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== user.id) {
    return { message: "Project not found." };
  }

  const item = await prisma.scopeItem.findUnique({ where: { id: itemId } });
  if (!item || item.projectId !== projectId) {
    return { message: "Scope item not found." };
  }

  const title = formText(formData, "title");
  const description = formText(formData, "description") || null;
  const priceStr = formText(formData, "price");

  if (!title) return { message: "Item title is required." };
  if (!priceStr) return { message: "Price is required." };

  const price = parseFloat(priceStr);
  if (isNaN(price) || price <= 0) {
    return { message: "Enter a valid price." };
  }

  const oldPrice = Number(item.price);
  const changedFields = [
    item.title !== title ? "title" : null,
    (item.description ?? null) !== description ? "description" : null,
    oldPrice !== price ? "price" : null,
  ].filter(Boolean);

  if (changedFields.length > 0) {
    const updatedItem = await prisma.scopeItem.update({
      where: { id: itemId },
      data: { title, description, price },
    });

    await prisma.changelogEntry.create({
      data: {
        projectId,
        scopeItemId: itemId,
        action: `edited "${updatedItem.title}"`,
        actor: "FREELANCER",
        actorName: user.email ?? undefined,
        note: `Updated ${changedFields.join(", ")}.`,
      },
    });

    revalidateScopeSurfaces(projectId);
  }

  return { success: true };
}

type ScopeStatus = "PENDING" | "APPROVED" | "REJECTED" | "DEFERRED";

async function setStatus(projectId: string, itemId: string, status: ScopeStatus) {
  const user = await requireAuth();

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== user.id) return;

  const item = await prisma.scopeItem.findUnique({ where: { id: itemId } });
  if (!item || item.projectId !== projectId) return;
  if (item.status === status) return;

  const oldStatus = item.status;
  await prisma.scopeItem.update({
    where: { id: itemId },
    data: { status },
  });

  const action = status === "PENDING" ? `reopened "${item.title}"` : `${status.toLowerCase()} "${item.title}"`;

  await prisma.changelogEntry.create({
    data: {
      projectId,
      scopeItemId: itemId,
      action,
      oldStatus,
      newStatus: status,
      actor: "FREELANCER",
      actorName: user.email ?? undefined,
    },
  });

  revalidateScopeSurfaces(projectId);
}

export async function approveItem(projectId: string, itemId: string) {
  await setStatus(projectId, itemId, "APPROVED");
}

export async function rejectItem(projectId: string, itemId: string) {
  await setStatus(projectId, itemId, "REJECTED");
}

export async function deferItem(projectId: string, itemId: string) {
  await setStatus(projectId, itemId, "DEFERRED");
}

export async function reopenItem(projectId: string, itemId: string) {
  await setStatus(projectId, itemId, "PENDING");
}
