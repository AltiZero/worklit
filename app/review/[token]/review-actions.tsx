"use client";

import { useState } from "react";

import { clientApproveItem, clientRejectItem, clientSubmitReview } from "@/app/actions/client-review";

export function ItemButtons({
  token,
  itemId,
  status,
  isSubmitted,
}: {
  token: string;
  itemId: string;
  status: string;
  isSubmitted: boolean;
}) {
  if (status === "APPROVED" || status === "REJECTED" || isSubmitted) {
    const isApproved = status === "APPROVED";
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-medium py-[3px] px-2 rounded-full border flex-shrink-0 ${
        isApproved
          ? "bg-green-light text-green-dark border-green-mid"
          : "bg-bg-alt text-text-soft border-border-mid"
      }`}>
        {isApproved ? "Approved" : status === "REJECTED" ? "Rejected" : "Pending"}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <form action={clientApproveItem.bind(null, token, itemId)}>
        <button
          type="submit"
          className="w-7 h-7 rounded-md bg-green-light border border-green-mid text-green-dark cursor-pointer flex items-center justify-center transition-all duration-[0.12s] hover:bg-green hover:text-white hover:border-green active:scale-[0.97]"
          aria-label="Approve"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
        </button>
      </form>
      <form action={clientRejectItem.bind(null, token, itemId)}>
        <button
          type="submit"
          className="w-7 h-7 rounded-md bg-bg-alt border border-border-mid text-text-soft cursor-pointer flex items-center justify-center transition-all duration-[0.12s] hover:bg-[oklch(88%_0.006_90)] hover:text-text-mid active:scale-[0.97]"
          aria-label="Reject"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </form>
    </div>
  );
}

export function SubmitSection({ token, initialSubmitted = false }: { token: string; initialSubmitted?: boolean }) {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(initialSubmitted);

  if (submitted) {
    return (
      <div className="bg-green-light/40 border border-green-mid rounded-[var(--radius)] px-5 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-mid flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
        </div>
        <div>
          <div className="font-heading text-[14px] text-green-dark">Review submitted.</div>
          <div className="text-[12px] text-text-mid mt-0.5">The review has been recorded.</div>
        </div>
      </div>
    );
  }

  return (
    <form
      action={async () => {
        await clientSubmitReview(token, name);
        setSubmitted(true);
      }}
      className="flex items-end gap-3"
    >
      <div className="flex-1">
        <label htmlFor="client-name" className="text-[12px] font-medium text-text-mid block mb-1">Your name</label>
        <input
          id="client-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[11px] text-[14px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:shadow-[0_0_0_3px_oklch(50%_0.13_152_/_0.10)] transition-[border-color,box-shadow] duration-[0.18s]"
        />
      </div>
      <button
        type="submit"
        className="min-h-[44px] rounded-[var(--radius)] border border-transparent bg-green px-6 py-[11px] text-[14px] font-medium leading-none text-white cursor-pointer whitespace-nowrap shadow-[0_1px_3px_oklch(20%_0.012_60_/_0.04)] transition-[background,transform,box-shadow] duration-[0.18s,0.16s,0.18s] hover:-translate-y-px hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97]"
      >
        Sign & Submit
      </button>
    </form>
  );
}
