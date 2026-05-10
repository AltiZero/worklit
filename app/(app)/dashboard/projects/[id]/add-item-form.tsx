"use client";

import { useActionState, useRef } from "react";

import { addScopeItem, type ScopeItemState } from "@/app/actions/scope-items";

const initialState: ScopeItemState = {};

export function AddItemForm({ projectId }: { projectId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    addScopeItem.bind(null, projectId),
    initialState,
  );

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await formAction(fd);
        formRef.current?.reset();
      }}
      className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-[22px]"
    >
      <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-green mb-4">
        Add deliverable
      </div>

      <div className="grid grid-cols-[1fr_1fr_120px] gap-3 items-end">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-[12px] font-medium text-text-mid">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. Brand Identity Design"
            className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[11px] text-[14px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(48%_0.120_148_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-[12px] font-medium text-text-mid">
            Description <span className="text-text-soft font-normal">(optional)</span>
          </label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder="e.g. Logo, colors, typography"
            className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[11px] text-[14px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(48%_0.120_148_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="price" className="text-[12px] font-medium text-text-mid">
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            required
            min="1"
            step="0.01"
            placeholder="1200"
            className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[11px] text-[14px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(48%_0.120_148_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
          />
        </div>
      </div>

      {state.message && (
        <p className="mt-3 text-[13px] leading-[1.5] text-text-soft bg-bg-alt rounded-[var(--radius)] px-4 py-3 border border-border-mid">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 min-h-[40px] rounded-[var(--radius)] border border-transparent bg-text text-bg-card px-5 py-[10px] text-[13px] font-medium leading-none cursor-pointer transition-[background,transform] duration-[0.15s,0.1s] hover:bg-green hover:text-white active:scale-[0.97] disabled:bg-border-mid disabled:text-text-soft disabled:cursor-default"
      >
        {pending ? "Adding..." : "Add item"}
      </button>
    </form>
  );
}
