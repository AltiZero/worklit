"use client";

import { useActionState, useRef, useState } from "react";

import { addScopeItem, type ScopeItemState } from "@/app/actions/scope-items";
import { cn } from "@/lib/utils";

const initialState: ScopeItemState = {};

export function AddItemForm({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    addScopeItem.bind(null, projectId),
    initialState,
  );

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full bg-bg-card border border-dashed border-border rounded-[var(--radius-lg)] p-5 flex items-center justify-center gap-2 text-[14px] font-medium text-text-mid bg-transparent cursor-pointer transition-[border-color,color,background] duration-[0.15s] hover:border-green-mid hover:text-green hover:bg-green-light/20"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add deliverable
        </button>
      ) : (
        <form
          ref={formRef}
          action={async (fd) => {
            await formAction(fd);
            formRef.current?.reset();
            setOpen(false);
          }}
          className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-5 animate-[itemEnter_200ms_ease-out]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-green">
              New deliverable
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-6 h-6 rounded-md bg-bg-alt border-none cursor-pointer flex items-center justify-center text-text-soft hover:text-text hover:bg-border transition-[background,color] duration-[0.12s]"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <input
              id="scope-title"
              name="title"
              type="text"
              required
              autoFocus
              aria-label="Item title"
              placeholder="Item title, e.g. Brand Identity Design"
              className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[11px] text-[14px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(50%_0.13_152_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
            />
            <div className="grid grid-cols-[1fr_120px] gap-3">
              <input
                id="scope-description"
                name="description"
                type="text"
                aria-label="Description (optional)"
                placeholder="Description (optional)"
                className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[11px] text-[14px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(50%_0.13_152_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
              />
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-text-soft">$</span>
                <input
                  id="scope-price"
                  name="price"
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  aria-label="Price in dollars"
                  placeholder="1200"
                  className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card pl-7 pr-4 py-[11px] text-[14px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(50%_0.13_152_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
                />
              </div>
            </div>
          </div>

          {state.message && (
            <p className="mt-3 text-[13px] leading-[1.5] text-text-soft bg-bg-alt rounded-[var(--radius)] px-4 py-3 border border-border-mid">
              {state.message}
            </p>
          )}

          <div className="flex items-center gap-2 mt-4">
            <button
              type="submit"
              disabled={pending}
              className="min-h-[40px] rounded-[var(--radius)] border border-transparent bg-green px-5 py-[10px] text-[13px] font-medium leading-none text-white cursor-pointer shadow-[0_1px_3px_oklch(20%_0.012_60_/_0.04)] transition-[background,transform,box-shadow] duration-[0.18s,0.16s,0.18s] hover:-translate-y-px hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97] disabled:bg-border-mid disabled:text-text-soft disabled:cursor-default disabled:hover:translate-y-0"
            >
              {pending ? "Adding..." : "Add item"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[13px] font-medium text-text-mid bg-transparent border-none cursor-pointer hover:text-text transition-colors duration-[0.15s]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
