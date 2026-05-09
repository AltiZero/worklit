import { cn } from "@/lib/utils";

import { CheckIcon, HistoryIcon, InvoiceIcon, LinkIcon, LockIcon, RefreshIcon } from "./icons";

const features = [
  {
    icon: <LinkIcon size={18} />,
    title: "Magic link approvals",
    desc: "Your client gets a clean page with no login required. Click, review, decide. That's it.",
  },
  {
    icon: <CheckIcon size={18} />,
    title: "Per-item decisions",
    desc: "Approve, defer, or reject each line item individually. Granular clarity on exactly what's in scope.",
  },
  {
    icon: <HistoryIcon size={18} />,
    title: "Full decision log",
    desc: "Every action is timestamped and stored. Who approved what, and when. Immutable record.",
  },
  {
    icon: <LockIcon size={18} />,
    title: "Scope lock",
    desc: "Once approved, scope is locked. Changes go through a new approval flow — no silent edits.",
  },
  {
    icon: <InvoiceIcon size={18} />,
    title: "One-click PDF invoice",
    desc: "Approved items auto-populate a clean, professional invoice. No spreadsheet required.",
  },
  {
    icon: <RefreshIcon size={18} />,
    title: "Mid-project changes",
    desc: "Need to add or modify scope? Send a change request through the same simple flow.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-20 max-w-[1280px] mx-auto max-[960px]:py-16 max-[960px]:px-6" style={{ background: "var(--bg)" }}>
      <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-green mb-4 reveal">Features</div>
      <h2 className="font-heading text-[clamp(32px,3vw,48px)] leading-[1.12] tracking-[-0.02em] text-text max-w-[600px] reveal">
        Built for the freelancer.
        <br />
        Not the enterprise.
      </h2>
      <p className="text-[17px] text-text-mid leading-[1.6] max-w-[520px] mt-3 reveal">No feature bloat. Just what you need to protect your time and income.</p>

      <div className="grid grid-cols-3 gap-4 mt-14 max-[960px]:grid-cols-2 max-[600px]:grid-cols-1">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="reveal bg-bg-card border border-border rounded-[var(--radius-lg)] p-7 flex flex-col gap-3.5 transition-[opacity,transform,border-color,box-shadow] duration-[400ms,200ms,200ms,200ms] ease-out hover:border-green-mid hover:shadow-[var(--shadow-md)] hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-[10px] bg-green-light flex items-center justify-center" style={{ color: "var(--green)" }}>
              {feature.icon}
            </div>
            <div className="text-[15px] font-semibold text-text tracking-[-0.01em]">{feature.title}</div>
            <div className="text-[13px] leading-[1.6] text-text-mid">{feature.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
