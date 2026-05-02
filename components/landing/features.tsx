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
    <section id="features" style={{ background: "var(--bg)" }}>
      <div className="section-label reveal">Features</div>
      <h2 className="section-title reveal">
        Built for the freelancer.
        <br />
        Not the enterprise.
      </h2>
      <p className="section-sub reveal">No feature bloat. Just what you need to protect your time and income.</p>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={feature.title} className="feature-card reveal" style={{ transitionDelay: `${index * 0.05}s` }}>
            <div className="feature-icon" style={{ color: "var(--green)" }}>
              {feature.icon}
            </div>
            <div className="feature-title">{feature.title}</div>
            <div className="feature-desc">{feature.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
