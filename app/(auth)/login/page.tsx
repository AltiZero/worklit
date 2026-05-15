"use client";

import Link from "next/link";
import { useActionState } from "react";

import { login, type AuthState } from "@/app/actions/auth";

const initialState: AuthState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <>
      <div className="mb-8">
        <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-green mb-4">
          Welcome back
        </div>
        <h1 className="font-heading text-[clamp(28px,3vw,36px)] leading-[1.12] tracking-[-0.02em] text-text">
          Log in to Worklit.
        </h1>
      </div>

      <form action={formAction} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-[13px] font-medium text-text-mid">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
            className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[13px] text-[15px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:ring-3 focus-visible:ring-[oklch(48%_0.120_148_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-[13px] font-medium text-text-mid">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Your password"
            className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[13px] text-[15px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:ring-3 focus-visible:ring-[oklch(48%_0.120_148_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
          />
        </div>

        {state.message && (
          <p className="text-[13px] leading-[1.5] text-text-soft bg-bg-alt rounded-[var(--radius)] px-4 py-3 border border-border-mid">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 min-h-[46px] w-full rounded-[var(--radius)] border border-transparent bg-green px-[26px] py-[13px] text-[15px] font-medium leading-none text-white shadow-[0_1px_3px_oklch(22%_0.014_60_/_0.12)] transition-[background,transform,box-shadow] duration-[0.18s,0.16s,0.18s] hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(48%_0.120_148_/_0.28)] active:scale-[0.97] disabled:bg-border-mid disabled:text-text-soft disabled:cursor-default"
        >
          {pending ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-text-soft">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-green font-medium hover:text-green-hover transition-colors duration-150">
          Sign up
        </Link>
      </p>
    </>
  );
}
