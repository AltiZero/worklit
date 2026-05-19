"use client";

import { useState, useTransition } from "react";
import { CheckIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

import { updateScopeItem, type ScopeItemState } from "@/app/actions/scope-items";
import { ItemActions } from "./item-actions";

type ScopeItemRowProps = {
  projectId: string;
  item: {
    id: string;
    title: string;
    description: string | null;
    price: number;
    status: string;
  };
  index: number;
  isLast: boolean;
};

const initialState: ScopeItemState = {};

function fmtMoney(n: number) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function ScopeStatusBadge({ status }: { status: string }) {
  if (status === "APPROVED") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium py-[3px] pl-1.5 pr-2 rounded-full bg-green-light text-green-dark border border-green-mid">
        <CheckIcon className="w-3 h-3 stroke-[2]" />
        Approved
      </span>
    );
  }
  if (status === "PENDING") {
    return (
      <span className="inline-flex items-center text-[11px] font-medium py-[3px] px-2 rounded-full bg-bg-alt text-text-mid border border-border-mid">
        Pending
      </span>
    );
  }
  const label = status === "REJECTED" ? "Rejected" : status === "DEFERRED" ? "Deferred" : status;
  return (
    <span className="inline-flex items-center text-[11px] font-medium py-[3px] px-2 rounded-full bg-bg-alt text-text-soft border border-border-mid opacity-55">
      {label}
    </span>
  );
}

export function ScopeItemRow({ projectId, item, index, isLast }: ScopeItemRowProps) {
  const [editing, setEditing] = useState(false);
  const [state, setState] = useState<ScopeItemState>(initialState);
  const [pending, startTransition] = useTransition();
  const isRejected = item.status === "REJECTED" || item.status === "DEFERRED";

  if (editing) {
    return (
      <form
        action={(formData) => {
          startTransition(async () => {
            const result = await updateScopeItem(projectId, item.id, initialState, formData);
            setState(result);
            if (result.success) setEditing(false);
          });
        }}
        className={`grid grid-cols-[32px_minmax(0,1fr)] gap-4 px-[22px] py-[18px] bg-bg-alt/35 max-[640px]:grid-cols-1 max-[640px]:gap-3 ${
          isLast ? "" : "border-b border-border"
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-bg-card text-text-mid flex items-center justify-center text-[12px] font-semibold flex-shrink-0 tabular-nums max-[640px]:hidden">
          {index + 1}
        </div>
        <div className="min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_140px] gap-3">
            <input
              name="title"
              required
              autoFocus
              defaultValue={item.title}
              aria-label="Item title"
              className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[11px] text-[14px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(50%_0.13_152_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
            />
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-text-soft pointer-events-none">$</span>
              <input
                name="price"
                type="number"
                required
                min="1"
                step="0.01"
                defaultValue={item.price.toFixed(2)}
                aria-label="Price in dollars"
                className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card pl-7 pr-4 py-[11px] text-[14px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(50%_0.13_152_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s] tabular-nums"
              />
            </div>
          </div>
          <input
            name="description"
            defaultValue={item.description ?? ""}
            aria-label="Description (optional)"
            placeholder="Description (optional)"
            className="mt-3 w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[11px] text-[14px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(50%_0.13_152_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
          />

          {state.message && (
            <p className="mt-3 text-[13px] leading-[1.5] text-text-soft bg-bg-card rounded-[var(--radius)] px-4 py-3 border border-border-mid">
              {state.message}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
            <ScopeStatusBadge status={item.status} />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={pending}
                className="bg-green text-white py-[9px] px-[16px] rounded-[var(--radius)] text-[13px] font-medium shadow-[var(--shadow-sm)] hover:bg-green-hover active:scale-[0.97] transition-[background,transform] duration-[0.15s,0.1s] disabled:bg-border-mid disabled:text-text-soft disabled:shadow-none disabled:cursor-default"
              >
                {pending ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  setState(initialState);
                  setEditing(false);
                }}
                className="text-[13px] font-medium text-text-mid bg-transparent border-none cursor-pointer hover:text-text transition-colors duration-150 disabled:cursor-default disabled:text-text-soft"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div
      className={`flex items-center gap-4 px-[22px] py-[15px] max-[640px]:flex-wrap max-[640px]:items-start max-[640px]:gap-x-3 max-[640px]:gap-y-2 ${
        isLast ? "" : "border-b border-border"
      }`}
    >
      <div className={`w-8 h-8 rounded-full bg-bg-alt text-text-mid flex items-center justify-center text-[12px] font-semibold flex-shrink-0 tabular-nums ${isRejected ? "opacity-55" : ""}`}>
        {index + 1}
      </div>
      <div className={`flex-1 min-w-0 max-[640px]:basis-[calc(100%-44px)] ${isRejected ? "opacity-55" : ""}`}>
        <div className="text-[14px] font-medium text-text truncate">{item.title}</div>
        {item.description && (
          <div className="text-[12px] text-text-soft mt-0.5 truncate">
            {item.description}
          </div>
        )}
      </div>
      <ScopeStatusBadge status={item.status} />
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          type="button"
          onClick={() => {
            setState(initialState);
            setEditing(true);
          }}
          className="w-7 h-7 rounded-md bg-bg-alt border border-border-mid text-text-soft cursor-pointer flex items-center justify-center transition-[background,color,border-color,transform] duration-[0.12s] hover:bg-[oklch(88%_0.006_90)] hover:text-text-mid active:scale-[0.97]"
          aria-label={`Edit ${item.title}`}
        >
          <PencilSquareIcon className="w-3.5 h-3.5 stroke-[1.8]" aria-hidden="true" />
        </button>
        <ItemActions projectId={projectId} itemId={item.id} status={item.status} />
      </div>
      <div className={`font-heading text-[16px] text-text leading-none tracking-[-0.01em] tabular-nums w-[90px] text-right flex-shrink-0 max-[640px]:ml-auto max-[640px]:w-auto ${isRejected ? "opacity-55" : ""}`}>
        {fmtMoney(item.price)}
      </div>
    </div>
  );
}
