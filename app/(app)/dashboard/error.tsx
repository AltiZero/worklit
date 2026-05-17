"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center py-24">
      <div className="bg-bg-card border border-border rounded-[var(--radius-lg)] p-10 max-w-[420px] text-center">
        <div className="w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center mx-auto mb-5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-soft)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        <div className="font-heading text-[22px] text-text mb-2 tracking-[-0.01em]">
          Couldn&apos;t load your dashboard
        </div>
        <p className="text-[14px] text-text-mid leading-[1.6] mb-6">
          Something went wrong while fetching your projects. This is on us — try again in a moment.
        </p>
        <button
          onClick={reset}
          className="min-h-[44px] rounded-[var(--radius)] border border-transparent bg-green px-6 py-[11px] text-[14px] font-medium leading-none text-white shadow-[0_1px_3px_oklch(20%_0.012_60_/_0.04)] transition-[background,transform,box-shadow] duration-[0.18s,0.16s,0.18s] hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(50%_0.13_152_/_0.28)] active:scale-[0.97]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
