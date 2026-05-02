"use client";

import { useState } from "react";

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
          {isApproved ? <CheckIcon size={10} color="var(--green-dark)" /> : <XIcon size={10} color="var(--text-soft)" />}
          {isApproved ? "Approved" : "Rejected"}
        </span>
      ) : (
        <div className="mockup-item-actions">
          <button className="mockup-btn approve" onClick={onApprove}>
            Approve
          </button>
          <button className="mockup-btn reject" onClick={onReject}>
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
      <div className="mockup-window" style={{ textAlign: "center", padding: "48px 32px" }}>
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
          className="btn-primary"
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

        <div className="mockup-footer">
          <div className="mockup-sign-hint">{allReviewed ? "✓ All items reviewed" : `${scopeItems.filter((item) => !statuses[item.id]).length} item(s) pending`}</div>
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
