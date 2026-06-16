"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Provider } from "@supabase/supabase-js";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import {
  type AuthState,
  resetRequestSchema,
  signInSchema,
  signUpSchema,
  updatePasswordSchema,
} from "@/lib/auth-schemas";

export type { AuthState };

async function getOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

function fieldErrorsFrom(error: z.ZodError): Record<string, string[]> {
  const flat = z.flattenError(error);
  const fieldErrors = flat.fieldErrors as Record<string, string[] | undefined>;
  const out: Record<string, string[]> = {};
  for (const k in fieldErrors) {
    const v = fieldErrors[k];
    if (v && v.length) out[k] = v;
  }
  return out;
}

export async function signup(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      message: "Please check the form and try again",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const supabase = await createClient();
  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    const msg = /already/i.test(error.message)
      ? "An account with that email already exists"
      : error.message;
    return { message: msg };
  }

  // If Supabase email-confirmation is ON, signUp returns no session.
  // Show a check-your-email message instead of bouncing to /dashboard.
  if (!data.session) {
    return { message: "Check your email to confirm your account." };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { message: "Invalid email or password" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { message: "Invalid email or password" };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}

async function signInWithProvider(provider: Provider) {
  const supabase = await createClient();
  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data.url) {
    redirect("/login?error=oauth_init");
  }

  redirect(data.url);
}

export async function signInWithGoogle() {
  await signInWithProvider("google");
}

export async function signInWithGithub() {
  await signInWithProvider("github");
}

export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = resetRequestSchema.safeParse({
    email: formData.get("email"),
  });

  // Always return success to prevent user-enumeration.
  if (!parsed.success) {
    return { message: "If that email is registered, a reset link is on its way." };
  }

  const supabase = await createClient();
  const origin = await getOrigin();

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/callback?type=recovery`,
  });

  return { message: "If that email is registered, a reset link is on its way." };
}

export async function updatePassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = updatePasswordSchema.safeParse({
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      message: "Please check the form and try again",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "Your recovery link has expired. Request a new one." };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { message: "Could not update password. Please try again." };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
