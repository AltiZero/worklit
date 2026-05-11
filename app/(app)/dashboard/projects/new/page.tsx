"use client";

import Link from "next/link";
import { useActionState } from "react";

import { createProject, type ProjectState } from "@/app/actions/projects";

const initialState: ProjectState = {};

export default function NewProjectPage() {
  const [state, formAction, pending] = useActionState(createProject, initialState);

  return (
    <div>
      <Link
        href="/dashboard"
        className="text-[13px] text-text-mid no-underline hover:text-text transition-colors duration-150 inline-flex items-center gap-1.5 mb-8 group"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform duration-150">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to dashboard
      </Link>

      <div className="mb-10">
        <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-green mb-5">
          New project
        </div>
        <h1 className="font-heading text-[clamp(32px,3.5vw,44px)] leading-[1.08] tracking-[-0.02em] text-text max-w-[480px]">
          What are you working on?
        </h1>
        <p className="text-[16px] text-text-mid leading-[1.6] mt-3 max-w-[440px]">
          Give it a name and tell us who the client is. You&apos;ll add deliverables next.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-[13px] font-semibold text-text tracking-[-0.01em]">
            Project title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            autoFocus
            placeholder="e.g. Q2 Website Redesign"
            className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-5 py-[15px] text-[16px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_oklch(48%_0.120_148_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
          />
        </div>

        <div className="h-px bg-border" />

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="clientName" className="text-[13px] font-semibold text-text tracking-[-0.01em]">
              Client name
            </label>
            <input
              id="clientName"
              name="clientName"
              type="text"
              required
              placeholder="e.g. ACME Corp"
              className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-5 py-[15px] text-[16px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_oklch(48%_0.120_148_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="clientEmail" className="text-[13px] font-semibold text-text tracking-[-0.01em]">
              Client email
            </label>
            <input
              id="clientEmail"
              name="clientEmail"
              type="email"
              required
              placeholder="client@example.com"
              className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-5 py-[15px] text-[16px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_oklch(48%_0.120_148_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
            />
          </div>
        </div>

        {state.message && (
          <p className="text-[14px] leading-[1.5] text-text-soft bg-bg-alt rounded-[var(--radius)] px-5 py-4 border border-border-mid flex items-start gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-px text-text-soft">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
            {state.message}
          </p>
        )}

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={pending}
            className="min-h-[48px] rounded-[var(--radius)] border border-transparent bg-green px-8 py-[15px] text-[16px] font-medium leading-none text-white shadow-[0_1px_3px_oklch(22%_0.014_60_/_0.12)] transition-[background,transform,box-shadow] duration-[0.18s,0.16s,0.18s] hover:-translate-y-px hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(48%_0.120_148_/_0.28)] active:scale-[0.97] disabled:bg-border-mid disabled:text-text-soft disabled:cursor-default disabled:hover:translate-y-0"
          >
            {pending ? "Creating..." : "Create project"}
          </button>
          <Link
            href="/dashboard"
            className="text-[15px] font-medium text-text-mid no-underline hover:text-text transition-colors duration-150"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
