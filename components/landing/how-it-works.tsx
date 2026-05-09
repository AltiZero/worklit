import { cn } from "@/lib/utils";

import { DocIcon, InvoiceIcon, LinkIcon } from "./icons";

const steps = [
  {
    n: "01",
    icon: <DocIcon size={20} />,
    title: "Define your scope",
    desc: "Add deliverables with titles, descriptions, and prices. Group related items, add notes, and set your terms. Takes five minutes.",
  },
  {
    n: "02",
    icon: <LinkIcon size={20} />,
    title: "Send a magic link",
    desc: "Share a clean approval page with your client. No account, no login, no friction. They click, review, and decide on each item.",
  },
  {
    n: "03",
    icon: <InvoiceIcon size={20} />,
    title: "Get paid for what was agreed",
    desc: "Approved items auto-populate a PDF invoice in one click. Every decision is logged. No disputes, no forgotten scope.",
  },
];

export function HowItWorks() {
  return (
    <div className="bg-bg-dark max-w-full mx-0 p-0" id="how">
      <div className="max-w-[1280px] mx-auto py-24 px-20 max-[960px]:py-16 max-[960px]:px-6">
        <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-text-inv-mid mb-4 reveal">How it works</div>
        <h2 className="font-heading text-[clamp(32px,3vw,48px)] leading-[1.12] tracking-[-0.02em] text-text-inv max-w-[600px] reveal">Three steps from chaos to clarity.</h2>
        <p className="text-[17px] text-[oklch(68%_0.010_90)] leading-[1.6] max-w-[520px] mt-3 reveal">No setup, no onboarding session, no integrations required.</p>

        <div className="grid grid-cols-3 gap-px mt-14 bg-border-dark rounded-[var(--radius-lg)] overflow-hidden border border-border-dark max-[960px]:grid-cols-1 reveal">
          {steps.map((step) => (
            <div key={step.n} className="bg-bg-dark py-10 px-9 flex flex-col gap-5 transition-colors duration-200 hover:bg-[oklch(26%_0.020_148)]">
              <div className="font-heading text-5xl text-[oklch(34%_0.025_148)] leading-none">{step.n}</div>
              <div className="w-11 h-11 rounded-xl bg-[oklch(30%_0.030_148)] flex items-center justify-center" style={{ color: "var(--text-inv-mid)" }}>
                {step.icon}
              </div>
              <div className="text-lg font-semibold text-text-inv tracking-[-0.01em]">{step.title}</div>
              <div className="text-sm leading-[1.65] text-[oklch(65%_0.012_120)]">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
