"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ExclamationCircleIcon, SparklesIcon } from "@heroicons/react/16/solid";

import { createProject, type ProjectState } from "@/app/actions/projects";

const initialState: ProjectState = {};

export default function NewProjectPage() {
  const [state, formAction, pending] = useActionState(createProject, initialState);

  return (
    <div className="flex flex-col gap-7">
      {/* Hero */}
      <header className="flex flex-col gap-2.5 pt-1 max-w-[640px]">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-text-mid">
          <SparklesIcon className="w-3.5 h-3.5 text-text-soft" />
          New project
        </span>
        <h1 className="font-heading text-[clamp(34px,3.4vw,46px)] tracking-[-0.025em] leading-[1.04] text-text">
          What are you working on?
        </h1>
        <p className="text-[15px] text-text-mid mt-1 max-w-[52ch]">
          Give it a name and tell us who the client is. You&apos;ll add deliverables on the next step.
        </p>
      </header>

      <form
        action={formAction}
        className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[28px] max-w-[640px]"
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="title"
              className="text-[12.5px] font-medium text-text"
            >
              Project title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              autoFocus
              placeholder="e.g. Q2 Website Redesign"
              className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[13px] text-[14.5px] leading-[1.4] text-text outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_oklch(50%_0.13_152_/_0.10)] transition-[border-color,box-shadow] duration-150"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="clientName"
                className="text-[12.5px] font-medium text-text"
              >
                Client name
              </label>
              <input
                id="clientName"
                name="clientName"
                type="text"
                required
                placeholder="e.g. ACME Corp"
                className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[13px] text-[14.5px] leading-[1.4] text-text outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_oklch(50%_0.13_152_/_0.10)] transition-[border-color,box-shadow] duration-150"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="clientEmail"
                className="text-[12.5px] font-medium text-text"
              >
                Client email
              </label>
              <input
                id="clientEmail"
                name="clientEmail"
                type="email"
                required
                placeholder="client@example.com"
                className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[13px] text-[14.5px] leading-[1.4] text-text outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_oklch(50%_0.13_152_/_0.10)] transition-[border-color,box-shadow] duration-150"
              />
            </div>
          </div>

          {state.message && (
            <p className="text-[13px] leading-[1.5] text-text bg-bg-alt/60 rounded-[var(--radius)] px-4 py-3 border border-border flex items-start gap-2.5">
              <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0 mt-px text-text-mid" />
              <span>{state.message}</span>
            </p>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-border mt-2 pt-5">
            <Link
              href="/dashboard/projects"
              className="text-[13px] font-medium text-text-mid no-underline hover:text-text transition-colors duration-150 px-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={pending}
              className="bg-green text-white py-[11px] px-[20px] rounded-[var(--radius)] text-[13.5px] font-medium shadow-[var(--shadow-sm)] transition-[background,box-shadow] duration-200 hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97] disabled:bg-border-mid disabled:text-text-soft disabled:cursor-default disabled:shadow-none"
            >
              {pending ? "Creating..." : "Create project"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
