"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/supabase/session";

import { randomUUID } from "crypto";

type TokenRecord = {
  token: string;
  expiresAt: Date;
  viewedAt: Date | null;
  lastViewedAt: Date | null;
  viewCount: number;
  usedAt: Date | null;
  submittedAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
};

export type ClientReviewToken = {
  token: string;
  expiresAt: string;
  viewedAt: string | null;
  lastViewedAt: string | null;
  viewCount: number;
  usedAt: string | null;
  submittedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
};

function serializeToken(token: TokenRecord): ClientReviewToken {
  return {
    token: token.token,
    expiresAt: token.expiresAt.toISOString(),
    viewedAt: token.viewedAt?.toISOString() ?? null,
    lastViewedAt: token.lastViewedAt?.toISOString() ?? null,
    viewCount: token.viewCount,
    usedAt: token.usedAt?.toISOString() ?? null,
    submittedAt: token.submittedAt?.toISOString() ?? null,
    revokedAt: token.revokedAt?.toISOString() ?? null,
    createdAt: token.createdAt.toISOString(),
  };
}

export async function generateToken(projectId: string) {
  const user = await requireAuth();

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== user.id) return;

  const token = randomUUID();
  const now = new Date();

  const result = await prisma.$transaction(async (tx) => {
    const revoked = await tx.clientToken.updateMany({
      where: {
        projectId,
        expiresAt: { gt: now },
        revokedAt: null,
      },
      data: { revokedAt: now },
    });

    const created = await tx.clientToken.create({
      data: {
        projectId,
        token,
        expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await tx.changelogEntry.create({
      data: {
        projectId,
        action: "generated client review link",
        actor: "FREELANCER",
        actorName: user.email ?? undefined,
        note: revoked.count > 0 ? "Previous active review links were revoked." : undefined,
      },
    });

    await tx.project.update({
      where: { id: projectId },
      data: { status: "PENDING_REVIEW" },
    });

    return created;
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath("/dashboard");
  return serializeToken(result);
}

export async function revokeToken(projectId: string, token: string) {
  const user = await requireAuth();
  const now = new Date();

  const existing = await prisma.clientToken.findUnique({
    where: { token },
    include: { project: { select: { userId: true } } },
  });

  if (!existing || existing.projectId !== projectId || existing.project.userId !== user.id) {
    return;
  }

  const updated = await prisma.$transaction(async (tx) => {
    const revoked = await tx.clientToken.update({
      where: { token },
      data: { revokedAt: existing.revokedAt ?? now },
    });

    if (!existing.revokedAt) {
      await tx.changelogEntry.create({
        data: {
          projectId,
          action: "revoked client review link",
          actor: "FREELANCER",
          actorName: user.email ?? undefined,
        },
      });
    }

    return revoked;
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath("/dashboard");
  revalidatePath(`/review/${token}`);
  return serializeToken(updated);
}
