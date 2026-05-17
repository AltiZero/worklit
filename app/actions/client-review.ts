"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function trackReviewOpen(token: string) {
  const ct = await prisma.clientToken.findUnique({
    where: { token },
    include: { project: { select: { clientName: true } } },
  });
  if (!ct || ct.expiresAt < new Date() || ct.revokedAt) return;

  const viewedAt = new Date();
  await prisma.$transaction([
    prisma.clientToken.update({
      where: { token },
      data: {
        viewedAt: ct.viewedAt ?? viewedAt,
        lastViewedAt: viewedAt,
        viewCount: { increment: 1 },
      },
    }),
    ...(ct.viewedAt
      ? []
      : [
          prisma.changelogEntry.create({
            data: {
              projectId: ct.projectId,
              action: "opened client review link",
              actor: "CLIENT" as const,
              actorName: ct.project.clientName,
            },
          }),
        ]),
  ]);

  revalidatePath(`/dashboard/projects/${ct.projectId}`);
  revalidatePath("/dashboard");
}

export async function clientApproveItem(token: string, itemId: string) {
  const ct = await prisma.clientToken.findUnique({ where: { token } });
  if (!ct || ct.expiresAt < new Date() || ct.revokedAt || ct.submittedAt) return;

  const item = await prisma.scopeItem.findUnique({ where: { id: itemId } });
  if (!item || item.projectId !== ct.projectId) return;

  await prisma.scopeItem.update({ where: { id: itemId }, data: { status: "APPROVED" } });

  await prisma.changelogEntry.create({
    data: {
      projectId: ct.projectId,
      scopeItemId: itemId,
      action: `approved "${item.title}"`,
      oldStatus: item.status,
      newStatus: "APPROVED",
      actor: "CLIENT",
      note: "Approved via review link",
    },
  });

  await prisma.clientToken.update({
    where: { token },
    data: { usedAt: ct.usedAt ?? new Date() },
  });

  revalidatePath(`/review/${token}`);
  revalidatePath(`/dashboard/projects/${ct.projectId}`);
  revalidatePath("/dashboard");
}

export async function clientRejectItem(token: string, itemId: string) {
  const ct = await prisma.clientToken.findUnique({ where: { token } });
  if (!ct || ct.expiresAt < new Date() || ct.revokedAt || ct.submittedAt) return;

  const item = await prisma.scopeItem.findUnique({ where: { id: itemId } });
  if (!item || item.projectId !== ct.projectId) return;

  await prisma.scopeItem.update({ where: { id: itemId }, data: { status: "REJECTED" } });

  await prisma.changelogEntry.create({
    data: {
      projectId: ct.projectId,
      scopeItemId: itemId,
      action: `rejected "${item.title}"`,
      oldStatus: item.status,
      newStatus: "REJECTED",
      actor: "CLIENT",
      note: "Rejected via review link",
    },
  });

  await prisma.clientToken.update({
    where: { token },
    data: { usedAt: ct.usedAt ?? new Date() },
  });

  revalidatePath(`/review/${token}`);
  revalidatePath(`/dashboard/projects/${ct.projectId}`);
  revalidatePath("/dashboard");
}

export async function clientSubmitReview(token: string, clientName: string) {
  const ct = await prisma.clientToken.findUnique({ where: { token } });
  if (!ct || ct.expiresAt < new Date() || ct.revokedAt || ct.submittedAt) return;

  const pendingItems = await prisma.scopeItem.count({
    where: { projectId: ct.projectId, status: "PENDING" },
  });

  await prisma.changelogEntry.create({
    data: {
      projectId: ct.projectId,
      action: `submitted review${pendingItems > 0 ? ` (${pendingItems} items left pending)` : " — all items reviewed"}`,
      actor: "CLIENT",
      actorName: clientName || undefined,
      note: "Submitted via review link",
    },
  });

  const now = new Date();
  await prisma.clientToken.update({
    where: { token },
    data: {
      usedAt: now,
      submittedAt: now,
    },
  });

  if (pendingItems === 0) {
    await prisma.project.update({
      where: { id: ct.projectId },
      data: { status: "ACTIVE" },
    });
  }

  revalidatePath(`/review/${token}`);
  revalidatePath(`/dashboard/projects/${ct.projectId}`);
  revalidatePath("/dashboard");
}
