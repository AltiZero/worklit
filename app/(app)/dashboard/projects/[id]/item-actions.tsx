"use client";

import { approveItem, rejectItem, deferItem } from "@/app/actions/scope-items";
import { CheckIcon } from "@/components/dashboard/icons";

export function ItemActions({ projectId, itemId, status }: { projectId: string; itemId: string; status: string }) {
  if (status === "APPROVED" || status === "REJECTED") return null;

  return (
    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
      <form action={approveItem.bind(null, projectId, itemId)}>
        <button
          type="submit"
          className="w-7 h-7 rounded-md bg-green-light border border-green-mid text-green-dark cursor-pointer flex items-center justify-center transition-[background,color,border-color,transform] duration-[0.12s] hover:bg-green hover:text-white hover:border-green active:scale-[0.97]"
          aria-label="Approve"
        >
          <CheckIcon size={12} />
        </button>
      </form>
      <form action={deferItem.bind(null, projectId, itemId)}>
        <button
          type="submit"
          className="w-7 h-7 rounded-md bg-bg-alt border border-border-mid text-text-soft cursor-pointer flex items-center justify-center transition-[background,color,border-color,transform] duration-[0.12s] hover:bg-[oklch(88%_0.006_90)] hover:text-text-mid active:scale-[0.97]"
          aria-label="Defer"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
        </button>
      </form>
      <form action={rejectItem.bind(null, projectId, itemId)}>
        <button
          type="submit"
          className="w-7 h-7 rounded-md bg-bg-alt border border-border-mid text-text-soft cursor-pointer flex items-center justify-center transition-[background,color,border-color,transform] duration-[0.12s] hover:bg-[oklch(88%_0.006_90)] hover:text-text-mid active:scale-[0.97]"
          aria-label="Reject"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </form>
    </div>
  );
}
