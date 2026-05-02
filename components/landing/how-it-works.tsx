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
    <div className="how-wrapper" id="how">
      <div className="how-inner">
        <div className="section-label reveal">How it works</div>
        <h2 className="section-title reveal">Three steps from chaos to clarity.</h2>
        <p className="section-sub reveal">No setup, no onboarding session, no integrations required.</p>

        <div className="steps-grid reveal">
          {steps.map((step) => (
            <div key={step.n} className="step-card">
              <div className="step-number">{step.n}</div>
              <div className="step-icon" style={{ color: "var(--text-inv-mid)" }}>
                {step.icon}
              </div>
              <div className="step-title">{step.title}</div>
              <div className="step-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
