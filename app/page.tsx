"use client";

import { useState, useEffect } from "react";

/* ─── ICON HELPERS ─── */
function CheckIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8L6.5 11.5L13 4.5" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function XIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4 4L12 12M12 4L4 12" stroke={color} strokeWidth="1.75" strokeLinecap="round"/>
    </svg>
  );
}

function LinkIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5L7.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function DocIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="3" y="2" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 6h4M6 9h4M6 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function HistoryIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 5.5V8L9.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LockIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="3.5" y="7" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function InvoiceIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="2.5" y="1.5" width="11" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function RefreshIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M2.5 8a5.5 5.5 0 1011 0 5.5 5.5 0 00-5.5-5.5 5.5 5.5 0 00-4 1.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 2l-.5 2 2 .5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── NAV ─── */
function Nav() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#how",      label: "How it works" },
    { href: "#problem",  label: "The problem" },
    { href: "#features", label: "Features" },
    { href: "#pricing",  label: "Pricing" },
  ];

  const close = () => setOpen(false);

  return (
    <>
      <nav>
        <a href="#" className="nav-logo">
          <div className="nav-logo-mark">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7.5L5.5 11L12 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          Worklit
        </a>

        <ul className="nav-links">
          {links.map(l => (
            <li key={l.href}><a href={l.href}>{l.label}</a></li>
          ))}
          <li><a href="#pricing" className="nav-cta">Get early access</a></li>
        </ul>

        <button
          className={`nav-hamburger${open ? " open" : ""}`}
          aria-label="Toggle menu"
          onClick={() => setOpen(o => !o)}
        >
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div className={`nav-drawer${open ? " open" : ""}`}>
        {links.map(l => (
          <a key={l.href} href={l.href} onClick={close}>{l.label}</a>
        ))}
        <a href="#pricing" className="nav-drawer-cta" onClick={close}>Get early access</a>
      </div>
    </>
  );
}

/* ─── INTERACTIVE MOCKUP ─── */
const SCOPE_ITEMS = [
  { id: 1, name: "Brand Identity Design", desc: "Logo, colors, typography system", price: "$1,200", icon: "🎨" },
  { id: 2, name: "Website — 5 pages",     desc: "Responsive design + dev",         price: "$3,500", icon: "💻" },
  { id: 3, name: "Copywriting",           desc: "Home, About, Services, Contact",  price: "$800",   icon: "✍️" },
  { id: 4, name: "SEO Setup",             desc: "Technical audit + on-page",       price: "$600",   icon: "📈" },
];

type Status = "approved" | "rejected" | null;
type Statuses = Record<number, Status>;

function MockupItem({
  item,
  status,
  onApprove,
  onReject,
}: {
  item: typeof SCOPE_ITEMS[number];
  status: Status;
  onApprove: () => void;
  onReject: () => void;
}) {
  const isApproved = status === "approved";
  const isRejected = status === "rejected";

  return (
    <div className={`mockup-item${isApproved ? " approved" : isRejected ? " rejected" : ""}`}>
      <div className="mockup-item-icon">
        <span style={{ fontSize: 14 }}>{item.icon}</span>
      </div>
      <div className="mockup-item-text">
        <div className="mockup-item-name">{item.name}</div>
        <div className="mockup-item-desc">{item.desc}</div>
      </div>
      <div className="mockup-item-price">{item.price}</div>

      {status ? (
        <span className={`mockup-status-badge ${isApproved ? "approved-badge" : "rejected-badge"}`}>
          {isApproved
            ? <CheckIcon size={10} color="var(--green-dark)" />
            : <XIcon size={10} color="var(--text-soft)" />}
          {isApproved ? "Approved" : "Rejected"}
        </span>
      ) : (
        <div className="mockup-item-actions">
          <button className="mockup-btn approve" onClick={onApprove}>Approve</button>
          <button className="mockup-btn reject"  onClick={onReject}>Reject</button>
        </div>
      )}
    </div>
  );
}

