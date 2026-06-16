import { z } from "zod";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const signUpSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const resetRequestSchema = z.object({
  email: z.email(),
});

export const updatePasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type AuthState = {
  message?: string;
  fieldErrors?: Record<string, string[]>;
};
