"use client";

import { ArrowUturnLeftIcon, ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { approveItem, rejectItem, deferItem, reopenItem } from "@/app/actions/scope-items";
import { CheckIcon } from "@/components/dashboard/icons";

export function ItemActions({ projectId, itemId, status }: { projectId: string; itemId: string; status: string }) {
  const isPending = status === "PENDING";
  const canReopen = status === "APPROVED" || status === "REJECTED" || status === "DEFERRED";

  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      {canReopen && (
        <form action={reopenItem.bind(null, projectId, itemId)}>
          <button
            type="submit"
            className="w-7 h-7 rounded-md bg-bg-alt border border-border-mid text-text-soft cursor-pointer flex items-center justify-center transition-[background,color,border-color,transform] duration-[0.12s] hover:bg-[oklch(88%_0.006_90)] hover:text-text-mid active:scale-[0.97]"
            aria-label="Restore to pending"
          >
            <ArrowUturnLeftIcon className="w-3.5 h-3.5 stroke-[1.8]" aria-hidden="true" />
          </button>
        </form>
      )}
      {status !== "APPROVED" && (
        <form action={approveItem.bind(null, projectId, itemId)}>
          <button
            type="submit"
            className="w-7 h-7 rounded-md bg-green-light border border-green-mid text-green-dark cursor-pointer flex items-center justify-center transition-[background,color,border-color,transform] duration-[0.12s] hover:bg-green hover:text-white hover:border-green active:scale-[0.97]"
            aria-label="Approve"
          >
            <CheckIcon size={12} />
          </button>
        </form>
      )}
      {isPending && (
        <form action={deferItem.bind(null, projectId, itemId)}>
          <button
            type="submit"
            className="w-7 h-7 rounded-md bg-bg-alt border border-border-mid text-text-soft cursor-pointer flex items-center justify-center transition-[background,color,border-color,transform] duration-[0.12s] hover:bg-[oklch(88%_0.006_90)] hover:text-text-mid active:scale-[0.97]"
            aria-label="Defer"
          >
            <ClockIcon className="w-3.5 h-3.5 stroke-[1.7]" aria-hidden="true" />
          </button>
        </form>
      )}
      {status !== "REJECTED" && (
        <form action={rejectItem.bind(null, projectId, itemId)}>
          <button
            type="submit"
            className="w-7 h-7 rounded-md bg-bg-alt border border-border-mid text-text-soft cursor-pointer flex items-center justify-center transition-[background,color,border-color,transform] duration-[0.12s] hover:bg-[oklch(88%_0.006_90)] hover:text-text-mid active:scale-[0.97]"
            aria-label="Reject"
          >
            <XMarkIcon className="w-3.5 h-3.5 stroke-2" aria-hidden="true" />
          </button>
        </form>
      )}
    </div>
  );
}