function HeroMockup() {
  const [statuses, setStatuses] = useState<Statuses>({ 1: "approved", 2: null, 3: null, 4: null });
  const [submitted, setSubmitted] = useState(false);

  const setStatus = (id: number, val: Status) => setStatuses(s => ({ ...s, [id]: val }));
  const totalApproved = SCOPE_ITEMS
    .filter(i => statuses[i.id] === "approved")
    .reduce((sum, i) => sum + parseInt(i.price.replace(/[^0-9]/g, ""), 10), 0);

  if (submitted) {
    return (
      <div className="mockup-window" style={{ textAlign: "center", padding: "48px 32px" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <CheckIcon size={24} color="var(--green)" />
        </div>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--green-dark)", marginBottom: 8 }}>Scope approved</div>
        <div style={{ fontSize: 13, color: "var(--text-mid)", marginBottom: 24, lineHeight: 1.6 }}>
          Your client signed off on ${totalApproved.toLocaleString()} of work.<br />Invoice is ready.
        </div>
        <button
          className="btn-primary"
          style={{ margin: "0 auto" }}
          onClick={() => { setStatuses({ 1: "approved", 2: null, 3: null, 4: null }); setSubmitted(false); }}
        >
          Start over
        </button>
      </div>
    );
  }

  const allReviewed = SCOPE_ITEMS.every(i => statuses[i.id]);

  return (
    <div className="mockup-window">
      <div className="mockup-topbar">
        <div className="mockup-dot red"></div>
        <div className="mockup-dot yellow"></div>
        <div className="mockup-dot green"></div>
        <div className="mockup-url">worklit.app/review/acme-q2-rebrand</div>
      </div>
      <div className="mockup-body">
        <div className="mockup-header">
          <div>
            <div className="mockup-project">ACME Corp · Q2 2026</div>
            <div className="mockup-title">Website Rebrand</div>
          </div>
          <div>
            <div className="mockup-total-label">Approved so far</div>
            <div className="mockup-total-val">${totalApproved.toLocaleString()}</div>
          </div>
        </div>

        <div className="mockup-items">
          {SCOPE_ITEMS.map(item => (
            <MockupItem
              key={item.id}
              item={item}
              status={statuses[item.id]}
              onApprove={() => setStatus(item.id, "approved")}
              onReject={() => setStatus(item.id, "rejected")}
            />
          ))}
        </div>

        <div className="mockup-footer">
          <div className="mockup-sign-hint">
            {allReviewed
              ? "✓ All items reviewed"
              : `${SCOPE_ITEMS.filter(i => !statuses[i.id]).length} item(s) pending`}
          </div>
          <button
            className="mockup-submit"
            disabled={!allReviewed}
            style={{ opacity: allReviewed ? 1 : 0.4, cursor: allReviewed ? "pointer" : "default" }}
            onClick={() => allReviewed && setSubmitted(true)}
          >
            Sign & Submit
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── HERO ─── */
function Hero() {
  return (
    <div className="hero">
      <div className="hero-text">
        <div className="animate-in delay-1">
          <div className="hero-badge">
            <div className="hero-badge-dot"></div>
            Now in early access
          </div>
        </div>
        <h1 className="animate-in delay-2">
          Scope creep ends<br /><em>here.</em>
        </h1>
        <p className="hero-sub animate-in delay-3">
          Define deliverables, prices, and get explicit client sign-off in minutes. No back-and-forth, no disputes.
        </p>
        <div className="hero-actions animate-in delay-4">
          <a href="#pricing" className="btn-primary">
            Start for free
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#how" className="btn-secondary">
            See how it works
          </a>
        </div>
        <div className="hero-social-proof animate-in delay-5">
          <div className="hero-avatars">
            {["S", "M", "R", "A"].map((l, i) => (
              <div
                key={i}
                className="hero-avatar"
                style={{ background: `oklch(${90 - i * 4}% 0.012 ${70 + i * 18})` }}
              >
                {l}
              </div>
            ))}
          </div>
          <span>Trusted by 200+ freelancers</span>
        </div>
      </div>
      <div className="hero-mockup animate-in delay-3">
        <HeroMockup />
      </div>
    </div>
  );
}

/* ─── HOW IT WORKS ─── */
function HowItWorks() {
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

  return (
    <div className="how-wrapper" id="how">
      <div className="how-inner">
        <div className="section-label reveal">How it works</div>
        <h2 className="section-title reveal">Three steps from chaos to clarity.</h2>
        <p className="section-sub reveal">No setup, no onboarding session, no integrations required.</p>

        <div className="steps-grid reveal">
          {steps.map((s, i) => (
            <div key={i} className="step-card">
              <div className="step-number">{s.n}</div>
              <div className="step-icon" style={{ color: "var(--text-inv-mid)" }}>{s.icon}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── PROBLEM ─── */
function ProblemSection() {
  const beforeItems = [
    "Email threads nobody can find later",
    '"I thought that was included"',
    "Manual invoices assembled from memory",
    "Work completed before scope was agreed",
    "Clients pay less than quoted",
  ];
  const afterItems = [
    "Every item explicitly approved or rejected",
    "Signed record of what was agreed",
    "Invoice writes itself from approved items",
    "Work starts only after sign-off",
    "No surprises, no disputes",
  ];

  return (
    <section id="problem">
      <div className="section-label reveal">The problem</div>
      <h2 className="section-title reveal">Scope creep costs freelancers<br />thousands every year.</h2>
      <p className="section-sub reveal">It&apos;s not that clients are bad. It&apos;s that there&apos;s no clear record of what was agreed.</p>

      <div className="problem-grid reveal">
        <div className="problem-card before">
          <span className="problem-tag before">Before Worklit</span>
          <div className="problem-card-title">The old way</div>
          <div className="problem-items">
            {beforeItems.map((t, i) => (
              <div key={i} className="problem-item">
                <span className="problem-item-icon"><XIcon size={14} color="var(--text-soft)" /></span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="problem-card after">
          <span className="problem-tag after">After Worklit</span>
          <div className="problem-card-title">The Worklit way</div>
          <div className="problem-items">
            {afterItems.map((t, i) => (
              <div key={i} className="problem-item">
                <span className="problem-item-icon"><CheckIcon size={14} color="var(--green)" /></span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURES ─── */
function Features() {
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

  return (
    <section id="features" style={{ background: "var(--bg)" }}>
      <div className="section-label reveal">Features</div>
      <h2 className="section-title reveal">Built for the freelancer.<br />Not the enterprise.</h2>
      <p className="section-sub reveal">No feature bloat. Just what you need to protect your time and income.</p>

      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-card reveal" style={{ transitionDelay: `${i * 0.05}s` }}>
            <div className="feature-icon" style={{ color: "var(--green)" }}>{f.icon}</div>
            <div className="feature-title">{f.title}</div>
            <div className="feature-desc">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── PRICING ─── */
function Pricing() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setJoined(true);
  };

  return (
    <div className="pricing-wrapper" id="pricing">
      <div className="pricing-inner">
        <div className="pricing-text">
          <div className="section-label reveal">Pricing</div>
          <div className="pricing-title reveal">Simple, honest pricing.<br />No transaction fees. Ever.</div>
          <p className="pricing-sub reveal">
            We&apos;re finalizing pricing. Early access members lock in a founder rate.
            No commitments, no credit card required to start.
          </p>
          <div style={{ display: "flex", gap: "16px", marginTop: "28px", flexWrap: "wrap" }}>
            {["No transaction fees", "Cancel anytime", "Free to start"].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-mid)" }}>
                <CheckIcon size={13} color="var(--green)" />
                {t}
              </div>
            ))}
          </div>
        </div>

        <div className="pricing-cta reveal">
          {joined ? (
            <div style={{ textAlign: "center", padding: "32px", background: "var(--green-light)", borderRadius: "var(--radius-lg)", border: "1px solid var(--green-mid)" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "var(--green-dark)", marginBottom: 6 }}>You&apos;re on the list.</div>
              <div style={{ fontSize: 13, color: "var(--text-mid)" }}>We&apos;ll be in touch when early access opens.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", minWidth: 280 }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  padding: "13px 16px",
                  borderRadius: "var(--radius)",
                  border: "1.5px solid var(--border)",
                  font: "14px/1 var(--font-sans)",
                  color: "var(--text)",
                  background: "#fff",
                  outline: "none",
                  transition: "border-color 0.15s",
                  width: "100%",
                }}
                onFocus={e => (e.target.style.borderColor = "var(--green)")}
                onBlur={e => (e.target.style.borderColor = "var(--border)")}
              />
              <button type="submit" className="btn-waitlist">Get early access</button>
              <div className="pricing-note">No credit card. No spam.</div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#" className="footer-logo">
              <div className="nav-logo-mark">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7.5L5.5 11L12 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              Worklit
            </a>
            <p className="footer-tagline">Scope approval for freelancers who want to get paid for what they agreed to.</p>
            <p style={{ marginTop: 16, fontSize: 12, color: "oklch(42% 0.016 140)", fontStyle: "italic" }}>Built for freelancers, by freelancers.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <div className="footer-col-title">Product</div>
              <a href="#how">How it works</a>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Company</div>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
              <a href="#">Privacy</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Worklit. All rights reserved.</span>
          <span>worklit.app</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── PAGE ─── */
export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Nav />
      <Hero />
      <HowItWorks />
      <ProblemSection />
      <Features />
      <Pricing />
      <Footer />
    </>
  );
}
