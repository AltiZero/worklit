"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { CheckIcon, XIcon } from "./icons";

const scopeItems = [
  { id: 1, name: "Brand Identity Design", desc: "Logo, colors, typography system", price: "$1,200", icon: "🎨" },
  { id: 2, name: "Website — 5 pages", desc: "Responsive design + dev", price: "$3,500", icon: "💻" },
  { id: 3, name: "Copywriting", desc: "Home, About, Services, Contact", price: "$800", icon: "✍️" },
  { id: 4, name: "SEO Setup", desc: "Technical audit + on-page", price: "$600", icon: "📈" },
];

type Status = "approved" | "rejected" | null;
type Statuses = Record<number, Status>;

function MockupItem({
  item,
  status,
  onApprove,
  onReject,
}: {
  item: (typeof scopeItems)[number];
  status: Status;
  onApprove: () => void;
  onReject: () => void;
}) {
  const isApproved = status === "approved";
  const isRejected = status === "rejected";

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-[14px] px-4 border-[1.5px] border-border rounded-[var(--radius)] bg-bg-card transition-[border-color,background] duration-200 cursor-default overflow-hidden",
        isApproved && "border-green-mid bg-green-light",
        isRejected && "border-border-mid bg-bg-alt opacity-55",
      )}
    >
      <div className="w-8 h-8 rounded-lg bg-bg-alt border border-border flex-shrink-0 flex items-center justify-center">
        <span style={{ fontSize: 14 }}>{item.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-text whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</div>
        <div className="text-[11px] text-text-soft mt-px whitespace-nowrap overflow-hidden text-ellipsis">{item.desc}</div>
      </div>
      <div className="text-[13px] font-semibold text-text flex-shrink-0">{item.price}</div>

      {status ? (
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[11px] font-medium py-[3px] px-2 rounded-full flex-shrink-0",
            isApproved && "bg-green-light text-green-dark border border-green-mid",
            isRejected && "bg-bg-alt text-text-soft border border-border-mid",
          )}
        >
          {isApproved ? <CheckIcon size={10} color="var(--green-dark)" /> : <XIcon size={10} color="var(--text-soft)" />}
          {isApproved ? "Approved" : "Rejected"}
        </span>
      ) : (
        <div className="flex gap-1 flex-shrink-0">
          <button
            className="py-1 px-2.5 rounded-md text-[11px] font-medium border-none cursor-pointer font-sans transition-[background,color,border-color,transform] duration-150 ease-out bg-green-light text-green-dark border border-green-mid hover:bg-green hover:text-white hover:border-transparent active:scale-[0.97]"
            onClick={onApprove}
          >
            Approve
          </button>
          <button
            className="py-1 px-2.5 rounded-md text-[11px] font-medium border-none cursor-pointer font-sans transition-[background,color,border-color,transform] duration-150 ease-out bg-bg-alt text-text-soft border border-border-mid hover:bg-[oklch(92%_0.008_70)] hover:text-text-mid hover:border-[oklch(78%_0.008_70)] active:scale-[0.97]"
            onClick={onReject}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}

export function HeroMockup() {
  const [statuses, setStatuses] = useState<Statuses>({ 1: "approved", 2: null, 3: null, 4: null });
  const [submitted, setSubmitted] = useState(false);

  const setStatus = (id: number, value: Status) => setStatuses((current) => ({ ...current, [id]: value }));
  const totalApproved = scopeItems
    .filter((item) => statuses[item.id] === "approved")
    .reduce((sum, item) => sum + parseInt(item.price.replace(/[^0-9]/g, ""), 10), 0);

  if (submitted) {
    return (
      <div className="w-full max-w-[520px] bg-bg-card rounded-[var(--radius-lg)] border border-border shadow-[var(--shadow-lg)] overflow-hidden" style={{ textAlign: "center", padding: "48px 32px" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "var(--green-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <CheckIcon size={24} color="var(--green)" />
        </div>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--green-dark)", marginBottom: 8 }}>Scope approved</div>
        <div style={{ fontSize: 13, color: "var(--text-mid)", marginBottom: 24, lineHeight: 1.6 }}>
          Your client signed off on ${totalApproved.toLocaleString()} of work.
          <br />
          Invoice is ready.
        </div>
        <button
          className="bg-green text-white py-[13px] px-[26px] rounded-[var(--radius)] font-sans text-[15px] font-medium border-none cursor-pointer no-underline transition-[background,transform,box-shadow] duration-[0.18s,0.16s,0.18s] inline-flex items-center gap-2 shadow-[0_1px_3px_oklch(22%_0.014_60_/_0.12)] hover:bg-green-hover hover:-translate-y-px hover:shadow-[0_4px_12px_oklch(48%_0.120_148_/_0.28)] active:scale-[0.97]"
          style={{ margin: "0 auto" }}
          onClick={() => {
            setStatuses({ 1: "approved", 2: null, 3: null, 4: null });
            setSubmitted(false);
          }}
        >
          Start over
        </button>
      </div>
    );
  }

  const allReviewed = scopeItems.every((item) => statuses[item.id]);

  return (
    <div className="w-full max-w-[520px] bg-bg-card rounded-[var(--radius-lg)] border border-border shadow-[var(--shadow-lg)] overflow-hidden">
      <div className="flex items-center py-[14px] px-5 bg-bg-alt border-b border-border gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff6159]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28ca41]" />
        <div className="flex-1 bg-bg-card border border-border rounded-md py-[5px] px-3 text-[11px] text-text-soft text-center tracking-[-0.01em]">worklit.app/review/acme-q2-rebrand</div>
      </div>
      <div className="py-6 px-6 pb-7">
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="text-[13px] text-text-soft mb-0.5">ACME Corp · Q2 2026</div>
            <div className="font-heading text-xl text-text tracking-[-0.01em]">Website Rebrand</div>
          </div>
          <div>
            <div className="text-[11px] text-text-soft text-right mb-0.5">Approved so far</div>
            <div className="text-[22px] font-semibold text-text text-right">${totalApproved.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {scopeItems.map((item) => (
            <MockupItem
              key={item.id}
              item={item}
              status={statuses[item.id]}
              onApprove={() => setStatus(item.id, "approved")}
              onReject={() => setStatus(item.id, "rejected")}
            />
          ))}
        </div>

        <div className="mt-5 flex justify-between items-center">
          <div className="text-[11px] text-text-soft">
            {allReviewed ? "✓ All items reviewed" : `${scopeItems.filter((item) => !statuses[item.id]).length} item(s) pending`}
          </div>
          <button
            className="bg-text text-bg-card py-[9px] px-[18px] rounded-lg text-xs font-medium font-sans border-none cursor-pointer transition-[background,transform] duration-[0.18s,0.16s] hover:bg-green active:scale-[0.97] disabled:bg-border-mid disabled:text-text-soft disabled:cursor-default"
            disabled={!allReviewed}
            onClick={() => allReviewed && setSubmitted(true)}
          >
            Sign & Submit
          </button>
        </div>
      </div>
    </div>
  );
}
