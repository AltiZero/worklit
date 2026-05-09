"use server";

import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type WaitlistInput = {
  email: string;
  fieldOfWork?: string;
  biggestPain?: string;
};

type WaitlistResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
    };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanOptional(value?: string) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}

export async function submitWaitlistSignup(input: WaitlistInput): Promise<WaitlistResult> {
  const email = input.email.trim().toLowerCase();
  const fieldOfWork = cleanOptional(input.fieldOfWork);
  const biggestPain = cleanOptional(input.biggestPain);

  if (!EMAIL_PATTERN.test(email)) {
    return {
      ok: false,
      message: "Enter a valid email to continue.",
    };
  }

  const updateData: Prisma.WaitlistSignupUpdateInput = {
    updatedAt: new Date(),
  };

  if (fieldOfWork) {
    updateData.fieldOfWork = fieldOfWork;
  }

  if (biggestPain) {
    updateData.biggestPain = biggestPain;
  }

  try {
    await prisma.waitlistSignup.upsert({
      where: { email },
      create: {
        email,
        fieldOfWork,
        biggestPain,
        source: "landing-page",
      },
      update: updateData,
    });

    return { ok: true };
  } catch (error) {
    console.error("Failed to submit waitlist signup", error);

    return {
      ok: false,
      message: "Something went wrong. Try again in a moment.",
    };
  }
}
